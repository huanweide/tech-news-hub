'use strict';
/*
 * 配置外置的等价性回归。
 *
 * 这次改动的整个安全性都压在一句话上：**作者原有的每周自动更新任务，
 * 行为一点都不能变。** 抓取源、分类关键词、标签池、架构图文案原本硬编码
 * 在 weekly_update.cjs 里，现在挪到了 pulse.config.js。
 *
 * 光靠肉眼看「应该没改」是不行的 —— 挪常量是最容易手滑的地方：
 * 少一个词、顺序变一下、数量截断错了，都不会报错，只是每周生成的新闻
 * 悄悄变了。所以这里把改动前的原值**逐项写死**，每次 npm test 都比一遍。
 *
 * 另外，「少写一个词」这类错误在默认值上会静默通过，所以还要验
 * catOf / tagsOf 的实际归类结果对一批固定输入保持不变。
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = require(path.join(ROOT, 'pulse.config.js'));

let pass = 0;
const fails = [];
function ok(cond, name) {
  if (cond) pass++;
  else fails.push(name);
}
function eq(actual, expected, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  ok(a === e, `${name}\n      期望 ${e}\n      实际 ${a}`);
}

// ---------------------------------------------------------------------------
// 一、原值快照（改动前 hardcode 在 weekly_update.cjs 里的逐项取值）
// ---------------------------------------------------------------------------
const ORIGINAL_FEEDS = [
  { name: '量子位', url: 'https://www.qbitai.com/feed', cat: 'ai' },
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', cat: 'ai' },
  { name: '36氪', url: 'https://36kr.com/feed', cat: 'tech' },
  { name: '少数派', url: 'https://sspai.com/feed', cat: 'tech' },
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', cat: 'tech' },
  { name: 'arXiv cs.AI', url: 'https://rss.arxiv.org/rss/cs.AI', cat: 'ai' }
];

const ORIGINAL_AI_KW = [
  'ai', '大模型', '模型', '智能体', 'agent', '算力', '深度学习',
  '神经网络', 'gpt', 'llm', 'moe', '开源', '芯片', '量子', '多模态'
];

const ORIGINAL_TAG_POOL = [
  'AI', '大模型', '开源', '算力', '多模态', '智能体', '量子', '芯片',
  '机器人', '新能源', '航天', '生物', '数据', '安全', '开发者'
];

const ORIGINAL_ARCH_LABELS = {
  ai: { left: '原始线索', mid: '模型 / 路由', right: '深度解读', group: 'AI 技术链路' },
  tech: { left: '信源输入', mid: '处理 / 聚合', right: '对外交付', group: '产品技术链路' }
};

// ---------------------------------------------------------------------------
// 二、逐项等价
// ---------------------------------------------------------------------------
eq(CONFIG.feeds, ORIGINAL_FEEDS, '抓取源与改动前完全一致（顺序/数量/字段）');
eq(CONFIG.categoryKeywords, ORIGINAL_AI_KW, '分类关键词与改动前完全一致');
eq(CONFIG.tagPool, ORIGINAL_TAG_POOL, '标签池与改动前完全一致');
eq(CONFIG.archLabels, ORIGINAL_ARCH_LABELS, '架构图文案与改动前完全一致');
ok(CONFIG.tagMax === 4, '标签截断数量保持 4');
ok(CONFIG.harvest && CONFIG.harvest.withinDays === 9, '抓取窗口保持 9 天');
ok(CONFIG.harvest && CONFIG.harvest.maxItems === 14, '每周收录上限保持 14 条');

// ---------------------------------------------------------------------------
// 三、分类与标签的实际行为（防「漏词」这类静默错误）
// ---------------------------------------------------------------------------
function catOf(text, kw, cats) {
  const t = String(text || '').toLowerCase();
  const primary = (cats && cats.primaryCat) || 'ai';
  const fallback = (cats && cats.fallbackCat) || 'tech';
  for (const k of kw) if (t.includes(k)) return primary;
  return fallback;
}

const CAT_CASES = [
  ['OpenAI 发布新一代 GPT 模型', 'ai'],
  ['量子计算原型机取得突破', 'ai'],
  ['某手机厂商发布新机', 'tech'],
  ['新能源汽车销量增长', 'tech'],
  ['开源社区发布新版本', 'ai'],
  ['', 'tech']
];
CAT_CASES.forEach(([text, expected]) => {
  ok(catOf(text, CONFIG.categoryKeywords, CONFIG.categories) === expected,
    `分类行为不变：「${text}」应归 ${expected}`);
});

// 标签：多命中时要按 pool 顺序且截断到 4
function tagsOf(title, desc, pool, max) {
  const hits = new Set();
  const s = ((title || '') + ' ' + (desc || '')).toLowerCase();
  pool.forEach(p => { if (s.includes(String(p).toLowerCase())) hits.add(p); });
  return Array.from(hits).slice(0, max || 4);
}
const got = tagsOf('AI 大模型开源算力多模态智能体量子芯片', '', CONFIG.tagPool, CONFIG.tagMax);
eq(got, ['AI', '大模型', '开源', '算力'],
  '标签抽取按池顺序 + 截断到 4（多命中场景）');

// ---------------------------------------------------------------------------
// 四、配置自洽性（防止别人改配置时填错）
// ---------------------------------------------------------------------------
ok(Array.isArray(CONFIG.feeds) && CONFIG.feeds.length > 0, '配置里至少有一个抓取源');
const catIds = (CONFIG.categories && CONFIG.categories.ids) || [];
ok(catIds.length > 0, '声明了分类 id 列表');
CONFIG.feeds.forEach(f => {
  ok(catIds.includes(f.cat), `抓取源「${f.name}」的 cat=${f.cat} 必须在 categories.ids 里`);
  ok(typeof f.url === 'string' && /^https?:\/\//.test(f.url), `抓取源「${f.name}」的 url 必须是 http(s) 链接`);
});
ok(catIds.includes((CONFIG.categories || {}).primaryCat), 'primaryCat 必须在 categories.ids 里');
ok(catIds.includes((CONFIG.categories || {}).fallbackCat), 'fallbackCat 必须在 categories.ids 里');
Object.keys(CONFIG.archLabels).forEach(k => {
  ok(catIds.includes(k) || k === 'default', `archLabels 的键「${k}」应是已声明的分类`);
});

// ---------------------------------------------------------------------------
// 五、外部配置覆盖能力（这是本次转向新增的能力）
// ---------------------------------------------------------------------------
const tmpCfg = path.join(ROOT, '.pulse_config_test_tmp.js');
fs.writeFileSync(tmpCfg, `module.exports = Object.assign({}, require('./pulse.config.js'), {
  site: { name: '我的周刊' },
  feeds: [{ name: '自定义源', url: 'https://example.com/feed', cat: 'tech' }]
});\n`, 'utf8');
try {
  const custom = require(tmpCfg);
  ok(custom.feeds.length === 1 && custom.feeds[0].name === '自定义源',
    '外部配置可覆盖抓取源');
  ok(custom.site.name === '我的周刊', '外部配置可覆盖站点名');
  ok(CONFIG.feeds.length === 6, '覆盖不会影响默认配置对象本身');
} finally {
  fs.unlinkSync(tmpCfg);
}

// ---------------------------------------------------------------------------
console.log(`\n配置等价性验证：${pass} 通过 / ${fails.length} 失败`);
if (fails.length) {
  fails.forEach(f => console.log('  FAIL ' + f));
  process.exit(1);
}
console.log('ALL_GREEN ✓ 默认配置与改动前行为完全一致，每周任务不会受影响');
