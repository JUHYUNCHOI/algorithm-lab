// ===== 백트래킹 토픽 모듈 =====
var backtrackingTopic = {
    id: 'backtracking',
    title: '백트래킹',
    icon: '🔙',
    category: '알고리즘 기법',
    order: 10,
    description: '끝까지 해보고, 안 되면 돌아와서 다른 길을 가보는 기법',
    relatedNote: '백트래킹은 순열/조합 생성, 제약 충족 문제(CSP), 게임 트리 탐색 등에 광범위하게 활용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-15649': { type: '순열',       color: 'var(--accent)', vizMethod: '_renderVizNM1', suffix: '-nm1' },
        'boj-15650': { type: '조합',       color: 'var(--green)',  vizMethod: '_renderVizNM2', suffix: '-nm2' },
        'boj-15651': { type: '중복 순열',   color: '#e17055',      vizMethod: '_renderVizNM3', suffix: '-nm3' },
        'boj-15652': { type: '중복 조합',   color: '#fdcb6e',      vizMethod: '_renderVizNM4', suffix: '-nm4' },
        'boj-14888': { type: '연산자 배치', color: '#6c5ce7',      vizMethod: '_renderVizOperator', suffix: '-op' },
        'boj-14889': { type: '팀 분배',    color: '#00b894',      vizMethod: '_renderVizTeam', suffix: '-team' },
        'boj-9663':  { type: 'N-Queen',    color: '#d63031',      vizMethod: '_renderVizNQueen', suffix: '-nq' },
        'boj-2580':  { type: '스도쿠',     color: '#0984e3',      vizMethod: '_renderVizSudoku', suffix: '-sdk' }
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
            sim:     { intro: prob.simIntro || '백트래킹이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });

        var treeContainer = container.querySelector('#bt-decision-tree');
        var instructionEl = container.querySelector('#bt-tree-instruction');
        var resultsEl = container.querySelector('#bt-tree-results');
        var resetBtn = container.querySelector('#bt-tree-reset');

        if (treeContainer) {
            this._buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn);
        }
    },
    _buildDecisionTree(treeContainer, instructionEl, resultsEl, resetBtn) {
        var N = 3, M = 2;
        var results = [];
        var currentDepth = 0;
        var path = [];
        var nodeData = [];

        var renderTree = function() {
            treeContainer.innerHTML = '';
            nodeData = [];
            var rootRow = document.createElement('div');
            rootRow.className = 'bt-tree-row';
            var rootNode = document.createElement('div');
            rootNode.className = 'bt-tree-node expanded';
            rootNode.textContent = '시작';
            rootRow.appendChild(rootNode);
            treeContainer.appendChild(rootRow);

            var level1Row = document.createElement('div');
            level1Row.className = 'bt-tree-row';
            for (var i = 1; i <= N; i++) {
                var node = document.createElement('div');
                node.className = 'bt-tree-node';
                node.textContent = i;
                node.dataset.depth = '0';
                node.dataset.value = i;
                if (currentDepth === 0 && path.length === 0) {
                    (function(val) { node.addEventListener('click', function() { selectNode(0, val); }); })(i);
                } else if (path.length > 0 && path[0] === i) {
                    node.classList.add('expanded');
                } else if (path.length > 0) {
                    node.classList.add('disabled');
                }
                level1Row.appendChild(node);
                nodeData.push({ depth: 0, value: i, el: node });
            }
            treeContainer.appendChild(level1Row);

            if (path.length >= 1) {
                var level2Row = document.createElement('div');
                level2Row.className = 'bt-tree-row';
                for (var i = 1; i <= N; i++) {
                    var node = document.createElement('div');
                    node.dataset.depth = '1';
                    node.dataset.value = i;
                    if (i === path[0]) {
                        node.className = 'bt-tree-node pruned';
                        node.textContent = i + '✕';
                    } else if (path.length === 2 && path[1] === i) {
                        node.className = 'bt-tree-node leaf';
                        node.textContent = path[0] + ',' + i;
                    } else if (path.length === 1) {
                        node.className = 'bt-tree-node';
                        node.textContent = i;
                        (function(val) { node.addEventListener('click', function() { selectNode(1, val); }); })(i);
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

        var selectNode = function(depth, value) {
            if (depth === 0) {
                path = [value];
                currentDepth = 1;
                instructionEl.textContent = '첫 번째로 ' + value + '을(를) 선택했습니다. 두 번째 숫자를 고르세요!';
            } else if (depth === 1) {
                path = [path[0], value];
                results.push(path.slice());
                updateResults();
                instructionEl.textContent = '[' + path.join(', ') + '] 완성! 클릭하여 되돌아가세요';
                currentDepth = 2;
            }
            renderTree();
            if (depth === 1) {
                setTimeout(function() {
                    if (currentDepth !== 2) return;
                    doBacktrack();
                }, 1200);
            }
        };

        var doBacktrack = function() {
            if (path.length === 2) {
                var first = path[0];
                var second = path[1];
                var nextSecond = null;
                for (var i = second + 1; i <= N; i++) {
                    if (i !== first) { nextSecond = i; break; }
                }
                if (nextSecond) {
                    path = [first];
                    currentDepth = 1;
                    instructionEl.textContent = '되돌아갔습니다! 다음 두 번째 숫자를 고르세요';
                    renderTree();
                } else {
                    var nextFirst = null;
                    for (var i = first + 1; i <= N; i++) { nextFirst = i; break; }
                    if (nextFirst) {
                        path = [];
                        currentDepth = 0;
                        instructionEl.textContent = '첫 번째 선택도 되돌렸습니다! 다음 첫 번째 숫자를 고르세요';
                        renderTree();
                    } else {
                        path = [];
                        currentDepth = -1;
                        instructionEl.textContent = '✅ 모든 경우를 찾았습니다! 총 ' + results.length + '개';
                        resetBtn.classList.remove('hidden');
                        renderTree();
                    }
                }
            }
        };

        var updateResults = function() {
            resultsEl.innerHTML = '찾은 수열: ' + results.map(function(r) { return '<span class="bt-result-tag">[' + r.join(', ') + ']</span>'; }).join(' ');
        };

        resetBtn.addEventListener('click', function() {
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

    // ===== 시각화 렌더링 (개념 탭 전용) =====
    renderVisualize(container) {
        var self = this;
        var suffix = '-concept-bt';
        container.innerHTML =
            '<h2>백트래킹 시각화</h2>' +
            '<p style="color:var(--text2);margin-bottom:12px;">N=4, M=2에서 순열을 생성하는 백트래킹 과정입니다.</p>' +
            '<div id="bt-path' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="bt-used' + suffix + '" style="text-align:center;margin-bottom:12px;"></div>' +
            '<div id="bt-results' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;min-height:36px;margin-bottom:12px;text-align:center;"></div>' +
            self._createStepControls(suffix);
        var pathEl = container.querySelector('#bt-path' + suffix);
        var usedEl = container.querySelector('#bt-used' + suffix);
        var resultsEl = container.querySelector('#bt-results' + suffix);
        var N = 4, M = 2;
        function renderUsed(used) {
            usedEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                usedEl.innerHTML += '<span style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;margin:2px;border-radius:6px;font-weight:600;' + (used[i] ? 'background:var(--accent);color:white;' : 'background:var(--bg2);') + '">' + i + '</span>';
            }
        }
        renderUsed([false, false, false, false, false]);
        resultsEl.innerHTML = '<span style="color:var(--text3);">찾은 수열이 여기에 표시됩니다</span>';
        var steps = [];
        var path = [], used = [false, false, false, false, false];
        var foundResults = [];
        var solve = function(depth) {
            if (depth === M) {
                var snap = path.slice();
                var rc = foundResults.length + 1;
                foundResults.push(snap);
                (function(snap, rc) {
                    steps.push({
                        description: '수열 [' + snap.join(', ') + '] 완성! (' + rc + '번째)',
                        action: function() {
                            pathEl.textContent = 'path = [ ' + snap.join(', ') + ' ] ✓';
                            pathEl.style.color = 'var(--green)';
                            resultsEl.innerHTML = foundResults.slice(0, rc).map(function(r) { return '<span style="display:inline-block;padding:4px 8px;margin:2px;background:var(--green)15;border-radius:6px;font-size:0.85rem;">[' + r.join(', ') + ']</span>'; }).join(' ');
                        },
                        undo: function() {
                            var prev = snap.slice(0, -1);
                            pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                            pathEl.style.color = '';
                            resultsEl.innerHTML = foundResults.slice(0, rc - 1).length > 0 ? foundResults.slice(0, rc - 1).map(function(r) { return '<span style="display:inline-block;padding:4px 8px;margin:2px;background:var(--green)15;border-radius:6px;font-size:0.85rem;">[' + r.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">찾은 수열이 여기에 표시됩니다</span>';
                        }
                    });
                })(snap, rc);
                return;
            }
            for (var i = 1; i <= N; i++) {
                if (used[i]) {
                    (function(ci, snapPath, snapUsed) {
                        steps.push({
                            description: '숫자 ' + ci + '는 이미 사용 중 → 건너뜀',
                            action: function() { pathEl.textContent = 'path = [ ' + snapPath.join(', ') + (snapPath.length > 0 ? ', ' : '') + ci + '? ]'; pathEl.style.color = 'var(--red)'; setTimeout(function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; }, 300); renderUsed(snapUsed); },
                            undo: function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); }
                        });
                    })(i, path.slice(), used.slice());
                    continue;
                }
                used[i] = true;
                path.push(i);
                (function(ci, snapPath, snapUsed) {
                    steps.push({
                        description: '숫자 ' + ci + '를 선택 → path = [' + snapPath.join(', ') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + snapPath.join(', ') + (snapPath.length < M ? ', ___' : '') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); },
                        undo: function() { var prev = snapPath.slice(0, -1); pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; var prevUsed = snapUsed.slice(); prevUsed[ci] = false; renderUsed(prevUsed); }
                    });
                })(i, path.slice(), used.slice());
                solve(depth + 1);
                path.pop();
                used[i] = false;
                (function(ci, snapPath, snapUsed) {
                    steps.push({
                        description: '숫자 ' + ci + '를 되돌림 → path = [' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ']',
                        action: function() { pathEl.textContent = 'path = [ ' + (snapPath.length > 0 ? snapPath.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = ''; renderUsed(snapUsed); },
                        undo: function() { var restored = snapPath.slice(); restored.push(ci); pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]'; var restoredUsed = snapUsed.slice(); restoredUsed[ci] = true; renderUsed(restoredUsed); }
                    });
                })(i, path.slice(), used.slice());
            }
        };
        solve(0);
        steps.push({ description: '탐색 완료! 총 ' + foundResults.length + '개의 수열을 찾았습니다', action: function() {}, undo: function() {} });
        self._initStepController(container, steps, suffix);
    },

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
    // 시뮬레이션 1: N과 M (1) — 순열 (boj-15649)
    // ====================================================================
    _renderVizNM1(contentEl) {
        var self = this;
        var suffix = '-nm1';
        var N = 4, M = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N과 M (1) — 순열 생성</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">{1,2,3,4}에서 중복 없이 2개를 골라 순열을 생성합니다.</p>' +
            '<div id="nm1-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="nm1-used' + suffix + '" style="text-align:center;margin-bottom:8px;"></div>' +
            '<div id="nm1-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm1-path' + suffix);
        var usedEl = contentEl.querySelector('#nm1-used' + suffix);
        var resultsEl = contentEl.querySelector('#nm1-results' + suffix);
        function renderUsed(u) { var h = ''; for (var i = 1; i <= N; i++) h += '<span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;margin:2px;border-radius:6px;font-weight:600;font-size:0.85rem;' + (u[i] ? 'background:var(--accent);color:white;' : 'background:var(--bg2);') + '">' + i + '</span>'; usedEl.innerHTML = h; }
        renderUsed([false,false,false,false,false]);
        resultsEl.innerHTML = '<span style="color:var(--text3);">수열이 여기에 표시됩니다</span>';
        var steps = [], path = [], used = [false,false,false,false,false], found = [];
        var solve = function(depth) {
            if (depth === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                (function(s,r) { steps.push({ description: '수열 [' + s.join(', ') + '] 완성! (' + r + '번째)',
                    action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                    undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">수열이 여기에 표시됩니다</span>'; }
                }); })(snap, rc); return; }
            for (var i = 1; i <= N; i++) {
                if (used[i]) { (function(ci,sp,su) { steps.push({ description: ci + '는 사용 중 → 건너뜀 (가지치기)',
                    action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ':'') + ci + '? ]'; pathEl.style.color = 'var(--red)'; renderUsed(su); },
                    undo: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; renderUsed(su); }
                }); })(i,path.slice(),used.slice()); continue; }
                used[i] = true; path.push(i);
                (function(ci,sp,su) { steps.push({ description: ci + '를 선택 → path = [' + sp.join(', ') + ']',
                    action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ]'; pathEl.style.color = ''; renderUsed(su); },
                    undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; var pu = su.slice(); pu[ci] = false; renderUsed(pu); }
                }); })(i,path.slice(),used.slice());
                solve(depth + 1);
                path.pop(); used[i] = false;
                (function(ci,sp,su) { steps.push({ description: ci + '를 되돌림',
                    action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; renderUsed(su); },
                    undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ]'; var ru = su.slice(); ru[ci] = true; renderUsed(ru); }
                }); })(i,path.slice(),used.slice());
            }
        };
        solve(0);
        steps.push({ description: '탐색 완료! 총 ' + found.length + '개', action: function(){}, undo: function(){} });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: N과 M (2) — 조합 (boj-15650)
    // ====================================================================
    _renderVizNM2(contentEl) {
        var self = this, suffix = '-nm2';
        var N = 4, M = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N과 M (2) — 조합 생성</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">{1,2,3,4}에서 2개를 오름차순으로 고릅니다. start 파라미터로 중복을 방지합니다.</p>' +
            '<div id="nm2-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ], start = 1</div>' +
            '<div id="nm2-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm2-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm2-results' + suffix);
        resultsEl.innerHTML = '<span style="color:var(--text3);">조합이 여기에 표시됩니다</span>';
        var steps = [], path = [], found = [];
        var solve = function(start) {
            if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                (function(s,r) { steps.push({ description: '조합 [' + s.join(', ') + '] 완성! (' + r + '번째)',
                    action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                    undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + s[s.length-1]; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">조합이 여기에 표시됩니다</span>'; }
                }); })(snap,rc); return; }
            for (var i = start; i <= N; i++) {
                path.push(i);
                (function(ci,sp,st) { steps.push({ description: ci + '를 선택 (start=' + st + ') → path = [' + sp.join(', ') + ']',
                    action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ], start = ' + (ci+1); pathEl.style.color = ''; },
                    undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + st; }
                }); })(i,path.slice(),start);
                solve(i + 1);
                path.pop();
                (function(ci,sp,st) { steps.push({ description: ci + '를 되돌림',
                    action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ], start = ' + st; pathEl.style.color = ''; },
                    undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ], start = ' + (ci+1); }
                }); })(i,path.slice(),start);
            }
        };
        solve(1);
        steps.push({ description: '탐색 완료! 총 ' + found.length + '개의 조합', action: function(){}, undo: function(){} });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: N과 M (3) — 중복 순열 (boj-15651)
    // ====================================================================
    _renderVizNM3(contentEl) {
        var self = this, suffix = '-nm3';
        var N = 3, M = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N과 M (3) — 중복 순열</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">{1,2,3}에서 중복 허용하여 2개를 고릅니다. used 배열이 없습니다!</p>' +
            '<div id="nm3-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ]</div>' +
            '<div id="nm3-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm3-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm3-results' + suffix);
        resultsEl.innerHTML = '<span style="color:var(--text3);">중복 순열이 여기에 표시됩니다</span>';
        var steps = [], path = [], found = [];
        var solve = function() {
            if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                (function(s,r) { steps.push({ description: '[' + s.join(', ') + '] 완성! (' + r + '번째)',
                    action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                    undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">중복 순열이 여기에 표시됩니다</span>'; }
                }); })(snap,rc); return; }
            for (var i = 1; i <= N; i++) {
                path.push(i);
                (function(ci,sp) { steps.push({ description: ci + '를 선택 → path = [' + sp.join(', ') + '] (중복 허용)',
                    action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ]'; pathEl.style.color = ''; },
                    undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ]'; }
                }); })(i,path.slice());
                solve();
                path.pop();
                (function(ci,sp) { steps.push({ description: ci + '를 되돌림',
                    action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ]'; pathEl.style.color = ''; },
                    undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ]'; }
                }); })(i,path.slice());
            }
        };
        solve();
        steps.push({ description: '탐색 완료! 총 ' + found.length + '개 (N^M = ' + N + '^' + M + ' = ' + Math.pow(N,M) + ')', action: function(){}, undo: function(){} });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: N과 M (4) — 중복 조합 (boj-15652)
    // ====================================================================
    _renderVizNM4(contentEl) {
        var self = this, suffix = '-nm4';
        var N = 3, M = 2;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N과 M (4) — 중복 조합</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">{1,2,3}에서 중복 허용 + 비내림차순으로 2개를 고릅니다. start를 i로 넘깁니다 (i+1 아님!).</p>' +
            '<div id="nm4-path' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:8px;">path = [ ], start = 1</div>' +
            '<div id="nm4-results' + suffix + '" style="padding:8px;background:var(--bg);border-radius:8px;min-height:32px;margin-bottom:12px;text-align:center;font-size:0.85rem;"></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm4-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm4-results' + suffix);
        resultsEl.innerHTML = '<span style="color:var(--text3);">중복 조합이 여기에 표시됩니다</span>';
        var steps = [], path = [], found = [];
        var solve = function(start) {
            if (path.length === M) { var snap = path.slice(); found.push(snap); var rc = found.length;
                (function(s,r) { steps.push({ description: '[' + s.join(', ') + '] 완성! (' + r + '번째)',
                    action: function() { pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)'; resultsEl.innerHTML = found.slice(0,r).map(function(x){return '['+x.join(',')+']';}).join(' '); },
                    undo: function() { var p = s.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + s[s.length-1]; pathEl.style.color = ''; resultsEl.innerHTML = r>1 ? found.slice(0,r-1).map(function(x){return '['+x.join(',')+']';}).join(' ') : '<span style="color:var(--text3);">중복 조합이 여기에 표시됩니다</span>'; }
                }); })(snap,rc); return; }
            for (var i = start; i <= N; i++) {
                path.push(i);
                (function(ci,sp,st) { steps.push({ description: ci + '를 선택 (start=' + st + ') → path = [' + sp.join(', ') + ']',
                    action: function() { pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length<M?', ___':'') + ' ], start = ' + ci; pathEl.style.color = ''; },
                    undo: function() { var p = sp.slice(0,-1); pathEl.textContent = 'path = [ ' + (p.length>0?p.join(', ')+', ___':'___') + ' ], start = ' + st; }
                }); })(i,path.slice(),start);
                solve(i); // i, not i+1!
                path.pop();
                (function(ci,sp,st) { steps.push({ description: ci + '를 되돌림',
                    action: function() { pathEl.textContent = 'path = [ ' + (sp.length>0?sp.join(', ')+', ___':'___') + ' ], start = ' + st; pathEl.style.color = ''; },
                    undo: function() { var r = sp.slice(); r.push(ci); pathEl.textContent = 'path = [ ' + r.join(', ') + (r.length<M?', ___':'') + ' ], start = ' + ci; }
                }); })(i,path.slice(),start);
            }
        };
        solve(1);
        steps.push({ description: '탐색 완료! 총 ' + found.length + '개의 중복 조합', action: function(){}, undo: function(){} });
        self._initStepController(contentEl, steps, suffix);
    },
    // ====================================================================
    // 시뮬레이션 5: 연산자 끼워넣기 (boj-14888)
    // ====================================================================
    _renderVizOperator(contentEl) {
        var self = this, suffix = '-op';
        var nums = [1, 2, 3], ops = [1, 1, 0, 0]; // +1, -1
        var opSyms = ['+', '-', '*', '/'];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">연산자 끼워넣기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">숫자 [1, 2, 3], 연산자 +1개, -1개. 모든 배치를 시도하여 최대/최소를 구합니다.</p>' +
            '<div id="op-expr' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:600;margin-bottom:8px;">1 ☐ 2 ☐ 3</div>' +
            '<div id="op-ops' + suffix + '" style="text-align:center;margin-bottom:8px;font-size:0.85rem;"></div>' +
            '<div id="op-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = contentEl.querySelector('#op-expr' + suffix);
        var opsEl = contentEl.querySelector('#op-ops' + suffix);
        var infoEl = contentEl.querySelector('#op-info' + suffix);
        function renderOps(o) { opsEl.innerHTML = '남은 연산자: + ' + o[0] + '개, - ' + o[1] + '개'; }
        renderOps(ops);
        infoEl.innerHTML = '<span style="color:var(--text2);">최댓값과 최솟값을 찾습니다</span>';
        var steps = [], results = [], maxV = -Infinity, minV = Infinity;
        var curOps = ops.slice();
        var solve = function(idx, current, expr) {
            if (idx === nums.length) {
                results.push({ expr: expr, val: current });
                if (current > maxV) maxV = current;
                if (current < minV) minV = current;
                var rc = results.length, cm = maxV, cn = minV, ce = expr, cv = current;
                (function(rc, cm, cn, ce, cv) {
                    steps.push({ description: ce + ' = ' + cv + ' (현재 max=' + cm + ', min=' + cn + ')',
                        action: function() { exprEl.textContent = ce + ' = ' + cv; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = '결과 ' + rc + '개 | <strong>max = ' + cm + '</strong>, <strong>min = ' + cn + '</strong>'; },
                        undo: function() { exprEl.textContent = '1 ☐ 2 ☐ 3'; exprEl.style.color = ''; var prev = rc > 1 ? results[rc-2] : null; infoEl.innerHTML = prev ? '결과 ' + (rc-1) + '개' : '<span style="color:var(--text2);">최댓값과 최솟값을 찾습니다</span>'; }
                    });
                })(rc, cm, cn, ce, cv);
                return;
            }
            for (var i = 0; i < 4; i++) {
                if (curOps[i] > 0) {
                    curOps[i]--;
                    var nxt;
                    if (i === 0) nxt = current + nums[idx];
                    else if (i === 1) nxt = current - nums[idx];
                    else if (i === 2) nxt = current * nums[idx];
                    else nxt = (current / nums[idx]) | 0;
                    var newExpr = expr + ' ' + opSyms[i] + ' ' + nums[idx];
                    var snapOps = curOps.slice();
                    (function(ci, ne, so) {
                        steps.push({ description: opSyms[ci] + ' ' + nums[idx] + ' 시도 → ' + ne,
                            action: function() { exprEl.textContent = ne + ' ☐ ...'; exprEl.style.color = ''; renderOps(so); },
                            undo: function() { var po = so.slice(); po[ci]++; exprEl.textContent = expr + ' ☐ ...'; renderOps(po); }
                        });
                    })(i, newExpr, snapOps);
                    solve(idx + 1, nxt, newExpr);
                    curOps[i]++;
                }
            }
        };
        solve(1, nums[0], '' + nums[0]);
        var fm = maxV, fn = minV;
        steps.push({ description: '완료! 최댓값 = ' + fm + ', 최솟값 = ' + fn,
            action: function() { exprEl.textContent = 'max = ' + fm + ', min = ' + fn; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최댓값 = ' + fm + ', 최솟값 = ' + fn + '</strong>'; },
            undo: function() { exprEl.textContent = '1 ☐ 2 ☐ 3'; exprEl.style.color = ''; }
        });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 6: 스타트와 링크 (boj-14889)
    // ====================================================================
    _renderVizTeam(contentEl) {
        var self = this, suffix = '-team';
        var N = 4;
        var S = [[0,1,2,3],[4,0,5,6],[7,1,0,2],[3,4,5,0]];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">스타트와 링크 — 팀 분배</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4명을 2명씩 두 팀으로 나누어 시너지 차이를 최소화합니다.</p>' +
            '<div id="tm-teams' + suffix + '" style="display:flex;gap:16px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="tm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var teamsEl = contentEl.querySelector('#tm-teams' + suffix);
        var infoEl = contentEl.querySelector('#tm-info' + suffix);
        function renderTeams(startT, linkT, s1, s2) {
            teamsEl.innerHTML =
                '<div style="flex:1;text-align:center;padding:10px;border-radius:8px;background:var(--accent)10;border:2px solid var(--accent);">' +
                '<div style="font-weight:600;margin-bottom:4px;color:var(--accent);">Start 팀</div>' +
                '<div>' + (startT.length > 0 ? startT.map(function(x){return '<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;margin:2px;border-radius:50%;background:var(--accent);color:white;font-weight:600;font-size:0.8rem;">' + (x+1) + '</span>';}).join('') : '-') + '</div>' +
                (s1 !== null ? '<div style="font-size:0.85rem;margin-top:4px;">시너지: ' + s1 + '</div>' : '') + '</div>' +
                '<div style="flex:1;text-align:center;padding:10px;border-radius:8px;background:var(--green)10;border:2px solid var(--green);">' +
                '<div style="font-weight:600;margin-bottom:4px;color:var(--green);">Link 팀</div>' +
                '<div>' + (linkT.length > 0 ? linkT.map(function(x){return '<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;margin:2px;border-radius:50%;background:var(--green);color:white;font-weight:600;font-size:0.8rem;">' + (x+1) + '</span>';}).join('') : '-') + '</div>' +
                (s2 !== null ? '<div style="font-size:0.85rem;margin-top:4px;">시너지: ' + s2 + '</div>' : '') + '</div>';
        }
        renderTeams([], [], null, null);
        infoEl.innerHTML = '<span style="color:var(--text2);">시너지 차이의 최솟값을 찾습니다</span>';
        function calcSynergy(team) { var t = 0; for (var i = 0; i < team.length; i++) for (var j = i+1; j < team.length; j++) t += S[team[i]][team[j]] + S[team[j]][team[i]]; return t; }
        var steps = [], ans = Infinity;
        // enumerate C(4,2) = 6
        var combos = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
        for (var ci = 0; ci < combos.length; ci++) {
            var startT = combos[ci];
            var linkT = [];
            for (var j = 0; j < N; j++) { if (startT.indexOf(j) < 0) linkT.push(j); }
            var s1 = calcSynergy(startT), s2 = calcSynergy(linkT);
            var diff = Math.abs(s1 - s2);
            if (diff < ans) ans = diff;
            (function(st, lt, s1, s2, diff, ca) {
                steps.push({ description: 'Start=[' + st.map(function(x){return x+1;}).join(',') + '] Link=[' + lt.map(function(x){return x+1;}).join(',') + '] → 시너지 차이 = |' + s1 + '-' + s2 + '| = ' + diff + (diff === ca ? ' (현재 최소!)' : ''),
                    action: function() { renderTeams(st, lt, s1, s2); infoEl.innerHTML = '차이 = |' + s1 + ' - ' + s2 + '| = <strong>' + diff + '</strong>' + (diff === ca ? ' <span style="color:var(--green);">← 최소!</span>' : '') + ' | 현재 최솟값 = ' + ca; },
                    undo: function() { renderTeams([], [], null, null); infoEl.innerHTML = '<span style="color:var(--text2);">시너지 차이의 최솟값을 찾습니다</span>'; }
                });
            })(startT, linkT, s1, s2, diff, ans);
        }
        var fa = ans;
        steps.push({ description: '완료! 최소 차이 = ' + fa,
            action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최소 시너지 차이 = ' + fa + '</strong>'; },
            undo: function() {}
        });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 7: N-Queen (boj-9663)
    // ====================================================================
    _renderVizNQueen(contentEl) {
        var self = this, suffix = '-nq';
        var n = 4;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N-Queen (N=4)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 체스판에 퀸 4개를 서로 공격할 수 없게 놓습니다.</p>' +
            '<div id="nq-board' + suffix + '" style="display:grid;grid-template-columns:repeat(4,48px);gap:2px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="nq-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#nq-board' + suffix);
        var infoEl = contentEl.querySelector('#nq-info' + suffix);
        // build board
        for (var r = 0; r < n; r++) {
            for (var c = 0; c < n; c++) {
                var cell = document.createElement('div');
                cell.style.cssText = 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;border-radius:4px;transition:all 0.3s;' + ((r+c)%2===0 ? 'background:#f0d9b5;' : 'background:#b58863;');
                cell.dataset.row = r;
                cell.dataset.col = c;
                boardEl.appendChild(cell);
            }
        }
        function getCell(r, c) { return boardEl.querySelector('[data-row="' + r + '"][data-col="' + c + '"]'); }
        infoEl.innerHTML = '<span style="color:var(--text2);">행별로 퀸을 배치합니다.</span>';
        var steps = [], queens = [-1,-1,-1,-1], solCount = 0;
        function isValid(row, col) { for (var r = 0; r < row; r++) { if (queens[r] === col || Math.abs(queens[r]-col) === Math.abs(r-row)) return false; } return true; }
        function getConflicts(row, col) { var cf = []; for (var r = 0; r < row; r++) { if (queens[r] === col) cf.push({r:r,c:queens[r]}); if (Math.abs(queens[r]-col) === Math.abs(r-row)) cf.push({r:r,c:queens[r]}); } return cf; }
        var solve = function(row) {
            if (row === n) {
                solCount++;
                var sc = solCount, qs = queens.slice();
                steps.push({ description: sc + '번째 해를 찾았습니다!',
                    action: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = '#00b894'; infoEl.innerHTML = '<strong style="color:var(--green);">' + sc + '번째 해 발견!</strong>'; },
                    undo: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = (r+qs[r])%2===0 ? '#f0d9b5' : '#b58863'; }
                });
                return;
            }
            for (var col = 0; col < n; col++) {
                var cr = row, cc = col;
                // try
                (function(cr, cc) {
                    steps.push({ description: (cr+1) + '행 ' + (cc+1) + '열에 퀸을 시도...',
                        action: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; },
                        undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                    });
                })(cr, cc);
                if (isValid(row, col)) {
                    queens[row] = col;
                    (function(cr, cc) {
                        steps.push({ description: '✅ ' + (cr+1) + '행 ' + (cc+1) + '열: 충돌 없음! 퀸 배치',
                            action: function() { getCell(cr, cc).textContent = '♛'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; },
                            undo: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; getCell(cr,cc).style.color = ''; }
                        });
                    })(cr, cc);
                    solve(row + 1);
                    queens[row] = -1;
                    (function(cr, cc) {
                        steps.push({ description: '↩️ ' + (cr+1) + '행 ' + (cc+1) + '열 퀸 제거',
                            action: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; getCell(cr,cc).style.color = ''; },
                            undo: function() { getCell(cr, cc).textContent = '♛'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; }
                        });
                    })(cr, cc);
                } else {
                    var conflicts = getConflicts(row, col);
                    (function(cr, cc, cfs) {
                        steps.push({ description: '❌ ' + (cr+1) + '행 ' + (cc+1) + '열: 충돌! 건너뜀',
                            action: function() { getCell(cr, cc).textContent = '✕'; getCell(cr, cc).style.background = '#e17055'; setTimeout(function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }, 400); },
                            undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(cr, cc, conflicts);
                }
            }
        };
        solve(0);
        var fsc = solCount;
        steps.push({ description: '탐색 완료! ' + fsc + '개의 해를 찾았습니다', action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 총 ' + fsc + '개의 해</strong>'; }, undo: function(){} });
        self._initStepController(contentEl, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 8: 스도쿠 (boj-2580)
    // ====================================================================
    _renderVizSudoku(contentEl) {
        var self = this, suffix = '-sdk';
        // 4x4 mini sudoku
        var board = [
            [1, 0, 0, 4],
            [0, 4, 1, 0],
            [0, 1, 4, 0],
            [4, 0, 0, 1]
        ];
        var solution = [
            [1, 2, 3, 4],
            [3, 4, 1, 2],
            [2, 1, 4, 3],
            [4, 3, 2, 1]
        ];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">스도쿠 (4×4 미니)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4×4 스도쿠의 빈 칸을 백트래킹으로 채웁니다. 각 행, 열, 2×2 박스에 1~4가 하나씩.</p>' +
            '<div id="sdk-board' + suffix + '" style="display:grid;grid-template-columns:repeat(4,48px);gap:2px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sdk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#sdk-board' + suffix);
        var infoEl = contentEl.querySelector('#sdk-info' + suffix);
        var gridState = board.map(function(row) { return row.slice(); });
        // build board
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 4; c++) {
                var cell = document.createElement('div');
                var borderR = c === 1 ? '2px solid #333;' : '1px solid var(--border);';
                var borderB = r === 1 ? '2px solid #333;' : '1px solid var(--border);';
                cell.style.cssText = 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:600;border-right:' + borderR + 'border-bottom:' + borderB + 'background:' + (board[r][c] !== 0 ? 'var(--bg2)' : 'white') + ';';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.textContent = board[r][c] !== 0 ? board[r][c] : '';
                boardEl.appendChild(cell);
            }
        }
        function getCell(r, c) { return boardEl.querySelector('[data-row="' + r + '"][data-col="' + c + '"]'); }
        infoEl.innerHTML = '<span style="color:var(--text2);">빈 칸에 1~4를 넣어봅니다.</span>';
        var blanks = [];
        for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) if (board[r][c] === 0) blanks.push([r, c]);
        var steps = [];
        function isValid(r, c, num) {
            for (var i = 0; i < 4; i++) { if (gridState[r][i] === num || gridState[i][c] === num) return false; }
            var sr = (r < 2) ? 0 : 2, sc = (c < 2) ? 0 : 2;
            for (var i = sr; i < sr + 2; i++) for (var j = sc; j < sc + 2; j++) if (gridState[i][j] === num) return false;
            return true;
        }
        var solved = false;
        var solve = function(idx) {
            if (solved) return;
            if (idx === blanks.length) {
                solved = true;
                steps.push({ description: '✅ 스도쿠 완성!',
                    action: function() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var cl = getCell(r,c); if (board[r][c] === 0) cl.style.color = 'var(--green)'; } infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 스도쿠 완성!</strong>'; },
                    undo: function() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var cl = getCell(r,c); cl.style.color = ''; } }
                });
                return;
            }
            var br = blanks[idx][0], bc = blanks[idx][1];
            for (var num = 1; num <= 4; num++) {
                if (solved) return;
                (function(br, bc, num) {
                    steps.push({ description: '(' + (br+1) + ',' + (bc+1) + ')에 ' + num + '을 시도...',
                        action: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = '#6c5ce7'; infoEl.innerHTML = '(' + (br+1) + ',' + (bc+1) + ')에 ' + num + ' 시도 중...'; },
                        undo: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; }
                    });
                })(br, bc, num);
                if (isValid(br, bc, num)) {
                    gridState[br][bc] = num;
                    (function(br, bc, num) {
                        steps.push({ description: '✅ (' + (br+1) + ',' + (bc+1) + ') = ' + num + ' 가능! 배치',
                            action: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = 'var(--accent)'; },
                            undo: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = '#6c5ce7'; }
                        });
                    })(br, bc, num);
                    solve(idx + 1);
                    if (solved) return;
                    gridState[br][bc] = 0;
                    (function(br, bc) {
                        steps.push({ description: '↩️ (' + (br+1) + ',' + (bc+1) + ') 되돌림',
                            action: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; },
                            undo: function() {}
                        });
                    })(br, bc);
                } else {
                    (function(br, bc, num) {
                        steps.push({ description: '❌ (' + (br+1) + ',' + (bc+1) + ')에 ' + num + ' 불가 (충돌)',
                            action: function() { getCell(br, bc).style.background = '#e1705530'; setTimeout(function() { getCell(br, bc).style.background = 'white'; getCell(br, bc).textContent = ''; getCell(br,bc).style.color = ''; }, 300); },
                            undo: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; getCell(br, bc).style.background = 'white'; }
                        });
                    })(br, bc, num);
                }
            }
        };
        solve(0);
        self._initStepController(contentEl, steps, suffix);
    },
    // ===== 빈 스텁 =====
    renderProblem(container) {},

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
            simIntro: 'used 배열을 사용한 순열 생성 백트래킹 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p><ul><li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li></ul><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div><div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 증가하는 순서로 수열을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3 1</pre></div><div><strong>출력</strong><pre>1\n2\n3</pre></div></div><div class="example-grid" style="margin-top:8px;"><div><strong>입력</strong><pre>4 2</pre></div><div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 1\n2 3\n2 4\n3 1\n3 2\n3 4\n4 1\n4 2\n4 3</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '<code>used</code> 배열로 각 숫자의 사용 여부를 추적하면서 재귀적으로 수열을 만듭니다.' },
                { title: '기본 구조', content: '<code>backtrack(depth)</code> 함수를 만들어, <code>depth == M</code>이면 현재 수열을 출력합니다.' },
                { title: '되돌리기', content: '숫자를 선택한 뒤 재귀 호출이 끝나면 <code>used[i] = False</code>와 <code>path.pop()</code>으로 되돌려야 합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)\n\ndef backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:\n            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\nbool used[9];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        if (!used[i]) {\n            used[i] = true;\n            path[depth] = i;\n            backtrack(depth + 1);\n            used[i] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0);\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, m;\n    static int[] path;\n    static boolean[] used;\n    static StringBuilder sb = new StringBuilder();\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt(); m = sc.nextInt();\n        path = new int[m];\n        used = new boolean[n + 1];\n        backtrack(0);\n        System.out.print(sb);\n    }\n\n    static void backtrack(int depth) {\n        if (depth == m) {\n            for (int i = 0; i < m; i++)\n                sb.append(path[i]).append(i < m-1 ? " " : "\\n");\n            return;\n        }\n        for (int i = 1; i <= n; i++) {\n            if (!used[i]) {\n                used[i] = true;\n                path[depth] = i;\n                backtrack(depth + 1);\n                used[i] = false;\n            }\n        }\n    }\n}'
            },
            solutions: [{
                approach: 'used 배열 백트래킹',
                description: 'used 배열로 사용 여부를 추적하며 순열을 생성한다',
                timeComplexity: 'O(N!/(N-M)!)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '기본 세팅', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)' },
                        { title: '백트래킹 함수', code: 'def backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:' },
                        { title: '선택과 되돌리기', code: '            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-15650',
            title: 'BOJ 15650 - N과 M (2)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15650',
            simIntro: 'start 파라미터로 오름차순 조합을 생성하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p><ul><li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li><li>고른 수열은 오름차순이어야 한다.</li></ul><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div><div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4 2</pre></div><div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 3\n2 4\n3 4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'N과 M (1)에서 <strong>오름차순</strong> 조건만 추가하면 됩니다. 이전에 고른 숫자보다 큰 것만 고르면 됩니다.' },
                { title: '핵심 변경', content: '<code>backtrack(start)</code>에서 반복문을 <code>start</code>부터 시작하면 자연스럽게 오름차순이 됩니다.' },
                { title: '차이점', content: '<code>used</code> 배열이 필요 없습니다! <code>start</code> 파라미터가 중복을 자동으로 방지합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i + 1)\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i + 1);\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0, 1);\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, m;\n    static int[] path;\n    static StringBuilder sb = new StringBuilder();\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt(); m = sc.nextInt();\n        path = new int[m];\n        backtrack(0, 1);\n        System.out.print(sb);\n    }\n\n    static void backtrack(int depth, int start) {\n        if (depth == m) {\n            for (int i = 0; i < m; i++)\n                sb.append(path[i]).append(i < m-1 ? " " : "\\n");\n            return;\n        }\n        for (int i = start; i <= n; i++) {\n            path[depth] = i;\n            backtrack(depth + 1, i + 1);\n        }\n    }\n}'
            },
            solutions: [{
                approach: 'start 파라미터 조합',
                description: 'start 파라미터로 오름차순 조합만 생성한다',
                timeComplexity: 'O(C(N,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start 파라미터', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'i+1로 재귀', code: '        path.append(i)\n        backtrack(i + 1)  # i+1로 오름차순 보장\n        path.pop()\n\nbacktrack(1)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-15651',
            title: 'BOJ 15651 - N과 M (3)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15651',
            simIntro: '중복을 허용하는 순열 생성 과정을 관찰하세요. used 배열이 없습니다!',
            descriptionHTML: '<h3>문제</h3><p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p><ul><li>1부터 N까지 자연수 중에서 M개를 고른 수열</li><li>같은 수를 여러 번 골라도 된다.</li></ul><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 7)</p></div><div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3 1</pre></div><div><strong>출력</strong><pre>1\n2\n3</pre></div></div><div class="example-grid" style="margin-top:8px;"><div><strong>입력</strong><pre>4 2</pre></div><div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 1\n2 2\n2 3\n2 4\n3 1\n3 2\n3 3\n3 4\n4 1\n4 2\n4 3\n4 4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'N과 M (1)에서 <code>used</code> 배열을 <strong>없애면</strong> 됩니다. 중복을 허용하므로 사용 여부를 확인하지 않습니다.' },
                { title: '핵심 변경', content: '매번 1부터 N까지 모든 숫자를 선택 가능하므로 반복문이 항상 <code>range(1, n+1)</code>입니다.' },
                { title: '주의사항', content: '출력량이 많으므로 Python에서는 <code>sys.stdout.write()</code>를, C++에서는 <code>printf</code> 또는 <code>ios::sync_with_stdio(false)</code>를 사용하세요.' }
            ],
            templates: {
                python: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []\n\ndef backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):\n        path.append(i)\n        backtrack()\n        path.pop()\n\nbacktrack()\nsys.stdout.write(\'\\n\'.join(result))',
                cpp: '#include <cstdio>\n\nint n, m;\nint path[8];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            printf("%d%c", path[i], i < m-1 ? \' \' : \'\\n\');\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1);\n    }\n}\n\nint main() {\n    scanf("%d %d", &n, &m);\n    backtrack(0);\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, m;\n    static int[] path;\n    static StringBuilder sb = new StringBuilder();\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt(); m = sc.nextInt();\n        path = new int[m];\n        backtrack(0);\n        System.out.print(sb);\n    }\n\n    static void backtrack(int depth) {\n        if (depth == m) {\n            for (int i = 0; i < m; i++)\n                sb.append(path[i]).append(i < m-1 ? " " : "\\n");\n            return;\n        }\n        for (int i = 1; i <= n; i++) {\n            path[depth] = i;\n            backtrack(depth + 1);\n        }\n    }\n}'
            },
            solutions: [{
                approach: '제한 없는 중복 순열',
                description: 'used 배열 없이 모든 조합을 생성한다',
                timeComplexity: 'O(N^M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', code: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []' },
                        { title: '백트래킹 (used 없음)', code: 'def backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):  # 제한 없이 1~N\n        path.append(i)\n        backtrack()\n        path.pop()' },
                        { title: '전체 출력 최적화', code: 'backtrack()\nsys.stdout.write(\'\\n\'.join(result))' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-15652',
            title: 'BOJ 15652 - N과 M (4)',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/15652',
            simIntro: '중복 조합을 생성하는 과정을 관찰하세요. start를 i로 넘기는 것이 핵심입니다!',
            descriptionHTML: '<h3>문제</h3><p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p><ul><li>1부터 N까지 자연수 중에서 M개를 고른 수열</li><li>같은 수를 여러 번 골라도 된다.</li><li>고른 수열은 비내림차순이어야 한다.</li></ul><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p></div><div><h4>출력</h4><p>한 줄에 하나씩, 사전 순으로 수열을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3 1</pre></div><div><strong>출력</strong><pre>1\n2\n3</pre></div></div><div class="example-grid" style="margin-top:8px;"><div><strong>입력</strong><pre>4 2</pre></div><div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 2\n2 3\n2 4\n3 3\n3 4\n4 4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'N과 M (2)와 비슷하지만, 같은 수를 또 골라도 됩니다. <code>start</code>를 <code>i+1</code>이 아니라 <code>i</code>로 넘기면 됩니다.' },
                { title: '핵심 변경', content: '<code>backtrack(i)</code>로 재귀 호출합니다 (<code>i+1</code>이 아님). 이렇게 하면 자기 자신을 다시 선택할 수 있습니다.' },
                { title: 'N과 M 시리즈 비교', content: '(1) 순서 있게 고르기 = used 배열 (2) 순서 없이 고르기 = start, i+1 (3) 중복 허용+순서 = 제한 없음 (4) 중복 허용+순서 없음 = start, i' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i)    # i+1이 아닌 i!\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i);  // i+1이 아닌 i!\n    }\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    cin >> n >> m;\n    backtrack(0, 1);\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, m;\n    static int[] path;\n    static StringBuilder sb = new StringBuilder();\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt(); m = sc.nextInt();\n        path = new int[m];\n        backtrack(0, 1);\n        System.out.print(sb);\n    }\n\n    static void backtrack(int depth, int start) {\n        if (depth == m) {\n            for (int i = 0; i < m; i++)\n                sb.append(path[i]).append(i < m-1 ? " " : "\\n");\n            return;\n        }\n        for (int i = start; i <= n; i++) {\n            path[depth] = i;\n            backtrack(depth + 1, i);  // i+1이 아닌 i!\n        }\n    }\n}'
            },
            solutions: [{
                approach: 'start 파라미터 중복 조합',
                description: 'start를 i로 넘겨 중복 허용 비내림차순 조합을 생성한다',
                timeComplexity: 'O(C(N+M-1,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start 파라미터', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'i로 재귀 (i+1 아님)', code: '        path.append(i)\n        backtrack(i)    # i+1이 아닌 i!\n        path.pop()\n\nbacktrack(1)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[3].templates; }
            }]
        },
        // ========== 2단계: 응용 백트래킹 ==========
        {
            id: 'boj-14888',
            title: 'BOJ 14888 - 연산자 끼워넣기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14888',
            simIntro: '연산자를 배치하며 최대/최소를 찾는 백트래킹 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 수로 이루어진 수열 A와 N-1개의 연산자가 주어진다. 수의 순서는 바꿀 수 없고, 연산자 우선순위를 무시하고 앞에서부터 계산한다. 만들 수 있는 식의 결과가 최대인 것과 최소인 것을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>N (2 ≤ N ≤ 11), A₁~Aₙ, +/-/*/÷ 개수</p></div><div><h4>출력</h4><p>첫째 줄에 최댓값, 둘째 줄에 최솟값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>2\n5 6\n0 0 1 0</pre></div><div><strong>출력</strong><pre>30\n30</pre></div></div><div class="example-grid" style="margin-top:8px;"><div><strong>입력</strong><pre>6\n1 2 3 4 5 6\n2 1 1 1</pre></div><div><strong>출력</strong><pre>54\n-24</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '연산자를 하나씩 배치하며 백트래킹합니다. 각 연산자의 <strong>남은 개수</strong>를 추적합니다.' },
                { title: '상태 관리', content: '<code>ops = [+개수, -개수, ×개수, ÷개수]</code>를 관리하며, 사용할 때 빼고 되돌릴 때 다시 더합니다.' },
                { title: '나눗셈 처리', content: '정수 나눗셈이며, 음수를 양수로 나눌 때 C++과 Python의 동작이 다릅니다. <code>int(a/b)</code> (0 방향 버림)을 사용하세요.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))  # +, -, *, //\n\nmax_val = -1e9\nmin_val = 1e9\n\ndef backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])  # 0 방향 버림\n            backtrack(idx + 1, nxt)\n            ops[i] += 1\n\nbacktrack(1, nums[0])\nprint(max_val)\nprint(min_val)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint n, nums[12], ops[4];\nint maxVal = -1e9, minVal = 1e9;\n\nvoid backtrack(int idx, int cur) {\n    if (idx == n) {\n        maxVal = max(maxVal, cur);\n        minVal = min(minVal, cur);\n        return;\n    }\n    for (int i = 0; i < 4; i++) {\n        if (ops[i] > 0) {\n            ops[i]--;\n            int nxt;\n            if (i == 0) nxt = cur + nums[idx];\n            else if (i == 1) nxt = cur - nums[idx];\n            else if (i == 2) nxt = cur * nums[idx];\n            else nxt = cur / nums[idx];\n            backtrack(idx + 1, nxt);\n            ops[i]++;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    for (int i = 0; i < 4; i++) cin >> ops[i];\n    backtrack(1, nums[0]);\n    cout << maxVal << "\\n" << minVal << endl;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n;\n    static int[] nums, ops = new int[4];\n    static int maxVal = Integer.MIN_VALUE;\n    static int minVal = Integer.MAX_VALUE;\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt();\n        nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        for (int i = 0; i < 4; i++) ops[i] = sc.nextInt();\n        backtrack(1, nums[0]);\n        System.out.println(maxVal);\n        System.out.println(minVal);\n    }\n\n    static void backtrack(int idx, int cur) {\n        if (idx == n) {\n            maxVal = Math.max(maxVal, cur);\n            minVal = Math.min(minVal, cur);\n            return;\n        }\n        for (int i = 0; i < 4; i++) {\n            if (ops[i] > 0) {\n                ops[i]--;\n                int nxt = 0;\n                if (i == 0) nxt = cur + nums[idx];\n                else if (i == 1) nxt = cur - nums[idx];\n                else if (i == 2) nxt = cur * nums[idx];\n                else nxt = (int)(cur / (double)nums[idx]);\n                backtrack(idx + 1, nxt);\n                ops[i]++;\n            }\n        }\n    }\n}'
            },
            solutions: [{
                approach: '연산자 배치 백트래킹',
                description: '연산자 개수를 소모/복구하며 모든 배치를 시도한다',
                timeComplexity: 'O(4^(N-1))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 처리', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))\n\nmax_val = -1e9\nmin_val = 1e9' },
                        { title: '연산자 소모/복구', code: 'def backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])\n            backtrack(idx + 1, nxt)\n            ops[i] += 1' },
                        { title: '최대/최소 갱신', code: 'backtrack(1, nums[0])\nprint(max_val)\nprint(min_val)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-14889',
            title: 'BOJ 14889 - 스타트와 링크',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14889',
            simIntro: 'N명을 두 팀으로 나누며 시너지 차이를 최소화하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N명을 N/2명씩 두 팀으로 나눌 때, 두 팀의 능력치 차이의 최솟값을 구하시오.</p><p>팀의 능력치 = 같은 팀 모든 쌍 (i, j)에 대해 S[i][j] + S[j][i]의 합</p><div class="problem-io"><div><h4>입력</h4><p>N (4 ≤ N ≤ 20, 짝수), N×N 능력치 행렬 S</p></div><div><h4>출력</h4><p>두 팀의 능력치 차이의 최솟값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4\n0 1 2 3\n4 0 5 6\n7 1 0 2\n3 4 5 0</pre></div><div><strong>출력</strong><pre>0</pre></div></div></div>',
            hints: [
                { title: '접근법', content: 'N명 중 N/2명을 골라내는 문제입니다. 고른 사람이 스타트 팀, 나머지가 링크 팀이 됩니다.' },
                { title: '능력치 계산', content: '한 팀의 능력치는 팀원 중 모든 쌍 (i, j)에 대해 <code>S[i][j] + S[j][i]</code>를 합산합니다.' },
                { title: '가지치기', content: '첫 번째 사람은 항상 스타트 팀에 넣어도 됩니다 (대칭). 이렇게 하면 탐색량이 절반으로 줄어듭니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')\n\ndef calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\ndef backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n:\n        return\n    if n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)\n\nbacktrack(0, [])\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint n, s[20][20];\nbool team[20];\nint ans = 1e9;\n\nvoid backtrack(int idx, int cnt) {\n    if (cnt == n / 2) {\n        int s1 = 0, s2 = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i+1; j < n; j++) {\n                if (team[i] && team[j])\n                    s1 += s[i][j] + s[j][i];\n                else if (!team[i] && !team[j])\n                    s2 += s[i][j] + s[j][i];\n            }\n        ans = min(ans, abs(s1 - s2));\n        return;\n    }\n    if (idx >= n) return;\n    if (n - idx < n/2 - cnt) return;\n    team[idx] = true;\n    backtrack(idx + 1, cnt + 1);\n    team[idx] = false;\n    backtrack(idx + 1, cnt);\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            cin >> s[i][j];\n    backtrack(0, 0);\n    cout << ans << endl;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, ans = Integer.MAX_VALUE;\n    static int[][] s;\n    static boolean[] team;\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt();\n        s = new int[n][n];\n        team = new boolean[n];\n        for (int i = 0; i < n; i++)\n            for (int j = 0; j < n; j++)\n                s[i][j] = sc.nextInt();\n        backtrack(0, 0);\n        System.out.println(ans);\n    }\n\n    static void backtrack(int idx, int cnt) {\n        if (cnt == n / 2) {\n            int s1 = 0, s2 = 0;\n            for (int i = 0; i < n; i++)\n                for (int j = i+1; j < n; j++) {\n                    if (team[i] && team[j]) s1 += s[i][j] + s[j][i];\n                    else if (!team[i] && !team[j]) s2 += s[i][j] + s[j][i];\n                }\n            ans = Math.min(ans, Math.abs(s1 - s2));\n            return;\n        }\n        if (idx >= n || n - idx < n/2 - cnt) return;\n        team[idx] = true;\n        backtrack(idx + 1, cnt + 1);\n        team[idx] = false;\n        backtrack(idx + 1, cnt);\n    }\n}'
            },
            solutions: [{
                approach: '팀 분배 백트래킹',
                description: 'N명 중 N/2명을 선택하여 시너지 차이를 최소화한다',
                timeComplexity: 'O(C(N,N/2)*N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력과 초기화', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')' },
                        { title: 'N/2명 선택', code: 'def backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n or n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)' },
                        { title: '시너지 계산과 차이', code: 'def calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\nbacktrack(0, [])\nprint(ans)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[5].templates; }
            }]
        },
        // ========== 3단계: 심화 백트래킹 ==========
        {
            id: 'boj-9663',
            title: 'BOJ 9663 - N-Queen',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/9663',
            simIntro: '4×4 체스판에서 퀸을 배치하고 충돌을 확인하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N × N인 체스판 위에 퀸 N개를 서로 공격할 수 없게 놓는 문제이다. N이 주어졌을 때, 퀸을 놓는 방법의 수를 구하는 프로그램을 작성하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N이 주어진다. (1 ≤ N < 15)</p></div><div><h4>출력</h4><p>퀸 N개를 서로 공격할 수 없게 놓는 경우의 수를 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>8</pre></div><div><strong>출력</strong><pre>92</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '한 행에 퀸을 하나씩 놓으면서 백트래킹합니다. 각 행에서 퀸을 놓을 <strong>열</strong>을 선택합니다.' },
                { title: '충돌 확인', content: '같은 열 충돌: <code>col[c]</code>, 대각선 충돌: <code>diag1[r-c+N]</code>과 <code>diag2[r+c]</code>를 사용합니다.' },
                { title: '대각선 원리', content: '(↘) 대각선: 같은 대각선의 <code>row - col</code> 값이 동일합니다.<br>(↗) 대각선: 같은 대각선의 <code>row + col</code> 값이 동일합니다.' },
                { title: '최적화', content: '2차원 배열 대신 1차원 배열 3개(col, diag1, diag2)를 쓰면 O(1)에 충돌을 확인할 수 있습니다.' }
            ],
            templates: {
                python: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0\n\ndef solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):\n        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, cnt = 0;\nbool col[15], diag1[30], diag2[30];\n\nvoid solve(int row) {\n    if (row == n) { cnt++; return; }\n    for (int c = 0; c < n; c++) {\n        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n            col[c] = diag1[row-c+n] = diag2[row+c] = true;\n            solve(row + 1);\n            col[c] = diag1[row-c+n] = diag2[row+c] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    solve(0);\n    cout << cnt << endl;\n}',
                java: 'import java.util.Scanner;\n\npublic class Main {\n    static int n, count = 0;\n    static boolean[] col, diag1, diag2;\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        n = sc.nextInt();\n        col = new boolean[n];\n        diag1 = new boolean[2 * n];\n        diag2 = new boolean[2 * n];\n        solve(0);\n        System.out.println(count);\n    }\n\n    static void solve(int row) {\n        if (row == n) { count++; return; }\n        for (int c = 0; c < n; c++) {\n            if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n                col[c] = diag1[row-c+n] = diag2[row+c] = true;\n                solve(row + 1);\n                col[c] = diag1[row-c+n] = diag2[row+c] = false;\n            }\n        }\n    }\n}'
            },
            solutions: [{
                approach: '열/대각선 체크 백트래킹',
                description: 'col, diag1, diag2 배열로 O(1) 충돌 체크한다',
                timeComplexity: 'O(N!)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '충돌 배열 세팅', code: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0' },
                        { title: '행별 퀸 배치', code: 'def solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):' },
                        { title: '대각선 충돌 체크', code: '        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-2580',
            title: 'BOJ 2580 - 스도쿠',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2580',
            simIntro: '4×4 미니 스도쿠에서 빈 칸을 채우는 백트래킹 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>9×9 스도쿠 판이 주어진다. 빈 칸(0)을 규칙에 맞게 채워서 완성하시오.</p><ul><li>각 가로줄에 1~9가 하나씩</li><li>각 세로줄에 1~9가 하나씩</li><li>각 3×3 박스에 1~9가 하나씩</li></ul><div class="problem-io"><div><h4>입력</h4><p>9개 줄에 걸쳐 9×9 스도쿠 판이 주어진다. 빈 칸은 0으로 표시.</p></div><div><h4>출력</h4><p>완성된 9×9 스도쿠 판을 출력한다.</p></div></div>',
            hints: [
                { title: '접근법', content: '빈 칸의 좌표를 미리 모아두고, 순서대로 1~9를 넣어 보면서 백트래킹합니다.' },
                { title: '조건 확인', content: '숫자를 넣을 때 같은 행, 같은 열, 같은 3×3 박스에 중복이 없는지 확인합니다.<br>3×3 박스의 시작점: <code>(row//3*3, col//3*3)</code>' },
                { title: '종료 조건', content: '빈 칸을 모두 채우면 답을 출력하고 <strong>즉시 종료</strong>합니다. 답이 여러 개일 수 있지만 하나만 출력하면 됩니다.' },
                { title: '최적화 팁', content: '가능한 숫자가 적은 빈 칸부터 채우면 가지치기 효과가 커집니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]\n\ndef is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True\n\ndef solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)',
                cpp: '#include <iostream>\n#include <vector>\n#include <cstdlib>\nusing namespace std;\n\nint board[9][9];\nvector<pair<int,int>> blanks;\n\nbool isValid(int r, int c, int num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == num) return false;\n        if (board[i][c] == num) return false;\n    }\n    int sr = r/3*3, sc = c/3*3;\n    for (int i = sr; i < sr+3; i++)\n        for (int j = sc; j < sc+3; j++)\n            if (board[i][j] == num) return false;\n    return true;\n}\n\nvoid solve(int idx) {\n    if (idx == blanks.size()) {\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++)\n                cout << board[i][j] << (j < 8 ? " " : "\\n");\n        }\n        exit(0);\n    }\n    auto [r, c] = blanks[idx];\n    for (int num = 1; num <= 9; num++) {\n        if (isValid(r, c, num)) {\n            board[r][c] = num;\n            solve(idx + 1);\n            board[r][c] = 0;\n        }\n    }\n}\n\nint main() {\n    for (int i = 0; i < 9; i++)\n        for (int j = 0; j < 9; j++) {\n            cin >> board[i][j];\n            if (board[i][j] == 0) blanks.push_back({i, j});\n        }\n    solve(0);\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    static int[][] board = new int[9][9];\n    static List<int[]> blanks = new ArrayList<>();\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        for (int i = 0; i < 9; i++)\n            for (int j = 0; j < 9; j++) {\n                board[i][j] = sc.nextInt();\n                if (board[i][j] == 0) blanks.add(new int[]{i, j});\n            }\n        solve(0);\n    }\n\n    static boolean isValid(int r, int c, int num) {\n        for (int i = 0; i < 9; i++) {\n            if (board[r][i] == num || board[i][c] == num) return false;\n        }\n        int sr = r/3*3, sc = c/3*3;\n        for (int i = sr; i < sr+3; i++)\n            for (int j = sc; j < sc+3; j++)\n                if (board[i][j] == num) return false;\n        return true;\n    }\n\n    static void solve(int idx) {\n        if (idx == blanks.size()) {\n            StringBuilder sb = new StringBuilder();\n            for (int[] row : board) {\n                for (int j = 0; j < 9; j++)\n                    sb.append(row[j]).append(j < 8 ? " " : "\\n");\n            }\n            System.out.print(sb);\n            System.exit(0);\n        }\n        int r = blanks.get(idx)[0], c = blanks.get(idx)[1];\n        for (int num = 1; num <= 9; num++) {\n            if (isValid(r, c, num)) {\n                board[r][c] = num;\n                solve(idx + 1);\n                board[r][c] = 0;\n            }\n        }\n    }\n}'
            },
            solutions: [{
                approach: '빈칸 채우기 백트래킹',
                description: '빈칸을 순서대로 1~9를 넣어보며 충돌 검사한다',
                timeComplexity: 'O(9^빈칸수)',
                spaceComplexity: 'O(81)',
                codeSteps: {
                    python: [
                        { title: '빈칸 수집', code: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]' },
                        { title: '행/열/박스 검증', code: 'def is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True' },
                        { title: '채우기와 출력', code: 'def solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)' }
                    ]
                },
                get templates() { return backtrackingTopic.problems[7].templates; }
            }]
        }
    ],

    // ===== 역호환 스텁 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { backtrackingTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.backtracking = backtrackingTopic;
