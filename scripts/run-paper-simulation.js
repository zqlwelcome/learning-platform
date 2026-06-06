#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dailyDataPath = path.join(root, 'daily-data.js');
const hotNewsPath = path.join(root, 'data', 'hot-news.json');
const outputPath = path.join(root, 'data', 'paper-trades.json');
const storageKey = 'paper_trade_signals_v1';

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return fallback;
    }
}

function buildSandbox(existingTrades) {
    const storage = {
        [storageKey]: JSON.stringify(existingTrades || [])
    };

    return {
        console,
        fetch,
        setTimeout,
        clearTimeout,
        window: { addEventListener() {} },
        document: {
            addEventListener() {},
            getElementById() { return null; },
            querySelector() { return null; },
            querySelectorAll() { return []; }
        },
        localStorage: {
            getItem(key) { return storage[key] || null; },
            setItem(key, value) { storage[key] = String(value); },
            removeItem(key) { delete storage[key]; }
        },
        XMLHttpRequest: function XMLHttpRequest() {}
    };
}

function getJsonFromStorage(sandbox, key, fallback) {
    try {
        return JSON.parse(sandbox.localStorage.getItem(key) || 'null') || fallback;
    } catch (error) {
        return fallback;
    }
}

async function main() {
    const previous = readJson(outputPath, { trades: [] });
    const hotNews = readJson(hotNewsPath, { news: [] }).news || [];
    const sandbox = buildSandbox(previous.trades || []);

    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(dailyDataPath, 'utf8'), sandbox, { filename: dailyDataPath });

    const quoteMap = await sandbox.loadTradeQuoteMap();
    const macro = sandbox.assessTradeMacroRegime(hotNews);
    const candidates = sandbox.getPaperTradeCandidates(hotNews, quoteMap, macro);
    const trades = sandbox.updatePaperTrades(candidates, quoteMap, macro);
    const phaseStats = sandbox.getPaperPhaseStats(trades);
    const portfolio = sandbox.getPaperPortfolioStats(trades);

    const effectiveTrades = trades.filter(trade => trade.status !== '重复剔除');
    const activeTrades = trades.filter(sandbox.isPaperTradeActive);
    const closedTrades = trades.filter(sandbox.isPaperTradeClosed);
    const wins = closedTrades.filter(trade => Number(trade.finalPnlPct ?? trade.pnlPct) > 0).length;
    const waitingCount = trades.filter(trade => trade.status === '仓位等待').length;
    const excludedCount = trades.filter(trade => trade.status === '重复剔除').length;

    const output = {
        version: 1,
        mode: 'cloud-paper-simulator',
        updateTime: new Date().toISOString(),
        macro,
        candidates: candidates.map(item => ({
            symbol: item.symbol,
            code: item.code,
            name: item.name,
            market: item.market,
            kind: item.kind,
            eventType: item.eventType,
            score: item.score,
            confirmationScore: item.confirmationScore,
            confirmationReasons: item.confirmationReasons,
            entryFactors: item.entryFactors,
            allocationPct: item.allocationPct,
            portfolioCap: item.portfolioCap,
            riskMode: item.riskMode,
            allocationReason: item.allocationReason,
            actionPlan: item.actionPlan
        })),
        stats: {
            sampleCount: effectiveTrades.length,
            rawSampleCount: trades.length,
            activeCount: activeTrades.length,
            closedCount: closedTrades.length,
            waitingCount,
            excludedCount,
            reviewedCount: closedTrades.length,
            winRate: closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : null,
            avgPnl: closedTrades.length ? closedTrades.reduce((sum, trade) => sum + Number(trade.finalPnlPct ?? trade.pnlPct ?? 0), 0) / closedTrades.length : null,
            equity: portfolio.equity,
            exposurePct: portfolio.exposurePct,
            portfolioCap: sandbox.getPaperPortfolioCap(macro),
            riskMode: sandbox.getPaperRiskMode(macro),
            alerts: portfolio.alerts
        },
        phaseStats,
        trades,
        note: '纸面模拟盘自动记录模型信号，不构成真实投资建议。'
    };

    fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    const storedTrades = getJsonFromStorage(sandbox, storageKey, []);
    console.log(`paper simulator updated: ${storedTrades.length} trades, ${candidates.length} candidates`);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
