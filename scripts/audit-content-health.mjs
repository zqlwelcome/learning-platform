#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const newsPath = path.join(root, 'data', 'live-hot-news.json');
const expertPath = path.join(root, 'data', 'expert-views.json');
const dailyDataPath = path.join(root, 'daily-data.js');

const EVENT_CONCEPTS = [
  ['us-stocks', /美股|道指|纳指|标普|费城半导体/],
  ['chips', /芯片|半导体|存储|美光|闪迪|英伟达/],
  ['oil', /原油|油价|石油|wti|布伦特/],
  ['gold', /黄金|金价|金银|贵金属/],
  ['fed', /美联储|联储|沃什|鲍威尔/],
  ['rates', /加息|降息|利率|收益率|美债/],
  ['inflation', /通胀|cpi|pce/],
  ['china-assets', /中国资产|a股|港股|人民币|沪深|恒生/],
  ['europe', /欧洲央行|欧元区|欧股|英国央行/],
  ['geopolitics', /制裁|俄罗斯|伊朗|中东|战争|地缘/],
  ['ai', /人工智能|ai|算力|数据中心/],
  ['bank-risk', /硅谷银行|银行倒闭|银行风险|金融监管/]
];

function normalizeTitle(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?%?/g, '')
    .replace(/[^一-龥a-z]+/g, '')
    .slice(0, 80);
}

function concepts(item) {
  const text = String(item?.title || '').toLowerCase();
  return new Set(EVENT_CONCEPTS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name));
}

function duplicateReason(left, right) {
  const leftTitle = normalizeTitle(left.title);
  const rightTitle = normalizeTitle(right.title);
  if (leftTitle === rightTitle || leftTitle.includes(rightTitle) || rightTitle.includes(leftTitle)) return '标题高度重复';
  const leftConcepts = concepts(left);
  const rightConcepts = concepts(right);
  const overlap = [...leftConcepts].filter((concept) => rightConcepts.has(concept));
  const smallerSize = Math.min(leftConcepts.size, rightConcepts.size);
  if (overlap.length >= 2 && smallerSize > 0 && overlap.length / smallerSize >= 0.67) {
    return `事件概念重复：${overlap.join(', ')}`;
  }
  return '';
}

function parseChinaTime(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/);
  if (!match) return 0;
  return Date.parse(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:00+08:00`);
}

function embeddedUpdateTime(source) {
  const marker = 'const _EMBEDDED_DATA = ';
  const start = source.indexOf(marker);
  if (start === -1) return '';
  const snippet = source.slice(start, start + 260);
  return snippet.match(/"updateTime"\s*:\s*"([^"]+)"/)?.[1] || '';
}

const [newsPayload, expertPayload, dailySource] = await Promise.all([
  readFile(newsPath, 'utf8').then(JSON.parse),
  readFile(expertPath, 'utf8').then(JSON.parse),
  readFile(dailyDataPath, 'utf8')
]);

const failures = [];
const warnings = [];
const news = Array.isArray(newsPayload.news) ? newsPayload.news : [];

if (news.length !== 10) failures.push(`新闻数量应为 10，当前为 ${news.length}`);
const ageHours = (Date.now() - parseChinaTime(newsPayload.updateTime)) / 3600000;
if (!Number.isFinite(ageHours) || ageHours < -1 || ageHours > 6) failures.push(`新闻更新时间异常：${newsPayload.updateTime || '缺失'}`);
if (expertPayload.updateTime !== newsPayload.updateTime || expertPayload.sourceNewsTime !== newsPayload.updateTime) {
  failures.push(`观点与新闻时间不同步：news=${newsPayload.updateTime}, expert=${expertPayload.updateTime}`);
}
const embeddedTime = embeddedUpdateTime(dailySource);
if (embeddedTime !== expertPayload.updateTime) failures.push(`内嵌观点时间不同步：embedded=${embeddedTime}, expert=${expertPayload.updateTime}`);

for (let leftIndex = 0; leftIndex < news.length; leftIndex += 1) {
  const item = news[leftIndex];
  if (!item.title || !item.source || !item.detail || !item.url) failures.push(`第 ${leftIndex + 1} 条新闻字段不完整`);
  if (!item.insight?.what || !item.insight?.chain || !item.insight?.watch) failures.push(`第 ${leftIndex + 1} 条新闻缺少完整解读`);
  for (let rightIndex = leftIndex + 1; rightIndex < news.length; rightIndex += 1) {
    const reason = duplicateReason(item, news[rightIndex]);
    if (reason) failures.push(`新闻重复 #${leftIndex + 1}/#${rightIndex + 1}：${reason}`);
  }
}

const sourceCounts = news.reduce((counts, item) => counts.set(item.source, (counts.get(item.source) || 0) + 1), new Map());
const topSource = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1])[0];
if (topSource?.[1] > 8) failures.push(`来源过度集中：${topSource[0]} 占 ${topSource[1]}/10`);
else if (topSource?.[1] > 6) warnings.push(`来源偏集中：${topSource[0]} 占 ${topSource[1]}/10`);

if (!expertPayload.mood?.summary || Object.keys(expertPayload.experts || {}).length < 4) failures.push('高手观点内容不完整');

warnings.forEach((warning) => console.warn(`⚠️ ${warning}`));
if (failures.length) {
  failures.forEach((failure) => console.error(`❌ ${failure}`));
  process.exit(1);
}

console.log(`✅ 内容巡检通过：${news.length} 条新闻，${sourceCounts.size} 个来源，观点更新时间 ${expertPayload.updateTime}`);
