/* 模型优惠圈 · 后端同步脚本（真实化 + 自动化）
 * 单一事实来源：deals-sources.json（人工策划的真实、可核验优惠清单）
 * 产出：deals-data.js（前端读取的 window.DEALS_DATA），由本脚本依据 sources 生成
 * 行为：
 *   1. 读取 deals-sources.json（若缺失则报错退出）
 *   2. 可选 AI 润色（设置 DEEPSEEK_API_KEY 时，对每条 detail 做「薅羊毛指南」精简，失败保留原样）
 *   3. 以 sources 为权威，重新生成 deals-data.js；与现有内容一致则跳过写入（幂等，CI 无差异不提交）
 *   4. DRY_RUN=1：只打印将生成的条目数，不写文件
 * 运行：node scripts/deals_update.cjs
 */
const fs = require("fs");
const path = require("path");
const { fetchWithAOA, getBreaker, getBudget } = require("./aoa.cjs");

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "deals-data.js");
const SOURCES_FILE = process.env.DEALS_SOURCES_FILE || path.join(ROOT, "deals-sources.json");
const DRY_RUN = process.env.DRY_RUN === "1";

function todayISO() { return new Date().toISOString().slice(0, 10); }

function loadSources() {
  if (!fs.existsSync(SOURCES_FILE)) {
    console.error("[deals_update] 找不到来源清单:", SOURCES_FILE);
    process.exit(1);
  }
  try {
    const arr = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
    if (!Array.isArray(arr)) throw new Error("来源清单不是数组");
    return arr;
  } catch (e) {
    console.error("[deals_update] 来源清单解析失败:", e.message);
    process.exit(1);
  }
}

function loadExistingDeals() {
  if (!fs.existsSync(DATA_FILE)) return null;
  try {
    const src = fs.readFileSync(DATA_FILE, "utf8");
    const result = new Function("window", src + "\nreturn window.DEALS_DATA;")({});
    return result && result.deals ? result.deals : null;
  } catch (e) {
    console.warn("[deals_update] 读取现有 deals-data.js 失败，将重新生成:", e.message);
    return null;
  }
}

function serialize(meta, deals) {
  const obj = { meta: meta, deals: deals };
  return (
    "/* 模型优惠圈 · 数据层（由 scripts/deals_update.cjs 依据 deals-sources.json 自动生成） */\n" +
    "window.DEALS_DATA = " + JSON.stringify(obj, null, 2) + ";\n\n" +
    "if (typeof module !== \"undefined\" && module.exports) module.exports = window.DEALS_DATA;\n"
  );
}

async function aiEnrich(d) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || !d.detail) return d;
  try {
    const r = await fetchWithAOA("llm-deals", "https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: "把以下优惠信息的 detail 整理为更简洁的薅羊毛指南（保留关键链接、价格与步骤，2-5 点）：\n" + d.detail }],
        max_tokens: 500
      })
    }, { timeout: 30000, breaker: getBreaker("llm-deals", 5, 60000), budget: getBudget("llm-deals", 200000), chargeUsage: true, maxTokens: 600 });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const txt = await r.text();
    if (!txt) throw new Error("empty response");
    const j = JSON.parse(txt);
    const out = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    if (out && out.trim()) d.detail = out.trim();
  } catch (e) {
    console.warn("[deals_update] AI 润色失败，保留原样:", e.message);
  }
  return d;
}

async function main() {
  const sources = loadSources();
  const deals = [];
  for (const s of sources) {
    if (!s || !s.id) { console.warn("[deals_update] 跳过无效来源条目"); continue; }
    const d = Object.assign({}, s);
    if (process.env.DEEPSEEK_API_KEY) await aiEnrich(d);
    deals.push(d);
  }

  if (DRY_RUN) {
    console.log("[deals_update] DRY_RUN：将生成 " + deals.length + " 条优惠（不写文件）");
    const active = deals.filter(function (x) { return !x.validUntil || new Date(x.validUntil + "T00:00:00") >= new Date(todayISO() + "T00:00:00"); }).length;
    console.log("[deals_update] 当前有效优惠数:", active);
    return;
  }

  const existing = loadExistingDeals();
  const same = existing && JSON.stringify(existing) === JSON.stringify(deals);
  if (same) {
    console.log("[deals_update] 与现有内容一致，跳过写入（无变化）");
    return;
  }

  const meta = {
    updatedAt: todayISO(),
    note: "模型优惠圈：中转站与大模型平台真实优惠资讯，依据 deals-sources.json 自动同步，超时自动下架。"
  };
  fs.writeFileSync(DATA_FILE, serialize(meta, deals), "utf8");
  console.log("[deals_update] 已依据 " + sources.length + " 条来源生成 deals-data.js，共 " + deals.length + " 条优惠");
}

if (require.main === module) {
  main().catch(function (e) { console.error("[deals_update] 失败:", e); process.exit(1); });
}

module.exports = { loadSources: loadSources, serialize: serialize, main: main };
