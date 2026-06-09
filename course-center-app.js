/**
 * 课程中心 - 应用逻辑
 * 支持多系列课程的卡片式布局
 * 集成 course-data.js 中的完整课程内容
 * 所有课程都可以自由浏览，支持打卡/取消打卡
 */

// 当前状态
let currentView = 'center';
let currentSeries = null;
let currentLessonId = null;

const AI_PM_DEEPENING_PACKS = {
    'cog-1': {
        skills: ['AI产品岗位边界', '技术不确定性管理', '跨职能协作'],
        output: '写一页《AI PM岗位能力拆解》：职责、协作对象、验收指标、容易踩坑的决策。',
        practice: '选一个AI功能，把“用户问题、模型能力、失败兜底、业务指标”写成4格表。',
        readings: [
            ['Google People + AI Guidebook', 'https://pair.withgoogle.com/guidebook/'],
            ['OpenAI Production Best Practices', 'https://platform.openai.com/docs/guides/production-best-practices']
        ]
    },
    'cog-2': {
        skills: ['AI产业链判断', '赛道商业化', '机会筛选'],
        output: '做一张AI行业机会地图：基础设施、模型层、工具层、行业应用，各列3个代表产品。',
        practice: '用“痛点频率、付费意愿、AI提升幅度、数据壁垒”给3个AI产品机会打分。',
        readings: [
            ['Stanford AI Index Report', 'https://aiindex.stanford.edu/report/'],
            ['a16z AI Consumer Apps', 'https://a16z.com/100-gen-ai-apps/']
        ]
    },
    'cog-3': {
        skills: ['技术沟通', '需求澄清', '验收口径'],
        output: '写一份给工程师看的AI功能需求说明：输入、输出、边界、指标、降级策略。',
        practice: '把“做得更智能”改写成可开发需求，至少包含准确率、延迟、异常处理。',
        readings: [
            ['Google Machine Learning Rules', 'https://developers.google.com/machine-learning/guides/rules-of-ml'],
            ['Atlassian Team Playbook', 'https://www.atlassian.com/team-playbook']
        ]
    },
    'tech-1': {
        skills: ['模型选型', '评测集设计', '成本/质量/延迟权衡'],
        output: '建立一个模型选型表：任务类型、候选模型、质量分、延迟、单次成本、风险。',
        practice: '准备20条真实用户问题，对比两个模型输出，并记录坏案例类型。',
        readings: [
            ['OpenAI Evals Guide', 'https://platform.openai.com/docs/guides/evals'],
            ['Anthropic Prompt Engineering', 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview']
        ]
    },
    'tech-2': {
        skills: ['Token成本估算', '单位经济模型', '缓存/分层调用'],
        output: '算一份AI功能月成本：DAU、调用频次、平均token、模型单价、峰值预算。',
        practice: '设计“便宜模型初筛 + 贵模型复核 + 缓存命中”的成本优化方案。',
        readings: [
            ['OpenAI Pricing', 'https://openai.com/api/pricing/'],
            ['Google Cloud FinOps', 'https://cloud.google.com/finops']
        ]
    },
    'tech-3': {
        skills: ['Agent边界设计', '工具调用', '人类确认点'],
        output: '画一个Agent任务流：目标、计划、工具、执行、失败重试、人工审批。',
        practice: '设计一个“AI客服Agent”，明确哪些动作可以自动做，哪些必须人工确认。',
        readings: [
            ['OpenAI Function Calling', 'https://platform.openai.com/docs/guides/function-calling'],
            ['Model Context Protocol Docs', 'https://modelcontextprotocol.io/docs']
        ]
    },
    'data-1': {
        skills: ['AI指标体系', '离线/在线评估', '业务指标映射'],
        output: '搭一套指标树：模型指标、产品指标、业务指标、风险指标各3个。',
        practice: '给一个RAG问答产品定义“准确、好用、值得付费”的指标组合。',
        readings: [
            ['OpenAI Evals Guide', 'https://platform.openai.com/docs/guides/evals'],
            ['Evidently AI ML Monitoring', 'https://www.evidentlyai.com/ml-monitoring']
        ]
    },
    'data-2': {
        skills: ['实验设计', 'A/B测试', '冠军/挑战者机制'],
        output: '写一份AI功能实验方案：假设、样本、指标、护栏、上线阈值。',
        practice: '把“新模型更好”拆成可验证实验，不只看满意度，也看错误率和成本。',
        readings: [
            ['Microsoft Experimentation Platform Papers', 'https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/'],
            ['Trustworthy Online Controlled Experiments', 'https://www.exp-platform.com/']
        ]
    },
    'des-1': {
        skills: ['AI交互设计', '信任校准', '可控性'],
        output: '做一份AI交互检查表：用户输入、AI反馈、置信度、编辑权、撤销和重试。',
        practice: '选一个AI产品，指出3个让用户信任或不信任它的界面细节。',
        readings: [
            ['Google People + AI Guidebook', 'https://pair.withgoogle.com/guidebook/'],
            ['NN/g AI UX Research', 'https://www.nngroup.com/topic/artificial-intelligence/']
        ]
    },
    'des-2': {
        skills: ['失败兜底', '异常体验', '风险分级'],
        output: '写一份降级策略：模型失败、超时、幻觉、高风险输出分别怎么处理。',
        practice: '给金融AI助手设计“错误回答后的用户补救路径”。',
        readings: [
            ['NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework'],
            ['OWASP Top 10 for LLM Applications', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/']
        ]
    },
    'des-3': {
        skills: ['AI合规', '审计留痕', 'Prompt注入防护'],
        output: '输出一张金融AI风险清单：数据、模型、用户提示、输出、人工审核。',
        practice: '写3条金融AI红线：不能承诺收益、不能替用户下单、不能绕过合规审批。',
        readings: [
            ['EU AI Act Overview', 'https://artificialintelligenceact.eu/'],
            ['OWASP LLM Security', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/']
        ]
    },
    'prac-1': {
        skills: ['0到1产品闭环', 'MVP范围', '数据飞轮'],
        output: '写一份AI产品一页纸PRD：用户、场景、MVP、指标、风险、迭代计划。',
        practice: '把“AI学习助手”缩小到一个两周能上线的MVP。',
        readings: [
            ['Shape Up', 'https://basecamp.com/shapeup'],
            ['OpenAI Prompt Engineering', 'https://platform.openai.com/docs/guides/prompt-engineering']
        ]
    },
    'prac-2': {
        skills: ['面试表达', '案例结构化', '岗位匹配'],
        output: '准备一套AI PM面试故事：一个产品判断、一个技术协作、一个指标复盘。',
        practice: '用STAR结构回答“你如何评估一个AI功能是否成功”。',
        readings: [
            ['Exponent PM Interview Guide', 'https://www.tryexponent.com/product-manager-interview'],
            ['Lenny Product Sense', 'https://www.lennysnewsletter.com/']
        ]
    },
    'prac-3': {
        skills: ['上线策略', '灰度发布', '回滚预案'],
        output: '写一份AI模型上线Runbook：灰度、监控、报警、回滚、责任人。',
        practice: '设计一个新Prompt上线流程，避免直接全量替换。',
        readings: [
            ['Google SRE Book', 'https://sre.google/sre-book/table-of-contents/'],
            ['LaunchDarkly Feature Management', 'https://launchdarkly.com/']
        ]
    },
    'prac-4': {
        skills: ['竞品拆解', 'PM决策复盘', '产品策略'],
        output: '拆一个AI产品：目标用户、核心路径、模型能力、商业模式、护城河。',
        practice: '用同一模板对比Perplexity和Notion AI，找出它们PM决策的不同。',
        readings: [
            ['Perplexity Blog', 'https://www.perplexity.ai/hub/blog'],
            ['Notion AI', 'https://www.notion.so/product/ai']
        ]
    },
    'prac-5': {
        skills: ['作品集', 'Demo表达', '技术可信度'],
        output: '准备一份AI PM作品集页面：问题、方案、Demo、指标、复盘。',
        practice: '把你的网站作为作品集案例，写出“为什么做、怎么验证、下一步”。',
        readings: [
            ['GitHub Docs: Portfolio README', 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes'],
            ['Product Hunt Launch Guide', 'https://www.producthunt.com/launch']
        ]
    },
    'prac-6': {
        skills: ['AI工具链', '原型效率', '技术沟通'],
        output: '建立自己的AI工具工作流：调研、PRD、原型、代码、测试、发布。',
        practice: '用Cursor或Codex完成一个小功能，并记录AI帮你节省了哪一步。',
        readings: [
            ['Cursor Docs', 'https://docs.cursor.com/'],
            ['OpenAI Codex', 'https://openai.com/codex/']
        ]
    }
};

// 获取课程进度
function getCourseProgress() {
    try {
        return JSON.parse(localStorage.getItem('ai_pm_course_progress') || '{}');
    } catch(e) {
        return {};
    }
}

// 保存课程进度
function saveCourseProgress(progress) {
    localStorage.setItem('ai_pm_course_progress', JSON.stringify(progress));
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCourseCenter();
    
    // 关闭弹窗事件
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    const courseModal = document.getElementById('courseModal');
    if (courseModal) {
        courseModal.addEventListener('click', (e) => {
            if (e.target.id === 'courseModal') {
                closeModal();
            }
        });
    }
});

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    currentLessonId = null;
}

// 渲染课程中心主页
function renderCourseCenter() {
    const container = document.getElementById('courseCenter');
    if (!container) return;
    
    currentView = 'center';
    currentSeries = null;
    
    // 计算AI产品经理系列的进度
    let pmProgress = 0;
    let pmCompleted = 0;
    let pmTotal = 0;
    const progress = getCourseProgress();
    
    if (typeof COURSES !== 'undefined') {
        COURSES.forEach(section => {
            if (section.lessons) {
                section.lessons.forEach(lesson => {
                    pmTotal++;
                    if (progress[lesson.id]) {
                        pmCompleted++;
                    }
                });
            }
        });
        pmProgress = pmTotal > 0 ? Math.round((pmCompleted / pmTotal) * 100) : 0;
    }
    
    // 更新系列数据
    const pmSeries = COURSE_SERIES.find(s => s.id === 'ai-pm');
    if (pmSeries) {
        pmSeries.progress = pmProgress;
        pmSeries.completedLessons = pmCompleted;
        pmSeries.totalLessons = pmTotal;
    }

    const nextLesson = getNextPMLesson(progress);
    const isAllDone = pmTotal > 0 && pmCompleted === pmTotal;
    
    container.innerHTML = `
        <div class="course-center">
            <div class="course-center-header">
                <div class="course-center-title">下班充电站</div>
                <div class="course-center-subtitle">想系统补一点的时候再来。内容保持硬核，插不插电都随你。</div>
            </div>

            <div class="course-value-strip">
                <div class="course-value-item">
                    <span class="course-value-label">岗位对齐</span>
                    <span class="course-value-text">AI PM / 数据 / 设计 / 工程</span>
                </div>
                <div class="course-value-item">
                    <span class="course-value-label">内容口味</span>
                    <span class="course-value-text">面试能讲，工作能用</span>
                </div>
            </div>

            <div class="today-study-card">
                <div class="today-study-kicker">${isAllDone ? '今日状态' : '可选充电'}</div>
                <div class="today-study-title">${isAllDone ? '今天可以理直气壮地休息了' : nextLesson.title}</div>
                <div class="today-study-copy">
                    ${isAllDone
                        ? 'AI产品经理路线已经通关，脑子申请带薪年假。'
                        : `${nextLesson.sectionTitle} · ${nextLesson.time}。不是任务，只是给想多懂一点的人留个入口。`}
                </div>
                <div class="today-study-actions">
                    <button class="today-study-primary" onclick="${isAllDone ? "openSeriesDetail('ai-pm')" : `openLesson('${nextLesson.id}', 'ai-pm')`}">
                        ${isAllDone ? '回顾充电路线' : '去充一点电'}
                    </button>
                    <span class="today-study-progress">${pmCompleted}/${pmTotal} 已完成</span>
                </div>
            </div>
            
            <div class="course-series-grid">
                ${COURSE_SERIES.map(series => renderSeriesCard(series)).join('')}
            </div>
        </div>
    `;
}

function getNextPMLesson(progress) {
    if (typeof COURSES === 'undefined') {
        return { id: '', title: 'AI产品经理路线', sectionTitle: '先把目录热热身', time: '10分钟' };
    }

    for (const section of COURSES) {
        if (!section.lessons) continue;
        const lesson = section.lessons.find(item => !progress[item.id]);
        if (lesson) {
            return {
                ...lesson,
                sectionTitle: section.title
            };
        }
    }

    const firstSection = COURSES.find(s => s.lessons);
    const firstLesson = firstSection?.lessons?.[0];
    return {
        ...firstLesson,
        sectionTitle: firstSection?.title || 'AI产品经理路线'
    };
}

// 渲染系列卡片
function renderSeriesCard(series) {
    const statusText = {
        'active': '学习中',
        'coming-soon': '即将上线',
        'locked': '未开放'
    };
    
    const tagClass = {
        '热门': 'hot',
        '实战': 'hot',
        '技术': 'tech',
        '高薪': 'tech',
        '数据': 'data',
        '效率': 'data',
        '设计': 'design',
        '创意': 'design',
        '创业': 'business',
        '商业': 'business'
    };
    
    return `
        <div class="course-series-card ${series.status}" onclick="openSeriesDetail('${series.id}')">
            <div class="series-status ${series.status}">${statusText[series.status]}</div>
            <div class="series-icon" style="background: ${series.color}20; color: ${series.color};">
                ${series.icon}
            </div>
            <div class="series-title">${series.title}</div>
            <div class="series-desc">${series.description}</div>
            <div class="series-fit">${getSeriesFit(series.id)}</div>
            ${series.status === 'active' ? `
                <div class="series-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${series.progress}%; background: ${series.color};"></div>
                    </div>
                    <div class="progress-text">${series.completedLessons}/${series.totalLessons} 完成</div>
                </div>
            ` : ''}
            <div class="series-tags">
                ${series.tags.map(tag => `<span class="series-tag ${tagClass[tag] || ''}">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}

function getSeriesFit(seriesId) {
    const fits = {
        'ai-pm': '适合：想转AI产品、面试要讲清楚AI落地的人',
        'ai-engineer': '适合：想把Demo做成真系统的人',
        'ai-analyst': '适合：想让报表少点苦工、多点判断的人',
        'ai-designer': '适合：想把AI变成设计工作流的人',
        'ai-founder': '适合：想把想法先跑成MVP的人'
    };
    return fits[seriesId] || '适合：想给职业工具箱加一格的人';
}

// 打开系列详情
function openSeriesDetail(seriesId) {
    const series = COURSE_SERIES.find(s => s.id === seriesId);
    if (!series) return;
    
    currentView = 'detail';
    currentSeries = series;
    
    const progress = getCourseProgress();
    const container = document.getElementById('courseCenter');
    
    container.innerHTML = `
        <div class="course-center">
            <div class="back-to-center" onclick="renderCourseCenter()">
                ← 返回充电站
            </div>
            
            <div class="course-detail">
                <div class="course-detail-header">
                    <div class="course-detail-icon" style="background: ${series.color}20; color: ${series.color};">
                        ${series.icon}
                    </div>
                    <div class="course-detail-info">
                        <div class="course-detail-title">${series.title}系列</div>
                        <div class="course-detail-desc">${series.description}</div>
                    </div>
                    <div class="course-detail-progress">
                        <div class="course-detail-percent">${series.progress}%</div>
                        <div class="course-detail-count">${series.completedLessons}/${series.totalLessons}</div>
                    </div>
                </div>
                
                <div class="course-modules">
                    ${series.modules.map(module => renderModule(module, series.color, series.id, progress)).join('')}
                </div>
            </div>
        </div>
    `;
}

// 渲染模块
function renderModule(module, color, seriesId, progress) {
    let completedCount = 0;
    module.lessons.forEach(lesson => {
        if (progress[lesson.id]) {
            completedCount++;
        }
    });
    const totalCount = module.lessons.length;
    
    return `
        <div class="course-module">
            <div class="course-module-header" onclick="toggleModule('${module.id}')">
                <div class="course-module-icon">${module.icon}</div>
                <div class="course-module-info">
                    <div class="course-module-title">${module.title}</div>
                    <div class="course-module-subtitle">${module.subtitle}</div>
                </div>
                <div class="course-module-progress">${completedCount}/${totalCount}</div>
            </div>
            
            <div class="course-lessons" id="module-${module.id}" style="display: block;">
                ${module.lessons.map(lesson => renderLesson(lesson, color, seriesId, progress)).join('')}
            </div>
        </div>
    `;
}

// 渲染课程
function renderLesson(lesson, color, seriesId, progress) {
    const isCompleted = progress[lesson.id];
    const statusIcon = isCompleted ? '✓' : '';
    const statusText = isCompleted ? '已完成' : '随缘看';
    
    return `
        <div class="course-lesson" onclick="openLesson('${lesson.id}', '${seriesId}')">
            <div class="course-lesson-check ${isCompleted ? 'completed' : ''}">
                ${statusIcon}
            </div>
            <div class="course-lesson-info">
                <div class="course-lesson-title">${lesson.title}</div>
                <div class="course-lesson-time">${lesson.time}</div>
            </div>
            <div class="course-lesson-status ${isCompleted ? 'completed' : ''}">
                ${statusText}
            </div>
        </div>
    `;
}

// 切换模块展开/收起
function toggleModule(moduleId) {
    const moduleEl = document.getElementById(`module-${moduleId}`);
    if (!moduleEl) return;
    
    const isHidden = moduleEl.style.display === 'none';
    moduleEl.style.display = isHidden ? 'block' : 'none';
}

// 打开课程
function openLesson(lessonId, seriesId) {
    // 支持所有已有课程内容的系列
    if (seriesId === 'ai-pm' || seriesId === 'ai-engineer' || seriesId === 'ai-analyst') {
        openPMLesson(lessonId);
        return;
    }
    
    const series = COURSE_SERIES.find(s => s.id === seriesId);
    const title = series ? series.title : '这门课';
    showToast(`这门「${title}」还在备课中，老师正在和咖啡机谈判 ☕`);
}

// 打开AI产品经理课程
function openPMLesson(lessonId) {
    if (typeof COURSES === 'undefined') {
        showToast('课程数据没加载出来，先别急，可能是网速在摸鱼');
        return;
    }
    
    // 查找课程
    let lesson = null;
    let sectionTitle = '';
    
    for (const section of COURSES) {
        if (section.lessons) {
            const found = section.lessons.find(l => l.id === lessonId);
            if (found) {
                lesson = found;
                sectionTitle = section.title;
                break;
            }
        }
    }
    
    // Fallback: 直接查找顶层lesson（AI数据分析师等扁平结构）
    if (!lesson) {
        const directLesson = COURSES.find(l => l.id === lessonId && l.content);
        if (directLesson) {
            lesson = directLesson;
            // 从COURSE_SERIES反向查找模块名
            const series = COURSE_SERIES.find(s => 
                s.modules.some(m => m.lessons.some(l => l.id === lessonId))
            );
            if (series) {
                for (const mod of series.modules) {
                    if (mod.lessons.some(l => l.id === lessonId)) {
                        sectionTitle = mod.title;
                        break;
                    }
                }
            }
        }
    }
    
    if (!lesson) {
        showToast('这节课迷路了，我回头把它抓回来');
        return;
    }
    
    currentLessonId = lessonId;
    
    // 打开课程详情弹窗
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    if (!modal || !title || !body) {
        showToast('课程弹窗没打开，可能它也刚下班');
        return;
    }
    
    title.textContent = lesson.title;
    
    const progress = getCourseProgress();
    const isCompleted = progress[lessonId];
    
    body.innerHTML = `
        <div class="lesson-section-title">${sectionTitle}</div>
        ${lesson.content}
        ${renderLessonDeepeningPack(lessonId)}
        <div class="lesson-actions">
            <button class="done-btn ${isCompleted ? 'completed' : ''}" onclick="toggleLessonComplete('${lessonId}')">
                ${isCompleted ? '已充过电（点击取消）' : '这节我看过了'}
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function renderLessonDeepeningPack(lessonId) {
    const pack = AI_PM_DEEPENING_PACKS[lessonId];
    if (!pack) return '';

    return `
        <div class="lesson-deep-pack">
            <div class="lesson-deep-head">
                <span class="lesson-deep-kicker">岗位深挖</span>
                <b>把这节课学到能上桌讨论</b>
            </div>
            <div class="lesson-deep-grid">
                <div class="lesson-deep-card">
                    <span>岗位能力</span>
                    <p>${pack.skills.join(' / ')}</p>
                </div>
                <div class="lesson-deep-card">
                    <span>实战产出</span>
                    <p>${pack.output}</p>
                </div>
                <div class="lesson-deep-card">
                    <span>练习方式</span>
                    <p>${pack.practice}</p>
                </div>
            </div>
            <div class="lesson-reading-list">
                <span>延伸阅读</span>
                ${pack.readings.map(([title, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`).join('')}
            </div>
        </div>
    `;
}

// 切换课程完成状态（打卡/取消打卡）
function toggleLessonComplete(lessonId) {
    const progress = getCourseProgress();
    
    if (progress[lessonId]) {
        // 取消打卡
        delete progress[lessonId];
        saveCourseProgress(progress);
        
        // 更新按钮状态
        const btn = document.querySelector('.done-btn');
        if (btn) {
            btn.classList.remove('completed');
            btn.textContent = '这节我看过了';
        }
        
        showToast('已取消，这节课先放回书架');
    } else {
        // 打卡
        progress[lessonId] = true;
        progress['_last_completed'] = lessonId;
        progress['_last_completed_time'] = new Date().toLocaleDateString('zh-CN');
        saveCourseProgress(progress);
        
        // 更新按钮状态
        const btn = document.querySelector('.done-btn');
        if (btn) {
            btn.classList.add('completed');
            btn.textContent = '✓ 已完成（点击取消）';
        }
        
        showToast('🎉 打卡成功！');
    }
    
    // 更新课程列表显示
    updateLessonStatus(lessonId, !!progress[lessonId]);
}

// 更新课程列表中的状态显示
function updateLessonStatus(lessonId, isCompleted) {
    // 找到对应的课程项并更新
    const lessonItems = document.querySelectorAll('.course-lesson');
    lessonItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(lessonId)) {
            const check = item.querySelector('.course-lesson-check');
            const status = item.querySelector('.course-lesson-status');
            
            if (check) {
                if (isCompleted) {
                    check.classList.add('completed');
                    check.textContent = '✓';
                } else {
                    check.classList.remove('completed');
                    check.textContent = '';
                }
            }
            
            if (status) {
                if (isCompleted) {
                    status.classList.add('completed');
                    status.textContent = '已完成';
                } else {
                    status.classList.remove('completed');
                    status.textContent = '点击学习';
                }
            }
        }
    });
    
    // 更新进度显示
    updateProgressDisplay();
}

// 更新进度显示
function updateProgressDisplay() {
    const progress = getCourseProgress();
    
    // 计算进度
    let pmCompleted = 0;
    let pmTotal = 0;
    
    if (typeof COURSES !== 'undefined') {
        COURSES.forEach(section => {
            if (section.lessons) {
                section.lessons.forEach(lesson => {
                    pmTotal++;
                    if (progress[lesson.id]) {
                        pmCompleted++;
                    }
                });
            }
        });
    }
    
    const pmProgress = pmTotal > 0 ? Math.round((pmCompleted / pmTotal) * 100) : 0;
    
    // 更新系列卡片进度
    const pmSeries = COURSE_SERIES.find(s => s.id === 'ai-pm');
    if (pmSeries) {
        pmSeries.progress = pmProgress;
        pmSeries.completedLessons = pmCompleted;
        pmSeries.totalLessons = pmTotal;
    }
    
    // 更新详情页进度显示
    const percentEl = document.querySelector('.course-detail-percent');
    const countEl = document.querySelector('.course-detail-count');
    
    if (percentEl) {
        percentEl.textContent = pmProgress + '%';
    }
    if (countEl) {
        countEl.textContent = `${pmCompleted}/${pmTotal}`;
    }
    
    // 更新模块进度显示
    if (typeof COURSE_SERIES !== 'undefined' && currentSeries) {
        const series = COURSE_SERIES.find(s => s.id === currentSeries.id);
        if (series) {
            series.modules.forEach(module => {
                let moduleCompleted = 0;
                module.lessons.forEach(lesson => {
                    if (progress[lesson.id]) {
                        moduleCompleted++;
                    }
                });
                
                const moduleProgressEl = document.querySelector(`#module-${module.id}`)?.closest('.course-module')?.querySelector('.course-module-progress');
                if (moduleProgressEl) {
                    moduleProgressEl.textContent = `${moduleCompleted}/${module.lessons.length}`;
                }
            });
        }
    }
}

// 显示提示
function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);color:white;padding:18px 24px;border-radius:12px;font-size:15px;z-index:400;text-align:center;line-height:1.5;max-width:260px;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}
