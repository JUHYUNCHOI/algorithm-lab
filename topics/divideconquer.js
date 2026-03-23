// ===== 분할정복 알고리즘 토픽 모듈 =====
var divideConquerTopic = {
    id: 'divideconquer',
    title: '분할정복',
    icon: '🔪',
    category: '문제 해결 기법 (Silver~Gold)',
    order: 14,
    description: '큰 문제를 작게 나눠서 풀고 합치는 기법',
    relatedNote: '분할정복은 병합 정렬, 퀵 정렬, 이진 탐색의 기반이며, 색종이/쿼드트리 같은 영역 분할 문제에서 자주 활용됩니다.',

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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';        container.appendChild(contentDiv);
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
                    이렇게 <strong>큰 문제를 작은 문제로 나누고, 작은 문제를 풀고, 결과를 합치는 것</strong>이 분할정복입니다.<br>\
                    <a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Divide and Conquer ↗</a>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 이진 탐색 (분할정복의 가장 간단한 예)\ndef binary_search(arr, target, lo, hi):\n    if lo > hi:\n        return -1                    # 기저 조건: 찾을 범위 없음\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        return mid                   # 찾았다!\n    elif arr[mid] < target:\n        return binary_search(arr, target, mid + 1, hi)  # 오른쪽 절반\n    else:\n        return binary_search(arr, target, lo, mid - 1)  # 왼쪽 절반</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 이진 탐색 (분할정복의 가장 간단한 예)\nint binary_search(vector&lt;int&gt;&amp; arr, int target, int lo, int hi) {\n    if (lo &gt; hi)\n        return -1;                   // 기저 조건: 찾을 범위 없음\n    int mid = (lo + hi) / 2;\n    if (arr[mid] == target)\n        return mid;                  // 찾았다!\n    else if (arr[mid] &lt; target)\n        return binary_search(arr, target, mid + 1, hi);  // 오른쪽 절반\n    else\n        return binary_search(arr, target, lo, mid - 1);  // 왼쪽 절반\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 종이 반으로 접기 — 분할정복의 핵심</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-inline-fold-btn">✂️ 반으로 나누기</button>\
                        <button class="concept-demo-btn green" id="dc-inline-fold-reset">↺ 처음으로</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-inline-fold-viz" style="display:flex;gap:4px;flex-wrap:wrap;align-items:flex-end;min-height:60px;"></div>\
                        <div id="dc-inline-fold-msg" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg">👆 "반으로 나누기"를 계속 눌러보세요! 큰 종이가 어떻게 작아지는지 확인하세요.</div>\
                </div>\
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
                        <p>작은 문제의 답들을 <strong>합쳐서</strong> 원래 큰 문제의 답을 만듭니다.<br>\
                        <a href="https://en.wikipedia.org/wiki/Merge_sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Merge Sort ↗</a></p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 합병 정렬 (Merge Sort) — 분할정복의 대표 예시\ndef merge_sort(arr):\n    if len(arr) <= 1:       # 기저 조건\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])    # 1. 왼쪽 절반 정렬\n    right = merge_sort(arr[mid:])   # 1. 오른쪽 절반 정렬\n    return merge(left, right)       # 3. 합치기\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 합병 정렬 (Merge Sort) — 분할정복의 대표 예시\n#include &lt;vector&gt;\nusing namespace std;\n\nvector&lt;int&gt; merge(vector&lt;int&gt;&amp; left, vector&lt;int&gt;&amp; right) {\n    vector&lt;int&gt; result;\n    int i = 0, j = 0;\n    while (i &lt; left.size() &amp;&amp; j &lt; right.size()) {\n        if (left[i] &lt;= right[j])\n            result.push_back(left[i++]);\n        else\n            result.push_back(right[j++]);\n    }\n    while (i &lt; left.size()) result.push_back(left[i++]);   // 왼쪽 나머지\n    while (j &lt; right.size()) result.push_back(right[j++]); // 오른쪽 나머지\n    return result;\n}\n\nvector&lt;int&gt; merge_sort(vector&lt;int&gt; arr) {\n    if (arr.size() &lt;= 1) return arr;  // 기저 조건\n\n    int mid = arr.size() / 2;\n    // vector 슬라이싱 (Python arr[:mid], arr[mid:]에 대응)\n    vector&lt;int&gt; left(arr.begin(), arr.begin() + mid);   // 1. 왼쪽 절반\n    vector&lt;int&gt; right(arr.begin() + mid, arr.end());     // 1. 오른쪽 절반\n    left = merge_sort(left);    // 2. 왼쪽 정렬\n    right = merge_sort(right);  // 2. 오른쪽 정렬\n    return merge(left, right);  // 3. 합치기\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 3단계 체험 — [6, 2, 8, 1]을 합병 정렬</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-inline-3step-btn">다음 단계 ▶</button>\
                        <button class="concept-demo-btn green" id="dc-inline-3step-reset">↺ 처음으로</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-inline-3step-viz" style="text-align:center;min-height:80px;font-family:monospace;line-height:2;"></div>\
                        <div id="dc-inline-3step-msg" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg">👆 "다음 단계"를 눌러 나누기 → 풀기 → 합치기 과정을 확인하세요!</div>\
                </div>\
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
                    예) 합병 정렬: 왼쪽/오른쪽 독립 → <strong>분할정복</strong> | 피보나치: F(3)을 여러 번 계산 → <strong>DP</strong><br>\
                    <a href="https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: 마스터 정리 (Master Theorem) ↗</a> — 분할정복의 시간 복잡도를 쉽게 구하는 공식\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 겹침 여부 비교 — 한눈에 보기</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-inline-cmp-dc">분할정복 (합병정렬)</button>\
                        <button class="concept-demo-btn" id="dc-inline-cmp-dp">DP (피보나치)</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-inline-cmp-viz" style="font-family:monospace;font-size:0.85rem;line-height:1.8;min-height:80px;overflow-x:auto;white-space:pre;"></div>\
                        <div id="dc-inline-cmp-msg" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg">👆 버튼을 눌러 호출 구조를 비교하세요! 겹치는 부분이 있는지 확인!</div>\
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
                        <h3>행렬 거듭제곱 <span style="font-size:0.7rem;color:var(--text3);">(Gold+)</span></h3>\
                        <p>행렬의 거듭제곱도 같은 원리입니다. <strong>피보나치 수</strong>를 O(log n)에 구하는 데 사용합니다. 빠른 거듭제곱을 먼저 이해한 뒤 도전하세요!</p>\
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
                        <h3>구간 분할 <span style="font-size:0.7rem;color:var(--text3);">(Gold+)</span></h3>\
                        <p>배열을 <strong>왼쪽/오른쪽으로 나눠서</strong> 각각의 답을 구하고, 걸치는 경우를 처리합니다. 히스토그램 문제가 대표적입니다.</p>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 패턴 시각화 — 분할 방식 비교</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-inline-pat-half">2등분 (이진탐색)</button>\
                        <button class="concept-demo-btn" id="dc-inline-pat-quad">4등분 (쿼드트리)</button>\
                        <button class="concept-demo-btn" id="dc-inline-pat-nine">9등분 (종이의 개수)</button>\
                        <button class="concept-demo-btn" id="dc-inline-pat-exp">지수 반분 (거듭제곱)</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-inline-pat-viz" style="display:flex;justify-content:center;align-items:center;min-height:110px;gap:12px;flex-wrap:wrap;"></div>\
                        <div id="dc-inline-pat-msg" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg">👆 각 패턴 버튼을 눌러 분할 방식의 차이를 비교하세요!</div>\
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
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 3단계 체험 — "배열 최대값" 문제를 분할정복으로</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-inline-solve-btn">다음 ▶</button>\
                        <button class="concept-demo-btn green" id="dc-inline-solve-reset">↺ 처음으로</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-inline-solve-arr" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="dc-inline-solve-tree" style="font-family:monospace;font-size:0.85rem;line-height:2;min-height:60px;overflow-x:auto;white-space:pre;"></div>\
                        <div id="dc-inline-solve-msg" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg">👆 "다음"을 눌러 ① 기저조건 ② 나누기 ③ 합치기의 3단계를 체험하세요!</div>\
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
\
            <!-- ⑥ 데모: 이진탐색 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">6</span> 데모: 이진 탐색 — 분할정복으로 찾기</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 정렬된 배열에서 절반씩 나눠 찾기</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="number" id="dc-demo-bs-target" value="7" min="0" max="99" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:80px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="dc-demo-bs-step">Step ▶</button>\
                        <button class="concept-demo-btn green" id="dc-demo-bs-reset">Reset ↺</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-demo-bs-arr" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>\
                        <div id="dc-demo-bs-pointers" style="font-size:0.85rem;color:var(--text2);min-height:1.5em;margin-bottom:8px;"></div>\
                        <div id="dc-demo-bs-log" style="font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="dc-demo-bs-msg">👆 찾을 숫자를 입력하고 "탐색 시작"을 눌러보세요! 배열을 절반씩 나누며 찾는 과정을 확인하세요.</div>\
                </div>\
            </div>\
\
            <!-- ⑦ 데모: 합병정렬 3단계 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">7</span> 데모: 합병 정렬 3단계 — 나누고, 풀고, 합치기</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 합병 정렬 시각화</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="dc-demo-ms-input" value="5,3,8,1,4,2,7,6" placeholder="쉼표 구분 숫자" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:200px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="dc-demo-ms-step">Step ▶</button>\
                        <button class="concept-demo-btn green" id="dc-demo-ms-reset">Reset ↺</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-demo-ms-viz" style="min-height:120px;overflow-x:auto;"></div>\
                        <div id="dc-demo-ms-phase" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:2em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="dc-demo-ms-msg">👆 숫자를 바꿔보고 "정렬 시작"을 눌러보세요! 나누기 → 풀기 → 합치기 3단계를 확인하세요.</div>\
                </div>\
            </div>\
\
            <!-- ⑧ 데모: 겹침비교 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">8</span> 데모: 겹침 비교 — 분할정복 vs DP</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 부분 문제가 겹치는가?</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="dc-demo-overlap-ms">합병 정렬 (겹치지 않음)</button>\
                        <button class="concept-demo-btn" id="dc-demo-overlap-fib">피보나치 (겹침!)</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="dc-demo-overlap-viz" style="min-height:140px;overflow-x:auto;font-family:monospace;"></div>\
                        <div id="dc-demo-overlap-stats" style="margin-top:10px;display:flex;gap:1.5rem;flex-wrap:wrap;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="dc-demo-overlap-msg">👆 버튼을 눌러 호출 트리를 비교해보세요! 같은 색은 같은 부분 문제입니다.</div>\
                </div>\
            </div>\
\
            <!-- ⑨ 데모: 빠른 거듭제곱 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">9</span> 데모: 빠른 거듭제곱 — 지수를 반으로!</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — x^n을 빠르게 계산</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <label style="font-size:0.9rem;color:var(--text);">밑:</label>\
                        <input type="number" id="dc-demo-pow-base" value="2" min="1" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <label style="font-size:0.9rem;color:var(--text);">지수:</label>\
                        <input type="number" id="dc-demo-pow-exp" value="8" min="1" max="32" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="dc-demo-pow-btn">⚡ 계산 비교</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:200px;">\
                                <div style="font-weight:600;margin-bottom:8px;color:var(--red);">단순 곱셈 <span style="font-size:0.85rem;">O(n)</span></div>\
                                <div id="dc-demo-pow-naive" style="font-size:0.85rem;color:var(--text2);line-height:1.8;"></div>\
                            </div>\
                            <div style="flex:1;min-width:200px;">\
                                <div style="font-weight:600;margin-bottom:8px;color:var(--green);">분할정복 <span style="font-size:0.85rem;">O(log n)</span></div>\
                                <div id="dc-demo-pow-fast" style="font-size:0.85rem;color:var(--text2);line-height:1.8;"></div>\
                            </div>\
                        </div>\
                        <div id="dc-demo-pow-result" style="margin-top:12px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="dc-demo-pow-msg">👆 밑과 지수를 바꿔보고 "계산 비교"를 눌러보세요! 분할정복이 얼마나 빠른지 확인하세요.</div>\
                </div>\
            </div>\
\
            <!-- ⑩ 데모: 색종이 쿼드트리 -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">10</span> 데모: 색종이 쿼드트리 — 재귀적 4등분</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 4×4 색종이를 쿼드트리로 분할</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <span style="font-size:0.85rem;color:var(--text2);">셀 클릭으로 색 변경 |</span>\
                        <button class="concept-demo-btn" id="dc-demo-qt-run">🔍 쿼드트리 분할</button>\
                        <button class="concept-demo-btn green" id="dc-demo-qt-reset">↺ 초기화</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div>\
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">색종이 (클릭으로 편집)</div>\
                                <div id="dc-demo-qt-grid" style="display:grid;grid-template-columns:repeat(4,40px);gap:2px;"></div>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">쿼드트리 분할 결과</div>\
                                <div id="dc-demo-qt-result" style="font-size:0.9rem;color:var(--text2);line-height:1.8;font-family:monospace;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="dc-demo-qt-msg">👆 셀을 클릭해서 흰색/파란색을 바꾸고 "쿼드트리 분할"을 눌러보세요! 같은 색이면 합치고, 다르면 4등분하는 과정을 확인하세요.</div>\
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

        // ====== 인라인 데모 §1: 종이 접기 ======
        (function() {
            var foldBtn = container.querySelector('#dc-inline-fold-btn');
            var foldReset = container.querySelector('#dc-inline-fold-reset');
            var foldViz = container.querySelector('#dc-inline-fold-viz');
            var foldMsg = container.querySelector('#dc-inline-fold-msg');
            if (!foldBtn) return;
            var pieces = [1]; // 조각 수 배열
            var step = 0;
            function render() {
                foldViz.innerHTML = '';
                var w = Math.max(120 / pieces.length, 24);
                pieces.forEach(function(_, i) {
                    var box = document.createElement('div');
                    box.style.cssText = 'width:' + w + 'px;height:50px;border:2px solid var(--accent);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--accent);font-weight:700;background:var(--accent)10;transition:all 0.3s;';
                    box.textContent = (i + 1);
                    foldViz.appendChild(box);
                });
                if (step === 0) foldMsg.innerHTML = '<strong>시작</strong>: 종이 1장. 이제 반으로 나눠봅시다!';
                else if (pieces.length >= 16) foldMsg.innerHTML = '<strong>기저 조건 도달!</strong> 더 이상 나눌 수 없을 만큼 작아졌습니다. 이것이 분할정복의 "기저 조건"입니다.';
                else foldMsg.innerHTML = '<strong>' + step + '번 분할</strong>: ' + pieces.length + '조각이 되었습니다. 매번 2배씩 늘어나는 걸 확인하세요!';
            }
            render();
            foldBtn.addEventListener('click', function() {
                if (pieces.length >= 16) return;
                step++;
                var newPieces = [];
                for (var i = 0; i < pieces.length * 2; i++) newPieces.push(1);
                pieces = newPieces;
                render();
            });
            foldReset.addEventListener('click', function() {
                pieces = [1]; step = 0; render();
            });
        })();

        // ====== 인라인 데모 §2: 3단계 체험 (트리 레이아웃) ======
        (function() {
            var stepBtn = container.querySelector('#dc-inline-3step-btn');
            var resetBtn = container.querySelector('#dc-inline-3step-reset');
            var vizEl = container.querySelector('#dc-inline-3step-viz');
            var msgEl = container.querySelector('#dc-inline-3step-msg');
            if (!stepBtn) return;

            // 트리 레벨별 노드: L0=[6,2,8,1], L1=[6,2],[8,1], L2=[6],[2],[8],[1]
            // 분할: L0→L1→L2 (위→아래), 합치기: L2→L1→L0 (아래→위)
            function makeBox(text, border, shadow) {
                return '<span style="display:inline-block;padding:4px 10px;background:' + border + '15;border:2px solid ' + border + ';border-radius:8px;font-size:0.88rem;' + (shadow || '') + '">' + text + '</span>';
            }
            function makeLevelRow(label, nodes, gap) {
                var g = gap || '12px';
                return '<div style="display:flex;align-items:center;gap:10px;justify-content:center;">' +
                    '<span style="font-size:0.65rem;color:var(--text3);min-width:16px;text-align:right;">' + label + '</span>' +
                    '<div style="display:flex;gap:' + g + ';justify-content:center;">' + nodes + '</div></div>';
            }
            var connector = '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">\u2571\u2572</div>';

            var frames = [
                {
                    viz: makeLevelRow('L0', makeBox('[6, 2, 8, 1]', 'var(--accent)')),
                    msg: '<strong>시작</strong>: 정렬되지 않은 배열 [6, 2, 8, 1]'
                },
                {
                    viz: makeLevelRow('L0', makeBox('[6, 2, 8, 1]', 'var(--accent)')) + connector +
                         makeLevelRow('L1', makeBox('[6, 2]', 'var(--red)') + makeBox('[8, 1]', 'var(--red)'), '24px'),
                    msg: '<strong>1단계 나누기(Divide)</strong>: 반으로 쪼갭니다 → [6,2]와 [8,1]'
                },
                {
                    viz: makeLevelRow('L0', makeBox('[6, 2, 8, 1]', 'var(--accent)')) + connector +
                         makeLevelRow('L1', makeBox('[6, 2]', 'var(--red)') + makeBox('[8, 1]', 'var(--red)'), '24px') +
                         '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">\u2571\u2572 &nbsp;&nbsp;&nbsp;&nbsp; \u2571\u2572</div>' +
                         makeLevelRow('L2', makeBox('[6]', 'var(--yellow)') + makeBox('[2]', 'var(--yellow)') + '&nbsp;&nbsp;' + makeBox('[8]', 'var(--yellow)') + makeBox('[1]', 'var(--yellow)')),
                    msg: '<strong>계속 나누기</strong>: 더 이상 나눌 수 없을 때까지! 크기 1이면 기저 조건.'
                },
                {
                    viz: makeLevelRow('L0', makeBox('[6, 2, 8, 1]', 'var(--accent)')) + connector +
                         makeLevelRow('L1', makeBox('[2, 6]', 'var(--green)', 'box-shadow:0 0 6px rgba(0,184,148,0.3);') + makeBox('[1, 8]', 'var(--green)', 'box-shadow:0 0 6px rgba(0,184,148,0.3);'), '24px') +
                         '<div style="text-align:center;color:var(--green);font-size:0.8rem;">↑ 합치기 ↑</div>' +
                         makeLevelRow('L2', makeBox('[6]', 'var(--text3)') + makeBox('[2]', 'var(--text3)') + '&nbsp;&nbsp;' + makeBox('[8]', 'var(--text3)') + makeBox('[1]', 'var(--text3)')),
                    msg: '<strong>2단계 풀기(Conquer)</strong>: 각 쌍을 비교해서 정렬! 2<6이니 [2,6], 1<8이니 [1,8]'
                },
                {
                    viz: makeLevelRow('L0', makeBox('[1, 2, 6, 8]', 'var(--green)', 'font-size:1rem;box-shadow:0 0 10px rgba(0,184,148,0.4);')) +
                         '<div style="text-align:center;color:var(--green);font-size:0.8rem;">↑ 합치기 ↑</div>' +
                         makeLevelRow('L1', makeBox('[2, 6]', 'var(--text3)') + makeBox('[1, 8]', 'var(--text3)'), '24px') +
                         '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">\u2571\u2572 &nbsp;&nbsp;&nbsp;&nbsp; \u2571\u2572</div>' +
                         makeLevelRow('L2', makeBox('[6]', 'var(--text3)') + makeBox('[2]', 'var(--text3)') + '&nbsp;&nbsp;' + makeBox('[8]', 'var(--text3)') + makeBox('[1]', 'var(--text3)')),
                    msg: '<strong>3단계 합치기(Combine)</strong>: 정렬된 [2,6]과 [1,8]을 합쳐서 최종 결과 [1,2,6,8]!'
                }
            ];
            var idx = 0;
            function render() {
                vizEl.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' + frames[idx].viz + '</div>';
                msgEl.innerHTML = frames[idx].msg;
                stepBtn.disabled = idx >= frames.length - 1;
            }
            render();
            stepBtn.addEventListener('click', function() {
                if (idx < frames.length - 1) { idx++; render(); }
            });
            resetBtn.addEventListener('click', function() { idx = 0; render(); });
        })();

        // ====== 인라인 데모 §3: 겹침 비교 ======
        (function() {
            var dcBtn = container.querySelector('#dc-inline-cmp-dc');
            var dpBtn = container.querySelector('#dc-inline-cmp-dp');
            var vizEl = container.querySelector('#dc-inline-cmp-viz');
            var msgEl = container.querySelector('#dc-inline-cmp-msg');
            if (!dcBtn) return;
            dcBtn.addEventListener('click', function() {
                vizEl.innerHTML =
                    '<div style="white-space:pre;font-size:0.8rem;line-height:1.7;">       <span style="background:var(--accent)20;padding:2px 6px;border-radius:4px;">sort([5,3,1,4])</span>\n' +
                    '       /           \\\n' +
                    '  <span style="background:#e1705520;padding:2px 6px;border-radius:4px;">sort([5,3])</span>    <span style="background:#00b89420;padding:2px 6px;border-radius:4px;">sort([1,4])</span>\n' +
                    '   /    \\       /    \\\n' +
                    ' <span style="background:#fdcb6e40;padding:2px 6px;border-radius:4px;">[5]</span>   <span style="background:#fdcb6e40;padding:2px 6px;border-radius:4px;">[3]</span>    <span style="background:#0984e340;padding:2px 6px;border-radius:4px;">[1]</span>   <span style="background:#0984e340;padding:2px 6px;border-radius:4px;">[4]</span></div>';
                msgEl.innerHTML = '<span style="color:var(--accent);font-weight:600;">겹치는 부분 문제 없음!</span> 각 조각은 서로 독립적 → <strong>분할정복</strong>에 적합';
            });
            dpBtn.addEventListener('click', function() {
                vizEl.innerHTML =
                    '<div style="white-space:pre;font-size:0.8rem;line-height:1.7;">         <span style="background:var(--accent)20;padding:2px 6px;border-radius:4px;">F(5)</span>\n' +
                    '        /     \\\n' +
                    '     <span style="background:#e1705520;padding:2px 6px;border-radius:4px;">F(4)</span>    <span style="background:#00b89420;padding:2px 6px;border-radius:4px;">F(3)</span>\n' +
                    '     /  \\    /  \\\n' +
                    '  <span style="background:#00b89420;padding:2px 6px;border-radius:4px;">F(3)</span> <span style="background:var(--red)20;padding:2px 6px;border-radius:4px;border:1px dashed var(--red);">F(2)</span> <span style="background:var(--red)20;padding:2px 6px;border-radius:4px;border:1px dashed var(--red);">F(2)</span> <span style="background:#fdcb6e40;padding:2px 6px;border-radius:4px;">F(1)</span></div>';
                msgEl.innerHTML = '<span style="color:var(--red);font-weight:600;">F(3), F(2)가 반복 계산됨!</span> 부분 문제가 겹침 → <strong>DP</strong>로 저장해서 재사용해야 효율적';
            });
        })();

        // ====== 인라인 데모 §4: 패턴 시각화 ======
        (function() {
            var halfBtn = container.querySelector('#dc-inline-pat-half');
            var quadBtn = container.querySelector('#dc-inline-pat-quad');
            var nineBtn = container.querySelector('#dc-inline-pat-nine');
            var expBtn = container.querySelector('#dc-inline-pat-exp');
            var vizEl = container.querySelector('#dc-inline-pat-viz');
            var msgEl = container.querySelector('#dc-inline-pat-msg');
            if (!halfBtn) return;
            function makeBar(w, h, color, label) {
                return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="width:' + w + 'px;height:' + h + 'px;border:2px solid ' + color + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:' + color + ';font-weight:600;background:' + color + '10;">' + label + '</div></div>';
            }
            function makeGrid(rows, cols, size, color) {
                var html = '<div style="display:grid;grid-template-columns:repeat(' + cols + ',' + size + 'px);gap:2px;">';
                for (var i = 0; i < rows * cols; i++) {
                    html += '<div style="width:' + size + 'px;height:' + size + 'px;border:2px solid ' + color + ';border-radius:4px;background:' + color + '10;"></div>';
                }
                return html + '</div>';
            }
            halfBtn.addEventListener('click', function() {
                vizEl.innerHTML = '<div style="display:flex;align-items:center;gap:10px;">' +
                    makeBar(160, 40, 'var(--accent)', '전체 배열') +
                    '<span style="font-size:1.5rem;color:var(--red);">→</span>' +
                    makeBar(75, 40, 'var(--green)', '왼쪽') + makeBar(75, 40, '#e17055', '오른쪽') + '</div>';
                msgEl.innerHTML = '<strong>2등분</strong>: 배열을 절반으로 나눕니다. 이진탐색, 합병정렬의 패턴. T(n) = 2T(n/2) + O(n)';
            });
            quadBtn.addEventListener('click', function() {
                vizEl.innerHTML = '<div style="display:flex;align-items:center;gap:14px;">' +
                    makeGrid(1, 1, 80, 'var(--accent)') +
                    '<span style="font-size:1.5rem;color:var(--red);">→</span>' +
                    makeGrid(2, 2, 36, 'var(--green)') + '</div>';
                msgEl.innerHTML = '<strong>4등분</strong>: 2D 영역을 4조각으로. 색종이(2630), 쿼드트리(1992)의 패턴. T(n) = 4T(n/2) + O(n²)';
            });
            nineBtn.addEventListener('click', function() {
                vizEl.innerHTML = '<div style="display:flex;align-items:center;gap:14px;">' +
                    makeGrid(1, 1, 80, 'var(--accent)') +
                    '<span style="font-size:1.5rem;color:var(--red);">→</span>' +
                    makeGrid(3, 3, 24, '#e17055') + '</div>';
                msgEl.innerHTML = '<strong>9등분</strong>: 2D 영역을 9조각으로. 종이의 개수(1780)의 패턴. T(n) = 9T(n/3) + O(n²)';
            });
            expBtn.addEventListener('click', function() {
                vizEl.innerHTML = '<div style="display:flex;align-items:center;gap:8px;font-family:monospace;font-size:0.95rem;">' +
                    '<span style="padding:6px 14px;background:#6c5ce720;border:2px solid #6c5ce7;border-radius:8px;">a<sup>8</sup></span>' +
                    '<span style="color:var(--red);font-size:1.2rem;">→</span>' +
                    '<span style="padding:6px 14px;background:#6c5ce720;border:2px solid #6c5ce7;border-radius:8px;">(a<sup>4</sup>)²</span>' +
                    '<span style="color:var(--red);font-size:1.2rem;">→</span>' +
                    '<span style="padding:6px 14px;background:#6c5ce720;border:2px solid #6c5ce7;border-radius:8px;">((a²)²)²</span>' +
                    '<span style="color:var(--green);font-size:1.2rem;font-weight:700;"> = 3번!</span></div>';
                msgEl.innerHTML = '<strong>지수 반분</strong>: 지수를 반으로 나눠 곱셈 횟수를 O(log n)으로 줄입니다. 빠른 거듭제곱(1629)의 패턴.';
            });
        })();

        // ====== 인라인 데모 §5: 3단계 풀기 체험 ======
        (function() {
            var stepBtn = container.querySelector('#dc-inline-solve-btn');
            var resetBtn = container.querySelector('#dc-inline-solve-reset');
            var arrEl = container.querySelector('#dc-inline-solve-arr');
            var treeEl = container.querySelector('#dc-inline-solve-tree');
            var msgEl = container.querySelector('#dc-inline-solve-msg');
            if (!stepBtn) return;
            var data = [3, 7, 1, 9, 4, 6];
            var frames = [
                { hl: [], tree: '', msg: '<strong>문제</strong>: 배열 [3,7,1,9,4,6]에서 최대값을 분할정복으로 찾자!' },
                { hl: [0,1,2], tree: '① 기저 조건: 원소가 1개면 그 자체가 최대값', msg: '<strong>① 기저 조건 정하기</strong>: 배열 크기가 1이면 → 그 값이 답!' },
                { hl: [0,1,2,3,4,5], tree: '② 나누기: [3,7,1] | [9,4,6]', msg: '<strong>② 나누기</strong>: 배열을 반으로 나눕니다. 왼쪽 [3,7,1], 오른쪽 [9,4,6]' },
                { hl: [0,1,2], tree: '② 나누기: [3,7,1] | [9,4,6]\n   왼쪽: max([3,7,1]) → [3] | [7,1] → [7] | [1]', msg: '<strong>왼쪽 재귀</strong>: [3,7,1]을 또 나누고... 기저 조건에 도달!' },
                { hl: [0,1,2], tree: '② 나누기: [3,7,1] | [9,4,6]\n   왼쪽: max([3,7,1]) → max(3, max(7,1)) → max(3, 7) = 7', msg: '<strong>왼쪽 결과</strong>: max(7,1)=7, max(3,7)=<span style="color:var(--green);font-weight:700;">7</span>' },
                { hl: [3,4,5], tree: '② 나누기: [3,7,1] | [9,4,6]\n   왼쪽 = 7\n   오른쪽: max([9,4,6]) → max(9, max(4,6)) → max(9, 6) = 9', msg: '<strong>오른쪽 결과</strong>: max(4,6)=6, max(9,6)=<span style="color:var(--green);font-weight:700;">9</span>' },
                { hl: [3], tree: '③ 합치기: max(왼쪽=7, 오른쪽=9) = 9', msg: '<strong>③ 합치기</strong>: max(7, 9) = <span style="color:var(--green);font-weight:700;font-size:1.1rem;">9</span> 가 최종 답!' }
            ];
            var idx = 0;
            function render() {
                arrEl.innerHTML = '';
                data.forEach(function(v, i) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-val">' + v + '</div>';
                    if (frames[idx].hl.indexOf(i) >= 0) {
                        box.style.borderColor = 'var(--yellow)';
                        box.style.boxShadow = '0 0 6px var(--yellow)';
                    }
                    arrEl.appendChild(box);
                });
                treeEl.innerHTML = frames[idx].tree;
                msgEl.innerHTML = frames[idx].msg;
                stepBtn.disabled = idx >= frames.length - 1;
            }
            render();
            stepBtn.addEventListener('click', function() {
                if (idx < frames.length - 1) { idx++; render(); }
            });
            resetBtn.addEventListener('click', function() { idx = 0; render(); });
        })();

        // ====== 데모 1: 이진 탐색 ======
        (function() {
            var arr = [1, 3, 5, 7, 9, 12, 15, 18, 21, 25];
            var stepBtn = container.querySelector('#dc-demo-bs-step');
            var resetBtn = container.querySelector('#dc-demo-bs-reset');
            var targetInput = container.querySelector('#dc-demo-bs-target');
            var arrEl = container.querySelector('#dc-demo-bs-arr');
            var pointersEl = container.querySelector('#dc-demo-bs-pointers');
            var logEl = container.querySelector('#dc-demo-bs-log');
            var msgEl = container.querySelector('#dc-demo-bs-msg');
            var bsState = { steps: [], stepIdx: -1 };

            function renderArr(lo, hi, mid, found) {
                arrEl.innerHTML = '';
                arr.forEach(function(v, i) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    var labels = [];
                    if (i === lo) labels.push('L');
                    if (i === hi) labels.push('R');
                    if (i === mid) labels.push('mid');
                    var labelStr = labels.length ? '<div class="str-char-idx" style="font-size:0.65rem;color:var(--accent);font-weight:700;">' + labels.join(',') + '</div>' : '';
                    box.innerHTML = labelStr + '<div class="str-char-val">' + v + '</div>';
                    if (i < lo || i > hi) { box.style.opacity = '0.3'; }
                    if (i === mid && found === true) {
                        box.style.borderColor = 'var(--green)';
                        box.style.boxShadow = '0 0 8px var(--green)';
                        box.style.background = 'rgba(0,184,148,0.15)';
                    } else if (i === mid && found === false) {
                        box.style.borderColor = 'var(--yellow)';
                        box.style.boxShadow = '0 0 6px var(--yellow)';
                    }
                    arrEl.appendChild(box);
                });
            }

            function buildBsSteps(target) {
                var lo = 0, hi = arr.length - 1;
                var steps = [];
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    if (arr[mid] === target) { steps.push({ lo: lo, hi: hi, mid: mid, found: true }); break; }
                    else if (arr[mid] < target) { steps.push({ lo: lo, hi: hi, mid: mid, found: false, dir: 'right' }); lo = mid + 1; }
                    else { steps.push({ lo: lo, hi: hi, mid: mid, found: false, dir: 'left' }); hi = mid - 1; }
                }
                if (steps.length === 0 || !steps[steps.length - 1].found) {
                    steps.push({ lo: lo, hi: hi, mid: -1, found: null });
                }
                return steps;
            }

            function renderBsStep() {
                var idx = bsState.stepIdx;
                var steps = bsState.steps;
                var target = bsState.target;
                if (idx < 0) {
                    renderArr(0, arr.length - 1, -1);
                    pointersEl.textContent = '';
                    logEl.textContent = '';
                    stepBtn.disabled = steps.length === 0;
                    return;
                }
                var s = steps[idx];
                renderArr(s.lo, s.hi, s.mid, s.found);
                if (s.found === true) {
                    pointersEl.innerHTML = '<strong style="color:var(--green);">찾았습니다!</strong> arr[' + s.mid + '] = ' + arr[s.mid];
                    logEl.textContent = '총 ' + steps.length + '번 비교 (log\u2082(' + arr.length + ') \u2248 ' + Math.ceil(Math.log2(arr.length)) + ')';
                    stepBtn.disabled = true;
                } else if (s.found === false) {
                    pointersEl.innerHTML = 'L=' + s.lo + ', R=' + s.hi + ', mid=' + s.mid + ' \u2192 arr[' + s.mid + ']=' + arr[s.mid];
                    logEl.textContent = arr[s.mid] + (s.dir === 'right' ? ' < ' + target + ' \u2192 오른쪽 절반으로' : ' > ' + target + ' \u2192 왼쪽 절반으로');
                    stepBtn.disabled = false;
                } else {
                    pointersEl.innerHTML = '<strong style="color:var(--red);">' + target + '은(는) 배열에 없습니다</strong>';
                    logEl.textContent = '총 ' + (steps.length - 1) + '번 비교';
                    stepBtn.disabled = true;
                }
            }

            function resetBs() {
                var target = parseInt(targetInput.value);
                if (isNaN(target)) { msgEl.textContent = '숫자를 입력해주세요!'; bsState.steps = []; bsState.stepIdx = -1; stepBtn.disabled = true; return; }
                bsState.target = target;
                bsState.steps = buildBsSteps(target);
                bsState.stepIdx = -1;
                msgEl.textContent = 'Step 버튼을 눌러 한 단계씩 탐색을 진행하세요.';
                renderBsStep();
            }

            renderArr(0, arr.length - 1, -1);
            resetBs();

            stepBtn.addEventListener('click', function() {
                if (bsState.stepIdx < bsState.steps.length - 1) {
                    bsState.stepIdx++;
                    renderBsStep();
                }
            });
            resetBtn.addEventListener('click', function() {
                resetBs();
            });
        })();

        // ====== 데모 2: 합병 정렬 3단계 ======
        (function() {
            var msStepBtn = container.querySelector('#dc-demo-ms-step');
            var msReset = container.querySelector('#dc-demo-ms-reset');
            var msInput = container.querySelector('#dc-demo-ms-input');
            var msViz = container.querySelector('#dc-demo-ms-viz');
            var msPhase = container.querySelector('#dc-demo-ms-phase');
            var msMsg = container.querySelector('#dc-demo-ms-msg');
            var msState = { steps: [], stepIdx: -1 };

            function buildMergeSteps(arr) {
                var steps = [];
                function mergeSort(a, depth, label) {
                    if (a.length <= 1) return a;
                    var mid = Math.floor(a.length / 2);
                    var left = a.slice(0, mid);
                    var right = a.slice(mid);
                    steps.push({ phase: 'divide', arr: a.slice(), left: left.slice(), right: right.slice(), depth: depth, label: label });
                    var sl = mergeSort(left, depth + 1, label + 'L');
                    var sr = mergeSort(right, depth + 1, label + 'R');
                    var merged = [];
                    var i = 0, j = 0;
                    while (i < sl.length && j < sr.length) {
                        if (sl[i] <= sr[j]) merged.push(sl[i++]);
                        else merged.push(sr[j++]);
                    }
                    while (i < sl.length) merged.push(sl[i++]);
                    while (j < sr.length) merged.push(sr[j++]);
                    steps.push({ phase: 'merge', left: sl.slice(), right: sr.slice(), merged: merged.slice(), depth: depth, label: label });
                    return merged;
                }
                mergeSort(arr, 0, '');
                return steps;
            }

            function renderMergeUpTo(steps, upTo) {
                var boxStyle = 'display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;border:1.5px solid var(--border);border-radius:6px;font-size:0.85rem;font-weight:600;color:var(--text);margin:2px;padding:0 4px;';
                msViz.innerHTML = '';
                for (var k = 0; k <= upTo; k++) {
                    var step = steps[k];
                    if (step.phase === 'divide') {
                        var indent = '&nbsp;'.repeat(step.depth * 4);
                        msViz.innerHTML += '<div style="margin:4px 0;">' + indent +
                            '<span style="color:var(--accent);font-weight:600;">나누기: </span>' +
                            '[' + step.arr.join(', ') + '] \u2192 [' + step.left.join(', ') + '] + [' + step.right.join(', ') + ']</div>';
                    } else {
                        var indent = '&nbsp;'.repeat(step.depth * 4);
                        var mergedHtml = step.merged.map(function(v) {
                            return '<span style="' + boxStyle + 'border-color:var(--green);background:rgba(0,184,148,0.1);">' + v + '</span>';
                        }).join('');
                        msViz.innerHTML += '<div style="margin:4px 0;">' + indent +
                            '<span style="color:var(--green);font-weight:600;">합치기: </span>' +
                            '[' + step.left.join(', ') + '] + [' + step.right.join(', ') + '] \u2192 ' + mergedHtml + '</div>';
                    }
                }
                // Update phase description for current step
                var cur = steps[upTo];
                if (cur.phase === 'divide') {
                    msPhase.innerHTML = '<strong style="color:var(--accent);">1. 나누기(Divide)</strong>: [' + cur.arr.join(', ') + ']를 절반으로 나눕니다';
                } else {
                    msPhase.innerHTML = '<strong style="color:var(--green);">3. 합치기(Combine)</strong>: 정렬된 두 부분을 합칩니다 \u2192 [' + cur.merged.join(', ') + ']';
                }
            }

            function resetMs() {
                var vals = msInput.value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                if (vals.length < 2) { msMsg.textContent = '숫자를 2개 이상 입력해주세요!'; msState.steps = []; msState.stepIdx = -1; msStepBtn.disabled = true; return; }
                msState.steps = buildMergeSteps(vals);
                msState.stepIdx = -1;
                msViz.innerHTML = '';
                msPhase.textContent = '';
                msMsg.textContent = 'Step 버튼을 눌러 한 단계씩 정렬 과정을 확인하세요.';
                msStepBtn.disabled = false;
            }

            resetMs();

            msStepBtn.addEventListener('click', function() {
                if (msState.stepIdx < msState.steps.length - 1) {
                    msState.stepIdx++;
                    renderMergeUpTo(msState.steps, msState.stepIdx);
                    if (msState.stepIdx >= msState.steps.length - 1) {
                        msPhase.innerHTML = '<strong style="color:var(--green);">정렬 완료!</strong>';
                        msStepBtn.disabled = true;
                    }
                }
            });
            msReset.addEventListener('click', function() {
                resetMs();
            });
        })();

        // ====== 데모 3: 겹침 비교 (분할정복 vs DP) ======
        (function() {
            var msBtn = container.querySelector('#dc-demo-overlap-ms');
            var fibBtn = container.querySelector('#dc-demo-overlap-fib');
            var vizEl = container.querySelector('#dc-demo-overlap-viz');
            var statsEl = container.querySelector('#dc-demo-overlap-stats');
            var colors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#0984e3', '#d63031', '#00cec9', '#e84393'];

            // --- Merge Sort tree: manual step controls ---
            var msLines = [
                'sort([5,3,8,1])',
                '├─ sort(<span style="color:#6c5ce7">[5,3]</span>)',
                '│  ├─ sort([5])',
                '│  └─ sort([3])',
                '├─ sort(<span style="color:#00b894">[8,1]</span>)',
                '│  ├─ sort([8])',
                '│  └─ sort([1])',
                '└─ merge → [1,3,5,8]'
            ];
            var msStatsHtml =
                '<div style="padding:8px 14px;background:var(--bg);border-radius:8px;border-left:3px solid var(--accent);">' +
                '<strong>분할정복</strong>: 모든 부분 문제가 <strong style="color:var(--green);">서로 다름</strong><br>' +
                '왼쪽 [5,3]과 오른쪽 [8,1]은 완전히 독립적입니다.</div>';
            var msStep = -1;
            var msCtrlHtml =
                '<div id="dc-ms-ctrl" style="display:none;flex-direction:row;gap:12px;justify-content:center;align-items:center;margin-top:12px;">' +
                '<button id="dc-ms-prev" class="concept-demo-btn">\u2190 이전</button>' +
                '<span id="dc-ms-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>' +
                '<button id="dc-ms-next" class="concept-demo-btn">다음 \u2192</button>' +
                '</div>';
            vizEl.insertAdjacentHTML('afterend', msCtrlHtml);
            var msCtrl = container.querySelector('#dc-ms-ctrl');
            var msPrev = container.querySelector('#dc-ms-prev');
            var msNext = container.querySelector('#dc-ms-next');
            var msCounter = container.querySelector('#dc-ms-counter');

            function renderMsTree() {
                var html = '';
                for (var i = 0; i <= msStep; i++) {
                    html += '<div style="padding:2px 0;animation:fadeIn 0.3s ease;">' + msLines[i] + '</div>';
                }
                vizEl.innerHTML = html;
                if (msStep >= msLines.length - 1) {
                    statsEl.innerHTML = msStatsHtml;
                } else {
                    statsEl.innerHTML = '';
                }
                msCounter.textContent = msStep < 0 ? '시작 전' : (msStep + 1) + ' / ' + msLines.length;
                msPrev.disabled = msStep < 0;
                msNext.disabled = msStep >= msLines.length - 1;
            }

            msBtn.addEventListener('click', function() {
                msStep = -1;
                vizEl.innerHTML = '';
                statsEl.innerHTML = '';
                msCtrl.style.display = 'flex';
                // hide fib controls if visible
                fibCtrl.style.display = 'none';
                fibStep = -1;
                renderMsTree();
            });
            msPrev.addEventListener('click', function() {
                if (msStep >= 0) { msStep--; renderMsTree(); }
            });
            msNext.addEventListener('click', function() {
                if (msStep < msLines.length - 1) { msStep++; renderMsTree(); }
            });

            // --- Fibonacci tree: manual step controls ---
            var fibLines = [
                'fib(5)',
                '├─ fib(4)',
                '│  ├─ <span style="color:#e17055;font-weight:700;">fib(3)</span>',
                '│  │  ├─ <span style="color:#fdcb6e;font-weight:700;">fib(2)</span>',
                '│  │  └─ fib(1)',
                '│  └─ <span style="color:#fdcb6e;font-weight:700;">fib(2)</span> ← 중복!',
                '└─ <span style="color:#e17055;font-weight:700;">fib(3)</span> ← 중복!',
                '   ├─ <span style="color:#fdcb6e;font-weight:700;">fib(2)</span> ← 또 중복!',
                '   └─ fib(1)'
            ];
            var fibStatsHtml =
                '<div style="padding:8px 14px;background:var(--bg);border-radius:8px;border-left:3px solid var(--red);">' +
                '<strong>겹치는 부분 문제!</strong> fib(3)이 <strong style="color:var(--red);">2번</strong>, fib(2)가 <strong style="color:var(--red);">3번</strong> 호출됩니다.<br>' +
                '이런 경우에는 분할정복 대신 <strong>DP(메모이제이션)</strong>를 써서 중복 계산을 없앱니다.</div>';
            var fibStep = -1;
            var fibCtrlHtml =
                '<div id="dc-fib-ctrl" style="display:none;flex-direction:row;gap:12px;justify-content:center;align-items:center;margin-top:12px;">' +
                '<button id="dc-fib-prev" class="concept-demo-btn">\u2190 이전</button>' +
                '<span id="dc-fib-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>' +
                '<button id="dc-fib-next" class="concept-demo-btn">다음 \u2192</button>' +
                '</div>';
            msCtrl.insertAdjacentHTML('afterend', fibCtrlHtml);
            var fibCtrl = container.querySelector('#dc-fib-ctrl');
            var fibPrev = container.querySelector('#dc-fib-prev');
            var fibNext = container.querySelector('#dc-fib-next');
            var fibCounter = container.querySelector('#dc-fib-counter');

            function renderFibTree() {
                var html = '';
                for (var i = 0; i <= fibStep; i++) {
                    html += '<div style="padding:2px 0;animation:fadeIn 0.3s ease;">' + fibLines[i] + '</div>';
                }
                vizEl.innerHTML = html;
                if (fibStep >= fibLines.length - 1) {
                    statsEl.innerHTML = fibStatsHtml;
                } else {
                    statsEl.innerHTML = '';
                }
                fibCounter.textContent = fibStep < 0 ? '시작 전' : (fibStep + 1) + ' / ' + fibLines.length;
                fibPrev.disabled = fibStep < 0;
                fibNext.disabled = fibStep >= fibLines.length - 1;
            }

            fibBtn.addEventListener('click', function() {
                fibStep = -1;
                vizEl.innerHTML = '';
                statsEl.innerHTML = '';
                fibCtrl.style.display = 'flex';
                // hide ms controls if visible
                msCtrl.style.display = 'none';
                msStep = -1;
                renderFibTree();
            });
            fibPrev.addEventListener('click', function() {
                if (fibStep >= 0) { fibStep--; renderFibTree(); }
            });
            fibNext.addEventListener('click', function() {
                if (fibStep < fibLines.length - 1) { fibStep++; renderFibTree(); }
            });
        })();

        // ====== 데모 4: 빠른 거듭제곱 ======
        (function() {
            var powBtn = container.querySelector('#dc-demo-pow-btn');
            var baseInput = container.querySelector('#dc-demo-pow-base');
            var expInput = container.querySelector('#dc-demo-pow-exp');
            var naiveEl = container.querySelector('#dc-demo-pow-naive');
            var fastEl = container.querySelector('#dc-demo-pow-fast');
            var resultEl = container.querySelector('#dc-demo-pow-result');

            powBtn.addEventListener('click', function() {
                var base = parseInt(baseInput.value) || 2;
                var exp = parseInt(expInput.value) || 8;
                if (exp > 32) exp = 32;
                if (base > 10) base = 10;

                // Naive
                var naiveSteps = [];
                var val = 1;
                for (var i = 0; i < exp; i++) {
                    val *= base;
                    naiveSteps.push(base + '^' + (i + 1) + ' = ' + val);
                }
                naiveEl.innerHTML = naiveSteps.map(function(s, idx) {
                    return '<div style="animation:fadeIn 0.2s ease ' + (idx * 0.05) + 's both;">' + s + '</div>';
                }).join('');

                // Fast
                var fastSteps = [];
                function fastPow(b, n, prefix) {
                    if (n === 0) { fastSteps.push(prefix + b + '^0 = 1'); return 1; }
                    if (n === 1) { fastSteps.push(prefix + b + '^1 = ' + b); return b; }
                    if (n % 2 === 0) {
                        fastSteps.push(prefix + b + '^' + n + ' = (' + b + '^' + (n / 2) + ')²');
                        var half = fastPow(b, n / 2, prefix + '  ');
                        var result = half * half;
                        fastSteps.push(prefix + '= ' + half + '² = ' + result);
                        return result;
                    } else {
                        fastSteps.push(prefix + b + '^' + n + ' = ' + b + ' × (' + b + '^' + (n - 1) + ')');
                        var rest = fastPow(b, n - 1, prefix + '  ');
                        var result = b * rest;
                        fastSteps.push(prefix + '= ' + b + ' × ' + rest + ' = ' + result);
                        return result;
                    }
                }
                fastPow(base, exp, '');
                fastEl.innerHTML = fastSteps.map(function(s, idx) {
                    return '<div style="animation:fadeIn 0.2s ease ' + (idx * 0.08) + 's both;">' + s.replace(/ /g, '&nbsp;') + '</div>';
                }).join('');

                resultEl.innerHTML = '<strong>단순 곱셈</strong>: ' + naiveSteps.length + '번 계산 | <strong>분할정복</strong>: ' +
                    Math.ceil(Math.log2(exp + 1)) + '번 분할 → <strong style="color:var(--green);">' +
                    Math.round(naiveSteps.length / Math.max(1, Math.ceil(Math.log2(exp + 1)))) + '배 빠름!</strong>';
            });
        })();

        // ====== 데모 5: 색종이 쿼드트리 ======
        (function() {
            var grid = [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [1, 0, 1, 1],
                [0, 1, 1, 1]
            ];
            var gridEl = container.querySelector('#dc-demo-qt-grid');
            var resultEl = container.querySelector('#dc-demo-qt-result');
            var runBtn = container.querySelector('#dc-demo-qt-run');
            var resetBtn = container.querySelector('#dc-demo-qt-reset');

            function renderGrid() {
                gridEl.innerHTML = '';
                for (var r = 0; r < 4; r++) {
                    for (var c = 0; c < 4; c++) {
                        var cell = document.createElement('div');
                        cell.style.cssText = 'width:40px;height:40px;border:1.5px solid var(--border);border-radius:4px;cursor:pointer;transition:all 0.2s ease;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;';
                        cell.style.background = grid[r][c] ? 'var(--accent)' : 'var(--card)';
                        cell.style.color = grid[r][c] ? '#fff' : 'var(--text3)';
                        cell.textContent = grid[r][c];
                        cell.dataset.r = r;
                        cell.dataset.c = c;
                        cell.addEventListener('click', function() {
                            var rr = parseInt(this.dataset.r), cc = parseInt(this.dataset.c);
                            grid[rr][cc] = 1 - grid[rr][cc];
                            renderGrid();
                        });
                        gridEl.appendChild(cell);
                    }
                }
            }
            renderGrid();

            function quadtree(sr, sc, size, depth) {
                var allSame = true;
                var first = grid[sr][sc];
                for (var r = sr; r < sr + size; r++) {
                    for (var c = sc; c < sc + size; c++) {
                        if (grid[r][c] !== first) { allSame = false; break; }
                    }
                    if (!allSame) break;
                }
                var indent = '&nbsp;'.repeat(depth * 3);
                if (allSame) {
                    return [indent + '<span style="color:var(--green);font-weight:600;">' + first + '</span> (' + size + '×' + size + ' 동일)'];
                }
                var half = size / 2;
                var lines = [indent + '<span style="color:var(--accent);">(</span> ← ' + size + '×' + size + ' 4등분'];
                var parts = [
                    { label: '좌상', r: sr, c: sc },
                    { label: '우상', r: sr, c: sc + half },
                    { label: '좌하', r: sr + half, c: sc },
                    { label: '우하', r: sr + half, c: sc + half }
                ];
                parts.forEach(function(p) {
                    var sub = quadtree(p.r, p.c, half, depth + 1);
                    sub.forEach(function(l) { lines.push(l); });
                });
                lines.push(indent + '<span style="color:var(--accent);">)</span>');
                return lines;
            }

            runBtn.addEventListener('click', function() {
                var lines = quadtree(0, 0, 4, 0);
                resultEl.innerHTML = '';
                lines.forEach(function(line, i) {
                    setTimeout(function() {
                        resultEl.innerHTML += '<div style="animation:fadeIn 0.3s ease;">' + line + '</div>';
                    }, i * 150);
                });
            });

            resetBtn.addEventListener('click', function() {
                grid = [[0, 0, 1, 1], [0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1]];
                renderGrid();
                resultEl.innerHTML = '';
            });
        })();
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

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#viz-prev' + suffix);
        var nextBtn = container.querySelector('#viz-next' + suffix);
        var counter = container.querySelector('#viz-step-counter' + suffix);
        var desc = container.querySelector('#viz-step-desc' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
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
    // 시뮬레이션 1: 색종이 만들기 (boj-2630)
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
            self._createStepDesc(suffix) +
            '<div style="display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;">' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-tree' + suffix + '" style="flex:1;min-width:220px;max-height:400px;overflow-y:auto;padding:8px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--bg3);"></div>' +
            '</div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
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

            // Tree node tracking: each node has {id, label, depth, status}
            // status: 'unvisited' | 'current' | 'checking' | 'uniform' | 'mixed'
            var treeNodes = [];
            var treeNodeId = 0;

            function addTreeNode(r, c, sz, depth, parentId) {
                var id = treeNodeId++;
                treeNodes.push({ id: id, label: '[' + r + ',' + c + '] ' + sz + '\u00d7' + sz, depth: depth, status: 'unvisited', parentId: parentId, result: '' });
                return id;
            }

            function renderTree(highlightId) {
                var html = '<div style="font-size:0.8rem;font-weight:600;color:var(--text2);margin-bottom:8px;">재귀 호출 트리</div>';
                for (var i = 0; i < treeNodes.length; i++) {
                    var n = treeNodes[i];
                    var indent = n.depth * 24;
                    var borderCol = 'var(--bg3)';
                    var bgCol = 'var(--bg2)';
                    var shadow = '';
                    var textCol = 'var(--text)';
                    if (n.status === 'current' || n.status === 'checking') {
                        borderCol = 'var(--yellow)';
                        shadow = 'box-shadow:0 0 8px var(--yellow);';
                    } else if (n.status === 'uniform') {
                        bgCol = 'var(--green)15';
                        borderCol = 'var(--green)';
                        shadow = 'box-shadow:0 0 6px var(--green)40;';
                    } else if (n.status === 'mixed') {
                        borderCol = 'var(--red)';
                        bgCol = 'var(--red)10';
                    }
                    if (highlightId === n.id) {
                        shadow = 'box-shadow:0 0 10px var(--yellow);';
                    }
                    var resultTag = n.result ? ' <span style="font-size:0.75rem;color:var(--text2);">' + n.result + '</span>' : '';
                    html += '<div style="margin-left:' + indent + 'px;padding:6px 12px;margin:4px 0;border-radius:8px;border:2px solid ' + borderCol + ';background:' + bgCol + ';font-size:0.85rem;color:' + textCol + ';transition:all 0.3s;' + shadow + '">' + n.label + resultTag + '</div>';
                }
                treeEl.innerHTML = html;
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
            infoEl.innerHTML = '<span style="color:var(--text2);">' + SIZE + '\u00d7' + SIZE + ' 색종이를 검사합니다.</span>';

            // Pre-build tree structure with DFS
            function preAddNodes(r, c, sz, depth, parentId) {
                var nodeId = addTreeNode(r, c, sz, depth, parentId);
                var first = grid[r][c], allSame = true;
                for (var i = r; i < r + sz && allSame; i++)
                    for (var j = c; j < c + sz && allSame; j++)
                        if (grid[i][j] !== first) allSame = false;
                if (!allSame) {
                    var half = sz / 2;
                    preAddNodes(r, c, half, depth + 1, nodeId);
                    preAddNodes(r, c + half, half, depth + 1, nodeId);
                    preAddNodes(r + half, c, half, depth + 1, nodeId);
                    preAddNodes(r + half, c + half, half, depth + 1, nodeId);
                }
                return nodeId;
            }
            preAddNodes(0, 0, SIZE, 0, -1);

            // Build steps with granular actions
            var steps = [];
            var whiteCnt = 0, blueCnt = 0;
            var nodeIdx = 0; // tracks which tree node we are on

            function buildSteps(r, c, size, grid, depth) {
                var curNodeIdx = nodeIdx;
                nodeIdx++;

                var first = grid[r][c];
                var allSame = true;
                var diffR = -1, diffC = -1;
                for (var i = r; i < r + size && allSame; i++)
                    for (var j = c; j < c + size && allSame; j++)
                        if (grid[i][j] !== first) { allSame = false; diffR = i; diffC = j; }

                // Step 1: Announce region check
                (function(r2, c2, sz, nid) {
                    steps.push({
                        description: '영역 [' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ' — 이 영역이 <em>한 색</em>인지 확인해야 합니다. 단일 색이면 종이 1장, 아니면 더 쪼개야 합니다.',
                        action: function() {
                            var h = {};
                            for (var i = r2; i < r2 + sz; i++)
                                for (var j = c2; j < c2 + sz; j++)
                                    h[i + ',' + j] = 'border:3px solid var(--yellow);box-shadow:0 0 8px var(--yellow)40;';
                            renderGrid(h);
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ' 영역을 검사합니다.';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'unvisited';
                            renderGrid(null);
                            renderTree(-1);
                            infoEl.innerHTML = '(되돌리기)';
                        }
                    });
                })(r, c, size, curNodeIdx);

                // Step 2: Check cells - announce first color
                (function(r2, c2, sz, nid, firstVal) {
                    steps.push({
                        description: '셀을 하나씩 확인합니다. 첫 번째 색은 ' + (firstVal === 1 ? '파랑' : '흰색') + ' (' + firstVal + ') — 나머지 셀도 이 색과 같은지 비교합니다.',
                        action: function() {
                            var h = {};
                            // highlight first cell strongly
                            h[r2 + ',' + c2] = 'border:3px solid var(--green);box-shadow:0 0 10px var(--green)40;transform:scale(1.1);';
                            for (var i = r2; i < r2 + sz; i++)
                                for (var j = c2; j < c2 + sz; j++)
                                    if (!(i === r2 && j === c2)) h[i + ',' + j] = 'border:2px solid var(--yellow);opacity:0.7;';
                            renderGrid(h);
                            treeNodes[nid].status = 'checking';
                            renderTree(nid);
                            infoEl.innerHTML = '\uccab \ubc88\uc9f8 \uc140 [' + r2 + ',' + c2 + '] = <strong>' + firstVal + '</strong> (' + (firstVal === 1 ? '\ud30c\ub791' : '\ud770\uc0c9') + ')';
                        },
                        undo: function() {
                            var h = {};
                            for (var i = r2; i < r2 + sz; i++)
                                for (var j = c2; j < c2 + sz; j++)
                                    h[i + ',' + j] = 'border:3px solid var(--yellow);box-shadow:0 0 8px var(--yellow)40;';
                            renderGrid(h);
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(r, c, size, curNodeIdx, first);

                if (allSame) {
                    // Step 3: All same color - resolved
                    var color = first === 1 ? '\ud30c\ub791' : '\ud770\uc0c9';
                    var borderColor = first === 1 ? 'var(--accent)' : 'var(--green)';
                    (function(r2, c2, sz, col, bc, f, nid) {
                        steps.push({
                            description: '전부 같은 색(' + col + ')! → 이 영역은 <strong>' + col + ' 종이 1장</strong>으로 표현 가능하므로 카운트를 +1합니다.',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:3px solid ' + bc + ';box-shadow:0 0 10px ' + bc + '40;';
                                renderGrid(h);
                                if (f === 0) whiteCnt++; else blueCnt++;
                                treeNodes[nid].status = 'uniform';
                                treeNodes[nid].result = '\u2192 ' + col + ' (\ud770:' + whiteCnt + ' \ud30c:' + blueCnt + ')';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '\u00d7' + sz + ': \uc804\ubd80 ' + col + ' \u2192 <strong>' + col + ' +1</strong> (\ud770:' + whiteCnt + ', \ud30c:' + blueCnt + ')';
                            },
                            undo: function() {
                                if (f === 0) whiteCnt--; else blueCnt--;
                                treeNodes[nid].status = 'checking';
                                treeNodes[nid].result = '';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(r, c, size, color, borderColor, first, curNodeIdx);
                } else {
                    // Step 3: Different color found
                    (function(r2, c2, sz, nid, dr, dc) {
                        steps.push({
                            description: '다른 색 발견! [' + dr + ',' + dc + '] = ' + grid[dr][dc] + ' — 색이 섞여 있으므로 이 영역을 <em>하나의 종이로 표현할 수 없습니다</em>. 더 작게 나눠야 합니다.',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:2px solid var(--yellow);opacity:0.7;';
                                h[dr + ',' + dc] = 'border:3px solid var(--red);box-shadow:0 0 10px var(--red)40;transform:scale(1.1);';
                                h[r2 + ',' + c2] = 'border:3px solid var(--green);box-shadow:0 0 10px var(--green)40;';
                                renderGrid(h);
                                treeNodes[nid].status = 'checking';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + ']=' + grid[r2][c2] + ' vs [' + dr + ',' + dc + ']=' + grid[dr][dc] + ' → <strong>다른 색 발견!</strong>';
                            },
                            undo: function() {
                                treeNodes[nid].status = 'checking';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(되돌리기)';
                            }
                        });
                    })(r, c, size, curNodeIdx, diffR, diffC);

                    // Step 4: Subdivide
                    (function(r2, c2, sz, nid) {
                        var half = sz / 2;
                        steps.push({
                            description: '색이 섞여 단일 종이 불가 → <strong>4등분</strong>하여 ' + half + '×' + half + ' 4개 영역으로 나눕니다. 각 부분이 단일 색인지 다시 확인합니다.',
                            action: function() {
                                var h = {};
                                var colors = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7'];
                                var regions = [[r2,c2],[r2,c2+half],[r2+half,c2],[r2+half,c2+half]];
                                for (var q = 0; q < 4; q++) {
                                    var rr = regions[q][0], cc = regions[q][1];
                                    for (var i = rr; i < rr + half; i++)
                                        for (var j = cc; j < cc + half; j++)
                                            h[i + ',' + j] = 'border:3px solid ' + colors[q] + ';';
                                }
                                renderGrid(h);
                                treeNodes[nid].status = 'mixed';
                                treeNodes[nid].result = '\u2192 4\ub4f1\ubd84';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '\u00d7' + sz + ' \u2192 <strong>4\ub4f1\ubd84!</strong> \uac01 ' + half + '\u00d7' + half + ' \uc601\uc5ed\uc73c\ub85c \ub098\ub244\ub2c8\ub2e4.';
                            },
                            undo: function() {
                                treeNodes[nid].status = 'checking';
                                treeNodes[nid].result = '';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(r, c, size, curNodeIdx);

                    var half = size / 2;
                    buildSteps(r, c, half, grid, depth + 1);
                    buildSteps(r, c + half, half, grid, depth + 1);
                    buildSteps(r + half, c, half, grid, depth + 1);
                    buildSteps(r + half, c + half, half, grid, depth + 1);
                }
            }
            whiteCnt = 0; blueCnt = 0;
            nodeIdx = 0;
            buildSteps(0, 0, SIZE, grid, 0);
            var finalW = 0, finalB = 0;
            (function countAll(r,c,sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) { if(f===0) finalW++; else finalB++; }
                else { var h2=sz/2; countAll(r,c,h2); countAll(r,c+h2,h2); countAll(r+h2,c,h2); countAll(r+h2,c+h2,h2); }
            })(0,0,SIZE);
            steps.push({
                description: '\uc644\uc131! \ud770\uc0c9 ' + finalW + '\uac1c, \ud30c\ub780\uc0c9 ' + finalB + '\uac1c',
                action: function() {
                    renderGrid(null);
                    for (var i = 0; i < treeNodes.length; i++) if (treeNodes[i].status !== 'mixed') treeNodes[i].status = 'uniform';
                    renderTree(-1);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 \uc644\uc131! \ud770\uc0c9: ' + finalW + '\uac1c, \ud30c\ub780\uc0c9: ' + finalB + '\uac1c</strong>';
                },
                undo: function() { renderGrid(null); renderTree(-1); infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)'; }
            });
            whiteCnt = 0; blueCnt = 0;
            renderTree(-1);
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // 시뮬레이션 2: 쿼드트리 (boj-1992)
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
            self._createStepDesc(suffix) +
            '<div style="display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;">' +
            '<div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:8px;"></div>' +
            '<div id="dc-result' + suffix + '" style="font-family:monospace;font-size:1.1rem;padding:8px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:30px;"></div>' +
            '</div>' +
            '<div id="dc-tree' + suffix + '" style="flex:1;min-width:220px;max-height:400px;overflow-y:auto;padding:8px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--bg3);"></div>' +
            '</div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
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

            // Tree node tracking
            var treeNodes = [];
            var treeNodeId = 0;

            function addTreeNode(r, c, sz, depth, parentId) {
                var id = treeNodeId++;
                treeNodes.push({ id: id, label: '[' + r + ',' + c + '] ' + sz + '\u00d7' + sz, depth: depth, status: 'unvisited', parentId: parentId, result: '' });
                return id;
            }

            function renderTree(highlightId) {
                var html = '<div style="font-size:0.8rem;font-weight:600;color:var(--text2);margin-bottom:8px;">쿼드트리 구조</div>';
                for (var i = 0; i < treeNodes.length; i++) {
                    var n = treeNodes[i];
                    var indent = n.depth * 24;
                    var borderCol = 'var(--bg3)';
                    var bgCol = 'var(--bg2)';
                    var shadow = '';
                    if (n.status === 'current' || n.status === 'checking') {
                        borderCol = 'var(--yellow)';
                        shadow = 'box-shadow:0 0 8px var(--yellow);';
                    } else if (n.status === 'uniform') {
                        bgCol = 'var(--green)15';
                        borderCol = 'var(--green)';
                        shadow = 'box-shadow:0 0 6px var(--green)40;';
                    } else if (n.status === 'mixed') {
                        borderCol = 'var(--red)';
                        bgCol = 'var(--red)10';
                    }
                    if (highlightId === n.id) {
                        shadow = 'box-shadow:0 0 10px var(--yellow);';
                    }
                    var resultTag = n.result ? ' <span style="font-size:0.75rem;color:var(--text2);">' + n.result + '</span>' : '';
                    html += '<div style="margin-left:' + indent + 'px;padding:6px 12px;margin:4px 0;border-radius:8px;border:2px solid ' + borderCol + ';background:' + bgCol + ';font-size:0.85rem;color:var(--text);transition:all 0.3s;' + shadow + '">' + n.label + resultTag + '</div>';
                }
                treeEl.innerHTML = html;
            }

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

            // Pre-build tree structure
            function preAddNodes(r, c, sz, depth, parentId) {
                var nodeId = addTreeNode(r, c, sz, depth, parentId);
                var first = grid[r][c], allSame = true;
                for (var i = r; i < r + sz && allSame; i++)
                    for (var j = c; j < c + sz && allSame; j++)
                        if (grid[i][j] !== first) allSame = false;
                if (!allSame) {
                    var half = sz / 2;
                    preAddNodes(r, c, half, depth + 1, nodeId);
                    preAddNodes(r, c + half, half, depth + 1, nodeId);
                    preAddNodes(r + half, c, half, depth + 1, nodeId);
                    preAddNodes(r + half, c + half, half, depth + 1, nodeId);
                }
                return nodeId;
            }
            preAddNodes(0, 0, SIZE, 0, -1);

            // 쿼드트리 결과 먼저 계산
            function quadResult(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) return '' + f;
                var h = sz/2;
                return '(' + quadResult(r,c,h) + quadResult(r,c+h,h) + quadResult(r+h,c,h) + quadResult(r+h,c+h,h) + ')';
            }
            var finalResult = quadResult(0, 0, SIZE);

            var steps = [];
            var resultStr = '';
            var nodeIdx = 0;

            function buildSteps(r, c, sz) {
                var curNodeIdx = nodeIdx;
                nodeIdx++;

                var f = grid[r][c], ok = true;
                var diffR = -1, diffC = -1;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) { ok=false; diffR=i; diffC=j; }

                // Step 1: Announce region
                (function(r2, c2, sz2, nid) {
                    steps.push({
                        description: '영역 [' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ' — 모든 셀이 같은 값이면 그 숫자 하나로 압축, 아니면 4등분이 필요합니다.',
                        action: function() {
                            var h = {};
                            for (var i = r2; i < r2 + sz2; i++)
                                for (var j = c2; j < c2 + sz2; j++)
                                    h[i + ',' + j] = 'border:3px solid var(--yellow);box-shadow:0 0 8px var(--yellow)40;';
                            renderGrid(h);
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ' 영역을 검사합니다.';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'unvisited';
                            renderGrid(null);
                            renderTree(-1);
                            infoEl.innerHTML = '(되돌리기)';
                        }
                    });
                })(r, c, sz, curNodeIdx);

                // Step 2: Check cells
                (function(r2, c2, sz2, nid, firstVal) {
                    steps.push({
                        description: '셀을 확인합니다. 첫 번째 값은 ' + firstVal + ' — 나머지도 같은지 비교합니다.',
                        action: function() {
                            var h = {};
                            h[r2 + ',' + c2] = 'border:3px solid var(--green);box-shadow:0 0 10px var(--green)40;transform:scale(1.1);';
                            for (var i = r2; i < r2 + sz2; i++)
                                for (var j = c2; j < c2 + sz2; j++)
                                    if (!(i === r2 && j === c2)) h[i + ',' + j] = 'border:2px solid var(--yellow);opacity:0.7;';
                            renderGrid(h);
                            treeNodes[nid].status = 'checking';
                            renderTree(nid);
                            infoEl.innerHTML = '\uccab \ubc88\uc9f8 \uc140 [' + r2 + ',' + c2 + '] = <strong>' + firstVal + '</strong>';
                        },
                        undo: function() {
                            var h = {};
                            for (var i = r2; i < r2 + sz2; i++)
                                for (var j = c2; j < c2 + sz2; j++)
                                    h[i + ',' + j] = 'border:3px solid var(--yellow);box-shadow:0 0 8px var(--yellow)40;';
                            renderGrid(h);
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(r, c, sz, curNodeIdx, f);

                if (ok) {
                    // Step 3: All same - output digit
                    (function(r2, c2, sz2, val, nid) {
                        steps.push({
                            description: '전부 같은 값 ' + val + '! → 영역 전체를 숫자 <strong>"' + val + '"</strong> 하나로 압축합니다. 더 이상 나눌 필요 없습니다.',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--green);box-shadow:0 0 8px var(--green)40;';
                                renderGrid(h);
                                resultStr += '' + val;
                                resultEl.textContent = resultStr;
                                treeNodes[nid].status = 'uniform';
                                treeNodes[nid].result = '\u2192 "' + val + '"';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + ']: \uc804\ubd80 ' + val + ' \u2192 <strong>"' + val + '"</strong> \ucd9c\ub825';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                treeNodes[nid].status = 'checking';
                                treeNodes[nid].result = '';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(r, c, sz, f, curNodeIdx);
                } else {
                    // Step 3: Different color found
                    (function(r2, c2, sz2, nid, dr, dc) {
                        steps.push({
                            description: '다른 값 발견! [' + dr + ',' + dc + '] = ' + grid[dr][dc] + ' — 값이 섞여 있으므로 하나의 숫자로 압축 불가. 4등분이 필요합니다.',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz2; i++)
                                    for (var j = c2; j < c2 + sz2; j++)
                                        h[i + ',' + j] = 'border:2px solid var(--yellow);opacity:0.7;';
                                h[dr + ',' + dc] = 'border:3px solid var(--red);box-shadow:0 0 10px var(--red)40;transform:scale(1.1);';
                                h[r2 + ',' + c2] = 'border:3px solid var(--green);box-shadow:0 0 10px var(--green)40;';
                                renderGrid(h);
                                treeNodes[nid].status = 'checking';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + ']=' + grid[r2][c2] + ' vs [' + dr + ',' + dc + ']=' + grid[dr][dc] + ' → <strong>다른 색!</strong>';
                            },
                            undo: function() {
                                treeNodes[nid].status = 'checking';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(되돌리기)';
                            }
                        });
                    })(r, c, sz, curNodeIdx, diffR, diffC);

                    // Step 4: Subdivide + open paren
                    (function(r2, c2, sz2, nid) {
                        var half = sz2 / 2;
                        steps.push({
                            description: '값이 섞여 압축 불가 → <strong>"(" 열고 4등분</strong>하여 ' + half + '×' + half + ' 4개 하위 영역을 재귀적으로 처리합니다.',
                            action: function() {
                                var h = {};
                                var colors = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7'];
                                var regions = [[r2,c2],[r2,c2+half],[r2+half,c2],[r2+half,c2+half]];
                                for (var q = 0; q < 4; q++) {
                                    var rr = regions[q][0], cc = regions[q][1];
                                    for (var i = rr; i < rr + half; i++)
                                        for (var j = cc; j < cc + half; j++)
                                            h[i + ',' + j] = 'border:3px solid ' + colors[q] + ';';
                                }
                                renderGrid(h);
                                resultStr += '(';
                                resultEl.textContent = resultStr;
                                treeNodes[nid].status = 'mixed';
                                treeNodes[nid].result = '\u2192 (...)';
                                renderTree(nid);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '\u00d7' + sz2 + ': \uc0c9\uc774 \uc12c\uc784 \u2192 <strong>"(" \uc5f4\uae30</strong>, 4\ub4f1\ubd84!';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                treeNodes[nid].status = 'checking';
                                treeNodes[nid].result = '';
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(r, c, sz, curNodeIdx);

                    var h = sz/2;
                    buildSteps(r, c, h);
                    buildSteps(r, c+h, h);
                    buildSteps(r+h, c, h);
                    buildSteps(r+h, c+h, h);

                    // Close paren
                    (function(r2, c2, sz2, nid) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ' 4개 하위 영역 처리 완료 → <strong>")" 닫기</strong>로 이 영역의 압축 결과를 마무리합니다.',
                            action: function() {
                                renderGrid(null);
                                resultStr += ')';
                                resultEl.textContent = resultStr;
                                renderTree(-1);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] \uc601\uc5ed \uc644\ub8cc \u2192 <strong>")" \ub2eb\uae30</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                renderTree(-1);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(r, c, sz, curNodeIdx);
                }
            }
            buildSteps(0, 0, SIZE);
            steps.push({
                description: '\uc644\uc131! \uacb0\uacfc: ' + finalResult,
                action: function() {
                    renderGrid(null);
                    resultEl.textContent = finalResult;
                    for (var i = 0; i < treeNodes.length; i++) if (treeNodes[i].status !== 'mixed') treeNodes[i].status = 'uniform';
                    renderTree(-1);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 \uc644\uc131! ' + finalResult + '</strong>';
                },
                undo: function() { renderGrid(null); renderTree(-1); infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)'; }
            });
            resultStr = '';
            renderTree(-1);
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // 시뮬레이션 3: 종이의 개수 (boj-1780)
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
            self._createStepDesc(suffix) +
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
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 전부 ' + val + ' → 이 영역은 값 ' + val + '인 <strong>종이 1장</strong>으로 카운트합니다.',
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
                                infoEl.innerHTML = '(되돌리기)';
                            }
                        });
                    })(r, c, sz, f);
                } else {
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 값이 섞여 있어 한 장으로 표현 불가 → <strong>9등분</strong>하여 각 부분을 다시 확인합니다.',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--red);';
                                renderGrid(h);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': 값이 다름 → <strong>9등분!</strong>';
                            },
                            undo: function() {
                                renderGrid(null);
                                infoEl.innerHTML = '(되돌리기)';
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
                undo: function() { renderGrid(null); infoEl.innerHTML = '(되돌리기)'; }
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
    // 시뮬레이션 4: 곱셈 - 빠른 거듭제곱 (boj-1629)
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
            self._createStepDesc(suffix) +
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

            // 분할 트리를 만들기 위해 지수를 따라감
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
                        description: A + '^' + exp + ': 지수가 ' + (odd ? '홀수' : '짝수') + '이므로 ' + A + '^' + half + '만 구하면 됩니다 → ' + A + '^' + half + ' × ' + A + '^' + half + (odd ? ' × ' + A : '') + '. <em>O(B) → O(log B)</em>로 단축!',
                        action: function() {
                            infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + A + '<sup>' + half + '</sup> × ' + A + '<sup>' + half + '</sup>' + (odd ? ' × ' + A : '') + ' (' + (odd ? '홀수: 반×반×밑' : '짝수: 반×반') + ')';
                        },
                        undo: function() {
                            infoEl.innerHTML = '(되돌리기)';
                        }
                    });
                })(i);
            }
            // 기저 조건
            var baseExp = nodes[nodes.length - 1].exp;
            var baseVal = A % C;
            (function(be, bv, lastIdx) {
                steps.push({
                    description: '기저 조건: 지수가 1이 되면 더 나눌 수 없으므로 직접 계산합니다. ' + A + '^' + be + ' = ' + bv + ' (mod ' + C + ')',
                    action: function() { nodes[lastIdx].value = bv; renderTree(); infoEl.innerHTML = '기저: ' + A + '<sup>' + be + '</sup> mod ' + C + ' = <strong>' + bv + '</strong>'; },
                    undo: function() { nodes[lastIdx].value = null; renderTree(); infoEl.innerHTML = '(되돌리기)'; }
                });
            })(baseExp, baseVal, nodes.length - 1);

            // 합치기 스텝: 아래에서 위로
            function pw(a, b, m) { var r = 1; a = a % m; if (a === 0) return 0; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }
            for (var i = nodes.length - 2; i >= 0; i--) {
                (function(idx) {
                    var exp = nodes[idx].exp;
                    var half = Math.floor(exp / 2);
                    var halfVal = pw(A, half, C);
                    var result = halfVal * halfVal % C;
                    if (exp % 2 === 1) result = result * (A % C) % C;
                    steps.push({
                        description: '합치기: 하위 결과(' + A + '^' + Math.floor(exp/2) + '=' + halfVal + ')를 제곱' + (exp % 2 === 1 ? '하고 밑을 한 번 더 곱해' : '해서') + ' ' + A + '^' + exp + ' = ' + result + ' (mod ' + C + ')',
                        action: function() { nodes[idx].value = result; renderTree(); infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + halfVal + ' × ' + halfVal + (exp % 2 === 1 ? ' × ' + (A%C) : '') + ' mod ' + C + ' = <strong>' + result + '</strong>'; },
                        undo: function() { nodes[idx].value = null; renderTree(); infoEl.innerHTML = '(되돌리기)'; }
                    });
                })(i);
            }
            // 최종 결과
            var finalVal = pw(A, B, C);
            steps.push({
                description: '완성! ' + A + '^' + B + ' mod ' + C + ' = ' + finalVal,
                action: function() { nodes[0].value = finalVal; renderTree(); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + A + '<sup>' + B + '</sup> mod ' + C + ' = ' + finalVal + '</strong>'; },
                undo: function() { nodes[0].value = null; renderTree(); infoEl.innerHTML = '(되돌리기)'; }
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
    // 시뮬레이션 5: 이항 계수 3 (boj-11401)
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
            self._createStepDesc(suffix) +
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
                { description: 'C(N,K) = N!/(K!·(N-K)!) — 분모를 직접 나눌 수 없으니 먼저 팩토리얼을 mod ' + MOD + '로 구합니다.',
                  action: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; },
                  undo: function() { calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)'; infoEl.innerHTML = '<span style="color:var(--text2);">페르마 소정리로 모듈러 역원을 구합니다.</span>'; }
                },
                { description: '모듈러에서는 나눗셈 대신 <em>역원</em>을 곱합니다. 페르마 소정리: ' + K + '!의 역원 = ' + fac[K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invK,
                  action: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = '팩토리얼 계산 완료 (mod ' + MOD + ')'; }
                },
                { description: '같은 원리로 ' + (N-K) + '!의 역원도 구합니다: ' + fac[N-K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invNK,
                  action: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → 역원 = ' + fac[N-K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!의 모듈러 역원: <strong>' + invNK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → 역원 = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!의 모듈러 역원: <strong>' + invK + '</strong>'; }
                },
                { description: 'N!에 두 역원을 곱하면 나눗셈 효과: ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = ' + ans,
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
    // 시뮬레이션 6: 행렬 곱셈 (boj-2740)
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
            self._createStepDesc(suffix) +
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
                            description: 'C[' + ii + '][' + jj + ']: A의 ' + ii + '행과 B의 ' + jj + '열을 원소별로 곱한 뒤 합산 = ' + parts.join(' + ') + ' = ' + val + (isLast ? '. 완성!' : ''),
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
                                infoEl.innerHTML = '(되돌리기)';
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
    // 시뮬레이션 7: 행렬 제곱 (boj-10830)
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
            self._createStepDesc(suffix) +
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

            // 분할 과정에서의 지수 리스트 생성
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
                        description: '지수 ' + exp + '은 ' + (odd ? '홀수' : '짝수') + ' → M^' + half + '만 구하면 제곱' + (odd ? '후 ×M' : '') + '으로 완성. 숫자 거듭제곱과 동일한 분할정복!',
                        action: function() { matEl.innerHTML = 'M<sup>' + exp + '</sup> → M<sup>' + half + '</sup> 먼저 계산!'; infoEl.innerHTML = (odd ? '홀수' : '짝수') + ' 지수: M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> × M<sup>' + half + '</sup>' + (odd ? ' × M' : ''); },
                        undo: function() { matEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
                    });
                })(exps[i]);
            }
            // 기저: M^1 = M mod MOD
            var M1 = [[M[0][0]%MOD,M[0][1]%MOD],[M[1][0]%MOD,M[1][1]%MOD]];
            steps.push({
                description: '기저 조건: 지수 1이면 행렬 자체입니다. M^1 = ' + matStr(M1) + ' (mod ' + MOD + ')',
                action: function() { matEl.innerHTML = showM(M1, 'M¹'); infoEl.innerHTML = '기저: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { matEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
            });
            // 합치기 과정: 아래에서 위로
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(M, exp);
                    var superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
                    var supStr = ('' + exp).split('').map(function(d){return superscripts[d]||d;}).join('');
                    steps.push({
                        description: '합치기: 하위 결과를 행렬 곱셈으로 합쳐 M^' + exp + ' = ' + matStr(result),
                        action: function() { matEl.innerHTML = showM(result, 'M' + supStr); infoEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); },
                        undo: function() { matEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
                    });
                })(exps[i]);
            }
            // 최종
            var finalM = matPow(M, B);
            steps.push({
                description: '완성! M^' + B + ' mod ' + MOD + ' = ' + matStr(finalM),
                action: function() { matEl.innerHTML = showM(finalM, 'M^' + B + ' mod ' + MOD); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 완성! ' + matStr(finalM) + '</strong>'; },
                undo: function() { matEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
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
    // 시뮬레이션 8: 피보나치 수 6 (boj-11444)
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
            self._createStepDesc(suffix) +
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
                        description: 'M^' + exp + ': 지수 ' + (odd ? '홀수' : '짝수') + ' → M^' + half + '를 먼저 구한 뒤 ' + (odd ? '반×반×M' : '반×반') + '으로 합칩니다. O(n) → O(log n)!',
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> × M<sup>' + half + '</sup>' + (odd ? ' × M' : '') + ' (' + (odd ? '홀수' : '짝수') + ')'; infoEl.innerHTML = exp + '은 ' + (odd ? '홀수' : '짝수') + ' → <strong>M^' + half + '를 먼저 구합니다</strong>'; },
                        undo: function() { fibEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
                    });
                })(exps[i]);
            }

            // 기저: M^1
            var M1 = [[1,1],[1,0]];
            steps.push({
                description: '기저 조건: M^1 = [[1,1],[1,0]] — 피보나치 점화식 F(n)=F(n-1)+F(n-2)를 행렬로 표현한 것입니다.',
                action: function() { fibEl.innerHTML = 'M<sup>1</sup> = ' + matStr(M1); infoEl.innerHTML = '기저: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { fibEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
            });

            // 합치기 과정
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(base, exp);
                    steps.push({
                        description: '합치기: M^' + exp + ' = ' + matStr(result) + ' → [0][1] 원소가 F(' + exp + ') = ' + result[0][1],
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); infoEl.innerHTML = 'M<sup>' + exp + '</sup>[0][1] = <strong>' + result[0][1] + '</strong>'; },
                        undo: function() { fibEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
                    });
                })(exps[i]);
            }

            // 최종 결과
            var finalM = matPow(base, n);
            var fibN = finalM[0][1];
            steps.push({
                description: '완성! F(' + n + ') = ' + fibN,
                action: function() { fibEl.innerHTML = 'F(' + n + ') = M<sup>' + n + '</sup>[0][1] = <strong style="font-size:1.2rem;color:var(--green);">' + fibN + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ F(' + n + ') = ' + fibN + ' (O(log n)에 계산!)</strong>'; },
                undo: function() { fibEl.innerHTML = '(되돌리기)'; infoEl.innerHTML = '(되돌리기)'; }
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
    // 시뮬레이션 9: 히스토그램 (boj-6549)
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
            self._createStepDesc(suffix) +
            '<div style="display:flex;gap:2rem;align-items:flex-start;flex-wrap:wrap;">' +
            '<div id="dc-bars' + suffix + '" style="display:flex;gap:2px;align-items:flex-end;height:160px;margin-bottom:12px;"></div>' +
            '<div id="dc-tree' + suffix + '" style="flex:1;min-width:220px;max-height:360px;overflow-y:auto;padding:8px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--bg3);"></div>' +
            '</div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#dc-bars' + suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-histo-input');
        var resetBtn = container.querySelector('#dc-histo-reset');

        function parseBars(s) { return s.trim().split(',').map(function(v) { return Math.max(0, parseInt(v) || 0); }).filter(function(v) { return v >= 0; }); }

        function buildAndRun(bars) {
            if (bars.length < 1) bars = [1];
            var maxH = Math.max.apply(null, bars) || 1;

            // Tree node tracking for recursive call tree
            var treeNodes = [];
            var treeNodeId = 0;

            function addTreeNode(lo, hi, depth, parentId) {
                var id = treeNodeId++;
                treeNodes.push({ id: id, label: '[' + lo + '..' + hi + ']', depth: depth, status: 'unvisited', parentId: parentId, result: '' });
                return id;
            }

            function renderTree(highlightId) {
                var html = '<div style="font-size:0.8rem;font-weight:600;color:var(--text2);margin-bottom:8px;">재귀 분할 트리</div>';
                for (var i = 0; i < treeNodes.length; i++) {
                    var n = treeNodes[i];
                    var indent = n.depth * 24;
                    var borderCol = 'var(--bg3)';
                    var bgCol = 'var(--bg2)';
                    var shadow = '';
                    if (n.status === 'current') {
                        borderCol = 'var(--yellow)';
                        shadow = 'box-shadow:0 0 8px var(--yellow);';
                    } else if (n.status === 'resolved') {
                        bgCol = 'var(--green)15';
                        borderCol = 'var(--green)';
                        shadow = 'box-shadow:0 0 6px var(--green)40;';
                    } else if (n.status === 'split') {
                        borderCol = 'var(--accent)';
                        bgCol = 'var(--accent)10';
                    } else if (n.status === 'cross') {
                        borderCol = 'var(--red)';
                        bgCol = 'var(--red)10';
                    }
                    if (highlightId === n.id) {
                        shadow = 'box-shadow:0 0 10px var(--yellow);';
                    }
                    var resultTag = n.result ? ' <span style="font-size:0.75rem;color:var(--text2);">' + n.result + '</span>' : '';
                    html += '<div style="margin-left:' + indent + 'px;padding:6px 12px;margin:4px 0;border-radius:8px;border:2px solid ' + borderCol + ';background:' + bgCol + ';font-size:0.85rem;color:var(--text);transition:all 0.3s;' + shadow + '">' + n.label + resultTag + '</div>';
                }
                treeEl.innerHTML = html;
            }

            function renderBars(highlights, rectRange, rangeHL) {
                barsEl.innerHTML = bars.map(function(h, i) {
                    var pct = (h / maxH) * 100;
                    var bg = 'var(--accent)';
                    var extra = '';
                    if (rangeHL && i >= rangeHL.lo && i <= rangeHL.hi) {
                        bg = rangeHL.color || 'var(--yellow)';
                        extra = 'box-shadow:0 0 6px var(--yellow)40;';
                    }
                    if (highlights && highlights[i]) { bg = highlights[i]; }
                    if (rectRange && i >= rectRange.l && i <= rectRange.r) { extra = 'box-shadow:0 0 6px var(--green)40;'; bg = 'var(--green)'; }
                    return '<div style="width:40px;height:' + (pct/100*160) + 'px;background:' + bg + ';border-radius:4px 4px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:0.8rem;font-weight:600;color:white;' + extra + '">' + h + '</div>';
                }).join('');
            }
            renderBars(null, null, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">배열을 반으로 나누고, 왼/오/가운데 걸침 중 최대를 구합니다.</span>';

            // Pre-compute all results via full recursion
            function solve(lo, hi) {
                if (lo === hi) return { area: bars[lo], l: lo, r: lo };
                var mid = Math.floor((lo + hi) / 2);
                var leftRes = solve(lo, mid);
                var rightRes = solve(mid + 1, hi);
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

            // Pre-build tree structure
            function preAddNodes(lo, hi, depth, parentId) {
                var nodeId = addTreeNode(lo, hi, depth, parentId);
                if (lo < hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    preAddNodes(lo, mid, depth + 1, nodeId);
                    preAddNodes(mid + 1, hi, depth + 1, nodeId);
                }
                return nodeId;
            }

            var n = bars.length;
            preAddNodes(0, n - 1, 0, -1);

            var steps = [];
            var nodeIdx = 0;

            // Build steps recursively following the divide-and-conquer order
            function buildSteps(lo, hi, depth) {
                var curNodeIdx = nodeIdx;
                nodeIdx++;
                var mid = Math.floor((lo + hi) / 2);

                // Step: Announce range
                (function(lo2, hi2, nid) {
                    steps.push({
                        description: '범위 [' + lo2 + '..' + hi2 + '] — 이 구간에서 가능한 최대 직사각형을 찾아야 합니다.',
                        action: function() {
                            renderBars(null, null, {lo: lo2, hi: hi2, color: 'var(--yellow)'});
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '\ubc94\uc704 [' + lo2 + '..' + hi2 + ']\ub97c \uac80\uc0ac\ud569\ub2c8\ub2e4.';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'unvisited';
                            renderBars(null, null, null);
                            renderTree(-1);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(lo, hi, curNodeIdx);

                if (lo === hi) {
                    // Base case: single bar
                    (function(idx, nid) {
                        steps.push({
                            description: '기저 조건! 막대가 1개뿐이므로 더 나눌 수 없습니다. bars[' + idx + '] = ' + bars[idx] + ' → 넓이 = ' + bars[idx],
                            action: function() {
                                renderBars(null, {l: idx, r: idx}, null);
                                treeNodes[nid].status = 'resolved';
                                treeNodes[nid].result = '\u2192 \ub113\uc774 ' + bars[idx];
                                renderTree(nid);
                                infoEl.innerHTML = '\uae30\uc800 \uc870\uac74: bars[' + idx + '] = ' + bars[idx] + ' \u2192 <strong>\ub113\uc774 = ' + bars[idx] + '</strong>';
                            },
                            undo: function() {
                                treeNodes[nid].status = 'current';
                                treeNodes[nid].result = '';
                                renderBars(null, null, {lo: idx, hi: idx, color: 'var(--yellow)'});
                                renderTree(nid);
                                infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                            }
                        });
                    })(lo, curNodeIdx);
                    return;
                }

                // Step: Split into halves
                (function(lo2, hi2, m, nid) {
                    steps.push({
                        description: '최대 직사각형은 왼쪽에만, 오른쪽에만, 또는 가운데 걸쳐 있을 수 있습니다. 먼저 반으로 나눕니다: [' + lo2 + '..' + m + '], [' + (m+1) + '..' + hi2 + ']',
                        action: function() {
                            var h = {};
                            for (var i = lo2; i <= m; i++) h[i] = 'var(--accent)';
                            for (var i = m+1; i <= hi2; i++) h[i] = '#6c5ce7';
                            renderBars(h, null, null);
                            treeNodes[nid].status = 'split';
                            renderTree(nid);
                            infoEl.innerHTML = '\uc67c\ucabd [' + lo2 + '..' + m + '] (blue), \uc624\ub978\ucabd [' + (m+1) + '..' + hi2 + '] (purple)';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'current';
                            renderBars(null, null, {lo: lo2, hi: hi2, color: 'var(--yellow)'});
                            renderTree(nid);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(lo, hi, mid, curNodeIdx);

                // Recurse left
                buildSteps(lo, mid, depth + 1);

                // Recurse right
                buildSteps(mid + 1, hi, depth + 1);

                // Compute cross result
                var leftRes = solve(lo, mid);
                var rightRes = solve(mid + 1, hi);
                // Cross computation for this range
                var cl2 = mid, cr2 = mid + 1;
                var ch2 = Math.min(bars[cl2], bars[cr2]);
                var crossMax2 = ch2 * 2, bestCl2 = cl2, bestCr2 = cr2;
                var tl2 = cl2, tr2 = cr2, th2 = ch2;
                while (tl2 > lo || tr2 < hi) {
                    if (tl2 > lo && (tr2 >= hi || bars[tl2-1] >= bars[tr2+1])) { tl2--; th2 = Math.min(th2, bars[tl2]); }
                    else { tr2++; th2 = Math.min(th2, bars[tr2]); }
                    if (th2 * (tr2 - tl2 + 1) > crossMax2) { crossMax2 = th2 * (tr2 - tl2 + 1); bestCl2 = tl2; bestCr2 = tr2; }
                }
                var totalBest = solve(lo, hi);

                // Step: Show left result
                (function(lo2, m, lRes, nid) {
                    steps.push({
                        description: '왼쪽 [' + lo2 + '..' + m + ']에서 찾은 최대 넓이: ' + lRes.area + ' — 3가지 후보 중 첫 번째입니다.',
                        action: function() {
                            renderBars(null, {l: lRes.l, r: lRes.r}, {lo: lo2, hi: m, color: 'var(--accent)40'});
                            treeNodes[nid].status = 'current';
                            renderTree(nid);
                            infoEl.innerHTML = '\uc67c\ucabd \ucd5c\ub300: bars[' + lRes.l + '..' + lRes.r + '], \ub113\uc774 = <strong>' + lRes.area + '</strong>';
                        },
                        undo: function() {
                            renderBars(null, null, null);
                            renderTree(-1);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(lo, mid, leftRes, curNodeIdx);

                // Step: Show right result
                (function(m, hi2, rRes, nid) {
                    steps.push({
                        description: '오른쪽 [' + (m+1) + '..' + hi2 + ']에서 찾은 최대 넓이: ' + rRes.area + ' — 두 번째 후보입니다.',
                        action: function() {
                            renderBars(null, {l: rRes.l, r: rRes.r}, {lo: m+1, hi: hi2, color: '#6c5ce740'});
                            renderTree(nid);
                            infoEl.innerHTML = '\uc624\ub978\ucabd \ucd5c\ub300: bars[' + rRes.l + '..' + rRes.r + '], \ub113\uc774 = <strong>' + rRes.area + '</strong>';
                        },
                        undo: function() {
                            renderBars(null, null, null);
                            renderTree(-1);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(mid, hi, rightRes, curNodeIdx);

                // Step: Cross expansion
                (function(lo2, hi2, m, cMax, bcl, bcr, nid) {
                    steps.push({
                        description: '가운데 걸침(세 번째 후보): mid=' + m + '에서 양쪽으로 높이가 큰 쪽부터 확장하여 최대 넓이 = ' + cMax + ' (범위 [' + bcl + '..' + bcr + '])',
                        action: function() {
                            var h = {};
                            for (var i = bcl; i <= bcr; i++) h[i] = 'var(--red)';
                            renderBars(h, null, null);
                            treeNodes[nid].status = 'cross';
                            renderTree(nid);
                            infoEl.innerHTML = '\uac00\uc6b4\ub370 \uac78\uce68: bars[' + bcl + '..' + bcr + '], \ub113\uc774 = <strong>' + cMax + '</strong>';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'current';
                            renderBars(null, null, null);
                            renderTree(-1);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(lo, hi, mid, crossMax2, bestCl2, bestCr2, curNodeIdx);

                // Step: Resolve this node with the max
                (function(lo2, hi2, lRes, rRes, cMax, best, nid) {
                    steps.push({
                        description: '[' + lo2 + '..' + hi2 + '] 결정! 3후보(왼 ' + lRes.area + ', 오 ' + rRes.area + ', 걸침 ' + cMax + ') 중 최대 = <strong>' + best.area + '</strong>',
                        action: function() {
                            renderBars(null, {l: best.l, r: best.r}, {lo: lo2, hi: hi2, color: 'var(--green)20'});
                            treeNodes[nid].status = 'resolved';
                            treeNodes[nid].result = '\u2192 \ub113\uc774 ' + best.area;
                            renderTree(nid);
                            infoEl.innerHTML = '[' + lo2 + '..' + hi2 + ']: max(\uc67c ' + lRes.area + ', \uc624 ' + rRes.area + ', \uac00\uc6b4\ub370 ' + cMax + ') = <strong>' + best.area + '</strong>';
                        },
                        undo: function() {
                            treeNodes[nid].status = 'cross';
                            treeNodes[nid].result = '';
                            renderBars(null, null, null);
                            renderTree(-1);
                            infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)';
                        }
                    });
                })(lo, hi, leftRes, rightRes, crossMax2, totalBest, curNodeIdx);
            }

            buildSteps(0, n - 1, 0);

            // Final step
            var finalBest = solve(0, n - 1);
            steps.push({
                description: '\uc644\uc131! \ucd5c\ub300 \uc9c1\uc0ac\uac01\ud615 \ub113\uc774 = ' + finalBest.area,
                action: function() {
                    renderBars(null, {l: finalBest.l, r: finalBest.r}, null);
                    for (var i = 0; i < treeNodes.length; i++) treeNodes[i].status = 'resolved';
                    renderTree(-1);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 \ucd5c\ub300 \uc9c1\uc0ac\uac01\ud615 \ub113\uc774 = ' + finalBest.area + ' (bars[' + finalBest.l + '..' + finalBest.r + '])</strong>';
                },
                undo: function() { renderBars(null, null, null); renderTree(-1); infoEl.innerHTML = '(\ub418\ub3cc\ub9ac\uae30)'; }
            });

            renderTree(-1);
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseBars(DEF_BARS));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseBars(inputEl.value));
        });
    },

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '영역 나누기', desc: '2D 영역을 재귀로 분할 (Silver)', problemIds: ['boj-2630', 'boj-1992', 'boj-1780'] },
        { num: 2, title: '거듭제곱 + 행렬', desc: '분할정복 거듭제곱, 행렬 곱셈 (Silver~Gold)', problemIds: ['boj-1629', 'boj-2740', 'boj-10830', 'boj-11444'] },
        { num: 3, title: '심화', desc: '페르마 소정리, 구간 분할정복 (Gold~Platinum)', problemIds: ['boj-11401', 'boj-6549'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'boj-2630', title: 'BOJ 2630 - 색종이 만들기', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2630',
            simIntro: '4×4 색종이를 재귀적으로 4등분하며 같은 색인지 확인하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>여러개의 정사각형칸들로 이루어진 정사각형 모양의 종이가 주어져 있고, 각 정사각형칸은 하얀색 또는 파란색으로 칠해져 있다. 주어진 종이를 일정한 규칙에 따라 잘라서 다양한 크기의 하얀색 또는 파란색 색종이를 만들려고 한다. 전체 종이가 모두 같은 색이면 그대로 사용하고, 아니면 4등분하여 재귀적으로 반복한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>8\n1 1 0 0 0 0 1 1\n1 1 0 0 0 0 1 1\n0 0 0 0 1 1 0 0\n0 0 0 0 1 1 0 0\n1 0 0 0 1 1 1 1\n0 1 0 0 1 1 1 1\n0 0 1 1 1 1 1 1\n0 0 1 1 1 1 1 1</pre></div>
        <div><strong>출력</strong><pre>9\n7</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에는 전체 종이의 한 변의 길이 N이 주어져 있다. N은 2, 4, 8, 16, 32, 64, 128 중 하나이다. 색종이의 각 가로줄의 정사각형칸들의 색이 윗줄부터 차례로 둘째 줄부터 (N+1)번째 줄까지에 주어진다. 하얀색으로 칠해진 칸은 0, 파란색으로 칠해진 칸은 1로 주어지며, 각 줄마다 N개의 수가 빈 칸을 사이에 두고 주어진다.</p>
    <h4>출력</h4>
    <p>첫째 줄에는 잘라진 하얀색 색종이의 개수를 출력하고, 둘째 줄에는 파란색 색종이의 개수를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>N은 2, 4, 8, 16, 32, 64, 128 중 하나</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '종이를 보고 "흰색 몇 개, 파란색 몇 개"를 세야 하니까, 일단 <strong>모든 칸을 하나하나 확인</strong>하면 되지 않을까?<br><br>근데 잠깐 — 문제를 다시 읽어보면, 단순히 칸 수를 세는 게 아니라 <strong>"같은 색으로 이루어진 색종이 조각의 수"</strong>를 세는 거야.<br><br><div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:10px 0;"><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--red);font-weight:600;margin-bottom:4px;">칸 수 세기 X</div><div style="display:grid;grid-template-columns:repeat(2,22px);gap:2px;"><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">0</div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div></div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--green);font-weight:600;margin-bottom:4px;">영역 단위 O</div><div style="display:grid;grid-template-columns:repeat(2,22px);gap:2px;"><div style="width:22px;height:22px;background:var(--accent)40;border:2px solid var(--accent);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">0</div><div style="width:22px;height:22px;background:var(--green)40;border:2px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div><div style="width:22px;height:22px;background:var(--green)40;border:2px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div><div style="width:22px;height:22px;background:var(--green)40;border:2px solid var(--green);border-radius:2px;font-size:0.6rem;text-align:center;line-height:22px;">1</div></div><div style="font-size:0.65rem;color:var(--text2);margin-top:2px;">흰1 + 파1 = 총2조각</div></div></div>즉, 영역 전체가 같은 색이어야 하나의 색종이로 인정된다는 뜻이야.' },
                { title: '근데 이러면 문제가 있어', content: '그럼 "이 영역이 전부 같은 색인지" 어떻게 판단할까?<br><br>전체 종이가 같은 색이면 끝이지만, 아니면? 문제 규칙을 보면 <strong>4등분</strong>해서 각 부분을 다시 확인하라고 해. 이게 바로 <strong>분할정복</strong>이야!<br><br><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:12px 0;"><div style="display:grid;grid-template-columns:repeat(4,22px);gap:2px;"><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--accent)30;border:1px solid var(--accent);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div><div style="width:22px;height:22px;background:var(--green)30;border:1px solid var(--green);border-radius:3px;"></div></div><span style="font-size:1.3rem;color:var(--red);">→</span><div style="display:grid;grid-template-columns:repeat(2,48px);gap:6px;"><div style="width:48px;height:48px;border:2px solid var(--accent);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text2);">혼합</div><div style="width:48px;height:48px;border:2px solid var(--green);border-radius:4px;background:var(--green)15;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--green);font-weight:600;">파랑!</div><div style="width:48px;height:48px;border:2px solid var(--accent);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--text2);">혼합</div><div style="width:48px;height:48px;border:2px solid var(--green);border-radius:4px;background:var(--green)15;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--green);font-weight:600;">파랑!</div></div></div><div style="background:var(--bg2);padding:12px;border-radius:8px;margin-top:8px;font-size:0.9rem;">전체 확인 → 안 되면 4등분 → 각 부분 확인 → 안 되면 또 4등분 → ... → 1×1이면 무조건 카운트</div>' },
                { title: '이렇게 하면 어떨까?', content: '<code>solve(r, c, size)</code> 함수를 만들자:<br><br>① (r,c)부터 size×size 영역의 모든 칸이 같은 색인지 확인<br>② 같으면 → 해당 색 카운트 +1, 끝!<br>③ 다르면 → <code>half = size / 2</code>로 4등분해서 각각 재귀 호출<br><br><strong>기저 조건</strong>: 영역이 1×1이면 무조건 그 칸의 색을 카운트해. 더 나눌 수 없으니까!<br><br>시간복잡도는 매 단계마다 모든 칸을 확인하고, 깊이가 log₂N이니까 <strong>O(N² log N)</strong>이야.' }
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
    <h3>문제</h3>
    <p>흑백 영상을 압축하여 표현하는 데이터 구조로 쿼드 트리라는 방법이 있다. 주어진 N×N 크기의 영상이 모두 0으로만 되어 있으면 0, 모두 1로만 되어 있으면 1. 아니면 4등분하여 재귀적으로 압축하고 결과를 괄호로 묶는다. 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래 순서.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>8\n11110000\n11110000\n00011100\n00011100\n11110000\n11110000\n11110011\n11110011</pre></div>
        <div><strong>출력</strong><pre>((110(0101))(0010)(1(0010)0)100)</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에는 영상의 크기를 나타내는 숫자 N이 주어진다. N은 언제나 2의 제곱수로 주어지며, 1 ≤ N ≤ 64의 범위를 가진다. 두 번째 줄부터는 길이 N의 문자열이 N개 주어진다. 각 문자는 0 또는 1이며, 0은 흰색, 1은 검은색을 뜻한다.</p>
    <h4>출력</h4>
    <p>영상을 압축한 결과를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>N은 2의 거듭제곱</li><li>1 ≤ N ≤ 64</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '앞에서 풀었던 색종이 만들기(2630)랑 비슷하지 않아? 영역이 전부 같은 값이면 그 값을 쓰고, 아니면 4등분하는 구조!<br><br>근데 이번에는 카운트가 아니라 <strong>문자열로 표현</strong>해야 해. "압축 결과"를 문자열로 만들어서 반환하는 거지.' },
                { title: '근데 이러면 문제가 있어', content: '카운트는 전역 변수 하나로 됐는데, 문자열은 어떻게 합칠까?<br><br>핵심은 <strong>재귀 함수가 문자열을 반환</strong>하게 만드는 거야:<br>• 모두 같으면 → 그 값("0" 또는 "1") 반환<br>• 다르면 → 4등분한 결과를 <strong>괄호로 감싸서</strong> 반환<br><br><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;"><div style="display:grid;grid-template-columns:repeat(2,28px);gap:2px;border:2px solid var(--accent);border-radius:4px;padding:4px;"><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;font-weight:700;border-radius:3px;background:var(--green)20;color:var(--green);">①</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;font-weight:700;border-radius:3px;background:#e1705520;color:#e17055;">②</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;font-weight:700;border-radius:3px;background:#0984e320;color:#0984e3;">③</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;font-weight:700;border-radius:3px;background:#fdcb6e40;color:#e17055;">④</div></div><span style="color:var(--text2);font-size:0.85rem;">= <code>(①②③④)</code></span></div>순서는 <strong>좌상① → 우상② → 좌하③ → 우하④</strong>야. 이걸 잘못하면 틀리니까 주의!' },
                { title: '이렇게 하면 어떨까?', content: '함수 구조는 이렇게:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>solve(r, c, size)</code>:<br>① 영역 전체 같은 값? → 그 값 반환<br>② 아니면 → <code>"(" + solve(좌상) + solve(우상) + solve(좌하) + solve(우하) + ")"</code></div><br>색종이 문제에서 "카운트 +1"이 "문자열 반환"으로 바뀌고, "재귀 호출"이 "문자열 이어붙이기"로 바뀐 것뿐이야. 구조는 완전히 동일해!' }
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
    <h3>문제</h3>
    <p>N×N크기의 행렬로 표현되는 종이가 있다. 종이의 각 칸에는 -1, 0, 1 중 하나가 저장되어 있다. 종이가 모두 같은 수로 되어 있으면 해당 종이를 사용하고, 아니면 9등분하여 재귀적으로 반복한다. -1로만 채워진 종이 수, 0으로만 채워진 종이 수, 1로만 채워진 종이 수를 출력.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>9\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n0 1 -1 0 1 -1 0 1 -1\n0 -1 1 0 -1 1 0 -1 1\n0 1 -1 1 0 -1 0 1 -1</pre></div>
        <div><strong>출력</strong><pre>10\n12\n11</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 N(1 ≤ N ≤ 3<sup>7</sup>, N은 3<sup>k</sup> 꼴)이 주어진다. 다음 N개의 줄에는 N개의 정수로 행렬이 주어진다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 -1로만 채워진 종이의 개수를, 둘째 줄에 0으로만 채워진 종이의 개수를, 셋째 줄에 1로만 채워진 종이의 개수를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>N은 3<sup>k</sup> 형태 (1 ≤ k ≤ 7, 즉 N ≤ 2,187)</li><li>각 칸은 -1, 0, 1만 포함</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '색종이 만들기(2630)랑 구조가 거의 같아 보여! 영역이 전부 같은 값이면 카운트하고, 아니면 나눠서 재귀 호출하면 되겠지?<br><br>근데 한 가지 다른 점이 있어 — 이번에는 값이 2가지(흰/파)가 아니라 <strong>3가지(-1, 0, 1)</strong>야. 카운터도 3개 필요해.' },
                { title: '근데 이러면 문제가 있어', content: '색종이는 4등분(2×2)이었는데, 이 문제는 N이 3의 거듭제곱이야. 4등분하면 안 맞아!<br><br>N = 3<sup>k</sup> 형태이니까 <strong>9등분(3×3)</strong>으로 나눠야 해. <code>third = size / 3</code>으로 나누고, 3×3 = <strong>9번</strong> 재귀 호출하는 거야.<br><br><div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:10px 0;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text2);margin-bottom:4px;">색종이 (4등분)</div><div style="display:grid;grid-template-columns:repeat(2,28px);gap:2px;"><div style="width:28px;height:28px;border:2px solid var(--accent);border-radius:3px;background:var(--accent)10;"></div><div style="width:28px;height:28px;border:2px solid var(--accent);border-radius:3px;background:var(--accent)10;"></div><div style="width:28px;height:28px;border:2px solid var(--accent);border-radius:3px;background:var(--accent)10;"></div><div style="width:28px;height:28px;border:2px solid var(--accent);border-radius:3px;background:var(--accent)10;"></div></div></div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text2);margin-bottom:4px;">이 문제 (9등분)</div><div style="display:grid;grid-template-columns:repeat(3,22px);gap:2px;"><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div><div style="width:22px;height:22px;border:2px solid #e17055;border-radius:3px;background:#e1705510;"></div></div></div></div><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">4등분(2×2) → <code>half = size/2</code>, 4번 호출<br>9등분(3×3) → <code>third = size/3</code>, 9번 호출</div>' },
                { title: '이렇게 하면 어떨까?', content: '색종이 코드에서 바꿀 부분만 정리하면:<br><br>① <code>half = size // 2</code> → <code>third = size // 3</code><br>② 2중 반복 (0, half) → 2중 반복 <code>range(3)</code><br>③ 카운터: 흰/파 2개 → -1, 0, 1 3개<br><br>N이 최대 2187(= 3<sup>7</sup>)이라 재귀 깊이는 최대 7 — 스택 오버플로우 걱정은 없어!<br><br><span class="lang-py">Python에서는 <code>cnt = {-1: 0, 0: 0, 1: 0}</code> 딕셔너리로 세면 깔끔해.</span><span class="lang-cpp">C++에서는 <code>cnt[first + 1]++</code>로 인덱스 매핑하면 돼 (-1→0, 0→1, 1→2).</span>' }
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

        // ========== 2단계: 거듭제곱 ==========,
        {
            id: 'boj-1629', title: 'BOJ 1629 - 곱셈', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1629',
            simIntro: 'A^B mod C를 지수를 반으로 나누며 계산하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>자연수 A를 B번 곱한 수를 알고 싶다. 단 구하려는 수가 매우 커질 수 있으므로 C로 나눈 나머지를 구하는 프로그램을 작성하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>10 11 12</pre></div>
        <div><strong>출력</strong><pre>4</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 A, B, C가 빈 칸을 사이에 두고 주어진다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 A를 B번 곱한 수를 C로 나눈 나머지를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>A, B, C는 모두 2,147,483,647 이하의 자연수</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: 'A를 B번 곱하면 되니까, 반복문으로 A를 B번 곱하면 되지 않을까?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>result = 1</code><br><code>for i in range(B): result = result * A % C</code></div><br>간단해 보이지?' },
                { title: '근데 이러면 문제가 있어', content: 'B가 최대 <strong>2,147,483,647</strong>(약 21억)이야! 반복문 21억 번이면 시간 초과 확정이야.<br><br>그런데 한 가지 수학적 성질을 떠올려봐:<br><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;"><div style="padding:6px 10px;background:var(--red)15;border:1.5px solid var(--red);border-radius:6px;font-size:0.85rem;font-family:monospace;">A×A×A×A×A×A×A×A <span style="color:var(--red);font-weight:700;">8번</span></div><span style="font-size:1.2rem;color:var(--text2);">vs</span><div style="padding:6px 10px;background:var(--green)15;border:1.5px solid var(--green);border-radius:6px;font-size:0.85rem;font-family:monospace;">((A²)²)² <span style="color:var(--green);font-weight:700;">3번!</span></div></div>지수를 <strong>반으로 나누면</strong> 곱셈 횟수가 확 줄어들어!' },
                { title: '이렇게 하면 어떨까?', content: '<strong>분할정복 거듭제곱</strong>: 지수를 반씩 나누면 O(log B)에 끝나!<br><br>• B가 짝수: A<sup>B</sup> = (A<sup>B/2</sup>)² mod C<br>• B가 홀수: A<sup>B</sup> = (A<sup>B/2</sup>)² × A mod C<br><br>21억이어도 log₂(21억) ≈ <strong>31번</strong>이면 끝이야!<br><br><span class="lang-cpp">C++에서는 중간 곱셈에서 오버플로우가 날 수 있어 — <code>long long</code> 필수!</span><span class="lang-py">Python은 큰 수를 자동 처리하니까 오버플로우 걱정 없어. 내장 <code>pow(A, B, C)</code>도 같은 원리야!</span>' }
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
            id: 'boj-2740', title: 'BOJ 2740 - 행렬 곱셈', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2740',
            simIntro: '2×2 행렬 곱셈을 단계별로 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>N×M 행렬 A와 M×K 행렬 B가 주어졌을 때, 두 행렬을 곱한 결과를 출력하는 프로그램을 작성하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>3 2\n1 2\n3 4\n5 6\n2 3\n-1 -2 0\n0 0 3</pre></div>
        <div><strong>출력</strong><pre>-1 -2 6\n-3 -6 12\n-5 -10 18</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 행렬 A의 크기 N과 M이 주어진다. 둘째 줄부터 N개의 줄에 행렬 A의 원소 M개가 순서대로 주어진다. 그 다음 줄에 행렬 B의 크기 M과 K가 주어진다. 이어서 M개의 줄에 행렬 B의 원소 K개가 순서대로 주어진다.</p>
    <h4>출력</h4>
    <p>첫째 줄부터 N개의 줄에 행렬 A와 B를 곱한 행렬을 출력한다. 행렬의 각 원소는 공백으로 구분한다.</p>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N, M, K ≤ 100</li><li>행렬 원소의 절댓값 ≤ 100</li><li>결과 행렬 원소의 절댓값 ≤ 2<sup>31</sup></li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '행렬 곱셈의 규칙을 떠올려보자. C[i][j]를 구하려면 <strong>A의 i행</strong>과 <strong>B의 j열</strong>을 쭉 곱해서 더하면 돼.<br><br><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;"><div style="display:grid;grid-template-columns:repeat(2,28px);gap:2px;border:2px solid var(--accent);border-radius:4px;padding:4px;"><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;background:var(--yellow)30;border-radius:3px;font-weight:700;">a</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;background:var(--yellow)30;border-radius:3px;font-weight:700;">b</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">c</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">d</div></div><span style="font-size:1rem;">×</span><div style="display:grid;grid-template-columns:repeat(2,28px);gap:2px;border:2px solid var(--green);border-radius:4px;padding:4px;"><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;background:var(--green)20;border-radius:3px;font-weight:700;">e</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">f</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;background:var(--green)20;border-radius:3px;font-weight:700;">g</div><div style="width:28px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">h</div></div><span style="font-size:1rem;">=</span><div style="display:grid;grid-template-columns:repeat(2,48px);gap:2px;border:2px solid var(--text2);border-radius:4px;padding:4px;"><div style="width:48px;height:28px;text-align:center;line-height:28px;font-size:0.65rem;background:var(--yellow)15;border-radius:3px;font-weight:600;">ae+bg</div><div style="width:48px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">...</div><div style="width:48px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">...</div><div style="width:48px;height:28px;text-align:center;line-height:28px;font-size:0.7rem;border-radius:3px;">...</div></div></div>이건 <strong>내적(dot product)</strong>이야! A의 <span style="color:var(--yellow);font-weight:600;">i행</span>과 B의 <span style="color:var(--green);font-weight:600;">j열</span>을 곱해서 합산.' },
                { title: '근데 이러면 문제가 있어', content: '결과 행렬 C의 크기가 N×K이고, 각 원소를 구하려면 M번 곱해야 하니까 <strong>3중 반복문</strong>이 필요해:<br><br>• 바깥: i = 0~N-1 (C의 행)<br>• 중간: j = 0~K-1 (C의 열)<br>• 안쪽: k = 0~M-1 (내적 합산)<br><br>N, M, K ≤ 100이니까 최대 100만 번 — 이 문제에서는 충분해!<br><br>⚠️ 주의: A가 N×<strong>M</strong>이고 B가 <strong>M</strong>×K여야 곱셈이 가능해. A의 열 수 = B의 행 수!' },
                { title: '이렇게 하면 어떨까?', content: '이 문제 자체는 분할정복이 아니라 기본 행렬 곱셈이야. 하지만 이게 <strong>행렬 거듭제곱의 기초</strong>가 돼!<br><br>숫자 곱셈을 함수로 만들 듯이, 행렬 곱셈도 <code>mat_mul(A, B)</code> 함수로 만들어두면 나중에 행렬 거듭제곱(10830번)에서 그대로 재사용할 수 있어.<br><br><span class="lang-py">Python에서는 리스트 컴프리헨션으로 깔끔하게 초기화: <code>C = [[0]*K for _ in range(N)]</code></span><span class="lang-cpp">C++에서는 <code>int C[100][100] = {};</code>로 0 초기화하면 돼.</span>' }
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
    <h3>문제</h3>
    <p>크기가 N×N인 행렬 A가 주어진다. 이때, A의 B제곱을 구하는 프로그램을 작성하시오. 수가 매우 커질 수 있으니, A^B의 각 원소를 1,000으로 나눈 나머지를 출력한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>2 5\n1 2\n3 4</pre></div>
        <div><strong>출력</strong><pre>69 558\n337 406</pre></div>
    </div></div>
    <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
        <div><strong>입력</strong><pre>3 3\n1 2 3\n4 5 6\n7 8 9</pre></div>
        <div><strong>출력</strong><pre>468 576 684\n62 305 548\n656 34 412</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 행렬의 크기 N과 B가 주어진다. (2 ≤ N ≤ 5, 1 ≤ B ≤ 100,000,000,000) 둘째 줄부터 N개의 줄에 행렬의 각 원소가 주어진다. 행렬의 각 원소는 1,000보다 작거나 같은 자연수 또는 0이다.</p>
    <h4>출력</h4>
    <p>첫째 줄부터 N개의 줄에 걸쳐 행렬 A를 B번 곱한 결과 행렬의 각 원소를 1,000으로 나눈 나머지를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>2 ≤ N ≤ 5</li><li>1 ≤ B ≤ 100,000,000,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: 'A를 B번 곱하면 되니까, 반복문으로 행렬을 B번 곱하면?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">result = 단위행렬<br>for i in range(B): result = mat_mul(result, A)</div><br>2740번에서 만든 행렬 곱셈 함수를 재사용하면 될 것 같아!' },
                { title: '근데 이러면 문제가 있어', content: 'B가 최대 <strong>1000억</strong>(10<sup>11</sup>)이야! 행렬 곱셈을 1000억 번 반복하면 당연히 시간 초과야.<br><br>그런데... 이거 어디서 본 패턴 아니야?<br><br><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;font-family:monospace;font-size:0.9rem;"><div style="padding:6px 10px;background:var(--accent)15;border:1.5px solid var(--accent);border-radius:6px;">숫자: a<sup>B</sup></div><span style="color:var(--text2);">→</span><div style="padding:6px 10px;background:var(--accent)15;border:1.5px solid var(--accent);border-radius:6px;">(a<sup>B/2</sup>)²</div><span style="font-size:1.2rem;color:var(--text2);">||</span><div style="padding:6px 10px;background:var(--green)15;border:1.5px solid var(--green);border-radius:6px;">행렬: A<sup>B</sup></div><span style="color:var(--text2);">→</span><div style="padding:6px 10px;background:var(--green)15;border:1.5px solid var(--green);border-radius:6px;">(A<sup>B/2</sup>)²</div></div>1629번(곱셈)에서 <strong>숫자</strong>를 B번 곱하는 걸 분할정복으로 O(log B)에 풀었잖아! <strong>숫자 대신 행렬을 곱하면</strong> 똑같은 원리로 풀 수 있어!' },
                { title: '이렇게 하면 어떨까?', content: '1629번 코드에서 바꿀 부분:<br><br>• <code>half * half</code> → <code>mat_mul(half, half)</code><br>• <code>result * a</code> → <code>mat_mul(result, A)</code><br>• 기저: B=1이면 A 자체를 반환 (각 원소 mod 처리!)<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">숫자 거듭제곱: 곱하기 연산자 *<br>행렬 거듭제곱: 행렬 곱셈 함수 mat_mul<br>구조는 <strong>완전히 동일</strong>!</div><br>행렬 곱셈할 때 매번 <strong>mod 1000</strong>을 해줘야 오버플로우를 방지할 수 있어.' }
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
    <h3>문제</h3>
    <p>피보나치 수는 0과 1로 시작한다. 0번째 피보나치 수는 0이고 1번째는 1이다. n번째 피보나치 수를 구하는 프로그램을 작성하시오. 행렬 거듭제곱을 이용. 1,000,000,007로 나눈 나머지를 출력.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>1000</pre></div>
        <div><strong>출력</strong><pre>517691607</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 n이 주어진다. n은 1,000,000,000,000,000,000보다 작거나 같은 자연수 또는 0이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 n번째 피보나치 수를 1,000,000,007로 나눈 나머지를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>0 ≤ n ≤ 10<sup>18</sup></li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '피보나치 수를 구하는 건 간단하지! 반복문으로 F(0), F(1), F(2), ... 순서대로 구하면 돼:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">a, b = 0, 1<br>for i in range(n): a, b = b, a + b</div><br>O(n)이면 충분하지 않을까?' },
                { title: '근데 이러면 문제가 있어', content: 'n이 최대 <strong>10<sup>18</sup></strong>(100경)이야! 반복문 10<sup>18</sup>번은 절대 불가능해.<br><br>O(log n)으로 풀어야 하는데, 피보나치에 분할정복을 어떻게 적용하지?<br><br>여기서 핵심 아이디어가 등장해 — <strong>피보나치 점화식을 행렬로 표현</strong>할 수 있어:<br><br><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0;"><div style="display:grid;grid-template-columns:repeat(2,45px);gap:2px;border:2px solid var(--accent);border-radius:6px;padding:4px;"><div style="width:45px;height:28px;text-align:center;line-height:28px;font-size:0.75rem;font-weight:700;background:var(--accent)15;border-radius:3px;">F(n+1)</div><div style="width:45px;height:28px;text-align:center;line-height:28px;font-size:0.75rem;font-weight:700;background:var(--green)15;border-radius:3px;color:var(--green);">F(n)</div><div style="width:45px;height:28px;text-align:center;line-height:28px;font-size:0.75rem;font-weight:700;background:var(--green)15;border-radius:3px;color:var(--green);">F(n)</div><div style="width:45px;height:28px;text-align:center;line-height:28px;font-size:0.75rem;background:var(--accent)15;border-radius:3px;">F(n-1)</div></div><span style="font-size:1rem;font-weight:700;">=</span><div style="display:grid;grid-template-columns:repeat(2,22px);gap:2px;border:2px solid #0984e3;border-radius:6px;padding:4px;"><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:0.8rem;font-weight:700;background:#0984e315;border-radius:3px;">1</div><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:0.8rem;font-weight:700;background:#0984e315;border-radius:3px;">1</div><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:0.8rem;font-weight:700;background:#0984e315;border-radius:3px;">1</div><div style="width:22px;height:22px;text-align:center;line-height:22px;font-size:0.8rem;font-weight:700;background:#0984e315;border-radius:3px;">0</div></div><sup style="font-size:0.9rem;font-weight:700;color:#0984e3;">n</sup></div>행렬 거듭제곱은 O(log n)에 할 수 있으니까!' },
                { title: '이렇게 하면 어떨까?', content: '10830번(행렬 제곱) 코드를 <strong>2×2 행렬</strong>에 맞게 재사용하면 끝!<br><br>① 기본 행렬: <code>base = [[1,1],[1,0]]</code><br>② <code>mat_pow(base, n)</code>으로 O(log n)에 거듭제곱<br>③ 결과 행렬의 <strong>[0][1]</strong>이 F(n)!<br><br>2×2 고정 크기라 행렬 곱셈을 직접 전개하면 반복문보다 빨라.<br><br>⚠️ 예외 처리: n=0이면 0, n=1이면 1을 바로 출력해야 해. 행렬 거듭제곱은 n &gt; 1일 때만 사용!' }
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

        // ========== 4단계: 심화 ==========,
        {
            id: 'boj-11401', title: 'BOJ 11401 - 이항 계수 3', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11401',
            simIntro: '페르마 소정리를 이용해 이항 계수를 모듈러 역원으로 계산하는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>자연수 N과 정수 K가 주어졌을 때, 이항 계수 C(N, K)를 1,000,000,007로 나눈 나머지를 구하는 프로그램을 작성하시오. 페르마의 소정리를 이용하여 모듈러 역원을 구한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>5 2</pre></div>
        <div><strong>출력</strong><pre>10</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>첫째 줄에 N과 K가 주어진다. (1 ≤ N ≤ 4,000,000, 0 ≤ K ≤ N)</p>
    <h4>출력</h4>
    <p>C(N, K)를 1,000,000,007로 나눈 나머지를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 4,000,000</li><li>0 ≤ K ≤ N</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '이항 계수 C(N, K) = N! / (K! × (N-K)!) 이니까, 팩토리얼을 구해서 나누면 되지 않을까?<br><br><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;font-family:monospace;font-size:0.9rem;"><span style="font-weight:700;color:var(--accent);">C(5,2)</span><span>=</span><div style="text-align:center;"><div style="border-bottom:2px solid var(--text2);padding:2px 8px;font-weight:600;">5!</div><div style="padding:2px 8px;">2! × 3!</div></div><span>=</span><div style="text-align:center;"><div style="border-bottom:2px solid var(--text2);padding:2px 8px;color:var(--green);font-weight:600;">120</div><div style="padding:2px 8px;">2 × 6</div></div><span>=</span><span style="font-weight:700;color:var(--green);font-size:1.1rem;">10</span></div>N!까지 미리 계산해두면 분자(N!)와 분모(K! × (N-K)!)를 바로 구할 수 있어.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>400만</strong>이야. 400만 팩토리얼은 천문학적인 숫자라 직접 나눌 수 없어.<br><br>그래서 1,000,000,007로 나눈 나머지를 구하라는 건데... <strong>모듈러 연산에서는 나눗셈을 직접 할 수 없어!</strong><br><br><div style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;"><div style="padding:8px 12px;background:var(--green)15;border:1.5px solid var(--green);border-radius:8px;font-size:0.85rem;text-align:center;"><div style="color:var(--green);font-weight:600;margin-bottom:4px;">덧셈/곱셈 OK</div><code>(a+b)%p = (a%p+b%p)%p</code></div><div style="padding:8px 12px;background:var(--red)15;border:1.5px solid var(--red);border-radius:8px;font-size:0.85rem;text-align:center;"><div style="color:var(--red);font-weight:600;margin-bottom:4px;">나눗셈 NO!</div><code>(a/b)%p ≠ (a%p)/(b%p)</code></div></div>나눗셈을 어떻게 처리하지?' },
                { title: '이렇게 하면 어떨까?', content: '<strong>페르마 소정리</strong>가 여기서 등장해!<br><br>p가 소수일 때: <strong>a<sup>-1</sup> ≡ a<sup>(p-2)</sup> mod p</strong><br><br>즉, 나눗셈을 <strong>거듭제곱(곱셈)</strong>으로 바꿀 수 있어!<br><br>C(N,K) mod p = N! × (K!)<sup>(p-2)</sup> × ((N-K)!)<sup>(p-2)</sup> mod p<br><br>구현 3단계:<br>① 팩토리얼 배열 미리 계산 (0! ~ N!)<br>② 앞에서 배운 <strong>분할정복 거듭제곱</strong>으로 역원 계산<br>③ 세 값을 곱하면 끝!<br><br>1629번(곱셈)의 거듭제곱 코드를 여기서 그대로 재사용할 수 있어.' }
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

        // ========== 3단계: 행렬 ==========,
        {
            id: 'boj-6549', title: 'BOJ 6549 - 히스토그램에서 가장 큰 직사각형', difficulty: 'platinum',
            link: 'https://www.acmicpc.net/problem/6549',
            simIntro: '히스토그램을 분할정복으로 나누어 최대 직사각형을 찾는 과정을 관찰하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>히스토그램은 직사각형 여러 개가 아래쪽으로 정렬되어 있는 도형이다. 각 직사각형은 같은 너비를 가지고 있지만, 높이는 모두 다를 수 있다. 히스토그램에서 가장 넓이가 큰 직사각형을 구하는 프로그램을 작성하시오. 입력은 여러 테스트 케이스로 이루어져 있다. 각 테스트 케이스의 첫 번째 수는 n(1 ≤ n ≤ 100,000)이고, 그 뒤에 n개의 높이가 주어진다. 0이 입력되면 종료.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>7 2 1 4 5 1 3 3\n4 1000 1000 1000 1000\n0</pre></div>
        <div><strong>출력</strong><pre>8\n4000</pre></div>
    </div></div>
    <h4>입력</h4>
    <p>입력은 여러 테스트 케이스로 이루어져 있다. 각 테스트 케이스는 한 줄로 이루어져 있고, 첫 번째 수는 직사각형의 수 n(1 ≤ n ≤ 100,000)이다. 그 다음 n개의 정수 h<sub>1</sub>, ..., h<sub>n</sub> (0 ≤ h<sub>i</sub> ≤ 1,000,000,000)이 주어진다. 이 숫자들은 직사각형의 높이이며, 왼쪽부터 오른쪽 순서이다. 모든 직사각형의 너비는 1이다. 입력의 마지막 줄에는 0이 하나 주어진다.</p>
    <h4>출력</h4>
    <p>각 테스트 케이스에 대해서, 히스토그램에서 가장 넓이가 큰 직사각형의 넓이를 출력한다.</p>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ n ≤ 100,000</li><li>0 ≤ 높이 ≤ 1,000,000,000</li><li>0이 입력되면 종료</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '모든 막대를 시작점으로 해서, 양쪽으로 확장하며 최대 넓이를 구하면 되지 않을까?<br><br>각 막대 i에 대해 높이가 h[i] 이상인 연속 구간을 찾으면 넓이 = h[i] × 구간 길이.<br><br>모든 막대에 대해 해보면 최대값을 찾을 수 있어!' },
                { title: '근데 이러면 문제가 있어', content: '각 막대마다 양쪽을 탐색하면 최악의 경우 O(n²)이야. n이 최대 <strong>100,000</strong>이니까 시간 초과!<br><br>여기서 분할정복 아이디어를 떠올려보자. 배열을 반으로 나누면 최대 직사각형은 <strong>세 가지 경우</strong> 중 하나야:<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0;"><div style="flex:1;min-width:80px;padding:8px;border:2px solid var(--accent);border-radius:8px;text-align:center;background:var(--accent)08;"><div style="display:flex;gap:2px;justify-content:center;margin-bottom:6px;"><div style="width:14px;height:20px;background:var(--accent)40;border-radius:2px;"></div><div style="width:14px;height:30px;background:var(--accent)40;border-radius:2px;"></div></div><div style="font-size:0.7rem;font-weight:600;color:var(--accent);">① 왼쪽</div></div><div style="flex:1;min-width:80px;padding:8px;border:2px solid var(--green);border-radius:8px;text-align:center;background:var(--green)08;"><div style="display:flex;gap:2px;justify-content:center;margin-bottom:6px;"><div style="width:14px;height:25px;background:var(--green)40;border-radius:2px;"></div><div style="width:14px;height:35px;background:var(--green)40;border-radius:2px;"></div></div><div style="font-size:0.7rem;font-weight:600;color:var(--green);">② 오른쪽</div></div><div style="flex:1;min-width:100px;padding:8px;border:2px solid var(--yellow);border-radius:8px;text-align:center;background:var(--yellow)08;"><div style="display:flex;gap:2px;justify-content:center;margin-bottom:6px;"><div style="width:14px;height:20px;background:var(--accent)30;border-radius:2px;"></div><div style="width:14px;height:30px;background:var(--yellow)60;border-radius:2px;"></div><div style="width:14px;height:25px;background:var(--yellow)60;border-radius:2px;"></div><div style="width:14px;height:35px;background:var(--green)30;border-radius:2px;"></div></div><div style="font-size:0.7rem;font-weight:600;color:var(--yellow);">③ 걸치는 경우</div></div></div>①②는 재귀로 풀 수 있는데, ③은 어떻게 구하지?' },
                { title: '이렇게 하면 어떨까?', content: '③ 가운데 걸치는 경우: 중앙 두 막대에서 시작해서 <strong>높이가 더 높은 쪽으로 한 칸씩 확장</strong>해!<br><br>확장할 때마다 최소 높이를 갱신하고, 넓이 = 최소 높이 × 너비를 계산해서 최대값을 추적해.<br><br>왜 높은 쪽으로? 넓이를 최대화하려면 높이를 최대한 유지하면서 넓혀야 하니까!<br><br>시간복잡도: T(n) = 2T(n/2) + O(n) → <strong>O(n log n)</strong><br><br><span class="lang-cpp">⚠️ C++에서는 높이 × 너비가 int 범위를 넘을 수 있어 — <code>long long</code> 필수!</span><span class="lang-py">Python은 큰 수를 자동 처리하니까 따로 신경 쓸 필요 없어.</span>' }
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

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.divideconquer = divideConquerTopic;
