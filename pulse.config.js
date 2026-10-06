'use strict';
/*
 * TechPulse 站点配置 —— 改这一个文件，就能让这套静态站变成你自己领域的周刊。
 *
 * 为什么要有这个文件
 * ------------------
 * 抓取源、分类关键词、标签池这些原本零散写死在 `scripts/weekly_update.cjs` 里
 * （FEEDS / AI_KW / tagsOf 的 pool / ARCH_LABELS）。结果是：这套站的外壳
 * （8 维度模板、内联 SVG 架构图、可检索知识库、BYOK 助手、axe 无障碍回归）
 * 明明完全通用，但**除作者本人之外没人能用** —— 想换个领域就得改脚本源码。
 *
 * 而同一个仓库里的「模型优惠圈」早就做对了：它从 `deals-sources.json` 读源。
 * 所以这里补上缺的那一半，让两边的方式保持一致。
 *
 * 向后兼容
 * --------
 * 本文件的默认值与原先硬编码在脚本里的取值**逐项相同**。
 * 也就是说作者原有的每周自动更新任务（`node scripts/weekly_update.cjs`）
 * 行为完全不变，无需改动任何一行。
 * 这件事由 `scripts/config_test.cjs` 里的等价性断言守着。
 *
 * 怎么用
 * ------
 *   1) 直接改本文件（最简单）
 *   2) 或另写一份配置，用环境变量指过去：
 *        PULSE_CONFIG=./my-config.js node scripts/weekly_update.cjs
 *      这样你可以 fork 本仓库后保留上游配置不动，方便跟进上游改动。
 */

module.exports = {
  // ---------------------------------------------------------------- 站点身份
  site: {
    name: '科技前瞻 · TechPulse',
    shortName: 'TechPulse',
    tagline: '把每周科技新闻，升级成可溯源、可检索、可深读的知识地图',
    repo: 'huanweide/tech-news-hub'
  },

  // ---------------------------------------------------------------- 抓取源
  // cat 字段必须落在 categories 里声明过的 id 上
  feeds: [
    { name: '量子位', url: 'https://www.qbitai.com/feed', cat: 'ai' },
    { name: '机器之心', url: 'https://www.jiqizhixin.com/rss', cat: 'ai' },
    { name: '36氪', url: 'https://36kr.com/feed', cat: 'tech' },
    { name: '少数派', url: 'https://sspai.com/feed', cat: 'tech' },
    { name: 'Hacker News', url: 'https://hnrss.org/frontpage', cat: 'tech' },
    { name: 'arXiv cs.AI', url: 'https://rss.arxiv.org/rss/cs.AI', cat: 'ai' }
  ],

  // ---------------------------------------------------------------- 分类
  // primaryCat：命中 CategoryKeywords 里任一词时的归类；其余落到 fallbackCat
  categories: {
    ids: ['ai', 'tech'],
    fallbackCat: 'tech',
    primaryCat: 'ai'
  },

  // 命中这些词就归到 primaryCat（原 AI_KW，逐项保持一致）
  categoryKeywords: [
    'ai', '大模型', '模型', '智能体', 'agent', '算力', '深度学习',
    '神经网络', 'gpt', 'llm', 'moe', '开源', '芯片', '量子', '多模态'
  ],

  // 标签候选池（原 tagsOf 内部 pool）
  tagPool: [
    'AI', '大模型', '开源', '算力', '多模态', '智能体', '量子', '芯片',
    '机器人', '新能源', '航天', '生物', '数据', '安全', '开发者'
  ],
  tagMax: 4,

  // ---------------------------------------------------------------- 架构图文案
  // 质量门要求每条必须带内联 SVG + archCaption，这里是各分类的默认措辞
  archLabels: {
    ai: { left: '原始线索', mid: '模型 / 路由', right: '深度解读', group: 'AI 技术链路' },
    tech: { left: '信源输入', mid: '处理 / 聚合', right: '对外交付', group: '产品技术链路' }
  },

  // ---------------------------------------------------------------- 抓取参数
  harvest: {
    withinDays: 9,   // 只收最近 N 天内的条目
    maxItems: 14     // 每周最多收录条数
  }
};
