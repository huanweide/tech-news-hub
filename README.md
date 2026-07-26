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
- 每次推送前自动运行 `npm test`（r13–r16 共 103 项断言）作为质量门。

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
app.js                  前端逻辑（渲染 / 搜索 / 资料库 / 术语词典 / LLM 助手）
news-data.js            数据层（weeks / categories / items + architecture）
features.js             辅助功能（推荐 / 热度）
r13_test.cjs…           验证脚本（jsdom）
scripts/weekly_update.cjs  自动抓取脚本（GitHub Actions 调用）
.github/workflows/      自动更新流水线
```

## 许可
非盈利公益科普，内容仅供学习参考；转载请保留来源。
