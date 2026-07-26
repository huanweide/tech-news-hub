# 科技前瞻 · TechPulse

> 每周更新的权威科技资讯站，兼具 **新闻性 + 学习性**：每篇新闻都可溯源、可检索、可深读，并配套可检索的「名词 / 架构 / 新闻」知识库，以及本地密钥的 LLM 学习助手。

## 独特定位
多数科技资讯站只给你「信息」。TechPulse 额外给你「信息背后的知识地图」：

- **权威深读**：8 维度拆解（事件实质 / 横向研判 / 驱动逻辑 / 落地与产出 / 技术解析与架构 / 行业影响 / 读者行动建议），含内联 SVG 架构图（明暗主题自适应）。
- **可检索知识库**：📚 资料库聚合 **91 条专业术语**与 **18 张架构图**，点术语即看释义 + 架构含义 + 关联新闻，名词 ↔ 架构双向跳转。
- **本地密钥 LLM 助手**：🤖 右侧抽屉，Bring-Your-Own-Key（密钥只存你浏览器，不上传服务器），基于本站「有来源·可溯源」知识库做检索增强（RAG），可对话、可索引找文章。
- **每周自动更新**：新闻每周自动补充，无需人工维护。
- **非盈利公益**：内容仅供学习参考，附可追溯来源。

## 在线访问
GitHub Pages：**https://huanweide.github.io/tech-news-hub/**

## 本地运行
```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务器
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```
> LLM 助手需浏览器能直连你配置的接口地址（如 DeepSeek / OpenAI 兼容服务）。

## 自动更新机制（0 元）
- **主更新（高质量）**：WorkBuddy 自动化任务每周一 09:00，由 AI 模型抓取当周真实新闻、撰写权威内容、追加到 `news-data.js`、跑测试并推送；GitHub Pages 自动重新部署。
- **兜底更新（不断档）**：GitHub Actions `weekly-update.yml` 每周日 22:00 UTC 从预设科技 RSS 抓取；若仓库配置了 `DEEPSEEK_API_KEY` Secret，则用 AI 生成权威摘要，否则生成基础更新，提交并推送。
- 每次推送前自动运行 `npm test`（r13–r16 + deals + a11y 共 139 项断言，含 axe-core 无障碍回归）作为质量门；`weekly-update.yml` 同时运行 `node scripts/deals_update.cjs` 同步模型优惠圈（可选 `DEEPSEEK_API_KEY` 做 AI 摘要）。

## 隐私
- LLM 助手为 Bring-Your-Own-Key：API 密钥仅存于**你的浏览器 localStorage**，请求由浏览器**直连你配置的接口**，本站静态托管不持有、不传输你的密钥。
- 对话 / 笔记记忆存于本地，可与密钥分离清除。

## 数据源
真实新闻来自公开科技媒体与 RSS（机器之心、量子位、36氪、少数派、Hacker News、arXiv 等），均附原始来源链接。

## 技术栈
纯静态前端：HTML + CSS + 原生 JS（无框架、无构建步骤）。数据层 `news-data.js` 挂 `window.NEWS_DATA`；验证用 jsdom 真机派发。

## 目录
```
index.html              页面结构
style.css               样式（明暗主题 / 架构图 / 资料库 / 助手抽屉）
app.js                  前端逻辑（渲染 / 搜索 / 资料库 / 术语词典 / LLM 助手 / 模型优惠圈）
news-data.js            新闻数据层（weeks / categories / items + architecture）
deals-data.js           优惠圈数据层（deals + 类型/平台/有效期）
features.js             辅助功能（推荐 / 热度）
r13_test.cjs…r16_test.cjs  新闻/资料库/助手验证脚本（jsdom）
deals_test.cjs          优惠圈验证脚本（jsdom）
scripts/weekly_update.cjs  新闻自动抓取脚本（GitHub Actions 调用）
scripts/deals_update.cjs  优惠圈后端发布脚本（幂等追加，GitHub Actions 调用）
.github/workflows/      自动更新流水线
```

## 模型优惠圈（🎯 优惠资讯模块）
集中发布**中转站聚合平台**（如 OpenRouter）与**大模型官方直降平台**（硅基流动、火山引擎、DeepSeek、阿里云百炼、智谱 GLM、腾讯云混元等）的**真实、可核验**优惠资讯（每条附官方来源链接），帮读者选对模型、真正薅到羊毛。

- **四类资讯**：当前实行的优惠（current）/ 新上线优惠（new）/ 模型降价预告（pricecut）/ 模型性价比评估推荐（value）。
- **多维度筛选**：按类型、按平台（中转站 / 官方）、按关键词实时过滤；默认隐藏已过期优惠（可切换显示）。
- **自动过期下架**：每条优惠含 `validFrom` / `validUntil` 有效时间范围，渲染时按当前日期计算「进行中 / 即将开始 / 已结束」并自动隐藏过期项。
- **完整前后端（0 元静态站）**：
  - 前端：`deals-data.js` 数据层 + `app.js` 渲染 + `style.css` 样式，🎯优惠圈 为资讯流中的同页常驻区块（点按钮平滑滚动+高亮聚焦）。
  - 后端（发布脚本）：`scripts/deals_update.cjs` 幂等追加新优惠到 `deals-data.js`（按 id 合并、可选 DeepSeek AI 摘要、`DRY_RUN` 安全预览、无候选源时为安全 no-op），由 GitHub Actions 周更调用。
  - 助手：LLM 助手新增 `lookup_deal` 工具，可直接问「硅基流动有什么优惠」「性价比推荐」。
- **数据真实可核验（单一事实来源）**：优惠数据为**真实信息**，真相源是 `deals-sources.json`（人工策划、每条附官方来源）；`scripts/deals_update.cjs` 每周依据它**重新生成** `deals-data.js`（与现有内容一致则跳过，幂等）。要更新/新增真实优惠，编辑 `deals-sources.json` 并推送；或在仓库 Secrets 配置 `DEEPSEEK_API_KEY`，让 Actions 每周用官方页面润色 detail。

## 许可
非盈利公益科普，内容仅供学习参考；转载请保留来源。
