/**
 * 智囊团页签 - 方案A
 * 仪表盘风格：渐变情绪卡片 + 进度条 + 圆形达人选择器 + 紧凑解读
 */

let _currentExpert = 'templeton';

// ===== 内嵌数据（替代 remote fetch，避免GitHub Pages缓存问题）=====
const _EMBEDDED_DATA = {
    "updateTime": "2026-06-01 14:55",
    "mood": {
        "mood": "谨慎乐观，分化加剧",
        "icon": "🤔",
        "color": "#FFA500",
        "confidence": 7,
        "dimensions": [
            {
                "label": "📈 趋势",
                "value": "美股在AI和科技巨头带领下接近历史高点，但部分个股如美光已超买，显示短期动能可能衰竭。日本市场受汇率干预影响，趋势不明朗。"
            },
            {
                "label": "💰 资金",
                "value": "资金持续涌入AI和机器人赛道，NVIDIA、苹果获机构力推；日本央行干预汇市但效果有限，资金外流压力仍在。香港IPO市场活跃，显示资金寻求新增长点。"
            },
            {
                "label": "🌍 地缘",
                "value": "欧洲通过软银巨额AI投资试图追赶美中，但差距仍大。中国A股公司密集赴港上市，反映跨境融资需求。SpaceX IPO传闻挑战华尔街传统，体现地缘与金融创新的博弈。"
            },
            {
                "label": "🏭 热点",
                "value": "AI硬件（NVIDIA、美光）、人形机器人（Unitree）、太空经济（SpaceX）为最热板块。日本汇市干预与加息预期是宏观焦点，香港IPO潮则反映中概股回归趋势。"
            },
            {
                "label": "😊 情绪",
                "value": "市场对AI长期前景极度乐观，但短期超买信号（如美光）引发警惕。日本市场因汇率不确定性情绪偏空。投资者对IPO和AI新叙事热情高涨，但避险情绪在汇市蔓延。"
            },
            {
                "label": "🏦 宏观",
                "value": "日本央行加息预期与汇市干预形成矛盾，全球流动性环境趋紧。美国经济韧性支撑股市，但高利率风险未消。欧洲通过主权与产业资本结合推动AI基建，宏观政策向科技倾斜。"
            }
        ],
        "summary": "当前市场情绪整体谨慎乐观，AI与机器人赛道仍是最大引擎，但日本汇率波动和个股超买信号提示风险。资金从传统领域向科技与跨境IPO流动，地缘因素加剧分化。投资者需警惕短期过热，关注宏观政策与公司基本面匹配度。"
    },
    "experts": {
        "templeton": {
            "insight": "当前市场情绪极度乐观，尤其是AI和机器人板块，这让我想起互联网泡沫前夕。日元无视干预持续贬值，恰是极端悲观中的机会——日本加息预期可能已过度反映，若实际政策温和，日元资产将迎来反弹。SpaceX IPO和香港上市潮显示全球资本仍在寻找价值洼地，但投资者需警惕羊群效应。我主张在众人恐慌时贪婪，但此刻应逆向思考：减持已超买的科技股，布局被忽视的日本金融或欧洲估值合理的AI供应链企业。",
            "action": "逢高减持NVIDIA等超买AI股，增持日本银行股（受益于加息预期）和欧洲AI基础设施基金，利用市场非理性波动分批建仓。"
        },
        "buffett": {
            "insight": "这些新闻里，我找不到让我兴奋的“护城河”。NVIDIA固然优秀，但当前价格已透支未来多年增长，美光超买更是警示。SpaceX IPO若成真，我会研究其商业模式是否如保险般稳定，而非追逐火箭概念。日本汇市干预如同“用桶接瀑布”，徒劳无功，但日本企业基本面若因加息改善，或存在被低估的消费垄断股。香港IPO潮中，利欧股份和江波龙需仔细审视其现金流与竞争优势。我的原则：市场狂热时保持冷静，只买那些你愿意永久持有的生意。",
            "action": "观望为主，保留大量现金。仅考虑买入日本或欧洲拥有强大品牌、低负债的消费必需品公司，避免参与AI或IPO炒作。"
        },
        "munger": {
            "insight": "投资中最蠢的事就是为“未来愿景”支付过高价格。NVIDIA和其投资的Unitree机器人公司，听起来像科幻小说，但至今未证明可持续盈利能力。软银在欧洲的75亿欧元AI投资，不过是孙正义又一次“赌博式”豪掷。香港IPO潮中，许多A股公司转战港股只为套现，而非创造价值。相比之下，巴菲特看中的是确定性，而我更看重“避免愚蠢”——当前市场充满投机，日本汇市干预无效正说明经济规律的不可违抗。聪明人应远离喧嚣。",
            "action": "清仓所有AI相关仓位，增持日本国债或高评级企业债，利用市场波动做空超买科技股ETF，等待泡沫破裂后的捡便宜机会。"
        },
        "duan": {
            "insight": "这些新闻让我兴奋的是真正的好生意在持续进化。NVIDIA的机器人平台选择Unitree，说明中国创业公司有实力；SpaceX IPO若成真，可能是下一个改变世界的平台。但关键在于价格——美光超买时追涨是愚蠢的。我投资苹果和NVIDIA，是因为它们的用户粘性和生态系统难以复制。香港IPO潮中，我会关注江波龙这类存储龙头，若其业务简单易懂、现金流好，且价格合理，值得下注。日本汇市干预是短期噪音，不影响长期价值创造。",
            "action": "继续持有苹果、NVIDIA核心仓位，但若美光等出现回调，可小额试探性买入。关注SpaceX IPO定价，若合理则参与；对香港IPO保持谨慎，只选自己懂的公司。"
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
    const tradePoolHtml = await buildAutoTradePoolHtml(briefingData.hotNews || []);
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
                    <div class="a-radar-kicker">自动交易池 v3</div>
                    <div class="a-radar-copy">新闻事件自动进模型，叠加实时涨跌、成交额、5日趋势和热度过滤；单股财报排雷未通过前只进监控。</div>
                </div>
                ${tradePoolHtml}
            </div>
            
            <!-- 板块轮动内容 -->
            <div class="a-insights-content" id="insight-sector">
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

async function buildAutoTradePoolHtml(hotNews) {
    const quoteMap = await loadTradeQuoteMap();
    const cards = (hotNews || [])
        .map(news => scoreTradeEvent(news, quoteMap))
        .filter(item => item.score >= 4)
        .sort((a, b) => b.score - a.score)
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
            <div class="a-flow-disclaimer">自动交易池 v3 已接入事件打分、实时涨跌、成交额、5日趋势和52周热度过滤。财报排雷与真实估值分位需要稳定财务源；未接入前，个股只进监控池，ETF可进入观察池。以下不是无条件买入清单。</div>
        </div>
    `;
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
                    <span>参考关注</span>
                    ${card.targets.slice(1).map(target => renderTargetBadge(target)).join('')}
                </div>
                <div class="a-flow-impact">操作提示：${safeText(card.action)}</div>
            </div>
        </div>
    `;
}

function scoreTradeEvent(news, quoteMap) {
    const title = news.titleZh || news.title_zh || news.title || '事件更新';
    const detail = news.detailZh || news.detail_zh || news.detail || '';
    const text = `${title} ${detail}`.toLowerCase();
    const base = Math.min(8, Math.max(4, Math.round((Number(news.score || 28) - 10) / 6)));
    const profile = getTradeProfile(text);
    const score = Math.min(10, Math.max(4, base + profile.bonus));
    const targets = profile.targets.map(target => attachQuote(target, quoteMap));
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

function getTradeProfile(text) {
    if (/证监会|监管|新规|政策|治理|a股|上市公司/.test(text)) {
        return {
            type: '政策类',
            bonus: 2,
            targets: [
                { name: '沪深300ETF', code: '510300', symbol: 'sh510300' },
                { name: '上证50ETF', code: '510050', symbol: 'sh510050' },
                { name: '证券ETF', code: '512880', symbol: 'sh512880' }
            ],
            reason: '政策会改变市场风险偏好和估值上限，优先影响大盘、金融和治理改善类资产。',
            action: '若政策落地且指数放量，允许小仓位观察；若只是口头预期，不追。'
        };
    }
    if (/bank of america|analyst|机构|调研|加仓|top picks|nvidia|apple|ai|人工智能|芯片|数据中心|micron/.test(text)) {
        return {
            type: '资金行为',
            bonus: 1,
            targets: [
                { name: '英伟达', code: 'NVDA', symbol: 'usNVDA' },
                { name: '苹果', code: 'AAPL', symbol: 'usAAPL' },
                { name: '纳指100ETF', code: 'QQQ', symbol: 'usQQQ' },
                { name: '半导体ETF', code: 'SMH', symbol: 'usSMH' }
            ],
            reason: '机构仍在抱团确定性资产，但科技交易拥挤，最怕收益率上行和估值过热。',
            action: '若美债收益率下行且龙头放量，可分批；若5日连续大涨，模型拒绝追高。'
        };
    }
    if (/oil|opec|原油|油价|能源|伊朗|iran|地缘|war|战争/.test(text)) {
        return {
            type: '供需/地缘',
            bonus: 1,
            targets: [
                { name: '美国原油基金', code: 'USO', symbol: 'usUSO' },
                { name: '能源ETF', code: 'XLE', symbol: 'usXLE' },
                { name: '黄金ETF', code: 'GLD', symbol: 'usGLD' },
                { name: '黄金ETF', code: '518880', symbol: 'sh518880' }
            ],
            reason: '油价和地缘风险会同时影响通胀预期、避险资金和能源链利润。',
            action: '先看油价和黄金是否同步确认；只有单边消息、没有价格确认时，不重仓。'
        };
    }
    if (/fed|pce|通胀|利率|降息|recession|经济|gdp|就业|非农|稳定币/.test(text)) {
        return {
            type: '宏观类',
            bonus: 2,
            targets: [
                { name: '长债ETF', code: 'TLT', symbol: 'usTLT' },
                { name: '短债ETF', code: 'SHV', symbol: 'usSHV' },
                { name: '黄金ETF', code: 'GLD', symbol: 'usGLD' },
                { name: '纳指100ETF', code: 'QQQ', symbol: 'usQQQ' }
            ],
            reason: '宏观事件改变利率路径，是股债汇和成长股估值的总开关。',
            action: '若收益率下行，成长股和黄金更舒服；若收益率上行，减轻高估值资产。'
        };
    }
    return {
        type: '基本面类',
        bonus: 0,
        targets: [
            { name: '标普500ETF', code: 'SPY', symbol: 'usSPY' },
            { name: '纳指100ETF', code: 'QQQ', symbol: 'usQQQ' },
            { name: '沪深300ETF', code: '510300', symbol: 'sh510300' }
        ],
        reason: '事件可能影响盈利预期，但需要更多价格和基本面确认。',
        action: '先观察，不急着入场；等成交量和方向确认后再评估。'
    };
}

function renderTargetBadge(target) {
    const quote = typeof target.pct === 'number' ? ` <em>${target.pct >= 0 ? '+' : ''}${target.pct.toFixed(2)}%</em>` : '';
    const liquidity = target.hasQuote ? ` <em>${target.liquidityPass ? '量OK' : '量弱'}</em>` : '';
    const trend = typeof target.fiveDayPct === 'number' ? ` <em>5日${target.fiveDayPct >= 0 ? '+' : ''}${target.fiveDayPct.toFixed(1)}%</em>` : '';
    const heat = typeof target.heat === 'number' ? ` <em>${target.heat > 0.88 ? '高位' : '热度OK'}</em>` : '';
    return `<b>${safeText(target.name)} ${safeText(target.code)}${quote}${trend}${liquidity}${heat}</b>`;
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
    const symbols = ['sh510300','sh510050','sh512880','sh518880','usNVDA','usAAPL','usQQQ','usSMH','usUSO','usXLE','usGLD','usTLT','usSHV','usSPY'];
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
            return [symbol, { fiveDayPct: ((lastClose - firstClose) / firstClose) * 100 }];
        } catch(e) {
            return [symbol, {}];
        }
    }));
    return Object.fromEntries(entries);
}

function getLiquidityFloor(symbol) {
    return /^us/i.test(symbol) ? 50000000 : 5000;
}

function normalizeTradeTitle(title, type) {
    if (/[A-Za-z]{3,}/.test(title)) {
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
        const [n, a] = await Promise.all([xhrFetch('data/hot-news.json'), xhrFetch('data/alerts.json')]);
        return { hotNews: n?.news || [], alerts: a || null };
    } catch(e) { return { hotNews: [], alerts: null }; }
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
