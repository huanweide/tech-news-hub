# 科技前瞻 · TechPulse

> 一个**非盈利、公益科普**的每周科技资讯站：把「新闻」升级为「可溯源、可检索、可深读、可对话」的知识地图，并附**真实可核验的大模型 / 中转站优惠圈**。纯静态、0 元托管于 GitHub Pages，无需后端。

## 项目定位
多数科技资讯站只给你「信息流」。TechPulse 额外给你「信息背后的知识地图」：

- **新闻性**：每周自动补充真实 AI 与科技新闻，每条附原始来源链接、可交叉验证。
- **学习性**：每篇 8 维度权威解析 + 内联架构图（明暗主题自适应），并配套「名词 / 架构 / 新闻」三栏可检索知识库。
- **可对话**：本地密钥（BYOK）LLM 学习助手，基于本站「有来源·可溯源」知识库做检索增强（RAG）。
- **真实优惠**：模型优惠圈集中发布中转站与大模型官方的**真实、可核验**优惠，帮读者选对模型、薅到真羊毛。

## 核心特性
- **权威深读**：8 维度拆解（事件实质 / 横向研判 / 驱动逻辑 / 落地产出 / 技术解析与架构 / 行业影响 / 读者行动建议）；概念配内联 SVG 架构图，用 `var(--brand)` 等主题色实现明暗自适应。
- **可检索知识库** 📚：聚合 **91 条专业术语**（MoE、RAG、对齐、量子比特、脑机接口…）与 **18 张架构图**；点术语看释义 + 架构含义 + 关联新闻，名词 ↔ 架构双向跳转。
- **本地密钥 LLM 助手** 🤖：右侧抽屉，Bring-Your-Own-Key（密钥仅存浏览器 localStorage，不上传服务器）；6 个索引工具 `search_news / lookup_term / lookup_architecture / open_article / save_note / lookup_deal`，可对话、可直达正文。
- **模型优惠圈** 🎯：中转站（OpenRouter 等）与官方（硅基流动、火山引擎、DeepSeek、阿里百炼、智谱 GLM、腾讯混元等）**真实优惠**，按类型（当前 / 新上线 / 降价 / 性价比）× 平台（中转 / 官方）筛选、关键词检索、到期自动下架；每条带官方来源。
- **每周自动更新（双保险）**：每周一 09:00 由 AI 模型抓取当周真实新闻 + 核实优惠圈并推送；每周日 22:00 UTC GitHub Actions RSS 兜底。每次推送前跑 **139 项断言**（含 axe-core 无障碍回归）作质量门。
- **无障碍**：通过 axe-core 结构规则与 WCAG AA 对比度（≥4.5）校验，并固化为 `npm test` 永久回归门。
- **0 元静态站**：纯前端（HTML / CSS / 原生 JS，无框架、无构建），GitHub Pages 自动部署。

## 在线访问
**https://huanweide.github.io/tech-news-hub/**

## 本地运行
```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务器（推荐，避免个别浏览器 file:// 限制）
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```
> LLM 助手需浏览器能直连你配置的接口地址（如 DeepSeek / OpenAI 兼容服务）。

## 每周自动更新机制
| 环节 | 主更新（WorkBuddy 自动化） | 兜底（GitHub Actions） |
|------|------|------|
| 触发 | 每周一 09:00（AI 模型高质量更新） | 每周日 22:00 UTC（RSS 兜底） |
| 新闻 | WebSearch 抓当周真实新闻 → 追加 `news-data.js` | `scripts/weekly_update.cjs` RSS 抓取 + 可选 AI 摘要 |
| 优惠圈 | WebSearch 核实 `deals-sources.json` 真实性 + 查新优惠回写 → `deals_update.cjs` 重生成 | `deals_update.cjs` 同步（可选 `DEEPSEEK_API_KEY` 润色） |
| 质量门 | `npm test` 139 项全绿 | `npm test` 全绿 |
| 上线 | `git push` → Pages 自动重新部署 | 同左 |

- 测试脚本：`r13_test.cjs`～`r16_test.cjs`（新闻 / 资料库 / 助手）、`deals_test.cjs`（优惠圈）、`a11y_test.cjs`（无障碍）。

## 数据从哪来（真实性说明）
- **新闻**：来自公开科技媒体与 RSS（机器之心、量子位、36氪、少数派、Hacker News、arXiv 等），均附原始来源链接，可交叉验证。
- **优惠圈**：唯一事实来源 `deals-sources.json`（人工策划、每条附官方来源链接）；`scripts/deals_update.cjs` 每周依据它**重新生成** `deals-data.js`（与现有一致则跳过，幂等）。要新增 / 更新真实优惠，编辑 `deals-sources.json` 并推送；或在仓库 Secrets 配置 `DEEPSEEK_API_KEY` 让 Actions 每周用官方页面润色文案。

## 隐私与 BYOK
LLM 助手为 Bring-Your-Own-Key：**API 密钥仅存于你的浏览器 localStorage**，请求由浏览器直连你配置的接口，本站静态托管不持有、不传输你的密钥。对话 / 笔记记忆存于本地，可与密钥分离清除。

## 技术栈
纯静态前端：HTML + CSS + 原生 JavaScript（无框架、无构建步骤）。数据层 `news-data.js`（挂 `window.NEWS_DATA`）、`deals-data.js`（挂 `window.DEALS_DATA`）；回归测试用 jsdom 真机派发。

## 目录结构
```
index.html                页面结构
style.css                 样式（明暗主题 / 架构图 / 资料库 / 助手抽屉 / 优惠圈）
app.js                    前端逻辑（渲染 / 搜索 / 资料库 / 术语词典 / LLM 助手 / 优惠圈）
news-data.js              新闻数据层（weeks / categories / items + architecture）
deals-data.js             优惠圈数据层（由 deals_update.cjs 自动生成，勿手改）
deals-sources.json        优惠圈唯一事实来源（人工策划的真实优惠）
features.js               辅助功能（推荐 / 热度）
r13_test.cjs…r16_test.cjs  新闻 / 资料库 / 助手验证脚本（jsdom）
deals_test.cjs            优惠圈验证脚本（jsdom）
a11y_test.cjs             无障碍回归测试（axe-core + 对比度）
scripts/weekly_update.cjs  新闻自动抓取脚本（GitHub Actions 调用）
scripts/deals_update.cjs   优惠圈同步脚本（依据 sources 幂等重生成，GitHub Actions 调用）
.github/workflows/         自动更新流水线
```

## 许可证
非盈利公益科普，内容仅供学习参考；转载请保留来源。
