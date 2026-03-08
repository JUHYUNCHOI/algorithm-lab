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
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔽 위에서 아래로 (Top-Down)</h3>
                        <p class="approach-desc">재귀 + 결과 저장. 큰 문제에서 시작해서 필요할 때만 작은 문제를 풂</p>
                        <div class="code-block"><pre><code class="language-python">memo = {}
def fib(n):
    if n in memo:
        return memo[n]
    if n <= 2:
        return 1
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]</code></pre></div>
                    </div>
                    <div class="approach-card">
                        <h3>🔼 아래에서 위로 (Bottom-Up)</h3>
                        <p class="approach-desc">반복문 + 표 채우기. 작은 문제부터 차례로 채워나감</p>
                        <div class="code-block"><pre><code class="language-python">def fib(n):
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]</code></pre></div>
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
                        <span class="think-box-question-text">fib(5000)을 파이썬 Top-Down으로 풀면 무슨 문제가 생길까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        파이썬은 <strong>재귀 깊이 기본 제한이 1000</strong>입니다.<br>
                        fib(100)은 재귀 깊이 100이라 괜찮지만, fib(5000)이면 <code>RecursionError</code>로 터집니다!<br><br>
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
    // 시뮬레이션 1: 피보나치 수 1 (boj-24416)
    // ====================================================================
    _renderVizFib1(container) {
        var self = this, suffix = '-fib1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">fib(5) 호출 횟수: 재귀 vs DP</h3>' +
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
        var steps = [
            { description: 'fib(5)를 재귀로 호출하면 fib(1),fib(2)에 도달하는 횟수(리프 수)가 기본 연산 횟수입니다.',
              action: function() { infoEl.innerHTML = '재귀: fib(5)=fib(4)+fib(3), fib(4)=fib(3)+fib(2), ... 중복이 생깁니다.'; },
              undo: function() { infoEl.innerHTML = ''; } },
            { description: '재귀 fib(5)의 기본 연산 횟수 = fib(5) 값 = 5회',
              action: function() { recValEl.textContent = '5'; infoEl.innerHTML = '재귀 호출 트리의 리프(return 1) 개수 = <strong>5</strong>'; },
              undo: function() { recValEl.textContent = '?'; infoEl.innerHTML = ''; } },
            { description: 'DP는 for i=3..5, 총 3번의 덧셈으로 계산합니다.',
              action: function() { dpValEl.textContent = '3'; infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], dp[4]=dp[3]+dp[2], dp[5]=dp[4]+dp[3] → <strong>3번</strong>'; },
              undo: function() { dpValEl.textContent = '?'; } },
            { description: 'n=25이면? 재귀=75025, DP=23. 차이가 폭발적입니다!',
              action: function() { infoEl.innerHTML = '<strong style="color:var(--green);">n=25: 재귀 75,025회 vs DP 23회. DP가 3,262배 빠릅니다!</strong>'; },
              undo: function() { infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], dp[4]=dp[3]+dp[2], dp[5]=dp[4]+dp[3] → <strong>3번</strong>'; } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 신나는 함수 실행 (boj-9184)
    // ====================================================================
    _renderVizFun(container) {
        var self = this, suffix = '-fun';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">w(2,2,2) 메모이제이션</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">memo 테이블에 저장하면 중복 호출을 건너뜁니다.</p>' +
            '<div id="fun-log' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;font-size:0.85rem;min-height:60px;margin-bottom:12px;white-space:pre-line;"></div>' +
            self._createStepControls(suffix);
        var logEl = container.querySelector('#fun-log' + suffix);
        var lines = [];
        var steps = [
            { description: 'w(2,2,2) 호출 → memo에 없으므로 계산 시작',
              action: function() { lines.push('→ w(2,2,2) 호출'); logEl.textContent = lines.join('\n'); },
              undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
            { description: 'a<b<c가 아니므로 w(1,2,2)+w(1,1,2)+w(1,2,1)-w(1,1,1) 필요',
              action: function() { lines.push('  필요: w(1,2,2), w(1,1,2), w(1,2,1), w(1,1,1)'); logEl.textContent = lines.join('\n'); },
              undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
            { description: '하위 호출들이 memo에 저장되며 중복 제거',
              action: function() { lines.push('  w(1,1,1)=2 저장! w(1,2,1)=2 저장! w(1,1,2)=4 저장!'); logEl.textContent = lines.join('\n'); },
              undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
            { description: 'w(2,2,2) = 4+4+2-2 = 4 → memo에 저장!',
              action: function() { lines.push('← w(2,2,2) = 4 ✅ 저장!'); logEl.textContent = lines.join('\n'); },
              undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 1로 만들기 (boj-1463)
    // ====================================================================
    _renderViz1to(container) {
        var self = this, suffix = '-1to';
        var dp = [0,0,1,1,2,1,2,3,3,2,3];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">10 → 1 최소 연산</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = i를 1로 만드는 최소 횟수. 경로: 10→9→3→1</p>' +
            '<div id="to1-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="to1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#to1-cells' + suffix);
        var infoEl = container.querySelector('#to1-info' + suffix);
        for (var i = 1; i <= 10; i++) {
            cellsEl.innerHTML += '<div id="to1-c' + i + suffix + '" style="width:48px;text-align:center;padding:8px 4px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">' + i + '</div><div>?</div></div>';
        }
        function setCell(n, val, bg) { var c = container.querySelector('#to1-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = val; if(bg) c.style.background = bg;} }
        function resetCell(n) { var c = container.querySelector('#to1-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background = 'var(--bg2)';} }
        var steps = [
            { description: 'dp[1]=0: 이미 1이므로 연산 불필요',
              action: function() { setCell(1, '0', 'var(--accent)15'); infoEl.innerHTML = 'dp[1] = 0'; },
              undo: function() { resetCell(1); infoEl.innerHTML = ''; } },
            { description: 'dp[2]=1(-1또는/2), dp[3]=1(/3) 채우기',
              action: function() { setCell(2,'1','var(--accent)15'); setCell(3,'1','var(--accent)15'); infoEl.innerHTML = 'dp[2]=dp[1]+1=1, dp[3]=dp[1]+1=1'; },
              undo: function() { resetCell(2); resetCell(3); } },
            { description: 'dp[4]~dp[6]: 각각 최솟값 선택',
              action: function() { for(var k=4;k<=6;k++) setCell(k, dp[k], 'var(--accent)15'); infoEl.innerHTML = 'dp[4]=dp[2]+1=2, dp[5]=dp[4]+1=3→min(dp[4]+1)=min와 비교, dp[6]=dp[3]+1=2'; },
              undo: function() { for(var k=4;k<=6;k++) resetCell(k); } },
            { description: 'dp[7]~dp[9] 채우기',
              action: function() { for(var k=7;k<=9;k++) setCell(k, dp[k], 'var(--accent)15'); infoEl.innerHTML = 'dp[7]=3, dp[8]=3, dp[9]=dp[3]+1=2'; },
              undo: function() { for(var k=7;k<=9;k++) resetCell(k); } },
            { description: 'dp[10]=min(dp[9]+1, dp[5]+1)=3. 경로: 10→9→3→1',
              action: function() { setCell(10, '3', 'var(--green)'); setCell(9,'2','var(--green)'); setCell(3,'1','var(--green)'); setCell(1,'0','var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">✅ dp[10]=3, 경로: 10(-1)→9(÷3)→3(÷3)→1</strong>'; },
              undo: function() { setCell(10, dp[10], 'var(--accent)15'); setCell(9,dp[9],'var(--accent)15'); setCell(3,dp[3],'var(--accent)15'); setCell(1,'0','var(--accent)15'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 01타일 (boj-1904)
    // ====================================================================
    _renderVizTile(container) {
        var self = this, suffix = '-tile';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">01타일: 길이 N=4인 수열</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = dp[i-1] + dp[i-2] (피보나치와 동일!)</p>' +
            '<div id="tile-cells' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="tile-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#tile-cells' + suffix);
        var infoEl = container.querySelector('#tile-info' + suffix);
        for (var i = 1; i <= 5; i++) cellsEl.innerHTML += '<div id="tile-c' + i + suffix + '" style="width:56px;text-align:center;padding:8px;border-radius:8px;background:var(--bg2);font-weight:600;"><div style="font-size:0.7rem;color:var(--text3);">dp[' + i + ']</div><div>?</div></div>';
        function setTile(n, v, bg) { var c = container.querySelector('#tile-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = v; if(bg)c.style.background=bg;} }
        function resetTile(n) { var c = container.querySelector('#tile-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = '?'; c.style.background='var(--bg2)';} }
        var steps = [
            { description: 'dp[1]=1: "1" 한 가지', action: function() { setTile(1,'1','#6c5ce715'); infoEl.innerHTML = 'dp[1]=1 (수열: 1)'; }, undo: function() { resetTile(1); infoEl.innerHTML=''; } },
            { description: 'dp[2]=2: "11", "00" 두 가지', action: function() { setTile(2,'2','#6c5ce715'); infoEl.innerHTML = 'dp[2]=2 (수열: 11, 00)'; }, undo: function() { resetTile(2); } },
            { description: 'dp[3]=dp[2]+dp[1]=3', action: function() { setTile(3,'3','#6c5ce715'); infoEl.innerHTML = 'dp[3]=2+1=3 (111, 100, 001)'; }, undo: function() { resetTile(3); } },
            { description: 'dp[4]=dp[3]+dp[2]=5 → 정답!', action: function() { setTile(4,'5','var(--green)'); infoEl.innerHTML = '<strong style="color:var(--green);">✅ dp[4]=3+2=5 (1111,1100,1001,0011,0000)</strong>'; }, undo: function() { resetTile(4); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 계단 오르기 (boj-2579)
    // ====================================================================
    _renderVizStair(container) {
        var self = this, suffix = '-stair';
        var sc = [10,20,15,25,10,20];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">계단 오르기 (연속 3개 불가)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">점수: [10,20,15,25,10,20]</p>' +
            '<div id="st-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="st-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#st-cells' + suffix);
        var infoEl = container.querySelector('#st-info' + suffix);
        for (var i = 1; i <= 6; i++) cellsEl.innerHTML += '<div id="st-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + sc[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
        function setSt(n, v, bg) { var c = container.querySelector('#st-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:'+v; if(bg)c.style.background=bg;} }
        function resetSt(n) { var c = container.querySelector('#st-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent = 'dp:?'; c.style.background='var(--bg2)';} }
        var steps = [
            { description: 'dp[1]=10, dp[2]=30 (1→2)', action: function() { setSt(1,'10','#fdcb6e15'); setSt(2,'30','#fdcb6e15'); infoEl.innerHTML='dp[1]=10, dp[2]=10+20=30'; }, undo: function() { resetSt(1); resetSt(2); infoEl.innerHTML=''; } },
            { description: 'dp[3]=max(dp[1]+15, 20+15)=max(25,35)=35', action: function() { setSt(3,'35','#fdcb6e15'); infoEl.innerHTML='dp[3]=max(10+15, 20+15)=35'; }, undo: function() { resetSt(3); } },
            { description: 'dp[4]=max(dp[2]+25, dp[1]+15+25)=max(55,50)=55', action: function() { setSt(4,'55','#fdcb6e15'); infoEl.innerHTML='dp[4]=max(30+25, 10+15+25)=55'; }, undo: function() { resetSt(4); } },
            { description: 'dp[5]=max(dp[3]+10, dp[2]+25+10)=max(45,65)=65', action: function() { setSt(5,'65','#fdcb6e15'); infoEl.innerHTML='dp[5]=max(35+10, 30+25+10)=65'; }, undo: function() { resetSt(5); } },
            { description: 'dp[6]=max(dp[4]+20, dp[3]+10+20)=max(75,65)=75 ✅', action: function() { setSt(6,'75','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[6]=max(55+20, 35+10+20)=75</strong>'; }, undo: function() { resetSt(6); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 포도주 시식 (boj-2156)
    // ====================================================================
    _renderVizWine(container) {
        var self = this, suffix = '-wine';
        var w = [6,10,13,9,8,1];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">포도주 시식 (3연속 불가)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">잔: [6,10,13,9,8,1]. 안 마시는 선택도 가능!</p>' +
            '<div id="wn-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="wn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#wn-cells' + suffix);
        var infoEl = container.querySelector('#wn-info' + suffix);
        for (var i = 1; i <= 6; i++) cellsEl.innerHTML += '<div id="wn-c' + i + suffix + '" style="width:56px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + w[i-1] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
        function setWn(n,v,bg) { var c = container.querySelector('#wn-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
        function resetWn(n) { var c = container.querySelector('#wn-c' + n + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
        var steps = [
            { description: 'dp[1]=6, dp[2]=16', action: function() { setWn(1,'6','#00b89415'); setWn(2,'16','#00b89415'); infoEl.innerHTML='dp[1]=6, dp[2]=6+10=16'; }, undo: function() { resetWn(1); resetWn(2); infoEl.innerHTML=''; } },
            { description: 'dp[3]=max(dp[2], dp[1]+13, 10+13)=max(16,19,23)=23', action: function() { setWn(3,'23','#00b89415'); infoEl.innerHTML='dp[3]=max(16, 6+13, 10+13)=23'; }, undo: function() { resetWn(3); } },
            { description: 'dp[4]=max(23, 16+9, 6+13+9)=max(23,25,28)=28', action: function() { setWn(4,'28','#00b89415'); infoEl.innerHTML='dp[4]=max(23, 16+9, 6+13+9)=28'; }, undo: function() { resetWn(4); } },
            { description: 'dp[5]=max(28, 23+8, 16+9+8)=max(28,31,33)=33', action: function() { setWn(5,'33','#00b89415'); infoEl.innerHTML='dp[5]=max(28, 23+8, 16+9+8)=33'; }, undo: function() { resetWn(5); } },
            { description: 'dp[6]=max(33, 28+1, 23+8+1)=max(33,29,32)=33 ✅', action: function() { setWn(6,'33','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ dp[6]=max(33, 29, 32)=33</strong>'; }, undo: function() { resetWn(6); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 7: 연속합 (boj-1912)
    // ====================================================================
    _renderVizMaxSub(container) {
        var self = this, suffix = '-maxsub';
        var a = [10,-4,3,1,5,6,-35,12,21,-1];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">연속합 (카데인 알고리즘)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[10,-4,3,1,5,6,-35,12,21,-1]</p>' +
            '<div id="ms-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="ms-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#ms-cells' + suffix);
        var infoEl = container.querySelector('#ms-info' + suffix);
        for (var i = 0; i < a.length; i++) cellsEl.innerHTML += '<div id="ms-c' + i + suffix + '" style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">?</div></div>';
        function setMs(i,v,bg) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
        function resetMs(i) { var c = container.querySelector('#ms-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
        var cur = [10,6,9,10,15,21,-14,12,33,32];
        var steps = [
            { description: 'dp[0]=10 (첫 원소로 시작)', action: function() { setMs(0,'10','#d6303115'); infoEl.innerHTML='cur=10, ans=10'; }, undo: function() { resetMs(0); infoEl.innerHTML=''; } },
            { description: 'i=1~5: 이어붙이기가 유리 → cur 증가', action: function() { for(var k=1;k<=5;k++) setMs(k,cur[k],'#d6303115'); infoEl.innerHTML='max(6+(-4),-4)=6, ..., cur=21, ans=21'; }, undo: function() { for(var k=1;k<=5;k++) resetMs(k); } },
            { description: 'i=6: -35를 만나 cur이 음수로 추락', action: function() { setMs(6,'-14','var(--bg2)'); infoEl.innerHTML='max(21+(-35),-35)=-14. 하지만 ans는 21 유지!'; }, undo: function() { resetMs(6); } },
            { description: 'i=7~8: 새로 시작! 12→33으로 급등', action: function() { setMs(7,'12','#d6303115'); setMs(8,'33','var(--green)'); infoEl.innerHTML='12에서 새출발, 12+21=33 → ans 갱신!'; }, undo: function() { resetMs(7); resetMs(8); } },
            { description: 'i=9: 33+(-1)=32. 최종 답=33 ✅', action: function() { setMs(9,'32','#d6303115'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최대 연속합 = 33 (구간: [12,21])</strong>'; }, undo: function() { resetMs(9); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 8: 쉬운 계단 수 (boj-10844)
    // ====================================================================
    _renderVizEasyStair(container) {
        var self = this, suffix = '-estair';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">쉬운 계단 수: 길이 2</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">dp[길이][끝자리]: 끝자리 j에서 j-1, j+1로 전이</p>' +
            '<div id="es-grid' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="es-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#es-grid' + suffix);
        var infoEl = container.querySelector('#es-info' + suffix);
        for (var j = 0; j <= 9; j++) gridEl.innerHTML += '<div id="es-c' + j + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">끝=' + j + '</div><div style="font-weight:600;">?</div></div>';
        function setEs(j,v,bg) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
        function resetEs(j) { var c = container.querySelector('#es-c' + j + suffix); if(c){c.querySelector('div:last-child').textContent='?'; c.style.background='var(--bg2)';} }
        var steps = [
            { description: '길이 1: dp[1][1~9]=1, dp[1][0]=0 (0으로 시작 불가)', action: function() { setEs(0,'0','var(--bg2)'); for(var j=1;j<=9;j++) setEs(j,'1','#0984e315'); infoEl.innerHTML='길이 1인 계단수: 1,2,...,9 (9개)'; }, undo: function() { for(var j=0;j<=9;j++) resetEs(j); infoEl.innerHTML=''; } },
            { description: '길이 2: dp[2][0]=dp[1][1]=1, dp[2][9]=dp[1][8]=1', action: function() { setEs(0,'1','#0984e315'); setEs(9,'1','#0984e315'); infoEl.innerHTML='끝0←1에서만, 끝9←8에서만'; }, undo: function() { setEs(0,'0','var(--bg2)'); setEs(9,'1','#0984e315'); } },
            { description: 'dp[2][1~8]=dp[1][j-1]+dp[1][j+1]=2', action: function() { for(var j=1;j<=8;j++) setEs(j,'2','#0984e315'); infoEl.innerHTML='끝1~8은 양쪽에서 옴 → 각 2개'; }, undo: function() { for(var j=1;j<=8;j++) setEs(j,'1','#0984e315'); } },
            { description: '합계: 1+2*8+1=17. 길이 2인 계단수=17개 ✅', action: function() { infoEl.innerHTML='<strong style="color:var(--green);">✅ 길이 2 계단수 = 1+2+2+2+2+2+2+2+2+1 = 17개</strong>'; }, undo: function() { infoEl.innerHTML='끝1~8은 양쪽에서 옴 → 각 2개'; } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 9: RGB거리 (boj-1149)
    // ====================================================================
    _renderVizRGB(container) {
        var self = this, suffix = '-rgb';
        var costs = [[26,40,83],[49,60,57],[13,89,99]];
        var colors = ['R','G','B'];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">RGB거리: 3집 최소 비용</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">비용: [26,40,83], [49,60,57], [13,89,99]. 이웃은 다른 색!</p>' +
            '<div id="rgb-grid' + suffix + '" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:300px;margin:0 auto 12px;"></div>' +
            '<div id="rgb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#rgb-grid' + suffix);
        var infoEl = container.querySelector('#rgb-info' + suffix);
        for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) gridEl.innerHTML += '<div id="rgb-' + i + '-' + j + suffix + '" style="padding:8px;text-align:center;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">집' + (i+1) + colors[j] + '</div><div style="font-weight:600;">' + costs[i][j] + '</div></div>';
        function setRgb(i,j,txt,bg) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){if(txt)c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
        function resetRgb(i,j) { var c = container.querySelector('#rgb-' + i + '-' + j + suffix); if(c){c.querySelector('div:last-child').textContent=costs[i][j]; c.style.background='var(--bg2)';} }
        var steps = [
            { description: '집1: dp[1][R]=26, dp[1][G]=40, dp[1][B]=83', action: function() { setRgb(0,0,'26','#e8439315'); setRgb(0,1,'40','#e8439315'); setRgb(0,2,'83','#e8439315'); infoEl.innerHTML='첫 집은 그대로 비용'; }, undo: function() { resetRgb(0,0); resetRgb(0,1); resetRgb(0,2); infoEl.innerHTML=''; } },
            { description: '집2: R=min(G1,B1)+49=min(40,83)+49=89', action: function() { setRgb(1,0,'89','#e8439315'); setRgb(1,1,'86','#e8439315'); setRgb(1,2,'83','#e8439315'); infoEl.innerHTML='dp[2][R]=89, dp[2][G]=min(26,83)+60=86, dp[2][B]=min(26,40)+57=83'; }, undo: function() { resetRgb(1,0); resetRgb(1,1); resetRgb(1,2); } },
            { description: '집3: R=min(86,83)+13=96', action: function() { setRgb(2,0,'96','#e8439315'); setRgb(2,1,'172','#e8439315'); setRgb(2,2,'185','#e8439315'); infoEl.innerHTML='dp[3][R]=min(86,83)+13=96, dp[3][G]=min(89,83)+89=172, dp[3][B]=min(89,86)+99=185'; }, undo: function() { resetRgb(2,0); resetRgb(2,1); resetRgb(2,2); } },
            { description: 'min(96,172,185)=96. 경로: R→B→R',
              action: function() { setRgb(0,0,'26','var(--green)'); setRgb(1,2,'83','var(--green)'); setRgb(2,0,'96','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최소 비용=96 (R→B→R: 26+57+13)</strong>'; },
              undo: function() { setRgb(0,0,'26','#e8439315'); setRgb(1,2,'83','#e8439315'); setRgb(2,0,'96','#e8439315'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 10: 정수 삼각형 (boj-1932)
    // ====================================================================
    _renderVizTriangle(container) {
        var self = this, suffix = '-tri';
        var tri = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">정수 삼각형: 아래→위 최대 경로</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">아래에서 위로 올라가며 최대 합을 구합니다.</p>' +
            '<div id="tri-grid' + suffix + '" style="text-align:center;margin-bottom:12px;"></div>' +
            '<div id="tri-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#tri-grid' + suffix);
        var infoEl = container.querySelector('#tri-info' + suffix);
        var html = '';
        for (var i = 0; i < 5; i++) {
            html += '<div style="display:flex;justify-content:center;gap:4px;margin-bottom:4px;">';
            for (var j = 0; j <= i; j++) html += '<div id="tri-' + i + '-' + j + suffix + '" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + tri[i][j] + '</div>';
            html += '</div>';
        }
        gridEl.innerHTML = html;
        function setTri(i,j,v,bg) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }
        function resetTri(i,j) { var c = container.querySelector('#tri-' + i + '-' + j + suffix); if(c){c.textContent=tri[i][j]; c.style.background='var(--bg2)';} }
        var steps = [
            { description: '5행(맨 아래)은 그대로: [4,5,2,6,5]',
              action: function() { for(var j=0;j<5;j++) setTri(4,j,tri[4][j],'#fab1a015'); infoEl.innerHTML='맨 아래 행은 초기값 그대로'; },
              undo: function() { for(var j=0;j<5;j++) resetTri(4,j); infoEl.innerHTML=''; } },
            { description: '4행: dp[3][j] += max(dp[4][j], dp[4][j+1])',
              action: function() { setTri(3,0,'6','#fab1a015'); setTri(3,1,'12','#fab1a015'); setTri(3,2,'10','#fab1a015'); setTri(3,3,'10','#fab1a015'); infoEl.innerHTML='2+max(4,5)=7→실은 dp[3][0]=2+5=7 아니, 정정: dp[3][0]=max(4,5)+2=7, dp[3][1]=max(5,2)+7=12, dp[3][2]=max(2,6)+4=10, dp[3][3]=max(6,5)+4=10'; },
              undo: function() { for(var j=0;j<4;j++) resetTri(3,j); } },
            { description: '3행,2행: 같은 방식으로 올라감',
              action: function() { setTri(2,0,'20','#fab1a015'); setTri(2,1,'13','#fab1a015'); setTri(2,2,'10','#fab1a015'); setTri(1,0,'23','#fab1a015'); setTri(1,1,'21','#fab1a015'); infoEl.innerHTML='3행: 8+max(7,12)=20, 1+max(12,10)=13, 0+max(10,10)=10<br>2행: 3+max(20,13)=23, 8+max(13,10)=21'; },
              undo: function() { resetTri(2,0); resetTri(2,1); resetTri(2,2); resetTri(1,0); resetTri(1,1); } },
            { description: '1행: dp[0][0] = 7 + max(23,21) = 30 ✅',
              action: function() { setTri(0,0,'30','var(--green)'); setTri(1,0,'23','var(--green)'); setTri(2,0,'20','var(--green)'); setTri(3,1,'12','var(--green)'); setTri(4,1,'5','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최대 합 = 30 (경로: 7→3→8→7→5)</strong>'; },
              undo: function() { setTri(0,0,'7','var(--bg2)'); setTri(1,0,'23','#fab1a015'); setTri(2,0,'20','#fab1a015'); setTri(3,1,'12','#fab1a015'); setTri(4,1,tri[4][1],'#fab1a015'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 11: 가장 긴 증가하는 부분 수열 (boj-11053)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var a = [10,20,10,30,20,50];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS: [10,20,10,30,20,50]</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">dp[i] = a[i]로 끝나는 가장 긴 증가 수열 길이</p>' +
            '<div id="lis-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#lis-cells' + suffix);
        var infoEl = container.querySelector('#lis-info' + suffix);
        for (var i = 0; i < 6; i++) cellsEl.innerHTML += '<div id="lis-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.7rem;color:var(--text3);">dp:?</div></div>';
        function setLis(i,v,bg) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
        function resetLis(i) { var c = container.querySelector('#lis-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
        var steps = [
            { description: 'dp[0]=1: 첫 원소 10은 자기만으로 길이 1',
              action: function() { setLis(0,'1','#74b9ff15'); infoEl.innerHTML='dp[0]=1 (수열: {10})'; },
              undo: function() { resetLis(0); infoEl.innerHTML=''; } },
            { description: 'dp[1]=2: 10<20이므로 dp[0]+1=2',
              action: function() { setLis(1,'2','#74b9ff15'); infoEl.innerHTML='a[0]=10 < a[1]=20 → dp[1]=dp[0]+1=2 (수열: {10,20})'; },
              undo: function() { resetLis(1); } },
            { description: 'dp[2]=1: 10 앞에 더 작은 수 없음',
              action: function() { setLis(2,'1','#74b9ff15'); infoEl.innerHTML='a[2]=10, 앞에 10보다 작은 수 없음 → dp[2]=1'; },
              undo: function() { resetLis(2); } },
            { description: 'dp[3]=3: 10<30, 20<30 → max(dp[0],dp[1])+1=3',
              action: function() { setLis(3,'3','#74b9ff15'); infoEl.innerHTML='a[3]=30 > a[0],a[1] → dp[3]=max(1,2)+1=3 (수열: {10,20,30})'; },
              undo: function() { resetLis(3); } },
            { description: 'dp[4]=2, dp[5]=4. LIS 길이=4: {10,20,30,50} ✅',
              action: function() { setLis(4,'2','#74b9ff15'); setLis(5,'4','var(--green)'); setLis(0,'1','var(--green)'); setLis(1,'2','var(--green)'); setLis(3,'3','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ LIS 길이 = 4: {10, 20, 30, 50}</strong>'; },
              undo: function() { resetLis(4); resetLis(5); setLis(0,'1','#74b9ff15'); setLis(1,'2','#74b9ff15'); setLis(3,'3','#74b9ff15'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 12: 가장 긴 바이토닉 부분 수열 (boj-11054)
    // ====================================================================
    _renderVizBitonic(container) {
        var self = this, suffix = '-bito';
        var a = [1,5,2,1,4,3,4,5,2,1];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">바이토닉 수열: LIS + LDS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[1,5,2,1,4,3,4,5,2,1]. lis[i]+lds[i]-1의 최대</p>' +
            '<div id="bi-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="bi-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#bi-cells' + suffix);
        var infoEl = container.querySelector('#bi-info' + suffix);
        for (var i = 0; i < 10; i++) cellsEl.innerHTML += '<div id="bi-c' + i + suffix + '" style="width:44px;text-align:center;padding:4px 2px;border-radius:6px;background:var(--bg2);font-size:0.8rem;"><div style="font-weight:600;">' + a[i] + '</div><div style="font-size:0.6rem;color:var(--text3);">?/?</div></div>';
        function setBi(i,txt,bg) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent=txt; if(bg)c.style.background=bg;} }
        function resetBi(i) { var c = container.querySelector('#bi-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='?/?'; c.style.background='var(--bg2)';} }
        var lis = [1,2,1,1,2,2,3,4,2,1];
        var lds = [1,4,2,1,3,2,2,3,2,1];
        var steps = [
            { description: 'LIS 배열 (왼→우 증가): [1,2,1,1,2,2,3,4,2,1]',
              action: function() { for(var i=0;i<10;i++) setBi(i,'L:'+lis[i],'#a29bfe15'); infoEl.innerHTML='lis[7]=4가 최대 (수열 {1,4,4,5} or {1,2,3,5} 등)'; },
              undo: function() { for(var i=0;i<10;i++) resetBi(i); infoEl.innerHTML=''; } },
            { description: 'LDS 배열 (우→좌 증가 = 해당 위치에서 시작하는 감소 수열 길이)',
              action: function() { for(var i=0;i<10;i++) setBi(i,lis[i]+'/'+lds[i],'#a29bfe15'); infoEl.innerHTML='lds[1]=4 (5→4→2→1 등)'; },
              undo: function() { for(var i=0;i<10;i++) setBi(i,'L:'+lis[i],'#a29bfe15'); } },
            { description: 'lis[i]+lds[i]-1 계산: 각 위치를 꼭짓점으로 한 바이토닉 길이',
              action: function() { var sums=[1,5,2,1,4,3,4,6,3,1]; for(var i=0;i<10;i++) setBi(i,sums[i],(sums[i]>=5?'#a29bfe30':'#a29bfe15')); infoEl.innerHTML='합: [1,5,2,1,4,3,4,<strong>6</strong>,3,1] → i=7이 최대'; },
              undo: function() { for(var i=0;i<10;i++) setBi(i,lis[i]+'/'+lds[i],'#a29bfe15'); } },
            { description: 'i=7(값=5)이 꼭짓점: {1,4,4,5,2,1} → 길이 7 ✅',
              action: function() { var path=[0,4,6,7,8,9]; for(var i=0;i<10;i++) setBi(i,a[i],'var(--bg2)'); for(var k=0;k<path.length;k++) setBi(path[k],a[path[k]],'var(--green)'); setBi(5,a[5],'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최장 바이토닉 = 7: {1,4,3,4,5,2,1}</strong>'; },
              undo: function() { var sums=[1,5,2,1,4,3,4,6,3,1]; for(var i=0;i<10;i++) setBi(i,sums[i],(sums[i]>=5?'#a29bfe30':'#a29bfe15')); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 13: 전깃줄 (boj-2565)
    // ====================================================================
    _renderVizWire(container) {
        var self = this, suffix = '-wire';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">전깃줄: A 정렬 후 B의 LIS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">A 기준 정렬: B=[2,8,9,1,4,6,7,10]. LIS 길이를 구한 뒤 N-LIS</p>' +
            '<div id="wr-cells' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="wr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#wr-cells' + suffix);
        var infoEl = container.querySelector('#wr-info' + suffix);
        var b = [2,8,9,1,4,6,7,10];
        var apos = [1,2,3,4,6,7,9,10];
        for (var i = 0; i < 8; i++) cellsEl.innerHTML += '<div id="wr-c' + i + suffix + '" style="width:52px;text-align:center;padding:6px;border-radius:8px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">A=' + apos[i] + '</div><div style="font-weight:600;">B=' + b[i] + '</div><div style="font-size:0.65rem;color:var(--text3);">dp:?</div></div>';
        function setWr(i,v,bg) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:'+v; if(bg)c.style.background=bg;} }
        function resetWr(i) { var c = container.querySelector('#wr-c' + i + suffix); if(c){c.querySelector('div:last-child').textContent='dp:?'; c.style.background='var(--bg2)';} }
        var dpv = [1,2,3,1,2,3,4,5];
        var steps = [
            { description: 'A 기준 정렬 완료. B 배열에서 LIS를 구합니다.',
              action: function() { infoEl.innerHTML='B = [2, 8, 9, 1, 4, 6, 7, 10]. 이 배열에서 LIS를 구하면 됩니다.'; },
              undo: function() { infoEl.innerHTML=''; } },
            { description: 'dp[0]=1, dp[1]=2(2<8), dp[2]=3(2<8<9)',
              action: function() { for(var k=0;k<3;k++) setWr(k,dpv[k],'#55efc415'); infoEl.innerHTML='B[0]=2→1, B[1]=8→2, B[2]=9→3'; },
              undo: function() { for(var k=0;k<3;k++) resetWr(k); } },
            { description: 'dp[3]=1(새출발), dp[4~6]: 4→6→7 증가, dp[7]=5',
              action: function() { for(var k=3;k<8;k++) setWr(k,dpv[k],'#55efc415'); infoEl.innerHTML='dp = [1,2,3,1,2,3,4,5]. LIS 길이 = 5'; },
              undo: function() { for(var k=3;k<8;k++) resetWr(k); } },
            { description: 'LIS=5 (교차 안 하는 최대 줄 수). 제거 = 8-5 = 3 ✅',
              action: function() { setWr(0,dpv[0],'var(--green)'); setWr(4,dpv[4],'var(--green)'); setWr(5,dpv[5],'var(--green)'); setWr(6,dpv[6],'var(--green)'); setWr(7,dpv[7],'var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ LIS=5, 제거할 전깃줄 = 8-5 = 3개</strong>'; },
              undo: function() { for(var k=0;k<8;k++) setWr(k,dpv[k],'#55efc415'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 14: LCS (boj-9251)
    // ====================================================================
    _renderVizLCS(container) {
        var self = this, suffix = '-lcs';
        var a = 'ACAYKP', b = 'CAPCAK';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LCS: ACAYKP vs CAPCAK</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">dp[i][j] = A[:i]와 B[:j]의 최장 공통 부분수열 길이</p>' +
            '<div id="lcs-grid' + suffix + '" style="overflow-x:auto;margin-bottom:12px;"></div>' +
            '<div id="lcs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#lcs-grid' + suffix);
        var infoEl = container.querySelector('#lcs-info' + suffix);
        var tbl = '<table style="border-collapse:collapse;margin:0 auto;font-size:0.75rem;"><tr><td></td><td style="padding:4px;font-weight:600;">""</td>';
        for (var j = 0; j < 6; j++) tbl += '<td style="padding:4px;font-weight:600;">' + b[j] + '</td>';
        tbl += '</tr>';
        tbl += '<tr><td style="padding:4px;font-weight:600;">""</td>';
        for (var j = 0; j <= 6; j++) tbl += '<td id="lcs-0-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">0</td>';
        tbl += '</tr>';
        for (var i = 1; i <= 6; i++) {
            tbl += '<tr><td style="padding:4px;font-weight:600;">' + a[i-1] + '</td>';
            for (var j = 0; j <= 6; j++) tbl += '<td id="lcs-' + i + '-' + j + suffix + '" style="padding:4px 6px;border:1px solid var(--border);text-align:center;">' + (j===0?'0':'?') + '</td>';
            tbl += '</tr>';
        }
        tbl += '</table>';
        gridEl.innerHTML = tbl;
        function setLcs(i,j,v,bg) { var c = container.querySelector('#lcs-' + i + '-' + j + suffix); if(c){c.textContent=v; if(bg)c.style.background=bg;} }
        var steps = [
            { description: '1행: A[1]=A vs B. 같은 글자(A)에서 +1',
              action: function() { var r=[0,0,1,1,1,1,1]; for(var j=1;j<=6;j++) setLcs(1,j,r[j],'#fd79a815'); infoEl.innerHTML='A=A→대각선+1=1, 나머지는 왼/위 max'; },
              undo: function() { for(var j=1;j<=6;j++) setLcs(1,j,'?',''); infoEl.innerHTML=''; } },
            { description: '2행: A[2]=C vs B. C=C에서 +1',
              action: function() { var r=[0,1,1,1,2,2,2]; for(var j=1;j<=6;j++) setLcs(2,j,r[j],'#fd79a815'); infoEl.innerHTML='j=1: C=C→1, j=4: C=C→dp[1][3]+1=2'; },
              undo: function() { for(var j=1;j<=6;j++) setLcs(2,j,'?',''); } },
            { description: '3~4행: A, Y',
              action: function() { var r3=[0,1,2,2,2,3,3]; var r4=[0,1,2,2,2,3,3]; for(var j=1;j<=6;j++){setLcs(3,j,r3[j],'#fd79a815'); setLcs(4,j,r4[j],'#fd79a815');} infoEl.innerHTML='3행(A): j=2,5에서 +1. 4행(Y): Y가 B에 없어 변화 없음'; },
              undo: function() { for(var j=1;j<=6;j++){setLcs(3,j,'?',''); setLcs(4,j,'?','');} } },
            { description: '5~6행: K, P',
              action: function() { var r5=[0,1,2,2,2,3,4]; var r6=[0,1,2,3,3,3,4]; for(var j=1;j<=6;j++){setLcs(5,j,r5[j],'#fd79a815'); setLcs(6,j,r6[j],'#fd79a815');} infoEl.innerHTML='5행(K): j=6에서 K=K→+1=4. 6행(P): j=3에서 P=P→+1=3'; },
              undo: function() { for(var j=1;j<=6;j++){setLcs(5,j,'?',''); setLcs(6,j,'?','');} } },
            { description: 'dp[6][6]=4. LCS 길이=4: ACAK ✅',
              action: function() { setLcs(6,6,'4','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ LCS 길이 = 4 (ACAK)</strong>'; },
              undo: function() { var r6=[0,1,2,3,3,3,4]; setLcs(6,6,r6[6],'#fd79a815'); } }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 15: 평범한 배낭 (boj-12865)
    // ====================================================================
    _renderVizKnapsack(container) {
        var self = this, suffix = '-knap';
        var items = [{w:6,v:13},{w:4,v:8},{w:3,v:6},{w:5,v:12}];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">0/1 배낭: 용량 7</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">물건: (6kg,13), (4kg,8), (3kg,6), (5kg,12). 1차원 DP로 풀기</p>' +
            '<div id="kn-cells' + suffix + '" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div id="kn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var cellsEl = container.querySelector('#kn-cells' + suffix);
        var infoEl = container.querySelector('#kn-info' + suffix);
        for (var w = 0; w <= 7; w++) cellsEl.innerHTML += '<div id="kn-c' + w + suffix + '" style="width:44px;text-align:center;padding:6px;border-radius:6px;background:var(--bg2);font-size:0.85rem;"><div style="font-size:0.65rem;color:var(--text3);">w=' + w + '</div><div style="font-weight:600;">0</div></div>';
        function setKn(w,v,bg) { var c = container.querySelector('#kn-c' + w + suffix); if(c){c.querySelector('div:last-child').textContent=v; if(bg)c.style.background=bg;} }
        function resetKn() { for(var w=0;w<=7;w++) { var c = container.querySelector('#kn-c' + w + suffix); if(c){c.querySelector('div:last-child').textContent='0'; c.style.background='var(--bg2)';} } }
        var steps = [
            { description: '물건1 (6kg, 가치13): w=7→13, w=6→13',
              action: function() { setKn(6,'13','#636e7215'); setKn(7,'13','#636e7215'); infoEl.innerHTML='dp[6]=max(0, dp[0]+13)=13, dp[7]=max(0, dp[1]+13)=13'; },
              undo: function() { resetKn(); infoEl.innerHTML=''; } },
            { description: '물건2 (4kg, 가치8): w=4→8, w=7→max(13,8)=13',
              action: function() { setKn(4,'8','#636e7215'); setKn(5,'8','#636e7215'); infoEl.innerHTML='dp[4]=8, dp[5]=8. dp[6],dp[7]은 기존 13이 더 큼 → 유지'; },
              undo: function() { setKn(4,'0','var(--bg2)'); setKn(5,'0','var(--bg2)'); } },
            { description: '물건3 (3kg, 가치6): dp[7]=max(13, dp[4]+6)=14!',
              action: function() { setKn(3,'6','#636e7215'); setKn(7,'14','#636e7230'); infoEl.innerHTML='dp[3]=6, dp[7]=max(13, dp[4]+6)=max(13,14)=<strong>14</strong> 갱신!'; },
              undo: function() { setKn(3,'0','var(--bg2)'); setKn(7,'13','#636e7215'); } },
            { description: '물건4 (5kg, 가치12): dp[5~7] 확인하지만 갱신 없음',
              action: function() { infoEl.innerHTML='dp[5]=max(8, dp[0]+12)=12→갱신! dp[6]=max(13,dp[1]+12)=13, dp[7]=max(14,dp[2]+12)=14 유지'; setKn(5,'12','#636e7215'); },
              undo: function() { setKn(5,'8','#636e7215'); } },
            { description: 'dp[7]=14. 물건2(4kg)+물건3(3kg) 선택! ✅',
              action: function() { setKn(7,'14','var(--green)'); infoEl.innerHTML='<strong style="color:var(--green);">✅ 최대 가치 = 14 (물건2: 4kg+8 + 물건3: 3kg+6 = 7kg, 14)</strong>'; },
              undo: function() { setKn(7,'14','#636e7230'); } }
        ];
        self._initStepController(container, steps, suffix);
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
            descriptionHTML: '<h3>문제</h3><p>오늘도 서준이는 동적 프로그래밍 수업 조교를 하고 있다.</p><p>재귀 호출로 피보나치 수를 구하는 코드와, 동적 프로그래밍으로 피보나치 수를 구하는 코드에서 각각 <strong>기본 연산의 실행 횟수</strong>를 구해보자.</p><div class="problem-codes"><div class="problem-code-block"><h4>코드 1: 재귀</h4><pre><code class="language-cpp">fib(n) {\n    if (n == 1 || n == 2)\n        return 1;  // 기본 연산\n    return fib(n-1) + fib(n-2);\n}</code></pre></div><div class="problem-code-block"><h4>코드 2: DP</h4><pre><code class="language-cpp">fib(n) {\n    f[1] = f[2] = 1;\n    for (i = 3; i <= n; i++)\n        f[i] = f[i-1] + f[i-2]; // 기본 연산\n    return f[n];\n}</code></pre></div></div><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 n이 주어진다. (5 ≤ n ≤ 40)</p></div><div><h4>출력</h4><p>재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 공백으로 구분하여 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5</pre></div><div><strong>출력</strong><pre>5 3</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '이 문제는 두 코드의 "기본 연산" 횟수를 세는 문제입니다. 각 코드에서 기본 연산이 어떤 줄인지 주석을 확인해보세요.' },
                { title: '재귀의 기본 연산', content: '재귀에서 기본 연산은 <code>return 1</code>입니다. 이것은 리프 노드에 도달한 횟수, 즉 <code>fib(n)</code>의 값 자체와 같습니다.' },
                { title: 'DP의 기본 연산', content: 'DP에서 기본 연산은 <code>f[i] = f[i-1] + f[i-2]</code>입니다. for문이 i=3부터 i=n까지 돌므로 총 <code>n - 2</code>번 실행됩니다.' },
                { title: '구현 팁', content: '재귀 fib(n)을 직접 구현하여 값을 구하고, DP 횟수는 단순히 <code>n - 2</code>를 출력하면 됩니다. n이 최대 40이므로 재귀도 시간 내에 동작합니다.' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 5, inputMax: 40, inputDefault: 5,
            solve(n) {
                function fibRec(n) { if (n <= 2) return 1; return fibRec(n-1) + fibRec(n-2); }
                return fibRec(n) + ' ' + (n - 2);
            },
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# 여기에 풀이를 작성하세요\n# 재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 구하세요\n',
                cpp: '#include <iostream>\nusing namespace std;\n\n// 여기에 풀이를 작성하세요\n\nint main() {\n    int n;\n    cin >> n;\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    // 여기에 풀이를 작성하세요\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n    }\n}'
            },
            solutions: [{
                approach: '재귀 fib + 단순 계산',
                description: '재귀 fib(n)의 값이 곧 재귀 기본 연산 수이고, DP는 n-2번입니다.',
                timeComplexity: 'O(2^n) 재귀 / O(n) DP',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: '재귀 함수 정의', code: 'import sys\ninput = sys.stdin.readline\n\ndef fib(n):\n    if n == 1 or n == 2:\n        return 1\n    return fib(n-1) + fib(n-2)' },
                        { title: '입력 받기', code: 'n = int(input())' },
                        { title: '결과 출력', code: 'print(fib(n), n - 2)' }
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
            descriptionHTML: '<h3>문제</h3><p>다음과 같은 재귀 함수 w(a, b, c)가 있다.</p><div class="problem-code-block"><h4>재귀 함수 w</h4><pre><code class="language-cpp">if a <= 0 or b <= 0 or c <= 0, return 1\nif a > 20 or b > 20 or c > 20, return w(20, 20, 20)\nif a < b and b < c, return w(a, b, c-1) + w(a, b-1, c-1) - w(a, b-1, c)\notherwise, return w(a-1, b, c) + w(a-1, b-1, c) + w(a-1, b, c-1) - w(a-1, b-1, c-1)</code></pre></div><p>이 함수를 구현하면 매우 느리다. 한 번 계산한 값을 저장해두는 방법(메모이제이션)을 적용하여 빠르게 동작하도록 하라.</p><div class="problem-io"><div><h4>입력</h4><p>각 줄에 a, b, c가 주어진다. (끝은 -1 -1 -1)</p></div><div><h4>출력</h4><p>각 입력에 대해 w(a, b, c)의 값을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>1 1 1\n2 2 2\n-1 -1 -1</pre></div><div><strong>출력</strong><pre>w(1, 1, 1) = 2\nw(2, 2, 2) = 4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '이 문제는 재귀 함수가 이미 주어져 있습니다. 그대로 구현하되 <strong>한 번 계산한 값을 저장하는 방법</strong>만 추가하면 됩니다. 3차원 배열이나 딕셔너리를 사용하세요.' },
                { title: '칸의 의미', content: '<code>dp[a][b][c]</code> = w(a, b, c)의 결과값. a, b, c가 0~20 범위이므로 <code>dp[21][21][21]</code> 크기면 충분합니다.' },
                { title: '계산 규칙', content: '문제에서 주어진 조건 그대로:<br>• a,b,c 중 하나가 ≤ 0이면 1<br>• 하나라도 > 20이면 w(20,20,20)<br>• a < b < c이면 w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)<br>• 나머지: w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)' },
                { title: '구현 팁', content: '함수 시작에서 <code>dp[a][b][c]</code>에 이미 값이 있는지 확인하고, 있으면 바로 리턴합니다. 출력 형식에 주의: <code>w(a, b, c) = 결과</code> 형태입니다.' }
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
                cpp: '#include <iostream>\nusing namespace std;\n\nint dp[21][21][21];\nbool visited[21][21][21];\n\nint w(int a, int b, int c) {\n    // 여기에 저장하며 풀기를 적용한 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int[][][] dp = new int[21][21][21];\n    static boolean[][][] visited = new boolean[21][21][21];\n    \n    static int w(int a, int b, int c) {\n        // 여기에 저장하며 풀기를 적용한 함수를 작성하세요\n        return 0;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextInt()) {\n            int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n            if (a == -1 && b == -1 && c == -1) break;\n            System.out.printf("w(%d, %d, %d) = %d%n", a, b, c, w(a, b, c));\n        }\n    }\n}'
            },
            solutions: [{
                approach: '메모이제이션 (Top-Down DP)',
                description: '3차원 배열에 계산 결과를 저장하여 중복 호출을 제거합니다.',
                timeComplexity: 'O(21^3)',
                spaceComplexity: 'O(21^3)',
                codeSteps: {
                    python: [
                        { title: '메모 테이블 초기화', code: 'import sys\ninput = sys.stdin.readline\n\ndp = {}' },
                        { title: 'w 함수 구현 (메모이제이션)', code: 'def w(a, b, c):\n    if a <= 0 or b <= 0 or c <= 0:\n        return 1\n    if a > 20 or b > 20 or c > 20:\n        return w(20, 20, 20)\n    if (a, b, c) in dp:\n        return dp[(a, b, c)]\n    if a < b < c:\n        dp[(a,b,c)] = w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)\n    else:\n        dp[(a,b,c)] = w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)\n    return dp[(a,b,c)]' },
                        { title: '입출력 처리', code: 'while True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")' }
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
            descriptionHTML: '<h3>문제</h3><p>정수 X에 사용할 수 있는 연산은 다음 세 가지이다.</p><ol><li>X가 3으로 나누어 떨어지면, 3으로 나눈다.</li><li>X가 2로 나누어 떨어지면, 2로 나눈다.</li><li>1을 뺀다.</li></ol><p>정수 N이 주어질 때, 위 연산을 적절히 사용하여 <strong>1을 만드는 데 필요한 최소 연산 횟수</strong>를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 정수 N (1 ≤ N ≤ 10<sup>6</sup>)</p></div><div><h4>출력</h4><p>최소 연산 횟수를 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10</pre></div><div><strong>출력</strong><pre>3</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '그리디하게 큰 수로 나누는 것이 항상 최적은 아닙니다 (예: 10). DP로 모든 경우를 고려해야 합니다.' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = 정수 i를 1로 만드는 데 필요한 <strong>최소 연산 횟수</strong>. dp[1] = 0 (이미 1이므로).' },
                { title: '계산 규칙', content: '<code>dp[i] = dp[i-1] + 1</code> (1을 빼기)<br>i가 2로 나누어지면: <code>dp[i] = min(dp[i], dp[i/2] + 1)</code><br>i가 3으로 나누어지면: <code>dp[i] = min(dp[i], dp[i/3] + 1)</code>' },
                { title: '구현 팁', content: 'Bottom-Up으로 i=2부터 N까지 순회하면서 dp를 채웁니다. 초기값 dp[1]=0. 각 i에서 세 가지 연산을 모두 고려해서 최솟값을 저장합니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] dp = new int[n + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: 'dp[1]=0에서 시작하여 dp[N]까지 세 가지 연산의 최솟값을 채웁니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 DP 배열', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ndp = [0] * (n + 1)' },
                        { title: 'DP 테이블 채우기', code: 'for i in range(2, n + 1):\n    dp[i] = dp[i-1] + 1\n    if i % 2 == 0:\n        dp[i] = min(dp[i], dp[i//2] + 1)\n    if i % 3 == 0:\n        dp[i] = min(dp[i], dp[i//3] + 1)' },
                        { title: '결과 출력', code: 'print(dp[n])' }
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
            descriptionHTML: '<h3>문제</h3><p>지원이에게 2진 수열이 있다. 이 수열은 0과 1로만 이루어져 있으며, 다음과 같은 타일로 만들 수 있다:</p><ul><li><strong>1</strong> 타일 (길이 1)</li><li><strong>00</strong> 타일 (길이 2)</li></ul><p>길이가 N인 2진 수열의 개수를 15746으로 나눈 나머지를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 자연수 N (1 ≤ N ≤ 1,000,000)</p></div><div><h4>출력</h4><p>N길이 수열의 개수를 15746으로 나눈 나머지</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4</pre></div><div><strong>출력</strong><pre>5</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '길이 N인 수열의 마지막에 올 수 있는 타일을 생각해보세요. 마지막이 "1" 타일이면 나머지 길이는? "00" 타일이면?' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = 길이 i인 올바른 2진 수열의 개수' },
                { title: '계산 규칙', content: '마지막에 "1"을 놓으면 앞에 길이 i-1의 수열이 와야 하고, "00"을 놓으면 앞에 길이 i-2의 수열이 와야 합니다.<br><code>dp[i] = (dp[i-1] + dp[i-2]) % 15746</code><br>이것은 피보나치 수열과 동일한 구조입니다!' },
                { title: '구현 팁', content: 'dp[1] = 1 ("1"), dp[2] = 2 ("11", "00"). 매 계산마다 <strong>15746으로 나머지</strong>를 취해야 합니다. N이 최대 100만이므로 배열 대신 변수 2개로 공간 최적화도 가능합니다.' }
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
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '피보나치 (Bottom-Up)',
                description: 'dp[i] = dp[i-1] + dp[i-2] (mod 15746). 피보나치와 동일한 점화식입니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: 'DP 계산', code: 'if n == 1:\n    print(1)\nelse:\n    a, b = 1, 2\n    for i in range(3, n + 1):\n        a, b = b, (a + b) % 15746' },
                        { title: '출력', code: '    print(b)' }
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
            descriptionHTML: '<h3>문제</h3><p>계단 오르기 게임은 계단 아래 시작점부터 꼭대기에 있는 도착점까지 가는 게임이다.</p><p>규칙은 다음과 같다:</p><ol><li>계단은 한 번에 한 계단씩 또는 두 계단씩 오를 수 있다.</li><li><strong>연속된 세 개의 계단을 모두 밟아서는 안 된다.</strong></li><li>마지막 도착 계단은 반드시 밟아야 한다.</li></ol><p>각 계단에 쓰여진 점수의 합이 최대가 되도록 계단을 밟자.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 계단의 수 N (1 ≤ N ≤ 300), 이후 N개의 줄에 계단 점수</p></div><div><h4>출력</h4><p>얻을 수 있는 총 점수의 최댓값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>6\n10\n20\n15\n25\n10\n20</pre></div><div><strong>출력</strong><pre>75</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '"연속 3개 불가" 조건이 핵심입니다. i번째 계단을 밟을 때, 바로 직전(i-1)도 밟았는지 여부에 따라 경우가 나뉩니다.' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = i번째 계단을 밟았을 때의 최대 점수.<br>i번째에 도달하는 방법은 두 가지:<br>① i-2에서 2칸 점프<br>② i-1에서 1칸 (단, i-1도 직전에서 1칸 온 건 불가)' },
                { title: '계산 규칙', content: '경우 1: i-2 → i (2칸 점프): <code>dp[i-2] + score[i]</code><br>경우 2: i-3 → i-1 → i (1칸+1칸, 단 i-2는 안 밟음): <code>dp[i-3] + score[i-1] + score[i]</code><br><code>dp[i] = max(dp[i-2] + score[i], dp[i-3] + score[i-1] + score[i])</code>' },
                { title: '구현 팁', content: '초기값: dp[1] = score[1], dp[2] = score[1]+score[2], dp[3] = max(score[1], score[2])+score[3]. i=4부터 계산 규칙을 적용하세요. 1-indexed가 편합니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] score = new int[n + 1];\n        int[] dp = new int[n + 1];\n        for (int i = 1; i <= n; i++) score[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP',
                description: '각 계단에서 2칸 점프 vs 1칸+1칸 중 최대를 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: '초기값 및 DP', code: 'dp[1] = scores[1]\nif n >= 2: dp[2] = scores[1] + scores[2]\nif n >= 3: dp[3] = max(scores[1], scores[2]) + scores[3]\nfor i in range(4, n + 1):\n    dp[i] = max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i])' },
                        { title: '출력', code: 'print(dp[n])' }
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
            descriptionHTML: '<h3>문제</h3><p>효주는 포도주 시식회에 참석했다. N개의 포도주 잔이 순서대로 놓여 있고, 각 잔에는 일정량의 포도주가 들어 있다.</p><p>규칙:</p><ol><li>포도주 잔을 선택하면 그 잔을 모두 마셔야 한다.</li><li><strong>연속으로 놓여 있는 3잔을 모두 마실 수는 없다.</strong></li></ol><p>가장 많은 양의 포도주를 마실 수 있도록 하는 프로그램을 작성하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 포도주 잔의 수 n (1 ≤ n ≤ 10,000), 이후 n개의 줄에 각 잔의 포도주 양</p></div><div><h4>출력</h4><p>마실 수 있는 포도주의 최대 양</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>6\n6\n10\n13\n9\n8\n1</pre></div><div><strong>출력</strong><pre>33</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '계단 오르기와 비슷하지만 중요한 차이가 있습니다: <strong>마지막 잔을 반드시 마실 필요가 없습니다.</strong> 이 차이 때문에 계산 규칙이 달라집니다.' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = 1번째부터 i번째 잔까지 고려했을 때 마실 수 있는 최대 양. (i번째를 안 마실 수도 있음!)' },
                { title: '계산 규칙', content: 'i번째 잔에 대해 3가지 경우:<br>① i번째를 안 마심: <code>dp[i-1]</code><br>② i번째만 마심 (i-1은 안 마심): <code>dp[i-2] + wine[i]</code><br>③ i-1과 i를 연속 마심 (i-2는 안 마심): <code>dp[i-3] + wine[i-1] + wine[i]</code><br><code>dp[i] = max(dp[i-1], dp[i-2]+wine[i], dp[i-3]+wine[i-1]+wine[i])</code>' },
                { title: '구현 팁', content: '계단 오르기와 달리 "안 마시는" 경우(<code>dp[i-1]</code>)가 추가됩니다. 초기값 처리에 주의하고, n이 작을 때(1, 2)의 예외 처리를 잊지 마세요.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] wine = new int[n + 1];\n        int[] dp = new int[n + 1];\n        for (int i = 1; i <= n; i++) wine[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: 'Bottom-Up DP (3가지 경우)',
                description: '안 마시기 / 1잔만 / 연속 2잔 중 최대를 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\ndp = [0] * (n + 1)' },
                        { title: 'DP 채우기', code: 'dp[1] = wine[1]\nif n >= 2: dp[2] = wine[1] + wine[2]\nfor i in range(3, n + 1):\n    dp[i] = max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i])' },
                        { title: '출력', code: 'print(dp[n])' }
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
            descriptionHTML: '<h3>문제</h3><p>n개의 정수로 이루어진 임의의 수열이 주어진다. 이 중 연속된 몇 개의 수를 선택해서 구할 수 있는 합 중 가장 큰 합을 구하려고 한다.</p><p>수는 한 개 이상 선택해야 한다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 정수 n (1 ≤ n ≤ 100,000), 둘째 줄에 n개의 정수 (절댓값 ≤ 1,000)</p></div><div><h4>출력</h4><p>연속합의 최댓값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10\n10 -4 3 1 5 6 -35 12 21 -1</pre></div><div><strong>출력</strong><pre>33</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '이 문제는 "연속된 수들의 합 중 최대를 찾는" 문제입니다. 각 위치에서 "이어 붙일지, 새로 시작할지"만 결정하면 됩니다.' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막 원소로 포함하는</strong> 연속 부분의 최대 합.' },
                { title: '계산 규칙', content: 'i번째 원소에서 두 가지 선택:<br>① 이전 연속합에 이어 붙이기: <code>dp[i-1] + a[i]</code><br>② 여기서 새로 시작: <code>a[i]</code><br><code>dp[i] = max(dp[i-1] + a[i], a[i])</code><br>최종 답은 <code>max(dp[1], dp[2], ..., dp[n])</code>' },
                { title: '구현 팁', content: '배열 없이 변수 하나로도 가능합니다. <code>cur = max(cur + a[i], a[i])</code>, <code>ans = max(ans, cur)</code>. 음수만 있는 경우도 처리해야 합니다 (한 개는 반드시 선택).' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '카데인 알고리즘',
                description: '이어붙이기 vs 새시작 중 최대를 선택하며 전체 최대를 추적합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: '카데인 알고리즘', code: 'cur = a[0]\nans = a[0]\nfor i in range(1, n):\n    cur = max(cur + a[i], a[i])\n    ans = max(ans, cur)' },
                        { title: '출력', code: 'print(ans)' }
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
            descriptionHTML: '<h3>문제</h3><p>45656이란 수를 보자. 이 수는 인접한 모든 자릿수의 차이가 1이다. 이런 수를 계단 수라 한다.</p><p>N이 주어질 때, 길이가 N인 계단 수가 총 몇 개 있는지 구하시오. (0으로 시작하는 수는 계단 수가 아니다)</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 100)</p></div><div><h4>출력</h4><p>길이가 N인 계단 수의 개수를 1,000,000,000으로 나눈 나머지</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>1</pre></div><div><strong>출력</strong><pre>9</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '마지막 자릿수가 무엇인지에 따라 다음에 올 수 있는 숫자가 달라집니다. 마지막 자릿수를 상태에 포함시켜야 합니다.' },
                { title: '칸의 의미', content: '<code>dp[i][j]</code> = 길이가 i이고 마지막 자릿수가 j인 계단 수의 개수' },
                { title: '계산 규칙', content: '마지막 자릿수가 j인 수 뒤에는 j-1 또는 j+1이 올 수 있습니다.<br>• j = 0일 때: 앞에 1만 가능 → <code>dp[i][0] = dp[i-1][1]</code><br>• j = 9일 때: 앞에 8만 가능 → <code>dp[i][9] = dp[i-1][8]</code><br>• 그 외: <code>dp[i][j] = dp[i-1][j-1] + dp[i-1][j+1]</code><br>결과: <code>sum(dp[N][0..9])</code>' },
                { title: '구현 팁', content: '초기값: dp[1][1~9] = 1, dp[1][0] = 0 (0으로 시작 불가). 매 계산마다 <code>% 1000000000</code>. 답은 dp[N][0]~dp[N][9]의 합입니다.' }
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
                cpp: '#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long MOD = 1000000000;\n        long[][] dp = new long[n + 1][10];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '2차원 DP (자릿수 전이)',
                description: '끝자리 0과 9의 경계 처리를 주의하며 전이합니다.',
                timeComplexity: 'O(10N)',
                spaceComplexity: 'O(10N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\ndp = [[0]*10 for _ in range(n+1)]\nfor j in range(1, 10):\n    dp[1][j] = 1' },
                        { title: 'DP 전이', code: 'for i in range(2, n+1):\n    dp[i][0] = dp[i-1][1]\n    dp[i][9] = dp[i-1][8]\n    for j in range(1, 9):\n        dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD' },
                        { title: '합산 및 출력', code: 'print(sum(dp[n]) % MOD)' }
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
            descriptionHTML: '<h3>문제</h3><p>RGB거리에는 집이 N개 있다. 각 집을 빨강, 초록, 파랑 중 하나로 칠해야 한다.</p><p>규칙: <strong>이웃한 집은 같은 색이면 안 된다.</strong></p><p>각 집을 특정 색으로 칠하는 비용이 주어질 때, 모든 집을 칠하는 비용의 최솟값을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 집의 수 N (2 ≤ N ≤ 1,000), 이후 N개의 줄에 R G B 비용</p></div><div><h4>출력</h4><p>모든 집을 칠하는 최소 비용</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3\n26 40 83\n49 60 57\n13 89 99</pre></div><div><strong>출력</strong><pre>96</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'i번째 집의 색을 정할 때, i-1번째 집이 어떤 색인지에 따라 선택지가 달라집니다. 따라서 <strong>마지막에 칠한 색</strong>을 상태에 포함시켜야 합니다.' },
                { title: '칸의 의미', content: '<code>dp[i][c]</code> = 1번째~i번째 집까지 칠했을 때, i번째 집을 색 c(R=0,G=1,B=2)로 칠한 경우의 최소 비용' },
                { title: '계산 규칙', content: '이웃한 집은 다른 색이어야 하므로:<br><code>dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0]</code><br><code>dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1]</code><br><code>dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2]</code><br>답: <code>min(dp[N][0], dp[N][1], dp[N][2])</code>' },
                { title: '구현 팁', content: '초기값: dp[1][c] = cost[1][c]. 이전 행만 참조하므로 공간 최적화로 1차원 배열 2개만 써도 됩니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] cost = new int[n][3];\n        int[][] dp = new int[n][3];\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < 3; j++)\n                cost[i][j] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '2차원 DP (색 선택)',
                description: '각 집마다 이전 집의 다른 색 최소비용 + 현재 비용을 선택합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: 'DP 계산', code: 'dp = list(cost[0])\nfor i in range(1, n):\n    ndp = [\n        min(dp[1], dp[2]) + cost[i][0],\n        min(dp[0], dp[2]) + cost[i][1],\n        min(dp[0], dp[1]) + cost[i][2]\n    ]\n    dp = ndp' },
                        { title: '출력', code: 'print(min(dp))' }
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
            descriptionHTML: '<h3>문제</h3><p>크기 n인 정수 삼각형이 있다. 맨 위에서 시작하여 아래로 내려올 때, 현재 위치에서 왼쪽 아래 또는 오른쪽 아래로만 이동할 수 있다.</p><p>선택된 수의 합이 최대가 되는 경로를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 삼각형 크기 n (1 ≤ n ≤ 500), 이후 삼각형 정보</p></div><div><h4>출력</h4><p>합이 최대가 되는 경로의 합</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5\n7\n3 8\n8 1 0\n2 7 4 4\n4 5 2 6 5</pre></div><div><strong>출력</strong><pre>30</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '위에서 아래로 내려가면서, 각 위치까지 도달했을 때의 최대 합을 구합니다. 각 위치는 위쪽의 왼쪽 또는 오른쪽에서 올 수 있습니다.' },
                { title: '칸의 의미', content: '<code>dp[i][j]</code> = i행 j열까지 도달했을 때의 최대 합' },
                { title: '계산 규칙', content: '<code>dp[i][j] = max(dp[i-1][j-1], dp[i-1][j]) + tri[i][j]</code><br>단, j=0이면 왼쪽 위는 없으므로 dp[i-1][j]만, j=i이면 오른쪽 위는 없으므로 dp[i-1][j-1]만 고려합니다.<br>답: <code>max(dp[n-1][0], dp[n-1][1], ..., dp[n-1][n-1])</code>' },
                { title: '구현 팁', content: 'Bottom-up으로 아래에서 위로 올라가며 풀 수도 있습니다. 그러면 마지막에 dp[0][0]이 답이 되어 더 간단합니다. 삼각형 배열을 직접 수정해도 됩니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] tri = new int[n][];\n        for (int i = 0; i < n; i++) {\n            tri[i] = new int[i + 1];\n            for (int j = 0; j <= i; j++)\n                tri[i][j] = sc.nextInt();\n        }\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '아래→위 Bottom-Up',
                description: '맨 아래 행부터 위로 올라가며 max를 누적합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: '아래→위 DP', code: 'for i in range(n-2, -1, -1):\n    for j in range(i+1):\n        tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])' },
                        { title: '출력', code: 'print(tri[0][0])' }
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
            descriptionHTML: '<h3>문제</h3><p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하시오.</p><p>예를 들어, 수열 {10, 20, 10, 30, 20, 50}의 LIS는 {10, 20, 30, 50}이며 길이는 4이다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 수열 크기 N (1 ≤ N ≤ 1,000), 둘째 줄에 수열 A</p></div><div><h4>출력</h4><p>가장 긴 증가하는 부분 수열의 길이</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>6\n10 20 10 30 20 50</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '각 위치에서 끝나는 증가 수열의 길이를 구합니다. i번째 원소 앞에 있는 원소들 중, 자기보다 작은 것들의 증가 수열 길이를 참고합니다.' },
                { title: '칸의 의미', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> 가장 긴 증가 수열의 길이' },
                { title: '계산 규칙', content: '0 ≤ j < i인 모든 j에 대해, <code>A[j] < A[i]</code>이면:<br><code>dp[i] = max(dp[i], dp[j] + 1)</code><br>초기값: dp[i] = 1 (자기 자신만 포함)<br>답: <code>max(dp[0], dp[1], ..., dp[n-1])</code>' },
                { title: '구현 팁', content: '이중 for문으로 O(N²)에 풀 수 있습니다. N ≤ 1000이므로 충분합니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        int[] dp = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: 'O(N^2) DP',
                description: '각 원소마다 앞의 모든 원소를 확인하여 LIS를 구합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))' },
                        { title: 'LIS DP', code: 'dp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]:\n            dp[i] = max(dp[i], dp[j] + 1)' },
                        { title: '출력', code: 'print(max(dp))' }
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
            descriptionHTML: '<h3>문제</h3><p>바이토닉 수열이란 어떤 수를 기준으로 앞부분은 올라가고(증가) 뒷부분은 내려가는(감소) 수열입니다.</p><p>수열 A가 주어질 때, 가장 긴 올라갔다 내려가는 수열의 길이를 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 수열 크기 N (1 ≤ N ≤ 1,000), 둘째 줄에 수열 A</p></div><div><h4>출력</h4><p>가장 긴 올라갔다 내려가는 수열의 길이</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10\n1 5 2 1 4 3 4 5 2 1</pre></div><div><strong>출력</strong><pre>7</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '왼쪽에서의 LIS와 오른쪽에서의 LIS를 각각 구한 뒤 합치면 됩니다.' },
                { title: '칸의 의미', content: '<code>lis[i]</code> = 왼→우 증가 수열 길이<br><code>lds[i]</code> = 우→좌 증가 수열 길이 (= 감소 수열)' },
                { title: '계산 규칙', content: '답: <code>max(lis[i] + lds[i] - 1)</code> (꼭짓점 i를 기준으로)' },
                { title: '구현 팁', content: 'LIS를 정방향, 역방향으로 두 번 구합니다. 합에서 1을 빼는 이유는 꼭짓점이 중복이기 때문입니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n], lis = new int[n], lds = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: 'LIS + LDS 합치기',
                description: '정방향 LIS와 역방향 LIS를 구해 합산합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 LIS', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\nlis = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if a[j] < a[i]: lis[i] = max(lis[i], lis[j]+1)' },
                        { title: 'LDS (역방향 LIS)', code: 'lds = [1] * n\nfor i in range(n-2, -1, -1):\n    for j in range(n-1, i, -1):\n        if a[j] < a[i]: lds[i] = max(lds[i], lds[j]+1)' },
                        { title: '합산 및 출력', code: 'print(max(lis[i] + lds[i] - 1 for i in range(n)))' }
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
            descriptionHTML: '<h3>문제</h3><p>두 전봇대 A와 B 사이에 전깃줄이 연결되어 있다. 전깃줄이 교차하지 않으려면 최소 몇 개의 전깃줄을 없애야 하는지 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 전깃줄 수 N (1 ≤ N ≤ 100), 이후 N줄에 A, B 전봇대 위치</p></div><div><h4>출력</h4><p>교차하지 않으려면 없애야 하는 전깃줄의 최소 개수</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>8\n1 8\n3 9\n2 2\n4 1\n6 4\n10 10\n9 7\n7 6</pre></div><div><strong>출력</strong><pre>3</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '"교차하지 않는 전깃줄의 최대 개수"를 구하면 답은 N - 최대 개수입니다.' },
                { title: '칸의 의미', content: 'A 기준 정렬 후, B 배열에서 <strong>LIS를 구하는 문제</strong>와 같습니다!' },
                { title: '계산 규칙', content: 'LIS와 동일한 계산 규칙. 답: <code>N - LIS 길이</code>' },
                { title: '구현 팁', content: '정렬이 핵심! A 기준 정렬 후 B로 LIS를 구하세요.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    sort(wires, wires + n);\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] wires = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            wires[i][0] = sc.nextInt();\n            wires[i][1] = sc.nextInt();\n        }\n        Arrays.sort(wires, (a, b) -> a[0] - b[0]);\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '정렬 + LIS',
                description: 'A 기준 정렬 후 B 배열에서 LIS를 구해 N에서 뺍니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 및 정렬', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\nwires.sort()' },
                        { title: 'B 배열에서 LIS', code: 'b = [w[1] for w in wires]\ndp = [1] * n\nfor i in range(1, n):\n    for j in range(i):\n        if b[j] < b[i]: dp[i] = max(dp[i], dp[j]+1)' },
                        { title: '출력', code: 'print(n - max(dp))' }
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
            descriptionHTML: '<h3>문제</h3><p>LCS(Longest Common Subsequence)는 두 수열에서 공통으로 들어있는 부분 중 가장 긴 것을 찾는 문제입니다.</p><p>예를 들어, ACAYKP와 CAPCAK에서 공통으로 골라낼 수 있는 가장 긴 수열은 ACAK이고 길이는 4입니다.</p><div class="problem-io"><div><h4>입력</h4><p>두 줄에 걸쳐 두 문자열이 주어진다. (길이 ≤ 1,000, 대문자)</p></div><div><h4>출력</h4><p>LCS의 길이</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>ACAYKP\nCAPCAK</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '두 문자열의 문자를 하나씩 비교해가며 2차원 표를 채웁니다.' },
                { title: '칸의 의미', content: '<code>dp[i][j]</code> = A의 처음 i글자와 B의 처음 j글자에서 찾을 수 있는 LCS 길이' },
                { title: '계산 규칙', content: '• <code>A[i] == B[j]</code>이면: <code>dp[i][j] = dp[i-1][j-1] + 1</code><br>• <code>A[i] != B[j]</code>이면: <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code>' },
                { title: '구현 팁', content: '0행, 0열은 모두 0. 1-indexed로 구현하면 편합니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        int[][] dp = new int[a.length() + 1][b.length() + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '2차원 DP',
                description: '같으면 대각선+1, 다르면 왼쪽/위쪽 max로 채웁니다.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()' },
                        { title: 'DP 테이블 채우기', code: 'dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]\nfor i in range(1, len(a)+1):\n    for j in range(1, len(b)+1):\n        if a[i-1] == b[j-1]:\n            dp[i][j] = dp[i-1][j-1] + 1\n        else:\n            dp[i][j] = max(dp[i-1][j], dp[i][j-1])' },
                        { title: '출력', code: 'print(dp[len(a)][len(b)])' }
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
            descriptionHTML: '<h3>문제</h3><p>이 문제는 아주 유명한 <strong>0/1 배낭 문제 (Knapsack Problem)</strong>이다.</p><p>N개의 물건이 있고, 각 물건은 무게 W와 가치 V를 가진다. 배낭의 최대 무게가 K일 때, 넣을 수 있는 물건들의 가치의 최대합을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 물건 수 N(1≤N≤100)과 최대 무게 K(1≤K≤100,000), 이후 N줄에 W, V</p></div><div><h4>출력</h4><p>배낭에 넣을 수 있는 물건들의 가치 합의 최댓값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 7\n6 13\n4 8\n3 6\n5 12</pre></div><div><strong>출력</strong><pre>14</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '각 물건을 넣거나 안 넣거나 (0/1) 선택합니다.' },
                { title: '칸의 의미', content: '<code>dp[i][w]</code> = 처음 i개 물건까지 고려하고 배낭 용량이 w일 때의 최대 가치' },
                { title: '계산 규칙', content: '<code>dp[i][w] = max(dp[i-1][w], dp[i-1][w - W[i]] + V[i])</code>' },
                { title: '구현 팁', content: '1차원 배열로 공간 최적화 가능. w를 <strong>역순</strong>으로 순회해야 같은 물건을 두 번 넣는 것을 방지합니다.' }
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
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] dp = new int[k + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}'
            },
            solutions: [{
                approach: '1차원 DP (역순 순회)',
                description: '각 물건마다 dp 배열을 역순으로 갱신하여 공간을 최적화합니다.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]' },
                        { title: '1차원 DP (역순)', code: 'dp = [0] * (k + 1)\nfor w, v in items:\n    for j in range(k, w - 1, -1):\n        dp[j] = max(dp[j], dp[j-w] + v)' },
                        { title: '출력', code: 'print(dp[k])' }
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
