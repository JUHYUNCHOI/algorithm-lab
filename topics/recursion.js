// Recursion Topic Module
const recursionTopic = {
    id: 'recursion',
    title: '재귀 함수',
    icon: '🔄',
    category: '재귀와 트리',
    order: 8,
    description: '자기 자신을 호출하여 문제를 쪼개는 기법',
    relatedNote: '재귀는 트리 순회, 백트래킹, 분할정복, DP(메모이제이션) 등 거의 모든 알고리즘의 기반이 됩니다.',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>재귀 함수 (Recursion)</h2>
                <p class="hero-sub">함수가 자기 자신을 다시 불러서 문제를 점점 작게 쪼개는 방법</p>
            </div>

            <!-- ① 재귀란 무엇인가? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 재귀란 무엇인가?</div>
                <div class="analogy-box matryoshka-section">
                    <strong>비유로 이해하기:</strong> 러시아 인형(마트료시카)을 생각해보세요.

                    <div class="matryoshka-container">
                        <div class="matryoshka-dolls" id="matryoshka-dolls">
                            <div class="doll-wrapper" data-doll="0">
                                <div class="doll" style="--doll-size:90px;--doll-color:var(--accent);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(5)</div>
                                    <div class="doll-value">5 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="1">
                                <div class="doll" style="--doll-size:76px;--doll-color:var(--blue);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(4)</div>
                                    <div class="doll-value">4 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="2">
                                <div class="doll" style="--doll-size:62px;--doll-color:var(--yellow-vivid);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(3)</div>
                                    <div class="doll-value">3 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="3">
                                <div class="doll" style="--doll-size:50px;--doll-color:var(--red);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(2)</div>
                                    <div class="doll-value">2 × ?</div>
                                </div>
                                <div class="doll-arrow">→</div>
                            </div>
                            <div class="doll-wrapper hidden" data-doll="4">
                                <div class="doll base-case" style="--doll-size:40px;--doll-color:var(--green);">
                                    <div class="doll-body"><div class="doll-face"></div></div>
                                    <div class="doll-label">factorial(1)</div>
                                    <div class="doll-value">= 1 ✓</div>
                                </div>
                            </div>
                        </div>
                        <div class="matryoshka-instruction" id="matryoshka-instruction">👆 인형을 클릭하여 열어보세요!</div>
                        <button class="matryoshka-reset hidden" id="matryoshka-reset">↺ 다시 보기</button>
                    </div>

                    <div class="matryoshka-text">
                        큰 인형을 열면 작은 인형이 나오고, 그 안에 더 작은 인형이 있고...<br>
                        가장 작은 인형 — 더 이상 열 수 없는 것(<strong>멈추는 조건</strong>)을 만나면 끝!<br>
                        재귀도 똑같습니다. <strong>함수가 자기 자신을 다시 부르면서</strong>
                        문제를 점점 작게 만들다가, <strong>멈추는 조건</strong>에서 딱 멈춥니다.
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">5! (5 팩토리얼)을 재귀로 표현하면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <code>5! = 5 × 4!</code><br>
                        <code>4! = 4 × 3!</code><br>
                        <code>3! = 3 × 2!</code><br>
                        <code>2! = 2 × 1!</code><br>
                        <code>1! = 1</code> ← <strong>여기서 멈춤!</strong><br><br>
                        즉, <code>factorial(n) = n × factorial(n-1)</code>이고,<br>
                        <code>factorial(1) = 1</code>이 되면 더 이상 부르지 않습니다.
                    </div>
                </div>
            </div>

            <!-- ② 재귀의 두 가지 필수 요소 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 재귀에 꼭 필요한 두 가지</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="25" y="25" width="30" height="30" rx="6" fill="none" stroke="var(--red)" stroke-width="3"/>
                                <line x1="35" y1="35" x2="45" y2="45" stroke="var(--red)" stroke-width="3"/>
                                <line x1="45" y1="35" x2="35" y2="45" stroke="var(--red)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>🛑 멈추는 조건</h3>
                        <p>재귀를 <strong>멈추는 조건</strong>. 이것이 없으면 무한히 자기를 부릅니다!</p>
                        <div class="code-block"><pre><code class="language-python">def factorial(n):
    if n <= 1:      # ← 여기서 멈춤!
        return 1</code></pre></div>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M40 15 A25 25 0 1 1 39 15" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <polygon points="35,12 40,20 45,12" fill="var(--accent)"/>
                            </svg>
                        </div>
                        <h3>🔄 자기 자신 부르기</h3>
                        <p>자기 자신을 다시 부르되, <strong>문제를 더 작게</strong> 만들어야 합니다!</p>
                        <div class="code-block"><pre><code class="language-python">def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)  # ← 재귀!</code></pre></div>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">멈추는 조건 없이 factorial(5)를 부르면 어떻게 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>끝없이 자기 자신을 부릅니다!</strong><br>
                        factorial(5) → factorial(4) → ... → factorial(0) → factorial(-1) → factorial(-2) → ...<br><br>
                        멈추라는 말이 없으니까 계속 가는 겁니다! 결국 컴퓨터가 "너무 많이 불렀어!" 하고 에러를 냅니다.<br>
                        그래서 멈추는 조건은 <strong>반드시</strong> 있어야 합니다.
                    </div>
                </div>
            </div>

            <!-- ③ 재귀의 동작 원리: 콜 스택 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 재귀는 어떻게 동작할까?</div>
                <p style="margin-bottom: 1rem;">함수가 자기를 부를 때마다 <strong>접시처럼 쌓입니다</strong>. 멈추는 조건에 도달하면 위에서부터 하나씩 꺼내며 답을 돌려줍니다.</p>

                <div class="execution-flow-compare">
                    <div class="flow-grid">
                        <div class="flow-card topdown-flow">
                            <div class="flow-label">📥 부르는 단계 (접시 쌓기)</div>
                            <div class="flow-trace">
                                <div>factorial(4) 호출</div>
                                <div>&nbsp;&nbsp;→ factorial(3) 호출</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;→ factorial(2) 호출</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ factorial(1) 호출</div>
                                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ return 1 (멈춤!)</div>
                            </div>
                        </div>
                        <div class="flow-card bottomup-flow">
                            <div class="flow-label">📤 돌려주는 단계 (접시 꺼내기)</div>
                            <div class="flow-trace">
                                <div>factorial(1) = 1</div>
                                <div>factorial(2) = 2 × 1 = 2</div>
                                <div>factorial(3) = 3 × 2 = 6</div>
                                <div>factorial(4) = 4 × 6 = <strong>24</strong></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="key-difference-box">
                    <div>📥 <strong>부르기</strong>: 큰 문제 → 작은 문제로 파고듭니다 (접시가 쌓입니다)</div>
                    <div>📤 <strong>돌려주기</strong>: 멈추는 조건부터 거꾸로 답을 돌려줍니다 (접시를 꺼냅니다)</div>
                    <div>💡 너무 많이 쌓이면? 컴퓨터가 감당을 못합니다! (파이썬은 최대 1000번까지)</div>
                </div>
            </div>

            <!-- ④ 재귀 vs 반복문 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 재귀 vs 반복문</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔄 재귀 (Recursion)</h3>
                        <p class="approach-desc">자기 자신을 부르는 방법. 코드가 짧고 읽기 쉽습니다</p>
                        <div class="code-block"><pre><code class="language-python">def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)</code></pre></div>
                    </div>
                    <div class="approach-card">
                        <h3>🔁 반복문 (Iteration)</h3>
                        <p class="approach-desc">for/while 반복문 사용. 빠르지만 코드가 길어질 수 있습니다</p>
                        <div class="code-block"><pre><code class="language-python">def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result</code></pre></div>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">팩토리얼은 반복문이 더 쉬운데, 재귀는 언제 유리할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        재귀가 빛나는 경우:<br>
                        <strong>1. 같은 모양이 반복되는 그림</strong> — 별 찍기, 칸토어 집합처럼 큰 것 안에 작은 것이 있는 패턴<br>
                        <strong>2. 반으로 쪼개는 문제</strong> — 정렬할 때 반씩 나누어 정리하기<br>
                        <strong>3. 하노이 탑</strong> — 반복문으로 짜면 매우 복잡하지만 재귀는 단 3줄!<br>
                        <strong>4. 미로 탐색</strong> — 갈림길에서 한 쪽을 먼저 끝까지 가보기<br><br>
                        정리: <strong>문제 안에 같은 종류의 작은 문제</strong>가 들어있으면 재귀를 쓰세요!
                    </div>
                </div>
            </div>

            <!-- ⑤ 재귀 문제 풀이 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 재귀 문제 푸는 3단계</div>
                <div class="step-cards">
                    <div class="step-card">
                        <span class="step-num">1</span>
                        <h4>언제 멈출지 정하기</h4>
                        <p>가장 쉬운 경우의 답을 바로 알려주기</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">2</span>
                        <h4>반복 규칙 찾기</h4>
                        <p>"큰 문제 = 작은 문제 + 작은 문제" 형태 만들기</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">3</span>
                        <h4>점점 작게 만들기</h4>
                        <p>부를 때마다 반드시 멈추는 조건에 가까워지기!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">피보나치 수를 위 3단계로 정리해보세요.</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>1. 멈추는 조건:</strong> fib(0) = 0, fib(1) = 1<br>
                        <strong>2. 반복 규칙:</strong> fib(n) = fib(n-1) + fib(n-2)<br>
                        <strong>3. 점점 작게:</strong> n → n-1, n-2 (매번 줄어듦)<br><br>
                        이 패턴을 잘 기억하세요! 나중에 DP를 배울 때 그대로 쓰게 됩니다.
                    </div>
                </div>
            </div>
        `;

        // 인터랙티브 요소 초기화
        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        // Think-box 토글
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });

        // 마트료시카 인형 인터랙션
        const dollContainer = container.querySelector('#matryoshka-dolls');
        const instructionEl = container.querySelector('#matryoshka-instruction');
        const resetBtn = container.querySelector('#matryoshka-reset');

        if (dollContainer) {
            const wrappers = dollContainer.querySelectorAll('.doll-wrapper');
            const factValues = [120, 24, 6, 2, 1];
            let currentDoll = 0;
            let phase = 'open';
            let returnIdx = 4;

            const advance = () => {
                if (phase === 'open' && currentDoll < wrappers.length - 1) {
                    wrappers[currentDoll].classList.add('opening');
                    setTimeout(() => {
                        wrappers[currentDoll].classList.remove('opening');
                        wrappers[currentDoll].classList.add('opened');
                        currentDoll++;
                        wrappers[currentDoll].classList.remove('hidden');
                        if (currentDoll === wrappers.length - 1) {
                            phase = 'return';
                            returnIdx = wrappers.length - 1;
                            instructionEl.textContent = '🎯 멈추는 조건 도달! 클릭하여 값을 되돌려 보세요';
                            instructionEl.classList.add('phase-return');
                        } else {
                            instructionEl.textContent = '👆 계속 클릭하여 다음 인형을 열어보세요';
                        }
                    }, 350);
                } else if (phase === 'return') {
                    const w = wrappers[returnIdx];
                    const valueEl = w.querySelector('.doll-value');
                    w.classList.remove('opened');
                    w.classList.add('returned');
                    valueEl.textContent = '= ' + factValues[returnIdx];
                    returnIdx--;
                    if (returnIdx < 0) {
                        instructionEl.textContent = '✅ 완료! factorial(5) = 120';
                        resetBtn.classList.remove('hidden');
                        phase = 'done';
                    } else {
                        instructionEl.textContent = '📤 값이 반환되었습니다. 계속 클릭!';
                    }
                }
            };

            dollContainer.addEventListener('click', () => {
                if (phase !== 'done') advance();
            });

            resetBtn.addEventListener('click', () => {
                const labels = [5, 4, 3, 2, 1];
                wrappers.forEach((w, i) => {
                    w.classList.remove('opening', 'opened', 'returned');
                    if (i > 0) w.classList.add('hidden');
                    const v = w.querySelector('.doll-value');
                    v.textContent = labels[i] === 1 ? '= 1 ✓' : labels[i] + ' × ?';
                });
                currentDoll = 0;
                phase = 'open';
                returnIdx = 4;
                instructionEl.textContent = '👆 인형을 클릭하여 열어보세요!';
                instructionEl.classList.remove('phase-return');
                resetBtn.classList.add('hidden');
            });
        }
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>재귀 시각화</h2>
            <div class="viz-type-selector">
                <button class="viz-type-btn active" data-viz="factorial">팩토리얼</button>
                <button class="viz-type-btn" data-viz="fibonacci">피보나치</button>
                <button class="viz-type-btn" data-viz="hanoi">하노이 탑</button>
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

        switchViz('factorial');
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

    _renderVizType(el, type) {
        switch(type) {
            case 'factorial': this._renderVizFactorial(el); break;
            case 'fibonacci': this._renderVizFibonacci(el); break;
            case 'hanoi': this._renderVizHanoi(el); break;
        }
    },

    _createStepControls() {
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button>
                <span id="viz-step-counter" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>
        `;
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

    // ===== 팩토리얼 시각화 =====
    _renderVizFactorial(el) {
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>n = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="1" max="10" value="${n}">
                    </div>
                </div>
                <div class="viz-panels-grid">
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>콜 스택</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-stack" class="viz-call-stack"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>호출 로그</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-log" class="viz-call-log"></div>
                        </div>
                    </div>
                </div>
                ${this._createStepControls()}
            `;

            const stackEl = el.querySelector('#call-stack');
            const logEl = el.querySelector('#call-log');

            // 팩토리얼 값 미리 계산
            const fact = [1];
            for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

            const steps = [];
            const stackFrames = [];
            const logLines = [];

            // 호출 단계: n → n-1 → ... → 1
            for (let i = n; i >= 1; i--) {
                const ci = i;
                steps.push({
                    description: ci === 1
                        ? `factorial(1) 호출 → 멈추는 조건! return 1`
                        : `factorial(${ci}) 호출 → ${ci} × factorial(${ci - 1})이 필요, 더 파고듦`,
                    action() {
                        const frame = document.createElement('div');
                        frame.className = 'stack-frame' + (ci === 1 ? ' base' : '');
                        frame.textContent = ci === 1 ? `factorial(1) = 1 ✓` : `factorial(${ci}) = ${ci} × ?`;
                        stackEl.prepend(frame);
                        stackFrames.push(frame);
                        const line = document.createElement('div');
                        line.className = 'log-line call';
                        line.textContent = '\u00A0\u00A0'.repeat(n - ci) + `→ factorial(${ci}) 호출`;
                        logEl.appendChild(line);
                        logLines.push(line);
                        logEl.scrollTop = logEl.scrollHeight;
                    },
                    undo() {
                        const frame = stackFrames.pop();
                        if (frame) frame.remove();
                        const line = logLines.pop();
                        if (line) line.remove();
                    }
                });
            }

            // 반환 단계: 1 → 2 → ... → n
            for (let i = 1; i <= n; i++) {
                const ci = i;
                steps.push({
                    description: ci === 1
                        ? `factorial(1) = 1 반환 (멈추는 조건)`
                        : `factorial(${ci}) = ${ci} × ${fact[ci - 1]} = ${fact[ci]} 반환`,
                    action() {
                        // 스택 맨 위 프레임 갱신 후 제거
                        const topFrame = stackEl.firstChild;
                        if (topFrame) {
                            topFrame.textContent = `factorial(${ci}) = ${fact[ci]} ✓`;
                            topFrame.classList.add('returning');
                        }
                        const line = document.createElement('div');
                        line.className = 'log-line return-val';
                        line.textContent = '\u00A0\u00A0'.repeat(n - ci) + `← factorial(${ci}) = ${fact[ci]}`;
                        logEl.appendChild(line);
                        logLines.push(line);
                        logEl.scrollTop = logEl.scrollHeight;
                    },
                    undo() {
                        const topFrame = stackEl.firstChild;
                        if (topFrame) {
                            topFrame.classList.remove('returning');
                            topFrame.textContent = ci === 1 ? `factorial(1) = 1 ✓` : `factorial(${ci}) = ${ci} × ?`;
                        }
                        const line = logLines.pop();
                        if (line) line.remove();
                    }
                });
            }

            // 완료
            steps.push({
                description: `✅ 완료! factorial(${n}) = ${fact[n]}`,
                action() {},
                undo() {}
            });

            this._initStepController(el, steps);
        };

        initViz(5);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                this._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
    },

    // ===== 피보나치 재귀 트리 시각화 =====
    _renderVizFibonacci(el) {
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>n = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="2" max="7" value="${n}">
                    </div>
                </div>
                <div class="viz-panels-grid">
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>호출 로그</h3></div>
                        <div class="viz-panel-body">
                            <div id="call-log" class="viz-call-log"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header">
                            <h3>호출 횟수</h3>
                            <div class="counter">총: <span id="call-count" class="counter-num">0</span>번</div>
                        </div>
                        <div class="viz-panel-body">
                            <div id="call-counts" class="dp-table-container" style="flex-wrap:wrap;gap:8px;"></div>
                        </div>
                    </div>
                </div>
                ${this._createStepControls()}
            `;

            const logEl = el.querySelector('#call-log');
            const countsEl = el.querySelector('#call-counts');
            const totalEl = el.querySelector('#call-count');

            // 호출 횟수 셀
            const countCells = [];
            for (let i = 0; i <= n; i++) {
                const cell = document.createElement('div');
                cell.className = 'dp-cell';
                cell.innerHTML = `<div class="dp-cell-index">fib(${i})</div><div class="dp-cell-value">0</div>`;
                countsEl.appendChild(cell);
                countCells.push(cell);
            }

            // 재귀 시뮬레이션
            const rawSteps = [];
            const fib = [0, 1, 1];
            for (let i = 3; i <= n; i++) fib[i] = fib[i - 1] + fib[i - 2];

            const simulate = (k, depth) => {
                rawSteps.push({ type: 'call', k, depth });
                if (k <= 1) {
                    rawSteps.push({ type: 'base', k, depth, value: k });
                    return k;
                }
                const v1 = simulate(k - 1, depth + 1);
                const v2 = simulate(k - 2, depth + 1);
                rawSteps.push({ type: 'return', k, depth, v1, v2, result: v1 + v2 });
                return v1 + v2;
            };
            simulate(n, 0);

            // steps 변환
            const steps = [];
            const logLines = [];
            const callCounts = new Array(n + 1).fill(0);
            let totalCalls = 0;

            rawSteps.forEach(s => {
                const indent = '\u00A0\u00A0'.repeat(s.depth);

                if (s.type === 'call') {
                    const ck = s.k;
                    steps.push({
                        description: `fib(${ck}) 호출 (깊이 ${s.depth})`,
                        action() {
                            callCounts[ck]++;
                            totalCalls++;
                            countCells[ck].querySelector('.dp-cell-value').textContent = callCounts[ck];
                            if (callCounts[ck] > 1) countCells[ck].classList.add('memo-hit');
                            totalEl.textContent = totalCalls;
                            const line = document.createElement('div');
                            line.className = 'log-line call';
                            line.textContent = `${indent}→ fib(${ck})`;
                            logEl.appendChild(line);
                            logLines.push(line);
                            logEl.scrollTop = logEl.scrollHeight;
                        },
                        undo() {
                            callCounts[ck]--;
                            totalCalls--;
                            countCells[ck].querySelector('.dp-cell-value').textContent = callCounts[ck];
                            if (callCounts[ck] <= 1) countCells[ck].classList.remove('memo-hit');
                            totalEl.textContent = totalCalls;
                            const line = logLines.pop();
                            if (line) line.remove();
                        }
                    });
                } else if (s.type === 'base') {
                    steps.push({
                        description: `fib(${s.k}) = ${s.value} (멈추는 조건) 반환`,
                        action() {
                            countCells[s.k].classList.add('base');
                            const line = document.createElement('div');
                            line.className = 'log-line base-case';
                            line.textContent = `${indent}← fib(${s.k}) = ${s.value} ✓`;
                            logEl.appendChild(line);
                            logLines.push(line);
                            logEl.scrollTop = logEl.scrollHeight;
                        },
                        undo() {
                            if (callCounts[s.k] <= 1) countCells[s.k].classList.remove('base');
                            const line = logLines.pop();
                            if (line) line.remove();
                        }
                    });
                } else if (s.type === 'return') {
                    steps.push({
                        description: `fib(${s.k}) = fib(${s.k-1}) + fib(${s.k-2}) = ${s.v1} + ${s.v2} = ${s.result} 반환`,
                        action() {
                            countCells[s.k].classList.add('filled');
                            const line = document.createElement('div');
                            line.className = 'log-line return-val';
                            line.textContent = `${indent}← fib(${s.k}) = ${s.result}`;
                            logEl.appendChild(line);
                            logLines.push(line);
                            logEl.scrollTop = logEl.scrollHeight;
                        },
                        undo() {
                            countCells[s.k].classList.remove('filled');
                            const line = logLines.pop();
                            if (line) line.remove();
                        }
                    });
                }
            });

            steps.push({
                description: `✅ fib(${n}) = ${fib[n]}, 총 ${totalCalls || rawSteps.filter(s=>s.type==='call').length}번 호출! 중복이 많죠? → 이것을 DP로 해결합니다`,
                action() {},
                undo() {}
            });

            this._initStepController(el, steps);
        };

        initViz(5);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                this._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
    },

    // ===== 하노이 탑 시각화 =====
    _renderVizHanoi(el) {
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>원판 수 = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="1" max="5" value="${n}">
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header">
                        <h3>하노이 탑</h3>
                        <div class="counter">이동: <span id="move-count" class="counter-num">0</span> / ${Math.pow(2, n) - 1}</div>
                    </div>
                    <div class="viz-panel-body">
                        <div id="hanoi-pegs" class="hanoi-pegs">
                            <div class="hanoi-peg" data-peg="1"><div class="peg-label">1</div><div class="peg-rod"></div><div class="peg-disks" id="peg-1"></div></div>
                            <div class="hanoi-peg" data-peg="2"><div class="peg-label">2</div><div class="peg-rod"></div><div class="peg-disks" id="peg-2"></div></div>
                            <div class="hanoi-peg" data-peg="3"><div class="peg-label">3</div><div class="peg-rod"></div><div class="peg-disks" id="peg-3"></div></div>
                        </div>
                    </div>
                </div>
                ${this._createStepControls()}
            `;

            const colors = ['var(--accent)', 'var(--green)', 'var(--red)', 'var(--yellow)', 'var(--blue)'];

            // 초기 상태: 모든 원판이 peg 1에
            const pegs = { 1: [], 2: [], 3: [] };
            const peg1El = el.querySelector('#peg-1');
            for (let i = n; i >= 1; i--) {
                pegs[1].push(i);
                const disk = document.createElement('div');
                disk.className = 'hanoi-disk';
                disk.style.width = (30 + i * 25) + 'px';
                disk.style.background = colors[(i - 1) % colors.length];
                disk.dataset.size = i;
                disk.textContent = i;
                peg1El.prepend(disk);
            }

            const moveCountEl = el.querySelector('#move-count');

            // 하노이 재귀로 이동 순서 미리 계산
            const moves = [];
            const hanoiSolve = (n, from, to, via) => {
                if (n === 0) return;
                hanoiSolve(n - 1, from, via, to);
                moves.push({ disk: n, from, to });
                hanoiSolve(n - 1, via, to, from);
            };
            hanoiSolve(n, 1, 3, 2);

            // 현재 페그 상태를 추적하기 위한 복사본
            const pegState = { 1: [...pegs[1]], 2: [], 3: [] };
            let moveNum = 0;

            const steps = moves.map((m, idx) => {
                return {
                    description: `원판 ${m.disk}을 ${m.from}번 기둥 → ${m.to}번 기둥으로 이동`,
                    action() {
                        // DOM에서 원판 이동
                        const fromEl = el.querySelector(`#peg-${m.from}`);
                        const toEl = el.querySelector(`#peg-${m.to}`);
                        const disk = fromEl.firstChild;
                        if (disk) {
                            toEl.prepend(disk);
                        }
                        moveNum++;
                        moveCountEl.textContent = moveNum;
                    },
                    undo() {
                        // 역으로 이동
                        const fromEl = el.querySelector(`#peg-${m.from}`);
                        const toEl = el.querySelector(`#peg-${m.to}`);
                        const disk = toEl.firstChild;
                        if (disk) {
                            fromEl.prepend(disk);
                        }
                        moveNum--;
                        moveCountEl.textContent = moveNum;
                    }
                };
            });

            steps.push({
                description: `✅ 완료! ${n}개 원판을 ${moves.length}번 만에 이동 (최소 횟수 = 2^${n} - 1 = ${Math.pow(2, n) - 1})`,
                action() {},
                undo() {}
            });

            this._initStepController(el, steps);
        };

        initViz(3);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                this._clearVizState();
                initViz(parseInt(e.target.value));
            }
        });
    },

    // ===== 문제 렌더링 =====
    renderProblem(container) {
        container.innerHTML = '';
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
                const bojNum = problem.id.replace('boj-', '');
                const card = document.createElement('div');
                card.className = 'problem-card';
                const diffLabel = problem.difficulty === 'bronze' ? '브론즈' : problem.difficulty === 'silver' ? '실버' : '골드';
                card.innerHTML = `
                    <span class="card-num">#${bojNum}</span>
                    <span class="card-title">${problem.title.replace(/BOJ \d+ - /, '')}</span>
                    <span class="card-diff ${problem.difficulty}">${diffLabel}</span>
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

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const header = document.createElement('div');
        header.className = 'problem-header';
        header.innerHTML = `
            <h2>${problem.title}</h2>
            <a href="${problem.link}" target="_blank" class="btn btn-link">문제 원본 보기 →</a>
        `;
        container.appendChild(header);

        const desc = document.createElement('div');
        desc.className = 'problem-description';
        desc.innerHTML = problem.descriptionHTML;
        container.appendChild(desc);

        // 힌트
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>💡 단계별 힌트</h3>';
        const openedState = new Array(problem.hints.length).fill(false);
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';

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
                    step.classList.remove('opened');
                    openedState[idx] = false;
                } else {
                    step.classList.add('opened');
                    openedState[idx] = true;
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
                ${problem.inputMin !== undefined && problem.inputMin !== problem.inputMax ? `
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

        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        container.querySelector('#run-btn').addEventListener('click', () => {
            const inputEl = container.querySelector('#test-input');
            const n = inputEl ? parseInt(inputEl.value) : problem.inputDefault;
            if (inputEl && (isNaN(n) || n < problem.inputMin || n > problem.inputMax)) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ 입력 ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${n}\n예상 정답: ${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const inputEl = container.querySelector('#test-input');
            const n = inputEl ? parseInt(inputEl.value) : problem.inputDefault;
            if (inputEl && (isNaN(n) || n < problem.inputMin || n > problem.inputMax)) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ 입력 ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${n}\n예상 정답: ${expected}\n\n💡 코드를 BOJ에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status = '') {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    },

    // ===== 시각화 상태 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    // ===== 3단계 문제 구성 =====
    stages: [
        { num: 1, title: '재귀 입문', desc: '기본 재귀 함수 연습', problemIds: ['boj-27433', 'boj-10870'] },
        { num: 2, title: '재귀 활용', desc: '재귀 호출 추적과 이해', problemIds: ['boj-25501', 'boj-24060'] },
        { num: 3, title: '나누어 풀기', desc: '재귀적 패턴과 하노이 탑', problemIds: ['boj-4779', 'boj-2447', 'boj-11729'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 재귀 입문 ==========
        {
            id: 'boj-27433',
            title: 'BOJ 27433 - 팩토리얼 2',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/27433',
            descriptionHTML: `
                <h3>문제</h3>
                <p>0보다 크거나 같은 정수 N이 주어진다. 이때, N!을 출력하는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (0 ≤ N ≤ 20)이 주어진다.</p></div>
                    <div><h4>출력</h4><p>첫째 줄에 N!을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10</pre></div>
                        <div><strong>출력</strong><pre>3628800</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>0</pre></div>
                        <div><strong>출력</strong><pre>1</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '팩토리얼의 재귀적 정의를 그대로 구현하세요: <code>n! = n × (n-1)!</code>' },
                { title: '멈추는 조건', content: '<code>0! = 1</code>이고 <code>1! = 1</code>입니다. n이 0 또는 1이면 1을 반환하세요.' },
                { title: '주의사항', content: '20!은 매우 큰 수입니다. C++에서는 <code>long long</code>, Java에서는 <code>long</code>을 사용하세요. Python은 자동으로 큰 수를 처리합니다.' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                let r = 1;
                for (let i = 2; i <= n; i++) r *= i;
                return `${r}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef factorial(n):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nprint(factorial(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static long factorial(int n) {\n        // 여기에 재귀 함수를 작성하세요\n        return 0;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(factorial(n));\n    }\n}`
            }
        },
        {
            id: 'boj-10870',
            title: 'BOJ 10870 - 피보나치 수 5',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10870',
            descriptionHTML: `
                <h3>문제</h3>
                <p>피보나치 수는 0과 1로 시작한다. 0번째 피보나치 수는 0이고, 1번째는 1이다.</p>
                <p>그 다음 2번째부터는 바로 앞 두 피보나치 수의 합이 된다.</p>
                <p>이를 식으로 쓰면 F<sub>n</sub> = F<sub>n-1</sub> + F<sub>n-2</sub> (n ≥ 2)</p>
                <p>n이 주어졌을 때, n번째 피보나치 수를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 n이 주어진다. (0 ≤ n ≤ 20)</p></div>
                    <div><h4>출력</h4><p>첫째 줄에 n번째 피보나치 수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10</pre></div>
                        <div><strong>출력</strong><pre>55</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '피보나치의 재귀적 정의를 그대로 구현하세요: <code>fib(n) = fib(n-1) + fib(n-2)</code>' },
                { title: '멈추는 조건', content: '<code>fib(0) = 0</code>, <code>fib(1) = 1</code>입니다. 멈추는 조건이 두 개 필요합니다!' },
                { title: '구현 팁', content: 'n ≤ 20이므로 순수 재귀로도 충분히 빠릅니다. 나중에 n이 커지면 계산한 값을 저장하며 푸는 방법(DP)이 필요해집니다.' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 0, inputMax: 20, inputDefault: 10,
            solve(n) {
                function fib(n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }
                return `${fib(n)}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\n\ndef fib(n):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nprint(fib(n))\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << fib(n) << endl;\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static int fib(int n) {\n        // 여기에 재귀 함수를 작성하세요\n        return 0;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(fib(n));\n    }\n}`
            }
        },
        // ========== 2단계: 재귀 활용 ==========
        {
            id: 'boj-25501',
            title: 'BOJ 25501 - 재귀의 귀재',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/25501',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수와 문자열에서 회문(palindrome)인지 확인하는 재귀 함수가 주어진다.</p>
                <div class="problem-code-block">
                    <h4>주어진 코드</h4>
                    <pre><code class="language-python">def recursion(s, l, r):
    if l >= r:
        return 1
    elif s[l] != s[r]:
        return 0
    else:
        return recursion(s, l+1, r-1)

def isPalindrome(s):
    return recursion(s, 0, len(s)-1)</code></pre>
                </div>
                <p>각 문자열에 대해 <strong>회문 여부</strong>와 <strong>recursion 함수 호출 횟수</strong>를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 테스트 케이스 수 T, 이후 T개의 문자열 (대문자 영어, 길이 1~1000)</p></div>
                    <div><h4>출력</h4><p>각 줄에 회문 여부(1 또는 0)와 recursion 호출 횟수를 공백으로 출력</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5
AAA
ABBA
ABABA
ABCA
PALINDROME</pre></div>
                        <div><strong>출력</strong><pre>1 2
1 2
1 3
0 2
0 1</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '주어진 재귀 함수를 그대로 구현하되, <strong>호출 횟수를 세는 카운터</strong>를 추가하세요.' },
                { title: '카운터 추가', content: '<code>recursion</code> 함수가 호출될 때마다 카운터를 1 증가시키세요. 전역 변수나 리스트를 사용할 수 있습니다.' },
                { title: '호출 횟수 분석', content: '회문이면 <code>(길이+1)//2</code>번, 아니면 불일치가 발생하는 위치까지의 횟수입니다. 첫 글자와 마지막 글자가 다르면 1번만 호출됩니다.' }
            ],
            inputLabel: '입력값 (n)',
            inputMin: 1, inputMax: 1, inputDefault: 1,
            solve(n) { return `1 2`; },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\ndef recursion(s, l, r):\n    # 주어진 코드를 구현하되, 호출 횟수를 세세요\n    pass\n\ndef isPalindrome(s):\n    return recursion(s, 0, len(s)-1)\n\nT = int(input())\nfor _ in range(T):\n    s = input().strip()\n    # 결과와 호출 횟수를 출력하세요\n`,
                cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint cnt;\n\nint recursion(string s, int l, int r) {\n    cnt++;\n    // 여기에 재귀 함수를 작성하세요\n    return 0;\n}\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        string s;\n        cin >> s;\n        cnt = 0;\n        int result = recursion(s, 0, s.length()-1);\n        cout << result << " " << cnt << endl;\n    }\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static int cnt;\n    \n    static int recursion(String s, int l, int r) {\n        cnt++;\n        // 여기에 재귀 함수를 작성하세요\n        return 0;\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int T = sc.nextInt();\n        while (T-- > 0) {\n            String s = sc.next();\n            cnt = 0;\n            int result = recursion(s, 0, s.length()-1);\n            System.out.println(result + " " + cnt);\n        }\n    }\n}`
            }
        },
        {
            id: 'boj-24060',
            title: 'BOJ 24060 - 알고리즘 수업: 병합 정렬 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24060',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 서로 다른 양의 정수가 저장된 배열 A를 오름차순 <strong>병합 정렬</strong>로 정렬할 때,</p>
                <p>배열 A에 <strong>K번째로 저장되는 수</strong>를 구하시오. 저장 횟수가 K보다 작으면 -1을 출력한다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (5 ≤ N ≤ 500,000)과 K (1 ≤ K ≤ 10<sup>8</sup>)</p>
                    <p>둘째 줄에 서로 다른 N개의 양의 정수</p></div>
                    <div><h4>출력</h4><p>K번째 저장되는 수. 없으면 -1</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5 7
4 5 1 3 2</pre></div>
                        <div><strong>출력</strong><pre>3</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '병합 정렬의 <strong>merge 단계</strong>에서 배열 A에 값이 저장됩니다. 이 저장 순서를 추적하세요.' },
                { title: '병합 정렬 구조', content: '<code>merge_sort(A, p, r)</code>: p~r 구간 정렬. q = (p+r)/2로 나눠서 왼쪽/오른쪽 각각 정렬 후 merge.' },
                { title: 'K번째 저장', content: 'merge 함수에서 A[p..r]에 값을 복사할 때마다 카운터를 증가. 카운터가 K가 되는 순간의 값이 정답입니다.' },
                { title: '구현 팁', content: 'K번째를 찾으면 바로 출력하고 종료하세요. N이 50만이므로 총 저장 횟수는 NlogN ≈ 950만 정도입니다.' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 5, inputMax: 20, inputDefault: 5,
            solve(n) {
                const arr = [4, 5, 1, 3, 2];
                const saved = [];
                const mergeSort = (a, p, r) => {
                    if (p >= r) return;
                    const q = Math.floor((p + r) / 2);
                    mergeSort(a, p, q);
                    mergeSort(a, q + 1, r);
                    const tmp = [];
                    let i = p, j = q + 1;
                    while (i <= q && j <= r) {
                        if (a[i] <= a[j]) tmp.push(a[i++]);
                        else tmp.push(a[j++]);
                    }
                    while (i <= q) tmp.push(a[i++]);
                    while (j <= r) tmp.push(a[j++]);
                    for (let k = 0; k < tmp.length; k++) {
                        a[p + k] = tmp[k];
                        saved.push(tmp[k]);
                    }
                };
                mergeSort([...arr], 0, arr.length - 1);
                return saved.length >= 7 ? `${saved[6]}` : '-1';
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(600000)\n\nN, K = map(int, input().split())\nA = list(map(int, input().split()))\n\ncnt = 0\nresult = -1\n\ndef merge_sort(A, p, r):\n    # 여기에 병합 정렬을 구현하세요\n    # merge 단계에서 A에 저장할 때마다 cnt를 증가\n    pass\n\nmerge_sort(A, 0, N-1)\nprint(result)\n`,
                cpp: `#include <iostream>\nusing namespace std;\n\nint A[500001], tmp[500001];\nint N, K, cnt = 0, result = -1;\n\nvoid merge(int p, int q, int r) {\n    // 여기에 병합 함수를 작성하세요\n}\n\nvoid merge_sort(int p, int r) {\n    if (p >= r) return;\n    int q = (p + r) / 2;\n    merge_sort(p, q);\n    merge_sort(q + 1, r);\n    merge(p, q, r);\n}\n\nint main() {\n    cin >> N >> K;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    merge_sort(0, N-1);\n    cout << result << endl;\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static int[] A, tmp;\n    static int K, cnt = 0, result = -1;\n    \n    static void merge(int p, int q, int r) {\n        // 여기에 병합 함수를 작성하세요\n    }\n    \n    static void mergeSort(int p, int r) {\n        if (p >= r) return;\n        int q = (p + r) / 2;\n        mergeSort(p, q);\n        mergeSort(q + 1, r);\n        merge(p, q, r);\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(); K = sc.nextInt();\n        A = new int[N]; tmp = new int[N];\n        for (int i = 0; i < N; i++) A[i] = sc.nextInt();\n        mergeSort(0, N-1);\n        System.out.println(result);\n    }\n}`
            }
        },
        // ========== 3단계: 나누어 풀기 ==========
        {
            id: 'boj-4779',
            title: 'BOJ 4779 - 칸토어 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/4779',
            descriptionHTML: `
                <h3>문제</h3>
                <p>칸토어 집합은 3<sup>N</sup>개의 대시(<code>-</code>)로 시작하여, 가운데 1/3을 공백으로 바꾸는 과정을 반복합니다.</p>
                <p>길이가 1인 구간이 될 때까지 반복하여 결과를 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>여러 줄에 걸쳐 N (0 ≤ N ≤ 12)이 주어진다. 입력은 EOF로 끝난다.</p></div>
                    <div><h4>출력</h4><p>각 N에 대해 칸토어 집합 문자열을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>0
1
2
3</pre></div>
                        <div><strong>출력</strong><pre>-
- -
- -   - -
- -   - -         - -   - -</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '3등분하여 가운데를 공백으로 바꾸는 것은 <strong>큰 문제를 작은 문제로 나누어 푸는</strong> 전형적인 패턴입니다.' },
                { title: '재귀 구조', content: '길이 len의 구간을 3등분 → 왼쪽 1/3 재귀, 가운데 1/3 공백, 오른쪽 1/3 재귀' },
                { title: '멈추는 조건', content: '길이가 1이면 <code>-</code> 한 개입니다. 배열에 직접 쓰거나 문자열을 조합하세요.' },
                { title: 'EOF 처리', content: 'Python: <code>while True: try ... except: break</code><br>C++: <code>while(cin >> n)</code>' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 0, inputMax: 5, inputDefault: 2,
            solve(n) {
                const len = Math.pow(3, n);
                const arr = new Array(len).fill('-');
                const cantor = (start, size) => {
                    if (size <= 1) return;
                    const third = size / 3;
                    for (let i = start + third; i < start + 2 * third; i++) arr[i] = ' ';
                    cantor(start, third);
                    cantor(start + 2 * third, third);
                };
                cantor(0, len);
                return arr.join('');
            },
            templates: {
                python: `import sys\n\ndef cantor(arr, start, size):\n    # 여기에 재귀 함수를 작성하세요\n    # 가운데 1/3을 공백으로 바꾸고, 양쪽 1/3에 대해 재귀\n    pass\n\nwhile True:\n    try:\n        n = int(input())\n        length = 3 ** n\n        arr = list('-' * length)\n        cantor(arr, 0, length)\n        print(''.join(arr))\n    except:\n        break\n`,
                cpp: `#include <iostream>\n#include <cstring>\n#include <cmath>\nusing namespace std;\n\nchar arr[600000];\n\nvoid cantor(int start, int size) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    int n;\n    while (cin >> n) {\n        int len = pow(3, n);\n        memset(arr, '-', len);\n        arr[len] = '\\0';\n        cantor(0, len);\n        cout << arr << endl;\n    }\n    return 0;\n}`,
                java: `import java.util.Scanner;\nimport java.util.Arrays;\n\npublic class Main {\n    static char[] arr;\n    \n    static void cantor(int start, int size) {\n        // 여기에 재귀 함수를 작성하세요\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        while (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int len = (int)Math.pow(3, n);\n            arr = new char[len];\n            Arrays.fill(arr, '-');\n            cantor(0, len);\n            System.out.println(new String(arr));\n        }\n    }\n}`
            }
        },
        {
            id: 'boj-2447',
            title: 'BOJ 2447 - 별 찍기 - 10',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2447',
            descriptionHTML: `
                <h3>문제</h3>
                <p>재귀적인 패턴으로 별을 찍어 보자.</p>
                <p>N은 3의 거듭제곱(3, 9, 27, ...)이다. 크기 3의 기본 패턴은:</p>
                <pre>***
* *
***</pre>
                <p>크기 N의 패턴은 가운데를 비우고 나머지 8칸을 N/3 크기의 패턴으로 채운다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N이 주어진다. (N = 3<sup>k</sup>, 1 ≤ k < 8)</p></div>
                    <div><h4>출력</h4><p>N×N 크기의 별 패턴을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>9</pre></div>
                        <div><strong>출력</strong><pre>*********
* ** ** *
*********
***   ***
* *   * *
***   ***
*********
* ** ** *
*********</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N×N 2차원 배열을 <code>*</code>로 채운 뒤, 재귀적으로 가운데 블록을 공백으로 바꾸세요.' },
                { title: '재귀 구조', content: '크기 size의 블록을 9등분(3×3). 가운데(1,1) 블록을 공백으로, 나머지 8개 블록에 대해 재귀.' },
                { title: '멈추는 조건', content: 'size가 1이면 더 이상 쪼갤 수 없으므로 return.' },
                { title: '좌표 계산', content: '(row, col) 기준으로 9개 블록은 (row + i*third, col + j*third)에서 i,j = 0,1,2. 가운데�� i=1, j=1.' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 3, inputMax: 27, inputDefault: 9,
            solve(n) {
                const grid = Array.from({ length: n }, () => new Array(n).fill('*'));
                const star = (r, c, size) => {
                    if (size <= 1) return;
                    const t = size / 3;
                    for (let i = r + t; i < r + 2 * t; i++)
                        for (let j = c + t; j < c + 2 * t; j++) grid[i][j] = ' ';
                    for (let i = 0; i < 3; i++)
                        for (let j = 0; j < 3; j++)
                            if (i !== 1 || j !== 1) star(r + i * t, c + j * t, t);
                };
                star(0, 0, n);
                return grid.map(row => row.join('')).join('\n');
            },
            templates: {
                python: `import sys\n\nn = int(input())\ngrid = [['*'] * n for _ in range(n)]\n\ndef star(r, c, size):\n    # 여기에 재귀 함수를 작성하세요\n    # 가운데 블록을 공백으로 바꾸고, 나머지 8블록에 재귀\n    pass\n\nstar(0, 0, n)\nfor row in grid:\n    print(''.join(row))\n`,
                cpp: `#include <iostream>\n#include <cstring>\nusing namespace std;\n\nchar grid[2200][2200];\nint N;\n\nvoid star(int r, int c, int size) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    cin >> N;\n    memset(grid, '*', sizeof(grid));\n    star(0, 0, N);\n    for (int i = 0; i < N; i++) {\n        grid[i][N] = '\\0';\n        cout << grid[i] << '\\n';\n    }\n    return 0;\n}`,
                java: `import java.util.Scanner;\nimport java.util.Arrays;\n\npublic class Main {\n    static char[][] grid;\n    \n    static void star(int r, int c, int size) {\n        // 여기에 재귀 함수를 작성하세요\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt();\n        grid = new char[N][N];\n        for (char[] row : grid) Arrays.fill(row, '*');\n        star(0, 0, N);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < N; i++) sb.append(new String(grid[i])).append('\\n');\n        System.out.print(sb);\n    }\n}`
            }
        },
        {
            id: 'boj-11729',
            title: 'BOJ 11729 - 하노이 탑 이동 순서',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11729',
            descriptionHTML: `
                <h3>문제</h3>
                <p>세 개의 장대가 있고 첫 번째 장대에 N개의 원판이 크기순으로 쌓여 있다.</p>
                <p>다음 규칙에 따라 모든 원판을 세 번째 장대로 옮기시오:</p>
                <ol>
                    <li>한 번에 한 개의 원판만 이동</li>
                    <li>큰 원판이 작은 원판 위에 올 수 없음</li>
                </ol>
                <p>이동 횟수를 최소로 하는 이동 순서를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N (1 ≤ N ≤ 20)</p></div>
                    <div><h4>출력</h4><p>첫째 줄에 이동 횟수 K, 다음 K줄에 이동 과정 (A B: A→B)</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3</pre></div>
                        <div><strong>출력</strong><pre>7
1 3
1 2
3 2
1 3
2 1
2 3
1 3</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N개의 원판을 1→3으로 옮기려면: 위 N-1개를 2로 옮기고, 가장 큰 원판을 3으로, 다시 N-1개를 3으로.' },
                { title: '재귀 구조', content: '<code>hanoi(n, from, to, via)</code>: n개를 from→to로 옮기기. 보조 기둥은 via.' },
                { title: '멈추는 조건', content: 'n=1이면 바로 from→to 이동. n=0이면 아무것도 안 함.' },
                { title: '이동 횟수', content: '최소 이동 횟수는 <code>2<sup>N</sup> - 1</code>입니다. 수학적 귀납법으로 증명 가능!' }
            ],
            inputLabel: '입력값 (N)',
            inputMin: 1, inputMax: 10, inputDefault: 3,
            solve(n) {
                const moves = [];
                const hanoi = (n, from, to, via) => {
                    if (n === 0) return;
                    hanoi(n - 1, from, via, to);
                    moves.push(`${from} ${to}`);
                    hanoi(n - 1, via, to, from);
                };
                hanoi(n, 1, 3, 2);
                return `${moves.length}\n${moves.join('\n')}`;
            },
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nmoves = []\n\ndef hanoi(n, fr, to, via):\n    # 여기에 재귀 함수를 작성하세요\n    pass\n\nhanoi(n, 1, 3, 2)\nprint(len(moves))\nprint('\\n'.join(moves))\n`,
                cpp: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nvoid hanoi(int n, int from, int to, int via) {\n    // 여기에 재귀 함수를 작성하세요\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << (int)pow(2, n) - 1 << '\\n';\n    hanoi(n, 1, 3, 2);\n    return 0;\n}`,
                java: `import java.util.Scanner;\n\npublic class Main {\n    static StringBuilder sb = new StringBuilder();\n    \n    static void hanoi(int n, int from, int to, int via) {\n        // 여기에 재귀 함수를 작성하세요\n    }\n    \n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        sb.append((int)Math.pow(2, n) - 1).append('\\n');\n        hanoi(n, 1, 3, 2);\n        System.out.print(sb);\n    }\n}`
            }
        }
    ]
};

// 전역 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.recursion = recursionTopic;
