// ===== Algorithm Lab - Main App Engine =====

// ===== Global Language Setting (Python / C++) =====
window._algoLang = localStorage.getItem('algo-lang') || 'python';
document.body.setAttribute('data-lang', window._algoLang);
window._setAlgoLang = function(lang) {
    window._algoLang = lang;
    localStorage.setItem('algo-lang', lang);
    document.body.setAttribute('data-lang', lang);
    // Sync language toggle UI (in-tab toggle)
    document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // Sync sidebar selector
    document.querySelectorAll('#lang-selector .selector-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // Sync code tab lang-select
    var sel = document.querySelector('.lang-select');
    if (sel && sel.value !== lang) {
        sel.value = lang;
        sel.dispatchEvent(new Event('change'));
    }
};

(function() {
    const sidebarNav = document.getElementById('sidebar-nav');
    const tabNav = document.getElementById('tab-nav');
    const topicTitle = document.getElementById('topic-title');
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    let currentTopic = null;
    let currentTab = 'landing';
    let currentProblemId = null;
    let expandedTopicId = null;

    // ===== Sidebar global selectors =====
    // 1) Korean/English switch
    document.querySelectorAll('#locale-selector .selector-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var locale = btn.dataset.locale;
            if (locale === 'ko') {
                window.location.href = '../index.html' + window.location.hash;
            }
            // 'en' is current page, no action
        });
    });
    // 2) Python/C++ switch (sidebar)
    (function() {
        var curLang = window._algoLang || 'python';
        document.querySelectorAll('#lang-selector .selector-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.lang === curLang);
            btn.addEventListener('click', function() {
                window._setAlgoLang(btn.dataset.lang);
                document.querySelectorAll('#lang-selector .selector-btn').forEach(function(b) {
                    b.classList.toggle('active', b.dataset.lang === btn.dataset.lang);
                });
                renderContent();
            });
        });
    })();

    // ===== Sidebar toggle (mobile) =====
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
        overlay.classList.toggle('active');
    });

    // ===== Topic list rendering =====
    const categoryOrder = ['Data Structures', 'Sorting & Searching', 'Recursion & Trees', 'Algorithm Techniques', 'Advanced DS & Graphs', 'Advanced Topics'];

    function renderSidebar() {
        const topics = window.AlgoTopics || {};
        sidebarNav.innerHTML = '';

        const grouped = {};
        Object.values(topics).forEach(topic => {
            const cat = topic.category || 'Others';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(topic);
        });
        Object.values(grouped).forEach(arr => arr.sort((a, b) => (a.order || 0) - (b.order || 0)));

        const cats = [...categoryOrder, ...Object.keys(grouped).filter(c => !categoryOrder.includes(c))];

        cats.forEach(cat => {
            if (!grouped[cat]) return;

            const header = document.createElement('div');
            header.className = 'sidebar-category';
            header.textContent = cat;
            sidebarNav.appendChild(header);

            grouped[cat].forEach(topic => {
                const isExpandable = topic.problems && topic.problems.length > 0;

                const btn = document.createElement('button');
                btn.className = 'sidebar-item';
                btn.dataset.topicId = topic.id;
                btn.innerHTML = `
                    <span class="item-icon">${topic.icon}</span>
                    <span class="item-label">${topic.title}</span>
                    <span class="item-badge">${topic.problems ? topic.problems.length + ' problems' : ''}</span>
                    ${isExpandable ? '<span class="item-chevron">▶</span>' : ''}
                `;

                btn.addEventListener('click', () => {
                    if (isExpandable) {
                        toggleTopicExpand(topic.id);
                    } else {
                        selectTopic(topic.id);
                    }
                });
                sidebarNav.appendChild(btn);

                if (isExpandable) {
                    const subList = document.createElement('div');
                    subList.className = 'sidebar-sub-list';
                    subList.dataset.topicId = topic.id;

                    if (topic.stages && topic.stages.length > 0) {
                        // Render by stage
                        const probById = {};
                        topic.problems.forEach(p => { probById[p.id] = p; });
                        let globalSeq = 1;

                        topic.stages.forEach(stage => {
                            const divider = document.createElement('div');
                            divider.className = 'sidebar-stage-divider';
                            divider.textContent = 'Stage ' + stage.num;
                            subList.appendChild(divider);

                            stage.problemIds.forEach(pid => {
                                const prob = probById[pid];
                                if (!prob) return;

                                const subBtn = document.createElement('button');
                                subBtn.className = 'sidebar-sub-item';
                                subBtn.dataset.topicId = topic.id;
                                subBtn.dataset.problemId = prob.id;

                                const shortTitle = prob.title.replace(/^(BOJ \d+|LeetCode \d+)\s*-\s*/, '');
                                const seqNum = circledNumber(globalSeq);
                                subBtn.innerHTML = '<span class="sidebar-seq-num">' + seqNum + '</span>' +
                                    '<span class="sub-item-dot ' + prob.difficulty + '"></span>' +
                                    '<span class="sub-item-label">' + shortTitle + '</span>';
                                subBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    selectProblem(topic.id, prob.id);
                                });
                                subList.appendChild(subBtn);
                                globalSeq++;
                            });
                        });
                    } else {
                        // flat fallback
                        topic.problems.forEach(prob => {
                            const subBtn = document.createElement('button');
                            subBtn.className = 'sidebar-sub-item';
                            subBtn.dataset.topicId = topic.id;
                            subBtn.dataset.problemId = prob.id;

                            const shortTitle = prob.title.replace(/^(BOJ \d+|LeetCode \d+)\s*-\s*/, '');
                            subBtn.innerHTML = `
                                <span class="sub-item-dot ${prob.difficulty}"></span>
                                <span class="sub-item-label">${shortTitle}</span>
                            `;
                            subBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                selectProblem(topic.id, prob.id);
                            });
                            subList.appendChild(subBtn);
                        });
                    }

                    sidebarNav.appendChild(subList);
                }
            });
        });
    }

    // ===== Sub-list expand/collapse =====
    function expandSubList(topicId) {
        const subList = sidebarNav.querySelector(`.sidebar-sub-list[data-topic-id="${topicId}"]`);
        const btn = sidebarNav.querySelector(`.sidebar-item[data-topic-id="${topicId}"]`);
        if (subList) subList.classList.add('expanded');
        if (btn) btn.classList.add('expanded');
    }

    function collapseSubList(topicId) {
        const subList = sidebarNav.querySelector(`.sidebar-sub-list[data-topic-id="${topicId}"]`);
        const btn = sidebarNav.querySelector(`.sidebar-item[data-topic-id="${topicId}"]`);
        if (subList) subList.classList.remove('expanded');
        if (btn) btn.classList.remove('expanded');
    }

    function updateSidebarActiveStates() {
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const isThisTopic = item.dataset.topicId === (currentTopic && currentTopic.id);
            item.classList.toggle('active', isThisTopic && !currentProblemId);
        });
        document.querySelectorAll('.sidebar-sub-item').forEach(item => {
            item.classList.toggle('active',
                item.dataset.problemId === currentProblemId &&
                item.dataset.topicId === (currentTopic && currentTopic.id));
        });
    }

    // ===== Topic expand toggle =====
    function toggleTopicExpand(topicId) {
        const topics = window.AlgoTopics || {};
        const topic = topics[topicId];
        if (!topic) return;

        if (expandedTopicId === topicId && !currentProblemId && currentTab === 'landing') {
            // Already viewing landing → collapse only
            collapseSubList(topicId);
            expandedTopicId = null;
            return;
        }

        if (expandedTopicId && expandedTopicId !== topicId) collapseSubList(expandedTopicId);
        expandSubList(topicId);
        expandedTopicId = topicId;

        currentTopic = topic;
        currentProblemId = null;
        currentTab = 'landing';

        updateSidebarActiveStates();
        topicTitle.textContent = `${topic.icon} ${topic.title}`;
        renderTabs();
        renderContent();
    }

    // ===== Problem selection =====
    function selectProblem(topicId, problemId) {
        const topics = window.AlgoTopics || {};
        const topic = topics[topicId];
        if (!topic) return;

        currentTopic = topic;
        currentProblemId = problemId;
        currentTab = 'problem';

        if (expandedTopicId !== topicId) {
            if (expandedTopicId) collapseSubList(expandedTopicId);
            expandSubList(topicId);
            expandedTopicId = topicId;
        }

        updateSidebarActiveStates();

        const prob = topic.problems.find(p => p.id === problemId);
        if (prob) topicTitle.textContent = `${topic.icon} ${prob.title}`;

        renderTabs();
        renderContent();

        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    // ===== Topic selection (non-expandable) =====
    function selectTopic(topicId) {
        const topics = window.AlgoTopics || {};
        const topic = topics[topicId];
        if (!topic) return;

        currentTopic = topic;
        currentTab = 'concept';
        currentProblemId = null;

        if (expandedTopicId) {
            collapseSubList(expandedTopicId);
            expandedTopicId = null;
        }

        updateSidebarActiveStates();
        topicTitle.textContent = `${topic.icon} ${topic.title}`;
        renderTabs();
        renderContent();

        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    // ===== Internal tab switch (concept/visualize drill-down) =====
    function drillIntoTab(tabId) {
        currentProblemId = null;
        currentTab = tabId;
        updateSidebarActiveStates();
        topicTitle.textContent = `${currentTopic.icon} ${currentTopic.title}`;
        renderTabs();
        renderContent();
    }

    // ===== Tab data + main tab bar build =====
    let tabBarElement = null;

    function getTabsData() {
        if (currentProblemId && currentTopic) {
            if (currentTopic.getProblemTabs) {
                return currentTopic.getProblemTabs(currentProblemId);
            }
            return [
                { id: 'problem', label: 'Problem', icon: '📋' },
                { id: 'think', label: 'Approach', icon: '💡' },
                { id: 'code', label: 'Code', icon: '💻' }
            ];
        }
        return (currentTopic && currentTopic.tabs) || [
            { id: 'concept', label: 'Concepts', icon: '📖' },
            { id: 'visualize', label: 'Visualize', icon: '🎮' },
            { id: 'problem', label: 'Practice', icon: '✏️' }
        ];
    }

    function renderTabs() {
        tabNav.innerHTML = '';

        // No tab bar on landing page
        if (currentTab === 'landing') { tabBarElement = null; return; }

        const tabs = getTabsData();
        const activeIdx = tabs.findIndex(t => t.id === currentTab);

        // Progress bar
        const bar = document.createElement('div');
        bar.className = 'tab-bar-main';

        const progress = document.createElement('div');
        progress.className = 'tab-progress';
        const pct = tabs.length > 1 ? (activeIdx / (tabs.length - 1)) * 100 : 0;
        progress.innerHTML = '<div class="tab-progress-fill" style="width:' + pct + '%"></div>';
        bar.appendChild(progress);

        // Tab button row
        const navRow = document.createElement('div');
        navRow.className = 'tab-nav-main';

        tabs.forEach((tab, i) => {
            const isActive = tab.id === currentTab;
            const isPast = i < activeIdx;

            const btn = document.createElement('button');
            btn.className = 'tab-btn-main' + (isActive ? ' active' : '') + (isPast ? ' completed' : '');

            const num = i + 1;
            const icon = tab.icon || '';
            btn.innerHTML =
                '<span class="tab-num">' + (isPast ? '✓' : num) + '</span>' +
                '<span class="tab-icon">' + icon + '</span>' +
                '<span class="tab-label">' + tab.label + '</span>';

            btn.addEventListener('click', () => {
                currentTab = tab.id;
                renderTabs();
                renderContent();
                setTimeout(() => { content.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
            });
            navRow.appendChild(btn);

            // Arrow (except last tab)
            if (i < tabs.length - 1) {
                const arrow = document.createElement('span');
                arrow.className = 'tab-arrow';
                arrow.textContent = '→';
                navRow.appendChild(arrow);
            }
        });

        bar.appendChild(navRow);

        // Language toggle (shown only on problem tabs)
        if (currentProblemId) {
            var langToggle = document.createElement('div');
            langToggle.className = 'lang-toggle';
            var curLang = window._algoLang || 'python';
            langToggle.innerHTML =
                '<button class="lang-toggle-btn' + (curLang === 'python' ? ' active' : '') + '" data-lang="python">🐍 Python</button>' +
                '<button class="lang-toggle-btn' + (curLang === 'cpp' ? ' active' : '') + '" data-lang="cpp">⚡ C++</button>';
            langToggle.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    window._setAlgoLang(btn.dataset.lang);
                    // Re-render current tab content
                    renderContent();
                });
            });
            bar.appendChild(langToggle);
        }

        tabBarElement = bar;
    }

    // ===== Tab switch utility (callable externally) =====
    window._switchToTab = function(tabId) {
        currentTab = tabId;
        renderTabs();
        renderContent();
        setTimeout(() => { content.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    };

    // ===== Content rendering =====
    function renderContent() {
        if (!currentTopic) return;

        content.innerHTML = '';

        // Insert main tab bar (when not landing)
        if (tabBarElement) {
            content.appendChild(tabBarElement);
        }

        const section = document.createElement('div');
        section.className = 'tab-content active';

        if (currentTab === 'landing') {
            renderTopicLanding(section, currentTopic);
        } else if (currentProblemId) {
            if (currentTopic.renderProblemContent) {
                currentTopic.renderProblemContent(section, currentProblemId, currentTab);
            } else {
                renderGenericProblemContent(section, currentTopic, currentProblemId, currentTab);
            }
        } else {
            switch (currentTab) {
                case 'concept':
                    currentTopic.renderConcept(section);
                    break;
                case 'visualize':
                    if (currentTopic.renderVisualize) currentTopic.renderVisualize(section);
                    break;
                case 'problem':
                    if (currentTopic.renderProblem) currentTopic.renderProblem(section);
                    break;
            }
            // Concept/visualize drill-down → insert back button at top
            const backBtn = document.createElement('button');
            backBtn.className = 'back-to-landing-btn';
            backBtn.innerHTML = '← ' + currentTopic.icon + ' ' + currentTopic.title + ' Home';
            backBtn.addEventListener('click', () => {
                currentTab = 'landing';
                updateSidebarActiveStates();
                renderTabs();
                renderContent();
                window.scrollTo(0, 0);
            });
            section.insertBefore(backBtn, section.firstChild);
        }

        content.appendChild(section);
    }

    // ===== Sequence number helper =====
    function circledNumber(n) {
        const c = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
        return n <= 20 ? c[n - 1] : '(' + n + ')';
    }

    // ===== Algorithm types section =====
    function renderAlgorithmTypes(container, topic) {
        const typeColors = [
            'var(--accent)', 'var(--green)', '#e17055', '#6c5ce7',
            'var(--blue)', 'var(--yellow)', '#e74c3c', '#00cec9'
        ];
        const typeIcons = ['📊', '🔄', '🔀', '🏗️', '📐', '⚡', '🎯', '🧩'];

        let types = [];

        // Priority 1: extract types from topic.problemMeta (e.g. string.js)
        if (topic.problemMeta) {
            const seen = {};
            Object.entries(topic.problemMeta).forEach(([probId, meta]) => {
                if (!seen[meta.type]) {
                    seen[meta.type] = { name: meta.type, color: meta.color, problemIds: [probId], desc: '' };
                } else {
                    seen[meta.type].problemIds.push(probId);
                }
            });
            types = Object.values(seen);
        }
        // Priority 2: extract from stages array (most topics)
        else if (topic.stages && topic.stages.length > 0) {
            types = topic.stages.map((stage, i) => ({
                name: stage.title,
                desc: stage.desc || '',
                color: typeColors[i % typeColors.length],
                problemIds: stage.problemIds || []
            }));
        }

        if (types.length === 0) return;

        // Section header
        const header = document.createElement('div');
        header.className = 'landing-section-header';
        header.innerHTML = `<h3>🧬 Algorithm Types</h3><span style="color:var(--text2);font-size:0.85rem;">${types.length} types</span>`;
        container.appendChild(header);

        // Type card grid
        const grid = document.createElement('div');
        grid.className = 'landing-types';

        types.forEach((type, i) => {
            const card = document.createElement('button');
            card.className = 'type-card';

            const color = type.color || typeColors[i % typeColors.length];
            const icon = typeIcons[i % typeIcons.length];
            const count = type.problemIds.length;

            card.innerHTML = `
                <div class="type-card-icon" style="background:${color}15;color:${color};">${icon}</div>
                <div class="type-card-body">
                    <span class="type-card-title">${type.name}</span>
                    ${type.desc ? `<span class="type-card-desc">${type.desc}</span>` : ''}
                    <span class="type-card-count">${count} problems</span>
                </div>
            `;

            // Click to navigate to the first problem of this type
            if (count > 0) {
                card.addEventListener('click', () => {
                    selectProblem(topic.id, type.problemIds[0]);
                });
            }

            grid.appendChild(card);
        });

        container.appendChild(grid);

        // Additional type note
        if (topic.relatedNote) {
            const note = document.createElement('p');
            note.className = 'landing-related-note';
            note.innerHTML = `💡 ${topic.relatedNote}`;
            container.appendChild(note);
        }
    }

    // ===== Staged problem roadmap =====
    function renderStagedProblemList(container, topic) {
        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };
        const diffColors = { easy: 'var(--green)', silver: '#5c6bc0', medium: '#e67e22', gold: '#f57f17', hard: '#e74c3c', bronze: '#8d6e63', platinum: '#0097a7' };

        const probById = {};
        (topic.problems || []).forEach(p => { probById[p.id] = p; });

        // Section header
        const listHeader = document.createElement('div');
        listHeader.className = 'landing-section-header';
        listHeader.innerHTML = '<h3>\uD83D\uDCCB Learning Roadmap</h3><span style="color:var(--text2);font-size:0.85rem;">' + (topic.problems ? topic.problems.length + ' problems' : '') + '</span>';
        container.appendChild(listHeader);

        const roadmapEl = document.createElement('div');
        roadmapEl.className = 'roadmap-container';

        let globalSeq = 1;

        topic.stages.forEach(function(stage, stageIdx) {
            // Stage group
            const group = document.createElement('div');
            group.className = 'roadmap-stage-group';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'roadmap-stage-header';
            headerDiv.innerHTML = '<span class="roadmap-stage-badge">Stage ' + stage.num + '</span>' +
                '<span class="roadmap-stage-title">' + stage.title + '</span>' +
                (stage.desc ? '<span class="roadmap-stage-desc">' + stage.desc + '</span>' : '');
            group.appendChild(headerDiv);

            // Problem card list
            const probList = document.createElement('div');
            probList.className = 'roadmap-prob-list';

            stage.problemIds.forEach(function(pid) {
                const prob = probById[pid];
                if (!prob) return;

                const card = document.createElement('button');
                card.className = 'landing-problem-card';

                const seqNum = circledNumber(globalSeq);
                const diff = diffMap[prob.difficulty] || prob.difficulty;
                const color = diffColors[prob.difficulty] || 'var(--text2)';
                const shortTitle = prob.title.replace(/^(BOJ \d+|LeetCode \d+)\s*-\s*/, '');
                const source = prob.title.match(/^(BOJ \d+|LeetCode \d+)/);
                const sourceText = source ? source[0] : '';

                card.innerHTML = '<div class="lpc-left">' +
                    '<span class="roadmap-seq-num">' + seqNum + '</span>' +
                    '<span class="lpc-dot" style="background:' + color + ';"></span>' +
                    '<div class="lpc-info">' +
                        '<span class="lpc-title">' + shortTitle + '</span>' +
                        '<span class="lpc-source">' + sourceText + '</span>' +
                    '</div></div>' +
                    '<span class="lpc-diff" style="color:' + color + ';">' + diff + '</span>';

                card.addEventListener('click', function() { selectProblem(topic.id, prob.id); });
                probList.appendChild(card);
                globalSeq++;
            });

            group.appendChild(probList);
            roadmapEl.appendChild(group);

            // Connector arrow between stages
            if (stageIdx < topic.stages.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'roadmap-stage-connector';
                connector.innerHTML = '<span class="roadmap-connector-arrow">\u2193</span>';
                roadmapEl.appendChild(connector);
            }
        });

        container.appendChild(roadmapEl);
    }

    // ===== Topic landing page =====
    function renderTopicLanding(container, topic) {
        if (topic._clearVizState) topic._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };
        const diffColors = { easy: 'var(--green)', silver: '#5c6bc0', medium: '#e67e22', gold: '#f57f17', hard: '#e74c3c', bronze: '#8d6e63', platinum: '#0097a7' };

        // Hero
        const hero = document.createElement('div');
        hero.className = 'hero';
        hero.innerHTML = `
            <h2>${topic.icon} ${topic.title}</h2>
            <p class="hero-sub">${topic.description || ''}</p>
        `;
        container.appendChild(hero);

        // Action buttons
        const actions = document.createElement('div');
        actions.className = 'landing-actions';
        actions.innerHTML = `
            <button class="landing-btn landing-btn-concept">
                <span class="landing-btn-icon">📖</span>
                <span class="landing-btn-text">
                    <strong>Concepts</strong>
                    <small>Learn core theories and patterns</small>
                </span>
            </button>
            <button class="landing-btn landing-btn-viz">
                <span class="landing-btn-icon">🎮</span>
                <span class="landing-btn-text">
                    <strong>Visualize</strong>
                    <small>Run step-by-step simulations</small>
                </span>
            </button>
        `;
        actions.querySelector('.landing-btn-concept').addEventListener('click', () => drillIntoTab('concept'));
        // Hide visualize button if topic has no visualize content
        const vizBtn = actions.querySelector('.landing-btn-viz');
        if (topic.renderVisualize) {
            const testDiv = document.createElement('div');
            topic.renderVisualize(testDiv);
            if (testDiv.innerHTML.trim().length === 0) {
                vizBtn.style.display = 'none';
            } else {
                vizBtn.addEventListener('click', () => drillIntoTab('visualize'));
            }
        } else {
            vizBtn.style.display = 'none';
        }
        container.appendChild(actions);

        // ===== Algorithm types section =====
        renderAlgorithmTypes(container, topic);

        // Problem list (staged roadmap or flat list)
        if (topic.stages && topic.stages.length > 0 && topic.problems && topic.problems.length > 0) {
            renderStagedProblemList(container, topic);
        } else if (topic.problems && topic.problems.length > 0) {
            // flat fallback (for topics without stages)
            const listHeader = document.createElement('div');
            listHeader.className = 'landing-section-header';
            listHeader.innerHTML = `<h3>📋 Problem List</h3><span style="color:var(--text2);font-size:0.85rem;">${topic.problems.length + ' problems'}</span>`;
            container.appendChild(listHeader);

            const list = document.createElement('div');
            list.className = 'landing-problem-list';

            topic.problems.forEach(prob => {
                const card = document.createElement('button');
                card.className = 'landing-problem-card';

                const diff = diffMap[prob.difficulty] || prob.difficulty;
                const color = diffColors[prob.difficulty] || 'var(--text2)';
                const shortTitle = prob.title.replace(/^(BOJ \d+|LeetCode \d+)\s*-\s*/, '');
                const source = prob.title.match(/^(BOJ \d+|LeetCode \d+)/);
                const sourceText = source ? source[0] : '';

                card.innerHTML = `
                    <div class="lpc-left">
                        <span class="lpc-dot" style="background:${color};"></span>
                        <div class="lpc-info">
                            <span class="lpc-title">${shortTitle}</span>
                            <span class="lpc-source">${sourceText}</span>
                        </div>
                    </div>
                    <span class="lpc-diff" style="color:${color};">${diff}</span>
                `;
                card.addEventListener('click', () => selectProblem(topic.id, prob.id));
                list.appendChild(card);
            });

            container.appendChild(list);
        }
    }

    // ===== Flow Bridge helper =====
    function getFlowTexts(tabs) {
        var texts = {};
        tabs.forEach(function(tab, i) {
            var next = tabs[i + 1] || null;
            switch (tab.id) {
                case 'problem':
                    texts[tab.id] = { intro: 'Start by reading the problem and understanding the input/output format.', icon: '📋', nextLabel: next ? 'If you understood the problem → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'think':
                    texts[tab.id] = { intro: 'Don\'t jump into coding. Open the hints step by step and plan your approach.', icon: '💡', nextLabel: next ? 'If you reviewed all hints → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'sim':
                    texts[tab.id] = { intro: null, icon: '🎮', nextLabel: next ? 'If you understand how it works → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'code':
                    texts[tab.id] = { intro: 'Now let\'s turn your approach into code!', icon: '💻', nextLabel: null, nextTab: null }; break;
            }
        });
        return texts;
    }

    function renderFlowIntro(container, text, icon) {
        if (!text) return;
        var div = document.createElement('div');
        div.className = 'flow-intro';
        div.innerHTML = '<span class="flow-intro-icon">' + (icon || '💬') + '</span><span>' + text + '</span>';
        container.appendChild(div);
    }

    function renderFlowNext(container, label, tabId) {
        if (!label || !tabId) return;
        var div = document.createElement('div');
        div.className = 'flow-next';
        div.innerHTML = '<button class="flow-next-btn">' + label + ' →</button>';
        div.querySelector('button').addEventListener('click', function() { window._switchToTab(tabId); });
        container.appendChild(div);
    }

    // ===== Generic problem content rendering =====
    function renderGenericProblemContent(container, topic, problemId, tabId) {
        const prob = topic.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        if (topic._clearVizState) topic._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML = `<span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
        container.appendChild(header);

        // Flow Intro (added directly to container to prevent innerHTML overwrite by tab renderer)
        const tabs = getTabsData();
        const flowTexts = getFlowTexts(tabs);
        const ft = flowTexts[tabId];
        if (ft) {
            const introText = (tabId === 'sim' && prob.simIntro) ? prob.simIntro : (ft.intro || null);
            renderFlowIntro(container, introText, ft.icon);
        }

        const contentDiv = document.createElement('div');
        switch (tabId) {
            case 'problem': renderGenericProblemTab(contentDiv, prob); break;
            case 'think':   renderGenericThinkTab(contentDiv, prob); break;
            case 'code':    renderGenericCodeTab(contentDiv, prob); break;
        }
        container.appendChild(contentDiv);

        // Flow Next CTA
        if (ft && ft.nextLabel) {
            renderFlowNext(container, ft.nextLabel, ft.nextTab);
        }
    }

    function renderGenericProblemTab(el, prob) {
        const isLC = prob.link && prob.link.includes('leetcode');
        el.innerHTML = `
            ${prob.descriptionHTML || '<p>No problem description available.</p>'}
            <div style="text-align:right;margin-top:1.2rem;">
                <a href="${prob.link}" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">
                    ${isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}
                </a>
            </div>
        `;
        el.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    }

    function renderGenericThinkTab(el, prob) {
        if (!prob.hints || prob.hints.length === 0) {
            el.innerHTML = '<p style="color:var(--text2);">No hints available yet.</p>';
            return;
        }
        // Guide text
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click step by step to reveal hints';
        el.appendChild(guide);

        const wrap = document.createElement('div');
        wrap.className = 'hint-steps';
        prob.hints.forEach((hint, i) => {
            const card = document.createElement('div');
            const locked = i > 0;
            card.className = 'hint-step' + (locked ? ' locked' : '');
            card.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${i + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▾</span>
                </div>
                <div class="hint-step-body">${hint.content}</div>
            `;
            const header = card.querySelector('.hint-step-header');
            const body = card.querySelector('.hint-step-body');
            header.addEventListener('click', function() {
                if (card.classList.contains('locked')) {
                    const prev = wrap.children[i - 1];
                    if (!prev || !prev.classList.contains('opened')) return;
                    card.classList.remove('locked');
                }
                card.classList.toggle('opened');
                card.querySelector('.hint-step-toggle').textContent =
                    card.classList.contains('opened') ? '▴' : '▾';

                // Scroll to bottom when opened
                if (card.classList.contains('opened')) {
                    body.addEventListener('animationend', function scrollAfterOpen() {
                        body.removeEventListener('animationend', scrollAfterOpen);
                        var last = wrap.children[wrap.children.length - 1];
                        last.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                }

                // Unlock next step
                if (card.classList.contains('opened') && i + 1 < prob.hints.length) {
                    const next = wrap.children[i + 1];
                    if (next) next.classList.remove('locked');
                }
            });
            wrap.appendChild(card);
        });
        el.appendChild(wrap);

        // Apply hljs highlighting + line-by-line animation to code blocks
        if (window.hljs) {
            el.querySelectorAll('.hint-step-body pre code').forEach(codeEl => {
                codeEl.classList.add('language-python');
                hljs.highlightElement(codeEl);
                const lines = codeEl.innerHTML.split('\n');
                codeEl.innerHTML = lines.map((line, i) =>
                    `<div class="code-line" style="--i:${i}">${line || '&nbsp;'}</div>`
                ).join('');
            });
        }
    }

    function renderGenericCodeTab(el, prob) {
        if (prob.solutions && prob.solutions.length > 0 && window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(el, prob);
            return;
        }
        if (!prob.templates) {
            el.innerHTML = '<p style="color:var(--text2);">No code templates available yet.</p>';
            return;
        }
        const isLC = prob.link && prob.link.includes('leetcode');
        const langs = Object.keys(prob.templates);
        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;flex-wrap:wrap;">
                <select class="lang-select" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-family:inherit;font-size:0.88rem;">
                    ${langs.map(l => `<option value="${l}">${{python:'Python',cpp:'C++'}[l] || l}</option>`).join('')}
                </select>
                <a href="${prob.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">
                    ${isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}
                </a>
            </div>
            <pre style="background:var(--bg2);border-radius:12px;padding:1.2rem;overflow-x:auto;border:1px solid var(--border);"><code class="code-display"></code></pre>
        `;
        const codeEl = el.querySelector('.code-display');
        const select = el.querySelector('.lang-select');
        function showCode(lang) {
            codeEl.textContent = prob.templates[lang] || '';
            codeEl.className = 'code-display language-' + (lang === 'cpp' ? 'cpp' : lang);
            codeEl.removeAttribute('data-highlighted');
            if (window.hljs) hljs.highlightElement(codeEl);
        }
        select.addEventListener('change', () => {
            if (window._setAlgoLang) window._setAlgoLang(select.value);
            showCode(select.value);
        });
        // Apply global language setting as default
        const initLang = (window._algoLang && langs.indexOf(window._algoLang) !== -1) ? window._algoLang : (langs[0] || 'python');
        select.value = initLang;
        showCode(initLang);
    }

    // ===== Initialization =====
    renderSidebar();

    const topics = window.AlgoTopics || {};
    const firstTopicId = Object.keys(topics)[0];
    if (firstTopicId) {
        const firstTopic = topics[firstTopicId];
        if (firstTopic && firstTopic.problems && firstTopic.problems.length > 0) {
            toggleTopicExpand(firstTopicId);
        } else {
            selectTopic(firstTopicId);
        }
    }

    // ===== Description area typewriter effect =====
    // When viz-step-desc / code-step-desc text changes, display character by character
    (function initDescTypewriter() {
        var _anims = new Map();                // element → { timer, fullText }

        function stop(el) {
            var a = _anims.get(el);
            if (a && a.timer) clearInterval(a.timer);
            // Keep fullText — so observer doesn't mistake "completed text" for external change
        }

        // Check if this is a mutation we created
        function isOurChange(el) {
            var a = _anims.get(el);
            if (!a) return false;
            var cur = el.textContent;
            // If current text is fullText itself or its prefix → our typing
            return a.fullText.startsWith(cur) || cur === '';
        }

        function type(el, text) {
            var a = _anims.get(el);
            if (a && a.timer) clearInterval(a.timer);
            if (!text || text.length < 2) return;

            var chars = Array.from(text);
            var len = chars.length;
            var step = Math.max(1, Math.ceil(len / 35));
            var i = 0;

            el.textContent = '';
            _anims.set(el, { timer: null, fullText: text });

            var timer = setInterval(function() {
                if (!el.isConnected) { clearInterval(timer); _anims.delete(el); return; }
                i += step;
                if (i >= len) {
                    el.textContent = text;
                    clearInterval(timer);
                    // Only clear timer, keep fullText in _anims (prevent restart)
                    _anims.set(el, { timer: null, fullText: text });
                } else {
                    el.textContent = chars.slice(0, i).join('');
                }
            }, 18);

            _anims.get(el).timer = timer;
        }

        new MutationObserver(function(muts) {
            var vizEls = new Map();            // viz element → text
            var codeEls = new Map();           // body element → text

            for (var j = 0; j < muts.length; j++) {
                var t = muts[j].target;
                var node = t.nodeType === 3 ? t.parentElement : t;
                if (!node || !node.closest) continue;

                var viz = node.closest('.viz-step-desc');
                if (viz && !vizEls.has(viz)) vizEls.set(viz, viz.textContent);

                var code = node.closest('.code-step-desc');
                if (code && !codeEls.has(code)) {
                    var body = code.querySelector('.step-desc-body');
                    if (body) codeEls.set(body, body.textContent);
                }
            }

            vizEls.forEach(function(text, el) {
                if (!isOurChange(el)) type(el, text);
            });
            codeEls.forEach(function(text, el) {
                if (!isOurChange(el)) type(el, text);
            });
        }).observe(document.body, { childList: true, characterData: true, subtree: true });
    })();

})();
