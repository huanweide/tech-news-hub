/* R19：axe-core 无障碍回归（结构规则）+ 调色板对比度校验（WCAG AA）
 * jsdom 渲染真实 DOM 后跑 axe-core；对比度因 jsdom 无布局，改用 CSS 变量精确计算。
 * 运行：NODE_PATH=C:/Users/Administrator/.workbuddy/binaries/node/workspace/node_modules node a11y_test.cjs
 */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const axe = require('axe-core');

let pass = 0, fail = 0; const fails = [];
function ok(c, m) { if (c) pass++; else { fail++; fails.push(m); } }
const delay = (ms) => new Promise(r => setTimeout(r, ms));

const html = fs.readFileSync('./index.html', 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom; const { document } = window;
global.window = window; global.document = document;
window.scrollTo = () => {}; window.Chart = undefined; window.html2canvas = undefined;
window.Element.prototype.scrollIntoView = function(){};
window.URL.createObjectURL = () => 'blob:x'; window.URL.revokeObjectURL = () => {};
window.open = () => null;

function load(f) { window.eval(fs.readFileSync(f, 'utf8')); }
load('./news-data.js'); load('./features.js'); load('./deals-data.js'); load('./app.js');

/* ---- 对比度工具（WCAG 2.1）---- */
function lum(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16) / 255, g = parseInt(h.substr(2, 2), 16) / 255, b = parseInt(h.substr(4, 2), 16) / 255;
  const f = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(fg, bg) { const L1 = lum(fg), L2 = lum(bg); const a = Math.max(L1, L2), b = Math.min(L1, L2); return (a + 0.05) / (b + 0.05); }

(async function run() {
  await delay(60);
  /* 1) axe-core 结构规则（关闭依赖布局的 color-contrast，改用下方精确计算） */
  let results;
  try {
    window.eval(axe.source);
    results = await window.axe.run(window.document, { rules: { 'color-contrast': { enabled: false } } });
  } catch (e) {
    console.error('axe run error:', e && e.message); process.exit(2);
  }
  const v = results.violations || [];
  console.log('\n=== axe-core 结构违规：' + v.length + ' 项 ===');
  v.forEach(item => {
    console.log(`- [${item.impact}] ${item.id}: ${item.help}（${item.nodes.length} 处）`);
    item.nodes.slice(0, 3).forEach(n => console.log('    target:', JSON.stringify(n.target), '|', (n.html || '').slice(0, 110)));
  });
  ok(v.length === 0, 'axe-core 结构违规数应为 0（实际 ' + v.length + '）');

  /* 2) 调色板对比度（WCAG AA：正文 4.5 / 大字号或粗体按钮 3.0） */
  console.log('\n=== 调色板对比度校验 ===');
  const light = {
    bg: '#f4f6fb', surface: '#ffffff', surface2: '#eef2f9',
    text: '#1a1d29', textSoft: '#5b6678', textFaint: '#667085',
    brand: '#4f5fe6', brand2: '#7c3aed', white: '#ffffff'
  };
  const dark = {
    bg: '#0d0f16', surface: '#161a23', surface2: '#1d2230',
    text: '#e6e8ef', textSoft: '#aab3c5', textFaint: '#8b95a8',
    brand: '#5566e6', brand2: '#8b3aed', white: '#ffffff'
  };
  const checks = [
    ['light 正文 on bg', contrast(light.text, light.bg), 4.5],
    ['light 次级 on bg', contrast(light.textSoft, light.bg), 4.5],
    ['light 浅灰 on surface', contrast(light.textFaint, light.surface), 4.5],
    ['light 按钮白字 on brand', contrast(light.white, light.brand), 4.5],
    ['light 按钮白字 on brand2', contrast(light.white, light.brand2), 4.5],
    ['dark 正文 on bg', contrast(dark.text, dark.bg), 4.5],
    ['dark 次级 on bg', contrast(dark.textSoft, dark.bg), 4.5],
    ['dark 浅灰 on surface', contrast(dark.textFaint, dark.surface), 4.5],
    ['dark 按钮白字 on brand', contrast(dark.white, dark.brand), 4.5],
    ['dark 按钮白字 on brand2', contrast(dark.white, dark.brand2), 4.5],
    ['light 链接色 on white', contrast(light.brand, light.surface), 4.5],
    ['dark 链接色 on bg', contrast('#7c8bff', dark.bg), 4.5]
  ];
  checks.forEach(([name, ratio, need]) => {
    const good = ratio >= need;
    console.log(`  ${good ? '✓' : '✗'} ${name}: ${ratio.toFixed(2)} (需≥${need})`);
    ok(good, `对比度 ${name} 应≥${need}（实际 ${ratio.toFixed(2)}）`);
  });

  console.log(`\nPASS=${pass} FAIL=${fail}`);
  if (fail) { console.log('--- 失败项 ---'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
  console.log('ALL_GREEN · 无障碍回归通过（axe 结构 + 调色板对比度）');
})();
