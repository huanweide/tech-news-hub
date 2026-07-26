/* R16 验证：右侧 LLM 学习助手（BYOK · 本地密钥 · 检索增强 · 确认机制 · 记忆持久）
 * jsdom 真机派发；用 mock window.fetch 模拟 OpenAI 兼容接口（首次返回 tool_call，二次返回最终回答）。
 * 运行：node r16_test.cjs
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
window.__serverKeys = undefined; // 显式声明：本站服务器从不持有密钥

function load(f) { window.eval(fs.readFileSync(f, 'utf8')); }
load('./news-data.js'); load('./features.js'); load('./deals-data.js'); load('./app.js');
const ND = window.NEWS_DATA;

function click(el) { if (!el) return; el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); }
function $(s) { return document.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

/* ---- 模拟 OpenAI 兼容接口 ---- */
let callN = 0; const captured = { url: '', auth: '' }; const done = {};
function toolResp(name, args) {
  return { choices: [{ message: { role: 'assistant', content: '', tool_calls: [{ id: 'call_1', type: 'function', function: { name: name, arguments: JSON.stringify(args) } }] } }] };
}
function finalResp(text) { return { choices: [{ message: { role: 'assistant', content: text } }] }; }
window.fetch = function (url, opts) {
  callN++;
  captured.url = url; captured.auth = (opts.headers && opts.headers.Authorization) || '';
  const body = JSON.parse(opts.body); const msgs = body.messages;
  const lastUser = msgs.slice().reverse().find(m => m.role === 'user'); const text = lastUser ? lastUser.content : '';
  let resp;
  if (/打开|open/i.test(text)) {
    if (done[text]) resp = finalResp('已为你打开，可在正文中查看 8 维度解读。');
    else { done[text] = 1; resp = toolResp('open_article', { id: ND.items[0].id }); }
  } else if (/记住|记忆|save/i.test(text)) {
    if (done[text]) resp = finalResp('好的，已记录到你的记忆。');
    else { done[text] = 1; resp = toolResp('save_note', { text: '我关注 AI 监管' }); }
  } else if (/优惠|性价比|降价|deal/i.test(text)) {
    if (done[text]) resp = finalResp('已为你列出优惠，见上方卡片。');
    else { done[text] = 1; resp = toolResp('lookup_deal', { query: '硅基流动' }); }
  } else if (msgs.some(m => m.role === 'tool')) {
    resp = finalResp('根据资料库，已为你整理如下（见上方卡片）。');
  } else {
    const q = (text.match(/量子/) || ['科技'])[0];
    resp = toolResp('search_news', { query: q });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve(resp) });
};

(async function run() {
  /* 1. 助手按钮与抽屉 */
  ok($('#agentBtn') != null, '助手按钮存在');
  click($('#agentBtn'));
  ok($('#agentPanel').hidden === false, '点击后助手抽屉打开');
  ok($('#agentSettings') != null, '配置弹层存在');
  ok($('#agentCfgNow') != null, '未配置时显示“去配置”入口');
  ok($('.agent-badge') && /BYOK|本地密钥/.test($('.agent-badge').textContent), '抽屉标注 BYOK·本地密钥');

  /* 2. 配置保存（兼容格式 + 可交互 + 可确认） */
  const BASE = 'https://api.example.com/v1', KEY = 'sk-test-12345', MODEL = 'gpt-4o-mini';
  $('#agentBaseURL').value = BASE; $('#agentModel').value = MODEL; $('#agentKey').value = KEY;
  $('#agentInteractive').checked = true; $('#agentConfirm').checked = true; $('#agentStream').checked = false;
  click($('#agentSave'));
  const cfg = JSON.parse(window.localStorage.getItem('techpulse-agent') || '{}');
  ok(cfg.enabled === true, '配置齐全后 enabled=true');
  ok(cfg.apiKey === KEY, '密钥写入本地 localStorage');
  ok($('#agentCfgNow') == null, '配置后不再显示“去配置”');
  ok($all('.agent-sug').length >= 1, '配置后出现建议气泡');

  /* 3. 发送“找新闻”→ 触发检索工具 + 确认机制 */
  $('#agentInput').value = '帮我找量子相关的新闻';
  $('#agentForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await delay(20);
  ok($('.agent-confirm') != null, '执行索引操作前出现确认框（可确认机制）');
  ok(/检索新闻/.test($('.agent-confirm-label').textContent), '确认框标注为“检索新闻”');
  click($('.agent-confirm-yes'));
  await delay(30);
  ok($('.agent-tool') != null, '确认后出现工具卡片');
  if (!$('.agent-card')) console.log('DEBUG agentMsgs:', document.getElementById('agentMsgs').innerHTML.slice(0, 700), '\nDEBUG callN', callN);
  ok($all('.agent-card').length >= 1, '检索结果以卡片呈现：' + $all('.agent-card').length);
  ok($('.agent-msg.bot') != null, '助手给出最终回答');

  /* 4. 记忆持久（对话写入本地） */
  const mem = JSON.parse(window.localStorage.getItem('techpulse-agent-mem') || '{}');
  ok(mem.messages && mem.messages.length >= 2, '对话记忆已持久化到本地：' + (mem.messages ? mem.messages.length : 0) + ' 条');

  /* 5. 点击结果卡片 → 跳转到正文（索引操作：找文章） */
  const firstCard = $('.agent-card');
  const cardTitle = firstCard ? firstCard.querySelector('.agent-card-title').textContent : '';
  ok(firstCard != null, '首条结果卡片存在');
  click($('.agent-card .agent-card-go'));
  await delay(20);
  const feedText = ($('.hero') ? $('.hero').textContent : '') + ($('#feed') ? $('#feed').textContent : '');
  ok(feedText.indexOf(cardTitle) >= 0, '点击卡片跳转到对应新闻正文');

  /* 6. 发送“打开文章”→ open_article 工具 + 确认 + 导航 */
  $('#agentInput').value = '打开这篇新闻';
  $('#agentForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await delay(20);
  ok($('.agent-confirm') != null, 'open_article 触发确认框');
  ok(/打开文章/.test($('.agent-confirm-label').textContent), '确认框标注为“打开文章”');
  click($('.agent-confirm-yes'));
  await delay(30);
  const openedTitle = ND.items[0].title;
  const feedText2 = ($('.hero') ? $('.hero').textContent : '') + ($('#feed') ? $('#feed').textContent : '');
  ok(feedText2.indexOf(openedTitle) >= 0, '确认后跳转到目标文章《' + openedTitle.slice(0, 12) + '…》');

  /* 7. 发送“保存记忆”→ save_note 工具 + 记忆入库 */
  const notesBefore = (JSON.parse(window.localStorage.getItem('techpulse-agent-mem') || '{}').notes || []).length;
  $('#agentInput').value = '记住：我关注 AI 监管';
  $('#agentForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await delay(20);
  ok($('.agent-confirm') != null, 'save_note 触发确认框');
  click($('.agent-confirm-yes'));
  await delay(30);
  const notesAfter = (JSON.parse(window.localStorage.getItem('techpulse-agent-mem') || '{}').notes || []).length;
  ok(notesAfter === notesBefore + 1, '笔记已写入本地记忆：' + notesBefore + '→' + notesAfter);

  /* 7.5 发送“找优惠”→ lookup_deal 工具（第 6 个工具）+ 打开优惠圈 */
  $('#agentInput').value = '帮我找硅基流动的优惠';
  $('#agentForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await delay(20);
  ok($('.agent-confirm') != null, 'lookup_deal 触发确认框');
  ok(/查询优惠/.test($('.agent-confirm-label').textContent), '确认框标注为“查询优惠”');
  click($('.agent-confirm-yes'));
  await delay(30);
  var dealCards = $all('.agent-card').filter(function (c) { var k = c.querySelector('.agent-card-kind'); return k && /优惠/.test(k.textContent); });
  ok(dealCards.length >= 1, 'lookup_deal 结果以卡片呈现：' + dealCards.length);
  click(dealCards[dealCards.length - 1].querySelector('.agent-card-go'));
  await delay(20);
  ok($('#dealsView').hidden === false, '点击优惠卡片后优惠圈区块可见（同页常驻）');
  ok($all('#dealsContent .deal-card').length >= 1, '优惠圈已渲染卡片');

  /* 8. 安全机制：密钥本地化，永不发往本站服务器 */
  ok(captured.url === BASE + '/chat/completions', '请求直连用户配置的接口（非本站服务器）：' + captured.url);
  ok(captured.auth === 'Bearer ' + KEY, 'Authorization 使用本地密钥');
  ok(window.__serverKeys === undefined, '本站服务器对象不持有任何密钥');

  /* 9. 清除密钥（记忆保留） */
  click($('#agentSettingsBtn'));
  await delay(5);
  click($('#agentClearKey'));
  await delay(5);
  const cfg2 = JSON.parse(window.localStorage.getItem('techpulse-agent') || '{}');
  ok(!cfg2.apiKey, '清除密钥后本地不再存密钥');
  const mem2 = JSON.parse(window.localStorage.getItem('techpulse-agent-mem') || '{}');
  ok(mem2.notes && mem2.notes.length >= 1, '清除密钥后记忆仍保留');

  console.log('R16 验证：' + pass + ' 通过 / ' + fail + ' 失败（fetch 调用 ' + callN + ' 次）');
  if (fail) { console.log('失败项：'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
  else console.log('R16 ALL_GREEN ✓');
})();
