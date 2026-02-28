// =========================================================
// 문자열 조작 (String Manipulation) 토픽 모듈
// =========================================================

// ===== 다중 풀이 접근법 렌더링 (공유 함수) =====
window.renderSolutionsCodeTab = function(el, prob) {
    const wrapper = document.createElement('div');
    const tabBar = document.createElement('div');
    tabBar.className = 'approach-tabs';

    prob.solutions.forEach((sol, i) => {
        const tab = document.createElement('button');
        tab.className = 'approach-tab' + (i === 0 ? ' active' : '');
        tab.dataset.index = i;
        tab.innerHTML =
            '<span class="approach-num">' + (i + 1) + '</span>' +
            '<span>' + sol.approach + '</span>' +
            '<span class="approach-complexity">' + sol.timeComplexity + '</span>';
        tab.addEventListener('click', () => showApproach(i));
        tabBar.appendChild(tab);
    });
    wrapper.appendChild(tabBar);

    const panel = document.createElement('div');
    panel.className = 'approach-panel';
    wrapper.appendChild(panel);

    function langClass(l) { return l === 'cpp' ? 'cpp' : l; }

    function highlightNewLines(codeEl, newLines) {
        if (!newLines || !newLines.length) return;
        var html = codeEl.innerHTML;
        var lines = html.split('\n');
        codeEl.innerHTML = lines.map(function(line, i) {
            if (newLines.indexOf(i + 1) !== -1) {
                return '<mark class="code-line-new">' + line + '</mark>';
            }
            return line;
        }).join('\n');
    }

    function showApproach(idx) {
        const sol = prob.solutions[idx];
        tabBar.querySelectorAll('.approach-tab').forEach((t, i) => {
            t.classList.toggle('active', i === idx);
        });
        panel.innerHTML = '';

        // 설명
        if (sol.description) {
            const desc = document.createElement('div');
            desc.className = 'approach-desc';
            desc.textContent = sol.description;
            panel.appendChild(desc);
        }

        // 복잡도 뱃지
        const meta = document.createElement('div');
        meta.className = 'approach-meta';
        meta.innerHTML =
            '<span class="approach-meta-badge time">⏱ ' + sol.timeComplexity + '</span>' +
            '<span class="approach-meta-badge space">💾 ' + sol.spaceComplexity + '</span>';
        panel.appendChild(meta);

        // 언어 셀렉터
        const langs = Object.keys(sol.templates);
        const langNames = { python: 'Python', cpp: 'C++', java: 'Java' };

        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;';
        controls.innerHTML =
            '<select class="lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;">' +
            langs.map(l => '<option value="' + l + '">' + (langNames[l] || l) + '</option>').join('') +
            '</select>';
        panel.appendChild(controls);
        const select = controls.querySelector('.lang-select');

        // === Progressive code step mode ===
        if (sol.codeSteps) {
            let currentLang = langs[0];
            let currentStep = -1;
            let isFullView = false;

            const stepDesc = document.createElement('div');
            stepDesc.className = 'code-step-desc';
            stepDesc.textContent = '▶ 다음 버튼을 눌러 코드를 단계별로 확인하세요';
            panel.appendChild(stepDesc);

            const explainerArea = document.createElement('div');
            explainerArea.className = 'code-step-explainer';
            explainerArea.style.display = 'none';
            panel.appendChild(explainerArea);

            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.innerHTML = '<pre><code></code></pre>';
            codeBlock.style.display = 'none';
            panel.appendChild(codeBlock);
            const codeEl = codeBlock.querySelector('code');

            const fullViewBtn = document.createElement('button');
            fullViewBtn.className = 'code-fullview-btn';
            fullViewBtn.textContent = '전체 코드 보기';
            panel.appendChild(fullViewBtn);

            const stepCtrl = document.createElement('div');
            stepCtrl.className = 'code-step-controls';
            stepCtrl.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled>&larr; 이전</button>' +
                '<span class="code-step-counter">시작 전</span>' +
                '<button class="btn btn-primary code-step-btn cs-next">다음 &rarr;</button>';
            panel.appendChild(stepCtrl);

            const prevBtn = stepCtrl.querySelector('.cs-prev');
            const nextBtn = stepCtrl.querySelector('.cs-next');
            const counter = stepCtrl.querySelector('.code-step-counter');

            function getSteps() {
                return (sol.codeSteps[currentLang]) || [];
            }

            function renderStep() {
                const steps = getSteps();
                prevBtn.disabled = currentStep < 0;
                nextBtn.disabled = currentStep >= steps.length - 1;

                if (currentStep < 0) {
                    counter.textContent = '시작 전';
                    stepDesc.textContent = '▶ 다음 버튼을 눌러 코드를 단계별로 확인하세요';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'none';
                    return;
                }

                const step = steps[currentStep];
                counter.textContent = 'Step ' + (currentStep + 1) + ' / ' + steps.length;
                stepDesc.innerHTML = '<strong>' + step.title + '</strong> — ' + step.desc;

                // Explanation card
                if (step.explanation) {
                    explainerArea.innerHTML = step.explanation;
                    explainerArea.style.display = 'block';
                } else {
                    explainerArea.style.display = 'none';
                }

                // Accumulate code from fragments
                const fragments = steps.slice(0, currentStep + 1).filter(s => s.code).map(s => s.code);
                const accumulated = fragments.join('\n\n');

                if (accumulated) {
                    codeBlock.style.display = 'block';
                    codeEl.textContent = accumulated;
                    codeEl.className = 'language-' + langClass(currentLang);
                    if (window.hljs) hljs.highlightElement(codeEl);

                    // Calculate new lines
                    if (step.code) {
                        const prevFrags = steps.slice(0, currentStep).filter(s => s.code).map(s => s.code);
                        const prevAcc = prevFrags.join('\n\n');
                        const prevCount = prevAcc ? prevAcc.split('\n').length : 0;
                        const totalCount = accumulated.split('\n').length;
                        const startNew = prevCount > 0 ? prevCount + 2 : 1;
                        const newLines = [];
                        for (let ln = startNew; ln <= totalCount; ln++) newLines.push(ln);
                        highlightNewLines(codeEl, newLines);
                    }
                } else {
                    codeBlock.style.display = 'none';
                }
            }

            nextBtn.addEventListener('click', () => {
                const steps = getSteps();
                if (currentStep >= steps.length - 1) return;
                currentStep++;
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = '전체 코드 보기';
                    stepCtrl.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                }
                renderStep();
                // 새 코드로 자동 스크롤 — 코드 하단이 보이도록 자연스럽게
                setTimeout(() => {
                    if (codeBlock.style.display === 'none') return;
                    var cb = codeBlock.getBoundingClientRect();
                    // 코드 블록 하단이 뷰포트 60% 아래면 올려서 보여주기
                    if (cb.bottom > window.innerHeight * 0.6) {
                        window.scrollBy({ top: cb.bottom - window.innerHeight * 0.6, behavior: 'smooth' });
                    }
                }, 50);
            });

            prevBtn.addEventListener('click', () => {
                if (currentStep < 0) return;
                currentStep--;
                renderStep();
            });

            fullViewBtn.addEventListener('click', () => {
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = '전체 코드 보기';
                    stepCtrl.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                    renderStep();
                } else {
                    isFullView = true;
                    fullViewBtn.textContent = '단계별 보기';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '';
                    codeEl.className = 'language-' + langClass(currentLang);
                    if (window.hljs) hljs.highlightElement(codeEl);
                    stepCtrl.style.display = 'none';
                    stepDesc.style.display = 'none';
                }
            });

            select.addEventListener('change', () => {
                currentLang = select.value;
                currentStep = -1;
                isFullView = false;
                fullViewBtn.textContent = '전체 코드 보기';
                stepCtrl.style.display = 'flex';
                stepDesc.style.display = 'flex';

                if (!sol.codeSteps[currentLang]) {
                    stepCtrl.style.display = 'none';
                    stepDesc.style.display = 'none';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '// 이 언어의 풀이가 없습니다.';
                    codeEl.className = 'language-' + langClass(currentLang);
                    if (window.hljs) hljs.highlightElement(codeEl);
                    fullViewBtn.style.display = 'none';
                } else {
                    fullViewBtn.style.display = 'block';
                    renderStep();
                }
            });

            if (!sol.codeSteps[currentLang]) {
                stepCtrl.style.display = 'none';
                stepDesc.style.display = 'none';
                codeBlock.style.display = 'block';
                codeEl.textContent = sol.templates[currentLang] || '';
                codeEl.className = 'language-' + langClass(currentLang);
                if (window.hljs) hljs.highlightElement(codeEl);
                fullViewBtn.style.display = 'none';
            } else {
                renderStep();
            }

        } else {
            // === Fallback: full code display ===
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            codeBlock.innerHTML = '<pre><code></code></pre>';
            panel.appendChild(codeBlock);

            const codeEl = codeBlock.querySelector('code');
            function showCode(lang) {
                codeEl.textContent = sol.templates[lang] || '// 이 언어의 풀이가 없습니다.';
                codeEl.className = 'language-' + langClass(lang);
                if (window.hljs) hljs.highlightElement(codeEl);
            }
            select.addEventListener('change', () => showCode(select.value));
            showCode(langs[0]);
        }
    }

    showApproach(0);
    el.appendChild(wrapper);
};

const stringTopic = {
    id: 'string',
    title: '문자열 조작',
    icon: '🔤',
    category: '자료구조 활용',
    order: 1,
    description: '빈도수 분석, 팰린드롬, 애너그램 등 문자열 핵심 유형과 풀이법',

    // 사이드바 확장형
    sidebarExpandable: true,

    // 단일 통합 탭 (토픽 개요용)
    tabs: [{ id: 'concept', label: '학습하기' }],

    // 문제-유형 매핑 (top-level)
    problemMeta: {
        'boj-1157':  { type: '빈도수 분석', color: 'var(--accent)', vizMethod: '_renderVizFrequency' },
        'lc-125':    { type: '팰린드롬 판별', color: 'var(--green)', vizMethod: '_renderVizPalindrome' },
        'lc-49':     { type: '애너그램 그룹화', color: '#e17055', vizMethod: '_renderVizAnagram' },
        'boj-1213':  { type: '문자열 재구성', color: '#6c5ce7', vizMethod: '_renderVizReconstruct' }
    },

    // 학습 스테이지 (순차 로드맵용)
    stages: [
        { num: 1, title: '빈도수 분석', desc: '문자 등장 횟수 세기', problemIds: ['boj-1157'] },
        { num: 2, title: '팰린드롬 판별', desc: '투 포인터 기본 패턴', problemIds: ['lc-125'] },
        { num: 3, title: '애너그램 그룹화', desc: '정렬 키 + 해시맵', problemIds: ['lc-49'] },
        { num: 4, title: '문자열 재구성', desc: '빈도수 활용한 재배열', problemIds: ['boj-1213'] },
    ],

    // 추가 유형 안내
    relatedNote: '이 외에도 투 포인터, 슬라이딩 윈도우, KMP 문자열 매칭, 문자열 파싱 등의 기법이 문자열 문제에 자주 활용됩니다.',

    // ===== 문제별 탭 정의 (app.js에서 호출) =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    // ===== 문제별 콘텐츠 렌더링 (app.js에서 호출) =====
    renderProblemContent(container, problemId, tabId) {
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }

        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }

        self._clearVizState();

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // 문제 헤더 (타입 배지 + 난이도)
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML = `
            <span style="padding:4px 12px;background:${meta.color}15;border-radius:8px;font-size:0.85rem;color:${meta.color};font-weight:600;">${meta.type}</span>
            <span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty] || ''}</span>
        `;
        container.appendChild(header);

        // Flow Intro (container에 직접 추가 — 탭 렌더러가 innerHTML 덮어쓰지 않도록)
        const flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }

        // 탭별 콘텐츠
        const contentDiv = document.createElement('div');
        container.appendChild(contentDiv);
        switch (tabId) {
            case 'problem':
                self._renderProblemTab(contentDiv, prob);
                break;
            case 'think':
                self._renderThinkTab(contentDiv, prob);
                break;
            case 'sim':
                self[meta.vizMethod](contentDiv);
                break;
            case 'code':
                self._renderCodeTab(contentDiv, prob);
                break;
        }

        // Flow Next CTA
        const tabOrder = ['problem', 'think', 'sim', 'code'];
        const tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        const ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
        const curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            const nextId = tabOrder[curIdx + 1];
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    // ===== 토픽 개요 (전체 문제 카드 표시) =====
    renderConcept(container) {
        const self = this;
        self._clearVizState();

        const problemMeta = self.problemMeta;

        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // --- 히어로 + 문제 리스트 컨테이너 ---
        container.innerHTML = `
            <div class="hero">
                <h2>🔤 문자열 조작</h2>
                <p class="hero-sub">문제를 선택하고, 생각해보고, 시뮬레이션으로 이해한 뒤, 코드를 확인해봅시다!</p>
            </div>
            <div id="str-problem-list"></div>
        `;

        const listContainer = container.querySelector('#str-problem-list');

        // --- 문제 카드 생성 ---
        self.problems.forEach(prob => {
            const meta = problemMeta[prob.id];
            if (!meta) return;

            const card = document.createElement('div');
            card.className = 'str-problem-card';
            card.style.borderLeft = `4px solid ${meta.color}`;

            card.innerHTML = `
                <div class="str-problem-header">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <span style="font-weight:700;font-size:0.95rem;">${prob.title}</span>
                        <span style="padding:2px 8px;background:${meta.color}15;border-radius:6px;font-size:0.75rem;color:${meta.color};font-weight:600;">${meta.type}</span>
                    </div>
                    <span class="problem-diff ${prob.difficulty}">${diffMap[prob.difficulty]}</span>
                </div>
                <div class="str-sub-tabs">
                    <button class="str-sub-tab active" data-sub="problem">문제</button>
                    <button class="str-sub-tab" data-sub="think">생각해볼것</button>
                    <button class="str-sub-tab" data-sub="sim">시뮬레이션</button>
                    <button class="str-sub-tab" data-sub="code">코드</button>
                </div>
                <div class="str-sub-content"></div>
            `;

            const contentEl = card.querySelector('.str-sub-content');
            const tabs = card.querySelectorAll('.str-sub-tab');

            function showTab(tabId) {
                tabs.forEach(t => t.classList.toggle('active', t.dataset.sub === tabId));
                contentEl.innerHTML = '';
                self._clearVizState();

                switch (tabId) {
                    case 'problem':
                        self._renderProblemTab(contentEl, prob);
                        break;
                    case 'think':
                        self._renderThinkTab(contentEl, prob);
                        break;
                    case 'sim':
                        self[meta.vizMethod](contentEl);
                        break;
                    case 'code':
                        self._renderCodeTab(contentEl, prob);
                        break;
                }
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => showTab(tab.dataset.sub));
            });

            showTab('problem');
            listContainer.appendChild(card);
        });
    },

    // ===== 사용하지 않는 탭 (통합됨) =====
    renderVisualize(container) {
        container.innerHTML = '';
    },

    renderProblem(container) {
        container.innerHTML = '';
    },

    // ===== 문제 서브탭: 문제 =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML = `
            ${prob.descriptionHTML}
            <div style="text-align:right;margin-top:1.2rem;">
                <a href="${prob.link}" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
                </a>
            </div>
        `;
        contentEl.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });
    },

    // ===== 문제 서브탭: 생각해볼것 =====
    _renderThinkTab(contentEl, prob) {
        // 안내 텍스트
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
        contentEl.appendChild(guide);

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};

        prob.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▾</span>
                </div>
                <div class="hint-step-body">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('opened') ? '▴' : '▾';

                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });
            hintsDiv.appendChild(step);
        });

        contentEl.appendChild(hintsDiv);
    },

    // ===== 문제 서브탭: 코드 =====
    _renderCodeTab(contentEl, prob) {
        if (prob.solutions && prob.solutions.length > 0) {
            window.renderSolutionsCodeTab(contentEl, prob);
            return;
        }
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');

        wrapper.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                <select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
                <a href="${prob.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">
                    ${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}
                </a>
            </div>
            <div class="code-block"><pre><code class="language-python"></code></pre></div>
        `;

        const codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);

        const select = wrapper.querySelector('.str-lang-select');
        select.addEventListener('change', () => {
            const lang = select.value;
            const langMap = { python: 'language-python', cpp: 'language-cpp', java: 'language-java' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        contentEl.appendChild(wrapper);
    },

    // ===== 빈도수 세기 시각화 =====
    _renderVizFrequency(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">문자열:
                    <input type="text" id="str-viz-input" value="banana"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div class="graph-svg-container" style="min-height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">빈도수 딕셔너리</div>
                    <div id="str-freq-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                        <span style="color:var(--text2);">시작을 눌러주세요</span>
                    </div>
                </div>
                <div style="min-width:140px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                    <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
            </div>
            ${self._createStepControls()}
            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 확인 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>
            </div>
        `;

        const charBoxes = container.querySelector('#str-char-boxes');
        const freqDisplay = container.querySelector('#str-freq-display');
        const statusEl = container.querySelector('#str-status');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (let i = 0; i < str.length; i++) {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${str[i]}</div>`;
                charBoxes.appendChild(box);
            }
        }

        function renderFreq(freq) {
            if (Object.keys(freq).length === 0) {
                freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
                return;
            }
            freqDisplay.innerHTML = Object.entries(freq)
                .map(([k, v]) => `<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>'${k}'</strong>: ${v}</span>`)
                .join('');
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(b => b.className),
                freq: freqDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxes[i]; });
            freqDisplay.innerHTML = s.freq;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            const str = container.querySelector('#str-viz-input').value;
            if (!str.length) { statusEl.innerHTML = '<span style="color:#e17055;">문자열을 입력해주세요!</span>'; return; }

            renderBoxes(str);
            renderFreq({});
            statusEl.innerHTML = '준비 완료';

            const steps = [];
            const freq = {};

            for (let i = 0; i < str.length; i++) {
                const idx = i, ch = str[i];
                steps.push({
                    description: `인덱스 ${idx}: '${ch}' 확인 → ${freq[ch] ? `이미 ${freq[ch]}번 → ${freq[ch]+1}번으로 증가` : '처음 등장! 1로 추가'}`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        for (let j = 0; j < str.length; j++) {
                            const box = charBoxes.querySelector(`[data-idx="${j}"]`);
                            if (!box) continue;
                            box.className = j < idx ? 'str-char-box matched' : j === idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        freq[ch] = (freq[ch] || 0) + 1;
                        renderFreq(freq);
                        statusEl.innerHTML = `'${ch}' → count = <strong>${freq[ch]}</strong>`;
                    },
                    undo() {
                        freq[ch]--;
                        if (freq[ch] === 0) delete freq[ch];
                        restoreState(this._before);
                    }
                });
            }

            const finalFreq = {};
            for (const c of str) finalFreq[c] = (finalFreq[c] || 0) + 1;
            const maxChar = Object.entries(finalFreq).sort((a, b) => b[1] - a[1])[0];

            steps.push({
                description: `완료! 가장 많은 글자: '${maxChar[0]}' (${maxChar[1]}번)`,
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">완료! 가장 많은 글자: <strong>'${maxChar[0]}'</strong> (${maxChar[1]}번)</span>`;
                },
                undo() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 팰린드롬 판별 시각화 =====
    // ===== Valid Palindrome 시뮬레이션 코디네이터 =====
    _renderVizPalindrome(container) {
        const self = this;

        function sectionHeader(num, name, time, space, color) {
            var c = color || 'var(--accent)';
            return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:' + c + ';">' +
                    '<span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:' + c + ';color:#fff;font-size:0.8rem;font-weight:700;">' + num + '</span>' +
                    name +
                '</span>' +
                '<span class="approach-meta-badge time">⏱ ' + time + '</span>' +
                '<span class="approach-meta-badge space">💾 ' + space + '</span>' +
            '</div>';
        }

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">문자열:
                    <input type="text" id="str-viz-input" value="A man, a plan, a canal: Panama"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div id="palindrome-section-1" style="margin-bottom:8px;padding:16px;background:rgba(108,92,231,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);">
                ${sectionHeader('1', '뒤집어서 비교', 'O(n)', 'O(n)', 'var(--accent)')}
                <div style="text-align:center;color:var(--text2);padding:1.5rem;">▶ 시작 버튼을 눌러주세요</div>
            </div>
            <div id="palindrome-section-2" style="padding:16px;background:rgba(9,132,227,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--blue);">
                ${sectionHeader('2', '투 포인터', 'O(n)', 'O(1)', 'var(--blue)')}
                <div style="text-align:center;color:var(--text2);padding:1.5rem;">▶ 시작 버튼을 눌러주세요</div>
            </div>
        `;

        var section1 = container.querySelector('#palindrome-section-1');
        var section2 = container.querySelector('#palindrome-section-2');

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            var raw = container.querySelector('#str-viz-input').value;
            var cleaned = raw.split('').filter(function(c) { return /[a-zA-Z0-9]/.test(c); })
                             .map(function(c) { return c.toLowerCase(); }).join('');
            if (!cleaned.length) {
                section1.innerHTML = '<div style="color:#e17055;padding:1rem;">문자열을 입력해주세요!</div>';
                section2.innerHTML = '';
                return;
            }

            section1.innerHTML = sectionHeader('1', '뒤집어서 비교', 'O(n)', 'O(n)', 'var(--accent)') + '<div id="panel-1"></div>';
            section1.style.cssText = 'margin-bottom:8px;padding:16px;background:rgba(108,92,231,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);';
            section2.innerHTML = sectionHeader('2', '투 포인터', 'O(n)', 'O(1)', 'var(--blue)') + '<div id="panel-2"></div>';
            section2.style.cssText = 'padding:16px;background:rgba(9,132,227,0.04);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--blue);';

            self._renderVizPalinCleanReverse(section1.querySelector('#panel-1'), cleaned);
            self._renderVizPalinTwoPointer(section2.querySelector('#panel-2'), cleaned);
        });
    },

    // ===== 방법 1: 뒤집어서 비교 시뮬레이션 =====
    _renderVizPalinCleanReverse(panel, cleaned) {
        const self = this;
        const reversed = cleaned.split('').reverse().join('');

        panel.innerHTML = `
            <div style="margin-bottom:12px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">알파벳만 남긴 문자열</div>
                <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                    <div id="str-cleaned-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">뒤집은 문자열</div>
                <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                    <div id="str-reversed-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">비교 상태</div>
                <div id="str-status-1" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
            </div>
            ${self._createStepControls('-1')}
            <div style="display:flex;gap:16px;padding:10px 16px;background:rgba(108,92,231,0.04);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 비교 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 일치</span>
            </div>
        `;

        var cleanedBoxes = panel.querySelector('#str-cleaned-boxes-1');
        var reversedBoxes = panel.querySelector('#str-reversed-boxes-1');
        var statusEl = panel.querySelector('#str-status-1');

        function renderBoxRow(containerEl, str) {
            containerEl.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                containerEl.appendChild(box);
            }
        }

        function saveState() {
            return {
                cleanedClasses: Array.from(cleanedBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                reversedClasses: Array.from(reversedBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                reversedHTML: reversedBoxes.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.cleanedClasses[i]; });
            reversedBoxes.innerHTML = s.reversedHTML;
            reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { if (s.reversedClasses[i]) b.className = s.reversedClasses[i]; });
            statusEl.innerHTML = s.status;
        }

        var steps = [];

        // Step 1: 알파벳만 남기기 완료
        steps.push({
            description: '알파벳만 남기기: "' + cleaned + '" (길이 ' + cleaned.length + ')',
            _before: null,
            action: function() {
                this._before = saveState();
                renderBoxRow(cleanedBoxes, cleaned);
                reversedBoxes.innerHTML = '<span style="color:var(--text3);padding:8px;">아직 생성되지 않음</span>';
                statusEl.innerHTML = '알파벳만 남기기 완료: 길이 ' + cleaned.length;
            },
            undo: function() { restoreState(this._before); }
        });

        // Step 2: 뒤집기
        steps.push({
            description: '뒤집기 완료: "' + reversed + '" — O(n) 추가 공간 사용!',
            _before: null,
            action: function() {
                this._before = saveState();
                renderBoxRow(reversedBoxes, reversed);
                statusEl.innerHTML = 'reversed = cleaned[::-1] — <strong style="color:#e17055;">O(n) 추가 공간 사용!</strong>';
            },
            undo: function() { restoreState(this._before); }
        });

        // Step 3~n: 비교
        var isPalin = true;
        for (var i = 0; i < cleaned.length; i++) {
            (function(idx) {
                var match = cleaned[idx] === reversed[idx];
                if (!match) isPalin = false;
                steps.push({
                    description: match
                        ? 'cleaned[' + idx + "]='" + cleaned[idx] + "' == reversed[" + idx + "]='" + reversed[idx] + "' → 일치!"
                        : 'cleaned[' + idx + "]='" + cleaned[idx] + "' != reversed[" + idx + "]='" + reversed[idx] + "' → 불일치!",
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                            if (j < idx) b.className = 'str-char-box matched';
                            else if (j === idx) b.className = match ? 'str-char-box comparing' : 'str-char-box comparing';
                            else b.className = 'str-char-box';
                        });
                        reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                            if (j < idx) b.className = 'str-char-box matched';
                            else if (j === idx) b.className = match ? 'str-char-box comparing' : 'str-char-box comparing';
                            else b.className = 'str-char-box';
                        });
                        statusEl.innerHTML = match
                            ? '<span style="color:var(--green);">\'' + cleaned[idx] + "' == '" + reversed[idx] + "' ✓</span>"
                            : '<span style="color:#e17055;">\'' + cleaned[idx] + "' != '" + reversed[idx] + "' ✗</span>";
                    },
                    undo: function() { restoreState(this._before); }
                });
                if (!match) return;
            })(i);
            if (!isPalin) break;
        }

        // 최종 결과
        var finalIsPalin = isPalin;
        steps.push({
            description: finalIsPalin ? '팰린드롬입니다! cleaned == reversed' : '팰린드롬이 아닙니다. 불일치 발견!',
            _before: null,
            action: function() {
                this._before = saveState();
                if (finalIsPalin) {
                    cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                }
                statusEl.innerHTML = finalIsPalin
                    ? '<span style="color:var(--green);font-size:1.1rem;"><strong>팰린드롬입니다!</strong> cleaned == reversed ✓</span>'
                    : '<span style="color:#e17055;font-size:1.1rem;"><strong>팰린드롬이 아닙니다</strong> cleaned != reversed ✗</span>';
            },
            undo: function() { restoreState(this._before); }
        });

        self._initLocalStepController(panel, steps, '-1');
    },

    // ===== 방법 2: 투 포인터 시뮬레이션 =====
    _renderVizPalinTwoPointer(panel, cleaned) {
        const self = this;

        panel.innerHTML = `
            <div style="margin-bottom:12px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">알파벳만 남긴 문자열</div>
                <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                    <div id="str-char-boxes-2" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">비교 상태</div>
                    <div id="str-status-2" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
            </div>
            ${self._createStepControls('-2')}
            <div style="display:flex;gap:16px;padding:10px 16px;background:rgba(108,92,231,0.04);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> L / R 포인터</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 일치 확인</span>
            </div>
        `;

        var charBoxes = panel.querySelector('#str-char-boxes-2');
        var statusEl = panel.querySelector('#str-status-2');

        // 박스 렌더링
        charBoxes.innerHTML = '';
        for (var i = 0; i < cleaned.length; i++) {
            var box = document.createElement('div');
            box.className = 'str-char-box';
            box.dataset.idx = i;
            box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + cleaned[i] + '</div>';
            charBoxes.appendChild(box);
        }
        statusEl.innerHTML = '알파벳만 남기기 완료 (길이 ' + cleaned.length + ')';

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            statusEl.innerHTML = s.status;
        }

        var steps = [];
        var L = 0, R = cleaned.length - 1;

        while (L < R) {
            (function(l, r) {
                var match = cleaned[l] === cleaned[r];
                steps.push({
                    description: match
                        ? 'L=' + l + " ('" + cleaned[l] + "') == R=" + r + " ('" + cleaned[r] + "') → 일치! 안쪽으로 이동"
                        : 'L=' + l + " ('" + cleaned[l] + "') != R=" + r + " ('" + cleaned[r] + "') → 불일치!",
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        charBoxes.querySelectorAll('.str-char-box').forEach(function(b) {
                            var idx = parseInt(b.dataset.idx);
                            if (idx === l || idx === r) b.className = 'str-char-box comparing';
                            else if (idx < l || idx > r) b.className = 'str-char-box matched';
                            else b.className = 'str-char-box';
                        });
                        statusEl.innerHTML = match
                            ? '<span style="color:var(--green);">\'' + cleaned[l] + "' == '" + cleaned[r] + "' ✓</span>"
                            : '<span style="color:#e17055;">\'' + cleaned[l] + "' != '" + cleaned[r] + "' ✗</span>";
                    },
                    undo: function() { restoreState(this._before); }
                });
            })(L, R);

            if (cleaned[L] !== cleaned[R]) break;
            L++; R--;
        }

        var isPalin = L >= R;
        steps.push({
            description: isPalin ? '팰린드롬입니다! 모든 쌍이 일치했습니다.' : '팰린드롬이 아닙니다. 불일치가 발견되었습니다.',
            _before: null,
            action: function() {
                this._before = saveState();
                charBoxes.querySelectorAll('.str-char-box').forEach(function(b) {
                    b.className = isPalin ? 'str-char-box matched' : b.className;
                });
                statusEl.innerHTML = isPalin
                    ? '<span style="color:var(--green);font-size:1.1rem;"><strong>팰린드롬입니다!</strong> ✓</span>'
                    : '<span style="color:#e17055;font-size:1.1rem;"><strong>팰린드롬이 아닙니다</strong> ✗</span>';
            },
            undo: function() { restoreState(this._before); }
        });

        self._initLocalStepController(panel, steps, '-2');
    },

    // ===== 애너그램 그룹화 시각화 =====
    _renderVizAnagram(container) {
        const self = this;
        const words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

        container.innerHTML = `
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">단어 목록</div>
                <div class="graph-svg-container" style="min-height:50px;display:flex;align-items:center;justify-content:center;padding:16px;gap:8px;flex-wrap:wrap;">
                    ${words.map((w, i) => `<span class="str-char-box" data-widx="${i}" style="padding:6px 14px;font-size:1rem;"><div class="str-char-val">${w}</div></span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 처리</div>
                <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">시작 버튼을 눌러주세요</div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">그룹 (정렬 키 → 단어들)</div>
                <div id="str-groups" style="display:flex;flex-direction:column;gap:10px;min-height:60px;"></div>
            </div>
            <div style="margin-bottom:12px;">
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            ${self._createStepControls()}
        `;

        const statusEl = container.querySelector('#str-status');
        const groupsEl = container.querySelector('#str-groups');
        const wordEls = container.querySelectorAll('[data-widx]');

        const groupColors = ['var(--accent)', 'var(--green)', 'var(--yellow)', '#e17055', '#00cec9', '#fd79a8'];

        function saveState() {
            return {
                words: Array.from(wordEls).map(w => w.className),
                status: statusEl.innerHTML,
                groups: groupsEl.innerHTML
            };
        }

        function restoreState(s) {
            wordEls.forEach((w, i) => { w.className = s.words[i]; });
            statusEl.innerHTML = s.status;
            groupsEl.innerHTML = s.groups;
        }

        function renderGroups(groups) {
            groupsEl.innerHTML = '';
            let colorIdx = 0;
            for (const [key, vals] of Object.entries(groups)) {
                const color = groupColors[colorIdx % groupColors.length];
                const div = document.createElement('div');
                div.className = 'graph-queue-display';
                div.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap;border-left:4px solid ${color};`;
                div.innerHTML = `
                    <span style="font-weight:700;color:${color};min-width:50px;">"${key}"</span>
                    <span style="color:var(--text2);">→</span>
                    ${vals.map(v => `<span class="graph-queue-item">${v}</span>`).join('')}
                `;
                groupsEl.appendChild(div);
                colorIdx++;
            }
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            groupsEl.innerHTML = '';
            wordEls.forEach(w => { w.className = 'str-char-box'; w.style.cssText = 'padding:6px 14px;font-size:1rem;'; });
            statusEl.innerHTML = '준비 완료';

            const steps = [];
            const groups = {};

            words.forEach((word, i) => {
                const sorted = word.split('').sort().join('');
                const isNew = !groups[sorted];
                const descSnippet = isNew
                    ? `"${word}" → sorted: "${sorted}" → 새 그룹 생성!`
                    : `"${word}" → sorted: "${sorted}" → 기존 그룹에 추가`;

                steps.push({
                    description: descSnippet,
                    _before: null,
                    action() {
                        this._before = saveState();
                        wordEls.forEach((w, j) => {
                            if (j < i) w.className = 'str-char-box matched';
                            else if (j === i) w.className = 'str-char-box comparing';
                            else w.className = 'str-char-box';
                            w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                        });
                        if (!groups[sorted]) groups[sorted] = [];
                        groups[sorted].push(word);
                        renderGroups(groups);
                        statusEl.innerHTML = `"${word}" → <strong>sorted("${word}") = "${sorted}"</strong> → ${isNew ? '새 그룹!' : '기존 그룹에 추가'}`;
                    },
                    undo() {
                        groups[sorted].pop();
                        if (groups[sorted].length === 0) delete groups[sorted];
                        restoreState(this._before);
                    }
                });
            });

            const totalGroups = {};
            words.forEach(w => { const k = w.split('').sort().join(''); if (!totalGroups[k]) totalGroups[k] = []; totalGroups[k].push(w); });

            steps.push({
                description: `완료! 총 ${Object.keys(totalGroups).length}개 그룹으로 분류되었습니다.`,
                _before: null,
                action() {
                    this._before = saveState();
                    wordEls.forEach(w => { w.className = 'str-char-box matched'; w.style.cssText = 'padding:6px 14px;font-size:1rem;'; });
                    statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;"><strong>완료!</strong> ${Object.keys(totalGroups).length}개 그룹: ${Object.values(totalGroups).map(g => '[' + g.join(', ') + ']').join(', ')}</span>`;
                },
                undo() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 문자열 재구성 시각화 =====
    _renderVizReconstruct(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">입력 문자열:
                    <input type="text" id="str-viz-input" value="AABB"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;text-transform:uppercase;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            <div class="graph-svg-container" style="min-height:60px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
            </div>
            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">빈도수</div>
                    <div id="str-freq-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                        <span style="color:var(--text2);">시작을 눌러주세요</span>
                    </div>
                </div>
                <div style="flex:1;min-width:180px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">결과 조립</div>
                    <div id="str-result-display" class="graph-queue-display" style="min-height:50px;display:flex;gap:4px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">—</div>
                </div>
            </div>
            <div style="margin-bottom:16px;">
                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
            </div>
            ${self._createStepControls()}
        `;

        const charBoxes = container.querySelector('#str-char-boxes');
        const freqDisplay = container.querySelector('#str-freq-display');
        const resultDisplay = container.querySelector('#str-result-display');
        const statusEl = container.querySelector('#str-status');

        function saveState() {
            return {
                boxes: charBoxes.innerHTML,
                freq: freqDisplay.innerHTML,
                result: resultDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.innerHTML = s.boxes;
            freqDisplay.innerHTML = s.freq;
            resultDisplay.innerHTML = s.result;
            statusEl.innerHTML = s.status;
        }

        container.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            const input = container.querySelector('#str-viz-input').value.toUpperCase();
            if (!input.length) { statusEl.innerHTML = '<span style="color:#e17055;">문자열을 입력해주세요!</span>'; return; }

            // 입력 글자 박스
            charBoxes.innerHTML = input.split('').map((c, i) =>
                `<div class="str-char-box" data-idx="${i}"><div class="str-char-idx">${i}</div><div class="str-char-val">${c}</div></div>`
            ).join('');
            freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
            resultDisplay.innerHTML = '—';
            statusEl.innerHTML = '준비 완료';

            const steps = [];

            // 빈도수 계산
            const count = {};
            for (const c of input) count[c] = (count[c] || 0) + 1;

            // Step 1: 빈도수 세기
            steps.push({
                description: `각 알파벳의 빈도수를 셉니다: ${Object.entries(count).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `${k}:${v}`).join(', ')}`,
                _before: null,
                action() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(b => b.className = 'str-char-box matched');
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => `<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>'${k}'</strong>: ${v}</span>`)
                        .join('');
                    statusEl.innerHTML = '빈도수 세기 완료!';
                },
                undo() { restoreState(this._before); }
            });

            // Step 2: 홀수 개수 확인
            const oddChars = Object.entries(count).filter(([, v]) => v % 2 === 1);
            const canMake = oddChars.length <= 1;

            steps.push({
                description: canMake
                    ? `홀수 빈도 글자: ${oddChars.length}개 (≤1) → 팰린드롬 만들 수 있습니다!`
                    : `홀수 빈도 글자: ${oddChars.length}개 (>1) → 팰린드롬 불가능!`,
                _before: null,
                action() {
                    this._before = saveState();
                    freqDisplay.innerHTML = Object.entries(count)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([k, v]) => {
                            const isOdd = v % 2 === 1;
                            const bg = isOdd ? 'rgba(225,112,85,0.2)' : 'rgba(0,184,148,0.15)';
                            const border = isOdd ? '#e17055' : 'var(--green)';
                            return `<span class="graph-queue-item" style="min-width:50px;text-align:center;background:${bg};border-color:${border};"><strong>'${k}'</strong>: ${v} ${isOdd ? '(홀)' : '(짝)'}</span>`;
                        }).join('');
                    statusEl.innerHTML = canMake
                        ? `<span style="color:var(--green);">홀수 빈도 ${oddChars.length}개 ≤ 1 → 팰린드롬 가능!</span>`
                        : `<span style="color:#e17055;">홀수 빈도 ${oddChars.length}개 > 1 → 불가능! "I'm Sorry Hansoo"</span>`;
                },
                undo() { restoreState(this._before); }
            });

            if (canMake) {
                // Step 3: 앞 절반 + 가운데 + 뒤 절반 조립
                let half = '';
                let mid = '';
                const sorted = Object.keys(count).sort();
                for (const c of sorted) {
                    if (count[c] % 2 === 1) mid = c;
                    half += c.repeat(Math.floor(count[c] / 2));
                }
                const revHalf = half.split('').reverse().join('');

                steps.push({
                    description: `조립: 앞 절반 "${half}" ${mid ? `+ 가운데 "${mid}" ` : ''}+ 뒤 절반 "${revHalf}"`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        let html = '';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">앞:</span>';
                        html += half.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        if (mid) {
                            html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                            html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">가운데:</span>';
                            html += `<span class="str-char-box comparing" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${mid}</div></span>`;
                        }
                        html += '<span style="color:var(--text2);margin:0 6px;font-weight:700;">+</span>';
                        html += '<span style="color:var(--text2);font-size:0.8rem;margin-right:4px;">뒤:</span>';
                        html += revHalf.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        resultDisplay.innerHTML = html;
                        statusEl.innerHTML = `앞: "${half}" ${mid ? `+ 가운데: "${mid}" ` : ''}+ 뒤: "${revHalf}"`;
                    },
                    undo() { restoreState(this._before); }
                });

                // Step 4: 최종 결과
                const result = half + mid + revHalf;
                steps.push({
                    description: `완료! 결과: "${result}"`,
                    _before: null,
                    action() {
                        this._before = saveState();
                        resultDisplay.innerHTML = result.split('').map(c =>
                            `<span class="str-char-box matched" style="padding:4px 10px;min-width:auto;"><div class="str-char-val">${c}</div></span>`
                        ).join('');
                        statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;"><strong>완료!</strong> 팰린드롬: "${result}"</span>`;
                    },
                    undo() { restoreState(this._before); }
                });
            }

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) {
            document.removeEventListener('keydown', s.keydownHandler);
            s.keydownHandler = null;
        }
        s.steps = [];
        s.currentStep = -1;
    },

    _createStepControls(suffix) {
        const s = suffix || '';
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev${s}" disabled>&larr; 이전</button>
                <span id="viz-step-counter${s}" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next${s}">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc${s}" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>
        `;
    },

    _initLocalStepController(el, steps, suffix) {
        const s = suffix || '';
        let currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev' + s);
        const nextBtn = el.querySelector('#viz-next' + s);
        const counter = el.querySelector('#viz-step-counter' + s);
        const desc = el.querySelector('#viz-step-desc' + s);

        const updateUI = () => {
            prevBtn.disabled = (currentStep < 0);
            nextBtn.disabled = (currentStep >= steps.length - 1);
            if (currentStep < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = `Step ${currentStep + 1} / ${steps.length}`;
                desc.textContent = steps[currentStep].description;
            }
        };

        nextBtn.addEventListener('click', () => {
            if (currentStep >= steps.length - 1) return;
            currentStep++;
            steps[currentStep].action();
            updateUI();
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep < 0) return;
            steps[currentStep].undo();
            currentStep--;
            updateUI();
        });

        updateUI();
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = `Step ${idx + 1} / ${total}`;
                desc.textContent = state.steps[idx].description;
            }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo();
            state.currentStep--;
            updateUI();
        });

        const handleKeydown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKeydown);
        state.keydownHandler = handleKeydown;

        updateUI();
    },

    // ===== 문제 데이터 =====
    problems: [
        {
            id: 'boj-1157',
            title: 'BOJ 1157 - 단어 공부',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1157',
            simIntro: '힌트에서 배운 count[26] 배열이 글자마다 어떻게 채워지는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>알파벳 대소문자로 이루어진 단어가 주어집니다.
                이 단어에서 <strong>가장 많이 사용된 알파벳</strong>을 대문자로 출력하세요.
                가장 많이 사용된 알파벳이 여러 개라면 <code>?</code>를 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>알파벳 대소문자로 이루어진 단어 (길이 &le; 1,000,000)</p></div>
                    <div><h4>출력</h4>
                    <p>가장 많이 사용된 알파벳을 대문자로 출력. 여러 개면 ?</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>Mississipi</pre></div>
                    <div><strong>출력</strong><pre>?</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 자료구조를 쓸까?',
                    content: '알파벳은 26개뿐입니다. 크기 26인 <strong>배열(리스트)</strong>을 만들어서 각 알파벳의 개수를 세면 됩니다!'
                },
                {
                    title: '핵심 아이디어',
                    content: '모든 글자를 대문자(또는 소문자)로 바꾼 뒤, <code>count[ord(c) - ord(\'A\')] += 1</code>로 빈도를 셉니다.<br>최댓값을 찾고, 같은 값이 2개 이상이면 <code>?</code>를 출력합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>count = [0] * 26</code>으로 배열 초기화 → 순회하며 카운트 → <code>max(count)</code>로 최대 빈도 → <code>count.count(max_val)</code>로 개수 확인'
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

word = input().strip().upper()
count = [0] * 26

for c in word:
    count[ord(c) - ord('A')] += 1

max_count = max(count)

if count.count(max_count) > 1:
    print('?')
else:
    print(chr(count.index(max_count) + ord('A')))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string word;
    cin >> word;

    int cnt[26] = {};
    for (char c : word) cnt[toupper(c) - 'A']++;

    int mx = *max_element(cnt, cnt + 26);
    int idx = -1, dup = 0;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] == mx) { idx = i; dup++; }
    }
    printf("%c\\n", dup > 1 ? '?' : 'A' + idx);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String word = br.readLine().toUpperCase();

        int[] cnt = new int[26];
        for (char c : word.toCharArray()) cnt[c - 'A']++;

        int mx = 0, idx = 0, dup = 0;
        for (int i = 0; i < 26; i++) {
            if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }
            else if (cnt[i] == mx && mx > 0) dup++;
        }
        System.out.println(dup > 1 ? "?" : (char)('A' + idx));
    }
}`
            },
            solutions: [
                {
                    approach: '배열 카운팅',
                    description: '크기 26 배열로 각 알파벳 빈도를 세고, 최댓값을 가진 문자를 찾는다',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `word = input().upper()
cnt = [0] * 26
for c in word:
    cnt[ord(c) - ord('A')] += 1

mx = max(cnt)
if cnt.count(mx) > 1:
    print('?')
else:
    print(chr(cnt.index(mx) + ord('A')))`,
                        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {};
    for (char c : s) cnt[toupper(c) - 'A']++;

    int mx = 0, idx = 0, dup = 0;
    for (int i = 0; i < 26; i++) {
        if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }
        else if (cnt[i] == mx && mx > 0) dup++;
    }
    cout << (dup > 1 ? "?" : string(1, 'A' + idx)) << endl;
}`,
                        java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String word = br.readLine().toUpperCase();
        int[] cnt = new int[26];
        for (char c : word.toCharArray()) cnt[c - 'A']++;

        int mx = 0, idx = 0, dup = 0;
        for (int i = 0; i < 26; i++) {
            if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }
            else if (cnt[i] == mx && mx > 0) dup++;
        }
        System.out.println(dup > 1 ? "?" : (char)('A' + idx));
    }
}`
                    }
                },
                {
                    approach: '딕셔너리',
                    description: '딕셔너리(해시맵)로 문자별 빈도를 세고, 최댓값을 찾는다',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `word = input().upper()
freq = {}
for c in word:
    freq[c] = freq.get(c, 0) + 1

mx = max(freq.values())
candidates = [k for k, v in freq.items() if v == mx]
print('?' if len(candidates) > 1 else candidates[0])`,
                        cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string s;
    cin >> s;
    unordered_map<char, int> freq;
    for (char c : s) freq[toupper(c)]++;

    int mx = 0;
    for (auto& [ch, cnt] : freq) mx = max(mx, cnt);

    int dup = 0;
    char ans = '?';
    for (auto& [ch, cnt] : freq) {
        if (cnt == mx) { ans = ch; dup++; }
    }
    cout << (dup > 1 ? '?' : ans) << endl;
}`,
                        java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String word = br.readLine().toUpperCase();
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : word.toCharArray()) {
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        int mx = Collections.max(freq.values());
        int dup = 0;
        char ans = '?';
        for (var e : freq.entrySet()) {
            if (e.getValue() == mx) { ans = e.getKey(); dup++; }
        }
        System.out.println(dup > 1 ? "?" : ans);
    }
}`
                    }
                },
                {
                    approach: 'Counter',
                    description: 'Counter의 most_common()으로 가장 빈도 높은 문자를 바로 구한다',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `from collections import Counter

word = input().upper()
counter = Counter(word)
top = counter.most_common()

if len(top) > 1 and top[0][1] == top[1][1]:
    print('?')
else:
    print(top[0][0])`
                    }
                }
            ]
        },
        {
            id: 'lc-125',
            title: 'LeetCode 125 - Valid Palindrome',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/valid-palindrome/',
            simIntro: '힌트 3에서 배운 투 포인터가 양쪽 끝에서 어떻게 좁혀가는지 직접 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 <code>s</code>가 주어집니다.
                <strong>영문자와 숫자만</strong> 남기고, 대소문자를 무시했을 때
                팰린드롬(앞뒤가 같은 문자열)인지 판별하세요.</p>
                <p>빈 문자열은 팰린드롬으로 간주합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>문자열 s (1 &le; len(s) &le; 200,000)</p></div>
                    <div><h4>출력</h4>
                    <p>팰린드롬이면 true, 아니면 false</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>"A man, a plan, a canal: Panama"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '전처리가 핵심!',
                    content: '먼저 영문자/숫자가 아닌 문자를 제거하고, 모두 소문자로 바꿉니다. <code>isalnum()</code>과 <code>lower()</code>를 사용하세요.'
                },
                {
                    title: '풀이 방법 2가지',
                    content: '방법 1: 정제 후 <code>s == s[::-1]</code> (간단!)<br>방법 2: 투 포인터로 양쪽에서 비교 (메모리 절약!)'
                },
                {
                    title: '투 포인터 풀이',
                    content: '<code>left, right</code>를 양 끝에서 시작. 영문자/숫자가 아닌 건 건너뛰고, 같으면 이동, 다르면 False'
                }
            ],
            templates: {
                python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # 방법 1: 간단한 풀이
        s = ''.join(c.lower() for c in s if c.isalnum())
        return s == s[::-1]

    def isPalindrome_twopointer(self, s: str) -> bool:
        # 방법 2: 투 포인터 (메모리 절약)
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`,
                cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
                java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) !=
                Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
            },
            solutions: [
                {
                    approach: '뒤집어서 비교',
                    description: '영숫자만 남기고 소문자로 변환 후, 뒤집은 문자열과 비교한다',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        cleaned = ''
        for c in s:
            if c.isalnum():
                cleaned += c.lower()
        return cleaned == cleaned[::-1]

    # 💡 한 줄 버전 (정규식 활용)
    # import re
    # s = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    # return s == s[::-1]`,
                        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        string cleaned;
        for (char c : s) {
            if (isalnum(c)) cleaned += tolower(c);
        }
        string rev = cleaned;
        reverse(rev.begin(), rev.end());
        return cleaned == rev;
    }
};`,
                        java: `class Solution {
    public boolean isPalindrome(String s) {
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (Character.isLetterOrDigit(c)) {
                sb.append(Character.toLowerCase(c));
            }
        }
        String cleaned = sb.toString();
        return cleaned.equals(sb.reverse().toString());
    }
}`
                    }
                },
                {
                    approach: '투 포인터',
                    description: '양쪽 끝에서 좁혀가며 비교 — 추가 문자열 생성 없이 O(1) 공간',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True`,
                        cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`,
                        java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) !=
                Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`
                    }
                }
            ]
        },
        {
            id: 'lc-49',
            title: 'LeetCode 49 - Group Anagrams',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/group-anagrams/',
            simIntro: '정렬 키로 애너그램이 어떻게 같은 그룹으로 묶이는지 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 배열 <code>strs</code>가 주어집니다.
                <strong>애너그램(같은 글자로 이루어진 단어)</strong>끼리 그룹으로 묶어서 반환하세요.</p>
                <p>결과의 순서는 상관없습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>문자열 배열 strs (1 &le; len &le; 10,000)</p></div>
                    <div><h4>출력</h4>
                    <p>애너그램 그룹 리스트</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>["eat","tea","tan","ate","nat","bat"]</pre></div>
                    <div><strong>출력</strong><pre>[["bat"],["nat","tan"],["ate","eat","tea"]]</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '애너그램의 특징은?',
                    content: '애너그램은 <strong>같은 글자를 재배열</strong>한 것입니다. 정렬하면 모두 같은 문자열이 됩니다! "eat" → "aet", "tea" → "aet"'
                },
                {
                    title: '핵심 아이디어',
                    content: '각 단어를 정렬한 결과를 <strong>키(key)</strong>로, 원본 단어를 <strong>값(value)</strong>으로 딕셔너리에 넣습니다.<br><code>defaultdict(list)</code>를 사용하면 편합니다.'
                },
                {
                    title: '시간 복잡도',
                    content: '단어 수 N, 최대 길이 K일 때: <strong>O(N × K log K)</strong> (정렬 때문)<br>Counter 튜플을 키로 쓰면 O(N × K)도 가능합니다.'
                }
            ],
            templates: {
                python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))  # 정렬 키
            groups[key].append(s)
        return list(groups.values())

    # 대안: Counter 기반 (O(NK))
    def groupAnagrams_counter(self, strs):
        groups = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            groups[tuple(count)].append(s)
        return list(groups.values())`,
                cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> mp;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            mp[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [k, v] : mp) res.push_back(v);
        return res;
    }
};`,
                java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] arr = s.toCharArray();
            Arrays.sort(arr);
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
            },
            solutions: [
                {
                    approach: '정렬 키',
                    description: '각 단어를 정렬한 결과를 키로 사용하여 같은 애너그램끼리 그룹화',
                    timeComplexity: 'O(NK log K)',
                    spaceComplexity: 'O(NK)',
                    templates: {
                        python: `class Solution:
    def groupAnagrams(self, strs):
        groups = {}
        for s in strs:
            key = ''.join(sorted(s))
            if key not in groups:
                groups[key] = []
            groups[key].append(s)
        return list(groups.values())`,
                        cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> mp;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            mp[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [k, v] : mp) res.push_back(v);
        return res;
    }
};`,
                        java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] arr = s.toCharArray();
            Arrays.sort(arr);
            String key = new String(arr);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
                    }
                },
                {
                    approach: '빈도수 튜플 키',
                    description: '각 문자의 출현 횟수를 튜플로 만들어 키로 사용 — 정렬 없이 O(NK)',
                    timeComplexity: 'O(NK)',
                    spaceComplexity: 'O(NK)',
                    templates: {
                        python: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            groups[tuple(count)].append(s)
        return list(groups.values())`,
                        cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> mp;
        for (auto& s : strs) {
            int cnt[26] = {};
            for (char c : s) cnt[c - 'a']++;
            string key;
            for (int i = 0; i < 26; i++)
                key += to_string(cnt[i]) + '#';
            mp[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [k, v] : mp) res.push_back(v);
        return res;
    }
};`,
                        java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            int[] cnt = new int[26];
            for (char c : s.toCharArray()) cnt[c - 'a']++;
            String key = Arrays.toString(cnt);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`
                    }
                }
            ]
        },
        {
            id: 'boj-1213',
            title: 'BOJ 1213 - 팰린드롬 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1213',
            simIntro: '글자 빈도를 세고 절반씩 배치하는 과정을 단계별로 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>영어 대문자로만 이루어진 이름이 주어집니다.
                이 이름의 글자들을 재배열해서 <strong>팰린드롬</strong>을 만드세요.
                가능한 팰린드롬 중 사전순으로 가장 앞서는 것을 출력합니다.</p>
                <p>팰린드롬을 만들 수 없으면 <code>I'm Sorry Hansoo</code>를 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>영어 대문자로 이루어진 이름 (길이 &le; 50)</p></div>
                    <div><h4>출력</h4>
                    <p>사전순 가장 앞서는 팰린드롬 또는 I'm Sorry Hansoo</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>AABB</pre></div>
                    <div><strong>출력</strong><pre>ABBA</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '팰린드롬이 되려면?',
                    content: '팰린드롬에서 <strong>홀수 번 등장하는 글자는 최대 1개</strong>여야 합니다!<br>홀수 글자가 2개 이상이면 팰린드롬을 만들 수 없습니다.'
                },
                {
                    title: '어떻게 구성할까?',
                    content: '각 글자의 빈도를 센 뒤, <strong>절반씩</strong> 양쪽에 배치합니다.<br>홀수인 글자가 있으면 그건 가운데에 놓습니다. 사전순으로 만들려면 앞부분을 ABC 순서로!'
                },
                {
                    title: '정답 코드 구조',
                    content: '빈도 배열 count[26] → 홀수 개수 체크 → half = 각 글자 count//2개씩 → mid = 홀수인 글자 → <code>half + mid + reverse(half)</code>'
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

name = input().strip()
count = [0] * 26

for c in name:
    count[ord(c) - ord('A')] += 1

# 홀수 개수인 알파벳이 2개 이상이면 불가능
odd_count = sum(1 for c in count if c % 2 == 1)
if odd_count > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for i in range(26):
        if count[i] % 2 == 1:
            mid = chr(i + ord('A'))
        half += chr(i + ord('A')) * (count[i] // 2)
    print(half + mid + half[::-1])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string name;
    cin >> name;

    int cnt[26] = {};
    for (char c : name) cnt[c - 'A']++;

    int odd = 0;
    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;
    if (odd > 1) { puts("I'm Sorry Hansoo"); return 0; }

    string half = "", mid = "";
    for (int i = 0; i < 26; i++) {
        if (cnt[i] % 2) mid = string(1, 'A' + i);
        half += string(cnt[i] / 2, 'A' + i);
    }
    string rev = half;
    reverse(rev.begin(), rev.end());
    cout << half + mid + rev << endl;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String name = br.readLine().trim();

        int[] cnt = new int[26];
        for (char c : name.toCharArray()) cnt[c - 'A']++;

        int odd = 0;
        for (int c : cnt) if (c % 2 != 0) odd++;
        if (odd > 1) { System.out.println("I'm Sorry Hansoo"); return; }

        StringBuilder half = new StringBuilder();
        String mid = "";
        for (int i = 0; i < 26; i++) {
            if (cnt[i] % 2 == 1) mid = String.valueOf((char)('A' + i));
            for (int j = 0; j < cnt[i] / 2; j++) half.append((char)('A' + i));
        }
        System.out.println(half.toString() + mid + half.reverse().toString());
    }
}`
            },
            solutions: [
                {
                    approach: '배열 카운팅',
                    description: '크기 26 배열로 빈도를 세고, 홀수 개인 문자가 2개 이상이면 불가능',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `import sys
input = sys.stdin.readline

name = input().strip()
cnt = [0] * 26
for c in name:
    cnt[ord(c) - ord('A')] += 1

odd_count = sum(1 for x in cnt if x % 2 != 0)
if odd_count > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for i in range(26):
        if cnt[i] % 2 == 1:
            mid = chr(i + ord('A'))
        half += chr(i + ord('A')) * (cnt[i] // 2)
    print(half + mid + half[::-1])`,
                        cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    int cnt[26] = {};
    for (char c : s) cnt[c - 'A']++;

    int odd = 0;
    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;
    if (odd > 1) { cout << "I'm Sorry Hansoo" << endl; return 0; }

    string half = "", mid = "";
    for (int i = 0; i < 26; i++) {
        if (cnt[i] % 2) mid = string(1, 'A' + i);
        half += string(cnt[i] / 2, 'A' + i);
    }
    string rev = half;
    reverse(rev.begin(), rev.end());
    cout << half + mid + rev << endl;
}`,
                        java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String name = br.readLine().trim();
        int[] cnt = new int[26];
        for (char c : name.toCharArray()) cnt[c - 'A']++;

        int odd = 0;
        for (int c : cnt) if (c % 2 != 0) odd++;
        if (odd > 1) { System.out.println("I'm Sorry Hansoo"); return; }

        StringBuilder half = new StringBuilder();
        String mid = "";
        for (int i = 0; i < 26; i++) {
            if (cnt[i] % 2 == 1) mid = String.valueOf((char)('A' + i));
            for (int j = 0; j < cnt[i] / 2; j++) half.append((char)('A' + i));
        }
        System.out.println(half.toString() + mid + half.reverse().toString());
    }
}`
                    }
                },
                {
                    approach: 'Counter 활용',
                    description: 'collections.Counter로 빈도를 세고 Pythonic하게 팰린드롬 구성',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    templates: {
                        python: `from collections import Counter

name = input().strip()
counter = Counter(name)

odd_chars = [c for c, v in counter.items() if v % 2 != 0]
if len(odd_chars) > 1:
    print("I'm Sorry Hansoo")
else:
    half = ''
    mid = ''
    for c in sorted(counter):
        if counter[c] % 2 == 1:
            mid = c
        half += c * (counter[c] // 2)
    print(half + mid + half[::-1])`
                    }
                }
            ]
        }
    ]
};

// ===== 코드 단계별 공개 데이터 =====
const _counterExplainHTML = '<h4>Counter란?</h4>' +
    '<p>Python의 <code>collections</code> 모듈에 있는 <code>Counter</code> 클래스는 ' +
    '요소의 개수를 세어주는 딕셔너리의 하위 클래스입니다.</p>' +
    '<p style="margin:0.6rem 0;"><code>from collections import Counter</code></p>' +
    '<p style="margin:0.4rem 0;"><code>Counter("hello")</code> → <code>{\'l\': 2, \'h\': 1, \'e\': 1, \'o\': 1}</code></p>' +
    '<p style="margin-top:0.8rem;"><strong>주요 기능:</strong></p>' +
    '<ul>' +
    '<li><code>most_common(n)</code> — 빈도 높은 순서로 n개 반환</li>' +
    '<li><code>counter[key]</code> — 해당 키의 개수 (없으면 0)</li>' +
    '<li><code>counter.items()</code> — (요소, 개수) 쌍 순회</li>' +
    '</ul>';

(function assignCodeSteps() {
    const p = stringTopic.problems;

    // ── boj-1157 배열 카운팅 ──
    p[0].solutions[0].codeSteps = {
        python: [
            { title: '입력 받기', desc: '문자열을 입력받고 대문자로 변환', code: 'word = input().upper()' },
            { title: '빈도 배열 카운팅', desc: '크기 26 배열에 각 알파벳 등장 횟수 기록', code: 'cnt = [0] * 26\nfor c in word:\n    cnt[ord(c) - ord(\'A\')] += 1' },
            { title: '최댓값 찾기', desc: '배열에서 가장 큰 값을 찾는다', code: 'mx = max(cnt)' },
            { title: '중복 체크 + 출력', desc: '최댓값이 여러 개면 ?, 아니면 해당 문자 출력', code: 'if cnt.count(mx) > 1:\n    print(\'?\')\nelse:\n    print(chr(cnt.index(mx) + ord(\'A\')))' }
        ],
        cpp: [
            { title: '입력 받기', desc: '문자열을 입력받는다', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: '빈도 배열 카운팅', desc: '크기 26 배열에 대문자 변환 후 카운팅', code: '    int cnt[26] = {};\n    for (char c : s) cnt[toupper(c) - \'A\']++;' },
            { title: '최댓값 + 중복 체크', desc: '최댓값과 중복 여부를 동시에 추적', code: '    int mx = 0, idx = 0, dup = 0;\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }\n        else if (cnt[i] == mx && mx > 0) dup++;\n    }' },
            { title: '출력', desc: '중복이면 ?, 아니면 해당 문자 출력', code: '    cout << (dup > 1 ? "?" : string(1, \'A\' + idx)) << endl;\n}' }
        ],
        java: [
            { title: '입력 받기', desc: '문자열을 입력받고 대문자로 변환', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String word = br.readLine().toUpperCase();' },
            { title: '빈도 배열 카운팅', desc: '크기 26 배열에 각 알파벳 등장 횟수 기록', code: '        int[] cnt = new int[26];\n        for (char c : word.toCharArray()) cnt[c - \'A\']++;' },
            { title: '최댓값 + 중복 체크', desc: '최댓값과 중복 여부를 동시에 추적', code: '        int mx = 0, idx = 0, dup = 0;\n        for (int i = 0; i < 26; i++) {\n            if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }\n            else if (cnt[i] == mx && mx > 0) dup++;\n        }' },
            { title: '출력', desc: '중복이면 ?, 아니면 해당 문자 출력', code: '        System.out.println(dup > 1 ? "?" : (char)(\'A\' + idx));\n    }\n}' }
        ]
    };

    // ── boj-1157 딕셔너리 ──
    p[0].solutions[1].codeSteps = {
        python: [
            { title: '입력 받기', desc: '문자열을 입력받고 대문자로 변환', code: 'word = input().upper()' },
            { title: '딕셔너리 카운팅', desc: 'dict.get()으로 문자별 빈도 카운팅', code: 'freq = {}\nfor c in word:\n    freq[c] = freq.get(c, 0) + 1' },
            { title: '최댓값 찾기', desc: '딕셔너리 값 중 최대를 찾는다', code: 'mx = max(freq.values())' },
            { title: '후보 체크 + 출력', desc: '최댓값 문자가 여러 개면 ?, 아니면 출력', code: 'candidates = [k for k, v in freq.items() if v == mx]\nprint(\'?\' if len(candidates) > 1 else candidates[0])' }
        ],
        cpp: [
            { title: '입력 + 해시맵 준비', desc: 'unordered_map으로 빈도 저장 준비', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: '빈도 카운팅', desc: '해시맵에 대문자 변환 후 빈도 기록', code: '    unordered_map<char, int> freq;\n    for (char c : s) freq[toupper(c)]++;' },
            { title: '최댓값 찾기', desc: '모든 빈도 중 최대값 탐색', code: '    int mx = 0;\n    for (auto& [ch, cnt] : freq) mx = max(mx, cnt);' },
            { title: '후보 체크 + 출력', desc: '최댓값 문자가 여러 개면 ?, 아니면 출력', code: '    int dup = 0;\n    char ans = \'?\';\n    for (auto& [ch, cnt] : freq) {\n        if (cnt == mx) { ans = ch; dup++; }\n    }\n    cout << (dup > 1 ? \'?\' : ans) << endl;\n}' }
        ],
        java: [
            { title: '입력 + 해시맵 준비', desc: 'HashMap으로 빈도 저장 준비', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String word = br.readLine().toUpperCase();' },
            { title: '빈도 카운팅', desc: 'HashMap에 문자별 빈도 기록', code: '        Map<Character, Integer> freq = new HashMap<>();\n        for (char c : word.toCharArray()) {\n            freq.put(c, freq.getOrDefault(c, 0) + 1);\n        }' },
            { title: '최댓값 찾기', desc: '모든 빈도 중 최대값 탐색', code: '        int mx = Collections.max(freq.values());' },
            { title: '후보 체크 + 출력', desc: '최댓값 문자가 여러 개면 ?, 아니면 출력', code: '        int dup = 0;\n        char ans = \'?\';\n        for (var e : freq.entrySet()) {\n            if (e.getValue() == mx) { ans = e.getKey(); dup++; }\n        }\n        System.out.println(dup > 1 ? "?" : ans);\n    }\n}' }
        ]
    };

    // ── boj-1157 Counter ──
    p[0].solutions[2].codeSteps = {
        python: [
            { title: 'Counter란?', desc: 'Python collections 모듈의 Counter 클래스 소개', explanation: _counterExplainHTML, code: null },
            { title: 'Counter로 빈도 세기', desc: 'Counter 객체를 만들고 most_common()으로 정렬', code: 'from collections import Counter\n\nword = input().upper()\ncounter = Counter(word)\ntop = counter.most_common()' },
            { title: '결과 출력', desc: '1위가 동률이면 ?, 아니면 1위 문자 출력', code: 'if len(top) > 1 and top[0][1] == top[1][1]:\n    print(\'?\')\nelse:\n    print(top[0][0])' }
        ]
    };

    // ── lc-125 뒤집어서 비교 ──
    p[1].solutions[0].codeSteps = {
        python: [
            { title: '함수 정의', desc: 'Solution 클래스와 메서드 선언', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:' },
            { title: '영숫자 정제', desc: 'isalnum()으로 영문자/숫자만 남기고 소문자로 변환', code: '        cleaned = \'\'\n        for c in s:\n            if c.isalnum():\n                cleaned += c.lower()' },
            { title: '뒤집어서 비교', desc: '정제된 문자열을 뒤집어 원본과 비교', code: '        return cleaned == cleaned[::-1]' }
        ],
        cpp: [
            { title: '함수 정의', desc: 'Solution 클래스와 메서드 선언', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {' },
            { title: '영숫자 정제', desc: 'isalnum()으로 걸러내고 tolower()로 변환', code: '        string cleaned;\n        for (char c : s) {\n            if (isalnum(c)) cleaned += tolower(c);\n        }' },
            { title: '뒤집어서 비교', desc: 'reverse() 후 원본과 비교', code: '        string rev = cleaned;\n        reverse(rev.begin(), rev.end());\n        return cleaned == rev;\n    }\n};' }
        ],
        java: [
            { title: '함수 정의', desc: 'Solution 클래스와 메서드 선언', code: 'class Solution {\n    public boolean isPalindrome(String s) {' },
            { title: '영숫자 정제', desc: 'isLetterOrDigit()으로 걸러내고 소문자로 변환', code: '        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) {\n                sb.append(Character.toLowerCase(c));\n            }\n        }' },
            { title: '뒤집어서 비교', desc: 'reverse() 후 원본과 비교', code: '        String cleaned = sb.toString();\n        return cleaned.equals(sb.reverse().toString());\n    }\n}' }
        ]
    };

    // ── lc-125 투 포인터 ──
    p[1].solutions[1].codeSteps = {
        python: [
            { title: '포인터 초기화', desc: '양쪽 끝에서 시작하는 두 포인터 설정', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        left, right = 0, len(s) - 1' },
            { title: '양쪽에서 비교', desc: '영숫자가 아닌 문자는 건너뛰고, 양쪽 문자를 비교', code: '        while left < right:\n            while left < right and not s[left].isalnum():\n                left += 1\n            while left < right and not s[right].isalnum():\n                right -= 1\n            if s[left].lower() != s[right].lower():\n                return False\n            left += 1\n            right -= 1' },
            { title: '결과 반환', desc: '끝까지 다르지 않았으면 팰린드롬', code: '        return True' }
        ],
        cpp: [
            { title: '포인터 초기화', desc: '양쪽 끝에서 시작하는 두 포인터 설정', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.size() - 1;' },
            { title: '양쪽에서 비교', desc: '영숫자가 아니면 건너뛰고 비교', code: '        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }' },
            { title: '결과 반환', desc: '끝까지 통과하면 팰린드롬', code: '        return true;\n    }\n};' }
        ],
        java: [
            { title: '포인터 초기화', desc: '양쪽 끝에서 시작하는 두 포인터 설정', code: 'class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;' },
            { title: '양쪽에서 비교', desc: '영숫자가 아니면 건너뛰고 비교', code: '        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) !=\n                Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }' },
            { title: '결과 반환', desc: '끝까지 통과하면 팰린드롬', code: '        return true;\n    }\n}' }
        ]
    };

    // ── lc-49 정렬 키 ──
    p[2].solutions[0].codeSteps = {
        python: [
            { title: '해시맵 준비', desc: '결과를 담을 딕셔너리 생성', code: 'class Solution:\n    def groupAnagrams(self, strs):\n        groups = {}' },
            { title: '정렬 키로 그룹화', desc: '각 단어를 정렬한 결과를 키로 사용하여 그룹핑', code: '        for s in strs:\n            key = \'\'.join(sorted(s))\n            if key not in groups:\n                groups[key] = []\n            groups[key].append(s)' },
            { title: '결과 반환', desc: '딕셔너리의 값(그룹 리스트)들을 반환', code: '        return list(groups.values())' }
        ],
        cpp: [
            { title: '해시맵 준비', desc: 'unordered_map으로 그룹 저장 준비', code: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp;' },
            { title: '정렬 키로 그룹화', desc: '각 단어를 정렬하여 키로 사용', code: '        for (auto& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end());\n            mp[key].push_back(s);\n        }' },
            { title: '결과 반환', desc: '맵의 값들을 벡터로 변환하여 반환', code: '        vector<vector<string>> res;\n        for (auto& [k, v] : mp) res.push_back(v);\n        return res;\n    }\n};' }
        ],
        java: [
            { title: '해시맵 준비', desc: 'HashMap으로 그룹 저장 준비', code: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();' },
            { title: '정렬 키로 그룹화', desc: '각 단어를 정렬하여 키로 사용', code: '        for (String s : strs) {\n            char[] arr = s.toCharArray();\n            Arrays.sort(arr);\n            String key = new String(arr);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }' },
            { title: '결과 반환', desc: '맵의 값들을 리스트로 반환', code: '        return new ArrayList<>(map.values());\n    }\n}' }
        ]
    };

    // ── lc-49 빈도수 튜플 키 ──
    p[2].solutions[1].codeSteps = {
        python: [
            { title: '해시맵 준비', desc: 'defaultdict로 그룹 저장 준비', code: 'from collections import defaultdict\n\nclass Solution:\n    def groupAnagrams(self, strs):\n        groups = defaultdict(list)' },
            { title: '빈도수 키로 그룹화', desc: '각 문자의 출현 횟수를 튜플로 만들어 키로 사용', code: '        for s in strs:\n            count = [0] * 26\n            for c in s:\n                count[ord(c) - ord(\'a\')] += 1\n            groups[tuple(count)].append(s)' },
            { title: '결과 반환', desc: '딕셔너리의 값들을 리스트로 반환', code: '        return list(groups.values())' }
        ],
        cpp: [
            { title: '해시맵 준비', desc: 'unordered_map으로 그룹 저장 준비', code: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp;' },
            { title: '빈도수 키로 그룹화', desc: '각 문자의 빈도를 문자열 키로 변환하여 그룹핑', code: '        for (auto& s : strs) {\n            int cnt[26] = {};\n            for (char c : s) cnt[c - \'a\']++;\n            string key;\n            for (int i = 0; i < 26; i++)\n                key += to_string(cnt[i]) + \'#\';\n            mp[key].push_back(s);\n        }' },
            { title: '결과 반환', desc: '맵의 값들을 벡터로 변환하여 반환', code: '        vector<vector<string>> res;\n        for (auto& [k, v] : mp) res.push_back(v);\n        return res;\n    }\n};' }
        ],
        java: [
            { title: '해시맵 준비', desc: 'HashMap으로 그룹 저장 준비', code: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();' },
            { title: '빈도수 키로 그룹화', desc: '각 문자의 빈도를 배열 → 문자열 키로 변환', code: '        for (String s : strs) {\n            int[] cnt = new int[26];\n            for (char c : s.toCharArray()) cnt[c - \'a\']++;\n            String key = Arrays.toString(cnt);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }' },
            { title: '결과 반환', desc: '맵의 값들을 리스트로 반환', code: '        return new ArrayList<>(map.values());\n    }\n}' }
        ]
    };

    // ── boj-1213 배열 카운팅 ──
    p[3].solutions[0].codeSteps = {
        python: [
            { title: '입력 + 빈도 세기', desc: '문자열 입력 후 크기 26 배열로 빈도 카운팅', code: 'import sys\ninput = sys.stdin.readline\n\nname = input().strip()\ncnt = [0] * 26\nfor c in name:\n    cnt[ord(c) - ord(\'A\')] += 1' },
            { title: '홀수 개수 체크', desc: '홀수 번 등장하는 문자가 2개 이상이면 불가능', code: 'odd_count = sum(1 for x in cnt if x % 2 != 0)\nif odd_count > 1:\n    print("I\'m Sorry Hansoo")' },
            { title: '팰린드롬 절반 구성', desc: '각 문자를 절반씩 배치, 홀수인 문자는 가운데로', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for i in range(26):\n        if cnt[i] % 2 == 1:\n            mid = chr(i + ord(\'A\'))\n        half += chr(i + ord(\'A\')) * (cnt[i] // 2)' },
            { title: '조립 + 출력', desc: '앞절반 + 가운데 + 뒤집은 절반 = 팰린드롬', code: '    print(half + mid + half[::-1])' }
        ],
        cpp: [
            { title: '입력 + 빈도 세기', desc: '문자열 입력 후 배열로 빈도 카운팅', code: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int cnt[26] = {};\n    for (char c : s) cnt[c - \'A\']++;' },
            { title: '홀수 개수 체크', desc: '홀수 빈도 문자가 2개 이상이면 불가능', code: '    int odd = 0;\n    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;\n    if (odd > 1) { cout << "I\'m Sorry Hansoo" << endl; return 0; }' },
            { title: '팰린드롬 절반 구성', desc: '각 문자를 절반씩 배치', code: '    string half = "", mid = "";\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] % 2) mid = string(1, \'A\' + i);\n        half += string(cnt[i] / 2, \'A\' + i);\n    }' },
            { title: '조립 + 출력', desc: '앞절반 + 가운데 + 뒤집은 절반 출력', code: '    string rev = half;\n    reverse(rev.begin(), rev.end());\n    cout << half + mid + rev << endl;\n}' }
        ],
        java: [
            { title: '입력 + 빈도 세기', desc: '문자열 입력 후 배열로 빈도 카운팅', code: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String name = br.readLine().trim();\n        int[] cnt = new int[26];\n        for (char c : name.toCharArray()) cnt[c - \'A\']++;' },
            { title: '홀수 개수 체크', desc: '홀수 빈도 문자가 2개 이상이면 불가능', code: '        int odd = 0;\n        for (int c : cnt) if (c % 2 != 0) odd++;\n        if (odd > 1) { System.out.println("I\'m Sorry Hansoo"); return; }' },
            { title: '팰린드롬 절반 구성', desc: '각 문자를 절반씩 배치', code: '        StringBuilder half = new StringBuilder();\n        String mid = "";\n        for (int i = 0; i < 26; i++) {\n            if (cnt[i] % 2 == 1) mid = String.valueOf((char)(\'A\' + i));\n            for (int j = 0; j < cnt[i] / 2; j++) half.append((char)(\'A\' + i));\n        }' },
            { title: '조립 + 출력', desc: '앞절반 + 가운데 + 뒤집은 절반 출력', code: '        System.out.println(half.toString() + mid + half.reverse().toString());\n    }\n}' }
        ]
    };

    // ── boj-1213 Counter 활용 ──
    p[3].solutions[1].codeSteps = {
        python: [
            { title: 'Counter란?', desc: 'Python collections 모듈의 Counter 클래스 소개', explanation: _counterExplainHTML, code: null },
            { title: 'Counter로 빈도 세기', desc: 'Counter 객체로 각 문자의 빈도를 한 줄에 파악', code: 'from collections import Counter\n\nname = input().strip()\ncounter = Counter(name)' },
            { title: '홀수 체크', desc: '홀수 빈도 문자가 2개 이상이면 팰린드롬 불가', code: 'odd_chars = [c for c, v in counter.items() if v % 2 != 0]\nif len(odd_chars) > 1:\n    print("I\'m Sorry Hansoo")' },
            { title: '조립 + 출력', desc: '사전순 정렬 후 절반 구성 → 팰린드롬 완성', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for c in sorted(counter):\n        if counter[c] % 2 == 1:\n            mid = c\n        half += c * (counter[c] // 2)\n    print(half + mid + half[::-1])' }
        ]
    };
})();

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.string = stringTopic;
