/**
 * AI工作流与个人知识库系列
 * 聚焦非技术用户可执行的知识管理、Skills与自动化实践
 */

COURSES.push(
  {
    id: 'workflow-foundation',
    title: '🧭 基础认知与安全',
    lessons: [
      {
        id: 'wf-1',
        title: 'AI工具地图与任务选型',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>不再追着工具榜单跑，而是根据任务、数据和风险选择合适的AI能力。</p>

            <div class="block">
              <h4>先分任务，再选工具</h4>
              <table class="lesson-table">
                <tr><th>任务类型</th><th>优先能力</th><th>典型产出</th></tr>
                <tr><td>解释与写作</td><td>对话模型</td><td>摘要、提纲、初稿</td></tr>
                <tr><td>找最新事实</td><td>联网搜索/研究工具</td><td>带日期与来源的事实表</td></tr>
                <tr><td>处理本地文件</td><td>知识库或文件型Agent</td><td>结构化笔记、索引、引用</td></tr>
                <tr><td>改代码和批量文件</td><td>编码Agent</td><td>可审查的文件变更与测试结果</td></tr>
                <tr><td>跨应用执行</td><td>连接器/自动化</td><td>消息、表格、日程或发布动作</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>四步选型法</h4>
              <ol>
                <li><strong>任务：</strong>是生成、检索、分析，还是执行？</li>
                <li><strong>时效：</strong>需要最新信息，还是只基于已有材料？</li>
                <li><strong>数据：</strong>资料能否上传到第三方服务？</li>
                <li><strong>后果：</strong>出错后只是返工，还是会造成资金、隐私或声誉损失？</li>
              </ol>
              <div class="lesson-tip">💡 高风险任务的默认策略：AI做准备，人做判断；先预览，再执行。</div>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：做一张工具选择卡</h4>
              <p>任选一个真实任务，例如“整理一份行业周报”，写下：输入材料、是否要联网、是否含敏感数据、AI可做步骤、必须人工确认步骤。</p>
              <p><strong>产出物：</strong>一张五栏任务卡。</p>
              <p><strong>验收：</strong>能说清为什么选这个工具，也能说清它不该做什么。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-2',
        title: '高质量提问与复杂任务拆解',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>把“帮我做一下”改造成可执行、可检查、可复用的任务说明。</p>

            <div class="block">
              <h4>任务说明六要素</h4>
              <table class="lesson-table">
                <tr><th>要素</th><th>要回答的问题</th></tr>
                <tr><td>目标</td><td>最终要解决什么问题？</td></tr>
                <tr><td>背景</td><td>给谁用，为什么现在做？</td></tr>
                <tr><td>输入</td><td>可使用哪些资料与数据？</td></tr>
                <tr><td>约束</td><td>时间、范围、语气、禁区是什么？</td></tr>
                <tr><td>输出</td><td>要表格、清单、文章还是文件？</td></tr>
                <tr><td>验收</td><td>怎样才算完成，怎样算错误？</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>复杂任务拆成四段</h4>
              <ol>
                <li><strong>探索：</strong>确认资料、缺口和不确定性。</li>
                <li><strong>计划：</strong>列步骤、依赖、风险与人工确认点。</li>
                <li><strong>执行：</strong>小批量产出，保留中间结果。</li>
                <li><strong>验证：</strong>按验收表检查事实、格式和遗漏。</li>
              </ol>
              <p>这样做的价值不是让提示词更长，而是让错误更早暴露。</p>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：重写一个模糊需求</h4>
              <p><strong>原需求：</strong>“帮我研究一下AI教育。”</p>
              <p><strong>改写要求：</strong>限定目标读者、市场范围、时间窗口、来源要求、分析维度、输出格式和三条验收标准。</p>
              <p><strong>产出物：</strong>一张可直接交给AI执行的任务卡。</p>
              <p><strong>验收：</strong>另一个人不用追问，就能按卡片开始工作。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-3',
        title: '输出核验、隐私、版权与权限边界',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>建立AI输出的“安全带”：知道什么要核验、什么不能上传、什么必须人工批准。</p>

            <div class="block">
              <h4>四类数据，四种处理方式</h4>
              <table class="lesson-table">
                <tr><th>级别</th><th>示例</th><th>建议</th></tr>
                <tr><td>公开</td><td>官网、公开报告</td><td>可使用，仍需标注来源</td></tr>
                <tr><td>内部</td><td>流程、未公开方案</td><td>仅在获批工具和范围内使用</td></tr>
                <tr><td>敏感</td><td>客户资料、合同、财务明细</td><td>脱敏或使用私有环境</td></tr>
                <tr><td>机密</td><td>密钥、密码、核心商业秘密</td><td>不要输入模型；采用专门的安全流程</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>发布前五项核验</h4>
              <ul>
                <li><strong>事实：</strong>人名、机构、数字、日期是否有原始来源？</li>
                <li><strong>时效：</strong>来源发布时间与事件发生时间是否混淆？</li>
                <li><strong>引用：</strong>引号里的话是否真的说过，语境是否完整？</li>
                <li><strong>计算：</strong>单位、分母、同比环比和汇率是否正确？</li>
                <li><strong>版权：</strong>是否大段复制，是否具备使用授权？</li>
              </ul>
              <div class="lesson-tip">⚠️ 涉及转账、发布、删除、签约、医疗或投资决策时，保留明确的人工确认。</div>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：建立发布前清单</h4>
              <p>为你最常用的一类AI输出建立10项检查清单，并标记“AI可检查”和“必须人工检查”。</p>
              <p><strong>产出物：</strong>一份可复制的发布前检查模板。</p>
              <p><strong>验收：</strong>清单至少覆盖来源、日期、隐私、版权、数字和最终批准人。</p>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'workflow-knowledge',
    title: '🧠 个人知识库',
    lessons: [
      {
        id: 'wf-4',
        title: 'Obsidian本地知识库：仓库、Markdown与目录',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>用本地Markdown搭一个不依赖单一平台、便于AI读取的最小知识库。</p>

            <div class="block">
              <h4>推荐的最小目录</h4>
              <table class="lesson-table">
                <tr><th>目录</th><th>用途</th></tr>
                <tr><td>00-Inbox</td><td>刚收集、尚未整理的材料</td></tr>
                <tr><td>10-Projects</td><td>有目标和截止时间的项目</td></tr>
                <tr><td>20-Areas</td><td>长期负责的领域，如理财、健康、职业</td></tr>
                <tr><td>30-Resources</td><td>主题资料、书摘和参考内容</td></tr>
                <tr><td>90-Archive</td><td>已结束但需要保留的内容</td></tr>
                <tr><td>Templates</td><td>重复使用的笔记模板</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>先守住三个原则</h4>
              <ul>
                <li><strong>原文与观点分开：</strong>不要让自己的总结覆盖原始材料。</li>
                <li><strong>文件名可搜索：</strong>使用“主题-日期-来源”，避免“新建文档12”。</li>
                <li><strong>先简单再扩展：</strong>连续使用一周后，再决定是否安装插件。</li>
              </ul>
              <p>本地不等于自动安全。知识库仍需备份，可使用版本控制、加密磁盘或可信云盘。</p>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：建立第一座仓库</h4>
              <ol>
                <li>创建上面的六个目录。</li>
                <li>把最近三份资料放入Inbox，并改成可搜索文件名。</li>
                <li>写一页README，说明目录规则和备份方式。</li>
              </ol>
              <p><strong>验收：</strong>两分钟内能找到任意一份资料，也能解释它为什么放在这里。</p>
              <p><a href="https://help.obsidian.md/" target="_blank" rel="noopener noreferrer">延伸阅读：Obsidian官方帮助</a></p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-5',
        title: '标签、双向链接、模板与知识图谱',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>让知识库从“文件柜”升级成“能找到关系的思考网络”。</p>

            <div class="block">
              <h4>四种组织方式各司其职</h4>
              <table class="lesson-table">
                <tr><th>方式</th><th>适合表达</th><th>例子</th></tr>
                <tr><td>目录</td><td>内容归属</td><td>项目、领域、资料</td></tr>
                <tr><td>标签</td><td>跨目录状态或属性</td><td>#待核验、#案例、#观点</td></tr>
                <tr><td>双向链接</td><td>概念之间的关系</td><td>通胀 → 利率 → 债券价格</td></tr>
                <tr><td>模板</td><td>重复的信息结构</td><td>新闻卡、人物卡、项目复盘</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>一张合格的来源笔记</h4>
              <pre><code>title: 主题
source: 原始链接或文件
published: 2026-09-20
captured: 2026-09-20
status: 待核验

## 原文事实
## 我的理解
## 仍待确认
## 相关笔记</code></pre>
              <p>“原文事实”和“我的理解”分开，是后续让AI生成内容时最重要的防混淆设计。</p>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：连接三个概念</h4>
              <p>选一个你正在学习的主题，创建三张永久笔记；每张只讲一个观点，并至少建立两个双向链接。</p>
              <p><strong>产出物：</strong>来源笔记模板、永久笔记模板、三张互联笔记。</p>
              <p><strong>验收：</strong>不看目录，仅通过链接也能理解三者关系；标签不超过10个常用项。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-6',
        title: '录音、PDF、PPT、网页资料清洗入库',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>把不同格式的材料统一变成可追溯、可检索、可复用的知识单元。</p>

            <div class="block">
              <h4>统一入库流水线</h4>
              <ol>
                <li><strong>保留原件：</strong>原始录音、PDF、PPT或网页快照单独存放。</li>
                <li><strong>提取文本：</strong>转写、OCR或解析，同时记录工具和时间。</li>
                <li><strong>清洗：</strong>去页眉页脚、重复段、广告和无意义断行。</li>
                <li><strong>补元数据：</strong>来源、作者、日期、主题、授权和可信度。</li>
                <li><strong>切分主题：</strong>按语义和章节拆，不按固定字数硬切。</li>
                <li><strong>人工抽查：</strong>核验数字、专有名词、结论和引用位置。</li>
              </ol>
            </div>

            <div class="block">
              <h4>不同材料的高风险点</h4>
              <table class="lesson-table">
                <tr><th>材料</th><th>常见错误</th><th>重点抽查</th></tr>
                <tr><td>录音</td><td>同音词、说话人错配</td><td>人名、数字、结论</td></tr>
                <tr><td>扫描PDF</td><td>OCR漏字、表格错列</td><td>表头、脚注、单位</td></tr>
                <tr><td>PPT</td><td>只提文字，丢失图表语义</td><td>图注、坐标、页间逻辑</td></tr>
                <tr><td>网页</td><td>内容更新或链接失效</td><td>抓取日期、作者、快照</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：完成一次可追溯入库</h4>
              <p>任选一份10页以上PDF或15分钟录音，生成来源卡、结构化摘要、5张知识卡和一份错误抽查记录。</p>
              <p><strong>验收：</strong>每个关键结论都能回到原文件位置；原件、清洗文本和个人观点彼此分离。</p>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'workflow-skills',
    title: '🧰 Codex与Skills',
    lessons: [
      {
        id: 'wf-7',
        title: 'Codex连接本地知识库：安全读写与复盘',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>让编码Agent帮助整理本地知识库，同时保持变更可见、可撤销、可追责。</p>

            <div class="block">
              <h4>安全接入五原则</h4>
              <ul>
                <li><strong>最小目录：</strong>只开放当前知识库，不授权整个磁盘。</li>
                <li><strong>先备份：</strong>批量修改前提交版本或制作快照。</li>
                <li><strong>先读后写：</strong>先让Agent复述目录规则和拟改文件。</li>
                <li><strong>小批执行：</strong>先处理3份样本，通过后再扩大。</li>
                <li><strong>看差异：</strong>检查新增、删除、移动和内容改写。</li>
              </ul>
            </div>

            <div class="block">
              <h4>适合交给Agent的知识库任务</h4>
              <table class="lesson-table">
                <tr><th>可自动化</th><th>应人工决定</th></tr>
                <tr><td>统一文件名、补元数据、查找重复</td><td>删除原件、覆盖观点、公开发布</td></tr>
                <tr><td>生成索引、发现孤立笔记、检查失效链接</td><td>判断来源可信度和结论是否成立</td></tr>
                <tr><td>按模板生成待审草稿</td><td>最终归档位置和对外表述</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：整理Inbox</h4>
              <p>要求Agent先列计划，再对3份Inbox笔记补元数据、建议链接和归档位置；不允许删除或移动，最后输出变更摘要。</p>
              <p><strong>验收：</strong>能看到每个文件改了什么；撤销一次操作后可恢复；没有密钥和隐私信息进入日志。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-8',
        title: '创建第一个可复用Skill',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>把一套反复使用的做事方法，写成能稳定触发、按同一标准执行的Skill。</p>

            <div class="block">
              <h4>Skill的最小结构</h4>
              <p>一个Skill至少包含一个 <strong>SKILL.md</strong>；还可以按需加入脚本、参考资料和模板资源。</p>
              <pre><code>my-skill/
├── SKILL.md
├── scripts/       可选：重复执行的脚本
├── references/    可选：规范和资料
└── assets/        可选：模板和素材</code></pre>
              <p>SKILL.md开头需要name和description；description要同时写清“什么时候用”和“什么时候不用”。</p>
            </div>

            <div class="block">
              <h4>最小示例：来源核验助手</h4>
              <pre><code>---
name: source-checker
description: 核验文章中的日期、数字和引用；不用于生成未经核验的新闻。
---

1. 提取所有事实性主张。
2. 为每条主张记录来源、发布日期和事件日期。
3. 标记无法核验、来源冲突和二手转述。
4. 不改写原文，先输出核验报告。</code></pre>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：做一个自己的Skill</h4>
              <p>从“周报整理、会议纪要、资料入库、新闻核验”中选一个，写明触发条件、输入、步骤、输出、禁止事项和三条验收标准。</p>
              <p><strong>验收：</strong>用3个应触发案例、2个不应触发案例测试；不同材料得到相同结构的结果。</p>
              <p><a href="https://developers.openai.com/zh-Hans/docs/build-skills" target="_blank" rel="noopener noreferrer">延伸阅读：OpenAI官方Skills文档</a></p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-9',
        title: 'Skill串联、人工确认与失败兜底',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>把单个Skill组成可靠流程，避免上一步的小错被下一步放大。</p>

            <div class="block">
              <h4>先约定输入输出合同</h4>
              <table class="lesson-table">
                <tr><th>节点</th><th>输入</th><th>输出</th><th>失败时</th></tr>
                <tr><td>采集</td><td>来源清单</td><td>带时间与链接的事实表</td><td>记录缺失来源</td></tr>
                <tr><td>去重</td><td>事实表</td><td>事件簇与主来源</td><td>保留疑似重复</td></tr>
                <tr><td>分析</td><td>事件簇</td><td>证据、推断、反方观点</td><td>降级为待研究</td></tr>
                <tr><td>发布</td><td>已审稿件</td><td>平台格式内容</td><td>禁止自动发布</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>可靠流程的四个护栏</h4>
              <ul>
                <li><strong>状态明确：</strong>待处理、处理中、待人工确认、完成、失败。</li>
                <li><strong>可重复执行：</strong>同一输入再次运行，不应产生重复记录或重复发布。</li>
                <li><strong>重试有限：</strong>设置重试次数，连续失败就停止并告警。</li>
                <li><strong>高风险闸门：</strong>外发、删除、付款和权限变更前必须确认。</li>
              </ul>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：画一条三节点流程</h4>
              <p>串联“资料清洗 → 摘要生成 → 知识卡入库”，为每一步写清输入字段、输出字段、失败状态和人工确认点。</p>
              <p><strong>验收：</strong>故意移除一个必填字段，流程会停止并说明原因，而不是继续编造。</p>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'workflow-projects',
    title: '🚀 场景项目',
    lessons: [
      {
        id: 'wf-10',
        title: '热点采集、去重、观点输出与多平台适配',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>做一条从事实采集到观点发布的完整内容流水线，同时解决重复、失真和“只有摘要没有判断”的问题。</p>

            <div class="block">
              <h4>六步热点工作流</h4>
              <ol>
                <li><strong>定范围：</strong>主题、地区、语言、时间窗口和截止时间。</li>
                <li><strong>多源采集：</strong>优先官方公告、原始讲话和一手数据，再看媒体解读。</li>
                <li><strong>按事件去重：</strong>相同主体、动作、对象和时间归为一个事件簇。</li>
                <li><strong>判断传播阶段：</strong>刚发生、快速扩散、观点分化或热度衰退。</li>
                <li><strong>形成独立观点：</strong>区分事实、推断、影响和待观察信号。</li>
                <li><strong>适配平台：</strong>改变长度和结构，不改变事实与结论。</li>
              </ol>
            </div>

            <div class="block">
              <h4>事件卡必须包含</h4>
              <table class="lesson-table">
                <tr><th>字段</th><th>要求</th></tr>
                <tr><td>一句话事实</td><td>只写已确认发生了什么</td></tr>
                <tr><td>主来源</td><td>原始链接、发布时间、事件日期</td></tr>
                <tr><td>为什么重要</td><td>关联人群、行业或资产</td></tr>
                <tr><td>我的判断</td><td>写逻辑链，并标明这是推断</td></tr>
                <tr><td>反方与风险</td><td>什么证据会推翻当前判断</td></tr>
                <tr><td>后续信号</td><td>下一步观察的指标或事件</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：生成一份无重复日报</h4>
              <p>采集10条同主题信息，合并成不超过5个事件簇，为每个事件保留主来源和差异信息，再生成长文版与100字短版。</p>
              <p><strong>验收：</strong>没有同一事件重复占位；事实和观点分栏；发布前有人工确认；无法核验的内容不进入正文。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-11',
        title: '个人IP知识库：语言、观点、故事与判断逻辑',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>让AI学习你的素材和表达边界，而不是模仿几句口头禅后生成“塑料味”内容。</p>

            <div class="block">
              <h4>个人IP知识库的六个模块</h4>
              <table class="lesson-table">
                <tr><th>模块</th><th>收什么</th><th>用途</th></tr>
                <tr><td>语言风格</td><td>句长、节奏、常用结构、禁用词</td><td>保持表达一致</td></tr>
                <tr><td>金句库</td><td>本人原话与出处</td><td>避免伪造语录</td></tr>
                <tr><td>观点库</td><td>主张、证据、反例、更新时间</td><td>形成稳定立场</td></tr>
                <tr><td>故事库</td><td>经历、冲突、转折、启发</td><td>增强真实感</td></tr>
                <tr><td>私域话术</td><td>欢迎、答疑、转化和边界</td><td>提高沟通一致性</td></tr>
                <tr><td>决策逻辑</td><td>判断标准、优先级、否决条件</td><td>让内容体现思考方式</td></tr>
              </table>
            </div>

            <div class="block">
              <h4>从原始材料中提炼，而不是凭空编人设</h4>
              <ul>
                <li>原始录音、文章和聊天记录只读保存，并标明日期与场景。</li>
                <li>AI提取后由本人确认，尤其是立场、故事和承诺。</li>
                <li>观点保留版本：为什么改变、证据是什么、旧观点何时失效。</li>
                <li>定期做缺口诊断：哪些主题有表达风格，却没有事实与案例支撑？</li>
              </ul>
            </div>

            <div class="block">
              <h4>🛠️ 动手练习：建立第一版IP档案</h4>
              <p>选择5篇本人内容或30分钟录音，提取10条表达规则、5个观点、3个故事和3条决策原则，并为每条附原始出处。</p>
              <p><strong>验收：</strong>让熟悉你的人盲评三段AI草稿；不仅“像你说话”，也“符合你的判断”。</p>
            </div>
          </div>
        `
      },
      {
        id: 'wf-12',
        title: '综合项目：研究助手与自动交付',
        content: `
          <div class="lesson-content">
            <h3>🎯 本节目标</h3>
            <p>把前11节组合成一个可重复运行的研究助手，并用真实交付检验系统是否可靠。</p>

            <div class="block">
              <h4>任选一个真实项目</h4>
              <ul>
                <li>行业研究：每周追踪政策、公司与技术变化。</li>
                <li>竞品分析：监控产品更新、定价、用户反馈和传播动作。</li>
                <li>投资研究：整理公开事实、核心假设、反方证据和风险信号。</li>
                <li>学习助手：把课程、论文和笔记转成知识卡与复习题。</li>
                <li>客户线索：从公开信息中筛选对象，但不采集或滥用敏感个人信息。</li>
              </ul>
            </div>

            <div class="block">
              <h4>完整交付链</h4>
              <ol>
                <li><strong>输入：</strong>定义来源白名单、时间窗口和采集频率。</li>
                <li><strong>处理：</strong>清洗、去重、补元数据并保留原始证据。</li>
                <li><strong>分析：</strong>区分事实、解释、假设、反方和未知。</li>
                <li><strong>输出：</strong>生成固定模板的日报、周报或研究卡。</li>
                <li><strong>确认：</strong>高风险结论和所有外发内容人工批准。</li>
                <li><strong>反馈：</strong>记录错误、遗漏、耗时和下一轮改进。</li>
              </ol>
            </div>

            <div class="block">
              <h4>毕业验收表</h4>
              <table class="lesson-table">
                <tr><th>标准</th><th>通过条件</th></tr>
                <tr><td>可追溯</td><td>关键事实都能回到原始来源与日期</td></tr>
                <tr><td>不重复</td><td>同一事件不会生成多条重复记录</td></tr>
                <tr><td>可重跑</td><td>同一批输入再次运行不会重复写入或发布</td></tr>
                <tr><td>有边界</td><td>隐私、版权和高风险动作有明确闸门</td></tr>
                <tr><td>有日志</td><td>记录成功、失败、人工修改和异常原因</td></tr>
                <tr><td>能改进</td><td>至少完成一次基于错误样本的迭代</td></tr>
              </table>
              <p><strong>最终产出：</strong>流程图、任务说明、一个Skill、三次运行结果、错误清单和复盘报告。</p>
            </div>

            <div class="lesson-tip">🎓 真正的自动化不是“完全没人管”，而是把人工判断放在最值得的位置。</div>
          </div>
        `
      }
    ]
  }
);
