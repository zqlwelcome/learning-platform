/**
 * 智囊团页签 - 方案A
 * 仪表盘风格：渐变情绪卡片 + 进度条 + 圆形达人选择器 + 紧凑解读
 */

let _currentExpert = 'templeton';
const PAPER_TRADE_PASSWORD = 'xbxdsha2026';
const PAPER_TRADE_AUTH_KEY = 'paper_trade_auth_v1';

// ===== 内嵌数据（替代 remote fetch，避免GitHub Pages缓存问题）=====
const _EMBEDDED_DATA = {
    "updateTime": "2026-07-28 06:14",
    "mood": {
        "mood": "偏谨慎，先控风险",
        "icon": "😐",
        "color": "#ff9500",
        "confidence": 10,
        "dimensions": [
            {
                "label": "趋势",
                "value": "主线看 城堡证券：沃什本周或将意外加息，热度在，但不能把热度直接当买点。"
            },
            {
                "label": "资金",
                "value": "资金更偏向有叙事和流动性的方向，例如 英伟达承诺向OpenAI前首席科学家参与创办的企业投资50亿美元；需要成交量继续确认。"
            },
            {
                "label": "宏观",
                "value": "美联储本周维持利率不变的概率63.7% 是今天的估值开关，影响利率、美元和成长股定价。"
            },
            {
                "label": "商品",
                "value": "美国债市：油价大跌推动美债收涨 债券供给压力限制涨幅 提醒黄金/资源类资产不能只看单日涨跌，要看通胀和实际利率。"
            },
            {
                "label": "中国资产",
                "value": "城堡证券：沃什本周或将意外加息 更适合作为结构性线索，看港股/A股是否有资金跟进。"
            },
            {
                "label": "风险",
                "value": "城堡证券：沃什本周或将意外加息 说明地缘和政策仍会突然改变风险偏好，仓位要留余地。"
            }
        ],
        "summary": "今天的市场不是单边行情，而是“科技叙事、利率预期、黄金波动、地缘/政策风险”一起拉扯。对小白投资者更重要的是先判断新闻影响的是情绪、利率、盈利还是资金流，再看价格是否确认。"
    },
    "experts": {
        "templeton": {
            "insight": "邓普顿会先问：大家是不是已经太兴奋了。城堡证券：沃什本周或将意外加息 说明热门主线还在吸引资金，但越热越要找反向证据。真正的机会通常不在最吵的地方，而在被同一条宏观新闻错杀、但基本面没有坏掉的资产里。",
            "action": "不追涨最热芯片/IPO叙事；关注被 美联储本周维持利率不变的概率63.7% 压住估值、但现金流稳定的港股/A股龙头或宽基基金。"
        },
        "buffett": {
            "insight": "巴菲特会把今天的新闻先翻译成现金流问题：利率如果上去，估值就会被压；如果企业有定价权，反而能穿越波动。7月28日美股成交额前20：芯片股普跌，SK海力士破发 可以看，但不能替代财报、负债和自由现金流。",
            "action": "优先看现金流强、负债可控、能分红或回购的公司/ETF；对只靠故事融资、还没证明盈利能力的标的保持距离。"
        },
        "munger": {
            "insight": "芒格会提醒先防蠢：俄亥俄河谷银行Q2净利润下滑30.5%，贷款增长强劲但拨备大幅增加 这种新闻容易让人只看涨跌，不看赔率。好决策要先问最坏情况、拥挤程度和退出纪律，尤其在黄金、AI、IPO同时热的时候。",
            "action": "把仓位拆小，要求“新闻催化 + 价格趋势 + 成交量 + 风控位”同时满足；不满足就只观察，不硬下单。"
        },
        "duan": {
            "insight": "段永平会回到好生意：新闻只是入口，不是买入理由。英伟达承诺向OpenAI前首席科学家参与创办的企业投资50亿美元 背后如果能变成真实订单、利润和用户价值，才值得长期跟踪；否则只是今天热闹。",
            "action": "关注自己看得懂的龙头和指数基金；具体标的要等估值舒服、业务逻辑清楚、模拟盘信号通过后再考虑。"
        }
    }
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
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
            date: '2026-07-09',
            label: '07/09 结果',
            event: '中国6月CPI/PPI公布 + 美国30年期国债拍卖',
            region: '中美价格',
            impact: 'high',
            summary: '结果+市场解读：中国6月CPI同比上涨1.0%、环比下降0.3%，核心CPI同比上涨1.0%；PPI同比上涨4.1%、环比下降0.3%。消费端仍温和，上游同比有支撑但环比不再加速。美国30年期国债拍卖结果在5.058%附近，长端需求没有崩，但高久期资产仍要给更高回报。',
            thesis: '改的是中国盈利预期、政策预期和全球期限溢价。CPI不热，政策仍有空间；PPI同比高但环比降，说明资源利润有支撑，却不是全面通胀重启。',
            assets: 'A股消费、资源周期、化工、有色、港股消费、人民币、30年美债、黄金、全球成长股。',
            flow: '若人民币稳定、消费和港股内需放量，说明资金把低CPI理解为政策空间；若只涨有色、化工和煤油，说明市场只交易上游价格。若30年美债收益率维持5%上方，热钱会更偏美元债和现金，少给高估值成长估值。',
            plan: '如果人民币走稳且消费数据后续改善，可关注消费和顺周期扩散；如果PPI强、CPI弱，倾向只做上游结构；如果美国长端收益率继续上冲，先控制科技成长和港股高β追涨。',
            plain: '中国不是全面涨价，而是上游比下游更硬；美国长债还在提醒市场，高估值资产不能只看故事。'
        },
        {
            date: '2026-07-10',
            label: '07/10-07/13',
            event: '中国6月贸易与信贷社融：外需和宽信用能否接力',
            region: '中国外需/流动性',
            impact: 'high',
            summary: '预期窗口：本次更新时，海关6月进出口和央行信贷社融仍是市场等待的中国数据主线。贸易看外需订单，社融看国内信用是否接力。市场不会只看出口增速或社融总量，要同时看出口量价、进口需求、企业中长期贷款、居民贷款和政府债融资。',
            thesis: '改的是外需盈利、流动性和政策预期。贸易决定出口链现金流，社融决定政策资金是停在银行体系，还是进入地产、制造、消费和股票风险偏好。',
            assets: 'A股出口链、航运、家电、机械、银行、券商、地产链、有色、消费、港股内房、人民币、10年国债。',
            flow: '若出口强、进口改善且中长期信贷回升，资金可能从红利防御扩散到出口制造、券商、地产链和港股β；若顺差靠进口弱撑、居民贷款仍弱，热钱更可能继续买高股息和强产业链，不会全面加仓内需。',
            plan: '如果贸易结构和社融结构同步改善且人民币稳定，可提高顺周期和港股β观察权重；如果只是顺差好看或社融总量冲高但结构弱，倾向继续结构交易，不追内需全面反转。',
            plain: '中国既要有海外订单，也要有国内愿意借钱花钱，股市才更容易从局部行情变成扩散行情。'
        },
        {
            date: '2026-07-14',
            label: '07/14',
            event: '美国6月CPI + 美联储主席国会证词',
            region: '美国通胀',
            impact: 'high',
            summary: '预期窗口：BLS将在7月14日公布6月CPI，美联储主席同日开始半年度货币政策证词。CPI决定市场能否把“增长放慢”交易升级为“政策转松”，证词决定央行是否愿意配合这个想象。要看核心环比、住房、服务和能源，不只看总指数。',
            thesis: '改的是美联储路径、实际利率和全球美元流动性。这是未来两周对债券、黄金和高估值成长最直接的定价开关。',
            assets: '2年美债、美元、黄金、纳指、半导体、比特币、原油、人民币、港股科技。',
            flow: '若核心CPI降温且证词承认增长风险，资金会从美元现金回补债券、黄金和成长；若核心服务仍热且证词偏鹰，2年收益率会反弹，热钱回美元、金融和价值，撤出长久期资产。',
            plan: '如果核心CPI低于预期且2年收益率下行，可关注黄金、债券和科技；如果核心CPI偏强并推高美元，倾向减轻高估值成长与港股高β；如果数据弱但证词不松口，先看市场能不能守住风险偏好。',
            plain: '物价和美联储说法要同向变软，市场才会真相信降息故事。'
        },
        {
            date: '2026-07-15',
            label: '07/15',
            event: '美国6月PPI + 美联储褐皮书',
            region: '美国成本',
            impact: 'high',
            summary: '预期窗口：BLS将在7月15日公布美国6月PPI，美联储同日发布褐皮书。PPI看企业成本是否会传导到CPI，褐皮书看企业真实订单、招聘和价格感受。CPI如果降温但PPI和褐皮书仍热，市场会担心通胀只是暂时缓和。',
            thesis: '改的是通胀预期、利率预期和盈利率预期。PPI偏热会压利润率并推迟宽松；褐皮书若显示需求降温，则债券受益但股票要看盈利承压程度。',
            assets: '2年美债、美元、黄金、纳指、工业股、消费股、银行、原油、港股科技。',
            flow: '若PPI强、企业仍有涨价能力，资金会回美元和短债，撤长久期成长；若PPI降温且褐皮书显示就业温和放慢，资金可能回补长债、黄金和科技。',
            plan: '如果PPI强于预期并推高2年收益率，倾向减轻高估值成长；如果PPI降温且美元走弱，可关注黄金、债券和科技反弹；如果褐皮书显示需求断崖，股票仓位要更谨慎。',
            plain: 'CPI看消费者付多少钱，PPI看企业成本；企业成本降不下来，降息故事就不稳。'
        },
        {
            date: '2026-07-16',
            label: '07/16',
            event: '中国二季度GDP与6月经济数据 + 美国零售销售',
            region: '中美需求',
            impact: 'high',
            summary: '预期窗口：国家统计局7月16日有季度主要行业增加值初步核算报告，市场会同步盯中国二季度GDP、工业、消费、投资和地产链数据；美国人口普查局将在同日公布6月零售销售。一个看中国内需能否扩散，一个看美国消费能否扛住高利率。',
            thesis: '改的是盈利预期、政策预期和利率预期。中国数据决定A股从红利防御能否切到顺周期；美国零售决定美股是软着陆还是衰退交易。',
            assets: 'A股宽基、消费、地产链、制造、港股互联网、人民币、美国零售、银行、美债、美元、原油。',
            flow: '若中国消费、地产和制造同步改善，资金可能从高股息扩散到港股β和顺周期；若美国零售强且收益率温和，资金偏消费、银行和小盘；若零售弱且信用利差扩大，资金只会买债和黄金。',
            plan: '如果中国数据改善且人民币走稳，可提高顺周期和港股β观察权重；如果内需仍弱，继续结构交易；如果美国零售弱但信用稳定，可观察科技修复，若信用恶化则降低股票总仓位。',
            plain: '这一天同时看中美消费者：谁还愿意花钱，谁的股市就更有底气。'
        },
        {
            date: '2026-07-17',
            label: '07/17',
            event: '美国工业产出/住房：高利率是否伤到实体',
            region: '美国增长',
            impact: 'medium',
            summary: '预期窗口：7月17日美国公布工业产出、新屋开工和营建许可。工业看制造投资，住房看利率压力是否继续压实体需求。若实体数据弱但通胀也弱，债券受益；若实体弱而通胀粘，就是股债都难受的组合。',
            thesis: '改的是增长预期、商品需求和期限溢价。工业弱会压铜和原油需求，住房弱会推高降息交易，但信用压力扩大时股票不一定受益。',
            assets: '美债、美元、铜、原油、美国工业链、住宅建筑、银行、黄金、A股周期、港股资源。',
            flow: '若工业和住房同步走弱，资金会从周期和银行转向美债、黄金和防御；若数据稳且收益率不过度上行，资金可能继续持有软着陆交易。看信用利差是否扩大，比只看指数涨跌更重要。',
            plan: '如果数据弱、收益率下行且信用利差稳定，可关注债券和黄金；如果信用利差扩大，倾向降低股票总仓位；如果工业强而收益率跳升，控制高估值成长追涨。',
            plain: '美国高利率到底只是让买房难，还是已经让工厂和企业也放慢，要靠这组数据判断。'
        },
        {
            date: '2026-07-20',
            label: '07/20',
            event: '中国LPR报价窗口：降成本能否变成宽信用',
            region: '中国政策',
            impact: 'high',
            summary: '预期窗口：LPR通常在每月20日附近公布，6月报价为1年期3.00%、5年期以上3.50%。市场不会只奖励“降息”两个字，更看5年期LPR、银行净息差、地产成交和人民币是否能配合。若降息没有信贷和成交确认，容易变成短线政策脉冲。',
            thesis: '改的是政策预期、信用预期和人民币风险溢价。有效降成本利好地产链、消费和港股β；若人民币承压，外资会先看汇率再看股票。',
            assets: 'A股银行、地产链、消费、券商、港股内房、港股互联网、10年国债、人民币、高股息。',
            flow: '若LPR下调且人民币稳定、地产成交改善，资金可能从高股息向顺周期扩散；若只是报价下调但成交无改善，热钱更可能快进快出，继续抱团红利和现金流。',
            plan: '如果5年期LPR下调并出现成交和信贷确认，可提高顺周期观察权重；如果人民币走弱或银行承压，倾向不追地产链急涨，保留高股息底仓思路。',
            plain: '降贷款利率只是第一步，关键是企业和居民愿不愿真的借钱、买房和消费。'
        },
        {
            date: '2026-07-22',
            label: '07/22',
            event: '美国20年期国债拍卖：财政供给压力再定价',
            region: '美元长端',
            impact: 'medium',
            summary: '预期窗口：美国财政部暂定7月22日拍卖20年期国债。它不是普通数据，但会直接测试长钱是否愿意接美国久期供给。若投标弱，期限溢价上行会压科技、黄金和新兴市场；若需求稳，市场会把高收益率理解为可承受。',
            thesis: '改的是期限溢价、实际利率和全球风险偏好。财政供给越难被吸收，长端收益率越容易高位粘住，股票估值就越难扩张。',
            assets: '20年美债、10年美债、美元、黄金、纳指、半导体、港股科技、人民币、A股成长。',
            flow: '若拍卖尾部走阔、长端收益率上行，资金会回美元债和现金，撤高估值成长与新兴市场高β；若长端收益率回落，资金会回补黄金、长债和科技修复。',
            plan: '如果拍卖偏弱并带动10年收益率上破，倾向降低成长股久期风险；如果需求强、美元转弱，可关注黄金、长债和科技反弹，但不追单日急涨。',
            plain: '美国借钱卖债顺不顺，会直接影响全球资产要不要继续给高估值。'
        },
        {
            date: '2026-07-22',
            label: '07/22-07/23',
            event: 'ECB议息会议：能源冲击后的欧元利率方向',
            region: '欧洲央行',
            impact: 'medium',
            summary: '预期窗口：ECB官网日程显示7月22-23日召开货币政策会议。欧洲刚经历能源价格和地缘风险扰动，市场要看央行是继续强调通胀风险，还是转向增长压力。欧债收益率会影响全球长端利率，也会通过欧元牵动美元指数。',
            thesis: '改的是全球利率预期、美元相对强弱和风险偏好。ECB偏鹰会抬欧债收益率、压全球久期；若偏鸽，美元未必弱，要看美国数据是否也降温。',
            assets: '欧元、美元指数、德国国债、美债、黄金、原油、欧洲银行、全球成长股、人民币。',
            flow: '若欧元走强、德债收益率上行，说明资金在交易欧洲抗通胀和高利率；若欧债收益率下行但美元走强，说明市场更担心欧洲增长，资金会回美元和美债。',
            plan: '如果ECB偏鹰且全球长端收益率同步上行，倾向控制成长股久期风险；如果ECB偏鸽、美元不强且黄金走稳，可关注黄金和部分成长修复；若欧元急跌，注意人民币和港股外资压力。',
            plain: '欧洲央行说话会影响欧元和全球利率，不只是欧洲股市自己的事。'
        },
        {
            date: '2026-07-23',
            label: '07/23',
            event: '美国10年期TIPS拍卖：真实利率的压力测试',
            region: '真实利率',
            impact: 'medium',
            summary: '预期窗口：美国财政部暂定7月23日拍卖10年期TIPS。TIPS看的是扣掉通胀后的真实利率，真实利率上行对黄金、科技成长和新兴市场最不友好；真实利率回落，才更容易支持黄金和长久期资产。',
            thesis: '改的是实际利率、通胀补偿和全球流动性偏好。普通国债看名义收益率，TIPS更直接看资金愿意拿多少真实回报。',
            assets: 'TIPS、美债实际利率、黄金、纳指、半导体、比特币、美元、人民币、港股科技。',
            flow: '若TIPS需求弱、实际利率上行，资金会从黄金和成长撤回美元债；若需求强、实际利率回落，资金更容易回补黄金、科技和部分新兴市场高β。',
            plan: '如果实际利率上行且美元同步走强，倾向降低黄金和高估值成长追涨；如果实际利率回落、美元转弱，可关注黄金、科技和港股科技修复。',
            plain: '真实利率越高，钱越愿意躺在美债里，黄金和成长股就越吃力。'
        },
        {
            date: '2026-07-24',
            label: '07/24',
            event: '美联储H.8银行信贷 + 全球PMI预热：风险偏好能否续航',
            region: '信用/景气',
            impact: 'medium',
            summary: '预期窗口：美联储7月24日发布H.8商业银行资产负债表，市场也会提前交易欧美7月PMI初值。银行信贷看信用是否收缩，PMI看订单和就业是否还能托住盈利。若信贷缩、PMI弱，降息预期不一定利好股票，因为盈利预期会先被下修。',
            thesis: '改的是信用流动性、盈利预期和风险偏好。宽松交易要成立，最好是通胀降、信用稳、订单不崩；只要信用开始收缩，股市会从降息交易切到防守交易。',
            assets: '美股银行、小盘股、纳指、美元、美债、黄金、A股出口链、港股科技、原油、铜。',
            flow: '若银行贷款稳、PMI订单不差，资金会留在软着陆交易，偏科技、消费和小盘；若贷款收缩、PMI跌破荣枯线，热钱会转向美债、黄金和防御，撤周期和高β。',
            plan: '如果信用稳定且PMI不弱，可继续观察成长和出口链修复；如果信用收缩并伴随商品下跌，倾向降低周期和高β仓位；如果只有PMI弱但收益率快速下行，先看信用利差是否扩大。',
            plain: '降息预期好不好用，要看银行还愿不愿放贷、企业订单有没有掉下去。'
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
