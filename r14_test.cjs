/* R14 验证：专业术语词典弹层（渲染 + 点击弹层 + 外部关闭 + 键盘聚焦） */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const DIR = __dirname;
const html = fs.readFileSync(path.join(DIR, "index.html"), "utf8")
  .replace(/<script[\s\S]*?<\/script>/g, "");

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/" });
const win = dom.window;
const doc = win.document;

win.Chart = undefined;
win.html2canvas = undefined;
win.scrollTo = function () {};
if (!win.URL.createObjectURL) win.URL.createObjectURL = function () { return "blob:test"; };
if (!win.URL.revokeObjectURL) win.URL.revokeObjectURL = function () {};

["news-data.js", "features.js", "app.js"].forEach(function (f) {
  win.eval(fs.readFileSync(path.join(DIR, f), "utf8"));
});

let pass = 0, fail = 0;
const fails = [];
function ok(cond, name) { if (cond) pass++; else { fail++; fails.push(name); } }
function $(s) { return doc.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
function click(el) { if (!el) throw new Error("click null"); el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true })); }

try {
  /* 默认视图（AI 最新周）应有术语被高亮包裹 */
  const termsInView = $all(".term");
  ok(termsInView.length > 0, "默认视图出现术语高亮 .term（数量 " + termsInView.length + "）");

  /* 展开首张卡片，详情正文应含术语 */
  const firstToggle = $("#feed .card .toggle");
  click(firstToggle);
  const detailTerms = $all("#feed .card .dims .dim p .term");
  ok(detailTerms.length > 0, "展开卡片后详情正文含术语 .term（数量 " + detailTerms.length + "）");

  /* 点击术语 → 弹层出现且内容非空 */
  const t0 = detailTerms[0];
  const termText = t0.getAttribute("data-term");
  click(t0);
  const pop = $("#glossPop");
  ok(pop !== null, "点击术语后弹出层 #glossPop 存在");
  ok(pop && !pop.hidden, "弹层处于可见状态");
  ok(pop && pop.querySelector(".gp-term") && pop.querySelector(".gp-term").textContent === termText, "弹层标题等于被点击术语（“" + termText + "”）");
  ok(pop && pop.querySelector(".gp-def") && pop.querySelector(".gp-def").textContent.length > 4, "弹层释义内容非空");

  /* 点击外部区域 → 弹层关闭 */
  const hero = $("#hero");
  click(hero);
  ok(pop.hidden === true, "点击外部后弹层关闭");

  /* 键盘聚焦术语 → 弹层再次出现（focusin 委托） */
  const t1 = detailTerms[1] || t0;
  t1.dispatchEvent(new win.Event("focusin", { bubbles: true }));
  ok(pop && !pop.hidden, "键盘聚焦术语后弹层出现（无障碍可达）");

  /* Esc 关闭 */
  doc.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  ok(pop.hidden === true, "Esc 关闭弹层");

  /* 不应破坏既有结构：眉标与架构图仍在 */
  ok($(".dim-kicker") !== null, "眉标 .dim-kicker 仍在（结构未被破坏）");
  ok($(".arch-fig svg") !== null, "架构图 svg.arch-fig 仍渲染");

  /* 搜索高亮 + 术语包裹可共存：搜“智能体”后，命中文本里仍可能含 .term 且不抛错 */
  const si = $("#searchInput");
  let searchThrew = false;
  try {
    si.value = "智能体";
    si.dispatchEvent(new win.Event("input", { bubbles: true }));
    ok($("#searchCount") && !$("#searchCount").hidden, "搜索“智能体”实时计数显示（术语与高亮共存）");
  } catch (e) { searchThrew = true; fails.push("搜索+术语抛错:" + e.message); }
  ok(!searchThrew, "搜索高亮与术语包裹共存不抛错");
  si.value = ""; si.dispatchEvent(new win.Event("input", { bubbles: true }));

} catch (e) {
  fail++; fails.push("FATAL: " + e.message + "\n" + e.stack);
}

console.log("R14 验证结果: 通过 " + pass + " / 失败 " + fail);
if (fail) { console.log("失败项:\n - " + fails.join("\n - ")); process.exit(1); }
else { console.log("ALL_GREEN"); }
