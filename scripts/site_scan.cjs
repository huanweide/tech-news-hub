'use strict';
/*
 * 站点静态体检：专门抓「不报错但静默失效」的那类问题。
 *
 * 这类问题的共同点是：控制台不一定有错、测试也可能全绿，但用户点下去没反应、
 * 样式没生效、或者换个环境就废。本项目是纯静态站（无构建、无框架），
 * 没有打包器帮我们兜底，所以这些检查要自己写。
 *
 * 检查项：
 *   1. 引用了但磁盘上不存在的资源          -> 404
 *   2. HTML 内联事件绑定了未定义的函数      -> 死按钮
 *   3. 多个脚本定义同名全局                -> 后加载者静默覆盖，一份成死代码
 *   4. 外部 CDN 依赖                       -> 提醒（可用性 / 隐私 / 离线）
 *
 * 关于第 4 项的一个教训（别照搬教条）
 * ----------------------------------
 * 通用最佳实践是「外链脚本要加 SRI」。**但 jsdelivr 明确说不要给它加 SRI**：
 * CDN 会对文件做动态处理（压缩/转换），生成的内容可能变化，加了 integrity
 * 之后浏览器会直接拒绝加载 —— 好好的功能被自己搞挂。
 * 本仓库的 Chart.js 原先就是 jsdelivr 外链，正确解法不是补 SRI，
 * 而是**把它本地化**（vendor/），顺带解决了中国大陆访问 jsdelivr 不稳的问题。
 * 所以这里对外部依赖只是提醒「可考虑本地化」，不自动判失败。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));

const html = read('index.html');
const problems = [];
const notes = [];

// ------------------------------------------------------------ 1. 资源是否落盘
const refs = [];
html.replace(/<link[^>]+href="([^"]+)"/g, (m, p) => refs.push(['link', p]));
html.replace(/<script[^>]+src="([^"]+)"/g, (m, p) => refs.push(['script', p]));

const external = refs.filter(([, p]) => /^https?:\/\//.test(p));
const local = refs.filter(([, p]) => !/^https?:/.test(p) && !p.startsWith('#') && !p.startsWith('data:'));

for (const [kind, p] of local) {
  if (!exists(p)) problems.push(`引用了不存在的资源: <${kind}> ${p}`);
}
notes.push(`本地资源 ${local.length} 个，全部落盘存在`);

// ------------------------------------------------------------ 2. 外部依赖提醒
for (const [, p] of external) {
  notes.push(`外部依赖（可用性/离线受影响，可考虑本地化）: ${p}`);
}

// ------------------------------------------------------------ 3. 内联事件 vs 定义
const handlers = new Set();
html.replace(/on(click|change|input|submit|keydown|keyup|focus|blur)\s*=\s*"([^"]*)"/g,
  (m, ev, code) => {
    for (const f of code.match(/([A-Za-z_$][\w$]*)\s*\(/g) || []) {
      handlers.add(f.replace(/\s*\(?$/, ''));
    }
    return m;
  });

const localScripts = ['news-data.js', 'features.js', 'deals-data.js', 'app.js'].filter(exists);
const definitions = new Map();
for (const f of localScripts) {
  const src = read(f);
  const found = new Set();
  for (const m of src.matchAll(/^\s*function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) found.add(m[1]);
  for (const m of src.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)) found.add(m[1]);
  for (const m of src.matchAll(
    /^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function|\()/gm)) {
    found.add(m[1]);
  }
  for (const n of found) {
    if (!definitions.has(n)) definitions.set(n, []);
    definitions.get(n).push(f);
  }
}

for (const h of handlers) {
  if (['this', 'event', 'if', 'return', 'alert', 'console'].includes(h)) continue;
  if (h.includes('.')) continue;
  if (!definitions.has(h)) {
    problems.push(`HTML 内联处理器调用了未定义的函数: ${h}()`);
  }
}

// ------------------------------------------------------------ 4. 同名全局冲突
for (const [name, files] of definitions) {
  const uniq = [...new Set(files)];
  if (uniq.length > 1) {
    problems.push(`同名全局定义冲突: ${name} 在 ${uniq.join(' / ')} 都有定义（后加载者会静默覆盖）`);
  }
}

// ------------------------------------------------------------ 5. 加载顺序：数据要先于逻辑
const order = local.map(([, p]) => p);
const iData = order.indexOf('news-data.js');
const iApp = order.indexOf('app.js');
if (iData >= 0 && iApp >= 0 && iData > iApp) {
  problems.push('加载顺序错误：news-data.js 必须在 app.js 之前');
}

// ------------------------------------------------------------ 输出
console.log('\n=== 站点静态体检 ===');
console.log('加载顺序:', order.join(' -> '));
notes.forEach((n) => console.log('  note  ' + n));
if (problems.length === 0) {
  console.log('  OK    未发现静默失效问题');
} else {
  problems.forEach((p) => console.log('  ISSUE ' + p));
}
console.log(`\n体检：${problems.length} 个问题`);
if (problems.length) process.exit(1);
console.log('ALL_GREEN ✓');
