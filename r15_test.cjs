/* R15 验证：资料库 / 索引机制 / 自动更新徽标（jsdom 真机派发事件）
 * 运行：node r15_test.cjs
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');

let pass = 0, fail = 0;
const fails = [];
function ok(c, m) { if (c) { pass++; } else { fail++; fails.push(m); } }

const html = fs.readFileSync('./index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;
const { document } = window;
window.scrollTo = () => {};
window.Chart = undefined;
window.html2canvas = undefined;
window.URL.createObjectURL = () => 'blob:x';
window.URL.revokeObjectURL = () => {};

function load(f) { window.eval(fs.readFileSync(f, 'utf8')); }
load('./news-data.js');
load('./features.js');
load('./app.js');

function click(el) { if (!el) return; el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); }
function fire(el, type) { if (!el) return; el.dispatchEvent(new window.Event(type, { bubbles: true })); }
function flushDebounce(ms) { return new Promise(function (r) { setTimeout(r, ms || 320); }); }
function $(s) { return document.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

const ND = window.NEWS_DATA;
const archCount = ND.items.filter(function (it) { return !!it.architecture; }).length;

/* 1. 初始态：资料库隐藏，资讯流可见 */
ok($('#kbView').hidden === true, '初始 #kbView 隐藏');
ok($('#kbBtn') != null, '资料库按钮存在');
ok($all('.card').length > 0, '初始资讯流已渲染卡片');

/* 2. 打开资料库 */
click($('#kbBtn'));
ok($('#kbView').hidden === false, '点击资料库后 #kbView 显示');
ok(document.body.classList.contains('kb-open'), 'body 加 kb-open');
ok($all('.kb-term').length > 50, '名词索引已列出（>50 条）：' + $all('.kb-term').length);

/* 3. 自动更新徽标已填充 */
ok($('#kbWeek') && $('#kbWeek').textContent.trim() !== '—' && /[（(]/.test($('#kbWeek').textContent), '自动更新/数据周次徽标已填充：' + ($('#kbWeek') ? $('#kbWeek').textContent : 'NONE'));

/* 4. 名词 → 详情（点 MoE，应带架构含义 + 关联新闻） */
const moeterm = $('.kb-term[data-term="MoE"]');
ok(moeterm != null, '名词索引含 MoE');
click(moeterm);
ok($('.kb-detail-title') && $('.kb-detail-title').textContent === 'MoE', 'MoE 详情标题正确');
ok($('.kb-def') && $('.kb-def').textContent.length > 10, 'MoE 释义已渲染');
ok($('.kb-detail .arch-fig svg') != null, 'MoE 详情含架构图(架构含义)');
ok($all('.kb-news').length >= 1, 'MoE 关联新闻 >=1：' + $all('.kb-news').length);
ok($('.kb-back') != null, '详情含返回按钮');

/* 5. 返回索引 → 切到架构索引 */
click($('.kb-back'));
ok($all('.kb-term').length > 50, '返回后名词索引仍在');
click($('.kb-tab[data-kbtab="arch"]'));
ok($all('.kb-arch').length === archCount, '架构索引数量 = 带架构的新闻数(' + archCount + ')：' + $all('.kb-arch').length);

/* 6. 架构 → 详情（点第一个架构，含 svg + 涉及名词 + 关联新闻） */
click($('.kb-arch'));
ok($('.kb-detail .arch-fig svg') != null, '架构详情含 SVG');
ok($all('.kb-term-pill').length >= 1, '架构详情含涉及名词：' + $all('.kb-term-pill').length);
ok($all('.kb-news').length >= 1, '架构详情含关联新闻：' + $all('.kb-news').length);
/* 点涉及名词 → 跳到该名词详情 */
const pill = $('.kb-term-pill');
const pillTerm = pill.getAttribute('data-term');
click(pill);
ok($('.kb-detail-title') && $('.kb-detail-title').textContent === pillTerm, '从架构详情点名词跳转正确：' + pillTerm);
/* 从名词详情点关联新闻 → 回到资讯流 */
click($('.kb-back'));
click($('.kb-tab[data-kbtab="arch"]'));
click($('.kb-arch'));
const aNews = $('.kb-news');
click(aNews);
ok($('#kbView').hidden === true, '从资料库点关联新闻后回到资讯流');
ok($all('.card').length > 0, '资讯流已恢复渲染');

/* 7. 新闻库分栏 */
click($('#kbBtn'));
click($('.kb-tab[data-kbtab="lib"]'));
ok($all('.kb-lib-cat').length >= 2, '新闻库含分类筛选');
ok($all('.kb-news[data-go]').length === ND.items.length, '新闻库列出全部新闻(' + ND.items.length + ')：' + $all('.kb-news[data-go]').length);
/* 分类筛选 */
const aiCat = $('.kb-lib-cat[data-libcat="ai"]');
if (aiCat) {
  click(aiCat);
  const shown = $all('.kb-news[data-go]').length;
  const aiTotal = ND.items.filter(function (it) { return it.category === 'ai'; }).length;
  ok(shown === aiTotal, '新闻库 AI 筛选正确：' + shown + '/' + aiTotal);
}

/* 8. 资料库搜索（覆盖 名词/架构/新闻）—— 输入走 debounce(200ms)，须等落地
   前置条件：必须在资料库「列表视图」（state.view === 'kb'）。若停在 kbTerm/kbArch
   详情态，renderKB() 会提前 return、搜索不生效——所以先点「返回索引」退出详情。
   再打开资料库（若已关闭）并确保停在 terms 索引 tab。 */
/* 关键：#kbBtn 的 openKB() 会强制 state.view='kb' 且清空 kbTerm/kbArch，是确定性重置入口，
   即使已打开也安全（幂等）。必须在所有 debounce 落地后再执行，否则旧 render 会覆盖。 */
const done = function () {
  console.log('R15 验证：' + pass + ' 通过 / ' + fail + ' 失败');
  if (fail) { console.log('失败项：'); fails.forEach(function (f) { console.log('  ✗ ' + f); }); process.exit(1); }
  else console.log('R15 ALL_GREEN ✓');
};
flushDebounce().then(function () {
  click($('#kbBtn'));
  return flushDebounce(80);
}).then(function () {
  const kq0 = $('#kbSearch');
  kq0.value = '量子';
  fire(kq0, 'input');
  return flushDebounce();
}).then(function () {
  ok($('.kb-search-head') != null, '搜索“量子”出结果头');
  ok($all('.kb-term, .kb-arch, .kb-news').length >= 1, '搜索“量子”命中条目：' + $all('.kb-term, .kb-arch, .kb-news').length);
  const kq1 = $('#kbSearch');
  kq1.value = 'zzz不存在的词';
  fire(kq1, 'input');
  return flushDebounce();
}).then(function () {
  ok($('.kb-empty') != null, '搜索无结果时显示空提示');
  const kq2 = $('#kbSearch');
  kq2.value = '';
  fire(kq2, 'input');
  return flushDebounce();
}).then(function () {
  /* 9. 术语弹层 → “在资料库查看” 链接（接在第 8 步之后，保证视图已复位到资讯流） */
  click($('.kb-back-feed')); // 回到资讯流
  const termSpan = $('.term');
  ok(termSpan != null, '资讯流中存在可点击术语');
  if (termSpan) click(termSpan);
  const pop = $('#glossPop');
  ok(pop && pop.hidden === false, '点击术语弹出释义层');
  ok($('.gp-more') != null, '弹层含“在资料库查看”链接');
  const moreBtn = $('.gp-more');
  if (moreBtn) click(moreBtn);
  ok($('#kbView').hidden === false && $('.kb-detail-title') != null, '从弹层跳入资料库名词详情');

  /* 10. 返回资讯流（data-feed） */
  click($('.kb-back-feed'));
  ok($('#kbView').hidden === true, '点返回资讯流关闭资料库');
  return flushDebounce(80);
}).then(function () { done(); });

