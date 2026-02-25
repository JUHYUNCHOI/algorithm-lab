// ===== Algorithm Lab - Main App Engine =====

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

    // ===== 사이드바 토글 (모바일) =====
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

    // ===== 주제 목록 렌더링 =====
    const categoryOrder = ['자료구조 활용', '정렬과 탐색', '재귀와 트리', '알고리즘 기법', '고급 자료구조와 그래프', '심화 선택'];

    function renderSidebar() {
        const topics = window.AlgoTopics || {};
        sidebarNav.innerHTML = '';

        const grouped = {};
        Object.values(topics).forEach(topic => {
            const cat = topic.category || '기타';
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
                    <span class="item-badge">${topic.problems ? topic.problems.length + '문제' : ''}</span>
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
                        // 스테이지별 구분 렌더
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

    // ===== 서브리스트 펼치기/접기 =====
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

    // ===== 토픽 확장 토글 =====
    function toggleTopicExpand(topicId) {
        const topics = window.AlgoTopics || {};
        const topic = topics[topicId];
        if (!topic) return;

        if (expandedTopicId === topicId && !currentProblemId && currentTab === 'landing') {
            // 이미 랜딩 보는 중 → 접기만
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

    // ===== 문제 선택 =====
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

    // ===== 주제 선택 (비확장형) =====
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

    // ===== 내부 탭 전환 (개념/시각화 드릴다운) =====
    function drillIntoTab(tabId) {
        currentProblemId = null;
        currentTab = tabId;
        updateSidebarActiveStates();
        topicTitle.textContent = `${currentTopic.icon} ${currentTopic.title}`;
        renderTabs();
        renderContent();
    }

    // ===== 탭 버튼 렌더링 =====
    function renderTabs() {
        tabNav.innerHTML = '';

        // 랜딩 페이지에서는 탭 숨김
        if (currentTab === 'landing') return;

        let tabs;

        if (currentProblemId && currentTopic) {
            if (currentTopic.getProblemTabs) {
                tabs = currentTopic.getProblemTabs(currentProblemId);
            } else {
                tabs = [
                    { id: 'problem', label: '문제' },
                    { id: 'think', label: '생각해볼것' },
                    { id: 'code', label: '코드' }
                ];
            }
        } else {
            tabs = (currentTopic && currentTopic.tabs) || [
                { id: 'concept', label: '개념 설명' },
                { id: 'visualize', label: '시각화' },
                { id: 'problem', label: '문제풀이' }
            ];
        }

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = 'tab-btn' + (tab.id === currentTab ? ' active' : '');
            btn.textContent = tab.label;
            btn.addEventListener('click', () => {
                currentTab = tab.id;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderContent();
            });
            tabNav.appendChild(btn);
        });
    }

    // ===== 콘텐츠 렌더링 =====
    function renderContent() {
        if (!currentTopic) return;

        content.innerHTML = '';
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
        }

        content.appendChild(section);
    }

    // ===== 순번 헬퍼 =====
    function circledNumber(n) {
        const c = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲','⑳'];
        return n <= 20 ? c[n - 1] : '(' + n + ')';
    }

    // ===== 알고리즘 유형 섹션 =====
    function renderAlgorithmTypes(container, topic) {
        const typeColors = [
            'var(--accent)', 'var(--green)', '#e17055', '#6c5ce7',
            'var(--blue)', 'var(--yellow)', '#e74c3c', '#00cec9'
        ];
        const typeIcons = ['📊', '🔄', '🔀', '🏗️', '📐', '⚡', '🎯', '🧩'];

        let types = [];

        // 1순위: topic.problemMeta에서 유형 추출 (string.js 같은 경우)
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
        // 2순위: stages 배열에서 추출 (대부분의 토픽)
        else if (topic.stages && topic.stages.length > 0) {
            types = topic.stages.map((stage, i) => ({
                name: stage.title,
                desc: stage.desc || '',
                color: typeColors[i % typeColors.length],
                problemIds: stage.problemIds || []
            }));
        }

        if (types.length === 0) return;

        // 섹션 헤더
        const header = document.createElement('div');
        header.className = 'landing-section-header';
        header.innerHTML = `<h3>🧬 알고리즘 유형</h3><span style="color:var(--text2);font-size:0.85rem;">${types.length}가지 유형</span>`;
        container.appendChild(header);

        // 유형 카드 그리드
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
                    <span class="type-card-count">${count}문제</span>
                </div>
            `;

            // 클릭하면 해당 유형의 첫 번째 문제로 이동
            if (count > 0) {
                card.addEventListener('click', () => {
                    selectProblem(topic.id, type.problemIds[0]);
                });
            }

            grid.appendChild(card);
        });

        container.appendChild(grid);

        // 추가 유형 안내 노트
        if (topic.relatedNote) {
            const note = document.createElement('p');
            note.className = 'landing-related-note';
            note.innerHTML = `💡 ${topic.relatedNote}`;
            container.appendChild(note);
        }
    }

    // ===== 스테이지별 문제 로드맵 =====
    function renderStagedProblemList(container, topic) {
        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };
        const diffColors = { easy: 'var(--green)', silver: '#5c6bc0', medium: '#e67e22', gold: '#f57f17', hard: '#e74c3c', bronze: '#8d6e63', platinum: '#0097a7' };

        const probById = {};
        (topic.problems || []).forEach(p => { probById[p.id] = p; });

        // 섹션 헤더
        const listHeader = document.createElement('div');
        listHeader.className = 'landing-section-header';
        listHeader.innerHTML = '<h3>\uD83D\uDCCB 학습 로드맵</h3><span style="color:var(--text2);font-size:0.85rem;">' + (topic.problems ? topic.problems.length + '문제' : '') + '</span>';
        container.appendChild(listHeader);

        const roadmapEl = document.createElement('div');
        roadmapEl.className = 'roadmap-container';

        let globalSeq = 1;

        topic.stages.forEach(function(stage, stageIdx) {
            // 스테이지 그룹
            const group = document.createElement('div');
            group.className = 'roadmap-stage-group';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'roadmap-stage-header';
            headerDiv.innerHTML = '<span class="roadmap-stage-badge">Stage ' + stage.num + '</span>' +
                '<span class="roadmap-stage-title">' + stage.title + '</span>' +
                (stage.desc ? '<span class="roadmap-stage-desc">' + stage.desc + '</span>' : '');
            group.appendChild(headerDiv);

            // 문제 카드 목록
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

            // 스테이지 사이 연결 화살표
            if (stageIdx < topic.stages.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'roadmap-stage-connector';
                connector.innerHTML = '<span class="roadmap-connector-arrow">\u2193</span>';
                roadmapEl.appendChild(connector);
            }
        });

        container.appendChild(roadmapEl);
    }

    // ===== 토픽 랜딩 페이지 =====
    function renderTopicLanding(container, topic) {
        if (topic._clearVizState) topic._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };
        const diffColors = { easy: 'var(--green)', silver: '#5c6bc0', medium: '#e67e22', gold: '#f57f17', hard: '#e74c3c', bronze: '#8d6e63', platinum: '#0097a7' };

        // 히어로
        const hero = document.createElement('div');
        hero.className = 'hero';
        hero.innerHTML = `
            <h2>${topic.icon} ${topic.title}</h2>
            <p class="hero-sub">${topic.description || ''}</p>
        `;
        container.appendChild(hero);

        // 학습 버튼
        const actions = document.createElement('div');
        actions.className = 'landing-actions';
        actions.innerHTML = `
            <button class="landing-btn landing-btn-concept">
                <span class="landing-btn-icon">📖</span>
                <span class="landing-btn-text">
                    <strong>개념 학습</strong>
                    <small>핵심 이론과 패턴 배우기</small>
                </span>
            </button>
            <button class="landing-btn landing-btn-viz">
                <span class="landing-btn-icon">🎮</span>
                <span class="landing-btn-text">
                    <strong>시각화 체험</strong>
                    <small>단계별 시뮬레이션 실행</small>
                </span>
            </button>
        `;
        actions.querySelector('.landing-btn-concept').addEventListener('click', () => drillIntoTab('concept'));
        actions.querySelector('.landing-btn-viz').addEventListener('click', () => drillIntoTab('visualize'));
        container.appendChild(actions);

        // ===== 알고리즘 유형 섹션 =====
        renderAlgorithmTypes(container, topic);

        // 문제 목록 (스테이지 로드맵 또는 flat 목록)
        if (topic.stages && topic.stages.length > 0 && topic.problems && topic.problems.length > 0) {
            renderStagedProblemList(container, topic);
        } else if (topic.problems && topic.problems.length > 0) {
            // flat fallback (stages 없는 토픽용)
            const listHeader = document.createElement('div');
            listHeader.className = 'landing-section-header';
            listHeader.innerHTML = `<h3>📋 문제 목록</h3><span style="color:var(--text2);font-size:0.85rem;">${topic.problems.length + '문제'}</span>`;
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

    // ===== 제네릭 문제 콘텐츠 렌더링 =====
    function renderGenericProblemContent(container, topic, problemId, tabId) {
        const prob = topic.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        if (topic._clearVizState) topic._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard', bronze: 'Bronze', platinum: 'Platinum' };

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML = `<span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
        container.appendChild(header);

        const contentDiv = document.createElement('div');
        switch (tabId) {
            case 'problem': renderGenericProblemTab(contentDiv, prob); break;
            case 'think':   renderGenericThinkTab(contentDiv, prob); break;
            case 'code':    renderGenericCodeTab(contentDiv, prob); break;
        }
        container.appendChild(contentDiv);
    }

    function renderGenericProblemTab(el, prob) {
        const isLC = prob.link && prob.link.includes('leetcode');
        el.innerHTML = `
            <a href="${prob.link}" target="_blank" class="btn btn-primary" style="margin-bottom:12px;display:inline-block;font-size:0.88rem;">
                ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
            </a>
            ${prob.descriptionHTML || '<p>문제 설명이 없습니다.</p>'}
        `;
        el.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    }

    function renderGenericThinkTab(el, prob) {
        if (!prob.hints || prob.hints.length === 0) {
            el.innerHTML = '<p style="color:var(--text2);">힌트가 준비되지 않았습니다.</p>';
            return;
        }
        const wrap = document.createElement('div');
        prob.hints.forEach((hint, i) => {
            const card = document.createElement('div');
            const locked = i > 0;
            card.style.cssText = 'background:var(--bg2);border-radius:12px;padding:1rem 1.2rem;margin-bottom:0.8rem;border:1px solid var(--border);';
            card.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:0.5rem;">
                    <span style="width:24px;height:24px;border-radius:50%;background:${locked ? 'var(--bg3)' : 'var(--accent)'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;">${i + 1}</span>
                    <span style="font-weight:600;flex:1;">${hint.title}</span>
                    <span class="hint-toggle" style="cursor:pointer;">▶</span>
                    ${locked ? '<span style="font-size:0.8rem;">🔒</span>' : ''}
                </div>
                <div class="hint-body" style="display:none;">${hint.content}</div>
            `;
            const toggle = card.querySelector('.hint-toggle');
            const body = card.querySelector('.hint-body');
            const lockIcon = card.querySelector('span:last-child');
            if (locked) card.style.opacity = '0.6';
            toggle.addEventListener('click', () => {
                if (locked && card.style.opacity === '0.6') {
                    const prevBody = wrap.children[i - 1] && wrap.children[i - 1].querySelector('.hint-body');
                    if (!prevBody || prevBody.style.display === 'none') return;
                    card.style.opacity = '1';
                    if (lockIcon && lockIcon.textContent === '🔒') lockIcon.textContent = '🔓';
                }
                const isOpen = body.style.display !== 'none';
                body.style.display = isOpen ? 'none' : 'block';
                toggle.textContent = isOpen ? '▶' : '▼';
            });
            wrap.appendChild(card);
        });
        const firstBody = wrap.querySelector('.hint-body');
        const firstToggle = wrap.querySelector('.hint-toggle');
        if (firstBody) { firstBody.style.display = 'block'; firstToggle.textContent = '▼'; }
        el.appendChild(wrap);
    }

    function renderGenericCodeTab(el, prob) {
        if (!prob.templates) {
            el.innerHTML = '<p style="color:var(--text2);">코드 템플릿이 준비되지 않았습니다.</p>';
            return;
        }
        const isLC = prob.link && prob.link.includes('leetcode');
        const langs = Object.keys(prob.templates);
        el.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;flex-wrap:wrap;">
                <select class="lang-select" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border);background:var(--bg2);color:var(--text);font-family:inherit;font-size:0.88rem;">
                    ${langs.map(l => `<option value="${l}">${{python:'Python',cpp:'C++',java:'Java'}[l] || l}</option>`).join('')}
                </select>
                <a href="${prob.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
                </a>
            </div>
            <pre style="background:var(--bg2);border-radius:12px;padding:1.2rem;overflow-x:auto;border:1px solid var(--border);"><code class="code-display"></code></pre>
        `;
        const codeEl = el.querySelector('.code-display');
        const select = el.querySelector('.lang-select');
        function showCode(lang) {
            codeEl.textContent = prob.templates[lang] || '';
            codeEl.className = 'code-display language-' + (lang === 'cpp' ? 'cpp' : lang);
            if (window.hljs) hljs.highlightElement(codeEl);
        }
        select.addEventListener('change', () => showCode(select.value));
        showCode(langs[0] || 'python');
    }

    // ===== 초기화 =====
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
})();
