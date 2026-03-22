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
    tabBar.style.display = 'none';

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
            desc.innerHTML = '<span>' + sol.description + '</span>';
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
        const langNames = { python: 'Python', cpp: 'C++' };

        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap;';
        controls.innerHTML =
            '<select class="lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;">' +
            langs.map(l => '<option value="' + l + '">' + (langNames[l] || l) + '</option>').join('') +
            '</select>';
        panel.appendChild(controls);
        const select = controls.querySelector('.lang-select');

        // 전역 언어 설정에 맞춰 초기값
        var initLang = (langs.indexOf(window._algoLang) !== -1) ? window._algoLang : langs[0];
        if (select.value !== initLang) select.value = initLang;

        // === Progressive code step mode ===
        if (sol.codeSteps) {
            let currentLang = (langs.indexOf(window._algoLang) !== -1) ? window._algoLang : langs[0];
            let currentStep = -1;
            let isFullView = false;

            // 위쪽 스텝 컨트롤 — controls 바 안에 오른쪽 정렬
            const stepCtrlTop = document.createElement('div');
            stepCtrlTop.style.cssText = 'display:flex;gap:6px;align-items:center;margin-left:auto;';
            stepCtrlTop.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">← 이전</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">시작 전</span>' +
                '<button class="btn btn-primary code-step-btn cs-next pulse-hint" style="font-size:0.8rem;padding:4px 10px;">다음 →</button>';
            controls.appendChild(stepCtrlTop);
            const topPrev = stepCtrlTop.querySelector('.cs-prev');
            const topNext = stepCtrlTop.querySelector('.cs-next');
            const topCounter = stepCtrlTop.querySelector('.code-step-counter');

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
            codeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">solution.' + (currentLang === 'python' ? 'py' : 'cpp') + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            codeBlock.style.display = 'none';
            panel.appendChild(codeBlock);
            const codeEl = codeBlock.querySelector('code');
            const codeTitle = codeBlock.querySelector('.code-block-title');

            // 아래쪽 스텝 컨트롤 — 오른쪽 정렬 sticky
            const stepCtrlBot = document.createElement('div');
            stepCtrlBot.style.cssText = 'display:flex;gap:6px;align-items:center;justify-content:flex-end;position:sticky;bottom:12px;z-index:100;margin-top:12px;padding:8px 0;';
            stepCtrlBot.innerHTML =
                '<button class="btn code-step-btn cs-prev" disabled style="font-size:0.8rem;padding:4px 10px;">← 이전</button>' +
                '<span class="code-step-counter" style="font-size:0.82rem;font-weight:600;color:var(--accent);min-width:50px;text-align:center;">시작 전</span>' +
                '<button class="btn btn-primary code-step-btn cs-next" style="font-size:0.8rem;padding:4px 10px;">다음 →</button>';
            panel.appendChild(stepCtrlBot);
            const botPrev = stepCtrlBot.querySelector('.cs-prev');
            const botNext = stepCtrlBot.querySelector('.cs-next');
            const botCounter = stepCtrlBot.querySelector('.code-step-counter');

            // aliases for renderStep compatibility
            const prevBtn = topPrev;
            const nextBtn = topNext;
            const counter = topCounter;

            const fullViewBtn = document.createElement('button');
            fullViewBtn.className = 'code-fullview-btn';
            fullViewBtn.textContent = '전체 코드 보기';
            panel.appendChild(fullViewBtn);

            function getSteps() {
                return (sol.codeSteps[currentLang]) || [];
            }

            function syncControls() {
                const steps = getSteps();
                [[topPrev, topNext, topCounter], [botPrev, botNext, botCounter]].forEach(function(trio) {
                    trio[0].disabled = currentStep < 0;
                    trio[1].disabled = currentStep >= steps.length - 1;
                    if (currentStep < 0) {
                        trio[2].textContent = '시작 전';
                    } else {
                        trio[2].textContent = 'Step ' + (currentStep + 1) + ' / ' + steps.length;
                    }
                });
            }

            function renderStep() {
                const steps = getSteps();
                syncControls();

                if (currentStep < 0) {
                    stepDesc.textContent = '▶ 다음 버튼을 눌러 코드를 단계별로 확인하세요';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'none';
                    return;
                }

                const step = steps[currentStep];
                stepDesc.innerHTML = '<span class="step-desc-title">' + step.title + '</span><span class="step-desc-body">' + step.desc.replace(/\n/g, '<br>') + '</span>';

                // Explanation card
                if (step.explanation) {
                    explainerArea.innerHTML = step.explanation;
                    explainerArea.style.display = 'block';
                } else {
                    explainerArea.style.display = 'none';
                }

                // Accumulate code — detect if steps use full-code or fragment style
                const codeStepsWithCode = steps.slice(0, currentStep + 1).filter(s => s.code);
                let accumulated = '';
                if (codeStepsWithCode.length >= 2 && codeStepsWithCode[1].code.includes(codeStepsWithCode[0].code)) {
                    // Full-code style: each step has complete code, just use the last one
                    accumulated = codeStepsWithCode[codeStepsWithCode.length - 1].code;
                } else {
                    // Fragment style: join all fragments
                    accumulated = codeStepsWithCode.map(s => s.code).join('\n\n');
                }

                if (accumulated) {
                    codeBlock.style.display = 'block';
                    codeEl.textContent = accumulated;
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);

                    // Calculate new lines
                    if (step.code) {
                        const isFullStyle = codeStepsWithCode.length >= 2 && codeStepsWithCode[1].code.includes(codeStepsWithCode[0].code);
                        let prevCount = 0;
                        if (isFullStyle) {
                            // Full-code: compare with previous step's full code
                            const prevSteps = steps.slice(0, currentStep).filter(s => s.code);
                            prevCount = prevSteps.length > 0 ? prevSteps[prevSteps.length - 1].code.split('\n').length : 0;
                        } else {
                            const prevFrags = steps.slice(0, currentStep).filter(s => s.code).map(s => s.code);
                            const prevAcc = prevFrags.join('\n\n');
                            prevCount = prevAcc ? prevAcc.split('\n').length : 0;
                        }
                        const totalCount = accumulated.split('\n').length;
                        const startNew = prevCount > 0 ? prevCount + 1 : 1;
                        const newLines = [];
                        for (let ln = startNew; ln <= totalCount; ln++) newLines.push(ln);
                        highlightNewLines(codeEl, newLines);
                    }
                } else {
                    codeBlock.style.display = 'none';
                }
            }

            function doNext() {
                const steps = getSteps();
                if (currentStep >= steps.length - 1) return;
                topNext.classList.remove('pulse-hint');
                botNext.classList.remove('pulse-hint');
                currentStep++;
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = '전체 코드 보기';
                    stepCtrlTop.style.display = 'flex';
                    stepCtrlBot.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                }
                renderStep();
                setTimeout(() => {
                    if (codeBlock.style.display === 'none') return;
                    var cb = codeBlock.getBoundingClientRect();
                    if (cb.bottom > window.innerHeight * 0.6) {
                        window.scrollBy({ top: cb.bottom - window.innerHeight * 0.6, behavior: 'smooth' });
                    }
                }, 50);
            }
            function doPrev() {
                if (currentStep < 0) return;
                currentStep--;
                renderStep();
            }
            topNext.addEventListener('click', doNext);
            botNext.addEventListener('click', doNext);
            topPrev.addEventListener('click', doPrev);
            botPrev.addEventListener('click', doPrev);

            fullViewBtn.addEventListener('click', () => {
                if (isFullView) {
                    isFullView = false;
                    fullViewBtn.textContent = '전체 코드 보기';
                    stepCtrlTop.style.display = 'flex'; stepCtrlBot.style.display = 'flex';
                    stepDesc.style.display = 'flex';
                    renderStep();
                } else {
                    isFullView = true;
                    fullViewBtn.textContent = '단계별 보기';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '';
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);
                    stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                    stepDesc.style.display = 'none';
                }
            });

            select.addEventListener('change', () => {
                currentLang = select.value;
                if (window._setAlgoLang) window._setAlgoLang(currentLang);
                currentStep = -1;
                isFullView = false;
                fullViewBtn.textContent = '전체 코드 보기';
                stepCtrlTop.style.display = 'flex'; stepCtrlBot.style.display = 'flex';
                stepDesc.style.display = 'flex';
                nextBtn.classList.add('pulse-hint');
                var extMap = { python: 'py', cpp: 'cpp' };
                if (codeTitle) codeTitle.textContent = 'solution.' + (extMap[currentLang] || currentLang);

                if (!sol.codeSteps[currentLang]) {
                    stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                    stepDesc.style.display = 'none';
                    explainerArea.style.display = 'none';
                    codeBlock.style.display = 'block';
                    codeEl.textContent = sol.templates[currentLang] || '// 이 언어의 풀이가 없습니다.';
                    codeEl.className = 'language-' + langClass(currentLang);
                    codeEl.removeAttribute('data-highlighted');
                    if (window.hljs) hljs.highlightElement(codeEl);
                    fullViewBtn.style.display = 'none';
                } else {
                    fullViewBtn.style.display = 'block';
                    renderStep();
                }
            });

            if (!sol.codeSteps[currentLang]) {
                stepCtrlTop.style.display = 'none'; stepCtrlBot.style.display = 'none';
                stepDesc.style.display = 'none';
                codeBlock.style.display = 'block';
                codeEl.textContent = sol.templates[currentLang] || '';
                codeEl.className = 'language-' + langClass(currentLang);
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                fullViewBtn.style.display = 'none';
            } else {
                renderStep();
            }

        } else {
            // === Fallback: full code display ===
            const codeBlock = document.createElement('div');
            codeBlock.className = 'code-block';
            var extMap2 = { python: 'py', cpp: 'cpp' };
            codeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">solution.' + (extMap2[initLang] || initLang) + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            panel.appendChild(codeBlock);

            const codeEl = codeBlock.querySelector('code');
            const codeTitle2 = codeBlock.querySelector('.code-block-title');
            function showCode(lang) {
                codeEl.textContent = sol.templates[lang] || '// 이 언어의 풀이가 없습니다.';
                codeEl.className = 'language-' + langClass(lang);
                codeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(codeEl);
                if (codeTitle2) codeTitle2.textContent = 'solution.' + (extMap2[lang] || lang);
            }
            select.addEventListener('change', () => {
                if (window._setAlgoLang) window._setAlgoLang(select.value);
                showCode(select.value);
            });
            showCode(initLang);
        }
    }

    // 최적 풀이를 메인으로 표시 (마지막 solution)
    var mainIdx = prob.solutions.length - 1;
    showApproach(mainIdx);

    // 나머지(브루트포스 등)를 접힌 참고 섹션으로 추가
    for (var ri = 0; ri < mainIdx; ri++) {
        (function(refSol) {
            var details = document.createElement('details');
            details.className = 'brute-ref';

            var summary = document.createElement('summary');
            summary.className = 'brute-ref-summary';
            summary.innerHTML =
                '<span class="brute-ref-icon">📝</span>' +
                '<span class="brute-ref-label">' + refSol.approach + ' 코드 참고</span>' +
                '<span class="brute-ref-badge">' + refSol.timeComplexity + '</span>';
            details.appendChild(summary);

            var refContent = document.createElement('div');
            refContent.className = 'brute-ref-content';

            if (refSol.description) {
                var desc = document.createElement('p');
                desc.className = 'brute-ref-desc';
                desc.innerHTML = '<span>' + refSol.description + '</span>';
                refContent.appendChild(desc);
            }

            var refMeta = document.createElement('div');
            refMeta.className = 'approach-meta';
            refMeta.innerHTML =
                '<span class="approach-meta-badge time">⏱ ' + refSol.timeComplexity + '</span>' +
                '<span class="approach-meta-badge space">💾 ' + refSol.spaceComplexity + '</span>';
            refContent.appendChild(refMeta);

            // 언어 셀렉터
            var refLangs = Object.keys(refSol.templates);
            var langNamesRef = { python: 'Python', cpp: 'C++' };
            var refSelect = document.createElement('select');
            refSelect.className = 'lang-select';
            refSelect.style.cssText = 'padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--bg2);color:var(--text);font-family:inherit;margin-bottom:8px;';
            refLangs.forEach(function(l) {
                var opt = document.createElement('option');
                opt.value = l;
                opt.textContent = langNamesRef[l] || l;
                refSelect.appendChild(opt);
            });
            // 전역 언어 설정에 맞춰 초기값
            var refInitLang = (refLangs.indexOf(window._algoLang) !== -1) ? window._algoLang : refLangs[0];
            if (refSelect.value !== refInitLang) refSelect.value = refInitLang;
            refContent.appendChild(refSelect);

            // 코드 블록
            var refCodeBlock = document.createElement('div');
            refCodeBlock.className = 'code-block';
            var extMap = { python: 'py', cpp: 'cpp' };
            refCodeBlock.innerHTML =
                '<div class="code-block-header">' +
                    '<div class="code-block-dots"><span></span><span></span><span></span></div>' +
                    '<span class="code-block-title">brute.' + (extMap[refInitLang] || refInitLang) + '</span>' +
                '</div>' +
                '<pre><code></code></pre>';
            refContent.appendChild(refCodeBlock);

            var refCodeEl = refCodeBlock.querySelector('code');
            var refCodeTitle = refCodeBlock.querySelector('.code-block-title');

            function showRefCode(lang) {
                refCodeEl.textContent = refSol.templates[lang] || '';
                refCodeEl.className = 'language-' + langClass(lang);
                refCodeEl.removeAttribute('data-highlighted');
                if (window.hljs) hljs.highlightElement(refCodeEl);
                if (refCodeTitle) refCodeTitle.textContent = 'brute.' + (extMap[lang] || lang);
            }

            refSelect.addEventListener('change', function() {
                if (window._setAlgoLang) window._setAlgoLang(refSelect.value);
                showRefCode(refSelect.value);
            });

            // 열릴 때 코드 하이라이팅 (lazy)
            var refInited = false;
            details.addEventListener('toggle', function() {
                if (details.open && !refInited) {
                    refInited = true;
                    showRefCode(refInitLang);
                }
            });

            details.appendChild(refContent);
            wrapper.appendChild(details);
        })(prob.solutions[ri]);
    }

    el.appendChild(wrapper);
};

const stringTopic = {
    id: 'string',
    title: '문자열 조작',
    icon: '🔤',
    category: '기초 (Bronze~Silver)',
    order: 1,
    description: '빈도수 분석, 팰린드롬, 애너그램 등 문자열 핵심 유형과 풀이법',

    // 사이드바 확장형
    sidebarExpandable: true,

    // 단일 통합 탭 (토픽 개요용)
    tabs: [{ id: 'concept', label: '학습하기' }],

    // 문제-유형 매핑 (top-level)
    problemMeta: {
        'boj-10809': { type: '알파벳 찾기', color: '#00b894', vizMethod: '_renderVizAlphaFind' },
        'boj-1157':  { type: '빈도수 분석', color: 'var(--accent)', vizMethod: '_renderVizFrequency' },
        'lc-125':    { type: '팰린드롬 판별', color: 'var(--green)', vizMethod: '_renderVizPalindrome' },
        'lc-49':     { type: '애너그램 그룹화', color: '#e17055', vizMethod: '_renderVizAnagram' },
        'boj-1213':  { type: '문자열 재구성', color: '#6c5ce7', vizMethod: '_renderVizReconstruct' }
    },

    // 학습 스테이지 (순차 로드맵용)
    stages: [
        { num: 1, title: '알파벳 찾기', desc: '문자열 순회 입문', problemIds: ['boj-10809'] },
        { num: 2, title: '빈도수 분석', desc: '문자 등장 횟수 세기', problemIds: ['boj-1157'] },
        { num: 3, title: '팰린드롬 판별', desc: '투 포인터 기본 패턴', problemIds: ['lc-125'] },
        { num: 4, title: '애너그램 그룹화', desc: '정렬 키 + 해시맵', problemIds: ['lc-49'] },
        { num: 5, title: '문자열 재구성', desc: '빈도수 활용한 재배열', problemIds: ['boj-1213'] },
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

        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
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

        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };

        // --- 히어로 + 개념 데모 + 문제 리스트 컨테이너 ---
        container.innerHTML = `
            <div class="hero">
                <h2>🔤 문자열 조작</h2>
                <p class="hero-sub">문제를 선택하고, 생각해보고, 시뮬레이션으로 이해한 뒤, 코드를 확인해봅시다!</p>
            </div>

            <!-- 섹션 1: 문자열 = 문자 배열 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 문자열은 문자의 배열</div>
                <div class="analogy-box">
                    문자열은 글자가 한 줄로 쭉 늘어선 거예요. 마치 사물함처럼 각 칸에 글자가 하나씩 들어 있고, 번호가 매겨져 있어요.
                    <code>s[0]</code>하면 첫 번째 칸, <code>s[3]</code>하면 네 번째 칸을 바로 열어볼 수 있죠!
                    <span class="lang-py">중간만 잘라내기(<code>s[1:4]</code>), 거꾸로 뒤집기(<code>s[::-1]</code>)도 가능해요.</span><span class="lang-cpp">중간만 잘라내기(<code>s.substr(1,3)</code>), 거꾸로 뒤집기(<code>string(s.rbegin(), s.rend())</code>)도 가능해요.</span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 인덱스, 슬라이싱, 뒤집기</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="str-concept-idx-btn">인덱스 접근 [2]</button>
                        <button class="concept-demo-btn" id="str-concept-slice-btn">슬라이싱 [1:4]</button>
                        <button class="concept-demo-btn" id="str-concept-reverse-btn">뒤집기 [::-1]</button>
                        <button class="concept-demo-btn green" id="str-concept-reset-btn">↺ 초기화</button>
                    </div>
                    <div class="concept-demo-body" style="justify-content:center;">
                        <div class="str-concept-char-row" id="str-concept-char-row">
                            <div class="str-concept-char-box" data-idx="0"><span class="str-concept-char">H</span><span class="str-concept-idx">0</span></div>
                            <div class="str-concept-char-box" data-idx="1"><span class="str-concept-char">E</span><span class="str-concept-idx">1</span></div>
                            <div class="str-concept-char-box" data-idx="2"><span class="str-concept-char">L</span><span class="str-concept-idx">2</span></div>
                            <div class="str-concept-char-box" data-idx="3"><span class="str-concept-char">L</span><span class="str-concept-idx">3</span></div>
                            <div class="str-concept-char-box" data-idx="4"><span class="str-concept-char">O</span><span class="str-concept-idx">4</span></div>
                        </div>
                    </div>
                    <div class="str-concept-result" id="str-concept-result" style="display:none;"></div>
                    <div class="concept-demo-msg" id="str-concept-demo1-msg">👆 버튼을 눌러 문자열 연산을 직접 확인해보세요!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <h3>s[i] — 인덱스 접근</h3>
                        <p>3번 글자가 궁금하면? <code>s[3]</code>으로 바로 꺼내요! 앞에서부터 세지 않아도 돼요.</p>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s = "HELLO"<br>s[2]  → 'L'</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">string s = "HELLO";<br>s[2]  → 'L'</code></span>
                    </div>
                    <div class="concept-card">
                        <span class="lang-py"><h3>s[a:b] — 슬라이싱</h3></span><span class="lang-cpp"><h3>s.substr(a,len) — 부분 문자열</h3></span>
                        <span class="lang-py"><p>1번부터 3번까지만 쏙 뽑아내고 싶을 때 써요. <code>s[1:4]</code>하면 1, 2, 3번 글자만 나와요!</p></span><span class="lang-cpp"><p>1번부터 3글자만 쏙 뽑아내고 싶을 때 써요. <code>s.substr(1,3)</code>하면 1, 2, 3번 글자만 나와요!</p></span>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s[1:4]  → "ELL"</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">s.substr(1,3)  → "ELL"</code></span>
                    </div>
                    <div class="concept-card">
                        <span class="lang-py"><h3>s[::-1] — 뒤집기</h3></span><span class="lang-cpp"><h3>reverse — 뒤집기</h3></span>
                        <p>거꾸로 뒤집어요! "HELLO"가 "OLLEH"로 바뀌죠. 앞뒤가 같은지 확인할 때 딱이에요.</p>
                        <span class="lang-py"><code style="font-size:0.85rem;color:var(--accent);">s[::-1]  → "OLLEH"</code></span><span class="lang-cpp"><code style="font-size:0.85rem;color:var(--accent);">string(s.rbegin(), s.rend())  → "OLLEH"</code></span>
                    </div>
                </div>
            </div>

            <!-- 섹션 2: ASCII 코드 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> ASCII 코드 — 문자와 숫자의 연결</div>
                <div class="analogy-box">
                    컴퓨터는 글자를 직접 이해하지 못해요. 대신 글자마다 고유한 번호를 붙여서 숫자로 기억해요.
                    예를 들어 'A'는 65번, 'a'는 97번이에요!
                    <span class="lang-py"><code>ord('A')</code>하면 65가 나오고, 반대로 <code>chr(65)</code>하면 'A'가 돌아와요.</span><span class="lang-cpp"><code>(int)'A'</code>하면 65가 나오고, 반대로 <code>(char)65</code>하면 'A'가 돌아와요.</span>
                    <br>
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functions.html#ord" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: ord() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/explicit_cast" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: 타입 캐스팅 ↗</a></span>
                    &nbsp;|&nbsp;
                    <a href="https://www.asciitable.com/" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">ASCII 전체 테이블 보기 ↗</a>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — <span class="lang-py">ord() &amp; chr()</span><span class="lang-cpp">(int) &amp; (char) 캐스팅</span> 변환</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">문자 입력:</label>
                        <input type="text" id="str-concept-ascii-input" maxlength="1" value="A"
                            style="width:50px;text-align:center;padding:8px;font-size:1.2rem;font-weight:700;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <button class="concept-demo-btn" id="str-concept-ascii-convert">변환</button>
                        <button class="concept-demo-btn" id="str-concept-ascii-prev">← 이전 문자</button>
                        <button class="concept-demo-btn" id="str-concept-ascii-next">다음 문자 →</button>
                    </div>
                    <div class="concept-demo-body" style="justify-content:center;">
                        <div class="str-concept-ascii-flow" id="str-concept-ascii-flow">
                            <div class="str-concept-ascii-box str-concept-ascii-char" id="str-concept-ascii-char">'A'</div>
                            <div class="str-concept-ascii-arrow">→ <span class="lang-py"><code>ord()</code></span><span class="lang-cpp"><code>(int)</code></span> →</div>
                            <div class="str-concept-ascii-box str-concept-ascii-num" id="str-concept-ascii-num">65</div>
                            <div class="str-concept-ascii-arrow">→ <span class="lang-py"><code>chr()</code></span><span class="lang-cpp"><code>(char)</code></span> →</div>
                            <div class="str-concept-ascii-box str-concept-ascii-char" id="str-concept-ascii-back">'A'</div>
                        </div>
                    </div>
                    <div class="str-concept-ascii-table-wrap" style="margin-top:1.2rem;">
                        <div style="font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:8px;">📋 주요 ASCII 범위</div>
                        <div class="str-concept-ascii-table">
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">A-Z</span>
                                <span class="str-concept-ascii-range-val">65 ~ 90</span>
                            </div>
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">a-z</span>
                                <span class="str-concept-ascii-range-val">97 ~ 122</span>
                            </div>
                            <div class="str-concept-ascii-range">
                                <span class="str-concept-ascii-range-label">0-9</span>
                                <span class="str-concept-ascii-range-val">48 ~ 57</span>
                            </div>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text2);margin-top:6px;">💡 대문자와 소문자의 차이는 항상 32! (A=65, a=97 → 97-65=32)</div>
                    </div>
                    <div class="concept-demo-msg" id="str-concept-demo2-msg">👆 문자를 입력하고 "변환" 버튼을 눌러 ASCII 코드를 확인해보세요!</div>
                </div>
            </div>

            <!-- 섹션 3: 문자열 비교 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 문자열 비교 — 사전순(Lexicographic) 비교</div>
                <div class="analogy-box">
                    <strong>핵심 개념:</strong> 문자열 비교는 <em>사전에서 단어를 찾는 것</em>과 같습니다.
                    앞 글자부터 하나씩 비교해서, <strong>처음으로 다른 글자</strong>가 나오면 그 글자의 ASCII 값으로 크기를 결정합니다.
                    예를 들어 <code>"abc" < "abd"</code>인 이유는 3번째 글자에서 <code>'c'(99) < 'd'(100)</code>이기 때문이에요.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 문자별 비교 시뮬레이션</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">문자열 1:</label>
                        <input type="text" id="str-concept-cmp-input1" value="abc"
                            style="width:120px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">문자열 2:</label>
                        <input type="text" id="str-concept-cmp-input2" value="abd"
                            style="width:120px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                        <button class="concept-demo-btn" id="str-concept-cmp-btn">비교</button>
                    </div>
                    <div class="concept-demo-body" style="flex-direction:column;align-items:center;gap:16px;">
                        <div class="str-concept-cmp-rows" id="str-concept-cmp-rows">
                            <div class="str-concept-cmp-row">
                                <span class="str-concept-cmp-label">문자열 1</span>
                                <div class="str-concept-cmp-boxes" id="str-concept-cmp-boxes1"></div>
                            </div>
                            <div class="str-concept-cmp-row">
                                <span class="str-concept-cmp-label">문자열 2</span>
                                <div class="str-concept-cmp-boxes" id="str-concept-cmp-boxes2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="str-concept-cmp-result" id="str-concept-cmp-result" style="display:none;"></div>
                    <div class="concept-demo-msg" id="str-concept-demo3-msg">👆 두 문자열을 입력하고 "비교" 버튼을 눌러 한 글자씩 비교 과정을 확인해보세요!</div>
                </div>
            </div>

            <!-- 섹션 4: 자주 쓰는 문자열 메서드 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 자주 쓰는 문자열 메서드</div>
                <div class="analogy-box">
                    <strong>핵심:</strong> 문자열 문제를 풀 때 이 메서드들을 알면 훨씬 빠르게 풀 수 있습니다.
                    외울 필요 없이 <strong>"이런 게 있구나"</strong> 정도만 기억하고, 필요할 때 공식 문서를 찾아보세요!<br>
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#string-methods" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: String Methods ↗</a></span>
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/string/basic_string" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: std::string ↗</a></span>
                </div>
                <span class="lang-py"><div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <h3>변환 & 검사</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.upper() / s.lower()<br>
s.isalpha() / s.isdigit()<br>
s.isalnum()<br>
ord('A') → 65 / chr(65) → 'A'
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">대소문자 변환, 알파벳/숫자 판별</p>
                    </div>
                    <div class="concept-card">
                        <h3>찾기 & 세기</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.find('abc') → 인덱스 (-1 없음)<br>
s.count('a') → 등장 횟수<br>
s.startswith('pre')<br>
s.endswith('.txt')
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">부분 문자열 위치, 빈도, 접두사/접미사</p>
                    </div>
                    <div class="concept-card">
                        <h3>자르기 & 합치기</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.split(',') → ['a','b','c']<br>
','.join(['a','b','c']) → 'a,b,c'<br>
s.strip() / s.lstrip() / s.rstrip()<br>
s.replace('old', 'new')
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">구분자로 분리, 리스트→문자열, 공백 제거</p>
                    </div>
                    <div class="concept-card">
                        <h3>기타 유용한 것들</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
list(s) → ['H','E','L','L','O']<br>
''.join(reversed(s))<br>
s[::-1]  # 뒤집기<br>
sorted(s) → 정렬된 리스트
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">리스트 변환, 뒤집기, 정렬</p>
                    </div>
                </div></span>
                <span class="lang-cpp"><div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <h3>변환 & 검사</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
toupper(c) / tolower(c)<br>
isalpha(c) / isdigit(c)<br>
isalnum(c)<br>
(int)'A' → 65 / (char)65 → 'A'
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">대소문자 변환, 알파벳/숫자 판별 (문자 단위)</p>
                    </div>
                    <div class="concept-card">
                        <h3>찾기 & 세기</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
s.find("abc") → 인덱스 (npos 없음)<br>
count(s.begin(), s.end(), 'a')<br>
s.substr(0, 3) == "pre"<br>
s.compare(other)
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">부분 문자열 위치, 빈도, 비교</p>
                    </div>
                    <div class="concept-card">
                        <h3>자르기 & 합치기</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
getline(cin, s)<br>
s.substr(start, len)<br>
s.erase(pos, len)<br>
s.replace(pos, len, "new")
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">입력, 부분 추출, 삭제, 치환</p>
                    </div>
                    <div class="concept-card">
                        <h3>기타 유용한 것들</h3>
                        <code style="font-size:0.82rem;color:var(--accent);display:block;line-height:1.8;">
to_string(42) → "42"<br>
stoi("42") → 42<br>
reverse(s.begin(), s.end())<br>
sort(s.begin(), s.end())
                        </code>
                        <p style="font-size:0.82rem;color:var(--text2);margin-top:6px;">숫자↔문자열 변환, 뒤집기, 정렬</p>
                    </div>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 메서드 실험실</div>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;flex-wrap:wrap;">
                        <label style="font-size:0.9rem;font-weight:600;color:var(--text);">문자열:</label>
                        <input type="text" id="str-concept-method-input" value="Hello, World! 123"
                            style="width:240px;padding:8px 12px;font-size:1rem;font-weight:600;border:2px solid var(--accent);border-radius:8px;background:var(--bg);color:var(--text);font-family:'Fira Code',monospace;">
                    </div>
                    <div class="concept-demo-btns" id="str-concept-method-btns" style="flex-wrap:wrap;gap:6px;">
                        <button class="concept-demo-btn" data-method="upper">upper()</button>
                        <button class="concept-demo-btn" data-method="lower">lower()</button>
                        <button class="concept-demo-btn" data-method="find">find('o')</button>
                        <button class="concept-demo-btn" data-method="count">count('l')</button>
                        <button class="concept-demo-btn" data-method="replace">replace('l','★')</button>
                        <button class="concept-demo-btn" data-method="split">split(',')</button>
                        <button class="concept-demo-btn" data-method="strip">strip()</button>
                        <button class="concept-demo-btn" data-method="isalpha">isalpha()</button>
                        <button class="concept-demo-btn" data-method="reverse">뒤집기</button>
                        <button class="concept-demo-btn" data-method="sorted">sorted()</button>
                    </div>
                    <div class="concept-demo-body" style="flex-direction:column;gap:12px;margin-top:12px;">
                        <div id="str-concept-method-before" style="display:none;"></div>
                        <div id="str-concept-method-arrow" style="display:none;font-size:1.1rem;text-align:center;color:var(--accent);font-weight:700;"></div>
                        <div id="str-concept-method-after" style="display:none;"></div>
                    </div>
                    <div class="concept-demo-msg" id="str-concept-demo4-msg">👆 메서드 버튼을 눌러 문자열이 어떻게 변하는지 확인해보세요!</div>
                </div>
            </div>

        `;

        // ========== 개념 데모 인터랙션 ==========

        // --- 데모 1: 문자열 = 문자 배열 ---
        {
            const charRow = container.querySelector('#str-concept-char-row');
            const boxes = charRow.querySelectorAll('.str-concept-char-box');
            const resultEl = container.querySelector('#str-concept-result');
            const msgEl = container.querySelector('#str-concept-demo1-msg');

            function resetBoxes() {
                boxes.forEach(b => {
                    b.classList.remove('str-concept-highlight', 'str-concept-slice', 'str-concept-swap-left', 'str-concept-swap-right');
                    b.style.order = '';
                });
                resultEl.style.display = 'none';
                resultEl.textContent = '';
                msgEl.textContent = '👆 버튼을 눌러 문자열 연산을 직접 확인해보세요!';
            }

            // 인덱스 접근
            container.querySelector('#str-concept-idx-btn').addEventListener('click', () => {
                resetBoxes();
                boxes[2].classList.add('str-concept-highlight');
                resultEl.style.display = 'block';
                resultEl.innerHTML = '<code>s[2]</code> → <strong>\'L\'</strong> &nbsp; (인덱스 2에 있는 문자를 바로 꺼냅니다)';
                msgEl.textContent = '인덱스 2번 문자 "L"이 하이라이트 되었습니다!';
            });

            // 슬라이싱
            container.querySelector('#str-concept-slice-btn').addEventListener('click', () => {
                resetBoxes();
                [1, 2, 3].forEach(i => boxes[i].classList.add('str-concept-slice'));
                resultEl.style.display = 'block';
                resultEl.innerHTML = '<span class="lang-py"><code>s[1:4]</code> → <strong>"ELL"</strong> &nbsp; (인덱스 1부터 3까지, 4는 미포함!)</span><span class="lang-cpp"><code>s.substr(1,3)</code> → <strong>"ELL"</strong> &nbsp; (인덱스 1부터 3개 문자 추출!)</span>';
                msgEl.textContent = '인덱스 1, 2, 3번 문자가 선택되었습니다!';
            });

            // 뒤집기 애니메이션
            container.querySelector('#str-concept-reverse-btn').addEventListener('click', () => {
                resetBoxes();
                const chars = ['H', 'E', 'L', 'L', 'O'];
                const reversed = [...chars].reverse();
                let step = 0;
                const totalSwaps = Math.floor(chars.length / 2);

                function doSwap() {
                    if (step >= totalSwaps) {
                        // 최종 상태 표시
                        boxes.forEach((b, i) => {
                            b.querySelector('.str-concept-char').textContent = reversed[i];
                            b.classList.remove('str-concept-swap-left', 'str-concept-swap-right');
                            b.classList.add('str-concept-slice');
                        });
                        resultEl.style.display = 'block';
                        resultEl.innerHTML = '<span class="lang-py"><code>s[::-1]</code></span><span class="lang-cpp"><code>string(s.rbegin(), s.rend())</code></span> → <strong>"OLLEH"</strong> &nbsp; (바깥쪽부터 안쪽으로 교환!)';
                        msgEl.textContent = '뒤집기 완료! 바깥쪽 문자부터 안쪽으로 서로 자리를 바꿉니다.';
                        return;
                    }
                    const left = step;
                    const right = chars.length - 1 - step;
                    // 하이라이트
                    boxes.forEach(b => b.classList.remove('str-concept-highlight', 'str-concept-swap-left', 'str-concept-swap-right'));
                    boxes[left].classList.add('str-concept-swap-left');
                    boxes[right].classList.add('str-concept-swap-right');

                    msgEl.textContent = `교환 ${step + 1}: s[${left}]='${chars[left]}' ↔ s[${right}]='${chars[right]}'`;

                    setTimeout(() => {
                        // 실제 교환
                        const temp = chars[left];
                        chars[left] = chars[right];
                        chars[right] = temp;
                        boxes[left].querySelector('.str-concept-char').textContent = chars[left];
                        boxes[right].querySelector('.str-concept-char').textContent = chars[right];
                        step++;
                        setTimeout(doSwap, 400);
                    }, 500);
                }
                doSwap();
            });

            // 초기화
            container.querySelector('#str-concept-reset-btn').addEventListener('click', () => {
                const original = ['H', 'E', 'L', 'L', 'O'];
                boxes.forEach((b, i) => {
                    b.querySelector('.str-concept-char').textContent = original[i];
                });
                resetBoxes();
            });
        }

        // --- 데모 2: ASCII 코드 ---
        {
            const asciiInput = container.querySelector('#str-concept-ascii-input');
            const charEl = container.querySelector('#str-concept-ascii-char');
            const numEl = container.querySelector('#str-concept-ascii-num');
            const backEl = container.querySelector('#str-concept-ascii-back');
            const msgEl = container.querySelector('#str-concept-demo2-msg');

            function updateAscii(ch) {
                if (!ch || ch.length === 0) return;
                const c = ch.charAt(0);
                const code = c.charCodeAt(0);
                asciiInput.value = c;
                charEl.textContent = "'" + c + "'";
                numEl.textContent = code;
                backEl.textContent = "'" + c + "'";

                // 애니메이션
                [charEl, numEl, backEl].forEach(el => {
                    el.classList.remove('str-concept-ascii-pop');
                    void el.offsetWidth; // reflow
                    el.classList.add('str-concept-ascii-pop');
                });

                msgEl.innerHTML = "'" + c + "' → <span class=\"lang-py\">ord()</span><span class=\"lang-cpp\">(int)</span> → " + code + " → <span class=\"lang-py\">chr()</span><span class=\"lang-cpp\">(char)</span> → '" + c + "'";
            }

            container.querySelector('#str-concept-ascii-convert').addEventListener('click', () => {
                updateAscii(asciiInput.value);
            });

            asciiInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') updateAscii(asciiInput.value);
            });

            container.querySelector('#str-concept-ascii-next').addEventListener('click', () => {
                const c = asciiInput.value.charAt(0);
                if (c) {
                    const next = String.fromCharCode(c.charCodeAt(0) + 1);
                    updateAscii(next);
                }
            });

            container.querySelector('#str-concept-ascii-prev').addEventListener('click', () => {
                const c = asciiInput.value.charAt(0);
                if (c) {
                    const prev = String.fromCharCode(c.charCodeAt(0) - 1);
                    updateAscii(prev);
                }
            });
        }

        // --- 데모 3: 문자열 비교 ---
        {
            const input1 = container.querySelector('#str-concept-cmp-input1');
            const input2 = container.querySelector('#str-concept-cmp-input2');
            const boxes1 = container.querySelector('#str-concept-cmp-boxes1');
            const boxes2 = container.querySelector('#str-concept-cmp-boxes2');
            const resultEl = container.querySelector('#str-concept-cmp-result');
            const msgEl = container.querySelector('#str-concept-demo3-msg');
            var cmpTimer = null;

            function renderCmpBoxes(str, targetEl) {
                targetEl.innerHTML = '';
                for (var i = 0; i < str.length; i++) {
                    var box = document.createElement('div');
                    box.className = 'str-concept-cmp-box';
                    box.innerHTML = '<span class="str-concept-char">' + str[i] + '</span><span class="str-concept-idx">' + i + '</span>';
                    targetEl.appendChild(box);
                }
            }

            function runComparison() {
                if (cmpTimer) { clearTimeout(cmpTimer); cmpTimer = null; }
                var s1 = input1.value || '';
                var s2 = input2.value || '';
                renderCmpBoxes(s1, boxes1);
                renderCmpBoxes(s2, boxes2);
                resultEl.style.display = 'none';

                var maxLen = Math.max(s1.length, s2.length);
                var step = 0;

                function nextStep() {
                    if (step >= maxLen) {
                        // 모든 문자 같음, 길이 비교
                        resultEl.style.display = 'block';
                        if (s1.length === s2.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-eq">✓ "' + s1 + '" == "' + s2 + '" (모든 문자가 같고 길이도 같음)</span>';
                            msgEl.textContent = '두 문자열이 완전히 같습니다!';
                        } else if (s1.length < s2.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (앞부분이 같지만 "' + s1 + '"이 더 짧음)</span>';
                            msgEl.textContent = '앞부분은 같지만, 짧은 쪽이 사전순으로 앞에 옵니다.';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (앞부분이 같지만 "' + s1 + '"이 더 김)</span>';
                            msgEl.textContent = '앞부분은 같지만, 긴 쪽이 사전순으로 뒤에 옵니다.';
                        }
                        return;
                    }

                    var b1 = boxes1.children[step];
                    var b2 = boxes2.children[step];

                    // 한쪽 문자열이 더 짧은 경우
                    if (step >= s1.length || step >= s2.length) {
                        resultEl.style.display = 'block';
                        if (step >= s1.length) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (' + (step + 1) + '번째 위치: "' + s1 + '"이 끝남, "' + s2 + '"은 \'' + s2[step] + '\' 남음)</span>';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (' + (step + 1) + '번째 위치: "' + s2 + '"이 끝남, "' + s1 + '"은 \'' + s1[step] + '\' 남음)</span>';
                        }
                        msgEl.textContent = '한쪽 문자열이 먼저 끝났습니다. 짧은 쪽이 사전순으로 앞!';
                        return;
                    }

                    // 문자 비교
                    var c1 = s1.charCodeAt(step);
                    var c2 = s2.charCodeAt(step);

                    if (c1 === c2) {
                        b1.classList.add('str-concept-cmp-match');
                        b2.classList.add('str-concept-cmp-match');
                        msgEl.textContent = (step + 1) + '번째 문자: \'' + s1[step] + '\'(' + c1 + ') == \'' + s2[step] + '\'(' + c2 + ') → 같으니 다음으로!';
                        step++;
                        cmpTimer = setTimeout(nextStep, 600);
                    } else {
                        b1.classList.add(c1 < c2 ? 'str-concept-cmp-less' : 'str-concept-cmp-greater');
                        b2.classList.add(c2 < c1 ? 'str-concept-cmp-less' : 'str-concept-cmp-greater');
                        resultEl.style.display = 'block';
                        if (c1 < c2) {
                            resultEl.innerHTML = '<span class="str-concept-cmp-lt">"' + s1 + '" < "' + s2 + '" (' + (step + 1) + '번째 문자: \'' + s1[step] + '\'(' + c1 + ') < \'' + s2[step] + '\'(' + c2 + '))</span>';
                        } else {
                            resultEl.innerHTML = '<span class="str-concept-cmp-gt">"' + s1 + '" > "' + s2 + '" (' + (step + 1) + '번째 문자: \'' + s1[step] + '\'(' + c1 + ') > \'' + s2[step] + '\'(' + c2 + '))</span>';
                        }
                        msgEl.textContent = '첫 번째로 다른 문자를 찾았습니다! ASCII 값으로 크기를 결정합니다.';
                    }
                }
                nextStep();
            }

            // 초기 박스 렌더링
            renderCmpBoxes(input1.value, boxes1);
            renderCmpBoxes(input2.value, boxes2);

            container.querySelector('#str-concept-cmp-btn').addEventListener('click', runComparison);
        }

        // --- 데모 4: 메서드 실험실 ---
        {
            var methodInput = container.querySelector('#str-concept-method-input');
            var beforeEl = container.querySelector('#str-concept-method-before');
            var arrowEl = container.querySelector('#str-concept-method-arrow');
            var afterEl = container.querySelector('#str-concept-method-after');
            var msgEl4 = container.querySelector('#str-concept-demo4-msg');

            function renderCharBoxes(targetEl, str, highlights) {
                targetEl.style.display = 'flex';
                targetEl.style.cssText = 'display:flex;gap:3px;flex-wrap:wrap;justify-content:center;';
                targetEl.innerHTML = '';
                for (var i = 0; i < str.length; i++) {
                    var box = document.createElement('span');
                    var ch = str[i] === ' ' ? '␣' : str[i];
                    var hl = highlights && highlights.indexOf(i) !== -1;
                    box.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:30px;height:34px;border-radius:6px;font-weight:700;font-size:0.95rem;font-family:"Fira Code",monospace;' +
                        (hl ? 'background:var(--accent);color:white;' : 'background:var(--bg2);color:var(--text);border:1px solid var(--border);');
                    box.textContent = ch;
                    targetEl.appendChild(box);
                }
            }

            function renderResultBoxes(targetEl, parts, colors) {
                targetEl.style.display = 'flex';
                targetEl.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center;';
                targetEl.innerHTML = '';
                for (var i = 0; i < parts.length; i++) {
                    var chip = document.createElement('span');
                    chip.style.cssText = 'display:inline-flex;align-items:center;padding:6px 12px;border-radius:8px;font-weight:600;font-size:0.9rem;font-family:"Fira Code",monospace;' +
                        'background:' + (colors && colors[i] ? colors[i] : 'rgba(0,184,148,0.15)') + ';color:var(--text);';
                    chip.textContent = parts[i];
                    targetEl.appendChild(chip);
                }
            }

            function showResult(methodLabel, codeStr, beforeStr, result, highlights) {
                renderCharBoxes(beforeEl, beforeStr, highlights || []);
                arrowEl.style.display = 'block';
                arrowEl.innerHTML = '⬇️ <code style="font-size:0.85rem;">' + codeStr + '</code>';
                if (typeof result === 'string') {
                    renderCharBoxes(afterEl, result, []);
                } else if (Array.isArray(result)) {
                    renderResultBoxes(afterEl, result);
                } else {
                    afterEl.style.display = 'flex';
                    afterEl.style.cssText = 'display:flex;justify-content:center;';
                    afterEl.innerHTML = '<span style="padding:8px 16px;background:rgba(0,184,148,0.15);border-radius:8px;font-weight:700;font-size:1.1rem;color:var(--green);">' + result + '</span>';
                }
                msgEl4.textContent = methodLabel;
            }

            container.querySelector('#str-concept-method-btns').addEventListener('click', function(e) {
                var btn = e.target.closest('[data-method]');
                if (!btn) return;
                var s = methodInput.value;
                var method = btn.dataset.method;

                switch (method) {
                    case 'upper':
                        showResult('대문자로 변환! 소문자만 바뀌고 나머지는 그대로.', 's.upper()', s, s.toUpperCase());
                        break;
                    case 'lower':
                        showResult('소문자로 변환! 대문자만 바뀌고 나머지는 그대로.', 's.lower()', s, s.toLowerCase());
                        break;
                    case 'find': {
                        var idx = s.indexOf('o');
                        var hl = idx >= 0 ? [idx] : [];
                        showResult(idx >= 0 ? '인덱스 ' + idx + '에서 \'o\'를 찾았습니다!' : '\'o\'를 찾지 못했습니다 → -1 반환', "s.find('o')", s, idx, hl);
                        break;
                    }
                    case 'count': {
                        var cnt = 0;
                        var cntHl = [];
                        for (var ci = 0; ci < s.length; ci++) {
                            if (s[ci] === 'l') { cnt++; cntHl.push(ci); }
                        }
                        showResult('\'l\'이 ' + cnt + '번 등장합니다!', "s.count('l')", s, cnt, cntHl);
                        break;
                    }
                    case 'replace':
                        showResult('모든 \'l\'을 \'★\'으로 교체!', "s.replace('l','★')", s, s.replace(/l/g, '★'));
                        break;
                    case 'split': {
                        var parts = s.split(',');
                        renderCharBoxes(beforeEl, s, []);
                        arrowEl.style.display = 'block';
                        arrowEl.innerHTML = "⬇️ <code style=\"font-size:0.85rem;\">s.split(',')</code>";
                        renderResultBoxes(afterEl, parts.map(function(p) { return '"' + p.trim() + '"'; }));
                        msgEl4.textContent = '쉼표를 기준으로 ' + parts.length + '조각으로 분리!';
                        break;
                    }
                    case 'strip':
                        showResult('앞뒤 공백 제거! (가운데 공백은 유지)', 's.strip()', s, s.trim());
                        break;
                    case 'isalpha': {
                        var alphaHl = [];
                        var nonAlpha = [];
                        for (var ai = 0; ai < s.length; ai++) {
                            if (/[a-zA-Z]/.test(s[ai])) alphaHl.push(ai);
                            else nonAlpha.push(ai);
                        }
                        var allAlpha = nonAlpha.length === 0 && s.length > 0;
                        renderCharBoxes(beforeEl, s, alphaHl);
                        arrowEl.style.display = 'block';
                        arrowEl.innerHTML = '⬇️ <code style="font-size:0.85rem;">s.isalpha()</code>';
                        afterEl.style.display = 'flex';
                        afterEl.style.cssText = 'display:flex;justify-content:center;';
                        afterEl.innerHTML = '<span style="padding:8px 16px;border-radius:8px;font-weight:700;font-size:1.1rem;' +
                            (allAlpha ? 'background:rgba(0,184,148,0.15);color:var(--green);">True ✅' : 'background:rgba(255,118,117,0.15);color:var(--red);">False ❌') + '</span>';
                        msgEl4.textContent = allAlpha ? '모두 알파벳이라 True!' : '하이라이트 되지 않은 문자(' + nonAlpha.length + '개)가 알파벳이 아니라 False!';
                        break;
                    }
                    case 'reverse':
                        showResult('문자열을 뒤집기! 팰린드롬 검사에 자주 사용.', 's[::-1]', s, s.split('').reverse().join(''));
                        break;
                    case 'sorted': {
                        var sorted = s.split('').sort().join('');
                        showResult('모든 문자를 ASCII 순서로 정렬! (공백→숫자→대문자→소문자)', 'sorted(s)', s, sorted);
                        break;
                    }
                }
            });
        }

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
            if (prob.id === 'boj-1157') {
                this._renderBonusSpeedComparison(contentEl);
            }
            if (prob.id === 'lc-125') {
                this._renderBonusPalindromeComparison(contentEl);
            }
            if (prob.id === 'boj-1213') {
                this._renderBonusMakePalindromeComparison(contentEl);
            }
            return;
        }
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');

        wrapper.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                <select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
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
            const langMap = { python: 'language-python', cpp: 'language-cpp' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            codeEl.removeAttribute('data-highlighted');
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        contentEl.appendChild(wrapper);
    },

    // ===== 번외편: Counter 속도 비교 =====
    _renderBonusSpeedComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 번외: 이걸 한 줄로?</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>

            <div class="bonus-content"><div class="bonus-card">
                <p style="margin-bottom:12px;color:var(--text2);font-size:0.95rem;">
                    Python의 <code>collections.Counter</code>를 쓰면 빈도수 세기가 한 줄이에요!
                </p>
                <div class="code-block" style="margin-bottom:16px;">
                    <div class="code-block-header">
                        <div class="code-block-dots"><span></span><span></span><span></span></div>
                        <div class="code-block-title">counter_solution.py</div>
                    </div>
                    <pre style="margin:0;padding:1rem;"><code class="language-python hljs"><span class="hljs-keyword">from</span> collections <span class="hljs-keyword">import</span> Counter

word = <span class="hljs-built_in">input</span>().upper()
cnt = Counter(word)
top = cnt.most_common(<span class="hljs-number">2</span>)

<span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(top) > <span class="hljs-number">1</span> <span class="hljs-keyword">and</span> top[<span class="hljs-number">0</span>][<span class="hljs-number">1</span>] == top[<span class="hljs-number">1</span>][<span class="hljs-number">1</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">"?"</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(top[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>])</code></pre>
                </div>

                <div class="bonus-speed-title">⚡ 속도 비교: 딕셔너리 vs Counter</div>
                <p style="margin-bottom:16px;color:var(--text2);font-size:0.9rem;">
                    슬라이더를 움직여서 데이터가 커질수록 속도 차이가 어떻게 변하는지 확인해보세요!
                </p>

                <div class="speed-slider-row">
                    <span class="speed-slider-label">데이터 크기</span>
                    <input type="range" class="speed-slider" min="0" max="100" step="1" value="0">
                    <span class="speed-size-display">100자</span>
                </div>

                <div class="speed-bars-container">
                    <div class="speed-bar-row">
                        <span class="speed-bar-label">딕셔너리</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill dict-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time dict-time">0.02ms</span>
                    </div>
                    <div class="speed-bar-row">
                        <span class="speed-bar-label">Counter</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill counter-bar" style="width:2%"></div>
                        </div>
                        <span class="speed-bar-time counter-time">0.015ms</span>
                    </div>
                </div>

                <div class="speed-ratio-badge">
                    비슷한 속도 🤝
                </div>

                <div class="speed-explanation" style="margin-top:16px;padding:14px 18px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3);">
                    <p style="font-size:0.9rem;color:var(--text);margin:0 0 10px 0;font-weight:700;">
                        💡 왜 Counter가 빠를까?
                    </p>
                    <div style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem;color:var(--text2);line-height:1.6;">
                        <div>🐍 <strong>딕셔너리</strong>: Python이 <code>for c in word:</code>로 글자를 하나씩 꺼내고, 매번 <code>freq[c] += 1</code>을 실행해요. 이 반복문은 Python 인터프리터가 한 줄씩 해석하면서 돌아가요.</div>
                        <div>⚡ <strong>Counter</strong>: <code>Counter(word)</code>를 호출하면, 내부적으로 <strong>C 언어로 작성된 <code>_count_elements</code></strong> 함수가 실행돼요. 같은 반복이지만 컴파일된 C 코드가 돌아가니까 훨씬 빨라요!</div>
                        <div style="padding:8px 12px;background:rgba(0,184,148,0.08);border-radius:8px;margin-top:4px;">📌 <strong>핵심</strong>: 둘 다 O(n)이지만, Python 반복 vs C 반복의 <strong>상수 차이</strong>가 데이터가 커질수록 드러나요.</div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // 번외편 토글
        const divider1 = bonus.querySelector('.bonus-divider');
        divider1.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider1.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        // Continuous interpolation: slider 0~100 maps to 100 ~ 1,000,000 chars (log scale)
        const slider = bonus.querySelector('.speed-slider');
        const sizeDisplay = bonus.querySelector('.speed-size-display');
        const dictBar = bonus.querySelector('.dict-bar');
        const counterBar = bonus.querySelector('.counter-bar');
        const dictTime = bonus.querySelector('.dict-time');
        const counterTime = bonus.querySelector('.counter-time');
        const ratioBadge = bonus.querySelector('.speed-ratio-badge');

        function formatSize(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M자';
            if (n >= 1000) return Math.round(n / 1000).toLocaleString() + 'K자';
            return n.toLocaleString() + '자';
        }

        function formatTime(ms) {
            if (ms >= 1) return ms.toFixed(1) + 'ms';
            return ms.toFixed(3) + 'ms';
        }

        function update(val) {
            // Log scale: 0→100자, 100→1,000,000자
            const t = val / 100;
            const size = Math.round(100 * Math.pow(10000, t));  // 100 ~ 1,000,000

            // Realistic speed curves (ms)
            // Both have ~0.03ms fixed overhead (function call, object creation)
            // dict: +0.00015ms per char (Python for-loop)
            // Counter: +0.000015ms per char (C-optimized internal loop)
            // Small data → overhead dominates → similar speed
            // Large data → per-char cost dominates → Counter wins big
            const dictMs = 0.00015 * size + 0.03;
            const counterMs = 0.000015 * size + 0.03;

            sizeDisplay.textContent = formatSize(size);

            const maxMs = 0.00015 * 1000000 + 0.005; // ~150ms
            const dictPct = Math.max(3, (dictMs / maxMs) * 100);
            const counterPct = Math.max(3, (counterMs / maxMs) * 100);

            dictBar.style.width = dictPct + '%';
            counterBar.style.width = counterPct + '%';

            dictTime.textContent = formatTime(dictMs);
            counterTime.textContent = formatTime(counterMs);

            const ratio = dictMs / counterMs;
            if (ratio < 1.5) {
                ratioBadge.textContent = '비슷한 속도 🤝';
                ratioBadge.className = 'speed-ratio-badge ratio-similar';
            } else if (ratio < 5) {
                ratioBadge.textContent = 'Counter가 ' + ratio.toFixed(1) + '배 빠릅니다! ⚡';
                ratioBadge.className = 'speed-ratio-badge ratio-fast';
            } else {
                ratioBadge.textContent = 'Counter가 ' + ratio.toFixed(1) + '배 빠릅니다! 🚀';
                ratioBadge.className = 'speed-ratio-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== 번외편: Valid Palindrome 비교 =====
    _renderBonusPalindromeComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 번외: 정규식으로 한 방에!</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>

            <div class="bonus-content"><div class="bonus-card">
                <p style="margin-bottom:12px;color:var(--text2);font-size:0.95rem;">
                    Python의 <code>re</code> 모듈과 슬라이싱을 쓰면 3줄로 끝나요!
                </p>
                <div class="code-block" style="margin-bottom:16px;">
                    <div class="code-block-header">
                        <div class="code-block-dots"><span></span><span></span><span></span></div>
                        <div class="code-block-title">one_liner.py</div>
                    </div>
                    <pre style="margin:0;padding:1rem;"><code class="language-python hljs"><span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">isPalindrome</span>(s):
    s = re.sub(<span class="hljs-string">r'[^a-zA-Z0-9]'</span>, <span class="hljs-string">''</span>, s).lower()
    <span class="hljs-keyword">return</span> s == s[::<span class="hljs-number">-1</span>]</code></pre>
                </div>

                <div class="bonus-speed-title">⚡ 슬라이싱 vs 투 포인터 — 뭐가 다를까?</div>
                <p style="margin-bottom:16px;color:var(--text2);font-size:0.9rem;">
                    슬라이더를 움직여서 문자열이 길어질수록 어떤 차이가 나는지 확인해보세요!
                </p>

                <div class="speed-slider-row">
                    <span class="speed-slider-label">문자열 길이</span>
                    <input type="range" class="speed-slider pal-slider" min="0" max="100" step="1" value="0">
                    <span class="speed-size-display pal-size">100자</span>
                </div>

                <div class="speed-bars-container">
                    <div class="speed-bar-row">
                        <span class="speed-bar-label" style="min-width:80px">슬라이싱</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill dict-bar pal-slice-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time pal-slice-time">0.01ms</span>
                    </div>
                    <div class="speed-bar-row">
                        <span class="speed-bar-label" style="min-width:80px">투 포인터</span>
                        <div class="speed-bar-track">
                            <div class="speed-bar-fill counter-bar pal-tp-bar" style="width:3%"></div>
                        </div>
                        <span class="speed-bar-time pal-tp-time">0.02ms</span>
                    </div>
                </div>

                <div class="speed-ratio-badge pal-badge">
                    비슷한 속도 🤝
                </div>

                <div style="margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:180px;padding:12px;background:rgba(253,203,110,0.08);border:1px solid rgba(253,203,110,0.25);border-radius:10px;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px;">🔄 슬라이싱 <code>[::-1]</code></div>
                        <div style="font-size:0.85rem;color:var(--text2);line-height:1.5;">
                            시간: <strong>빠름</strong> (C 최적화)<br>
                            메모리: <strong>O(n)</strong> 복사본 생성<br>
                            코드: 짧고 직관적
                        </div>
                    </div>
                    <div style="flex:1;min-width:180px;padding:12px;background:rgba(0,184,148,0.06);border:1px solid rgba(0,184,148,0.2);border-radius:10px;">
                        <div style="font-weight:700;font-size:0.9rem;margin-bottom:6px;">👆 투 포인터</div>
                        <div style="font-size:0.85rem;color:var(--text2);line-height:1.5;">
                            시간: Python 루프 (느림)<br>
                            메모리: <strong>O(1)</strong> 추가 없음!<br>
                            코드: 면접에서 선호
                        </div>
                    </div>
                </div>

                <div style="margin-top:14px;display:flex;gap:12px;flex-wrap:wrap;">
                    <div class="pal-mem-card" style="flex:1;min-width:120px;text-align:center;padding:10px;background:var(--bg);border-radius:10px;border:1px solid var(--bg3);">
                        <div style="font-size:0.8rem;color:var(--text2);">슬라이싱 메모리</div>
                        <div class="pal-mem-slice" style="font-size:1.1rem;font-weight:700;color:#e17055;font-family:'Fira Code',monospace;">~100B</div>
                    </div>
                    <div class="pal-mem-card" style="flex:1;min-width:120px;text-align:center;padding:10px;background:var(--bg);border-radius:10px;border:1px solid var(--bg3);">
                        <div style="font-size:0.8rem;color:var(--text2);">투 포인터 메모리</div>
                        <div style="font-size:1.1rem;font-weight:700;color:var(--green);font-family:'Fira Code',monospace;">~16B 고정</div>
                    </div>
                </div>

                <div style="margin-top:14px;padding:12px 16px;background:var(--bg2);border-radius:10px;border:1px solid var(--bg3);">
                    <p style="font-size:0.9rem;color:var(--text);margin:0 0 8px 0;font-weight:700;">
                        💡 그래서 뭘 쓰지?
                    </p>
                    <div style="font-size:0.88rem;color:var(--text2);line-height:1.6;">
                        <div>✅ <strong>코딩 테스트</strong>: 슬라이싱이 빠르고 짧아서 유리</div>
                        <div>✅ <strong>면접</strong>: 투 포인터 — "O(1) 공간"을 설명할 수 있어서 인상적</div>
                        <div>✅ <strong>실무</strong>: 데이터가 작으면 슬라이싱, 메모리 제한이 있으면 투 포인터</div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // 번외편 토글
        const divider2 = bonus.querySelector('.bonus-divider');
        divider2.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider2.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        const slider = bonus.querySelector('.pal-slider');
        const sizeDisplay = bonus.querySelector('.pal-size');
        const sliceBar = bonus.querySelector('.pal-slice-bar');
        const tpBar = bonus.querySelector('.pal-tp-bar');
        const sliceTime = bonus.querySelector('.pal-slice-time');
        const tpTime = bonus.querySelector('.pal-tp-time');
        const badge = bonus.querySelector('.pal-badge');
        const memSlice = bonus.querySelector('.pal-mem-slice');

        function formatSize(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M자';
            if (n >= 1000) return Math.round(n / 1000).toLocaleString() + 'K자';
            return n.toLocaleString() + '자';
        }
        function formatTime(ms) {
            return ms >= 1 ? ms.toFixed(1) + 'ms' : ms.toFixed(3) + 'ms';
        }
        function formatMem(bytes) {
            if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'MB';
            if (bytes >= 1024) return (bytes / 1024).toFixed(0) + 'KB';
            return '~' + bytes + 'B';
        }

        function update(val) {
            const t = val / 100;
            const size = Math.round(100 * Math.pow(2000, t)); // 100 ~ 200,000

            sizeDisplay.textContent = formatSize(size);

            // Slicing: C-optimized, very fast, but O(n) memory
            const sliceMs = 0.000005 * size + 0.005;
            // Two pointer: Python loop, slower, but O(1) memory
            const tpMs = 0.00008 * size + 0.008;

            const maxMs = 0.00008 * 200000 + 0.008; // ~16ms
            sliceBar.style.width = Math.max(3, (sliceMs / maxMs) * 100) + '%';
            tpBar.style.width = Math.max(3, (tpMs / maxMs) * 100) + '%';

            sliceTime.textContent = formatTime(sliceMs);
            tpTime.textContent = formatTime(tpMs);

            memSlice.textContent = formatMem(size);

            const ratio = tpMs / sliceMs;
            if (ratio < 2) {
                badge.textContent = '비슷한 속도 🤝';
                badge.className = 'speed-ratio-badge pal-badge ratio-similar';
            } else if (ratio < 8) {
                badge.textContent = '슬라이싱이 ' + ratio.toFixed(1) + '배 빠릅니다! ⚡';
                badge.className = 'speed-ratio-badge pal-badge ratio-fast';
            } else {
                badge.textContent = '슬라이싱이 ' + ratio.toFixed(0) + '배 빠릅니다! 🚀';
                badge.className = 'speed-ratio-badge pal-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== 번외: 팰린드롬 만들기 — 배열 vs Counter 속도 비교 =====
    _renderBonusMakePalindromeComparison(contentEl) {
        const bonus = document.createElement('div');
        bonus.className = 'bonus-speed-section';
        bonus.innerHTML = `
            <div class="bonus-divider">
                <span class="bonus-divider-line"></span>
                <span class="bonus-divider-label">📦 번외: Counter로 더 짧게?</span>
                <span class="bonus-divider-toggle">▼</span>
                <span class="bonus-divider-line"></span>
            </div>
            <div class="bonus-content"><div class="bonus-card">
                <p style="margin:0 0 12px;color:var(--text-secondary);">Python의 <code>Counter</code>를 쓰면 빈도수 세기 + 홀수 체크가 훨씬 간결해요!</p>
                <div style="background:#282c34;border-radius:12px;overflow:hidden;">
                    <div style="display:flex;align-items:center;padding:8px 16px;background:#21252b;">
                        <span style="display:flex;gap:6px;">
                            <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56;display:inline-block;"></span>
                            <span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e;display:inline-block;"></span>
                            <span style="width:12px;height:12px;border-radius:50%;background:#27c93f;display:inline-block;"></span>
                        </span>
                        <span style="flex:1;text-align:center;color:#888;font-size:0.85em;font-family:monospace;">palindrome_counter.py</span>
                    </div>
                    <pre style="margin:0;padding:20px;color:#d4d8e0;font-size:0.95rem;line-height:1.8;overflow-x:auto;"><code><span style="color:#c678dd;">from</span> <span style="color:#d4d8e0;">collections</span> <span style="color:#c678dd;">import</span> Counter

<span style="color:#d4d8e0;">cnt</span> = Counter(<span style="color:#56b6c2;">input</span>())
<span style="color:#d4d8e0;">odds</span> = [c <span style="color:#c678dd;">for</span> c, v <span style="color:#c678dd;">in</span> cnt.items() <span style="color:#c678dd;">if</span> v % <span style="color:#d19a66;">2</span>]

<span style="color:#c678dd;">if</span> <span style="color:#56b6c2;">len</span>(odds) > <span style="color:#d19a66;">1</span>:
    <span style="color:#56b6c2;">print</span>(<span style="color:#98c379;">"I'm Sorry Hansoo"</span>)
<span style="color:#c678dd;">else</span>:
    <span style="color:#d4d8e0;">half</span> = <span style="color:#98c379;">""</span>.join(c * (v // <span style="color:#d19a66;">2</span>) <span style="color:#c678dd;">for</span> c, v <span style="color:#c678dd;">in</span> <span style="color:#56b6c2;">sorted</span>(cnt.items()))
    <span style="color:#d4d8e0;">mid</span> = odds[<span style="color:#d19a66;">0</span>] <span style="color:#c678dd;">if</span> odds <span style="color:#c678dd;">else</span> <span style="color:#98c379;">""</span>
    <span style="color:#56b6c2;">print</span>(half + mid + half[::<span style="color:#d19a66;">-1</span>])</code></pre>
                </div>
            </div>
            <h3 style="margin:28px 0 8px;font-size:1.1em;">⚡ 배열 카운팅 vs Counter — 뭐가 다를까?</h3>
            <p style="color:var(--text-secondary);margin-bottom:16px;">슬라이더를 움직여서 문자열이 길어질수록 어떤 차이가 나는지 확인해보세요!</p>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
                <span style="font-weight:600;white-space:nowrap;">문자열 길이</span>
                <input type="range" min="0" max="100" value="0" class="speed-slider mkpal-slider" />
                <span class="mkpal-size-label" style="color:var(--accent);font-weight:700;min-width:60px;text-align:right;">10자</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:12px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="min-width:70px;text-align:right;font-weight:500;">배열</span>
                    <div style="flex:1;background:var(--bg-secondary);border-radius:8px;height:28px;overflow:hidden;position:relative;">
                        <div class="speed-bar-fill mkpal-bar-arr" style="height:100%;border-radius:8px;width:50%;background:linear-gradient(90deg,#e17055,#fdcb6e);"></div>
                    </div>
                    <span class="mkpal-time-arr" style="min-width:70px;font-size:0.85em;color:var(--text-secondary);">0.01ms</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="min-width:70px;text-align:right;font-weight:500;">Counter</span>
                    <div style="flex:1;background:var(--bg-secondary);border-radius:8px;height:28px;overflow:hidden;position:relative;">
                        <div class="speed-bar-fill mkpal-bar-ctr" style="height:100%;border-radius:8px;width:50%;background:linear-gradient(90deg,#6c5ce7,#a29bfe);"></div>
                    </div>
                    <span class="mkpal-time-ctr" style="min-width:70px;font-size:0.85em;color:var(--text-secondary);">0.01ms</span>
                </div>
            </div>
            <div class="speed-ratio-badge mkpal-badge" style="margin-top:16px;">비슷한 속도 🤝</div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px;">
                <div style="background:rgba(225,112,85,0.08);border:1px solid rgba(225,112,85,0.2);border-radius:12px;padding:16px;">
                    <h4 style="margin:0 0 8px;">📊 배열 카운팅</h4>
                    <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">방식: <code>[0]*26</code> + <code>ord()</code><br>장점: 메모리 고정, C++에도 적용<br>단점: 코드가 좀 길어짐</p>
                </div>
                <div style="background:var(--bg2);border:1px solid var(--bg3);border-radius:12px;padding:16px;">
                    <h4 style="margin:0 0 8px;">⚡ Counter</h4>
                    <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">방식: <code>Counter(s)</code> 한 줄<br>장점: Pythonic하고 간결!<br>단점: Python 전용</p>
                </div>
            </div>

            <div style="background:var(--bg-secondary);border-radius:12px;padding:16px;margin-top:16px;">
                <h4 style="margin:0 0 8px;">💡 그래서 뭘 쓰지?</h4>
                <p style="margin:0;font-size:0.9em;color:var(--text-secondary);">
                    ✅ <strong>Python 코테</strong>: Counter — 짧고 실수 줄임<br>
                    ✅ <strong>면접 (C++)</strong>: 배열 — 언어 독립적 사고 어필<br>
                    ✅ <strong>이 문제 (길이 ≤ 50)</strong>: 둘 다 충분히 빠름! 편한 걸로
                </p>
            </div>
        </div>
        `;

        // 번외편 토글
        const divider4 = bonus.querySelector('.bonus-divider');
        divider4.addEventListener('click', () => {
            bonus.classList.toggle('bonus-open');
            divider4.querySelector('.bonus-divider-toggle').textContent = bonus.classList.contains('bonus-open') ? '▲' : '▼';
        });

        const slider = bonus.querySelector('.mkpal-slider');
        const sizeLabel = bonus.querySelector('.mkpal-size-label');
        const barArr = bonus.querySelector('.mkpal-bar-arr');
        const barCtr = bonus.querySelector('.mkpal-bar-ctr');
        const timeArr = bonus.querySelector('.mkpal-time-arr');
        const timeCtr = bonus.querySelector('.mkpal-time-ctr');
        const badge = bonus.querySelector('.mkpal-badge');

        function update(val) {
            const t = val / 100;
            // Log scale: 10 ~ 1,000,000
            const size = Math.round(10 * Math.pow(100000, t));
            if (size >= 1000000) sizeLabel.textContent = (size/1000000).toFixed(0) + 'M자';
            else if (size >= 1000) sizeLabel.textContent = (size/1000).toFixed(0) + 'K자';
            else sizeLabel.textContent = size + '자';

            // 배열: Python loop per char
            const arrMs = 0.00015 * size + 0.02;
            // Counter: C-optimized _count_elements
            const ctrMs = 0.000015 * size + 0.02;

            const maxMs = Math.max(arrMs, ctrMs);
            barArr.style.width = (arrMs / maxMs * 80 + 10) + '%';
            barCtr.style.width = (ctrMs / maxMs * 80 + 10) + '%';
            timeArr.textContent = arrMs < 1 ? arrMs.toFixed(3) + 'ms' : arrMs.toFixed(1) + 'ms';
            timeCtr.textContent = ctrMs < 1 ? ctrMs.toFixed(3) + 'ms' : ctrMs.toFixed(1) + 'ms';

            const ratio = arrMs / ctrMs;
            if (ratio < 1.5) {
                badge.textContent = '비슷한 속도 🤝';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-similar';
            } else if (ratio < 5) {
                badge.textContent = 'Counter가 ' + ratio.toFixed(1) + '배 빠릅니다! ⚡';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-fast';
            } else {
                badge.textContent = 'Counter가 ' + ratio.toFixed(0) + '배 빠릅니다! 🚀';
                badge.className = 'speed-ratio-badge mkpal-badge ratio-super';
            }
        }

        slider.addEventListener('input', () => update(parseInt(slider.value)));
        update(0);

        contentEl.appendChild(bonus);
    },

    // ===== 알파벳 찾기 시각화 =====
    _renderVizAlphaFind(container) {
        const self = this;
        container.innerHTML = `
            <div id="alpha-find-section" style="padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid #00b894;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                    <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:#00b894;">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:#00b894;color:#fff;font-size:0.8rem;font-weight:700;">1</span>
                        알파벳 찾기
                    </span>
                    <span class="approach-meta-badge time">⏱ O(n)</span>
                    <span class="approach-meta-badge space">💾 O(1)</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                    <label style="font-weight:600;">문자열:
                        <input type="text" id="alpha-find-input" value="baekjoon"
                            style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;">
                    </label>
                    <button class="btn btn-primary" id="alpha-find-start" style="font-size:1rem;">🔍 탐색 시작</button>
                </div>
                <div id="alpha-find-viz-area" style="display:none;">
                    ${self._createStepDesc('-alphafind')}
                    <div class="sim-card" style="padding:24px;">
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                            <div id="alpha-find-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        </div>
                        <div style="margin-top:16px;width:100%;">
                            <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">결과 배열 (a~z 첫 등장 위치, 없으면 -1)</div>
                            <div id="alpha-find-result" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;font-family:var(--font-mono);font-size:0.85rem;"></div>
                        </div>
                        <div style="min-width:140px;margin-top:12px;">
                            <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                            <div id="alpha-find-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                        </div>
                        <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 확인 중</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>
                        </div>
                    </div>
                    ${self._createStepControls('-alphafind')}
                </div>
            </div>
        `;

        var section = container.querySelector('#alpha-find-section');
        var vizArea = section.querySelector('#alpha-find-viz-area');
        var charBoxes = section.querySelector('#alpha-find-char-boxes');
        var resultArea = section.querySelector('#alpha-find-result');
        var statusEl = section.querySelector('#alpha-find-status');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                charBoxes.appendChild(box);
            }
        }

        function renderResult(arr) {
            resultArea.innerHTML = '';
            for (var i = 0; i < 26; i++) {
                var ch = String.fromCharCode(97 + i); // a~z
                var cell = document.createElement('div');
                cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:4px 5px;border-radius:6px;min-width:28px;' +
                    (arr[i] >= 0 ? 'background:rgba(0,184,148,0.15);color:var(--green);font-weight:700;' : 'background:var(--bg);color:var(--text3);');
                cell.innerHTML = '<span style="font-size:0.75rem;font-weight:600;">' + ch + '</span><span>' + arr[i] + '</span>';
                cell.id = 'alpha-result-' + i;
                resultArea.appendChild(cell);
            }
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                result: resultArea.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            resultArea.innerHTML = s.result;
            statusEl.innerHTML = s.status;
        }

        section.querySelector('#alpha-find-start').addEventListener('click', function() {
            self._clearVizState();
            var str = section.querySelector('#alpha-find-input').value.toLowerCase();
            if (!str.length) return;

            vizArea.style.display = '';
            this.textContent = '🔄 다시 시작';

            renderBoxes(str);
            var result = new Array(26).fill(-1);
            renderResult(result);
            statusEl.innerHTML = '준비 완료';

            var steps = [];

            // 각 문자를 순서대로 확인
            for (let i = 0; i < str.length; i++) {
                let idx = i, ch = str[i];
                let alphaIdx = ch.charCodeAt(0) - 97;
                let isFirst = result[alphaIdx] === -1;
                if (isFirst) result[alphaIdx] = i; // 미리 계산

                steps.push({
                    description: isFirst
                        ? 'str[' + idx + '] = \'' + ch + '\' → \'' + ch + '\'의 첫 등장! 위치 ' + idx + ' 기록'
                        : 'str[' + idx + '] = \'' + ch + '\' → 이미 위치 ' + result[alphaIdx] + '에서 등장했으므로 건너뜀',
                    _before: null,
                    _isFirst: isFirst,
                    _alphaIdx: alphaIdx,
                    _idx: idx,
                    _ch: ch,
                    action: function() {
                        this._before = saveState();
                        // 현재까지의 박스 상태 업데이트
                        for (var j = 0; j < str.length; j++) {
                            var box = charBoxes.querySelector('[data-idx="' + j + '"]');
                            if (!box) continue;
                            box.className = j < this._idx ? 'str-char-box matched' : j === this._idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        // 결과 배열에서 해당 알파벳 하이라이트
                        var cell = resultArea.querySelector('#alpha-result-' + this._alphaIdx);
                        if (cell && this._isFirst) {
                            cell.style.background = 'rgba(0,184,148,0.15)';
                            cell.style.color = 'var(--green)';
                            cell.style.fontWeight = '700';
                            cell.querySelector('span:last-child').textContent = this._idx;
                        }
                        statusEl.innerHTML = this._isFirst
                            ? '<span style="color:var(--green);">\'' + this._ch + '\' 첫 등장! → result[' + this._alphaIdx + '] = ' + this._idx + '</span>'
                            : '\'' + this._ch + '\' → 이미 기록됨 (건너뜀)';
                    },
                    undo: function() {
                        restoreState(this._before);
                    }
                });
            }

            // 완료 스텝
            steps.push({
                description: '완료! 26개 알파벳의 첫 등장 위치를 모두 구했습니다 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">완료! 결과 배열에서 -1인 알파벳은 문자열에 없는 글자입니다.</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            // result를 다시 초기화 (시뮬레이션용)
            result = new Array(26).fill(-1);
            renderResult(result);

            self._initLocalStepController(section, steps, '-alphafind');
            section.querySelector('#viz-next-alphafind').click();
        });
    },

    // ===== 빈도수 세기 시각화 =====
    _renderVizFrequency(container) {
        const self = this;
        container.innerHTML = `
            <div id="freq-section" style="padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
                    <span style="display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:1rem;color:var(--accent);">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:var(--accent);color:#fff;font-size:0.8rem;font-weight:700;">1</span>
                        빈도수 분석
                    </span>
                    <span class="approach-meta-badge time">⏱ O(n)</span>
                    <span class="approach-meta-badge space">💾 O(1)</span>
                </div>
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                    <label style="font-weight:600;">문자열:
                        <input type="text" id="str-viz-input" value="Mississippi"
                            style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;">
                    </label>
                    <button class="btn btn-primary" id="str-viz-start" style="font-size:1rem;">🔍 탐색 시작</button>
                </div>
                <div id="freq-viz-area" style="display:none;">
                    ${self._createStepDesc('-freq')}
                    <div class="sim-card" style="padding:24px;">
                        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                            <div id="str-char-boxes-freq" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        </div>
                        <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;width:100%;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">빈도수 딕셔너리</div>
                                <div id="str-freq-display-freq" class="graph-queue-display" style="min-height:50px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px;">
                                    <span style="color:var(--text2);">{ }</span>
                                </div>
                            </div>
                            <div style="min-width:140px;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                                <div id="str-status-freq" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                            </div>
                        </div>
                        <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 확인 중</span>
                            <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 처리 완료</span>
                        </div>
                    </div>
                    ${self._createStepControls('-freq')}
                </div>
            </div>
        `;

        var section = container.querySelector('#freq-section');
        var vizArea = section.querySelector('#freq-viz-area');
        var charBoxes = section.querySelector('#str-char-boxes-freq');
        var freqDisplay = section.querySelector('#str-freq-display-freq');
        var statusEl = section.querySelector('#str-status-freq');

        function renderBoxes(str) {
            charBoxes.innerHTML = '';
            for (var i = 0; i < str.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + str[i] + '</div>';
                charBoxes.appendChild(box);
            }
        }

        function renderFreq(freq) {
            if (Object.keys(freq).length === 0) {
                freqDisplay.innerHTML = '<span style="color:var(--text2);">{ }</span>';
                return;
            }
            freqDisplay.innerHTML = Object.entries(freq)
                .map(function(e) { return '<span class="graph-queue-item" style="min-width:50px;text-align:center;"><strong>\'' + e[0] + '\'</strong>: ' + e[1] + '</span>'; })
                .join('');
        }

        function saveState() {
            return {
                boxes: Array.from(charBoxes.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                freq: freqDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            charBoxes.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxes[i]; });
            freqDisplay.innerHTML = s.freq;
            statusEl.innerHTML = s.status;
        }

        section.querySelector('#str-viz-start').addEventListener('click', function() {
            self._clearVizState();
            var str = section.querySelector('#str-viz-input').value;
            if (!str.length) return;

            // 시각화 영역 표시 + 시작 버튼을 "다시 시작"으로 변경
            vizArea.style.display = '';
            this.textContent = '🔄 다시 시작';

            renderBoxes(str);
            renderFreq({});
            statusEl.innerHTML = '준비 완료';

            var steps = [];
            var freq = {};
            var buildFreq = {};

            for (let i = 0; i < str.length; i++) {
                let idx = i, ch = str[i];
                let prevCount = buildFreq[ch] || 0;
                buildFreq[ch] = prevCount + 1;
                steps.push({
                    description: prevCount ? '\'' + ch + '\' → ' + (prevCount+1) + '번째 등장! 카운트를 1 증가시켜 빈도를 기록합니다.' : '\'' + ch + '\' 첫 등장! 빈도 테이블에 추가하여 이 글자가 몇 번 나오는지 추적합니다.',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let j = 0; j < str.length; j++) {
                            let box = charBoxes.querySelector('[data-idx="' + j + '"]');
                            if (!box) continue;
                            box.className = j < idx ? 'str-char-box matched' : j === idx ? 'str-char-box comparing' : 'str-char-box';
                        }
                        freq[ch] = (freq[ch] || 0) + 1;
                        renderFreq(freq);
                        statusEl.innerHTML = '\'' + ch + '\' → count = <strong>' + freq[ch] + '</strong>';
                    },
                    undo: function() {
                        freq[ch]--;
                        if (freq[ch] === 0) delete freq[ch];
                        restoreState(this._before);
                    }
                });
            }

            var finalFreq = {};
            for (var c = 0; c < str.length; c++) finalFreq[str[c]] = (finalFreq[str[c]] || 0) + 1;
            var entries = Object.entries(finalFreq).sort(function(a, b) { return b[1] - a[1]; });
            var maxChar = entries[0];

            steps.push({
                description: '완료! 최다: \'' + maxChar[0] + '\' (' + maxChar[1] + '번) 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    charBoxes.querySelectorAll('.str-char-box').forEach(function(b) { b.className = 'str-char-box matched'; });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">완료! 가장 많은 글자: <strong>\'' + maxChar[0] + '\'</strong> (' + maxChar[1] + '번)</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initLocalStepController(section, steps, '-freq');
            // 탐색 시작하면 바로 Step 1 진입
            section.querySelector('#viz-next-freq').click();
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
            <div id="palindrome-section-1" style="margin-bottom:8px;padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);">
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
            section1.style.cssText = 'margin-bottom:8px;padding:16px;background:var(--bg2);border-radius:12px;border:1px solid var(--border);border-left:4px solid var(--accent);';
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
            ${self._createStepDesc('-1')}
            <div class="sim-card" style="padding:24px;">
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">알파벳만 남긴 문자열</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-cleaned-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">뒤집은 문자열</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-reversed-boxes-1" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">비교 상태</div>
                    <div id="str-status-1" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
                <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 비교 중</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 일치</span>
                </div>
            </div>
            ${self._createStepControls('-1')}
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
            description: '특수문자 제거 → "' + cleaned + '"',
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
            description: '뒤집기 → "' + reversed + '" (공간 O(n))',
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
        for (let i = 0; i < cleaned.length; i++) {
            let idx = i;
            let match = cleaned[idx] === reversed[idx];
            if (!match) isPalin = false;
            steps.push({
                description: match
                    ? '\'' + cleaned[idx] + '\' == \'' + reversed[idx] + '\' → 일치! ✓'
                    : '\'' + cleaned[idx] + '\' != \'' + reversed[idx] + '\' → 불일치! ✗',
                _before: null,
                action: function() {
                    this._before = saveState();
                    cleanedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                        if (j < idx) b.className = 'str-char-box matched';
                        else if (j === idx) b.className = 'str-char-box comparing';
                        else b.className = 'str-char-box';
                    });
                    reversedBoxes.querySelectorAll('.str-char-box').forEach(function(b, j) {
                        if (j < idx) b.className = 'str-char-box matched';
                        else if (j === idx) b.className = 'str-char-box comparing';
                        else b.className = 'str-char-box';
                    });
                    statusEl.innerHTML = match
                        ? '<span style="color:var(--green);">\'' + cleaned[idx] + "' == '" + reversed[idx] + "' ✓</span>"
                        : '<span style="color:#e17055;">\'' + cleaned[idx] + "' != '" + reversed[idx] + "' ✗</span>";
                },
                undo: function() { restoreState(this._before); }
            });
            if (!match) break;
        }

        // 최종 결과
        var finalIsPalin = isPalin;
        steps.push({
            description: finalIsPalin ? '팰린드롬! 모두 일치 🎉' : '팰린드롬 아님! 불일치 발견 ✗',
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
            ${self._createStepDesc('-2')}
            <div class="sim-card" style="padding:24px;">
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">알파벳만 남긴 문자열</div>
                    <div class="graph-svg-container" style="min-height:60px;display:flex;align-items:center;justify-content:center;padding:16px;">
                        <div id="str-char-boxes-2" style="display:flex;gap:3px;flex-wrap:wrap;justify-content:center;"></div>
                    </div>
                </div>
                <div style="width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">비교 상태</div>
                    <div id="str-status-2" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
                <div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);margin-top:12px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 대기</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> L / R 포인터</span>
                    <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 일치 확인</span>
                </div>
            </div>
            ${self._createStepControls('-2')}
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
                        ? '\'' + cleaned[l] + '\' == \'' + cleaned[r] + '\' → 일치! 안쪽으로'
                        : '\'' + cleaned[l] + '\' != \'' + cleaned[r] + '\' → 불일치!',
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
            description: isPalin ? '팰린드롬! 모든 쌍 일치 🎉' : '팰린드롬 아님! 불일치 발견 ✗',
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
        self._clearVizState();
        const DEFAULT_WORDS = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">단어들: <input type="text" id="ag-input" value="eat, tea, tan, ate, nat, bat" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="viz-input-reset" id="ag-reset" title="입력 변경 후 다시 시작">🔄</button></div>' +
            self._createStepDesc() +
            '<div class="sim-card" style="padding:24px;">' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">단어 목록</div>' +
            '<div class="graph-svg-container" style="min-height:50px;display:flex;align-items:center;justify-content:center;padding:16px;gap:8px;flex-wrap:wrap;" id="ag-words"></div></div>' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 처리</div>' +
            '<div id="ag-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div></div>' +
            '<div style="margin-bottom:16px;width:100%;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">그룹 (정렬 키 → 단어들)</div>' +
            '<div id="ag-groups" style="display:flex;flex-direction:column;gap:10px;min-height:60px;"></div></div>' +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--bg);border-radius:10px;border:1px solid var(--border);flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);vertical-align:middle;"></span> 현재 처리 중</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--green);vertical-align:middle;"></span> 처리 완료</span></div>' +
            '</div>' +
            self._createStepControls();

        var wordsEl = container.querySelector('#ag-words');
        var statusEl = container.querySelector('#ag-status');
        var groupsEl = container.querySelector('#ag-groups');
        var groupColors = ['var(--accent)', 'var(--green)', 'var(--yellow)', '#e17055', '#00cec9', '#fd79a8'];

        function renderWords(words) {
            wordsEl.innerHTML = '';
            words.forEach(function(w, i) {
                var span = document.createElement('span');
                span.className = 'str-char-box';
                span.dataset.widx = i;
                span.style.cssText = 'padding:6px 14px;font-size:1rem;';
                span.innerHTML = '<div class="str-char-val">' + w + '</div>';
                wordsEl.appendChild(span);
            });
        }

        function renderGroups(groups) {
            groupsEl.innerHTML = '';
            var colorIdx = 0;
            for (var key in groups) {
                var vals = groups[key];
                var color = groupColors[colorIdx % groupColors.length];
                var div = document.createElement('div');
                div.className = 'graph-queue-display';
                div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;flex-wrap:wrap;border-left:4px solid ' + color + ';';
                div.innerHTML = '<span style="font-weight:700;color:' + color + ';min-width:50px;">"' + key + '"</span>' +
                    '<span style="color:var(--text2);">→</span>' +
                    vals.map(function(v) { return '<span class="graph-queue-item">' + v + '</span>'; }).join('');
                groupsEl.appendChild(div);
                colorIdx++;
            }
        }

        function saveState() {
            return {
                words: Array.from(wordsEl.querySelectorAll('[data-widx]')).map(function(w) { return w.className; }),
                status: statusEl.innerHTML,
                groups: groupsEl.innerHTML
            };
        }
        function restoreState(s) {
            wordsEl.querySelectorAll('[data-widx]').forEach(function(w, i) { w.className = s.words[i]; });
            statusEl.innerHTML = s.status;
            groupsEl.innerHTML = s.groups;
        }

        function buildSteps() {
            var input = container.querySelector('#ag-input').value;
            var words = input.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (words.length < 1) words = DEFAULT_WORDS.slice();
            renderWords(words);
            statusEl.innerHTML = '—';
            groupsEl.innerHTML = '';

            var steps = [];
            var groups = {};
            var buildGroups = {};

            // Step 0: 초기 상태
            steps.push({
                description: words.length + '개 단어를 애너그램끼리 그룹으로 묶어봐요!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    statusEl.innerHTML = '단어 ' + words.length + '개 준비 완료!';
                },
                undo: function() { restoreState(this._before); }
            });

            words.forEach(function(word, i) {
                var sorted = word.split('').sort().join('');
                var isNew = !buildGroups[sorted];
                if (!buildGroups[sorted]) buildGroups[sorted] = [];
                buildGroups[sorted].push(word);

                // 정렬 과정 보여주기
                var _sorted = sorted, _isNew = isNew, _word = word, _i = i;
                var _groupSnap = {};
                for (var k in buildGroups) _groupSnap[k] = buildGroups[k].slice();

                steps.push({
                    description: '"' + _word + '" → 글자를 정렬하면 "' + _sorted + '". 애너그램은 같은 글자로 이루어져 있으므로 정렬 결과가 같습니다! → ' + (_isNew ? '이 정렬 결과는 처음이므로 새 그룹 생성!' : '같은 정렬 결과가 있으므로 기존 그룹에 추가!'),
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        var wordEls = wordsEl.querySelectorAll('[data-widx]');
                        wordEls.forEach(function(w, j) {
                            if (j < _i) { w.className = 'str-char-box matched'; }
                            else if (j === _i) { w.className = 'str-char-box comparing'; }
                            else { w.className = 'str-char-box'; }
                            w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                        });
                        if (!groups[_sorted]) groups[_sorted] = [];
                        groups[_sorted].push(_word);
                        renderGroups(groups);
                        statusEl.innerHTML = '"<strong>' + _word + '</strong>" → sorted → "<strong>' + _sorted + '</strong>" → ' +
                            (_isNew ? '<span style="color:var(--accent);">새 그룹!</span>' : '<span style="color:var(--green);">기존 그룹에 추가!</span>');
                    },
                    undo: function() {
                        groups[_sorted].pop();
                        if (groups[_sorted].length === 0) delete groups[_sorted];
                        restoreState(this._before);
                    }
                });
            });

            // 최종 완료 스텝
            var totalGroups = {};
            words.forEach(function(w) { var k = w.split('').sort().join(''); if (!totalGroups[k]) totalGroups[k] = []; totalGroups[k].push(w); });
            var _totalCount = Object.keys(totalGroups).length;

            steps.push({
                description: '✅ 완료! ' + _totalCount + '개 그룹으로 분류!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    wordsEl.querySelectorAll('[data-widx]').forEach(function(w) {
                        w.className = 'str-char-box matched';
                        w.style.cssText = 'padding:6px 14px;font-size:1rem;';
                    });
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;"><strong>✅ 완료!</strong> ' + _totalCount + '개 그룹</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 리셋 버튼
        container.querySelector('#ag-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderWords(DEFAULT_WORDS);
            statusEl.innerHTML = '—';
            groupsEl.innerHTML = '';
            self._initStepController(container, buildSteps);
        });

        renderWords(DEFAULT_WORDS);
        self._initStepController(container, buildSteps);
    },

    // ===== 문자열 재구성 시각화 =====
    _renderVizReconstruct(container) {
        const self = this;
        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">입력 문자열:
                    <input type="text" id="str-viz-input" value="ABACABA"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;text-transform:uppercase;">
                </label>
                <button class="btn btn-primary" id="str-viz-start">시작</button>
            </div>
            ${self._createStepDesc()}
            <div class="sim-card" style="padding:24px;">
                <div style="display:flex;flex-direction:column;align-items:center;gap:16px;width:100%;">
                    <div id="str-char-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                </div>
                <div style="display:flex;gap:24px;margin-top:16px;flex-wrap:wrap;width:100%;">
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
                <div style="margin-top:16px;width:100%;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                    <div id="str-status" class="graph-queue-display" style="min-height:50px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);padding:12px;">—</div>
                </div>
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
                description: `빈도수 세기 → ${Object.entries(count).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `${k}:${v}`).join(', ')}`,
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
                    ? `홀수 ${oddChars.length}개 → 가능! ✓`
                    : `홀수 ${oddChars.length}개 → 불가능! ✗`,
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
                    description: `"${half}"${mid ? ` + "${mid}"` : ''} + "${revHalf}" 조립!`,
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
                    description: `완료! "${result}" 🎉`,
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

    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        const inlineClass = s ? ' viz-inline' : '';
        return `
            <div class="viz-step-controls${inlineClass}">
                <button class="btn viz-step-btn" id="viz-prev${s}" disabled>&larr; 이전</button>
                <span id="viz-step-counter${s}" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next${s}">다음 &rarr;</button>
            </div>
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
                desc.innerHTML = '<span>' + steps[currentStep].description + '</span>';
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (currentStep >= steps.length - 1) return;
            currentStep++;
            updateUI();
            setTimeout(() => { steps[currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (currentStep < 0) return;
            var stepToUndo = currentStep;
            currentStep--;
            updateUI();
            setTimeout(() => { steps[stepToUndo].undo(); }, actionDelay);
        });

        updateUI();
    },

    _initStepController(el, stepsOrFn) {
        const state = this._vizState;
        state.steps = typeof stepsOrFn === 'function' ? stepsOrFn() : stepsOrFn;
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
                desc.innerHTML = '<span>' + state.steps[idx].description + '</span>';
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => { state.steps[stepToUndo].undo(); }, actionDelay);
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
            id: 'boj-10809',
            title: 'BOJ 10809 - 알파벳 찾기',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10809',
            simIntro: '문자열을 한 글자씩 순회하면서 각 알파벳의 첫 등장 위치를 기록하는 과정을 확인해보세요!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>알파벳 소문자로만 이루어진 단어 S가 주어진다. 각각의 알파벳에 대해서, 단어에 포함되어 있는 경우에는 <strong>처음 등장하는 위치</strong>를, 포함되어 있지 않은 경우에는 <strong>-1</strong>을 출력하는 프로그램을 작성하시오.</p>

                <h4>입력</h4>
                <p>첫째 줄에 단어 S가 주어진다. 단어의 길이는 100을 넘지 않으며, 알파벳 소문자로만 이루어져 있다.</p>

                <h4>출력</h4>
                <p>각각의 알파벳에 대해서, a가 처음 등장하는 위치, b가 처음 등장하는 위치, … z가 처음 등장하는 위치를 공백으로 구분해서 출력한다.</p>
                <p>만약, 어떤 알파벳이 단어에 포함되어 있지 않다면 -1을 출력한다. 단어의 첫 번째 글자는 0번째 위치이고, 두 번째 글자는 1번째 위치이다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>baekjoon</pre></div>
                    <div><strong>출력</strong><pre>1 0 -1 -1 2 -1 -1 -1 -1 4 3 -1 -1 7 5 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1 -1</pre></div>
                </div>
                <p class="example-explain">b→0, a→1, e→2, k→3, j→4, o→5, n→7 위치에 처음 등장. 나머지 알파벳은 -1</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>단어의 길이는 1 이상 100 이하</li>
                    <li>알파벳 소문자로만 이루어져 있음</li>
                </ul>
            `,
            hints: [
                {
                    title: '문제를 쉽게 이해해보자',
                    content: '"baekjoon"에서 a는 몇 번째에 <strong>처음</strong> 나올까?<br>b→0번, a→1번, e→2번… 이렇게 26개 알파벳 각각의 <strong>첫 등장 위치</strong>를 찾는 문제예요!<br>문자열에 없는 알파벳은 <code>-1</code>로 출력합니다.'
                },
                {
                    title: '크기 26인 배열을 만들자!',
                    content: '알파벳은 a~z 총 <strong>26개</strong>니까, 크기 26인 배열을 <code>-1</code>로 채워서 시작해요.<br><span class="lang-py">Python: <code>result = [-1] * 26</code></span><span class="lang-cpp">C++: <code>int result[26]; fill(result, result+26, -1);</code></span><br><br>a→0번 칸, b→1번 칸, … z→25번 칸으로 매핑하면 돼요!'
                },
                {
                    title: '문자를 숫자로 바꾸는 법',
                    content: '알파벳을 배열 인덱스로 바꾸려면?<br><span class="lang-py">Python: <code>ord(\'a\') - ord(\'a\') = 0</code>, <code>ord(\'b\') - ord(\'a\') = 1</code></span><span class="lang-cpp">C++: <code>\'a\' - \'a\' = 0</code>, <code>\'b\' - \'a\' = 1</code> (char 자체가 숫자!)</span><div style="display:flex;align-items:end;gap:6px;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;flex-wrap:wrap;"><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">a</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">0</div></div><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">b</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">1</div></div><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">c</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">2</div></div><div style="color:var(--text3);font-size:1.2em;padding:0 4px;">...</div><div style="text-align:center;"><div style="background:#00b894;color:white;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">z</div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">25</div></div></div>이렇게 하면 어떤 알파벳이든 0~25 사이의 인덱스로 변환할 수 있어요.'
                },
                {
                    title: '핵심: "처음"만 기록하기',
                    content: '문자열을 앞에서부터 순회하면서:<br>1. 현재 글자의 인덱스를 계산 (<code>ch - \'a\'</code>)<br>2. <code>result[인덱스]</code>가 <code>-1</code>이면? → <strong>처음 등장!</strong> 현재 위치를 기록<br>3. <code>-1</code>이 아니면? → 이미 기록됨, <strong>건너뛰기</strong><br><br>이 조건 하나면 "처음 등장하는 위치"만 정확히 기록할 수 있어요!'
                }
            ],
            solutions: [
                {
                    approach: '배열 순회',
                    description: '크기 26 배열을 -1로 초기화하고, 문자열을 순회하며 첫 등장 위치만 기록한다',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `s = input()
result = [-1] * 26  # a~z 26칸, 모두 -1로 시작

for i in range(len(s)):
    idx = ord(s[i]) - ord('a')  # 알파벳 → 배열 인덱스
    if result[idx] == -1:        # 처음 등장하는 경우에만 기록
        result[idx] = i

print(' '.join(map(str, result)))`,
                        cpp: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    cin >> s;
    int result[26];
    fill(result, result + 26, -1);  // 모두 -1로 초기화

    for (int i = 0; i < s.size(); i++) {
        int idx = s[i] - 'a';  // 알파벳 → 배열 인덱스
        if (result[idx] == -1)  // 처음 등장하는 경우에만 기록
            result[idx] = i;
    }

    for (int i = 0; i < 26; i++)
        cout << result[i] << (i < 25 ? " " : "\\n");
}`
                    }
                },
                {
                    approach: 'find 메서드',
                    description: '각 알파벳에 대해 find()로 첫 등장 위치를 바로 구한다',
                    timeComplexity: 'O(26·n)',
                    spaceComplexity: 'O(1)',
                    templates: {
                        python: `s = input()

# 각 알파벳에 대해 find()로 첫 위치를 구함
# find()는 없으면 -1을 반환 — 딱 우리가 원하는 것!
result = [s.find(chr(i + ord('a'))) for i in range(26)]

print(' '.join(map(str, result)))`,
                        cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;

    for (int i = 0; i < 26; i++) {
        char ch = 'a' + i;
        // find()는 못 찾으면 string::npos 반환
        size_t pos = s.find(ch);
        cout << (pos == string::npos ? -1 : (int)pos);
        if (i < 25) cout << ' ';
    }
    cout << endl;
}`
                    }
                }
            ]
        },
        {
            id: 'boj-1157',
            title: 'BOJ 1157 - 단어 공부',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1157',
            simIntro: '딕셔너리로 글자 빈도를 세는 과정을 확인해보세요! (코드 탭에서는 배열 방식도 볼 수 있어요)',
            descriptionHTML: `
                <h3>문제</h3>
                <p>알파벳 대소문자로 이루어진 단어가 주어집니다.
                이 단어에서 <strong>가장 많이 사용된 알파벳</strong>을 대문자로 출력하세요.
                가장 많이 사용된 알파벳이 여러 개라면 <code>?</code>를 출력합니다.</p>
                <h4>입력</h4>
                <p>알파벳 대소문자로 이루어진 단어가 주어진다. 주어지는 단어의 길이는 1,000,000을 넘지 않는다.</p>
                <h4>출력</h4>
                <p>이 단어에서 가장 많이 사용된 알파벳을 대문자로 출력한다. 단, 가장 많이 사용된 알파벳이 여러 개 존재하는 경우에는 <code>?</code>를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>Mississipi</pre></div>
                    <div><strong>출력</strong><pre>?</pre></div>
                </div>
                <p class="example-explain">I와 S가 각각 4번으로 공동 최다 → <code>?</code> 출력</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>zZa</pre></div>
                    <div><strong>출력</strong><pre>Z</pre></div>
                </div>
                <p class="example-explain">대소문자 무시하면 Z가 2번으로 최다 → 대문자 <code>Z</code> 출력</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>z</pre></div>
                    <div><strong>출력</strong><pre>Z</pre></div>
                </div>
                <p class="example-explain">글자가 하나뿐이므로 대문자로 출력</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>단어의 길이는 1 이상 1,000,000 이하</li>
                    <li>알파벳 대소문자로만 이루어져 있음</li>
                </ul>
            `,
            hints: [
                {
                    title: '문제를 쉽게 이해해보자',
                    content: '<code>"Mississipi"</code>에서 가장 많이 나온 글자는?<br>대소문자를 구분하지 않으니까 먼저 전부 대문자(또는 소문자)로 바꿔야 해요.<br>그 다음 각 글자가 몇 번 나왔는지 세면 됩니다!'
                },
                {
                    title: '글자를 숫자로? — ASCII 코드',
                    content: '컴퓨터는 글자를 <strong>숫자(ASCII 코드)</strong>로 저장해요.<br><code>\'A\' = 65</code>, <code>\'B\' = 66</code>, … <code>\'Z\' = 90</code><br><br><span class="lang-py">Python: <code>ord(\'A\')</code> → 65, <code>chr(65)</code> → \'A\'</span><span class="lang-cpp">C++: <code>(int)\'A\'</code> → 65, <code>(char)65</code> → \'A\' (char 자체가 숫자!)</span><br><br><a href="https://ko.wikipedia.org/wiki/ASCII" target="_blank" style="color: var(--accent); text-decoration: underline; font-size: 0.9em;">📎 ASCII 코드표 전체 보기 →</a>'
                },
                {
                    title: '방법 1: 배열로 세기',
                    content: '알파벳은 A~Z 딱 <strong>26개</strong>니까, 크기 26인 배열을 만들어요.<br><span class="lang-py">Python: <code>count = [0] * 26</code></span><span class="lang-cpp">C++: <code>int count[26] = {0};</code></span><br><br>A를 0번 칸에 넣고 싶으면?<br><code>\'A\' - \'A\' = 65 - 65 = <strong>0</strong></code> ✓<br><code>\'B\' - \'A\' = 66 - 65 = <strong>1</strong></code> ✓<br><code>\'Z\' - \'A\' = 90 - 65 = <strong>25</strong></code> ✓<br><br>그래서 <code>count[c - \'A\'] += 1</code> 이렇게 세는 거예요!'
                },
                {
                    title: '방법 2: 해시맵으로 세기',
                    content: '해시맵을 쓰면 더 직관적이에요!<br><span class="lang-py">Python: <code>freq = {}</code> (딕셔너리)</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, int&gt; freq;</code></span><br><br>글자가 나올 때마다 <code>freq[c] += 1</code>로 카운트!<br>결과: <code>{"M": 1, "I": 4, "S": 4, "P": 1}</code><br>시뮬레이션에서는 이 방법으로 보여줍니다!'
                },
                {
                    title: '최댓값이 여러 개면?',
                    content: '가장 큰 빈도를 찾은 뒤, 그 빈도를 가진 글자가 <strong>2개 이상</strong>이면 <code>?</code>를 출력해요.<div style="display:flex;gap:16px;margin:14px 0;align-items:end;justify-content:center;"><div style="text-align:center;"><div style="background:#6c5ce7;color:white;width:40px;height:80px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">4</div><div style="font-size:0.8rem;margin-top:4px;font-weight:600;">I</div></div><div style="text-align:center;"><div style="background:#e17055;color:white;width:40px;height:80px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">4</div><div style="font-size:0.8rem;margin-top:4px;font-weight:600;">S</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:40px;height:40px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">2</div><div style="font-size:0.8rem;margin-top:4px;">P</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:40px;height:20px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;font-weight:700;font-size:0.85rem;">1</div><div style="font-size:0.8rem;margin-top:4px;">M</div></div></div><div style="text-align:center;color:#e17055;font-weight:700;">I와 S 둘 다 최대(4번) → <code>?</code> 출력!</div>'
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
                cpp: `#include <iostream>
#include <unordered_map>
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
    if c in freq:
        freq[c] += 1
    else:
        freq[c] = 1

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
    print(top[0][0])`,
                        cpp: `#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int main() {
    string word;
    cin >> word;
    // 대문자 변환
    for (char& c : word) c = toupper(c);

    // 빈도 세기 — Counter 대신 unordered_map
    unordered_map<char, int> freq;
    for (char c : word) freq[c]++;

    // 최대 빈도 찾기
    int mx = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt > mx) mx = cnt;

    // 최대 빈도 문자가 2개 이상이면 '?'
    char ans = '?';
    int dup = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt == mx) { ans = ch; dup++; }

    cout << (dup > 1 ? '?' : ans) << endl;
}`
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

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "A man, a plan, a canal: Panama"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">"amanaplanacanalpanama"는 앞뒤가 같은 팰린드롬입니다.</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = "race a car"</pre></div>
                    <div><strong>출력</strong><pre>false</pre></div>
                </div>
                <p class="example-explain">"raceacar"는 뒤집으면 "racaecar"이므로 팰린드롬이 아닙니다.</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>s = " "</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">영숫자를 제거하면 빈 문자열 ""이 되고, 빈 문자열은 팰린드롬입니다.</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ s.length ≤ 2 × 10⁵</li>
                    <li>s는 ASCII 문자로만 이루어져 있습니다.</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>추가 문자열을 만들지 않고 O(1) 공간으로 풀 수 있을까요?</p>
            `,
            hints: [
                {
                    title: '팰린드롬이 뭐야?',
                    content: `앞에서 읽어도, 뒤에서 읽어도 <strong>같은 문자열</strong>이에요!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:16px 0;">
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="font-size:1.3em;">🔄 뒤집으면?</div>
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').reverse().map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="color:#00b894;font-weight:700;">✅ 똑같다! → 팰린드롬!</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin:12px 0;padding:12px;background:rgba(255,118,117,0.08);border-radius:10px;">
                        <div style="display:flex;gap:4px;">
                            ${'hello'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="font-size:1.3em;">🔄 뒤집으면?</div>
                        <div style="display:flex;gap:4px;">
                            ${'olleh'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#636e72;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="color:#e17055;font-weight:700;">❌ 다르다! → 팰린드롬 아님</div>
                    </div>
                    <p style="margin-top:24px;margin-bottom:4px;">근데 <code>"A man, a plan, a canal: Panama"</code>도 팰린드롬이에요.<br>공백, 쉼표, 콜론은 무시하고 대소문자도 구분하지 않거든요!</p>
                    <p style="margin-top:14px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">그럼 이런 문자열은 어떻게 비교하지? 🤔<br>공백이랑 특수문자가 섞여 있으니까 <strong>그냥 뒤집으면 안 맞아요!</strong></p>`
                },
                {
                    title: '먼저 깔끔하게 정리하자!',
                    content: `왜 정리가 필요할까요? <code>"A man, a plan..."</code>을 그대로 뒤집으면 <code>"...nalp a ,nam A"</code>가 돼서 원본이랑 달라요. 공백이랑 쉼표 때문이죠!
                    <p style="margin-top:8px;">그래서 <strong>영문자/숫자만 남기고 나머지는 빼버려요.</strong> 이걸 "전처리"라고 해요.</p>
                    <div style="display:flex;flex-wrap:wrap;gap:3px;margin:14px 0;">
                        ${'A man, a plan, a canal: Panama'.split('').map(c => {
                            const keep = /[a-zA-Z0-9]/.test(c);
                            return `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:32px;border-radius:6px;font-weight:600;font-size:0.95em;${keep ? 'background:#6c5ce7;color:white;' : 'background:#dfe6e9;color:#b2bec3;text-decoration:line-through;'}">${c === ' ' ? '␣' : c}</span>`;
                        }).join('')}
                    </div>
                    <div style="text-align:center;font-size:1.2em;margin:8px 0;">⬇️</div>
                    <div style="display:flex;flex-wrap:wrap;gap:3px;margin:8px 0;">
                        ${'amanaplanacanalpanama'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:32px;background:#00b894;color:white;border-radius:6px;font-weight:600;font-size:0.95em;">${c}</span>`).join('')}
                    </div>
                    <p style="margin-top:10px;"><span class="lang-py">Python: <code>isalnum()</code>으로 영문자/숫자 확인 → <code>lower()</code>로 소문자 통일</span><span class="lang-cpp">C++: <code>isalnum(c)</code>로 확인 → <code>tolower(c)</code>로 소문자 통일</span></p>`
                },
                {
                    title: '가장 쉬운 방법: 뒤집어서 비교!',
                    content: `팰린드롬은 뒤집어도 같으니까, <strong>뒤집어서 원본이랑 같은지 확인</strong>하면 돼요. 가장 직관적이고 쉬운 방법이에요!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="min-width:40px;font-weight:600;text-align:right;">원본</span>
                            <div style="display:flex;gap:2px;">
                                ${'abcba'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div style="font-size:1.1em;">🔄 뒤집기</div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="min-width:40px;font-weight:600;text-align:right;">뒤집기</span>
                            <div style="display:flex;gap:2px;">
                                ${'abcba'.split('').reverse().map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#00b894;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                            </div>
                        </div>
                        <div style="color:#00b894;font-weight:700;">모두 일치 → True! ✅</div>
                    </div>
                    <p style="margin-top:8px;">코딩 테스트에서는 이 방법으로 충분해요! 👍</p>
                    <p style="margin-top:6px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">다만 뒤집은 문자열을 <strong>새로 만들어야</strong> 해서 메모리를 O(n)만큼 써요.<br>문자열이 아주 길면 부담이 될 수 있는데... 더 효율적인 방법이 있을까요?</p>`
                },
                {
                    title: '더 똑똑한 방법: 투 포인터',
                    content: `뒤집기도 좋지만, 새 문자열을 안 만들고도 확인할 수 있어요!<br><strong>양쪽 끝에서 출발</strong>해서 가운데로 좁혀가며 비교하는 거예요.
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:14px 0;padding:16px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;gap:4px;position:relative;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;${i===0||i===6?'background:#6c5ce7;color:white;':'background:#dfe6e9;color:#2d3436;'}border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:4px;width:100%;justify-content:center;">
                            <span style="width:36px;text-align:center;color:#6c5ce7;font-weight:700;">L→</span>
                            <span style="width:180px;"></span>
                            <span style="width:36px;text-align:center;color:#6c5ce7;font-weight:700;">←R</span>
                        </div>
                        <div style="color:#00b894;font-weight:600;">r == r ✓ → 안쪽으로!</div>
                        <div style="display:flex;gap:4px;">
                            ${'racecar'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;${i===1||i===5?'background:#00b894;color:white;':i===0||i===6?'background:#b2bec3;color:white;':'background:#dfe6e9;color:#2d3436;'}border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:4px;width:100%;justify-content:center;">
                            <span style="width:36px;"></span>
                            <span style="width:36px;text-align:center;color:#00b894;font-weight:700;">L→</span>
                            <span style="width:108px;"></span>
                            <span style="width:36px;text-align:center;color:#00b894;font-weight:700;">←R</span>
                            <span style="width:36px;"></span>
                        </div>
                        <div style="color:#00b894;font-weight:600;">a == a ✓ → 계속!</div>
                    </div>
                    <p>① 같으면 → 안쪽으로 이동<br>② 다르면 → 바로 <code>False</code>!<br>③ L ≥ R → 전부 일치 → <code>True</code></p>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">새 문자열을 안 만드니까 <strong>추가 메모리가 거의 안 들어요!</strong> O(1) 공간!<br>면접에서 이 방법을 설명하면 "메모리 효율을 생각하는구나" 하고 좋은 인상을 줄 수 있어요.</p>`
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
};`
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
};`
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
};`
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

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>strs = ["eat","tea","tan","ate","nat","bat"]</pre></div>
                    <div><strong>출력</strong><pre>[["bat"],["nat","tan"],["ate","eat","tea"]]</pre></div>
                </div>
                <p class="example-explain">"eat","tea","ate"는 모두 e,a,t로 이루어진 애너그램</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>strs = [""]</pre></div>
                    <div><strong>출력</strong><pre>[[""]]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>strs = ["a"]</pre></div>
                    <div><strong>출력</strong><pre>[["a"]]</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ strs.length ≤ 10<sup>4</sup></li>
                    <li>0 ≤ strs[i].length ≤ 100</li>
                    <li><code>strs[i]</code>는 영문 소문자로만 이루어져 있습니다.</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>정렬 없이 O(NK) 시간에 풀 수 있을까요?</p>
            `,
            hints: [
                {
                    title: '애너그램이 뭐야?',
                    content: `같은 글자들을 <strong>순서만 바꿔서</strong> 만든 단어예요!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:14px;margin:16px 0;">
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="display:flex;gap:3px;">
                                ${'eat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="font-size:1.3em;">🔄</span>
                            <div style="display:flex;gap:3px;">
                                ${'tea'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="color:#00b894;font-weight:700;">✅ 같은 글자!</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:12px;">
                            <div style="display:flex;gap:3px;">
                                ${'eat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="font-size:1.3em;">vs</span>
                            <div style="display:flex;gap:3px;">
                                ${'bat'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                            </div>
                            <span style="color:#e17055;font-weight:700;">❌ 글자 다름!</span>
                        </div>
                    </div>
                    <p>이 문제는 애너그램끼리 <strong>같은 그룹으로 묶는</strong> 거예요.</p>
                    <p style="margin-top:10px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">근데 단어가 수천 개면... 하나하나 글자를 비교할 순 없잖아요? 🤔<br><strong>같은 애너그램이라는 걸 빠르게 판별하는 방법</strong>이 필요해요!</p>`
                },
                {
                    title: '핵심 아이디어: 글자를 정렬하자!',
                    content: `애너그램은 글자 구성이 같으니까, <strong>알파벳 순으로 정렬하면 결과가 똑같아져요!</strong>
                    <div style="display:flex;flex-direction:column;gap:12px;margin:16px 0;padding:16px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"eat"</code><span>→ 정렬 →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"tea"</code><span>→ 정렬 →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#00b894;font-weight:700;">← 같다!</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"ate"</code><span>→ 정렬 →</span>
                            <div style="display:flex;gap:2px;">${'aet'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#00b894;font-weight:700;">← 같다!</span>
                        </div>
                        <div style="border-top:1px dashed #ccc;padding-top:10px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <code style="min-width:50px;">"bat"</code><span>→ 정렬 →</span>
                            <div style="display:flex;gap:2px;">${'abt'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;background:#e17055;color:white;border-radius:6px;font-weight:700;">${c}</span>`).join('')}</div>
                            <span style="color:#e17055;font-weight:700;">← 다름!</span>
                        </div>
                    </div>
                    <p><strong>정렬 결과가 같으면 = 같은 애너그램!</strong> 이걸 "키(key)"로 쓸 수 있어요.</p>`
                },
                {
                    title: '딕셔너리에 그룹으로 모아!',
                    content: `정렬한 결과를 <strong>키(key)</strong>로, 원본 단어를 <strong>리스트에 추가</strong>하면 자동으로 그룹이 만들어져요!
                    <div style="margin:16px 0;padding:16px;background:var(--bg2);border-radius:12px;font-family:'Fira Code',monospace;font-size:0.9em;line-height:2;">
                        <div><span style="color:#e17055;">"eat"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>]</div>
                        <div><span style="color:#e17055;">"tea"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>, <span style="color:#e17055;">"tea"</span>]</div>
                        <div><span style="color:#00b894;">"tan"</span> → key=<span style="color:#00b894;font-weight:700;">"ant"</span> → groups[<span style="color:#00b894;">"ant"</span>] = [<span style="color:#00b894;">"tan"</span>]</div>
                        <div><span style="color:#e17055;">"ate"</span> → key=<span style="color:#6c5ce7;font-weight:700;">"aet"</span> → groups[<span style="color:#6c5ce7;">"aet"</span>] = [<span style="color:#e17055;">"eat"</span>, <span style="color:#e17055;">"tea"</span>, <span style="color:#e17055;">"ate"</span>]</div>
                        <div>...</div>
                    </div>
                    <p style="margin-top:8px;"><span class="lang-py">Python: <code>defaultdict(list)</code>로 자동 빈 리스트 생성</span><span class="lang-cpp">C++: <code>unordered_map&lt;string, vector&lt;string&gt;&gt;</code>로 같은 패턴 구현</span></p>
                    <p style="margin-top:10px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">✅ 마지막에 <code>groups.values()</code>를 반환하면 끝! 핵심 로직이 딱 3줄이에요.</p>`
                },
                {
                    title: '정렬 말고 다른 방법도 있을까?',
                    content: `앞에서 배운 <strong>정렬 키</strong> 방법이면 충분히 풀 수 있어요! 실전에서는 이걸 쓰면 됩니다. 👍
                    <p style="margin-top:10px;">그런데 면접에서 <em>"정렬보다 더 빠른 방법이 있을까요?"</em>라고 물어볼 수 있어요.</p>
                    <p>아이디어는 이래요: 정렬 대신 <strong>각 글자가 몇 번 나오는지</strong>를 세서 그걸 키로 쓰는 거예요.</p>
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:12px;">
                        <div style="display:flex;flex-direction:column;gap:6px;">
                            <div><code>"eat"</code> → a가 1번, e가 1번, t가 1번 → <code>(1,0,0,0,1,...,0,0,1,0,0)</code></div>
                            <div><code>"tea"</code> → a가 1번, e가 1번, t가 1번 → <code>(1,0,0,0,1,...,0,0,1,0,0)</code></div>
                        </div>
                        <p style="margin:8px 0 0;font-size:0.9em;">글자 구성이 같으니까 빈도수도 똑같아요 → 같은 키! 정렬 안 해도 됩니다.</p>
                    </div>
                    <p style="margin-top:10px;">솔직히 이 방법은 <strong>정렬보다 구현이 더 복잡하고 떠올리기도 어려워요.</strong><br>
                    하지만 이론적으로 정렬이 O(K log K)인데, 빈도수를 세는 건 O(K)라서 더 빨라요.</p>
                    <div style="margin-top:14px;padding:14px;background:rgba(0,184,148,0.08);border:1px solid rgba(0,184,148,0.15);border-radius:10px;">
                        <div style="font-weight:700;margin-bottom:6px;">💡 결론</div>
                        <div style="font-size:0.9em;color:var(--text-body);">
                            ✅ <strong>코딩테스트</strong>: <code>sorted()</code>를 키로 쓰세요. 3줄이면 끝!<br>
                            ✅ <strong>면접</strong>: "빈도수로도 가능합니다"를 언급하면 어필 가능<br>
                            ⚠️ 빈도수 키는 <strong>알파벳만 쓸 때</strong> (26칸 배열) 잘 먹혀요. 유니코드면 오히려 정렬이 나아요.
                        </div>
                    </div>`
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
};`
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
};`
                    }
                }
            ]
        },
        {
            id: 'boj-1213',
            title: 'BOJ 1213 - 팰린드롬 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1213',
            simIntro: '딕셔너리로 빈도를 세고, 절반씩 배치하는 과정을 확인해보세요! (코드 탭에서는 배열 방식도 볼 수 있어요)',
            descriptionHTML: `
                <h3>문제</h3>
                <p>영어 대문자로만 이루어진 이름이 주어집니다.
                이 이름의 글자들을 재배열해서 <strong>팰린드롬</strong>을 만드세요.
                가능한 팰린드롬 중 사전순으로 가장 앞서는 것을 출력합니다.</p>
                <p>팰린드롬을 만들 수 없으면 <code>I'm Sorry Hansoo</code>를 출력합니다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 임한수의 영어 이름이 있다. 알파벳 대문자로만 이루어져 있으며, 길이는 최대 50이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 이름의 글자들을 재배열해서 만들 수 있는 팰린드롬을 출력한다. 만들 수 있는 팰린드롬이 여러 개일 경우 사전순으로 앞서는 것을 출력한다. 만약 팰린드롬을 만들 수 없을 때에는 "I'm Sorry Hansoo"를 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>AABB</pre></div>
                    <div><strong>출력</strong><pre>ABBA</pre></div>
                </div>
                <p class="example-explain">A:2, B:2 → 절반 "AB" + 뒤집기 "BA" = "ABBA"</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>AAABB</pre></div>
                    <div><strong>출력</strong><pre>ABABA</pre></div>
                </div>
                <p class="example-explain">A:3, B:2 → 절반 "AB" + 가운데 "A" + 뒤집기 "BA" = "ABABA"</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>ABACABA</pre></div>
                    <div><strong>출력</strong><pre>AABCBAA</pre></div>
                </div>
                <p class="example-explain">A:4, B:2, C:1 → 절반 "AAB" + 가운데 "C" + 뒤집기 "BAA"</p>
                </div>

                <div class="problem-example"><h4>예제 4</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>ABC</pre></div>
                    <div><strong>출력</strong><pre>I'm Sorry Hansoo</pre></div>
                </div>
                <p class="example-explain">A:1, B:1, C:1 — 홀수 개인 문자가 3개이므로 불가능</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>이름은 영어 대문자로만 이루어져 있습니다.</li>
                    <li>1 ≤ 이름의 길이 ≤ 50</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>홀수 번 나오는 글자의 개수를 먼저 세서 불가능 여부를 빠르게 판단할 수 있을까요?</p>
            `,
            hints: [
                {
                    title: '팰린드롬이 되려면?',
                    content: `팰린드롬을 만들라고 하니까, 먼저 <strong>팰린드롬이 뭔지</strong> 다시 생각해봐요. 앞뒤로 읽어도 같은 문자열이죠!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;gap:4px;">
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">A</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">B</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#fdcb6e;color:#2d3436;border-radius:8px;font-weight:700;font-size:1.2em;">C</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#00b894;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">B</span>
                            <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:1.2em;">A</span>
                        </div>
                        <div style="display:flex;gap:4px;font-size:0.8em;color:var(--text-secondary);">
                            <span style="width:40px;text-align:center;">←</span>
                            <span style="width:40px;text-align:center;">←</span>
                            <span style="width:40px;text-align:center;">가운데</span>
                            <span style="width:40px;text-align:center;">→</span>
                            <span style="width:40px;text-align:center;">→</span>
                        </div>
                        <div style="color:#6c5ce7;font-weight:600;">🪞 가운데를 기준으로 거울처럼 대칭!</div>
                    </div>
                    <p>거울처럼 대칭이니까, 각 글자가 <strong>양쪽에 똑같이</strong> 있어야 해요. 그래서:</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:8px 0;">
                        <div style="background:rgba(0,184,148,0.1);border:1px solid rgba(0,184,148,0.3);border-radius:10px;padding:12px;text-align:center;">
                            <div style="font-weight:700;color:#00b894;">짝수 번 나온 글자</div>
                            <div style="font-size:0.9em;margin-top:4px;">반반 나눠서 양쪽에 배치 ✅</div>
                        </div>
                        <div style="background:rgba(253,203,110,0.15);border:1px solid rgba(253,203,110,0.4);border-radius:10px;padding:12px;text-align:center;">
                            <div style="font-weight:700;color:#e17055;">홀수 번 나온 글자</div>
                            <div style="font-size:0.9em;margin-top:4px;">1개 남으니까 가운데에!</div>
                        </div>
                    </div>
                    <p style="padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">홀수인 글자가 <strong>2개 이상</strong>이면? 가운데 자리는 1개뿐이니까 팰린드롬을 만들 수 없어요! → <code>"I'm Sorry Hansoo"</code></p>`
                },
                {
                    title: '빈도수를 세자 (배열 or 딕셔너리)',
                    content: `그럼 각 글자가 짝수 번인지 홀수 번인지 어떻게 알까요? <strong>각 글자가 몇 번 나오는지 세면</strong> 돼요!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;">
                        <div style="font-weight:600;margin-bottom:8px;">예: "ABACABA"</div>
                        <div style="display:flex;gap:4px;margin-bottom:10px;">
                            ${'ABACABA'.split('').map(c => `<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:${c==='A'?'#6c5ce7':c==='B'?'#00b894':'#fdcb6e'};color:${c==='C'?'#2d3436':'white'};border-radius:6px;font-weight:700;">${c}</span>`).join('')}
                        </div>
                        <div style="display:flex;gap:16px;flex-wrap:wrap;">
                            <div><span style="display:inline-block;width:24px;height:24px;background:#6c5ce7;border-radius:4px;vertical-align:middle;"></span> A: <strong>4</strong>번 (짝수 ✅)</div>
                            <div><span style="display:inline-block;width:24px;height:24px;background:#00b894;border-radius:4px;vertical-align:middle;"></span> B: <strong>2</strong>번 (짝수 ✅)</div>
                            <div><span style="display:inline-block;width:24px;height:24px;background:#fdcb6e;border-radius:4px;vertical-align:middle;"></span> C: <strong>1</strong>번 (홀수 → 가운데!)</div>
                        </div>
                    </div>
                    <p style="margin-top:10px;">세는 방법은 두 가지가 있어요:</p>
                    <strong>배열</strong>: 알파벳이 26개니까 크기 26 배열로 <code>count[c - 'A'] += 1</code><br>
                    <strong>해시맵</strong>: <span class="lang-py">Python <code>dict</code></span><span class="lang-cpp">C++ <code>unordered_map</code></span>으로 글자를 키로 바로 세기<br>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;font-size:0.92em;">어떤 걸 쓰든 결과는 같아요. 배열이 더 빠르고, 딕셔너리가 더 읽기 쉬워요!</p>
                    <a href="https://ko.wikipedia.org/wiki/ASCII" target="_blank" style="color: var(--accent); text-decoration: underline; font-size: 0.9em;">📎 ASCII 코드표 보기 →</a>`
                },
                {
                    title: '절반씩 배치하기',
                    content: `빈도수를 세서 가능하다는 걸 알았으면, 이제 <strong>실제로 팰린드롬을 만들어볼</strong> 차례예요! 어떻게 배치할까요?
                    <div style="margin:10px 0;">
                        <div style="font-weight:600;margin-bottom:10px;">예: A:4, B:2, C:1</div>
                        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin:12px 0;">
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">왼쪽 절반</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">A×(4÷2) + B×(2÷2)</div>
                            </div>
                            <span style="font-size:1.5em;color:var(--text-secondary);">+</span>
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">가운데</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#fdcb6e;color:#2d3436;border-radius:6px;font-weight:700;">C</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">홀수 1개</div>
                            </div>
                            <span style="font-size:1.5em;color:var(--text-secondary);">+</span>
                            <div style="text-align:center;">
                                <div style="font-size:0.8em;color:var(--text-secondary);margin-bottom:4px;">🔄 뒤집기</div>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                </div>
                                <div style="font-size:0.75em;color:var(--text-secondary);margin-top:2px;">왼쪽의 역순</div>
                            </div>
                        </div>
                        <div style="text-align:center;font-size:1.2em;margin:8px 0;">⬇️</div>
                        <div style="display:flex;justify-content:center;gap:3px;">
                            ${'AABCBAA'.split('').map((c,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:${c==='A'?'#6c5ce7':c==='B'?'#00b894':'#fdcb6e'};color:${c==='C'?'#2d3436':'white'};border-radius:8px;font-weight:700;font-size:1.1em;">${c}</span>`).join('')}
                        </div>
                        <div style="text-align:center;color:#00b894;font-weight:700;margin-top:8px;">AABCBAA 완성! 🎉</div>
                    </div>
                    <p style="padding:10px 14px;background:var(--bg2);border-radius:8px;font-size:0.92em;">정리하면: <strong>왼쪽 절반</strong>을 만들고 + 홀수 글자가 있으면 <strong>가운데</strong>에 넣고 + 왼쪽을 <strong>뒤집어서</strong> 오른쪽에 붙이면 끝!</p>`
                },
                {
                    title: '사전순으로 만들려면?',
                    content: `팰린드롬이 여러 개 가능할 수 있어요. 예를 들어 "AABB"로 ABBA도 되고 BAAB도 되죠. 문제에서는 <strong>사전순으로 가장 앞서는 것</strong>을 원하니까, 왼쪽 절반을 <strong>ABC 순서</strong>로 만들면 자동으로 사전순이 돼요!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;">
                        <div style="font-weight:600;margin-bottom:10px;">예: "AABB" → 빈도 A:2, B:2</div>
                        <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:var(--text-secondary);">절반</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                </div>
                                <span style="font-size:0.85em;color:var(--text-secondary);">← A부터!</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:var(--text-secondary);">뒤집기</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:6px;font-weight:700;">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:6px;font-weight:700;">A</span>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:0.85em;min-width:50px;text-align:right;color:#00b894;font-weight:700;">결과</span>
                                <div style="display:flex;gap:3px;">
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(108,92,231,0.3);">A</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(0,184,148,0.3);">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#00b894;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(0,184,148,0.3);">B</span>
                                    <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;box-shadow:0 2px 8px rgba(108,92,231,0.3);">A</span>
                                </div>
                                <span style="font-size:1.1em;">🎉</span>
                            </div>
                        </div>
                    </div>`
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
                cpp: `#include <iostream>
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
    print(half + mid + half[::-1])`,
                        cpp: `#include <iostream>
#include <string>
#include <map>
#include <algorithm>
using namespace std;

int main() {
    string name;
    cin >> name;

    // 빈도 세기 — map은 키 자동 정렬
    map<char, int> freq;
    for (char c : name) freq[c]++;

    // 홀수 빈도 문자가 2개 이상이면 팰린드롬 불가
    int oddCnt = 0;
    for (auto& [ch, cnt] : freq)
        if (cnt % 2 != 0) oddCnt++;

    if (oddCnt > 1) {
        cout << "I'm Sorry Hansoo" << endl;
    } else {
        string half = "", mid = "";
        for (auto& [ch, cnt] : freq) {
            if (cnt % 2 == 1) mid = ch;
            half += string(cnt / 2, ch); // 절반만 모으기
        }
        string rev = half;
        reverse(rev.begin(), rev.end());
        cout << half + mid + rev << endl;
    }
}`
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
    function findProb(id) { return p.find(function(x) { return x.id === id; }); }

    // ── boj-10809 배열 순회 ──
    findProb('boj-10809').solutions[0].codeSteps = {
        python: [
            { title: '입력 받기', desc: '알파벳 소문자로 이루어진 단어를 입력받습니다.', code: 's = input()' },
            { title: '결과 배열 초기화', desc: '26개 알파벳(a~z)의 첫 등장 위치를 저장할 배열.\n처음엔 모두 -1 → "아직 안 나왔다"는 뜻!', code: 'result = [-1] * 26  # a~z 각각의 첫 위치' },
            { title: '문자열 순회 + 기록', desc: '핵심: 각 문자를 0~25 인덱스로 변환!\nord(\'a\') - ord(\'a\') = 0, ord(\'b\') - ord(\'a\') = 1, ...\n-1인 경우에만 기록 → "처음 등장"만 저장.', code: 'for i in range(len(s)):\n    idx = ord(s[i]) - ord(\'a\')  # 알파벳 → 0~25 인덱스\n    if result[idx] == -1:        # 처음 등장하는 경우에만\n        result[idx] = i          # 현재 위치를 기록' },
            { title: '출력', desc: '26개 값을 공백으로 구분하여 출력합니다.\nmap(str, result) → 숫자 리스트를 문자열로 변환.', code: 'print(\' \'.join(map(str, result)))' }
        ],
        cpp: [
            { title: '입력 + 배열 초기화', desc: '문자열 입력 후 크기 26 배열을 -1로 채웁니다.\nfill()로 배열 전체를 한번에 초기화!', code: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int result[26];\n    fill(result, result + 26, -1);  // 모두 -1로 초기화' },
            { title: '문자열 순회 + 기록', desc: 'C++에서는 char 자체가 숫자!\ns[i] - \'a\' → 0~25 인덱스 변환.\n-1일 때만 기록 → 첫 등장 위치만 저장.', code: '    for (int i = 0; i < s.size(); i++) {\n        int idx = s[i] - \'a\';      // 알파벳 → 0~25 인덱스\n        if (result[idx] == -1)      // 처음 등장하는 경우에만\n            result[idx] = i;        // 현재 위치를 기록\n    }' },
            { title: '출력', desc: '26개 값을 공백으로 구분하여 출력합니다.', code: '    for (int i = 0; i < 26; i++)\n        cout << result[i] << (i < 25 ? " " : "\\n");\n}' }
        ]
    };

    // ── boj-10809 find 메서드 ──
    findProb('boj-10809').solutions[1].codeSteps = {
        python: [
            { title: 'find() 메서드란?', desc: 'Python의 str.find(ch)는 문자열에서 ch의\n첫 등장 위치를 반환합니다.\n없으면 -1 반환 → 딱 우리가 원하는 것!', code: 's = input()' },
            { title: 'a~z 각각 find()', desc: '리스트 컴프리헨션으로 26개 알파벳 한번에 처리!\nchr(i + ord(\'a\')) → 0→\'a\', 1→\'b\', ..., 25→\'z\'', code: '# 각 알파벳에 대해 find()로 첫 위치를 구함\nresult = [s.find(chr(i + ord(\'a\'))) for i in range(26)]' },
            { title: '출력', desc: '결과 출력. find()가 -1을 반환하므로 별도 처리 불필요!', code: 'print(\' \'.join(map(str, result)))' }
        ],
        cpp: [
            { title: 'string::find()란?', desc: 'C++의 string::find(ch)는 문자의\n첫 등장 위치를 반환합니다.\n없으면 string::npos(매우 큰 수) 반환.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: 'a~z 각각 find()', desc: '각 알파벳에 대해 find()로 첫 위치를 구합니다.\nnpos면 -1로 변환하여 출력합니다.', code: '    for (int i = 0; i < 26; i++) {\n        char ch = \'a\' + i;\n        size_t pos = s.find(ch);\n        cout << (pos == string::npos ? -1 : (int)pos);\n        if (i < 25) cout << \' \';\n    }\n    cout << endl;\n}' }
        ]
    };

    // ── boj-1157 배열 카운팅 ──
    findProb('boj-1157').solutions[0].codeSteps = {
        python: [
            { title: '입력 + 대문자 변환', desc: '대소문자 구분 없이 세야 하므로 upper()로 통일.\n"Mississipi" → "MISSISSIPI"', code: 'word = input().upper()  # 대소문자 통일' },
            { title: '빈도 배열 카운팅', desc: '핵심: 크기 26 배열로 알파벳 빈도를 셉니다.\nord(c) - ord(\'A\') → A=0, B=1, ..., Z=25 인덱스 변환.', code: 'cnt = [0] * 26  # A~Z 각 빈도\nfor c in word:\n    cnt[ord(c) - ord(\'A\')] += 1  # 해당 알파벳 +1' },
            { title: '최댓값 찾기', desc: '가장 많이 등장한 횟수를 찾습니다.', code: 'mx = max(cnt)' },
            { title: '중복 체크 + 출력', desc: '최댓값이 여러 개 → 가장 많은 문자가 둘 이상 → "?" 출력.\n하나뿐이면 해당 문자를 출력합니다.', code: 'if cnt.count(mx) > 1:       # 최댓값이 여러 개?\n    print(\'?\')\nelse:\n    print(chr(cnt.index(mx) + ord(\'A\')))  # 인덱스 → 문자' }
        ],
        cpp: [
            { title: '입력 받기', desc: '문자열을 입력받습니다.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: '빈도 배열 카운팅', desc: '크기 26 배열로 알파벳 빈도를 셉니다.\ntoupper()로 대소문자를 통일합니다.', code: '    int cnt[26] = {};  // A~Z 각 빈도\n    for (char c : s) cnt[toupper(c) - \'A\']++;' },
            { title: '최댓값 + 중복 체크', desc: '한 번의 순회로 최댓값과 중복 여부를 동시에 파악.\n새 최대 발견 → dup 리셋. 같은 최대 → dup 증가.', code: '    int mx = 0, idx = 0, dup = 0;\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] > mx) { mx = cnt[i]; idx = i; dup = 1; }\n        else if (cnt[i] == mx && mx > 0) dup++;\n    }' },
            { title: '출력', desc: '중복이면 "?", 아니면 해당 알파벳 출력.', code: '    cout << (dup > 1 ? "?" : string(1, \'A\' + idx)) << endl;\n}' }
        ]
    };

    // ── boj-1157 딕셔너리 ──
    findProb('boj-1157').solutions[1].codeSteps = {
        python: [
            { title: '입력 + 대문자 변환', desc: '대소문자 구분 없이 세기 위해 upper()로 통일.', code: 'word = input().upper()  # 대소문자 통일' },
            { title: '딕셔너리 카운팅', desc: '배열 대신 딕셔너리로 빈도를 셉니다.\n키가 없으면 1로 초기화, 있으면 +1.\n→ 어떤 문자든 셀 수 있어 더 범용적!', code: 'freq = {}  # {문자: 빈도}\nfor c in word:\n    if c in freq:\n        freq[c] += 1   # 이미 있으면 +1\n    else:\n        freq[c] = 1     # 처음 보면 1로 시작' },
            { title: '최댓값 찾기', desc: '딕셔너리의 모든 값(빈도) 중 최대를 찾습니다.', code: 'mx = max(freq.values())  # 최대 빈도' },
            { title: '후보 체크 + 출력', desc: '최대 빈도를 가진 문자가 여러 개면 "?" 출력.\n리스트 컴프리헨션으로 후보를 추출합니다.', code: 'candidates = [k for k, v in freq.items() if v == mx]\nprint(\'?\' if len(candidates) > 1 else candidates[0])' }
        ],
        cpp: [
            { title: '입력 + 해시맵 준비', desc: 'unordered_map으로 문자별 빈도를 저장합니다.\n배열과 달리 어떤 문자든 키로 사용 가능!', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;' },
            { title: '빈도 카운팅', desc: 'toupper()로 대문자 변환 후 해시맵에 기록.\nfreq[key]++ → 없으면 0에서 시작, 있으면 +1.', code: '    unordered_map<char, int> freq;\n    for (char c : s) freq[toupper(c)]++; // 대문자로 통일 후 카운팅' },
            { title: '최댓값 찾기', desc: '해시맵의 모든 빈도를 순회하며 최대값을 찾습니다.', code: '    int mx = 0;\n    for (auto& [ch, cnt] : freq) mx = max(mx, cnt);' },
            { title: '후보 체크 + 출력', desc: '최대 빈도 문자가 여러 개면 "?", 하나면 해당 문자.', code: '    int dup = 0;\n    char ans = \'?\';\n    for (auto& [ch, cnt] : freq) {\n        if (cnt == mx) { ans = ch; dup++; }\n    }\n    cout << (dup > 1 ? \'?\' : ans) << endl;\n}' }
        ]
    };

    // ── boj-1157 Counter ──
    findProb('boj-1157').solutions[2].codeSteps = {
        python: [
            { title: 'Counter란?', desc: 'Python의 빈도 카운팅 전용 클래스!\n딕셔너리 직접 만드는 것보다 훨씬 간결합니다.', explanation: _counterExplainHTML, code: null },
            { title: 'Counter로 빈도 세기', desc: 'Counter(word) 한 줄로 빈도 딕셔너리 완성!\nmost_common() → 빈도 내림차순 정렬된 리스트 반환.', code: 'from collections import Counter\n\nword = input().upper()\ncounter = Counter(word)  # 한 줄로 빈도 카운팅!\ntop = counter.most_common()  # [(문자, 빈도)] 내림차순' },
            { title: '결과 출력', desc: '1위와 2위의 빈도가 같으면 동률 → "?" 출력.\n1위가 유일하면 해당 문자를 출력합니다.', code: 'if len(top) > 1 and top[0][1] == top[1][1]:  # 1위 == 2위?\n    print(\'?\')\nelse:\n    print(top[0][0])  # 1위 문자 출력' }
        ],
        cpp: [
            { title: 'max_element란?', desc: 'C++ <algorithm>의 max_element()!\n반복자 범위에서 최댓값 위치를 O(n)으로 찾습니다.\nPython의 Counter.most_common()과 비슷한 역할.', explanation: _counterExplainHTML, code: null },
            { title: 'unordered_map으로 빈도 세기', desc: 'unordered_map<char,int>으로 빈도 카운팅.\ntoupper()로 대문자 통일 후 freq[c]++.', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    unordered_map<char, int> freq;\n    for (char c : s) freq[toupper(c)]++;  // 대문자 통일 후 카운팅' },
            { title: '최댓값 + 동률 체크', desc: 'max_element로 최대 빈도를 찾고,\n같은 빈도가 2개 이상이면 "?" 출력.', code: '    // 최대 빈도 찾기\n    int mx = max_element(freq.begin(), freq.end(),\n        [](auto& a, auto& b) { return a.second < b.second; }\n    )->second;\n\n    // 동률 체크\n    int dup = 0; char ans;\n    for (auto& [ch, cnt] : freq) {\n        if (cnt == mx) { ans = ch; dup++; }\n    }\n    cout << (dup > 1 ? \'?\' : ans) << endl;\n}' }
        ]
    };

    // ── lc-125 뒤집어서 비교 ──
    findProb('lc-125').solutions[0].codeSteps = {
        python: [
            { title: '함수 정의', desc: '팰린드롬 여부를 판별하는 함수입니다.', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:' },
            { title: '영숫자만 추출', desc: '핵심: 공백, 특수문자는 무시하고 영숫자만 남기기!\nisalnum() → 영문자 또는 숫자인지 확인.\nlower() → 대소문자 구분 없이 비교하기 위해.', code: '        cleaned = \'\'\n        for c in s:\n            if c.isalnum():        # 영문자/숫자만\n                cleaned += c.lower()  # 소문자로 통일' },
            { title: '뒤집어서 비교', desc: 'Python의 [::-1] 슬라이싱으로 문자열 뒤집기!\n원본과 뒤집은 것이 같으면 → 팰린드롬.', code: '        return cleaned == cleaned[::-1]  # 뒤집어도 같으면 팰린드롬!' }
        ],
        cpp: [
            { title: '함수 정의', desc: '팰린드롬 여부를 판별하는 함수입니다.', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {' },
            { title: '영숫자만 추출', desc: 'isalnum()으로 영숫자만 남기고 tolower()로 소문자 통일.\n→ 공백, 특수문자는 무시됩니다.', code: '        string cleaned;\n        for (char c : s) {\n            if (isalnum(c)) cleaned += tolower(c); // 영숫자만, 소문자로\n        }' },
            { title: '뒤집어서 비교', desc: 'reverse()로 뒤집은 복사본과 비교.\n같으면 팰린드롬입니다.', code: '        string rev = cleaned;\n        reverse(rev.begin(), rev.end());\n        return cleaned == rev;  // 뒤집어도 같으면 팰린드롬!\n    }\n};' }
        ]
    };

    // ── lc-125 투 포인터 ──
    findProb('lc-125').solutions[1].codeSteps = {
        python: [
            { title: '포인터 초기화', desc: '핵심: 양쪽 끝에서 시작하는 두 포인터!\n새 문자열을 만들지 않으므로 O(1) 공간.', code: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        left, right = 0, len(s) - 1  # 양쪽 끝에서 시작' },
            { title: '양쪽에서 비교', desc: '영숫자가 아닌 문자는 건너뛰고 비교.\n다르면 즉시 False! → 전체 정제 없이 바로 판별.\nlower()로 대소문자 무시.', code: '        while left < right:\n            while left < right and not s[left].isalnum():  # 영숫자 아니면 skip\n                left += 1\n            while left < right and not s[right].isalnum(): # 영숫자 아니면 skip\n                right -= 1\n            if s[left].lower() != s[right].lower():  # 다르면 팰린드롬 아님!\n                return False\n            left += 1\n            right -= 1' },
            { title: '결과 반환', desc: '끝까지 한 번도 다르지 않았으면 팰린드롬!\nO(n) 시간, O(1) 공간 — 뒤집기 방식보다 효율적.', code: '        return True' }
        ],
        cpp: [
            { title: '포인터 초기화', desc: '양쪽 끝에서 시작 → O(1) 공간으로 판별 가능!', code: 'class Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.size() - 1; // 양쪽 끝' },
            { title: '양쪽에서 비교', desc: '영숫자 아니면 skip, 다르면 즉시 false.\ntolower()로 대소문자 무시.', code: '        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;  // skip\n            while (l < r && !isalnum(s[r])) r--;  // skip\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }' },
            { title: '결과 반환', desc: '끝까지 통과 → 팰린드롬! O(n) 시간, O(1) 공간.', code: '        return true;\n    }\n};' }
        ]
    };

    // ── lc-49 정렬 키 ──
    findProb('lc-49').solutions[0].codeSteps = {
        python: [
            { title: '해시맵 준비', desc: '핵심 아이디어: 애너그램은 정렬하면 같은 문자열!\n"eat" → "aet", "tea" → "aet" → 같은 그룹!\n→ 정렬 결과를 키로 쓰면 자동 그룹화.', code: 'class Solution:\n    def groupAnagrams(self, strs):\n        groups = {}  # {정렬된 키: [원본 단어들]}' },
            { title: '정렬 키로 그룹화', desc: '각 단어를 sorted()로 정렬 → 키로 사용.\n같은 애너그램끼리 같은 키에 모입니다!\nO(n × k log k) — n개 단어, 평균 길이 k.', code: '        for s in strs:\n            key = \'\'.join(sorted(s))  # "eat" → "aet"\n            if key not in groups:\n                groups[key] = []\n            groups[key].append(s)     # 같은 키에 모으기' },
            { title: '결과 반환', desc: '딕셔너리의 값(그룹 리스트)들을 반환합니다.', code: '        return list(groups.values())' }
        ],
        cpp: [
            { title: '해시맵 준비', desc: '핵심: 애너그램 → 정렬하면 같은 문자열!\n정렬 결과를 키로 사용하여 그룹화합니다.', code: 'class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> mp; // {정렬키: [단어들]}' },
            { title: '정렬 키로 그룹화', desc: '각 단어를 sort() → 같은 애너그램은 같은 키.\nmp[key]에 자동으로 push_back됩니다.', code: '        for (auto& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end()); // "eat" → "aet"\n            mp[key].push_back(s);         // 같은 키에 모으기\n        }' },
            { title: '결과 반환', desc: '맵의 값들(그룹)을 벡터로 모아 반환.', code: '        vector<vector<string>> res;\n        for (auto& [k, v] : mp) res.push_back(v);\n        return res;\n    }\n};' }
        ]
    };

    // ── boj-1213 배열 카운팅 ──
    findProb('boj-1213').solutions[0].codeSteps = {
        python: [
            { title: '입력 + 빈도 세기', desc: '각 알파벳이 몇 번 등장하는지 크기 26 배열로 셉니다.\nord(c) - ord(\'A\') → A=0, B=1, ..., Z=25', code: 'import sys\ninput = sys.stdin.readline\n\nname = input().strip()\ncnt = [0] * 26  # A~Z 빈도\nfor c in name:\n    cnt[ord(c) - ord(\'A\')] += 1' },
            { title: '홀수 개수 체크', desc: '핵심: 팰린드롬에서 홀수 빈도 문자는 최대 1개!\n(가운데 한 자리만 홀수 가능)\n홀수가 2개 이상이면 팰린드롬 불가능.', code: 'odd_count = sum(1 for x in cnt if x % 2 != 0)\nif odd_count > 1:  # 홀수 빈도 문자가 2개 이상 → 불가능\n    print("I\'m Sorry Hansoo")' },
            { title: '팰린드롬 절반 구성', desc: '각 문자를 절반씩(cnt//2) 앞쪽에 배치.\n홀수 빈도 문자는 가운데(mid)에 놓습니다.\ni=0~25 순서 → 사전순 보장!', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for i in range(26):\n        if cnt[i] % 2 == 1:  # 홀수면 → 가운데\n            mid = chr(i + ord(\'A\'))\n        half += chr(i + ord(\'A\')) * (cnt[i] // 2)  # 절반씩' },
            { title: '조립 + 출력', desc: '앞절반 + 가운데 + 뒤집은절반 = 팰린드롬!\n예: "AB" + "C" + "BA" = "ABCBA"', code: '    print(half + mid + half[::-1])  # 앞 + 중 + 뒤(뒤집기)' }
        ],
        cpp: [
            { title: '입력 + 빈도 세기', desc: '각 대문자 알파벳의 빈도를 크기 26 배열로 셉니다.', code: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int cnt[26] = {}; // A~Z 빈도\n    for (char c : s) cnt[c - \'A\']++;' },
            { title: '홀수 개수 체크', desc: '팰린드롬에서 홀수 빈도 문자는 최대 1개만 가능!\n2개 이상이면 팰린드롬 불가능.', code: '    int odd = 0;\n    for (int i = 0; i < 26; i++) if (cnt[i] % 2) odd++;\n    if (odd > 1) { cout << "I\'m Sorry Hansoo" << endl; return 0; }' },
            { title: '팰린드롬 절반 구성', desc: '각 문자를 절반(cnt/2)씩 배치.\n홀수 빈도 문자는 가운데(mid)로.\ni=0~25 순서 → 사전순 보장.', code: '    string half = "", mid = "";\n    for (int i = 0; i < 26; i++) {\n        if (cnt[i] % 2) mid = string(1, \'A\' + i);  // 홀수 → 가운데\n        half += string(cnt[i] / 2, \'A\' + i);        // 절반씩\n    }' },
            { title: '조립 + 출력', desc: '앞절반 + 가운데 + 뒤집은절반 = 팰린드롬!\n"AB" + "C" + "BA" = "ABCBA"', code: '    string rev = half;\n    reverse(rev.begin(), rev.end());\n    cout << half + mid + rev << endl; // 앞 + 중 + 뒤\n}' }
        ]
    };

    // ── boj-1213 Counter 활용 ──
    findProb('boj-1213').solutions[1].codeSteps = {
        python: [
            { title: 'Counter란?', desc: 'Python의 빈도 카운팅 전용 클래스!\n배열 대신 Counter를 쓰면 더 간결합니다.', explanation: _counterExplainHTML, code: null },
            { title: 'Counter로 빈도 세기', desc: 'Counter(name) 한 줄로 {문자: 빈도} 완성!\n배열 만들고 ord() 변환하는 과정이 사라집니다.', code: 'from collections import Counter\n\nname = input().strip()\ncounter = Counter(name)  # 한 줄로 빈도 카운팅!' },
            { title: '홀수 체크', desc: '홀수 빈도 문자가 2개 이상 → 팰린드롬 불가능.\n리스트 컴프리헨션으로 홀수 빈도 문자를 추출합니다.', code: 'odd_chars = [c for c, v in counter.items() if v % 2 != 0]\nif len(odd_chars) > 1:  # 홀수 빈도 2개 이상 → 불가능\n    print("I\'m Sorry Hansoo")' },
            { title: '조립 + 출력', desc: 'sorted(counter)로 사전순 정렬 보장.\n절반 구성 후 앞 + 가운데 + 뒤집기 = 팰린드롬!', code: 'else:\n    half = \'\'\n    mid = \'\'\n    for c in sorted(counter):       # 사전순 보장\n        if counter[c] % 2 == 1:\n            mid = c                 # 홀수 → 가운데\n        half += c * (counter[c] // 2)  # 절반씩\n    print(half + mid + half[::-1])  # 앞 + 중 + 뒤' }
        ],
        cpp: [
            { title: 'unordered_map 활용', desc: 'C++에서는 unordered_map<char,int>이\nPython Counter와 같은 역할을 합니다.\n빈도를 세는 방법은 동일!', explanation: _counterExplainHTML, code: null },
            { title: 'map으로 빈도 세기', desc: 'map<char,int>으로 빈도 카운팅.\nmap은 키가 자동 정렬 → 사전순 보장!', code: '#include <iostream>\n#include <string>\n#include <map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string name;\n    cin >> name;\n    map<char, int> cnt;  // map: 키(문자) 자동 정렬!\n    for (char c : name) cnt[c]++;' },
            { title: '홀수 체크', desc: '홀수 빈도 문자가 2개 이상이면 팰린드롬 불가능.\ncnt를 순회하며 홀수 개수를 셉니다.', code: '    int odd = 0;\n    for (auto& [ch, v] : cnt) if (v % 2) odd++;\n    if (odd > 1) {\n        cout << "I\'m Sorry Hansoo" << endl;\n        return 0;\n    }' },
            { title: '조립 + 출력', desc: 'map이 사전순이라 순서대로 절반 구성.\n앞절반 + 가운데 + 뒤집은절반 = 팰린드롬!', code: '    string half = "", mid = "";\n    for (auto& [ch, v] : cnt) {\n        if (v % 2) mid = string(1, ch);  // 홀수 → 가운데\n        half += string(v / 2, ch);       // 절반씩\n    }\n    string rev = half;\n    reverse(rev.begin(), rev.end());\n    cout << half + mid + rev << endl;  // 앞 + 중 + 뒤\n}' }
        ]
    };
})();

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.string = stringTopic;
