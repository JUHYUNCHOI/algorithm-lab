// DP Topic Module
const dpTopic = {
    id: 'dp',
    title: 'Dynamic Programming',
    icon: '🧩',
    description: '중복 계산을 제거하여 효율적으로 문제를 푸는 기법',

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
                        이것이 바로 <code>중복되는 부분 문제</code>이고, DP가 필요한 이유입니다.
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
                        <h3>중복되는 부분 문제</h3>
                        <p>같은 작은 문제가 여러 번 반복 등장합니다. 재귀로 풀면 같은 계산을 수없이 반복합니다. DP는 한 번 계산한 결과를 저장해서 재사용합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="50" width="15" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="32" y="35" width="15" height="35" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="54" y="15" width="15" height="55" rx="2" fill="var(--accent)" opacity="0.9"/>
                            </svg>
                        </div>
                        <h3>최적 부분 구조</h3>
                        <p>큰 문제의 최적 해가 작은 부분 문제의 최적 해로 구성됩니다. 작은 것을 최적으로 풀면, 그 조합으로 큰 문제도 최적으로 풀립니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">다음 중 DP로 풀 수 있는 문제는? 클릭해서 확인해보세요!</span>
                    </div>
                    <div class="quiz-cards">
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"계단을 1칸 또는 2칸씩 올라갈 때, n번째 계단까지 가는 방법의 수"</span><div class="quiz-explain">부분 문제(n-1, n-2번째 계단)의 해가 반복되고, 최적 부분 구조를 가집니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">✅ DP 가능!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"배열에서 가장 큰 수 찾기"</span><div class="quiz-explain">단순히 하나씩 비교하면 되는 O(n) 문제. 부분 문제가 중복되지 않습니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">❌ DP 불필요</span>
                        </div>
                        <div class="quiz-card" data-isdp="true">
                            <div><span class="quiz-text">"동전 종류가 주어질 때, 금액 n을 만드는 최소 동전 수"</span><div class="quiz-explain">금액 n을 만드는 문제가 더 작은 금액의 부분 문제로 나뉘며, 중복됩니다.</div></div>
                            <span class="quiz-badge">클릭!</span><span class="quiz-result">✅ DP 가능!</span>
                        </div>
                        <div class="quiz-card" data-isdp="false">
                            <div><span class="quiz-text">"주어진 배열을 오름차순으로 정렬하기"</span><div class="quiz-explain">정렬은 분할정복이나 비교 기반 알고리즘으로 풀지, DP의 영역은 아닙니다.</div></div>
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
                        <div class="step-card-header"><span class="step-num">1</span><h4>상태 정의하기</h4></div>
                        <p>"dp[i]가 무엇을 의미하는지" 명확히 정의합니다. 이것이 가장 중요한 단계입니다.</p>
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
                        <div class="step-card-header"><span class="step-num">2</span><h4>점화식 세우기</h4></div>
                        <p>dp[i]를 더 작은 부분 문제(dp[i-1], dp[i-2] 등)로 표현하는 관계식을 세웁니다.</p>
                        <div class="think-box" style="margin:0.8rem 0 0">
                            <div class="think-box-question">
                                <span class="think-box-question-icon">Q</span>
                                <span class="think-box-question-text">피보나치의 점화식은 무엇일까요?</span>
                            </div>
                            <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                            <div class="think-box-answer"><code>dp[i] = dp[i-1] + dp[i-2]</code><br>i번째 피보나치 수 = 직전 두 수의 합</div>
                        </div>
                    </div>

                    <div class="step-card">
                        <div class="step-card-header"><span class="step-num">3</span><h4>초기값 설정</h4></div>
                        <p>점화식을 시작하기 위한 기저 조건(base case)을 설정합니다.</p>
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
                <div class="concept-section-title"><span class="section-num">4</span> Top-Down vs Bottom-Up</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔽 Top-Down (메모이제이션)</h3>
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
                        <h3>🔼 Bottom-Up (타뷸레이션)</h3>
                        <p class="approach-desc">반복문 + 테이블. 작은 문제부터 차례로 채워나감</p>
                        <div class="code-block"><pre><code class="language-python">def fib(n):
    dp = [0] * (n+1)
    dp[1] = dp[2] = 1
    for i in range(3, n+1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]</code></pre></div>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">그러면 언제 Top-Down을, 언제 Bottom-Up을 쓸까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>Top-Down이 좋을 때:</strong> 모든 상태를 다 계산할 필요 없을 때, 점화식이 복잡할 때<br>
                        <strong>Bottom-Up이 좋을 때:</strong> 재귀 깊이 제한이 걱정될 때(파이썬!), 모든 상태를 순서대로 채울 수 있을 때<br><br>
                        실전 팁: <strong>대부분의 대회/코딩테스트에서는 Bottom-Up을 더 많이 씁니다.</strong> 함수 호출 오버헤드가 없고, 스택 오버플로 걱정이 없기 때문이에요.
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
                        <div class="compare-header"><span class="compare-emoji">🚀</span><h3>DP (메모이제이션)</h3></div>
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
                    <div class="roadmap-item"><div class="roadmap-icon">📈</div><h4>LIS (최장 증가 부분 수열)</h4><p>LIS, 바이토닉, 전깃줄</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🔤</div><h4>LCS (최장 공통 부분 수열)</h4><p>두 문자열 비교, 2D 테이블</p></div>
                    <div class="roadmap-item"><div class="roadmap-icon">🎒</div><h4>배낭 문제 (Knapsack)</h4><p>무게 제한 내 최대 가치</p></div>
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
        const slider = container.querySelector('#perf-slider');
        const updatePerf = () => {
            const n = parseInt(slider.value);
            container.querySelector('#perf-n').textContent = n;
            const recCount = this._fib(n);
            const dpC = n - 2;
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
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    _initConceptInteractions(container) {
        // Think-box 클릭 공개
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                if (!box.classList.contains('revealed')) {
                    box.classList.add('revealed');
                    btn.textContent = '✓ 답변 확인 완료';
                }
            });
        });
        // 퀴즈 카드
        container.querySelectorAll('.quiz-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('answered')) return;
                card.classList.add('answered');
                card.classList.add(card.dataset.isdp === 'true' ? 'correct' : 'wrong');
            });
        });
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>DP 시각화</h2>
            <div class="viz-type-selector">
                <button class="viz-type-btn active" data-viz="fibonacci">피보나치</button>
                <button class="viz-type-btn" data-viz="makeone">1로 만들기</button>
                <button class="viz-type-btn" data-viz="stairs">계단 오르기</button>
                <button class="viz-type-btn" data-viz="lis">LIS</button>
                <button class="viz-type-btn" data-viz="knapsack">배낭 문제</button>
            </div>
            <div id="viz-content"></div>
        `;
        const vizContent = container.querySelector('#viz-content');
        const buttons = container.querySelectorAll('.viz-type-btn');

        const switchViz = (type) => {
            this._clearVizState();
            buttons.forEach(b => b.classList.toggle('active', b.dataset.viz === type));
            vizContent.innerHTML = '';
            this._renderVizType(vizContent, type);
        };

        buttons.forEach(btn => {
            btn.addEventListener('click', () => switchViz(btn.dataset.viz));
        });

        switchViz('fibonacci');
    },

    _clearVizState() {
        if (this._vizState) {
            this._vizState.timeouts.forEach(t => clearTimeout(t));
            this._vizState.timeouts = [];
            this._vizState.running = false;
            this._vizState.paused = false;
        }
    },

    _renderVizType(el, type) {
        switch(type) {
            case 'fibonacci': this._renderVizFibonacci(el); break;
            case 'makeone': this._renderVizMakeOne(el); break;
            case 'stairs': this._renderVizStairs(el); break;
            case 'lis': this._renderVizLIS(el); break;
            case 'knapsack': this._renderVizKnapsack(el); break;
        }
    },

    // ===== 피보나치 시각화 =====
    _renderVizFibonacci(el) {
        el.innerHTML = `
            <div class="viz-controls">
                <div class="viz-control-group">
                    <label>n = <span id="viz-n-label">5</span></label>
                    <input type="range" id="viz-n-slider" min="1" max="10" value="5">
                </div>
                <div class="viz-control-group">
                    <label>속도</label>
                    <input type="range" id="viz-speed" min="1" max="5" value="3">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-pause" class="btn" disabled>⏸ 일시정지</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>
            <div class="viz-panels">
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>재귀 호출 트리</h3>
                        <div class="counter">호출 횟수: <span id="recursive-call-count" class="counter-num">0</span></div>
                    </div>
                    <div class="viz-panel-body">
                        <svg id="tree-svg" width="100%" height="400"></svg>
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>DP 테이블 (Bottom-Up)</h3>
                        <div class="counter">연산 횟수: <span id="dp-call-count" class="counter-num">0</span></div>
                    </div>
                    <div class="viz-panel-body">
                        <div id="dp-table-container" class="dp-table-container"></div>
                        <div id="dp-formula" class="dp-formula"></div>
                    </div>
                </div>
            </div>
            <div class="viz-legend">
                <span class="legend-item"><span class="legend-dot new"></span> 새로운 계산</span>
                <span class="legend-item"><span class="legend-dot duplicate"></span> 중복 계산</span>
                <span class="legend-item"><span class="legend-dot base"></span> 기저 조건 (n=1,2)</span>
                <span class="legend-item"><span class="legend-dot computed"></span> 계산 완료</span>
            </div>
        `;
        this._initVisualization(el);
    },

    // ===== 1로 만들기 시각화 =====
    _renderVizMakeOne(el) {
        el.innerHTML = `
            <div class="viz-controls">
                <div class="viz-control-group">
                    <label>N = <span id="viz-n-label">10</span></label>
                    <input type="range" id="viz-n-slider" min="2" max="20" value="10">
                </div>
                <div class="viz-control-group">
                    <label>속도</label>
                    <input type="range" id="viz-speed" min="1" max="5" value="3">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>
            <div class="viz-panel">
                <div class="viz-panel-header">
                    <h3>dp[i] = i를 1로 만드는 최소 연산 횟수</h3>
                </div>
                <div class="viz-panel-body">
                    <div id="makeone-table" class="dp-table-container" style="flex-wrap:wrap;gap:8px;"></div>
                    <div id="makeone-formula" class="dp-formula" style="margin-top:12px;min-height:24px;"></div>
                    <div id="makeone-path" style="margin-top:16px;font-weight:600;color:var(--accent);min-height:24px;"></div>
                </div>
            </div>
            <div class="viz-legend">
                <span class="legend-item"><span class="legend-dot base"></span> 기저 조건</span>
                <span class="legend-item"><span class="legend-dot new"></span> 현재 계산 중</span>
                <span class="legend-item"><span class="legend-dot computed"></span> 계산 완료</span>
                <span class="legend-item" style="color:var(--green);">━ 최적 경로</span>
            </div>
        `;
        const state = this._vizState;
        const nSlider = el.querySelector('#viz-n-slider');
        const nLabel = el.querySelector('#viz-n-label');
        const speedSlider = el.querySelector('#viz-speed');
        const getDelay = () => [600, 450, 300, 180, 80][parseInt(speedSlider.value) - 1];

        const buildTable = (n) => {
            const tableEl = el.querySelector('#makeone-table');
            tableEl.innerHTML = '';
            const cells = [];
            for (let i = 1; i <= n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">${i}</div><div class="dp-cell-value">?</div>`;
                tableEl.appendChild(cell);
                cells.push(cell);
            }
            return cells;
        };

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            el.querySelector('#makeone-formula').textContent = '';
            el.querySelector('#makeone-path').textContent = '';
            el.querySelector('#viz-play').disabled = false;
            buildTable(parseInt(nSlider.value));
        };

        nSlider.addEventListener('input', () => { nLabel.textContent = nSlider.value; reset(); });
        el.querySelector('#viz-reset').addEventListener('click', reset);

        el.querySelector('#viz-play').addEventListener('click', () => {
            const n = parseInt(nSlider.value);
            state.running = true;
            el.querySelector('#viz-play').disabled = true;
            const cells = buildTable(n);
            const dp = new Array(n + 1).fill(Infinity);
            dp[1] = 0;
            const formula = el.querySelector('#makeone-formula');
            const pathEl = el.querySelector('#makeone-path');

            // Base case
            cells[0].classList.add('base');
            cells[0].querySelector('.dp-cell-value').textContent = '0';

            let step = 0;
            for (let i = 2; i <= n; i++) {
                step++;
                const idx = i;
                const t = setTimeout(() => {
                    if (!state.running) return;
                    dp[idx] = dp[idx - 1] + 1;
                    let from = idx - 1;
                    let explanation = `dp[${idx}] = dp[${idx}-1]+1 = ${dp[idx]}`;
                    if (idx % 2 === 0 && dp[idx / 2] + 1 < dp[idx]) {
                        dp[idx] = dp[idx / 2] + 1;
                        from = idx / 2;
                        explanation = `dp[${idx}] = dp[${idx}/2]+1 = ${dp[idx]}`;
                    }
                    if (idx % 3 === 0 && dp[idx / 3] + 1 < dp[idx]) {
                        dp[idx] = dp[idx / 3] + 1;
                        from = idx / 3;
                        explanation = `dp[${idx}] = dp[${idx}/3]+1 = ${dp[idx]}`;
                    }
                    cells[idx - 1].classList.add('filled');
                    cells[idx - 1].querySelector('.dp-cell-value').textContent = dp[idx];
                    formula.textContent = explanation;

                    // highlight source cell briefly
                    cells[from - 1].classList.add('active');
                    cells[idx - 1].classList.add('active');
                    setTimeout(() => {
                        cells[from - 1].classList.remove('active');
                        cells[idx - 1].classList.remove('active');
                    }, getDelay() * 0.6);
                }, step * getDelay());
                state.timeouts.push(t);
            }

            // After all steps, show optimal path
            const pathT = setTimeout(() => {
                if (!state.running) return;
                // Trace back
                const path = [n];
                let cur = n;
                while (cur > 1) {
                    let best = cur - 1, bestVal = dp[cur - 1];
                    if (cur % 2 === 0 && dp[cur / 2] < bestVal) { best = cur / 2; bestVal = dp[cur / 2]; }
                    if (cur % 3 === 0 && dp[cur / 3] < bestVal) { best = cur / 3; }
                    path.push(best);
                    cur = best;
                }
                path.forEach(v => {
                    cells[v - 1].style.background = 'var(--green)';
                    cells[v - 1].style.color = '#fff';
                    cells[v - 1].querySelector('.dp-cell-value').style.color = '#fff';
                    cells[v - 1].querySelector('.dp-cell-index').style.color = 'rgba(255,255,255,0.8)';
                });
                pathEl.textContent = `최적 경로: ${path.join(' → ')} (${dp[n]}번)`;
            }, (step + 1) * getDelay());
            state.timeouts.push(pathT);
        });

        reset();
    },

    // ===== 계단 오르기 시각화 =====
    _renderVizStairs(el) {
        const stairScores = [10, 20, 15, 25, 10, 20];
        el.innerHTML = `
            <div class="viz-controls">
                <div class="viz-control-group" style="flex-direction:column;gap:4px;">
                    <label>계단 점수 (쉼표 구분)</label>
                    <input type="text" id="stair-input" value="${stairScores.join(', ')}" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;width:200px;">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>
            <div class="viz-panel">
                <div class="viz-panel-header">
                    <h3>계단 오르기 (한 칸 또는 두 칸씩)</h3>
                </div>
                <div class="viz-panel-body">
                    <div id="stair-visual" style="display:flex;align-items:flex-end;gap:4px;padding:20px 10px;min-height:200px;"></div>
                    <div id="stair-dp" class="dp-table-container" style="margin-top:16px;flex-wrap:wrap;gap:8px;"></div>
                    <div id="stair-formula" class="dp-formula" style="margin-top:12px;min-height:24px;"></div>
                    <div id="stair-path" style="margin-top:12px;font-weight:600;color:var(--accent);min-height:24px;"></div>
                </div>
            </div>
        `;
        const state = this._vizState;

        const parseScores = () => {
            const val = el.querySelector('#stair-input').value;
            return val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        };

        const buildStairs = (scores) => {
            const visual = el.querySelector('#stair-visual');
            visual.innerHTML = '';
            const maxScore = Math.max(...scores);
            scores.forEach((s, i) => {
                const block = document.createElement('div');
                block.className = 'stair-block';
                block.style.height = Math.max(30, (s / maxScore) * 120) + 'px';
                block.style.width = '50px';
                block.innerHTML = `<div class="stair-label">${s}</div><div style="font-size:11px;color:var(--text3);">${i + 1}</div>`;
                visual.appendChild(block);
            });
        };

        const buildDP = (n) => {
            const dpEl = el.querySelector('#stair-dp');
            dpEl.innerHTML = '';
            const cells = [];
            for (let i = 0; i <= n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">dp[${i}]</div><div class="dp-cell-value">?</div>`;
                dpEl.appendChild(cell);
                cells.push(cell);
            }
            return cells;
        };

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            const scores = parseScores();
            buildStairs(scores);
            buildDP(scores.length);
            el.querySelector('#stair-formula').textContent = '';
            el.querySelector('#stair-path').textContent = '';
            el.querySelector('#viz-play').disabled = false;
        };

        el.querySelector('#viz-reset').addEventListener('click', reset);

        el.querySelector('#viz-play').addEventListener('click', () => {
            const scores = parseScores();
            const n = scores.length;
            if (n < 2) return;
            state.running = true;
            el.querySelector('#viz-play').disabled = true;
            const cells = buildDP(n);
            const stairBlocks = el.querySelectorAll('.stair-block');
            const formula = el.querySelector('#stair-formula');
            const pathEl = el.querySelector('#stair-path');
            const dp = new Array(n + 1).fill(0);

            // dp[0] = 0 (바닥에서 시작)
            cells[0].classList.add('base');
            cells[0].querySelector('.dp-cell-value').textContent = '0';

            // dp[1] = scores[0]
            const t1 = setTimeout(() => {
                if (!state.running) return;
                dp[1] = scores[0];
                cells[1].classList.add('filled');
                cells[1].querySelector('.dp-cell-value').textContent = dp[1];
                stairBlocks[0].classList.add('active');
                formula.textContent = `dp[1] = ${scores[0]}`;
                setTimeout(() => stairBlocks[0].classList.remove('active'), 400);
            }, 400);
            state.timeouts.push(t1);

            // dp[2] = max(scores[0] + scores[1], scores[1])
            const t2 = setTimeout(() => {
                if (!state.running) return;
                dp[2] = Math.max(scores[0] + scores[1], scores[1]);
                cells[2].classList.add('filled');
                cells[2].querySelector('.dp-cell-value').textContent = dp[2];
                formula.textContent = `dp[2] = max(dp[1]+${scores[1]}, ${scores[1]}) = ${dp[2]}`;
            }, 800);
            state.timeouts.push(t2);

            // dp[i] = max(dp[i-2] + scores[i-1], dp[i-3] + scores[i-2] + scores[i-1]) for i>=3
            // Using the rule: can't step on 3 consecutive stairs
            for (let i = 3; i <= n; i++) {
                const idx = i;
                const t = setTimeout(() => {
                    if (!state.running) return;
                    const opt1 = dp[idx - 2] + scores[idx - 1]; // 2칸 점프
                    const opt2 = dp[idx - 3] + scores[idx - 2] + scores[idx - 1]; // 1칸+1칸 (이전 2개)
                    dp[idx] = Math.max(opt1, opt2);
                    cells[idx].classList.add('filled');
                    cells[idx].querySelector('.dp-cell-value').textContent = dp[idx];
                    stairBlocks[idx - 1].classList.add('active');
                    formula.textContent = `dp[${idx}] = max(dp[${idx-2}]+${scores[idx-1]}, dp[${idx-3}]+${scores[idx-2]}+${scores[idx-1]}) = max(${opt1}, ${opt2}) = ${dp[idx]}`;
                    setTimeout(() => stairBlocks[idx - 1].classList.remove('active'), 500);
                }, 800 + (idx - 2) * 600);
                state.timeouts.push(t);
            }

            // Show result
            const totalDelay = 800 + (n - 2) * 600 + 400;
            const tFinal = setTimeout(() => {
                if (!state.running) return;
                cells[n].style.background = 'var(--green)';
                cells[n].style.color = '#fff';
                cells[n].querySelector('.dp-cell-value').style.color = '#fff';
                pathEl.textContent = `최대 점수: ${dp[n]}`;
            }, totalDelay);
            state.timeouts.push(tFinal);
        });

        reset();
    },

    // ===== LIS 시각화 =====
    _renderVizLIS(el) {
        el.innerHTML = `
            <div class="viz-controls">
                <div class="viz-control-group" style="flex-direction:column;gap:4px;">
                    <label>수열 (쉼표 구분)</label>
                    <input type="text" id="lis-input" value="10, 20, 10, 30, 20, 50" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;width:240px;">
                </div>
                <div class="viz-control-group">
                    <label>속도</label>
                    <input type="range" id="viz-speed" min="1" max="5" value="3">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>
            <div class="viz-panel">
                <div class="viz-panel-header">
                    <h3>최장 증가 부분 수열 (LIS)</h3>
                </div>
                <div class="viz-panel-body">
                    <div id="lis-bars" class="viz-barchart"></div>
                    <div id="lis-dp" class="dp-table-container" style="margin-top:16px;flex-wrap:wrap;gap:8px;"></div>
                    <div id="lis-formula" class="dp-formula" style="margin-top:12px;min-height:24px;"></div>
                    <div id="lis-result" style="margin-top:12px;font-weight:600;color:var(--accent);min-height:24px;"></div>
                </div>
            </div>
            <div class="viz-legend">
                <span class="legend-item"><span class="legend-dot new"></span> 현재 검사 중</span>
                <span class="legend-item"><span class="legend-dot computed"></span> 비교 대상</span>
                <span class="legend-item" style="color:var(--green);">■ LIS에 포함</span>
            </div>
        `;
        const state = this._vizState;
        const speedSlider = el.querySelector('#viz-speed');
        const getDelay = () => [800, 600, 400, 250, 120][parseInt(speedSlider.value) - 1];

        const parseArr = () => el.querySelector('#lis-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

        const buildBars = (arr) => {
            const barsEl = el.querySelector('#lis-bars');
            barsEl.innerHTML = '';
            const maxVal = Math.max(...arr);
            arr.forEach((v, i) => {
                const bar = document.createElement('div');
                bar.className = 'viz-bar';
                bar.style.height = Math.max(20, (v / maxVal) * 140) + 'px';
                bar.innerHTML = `<span class="viz-bar-val">${v}</span><span class="viz-bar-idx">${i}</span>`;
                barsEl.appendChild(bar);
            });
        };

        const buildDP = (n) => {
            const dpEl = el.querySelector('#lis-dp');
            dpEl.innerHTML = '';
            const cells = [];
            for (let i = 0; i < n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">dp[${i}]</div><div class="dp-cell-value">?</div>`;
                dpEl.appendChild(cell);
                cells.push(cell);
            }
            return cells;
        };

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            const arr = parseArr();
            buildBars(arr);
            buildDP(arr.length);
            el.querySelector('#lis-formula').textContent = '';
            el.querySelector('#lis-result').textContent = '';
            el.querySelector('#viz-play').disabled = false;
        };

        el.querySelector('#viz-reset').addEventListener('click', reset);

        el.querySelector('#viz-play').addEventListener('click', () => {
            const arr = parseArr();
            const n = arr.length;
            if (n < 2) return;
            state.running = true;
            el.querySelector('#viz-play').disabled = true;
            const cells = buildDP(n);
            const bars = el.querySelectorAll('.viz-bar');
            const formula = el.querySelector('#lis-formula');
            const resultEl = el.querySelector('#lis-result');
            const dp = new Array(n).fill(1);
            const delay = getDelay();

            // Animation steps - collect all compare pairs
            const steps = [];
            for (let i = 0; i < n; i++) {
                // First show dp[i] being initialized to 1
                steps.push({ type: 'init', i });
                for (let j = 0; j < i; j++) {
                    steps.push({ type: 'compare', i, j });
                }
                steps.push({ type: 'done', i });
            }

            steps.forEach((s, stepIdx) => {
                const t = setTimeout(() => {
                    if (!state.running) return;
                    if (s.type === 'init') {
                        bars[s.i].classList.add('active');
                        cells[s.i].querySelector('.dp-cell-value').textContent = '1';
                        formula.textContent = `dp[${s.i}] = 1 (초기값)`;
                    } else if (s.type === 'compare') {
                        bars[s.j].classList.add('comparing');
                        if (arr[s.j] < arr[s.i] && dp[s.j] + 1 > dp[s.i]) {
                            dp[s.i] = dp[s.j] + 1;
                            cells[s.i].querySelector('.dp-cell-value').textContent = dp[s.i];
                            formula.textContent = `arr[${s.j}]=${arr[s.j]} < arr[${s.i}]=${arr[s.i]} → dp[${s.i}] = dp[${s.j}]+1 = ${dp[s.i]}`;
                        } else if (arr[s.j] < arr[s.i]) {
                            formula.textContent = `arr[${s.j}]=${arr[s.j]} < arr[${s.i}]=${arr[s.i]}, 하지만 dp[${s.j}]+1=${dp[s.j]+1} ≤ dp[${s.i}]=${dp[s.i]}`;
                        } else {
                            formula.textContent = `arr[${s.j}]=${arr[s.j]} ≥ arr[${s.i}]=${arr[s.i]} → 건너뜀`;
                        }
                        setTimeout(() => bars[s.j].classList.remove('comparing'), delay * 0.6);
                    } else if (s.type === 'done') {
                        bars[s.i].classList.remove('active');
                        cells[s.i].classList.add('filled');
                        cells[s.i].querySelector('.dp-cell-value').textContent = dp[s.i];
                    }
                }, stepIdx * delay * 0.5);
                state.timeouts.push(t);
            });

            // Final: highlight LIS
            const finalT = setTimeout(() => {
                if (!state.running) return;
                const maxLen = Math.max(...dp);
                // Trace back LIS
                const lisIndices = [];
                let target = maxLen;
                for (let i = n - 1; i >= 0; i--) {
                    if (dp[i] === target) {
                        if (lisIndices.length === 0 || arr[i] < arr[lisIndices[lisIndices.length - 1]]) {
                            lisIndices.push(i);
                            target--;
                        }
                    }
                }
                lisIndices.reverse();
                lisIndices.forEach(idx => {
                    bars[idx].style.background = 'var(--green)';
                    bars[idx].style.color = '#fff';
                    cells[idx].style.background = 'var(--green)';
                    cells[idx].style.color = '#fff';
                    cells[idx].querySelector('.dp-cell-value').style.color = '#fff';
                });
                resultEl.textContent = `LIS 길이: ${maxLen} → [${lisIndices.map(i => arr[i]).join(', ')}]`;
            }, steps.length * delay * 0.5 + 300);
            state.timeouts.push(finalT);
        });

        reset();
    },

    // ===== 배낭 시각화 =====
    _renderVizKnapsack(el) {
        el.innerHTML = `
            <div class="viz-controls">
                <div class="viz-control-group" style="flex-direction:column;gap:4px;">
                    <label>배낭 용량 (W)</label>
                    <input type="number" id="knap-cap" value="7" min="1" max="15" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;width:80px;">
                </div>
                <div class="viz-buttons">
                    <button id="viz-play" class="btn btn-primary">▶ 시작</button>
                    <button id="viz-reset" class="btn">↺ 리셋</button>
                </div>
            </div>
            <div class="viz-panel">
                <div class="viz-panel-header">
                    <h3>0/1 배낭 문제</h3>
                </div>
                <div class="viz-panel-body">
                    <div id="knap-items" class="viz-items"></div>
                    <div id="knap-table-wrap" style="overflow-x:auto;margin-top:16px;">
                        <table id="knap-table" class="viz-2d-table"></table>
                    </div>
                    <div id="knap-formula" class="dp-formula" style="margin-top:12px;min-height:24px;"></div>
                    <div id="knap-result" style="margin-top:12px;font-weight:600;color:var(--accent);min-height:24px;"></div>
                </div>
            </div>
        `;
        const state = this._vizState;
        const items = [
            { name: 'A', weight: 6, value: 13 },
            { name: 'B', weight: 4, value: 8 },
            { name: 'C', weight: 3, value: 6 },
            { name: 'D', weight: 5, value: 12 }
        ];

        const renderItems = () => {
            const itemsEl = el.querySelector('#knap-items');
            itemsEl.innerHTML = '';
            items.forEach((item, i) => {
                const card = document.createElement('div');
                card.className = 'viz-item-card';
                card.innerHTML = `<strong>${item.name}</strong><br>무게: ${item.weight}<br>가치: ${item.value}`;
                card.dataset.idx = i;
                itemsEl.appendChild(card);
            });
        };

        const buildTable = (W) => {
            const table = el.querySelector('#knap-table');
            table.innerHTML = '';
            const n = items.length;
            // Header row
            let headerHTML = '<tr><th></th>';
            for (let w = 0; w <= W; w++) headerHTML += `<th>w=${w}</th>`;
            headerHTML += '</tr>';
            table.innerHTML = headerHTML;

            const cellMap = {};
            // Row 0 (no items)
            let row0 = document.createElement('tr');
            row0.innerHTML = `<th>0개</th>`;
            for (let w = 0; w <= W; w++) {
                const td = document.createElement('td');
                td.className = 'viz-2d-cell';
                td.textContent = '0';
                td.dataset.i = '0';
                td.dataset.w = w;
                row0.appendChild(td);
                cellMap[`0-${w}`] = td;
            }
            table.appendChild(row0);

            for (let i = 1; i <= n; i++) {
                const tr = document.createElement('tr');
                tr.innerHTML = `<th>${items[i-1].name}</th>`;
                for (let w = 0; w <= W; w++) {
                    const td = document.createElement('td');
                    td.className = 'viz-2d-cell';
                    td.textContent = '?';
                    td.dataset.i = i;
                    td.dataset.w = w;
                    tr.appendChild(td);
                    cellMap[`${i}-${w}`] = td;
                }
                table.appendChild(tr);
            }
            return cellMap;
        };

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            renderItems();
            const W = parseInt(el.querySelector('#knap-cap').value) || 7;
            buildTable(W);
            el.querySelector('#knap-formula').textContent = '';
            el.querySelector('#knap-result').textContent = '';
            el.querySelector('#viz-play').disabled = false;
        };

        el.querySelector('#viz-reset').addEventListener('click', reset);

        el.querySelector('#viz-play').addEventListener('click', () => {
            const W = parseInt(el.querySelector('#knap-cap').value) || 7;
            const n = items.length;
            state.running = true;
            el.querySelector('#viz-play').disabled = true;
            const cellMap = buildTable(W);
            const formula = el.querySelector('#knap-formula');
            const resultEl = el.querySelector('#knap-result');
            const itemCards = el.querySelectorAll('.viz-item-card');

            const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
            let step = 0;

            for (let i = 1; i <= n; i++) {
                for (let w = 0; w <= W; w++) {
                    step++;
                    const ci = i, cw = w;
                    const t = setTimeout(() => {
                        if (!state.running) return;
                        itemCards.forEach(c => c.classList.remove('active'));
                        if (itemCards[ci - 1]) itemCards[ci - 1].classList.add('active');

                        const cell = cellMap[`${ci}-${cw}`];
                        cell.classList.add('active');

                        if (items[ci - 1].weight > cw) {
                            dp[ci][cw] = dp[ci - 1][cw];
                            formula.textContent = `아이템 ${items[ci-1].name} 무게(${items[ci-1].weight}) > 용량(${cw}) → dp[${ci}][${cw}] = dp[${ci-1}][${cw}] = ${dp[ci][cw]}`;
                        } else {
                            const notTake = dp[ci - 1][cw];
                            const take = dp[ci - 1][cw - items[ci - 1].weight] + items[ci - 1].value;
                            dp[ci][cw] = Math.max(notTake, take);
                            formula.textContent = `dp[${ci}][${cw}] = max(안넣기=${notTake}, 넣기=${take}) = ${dp[ci][cw]}`;
                        }

                        cell.textContent = dp[ci][cw];
                        setTimeout(() => cell.classList.remove('active'), 200);
                    }, step * 150);
                    state.timeouts.push(t);
                }
            }

            // Trace back selected items
            const finalT = setTimeout(() => {
                if (!state.running) return;
                const selected = [];
                let cw = W;
                for (let i = n; i >= 1; i--) {
                    if (dp[i][cw] !== dp[i - 1][cw]) {
                        selected.push(i - 1);
                        cw -= items[i - 1].weight;
                        // Highlight row
                        for (let w = 0; w <= W; w++) {
                            cellMap[`${i}-${w}`].style.background = 'rgba(0,184,148,0.15)';
                        }
                        if (itemCards[i - 1]) {
                            itemCards[i - 1].style.background = 'var(--green)';
                            itemCards[i - 1].style.color = '#fff';
                        }
                    }
                }
                cellMap[`${n}-${W}`].style.background = 'var(--green)';
                cellMap[`${n}-${W}`].style.color = '#fff';
                resultEl.textContent = `최대 가치: ${dp[n][W]} → 선택: ${selected.reverse().map(i => items[i].name).join(', ')}`;
            }, (step + 1) * 150 + 300);
            state.timeouts.push(finalT);
        });

        reset();
    },

    // ===== 5단계 문제 구성 =====
    stages: [
        { num: 1, title: 'DP 입문', desc: '기본 점화식 연습', problemIds: ['boj-24416', 'boj-9184', 'boj-1463', 'boj-1904'] },
        { num: 2, title: '1차원 DP 심화', desc: '조건이 있는 1차원 DP', problemIds: ['boj-2579', 'boj-2156', 'boj-1912', 'boj-10844'] },
        { num: 3, title: '2차원 DP', desc: '테이블을 2차원으로 확장', problemIds: ['boj-1149', 'boj-1932'] },
        { num: 4, title: 'LIS 계열', desc: '최장 증가 부분 수열', problemIds: ['boj-11053', 'boj-11054', 'boj-2565'] },
        { num: 5, title: '고전 DP', desc: 'LCS, 배낭 문제', problemIds: ['boj-9251', 'boj-12865'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: DP 입문 ==========
        {
            id: 'boj-24416',
            title: 'BOJ 24416 - 알고리즘 수업: 피보나치 수 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24416',
            descriptionHTML: `
                <h3>문제</h3>
                <p>오늘도 서준이는 동적 프로그래밍 수업 조교를 하고 있다.</p>
                <p>재귀 호출로 피보나치 수를 구하는 코드와, 동적 프로그래밍으로 피보나치 수를 구하는 코드에서 각각 <strong>기본 연산의 실행 횟수</strong>를 구해보자.</p>
                <div class="problem-codes">
                    <div class="problem-code-block">
                        <h4>코드 1: 재귀</h4>
                        <pre><code class="language-cpp">fib(n) {
    if (n == 1 || n == 2)
        return 1;  // 기본 연산
    return fib(n-1) + fib(n-2);
}</code></pre>
                    </div>
                    <div class="problem-code-block">
                        <h4>코드 2: DP</h4>
                        <pre><code class="language-cpp">fib(n) {
    f[1] = f[2] = 1;
    for (i = 3; i <= n; i++)
        f[i] = f[i-1] + f[i-2]; // 기본 연산
    return f[n];
}</code></pre>
                    </div>
                </div>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 n이 주어진다. (5 ≤ n ≤ 40)</p></div>
                    <div><h4>출력</h4><p>재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 공백으로 구분하여 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5</pre></div>
                        <div><strong>출력</strong><pre>5 3</pre></div>
                    </div>
                </div>
            `,
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
                return `${fibRec(n)} ${n - 2}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# 여기에 풀이를 작성하세요\n# 재귀 호출의 기본 연산 횟수와 DP의 기본 연산 횟수를 구하세요\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\n// 여기에 풀이를 작성하세요\n\nint main() {\n    int n;\n    cin >> n;\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    // 여기에 풀이를 작성하세요\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        \n    }\n}`
            }
        },
        {
            id: 'boj-9184',
            title: 'BOJ 9184 - 신나는 함수 실행',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/9184',
            descriptionHTML: `
                <h3>문제</h3>
                <p>다음과 같은 재귀 함수 w(a, b, c)가 있다.</p>
                <div class="problem-code-block">
                    <h4>재귀 함수 w</h4>
                    <pre><code class="language-cpp">if a <= 0 or b <= 0 or c <= 0, return 1
if a > 20 or b > 20 or c > 20, return w(20, 20, 20)
if a < b and b < c, return w(a, b, c-1) + w(a, b-1, c-1) - w(a, b-1, c)
otherwise, return w(a-1, b, c) + w(a-1, b-1, c) + w(a-1, b, c-1) - w(a-1, b-1, c-1)</code></pre>
                </div>
                <p>이 함수를 구현하면 매우 느리다. 메모이제이션을 적용하여 빠르게 동작하도록 하라.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>각 줄에 a, b, c가 주어진다. (끝은 -1 -1 -1)</p></div>
                    <div><h4>출력</h4><p>각 입력에 대해 w(a, b, c)의 값을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>1 1 1
2 2 2
-1 -1 -1</pre></div>
                        <div><strong>출력</strong><pre>w(1, 1, 1) = 2
w(2, 2, 2) = 4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '이 문제는 재귀 함수가 이미 주어져 있습니다. 그대로 구현하되 <strong>메모이제이션</strong>만 추가하면 됩니다. 3차원 배열이나 딕셔너리를 사용하세요.' },
                { title: '상태 정의', content: '<code>dp[a][b][c]</code> = w(a, b, c)의 결과값. a, b, c가 0~20 범위이므로 <code>dp[21][21][21]</code> 크기면 충분합니다.' },
                { title: '점화식', content: '문제에서 주어진 조건 그대로:<br>• a,b,c 중 하나가 ≤ 0이면 1<br>• 하나라도 > 20이면 w(20,20,20)<br>• a < b < c이면 w(a,b,c-1) + w(a,b-1,c-1) - w(a,b-1,c)<br>• 나머지: w(a-1,b,c) + w(a-1,b-1,c) + w(a-1,b,c-1) - w(a-1,b-1,c-1)' },
                { title: '구현 팁', content: '함수 시작에서 <code>dp[a][b][c]</code>가 이미 계산되었는지 확인하고, 계산된 값이 있으면 바로 리턴합니다. 출력 형식에 주의: <code>w(a, b, c) = 결과</code> 형태입니다.' }
            ],
            inputLabel: 'a 값',
            inputMin: -1, inputMax: 50, inputDefault: 1,
            solve(a) {
                const memo = {};
                function w(a, b, c) {
                    if (a <= 0 || b <= 0 || c <= 0) return 1;
                    if (a > 20 || b > 20 || c > 20) return w(20, 20, 20);
                    const key = `${a},${b},${c}`;
                    if (memo[key] !== undefined) return memo[key];
                    let res;
                    if (a < b && b < c) res = w(a, b, c-1) + w(a, b-1, c-1) - w(a, b-1, c);
                    else res = w(a-1, b, c) + w(a-1, b-1, c) + w(a-1, b, c-1) - w(a-1, b-1, c-1);
                    memo[key] = res;
                    return res;
                }
                return `w(${a}, ${a}, ${a}) = ${w(a, a, a)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\n# 메모이제이션을 위한 3차원 배열 또는 딕셔너리\n# dp = [[[0]*21 for _ in range(21)] for _ in range(21)]\n\ndef w(a, b, c):\n    # 여기에 메모이제이션 적용한 함수를 작성하세요\n    pass\n\nwhile True:\n    a, b, c = map(int, input().split())\n    if a == -1 and b == -1 and c == -1:\n        break\n    print(f"w({a}, {b}, {c}) = {w(a, b, c)}")\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint dp[21][21][21];\nbool visited[21][21][21];\n\nint w(int a, int b, int c) {\n    // 여기에 메모이제이션 적용한 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int a, b, c;\n    while (cin >> a >> b >> c) {\n        if (a == -1 && b == -1 && c == -1) break;\n        printf("w(%d, %d, %d) = %d\\n", a, b, c, w(a, b, c));\n    }\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static int[][][] dp = new int[21][21][21];\n    static boolean[][][] visited = new boolean[21][21][21];\n    \n    static int w(int a, int b, int c) {\n        // 여기에 메모이제이션 적용한 함수를 작성하세요\n        return 0;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextInt()) {\n            int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n            if (a == -1 && b == -1 && c == -1) break;\n            System.out.printf("w(%d, %d, %d) = %d%n", a, b, c, w(a, b, c));\n        }\n    }\n}`
            }
        },
        {
            id: 'boj-1463',
            title: 'BOJ 1463 - 1로 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1463',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 X에 사용할 수 있는 연산은 다음 세 가지이다.</p>
                <ol>
                    <li>X가 3으로 나누어 떨어지면, 3으로 나눈다.</li>
                    <li>X가 2로 나누어 떨어지면, 2로 나눈다.</li>
                    <li>1을 뺀다.</li>
                </ol>
                <p>정수 N이 주어질 때, 위 연산을 적절히 사용하여 <strong>1을 만드는 데 필요한 최소 연산 횟수</strong>를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 정수 N (1 ≤ N ≤ 10<sup>6</sup>)</p></div>
                    <div><h4>출력</h4><p>최소 연산 횟수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10</pre></div>
                        <div><strong>출력</strong><pre>3</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '그리디하게 큰 수로 나누는 것이 항상 최적은 아닙니다 (예: 10). DP로 모든 경우를 고려해야 합니다.' },
                { title: '상태 정의', content: '<code>dp[i]</code> = 정수 i를 1로 만드는 데 필요한 <strong>최소 연산 횟수</strong>. dp[1] = 0 (이미 1이므로).' },
                { title: '점화식', content: '<code>dp[i] = dp[i-1] + 1</code> (1을 빼기)<br>i가 2로 나누어지면: <code>dp[i] = min(dp[i], dp[i/2] + 1)</code><br>i가 3으로 나누어지면: <code>dp[i] = min(dp[i], dp[i/3] + 1)</code>' },
                { title: '구현 팁', content: 'Bottom-Up으로 i=2부터 N까지 순회하면서 dp를 채웁니다. 초기값 dp[1]=0. 각 i에서 세 가지 연산을 모두 고려해서 최솟값을 저장합니다.' }
            ],
            inputLabel: '정수 N',
            inputMin: 1, inputMax: 1000000, inputDefault: 10,
            solve(n) {
                const dp = new Array(n + 1).fill(0);
                for (let i = 2; i <= n; i++) {
                    dp[i] = dp[i - 1] + 1;
                    if (i % 2 === 0) dp[i] = Math.min(dp[i], dp[i / 2] + 1);
                    if (i % 3 === 0) dp[i] = Math.min(dp[i], dp[i / 3] + 1);
                }
                return `${dp[n]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = i를 1로 만드는 최소 연산 횟수\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[1000001];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] dp = new int[n + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-1904',
            title: 'BOJ 1904 - 01타일',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1904',
            descriptionHTML: `
                <h3>문제</h3>
                <p>지원이에게 2진 수열이 있다. 이 수열은 0과 1로만 이루어져 있으며, 다음과 같은 타일로 만들 수 있다:</p>
                <ul>
                    <li><strong>1</strong> 타일 (길이 1)</li>
                    <li><strong>00</strong> 타일 (길이 2)</li>
                </ul>
                <p>길이가 N인 2진 수열의 개수를 15746으로 나눈 나머지를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 자연수 N (1 ≤ N ≤ 1,000,000)</p></div>
                    <div><h4>출력</h4><p>N길이 수열의 개수를 15746으로 나눈 나머지</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4</pre></div>
                        <div><strong>출력</strong><pre>5</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '길이 N인 수열의 마지막에 올 수 있는 타일을 생각해보세요. 마지막이 "1" 타일이면 나머지 길이는? "00" 타일이면?' },
                { title: '상태 정의', content: '<code>dp[i]</code> = 길이 i인 올바른 2진 수열의 개수' },
                { title: '점화식', content: '마지막에 "1"을 놓으면 앞에 길이 i-1의 수열이 와야 하고, "00"을 놓으면 앞에 길이 i-2의 수열이 와야 합니다.<br><code>dp[i] = (dp[i-1] + dp[i-2]) % 15746</code><br>이것은 피보나치 수열과 동일한 구조입니다!' },
                { title: '구현 팁', content: 'dp[1] = 1 ("1"), dp[2] = 2 ("11", "00"). 매 계산마다 <strong>15746으로 나머지</strong>를 취해야 합니다. N이 최대 100만이므로 배열 대신 변수 2개로 공간 최적화도 가능합니다.' }
            ],
            inputLabel: '길이 N',
            inputMin: 1, inputMax: 1000000, inputDefault: 4,
            solve(n) {
                if (n === 1) return '1';
                let a = 1, b = 2;
                for (let i = 3; i <= n; i++) { const t = (a + b) % 15746; a = b; b = t; }
                return `${b}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\n# dp[i] = 길이 i인 2진 수열의 개수\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },

        // ========== 2단계: 1차원 DP 심화 ==========
        {
            id: 'boj-2579',
            title: 'BOJ 2579 - 계단 오르기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2579',
            descriptionHTML: `
                <h3>문제</h3>
                <p>계단 오르기 게임은 계단 아래 시작점부터 꼭대기에 있는 도착점까지 가는 게임이다.</p>
                <p>규칙은 다음과 같다:</p>
                <ol>
                    <li>계단은 한 번에 한 계단씩 또는 두 계단씩 오를 수 있다.</li>
                    <li><strong>연속된 세 개의 계단을 모두 밟아서는 안 된다.</strong></li>
                    <li>마지막 도착 계단은 반드시 밟아야 한다.</li>
                </ol>
                <p>각 계단에 쓰여진 점수의 합이 최대가 되도록 계단을 밟자.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 계단의 수 N (1 ≤ N ≤ 300), 이후 N개의 줄에 계단 점수</p></div>
                    <div><h4>출력</h4><p>얻을 수 있는 총 점수의 최댓값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>6
10
20
15
25
10
20</pre></div>
                        <div><strong>출력</strong><pre>75</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '"연속 3개 불가" 조건이 핵심입니다. i번째 계단을 밟을 때, 바로 직전(i-1)도 밟았는지 여부에 따라 경우가 나뉩니다.' },
                { title: '상태 정의', content: '<code>dp[i]</code> = i번째 계단을 밟았을 때의 최대 점수.<br>i번째에 도달하는 방법은 두 가지:<br>① i-2에서 2칸 점프<br>② i-1에서 1칸 (단, i-1도 직전에서 1칸 온 건 불가)' },
                { title: '점화식', content: '경우 1: i-2 → i (2칸 점프): <code>dp[i-2] + score[i]</code><br>경우 2: i-3 → i-1 → i (1칸+1칸, 단 i-2는 안 밟음): <code>dp[i-3] + score[i-1] + score[i]</code><br><code>dp[i] = max(dp[i-2] + score[i], dp[i-3] + score[i-1] + score[i])</code>' },
                { title: '구현 팁', content: '초기값: dp[1] = score[1], dp[2] = score[1]+score[2], dp[3] = max(score[1], score[2])+score[3]. i=4부터 점화식을 적용하세요. 1-indexed가 편합니다.' }
            ],
            inputLabel: '계단 수 N',
            inputMin: 1, inputMax: 300, inputDefault: 6,
            solve(n) {
                const scores = [0, 10, 20, 15, 25, 10, 20];
                if (n > scores.length - 1) return '(테스트 입력 범위 초과)';
                const dp = new Array(n + 1).fill(0);
                dp[1] = scores[1];
                if (n >= 2) dp[2] = scores[1] + scores[2];
                if (n >= 3) dp[3] = Math.max(scores[1], scores[2]) + scores[3];
                for (let i = 4; i <= n; i++) {
                    dp[i] = Math.max(dp[i-2] + scores[i], dp[i-3] + scores[i-1] + scores[i]);
                }
                return `${dp[n]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nscores = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = i번째 계단을 밟았을 때 최대 점수\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint score[301], dp[301];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> score[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] score = new int[n + 1];\n        int[] dp = new int[n + 1];\n        for (int i = 1; i <= n; i++) score[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-2156',
            title: 'BOJ 2156 - 포도주 시식',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2156',
            descriptionHTML: `
                <h3>문제</h3>
                <p>효주는 포도주 시식회에 참석했다. N개의 포도주 잔이 순서대로 놓여 있고, 각 잔에는 일정량의 포도주가 들어 있다.</p>
                <p>규칙:</p>
                <ol>
                    <li>포도주 잔을 선택하면 그 잔을 모두 마셔야 한다.</li>
                    <li><strong>연속으로 놓여 있는 3잔을 모두 마실 수는 없다.</strong></li>
                </ol>
                <p>가장 많은 양의 포도주를 마실 수 있도록 하는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 포도주 잔의 수 n (1 ≤ n ≤ 10,000), 이후 n개의 줄에 각 잔의 포도주 양</p></div>
                    <div><h4>출력</h4><p>마실 수 있는 포도주의 최대 양</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>6
6
10
13
9
8
1</pre></div>
                        <div><strong>출력</strong><pre>33</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '계단 오르기와 비슷하지만 중요한 차이가 있습니다: <strong>마지막 잔을 반드시 마실 필요가 없습니다.</strong> 이 차이 때문에 점화식이 달라집니다.' },
                { title: '상태 정의', content: '<code>dp[i]</code> = 1번째부터 i번째 잔까지 고려했을 때 마실 수 있는 최대 양. (i번째를 안 마실 수도 있음!)' },
                { title: '점화식', content: 'i번째 잔에 대해 3가지 경우:<br>① i번째를 안 마심: <code>dp[i-1]</code><br>② i번째만 마심 (i-1은 안 마심): <code>dp[i-2] + wine[i]</code><br>③ i-1과 i를 연속 마심 (i-2는 안 마심): <code>dp[i-3] + wine[i-1] + wine[i]</code><br><code>dp[i] = max(dp[i-1], dp[i-2]+wine[i], dp[i-3]+wine[i-1]+wine[i])</code>' },
                { title: '구현 팁', content: '계단 오르기와 달리 "안 마시는" 경우(<code>dp[i-1]</code>)가 추가됩니다. 초기값 처리에 주의하고, n이 작을 때(1, 2)의 예외 처리를 잊지 마세요.' }
            ],
            inputLabel: '잔 수 n',
            inputMin: 1, inputMax: 10000, inputDefault: 6,
            solve(n) {
                const wine = [0, 6, 10, 13, 9, 8, 1];
                if (n > wine.length - 1) return '(테스트 입력 범위 초과)';
                const dp = new Array(n + 1).fill(0);
                dp[1] = wine[1];
                if (n >= 2) dp[2] = wine[1] + wine[2];
                for (let i = 3; i <= n; i++) {
                    dp[i] = Math.max(dp[i-1], dp[i-2] + wine[i], dp[i-3] + wine[i-1] + wine[i]);
                }
                return `${dp[n]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwine = [0] + [int(input()) for _ in range(n)]\n\n# dp[i] = i번째 잔까지 고려했을 때 최대 양\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint wine[10001], dp[10001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) cin >> wine[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] wine = new int[n + 1];\n        int[] dp = new int[n + 1];\n        for (int i = 1; i <= n; i++) wine[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-1912',
            title: 'BOJ 1912 - 연속합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1912',
            descriptionHTML: `
                <h3>문제</h3>
                <p>n개의 정수로 이루어진 임의의 수열이 주어진다. 이 중 연속된 몇 개의 수를 선택해서 구할 수 있는 합 중 가장 큰 합을 구하려고 한다.</p>
                <p>수는 한 개 이상 선택해야 한다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 정수 n (1 ≤ n ≤ 100,000), 둘째 줄에 n개의 정수 (절댓값 ≤ 1,000)</p></div>
                    <div><h4>출력</h4><p>연속합의 최댓값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10
10 -4 3 1 5 6 -35 12 21 -1</pre></div>
                        <div><strong>출력</strong><pre>33</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '이 문제는 "최대 부분 배열 합" (Maximum Subarray) 문제입니다. 카데인 알고리즘(Kadane\'s Algorithm)이라는 유명한 DP 기법으로 풀 수 있습니다.' },
                { title: '상태 정의', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막 원소로 포함하는</strong> 연속 부분 배열의 최대 합.' },
                { title: '점화식', content: 'i번째 원소에서 두 가지 선택:<br>① 이전 연속합에 이어 붙이기: <code>dp[i-1] + a[i]</code><br>② 여기서 새로 시작: <code>a[i]</code><br><code>dp[i] = max(dp[i-1] + a[i], a[i])</code><br>최종 답은 <code>max(dp[1], dp[2], ..., dp[n])</code>' },
                { title: '구현 팁', content: '배열 없이 변수 하나로도 가능합니다. <code>cur = max(cur + a[i], a[i])</code>, <code>ans = max(ans, cur)</code>. 음수만 있는 경우도 처리해야 합니다 (한 개는 반드시 선택).' }
            ],
            inputLabel: 'n 값',
            inputMin: 1, inputMax: 100000, inputDefault: 10,
            solve(n) {
                const arr = [10, -4, 3, 1, 5, 6, -35, 12, 21, -1];
                if (n > arr.length) return '(테스트 입력 범위 초과)';
                let cur = arr[0], ans = arr[0];
                for (let i = 1; i < n; i++) {
                    cur = Math.max(cur + arr[i], arr[i]);
                    ans = Math.max(ans, cur);
                }
                return `${ans}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = i번째를 마지막으로 하는 최대 연속합\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-10844',
            title: 'BOJ 10844 - 쉬운 계단 수',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10844',
            descriptionHTML: `
                <h3>문제</h3>
                <p>45656이란 수를 보자. 이 수는 인접한 모든 자릿수의 차이가 1이다. 이런 수를 계단 수라 한다.</p>
                <p>N이 주어질 때, 길이가 N인 계단 수가 총 몇 개 있는지 구하시오. (0으로 시작하는 수는 계단 수가 아니다)</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 100)</p></div>
                    <div><h4>출력</h4><p>길이가 N인 계단 수의 개수를 1,000,000,000으로 나눈 나머지</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>1</pre></div>
                        <div><strong>출력</strong><pre>9</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '마지막 자릿수가 무엇인지에 따라 다음에 올 수 있는 숫자가 달라집니다. 마지막 자릿수를 상태에 포함시켜야 합니다.' },
                { title: '상태 정의', content: '<code>dp[i][j]</code> = 길이가 i이고 마지막 자릿수가 j인 계단 수의 개수' },
                { title: '점화식', content: '마지막 자릿수가 j인 수 뒤에는 j-1 또는 j+1이 올 수 있습니다.<br>• j = 0일 때: 앞에 1만 가능 → <code>dp[i][0] = dp[i-1][1]</code><br>• j = 9일 때: 앞에 8만 가능 → <code>dp[i][9] = dp[i-1][8]</code><br>• 그 외: <code>dp[i][j] = dp[i-1][j-1] + dp[i-1][j+1]</code><br>결과: <code>sum(dp[N][0..9])</code> (단, 0으로 시작 불가는 초기값에서 처리)' },
                { title: '구현 팁', content: '초기값: dp[1][1~9] = 1, dp[1][0] = 0 (0으로 시작 불가). 매 계산마다 <code>% 1000000000</code>. 답은 dp[N][0]~dp[N][9]의 합입니다.' }
            ],
            inputLabel: '길이 N',
            inputMin: 1, inputMax: 100, inputDefault: 1,
            solve(n) {
                const MOD = 1000000000;
                const dp = Array.from({length: n + 1}, () => new Array(10).fill(0));
                for (let j = 1; j <= 9; j++) dp[1][j] = 1;
                for (let i = 2; i <= n; i++) {
                    dp[i][0] = dp[i-1][1];
                    dp[i][9] = dp[i-1][8];
                    for (let j = 1; j <= 8; j++) {
                        dp[i][j] = (dp[i-1][j-1] + dp[i-1][j+1]) % MOD;
                    }
                }
                let ans = 0;
                for (let j = 0; j <= 9; j++) ans = (ans + dp[n][j]) % MOD;
                return `${ans}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nMOD = 1_000_000_000\n\n# dp[i][j] = 길이 i, 마지막 자릿수 j인 계단 수의 개수\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nconst int MOD = 1000000000;\nlong long dp[101][10];\n\nint main() {\n    int n;\n    cin >> n;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long MOD = 1000000000;\n        long[][] dp = new long[n + 1][10];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },

        // ========== 3단계: 2차원 DP ==========
        {
            id: 'boj-1149',
            title: 'BOJ 1149 - RGB거리',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1149',
            descriptionHTML: `
                <h3>문제</h3>
                <p>RGB거리에는 집이 N개 있다. 각 집을 빨강, 초록, 파랑 중 하나로 칠해야 한다.</p>
                <p>규칙: <strong>이웃한 집은 같은 색이면 안 된다.</strong></p>
                <p>각 집을 특정 색으로 칠하는 비용이 주어질 때, 모든 집을 칠하는 비용의 최솟값을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 집의 수 N (2 ≤ N ≤ 1,000), 이후 N개의 줄에 R G B 비용</p></div>
                    <div><h4>출력</h4><p>모든 집을 칠하는 최소 비용</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3
26 40 83
49 60 57
13 89 99</pre></div>
                        <div><strong>출력</strong><pre>96</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'i번째 집의 색을 정할 때, i-1번째 집이 어떤 색인지에 따라 선택지가 달라집니다. 따라서 <strong>마지막에 칠한 색</strong>을 상태에 포함시켜야 합니다.' },
                { title: '상태 정의', content: '<code>dp[i][c]</code> = 1번째~i번째 집까지 칠했을 때, i번째 집을 색 c(R=0,G=1,B=2)로 칠한 경우의 최소 비용' },
                { title: '점화식', content: '이웃한 집은 다른 색이어야 하므로:<br><code>dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0]</code><br><code>dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1]</code><br><code>dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2]</code><br>답: <code>min(dp[N][0], dp[N][1], dp[N][2])</code>' },
                { title: '구현 팁', content: '초기값: dp[1][c] = cost[1][c]. 이전 행만 참조하므로 공간 최적화로 1차원 배열 2개만 써도 됩니다.' }
            ],
            inputLabel: '집의 수 N',
            inputMin: 2, inputMax: 1000, inputDefault: 3,
            solve(n) {
                const costs = [[26,40,83],[49,60,57],[13,89,99]];
                if (n > costs.length) return '(테스트 입력 범위 초과)';
                let dp = [...costs[0]];
                for (let i = 1; i < n; i++) {
                    const ndp = [
                        Math.min(dp[1], dp[2]) + costs[i][0],
                        Math.min(dp[0], dp[2]) + costs[i][1],
                        Math.min(dp[0], dp[1]) + costs[i][2]
                    ];
                    dp = ndp;
                }
                return `${Math.min(...dp)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][c] = i번째 집을 색 c로 칠했을 때 최소 비용\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint cost[1001][3], dp[1001][3];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> cost[i][0] >> cost[i][1] >> cost[i][2];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] cost = new int[n][3];\n        int[][] dp = new int[n][3];\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < 3; j++)\n                cost[i][j] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-1932',
            title: 'BOJ 1932 - 정수 삼각형',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1932',
            descriptionHTML: `
                <h3>문제</h3>
                <p>크기 n인 정수 삼각형이 있다. 맨 위에서 시작하여 아래로 내려올 때, 현재 위치에서 왼쪽 아래 또는 오른쪽 아래로만 이동할 수 있다.</p>
                <p>선택된 수의 합이 최대가 되는 경로를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 삼각형 크기 n (1 ≤ n ≤ 500), 이후 삼각형 정보</p></div>
                    <div><h4>출력</h4><p>합이 최대가 되는 경로의 합</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5</pre></div>
                        <div><strong>출력</strong><pre>30</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '위에서 아래로 내려가면서, 각 위치까지 도달했을 때의 최대 합을 구합니다. 각 위치는 위쪽의 왼쪽 또는 오른쪽에서 올 수 있습니다.' },
                { title: '상태 정의', content: '<code>dp[i][j]</code> = i행 j열까지 도달했을 때의 최대 합' },
                { title: '점화식', content: '<code>dp[i][j] = max(dp[i-1][j-1], dp[i-1][j]) + tri[i][j]</code><br>단, j=0이면 왼쪽 위는 없으므로 dp[i-1][j]만, j=i이면 오른쪽 위는 없으므로 dp[i-1][j-1]만 고려합니다.<br>답: <code>max(dp[n-1][0], dp[n-1][1], ..., dp[n-1][n-1])</code>' },
                { title: '구현 팁', content: 'Bottom-up으로 아래에서 위로 올라가며 풀 수도 있습니다. 그러면 마지막에 dp[0][0]이 답이 되어 더 간단합니다. 삼각형 배열을 직접 수정해도 됩니다.' }
            ],
            inputLabel: '삼각형 크기 n',
            inputMin: 1, inputMax: 500, inputDefault: 5,
            solve(n) {
                const tri = [[7],[3,8],[8,1,0],[2,7,4,4],[4,5,2,6,5]];
                if (n > tri.length) return '(테스트 입력 범위 초과)';
                const dp = tri.map(row => [...row]);
                for (let i = n - 2; i >= 0; i--) {
                    for (let j = 0; j <= i; j++) {
                        dp[i][j] += Math.max(dp[i+1][j], dp[i+1][j+1]);
                    }
                }
                return `${dp[0][0]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\ntri = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][j] = i행 j열까지의 최대 합\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint tri[501][501];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j <= i; j++)\n            cin >> tri[i][j];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] tri = new int[n][];\n        for (int i = 0; i < n; i++) {\n            tri[i] = new int[i + 1];\n            for (int j = 0; j <= i; j++)\n                tri[i][j] = sc.nextInt();\n        }\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },

        // ========== 4단계: LIS 계열 ==========
        {
            id: 'boj-11053',
            title: 'BOJ 11053 - 가장 긴 증가하는 부분 수열',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11053',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하시오.</p>
                <p>예를 들어, 수열 {10, 20, 10, 30, 20, 50}의 LIS는 {10, 20, 30, 50}이며 길이는 4이다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 수열 크기 N (1 ≤ N ≤ 1,000), 둘째 줄에 수열 A</p></div>
                    <div><h4>출력</h4><p>가장 긴 증가하는 부분 수열의 길이</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>6
10 20 10 30 20 50</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '각 위치에서 끝나는 LIS의 길이를 구합니다. i번째 원소 앞에 있는 원소들 중, 자기보다 작은 것들의 LIS 길이를 참고합니다.' },
                { title: '상태 정의', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> 가장 긴 증가하는 부분 수열의 길이' },
                { title: '점화식', content: '0 ≤ j < i인 모든 j에 대해, <code>A[j] < A[i]</code>이면:<br><code>dp[i] = max(dp[i], dp[j] + 1)</code><br>초기값: dp[i] = 1 (자기 자신만 포함)<br>답: <code>max(dp[0], dp[1], ..., dp[n-1])</code>' },
                { title: '구현 팁', content: '이중 for문으로 O(N²)에 풀 수 있습니다. N ≤ 1000이므로 충분합니다. 더 빠른 O(N log N) 풀이도 있지만, 이 문제에서는 O(N²)이면 됩니다.' }
            ],
            inputLabel: '수열 크기 N',
            inputMin: 1, inputMax: 1000, inputDefault: 6,
            solve(n) {
                const a = [10, 20, 10, 30, 20, 50];
                if (n > a.length) return '(테스트 입력 범위 초과)';
                const dp = new Array(n).fill(1);
                for (let i = 1; i < n; i++) {
                    for (let j = 0; j < i; j++) {
                        if (a[j] < a[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                    }
                }
                return `${Math.max(...dp)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# dp[i] = a[i]를 마지막으로 하는 LIS의 길이\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], dp[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n];\n        int[] dp = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-11054',
            title: 'BOJ 11054 - 가장 긴 바이토닉 부분 수열',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11054',
            descriptionHTML: `
                <h3>문제</h3>
                <p>바이토닉 수열이란 어떤 수를 기준으로 앞부분은 증가하고 뒷부분은 감소하는 수열이다.</p>
                <p>예를 들어, {1, 5, 2, 1}은 바이토닉 수열이다 (5를 기준).</p>
                <p>수열 A가 주어질 때, 가장 긴 바이토닉 부분 수열의 길이를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 수열 크기 N (1 ≤ N ≤ 1,000), 둘째 줄에 수열 A</p></div>
                    <div><h4>출력</h4><p>가장 긴 바이토닉 부분 수열의 길이</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10
1 5 2 1 4 3 4 5 2 1</pre></div>
                        <div><strong>출력</strong><pre>7</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '바이토닉 = 증가 + 감소. LIS를 응용하면 됩니다. 왼쪽에서의 LIS와 오른쪽에서의 LIS를 각각 구한 뒤 합치면 됩니다.' },
                { title: '상태 정의', content: '<code>lis[i]</code> = 왼쪽→오른쪽으로 보았을 때 a[i]로 끝나는 LIS 길이<br><code>lds[i]</code> = 오른쪽→왼쪽으로 보았을 때 a[i]로 끝나는 LIS 길이 (= a[i]에서 시작하는 최장 감소 수열)' },
                { title: '점화식', content: 'lis[i]: 앞에서와 동일한 LIS 점화식<br>lds[i]: 뒤에서부터 LIS를 구하는 것 (j > i이고 a[j] < a[i]이면 lds[i] = max(lds[i], lds[j]+1))<br>답: <code>max(lis[i] + lds[i] - 1)</code> (꼭짓점 i를 기준으로)' },
                { title: '구현 팁', content: 'LIS를 정방향, 역방향으로 두 번 구합니다. 두 배열의 합에서 1을 빼면 (꼭짓점이 중복이므로) 바이토닉 수열의 길이입니다.' }
            ],
            inputLabel: '수열 크기 N',
            inputMin: 1, inputMax: 1000, inputDefault: 10,
            solve(n) {
                const a = [1, 5, 2, 1, 4, 3, 4, 5, 2, 1];
                if (n > a.length) return '(테스트 입력 범위 초과)';
                const lis = new Array(n).fill(1);
                const lds = new Array(n).fill(1);
                for (let i = 1; i < n; i++)
                    for (let j = 0; j < i; j++)
                        if (a[j] < a[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
                for (let i = n - 2; i >= 0; i--)
                    for (let j = n - 1; j > i; j--)
                        if (a[j] < a[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
                let ans = 0;
                for (let i = 0; i < n; i++) ans = Math.max(ans, lis[i] + lds[i] - 1);
                return `${ans}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\na = list(map(int, input().split()))\n\n# lis[i] = 왼→우 LIS, lds[i] = 우→좌 LIS\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint a[1001], lis[1001], lds[1001];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] a = new int[n], lis = new int[n], lds = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-2565',
            title: 'BOJ 2565 - 전깃줄',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2565',
            descriptionHTML: `
                <h3>문제</h3>
                <p>두 전봇대 A와 B 사이에 전깃줄이 연결되어 있다. 전깃줄이 교차하지 않으려면 최소 몇 개의 전깃줄을 없애야 하는지 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 전깃줄 수 N (1 ≤ N ≤ 100), 이후 N줄에 A, B 전봇대 위치</p></div>
                    <div><h4>출력</h4><p>교차하지 않으려면 없애야 하는 전깃줄의 최소 개수</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
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
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '이 문제를 "교차하지 않는 전깃줄의 최대 개수"로 바꿔 생각하세요. 교차하지 않는 줄의 최대 개수를 K라 하면 답은 N - K입니다.' },
                { title: '상태 정의', content: 'A 전봇대 기준으로 오름차순 정렬합니다. 그러면 B의 값이 증가하는 순서대로 선택하면 교차가 없습니다. 이것은 <strong>B 배열의 LIS</strong> 문제와 같습니다!' },
                { title: '점화식', content: 'A 기준 정렬 후 B 배열에 대한 LIS를 구합니다.<br><code>dp[i]</code> = i번째 전깃줄을 마지막으로 포함하는 교차 없는 최대 전깃줄 수<br>LIS와 동일한 점화식을 적용합니다.<br>답: <code>N - max(dp)</code>' },
                { title: '구현 팁', content: '정렬이 핵심입니다! A 기준 정렬 후 B 값으로 LIS를 구하세요. N ≤ 100이므로 O(N²)이면 충분합니다.' }
            ],
            inputLabel: '전깃줄 수 N',
            inputMin: 1, inputMax: 100, inputDefault: 8,
            solve(n) {
                const wires = [[1,8],[3,9],[2,2],[4,1],[6,4],[10,10],[9,7],[7,6]];
                if (n > wires.length) return '(테스트 입력 범위 초과)';
                const sorted = wires.slice(0, n).sort((a, b) => a[0] - b[0]);
                const b = sorted.map(w => w[1]);
                const dp = new Array(n).fill(1);
                for (let i = 1; i < n; i++)
                    for (let j = 0; j < i; j++)
                        if (b[j] < b[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
                return `${n - Math.max(...dp)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nwires = [list(map(int, input().split())) for _ in range(n)]\n\n# A 기준 정렬 후 B에 대한 LIS\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\npair<int,int> wires[101];\nint dp[101];\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        cin >> wires[i].first >> wires[i].second;\n    sort(wires, wires + n);\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[][] wires = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            wires[i][0] = sc.nextInt();\n            wires[i][1] = sc.nextInt();\n        }\n        Arrays.sort(wires, (a, b) -> a[0] - b[0]);\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },

        // ========== 5단계: 고전 DP ==========
        {
            id: 'boj-9251',
            title: 'BOJ 9251 - LCS',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9251',
            descriptionHTML: `
                <h3>문제</h3>
                <p>LCS(Longest Common Subsequence, 최장 공통 부분 수열)은 두 수열 모두의 부분 수열 중 가장 긴 것을 찾는 문제이다.</p>
                <p>예를 들어, ACAYKP와 CAPCAK의 LCS는 ACAK이고 길이는 4이다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>두 줄에 걸쳐 두 문자열이 주어진다. (길이 ≤ 1,000, 대문자)</p></div>
                    <div><h4>출력</h4><p>LCS의 길이</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>ACAYKP
CAPCAK</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '두 문자열의 문자를 하나씩 비교해가며 2차원 테이블을 채웁니다. 문자가 같으면 대각선+1, 다르면 왼쪽이나 위쪽의 최대값을 취합니다.' },
                { title: '상태 정의', content: '<code>dp[i][j]</code> = 문자열 A의 처음 i글자와 문자열 B의 처음 j글자의 LCS 길이' },
                { title: '점화식', content: '• <code>A[i] == B[j]</code>이면: <code>dp[i][j] = dp[i-1][j-1] + 1</code><br>• <code>A[i] != B[j]</code>이면: <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code><br>답: <code>dp[len(A)][len(B)]</code>' },
                { title: '구현 팁', content: 'dp 테이블의 0행, 0열은 모두 0 (빈 문자열과의 LCS는 0). 1-indexed로 구현하면 편합니다. 공간 최적화로 2행만 써도 됩니다.' }
            ],
            inputLabel: '(내장 예제 사용)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                const a = 'ACAYKP', b = 'CAPCAK';
                const m = a.length, n = b.length;
                const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
                for (let i = 1; i <= m; i++) {
                    for (let j = 1; j <= n; j++) {
                        if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
                        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    }
                }
                return `${dp[m][n]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\na = input().strip()\nb = input().strip()\n\n# dp[i][j] = a[:i]와 b[:j]의 LCS 길이\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint dp[1001][1001];\n\nint main() {\n    string a, b;\n    cin >> a >> b;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next();\n        String b = sc.next();\n        int[][] dp = new int[a.length() + 1][b.length() + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        },
        {
            id: 'boj-12865',
            title: 'BOJ 12865 - 평범한 배낭',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12865',
            descriptionHTML: `
                <h3>문제</h3>
                <p>이 문제는 아주 유명한 <strong>0/1 배낭 문제 (Knapsack Problem)</strong>이다.</p>
                <p>N개의 물건이 있고, 각 물건은 무게 W와 가치 V를 가진다. 배낭의 최대 무게가 K일 때, 넣을 수 있는 물건들의 가치의 최대합을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 물건 수 N(1≤N≤100)과 최대 무게 K(1≤K≤100,000), 이후 N줄에 W, V</p></div>
                    <div><h4>출력</h4><p>배낭에 넣을 수 있는 물건들의 가치 합의 최댓값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 7
6 13
4 8
3 6
5 12</pre></div>
                        <div><strong>출력</strong><pre>14</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '각 물건을 넣거나 안 넣거나 (0/1) 선택합니다. 물건을 하나씩 고려하면서, 현재 남은 용량에 따라 최적의 선택을 합니다.' },
                { title: '상태 정의', content: '<code>dp[i][w]</code> = 처음 i개 물건까지 고려하고 배낭 용량이 w일 때의 최대 가치' },
                { title: '점화식', content: '• i번째 물건을 넣지 않는 경우: <code>dp[i][w] = dp[i-1][w]</code><br>• i번째 물건을 넣는 경우 (w ≥ W[i]): <code>dp[i][w] = dp[i-1][w - W[i]] + V[i]</code><br><code>dp[i][w] = max(dp[i-1][w], dp[i-1][w - W[i]] + V[i])</code><br>답: <code>dp[N][K]</code>' },
                { title: '구현 팁', content: '1차원 배열로 공간 최적화가 가능합니다. <code>dp[w]</code>를 w를 K부터 W[i]까지 <strong>역순</strong>으로 순회하면서 갱신합니다. 역순인 이유: 같은 물건을 두 번 넣는 것을 방지합니다.' }
            ],
            inputLabel: '(내장 예제 사용)',
            inputMin: 0, inputMax: 0, inputDefault: 0,
            solve() {
                const items = [[6,13],[4,8],[3,6],[5,12]];
                const K = 7;
                const dp = new Array(K + 1).fill(0);
                for (const [w, v] of items) {
                    for (let j = K; j >= w; j--) {
                        dp[j] = Math.max(dp[j], dp[j - w] + v);
                    }
                }
                return `${dp[K]}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn, k = map(int, input().split())\nitems = [list(map(int, input().split())) for _ in range(n)]\n\n# dp[i][w] = i번째까지 고려, 용량 w일 때 최대 가치\n# 여기에 풀이를 작성하세요\n`,
                cpp: `#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint dp[100001];\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // 여기에 풀이를 작성하세요\n    \n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), k = sc.nextInt();\n        int[] dp = new int[k + 1];\n        // 여기에 풀이를 작성하세요\n        \n    }\n}`
            }
        }
    ],

    // ===== 문제풀이 렌더링 (목록 보기) =====
    renderProblem(container) {
        container.innerHTML = '';

        // 단계별 섹션 렌더링
        this.stages.forEach(stage => {
            const section = document.createElement('div');
            section.className = 'stage-section';

            section.innerHTML = `
                <div class="stage-header">
                    <span class="stage-num">${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <span class="stage-desc">${stage.desc}</span>
                </div>
            `;

            const cardsDiv = document.createElement('div');
            cardsDiv.className = 'problem-cards';

            stage.problemIds.forEach(pid => {
                const problem = this.problems.find(p => p.id === pid);
                if (!problem) return;

                const card = document.createElement('div');
                card.className = 'problem-card';
                const bojNum = problem.id.replace('boj-', '');
                card.innerHTML = `
                    <span class="card-num">#${bojNum}</span>
                    <span class="card-title">${problem.title.replace(/BOJ \d+ - /, '')}</span>
                    <span class="card-diff ${problem.difficulty}">${problem.difficulty === 'silver' ? '실버' : '골드'}</span>
                `;
                card.addEventListener('click', () => {
                    this._renderProblemDetail(container, problem);
                });
                cardsDiv.appendChild(card);
            });

            section.appendChild(cardsDiv);
            container.appendChild(section);
        });
    },

    // ===== 문제 상세 보기 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        // 뒤로가기 버튼
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        // 문제 헤더
        const header = document.createElement('div');
        header.className = 'problem-header';
        header.innerHTML = `
            <h2>${problem.title}</h2>
            <a href="${problem.link}" target="_blank" class="btn btn-link">문제 원본 보기 →</a>
        `;
        container.appendChild(header);

        // 문제 설명
        const desc = document.createElement('div');
        desc.className = 'problem-description';
        desc.innerHTML = problem.descriptionHTML;
        container.appendChild(desc);

        // 단계별 힌트
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>💡 단계별 힌트</h3>';

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';

        const openedState = new Array(problem.hints.length).fill(false);

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▼</span>
                </div>
                <div class="hint-step-body">${hint.content}</div>
            `;

            const headerEl = step.querySelector('.hint-step-header');
            headerEl.addEventListener('click', () => {
                if (step.classList.contains('locked')) return;

                if (openedState[idx]) {
                    // 닫기
                    step.classList.remove('opened');
                    openedState[idx] = false;
                } else {
                    // 열기
                    step.classList.add('opened');
                    openedState[idx] = true;
                    // 다음 힌트 잠금 해제
                    if (idx + 1 < problem.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });

            hintsDiv.appendChild(step);
        });

        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        // 풀이 영역
        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header">
                <h3>풀이 작성</h3>
                <select id="lang-select">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions">
                ${problem.inputMin !== problem.inputMax ? `
                    <div class="input-group">
                        <label>${problem.inputLabel}</label>
                        <input type="number" id="test-input" value="${problem.inputDefault}" min="${problem.inputMin}" max="${problem.inputMax}">
                    </div>
                ` : ''}
                <button id="run-btn" class="btn btn-primary">▶ 실행</button>
                <button id="check-btn" class="btn btn-success">✓ 정답 확인</button>
            </div>
            <div id="output-area" class="output-area">
                <div class="output-label">실행 결과</div>
                <pre id="output-text"></pre>
            </div>
        `;
        container.appendChild(solveArea);

        // 코드 하이라이팅
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

        // 에디터 초기화
        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        // Tab 지원
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        // 실행 버튼
        container.querySelector('#run-btn').addEventListener('click', () => {
            const inputEl = container.querySelector('#test-input');
            const n = inputEl ? parseInt(inputEl.value) : 0;
            if (inputEl && (isNaN(n) || n < problem.inputMin || n > problem.inputMax)) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ 입력 ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${inputEl ? n : '(내장 예제)'}\n예상 정답: ${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        // 정답 확인 버튼
        container.querySelector('#check-btn').addEventListener('click', () => {
            const inputEl = container.querySelector('#test-input');
            const n = inputEl ? parseInt(inputEl.value) : 0;
            if (inputEl && (isNaN(n) || n < problem.inputMin || n > problem.inputMax)) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ 입력 ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const code = editor.value.trim();
            if (!code || code === problem.templates[langSelect.value].trim()) {
                this._showOutput(container, '코드를 먼저 작성해주세요!', 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${inputEl ? n : '(내장 예제)'}\n예상 정답: ${expected}\n\n💡 코드를 BOJ에 제출하여 정답을 확인하세요!\n위 예상 정답과 비교하여 코드를 검증해보세요.`);
        });
    },

    _showOutput(container, text, status = '') {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    },

    // ===== 유틸리티 =====
    _fib(n) {
        if (n <= 2) return 1;
        return this._fib(n - 1) + this._fib(n - 2);
    },

    // ===== 시각화 내부 로직 =====
    _vizState: {
        running: false,
        paused: false,
        timeouts: [],
        recursiveCalls: 0,
        dpCalls: 0
    },

    _initVisualization(container) {
        const state = this._vizState;
        const nSlider = container.querySelector('#viz-n-slider');
        const nLabel = container.querySelector('#viz-n-label');
        const speedSlider = container.querySelector('#viz-speed');

        const reset = () => {
            state.timeouts.forEach(t => clearTimeout(t));
            state.timeouts = [];
            state.running = false;
            state.paused = false;
            state.recursiveCalls = 0;
            state.dpCalls = 0;
            container.querySelector('#recursive-call-count').textContent = '0';
            container.querySelector('#dp-call-count').textContent = '0';
            container.querySelector('#viz-play').disabled = false;
            container.querySelector('#viz-pause').disabled = true;
            container.querySelector('#tree-svg').innerHTML = '';
            container.querySelector('#dp-table-container').innerHTML = '';
            container.querySelector('#dp-formula').textContent = '';
        };

        const getDelay = () => [800, 600, 400, 250, 120][parseInt(speedSlider.value) - 1];

        nSlider.addEventListener('input', () => {
            nLabel.textContent = nSlider.value;
            reset();
        });

        container.querySelector('#viz-reset').addEventListener('click', reset);
        container.querySelector('#viz-pause').addEventListener('click', () => {
            if (state.running && !state.paused) {
                state.paused = true;
                state.timeouts.forEach(t => clearTimeout(t));
                state.timeouts = [];
            }
        });

        container.querySelector('#viz-play').addEventListener('click', () => {
            reset();
            const n = parseInt(nSlider.value);
            state.running = true;
            container.querySelector('#viz-play').disabled = true;
            container.querySelector('#viz-pause').disabled = false;

            const treeSvg = container.querySelector('#tree-svg');
            const tree = this._buildTree(n);
            const positions = this._layoutTree(tree);
            this._drawTree(treeSvg, tree, positions);
            this._animateTree(container, treeSvg, tree, positions, getDelay());

            const dpContainer = container.querySelector('#dp-table-container');
            const cells = this._buildDPTable(dpContainer, n);
            this._animateDPTable(container, cells, n, getDelay());
        });
    },

    _buildTree(n, id = 0) {
        const node = { n, id, children: [] };
        if (n > 2) {
            node.children.push(this._buildTree(n - 1, id * 2 + 1));
            node.children.push(this._buildTree(n - 2, id * 2 + 2));
        }
        return node;
    },

    _layoutTree(node, depth = 0, positions = {}, counter = { val: 0 }) {
        if (node.children.length > 0) {
            node.children.forEach(child => this._layoutTree(child, depth + 1, positions, counter));
        }
        positions[node.id] = { x: counter.val * 50, y: depth * 60, n: node.n, id: node.id };
        counter.val++;
        return positions;
    },

    _drawTree(svg, tree, positions) {
        const posArray = Object.values(positions);
        const minX = Math.min(...posArray.map(p => p.x));
        const maxX = Math.max(...posArray.map(p => p.x));
        const maxY = Math.max(...posArray.map(p => p.y));
        const padding = 30;

        svg.setAttribute('viewBox', `${minX - padding} ${-padding} ${maxX - minX + padding * 2} ${maxY + padding * 2 + 20}`);
        svg.style.height = Math.min(maxY + padding * 2 + 20, 420) + 'px';

        const drawEdges = (node) => {
            node.children.forEach(child => {
                const p1 = positions[node.id], p2 = positions[child.id];
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
                line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
                line.classList.add('tree-edge');
                line.style.opacity = '0';
                line.dataset.childId = child.id;
                svg.appendChild(line);
                drawEdges(child);
            });
        };
        drawEdges(tree);

        for (const pos of posArray) {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.classList.add('tree-node');
            g.style.opacity = '0';
            g.dataset.nodeId = pos.id;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 18);
            circle.setAttribute('fill', 'var(--bg3)'); circle.setAttribute('stroke', 'var(--bg3)');

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
            text.textContent = `f(${pos.n})`;

            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);
        }
    },

    _getTraversalOrder(node, order = []) {
        order.push(node);
        if (node.children.length > 0) {
            this._getTraversalOrder(node.children[0], order);
            this._getTraversalOrder(node.children[1], order);
        }
        return order;
    },

    _animateTree(container, svg, tree, positions, delay) {
        const state = this._vizState;
        const order = this._getTraversalOrder(tree);
        const seen = new Set();

        order.forEach((node, i) => {
            const t = setTimeout(() => {
                if (state.paused) return;
                const g = svg.querySelector(`[data-node-id="${node.id}"]`);
                if (!g) return;
                g.style.opacity = '1';
                g.style.transition = 'opacity 0.3s';

                const circle = g.querySelector('circle');
                const isBase = node.n <= 2;
                const isDup = seen.has(node.n);

                if (isBase) {
                    circle.setAttribute('fill', 'var(--green)');
                    circle.setAttribute('stroke', 'var(--green)');
                    state.recursiveCalls++;
                    container.querySelector('#recursive-call-count').textContent = state.recursiveCalls;
                } else if (isDup) {
                    circle.setAttribute('fill', 'var(--red)');
                    circle.setAttribute('stroke', 'var(--red)');
                    circle.style.animation = 'pulse 0.5s';
                } else {
                    circle.setAttribute('fill', 'var(--accent)');
                    circle.setAttribute('stroke', 'var(--accent)');
                }
                seen.add(node.n);

                const edge = svg.querySelector(`line[data-child-id="${node.id}"]`);
                if (edge) {
                    edge.style.opacity = '1';
                    edge.style.transition = 'opacity 0.3s';
                    edge.style.stroke = (isDup && !isBase) ? 'var(--red)' : 'var(--text2)';
                }
            }, i * delay);
            state.timeouts.push(t);
        });
    },

    _buildDPTable(container, n) {
        container.innerHTML = '';
        const cells = [];
        for (let i = 1; i <= n; i++) {
            const cell = document.createElement('div');
            cell.className = 'dp-cell';
            cell.innerHTML = `<div class="dp-cell-index">f(${i})</div><div class="dp-cell-value">?</div>`;
            container.appendChild(cell);
            cells.push(cell);
        }
        return cells;
    },

    _animateDPTable(container, cells, n, delay) {
        const state = this._vizState;
        const dpFormula = container.querySelector('#dp-formula');
        const dpValues = new Array(n + 1).fill(0);
        dpValues[1] = 1; dpValues[2] = 1;

        const t1 = setTimeout(() => {
            if (state.paused) return;
            cells[0].classList.add('base');
            cells[0].querySelector('.dp-cell-value').textContent = '1';
            dpFormula.textContent = 'f(1) = 1 (기저 조건)';
        }, delay);
        state.timeouts.push(t1);

        if (n >= 2) {
            const t2 = setTimeout(() => {
                if (state.paused) return;
                cells[1].classList.add('base');
                cells[1].querySelector('.dp-cell-value').textContent = '1';
                dpFormula.textContent = 'f(2) = 1 (기저 조건)';
            }, delay * 2);
            state.timeouts.push(t2);
        }

        for (let i = 3; i <= n; i++) {
            const step = i;
            const t = setTimeout(() => {
                if (state.paused) return;
                dpValues[step] = dpValues[step - 1] + dpValues[step - 2];
                cells[step - 2].classList.add('active');
                cells[step - 3].classList.add('active');
                cells[step - 1].classList.add('active', 'filled');
                cells[step - 1].querySelector('.dp-cell-value').textContent = dpValues[step];
                dpFormula.textContent = `f(${step}) = f(${step-1}) + f(${step-2}) = ${dpValues[step-1]} + ${dpValues[step-2]} = ${dpValues[step]}`;
                state.dpCalls++;
                container.querySelector('#dp-call-count').textContent = state.dpCalls;

                setTimeout(() => {
                    cells[step - 2].classList.remove('active');
                    cells[step - 3].classList.remove('active');
                    cells[step - 1].classList.remove('active');
                }, delay * 0.7);
            }, delay * step);
            state.timeouts.push(t);
        }
    }
};

// 전역 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.dp = dpTopic;
