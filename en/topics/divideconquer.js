// ===== 분할정복 알고리즘 토픽 모듈 =====
var divideConquerTopic = {
    id: 'divideconquer',
    title: '분할정복',
    icon: '🔪',
    category: 'Algorithm Techniques',
    order: 11,
    description: '큰 문제를 작게 나눠서 풀고 합치는 기법',
    relatedNote: '분할정복은 병합 정렬, 퀵 정렬의 기반이며, FFT, 카라츠바 곱셈 등 고급 알고리즘에도 쓰입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

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
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        var diffMap = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || '분할정복이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
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
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
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
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
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
                    <strong>Understanding by analogy:</strong> 피자를 8명이 나눠 먹어야 합니다.<br><br>\
                    1. <strong>나누기(Divide)</strong>: 피자를 반으로 자릅니다 → 또 반으로 → 또 반으로 → 8조각!<br>\
                    2. <strong>풀기(Conquer)</strong>: 각 조각을 한 명씩 먹습니다.<br>\
                    3. <strong>합치기(Combine)</strong>: 모두가 배부르게 됩니다!<br><br>\
                    이렇게 <strong>큰 문제를 작은 문제로 나누고, 작은 문제를 풀고, 결과를 합치는 것</strong>이 분할정복입니다.<br>\
                    <a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Divide and Conquer ↗</a>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 이진 탐색 (분할정복의 가장 간단한 예)\ndef binary_search(arr, target, lo, hi):\n    if lo > hi:\n        return -1                    # 기저 조건: 찾을 범위 없음\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        return mid                   # 찾았다!\n    elif arr[mid] < target:\n        return binary_search(arr, target, mid + 1, hi)  # 오른쪽 절반\n    else:\n        return binary_search(arr, target, lo, mid - 1)  # 왼쪽 절반</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 이진 탐색 (분할정복의 가장 간단한 예)\nint binary_search(vector&lt;int&gt;&amp; arr, int target, int lo, int hi) {\n    if (lo &gt; hi)\n        return -1;                   // Base case: 찾을 범위 없음\n    int mid = (lo + hi) / 2;\n    if (arr[mid] == target)\n        return mid;                  // 찾았다!\n    else if (arr[mid] &lt; target)\n        return binary_search(arr, target, mid + 1, hi);  // 오른쪽 절반\n    else\n        return binary_search(arr, target, lo, mid - 1);  // 왼쪽 절반\n}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">1024개의 정렬된 숫자에서 이진 탐색으로 원하는 숫자를 찾으려면 최대 몇 번 비교해야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
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
                        <p>작은 문제의 답들을 <strong>합쳐서</strong> 원래 큰 문제의 답을 만듭니다.<br>\
                        <a href="https://en.wikipedia.org/wiki/Merge_sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Merge Sort ↗</a></p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 합병 정렬 (Merge Sort) — 분할정복의 대표 예시\ndef merge_sort(arr):\n    if len(arr) <= 1:       # 기저 조건\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])    # 1. 왼쪽 절반 정렬\n    right = merge_sort(arr[mid:])   # 1. 오른쪽 절반 정렬\n    return merge(left, right)       # 3. 합치기\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 합병 정렬 (Merge Sort) — 분할정복의 대표 예시\n#include &lt;vector&gt;\nusing namespace std;\n\nvector&lt;int&gt; merge(vector&lt;int&gt;&amp; left, vector&lt;int&gt;&amp; right) {\n    vector&lt;int&gt; result;\n    int i = 0, j = 0;\n    while (i &lt; left.size() &amp;&amp; j &lt; right.size()) {\n        if (left[i] &lt;= right[j])\n            result.push_back(left[i++]);\n        else\n            result.push_back(right[j++]);\n    }\n    while (i &lt; left.size()) result.push_back(left[i++]);   // 왼쪽 나머지\n    while (j &lt; right.size()) result.push_back(right[j++]); // 오른쪽 나머지\n    return result;\n}\n\nvector&lt;int&gt; merge_sort(vector&lt;int&gt; arr) {\n    if (arr.size() &lt;= 1) return arr;  // Base case\n\n    int mid = arr.size() / 2;\n    // vector 슬라이싱 (Python arr[:mid], arr[mid:]에 대응)\n    vector&lt;int&gt; left(arr.begin(), arr.begin() + mid);   // 1. 왼쪽 절반\n    vector&lt;int&gt; right(arr.begin() + mid, arr.end());     // 1. 오른쪽 절반\n    left = merge_sort(left);    // 2. 왼쪽 정렬\n    right = merge_sort(right);  // 2. 오른쪽 정렬\n    return merge(left, right);  // 3. 합치기\n}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">[5, 3, 1, 4, 2]를 합병 정렬하면, 나누기 단계에서 어떻게 쪼개질까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
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
                    예) 합병 정렬: 왼쪽/오른쪽 독립 → <strong>분할정복</strong> | 피보나치: F(3)을 여러 번 계산 → <strong>DP</strong><br>\
                    <a href="https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: 마스터 정리 (Master Theorem) ↗</a> — 분할정복의 시간 복잡도를 쉽게 구하는 공식\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"1부터 N까지의 합을 구하는 문제"는 분할정복으로 풀 수 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
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
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
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
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 (개념 탭에서는 빈 스텁) =====
    renderVisualize(container) {},

    // ===== 문제 탭 빈 스텁 =====
    renderProblem(container) {},

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
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
            if (idx < 0) { indicator.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        var actionDelay = 350;
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; updateUI(); setTimeout(function() { state.steps[state.currentStep].action(); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep; state.currentStep--; updateUI(); setTimeout(function() { state.steps[stepToUndo].undo(); }, actionDelay);
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
    // Simulation 1: 색종이 만들기 (boj-2630)
    // ====================================================================
    _renderVizPaper(container) {
        var self = this, suffix = '-paper';
        var DEFAULT_GRID = '0011/0011/1011/0111';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">색종이 만들기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 색종이를 재귀적으로 4등분하며 같은 색인지 확인합니다. (흰=0, 파랑=1)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행을 /로 구분): <input type="text" id="dc-paper-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-paper-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-paper-input');
        var resetBtn = container.querySelector('#dc-paper-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [];
                for (var j = 0; j < rows[i].length; j++) row.push(parseInt(rows[i][j]) || 0);
                g.push(row);
            }
            return g;
        }

        function cellStyle(v, hl) {
            var bg = v === 1 ? 'var(--accent)' : 'var(--bg2)';
            var extra = hl || '';
            return 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:' + bg + ';color:' + (v === 1 ? 'white' : 'var(--text)') + ';' + extra;
        }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',48px)';

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
            infoEl.innerHTML = '<span style="color:var(--text2);">' + SIZE + '×' + SIZE + ' 색종이를 검사합니다.</span>';

            // 재귀적으로 스텝을 생성
            var steps = [];
            var whiteCnt = 0, blueCnt = 0;

            function buildSteps(r, c, size, grid) {
                // 영역 내 모두 같은지 확인
                var first = grid[r][c];
                var allSame = true;
                for (var i = r; i < r + size && allSame; i++)
                    for (var j = c; j < c + size && allSame; j++)
                        if (grid[i][j] !== first) allSame = false;

                if (allSame) {
                    var color = first === 1 ? '파랑' : '흰색';
                    var borderColor = first === 1 ? 'var(--accent)' : 'var(--green)';
                    (function(r2,c2,sz,col,bc,f) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': 전부 ' + col + '! ' + col + '+1',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:3px solid ' + bc + ';box-shadow:0 0 8px ' + bc + '40;';
                                renderGrid(h);
                                if (f === 0) whiteCnt++; else blueCnt++;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': 전부 ' + col + ' → <strong>' + col + ' +1</strong> (흰:' + whiteCnt + ', 파:' + blueCnt + ')';
                            },
                            undo: function() {
                                if (f === 0) whiteCnt--; else blueCnt--;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, size, color, borderColor, first);
                } else {
                    (function(r2,c2,sz) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ' 검사: 색이 섞여 있음 → 4등분!',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:3px solid var(--red);';
                                renderGrid(h);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': 색이 다름 → <strong>4등분!</strong>';
                            },
                            undo: function() {
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, size);
                    var half = size / 2;
                    buildSteps(r, c, half, grid);
                    buildSteps(r, c + half, half, grid);
                    buildSteps(r + half, c, half, grid);
                    buildSteps(r + half, c + half, half, grid);
                }
            }
            whiteCnt = 0; blueCnt = 0;
            buildSteps(0, 0, SIZE, grid);
            var finalW = 0, finalB = 0;
            (function countAll(r,c,sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) { if(f===0) finalW++; else finalB++; }
                else { var h2=sz/2; countAll(r,c,h2); countAll(r,c+h2,h2); countAll(r+h2,c,h2); countAll(r+h2,c+h2,h2); }
            })(0,0,SIZE);
            steps.push({
                description: '완성! 흰색 ' + finalW + '개, 파란색 ' + finalB + '개',
                action: function() { renderGrid(null); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! 흰색: ' + finalW + '개, 파란색: ' + finalB + '개</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            whiteCnt = 0; blueCnt = 0;
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 2: 쿼드트리 (boj-1992)
    // ====================================================================
    _renderVizQuad(container) {
        var self = this, suffix = '-quad';
        var DEFAULT_GRID = '1100/1100/0010/0001';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">쿼드트리 압축</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 영상을 쿼드트리 문자열로 압축합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행을 /로 구분): <input type="text" id="dc-quad-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-quad-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:8px;"></div>' +
            '<div id="dc-result' + suffix + '" style="font-family:monospace;font-size:1.1rem;padding:8px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:30px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var resultEl = container.querySelector('#dc-result' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-quad-input');
        var resetBtn = container.querySelector('#dc-quad-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [];
                for (var j = 0; j < rows[i].length; j++) row.push(parseInt(rows[i][j]) || 0);
                g.push(row);
            }
            return g;
        }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',48px)';

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

            var steps = [];
            var resultStr = '';

            // 쿼드트리 결과 먼저 계산
            function quadResult(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) return '' + f;
                var h = sz/2;
                return '(' + quadResult(r,c,h) + quadResult(r,c+h,h) + quadResult(r+h,c,h) + quadResult(r+h,c+h,h) + ')';
            }
            var finalResult = quadResult(0, 0, SIZE);

            function buildSteps(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) {
                    (function(r2,c2,sz2,val) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 전부 ' + val + ' → "' + val + '"',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--green);';
                                renderGrid(h);
                                resultStr += '' + val;
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + ']: 전부 ' + val + ' → <strong>"' + val + '"</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz, f);
                } else {
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 색이 섞임 → "(" 시작, 4등분!',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--red);';
                                renderGrid(h);
                                resultStr += '(';
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 섞임 → <strong>"(" 열기</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                    var h = sz/2;
                    buildSteps(r, c, h);
                    buildSteps(r, c+h, h);
                    buildSteps(r+h, c, h);
                    buildSteps(r+h, c+h, h);
                    // 닫는 괄호
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ' 완료 → ")" 닫기',
                            action: function() {
                                renderGrid(null);
                                resultStr += ')';
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] 영역 완료 → <strong>")" 닫기</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                }
            }
            buildSteps(0, 0, SIZE);
            steps.push({
                description: '완성! 결과: ' + finalResult,
                action: function() { renderGrid(null); resultEl.textContent = finalResult; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! ' + finalResult + '</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            resultStr = '';
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 3: 종이의 개수 (boj-1780)
    // ====================================================================
    _renderVizNine(container) {
        var self = this, suffix = '-nine';
        var DEFAULT_GRID = '00-1/001/-110';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">종이의 개수 (9등분)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">3×3 종이를 검사합니다. 모두 같지 않으면 9등분(1×1)으로 분할합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (-1,0,1 / 행구분 /): <input type="text" id="dc-nine-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-nine-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-nine-input');
        var resetBtn = container.querySelector('#dc-nine-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [], s = rows[i], j = 0;
                while (j < s.length) {
                    if (s[j] === '-') { row.push(-1); j += 2; }
                    else { row.push(parseInt(s[j]) || 0); j++; }
                }
                g.push(row);
            }
            return g;
        }

        function colorOf(v) { return v === -1 ? '#e17055' : v === 0 ? 'var(--bg2)' : 'var(--accent)'; }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',56px)';

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
            infoEl.innerHTML = '<span style="color:var(--text2);">' + SIZE + '×' + SIZE + ' 종이를 검사합니다.</span>';

            var steps = [];
            var cnt = {'-1': 0, '0': 0, '1': 0};

            function buildSteps(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) {
                    (function(r2,c2,sz2,val) {
                        var borderColor = val === -1 ? '#e17055' : val === 0 ? 'var(--green)' : 'var(--accent)';
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 전부 ' + val + ' → ' + val + ' +1',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid ' + borderColor + ';box-shadow:0 0 6px ' + borderColor + '40;';
                                renderGrid(h);
                                cnt['' + val]++;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 전부 ' + val + ' → <strong>' + val + ' +1</strong> (-1:' + cnt['-1'] + ', 0:' + cnt['0'] + ', 1:' + cnt['1'] + ')';
                            },
                            undo: function() {
                                cnt['' + val]--;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz, f);
                } else {
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 값이 섞여 있음 → 9등분!',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--red);';
                                renderGrid(h);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 값이 다름 → <strong>9등분!</strong>';
                            },
                            undo: function() {
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                    var third = sz / 3;
                    for (var dr = 0; dr < 3; dr++)
                        for (var dc = 0; dc < 3; dc++)
                            buildSteps(r + dr * third, c + dc * third, third);
                }
            }
            buildSteps(0, 0, SIZE);
            // 최종 카운트 미리 계산
            var fCnt = {'-1': 0, '0': 0, '1': 0};
            (function countAll(r,c,sz) {
                var f = grid[r][c], ok = true;
                for(var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) { fCnt[''+f]++; }
                else { var t=sz/3; for(var dr=0;dr<3;dr++) for(var dc=0;dc<3;dc++) countAll(r+dr*t,c+dc*t,t); }
            })(0,0,SIZE);
            steps.push({
                description: '완성! -1: ' + fCnt['-1'] + '개, 0: ' + fCnt['0'] + '개, 1: ' + fCnt['1'] + '개',
                action: function() { renderGrid(null); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! -1: ' + fCnt['-1'] + '개, 0: ' + fCnt['0'] + '개, 1: ' + fCnt['1'] + '개</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            cnt = {'-1': 0, '0': 0, '1': 0};
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 4: 곱셈 - 빠른 거듭제곱 (boj-1629)
    // ====================================================================
    _renderVizPow(container) {
        var self = this, suffix = '-pow';
        var DEF_A = 10, DEF_B = 11, DEF_C = 12;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">빠른 거듭제곱</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">A<sup>B</sup> mod C 를 분할정복으로 계산합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">A: <input type="number" id="dc-pow-a" value="' + DEF_A + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">B: <input type="number" id="dc-pow-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">C: <input type="number" id="dc-pow-c" value="' + DEF_C + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-pow-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-tree' + suffix + '" style="margin-bottom:12px;padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpA = container.querySelector('#dc-pow-a');
        var inpB = container.querySelector('#dc-pow-b');
        var inpC = container.querySelector('#dc-pow-c');
        var resetBtn = container.querySelector('#dc-pow-reset');

        function buildAndRun(A, B, C) {
            if (C < 1) C = 1;
            if (B < 1) B = 1;
            treeEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 계산합니다.</span>';

            // Divide 트리를 만들기 위해 지수를 따라감
            var nodes = [];
            function buildTree(exp, depth) {
                var idx = nodes.length;
                nodes.push({exp: exp, depth: depth, value: null});
                if (exp > 1) buildTree(Math.floor(exp / 2), depth + 1);
            }
            buildTree(B, 0);

            function renderTree() {
                treeEl.innerHTML = nodes.map(function(n) {
                    var pad = '&nbsp;&nbsp;'.repeat(n.depth);
                    var val = n.value !== null ? ' = <strong style="color:var(--green);">' + n.value + '</strong>' : '';
                    return '<div style="padding:4px 0;">' + pad + A + '<sup>' + n.exp + '</sup> mod ' + C + val + '</div>';
                }).join('');
            }
            renderTree();

            var steps = [];
            // 나누기 스텝: 각 노드에 대해 분할 설명
            for (var i = 0; i < nodes.length - 1; i++) {
                (function(idx) {
                    var exp = nodes[idx].exp;
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: A + '^' + exp + ': ' + (odd ? '홀수' : '짝수') + ' → ' + A + '^' + half + ' × ' + A + '^' + half + (odd ? ' × ' + A : ''),
                        action: function() {
                            infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + A + '<sup>' + half + '</sup> × ' + A + '<sup>' + half + '</sup>' + (odd ? ' × ' + A : '') + ' (' + (odd ? '홀수: 반×반×밑' : '짝수: 반×반') + ')';
                        },
                        undo: function() {
                            infoEl.innerHTML = '(undo)';
                        }
                    });
                })(i);
            }
            // Base case
            var baseExp = nodes[nodes.length - 1].exp;
            var baseVal = A % C;
            (function(be, bv, lastIdx) {
                steps.push({
                    description: '기저 조건: ' + A + '^' + be + ' = ' + bv + ' (mod ' + C + ')',
                    action: function() { nodes[lastIdx].value = bv; renderTree(); infoEl.innerHTML = '기저: ' + A + '<sup>' + be + '</sup> mod ' + C + ' = <strong>' + bv + '</strong>'; },
                    undo: function() { nodes[lastIdx].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
                });
            })(baseExp, baseVal, nodes.length - 1);

            // Union 스텝: 아래에서 위로
            function pw(a, b, m) { var r = 1; a = a % m; if (a === 0) return 0; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }
            for (var i = nodes.length - 2; i >= 0; i--) {
                (function(idx) {
                    var exp = nodes[idx].exp;
                    var half = Math.floor(exp / 2);
                    var halfVal = pw(A, half, C);
                    var result = halfVal * halfVal % C;
                    if (exp % 2 === 1) result = result * (A % C) % C;
                    steps.push({
                        description: '합치기: ' + A + '^' + exp + ' = ' + halfVal + '×' + halfVal + (exp % 2 === 1 ? '×' + (A%C) : '') + ' mod ' + C + ' = ' + result,
                        action: function() { nodes[idx].value = result; renderTree(); infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + halfVal + ' × ' + halfVal + (exp % 2 === 1 ? ' × ' + (A%C) : '') + ' mod ' + C + ' = <strong>' + result + '</strong>'; },
                        undo: function() { nodes[idx].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
                    });
                })(i);
            }
            // Final result
            var finalVal = pw(A, B, C);
            steps.push({
                description: '완성! ' + A + '^' + B + ' mod ' + C + ' = ' + finalVal,
                action: function() { nodes[0].value = finalVal; renderTree(); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + A + '<sup>' + B + '</sup> mod ' + C + ' = ' + finalVal + '</strong>'; },
                undo: function() { nodes[0].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_A, DEF_B, DEF_C);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpA.value) || 2, parseInt(inpB.value) || 1, parseInt(inpC.value) || 1);
        });
    },

    // ====================================================================
    // Simulation 5: 이항 계수 3 (boj-11401)
    // ====================================================================
    _renderVizBinom(container) {
        var self = this, suffix = '-binom';
        var DEF_N = 5, DEF_K = 2, DEF_MOD = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">이항 계수 (페르마 소정리)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">C(N,K) mod P 를 팩토리얼 + 역원으로 계산합니다. (P는 소수)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="dc-binom-n" value="' + DEF_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">K: <input type="number" id="dc-binom-k" value="' + DEF_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">P(소수): <input type="number" id="dc-binom-mod" value="' + DEF_MOD + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-binom-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-calc' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var calcEl = container.querySelector('#dc-calc' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpN = container.querySelector('#dc-binom-n');
        var inpK = container.querySelector('#dc-binom-k');
        var inpMod = container.querySelector('#dc-binom-mod');
        var resetBtn = container.querySelector('#dc-binom-reset');

        function pw(a, b, m) { var r = 1; a = a % m; if (a === 0) return 0; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }

        function buildAndRun(N, K, MOD) {
            if (N < 0) N = 0;
            if (K < 0) K = 0;
            if (K > N) K = N;
            if (MOD < 2) MOD = 2;
            var fac = [1]; for (var i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;
            var invK = pw(fac[K], MOD - 2, MOD);
            var invNK = pw(fac[N - K], MOD - 2, MOD);
            var ans = fac[N] * invK % MOD * invNK % MOD;
            calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)';
            infoEl.innerHTML = '<span style="color:var(--text2);">페르마 소정리로 모듈러 역원을 구합니다.</span>';

            var facStr = fac.map(function(v,i){return i+'!='+v;}).join(', ');
            var steps = [
                { description: '팩토리얼 계산: ' + facStr + ' (mod ' + MOD + ')',
                  action: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; },
                  undo: function() { calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)'; infoEl.innerHTML = '<span style="color:var(--text2);">페르마 소정리로 모듈러 역원을 구합니다.</span>'; }
                },
                { description: '페르마 소정리: ' + K + '!의 역원 = ' + fac[K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invK,
                  action: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; }
                },
                { description: (N-K) + '!의 역원 = ' + fac[N-K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invNK,
                  action: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → 역원 = ' + fac[N-K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!의 모듈러 역원: <strong>' + invNK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; }
                },
                { description: '결합: ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = ' + ans,
                  action: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; },
                  undo: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → 역원 = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!의 모듈러 역원: <strong>' + invNK + '</strong>'; }
                },
                { description: '완성! C(' + N + ',' + K + ') mod ' + MOD + ' = ' + ans,
                  action: function() { calcEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong style="font-size:1.2rem;color:var(--green);">' + ans + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ C(' + N + ',' + K + ') mod ' + MOD + ' = ' + ans + '</strong>'; },
                  undo: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; }
                }
            ];
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_N, DEF_K, DEF_MOD);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpN.value) || 0, parseInt(inpK.value) || 0, parseInt(inpMod.value) || 7);
        });
    },

    // ====================================================================
    // Simulation 6: 행렬 곱셈 (boj-2740)
    // ====================================================================
    _renderVizMatMul(container) {
        var self = this, suffix = '-matmul';
        var DEF_A = '1,2;3,4', DEF_B = '-1,0;0,3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">행렬 곱셈</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">2×2 행렬 A × B를 단계별로 계산합니다. (행을 ;로 구분)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">A: <input type="text" id="dc-matmul-a" value="' + DEF_A + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<label style="font-weight:600;">B: <input type="text" id="dc-matmul-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<button class="btn btn-primary" id="dc-matmul-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpA = container.querySelector('#dc-matmul-a');
        var inpB = container.querySelector('#dc-matmul-b');
        var resetBtn = container.querySelector('#dc-matmul-reset');

        function parseMat(s) {
            return s.trim().split(';').map(function(row) { return row.split(',').map(function(v) { return parseInt(v) || 0; }); });
        }
        function showMat(m, label) {
            var cols = m[0].length;
            return '<div style="display:inline-block;margin:0 8px;vertical-align:middle;"><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:8px;display:inline-grid;grid-template-columns:repeat(' + cols + ',1fr);gap:4px;">' + m.map(function(row) { return row.map(function(v) { return '<span style="padding:4px 8px;text-align:center;">' + v + '</span>'; }).join(''); }).join('') + '</div></div>';
        }

        function buildAndRun(A, B) {
            var N = A.length, M = A[0].length, K = B[0].length;
            var C = [];
            for (var i = 0; i < N; i++) { C[i] = []; for (var j = 0; j < K; j++) C[i][j] = 0; }
            matEl.innerHTML = showMat(A, 'A') + ' × ' + showMat(B, 'B') + ' = ' + showMat(C, 'C');
            infoEl.innerHTML = '<span style="color:var(--text2);">C[i][j] = sum(A[i][k] × B[k][j])</span>';

            var steps = [];
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < K; j++) {
                    (function(ii, jj) {
                        var val = 0;
                        var parts = [];
                        for (var k = 0; k < M; k++) { val += A[ii][k] * B[k][jj]; parts.push(A[ii][k] + '×' + B[k][jj]); }
                        var isLast = (ii === N - 1 && jj === K - 1);
                        steps.push({
                            description: 'C[' + ii + '][' + jj + '] = ' + parts.join(' + ') + ' = ' + val + (isLast ? '. 완성!' : ''),
                            action: function() {
                                C[ii][jj] = val;
                                matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C');
                                if (isLast) {
                                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! C = [' + C.map(function(r){return '['+r.join(',')+']';}).join(',') + ']</strong>';
                                } else {
                                    infoEl.innerHTML = 'C[' + ii + '][' + jj + '] = ' + parts.join(' + ') + ' = <strong>' + val + '</strong>';
                                }
                            },
                            undo: function() {
                                C[ii][jj] = 0;
                                matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C');
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(i, j);
                }
            }
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseMat(DEF_A), parseMat(DEF_B));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseMat(inpA.value), parseMat(inpB.value));
        });
    },

    // ====================================================================
    // Simulation 7: 행렬 제곱 (boj-10830)
    // ====================================================================
    _renderVizMatPow(container) {
        var self = this, suffix = '-matpow';
        var DEF_MAT = '1,2;3,4', DEF_B = 5, DEF_MOD = 1000;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">행렬 거듭제곱</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">2×2 행렬의 거듭제곱을 분할정복으로 계산합니다. (행을 ;로 구분)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">행렬: <input type="text" id="dc-matpow-mat" value="' + DEF_MAT + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<label style="font-weight:600;">지수: <input type="number" id="dc-matpow-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">mod: <input type="number" id="dc-matpow-mod" value="' + DEF_MOD + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;"></label>' +
            '<button class="btn btn-primary" id="dc-matpow-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpMat = container.querySelector('#dc-matpow-mat');
        var inpB = container.querySelector('#dc-matpow-b');
        var inpMod = container.querySelector('#dc-matpow-mod');
        var resetBtn = container.querySelector('#dc-matpow-reset');

        function parseMat(s) {
            return s.trim().split(';').map(function(row) { return row.split(',').map(function(v) { return parseInt(v) || 0; }); });
        }
        function showM(m, label) {
            return '<div style="display:inline-block;vertical-align:middle;margin:0 6px;"><div style="font-size:0.75rem;color:var(--text3);">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:6px;display:inline-grid;grid-template-columns:1fr 1fr;gap:2px;">' + m[0][0] + ' ' + m[0][1] + '<br>' + m[1][0] + ' ' + m[1][1] + '</div></div>';
        }
        function matStr(m) { return '[[' + m[0].join(',') + '],[' + m[1].join(',') + ']]'; }

        function buildAndRun(M, B, MOD) {
            if (B < 1) B = 1;
            if (MOD < 1) MOD = 1;
            function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=(r[i][j]+X[i][k]*Y[k][j])%MOD; return r; }
            function matPow(base, exp) { if (exp === 1) return [[base[0][0]%MOD,base[0][1]%MOD],[base[1][0]%MOD,base[1][1]%MOD]]; var half = matPow(base, Math.floor(exp/2)); var result = mm(half,half); if (exp%2===1) result = mm(result,base); return result; }

            // Divide 과정에서의 지수 리스트 생성
            var exps = [];
            var e = B;
            while (e > 1) { exps.push(e); e = Math.floor(e / 2); }
            exps.push(e); // 기저 (1)

            matEl.innerHTML = 'M<sup>' + B + '</sup> mod ' + MOD + ' 을 분할정복으로 계산합니다.';
            infoEl.innerHTML = '<span style="color:var(--text2);">지수를 반으로 나누며 행렬을 거듭제곱합니다.</span>';

            var steps = [];
            // 나누기 과정: 위에서 아래로 (기저 제외)
            for (var i = 0; i < exps.length - 1; i++) {
                (function(exp) {
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: 'M^' + exp + ' = M^' + half + ' × M^' + half + (odd ? ' × M' : '') + ' (' + (odd ? '홀수' : '짝수') + ')',
                        action: function() { matEl.innerHTML = 'M<sup>' + exp + '</sup> → M<sup>' + half + '</sup> 먼저 계산!'; infoEl.innerHTML = (odd ? '홀수' : '짝수') + ' 지수: M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> × M<sup>' + half + '</sup>' + (odd ? ' × M' : ''); },
                        undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }
            // 기저: M^1 = M mod MOD
            var M1 = [[M[0][0]%MOD,M[0][1]%MOD],[M[1][0]%MOD,M[1][1]%MOD]];
            steps.push({
                description: 'M^1 = ' + matStr(M1) + ' (mod ' + MOD + ')',
                action: function() { matEl.innerHTML = showM(M1, 'M¹'); infoEl.innerHTML = '기저: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            // Union 과정: 아래에서 위로
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(M, exp);
                    var superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
                    var supStr = ('' + exp).split('').map(function(d){return superscripts[d]||d;}).join('');
                    steps.push({
                        description: 'M^' + exp + ' = ' + matStr(result),
                        action: function() { matEl.innerHTML = showM(result, 'M' + supStr); infoEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); },
                        undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }
            // 최종
            var finalM = matPow(M, B);
            steps.push({
                description: '완성! M^' + B + ' mod ' + MOD + ' = ' + matStr(finalM),
                action: function() { matEl.innerHTML = showM(finalM, 'M^' + B + ' mod ' + MOD); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! ' + matStr(finalM) + '</strong>'; },
                undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseMat(DEF_MAT), DEF_B, DEF_MOD);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseMat(inpMat.value), parseInt(inpB.value) || 1, parseInt(inpMod.value) || 1000);
        });
    },

    // ====================================================================
    // Simulation 8: 피보나치 수 6 (boj-11444)
    // ====================================================================
    _renderVizFibMat(container) {
        var self = this, suffix = '-fibmat';
        var DEF_N = 10;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">피보나치 수 (행렬 거듭제곱)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[[1,1],[1,0]]<sup>N</sup> 의 [0][1]이 F(N)입니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="dc-fibmat-n" value="' + DEF_N + '" min="1" max="50" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-fibmat-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">(시각화를 위해 1~50)</span>' +
            '</div>' +
            '<div id="dc-fib' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var fibEl = container.querySelector('#dc-fib' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpN = container.querySelector('#dc-fibmat-n');
        var resetBtn = container.querySelector('#dc-fibmat-reset');

        function buildAndRun(n) {
            if (n < 1) n = 1;
            if (n > 50) n = 50;
            function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=r[i][j]+X[i][k]*Y[k][j]; return r; }
            function matPow(base, exp) { if (exp === 1) return [[base[0][0],base[0][1]],[base[1][0],base[1][1]]]; var half = matPow(base, Math.floor(exp/2)); var result = mm(half,half); if (exp%2===1) result = mm(result,base); return result; }
            function matStr(m) { return '[[' + m[0].join(',') + '],[' + m[1].join(',') + ']]'; }

            fibEl.textContent = '[[1,1],[1,0]]^' + n + ' 을 분할정복으로 구합니다.';
            infoEl.innerHTML = '<span style="color:var(--text2);">F(' + n + ') = [[1,1],[1,0]]^' + n + ' 의 [0][1] 원소</span>';

            // 지수 분할 리스트
            var exps = [];
            var e = n;
            while (e > 1) { exps.push(e); e = Math.floor(e / 2); }
            exps.push(e);

            var base = [[1,1],[1,0]];
            var steps = [];

            // 나누기 과정
            for (var i = 0; i < exps.length - 1; i++) {
                (function(exp) {
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: 'M^' + exp + ' = M^' + half + ' × M^' + half + (odd ? ' × M' : '') + '. ' + (odd ? '홀수' : '짝수') + '이므로 ' + (odd ? '반×반×M' : '반×반') + '!',
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> × M<sup>' + half + '</sup>' + (odd ? ' × M' : '') + ' (' + (odd ? '홀수' : '짝수') + ')'; infoEl.innerHTML = exp + '은 ' + (odd ? '홀수' : '짝수') + ' → <strong>M^' + half + '를 먼저 구합니다</strong>'; },
                        undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }

            // 기저: M^1
            var M1 = [[1,1],[1,0]];
            steps.push({
                description: 'M^1 = [[1,1],[1,0]] (기저)',
                action: function() { fibEl.innerHTML = 'M<sup>1</sup> = ' + matStr(M1); infoEl.innerHTML = '기저: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });

            // Union 과정
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(base, exp);
                    steps.push({
                        description: 'M^' + exp + ' = ' + matStr(result),
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); infoEl.innerHTML = 'M<sup>' + exp + '</sup>[0][1] = <strong>' + result[0][1] + '</strong>'; },
                        undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }

            // Final result
            var finalM = matPow(base, n);
            var fibN = finalM[0][1];
            steps.push({
                description: '완성! F(' + n + ') = ' + fibN,
                action: function() { fibEl.innerHTML = 'F(' + n + ') = M<sup>' + n + '</sup>[0][1] = <strong style="font-size:1.2rem;color:var(--green);">' + fibN + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ F(' + n + ') = ' + fibN + ' (O(log n)에 계산!)</strong>'; },
                undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_N);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpN.value) || 10);
        });
    },

    // ====================================================================
    // Simulation 9: 히스토그램 (boj-6549)
    // ====================================================================
    _renderVizHisto(container) {
        var self = this, suffix = '-histo';
        var DEF_BARS = '2,1,4,5,1,3,3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">히스토그램에서 가장 큰 직사각형</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">분할정복으로 최대 직사각형을 찾습니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">높이 (쉼표 구분): <input type="text" id="dc-histo-input" value="' + DEF_BARS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="dc-histo-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-bars' + suffix + '" style="display:flex;gap:2px;align-items:flex-end;height:160px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#dc-bars' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-histo-input');
        var resetBtn = container.querySelector('#dc-histo-reset');

        function parseBars(s) { return s.trim().split(',').map(function(v) { return Math.max(0, parseInt(v) || 0); }).filter(function(v) { return v >= 0; }); }

        function buildAndRun(bars) {
            if (bars.length < 1) bars = [1];
            var maxH = Math.max.apply(null, bars) || 1;

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

            // Divide정복으로 최대 직사각형 (+ 어디서 나왔는지 추적)
            function solve(lo, hi) {
                if (lo === hi) return { area: bars[lo], l: lo, r: lo };
                var mid = Math.floor((lo + hi) / 2);
                var leftRes = solve(lo, mid);
                var rightRes = solve(mid + 1, hi);
                // 가운데 걸치는 경우
                var l = mid, r = mid + 1;
                var h = Math.min(bars[l], bars[r]);
                var crossMax = h * 2, cl = l, cr = r;
                while (l > lo || r < hi) {
                    if (l > lo && (r >= hi || bars[l-1] >= bars[r+1])) { l--; h = Math.min(h, bars[l]); }
                    else { r++; h = Math.min(h, bars[r]); }
                    if (h * (r - l + 1) > crossMax) { crossMax = h * (r - l + 1); cl = l; cr = r; }
                }
                var crossRes = { area: crossMax, l: cl, r: cr };
                if (leftRes.area >= rightRes.area && leftRes.area >= crossRes.area) return leftRes;
                if (rightRes.area >= crossRes.area) return rightRes;
                return crossRes;
            }

            var n = bars.length;
            var mid = Math.floor((n - 1) / 2);
            var leftRes = n > 1 ? solve(0, mid) : { area: bars[0], l: 0, r: 0 };
            var rightRes = n > 1 ? solve(mid + 1, n - 1) : { area: 0, l: 0, r: 0 };
            // 가운데 걸침
            var cl = mid, cr = mid + 1;
            if (cr >= n) cr = mid;
            var ch = n > 1 ? Math.min(bars[cl], bars[cr]) : bars[0];
            var crossMax = n > 1 ? ch * 2 : bars[0];
            var bestCl = cl, bestCr = cr;
            if (n > 1) {
                var tl = cl, tr = cr, th = ch;
                while (tl > 0 || tr < n - 1) {
                    if (tl > 0 && (tr >= n - 1 || bars[tl-1] >= bars[tr+1])) { tl--; th = Math.min(th, bars[tl]); }
                    else { tr++; th = Math.min(th, bars[tr]); }
                    if (th * (tr - tl + 1) > crossMax) { crossMax = th * (tr - tl + 1); bestCl = tl; bestCr = tr; }
                }
            }
            var crossRes = { area: crossMax, l: bestCl, r: bestCr };
            var best = leftRes;
            if (rightRes.area > best.area) best = rightRes;
            if (crossRes.area > best.area) best = crossRes;

            var steps = [];
            // 스텝 1: 반으로 나누기
            steps.push({
                description: '전체 [0..' + (n-1) + ']을 반으로 나눕니다: 왼쪽 [0..' + mid + '], 오른쪽 [' + (mid+1) + '..' + (n-1) + ']',
                action: function() {
                    var h = {};
                    for (var i = 0; i <= mid; i++) h[i] = 'var(--accent)';
                    for (var i = mid+1; i < n; i++) h[i] = '#6c5ce7';
                    renderBars(h, null);
                    infoEl.innerHTML = '왼쪽 [0..' + mid + '] (파랑), 오른쪽 [' + (mid+1) + '..' + (n-1) + '] (보라)';
                },
                undo: function() { renderBars(null, null); infoEl.innerHTML = '<span style="color:var(--text2);">배열을 반으로 나누고, 왼/오/가운데 걸침 중 최대를 구합니다.</span>'; }
            });
            // 스텝 2: 왼쪽 최대
            steps.push({
                description: '왼쪽 [0..' + mid + '] 최대: bars[' + leftRes.l + '..' + leftRes.r + '], 넓이=' + leftRes.area,
                action: function() { renderBars(null, {l: leftRes.l, r: leftRes.r}); infoEl.innerHTML = '왼쪽 최대: bars[' + leftRes.l + '..' + leftRes.r + '], 넓이 = <strong>' + leftRes.area + '</strong>'; },
                undo: function() { var h = {}; for (var i=0;i<=mid;i++) h[i]='var(--accent)'; for(var i=mid+1;i<n;i++) h[i]='#6c5ce7'; renderBars(h, null); infoEl.innerHTML = '왼쪽/오른쪽 분할'; }
            });
            // 스텝 3: 오른쪽 최대
            if (n > 1) {
                steps.push({
                    description: '오른쪽 [' + (mid+1) + '..' + (n-1) + '] 최대: bars[' + rightRes.l + '..' + rightRes.r + '], 넓이=' + rightRes.area,
                    action: function() { renderBars(null, {l: rightRes.l, r: rightRes.r}); infoEl.innerHTML = '오른쪽 최대: bars[' + rightRes.l + '..' + rightRes.r + '], 넓이 = <strong>' + rightRes.area + '</strong>'; },
                    undo: function() { renderBars(null, {l: leftRes.l, r: leftRes.r}); infoEl.innerHTML = '왼쪽 최대: <strong>' + leftRes.area + '</strong>'; }
                });
            }
            // 스텝 4: 가운데 걸침
            if (n > 1) {
                steps.push({
                    description: '가운데 걸치는 경우: mid=' + mid + '에서 양쪽 확장 → bars[' + bestCl + '..' + bestCr + '], 넓이=' + crossMax,
                    action: function() {
                        var h = {};
                        for (var i = bestCl; i <= bestCr; i++) h[i] = 'var(--red)';
                        renderBars(h, null);
                        infoEl.innerHTML = '가운데 걸침: bars[' + bestCl + '..' + bestCr + '], 넓이 = <strong>' + crossMax + '</strong>';
                    },
                    undo: function() { renderBars(null, {l: rightRes.l, r: rightRes.r}); infoEl.innerHTML = '오른쪽 최대: <strong>' + rightRes.area + '</strong>'; }
                });
            }
            // 스텝 5: 완성
            steps.push({
                description: '완성! max(왼쪽 ' + leftRes.area + ', 오른쪽 ' + rightRes.area + ', 가운데 ' + crossMax + ') = ' + best.area,
                action: function() { renderBars(null, {l: best.l, r: best.r}); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최대 직사각형 넓이 = ' + best.area + ' (bars[' + best.l + '..' + best.r + '])</strong>'; },
                undo: function() {
                    if (n > 1) { var h = {}; for (var i=bestCl;i<=bestCr;i++) h[i]='var(--red)'; renderBars(h, null); infoEl.innerHTML = '가운데 걸침: <strong>' + crossMax + '</strong>'; }
                    else { renderBars(null, null); infoEl.innerHTML = '(undo)'; }
                }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseBars(DEF_BARS));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseBars(inputEl.value));
        });
    },

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: '영역 나누기', desc: '2D 영역을 재귀로 분할 (Silver)', problemIds: ['boj-2630', 'boj-1992', 'boj-1780'] },
        { num: 2, title: '거듭제곱', desc: '분할정복 거듭제곱 (Silver~Gold)', problemIds: ['boj-1629', 'boj-11401'] },
        { num: 3, title: '행렬', desc: '행렬 곱셈 + 거듭제곱 (Silver~Gold)', problemIds: ['boj-2740', 'boj-10830', 'boj-11444'] },
        { num: 4, title: '심화', desc: '구간 분할정복 (Platinum)', problemIds: ['boj-6549'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== 1단계: 영역 나누기 ==========
        {
            id: 'boj-2630', title: 'BOJ 2630 - 색종이 만들기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2630',
            simIntro: '4×4 색종이를 재귀적으로 4등분하며 같은 색인지 확인하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>여러개의 정사각형칸들로 이루어진 정사각형 모양의 종이가 주어져 있고, 각 정사각형칸은 하얀색 또는 파란색으로 칠해져 있다. 주어진 종이를 일정한 규칙에 따라 잘라서 다양한 크기의 하얀색 또는 파란색 색종이를 만들려고 한다. 전체 종이가 모두 같은 색이면 그대로 사용하고, 아니면 4등분하여 재귀적으로 반복한다.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>8\n1 1 0 0 0 0 1 1\n1 1 0 0 0 0 1 1\n0 0 0 0 1 1 0 0\n0 0 0 0 1 1 0 0\n1 0 0 0 1 1 1 1\n0 1 0 0 1 1 1 1\n0 0 1 1 1 1 1 1\n0 0 1 1 1 1 1 1</pre></div>
        <div><strong>Output</strong><pre>9\n7</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N은 2, 4, 8, 16, 32, 64, 128 중 하나</li></ul>
`,
            hints: [
                { title: 'First intuition', content: '종이를 보고 "흰색 몇 개, 파란색 몇 개"를 세야 하니까, 일단 <strong>모든 칸을 하나하나 확인</strong>하면 되지 않을까?<br><br>근데 잠깐 — 문제를 다시 읽어보면, 단순히 칸 수를 세는 게 아니라 <strong>"같은 색으로 이루어진 색종이 조각의 수"</strong>를 세는 거야. 즉, 영역 전체가 같은 색이어야 하나의 색종이로 인정된다는 뜻이야.' },
                { title: 'But there\'s a problem with this', content: '그럼 "이 영역이 전부 같은 색인지" 어떻게 판단할까?<br><br>전체 종이가 같은 색이면 끝이지만, 아니면? 문제 규칙을 보면 <strong>4등분</strong>해서 각 부분을 다시 확인하라고 해. 이게 바로 <strong>분할정복</strong>이야!<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;margin-top:8px;font-size:0.9rem;">전체 확인 → 안 되면 4등분 → 각 부분 확인 → 안 되면 또 4등분 → ... → 1×1이면 무조건 카운트</div>' },
                { title: 'What if we try this?', content: '<code>solve(r, c, size)</code> 함수를 만들자:<br><br>① (r,c)부터 size×size 영역의 모든 칸이 같은 색인지 확인<br>② 같으면 → 해당 색 카운트 +1, 끝!<br>③ 다르면 → <code>half = size / 2</code>로 4등분해서 각각 재귀 호출<br><br><strong>기저 조건</strong>: 영역이 1×1이면 무조건 그 칸의 색을 카운트해. 더 나눌 수 없으니까!<br><br>시간복잡도는 매 단계마다 모든 칸을 확인하고, 깊이가 log₂N이니까 <strong>O(N² log N)</strong>이야.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\n\nwhite = blue = 0\n\ndef solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n\n    if all_same:\n        if first == 0:\n            white += 1\n        else:\n            blue += 1\n    else:\n        half = size // 2\n        solve(r, c, half)\n        solve(r, c + half, half)\n        solve(r + half, c, half)\n        solve(r + half, c + half, half)\n\nsolve(0, 0, N)\nprint(white)\nprint(blue)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint paper[128][128];\nint N, white_cnt = 0, blue_cnt = 0;\n\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n\n    if (allSame) {\n        if (first == 0) white_cnt++;\n        else blue_cnt++;\n    } else {\n        int half = size / 2;\n        solve(r, c, half);\n        solve(r, c + half, half);\n        solve(r + half, c, half);\n        solve(r + half, c + half, half);\n    }\n}\n\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << white_cnt << "\\n" << blue_cnt << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '재귀 4등분',
                description: '영역이 같은 색이면 카운트, 아니면 4등분하여 재귀 호출합니다.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'sys.stdin.readline으로 빠른 입력.\n2D 리스트와 흰/파 카운터를 준비합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\nwhite = blue = 0' },
                        { title: '재귀 함수', desc: '영역이 모두 같은 색이면 카운트하고 끝.\n다르면 4등분해서 각각 재귀 호출합니다.', code: 'def solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        if first == 0: white += 1\n        else: blue += 1\n    else:\n        half = size // 2\n        for dr in (0, half):\n            for dc in (0, half):\n                solve(r+dr, c+dc, half)' },
                        { title: '실행 및 출력', desc: '전체 종이(0,0,N)부터 시작하여 재귀적으로 분할합니다.', code: 'solve(0, 0, N)\nprint(white)\nprint(blue)' }
                    ],
                    cpp: [
                        { title: '입력', desc: '2D 배열을 전역으로 선언하고 cin으로 입력받습니다.', code: '#include <iostream>\nusing namespace std;\n\nint paper[128][128];\nint N, white_cnt = 0, blue_cnt = 0;  // 전역 카운터' },
                        { title: '재귀 함수', desc: 'allSame을 일찍 끊는 최적화: && allSame 조건으로 다른 색 발견 즉시 중단.', code: 'void solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    // 영역 전체가 같은 색인지 확인\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n\n    if (allSame) {\n        if (first == 0) white_cnt++;\n        else blue_cnt++;\n    } else {\n        int half = size / 2;  // 4등분\n        solve(r, c, half);\n        solve(r, c + half, half);\n        solve(r + half, c, half);\n        solve(r + half, c + half, half);\n    }\n}' },
                        { title: '실행 및 출력', desc: '(0,0,N)부터 시작해 재귀적으로 4등분 탐색합니다.', code: 'int main() {\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << white_cnt << "\\n" << blue_cnt << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1992', title: 'BOJ 1992 - 쿼드트리', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1992',
            simIntro: '4×4 영상을 쿼드트리 문자열로 압축하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>흑백 영상을 압축하여 표현하는 데이터 구조로 쿼드 트리라는 방법이 있다. 주어진 N×N 크기의 영상이 모두 0으로만 되어 있으면 0, 모두 1로만 되어 있으면 1. 아니면 4등분하여 재귀적으로 압축하고 결과를 괄호로 묶는다. 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 순서.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>8\n11110000\n11110000\n00011100\n00011100\n11110000\n11110000\n11110011\n11110011</pre></div>
        <div><strong>Output</strong><pre>((110(0101))(0010)(1(0010)0)100)</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N은 2의 거듭제곱</li><li>1 ≤ N ≤ 64</li></ul>
`,
            hints: [
                { title: 'First intuition', content: '앞에서 풀었던 색종이 만들기(2630)랑 비슷하지 않아? 영역이 전부 같은 값이면 그 값을 쓰고, 아니면 4등분하는 구조!<br><br>근데 이번에는 카운트가 아니라 <strong>문자열로 표현</strong>해야 해. "압축 결과"를 문자열로 만들어서 반환하는 거지.' },
                { title: 'But there\'s a problem with this', content: '카운트는 전역 변수 하나로 됐는데, 문자열은 어떻게 합칠까?<br><br>핵심은 <strong>재귀 함수가 문자열을 반환</strong>하게 만드는 거야:<br>• 모두 같으면 → 그 값("0" 또는 "1") 반환<br>• 다르면 → 4등분한 결과를 <strong>괄호로 감싸서</strong> 반환<br><br>순서는 <strong>좌상 → 우상 → 좌하 → 우하</strong>야. 이걸 잘못하면 틀리니까 주의!' },
                { title: 'What if we try this?', content: '함수 구조는 이렇게:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>solve(r, c, size)</code>:<br>① 영역 전체 같은 값? → 그 값 반환<br>② 아니면 → <code>"(" + solve(좌상) + solve(우상) + solve(좌하) + solve(우하) + ")"</code></div><br>색종이 문제에서 "카운트 +1"이 "문자열 반환"으로 바뀌고, "재귀 호출"이 "문자열 이어붙이기"로 바뀐 것뿐이야. 구조는 완전히 동일해!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]\n\ndef solve(r, c, size):\n    first = img[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if img[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half) + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\"\n\nprint(solve(0, 0, N))',
                cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint N;\nstring img[64];\nstring solve(int r, int c, int size) {\n    char first = img[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (img[i][j] != first) allSame = false;\n    if (allSame) return string(1, first);\n    int half = size / 2;\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n         + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n}\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> img[i];\n    cout << solve(0, 0, N) << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '재귀 문자열 합치기',
                description: '모두 같으면 그 값, 아니면 4등분 결과를 괄호로 감쌉니다.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '각 줄을 문자열로 저장 — img[r][c]로 바로 접근 가능.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]' },
                        { title: '재귀 함수', desc: '카운트 대신 문자열을 반환하는 것이 색종이와의 차이.\n다르면 괄호로 감싸서 4개 결과를 합칩니다.', code: 'def solve(r, c, size):\n    first = img[r][c]\n    all_same = all(img[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r,c,half) + solve(r,c+half,half) + solve(r+half,c,half) + solve(r+half,c+half,half) + \")\"' },
                        { title: '출력', desc: '최종 반환 문자열이 곧 쿼드트리 압축 결과입니다.', code: 'print(solve(0, 0, N))' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'string 배열로 각 줄을 저장합니다.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint N;\nstring img[64];' },
                        { title: '재귀 함수', desc: 'string 반환 — string(1, first)로 char를 문자열로 변환합니다.', code: 'string solve(int r, int c, int size) {\n    char first = img[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (img[i][j] != first) allSame = false;\n    if (allSame) return string(1, first);  // char → string 변환\n    int half = size / 2;\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n         + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n}' },
                        { title: '출력', desc: 'solve가 반환하는 문자열 전체를 한 줄로 출력합니다.', code: 'int main() {\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> img[i];\n    cout << solve(0, 0, N) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1780', title: 'BOJ 1780 - 종이의 개수', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1780',
            simIntro: '3×3 종이를 9등분하며 같은 값인지 확인하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>N×N크기의 행렬로 표현되는 종이가 있다. 종이의 각 칸에는 -1, 0, 1 중 하나가 저장되어 있다. 종이가 모두 같은 수로 되어 있으면 해당 종이를 사용하고, 아니면 9등분하여 재귀적으로 반복한다. -1로만 채워진 종이 수, 0으로만 채워진 종이 수, 1로만 채워진 종이 수를 출력.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>9\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n0 1 -1 0 1 -1 0 1 -1\n0 -1 1 0 -1 1 0 -1 1\n0 1 -1 1 0 -1 0 1 -1</pre></div>
        <div><strong>Output</strong><pre>10\n12\n11</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N은 3<sup>k</sup> 형태 (1 ≤ k ≤ 7, 즉 N ≤ 2,187)</li><li>각 칸은 -1, 0, 1만 포함</li></ul>
`,
            hints: [
                { title: 'First intuition', content: '색종이 만들기(2630)랑 구조가 거의 같아 보여! 영역이 전부 같은 값이면 카운트하고, 아니면 나눠서 재귀 호출하면 되겠지?<br><br>근데 한 가지 다른 점이 있어 — 이번에는 값이 2가지(흰/파)가 아니라 <strong>3가지(-1, 0, 1)</strong>야. 카운터도 3개 필요해.' },
                { title: 'But there\'s a problem with this', content: '색종이는 4등분(2×2)이었는데, 이 문제는 N이 3의 거듭제곱이야. 4등분하면 안 맞아!<br><br>N = 3<sup>k</sup> 형태이니까 <strong>9등분(3×3)</strong>으로 나눠야 해. <code>third = size / 3</code>으로 나누고, 3×3 = <strong>9번</strong> 재귀 호출하는 거야.<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">4등분(2×2) → <code>half = size/2</code>, 4번 호출<br>9등분(3×3) → <code>third = size/3</code>, 9번 호출</div>' },
                { title: 'What if we try this?', content: '색종이 코드에서 바꿀 부분만 정리하면:<br><br>① <code>half = size // 2</code> → <code>third = size // 3</code><br>② 2중 반복 (0, half) → 2중 반복 <code>range(3)</code><br>③ 카운터: 흰/파 2개 → -1, 0, 1 3개<br><br>N이 최대 2187(= 3<sup>7</sup>)이라 재귀 깊이는 최대 7 — 스택 오버플로우 걱정은 없어!<br><br><span class="lang-py">Python에서는 <code>cnt = {-1: 0, 0: 0, 1: 0}</code> 딕셔너리로 세면 깔끔해.</span><span class="lang-cpp">C++에서는 <code>cnt[first + 1]++</code>로 인덱스 매핑하면 돼 (-1→0, 0→1, 1→2).</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}\n\ndef solve(r, c, size):\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr * third, c + dc * third, third)\n\nsolve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])',
                cpp: '#include <iostream>\nusing namespace std;\nint paper[2187][2187];\nint N, cnt[3];\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n    if (allSame) { cnt[first + 1]++; }\n    else {\n        int t = size / 3;\n        for (int dr = 0; dr < 3; dr++)\n            for (int dc = 0; dc < 3; dc++)\n                solve(r + dr * t, c + dc * t, t);\n    }\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '재귀 9등분',
                description: '모두 같으면 카운트, 아니면 size/3으로 9등분 재귀합니다.',
                timeComplexity: 'O(N² log₃N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '딕셔너리로 -1, 0, 1 세 종류의 카운터를 관리합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}' },
                        { title: '재귀 함수', desc: '4등분이 아닌 9등분(3x3)이 핵심 차이.\nthird = size // 3으로 나누어 3x3 = 9번 재귀 호출합니다.', code: 'def solve(r, c, size):\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr*third, c + dc*third, third)' },
                        { title: '실행 및 출력', desc: '-1, 0, 1 순서대로 출력합니다.', code: 'solve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'cnt[3] 배열: 인덱스 0→-1, 1→0, 2→1 (first+1로 매핑).', code: '#include <iostream>\nusing namespace std;\n\nint paper[2187][2187];\nint N, cnt[3];  // cnt[0]=-1, cnt[1]=0, cnt[2]=1' },
                        { title: '재귀 함수', desc: 'cnt[first+1]로 -1,0,1을 인덱스 0,1,2에 매핑합니다.', code: 'void solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n    if (allSame) {\n        cnt[first + 1]++;  // -1→0, 0→1, 1→2\n    } else {\n        int t = size / 3;  // 9등분\n        for (int dr = 0; dr < 3; dr++)\n            for (int dc = 0; dc < 3; dc++)\n                solve(r + dr * t, c + dc * t, t);\n    }\n}' },
                        { title: '실행 및 출력', desc: 'ios::sync_with_stdio(false)로 입력 속도 최적화 — N이 최대 2187이라 필요.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
    <h3>Problem</h3>
    <p>자연수 A를 B번 곱한 수를 알고 싶다. 단 구하려는 수가 매우 커질 수 있으므로 C로 나눈 나머지를 구하는 프로그램을 작성하시오.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>10 11 12</pre></div>
        <div><strong>Output</strong><pre>4</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>A, B, C는 모두 2,147,483,647 이하의 자연수</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'A를 B번 곱하면 되니까, 반복문으로 A를 B번 곱하면 되지 않을까?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>result = 1</code><br><code>for i in range(B): result = result * A % C</code></div><br>간단해 보이지?' },
                { title: 'But there\'s a problem with this', content: 'B가 최대 <strong>2,147,483,647</strong>(약 21억)이야! 반복문 21억 번이면 시간 초과 확정이야.<br><br>그런데 한 가지 수학적 성질을 떠올려봐:<br>• A<sup>8</sup> = A × A × A × A × A × A × A × A (8번 곱셈)<br>• A<sup>8</sup> = (A<sup>4</sup>)<sup>2</sup> = ((A<sup>2</sup>)<sup>2</sup>)<sup>2</sup> (<strong>3번</strong> 곱셈!)<br><br>지수를 <strong>반으로 나누면</strong> 곱셈 횟수가 확 줄어들어!' },
                { title: 'What if we try this?', content: '<strong>분할정복 거듭제곱</strong>: 지수를 반씩 나누면 O(log B)에 끝나!<br><br>• B가 짝수: A<sup>B</sup> = (A<sup>B/2</sup>)² mod C<br>• B가 홀수: A<sup>B</sup> = (A<sup>B/2</sup>)² × A mod C<br><br>21억이어도 log₂(21억) ≈ <strong>31번</strong>이면 끝이야!<br><br><span class="lang-cpp">C++에서는 중간 곱셈에서 오버플로우가 날 수 있어 — <code>long long</code> 필수!</span><span class="lang-py">Python은 큰 수를 자동 처리하니까 오버플로우 걱정 없어. 내장 <code>pow(A, B, C)</code>도 같은 원리야!</span>' }
            ],
            templates: {
                python: 'A, B, C = map(int, input().split())\n\ndef power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result\n\nprint(power(A, B, C))',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nll power(ll a, ll b, ll c) {\n    if (b == 1) return a % c;\n    ll half = power(a, b / 2, c);\n    ll result = half * half % c;\n    if (b % 2 == 1) result = result * a % c;\n    return result;\n}\nint main() {\n    ll A, B, C;\n    cin >> A >> B >> C;\n    cout << power(A, B, C) << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '분할정복 거듭제곱',
                description: '지수를 반으로 나누며 O(log B)에 계산합니다.',
                timeComplexity: 'O(log B)',
                spaceComplexity: 'O(log B)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'A, B, C 세 수를 한 줄에서 입력받습니다.', code: 'A, B, C = map(int, input().split())' },
                        { title: '거듭제곱 함수', desc: '지수를 반으로 나누어 O(log B)에 계산하는 핵심 함수.\n짝수면 제곱, 홀수면 한 번 더 곱합니다.', code: 'def power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result' },
                        { title: '출력', desc: 'Python은 큰 수를 자동 처리하므로 오버플로우 걱정 없음.', code: 'print(power(A, B, C))' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'A,B,C가 최대 21억 → long long 필수.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;  // 최대 2^31-1이라 long long 필요\n\nll A, B, C;' },
                        { title: '거듭제곱 함수', desc: 'half*half 중간 곱이 오버플로우하지 않도록 매번 mod.', code: 'll power(ll a, ll b, ll c) {\n    if (b == 1) return a % c;\n    ll half = power(a, b / 2, c);\n    ll result = half * half % c;  // 짝수: (a^(b/2))^2\n    if (b % 2 == 1)\n        result = result * a % c;  // 홀수: 한 번 더 곱하기\n    return result;\n}' },
                        { title: '출력', desc: 'main에서 입력 후 power 호출 — 간단한 구조입니다.', code: 'int main() {\n    cin >> A >> B >> C;\n    cout << power(A, B, C) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-11401', title: 'BOJ 11401 - 이항 계수 3', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11401',
            simIntro: '페르마 소정리를 이용해 이항 계수를 모듈러 역원으로 계산하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>자연수 N과 정수 K가 주어졌을 때, 이항 계수 C(N, K)를 1,000,000,007로 나눈 나머지를 구하는 프로그램을 작성하시오. 페르마의 소정리를 이용하여 모듈러 역원을 구한다.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>5 2</pre></div>
        <div><strong>Output</strong><pre>10</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 4,000,000</li><li>0 ≤ K ≤ N</li></ul>
`,
            hints: [
                { title: 'First intuition', content: '이항 계수 C(N, K) = N! / (K! × (N-K)!) 이니까, 팩토리얼을 구해서 나누면 되지 않을까?<br><br>N!까지 미리 계산해두면 분자(N!)와 분모(K! × (N-K)!)를 바로 구할 수 있어.' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 <strong>400만</strong>이야. 400만 팩토리얼은 천문학적인 숫자라 직접 나눌 수 없어.<br><br>그래서 1,000,000,007로 나눈 나머지를 구하라는 건데... <strong>모듈러 연산에서는 나눗셈을 직접 할 수 없어!</strong><br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">(a / b) % p ≠ (a % p) / (b % p) ← 이게 안 돼!</div><br>나눗셈을 어떻게 처리하지?' },
                { title: 'What if we try this?', content: '<strong>페르마 소정리</strong>가 여기서 등장해!<br><br>p가 소수일 때: <strong>a<sup>-1</sup> ≡ a<sup>(p-2)</sup> mod p</strong><br><br>즉, 나눗셈을 <strong>거듭제곱(곱셈)</strong>으로 바꿀 수 있어!<br><br>C(N,K) mod p = N! × (K!)<sup>(p-2)</sup> × ((N-K)!)<sup>(p-2)</sup> mod p<br><br>구현 3단계:<br>① 팩토리얼 배열 미리 계산 (0! ~ N!)<br>② 앞에서 배운 <strong>분할정복 거듭제곱</strong>으로 역원 계산<br>③ 세 값을 곱하면 끝!<br><br>1629번(곱셈)의 거듭제곱 코드를 여기서 그대로 재사용할 수 있어.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD\n\ndef power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1: result = result * a % mod\n    return result\n\nans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\nll fac[4000001];\nll power(ll a, ll b, ll mod) {\n    if (b == 0) return 1;\n    if (b == 1) return a % mod;\n    ll half = power(a, b / 2, mod);\n    ll result = half * half % mod;\n    if (b % 2 == 1) result = result * a % mod;\n    return result;\n}\nint main() {\n    int N, K; cin >> N >> K;\n    fac[0] = 1;\n    for (int i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;\n    ll ans = fac[N];\n    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '팩토리얼 + 페르마 소정리',
                description: '팩토리얼을 미리 계산하고, 분할정복 거듭제곱으로 역원을 구합니다.',
                timeComplexity: 'O(N + log p)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 팩토리얼', desc: '팩토리얼을 0!부터 N!까지 미리 계산해둡니다.\n나중에 C(N,K) = N! / (K! * (N-K)!)에서 사용합니다.', code: 'MOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD' },
                        { title: '거듭제곱 (역원용)', desc: '모듈러 나눗셈은 직접 불가 → 페르마 소정리로 역원을 구합니다.\na^(p-2) mod p가 a의 모듈러 역원입니다.', code: 'def power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1:\n        result = result * a % mod\n    return result' },
                        { title: '결과 계산', desc: 'N! × (K!)^(p-2) × ((N-K)!)^(p-2) mod p로\n나눗셈을 곱셈으로 바꿔 계산합니다.', code: 'ans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)' }
                    ],
                    cpp: [
                        { title: '입력 및 팩토리얼', desc: '전역 배열로 팩토리얼을 미리 계산합니다.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\nll fac[4000001];  // N 최대 400만' },
                        { title: '거듭제곱 (역원용)', desc: '페르마 소정리: a^(-1) ≡ a^(p-2) mod p.', code: 'll power(ll a, ll b, ll mod) {\n    if (b == 0) return 1;\n    if (b == 1) return a % mod;\n    ll half = power(a, b / 2, mod);\n    ll result = half * half % mod;\n    if (b % 2 == 1)\n        result = result * a % mod;\n    return result;\n}' },
                        { title: '결과 계산', desc: 'main에서 팩토리얼 전처리 후, 역원 2번으로 C(N,K) 계산.', code: 'int main() {\n    int N, K;\n    cin >> N >> K;\n    fac[0] = 1;\n    for (int i = 1; i <= N; i++)\n        fac[i] = fac[i - 1] * i % MOD;\n    // C(N,K) = N! * (K!)^(p-2) * ((N-K)!)^(p-2)\n    ll ans = fac[N];\n    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n    cout << ans << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
    <h3>Problem</h3>
    <p>N×M 행렬 A와 M×K 행렬 B가 주어졌을 때, 두 행렬을 곱한 결과를 출력하는 프로그램을 작성하시오.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>3 2\n1 2\n3 4\n5 6\n2 3\n-1 -2 0\n0 0 3</pre></div>
        <div><strong>Output</strong><pre>-1 -2 6\n-3 -6 12\n-5 -10 18</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N, M, K ≤ 100</li><li>행렬 원소의 절댓값 ≤ 100</li><li>결과 행렬 원소의 절댓값 ≤ 2<sup>31</sup></li></ul>
`,
            hints: [
                { title: 'First intuition', content: '행렬 곱셈의 규칙을 떠올려보자. C[i][j]를 구하려면 <strong>A의 i행</strong>과 <strong>B의 j열</strong>을 쭉 곱해서 더하면 돼.<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">C[i][j] = A[i][0]×B[0][j] + A[i][1]×B[1][j] + ... + A[i][M-1]×B[M-1][j]</div><br>이건 <strong>내적(dot product)</strong>이야!' },
                { title: 'But there\'s a problem with this', content: '결과 행렬 C의 크기가 N×K이고, 각 원소를 구하려면 M번 곱해야 하니까 <strong>3중 반복문</strong>이 필요해:<br><br>• 바깥: i = 0~N-1 (C의 행)<br>• 중간: j = 0~K-1 (C의 열)<br>• 안쪽: k = 0~M-1 (내적 합산)<br><br>N, M, K ≤ 100이니까 최대 100만 번 — 이 문제에서는 충분해!<br><br>⚠️ 주의: A가 N×<strong>M</strong>이고 B가 <strong>M</strong>×K여야 곱셈이 가능해. A의 열 수 = B의 행 수!' },
                { title: 'What if we try this?', content: '이 문제 자체는 분할정복이 아니라 기본 행렬 곱셈이야. 하지만 이게 <strong>행렬 거듭제곱의 기초</strong>가 돼!<br><br>숫자 곱셈을 함수로 만들 듯이, 행렬 곱셈도 <code>mat_mul(A, B)</code> 함수로 만들어두면 나중에 행렬 거듭제곱(10830번)에서 그대로 재사용할 수 있어.<br><br><span class="lang-py">Python에서는 리스트 컴프리헨션으로 깔끔하게 초기화: <code>C = [[0]*K for _ in range(N)]</code></span><span class="lang-cpp">C++에서는 <code>int C[100][100] = {};</code>로 0 초기화하면 돼.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]\n\nC = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]\n\nfor row in C:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int N, M, M2, K;\n    cin >> N >> M;\n    int A[100][100], B[100][100], C[100][100] = {};\n    for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) cin >> A[i][j];\n    cin >> M2 >> K;\n    for (int i = 0; i < M; i++) for (int j = 0; j < K; j++) cin >> B[i][j];\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < K; j++)\n            for (int k = 0; k < M; k++)\n                C[i][j] += A[i][k] * B[k][j];\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < K; j++) cout << C[i][j] << (j < K-1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '3중 반복문',
                description: 'C[i][j] = sum(A[i][k] * B[k][j])로 직접 계산합니다.',
                timeComplexity: 'O(N × M × K)',
                spaceComplexity: 'O(N × K)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'A는 N×M, B는 M×K 행렬.\nA의 열 수 = B의 행 수(M)가 같아야 곱셈 가능.', code: 'N, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]' },
                        { title: '행렬 곱셈', desc: 'C[i][j] = A의 i행과 B의 j열의 내적.\n3중 반복문이 행렬 곱셈의 기본 패턴입니다.', code: 'C = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]' },
                        { title: '출력', desc: '각 행을 공백으로 구분하여 출력합니다.', code: 'for row in C:\n    print(\' \'.join(map(str, row)))' }
                    ],
                    cpp: [
                        { title: '입력', desc: '정적 2D 배열로 행렬을 선언합니다.', code: '#include <iostream>\nusing namespace std;\n\nint N, M, M2, K;\nint A[100][100], B[100][100], C[100][100];' },
                        { title: '행렬 곱셈', desc: 'i행 j열 k합산 — 행렬 거듭제곱의 기초가 되는 패턴입니다.', code: 'int main() {\n    cin >> N >> M;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++)\n            cin >> A[i][j];\n    cin >> M2 >> K;\n    for (int i = 0; i < M; i++)\n        for (int j = 0; j < K; j++)\n            cin >> B[i][j];\n    // C[i][j] = sum(A[i][k] * B[k][j]) — 3중 반복\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < K; j++)\n            for (int k = 0; k < M; k++)\n                C[i][j] += A[i][k] * B[k][j];' },
                        { title: '출력', desc: '마지막 열 뒤에는 공백 없이 줄바꿈만 출력합니다.', code: '    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < K; j++)\n            cout << C[i][j] << (j < K - 1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-10830', title: 'BOJ 10830 - 행렬 제곱', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10830',
            simIntro: '행렬 거듭제곱을 분할정복으로 수행하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>크기가 N×N인 행렬 A가 주어진다. 이때, A의 B제곱을 구하는 프로그램을 작성하시오. 수가 매우 커질 수 있으니, A^B의 각 원소를 1,000으로 나눈 나머지를 출력한다.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>2 5\n1 2\n3 4</pre></div>
        <div><strong>Output</strong><pre>69 558\n337 406</pre></div>
    </div></div>
    <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
        <div><strong>Input</strong><pre>3 3\n1 2 3\n4 5 6\n7 8 9</pre></div>
        <div><strong>Output</strong><pre>468 576 684\n62 305 548\n656 34 412</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>2 ≤ N ≤ 5</li><li>1 ≤ B ≤ 100,000,000,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'A를 B번 곱하면 되니까, 반복문으로 행렬을 B번 곱하면?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">result = 단위행렬<br>for i in range(B): result = mat_mul(result, A)</div><br>2740번에서 만든 행렬 곱셈 함수를 재사용하면 될 것 같아!' },
                { title: 'But there\'s a problem with this', content: 'B가 최대 <strong>1000억</strong>(10<sup>11</sup>)이야! 행렬 곱셈을 1000억 번 반복하면 당연히 시간 초과야.<br><br>그런데... 이거 어디서 본 패턴 아니야?<br><br>1629번(곱셈)에서 <strong>숫자</strong>를 B번 곱하는 걸 분할정복으로 O(log B)에 풀었잖아! <strong>숫자 대신 행렬을 곱하면</strong> 똑같은 원리로 풀 수 있어!' },
                { title: 'What if we try this?', content: '1629번 코드에서 바꿀 부분:<br><br>• <code>half * half</code> → <code>mat_mul(half, half)</code><br>• <code>result * a</code> → <code>mat_mul(result, A)</code><br>• 기저: B=1이면 A 자체를 반환 (각 원소 mod 처리!)<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">숫자 거듭제곱: 곱하기 연산자 *<br>행렬 거듭제곱: 행렬 곱셈 함수 mat_mul<br>구조는 <strong>완전히 동일</strong>!</div><br>행렬 곱셈할 때 매번 <strong>mod 1000</strong>을 해줘야 오버플로우를 방지할 수 있어.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nresult = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\ntypedef long long ll;\ntypedef vector<vector<ll>> Matrix;\nint N; ll B;\nconst int MOD = 1000;\nMatrix mat_mul(const Matrix& X, const Matrix& Y) {\n    Matrix C(N, vector<ll>(N, 0));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            for (int k = 0; k < N; k++)\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD;\n    return C;\n}\nMatrix mat_pow(Matrix M, ll b) {\n    if (b == 1) { for (int i=0;i<N;i++) for (int j=0;j<N;j++) M[i][j]%=MOD; return M; }\n    Matrix half = mat_pow(M, b/2);\n    Matrix result = mat_mul(half, half);\n    if (b%2==1) result = mat_mul(result, M);\n    return result;\n}\nint main() {\n    cin >> N >> B;\n    Matrix A(N, vector<ll>(N));\n    for (int i=0;i<N;i++) for (int j=0;j<N;j++) cin >> A[i][j];\n    Matrix result = mat_pow(A, B);\n    for (int i=0;i<N;i++) { for (int j=0;j<N;j++) cout << result[i][j] << (j<N-1?" ":""); cout << "\\n"; }\n    return 0;\n}'
            },
            solutions: [{
                approach: '행렬 분할정복 거듭제곱',
                description: '숫자 거듭제곱과 동일한 원리를 행렬에 적용합니다.',
                timeComplexity: 'O(N³ log B)',
                spaceComplexity: 'O(N² log B)',
                codeSteps: {
                    python: [
                        { title: '입력 및 행렬 곱셈', desc: 'mat_mul: 행렬 곱셈 함수. 매 원소 계산 시 mod 처리하여\n중간 값이 커지는 것을 방지합니다.', code: 'N, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C' },
                        { title: '행렬 거듭제곱', desc: '숫자 거듭제곱과 동일한 분할정복 구조.\n숫자 대신 행렬을 곱하고 반환합니다.', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: '출력', desc: '결과 행렬의 각 행을 공백 구분으로 출력합니다.', code: 'result = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))' }
                    ],
                    cpp: [
                        { title: '입력 및 행렬 곱셈', desc: 'vector<vector<ll>>을 Matrix 타입으로 정의합니다.', code: '#include <iostream>\n#include <vector>\nusing namespace std;\ntypedef long long ll;\ntypedef vector<vector<ll>> Matrix;\n\nint N; ll B;\nconst int MOD = 1000;\n\nMatrix mat_mul(const Matrix& X, const Matrix& Y) {\n    Matrix C(N, vector<ll>(N, 0));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            for (int k = 0; k < N; k++)\n                C[i][j] = (C[i][j] + X[i][k] * Y[k][j]) % MOD;\n    return C;\n}' },
                        { title: '행렬 거듭제곱', desc: '숫자 거듭제곱과 동일한 분할정복을 행렬에 적용합니다.', code: 'Matrix mat_pow(Matrix M, ll b) {\n    if (b == 1) {\n        // 기저: 각 원소 mod 처리\n        for (int i = 0; i < N; i++)\n            for (int j = 0; j < N; j++)\n                M[i][j] %= MOD;\n        return M;\n    }\n    Matrix half = mat_pow(M, b / 2);\n    Matrix result = mat_mul(half, half);\n    if (b % 2 == 1)\n        result = mat_mul(result, M);\n    return result;\n}' },
                        { title: '출력', desc: 'B가 최대 1000억 → ll 타입으로 받아야 합니다.', code: 'int main() {\n    cin >> N >> B;\n    Matrix A(N, vector<ll>(N));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> A[i][j];\n    Matrix result = mat_pow(A, B);\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++)\n            cout << result[i][j] << (j < N - 1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-11444', title: 'BOJ 11444 - 피보나치 수 6', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11444',
            simIntro: '[[1,1],[1,0]]^n 행렬 거듭제곱으로 피보나치 수를 구하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>피보나치 수는 0과 1로 시작한다. 0번째 피보나치 수는 0이고 1번째는 1이다. n번째 피보나치 수를 구하는 프로그램을 작성하시오. 행렬 거듭제곱을 이용. 1,000,000,007로 나눈 나머지를 출력.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>1000</pre></div>
        <div><strong>Output</strong><pre>517691607</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>0 ≤ n ≤ 10<sup>18</sup></li></ul>
`,
            hints: [
                { title: 'First intuition', content: '피보나치 수를 구하는 건 간단하지! 반복문으로 F(0), F(1), F(2), ... 순서대로 구하면 돼:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">a, b = 0, 1<br>for i in range(n): a, b = b, a + b</div><br>O(n)이면 충분하지 않을까?' },
                { title: 'But there\'s a problem with this', content: 'n이 최대 <strong>10<sup>18</sup></strong>(100경)이야! 반복문 10<sup>18</sup>번은 절대 불가능해.<br><br>O(log n)으로 풀어야 하는데, 피보나치에 분할정복을 어떻게 적용하지?<br><br>여기서 핵심 아이디어가 등장해 — <strong>피보나치 점화식을 행렬로 표현</strong>할 수 있어:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">[[F(n+1), F(n)], [F(n), F(n-1)]] = [[1,1],[1,0]]<sup>n</sup></div><br>행렬 거듭제곱은 O(log n)에 할 수 있으니까!' },
                { title: 'What if we try this?', content: '10830번(행렬 제곱) 코드를 <strong>2×2 행렬</strong>에 맞게 재사용하면 끝!<br><br>① 기본 행렬: <code>base = [[1,1],[1,0]]</code><br>② <code>mat_pow(base, n)</code>으로 O(log n)에 거듭제곱<br>③ 결과 행렬의 <strong>[0][1]</strong>이 F(n)!<br><br>2×2 고정 크기라 행렬 곱셈을 직접 전개하면 반복문보다 빨라.<br><br>⚠️ 예외 처리: n=0이면 0, n=1이면 1을 바로 출력해야 해. 행렬 거듭제곱은 n &gt; 1일 때만 사용!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nn = int(input())\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0] + X[0][1]*Y[1][0]) % MOD,\n         (X[0][0]*Y[0][1] + X[0][1]*Y[1][1]) % MOD],\n        [(X[1][0]*Y[0][0] + X[1][1]*Y[1][0]) % MOD,\n         (X[1][0]*Y[0][1] + X[1][1]*Y[1][1]) % MOD]\n    ]\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nif n <= 1:\n    print(n)\nelse:\n    base = [[1, 1], [1, 0]]\n    result = mat_pow(base, n)\n    print(result[0][1])',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\ntypedef ll Matrix[2][2];\nvoid mat_mul(Matrix A, Matrix B, Matrix C) {\n    ll temp[2][2] = {};\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) for (int k=0;k<2;k++)\n        temp[i][j] = (temp[i][j] + A[i][k]*B[k][j]) % MOD;\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) C[i][j]=temp[i][j];\n}\nvoid mat_pow(Matrix M, ll b, Matrix result) {\n    if (b==1) { for(int i=0;i<2;i++) for(int j=0;j<2;j++) result[i][j]=M[i][j]%MOD; return; }\n    Matrix half; mat_pow(M,b/2,half);\n    mat_mul(half,half,result);\n    if (b%2==1) { Matrix tmp; for(int i=0;i<2;i++) for(int j=0;j<2;j++) tmp[i][j]=result[i][j]; mat_mul(tmp,M,result); }\n}\nint main() {\n    ll n; cin >> n;\n    if (n<=1) { cout << n; return 0; }\n    Matrix base = {{1,1},{1,0}}, result;\n    mat_pow(base,n,result);\n    cout << result[0][1] << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '행렬 거듭제곱',
                description: '[[1,1],[1,0]]^n으로 F(n)을 O(log n)에 계산합니다.',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(log n)',
                codeSteps: {
                    python: [
                        { title: '행렬 곱셈', desc: '2x2 고정 크기라 직접 전개하면 반복문보다 빠릅니다.\n매 곱셈마다 mod 처리로 오버플로우 방지.', code: 'MOD = 1_000_000_007\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0]+X[0][1]*Y[1][0])%MOD,\n         (X[0][0]*Y[0][1]+X[0][1]*Y[1][1])%MOD],\n        [(X[1][0]*Y[0][0]+X[1][1]*Y[1][0])%MOD,\n         (X[1][0]*Y[0][1]+X[1][1]*Y[1][1])%MOD]\n    ]' },
                        { title: '행렬 거듭제곱', desc: '[[1,1],[1,0]]^n을 분할정복으로 O(log n)에 계산.\n10830번과 동일한 구조입니다.', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j]%MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: '실행', desc: 'n=0,1은 예외 처리. 결과 행렬의 [0][1]이 F(n)입니다.', code: 'n = int(input())\nif n <= 1:\n    print(n)\nelse:\n    base = [[1,1],[1,0]]\n    result = mat_pow(base, n)\n    print(result[0][1])  # F(n)' }
                    ],
                    cpp: [
                        { title: '행렬 곱셈', desc: 'typedef ll Matrix[2][2]로 2x2 고정 배열 사용. temp로 자기 자신 덮어쓰기 방지.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\ntypedef ll Matrix[2][2];\n\n// temp를 써서 결과를 C에 안전하게 복사\nvoid mat_mul(Matrix A, Matrix B, Matrix C) {\n    ll temp[2][2] = {};\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 2; j++)\n            for (int k = 0; k < 2; k++)\n                temp[i][j] = (temp[i][j] + A[i][k] * B[k][j]) % MOD;\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 2; j++)\n            C[i][j] = temp[i][j];\n}' },
                        { title: '행렬 거듭제곱', desc: 'C 스타일 배열이라 포인터로 전달합니다.', code: 'void mat_pow(Matrix M, ll b, Matrix result) {\n    if (b == 1) {\n        for (int i = 0; i < 2; i++)\n            for (int j = 0; j < 2; j++)\n                result[i][j] = M[i][j] % MOD;\n        return;\n    }\n    Matrix half;\n    mat_pow(M, b / 2, half);\n    mat_mul(half, half, result);  // result = half^2\n    if (b % 2 == 1) {\n        Matrix tmp;\n        for (int i = 0; i < 2; i++)\n            for (int j = 0; j < 2; j++)\n                tmp[i][j] = result[i][j];\n        mat_mul(tmp, M, result);  // result = half^2 * M\n    }\n}' },
                        { title: '실행', desc: 'n이 최대 10^18 → ll 필수. n≤1은 별도 처리합니다.', code: 'int main() {\n    ll n; cin >> n;\n    if (n <= 1) { cout << n; return 0; }\n    // [[1,1],[1,0]]^n 의 [0][1]이 F(n)\n    Matrix base = {{1, 1}, {1, 0}}, result;\n    mat_pow(base, n, result);\n    cout << result[0][1] << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
    <h3>Problem</h3>
    <p>히스토그램은 직사각형 여러 개가 아래쪽으로 정렬되어 있는 도형이다. 각 직사각형은 같은 너비를 가지고 있지만, 높이는 모두 다를 수 있다. 히스토그램에서 가장 넓이가 큰 직사각형을 구하는 프로그램을 작성하시오. 입력은 여러 테스트 케이스로 이루어져 있다. 각 테스트 케이스의 첫 번째 수는 n(1 ≤ n ≤ 100,000)이고, 그 뒤에 n개의 높이가 주어진다. 0이 입력되면 종료.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>7 2 1 4 5 1 3 3\n4 1000 1000 1000 1000\n0</pre></div>
        <div><strong>Output</strong><pre>8\n4000</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ n ≤ 100,000</li><li>0 ≤ 높이 ≤ 1,000,000,000</li><li>0이 입력되면 종료</li></ul>
`,
            hints: [
                { title: 'First intuition', content: '모든 막대를 시작점으로 해서, 양쪽으로 확장하며 최대 넓이를 구하면 되지 않을까?<br><br>각 막대 i에 대해 높이가 h[i] 이상인 연속 구간을 찾으면 넓이 = h[i] × 구간 길이.<br><br>모든 막대에 대해 해보면 최대값을 찾을 수 있어!' },
                { title: 'But there\'s a problem with this', content: '각 막대마다 양쪽을 탐색하면 최악의 경우 O(n²)이야. n이 최대 <strong>100,000</strong>이니까 시간 초과!<br><br>여기서 분할정복 아이디어를 떠올려보자. 배열을 반으로 나누면 최대 직사각형은 <strong>세 가지 경우</strong> 중 하나야:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">① 왼쪽 절반에만 있다<br>② 오른쪽 절반에만 있다<br>③ 가운데를 걸쳐 있다</div><br>①②는 재귀로 풀 수 있는데, ③은 어떻게 구하지?' },
                { title: 'What if we try this?', content: '③ 가운데 걸치는 경우: 중앙 두 막대에서 시작해서 <strong>높이가 더 높은 쪽으로 한 칸씩 확장</strong>해!<br><br>확장할 때마다 최소 높이를 갱신하고, 넓이 = 최소 높이 × 너비를 계산해서 최대값을 추적해.<br><br>왜 높은 쪽으로? 넓이를 최대화하려면 높이를 최대한 유지하면서 넓혀야 하니까!<br><br>시간복잡도: T(n) = 2T(n/2) + O(n) → <strong>O(n log n)</strong><br><br><span class="lang-cpp">⚠️ C++에서는 높이 × 너비가 int 범위를 넘을 수 있어 — <code>long long</code> 필수!</span><span class="lang-py">Python은 큰 수를 자동 처리하니까 따로 신경 쓸 필요 없어.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)\n    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))\n    return max(left_max, right_max, cross_max)\n\nwhile True:\n    line = list(map(int, input().split()))\n    if line[0] == 0: break\n    n = line[0]\n    heights = line[1:]\n    print(solve(heights, 0, n - 1))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint n; ll h[100001];\nll solve(int lo, int hi) {\n    if (lo == hi) return h[lo];\n    int mid = (lo + hi) / 2;\n    ll leftMax = solve(lo, mid), rightMax = solve(mid+1, hi);\n    int l = mid, r = mid + 1;\n    ll minH = min(h[l], h[r]), crossMax = minH * 2;\n    while (l > lo || r < hi) {\n        if (l > lo && (r >= hi || h[l-1] >= h[r+1])) { l--; minH = min(minH, h[l]); }\n        else { r++; minH = min(minH, h[r]); }\n        crossMax = max(crossMax, minH * (r - l + 1));\n    }\n    return max({leftMax, rightMax, crossMax});\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    while (cin >> n && n) {\n        for (int i = 0; i < n; i++) cin >> h[i];\n        cout << solve(0, n-1) << "\\n";\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '분할정복',
                description: '왼쪽/오른쪽/걸치는 경우로 나누어 최대 직사각형을 구합니다.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '분할정복 함수', desc: '왼쪽 절반, 오른쪽 절반에서 각각 최대값을 재귀로 구합니다.\n기저 조건: 막대 1개면 그 높이가 곧 최대.', code: 'def solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)' },
                        { title: '가운데 걸치는 경우', desc: '중앙에서 시작해 높이가 높은 쪽으로 확장합니다.\n확장할 때마다 최소 높이를 갱신하고 넓이를 계산합니다.', code: '    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))' },
                        { title: '최대값 반환', desc: '왼쪽/오른쪽/걸치는 세 경우 중 최대를 반환합니다.', code: '    return max(left_max, right_max, cross_max)' }
                    ],
                    cpp: [
                        { title: '분할정복 함수', desc: 'long long 사용 — 높이 * 너비가 int 범위를 넘을 수 있습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint n;\nll h[100001];\n\nll solve(int lo, int hi) {\n    if (lo == hi) return h[lo];\n    int mid = (lo + hi) / 2;\n    ll leftMax = solve(lo, mid);\n    ll rightMax = solve(mid + 1, hi);' },
                        { title: '가운데 걸치는 경우', desc: '높이가 높은 쪽으로 확장하여 최대 넓이를 갱신합니다.', code: '    int l = mid, r = mid + 1;\n    ll minH = min(h[l], h[r]);\n    ll crossMax = minH * 2;\n    // 양쪽으로 확장: 높이가 높은 쪽 우선\n    while (l > lo || r < hi) {\n        if (l > lo && (r >= hi || h[l-1] >= h[r+1])) {\n            l--;\n            minH = min(minH, h[l]);\n        } else {\n            r++;\n            minH = min(minH, h[r]);\n        }\n        crossMax = max(crossMax, minH * (r - l + 1));\n    }' },
                        { title: '최대값 반환', desc: 'max({a,b,c}) initializer_list로 세 값 중 최대 반환.\n0이 입력될 때까지 테스트 케이스를 반복합니다.', code: '    return max({leftMax, rightMax, crossMax});\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    while (cin >> n && n) {\n        for (int i = 0; i < n; i++) cin >> h[i];\n        cout << solve(0, n - 1) << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[8].templates; }
            }]
        }
    ]
};

// ===== Register =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.divideconquer = divideConquerTopic;
