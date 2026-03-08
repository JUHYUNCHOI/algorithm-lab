// ===== 분할정복 알고리즘 토픽 모듈 =====
var divideConquerTopic = {
    id: 'divideconquer',
    title: '분할정복',
    icon: '🔪',
    category: '알고리즘 기법',
    order: 11,
    description: '큰 문제를 작게 나눠서 풀고 합치는 기법',
    relatedNote: '분할정복은 병합 정렬, 퀵 정렬의 기반이며, FFT, 카라츠바 곱셈 등 고급 알고리즘에도 쓰입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-2630':  { type: '영역 분할',     color: 'var(--accent)', vizMethod: '_renderVizPaper',  suffix: '-paper' },
        'boj-1992':  { type: '쿼드트리',       color: 'var(--green)',  vizMethod: '_renderVizQuad',   suffix: '-quad' },
        'boj-1780':  { type: '9등분',          color: '#e17055',       vizMethod: '_renderVizNine',   suffix: '-nine' },
        'boj-1629':  { type: '거듭제곱',       color: '#6c5ce7',       vizMethod: '_renderVizPow',    suffix: '-pow' },
        'boj-11401': { type: '페르마 소정리',   color: '#fdcb6e',       vizMethod: '_renderVizBinom',  suffix: '-binom' },
        'boj-2740':  { type: '행렬 곱셈',      color: '#00b894',       vizMethod: '_renderVizMatMul', suffix: '-matmul' },
        'boj-10830': { type: '행렬 거듭제곱',   color: '#d63031',       vizMethod: '_renderVizMatPow', suffix: '-matpow' },
        'boj-11444': { type: '피보나치 행렬',   color: '#0984e3',       vizMethod: '_renderVizFibMat', suffix: '-fibmat' },
        'boj-6549':  { type: '구간 분할',       color: '#e84393',       vizMethod: '_renderVizHisto',  suffix: '-histo' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        var diffMap = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '분할정복이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
        };
        var ft = flowMap[tabId];
        if (ft) {
            var introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }
        var contentDiv = document.createElement('div');
        container.appendChild(contentDiv);
        switch (tabId) {
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }
        var tabOrder = ['problem', 'think', 'sim', 'code'];
        var tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        var ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
        var curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            var nextId = tabOrder[curIdx + 1];
            var nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    _renderProblemTab(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
        contentEl.appendChild(guide);
        var hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        var openedState = {};
        prob.hints.forEach(function(hint, idx) {
            var step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML =
                '<div class="hint-step-header">' +
                '<span class="hint-step-num">' + (idx + 1) + '</span>' +
                '<span class="hint-step-title">' + hint.title + '</span>' +
                '<span class="hint-step-toggle">▶</span></div>' +
                '<div class="hint-step-content">' + hint.content + '</div>';
            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        var nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });
            hintsDiv.appendChild(step);
        });
        contentEl.appendChild(hintsDiv);
    },

    _renderCodeTab(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>🔪 분할정복 (Divide and Conquer)</h2>\
                <p class="hero-sub">큰 문제를 작게 나누고, 각각 풀어서, 합치면 전체 답이 됩니다</p>\
            </div>\
\
            <!-- ① 분할정복이란? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 분할정복이란?</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 피자를 8명이 나눠 먹어야 합니다.<br><br>\
                    1. <strong>나누기(Divide)</strong>: 피자를 반으로 자릅니다 → 또 반으로 → 또 반으로 → 8조각!<br>\
                    2. <strong>풀기(Conquer)</strong>: 각 조각을 한 명씩 먹습니다.<br>\
                    3. <strong>합치기(Combine)</strong>: 모두가 배부르게 됩니다!<br><br>\
                    이렇게 <strong>큰 문제를 작은 문제로 나누고, 작은 문제를 풀고, 결과를 합치는 것</strong>이 분할정복입니다.\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 이진 탐색 (분할정복의 가장 간단한 예)\ndef binary_search(arr, target, lo, hi):\n    if lo > hi:\n        return -1                    # 기저 조건: 찾을 범위 없음\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        return mid                   # 찾았다!\n    elif arr[mid] < target:\n        return binary_search(arr, target, mid + 1, hi)  # 오른쪽 절반\n    else:\n        return binary_search(arr, target, lo, mid - 1)  # 왼쪽 절반</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">1024개의 정렬된 숫자에서 이진 탐색으로 원하는 숫자를 찾으려면 최대 몇 번 비교해야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>최대 10번</strong>입니다!<br>\
                        1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1<br>\
                        매번 반으로 나누므로 <strong>log₂(1024) = 10</strong>번이면 충분합니다.<br>\
                        하나씩 찾으면 최대 1024번인데, 분할정복으로 <strong>10번</strong>이면 됩니다!\
                    </div>\
                </div>\
            </div>\
\
            <!-- ② 분할정복의 3단계 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> 분할정복의 3단계</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>1. 나누기 (Divide)</h3>\
                        <p>큰 문제를 <strong>같은 형태의 작은 문제</strong>로 나눕니다. 보통 절반으로 나누거나, 4등분 합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <path d="M28 55 L40 68 L52 55" fill="none" stroke="var(--green)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>2. 풀기 (Conquer)</h3>\
                        <p>작은 문제들을 <strong>재귀적으로</strong> 풀어나갑니다. 더 이상 나눌 수 없으면 바로 답을 구합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <path d="M33 40 L47 40" stroke="var(--yellow)" stroke-width="3" marker-end="url(#arrowhead)"/>\
                            </svg>\
                        </div>\
                        <h3>3. 합치기 (Combine)</h3>\
                        <p>작은 문제의 답들을 <strong>합쳐서</strong> 원래 큰 문제의 답을 만듭니다.</p>\
                    </div>\
                </div>\
\
                <div class="code-block"><pre><code class="language-python"># 합병 정렬 (Merge Sort) — 분할정복의 대표 예시\ndef merge_sort(arr):\n    if len(arr) <= 1:       # 기저 조건\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])    # 1. 왼쪽 절반 정렬\n    right = merge_sort(arr[mid:])   # 1. 오른쪽 절반 정렬\n    return merge(left, right)       # 3. 합치기\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result</code></pre></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">[5, 3, 1, 4, 2]를 합병 정렬하면, 나누기 단계에서 어떻게 쪼개질까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        [5, 3, 1, 4, 2] → [5, 3] + [1, 4, 2]<br>\
                        [5, 3] → [5] + [3]<br>\
                        [1, 4, 2] → [1] + [4, 2] → [1] + [4] + [2]<br><br>\
                        합치기: [3,5] + [1,2,4] → <strong>[1, 2, 3, 4, 5]</strong>\
                    </div>\
                </div>\
            </div>\
\
            <!-- ③ 분할정복 vs 재귀 vs DP -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> 분할정복 vs 재귀 vs DP</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="30" r="12" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <path d="M30 48 Q40 60 50 48" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <line x1="40" y1="42" x2="40" y2="52" stroke="var(--blue)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>재귀</h3>\
                        <p><strong>자기 자신을 호출</strong>하는 기법.<br>함수가 자기 자신을 부르는 것이 재귀입니다. 분할정복과 DP 모두 재귀를 사용합니다.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>분할정복</h3>\
                        <p><strong>나누고 + 합치기</strong>.<br>문제를 독립적인 조각으로 나누고, 각각 풀고, 결과를 합칩니다. 부분 문제가 <strong>겹치지 않습니다</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="20" width="60" height="40" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <line x1="30" y1="20" x2="30" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                                <line x1="50" y1="20" x2="50" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                            </svg>\
                        </div>\
                        <h3>DP (동적 프로그래밍)</h3>\
                        <p><strong>저장하며 풀기</strong>.<br>부분 문제가 <strong>겹쳐서</strong> 같은 계산을 여러 번 하게 될 때, 결과를 저장해서 재사용합니다.</p>\
                    </div>\
                </div>\
\
                <div class="key-difference-box" style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius);border-left:4px solid var(--accent);">\
                    <strong>핵심 차이!</strong><br>\
                    • <strong>분할정복</strong>: 부분 문제가 서로 <span style="color:var(--accent)">겹치지 않음</span> → 그냥 각각 풀면 됨<br>\
                    • <strong>DP</strong>: 부분 문제가 서로 <span style="color:var(--green)">겹침</span> → 저장해서 재사용해야 빠름<br>\
                    예) 합병 정렬: 왼쪽/오른쪽 독립 → <strong>분할정복</strong> | 피보나치: F(3)을 여러 번 계산 → <strong>DP</strong>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"1부터 N까지의 합을 구하는 문제"는 분할정복으로 풀 수 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        네! 가능합니다.<br>\
                        sum(1, N) = sum(1, N/2) + sum(N/2+1, N) 으로 나눌 수 있습니다.<br>\
                        기저 조건: sum(a, a) = a (하나만 남으면 그 자체가 답)<br><br>\
                        하지만 이 문제는 <strong>N×(N+1)/2</strong> 공식이 더 빠릅니다.<br>\
                        분할정복은 단순한 문제보다 <strong>복잡한 문제에서 빛을 발합니다!</strong>\
                    </div>\
                </div>\
            </div>\
\
            <!-- ④ 자주 쓰이는 분할정복 패턴 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 자주 쓰이는 분할정복 패턴</div>\
                <div class="concept-grid">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="10" x2="40" y2="70" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>\
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>영역 나누기</h3>\
                        <p>2D 영역을 <strong>4등분(쿼드트리)</strong> 또는 <strong>9등분</strong>으로 나눠서 처리합니다. 색종이, 쿼드트리 문제가 대표적입니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <text x="15" y="48" font-size="28" fill="var(--green)">a</text>\
                                <text x="40" y="32" font-size="16" fill="var(--green)">n</text>\
                            </svg>\
                        </div>\
                        <h3>빠른 거듭제곱</h3>\
                        <p>a^n을 구할 때, <strong>지수를 반으로 나누면</strong> O(log n)에 계산할 수 있습니다. 매우 큰 수의 거듭제곱에 사용합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <rect x="45" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <text x="30" y="58" font-size="14" fill="var(--yellow)">×</text>\
                            </svg>\
                        </div>\
                        <h3>행렬 거듭제곱</h3>\
                        <p>행렬의 거듭제곱도 같은 원리입니다. <strong>피보나치 수</strong>를 O(log n)에 구하는 데 사용합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="50" width="12" height="20" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="24" y="30" width="12" height="40" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="38" y="40" width="12" height="30" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="52" y="20" width="12" height="50" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>구간 분할</h3>\
                        <p>배열을 <strong>왼쪽/오른쪽으로 나눠서</strong> 각각의 답을 구하고, 걸치는 경우를 처리합니다. 히스토그램 문제가 대표적입니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">2^100을 직접 곱하면 몇 번 곱해야 할까요? 분할정복으로는 몇 번이면 될까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        직접 곱하기: 2를 <strong>99번</strong> 곱해야 합니다.<br><br>\
                        분할정복: 2^100 = (2^50)² → 2^50 = (2^25)² → 2^25 = (2^12)² × 2 → ...<br>\
                        총 <strong>약 7번</strong>의 곱셈이면 됩니다! (log₂(100) ≈ 7)<br><br>\
                        99번 → 7번, 거의 <strong>14배나 빠릅니다!</strong>\
                    </div>\
                </div>\
            </div>\
\
            <!-- ⑤ 분할정복 문제 푸는 3단계 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 분할정복 문제 푸는 3단계</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="35" r="18" fill="none" stroke="var(--red)" stroke-width="2"/>\
                                <text x="34" y="42" font-size="18" fill="var(--red)">!</text>\
                            </svg>\
                        </div>\
                        <h3>① 기저 조건 정하기</h3>\
                        <p><strong>더 이상 나눌 수 없는 가장 작은 크기</strong>를 정합니다. 예) 배열 크기 1, 지수가 0 또는 1 등</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="20" x2="40" y2="60" stroke="var(--red)" stroke-width="2.5" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>② 나누는 기준 정하기</h3>\
                        <p>문제를 어떻게 나눌지 결정합니다. <strong>절반? 4등분? 9등분?</strong> 문제 유형에 따라 달라집니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <path d="M33 37 L47 37" stroke="var(--green)" stroke-width="3"/>\
                                <text x="36" y="62" font-size="16" fill="var(--green)">+</text>\
                            </svg>\
                        </div>\
                        <h3>③ 합치는 방법 정하기</h3>\
                        <p>작은 문제의 결과를 어떻게 합칠지 정합니다. <strong>더하기? 곱하기? 최댓값?</strong> 문제마다 다릅니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"N×N 색종이가 전부 같은 색인지 확인하는 문제"에서 3단계를 적용하면?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        ① <strong>기저 조건</strong>: 1×1 크기면 그 색이 곧 답<br>\
                        ② <strong>나누기</strong>: 4등분 (왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래)<br>\
                        ③ <strong>합치기</strong>: 4조각이 모두 같은 색이면 합치고, 아니면 각각 유지<br><br>\
                        이것이 바로 <strong>색종이 만들기 / 쿼드트리</strong> 문제의 핵심입니다!\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 (개념 탭에서는 빈 스텁) =====
    renderVisualize(container) {},

    // ===== 문제 탭 빈 스텁 =====
    renderProblem(container) {},

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#str-prev-' + suffix);
        var nextBtn = container.querySelector('#str-next-' + suffix);
        var indicator = container.querySelector('#str-indicator-' + suffix);
        var desc = container.querySelector('#str-desc-' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
        });
        var handleKey = function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKey);
        state.keydownHandler = handleKey;
        updateUI();
    },

    // ====================================================================
    // 시뮬레이션 1: 색종이 만들기 (boj-2630)
    // ====================================================================
    _renderVizPaper(container) {
        var self = this, suffix = '-paper';
        var grid = [
            [0,0,1,1],
            [0,0,1,1],
            [1,0,1,1],
            [0,1,1,1]
        ];
        var SIZE = 4;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">색종이 만들기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 색종이를 재귀적으로 4등분하며 같은 색인지 확인합니다. (흰=0, 파랑=1)</p>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;grid-template-columns:repeat(4,48px);gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function cellStyle(v, hl) {
            var bg = v === 1 ? 'var(--accent)' : 'var(--bg2)';
            var extra = hl || '';
            return 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:' + bg + ';color:' + (v === 1 ? 'white' : 'var(--text)') + ';' + extra;
        }
        function renderGrid(highlights) {
            var html = '';
            for (var r = 0; r < SIZE; r++) {
                for (var c = 0; c < SIZE; c++) {
                    var hl = highlights && highlights[r + ',' + c] ? highlights[r + ',' + c] : '';
                    html += '<div style="' + cellStyle(grid[r][c], hl) + '">' + grid[r][c] + '</div>';
                }
            }
            gridEl.innerHTML = html;
        }
        renderGrid(null);
        infoEl.innerHTML = '<span style="color:var(--text2);">4×4 색종이를 검사합니다.</span>';
        var whiteCnt = 0, blueCnt = 0;
        var steps = [
            { description: '전체 4×4 검사: 색이 섞여 있음 → 4등분합니다!',
              action: function() { var h = {}; for (var r=0;r<4;r++) for(var c=0;c<4;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); infoEl.innerHTML = '전체 4×4: 색이 다름 → <strong>4등분!</strong>'; whiteCnt=0; blueCnt=0; },
              undo: function() { renderGrid(null); infoEl.innerHTML = '<span style="color:var(--text2);">4×4 색종이를 검사합니다.</span>'; }
            },
            { description: '좌상 2×2: [0,0,0,0] → 전부 흰색! 흰색+1',
              action: function() { var h = {}; h['0,0']=h['0,1']=h['1,0']=h['1,1']='border:3px solid var(--green);box-shadow:0 0 8px var(--green)40;'; renderGrid(h); whiteCnt=1; infoEl.innerHTML = '좌상 2×2: 전부 흰색 → <strong>흰색 +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; },
              undo: function() { var h = {}; for(var r=0;r<4;r++) for(var c=0;c<4;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); infoEl.innerHTML = '전체 4×4: 색이 다름 → <strong>4등분!</strong>'; whiteCnt=0; blueCnt=0; }
            },
            { description: '우상 2×2: [1,1,1,1] → 전부 파랑! 파랑+1',
              action: function() { var h = {}; h['0,2']=h['0,3']=h['1,2']=h['1,3']='border:3px solid var(--accent);box-shadow:0 0 8px var(--accent)40;'; renderGrid(h); blueCnt=1; infoEl.innerHTML = '우상 2×2: 전부 파랑 → <strong>파랑 +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; },
              undo: function() { var h = {}; h['0,0']=h['0,1']=h['1,0']=h['1,1']='border:3px solid var(--green);box-shadow:0 0 8px var(--green)40;'; renderGrid(h); blueCnt=0; infoEl.innerHTML = '좌상 2×2: 전부 흰색 → <strong>흰색 +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; }
            },
            { description: '좌하 2×2: [1,0,0,1] → 색이 섞임 → 4등분! 1×1씩: 파,흰,흰,파',
              action: function() { var h = {}; h['2,0']='border:3px solid var(--accent);'; h['2,1']='border:3px solid var(--green);'; h['3,0']='border:3px solid var(--green);'; h['3,1']='border:3px solid var(--accent);'; renderGrid(h); whiteCnt=3; blueCnt=3; infoEl.innerHTML = '좌하 2×2: 섞임 → 1×1로 분할 → <strong>흰+2, 파+2</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; },
              undo: function() { var h = {}; h['0,2']=h['0,3']=h['1,2']=h['1,3']='border:3px solid var(--accent);box-shadow:0 0 8px var(--accent)40;'; renderGrid(h); whiteCnt=1; blueCnt=1; infoEl.innerHTML = '우상 2×2: 전부 파랑 → <strong>파랑 +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; }
            },
            { description: '우하 2×2: [1,1,1,1] → 전부 파랑! 파랑+1',
              action: function() { var h = {}; h['2,2']=h['2,3']=h['3,2']=h['3,3']='border:3px solid var(--accent);box-shadow:0 0 8px var(--accent)40;'; renderGrid(h); blueCnt=4; infoEl.innerHTML = '우하 2×2: 전부 파랑 → <strong>파랑 +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; },
              undo: function() { var h = {}; h['2,0']='border:3px solid var(--accent);'; h['2,1']='border:3px solid var(--green);'; h['3,0']='border:3px solid var(--green);'; h['3,1']='border:3px solid var(--accent);'; renderGrid(h); whiteCnt=3; blueCnt=3; infoEl.innerHTML = '좌하 2×2: 섞임 → 1×1로 분할 → <strong>흰+2, 파+2</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')'; }
            },
            { description: '완성! 흰색 3개, 파란색 4개',
              action: function() { renderGrid(null); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! 흰색: 3개, 파란색: 4개</strong>'; },
              undo: function() { var h = {}; h['2,2']=h['2,3']=h['3,2']=h['3,3']='border:3px solid var(--accent);box-shadow:0 0 8px var(--accent)40;'; renderGrid(h); infoEl.innerHTML = '우하 2×2: 전부 파랑 → <strong>파랑 +1</strong> (흰:3, 파:4)'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 쿼드트리 (boj-1992)
    // ====================================================================
    _renderVizQuad(container) {
        var self = this, suffix = '-quad';
        var grid = [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ];
        var SIZE = 4;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">쿼드트리 압축</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 영상을 쿼드트리 문자열로 압축합니다.</p>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;grid-template-columns:repeat(4,48px);gap:2px;margin-bottom:8px;"></div>' +
            '<div id="dc-result' + suffix + '" style="font-family:monospace;font-size:1.1rem;padding:8px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:30px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var resultEl = container.querySelector('#dc-result' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function renderGrid(highlights) {
            var html = '';
            for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
                var v = grid[r][c];
                var bg = v === 1 ? 'var(--accent)' : 'var(--bg2)';
                var hl = highlights && highlights[r+','+c] ? highlights[r+','+c] : '';
                html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;background:' + bg + ';color:' + (v?'white':'var(--text)') + ';' + hl + '">' + v + '</div>';
            }
            gridEl.innerHTML = html;
        }
        renderGrid(null);
        resultEl.textContent = '';
        infoEl.innerHTML = '<span style="color:var(--text2);">쿼드트리 압축을 시작합니다.</span>';
        var resultStr = '';
        var steps = [
            { description: '전체 4×4 검사: 색이 섞임 → "(" 시작, 4등분!',
              action: function() { var h = {}; for(var r=0;r<4;r++) for(var c=0;c<4;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); resultStr='('; resultEl.textContent=resultStr; infoEl.innerHTML='전체: 섞임 → <strong>"(" 열기</strong>'; },
              undo: function() { renderGrid(null); resultStr=''; resultEl.textContent=''; infoEl.innerHTML='<span style="color:var(--text2);">쿼드트리 압축을 시작합니다.</span>'; }
            },
            { description: '좌상 2×2: [1,1,1,1] → 전부 1 → "1"',
              action: function() { var h={}; h['0,0']=h['0,1']=h['1,0']=h['1,1']='border:3px solid var(--green);'; renderGrid(h); resultStr='(1'; resultEl.textContent=resultStr; infoEl.innerHTML='좌상: 전부 1 → <strong>"1"</strong>'; },
              undo: function() { var h={}; for(var r=0;r<4;r++) for(var c=0;c<4;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); resultStr='('; resultEl.textContent=resultStr; infoEl.innerHTML='전체: 섞임 → <strong>"(" 열기</strong>'; }
            },
            { description: '우상 2×2: [0,0,0,0] → 전부 0 → "0"',
              action: function() { var h={}; h['0,2']=h['0,3']=h['1,2']=h['1,3']='border:3px solid var(--green);'; renderGrid(h); resultStr='(10'; resultEl.textContent=resultStr; infoEl.innerHTML='우상: 전부 0 → <strong>"0"</strong>'; },
              undo: function() { var h={}; h['0,0']=h['0,1']=h['1,0']=h['1,1']='border:3px solid var(--green);'; renderGrid(h); resultStr='(1'; resultEl.textContent=resultStr; infoEl.innerHTML='좌상: 전부 1 → <strong>"1"</strong>'; }
            },
            { description: '좌하 2×2: [0,0,0,0] → 전부 0 → "0"',
              action: function() { var h={}; h['2,0']=h['2,1']=h['3,0']=h['3,1']='border:3px solid var(--green);'; renderGrid(h); resultStr='(100'; resultEl.textContent=resultStr; infoEl.innerHTML='좌하: 전부 0 → <strong>"0"</strong>'; },
              undo: function() { var h={}; h['0,2']=h['0,3']=h['1,2']=h['1,3']='border:3px solid var(--green);'; renderGrid(h); resultStr='(10'; resultEl.textContent=resultStr; infoEl.innerHTML='우상: 전부 0 → <strong>"0"</strong>'; }
            },
            { description: '우하 2×2: [1,0,0,1] → 섞임 → "(1001)"',
              action: function() { var h={}; h['2,2']='border:3px solid var(--accent);'; h['2,3']='border:3px solid var(--green);'; h['3,2']='border:3px solid var(--green);'; h['3,3']='border:3px solid var(--accent);'; renderGrid(h); resultStr='(100(1001)'; resultEl.textContent=resultStr; infoEl.innerHTML='우하: 섞임 → <strong>"(1001)"</strong>'; },
              undo: function() { var h={}; h['2,0']=h['2,1']=h['3,0']=h['3,1']='border:3px solid var(--green);'; renderGrid(h); resultStr='(100'; resultEl.textContent=resultStr; infoEl.innerHTML='좌하: 전부 0 → <strong>"0"</strong>'; }
            },
            { description: '완성! 결과: (100(1001))',
              action: function() { renderGrid(null); resultStr='(100(1001))'; resultEl.textContent=resultStr; infoEl.innerHTML='<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! (100(1001))</strong>'; },
              undo: function() { var h={}; h['2,2']='border:3px solid var(--accent);'; h['2,3']='border:3px solid var(--green);'; h['3,2']='border:3px solid var(--green);'; h['3,3']='border:3px solid var(--accent);'; renderGrid(h); resultStr='(100(1001)'; resultEl.textContent=resultStr; infoEl.innerHTML='우하: 섞임 → <strong>"(1001)"</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 종이의 개수 (boj-1780)
    // ====================================================================
    _renderVizNine(container) {
        var self = this, suffix = '-nine';
        var grid = [
            [0,  0, -1],
            [0,  0,  1],
            [-1, 1,  0]
        ];
        var SIZE = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">종이의 개수 (9등분)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">3×3 종이를 검사합니다. 모두 같지 않으면 9등분(1×1)으로 분할합니다.</p>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;grid-template-columns:repeat(3,56px);gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function colorOf(v) { return v === -1 ? '#e17055' : v === 0 ? 'var(--bg2)' : 'var(--accent)'; }
        function renderGrid(highlights) {
            var html = '';
            for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
                var v = grid[r][c];
                var hl = highlights && highlights[r+','+c] ? highlights[r+','+c] : '';
                html += '<div style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:700;background:' + colorOf(v) + ';color:' + (v===0?'var(--text)':'white') + ';' + hl + '">' + v + '</div>';
            }
            gridEl.innerHTML = html;
        }
        renderGrid(null);
        infoEl.innerHTML = '<span style="color:var(--text2);">3×3 종이를 검사합니다.</span>';
        var steps = [
            { description: '전체 3×3: 값이 섞여 있음 (-1,0,1 모두 존재) → 9등분(1×1)!',
              action: function() { var h={}; for(var r=0;r<3;r++) for(var c=0;c<3;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); infoEl.innerHTML='전체: 값이 다름 → <strong>9등분!</strong>'; },
              undo: function() { renderGrid(null); infoEl.innerHTML='<span style="color:var(--text2);">3×3 종이를 검사합니다.</span>'; }
            },
            { description: '각 1×1 칸 카운트: 0이 3개',
              action: function() { var h={}; h['0,0']=h['0,1']=h['1,0']=h['1,1']=h['2,2']='border:3px solid var(--green);box-shadow:0 0 6px var(--green)40;'; renderGrid(h); infoEl.innerHTML='0이 들어있는 칸: <strong>5개</strong> (0,0), (0,1), (1,0), (1,1), (2,2)'; },
              undo: function() { var h={}; for(var r=0;r<3;r++) for(var c=0;c<3;c++) h[r+','+c]='border:3px solid var(--red);'; renderGrid(h); infoEl.innerHTML='전체: 값이 다름 → <strong>9등분!</strong>'; }
            },
            { description: '-1 칸 카운트: 2개, 1 칸 카운트: 2개',
              action: function() { var h={}; h['0,2']=h['2,0']='border:3px solid #e17055;box-shadow:0 0 6px #e1705540;'; h['1,2']=h['2,1']='border:3px solid var(--accent);box-shadow:0 0 6px var(--accent)40;'; renderGrid(h); infoEl.innerHTML='-1: <strong>2개</strong>, 1: <strong>2개</strong>'; },
              undo: function() { var h={}; h['0,0']=h['0,1']=h['1,0']=h['1,1']=h['2,2']='border:3px solid var(--green);box-shadow:0 0 6px var(--green)40;'; renderGrid(h); infoEl.innerHTML='0이 들어있는 칸: <strong>5개</strong>'; }
            },
            { description: '다른 크기(예: 9×9)라면 3×3으로 나누고, 다시 재귀적으로 검사합니다.',
              action: function() { renderGrid(null); infoEl.innerHTML='크기가 큰 경우: 3등분씩 → <strong>재귀!</strong>'; },
              undo: function() { var h={}; h['0,2']=h['2,0']='border:3px solid #e17055;'; h['1,2']=h['2,1']='border:3px solid var(--accent);'; renderGrid(h); infoEl.innerHTML='-1: <strong>2개</strong>, 1: <strong>2개</strong>'; }
            },
            { description: '완성! -1: 2개, 0: 5개, 1: 2개',
              action: function() { renderGrid(null); infoEl.innerHTML='<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! -1: 2개, 0: 5개, 1: 2개</strong>'; },
              undo: function() { renderGrid(null); infoEl.innerHTML='크기가 큰 경우: 3등분씩 → <strong>재귀!</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 곱셈 - 빠른 거듭제곱 (boj-1629)
    // ====================================================================
    _renderVizPow(container) {
        var self = this, suffix = '-pow';
        var A = 10, B = 11, C = 12;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">빠른 거듭제곱</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">' + A + '<sup>' + B + '</sup> mod ' + C + ' 을 분할정복으로 계산합니다.</p>' +
            '<div id="dc-tree' + suffix + '" style="margin-bottom:12px;padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        treeEl.innerHTML = '';
        infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 계산합니다.</span>';
        var nodes = [];
        function addNode(exp, depth) { nodes.push({exp: exp, depth: depth, value: null}); return nodes.length - 1; }
        addNode(11, 0); addNode(5, 1); addNode(2, 2); addNode(1, 3);
        function renderTree() {
            treeEl.innerHTML = nodes.map(function(n, i) {
                var pad = '&nbsp;&nbsp;'.repeat(n.depth);
                var val = n.value !== null ? ' = <strong style="color:var(--green);">' + n.value + '</strong>' : '';
                return '<div style="padding:4px 0;">' + pad + A + '<sup>' + n.exp + '</sup> mod ' + C + val + '</div>';
            }).join('');
        }
        renderTree();
        var steps = [
            { description: A + '^11: 홀수 → ' + A + '^5 × ' + A + '^5 × ' + A,
              action: function() { infoEl.innerHTML = A + '<sup>11</sup> = ' + A + '<sup>5</sup> × ' + A + '<sup>5</sup> × ' + A + ' (홀수: 반×반×밑)'; },
              undo: function() { infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 계산합니다.</span>'; }
            },
            { description: A + '^5: 홀수 → ' + A + '^2 × ' + A + '^2 × ' + A,
              action: function() { infoEl.innerHTML = A + '<sup>5</sup> = ' + A + '<sup>2</sup> × ' + A + '<sup>2</sup> × ' + A + ' (홀수)'; },
              undo: function() { infoEl.innerHTML = A + '<sup>11</sup> = ' + A + '<sup>5</sup> × ' + A + '<sup>5</sup> × ' + A; }
            },
            { description: A + '^2: 짝수 → ' + A + '^1 × ' + A + '^1',
              action: function() { infoEl.innerHTML = A + '<sup>2</sup> = ' + A + '<sup>1</sup> × ' + A + '<sup>1</sup> (짝수)'; },
              undo: function() { infoEl.innerHTML = A + '<sup>5</sup> = ' + A + '<sup>2</sup> × ' + A + '<sup>2</sup> × ' + A; }
            },
            { description: '기저 조건: ' + A + '^1 = ' + (A % C) + ' (mod ' + C + ')',
              action: function() { nodes[3].value = A % C; renderTree(); infoEl.innerHTML = '기저: ' + A + '<sup>1</sup> mod ' + C + ' = <strong>' + (A%C) + '</strong>'; },
              undo: function() { nodes[3].value = null; renderTree(); infoEl.innerHTML = A + '<sup>2</sup> = ' + A + '<sup>1</sup> × ' + A + '<sup>1</sup>'; }
            },
            { description: '합치기: ' + A + '^2 = ' + (A%C) + '×' + (A%C) + ' mod ' + C + ' = ' + ((A%C)*(A%C)%C),
              action: function() { var v = (A%C)*(A%C)%C; nodes[2].value = v; renderTree(); infoEl.innerHTML = A + '<sup>2</sup> = ' + (A%C) + ' × ' + (A%C) + ' mod ' + C + ' = <strong>' + v + '</strong>'; },
              undo: function() { nodes[2].value = null; renderTree(); infoEl.innerHTML = '기저: ' + A + '<sup>1</sup> mod ' + C + ' = <strong>' + (A%C) + '</strong>'; }
            },
            { description: '합치기: ' + A + '^5 = ' + nodes[2] + ' ... → 4',
              action: function() { var v2 = (A%C)*(A%C)%C; var v5 = v2*v2%C; v5 = v5*(A%C)%C; nodes[1].value = v5; renderTree(); infoEl.innerHTML = A + '<sup>5</sup> = ' + v2 + '×' + v2 + '×' + (A%C) + ' mod ' + C + ' = <strong>' + v5 + '</strong>'; },
              undo: function() { nodes[1].value = null; renderTree(); var v = (A%C)*(A%C)%C; infoEl.innerHTML = A + '<sup>2</sup> = <strong>' + v + '</strong>'; }
            }
        ];
        // compute final
        var v1 = A % C;
        var v2 = v1 * v1 % C;
        var v5 = v2 * v2 % C; v5 = v5 * v1 % C;
        var v11 = v5 * v5 % C; v11 = v11 * v1 % C;
        steps[5] = { description: '합치기: ' + A + '^5 = ' + v2 + '×' + v2 + '×' + v1 + ' mod ' + C + ' = ' + v5,
            action: function() { nodes[1].value = v5; renderTree(); infoEl.innerHTML = A + '<sup>5</sup> = ' + v2 + '×' + v2 + '×' + v1 + ' mod ' + C + ' = <strong>' + v5 + '</strong>'; },
            undo: function() { nodes[1].value = null; renderTree(); infoEl.innerHTML = A + '<sup>2</sup> = <strong>' + v2 + '</strong>'; }
        };
        steps.push({ description: '완성! ' + A + '^' + B + ' mod ' + C + ' = ' + v11,
            action: function() { nodes[0].value = v11; renderTree(); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + A + '<sup>' + B + '</sup> mod ' + C + ' = ' + v11 + '</strong>'; },
            undo: function() { nodes[0].value = null; renderTree(); infoEl.innerHTML = A + '<sup>5</sup> = <strong>' + v5 + '</strong>'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 이항 계수 3 (boj-11401)
    // ====================================================================
    _renderVizBinom(container) {
        var self = this, suffix = '-binom';
        var N = 5, K = 2, MOD = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">이항 계수 (페르마 소정리)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">C(' + N + ',' + K + ') mod ' + MOD + ' 을 팩토리얼 + 역원으로 계산합니다.</p>' +
            '<div id="dc-calc' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var calcEl = container.querySelector('#dc-calc' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        // precompute factorials mod 7
        var fac = [1]; for (var i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;
        function pw(a, b, m) { var r = 1; a = a % m; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }
        var invK = pw(fac[K], MOD - 2, MOD);
        var invNK = pw(fac[N - K], MOD - 2, MOD);
        var ans = fac[N] * invK % MOD * invNK % MOD;
        calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)';
        infoEl.innerHTML = '<span style="color:var(--text2);">페르마 소정리로 모듈러 역원을 구합니다.</span>';
        var steps = [
            { description: '팩토리얼 계산: 0!=1, 1!=1, 2!=2, 3!=6, 4!=24≡3, 5!=120≡1 (mod 7)',
              action: function() { calcEl.innerHTML = fac.map(function(v,i){return i+'! = '+v;}).join(', '); infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; },
              undo: function() { calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)'; infoEl.innerHTML = '<span style="color:var(--text2);">페르마 소정리로 모듈러 역원을 구합니다.</span>'; }
            },
            { description: '페르마 소정리: a^(-1) ≡ a^(p-2) mod p → ' + K + '!의 역원 = ' + fac[K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invK,
              action: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; },
              undo: function() { calcEl.innerHTML = fac.map(function(v,i){return i+'! = '+v;}).join(', '); infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; }
            },
            { description: (N-K) + '!의 역원 = ' + fac[N-K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invNK,
              action: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → 역원 = ' + fac[N-K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!의 모듈러 역원: <strong>' + invNK + '</strong>'; },
              undo: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; }
            },
            { description: '결합: ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = ' + ans,
              action: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; },
              undo: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → 역원 = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!의 모듈러 역원: <strong>' + invNK + '</strong>'; }
            },
            { description: '완성! C(5,2) mod 7 = ' + ans + ' (실제 C(5,2)=10, 10 mod 7=3)',
              action: function() { calcEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong style="font-size:1.2rem;color:var(--green);">' + ans + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ C(' + N + ',' + K + ') mod ' + MOD + ' = ' + ans + '</strong>'; },
              undo: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 행렬 곱셈 (boj-2740)
    // ====================================================================
    _renderVizMatMul(container) {
        var self = this, suffix = '-matmul';
        var A = [[1,2],[3,4]], B = [[-1,0],[0,3]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">행렬 곱셈</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">2×2 행렬 A × B를 단계별로 계산합니다.</p>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function showMat(m, label) { return '<div style="display:inline-block;margin:0 8px;vertical-align:middle;"><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:8px;display:inline-grid;grid-template-columns:1fr 1fr;gap:4px;">' + m.map(function(row) { return row.map(function(v) { return '<span style="padding:4px 8px;text-align:center;">' + v + '</span>'; }).join(''); }).join('') + '</div></div>'; }
        var C = [[0,0],[0,0]];
        matEl.innerHTML = showMat(A, 'A') + ' × ' + showMat(B, 'B') + ' = ' + showMat(C, 'C');
        infoEl.innerHTML = '<span style="color:var(--text2);">C[i][j] = sum(A[i][k] × B[k][j])</span>';
        var steps = [
            { description: 'C[0][0] = A[0][0]×B[0][0] + A[0][1]×B[1][0] = 1×(-1) + 2×0 = -1',
              action: function() { C[0][0] = -1; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[0][0] = 1×(-1) + 2×0 = <strong>-1</strong>'; },
              undo: function() { C[0][0] = 0; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = '<span style="color:var(--text2);">C[i][j] = sum(A[i][k] × B[k][j])</span>'; }
            },
            { description: 'C[0][1] = A[0][0]×B[0][1] + A[0][1]×B[1][1] = 1×0 + 2×3 = 6',
              action: function() { C[0][1] = 6; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[0][1] = 1×0 + 2×3 = <strong>6</strong>'; },
              undo: function() { C[0][1] = 0; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[0][0] = <strong>-1</strong>'; }
            },
            { description: 'C[1][0] = A[1][0]×B[0][0] + A[1][1]×B[1][0] = 3×(-1) + 4×0 = -3',
              action: function() { C[1][0] = -3; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[1][0] = 3×(-1) + 4×0 = <strong>-3</strong>'; },
              undo: function() { C[1][0] = 0; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[0][1] = <strong>6</strong>'; }
            },
            { description: 'C[1][1] = A[1][0]×B[0][1] + A[1][1]×B[1][1] = 3×0 + 4×3 = 12. 완성!',
              action: function() { C[1][1] = 12; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! C = [[-1,6],[-3,12]]</strong>'; },
              undo: function() { C[1][1] = 0; matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C'); infoEl.innerHTML = 'C[1][0] = <strong>-3</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 7: 행렬 제곱 (boj-10830)
    // ====================================================================
    _renderVizMatPow(container) {
        var self = this, suffix = '-matpow';
        var M = [[1,2],[3,4]], MOD = 1000, B = 5;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">행렬 거듭제곱</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[[1,2],[3,4]]<sup>5</sup> mod 1000 을 분할정복으로 계산합니다.</p>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=(r[i][j]+X[i][k]*Y[k][j])%MOD; return r; }
        function showM(m,label) { return '<div style="display:inline-block;vertical-align:middle;margin:0 6px;"><div style="font-size:0.75rem;color:var(--text3);">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:6px;display:inline-grid;grid-template-columns:1fr 1fr;gap:2px;">' + m[0][0] + ' ' + m[0][1] + '<br>' + m[1][0] + ' ' + m[1][1] + '</div></div>'; }
        var M1 = [[1%MOD,2%MOD],[3%MOD,4%MOD]];
        var M2 = mm(M1,M1);
        var M4 = mm(M2,M2);
        var M5 = mm(M4,M1);
        matEl.innerHTML = 'M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M (홀수)';
        infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 행렬을 거듭제곱합니다.</span>';
        var steps = [
            { description: 'M^5 = (M^2)^2 × M. 먼저 M^2를 구합니다.',
              action: function() { matEl.innerHTML = 'M<sup>5</sup> → M<sup>2</sup> 먼저 계산!'; infoEl.innerHTML = '홀수 지수: M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M'; },
              undo: function() { matEl.innerHTML = 'M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M (홀수)'; infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 행렬을 거듭제곱합니다.</span>'; }
            },
            { description: 'M^2 = M × M = [[7,10],[15,22]]',
              action: function() { matEl.innerHTML = showM(M2, 'M²'); infoEl.innerHTML = 'M<sup>2</sup> = [[' + M2[0].join(',') + '],[' + M2[1].join(',') + ']]'; },
              undo: function() { matEl.innerHTML = 'M<sup>5</sup> → M<sup>2</sup> 먼저 계산!'; infoEl.innerHTML = '홀수 지수: M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M'; }
            },
            { description: 'M^4 = M^2 × M^2 = [[' + M4[0].join(',') + '],[' + M4[1].join(',') + ']]',
              action: function() { matEl.innerHTML = showM(M4, 'M⁴'); infoEl.innerHTML = 'M<sup>4</sup> = M<sup>2</sup> × M<sup>2</sup> = [[' + M4[0].join(',') + '],[' + M4[1].join(',') + ']]'; },
              undo: function() { matEl.innerHTML = showM(M2, 'M²'); infoEl.innerHTML = 'M<sup>2</sup> = [[' + M2[0].join(',') + '],[' + M2[1].join(',') + ']]'; }
            },
            { description: 'M^5 = M^4 × M = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]',
              action: function() { matEl.innerHTML = showM(M5, 'M⁵'); infoEl.innerHTML = 'M<sup>5</sup> = M<sup>4</sup> × M = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]'; },
              undo: function() { matEl.innerHTML = showM(M4, 'M⁴'); infoEl.innerHTML = 'M<sup>4</sup> = [[' + M4[0].join(',') + '],[' + M4[1].join(',') + ']]'; }
            },
            { description: '완성! M^5 mod 1000 = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]',
              action: function() { matEl.innerHTML = showM(M5, 'M⁵ mod 1000'); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! 총 3번의 행렬 곱셈 (log₂5 ≈ 3)</strong>'; },
              undo: function() { matEl.innerHTML = showM(M5, 'M⁵'); infoEl.innerHTML = 'M<sup>5</sup> = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 8: 피보나치 수 6 (boj-11444)
    // ====================================================================
    _renderVizFibMat(container) {
        var self = this, suffix = '-fibmat';
        var n = 10, MOD = 1000000007;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">피보나치 수 (행렬 거듭제곱)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[[1,1],[1,0]]<sup>' + n + '</sup> 의 [0][1]이 F(' + n + ')입니다.</p>' +
            '<div id="dc-fib' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var fibEl = container.querySelector('#dc-fib' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=r[i][j]+X[i][k]*Y[k][j]; return r; }
        var base = [[1,1],[1,0]];
        var M1 = [[1,1],[1,0]];
        var M2 = mm(M1,M1); // ^2
        var M4 = mm(M2,M2); // ^4
        var M5 = mm(M4,M1); // ^5
        var M8 = mm(M4,M4); // ^8
        var M10 = mm(M8,M2); // ^10
        fibEl.textContent = '[[1,1],[1,0]]^' + n + ' 을 분할정복으로 구합니다.';
        infoEl.innerHTML = '<span style="color:var(--text2);">F(' + n + ') = [[1,1],[1,0]]^' + n + ' 의 [0][1] 원소</span>';
        var steps = [
            { description: 'M^10 = M^5 × M^5. 짝수이므로 반으로!',
              action: function() { fibEl.innerHTML = 'M<sup>10</sup> = M<sup>5</sup> × M<sup>5</sup> (짝수: 반×반)'; infoEl.innerHTML = '10은 짝수 → <strong>M^5를 먼저 구합니다</strong>'; },
              undo: function() { fibEl.textContent = '[[1,1],[1,0]]^' + n + ' 을 분할정복으로 구합니다.'; infoEl.innerHTML = '<span style="color:var(--text2);">F(' + n + ') = [[1,1],[1,0]]^' + n + ' 의 [0][1] 원소</span>'; }
            },
            { description: 'M^5 = M^2 × M^2 × M. 홀수이므로 반×반×M!',
              action: function() { fibEl.innerHTML = 'M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M (홀수)'; infoEl.innerHTML = '5는 홀수 → M<sup>2</sup> × M<sup>2</sup> × M'; },
              undo: function() { fibEl.innerHTML = 'M<sup>10</sup> = M<sup>5</sup> × M<sup>5</sup> (짝수: 반×반)'; infoEl.innerHTML = '10은 짝수 → <strong>M^5를 먼저 구합니다</strong>'; }
            },
            { description: 'M^2 = [[2,1],[1,1]]. M^5 = [[8,5],[5,3]]',
              action: function() { fibEl.innerHTML = 'M<sup>2</sup> = [[' + M2[0].join(',') + '],[' + M2[1].join(',') + ']]<br>M<sup>5</sup> = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]'; infoEl.innerHTML = 'M<sup>2</sup>와 M<sup>5</sup> 계산 완료'; },
              undo: function() { fibEl.innerHTML = 'M<sup>5</sup> = M<sup>2</sup> × M<sup>2</sup> × M (홀수)'; infoEl.innerHTML = '5는 홀수 → M<sup>2</sup> × M<sup>2</sup> × M'; }
            },
            { description: 'M^10 = M^5 × M^5 = [[' + M10[0].join(',') + '],[' + M10[1].join(',') + ']]',
              action: function() { fibEl.innerHTML = 'M<sup>10</sup> = [[' + M10[0].join(',') + '],[' + M10[1].join(',') + ']]'; infoEl.innerHTML = 'M<sup>10</sup>[0][1] = <strong>' + M10[0][1] + '</strong> = F(10)'; },
              undo: function() { fibEl.innerHTML = 'M<sup>2</sup> = [[' + M2[0].join(',') + '],[' + M2[1].join(',') + ']]<br>M<sup>5</sup> = [[' + M5[0].join(',') + '],[' + M5[1].join(',') + ']]'; infoEl.innerHTML = 'M<sup>2</sup>와 M<sup>5</sup> 계산 완료'; }
            },
            { description: '완성! F(10) = ' + M10[0][1] + ' (실제로 F(10)=55)',
              action: function() { fibEl.innerHTML = 'F(' + n + ') = M<sup>' + n + '</sup>[0][1] = <strong style="font-size:1.2rem;color:var(--green);">' + M10[0][1] + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ F(' + n + ') = ' + M10[0][1] + ' (O(log n)에 계산!)</strong>'; },
              undo: function() { fibEl.innerHTML = 'M<sup>10</sup> = [[' + M10[0].join(',') + '],[' + M10[1].join(',') + ']]'; infoEl.innerHTML = 'M<sup>10</sup>[0][1] = <strong>' + M10[0][1] + '</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 9: 히스토그램 (boj-6549)
    // ====================================================================
    _renderVizHisto(container) {
        var self = this, suffix = '-histo';
        var bars = [2, 1, 4, 5, 1, 3, 3];
        var maxH = 6;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">히스토그램에서 가장 큰 직사각형</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">높이: [' + bars.join(', ') + ']. 분할정복으로 최대 직사각형을 찾습니다.</p>' +
            '<div id="dc-bars' + suffix + '" style="display:flex;gap:2px;align-items:flex-end;height:160px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#dc-bars' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        function renderBars(highlights, rectRange) {
            barsEl.innerHTML = bars.map(function(h, i) {
                var pct = (h / maxH) * 100;
                var bg = 'var(--accent)';
                var extra = '';
                if (highlights && highlights[i]) { bg = highlights[i]; }
                if (rectRange && i >= rectRange.l && i <= rectRange.r) { extra = 'box-shadow:0 0 6px var(--green)40;'; bg = 'var(--green)'; }
                return '<div style="width:40px;height:' + (pct/100*160) + 'px;background:' + bg + ';border-radius:4px 4px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:0.8rem;font-weight:600;color:white;' + extra + '">' + h + '</div>';
            }).join('');
        }
        renderBars(null, null);
        infoEl.innerHTML = '<span style="color:var(--text2);">배열을 반으로 나누고, 왼/오/가운데 걸침 중 최대를 구합니다.</span>';
        var steps = [
            { description: '전체 [0..6]을 반으로 나눕니다: 왼쪽 [0..3], 오른쪽 [4..6]',
              action: function() { var h = {}; for(var i=0;i<=3;i++) h[i]='var(--accent)'; for(var i=4;i<=6;i++) h[i]='#6c5ce7'; renderBars(h, null); infoEl.innerHTML = '왼쪽 [0..3] (파랑), 오른쪽 [4..6] (보라)'; },
              undo: function() { renderBars(null, null); infoEl.innerHTML = '<span style="color:var(--text2);">배열을 반으로 나누고, 왼/오/가운데 걸침 중 최대를 구합니다.</span>'; }
            },
            { description: '왼쪽 [0..3] 최대: 높이 4,5 → 넓이 4×2=8',
              action: function() { renderBars(null, {l:2,r:3}); infoEl.innerHTML = '왼쪽 최대: bars[2..3], 높이 min(4,5)=4, 넓이 = 4×2 = <strong>8</strong>'; },
              undo: function() { var h = {}; for(var i=0;i<=3;i++) h[i]='var(--accent)'; for(var i=4;i<=6;i++) h[i]='#6c5ce7'; renderBars(h, null); infoEl.innerHTML = '왼쪽 [0..3] (파랑), 오른쪽 [4..6] (보라)'; }
            },
            { description: '오른쪽 [4..6] 최대: 높이 3,3 → 넓이 3×2=6',
              action: function() { renderBars(null, {l:5,r:6}); infoEl.innerHTML = '오른쪽 최대: bars[5..6], 높이 min(3,3)=3, 넓이 = 3×2 = <strong>6</strong>'; },
              undo: function() { renderBars(null, {l:2,r:3}); infoEl.innerHTML = '왼쪽 최대: bars[2..3], 넓이 = <strong>8</strong>'; }
            },
            { description: '가운데 걸치는 경우: mid=3에서 시작하여 양쪽으로 확장',
              action: function() { var h = {}; h[3] = 'var(--red)'; h[4] = 'var(--red)'; renderBars(h, null); infoEl.innerHTML = '중앙: bars[3]=5, bars[4]=1 → 높이 min(5,1)=1, 넓이=1×2=2'; },
              undo: function() { renderBars(null, {l:5,r:6}); infoEl.innerHTML = '오른쪽 최대: 넓이 = <strong>6</strong>'; }
            },
            { description: '왼쪽으로 확장: bars[2]=4 → min(1,4)=1, 넓이=1×3=3',
              action: function() { var h = {}; h[2]=h[3]=h[4]='var(--red)'; renderBars(h, null); infoEl.innerHTML = '확장: [2..4], 높이 min(4,5,1)=1, 넓이=1×3=3'; },
              undo: function() { var h = {}; h[3] = 'var(--red)'; h[4] = 'var(--red)'; renderBars(h, null); infoEl.innerHTML = '중앙: [3..4], 넓이=2'; }
            },
            { description: '오른쪽으로 확장: bars[5]=3 → min(1,3)=1, 넓이=1×4=4. 가운데 최대=4',
              action: function() { var h = {}; h[2]=h[3]=h[4]=h[5]='var(--red)'; renderBars(h, null); infoEl.innerHTML = '확장: [2..5], 높이 min=1, 넓이=1×4=4. 가운데 최대: <strong>4</strong>'; },
              undo: function() { var h = {}; h[2]=h[3]=h[4]='var(--red)'; renderBars(h, null); infoEl.innerHTML = '확장: [2..4], 넓이=3'; }
            },
            { description: '완성! max(왼쪽 8, 오른쪽 6, 가운데 4) = 8',
              action: function() { renderBars(null, {l:2,r:3}); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최대 직사각형 넓이 = 8 (bars[2..3], 높이 4)</strong>'; },
              undo: function() { var h = {}; h[2]=h[3]=h[4]=h[5]='var(--red)'; renderBars(h, null); infoEl.innerHTML = '가운데 최대: <strong>4</strong>'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '영역 나누기', desc: '2D 영역을 재귀로 분할 (Silver)', problemIds: ['boj-2630', 'boj-1992', 'boj-1780'] },
        { num: 2, title: '거듭제곱', desc: '분할정복 거듭제곱 (Silver~Gold)', problemIds: ['boj-1629', 'boj-11401'] },
        { num: 3, title: '행렬', desc: '행렬 곱셈 + 거듭제곱 (Silver~Gold)', problemIds: ['boj-2740', 'boj-10830', 'boj-11444'] },
        { num: 4, title: '심화', desc: '구간 분할정복 (Platinum)', problemIds: ['boj-6549'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 영역 나누기 ==========
        {
            id: 'boj-2630', title: 'BOJ 2630 - 색종이 만들기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2630',
            simIntro: '4×4 색종이를 재귀적으로 4등분하며 같은 색인지 확인하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×N 크기의 종이가 있습니다. 각 칸은 흰색(0) 또는 파란색(1)입니다. 전체가 같은 색이면 그대로 사용하고, 아니면 4등분하여 같은 과정을 반복합니다. 최종적으로 흰색 종이와 파란색 종이의 개수를 각각 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (2의 거듭제곱, 2 ≤ N ≤ 128)<br>둘째 줄부터 N×N 배열 (0 또는 1)</p></div><div><h4>출력</h4><p>첫째 줄에 흰색 종이 수, 둘째 줄에 파란색 종이 수</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>8\n1 1 0 0 0 0 1 1\n1 1 0 0 0 0 1 1\n0 0 1 1 1 1 0 0\n0 0 1 1 1 1 0 0\n1 0 0 0 1 1 1 1\n0 1 0 0 1 1 1 1\n0 0 1 1 1 1 1 1\n0 0 1 1 1 1 1 1</pre></div><div><strong>출력</strong><pre>9\n7</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '영역을 확인해서 모두 같은 색이면 카운트하고, 아니면 <strong>4등분</strong>해서 재귀 호출합니다.' },
                { title: '핵심 코드', content: '<code>solve(r, c, size)</code> 함수를 만들고, 모두 같으면 카운트, 아니면 <code>solve(r, c, size/2)</code> 4번 호출합니다.' },
                { title: '기저 조건', content: '영역이 1×1이면 무조건 해당 색을 카운트합니다. 또는 영역 내 모든 칸이 같은 색이면 카운트합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\n\nwhite = blue = 0\n\ndef solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n\n    if all_same:\n        if first == 0:\n            white += 1\n        else:\n            blue += 1\n    else:\n        half = size // 2\n        solve(r, c, half)\n        solve(r, c + half, half)\n        solve(r + half, c, half)\n        solve(r + half, c + half, half)\n\nsolve(0, 0, N)\nprint(white)\nprint(blue)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint paper[128][128];\nint N, white_cnt = 0, blue_cnt = 0;\n\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n\n    if (allSame) {\n        if (first == 0) white_cnt++;\n        else blue_cnt++;\n    } else {\n        int half = size / 2;\n        solve(r, c, half);\n        solve(r, c + half, half);\n        solve(r + half, c, half);\n        solve(r + half, c + half, half);\n    }\n}\n\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << white_cnt << "\\n" << blue_cnt << endl;\n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    static int[][] paper;\n    static int white = 0, blue = 0;\n\n    static void solve(int r, int c, int size) {\n        int first = paper[r][c];\n        boolean allSame = true;\n        for (int i = r; i < r + size && allSame; i++)\n            for (int j = c; j < c + size && allSame; j++)\n                if (paper[i][j] != first) allSame = false;\n        if (allSame) { if (first == 0) white++; else blue++; }\n        else {\n            int half = size / 2;\n            solve(r, c, half); solve(r, c + half, half);\n            solve(r + half, c, half); solve(r + half, c + half, half);\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt();\n        paper = new int[N][N];\n        for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) paper[i][j] = sc.nextInt();\n        solve(0, 0, N);\n        System.out.println(white); System.out.println(blue);\n    }\n}'
            },
            solutions: [{
                approach: '재귀 4등분',
                description: '영역이 같은 색이면 카운트, 아니면 4등분하여 재귀 호출합니다.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\nwhite = blue = 0' },
                        { title: '재귀 함수', code: 'def solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        if first == 0: white += 1\n        else: blue += 1\n    else:\n        half = size // 2\n        for dr in (0, half):\n            for dc in (0, half):\n                solve(r+dr, c+dc, half)' },
                        { title: '실행 및 출력', code: 'solve(0, 0, N)\nprint(white)\nprint(blue)' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1992', title: 'BOJ 1992 - 쿼드트리', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1992',
            simIntro: '4×4 영상을 쿼드트리 문자열로 압축하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>흑백 영상을 쿼드트리로 압축합니다. N×N 크기의 영상에서 모든 픽셀이 같으면 그 값을 출력하고, 다르면 4개 영역으로 나눈 결과를 괄호로 묶어 출력합니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (2의 거듭제곱, 1 ≤ N ≤ 64)<br>둘째 줄부터 N줄의 문자열 (0과 1로 구성)</p></div><div><h4>출력</h4><p>압축한 결과를 한 줄로 출력</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>8\n11110000\n11110000\n00011100\n00011100\n11110000\n11110000\n11110011\n11110011</pre></div><div><strong>출력</strong><pre>(110(0010)0(0110))</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '색종이 문제와 동일한 구조입니다. 대신 카운트 대신 <strong>문자열을 반환</strong>합니다.' },
                { title: '핵심 코드', content: '모두 같으면 그 값을 반환, 아니면 <code>"(" + 좌상 + 우상 + 좌하 + 우하 + ")"</code>를 반환합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]\n\ndef solve(r, c, size):\n    first = img[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if img[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half) + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\"\n\nprint(solve(0, 0, N))',
                cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint N;\nstring img[64];\nstring solve(int r, int c, int size) {\n    char first = img[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (img[i][j] != first) allSame = false;\n    if (allSame) return string(1, first);\n    int half = size / 2;\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n         + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n}\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> img[i];\n    cout << solve(0, 0, N) << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    static String[] img;\n    static String solve(int r, int c, int size) {\n        char first = img[r].charAt(c);\n        boolean allSame = true;\n        for (int i = r; i < r + size && allSame; i++)\n            for (int j = c; j < c + size && allSame; j++)\n                if (img[i].charAt(j) != first) allSame = false;\n        if (allSame) return String.valueOf(first);\n        int half = size / 2;\n        return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n             + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt();\n        img = new String[N];\n        for (int i = 0; i < N; i++) img[i] = sc.next();\n        System.out.println(solve(0, 0, N));\n    }\n}'
            },
            solutions: [{
                approach: '재귀 문자열 합치기',
                description: '모두 같으면 그 값, 아니면 4등분 결과를 괄호로 감쌉니다.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]' },
                        { title: '재귀 함수', code: 'def solve(r, c, size):\n    first = img[r][c]\n    all_same = all(img[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r,c,half) + solve(r,c+half,half) + solve(r+half,c,half) + solve(r+half,c+half,half) + \")\"' },
                        { title: '출력', code: 'print(solve(0, 0, N))' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1780', title: 'BOJ 1780 - 종이의 개수', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1780',
            simIntro: '3×3 종이를 9등분하며 같은 값인지 확인하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×N 크기의 종이가 있습니다. 각 칸에는 -1, 0, 1 중 하나가 저장되어 있습니다. 전체가 같은 수이면 그대로 사용하고, 아니면 <strong>9등분</strong>하여 같은 과정을 반복합니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (3의 거듭제곱, 1 ≤ N ≤ 2187)<br>둘째 줄부터 N×N 배열</p></div><div><h4>출력</h4><p>-1로만 채워진 종이 수, 0으로만 채워진 종이 수, 1로만 채워진 종이 수</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>9\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n0 1 -1 0 1 -1 0 1 -1\n0 -1 1 0 1 -1 0 1 -1\n0 1 -1 1 0 -1 0 1 -1</pre></div><div><strong>출력</strong><pre>10\n12\n11</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '색종이 문제와 같은 구조입니다. 차이점은 <strong>4등분이 아니라 9등분</strong>(3×3)이라는 것입니다.' },
                { title: '핵심 코드', content: '<code>solve(r, c, size)</code>에서 모두 같으면 카운트, 아니면 <code>third = size // 3</code>으로 9등분합니다.' },
                { title: '주의사항', content: 'N이 최대 2187(= 3^7)이므로 재귀 깊이가 최대 7입니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}\n\ndef solve(r, c, size):\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr * third, c + dc * third, third)\n\nsolve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])',
                cpp: '#include <iostream>\nusing namespace std;\nint paper[2187][2187];\nint N, cnt[3];\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n    if (allSame) { cnt[first + 1]++; }\n    else {\n        int t = size / 3;\n        for (int dr = 0; dr < 3; dr++)\n            for (int dc = 0; dc < 3; dc++)\n                solve(r + dr * t, c + dc * t, t);\n    }\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    static int[][] paper;\n    static int[] cnt = new int[3];\n    static void solve(int r, int c, int size) {\n        int first = paper[r][c];\n        boolean allSame = true;\n        for (int i = r; i < r + size && allSame; i++)\n            for (int j = c; j < c + size && allSame; j++)\n                if (paper[i][j] != first) allSame = false;\n        if (allSame) cnt[first + 1]++;\n        else {\n            int t = size / 3;\n            for (int dr = 0; dr < 3; dr++)\n                for (int dc = 0; dc < 3; dc++)\n                    solve(r + dr * t, c + dc * t, t);\n        }\n    }\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        paper = new int[N][N];\n        for (int i = 0; i < N; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            for (int j = 0; j < N; j++) paper[i][j] = Integer.parseInt(st.nextToken());\n        }\n        solve(0, 0, N);\n        System.out.println(cnt[0]); System.out.println(cnt[1]); System.out.println(cnt[2]);\n    }\n}'
            },
            solutions: [{
                approach: '재귀 9등분',
                description: '모두 같으면 카운트, 아니면 size/3으로 9등분 재귀합니다.',
                timeComplexity: 'O(N² log₃N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}' },
                        { title: '재귀 함수', code: 'def solve(r, c, size):\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr*third, c + dc*third, third)' },
                        { title: '실행 및 출력', code: 'solve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[2].templates; }
            }]
        },

        // ========== 2단계: 거듭제곱 ==========
        {
            id: 'boj-1629', title: 'BOJ 1629 - 곱셈', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1629',
            simIntro: 'A^B mod C를 지수를 반으로 나누며 계산하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>자연수 A, B, C가 주어졌을 때, A를 B번 곱한 수를 C로 나눈 나머지를 구하시오. (즉, A^B mod C)</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 A, B, C (2 ≤ A, B, C ≤ 2,147,483,647)</p></div><div><h4>출력</h4><p>A를 B번 곱한 수를 C로 나눈 나머지</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10 11 12</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'B가 최대 21억이므로 단순 반복은 불가능합니다. <strong>분할정복 거듭제곱</strong>으로 O(log B)에 풀어야 합니다.' },
                { title: '핵심 공식', content: 'B가 짝수: A^B = (A^(B/2))² mod C<br>B가 홀수: A^B = (A^(B/2))² × A mod C' },
                { title: '오버플로우 주의', content: 'C++/Java는 long long이 필요합니다. Python은 자동 처리됩니다.' }
            ],
            templates: {
                python: 'A, B, C = map(int, input().split())\n\ndef power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result\n\nprint(power(A, B, C))',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nll power(ll a, ll b, ll c) {\n    if (b == 1) return a % c;\n    ll half = power(a, b / 2, c);\n    ll result = half * half % c;\n    if (b % 2 == 1) result = result * a % c;\n    return result;\n}\nint main() {\n    ll A, B, C;\n    cin >> A >> B >> C;\n    cout << power(A, B, C) << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    static long power(long a, long b, long c) {\n        if (b == 1) return a % c;\n        long half = power(a, b / 2, c);\n        long result = half * half % c;\n        if (b % 2 == 1) result = result * a % c;\n        return result;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long A = sc.nextLong(), B = sc.nextLong(), C = sc.nextLong();\n        System.out.println(power(A, B, C));\n    }\n}'
            },
            solutions: [{
                approach: '분할정복 거듭제곱',
                description: '지수를 반으로 나누며 O(log B)에 계산합니다.',
                timeComplexity: 'O(log B)',
                spaceComplexity: 'O(log B)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'A, B, C = map(int, input().split())' },
                        { title: '거듭제곱 함수', code: 'def power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result' },
                        { title: '출력', code: 'print(power(A, B, C))' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-11401', title: 'BOJ 11401 - 이항 계수 3', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11401',
            simIntro: '페르마 소정리를 이용해 이항 계수를 모듈러 역원으로 계산하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>자연수 N과 정수 K가 주어졌을 때, 이항 계수 C(N, K)를 1,000,000,007로 나눈 나머지를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N과 K (1 ≤ N ≤ 4,000,000, 0 ≤ K ≤ N)</p></div><div><h4>출력</h4><p>C(N, K) mod 1,000,000,007</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 2</pre></div><div><strong>출력</strong><pre>10</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'C(N,K) = N! / (K! × (N-K)!)<br>나눗셈을 모듈러로 하려면 <strong>페르마 소정리</strong>를 사용합니다.' },
                { title: '핵심 공식', content: 'a^(-1) ≡ a^(p-2) mod p<br>C(N,K) mod p = N! × (K!)^(p-2) × ((N-K)!)^(p-2) mod p' },
                { title: '구현 단계', content: '1. 팩토리얼 배열 계산 2. 분할정복 거듭제곱으로 역원 3. 세 값을 곱하기' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD\n\ndef power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1: result = result * a % mod\n    return result\n\nans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\nll fac[4000001];\nll power(ll a, ll b, ll mod) {\n    if (b == 0) return 1;\n    if (b == 1) return a % mod;\n    ll half = power(a, b / 2, mod);\n    ll result = half * half % mod;\n    if (b % 2 == 1) result = result * a % mod;\n    return result;\n}\nint main() {\n    int N, K; cin >> N >> K;\n    fac[0] = 1;\n    for (int i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;\n    ll ans = fac[N];\n    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n    cout << ans << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    static final long MOD = 1_000_000_007;\n    static long power(long a, long b, long mod) {\n        if (b == 0) return 1;\n        if (b == 1) return a % mod;\n        long half = power(a, b / 2, mod);\n        long result = half * half % mod;\n        if (b % 2 == 1) result = result * a % mod;\n        return result;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), K = sc.nextInt();\n        long[] fac = new long[N + 1]; fac[0] = 1;\n        for (int i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;\n        long ans = fac[N];\n        ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n        ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n        System.out.println(ans);\n    }\n}'
            },
            solutions: [{
                approach: '팩토리얼 + 페르마 소정리',
                description: '팩토리얼을 미리 계산하고, 분할정복 거듭제곱으로 역원을 구합니다.',
                timeComplexity: 'O(N + log p)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 팩토리얼', code: 'MOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD' },
                        { title: '거듭제곱 (역원용)', code: 'def power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1:\n        result = result * a % mod\n    return result' },
                        { title: '결과 계산', code: 'ans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[4].templates; }
            }]
        },

        // ========== 3단계: 행렬 ==========
        {
            id: 'boj-2740', title: 'BOJ 2740 - 행렬 곱셈', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2740',
            simIntro: '2×2 행렬 곱셈을 단계별로 확인하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×M 크기의 행렬 A와 M×K 크기의 행렬 B가 주어졌을 때, 두 행렬을 곱한 결과를 출력하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N, M, 행렬 A, M, K, 행렬 B</p></div><div><h4>출력</h4><p>N×K 크기의 결과 행렬</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3 2\n1 2\n3 4\n5 6\n2 3\n-1 -2 0\n0 0 3</pre></div><div><strong>출력</strong><pre>-1 -2 6\n-3 -6 12\n-5 -10 18</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '기본 행렬 곱셈입니다. <strong>행렬 거듭제곱의 기초</strong>가 됩니다.' },
                { title: '핵심 공식', content: 'C[i][j] = sum(A[i][k] × B[k][j]). 3중 반복문으로 구현합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]\n\nC = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]\n\nfor row in C:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int N, M, M2, K;\n    cin >> N >> M;\n    int A[100][100], B[100][100], C[100][100] = {};\n    for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) cin >> A[i][j];\n    cin >> M2 >> K;\n    for (int i = 0; i < M; i++) for (int j = 0; j < K; j++) cin >> B[i][j];\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < K; j++)\n            for (int k = 0; k < M; k++)\n                C[i][j] += A[i][k] * B[k][j];\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < K; j++) cout << C[i][j] << (j < K-1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), M = sc.nextInt();\n        int[][] A = new int[N][M];\n        for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) A[i][j] = sc.nextInt();\n        int M2 = sc.nextInt(), K = sc.nextInt();\n        int[][] B = new int[M][K];\n        for (int i = 0; i < M; i++) for (int j = 0; j < K; j++) B[i][j] = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < N; i++) {\n            for (int j = 0; j < K; j++) {\n                int sum = 0;\n                for (int k = 0; k < M; k++) sum += A[i][k] * B[k][j];\n                if (j > 0) sb.append(\' \'); sb.append(sum);\n            }\n            sb.append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '3중 반복문',
                description: 'C[i][j] = sum(A[i][k] * B[k][j])로 직접 계산합니다.',
                timeComplexity: 'O(N × M × K)',
                spaceComplexity: 'O(N × K)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'N, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]' },
                        { title: '행렬 곱셈', code: 'C = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]' },
                        { title: '출력', code: 'for row in C:\n    print(\' \'.join(map(str, row)))' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-10830', title: 'BOJ 10830 - 행렬 제곱', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10830',
            simIntro: '행렬 거듭제곱을 분할정복으로 수행하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N×N 크기의 행렬 A가 주어졌을 때, A의 B제곱을 구하시오. 각 원소를 1,000으로 나눈 나머지를 출력합니다.</p><div class="problem-io"><div><h4>입력</h4><p>N, B (2 ≤ N ≤ 5, 1 ≤ B ≤ 100,000,000,000)</p></div><div><h4>출력</h4><p>N×N 결과 행렬 (각 원소 mod 1000)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>2 5\n1 2\n3 4</pre></div><div><strong>출력</strong><pre>69 558\n837 406</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'B가 최대 1000억이므로 <strong>분할정복 거듭제곱</strong>을 행렬에 적용합니다.' },
                { title: '핵심 코드', content: '행렬 곱셈 함수를 만들고, 숫자 대신 <strong>행렬</strong>을 곱합니다.' },
                { title: '기저 조건', content: 'B=1이면 행렬 A 자체를 반환 (mod 처리).' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nresult = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\ntypedef long long ll;\ntypedef vector<vector<ll>> Matrix;\nint N; ll B;\nconst int MOD = 1000;\nMatrix mat_mul(const Matrix& X, const Matrix& Y) {\n    Matrix C(N, vector<ll>(N, 0));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            for (int k = 0; k < N; k++)\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD;\n    return C;\n}\nMatrix mat_pow(Matrix M, ll b) {\n    if (b == 1) { for (int i=0;i<N;i++) for (int j=0;j<N;j++) M[i][j]%=MOD; return M; }\n    Matrix half = mat_pow(M, b/2);\n    Matrix result = mat_mul(half, half);\n    if (b%2==1) result = mat_mul(result, M);\n    return result;\n}\nint main() {\n    cin >> N >> B;\n    Matrix A(N, vector<ll>(N));\n    for (int i=0;i<N;i++) for (int j=0;j<N;j++) cin >> A[i][j];\n    Matrix result = mat_pow(A, B);\n    for (int i=0;i<N;i++) { for (int j=0;j<N;j++) cout << result[i][j] << (j<N-1?" ":""); cout << "\\n"; }\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    static int N; static final int MOD = 1000;\n    static long[][] matMul(long[][] X, long[][] Y) {\n        long[][] C = new long[N][N];\n        for (int i=0;i<N;i++) for (int j=0;j<N;j++) for (int k=0;k<N;k++)\n            C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD;\n        return C;\n    }\n    static long[][] matPow(long[][] M, long b) {\n        if (b == 1) { long[][] R = new long[N][N]; for (int i=0;i<N;i++) for (int j=0;j<N;j++) R[i][j]=M[i][j]%MOD; return R; }\n        long[][] half = matPow(M, b/2);\n        long[][] result = matMul(half, half);\n        if (b%2==1) result = matMul(result, M);\n        return result;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        N = sc.nextInt(); long B = sc.nextLong();\n        long[][] A = new long[N][N];\n        for (int i=0;i<N;i++) for (int j=0;j<N;j++) A[i][j]=sc.nextLong();\n        long[][] result = matPow(A, B);\n        StringBuilder sb = new StringBuilder();\n        for (int i=0;i<N;i++) { for (int j=0;j<N;j++) { if(j>0) sb.append(\' \'); sb.append(result[i][j]); } sb.append(\'\\n\'); }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '행렬 분할정복 거듭제곱',
                description: '숫자 거듭제곱과 동일한 원리를 행렬에 적용합니다.',
                timeComplexity: 'O(N³ log B)',
                spaceComplexity: 'O(N² log B)',
                codeSteps: {
                    python: [
                        { title: '입력 및 행렬 곱셈', code: 'N, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C' },
                        { title: '행렬 거듭제곱', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: '출력', code: 'result = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-11444', title: 'BOJ 11444 - 피보나치 수 6', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11444',
            simIntro: '[[1,1],[1,0]]^n 행렬 거듭제곱으로 피보나치 수를 구하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>피보나치 수열의 n번째 수를 1,000,000,007로 나눈 나머지를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>n (1 ≤ n ≤ 1,000,000,000,000,000,000)</p></div><div><h4>출력</h4><p>n번째 피보나치 수 mod 1,000,000,007</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>1000</pre></div><div><strong>출력</strong><pre>517691607</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'n이 최대 10^18이므로 <strong>행렬 거듭제곱</strong>이 필요합니다. [[1,1],[1,0]]^n의 [0][1]이 F(n)입니다.' },
                { title: '행렬 거듭제곱 원리', content: '[[F(n+1), F(n)], [F(n), F(n-1)]] = [[1,1],[1,0]]^n' },
                { title: '구현', content: '10830번(행렬 제곱) 코드를 2×2 행렬로 재사용합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nn = int(input())\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0] + X[0][1]*Y[1][0]) % MOD,\n         (X[0][0]*Y[0][1] + X[0][1]*Y[1][1]) % MOD],\n        [(X[1][0]*Y[0][0] + X[1][1]*Y[1][0]) % MOD,\n         (X[1][0]*Y[0][1] + X[1][1]*Y[1][1]) % MOD]\n    ]\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nif n <= 1:\n    print(n)\nelse:\n    base = [[1, 1], [1, 0]]\n    result = mat_pow(base, n)\n    print(result[0][1])',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\ntypedef ll Matrix[2][2];\nvoid mat_mul(Matrix A, Matrix B, Matrix C) {\n    ll temp[2][2] = {};\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) for (int k=0;k<2;k++)\n        temp[i][j] = (temp[i][j] + A[i][k]*B[k][j]) % MOD;\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) C[i][j]=temp[i][j];\n}\nvoid mat_pow(Matrix M, ll b, Matrix result) {\n    if (b==1) { for(int i=0;i<2;i++) for(int j=0;j<2;j++) result[i][j]=M[i][j]%MOD; return; }\n    Matrix half; mat_pow(M,b/2,half);\n    mat_mul(half,half,result);\n    if (b%2==1) { Matrix tmp; for(int i=0;i<2;i++) for(int j=0;j<2;j++) tmp[i][j]=result[i][j]; mat_mul(tmp,M,result); }\n}\nint main() {\n    ll n; cin >> n;\n    if (n<=1) { cout << n; return 0; }\n    Matrix base = {{1,1},{1,0}}, result;\n    mat_pow(base,n,result);\n    cout << result[0][1] << endl;\n    return 0;\n}',
                java: 'import java.util.*;\npublic class Main {\n    static final long MOD = 1_000_000_007;\n    static long[][] matMul(long[][] A, long[][] B) {\n        long[][] C = new long[2][2];\n        for (int i=0;i<2;i++) for (int j=0;j<2;j++) for (int k=0;k<2;k++)\n            C[i][j] = (C[i][j] + A[i][k]*B[k][j]) % MOD;\n        return C;\n    }\n    static long[][] matPow(long[][] M, long b) {\n        if (b==1) { long[][] R = new long[2][2]; for(int i=0;i<2;i++) for(int j=0;j<2;j++) R[i][j]=M[i][j]%MOD; return R; }\n        long[][] half = matPow(M, b/2);\n        long[][] result = matMul(half, half);\n        if (b%2==1) result = matMul(result, M);\n        return result;\n    }\n    public static void main(String[] args) {\n        long n = new Scanner(System.in).nextLong();\n        if (n<=1) { System.out.println(n); return; }\n        long[][] base = {{1,1},{1,0}};\n        long[][] result = matPow(base, n);\n        System.out.println(result[0][1]);\n    }\n}'
            },
            solutions: [{
                approach: '행렬 거듭제곱',
                description: '[[1,1],[1,0]]^n으로 F(n)을 O(log n)에 계산합니다.',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(log n)',
                codeSteps: {
                    python: [
                        { title: '행렬 곱셈', code: 'MOD = 1_000_000_007\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0]+X[0][1]*Y[1][0])%MOD,\n         (X[0][0]*Y[0][1]+X[0][1]*Y[1][1])%MOD],\n        [(X[1][0]*Y[0][0]+X[1][1]*Y[1][0])%MOD,\n         (X[1][0]*Y[0][1]+X[1][1]*Y[1][1])%MOD]\n    ]' },
                        { title: '행렬 거듭제곱', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j]%MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: '실행', code: 'n = int(input())\nif n <= 1:\n    print(n)\nelse:\n    base = [[1,1],[1,0]]\n    result = mat_pow(base, n)\n    print(result[0][1])  # F(n)' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[7].templates; }
            }]
        },

        // ========== 4단계: 심화 ==========
        {
            id: 'boj-6549', title: 'BOJ 6549 - 히스토그램에서 가장 큰 직사각형', difficulty: 'platinum',
            link: 'https://www.acmicpc.net/problem/6549',
            simIntro: '히스토그램을 분할정복으로 나누어 최대 직사각형을 찾는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>히스토그램에서 가장 큰 직사각형의 넓이를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>각 테스트 케이스: n과 n개의 높이. 0이면 종료.</p></div><div><h4>출력</h4><p>각 테스트 케이스에 대해 가장 큰 직사각형의 넓이</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>7 2 1 4 5 1 3 3\n4 1000 1000 1000 1000\n0</pre></div><div><strong>출력</strong><pre>8\n4000</pre></div></div></div>',
            hints: [
                { title: '분할정복 접근법', content: '배열을 반으로 나누면, 최대 직사각형은: ① 왼쪽에만 ② 오른쪽에만 ③ 가운데 걸침' },
                { title: '가운데 걸치는 경우', content: '중앙에서 시작하여 <strong>양쪽으로 확장</strong>. 높이가 높은 쪽으로 확장하며 최대 넓이 갱신.' },
                { title: '시간 복잡도', content: 'T(n) = 2T(n/2) + O(n) → <strong>O(n log n)</strong>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)\n    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))\n    return max(left_max, right_max, cross_max)\n\nwhile True:\n    line = list(map(int, input().split()))\n    if line[0] == 0: break\n    n = line[0]\n    heights = line[1:]\n    print(solve(heights, 0, n - 1))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint n; ll h[100001];\nll solve(int lo, int hi) {\n    if (lo == hi) return h[lo];\n    int mid = (lo + hi) / 2;\n    ll leftMax = solve(lo, mid), rightMax = solve(mid+1, hi);\n    int l = mid, r = mid + 1;\n    ll minH = min(h[l], h[r]), crossMax = minH * 2;\n    while (l > lo || r < hi) {\n        if (l > lo && (r >= hi || h[l-1] >= h[r+1])) { l--; minH = min(minH, h[l]); }\n        else { r++; minH = min(minH, h[r]); }\n        crossMax = max(crossMax, minH * (r - l + 1));\n    }\n    return max({leftMax, rightMax, crossMax});\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    while (cin >> n && n) {\n        for (int i = 0; i < n; i++) cin >> h[i];\n        cout << solve(0, n-1) << "\\n";\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\npublic class Main {\n    static long[] h;\n    static long solve(int lo, int hi) {\n        if (lo == hi) return h[lo];\n        int mid = (lo+hi)/2;\n        long leftMax = solve(lo, mid), rightMax = solve(mid+1, hi);\n        int l = mid, r = mid + 1;\n        long minH = Math.min(h[l], h[r]), crossMax = minH * 2;\n        while (l > lo || r < hi) {\n            if (l > lo && (r >= hi || h[l-1] >= h[r+1])) { l--; minH = Math.min(minH, h[l]); }\n            else { r++; minH = Math.min(minH, h[r]); }\n            crossMax = Math.max(crossMax, minH * (r - l + 1));\n        }\n        return Math.max(Math.max(leftMax, rightMax), crossMax);\n    }\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        String line;\n        while ((line = br.readLine()) != null) {\n            StringTokenizer st = new StringTokenizer(line);\n            int n = Integer.parseInt(st.nextToken());\n            if (n == 0) break;\n            h = new long[n];\n            for (int i = 0; i < n; i++) h[i] = Long.parseLong(st.nextToken());\n            sb.append(solve(0, n-1)).append(\'\\n\');\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '분할정복',
                description: '왼쪽/오른쪽/걸치는 경우로 나누어 최대 직사각형을 구합니다.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '분할정복 함수', code: 'def solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)' },
                        { title: '가운데 걸치는 경우', code: '    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))' },
                        { title: '최대값 반환', code: '    return max(left_max, right_max, cross_max)' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[8].templates; }
            }]
        }
    ]
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.divideconquer = divideConquerTopic;
