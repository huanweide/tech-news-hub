[![Build](https://github.com/huanweide/tech-news-hub/actions/workflows/weekly-update.yml/badge.svg)](https://github.com/huanweide/tech-news-hub/actions/workflows/weekly-update.yml)
[![Stars](https://img.shields.io/github/stars/huanweide/tech-news-hub)](https://github.com/huanweide/tech-news-hub/stargazers)
[![Site](https://img.shields.io/badge/站点-huanweide.github.io%2Ftech--news--hub-blue)](https://huanweide.github.io/tech-news-hub/)
[![Non-profit](https://img.shields.io/badge/性质-非盈利公益科普-9b59b6)](https://huanweide.github.io/tech-news-hub/)

# 科技前瞻 · TechPulse —— 把每周科技新闻，升级成可溯源、可检索、可深读的知识地图

一个**非盈利、公益科普**的每周科技资讯站：不堆砌信息流，而是为每条新闻补上「原始来源、8 维度深度解读、可检索知识库」，并附带一个**本地密钥（BYOK）**的 AI 学习助手，帮你把资讯真正读透。纯静态、零后端，0 元托管于 GitHub Pages。

> 在线访问：**https://huanweide.github.io/tech-news-hub/**

## 项目简介

多数科技资讯站只给你「信息流」。TechPulse 额外提供「信息背后的知识地图」：

- **可溯源**：每条新闻附原始来源链接，关键结论均可交叉验证，打破信息差。
- **可深读**：每篇做 8 维度权威解析（事件实质 / 横向研判 / 驱动逻辑 / 落地产出 / 技术解析与架构 / 行业影响 / 读者行动建议等），概念配内联 SVG 架构图。
- **可检索**：聚合专业术语与架构图形成知识库，名词 ↔ 架构双向跳转，点术语即看释义与关联新闻。
- **可对话**：本地密钥 LLM 学习助手，基于本站「有来源·可溯源」知识库做检索增强（RAG）。

## 核心特性

| 特性 | 说明 |
|------|------|
| 权威深读 | 8 维度拆解每条新闻，概念配内联 SVG 架构图，使用 `var(--brand)` 等主题色实现明暗主题自适应 |
| 可检索知识库 | 聚合专业术语（MoE、RAG、对齐、量子比特、脑机接口…）与架构图；「名词 / 架构 / 新闻」三栏可检索，名词 ↔ 架构双向跳转 |
| 本地密钥 LLM 助手 | 右侧抽屉，Bring-Your-Own-Key（密钥仅存浏览器 localStorage，不上传服务器）；内置检索工具，可对话、可直达正文 |
| 模型优惠圈 | 中转站（OpenRouter 等）与官方（硅基流动、火山引擎、DeepSeek、阿里百炼、智谱 GLM、腾讯混元等）真实优惠，按类型 × 平台筛选、关键词检索、到期自动下架；每条带官方来源 |
| 每周自动更新 | GitHub Actions 每周抓取当周真实新闻 + 核实优惠圈并推送；每次推送前跑质量门（含 axe-core 无障碍回归） |
| 无障碍优先 | 通过 axe-core 结构规则与 WCAG AA 对比度（≥4.5）校验，并固化为 `npm test` 永久回归门 |
| 0 元静态站 | 纯前端（HTML / CSS / 原生 JS，无框架、无构建），GitHub Pages 自动部署 |

## 快速开始

```bash
# 方式一：直接打开（双击 index.html 即可）
# 方式二：本地服务器（推荐，避免个别浏览器 file:// 限制）
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

> LLM 助手需浏览器能直连你配置的接口地址（如 DeepSeek / OpenAI 兼容服务）。

## 配置说明

LLM 学习助手为 **Bring-Your-Own-Key**，所有密钥与记忆仅存于本地浏览器。点开「助手」抽屉 → 配置，可设置：

| 配置项 | 说明 |
|--------|------|
| 服务商预设 | OpenAI / DeepSeek / Kimi（Moonshot）/ 通义千问（DashScope）/ 本地 Ollama / 自定义 |
| 接口地址 | OpenAI 兼容的 `/v1` 基址，如 `https://api.openai.com/v1` |
| 模型名称 | 如 `gpt-4o-mini`、`deepseek-chat` |
| API 密钥 | 仅存浏览器 localStorage，不上传任何服务器 |
| 可交互 / 可确认 / 流式输出 | 是否允许助手调用资料库工具、执行索引前先征求同意、开启流式输出 |

GitHub Actions 自动更新相关的可选环境变量 / Secrets：

| 变量 | 用途 |
|------|------|
| `DEEPSEEK_API_KEY` | 自动更新时用于润色优惠圈文案（可选，不配置也能跑） |

## 工作原理

```
公开媒体 / RSS（机器之心、量子位、36氪、少数派、Hacker News、arXiv…）
        │  抓取 + 核实
        ▼
news-data.js  ── 每周追加真实新闻（附来源 + 8 维度解读）
deals-sources.json ── 人工策划的真实优惠（唯一事实来源）
        │  deals_update.cjs 幂等重生成
        ▼
deals-data.js  ── 优惠圈数据层
        │
        ▼
纯静态站点（HTML/CSS/原生 JS）── 渲染资讯流 / 知识库 / 优惠圈 / 助手
        │  git push
        ▼
GitHub Pages 自动部署  +  npm test 质量门（139 项断言 + axe-core）
```

1. **新闻**：来自公开科技媒体与 RSS，均附原始来源链接，可交叉验证。
2. **优惠圈**：唯一事实来源 `deals-sources.json`（人工策划、每条附官方来源链接）；`scripts/deals_update.cjs` 每周依据它重新生成 `deals-data.js`（与现有一致则跳过，幂等）。要新增 / 更新真实优惠，编辑 `deals-sources.json` 并推送。
3. **质量门**：每次更新前 `npm test` 全绿才上线，含 axe-core 无障碍回归与对比度校验。

## 每周自动更新机制

| 环节 | 主更新（GitHub Actions） | 兜底 |
|------|------|------|
| 触发 | 每周定时（AI 模型高质量更新 + RSS 兜底） | 同左 |
| 新闻 | 抓取当周真实新闻 → 追加 `news-data.js` | `scripts/weekly_update.cjs` RSS 抓取 + 可选 AI 摘要 |
| 优惠圈 | 核实 `deals-sources.json` 真实性 + 查新优惠回写 | `deals_update.cjs` 同步（可选 `DEEPSEEK_API_KEY` 润色） |
| 质量门 | `npm test` 全绿 | `npm test` 全绿 |
| 上线 | `git push` → Pages 自动重新部署 | 同左 |

测试脚本：`r13_test.cjs`～`r16_test.cjs`（新闻 / 资料库 / 助手）、`deals_test.cjs`（优惠圈）、`a11y_test.cjs`（无障碍）。

## 用它做你自己的周刊

这套站的外壳 —— 8 维度模板、内联 SVG 架构图、可检索知识库、BYOK 助手、
axe 无障碍回归 —— 跟「科技」没什么关系。**新闻源、分类词、标签池、架构图文案
全部外置在 `pulse.config.js` 里**，改一个文件就能换成你自己的领域。

```bash
# 方式一：直接改 pulse.config.js（最简单）
vim pulse.config.js

# 方式二：另写一份配置，用环境变量指过去
cp pulse.config.js my-weekly.config.js
PULSE_CONFIG=./my-weekly.config.js DRY_RUN=1 node scripts/weekly_update.cjs
```

`pulse.config.js` 里能改什么：

| 字段 | 作用 |
|------|------|
| `site` | 站点名 / 副标题（会写进生成的数据文件注释） |
| `feeds` | 抓取源列表，`cat` 必须落在 `categories.ids` 里 |
| `categories` | 分类 id、命中关键词时归到哪一类、兜底是哪一类 |
| `categoryKeywords` | 命中即归入主分类的词 |
| `tagPool` / `tagMax` | 标签候选池与最多取几个 |
| `archLabels` | 各分类架构图的默认措辞 |
| `harvest` | 只收最近几天、每周最多几条 |

> **向后兼容**：`pulse.config.js` 的默认值与原先硬编码在脚本里的取值逐项相同，
> 作者原有的每周自动更新任务行为不变。这件事由 `scripts/config_test.cjs`
> 的等价性断言守着 —— 一旦配置和旧行为不再一致，测试立刻变红。
>
> 想适配全新领域（比如「生物医药周报」），把 `categories.ids` 换成你自己的
> 分类即可；前端的分类标签会从数据层的 `categories[]` 自动读取。

## 目录结构

```
index.html                页面结构
style.css                 样式（明暗主题 / 架构图 / 资料库 / 助手抽屉 / 优惠圈）
app.js                    前端逻辑（渲染 / 搜索 / 资料库 / 术语词典 / LLM 助手 / 优惠圈）
news-data.js              新闻数据层（挂 window.NEWS_DATA）
deals-data.js             优惠圈数据层（由 deals_update.cjs 自动生成，勿手改）
deals-sources.json        优惠圈唯一事实来源（人工策划的真实优惠）
features.js               辅助功能（推荐 / 热度）
pulse.config.js           站点配置：抓取源 / 分类词 / 标签池 / 架构图文案
vendor/                   本地化的第三方依赖（Chart.js v4.4.1，MIT）
r13_test.cjs…r16_test.cjs  新闻 / 资料库 / 助手验证脚本（jsdom）
deals_test.cjs            优惠圈验证脚本（jsdom）
a11y_test.cjs             无障碍回归测试（axe-core + 对比度）
scripts/weekly_update.cjs  新闻自动抓取脚本（GitHub Actions 调用）
scripts/deals_update.cjs   优惠圈同步脚本（依据 sources 幂等重生成）
.github/workflows/         自动更新流水线
```

## 隐私与 BYOK

LLM 助手为 Bring-Your-Own-Key：**API 密钥仅存于你的浏览器 localStorage**，请求由浏览器直连你配置的接口，本站静态托管不持有、不传输你的密钥。对话 / 笔记记忆存于本地，可与密钥分离清除。

## 贡献指南

- 新增 / 更新真实优惠：编辑 `deals-sources.json`（附官方来源链接）后推送，Actions 会自动重新生成数据层。
- 修正新闻解读或知识库：直接在对应数据文件中提交 PR。
- 提交前请运行 `npm test`，确保全部测试用例与无障碍校验通过（用例数会随版本增长，以实际输出为准）。

## 作者

由 **ReTr · 樊斯瑞** 维护 · [GitHub 主页](https://github.com/huanweide)

## 赞助支持

如果这个项目帮到了你，欢迎 [点 Star](https://github.com/huanweide/tech-news-hub) 支持；也可微信扫码自愿赞助（收款码见 `sponsor/wechat-qr.png`，作者本人带 Tri 水印的码，纯静态图片、不含任何密钥）。

## 许可证

代码采用 [MIT](LICENSE) 许可。

内容（新闻解读与知识库）为**非盈利公益科普**，仅供学习参考，转载请保留来源；所引用第三方资讯的著作权归原作者所有，本站仅作索引与解读。
