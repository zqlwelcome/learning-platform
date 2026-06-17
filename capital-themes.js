/**
 * 全球资金主线动态渲染兜底
 * 这个文件故意独立于 daily-data.js：自动新闻/达人更新可能会覆盖 daily-data.js，
 * 但页面加载时本文件会重新接管 buildSectorHeatHtml，保证主线不是旧静态板块。
 */

(function () {
    function buildDynamicCapitalThemesHtml(hotNews, globalFlow, quoteMap, macro, marketContext) {
        const text = (hotNews || []).map(n => `${n.title || ''} ${n.detail || ''} ${n.summary || ''}`).join(' ').toLowerCase();
        const indices = globalFlow?.indices || {};
        const sectors = getSectorProfiles().map(profile => scoreSectorProfile(profile, text, indices, quoteMap, macro))
            .filter(item => item.score >= 35)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        return `
            <div class="a-radar-intro">
                <div class="a-radar-kicker">全球资金主线</div>
                <div class="a-radar-copy">不是看谁今天最吵，而是看热钱正在押哪条主线、有没有过热、和交易池/模拟盘有没有形成闭环。</div>
            </div>
            <div class="a-sector-list">
                <div class="a-flow-disclaimer">当前宏观底色：${safeText(macro.label)}。榜单由热门新闻、全球指数、交易池候选和实时行情共同生成；用于判断主线，不是直接买入指令。</div>
                ${renderCapitalLinkNote(marketContext)}
                ${sectors.map((sector, index) => renderDynamicCapitalThemeCard(sector, index)).join('')}
            </div>
        `;
    }

    function renderCapitalLinkNote(marketContext) {
        if (!marketContext) return '';
        const paper = marketContext.paper?.selectedCount > 0
            ? `模拟盘已放行 ${marketContext.paper.selectedCount} 个信号。`
            : `模拟盘暂缓，主要卡点：${safeText(marketContext.paper?.topRejectedReason || '确认不足')}。`;
        const radar = marketContext.radarEvents?.[0]
            ? `本周先盯 ${safeText(marketContext.radarEvents[0].event)}。`
            : '本周雷达等待刷新。';
        return `<div class="capital-link-note">联动判断：${radar}${paper} 主线升温只代表资金关注，不等于交易池自动买入。</div>`;
    }

    function renderDynamicCapitalThemeCard(sector, index) {
        const directionClass = sector.bias === '降温' ? 'down' : 'up';
        const readiness = getSectorReadiness(sector);
        return `
            <div class="a-sector-item ${directionClass}">
                <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                    <span class="a-sector-rank">${index + 1}</span>
                    <span class="a-sector-name">${safeText(sector.name)}</span>
                    <span class="a-sector-change">${safeText(sector.bias)} ${sector.score}</span>
                </div>
                <div class="a-sector-detail">
                    <div class="sector-mainline">
                        <span>${safeText(readiness.label)}</span>
                        <b>${safeText(readiness.action)}</b>
                    </div>
                    <div class="a-sector-explain">资金在看：${safeText(sector.watch)}</div>
                    <div class="a-sector-reason">交易员逻辑：${safeText(sector.reason)}</div>
                    <div class="a-sector-impact">小白翻译：${safeText(sector.beginner)}</div>
                    <div class="a-target-list">
                        <span>代表资产</span>
                        ${sector.targets.map(target => renderSectorTargetBadge(target)).join('')}
                    </div>
                    <div class="a-flow-impact">和交易池关系：${safeText(readiness.link)}</div>
                </div>
            </div>
        `;
    }

    window.buildSectorHeatHtml = buildDynamicCapitalThemesHtml;
    window.renderSectorHeatCard = renderDynamicCapitalThemeCard;
    globalThis.buildSectorHeatHtml = buildDynamicCapitalThemesHtml;
    globalThis.renderSectorHeatCard = renderDynamicCapitalThemeCard;
})();
