/* R13 真机验证：按钮契约（不回归）+ 架构图渲染 + 数据层断言 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const DIR = __dirname;
const html = fs.readFileSync(path.join(DIR, "index.html"), "utf8")
  .replace(/<script[\s\S]*?<\/script>/g, ""); // 去掉外链脚本，改为手动 eval，便于注入桩

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/" });
const win = dom.window;
const doc = win.document;

// 桩：图表/分享/下载在测试环境不存在，确保点击不抛错
win.Chart = undefined;
win.html2canvas = undefined;
win.scrollTo = function () {};
if (!win.URL.createObjectURL) win.URL.createObjectURL = function () { return "blob:test"; };
if (!win.URL.revokeObjectURL) win.URL.revokeObjectURL = function () {};

// 注入数据层与逻辑层
["news-data.js", "features.js", "app.js"].forEach(function (f) {
  win.eval(fs.readFileSync(path.join(DIR, f), "utf8"));
});

let pass = 0, fail = 0;
const fails = [];
function ok(cond, name) { if (cond) { pass++; } else { fail++; fails.push(name); } }

const NEWS = win.NEWS_DATA;
function $(s) { return doc.querySelector(s); }
function $all(s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
function click(el) {
  if (!el) throw new Error("click null");
  el.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true }));
}
function feedCount() { return $all("#feed .card").length; }

try {
  /* ---- 数据层断言：全部含架构图 ---- */
  const validWeeks = new Set(NEWS.weeks.map(w => w.id));
  ok(NEWS.items.length >= 30 && NEWS.items.every(i => validWeeks.has(i.week)), "数据层加载完整：条数应≥30 且每条归属有效周（实际 " + NEWS.items.length + "）");
  const withArch = NEWS.items.filter(function (it) { return typeof it.architecture === "string" && it.architecture.indexOf("<svg") >= 0; });
  ok(withArch.length === NEWS.items.length, "全部 " + NEWS.items.length + " 条含 architecture SVG（实际 " + withArch.length + "）");
  const withCap = NEWS.items.filter(function (it) { return !!it.archCaption; });
  ok(withCap.length === NEWS.items.length, "全部 " + NEWS.items.length + " 条含 archCaption（实际 " + withCap.length + "）");
  // 字段契约不变
  const need = ["what", "compare", "why", "output", "explain", "impact", "action"];
  ok(NEWS.items.every(function (it) { return need.every(function (k) { return typeof it[k] === "string" && it[k].length > 0; }); }), "8 维度字段契约齐全");
  // 主题色自检：SVG 使用 var(--…) 以适配明暗
  ok(withArch.every(function (it) { return it.architecture.indexOf("var(--") >= 0; }), "架构图使用主题色 var(--…)");

  /* ---- 初始渲染 ---- */
  ok($("#hero") && $("#hero").style.display !== "none", "Hero 头条已渲染");
  ok($all("#feed .card").length > 0, "主网格有卡片");
  const latestW = NEWS.weeks[NEWS.weeks.length - 1].id;
  const aiLatest = NEWS.items.filter(function (i) { return i.category === "ai" && i.week === latestW; }).length;
  ok(feedCount() === aiLatest - 1, "AI 默认视图(最新周)卡片数 = AI∩最新周-1（头条外）");

  /* ---- 栏目眉标已软化（不再有 .dim h4，改为 .dim-kicker） ---- */
  // 展开首张卡，确认 dim-kicker 存在且无 h4
  const firstToggle = $("#feed .card .toggle");
  click(firstToggle);
  ok($(".dim-kicker") !== null, "详情区使用 .dim-kicker 眉标");
  ok($(".dim h4") === null, "详情区已无死板 <h4> 小标题");

  /* ---- 架构图渲染：展开含 architecture 的条目后出现 svg.arch-fig ---- */
  const archSvg = $(".arch-fig svg");
  ok(archSvg !== null, "展开后出现架构图 svg.arch-fig");
  ok(archSvg && archSvg.getAttribute("viewBox") && archSvg.getAttribute("viewBox").indexOf("0 0") === 0, "架构图含有效 viewBox");
  ok($(".arch-fig .arch-cap") !== null, "架构图含 figcaption 说明");

  /* ---- 分类切换 tech ---- */
  const techTab = $all("#catTabs .cat-tab").filter(function (b) { return b.textContent.indexOf("科技圈") >= 0; })[0];
  click(techTab);
  const techLatest = NEWS.items.filter(function (i) { return i.category === "tech" && i.week === latestW; }).length;
  ok(feedCount() === techLatest - 1, "切到科技圈(最新周)后卡片数正确");

  /* ---- 周次归档：w3 ---- */
  const w3btn = $all("#weekRail .week-btn").filter(function (b) { return b.textContent.indexOf("第3周") >= 0; })[0];
  click(w3btn);
  const techW3 = NEWS.items.filter(function (i) { return i.week === "w3" && i.category === "tech"; }).length;
  ok(feedCount() === techW3 - 1, "切到 w3+科技圈后卡片数 = tech∩w3-1");

  /* ---- 回到全部周次 + 本周（最新） ---- */
  click($all("#weekRail .week-btn")[0]); // 全部周次

  /* ---- 搜索实时计数（当前为 科技圈 + 全部周次） ---- */
  const si = $("#searchInput");
  function hayOf(i) { return [i.title, i.summary, i.what, i.compare, i.why, i.output, i.explain, i.impact, i.action, (i.tags || []).join(" ")].join(" "); }
  si.value = "量子";
  si.dispatchEvent(new win.Event("input", { bubbles: true }));
  ok($("#searchCount") && !$("#searchCount").hidden, "搜索实时计数显示");
  const expectHit = NEWS.items.filter(function (i) { return i.category === "tech" && hayOf(i).indexOf("量子") >= 0; }).length;
  const actualHit = parseInt($("#searchCount b").textContent, 10);
  console.log("DEBUG search: cat=tech week=all expect=" + expectHit + " actual=" + actualHit);
  ok(actualHit === expectHit, "搜索计数与命中数一致（科技圈范围）");
  // 清空搜索
  si.value = "";
  si.dispatchEvent(new win.Event("input", { bubbles: true }));

  /* ---- 标签 AND：用 #tagBar 第一个标签 ---- */
  const chip = $("#tagBar .tag-chip");
  const tname = chip.getAttribute("data-tag");
  click(chip);
  const fresh = $('.tag-chip[data-tag="' + tname + '"]');
  ok(fresh && fresh.classList.contains("on"), "标签进入选中态");
  click(fresh); // 取消

  /* ---- 行动清单：加入 / 勾选 / 移除 ---- */
  win.localStorage.removeItem("techpulse-actions");
  const addBtn = $("#feed .card .add-action");
  click(addBtn);
  ok($all("#actionList .action-item").length === 1, "加入行动清单后出现 1 条");
  const cb = $("#actionList .action-cb");
  if (cb) { cb.checked = true; cb.dispatchEvent(new win.Event("change", { bubbles: true })); }
  ok($("#actionList .action-item.done") !== null, "勾选后标记完成");
  const rm = $("#actionList .action-rm");
  if (rm) click(rm);
  ok($all("#actionList .action-item").length === 0, "移除后清单清空");

  /* ---- 暗色切换 ---- */
  const tt = $("#themeToggle");
  const before = doc.documentElement.getAttribute("data-theme");
  click(tt);
  ok(doc.documentElement.getAttribute("data-theme") !== before, "暗色主题切换生效");
  click(tt); // 切回

  /* ---- 相关阅读跳转 ---- */
  const rel = $(".related-item");
  if (rel) {
    const id = rel.getAttribute("data-go");
    click(rel);
    ok(win.NEWS_DATA.items.some(function (i) { return i.id === id; }), "相关阅读跳转目标有效");
  } else { ok(true, "（当前视图无相关阅读，跳过）"); }

  /* ---- 排序：按影响力 ---- */
  const impactBtn = $all(".sort-btn").filter(function (b) { return b.getAttribute("data-sort") === "impact"; })[0];
  click(impactBtn);
  const titles1 = $all("#feed .card h3").map(function (h) { return h.textContent; });
  const scores1 = titles1.map(function (t) {
    const it = NEWS.items.filter(function (i) { return i.category === "ai"; }).filter(function (i) { return i.title === t; })[0];
    return it ? it.impactScore : 0;
  });
  let sorted = true;
  for (let i = 1; i < scores1.length; i++) if (scores1[i] > scores1[i - 1]) sorted = false;
  ok(sorted, "按影响力排序后降序");
  const defaultBtn = $all(".sort-btn").filter(function (b) { return b.getAttribute("data-sort") === "default"; })[0];
  click(defaultBtn);

  /* ---- 首屏引导关闭 ---- */
  const guideClose = $(".guide-close");
  if (guideClose) { click(guideClose); ok($(".guide") === null, "引导可关闭"); }
  else ok(true, "（无引导，跳过）");

  /* ---- 空状态：随机看 + 清除 ---- */
  si.value = "不存在的关键词zzz";
  si.dispatchEvent(new win.Event("input", { bubbles: true }));
  ok($(".empty") !== null, "无结果时显示空状态");
  const rr = $(".random-read");
  if (rr) { let t2 = false; try { click(rr); } catch (e) { t2 = true; fails.push("random 抛错:" + e.message); } ok(!t2, "随机看一条不抛错"); }
  const cf = $(".clear-filters");
  if (cf) click(cf);
  si.value = ""; si.dispatchEvent(new win.Event("input", { bubbles: true }));

  /* ---- 订阅（本地） ---- */
  const nl = $("#nlEmail"); const nlForm = $("#nlForm");
  nl.value = "test@example.com";
  let subThrew = false;
  try { nlForm.dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true })); } catch (e) { subThrew = true; fails.push("subscribe 抛错:" + e.message); }
  ok(!subThrew, "订阅提交不抛错");

  /* ---- 导出周报（构造 Blob 桩） ---- */
  let expThrew = false;
  try { click($("#exportBtn")); } catch (e) { expThrew = true; fails.push("export 抛错:" + e.message); }
  ok(!expThrew, "导出周报不抛错");

  /* ---- 回到顶部 ---- */
  let topThrew = false;
  try { click($("#toTop")); } catch (e) { topThrew = true; fails.push("toTop 抛错:" + e.message); }
  ok(!topThrew, "回到顶部不抛错");

} catch (e) {
  fail++; fails.push("FATAL: " + e.message + "\n" + e.stack);
}

console.log("R13 验证结果: 通过 " + pass + " / 失败 " + fail);
if (fail) { console.log("失败项:\n - " + fails.join("\n - ")); process.exit(1); }
else { console.log("ALL_GREEN"); }
