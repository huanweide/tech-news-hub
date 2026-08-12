/* tech-news-hub 前端逻辑（第5轮：平台级重构）
 * 依赖：window.NEWS_DATA（news-data.js）、window.TechNewsFeatures（features.js）
 * 结构：吸顶头 + 分类药丸 + Hero头条 + 话题标签栏 + 主网格(封面卡) + 侧栏(周次/编辑精选/热度榜) + 订阅CTA
 * 交互：分类切换 / 周次归档 / Hero+卡片 8维度展开 / 全文搜索 / 标签AND过滤 / 影响力排序 /
 *       暗色持久化 / 周报导出 / 跨分类智能提示 / 首屏引导 / 相关阅读 / 订阅(本地)
 */
(function () {
  "use strict";
  var data = window.NEWS_DATA;
  var FX = window.TechNewsFeatures;
  var DEALS = window.DEALS_DATA || { deals: [] };
  var state = { week: (data.weeks[data.weeks.length - 1] || {}).id || "all", cat: "ai", q: "", sort: "default", activeTags: [], hideGuide: false, weekSwitched: false,
    view: "feed", kbTab: "terms", kbQuery: "", kbTerm: null, kbArch: null, libCat: "all",
    dealsType: "all", dealsPlatform: "all", dealsShowExpired: false, dealsQ: "" };

  /* IMP-084：统一的防抖工具，避免输入时每次按键触发整页全量重渲染 */
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  /* IMP-093：初始化时建立 id→对象 索引，避免频繁线性查找文章 */
  var itemById = {};
  (data.items || []).forEach(function (it) { itemById[it.id] = it; });

  var searchInput = document.getElementById("searchInput");
  var exportBtn = document.getElementById("exportBtn");
  var themeToggle = document.getElementById("themeToggle");
  var catTabs = document.getElementById("catTabs");
  var hero = document.getElementById("hero");
  var tagBar = document.getElementById("tagBar");
  var feed = document.getElementById("feed");
  var resultCountEl = document.getElementById("resultCount");
  var subhintEl = document.getElementById("subhint");
  var toastEl = document.getElementById("toast");
  var weekRail = document.getElementById("weekRail");
  var editorsPick = document.getElementById("editorsPick");
  var hotList = document.getElementById("hotList");
  var guideSlot = document.getElementById("guideSlot");
  var nlForm = document.getElementById("nlForm");
  var nlEmail = document.getElementById("nlEmail");
  var nlStatus = document.getElementById("nlStatus");
  var sortBtns = document.querySelectorAll(".sort-btn");
  var searchCountEl = document.getElementById("searchCount");
  var actionListEl = document.getElementById("actionList");
  var actionEmptyEl = document.getElementById("actionEmpty");
  var actionProgressEl = document.getElementById("actionProgress");

  var DIM = [
    ["what", "事件实质"], ["compare", "横向研判"], ["why", "驱动逻辑"],
    ["output", "落地与产出"], ["explain", "技术解析与架构"], ["impact", "行业影响"], ["action", "读者行动建议"]
  ];
  var COVER_GRADS = [
    "linear-gradient(135deg,#5b6cff,#9b5bff)",
    "linear-gradient(135deg,#0ea5a4,#22d3ee)",
    "linear-gradient(135deg,#7c3aed,#0ea5a4)",
    "linear-gradient(135deg,#4f46e5,#06b6d4)"
  ];
  var ICONS = {
    "kimi-k3": "🤖", "qwen-3-8": "🧠", "on-device-ai-filing": "📱", "hunyuan-hy3-hyra": "⚛️",
    "spacex-starship-13": "🚀", "imec-diraq-qubits": "🔬", "china-tech-breakthroughs": "⚡", "mit-photonic-chip": "💡",
    "ai-persona-regulation": "⚖️", "humanoid-robot-massproduction": "🦾", "gravity-one-yaosi-launch": "🚀", "atommatrix-neutral-atom-qpu": "⚛️",
    "beijing-agent-policy": "🏛️", "gemini-3-6-flash": "🔷", "waic-2026-close": "🏙️", "hiaf-commissioning": "⚛️", "lijian-y15-launch": "🛰️", "bci-thousand-sync": "🧠"
  };
  var CAT_COLOR = { ai: "var(--accent-ai)", tech: "var(--accent-tech)", bio: "var(--accent-bio)", energy: "var(--accent-energy)" };

  function catLabel(id) { for (var i = 0; i < data.categories.length; i++) if (data.categories[i].id === id) return data.categories[i].label; return id; }
  function weekLabel(id) { if (id === "all") return "全部周次"; for (var i = 0; i < data.weeks.length; i++) if (data.weeks[i].id === id) return data.weeks[i].label; return id; }
  function latestWeekId() { return data.weeks.length ? data.weeks[data.weeks.length - 1].id : null; }
  function isLatestWeek(id) { return id === latestWeekId(); }
  function catColor(id) { return CAT_COLOR[id] || "var(--brand)"; }
  function coverGrad(it) { var idx = data.items.indexOf(it); return COVER_GRADS[((idx % COVER_GRADS.length) + COVER_GRADS.length) % COVER_GRADS.length]; }
  function iconFor(it) { return ICONS[it.id] || "📰"; }
  function readingTime(it) { var t = [it.summary, it.what, it.compare, it.why, it.output, it.explain, it.impact, it.action].map(function (x) { return x || ""; }).join(""); return Math.max(1, Math.round(t.length / 300)); }
  function isInitialView() { return state.q === "" && state.activeTags.length === 0 && !state.weekSwitched; }

  /* ---------- R8：搜索高亮 + 转义 ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  /* R9：来源 url 协议白名单校验——仅允许 http/https/mailto，拒绝 javascript:/data: 等 */
  function safeUrlAttr(u) {
    var v = String(u == null ? "" : u).trim();
    if (!/^(https?:|mailto:)/i.test(v)) return "#";
    return v;
  }
  function hl(text) {
    var s = String(text);
    if (!state.q) return escapeHtml(s);
    var q = state.q, lower = s.toLowerCase(), ql = q.toLowerCase(), qlen = q.length;
    var out = "", start = 0, i;
    while ((i = lower.indexOf(ql, start)) >= 0) {
      out += escapeHtml(s.slice(start, i)) + "<mark>" + escapeHtml(s.slice(i, i + qlen)) + "</mark>";
      start = i + qlen;
    }
    out += escapeHtml(s.slice(start));
    return out;
  }

  /* ---------- R14：专业术语词典弹层 ---------- */
  /* 术语 → 权威释义。gloss() 在搜索高亮(hl)之后，把正文中的术语包成可点击的 .term。
     术语按长度降序匹配，优先长词，避免短词在长词内部重复包裹。 */
  var GLOSSARY = {
    "MoE": "混合专家模型（Mixture of Experts）。把前馈层拆成多个专家子网络，由门控网络按 token 动态激活少数专家，使总参数极大而单步计算量可控。",
    "混合专家": "Mixture of Experts（MoE）的中文说法：见 MoE。",
    "门控网络": "MoE 中决定每个 token 路由到哪些专家的组件（Gating），输出各专家激活权重并只保留 Top-k。",
    "激活参数": "MoE 单次前向实际参与计算的参数规模，远小于总参数；它决定推理成本，总参数决定模型容量。",
    "开放权重": "模型权重公开发布，允许本地部署、微调与审计；与仅提供 API 的闭源模式相对。",
    "蒸馏": "知识蒸馏。用大模型（教师）的输出训练小模型（学生），在缩小规模的同时保留大部分能力。",
    "微调": "在预训练模型基础上用特定领域数据继续训练，使模型适配具体任务。",
    "长上下文": "模型单次可处理的 token 长度很大（如 100 万），可吞入整本书或整个代码库。",
    "上下文窗口": "模型一次推理能接收的最大 token 数，超过部分需截断或分段处理。",
    "端侧": "计算直接在用户设备（如手机）本地完成，数据不出设备；与云端相对。",
    "端云协同": "敏感或简单任务在端侧处理、复杂任务再上云的混合架构，兼顾隐私与能力。",
    "NPU": "神经网络处理单元（Neural Processing Unit），专为 AI 推理设计的加速芯片。",
    "神经网络处理单元": "即 NPU，见 NPU。",
    "量化": "模型量化。用更低精度（如 INT8）表示权重，缩小体积、加速推理，代价是轻微精度损失。",
    "备案": "我国生成式 AI 服务的合规登记制度（算法备案＋安全评估），是能力上线的制度前提。",
    "算法备案": "生成式 AI 服务上线前向监管部门登记的合规流程，含安全评估。",
    "多模态": "模型在统一表征空间内处理文本、图像、代码等多种模态，而非为每种模态单独建模。",
    "统一表征": "将不同模态映射到同一语义空间，使文本/图像/代码可相互对齐与转换。",
    "工具链": "围绕模型的一整套开发/部署工具（IDE、Agent、CI 等），集成路线靠它构建护城河。",
    "智能体": "Agent。能感知环境、自主规划并调用工具完成目标的 AI 系统，从“聊天”升级为“能干活的劳动力”。",
    "具身智能": "Embodied AI。智能体拥有物理或仿真身体（如机器人），通过与环境交互学习，而非仅处理文本。",
    "具身智能体": "具备身体的智能体（如人形机器人），结合运动控制与感知决策。",
    "递归自我改进": "智能体完成任务后自动评估短板并改写自身策略/代码，下一轮以“更好的自己”再跑，形成越用越强的飞轮。",
    "OpenRouter": "统一调用各家大模型的聚合平台（“模型超市”）；其调用量排名反映真实开发者选用。",
    "RL": "强化学习（Reinforcement Learning）。智能体通过奖励信号试错优化策略，是自我改进的常见基础。",
    "元优化": "对“优化过程本身”再优化（meta-optimization），如让智能体学会如何更好地自我改进。",
    "Eval": "评估（Evaluation）。衡量模型/智能体表现的信号；自我改进的质量高度依赖可靠的 Eval。",
    "评估信号": "用于衡量任务好坏的指标（如测试通过率），是递归自我改进的“方向盘”。",
    "AI for Science": "用 AI 加速科学发现（写论文、做实验、解数学题等），见 Hyra 类科研智能体。",
    "AI for AI": "用 AI 改进 AI 系统本身（如自动调参、自动写训练代码）。",
    "一箭多星": "单次火箭发射将多颗卫星送入轨道，提升发射效率、摊薄成本。",
    "一箭五星": "一次发射运载五颗卫星，是一箭多星的具体形式。",
    "上面级": "火箭末级，负责在星箭分离前将载荷送入精确轨道。",
    "整流罩": "包裹卫星的保护外壳，穿越大气层时防风防热，出大气后抛离。",
    "入轨": "航天器达到足够速度被地球引力捕获，进入预定轨道。",
    "硅基量子": "以硅工艺制造的量子比特，便于与传统半导体产线兼容、规模化。",
    "超导量子比特": "基于超导电路（如 transmon）的量子比特，是当前主流路线之一。",
    "相干时间": "量子态保持叠加/纠缠不被噪声破坏的时长，越长越利于计算。",
    "量子纠错": "用多个物理比特编码一个逻辑比特以对抗噪声，是实用量子计算的关键。",
    "中性原子": "以中性原子（如铷）囚禁于光镊中作量子比特的路线，可扩展到数千比特。",
    "光镊": "用聚焦激光束俘获并操控原子/粒子的技术，是中性原子量子计算的“囚笼”。",
    "量子比特": "量子计算的基本信息单元，可处于 0/1 叠加态，区别于经典比特。",
    "光子芯片": "用光子而非电子进行运算/传输的芯片，擅长高速低功耗互连。",
    "光互连": "以光信号在芯片/板级间传输数据，突破电互连带宽与功耗瓶颈。",
    "硅光": "硅基光电子（Silicon Photonics），在同一硅片上集成光路与电路。",
    "重离子加速器": "加速重离子（如铀、碳）到高能的装置，用于核物理、医学同位素与材料研究。",
    "HIAF": "强流重离子加速器装置（High Intensity heavy-ion Accelerator Facility），我国建成的世界级核物理实验平台。",
    "同位素": "质子数相同、中子数不同的同元素变体，广泛用于医疗诊断与放疗。",
    "脑机接口": "BCI。在大脑与外部设备间建立直接通信通道，读取或写入神经信号。",
    "BCI": "脑机接口（Brain-Computer Interface），见 脑机接口。",
    "脑电": "脑电（EEG）。头皮/颅内记录的脑电活动，是脑机接口常用信号源。",
    "神经信号": "神经元放电产生的电信号，是脑机接口读取与解码的对象。",
    "数据湖": "集中存储海量原始多源数据的系统，便于后续分析；此处指跨地域脑电数据的汇聚。",
    "同步采集": "多地点在同一时刻采集数据，保证时序一致、可跨域比对。",
    "人形机器人": "拟人形态机器人，目标是替代或协助人类完成通用任务。",
    "AIP": "Agent 智能体政策（Agent & Intelligent-agent Policy），北京专项中对智能体产业的扶持框架。",
    "Token 经济": "围绕大模型 token 计费/消耗的商业与政策设计，如按调用量或激活量计价。",
    "闭源": "模型权重不公开、仅以 API 提供能力的模式，与开放权重相对。",
    "旗舰": "厂商能力最强的顶层模型，常作为技术标杆与品牌门面。",
    "生成式 AI": "能生成文本/图像/代码等内容的人工智能，区别于判别式模型。",
    "生成式AI": "即生成式 AI，见 生成式 AI。",
    "大模型": "参数规模达百亿级以上的神经网络模型（LLM/VLM），具备涌现能力。",
    "智能体编排": "把多个智能体的规划、工具调用与记忆按工作流串起来协同完成任务。",
    "工具调用": "Agent 调用外部函数/API（查库、跑代码等）补足纯文本模型的能力。",
    "函数调用": "Function Calling。模型按需生成结构化参数调用指定函数，是工具调用的实现。",
    "RAG": "检索增强生成（Retrieval-Augmented Generation）。先检索相关文档再基于证据作答，降低幻觉。",
    "检索增强生成": "即 RAG，见 RAG。",
    "扩散模型": "通过逐步去噪生成图像/视频的生成模型（如 Stable Diffusion），是多模态创作主力。",
    "LoRA": "参数高效微调（Low-Rank Adaptation）。只训练低秩增量矩阵即可适配新任务，省显存。",
    "参数高效微调": "PEFT。只更新模型一小部分参数（如 LoRA）完成适配，成本远低于全量微调。",
    "思维链": "Chain-of-Thought（CoT）。让模型显式写出中间推理步骤，提升复杂题准确率。",
    "多智能体": "Multi-Agent。多个角色各异的智能体协作或辩论，以完成单智能体难解的任务。",
    "世界模型": "World Model。智能体内部对环境的动力学预测，用于规划与仿真。",
    "仿真": "在计算机中构建环境模型进行推演，常用于具身智能训练（仿真到现实的迁移）。",
    "在轨": "航天器进入预定轨道后的运行阶段，与发射、入轨相对。",
    "低轨": "近地轨道（LEO，约 160–2000 km），卫星互联网的主要部署层。",
    "卫星互联网": "由低轨卫星星座提供的全球互联网接入，代表有 Starlink 等。",
    "算力": "完成 AI 训练/推理所需的计算能力，通常以 GPU/集群规模衡量。",
    "推理成本": "模型每次输出所消耗的算力与费用，与激活参数、token 数直接相关。",
    "边缘计算": "在数据产生侧（设备/基站）就近计算，减少上云时延与带宽，与端侧相近。",
    "合成数据": "由模型生成、用于训练的数据，缓解真实标注稀缺与隐私问题。",
    "对齐": "Alignment。使 AI 目标与人类意图一致，防止危险或欺骗性行为，是安全核心。",
    "安全评估": "对模型风险（有害输出、越狱等）的系统化测试，是备案上线前提。",
    "提示词": "Prompt。给模型的指令文本，决定任务边界与输出质量。",
    "上下文工程": "Context Engineering。系统性地组织注入模型的背景、记忆与工具结果，比单条提示词更工程化。",
    "API": "应用程序接口（Application Programming Interface），模型/服务对外提供能力的调用入口。",
    "开源": "源代码公开、可自由使用修改的模式，与开放权重、闭源相对。",
    "沙盒": "隔离的运行环境，限制智能体/代码的权限以防越权，是安全部署的常见手段。",
    "GPU": "图形处理器（Graphics Processing Unit），因大规模并行而成 AI 训练推理主力硬件。",
    "涌现能力": "Emergence。模型规模跨过阈值后突然具备的小模型没有的能力（如复杂推理）。",
    "信息差": "不同人群掌握信息的时差与质差；本站的「影响力」分旨在量化一条资讯的信息差价值。"
  };
  function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var GLOSS_TERMS = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
  var GLOSS_RE = new RegExp("(" + GLOSS_TERMS.map(escapeReg).join("|") + ")", "g");
  function gloss(html) {
    if (!html) return html;
    return String(html).replace(GLOSS_RE, function (m) {
      return '<span class="term" tabindex="0" role="button" data-term="' + escapeHtml(m) + '" aria-label="查看术语释义">' + m + "</span>";
    });
  }
  // 先搜索高亮，再包术语（顺序不可反：hl 会转义，必须在其后再包 span）
  function gh(t) { return gloss(hl(t)); }

  /* ---------- R15：架构索引（名词 → 架构含义 → 关联新闻） ----------
     每条带 architecture 的新闻对应一个"架构词条"，用 ARCH_NAMES 给出概念名，
     并自动把正文命中的术语关联为"涉及名词"。资料库据此构建可导航的知识索引。 */
  var ARCH_NAMES = {
    "w5-ai-01": "混合专家（MoE）稀疏激活架构",
    "w5-ai-02": "多模态统一表征 + 工具链一体化架构",
    "w5-ai-03": "端云协同的端侧智能架构",
    "w5-ai-04": "递归自我改进的元智能体飞轮",
    "w5-tech-01": "可复用火箭一箭多星堆栈",
    "w5-tech-02": "硅基超导量子比特路线",
    "w5-tech-03": "三大根技术协同（AI×量子×航天）",
    "w5-tech-04": "光子芯片与硅光互连",
    "w5-tech-05": "智能体政策与产业生态架构",
    "w4-ai-01": "监管沙盒 + 分级分类治理架构",
    "w4-ai-02": "具身智能体（机器人）感知-决策-控制环",
    "w4-tech-01": "海上发射测控与回收体系",
    "w4-tech-02": "中性原子光镊量子路线",
    "w4-tech-03": "智能体政策生态系统",
    "w4-tech-04": "Gemini + CodeMender 编程智能体链",
    "w4-tech-05": "WAIC 全栈智能体展馆架构",
    "w3-tech-01": "HIAF 强流重离子加速器链",
    "w3-tech-02": "在轨智能与星上处理架构",
    "w3-tech-03": "跨地域脑电数据湖与 BCI 闭环"
  };
  function archIndex() {
    var idx = {};
    data.items.forEach(function (it) {
      if (!it.architecture) return;
      var hay = [it.title, it.summary, it.what, it.compare, it.why, it.output, it.explain, it.impact, it.action].join(" ");
      var terms = [];
      Object.keys(GLOSSARY).forEach(function (t) { if (hay.indexOf(t) >= 0) terms.push(t); });
      idx[it.id] = {
        itemId: it.id,
        name: ARCH_NAMES[it.id] || it.title,
        title: it.title,
        caption: it.archCaption || "架构示意（实线箭头表示数据/控制流，虚线表示反馈或可选链路）",
        svg: it.architecture,
        terms: terms
      };
    });
    return idx;
  }
  var ARCH_IDX = archIndex();
  // 某术语涉及的架构（取其 terms 含该术语的架构）
  function archForTerm(t) {
    var out = [];
    Object.keys(ARCH_IDX).forEach(function (k) {
      if (ARCH_IDX[k].terms.indexOf(t) >= 0) out.push(ARCH_IDX[k]);
    });
    return out;
  }
  // 提及某术语的新闻（标题/摘要/8维正文含该词）
  function newsForTerm(t) {
    return data.items.filter(function (it) {
      var hay = [it.title, it.summary, it.what, it.compare, it.why, it.output, it.explain, it.impact, it.action].join(" ");
      return hay.indexOf(t) >= 0;
    });
  }
  // 资料库搜索：覆盖 名词 / 架构 / 新闻
  function kbSearch(q) {
    q = (q || "").trim().toLowerCase();
    var r = { terms: [], arch: [], news: [] };
    if (!q) return r;
    Object.keys(GLOSSARY).forEach(function (t) { if (t.toLowerCase().indexOf(q) >= 0) r.terms.push(t); });
    Object.keys(ARCH_IDX).forEach(function (k) {
      var a = ARCH_IDX[k];
      if (a.name.toLowerCase().indexOf(q) >= 0 || a.caption.toLowerCase().indexOf(q) >= 0 || a.title.toLowerCase().indexOf(q) >= 0) r.arch.push(a);
    });
    data.items.forEach(function (it) {
      var hay = [it.title, it.summary, it.tags.join(" ")].join(" ").toLowerCase();
      if (hay.indexOf(q) >= 0) r.news.push(it);
    });
    return r;
  }

  /* ---------- 过滤核心（参数化） ---------- */
  function matches(it, opts) {
    opts = opts || {};
    var cat = opts.cat != null ? opts.cat : state.cat;
    var week = opts.week != null ? opts.week : state.week;
    var q = opts.q != null ? opts.q : state.q;
    var tags = opts.tags != null ? opts.tags : state.activeTags;
    if (it.category !== cat) return false;
    if (week !== "all" && it.week !== week) return false;
    if (tags.length) { for (var i = 0; i < tags.length; i++) if (it.tags.indexOf(tags[i]) < 0) return false; }
    if (q) {
      var hay = [it.title, it.summary, it.what, it.compare, it.why, it.output, it.explain, it.impact, it.action, it.tags.join(" ")].join(" ").toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  function filtered() {
    var list = data.items.filter(function (it) { return matches(it); });
    if (state.sort === "impact") list = list.slice().sort(function (a, b) { return b.impactScore - a.impactScore; });
    return list;
  }
  function catMatchCounts() {
    var m = {};
    data.categories.forEach(function (c) { if (c.disabled) { m[c.id] = 0; return; } m[c.id] = data.items.filter(function (it) { return matches(it, { cat: c.id }); }).length; });
    return m;
  }
  function allTags() {
    var s = {};
    data.items.forEach(function (it) { it.tags.forEach(function (t) { s[t] = 1; }); });
    return Object.keys(s);
  }

  /* ---------- 分类药丸 ---------- */
  function renderCats() {
    catTabs.innerHTML = "";
    data.categories.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      var dis = !!c.disabled;
      b.className = "cat-tab" + (c.id === state.cat ? " active" : "") + (dis ? " disabled" : "");
      if (dis) { b.innerHTML = c.label + ' <span class="soon">即将开放</span>'; b.title = "敬请期待，即将上线"; b.setAttribute("aria-disabled", "true"); }
      else { b.textContent = c.label; b.addEventListener("click", function () { state.cat = c.id; render(); }); }
      catTabs.appendChild(b);
    });
  }

  /* ---------- 话题标签栏 ---------- */
  function renderTagBar() {
    tagBar.innerHTML = "";
    allTags().forEach(function (t) {
      var on = state.activeTags.indexOf(t) >= 0;
      var b = document.createElement("button");
      b.className = "tag-chip" + (on ? " on" : "");
      b.type = "button";
      b.setAttribute("data-tag", t);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.textContent = t;
      tagBar.appendChild(b);
    });
  }

  /* ---------- 8 维度详情 + 相关阅读 ---------- */
  function buildDetail(it) {
    var d = document.createElement("div");
    d.className = "dims";
    d.hidden = true;
    DIM.forEach(function (dim) {
      var sec = document.createElement("div");
      sec.className = "dim";
      if (dim[0] === "action") {
        sec.innerHTML = '<div class="dim-kicker">' + dim[1] + "</div><p>" + gh(it[dim[0]]) + "</p>";
        var addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "add-action" + (hasAction(it.id) ? " added" : "");
        addBtn.setAttribute("data-id", it.id);
        addBtn.textContent = hasAction(it.id) ? "✓ 已在我的清单中" : "＋ 加入我的行动清单";
        addBtn.setAttribute("aria-pressed", hasAction(it.id) ? "true" : "false");
        addBtn.addEventListener("click", function () { toggleAction(it.id); });
        sec.appendChild(addBtn);
      } else if (dim[0] === "explain" && it.architecture) {
        sec.innerHTML = '<div class="dim-kicker">' + dim[1] + "</div><p>" + gh(it[dim[0]]) + "</p>";
        var fig = document.createElement("figure");
        fig.className = "arch-fig";
        var cap = it.archCaption || "架构示意（实线箭头表示数据/控制流，虚线表示反馈或可选链路）";
        fig.innerHTML = it.architecture + '<figcaption class="arch-cap">' + cap + "</figcaption>";
        sec.appendChild(fig);
      } else {
        sec.innerHTML = '<div class="dim-kicker">' + dim[1] + "</div><p>" + gh(it[dim[0]]) + "</p>";
      }
      d.appendChild(sec);
    });
    var src = document.createElement("div");
    src.className = "dim sources";
    src.innerHTML = '<div class="dim-kicker">引用来源</div>' + it.sources.map(function (s) { return '<a href="' + escapeHtml(safeUrlAttr(s.url)) + '" target="_blank" rel="noopener">' + escapeHtml(s.name) + " ↗</a>"; }).join("");
    d.appendChild(src);
    // 相关阅读（按共享标签推荐）
    var rel = FX ? FX.recommend(it.id, data.items, 3) : [];
    if (rel.length) {
      var r = document.createElement("div");
      r.className = "related";
      var html = '<div class="related-title">相关阅读（按共同话题）</div>';
      rel.forEach(function (x) {
        html += '<div class="related-item" data-go="' + x.id + '" tabindex="0" role="button">' +
          '<span class="r-dot"></span><span class="r-title">' + x.title + '</span><span class="r-score">' + x.impactScore + '</span></div>';
      });
      r.innerHTML = html;
      d.appendChild(r);
    }
    return d;
  }
  function makeToggle(detail) {
    var t = document.createElement("button");
    t.className = "toggle"; t.type = "button"; t.setAttribute("aria-expanded", "false");
    t.textContent = "展开 8 维度 ▾";
    t.addEventListener("click", function () {
      detail.hidden = !detail.hidden;
      t.textContent = detail.hidden ? "展开 8 维度 ▾" : "收起 ▴";
      t.setAttribute("aria-expanded", detail.hidden ? "false" : "true");
    });
    return t;
  }

  /* ---------- Hero 头条 ---------- */
  function renderHero(it) {
    if (!it) { hero.style.display = "none"; hero.innerHTML = ""; return; }
    hero.style.display = "";
    hero.innerHTML = "";
    var body = document.createElement("div");
    body.className = "hero-body";
    var isLatest = state.week === latestWeekId();
    body.innerHTML = '<span class="hero-kicker">' + (isLatest ? "本周头条" : "头条") + " · " + catLabel(it.category) + '</span><h1>' + gh(it.title) + '</h1><p class="summary">' + gh(it.summary) + '</p>';
    var meta = document.createElement("div");
    meta.className = "hero-meta";
    meta.innerHTML = '<span class="badge cat">' + catLabel(it.category) + '</span>' +
      '<span class="badge">🕒 约' + readingTime(it) + '分钟</span>' +
      '<span class="badge">📚 ' + it.sources.length + '来源</span>' +
      '<span class="badge heat">🔥 影响力 ' + it.impactScore + '</span>' +
      (it.week === latestWeekId() ? '<span class="badge new">🆕 本周</span>' : '');
    var chips = document.createElement("div");
    chips.className = "tag-chips"; chips.style.width = "100%";
    chips.innerHTML = it.tags.map(function (t) { return '<button class="tag-chip" type="button" data-tag="' + t + '">' + t + '</button>'; }).join("");
    body.appendChild(meta); body.appendChild(chips);
    var detail = buildDetail(it);
    body.appendChild(makeToggle(detail));
    body.appendChild(detail);
    var cov = document.createElement("div");
    cov.className = "hero-cover"; cov.style.background = coverGrad(it);
    cov.innerHTML = '<span class="cov-icon">' + iconFor(it) + '</span>';
    hero.appendChild(body); hero.appendChild(cov);
  }

  /* ---------- 卡片 ---------- */
  function buildCard(it) {
    var card = document.createElement("article");
    card.className = "card";
    var cov = document.createElement("div");
    cov.className = "cover"; cov.style.background = coverGrad(it);
    cov.innerHTML = '<span class="cov-icon">' + iconFor(it) + '</span><div class="cov-bar"><i style="width:' + it.impactScore + '%"></i></div>';
    var strip = document.createElement("div");
    strip.className = "card-cat-strip"; strip.style.background = catColor(it.category);
    var body = document.createElement("div");
    body.className = "card-body";
    var chips = it.tags.map(function (t) {
      var on = state.activeTags.indexOf(t) >= 0;
      return '<button class="tag-chip' + (on ? " on" : "") + '" type="button" data-tag="' + t + '" aria-pressed="' + (on ? "true" : "false") + '">' + t + '</button>';
    }).join("");
    body.innerHTML = '<h3>' + gh(it.title) + '</h3><p class="summary">' + gh(it.summary) + '</p>' +
      '<div class="meta">' +
        (it.week === latestWeekId() ? '<span class="badge new">🆕 本周</span>' : '') +
        '<span class="badge cat">' + catLabel(it.category) + '</span>' +
        '<span class="badge">🕒 约' + readingTime(it) + '分钟</span>' +
        '<span class="badge">📚 ' + it.sources.length + '来源</span>' +
        '<span class="badge heat">🔥 ' + it.impactScore + '</span>' +
        '<span class="tag-chips">' + chips + '</span>' +
      '</div><div class="card-actions"><span class="badge">8/8 维度解读</span></div>';
    var detail = buildDetail(it);
    body.querySelector(".card-actions").appendChild(makeToggle(detail));
    body.appendChild(detail);
    card.appendChild(cov); card.appendChild(strip); card.appendChild(body);
    return card;
  }

  /* ---------- 首屏引导 ---------- */
  function buildGuide() {
    var g = document.createElement("div");
    g.className = "guide";
    g.setAttribute("role", "note");
    g.innerHTML = '<div class="guide-head"><span class="guide-title">💡 30 秒上手</span><button class="guide-close" type="button" aria-label="关闭引导">✕</button></div>' +
      '<ul class="guide-list">' +
      '<li>顶部「本周头条」是本周最值得读的一条；下方网格是其余资讯。</li>' +
      '<li>点顶部分类（AI圈 / 科技圈）切换领域，右侧「周次归档」看不同周。</li>' +
      '<li>「话题」栏点标签可<b>叠加筛选</b>（多个标签需同时满足）。</li>' +
      '<li>点卡片「展开 8 维度」看发生了什么、为什么、对你有何影响与行动建议；底部还有<b>相关阅读</b>。</li>' +
      '<li>点「导出周报」保存当前内容为 Markdown；订阅框可留邮箱（本地保存）。</li>' +
      '<li>卡片上的「🔥 影响力」是编辑对信息差价值的 1–100 评估，越高越值得优先读。</li>' +
      '</ul>';
    g.querySelector(".guide-close").addEventListener("click", function () { state.hideGuide = true; render(); });
    return g;
  }

  /* ---------- 空状态（跨分类提示 + AND 解释 + 计数整合） ---------- */
  function buildEmptyState() {
    var wrap = document.createElement("div");
    wrap.className = "empty";
    var counts = catMatchCounts();
    var other = data.categories.filter(function (c) { return !c.disabled && c.id !== state.cat && counts[c.id] > 0; });
    var html = '<div class="empty-icon">🔍</div><p class="empty-title">共 0 条 · 没有匹配的资讯</p>';
    if (state.activeTags.length) {
      html += '<p class="empty-hint">标签为「同时满足（AND）」筛选：当前已选 ' + state.activeTags.map(function (t) { return "“" + t + "”"; }).join(" + ") + '，需一条资讯同时带全部这些标签。</p>';
    }
    if (other.length) {
      html += '<p class="empty-hint">在其它分类找到相关内容，可一键切换查看：</p><div class="switch-cats">';
      other.forEach(function (c) { html += '<button class="switch-cat" type="button" data-cat="' + c.id + '">' + catLabel(c.id) + " · " + counts[c.id] + ' 条 →</button>'; });
      html += "</div>";
    } else if (state.q && !state.activeTags.length && state.week === "all") {
      html += '<p class="empty-hint">换个关键词，或清除搜索再试试。</p>';
    } else if (state.week !== "all") {
      html += '<p class="empty-hint">该周次下没有匹配项，试试「全部周次」或其它筛选。</p>';
    }
    if (state.q || state.activeTags.length || state.week !== "all") html += '<button class="clear-filters" type="button">清除全部筛选条件</button>';
    html += '<button class="random-read" type="button">🎲 随机看一条</button>';
    wrap.innerHTML = html;
    Array.prototype.forEach.call(wrap.querySelectorAll(".switch-cat"), function (b) {
      b.addEventListener("click", function () { state.cat = b.getAttribute("data-cat"); render(); toast("已切换到 " + catLabel(state.cat) + "，保留当前搜索与标签"); });
    });
    var cf = wrap.querySelector(".clear-filters");
    if (cf) cf.addEventListener("click", function () { state.q = ""; searchInput.value = ""; state.activeTags = []; state.week = "all"; render(); });
    var rr = wrap.querySelector(".random-read");
    if (rr) rr.addEventListener("click", function () { var all = data.items; if (!all.length) return; var pick = all[Math.floor(Math.random() * all.length)]; goToItem(pick); });
    return wrap;
  }

  /* ---------- 主网格 ---------- */
  function renderFeed(list) {
    feed.innerHTML = "";
    if (!list) list = filtered();
    if (!list.length) { feed.appendChild(buildEmptyState()); guideSlot.innerHTML = ""; return; }
    if (!state.hideGuide && isInitialView()) guideSlot.innerHTML = "", guideSlot.appendChild(buildGuide());
    else guideSlot.innerHTML = "";
    var heroItem = list.slice().sort(function (a, b) { return b.impactScore - a.impactScore; })[0];
    renderHero(heroItem);
    list.filter(function (it) { return it.id !== heroItem.id; }).forEach(function (it, i) {
      var c = buildCard(it);
      c.style.animationDelay = (i * 0.04) + "s";
      feed.appendChild(c);
    });
  }

  /* ---------- 侧栏 ---------- */
  function renderSidebar() {
    weekRail.innerHTML = "";
    var all = document.createElement("button");
    all.className = "week-btn" + (state.week === "all" ? " active" : "");
    all.innerHTML = '<span class="wk-label">全部周次</span>';
    all.addEventListener("click", function () { state.week = "all"; state.weekSwitched = true; render(); });
    weekRail.appendChild(all);
    data.weeks.forEach(function (w) {
      var b = document.createElement("button");
      b.className = "week-btn" + (state.week === w.id ? " active" : "");
      b.innerHTML = '<span class="wk-label">' + w.label + '</span><span class="wk-range">' + w.range + '</span>';
      b.addEventListener("click", function () { state.week = w.id; state.weekSwitched = true; render(); });
      weekRail.appendChild(b);
    });
    editorsPick.innerHTML = "";
    FX.trending(data.items, 4).forEach(function (it) {
      var el = document.createElement("div");
      el.className = "pick-item"; el.tabIndex = 0;
      el.innerHTML = '<div class="pick-thumb" style="background:' + coverGrad(it) + '">' + iconFor(it) + '</div>' +
        '<div><div class="p-title">' + it.title + '</div><div class="p-sub">影响力 ' + it.impactScore + ' · ' + catLabel(it.category) + '</div></div>';
      el.addEventListener("click", function () { goToItem(it); });
      editorsPick.appendChild(el);
    });
    hotList.innerHTML = "";
    FX.trending(data.items, 5).forEach(function (it) {
      var li = document.createElement("li");
      li.tabIndex = 0;
      li.innerHTML = '<span class="h-title">' + it.title + '</span><span class="h-score">' + it.impactScore + '</span>';
      li.addEventListener("click", function () { goToItem(it); });
      hotList.appendChild(li);
    });
  }

  function goToItem(it) {
    state.cat = it.category; state.week = it.week; state.weekSwitched = true; state.q = ""; searchInput.value = ""; state.activeTags = [];
    state.view = "feed"; state.kbTerm = null; state.kbArch = null; state.kbQuery = "";
    var kb = kbEl("kbView"); if (kb) kb.hidden = true;
    var kq = kbEl("kbSearch"); if (kq) kq.value = "";
    document.body.classList.remove("kb-open");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("已定位到：" + it.title);
  }

  /* ---------- 工具栏 ---------- */
  function renderToolbar(list) {
    if (!list) list = filtered();
    sortBtns.forEach(function (b) { b.classList.toggle("active", b.getAttribute("data-sort") === state.sort); });
    resultCountEl.textContent = "共 " + list.length + " 条";
    subhintEl.textContent = "标签为「同时满足」筛选（AND）；🔥 影响力 1–100 分，越高越值得优先读。";
  }

  /* ---------- R9：搜索实时计数 ---------- */
  function renderSearchCount(list) {
    if (!searchCountEl) return;
    if (!list) list = filtered();
    var n = list.length;
    if (state.q) {
      searchCountEl.hidden = false;
      searchCountEl.innerHTML = "🔍 <b>" + n + "</b> 条匹配";
      searchCountEl.classList.toggle("zero", n === 0);
    } else {
      searchCountEl.hidden = true;
      searchCountEl.classList.remove("zero");
    }
  }

  /* ---------- R9：我的行动清单（可勾选 + 进度 + localStorage） ---------- */
  var ACT_KEY = "techpulse-actions";
  function loadActions() {
    try { var v = localStorage.getItem(ACT_KEY); if (v) return JSON.parse(v) || {}; } catch (e) {}
    return {};
  }
  /* IMP-085：模块内缓存 actions，读取走缓存；写入后刷新缓存，避免每次 render 同步读写 localStorage */
  var actionsCache = loadActions();
  function saveActions(obj) { actionsCache = obj; try { localStorage.setItem(ACT_KEY, JSON.stringify(obj)); } catch (e) {} }
  function hasAction(id) { return !!actionsCache[id]; }
  function toggleAction(id) {
    var acts = actionsCache;
    if (acts[id]) delete acts[id]; else acts[id] = { done: false, ts: Date.now() };
    saveActions(acts);
    Array.prototype.forEach.call(document.querySelectorAll('.add-action[data-id="' + id + '"]'), function (b) {
      var on = !!acts[id];
      b.textContent = on ? "✓ 已在我的清单中" : "＋ 加入我的行动清单";
      b.classList.toggle("added", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderActionList();
    toast(acts[id] ? "已加入「我的行动清单」" : "已移出清单");
  }
  function renderActionList() {
    if (!actionListEl) return;
    var acts = actionsCache;
    var ids = Object.keys(acts);
    var done = ids.filter(function (id) { return acts[id] && acts[id].done; }).length;
    if (actionProgressEl) actionProgressEl.textContent = ids.length ? (done + "/" + ids.length + " 已完成") : "";
    if (!ids.length) {
      actionListEl.innerHTML = "";
      if (actionEmptyEl) actionEmptyEl.hidden = false;
      return;
    }
    if (actionEmptyEl) actionEmptyEl.hidden = true;
    actionListEl.innerHTML = "";
    ids.forEach(function (id) {
      var it = itemById[id];
      if (!it) return;
      var row = document.createElement("div");
      row.className = "action-item" + (acts[id].done ? " done" : "");
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.className = "action-cb"; cb.checked = !!acts[id].done;
      cb.setAttribute("aria-label", "标记完成：" + it.title);
      cb.addEventListener("change", function () {
        var a = actionsCache; if (!a[id]) a[id] = {}; a[id].done = cb.checked; saveActions(a);
        row.classList.toggle("done", cb.checked);
        renderActionList();
      });
      var label = document.createElement("span");
      label.className = "action-title"; label.textContent = it.title; label.tabIndex = 0;
      label.title = "点击查看「" + it.title + "」";
      label.addEventListener("click", function () { goToItem(it); });
      label.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToItem(it); } });
      var rm = document.createElement("button");
      rm.type = "button"; rm.className = "action-rm"; rm.textContent = "✕"; rm.title = "移除";
      rm.setAttribute("aria-label", "移除：" + it.title);
      rm.addEventListener("click", function () { toggleAction(id); });
      row.appendChild(cb); row.appendChild(label); row.appendChild(rm);
      actionListEl.appendChild(row);
    });
  }

  /* ---------- R7：影响力透视图表 + 本周速览 ---------- */
  /* IMP-086：图表仅依赖静态 NEWS_DATA，仅在 state.week/state.cat 变化时才重建，避免无谓的 Chart 销毁重建 */
  var lastChartWeek = null, lastChartCat = null;
  function avgImpact(cat, week) {
    var list = data.items.filter(function (it) { return it.category === cat && (week === "all" || it.week === week); });
    if (!list.length) return 0;
    var s = list.reduce(function (a, b) { return a + (b.impactScore || 0); }, 0);
    return Math.round(s / list.length);
  }
  function weekStats(week) {
    var list = data.items.filter(function (it) { return week === "all" || it.week === week; });
    return { count: list.length, avg: list.length ? Math.round(list.reduce(function (a, b) { return a + b.impactScore; }, 0) / list.length) : 0 };
  }
  function renderImpactChart() {
    var cv = document.getElementById("impactChart");
    var fb = document.getElementById("chartFallback");
    if (!cv) return;
    if (typeof window.Chart === "undefined") { cv.style.display = "none"; if (fb) fb.hidden = false; return; }
    var ctx = cv.getContext("2d");
    var ws = data.weeks, n = ws.length;
    var wA = ws[n - 1], wB = n > 1 ? ws[n - 2] : null;
    var aiA = avgImpact("ai", wA.id), techA = avgImpact("tech", wA.id);
    var aiB = wB ? avgImpact("ai", wB.id) : 0, techB = wB ? avgImpact("tech", wB.id) : 0;
    if (window.__impactChart) { try { window.__impactChart.destroy(); } catch (e) {} }
    try {
      var impactSets = wB ? [
        { label: "本周(" + wA.range + ")", data: [aiA, techA], backgroundColor: "#5b6cff", borderRadius: 6 },
        { label: "上周(" + wB.range + ")", data: [aiB, techB], backgroundColor: "#22d3ee", borderRadius: 6 }
      ] : [
        { label: "本周(" + wA.range + ")", data: [aiA, techA], backgroundColor: "#5b6cff", borderRadius: 6 }
      ];
      window.__impactChart = new window.Chart(ctx, {
        type: "bar",
        data: { labels: ["AI圈", "科技圈"], datasets: impactSets },
        options: { responsive: true, plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 11 } } } } }
      });
    } catch (e) { cv.style.display = "none"; if (fb) fb.hidden = false; }
  }
  function renderTrendChart() {
    var cv = document.getElementById("trendChart");
    if (!cv) return;
    if (typeof window.Chart === "undefined") { cv.style.display = "none"; return; }
    var ws = data.weeks;
    var aiSeries = ws.map(function (w) { return avgImpact("ai", w.id); });
    var techSeries = ws.map(function (w) { return avgImpact("tech", w.id); });
    var allSeries = ws.map(function (w) { return weekStats(w.id).avg; });
    var trendLabels = ws.map(function (w) { return w.range; });
    if (window.__trendChart) { try { window.__trendChart.destroy(); } catch (e) {} }
    try {
      var ctx = cv.getContext("2d");
      window.__trendChart = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: trendLabels,
          datasets: [
            { label: "AI圈", data: aiSeries, borderColor: "#6366f1", backgroundColor: "#6366f1", tension: 0.3, pointRadius: 4 },
            { label: "科技圈", data: techSeries, borderColor: "#0ea5a4", backgroundColor: "#0ea5a4", tension: 0.3, pointRadius: 4 },
            { label: "整体平均", data: allSeries, borderColor: "#9b5bff", backgroundColor: "#9b5bff", borderDash: [5, 4], tension: 0.3, pointRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: { y: { beginAtZero: true, max: 100, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } }
        }
      });
    } catch (e) { cv.style.display = "none"; }
  }
  function renderWeekOverview() {
    var el = document.getElementById("weekOverview");
    if (!el) return;
    var ws = data.weeks, n = ws.length;
    var wA = weekStats(ws[n - 1].id), wB = n > 1 ? weekStats(ws[n - 2].id) : { count: 0, avg: wA.avg };
    var top = FX ? FX.trending(data.items.filter(function (it) { return it.week === ws[n - 1].id; }), 1)[0] : null;
    var delta = wA.avg - wB.avg;
    var arrow = delta > 0 ? "▲" : (delta < 0 ? "▼" : "—");
    var sign = delta > 0 ? "+" : "";
    el.innerHTML =
      '<span class="wo-item">📅 本周 <b>' + wA.count + '</b> 条</span>' +
      '<span class="wo-item">🔥 平均影响力 <b>' + wA.avg + '</b> <i class="wo-delta ' + (delta > 0 ? "up" : (delta < 0 ? "down" : "")) + '">' + arrow + " " + sign + delta + '</i></span>' +
      (top ? '<span class="wo-item wo-top">🏆 本周头条《' + top.title + '》</span>' : "");
  }

  /* ---------- R15：资料库 / 索引视图 ---------- */
  function kbEl(id) { return document.getElementById(id); }
  function openKB() { state.view = "kb"; state.kbTab = "terms"; state.kbTerm = null; state.kbArch = null; render(); }
  function closeKB() { state.view = "feed"; render(); }

  /* ---------- R18：模型优惠圈（集中发布中转站与大模型平台优惠，超时自动下架） ---------- */
  function parseDate(s) { if (!s) return null; var d = new Date(s + "T00:00:00"); return isNaN(d.getTime()) ? null : d; }
  function dealStatus(d) {
    var now = new Date();
    var from = parseDate(d.validFrom), until = parseDate(d.validUntil);
    if (until && now > until) return { key: "ended", label: "已结束", days: -1 };
    if (from && now < from) { var du = Math.ceil((from - now) / 86400000); return { key: "upcoming", label: "即将开始", days: du }; }
    var days = until ? Math.ceil((until - now) / 86400000) : null;
    return { key: "active", label: "进行中", days: days };
  }
  function isDealExpired(d) { return dealStatus(d).key === "ended"; }
  function dealsMatch(d) {
    if (state.dealsType !== "all" && d.type !== state.dealsType) return false;
    if (state.dealsPlatform !== "all" && d.platformType !== state.dealsPlatform) return false;
    if (!state.dealsShowExpired && isDealExpired(d)) return false;
    if (state.dealsQ) {
      var q = state.dealsQ, hay = (d.title + " " + d.summary + " " + d.platform + " " + (d.tags || []).join(" ")).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  function filteredDeals() {
    var rank = { active: 0, upcoming: 1, ended: 2 };
    return (DEALS.deals || []).filter(dealsMatch).sort(function (a, b) {
      var ra = rank[dealStatus(a).key], rb = rank[dealStatus(b).key];
      if (ra !== rb) return ra - rb;
      return (b.valueScore || 0) - (a.valueScore || 0);
    });
  }
  function buildDealCard(d) {
    var st = dealStatus(d);
    var card = document.createElement("article");
    card.className = "deal-card deal-type-" + d.type;
    var typeLabel = { current: "当前优惠", new: "新上线", pricecut: "降价预告", value: "性价比推荐" }[d.type] || d.type;
    var platLabel = d.platformType === "relay" ? "中转站" : (d.platformType === "official" ? "官方直降" : d.platformType);
    var statusBadge = '<span class="badge deal-status ' + st.key + '">' +
      (st.key === "active" ? "✅ 进行中" : st.key === "upcoming" ? "⏳ 即将开始" : "⛔ 已结束") +
      (st.days > 0 ? " · 剩 " + st.days + " 天" : "") + '</span>';
    var priceHtml = d.price ? '<div class="deal-price">💰 ' + escapeHtml(d.price) + '</div>' : "";
    var validHtml = '<span class="deal-valid">📅 ' + escapeHtml(d.validFrom || "长期") + ' ~ ' + escapeHtml(d.validUntil || "长期") + '</span>';
    var scoreHtml = (d.type === "value" && d.valueScore) ? '<span class="badge heat">⭐ 性价比 ' + d.valueScore + '</span>' : "";
    var chips = (d.tags || []).map(function (t) { return '<span class="deal-tag">' + escapeHtml(t) + '</span>'; }).join("");
    card.innerHTML =
      '<div class="deal-top">' +
        '<span class="badge deal-platform ' + d.platformType + '">' + escapeHtml(platLabel) + '</span>' +
        '<span class="badge deal-type-badge">' + escapeHtml(typeLabel) + '</span>' +
        statusBadge +
      '</div>' +
      '<h2 class="deal-title">' + escapeHtml(d.title) + '</h2>' +
      '<p class="deal-summary">' + escapeHtml(d.summary) + '</p>' +
      priceHtml +
      '<div class="deal-meta">' +
        '<span class="badge">🏷️ ' + escapeHtml(d.platform) + '</span>' +
        scoreHtml +
        validHtml +
      '</div>' +
      '<div class="tag-chips">' + chips + '</div>' +
      '<div class="deal-actions">' +
        (d.sourceUrl ? '<button class="deal-src" type="button" data-url="' + escapeHtml(d.sourceUrl) + '">查看原文 →</button>' : '') +
        '<button class="deal-toggle" type="button" aria-expanded="false">展开详情</button>' +
      '</div>' +
      '<div class="deal-detail" hidden>' + escapeHtml(d.detail || "").replace(/\n+/g, "<br>") + '</div>';
    var toggle = card.querySelector(".deal-toggle");
    var detail = card.querySelector(".deal-detail");
    toggle.addEventListener("click", function () {
      var open = detail.hidden;
      detail.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "收起详情" : "展开详情";
    });
    return card;
  }
  function renderDeals() {
    var view = document.getElementById("dealsView");
    if (!view) return;
    view.hidden = false;
    var cnt = document.getElementById("dealsCount");
    var activeCount = (DEALS.deals || []).filter(function (d) { return !isDealExpired(d); }).length;
    if (cnt) cnt.textContent = activeCount;
    Array.prototype.forEach.call(view.querySelectorAll(".deals-type"), function (b) { b.classList.toggle("active", b.getAttribute("data-dtype") === state.dealsType); });
    Array.prototype.forEach.call(view.querySelectorAll(".deals-platform"), function (b) { b.classList.toggle("active", b.getAttribute("data-dplat") === state.dealsPlatform); });
    var list = filteredDeals();
    var content = document.getElementById("dealsContent");
    content.innerHTML = "";
    if (!list.length) {
      content.innerHTML = '<div class="empty"><div class="empty-icon">🎯</div><p class="empty-title">没有匹配的优惠</p><p class="empty-hint">换个类型或平台筛选，或清除搜索再试。</p></div>';
      return;
    }
    var grid = document.createElement("div");
    grid.className = "deals-grid";
    list.forEach(function (d, i) {
      var c = buildDealCard(d);
      c.style.animationDelay = (i * 0.03) + "s";
      grid.appendChild(c);
    });
    content.appendChild(grid);
  }
  function focusDeals() {
    var dv = document.getElementById("dealsView"); if (!dv) return;
    if (dv.scrollIntoView) dv.scrollIntoView({ behavior: "smooth", block: "start" });
    dv.classList.add("flash");
    setTimeout(function () { dv.classList.remove("flash"); }, 1600);
  }
  function backToFeedTop() { if (window.scrollTo) window.scrollTo({ top: 0, behavior: "smooth" }); }
  function openDeals() {
    state.dealsType = "all"; state.dealsPlatform = "all"; state.dealsShowExpired = false; state.dealsQ = "";
    var ds = document.getElementById("dealsSearch"); if (ds) ds.value = "";
    renderDeals();
    focusDeals();
  }
  function closeDeals() { backToFeedTop(); }
  function syncKbTabs() {
    var tabs = kbEl("kbTabs"); if (!tabs) return;
    Array.prototype.forEach.call(tabs.querySelectorAll(".kb-tab"), function (b) {
      b.classList.toggle("active", b.getAttribute("data-kbtab") === state.kbTab && state.view === "kb" && !state.kbQuery);
    });
  }
  function kbLib() {
    var html = '<div class="kb-lib-cats">';
    html += '<button class="kb-lib-cat' + (state.libCat === "all" ? " on" : "") + '" type="button" data-libcat="all">全部</button>';
    data.categories.forEach(function (c) { if (c.disabled) return; html += '<button class="kb-lib-cat' + (state.libCat === c.id ? " on" : "") + '" type="button" data-libcat="' + c.id + '">' + c.label + '</button>'; });
    html += '</div><div class="kb-news-list">';
    var list = data.items.filter(function (it) { return state.libCat === "all" || it.category === state.libCat; });
    list.forEach(function (it) {
      html += '<div class="kb-news" data-go="' + it.id + '" tabindex="0" role="button"><span class="kb-news-cat" style="background:' + catColor(it.category) + '">' + catLabel(it.category) + '</span><span class="kb-news-title">' + escapeHtml(it.title) + '</span><span class="kb-news-score">🔥' + it.impactScore + '</span></div>';
    });
    html += '</div>';
    return html;
  }
  function kbSearchResults(res, q) {
    var html = '<div class="kb-search-head">“' + escapeHtml(q) + '” 的检索结果</div>';
    if (!res.terms.length && !res.arch.length && !res.news.length) {
      html += '<p class="kb-empty">资料库中没有匹配 “' + escapeHtml(q) + '” 的内容。换个词试试（如 MoE、量子、架构、火箭）。</p>';
      return html;
    }
    if (res.terms.length) {
      html += '<div class="dim-kicker">名词（“' + escapeHtml(q) + '” 命中 ' + res.terms.length + '）</div><div class="kb-list">';
      res.terms.forEach(function (t) { html += '<button class="kb-term" type="button" data-term="' + escapeHtml(t) + '"><span class="kb-term-name">' + escapeHtml(t) + '</span><span class="kb-term-def">' + escapeHtml(GLOSSARY[t]) + '</span></button>'; });
      html += '</div>';
    }
    if (res.arch.length) {
      html += '<div class="dim-kicker">架构（“' + escapeHtml(q) + '” 命中 ' + res.arch.length + '）</div><div class="kb-list">';
      res.arch.forEach(function (a) { html += '<button class="kb-arch" type="button" data-arch="' + escapeHtml(a.itemId) + '"><span class="kb-arch-name">' + escapeHtml(a.name) + '</span><span class="kb-arch-sub">' + escapeHtml(a.caption) + '</span></button>'; });
      html += '</div>';
    }
    if (res.news.length) {
      html += '<div class="dim-kicker">新闻（“' + escapeHtml(q) + '” 命中 ' + res.news.length + '）</div><div class="kb-news-list">';
      res.news.forEach(function (it) { html += '<div class="kb-news" data-go="' + it.id + '" tabindex="0" role="button"><span class="kb-news-cat" style="background:' + catColor(it.category) + '">' + catLabel(it.category) + '</span><span class="kb-news-title">' + escapeHtml(it.title) + '</span><span class="kb-news-score">🔥' + it.impactScore + '</span></div>'; });
      html += '</div>';
    }
    return html;
  }
  function renderKBTerm() {
    var t = state.kbTerm, def = GLOSSARY[t];
    if (!def) { state.view = "kb"; return renderKB(); }
    var archs = archForTerm(t), news = newsForTerm(t);
    var html = '<button class="kb-back" type="button" data-back="1">← 返回索引</button><div class="kb-detail">';
    html += '<div class="dim-kicker">名词释义</div><h2 class="kb-detail-title">' + escapeHtml(t) + '</h2><p class="kb-def">' + escapeHtml(def) + '</p>';
    if (archs.length) {
      html += '<div class="dim-kicker">架构含义（' + archs.length + '）</div>';
      archs.forEach(function (a) { html += '<figure class="arch-fig">' + a.svg + '<figcaption class="arch-cap">' + escapeHtml(a.caption) + '</figcaption></figure><p class="kb-arch-ref">▲ 出自《' + escapeHtml(a.title) + '》</p>'; });
    }
    if (news.length) {
      html += '<div class="dim-kicker">关联新闻（' + news.length + ' 条）</div><div class="kb-news-list">';
      news.forEach(function (it) { html += '<div class="kb-news" data-go="' + it.id + '" tabindex="0" role="button"><span class="kb-news-cat" style="background:' + catColor(it.category) + '">' + catLabel(it.category) + '</span><span class="kb-news-title">' + escapeHtml(it.title) + '</span><span class="kb-news-score">🔥' + it.impactScore + '</span></div>'; });
      html += '</div>';
    }
    html += '</div>';
    kbEl("kbContent").innerHTML = html;
  }
  function renderKBArch() {
    var a = ARCH_IDX[state.kbArch];
    if (!a) { state.view = "kb"; return renderKB(); }
    var item = itemById[a.itemId];
    var rel = item ? FX.recommend(item.id, data.items, 5) : [];
    var all = [item].concat(rel).filter(Boolean);
    var html = '<button class="kb-back" type="button" data-back="1">← 返回索引</button><div class="kb-detail">';
    html += '<div class="dim-kicker">架构索引</div><h2 class="kb-detail-title">' + escapeHtml(a.name) + '</h2><p class="kb-arch-src">出自《' + escapeHtml(a.title) + '》</p>';
    html += '<figure class="arch-fig">' + a.svg + '<figcaption class="arch-cap">' + escapeHtml(a.caption) + '</figcaption></figure>';
    if (a.terms.length) {
      html += '<div class="dim-kicker">涉及名词</div><div class="kb-terms">';
      a.terms.forEach(function (t) { html += '<button class="kb-term-pill" type="button" data-term="' + escapeHtml(t) + '">' + escapeHtml(t) + '</button>'; });
      html += '</div>';
    }
    if (all.length) {
      html += '<div class="dim-kicker">关联新闻（' + all.length + ' 条）</div><div class="kb-news-list">';
      all.forEach(function (it) { html += '<div class="kb-news" data-go="' + it.id + '" tabindex="0" role="button"><span class="kb-news-cat" style="background:' + catColor(it.category) + '">' + catLabel(it.category) + '</span><span class="kb-news-title">' + escapeHtml(it.title) + '</span><span class="kb-news-score">🔥' + it.impactScore + '</span></div>'; });
      html += '</div>';
    }
    html += '</div>';
    kbEl("kbContent").innerHTML = html;
  }
  function renderKB() {
    var kb = kbEl("kbView"); if (!kb) return;
    kb.hidden = false;
    var lw = latestWeekId();
    var wkEl = kbEl("kbWeek");
    if (wkEl) wkEl.textContent = weekLabel(lw) + (lw ? "（" + (data.weeks.filter(function (w) { return w.id === lw; })[0] || {}).range + "）" : "");
    if (state.view === "kbTerm") return renderKBTerm();
    if (state.view === "kbArch") return renderKBArch();
    var q = state.kbQuery, html = "";
    syncKbTabs();
    if (q) { html = kbSearchResults(kbSearch(q), q); }
    else if (state.kbTab === "terms") {
      html += '<div class="kb-list">';
      Object.keys(GLOSSARY).forEach(function (t) { html += '<button class="kb-term" type="button" data-term="' + escapeHtml(t) + '"><span class="kb-term-name">' + escapeHtml(t) + '</span><span class="kb-term-def">' + escapeHtml(GLOSSARY[t]) + '</span></button>'; });
      html += '</div>';
    } else if (state.kbTab === "arch") {
      html += '<div class="kb-list">';
      Object.keys(ARCH_IDX).forEach(function (k) { var a = ARCH_IDX[k]; html += '<button class="kb-arch" type="button" data-arch="' + escapeHtml(a.itemId) + '"><span class="kb-arch-name">' + escapeHtml(a.name) + '</span><span class="kb-arch-sub">' + escapeHtml(a.caption) + '</span></button>'; });
      html += '</div>';
    } else { html = kbLib(); }
    kbEl("kbContent").innerHTML = html;
  }

  function render() {
    if (state.view === "kb" || state.view === "kbTerm" || state.view === "kbArch") {
      document.body.classList.add("kb-open");
      renderKB();
      document.title = "科技前瞻 · 资料库";
      return;
    }
    document.body.classList.remove("kb-open");
    kbEl("kbView").hidden = true;
    // 模型优惠圈与 AI 资讯同页常驻（不再整页切换），默认可见
    var dv = document.getElementById("dealsView"); if (dv) dv.hidden = false;
    /* IMP-088：render() 开头计算一次 filtered()，供各子渲染函数复用，避免重复全量 filter */
    var list = filtered();
    renderCats();
    renderTagBar();
    renderSidebar();
    renderToolbar(list);
    renderFeed(list);
    if (state.week !== lastChartWeek || state.cat !== lastChartCat) {
      renderImpactChart();
      renderTrendChart();
      lastChartWeek = state.week;
      lastChartCat = state.cat;
    }
    renderWeekOverview();
    renderSearchCount(list);
    renderActionList();
    renderDeals();
    document.title = "科技前瞻 · " + catLabel(state.cat) + " · " + weekLabel(state.week);
  }

  /* ---------- 暗色持久化 ---------- */
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("techpulse-theme"); } catch (e) {}
  var initTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  document.documentElement.setAttribute("data-theme", initTheme);
  themeToggle.textContent = initTheme === "dark" ? "☀️ 浅色" : "🌙 暗色";
  themeToggle.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    themeToggle.textContent = next === "dark" ? "☀️ 浅色" : "🌙 暗色";
    try { localStorage.setItem("techpulse-theme", next); } catch (e) {}
  });

  /* ---------- 搜索 ---------- */
  searchInput.addEventListener("input", debounce(function () { state.q = (searchInput.value || "").trim().toLowerCase(); render(); }, 200));

  /* ---------- 排序 ---------- */
  sortBtns.forEach(function (b) { b.addEventListener("click", function () { state.sort = b.getAttribute("data-sort"); render(); }); });

  /* ---------- 标签 chip 点击（全局委托：标签栏/卡片/Hero） ---------- */
  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".tag-chip");
    if (chip) {
      var t = chip.getAttribute("data-tag");
      var idx = state.activeTags.indexOf(t);
      if (idx >= 0) state.activeTags.splice(idx, 1); else state.activeTags.push(t);
      render();
      return;
    }
    var go = e.target.closest("[data-go]");
    if (go) {
      var id = go.getAttribute("data-go");
      var it = itemById[id];
      if (it) goToItem(it);
    }
  });

  /* ---------- R14：术语弹层（点击/聚焦查看释义，外部点击/Esc 关闭） ---------- */
  var glossPop = null;
  function ensureGlossPop() {
    if (glossPop) return glossPop;
    glossPop = document.createElement("div");
    glossPop.id = "glossPop";
    glossPop.setAttribute("role", "tooltip");
    glossPop.hidden = true;
    document.body.appendChild(glossPop);
    return glossPop;
  }
  function showGloss(termEl) {
    var t = termEl.getAttribute("data-term");
    var def = GLOSSARY[t];
    if (!def) return;
    var pop = ensureGlossPop();
    pop.innerHTML = '<div class="gp-term">' + escapeHtml(t) + '</div><div class="gp-def">' + escapeHtml(def) + '</div><a class="gp-more" href="javascript:void(0)" data-term="' + escapeHtml(t) + '" role="button">在资料库查看 →</a>';
    pop.hidden = false;
    var r = termEl.getBoundingClientRect();
    var pw = pop.offsetWidth || 300, ph = pop.offsetHeight || 80;
    var top = (r.bottom || 0) + 8;
    var left = (r.left || 0);
    var vw = window.innerWidth || document.documentElement.clientWidth || 1024;
    if (left + pw > vw - 8) left = Math.max(8, vw - pw - 8);
    if (top + ph > (window.innerHeight || 768) - 8) top = Math.max(8, (r.top || 0) - ph - 8);
    pop.style.top = top + "px";
    pop.style.left = left + "px";
  }
  function hideGloss() { if (glossPop) glossPop.hidden = true; }
  document.addEventListener("click", function (e) {
    var term = e.target.closest && e.target.closest(".term");
    if (term) { showGloss(term); return; }
    if (glossPop && !glossPop.hidden && !(e.target.closest && e.target.closest("#glossPop"))) hideGloss();
  });
  document.addEventListener("focusin", function (e) {
    var term = e.target.closest && e.target.closest(".term");
    if (term) showGloss(term);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") hideGloss(); });

  /* ---------- R15：资料库导航委托 ---------- */
  document.addEventListener("click", function (e) {
    var more = e.target.closest && e.target.closest(".gp-more");
    if (more) { var t = more.getAttribute("data-term"); if (t) { state.kbTerm = t; state.view = "kbTerm"; hideGloss(); render(); } return; }
    var term = e.target.closest && e.target.closest(".kb-term, .kb-term-pill");
    if (term) { var tt = term.getAttribute("data-term"); if (tt) { state.kbTerm = tt; state.view = "kbTerm"; render(); } return; }
    var arch = e.target.closest && e.target.closest(".kb-arch");
    if (arch) { var ai = arch.getAttribute("data-arch"); if (ai) { state.kbArch = ai; state.view = "kbArch"; render(); } return; }
    var back = e.target.closest && e.target.closest(".kb-back");
    if (back) { state.view = "kb"; state.kbTerm = null; state.kbArch = null; render(); return; }
    var libcat = e.target.closest && e.target.closest(".kb-lib-cat");
    if (libcat) { state.libCat = libcat.getAttribute("data-libcat"); state.kbTab = "lib"; render(); return; }
    var kt = e.target.closest && e.target.closest(".kb-tab");
    if (kt) { state.kbTab = kt.getAttribute("data-kbtab"); state.view = "kb"; state.kbQuery = ""; var kq = kbEl("kbSearch"); if (kq) kq.value = ""; render(); return; }
    var feed = e.target.closest && e.target.closest("[data-feed]");
    if (feed) { closeKB(); return; }
    var top = e.target.closest && e.target.closest("[data-top]");
    if (top) { backToFeedTop(); return; }
  });
  var kbBtn = document.getElementById("kbBtn");
  if (kbBtn) kbBtn.addEventListener("click", openKB);
  var kbSearchInput = document.getElementById("kbSearch");
  if (kbSearchInput) kbSearchInput.addEventListener("input", debounce(function () { state.kbQuery = kbSearchInput.value.trim(); render(); }, 200));

  /* ---------- R18：优惠圈 导航委托与控件 ---------- */
  document.addEventListener("click", function (e) {
    var dt = e.target.closest && e.target.closest(".deals-type");
    if (dt) { state.dealsType = dt.getAttribute("data-dtype"); render(); return; }
    var dp = e.target.closest && e.target.closest(".deals-platform");
    if (dp) { state.dealsPlatform = dp.getAttribute("data-dplat"); render(); return; }
    var src = e.target.closest && e.target.closest(".deal-src");
    if (src) { var u = src.getAttribute("data-url"); if (u) { try { window.open(u, "_blank", "noopener"); } catch (e2) {} } return; }
  });
  var dealsBtn = document.getElementById("dealsBtn");
  if (dealsBtn) dealsBtn.addEventListener("click", openDeals);
  var dealsSearchInput = document.getElementById("dealsSearch");
  if (dealsSearchInput) dealsSearchInput.addEventListener("input", debounce(function () { state.dealsQ = dealsSearchInput.value.trim().toLowerCase(); render(); }, 200));
  var dealsShowExpired = document.getElementById("dealsShowExpired");
  if (dealsShowExpired) dealsShowExpired.addEventListener("change", function () { state.dealsShowExpired = dealsShowExpired.checked; render(); });

  /* ---------- toast ---------- */
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2800);
  }



  /* ---------- 导出周报 ---------- */
  function exportMarkdown() {
    var list = filtered();
    if (!list.length) { toast("当前筛选无内容，无法导出"); return; }
    var L = [];
    L.push("# 科技前瞻 TechPulse · 周报导出");
    L.push("");
    L.push("> 分类：" + catLabel(state.cat) + " ｜ 周次：" + weekLabel(state.week) +
      (state.q ? " ｜ 关键词：" + state.q : "") + (state.activeTags.length ? " ｜ 标签：" + state.activeTags.join("/") : ""));
    L.push("> 导出时间：" + new Date().toLocaleString("zh-CN"));
    L.push("");
    list.forEach(function (it, i) {
      L.push("## " + (i + 1) + ". " + it.title + "（影响力 " + it.impactScore + "）");
      L.push("");
      L.push("**摘要**：" + it.summary);
      DIM.forEach(function (d) { L.push("**" + d[1] + "**：" + it[d[0]]); });
      L.push("**引用来源**：");
      it.sources.forEach(function (s) { L.push("- [" + s.name + "](" + s.url + ")"); });
      L.push(""); L.push("---"); L.push("");
    });
    var blob = new Blob([L.join("\n")], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "techpulse-" + state.cat + "-" + state.week + ".md";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("已导出 " + list.length + " 条周报 · " + a.download);
  }
  exportBtn.addEventListener("click", exportMarkdown);

  /* ---------- 订阅（本地） ---------- */
  var NL_KEY = "techpulse-nl";
  function initNewsletter() {
    var saved = null;
    try { saved = localStorage.getItem(NL_KEY); } catch (e) {}
    if (saved) { nlEmail.value = saved; nlStatus.textContent = "✅ 你已订阅，每周准时送达"; }
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = (nlEmail.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { nlStatus.textContent = "请输入有效的邮箱地址"; return; }
      try { localStorage.setItem(NL_KEY, v); } catch (e) {}
      nlStatus.textContent = "✅ 已订阅，每周准时送达（演示：本地保存）";
      toast("订阅成功 · " + v);
    });
  }
  initNewsletter();

  /* ---------- 回到顶部 ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) toTop.classList.add("show"); else toTop.classList.remove("show");
    });
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- R16：右侧 LLM 学习助手（Bring-Your-Own-Key · 本地密钥 · 检索增强） ----------
     设计三支柱：
     (1) 回答问题 + 索引操作：search_news / lookup_term / lookup_architecture / open_article / save_note 五类工具，
         结果以卡片呈现并可一键跳正文/资料库——把“找文章”做成对话式索引。
     (2) 自定义配置：兼容格式(baseURL+模型+预设) / 可交互性 / 可确认+可索引到模型 / 安全机制。
     (3) 安全机制：密钥仅存本机 localStorage，永不发往本站服务器；记忆与密钥分离，记忆可持久保存。
     独特性：零后端、密钥本地化、基于本站“有来源·可溯源”知识库的检索增强(不会瞎编当前事件)。 */
  (function initAgent() {
    var CFG_KEY = "techpulse-agent";
    var MEM_KEY = "techpulse-agent-mem";
    var DEFAULT_CFG = { baseURL: "", apiKey: "", model: "", provider: "", interactive: true, confirmTools: true, stream: false, enabled: false };
    function loadCfg() { try { return Object.assign({}, DEFAULT_CFG, JSON.parse(localStorage.getItem(CFG_KEY) || "{}")); } catch (e) { return Object.assign({}, DEFAULT_CFG); } }
    function saveCfg(c) { try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch (e) {} }
    function loadMem() { try { var v = JSON.parse(localStorage.getItem(MEM_KEY) || "{}"); return { messages: v.messages || [], notes: v.notes || [] }; } catch (e) { return { messages: [], notes: [] }; } }
    function saveMem(m) { try { localStorage.setItem(MEM_KEY, JSON.stringify(m)); } catch (e) {} }
    var cfg = loadCfg();
    var mem = loadMem();

    var SUGGESTIONS = [
      "本周最值得读的是哪条？",
      "帮我解释一下 MoE 是什么",
      "找量子计算相关的新闻",
      "端云协同的架构是怎样的？",
      "把“重点关注 AI 监管”记到我的记忆里"
    ];
    var SYSTEM_PROMPT = "你是由「科技前瞻 TechPulse」驱动的学习型 AI 助手，服务于一个非盈利公益科普的科技资讯站。你可以：(1) 解答 AI 与科技领域问题；(2) 通过资料库索引帮用户查找文章。\n" +
      "规则：\n" +
      "• 优先用工具从本站资料库取真实、可溯源的内容来回答，不要编造本站没有的新闻或数据。\n" +
      "• 检索/查询结果会以卡片展示给用户，你只需在文字里简述要点并提及文章标题即可，无需重复罗列全文。\n" +
      "• 语气权威、严谨、专业但不浮夸；必要时引用术语（用户点术语可看释义）。\n" +
      "• 若用户只是闲聊或一般性问题，可直接回答，不必调用工具。";

    var TOOLS = [
      { type: "function", function: { name: "search_news", description: "在「科技前瞻」资料库中检索新闻文章，返回匹配的标题、分类、影响力、摘要与文章ID。当用户想找某主题的新闻、最新进展或具体文章时使用。", parameters: { type: "object", properties: { query: { type: "string", description: "检索关键词，如『量子』『火箭』『端侧AI』" }, limit: { type: "integer", description: "返回条数，默认5" } }, required: ["query"] } } },
      { type: "function", function: { name: "lookup_term", description: "查询某个专业术语的权威释义，并返回其关联的架构与新闻。当用户问某个概念/名词是什么意思时使用。", parameters: { type: "object", properties: { term: { type: "string", description: "术语，如『MoE』『端云协同』『量子比特』" } }, required: ["term"] } } },
      { type: "function", function: { name: "lookup_architecture", description: "查询某个架构索引的含义、涉及名词与关联新闻。", parameters: { type: "object", properties: { query: { type: "string", description: "架构名称或关键词，如『MoE』『火箭堆栈』" } }, required: ["query"] } } },
      { type: "function", function: { name: "open_article", description: "打开/跳转到某篇新闻文章的详情页（会触发页面导航）。用于用户明确想看某篇文章全文时。", parameters: { type: "object", properties: { id: { type: "string", description: "文章ID，来自检索结果" } }, required: ["id"] } } },
      { type: "function", function: { name: "save_note", description: "把用户的偏好、要点或待办保存为长期记忆（仅存于本机浏览器，下次对话仍可用）。", parameters: { type: "object", properties: { text: { type: "string", description: "要保存的内容" } }, required: ["text"] } } },
      { type: "function", function: { name: "lookup_deal", description: "查询「模型优惠圈」中的优惠资讯（中转站/官方直降/性价比推荐），可按关键词、平台或类型筛选。当用户问哪家中转站或大模型平台有优惠、性价比推荐、降价预告时使用。", parameters: { type: "object", properties: { query: { type: "string", description: "关键词，如『硅基流动』『降价』『性价比』" }, platform: { type: "string", description: "平台名或类型，如『硅基流动』『relay』『official』" }, type: { type: "string", description: "优惠类型：current(进行中)/new(新上线)/pricecut(降价预告)/value(性价比推荐)" } }, required: [] } } }
    ];

    /* ---- DOM ---- */
    var agentBtn = document.getElementById("agentBtn");
    var agentPanel = document.getElementById("agentPanel");
    var agentOverlay = document.getElementById("agentOverlay");
    var agentCloseBtn = document.getElementById("agentCloseBtn");
    var agentSettingsBtn = document.getElementById("agentSettingsBtn");
    var agentMsgs = document.getElementById("agentMsgs");
    var agentSuggest = document.getElementById("agentSuggest");
    var agentForm = document.getElementById("agentForm");
    var agentInput = document.getElementById("agentInput");
    var agentSend = document.getElementById("agentSend");
    var agentSettings = document.getElementById("agentSettings");
    var agentSettingsClose = document.getElementById("agentSettingsClose");
    var agentProvider = document.getElementById("agentProvider");
    var agentBaseURL = document.getElementById("agentBaseURL");
    var agentModel = document.getElementById("agentModel");
    var agentKey = document.getElementById("agentKey");
    var agentInteractive = document.getElementById("agentInteractive");
    var agentConfirm = document.getElementById("agentConfirm");
    var agentStream = document.getElementById("agentStream");
    var agentSave = document.getElementById("agentSave");
    var agentClearKey = document.getElementById("agentClearKey");
    var agentClearMem = document.getElementById("agentClearMem");
    var agentSettingsStatus = document.getElementById("agentSettingsStatus");

    function scrollAgentBottom() { try { agentMsgs.scrollTop = agentMsgs.scrollHeight; } catch (e) {} }
    function renderText(s) { return escapeHtml(s == null ? "" : String(s)).replace(/\n+/g, "<br>"); }
    function autoGrow() { try { agentInput.style.height = "auto"; agentInput.style.height = Math.min(agentInput.scrollHeight, 140) + "px"; } catch (e) {} }

    /* ---- 资料库工具实现（检索增强的数据源） ---- */
    function agentSearchNews(q, limit) {
      q = (q || "").trim().toLowerCase(); if (!q) return [];
      var list = data.items.filter(function (it) {
        var hay = [it.title, it.summary, it.what, it.compare, it.why, it.output, it.explain, it.impact, it.action, it.tags.join(" ")].join(" ").toLowerCase();
        return hay.indexOf(q) >= 0;
      }).sort(function (a, b) { return b.impactScore - a.impactScore; }).slice(0, limit || 5);
      return list.map(function (it) { return { id: it.id, title: it.title, category: catLabel(it.category), week: weekLabel(it.week), impactScore: it.impactScore, summary: it.summary, sources: it.sources.length }; });
    }
    function agentLookupTerm(t) {
      t = (t || "").trim(); if (!t) return { found: false };
      var key = Object.keys(GLOSSARY).filter(function (k) { return k.toLowerCase() === t.toLowerCase(); })[0];
      if (!key) key = Object.keys(GLOSSARY).filter(function (k) { return k.toLowerCase().indexOf(t.toLowerCase()) >= 0 || t.toLowerCase().indexOf(k.toLowerCase()) >= 0; })[0];
      if (!key) return { found: false, tried: t };
      return {
        found: true, term: key, def: GLOSSARY[key],
        archs: archForTerm(key).map(function (a) { return { id: a.itemId, name: a.name }; }),
        news: newsForTerm(key).map(function (it) { return { id: it.id, title: it.title }; })
      };
    }
    function agentLookupArch(q) {
      q = (q || "").trim().toLowerCase(); if (!q) return [];
      return Object.keys(ARCH_IDX).filter(function (k) {
        var a = ARCH_IDX[k];
        return a.name.toLowerCase().indexOf(q) >= 0 || a.caption.toLowerCase().indexOf(q) >= 0 || a.title.toLowerCase().indexOf(q) >= 0;
      }).map(function (k) { var a = ARCH_IDX[k]; return { id: a.itemId, name: a.name, caption: a.caption }; });
    }
    function agentLookupDeal(q) {
      q = q || {};
      var kw = (q.query || "").trim().toLowerCase();
      var plat = (q.platform || "").trim().toLowerCase();
      var typ = (q.type || "").trim().toLowerCase();
      var list = (DEALS.deals || []).filter(function (d) {
        if (typ && d.type !== typ) return false;
        if (plat && d.platformType !== plat && (d.platform || "").toLowerCase().indexOf(plat) < 0) return false;
        if (kw) {
          var hay = [d.title, d.summary, (d.platform || ""), (d.tags || []).join(" ")].join(" ").toLowerCase();
          if (hay.indexOf(kw) < 0) return false;
        }
        return true;
      });
      list.sort(function (a, b) { return (isDealExpired(a) ? 1 : 0) - (isDealExpired(b) ? 1 : 0) || (b.valueScore || 0) - (a.valueScore || 0); });
      return list.slice(0, 6).map(function (d) {
        var st = dealStatus(d);
        return { id: d.id, title: d.title, platform: d.platform, type: d.type, status: st.label, valueScore: d.valueScore, summary: d.summary, price: d.price };
      });
    }
    function execTool(name, args) {
      if (name === "search_news") {
        var items = agentSearchNews(args.query, args.limit || 5);
        var cards = items.map(function (it) { return { kind: "新闻 · " + it.category, title: it.title, sub: "🔥" + it.impactScore + " · " + it.week + " · " + it.sources + "来源", go: { type: "article", id: it.id } }; });
        return { label: "检索新闻：" + (args.query || ""), text: "找到 " + items.length + " 条", result: { query: args.query, count: items.length, items: items }, cards: cards };
      }
      if (name === "lookup_term") {
        var r = agentLookupTerm(args.term);
        if (!r.found) return { label: "查询术语：" + (args.term || ""), text: "资料库未收录该术语", result: r, cards: [] };
        var tcards = r.news.map(function (n) { return { kind: "关联新闻", title: n.title, sub: "", go: { type: "article", id: n.id } }; });
        var acards = r.archs.map(function (a) { return { kind: "架构", title: a.name, sub: "", go: { type: "arch", id: a.id } }; });
        return { label: "查询术语：" + r.term, text: r.def.slice(0, 64) + (r.def.length > 64 ? "…" : ""), result: r, cards: tcards.concat(acards) };
      }
      if (name === "lookup_architecture") {
        var a2 = agentLookupArch(args.query);
        var ac = a2.map(function (a) { return { kind: "架构", title: a.name, sub: a.caption, go: { type: "arch", id: a.id } }; });
        return { label: "查询架构：" + (args.query || ""), text: "找到 " + a2.length + " 个架构", result: { query: args.query, count: a2.length, archs: a2 }, cards: ac };
      }
      if (name === "open_article") {
        var it2 = itemById[args.id];
        if (!it2) return { label: "打开文章：" + (args.id || ""), text: "未找到该文章", result: { error: "not found" }, cards: [] };
        goToItem(it2);
        return { label: "打开文章：" + it2.title, text: "已为你打开《" + it2.title + "》", result: { id: it2.id, title: it2.title }, cards: [] };
      }
      if (name === "save_note") {
        mem.notes.push({ text: args.text, ts: Date.now() });
        saveMem(mem);
        return { label: "保存记忆", text: "已保存：" + (args.text || "").slice(0, 40), result: { saved: true }, cards: [] };
      }
      if (name === "lookup_deal") {
        var dl = agentLookupDeal(args);
        var dcards = dl.map(function (d) {
          return { kind: "优惠 · " + (d.platform || "") + " · " + d.status, title: d.title, sub: (d.price ? "💰" + d.price + " · " : "") + "★性价比" + (d.valueScore || "-"), go: { type: "deal", id: d.id } };
        });
        return { label: "查询优惠", text: "找到 " + dl.length + " 条", result: { count: dl.length, deals: dl }, cards: dcards };
      }
      return { label: name, text: "未知工具", result: {}, cards: [] };
    }

    /* ---- 模型调用（兼容 OpenAI /v1，支持流式） ---- */
    function callModel(messages) {
      var url = (cfg.baseURL.replace(/\/+$/, "")) + "/chat/completions";
      var body = { model: cfg.model, messages: messages };
      if (cfg.interactive) body.tools = TOOLS;
      if (cfg.stream) body.stream = true;
      return fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.apiKey }, body: JSON.stringify(body) })
        .then(function (res) {
          if (!res.ok) return res.text().then(function (t) { throw new Error("HTTP " + res.status + " " + t.slice(0, 200)); });
          if (cfg.stream && res.body && typeof res.body.getReader === "function") return parseStream(res);
          return res.json().then(function (j) {
            var m = j.choices && j.choices[0] && j.choices[0].message;
            var raw = (m && m.tool_calls) || [];
            var toolCalls = raw.map(function (tc) { return { id: tc.id, name: tc.function && tc.function.name, arguments: tc.function && tc.function.arguments }; });
            return { content: (m && m.content) || "", toolCalls: toolCalls };
          });
        });
    }
    function parseStream(res) {
      return new Promise(function (resolve, reject) {
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = "", content = "", acc = {};
        function step() {
          reader.read().then(function (r) {
            if (r.done) {
              var toolCalls = Object.keys(acc).map(function (i) { var t = acc[i]; var a = {}; try { a = JSON.parse(t.args || "{}"); } catch (e) {} return { id: "call_" + i, name: t.name, arguments: a }; });
              resolve({ content: content, toolCalls: toolCalls });
              return;
            }
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split("\n"); buf = lines.pop();
            lines.forEach(function (line) {
              line = line.trim();
              if (line.indexOf("data:") !== 0) return;
              var data = line.slice(5).trim();
              if (data === "[DONE]") return;
              try {
                var j = JSON.parse(data), d = j.choices && j.choices[0] && j.choices[0].delta;
                if (!d) return;
                if (d.content) content += d.content;
                if (d.tool_calls) d.tool_calls.forEach(function (tc) {
                  var i = tc.index || 0; if (!acc[i]) acc[i] = { name: "", args: "" };
                  if (tc.function && tc.function.name) acc[i].name = tc.function.name;
                  if (tc.function && tc.function.arguments) acc[i].args += tc.function.arguments;
                });
              } catch (e) {}
            });
            step();
          }, reject);
        }
        step();
      });
    }

    /* ---- 渲染 ---- */
    function addMsg(role, html) {
      var m = document.createElement("div");
      m.className = "agent-msg " + (role === "user" ? "me" : "bot");
      m.innerHTML = '<div class="bubble">' + html + "</div>";
      agentMsgs.appendChild(m); scrollAgentBottom();
    }
    function addToolCard(out) {
      var c = document.createElement("div");
      c.className = "agent-tool";
      c.innerHTML = '<span class="agent-tool-ico">🔧</span><span class="agent-tool-label">' + escapeHtml(out.label) + '</span><span class="agent-tool-text">' + escapeHtml(out.text || "") + "</span>";
      agentMsgs.appendChild(c); scrollAgentBottom();
    }
    function addResultCards(cards) {
      if (!cards || !cards.length) return;
      var wrap = document.createElement("div");
      wrap.className = "agent-cards";
      cards.forEach(function (c) {
        var el = document.createElement("div");
        el.className = "agent-card";
        el.innerHTML = '<div class="agent-card-kind">' + escapeHtml(c.kind) + '</div><div class="agent-card-title">' + escapeHtml(c.title) + '</div>' +
          (c.sub ? '<div class="agent-card-sub">' + escapeHtml(c.sub) + '</div>' : '') + '<button class="agent-card-go" type="button">查看 →</button>';
        el.querySelector(".agent-card-go").addEventListener("click", function () { agentNav(c.go); });
        wrap.appendChild(el);
      });
      agentMsgs.appendChild(wrap); scrollAgentBottom();
    }
    function agentNav(go) {
      if (!go) return;
      if (go.type === "article") { var it = itemById[go.id]; if (it) goToItem(it); }
      else if (go.type === "arch") { state.kbArch = go.id; state.view = "kbArch"; render(); }
      else if (go.type === "term") { state.kbTerm = go.term; state.view = "kbTerm"; render(); }
      else if (go.type === "deal") { if (state.view !== "feed") { state.view = "feed"; render(); } focusDeals(); }
    }
    function showTyping() { hideTyping(); var t = document.createElement("div"); t.className = "agent-typing"; t.id = "agentTyping"; t.innerHTML = "<span></span><span></span><span></span>"; agentMsgs.appendChild(t); scrollAgentBottom(); }
    function hideTyping() { var t = document.getElementById("agentTyping"); if (t && t.parentNode) t.parentNode.removeChild(t); }
    function showConfirm(name, args, cb) {
      var label = confirmLabel(name, args);
      var card = document.createElement("div");
      card.className = "agent-confirm";
      card.innerHTML = '<div class="agent-confirm-label">⚠️ 助手请求执行：' + escapeHtml(label) + '</div><div class="agent-confirm-actions"><button class="agent-confirm-yes" type="button">允许</button><button class="agent-confirm-no" type="button">拒绝</button></div>';
      card.querySelector(".agent-confirm-yes").addEventListener("click", function () { if (card.parentNode) card.parentNode.removeChild(card); cb(true); });
      card.querySelector(".agent-confirm-no").addEventListener("click", function () { if (card.parentNode) card.parentNode.removeChild(card); cb(false); });
      agentMsgs.appendChild(card); scrollAgentBottom();
    }
    function confirmLabel(name, args) {
      if (name === "search_news") return "检索新闻「" + (args.query || "") + "」";
      if (name === "lookup_term") return "查询术语「" + (args.term || "") + "」";
      if (name === "lookup_architecture") return "查询架构「" + (args.query || "") + "」";
      if (name === "open_article") { var it = itemById[args.id]; return "打开文章《" + (it ? it.title : args.id) + "》"; }
      if (name === "save_note") return "保存记忆「" + (args.text || "").slice(0, 30) + "」";
      if (name === "lookup_deal") return "查询优惠「" + (args.query || args.platform || args.type || "") + "」";
      return name;
    }
    function hideSuggest() { agentSuggest.innerHTML = ""; }

    /* ---- 对话主循环 ---- */
    function trimMem() { if (mem.messages.length > 16) mem.messages = mem.messages.slice(mem.messages.length - 16); }
    function buildMessages() {
      var msgs = [{ role: "system", content: SYSTEM_PROMPT }];
      if (mem.notes.length) msgs.push({ role: "system", content: "用户已保存的笔记：\n" + mem.notes.map(function (n) { return "• " + n.text; }).join("\n") });
      mem.messages.forEach(function (m) { msgs.push(m); });
      return msgs;
    }
    function sendMessage(text) {
      if (!cfg.enabled) { openSettings(); return; }
      var t = (text || "").trim(); if (!t) return;
      addMsg("user", renderText(t));
      agentInput.value = ""; autoGrow();
      mem.messages.push({ role: "user", content: t, ts: Date.now() });
      trimMem(); saveMem(mem); hideSuggest();
      runLoop(0);
    }
    function handleTool(tc) {
      var name = tc.name, args = {};
      try { args = JSON.parse(typeof tc.arguments === "string" ? tc.arguments : JSON.stringify(tc.arguments || {})); } catch (e) {}
      var needConfirm = (name === "open_article") || cfg.confirmTools;
      if (needConfirm) {
        return new Promise(function (resolve) {
          showConfirm(name, args, function (allowed) {
            if (!allowed) { resolve({ label: confirmLabel(name, args) + "（已取消）", text: "用户取消了该操作。", result: { ok: false, cancelled: true }, cards: [] }); return; }
            resolve(execTool(name, args));
          });
        });
      }
      return Promise.resolve(execTool(name, args));
    }
    function runLoop(depth) {
      if (depth > 5) return;
      showTyping();
      var messages = buildMessages();
      callModel(messages).then(function (res) {
        hideTyping();
        var content = res.content || "", toolCalls = res.toolCalls || [];
        var asst = { role: "assistant", content: content };
        if (toolCalls.length) {
          asst.tool_calls = toolCalls.map(function (t) {
            return { id: t.id, name: t.name, arguments: typeof t.arguments === "string" ? t.arguments : JSON.stringify(t.arguments || {}) };
          });
        }
        mem.messages.push(asst);
        if (content) addMsg("assistant", renderText(content));
        if (!toolCalls.length) { trimMem(); saveMem(mem); return; }
        var chain = Promise.resolve(), toolMsgs = [];
        toolCalls.forEach(function (tc) {
          chain = chain.then(function () {
            return handleTool(tc).then(function (out) {
              addToolCard(out);
              if (out.cards && out.cards.length) addResultCards(out.cards);
              toolMsgs.push({ role: "tool", tool_call_id: tc.id, name: tc.name, content: JSON.stringify(out.result) });
            });
          });
        });
        chain.then(function () {
          toolMsgs.forEach(function (m) { mem.messages.push(m); });
          trimMem(); saveMem(mem);
          runLoop(depth + 1);
        });
      }).catch(function (err) {
        hideTyping();
        addMsg("assistant", "⚠️ 调用失败：" + renderText(String((err && err.message) || err)) + "<br>请检查 API 配置与网络。");
      });
    }

    /* ---- 面板 / 配置 ---- */
    function openAgent() { if (agentPanel.hidden) { agentPanel.hidden = false; document.body.classList.add("agent-open"); } renderAgentState(); try { agentInput.focus(); } catch (e) {} }
    function closeAgent() { agentPanel.hidden = true; document.body.classList.remove("agent-open"); }
    function openSettings() { agentSettings.hidden = false; fillSettings(); }
    function closeSettings() { agentSettings.hidden = true; }
    function fillSettings() {
      agentProvider.value = cfg.provider || ""; agentBaseURL.value = cfg.baseURL || ""; agentModel.value = cfg.model || "";
      agentKey.value = cfg.apiKey || ""; agentInteractive.checked = !!cfg.interactive; agentConfirm.checked = !!cfg.confirmTools; agentStream.checked = !!cfg.stream;
    }
    function saveSettings() {
      cfg.provider = agentProvider.value; cfg.baseURL = agentBaseURL.value.trim(); cfg.model = agentModel.value.trim(); cfg.apiKey = agentKey.value.trim();
      cfg.interactive = agentInteractive.checked; cfg.confirmTools = agentConfirm.checked; cfg.stream = agentStream.checked;
      cfg.enabled = !!(cfg.apiKey && cfg.baseURL && cfg.model);
      saveCfg(cfg); closeSettings(); agentSettingsStatus.textContent = "";
      renderAgentState();
      toast(cfg.enabled ? "助手已就绪 ✅" : "已保存（需填齐 接口地址 / 模型 / 密钥 才会启用）");
    }
    function clearKey() { cfg.apiKey = ""; saveCfg(cfg); agentKey.value = ""; renderAgentState(); toast("已清除密钥（记忆保留）"); }
    function clearMem() { mem = { messages: [], notes: [] }; saveMem(mem); renderAgentState(); toast("已清除记忆"); }
    function renderAgentState() {
      if (!cfg.enabled) {
        agentForm.classList.add("disabled"); agentInput.disabled = true; agentSend.disabled = true;
        agentMsgs.innerHTML = '<div class="agent-empty"><div class="agent-empty-ico">🔐</div><p>助手尚未配置 API。</p><p class="agent-empty-sub">Bring-Your-Own-Key：用自己的密钥，密钥仅存本机，不上传服务器。</p><button id="agentCfgNow" class="agent-btn-primary" type="button">去配置</button></div>';
        var b = document.getElementById("agentCfgNow"); if (b) b.addEventListener("click", openSettings);
        agentSuggest.innerHTML = ""; return;
      }
      agentForm.classList.remove("disabled"); agentInput.disabled = false; agentSend.disabled = false;
      if (agentMsgs.querySelector(".agent-empty")) agentMsgs.innerHTML = "";
      if (!mem.messages.length) {
        agentSuggest.innerHTML = SUGGESTIONS.map(function (s) { return '<button class="agent-sug" type="button">' + escapeHtml(s) + "</button>"; }).join("");
        Array.prototype.forEach.call(agentSuggest.querySelectorAll(".agent-sug"), function (b) { b.addEventListener("click", function () { sendMessage(b.textContent); }); });
      } else {
        agentSuggest.innerHTML = "";
      }
    }

    /* ---- 事件 ---- */
    if (agentBtn) agentBtn.addEventListener("click", openAgent);
    if (agentCloseBtn) agentCloseBtn.addEventListener("click", closeAgent);
    if (agentOverlay) agentOverlay.addEventListener("click", closeAgent);
    if (agentSettingsBtn) agentSettingsBtn.addEventListener("click", openSettings);
    if (agentSettingsClose) agentSettingsClose.addEventListener("click", closeSettings);
    if (agentProvider) agentProvider.addEventListener("change", function () {
      var map = { openai: ["https://api.openai.com/v1", "gpt-4o-mini"], deepseek: ["https://api.deepseek.com/v1", "deepseek-chat"], moonshot: ["https://api.moonshot.cn/v1", "moonshot-v1-8k"], qwen: ["https://dashscope.aliyuncs.com/compatible-mode/v1", "qwen-plus"], ollama: ["http://localhost:11434/v1", "llama3"] };
      var p = agentProvider.value; if (map[p]) { agentBaseURL.value = map[p][0]; agentModel.value = map[p][1]; }
    });
    if (agentSave) agentSave.addEventListener("click", saveSettings);
    if (agentClearKey) agentClearKey.addEventListener("click", clearKey);
    if (agentClearMem) agentClearMem.addEventListener("click", clearMem);
    if (agentForm) agentForm.addEventListener("submit", function (e) { e.preventDefault(); sendMessage(agentInput.value); });
    if (agentInput) agentInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(agentInput.value); }
    });
    if (agentInput) agentInput.addEventListener("input", autoGrow);

    renderAgentState();
  })();

  render();
})();
