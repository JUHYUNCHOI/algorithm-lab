// ===== DP 토픽 모듈 =====
var dpTopic = {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: '🧩',
    category: '알고리즘 기법',
    order: 13,
    description: '중복 계산을 제거하여 효율적으로 문제를 푸는 기법',
    relatedNote: 'DP는 비트마스크 DP, 트리 DP, 구간 DP, 확률 DP 등 다양한 변형이 있으며, 거의 모든 코딩테스트에 출제됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-24416': { type: '피보나치', color: 'var(--accent)', vizMethod: '_renderVizFib1', suffix: '-fib1' },
        'boj-9184':  { type: '메모이제이션', color: 'var(--green)', vizMethod: '_renderVizFun', suffix: '-fun' },
        'boj-1463':  { type: 'BFS/DP', color: '#e17055', vizMethod: '_renderViz1to', suffix: '-1to' },
        'boj-1904':  { type: '점화식', color: '#6c5ce7', vizMethod: '_renderVizTile', suffix: '-tile' },
        'boj-2579':  { type: '조건부 DP', color: '#fdcb6e', vizMethod: '_renderVizStair', suffix: '-stair' },
        'boj-2156':  { type: '조건부 DP', color: '#00b894', vizMethod: '_renderVizWine', suffix: '-wine' },
        'boj-1912':  { type: '카데인 알고리즘', color: '#d63031', vizMethod: '_renderVizMaxSub', suffix: '-maxsub' },
        'boj-10844': { type: '자릿수 DP', color: '#0984e3', vizMethod: '_renderVizEasyStair', suffix: '-estair' },
        'boj-1149':  { type: '선택 DP', color: '#e84393', vizMethod: '_renderVizRGB', suffix: '-rgb' },
        'boj-1932':  { type: '경로 DP', color: '#fab1a0', vizMethod: '_renderVizTriangle', suffix: '-tri' },
        'boj-11053': { type: 'LIS', color: '#74b9ff', vizMethod: '_renderVizLIS', suffix: '-lis' },
        'boj-11054': { type: '양방향 LIS', color: '#a29bfe', vizMethod: '_renderVizBitonic', suffix: '-bito' },
        'boj-2565':  { type: 'LIS 응용', color: '#55efc4', vizMethod: '_renderVizWire', suffix: '-wire' },
        'boj-9251':  { type: 'LCS', color: '#fd79a8', vizMethod: '_renderVizLCS', suffix: '-lcs' },
        'boj-12865': { type: '배낭 문제', color: '#636e72', vizMethod: '_renderVizKnapsack', suffix: '-knap' }
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
            sim:     { intro: prob.simIntro || 'DP가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        container.innerHTML = `
            <div class="hero">
                <h2>Dynamic Programming</h2>
                <p class="hero-sub">큰 문제를 작은 조각으로, 한 번 푼 건 다시 풀지 않는다</p>
            </div>

            <!-- ① DP란 무엇인가? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> DP란 무엇인가?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 여러분은 이미 <strong>1+1+1+1+1 = 5</strong>를 계산했습니다.<br>
                    이제 누가 <strong>1+1+1+1+1+1</strong>을 물어봅니다.<br>
                    처음부터 다시 더할 건가요? 아니면 아까 답(5)에 1만 더할 건가요?<br><br>
                    DP는 바로 이 아이디어입니다. <strong>이미 계산한 결과를 저장해두고 재활용</strong>하는 것!
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">피보나치 수를 재귀로 구할 때, fib(5)를 호출하면 fib(3)은 총 몇 번 호출될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>2번</strong>입니다!<br>
                        fib(5) → fib(4) + fib(3)<br>
                        fib(4) → fib(3) + fib(2)<br>
                        이렇게 fib(3)이 2번 호출됩니다. n이 커지면 중복은 폭발적으로 늘어납니다.<br>
                        이렇게 <code>같은 계산이 반복</code>됩니다. DP는 이 반복을 없애 줍니다.
                    </div>
                </div>
            </div>

            <!-- ② DP의 두 가지 조건 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> DP가 가능한 두 가지 조건</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="30" cy="40" r="20" fill="none" stroke="var(--accent)" stroke-width="2" opacity="0.6"/>
                                <circle cx="50" cy="40" r="20" fill="none" stroke="var(--accent2)" stroke-width="2" opacity="0.6"/>
                            </svg>
                        </div>
                        <h3>같은 계산이 반복됨</h3>
                        <p>같은 작은 문제가 여러 번 반복 등장합니다. 재귀로 풀면 같은 계산을 수없이 반복합니다. DP는 한 번 계산한 결과를 저장해서 다시 씁니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="50" width="15" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="32" y="35" width="15" height="35" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="54" y="15" width="15" height="55" rx="2" fill="var(--accent)" opacity="0.9"/>
                            </svg>
                        </div>
                        <h3>작은 문제로 큰 문제 풀기</h3>
                        <p>큰 문제의 답이 작은 문제의 답으로 만들어집니다. 작은 문제를 잘 풀면, 그것을 모아서 큰 문제도 풀 수 있습니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">다음 중 DP로 풀 수 있는 문제는? 클릭해서 확인해보세요!</span>
                    </div>
                    <div class="quiz-cards">
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"계단을 1칸 또는 2칸씩 올라갈 때, n번째 계단까지 가는 방법의 수"</span><div class="quiz-explain">작은 문제(n-1, n-2번째 계단)의 답이 반복되고, 작은 답으로 큰 답을 만들 수 있습니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">✅ DP 가능!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"배열에서 가장 큰 수 찾기"</span><div class="quiz-explain">하나씩 비교하면 되는 간단한 문제. 같은 계산이 반복되지 않습니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">❌ DP 불필요</span>
                        </div>
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"동전 종류가 주어질 때, 금액 n을 만드는 최소 동전 수"</span><div class="quiz-explain">금액 n을 만드는 문제가 더 작은 금액의 문제로 나뉘며, 같은 금액이 반복 등장합니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">✅ DP 가능!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"주어진 배열을 오름차순으로 정렬하기"</span><div class="quiz-explain">정렬은 비교해서 순서를 바꾸는 방식으로 풀지, DP로 푸는 문제가 아닙니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">❌ DP 불필요</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ③ DP 문제 풀이 4단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> DP 문제 풀이 4단계</div>
                <p style="color:var(--text2); margin-bottom:1rem;">DP 문제를 만나면 이 4단계를 순서대로 따라가세요. 피보나치를 예시로 설명합니다.</p>

                <div class="steps-flow">
                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">1</span><h4>칸의 의미 정하기</h4></div>
                        <p>"dp[i]에 어떤 값을 저장할 것인지" 정합니다. 이것이 가장 중요한 단계입니다.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">피보나치에서 dp[i]는 무엇을 의미할까요?</span>
                            </div>
                            <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                            <div class="think-box-answer"><code>dp[i]</code> = i번째 피보나치 수. 즉, fib(i)의 값을 저장합니다.</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">2</span><h4>계산 규칙 찾기</h4></div>
                        <p>dp[i]를 이전 값(dp[i-1], dp[i-2] 등)으로 어떻게 구할 수 있는지 규칙을 찾습니다.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">피보나치의 계산 규칙은 무엇일까요?</span>
                            </div>
                            <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                            <div class="think-box-answer"><code>dp[i] = dp[i-1] + dp[i-2]</code><br>i번째 피보나치 수 = 직전 두 수의 합</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">3</span><h4>초기값 설정</h4></div>
                        <p>계산 규칙을 시작하기 위한 첫 번째 값(시작값)을 정합니다.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">피보나치의 초기값은? dp[1]과 dp[2]는 각각 얼마일까요?</span>
                            </div>
                            <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                            <div class="think-box-answer"><code>dp[1] = 1, dp[2] = 1</code><br>이 두 값이 있어야 dp[3] = dp[2] + dp[1]부터 계산할 수 있습니다.</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">4</span><h4>계산 순서 결정</h4></div>
                        <p>dp 테이블을 어떤 순서로 채울지 결정합니다. 작은 문제 → 큰 문제 순서로!</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">dp[i]를 구하려면 dp[i-1]과 dp[i-2]가 먼저 필요합니다. 어떤 순서로 채워야 할까요?</span>
                            </div>
                            <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                            <div class="think-box-answer"><strong>i = 3부터 n까지 순서대로!</strong><br>작은 인덱스부터 채워야 큰 인덱스를 계산할 때 필요한 값이 이미 있습니다.</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ④ Top-Down vs Bottom-Up -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 위에서 아래로 vs 아래에서 위로</div>
                <p style="margin-bottom:1rem; color:var(--text2);">Top-Down 방식에서 결과를 저장해두는 기법을 <strong>메모이제이션(Memoization)</strong>이라고 합니다. "한 번 계산한 결과를 메모해 둔다"는 뜻입니다. <span class="lang-py">Python에서는 <code>functools.lru_cache</code> 데코레이터로 메모이제이션을 자동화할 수도 있습니다.</span></p>
                <div style="margin-bottom:1.2rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functools.html#functools.lru_cache" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: functools.lru_cache ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: unordered_map ↗</a></span>
                </div>

                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔽 위에서 아래로 (Top-Down)</h3>
                        <p class="approach-desc">재귀 + 결과 저장. 큰 문제에서 시작해서 필요할 때만 작은 문제를 풂</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">memo = {}
def fib(n):
    if n in memo:
        return memo[n]
    if n &lt;= 2:
        return 1
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;unordered_map&gt;
using namespace std;

unordered_map&lt;int, int&gt; memo;
int fib(int n) {
    if (memo.count(n)) return memo[n];
    if (n &lt;= 2) return 1;
    memo[n] = fib(n-1) + fib(n-2);
    return memo[n];
}</code></pre></div></span>
                    </div>
                    <div class="approach-card">
                        <h3>🔼 아래에서 위로 (Bottom-Up)</h3>
                        <p class="approach-desc">반복문 + 표 채우기. 작은 문제부터 차례로 채워나감</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def fib(n):
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;vector&gt;
using namespace std;

int fib(int n) {
    vector&lt;int&gt; dp(n+1, 0);
    dp[1] = dp[2] = 1;
    for (int i = 3; i &lt;= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}</code></pre></div></span>
                    </div>
                </div>

                <div class="execution-flow-compare">
                    <h4>fib(5)를 각 방식으로 실행하면?</h4>
                    <div class="flow-grid">
                        <div class="flow-card topdown-flow">
                            <div class="flow-label">🔽 Top-Down 실행 흐름</div>
                            <div class="flow-trace">
                                <div>fib(5) 호출</div>
                                <div>&nbsp;&nbsp;→ fib(4) 필요 → fib(3) 필요</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;→ fib(2) = 1 ✓ fib(1) = 1 ✓</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;← fib(3) = 2 저장!</div>
                                <div>&nbsp;&nbsp;→ fib(2) = <strong>memo!</strong> 바로 반환</div>
                                <div>&nbsp;&nbsp;← fib(4) = 3 저장!</div>
                                <div>→ fib(3) = <strong>memo!</strong> 바로 반환</div>
                                <div>← fib(5) = 5</div>
                            </div>
                            <div class="flow-point">위에서 아래로 파고들며, 필요한 것만 계산</div>
                        </div>
                        <div class="flow-card bottomup-flow">
                            <div class="flow-label">🔼 Bottom-Up 실행 흐름</div>
                            <div class="flow-trace">
                                <div>dp[1] = 1</div>
                                <div>dp[2] = 1</div>
                                <div>dp[3] = dp[2] + dp[1] = 2</div>
                                <div>dp[4] = dp[3] + dp[2] = 3</div>
                                <div>dp[5] = dp[4] + dp[3] = 5</div>
                            </div>
                            <div class="flow-point">작은 것부터 순서대로, 전부 계산해서 쌓아올림</div>
                        </div>
                    </div>
                </div>

                <div class="key-difference-box">
                    <div>🔽 <strong>Top-Down</strong>: "큰 문제가 뭘 필요로 하는지" 따라가면서 계산 (필요할 때만)</div>
                    <div>🔼 <strong>Bottom-Up</strong>: "작은 문제부터 미리 다 준비"해놓고 쌓아올림 (전부 계산)</div>
                    <div>💡 결과는 같지만, Top-Down은 <strong>재귀</strong>, Bottom-Up은 <strong>반복문</strong>. 대부분 Bottom-Up이 빠르고 안전합니다.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">fib(5000)을 <span class="lang-py">파이썬</span><span class="lang-cpp">C++</span> Top-Down으로 풀면 무슨 문제가 생길까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <span class="lang-py">파이썬은 <strong>재귀 깊이 기본 제한이 1000</strong>입니다.<br>
                        fib(100)은 재귀 깊이 100이라 괜찮지만, fib(5000)이면 <code>RecursionError</code>로 터집니다!</span>
                        <span class="lang-cpp">C++은 재귀 깊이 제한이 명시적이지 않지만, <strong>스택 메모리 크기</strong>에 의존합니다 (기본 ~1MB).<br>
                        fib(5000)이면 재귀 호출이 너무 깊어져 <code>Stack Overflow</code>가 발생할 수 있습니다!</span><br><br>
                        아래에서 위로(Bottom-Up)는 <strong>for문</strong>이라 이런 걱정이 없습니다.<br>
                        <strong>실전 팁:</strong> 대부분의 대회/코딩테스트에서는 아래에서 위로 방식을 더 많이 씁니다. 반복문이라 빠르고, 재귀처럼 너무 많이 쌓여서 터지는 문제가 없기 때문입니다.
                    </div>
                </div>
            </div>

            <!-- ⑤ 성능 비교 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 재귀 vs DP 성능 비교</div>
                <div class="comparison-container">
                    <div class="compare-card bad">
                        <div class="compare-header"><span class="compare-emoji">🐢</span><h3>재귀 (Brute Force)</h3></div>
                        <div class="compare-body"><div class="complexity">O(2<sup>n</sup>)</div><p>같은 계산을 반복</p></div>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="compare-card good">
                        <div class="compare-header"><span class="compare-emoji">🚀</span><h3>DP (저장하며 풀기)</h3></div>
                        <div class="compare-body"><div class="complexity">O(n)</div><p>한 번 계산, 저장, 재활용</p></div>
                    </div>
                </div>
                <div class="perf-demo">
                    <p class="perf-label">fib(<span id="perf-n">10</span>) 호출 횟수 비교 — 슬라이더를 움직여보세요!</p>
                    <div class="perf-slider-wrap"><input type="range" id="perf-slider" min="3" max="25" value="10"></div>
                    <div class="perf-result">
                        <div class="perf-bar-wrapper"><span class="perf-bar-label">재귀</span><div class="perf-bar recursive-bar"><span id="recursive-count"></span></div></div>
                        <div class="perf-bar-wrapper"><span class="perf-bar-label">DP</span><div class="perf-bar dp-bar"><span id="dp-count"></span></div></div>
                    </div>
                </div>
            </div>

            <!-- ⑥ DP 유형 로드맵 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">6</span> DP 유형 분류 로드맵</div>
                <p style="color:var(--text2); margin-bottom:1rem;">DP 문제는 크게 다음 유형으로 나뉩니다. 문제풀이 탭에서 각 유형의 문제를 풀어보세요!</p>
                <div class="dp-roadmap">
                    <div class="roadmap-item"><div class="roadmap-icon">🔢</div><h4>1차원 DP</h4><p>피보나치, 01타일, 1로 만들기</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🪜</div><h4>조건부 1차원 DP</h4><p>계단 오르기, 포도주, 연속합</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">📊</div><h4>2차원 DP</h4><p>RGB거리, 정수 삼각형, 계단 수</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">📈</div><h4>가장 긴 증가 수열 (LIS)</h4><p>증가 수열, 올라갔다 내려가는 수열, 전깃줄</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🔤</div><h4>가장 긴 공통 수열 (LCS)</h4><p>두 문자열 비교, 2차원 표</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🎒</div><h4>배낭 문제</h4><p>무게 제한 안에서 가장 값어치 있게 고르기</p></div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">새로운 DP 문제를 만나면, 어떻게 유형을 파악할 수 있을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>핵심은 "상태를 어떻게 정의하느냐"입니다:</strong><br>
                        • dp[i] 하나로 충분하면 → <strong>1차원 DP</strong><br>
                        • dp[i][j]처럼 2개 이상의 변수가 필요하면 → <strong>2차원 DP</strong><br>
                        • "순서대로 증가/감소" 키워드가 보이면 → <strong>LIS 계열</strong><br>
                        • "두 문자열/수열 비교"이면 → <strong>LCS 계열</strong><br>
                        • "무게/용량 제한 + 선택"이면 → <strong>배낭 문제</strong><br><br>
                        연습하면 자연스럽게 보이기 시작합니다!
                    </div>
                </div>
            </div>
        `;

        // 성능 비교 슬라이더 이벤트
        var slider = container.querySelector('#perf-slider');
        var self = this;
        var updatePerf = function() {
            var n = parseInt(slider.value);
            container.querySelector('#perf-n').textContent = n;
            var recCount = self._fib(n);
            var dpC = n - 2;
            container.querySelector('#recursive-count').textContent = recCount.toLocaleString();
            container.querySelector('#dp-count').textContent = dpC;
            container.querySelector('.recursive-bar').style.width = '100%';
            container.querySelector('.dp-bar').style.width = Math.max((dpC / recCount) * 100, 3) + '%';
        };
        slider.addEventListener('input', updatePerf);
        updatePerf();

        // think-box 인터랙션
        this._initConceptInteractions(container);

        // 신택스 하이라이팅
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var box = btn.closest('.think-box');
                if (!box.classList.contains('revealed')) {
                    box.classList.add('revealed');
                    btn.textContent = '✓ 답변 확인 완료';
                }
            });
        });
        container.querySelectorAll('.quiz-card').forEach(function(card) {
            card.addEventListener('click', function() {
                if (card.classList.contains('answered')) return;
                card.classList.add('answered');
                card.classList.add(card.dataset.isdp === 'true' ? 'correct' : 'wrong');
            });
        });
    },

    // ===== 빈 스텁 =====
    renderVisualize(container) {},
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
    // 시뮬레이션 1: 피보나치 수 1 (boj-24416)
    // ====================================================================
    _renderVizFib1(container) {
        var self = this, suffix = '-fib1';
        var DEFAULT_N = 5;

        function fibVal(n) { if (n <= 2) return 1; var a=1,b=1; for(var i=3;i<=n;i++){var t=a+b;a=b;b=t;} return b; }

        function buildSteps(n, recValEl, dpValEl, infoEl) {
            var recCount = fibVal(n);
            var dpCount = Math.max(n - 2, 0);
            var bigN = Math.min(n + 20, 40);
            var bigRec = fibVal(bigN);
            var bigDp = Math.max(bigN - 2, 0);
            var ratio = bigDp > 0 ? Math.round(bigRec / bigDp) : 0;
            return [
                { description: 'fib(' + n + ')를 재귀로 호출하면 fib(1),fib(2)에 도달하는 횟수(리프 수)가 기본 연산 횟수입니다.',
                  action: function() { infoEl.innerHTML = '재귀: fib(' + n + ')=fib(' + (n-1) + ')+fib(' + (n-2) + '), ... 중복이 생깁니다.'; },
                  undo: function() { infoEl.innerHTML = ''; } },
                { description: '재귀 fib(' + n + ')의 기본 연산 횟수 = fib(' + n + ') 값 = ' + recCount.toLocaleString() + '회',
                  action: function() { recValEl.textContent = recCount.toLocaleString(); infoEl.innerHTML = '재귀 호출 트리의 리프(return 1) 개수 = <strong>' + recCount.toLocaleString() + '</strong>'; },
                  undo: function() { recValEl.textContent = '?'; infoEl.innerHTML = ''; } },
                { description: 'DP는 for i=3..' + n + ', 총 ' + dpCount + '번의 덧셈으로 계산합니다.',
                  action: function() { dpValEl.textContent = dpCount; infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] → <strong>' + dpCount + '번</strong>'; },
                  undo: function() { dpValEl.textContent = '?'; } },
                { description: 'n=' + bigN + '이면? 재귀=' + bigRec.toLocaleString() + ', DP=' + bigDp + '. 차이가 폭발적입니다!',
                  action: function() { infoEl.innerHTML = '<strong style="color:var(--green);">n=' + bigN + ': 재귀 ' + bigRec.toLocaleString() + '회 vs DP ' + bigDp + '회. DP가 ' + ratio.toLocaleString() + '배 빠릅니다!</strong>'; },
                  undo: function() { infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] → <strong>' + dpCount + '번</strong>'; } }
            ];
        }

        function init(n) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-fib-n" value="' + n + '" min="3" max="40" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-fib-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">fib(' + n + ') 호출 횟수: 재귀 vs DP</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">재귀는 중복 호출이 폭발하지만, DP는 n-2번이면 충분합니다.</p>' +
                '<div id="fib1-area' + suffix + '" style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">' +
                '<div id="fib1-rec' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">재귀 호출 수</div><div id="fib1-rec-val' + suffix + '" style="font-size:2rem;color:var(--red);font-weight:700;">?</div></div>' +
                '<div id="fib1-dp' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">DP 연산 수</div><div id="fib1-dp-val' + suffix + '" style="font-size:2rem;color:var(--green);font-weight:700;">?</div></div>' +
                '</div>' +
                '<div id="fib1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var recValEl = container.querySelector('#fib1-rec-val' + suffix);
            var dpValEl = container.querySelector('#fib1-dp-val' + suffix);
            var infoEl = container.querySelector('#fib1-info' + suffix);
            var steps = buildSteps(n, recValEl, dpValEl, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-fib-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-fib-n').value) || DEFAULT_N;
                if (val < 3) val = 3; if (val > 40) val = 40;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // 시뮬레이션 2: 신나는 함수 실행 (boj-9184)
    // ====================================================================
    _renderVizFun(container) {
        var self = this, suffix = '-fun';
        var DEFAULT_A = 2, DEFAULT_B = 2, DEFAULT_C = 2;

        function wFunc(a, b, c, memo) {
            if (a <= 0 || b <= 0 || c <= 0) return 1;
            if (a > 20 || b > 20 || c > 20) return wFunc(20, 20, 20, memo);
            var key = a + ',' + b + ',' + c;
            if (memo[key] !== undefined) return memo[key];
            var res;
            if (a < b && b < c) res = wFunc(a, b, c-1, memo) + wFunc(a, b-1, c-1, memo) - wFunc(a, b-1, c, memo);
            else res = wFunc(a-1, b, c, memo) + wFunc(a-1, b-1, c, memo) + wFunc(a-1, b, c-1, memo) - wFunc(a-1, b-1, c-1, memo);
            memo[key] = res;
            return res;
        }

        function buildSteps(a, b, c, logEl) {
            var memo = {};
            var result = wFunc(a, b, c, memo);
            var lines = [];
            var isAsc = (a < b && b < c);
            var subCalls, subDesc;
            if (isAsc) {
                subCalls = 'w(' + a + ',' + b + ',' + (c-1) + '), w(' + a + ',' + (b-1) + ',' + (c-1) + '), w(' + a + ',' + (b-1) + ',' + c + ')';
                subDesc = 'a&lt;b&lt;c이므로 w(a,b,c-1)+w(a,b-1,c-1)-w(a,b-1,c) 필요';
            } else {
                subCalls = 'w(' + (a-1) + ',' + b + ',' + c + '), w(' + (a-1) + ',' + (b-1) + ',' + c + '), w(' + (a-1) + ',' + b + ',' + (c-1) + '), w(' + (a-1) + ',' + (b-1) + ',' + (c-1) + ')';
                subDesc = 'a&lt;b&lt;c가 아니므로 w(a-1,b,c)+w(a-1,b-1,c)+w(a-1,b,c-1)-w(a-1,b-1,c-1) 필요';
            }
            var memoEntries = Object.keys(memo).slice(0, 4).map(function(k) { return 'w(' + k + ')=' + memo[k]; }).join(', ');
            return [
                { description: 'w(' + a + ',' + b + ',' + c + ') 호출 → memo에 없으므로 계산 시작',
                  action: function() { lines.push('→ w(' + a + ',' + b + ',' + c + ') 호출'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: subDesc,
                  action: function() { lines.push('  필요: ' + subCalls); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: '하위 호출들이 memo에 저장되며 중복 제거',
                  action: function() { lines.push('  ' + memoEntries + ' 저장!'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: 'w(' + a + ',' + b + ',' + c + ') = ' + result + ' → memo에 저장!',
                  action: function() { lines.push('← w(' + a + ',' + b + ',' + c + ') = ' + result + ' ✅ 저장!'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } }
            ];
        }

        function init(a, b, c) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">a: <input type="number" id="dp-fun-a" value="' + a + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<label style="font-weight:600;">b: <input type="number" id="dp-fun-b" value="' + b + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<label style="font-weight:600;">c: <input type="number" id="dp-fun-c" value="' + c + '" min="-1" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<button class="btn btn-primary" id="dp-fun-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">w(' + a + ',' + b + ',' + c + ') 메모이제이션</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">memo 테이블에 저장하면 중복 호출을 건너뜁니다.</p>' +
                '<div id="fun-log' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;font-size:0.85rem;min-height:60px;margin-bottom:12px;white-space:pre-line;"></div>' +
                self._createStepControls(suffix);
            var logEl = container.querySelector('#fun-log' + suffix);
            var steps = buildSteps(a, b, c, logEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-fun-reset').addEventListener('click', function() {
                var va = parseInt(container.querySelector('#dp-fun-a').value);
                var vb = parseInt(container.querySelector('#dp-fun-b').value);
                var vc = parseInt(container.querySelector('#dp-fun-c').value);
                if (isNaN(va)) va = DEFAULT_A; if (isNaN(vb)) vb = DEFAULT_B; if (isNaN(vc)) vc = DEFAULT_C;
                self._clearVizState(); init(va, vb, vc);
            });
        }
        init(DEFAULT_A, DEFAULT_B, DEFAULT_C);
    },

    // ====================================================================
    // 시뮬레이션 3: 1로 만들기 (boj-1463)
    // ====================================================================
    _renderViz1to(container) {
        var self = this, suffix = '-1to';
        var DEFAULT_N = 10;

        function computeDP(n) {
            var dp = new Array(n + 1).fill(0);
            for (var i = 2; i <= n; i++) {
                dp[i] = dp[i - 1] + 1;
                if (i % 2 === 0) dp[i] = Math.min(dp[i], dp[i / 2] + 1);
                if (i % 3 === 0) dp[i] = Math.min(dp[i], dp[i / 3] + 1);
            }
            return dp;
        }

        function tracePath(dp, n) {
            var path = [n];
            var cur = n;
            while (cur > 1) {
                if (cur % 3 === 0 && dp[cur / 3] === dp[cur] - 1) { cur = cur / 3; }
                else if (cur % 2 === 0 && dp[cur / 2] === dp[cur] - 1) { cur = cur / 2; }
                else { cur = cur - 1; }
                path.push(cur);
            }
            return path;
        }

        function buildSteps(n, dp, cellsEl, infoEl) {
            var path = tracePath(dp, n);
            var pathSet = {}; path.forEach(function(v) { pathSet[v] = true; });
            function setCell(num, val, bg) { var c = container.querySelector('#to1-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = val; if(bg) c.style.background = bg;} }
            function resetCell(num) { var c = container.querySelector('#to1-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background = 'var(--bg2)';} }
            var steps = [];
            // Step 1: dp[1]=0
            steps.push({ description: 'dp[1]=0: 이미 1이므로 연산 불필요',
              action: function() { setCell(1, '0', 'var(--accent)15'); infoEl.innerHTML = 'dp[1] = 0'; },
              undo: function() { resetCell(1); infoEl.innerHTML = ''; } });
            // Middle steps: fill in batches
            var batchSize = Math.max(1, Math.floor((n - 1) / 3));
            var start = 2;
            while (start <= n - 1) {
                var end = Math.min(start + batchSize - 1, n - 1);
                (function(s, e) {
                    var descs = [];
                    for (var k = s; k <= e; k++) { descs.push('dp[' + k + ']=' + dp[k]); }
                    steps.push({
                        description: 'dp[' + s + ']~dp[' + e + '] 채우기: ' + descs.join(', '),
                        action: function() { for(var k=s;k<=e;k++) setCell(k, dp[k], 'var(--accent)15'); infoEl.innerHTML = descs.join(', '); },
                        undo: function() { for(var k=s;k<=e;k++) resetCell(k); }
                    });
                })(start, end);
                start = end + 1;
            }
            // Final step: show answer and path
            var pathStr = path.join('→');
            steps.push({ description: 'dp[' + n + ']=' + dp[n] + '. 경로: ' + pathStr,
              action: function() { setCell(n, dp[n], 'var(--green)'); for(var k=0;k<path.length;k++) setCell(path[k], dp[path[k]], 'var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + ', 경로: ' + pathStr + '</strong>'; },
              undo: function() { setCell(n, dp[n], 'var(--accent)15'); for(var k=0;k<path.length;k++) if(path[k] !== n) setCell(path[k], dp[path[k]], 'var(--accent)15'); } });
            return steps;
        }

        function init(n) {
            if (n < 2) n = 2; if (n > 20) n = 20;
            var dp = computeDP(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-1to-n" value="' + n + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-1to-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">' + n + ' → 1 최소 연산</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = i를 1로 만드는 최소 횟수</p>' +
                '<div id="to1-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="to1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#to1-cells' + suffix);
            var infoEl = container.querySelector('#to1-info' + suffix);
            for (var i = 1; i <= n; i++) {
                cellsEl.innerHTML += '<div id="to1-c' + i + suffix + '" style="width:48px;text-align:center;padding:8px 4px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">' + i + '</div><div>?</div></div>';
            }
            var steps = buildSteps(n, dp, cellsEl, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-1to-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-1to-n').value) || DEFAULT_N;
                if (val < 2) val = 2; if (val > 20) val = 20;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // 시뮬레이션 4: 01타일 (boj-1904)
    // ====================================================================
    _renderVizTile(container) {
        var self = this, suffix = '-tile';
        var DEFAULT_N = 4;

        function computeTile(n) {
            var dp = [0, 1, 2];
            for (var i = 3; i <= n; i++) dp[i] = (dp[i-1] + dp[i-2]) % 15746;
            return dp;
        }

        function buildSteps(n, dp, infoEl) {
            function setTile(num, v, bg) { var c = container.querySelector('#tile-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = v; if(bg)c.style.background=bg;} }
            function resetTile(num) { var c = container.querySelector('#tile-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'dp[1]=1: "1" 한 가지', action: function() { setTile(1,'1','#6c5ce715'); infoEl.innerHTML = 'dp[1]=1 (수열: 1)'; }, undo: function() { resetTile(1); infoEl.innerHTML=''; } });
            steps.push({ description: 'dp[2]=2: "11", "00" 두 가지', action: function() { setTile(2,'2','#6c5ce715'); infoEl.innerHTML = 'dp[2]=2 (수열: 11, 00)'; }, undo: function() { resetTile(2); } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    steps.push({ description: 'dp[' + idx + ']=dp[' + (idx-1) + ']+dp[' + (idx-2) + ']=' + dp[idx],
                      action: function() { setTile(idx, dp[idx], '#6c5ce715'); infoEl.innerHTML = 'dp[' + idx + ']=' + dp[idx-1] + '+' + dp[idx-2] + '=' + dp[idx]; },
                      undo: function() { resetTile(idx); } });
                })(i);
            }
            steps.push({ description: 'dp[' + n + ']=dp[' + (n-1) + ']+dp[' + (n-2) + ']=' + dp[n] + ' → 정답!',
              action: function() { setTile(n, dp[n], 'var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n-1] + '+' + dp[n-2] + '=' + dp[n] + '</strong>'; },
              undo: function() { resetTile(n); } });
            return steps;
        }

        function init(n) {
            if (n < 3) n = 3; if (n > 15) n = 15;
            var dp = computeTile(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-tile-n" value="' + n + '" min="3" max="15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-tile-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">01타일: 길이 N=' + n + '인 수열</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = dp[i-1] + dp[i-2] (피보나치와 동일!)</p>' +
                '<div id="tile-cells' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="tile-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#tile-cells' + suffix);
            var infoEl = container.querySelector('#tile-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="tile-c' + i + suffix + '" style="width:56px;text-align:center;padding:8px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">dp[' + i + ']</div><div>?</div></div>';
            var steps = buildSteps(n, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-tile-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-tile-n').value) || DEFAULT_N;
                if (val < 3) val = 3; if (val > 15) val = 15;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // 시뮬레이션 5: 계단 오르기 (boj-2579)
    // ====================================================================
    _renderVizStair(container) {
        var self = this, suffix = '-stair';
        var DEFAULT_SC = [10,20,15,25,10,20];

        function computeStair(sc) {
            var n = sc.length;
            var dp = new Array(n + 1).fill(0);
            dp[1] = sc[0];
            if (n >= 2) dp[2] = sc[0] + sc[1];
            if (n >= 3) dp[3] = Math.max(sc[0], sc[1]) + sc[2];
            for (var i = 4; i <= n; i++) dp[i] = Math.max(dp[i-2] + sc[i-1], dp[i-3] + sc[i-2] + sc[i-1]);
            return dp;
        }

        function buildSteps(sc, dp, infoEl) {
            var n = sc.length;
            function setSt(num, v, bg) { var c = container.querySelector('#st-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:'+v; if(bg)c.style.background=bg;} }
            function resetSt(num) { var c = container.querySelector('#st-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Initial values
            steps.push({ description: 'dp[1]=' + dp[1] + (n>=2 ? ', dp[2]=' + dp[2] : ''),
              action: function() { setSt(1, dp[1], '#fdcb6e15'); if(n>=2) setSt(2, dp[2], '#fdcb6e15'); infoEl.innerHTML='dp[1]=' + sc[0] + (n>=2 ? ', dp[2]=' + sc[0] + '+' + sc[1] + '=' + dp[2] : ''); },
              undo: function() { resetSt(1); if(n>=2) resetSt(2); infoEl.innerHTML=''; } });
            if (n >= 3) {
                steps.push({ description: 'dp[3]=max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3],
                  action: function() { setSt(3, dp[3], '#fdcb6e15'); infoEl.innerHTML='dp[3]=max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3]; },
                  undo: function() { resetSt(3); } });
            }
            for (var i = 4; i < n; i++) {
                (function(idx) {
                    var opt1 = dp[idx-2] + sc[idx-1];
                    var opt2 = dp[idx-3] + sc[idx-2] + sc[idx-1];
                    steps.push({ description: 'dp[' + idx + ']=max(' + dp[idx-2] + '+' + sc[idx-1] + ', ' + dp[idx-3] + '+' + sc[idx-2] + '+' + sc[idx-1] + ')=max(' + opt1 + ',' + opt2 + ')=' + dp[idx],
                      action: function() { setSt(idx, dp[idx], '#fdcb6e15'); infoEl.innerHTML='dp[' + idx + ']=max(' + opt1 + ',' + opt2 + ')=' + dp[idx]; },
                      undo: function() { resetSt(idx); } });
                })(i);
            }
            // Final step
            if (n >= 4) {
                var fopt1 = dp[n-2] + sc[n-1];
                var fopt2 = dp[n-3] + sc[n-2] + sc[n-1];
                steps.push({ description: 'dp[' + n + ']=max(' + dp[n-2] + '+' + sc[n-1] + ', ' + dp[n-3] + '+' + sc[n-2] + '+' + sc[n-1] + ')=' + dp[n] + ' ✅',
                  action: function() { setSt(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
                  undo: function() { resetSt(n); } });
            } else if (n >= 1) {
                steps.push({ description: '최종 답: dp[' + n + ']=' + dp[n] + ' ✅',
                  action: function() { setSt(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
                  undo: function() { resetSt(n); } });
            }
            return steps;
        }

        function init(sc) {
            var n = sc.length;
            var dp = computeStair(sc);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">점수 (쉼표 구분): <input type="text" id="dp-stair-input" value="' + sc.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="dp-stair-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">계단 오르기 (연속 3개 불가)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">점수: [' + sc.join(',') + ']</p>' +
                '<div id="st-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="st-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#st-cells' + suffix);
            var infoEl = container.querySelector('#st-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="st-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + sc[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(sc, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-stair-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-stair-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_SC.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_SC);
    },

    // ====================================================================
    // 시뮬레이션 6: 포도주 시식 (boj-2156)
    // ====================================================================
    _renderVizWine(container) {
        var self = this, suffix = '-wine';
        var DEFAULT_W = [6,10,13,9,8,1];

        function computeWine(w) {
            var n = w.length;
            var dp = new Array(n + 1).fill(0);
            dp[1] = w[0];
            if (n >= 2) dp[2] = w[0] + w[1];
            for (var i = 3; i <= n; i++) dp[i] = Math.max(dp[i-1], dp[i-2] + w[i-1], dp[i-3] + w[i-2] + w[i-1]);
            return dp;
        }

        function buildSteps(w, dp, infoEl) {
            var n = w.length;
            function setWn(num,v,bg) { var c = container.querySelector('#wn-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetWn(num) { var c = container.querySelector('#wn-c' + num + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'dp[1]=' + dp[1] + (n>=2 ? ', dp[2]=' + dp[2] : ''),
              action: function() { setWn(1, dp[1], '#00b89415'); if(n>=2) setWn(2, dp[2], '#00b89415'); infoEl.innerHTML='dp[1]=' + w[0] + (n>=2 ? ', dp[2]=' + w[0] + '+' + w[1] + '=' + dp[2] : ''); },
              undo: function() { resetWn(1); if(n>=2) resetWn(2); infoEl.innerHTML=''; } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    var o1 = dp[idx-1], o2 = dp[idx-2] + w[idx-1], o3 = dp[idx-3] + w[idx-2] + w[idx-1];
                    steps.push({ description: 'dp[' + idx + ']=max(' + o1 + ',' + o2 + ',' + o3 + ')=' + dp[idx],
                      action: function() { setWn(idx, dp[idx], '#00b89415'); infoEl.innerHTML='dp[' + idx + ']=max(' + o1 + ', ' + o2 + ', ' + o3 + ')=' + dp[idx]; },
                      undo: function() { resetWn(idx); } });
                })(i);
            }
            // Final
            var fo1 = dp[n-1], fo2 = dp[n-2] + w[n-1], fo3 = (n>=3 ? dp[n-3] + w[n-2] + w[n-1] : 0);
            steps.push({ description: 'dp[' + n + ']=max(' + fo1 + ',' + fo2 + ',' + fo3 + ')=' + dp[n] + ' ✅',
              action: function() { setWn(n, dp[n], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[' + n + ']=' + dp[n] + '</strong>'; },
              undo: function() { resetWn(n); } });
            return steps;
        }

        function init(w) {
            var n = w.length;
            var dp = computeWine(w);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">포도주 양 (쉼표 구분): <input type="text" id="dp-wine-input" value="' + w.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="dp-wine-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">포도주 시식 (3연속 불가)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">잔: [' + w.join(',') + ']. 안 마시는 선택도 가능!</p>' +
                '<div id="wn-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="wn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#wn-cells' + suffix);
            var infoEl = container.querySelector('#wn-info' + suffix);
            for (var i = 1; i <= n; i++) cellsEl.innerHTML += '<div id="wn-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + w[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(w, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-wine-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-wine-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_W.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_W);
    },

    // ====================================================================
    // 시뮬레이션 7: 연속합 (boj-1912)
    // ====================================================================
    _renderVizMaxSub(container) {
        var self = this, suffix = '-maxsub';
        var DEFAULT_A = [10,-4,3,1,5,6,-35,12,21,-1];

        function computeKadane(a) {
            var n = a.length;
            var curArr = new Array(n);
            curArr[0] = a[0];
            var ans = a[0], ansEnd = 0;
            for (var i = 1; i < n; i++) {
                curArr[i] = Math.max(curArr[i-1] + a[i], a[i]);
                if (curArr[i] > ans) { ans = curArr[i]; ansEnd = i; }
            }
            // find start
            var sum = 0, ansStart = ansEnd;
            for (var i = ansEnd; i >= 0; i--) {
                sum += a[i];
                if (sum === ans) { ansStart = i; }
            }
            return { curArr: curArr, ans: ans, ansStart: ansStart, ansEnd: ansEnd };
        }

        function buildSteps(a, infoEl) {
            var n = a.length;
            var res = computeKadane(a);
            var curArr = res.curArr;
            function setMs(i,v,bg) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
            function resetMs(i) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'dp[0]=' + a[0] + ' (첫 원소로 시작)',
              action: function() { setMs(0, curArr[0], '#d6303115'); infoEl.innerHTML='cur=' + curArr[0] + ', ans=' + curArr[0]; },
              undo: function() { resetMs(0); infoEl.innerHTML=''; } });
            // Process in steps of ~3
            var step = Math.max(1, Math.floor((n - 1) / 4));
            var start = 1;
            var runAns = curArr[0];
            while (start < n) {
                var end = Math.min(start + step - 1, n - 1);
                var isLast = (end === n - 1);
                (function(s, e, prevAns, lastStep) {
                    var newAns = prevAns;
                    for (var k = s; k <= e; k++) newAns = Math.max(newAns, curArr[k]);
                    var desc = 'i=' + s + (s!==e?'~'+e:'') + ': ';
                    var details = [];
                    for (var k = s; k <= e; k++) details.push('dp[' + k + ']=' + curArr[k]);
                    desc += details.join(', ');
                    if (lastStep) desc += '. 최종 답=' + res.ans + ' ✅';
                    steps.push({
                        description: desc,
                        action: function() {
                            for (var k = s; k <= e; k++) {
                                var bg = (lastStep && k === res.ansEnd) ? 'var(--green)' : (curArr[k] < 0 ? 'var(--bg2)' : '#d6303115');
                                setMs(k, curArr[k], bg);
                            }
                            if (lastStep) infoEl.innerHTML = '<strong style="color:var(--green);">✅ 최대 연속합 = ' + res.ans + ' (구간: [' + res.ansStart + '~' + res.ansEnd + '])</strong>';
                            else infoEl.innerHTML = details.join(', ') + ' | ans=' + newAns;
                        },
                        undo: function() { for (var k = s; k <= e; k++) resetMs(k); }
                    });
                })(start, end, runAns, isLast);
                for (var k = start; k <= end; k++) runAns = Math.max(runAns, curArr[k]);
                start = end + 1;
            }
            return steps;
        }

        function init(a) {
            var n = a.length;
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열 (쉼표 구분): <input type="text" id="dp-maxsub-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="dp-maxsub-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">연속합 (카데인 알고리즘)</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">[' + a.join(',') + ']</p>' +
                '<div id="ms-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="ms-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#ms-cells' + suffix);
            var infoEl = container.querySelector('#ms-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="ms-c' + i + suffix + '" style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">?</div></div>';
            var steps = buildSteps(a, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-maxsub-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-maxsub-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 1) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // 시뮬레이션 8: 쉬운 계단 수 (boj-10844)
    // ====================================================================
    _renderVizEasyStair(container) {
        var self = this, suffix = '-estair';
        var DEFAULT_N = 2;
        var MOD = 1000000000;

        function computeEasyStair(n) {
            var dp = [];
            for (var i = 0; i <= n; i++) { dp[i] = []; for (var j = 0; j <= 9; j++) dp[i][j] = 0; }
            for (var j = 1; j <= 9; j++) dp[1][j] = 1;
            for (var i = 2; i <= n; i++) {
                dp[i][0] = dp[i-1][1] % MOD;
                dp[i][9] = dp[i-1][8] % MOD;
                for (var j = 1; j <= 8; j++) dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;
            }
            return dp;
        }

        function buildSteps(n, dpTable, infoEl) {
            function setEs(j,v,bg) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
            function resetEs(j) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Step 1: length 1
            steps.push({ description: '길이 1: dp[1][1~9]=1, dp[1][0]=0 (0으로 시작 불가)',
              action: function() { setEs(0,'0','var(--bg2)'); for(var j=1;j<=9;j++) setEs(j,'1','#0984e315'); infoEl.innerHTML='길이 1인 계단수: 1,2,...,9 (9개)'; },
              undo: function() { for(var j=0;j<=9;j++) resetEs(j); infoEl.innerHTML=''; } });
            // Steps for each length up to n
            for (var len = 2; len <= n; len++) {
                (function(l) {
                    var isLast = (l === n);
                    steps.push({ description: '길이 ' + l + ': dp[' + l + '][0]=' + dpTable[l][0] + ', dp[' + l + '][9]=' + dpTable[l][9],
                      action: function() { setEs(0, dpTable[l][0], '#0984e315'); setEs(9, dpTable[l][9], '#0984e315'); infoEl.innerHTML='끝0←1에서만=' + dpTable[l][0] + ', 끝9←8에서만=' + dpTable[l][9]; },
                      undo: function() { var prev = l > 1 ? dpTable[l-1] : null; setEs(0, prev ? prev[0] : '0', prev && prev[0] > 0 ? '#0984e315' : 'var(--bg2)'); setEs(9, prev ? prev[9] : '?', '#0984e315'); } });
                    steps.push({ description: '길이 ' + l + ': dp[' + l + '][1~8] 채우기',
                      action: function() { for(var j=1;j<=8;j++) setEs(j, dpTable[l][j], '#0984e315'); infoEl.innerHTML='끝1~8은 양쪽에서 옴'; },
                      undo: function() { var prev = l > 1 ? dpTable[l-1] : null; for(var j=1;j<=8;j++) setEs(j, prev ? prev[j] : '?', prev ? '#0984e315' : 'var(--bg2)'); } });
                    if (isLast) {
                        var total = 0; for(var j=0;j<=9;j++) total = (total + dpTable[l][j]) % MOD;
                        steps.push({ description: '합계: 길이 ' + l + '인 계단수 = ' + total + '개 ✅',
                          action: function() { infoEl.innerHTML='<strong style="color:var(--green);">✅ 길이 ' + l + ' 계단수 = ' + total.toLocaleString() + '개</strong>'; },
                          undo: function() { infoEl.innerHTML='끝1~8은 양쪽에서 옴'; } });
                    }
                })(len);
            }
            return steps;
        }

        function init(n) {
            if (n < 1) n = 1; if (n > 10) n = 10;
            var dpTable = computeEasyStair(n);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (자릿수): <input type="number" id="dp-easystair-n" value="' + n + '" min="1" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-easystair-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">쉬운 계단 수: 길이 ' + n + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[길이][끝자리]: 끝자리 j에서 j-1, j+1로 전이</p>' +
                '<div id="es-grid' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="es-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#es-grid' + suffix);
            var infoEl = container.querySelector('#es-info' + suffix);
            for (var j = 0; j <= 9; j++) gridEl.innerHTML += '<div id="es-c' + j + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">끝=' + j + '</div><div style="font-weight:600;">?</div></div>';
            var steps = buildSteps(n, dpTable, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-easystair-reset').addEventListener('click', function() {
                var val = parseInt(container.querySelector('#dp-easystair-n').value) || DEFAULT_N;
                if (val < 1) val = 1; if (val > 10) val = 10;
                self._clearVizState(); init(val);
            });
        }
        init(DEFAULT_N);
    },

    // ====================================================================
    // 시뮬레이션 9: RGB거리 (boj-1149)
    // ====================================================================
    _renderVizRGB(container) {
        var self = this, suffix = '-rgb';
        var DEFAULT_COSTS = [[26,40,83],[49,60,57],[13,89,99]];
        var colorNames = ['R','G','B'];

        function computeRGB(costs) {
            var n = costs.length;
            var dp = [];
            for (var i = 0; i < n; i++) dp[i] = [0,0,0];
            dp[0] = costs[0].slice();
            for (var i = 1; i < n; i++) {
                dp[i][0] = Math.min(dp[i-1][1], dp[i-1][2]) + costs[i][0];
                dp[i][1] = Math.min(dp[i-1][0], dp[i-1][2]) + costs[i][1];
                dp[i][2] = Math.min(dp[i-1][0], dp[i-1][1]) + costs[i][2];
            }
            return dp;
        }

        function buildSteps(costs, dpArr, infoEl) {
            var n = costs.length;
            function setRgb(i,j,txt,bg) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){if(txt)c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
            function resetRgb(i,j) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){c.querySelector('div:last-child').textContent=costs[i][j]; c.style.background='var(--bg2)';} }
            var steps = [];
            // First house
            steps.push({ description: '집1: dp[1][R]=' + costs[0][0] + ', dp[1][G]=' + costs[0][1] + ', dp[1][B]=' + costs[0][2],
              action: function() { for(var j=0;j<3;j++) setRgb(0,j,costs[0][j]+'','#e8439315'); infoEl.innerHTML='첫 집은 그대로 비용'; },
              undo: function() { for(var j=0;j<3;j++) resetRgb(0,j); infoEl.innerHTML=''; } });
            // Each subsequent house
            for (var i = 1; i < n; i++) {
                (function(idx) {
                    var isLast = (idx === n - 1);
                    steps.push({ description: '집' + (idx+1) + ': R=' + dpArr[idx][0] + ', G=' + dpArr[idx][1] + ', B=' + dpArr[idx][2],
                      action: function() { for(var j=0;j<3;j++) setRgb(idx,j,dpArr[idx][j]+'','#e8439315'); infoEl.innerHTML='dp[' + (idx+1) + '][R]=' + dpArr[idx][0] + ', dp[' + (idx+1) + '][G]=' + dpArr[idx][1] + ', dp[' + (idx+1) + '][B]=' + dpArr[idx][2]; },
                      undo: function() { for(var j=0;j<3;j++) resetRgb(idx,j); } });
                })(i);
            }
            // Final: find min and trace path
            var lastRow = dpArr[n-1];
            var minVal = Math.min(lastRow[0], lastRow[1], lastRow[2]);
            var minIdx = lastRow.indexOf(minVal);
            // trace back path
            var path = [minIdx];
            for (var i = n - 1; i > 0; i--) {
                var prev = path[path.length - 1];
                var cands = [0,1,2].filter(function(j) { return j !== prev; });
                var best = cands[0];
                if (dpArr[i-1][cands[1]] < dpArr[i-1][best]) best = cands[1];
                path.push(best);
            }
            path.reverse();
            var pathStr = path.map(function(j) { return colorNames[j]; }).join('→');
            steps.push({ description: 'min=' + minVal + '. 경로: ' + pathStr + ' ✅',
              action: function() { for(var i=0;i<n;i++) setRgb(i, path[i], dpArr[i][path[i]]+'', 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최소 비용=' + minVal + ' (' + pathStr + ')</strong>'; },
              undo: function() { for(var i=0;i<n;i++) setRgb(i, path[i], dpArr[i][path[i]]+'', '#e8439315'); } });
            return steps;
        }

        function init(costs) {
            var n = costs.length;
            var dpArr = computeRGB(costs);
            var costStrs = costs.map(function(r) { return r.join(' '); });
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">비용 (행을 ;로 구분): <input type="text" id="dp-rgb-input" value="' + costStrs.join('; ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="dp-rgb-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">RGB거리: ' + n + '집 최소 비용</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">이웃은 다른 색!</p>' +
                '<div id="rgb-grid' + suffix + '" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:300px;margin:0 auto 12px;"></div>' +
                '<div id="rgb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#rgb-grid' + suffix);
            var infoEl = container.querySelector('#rgb-info' + suffix);
            for (var i = 0; i < n; i++) for (var j = 0; j < 3; j++) gridEl.innerHTML += '<div id="rgb-' + i + '-' + j + suffix + '" style="padding:8px;text-align:center;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">집' + (i+1) + colorNames[j] + '</div><div style="font-weight:600;">' + costs[i][j] + '</div></div>';
            var steps = buildSteps(costs, dpArr, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-rgb-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-rgb-input').value;
                var rows = raw.split(';').map(function(r) { return r.trim().split(/\s+/).map(function(s) { return parseInt(s); }); });
                rows = rows.filter(function(r) { return r.length === 3 && r.every(function(v) { return !isNaN(v); }); });
                if (rows.length < 2) rows = DEFAULT_COSTS.slice();
                if (rows.length > 10) rows = rows.slice(0, 10);
                self._clearVizState(); init(rows);
            });
        }
        init(DEFAULT_COSTS);
    },

    // ====================================================================
    // 시뮬레이션 10: 정수 삼각형 (boj-1932)
    // ====================================================================
    _renderVizTriangle(container) {
        var self = this, suffix = '-tri';
        var DEFAULT_TRI = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];

        function computeTriangle(tri) {
            var n = tri.length;
            var dp = tri.map(function(r) { return r.slice(); });
            for (var i = n - 2; i >= 0; i--) {
                for (var j = 0; j <= i; j++) dp[i][j] += Math.max(dp[i+1][j], dp[i+1][j+1]);
            }
            return dp;
        }

        function buildSteps(tri, dpArr, infoEl) {
            var n = tri.length;
            function setTri(i,j,v,bg) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }
            function resetTri(i,j) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=tri[i][j]; c.style.background='var(--bg2)';} }
            var steps = [];
            // Bottom row
            steps.push({ description: n + '행(맨 아래)은 그대로: [' + tri[n-1].join(',') + ']',
              action: function() { for(var j=0;j<tri[n-1].length;j++) setTri(n-1,j,tri[n-1][j],'#fab1a015'); infoEl.innerHTML='맨 아래 행은 초기값 그대로'; },
              undo: function() { for(var j=0;j<tri[n-1].length;j++) resetTri(n-1,j); infoEl.innerHTML=''; } });
            // Each row from bottom-1 to 1
            for (var i = n - 2; i >= 1; i--) {
                (function(row) {
                    var details = [];
                    for (var j = 0; j <= row; j++) details.push(tri[row][j] + '+max(' + dpArr[row+1][j] + ',' + dpArr[row+1][j+1] + ')=' + dpArr[row][j]);
                    steps.push({ description: (row+1) + '행: ' + details.join(', '),
                      action: function() { for(var j=0;j<=row;j++) setTri(row,j,dpArr[row][j],'#fab1a015'); infoEl.innerHTML=details.join(', '); },
                      undo: function() { for(var j=0;j<=row;j++) resetTri(row,j); } });
                })(i);
            }
            // Top: answer
            steps.push({ description: '1행: dp[0][0] = ' + tri[0][0] + ' + max(' + dpArr[1][0] + ',' + dpArr[1][1] + ') = ' + dpArr[0][0] + ' ✅',
              action: function() { setTri(0,0,dpArr[0][0],'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최대 합 = ' + dpArr[0][0] + '</strong>'; },
              undo: function() { resetTri(0,0); } });
            return steps;
        }

        function init(tri) {
            var n = tri.length;
            var dpArr = computeTriangle(tri);
            var triStrs = tri.map(function(r) { return r.join(' '); });
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">삼각형 (행을 ;로 구분): <input type="text" id="dp-tri-input" value="' + triStrs.join('; ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
                '<button class="btn btn-primary" id="dp-tri-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">정수 삼각형: 아래→위 최대 경로</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">아래에서 위로 올라가며 최대 합을 구합니다.</p>' +
                '<div id="tri-grid' + suffix + '" style="text-align:center;margin-bottom:12px;"></div>' +
                '<div id="tri-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var gridEl = container.querySelector('#tri-grid' + suffix);
            var infoEl = container.querySelector('#tri-info' + suffix);
            var html = '';
            for (var i = 0; i < n; i++) {
                html += '<div style="display:flex;justify-content:center;gap:4px;margin-bottom:4px;">';
                for (var j = 0; j <= i; j++) html += '<div id="tri-' + i + '-' + j + suffix + '" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + tri[i][j] + '</div>';
                html += '</div>';
            }
            gridEl.innerHTML = html;
            var steps = buildSteps(tri, dpArr, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-tri-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-tri-input').value;
                var rows = raw.split(';').map(function(r) { return r.trim().split(/\s+/).map(function(s) { return parseInt(s); }).filter(function(v) { return !isNaN(v); }); });
                rows = rows.filter(function(r) { return r.length > 0; });
                // Validate triangle shape
                var valid = true;
                for (var i = 0; i < rows.length; i++) { if (rows[i].length !== i + 1) valid = false; }
                if (!valid || rows.length < 2) rows = DEFAULT_TRI.map(function(r) { return r.slice(); });
                if (rows.length > 8) rows = rows.slice(0, 8);
                self._clearVizState(); init(rows);
            });
        }
        init(DEFAULT_TRI);
    },

    // ====================================================================
    // 시뮬레이션 11: 가장 긴 증가하는 부분 수열 (boj-11053)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var DEFAULT_A = [10,20,10,30,20,50];

        function computeLIS(a) {
            var n = a.length;
            var dp = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            return dp;
        }

        function buildSteps(a, dp, infoEl) {
            var n = a.length;
            var maxLen = Math.max.apply(null, dp);
            function setLis(i,v,bg) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetLis(i) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            // Step for each element
            for (var i = 0; i < n - 1; i++) {
                (function(idx) {
                    var reason = 'dp[' + idx + ']=' + dp[idx];
                    if (dp[idx] === 1) reason += ' (앞에 더 작은 수 없음)';
                    else {
                        for (var j = 0; j < idx; j++) {
                            if (a[j] < a[idx] && dp[j] + 1 === dp[idx]) { reason += ' (a[' + j + ']=' + a[j] + ' &lt; ' + a[idx] + ')'; break; }
                        }
                    }
                    steps.push({ description: reason,
                      action: function() { setLis(idx, dp[idx], '#74b9ff15'); infoEl.innerHTML=reason; },
                      undo: function() { resetLis(idx); } });
                })(i);
            }
            // Final step: show answer with LIS path highlighted
            var lisPath = [];
            var cur = maxLen;
            for (var i = n - 1; i >= 0; i--) { if (dp[i] === cur) { lisPath.unshift(i); cur--; } }
            var lisVals = lisPath.map(function(i) { return a[i]; });
            steps.push({ description: 'dp[' + (n-1) + ']=' + dp[n-1] + '. LIS 길이=' + maxLen + ': {' + lisVals.join(',') + '} ✅',
              action: function() {
                  setLis(n-1, dp[n-1], '#74b9ff15');
                  for (var k = 0; k < lisPath.length; k++) setLis(lisPath[k], dp[lisPath[k]], 'var(--green)');
                  infoEl.innerHTML='<strong style="color:var(--green);">✅ LIS 길이 = ' + maxLen + ': {' + lisVals.join(', ') + '}</strong>';
              },
              undo: function() { resetLis(n-1); } });
            return steps;
        }

        function init(a) {
            var n = a.length;
            var dp = computeLIS(a);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열 (쉼표 구분): <input type="text" id="dp-lis-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="dp-lis-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">LIS: [' + a.join(',') + ']</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = a[i]로 끝나는 가장 긴 증가 수열 길이</p>' +
                '<div id="lis-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#lis-cells' + suffix);
            var infoEl = container.querySelector('#lis-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="lis-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(a, dp, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-lis-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-lis-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 2) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // 시뮬레이션 12: 가장 긴 바이토닉 부분 수열 (boj-11054)
    // ====================================================================
    _renderVizBitonic(container) {
        var self = this, suffix = '-bito';
        var DEFAULT_A = [1,5,2,1,4,3,4,5,2,1];

        function computeBitonic(a) {
            var n = a.length;
            var lis = new Array(n).fill(1), lds = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
            for (var i = n - 2; i >= 0; i--)
                for (var j = n - 1; j > i; j--)
                    if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
            var sums = [];
            var maxVal = 0, maxIdx = 0;
            for (var i = 0; i < n; i++) {
                sums[i] = lis[i] + lds[i] - 1;
                if (sums[i] > maxVal) { maxVal = sums[i]; maxIdx = i; }
            }
            return { lis: lis, lds: lds, sums: sums, maxVal: maxVal, maxIdx: maxIdx };
        }

        function buildSteps(a, res, infoEl) {
            var n = a.length;
            function setBi(i,txt,bg) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
            function resetBi(i) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?/?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'LIS 배열 (왼→우 증가): [' + res.lis.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); infoEl.innerHTML='LIS 배열: [' + res.lis.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) resetBi(i); infoEl.innerHTML=''; } });
            steps.push({ description: 'LDS 배열 (우→좌 증가): [' + res.lds.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); infoEl.innerHTML='LDS 배열: [' + res.lds.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); } });
            steps.push({ description: 'lis[i]+lds[i]-1 계산: [' + res.sums.join(',') + '] → i=' + res.maxIdx + '이 최대(' + res.maxVal + ')',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.sums[i],(res.sums[i]>=res.maxVal-1?'#a29bfe30':'#a29bfe15')); infoEl.innerHTML='합: [' + res.sums.join(',') + '] → i=' + res.maxIdx + '이 최대'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); } });
            steps.push({ description: '최장 바이토닉 길이 = ' + res.maxVal + ' ✅',
              action: function() { for(var i=0;i<n;i++) setBi(i,a[i],'var(--bg2)'); setBi(res.maxIdx, a[res.maxIdx], 'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최장 바이토닉 = ' + res.maxVal + ' (꼭짓점: a[' + res.maxIdx + ']=' + a[res.maxIdx] + ')</strong>'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,res.sums[i],(res.sums[i]>=res.maxVal-1?'#a29bfe30':'#a29bfe15')); } });
            return steps;
        }

        function init(a) {
            var n = a.length;
            var res = computeBitonic(a);
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">배열 (쉼표 구분): <input type="text" id="dp-bitonic-input" value="' + a.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
                '<button class="btn btn-primary" id="dp-bitonic-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">바이토닉 수열: LIS + LDS</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">[' + a.join(',') + ']. lis[i]+lds[i]-1의 최대</p>' +
                '<div id="bi-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="bi-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#bi-cells' + suffix);
            var infoEl = container.querySelector('#bi-info' + suffix);
            for (var i = 0; i < n; i++) cellsEl.innerHTML += '<div id="bi-c' + i + suffix + '" style="width:44px;text-align:center;padding:4px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.6rem;color:var(--text3);">?/?</div></div>';
            var steps = buildSteps(a, res, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-bitonic-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-bitonic-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length < 2) raw = DEFAULT_A.slice();
                if (raw.length > 15) raw = raw.slice(0, 15);
                self._clearVizState(); init(raw);
            });
        }
        init(DEFAULT_A);
    },

    // ====================================================================
    // 시뮬레이션 13: 전깃줄 (boj-2565)
    // ====================================================================
    _renderVizWire(container) {
        var self = this, suffix = '-wire';
        var DEFAULT_WIRES = [[1,8],[2,2],[3,9],[4,1],[6,4],[7,6],[9,7],[10,10]];

        function computeWire(wires) {
            var sorted = wires.slice().sort(function(a, b) { return a[0] - b[0]; });
            var apos = sorted.map(function(w) { return w[0]; });
            var b = sorted.map(function(w) { return w[1]; });
            var n = b.length;
            var dp = new Array(n).fill(1);
            for (var i = 1; i < n; i++)
                for (var j = 0; j < i; j++)
                    if (b[j] < b[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            var lisLen = Math.max.apply(null, dp);
            return { apos: apos, b: b, dp: dp, lisLen: lisLen, n: n };
        }

        function buildSteps(res, infoEl) {
            var n = res.n, dp = res.dp, b = res.b, apos = res.apos;
            function setWr(i,v,bg) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
            function resetWr(i) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
            var steps = [];
            steps.push({ description: 'A 기준 정렬 완료. B=[' + b.join(',') + ']에서 LIS를 구합니다.',
              action: function() { infoEl.innerHTML='B = [' + b.join(', ') + ']. 이 배열에서 LIS를 구하면 됩니다.'; },
              undo: function() { infoEl.innerHTML=''; } });
            // Fill dp in batches
            var batchSize = Math.max(1, Math.floor(n / 3));
            var start = 0;
            while (start < n - 1) {
                var end = Math.min(start + batchSize - 1, n - 2);
                (function(s, e) {
                    var details = [];
                    for (var k = s; k <= e; k++) details.push('dp[' + k + ']=' + dp[k]);
                    steps.push({ description: details.join(', '),
                      action: function() { for(var k=s;k<=e;k++) setWr(k,dp[k],'#55efc415'); infoEl.innerHTML=details.join(', '); },
                      undo: function() { for(var k=s;k<=e;k++) resetWr(k); } });
                })(start, end);
                start = end + 1;
            }
            // Final
            var remove = n - res.lisLen;
            steps.push({ description: 'LIS=' + res.lisLen + '. 제거 = ' + n + '-' + res.lisLen + ' = ' + remove + ' ✅',
              action: function() {
                  setWr(n-1, dp[n-1], '#55efc415');
                  // Highlight LIS path
                  var cur = res.lisLen;
                  for (var i = n-1; i >= 0; i--) { if (dp[i] === cur) { setWr(i, dp[i], 'var(--green)'); cur--; } }
                  infoEl.innerHTML='<strong style="color:var(--green);">✅ LIS=' + res.lisLen + ', 제거할 전깃줄 = ' + remove + '개</strong>';
              },
              undo: function() { for(var k=0;k<n;k++) setWr(k,dp[k],'#55efc415'); } });
            return steps;
        }

        function init(wires) {
            var res = computeWire(wires);
            var wireStr = wires.map(function(w) { return w[0] + ' ' + w[1]; }).join(', ');
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">전깃줄 (A B 쌍, 쉼표 구분): <input type="text" id="dp-wire-input" value="' + wireStr + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
                '<button class="btn btn-primary" id="dp-wire-reset">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">전깃줄: A 정렬 후 B의 LIS</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">A 기준 정렬: B=[' + res.b.join(',') + ']. LIS 길이를 구한 뒤 N-LIS</p>' +
                '<div id="wr-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="wr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var cellsEl = container.querySelector('#wr-cells' + suffix);
            var infoEl = container.querySelector('#wr-info' + suffix);
            for (var i = 0; i < res.n; i++) cellsEl.innerHTML += '<div id="wr-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">A=' + res.apos[i] + '</div><div style="font-weight:600;">B=' + res.b[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">dp:?</div></div>';
            var steps = buildSteps(res, infoEl);
            self._initStepController(container, steps, suffix);
            container.querySelector('#dp-wire-reset').addEventListener('click', function() {
                var raw = container.querySelector('#dp-wire-input').value;
                var pairs = raw.split(',').map(function(s) {
                    var parts = s.trim().split(/\s+/).map(function(p) { return parseInt(p); });
                    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? parts : null;
                }).filter(function(p) { return p !== null; });
                if (pairs.length < 2) pairs = DEFAULT_WIRES.slice();
                if (pairs.length > 12) pairs = pairs.slice(0, 12);
                self._clearVizState(); init(pairs);
            });
        }
        init(DEFAULT_WIRES);
    },

    // ====================================================================
    // 시뮬레이션 14: LCS (boj-9251)
    // ====================================================================
    _renderVizLCS(container) {
        var self = this, suffix = '-lcs';
        var DEFAULT_A = 'ACAYKP', DEFAULT_B = 'CAPCAK';

        function computeLCS(a, b) {
            var n = a.length, m = b.length;
            var dp = [];
            for (var i = 0; i <= n; i++) {
                dp[i] = [];
                for (var j = 0; j <= m; j++) dp[i][j] = 0;
            }
            for (var i = 1; i <= n; i++) {
                for (var j = 1; j <= m; j++) {
                    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
                    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
            // Backtrack to find LCS string
            var lcsStr = '';
            var ci = n, cj = m;
            while (ci > 0 && cj > 0) {
                if (a[ci-1] === b[cj-1]) { lcsStr = a[ci-1] + lcsStr; ci--; cj--; }
                else if (dp[ci-1][cj] > dp[ci][cj-1]) ci--;
                else cj--;
            }
            return { dp: dp, lcs: lcsStr };
        }

        function renderGrid(a, b) {
            var n = a.length, m = b.length;
            var tbl = '<table style="border-collapse:collapse;margin:0 auto;font-size:0.75rem;"><tr><td></td><td style="padding:4px;font-weight:600;">""</td>';
            for (var j = 0; j < m; j++) tbl += '<td style="padding:4px;font-weight:600;">' + b[j] + '</td>';
            tbl += '</tr>';
            tbl += '<tr><td style="padding:4px;font-weight:600;">""</td>';
            for (var j = 0; j <= m; j++) tbl += '<td id="lcs-0-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">0</td>';
            tbl += '</tr>';
            for (var i = 1; i <= n; i++) {
                tbl += '<tr><td style="padding:4px;font-weight:600;">' + a[i-1] + '</td>';
                for (var j = 0; j <= m; j++) tbl += '<td id="lcs-' + i + '-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">' + (j===0?'0':'?') + '</td>';
                tbl += '</tr>';
            }
            tbl += '</table>';
            return tbl;
        }

        function setLcs(i,j,v,bg) { var c = container.querySelector('#lcs-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }

        function buildSteps(a, b) {
            var result = computeLCS(a, b);
            var dp = result.dp;
            var lcsStr = result.lcs;
            var n = a.length, m = b.length;
            var steps = [];

            for (var i = 1; i <= n; i++) {
                (function(row) {
                    var matchCols = [];
                    for (var j = 1; j <= m; j++) {
                        if (a[row-1] === b[j-1]) matchCols.push(j);
                    }
                    var matchDesc = matchCols.length > 0
                        ? matchCols.map(function(j){ return 'j=' + j + ': ' + a[row-1] + '=' + b[j-1] + '→대각선+1=' + dp[row][j]; }).join(', ')
                        : a[row-1] + '이(가) B에서 매칭 없음→왼/위 max';
                    steps.push({
                        description: row + '행: A[' + row + ']=' + a[row-1] + ' vs B. ' + (matchCols.length > 0 ? '같은 글자에서 +1' : '매칭 없음'),
                        action: function(dir) {
                            if (dir === 'forward') {
                                for (var j = 1; j <= m; j++) setLcs(row, j, dp[row][j], '#fd79a815');
                                infoEl.innerHTML = matchDesc;
                            }
                        },
                        undo: function() {
                            for (var j = 1; j <= m; j++) setLcs(row, j, '?', '');
                            if (row === 1) infoEl.innerHTML = '';
                            else {
                                // restore prev row info
                                infoEl.innerHTML = '';
                            }
                        }
                    });
                })(i);
            }

            // Final step: highlight result
            steps.push({
                description: 'dp[' + n + '][' + m + ']=' + dp[n][m] + '. LCS 길이=' + dp[n][m] + (lcsStr ? ': ' + lcsStr : '') + ' ✅',
                action: function(dir) {
                    if (dir === 'forward') {
                        setLcs(n, m, dp[n][m], 'var(--green)');
                        infoEl.innerHTML = '<strong style="color:var(--green);">✅ LCS 길이 = ' + dp[n][m] + (lcsStr ? ' (' + lcsStr + ')' : '') + '</strong>';
                    }
                },
                undo: function() {
                    setLcs(n, m, dp[n][m], '#fd79a815');
                    infoEl.innerHTML = '';
                }
            });

            return steps;
        }

        function init(a, b) {
            container.innerHTML =
                '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">문자열 A:</label>' +
                    '<input id="dp-lcs-a' + suffix + '" type="text" value="' + a + '" style="width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">문자열 B:</label>' +
                    '<input id="dp-lcs-b' + suffix + '" type="text" value="' + b + '" style="width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<button id="dp-lcs-reset' + suffix + '" style="padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);cursor:pointer;font-size:0.85rem;" title="입력값으로 재시작">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">LCS: ' + a + ' vs ' + b + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">dp[i][j] = A[:i]와 B[:j]의 최장 공통 부분수열 길이</p>' +
                '<div id="lcs-grid' + suffix + '" style="overflow-x:auto;margin-bottom:12px;"></div>' +
                '<div id="lcs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);

            var gridEl = container.querySelector('#lcs-grid' + suffix);
            infoEl = container.querySelector('#lcs-info' + suffix);

            gridEl.innerHTML = renderGrid(a, b);

            var steps = buildSteps(a, b);
            self._initStepController(container, steps, suffix);

            container.querySelector('#dp-lcs-reset' + suffix).addEventListener('click', function() {
                var newA = (container.querySelector('#dp-lcs-a' + suffix).value || '').toUpperCase().replace(/[^A-Z]/g, '');
                var newB = (container.querySelector('#dp-lcs-b' + suffix).value || '').toUpperCase().replace(/[^A-Z]/g, '');
                if (!newA) newA = DEFAULT_A;
                if (!newB) newB = DEFAULT_B;
                if (newA.length > 12) newA = newA.substring(0, 12);
                if (newB.length > 12) newB = newB.substring(0, 12);
                self._clearVizState();
                init(newA, newB);
            });
        }

        var infoEl;
        init(DEFAULT_A, DEFAULT_B);
    },

    // ====================================================================
    // 시뮬레이션 15: 평범한 배낭 (boj-12865)
    // ====================================================================
    _renderVizKnapsack(container) {
        var self = this, suffix = '-knap';
        var DEFAULT_ITEMS = [{w:6,v:13},{w:4,v:8},{w:3,v:6},{w:5,v:12}];
        var DEFAULT_W = 7;
        var DEFAULT_ITEMS_STR = '6 13, 4 8, 3 6, 5 12';

        function computeKnapsack(items, W) {
            var dp = [];
            for (var w = 0; w <= W; w++) dp[w] = 0;
            // Store dp state after each item for step visualization
            var snapshots = [dp.slice()]; // initial state
            for (var i = 0; i < items.length; i++) {
                var prevDp = dp.slice();
                for (var w = W; w >= items[i].w; w--) {
                    dp[w] = Math.max(dp[w], dp[w - items[i].w] + items[i].v);
                }
                snapshots.push(dp.slice());
            }
            // Backtrack to find selected items
            var selected = [];
            var remain = W;
            for (var i = items.length - 1; i >= 0; i--) {
                if (i === 0) {
                    if (snapshots[i + 1][remain] !== snapshots[i][remain]) {
                        selected.unshift(i);
                        remain -= items[i].w;
                    }
                } else {
                    if (snapshots[i + 1][remain] !== snapshots[i][remain]) {
                        selected.unshift(i);
                        remain -= items[i].w;
                    }
                }
            }
            return { dp: dp, snapshots: snapshots, selected: selected };
        }

        function buildSteps(items, W) {
            var result = computeKnapsack(items, W);
            var snapshots = result.snapshots;
            var finalDp = result.dp;
            var selected = result.selected;
            var steps = [];

            for (var i = 0; i < items.length; i++) {
                (function(idx) {
                    var item = items[idx];
                    var prev = snapshots[idx];
                    var curr = snapshots[idx + 1];
                    var changes = [];
                    for (var w = 0; w <= W; w++) {
                        if (curr[w] !== prev[w]) changes.push('dp[' + w + ']=' + curr[w]);
                    }
                    var changeStr = changes.length > 0 ? changes.join(', ') : '갱신 없음';
                    steps.push({
                        description: '물건' + (idx+1) + ' (' + item.w + 'kg, 가치' + item.v + '): ' + changeStr,
                        action: function(dir) {
                            if (dir === 'forward') {
                                for (var w = 0; w <= W; w++) {
                                    var bg = curr[w] !== prev[w] ? '#636e7230' : (curr[w] > 0 ? '#636e7215' : 'var(--bg2)');
                                    setKn(w, curr[w], bg);
                                }
                                var details = [];
                                for (var w = W; w >= item.w; w--) {
                                    if (curr[w] !== prev[w]) {
                                        details.push('dp[' + w + ']=max(' + prev[w] + ', dp[' + (w - item.w) + ']+' + item.v + ')=' + curr[w] + (curr[w] > prev[w] ? ' 갱신!' : ''));
                                    }
                                }
                                infoEl.innerHTML = details.length > 0 ? details.join(', ') : '이 물건으로는 갱신할 수 있는 칸이 없습니다';
                            }
                        },
                        undo: function() {
                            for (var w = 0; w <= W; w++) {
                                var bg = prev[w] > 0 ? '#636e7215' : 'var(--bg2)';
                                setKn(w, prev[w], bg);
                            }
                            if (idx === 0) infoEl.innerHTML = '';
                        }
                    });
                })(i);
            }

            // Final step
            var selDesc = selected.map(function(idx) { return '물건' + (idx+1) + '(' + items[idx].w + 'kg,' + items[idx].v + ')'; }).join(' + ');
            var totalW = 0, totalV = 0;
            selected.forEach(function(idx) { totalW += items[idx].w; totalV += items[idx].v; });
            steps.push({
                description: 'dp[' + W + ']=' + finalDp[W] + '. ' + (selDesc ? selDesc + ' 선택!' : '') + ' ✅',
                action: function(dir) {
                    if (dir === 'forward') {
                        setKn(W, finalDp[W], 'var(--green)');
                        infoEl.innerHTML = '<strong style="color:var(--green);">✅ 최대 가치 = ' + finalDp[W] + (selDesc ? ' (' + selDesc + ' = ' + totalW + 'kg, ' + totalV + ')' : '') + '</strong>';
                    }
                },
                undo: function() {
                    var last = snapshots[snapshots.length - 1];
                    setKn(W, last[W], '#636e7215');
                    infoEl.innerHTML = '';
                }
            });

            return steps;
        }

        function setKn(w,v,bg) { var c = container.querySelector('#kn-c' + w + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }

        function renderCells(W) {
            var html = '';
            for (var w = 0; w <= W; w++) html += '<div id="kn-c' + w + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">w=' + w + '</div><div style="font-weight:600;">0</div></div>';
            return html;
        }

        function init(items, W) {
            var itemsDesc = items.map(function(it) { return '(' + it.w + 'kg,' + it.v + ')'; }).join(', ');
            var itemsStr = items.map(function(it) { return it.w + ' ' + it.v; }).join(', ');
            container.innerHTML =
                '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">' +
                    '<label style="font-size:0.85rem;font-weight:600;">물건 (무게 가치):</label>' +
                    '<input id="dp-knapsack-items' + suffix + '" type="text" value="' + itemsStr + '" style="width:200px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;" placeholder="6 13, 4 8, 3 6">' +
                    '<label style="font-size:0.85rem;font-weight:600;">용량 W:</label>' +
                    '<input id="dp-knapsack-w' + suffix + '" type="number" value="' + W + '" min="1" max="30" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem;font-family:inherit;">' +
                    '<button id="dp-knapsack-reset' + suffix + '" style="padding:4px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg2);cursor:pointer;font-size:0.85rem;" title="입력값으로 재시작">🔄</button>' +
                '</div>' +
                '<h3 style="margin-bottom:8px;">0/1 배낭: 용량 ' + W + '</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">물건: ' + itemsDesc + '. 1차원 DP로 풀기</p>' +
                '<div id="kn-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
                '<div id="kn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);

            var cellsEl = container.querySelector('#kn-cells' + suffix);
            infoEl = container.querySelector('#kn-info' + suffix);
            cellsEl.innerHTML = renderCells(W);

            var steps = buildSteps(items, W);
            self._initStepController(container, steps, suffix);

            container.querySelector('#dp-knapsack-reset' + suffix).addEventListener('click', function() {
                var rawItems = container.querySelector('#dp-knapsack-items' + suffix).value || '';
                var newW = parseInt(container.querySelector('#dp-knapsack-w' + suffix).value) || DEFAULT_W;
                if (newW < 1) newW = 1;
                if (newW > 30) newW = 30;
                var newItems = [];
                rawItems.split(',').forEach(function(pair) {
                    var parts = pair.trim().split(/\s+/);
                    if (parts.length >= 2) {
                        var w = parseInt(parts[0]), v = parseInt(parts[1]);
                        if (!isNaN(w) && !isNaN(v) && w > 0 && v > 0) newItems.push({w:w, v:v});
                    }
                });
                if (newItems.length === 0) newItems = DEFAULT_ITEMS.slice();
                if (newItems.length > 10) newItems = newItems.slice(0, 10);
                self._clearVizState();
                init(newItems, newW);
            });
        }

        var infoEl;
        init(DEFAULT_ITEMS, DEFAULT_W);
    },

    // ===== 5단계 문제 구성 =====
    stages: [
        { num: 1, title: 'DP 입문', desc: '기본 계산 규칙 연습', problemIds: ['boj-24416', 'boj-9184', 'boj-1463', 'boj-1904'] },
        { num: 2, title: '1차원 DP 심화', desc: '조건이 있는 1차원 DP', problemIds: ['boj-2579', 'boj-2156', 'boj-1912', 'boj-10844'] },
        { num: 3, title: '2차원 DP', desc: '테이블을 2차원으로 확장', problemIds: ['boj-1149', 'boj-1932'] },
        { num: 4, title: '가장 긴 증가 수열', desc: '증가 수열 찾기', problemIds: ['boj-11053', 'boj-11054', 'boj-2565'] },
        { num: 5, title: '고전 DP', desc: '가장 긴 공통 수열, 배낭 문제', problemIds: ['boj-9251', 'boj-12865'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: DP 입문 ==========
        {
            id: 'boj-24416',
            title: 'BOJ 24416 - 알고리즘 수업: 피보나치 수 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24416',
            simIntro: '재귀와 DP의 연산 횟수 차이를 단계별로 비교해보세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>오늘도 서준이는 동적 프로그래밍 수업 조교를 맡았다. 재귀 호출에 비해 동적 프로그래밍이 얼마나 빠른지 확인해 보자. n번째 피보나치 수를 구하는 재귀 함수의 호출 횟수와 동적 프로그래밍의 대입 횟수를 출력하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>5</pre></div>
        <div><strong>출력</strong><pre>5 3</pre></div>
    </div></div>
    <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
        <div><strong>입력</strong><pre>30</pre></div>
        <div><strong>출력</strong><pre>832040 28</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>5 ≤ n ≤ 40</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '문제가 "기본 연산 횟수를 세라"고 하네요. 그러면 일단 재귀 코드를 그대로 돌려볼까요? <code>fib(n)</code>을 호출하면서 <code>return 1</code>이 실행될 때마다 카운트를 세면 되겠죠. DP 쪽도 <code>f[i] = f[i-1] + f[i-2]</code>가 실행될 때마다 세면 될 것 같아요.' },
                { title: '근데 이러면 문제가 있어', content: '잠깐, 재귀에서 매번 카운트 변수를 따로 관리해야 할까요? 사실 잘 생각해보면, 재귀의 기본 연산 <code>return 1</code>이 실행되는 횟수는 곧 <strong>fib(n)의 값 자체</strong>예요! 리프 노드에 도달한 횟수 = fib(n)이니까요. 그러면 카운트를 따로 셀 필요 없이 그냥 fib(n) 값을 구하면 되는 거죠.' },
                { title: '이렇게 하면 어떨까?', content: 'DP 쪽은 더 간단합니다. for문이 <code>i = 3</code>부터 <code>i = n</code>까지 돌면서 <code>f[i] = f[i-1] + f[i-2]</code>를 실행하니까, 총 횟수는 그냥 <strong>n - 2</strong>번이에요. 계산할 것도 없죠!<br><br>정리하면:<br>• 재귀 기본 연산 수 = <code>fib(n)</code> 값<br>• DP 기본 연산 수 = <code>n - 2</code>' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에서 재귀로 <code>fib(n)</code>을 구현하면 됩니다. n이 최대 40이라 재귀도 시간 내에 동작해요. 단, <code>sys.setrecursionlimit</code>은 여기선 필요 없습니다.</span><span class="lang-cpp">C++에서 <code>fib(40)</code>은 약 1억이라 <code>long long</code>을 써야 오버플로우가 안 납니다. <code>int</code>로 하면 틀릴 수 있어요!</span>' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 5, inputMax: 40, inputDefault: 5,
            solve(n) {
                function fibRec(n) { if (n <= 2) return 1; return fibRec(n-1) + fibRec(n-2); }
                return fibRec(n) + ' ' + (n - 2);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# 여기에 풀이를 작성하세요\n# 재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 구하세요\n',
                cpp: '#include <iostream>\nusing namespace std;\n\n// 여기에 풀이를 작성하세요\n\nint main() {\n    int n;\n    cin >> n;\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '재귀 fib + 단순 계산',
                description: '재귀 fib(n)의 값이 곧 재귀 기본 연산 수이고, DP는 n-2번입니다.',
                timeComplexity: 'O(2^n) 재귀 / O(n) DP',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '재귀 함수 정의', desc: '재귀 fib(n) 호출 횟수 자체가 기본 연산 수와 같습니다.\n기저 조건: n이 1 또는 2이면 1을 반환.', code: 'import sys\ninput = sys.stdin.readline\n\ndef fib(n):\n    if n == 1 or n == 2:\n        return 1\n    return fib(n-1) + fib(n-2)' },
                        { title: '입력 받기', desc: 'n을 정수로 입력받습니다.', code: 'n = int(input())' },
                        { title: '결과 출력', desc: 'fib(n)이 재귀 기본 연산 수, n-2가 DP 기본 연산 수입니다.\nDP는 i=3부터 n까지 반복하므로 정확히 n-2번.', code: 'print(fib(n), n - 2)' }
                    ],
                    cpp: [
                        { title: '재귀 함수 정의', desc: 'long long 사용: fib(40)은 int 범위를 초과할 수 있습니다.\n재귀 호출 횟수 = fib(n) 값 자체.', code: '#include <iostream>\nusing namespace std;\n\n// 재귀 fib: 호출 횟수 자체가 기본 연산 수\nlong long fib(int n) {\n    if (n == 1 || n == 2) return 1;\n    return fib(n-1) + fib(n-2);\n}' },
                        { title: '입력 받기', desc: 'n을 입력받고 main 함수를 시작합니다.', code: 'int main() {\n    int n;\n    cin >> n;' },
                        { title: '결과 출력', desc: '재귀 기본 연산 수(fib(n))와 DP 기본 연산 수(n-2)를 출력합니다.', code: '    cout << fib(n) << " " << n - 2 << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-9184',
            title: 'BOJ 9184 - 신나는 함수 실행',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/9184',
            simIntro: 'w(2,2,2) 호출 과정에서 메모이제이션이 어떻게 중복을 제거하는지 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>재귀 함수 w(a, b, c)의 결과를 구하시오. 메모이제이션을 사용하여 효율적으로 계산한다. 입력은 EOF까지 반복하며, a=b=c=-1이면 종료.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>1 1 1
2 2 2
10 4 6
50 50 50
-1 -1 -1</pre></div>
        <div><strong>출력</strong><pre>w(1, 1, 1) = 2
w(2, 2, 2) = 4
w(10, 4, 6) = 523
w(50, 50, 50) = 1048576</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>-50 ≤ a, b, c ≤ 50</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '문제에서 재귀 함수 코드를 이미 알려줬으니, 그대로 구현하면 되겠네요! 조건문 그대로 옮기면 될 것 같아요:<br>• a, b, c 중 하나가 &le; 0이면 1 반환<br>• 하나라도 &gt; 20이면 w(20, 20, 20)<br>• a &lt; b &lt; c이면 w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)<br>• 그 외: w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)' },
                { title: '근데 이러면 문제가 있어', content: '그대로 재귀를 돌리면 같은 (a, b, c) 조합이 수없이 반복 호출됩니다. 예를 들어 w(2,2,2)를 구하려면 w(1,1,2), w(1,2,1) 등이 여러 번 불려요. 입력이 w(50,50,50)이면 사실상 w(20,20,20)으로 치환되지만, 그래도 내부에서 중복이 엄청 많습니다. <strong>이미 계산한 값을 다시 계산하는 건 낭비</strong>죠!' },
                { title: '이렇게 하면 어떨까?', content: '한 번 계산한 w(a,b,c)의 결과를 저장해두고, 다음에 같은 호출이 오면 바로 꺼내 쓰면 됩니다 — 이것이 <strong>메모이제이션</strong>이에요!<br><br><code>dp[a][b][c]</code>에 결과를 저장하면 되는데, a, b, c가 0~20 범위이므로 <code>dp[21][21][21]</code> 크기면 충분합니다. 함수 시작에서 "이미 계산했나?" 체크 한 줄만 추가하면 끝!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python은 딕셔너리로 메모이제이션하면 편합니다. <code>(a,b,c)</code> 튜플을 키로 쓰면 별도 visited 배열이 필요 없어요:<br><code>if (a,b,c) in dp: return dp[(a,b,c)]</code></span><span class="lang-cpp">C++은 3차원 배열 <code>dp[21][21][21]</code>과 <code>visited[21][21][21]</code>을 선언해서, visited가 true이면 dp 값을 바로 리턴합니다. 출력 형식은 <code>printf("w(%d, %d, %d) = %d\\n", ...)</code>로 맞추세요.</span>' }
            ],
            inputLabel: 'a 값',
            inputMin: -1, inputMax: 50, inputDefault: 1,
            solve(a) {
                var memo = {};
                function w(a, b, c) {
                    if (a <= 0 || b <= 0 || c <= 0) return 1;
                    if (a > 20 || b > 20 || c > 20) return w(20, 20, 20);
                    var key = a + ',' + b + ',' + c;
                    if (memo[key] !== undefined) return memo[key];
                    var res;
                    if (a < b && b < c) res = w(a, b, c-1) + w(a, b-1, c-1) - w(a, b-1, c);
                    else res = w(a-1, b, c) + w(a-1, b-1, c) + w(a-1, b, c-1) - w(a-1, b-1, c-1);
                    memo[key] = res;
                    return res;
                }
                return 'w(' + a + ', ' + a + ', ' + a + ') = ' + w(a, a, a);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\n# 값을 저장할 3차원 배열 또는 딕셔너리\n# dp = [[[0]*21 for _ in range(21)] for _ in range(21)]\n\ndef w(a, b, c):\n    # 여기에 저장하며 풀기를 적용한 함수를 작성하세요\n    pass\n\nwhile True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nint dp[21][21][21];\nbool visited[21][21][21];\n\nint w(int a, int b, int c) {\n    // 여기에 저장하며 풀기를 적용한 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '메모이제이션 (Top-Down DP)',
                description: '3차원 배열에 계산 결과를 저장하여 중복 호출을 제거합니다.',
                timeComplexity: 'O(21^3)',
                spaceComplexity: 'O(21^3)',
                codeSteps: {
                    python: [
                        { title: '메모 테이블 초기화', desc: 'Python은 딕셔너리로 메모이제이션 구현.\n(a,b,c) 튜플을 키로 사용하면 별도 visited 불필요.', code: 'import sys\ninput = sys.stdin.readline\n\ndp = {}' },
                        { title: 'w 함수 구현 (메모이제이션)', desc: '문제에 주어진 조건을 그대로 구현하되,\n이미 계산한 값은 dp에서 바로 꺼내 중복 호출을 제거합니다.', code: 'def w(a, b, c):\n    if a <= 0 or b <= 0 or c <= 0:\n        return 1\n    if a > 20 or b > 20 or c > 20:\n        return w(20, 20, 20)\n    if (a, b, c) in dp:\n        return dp[(a, b, c)]\n    if a < b < c:\n        dp[(a,b,c)] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)\n    else:\n        dp[(a,b,c)] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)\n    return dp[(a,b,c)]' },
                        { title: '입출력 처리', desc: '-1 -1 -1이 나올 때까지 반복 입력.\nf-string으로 출력 형식을 맞춥니다.', code: 'while True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")' }
                    ],
                    cpp: [
                        { title: '메모 테이블 초기화', desc: 'C++은 3차원 배열 + visited 배열로 메모이제이션 구현', code: '#include <iostream>\nusing namespace std;\n\n// 0~20 범위만 저장하면 되므로 21^3 크기\nint dp[21][21][21];\nbool visited[21][21][21];' },
                        { title: 'w 함수 구현 (메모이제이션)', desc: 'visited 배열로 계산 여부를 체크해 중복 호출을 방지합니다.\n문제 조건을 그대로 if-else로 분기.', code: 'int w(int a, int b, int c) {\n    if (a <= 0 || b <= 0 || c <= 0) return 1;\n    if (a > 20 || b > 20 || c > 20) return w(20, 20, 20);\n    // 이미 계산했으면 바로 리턴\n    if (visited[a][b][c]) return dp[a][b][c];\n    visited[a][b][c] = true;\n    if (a < b && b < c)\n        dp[a][b][c] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c);\n    else\n        dp[a][b][c] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1);\n    return dp[a][b][c];\n}' },
                        { title: '입출력 처리', desc: 'C++은 printf로 출력 형식을 맞춤', code: 'int main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1463',
            title: 'BOJ 1463 - 1로 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1463',
            simIntro: '10을 1로 만드는 최소 연산 과정을 DP 테이블로 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>정수 X에 사용할 수 있는 연산은 다음과 같이 세 가지이다. X가 3으로 나누어 떨어지면 3으로 나눈다. X가 2로 나누어 떨어지면 2로 나눈다. 1을 뺀다. 정수 N이 주어졌을 때, 위와 같은 연산 세 개를 적절히 사용해서 1을 만들려고 한다. 연산을 사용하는 횟수의 최솟값을 출력하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>2</pre></div>
        <div><strong>출력</strong><pre>1</pre></div>
    </div></div>
    <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
        <div><strong>입력</strong><pre>10</pre></div>
        <div><strong>출력</strong><pre>3</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 10<sup>6</sup></li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '세 가지 연산(÷3, ÷2, -1)이 있으니, 그리디하게 "가능한 한 큰 수로 나누기"를 하면 빠르지 않을까요? 예를 들어 3으로 나눌 수 있으면 3으로, 아니면 2로, 둘 다 안 되면 1을 빼는 식으로요.' },
                { title: '근데 이러면 문제가 있어', content: '10을 생각해보세요.<br>그리디: 10 → 5(-1) → 4(-1) → 2(÷2) → 1(÷2) = <strong>4번</strong><br>최적: 10 → 9(-1) → 3(÷3) → 1(÷3) = <strong>3번</strong><br><br>큰 수로 나누는 게 항상 최선이 아니에요! 때로는 1을 빼서 3의 배수로 만드는 게 더 나을 수 있습니다. 모든 경우를 따져봐야 해요.' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = 정수 i를 1로 만드는 최소 연산 횟수로 정의합시다. dp[1] = 0 (이미 1이니까).<br><br>i에서 가능한 연산 세 가지를 <strong>전부</strong> 시도해서 최솟값을 고르면 됩니다:<br>• 1 빼기: <code>dp[i] = dp[i-1] + 1</code><br>• 2로 나누기 (가능할 때): <code>dp[i] = min(dp[i], dp[i/2] + 1)</code><br>• 3으로 나누기 (가능할 때): <code>dp[i] = min(dp[i], dp[i/3] + 1)</code><br><br>i = 2부터 N까지 순서대로 채우면 됩니다 (Bottom-Up).' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python은 리스트 <code>dp = [0] * (n + 1)</code>로 만들고, <code>range(2, n + 1)</code>로 순회하면 깔끔합니다. <code>//</code> 연산자로 정수 나눗셈을 하세요.</span><span class="lang-cpp">C++은 N이 최대 10<sup>6</sup>이므로 전역 배열 <code>int dp[1000001]</code>로 선언합니다. <code>min()</code>과 <code>algorithm</code> 헤더를 사용하세요.</span>' }
            ],
            inputLabel: '정수 N',
            inputMin: 1, inputMax: 1000000, inputDefault: 10,
            solve(n) {
                var dp = new Array(n + 1).fill(0);
                for (var i = 2; i <= n; i++) {
                    dp[i] = dp[i - 1] + 1;
                    if (i % 2 === 0) dp[i] = Math.min(dp[i], dp[i / 2] + 1);
                    if (i % 3 === 0) dp[i] = Math.min(dp[i], dp[i / 3] + 1);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = i를 1로 만드는 최소 연산 횟수\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: 'dp[1]=0에서 시작하여 dp[N]까지 세 가지 연산의 최솟값을 채웁니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 DP 배열', desc: 'dp[i] = i를 1로 만드는 최소 연산 횟수.\ndp[1] = 0 (이미 1이므로 연산 불필요).', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ndp = [0] * (n + 1)' },
                        { title: 'DP 테이블 채우기', desc: '매 i에서 세 가지 연산(−1, ÷2, ÷3)을 모두 시도하고\n최솟값을 저장합니다. 그리디가 아닌 DP가 필요한 이유.', code: 'for i in range(2, n + 1):\n    dp[i] = dp[i-1] + 1\n    if i % 2 == 0:\n        dp[i] = min(dp[i], dp[i//2] + 1)\n    if i % 3 == 0:\n        dp[i] = min(dp[i], dp[i//3] + 1)' },
                        { title: '결과 출력', desc: 'dp[n]이 N을 1로 만드는 최소 연산 횟수입니다.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: '입력 및 DP 배열', desc: 'N이 최대 10^6이므로 전역 배열 사용', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\n// N 최대 10^6 → 전역 배열로 선언\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;' },
                        { title: 'DP 테이블 채우기', desc: '1을 빼기 → 기본값, 2로 나누기 / 3으로 나누기 → 가능할 때만 min 갱신.\n세 연산 모두 시도해야 최적해를 보장합니다.', code: '    for (int i = 2; i <= n; i++) {\n        dp[i] = dp[i-1] + 1;          // 1을 빼는 연산\n        if (i % 2 == 0)\n            dp[i] = min(dp[i], dp[i/2] + 1);  // 2로 나누기\n        if (i % 3 == 0)\n            dp[i] = min(dp[i], dp[i/3] + 1);  // 3으로 나누기\n    }' },
                        { title: '결과 출력', desc: 'dp[n]이 N을 1로 만드는 최소 연산 횟수입니다.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1904',
            title: 'BOJ 1904 - 01타일',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1904',
            simIntro: '01타일이 피보나치와 동일한 구조임을 dp 배열 채우기로 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>지원이에게 2진 수열이 주어졌다. 이 수열은 0 또는 1로 이루어져 있다. 이 수열에서 00타일과 1타일을 사용하여 길이가 N인 수열을 만드는 방법의 수를 15746으로 나눈 나머지를 출력한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>4</pre></div>
        <div><strong>출력</strong><pre>5</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 1,000,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '사용할 수 있는 타일이 "1"(길이 1)과 "00"(길이 2)이에요. 길이 N인 수열을 만들어야 하니까... 일단 모든 조합을 다 만들어볼까요? 길이 1짜리를 N개 쓰는 것부터, 00을 최대한 많이 쓰는 것까지 경우를 나누면 될 것 같아요.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>100만</strong>이에요! 모든 조합을 세려면 경우의 수가 엄청 많습니다. 그런데 잠깐, <strong>마지막에 놓는 타일</strong>에 집중해보면 어떨까요?<br><br>길이 N인 수열의 마지막이:<br>• "1" 타일이면 → 나머지는 길이 N-1인 수열<br>• "00" 타일이면 → 나머지는 길이 N-2인 수열<br><br>어딘가 익숙하지 않나요?' },
                { title: '이렇게 하면 어떨까?', content: '바로 <strong>피보나치</strong>와 같은 구조입니다!<br><br><code>dp[i]</code> = 길이 i인 수열의 개수라고 하면:<br><code>dp[i] = dp[i-1] + dp[i-2]</code><br><br>초기값: dp[1] = 1 ("1" 하나), dp[2] = 2 ("11", "00")<br><br>매 계산마다 <strong>15746으로 나머지</strong>를 취하는 것 잊지 마세요! 안 하면 숫자가 어마어마하게 커집니다.' },
                { title: 'Python/C++에선 이렇게!', content: 'N이 100만이라 배열을 만들 수도 있지만, 이전 두 값만 필요하니 <strong>변수 2개로 공간 O(1)</strong>에 할 수 있어요.<br><span class="lang-py"><code>a, b = 1, 2</code>로 시작해서 <code>a, b = b, (a + b) % 15746</code>을 반복하면 됩니다.</span><span class="lang-cpp"><code>int a = 1, b = 2;</code>로 시작해서 <code>int t = (a + b) % 15746; a = b; b = t;</code>를 반복합니다.</span>' }
            ],
            inputLabel: '길이 N',
            inputMin: 1, inputMax: 1000000, inputDefault: 4,
            solve(n) {
                if (n === 1) return '1';
                var a = 1, b = 2;
                for (var i = 3; i <= n; i++) { var t = (a + b) % 15746; a = b; b = t; }
                return '' + b;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = 길이 i인 2진 수열의 개수\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '피보나치 (Bottom-Up)',
                description: 'dp[i] = dp[i-1] + dp[i-2] (mod 15746). 피보나치와 동일한 점화식입니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N이 최대 100만이므로 빠른 입력을 사용합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: 'DP 계산', desc: '피보나치와 동일한 구조: dp[i] = dp[i-1] + dp[i-2].\n변수 2개로 공간 O(1) 최적화, 매번 MOD 연산.', code: 'if n == 1:\n    print(1)\nelse:\n    a, b = 1, 2\n    for i in range(3, n + 1):\n        a, b = b, (a + b) % 15746' },
                        { title: '출력', desc: 'b에 dp[n] 값이 저장되어 있습니다.', code: '    print(b)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N을 입력받습니다.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;' },
                        { title: 'DP 계산', desc: '변수 2개로 공간 최적화, 매번 MOD 연산', code: '    if (n == 1) {\n        cout << 1 << endl;\n        return 0;\n    }\n    // 변수 2개로 피보나치 계산 (공간 O(1))\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int t = (a + b) % 15746;\n        a = b;\n        b = t;\n    }' },
                        { title: '출력', desc: 'b에 dp[n]의 결과가 저장되어 있습니다.', code: '    cout << b << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[3].templates; }
            }]
        },

        // ========== 2단계: 1차원 DP 심화 ==========
        {
            id: 'boj-2579',
            title: 'BOJ 2579 - 계단 오르기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2579',
            simIntro: '연속 3개 제약 조건 하에서 DP가 어떻게 최적 경로를 찾는지 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>계단 오르기 게임은 계단 아래 시작점부터 계단 꼭대기에 위치한 도착점까지 가는 게임이다. 계단을 밟으면 그 계단에 쓰여진 점수를 얻게 된다. 연속된 세 개의 계단을 모두 밟아서는 안 된다. 마지막 도착 계단은 반드시 밟아야 한다. 총 점수의 최댓값을 구하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>6
10
20
15
25
10
20</pre></div>
        <div><strong>출력</strong><pre>75</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 300</li><li>각 계단 점수 ≤ 10,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '계단이 6개뿐이니까 모든 밟는 조합을 다 해볼까요? "연속 3개 불가" + "마지막 반드시 밟기" 조건을 만족하는 경우만 골라서 합이 가장 큰 걸 찾으면 되겠죠. 예를 들어 1,2,4,6번을 밟는 경우, 1,3,5,6번을 밟는 경우... 이런 식으로요.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 300이면 경우의 수가 폭발적으로 늘어나서 전부 해보는 건 불가능해요. 대신 이렇게 생각해볼까요 — i번째 계단을 밟는 순간, <strong>바로 직전(i-1)을 밟았냐 안 밟았냐</strong>에 따라 딱 두 가지 경우뿐이에요:<br><br>① <strong>i-2에서 2칸 점프</strong>해서 옴 (i-1은 안 밟음)<br>② <strong>i-1에서 1칸</strong>으로 옴 (그러면 i-2는 안 밟아야 연속 3개 안 됨)' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 계단을 밟았을 때의 최대 점수라고 하면:<br><br>• 경우 ①: i-2 → i: <code>dp[i-2] + score[i]</code><br>• 경우 ②: i-3 → i-1 → i: <code>dp[i-3] + score[i-1] + score[i]</code><br><br><code>dp[i] = max(경우①, 경우②)</code><br><br>초기값 3개만 수동으로 채우면 됩니다:<br>dp[1] = score[1], dp[2] = score[1]+score[2], dp[3] = max(score[1], score[2])+score[3]' },
                { title: 'Python/C++에선 이렇게!', content: '1-indexed로 구현하면 점화식과 코드가 딱 맞아요.<br><span class="lang-py"><code>scores = [0] + [int(input()) for _ in range(n)]</code>으로 0번째를 패딩하면 인덱스가 깔끔합니다.</span><span class="lang-cpp"><code>int score[301], dp[301];</code>을 전역으로 선언하고 1번부터 입력받으세요. <code>max()</code>와 <code>&lt;algorithm&gt;</code>을 사용합니다.</span>' }
            ],
            inputLabel: '계단 수 N',
            inputMin: 1, inputMax: 300, inputDefault: 6,
            solve(n) {
                var scores = [0, 10, 20, 15, 25, 10, 20];
                if (n > scores.length - 1) return '(테스트 입력 범위 초과)';
                var dp = new Array(n + 1).fill(0);
                dp[1] = scores[1];
                if (n >= 2) dp[2] = scores[1] + scores[2];
                if (n >= 3) dp[3] = Math.max(scores[1], scores[2]) + scores[3];
                for (var i = 4; i <= n; i++) {
                    dp[i] = Math.max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i]);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = i번째 계단을 밟았을 때 최대 점수\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: '각 계단에서 2칸 점프 vs 1칸+1칸 중 최대를 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '1-indexed 사용: scores[0]=0을 패딩으로 넣어 인덱스를 맞춥니다.\n각 계단 점수를 한 줄씩 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: '초기값 및 DP', desc: '연속 3개 불가 → 두 가지 경우만 존재:\n① i-2에서 2칸 점프 ② i-3→i-1→i (1칸+1칸).\n초기값 3개를 수동으로 설정 후 i=4부터 점화식 적용.', code: 'dp[1] = scores[1]\nif n >= 2: dp[2] = scores[1] + scores[2]\nif n >= 3: dp[3] = max(scores[1], scores[2]) + scores[3]\nfor i in range(4, n + 1):\n    dp[i] = max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i])' },
                        { title: '출력', desc: 'dp[n]이 마지막 계단을 밟았을 때의 최대 점수입니다.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 300이므로 전역 배열로 충분합니다.\n1-indexed로 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];' },
                        { title: '초기값 및 DP', desc: '초기값 3개 설정 후, i=4부터 점화식 적용.\n2칸 점프 vs 1칸+1칸(i-2 건너뜀) 중 최대를 선택.', code: '    dp[1] = score[1];\n    if (n >= 2) dp[2] = score[1] + score[2];\n    if (n >= 3) dp[3] = max(score[1], score[2]) + score[3];\n    for (int i = 4; i <= n; i++) {\n        // 2칸 점프 vs 1칸+1칸(i-2는 건너뜀)\n        dp[i] = max(dp[i-2] + score[i],\n                    dp[i-3] + score[i-1] + score[i]);\n    }' },
                        { title: '출력', desc: 'dp[n]이 마지막 계단까지의 최대 점수입니다.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-2156',
            title: 'BOJ 2156 - 포도주 시식',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2156',
            simIntro: '계단 오르기와 다르게 "안 마시는" 선택이 추가된 DP를 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>포도주 잔이 일렬로 놓여져 있고, 다음과 같은 규칙으로 포도주를 마시려고 한다. 포도주 잔을 선택하면 그 잔에 들어있는 포도주를 모두 마셔야 하고, 마신 후에는 원래 위치에 다시 놓아야 한다. 연속으로 놓여 있는 3잔을 모두 마실 수는 없다. 최대로 마실 수 있는 포도주의 양을 구하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>6
6
10
13
9
8
1</pre></div>
        <div><strong>출력</strong><pre>33</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ n ≤ 10,000</li><li>0 ≤ 포도주 양 ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '아까 "계단 오르기"랑 비슷해 보여요! 연속 3잔 불가 조건이 같으니까, 같은 방법으로 풀면 되지 않을까요? dp[i] = i번째 잔까지의 최대 양으로 놓고, 계단 오르기처럼 두 가지 경우를 보면...' },
                { title: '근데 이러면 문제가 있어', content: '잠깐, 계단 오르기와 <strong>결정적인 차이</strong>가 있어요! 계단 오르기는 "마지막 계단을 반드시 밟아야" 했지만, 포도주는 <strong>i번째 잔을 안 마셔도 괜찮아요</strong>.<br><br>이 차이 때문에 "i번째를 건너뛰는" 경우가 추가됩니다. 계단 오르기의 점화식을 그대로 쓰면 이 경우를 놓쳐서 틀릴 수 있어요!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = 1번~i번째 잔까지 <strong>고려</strong>했을 때 최대 양 (i번째를 안 마실 수도 있음!)으로 정의하면, 3가지 경우가 생겨요:<br><br>① i번째를 <strong>안 마심</strong>: <code>dp[i-1]</code><br>② i번째만 마심 (i-1 안 마심): <code>dp[i-2] + wine[i]</code><br>③ i-1과 i를 연속 마심: <code>dp[i-3] + wine[i-1] + wine[i]</code><br><br><code>dp[i] = max(①, ②, ③)</code><br><br>계단 오르기보다 ①번 경우가 추가된 거예요!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py"><code>dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])</code> 한 줄로 깔끔하게 됩니다. n이 1이나 2일 때 인덱스 에러가 나지 않도록 초기값 처리에 주의하세요.</span><span class="lang-cpp"><code>max({dp[i-1], dp[i-2]+wine[i], dp[i-3]+wine[i-1]+wine[i]})</code>처럼 초기화 리스트로 3개를 비교할 수 있습니다. <code>&lt;algorithm&gt;</code> 헤더가 필요해요.</span>' }
            ],
            inputLabel: '잔 수 n',
            inputMin: 1, inputMax: 10000, inputDefault: 6,
            solve(n) {
                var wine = [0, 6, 10, 13, 9, 8, 1];
                if (n > wine.length - 1) return '(테스트 입력 범위 초과)';
                var dp = new Array(n + 1).fill(0);
                dp[1] = wine[1];
                if (n >= 2) dp[2] = wine[1] + wine[2];
                for (var i = 3; i <= n; i++) {
                    dp[i] = Math.max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i]);
                }
                return '' + dp[n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = i번째 잔까지 고려했을 때 최대 양\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP (3가지 경우)',
                description: '안 마시기 / 1잔만 / 연속 2잔 중 최대를 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '1-indexed로 wine[0]=0 패딩.\n각 잔의 포도주 양을 한 줄씩 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: 'DP 채우기', desc: '계단 오르기와 달리 "안 마시기"(dp[i-1]) 경우가 추가.\n3가지: ① 안 마심 ② i만 마심 ③ i-1과 i 연속.\ni번째를 반드시 포함하지 않아도 되는 게 핵심 차이.', code: 'dp[1] = wine[1]\nif n >= 2: dp[2] = wine[1] + wine[2]\nfor i in range(3, n + 1):\n    dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])' },
                        { title: '출력', desc: 'dp[n]이 최대로 마실 수 있는 포도주 양입니다.', code: 'print(dp[n])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 10,000이므로 전역 배열 사용.\n1-indexed로 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];' },
                        { title: 'DP 채우기', desc: 'max({...}) 초기화 리스트로 3개 값 비교.\n안 마시기 / 1잔만 / 연속 2잔 중 최대 선택.', code: '    dp[1] = wine[1];\n    if (n >= 2) dp[2] = wine[1] + wine[2];\n    for (int i = 3; i <= n; i++) {\n        // 3가지: 안 마시기 / 1잔만 / 연속 2잔\n        dp[i] = max({dp[i-1],\n                     dp[i-2] + wine[i],\n                     dp[i-3] + wine[i-1] + wine[i]});\n    }' },
                        { title: '출력', desc: 'dp[n]이 최대 포도주 양입니다.', code: '    cout << dp[n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-1912',
            title: 'BOJ 1912 - 연속합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1912',
            simIntro: '카데인 알고리즘이 연속합을 어떻게 추적하는지 단계별로 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>n개의 정수로 이루어진 임의의 수열이 주어진다. 우리는 이 중 연속된 몇 개의 수를 선택해서 구할 수 있는 합 중 가장 큰 합을 구하려고 한다. 수는 한 개 이상 선택해야 한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>10
10 -4 3 1 5 6 -35 12 21 -1</pre></div>
        <div><strong>출력</strong><pre>33</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ n ≤ 100,000</li><li>-1,000 ≤ 수 ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '연속된 수들의 합 중 최대를 찾아야 하니까... 모든 가능한 구간 (i, j)를 다 해보면 어떨까요? 시작점 i, 끝점 j를 정하고 그 사이 합을 구해서 최대를 찾는 거예요. 이중 for문으로 모든 구간을 탐색하면 될 것 같아요.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>10만</strong>이에요! 이중 for문은 O(N<sup>2</sup>) = 100억 번이라 시간 초과입니다.<br><br>그런데 생각해보면, 매 위치에서 결정해야 할 건 딱 하나예요:<br>"지금까지 이어온 연속합이 플러스인가, 마이너스인가?"<br>마이너스면 <strong>여기서 새로 시작</strong>하는 게 낫고, 플러스면 <strong>이어 붙이는</strong> 게 낫죠!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> 최대 연속합이라 하면:<br><br><code>dp[i] = max(dp[i-1] + a[i], a[i])</code><br><br>• <code>dp[i-1] + a[i]</code>: 이전 연속합에 이어 붙이기<br>• <code>a[i]</code>: 여기서 새로 시작하기<br><br>최종 답은 <code>max(dp[0], dp[1], ..., dp[n-1])</code>. 이 방법이 바로 <strong>카데인(Kadane) 알고리즘</strong>이에요. O(N)에 끝납니다!' },
                { title: 'Python/C++에선 이렇게!', content: '사실 배열도 필요 없어요! 변수 2개면 충분합니다.<br><span class="lang-py"><code>cur = a[0]</code>, <code>ans = a[0]</code>으로 시작해서<br><code>cur = max(cur + a[i], a[i])</code><br><code>ans = max(ans, cur)</code><br>음수만 있는 경우도 자동으로 처리돼요 (가장 큰 음수가 답).</span><span class="lang-cpp">같은 로직인데, <code>int cur = a[0], ans = a[0];</code>으로 시작합니다. <code>max()</code>와 <code>&lt;algorithm&gt;</code>을 사용하세요.</span>' }
            ],
            inputLabel: 'n 값',
            inputMin: 1, inputMax: 100000, inputDefault: 10,
            solve(n) {
                var arr = [10, -4, 3, 1, 5, 6, -35, 12, 21, -1];
                if (n > arr.length) return '(테스트 입력 범위 초과)';
                var cur = arr[0], ans = arr[0];
                for (var i = 1; i < n; i++) {
                    cur = Math.max(cur + arr[i], arr[i]);
                    ans = Math.max(ans, cur);
                }
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = i번째를 마지막으로 하는 최대 연속합\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '카데인 알고리즘',
                description: '이어붙이기 vs 새시작 중 최대를 선택하며 전체 최대를 추적합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'n개의 정수를 한 줄에 입력받습니다.\n수는 음수일 수도 있으므로 주의.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: '카데인 알고리즘', desc: '핵심: "이어 붙이기 vs 새로 시작" 중 큰 쪽 선택.\ncur = 현재 위치까지의 최대 연속합, ans = 전체 최대.\n배열 없이 변수 2개로 O(1) 공간에 해결.', code: 'cur = a[0]\nans = a[0]\nfor i in range(1, n):\n    cur = max(cur + a[i], a[i])\n    ans = max(ans, cur)' },
                        { title: '출력', desc: 'ans가 연속 부분의 최대 합입니다.', code: 'print(ans)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 10만이므로 지역 배열도 가능합니다.\n0-indexed로 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int a[100001];\n    for (int i = 0; i < n; i++) cin >> a[i];' },
                        { title: '카데인 알고리즘', desc: '이어붙이기(cur+a[i]) vs 새시작(a[i]) 중 max 선택.\nans로 전체 최대를 추적합니다. O(N) 시간, O(1) 공간.', code: '    // 이어붙이기 vs 새시작 중 최대를 선택\n    int cur = a[0], ans = a[0];\n    for (int i = 1; i < n; i++) {\n        cur = max(cur + a[i], a[i]);\n        ans = max(ans, cur);\n    }' },
                        { title: '출력', desc: 'ans가 최대 연속합입니다.', code: '    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-10844',
            title: 'BOJ 10844 - 쉬운 계단 수',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10844',
            simIntro: '끝자리별 전이 과정을 통해 2차원 DP가 어떻게 동작하는지 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>45656이란 수를 보자. 이 수는 인접한 모든 자리의 차이가 1이 난다. 이런 수를 계단 수라고 한다. N이 주어질 때, 길이가 N인 계단 수가 총 몇 개인지 구해보자. 0으로 시작하는 수는 계단수가 아니다. 정답을 1,000,000,000으로 나눈 나머지를 출력한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>1</pre></div>
        <div><strong>출력</strong><pre>9</pre></div>
    </div></div>
    <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
        <div><strong>입력</strong><pre>2</pre></div>
        <div><strong>출력</strong><pre>17</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 100</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '"인접한 자리 차이가 1"인 계단 수를 세야 해요. 일단 길이 N인 숫자를 하나씩 만들어보면서 조건을 체크하면 될까요? 예를 들어 N=2면 12, 21, 23, 32, ... 이런 식으로 전부 만들어서 계단 수인지 확인하는 거예요.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 100이면 숫자가 10<sup>100</sup>개까지 가능해요! 전부 만들어보는 건 당연히 불가능합니다.<br><br>그런데 잘 보면, 계단 수의 다음 자릿수는 <strong>마지막 자릿수에만 의존</strong>해요. 마지막이 3이면 다음에 올 수 있는 건 2 또는 4뿐이죠. 그러면 <strong>"마지막 자릿수"를 상태로 관리</strong>하면 되지 않을까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][j]</code> = 길이 i이고 마지막 자릿수가 j인 계단 수의 개수로 정의합시다!<br><br>전이 규칙:<br>• j = 0: 앞에 1만 가능 → <code>dp[i][0] = dp[i-1][1]</code><br>• j = 9: 앞에 8만 가능 → <code>dp[i][9] = dp[i-1][8]</code><br>• 1~8: <code>dp[i][j] = dp[i-1][j-1] + dp[i-1][j+1]</code><br><br>초기값: dp[1][1~9] = 1 (0으로 시작하는 건 계단 수가 아님!)<br>답: <code>dp[N][0] + dp[N][1] + ... + dp[N][9]</code>' },
                { title: 'Python/C++에선 이렇게!', content: '답이 매우 커지므로 매 계산마다 <code>% 1,000,000,000</code>을 해야 해요.<br><span class="lang-py"><code>dp = [[0]*10 for _ in range(n+1)]</code>로 2차원 리스트를 만들고, 마지막에 <code>sum(dp[n]) % MOD</code>로 출력합니다.</span><span class="lang-cpp"><code>long long dp[101][10]</code>을 사용하세요. 합산할 때 <code>int</code>로 하면 오버플로우가 날 수 있어요!</span>' }
            ],
            inputLabel: '길이 N',
            inputMin: 1, inputMax: 100, inputDefault: 1,
            solve(n) {
                var MOD = 1000000000;
                var dp = [];
                for (var i = 0; i <= n; i++) { dp[i] = []; for (var j = 0; j <= 9; j++) dp[i][j] = 0; }
                for (var j = 1; j <= 9; j++) dp[1][j] = 1;
                for (var i = 2; i <= n; i++) {
                    dp[i][0] = dp[i-1][1];
                    dp[i][9] = dp[i-1][8];
                    for (var j = 1; j <= 8; j++) dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;
                }
                var ans = 0;
                for (var j = 0; j <= 9; j++) ans = (ans + dp[n][j]) % MOD;
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\n\n# dp[i][j] = 길이 i, 마지막 자릿수 j인 계단 수의 개수\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2차원 DP (자릿수 전이)',
                description: '끝자리 0과 9의 경계 처리를 주의하며 전이합니다.',
                timeComplexity: 'O(10N)',
                spaceComplexity: 'O(10N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', desc: 'dp[i][j] = 길이 i, 끝자리 j인 계단 수 개수.\n0으로 시작하는 수는 계단 수가 아니므로 dp[1][0]=0.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\ndp = [[0]*10 for _ in range(n+1)]\nfor j in range(1, 10):\n    dp[1][j] = 1' },
                        { title: 'DP 전이', desc: '끝자리 0은 1에서만, 끝자리 9는 8에서만 올 수 있음.\n나머지 j는 j-1 또는 j+1에서 전이. 매번 MOD 연산.', code: 'for i in range(2, n+1):\n    dp[i][0] = dp[i-1][1]\n    dp[i][9] = dp[i-1][8]\n    for j in range(1, 9):\n        dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD' },
                        { title: '합산 및 출력', desc: '길이 N인 모든 계단 수 = dp[N][0] + dp[N][1] + ... + dp[N][9].', code: 'print(sum(dp[n]) % MOD)' }
                    ],
                    cpp: [
                        { title: '입력 및 초기화', desc: 'long long 사용: 합산 시 int 범위 초과 가능', code: '#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\n// long long: 합산 시 int 범위 초과 방지\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // 0으로 시작하는 수는 계단 수가 아님\n    for (int j = 1; j <= 9; j++) dp[1][j] = 1;' },
                        { title: 'DP 전이', desc: '경계 처리: 0 뒤에는 1만, 9 뒤에는 8만 가능.\n나머지 자릿수는 양쪽에서 전이받습니다.', code: '    for (int i = 2; i <= n; i++) {\n        dp[i][0] = dp[i-1][1];           // 0 뒤에는 1만 가능\n        dp[i][9] = dp[i-1][8];           // 9 뒤에는 8만 가능\n        for (int j = 1; j <= 8; j++)\n            dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;\n    }' },
                        { title: '합산 및 출력', desc: '0~9 모든 끝자리의 개수를 합산합니다.\nlong long으로 합산 시 오버플로우 방지.', code: '    long long ans = 0;\n    for (int j = 0; j <= 9; j++)\n        ans = (ans + dp[n][j]) % MOD;\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[7].templates; }
            }]
        },

        // ========== 3단계: 2차원 DP ==========
        {
            id: 'boj-1149',
            title: 'BOJ 1149 - RGB거리',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1149',
            simIntro: '이웃 색 제약 하에서 최소 비용을 선택하는 2차원 DP를 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>RGB거리에는 집이 N개 있다. 거리는 선분으로 나타낼 수 있고, 1번 집부터 N번 집이 순서대로 있다. 집은 빨강, 초록, 파랑 중 하나의 색으로 칠해야 한다. 이웃한 집은 같은 색으로 칠할 수 없다. 각 집을 빨강, 초록, 파랑으로 칠하는 비용이 주어졌을 때, 모든 집을 칠하는 비용의 최솟값을 구하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>3
26 40 83
49 60 57
13 89 99</pre></div>
        <div><strong>출력</strong><pre>96</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>2 ≤ N ≤ 1,000</li><li>1 ≤ 비용 ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '각 집을 R, G, B 중 하나로 칠하니까, 모든 조합을 다 해보면 어떨까요? N개 집에 3가지 색이니 3<sup>N</sup>가지 경우를 확인해서 "이웃 같은 색 아님" 조건을 만족하면서 비용이 최소인 걸 고르면 되겠죠.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 1000이면 3<sup>1000</sup>... 우주의 나이보다 긴 시간이 걸려요!<br><br>그런데 생각해보면, i번째 집의 색을 정할 때 중요한 건 <strong>바로 직전 집(i-1)이 무슨 색이냐</strong>뿐이에요. 2번째 이전 집은 상관없죠 (이웃만 다르면 되니까). 그러면 "마지막에 칠한 색"만 기억하면 되지 않을까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][c]</code> = i번째 집을 색 c(R=0, G=1, B=2)로 칠했을 때의 최소 총 비용<br><br>이웃 색이 달라야 하므로:<br>• 빨강: <code>dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0]</code><br>• 초록: <code>dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1]</code><br>• 파랑: <code>dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2]</code><br><br>답: <code>min(dp[N][0], dp[N][1], dp[N][2])</code>' },
                { title: 'Python/C++에선 이렇게!', content: '이전 행만 참조하니까 공간 최적화로 <strong>1차원 배열 하나</strong>로도 충분해요!<br><span class="lang-py"><code>dp = list(cost[0])</code>으로 시작해서, 매 집마다 <code>ndp</code>를 만들어 교체합니다. <code>min(dp)</code>로 최종 답을 구하면 깔끔해요.</span><span class="lang-cpp"><code>int dp[1001][3]</code>을 전역으로 선언하거나, 1차원 배열 2개로 최적화할 수 있습니다. <code>min({dp[n-1][0], dp[n-1][1], dp[n-1][2]})</code>으로 출력하세요.</span>' }
            ],
            inputLabel: '집의 수 N',
            inputMin: 2, inputMax: 1000, inputDefault: 3,
            solve(n) {
                var costs = [[26,40,83],[49,60,57],[13,89,99]];
                if (n > costs.length) return '(테스트 입력 범위 초과)';
                var dp = [costs[0][0], costs[0][1], costs[0][2]];
                for (var i = 1; i < n; i++) {
                    var ndp = [
                        Math.min(dp[1], dp[2]) + costs[i][0],
                        Math.min(dp[0], dp[2]) + costs[i][1],
                        Math.min(dp[0], dp[1]) + costs[i][2]
                    ];
                    dp = ndp;
                }
                return '' + Math.min(dp[0], dp[1], dp[2]);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][c] = i번째 집을 색 c로 칠했을 때 최소 비용\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2차원 DP (색 선택)',
                description: '각 집마다 이전 집의 다른 색 최소비용 + 현재 비용을 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N개의 집에 대해 R, G, B 비용을 2차원 리스트로 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: 'DP 계산', desc: '이전 행만 참조하므로 1차원 배열로 공간 최적화.\n각 색마다 이전 집의 "다른 색" 최소비용 + 현재 비용.', code: 'dp = list(cost[0])\nfor i in range(1, n):\n    ndp = [\n        min(dp[1], dp[2]) + cost[i][0],\n        min(dp[0], dp[2]) + cost[i][1],\n        min(dp[0], dp[1]) + cost[i][2]\n    ]\n    dp = ndp' },
                        { title: '출력', desc: '마지막 집의 R, G, B 비용 중 최솟값이 답입니다.', code: 'print(min(dp))' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 1000이므로 전역 2차원 배열 사용.\n각 집의 R, G, B 비용을 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];' },
                        { title: 'DP 계산', desc: '이웃한 집은 같은 색 불가 → 나머지 2색의 min 선택.\n첫 번째 집은 비용 그대로 초기화합니다.', code: '    // 첫 번째 집 초기화\n    for (int c = 0; c < 3; c++) dp[0][c] = cost[0][c];\n    for (int i = 1; i < n; i++) {\n        // 이웃한 집은 다른 색이어야 하므로 나머지 2색의 min 선택\n        dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0];\n        dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1];\n        dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2];\n    }' },
                        { title: '출력', desc: 'min({...}) 초기화 리스트로 3색 중 최솟값 출력.', code: '    cout << min({dp[n-1][0], dp[n-1][1], dp[n-1][2]}) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[8].templates; }
            }]
        },
        {
            id: 'boj-1932',
            title: 'BOJ 1932 - 정수 삼각형',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1932',
            simIntro: '삼각형을 아래에서 위로 올라가며 최대 경로 합을 구하는 과정을 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>정수 삼각형의 맨 위에서 아래로 내려오면서, 대각선 왼쪽 또는 오른쪽으로만 이동할 때 선택된 수의 합이 최대가 되는 경로를 찾으시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>5
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5</pre></div>
        <div><strong>출력</strong><pre>30</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ n ≤ 500</li><li>0 ≤ 수 ≤ 9,999</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '꼭대기에서 바닥까지 내려가는 모든 경로를 탐색해볼까요? 매 층에서 왼쪽 대각선 또는 오른쪽 대각선으로 이동하니까, 깊이가 n이면 경로가 2<sup>n-1</sup>개예요. 각 경로의 합을 구해서 최대를 찾으면 되겠죠.' },
                { title: '근데 이러면 문제가 있어', content: 'n이 최대 500이면 2<sup>499</sup>개의 경로... 불가능하죠!<br><br>그런데 삼각형의 각 칸에 도달하는 방법을 생각해보면, (i, j) 칸에는 <strong>왼쪽 위(i-1, j-1)</strong> 또는 <strong>바로 위(i-1, j)</strong>에서만 올 수 있어요. 이전 칸까지의 최대 합만 알면 현재 칸의 최대 합도 바로 구할 수 있죠!' },
                { title: '이렇게 하면 어떨까?', content: '위→아래로 풀 수도 있지만, <strong>아래→위</strong>로 올라가면 더 간단해요!<br><br>맨 아래 행부터 시작해서, 각 칸에서 아래 두 자식 중 큰 값을 더해 올라갑니다:<br><code>tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])</code><br><br>이러면 경계 처리도 필요 없고, 최종 답이 <code>tri[0][0]</code> 하나에 깔끔하게 모입니다!' },
                { title: 'Python/C++에선 이렇게!', content: '삼각형 배열을 직접 수정하면 추가 메모리도 필요 없어요.<br><span class="lang-py"><code>for i in range(n-2, -1, -1):</code>로 아래에서 위로 올라갑니다. 입력은 <code>tri = [list(map(int, input().split())) for _ in range(n)]</code>으로 2차원 리스트로 받으세요.</span><span class="lang-cpp"><code>for (int i = n-2; i &gt;= 0; i--)</code>로 역순 순회합니다. <code>int tri[501][501]</code> 전역 배열에 직접 누적하면 됩니다.</span>' }
            ],
            inputLabel: '삼각형 크기 n',
            inputMin: 1, inputMax: 500, inputDefault: 5,
            solve(n) {
                var tri = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];
                if (n > tri.length) return '(테스트 입력 범위 초과)';
                var dp = tri.map(function(row) { return row.slice(); });
                for (var i = n - 2; i >= 0; i--) {
                    for (var j = 0; j <= i; j++) {
                        dp[i][j] += Math.max(dp[i+1][j], dp[i+1][j+1]);
                    }
                }
                return '' + dp[0][0];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][j] = i행 j열까지의 최대 합\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '아래→위 Bottom-Up',
                description: '맨 아래 행부터 위로 올라가며 max를 누적합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '삼각형을 2차원 리스트로 입력받습니다.\ni행에는 i+1개의 수가 있습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: '아래→위 DP', desc: '아래에서 위로 올라가며 풀면 경계 처리가 필요 없고,\ntri[0][0]이 바로 답이 되어 간결합니다.\n원본 배열을 직접 수정하여 추가 공간 불필요.', code: 'for i in range(n-2, -1, -1):\n    for j in range(i+1):\n        tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])' },
                        { title: '출력', desc: '꼭대기(tri[0][0])에 최대 합이 누적되어 있습니다.', code: 'print(tri[0][0])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 500이므로 전역 2차원 배열 사용.\n삼각형 형태로 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];' },
                        { title: '아래→위 DP', desc: '맨 아래 행부터 위로 올라가며 max 누적.\n아래→위 방식은 경계 처리 없이 tri[0][0]이 답.', code: '    // 맨 아래 행부터 올라가며 max 누적\n    for (int i = n-2; i >= 0; i--)\n        for (int j = 0; j <= i; j++)\n            tri[i][j] += max(tri[i+1][j], tri[i+1][j+1]);' },
                        { title: '출력', desc: 'tri[0][0]에 최대 경로 합이 누적됩니다.', code: '    cout << tri[0][0] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[9].templates; }
            }]
        },

        // ========== 4단계: LIS 계열 ==========
        {
            id: 'boj-11053',
            title: 'BOJ 11053 - 가장 긴 증가하는 부분 수열',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11053',
            simIntro: 'dp[i] 배열을 채우며 가장 긴 증가 수열을 찾는 과정을 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하는 프로그램을 작성하시오. 예를 들어 수열 A = {10, 20, 10, 30, 20, 50}이면 LIS는 {10, 20, 30, 50}이고 길이는 4이다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>6
10 20 10 30 20 50</pre></div>
        <div><strong>출력</strong><pre>4</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 1,000</li><li>1 ≤ A<sub>i</sub> ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '가장 긴 증가하는 부분 수열(LIS)을 찾아야 해요. 일단 모든 부분 수열을 만들어서 "증가하는가?" 체크하고 그중 가장 긴 걸 고르면 될까요? 수열 {10, 20, 10, 30, 20, 50}에서 부분 수열은 {10}, {10, 20}, {10, 20, 30}, {10, 20, 30, 50}, ...' },
                { title: '근데 이러면 문제가 있어', content: 'N개 원소의 부분 수열은 2<sup>N</sup>개예요. N=1000이면... 전혀 안 됩니다!<br><br>대신 이렇게 생각해볼까요: 각 원소를 "마지막 원소"로 끝나는 가장 긴 증가 수열의 길이를 구하는 거예요. i번째 원소로 끝나는 LIS를 구하려면, 앞에 있는 <strong>나보다 작은</strong> 원소들의 LIS 길이를 참고하면 되죠!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> LIS 길이로 정의합시다.<br><br>초기값: dp[i] = 1 (자기 자신만 포함)<br>0 &le; j &lt; i인 모든 j에 대해:<br><code>A[j] &lt; A[i]</code>이면 → <code>dp[i] = max(dp[i], dp[j] + 1)</code><br><br>답: <code>max(dp[0], dp[1], ..., dp[n-1])</code><br><br>이중 for문으로 O(N<sup>2</sup>). N &le; 1000이므로 충분합니다!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py"><code>dp = [1] * n</code>으로 초기화하고 이중 for문을 돌립니다. 마지막에 <code>print(max(dp))</code>로 간단하게 출력!</span><span class="lang-cpp"><code>int dp[1001]</code>을 전역으로 선언하고, 내부 루프에서 <code>dp[i] = max(dp[i], dp[j] + 1)</code>을 갱신합니다. <code>*max_element(dp, dp + n)</code>으로 최댓값을 구하세요.</span>' }
            ],
            inputLabel: '수열 크기 N',
            inputMin: 1, inputMax: 1000, inputDefault: 6,
            solve(n) {
                var a = [10, 20, 10, 30, 20, 50];
                if (n > a.length) return '(테스트 입력 범위 초과)';
                var dp = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                return '' + Math.max.apply(null, dp);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = a[i]를 마지막으로 하는 가장 긴 증가 수열의 길이\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'O(N^2) DP',
                description: '각 원소마다 앞의 모든 원소를 확인하여 LIS를 구합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '수열 크기 N과 N개의 정수를 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: 'LIS DP', desc: 'dp[i] = a[i]를 마지막으로 하는 LIS 길이.\n각 원소마다 앞의 더 작은 원소들의 dp값 중 최대 + 1.\n이중 for문 O(N²), N ≤ 1000이므로 충분.', code: 'dp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]:\n            dp[i] = max(dp[i], dp[j] + 1)' },
                        { title: '출력', desc: 'dp 배열의 최댓값이 가장 긴 증가 수열의 길이.', code: 'print(max(dp))' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N이 최대 1000이므로 전역 배열 사용.\n0-indexed로 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];' },
                        { title: 'LIS DP', desc: '각 원소에서 앞의 더 작은 원소를 찾아 dp 갱신.\n초기값 dp[i]=1(자기만 포함). O(N²) 이중 루프.', code: '    // dp[i] = a[i]를 마지막으로 하는 LIS 길이\n    for (int i = 0; i < n; i++) {\n        dp[i] = 1;  // 자기 자신만 포함\n        for (int j = 0; j < i; j++)\n            if (a[j] < a[i])\n                dp[i] = max(dp[i], dp[j] + 1);\n    }' },
                        { title: '출력', desc: 'max_element로 dp 배열의 최댓값을 구합니다.', code: '    cout << *max_element(dp, dp + n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[10].templates; }
            }]
        },
        {
            id: 'boj-11054',
            title: 'BOJ 11054 - 가장 긴 올라갔다 내려가는 수열',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11054',
            simIntro: 'LIS와 LDS를 합쳐 바이토닉 수열을 구하는 과정을 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>수열 S가 어떤 수 S<sub>k</sub>를 기준으로 S<sub>1</sub> &lt; S<sub>2</sub> &lt; ... &lt; S<sub>k-1</sub> &lt; S<sub>k</sub> &gt; S<sub>k+1</sub> &gt; ... &gt; S<sub>N-1</sub> &gt; S<sub>N</sub>을 만족하면 바이토닉 수열이라고 한다. 주어진 수열에서 가장 긴 바이토닉 부분 수열의 길이를 구하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>10
1 5 2 1 4 3 4 5 2 1</pre></div>
        <div><strong>출력</strong><pre>7</pre></div>
    </div></div>
    <p><strong>설명:</strong> {1, 2, 3, 4, 5, 2, 1}</p>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 1,000</li><li>1 ≤ A<sub>i</sub> ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '바이토닉 수열은 "올라갔다 내려가는" 수열이에요. 어떤 꼭짓점 k를 기준으로 왼쪽은 증가, 오른쪽은 감소하죠. 그러면 모든 위치 k를 꼭짓점으로 해보고, 그때마다 왼쪽 증가 수열 + 오른쪽 감소 수열의 합이 가장 큰 걸 찾으면 되지 않을까요?' },
                { title: '근데 이러면 문제가 있어', content: '꼭짓점 k마다 왼쪽 LIS, 오른쪽 감소 수열을 매번 새로 구하면 시간이 너무 오래 걸려요. LIS가 O(N<sup>2</sup>)인데 그걸 N번 반복하면 O(N<sup>3</sup>)이 되니까요.<br><br>하지만 잘 생각해보면, <strong>왼쪽에서의 LIS</strong>와 <strong>오른쪽에서의 LIS</strong>(= 감소 수열)를 <strong>한 번씩만</strong> 미리 구해놓으면, 합치는 건 O(N)이에요!' },
                { title: '이렇게 하면 어떨까?', content: '두 배열을 미리 구합시다:<br>• <code>lis[i]</code> = 왼→오 방향에서 i를 마지막으로 하는 LIS 길이<br>• <code>lds[i]</code> = 오→왼 방향에서 i를 마지막으로 하는 LIS 길이 (= i를 시작으로 하는 감소 수열 길이)<br><br>그러면 각 꼭짓점 i에서의 바이토닉 수열 길이는:<br><code>lis[i] + lds[i] - 1</code><br>(-1은 꼭짓점이 양쪽에서 중복 카운트되기 때문)<br><br>답: 모든 i에 대해 이 값의 최대!' },
                { title: 'Python/C++에선 이렇게!', content: 'LIS를 정방향, 역방향으로 딱 <strong>두 번</strong> 구하면 됩니다.<br><span class="lang-py">역방향 LIS는 <code>for i in range(n-2, -1, -1):</code>로 뒤에서부터 순회합니다. 마지막에 <code>max(lis[i] + lds[i] - 1 for i in range(n))</code>으로 한 줄 출력!</span><span class="lang-cpp">정방향은 <code>lis[1001]</code>, 역방향은 <code>lds[1001]</code> 전역 배열. 합산 시 <code>max(ans, lis[i] + lds[i] - 1)</code>로 갱신합니다.</span>' }
            ],
            inputLabel: '수열 크기 N',
            inputMin: 1, inputMax: 1000, inputDefault: 10,
            solve(n) {
                var a = [1, 5, 2, 1, 4, 3, 4, 5, 2, 1];
                if (n > a.length) return '(테스트 입력 범위 초과)';
                var lis = new Array(n).fill(1), lds = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
                for (var i = n - 2; i >= 0; i--)
                    for (var j = n - 1; j > i; j--)
                        if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
                var ans = 0;
                for (var i = 0; i < n; i++) ans = Math.max(ans, lis[i] + lds[i] - 1);
                return '' + ans;
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# lis[i] = 왼→우 증가 수열, lds[i] = 우→좌 증가 수열\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: 'LIS + LDS 합치기',
                description: '정방향 LIS와 역방향 LIS를 구해 합산합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 LIS', desc: '먼저 정방향 LIS를 구합니다.\nlis[i] = i번째를 마지막으로 하는 증가 수열 길이.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\nlis = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]: lis[i] = max(lis[i], lis[j]+1)' },
                        { title: 'LDS (역방향 LIS)', desc: '뒤에서부터 증가 수열 = 앞에서 보면 감소 수열.\nlds[i] = i번째를 시작으로 하는 감소 수열 길이.', code: 'lds = [1] * n\nfor i in range(n-2, -1, -1):\n    for j in range(n-1, i, -1):\n        if a[j] < a[i]: lds[i] = max(lds[i], lds[j]+1)' },
                        { title: '합산 및 출력', desc: '꼭짓점 i 기준으로 lis[i]+lds[i]-1의 최대.\n-1은 꼭짓점이 양쪽에서 중복 카운트되기 때문.', code: 'print(max(lis[i] + lds[i] - 1 for i in range(n)))' }
                    ],
                    cpp: [
                        { title: '입력 및 LIS', desc: '정방향 LIS를 먼저 구합니다.\nlis[i] = a[i]를 마지막으로 하는 증가 수열 길이.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 정방향 LIS\n    for (int i = 0; i < n; i++) {\n        lis[i] = 1;\n        for (int j = 0; j < i; j++)\n            if (a[j] < a[i]) lis[i] = max(lis[i], lis[j] + 1);\n    }' },
                        { title: 'LDS (역방향 LIS)', desc: '역방향으로 LIS를 구하면 감소 수열 길이가 됩니다.\nlds[i] = a[i]를 시작으로 하는 감소 수열 길이.', code: '    // 역방향 LIS = 감소 수열 길이\n    for (int i = n-1; i >= 0; i--) {\n        lds[i] = 1;\n        for (int j = n-1; j > i; j--)\n            if (a[j] < a[i]) lds[i] = max(lds[i], lds[j] + 1);\n    }' },
                        { title: '합산 및 출력', desc: '꼭짓점 i에서 증가+감소 합산, -1로 중복 제거.\n모든 i에 대해 최대를 구합니다.', code: '    // 꼭짓점 i 기준 lis[i]+lds[i]-1의 최대\n    int ans = 0;\n    for (int i = 0; i < n; i++)\n        ans = max(ans, lis[i] + lds[i] - 1);\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[11].templates; }
            }]
        },
        {
            id: 'boj-2565',
            title: 'BOJ 2565 - 전깃줄',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2565',
            simIntro: 'A 기준 정렬 후 B 배열에서 LIS를 구해 제거할 전깃줄 수를 구하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>두 전봇대 A와 B 사이에 전깃줄이 있다. 전깃줄이 교차하지 않게 하기 위해 몇 개의 전깃줄을 제거하려 한다. 제거해야 하는 전깃줄의 최소 개수를 구하시오.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>8
1 8
3 9
2 2
4 1
6 4
10 10
9 7
7 6</pre></div>
        <div><strong>출력</strong><pre>3</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 100</li><li>위치 번호 ≤ 500</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '전깃줄이 교차하는 쌍을 모두 찾아서, 교차를 없애려면 어느 줄을 제거할지 정하면 될까요? 교차하는 쌍들을 그래프처럼 생각해서... 음, 복잡해지네요. 어떤 줄을 제거해야 나머지가 교차하지 않을지 조합을 따져봐야 할 것 같아요.' },
                { title: '근데 이러면 문제가 있어', content: '제거 조합을 모두 시도하면 2<sup>N</sup>이 되어 안 돼요. <strong>발상을 전환</strong>해봅시다!<br><br>"제거할 줄의 최소"를 직접 구하는 대신, <strong>"남길 줄의 최대"</strong>를 구하면 어떨까요? 교차하지 않고 남길 수 있는 최대 전깃줄 수를 M이라 하면, 제거할 줄 = N - M이니까요.<br><br>그러면 "교차하지 않는 전깃줄의 최대 집합"은 어떤 구조일까요?' },
                { title: '이렇게 하면 어떨까?', content: 'A 전봇대 기준으로 전깃줄을 정렬해봅시다. 그러면 교차하지 않으려면 B 쪽 번호도 <strong>증가해야</strong> 해요!<br><br>예: A 정렬 후 B = [8, 2, 9, 1, 4, 6, 7, 10]<br>여기서 증가하는 부분 수열 = 교차 안 하는 전깃줄!<br><br>결국 <strong>B 배열의 LIS</strong>를 구하는 문제예요!<br>답: <code>N - LIS 길이</code>' },
                { title: 'Python/C++에선 이렇게!', content: '핵심은 <strong>A 기준 정렬</strong>을 먼저 하는 거예요!<br><span class="lang-py"><code>wires.sort()</code>하면 첫 번째 값(A) 기준으로 자동 정렬. 이후 <code>b = [w[1] for w in wires]</code>에서 LIS를 구합니다.</span><span class="lang-cpp"><code>pair&lt;int,int&gt;</code>를 사용하면 <code>sort()</code>가 first 기준으로 자동 정렬합니다. <code>wires[i].second</code>에서 LIS를 구하세요.</span>' }
            ],
            inputLabel: '전깃줄 수 N',
            inputMin: 1, inputMax: 100, inputDefault: 8,
            solve(n) {
                var wires = [[1,8],[3,9],[2,2],[4,1],[6,4],[10,10],[9,7],[7,6]];
                if (n > wires.length) return '(테스트 입력 범위 초과)';
                var sorted = wires.slice(0, n).sort(function(a, b) { return a[0] - b[0]; });
                var b = sorted.map(function(w) { return w[1]; });
                var dp = new Array(n).fill(1);
                for (var i = 1; i < n; i++)
                    for (var j = 0; j < i; j++)
                        if (b[j] < b[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                return '' + (n - Math.max.apply(null, dp));
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\n\n# A 기준 정렬 후 B에서 가장 긴 증가 수열 찾기\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    sort(wires, wires + n);\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '정렬 + LIS',
                description: 'A 기준 정렬 후 B 배열에서 LIS를 구해 N에서 뺍니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', desc: 'A 전봇대 기준으로 정렬하면, B 배열에서 LIS를 구하는\n문제로 변환됩니다. 교차 = B가 증가하지 않는 부분.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\nwires.sort()' },
                        { title: 'B 배열에서 LIS', desc: 'A 정렬 후 B에서 LIS = 교차하지 않는 최대 전깃줄 수.\n표준 O(N²) LIS DP를 적용합니다.', code: 'b = [w[1] for w in wires]\ndp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if b[j] < b[i]: dp[i] = max(dp[i], dp[j]+1)' },
                        { title: '출력', desc: '제거할 전깃줄 수 = 전체 N - 교차 안 하는 최대(LIS).', code: 'print(n - max(dp))' }
                    ],
                    cpp: [
                        { title: '입력 및 정렬', desc: 'pair는 first 기준 자동 정렬', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    // pair는 first 기준 자동 정렬\n    sort(wires, wires + n);' },
                        { title: 'B 배열에서 LIS', desc: 'pair의 second(B값)에서 LIS를 구합니다.\nLIS 길이 = 교차하지 않는 최대 전깃줄 수.', code: '    // A 정렬 후 B(second)에서 LIS 구하기\n    for (int i = 0; i < n; i++) {\n        dp[i] = 1;\n        for (int j = 0; j < i; j++)\n            if (wires[j].second < wires[i].second)\n                dp[i] = max(dp[i], dp[j] + 1);\n    }' },
                        { title: '출력', desc: '전체 N에서 LIS 길이를 빼면 제거할 최소 전깃줄 수.', code: '    // 제거할 전깃줄 = 전체 - 교차 안 하는 최대(LIS)\n    cout << n - *max_element(dp, dp + n) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[12].templates; }
            }]
        },

        // ========== 5단계: 고전 DP ==========
        {
            id: 'boj-9251',
            title: 'BOJ 9251 - LCS',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9251',
            simIntro: '2차원 DP 테이블을 채우며 LCS를 구하는 과정을 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>LCS(Longest Common Subsequence, 최장 공통 부분 수열) 문제는 두 수열이 주어졌을 때, 모두의 부분 수열이 되는 수열 중 가장 긴 것을 찾는 문제이다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>ACAYKP
CAPCAK</pre></div>
        <div><strong>출력</strong><pre>4</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>두 문자열 길이 ≤ 1,000</li><li>대문자로만 구성</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '두 문자열에서 공통 부분 수열 중 가장 긴 걸 찾아야 해요. 일단 A의 모든 부분 수열을 만들고, 각각이 B의 부분 수열이기도 한지 확인하면 될까요? A = "ACAYKP"의 부분 수열은 {A, C, AC, AY, ACK, ...} 이런 식으로요.' },
                { title: '근데 이러면 문제가 있어', content: '길이 N인 문자열의 부분 수열은 2<sup>N</sup>개! N이 1000이면 전혀 안 되죠.<br><br>대신 이렇게 생각해봐요: A의 i번째 문자와 B의 j번째 문자를 비교할 때,<br>• <strong>같으면</strong>: 이 문자를 공통 수열에 포함시키고, 양쪽 다 한 칸 앞으로<br>• <strong>다르면</strong>: A를 한 칸 줄이거나, B를 한 칸 줄이거나, 둘 중 나은 쪽<br><br>이걸 표로 정리하면 어떨까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][j]</code> = A의 처음 i글자와 B의 처음 j글자의 LCS 길이로 정의하면:<br><br>• <code>A[i] == B[j]</code>: 같은 문자 발견! → <code>dp[i][j] = dp[i-1][j-1] + 1</code><br>• <code>A[i] != B[j]</code>: 둘 중 나은 쪽 → <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code><br><br>0행, 0열은 모두 0 (빈 문자열과의 LCS = 0)<br>답: <code>dp[len(A)][len(B)]</code>' },
                { title: 'Python/C++에선 이렇게!', content: '1-indexed로 구현하면 경계 처리가 자연스러워요.<br><span class="lang-py"><code>dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]</code>로 초기화. <code>a[i-1] == b[j-1]</code>로 비교하면 0행/0열이 자동으로 0이 됩니다.</span><span class="lang-cpp"><code>int dp[1001][1001]</code>을 전역 선언하면 자동 0 초기화. <code>a[i-1] == b[j-1]</code>로 비교하세요. <code>string</code>으로 입력받으면 편합니다.</span>' }
            ],
            inputLabel: '(내장 예제 사용)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                var a = 'ACAYKP', b = 'CAPCAK';
                var m = a.length, n = b.length;
                var dp = [];
                for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
                for (var i = 1; i <= m; i++)
                    for (var j = 1; j <= n; j++)
                        if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
                        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                return '' + dp[m][n];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()\n\n# dp[i][j] = a[:i]와 b[:j]의 가장 긴 공통 수열 길이\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '2차원 DP',
                description: '같으면 대각선+1, 다르면 왼쪽/위쪽 max로 채웁니다.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '두 문자열을 한 줄씩 입력받습니다.\nstrip()으로 개행 문자를 제거합니다.', code: 'import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()' },
                        { title: 'DP 테이블 채우기', desc: '같은 문자면 대각선(dp[i-1][j-1])+1,\n다르면 왼쪽(dp[i][j-1])과 위쪽(dp[i-1][j]) 중 max.\n0행/0열은 모두 0 (빈 문자열과의 LCS).', code: 'dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]\nfor i in range(1, len(a)+1):\n    for j in range(1, len(b)+1):\n        if a[i-1] == b[j-1]:\n            dp[i][j] = dp[i-1][j-1] + 1\n        else:\n            dp[i][j] = max(dp[i-1][j], dp[i][j-1])' },
                        { title: '출력', desc: 'dp[len(a)][len(b)]가 LCS 길이입니다.', code: 'print(dp[len(a)][len(b)])' }
                    ],
                    cpp: [
                        { title: '입력', desc: '전역 2차원 배열로 DP 테이블 선언.\nstring으로 두 문자열을 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    int m = a.size(), n = b.size();' },
                        { title: 'DP 테이블 채우기', desc: '같으면 대각선+1 (공통 문자 발견), 다르면 왼쪽/위쪽 max.\n1-indexed로 구현하여 0행/0열 초기화 불필요.', code: '    // 같으면 대각선+1, 다르면 왼쪽/위쪽 max\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (a[i-1] == b[j-1])\n                dp[i][j] = dp[i-1][j-1] + 1;\n            else\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);\n        }\n    }' },
                        { title: '출력', desc: 'dp[m][n]이 두 문자열의 LCS 길이입니다.', code: '    cout << dp[m][n] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[13].templates; }
            }]
        },
        {
            id: 'boj-12865',
            title: 'BOJ 12865 - 평범한 배낭',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12865',
            simIntro: '1차원 DP 배열로 배낭 문제를 푸는 과정을 확인하세요.',
            descriptionHTML: `
    <h3>문제</h3>
    <p>준서가 여행에 필요하다고 생각하는 N개의 물건이 있다. 각 물건은 무게 W와 가치 V를 가진다. 배낭에 넣을 수 있는 물건들의 가치의 최댓값을 구하시오. 배낭 무게 제한은 K이다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>4 7
6 13
4 8
3 6
5 12</pre></div>
        <div><strong>출력</strong><pre>14</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 100</li><li>1 ≤ K ≤ 100,000</li><li>1 ≤ W ≤ 100,000</li><li>0 ≤ V ≤ 1,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '물건 N개 중에서 넣을 물건을 골라야 해요. 각 물건은 "넣거나" "안 넣거나" 두 가지 선택이니까, 모든 조합(2<sup>N</sup>가지)을 시도해볼까요? 무게 합이 K 이하인 조합 중 가치 합이 최대인 걸 고르면 되겠죠.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 100이면 2<sup>100</sup> = 약 10<sup>30</sup>... 전부 해보는 건 불가능해요!<br><br>그런데 생각해보면, i번째 물건을 고려할 때 중요한 건 <strong>지금까지 쓴 무게(남은 용량)</strong>뿐이에요. 같은 남은 용량이면, 어떤 물건 조합이든 앞으로의 최적 선택은 같을 테니까요. "이전 물건 수 + 현재 용량"을 상태로 잡으면 될 것 같아요!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][w]</code> = 처음 i개 물건까지 고려하고, 배낭 용량이 w일 때의 최대 가치<br><br>i번째 물건(무게 W[i], 가치 V[i])에 대해:<br>• 안 넣기: <code>dp[i-1][w]</code><br>• 넣기 (w &ge; W[i]일 때): <code>dp[i-1][w - W[i]] + V[i]</code><br><br><code>dp[i][w] = max(안 넣기, 넣기)</code><br><br>이것이 유명한 <strong>0/1 배낭 문제(Knapsack)</strong>입니다!' },
                { title: 'Python/C++에선 이렇게!', content: '2차원 배열 대신 <strong>1차원 배열로 공간 최적화</strong>할 수 있어요! 핵심: w를 <strong>역순</strong>으로 순회해야 같은 물건을 두 번 넣는 것을 방지합니다.<br><span class="lang-py"><code>dp = [0] * (K + 1)</code>로 1차원 배열 하나만. 각 물건마다 <code>for w in range(K, wi-1, -1):</code>로 역순 순회하면서 <code>dp[w] = max(dp[w], dp[w-wi] + vi)</code>를 갱신합니다.</span><span class="lang-cpp"><code>int dp[100001] = {0};</code>으로 선언. <code>for (int j = K; j &gt;= w; j--)</code>로 역순 순회합니다. K가 최대 10만이니 배열 크기에 주의하세요.</span>' }
            ],
            inputLabel: '(내장 예제 사용)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                var items = [[6,13],[4,8],[3,6],[5,12]];
                var K = 7;
                var dp = new Array(K + 1).fill(0);
                for (var idx = 0; idx < items.length; idx++) {
                    var w = items[idx][0], v = items[idx][1];
                    for (var j = K; j >= w; j--) dp[j] = Math.max(dp[j], dp[j - w] + v);
                }
                return '' + dp[K];
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][w] = i번째까지 고려, 용량 w일 때 최대 가치\n# 여기에 풀이를 작성하세요\n',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}'
            },
            solutions: [{
                approach: '1차원 DP (역순 순회)',
                description: '각 물건마다 dp 배열을 역순으로 갱신하여 공간을 최적화합니다.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N개 물건의 (무게, 가치) 쌍과 배낭 용량 K를 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: '1차원 DP (역순)', desc: '핵심: 역순 순회로 같은 물건을 두 번 넣는 것을 방지.\n순방향이면 dp[j-w]가 이미 갱신되어 중복 사용 발생.\ndp[j] = 용량 j일 때 최대 가치.', code: 'dp = [0] * (k + 1)\nfor w, v in items:\n    for j in range(k, w - 1, -1):\n        dp[j] = max(dp[j], dp[j-w] + v)' },
                        { title: '출력', desc: 'dp[k]가 배낭 용량 K 내 최대 가치입니다.', code: 'print(dp[k])' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'K가 최대 10만이므로 전역 배열 dp[100001] 사용.\nN과 K를 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;' },
                        { title: '1차원 DP (역순)', desc: '역순 순회: 같은 물건을 두 번 넣는 것을 방지', code: '    for (int i = 0; i < n; i++) {\n        int w, v;\n        cin >> w >> v;\n        // 역순으로 순회해야 같은 물건 중복 사용 방지\n        for (int j = k; j >= w; j--)\n            dp[j] = max(dp[j], dp[j-w] + v);\n    }' },
                        { title: '출력', desc: 'dp[k]가 배낭 용량 K 내 최대 가치입니다.', code: '    cout << dp[k] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return dpTopic.problems[14].templates; }
            }]
        }
    ],

    // ===== 유틸리티 =====
    _fib(n) {
        if (n <= 2) return 1;
        return this._fib(n - 1) + this._fib(n - 2);
    }
};

// 전역 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.dp = dpTopic;
