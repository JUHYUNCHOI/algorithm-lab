// ===== 백트래킹 토픽 모듈 =====
const backtrackingTopic = {
    id: 'backtracking',
    title: '백트래킹',
    icon: '🔙',
    category: '기초 개념',
    order: 2,
    description: '끝까지 해보고, 안 되면 돌아와서 다른 길을 가보는 기법',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔙 백트래킹 (Backtracking)</h2>
                <p class="hero-sub">끝까지 해보고, 안 되면 돌아와서 다른 길을 가보는 방법</p>
            </div>

            <!-- ① 백트래킹이란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 백트래킹이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 미로에서 갈림길을 만났다고 생각해 보세요.<br>
                    한쪽 길을 골라서 <strong>끝까지 가 봅니다</strong>.
                    막다른 길이면? 갈림길까지 <strong>되돌아와서</strong> 다른 길을 끝까지 가 봅니다.<br><br>
                    백트래킹도 같은 원리입니다. 하나의 선택을 끝까지 밀어 보고,
                    <strong>안 되면 돌아와서 다른 선택을 끝까지 밀어 봅니다</strong>.
                    이것을 답을 찾을 때까지 반복합니다.
                </div>

                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">예시: {1, 2, 3}에서 2개를 골라 순서를 만들어 봅시다</p>
                <div class="bt-maze-container" id="bt-decision-tree-container">
                    <div class="bt-decision-tree" id="bt-decision-tree"></div>
                    <div class="bt-tree-instruction" id="bt-tree-instruction">👆 노드를 클릭하여 선택을 진행하세요!</div>
                    <div class="bt-tree-results" id="bt-tree-results"></div>
                    <button class="matryoshka-reset hidden" id="bt-tree-reset">↺ 다시 해보기</button>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">위 과정에서 "되돌아가기"가 일어나는 순간은 언제입니까?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        두 번째 숫자까지 골라서 하나의 수열을 완성한 뒤,
                        그 선택을 <strong>취소</strong>하고 다른 두 번째 숫자를 시도할 때 되돌아가기가 일어납니다.<br>
                        또한 두 번째 자리의 모든 선택을 시도한 뒤,
                        첫 번째 자리의 선택까지 취소하고 다른 첫 번째 숫자를 시도할 때도 되돌아갑니다.<br><br>
                        이것이 바로 <strong>백트래킹</strong>입니다!
                    </div>
                </div>
            </div>

            <!-- ② 백트래킹의 핵심 3요소 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 백트래킹의 핵심 3요소</div>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="35" r="18" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M40 53 L40 65" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M32 60 L48 60" stroke="var(--accent)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>☝️ 선택하기</h3>
                        <p>가능한 선택지 중에서 하나를 고릅니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <path d="M30 40 L37 48 L52 32" fill="none" stroke="var(--green)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>✅ 조건 확인</h3>
                        <p>이 선택이 조건에 맞는지 확인합니다. 맞지 않으면 이 선택을 버립니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M50 25 A20 20 0 1 0 55 45" fill="none" stroke="var(--red)" stroke-width="3"/>
                                <polygon points="55,38 55,52 48,45" fill="var(--red)"/>
                            </svg>
                        </div>
                        <h3>↩️ 되돌아가기</h3>
                        <p>선택을 취소하고 이전 상태로 돌아가서 다른 선택을 시도합니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python">def backtrack(현재상태):
    if 정답을_찾았으면:
        결과에_추가
        return

    for 선택 in 선택목록:
        if 유효한_선택인지(선택):    # ✅ 조건 확인
            선택하기(선택)           # ☝️ 선택
            backtrack(다음상태)       # 재귀로 다음 단계
            선택_취소(선택)          # ↩️ 되돌아가기</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">위 코드에서 "선택_취소(선택)" 줄을 빼면 어떻게 됩니까?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        선택을 취소하지 않으면 이전에 한 선택이 그대로 남아있게 됩니다.
                        그래서 다음 선택을 시도할 때 잘못된 상태에서 진행합니다.<br>
                        예를 들어 [1, 2]를 선택한 상태에서 2를 취소하지 않고 3을 추가하면
                        [1, 2, 3]이 되어 버립니다. 우리가 원하는 것은 [1, 3]인데 말입니다!<br><br>
                        <strong>되돌리기는 백트래킹의 핵심</strong>입니다.
                    </div>
                </div>
            </div>

            <!-- ③ 가지치기란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 가지치기란? (Pruning)</div>
                <p style="margin-bottom: 1rem;">백트래킹에서 가장 중요한 기술은
                    <strong>가지치기(Pruning)</strong>입니다.
                    조건에 맞지 않는 선택을 <strong>일찍 걸러내어</strong> 아예 탐색하지 않는 것입니다.</p>

                <div class="execution-flow-compare">
                    <div class="flow-grid">
                        <div class="flow-card topdown-flow">
                            <div class="flow-label">❌ 가지치기 없이 (모든 경우 탐색)</div>
                            <div class="flow-trace">
                                <div>1→1 (같은 숫자! 중복)</div>
                                <div>1→2 ✓</div>
                                <div>1→3 ✓</div>
                                <div>2→1 ✓</div>
                                <div>2→2 (같은 숫자! 중복)</div>
                                <div>2→3 ✓</div>
                                <div>3→1 ✓</div>
                                <div>3→2 ✓</div>
                                <div>3→3 (같은 숫자! 중복)</div>
                                <div style="margin-top:6px;font-weight:700;">→ 총 9가지를 모두 확인</div>
                            </div>
                        </div>
                        <div class="flow-card bottomup-flow">
                            <div class="flow-label">✂️ 가지치기 적용 (조건에 안 맞으면 건너뜀)</div>
                            <div class="flow-trace">
                                <div>1→1 ✕ 이미 사용! <strong>건너뜀</strong></div>
                                <div>1→2 ✓</div>
                                <div>1→3 ✓</div>
                                <div>2→1 ✓</div>
                                <div>2→2 ✕ 이미 사용! <strong>건너뜀</strong></div>
                                <div>2→3 ✓</div>
                                <div>3→1 ✓</div>
                                <div>3→2 ✓</div>
                                <div>3→3 ✕ 이미 사용! <strong>건너뜀</strong></div>
                                <div style="margin-top:6px;font-weight:700;">→ 6가지만 확인하면 충분</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="key-difference-box">
                    <div>✂️ 가지치기를 잘 하면 탐색 범위가 크게 줄어들어 훨씬 빨라집니다</div>
                    <div>📊 N-Queen (8×8): 모든 경우 약 <strong>1680만 가지</strong> → 가지치기 적용 시 약 <strong>15,000가지</strong>만 탐색</div>
                    <div>💡 "이 선택은 이미 안 된다"는 것을 빨리 알수록 성능이 좋아집니다</div>
                </div>
            </div>

            <!-- ④ 백트래킹 vs 완전탐색 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 백트래킹 vs 완전탐색</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔍 완전탐색 (Brute Force)</h3>
                        <p class="approach-desc">모든 경우의 수를 전부 만들어 본 뒤에 확인합니다</p>
                        <div class="code-block"><pre><code class="language-python"># 중첩 반복문으로 모든 경우 생성
for i in range(1, n+1):
    for j in range(1, n+1):
        if i != j:  # 다 만든 뒤에 확인
            print(i, j)</code></pre></div>
                    </div>
                    <div class="approach-card">
                        <h3>🔙 백트래킹 (Backtracking)</h3>
                        <p class="approach-desc">조건에 맞지 않으면 즉시 되돌아갑니다</p>
                        <div class="code-block"><pre><code class="language-python">def solve(path, used):
    if len(path) == 2:
        print(*path)
        return
    for i in range(1, n+1):
        if not used[i]:   # 먼저 확인!
            used[i] = True
            path.append(i)
            solve(path, used)
            path.pop()       # 되돌리기
            used[i] = False  # 되돌리기</code></pre></div>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">N이 커지면 완전탐색과 백트래킹의 차이가 얼마나 벌어집니까?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        N=10에서 2개를 순서대로 고르기(순열):<br>
                        완전탐색: 10×10 = <strong>100가지</strong>를 모두 만든 뒤 걸러냅니다<br>
                        백트래킹: 10×9 = <strong>90가지</strong>만 탐색합니다 (10가지를 아예 안 만듦)<br><br>
                        차이가 작아 보이지만, N-Queen처럼 조건이 복잡한 문제에서는
                        백트래킹이 탐색량을 <strong>수백~수천 배</strong> 줄여 줍니다.
                    </div>
                </div>
            </div>

            <!-- ⑤ 백트래킹 문제 푸는 4단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 백트래킹 문제 푸는 4단계</div>
                <div class="step-cards">
                    <div class="step-card">
                        <span class="step-num">1</span>
                        <h4>선택지 정하기</h4>
                        <p>각 단계에서 어떤 것을 고를 수 있는지 파악합니다</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">2</span>
                        <h4>조건 만들기</h4>
                        <p>유효한 선택인지 확인하는 조건을 만듭니다 (가지치기 기준)</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">3</span>
                        <h4>재귀로 다음 단계</h4>
                        <p>선택을 확정한 뒤, 재귀 호출로 다음 단계를 진행합니다</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">4</span>
                        <h4>되돌리기</h4>
                        <p>재귀가 끝나면 선택을 취소하고, 다른 선택을 시도합니다</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">N-Queen 문제를 위 4단계로 정리해 보세요. (N×N 체스판에 퀸 N개를 서로 공격 못 하게 놓기)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>1. 선택지:</strong> 각 행에서 퀸을 놓을 열 번호 (0 ~ N-1)<br>
                        <strong>2. 조건:</strong> 같은 열에 퀸이 없고, 대각선에도 퀸이 없어야 합니다<br>
                        <strong>3. 재귀:</strong> 현재 행에 퀸을 놓고, 다음 행으로 넘어갑니다<br>
                        <strong>4. 되돌리기:</strong> 다음 행에서 실패하면, 현재 행의 퀸을 다른 열로 옮깁니다<br><br>
                        이 패턴을 잘 기억하세요! 시각화 탭에서 직접 확인할 수 있습니다.
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    _initConceptInteractions(container) {
        // Think-box 토글
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });

        // 결정 트리 인터랙티브 (Section 1)
        const treeContainer = container.querySelector('#bt-decision-tree');
        const instructionEl = container.querySelector('#bt-tree-instruction');
        const resultsEl = container.querySelector('#bt-tree-results');
        const resetBtn = container.querySelector('#bt-tree-reset');

        if (treeContainer) {
            this._buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn);
        }
    },

    _buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn) {
        const N = 3, M = 2;
        const results = [];
        let currentDepth = 0;
        let path = [];
        let nodeData = []; // flat list of rendered nodes

        const renderTree = () => {
            treeContainer.innerHTML = '';
            nodeData = [];

            // Root node
            const rootRow = document.createElement('div');
            rootRow.className = 'bt-tree-row';
            const rootNode = document.createElement('div');
            rootNode.className = 'bt-tree-node expanded';
            rootNode.textContent = '시작';
            rootRow.appendChild(rootNode);
            treeContainer.appendChild(rootRow);

            // Level 1: first choice
            const level1Row = document.createElement('div');
            level1Row.className = 'bt-tree-row';
            for (let i = 1; i <= N; i++) {
                const node = document.createElement('div');
                node.className = 'bt-tree-node';
                node.textContent = i;
                node.dataset.depth = '0';
                node.dataset.value = i;
                if (currentDepth === 0 && path.length === 0) {
                    node.addEventListener('click', () => selectNode(0, i));
                } else if (path.length > 0 && path[0] === i) {
                    node.classList.add('expanded');
                } else if (path.length > 0) {
                    node.classList.add('disabled');
                }
                level1Row.appendChild(node);
                nodeData.push({ depth: 0, value: i, el: node });
            }
            treeContainer.appendChild(level1Row);

            // Level 2: second choice (only show if first is chosen)
            if (path.length >= 1) {
                const level2Row = document.createElement('div');
                level2Row.className = 'bt-tree-row';
                for (let i = 1; i <= N; i++) {
                    const node = document.createElement('div');
                    node.dataset.depth = '1';
                    node.dataset.value = i;
                    if (i === path[0]) {
                        // pruned — same number
                        node.className = 'bt-tree-node pruned';
                        node.textContent = i + '✕';
                    } else if (path.length === 2 && path[1] === i) {
                        node.className = 'bt-tree-node leaf';
                        node.textContent = path[0] + ',' + i;
                    } else if (path.length === 1) {
                        node.className = 'bt-tree-node';
                        node.textContent = i;
                        const val = i;
                        node.addEventListener('click', () => selectNode(1, val));
                    } else {
                        node.className = 'bt-tree-node disabled';
                        node.textContent = i;
                    }
                    level2Row.appendChild(node);
                    nodeData.push({ depth: 1, value: i, el: node });
                }
                treeContainer.appendChild(level2Row);
            }
        };

        const selectNode = (depth, value) => {
            if (depth === 0) {
                path = [value];
                currentDepth = 1;
                instructionEl.textContent = `첫 번째로 ${value}을(를) 선택했습니다. 두 번째 숫자를 고르세요!`;
            } else if (depth === 1) {
                path = [path[0], value];
                results.push([...path]);
                updateResults();
                instructionEl.textContent = `[${path.join(', ')}] 완성! 클릭하여 되돌아가세요`;
                currentDepth = 2;
            }
            renderTree();

            if (depth === 1) {
                // Auto-backtrack after a short delay
                setTimeout(() => {
                    if (currentDepth !== 2) return;
                    backtrack();
                }, 1200);
            }
        };

        const backtrack = () => {
            if (path.length === 2) {
                // Try next second choice
                const first = path[0];
                const second = path[1];
                let nextSecond = null;
                for (let i = second + 1; i <= N; i++) {
                    if (i !== first) { nextSecond = i; break; }
                }
                if (nextSecond) {
                    path = [first];
                    currentDepth = 1;
                    instructionEl.textContent = `되돌아갔습니다! 다음 두 번째 숫자를 고르세요`;
                    renderTree();
                } else {
                    // All second choices exhausted, backtrack first
                    let nextFirst = null;
                    for (let i = first + 1; i <= N; i++) { nextFirst = i; break; }
                    if (nextFirst) {
                        path = [];
                        currentDepth = 0;
                        instructionEl.textContent = `첫 번째 선택도 되돌렸습니다! 다음 첫 번째 숫자를 고르세요`;
                        renderTree();
                    } else {
                        // All done
                        path = [];
                        currentDepth = -1;
                        instructionEl.textContent = `✅ 모든 경우를 찾았습니다! 총 ${results.length}개`;
                        resetBtn.classList.remove('hidden');
                        renderTree();
                    }
                }
            }
        };

        const updateResults = () => {
            resultsEl.innerHTML = '찾은 수열: ' + results.map(r => `<span class="bt-result-tag">[${r.join(', ')}]</span>`).join(' ');
        };

        resetBtn.addEventListener('click', () => {
            results.length = 0;
            path = [];
            currentDepth = 0;
            resultsEl.innerHTML = '';
            instructionEl.textContent = '👆 노드를 클릭하여 선택을 진행하세요!';
            resetBtn.classList.add('hidden');
            renderTree();
        });

        renderTree();
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>백트래킹 시각화</h2>
            <div class="viz-type-selector">
                <button class="viz-type-btn active" data-viz="nqueen">N-Queen</button>
                <button class="viz-type-btn" data-viz="permutation">수열 만들기</button>
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

        switchViz('nqueen');
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
            case 'nqueen': this._renderVizNQueen(el); break;
            case 'permutation': this._renderVizPermutation(el); break;
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

    // ===== N-Queen 시각화 =====
    _renderVizNQueen(el) {
        const initViz = (n) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>N = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="4" max="8" value="${n}">
                    </div>
                    <div class="viz-control-group">
                        <span>해: <strong id="solution-count">0</strong>개 발견</span>
                    </div>
                </div>
                <div class="viz-panel">
                    <div class="viz-panel-header"><h3>N-Queen 풀이 과정</h3></div>
                    <div class="viz-panel-body" style="display:flex;justify-content:center;">
                        <div id="chess-board" class="chess-board" style="grid-template-columns: repeat(${n}, 1fr);"></div>
                    </div>
                </div>
                ${this._createStepControls()}
            `;

            // 체스판 생성
            const board = el.querySelector('#chess-board');
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'chess-cell ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    board.appendChild(cell);
                }
            }

            const getCell = (r, c) => board.querySelector(`.chess-cell[data-row="${r}"][data-col="${c}"]`);
            const solutionCountEl = el.querySelector('#solution-count');

            // 스텝 생성
            const steps = [];
            const queens = new Array(n).fill(-1);
            let solCount = 0;

            const isValid = (row, col) => {
                for (let r = 0; r < row; r++) {
                    if (queens[r] === col) return false;
                    if (Math.abs(queens[r] - col) === Math.abs(r - row)) return false;
                }
                return true;
            };

            const getConflicts = (row, col) => {
                const conflicts = [];
                for (let r = 0; r < row; r++) {
                    if (queens[r] === col) conflicts.push({ r, c: queens[r], type: 'col' });
                    if (Math.abs(queens[r] - col) === Math.abs(r - row)) conflicts.push({ r, c: queens[r], type: 'diag' });
                }
                return conflicts;
            };

            const solve = (row) => {
                if (row === n) {
                    solCount++;
                    const sc = solCount;
                    const queenSnapshot = [...queens];
                    steps.push({
                        description: `🎉 ${sc}번째 해를 찾았습니다!`,
                        action() {
                            solutionCountEl.textContent = sc;
                            for (let r = 0; r < n; r++) {
                                getCell(r, queenSnapshot[r]).classList.add('cell-solution');
                            }
                        },
                        undo() {
                            solutionCountEl.textContent = sc - 1;
                            for (let r = 0; r < n; r++) {
                                getCell(r, queenSnapshot[r]).classList.remove('cell-solution');
                            }
                        }
                    });
                    return;
                }
                for (let col = 0; col < n; col++) {
                    const r = row, c = col;
                    // 시도
                    steps.push({
                        description: `${r + 1}행 ${c + 1}열에 퀸을 놓아 봅니다...`,
                        action() { getCell(r, c).classList.add('cell-trying'); },
                        undo() { getCell(r, c).classList.remove('cell-trying'); }
                    });

                    if (isValid(row, col)) {
                        queens[row] = col;
                        const conflictsNone = [];
                        steps.push({
                            description: `✅ ${r + 1}행 ${c + 1}열: 충돌 없음! 퀸을 놓습니다`,
                            action() {
                                getCell(r, c).classList.remove('cell-trying');
                                getCell(r, c).classList.add('queen-placed');
                                getCell(r, c).textContent = '♛';
                            },
                            undo() {
                                getCell(r, c).classList.remove('queen-placed');
                                getCell(r, c).classList.add('cell-trying');
                                getCell(r, c).textContent = '';
                            }
                        });
                        solve(row + 1);
                        queens[row] = -1;
                        steps.push({
                            description: `↩️ ${r + 1}행 ${c + 1}열의 퀸을 제거하고 되돌아갑니다`,
                            action() {
                                getCell(r, c).classList.remove('queen-placed', 'cell-solution');
                                getCell(r, c).textContent = '';
                            },
                            undo() {
                                getCell(r, c).classList.add('queen-placed');
                                getCell(r, c).textContent = '♛';
                            }
                        });
                    } else {
                        const conflicts = getConflicts(row, col);
                        const conflictDesc = conflicts.map(cf => `${cf.r + 1}행 ${cf.c + 1}열`).join(', ');
                        steps.push({
                            description: `❌ ${r + 1}행 ${c + 1}열: ${conflictDesc}의 퀸과 충돌! 건너뜁니다`,
                            action() {
                                getCell(r, c).classList.remove('cell-trying');
                                getCell(r, c).classList.add('cell-conflict');
                                conflicts.forEach(cf => getCell(cf.r, cf.c).classList.add('cell-attacked'));
                                setTimeout(() => {
                                    getCell(r, c).classList.remove('cell-conflict');
                                    conflicts.forEach(cf => getCell(cf.r, cf.c).classList.remove('cell-attacked'));
                                }, 500);
                            },
                            undo() {
                                getCell(r, c).classList.remove('cell-conflict');
                                getCell(r, c).classList.add('cell-trying');
                            }
                        });
                    }
                }
            };

            solve(0);

            steps.push({
                description: `✅ 탐색 완료! ${solCount}개의 해를 모두 찾았습니다`,
                action() {},
                undo() {}
            });

            this._initStepController(el, steps);
        };

        initViz(4);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider') {
                this._clearVizState();
                const val = parseInt(e.target.value);
                el.querySelector('#viz-n-label').textContent = val;
                initViz(val);
            }
        });
    },

    // ===== 순열 생성 시각화 =====
    _renderVizPermutation(el) {
        const initViz = (n, m) => {
            el.innerHTML = `
                <div class="viz-controls">
                    <div class="viz-control-group">
                        <label>N = <span id="viz-n-label">${n}</span></label>
                        <input type="range" id="viz-n-slider" min="2" max="5" value="${n}">
                    </div>
                    <div class="viz-control-group">
                        <label>M = <span id="viz-m-label">${m}</span></label>
                        <input type="range" id="viz-m-slider" min="1" max="${n}" value="${m}">
                    </div>
                </div>
                <div class="viz-panels-grid">
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>현재 경로</h3></div>
                        <div class="viz-panel-body">
                            <div id="perm-path" class="perm-path-display">[ ]</div>
                            <div id="perm-used" class="perm-used-display"></div>
                        </div>
                    </div>
                    <div class="viz-panel">
                        <div class="viz-panel-header"><h3>찾은 수열 <span id="perm-count" style="color:var(--accent);font-weight:700;">0</span>개</h3></div>
                        <div class="viz-panel-body">
                            <div id="perm-results" class="viz-call-log" style="max-height:200px;overflow-y:auto;"></div>
                        </div>
                    </div>
                </div>
                ${this._createStepControls()}
            `;

            const pathEl = el.querySelector('#perm-path');
            const usedEl = el.querySelector('#perm-used');
            const resultsEl = el.querySelector('#perm-results');
            const countEl = el.querySelector('#perm-count');

            // 사용 여부 표시 초기화
            const renderUsed = (used) => {
                usedEl.innerHTML = '';
                for (let i = 1; i <= n; i++) {
                    const span = document.createElement('span');
                    span.className = 'perm-used-num' + (used[i] ? ' used' : '');
                    span.textContent = i;
                    usedEl.appendChild(span);
                }
            };
            renderUsed(new Array(n + 1).fill(false));

            // 스텝 생성
            const steps = [];
            const path = [];
            const used = new Array(n + 1).fill(false);
            let resultCount = 0;

            const solve = (depth) => {
                if (depth === m) {
                    resultCount++;
                    const rc = resultCount;
                    const snap = [...path];
                    steps.push({
                        description: `🎯 수열 [${snap.join(', ')}]을 찾았습니다! (${rc}번째)`,
                        action() {
                            countEl.textContent = rc;
                            const line = document.createElement('div');
                            line.className = 'log-line return-val';
                            line.textContent = `[${snap.join(', ')}]`;
                            line.id = `perm-result-${rc}`;
                            resultsEl.appendChild(line);
                            resultsEl.scrollTop = resultsEl.scrollHeight;
                        },
                        undo() {
                            countEl.textContent = rc - 1;
                            const line = resultsEl.querySelector(`#perm-result-${rc}`);
                            if (line) line.remove();
                        }
                    });
                    return;
                }
                for (let i = 1; i <= n; i++) {
                    if (used[i]) {
                        const ci = i;
                        const snapPath = [...path];
                        steps.push({
                            description: `✕ 숫자 ${ci}는 이미 사용 중입니다 → 건너뜁니다 (가지치기)`,
                            action() {
                                pathEl.textContent = `[ ${snapPath.join(', ')}${snapPath.length > 0 ? ', ' : ''}${ci}? ]`;
                                pathEl.classList.add('path-conflict');
                                setTimeout(() => pathEl.classList.remove('path-conflict'), 400);
                                pathEl.textContent = `[ ${snapPath.join(', ')}${snapPath.length > 0 ? ', ' : ''}___ ]`;
                            },
                            undo() {
                                pathEl.textContent = snapPath.length > 0 ? `[ ${snapPath.join(', ')}, ___ ]` : '[ ___ ]';
                            }
                        });
                        continue;
                    }
                    const ci = i;
                    // 선택
                    used[i] = true;
                    path.push(i);
                    const snapChoose = [...path];
                    const snapUsedChoose = [...used];
                    steps.push({
                        description: `☝️ 숫자 ${ci}를 선택합니다 → 경로: [${snapChoose.join(', ')}]`,
                        action() {
                            pathEl.textContent = `[ ${snapChoose.join(', ')}${snapChoose.length < m ? ', ___' : ''} ]`;
                            pathEl.classList.remove('path-conflict');
                            renderUsed(snapUsedChoose);
                        },
                        undo() {
                            const prev = snapChoose.slice(0, -1);
                            pathEl.textContent = prev.length > 0 ? `[ ${prev.join(', ')}, ___ ]` : '[ ___ ]';
                            const prevUsed = [...snapUsedChoose];
                            prevUsed[ci] = false;
                            renderUsed(prevUsed);
                        }
                    });

                    solve(depth + 1);

                    // 되돌리기
                    path.pop();
                    used[i] = false;
                    const snapUndo = [...path];
                    const snapUsedUndo = [...used];
                    steps.push({
                        description: `↩️ 숫자 ${ci}를 되돌립니다 → 경로: [${snapUndo.length > 0 ? snapUndo.join(', ') + ', ___' : '___'}]`,
                        action() {
                            pathEl.textContent = snapUndo.length > 0 ? `[ ${snapUndo.join(', ')}, ___ ]` : '[ ___ ]';
                            renderUsed(snapUsedUndo);
                        },
                        undo() {
                            const restored = [...snapUndo, ci];
                            pathEl.textContent = `[ ${restored.join(', ')}${restored.length < m ? ', ___' : ''} ]`;
                            const restoredUsed = [...snapUsedUndo];
                            restoredUsed[ci] = true;
                            renderUsed(restoredUsed);
                        }
                    });
                }
            };

            solve(0);
            steps.push({
                description: `✅ 탐색 완료! 총 ${resultCount}개의 수열을 찾았습니다`,
                action() {},
                undo() {}
            });

            this._initStepController(el, steps);
        };

        initViz(3, 2);
        el.addEventListener('input', (e) => {
            if (e.target.id === 'viz-n-slider' || e.target.id === 'viz-m-slider') {
                this._clearVizState();
                const nSlider = el.querySelector('#viz-n-slider');
                const mSlider = el.querySelector('#viz-m-slider');
                let nVal = parseInt(nSlider.value);
                let mVal = parseInt(mSlider.value);
                if (mVal > nVal) {
                    mVal = nVal;
                    mSlider.value = mVal;
                }
                mSlider.max = nVal;
                el.querySelector('#viz-n-label').textContent = nVal;
                el.querySelector('#viz-m-label').textContent = mVal;
                initViz(nVal, mVal);
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

        container.querySelectorAll('pre code').forEach(codeEl => hljs.highlightElement(codeEl));

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
            this._showOutput(container, `입력: ${n}\n예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const inputEl = container.querySelector('#test-input');
            const n = inputEl ? parseInt(inputEl.value) : problem.inputDefault;
            if (inputEl && (isNaN(n) || n < problem.inputMin || n > problem.inputMax)) {
                this._showOutput(container, `오류: ${problem.inputMin} ≤ 입력 ≤ ${problem.inputMax}`, 'wrong');
                return;
            }
            const expected = problem.solve(n);
            this._showOutput(container, `입력: ${n}\n예상 정답:\n${expected}\n\n💡 코드를 BOJ에 제출하여 정답을 확인하세요!`);
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
        { num: 1, title: '기본 백트래킹', desc: 'N과 M 시리즈 (Silver III)', problemIds: ['boj-15649', 'boj-15650', 'boj-15651', 'boj-15652'] },
        { num: 2, title: '응용 백트래킹', desc: '조건이 복잡한 문제 (Silver I)', problemIds: ['boj-14888', 'boj-14889'] },
        { num: 3, title: '심화 백트래킹', desc: '고전 백트래킹 문제 (Gold IV~V)', problemIds: ['boj-9663', 'boj-2580'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 기본 백트래킹 ==========
        {
            id: 'boj-15649',
            title: 'BOJ 15649 - N과 M (1)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15649',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul><li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li></ul>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div>
                    <div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 증가하는 순서로 수열을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3 1</pre></div>
                        <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>4 2</pre></div>
                        <div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 1\n2 3\n2 4\n3 1\n3 2\n3 4\n4 1\n4 2\n4 3</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<code>used</code> 배열로 각 숫자의 사용 여부를 추적하면서 재귀적으로 수열을 만듭니다.' },
                { title: '기본 구조', content: '<code>backtrack(depth)</code> 함수를 만들어, <code>depth == M</code>이면 현재 수열을 출력합니다.' },
                { title: '되돌리기', content: '숫자를 선택한 뒤 재귀 호출이 끝나면 <code>used[i] = False</code>와 <code>path.pop()</code>으로 되돌려야 합니다.' }
            ],
            inputLabel: 'N 값',
            inputMin: 1, inputMax: 8, inputDefault: 4,
            solve(n) {
                const m = 2;
                const result = [];
                const path = [];
                const used = new Array(n + 1).fill(false);
                const bt = () => {
                    if (path.length === m) { result.push(path.join(' ')); return; }
                    for (let i = 1; i <= n; i++) {
                        if (!used[i]) {
                            used[i] = true; path.push(i);
                            bt();
                            path.pop(); used[i] = false;
                        }
                    }
                };
                bt();
                return result.join('\n');
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n, m = map(int, input().split())
path = []
used = [False] * (n + 1)

def backtrack():
    if len(path) == m:
        print(*path)
        return
    for i in range(1, n + 1):
        if not used[i]:
            used[i] = True
            path.append(i)
            backtrack()
            path.pop()
            used[i] = False

backtrack()`,
                cpp: `#include <iostream>
using namespace std;

int n, m;
int path[9];
bool used[9];

void backtrack(int depth) {
    if (depth == m) {
        for (int i = 0; i < m; i++)
            cout << path[i] << (i < m-1 ? " " : "\\n");
        return;
    }
    for (int i = 1; i <= n; i++) {
        if (!used[i]) {
            used[i] = true;
            path[depth] = i;
            backtrack(depth + 1);
            used[i] = false;
        }
    }
}

int main() {
    cin >> n >> m;
    backtrack(0);
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, m;
    static int[] path;
    static boolean[] used;
    static StringBuilder sb = new StringBuilder();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt(); m = sc.nextInt();
        path = new int[m];
        used = new boolean[n + 1];
        backtrack(0);
        System.out.print(sb);
    }

    static void backtrack(int depth) {
        if (depth == m) {
            for (int i = 0; i < m; i++)
                sb.append(path[i]).append(i < m-1 ? " " : "\\n");
            return;
        }
        for (int i = 1; i <= n; i++) {
            if (!used[i]) {
                used[i] = true;
                path[depth] = i;
                backtrack(depth + 1);
                used[i] = false;
            }
        }
    }
}`
            }
        },
        {
            id: 'boj-15650',
            title: 'BOJ 15650 - N과 M (2)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15650',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul>
                    <li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li>
                    <li>고른 수열은 오름차순이어야 한다.</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div>
                    <div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 2</pre></div>
                        <div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 3\n2 4\n3 4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N과 M (1)에서 <strong>오름차순</strong> 조건만 추가하면 됩니다. 이전에 고른 숫자보다 큰 것만 고르면 됩니다.' },
                { title: '핵심 변경', content: '<code>backtrack(start)</code>에서 반복문을 <code>start</code>부터 시작하면 자연스럽게 오름차순이 됩니다.' },
                { title: '차이점', content: '<code>used</code> 배열이 필요 없습니다! <code>start</code> 파라미터가 중복을 자동으로 방지합니다.' }
            ],
            inputLabel: 'N 값',
            inputMin: 1, inputMax: 8, inputDefault: 4,
            solve(n) {
                const m = 2;
                const result = [];
                const path = [];
                const bt = (start) => {
                    if (path.length === m) { result.push(path.join(' ')); return; }
                    for (let i = start; i <= n; i++) {
                        path.push(i);
                        bt(i + 1);
                        path.pop();
                    }
                };
                bt(1);
                return result.join('\n');
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n, m = map(int, input().split())
path = []

def backtrack(start):
    if len(path) == m:
        print(*path)
        return
    for i in range(start, n + 1):
        path.append(i)
        backtrack(i + 1)
        path.pop()

backtrack(1)`,
                cpp: `#include <iostream>
using namespace std;

int n, m;
int path[9];

void backtrack(int depth, int start) {
    if (depth == m) {
        for (int i = 0; i < m; i++)
            cout << path[i] << (i < m-1 ? " " : "\\n");
        return;
    }
    for (int i = start; i <= n; i++) {
        path[depth] = i;
        backtrack(depth + 1, i + 1);
    }
}

int main() {
    cin >> n >> m;
    backtrack(0, 1);
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, m;
    static int[] path;
    static StringBuilder sb = new StringBuilder();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt(); m = sc.nextInt();
        path = new int[m];
        backtrack(0, 1);
        System.out.print(sb);
    }

    static void backtrack(int depth, int start) {
        if (depth == m) {
            for (int i = 0; i < m; i++)
                sb.append(path[i]).append(i < m-1 ? " " : "\\n");
            return;
        }
        for (int i = start; i <= n; i++) {
            path[depth] = i;
            backtrack(depth + 1, i + 1);
        }
    }
}`
            }
        },
        {
            id: 'boj-15651',
            title: 'BOJ 15651 - N과 M (3)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15651',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul>
                    <li>1부터 N까지 자연수 중에서 M개를 고른 수열</li>
                    <li>같은 수를 여러 번 골라도 된다.</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 7)</p></div>
                    <div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3 1</pre></div>
                        <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>4 2</pre></div>
                        <div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 1\n2 2\n2 3\n2 4\n3 1\n3 2\n3 3\n3 4\n4 1\n4 2\n4 3\n4 4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N과 M (1)에서 <code>used</code> 배열을 <strong>없애면</strong> 됩니다. 중복을 허용하므로 사용 여부를 확인하지 않습니다.' },
                { title: '핵심 변경', content: '매번 1부터 N까지 모든 숫자를 선택 가능하므로 반복문이 항상 <code>range(1, n+1)</code>입니다.' },
                { title: '주의사항', content: '출력량이 많으므로 Python에서는 <code>sys.stdout.write()</code>를, C++에서는 <code>printf</code> 또는 <code>ios::sync_with_stdio(false)</code>를 사용하세요.' }
            ],
            inputLabel: 'N 값',
            inputMin: 1, inputMax: 7, inputDefault: 3,
            solve(n) {
                const m = 2;
                const result = [];
                const path = [];
                const bt = () => {
                    if (path.length === m) { result.push(path.join(' ')); return; }
                    for (let i = 1; i <= n; i++) {
                        path.push(i);
                        bt();
                        path.pop();
                    }
                };
                bt();
                return result.join('\n');
            },
            templates: {
                python: `import sys

n, m = map(int, sys.stdin.readline().split())
path = []
result = []

def backtrack():
    if len(path) == m:
        result.append(' '.join(map(str, path)))
        return
    for i in range(1, n + 1):
        path.append(i)
        backtrack()
        path.pop()

backtrack()
sys.stdout.write('\\n'.join(result))`,
                cpp: `#include <cstdio>

int n, m;
int path[8];

void backtrack(int depth) {
    if (depth == m) {
        for (int i = 0; i < m; i++)
            printf("%d%c", path[i], i < m-1 ? ' ' : '\\n');
        return;
    }
    for (int i = 1; i <= n; i++) {
        path[depth] = i;
        backtrack(depth + 1);
    }
}

int main() {
    scanf("%d %d", &n, &m);
    backtrack(0);
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, m;
    static int[] path;
    static StringBuilder sb = new StringBuilder();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt(); m = sc.nextInt();
        path = new int[m];
        backtrack(0);
        System.out.print(sb);
    }

    static void backtrack(int depth) {
        if (depth == m) {
            for (int i = 0; i < m; i++)
                sb.append(path[i]).append(i < m-1 ? " " : "\\n");
            return;
        }
        for (int i = 1; i <= n; i++) {
            path[depth] = i;
            backtrack(depth + 1);
        }
    }
}`
            }
        },
        {
            id: 'boj-15652',
            title: 'BOJ 15652 - N과 M (4)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15652',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul>
                    <li>1부터 N까지 자연수 중에서 M개를 고른 수열</li>
                    <li>같은 수를 여러 번 골라도 된다.</li>
                    <li>고른 수열은 비내림차순이어야 한다. (각 숫자가 이전 숫자 이상)</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div>
                    <div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3 1</pre></div>
                        <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>4 2</pre></div>
                        <div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 2\n2 3\n2 4\n3 3\n3 4\n4 4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N과 M (2)와 비슷하지만, 같은 수를 또 골라도 됩니다. <code>start</code>를 <code>i+1</code>이 아니라 <code>i</code>로 넘기면 됩니다.' },
                { title: '핵심 변경', content: '<code>backtrack(i)</code>로 재귀 호출합니다 (<code>i+1</code>이 아님). 이렇게 하면 자기 자신을 다시 선택할 수 있습니다.' },
                { title: 'N과 M 시리즈 비교', content: '(1) 순서 있게 고르기 = used 배열 (2) 순서 없이 고르기 = start, i+1 (3) 중복 허용+순서 = 제한 없음 (4) 중복 허용+순서 없음 = start, i' }
            ],
            inputLabel: 'N 값',
            inputMin: 1, inputMax: 8, inputDefault: 4,
            solve(n) {
                const m = 2;
                const result = [];
                const path = [];
                const bt = (start) => {
                    if (path.length === m) { result.push(path.join(' ')); return; }
                    for (let i = start; i <= n; i++) {
                        path.push(i);
                        bt(i);
                        path.pop();
                    }
                };
                bt(1);
                return result.join('\n');
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n, m = map(int, input().split())
path = []

def backtrack(start):
    if len(path) == m:
        print(*path)
        return
    for i in range(start, n + 1):
        path.append(i)
        backtrack(i)    # i+1이 아닌 i!
        path.pop()

backtrack(1)`,
                cpp: `#include <iostream>
using namespace std;

int n, m;
int path[9];

void backtrack(int depth, int start) {
    if (depth == m) {
        for (int i = 0; i < m; i++)
            cout << path[i] << (i < m-1 ? " " : "\\n");
        return;
    }
    for (int i = start; i <= n; i++) {
        path[depth] = i;
        backtrack(depth + 1, i);  // i+1이 아닌 i!
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n >> m;
    backtrack(0, 1);
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, m;
    static int[] path;
    static StringBuilder sb = new StringBuilder();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt(); m = sc.nextInt();
        path = new int[m];
        backtrack(0, 1);
        System.out.print(sb);
    }

    static void backtrack(int depth, int start) {
        if (depth == m) {
            for (int i = 0; i < m; i++)
                sb.append(path[i]).append(i < m-1 ? " " : "\\n");
            return;
        }
        for (int i = start; i <= n; i++) {
            path[depth] = i;
            backtrack(depth + 1, i);  // i+1이 아닌 i!
        }
    }
}`
            }
        },

        // ========== 2단계: 응용 백트래킹 ==========
        {
            id: 'boj-14888',
            title: 'BOJ 14888 - 연산자 끼워넣기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14888',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수로 이루어진 수열 A₁, A₂, ..., Aₙ이 주어진다. 수와 수 사이에 끼워넣을 수 있는 연산자가 N-1개 주어진다.</p>
                <p>연산자는 +, -, ×, ÷ 네 종류이다. 수의 순서는 바꿀 수 없고, 연산자 우선순위를 무시하고 앞에서부터 계산한다.</p>
                <p>만들 수 있는 식의 결과가 최대인 것과 최소인 것을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                        <p>첫째 줄에 수의 개수 N (2 ≤ N ≤ 11)<br>
                        둘째 줄에 A₁ ~ Aₙ<br>
                        셋째 줄에 +, -, ×, ÷의 개수</p>
                    </div>
                    <div><h4>출력</h4><p>첫째 줄에 최댓값, 둘째 줄에 최솟값을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>2\n5 6\n0 0 1 0</pre></div>
                        <div><strong>출력</strong><pre>30\n30</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>6\n1 2 3 4 5 6\n2 1 1 1</pre></div>
                        <div><strong>출력</strong><pre>54\n-24</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '연산자를 하나씩 배치하며 백트래킹합니다. 각 연산자의 <strong>남은 개수</strong>를 추적합니다.' },
                { title: '상태 관리', content: '<code>ops = [+개수, -개수, ×개수, ÷개수]</code>를 관리하며, 사용할 때 빼고 되돌릴 때 다시 더합니다.' },
                { title: '나눗셈 처리', content: '정수 나눗셈이며, 음수를 양수로 나눌 때 C++과 Python의 동작이 다릅니다. <code>int(a/b)</code> (0 방향 버림)을 사용하세요.' }
            ],
            inputLabel: 'N 값',
            inputMin: 2, inputMax: 11, inputDefault: 6,
            solve(n) {
                // 간단한 예시 결과
                if (n === 6) return '54\n-24';
                if (n === 2) return '30\n30';
                return '(BOJ에서 직접 확인하세요)';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))
ops = list(map(int, input().split()))  # +, -, *, //

max_val = -1e9
min_val = 1e9

def backtrack(idx, current):
    global max_val, min_val
    if idx == n:
        max_val = max(max_val, current)
        min_val = min(min_val, current)
        return
    for i in range(4):
        if ops[i] > 0:
            ops[i] -= 1
            if i == 0:   nxt = current + nums[idx]
            elif i == 1: nxt = current - nums[idx]
            elif i == 2: nxt = current * nums[idx]
            else:        nxt = int(current / nums[idx])  # 0 방향 버림
            backtrack(idx + 1, nxt)
            ops[i] += 1

backtrack(1, nums[0])
print(max_val)
print(min_val)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int n, nums[12], ops[4];
int maxVal = -1e9, minVal = 1e9;

void backtrack(int idx, int cur) {
    if (idx == n) {
        maxVal = max(maxVal, cur);
        minVal = min(minVal, cur);
        return;
    }
    for (int i = 0; i < 4; i++) {
        if (ops[i] > 0) {
            ops[i]--;
            int nxt;
            if (i == 0) nxt = cur + nums[idx];
            else if (i == 1) nxt = cur - nums[idx];
            else if (i == 2) nxt = cur * nums[idx];
            else nxt = cur / nums[idx];
            backtrack(idx + 1, nxt);
            ops[i]++;
        }
    }
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> nums[i];
    for (int i = 0; i < 4; i++) cin >> ops[i];
    backtrack(1, nums[0]);
    cout << maxVal << "\\n" << minVal << endl;
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n;
    static int[] nums, ops = new int[4];
    static int maxVal = Integer.MIN_VALUE;
    static int minVal = Integer.MAX_VALUE;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        for (int i = 0; i < 4; i++) ops[i] = sc.nextInt();
        backtrack(1, nums[0]);
        System.out.println(maxVal);
        System.out.println(minVal);
    }

    static void backtrack(int idx, int cur) {
        if (idx == n) {
            maxVal = Math.max(maxVal, cur);
            minVal = Math.min(minVal, cur);
            return;
        }
        for (int i = 0; i < 4; i++) {
            if (ops[i] > 0) {
                ops[i]--;
                int nxt = 0;
                if (i == 0) nxt = cur + nums[idx];
                else if (i == 1) nxt = cur - nums[idx];
                else if (i == 2) nxt = cur * nums[idx];
                else nxt = (int)(cur / (double)nums[idx]);
                backtrack(idx + 1, nxt);
                ops[i]++;
            }
        }
    }
}`
            }
        },
        {
            id: 'boj-14889',
            title: 'BOJ 14889 - 스타트와 링크',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14889',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N명을 N/2명씩 두 팀으로 나눌 때, 두 팀의 능력치 차이의 최솟값을 구하시오.</p>
                <p>팀의 능력치 = 같은 팀 모든 쌍 (i, j)에 대해 S[i][j] + S[j][i]의 합</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N (4 ≤ N ≤ 20, 짝수), N×N 능력치 행렬 S</p></div>
                    <div><h4>출력</h4><p>두 팀의 능력치 차이의 최솟값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4\n0 1 2 3\n4 0 5 6\n7 1 0 2\n3 4 5 0</pre></div>
                        <div><strong>출력</strong><pre>0</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'N명 중 N/2명을 골라내는 문제입니다. 고른 사람이 스타트 팀, 나머지가 링크 팀이 됩니다.' },
                { title: '능력치 계산', content: '한 팀의 능력치는 팀원 중 모든 쌍 (i, j)에 대해 <code>S[i][j] + S[j][i]</code>를 합산합니다.' },
                { title: '가지치기', content: '첫 번째 사람은 항상 스타트 팀에 넣어도 됩니다 (대칭). 이렇게 하면 탐색량이 절반으로 줄어듭니다.' }
            ],
            inputLabel: 'N 값',
            inputMin: 4, inputMax: 20, inputDefault: 4,
            solve(n) {
                if (n === 4) return '0';
                return '(BOJ에서 직접 확인하세요)';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
s = [list(map(int, input().split())) for _ in range(n)]
ans = float('inf')

def calc(team):
    total = 0
    for i in range(len(team)):
        for j in range(i+1, len(team)):
            total += s[team[i]][team[j]] + s[team[j]][team[i]]
    return total

def backtrack(idx, team):
    global ans
    if len(team) == n // 2:
        other = [i for i in range(n) if i not in set(team)]
        diff = abs(calc(team) - calc(other))
        ans = min(ans, diff)
        return
    if idx >= n:
        return
    # 남은 인원으로 팀을 채울 수 있는지 확인
    if n - idx < n // 2 - len(team):
        return
    team.append(idx)
    backtrack(idx + 1, team)
    team.pop()
    backtrack(idx + 1, team)

backtrack(0, [])
print(ans)`,
                cpp: `#include <iostream>
#include <algorithm>
#include <cmath>
using namespace std;

int n, s[20][20];
bool team[20];
int ans = 1e9;

void backtrack(int idx, int cnt) {
    if (cnt == n / 2) {
        int s1 = 0, s2 = 0;
        for (int i = 0; i < n; i++)
            for (int j = i+1; j < n; j++) {
                if (team[i] && team[j])
                    s1 += s[i][j] + s[j][i];
                else if (!team[i] && !team[j])
                    s2 += s[i][j] + s[j][i];
            }
        ans = min(ans, abs(s1 - s2));
        return;
    }
    if (idx >= n) return;
    if (n - idx < n/2 - cnt) return;
    team[idx] = true;
    backtrack(idx + 1, cnt + 1);
    team[idx] = false;
    backtrack(idx + 1, cnt);
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> s[i][j];
    backtrack(0, 0);
    cout << ans << endl;
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, ans = Integer.MAX_VALUE;
    static int[][] s;
    static boolean[] team;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        s = new int[n][n];
        team = new boolean[n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                s[i][j] = sc.nextInt();
        backtrack(0, 0);
        System.out.println(ans);
    }

    static void backtrack(int idx, int cnt) {
        if (cnt == n / 2) {
            int s1 = 0, s2 = 0;
            for (int i = 0; i < n; i++)
                for (int j = i+1; j < n; j++) {
                    if (team[i] && team[j]) s1 += s[i][j] + s[j][i];
                    else if (!team[i] && !team[j]) s2 += s[i][j] + s[j][i];
                }
            ans = Math.min(ans, Math.abs(s1 - s2));
            return;
        }
        if (idx >= n || n - idx < n/2 - cnt) return;
        team[idx] = true;
        backtrack(idx + 1, cnt + 1);
        team[idx] = false;
        backtrack(idx + 1, cnt);
    }
}`
            }
        },

        // ========== 3단계: 심화 백트래킹 ==========
        {
            id: 'boj-9663',
            title: 'BOJ 9663 - N-Queen',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9663',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N × N인 체스판 위에 퀸 N개를 서로 공격할 수 없게 놓는 문제이다.</p>
                <p>N이 주어졌을 때, 퀸을 놓는 방법의 수를 구하는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N이 주어진다. (1 ≤ N < 15)</p></div>
                    <div><h4>출력</h4><p>퀸 N개를 서로 공격할 수 없게 놓는 경우의 수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>8</pre></div>
                        <div><strong>출력</strong><pre>92</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '한 행에 퀸을 하나씩 놓으면서 백트래킹합니다. 각 행에서 퀸을 놓을 <strong>열</strong>을 선택합니다.' },
                { title: '충돌 확인', content: '같은 열 충돌: <code>col[c]</code>, 대각선 충돌: <code>diag1[r-c+N]</code>과 <code>diag2[r+c]</code>를 사용합니다.' },
                { title: '대각선 원리', content: '\\(↘\\) 대각선: 같은 대각선의 <code>row - col</code> 값이 동일합니다.<br>\\(↗\\) 대각선: 같은 대각선의 <code>row + col</code> 값이 동일합니다.' },
                { title: '최적화', content: '2차원 배열 대신 1차원 배열 3개(col, diag1, diag2)를 쓰면 O(1)에 충돌을 확인할 수 있습니다.' }
            ],
            inputLabel: 'N 값',
            inputMin: 1, inputMax: 14, inputDefault: 8,
            solve(n) {
                const answers = [0, 1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680, 14200, 73712, 365596];
                return '' + (answers[n] || 0);
            },
            templates: {
                python: `import sys

n = int(sys.stdin.readline())
col = [False] * n
diag1 = [False] * (2 * n)  # row - col + n
diag2 = [False] * (2 * n)  # row + col
count = 0

def solve(row):
    global count
    if row == n:
        count += 1
        return
    for c in range(n):
        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:
            col[c] = diag1[row - c + n] = diag2[row + c] = True
            solve(row + 1)
            col[c] = diag1[row - c + n] = diag2[row + c] = False

solve(0)
print(count)`,
                cpp: `#include <iostream>
using namespace std;

int n, cnt = 0;
bool col[15], diag1[30], diag2[30];

void solve(int row) {
    if (row == n) { cnt++; return; }
    for (int c = 0; c < n; c++) {
        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {
            col[c] = diag1[row-c+n] = diag2[row+c] = true;
            solve(row + 1);
            col[c] = diag1[row-c+n] = diag2[row+c] = false;
        }
    }
}

int main() {
    cin >> n;
    solve(0);
    cout << cnt << endl;
}`,
                java: `import java.util.Scanner;

public class Main {
    static int n, count = 0;
    static boolean[] col, diag1, diag2;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        col = new boolean[n];
        diag1 = new boolean[2 * n];
        diag2 = new boolean[2 * n];
        solve(0);
        System.out.println(count);
    }

    static void solve(int row) {
        if (row == n) { count++; return; }
        for (int c = 0; c < n; c++) {
            if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {
                col[c] = diag1[row-c+n] = diag2[row+c] = true;
                solve(row + 1);
                col[c] = diag1[row-c+n] = diag2[row+c] = false;
            }
        }
    }
}`
            }
        },
        {
            id: 'boj-2580',
            title: 'BOJ 2580 - 스도쿠',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2580',
            descriptionHTML: `
                <h3>문제</h3>
                <p>9×9 스도쿠 판이 주어진다. 빈 칸(0)을 규칙에 맞게 채워서 완성하시오.</p>
                <ul>
                    <li>각 가로줄에 1~9가 하나씩</li>
                    <li>각 세로줄에 1~9가 하나씩</li>
                    <li>각 3×3 박스에 1~9가 하나씩</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4><p>9개 줄에 걸쳐 9×9 스도쿠 판이 주어진다. 빈 칸은 0으로 표시.</p></div>
                    <div><h4>출력</h4><p>완성된 9×9 스도쿠 판을 출력한다.</p></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '빈 칸의 좌표를 미리 모아두고, 순서대로 1~9를 넣어 보면서 백트래킹합니다.' },
                { title: '조건 확인', content: '숫자를 넣을 때 같은 행, 같은 열, 같은 3×3 박스에 중복이 없는지 확인합니다.<br>3×3 박스의 시작점: <code>(row//3*3, col//3*3)</code>' },
                { title: '종료 조건', content: '빈 칸을 모두 채우면 답을 출력하고 <strong>즉시 종료</strong>합니다. 답이 여러 개일 수 있지만 하나만 출력하면 됩니다.' },
                { title: '최적화 팁', content: '가능한 숫자가 적은 빈 칸부터 채우면 가지치기 효과가 커집니다.' }
            ],
            inputLabel: 'N 값',
            inputMin: 9, inputMax: 9, inputDefault: 9,
            solve() {
                return '(스도쿠는 입력에 따라 답이 다릅니다.\nBOJ에서 직접 확인하세요)';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

board = [list(map(int, input().split())) for _ in range(9)]
blanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]

def is_valid(r, c, num):
    # 행 확인
    if num in board[r]: return False
    # 열 확인
    for i in range(9):
        if board[i][c] == num: return False
    # 3x3 박스 확인
    sr, sc = r // 3 * 3, c // 3 * 3
    for i in range(sr, sr + 3):
        for j in range(sc, sc + 3):
            if board[i][j] == num: return False
    return True

def solve(idx):
    if idx == len(blanks):
        for row in board:
            print(*row)
        sys.exit()
    r, c = blanks[idx]
    for num in range(1, 10):
        if is_valid(r, c, num):
            board[r][c] = num
            solve(idx + 1)
            board[r][c] = 0

solve(0)`,
                cpp: `#include <iostream>
#include <vector>
#include <cstdlib>
using namespace std;

int board[9][9];
vector<pair<int,int>> blanks;

bool isValid(int r, int c, int num) {
    for (int i = 0; i < 9; i++) {
        if (board[r][i] == num) return false;
        if (board[i][c] == num) return false;
    }
    int sr = r/3*3, sc = c/3*3;
    for (int i = sr; i < sr+3; i++)
        for (int j = sc; j < sc+3; j++)
            if (board[i][j] == num) return false;
    return true;
}

void solve(int idx) {
    if (idx == blanks.size()) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++)
                cout << board[i][j] << (j < 8 ? " " : "\\n");
        }
        exit(0);
    }
    auto [r, c] = blanks[idx];
    for (int num = 1; num <= 9; num++) {
        if (isValid(r, c, num)) {
            board[r][c] = num;
            solve(idx + 1);
            board[r][c] = 0;
        }
    }
}

int main() {
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            cin >> board[i][j];
            if (board[i][j] == 0) blanks.push_back({i, j});
        }
    solve(0);
}`,
                java: `import java.util.*;

public class Main {
    static int[][] board = new int[9][9];
    static List<int[]> blanks = new ArrayList<>();

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < 9; i++)
            for (int j = 0; j < 9; j++) {
                board[i][j] = sc.nextInt();
                if (board[i][j] == 0) blanks.add(new int[]{i, j});
            }
        solve(0);
    }

    static boolean isValid(int r, int c, int num) {
        for (int i = 0; i < 9; i++) {
            if (board[r][i] == num || board[i][c] == num) return false;
        }
        int sr = r/3*3, sc = c/3*3;
        for (int i = sr; i < sr+3; i++)
            for (int j = sc; j < sc+3; j++)
                if (board[i][j] == num) return false;
        return true;
    }

    static void solve(int idx) {
        if (idx == blanks.size()) {
            StringBuilder sb = new StringBuilder();
            for (int[] row : board) {
                for (int j = 0; j < 9; j++)
                    sb.append(row[j]).append(j < 8 ? " " : "\\n");
            }
            System.out.print(sb);
            System.exit(0);
        }
        int r = blanks.get(idx)[0], c = blanks.get(idx)[1];
        for (int num = 1; num <= 9; num++) {
            if (isValid(r, c, num)) {
                board[r][c] = num;
                solve(idx + 1);
                board[r][c] = 0;
            }
        }
    }
}`
            }
        }
    ]
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.backtracking = backtrackingTopic;
