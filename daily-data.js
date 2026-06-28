/**
 * 智囊团页签 - 方案A
 * 仪表盘风格：渐变情绪卡片 + 进度条 + 圆形达人选择器 + 紧凑解读
 */

let _currentExpert = 'templeton';
const PAPER_TRADE_PASSWORD = 'xbxdsha2026';
const PAPER_TRADE_AUTH_KEY = 'paper_trade_auth_v1';

// ===== 内嵌数据（替代 remote fetch，避免GitHub Pages缓存问题）=====
const _EMBEDDED_DATA = {
  "mood": {
    "mood": "谨慎乐观，分化加剧",
    "icon": "🤔",
    "color": "#FFA500",
    "confidence": 7,
    "dimensions": [
      {
        "label": "📈 趋势",
        "value": "全球股市受地缘冲突与大宗商品上涨影响呈现震荡，科技股受供应链危机拖累，A股出现退市与重组极端分化。"
      },
      {
        "label": "💰 资金",
        "value": "资金从高估值科技股流向能源、资源及防御性板块，沙特阿美事故可能加剧短期避险情绪。"
      },
      {
        "label": "🌍 地缘",
        "value": "美国攻击伊朗、沙特直升机坠毁事件加剧中东紧张局势，油价上涨推高通胀预期，货币战争叙事升温。"
      },
      {
        "label": "🏭 热点",
        "value": "能源（盐、石油）、AI预测竞赛、数据中心建设（中国股票受益）成为焦点，但芯片短缺对中小科技企业构成生存威胁。"
      },
      {
        "label": "😊 情绪",
        "value": "市场情绪复杂：一方面受地缘风险和退市消息压制，另一方面受AI创新和资源股景气提振，投机性热点如控股权变更引发短线炒作。"
      },
      {
        "label": "🏦 宏观",
        "value": "美元霸权博弈持续，摩根士丹利看多盐类资源，预示资源为王时代到来，全球通胀压力与供应链重构并行。"
      }
    ],
    "summary": "今日市场情绪呈谨慎乐观态势，地缘冲突与资源涨价驱动避险与投机并存。科技行业面临结构性分化，巨头与中小企业差距拉大，A股退市常态化与重组机会形成鲜明对比，投资者需在不确定性中寻找确定性。"
  },
  "experts": {
    "templeton": {
      "insight": "约翰·邓普顿会指出，当前市场充满悲观情绪，正是逆向布局良机。中东冲突和芯片短缺看似危机，实则孕育机会。他尤其关注被过度抛售的中小科技股，认为“记忆体短缺是生存危机”的说法过于悲观，长期看半导体周期终将反转。同时，他会对“盐是新的石油”这一观点保持警惕，认为资源股短期过热，而AI预测竞赛（如腾讯夺冠）显示中国科技公司仍有突破潜力，应逆向投资于被低估的AI应用领域。",
      "action": "建议逢低买入受芯片短缺影响但基本面扎实的中小科技股，同时减仓近期涨幅过大的资源股，布局中国AI与数据中心的长期增长。"
    },
    "buffett": {
      "insight": "沃伦·巴菲特会强调护城河与安全边际。他关注苹果和微软受内存短缺影响，但认为巨头拥有定价权和供应链韧性，而小玩家面临“生存危机”正是其脆弱性的体现，应远离。他欣赏摩根士丹利关于“盐是新石油”的观点，但会坚持投资于自己能理解且拥有持久竞争优势的企业，比如拥有盐矿资源的垄断型公司。对于A股退市和控股权变更，他视为市场出清的正常过程，不会参与投机。",
      "action": "建议增持现金流充裕、护城河深厚的能源和消费必需品龙头，如盐业相关公司，同时继续持有苹果、微软等科技巨头，避免投机性重组股。"
    },
    "munger": {
      "insight": "查理·芒格会强调理性与避免愚蠢。他嘲讽AI预测比赛（腾讯第一，DeepSeek第四）是“统计游戏”，认为过度关注短期预测是浪费时间。他更警惕地缘政治风险（美国攻伊、沙特事故）和货币战争，认为这增加了投资复杂性。对于芯片短缺，他认为这是行业周期的必然，但“生存危机”说法提醒投资者应避开缺乏竞争力的公司。他认同“盐是新石油”背后的资源稀缺逻辑，但警告不要盲目跟风。",
      "action": "建议保持耐心，减少交易频率，只投资于业务简单、管理诚信且定价权强的公司，如盐业和公用事业，同时远离高杠杆和依赖单一技术的企业。"
    },
    "duan": {
      "insight": "段永平会从企业长期价值与用户体验出发。他关注苹果和微软，认为内存短缺是短期供应链问题，不影响其长期商业模式，反而是加仓机会。对于“小玩家生存危机”，他认同这是行业马太效应的体现，投资应集中于头部。他欣赏腾讯在AI预测中夺冠，认为这反映了其技术积累，但强调投资要看企业本质而非比赛成绩。对于地缘冲突和资源股，他倾向于不碰自己不懂的领域，坚持投资于消费电子和互联网龙头。",
      "action": "建议继续持有苹果、腾讯等优质公司，利用市场恐慌适度加仓，同时回避资源股和重组题材，专注于拥有强大品牌和用户粘性的企业。"
    }
  },
  "updateTime": "2026-06-29 06:11",
  "generatedAt": "2026-06-29 06:11"
};;;;;;;;;;;;;;;;;;
;




















































































































































































































































;
;
;
;
;
;
;
;
;
;
;
;
;









;


;










async function renderSummaryContent() {
    const el = document.getElementById('summaryContent');
    if (!el) return;
    _currentExpert = 'templeton';
    // 直接使用内嵌数据
    const moodData = _EMBEDDED_DATA.mood;
    const expertsData = _EMBEDDED_DATA.experts;
    const briefingData = await loadBriefingData();
    const quoteMap = await loadTradeQuoteMap();
    const macro = assessTradeMacroRegime(briefingData.hotNews || []);
    const marketContext = buildMarketContext(briefingData.hotNews || [], briefingData.globalFlow || {}, quoteMap, macro, briefingData.paperTrades || null, moodData);
    const tradePoolHtml = await buildAutoTradePoolHtml(briefingData.hotNews || [], quoteMap, macro, marketContext);
    const sectorHeatHtml = buildSectorHeatHtml(briefingData.hotNews || [], briefingData.globalFlow || {}, quoteMap, macro, marketContext);
    window._paperTradeContext = { hotNews: briefingData.hotNews || [], quoteMap, macro, paperTrades: briefingData.paperTrades || null };
    const paperTradeHtml = isPaperTradeAuthorized() ? buildPaperTradeHtml(briefingData.hotNews || [], quoteMap, macro, briefingData.paperTrades, marketContext) : getPaperTradeGateHtml();
    window._expertsData = expertsData;
    window._marketContext = marketContext;
    
    const conf = Math.min(10, Math.max(0, moodData.confidence || 5));
    const bars = Array.from({length: 10}, (_, i) => `<span class="a-bar${i < conf ? ' fill' : ''}"></span>`).join('');
    const dims = (moodData.dimensions || []).slice(0, 6);
    const quickTake = moodData.summary || '今天市场还在整理情绪，先看重点，不急着做决定。';
    const traderLensHtml = getTraderMoodLens(moodData).map(item => `
        <div class="a-trader-line">
            <span class="a-trader-label">${item.label}</span>
            <span>${item.value}</span>
        </div>
    `).join('');
    const chipHtml = dims.map(d => {
        // 兼容新旧格式
        if (d.label) return `<span class="a-chip"><span class="a-chip-label">${d.label}</span> ${d.value}</span>`;
        return `<span class="a-chip">${d.value}</span>`;
    }).join('');
    
    const meta = {
        templeton: { name: '邓普顿', icon: '🌍', color: '#5856d6' },
        buffett:   { name: '巴菲特', icon: '💰', color: '#ff9500' },
        munger:    { name: '芒格',   icon: '🧠', color: '#34c759' },
        duan:      { name: '段永平', icon: '🧑‍💼', color: '#0071e3' }
    };
    const radarHtml = getForwardRadarHtml(marketContext);

    const quickHtml = `
        <div class="a-quick" id="expertMoodBanner">
            <div class="a-quick-head" onclick="toggleExpertMoodBanner()">
                <div>
                    <div class="a-quick-kicker">高手怎么看 · 市场情绪</div>
                    <div class="a-quick-title">现在不是牛熊二选一，是资金在挑“谁值得继续相信”</div>
                </div>
                <span class="a-quick-arrow" id="expertMoodArrow">›</span>
            </div>
            <div class="a-quick-preview">点开看交易员视角。先别急着冲，市场不缺机会，缺的是不乱动的手。</div>
            <div class="a-quick-detail" id="expertMoodDetail">
                <div class="a-quick-copy">${quickTake}</div>
                <div class="a-trader-lens">${traderLensHtml}</div>
                <div class="a-quick-note">免责声明：这里只是帮你建立市场阅读框架，不构成投资建议。真正下单前，请结合自己的现金流、风险承受力和持仓结构。</div>
            </div>
        </div>
    `;
    
    // 情绪卡片（可折叠）
    const moodHtml = `
        <div class="a-mood" id="aMood">
            <div class="a-top" onclick="toggleMoodDetail()" style="cursor:pointer;">
                <div>
                    <div class="a-label">市场温度计</div>
                    <div class="a-mood-status">
                        <span>${moodData.icon}</span>
                        <span>${moodData.mood}</span>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <div class="a-score">${conf}<small>/10</small></div>
                    <span class="a-mood-arrow" id="moodArrow">›</span>
                </div>
            </div>
            <div class="a-mood-detail" id="moodDetail" style="display:none;">
                <div class="a-bars">${bars}</div>
                <div class="a-chips">${chipHtml || '<span class="a-chip">暂无数据</span>'}</div>
            </div>
        </div>
    `;
    
    // 达人按钮（可折叠）
    const btnsHtml = Object.keys(meta).map(k => {
        const m = meta[k];
        const active = k === _currentExpert ? ' active' : '';
        return `
            <button class="a-btn${active}" onclick="switchExpert('${k}')" style="${active ? 'background:'+m.color+';color:#fff' : ''}">
                <span class="a-btn-icon" style="${active ? 'background:rgba(255,255,255,0.2)' : 'background:'+m.color+'20'}">${m.icon}</span>
                <span class="a-btn-name" style="${active ? 'color:#fff' : ''}">${m.name}</span>
            </button>
        `;
    }).join('');
    
    el.innerHTML = `
        <!-- 统一卡片：智囊团 + 市场日历 + 资金流向 + 板块轮动 -->
        <div class="a-insights">
            <div class="a-insights-tabs-wrapper">
                <div class="a-insights-tabs">
                    <button class="a-insights-tab active" onclick="switchInsightTab('braintrust', this)">高手茶话会</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('calendar', this)">本周雷达</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('flow', this)">交易池情报</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('sector', this)">全球资金主线</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('paper', this)">模拟盘验证</button>
                </div>
                <div class="a-insights-hint" id="tabHint">
                    <span class="a-hint-arrow">←</span>
                    <span class="a-hint-text">左右滑动，看看别人在吵什么</span>
                    <span class="a-hint-arrow">→</span>
                </div>
            </div>
            
            <!-- 智囊团内容 -->
            <div class="a-insights-content active" id="insight-braintrust">
                ${quickHtml}
                ${moodHtml}
                ${renderMarketLinkMap(marketContext)}
                <div class="a-btns">${btnsHtml}</div>
                <div id="expertContent"></div>
            </div>
            
            <!-- 市场日历内容 -->
            <div class="a-insights-content" id="insight-calendar">
                <div class="a-radar-intro">
                    <div class="a-radar-kicker">未来两周热钱雷达</div>
                    <div class="a-radar-copy">不罗列日历，直接告诉你：哪几件事最可能改变股市、债券、美元、A股和热钱方向。</div>
                </div>
                ${radarHtml}
            </div>
            
            <!-- 交易池情报内容 -->
            <div class="a-insights-content" id="insight-flow">
                <div class="a-radar-intro">
                    <div class="a-radar-kicker">自动交易池 v5</div>
                    <div class="a-radar-copy">新闻事件不是唯一入口，会叠加本周雷达、全球资金主线、实时涨跌、成交额、5日趋势和模拟盘冷却期；单股财报排雷未通过前只进监控。</div>
                </div>
                ${tradePoolHtml}
            </div>
            
            <!-- 板块轮动内容 -->
            <div class="a-insights-content" id="insight-sector">
                ${sectorHeatHtml}
            </div>

            <!-- 模拟盘验证内容 -->
            <div class="a-insights-content" id="insight-paper">
                ${paperTradeHtml}
            </div>
        </div>
    `;
    
    // 渲染当前达人内容
    renderExpertContent();
}

function switchExpert(key) {
    _currentExpert = key;
    // 更新按钮高亮状态
    document.querySelectorAll('.a-btn').forEach((btn, i) => {
        const keys = ['templeton', 'buffett', 'munger', 'duan'];
        const k = keys[i];
        const meta = { templeton: {color:'#5856d6'}, buffett: {color:'#ff9500'}, munger: {color:'#34c759'}, duan: {color:'#0071e3'} };
        const m = meta[k];
        const active = k === key;
        btn.className = 'a-btn' + (active ? ' active' : '');
        btn.style.background = active ? m.color : '';
        btn.style.color = active ? '#fff' : '';
        const icon = btn.querySelector('.a-btn-icon');
        if (icon) icon.style.background = active ? 'rgba(255,255,255,0.2)' : m.color + '20';
        const name = btn.querySelector('.a-btn-name');
        if (name) name.style.color = active ? '#fff' : '';
    });
    // 只更新内容区
    renderExpertContent();
}

function renderExpertContent() {
    const el = document.getElementById('expertContent');
    if (!el) return;
    
    const meta = {
        templeton: { name: '邓普顿', icon: '🌍', color: '#5856d6' },
        buffett:   { name: '巴菲特', icon: '💰', color: '#ff9500' },
        munger:    { name: '芒格',   icon: '🧠', color: '#34c759' },
        duan:      { name: '段永平', icon: '🧑‍💼', color: '#0071e3' }
    };
    const m = meta[_currentExpert];
    const expertsData = window._expertsData || {};
    const ex = expertsData[_currentExpert];
    
    if (ex && ex.insight) {
        const brief = getExpertBrief(_currentExpert, window._marketContext);
        el.innerHTML = `
            <div class="a-banner">
                <span class="a-bi">${m.icon}</span>
                <div class="a-bn">${m.name}今天怎么想</div>
            </div>
            <div class="expert-brief-card" style="border-left-color:${m.color}">
                <div class="expert-brief-title">${safeText(brief.one)}</div>
                <div class="expert-brief-grid">
                    <div><span>先看</span><b>${safeText(brief.watch)}</b></div>
                    <div><span>别急</span><b>${safeText(brief.avoid)}</b></div>
                </div>
                <div class="expert-brief-trigger">${safeText(brief.trigger)}</div>
            </div>
            <div class="expert-full-toggle" onclick="toggleExpertFullView()">
                <span>展开完整观点</span>
                <b id="expertFullArrow">›</b>
            </div>
            <div class="expert-full-view" id="expertFullView">
                <div class="a-card" style="border-left-color:${m.color}">
                    <div class="a-card-label">完整逻辑</div>
                    <div class="a-card-body">${ex.insight.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="a-card a-action" style="border-left-color:${m.color}">
                    <div class="a-card-label">如果非要做点什么</div>
                    <div class="a-card-body" style="font-weight:500;color:#664d03;">${ex.action || '等待数据更新，先别硬操作。'}</div>
                </div>
            </div>
            <div class="a-feedback">
                <span class="a-fb-label">这个判断</span>
                <button class="a-fb-btn" onclick="fbFeedback('${_currentExpert}','like')">有点东西</button>
                <button class="a-fb-btn" onclick="fbFeedback('${_currentExpert}','unlike')">先存疑</button>
            </div>
        `;
    } else {
        el.innerHTML = '<div style="text-align:center;padding:24px 0;color:var(--text2);">高手还没到场，茶先泡着。</div>';
    }
}

function getExpertBrief(expertKey, context) {
    const mainline = context?.mainlines?.[0]?.name || '当前主线';
    const radar = context?.radarEvents?.[0]?.event || '关键事件';
    const targets = (context?.tradeTargets || []).slice(0, 2).map(item => `${item.name}${item.code}`).join('、') || '交易池候选';
    const paper = context?.paper?.selectedCount > 0
        ? `模拟盘已有 ${context.paper.selectedCount} 个信号，继续看复盘表现。`
        : `模拟盘未放行，先等价格和风控确认。`;
    const map = {
        templeton: {
            one: `逆向看：${mainline} 热了，但不等于现在就追。`,
            watch: `${radar} 后有没有被错杀的资产。`,
            avoid: `只因为新闻热就追 ${targets}。`,
            trigger: paper
        },
        buffett: {
            one: `价值看：先看现金流和护城河，再看涨跌。`,
            watch: `${mainline} 里谁能把利润做出来。`,
            avoid: `买入只靠估值故事、没有盈利兑现的标的。`,
            trigger: paper
        },
        munger: {
            one: `风险看：先找反证，别把热闹当确定性。`,
            watch: `${radar} 会不会改变利率、油价或流动性。`,
            avoid: `看不懂、太拥挤、没有退出纪律。`,
            trigger: paper
        },
        duan: {
            one: `好生意看：能懂、能等、价格舒服才动。`,
            watch: `${targets} 是否真符合好生意和好价格。`,
            avoid: `把新闻催化当成买入理由。`,
            trigger: paper
        }
    };
    return map[expertKey] || map.templeton;
}

function buildMarketContext(hotNews = [], globalFlow = {}, quoteMap = {}, macro = {}, paperTrades = null, moodData = {}) {
    const text = (hotNews || []).map(n => `${n.title || ''} ${n.summary || ''} ${n.detail || ''}`).join(' ').toLowerCase();
    const indices = globalFlow?.indices || {};
    const radarEvents = getVisibleForwardRadarEvents().slice(0, 3);
    const tradeCards = uniqueTradeCards((hotNews || [])
        .map(news => scoreTradeEvent(news, quoteMap, macro))
        .filter(item => item.score >= 4)
        .sort((a, b) => b.score - a.score))
        .slice(0, 4);
    const tradeTargets = getTradePoolUniqueTargets(tradeCards).slice(0, 5).map(({ target, card }) => ({
        name: target.name,
        code: target.code,
        market: target.market,
        type: card.type
    }));
    const mainlines = getSectorProfiles()
        .map(profile => scoreSectorProfile(profile, text, indices, quoteMap, macro))
        .filter(item => item.score >= 35)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
    const factorReport = paperTrades?.stats?.factorModelReport || null;
    const audit = Array.isArray(factorReport?.audit) ? factorReport.audit : [];
    const topRejected = audit.find(item => item.rejectedReasons?.length) || null;
    const selectedCount = Array.isArray(paperTrades?.candidates) ? paperTrades.candidates.length : 0;
    const tradeCount = Array.isArray(paperTrades?.trades) ? paperTrades.trades.length : 0;
    const closedTrades = Array.isArray(paperTrades?.trades) ? paperTrades.trades.filter(isPaperTradeClosed) : [];
    const wins = closedTrades.filter(trade => Number(trade.finalPnlPct ?? trade.pnlPct) > 0).length;
    return {
        mood: moodData?.mood || '等待情绪更新',
        macroLabel: macro?.label || '宏观待确认',
        riskMode: getMarketContextRiskMode(macro, mainlines, factorReport),
        radarEvents,
        mainlines,
        tradeTargets,
        paper: {
            version: paperTrades?.version || 7,
            selectedCount,
            tradeCount,
            rawCandidateCount: factorReport?.rawCandidateCount ?? audit.length,
            topRejectedReason: topRejected?.rejectedReasons?.[0] || '暂无主要否决项',
            winRate: closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : null
        }
    };
}

function getMarketContextRiskMode(macro, mainlines, factorReport) {
    const label = macro?.label || '';
    const topScore = mainlines?.[0]?.score || 0;
    const selected = factorReport?.selectedCount || 0;
    if (/防守|收缩|高利率|避险/.test(label)) return '防守优先';
    if (selected === 0 && factorReport) return '机会观察';
    if (topScore >= 75) return '顺势但控仓';
    return '均衡观察';
}

function renderMarketLinkMap(context) {
    if (!context) return '';
    const topLine = context.mainlines?.[0];
    const topEvent = context.radarEvents?.[0];
    const topTargets = (context.tradeTargets || []).slice(0, 3).map(item => `${item.name} ${item.code}`).join(' / ') || '等待交易池确认';
    const paperText = context.paper?.selectedCount > 0
        ? `模拟盘本轮入选 ${context.paper.selectedCount} 个信号`
        : `模拟盘暂缓：${context.paper?.topRejectedReason || '等待确认'}`;
    return `
        <div class="market-link-map">
            <div class="market-link-head" onclick="toggleMarketLinkMap()">
                <span>今日投研闭环</span>
                <b>${safeText(context.riskMode)}</b>
                <em id="marketLinkArrow">›</em>
            </div>
            <div class="market-link-compact">
                <span>${safeText(topEvent ? topEvent.event : '等待雷达刷新')}</span>
                <b>${safeText(topLine ? `${topLine.name} ${topLine.bias}` : context.macroLabel)}</b>
            </div>
            <div class="market-link-detail" id="marketLinkDetail">
                <div class="market-link-chain">
                    <span>本周雷达</span>
                    <i></i>
                    <span>资金主线</span>
                    <i></i>
                    <span>交易池</span>
                    <i></i>
                    <span>模拟盘</span>
                    <i></i>
                    <span>高手解读</span>
                </div>
                <div class="market-link-grid">
                    <div><small>最该盯</small><b>${safeText(topEvent ? `${topEvent.event}｜${topEvent.region}` : '等待雷达刷新')}</b></div>
                    <div><small>资金主线</small><b>${safeText(topLine ? `${topLine.name} ${topLine.bias}` : context.macroLabel)}</b></div>
                    <div><small>候选资产</small><b>${safeText(topTargets)}</b></div>
                    <div><small>模型纪律</small><b>${safeText(paperText)}</b></div>
                </div>
            </div>
        </div>
    `;
}

function getTraderMoodLens(moodData) {
    return [
        {
            label: '资金情绪',
            value: '热钱仍愿意抱团强势主题，但耐心变短，涨多了就会有人先落袋。'
        },
        {
            label: '机构脑回路',
            value: '机构不是不买风险，而是更偏好“有业绩、有政策、有现金流”的风险。'
        },
        {
            label: '小白看法',
            value: '别问今天能不能冲，先问这条新闻会影响利率、盈利、政策还是情绪。只影响情绪的，仓位要轻。'
        }
    ];
}

function getForwardRadarEvents() {
    return [
        {
            date: '2026-06-23',
            label: '06/23 结果',
            event: '全球6月PMI初值 + 科技半导体回撤 + 油价降温',
            region: '增长/通胀',
            impact: 'high',
            summary: '结果+市场解读：美国S&P综合PMI升到52.2，制造产出强，但就业分项转弱；欧元区综合PMI仍在50以下，英国服务业收缩，日本企业继续面对成本压力。当天科技和半导体被抛售，原油因霍尔木兹通行改善和伊朗供应预期回落。市场交易的是“增长没塌、通胀还粘、AI估值先降温”。',
            thesis: '改的是风险偏好、利率敏感度和通胀溢价。油价回落缓解通胀尾部风险，但PMI没有弱到支持快速降息，高估值科技仍要承受实际利率压力。',
            assets: '2年和10年美债、美元、黄金、原油、纳指、半导体、港股科技、A股出口链、机器人链、油气和化工。',
            flow: '热钱会从高估值AI链、港股高β和油气避险仓撤出一部分，转去美元现金、短债和业绩确定性更强的硬件龙头。若美元走强、半导体放量跌、油价反弹乏力，说明市场仍在降风险预算。',
            plan: '如果PCE或非农继续推高收益率，倾向降低高估值成长追涨；如果收益率回落、油价不再冲高且科技止跌放量，可关注科技和港股弹性修复，但不提前重仓。',
            plain: '经济没坏到要降息，油价又没强到撑通胀，贵的科技股先被市场挑刺。'
        },
        {
            date: '2026-06-24',
            label: '06/24',
            event: '美联储2026银行压力测试结果 + 北约防务预算信号',
            region: '美国金融',
            impact: 'medium',
            summary: '预期窗口：美联储将在6月24日美东时间16:00公布大型银行压力测试结果；欧洲防务支出和北约安全承诺仍会影响军工、能源和欧债风险溢价。银行体检看信用，防务预算看地缘风险有没有变成财政需求。',
            thesis: '改的是金融体系风险溢价、信用流动性和地缘风险溢价。银行资本越从容，市场越敢买金融和信用；防务预算越硬，欧洲财政供给和军工订单预期越强。',
            assets: '美国银行股、金融ETF、信用债、美元、短端美债、欧洲军工、能源、港股银行、A股银行保险和军工。',
            flow: '如果银行股、信用债和欧洲军工同步走强，说明资金在买“信用稳+防务订单”；如果银行股跌、信用利差走阔，资金会回到短债、美元和高股息防御。',
            plan: '如果金融股和信用债同步走强，可提高价值、高股息和银行保险观察权重；如果银行股走弱且信用利差扩大，倾向降低周期和高杠杆板块暴露。',
            plain: '今天一边看银行体检，一边看欧洲防务花钱会不会继续推高军工和财政交易。'
        },
        {
            date: '2026-06-25',
            label: '06/25',
            event: '美国Q1终值GDP + 5月PCE通胀',
            region: '美国通胀',
            impact: 'high',
            summary: '预期窗口：BEA将在6月25日公布Q1 GDP终值和5月个人收入支出，PCE是美联储最重视的通胀指标。4月PCE同比已经在3.8%，市场会重点看能源回落能不能压住服务通胀。',
            thesis: '先改利率预期和美元流动性，再改科技股、黄金和人民币资产定价。GDP验证经济韧性，PCE决定美联储偏鹰能不能继续有数据支撑。',
            assets: '2年美债、美元、黄金、纳指、比特币、港股科技、人民币汇率、原油。',
            flow: '如果核心PCE高于预期，资金会留在美元、短债、金融和能源，撤出长久期成长；如果核心PCE回落，热钱更可能从现金和防御回流科技、黄金和港股弹性。先盯2年美债、美元和黄金。',
            plan: '如果核心PCE偏强，倾向减轻高估值成长和港股高β追涨；如果核心PCE偏弱且收益率回落，可关注黄金、纳指和港股科技修复，但要等价格确认。',
            plain: '这一天主要看通胀有没有继续烫，美联储会不会更硬。'
        },
        {
            date: '2026-06-27',
            label: '06/27',
            event: '中国1-5月工业企业利润',
            region: '中国盈利',
            impact: 'medium',
            summary: '预期窗口：中国工业利润会检验“制造强、内需弱”能不能继续撑A股盈利。1-4月利润同比增长18.2%，但改善主要集中在高技术制造、装备、能源化工和有色，市场会看中下游有没有扩散。',
            thesis: '改的是盈利预期、政策预期和风格预期。利润只集中在上游和少数制造，指数就难全面扩散；利润扩到中游和消费，A股风险偏好才更稳。',
            assets: 'A股工业、机械、电力设备、半导体链、资源周期、消费制造、港股工业、人民币。',
            flow: '如果利润增速继续改善且行业扩散，热钱可能从红利和债券部分回到顺周期制造；如果利润只靠能源和少数AI链，资金会继续抱团强产业链，回避泛消费和地产链。',
            plan: '如果利润改善覆盖面扩大，倾向提高制造和周期观察权重；如果利润增速好但结构很窄，倾向只跟强产业链，不把它解读成全面牛市信号。',
            plain: '企业到底有没有多赚钱，比口号更能说明A股能不能从题材走到业绩。'
        },
        {
            date: '2026-06-29',
            label: '06/29-07/01',
            event: 'ECB Sintra论坛 + 欧元区6月通胀初值',
            region: '欧洲利率',
            impact: 'medium',
            summary: '预期窗口：ECB年度央行论坛6月29日至7月1日在Sintra举行，主题是创新、增长和稳定；7月1日还有欧元区6月通胀初值。市场会听央行是否继续强调通胀粘性和财政扩张。',
            thesis: '改的是欧洲利率预期、美元指数结构和风险偏好，再间接影响黄金、人民币和全球成长股估值。',
            assets: '欧元、德债、美元指数、黄金、欧洲银行、奢侈品、A股和港股外资风险偏好。',
            flow: '如果通胀和央行讲话偏鹰，资金会买欧元和欧洲银行，同时压制黄金和高估值成长；如果通胀降温、欧洲央行口径缓和，热钱可能回补黄金、科技和新兴市场。',
            plan: '如果欧元和德债收益率同步走强，倾向把全球高利率交易延长；如果欧洲通胀低于预期且美元走弱，可关注黄金、港股科技和人民币资产的修复窗口。',
            plain: '欧洲央行越不敢松，全球资金越难放心买成长股。'
        },
        {
            date: '2026-06-30',
            label: '06/30',
            event: '中国6月官方PMI + 美国JOLTS',
            region: '中美景气',
            impact: 'high',
            summary: '预期窗口：中国5月官方制造业PMI为50.0，生产撑住但订单和就业偏弱；6月PMI会检验价格、订单和库存是否修复。同日美国5月JOLTS会补充就业缺口，影响非农前的利率预期。',
            thesis: '中国PMI改盈利和政策预期，美国JOLTS改利率预期和美元强弱。两者合在一起决定热钱是买中国顺周期，还是继续留在美元资产。',
            assets: 'A股制造业链、资源周期、工程机械、消费、国债、人民币、港股工业、美元、2年美债。',
            flow: '如果中国PMI改善且美国职位空缺降温，资金更容易回补A股顺周期和港股β；如果中国订单弱、美国就业需求强，热钱会偏美元和短债，人民币资产弹性被压住。',
            plan: '如果PMI改善但地产和消费仍弱，倾向继续做“制造强、内需弱”的结构；如果PMI和人民币同步回稳，可提高A股顺周期和港股β观察权重；如果JOLTS偏强推高收益率，先控制高估值成长仓位。',
            plain: '这一天同时看中国工厂有没有订单、美国就业有没有降温。'
        },
        {
            date: '2026-07-01',
            label: '07/01',
            event: '全球制造数据日：RatingDog PMI + ISM制造业 + 日本短观',
            region: '全球制造',
            impact: 'high',
            summary: '预期窗口：中国RatingDog制造业PMI、美国ISM制造业和日本短观同日接力。RatingDog 5月为51.8，美国ISM 5月为54，日本短观要看企业能否承受更高油价、更强日元和工资成本。',
            thesis: '同时改盈利预期、利率预期、商品需求和日元套息交易。制造强但价格也强，会推高“增长好、降息远”的定价。',
            assets: 'A股出口链、港股工业、铜、原油、美元、美债、日元、纳指、半导体、机械、电力设备。',
            flow: '如果中美日制造信号都强，资金会偏制造、周期和AI硬件；如果美国价格分项强而中国订单弱，热钱会买美元和短债，撤出新兴市场高β；如果日本短观强推升日元，要警惕套息资金回撤。',
            plan: '如果中国PMI改善且人民币走稳，可提高出口制造和港股β观察权重；如果美国ISM强到推升收益率，倾向控制高估值科技追涨；如果日元急升，先降低外盘高杠杆风险。',
            plain: '这一天看全球工厂链，也看日元会不会让跨境资金变紧。'
        },
        {
            date: '2026-07-02',
            label: '07/02',
            event: '美国6月非农就业',
            region: '美国就业',
            impact: 'high',
            summary: '预期窗口：BLS日程显示美国6月非农将在7月2日8:30 ET公布，7月3日是假期。FOMC已经偏鹰，这份就业数据会决定市场是否继续相信“经济还扛得住高利率”。',
            thesis: '先改利率预期和风险偏好，再改成长股与商品的风险预算。',
            assets: '美债收益率、美元、纳指、罗素2000、黄金、原油、A股和港股科技。',
            flow: '如果新增就业和工资都偏强，热钱会继续压缩降息交易，回美元、金融和能源，撤出黄金与长久期成长；如果就业明显转弱，资金才会更认真回补债券、黄金和科技反弹。',
            plan: '如果就业强于预期且收益率抬升，倾向继续控制高估值成长仓位；如果就业走弱并带动收益率下行，可关注黄金和科技的反弹，但要防止市场先把它解读成“衰退担忧”。',
            plain: '美国人还在不在赚钱、企业还在不在招人，决定了高利率还能撑多久。'
        },
        {
            date: '2026-07-06',
            label: '07/06-07/07',
            event: '美国6月ISM服务业 + 中国6月外储',
            region: '服务通胀/人民币',
            impact: 'high',
            summary: '预期窗口：ISM服务业按第三个工作日公布6月数据；中国外储通常在月初公布，上月外储仍在3.4万亿美元上方。一个看美国服务通胀，一个看人民币和跨境资金缓冲垫。',
            thesis: '改的是服务通胀、利率预期、人民币预期和新兴市场流动性。美国服务越热，美元越硬；中国外储越稳，人民币资产越容易吸引回补资金。',
            assets: '2年美债、美元、纳指、消费股、金融、黄金、原油、离岸人民币、A股和港股科技。',
            flow: '如果服务业PMI和价格分项偏强，热钱会偏美元、金融和短债；如果服务业降温且人民币企稳，资金可能回流债券、黄金、港股科技和A股成长。外储下滑过快则说明汇率压力还没解除。',
            plan: '如果服务业强于预期且美元走高，倾向继续控制成长股和新兴市场高β仓位；如果服务业降温、收益率下行且人民币稳住，可关注黄金、科技和港股修复。',
            plain: '美国服务业决定美元硬不硬，中国外储决定人民币底气够不够。'
        },
        {
            date: '2026-07-08',
            label: '07/08',
            event: '6月FOMC纪要 + 10年美债续发拍卖',
            region: '美元利率',
            impact: 'high',
            summary: '预期窗口：6月FOMC维持3.50%-3.75%并继续强调抗通胀，纪要按三周节奏在7月8日公布；同日附近还有10年期美债供给窗口。一个看政策分歧，一个看长端资金愿不愿意接货。',
            thesis: '改的是利率预期、期限溢价和风险偏好。纪要偏鹰会抬高实际利率，拍卖需求弱会推高长端收益率，两者都会压成长股估值。',
            assets: '10年美债、美元、黄金、纳指、半导体、比特币、港股科技、人民币、A股成长。',
            flow: '如果纪要偏鹰且10年拍卖尾部偏弱，热钱会从黄金、成长和新兴市场高β撤出，回到美元和短债；如果纪要承认就业降温且拍卖需求强，资金可能回补债券、黄金和科技反弹。',
            plan: '如果10年收益率上破前高，倾向降低成长股和港股高β仓位；如果收益率回落、美元走弱且黄金走强，可关注科技和黄金修复，但不追单日急拉。',
            plain: '这一天看美联储有多硬，也看市场愿不愿意借钱给美国十年。'
        }
    ];
}

function getVisibleForwardRadarEvents(events = getForwardRadarEvents()) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentStart = new Date(today);
    recentStart.setDate(recentStart.getDate() - 7);
    const futureEnd = new Date(today);
    futureEnd.setDate(futureEnd.getDate() + 14);
    return events.filter(item => {
        const eventDate = new Date(`${item.date}T00:00:00`);
        return eventDate >= recentStart && eventDate <= futureEnd;
    });
}

function getForwardRadarHtml(context = null) {
    const visible = getVisibleForwardRadarEvents();
    const contextLine = context?.mainlines?.[0]
        ? `联动提示：这批事件会优先影响「${safeText(context.mainlines[0].name)}」，交易池和模拟盘会继续用价格、成交和风控过滤。`
        : '联动提示：本周雷达先定事件，交易池和模拟盘再用价格、成交和风控确认。';
    return `<div class="a-calendar-list">${visible.map(item => `
        <div class="a-calendar-item expanded">
            <div class="a-calendar-main">
                <span class="a-calendar-date">${item.label}</span>
                <span class="a-calendar-event">${item.event}</span>
                <span class="a-calendar-region">${item.region}</span>
                <span class="a-calendar-impact ${item.impact}">${item.impact}</span>
            </div>
            <div class="a-calendar-detail">
                <div class="a-calendar-explain">${item.summary}</div>
                <div class="a-calendar-watch">交易员核心判断：${item.thesis}</div>
                <div class="a-calendar-watch">资产映射：${item.assets}</div>
                <div class="a-calendar-watch">热钱路径：${item.flow}</div>
                <div class="a-calendar-impact-text">操作提示：${item.plan}</div>
                <div class="a-calendar-impact-text">小白翻译：${item.plain}</div>
            </div>
        </div>
    `).join('')}
        <div class="a-flow-disclaimer">${contextLine}</div>
        <div class="a-flow-disclaimer">免责声明：这里只是学习和市场阅读框架，不构成个性化投资建议。真实交易请结合自己的风险承受力、仓位管理和资金期限执行。</div>
    </div>`;
}

async function buildAutoTradePoolHtml(hotNews, quoteMap = null, macro = null, marketContext = null) {
    quoteMap = quoteMap || await loadTradeQuoteMap();
    macro = macro || assessTradeMacroRegime(hotNews || []);
    const cards = uniqueTradeCards((hotNews || [])
        .map(news => scoreTradeEvent(news, quoteMap, macro))
        .filter(item => item.score >= 4)
        .sort((a, b) => b.score - a.score))
        .slice(0, 4);

    if (cards.length === 0) {
        return `
            <div class="a-flow-list">
                <div class="a-flow-disclaimer">今天没有通过模型门槛的事件。空仓和观察也是交易动作，不必每天都找机会。</div>
            </div>
        `;
    }

    return `
        <div class="a-flow-list">
            <div class="a-flow-hint" onclick="this.style.display='none'"><span class="a-flow-hint-icon">👇</span><span class="a-flow-hint-text">点击情报卡，查看模型判断</span></div>
            <div class="a-flow-disclaimer">当前宏观底色：${safeText(macro.label)}。交易池情报分成核心池、机会池、防御池；只有通过入场确认分的标的才会进入模拟盘验证。${marketContext?.mainlines?.[0] ? `今日优先和「${safeText(marketContext.mainlines[0].name)}」主线交叉验证。` : ''}</div>
            ${renderTradePoolLayerSummary(cards, macro)}
            ${cards.map(card => renderTradePoolCard(card, macro)).join('')}
            <div class="a-flow-item">
                <div class="a-flow-main" onclick="toggleFlowDetail(this)">
                    <span class="a-flow-category-title">风控底线</span>
                    <span class="a-flow-name">仓位和退出规则</span>
                    <span class="a-flow-change negative">硬规则</span>
                </div>
                <div class="a-flow-detail">
                    <div class="a-flow-explain">模型规则：单标的不超过 15%，同一行业不超过 20%，权益总仓不超过 70%，保留 30% 现金/固收底仓。</div>
                    <div class="a-flow-meaning">退出纪律：入场后跌 8% 止损；持有满 10 个交易日，无论盈亏都重新评估。</div>
                    <div class="a-target-list">
                        <span>底仓参考</span>
                        <b>国债ETF 511010</b>
                        <b>十年国债ETF 511260</b>
                        <b>短债ETF SHV</b>
                        <b>长债ETF TLT</b>
                    </div>
                    <div class="a-flow-impact">小白翻译：这个模型不是为了天天买，而是为了只在事件窗口里做有纪律的下注。</div>
                </div>
            </div>
            <div class="a-flow-disclaimer">自动交易池 v6 按交易模型执行：事件分数低于4过滤；美股、港股、A股、黄金、基金/ETF同池评分；个股需要更高确认分才进入模拟盘。以下不是无条件买入清单。</div>
        </div>
    `;
}

function renderTradePoolLayerSummary(cards, macro) {
    const uniqueTargets = getTradePoolUniqueTargets(cards);
    const layers = ['核心池', '机会池', '防御池'].map(layer => {
        const items = uniqueTargets
            .filter(({ target }) => getTradePoolLayer(target) === layer)
            .map(({ target, card }) => ({ target, card, meta: getTradePoolTargetMeta(target, card, macro) }))
            .sort((a, b) => b.meta.confirmationScore - a.meta.confirmationScore)
            .slice(0, 3);
        return { layer, items };
    });

    return `
        <div class="trade-layer-grid">
            ${layers.map(group => `
                <div class="trade-layer-card">
                    <span>${group.layer}</span>
                    <b>${group.items.length ? group.items.map(item => safeText(`${item.target.name} ${item.target.code}`)).join(' / ') : '暂无高质量候选'}</b>
                    <small>${getTradePoolLayerHint(group.layer)}</small>
                </div>
            `).join('')}
        </div>
    `;
}

function getTradePoolUniqueTargets(cards) {
    const seen = new Set();
    const result = [];
    (cards || []).forEach(card => {
        (card.targets || []).forEach(target => {
            if (seen.has(target.symbol)) return;
            seen.add(target.symbol);
            result.push({ target, card });
        });
    });
    return result;
}

function getTradePoolLayer(target) {
    const themes = target.themes || [];
    if (themes.some(theme => ['cash', 'gold', 'bond'].includes(theme))) return '防御池';
    if (target.kind === 'Stock') return '机会池';
    return '核心池';
}

function getTradePoolLayerHint(layer) {
    if (layer === '核心池') return '宽基、基金、ETF，优先用来验证方向。';
    if (layer === '机会池') return '个股弹性大，确认分要更高，仓位更小。';
    return '黄金、债券、现金类，风险模式偏弱时更重要。';
}

function getTradePoolTargetMeta(target, card, macro) {
    const confirmation = getPaperEntryConfirmation(target, card, macro);
    const threshold = target.kind === 'Stock' ? 86 : 62;
    const isHot = typeof target.pct === 'number' && target.pct > 4 || typeof target.fiveDayPct === 'number' && target.fiveDayPct > 8 || typeof target.heat === 'number' && target.heat > 0.88;
    const status = confirmation.score >= threshold ? '可进模拟盘' : isHot ? '不追高' : confirmation.score >= threshold - 10 ? '等待确认' : '观察';
    return {
        layer: getTradePoolLayer(target),
        confirmationScore: confirmation.score,
        reasons: confirmation.reasons,
        status,
        threshold
    };
}

function buildSectorHeatHtml(hotNews, globalFlow, quoteMap, macro) {
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
                    <div class="a-sector-item up">
                        <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                            <span class="a-sector-rank">1</span>
                            <span class="a-sector-name">电力板块</span>
                            <span class="a-sector-change">+3.2%</span>
                        </div>
                        <div class="a-sector-detail">
                            <div class="a-sector-explain">📌 电力发电、输电、配电公司</div>
                            <div class="a-sector-reason">🔍 原因：夏季用电高峰+新能源政策</div>
                            <div class="a-sector-impact">💡 参考：防御性板块，适合稳健型投资者</div>
                        </div>
                    </div>
                    <div class="a-sector-item up">
                        <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                            <span class="a-sector-rank">2</span>
                            <span class="a-sector-name">白酒板块</span>
                            <span class="a-sector-change">+2.8%</span>
                        </div>
                        <div class="a-sector-detail">
                            <div class="a-sector-explain">📌 白酒酿造和销售公司</div>
                            <div class="a-sector-reason">🔍 原因：消费复苏+茅台效应</div>
                            <div class="a-sector-impact">💡 参考：高端消费品，受经济周期影响大</div>
                        </div>
                    </div>
                    <div class="a-sector-item up">
                        <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                            <span class="a-sector-rank">3</span>
                            <span class="a-sector-name">超级电容</span>
                            <span class="a-sector-change">+2.1%</span>
                        </div>
                        <div class="a-sector-detail">
                            <div class="a-sector-explain">📌 超级电容器技术公司</div>
                            <div class="a-sector-reason">🔍 原因：新能源储能需求增长</div>
                            <div class="a-sector-impact">💡 参考：成长性板块，波动较大</div>
                        </div>
                    </div>
                    <div class="a-sector-item down">
                        <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                            <span class="a-sector-rank">4</span>
                            <span class="a-sector-name">半导体设备</span>
                            <span class="a-sector-change">-4.5%</span>
                        </div>
                        <div class="a-sector-detail">
                            <div class="a-sector-explain">📌 芯片制造设备公司</div>
                            <div class="a-sector-reason">🔍 原因：行业周期调整+估值回归</div>
                            <div class="a-sector-impact">💡 参考：长期看好但短期可能继续调整</div>
                        </div>
                    </div>
                    <div class="a-sector-item down">
                        <div class="a-sector-main" onclick="toggleSectorDetail(this)">
                            <span class="a-sector-rank">5</span>
                            <span class="a-sector-name">算力概念</span>
                            <span class="a-sector-change">-3.8%</span>
                        </div>
                        <div class="a-sector-detail">
                            <div class="a-sector-explain">📌 AI计算能力相关公司</div>
                            <div class="a-sector-reason">🔍 原因：前期涨幅过大+获利回吐</div>
                            <div class="a-sector-impact">💡 参考：AI长期趋势不变，短期需消化估值</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getSectorReadiness(sector) {
    const ready = sector.targets.filter(target => {
        const confirmation = getPaperEntryConfirmation(target, { score: Math.round(sector.score / 10), type: '板块' }, {});
        const threshold = target.kind === 'Stock' ? 86 : 62;
        return confirmation.score >= threshold;
    }).length;
    const hot = sector.targets.some(target => typeof target.pct === 'number' && target.pct > 4 || typeof target.fiveDayPct === 'number' && target.fiveDayPct > 8);
    if (sector.bias === '过热' || hot) {
        return {
            label: '状态：过热',
            action: '不追高，等回踩或下一轮确认。',
            link: '代表资产可能在交易池里，但模拟盘会用确认分和冷却期过滤。'
        };
    }
    if (ready > 0) {
        return {
            label: '状态：可验证',
            action: `已有 ${ready} 个代表资产接近模拟盘条件。`,
            link: '可回到交易池情报查看确认分，再看模拟盘是否已记录。'
        };
    }
    if (sector.score >= 70) {
        return {
            label: '状态：升温',
            action: '主线值得看，但还要等价格和成交量确认。',
            link: '交易池会先放入观察或等待确认，不急着模拟买入。'
        };
    }
    return {
        label: '状态：观察',
        action: '目前更像背景信息，不作为主要出手依据。',
        link: '只有后续新闻、价格和确认分共振，才会进入交易池高优先级。'
    };
}

function renderSectorTargetBadge(target) {
    const pct = typeof target.pct === 'number' ? ` <em>${target.pct >= 0 ? '+' : ''}${target.pct.toFixed(2)}%</em>` : '';
    const trend = typeof target.fiveDayPct === 'number' ? ` <em>5日${target.fiveDayPct >= 0 ? '+' : ''}${target.fiveDayPct.toFixed(1)}%</em>` : '';
    const layer = getTradePoolLayer(target);
    return `<b>${safeText(target.name)} ${safeText(target.code)} <em>${safeText(layer)}</em>${pct}${trend}</b>`;
}

function getSectorProfiles() {
    return [
        {
            name: '港股科技 / 中国资产',
            themes: ['hk-tech', 'china-beta'],
            keywords: /港股|恒指|恒生|科指|腾讯|阿里|美团|中国资产|china|hong kong/,
            watch: '南向资金、恒生科技、腾讯/阿里/美团，以及人民币风险偏好。',
            reason: '港股弹性大，全球资金一旦重新相信中国资产，通常先冲流动性好的互联网和恒生科技。',
            beginner: '这条线像“便宜但脾气大”的资产，涨起来快，回撤也不客气。'
        },
        {
            name: '人工智能 / 算力 / 半导体',
            themes: ['ai', 'semiconductor', 'a-tech', 'infrastructure'],
            keywords: /人工智能|算力|芯片|半导体|数据中心|openai|spacex|alphabet|nvidia|\bai\b/,
            watch: '美股AI龙头、港股科网、A股芯片ETF，以及数据中心资本开支。',
            reason: '热钱仍在交易AI资本开支，但利率上行会压估值，所以现在更适合看强弱分化。',
            beginner: 'AI不是没人看了，是大家开始挑“真能赚钱的AI”。'
        },
        {
            name: '黄金 / 避险资产',
            themes: ['gold', 'cash'],
            keywords: /黄金|储备资产|央行|外汇储备|gold|reserve/,
            watch: '黄金ETF、短债、央行储备变化，以及美元和实际利率。',
            reason: '当黄金替代美债成为储备叙事时，资金交易的是信任迁移和避险需求。',
            beginner: '大家不是突然爱金子，是对纸面信用有点不放心。'
        },
        {
            name: '利率 / 美债 / 现金底仓',
            themes: ['bond', 'cash'],
            keywords: /美债|收益率|通胀|加息|降息|pimco|inflation|yield|fed/,
            watch: '短债ETF、长债ETF、美元、美股成长股估值。',
            reason: '利率是全球资产的总水阀，收益率上行会压制成长股，收益率下行才利好风险资产。',
            beginner: '水龙头拧紧，市场就没那么好蹦跶。'
        },
        {
            name: '能源 / 原油 / 地缘风险',
            themes: ['energy', 'oil'],
            keywords: /原油|油价|能源|伊朗|霍尔木兹|中东|战争|oil|iran|hormuz/,
            watch: '原油基金、能源ETF、通胀预期和航运/供应链风险。',
            reason: '油价上行会同时推升能源利润和通胀担忧，交易方向要看是供给冲击还是需求复苏。',
            beginner: '油价涨，有人赚钱，也有人因为通胀被市场打一巴掌。'
        },
        {
            name: 'A股科技 / 机器人 / 国产替代',
            themes: ['a-tech', 'china-tech', 'semiconductor'],
            keywords: /a股|科创|机器人|宇树|国产替代|中芯|芯片|nvidia alternatives/,
            watch: '芯片ETF、中芯国际、宁德/比亚迪产业链和政策催化。',
            reason: 'A股科技更吃政策和主题确认，热钱会看国产替代是否从故事变成订单。',
            beginner: '这条线不能只听故事，要看订单和成交量有没有一起上桌。'
        },
        {
            name: '高股息 / 防守现金流',
            themes: ['quality', 'a-financial', 'cash'],
            keywords: /股息|红利|dividend|volatility|现金流|银行|保险/,
            watch: '高股息、银行保险、短债和现金流稳定资产。',
            reason: '当波动率上升或风险偏好下降时，资金会回到能分红、能活下来的资产。',
            beginner: '市场害怕时，会先找“饭碗稳”的公司。'
        }
    ];
}

function scoreSectorProfile(profile, text, indices, quoteMap, macro) {
    let score = 30;
    if (profile.keywords.test(text)) score += 28;
    if (macro.aiCapex && profile.themes.some(t => ['ai', 'semiconductor', 'infrastructure', 'hk-tech', 'a-tech'].includes(t))) score += 12;
    if (macro.chinaSupport && profile.themes.some(t => ['china-beta', 'hk-tech', 'a-tech', 'china-tech'].includes(t))) score += 12;
    if (macro.oilShock && profile.themes.some(t => ['oil', 'energy', 'gold'].includes(t))) score += 14;
    if (macro.rateUp && profile.themes.some(t => ['bond', 'cash', 'gold', 'quality'].includes(t))) score += 10;
    if (macro.riskOff && profile.themes.some(t => ['gold', 'cash', 'quality'].includes(t))) score += 10;
    if (Number(indices.hkHSI?.change || 0) > 1 && profile.themes.includes('hk-tech')) score += 10;
    if (Number(indices.sh000001?.change || 0) > 0.3 && profile.themes.includes('china-beta')) score += 6;

    const targets = getTradeCandidateUniverse()
        .filter(target => target.themes.some(theme => profile.themes.includes(theme)))
        .map(target => scoreTradeTarget(attachQuote(target, quoteMap || {}), { type: '板块', marketBias: [] }, macro))
        .filter(target => target.modelScore >= 0)
        .sort((a, b) => b.modelScore - a.modelScore);
    const picked = diversifyTradeTargets(targets, 4, '板块');
    const hot = picked.filter(t => typeof t.pct === 'number' && t.pct > 2).length;
    const overheated = picked.some(t => typeof t.pct === 'number' && t.pct > 5 || typeof t.fiveDayPct === 'number' && t.fiveDayPct > 8);
    score += Math.min(12, hot * 4);

    return {
        ...profile,
        score: Math.min(99, Math.round(score)),
        bias: overheated ? '过热' : score >= 70 ? '升温' : '观察',
        targets: picked
    };
}

function buildPaperTradeHtml(hotNews, quoteMap, macro, cloudSnapshot = null, marketContext = null) {
    const hasCloudTrades = Array.isArray(cloudSnapshot?.trades);
    const modelVersion = cloudSnapshot?.version || 7;
    const candidates = hasCloudTrades ? cloudSnapshot.candidates || [] : getPaperTradeCandidates(hotNews, quoteMap, macro);
    const trades = hasCloudTrades ? refreshPaperTradesForDisplay(cloudSnapshot.trades, quoteMap, macro) : updatePaperTrades(candidates, quoteMap, macro);
    const effectiveTrades = trades.filter(trade => trade.status !== '重复剔除');
    const activeTrades = effectiveTrades.filter(trade => trade.status !== '过期').slice(0, 8);
    const closedTrades = trades.filter(isPaperTradeClosed);
    const wins = closedTrades.filter(trade => Number(trade.finalPnlPct ?? trade.pnlPct) > 0).length;
    const winRate = closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : null;
    const avgPnl = closedTrades.length ? closedTrades.reduce((sum, trade) => sum + Number(trade.finalPnlPct ?? trade.pnlPct ?? 0), 0) / closedTrades.length : null;
    const portfolio = getPaperPortfolioStats(trades);
    const phaseStats = getPaperPhaseStats(trades);
    const factorReport = cloudSnapshot?.stats?.factorModelReport || null;

    return `
        <div class="a-radar-intro">
            <div class="a-radar-kicker">模型模拟盘 v${safeText(modelVersion)} · ${hasCloudTrades ? '云端自动' : '本地预览'}</div>
            <div class="a-radar-copy">用10万元虚拟本金验证模型：新闻只做催化线索，入池要同时看催化、价格、资金、质量、风险五因子。目标是训练投研助手，不承诺固定收益。${hasCloudTrades ? `云端最近更新：${formatPaperUpdateTime(cloudSnapshot.updateTime)}` : '打开网页时本地生成，云端数据可用后会自动接管。'}</div>
        </div>
        <div class="paper-score-grid">
            <div class="paper-score-card">
                <span>样本</span>
                <b>${effectiveTrades.length}</b>
            </div>
            <div class="paper-score-card">
                <span>胜率</span>
                <b>${winRate === null ? '待观察' : `${winRate}%`}</b>
            </div>
            <div class="paper-score-card">
                <span>平均收益</span>
                <b>${avgPnl === null ? '待观察' : `${avgPnl >= 0 ? '+' : ''}${avgPnl.toFixed(2)}%`}</b>
            </div>
            <div class="paper-score-card">
                <span>虚拟权益</span>
                <b>${formatMoney(portfolio.equity)}</b>
            </div>
            <div class="paper-score-card">
                <span>总仓位</span>
                <b>${portfolio.exposurePct.toFixed(0)}%</b>
            </div>
            <div class="paper-score-card">
                <span>预警</span>
                <b>${portfolio.alerts}</b>
            </div>
        </div>
        <div class="paper-phase-grid">
            ${phaseStats.map(renderPaperPhaseCard).join('')}
        </div>
        ${renderPaperFactorReport(factorReport)}
        <div class="a-flow-list">
            <div class="paper-toolbar">
                <span>纪律：单标的≤15%，动态权益≤${getPaperPortfolioCap(macro)}%，10日必须复盘。${marketContext?.riskMode ? `当前模式：${safeText(marketContext.riskMode)}` : ''}</span>
                <button onclick="resetPaperTrades()">清空重测</button>
            </div>
            <div class="a-flow-disclaimer">${hasCloudTrades ? '云端模拟盘每个交易日约每2小时自动跑一次；旧信号保留复盘，新信号按模型规则加入。' : '模拟盘会自动记录“观察池”标的。'}桥水式思路只借鉴公开原则：先分散风险，再用纪律验证，不把单条新闻当神谕。这里是模型验证，不是真实交易建议。</div>
            ${activeTrades.length ? activeTrades.map(renderPaperTradeCard).join('') : '<div class="a-flow-disclaimer">暂时没有可记录的模拟信号。模型没出手，也是一种纪律。</div>'}
        </div>
    `;
}

function refreshPaperTradesForDisplay(trades, quoteMap, macro = {}) {
    const today = new Date().toISOString().slice(0, 10);
    const refreshed = (trades || []).map(trade => {
        const quote = quoteMap?.[trade.symbol] || {};
        const currentPrice = quote.price || trade.currentPrice || trade.entryPrice;
        const pnlPct = trade.entryPrice ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100 : trade.pnlPct;
        const ageDays = Math.max(0, Math.floor((new Date(today) - new Date(trade.entryDate)) / 86400000));
        const modelTarget = getPaperTargetForTrade(trade);
        const confirmation = { score: trade.confirmationScore || 65 };
        const allocationPct = getPaperAllocationPct(modelTarget, { score: trade.score || 4 }, macro, confirmation);
        const allocationReason = getPaperAllocationReason(modelTarget, macro, confirmation);
        const capital = trade.capital || 100000;
        const entryValue = capital * (allocationPct / 100);
        const currentValue = entryValue * (1 + (pnlPct || 0) / 100);
        return {
            ...trade,
            allocationPct,
            allocationReason: trade.allocationReason || allocationReason,
            capital,
            entryValue,
            currentValue,
            currentPrice,
            pnlPct,
            ageDays,
            status: getPaperTradeStatus({ pnlPct, ageDays, score: trade.score || 4 })
        };
    });
    return applyPaperRiskControls(refreshed, macro);
}

function getPaperTradeGateHtml() {
    return `
        <div class="paper-lock">
            <div class="a-radar-intro">
                <div class="a-radar-kicker">模拟盘验证 · 权限访问</div>
                <div class="a-radar-copy">这里会记录模型信号和虚拟收益，需要密码后才能查看。</div>
            </div>
            <div class="paper-lock-box">
                <input id="paperTradePassword" class="paper-lock-input" type="password" placeholder="输入访问密码" autocomplete="current-password">
                <button class="paper-lock-btn" onclick="unlockPaperTradeAccess()">进入</button>
            </div>
            <div class="paper-lock-error" id="paperTradeError"></div>
            <div class="a-flow-disclaimer">说明：这是前端轻量权限，适合内部试用；真正的站点级权限后续建议接 Cloudflare Access。</div>
        </div>
    `;
}

function isPaperTradeAuthorized() {
    return localStorage.getItem(PAPER_TRADE_AUTH_KEY) === 'yes';
}

function unlockPaperTradeAccess() {
    const input = document.getElementById('paperTradePassword');
    const error = document.getElementById('paperTradeError');
    const value = input ? input.value.trim() : '';
    if (value !== PAPER_TRADE_PASSWORD) {
        if (error) error.textContent = '密码不对，先别偷看模型小账本。';
        return;
    }
    localStorage.setItem(PAPER_TRADE_AUTH_KEY, 'yes');
    const target = document.getElementById('insight-paper');
    const ctx = window._paperTradeContext || {};
    if (target) {
        target.innerHTML = buildPaperTradeHtml(ctx.hotNews || [], ctx.quoteMap || {}, ctx.macro || assessTradeMacroRegime(ctx.hotNews || []), ctx.paperTrades || null);
    }
}

function getPaperTradeCandidates(hotNews, quoteMap, macro) {
    const cards = uniqueTradeCards((hotNews || [])
        .map(news => scoreTradeEvent(news, quoteMap, macro))
        .filter(item => item.score >= 4)
        .sort((a, b) => b.score - a.score))
        .slice(0, 5);
    const seen = new Set();
    const candidates = [];
    cards.forEach(card => {
        card.targets.forEach(target => {
            if (seen.has(target.symbol) || !target.price) return;
            const confirmation = getPaperEntryConfirmation(target, card, macro);
            const threshold = target.kind === 'Stock' ? 86 : 62;
            if (confirmation.score < threshold) return;
            seen.add(target.symbol);
            const allocationReason = getPaperAllocationReason(target, macro, confirmation);
            const actionPlan = getPaperActionPlan({ ...target, confirmationScore: confirmation.score, entryFactors: confirmation.factors, allocationReason }, macro);
            candidates.push({
                symbol: target.symbol,
                code: target.code,
                name: target.name,
                market: target.market,
                kind: target.kind,
                entryPrice: target.price,
                allocationPct: getPaperAllocationPct(target, card, macro, confirmation),
                portfolioCap: getPaperPortfolioCap(macro),
                riskMode: getPaperRiskMode(macro),
                allocationReason,
                eventTitle: card.title,
                eventType: card.type,
                score: card.score,
                confirmationScore: confirmation.score,
                confirmationReasons: confirmation.reasons,
                entryFactors: confirmation.factors,
                actionPlan
            });
        });
    });
    return candidates.slice(0, 8);
}

function getPaperEntryConfirmation(target, card, macro) {
    const factors = getPaperEntryFactors(target, card, macro);
    const score = Object.values(factors).reduce((sum, value) => sum + value, 0);
    const reasons = getPaperEntryFactorReasons(factors, target);
    return {
        score: Math.max(0, Math.min(100, Math.round(score))),
        reasons: reasons.slice(0, 4),
        factors
    };
}

function getPaperEntryFactors(target, card, macro) {
    const hasTheme = theme => (target.themes || []).includes(theme);
    let catalyst = Math.min(20, Math.max(6, Number(card.score || 4) * 2));
    if (target.modelScore >= 72) catalyst += 3;

    let price = 10;
    if (typeof target.pct === 'number') {
        if (target.pct > 4 || target.pct < -5) price -= 6;
        else if (target.pct >= 0.2 && target.pct <= 3) price += 6;
        else if (target.pct > -2) price += 2;
    }
    if (typeof target.fiveDayPct === 'number') {
        if (target.fiveDayPct >= 1 && target.fiveDayPct <= 6) price += 5;
        if (target.fiveDayPct > 8 || target.fiveDayPct < -6) price -= 6;
    }
    if (typeof target.heat === 'number') {
        if (target.heat > 0.88) price -= 4;
        else if (target.heat >= 0.35 && target.heat <= 0.82) price += 3;
    }

    let flow = target.hasQuote ? 10 : 8;
    if (!target.hasQuote || target.liquidityPass) flow += 8;
    else flow -= 10;
    if (typeof target.pct === 'number' && target.pct > 0 && typeof target.fiveDayPct === 'number' && target.fiveDayPct > 0) flow += 2;

    let quality = target.kind === 'ETF' ? 15 : 9;
    if (hasTheme('quality') || hasTheme('cash') || hasTheme('gold') || hasTheme('bond')) quality += 4;
    if (target.kind === 'Stock') quality -= 2;

    let risk = 10;
    const macroFit =
        (macro.aiCapex && (hasTheme('ai') || hasTheme('semiconductor') || hasTheme('infrastructure'))) ||
        (macro.oilShock && (hasTheme('energy') || hasTheme('oil') || hasTheme('gold'))) ||
        (macro.riskOff && (hasTheme('cash') || hasTheme('gold'))) ||
        (macro.chinaSupport && (hasTheme('china-beta') || hasTheme('hk-tech') || hasTheme('consumer')));
    if (macroFit) risk += 8;
    if (macro.riskOff && target.kind === 'Stock') risk -= 8;
    if ((macro.rateUp || macro.riskOff) && (hasTheme('us-growth') || hasTheme('semiconductor') || hasTheme('hk-tech') || hasTheme('a-tech'))) risk -= 4;

    return {
        catalyst: clampFactor(catalyst),
        price: clampFactor(price),
        flow: clampFactor(flow),
        quality: clampFactor(quality),
        risk: clampFactor(risk)
    };
}

function clampFactor(value) {
    return Math.max(0, Math.min(20, Math.round(value)));
}

function getPaperEntryFactorReasons(factors, target) {
    const labels = [
        ['catalyst', '催化'],
        ['price', '价格'],
        ['flow', '资金'],
        ['quality', '质量'],
        ['risk', '风险']
    ];
    return labels
        .sort((a, b) => factors[b[0]] - factors[a[0]])
        .map(([key, label]) => `${label}${factors[key]}/20`)
        .concat(target.kind === 'Stock' ? ['个股高门槛'] : ['ETF/基金优先验证']);
}

function getPaperActionPlan(trade, macro = {}) {
    const confirm = Number(trade.confirmationScore || 0);
    const riskMode = getPaperRiskMode(macro);
    const isStock = trade.kind === 'Stock';
    const entryWindow = confirm >= 86
        ? '模拟窗口：今日到下一个交易日，等待分时回落或收盘确认后记录。'
        : confirm >= 72
            ? '模拟窗口：未来1-3个交易日，只在回踩不破时记录。'
            : '模拟窗口：只观察，不急着记录新仓。';
    const buyWhat = `${trade.name || ''} ${trade.code || ''}，${isStock ? '个股小仓验证' : '基金/ETF方向验证'}。`;
    const factorText = trade.entryFactors ? `五因子：催化${trade.entryFactors.catalyst}/价格${trade.entryFactors.price}/资金${trade.entryFactors.flow}/质量${trade.entryFactors.quality}/风险${trade.entryFactors.risk}。` : '';
    const buyWhy = `入场确认 ${confirm || '旧样本'}/100，当前为${riskMode}模式；${factorText}${trade.allocationReason || '按模型纪律控制仓位'}。`;
    const sellWhen = isStock
        ? '卖出纪律：个股盈利10%先复盘，亏损-6%先退出，持有满7-10日必须给结论。'
        : '卖出纪律：ETF/基金盈利10%-18%复盘，亏损-8%退出，持有满10日必须给结论。';
    return { entryWindow, buyWhat, buyWhy, sellWhen };
}

function updatePaperTrades(candidates, quoteMap, macro = {}) {
    const key = 'paper_trade_signals_v1';
    const today = getPaperTradeToday();
    const canOpenNewTrade = isPaperTradingDay(today);
    let trades = [];
    try {
        trades = JSON.parse(localStorage.getItem(key) || '[]');
    } catch(e) {
        trades = [];
    }

    trades = markPaperDuplicateTrades(trades);

    if (canOpenNewTrade) {
        candidates.forEach(candidate => {
            const id = `${today}-${candidate.symbol}-${candidate.eventType}`;
            if (trades.some(trade => trade.id === id)) return;
            if (hasPaperCooldownTrade(trades, candidate.symbol, today)) return;
            trades.unshift({
                ...candidate,
                id,
                entryDate: today,
                status: '观察中',
                capital: 100000
            });
        });
    }

    trades = trades.slice(0, 40).map(trade => {
        if (isPaperTradeClosed(trade) || trade.status === '重复剔除') return trade;
        const quote = quoteMap?.[trade.symbol] || {};
        const currentPrice = quote.price || trade.currentPrice || trade.entryPrice;
        const pnlPct = trade.entryPrice ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100 : null;
        const ageDays = Math.max(0, Math.floor((new Date(today) - new Date(trade.entryDate)) / 86400000));
        const modelTarget = getPaperTargetForTrade(trade);
        const confirmation = { score: trade.confirmationScore || 65 };
        const allocationPct = getPaperAllocationPct(modelTarget, { score: trade.score || 4 }, macro, confirmation);
        const allocationReason = getPaperAllocationReason(modelTarget, macro, confirmation);
        const capital = trade.capital || 100000;
        const entryValue = capital * (allocationPct / 100);
        const currentValue = entryValue * (1 + (pnlPct || 0) / 100);
        const checkpoints = trade.status === '仓位等待' || trade.status === '重复剔除'
            ? trade.checkpoints || {}
            : updatePaperCheckpoints(trade.checkpoints || {}, pnlPct, ageDays, today);
        const updatedTrade = {
            ...trade,
            allocationPct,
            allocationReason: trade.allocationReason || allocationReason,
            capital,
            entryValue,
            currentValue,
            currentPrice,
            pnlPct,
            ageDays,
            checkpoints,
            status: getPaperTradeStatus({ pnlPct, ageDays, score: trade.score || 4 })
        };
        return closePaperTradeIfNeeded(updatedTrade, today);
    });
    trades = applyPaperRiskControls(trades, macro);

    localStorage.setItem(key, JSON.stringify(trades));
    return trades;
}

function getPaperTradeToday() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

function isPaperTradingDay(dateText) {
    const day = new Date(`${dateText}T12:00:00+08:00`).getDay();
    return day >= 1 && day <= 5;
}

function markPaperDuplicateTrades(trades) {
    const seen = new Map();
    return [...trades]
        .sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate))
        .map(trade => {
            if (isPaperTradeClosed(trade) || trade.status === '重复剔除') return trade;
            const last = seen.get(trade.symbol);
            if (last && daysBetween(last.entryDate, trade.entryDate) < 10) {
                return { ...trade, status: '重复剔除', entryValue: 0, currentValue: 0, excludedReason: '10日冷却期内重复信号' };
            }
            seen.set(trade.symbol, trade);
            return trade;
        })
        .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
}

function hasPaperCooldownTrade(trades, symbol, today) {
    return trades.some(trade => trade.symbol === symbol && trade.status !== '重复剔除' && daysBetween(trade.entryDate, today) < 10);
}

function daysBetween(start, end) {
    return Math.max(0, Math.floor((new Date(end) - new Date(start)) / 86400000));
}

function applyPaperRiskControls(trades, macro = {}) {
    const maxExposure = getPaperPortfolioCap(macro);
    let exposure = 0;
    const activeIds = new Set();
    const oldestFirst = [...trades].sort((a, b) => {
        const dateDiff = new Date(a.entryDate) - new Date(b.entryDate);
        return dateDiff || String(a.id || '').localeCompare(String(b.id || ''));
    });

    oldestFirst.forEach(trade => {
        if (!isPaperTradeEligibleForCapital(trade)) return;
        const allocation = Math.min(15, Number(trade.allocationPct || 0));
        if (exposure + allocation <= maxExposure) {
            exposure += allocation;
            activeIds.add(trade.id);
        }
    });

    return trades.map(trade => {
        if (!isPaperTradeEligibleForCapital(trade) || activeIds.has(trade.id)) return trade;
        return { ...trade, status: '仓位等待', currentValue: 0, entryValue: 0 };
    });
}

function getPaperAllocationPct(target, card, macro = {}, confirmation = {}) {
    const themes = target.themes || [];
    const hasTheme = theme => themes.includes(theme);
    const isDefensive = hasTheme('cash') || hasTheme('gold') || hasTheme('bond');
    const isGrowth = hasTheme('us-growth') || hasTheme('semiconductor') || hasTheme('hk-tech') || hasTheme('a-tech') || hasTheme('ai');
    let allocation = target.kind === 'Stock' ? (card.score >= 7 ? 4 : 2) : (card.score >= 7 ? 10 : 8);

    if (macro.riskOff || macro.rateUp) {
        if (isDefensive) allocation += 2;
        if (isGrowth) allocation -= 3;
        if (target.kind === 'Stock') allocation -= 1;
    }
    if (macro.rateDown && isGrowth) allocation += 1;
    if (macro.chinaSupport && (hasTheme('china-beta') || hasTheme('hk-tech') || hasTheme('consumer'))) allocation += 1;
    if (Number(confirmation.score || 0) >= 85) allocation += 1;
    if (Number(confirmation.score || 0) < 70) allocation -= 2;

    const min = target.kind === 'Stock' ? 2 : 4;
    const max = target.kind === 'Stock' ? 6 : 12;
    return Math.max(min, Math.min(max, Math.round(allocation)));
}

function getPaperTargetForTrade(trade) {
    const fromUniverse = getTradeCandidateUniverse().find(target => target.symbol === trade.symbol);
    return {
        ...(fromUniverse || {}),
        ...trade,
        themes: fromUniverse?.themes || trade.themes || []
    };
}

function getPaperPortfolioCap(macro = {}) {
    let cap = 70;
    if (macro.riskOff) cap -= 12;
    if (macro.rateUp) cap -= 8;
    if (macro.oilShock) cap -= 5;
    if (macro.rateDown) cap += 6;
    if (macro.chinaSupport && !macro.riskOff) cap += 4;
    return Math.max(45, Math.min(78, cap));
}

function getPaperRiskMode(macro = {}) {
    const cap = getPaperPortfolioCap(macro);
    if (cap <= 50) return '防御';
    if (cap <= 62) return '谨慎';
    if (cap >= 74) return '进攻';
    return '均衡';
}

function getPaperAllocationReason(target, macro = {}, confirmation = {}) {
    const parts = [`${getPaperRiskMode(macro)}模式`];
    const themes = target.themes || [];
    if ((macro.riskOff || macro.rateUp) && themes.some(t => ['us-growth', 'semiconductor', 'hk-tech', 'a-tech', 'ai'].includes(t))) parts.push('成长降权');
    if ((macro.riskOff || macro.rateUp) && themes.some(t => ['cash', 'gold', 'bond'].includes(t))) parts.push('防御保留');
    if (Number(confirmation.score || 0) >= 85) parts.push('确认分高');
    if (Number(confirmation.score || 0) < 70) parts.push('确认分偏低');
    return parts.join(' / ');
}

function getPaperTradeStatus(trade) {
    const stopLoss = trade.kind === 'Stock' ? -6 : -8;
    if (typeof trade.pnlPct === 'number' && trade.pnlPct <= stopLoss) return '止损警报';
    if (typeof trade.pnlPct === 'number' && trade.kind === 'Stock' && trade.pnlPct >= 10) return '止盈复盘';
    if (typeof trade.pnlPct === 'number' && trade.score >= 7 && trade.pnlPct >= 18) return '止盈复盘';
    if (typeof trade.pnlPct === 'number' && trade.score < 7 && trade.pnlPct >= 10) return '止盈复盘';
    if (trade.ageDays >= 10) return '时间复盘';
    if (trade.ageDays >= 3) return '复盘中';
    return '观察中';
}

function closePaperTradeIfNeeded(trade, today) {
    if (isPaperTradeClosed(trade) || ['仓位等待', '重复剔除'].includes(trade.status)) return trade;
    const pnlPct = Number(trade.pnlPct);
    if (Number.isNaN(pnlPct)) return trade;
    const takeProfit = trade.kind === 'Stock' ? 10 : trade.score >= 7 ? 18 : 10;
    const stopLoss = trade.kind === 'Stock' ? -6 : -8;
    let status = '';
    let reason = '';
    if (pnlPct <= stopLoss) {
        status = '止损退出';
        reason = `跌破${stopLoss}%纪律线`;
    } else if (pnlPct >= takeProfit) {
        status = '止盈退出';
        reason = `达到${takeProfit}%止盈复盘线`;
    } else if (trade.ageDays >= 10) {
        status = '时间退出';
        reason = '达到10日复盘窗口';
    }
    if (!status) return trade;
    return {
        ...trade,
        status,
        exitDate: today,
        exitPrice: trade.currentPrice,
        finalPnlPct: Number(pnlPct.toFixed(2)),
        exitReason: reason
    };
}

function updatePaperCheckpoints(checkpoints, pnlPct, ageDays, today) {
    const next = { ...checkpoints };
    [
        { key: 'd1', days: 1 },
        { key: 'd3', days: 3 },
        { key: 'd10', days: 10 }
    ].forEach(point => {
        if (ageDays >= point.days && typeof pnlPct === 'number' && !next[point.key]) {
            next[point.key] = {
                date: today,
                pnlPct: Number(pnlPct.toFixed(2))
            };
        }
    });
    return next;
}

function getPaperPhaseStats(trades) {
    return [
        { key: 'd1', label: '1日' },
        { key: 'd3', label: '3日' },
        { key: 'd10', label: '10日' }
    ].map(phase => {
        const samples = trades.filter(isPaperTradeTracked).map(trade => trade.checkpoints?.[phase.key]).filter(Boolean);
        const wins = samples.filter(item => item.pnlPct > 0).length;
        const avg = samples.length ? samples.reduce((sum, item) => sum + item.pnlPct, 0) / samples.length : null;
        return {
            ...phase,
            samples: samples.length,
            winRate: samples.length ? Math.round((wins / samples.length) * 100) : null,
            avg
        };
    });
}

function renderPaperPhaseCard(phase) {
    return `
        <div class="paper-phase-card">
            <span>${phase.label}复盘</span>
            <b>${phase.winRate === null ? '等样本' : `${phase.winRate}%`}</b>
            <small>${phase.avg === null ? '暂无完成信号' : `均值 ${phase.avg >= 0 ? '+' : ''}${phase.avg.toFixed(2)}% · ${phase.samples}条`}</small>
        </div>
    `;
}

function renderPaperFactorReport(report) {
    if (!report) return '';
    const audit = Array.isArray(report.audit) ? report.audit.slice(0, 6) : [];
    const weights = report.factorWeights || {};
    return `
        <div class="paper-factor-panel">
            <div class="paper-factor-head">
                <span>多因子模型审计</span>
                <b>${safeText(report.selectedCount ?? 0)}/${safeText(report.rawCandidateCount ?? 0)} 入选</b>
            </div>
            <div class="paper-factor-copy">${safeText(report.gate || '模型会同时检查宏观、趋势、资金、事件、风险和资产适配，不强行每天给信号。')}</div>
            <div class="paper-factor-weights">
                ${Object.entries(weights).map(([key, value]) => `<span>${safeText(getPaperFactorLabel(key))} ${safeText(value)}</span>`).join('')}
            </div>
            ${audit.length ? `
                <div class="paper-factor-audit">
                    ${audit.map(renderPaperFactorAuditItem).join('')}
                </div>
            ` : '<div class="a-flow-disclaimer">当前没有候选审计数据，等待云端下一次模型运行。</div>'}
        </div>
    `;
}

function renderPaperFactorAuditItem(item) {
    const passed = item.passed ? '通过' : '未入选';
    const reasons = Array.isArray(item.rejectedReasons) && item.rejectedReasons.length ? item.rejectedReasons.join(' / ') : '已通过全部门槛';
    const components = item.factorComponents || {};
    return `
        <div class="paper-factor-item">
            <div class="paper-factor-title">
                <b>${safeText(item.name)} ${safeText(item.symbol)}</b>
                <span>${safeText(item.factorScore ?? '-')}/${safeText(item.factorThreshold ?? '-')} · ${safeText(passed)}</span>
            </div>
            <div class="paper-factor-bars">
                ${Object.entries(components).map(([key, value]) => `
                    <span>${safeText(getPaperFactorLabel(key))}<em>${safeText(value)}</em></span>
                `).join('')}
            </div>
            <div class="paper-factor-reason">${safeText(reasons)}</div>
        </div>
    `;
}

function getPaperFactorLabel(key) {
    return {
        macroFit: '宏观',
        trend: '趋势',
        flow: '资金',
        eventCatalyst: '事件',
        riskControl: '风控',
        assetFit: '适配'
    }[key] || key;
}

function getPaperPortfolioStats(trades) {
    const active = trades.filter(isPaperTradeActive);
    const equity = active.reduce((sum, trade) => sum + (trade.currentValue || 0), 0);
    const exposurePct = active.reduce((sum, trade) => sum + (trade.allocationPct || 0), 0);
    const alerts = active.filter(trade => ['止损警报', '止盈复盘', '时间复盘'].includes(trade.status)).length;
    return { equity: 100000 - active.reduce((sum, trade) => sum + (trade.entryValue || 0), 0) + equity, exposurePct, alerts };
}

function resetPaperTrades() {
    localStorage.removeItem('paper_trade_signals_v1');
    const target = document.getElementById('insight-paper');
    const ctx = window._paperTradeContext || {};
    if (target) {
        target.innerHTML = buildPaperTradeHtml(ctx.hotNews || [], ctx.quoteMap || {}, ctx.macro || assessTradeMacroRegime(ctx.hotNews || []), null);
    }
}

function isPaperTradeActive(trade) {
    return isPaperTradeEligibleForCapital(trade) && !isPaperTradeClosed(trade);
}

function isPaperTradeTracked(trade) {
    return !['仓位等待', '重复剔除'].includes(trade.status);
}

function isPaperTradeEligibleForCapital(trade) {
    return !['过期', '仓位等待', '重复剔除'].includes(trade.status) && !isPaperTradeClosed(trade);
}

function isPaperTradeClosed(trade) {
    return ['止损退出', '止盈退出', '时间退出'].includes(trade.status);
}

function formatMoney(value) {
    return `¥${Math.round(value || 0).toLocaleString('zh-CN')}`;
}

function formatPaperUpdateTime(value) {
    if (!value) return '等待首次运行';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return safeText(value);
    return date.toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function renderPaperTradeCard(trade) {
    const pnl = typeof trade.pnlPct === 'number' ? `${trade.pnlPct >= 0 ? '+' : ''}${trade.pnlPct.toFixed(2)}%` : '待行情';
    const pnlClass = typeof trade.pnlPct === 'number' && trade.pnlPct < 0 ? 'negative' : 'positive';
    const statusClass = ['止损警报', '止损退出'].includes(trade.status) ? 'negative' : ['止盈复盘', '时间复盘', '止盈退出', '时间退出'].includes(trade.status) ? 'positive' : '';
    const checkpoints = renderPaperCheckpointBadges(trade);
    const playbook = getPaperTradePlaybook(trade);
    const actionPlan = trade.actionPlan || getPaperActionPlan(trade);
    return `
        <div class="a-flow-item">
            <div class="a-flow-main" onclick="toggleFlowDetail(this)">
                <span class="a-flow-category-title">${safeText(trade.market || '')}</span>
                <span class="a-flow-name">${safeText(trade.name)} ${safeText(trade.code)}</span>
                <span class="a-flow-change ${pnlClass}">${pnl}</span>
            </div>
            <div class="a-flow-detail">
                <div class="a-flow-explain">模型来源：${safeText(trade.eventType)} ${safeText(trade.score)}/10，入场确认 ${safeText(trade.confirmationScore || '旧样本')}/100，来自“${safeText(trade.eventTitle)}”。</div>
                <div class="a-flow-meaning">模拟记录：仓位 ${trade.allocationPct}%（${formatMoney(trade.entryValue)}），${trade.allocationReason ? `调仓逻辑：${safeText(trade.allocationReason)}，` : ''}入场 ${safeText(trade.entryDate)}，入场价 ${Number(trade.entryPrice).toFixed(2)}，当前价 ${Number(trade.currentPrice).toFixed(2)}，已观察 ${trade.ageDays} 天。</div>
                <div class="a-flow-meaning">状态：<span class="a-flow-change ${statusClass}">${safeText(trade.status)}</span></div>
                <div class="paper-playbook">
                    <div><span>模拟动作</span><b>${safeText(actionPlan.entryWindow)} ${safeText(actionPlan.buyWhat)} ${safeText(actionPlan.buyWhy)}</b></div>
                    <div><span>入场逻辑</span><b>${safeText(playbook.entry)}</b></div>
                    <div><span>等待原因</span><b>${safeText(playbook.wait)}</b></div>
                    <div><span>退出纪律</span><b>${safeText(playbook.exit)} ${safeText(actionPlan.sellWhen)}</b></div>
                </div>
                <div class="paper-checkpoints">${checkpoints}</div>
                <div class="a-flow-impact">复盘规则：1日看方向，3日看持续性，10日必须复盘退出；跌幅接近 -8% 视为模型警报。</div>
            </div>
        </div>
    `;
}

function getPaperTradePlaybook(trade) {
    const pnl = typeof trade.pnlPct === 'number' ? trade.pnlPct : 0;
    const score = Number(trade.score || 0);
    const isWaiting = trade.status === '仓位等待';
    const isAlert = ['止损警报', '止损退出'].includes(trade.status);
    const isTakeProfit = ['止盈复盘', '止盈退出'].includes(trade.status);
    const isTimeReview = ['时间复盘', '时间退出'].includes(trade.status);
    const eventLabel = trade.eventType || '事件';
    const strength = score >= 8 ? '高分' : score >= 6 ? '中高分' : '普通';

    let entry = `${eventLabel}${strength}信号，先用${trade.kind === 'ETF' ? 'ETF验证方向' : '小仓位监控个股'}，不把新闻热闹直接当买点。`;
    if (trade.eventTitle) entry = `${entry} 触发点：${trade.eventTitle}`;
    if (Array.isArray(trade.confirmationReasons) && trade.confirmationReasons.length) entry = `${entry} 确认项：${trade.confirmationReasons.join('、')}。`;

    let wait = '等待价格继续确认：1日看方向，3日看资金是否持续，没放量就不加码。';
    if (isWaiting) wait = '模型方向认可，但组合总仓位接近70%纪律线，先排队，不为了“看起来有机会”硬挤进去。';
    if (score < 7) wait = '信号分数还没到强确认，适合观察，不适合重仓冲动。';
    if (typeof trade.pnlPct === 'number' && pnl > 0) wait = '已有浮盈，重点从“能不能买”切换到“利润能不能守住”。';
    if (typeof trade.pnlPct === 'number' && pnl < 0) wait = '方向暂时不顺，先看是否跌到止损线，不用急着摊平。';

    let exit = score >= 7 ? '强信号目标：盈利接近18%复盘止盈；亏损到-8%触发止损；第10日无论盈亏都复盘。' : '普通信号目标：盈利接近10%复盘止盈；亏损到-8%触发止损；第10日必须给结论。';
    if (isAlert) exit = '已触发止损警报：模型验证应先退出或降仓，保住本金比证明自己聪明重要。';
    if (isTakeProfit) exit = '已到止盈复盘区：先锁定成果，再判断是否用更小仓位继续跟踪。';
    if (isTimeReview) exit = '已到10日窗口：如果没有明显优势，模型应退出，把资金还给更强信号。';
    if (isWaiting) exit = '未真正占用虚拟仓位，等组合释放仓位后才开始计算完整交易周期。';
    if (trade.status === '重复剔除') exit = '这条是10日冷却期内的重复信号，不参与胜率统计，避免模型被同一主题刷屏带偏。';

    return { entry, wait, exit };
}

function renderPaperCheckpointBadges(trade) {
    return [
        { key: 'd1', label: '1日' },
        { key: 'd3', label: '3日' },
        { key: 'd10', label: '10日' }
    ].map(point => {
        const done = trade.checkpoints?.[point.key];
        if (!done) return `<span>${point.label} 等待</span>`;
        const cls = done.pnlPct >= 0 ? 'positive' : 'negative';
        return `<span class="${cls}">${point.label} ${done.pnlPct >= 0 ? '+' : ''}${done.pnlPct.toFixed(2)}%</span>`;
    }).join('');
}

function uniqueTradeCards(cards) {
    const seen = new Set();
    return cards.filter(card => {
        const key = `${card.type}-${card.title.replace(/[^\u4e00-\u9fa5a-z0-9]/gi, '').slice(0, 18)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function renderTradePoolCard(card, macro) {
    const primaryTarget = card.targets[0] ? renderTradePoolTargetBadge(card.targets[0], card, macro) : '';
    return `
        <div class="a-flow-item trade-card">
            <div class="a-flow-main" onclick="toggleFlowDetail(this)">
                <div class="trade-card-top">
                    <span class="a-flow-category-title">${safeText(card.type)}</span>
                    <span class="a-flow-change ${card.score >= 7 ? 'positive' : ''}">${card.score}/10</span>
                </div>
                <div class="a-flow-name">${safeText(card.title)}</div>
                <div class="trade-card-preview">
                    <span>${card.score >= 7 ? '观察池' : '监控池'}</span>
                    ${primaryTarget}
                </div>
            </div>
            <div class="a-flow-detail">
                <div class="a-flow-explain">事件判断：${safeText(card.reason)}</div>
                <div class="a-flow-meaning">交易池状态：${safeText(card.status)}</div>
                <div class="a-target-list">
                    <span>模型筛选</span>
                    ${card.targets.map(target => renderTradePoolTargetBadge(target, card, macro)).join('')}
                </div>
                <div class="a-flow-impact">操作提示：${safeText(card.action)}</div>
            </div>
        </div>
    `;
}

function renderTradePoolTargetBadge(target, card, macro) {
    const meta = getTradePoolTargetMeta(target, card, macro);
    const statusClass = meta.status === '可进模拟盘' ? 'ready' : meta.status === '不追高' ? 'hot' : '';
    const quote = typeof target.pct === 'number' ? ` <em>${target.pct >= 0 ? '+' : ''}${target.pct.toFixed(2)}%</em>` : '';
    const trend = typeof target.fiveDayPct === 'number' ? ` <em>5日${target.fiveDayPct >= 0 ? '+' : ''}${target.fiveDayPct.toFixed(1)}%</em>` : '';
    return `<b class="trade-target-badge ${statusClass}">${safeText(target.name)} ${safeText(target.code)} <em>${safeText(meta.layer)}</em> <em>${meta.confirmationScore}/${meta.threshold}</em> <em>${safeText(meta.status)}</em>${quote}${trend}</b>`;
}

function scoreTradeEvent(news, quoteMap, macro) {
    const title = news.titleZh || news.title_zh || news.title || '事件更新';
    const detail = news.detailZh || news.detail_zh || news.detail || '';
    const text = `${title} ${detail}`.toLowerCase();
    const base = Math.min(8, Math.max(4, Math.round((Number(news.score || 28) - 10) / 6)));
    const profile = getTradeProfile(text);
    const score = Math.min(10, Math.max(4, base + profile.bonus));
    const targets = selectTradeTargets(profile, quoteMap, macro);
    const hotTarget = targets.find(target => typeof target.pct === 'number' && target.pct > 4);
    const surgeTarget = targets.find(target => typeof target.fiveDayPct === 'number' && target.fiveDayPct > 8);
    const overheatedTarget = targets.find(target => typeof target.heat === 'number' && target.heat > 0.88);
    const weakTarget = targets.find(target => typeof target.pct === 'number' && target.pct < -5);
    const illiquidTarget = targets.find(target => target.hasQuote && !target.liquidityPass);
    const singleStockTarget = targets.find(target => target.isStock);
    const quoteStatus = hotTarget ? `实时过滤：${hotTarget.name} 当日涨幅偏高，模型提示不要追高。` : surgeTarget ? `趋势过滤：${surgeTarget.name} 5日涨幅偏高，事件窗口可能已被交易。` : overheatedTarget ? `热度过滤：${overheatedTarget.name} 接近52周高位，先等回撤或基本面确认。` : weakTarget ? `实时过滤：${weakTarget.name} 跌幅偏大，先等止跌确认。` : illiquidTarget ? `实时过滤：${illiquidTarget.name} 成交额不足，先不进入可操作状态。` : singleStockTarget ? `排雷过滤：${singleStockTarget.name} 是个股，财报排雷未接入前只进监控池。` : '实时过滤：未触发追高、急跌、流动性或热度警报，可继续观察。';

    return {
        title: normalizeTradeTitle(title, profile.type),
        type: profile.type,
        score,
        targets,
        reason: profile.reason,
        status: `${score >= 7 && !singleStockTarget ? '进入观察池，可等确认后分批；若已连续大涨，自动降级为等待。' : '进入监控池，先看成交量、估值热度、财报排雷和事件是否仍在 T0-T3 窗口。'}${quoteStatus}`,
        action: hotTarget || surgeTarget || overheatedTarget ? '操作提示：当前不追高，等回撤或放量确认；若事件逻辑未变，可保留观察。' : illiquidTarget ? '操作提示：成交额不足时不做主动交易，优先换成流动性更好的ETF或等待放量。' : singleStockTarget ? '操作提示：个股需等财报排雷和估值确认；当前优先用相关ETF验证方向。' : profile.action
    };
}

function assessTradeMacroRegime(hotNews) {
    const text = (hotNews || []).map(n => `${n.title || ''} ${n.detail || ''} ${n.summary || ''}`).join(' ').toLowerCase();
    const regime = {
        rateUp: /加息|收益率走高|国债下跌|通胀|inflation|yield/.test(text),
        rateDown: /降息|收益率下行|宽松/.test(text),
        oilShock: /油价|原油|霍尔木兹|伊朗|oil|hormuz|iran/.test(text),
        aiCapex: /人工智能|英伟达|芯片|数据中心|openai|anthropic|nvidia|\bai\b|data center/.test(text),
        riskOff: /战争|冲突|停火|制裁|衰退|recession|war|conflict/.test(text),
        chinaSupport: /中国|a股|港股|人民币|证监会|稳增长/.test(text)
    };
    const labels = [];
    if (regime.rateUp) labels.push('利率压力偏高');
    if (regime.oilShock) labels.push('能源和地缘风险升温');
    if (regime.aiCapex) labels.push('人工智能资本开支仍是主线');
    if (regime.riskOff) labels.push('风险偏好需要打折');
    if (regime.chinaSupport) labels.push('中国资产等待政策和数据确认');
    if (regime.rateDown) labels.push('利率下行利好长久期资产');
    return { ...regime, label: labels.join(' / ') || '震荡中性，先看价格确认' };
}

function selectTradeTargets(profile, quoteMap, macro) {
    const typeThemes = {
        '政策类': ['china-beta', 'broker', 'china-tech', 'consumer'],
        '资金行为': ['ai', 'semiconductor', 'us-growth', 'software', 'infrastructure', 'hk-tech', 'a-tech'],
        '供需/地缘': ['energy', 'oil', 'gold', 'defense', 'cash'],
        '宏观类': ['bond', 'cash', 'gold', 'us-growth', 'china-beta', 'hk-beta'],
        '基本面类': ['broad-us', 'quality', 'china-beta', 'hk-beta', 'consumer']
    };
    const allowedThemes = typeThemes[profile.type] || typeThemes['基本面类'];
    const ranked = getTradeCandidateUniverse()
        .filter(target => target.themes.some(theme => allowedThemes.includes(theme)))
        .map(target => scoreTradeTarget(attachQuote(target, quoteMap), profile, macro))
        .filter(target => target.modelScore >= 0)
        .sort((a, b) => b.modelScore - a.modelScore);
    return diversifyTradeTargets(ranked, 4, profile.type);
}

function diversifyTradeTargets(ranked, limit, eventType) {
    const result = [];
    const used = new Set();
    ['美股', '港股', 'A股'].forEach(market => {
        const item = ranked.find(target => target.market === market && !used.has(target.symbol));
        if (item) {
            result.push(item);
            used.add(item.symbol);
        }
    });
    ranked.forEach(target => {
        if (result.length >= limit || used.has(target.symbol)) return;
        result.push(target);
        used.add(target.symbol);
    });
    const hasStock = result.some(target => target.kind === 'Stock');
    const stockCandidate = ranked.find(target => target.kind === 'Stock' && !used.has(target.symbol));
    if (!hasStock && stockCandidate && eventType !== '宏观类' && result.length >= limit) {
        const replaceIndex = result.findIndex(target => target.kind === 'ETF' && target.modelScore < stockCandidate.modelScore + 16);
        if (replaceIndex >= 0) result[replaceIndex] = stockCandidate;
    }
    return result.slice(0, limit);
}

function scoreTradeTarget(target, profile, macro) {
    let modelScore = 50 + (target.kind === 'ETF' ? 8 : -8);
    const hasTheme = theme => target.themes.includes(theme);

    if (macro.rateUp) {
        if (hasTheme('cash')) modelScore += 16;
        if (hasTheme('bond')) modelScore -= 6;
        if (hasTheme('us-growth') || hasTheme('semiconductor')) modelScore -= 10;
    }
    if (macro.rateDown) {
        if (hasTheme('bond') || hasTheme('us-growth')) modelScore += 10;
    }
    if (macro.oilShock) {
        if (hasTheme('energy') || hasTheme('oil') || hasTheme('gold')) modelScore += 14;
        if (hasTheme('us-growth')) modelScore -= 4;
    }
    if (macro.aiCapex && (hasTheme('ai') || hasTheme('semiconductor') || hasTheme('infrastructure'))) modelScore += 12;
    if (macro.riskOff) {
        if (hasTheme('cash') || hasTheme('gold')) modelScore += 10;
        if (target.kind === 'Stock') modelScore -= 10;
    }
    if (macro.chinaSupport && (hasTheme('china-beta') || hasTheme('consumer') || hasTheme('broker'))) modelScore += 8;
    if (profile.marketBias?.includes(target.market)) modelScore += 10;
    if (target.market === '港股' && (hasTheme('hk-tech') || hasTheme('china-beta')) && macro.chinaSupport) modelScore += 6;
    if (target.market === 'A股' && (hasTheme('a-tech') || hasTheme('consumer') || hasTheme('a-financial')) && macro.chinaSupport) modelScore += 6;

    if (typeof target.pct === 'number' && target.pct > 4) modelScore -= 18;
    if (typeof target.pct === 'number' && target.pct < -5) modelScore -= 12;
    if (typeof target.fiveDayPct === 'number' && target.fiveDayPct > 8) modelScore -= 20;
    if (typeof target.heat === 'number' && target.heat > 0.88) modelScore -= 14;
    if (target.hasQuote && !target.liquidityPass) modelScore = -1;

    return {
        ...target,
        modelScore,
        modelTag: target.kind === 'Stock' ? '监控' : modelScore >= 62 ? '观察' : '监控'
    };
}

function getTradeCandidateUniverse() {
    return [
        { name: '纳指100ETF', code: 'QQQ', symbol: 'usQQQ', market: '美股', kind: 'ETF', themes: ['us-growth', 'ai', 'broad-us'] },
        { name: '半导体ETF', code: 'SMH', symbol: 'usSMH', market: '美股', kind: 'ETF', themes: ['semiconductor', 'ai'] },
        { name: '科技精选ETF', code: 'XLK', symbol: 'usXLK', market: '美股', kind: 'ETF', themes: ['us-growth', 'software', 'ai'] },
        { name: '标普500ETF', code: 'SPY', symbol: 'usSPY', market: '美股', kind: 'ETF', themes: ['broad-us', 'quality'] },
        { name: '能源ETF', code: 'XLE', symbol: 'usXLE', market: '美股', kind: 'ETF', themes: ['energy'] },
        { name: '美国原油基金', code: 'USO', symbol: 'usUSO', market: '美股', kind: 'ETF', themes: ['oil'] },
        { name: '黄金ETF', code: 'GLD', symbol: 'usGLD', market: '美股', kind: 'ETF', themes: ['gold'] },
        { name: '长债ETF', code: 'TLT', symbol: 'usTLT', market: '美股', kind: 'ETF', themes: ['bond'] },
        { name: '短债ETF', code: 'SHV', symbol: 'usSHV', market: '美股', kind: 'ETF', themes: ['cash'] },
        { name: '盈富基金', code: '2800', symbol: 'hk02800', market: '港股', kind: 'ETF', themes: ['hk-beta', 'china-beta', 'quality'] },
        { name: '恒生科技ETF', code: '3033', symbol: 'hk03033', market: '港股', kind: 'ETF', themes: ['hk-tech', 'china-beta', 'ai'] },
        { name: '沪深300ETF', code: '510300', symbol: 'sh510300', market: 'A股', kind: 'ETF', themes: ['china-beta'] },
        { name: '上证50ETF', code: '510050', symbol: 'sh510050', market: 'A股', kind: 'ETF', themes: ['china-beta', 'quality'] },
        { name: '证券ETF', code: '512880', symbol: 'sh512880', market: 'A股', kind: 'ETF', themes: ['broker', 'china-beta', 'a-financial'] },
        { name: '芯片ETF', code: '512760', symbol: 'sh512760', market: 'A股', kind: 'ETF', themes: ['semiconductor', 'a-tech', 'china-tech'] },
        { name: '消费ETF', code: '159928', symbol: 'sz159928', market: 'A股', kind: 'ETF', themes: ['consumer'] },
        { name: '国债ETF', code: '511010', symbol: 'sh511010', market: 'A股', kind: 'ETF', themes: ['cash', 'bond'] },
        { name: '英伟达', code: 'NVDA', symbol: 'usNVDA', market: '美股', kind: 'Stock', themes: ['ai', 'semiconductor'] },
        { name: 'IBM', code: 'IBM', symbol: 'usIBM', market: '美股', kind: 'Stock', themes: ['ai', 'infrastructure'] },
        { name: '微软', code: 'MSFT', symbol: 'usMSFT', market: '美股', kind: 'Stock', themes: ['ai', 'software'] },
        { name: '甲骨文', code: 'ORCL', symbol: 'usORCL', market: '美股', kind: 'Stock', themes: ['infrastructure', 'software'] },
        { name: '台积电', code: 'TSM', symbol: 'usTSM', market: '美股', kind: 'Stock', themes: ['semiconductor'] },
        { name: '腾讯控股', code: '00700', symbol: 'hk00700', market: '港股', kind: 'Stock', themes: ['hk-tech', 'ai', 'software', 'china-beta'] },
        { name: '阿里巴巴-W', code: '09988', symbol: 'hk09988', market: '港股', kind: 'Stock', themes: ['hk-tech', 'consumer', 'china-beta'] },
        { name: '美团-W', code: '03690', symbol: 'hk03690', market: '港股', kind: 'Stock', themes: ['hk-tech', 'consumer', 'china-beta'] },
        { name: '小米集团-W', code: '01810', symbol: 'hk01810', market: '港股', kind: 'Stock', themes: ['hk-tech', 'consumer', 'ai'] },
        { name: '小鹏汽车-W', code: '09868', symbol: 'hk09868', market: '港股', kind: 'Stock', themes: ['hk-tech', 'consumer', 'ev'] },
        { name: '比亚迪股份', code: '01211', symbol: 'hk01211', market: '港股', kind: 'Stock', themes: ['ev', 'consumer', 'china-beta'] },
        { name: '贵州茅台', code: '600519', symbol: 'sh600519', market: 'A股', kind: 'Stock', themes: ['consumer', 'quality'] },
        { name: '宁德时代', code: '300750', symbol: 'sz300750', market: 'A股', kind: 'Stock', themes: ['ev', 'a-tech', 'china-beta'] },
        { name: '比亚迪', code: '002594', symbol: 'sz002594', market: 'A股', kind: 'Stock', themes: ['ev', 'consumer', 'china-beta'] },
        { name: '中国平安', code: '601318', symbol: 'sh601318', market: 'A股', kind: 'Stock', themes: ['a-financial', 'quality'] },
        { name: '招商银行', code: '600036', symbol: 'sh600036', market: 'A股', kind: 'Stock', themes: ['a-financial', 'quality'] },
        { name: '中芯国际', code: '688981', symbol: 'sh688981', market: 'A股', kind: 'Stock', themes: ['semiconductor', 'a-tech', 'china-tech'] }
    ];
}

function getTradeProfile(text) {
    const marketBias = getMarketBias(text);
    if (/证监会|监管|新规|政策|治理|a股|上市公司/.test(text)) {
        return {
            type: '政策类',
            bonus: 2,
            marketBias,
            reason: '政策会改变市场风险偏好和估值上限，优先影响大盘、金融和治理改善类资产。',
            action: '若政策落地且指数放量，允许小仓位观察；若只是口头预期，不追。'
        };
    }
    if (/fed|pce|通胀|利率|降息|加息|收益率|美债|recession|经济|gdp|就业|非农|稳定币|inflation|yield/.test(text)) {
        return {
            type: '宏观类',
            bonus: 2,
            marketBias,
            reason: '宏观事件改变利率路径，是股债汇和成长股估值的总开关。',
            action: '若收益率下行，成长股和黄金更舒服；若收益率上行，减轻高估值资产。'
        };
    }
    if (/bank of america|analyst|机构|调研|加仓|top picks|nvidia|apple|\bai\b|人工智能|芯片|数据中心|micron/.test(text)) {
        return {
            type: '资金行为',
            bonus: 1,
            marketBias,
            reason: '机构仍在抱团确定性资产，但科技交易拥挤，最怕收益率上行和估值过热。',
            action: '若美债收益率下行且龙头放量，可分批；若5日连续大涨，模型拒绝追高。'
        };
    }
    if (/oil|opec|原油|油价|能源|伊朗|iran|地缘|war|战争/.test(text)) {
        return {
            type: '供需/地缘',
            bonus: 1,
            marketBias,
            reason: '油价和地缘风险会同时影响通胀预期、避险资金和能源链利润。',
            action: '先看油价和黄金是否同步确认；只有单边消息、没有价格确认时，不重仓。'
        };
    }
    return {
        type: '基本面类',
        bonus: 0,
        marketBias,
        reason: '事件可能影响盈利预期，但需要更多价格和基本面确认。',
        action: '先观察，不急着入场；等成交量和方向确认后再评估。'
    };
}

function getMarketBias(text) {
    const bias = [];
    if (/美股|纳指|标普|道指|wall street|cnbc|alphabet|nvidia|tesla|microsoft|openai|spacex|pimco|美债/.test(text)) bias.push('美股');
    if (/港股|恒指|恒生|科指|腾讯|阿里|美团|小米|小鹏|hk|hong kong/.test(text)) bias.push('港股');
    if (/a股|沪深|上证|深证|创业板|科创板|人民币|证监会|茅台|宁德|比亚迪|中芯/.test(text)) bias.push('A股');
    if (bias.length === 0 && /中国|china/.test(text)) bias.push('港股', 'A股');
    return bias;
}

function renderTargetBadge(target) {
    const market = target.market ? ` <em>${safeText(target.market)}</em>` : '';
    const tag = target.modelTag ? ` <em>${safeText(target.modelTag)}</em>` : '';
    const quote = typeof target.pct === 'number' ? ` <em>${target.pct >= 0 ? '+' : ''}${target.pct.toFixed(2)}%</em>` : '';
    const liquidity = target.hasQuote ? ` <em>${target.liquidityPass ? '量OK' : '量弱'}</em>` : '';
    const trend = typeof target.fiveDayPct === 'number' ? ` <em>5日${target.fiveDayPct >= 0 ? '+' : ''}${target.fiveDayPct.toFixed(1)}%</em>` : '';
    const heat = typeof target.heat === 'number' ? ` <em>${target.heat > 0.88 ? '高位' : '热度OK'}</em>` : '';
    return `<b>${safeText(target.name)} ${safeText(target.code)}${market}${tag}${quote}${trend}${liquidity}${heat}</b>`;
}

function attachQuote(target, quoteMap) {
    const quote = quoteMap[target.symbol] || {};
    return {
        ...target,
        ...quote,
        hasQuote: Boolean(quoteMap[target.symbol]),
        isStock: !/ETF|基金/.test(target.name),
        liquidityPass: !quoteMap[target.symbol] || quote.amount >= getLiquidityFloor(target.symbol)
    };
}

async function loadTradeQuoteMap() {
    const symbols = getTradeCandidateUniverse().map(target => target.symbol);
    try {
        const resp = await fetch(`https://web.sqt.gtimg.cn/q=${symbols.join(',')}`, { headers: { 'Referer': 'https://gu.qq.com' } });
        const text = await resp.text();
        const quoteMap = parseTradeQuotes(text);
        const trendMap = await loadTradeTrendMap(symbols);
        return Object.fromEntries(symbols.map(symbol => [symbol, { ...(quoteMap[symbol] || {}), ...(trendMap[symbol] || {}) }]));
    } catch(e) {
        console.warn('交易池行情加载失败:', e);
        return {};
    }
}

function parseTradeQuotes(text) {
    const map = {};
    (text || '').split(';\n').forEach(line => {
        const matched = line.match(/v_([a-zA-Z0-9]+)="([^"]+)"/);
        if (!matched) return;
        const symbol = matched[1];
        const parts = matched[2].split('~');
        const price = Number(parts[3]);
        const pct = Number(parts[32]);
        const amount = Number(parts[37]);
        const high52 = Number(parts[48]);
        const low52 = Number(parts[49]);
        if (!Number.isNaN(price) && !Number.isNaN(pct)) {
            const heat = !Number.isNaN(high52) && !Number.isNaN(low52) && high52 > low52 ? (price - low52) / (high52 - low52) : undefined;
            map[symbol] = { price, pct, amount: Number.isNaN(amount) ? 0 : amount, heat };
        }
    });
    return map;
}

async function loadTradeTrendMap(symbols) {
    const entries = await Promise.all(symbols.map(async symbol => {
        try {
            const resp = await fetch(`https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${symbol},day,,,6,qfq`);
            const data = await resp.json();
            const rows = data?.data?.[symbol]?.qfqday || data?.data?.[symbol]?.day || [];
            if (rows.length < 2) return [symbol, {}];
            const firstClose = Number(rows[0][2]);
            const lastClose = Number(rows[rows.length - 1][2]);
            if (!firstClose || !lastClose) return [symbol, {}];
            const fiveDayPct = ((lastClose - firstClose) / firstClose) * 100;
            if (Math.abs(fiveDayPct) > 80) return [symbol, {}];
            return [symbol, { fiveDayPct }];
        } catch(e) {
            return [symbol, {}];
        }
    }));
    return Object.fromEntries(entries);
}

function getLiquidityFloor(symbol) {
    if (/^us/i.test(symbol) || /^hk/i.test(symbol)) return 50000000;
    return 5000;
}

function normalizeTradeTitle(title, type) {
    if (/[\u4e00-\u9fa5]/.test(title || '')) {
        const cleaned = String(title)
            .replace(/\bAI\b/g, '人工智能')
            .replace(/\bIPO\b/g, '上市')
            .replace(/\bOpenAI\b/g, '人工智能公司')
            .replace(/\bSpaceX\b/g, '太空公司');
        return cleaned.length > 24 ? `${cleaned.slice(0, 24)}...` : cleaned;
    }
    if (/[A-Za-z]{3,}/.test(title)) {
        const t = title.toLowerCase();
        if (t.includes('european stocks') || t.includes('inflation data')) return '欧洲股市反弹，资金等待通胀数据确认';
        if (t.includes('alphabet') && t.includes('ai')) return 'Alphabet拟融资加码人工智能建设';
        if (t.includes('china') && t.includes('nvidia')) return '中国科技链尝试摆脱英伟达依赖';
        if (type === '资金行为') return '机构资金关注科技龙头';
        if (type === '供需/地缘') return '油价与地缘风险扰动';
        if (type === '宏观类') return '海外宏观数据影响利率预期';
        return '海外事件进入模型观察';
    }
    return title.length > 24 ? `${title.slice(0, 24)}...` : title;
}

function safeText(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function toggleExpertMoodBanner() {
    const banner = document.getElementById('expertMoodBanner');
    const detail = document.getElementById('expertMoodDetail');
    const arrow = document.getElementById('expertMoodArrow');
    if (!banner || !detail || !arrow) return;

    const isOpen = banner.classList.toggle('expanded');
    detail.style.display = isOpen ? 'block' : 'none';
    arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
}

function toggleMarketLinkMap() {
    const map = document.querySelector('.market-link-map');
    const detail = document.getElementById('marketLinkDetail');
    const arrow = document.getElementById('marketLinkArrow');
    if (!map || !detail) return;
    const isOpen = map.classList.toggle('expanded');
    detail.style.display = isOpen ? 'block' : 'none';
    if (arrow) arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
}

function toggleExpertFullView() {
    const detail = document.getElementById('expertFullView');
    const arrow = document.getElementById('expertFullArrow');
    if (!detail) return;
    const isOpen = detail.classList.toggle('expanded');
    detail.style.display = isOpen ? 'block' : 'none';
    if (arrow) arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
}

// ===== 用户反馈 =====
function fbFeedback(expert, type) {
    const key = 'fb_' + expert + '_' + type;
    const count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count.toString());
    const btns = document.querySelectorAll('.a-fb-btn');
    btns.forEach(b => { b.disabled = true; b.style.opacity = '0.5'; });
    const label = document.querySelector('.a-fb-label');
    if (label) label.textContent = type === 'like' ? '已记下：有点东西' : '已记下：先存疑';
    setTimeout(() => {
        btns.forEach(b => { b.disabled = false; b.style.opacity = '1'; });
        if (label) label.textContent = '这个判断';
    }, 2000);
}

// ===== 工具函数 =====
async function loadBriefingData() {
    try {
        const [n, a, g, p] = await Promise.all([
            xhrFetch('data/live-hot-news.json'),
            xhrFetch('data/alerts.json'),
            xhrFetch('data/global-flow.json'),
            xhrFetchOptional('data/paper-trades.json')
        ]);
        return { hotNews: n?.news || [], alerts: a || null, globalFlow: g || null, paperTrades: p || null };
    } catch(e) { return { hotNews: [], alerts: null, globalFlow: null, paperTrades: null }; }
}

function xhrFetchOptional(url) {
    return xhrFetch(url).catch(() => null);
}

function xhrFetch(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url + '?_=' + Date.now() + Math.random(), true);
        xhr.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        xhr.timeout = 8000;
        xhr.onload = () => {
            if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                try { resolve(JSON.parse(xhr.responseText)); } catch(e) { reject(e); }
            } else reject();
        };
        xhr.onerror = () => reject();
        xhr.ontimeout = () => reject();
        xhr.send();
    });
}

function assessMood(hotNews) {
    if (!hotNews || hotNews.length === 0) return { mood: '待更新', icon: '⏳', color: '#0071e3', confidence: 5, dimensions: [] };
    const text = hotNews.map(n => n.title + (n.summary || '')).join('');
    const b = (text.match(/涨|升|新高|反弹|突破|利好/g) || []).length;
    const r = (text.match(/跌|降|新低|回落|利空|风险/g) || []).length;
    return {
        mood: b > r + 2 ? '偏乐观' : r > b + 2 ? '偏谨慎' : '震荡中性',
        icon: b > r + 2 ? '📈' : r > b + 2 ? '📉' : '➖',
        color: b > r + 2 ? '#34c759' : r > b + 2 ? '#ff3b30' : '#ff9500',
        confidence: Math.min(10, Math.max(1, 5 + Math.abs(b - r))),
        dimensions: [
            { label: '📈 趋势', value: b > r + 2 ? '温和上涨' : r > b + 2 ? '偏弱' : '震荡' },
            { label: '💰 全球资金', value: '中性' },
            { label: '🌍 地缘', value: '平稳' },
            { label: '🏭 热点', value: '分散' },
            { label: '😊 情绪', value: Math.abs(b - r) > 3 ? '偏乐观' : '中性' },
            { label: '🏦 宏观', value: '中性' }
        ]
    };
}

function genExperts(hotNews, alerts) {
    if (!hotNews || hotNews.length === 0) return {};
    const t = hotNews.map(h => h.title + (h.summary || '')).join('');
    const hasGeo = /地缘|中东|冲突|战争|协议/.test(t);
    const topTitle = hotNews[0]?.title || '';
    return {
        templeton: { insight: hasGeo ? '中东缓和的本质是风险溢价的释放。逆向视角：当所有人庆祝和平时，关注被错杀的新兴市场资产。' : '当市场没有明确方向时，关注被短期情绪压低估值的优质资产。', action: '关注港股和A股中被低估的消费和科技龙头。' },
        buffett: { insight: '好公司的标准不变：ROE>15%、负债率<50%、现金流>净利润。用这个标准筛选。', action: '关注沪深300和中证500指数基金，每月定投。' },
        munger: { insight: '三层思维：「' + topTitle + '」第一层：今天的新闻改变了什么？第二层：是否过度反应？第三层：最坏情况是什么？', action: '保持60%权益+40%现金/债券的均衡配置。' },
        duan: { insight: '好生意+好管理层+好价格。' + topTitle + '，看得懂的才重仓。', action: '关注苹果、腾讯、拼多多回调后的加仓机会。' }
    };
}

// ===== 折叠/展开市场情绪详情 =====
function toggleMoodDetail() {
    const detail = document.getElementById('moodDetail');
    const arrow = document.getElementById('moodArrow');
    if (!detail || !arrow) return;
    
    const isHidden = detail.style.display === 'none';
    detail.style.display = isHidden ? 'block' : 'none';
    arrow.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
    arrow.style.transition = 'transform 0.2s ease';
}

// ===== 切换洞察标签页 =====
function switchInsightTab(tabName, target) {
    if (tabName === 'paper' && !isPaperTradeAuthorized()) {
        const paper = document.getElementById('insight-paper');
        if (paper) paper.innerHTML = getPaperTradeGateHtml();
    }
    // 更新标签按钮状态
    document.querySelectorAll('.a-insights-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    if (target) target.classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.a-insights-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`insight-${tabName}`).classList.add('active');
    
    // 隐藏提示
    const hint = document.getElementById('tabHint');
    if (hint) {
        hint.style.opacity = '0';
        setTimeout(() => hint.style.display = 'none', 300);
    }
}
// ===== 市场日历点击展开/收起 =====
function toggleCalendarDetail(el) {
    const item = el.closest('.a-calendar-item');
    if (item) {
        item.classList.toggle('expanded');
    }
}

// ===== 资金流向点击展开/收起 =====
function toggleFlowDetail(el) {
    const item = el.closest('.a-flow-item');
    if (item) {
        item.classList.toggle('expanded');
    }
}

// ===== 板块轮动点击展开/收起 =====
function toggleSectorDetail(el) {
    const item = el.closest('.a-sector-item');
    if (item) {
        item.classList.toggle('expanded');
    }
}
