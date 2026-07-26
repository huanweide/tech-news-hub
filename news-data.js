/*
 * tech-news-hub 数据层
 * 所有资讯均为真实事件，附引用来源（sources）。每条含 8 个维度。
 * 字段契约（前端 app.js 依赖）：
 *   weeks[]      : { id, label, range } 周次归档
 *   categories[] : { id, label, disabled? } 分类切换（disabled 为占位/即将开放）
 *   items[]      : { id, week, category, tags[], impactScore,
 *                    title, summary, what, compare, why, output,
 *                    explain, impact, action, sources[], architecture?, archCaption? }
 *   sources[]    : { name, url } 引用来源
 * 维度含义：
 *   what   事件实质（发生了什么，含关键指标/机制）
 *   compare 横向研判（与站内其它条目的对比与定位）
 *   why    驱动逻辑（战略/产业/技术动因）
 *   output 落地与产出（已交付物与量化结果）
 *   explain 技术解析与架构（机制、架构、权衡，配套 architecture SVG）
 *   impact 行业影响（结构性意义）
 *   action 读者行动建议（从业者/投资者视角）
 * 新增字段说明：
 *   architecture  : 内联 SVG 架构示意（用 var(--…) 主题色，明暗自适应）
 *   archCaption   : 架构图说明（可选）
 */
const NEWS_DATA = {
  weeks: [
    { id: "w3", label: "2026年7月 第3周", range: "7/14–7/20" },
    { id: "w4", label: "2026年7月 第4周", range: "7/21–7/25" },
    { id: "w5", label: "2026年7月 第5周", range: "7/20–7/26" }
  ],
  categories: [
    { id: "ai", label: "AI圈" },
    { id: "tech", label: "科技圈" },
    // 以下为可扩展占位：未来直接去掉 disabled 并填充 items 即可上线
    { id: "bio", label: "生命医学圈", disabled: true },
    { id: "energy", label: "能源圈", disabled: true }
  ],
  items: [
    /* ===================== AI圈 · 第3周 ===================== */
    {
      id: "kimi-k3",
      week: "w3",
      category: "ai",
      tags: ["开源", "MoE", "长上下文", "国产大模型", "基座模型"],
      impactScore: 95,
      title: "月之暗面发布 Kimi K3：首个开源权重突破 2 万亿参数的稠密等价模型",
      summary: "2.8 万亿参数的 MoE 架构、100 万 token 上下文窗口，综合能力逼近闭源旗舰；上线后因算力过载暂缓 C 端新订阅，凸显供给端瓶颈。",
      what: "北京时间 7 月 17 日，月之暗面发布 Kimi K3：总参数量 2.8 万亿、上下文窗口 100 万 token，是首个公开权重的 3 万亿级别模型。官方测评显示其综合智能仅次于 Claude Fable 5 与 GPT-5.6 Sol，在长周期软件工程（SWE-bench 类）等代码基准上尤为突出。发布 48 小时后因访问过载、算力调度吃紧，主动暂停 C 端新用户订阅——这暴露出的不是能力缺口，而是推理侧的供给约束。",
      compare: "与自身前代（稠密Transformer）相比，K3 转向稀疏 MoE：总参数膨胀到 2.8 万亿，但单步前向仅激活其中一小部分专家，使“巨模型”具备可运行的边际成本。与同期闭源旗舰相比，K3 第一次把“开放权重 + 接近旗舰能力 + 长上下文”拉到同一量级，此前的开源与闭源之间存在系统性代差。",
      why: "开源大模型长期被闭源旗舰压制在“可用但不够强”的区间。月之暗面以超大规模 MoE 加开放权重，意图争夺开发者生态与行业标准话语权，同时契合国内对“自主可控基座模型”的刚性需求——权重可本地部署，意味着数据不出域、可审计、可裁剪。",
      output: "K3 模型权重与 API（API 收入占其年经常性收入逾七成）；公司年内完成多轮融资，最新投前估值约 315 亿美元。能力交付已发生，约束在推理产能而非参数本身。",
      explain: "技术解析：K3 的“2.8 万亿”是总参数量而非激活参数量。MoE（混合专家）将前馈层拆为大量专家子网络，由门控网络（Gating）按 token 动态路由到 Top-k 个专家，单步计算量约等于“激活参数”规模，因此“大总参 + 小激活”兼顾容量与成本。100 万 token 上下文依赖高效的注意力稀疏化与显存管理，使模型可一次性吞入整本书或整个代码库再作答，对应法律、代码库、科研等超长文档场景。开放权重则把“能否部署”的控制权交还给使用方——这是它与闭源 API 的本质分野，也是其生态价值的来源。",
      impact: "国产 AI 正式进入“万亿参数开源生态”竞争阶段；对中小企业与研究者，等于免费获得接近旗舰的底座，显著降低应用门槛，并对闭源厂商形成价格与生态双重压力。算力供给（而非模型能力）成为新的产业瓶颈。",
      action: "从业者：可基于 K3 开放权重在自有算力上微调/蒸馏，绕开高额 API 费，用于私有知识库、合同审查等长上下文场景。投资者：关注 MoE 推理侧的产能与成本曲线——供给约束的缓解速度，将决定开源旗舰的商业兑现节奏。",
      archCaption: "门控网络按 token 动态激活少数专家，单步计算量远低于全参数推理；总参决定容量，激活参决定成本。",
            sources: [
        { name: "每日经济新闻（腾讯新闻）", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_1096a59722a05252" },
        { name: "AI大模型周报", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_6256a607cbe04852" },
        { name: "2026年八项重大科技创新（今日头条）", url: "https://www.toutiao.com/a7663299828553646627" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="Kimi K3 MoE 架构" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-kimi" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="84" height="46" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="62" y="109" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">用户请求</text><rect x="140" y="82" width="110" height="46" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="195" y="109" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">门控路由</text><rect x="280" y="28" width="200" height="150" rx="12" fill="none" stroke="var(--text-faint)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="380" y="50" fill="var(--text-soft)" font-size="11.5" font-weight="700" text-anchor="middle">专家子网络 MoE（总参 2.8T）</text><rect x="296" y="64" width="74" height="32" rx="7" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="333" y="84" fill="var(--text)" font-size="11.5" font-weight="700" text-anchor="middle">专家₁</text><rect x="296" y="104" width="74" height="32" rx="7" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="333" y="124" fill="var(--text)" font-size="11.5" font-weight="700" text-anchor="middle">专家₂</text><rect x="382" y="64" width="86" height="32" rx="7" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/><text x="425" y="84" fill="var(--text-soft)" font-size="11.5" font-weight="700" text-anchor="middle">专家ₖ</text><rect x="382" y="104" width="86" height="32" rx="7" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5"/><text x="425" y="124" fill="var(--text-soft)" font-size="11.5" font-weight="700" text-anchor="middle">专家ₙ</text><rect x="510" y="82" width="130" height="46" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="575" y="104" fill="var(--text)" font-size="11.5" font-weight="700" text-anchor="middle">聚合→输出</text><line x1="104" y1="105" x2="136" y2="105" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-kimi)"/><line x1="250" y1="105" x2="276" y2="105" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-kimi)"/><line x1="480" y1="105" x2="506" y2="105" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-kimi)"/></svg>'
    },
    {
      id: "qwen-3-8",
      week: "w3",
      category: "ai",
      tags: ["多模态", "参数规模", "大厂", "开发者工具", "Agent"],
      impactScore: 88,
      title: "阿里 Qwen3.8-Max 预览版：2.4 万亿参数多模态旗舰嵌入开发者工具链",
      summary: "WAIC 期间推出 2.4 万亿参数预览版，强调多模态与生态集成，并以 1 折价格开放抢先体验，与 Kimi 开源路线形成对照。",
      what: "7 月 19 日，阿里巴巴发布 Qwen3.8-Max 预览版，参数规模 2.4 万亿，官方称性能仅次于 Fable 5，兼容主流前沿架构。该版本已登陆阿里 Token 计划、Qoder 及 QoderWork 平台，以标准价 1 折开放抢先体验——其商业模式不是“卖权重”，而是“卖集成在工作流里的能力”。",
      compare: "与同日同台的 Kimi K3 相比：K3 主打“开源权重 + 超长上下文”，Qwen3.8-Max 当前为预览/闭源权重未开放，但强调多模态与生态嵌入（直接接入 Qoder 编程产品）。两者都把参数推过 2 万亿，标志国产大模型进入“万亿参数常态”，路线分歧在“开放 vs 集成”。",
      why: "WAIC 是国内大模型集中发布窗口；阿里以旗舰预览版抢占开发者心智，并以折扣价快速积累真实使用数据与反馈，反哺后续正式版与开放权重的节奏。",
      output: "Qwen3.8-Max 预览版（Token 计划 / Qoder / QoderWork 可用）；后续正式版与开放权重待公布。当前交付的是“能力入口”而非“权重”。",
      explain: "技术解析：多模态指模型在统一表征空间内处理文本、图像、代码等多种模态，而非为每种模态训练独立模型。阿里把它直接塞进 Qoder（AI 编程智能体），使自然语言可驱动“读图—改码—跑工程”的闭环。2.4 万亿参数同样走 MoE，推理计费按实际激活专家计，这是预览价能压到 1 折的结构性原因——你支付的不是“全模型”，而是“被激活的那部分”。集成路线的护城河不在单次能力，而在工具链数据与分发渠道。",
      impact: "国产旗舰在“参数规模 + 多模态 + 开发者工具集成”上完成代际升级；与 Kimi 的开源路线构成“闭源强生态 vs 开源可私有”的清晰双轨，给用户更分明的选择。",
      action: "研发/产品：可先用 1 折预览价在 Qoder 中实测 Qwen3.8 的代码与多模态能力，与 Kimi 开源版做成本—能力权衡。前瞻：大厂把旗舰“嵌进自家工具链”将成标配，单纯卖 API 的利润空间会被持续挤压。",
      archCaption: "多模态统一建模后直接嵌入开发者工具链，形成“模型—工具”闭环而非孤立聊天接口。",
            sources: [
        { name: "界面新闻（AI早报）", url: "https://www.163.com/dy/article/L292EPT70534A4SC.html" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="Qwen3.8 多模态与工具链" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-qwen" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="20" width="84" height="34" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="62" y="42" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">文本</text><rect x="20" y="64" width="84" height="34" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="62" y="86" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">图像</text><rect x="20" y="108" width="84" height="34" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="62" y="130" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">代码</text><rect x="140" y="58" width="200" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="240" y="92" fill="var(--text)" font-size="13" font-weight="700" text-anchor="middle">Qwen3.8-Max 多模态底座</text><text x="240" y="114" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">2.4T MoE · 统一表征</text><rect x="380" y="80" width="120" height="48" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="440" y="109" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">统一语义表征</text><rect x="530" y="58" width="120" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="590" y="92" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">Qoder 编码</text><text x="590" y="114" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">智能体</text><line x1="104" y1="105" x2="136" y2="105" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-qwen)"/><line x1="340" y1="104" x2="376" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-qwen)"/><line x1="500" y1="104" x2="526" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-qwen)"/></svg>'
    },
    {
      id: "on-device-ai-filing",
      week: "w3",
      category: "ai",
      tags: ["端侧AI", "合规", "隐私", "监管", "NPU"],
      impactScore: 80,
      title: "国家网信办公布 7 款手机端侧生成式 AI 备案，终端推理纳入规范化管理",
      summary: "苹果、华为、OPPO、vivo、小米、三星、努比亚七家厂商的手机端侧生成式 AI 完成备案，监管从云端延伸到终端。",
      what: "7 月 15 日，国家网信办公布 7 款手机端侧生成式 AI 服务备案，覆盖 Apple 智能、华为小艺、OPPO AndesGPT、vivo 蓝心端侧、小米澎湃 AI、三星盖乐世 AI、努比亚豆包手机模型，备案时间统一为 7 月 8 日。备案对象是“模型直接跑在手机本地、数据不出设备”的端侧推理能力。",
      compare: "此前监管重心在“云端大模型”（算法备案 + 安全评估）；本次把“端侧 AI”也纳入备案，填补了“本地推理”的监管空白。差别在于：云端模型的数据流经服务器，端侧模型的数据留在设备——监管对象从“模型服务”扩展到“终端上的模型能力”。",
      why: "端侧 AI 以“数据不上云、隐私更好、离线可用”成为手机厂商新卖点，但也需明确合规边界。集中备案让厂商有法可依、用户权益有保障，是“本地推理”走向规模化的制度前提。",
      output: "七款手机端侧 AI 服务获备案；端侧大模型监管框架落地。备案不等于内容审批，而是“能力登记 + 规范接受”，类似给终端 AI 上户口。",
      explain: "技术解析：端侧 AI 将经蒸馏/量化的小模型部署在手机 NPU（神经网络处理单元）本地运行，推理全程不离开设备。优势是隐私与离线，代价是受限于端侧算力，模型规模与能力弱于云端。其架构核心是“端云协同”——敏感输入在本地处理，复杂任务才上云。监管据此划定边界：本地能做的（如本地摘要、离线问答）走端侧备案，跨设备调用的能力另行规范。这意味着端侧小模型（如努比亚的豆包手机模型）获得正名，也倒逼厂商在 NPU 利用率、模型压缩上投入。",
      impact: "手机 AI 功能上市有了清晰合规路径，降低政策不确定性；利好隐私敏感场景（健康、财务）在本地用 AI；也推动端侧小模型与手机 NPU 芯片升级，带动“端云混合”成为主流架构。",
      action: "用户：可更放心在手机本地用 AI 处理敏感内容；购机时可关注是否具备已备案的端侧 AI 能力。前瞻：端侧+云端混合（敏感本地算、复杂上云）将成为手机 AI 主流，带动端侧小模型与 NPU 升级。",
      archCaption: "端侧推理将隐私敏感计算留在本地，仅把必要任务上云，监管据此划定备案边界。",
            sources: [
        { name: "AI大模型周报", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_6256a607cbe04852" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="端侧与云端协同" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-od" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="78" width="96" height="48" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="68" y="107" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">用户请求</text><rect x="150" y="56" width="170" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="235" y="90" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">端侧 NPU 小模型</text><text x="235" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">数据不出设备</text><rect x="360" y="28" width="190" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="455" y="57" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">云端大模型（备案）</text><rect x="360" y="112" width="190" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="455" y="139" fill="var(--text-soft)" font-size="11.5" font-weight="600" text-anchor="middle">仅在必要时上云</text><line x1="116" y1="102" x2="146" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-od)"/><line x1="320" y1="80" x2="356" y2="60" stroke="var(--text-soft)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah-od)"/><line x1="320" y1="110" x2="356" y2="128" stroke="var(--text-soft)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah-od)"/></svg>'
    },

    /* ===================== AI圈 · 第4周 ===================== */
    {
      id: "hunyuan-hy3-hyra",
      week: "w4",
      category: "ai",
      tags: ["混元", "OpenRouter", "科研智能体", "自我改进", "Agent"],
      impactScore: 90,
      title: "腾讯混元 Hy3 登顶 OpenRouter 调用量榜首，并发布递归自我改进科研智能体 Hyra-1.0",
      summary: "Hy3 在 OpenRouter 全球调用量第一；Hyra-1.0 以“递归自我改进”把 AI 用于科研自动化，在多项基准上超越此前最优。",
      what: "WAIC 期间的 AI 大模型周报显示，腾讯混元 Hy3 登顶 OpenRouter 全球模型调用量榜首。7 月 21 日，混元团队发布科研智能体 Hyra-1.0，通过递归自我改进与轻量框架，实现面向研究与工程任务的性能导向优化，在 AI for AI、AI for Science、AI for Fun 领域均展现能力，并在多项基准上超越此前最优、解决部分数学开放问题。",
      compare: "与 Kimi/Qwen 的“超大参数通用模型”路线不同，腾讯本周打出两张牌：① Hy3 靠“高性价比 + 开放调用”在 OpenRouter 以调用量登顶——这是市场用脚投票选“便宜好用”；② Hyra-1.0 走“AI 做科研 / 自我改进”的 agent 路线，从“聊天”升级为“能自我迭代的研究智能体”。",
      why: "模型能力趋同后，竞争转向“谁被用得多（生态）”与“谁能干科研苦活（agent）”。腾讯同时卡位调用量与科研自动化两条线，把“模型强”转化为“被集成、被使用”。",
      output: "Hy3 在 OpenRouter 登顶；Hyra-1.0 科研智能体发布（递归自我改进框架）。交付物从“一个模型”变为“一个能自我进化的研究劳动力”。",
      explain: "技术解析：OpenRouter 是统一调用各家模型的“模型超市”，调用量第一说明在真实开发中 Hy3 因性价比/稳定性被大量选用——这是市场投票而非榜单刷分。递归自我改进指智能体跑完任务后，自动总结哪一步做得差，改写自己的策略或代码，下一轮以“更好的自己”再跑，形成“越用越强”的飞轮（类似 RL 中的元优化）。Hyra 把该范式用于写论文、做实验、解数学题等科研场景，关键在于“评估信号”的质量——没有可靠的 Eval，自我改进会失真。",
      impact: "国产模型在“开放生态调用量”上证明竞争力；科研智能体把 AI 从“辅助写作”推向“自主做研究”，有望加速科学发现节奏，也对科研评价与可复现性提出新议题。",
      action: "开发者：可优先在 OpenRouter 试 Hy3 控制成本；科研：关注 Hyra 类“自我改进 agent”替代重复实验劳动。前瞻：模型公司将从“卖单次回答”转向“卖持续自我进化的科研/工程劳动力”。",
      archCaption: "Hyra 以“执行→评估→自我改写”闭环逼近递归自我改进，把 AI 用于科研自动化。",
            sources: [
        { name: "AI大模型周报", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_6256a607cbe04852" },
        { name: "站长之家 AI日报", url: "https://www.chinaz.com/feed/0721/1766229.shtml" }
      ],
      architecture: '<svg viewBox="0 0 660 220" role="img" aria-label="Hyra 递归自我改进闭环" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-hy" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="88" width="100" height="48" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="70" y="117" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">研究任务</text><rect x="150" y="70" width="150" height="84" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="225" y="104" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">智能体执行</text><text x="225" y="126" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">写代码/做实验</text><rect x="330" y="70" width="140" height="84" rx="11" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="400" y="104" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">评估 Eval</text><text x="400" y="126" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">基准/开放问题</text><rect x="500" y="70" width="140" height="84" rx="11" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="570" y="104" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">自我改写</text><text x="570" y="126" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">策略/权重</text><rect x="150" y="178" width="340" height="30" rx="8" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.2"/><text x="320" y="198" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">Hy3 开放调用底座（OpenRouter 调用量第一）</text><line x1="120" y1="112" x2="146" y2="112" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hy)"/><line x1="300" y1="112" x2="326" y2="112" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hy)"/><line x1="470" y1="112" x2="496" y2="112" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hy)"/><path d="M570,154 C570,176 320,176 230,154" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ah-hy)"/></svg>'
    },

    /* ===================== 科技圈 · 第3周 ===================== */
    {
      id: "spacex-starship-13",
      week: "w3",
      category: "tech",
      tags: ["商业航天", "星舰", "资本市场", "可复用火箭", "可靠性"],
      impactScore: 85,
      title: "SpaceX 取消星舰第 13 次试飞，IPO 后首次发射临射自动中止",
      summary: "部分发动机未启动触发自动中止，星舰第 13 次任务临射取消；股价盘后跌超 4%，市值蒸发逾 8600 亿美元。",
      what: "当地时间 7 月 16 日，SpaceX 取消“星舰”重大试飞。原定当天下午从得州星基地起飞，执行第 13 次重大任务、也是公司美国 IPO 以来首次发射；因部分发动机未能启动触发自动中止，马斯克称数日内有望再试。消息公布后股价盘后一度跌超 4%，自 6 月高点累计跌约三分之一，市值蒸发逾 8600 亿美元。",
      compare: "对比此前星舰“炸了也算成功”的早期试飞，本次是临射自动中止——安全系统正确生效，说明火箭可靠性工程在进步；但作为 IPO 后首次发射遇挫，市场用股价表达了对“稳定履约”的耐心边界。",
      why: "星舰是马斯克“火星移民 + 降低发射成本”的核心载具，也是上市后向资本市场证明“可复用超重型火箭能稳定飞”的关键。一次中止直接触发估值重估，标志商业航天进入“资本市场盯履约”阶段。",
      output: "试飞取消（非失败，安全中止）；后续数日计划再尝试；资本市场短期承压。交付的是一次“被安全系统拦截”的发射窗口。",
      explain: "技术解析：星舰采用“Super Heavy 助推器（33 台 Raptor 发动机并联）+ 飞船上面级”的两级完全可复用架构。其可靠性来自冗余设计——单台发动机失效不应致命，系统通过健康管理与自动中止逻辑在异常时叫停。本次“部分发动机未点着→系统自动中止”恰恰是冗余安全设计生效：宁可不上天，也不带病飞。股价大幅波动，是因为上市后的 SpaceX 不再是“玩票”，投资者要求稳定履约，一次取消就动摇“很快常态化发射”的预期。",
      impact: "航天商业化进入“资本市场盯履约”阶段；若后续成功，可复用超重型火箭将重塑卫星互联网与深空探测的成本结构；若反复推迟，将拖累相关供应链估值。可靠性曲线比单次成败更关键。",
      action: "关注数日内复飞结果，它是判断 SpaceX 上市后成色的试金石；若看好商业航天，观察每次发射节点对相关 ETF/产业链的情绪影响。前瞻：可复用火箭的“可靠性曲线”比单次成败更重要，未来 2–3 次连续成功才会真正修复估值。",
      archCaption: "冗余发动机并联 + 自动中止构成安全基线；临射叫停即冗余设计生效，而非失败。",
            sources: [
        { name: "每日经济新闻（腾讯新闻）", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_1096a59722a05252" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="星舰堆栈与中止逻辑" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-ss" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="30" y="30" width="200" height="58" rx="10" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="130" y="58" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">Starship 飞船（上面级）</text><text x="130" y="78" fill="var(--text-soft)" font-size="10.5" font-weight="600" text-anchor="middle">载荷 / 入轨级</text><rect x="30" y="108" width="200" height="70" rx="10" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="130" y="138" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">Super Heavy 助推器</text><text x="130" y="160" fill="var(--text-soft)" font-size="10.5" font-weight="600" text-anchor="middle">33× Raptor 并联（冗余）</text><line x1="130" y1="88" x2="130" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-ss)"/><rect x="300" y="60" width="170" height="70" rx="10" fill="var(--surface-2)" stroke="var(--brand)" stroke-width="1.5"/><text x="385" y="90" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">发射中止逻辑</text><text x="385" y="112" fill="var(--text-soft)" font-size="10.5" font-weight="600" text-anchor="middle">发动机未点着→自动叫停</text><rect x="510" y="80" width="140" height="50" rx="10" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="580" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">地面控制中心</text><line x1="230" y1="95" x2="296" y2="95" stroke="var(--text-soft)" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ah-ss)"/></svg>'
    },
    {
      id: "imec-diraq-qubits",
      week: "w3",
      category: "tech",
      tags: ["量子计算", "硅基", "CMOS", "半导体", "可扩展"],
      impactScore: 87,
      title: "imec + Diraq 跑通 8 比特硅基量子阵列：量子计算向晶圆厂量产迈步",
      summary: "在 imec 300mm CMOS 兼容产线上造出 8 量子比特线性阵列并保持相干，证明量子芯片可用传统半导体工艺规模化制造。",
      what: "7 月 13 日，先进半导体研究机构 imec 与硅基量子计算公司 Diraq 宣布，在 imec 的 300mm CMOS 兼容平台上演示了 8 个硅 MOS 自旋量子比特阵列的相干操作与读取，成果发表于《Nature Communications》。阵列保持了大规模量子计算机所需的相干性与可控性，且扩展读取架构不必显著增加传感器与布线。",
      compare: "对比超导量子（谷歌 Willow 等需极低温特殊工艺）与离子阱路线，硅自旋量子比特的最大卖点是“能用制造手机芯片的同一条 CMOS 产线造”，直接继承半导体业几十年的良率、供应链与成本优势——这是从“实验室手工样品”走向“工厂量产”的关键一跃。",
      why: "量子计算卡在“能造几个比特”到“能造成千上万比特”的鸿沟。Diraq/imec 用成熟 CMOS 工艺证明扩产路径存在，降低对全新专用产线的依赖，使“规模化”从愿景变为工艺问题。",
      output: "8 比特硅基量子阵列（CMOS 兼容、可扩展读取）；《Nature Communications》论文；为硅基量子量产铺路。交付的是“工艺可行性证明”。",
      explain: "技术解析：量子比特（qubit）是量子计算机的细胞，因极易受干扰（退相干）而难造难保。硅自旋量子比特用单个电子的自旋（上/下）存信息，体积小、可密集排布。“CMOS 兼容”是重点——今天芯片都靠 CMOS 工艺在 300mm 大硅圆上批量制造；若量子芯片也能用这条产线，就意味着未来可像造普通芯片一样“量产”量子芯片，成本与规模问题迎刃而解。“相干操作 + 读取”= 量子态能稳定保持并完成计算、且能准确读出结果。8 个比特不多，但证明“产线能扩到更大阵列且不崩”，才是里程碑。",
      impact: "量子计算从“特殊工艺手工品”转向“标准半导体工业品”的路径被验证，利好长期降本与扩规模；也为传统芯片厂（台积电、英特尔等）切入量子赛道打开接口。",
      action: "不必追热点买概念股，但可关注“CMOS 兼容量子”后续是否出现 50–100 比特阵列（实用化前的关键信号）。前瞻：硅基量子若延续该节奏，5–10 年内可能出现首批“工厂造”的中等规模量子加速器，先落地于材料模拟与密码学。",
      archCaption: "用标准 CMOS 工艺制造自旋量子比特，使量子芯片具备晶圆厂量产路径。",
            sources: [
        { name: "Diraq 官方新闻", url: "https://www.diraq.com/newsdesk/diraq-demonstrates-scaled-silicon-based-qubit-array-produced-with-industry-standard-manufacturing-techniquesnbsp" },
        { name: "新浪科技（量子客）", url: "https://k.sina.com.cn/article_5953190046_162d6789e06703ho9g.html?loc=31" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="硅基量子阵列工艺链" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-im" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="78" width="150" height="48" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="95" y="107" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">300mm CMOS 产线</text><rect x="200" y="56" width="150" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="275" y="90" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">硅 MOS 自旋量子比特</text><text x="275" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">8 比特阵列 / 相干</text><rect x="400" y="78" width="150" height="48" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="475" y="107" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">低温测控电子</text><rect x="580" y="78" width="70" height="48" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="615" y="107" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">纠错接口</text><line x1="170" y1="102" x2="196" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-im)"/><line x1="350" y1="102" x2="396" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-im)"/><line x1="550" y1="102" x2="576" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-im)"/></svg>'
    },
    {
      id: "china-tech-breakthroughs",
      week: "w3",
      category: "tech",
      tags: ["聚变", "量子", "二维半导体", "自主可控", "根技术"],
      impactScore: 92,
      title: "中国科技密集突破：聚变超导磁体、二维半导体线、九章四号同周亮相",
      summary: "7 月初多项硬科技集中落地——全球最大聚变超导磁体验收、首条 8 英寸二维半导体示范线贯通、九章四号光量子原型机问世。",
      what: "据集中报道，7 月初中科院合肥物质院两款聚变堆超导磁体完成验收与满工况测试（环向场磁体长 21m、重 582 吨，储能为 ITER 同型 3 倍，计划 2030 年前后发第一度聚变电）；5 月问世的“九章四号”光量子原型机拥有 1024 个量子压缩态输入、可操纵 3050 个光子，求解高斯玻色采样比超算快 10⁵⁴ 倍；7 月 9 日上海 8 英寸二维半导体工程化示范工艺线全线贯通，发布的 500 纳米 PDK 良率 >99.99%。",
      compare: "三条线对应“能源 / 量子 / 芯片”三大底层：① 聚变磁体解决“人造太阳”工程化最难的材料与磁体关，并给出 2030 发电时间表；② 九章四号延续光量子路线优越性，中国是全球唯一在光量子与超导两条线都实现“量子优越性”的国家；③ 二维半导体（原子级厚度）被视为 1 纳米以下节点的新范式，示范线贯通意味着跳出硅基物理极限有了工程入口。",
      why: "三项均属“卡脖子”底层技术，长期受外部封锁；集中突破源于国家中长期科技规划持续投入与产学研协同攻关机制，是对“自主可控”的结构性补强。",
      output: "聚变超导磁体（100% 国产化）、二维半导体示范线（PDK 良率 >99.99%）、九章四号光量子原型机。交付的是“平台/工艺可行性”，而非终端产品。",
      explain: "技术解析：① 核聚变=在地球上复刻太阳能量，用海水中的氘作燃料；难点是用超强磁场把上亿度等离子体关在“磁笼”里不烧穿容器——这套超导磁体就是磁笼骨架，越大越强越稳，发电才靠谱，2030 时间表是关键信号。② 量子计算机不是替代笔记本，而是专为特定难题（如分子模拟）设计；九章四号用光子当量子比特，在特定数学任务上比最快超算快到无法想象，证明这类机器在限定问题上确实超越经典。③ 传统芯片靠把硅晶体管做小提性能，已逼近原子尺度极限；二维半导体只有“一层原子”厚，漏电少，是下一代芯片候选材料，示范线贯通=能从实验室小片走向可流片工程线。三者共同构成能源、量子、芯片的自主底座。",
      impact: "能源、量子、芯片三大“根技术”同步推进自主可控，降低对外部供应链依赖；为相关产业（清洁能源、材料、算力）提供底层支撑，也提升战略博弈中的技术筹码。",
      action: "关注 2030 前后聚变发电示范节点与二维半导体流片进展，这是判断“国产底层技术是否真正产业化”的硬指标，而非概念炒作。前瞻：能源+算力双自主将重塑高端制造与 AI 产业的成本结构。",
      archCaption: "三条线分别对应能源、量子、芯片“根技术”，同步推进自主可控。",
            sources: [
        { name: "网易（中国科技七箭齐发）", url: "https://www.163.com/dy/article/L1H222GD0556BW6S.html" },
        { name: "新浪（中国半年12项突破）", url: "https://k.sina.cn/article_7880068204_1d5b04c6c06801dfau.html" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="三大根技术底座" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-ct" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><text x="330" y="26" fill="var(--text-soft)" font-size="12" font-weight="700" text-anchor="middle">自主可控三底座：能源 / 量子 / 芯片</text><rect x="20" y="44" width="180" height="130" rx="12" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="110" y="86" fill="var(--text)" font-size="13" font-weight="700" text-anchor="middle">聚变超导磁体</text><text x="110" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">环向场 21m/582t</text><text x="110" y="132" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">储能×3 ITER</text><text x="110" y="154" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">2030 发电目标</text><rect x="240" y="44" width="180" height="130" rx="12" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="330" y="86" fill="var(--text)" font-size="13" font-weight="700" text-anchor="middle">九章四号 光量子</text><text x="330" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">1024 压缩态</text><text x="330" y="132" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">3050 光子操纵</text><text x="330" y="154" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">快 10⁵⁴ 倍</text><rect x="460" y="44" width="180" height="130" rx="12" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="550" y="86" fill="var(--text)" font-size="13" font-weight="700" text-anchor="middle">二维半导体线</text><text x="550" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">8 英寸示范线</text><text x="550" y="132" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">PDK >99.99%</text><text x="550" y="154" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">突破硅基极限</text></svg>'
    },

    /* ===================== 科技圈 · 第4周 ===================== */
    {
      id: "mit-photonic-chip",
      week: "w4",
      category: "tech",
      tags: ["光子芯片", "光计算", "光通信", "底层突破"],
      impactScore: 78,
      title: "MIT 造出可编程光子芯片：用电信号按需调控光在芯片内的传播",
      summary: "科学家做出可用电信号编程的光学芯片，能实时放慢或调度光信号，为光计算与光通信补上稀缺的“可控延迟/缓冲”能力。",
      what: "7 月 21 日，ScienceDaily 报道，科学家创造出可编程光学芯片，能够“按需让光变慢”，使工程师能更精确控制光信号在电路中的传播速度与时序。该技术可提供光路所需的延迟、同步与缓冲能力，潜在应用于光计算与高速光通信。",
      compare: "传统电子芯片用“电”传输与计算，受电阻、发热与带宽限制；光子芯片用“光”传输，更快、更省、互不干扰，但难点是“光不好控制（难停下、难缓存）”。本次突破补上了光子电路里稀缺的“可控延迟/缓冲”能力，类似给光路装上可调节的红绿灯与停车场。",
      why: "AI 与通信对带宽、能耗的要求逼近电子芯片物理极限，业界转向“用光代替部分电”；但光一旦发出就难停难存，缺少等效的“内存/缓存”，本工作正是补齐这一短板。",
      output: "可编程光子芯片原型（可调控光传播延迟与同步）；为光计算/光通信提供关键构件。交付的是“使能技术”而非产品。",
      explain: "技术解析：光子芯片在波导中用光束替代电流处理信息，优势是快、低耗、多束光并行不打架；但光难以“暂停/缓存/对齐时序”，而计算机经常需要“等数据”“对齐时钟”。MIT 这片芯片用电信号实时改变波导的有效折射率，从而调节光程、制造可控延迟与同步——等于给光路加了可调节的缓冲与红绿灯。其本质是用“电编程”驾驭“光传输”，是光计算从“能传”走向“能算”的关键零件（类似电子芯片中的寄存/缓存）。",
      impact: "为光计算（用光做 AI 推理/训练）与数据中心光互连扫除一项基础障碍；长期有望降低 AI 算力的能耗与延迟，缓解电子芯片的物理极限压力。",
      action: "这是偏底层的研究突破，短期不影响消费产品；可把它当作“光计算成熟时间表”的先导指标——当类似“光缓存/光内存”接连出现，才是光计算真正靠近实用的信号。前瞻：电子+光子混合芯片会在 3–5 年内先进入数据中心互连，再逐步渗入 AI 加速。",
      archCaption: "用电信号实时改变波导折射率，实现光在芯片内的可控延迟与缓冲。",
            sources: [
        { name: "ScienceDaily（信息技术新闻）", url: "https://www.sciencedaily.com/news/computers_math/information_technology" }
      ],
      architecture: '<svg viewBox="0 0 660 190" role="img" aria-label="可编程光子芯片" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-mit" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="78" width="120" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="80" y="105" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">电控制信号</text><rect x="180" y="52" width="200" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="280" y="86" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">可编程光子波导阵列</text><text x="280" y="108" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">按需调控折射率</text><rect x="420" y="68" width="140" height="60" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="490" y="96" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">光信号（延迟/同步）</text><rect x="590" y="80" width="58" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="619" y="107" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">计算</text><line x1="140" y1="100" x2="176" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-mit)"/><line x1="380" y1="100" x2="416" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-mit)"/><line x1="560" y1="98" x2="586" y2="98" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-mit)"/></svg>'
    },

    /* ===================== AI圈 · 第4周（扩充） ===================== */
    {
      id: "ai-persona-regulation",
      week: "w4",
      category: "ai",
      tags: ["AI监管", "情感陪伴", "合规", "数据安全", "未成年人保护"],
      impactScore: 88,
      title: "《人工智能拟人化互动服务管理暂行办法》7月15日起施行",
      summary: "国家网信办等五部门联合发布国内首部 AI 情感陪伴专项规章正式生效，禁止诱导情感依赖、向未成年人提供虚拟亲密关系；豆包、通义千问同步下线用户自建智能体。",
      what: "7 月 15 日，国家网信办、发改委、工信部、公安部、市场监管总局五部门联合发布的《人工智能拟人化互动服务管理暂行办法》正式施行，是国内第一部专门针对“AI 聊天伴侣/虚拟朋友”的规章。当天字节豆包、阿里通义千问下线用户自建智能体功能，腾讯元宝此前已提前调整。",
      compare: "与站内“国家网信办 7 款手机端侧 AI 备案”不同——备案针对手机端侧模型（偏技术准入），本办法针对“会陪你聊天、有角色人设”的拟人化服务（偏应用合规），约束更直接；也是全球较早落地的 AI 情感陪伴专项立法。",
      why: "过去一两年 AI 虚拟恋人、情感树洞靠高沉浸感聚拢用户，却带来情感依赖诱导、未成年人保护缺位、私密对话留存泄露等风险。上海“清朗”行动已下架 1.4 万余个违规智能体，红线早已释放信号，本办法把它写成明文。",
      output: "一份正式施行的部门规章，配套安全评估、算法备案、AI 沙箱安全服务平台等制度；并规定梯度处罚（警告、整改、暂停服务，情节严重处 1 万–20 万元罚款）。交付的是“规则框架”而非技术。",
      explain: "技术解析：本办法的监管对象是具有角色人设、提供情绪陪伴的“拟人化互动服务”，区别于纯工具型 AI（写稿、学习、办公不受影响）。其规制架构是分层级的：① 准入层——要求安全评估与算法备案；② 运行层——通过 AI 沙箱安全服务平台对交互内容做隔离与监测；③ 保护层层——禁止诱导情感依赖、禁止向未成年人提供虚拟亲密关系，并要求极端情绪时劝导并通知紧急联系人；④ 追责层——以梯度处罚（1 万–20 万元）形成威慑。本质上，它把“拟人化程度”作为监管强度的主要变量，拟人越强、约束越重。",
      impact: "行业从“野蛮生长”进入“规范提质”。情感陪伴赛道必须重构合规与未成年人保护机制；同时释放对适老陪伴、适幼照护等正向应用的鼓励信号，利好合规玩家。",
      action: "普通用户留意常用 AI 伴侣的隐私与未成年人设置；创业者/产品经理上线拟人化功能前务必做安全评估与算法备案，避开情感操纵、诱导沉迷等红线。合规能力将成为该赛道的准入门槛。",
      archCaption: "从准入（备案）、运行（沙箱）、保护（未成年）到追责（处罚）的全链条规制。",
            sources: [
        { name: "人民网·中国城市报", url: "https://paper.people.com.cn/zgcsb/pc/content/202607/20/content_30169792.html" },
        { name: "光明网", url: "https://m.gmw.cn/toutiao/2026-07/16/content_1304533541.htm" },
        { name: "信用中国（贵州）", url: "https://cx.guizhou.gov.cn/xinyongdongtai/202607/t20260720_90638187.html" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="拟人化服务规制架构" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-pr" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="40" width="170" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="105" y="70" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">拟人化互动服务</text><rect x="230" y="40" width="160" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="310" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">风险分级（陪伴/通用）</text><rect x="230" y="120" width="160" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="310" y="150" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">AI 沙箱安全评估</text><rect x="420" y="40" width="200" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="520" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">未成年保护＋紧急联系人</text><rect x="420" y="120" width="200" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="520" y="150" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">算法备案／处罚 1万–20万</text><line x1="190" y1="65" x2="226" y2="65" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-pr)"/><line x1="310" y1="90" x2="310" y2="116" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-pr)"/><line x1="390" y1="65" x2="416" y2="65" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-pr)"/><line x1="390" y1="145" x2="416" y2="145" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-pr)"/></svg>'
    },
    {
      id: "humanoid-robot-massproduction",
      week: "w4",
      category: "ai",
      tags: ["具身智能", "人形机器人", "量产", "工业落地", "实景实训"],
      impactScore: 82,
      title: "工信部、国资委启动人形机器人实景实训，“量产元年”机器人进厂",
      summary: "2026 被业界视为“人形机器人量产元年”；工信部、国资委联合印发通知启动年度人形机器人与具身智能实景实训专项行动，提出年底形成万台级落地能力。",
      what: "工信部、国务院国资委联合印发通知，启动年度人形机器人与具身智能实景实训专项行动，提出到今年底“开启作业模式”“带动形成万台级规模落地能力”。新华网 7 月 22 日报道，浙江等地一批人形机器人已进厂，在纺织、汽车、3C 电子等真实产线实训。",
      compare: "与站内“MIT 可编程光子芯片”“九章四号”等偏基础研究不同，这是具身智能从实验室 Demo 走向工厂批量部署的标志性节点；也不同于单纯发布会秀动作，本次强调“在真实工业场景里干活并算投资回报”。",
      why: "过去人形机器人多在展台走步、打招呼，离创造价值很远。要让“大脑”真正理解物理世界，必须在真实工况里积累数据；政策推动＋供应链成本随规模下降，使 2026 年成为公认的“量产元年”。",
      output: "实测数据：杰克科技“艾图”在服装产线裁片分离成功率 97%、缝纫合格率超 98%，投资回报周期约 18 个月；均普智能 G2 在 3C 产线 8 小时 2283 次任务零失误，在汽车安全带工序把节拍从 18 秒提升到最快 12.9 秒（效率提升约 1/3）。",
      explain: "技术解析：具身智能的架构是“感知—决策—执行”闭环。多模态感知（视觉/力觉/IMU）把物理世界编码为状态；策略网络（常为视觉-语言-动作 VLA 大模型）输出动作意图；运动控制把意图解算为关节力矩驱动执行器。关键在于“数据飞轮”：机器人只有在真实产线作业，才能采集到分布外（OOD）轨迹，回流训练策略，再部署——形成“部署→学习→再部署”的闭环。万台级目标意味着本体制造、减速器、力矩传感器、运动控制等供应链要同步规模化，成本曲线才会下探。",
      impact: "具身智能竞争焦点从“单点运动性能”转向“系统化、长期稳定作业、规模落地”。万台级目标若达成，将带动本体制造、减速器、传感器、运动控制等上下游产业链，并催生“机器人即服务”新业态。",
      action: "制造业从业者关注柔性工序自动化改造机会，评估人形机器人在上下料/检测场景的 ROI；投资者跟踪本体厂、核心零部件（丝杠/谐波减速器/力矩传感器）及实训数据平台；求职者关注具身智能“数据飞轮”“仿真到实机”方向。",
      archCaption: "在真实工况中采集轨迹数据回流训练，形成“部署—学习—再部署”飞轮。",
            sources: [
        { name: "新华网", url: "https://www.toutiao.com/article/7665165722603012659/" },
        { name: "环球时报（网易转载）", url: "https://www.163.com/dy/article/L2J7MM390514R9OJ.html" },
        { name: "中国日报网", url: "https://www.toutiao.com/article/7664492768177390095/" }
      ],
      architecture: '<svg viewBox="0 0 660 220" role="img" aria-label="具身智能闭环" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-hr" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="80" width="120" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="80" y="107" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">多模态感知</text><rect x="170" y="60" width="150" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="245" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">策略大模型 VLA</text><text x="245" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">视觉-语言-动作</text><rect x="370" y="80" width="130" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="435" y="107" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">运动控制</text><rect x="540" y="50" width="110" height="60" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="595" y="78" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">真实产线</text><text x="595" y="98" fill="var(--text-soft)" font-size="10.5" font-weight="600" text-anchor="middle">作业/采集</text><path d="M595,110 C595,150 245,150 245,140" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#ah-hr)"/><text x="420" y="180" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">轨迹数据回流 → 再训练（数据飞轮）</text><line x1="140" y1="102" x2="166" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hr)"/><line x1="320" y1="102" x2="366" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hr)"/><line x1="500" y1="102" x2="536" y2="90" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hr)"/></svg>'
    },

    /* ===================== 科技圈 · 第4周（扩充） ===================== */
    {
      id: "gravity-one-yaosi-launch",
      week: "w4",
      category: "tech",
      tags: ["商业航天", "海上发射", "一箭九星", "引力一号", "卫星组网"],
      impactScore: 75,
      title: "引力一号遥四海上发射成功，“一箭九星”创民营入轨重量纪录",
      summary: "北京时间 7 月 22 日，东方空间引力一号（遥四）在长三角东海海域远海发射，将 9 颗卫星送入预定轨道，创民营商业航天应用发射入轨重量及价值纪录。",
      what: "7 月 22 日 10 时 54 分，我国太原卫星发射中心在上海东部海域用引力一号遥四运载火箭，将东坡 13~14 星、东坡 17~20 星、西光贰号 01 星、天仪 49 星、紫丁香三号共 9 颗卫星送入预定轨道，任务圆满成功。这是引力一号第 3 次飞行。",
      compare: "与站内“SpaceX 星舰第 13 次试飞取消”形成对照——一个 postpones，一个 succeeds；引力一号是当前全球运力最大的固体运载火箭（近地轨道 6.5 吨），主打成熟可靠的“一箭多星”拼车，路线与 SpaceX 可复用液体火箭不同。",
      why: "海上移动发射平台灵活机动，可避开不利海况与天气、分担陆地发射场压力，让发射布局更多元。本次发射点从山东海阳南移到上海东部海域，是无锡等地卫星制造产业链与长三角市场直连的关键一步。",
      output: "9 星入轨，其中 6 颗“东坡”系列由无锡微纳星空研制（4 颗 SAR 雷达＋2 颗光学，可捕捉毫米级地表变化）；西光贰号、天仪 49 星定位“AI＋商业航天＋定量遥感”；并同步开展 1 个载荷试验。入轨重量创我国民营商业航天应用发射纪录。",
      explain: "技术解析：引力一号采用四级固体火箭构型，固体推进剂免加注、可长期贮存、响应快，适合“班车化”拼车发射。海上发射的核心价值在“机动性与纬度优化”——发射点靠近赤道可借地球自转线速度增益运力，且远离人口稠密区、射向灵活。一箭九星依赖“星箭接口标准化 + 整流罩内多星分配器（分配器/P-POD）”，把多颗不同轨道/任务的卫星在单次任务中依次释放，摊薄单星入轨成本。本次入轨重量纪录，实质是“固体大运力 × 海上机动 × 多星分配”三者耦合的结果。",
      impact: "引力一号迈入稳定履约的商业化、规模化运营阶段；后续引力二号可复用液体火箭（低轨 21.5 吨）加速研制。民营火箭“班车化”发射将降低商业卫星入轨门槛，利好卫星互联网与遥感产业。",
      action: "关注商业航天板块（火箭制造、卫星制造、遥感数据服务）相关公司动态；创业者可留意“一箭多星拼车”带来的低成本入轨窗口；普通读者可把它当作国产民营航天成熟度的风向标持续跟踪发射频次。",
      archCaption: "固体运载 + 海上机动 + 拼车组网，构成民营航班化入轨能力。",
            sources: [
        { name: "央视军事/腾讯新闻", url: "https://new.qq.com/rain/a/20260722A08E0O00?refer=cp_1009" },
        { name: "东方空间/腾讯", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_5496a603ba555352" },
        { name: "无锡发布", url: "https://www.toutiao.com/article/7665215583427772943/" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="海上发射与拼车组网" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-go" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="78" width="140" height="48" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="90" y="107" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">海上机动平台</text><rect x="200" y="56" width="180" height="92" rx="11" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="290" y="90" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">引力一号 固体火箭</text><text x="290" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">6.5t LEO · 四级</text><rect x="420" y="68" width="140" height="60" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="490" y="96" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">一箭九星 拼车</text><rect x="590" y="80" width="58" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="619" y="107" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">组网</text><line x1="160" y1="102" x2="196" y2="102" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-go)"/><line x1="380" y1="102" x2="416" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-go)"/><line x1="560" y1="98" x2="586" y2="98" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-go)"/></svg>'
    },
    {
      id: "atommatrix-neutral-atom-qpu",
      week: "w4",
      category: "tech",
      tags: ["量子计算", "中性原子", "量子比特", "整机", "产业化"],
      impactScore: 80,
      title: "原子矩阵首台中性原子量子计算整机亮相 WAIC，达 2310 无缺陷量子比特",
      summary: "7 月 21 日 WAIC 期间，杭州原子矩阵发布全栈式集成化大规模中性原子量子计算机，可实现最高 2310 个无缺陷物理量子比特阵列稳定运行。",
      what: "2026 世界人工智能大会（WAIC）期间，杭州原子矩阵计算有限公司发布自主研发的“全栈式集成化大规模中性原子量子计算机”，完成整机线下公开亮相。该整机可实现最高 2310 个无缺陷物理量子比特阵列的构建与稳定运行。",
      compare: "与站内“imec+Diraq 8 比特硅基量子阵列”（硅基、小规模科研）和“九章四号”（光量子、特定问题优势）都不同——本项是中性原子路线的工程化整机，比特规模达千级，且定位“可交付产品”而非实验室样机。",
      why: "中性原子路线在可扩展性、相干时间、全连通性上被业界视为最具产业化潜力之一；痛点在于光镊阵列初始装载含随机缺陷，须把随机原子重排为有序无缺陷阵列才能算。原子矩阵攻克了大规模可编程重排与“存储-纠缠”分区架构。",
      output: "整机支持从随机装载识别、路径规划到目标阵列生成的全自动流程，构建并稳定运行最高 2310 个无缺陷物理量子比特；支持哈密顿量模拟与量子门电路计算；在比特规模、门保真度、稳定性上宣称达国际先进水平。",
      explain: "技术解析：中性原子路线用激光镊子（光偶极阱）俘获并排列单个原子作为量子比特。其规模化难点在“装载缺陷”——初始随机装载的原子位置不确定，含空位/多占，必须经过“重排”：识别每个原子、规划搬运路径、用光镊逐个移动到目标格点，得到无缺陷阵列。原子矩阵的突破在“全自动重排 + 存储-纠缠分区”：一部分原子用于存储（长相干），另一部分用于纠缠门操作，分区设计降低了串扰、利于可扩展纠错。2310 无缺陷比特是工程整机的标志性指标，意味着从“手工作坊”升级到“流水线工厂”。",
      impact: "若指标属实，标志我国中性原子量子计算从论文走向工程整机，为分子仿真、新药研发、优化问题等提供潜在算力底座；也将与超导、光量子路线形成国内多路线并跑格局。",
      action: "关注量子计算产业化进度与“中性原子 vs 超导 vs 离子阱”路线竞争；投资者可跟踪原子矩阵及上下游（激光镊、真空、控制系统）；研究者留意其“存储-纠缠”分区架构对大规模纠错的可扩展性意义。",
      archCaption: "自动重排消除装载缺陷，并以“存储—纠缠”分区支撑可扩展纠错。",
            sources: [
        { name: "中华网", url: "https://m.tech.china.com/jujiao/2026/0721/1922784.html" },
        { name: "新华网（量子纠错）", url: "https://www.xinhuanet.com/liangzi/20260720/9d75d4d5025642f2a320578ca01f5a54/c.html" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="中性原子量子整机" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-am" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="110" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="75" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">随机装载原子</text><rect x="170" y="60" width="160" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="250" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">激光镊重排</text><text x="250" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">路径规划</text><rect x="370" y="40" width="160" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="450" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">2310 无缺陷阵列</text><rect x="370" y="120" width="160" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="450" y="150" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">存储区｜纠缠区 分区</text><rect x="560" y="82" width="90" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="605" y="110" fill="var(--text)" font-size="11" font-weight="700" text-anchor="middle">量子门</text><line x1="130" y1="104" x2="166" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-am)"/><line x1="330" y1="100" x2="366" y2="80" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-am)"/><line x1="330" y1="110" x2="366" y2="140" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-am)"/><line x1="530" y1="95" x2="556" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-am)"/></svg>'
    },

    /* ===================== AI圈 · 第5周（本周 7/20–7/26） ===================== */
    {
      id: "beijing-agent-policy",
      week: "w5",
      category: "ai",
      tags: ["智能体", "政策", "Token经济", "北京", "产业", "AIP"],
      impactScore: 90,
      title: "北京出台智能体专项政策：重点项目最高 1 亿元，首提 AIP 与 Token 经济",
      summary: "北京市四部门联合印发《加快智能体引领发展的若干措施》，10 条举措推动智能体落地产业，重点项目最高 1 亿元支持，并首次提出智能体互联协议（AIP）、Token 经济与“一人公司”（OPC）。",
      what: "7 月 23 日，北京市发改委、科委等四部门联合印发《关于加快智能体引领发展的若干措施》（京发改〔2026〕1185 号），共 4 方面 10 条。文件提出推动基础模型“摸高”、实施“驾驭层工程”、培育 OPC（一人公司）与 Token 经济、建设“Token 工厂”、支持智能体互联协议（AIP）开源等。上半年北京 AI 融资超 950 亿元，占全国超三成；豆包月活 3.82 亿、日均 Token 调用 180 万亿。",
      compare: "与站内已收录的《AI 拟人化互动服务管理暂行办法》（偏“管应用合规”）不同，本文件是“促产业发展”的专项扶持政策，是国内首个省级智能体专项政策；也从过去“比参数、比榜单”转向“比智能体能否交付真实产业价值”。",
      why: "智能体被视为 AI 从“聊天”走向“干活”的关键形态；北京以资金+标准+协议三件套抢占生态位，试图把“模型强”转化为“产业强”。政策工具从“补贴训练”升级到“补贴交付”。",
      output: "一份正式施行的市级政策（10 条举措）；配套重点项目最高 1 亿元资金支持、“Token 工厂”与 AIP 开源建设。交付的是“制度基础设施”。",
      explain: "技术解析：智能体（Agent）是能自主拆解任务、调用工具、跑流程的 AI“数字员工”。本文件的架构性创新在三处：① AIP（智能体互联协议）——为不同厂商的智能体定义一套“通用插座/通信规范”，使它们能互相发现、调用、协作，解决当前 agent 孤岛问题；② Token 工厂——把算力消耗（Token）标准化为可计量、可结算的生产要素，类似“算力电网”；③ OPC（一人公司）——一个人 + 一堆智能体即可注册运营的业态，按 Token 消耗结算报酬。三者耦合：AIP 解决“连通”，Token 工厂解决“计价”，OPC 是“组织形态”的结果。这是把 AI 能力抽象为可组合、可结算的生产要素的基础设施思路。",
      impact: "智能体从概念走向量产落地的政策拐点；利好 AI 应用开发者、RPA/自动化厂商与算力服务商；也把“Token 经济”推到台前，影响未来 AI 收费与用工形态，可能催生新的生产关系。",
      action: "创业者/开发者：关注 AIP 开源与“Token 工厂”申报窗口，用政策红利把内部自动化流程产品化；投资人：跟踪北京智能体标杆项目与算力券落地；普通读者：可把重复事务（报表、客服、调研）尝试交给智能体，体会“一人公司”雏形。",
      archCaption: "以 AIP 打通智能体协作、以 Token 工厂计量算力消耗，催生“一人公司”新业态。",
            sources: [
        { name: "北京市人民政府官网", url: "https://www.beijing.gov.cn/zhengce/zcjd/202607/t20260724_4783045.html" },
        { name: "光明网", url: "https://m.gmw.cn/2026-07/24/content_1304537105.htm" },
        { name: "中国青年网", url: "https://news.youth.cn/jsxw/202607/t20260723_16779883.htm" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="智能体政策生态" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-bj" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="110" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="75" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">开发者/企业</text><rect x="170" y="60" width="140" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="240" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">智能体 Agent</text><text x="240" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">自主拆解任务</text><rect x="360" y="60" width="150" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="435" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">AIP 互联协议（开源）</text><text x="435" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">智能体互通协作</text><rect x="550" y="40" width="100" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="600" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">Token 工厂</text><rect x="550" y="120" width="100" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="600" y="150" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">OPC 一人公司</text><line x1="130" y1="104" x2="166" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bj)"/><line x1="310" y1="104" x2="356" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bj)"/><line x1="510" y1="100" x2="546" y2="78" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bj)"/><line x1="510" y1="120" x2="546" y2="142" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bj)"/></svg>'
    },
    {
      id: "gemini-3-6-flash",
      week: "w5",
      category: "ai",
      tags: ["Google", "Gemini", "多模态", "代码智能体", "AI安全", "Agent"],
      impactScore: 86,
      title: "Google 发布 Gemini 3.6 Flash 与代码安全智能体 CodeMender，主打“智能体时代”性价比",
      summary: "Google 推出 Gemini 3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber 三款模型，3.6 Flash 输出 token 平均减 17%、价格更低；同步发布可自动扫描修复漏洞的 CodeMender 智能体。",
      what: "7 月 21 日，Google 发布 Gemini 3.6 Flash、3.5 Flash-Lite 与面向网络安全的 3.5 Flash Cyber。3.6 Flash 主打“智能体时代”的高效编程与多模态，输出 token 平均减少 17%，API 定价输入 1.50 美元/输出 7.50 美元每百万 token。同步推出可自动扫描、验证并修复代码漏洞的 CodeMender 智能体，先向政府机构及受信伙伴限量开放。基准上 DeepSWE 49%（前代 37%）、OSWorld-Verified 83%（前代 78.4%）。",
      compare: "与站内 Kimi K3、Qwen3.8 的“超大参数通用旗舰”路线不同，Google 这代强调“更快更便宜更会干活”——用更低的输出 token 与价格抢“智能体执行”场景；CodeMender 则把模型能力直接封装成“自动修漏洞”的产品，而非只卖聊天接口。",
      why: "国际厂商竞争焦点从“参数规模”转向“速度/成本/智能体执行效率”，并切入 AI 安全赛道；降价+提效是争夺开发者与 agent 工作负载的直接手段，也把模型价值从“单次回答质量”转移到“单位成本下的任务完成率”。",
      output: "Gemini 3.6 Flash / 3.5 Flash-Lite / 3.5 Flash Cyber 三款模型；CodeMender 代码安全智能体（限量开放）。交付的是“模型 + 安全 agent”组合。",
      explain: "技术解析：Flash 是 Google 的“轻快版”模型家族，特点是低延迟、低成本、适合被智能体高频反复调用干细活。“输出 token 减 17%”意味着同义回答更紧凑，按量计费时更省——这背后是训练时的“简洁性/推理预算”优化。CodeMender 把模型能力封装为安全智能体：读代码→静态/动态扫描定位漏洞→生成补丁→在沙箱中验证修复不破坏功能。其架构价值在“闭环验证”：不是给出建议就结束，而是用测试/构建做反馈，形成“生成—验证”回路，把安全审计从“人工 Review”升级为“自动流水线”。",
      impact: "拉低智能体应用的推理成本，利好依赖高频调用的自动化流程；AI 安全从“提示词防护”升级到“自动修代码”，抬高行业安全基线；也加剧与国产模型在性价比上的竞争。",
      action: "开发者：在 agent 工作流里实测 3.6 Flash 的成本与代码能力，对比国产模型；安全团队：关注 CodeMender 类“自动修漏洞”工具能否接入 CI/CD；前瞻：模型价格将持续下探，“按结果付费”可能替代“按 token 付费”。",
      archCaption: "以更低推理成本支撑高频 agent 调用，并将能力封装为自动修漏洞流水线。",
            sources: [
        { name: "Google Gemini API 官方文档", url: "https://googledevai-dot-devsite-v2-prod-3p.appspot.com/gemini-api/docs/models/gemini-3.6-flash" },
        { name: "腾讯新闻", url: "https://so.html5.qq.com/page/real/search_news?docid=70000021_0436a60433015952" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="Gemini Flash 与 CodeMender" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-gm" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="110" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="75" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">智能体任务</text><rect x="170" y="60" width="160" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="250" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">Gemini 3.6 Flash</text><text x="250" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">−17% 输出 token</text><rect x="370" y="82" width="130" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="435" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">代码/工具调用</text><rect x="530" y="60" width="120" height="80" rx="11" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="590" y="94" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">CodeMender</text><text x="590" y="116" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">扫描→修复→验证</text><line x1="130" y1="104" x2="166" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-gm)"/><line x1="330" y1="104" x2="366" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-gm)"/><line x1="500" y1="104" x2="526" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-gm)"/></svg>'
    },
    {
      id: "waic-2026-close",
      week: "w5",
      category: "ai",
      tags: ["WAIC", "产业", "开源生态", "智能体终端", "上海", "全栈"],
      impactScore: 84,
      title: "WAIC 2026 在沪闭幕：超 300 款 AI 产品全球首发，国产开源生态加速出海",
      summary: "7 月 17—20 日上海 WAIC 2026 吸引 1100 余家企业、超 300 款产品全球首发；华为 Atlas 950 超节点、MiniMax M3、阶跃 Agent OS、AI 智能体手机等集中亮相。",
      what: "7 月 17—20 日，2026 世界人工智能大会（WAIC）在上海举行，1100 余家企业参展、超 300 款产品全球首发。华为 Atlas 950 超节点真机、MiniMax M3 多模态大模型、阶跃 Agent 操作系统、近存计算 3D 芯片、全球首款 AI 智能体手机集中亮相；中国开源模型（含站内已收录的 Kimi K3）引发硅谷与海外企业关注。展览面积首破 10 万㎡，140 余场论坛、1400 余位嘉宾，上海智算规模破 16 万 P、169 款大模型备案，累计意向合作 162 亿元。",
      compare: "与站内单点技术新闻不同，WAIC 是“全栈阅兵”：从底层算力（Atlas 950）、模型（MiniMax M3）、操作系统（阶跃 Agent OS）到终端（智能体手机）一次性展出，体现中国 AI 从“模型竞赛”扩展到“基础设施+终端+生态”的全链路能力。",
      why: "大会是观察产业风向的窗口：今年关键词从“大模型”转向“智能体+全栈基础设施”，且国产开源权重开始被海外企业主动采用，标志生态出海拐点。竞争维度从单点模型能力升级为体系化整合能力。",
      output: "300+ 全球首发产品；上海智算规模破 16 万 P；169 款大模型备案；累计意向合作 162 亿元。交付的是“生态全景”而非单品。",
      explain: "技术解析：WAIC 展示的全栈能力链是“算力底座 → 模型 → 操作系统 → 终端”的垂直整合。Atlas 950 超节点代表把多芯片通过高速互联组成超大算力池（近存计算 3D 芯片缓解“内存墙”）；MiniMax M3 是上层的多模态模型；阶跃 Agent OS 是把模型能力封装为可调度 agent 的操作系统层（负责任务编排、工具调用、上下文管理）；AI 智能体手机则是把 agent 下沉到终端，使设备本身能自主完成任务。四层耦合的意义在于：单点领先易被追赶，而“算力—模型—OS—终端”的协同优化形成系统性护城河，也是开源权重能被海外采用的前提（生态可移植）。",
      impact: "确认中国 AI 竞争维度升级到“全栈+生态”；开源权重出海带来标准与话语权机会；也预示“智能体手机”等终端新品将密集上市，终端侧 agent 成为新战场。",
      action: "从业者：从 WAIC 发布的全栈产品里找可集成的底座（算力/模型/OS）；投资者：关注智能体终端与近存计算等新方向；普通读者：明年换机可留意“AI 智能体手机”是否成为新卖点。",
      archCaption: "从算力、模型、操作系统到终端的垂直整合，标志竞争维度升级为全栈生态。",
            sources: [
        { name: "光明网（今日头条）", url: "https://www.toutiao.com/article/7663306688794985006/" },
        { name: "经济参考报（新华社）", url: "http://dz.jjckb.cn/www/pages/webpage2009/html/2026-07/08/content_117051.htm" },
        { name: "腾讯新闻（环球时报）", url: "https://new.qq.com/rain/a/20260720A04UY500" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="WAIC 全栈能力链" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-wa" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="140" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="90" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">算力底座 Atlas 950</text><rect x="200" y="82" width="140" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="270" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">大模型 MiniMax M3</text><rect x="380" y="82" width="140" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="450" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">Agent OS（阶跃）</text><rect x="560" y="82" width="90" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="605" y="110" fill="var(--text-soft)" font-size="11" font-weight="700" text-anchor="middle">智能体手机</text><text x="330" y="40" fill="var(--text-soft)" font-size="12" font-weight="700" text-anchor="middle">全栈能力链：垂直整合形成系统护城河</text><line x1="160" y1="104" x2="196" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-wa)"/><line x1="340" y1="104" x2="376" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-wa)"/><line x1="520" y1="104" x2="556" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-wa)"/></svg>'
    },

    /* ===================== 科技圈 · 第5周（本周 7/20–7/26） ===================== */
    {
      id: "hiaf-commissioning",
      week: "w5",
      category: "tech",
      tags: ["大科学装置", "核物理", "自主可控", "重离子", "医疗"],
      impactScore: 88,
      title: "强流重离子加速器 HIAF 在惠州建成投运：全球首台组合型重离子装置",
      summary: "国家重大科技基础设施 HIAF 通过工艺验收进入试运行，是全球首台“超导直线+同步加速器+储存环”组合的重离子装置，束流强刷新氧/铋离子国际纪录。",
      what: "7 月 21 日，位于广东惠州的国家重大科技基础设施——强流重离子加速器装置（HIAF）通过中科院组织的工艺验收，正式进入试运行。它是全球首台超导直线加速器+同步加速器+储存环组合的先进重离子研究装置，束线总长 2 公里，可加速氢到铀全种类离子。氧离子、铋离子束流强刷新国际纪录，分别较此前全球最高指标提升 3 倍和 7.5 倍。该装置建设历时 16 年，2018 年开工、2025 年 10 月首次出束，核心软硬件国产化率 100%。",
      compare: "与站内“原子矩阵中性原子量子计算机”“imec 硅基量子”等量子方向不同，HIAF 是“大科学装置”赛道——用加速到接近光速的重离子去打靶，研究原子核与新材料；两者都是“根技术”，但 HIAF 更偏基础科研与国家战略平台，是“国之重器”而非产业产品。",
      why: "为核物理前沿、新元素合成、重离子治癌、航天抗辐照与可控核聚变材料研究提供国际领先平台；核心技术 100% 自主可控，是战略安全的底层支撑。",
      output: "正式试运行的 HIAF 大科学装置；刷新氧/铋离子束流强国际纪录；国产重离子治癌等技术获底层平台支撑。交付的是“国家实验能力”。",
      explain: "技术解析：HIAF 采用“超导直线加速器 + 同步加速器 + 储存环”三段式组合架构。超导直线加速器负责把离子从静止加速到中等能量并注入；同步加速器用交变磁场把离子进一步加速到接近光速，并精确控制能量；储存环则把高能束流长时间储存、累积并精确引向不同实验终端（打靶）。其“强流”指标（束流强度/流强）决定单位时间内打到靶上的粒子数，直接影响实验统计精度与产额——氧/铋离子流强刷新纪录，意味着在相同时间内可获得更多核反应事件。2 公里束线、全种类离子（氢到铀）与 100% 国产化，共同构成其战略价值。",
      impact: "提升我国核物理与材料研究的底层平台能力；利好重离子治癌等高端医疗落地；也巩固“大科学装置”自主可控体系，为航天抗辐照、聚变材料提供极端条件实验手段。",
      action: "科研/医疗从业者：关注 HIAF 开放机时与重离子治癌临床合作；投资者：跟踪核技术医疗转化与加速器产业链；普通读者：把它视作“国家科技实力底座”的标志性进展。",
      archCaption: "“直线+同步+储存环”组合将重离子加速至近光速，支撑多类前沿实验。",
            sources: [
        { name: "央视新闻客户端", url: "https://new.qq.com/rain/a/20260721A06FBT00" },
        { name: "中国日报", url: "https://ex.chinadaily.com.cn/exchange/partners/82/rss/channel/cn/columns/snl9a7/stories/WS6a601fa7a310d709c2fbeec1.html" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="HIAF 加速器链" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-hi" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="140" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="90" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">超导直线加速器</text><rect x="200" y="82" width="140" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="270" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">同步加速器</text><rect x="380" y="82" width="130" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="445" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">储存环</text><rect x="540" y="40" width="110" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="595" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">核物理/新元素</text><rect x="540" y="120" width="110" height="50" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="595" y="150" fill="var(--text)" font-size="11.5" font-weight="700" text-anchor="middle">治癌/抗辐照</text><line x1="160" y1="104" x2="196" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hi)"/><line x1="340" y1="104" x2="376" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hi)"/><line x1="510" y1="100" x2="536" y2="72" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hi)"/><line x1="510" y1="108" x2="536" y2="142" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-hi)"/></svg>'
    },
    {
      id: "lijian-y15-launch",
      week: "w5",
      category: "tech",
      tags: ["商业航天", "一箭五星", "卫星组网", "空间碎片监测", "算力上天"],
      impactScore: 82,
      title: "力箭一号遥十五“一箭五星”成功，含国内首颗商业空间碎片监测卫星",
      summary: "7 月 24 日，中科宇航力箭一号遥十五将 5 颗卫星送入预定轨道，含国内首颗商业空间碎片监测卫星；该火箭已累计送 110 颗卫星入轨。",
      what: "7 月 24 日 7:33，在东风商业航天创新试验区，中科宇航力箭一号遥十五将天仪 48 星、甘德一号 01 星、西光贰号 03 星、吉天星 A-04 星、应龙风光一号共 5 颗卫星送入预定轨道。其中甘德一号 01 星是国内首颗商业空间碎片监测专用卫星；吉天星 A-04 搭载国产沐曦 GPU 智算载荷，实现“算力上天”。力箭一号已累计送 110 颗卫星入轨，是国内唯一破百的民商火箭，本次为第 15 次飞行，入轨总质量超 16 吨。",
      compare: "与站内“引力一号遥四海上发射”（固体、海上、一箭九星）同为民营火箭成功案例，但力箭一号走“陆基固体+高频次”路线，且累计入轨数率先破百，标志商业航天从“偶尔成功”迈向“班车化”；“空间碎片监测”则补上了商业天基态势感知的空白。",
      why: "太空越来越挤，失效卫星与碎片构成碰撞威胁；专用监测卫星+算力上天，让商业航天从“把星送上去”升级到“在轨管理与智能处理”，从“运输”走向“运营”。",
      output: "5 星入轨（含首颗商业空间碎片监测卫星、首颗上天智算载荷）；力箭一号累计入轨 110 颗、总质量超 16 吨。交付的是“运输+在轨智能”组合能力。",
      explain: "技术解析：本次任务的架构性亮点在“感知+计算上天”。甘德一号是商业空间碎片监测专用星，用光学/雷达手段对轨道碎片编目，相当于在轨“交通摄像头”，为卫星碰撞预警提供数据。吉天星 A-04 把国产 AI 计算芯片（沐曦 GPU）直接作为载荷送上星，使卫星具备在轨推理能力——传统遥感卫星把原始数据全部传回地面处理，带宽与时延受限；在轨智算可在星上完成目标识别、变化检测，只回传“结论”，大幅降低下行带宽需求。这是“边缘计算”范式向太空的延伸，意味着卫星从“传感器”升级为“智能节点”。",
      impact: "商业航天进入“规模化+在轨智能”阶段；空间碎片监测填补态势感知空白，利好太空交通管理；“算力上天”预示卫星从“拍照回传”升级为“在轨分析”，重构遥感数据产业链。",
      action: "关注商业航天（火箭/卫星制造/遥感/在轨计算）产业链；创业者留意“一箭多星拼车”低成本窗口；普通读者可把发射频次当作国产民营航天成熟度的晴雨表。",
      archCaption: "将监测与 AI 计算直接送上轨道，推动“在轨智能”而非仅“拍照回传”。",
            sources: [
        { name: "央视网", url: "https://news.cctv.com/2026/07/24/ARTIAR25noD83qaSLS1PBLnH260724.shtml" },
        { name: "中国青年网", url: "https://news.youth.cn/jsxw/202607/t20260725_16783202.htm" }
      ],
      architecture: '<svg viewBox="0 0 660 210" role="img" aria-label="力箭一号与在轨智能" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-lj" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="82" width="150" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="95" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">力箭一号（固体）</text><rect x="200" y="82" width="110" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="255" y="110" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">一箭五星</text><rect x="360" y="40" width="160" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="440" y="70" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">甘德一号 碎片监测</text><rect x="360" y="120" width="160" height="50" rx="9" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="440" y="150" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">吉天星A-04 在轨智算</text><rect x="550" y="82" width="90" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="595" y="110" fill="var(--text-soft)" font-size="11" font-weight="700" text-anchor="middle">空间管理</text><line x1="170" y1="104" x2="196" y2="104" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-lj)"/><line x1="310" y1="100" x2="356" y2="78" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-lj)"/><line x1="310" y1="108" x2="356" y2="142" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-lj)"/><line x1="520" y1="100" x2="546" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-lj)"/></svg>'
    },
    {
      id: "bci-thousand-sync",
      week: "w5",
      category: "tech",
      tags: ["脑机接口", "神经科学", "数据底座", "医疗康复", "消费级"],
      impactScore: 80,
      title: "我国脑机接口实现全球首次跨地域千人级同步脑电采集",
      summary: "科研团队发布新型脑电采集装置，首次实现跨地域上千人同步脑电采集，攻克小型化与毫秒级时间对齐，为神经基础模型提供“数据底座”。",
      what: "7 月 22 日，我国科研团队发布新型脑电信号采集装置，首次实现跨地域上千人同步脑电信号采集，攻克设备小型化与毫秒级跨地域时间对齐两大难题。单场即可积累上千小时真实脑电数据，支撑疲劳驾驶提示等场景，呼应“十五五”脑机接口重点培育方向。",
      compare: "与站内“人形机器人实景实训”“光子芯片”等偏硬件突破不同，这是“数据基础设施”突破——脑机接口长期卡在“真实脑电数据太少”，本工作用“千人同步采集”一次性造出海量高质量数据底座，类似给脑机装上了“大数据油田”。",
      why: "脑电数据匮乏是制约神经基础模型与通用脑机接口的核心瓶颈；海量、对齐良好的真实数据，将加速从医疗康复走向更广消费级应用，也是“数据—模型—终端”链条的起点。",
      output: "全球首例跨地域千人级同步脑电采集装置；单场积累上千小时真实脑电数据。交付的是“数据底座”能力。",
      explain: "技术解析：脑机接口要“聪明”，需大量人脑电波样本训练模型。难点有二：① 设备小型化——让上千人能在多地自然佩戴采集，而非实验室固定电极帽；② 跨地域时间对齐——多地时钟存在漂移，必须用统一时间基准（如卫星授时/PTP）把各路信号对齐到毫秒级，否则无法做跨被试联合分析。本工作的架构是“分布式可穿戴采集终端 + 统一授时 + 中心化数据湖”：各终端本地采集，时间戳经统一基准校正后汇入数据湖，从而把“多地异构数据”变成“可互相比较的同框数据”。这正是训练神经基础模型的前提——没有对齐的高质量大数据，模型无从学起。",
      impact: "为神经基础模型与通用脑机接口提供关键数据底座；加速脑机从医疗康复（瘫痪操控、抑郁干预）走向疲劳监测等消费级场景；呼应国家“十五五”重点培育方向。",
      action: "医疗/科研从业者：关注该数据底座的开放与协作机会；投资人：跟踪脑机接口“数据—模型—终端”链条；普通读者：未来 3–5 年可留意消费级脑电头环在睡眠/专注/驾驶安全上的落地。",
      archCaption: "跨地域同步采集 + 精确时间对齐，一次性构建海量高质量脑电数据底座。",
            sources: [
        { name: "央视财经（经腾讯）", url: "https://new.qq.com/rain/a/20260723A0C3M700" },
        { name: "界面新闻", url: "https://www.163.com/dy/article/L2HQ286C0534A4SC.html" }
      ],
      architecture: '<svg viewBox="0 0 660 200" role="img" aria-label="跨地域脑电同步采集" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah-bc" markerWidth="10" markerHeight="10" refX="7.5" refY="4" orient="auto-start-reverse"><path d="M0,0 L9,4 L0,8 Z" fill="var(--text-soft)"/></marker></defs><rect x="20" y="56" width="160" height="88" rx="11" fill="var(--brand-soft)" stroke="var(--accent-tech)" stroke-width="1.5"/><text x="100" y="90" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">多地受试者</text><text x="100" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">可穿戴 EEG（城A/B/C）</text><rect x="220" y="78" width="160" height="44" rx="9" fill="var(--brand-soft)" stroke="var(--brand)" stroke-width="1.5"/><text x="300" y="106" fill="var(--text)" font-size="12" font-weight="700" text-anchor="middle">毫秒级时间对齐</text><rect x="420" y="56" width="150" height="88" rx="11" fill="var(--brand-soft)" stroke="var(--accent-ai)" stroke-width="1.5"/><text x="495" y="90" fill="var(--text)" font-size="12.5" font-weight="700" text-anchor="middle">脑电数据湖</text><text x="495" y="112" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">单场千+小时</text><rect x="600" y="78" width="58" height="44" rx="9" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/><text x="629" y="105" fill="var(--text-soft)" font-size="11" font-weight="600" text-anchor="middle">模型</text><line x1="180" y1="100" x2="216" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bc)"/><line x1="380" y1="100" x2="416" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bc)"/><line x1="570" y1="100" x2="596" y2="100" stroke="var(--text-soft)" stroke-width="1.5" marker-end="url(#ah-bc)"/></svg>'
    }
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = NEWS_DATA;
}
if (typeof window !== "undefined") {
  window.NEWS_DATA = NEWS_DATA;
}
