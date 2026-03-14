// ===== 누적합 토픽 모듈 =====
var prefixSumTopic = {
    id: 'prefixsum',
    title: '누적합',
    icon: '📊',
    category: '알고리즘 기법',
    order: 14,
    description: '구간의 합을 한 번에 구하는 기법',
    relatedNote: '누적합은 IMOS법(차분 배열), 2차원 확장, 나머지 연산과의 조합 등으로 다양하게 응용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-11659': { type: '1D 누적합', color: 'var(--accent)', vizMethod: '_renderVizRange', suffix: '-range' },
        'boj-2559':  { type: '구간 합', color: 'var(--green)', vizMethod: '_renderVizWindow', suffix: '-win' },
        'boj-16139': { type: '문자별 누적', color: '#e17055', vizMethod: '_renderVizCharSum', suffix: '-char' },
        'boj-10986': { type: '나머지 합', color: '#6c5ce7', vizMethod: '_renderVizModSum', suffix: '-mod' },
        'boj-11660': { type: '2D 누적합', color: '#00b894', vizMethod: '_renderViz2DSum', suffix: '-2d' },
        'boj-25682': { type: '2D 응용', color: '#d63031', vizMethod: '_renderVizChess', suffix: '-chess' }
    },

    getProblemTabs: function(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent: function(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '누적합이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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

    _renderProblemTab: function(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab: function(contentEl, prob) {
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

    _renderCodeTab: function(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept: function(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>📊 누적합 (Prefix Sum)</h2>\
                <p class="hero-sub">미리 합을 쌓아두면, 어떤 구간의 합이든 한 번에 구할 수 있습니다</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> 누적합이란?</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 여러분이 매일 용돈을 저금통에 넣는다고 생각해 보세요.<br>\
                    월요일에 3원, 화요일에 1원, 수요일에 4원, 목요일에 1원, 금요일에 5원.<br><br>\
                    저금통에는 매일 <strong>지금까지 모은 총 금액</strong>이 적혀 있습니다:<br>\
                    <code>0원 → 3원 → 4원 → 8원 → 9원 → 14원</code><br><br>\
                    이제 "화요일부터 목요일까지 모은 돈"을 알고 싶다면?<br>\
                    <strong>목요일까지 총액(9원) - 월요일까지 총액(3원) = 6원</strong><br>\
                    이것이 바로 <strong>누적합</strong>입니다!\
                </div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.wikipedia.org/wiki/Prefix_sum" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Prefix Sum ↗</a>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 원래 배열\n\
arr    = [3, 1, 4, 1, 5]\n\
\n\
# 누적합 배열 (맨 앞에 0을 추가)\n\
prefix = [0, 3, 4, 8, 9, 14]\n\
#         ↑  ↑  ↑  ↑  ↑   ↑\n\
#         0  3 3+1 4+4 8+1 9+5\n\
\n\
# 2번째~4번째 합 = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 원래 배열\n\
vector&lt;int&gt; arr = {3, 1, 4, 1, 5};\n\
\n\
// 누적합 배열 (맨 앞에 0을 추가)\n\
vector&lt;int&gt; prefix = {0, 3, 4, 8, 9, 14};\n\
//                     ↑  ↑  ↑  ↑  ↑   ↑\n\
//                     0  3 3+1 4+4 8+1 9+5\n\
\n\
// 2번째~4번째 합 = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">배열 [3, 1, 4, 1, 5]에서 3번째부터 5번째까지의 합은 얼마입니까?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>10</strong>입니다!<br>\
                        누적합 배열: [0, 3, 4, 8, 9, 14]<br>\
                        prefix[5] - prefix[2] = 14 - 4 = <strong>10</strong><br>\
                        실제로 4 + 1 + 5 = 10 맞습니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> 누적합 만드는 방법</div>\
                <div class="concept-grid">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="5" y="50" width="12" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>\
                                <rect x="22" y="40" width="12" height="30" rx="2" fill="var(--accent)" opacity="0.55"/>\
                                <rect x="39" y="25" width="12" height="45" rx="2" fill="var(--accent)" opacity="0.7"/>\
                                <rect x="56" y="10" width="12" height="60" rx="2" fill="var(--accent)" opacity="0.9"/>\
                            </svg>\
                        </div>\
                        <h3>하나씩 쌓아 올리기</h3>\
                        <p><code>prefix[i] = prefix[i-1] + arr[i]</code><br>이전까지의 합에 현재 값을 더하면 됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="40" r="25" fill="none" stroke="var(--green)" stroke-width="3"/>\
                                <text x="40" y="46" text-anchor="middle" fill="var(--green)" font-size="24" font-weight="bold">O(N)</text>\
                            </svg>\
                        </div>\
                        <h3>딱 한 번이면 충분</h3>\
                        <p>누적합 배열을 만드는 데 배열을 <strong>한 번만</strong> 쭉 훑으면 됩니다.</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 누적합 배열 만들기\n\
N = len(arr)\n\
prefix = [0] * (N + 1)       # 길이를 N+1로 (0번 칸은 0)\n\
\n\
for i in range(1, N + 1):\n\
    prefix[i] = prefix[i - 1] + arr[i - 1]\n\
\n\
# 결과: prefix = [0, 3, 4, 8, 9, 14]</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 누적합 배열 만들기\n\
int N = arr.size();\n\
vector&lt;int&gt; prefix(N + 1, 0); // 길이를 N+1로 (0번 칸은 0)\n\
\n\
for (int i = 1; i &lt;= N; i++) {\n\
    prefix[i] = prefix[i - 1] + arr[i - 1];\n\
}\n\
\n\
// 결과: prefix = {0, 3, 4, 8, 9, 14}</code></pre></div></span>\
\
                <div style="margin:0.8rem 0 0.5rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/itertools.html#itertools.accumulate" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: itertools.accumulate() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/partial_sum" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: partial_sum ↗</a></span>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;">\
                        <span class="lang-py"><code>itertools.accumulate(arr)</code> \u2014 누적합을 자동으로 만들어주는 표준 라이브러리 함수입니다.</span>\
                        <span class="lang-cpp"><code>std::partial_sum()</code> \u2014 &lt;numeric&gt; 헤더에 있는 누적합 생성 함수입니다.</span>\
                    </p>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">누적합 배열의 맨 앞에 왜 0을 넣을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>첫 번째 원소부터의 구간 합</strong>을 구할 때 편하기 때문입니다!<br>\
                        예를 들어 1번째~3번째 합 = prefix[3] - prefix[0] = 8 - 0 = 8<br>\
                        0이 없으면 1번째부터 시작하는 구간에서 예외 처리가 필요합니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> 구간 합을 한 번에!</div>\
                <div class="approach-grid">\
                    <div class="approach-card">\
                        <h4>😰 반복문으로 구하기</h4>\
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기\n\
total = 0\n\
for i in range(L, R + 1):\n\
    total += arr[i]\n\
# 시간: O(N) — 질문마다 처음부터 더해야 합니다</code></pre></div></span>\
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// L번째 ~ R번째 합 구하기\n\
int total = 0;\n\
for (int i = L; i &lt;= R; i++) {\n\
    total += arr[i];\n\
}\n\
// 시간: O(N) — 질문마다 처음부터 더해야 합니다</code></pre></div></span>\
                        <p class="approach-note">질문이 M개면 총 <strong>O(N × M)</strong> → 느립니다!</p>\
                    </div>\
                    <div class="approach-card featured">\
                        <h4>😎 누적합으로 구하기</h4>\
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기\n\
total = prefix[R] - prefix[L - 1]\n\
# 시간: O(1) — 뺄셈 한 번이면 끝!</code></pre></div></span>\
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// L번째 ~ R번째 합 구하기\n\
int total = prefix[R] - prefix[L - 1];\n\
// 시간: O(1) — 뺄셈 한 번이면 끝!</code></pre></div></span>\
                        <p class="approach-note">질문이 M개여도 총 <strong>O(N + M)</strong> → 빠릅니다!</p>\
                    </div>\
                </div>\
\
                <div class="key-difference-box">\
                    <strong>핵심 공식:</strong>\
                    <code>arr[L] + arr[L+1] + ... + arr[R] = prefix[R] - prefix[L-1]</code><br>\
                    <span style="color:var(--text2)">R까지의 합에서 L-1까지의 합을 빼면, L부터 R까지의 합만 남습니다!</span>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">배열 크기가 100,000이고 질문이 100,000개라면, 반복문은 몇 번 계산하고 누적합은 몇 번 계산할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        반복문: 최대 <strong>100,000 × 100,000 = 100억 번</strong> (시간 초과!)<br>\
                        누적합: <strong>100,000 + 100,000 = 200,000번</strong> (한순간!)<br><br>\
                        이 차이가 바로 누적합을 쓰는 이유입니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 2차원 누적합</div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 격자 모양 지도에서 각 칸에 보물이 있다고 생각해 보세요.<br>\
                    "이 직사각형 영역 안에 보물이 총 몇 개인가?" 하는 질문에 빠르게 답하려면,<br>\
                    <strong>왼쪽 위 모서리(1,1)부터 각 칸까지의 보물 합계</strong>를 미리 구해두면 됩니다!\
                </div>\
\
                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">2차원 누적합 공식 (포함-배제 원리)</p>\
                <div class="ps-2d-formula">\
                    <div class="ps-2d-step">\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area full">전체</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-top">위쪽</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-left">왼쪽</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c1-1]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">+</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area add-corner">겹침</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c1-1]</span>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 2차원 누적합 만들기\n\
for i in range(1, N + 1):\n\
    for j in range(1, M + 1):\n\
        prefix[i][j] = (arr[i][j]\n\
                       + prefix[i-1][j]\n\
                       + prefix[i][j-1]\n\
                       - prefix[i-1][j-1])\n\
\n\
# (r1, c1) ~ (r2, c2) 영역의 합\n\
def query(r1, c1, r2, c2):\n\
    return (prefix[r2][c2]\n\
          - prefix[r1-1][c2]\n\
          - prefix[r2][c1-1]\n\
          + prefix[r1-1][c1-1])</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 2차원 누적합 만들기\n\
for (int i = 1; i &lt;= N; i++) {\n\
    for (int j = 1; j &lt;= M; j++) {\n\
        prefix[i][j] = arr[i][j]\n\
                     + prefix[i-1][j]\n\
                     + prefix[i][j-1]\n\
                     - prefix[i-1][j-1];\n\
    }\n\
}\n\
\n\
// (r1, c1) ~ (r2, c2) 영역의 합\n\
int query(int r1, int c1, int r2, int c2) {\n\
    return prefix[r2][c2]\n\
         - prefix[r1-1][c2]\n\
         - prefix[r2][c1-1]\n\
         + prefix[r1-1][c1-1];\n\
}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">2차원에서 왜 빼고 나서 다시 더하는 부분이 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        위쪽과 왼쪽을 빼면 <strong>왼쪽 위 모서리 부분이 두 번 빠지기</strong> 때문입니다!<br>\
                        한 번 빼진 것을 다시 더해서 정확한 값을 구하는 것입니다.<br>\
                        이것을 <strong>포함-배제 원리</strong>라고 합니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 누적합 문제 푸는 3단계</div>\
                <p style="color:var(--text2); margin-bottom:1rem;">누적합 문제를 만나면 이 3단계를 따라가세요.</p>\
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">\
                    <div class="concept-card">\
                        <h3>① 누적합 배열 만들기</h3>\
                        <p>원래 배열을 쭉 훑으면서 합을 쌓아 올립니다. 2차원이면 행/열 방향으로 쌓습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>② 공식 적용하기</h3>\
                        <p>1차원: <code>prefix[R] - prefix[L-1]</code><br>2차원: 포함-배제 공식을 적용합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>③ 예외 확인하기</h3>\
                        <p>인덱스가 0 이하가 되지 않는지, 나머지 연산 등 특수 조건을 확인합니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"구간 합을 여러 번 물어보는 문제"를 보면 가장 먼저 어떤 방법을 떠올려야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>누적합</strong>입니다!<br>\
                        "구간 합"이라는 키워드가 보이면 거의 반사적으로 누적합을 떠올리면 됩니다.<br>\
                        특히 "여러 번 물어본다"는 말이 있으면 반복문으로는 느리고, 누적합이 필수입니다.\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-ps';
        container.innerHTML =
            '<h2>누적합 시각화</h2>' +
            '<div class="viz-type-selector">' +
            '<button class="viz-type-btn active" data-viz="ps1d">1차원 누적합</button>' +
            '<button class="viz-type-btn" data-viz="ps2d">2차원 누적합</button>' +
            '</div>' +
            '<div id="viz-content-' + suffix + '"></div>';
        var vizContent = container.querySelector('#viz-content-' + suffix);
        var buttons = container.querySelectorAll('.viz-type-btn');
        var switchViz = function(type) {
            self._clearVizState();
            buttons.forEach(function(b) { b.classList.toggle('active', b.dataset.viz === type); });
            vizContent.innerHTML = '';
            if (type === 'ps1d') self._renderConceptViz1D(vizContent, suffix);
            else self._renderConceptViz2D(vizContent, suffix);
        };
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() { switchViz(btn.dataset.viz); });
        });
        switchViz('ps1d');
    },

    _renderConceptViz1D: function(container, suffix) {
        var self = this;
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        var prefix = [0];
        var i;
        for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
        container.innerHTML =
            '<div class="viz-card"><h3>1차원 누적합</h3>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-arr-' + suffix + '"></div>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-pref-' + suffix + '"></div>' +
            '<div id="cv1d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var arrEl = container.querySelector('#cv1d-arr-' + suffix);
        var prefEl = container.querySelector('#cv1d-pref-' + suffix);
        var infoEl = container.querySelector('#cv1d-info-' + suffix);
        arrEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">arr:</span>' + arr.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">' + v + '</div>'; }).join('');
        prefEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">prefix:</span>' + prefix.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">?</div>'; }).join('');
        var steps = [];
        var prefCells = function() { return prefEl.querySelectorAll('.ps-cell'); };
        steps.push({ description: 'prefix[0] = 0 (시작값)', action: function() { prefCells()[0].textContent = '0'; prefCells()[0].style.background = 'var(--accent)15'; infoEl.innerHTML = 'prefix[0] = 0'; }, undo: function() { prefCells()[0].textContent = '?'; prefCells()[0].style.background = 'var(--bg2)'; infoEl.innerHTML = ''; } });
        for (i = 0; i < arr.length; i++) {
            (function(idx) {
                steps.push({ description: 'prefix[' + (idx+1) + '] = prefix[' + idx + '] + arr[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = ' + prefix[idx+1],
                    action: function() { prefCells()[idx+1].textContent = prefix[idx+1]; prefCells()[idx+1].style.background = 'var(--green)20'; infoEl.innerHTML = 'prefix[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = <strong>' + prefix[idx+1] + '</strong>'; },
                    undo: function() { prefCells()[idx+1].textContent = '?'; prefCells()[idx+1].style.background = 'var(--bg2)'; infoEl.innerHTML = idx > 0 ? 'prefix[' + idx + '] = ' + prefix[idx] : 'prefix[0] = 0'; }
                });
            })(i);
        }
        steps.push({ description: '누적합 완성! 구간 합 예시: arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]) + '</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[' + arr.length + '] = ' + prefix[arr.length]; }
        });
        self._initStepController(container, steps, suffix);
    },

    _renderConceptViz2D: function(container, suffix) {
        var self = this;
        container.innerHTML =
            '<div class="viz-card"><h3>2차원 누적합</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">2차원 누적합과 포함-배제 원리로 영역 합을 구합니다.</p>' +
            '<div id="cv2d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var infoEl = container.querySelector('#cv2d-info-' + suffix);
        var grid = [[1,2,3],[4,5,6],[7,8,9]];
        var prefix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        var r, c;
        for (r = 1; r <= 3; r++) for (c = 1; c <= 3; c++) prefix[r][c] = grid[r-1][c-1] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1];
        var steps = [];
        steps.push({ description: '3x3 격자의 2차원 누적합을 구합니다.', action: function() { infoEl.innerHTML = '격자: [[1,2,3],[4,5,6],[7,8,9]]'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: '0번 행/열 = 0으로 초기화', action: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; }, undo: function() { infoEl.innerHTML = '격자: [[1,2,3],[4,5,6],[7,8,9]]'; } });
        steps.push({ description: 'prefix[1][1] = 1+0+0-0 = 1', action: function() { infoEl.innerHTML = 'prefix[1][1] = grid[1][1] + prefix[0][1] + prefix[1][0] - prefix[0][0] = <strong>1</strong>'; }, undo: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; } });
        steps.push({ description: '영역 (1,1)~(2,2) 합 = prefix[2][2] - prefix[0][2] - prefix[2][0] + prefix[0][0] = ' + prefix[2][2] + ' - 0 - 0 + 0 = ' + prefix[2][2],
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) 합 = ' + prefix[2][2] + ' (= 1+2+4+5 = 12)</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[1][1] = <strong>1</strong>'; }
        });
        steps.push({ description: '영역 (2,2)~(3,3) 합 = prefix[3][3] - prefix[1][3] - prefix[3][1] + prefix[1][1] = ' + prefix[3][3] + ' - ' + prefix[1][3] + ' - ' + prefix[3][1] + ' + ' + prefix[1][1] + ' = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(2,2)~(3,3) 합 = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]) + ' (= 5+6+8+9 = 28)</strong>'; },
            undo: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) 합 = ' + prefix[2][2] + '</strong>'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc: function(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController: function(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var s = suffix || '';
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        var indicator = container.querySelector('#viz-step-counter' + s);
        var desc = container.querySelector('#viz-step-desc' + s);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
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
    // 시뮬레이션 1: 1D 구간 합 (boj-11659)
    // ====================================================================
    _renderVizRange: function(container) {
        var self = this, suffix = '-range';
        var DEFAULT_ARR = [5, 4, 3, 2, 1];
        var DEFAULT_QUERIES = [[1,3],[2,4],[5,5]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">1D 구간 합 (BOJ 11659)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="ps-range-arr" value="5, 4, 3, 2, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">쿼리 (i j): <input type="text" id="ps-range-queries" value="1 3, 2 4, 5 5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="ps-range-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="rng-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-pref' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#rng-arr' + suffix);
        var prefEl = container.querySelector('#rng-pref' + suffix);
        var infoEl = container.querySelector('#rng-info' + suffix);

        function renderCells(el, label, vals) { el.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">' + label + '</span>' + vals.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join(''); }

        function buildSteps(arr, queries) {
            var prefix = [0]; var i;
            for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
            renderCells(arrEl, 'arr:', arr);
            renderCells(prefEl, 'prefix:', prefix);
            infoEl.innerHTML = '<span style="color:var(--text2)">누적합으로 구간 합을 O(1)에 구합니다.</span>';
            var steps = [];
            steps.push({ description: '누적합 배열: prefix = [' + prefix.join(', ') + ']', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = '<span style="color:var(--text2)">누적합으로 구간 합을 O(1)에 구합니다.</span>'; } });
            queries.forEach(function(q) {
                var L = q[0], R = q[1];
                if (L < 1 || R > arr.length || L > R) return;
                var ans = prefix[R] - prefix[L-1];
                steps.push({ description: 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = ' + ans,
                    action: function() { infoEl.innerHTML = 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = <strong>' + ans + '</strong>'; },
                    undo: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }
                });
            });
            var results = queries.map(function(q) { return (q[0] >= 1 && q[1] <= arr.length && q[0] <= q[1]) ? (prefix[q[1]] - prefix[q[0]-1]) : '?'; });
            steps.push({ description: '모든 쿼리를 O(1)로 처리 완료!', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; infoEl.innerHTML = 'arr[' + q[0] + ']~arr[' + q[1] + '] = ' + (prefix[q[1]] - prefix[q[0]-1]); } else { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-range-arr').value;
            var qInput = container.querySelector('#ps-range-queries').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/); return [parseInt(parts[0], 10), parseInt(parts[1], 10)]; }).filter(function(q) { return !isNaN(q[0]) && !isNaN(q[1]); });
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(arr, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-range-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 구간 합 최대 (boj-2559)
    // ====================================================================
    _renderVizWindow: function(container) {
        var self = this, suffix = '-win';
        var DEFAULT_ARR = [3, -2, -4, -9, 0, 3, 7, 13, 8, -3];
        var DEFAULT_K = 2;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">연속 K일 최대 합 (BOJ 2559)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="ps-window-arr" value="3, -2, -4, -9, 0, 3, 7, 13, 8, -3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<label style="font-weight:600;">K: <input type="number" id="ps-window-k" value="2" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-window-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="win-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="win-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#win-arr' + suffix);
        var infoEl = container.querySelector('#win-info' + suffix);

        function buildSteps(arr, K) {
            var prefix = [0]; var i;
            for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
            arrEl.innerHTML = arr.map(function(v) { return '<div style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + v + '</div>'; }).join('');
            infoEl.innerHTML = '';
            var steps = [];
            var maxVal = -Infinity, maxPos = -1;
            steps.push({ description: '누적합 배열을 만들고 길이 ' + K + '인 모든 구간의 합을 구합니다.', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            for (i = 1; i <= arr.length - K + 1; i++) {
                (function(idx) {
                    var sum = prefix[idx + K - 1] - prefix[idx - 1];
                    if (sum > maxVal) { maxVal = sum; maxPos = idx; }
                    var curMax = maxVal, curPos = maxPos;
                    steps.push({ description: 'i=' + idx + ': prefix[' + (idx+K-1) + '] - prefix[' + (idx-1) + '] = ' + prefix[idx+K-1] + ' - ' + prefix[idx-1] + ' = ' + sum,
                        action: function() { infoEl.innerHTML = 'arr[' + idx + ']~arr[' + (idx+K-1) + '] 합 = <strong>' + sum + '</strong>' + (sum === curMax && idx === curPos ? ' ← 현재 최대!' : ''); },
                        undo: function() { infoEl.innerHTML = idx > 1 ? 'arr[' + (idx-1) + ']~arr[' + (idx+K-2) + '] 합 = ' + (prefix[idx+K-2] - prefix[idx-2]) : 'prefix = [' + prefix.join(', ') + ']'; }
                    });
                })(i);
            }
            var fMaxVal = maxVal, fMaxPos = maxPos;
            steps.push({ description: '최대값 = ' + fMaxVal + ' (위치: arr[' + fMaxPos + ']~arr[' + (fMaxPos+K-1) + '])', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 최대 합 = ' + fMaxVal + '</strong>'; }, undo: function() { var last = arr.length - K + 1; infoEl.innerHTML = 'arr[' + last + ']~arr[' + (last+K-1) + '] 합 = ' + (prefix[last+K-1] - prefix[last-1]); } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-window-arr').value;
            var kInput = container.querySelector('#ps-window-k').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var K = parseInt(kInput, 10);
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (K > arr.length) K = arr.length;
            var steps = buildSteps(arr, K);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-window-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_K);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 문자별 누적합 (boj-16139)
    // ====================================================================
    _renderVizCharSum: function(container) {
        var self = this, suffix = '-char';
        var DEFAULT_S = 'seungjaehwang';
        var DEFAULT_QUERIES = [['a',0,12],['s',0,12],['a',3,7],['a',0,5]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문자별 누적합 (BOJ 16139)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">문자열: <input type="text" id="ps-char-str" value="seungjaehwang" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">쿼리 (문자 l r): <input type="text" id="ps-char-queries" value="a 0 12, s 0 12, a 3 7, a 0 5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="ps-char-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="ch-str' + suffix + '" style="display:flex;gap:2px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="ch-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var strEl = container.querySelector('#ch-str' + suffix);
        var infoEl = container.querySelector('#ch-info' + suffix);

        function buildSteps(S, queries) {
            strEl.innerHTML = S.split('').map(function(c) { return '<div style="width:28px;text-align:center;padding:4px 2px;border-radius:4px;background:var(--bg2);font-family:monospace;font-weight:600;">' + c + '</div>'; }).join('');
            infoEl.innerHTML = '';
            // 26개 알파벳 누적합
            var count = [];
            var c;
            for (c = 0; c < 26; c++) { count[c] = [0]; for (var j = 0; j < S.length; j++) { count[c].push(count[c][j] + (S.charCodeAt(j) - 97 === c ? 1 : 0)); } }
            var steps = [];
            steps.push({ description: '26개 알파벳 각각에 대해 누적합 배열을 만듭니다.', action: function() { infoEl.innerHTML = '각 알파벳별로 누적합 배열을 구축합니다.'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: '예: "a"의 누적합 = [' + count[0].join(',') + ']', action: function() { infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; }, undo: function() { infoEl.innerHTML = '각 알파벳별로 누적합 배열을 구축합니다.'; } });
            queries.forEach(function(q, qi) {
                var ch = q[0], l = q[1], r = q[2];
                var ci = ch.charCodeAt(0) - 97;
                if (ci < 0 || ci >= 26 || l < 0 || r >= S.length || l > r) return;
                var ans = count[ci][r+1] - count[ci][l];
                steps.push({ description: '"' + ch + '" in [' + l + ',' + r + '] = count["' + ch + '"][' + (r+1) + '] - count["' + ch + '"][' + l + '] = ' + count[ci][r+1] + ' - ' + count[ci][l] + ' = ' + ans,
                    action: function() { infoEl.innerHTML = '"' + ch + '" in S[' + l + '..' + r + '] = <strong>' + ans + '</strong>'; },
                    undo: function() { if (qi === 0) infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; else { var pq = queries[qi-1]; var pci = pq[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + pq[0] + '" in S[' + pq[1] + '..' + pq[2] + '] = ' + (count[pci][pq[2]+1] - count[pci][pq[1]]); } }
                });
            });
            var results = queries.map(function(q) { var ci = q[0].charCodeAt(0)-97; return (ci >= 0 && ci < 26 && q[1] >= 0 && q[2] < S.length) ? (count[ci][q[2]+1] - count[ci][q[1]]) : '?'; });
            steps.push({ description: '결과: ' + results.join(', '), action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; var ci = q[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + q[0] + '" in S[' + q[1] + '..' + q[2] + '] = ' + (count[ci][q[2]+1] - count[ci][q[1]]); } else { infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var strInput = container.querySelector('#ps-char-str').value.trim().toLowerCase();
            var qInput = container.querySelector('#ps-char-queries').value;
            var S = strInput || DEFAULT_S;
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/); if (parts.length >= 3) return [parts[0], parseInt(parts[1], 10), parseInt(parts[2], 10)]; return null; }).filter(function(q) { return q && !isNaN(q[1]) && !isNaN(q[2]); });
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(S, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-char-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_S, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 나머지 합 (boj-10986)
    // ====================================================================
    _renderVizModSum: function(container) {
        var self = this, suffix = '-mod';
        var DEFAULT_ARR = [1, 2, 3, 1, 2];
        var DEFAULT_M = 3;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">나머지 합 (BOJ 10986)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">배열: <input type="text" id="ps-mod-arr" value="1, 2, 3, 1, 2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="ps-mod-m" value="3" min="2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-mod-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="mod-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="mod-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#mod-arr' + suffix);
        var infoEl = container.querySelector('#mod-info' + suffix);

        function buildSteps(arr, M) {
            arrEl.innerHTML = arr.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join('');
            infoEl.innerHTML = '';
            var prefMod = [0]; var cnt = []; var i, r;
            for (r = 0; r < M; r++) cnt[r] = 0;
            cnt[0] = 1;
            for (i = 0; i < arr.length; i++) { prefMod.push(((prefMod[i] + arr[i]) % M + M) % M); cnt[prefMod[i+1]]++; }
            var steps = [];
            steps.push({ description: 'prefix_mod 배열을 만듭니다 (각 누적합을 M=' + M + '으로 나눈 나머지).', action: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            var cntStr = [];
            for (r = 0; r < M; r++) cntStr.push('cnt[' + r + ']=' + cnt[r]);
            steps.push({ description: '나머지별 개수: ' + cntStr.join(', '), action: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + '] (나머지 0~' + (M-1) + '의 개수)'; }, undo: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; } });
            var combParts = []; var ans = 0;
            for (r = 0; r < M; r++) { var c = cnt[r]*(cnt[r]-1)/2; combParts.push(cnt[r] + 'C2'); ans += c; }
            var combVals = [];
            for (r = 0; r < M; r++) combVals.push(cnt[r]*(cnt[r]-1)/2);
            steps.push({ description: '나머지가 같은 쌍 = nC2: ' + combParts.join(' + '), action: function() { infoEl.innerHTML = combParts.join(' + ') + ' = ' + combVals.join(' + ') + ' = <strong>' + ans + '</strong>'; }, undo: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + ']'; } });
            steps.push({ description: '답: ' + ans, action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 합이 ' + M + '의 배수인 구간 = ' + ans + '개</strong>'; }, undo: function() { infoEl.innerHTML = '답 = ' + ans; } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-mod-arr').value;
            var mInput = container.querySelector('#ps-mod-m').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var M = parseInt(mInput, 10);
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (isNaN(M) || M < 2) M = DEFAULT_M;
            var steps = buildSteps(arr, M);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-mod-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_M);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 2D 누적합 (boj-11660)
    // ====================================================================
    _renderViz2DSum: function(container) {
        var self = this, suffix = '-2d';
        var DEFAULT_GRID = [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]];
        var DEFAULT_QUERIES = [[2,2,3,4],[3,4,3,4],[1,1,4,4]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">2D 구간 합 (BOJ 11660)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자 (행을 ;로 구분): <input type="text" id="ps-2d-grid" value="1 2 3 4; 2 3 4 5; 3 4 5 6; 4 5 6 7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<label style="font-weight:600;">쿼리 (x1 y1 x2 y2): <input type="text" id="ps-2d-queries" value="2 2 3 4, 3 4 3 4, 1 1 4 4" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="ps-2d-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="d2-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var infoEl = container.querySelector('#d2-info' + suffix);

        function buildSteps(grid, queries) {
            var N = grid.length;
            var M2 = grid[0] ? grid[0].length : 0;
            var prefix = []; var i, j;
            for (i = 0; i <= N; i++) { prefix[i] = []; for (j = 0; j <= M2; j++) prefix[i][j] = 0; }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) prefix[i][j] = grid[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            infoEl.innerHTML = '';
            var gridStr = grid.map(function(row) { return '[' + row.join(',') + ']'; }).join(',');
            var steps = [];
            steps.push({ description: N + 'x' + M2 + ' 격자에서 2차원 누적합을 구축합니다.', action: function() { infoEl.innerHTML = '격자: [' + gridStr + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: '2차원 누적합 배열 완성', action: function() { infoEl.innerHTML = '포함-배제 공식으로 각 칸의 누적합을 구했습니다.'; }, undo: function() { infoEl.innerHTML = '격자: [' + gridStr + ']'; } });
            queries.forEach(function(q, qi) {
                var x1 = q[0], y1 = q[1], x2 = q[2], y2 = q[3];
                if (x1 < 1 || y1 < 1 || x2 > N || y2 > M2 || x1 > x2 || y1 > y2) return;
                var ans = prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1];
                steps.push({ description: '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + '): prefix[' + x2 + '][' + y2 + '] - prefix[' + (x1-1) + '][' + y2 + '] - prefix[' + x2 + '][' + (y1-1) + '] + prefix[' + (x1-1) + '][' + (y1-1) + '] = ' + ans,
                    action: function() { infoEl.innerHTML = '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + ') = ' + prefix[x2][y2] + ' - ' + prefix[x1-1][y2] + ' - ' + prefix[x2][y1-1] + ' + ' + prefix[x1-1][y1-1] + ' = <strong>' + ans + '</strong>'; },
                    undo: function() { if (qi === 0) infoEl.innerHTML = '포함-배제 공식으로 각 칸의 누적합을 구했습니다.'; else { var pq = queries[qi-1]; var pa = prefix[pq[2]][pq[3]] - prefix[pq[0]-1][pq[3]] - prefix[pq[2]][pq[1]-1] + prefix[pq[0]-1][pq[1]-1]; infoEl.innerHTML = '(' + pq[0] + ',' + pq[1] + ')~(' + pq[2] + ',' + pq[3] + ') = ' + pa; } }
                });
            });
            var results = queries.map(function(q) { return (q[0] >= 1 && q[1] >= 1 && q[2] <= N && q[3] <= M2 && q[0] <= q[2] && q[1] <= q[3]) ? (prefix[q[2]][q[3]] - prefix[q[0]-1][q[3]] - prefix[q[2]][q[1]-1] + prefix[q[0]-1][q[1]-1]) : '?'; });
            steps.push({ description: '결과: ' + results.join(', '), action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 결과: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; var a = prefix[q[2]][q[3]] - prefix[q[0]-1][q[3]] - prefix[q[2]][q[1]-1] + prefix[q[0]-1][q[1]-1]; infoEl.innerHTML = '(' + q[0] + ',' + q[1] + ')~(' + q[2] + ',' + q[3] + ') = ' + a; } else { infoEl.innerHTML = '포함-배제 공식으로 각 칸의 누적합을 구했습니다.'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var gridInput = container.querySelector('#ps-2d-grid').value;
            var qInput = container.querySelector('#ps-2d-queries').value;
            var grid = gridInput.split(';').map(function(row) { return row.trim().split(/\s+/).map(function(s) { return parseInt(s, 10); }).filter(function(n) { return !isNaN(n); }); }).filter(function(row) { return row.length > 0; });
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/).map(function(p) { return parseInt(p, 10); }); return parts.length >= 4 ? [parts[0], parts[1], parts[2], parts[3]] : null; }).filter(function(q) { return q && !isNaN(q[0]) && !isNaN(q[1]) && !isNaN(q[2]) && !isNaN(q[3]); });
            if (grid.length === 0) grid = DEFAULT_GRID;
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(grid, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-2d-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_GRID, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 체스판 (boj-25682)
    // ====================================================================
    _renderVizChess: function(container) {
        var self = this, suffix = '-chess';
        var DEFAULT_N = 4, DEFAULT_K = 3;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">체스판 다시 칠하기 (BOJ 25682)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (격자 크기): <input type="number" id="ps-chess-n" value="4" min="1" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">K (체스판 크기): <input type="number" id="ps-chess-k" value="3" min="1" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-chess-reset">🔄</button>' +
            '<span style="color:var(--text3);font-size:0.8rem;">(전부 B인 NxN 보드)</span>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="cs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var infoEl = container.querySelector('#cs-info' + suffix);

        function buildSteps(N, K) {
            // 전부 B인 NxN 보드 생성
            var board = []; var i, j;
            for (i = 0; i < N; i++) { var row = ''; for (j = 0; j < N; j++) row += 'B'; board.push(row); }
            var M2 = N;
            infoEl.innerHTML = '';
            // diff 배열: (i+j)짝수=B 패턴 기준으로 다른 칸이면 1
            var diff = []; var prefix = [];
            for (i = 0; i <= N; i++) { diff[i] = []; prefix[i] = []; for (j = 0; j <= M2; j++) { diff[i][j] = 0; prefix[i][j] = 0; } }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) { var exp = (i+j) % 2 === 0 ? 'B' : 'W'; diff[i][j] = board[i-1][j-1] !== exp ? 1 : 0; }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) prefix[i][j] = diff[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            var steps = [];
            steps.push({ description: '(i+j) 짝수=B 패턴 기준으로 "다른 칸" 배열(diff)을 만듭니다.', action: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: 'diff 배열의 2차원 누적합을 구합니다.', action: function() { infoEl.innerHTML = '2차원 누적합 배열 완성'; }, undo: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; } });
            // 모든 K×K 영역 스캔
            var bestCost = N * M2;
            var results = [];
            for (i = 1; i <= N - K + 1; i++) {
                for (j = 1; j <= M2 - K + 1; j++) {
                    var cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];
                    var cost2 = K*K - cost1;
                    var best = Math.min(cost1, cost2);
                    results.push({i:i, j:j, cost1:cost1, cost2:cost2, best:best});
                    if (best < bestCost) bestCost = best;
                }
            }
            results.forEach(function(r, ri) {
                steps.push({ description: '영역 (' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): 패턴1=' + r.cost1 + ', 패턴2=' + r.cost2 + ', min=' + r.best,
                    action: function() { infoEl.innerHTML = '(' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): 패턴1=' + r.cost1 + ', 패턴2=' + r.cost2 + ' → <strong>' + r.best + '</strong>'; },
                    undo: function() { if (ri === 0) infoEl.innerHTML = '2차원 누적합 배열 완성'; else { var p = results[ri-1]; infoEl.innerHTML = '(' + p.i + ',' + p.j + ')~(' + (p.i+K-1) + ',' + (p.j+K-1) + '): min=' + p.best; } }
                });
            });
            steps.push({ description: '최소 비용 = ' + bestCost, action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ 최소 다시 칠할 칸 = ' + bestCost + '</strong>'; }, undo: function() { if (results.length > 0) { var last = results[results.length-1]; infoEl.innerHTML = '(' + last.i + ',' + last.j + '): min=' + last.best; } else { infoEl.innerHTML = '2차원 누적합 배열 완성'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var nInput = container.querySelector('#ps-chess-n').value;
            var kInput = container.querySelector('#ps-chess-k').value;
            var N = parseInt(nInput, 10);
            var K = parseInt(kInput, 10);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (N > 8) N = 8;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (K > N) K = N;
            var steps = buildSteps(N, K);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-chess-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_N, DEFAULT_K);
        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '1차원 입문', desc: '기본 누적합 (Silver III)', problemIds: ['boj-11659', 'boj-2559'] },
        { num: 2, title: '응용', desc: '누적합 활용 (Silver I ~ Gold III)', problemIds: ['boj-16139', 'boj-10986'] },
        { num: 3, title: '2차원', desc: '2차원 누적합 (Silver I ~ Gold V)', problemIds: ['boj-11660', 'boj-25682'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 1차원 입문 ==========
        {
            id: 'boj-11659', title: 'BOJ 11659 - 구간 합 구하기 4', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11659',
            simIntro: '누적합 배열을 만들고 구간 합 쿼리를 O(1)로 처리하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수 N개가 주어졌을 때, i번째 수부터 j번째 수까지의 합을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 3\n5 4 3 2 1\n1 3\n2 4\n5 5</pre></div>
                    <div><strong>출력</strong><pre>12\n9\n1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>1 ≤ 수 ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '구간 합을 구하라고 하니까, 매 질문마다 i부터 j까지 반복문을 돌려서 더하면 되지 않을까?<br><br><strong>예: [5, 4, 3, 2, 1]에서 1~3 구간 합</strong><br>→ arr[1] + arr[2] + arr[3] = 5 + 4 + 3 = 12<br>한 번의 질문에 O(N)이면 충분해 보여!' },
                { title: '근데 이러면 문제가 있어', content: '질문이 <strong>최대 100,000번</strong>이고 수도 100,000개야.<br>매번 반복문으로 더하면 최악의 경우 100,000 × 100,000 = <strong>100억 번 연산</strong>... 시간 초과 확정!<br><br>질문 하나에 O(N)이면 전체 O(N×M). 이걸 줄여야 해.' },
                { title: '이렇게 하면 어떨까?', content: '미리 <strong>누적합 배열</strong>을 만들어두면 어떨까?<br><code>prefix[k]</code> = 1번째부터 k번째까지의 합<br><br>그러면 i~j 구간 합 = <code>prefix[j] - prefix[i-1]</code> 한 번의 뺄셈으로 끝!<br>전처리 O(N) + 각 질문 O(1) = 전체 <strong>O(N + M)</strong> 🎯<br><br>💡 팁: <code>prefix[0] = 0</code>으로 두면 i=1일 때도 <code>prefix[1-1] = prefix[0] = 0</code>이라 예외 처리가 필요 없어!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 누적합 배열 만들기\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# 각 질문에 답하기\nfor _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    while (M--) {\n        int i, j;\n        cin >> i >> j;\n        cout << prefix[j] - prefix[i - 1] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '1D 누적합',
                description: '누적합 배열을 만든 뒤 prefix[j] - prefix[i-1]로 O(1) 쿼리 처리합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'sys.stdin.readline으로 빠른 입력 처리.\nN개 수와 M개 쿼리를 받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '누적합 배열 만들기', desc: 'prefix[i] = arr[0]~arr[i-1]의 합.\n이후 구간 합을 O(1)로 구하기 위한 전처리입니다.', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: '쿼리 처리', desc: '구간 합 = prefix[j] - prefix[i-1].\n전처리 덕분에 각 쿼리를 O(1)에 답합니다.', code: 'for _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'ios::sync_with_stdio(false)로 입출력 속도 최적화.\n대량 쿼리 처리에 필수입니다.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: '누적합 배열 만들기', desc: '배열 대신 입력받으면서 바로 누적합 계산.\nlong long으로 오버플로 방지.', code: '    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;  // 입력과 동시에 누적\n    }' },
                        { title: '쿼리 처리', desc: 'prefix[j] - prefix[i-1]로 구간 합을 O(1)에 출력.\n\'\\n\'은 endl보다 빠릅니다.', code: '    while (M--) {\n        int i, j;\n        cin >> i >> j;\n        cout << prefix[j] - prefix[i - 1] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-2559', title: 'BOJ 2559 - 수열', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2559',
            simIntro: '누적합으로 길이 K인 모든 구간의 합을 구하고 최대값을 찾는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>매일의 온도가 정수의 수열로 주어졌을 때, 연속적인 며칠 동안의 온도의 합이 가장 큰 값을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10 2\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div>
                    <div><strong>출력</strong><pre>21</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>10 5\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div>
                    <div><strong>출력</strong><pre>31</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ N ≤ 100,000</li>
                    <li>1 ≤ K ≤ N</li>
                    <li>-100 ≤ 온도 ≤ 100</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '"연속 K일의 온도 합이 최대"니까, 모든 연속 K일 구간을 다 구해보면 되지 않을까?<br><br>i=1일 때: arr[1]+arr[2]+...+arr[K]<br>i=2일 때: arr[2]+arr[3]+...+arr[K+1]<br>...<br>각 구간마다 K개를 더하면 합을 구할 수 있어!' },
                { title: '근데 이러면 문제가 있어', content: '구간이 N-K+1개이고, 각 구간마다 K개를 더하니까 전체 <strong>O(N × K)</strong>.<br>N이 100,000이고 K도 비슷하면... 꽤 느릴 수 있어!<br><br>그리고 매번 K개를 처음부터 다 더하는 건 낭비야 — 이전 구간이랑 겹치는 부분이 K-1개나 되는데 또 더하고 있으니까.' },
                { title: '이렇게 하면 어떨까?', content: '누적합을 미리 만들어두면 길이 K인 구간 합을 <strong>뺄셈 한 번</strong>으로 구할 수 있어!<br><br>i번째부터 K개 합 = <code>prefix[i + K - 1] - prefix[i - 1]</code><br><br>이걸 i = 1부터 N-K+1까지 반복하며 최대값을 갱신하면 끝!<br>전처리 O(N) + 탐색 O(N) = <strong>O(N)</strong> ⚡<br><br>💡 참고: 슬라이딩 윈도우(앞 하나 빼고 뒤 하나 더하기)로도 O(N)에 풀 수 있지만, 누적합을 쓰면 코드가 더 간결해!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 누적합 배열 만들기\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# 길이 K인 모든 구간의 합 중 최대값\nans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    long long ans = -1e18;\n    for (int i = 1; i <= N - K + 1; i++) {\n        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '누적합 + 슬라이딩',
                description: '누적합 배열에서 길이 K 구간의 합을 모두 구해 최대값을 찾습니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N개 온도와 연속 K일을 입력받습니다.\n빠른 입력을 위해 sys.stdin.readline 사용.', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '누적합', desc: '누적합을 만들면 길이 K인 구간 합을\nprefix[i+K-1] - prefix[i-1]로 O(1)에 구할 수 있습니다.', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: '최대 구간 합', desc: '모든 길이 K 구간의 합을 O(1)씩 구해 최대값 갱신.\n음수 온도가 있으므로 초기값을 -inf로 설정합니다.', code: 'ans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N개 온도와 연속 K일을 입력받습니다.\nalgorithm 헤더는 max 함수를 위해 포함합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;' },
                        { title: '누적합', desc: 'long long: 온도 합이 int 범위를 넘을 수 있으므로.\n입력받으면서 바로 누적합을 계산합니다.', code: '    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }' },
                        { title: '최대 구간 합', desc: '-1e18: 음수 온도도 있으므로 충분히 작은 초기값 필요.', code: '    long long ans = -1e18;  // 음수도 있으니 충분히 작게\n    for (int i = 1; i <= N - K + 1; i++) {\n        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[1].templates; }
            }]
        },

        // ========== 2단계: 응용 ==========
        {
            id: 'boj-16139', title: 'BOJ 16139 - 인간-컴퓨터 상호작용', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/16139',
            simIntro: '26개 알파벳 각각에 대한 누적합으로 문자 빈도 쿼리를 처리하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 S와 질의 q개가 주어진다. 각 질의는 알파벳 소문자 a와 두 정수 l, r로 이루어져 있으며, S의 l번째 문자부터 r번째 문자까지(0-indexed) a가 몇 번 나타나는지 구하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>seungjaehwang\n4\na 0 5\na 0 12\ns 0 12\nn 2 7</pre></div>
                    <div><strong>출력</strong><pre>0\n2\n1\n1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ |S| ≤ 200,000</li>
                    <li>1 ≤ q ≤ 200,000</li>
                    <li>0 ≤ l ≤ r < |S|</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '질문마다 l부터 r까지 훑으면서 해당 알파벳이 나올 때마다 카운트하면 되지 않을까?<br><br><strong>예: "seungjaehwang"에서 \'a\', 0~12</strong><br>→ s(X) e(X) u(X) n(X) g(X) j(X) <strong>a(O)</strong> e(X) h(X) w(X) <strong>a(O)</strong> n(X) g(X) → 2개<br>한 번의 질문에 구간 길이만큼 확인하면 돼!' },
                { title: '근데 이러면 문제가 있어', content: '문자열 길이 최대 200,000, 질문도 최대 200,000번이야.<br>매번 구간을 훑으면 200,000 × 200,000 = <strong>400억 번</strong>... 시간 초과!<br><br>앞 문제에서 배운 누적합을 쓰면 될 것 같은데, 여기는 합이 아니라 <strong>"특정 문자의 개수"</strong>잖아. 어떻게 누적합을 적용하지?' },
                { title: '이렇게 하면 어떨까?', content: '숫자의 합 대신 <strong>문자의 등장 횟수</strong>를 누적하면 돼!<br><br>알파벳이 26개니까, <strong>26개의 누적합 배열</strong>을 만들자:<br><code>count[c][i]</code> = 처음부터 i번째까지 알파벳 c가 나온 횟수<br><br>그러면 l~r 구간에서 알파벳 c의 개수 = <code>count[c][r+1] - count[c][l]</code><br>— 뺄셈 한 번이면 O(1)! 전처리 O(26 × N) + 쿼리 O(Q) = 충분히 빨라!<br><br>💡 인덱스가 0부터 시작하니까, 누적합 배열 길이를 N+1로 만들면 편해.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())\n\n# 26개 알파벳별 누적합\ncount = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1\n\nfor _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])',
                cpp: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint count[26][200002];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string S;\n    cin >> S;\n    int N = S.size();\n    int q;\n    cin >> q;\n\n    for (int i = 0; i < N; i++) {\n        for (int c = 0; c < 26; c++)\n            count[c][i + 1] = count[c][i];\n        count[S[i] - \'a\'][i + 1]++;\n    }\n\n    while (q--) {\n        char ch;\n        int l, r;\n        cin >> ch >> l >> r;\n        cout << count[ch - \'a\'][r + 1] - count[ch - \'a\'][l] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '문자별 누적합',
                description: '26개 알파벳 각각에 대한 누적합 배열을 만들어 O(1) 쿼리 처리합니다.',
                timeComplexity: 'O(26N + Q)',
                spaceComplexity: 'O(26N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '문자열 S와 쿼리 수를 입력받습니다.\nstrip()으로 개행 문자를 제거합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())' },
                        { title: '26개 알파벳 누적합', desc: '알파벳별로 누적합을 만들어 구간 내 문자 빈도를\nO(1)에 구할 수 있게 전처리합니다.', code: 'count = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1' },
                        { title: '쿼리 처리', desc: 'count[c][r+1] - count[c][l]로 구간 내 해당 문자 개수를 O(1)에 계산.\nord()로 문자를 0~25 인덱스로 변환합니다.', code: 'for _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'count 배열은 전역 선언 — 스택 크기 제한 회피.', code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\n// 전역: 26개 알파벳 × 최대 길이 (스택 오버플로 방지)\nint count[26][200002];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string S;\n    cin >> S;\n    int N = S.size();\n    int q;\n    cin >> q;' },
                        { title: '26개 알파벳 누적합', desc: 'S[i] - \'a\'로 문자→인덱스 변환.\nord() 대신 char 뺄셈 사용.', code: '    for (int i = 0; i < N; i++) {\n        for (int c = 0; c < 26; c++)\n            count[c][i + 1] = count[c][i];  // 이전 값 복사\n        count[S[i] - \'a\'][i + 1]++;  // 해당 문자만 +1\n    }' },
                        { title: '쿼리 처리', desc: 'ch - \'a\'로 문자를 인덱스로 변환하여\n해당 알파벳의 누적합 배열에서 O(1) 조회.', code: '    while (q--) {\n        char ch;\n        int l, r;\n        cin >> ch >> l >> r;\n        cout << count[ch - \'a\'][r + 1] - count[ch - \'a\'][l] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-10986', title: 'BOJ 10986 - 나머지 합', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10986',
            simIntro: '누적합의 나머지가 같은 쌍을 세는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수 N개 A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>이 주어졌을 때, 연속 부분 합이 M으로 나누어 떨어지는 구간의 개수를 구하는 프로그램을 작성하시오. 즉, A<sub>i</sub> + ... + A<sub>j</sub> (i ≤ j)의 합이 M으로 나누어 떨어지는 (i, j) 쌍의 개수를 구하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 3\n1 2 3 1 2</pre></div>
                    <div><strong>출력</strong><pre>7</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 10<sup>6</sup></li>
                    <li>2 ≤ M ≤ 10<sup>3</sup></li>
                    <li>0 ≤ A<sub>i</sub> ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '모든 (i, j) 쌍을 시도해서 구간 합을 구한 뒤, M으로 나누어 떨어지는지 확인하면 되지 않을까?<br><br>이중 for문으로 i와 j를 정하고, 누적합으로 구간 합 = <code>prefix[j] - prefix[i]</code>를 구해서 M으로 나눠보자.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>1,000,000</strong>(백만)이야!<br>모든 (i, j) 쌍은 약 N² / 2 = <strong>5000억 개</strong>... 절대 불가능!<br><br>그런데 잠깐, 구간 합이 M의 배수라는 건 <code>prefix[j] - prefix[i]</code>가 M의 배수라는 거잖아?<br>이걸 다르게 표현하면... <code>prefix[j] % M == prefix[i] % M</code>이 되네!' },
                { title: '이렇게 하면 어떨까?', content: '누적합의 <strong>나머지가 같은 것끼리 짝</strong>을 지으면 돼!<br><br>① 각 prefix 값을 M으로 나눈 나머지를 구해<br>② <code>cnt[r]</code> = 나머지가 r인 prefix 값의 개수를 세어<br>③ 나머지가 같은 것 중 2개를 고르면 구간 합이 M의 배수!<br>&nbsp;&nbsp;&nbsp;→ 답 = 각 나머지별 <code>cnt[r] × (cnt[r]-1) / 2</code>를 모두 합산<br><br>⚠️ <code>prefix[0] = 0</code>도 빼먹으면 안 돼! 나머지 0에 포함시켜야 해.<br><span class="lang-cpp">답이 매우 커질 수 있으니 <code>long long</code> 타입 필수!</span><span class="lang-py">Python은 큰 수를 자동 처리하니 걱정 없어!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# 나머지별 개수 세기\ncnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1  # prefix[0] = 0의 나머지는 0\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1\n\n# 나머지가 같은 쌍의 수 = nC2\nans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long cnt[1001] = {0};\n    cnt[0] = 1;\n    long long prefix_mod = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long x;\n        cin >> x;\n        prefix_mod = (prefix_mod + x) % M;\n        cnt[prefix_mod]++;\n    }\n\n    long long ans = 0;\n    for (int r = 0; r < M; r++) {\n        ans += cnt[r] * (cnt[r] - 1) / 2;\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '나머지 분류',
                description: '누적합의 나머지가 같은 쌍의 수를 조합(nC2)으로 구합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N개 수와 나눌 수 M을 입력받습니다.\n구간 합이 M으로 나누어 떨어지는 경우를 셉니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: '나머지별 개수', desc: '누적합의 나머지가 같은 두 위치의 구간 합은 M의 배수.\ncnt[0]=1: prefix[0]=0도 나머지 0에 포함시킵니다.', code: 'cnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1' },
                        { title: '조합 계산', desc: '나머지가 같은 쌍의 수 = nC2 = n*(n-1)//2.\n모든 나머지 값에 대해 합산하면 답입니다.', code: 'ans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N개 수와 나눌 수 M을 입력받습니다.\n빠른 입출력을 위해 sync_with_stdio(false) 설정.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: '나머지별 개수', desc: 'prefix[0]=0의 나머지도 세야 하므로 cnt[0]=1로 시작.\nlong long: 값이 10억까지이므로 누적합 오버플로 방지.', code: '    long long cnt[1001] = {0};\n    cnt[0] = 1;  // prefix[0]=0도 나머지 0에 포함\n    long long prefix_mod = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long x;\n        cin >> x;\n        prefix_mod = (prefix_mod + x) % M;\n        cnt[prefix_mod]++;\n    }' },
                        { title: '조합 계산', desc: 'nC2 = n*(n-1)/2.\n답이 매우 커질 수 있으므로 long long 필수.', code: '    long long ans = 0;\n    for (int r = 0; r < M; r++) {\n        ans += cnt[r] * (cnt[r] - 1) / 2;  // nC2\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[3].templates; }
            }]
        },

        // ========== 3단계: 2차원 ==========
        {
            id: 'boj-11660', title: 'BOJ 11660 - 구간 합 구하기 5', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11660',
            simIntro: '2차원 누적합과 포함-배제 공식으로 영역 합을 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N개의 수가 N×N 크기의 표에 채워져 있다. (x1, y1)부터 (x2, y2)까지 합을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 3\n1 2 3 4\n2 3 4 5\n3 4 5 6\n4 5 6 7\n2 2 3 4\n3 4 3 4\n1 1 4 4</pre></div>
                    <div><strong>출력</strong><pre>27\n6\n64</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,024</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>1 ≤ 수 ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '(x1,y1)부터 (x2,y2)까지의 합을 구하라고 하니까, 이중 for문으로 직사각형 영역을 다 더하면 되지 않을까?<br><br><strong>예: (2,2)~(3,4) 영역</strong><br>for i in range(x1, x2+1):<br>&nbsp;&nbsp;for j in range(y1, y2+1):<br>&nbsp;&nbsp;&nbsp;&nbsp;합 += arr[i][j]<br>한 번의 쿼리에 영역 크기만큼 더하면 돼!' },
                { title: '근데 이러면 문제가 있어', content: 'N이 1,024이니까 영역 크기가 최대 1,024 × 1,024 = 약 <strong>100만</strong>이야.<br>쿼리가 100,000번이면 100만 × 10만 = <strong>1000억 번 연산</strong>... 시간 초과!<br><br>1차원에서는 누적합으로 구간 합을 O(1)에 구했잖아. 2차원에서도 비슷하게 할 수 있을까?' },
                { title: '이렇게 하면 어떨까?', content: '<strong>2차원 누적합</strong>을 만들면 돼! 개념 페이지에서 배운 <strong>포함-배제</strong> 원리를 그대로 적용하자.<br><br><strong>① 누적합 만들기:</strong><br><code>prefix[i][j] = arr[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]</code><br>(위 + 왼쪽 - 겹치는 부분 + 현재값)<br><br><strong>② 쿼리 답하기:</strong><br><code>prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]</code><br>(전체 - 위쪽 - 왼쪽 + 다시 더해진 모서리)<br><br>전처리 O(N²) + 쿼리 O(1) × M = <strong>O(N² + M)</strong>!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\n\n# 2차원 누적합 만들기\nprefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = (row[j - 1]\n                        + prefix[i - 1][j]\n                        + prefix[i][j - 1]\n                        - prefix[i - 1][j - 1])\n\n# 각 질문에 답하기\nfor _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    ans = (prefix[x2][y2]\n          - prefix[x1 - 1][y2]\n          - prefix[x2][y1 - 1]\n          + prefix[x1 - 1][y1 - 1])\n    print(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint prefix[1025][1025];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int x;\n            cin >> x;\n            prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    while (M--) {\n        int x1, y1, x2, y2;\n        cin >> x1 >> y1 >> x2 >> y2;\n        cout << prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '2차원 누적합',
                description: '2차원 누적합 + 포함-배제 공식으로 영역 합을 O(1)에 구합니다.',
                timeComplexity: 'O(N^2 + M)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N×N 표와 M개 쿼리를 입력받습니다.\n2차원 누적합으로 영역 합을 빠르게 구합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: '2차원 누적합', desc: '포함-배제 원리: 위 + 왼쪽 - 대각선 + 현재값.\n이후 어떤 직사각형 영역의 합도 O(1)에 구할 수 있습니다.', code: 'prefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = row[j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]' },
                        { title: '쿼리 처리', desc: '포함-배제 공식으로 (x1,y1)~(x2,y2) 영역 합을 O(1)에 계산.\n전체 - 위 - 왼쪽 + 겹치는 부분으로 구합니다.', code: 'for _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    print(prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1])' }
                    ],
                    cpp: [
                        { title: '입력', desc: '전역 2D 배열: 1025×1025는 지역 변수로 쓰면 스택 오버플로.', code: '#include <iostream>\nusing namespace std;\n\n// 전역: 2D 배열이 크므로 스택 오버플로 방지\nint prefix[1025][1025];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: '2차원 누적합', desc: '포함-배제: 위 + 왼쪽 - 대각선 + 현재값.\n입력받으면서 바로 누적합 계산.', code: '    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int x;\n            cin >> x;\n            // 포함-배제로 누적합 계산\n            prefix[i][j] = x + prefix[i-1][j]\n                             + prefix[i][j-1]\n                             - prefix[i-1][j-1];\n        }\n    }' },
                        { title: '쿼리 처리', desc: '포함-배제 공식으로 직사각형 영역 합을 O(1)에 출력.\n\'\\n\'은 endl보다 출력이 빨라 대량 쿼리에 유리합니다.', code: '    while (M--) {\n        int x1, y1, x2, y2;\n        cin >> x1 >> y1 >> x2 >> y2;\n        cout << prefix[x2][y2] - prefix[x1-1][y2]\n                - prefix[x2][y1-1] + prefix[x1-1][y1-1]\n             << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-25682', title: 'BOJ 25682 - 체스판 다시 칠하기 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/25682',
            simIntro: '2차원 누적합으로 체스판 패턴과 다른 칸의 수를 빠르게 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>M×N 크기의 보드가 있다. 이 보드에서 K×K 크기의 체스판을 잘라낸 뒤, 다시 칠해야 하는 정사각형의 최소 개수를 구하는 프로그램을 작성하시오. 체스판은 검은색과 흰색이 번갈아 칠해져 있어야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 4 3\nBBBB\nBBBB\nBBBB\nBBBB</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>8 8 8\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ K ≤ min(N, M)</li>
                    <li>1 ≤ N, M ≤ 2,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '모든 K×K 영역을 하나씩 잡고, 그 안에서 체스판 패턴과 다른 칸이 몇 개인지 세면 되지 않을까?<br><br>체스판 패턴은 2가지(왼쪽 위가 B / 왼쪽 위가 W)니까, 각 패턴에 대해 다른 칸 수를 구하고 더 작은 쪽을 선택하면 돼.' },
                { title: '근데 이러면 문제가 있어', content: 'K×K 영역의 수 = (N-K+1) × (M-K+1)개, 각 영역마다 K×K칸을 확인...<br>N, M이 최대 2,000이면 전체 <strong>O(N × M × K²)</strong> — 너무 느려!<br><br>그런데 잠깐, "K×K 영역의 합"... 이거 앞 문제(구간 합 구하기 5)에서 한 것 아닌가? 2차원 누적합으로 O(1)에 구할 수 있었잖아!' },
                { title: '이렇게 하면 어떨까?', content: '① 먼저 체스판 패턴과 <strong>다른 칸을 1, 같은 칸을 0</strong>으로 표시한 배열을 만들자.<br>&nbsp;&nbsp;&nbsp;(i+j)가 짝수면 B여야 하고, 홀수면 W여야 하는 패턴 기준!<br><br>② 이 0/1 배열의 <strong>2차원 누적합</strong>을 구해!<br><br>③ 모든 K×K 영역에서 cost1 = 누적합으로 O(1)에 구한 "다른 칸 수"<br>&nbsp;&nbsp;&nbsp;반대 패턴의 비용은 <code>K×K - cost1</code>이니까 누적합을 한 번만 만들면 돼!<br>&nbsp;&nbsp;&nbsp;→ <code>min(cost1, K×K - cost1)</code> 중 최소값이 답!<br><br>전처리 O(N×M) + 탐색 O(N×M) = <strong>O(N×M)</strong>!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]\n\n# (i+j)가 짝수인 칸에 B가 와야 하는 패턴 기준\ndiff = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i + j) % 2 == 0 else \'W\'\n        diff[i + 1][j + 1] = 1 if board[i][j] != expected else 0\n\n# 2차원 누적합\nprefix = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    for j in range(1, M + 1):\n        prefix[i][j] = (diff[i][j]\n                        + prefix[i-1][j]\n                        + prefix[i][j-1]\n                        - prefix[i-1][j-1])\n\nans = float(\'inf\')\nfor i in range(1, N - K + 2):\n    for j in range(1, M - K + 2):\n        cost1 = (prefix[i+K-1][j+K-1]\n                - prefix[i-1][j+K-1]\n                - prefix[i+K-1][j-1]\n                + prefix[i-1][j-1])\n        cost2 = K * K - cost1\n        ans = min(ans, cost1, cost2)\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint prefix[2001][2001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M, K;\n    cin >> N >> M >> K;\n\n    for (int i = 1; i <= N; i++) {\n        string row;\n        cin >> row;\n        for (int j = 1; j <= M; j++) {\n            char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n            int diff = (row[j - 1] != expected) ? 1 : 0;\n            prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    int ans = N * M;\n    for (int i = 1; i <= N - K + 1; i++) {\n        for (int j = 1; j <= M - K + 1; j++) {\n            int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];\n            int cost2 = K * K - cost1;\n            ans = min({ans, cost1, cost2});\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '2차원 누적합 + 체스판 패턴',
                description: '체스판 패턴과 다른 칸을 0/1 배열로 만들고 2차원 누적합으로 최소 비용을 구합니다.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N×M 보드와 체스판 크기 K를 입력받습니다.\nstrip()으로 줄바꿈 문자를 제거합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]' },
                        { title: 'diff + 누적합', desc: '(i+j)%2로 기대 색을 판단하여 다른 칸을 1로 표시.\n2차원 누적합으로 K×K 영역의 비용을 O(1)에 구합니다.', code: 'diff = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i+j)%2==0 else \'W\'\n        diff[i+1][j+1] = 1 if board[i][j] != expected else 0\n\nprefix = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(1,N+1):\n    for j in range(1,M+1):\n        prefix[i][j] = diff[i][j]+prefix[i-1][j]+prefix[i][j-1]-prefix[i-1][j-1]' },
                        { title: 'K×K 영역 최소', desc: 'cost1은 패턴1의 비용, K*K-cost1은 반대 패턴의 비용.\n둘 중 작은 값이 해당 영역의 최소 칠하기 비용입니다.', code: 'ans = float(\'inf\')\nfor i in range(1, N-K+2):\n    for j in range(1, M-K+2):\n        cost1 = prefix[i+K-1][j+K-1]-prefix[i-1][j+K-1]-prefix[i+K-1][j-1]+prefix[i-1][j-1]\n        ans = min(ans, cost1, K*K-cost1)\nprint(ans)' }
                    ],
                    cpp: [
                        { title: '입력', desc: '전역 배열: 2001×2001은 지역 변수로 쓰면 스택 오버플로.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint prefix[2001][2001];  // 전역: 스택 오버플로 방지\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M, K;\n    cin >> N >> M >> K;' },
                        { title: 'diff + 누적합', desc: '(i+j)%2로 기대 색 판단 → diff와 누적합을 한 번에 계산.\nPython과 달리 diff 배열을 따로 만들지 않아도 됨.', code: '    for (int i = 1; i <= N; i++) {\n        string row;\n        cin >> row;\n        for (int j = 1; j <= M; j++) {\n            // (i+j) 짝수면 B가 와야 하는 패턴\n            char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n            int diff = (row[j - 1] != expected) ? 1 : 0;\n            prefix[i][j] = diff + prefix[i-1][j]\n                               + prefix[i][j-1]\n                               - prefix[i-1][j-1];\n        }\n    }' },
                        { title: 'K×K 영역 최소', desc: 'cost1 = 패턴1의 비용, K*K-cost1 = 패턴2의 비용.\nmin({a,b,c})로 세 값 중 최소 한 번에 비교.', code: '    int ans = N * M;  // 충분히 큰 초기값\n    for (int i = 1; i <= N - K + 1; i++) {\n        for (int j = 1; j <= M - K + 1; j++) {\n            int cost1 = prefix[i+K-1][j+K-1]\n                      - prefix[i-1][j+K-1]\n                      - prefix[i+K-1][j-1]\n                      + prefix[i-1][j-1];\n            int cost2 = K * K - cost1;\n            ans = min({ans, cost1, cost2});\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[5].templates; }
            }]
        }
    ]
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.prefixsum = prefixSumTopic;
