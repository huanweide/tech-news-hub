/* R18 验证：模型优惠圈（发布/展示/自动过期下架 + 类型/平台过滤 + 状态计算 + 返回资讯流）
 * jsdom 真机派发；运行：node deals_test.cjs
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const html = fs.readFileSync('./index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom; const { document } = window;
window.scrollTo = () => {}; window.Chart = undefined; window.html2canvas = undefined; window.Element.prototype.scrollIntoView = function(){};
window.URL.createObjectURL = () => 'blob:x'; window.URL.revokeObjectURL = () => {};
window.open = () => null;

function load(f) { window.eval(fs.readFileSync(f, 'utf8')); }
load('./news-data.js'); load('./features.js'); load('./deals-data.js'); load('./app.js');
const DD = window.DEALS_DATA;

function click(el) { if (!el) return; el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); }
function $(s) { return document.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

const today = new Date(); today.setHours(0, 0, 0, 0);
const notExpired = DD.deals.filter(function (d) { return !d.validUntil || new Date(d.validUntil + 'T00:00:00') >= today; });
const allCount = DD.deals.length;
const offExpected = notExpired.length;

(async function run() {
  /* 1. 优惠圈按钮与视图打开 */
  ok($('#dealsBtn') != null, '优惠圈按钮存在');
  ok($('#dealsView').hidden === false, '优惠圈区块默认同页常驻可见（与 AI 资讯在一起）');
  click($('#dealsBtn'));
  ok($('#dealsView').hidden === false, '点击优惠圈后区块仍可见（平滑滚动+高亮聚焦）');
  ok($('#dealsContent') != null, '优惠内容容器存在');

  /* 2. 默认过滤掉过期项（自动下架） */
  let cardsOff = $all('#dealsContent .deal-card');
  ok(cardsOff.length === offExpected, '默认展示有效优惠数=' + offExpected + '（实际 ' + cardsOff.length + '）');
  ok(!$('#dealsContent').textContent.includes('ArkClaw 邀新活动'), '已过期优惠默认不展示（自动下架）');

  /* 3. 勾选“显示已过期”后出现全部（含过期） */
  const exp = $('#dealsShowExpired');
  ok(exp != null, '显示已过期开关存在');
  exp.checked = true;
  exp.dispatchEvent(new window.Event('change', { bubbles: true }));
  let cardsOn = $all('#dealsContent .deal-card');
  ok(cardsOn.length === allCount, '显示已过期后展示全部=' + allCount + '（实际 ' + cardsOn.length + '）');
  ok($('#dealsContent').textContent.includes('ArkClaw 邀新活动'), '勾选后过期优惠出现');
  const endedCard = cardsOn.filter(function (c) { return c.textContent.includes('ArkClaw 邀新活动'); })[0];
  if (endedCard) {
    const eb = endedCard.querySelector('.deal-status');
    ok(eb != null && /已结束/.test(eb.textContent), '真实过期优惠状态徽标正确：' + (eb ? eb.textContent : '无'));
  } else { ok(false, '真实过期优惠卡片应存在'); }

  /* 4. 类型过滤：性价比推荐 */
  click($('.deals-type[data-dtype="all"]'));
  const valueExpected = DD.deals.filter(function (d) { return d.type === 'value'; }).length;
  click($('.deals-type[data-dtype="value"]'));
  let valueCards = $all('#dealsContent .deal-card');
  ok(valueCards.length === valueExpected && valueExpected >= 1, '类型=性价比推荐 仅显示 ' + valueExpected + ' 条');
  ok($('#dealsContent').textContent.includes('性价比评测'), '性价比推荐卡含预期内容');

  /* 5. 平台过滤：官方直降（先复位类型=全部） */
  exp.checked = false;
  exp.dispatchEvent(new window.Event('change', { bubbles: true }));
  click($('.deals-type[data-dtype="all"]'));
  const officialExpected = DD.deals.filter(function (d) {
    return d.platformType === 'official' && (!d.validUntil || new Date(d.validUntil + 'T00:00:00') >= today);
  }).length;
  click($('.deals-platform[data-dplat="official"]'));
  let officialCards = $all('#dealsContent .deal-card');
  ok(officialCards.length === officialExpected && officialExpected >= 3, '平台=官方直降 仅显示活跃 ' + officialExpected + ' 条（实际 ' + officialCards.length + '）');

  /* 6. 状态计算：当前优惠显示“进行中” */
  click($('.deals-platform[data-dplat="all"]'));
  const activeCard = $all('#dealsContent .deal-card').filter(function (c) { return c.textContent.includes('硅基流动'); })[0];
  ok(activeCard != null, '当前优惠(硅基流动)卡片存在');
  if (activeCard) {
    const st = activeCard.querySelector('.deal-status');
    ok(st != null && /进行中/.test(st.textContent), '进行中优惠状态徽标正确：' + (st ? st.textContent : '无'));
  }

  /* 7. 即将开始状态（upcoming-gpu-voucher） */
  const activeCards = $all('#dealsContent .deal-card');
  const badStatus = activeCards.filter(function (c) {
    const s = c.querySelector('.deal-status');
    return s && (/已结束/.test(s.textContent) || /即将开始/.test(s.textContent));
  });
  ok(badStatus.length === 0, '隐藏过期态下无"已结束"/虚假"即将开始"徽标（实际 ' + badStatus.length + '）');

  /* 8. 展开详情 */
  const firstCard = $('#dealsContent .deal-card');
  const toggle = firstCard && firstCard.querySelector('.deal-toggle');
  ok(toggle != null, '优惠卡含展开按钮');
  if (toggle) {
    click(toggle);
    ok(firstCard.querySelector('.deal-detail').hidden === false, '点击展开后详情可见');
  }

  /* 9. 回到顶部（优惠圈同页常驻，不隐藏） */
  click($('.deals-back-feed'));
  ok($('#dealsView').hidden === false, '点击回到顶部后优惠圈区块仍常驻可见');

  console.log('\nR18 deals_test: ' + pass + ' passed, ' + fail + ' failed');
  if (fail) { console.log('FAILED:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('ALL_GREEN ✓');
})().catch(function (e) { console.error('deals_test 异常:', e); process.exit(1); });
