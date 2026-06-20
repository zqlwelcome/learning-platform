#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'data', 'live-hot-news.json');
const alertsPath = path.join(root, 'data', 'alerts.json');
const expertViewsPath = path.join(root, 'data', 'expert-views.json');
const dailyDataPath = path.join(root, 'daily-data.js');

const SINA_LIDS = [
  { lid: 2517, weight: 22, label: '新浪全球市场' },
  { lid: 2518, weight: 20, label: '新浪证券市场' },
  { lid: 2516, weight: 12, label: '新浪宏观观察' },
  { lid: 2515, weight: 8, label: '新浪科技财经' }
];

const MARKET_TERMS = [
  '美联储', '利率', '通胀', '非农', '美元', '美债', '央行', '降息', '加息',
  '股市', '美股', '港股', 'A股', '证券', '基金', '银行', '黄金', '原油',
  '经济', '宏观', '监管', '政策', '关税', '贸易', '芯片', '人工智能',
  '财报', 'IPO', '估值', '回购', '债券', '房地产', '人民币'
];

const NOISE_TERMS = ['娱乐', '体育', '影视', '明星', '彩票', '八卦'];

function nowChina() {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date()).replace(/\//g, '-');
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LearningHubNews/1.0)',
        ...(options.headers || {})
      }
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

function cleanText(text) {
  return String(text || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function headlineFromFlash(content) {
  const text = cleanText(content);
  const bracket = text.match(/^【([^】]{6,80})】/);
  if (bracket) return bracket[1];
  const headline = text
    .replace(/^金十数据\d+月\d+日讯，?/, '')
    .replace(/点击查看.*$/, '');
  return (headline.split(/[。；;]/)[0] || headline).slice(0, 46);
}

function eventKey(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '')
    .slice(0, 42);
}

function scoreItem(item, base = 0) {
  const text = `${item.title} ${item.detail}`;
  let score = base;
  MARKET_TERMS.forEach((term) => {
    if (text.includes(term)) score += 5;
  });
  NOISE_TERMS.forEach((term) => {
    if (text.includes(term)) score -= 30;
  });
  if (/美联储|利率|通胀|非农|央行|美元|美债/.test(text)) score += 18;
  if (/监管|政策|法律|证券|银行|关税|贸易/.test(text)) score += 14;
  if (/美股|港股|A股|股市|基金|黄金|原油|债券/.test(text)) score += 12;
  if (/财报|IPO|估值|回购|芯片|人工智能/.test(text)) score += 10;
  return score;
}

function insightFor(item) {
  const text = `${item.title} ${item.detail}`;
  if (/美联储|利率|通胀|非农|美债/.test(text)) {
    return {
      what: item.title,
      assets: '关注：美股成长股、美元、美债、黄金',
      chain: '交易员先看利率预期是否变化，再看估值资产和避险资产是否同步反应。',
      watch: '盯住美债收益率、美元指数和下次通胀/就业数据。'
    };
  }
  if (/监管|政策|法律|关税|贸易/.test(text)) {
    return {
      what: item.title,
      assets: '关注：政策敏感行业、银行券商、出口链',
      chain: '政策和监管新闻会改变风险偏好，也可能直接影响行业利润和估值。',
      watch: '看后续细则、执行力度，以及相关板块是否放量确认。'
    };
  }
  if (/黄金|原油|大宗|中东|地缘/.test(text)) {
    return {
      what: item.title,
      assets: '关注：黄金、原油、能源股、资源类基金',
      chain: '大宗商品通常同时反映避险、供需和通胀预期，不能只看单日涨跌。',
      watch: '看美元、美债实际利率、库存数据和地缘风险是否继续发酵。'
    };
  }
  if (/芯片|人工智能|AI|算力|数据中心|科技/.test(text)) {
    return {
      what: item.title,
      assets: '关注：美股科技龙头、半导体、算力链、云服务',
      chain: '科技主线要分清是真订单、真利润，还是单纯情绪抱团。',
      watch: '看财报指引、资本开支和龙头股成交量。'
    };
  }
  return {
    what: item.title,
    assets: '关注：相关指数、行业ETF和龙头公司',
    chain: '先判断这条新闻影响利率、盈利、政策还是情绪，再决定是否值得进交易池。',
    watch: '看后续新闻、价格和成交量是否形成共振。'
  };
}

function scoreAlertCandidate(item, kind) {
  const text = `${item?.title || ''} ${item?.detail || ''} ${item?.insight?.assets || ''} ${item?.insight?.watch || ''}`;
  let score = 0;
  if (kind === 'forex') {
    if (/美元|人民币|日元|欧元|汇率|外汇|美元指数/.test(text)) score += 40;
    if (/黄金|美债|收益率|通胀|央行|欧洲央行|美联储|利率/.test(text)) score += 28;
    if (/原油|油价|能源|地缘|避险|霍尔木兹/.test(text)) score += 18;
    if (/可转债|个股|公司公告|IPO|基金募集/.test(text) && !/美元|利率|通胀|央行/.test(text)) score -= 30;
  } else {
    if (/股市|美股|A股|港股|纳指|标普|道指|上证|恒生|沪深|证券/.test(text)) score += 40;
    if (/科技股|人工智能|AI|芯片|IPO|估值|财报|回购|基金|资本市场/.test(text)) score += 24;
    if (/公司公告|可转债/.test(text)) score += 8;
    if (/初创|风投|创投|私募|募集新一期基金|基金募集/.test(text) && !/上市|IPO|股市|美股|港股|A股|资本市场/.test(text)) score -= 24;
  }
  return score + Math.min(20, Number(item?.score || 0) / 5);
}

function pickNews(news, kind, excludeTitle = '') {
  const ranked = news
    .filter((item) => item?.title && item.title !== excludeTitle)
    .map((item) => ({ item, score: scoreAlertCandidate(item, kind) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.item || news[0];
}

function shortText(text, limit = 34) {
  const cleaned = cleanText(text);
  return cleaned.length > limit ? `${cleaned.slice(0, limit)}…` : cleaned;
}

function alertDetail(item, angle, updateTime, watchOverride = '') {
  const insight = item?.insight || insightFor(item || {});
  const watch = String(watchOverride || insight.watch || '看价格、成交量和后续消息是否确认').replace(/[。.!！]+$/, '');
  return `${angle}。看什么：${watch}。`;
}

function buildAlerts(news, updateTime) {
  const forex = pickNews(news, 'forex');
  const stock = pickNews(news, 'stock', forex?.title || '');
  return {
    updateTime,
    forex: {
      icon: '💱',
      title: '外汇提示',
      text: shortText(forex?.title || '美元、人民币、黄金等待新信号'),
      detail: alertDetail(forex, '外汇卡重点看美元、人民币、黄金、原油和美债收益率的联动，不把单日涨跌当趋势', updateTime, '美元指数、离岸人民币、黄金/原油是否同向确认')
    },
    stock: {
      icon: '📈',
      title: '股市动向',
      text: shortText(stock?.title || '主要股指等待方向确认'),
      detail: alertDetail(stock, '股市卡重点看哪个市场在带节奏，以及上涨是否有成交量、政策或盈利逻辑支持', updateTime, 'A股、港股、美股谁先放量，相关板块是否从新闻热度变成价格确认')
    }
  };
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function findNews(news, terms) {
  return findBestNews(news, terms);
}

function findBestNews(news, terms, antiTerms = []) {
  const ranked = news
    .map((item) => {
      const title = String(item.title || '').toLowerCase();
      const detail = String(item.detail || '').toLowerCase();
      const titleScore = terms.reduce((sum, term) => sum + (title.includes(term) ? 8 : 0), 0);
      const detailScore = terms.reduce((sum, term) => sum + (detail.includes(term) ? 2 : 0), 0);
      const penalty = antiTerms.reduce((sum, term) => sum + (`${title} ${detail}`.includes(term) ? 5 : 0), 0);
      return { item, score: titleScore + detailScore - penalty };
    })
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score > 0 ? ranked[0].item : news[0];
}

function buildExpertViews(news, alerts, updateTime) {
  const joined = news.map((item) => `${item.title} ${item.detail}`).join(' ').toLowerCase();
  const positive = (joined.match(/新高|狂欢|流入|上涨|融资|ipo|突破|利好|筹资/g) || []).length;
  const negative = (joined.match(/加息|下跌|连跌|大跌|腰斩|忧虑|风险|通胀|承压/g) || []).length;
  const moodLabel = positive > negative + 2 ? '偏乐观但拥挤' : negative > positive + 2 ? '偏谨慎，先控风险' : '震荡分化，等确认';
  const icon = positive > negative + 2 ? '😊' : negative > positive + 2 ? '😐' : '🧭';
  const color = positive > negative + 2 ? '#34c759' : negative > positive + 2 ? '#ff9500' : '#0071e3';
  const confidence = Math.min(10, Math.max(4, 5 + Math.abs(positive - negative)));
  const macro = findBestNews(news, ['加息', '利率', '通胀', 'pce', 'gdp', '美联储', '美元', '美债'], ['芯片', '人工智能', 'ai', '存储', '算力', 'ipo']);
  const tech = findBestNews(news, ['芯片', '人工智能', 'ai', '存储', '算力', 'spacex', 'momenta'], ['黄金', '加息', '私募']);
  const commodity = findBestNews(news, ['黄金', '金价', '原油', '油价', '大宗'], ['芯片', 'ipo', '私募']);
  const china = findBestNews(news, ['港股', 'a股', '香港', '中国', '私募', '人民币'], ['spacex', '伊朗']);
  const policy = findBestNews(news, ['监管', '法律', '政策', '会谈', '伊朗', '关税'], ['芯片', '私募']);
  const top = news[0] || {};
  const second = news[1] || top;
  const third = news[2] || second;

  const mood = {
    mood: moodLabel,
    icon,
    color,
    confidence,
    dimensions: [
      { label: '趋势', value: `主线看 ${shortText(top.title, 36)}，热度在，但不能把热度直接当买点。` },
      { label: '资金', value: `资金更偏向有叙事和流动性的方向，例如 ${shortText(tech.title, 34)}；需要成交量继续确认。` },
      { label: '宏观', value: `${shortText(macro.title, 38)} 是今天的估值开关，影响利率、美元和成长股定价。` },
      { label: '商品', value: `${shortText(commodity.title, 38)} 提醒黄金/资源类资产不能只看单日涨跌，要看通胀和实际利率。` },
      { label: '中国资产', value: `${shortText(china.title, 38)} 更适合作为结构性线索，看港股/A股是否有资金跟进。` },
      { label: '风险', value: `${shortText(policy.title, 38)} 说明地缘和政策仍会突然改变风险偏好，仓位要留余地。` }
    ],
    summary: `今天的市场不是单边行情，而是“科技叙事、利率预期、黄金波动、地缘/政策风险”一起拉扯。对小白投资者更重要的是先判断新闻影响的是情绪、利率、盈利还是资金流，再看价格是否确认。`
  };

  const experts = {
    templeton: {
      insight: `邓普顿会先问：大家是不是已经太兴奋了。${shortText(top.title, 52)} 说明热门主线还在吸引资金，但越热越要找反向证据。真正的机会通常不在最吵的地方，而在被同一条宏观新闻错杀、但基本面没有坏掉的资产里。`,
      action: `不追涨最热芯片/IPO叙事；关注被 ${shortText(macro.title, 28)} 压住估值、但现金流稳定的港股/A股龙头或宽基基金。`
    },
    buffett: {
      insight: `巴菲特会把今天的新闻先翻译成现金流问题：利率如果上去，估值就会被压；如果企业有定价权，反而能穿越波动。${shortText(second.title, 54)} 可以看，但不能替代财报、负债和自由现金流。`,
      action: `优先看现金流强、负债可控、能分红或回购的公司/ETF；对只靠故事融资、还没证明盈利能力的标的保持距离。`
    },
    munger: {
      insight: `芒格会提醒先防蠢：${shortText(third.title, 54)} 这种新闻容易让人只看涨跌，不看赔率。好决策要先问最坏情况、拥挤程度和退出纪律，尤其在黄金、AI、IPO同时热的时候。`,
      action: `把仓位拆小，要求“新闻催化 + 价格趋势 + 成交量 + 风控位”同时满足；不满足就只观察，不硬下单。`
    },
    duan: {
      insight: `段永平会回到好生意：新闻只是入口，不是买入理由。${shortText(tech.title, 52)} 背后如果能变成真实订单、利润和用户价值，才值得长期跟踪；否则只是今天热闹。`,
      action: `关注自己看得懂的龙头和指数基金；具体标的要等估值舒服、业务逻辑清楚、模拟盘信号通过后再考虑。`
    }
  };

  return { mood, experts, updateTime, generatedAt: updateTime, sourceNewsTime: updateTime, alertsUpdateTime: alerts.updateTime };
}

async function syncDailyDataEmbedded(expertViews) {
  const source = await readFile(dailyDataPath, 'utf8');
  const marker = 'const _EMBEDDED_DATA = ';
  const start = source.indexOf(marker);
  if (start === -1) throw new Error('daily-data.js missing _EMBEDDED_DATA marker');
  const dataStart = start + marker.length;
  let depth = 0;
  let end = -1;
  for (let i = dataStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error('daily-data.js embedded block is incomplete');
  const embedded = {
    updateTime: expertViews.updateTime,
    mood: expertViews.mood,
    experts: expertViews.experts
  };
  const block = `${marker}${JSON.stringify(embedded, null, 4)};`;
  await writeFile(dailyDataPath, `${source.slice(0, start)}${block}${source.slice(end + (source[end] === ';' ? 1 : 0))}`, 'utf8');
}

async function fetchSina() {
  const items = [];
  for (const { lid, weight, label } of SINA_LIDS) {
    const url = `https://feed.mix.sina.com.cn/api/roll/get?pageid=153&lid=${lid}&num=50&page=1`;
    try {
      const data = await fetchJson(url);
      (data.result?.data || []).forEach((entry, index) => {
        items.push({
          title: cleanText(entry.title),
          source: entry.media_name || entry.source || label,
          detail: cleanText(entry.intro || entry.stitle || entry.title),
          url: entry.url,
          lang: 'zh',
          score: weight + Math.max(0, 20 - index)
        });
      });
    } catch (error) {
      console.warn(`Sina lid ${lid} failed: ${error.message}`);
    }
  }
  return items;
}

async function fetchJin10() {
  const url = 'https://flash-api.jin10.com/get_flash_list?channel=-8200&vip=1';
  try {
    const data = await fetchJson(url, {
      headers: {
        'x-app-id': 'SO1EJGmNgCtmpcPF',
        'x-version': '1.0.0'
      }
    });
    return (data.data || []).map((entry, index) => {
      const content = cleanText(entry.data?.content || entry.content || '');
      return {
        title: headlineFromFlash(content),
        source: entry.data?.source || '金十快讯',
        detail: content,
        url: 'https://www.jin10.com',
        lang: 'zh',
        score: 28 + Math.max(0, 20 - index)
      };
    }).filter((item) => item.title.length >= 8);
  } catch (error) {
    console.warn(`Jin10 failed: ${error.message}`);
    return [];
  }
}

function buildTopNews(items) {
  const ranked = items
    .filter((item) => item.title && item.title.length >= 8)
    .map((item) => ({ ...item, score: scoreItem(item, item.score) }))
    .filter((item) => item.score > 20)
    .map((item) => ({
      ...item,
      score: item.score + (/^https?:\/\/finance\.sina\.com\.cn\//.test(item.url || '') ? 8 : 0)
    }))
    .sort((a, b) => b.score - a.score);

  const result = [];
  const seenEvents = new Set();
  const seenTitles = new Set();

  const add = (item, strict = true) => {
    if (result.length >= 10) return false;
    const key = strict ? eventKey(`${item.title} ${item.detail}`) : eventKey(item.title);
    const titleKey = eventKey(item.title);
    if (!key || seenEvents.has(key) || seenTitles.has(titleKey)) return false;
    seenEvents.add(key);
    seenTitles.add(titleKey);
    result.push(item);
    return true;
  };

  ranked.forEach((item) => add(item, true));
  ranked.forEach((item) => add(item, false));

  return result
    .slice(0, 10)
    .map((item, index) => ({
      rank: index + 1,
      title: item.title,
      source: item.source,
      detail: item.detail || item.title,
      url: item.url,
      sourceUrlType: /^https?:\/\/(www\.)?jin10\.com\/?$/.test(item.url || '') ? 'source-home' : 'article',
      lang: 'zh',
      score: Math.round(item.score),
      insight: insightFor(item)
    }));
}

function titleFingerprint(news) {
  return news.map((item) => eventKey(item.title)).join('|');
}

const news = buildTopNews([...(await fetchJin10()), ...(await fetchSina())]);
if (news.length < 10) {
  throw new Error(`Only collected ${news.length} usable news items`);
}

const updateTime = nowChina();
const payload = {
  updateTime,
  newsUpdateTime: updateTime,
  analysisUpdateTime: updateTime,
  dataSource: 'live-hot-news: Jin10 + Sina finance roll',
  titleFingerprint: titleFingerprint(news),
  freshnessNote: 'live-hot-news.json 由独立实时新闻源生成；前端优先使用它，hot-news.json 仅作兜底。',
  news
};

await writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
const alerts = buildAlerts(news, updateTime);
const expertViews = buildExpertViews(news, alerts, updateTime);
await writeFile(alertsPath, JSON.stringify(alerts, null, 2) + '\n', 'utf8');
await writeFile(expertViewsPath, JSON.stringify(expertViews, null, 2) + '\n', 'utf8');
await syncDailyDataEmbedded(expertViews);
console.log(`Wrote ${news.length} live hot news items to ${outputPath}`);
console.log(`Wrote live alerts to ${alertsPath}`);
console.log(`Wrote live expert views to ${expertViewsPath}`);
console.log(`Synced embedded expert views in ${dailyDataPath}`);
