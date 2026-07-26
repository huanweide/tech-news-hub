'use strict';
/*
 * 每周自动抓取脚本（GitHub Actions 调用，亦可本地 node scripts/weekly_update.cjs 运行）
 * - 从预设科技 RSS 抓取最近条目
 * - 若仓库配置了 DEEPSEEK_API_KEY 环境变量，则用 DeepSeek 生成权威深度解读；否则生成基础更新
 * - 幂等：若本周(w<N>)已有条目则跳过，避免与 WorkBuddy 自动化重复
 * - DRY_RUN=1 时不写文件，仅打印将生成的条目数（用于本地验证）
 */
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = process.env.DATA_PATH || path.join(ROOT, 'news-data.js');
const DRY_RUN = !!process.env.DRY_RUN;

const FEEDS = [
  { name: '量子位', url: 'https://www.qbitai.com/feed', cat: 'ai' },
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', cat: 'ai' },
  { name: '36氪', url: 'https://36kr.com/feed', cat: 'tech' },
  { name: '少数派', url: 'https://sspai.com/feed', cat: 'tech' },
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', cat: 'tech' },
  { name: 'arXiv cs.AI', url: 'https://rss.arxiv.org/rss/cs.AI', cat: 'ai' }
];

const AI_KW = ['ai', '大模型', '模型', '智能体', 'agent', '算力', '深度学习', '神经网络', 'gpt', 'llm', 'moe', '开源', '芯片', '量子', '多模态'];

function lastSeq(weeks) {
  let m = 0;
  (weeks || []).forEach(w => {
    const n = parseInt(String(w.id).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > m) m = n;
  });
  return m;
}

function catOf(text) {
  const t = (text || '').toLowerCase();
  for (const k of AI_KW) if (t.includes(k)) return 'ai';
  return 'tech';
}

function tagsOf(title, desc) {
  const pool = ['AI', '大模型', '开源', '算力', '多模态', '智能体', '量子', '芯片', '机器人', '新能源', '航天', '生物', '数据', '安全', '开发者'];
  const hits = new Set();
  const s = ((title || '') + ' ' + (desc || '')).toLowerCase();
  pool.forEach(p => { if (s.includes(p.toLowerCase())) hits.add(p); });
  return Array.from(hits).slice(0, 4);
}

function stripTags(s) {
  return String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function plain(s) {
  if (s == null) return '';
  if (typeof s === 'object') return stripTags(s['#text'] || '');
  return stripTags(s);
}

function weekRange(seq) {
  const now = new Date();
  const dow = (now.getDay() + 6) % 7; // 周一 = 0
  const monday = new Date(now); monday.setDate(now.getDate() - dow);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const f = d => `${d.getMonth() + 1}/${d.getDate()}`;
  return { range: `${f(monday)}–${f(sunday)}`, label: `${monday.getFullYear()}年${monday.getMonth() + 1}月 第${seq}周` };
}

async function fetchFeed(feed) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    const r = await fetch(feed.url, { signal: ctrl.signal, headers: { 'User-Agent': 'TechPulseBot/1.0 (+https://huanweide.github.io/tech-news-hub/)' } });
    clearTimeout(t);
    if (!r.ok) return [];
    const xml = await r.text();
    const p = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const j = p.parse(xml);
    const out = [];
    if (j.rss && j.rss.channel && j.rss.channel.item) {
      const arr = Array.isArray(j.rss.channel.item) ? j.rss.channel.item : [j.rss.channel.item];
      arr.forEach(it => out.push({ title: plain(it.title), link: plain(it.link), desc: plain(it.description), date: plain(it.pubDate) }));
    } else if (j.feed && j.feed.entry) {
      const arr = Array.isArray(j.feed.entry) ? j.feed.entry : [j.feed.entry];
      arr.forEach(it => {
        const link = (it.link && it.link['@_href']) ? it.link['@_href'] : plain(it.id);
        out.push({ title: plain(it.title), link, desc: plain(it.summary || it.content), date: plain(it.updated || it.pubDate) });
      });
    }
    return out.map(it => ({ ...it, cat: feed.cat, source: feed.name }));
  } catch (e) {
    console.warn('feed failed:', feed.name, e.message);
    return [];
  }
}

function withinDays(dateStr, days) {
  if (!dateStr) return true;
  const t = Date.parse(dateStr);
  if (isNaN(t)) return true;
  return (Date.now() - t) <= days * 86400000;
}

function ruleItem(raw, seq, idx) {
  const summary = raw.desc.length > 120 ? raw.desc.slice(0, 120) + '…' : raw.desc;
  return {
    id: `auto-w${seq}-${idx}`,
    week: `w${seq}`,
    category: catOf(raw.title + ' ' + raw.desc),
    tags: tagsOf(raw.title, raw.desc),
    impactScore: 72,
    title: raw.title,
    summary: summary || raw.title,
    what: `本条目由 RSS 自动抓取（来源：${raw.source}）。原始报道：${raw.desc}\n（自动抓取版本，深度解读待 AI 润色。）`,
    compare: '待补充：与站内同类条目的横向对比。',
    why: '待补充：战略 / 产业 / 技术动因。',
    output: '待补充：已交付物与量化结果。',
    explain: '待补充：技术解析与架构（可补充内联 SVG）。',
    impact: '待补充：行业结构性影响。',
    action: '读者可点击来源链接阅读原文，关注后续 AI 润色版本。',
    sources: [{ name: raw.source, url: raw.link }]
  };
}

async function aiItem(raw, seq, idx) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return ruleItem(raw, seq, idx);
  const prompt = `你是严谨的科技资讯编辑。基于以下真实新闻线索，产出权威、专业的深度解读（中文，讲机制/架构/权衡，不要大白话）。严格只输出一个 JSON 对象（不要 markdown、不要代码块），字段：title, summary, what, compare, why, output, explain, impact, action, tags(字符串数组), impactScore(数字)。
线索：
标题：${raw.title}
来源：${raw.source}
原文摘要：${raw.desc}
类别倾向：${raw.cat}`;
  try {
    const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'system', content: '你只输出严格 JSON' }, { role: 'user', content: prompt }], temperature: 0.3 })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    const txt = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    if (!txt) throw new Error('empty response');
    const obj = JSON.parse(txt.replace(/```json|```/g, '').trim());
    return {
      id: `auto-w${seq}-${idx}`,
      week: `w${seq}`,
      category: raw.cat,
      tags: Array.isArray(obj.tags) ? obj.tags : tagsOf(raw.title, raw.desc),
      impactScore: typeof obj.impactScore === 'number' ? obj.impactScore : 72,
      title: obj.title || raw.title,
      summary: obj.summary || (raw.desc.slice(0, 120)),
      what: obj.what, compare: obj.compare, why: obj.why, output: obj.output,
      explain: obj.explain, impact: obj.impact, action: obj.action,
      sources: [{ name: raw.source, url: raw.link }]
    };
  } catch (e) {
    console.warn('AI gen failed, fallback rule:', e.message);
    return ruleItem(raw, seq, idx);
  }
}

function serialize(ND) {
  const header = `/*
 * tech-news-hub 数据层（自动更新生成，字段契约见各维度注释）
 * weeks[]      : { id, label, range }
 * categories[] : { id, label, disabled? }
 * items[]      : { id, week, category, tags[], impactScore, title, summary, what, compare, why, output, explain, impact, action, sources[], architecture?, archCaption? }
 * sources[]    : { name, url }
 * 非盈利公益科普平台；内容仅供学习参考，附可追溯来源。LLM 助手为 Bring-Your-Own-Key，密钥仅存浏览器本地。
 */
const NEWS_DATA = `;
  const body = JSON.stringify(ND, null, 2);
  const footer = `;

if (typeof module !== "undefined" && module.exports) { module.exports = NEWS_DATA; }
if (typeof window !== "undefined") { window.NEWS_DATA = NEWS_DATA; }
`;
  return header + body + footer;
}

async function main() {
  const ND = require(DATA_PATH);
  const seq = lastSeq(ND.weeks) + 1;
  const newId = `w${seq}`;
  const existing = (ND.items || []).filter(it => it.week === newId);
  if (existing.length) { console.log(`本周(${newId})已有 ${existing.length} 条，跳过。`); return; }
  const { range, label } = weekRange(seq);
  console.log(`准备生成新周 ${newId} (${label}, ${range})`);

  let raws = [];
  const seen = new Set();
  for (const f of FEEDS) {
    const items = await fetchFeed(f);
    items.forEach(it => {
      if (!it.title || !it.link) return;
      if (!withinDays(it.date, 9)) return;
      if (seen.has(it.link)) return;
      seen.add(it.link);
      raws.push(it);
    });
  }
  raws = raws.slice(0, 14);
  if (!raws.length) { console.log('未抓取到候选新闻，跳过本次更新。'); return; }

  const useAI = !!process.env.DEEPSEEK_API_KEY;
  const newItems = [];
  for (let i = 0; i < raws.length; i++) {
    newItems.push(await aiItem(raws[i], seq, i));
  }
  ND.weeks.push({ id: newId, label, range });
  newItems.forEach(it => ND.items.push(it));

  if (DRY_RUN) {
    console.log(`[DRY_RUN] 将新增周 ${newId}，条目 ${newItems.length} 条。AI=${useAI}。不写文件。`);
    return;
  }
  fs.writeFileSync(DATA_PATH, serialize(ND), 'utf8');
  console.log(`已写入新周 ${newId}，共 ${newItems.length} 条。AI=${useAI}`);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
