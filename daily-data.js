/**
 * 智囊团页签 - 方案A
 * 仪表盘风格：渐变情绪卡片 + 进度条 + 圆形达人选择器 + 紧凑解读
 */

let _currentExpert = 'templeton';
const PAPER_TRADE_PASSWORD = 'xbxdsha2026';
const PAPER_TRADE_AUTH_KEY = 'paper_trade_auth_v1';

// ===== 内嵌数据（替代 remote fetch，避免GitHub Pages缓存问题）=====
const _EMBEDDED_DATA = {
    "updateTime": "2026-06-04 01:41",
    "mood": {
        "mood": "谨慎乐观，结构性分化显著",
        "icon": "🤔",
        "color": "#FFA500",
        "confidence": 7,
        "dimensions": [
            {
                "label": "📈 趋势",
                "value": "AI和太空探索成为主线，传统科技承压，比特币回调反映风险偏好切换。"
            },
            {
                "label": "💰 资金",
                "value": "资金从加密货币流向IPO市场，尤其是AI和太空领域，显示追逐高增长确定性。"
            },
            {
                "label": "🌍 地缘",
                "value": "无明显地缘冲击，但IPO热潮可能引发监管关注，尤其是太空和AI领域。"
            },
            {
                "label": "🏭 热点",
                "value": "AI芯片、数据中心、太空探索、量子计算是核心热点，传统金融科技边缘化。"
            },
            {
                "label": "😊 情绪",
                "value": "IPO市场情绪高涨，但投资者对高估值和首年波动保持警惕，情绪分化。"
            },
            {
                "label": "🏦 宏观",
                "value": "利率预期稳定，流动性充裕，但IPO抽血效应加剧市场波动。"
            }
        ],
        "summary": "今日市场情绪偏向谨慎乐观，结构性分化明显。AI和太空探索领域IPO火爆，但比特币下跌反映资金从高风险资产转向确定性增长。投资者需警惕IPO首年波动，但长期看好科技主线。"
    },
    "experts": {
        "templeton": {
            "insight": "邓普顿视角：当前市场充满悲观中的机会。比特币下跌和IPO过热恰恰是逆向布局的时机。Quantinuum和SpaceX的IPO超额认购显示投资者过度乐观，但英特尔和瑞银的AI战略表明技术变革正在加速。我关注被忽视的价值，如传统科技股在AI浪潮中的低估机会。",
            "action": "建议逆向买入英特尔等传统芯片股，利用市场对AI的狂热情绪，在IPO热潮中寻找被低估的标的，同时减持过度炒作的加密货币。"
        },
        "buffett": {
            "insight": "巴菲特视角：投资的核心是护城河和长期价值。SpaceX和Anthropic的IPO虽然吸引眼球，但缺乏历史盈利数据，风险极高。我更看好英特尔在芯片制造领域的深厚积累，以及甲骨文在AI驱动的云服务中的确定性。摩根士丹利开放AI代理是长期趋势，但需观察盈利模式。",
            "action": "建议增持甲骨文和英特尔，避免追逐IPO热潮。关注拥有持久竞争优势和现金流的公司，如数据中心和AI基础设施领域。"
        },
        "munger": {
            "insight": "芒格视角：这些IPO故事听起来美妙，但多数是“幻觉”。SpaceX估值1.75万亿美元？荒谬！Quantinuum超额认购？典型的羊群效应。投资者应该用常识思考：真正的价值在于英特尔这样的公司，它们有实际产品和客户。避免被“新概念”迷惑，坚持理性。",
            "action": "建议远离SpaceX和Quantinuum等估值过高的IPO，专注于英特尔和甲骨文等有实际业绩支撑的公司。保持现金，等待更好的机会。"
        },
        "duan": {
            "insight": "段永平视角：投资就是买好生意。SpaceX和Anthropic是好公司，但IPO价格太贵，不值得。英特尔发布新芯片是好事，但需要时间验证。我更关注瑞银上调甲骨文目标价，因为其AI战略清晰，客户粘性强。摩根士丹利用AI代理管理财富是创新，但要看执行。",
            "action": "建议持有甲骨文和英特尔，等待SpaceX等IPO上市后回调再考虑。不追高，买自己懂的好公司，如AI基础设施和数据中心领域。"
        }
    }
};






































































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
    const tradePoolHtml = await buildAutoTradePoolHtml(briefingData.hotNews || [], quoteMap, macro);
    const sectorHeatHtml = buildSectorHeatHtml(briefingData.hotNews || [], briefingData.globalFlow || {}, quoteMap, macro);
    window._paperTradeContext = { hotNews: briefingData.hotNews || [], quoteMap, macro, paperTrades: briefingData.paperTrades || null };
    const paperTradeHtml = isPaperTradeAuthorized() ? buildPaperTradeHtml(briefingData.hotNews || [], quoteMap, macro, briefingData.paperTrades) : getPaperTradeGateHtml();
    window._expertsData = expertsData;
    
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
    const radarHtml = getForwardRadarHtml();

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
    
    el.innerHTML = quickHtml + moodHtml + `
        <!-- 统一卡片：智囊团 + 市场日历 + 资金流向 + 板块轮动 -->
        <div class="a-insights">
            <div class="a-insights-tabs-wrapper">
                <div class="a-insights-tabs">
                    <button class="a-insights-tab active" onclick="switchInsightTab('braintrust', this)">高手茶话会</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('calendar', this)">本周雷达</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('flow', this)">交易池情报</button>
                    <button class="a-insights-tab" onclick="switchInsightTab('sector', this)">板块热闹榜</button>
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
                    <div class="a-radar-copy">新闻事件自动进模型，覆盖美股、港股、A股，叠加实时涨跌、成交额、5日趋势和热度过滤；单股财报排雷未通过前只进监控。</div>
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
        el.innerHTML = `
            <div class="a-banner">
                <span class="a-bi">${m.icon}</span>
                <div class="a-bn">${m.name}今天怎么想</div>
            </div>
            <div class="a-card" style="border-left-color:${m.color}">
                <div class="a-card-body">${ex.insight.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="a-card a-action" style="border-left-color:${m.color}">
                <div class="a-card-label">如果非要做点什么</div>
                <div class="a-card-body" style="font-weight:500;color:#664d03;">${ex.action || '等待数据更新，先别硬操作。'}</div>
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

function getForwardRadarHtml() {
    const events = [
        {
            date: '2026-06-01',
            label: '06/01',
            event: '美国ISM制造业PMI',
            region: '美国宏观',
            impact: 'high',
            result: '结论：这是本周开盘的第一张体检表，交易员会用它判断美国经济是软着陆，还是需求开始变冷。',
            watch: '强于预期：周期股、工业股可能占优，降息预期降温；弱于预期：债券可能先开心，高估值科技要看利率怎么走。',
            action: '小白看法：别只看数字高低，看市场反应。如果坏数据反而涨，说明资金在交易“降息”；如果好数据也涨，说明风险偏好还很强。'
        },
        {
            date: '2026-06-03',
            label: '06/03',
            event: '美国ISM服务业 + 美联储褐皮书',
            region: '利率预期',
            impact: 'high',
            result: '结论：服务业更接近美国经济真实温度，褐皮书会告诉市场各地区工资、消费和企业信心有没有变弱。',
            watch: '服务业强、工资粘：降息预期会被压；服务业弱、消费冷：市场会重新押注宽松。',
            action: '小白看法：这天重点看美债收益率。收益率上行，成长股估值受压；收益率下行，科技和黄金更容易被资金盯上。'
        },
        {
            date: '2026-06-05',
            label: '06/05',
            event: '美国非农就业报告',
            region: '全球核心',
            impact: 'high',
            result: '结论：这是本周最能改变热钱方向的数据。就业太强，市场担心降息推迟；就业太弱，市场又会担心经济衰退。',
            watch: '最理想剧本是“温和降温”：就业不崩、工资不热，风险资产最舒服。',
            action: '小白看法：非农当天别急着追第一根K线。交易员通常先看就业、工资、失业率三件套，再看市场是不是反应过度。'
        },
        {
            date: '2026-06-10',
            label: '06/10',
            event: '中国通胀和社融窗口期',
            region: '中国资产',
            impact: 'medium',
            result: '结论：中国资产接下来要看政策和信用有没有接力。只靠情绪反弹不够，热钱更想看到真实需求或流动性改善。',
            watch: '社融和信贷改善：A股、港股风险偏好更容易修复；通胀太弱：说明需求还要等政策加码。',
            action: '小白看法：看中国新闻时别只看“利好”两个字，要问钱有没有真的进实体、进股市、进消费。'
        },
        {
            date: '2026-06-16',
            label: '06/16-17',
            event: '美联储FOMC议息会议',
            region: '全球定价锚',
            impact: 'high',
            result: '结论：这是未来两周最大事件。真正重要的不是降不降息，而是点阵图和鲍威尔讲话会不会改变下半年利率路径。',
            watch: '偏鹰：美元和美债收益率上行，成长股承压；偏鸽：黄金、科技、港股和风险资产更容易喘口气。',
            action: '小白看法：FOMC前不要把仓位打满。交易员会等“方向确认”，普通人更要留余地。'
        }
    ];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = events.filter(item => new Date(`${item.date}T00:00:00`) >= today).slice(0, 4);
    const visible = upcoming.length ? upcoming : events.slice(-3);

    return `<div class="a-calendar-list">${visible.map(item => `
        <div class="a-calendar-item expanded">
            <div class="a-calendar-main">
                <span class="a-calendar-date">${item.label}</span>
                <span class="a-calendar-event">${item.event}</span>
                <span class="a-calendar-region">${item.region}</span>
                <span class="a-calendar-impact ${item.impact}">${item.impact}</span>
            </div>
            <div class="a-calendar-detail">
                <div class="a-calendar-explain">${item.result}</div>
                <div class="a-calendar-watch">交易员盯什么：${item.watch}</div>
                <div class="a-calendar-impact-text">${item.action}</div>
            </div>
        </div>
    `).join('')}</div>`;
}

async function buildAutoTradePoolHtml(hotNews, quoteMap = null, macro = null) {
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
            <div class="a-flow-disclaimer">当前宏观底色：${safeText(macro.label)}。参考关注按事件类型、宏观方向、流动性、5日趋势和52周热度动态筛选；不是固定股票清单。</div>
            ${cards.map(card => renderTradePoolCard(card)).join('')}
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
            <div class="a-flow-disclaimer">自动交易池 v5 按交易模型执行：事件分数低于4过滤；美股、港股、A股同池评分；优先ETF/基金验证方向；个股因财报排雷与估值分位未完全接入，默认只进监控池。以下不是无条件买入清单。</div>
        </div>
    `;
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
            <div class="a-radar-kicker">全球热钱板块雷达</div>
            <div class="a-radar-copy">不是看谁今天最吵，而是看资金正在交易哪条主线：利率、AI、黄金、港股科技、A股政策，还是能源风险。</div>
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

function buildPaperTradeHtml(hotNews, quoteMap, macro, cloudSnapshot = null) {
    const hasCloudTrades = Array.isArray(cloudSnapshot?.trades);
    const candidates = hasCloudTrades ? cloudSnapshot.candidates || [] : getPaperTradeCandidates(hotNews, quoteMap, macro);
    const trades = hasCloudTrades ? refreshPaperTradesForDisplay(cloudSnapshot.trades, quoteMap) : updatePaperTrades(candidates, quoteMap);
    const activeTrades = trades.filter(trade => trade.status !== '过期').slice(0, 8);
    const reviewed = trades.filter(trade => typeof trade.pnlPct === 'number' && trade.ageDays >= 1);
    const wins = reviewed.filter(trade => trade.pnlPct > 0).length;
    const winRate = reviewed.length ? Math.round((wins / reviewed.length) * 100) : null;
    const avgPnl = reviewed.length ? reviewed.reduce((sum, trade) => sum + trade.pnlPct, 0) / reviewed.length : null;
    const portfolio = getPaperPortfolioStats(trades);
    const phaseStats = getPaperPhaseStats(trades);

    return `
        <div class="a-radar-intro">
            <div class="a-radar-kicker">模型模拟盘 v4 · ${hasCloudTrades ? '云端自动' : '本地试跑'}</div>
            <div class="a-radar-copy">用10万元虚拟本金验证模型：ETF按8%-10%仓位，个股按4%-6%监控仓，按1日、3日、10日自动记录阶段复盘。${hasCloudTrades ? `云端最近更新：${formatPaperUpdateTime(cloudSnapshot.updateTime)}` : '打开网页时本地生成，云端数据可用后会自动接管。'}</div>
        </div>
        <div class="paper-score-grid">
            <div class="paper-score-card">
                <span>样本</span>
                <b>${trades.length}</b>
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
        <div class="a-flow-list">
            <div class="paper-toolbar">
                <span>纪律：单标的≤15%，权益≤70%，10日必须复盘。</span>
                <button onclick="resetPaperTrades()">清空重测</button>
            </div>
            <div class="a-flow-disclaimer">${hasCloudTrades ? '云端模拟盘每个交易日约每2小时自动跑一次；旧信号保留复盘，新信号按模型规则加入。' : '模拟盘会自动记录“观察池”标的。'}刚生成的信号需要等1日、3日、10日后才有复盘意义；这里是模型验证，不是真实交易建议。</div>
            ${activeTrades.length ? activeTrades.map(renderPaperTradeCard).join('') : '<div class="a-flow-disclaimer">暂时没有可记录的模拟信号。模型没出手，也是一种纪律。</div>'}
        </div>
    `;
}

function refreshPaperTradesForDisplay(trades, quoteMap) {
    const today = new Date().toISOString().slice(0, 10);
    const refreshed = (trades || []).map(trade => {
        const quote = quoteMap?.[trade.symbol] || {};
        const currentPrice = quote.price || trade.currentPrice || trade.entryPrice;
        const pnlPct = trade.entryPrice ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100 : trade.pnlPct;
        const ageDays = Math.max(0, Math.floor((new Date(today) - new Date(trade.entryDate)) / 86400000));
        const allocationPct = trade.allocationPct || getPaperAllocationPct(trade, { score: trade.score || 4 });
        const capital = trade.capital || 100000;
        const entryValue = capital * (allocationPct / 100);
        const currentValue = entryValue * (1 + (pnlPct || 0) / 100);
        return {
            ...trade,
            allocationPct,
            capital,
            entryValue,
            currentValue,
            currentPrice,
            pnlPct,
            ageDays,
            status: getPaperTradeStatus({ pnlPct, ageDays, score: trade.score || 4 })
        };
    });
    return applyPaperRiskControls(refreshed);
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
            if (seen.has(target.symbol) || !target.price || target.modelTag !== '观察') return;
            seen.add(target.symbol);
            candidates.push({
                symbol: target.symbol,
                code: target.code,
                name: target.name,
                market: target.market,
                kind: target.kind,
            entryPrice: target.price,
            allocationPct: getPaperAllocationPct(target, card),
            eventTitle: card.title,
            eventType: card.type,
            score: card.score
            });
        });
    });
    return candidates.slice(0, 8);
}

function updatePaperTrades(candidates, quoteMap) {
    const key = 'paper_trade_signals_v1';
    const today = new Date().toISOString().slice(0, 10);
    let trades = [];
    try {
        trades = JSON.parse(localStorage.getItem(key) || '[]');
    } catch(e) {
        trades = [];
    }

    candidates.forEach(candidate => {
        const id = `${today}-${candidate.symbol}-${candidate.eventType}`;
        if (trades.some(trade => trade.id === id)) return;
        trades.unshift({
            ...candidate,
            id,
            entryDate: today,
            status: '观察中',
            capital: 100000
        });
    });

    trades = trades.slice(0, 40).map(trade => {
        const quote = quoteMap?.[trade.symbol] || {};
        const currentPrice = quote.price || trade.currentPrice || trade.entryPrice;
        const pnlPct = trade.entryPrice ? ((currentPrice - trade.entryPrice) / trade.entryPrice) * 100 : null;
        const ageDays = Math.max(0, Math.floor((new Date(today) - new Date(trade.entryDate)) / 86400000));
        const allocationPct = trade.allocationPct || getPaperAllocationPct(trade, { score: trade.score || 4 });
        const capital = trade.capital || 100000;
        const entryValue = capital * (allocationPct / 100);
        const currentValue = entryValue * (1 + (pnlPct || 0) / 100);
        const checkpoints = updatePaperCheckpoints(trade.checkpoints || {}, pnlPct, ageDays, today);
        return {
            ...trade,
            allocationPct,
            capital,
            entryValue,
            currentValue,
            currentPrice,
            pnlPct,
            ageDays,
            checkpoints,
            status: getPaperTradeStatus({ pnlPct, ageDays, score: trade.score || 4 })
        };
    });
    trades = applyPaperRiskControls(trades);

    localStorage.setItem(key, JSON.stringify(trades));
    return trades;
}

function applyPaperRiskControls(trades) {
    const maxExposure = 70;
    let exposure = 0;
    const activeIds = new Set();
    const oldestFirst = [...trades].sort((a, b) => {
        const dateDiff = new Date(a.entryDate) - new Date(b.entryDate);
        return dateDiff || String(a.id || '').localeCompare(String(b.id || ''));
    });

    oldestFirst.forEach(trade => {
        if (trade.status === '过期') return;
        const allocation = Math.min(15, Number(trade.allocationPct || 0));
        if (exposure + allocation <= maxExposure) {
            exposure += allocation;
            activeIds.add(trade.id);
        }
    });

    return trades.map(trade => {
        if (trade.status === '过期' || activeIds.has(trade.id)) return trade;
        return { ...trade, status: '仓位等待', currentValue: 0, entryValue: 0 };
    });
}

function getPaperAllocationPct(target, card) {
    if (target.kind === 'Stock') return card.score >= 7 ? 6 : 4;
    return card.score >= 7 ? 10 : 8;
}

function getPaperTradeStatus(trade) {
    if (typeof trade.pnlPct === 'number' && trade.pnlPct <= -8) return '止损警报';
    if (typeof trade.pnlPct === 'number' && trade.score >= 7 && trade.pnlPct >= 18) return '止盈复盘';
    if (typeof trade.pnlPct === 'number' && trade.score < 7 && trade.pnlPct >= 10) return '止盈复盘';
    if (trade.ageDays >= 10) return '时间复盘';
    if (trade.ageDays >= 3) return '复盘中';
    return '观察中';
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
        const samples = trades.map(trade => trade.checkpoints?.[phase.key]).filter(Boolean);
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
    return !['过期', '仓位等待'].includes(trade.status);
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
    const statusClass = trade.status === '止损警报' ? 'negative' : ['止盈复盘', '时间复盘'].includes(trade.status) ? 'positive' : '';
    const checkpoints = renderPaperCheckpointBadges(trade);
    const playbook = getPaperTradePlaybook(trade);
    return `
        <div class="a-flow-item">
            <div class="a-flow-main" onclick="toggleFlowDetail(this)">
                <span class="a-flow-category-title">${safeText(trade.market || '')}</span>
                <span class="a-flow-name">${safeText(trade.name)} ${safeText(trade.code)}</span>
                <span class="a-flow-change ${pnlClass}">${pnl}</span>
            </div>
            <div class="a-flow-detail">
                <div class="a-flow-explain">模型来源：${safeText(trade.eventType)} ${safeText(trade.score)}/10，来自“${safeText(trade.eventTitle)}”。</div>
                <div class="a-flow-meaning">模拟记录：仓位 ${trade.allocationPct}%（${formatMoney(trade.entryValue)}），入场 ${safeText(trade.entryDate)}，入场价 ${Number(trade.entryPrice).toFixed(2)}，当前价 ${Number(trade.currentPrice).toFixed(2)}，已观察 ${trade.ageDays} 天。</div>
                <div class="a-flow-meaning">状态：<span class="a-flow-change ${statusClass}">${safeText(trade.status)}</span></div>
                <div class="paper-playbook">
                    <div><span>入场逻辑</span><b>${safeText(playbook.entry)}</b></div>
                    <div><span>等待原因</span><b>${safeText(playbook.wait)}</b></div>
                    <div><span>退出纪律</span><b>${safeText(playbook.exit)}</b></div>
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
    const isAlert = trade.status === '止损警报';
    const isTakeProfit = trade.status === '止盈复盘';
    const isTimeReview = trade.status === '时间复盘';
    const eventLabel = trade.eventType || '事件';
    const strength = score >= 8 ? '高分' : score >= 6 ? '中高分' : '普通';

    let entry = `${eventLabel}${strength}信号，先用${trade.kind === 'ETF' ? 'ETF验证方向' : '小仓位监控个股'}，不把新闻热闹直接当买点。`;
    if (trade.eventTitle) entry = `${entry} 触发点：${trade.eventTitle}`;

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

function renderTradePoolCard(card) {
    const primaryTarget = card.targets[0] ? renderTargetBadge(card.targets[0]) : '';
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
                    ${card.targets.map(target => renderTargetBadge(target)).join('')}
                </div>
                <div class="a-flow-impact">操作提示：${safeText(card.action)}</div>
            </div>
        </div>
    `;
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
            xhrFetch('data/hot-news.json'),
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
        xhr.onload = () => { if (xhr.status === 200) { try { resolve(JSON.parse(xhr.responseText)); } catch(e) { reject(e); } } else reject(); };
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
