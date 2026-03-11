// ===== Algorithm Lab - Main App Engine =====

// ===== 전역 언어 설정 (Python / C++) =====
window._algoLang = localStorage.getItem('algo-lang') || 'python';
document.body.setAttribute('data-lang', window._algoLang);
window._setAlgoLang = function(lang) {
    window._algoLang = lang;
    localStorage.setItem('algo-lang', lang);
    document.body.setAttribute('data-lang', lang);
    // 언어 토글 UI 동기화 (문제 탭 내 토글)
    document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // 사이드바 셀렉터 동기화
    document.querySelectorAll('#lang-selector .selector-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // 코드 탭 lang-select 동기화
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

    // ===== 사이드바 글로벌 셀렉터 초기화 =====
    // 1) 한국어/English 전환
    document.querySelectorAll('#locale-selector .selector-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var locale = btn.dataset.locale;
            if (locale === 'en') {
                window.location.href = (window.location.pathname.includes('/en/') ? '' : 'en/') + 'index.html' + window.location.hash;
            }
            // 'ko'는 현재 페이지이므로 아무것도 안 함
        });
    });
    // 2) Python/C++ 전환 (사이드바)
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

    // ===== 탭 데이터 + 메인 탭바 빌드 =====
    let tabBarElement = null;

    function getTabsData() {
        if (currentProblemId && currentTopic) {
            if (currentTopic.getProblemTabs) {
                return currentTopic.getProblemTabs(currentProblemId);
            }
            return [
                { id: 'problem', label: '문제', icon: '📋' },
                { id: 'think', label: '생각해볼것', icon: '💡' },
                { id: 'code', label: '코드', icon: '💻' }
            ];
        }
        return (currentTopic && currentTopic.tabs) || [
            { id: 'concept', label: '개념 설명', icon: '📖' },
            { id: 'visualize', label: '시각화', icon: '🎮' },
            { id: 'problem', label: '문제풀이', icon: '✏️' }
        ];
    }

    function renderTabs() {
        tabNav.innerHTML = '';

        // 랜딩 페이지에서는 탭바 없음
        if (currentTab === 'landing') { tabBarElement = null; return; }

        const tabs = getTabsData();
        const activeIdx = tabs.findIndex(t => t.id === currentTab);

        // 프로그레스 바
        const bar = document.createElement('div');
        bar.className = 'tab-bar-main';

        const progress = document.createElement('div');
        progress.className = 'tab-progress';
        const pct = tabs.length > 1 ? (activeIdx / (tabs.length - 1)) * 100 : 0;
        progress.innerHTML = '<div class="tab-progress-fill" style="width:' + pct + '%"></div>';
        bar.appendChild(progress);

        // 탭 버튼 행
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

            // 화살표 (마지막 탭 제외)
            if (i < tabs.length - 1) {
                const arrow = document.createElement('span');
                arrow.className = 'tab-arrow';
                arrow.textContent = '→';
                navRow.appendChild(arrow);
            }
        });

        bar.appendChild(navRow);

        // 언어 토글 (문제 탭에서만 표시)
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
                    // 현재 탭 내용 재렌더링
                    renderContent();
                });
            });
            bar.appendChild(langToggle);
        }

        tabBarElement = bar;
    }

    // ===== 탭 전환 유틸 (외부에서 호출 가능) =====
    window._switchToTab = function(tabId) {
        currentTab = tabId;
        renderTabs();
        renderContent();
        setTimeout(() => { content.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    };

    // ===== 콘텐츠 렌더링 =====
    function renderContent() {
        if (!currentTopic) return;

        content.innerHTML = '';

        // 메인 탭바 삽입 (랜딩이 아닐 때)
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
            // 개념/시각화 드릴다운 → 상단에 뒤로가기 버튼 삽입
            const backBtn = document.createElement('button');
            backBtn.className = 'back-to-landing-btn';
            backBtn.innerHTML = '← ' + currentTopic.icon + ' ' + currentTopic.title + ' 홈으로';
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
        // 시각화 체험이 빈 토픽이면 버튼 숨기기
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

    // ===== Flow Bridge 헬퍼 =====
    function getFlowTexts(tabs) {
        var texts = {};
        tabs.forEach(function(tab, i) {
            var next = tabs[i + 1] || null;
            switch (tab.id) {
                case 'problem':
                    texts[tab.id] = { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋', nextLabel: next ? '문제를 이해했다면 → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'think':
                    texts[tab.id] = { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡', nextLabel: next ? '힌트를 모두 확인했다면 → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'sim':
                    texts[tab.id] = { intro: null, icon: '🎮', nextLabel: next ? '동작 원리를 파악했다면 → ' + next.label : null, nextTab: next ? next.id : null }; break;
                case 'code':
                    texts[tab.id] = { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻', nextLabel: null, nextTab: null }; break;
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

        // Flow Intro (container에 직접 추가 — 탭 렌더러의 innerHTML 덮어쓰기 방지)
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
            ${prob.descriptionHTML || '<p>문제 설명이 없습니다.</p>'}
            <div style="text-align:right;margin-top:1.2rem;">
                <a href="${prob.link}" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
                </a>
            </div>
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
        // 안내 텍스트
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
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

                // 열렸을 때 페이지 맨 아래로 스크롤
                if (card.classList.contains('opened')) {
                    body.addEventListener('animationend', function scrollAfterOpen() {
                        body.removeEventListener('animationend', scrollAfterOpen);
                        var last = wrap.children[wrap.children.length - 1];
                        last.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    });
                }

                // 다음 스텝 잠금 해제
                if (card.classList.contains('opened') && i + 1 < prob.hints.length) {
                    const next = wrap.children[i + 1];
                    if (next) next.classList.remove('locked');
                }
            });
            wrap.appendChild(card);
        });
        el.appendChild(wrap);

        // 코드 블록에 hljs 하이라이팅 + 라인별 애니메이션 적용
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
            el.innerHTML = '<p style="color:var(--text2);">코드 템플릿이 준비되지 않았습니다.</p>';
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
            codeEl.removeAttribute('data-highlighted');
            if (window.hljs) hljs.highlightElement(codeEl);
        }
        select.addEventListener('change', () => {
            if (window._setAlgoLang) window._setAlgoLang(select.value);
            showCode(select.value);
        });
        // 전역 언어 설정 읽어서 기본값 적용
        const initLang = (window._algoLang && langs.indexOf(window._algoLang) !== -1) ? window._algoLang : (langs[0] || 'python');
        select.value = initLang;
        showCode(initLang);
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

    // ===== 설명 영역 타자 효과 =====
    // viz-step-desc / code-step-desc 텍스트가 바뀌면 타자치듯 한 글자씩 표시
    (function initDescTypewriter() {
        var _anims = new Map();                // element → { timer, fullText }

        function stop(el) {
            var a = _anims.get(el);
            if (a && a.timer) clearInterval(a.timer);
            // fullText는 유지 — observer가 "완료된 텍스트"를 외부 변경으로 오인하지 않도록
        }

        // 우리가 만든 mutation인지 판별
        function isOurChange(el) {
            var a = _anims.get(el);
            if (!a) return false;
            var cur = el.textContent;
            // 현재 텍스트가 fullText 자체이거나 그 prefix면 → 우리 타자
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
                    // timer만 해제, fullText는 _anims에 유지 (재시작 방지)
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
