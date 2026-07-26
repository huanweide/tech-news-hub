/* 模型优惠圈 · 后端采集/发布脚本（R18）
 * 用途：把新的优惠信息"发布"到站点（幂等追加到 deals-data.js）。
 *   - 读取现有 deals-data.js（用 fake-window 求值，避免污染全局）
 *   - 从候选源（环境变量 DEALS_SOURCES_FILE 指定的 JSON 数组，或默认 deals-sources.json）收集候选
 *   - 按 id 幂等合并：已存在则跳过，不存在则追加
 *   - 可选 AI 摘要：若设置 DEEPSEEK_API_KEY，可对候选的 detail 做润色（失败则保留原样）
 *   - DRY_RUN=1：只打印将新增的条目，不写文件
 * 运行：node scripts/deals_update.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "deals-data.js");
const DRY_RUN = process.env.DRY_RUN === "1";
const SOURCES_FILE = process.env.DEALS_SOURCES_FILE || path.join(ROOT, "deals-sources.json");

function todayISO() { return new Date().toISOString().slice(0, 10); }

function loadDeals() {
  if (!fs.existsSync(DATA_FILE)) return { meta: { updatedAt: todayISO(), note: "" }, deals: [] };
  const src = fs.readFileSync(DATA_FILE, "utf8");
  const result = new Function("window", src + "\nreturn window.DEALS_DATA;")({});
  return result && result.deals ? result : { meta: { updatedAt: todayISO(), note: "" }, deals: [] };
}

function serialize(meta, deals) {
  const obj = { meta: meta, deals: deals };
  return (
    "/* 模型优惠圈 · 数据层（R18，由 scripts/deals_update.cjs 自动生成/合并） */\n" +
    "window.DEALS_DATA = " + JSON.stringify(obj, null, 2) + ";\n\n" +
    "if (typeof module !== \"undefined\" && module.exports) module.exports = window.DEALS_DATA;\n"
  );
}

function collectCandidates() {
  if (!fs.existsSync(SOURCES_FILE)) return [];
  try {
    const arr = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("[deals_update] 候选源解析失败:", e.message);
    return [];
  }
}

async function aiEnrich(d) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || !d.detail) return d;
  try {
    const r = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "把以下优惠信息整理为简洁的薅羊毛指南（2-4 步，保留关键链接与价格）：\n" + d.detail }],
        max_tokens: 400
      })
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const txt = await r.text();
    if (!txt) throw new Error("empty response");
    const j = JSON.parse(txt);
    const out = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    if (out && out.trim()) d.detail = out.trim();
  } catch (e) {
    console.warn("[deals_update] AI 摘要失败，保留原样:", e.message);
  }
  return d;
}

function ruleEnrich(d) {
  // 无 AI 时的规则兜底：保持原样（detail 已由来源提供）
  return d;
}

async function main() {
  const cur = loadDeals();
  const existingIds = new Set(cur.deals.map(function (d) { return d.id; }));
  const candidates = collectCandidates();
  const toAdd = [];
  for (const c of candidates) {
    if (!c || !c.id) continue;
    if (existingIds.has(c.id)) continue;
    const enriched = process.env.DEEPSEEK_API_KEY ? await aiEnrich(c) : ruleEnrich(c);
    if (!enriched.addedAt) enriched.addedAt = todayISO();
    toAdd.push(enriched);
  }

  if (DRY_RUN) {
    console.log("[deals_update] DRY_RUN：将新增 " + toAdd.length + " 条优惠（不写文件）");
    toAdd.forEach(function (d) { console.log("  + [" + d.type + "/" + d.platformType + "] " + d.title); });
    console.log("[deals_update] 当前有效优惠数:", cur.deals.filter(function (d) { return !d.validUntil || new Date(d.validUntil + "T00:00:00") >= new Date(todayISO() + "T00:00:00"); }).length);
    return;
  }

  if (!toAdd.length) {
    console.log("[deals_update] 无新增优惠（候选 " + candidates.length + " 条，均已存在或为空），跳过写入");
    return;
  }
  cur.deals = cur.deals.concat(toAdd);
  cur.meta = cur.meta || {};
  cur.meta.updatedAt = todayISO();
  fs.writeFileSync(DATA_FILE, serialize(cur.meta, cur.deals), "utf8");
  console.log("[deals_update] 已追加 " + toAdd.length + " 条优惠，总计 " + cur.deals.length + " 条，写入 " + DATA_FILE);
}

if (require.main === module) {
  main().catch(function (e) { console.error("[deals_update] 失败:", e); process.exit(1); });
}

module.exports = { loadDeals: loadDeals, serialize: serialize, collectCandidates: collectCandidates, main: main };
