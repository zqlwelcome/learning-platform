#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dailyDataPath = path.join(root, 'daily-data.js');
const liveHotNewsPath = path.join(root, 'data', 'live-hot-news.json');
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

function readHotNews() {
    const live = readJson(liveHotNewsPath, null);
    if (live && Array.isArray(live.news) && live.news.length > 0) {
        return { source: 'live-hot-news.json', news: live.news };
    }
    const fallback = readJson(hotNewsPath, { news: [] });
    return { source: 'hot-news.json', news: fallback.news || [] };
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

function isPaperTradingDay(dateText) {
    const day = new Date(`${dateText}T12:00:00+08:00`).getDay();
    return day >= 1 && day <= 5;
}

function removeWeekendEntryTrades(trades) {
    return (trades || []).filter((trade) => !trade.entryDate || isPaperTradingDay(trade.entryDate));
}

function getTargetMetaMap(sandbox) {
    try {
        return new Map((sandbox.getTradeCandidateUniverse() || []).map((target) => [target.symbol, target]));
    } catch (error) {
        return new Map();
    }
}

function hasAnyTheme(item, themes) {
    return themes.some((theme) => (item.themes || []).includes(theme));
}

function getAssetBucket(item) {
    if (hasAnyTheme(item, ['oil', 'energy', 'gold'])) return '商品与避险';
    if (hasAnyTheme(item, ['cash', 'bond'])) return '防御资产';
    if (hasAnyTheme(item, ['ai', 'semiconductor', 'us-growth', 'software', 'infrastructure'])) return '科技成长';
    if (hasAnyTheme(item, ['china-beta', 'hk-beta', 'hk-tech', 'a-tech', 'china-tech', 'consumer', 'broker', 'a-financial'])) return '中国资产';
    if (hasAnyTheme(item, ['broad-us', 'quality'])) return '美股核心';
    return '其他';
}

function getCandidateThreshold(candidate) {
    let threshold = candidate.kind === 'Stock' ? 88 : 66;
    if (candidate.eventType === '供需/地缘') {
        threshold += hasAnyTheme(candidate, ['oil', 'energy', 'gold']) ? 16 : 8;
    }
    if (candidate.eventType === '宏观类') threshold += 4;
    if (candidate.riskMode === '防御' && hasAnyTheme(candidate, ['ai', 'semiconductor', 'us-growth', 'hk-tech', 'a-tech'])) {
        threshold += 6;
    }
    return threshold;
}

function passesCandidateQuality(candidate) {
    const factors = candidate.entryFactors || {};
    if (candidate.eventType === '供需/地缘' && hasAnyTheme(candidate, ['oil', 'energy', 'gold'])) {
        return Number(candidate.confirmationScore || 0) >= 84 &&
            Number(factors.price || 0) >= 12 &&
            Number(factors.flow || 0) >= 16 &&
            Number(factors.risk || 0) >= 14;
    }
    return Number(candidate.confirmationScore || 0) >= getCandidateThreshold(candidate);
}

function daysBetween(start, end) {
    return Math.max(0, Math.floor((new Date(end) - new Date(start)) / 86400000));
}

function hasRecentSymbolTrade(trades, symbol, today, cooldownDays = 15) {
    return (trades || []).some((trade) =>
        trade.symbol === symbol &&
        trade.status !== '重复剔除' &&
        trade.entryDate &&
        daysBetween(trade.entryDate, today) < cooldownDays
    );
}

function getChinaDate() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

function strengthenCandidates(candidates, sandbox, existingTrades) {
    const metaMap = getTargetMetaMap(sandbox);
    const symbolSeen = new Set();
    const eventCounts = new Map();
    const today = getChinaDate();

    return (candidates || [])
        .map((candidate) => ({
            ...candidate,
            themes: metaMap.get(candidate.symbol)?.themes || candidate.themes || []
        }))
        .map((candidate) => ({
            ...candidate,
            assetBucket: getAssetBucket(candidate)
        }))
        .filter(passesCandidateQuality)
        .filter((candidate) => !hasRecentSymbolTrade(existingTrades, candidate.symbol, today, 15))
        .filter((candidate) => {
            if (symbolSeen.has(candidate.symbol)) return false;
            const maxPerEvent = candidate.eventType === '供需/地缘' ? 1 : 2;
            const current = eventCounts.get(candidate.eventType) || 0;
            if (current >= maxPerEvent) return false;
            symbolSeen.add(candidate.symbol);
            eventCounts.set(candidate.eventType, current + 1);
            return true;
        })
        .slice(0, 6);
}

function pruneDuplicateNoise(trades) {
    const duplicates = [];
    const clean = [];
    (trades || []).forEach((trade) => {
        if (trade.status === '重复剔除') duplicates.push(trade);
        else clean.push(trade);
    });
    return clean.concat(duplicates.slice(0, 8));
}

function addAssetBuckets(trades, sandbox) {
    const metaMap = getTargetMetaMap(sandbox);
    return (trades || []).map((trade) => {
        const themes = metaMap.get(trade.symbol)?.themes || trade.themes || [];
        return {
            ...trade,
            themes,
            assetBucket: trade.assetBucket || getAssetBucket({ ...trade, themes })
        };
    });
}

function getBenchmarkComparison(trades, portfolio) {
    const effective = (trades || []).filter((trade) => trade.status !== '重复剔除');
    const latestBySymbol = new Map();
    effective.forEach((trade) => {
        if (!latestBySymbol.has(trade.symbol)) latestBySymbol.set(trade.symbol, trade);
    });
    const refs = [
        ['usSPY', '标普500ETF SPY'],
        ['usQQQ', '纳指100ETF QQQ'],
        ['usGLD', '黄金ETF GLD'],
        ['sh510300', '沪深300ETF 510300']
    ].map(([symbol, label]) => {
        const trade = latestBySymbol.get(symbol);
        return {
            symbol,
            label,
            samplePnlPct: typeof trade?.pnlPct === 'number' ? Number(trade.pnlPct.toFixed(2)) : null,
            entryDate: trade?.entryDate || null
        };
    });
    const available = refs.map((item) => item.samplePnlPct).filter((value) => typeof value === 'number');
    const benchmarkAvgPct = available.length
        ? Number((available.reduce((sum, value) => sum + value, 0) / available.length).toFixed(2))
        : null;
    const modelReturnPct = Number((((portfolio.equity || 100000) - 100000) / 100000 * 100).toFixed(2));
    return {
        modelReturnPct,
        benchmarkAvgPct,
        relativePct: benchmarkAvgPct === null ? null : Number((modelReturnPct - benchmarkAvgPct).toFixed(2)),
        quality: available.length >= 3 ? 'sample-based' : 'thin-sample',
        strictHistoryStatus: 'pending-historical-price-ingestion',
        refs,
        note: '当前基准来自模拟盘内代表ETF样本，已可做方向参考；严格版仍需稳定历史行情源记录每个入场日的基准价格。'
    };
}

function getRoundTripCostPct(trade) {
    if (trade.kind === 'Stock') return 0.35;
    if (trade.kind === 'ETF') return 0.2;
    return 0.25;
}

function getCostAdjustedStats(trades, portfolio) {
    const effective = (trades || []).filter((trade) => trade.status !== '重复剔除');
    const marked = effective
        .filter((trade) => typeof trade.pnlPct === 'number')
        .map((trade) => {
            const roundTripCostPct = getRoundTripCostPct(trade);
            return {
                symbol: trade.symbol,
                name: trade.name,
                status: trade.status,
                grossPnlPct: Number(trade.pnlPct.toFixed(2)),
                roundTripCostPct,
                netPnlPct: Number((trade.pnlPct - roundTripCostPct).toFixed(2))
            };
        });

    const avgNetPnlPct = marked.length
        ? Number((marked.reduce((sum, trade) => sum + trade.netPnlPct, 0) / marked.length).toFixed(2))
        : null;
    const estimatedTotalCost = effective.reduce((sum, trade) => {
        const positionValue = Number(trade.entryValue || trade.currentValue || 0);
        return sum + positionValue * (getRoundTripCostPct(trade) / 100);
    }, 0);

    return {
        modelReturnPctAfterCost: Number((((portfolio.equity - estimatedTotalCost - 100000) / 100000) * 100).toFixed(2)),
        avgNetPnlPct,
        estimatedTotalCost: Number(estimatedTotalCost.toFixed(2)),
        assumptions: {
            ETF: '估算单次完整买卖成本/滑点 0.20%',
            Stock: '估算单次完整买卖成本/滑点 0.35%',
            note: '用于惩罚过度交易和纸面收益，不代表真实成交费用。'
        },
        samples: marked.slice(0, 8)
    };
}

function getBucketValidation(trades) {
    const groups = new Map();
    (trades || [])
        .filter((trade) => trade.status !== '重复剔除')
        .forEach((trade) => {
            const bucket = trade.assetBucket || getAssetBucket(trade);
            const list = groups.get(bucket) || [];
            list.push(trade);
            groups.set(bucket, list);
        });

    return Array.from(groups.entries()).map(([bucket, list]) => {
        const marked = list.filter((trade) => typeof trade.pnlPct === 'number');
        const closed = list.filter((trade) => trade.status === '时间退出' || trade.status === '止损退出' || trade.status === '止盈复盘');
        const wins = closed.filter((trade) => Number(trade.finalPnlPct ?? trade.pnlPct) > 0).length;
        const grossAvgPnlPct = marked.length
            ? Number((marked.reduce((sum, trade) => sum + trade.pnlPct, 0) / marked.length).toFixed(2))
            : null;
        const netAvgPnlPct = marked.length
            ? Number((marked.reduce((sum, trade) => sum + trade.pnlPct - getRoundTripCostPct(trade), 0) / marked.length).toFixed(2))
            : null;
        const exposurePct = list.reduce((sum, trade) => sum + Number(trade.allocationPct || 0), 0);
        const worst = marked
            .slice()
            .sort((a, b) => Number(a.pnlPct || 0) - Number(b.pnlPct || 0))[0];
        const verdict = bucket === '商品与避险'
            ? (netAvgPnlPct !== null && netAvgPnlPct < 0 ? '商品类先降速验证：只接受价格、资金、风险三项同时确认。' : '商品类可继续小仓观察，但不和股票模型混算胜率。')
            : (netAvgPnlPct !== null && netAvgPnlPct < 0 ? '暂不扩大仓位，等待更多正样本。' : '可继续按原仓位上限验证。');
        return {
            bucket,
            count: list.length,
            closedCount: closed.length,
            winRate: closed.length ? Math.round((wins / closed.length) * 100) : null,
            exposurePct,
            grossAvgPnlPct,
            netAvgPnlPct,
            worst: worst ? { symbol: worst.symbol, name: worst.name, pnlPct: Number(worst.pnlPct.toFixed(2)) } : null,
            verdict
        };
    }).sort((a, b) => b.exposurePct - a.exposurePct);
}

function getModelValidationReport(trades, portfolio, benchmark, costAdjusted) {
    const afterCost = costAdjusted?.modelReturnPctAfterCost;
    const relative = benchmark?.relativePct;
    const commodity = getBucketValidation(trades).find((item) => item.bucket === '商品与避险');
    const warnings = [];
    if (typeof afterCost === 'number' && afterCost < 0) warnings.push('扣除交易成本后仍为负，不能扩大真实仓位。');
    if (typeof relative === 'number' && relative < -0.5) warnings.push('当前跑输参考基准，需要先优化筛选和退出纪律。');
    if (commodity && typeof commodity.netAvgPnlPct === 'number' && commodity.netAvgPnlPct < 0) warnings.push('商品/能源样本拖累明显，必须单独建模，不再与科技或指数样本混在一起判断胜率。');
    return {
        status: warnings.length ? '继续小仓验证' : '可维持当前验证节奏',
        nextAction: warnings.length ? '不提高仓位上限，优先扩大样本和复盘失败原因。' : '继续积累样本，并观察是否连续跑赢基准。',
        warnings,
        minimumEvidence: '至少沉淀30-50个有效样本、覆盖上涨/震荡/回撤三类市场，再考虑把模拟信号转为真实投资参考。'
    };
}

async function main() {
    const previous = readJson(outputPath, { trades: [] });
    const hotNews = readHotNews();
    const existingTrades = removeWeekendEntryTrades(previous.trades || []);
    const sandbox = buildSandbox(existingTrades);

    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(dailyDataPath, 'utf8'), sandbox, { filename: dailyDataPath });

    const quoteMap = await sandbox.loadTradeQuoteMap();
    const macro = sandbox.assessTradeMacroRegime(hotNews.news);
    const rawCandidates = sandbox.getPaperTradeCandidates(hotNews.news, quoteMap, macro);
    const candidates = strengthenCandidates(rawCandidates, sandbox, existingTrades);
    const trades = addAssetBuckets(pruneDuplicateNoise(sandbox.updatePaperTrades(candidates, quoteMap, macro)), sandbox);
    const phaseStats = sandbox.getPaperPhaseStats(trades);
    const portfolio = sandbox.getPaperPortfolioStats(trades);
    const benchmark = getBenchmarkComparison(trades, portfolio);
    const costAdjusted = getCostAdjustedStats(trades, portfolio);
    const bucketValidation = getBucketValidation(trades);

    const effectiveTrades = trades.filter(trade => trade.status !== '重复剔除');
    const activeTrades = trades.filter(sandbox.isPaperTradeActive);
    const closedTrades = trades.filter(sandbox.isPaperTradeClosed);
    const wins = closedTrades.filter(trade => Number(trade.finalPnlPct ?? trade.pnlPct) > 0).length;
    const waitingCount = trades.filter(trade => trade.status === '仓位等待').length;
    const excludedCount = trades.filter(trade => trade.status === '重复剔除').length;

    const output = {
        version: 5,
        mode: 'cloud-paper-simulator',
        updateTime: new Date().toISOString(),
        newsSource: hotNews.source,
        modelTuning: {
            duplicateCooldownDays: 15,
            maxCandidatesPerRun: 6,
            eventCaps: '供需/地缘每轮最多1个，其它事件每轮最多2个',
            commodityRule: '油气/黄金/能源类必须确认分>=84，且价格、资金、风险三项同时过线。',
            validationUpgrade: '按资产桶拆分复盘，商品/避险、科技成长、中国资产、防御资产不再混算胜率。'
        },
        tradingCalendar: {
            timezone: 'Asia/Shanghai',
            rule: '周一至周五允许新增模拟入场；周末只更新复盘和观察，不新增买入记录。'
        },
        macro,
        candidates: candidates.map(item => ({
            symbol: item.symbol,
            code: item.code,
            name: item.name,
            market: item.market,
            kind: item.kind,
            eventType: item.eventType,
            score: item.score,
            assetBucket: item.assetBucket || getAssetBucket(item),
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
            alerts: portfolio.alerts,
            benchmark,
            costAdjusted,
            bucketValidation,
            validationReport: getModelValidationReport(trades, portfolio, benchmark, costAdjusted)
        },
        phaseStats,
        trades,
        note: '纸面模拟盘自动记录模型信号，不构成真实投资建议。'
    };

    fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    const storedTrades = getJsonFromStorage(sandbox, storageKey, []);
    console.log(`paper simulator updated: ${storedTrades.length} trades, ${candidates.length} candidates, source=${hotNews.source}`);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
