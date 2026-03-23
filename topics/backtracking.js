// ===== 백트래킹 토픽 모듈 =====
var backtrackingTopic = {
    id: 'backtracking',
    title: '백트래킹',
    icon: '🔙',
    category: '문제 해결 기법 (Silver~Gold)',
    order: 11,
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

                <span class="lang-py"><div class="code-block"><pre><code class="language-python">def backtrack(현재상태):
    if 정답을_찾았으면:
        결과에_추가
        return

    for 선택 in 선택목록:
        if 유효한_선택인지(선택):    # ✅ 조건 확인
            선택하기(선택)           # ☝️ 선택
            backtrack(다음상태)       # 재귀로 다음 단계
            선택_취소(선택)          # ↩️ 되돌아가기</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">void backtrack(State&amp; 현재상태) {
    if (정답을_찾았으면) {
        결과에_추가;
        return;
    }

    for (auto&amp; 선택 : 선택목록) {
        if (유효한_선택인지(선택)) {    // ✅ 조건 확인
            선택하기(선택);           // ☝️ 선택
            backtrack(다음상태);       // 재귀로 다음 단계
            선택_취소(선택);          // ↩️ 되돌아가기
        }
    }
}</code></pre></div></span>
                <div style="margin-top:0.6rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/itertools.html#itertools.permutations" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: itertools.permutations ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/next_permutation" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: next_permutation ↗</a></span>
                </div>

                <!-- Demo 2: 3요소따라가기 -->
                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 직접 해보기 — 3요소를 따라가며 순열 만들기</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-3elem-next">▶ 다음 단계</button>
                        <button class="concept-demo-btn green" id="bt-demo-3elem-reset">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">{1, 2, 3}에서 2개를 뽑는 순열을 선택/확인/되돌리기 3요소로 따라갑니다</p>
                        <div style="display:flex;gap:16px;justify-content:center;align-items:center;margin-bottom:12px;flex-wrap:wrap;">
                            <div>
                                <div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;text-align:center;">선택 가능</div>
                                <div id="bt-demo-3elem-pool" style="display:flex;gap:6px;justify-content:center;"></div>
                            </div>
                            <div style="font-size:1.2rem;color:var(--text3);">→</div>
                            <div>
                                <div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;text-align:center;">현재 경로 (path)</div>
                                <div id="bt-demo-3elem-path" style="display:flex;gap:6px;justify-content:center;min-width:80px;min-height:38px;border:2px dashed var(--border);border-radius:10px;padding:4px 10px;align-items:center;"></div>
                            </div>
                        </div>
                        <div id="bt-demo-3elem-used" style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;"></div>
                        <div id="bt-demo-3elem-results" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:28px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-3elem-msg">👆 "다음 단계"를 눌러 선택/확인/되돌리기가 어떻게 동작하는지 한 단계씩 따라가 보세요!</div>
                </div>

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

            <!-- ③ 사이클 방지 — used 배열의 역할 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 같은 요소를 다시 방문하지 않으려면?</div>
                <p style="margin-bottom: 1rem;">
                    순열을 만들 때 <strong>같은 숫자를 두 번 쓰면 안 됩니다</strong>.
                    이미 선택한 숫자를 기억하는 <code>used[]</code> 배열이 이 역할을 합니다.
                    <code>used[i] = true</code>이면 i번째 숫자는 이미 경로에 있으니 건너뜁니다.
                </p>

                <!-- Demo 3: 사이클 데모 -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — used 배열로 중복 방지</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle1">1 선택</button>
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle2">2 선택</button>
                        <button class="concept-demo-btn" id="bt-demo-cycle-toggle3">3 선택</button>
                        <button class="concept-demo-btn danger" id="bt-demo-cycle-clear">🗑️ 초기화</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">숫자를 선택하면 used 배열이 갱신됩니다. 이미 선택한 숫자를 다시 누르면 어떻게 될까요?</p>
                        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap;">
                            <div>
                                <div style="font-size:0.8rem;font-weight:600;margin-bottom:6px;text-align:center;">used 배열</div>
                                <div id="bt-demo-cycle-used" style="display:flex;gap:4px;justify-content:center;"></div>
                            </div>
                            <div>
                                <div style="font-size:0.8rem;font-weight:600;margin-bottom:6px;text-align:center;">현재 경로</div>
                                <div id="bt-demo-cycle-path" style="display:flex;gap:4px;justify-content:center;min-height:38px;align-items:center;font-size:1.1rem;font-weight:600;color:var(--accent);"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-cycle-msg">👆 숫자 버튼을 눌러 선택해 보세요! 이미 선택된 숫자를 다시 누르면 used 배열이 막아줍니다.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">used 배열 대신 path 안에 있는지 매번 확인하면 안 됩니까?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        할 수는 있지만 성능이 다릅니다!<br>
                        <code>used[i]</code>는 <strong>O(1)</strong>로 즉시 확인 가능하지만,
                        path 안에서 찾기(<code>i in path</code>)는 <strong>O(경로 길이)</strong>가 걸립니다.<br>
                        N이 클수록 차이가 커지므로, used 배열을 쓰는 게 효율적입니다.
                    </div>
                </div>
            </div>

            <!-- ④ 가지치기란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 가지치기란? (Pruning)</div>
                <p style="margin-bottom: 1rem;">백트래킹에서 가장 중요한 기술은
                    <strong>가지치기(Pruning)</strong>입니다.
                    조건에 맞지 않는 선택을 <strong>일찍 걸러내어</strong> 아예 탐색하지 않는 것입니다.</p>

                <!-- Demo 4: 가지치기 비교 -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 가지치기 있음 vs 없음</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-prune-run">▶ 탐색 시작</button>
                        <button class="concept-demo-btn green" id="bt-demo-prune-reset">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;">{1,2,3}에서 2개 순열 — 왼쪽은 가지치기 없이 모두 탐색, 오른쪽은 used[]로 가지치기</p>
                        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
                            <div style="flex:1;min-width:200px;max-width:280px;">
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;margin-bottom:6px;color:var(--red);">❌ 가지치기 없음</div>
                                <div id="bt-demo-prune-nop" style="font-size:0.82rem;line-height:1.8;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border);min-height:120px;"></div>
                                <div id="bt-demo-prune-nop-count" style="text-align:center;margin-top:6px;font-size:0.85rem;font-weight:600;color:var(--red);">탐색: 0회</div>
                            </div>
                            <div style="flex:1;min-width:200px;max-width:280px;">
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;margin-bottom:6px;color:var(--green);">✂️ 가지치기 적용</div>
                                <div id="bt-demo-prune-yes" style="font-size:0.82rem;line-height:1.8;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border);min-height:120px;"></div>
                                <div id="bt-demo-prune-yes-count" style="text-align:center;margin-top:6px;font-size:0.85rem;font-weight:600;color:var(--green);">탐색: 0회</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-prune-msg">👆 "탐색 시작"을 눌러 가지치기 유무에 따른 탐색 차이를 비교해 보세요!</div>
                </div>

                <div class="key-difference-box">
                    <div>✂️ 가지치기를 잘 하면 탐색 범위가 크게 줄어들어 훨씬 빨라집니다</div>
                    <div>📊 N-Queen (8×8): 모든 경우 약 <strong>1680만 가지</strong> → 가지치기 적용 시 약 <strong>15,000가지</strong>만 탐색</div>
                    <div>💡 "이 선택은 이미 안 된다"는 것을 빨리 알수록 성능이 좋아집니다</div>
                </div>
                <div style="margin-top:0.6rem;">
                    <a href="https://en.wikipedia.org/wiki/Backtracking" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Backtracking 알고리즘 ↗</a>
                </div>
            </div>

            <!-- ⑤ 백트래킹 vs 완전탐색 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 백트래킹 vs 완전탐색</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h3>🔍 완전탐색 (Brute Force)</h3>
                        <p class="approach-desc">모든 경우의 수를 전부 만들어 본 뒤에 확인합니다</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 중첩 반복문으로 모든 경우 생성
for i in range(1, n+1):
    for j in range(1, n+1):
        if i != j:  # 다 만든 뒤에 확인
            print(i, j)</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// 중첩 반복문으로 모든 경우 생성
for (int i = 1; i &lt;= n; i++) {
    for (int j = 1; j &lt;= n; j++) {
        if (i != j)  // 다 만든 뒤에 확인
            cout &lt;&lt; i &lt;&lt; " " &lt;&lt; j &lt;&lt; endl;
    }
}</code></pre></div></span>
                    </div>
                    <div class="approach-card">
                        <h3>🔙 백트래킹 (Backtracking)</h3>
                        <p class="approach-desc">조건에 맞지 않으면 즉시 되돌아갑니다</p>
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python">def solve(path, used):
    if len(path) == 2:
        print(*path)
        return
    for i in range(1, n+1):
        if not used[i]:   # 먼저 확인!
            used[i] = True
            path.append(i)
            solve(path, used)
            path.pop()       # 되돌리기
            used[i] = False  # 되돌리기</code></pre></div></span>
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">void solve(vector&lt;int&gt;&amp; path, vector&lt;bool&gt;&amp; used, int n) {
    if (path.size() == 2) {
        for (int x : path) cout &lt;&lt; x &lt;&lt; " ";
        cout &lt;&lt; endl;
        return;
    }
    for (int i = 1; i &lt;= n; i++) {
        if (!used[i]) {       // 먼저 확인!
            used[i] = true;
            path.push_back(i);
            solve(path, used, n);
            path.pop_back();  // 되돌리기
            used[i] = false;  // 되돌리기
        }
    }
}</code></pre></div></span>
                    </div>
                </div>

                <!-- Demo 5: 실행 비교 -->
                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 직접 해보기 — 실행 횟수 비교 (N 바꿔보기)</div>
                    <div class="concept-demo-btns">
                        <label style="font-size:0.85rem;color:var(--text2);display:flex;align-items:center;gap:6px;">N =
                            <input type="number" id="bt-demo-exec-n" value="4" min="2" max="8" style="width:50px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;background:var(--card);color:var(--text);">
                        </label>
                        <label style="font-size:0.85rem;color:var(--text2);display:flex;align-items:center;gap:6px;">M =
                            <input type="number" id="bt-demo-exec-m" value="2" min="1" max="6" style="width:50px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;font-size:0.9rem;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="bt-demo-exec-run">📊 비교 실행</button>
                    </div>
                    <div class="concept-demo-body">
                        <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;">N개에서 M개를 순서대로 고를 때, 완전탐색과 백트래킹의 탐색 횟수를 비교합니다</p>
                        <div style="display:flex;gap:24px;justify-content:center;align-items:flex-end;flex-wrap:wrap;">
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-bar-brute" style="width:60px;background:var(--red);border-radius:6px 6px 0 0;transition:height 0.6s;height:0px;margin:0 auto;"></div>
                                <div style="font-size:0.8rem;font-weight:600;margin-top:6px;color:var(--red);">완전탐색</div>
                                <div id="bt-demo-exec-val-brute" style="font-size:1.1rem;font-weight:700;color:var(--red);">0</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-bar-bt" style="width:60px;background:var(--green);border-radius:6px 6px 0 0;transition:height 0.6s;height:0px;margin:0 auto;"></div>
                                <div style="font-size:0.8rem;font-weight:600;margin-top:6px;color:var(--green);">백트래킹</div>
                                <div id="bt-demo-exec-val-bt" style="font-size:1.1rem;font-weight:700;color:var(--green);">0</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="bt-demo-exec-saved" style="font-size:0.9rem;color:var(--accent);font-weight:600;min-height:24px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-exec-msg">👆 N과 M을 바꿔가며 "비교 실행"을 눌러보세요! N이 커질수록 차이가 극적으로 벌어집니다.</div>
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

            <!-- ⑥ 4-Queen 체험 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">6</span> 4-Queen 문제 체험</div>
                <p style="margin-bottom:0.5rem;">4x4 체스판에 퀸 4개를 <strong>서로 공격할 수 없도록</strong> 놓아 보세요.
                    퀸은 같은 행, 같은 열, 대각선에 있는 말을 공격합니다.</p>
                <p style="margin-bottom:1rem;font-size:0.9rem;color:var(--text2);">
                    직접 놓아 보거나, "Step"을 눌러 백트래킹이 어떻게 해결하는지 한 단계씩 관찰하세요!</p>

                <!-- Demo 6: 4Queen -->
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 4-Queen 백트래킹</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bt-demo-4q-auto">Step ▶</button>
                        <button class="concept-demo-btn danger" id="bt-demo-4q-clear">Reset ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="bt-demo-4q-board" style="display:inline-grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:0 auto;"></div>
                        <div id="bt-demo-4q-info" style="margin-top:10px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:0.85rem;">
                            <span>놓은 퀸: <strong id="bt-demo-4q-placed">0</strong>/4</span>
                            <span>시도: <strong id="bt-demo-4q-tries">0</strong>회</span>
                            <span>되돌리기: <strong id="bt-demo-4q-backs">0</strong>회</span>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bt-demo-4q-msg">칸을 클릭해서 퀸을 놓아 보세요! 공격 범위는 빨간색으로 표시됩니다. 또는 "Step"으로 백트래킹 과정을 한 단계씩 관찰하세요.</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">4-Queen의 답은 몇 가지입니까? 8-Queen은요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        4-Queen의 답은 <strong>2가지</strong>입니다 (대칭 포함).<br>
                        8-Queen의 답은 <strong>92가지</strong>입니다!<br><br>
                        N이 커질수록 경우의 수가 폭발적으로 늘어나지만,
                        백트래킹 + 가지치기 덕분에 효율적으로 탐색할 수 있습니다.
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

        // ========== Demo 2: 3요소따라가기 ==========
        {
            var poolEl = container.querySelector('#bt-demo-3elem-pool');
            var pathEl = container.querySelector('#bt-demo-3elem-path');
            var usedEl = container.querySelector('#bt-demo-3elem-used');
            var resultsEl2 = container.querySelector('#bt-demo-3elem-results');
            var msgEl = container.querySelector('#bt-demo-3elem-msg');
            var nextBtn2 = container.querySelector('#bt-demo-3elem-next');
            var resetBtn2 = container.querySelector('#bt-demo-3elem-reset');

            if (poolEl && nextBtn2) {
                var nums = [1, 2, 3];
                var M3 = 2;
                // Pre-build all steps
                var allSteps = [];
                (function buildSteps3() {
                    var used3 = [false, false, false];
                    var path3 = [];
                    function gen(depth) {
                        for (var i = 0; i < 3; i++) {
                            // Step: try choosing nums[i]
                            if (used3[i]) {
                                allSteps.push({ type: 'skip', idx: i, path: path3.slice(), used: used3.slice(), reason: nums[i] + '은 이미 사용 중(used[' + i + ']=true)이라 건너뜁니다 — ✅ 조건 확인' });
                                continue;
                            }
                            allSteps.push({ type: 'choose', idx: i, path: path3.slice(), used: used3.slice(), reason: nums[i] + '을(를) 선택합니다 — ☝️ 선택하기' });
                            path3.push(nums[i]);
                            used3[i] = true;
                            if (depth + 1 === M3) {
                                allSteps.push({ type: 'found', idx: i, path: path3.slice(), used: used3.slice(), reason: '[' + path3.join(', ') + '] 완성!' });
                                // Undo
                                allSteps.push({ type: 'undo', idx: i, path: path3.slice(), used: used3.slice(), reason: nums[i] + '을(를) 되돌립니다 — ↩️ 되돌아가기' });
                                path3.pop();
                                used3[i] = false;
                            } else {
                                gen(depth + 1);
                                allSteps.push({ type: 'undo', idx: i, path: path3.slice(), used: used3.slice(), reason: nums[i] + '을(를) 되돌립니다 — ↩️ 되돌아가기' });
                                path3.pop();
                                used3[i] = false;
                            }
                        }
                    }
                    gen(0);
                    allSteps.push({ type: 'done', idx: -1, path: [], used: [false, false, false], reason: '모든 경우를 탐색했습니다!' });
                })();

                var stepIdx3 = -1;
                var foundResults3 = [];

                function makeBox(val, cls) {
                    return '<div style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;font-weight:700;font-size:1rem;' +
                        (cls === 'used' ? 'background:var(--accent);color:white;' :
                         cls === 'skip' ? 'background:var(--red);color:white;opacity:0.6;' :
                         cls === 'choose' ? 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);' :
                         cls === 'undo' ? 'background:var(--bg2);color:var(--text3);border:2px dashed var(--red);' :
                         'background:var(--bg2);color:var(--text);border:1px solid var(--border);') +
                        '">' + val + '</div>';
                }

                function render3(step) {
                    // Pool
                    poolEl.innerHTML = '';
                    for (var i = 0; i < 3; i++) {
                        var cls = '';
                        if (step && step.used[i]) cls = 'used';
                        if (step && step.type === 'skip' && step.idx === i) cls = 'skip';
                        if (step && step.type === 'choose' && step.idx === i) cls = 'choose';
                        if (step && step.type === 'undo' && step.idx === i) cls = 'undo';
                        poolEl.innerHTML += makeBox(nums[i], cls);
                    }
                    // Path
                    if (!step || step.path.length === 0) {
                        pathEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">비어 있음</span>';
                    } else {
                        pathEl.innerHTML = step.path.map(function(v) { return makeBox(v, 'used'); }).join('');
                    }
                    // Used
                    if (step) {
                        usedEl.innerHTML = '<span style="font-size:0.75rem;color:var(--text3);">used = [' +
                            step.used.map(function(u, i) { return '<span style="color:' + (u ? 'var(--accent);font-weight:700' : 'var(--text3)') + ';">' + (u ? 'T' : 'F') + '</span>'; }).join(', ') + ']</span>';
                    } else {
                        usedEl.innerHTML = '<span style="font-size:0.75rem;color:var(--text3);">used = [F, F, F]</span>';
                    }
                    // Results
                    resultsEl2.innerHTML = foundResults3.map(function(r) {
                        return '<span style="display:inline-block;padding:3px 10px;background:var(--green);color:white;border-radius:6px;font-size:0.82rem;font-weight:600;">[' + r.join(', ') + ']</span>';
                    }).join(' ');
                    // Msg
                    if (step) {
                        msgEl.textContent = step.reason;
                        msgEl.style.borderLeftColor = step.type === 'choose' ? 'var(--yellow)' : step.type === 'undo' ? 'var(--red)' : step.type === 'found' ? 'var(--green)' : step.type === 'skip' ? 'var(--red)' : 'var(--accent)';
                    }
                }

                render3(null);

                nextBtn2.addEventListener('click', function() {
                    if (stepIdx3 >= allSteps.length - 1) return;
                    stepIdx3++;
                    var step = allSteps[stepIdx3];
                    if (step.type === 'found') foundResults3.push(step.path.slice());
                    render3(step);
                    if (stepIdx3 >= allSteps.length - 1) {
                        nextBtn2.disabled = true;
                    }
                });

                resetBtn2.addEventListener('click', function() {
                    stepIdx3 = -1;
                    foundResults3 = [];
                    nextBtn2.disabled = false;
                    msgEl.textContent = '👆 "다음 단계"를 눌러 선택/확인/되돌리기가 어떻게 동작하는지 한 단계씩 따라가 보세요!';
                    msgEl.style.borderLeftColor = '';
                    render3(null);
                });
            }
        }

        // ========== Demo 3: 사이클(중복방지) 데모 ==========
        {
            var cycleUsedEl = container.querySelector('#bt-demo-cycle-used');
            var cyclePathEl = container.querySelector('#bt-demo-cycle-path');
            var cycleMsgEl = container.querySelector('#bt-demo-cycle-msg');
            var cycleClearBtn = container.querySelector('#bt-demo-cycle-clear');
            var cycleBtn1 = container.querySelector('#bt-demo-cycle-toggle1');
            var cycleBtn2 = container.querySelector('#bt-demo-cycle-toggle2');
            var cycleBtn3 = container.querySelector('#bt-demo-cycle-toggle3');

            if (cycleUsedEl && cycleBtn1) {
                var cycleUsed = [false, false, false];
                var cyclePath = [];

                function renderCycleDemo() {
                    cycleUsedEl.innerHTML = '';
                    for (var i = 0; i < 3; i++) {
                        cycleUsedEl.innerHTML += '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;">' +
                            '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;font-size:1rem;' +
                            (cycleUsed[i] ? 'background:var(--accent);color:white;box-shadow:0 0 8px var(--accent);' : 'background:var(--bg2);color:var(--text);border:1px solid var(--border);') +
                            '">' + (i + 1) + '</div>' +
                            '<span style="font-size:0.7rem;color:' + (cycleUsed[i] ? 'var(--accent)' : 'var(--text3)') + ';">' + (cycleUsed[i] ? 'true' : 'false') + '</span></div>';
                    }
                    cyclePathEl.textContent = cyclePath.length > 0 ? '[ ' + cyclePath.join(', ') + ' ]' : '[ ]';
                }

                function cycleSelect(idx) {
                    if (cycleUsed[idx]) {
                        cycleMsgEl.textContent = '❌ used[' + idx + '] = true → ' + (idx + 1) + '은(는) 이미 사용 중! 건너뜁니다. 이것이 중복을 막는 원리입니다.';
                        cycleMsgEl.style.borderLeftColor = 'var(--red)';
                        // Flash the box red briefly
                        var boxes = cycleUsedEl.querySelectorAll('div > div');
                        if (boxes[idx]) {
                            boxes[idx].style.background = 'var(--red)';
                            setTimeout(function() { renderCycleDemo(); }, 500);
                        }
                        return;
                    }
                    cycleUsed[idx] = true;
                    cyclePath.push(idx + 1);
                    cycleMsgEl.textContent = '✅ ' + (idx + 1) + '을(를) 선택! used[' + idx + '] = true로 설정. 경로: [' + cyclePath.join(', ') + ']';
                    cycleMsgEl.style.borderLeftColor = 'var(--green)';
                    renderCycleDemo();
                }

                renderCycleDemo();

                cycleBtn1.addEventListener('click', function() { cycleSelect(0); });
                cycleBtn2.addEventListener('click', function() { cycleSelect(1); });
                cycleBtn3.addEventListener('click', function() { cycleSelect(2); });
                cycleClearBtn.addEventListener('click', function() {
                    cycleUsed = [false, false, false];
                    cyclePath = [];
                    cycleMsgEl.textContent = '👆 숫자 버튼을 눌러 선택해 보세요! 이미 선택된 숫자를 다시 누르면 used 배열이 막아줍니다.';
                    cycleMsgEl.style.borderLeftColor = '';
                    renderCycleDemo();
                });
            }
        }

        // ========== Demo 4: 가지치기 비교 ==========
        {
            var pruneNopEl = container.querySelector('#bt-demo-prune-nop');
            var pruneYesEl = container.querySelector('#bt-demo-prune-yes');
            var pruneNopCount = container.querySelector('#bt-demo-prune-nop-count');
            var pruneYesCount = container.querySelector('#bt-demo-prune-yes-count');
            var pruneRunBtn = container.querySelector('#bt-demo-prune-run');
            var pruneResetBtn = container.querySelector('#bt-demo-prune-reset');
            var pruneMsgEl = container.querySelector('#bt-demo-prune-msg');

            if (pruneNopEl && pruneRunBtn) {
                var pruneAnimating = false;

                pruneRunBtn.addEventListener('click', function() {
                    if (pruneAnimating) return;
                    pruneAnimating = true;
                    pruneRunBtn.disabled = true;
                    pruneNopEl.innerHTML = '';
                    pruneYesEl.innerHTML = '';

                    // Build all traces without pruning
                    var nopTraces = [];
                    for (var i = 1; i <= 3; i++) {
                        for (var j = 1; j <= 3; j++) {
                            var ok = i !== j;
                            nopTraces.push({ text: i + ' → ' + j, ok: ok, reason: ok ? '✓ 유효' : '✕ 중복' });
                        }
                    }
                    // Build all traces with pruning
                    var yesTraces = [];
                    for (var i = 1; i <= 3; i++) {
                        for (var j = 1; j <= 3; j++) {
                            if (i === j) {
                                yesTraces.push({ text: i + ' → ' + j, ok: false, skip: true, reason: '✂️ 건너뜀' });
                            } else {
                                yesTraces.push({ text: i + ' → ' + j, ok: true, skip: false, reason: '✓ 유효' });
                            }
                        }
                    }

                    var maxLen = Math.max(nopTraces.length, yesTraces.length);
                    var nopCount = 0, yesCount = 0;
                    var idx = 0;

                    function animStep() {
                        if (idx >= maxLen) {
                            pruneMsgEl.textContent = '완료! 가지치기 없으면 ' + nopCount + '회, 가지치기 적용하면 ' + yesCount + '회만 탐색합니다. 차이: ' + (nopCount - yesCount) + '회 절약!';
                            pruneMsgEl.style.borderLeftColor = 'var(--green)';
                            pruneAnimating = false;
                            return;
                        }
                        if (idx < nopTraces.length) {
                            var t = nopTraces[idx];
                            nopCount++;
                            var div = document.createElement('div');
                            div.textContent = t.text + ' ' + t.reason;
                            div.style.cssText = 'padding:2px 6px;border-radius:4px;' + (t.ok ? 'color:var(--green);' : 'color:var(--red);');
                            pruneNopEl.appendChild(div);
                            pruneNopCount.textContent = '탐색: ' + nopCount + '회';
                        }
                        if (idx < yesTraces.length) {
                            var t2 = yesTraces[idx];
                            var div2 = document.createElement('div');
                            if (t2.skip) {
                                div2.textContent = t2.text + ' ' + t2.reason;
                                div2.style.cssText = 'padding:2px 6px;border-radius:4px;color:var(--text3);text-decoration:line-through;opacity:0.5;';
                            } else {
                                yesCount++;
                                div2.textContent = t2.text + ' ' + t2.reason;
                                div2.style.cssText = 'padding:2px 6px;border-radius:4px;color:var(--green);';
                            }
                            pruneYesEl.appendChild(div2);
                            pruneYesCount.textContent = '탐색: ' + yesCount + '회';
                        }
                        idx++;
                        setTimeout(animStep, 300);
                    }
                    animStep();
                });

                pruneResetBtn.addEventListener('click', function() {
                    pruneAnimating = false;
                    pruneRunBtn.disabled = false;
                    pruneNopEl.innerHTML = '';
                    pruneYesEl.innerHTML = '';
                    pruneNopCount.textContent = '탐색: 0회';
                    pruneYesCount.textContent = '탐색: 0회';
                    pruneMsgEl.textContent = '👆 "탐색 시작"을 눌러 가지치기 유무에 따른 탐색 차이를 비교해 보세요!';
                    pruneMsgEl.style.borderLeftColor = '';
                });
            }
        }

        // ========== Demo 5: 실행비교 (N,M 바꾸기) ==========
        {
            var execRunBtn = container.querySelector('#bt-demo-exec-run');
            var execNInput = container.querySelector('#bt-demo-exec-n');
            var execMInput = container.querySelector('#bt-demo-exec-m');
            var execBarBrute = container.querySelector('#bt-demo-exec-bar-brute');
            var execBarBt = container.querySelector('#bt-demo-exec-bar-bt');
            var execValBrute = container.querySelector('#bt-demo-exec-val-brute');
            var execValBt = container.querySelector('#bt-demo-exec-val-bt');
            var execSaved = container.querySelector('#bt-demo-exec-saved');
            var execMsgEl = container.querySelector('#bt-demo-exec-msg');

            if (execRunBtn && execNInput) {
                execRunBtn.addEventListener('click', function() {
                    var N = parseInt(execNInput.value) || 4;
                    var M = parseInt(execMInput.value) || 2;
                    if (N < 2) N = 2; if (N > 8) N = 8;
                    if (M < 1) M = 1; if (M > N) M = N; if (M > 6) M = 6;
                    execNInput.value = N;
                    execMInput.value = M;

                    // Brute force: N^M (all combinations including duplicates)
                    var bruteCount = Math.pow(N, M);

                    // Backtracking: P(N, M) = N! / (N-M)! (permutations without repetition)
                    var btCount = 1;
                    for (var i = 0; i < M; i++) btCount *= (N - i);

                    var maxVal = Math.max(bruteCount, btCount);
                    var maxH = 160;

                    // Animate bars
                    execBarBrute.style.height = Math.max(10, Math.round(bruteCount / maxVal * maxH)) + 'px';
                    execBarBt.style.height = Math.max(10, Math.round(btCount / maxVal * maxH)) + 'px';
                    execValBrute.textContent = bruteCount.toLocaleString();
                    execValBt.textContent = btCount.toLocaleString();

                    var saved = bruteCount - btCount;
                    var pct = bruteCount > 0 ? Math.round(saved / bruteCount * 100) : 0;
                    execSaved.textContent = saved > 0 ? (saved.toLocaleString() + '회 절약 (' + pct + '%)') : '동일';

                    execMsgEl.textContent = 'N=' + N + ', M=' + M + ' → 완전탐색: ' + bruteCount.toLocaleString() + '회, 백트래킹: ' + btCount.toLocaleString() + '회. ' + (saved > 0 ? pct + '%를 절약합니다!' : '');
                    execMsgEl.style.borderLeftColor = 'var(--accent)';
                });
            }
        }

        // ========== Demo 6: 4-Queen ==========
        {
            var boardEl = container.querySelector('#bt-demo-4q-board');
            var autoBtn = container.querySelector('#bt-demo-4q-auto');
            var clearBtn4q = container.querySelector('#bt-demo-4q-clear');
            var placedEl = container.querySelector('#bt-demo-4q-placed');
            var triesEl = container.querySelector('#bt-demo-4q-tries');
            var backsEl = container.querySelector('#bt-demo-4q-backs');
            var msgEl4q = container.querySelector('#bt-demo-4q-msg');

            if (boardEl && autoBtn) {
                var N4 = 4;
                var queens = []; // [{r,c}]
                var tries4q = 0, backs4q = 0;
                var autoRunning = false;

                function isSafe(r, c, qs) {
                    for (var k = 0; k < qs.length; k++) {
                        var q = qs[k];
                        if (q.c === c) return false;
                        if (Math.abs(q.r - r) === Math.abs(q.c - c)) return false;
                    }
                    return true;
                }

                function getAttacked(qs) {
                    var set = {};
                    for (var k = 0; k < qs.length; k++) {
                        var q = qs[k];
                        for (var i = 0; i < N4; i++) {
                            for (var j = 0; j < N4; j++) {
                                if (i === q.r && j === q.c) continue;
                                if (i === q.r || j === q.c || Math.abs(i - q.r) === Math.abs(j - q.c)) {
                                    set[i + ',' + j] = true;
                                }
                            }
                        }
                    }
                    return set;
                }

                function renderBoard(highlight) {
                    boardEl.innerHTML = '';
                    boardEl.style.cssText = 'display:inline-grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:0 auto;';
                    var attacked = getAttacked(queens);
                    for (var r = 0; r < N4; r++) {
                        for (var c = 0; c < N4; c++) {
                            var cell = document.createElement('div');
                            var isQueen = queens.some(function(q) { return q.r === r && q.c === c; });
                            var isAttacked = attacked[r + ',' + c];
                            var isHighlight = highlight && highlight.r === r && highlight.c === c;
                            cell.style.cssText = 'width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:1.4rem;cursor:pointer;transition:all 0.2s;border:2px solid transparent;' +
                                ((r + c) % 2 === 0 ? 'background:var(--bg2);' : 'background:var(--bg3,var(--border));') +
                                (isQueen ? 'background:var(--accent);border-color:var(--accent);box-shadow:0 0 10px var(--accent);' : '') +
                                (isAttacked && !isQueen ? 'background:rgba(231,76,60,0.15);border-color:rgba(231,76,60,0.3);' : '') +
                                (isHighlight ? 'background:var(--yellow);border-color:var(--yellow);box-shadow:0 0 12px var(--yellow);' : '');
                            cell.textContent = isQueen ? '♛' : '';
                            cell.dataset.r = r;
                            cell.dataset.c = c;
                            if (!autoRunning) {
                                (function(rr, cc) {
                                    cell.addEventListener('click', function() {
                                        handleCellClick(rr, cc);
                                    });
                                })(r, c);
                            }
                            boardEl.appendChild(cell);
                        }
                    }
                    placedEl.textContent = queens.length;
                    triesEl.textContent = tries4q;
                    backsEl.textContent = backs4q;
                }

                function handleCellClick(r, c) {
                    if (autoRunning) return;
                    // If queen already there, remove it
                    var existIdx = -1;
                    for (var k = 0; k < queens.length; k++) {
                        if (queens[k].r === r && queens[k].c === c) { existIdx = k; break; }
                    }
                    if (existIdx >= 0) {
                        queens.splice(existIdx, 1);
                        msgEl4q.textContent = '♛ (' + r + ',' + c + ') 퀸을 제거했습니다.';
                        renderBoard(null);
                        return;
                    }
                    // Check row already has queen
                    for (var k = 0; k < queens.length; k++) {
                        if (queens[k].r === r) {
                            msgEl4q.textContent = '❌ 행 ' + r + '에 이미 퀸이 있습니다! 같은 행에는 하나만 놓을 수 있어요.';
                            msgEl4q.style.borderLeftColor = 'var(--red)';
                            return;
                        }
                    }
                    tries4q++;
                    if (!isSafe(r, c, queens)) {
                        msgEl4q.textContent = '❌ (' + r + ',' + c + ')은 다른 퀸의 공격 범위입니다! 같은 열이나 대각선을 확인하세요.';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard({ r: r, c: c });
                        setTimeout(function() { renderBoard(null); }, 600);
                        return;
                    }
                    queens.push({ r: r, c: c });
                    if (queens.length === N4) {
                        msgEl4q.textContent = '🎉 성공! 4개의 퀸을 모두 안전하게 놓았습니다!';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                    } else {
                        msgEl4q.textContent = '✅ (' + r + ',' + c + ')에 퀸을 놓았습니다. 빨간 영역은 공격 범위입니다. (' + queens.length + '/4)';
                        msgEl4q.style.borderLeftColor = 'var(--accent)';
                    }
                    renderBoard(null);
                }

                // Step-by-step solve with backtracking
                var solveState = { steps: null, stepIdx: -1 };

                function buildSolveSteps() {
                    var steps = [];
                    function solve4(row, qs) {
                        if (row === N4) {
                            steps.push({ type: 'done', queens: qs.slice() });
                            return true;
                        }
                        for (var c = 0; c < N4; c++) {
                            steps.push({ type: 'try', r: row, c: c, queens: qs.slice() });
                            if (isSafe(row, c, qs)) {
                                qs.push({ r: row, c: c });
                                steps.push({ type: 'place', r: row, c: c, queens: qs.slice() });
                                if (solve4(row + 1, qs)) return true;
                                qs.pop();
                                steps.push({ type: 'back', r: row, c: c, queens: qs.slice() });
                            } else {
                                steps.push({ type: 'fail', r: row, c: c, queens: qs.slice() });
                            }
                        }
                        return false;
                    }
                    solve4(0, []);
                    return steps;
                }

                function applyStep(s) {
                    queens = s.queens.slice();
                    if (s.type === 'try') {
                        tries4q++;
                        msgEl4q.textContent = '행 ' + s.r + ', 열 ' + s.c + ' 시도 중...';
                        msgEl4q.style.borderLeftColor = 'var(--yellow)';
                        renderBoard({ r: s.r, c: s.c });
                    } else if (s.type === 'place') {
                        msgEl4q.textContent = '(' + s.r + ',' + s.c + ')에 퀸 배치! (' + queens.length + '/4)';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                        renderBoard(null);
                    } else if (s.type === 'fail') {
                        msgEl4q.textContent = '(' + s.r + ',' + s.c + ') 공격 범위 -- 건너뜁니다';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard({ r: s.r, c: s.c });
                    } else if (s.type === 'back') {
                        backs4q++;
                        msgEl4q.textContent = '(' + s.r + ',' + s.c + ') 되돌리기! 다른 열을 시도합니다';
                        msgEl4q.style.borderLeftColor = 'var(--red)';
                        renderBoard(null);
                    } else if (s.type === 'done') {
                        msgEl4q.textContent = '해결! 시도 ' + tries4q + '회, 되돌리기 ' + backs4q + '회. 백트래킹 덕분에 효율적으로 찾았습니다!';
                        msgEl4q.style.borderLeftColor = 'var(--green)';
                        renderBoard(null);
                    }
                }

                autoBtn.addEventListener('click', function() {
                    // First click: build steps and enter step mode
                    if (!solveState.steps) {
                        autoRunning = true;
                        queens = [];
                        tries4q = 0;
                        backs4q = 0;
                        renderBoard(null);
                        solveState.steps = buildSolveSteps();
                        solveState.stepIdx = -1;
                    }
                    // Advance one step
                    solveState.stepIdx++;
                    if (solveState.stepIdx >= solveState.steps.length) {
                        // Already finished, do nothing
                        solveState.stepIdx = solveState.steps.length - 1;
                        return;
                    }
                    applyStep(solveState.steps[solveState.stepIdx]);
                    // If done, allow reset
                    if (solveState.stepIdx >= solveState.steps.length - 1) {
                        autoRunning = false;
                    }
                });

                clearBtn4q.addEventListener('click', function() {
                    autoRunning = false;
                    solveState.steps = null;
                    solveState.stepIdx = -1;
                    queens = [];
                    tries4q = 0;
                    backs4q = 0;
                    msgEl4q.textContent = '칸을 클릭해서 퀸을 놓아 보세요! 공격 범위는 빨간색으로 표시됩니다. 또는 "Step"으로 백트래킹 과정을 한 단계씩 관찰하세요.';
                    msgEl4q.style.borderLeftColor = '';
                    renderBoard(null);
                });

                renderBoard(null);
            }
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
            self._createStepDesc(suffix) +
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
    // 결정 트리 공통 렌더링 헬퍼
    // ====================================================================
    _layoutTree(nodes) {
        // 각 노드에 x, y 좌표를 할당 (리프 기준 bottom-up 배치)
        var nodeW = 42, nodeH = 42, gapX = 6, gapY = 56;
        // depth별 그룹
        var maxDepth = 0;
        for (var i = 0; i < nodes.length; i++) if (nodes[i].depth > maxDepth) maxDepth = nodes[i].depth;
        var byId = {};
        for (var i = 0; i < nodes.length; i++) byId[nodes[i].id] = nodes[i];
        // 리프 먼저 왼쪽부터 배치, 부모는 자식 중앙
        var leafX = 0;
        function layout(nid) {
            var n = byId[nid];
            if (!n.children || n.children.length === 0) {
                n.x = leafX; leafX += nodeW + gapX;
                n.y = n.depth * gapY;
                return;
            }
            for (var c = 0; c < n.children.length; c++) layout(n.children[c]);
            var first = byId[n.children[0]], last = byId[n.children[n.children.length - 1]];
            n.x = (first.x + last.x) / 2;
            n.y = n.depth * gapY;
        }
        layout(nodes[0].id);
        var totalW = leafX - gapX + nodeW;
        var totalH = (maxDepth + 1) * gapY + nodeH;
        return { totalW: totalW, totalH: totalH, nodeW: nodeW, nodeH: nodeH };
    },

    _renderTree(container, nodes, suffix) {
        var byId = {};
        for (var i = 0; i < nodes.length; i++) byId[nodes[i].id] = nodes[i];
        var dims = this._layoutTree(nodes);
        var treeEl = container.querySelector('#sim-tree' + suffix);
        if (!treeEl) return;
        treeEl.innerHTML = '';
        treeEl.style.width = dims.totalW + 'px';
        treeEl.style.height = dims.totalH + 'px';
        treeEl.style.minWidth = dims.totalW + 'px';
        // SVG 엣지
        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'sim-tree-edges');
        svg.setAttribute('width', dims.totalW);
        svg.setAttribute('height', dims.totalH);
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.parentId !== null) {
                var p = byId[n.parentId];
                var line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', p.x + dims.nodeW / 2);
                line.setAttribute('y1', p.y + dims.nodeH);
                line.setAttribute('x2', n.x + dims.nodeW / 2);
                line.setAttribute('y2', n.y);
                line.id = 'edge' + suffix + '-' + n.id;
                treeEl.appendChild(line);
            }
        }
        treeEl.appendChild(svg);
        // 엣지를 svg 안에 넣어야 하지만, 위에서 treeEl에 직접 넣었으므로 svg 안으로 이동
        // 다시 작성: svg 안에 line 넣기
        treeEl.innerHTML = '';
        svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'sim-tree-edges');
        svg.setAttribute('width', dims.totalW);
        svg.setAttribute('height', dims.totalH);
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.parentId !== null) {
                var p = byId[n.parentId];
                var line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', p.x + dims.nodeW / 2);
                line.setAttribute('y1', p.y + dims.nodeH);
                line.setAttribute('x2', n.x + dims.nodeW / 2);
                line.setAttribute('y2', n.y);
                line.id = 'edge' + suffix + '-' + n.id;
                svg.appendChild(line);
            }
        }
        treeEl.appendChild(svg);
        // 노드 div
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var div = document.createElement('div');
            div.className = 'sim-tree-node node-hidden';
            if (n.isRoot) div.className += ' node-root';
            if (n.isLeaf) div.className += ' node-leaf';
            div.id = 'tnode' + suffix + '-' + n.id;
            div.style.left = n.x + 'px';
            div.style.top = n.y + 'px';
            div.textContent = n.label;
            treeEl.appendChild(div);
        }
    },

    _setNodeState(container, suffix, nodeId, state) {
        var el = container.querySelector('#tnode' + suffix + '-' + nodeId);
        if (!el) return;
        el.className = el.className.replace(/node-hidden|node-current|node-visited|node-complete|node-backtracked|node-pruned/g, '').trim();
        if (state) el.className += ' ' + state;
    },

    _setEdgeState(container, suffix, nodeId, state) {
        var el = container.querySelector('#edge' + suffix + '-' + nodeId);
        if (!el) return;
        el.className.baseVal = (el.className.baseVal || '').replace(/edge-active|edge-complete|edge-backtracked/g, '').trim();
        if (state) el.className.baseVal += ' ' + state;
    },

    // 트리의 노드/엣지 상태를 스냅샷으로 저장/복원
    _applyTreeSnapshot(container, suffix, snapshot) {
        for (var id in snapshot) {
            this._setNodeState(container, suffix, id, snapshot[id].node);
            if (snapshot[id].edge) this._setEdgeState(container, suffix, id, snapshot[id].edge);
        }
    },

    // ====================================================================
    // 공통: NM 계열 결정 트리 시뮬레이션 빌더
    // ====================================================================
    _buildNMTreeViz(contentEl, opts) {
        // opts: { suffix, title, desc(N,M), defaultN, defaultM, maxN, maxM,
        //         solverFactory(N,M) => { solve(), getNodes(), getSteps(), getFound() },
        //         resultLabel, emptyLabel }
        var self = this;
        var suffix = opts.suffix;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">' + opts.title + '</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt' + suffix + '-n" value="' + opts.defaultN + '" min="1" max="' + opts.maxN + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="bt' + suffix + '-m" value="' + opts.defaultM + '" min="1" max="' + opts.maxM + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt' + suffix + '-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="sim-card" style="padding:1.5rem;margin-bottom:12px;">' +
            '<div class="sim-tree-wrapper"><div id="sim-tree' + suffix + '" style="position:relative;"></div></div>' +
            '<div id="nm-path' + suffix + '" class="sim-tree-path-display">path = [ ]</div>' +
            '</div>' +
            '<div id="nm-results' + suffix + '" class="sim-tree-results"><span style="color:var(--text3);">' + opts.emptyLabel + '</span></div>' +
            self._createStepControls(suffix);
        var pathEl = contentEl.querySelector('#nm-path' + suffix);
        var resultsEl = contentEl.querySelector('#nm-results' + suffix);
        var inputN = contentEl.querySelector('#bt' + suffix + '-n');
        var inputM = contentEl.querySelector('#bt' + suffix + '-m');
        var resetBtn = contentEl.querySelector('#bt' + suffix + '-reset');

        function buildAndRun(N, M) {
            pathEl.textContent = 'path = [ ]'; pathEl.style.color = '';
            resultsEl.innerHTML = '<span style="color:var(--text3);">' + opts.emptyLabel + '</span>';
            var solver = opts.solverFactory(N, M);
            solver.solve();
            var nodes = solver.getNodes();
            var steps = solver.getSteps();
            var found = solver.getFound();
            self._renderTree(contentEl, nodes, suffix);
            // root 노드는 처음부터 보이게
            self._setNodeState(contentEl, suffix, nodes[0].id, 'node-root');
            self._initStepController(contentEl, steps, suffix);
        }

        resetBtn.addEventListener('click', function() {
            var N = Math.max(1, Math.min(opts.maxN, parseInt(inputN.value) || opts.defaultN));
            var M = Math.max(1, Math.min(opts.maxM < 0 ? N : opts.maxM, parseInt(inputM.value) || opts.defaultM));
            if (M > N) M = N;
            inputN.value = N; inputM.value = M;
            self._clearVizState();
            buildAndRun(N, M);
        });
        buildAndRun(opts.defaultN, opts.defaultM);
    },

    // ====================================================================
    // 시뮬레이션 1: N과 M (1) — 순열 (boj-15649)
    // ====================================================================
    _renderVizNM1(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm1',
            title: 'N과 M (1) — 순열 생성',
            defaultN: 4, defaultM: 2, maxN: 6, maxM: -1,
            emptyLabel: '수열이 여기에 표시됩니다',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], used = [], found = [];
                for (var i = 0; i <= N; i++) used.push(false);
                var pathEl, resultsEl, sfx = '-nm1';

                function solve(depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        var leafLabel = '[' + snap.join(',') + ']';
                        nodes.push({ id: leafNid, label: leafLabel, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            // 이전 스냅샷: 이 리프 표시 전 상태
                            steps.push({
                                description: '수열 [' + s.join(', ') + '] 완성! (' + r + '번째) — M개를 모두 골랐으므로 결과에 추가합니다',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓';
                                    pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">수열이 여기에 표시됩니다</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = 1; i <= N; i++) {
                        if (used[i]) {
                            // 가지치기: 노드를 pruned로 잠깐 보여줌
                            var prunedNid = nodeId++;
                            nodes.push({ id: prunedNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                            nodes[parentNid].children.push(prunedNid);
                            (function(ci, sp, pid) {
                                steps.push({
                                    description: ci + '는 이미 사용 중 → 건너뜀 (가지치기). 왜? 중복 없는 순열이므로 같은 수를 다시 쓸 수 없습니다',
                                    action: function() {
                                        pathEl = contentEl.querySelector('#nm-path' + sfx);
                                        self._setNodeState(contentEl, sfx, pid, 'node-pruned');
                                        self._setEdgeState(contentEl, sfx, pid, 'edge-backtracked');
                                        pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ' : '') + ci + '? ]';
                                        pathEl.style.color = 'var(--red)';
                                    },
                                    undo: function() {
                                        pathEl = contentEl.querySelector('#nm-path' + sfx);
                                        self._setNodeState(contentEl, sfx, pid, 'node-hidden');
                                        self._setEdgeState(contentEl, sfx, pid, '');
                                        pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]';
                                        pathEl.style.color = '';
                                    }
                                });
                            })(i, path.slice(), prunedNid);
                            continue;
                        }
                        // 선택
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        used[i] = true; path.push(i);
                        (function(ci, sp, nid) {
                            steps.push({
                                description: ci + '를 선택 → path = [' + sp.join(', ') + ']. 왜? 아직 사용하지 않은 수이므로 선택 가능합니다',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ]';
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                        solve(depth + 1, choiceNid);
                        path.pop(); used[i] = false;
                        (function(ci, sp, nid) {
                            steps.push({
                                description: ci + '를 되돌림. 왜? 이 가지의 탐색이 끝났으므로 다른 선택을 시도합니다',
                                action: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                    }
                }
                return {
                    solve: function() { solve(0, 0); steps.push({ description: '탐색 완료! 총 ' + found.length + '개의 순열', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // 시뮬레이션 2: N과 M (2) — 조합 (boj-15650)
    // ====================================================================
    _renderVizNM2(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm2',
            title: 'N과 M (2) — 조합 생성',
            defaultN: 4, defaultM: 2, maxN: 6, maxM: -1,
            emptyLabel: '조합이 여기에 표시됩니다',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm2';

                function solve(start, depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: '조합 [' + s.join(', ') + '] 완성! (' + r + '번째) — M개를 모두 골랐으므로 결과에 추가합니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓';
                                    pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]';
                                    pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">조합이 여기에 표시됩니다</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = start; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: ci + '를 선택 (start=' + st + ') → path = [' + sp.join(', ') + ']. 왜? start=' + st + '부터 고르므로 오름차순이 보장됩니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ], start = ' + (ci + 1);
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + st;
                                    pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                        solve(i + 1, depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: ci + '를 되돌림. 왜? 이 가지의 탐색이 끝났으므로 다음 수를 시도합니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ], start = ' + st;
                                    pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ], start = ' + (ci + 1);
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                    }
                }
                return {
                    solve: function() { solve(1, 0, 0); steps.push({ description: '탐색 완료! 총 ' + found.length + '개의 조합', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // 시뮬레이션 3: N과 M (3) — 중복 순열 (boj-15651)
    // ====================================================================
    _renderVizNM3(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm3',
            title: 'N과 M (3) — 중복 순열',
            defaultN: 3, defaultM: 2, maxN: 4, maxM: 3,
            emptyLabel: '중복 순열이 여기에 표시됩니다',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm3';

                function solve(depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: '[' + s.join(', ') + '] 완성! (' + r + '번째) — 중복 허용이라 같은 수가 여러 번 나올 수 있습니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">중복 순열이 여기에 표시됩니다</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = 1; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid) {
                            steps.push({
                                description: ci + '를 선택 → path = [' + sp.join(', ') + ']. 왜? used 체크가 없으므로 모든 수를 매번 선택 가능합니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ]'; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                        solve(depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid) {
                            steps.push({
                                description: ci + '를 되돌림. 왜? 다음 수를 시도하기 위해 현재 선택을 취소합니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ]'; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ]';
                                }
                            });
                        })(i, path.slice(), choiceNid);
                    }
                }
                return {
                    solve: function() { solve(0, 0); steps.push({ description: '탐색 완료! 총 ' + found.length + '개 (N^M = ' + N + '^' + M + ' = ' + Math.pow(N, M) + ')', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // 시뮬레이션 4: N과 M (4) — 중복 조합 (boj-15652)
    // ====================================================================
    _renderVizNM4(contentEl) {
        var self = this;
        self._buildNMTreeViz(contentEl, {
            suffix: '-nm4',
            title: 'N과 M (4) — 중복 조합',
            defaultN: 3, defaultM: 2, maxN: 4, maxM: 3,
            emptyLabel: '중복 조합이 여기에 표시됩니다',
            solverFactory: function(N, M) {
                var nodes = [{ id: 0, label: 'root', depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
                var nodeId = 1;
                var steps = [], path = [], found = [];
                var sfx = '-nm4';

                function solve(start, depth, parentNid) {
                    if (depth === M) {
                        var snap = path.slice(); found.push(snap); var rc = found.length;
                        var leafNid = nodeId++;
                        nodes.push({ id: leafNid, label: '[' + snap.join(',') + ']', depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                        nodes[parentNid].children.push(leafNid);
                        (function(s, r, lid) {
                            steps.push({
                                description: '[' + s.join(', ') + '] 완성! (' + r + '번째) — 비내림차순 + 중복 허용 조합입니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-complete');
                                    self._setEdgeState(contentEl, sfx, lid, 'edge-complete');
                                    pathEl.textContent = 'path = [ ' + s.join(', ') + ' ] ✓'; pathEl.style.color = 'var(--green)';
                                    resultsEl.innerHTML = found.slice(0, r).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ');
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    var resultsEl = contentEl.querySelector('#nm-results' + sfx);
                                    self._setNodeState(contentEl, sfx, lid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, lid, '');
                                    var prev = s.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + s[s.length - 1]; pathEl.style.color = '';
                                    resultsEl.innerHTML = r > 1 ? found.slice(0, r - 1).map(function(x) { return '<span class="bt-result-tag">[' + x.join(', ') + ']</span>'; }).join(' ') : '<span style="color:var(--text3);">중복 조합이 여기에 표시됩니다</span>';
                                }
                            });
                        })(snap, rc, leafNid);
                        return;
                    }
                    for (var i = start; i <= N; i++) {
                        var choiceNid = nodeId++;
                        nodes.push({ id: choiceNid, label: '' + i, depth: depth, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        nodes[parentNid].children.push(choiceNid);
                        path.push(i);
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: ci + '를 선택 (start=' + st + ') → path = [' + sp.join(', ') + ']. 왜? 다음 재귀에서 start를 ' + ci + '로 넘기면 비내림차순이 보장됩니다 (i+1이 아닌 i!)',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    pathEl.textContent = 'path = [ ' + sp.join(', ') + (sp.length < M ? ', ___' : '') + ' ], start = ' + ci; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, sfx, nid, '');
                                    var prev = sp.slice(0, -1);
                                    pathEl.textContent = 'path = [ ' + (prev.length > 0 ? prev.join(', ') + ', ___' : '___') + ' ], start = ' + st; pathEl.style.color = '';
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                        solve(i, depth + 1, choiceNid);
                        path.pop();
                        (function(ci, sp, nid, st) {
                            steps.push({
                                description: ci + '를 되돌림. 왜? 이 가지 탐색이 끝났으므로 다음 수를 시도합니다',
                                action: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-backtracked');
                                    pathEl.textContent = 'path = [ ' + (sp.length > 0 ? sp.join(', ') + ', ___' : '___') + ' ], start = ' + st; pathEl.style.color = '';
                                },
                                undo: function() {
                                    var pathEl = contentEl.querySelector('#nm-path' + sfx);
                                    self._setNodeState(contentEl, sfx, nid, 'node-current');
                                    self._setEdgeState(contentEl, sfx, nid, 'edge-active');
                                    var restored = sp.slice(); restored.push(ci);
                                    pathEl.textContent = 'path = [ ' + restored.join(', ') + (restored.length < M ? ', ___' : '') + ' ], start = ' + ci;
                                }
                            });
                        })(i, path.slice(), choiceNid, start);
                    }
                }
                return {
                    solve: function() { solve(1, 0, 0); steps.push({ description: '탐색 완료! 총 ' + found.length + '개의 중복 조합', action: function() {}, undo: function() {} }); },
                    getNodes: function() { return nodes; },
                    getSteps: function() { return steps; },
                    getFound: function() { return found; }
                };
            }
        });
    },

    // ====================================================================
    // 시뮬레이션 5: 연산자 끼워넣기 (boj-14888)
    // ====================================================================
    _renderVizOperator(contentEl) {
        var self = this, suffix = '-op';
        var defaultNums = [1, 2, 3], defaultOps = [1, 1, 0, 0];
        var opSyms = ['+', '-', '*', '/'];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">연산자 끼워넣기</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">숫자: <input type="text" id="bt-op-nums" value="' + defaultNums.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:120px;" placeholder="1,2,3"></label>' +
            '<label style="font-weight:600;">연산자(+,-,*,/): <input type="text" id="bt-op-ops" value="' + defaultOps.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;" placeholder="1,1,0,0"></label>' +
            '<button class="btn btn-primary" id="bt-op-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div class="sim-card" style="padding:1.5rem;margin-bottom:12px;">' +
            '<div class="sim-tree-wrapper"><div id="sim-tree' + suffix + '" style="position:relative;"></div></div>' +
            '<div id="op-expr' + suffix + '" style="text-align:center;font-size:1.1rem;font-weight:600;margin-bottom:4px;"></div>' +
            '<div id="op-ops' + suffix + '" style="text-align:center;margin-bottom:4px;font-size:0.85rem;"></div>' +
            '</div>' +
            '<div id="op-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = contentEl.querySelector('#op-expr' + suffix);
        var opsEl = contentEl.querySelector('#op-ops' + suffix);
        var infoEl = contentEl.querySelector('#op-info' + suffix);
        var inputNums = contentEl.querySelector('#bt-op-nums');
        var inputOps = contentEl.querySelector('#bt-op-ops');
        var resetBtn = contentEl.querySelector('#bt-op-reset');

        function buildAndRun(nums, ops) {
            var initExpr = nums.join(' ☐ ');
            exprEl.textContent = initExpr; exprEl.style.color = '';
            function renderOps(o) { opsEl.innerHTML = '남은 연산자: + ' + o[0] + '개, - ' + o[1] + '개, * ' + o[2] + '개, / ' + o[3] + '개'; }
            renderOps(ops);
            infoEl.innerHTML = '<span style="color:var(--text2);">최댓값과 최솟값을 찾습니다</span>';

            var treeNodes = [{ id: 0, label: '' + nums[0], depth: 0, parentId: null, children: [], isRoot: true, isLeaf: false }];
            var nodeId = 1;
            var steps = [], results = [], maxV = -Infinity, minV = Infinity;
            var curOps = ops.slice();

            var solve = function(idx, current, expr, parentNid) {
                if (idx === nums.length) {
                    results.push({ expr: expr, val: current });
                    if (current > maxV) maxV = current;
                    if (current < minV) minV = current;
                    var rc = results.length, cm = maxV, cn = minV, ce = expr, cv = current;
                    // 리프 노드: 결과값
                    var leafNid = nodeId++;
                    treeNodes.push({ id: leafNid, label: '=' + cv, depth: idx - 1, parentId: parentNid, children: [], isRoot: false, isLeaf: true });
                    treeNodes[parentNid].children.push(leafNid);
                    (function(rc, cm, cn, ce, cv, lid) {
                        steps.push({
                            description: ce + ' = ' + cv + ' (현재 max=' + cm + ', min=' + cn + '). 왜? 모든 연산자를 배치한 하나의 완성된 식입니다',
                            action: function() {
                                self._setNodeState(contentEl, suffix, lid, 'node-complete');
                                self._setEdgeState(contentEl, suffix, lid, 'edge-complete');
                                exprEl.textContent = ce + ' = ' + cv; exprEl.style.color = 'var(--green)';
                                infoEl.innerHTML = '결과 ' + rc + '개 | <strong>max = ' + cm + '</strong>, <strong>min = ' + cn + '</strong>';
                            },
                            undo: function() {
                                self._setNodeState(contentEl, suffix, lid, 'node-hidden');
                                self._setEdgeState(contentEl, suffix, lid, '');
                                exprEl.textContent = initExpr; exprEl.style.color = '';
                                infoEl.innerHTML = rc > 1 ? '결과 ' + (rc - 1) + '개' : '<span style="color:var(--text2);">최댓값과 최솟값을 찾습니다</span>';
                            }
                        });
                    })(rc, cm, cn, ce, cv, leafNid);
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
                        var choiceNid = nodeId++;
                        treeNodes.push({ id: choiceNid, label: opSyms[i] + nums[idx], depth: idx - 1, parentId: parentNid, children: [], isRoot: false, isLeaf: false });
                        treeNodes[parentNid].children.push(choiceNid);
                        (function(ci, ne, so, prevExpr, nid) {
                            steps.push({
                                description: opSyms[ci] + ' ' + nums[idx] + ' 시도 → ' + ne + '. 왜? 남은 ' + opSyms[ci] + ' 연산자가 있으므로 이 배치를 시도합니다',
                                action: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-current');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-active');
                                    exprEl.textContent = ne + (idx < nums.length - 1 ? ' ☐ ...' : ''); exprEl.style.color = '';
                                    renderOps(so);
                                },
                                undo: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-hidden');
                                    self._setEdgeState(contentEl, suffix, nid, '');
                                    var po = so.slice(); po[ci]++;
                                    exprEl.textContent = prevExpr + (idx > 1 ? ' ☐ ...' : ' ☐ ...'); renderOps(po);
                                }
                            });
                        })(i, newExpr, snapOps, expr, choiceNid);
                        solve(idx + 1, nxt, newExpr, choiceNid);
                        curOps[i]++;
                        // 되돌림은 연산자 시뮬에서는 별도 스텝 불필요 (다음 선택이 바로 이어지므로)
                        // 하지만 트리에서 backtrack 표시
                        (function(nid, so) {
                            steps.push({
                                description: '되돌림. 왜? 이 연산자 배치의 탐색이 끝났으므로 다른 연산자를 시도합니다',
                                action: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-backtracked');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-backtracked');
                                    renderOps(so);
                                },
                                undo: function() {
                                    self._setNodeState(contentEl, suffix, nid, 'node-current');
                                    self._setEdgeState(contentEl, suffix, nid, 'edge-active');
                                }
                            });
                        })(choiceNid, curOps.slice());
                    }
                }
            };
            solve(1, nums[0], '' + nums[0], 0);
            var fm = maxV, fn = minV;
            steps.push({
                description: '완료! 최댓값 = ' + fm + ', 최솟값 = ' + fn,
                action: function() { exprEl.textContent = 'max = ' + fm + ', min = ' + fn; exprEl.style.color = 'var(--green)'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">최댓값 = ' + fm + ', 최솟값 = ' + fn + '</strong>'; },
                undo: function() { exprEl.textContent = initExpr; exprEl.style.color = ''; }
            });
            self._renderTree(contentEl, treeNodes, suffix);
            self._setNodeState(contentEl, suffix, 0, 'node-root');
            self._initStepController(contentEl, steps, suffix);
        }

        resetBtn.addEventListener('click', function() {
            var nums = inputNums.value.split(',').map(function(x) { return parseInt(x.trim()); }).filter(function(x) { return !isNaN(x); });
            if (nums.length < 2) nums = defaultNums.slice();
            if (nums.length > 6) nums = nums.slice(0, 6);
            var opsArr = inputOps.value.split(',').map(function(x) { return Math.max(0, parseInt(x.trim()) || 0); });
            while (opsArr.length < 4) opsArr.push(0);
            opsArr = opsArr.slice(0, 4);
            var totalOps = opsArr[0] + opsArr[1] + opsArr[2] + opsArr[3];
            if (totalOps !== nums.length - 1) {
                alert('연산자 개수의 합은 ' + (nums.length - 1) + '이어야 합니다 (숫자 ' + nums.length + '개 - 1). 현재: ' + totalOps);
                return;
            }
            inputNums.value = nums.join(',');
            inputOps.value = opsArr.join(',');
            self._clearVizState();
            buildAndRun(nums, opsArr);
        });
        buildAndRun(defaultNums, defaultOps);
    },

    // ====================================================================
    // 시뮬레이션 6: 스타트와 링크 (boj-14889)
    // ====================================================================
    _renderVizTeam(contentEl) {
        var self = this, suffix = '-team';
        var defaultN = 4;
        var defaultS = [[0,1,2,3],[4,0,5,6],[7,1,0,2],[3,4,5,0]];
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">스타트와 링크 — 팀 분배</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (짝수): <input type="number" id="bt-team-n" value="' + defaultN + '" min="4" max="8" step="2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-team-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">N 변경 시 랜덤 시너지 행렬 생성</span>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="tm-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div id="tm-teams' + suffix + '" style="display:flex;gap:16px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="tm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var teamsEl = contentEl.querySelector('#tm-teams' + suffix);
        var infoEl = contentEl.querySelector('#tm-info' + suffix);
        var descEl = contentEl.querySelector('#tm-desc' + suffix);
        var inputN = contentEl.querySelector('#bt-team-n');
        var resetBtn = contentEl.querySelector('#bt-team-reset');
        function generateMatrix(N) {
            var S = [];
            for (var i = 0; i < N; i++) { S.push([]); for (var j = 0; j < N; j++) S[i].push(i === j ? 0 : Math.floor(Math.random() * 10)); }
            return S;
        }
        function buildAndRun(N, S) {
            descEl.textContent = N + '명을 ' + (N/2) + '명씩 두 팀으로 나누어 시너지 차이를 최소화합니다.';
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
            // enumerate C(N, N/2) combinations
            var half = N / 2;
            var combos = [];
            (function genCombos(start, combo) {
                if (combo.length === half) { combos.push(combo.slice()); return; }
                for (var i = start; i < N; i++) { combo.push(i); genCombos(i + 1, combo); combo.pop(); }
            })(0, []);
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
        }
        resetBtn.addEventListener('click', function() {
            var N = parseInt(inputN.value) || defaultN;
            if (N % 2 !== 0) N = N + 1;
            N = Math.max(4, Math.min(8, N));
            inputN.value = N;
            var S = (N === defaultN) ? defaultS : generateMatrix(N);
            self._clearVizState();
            buildAndRun(N, S);
        });
        buildAndRun(defaultN, defaultS);
    },

    // ====================================================================
    // 시뮬레이션 7: N-Queen (boj-9663)
    // ====================================================================
    _renderVizNQueen(contentEl) {
        var self = this, suffix = '-nq';
        var defaultN = 4;
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">N-Queen</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="bt-queen-n" value="' + defaultN + '" min="4" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="bt-queen-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<p id="nq-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></p>' +
            '<div style="display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div><div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;text-align:center;">체스판</div>' +
            '<div id="nq-board' + suffix + '" style="display:grid;gap:2px;justify-content:center;margin-bottom:8px;"></div></div>' +
            '<div style="flex:1;min-width:200px;max-width:500px;"><div style="font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:6px;text-align:center;">탐색 트리</div>' +
            '<div id="nq-tree' + suffix + '" style="overflow-x:auto;padding:8px 0;min-height:120px;font-family:monospace;font-size:0.78rem;line-height:1.6;white-space:pre;"></div></div>' +
            '</div>' +
            '<div id="nq-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#nq-board' + suffix);
        var infoEl = contentEl.querySelector('#nq-info' + suffix);
        var descEl = contentEl.querySelector('#nq-desc' + suffix);
        var treeEl = contentEl.querySelector('#nq-tree' + suffix);
        var inputN = contentEl.querySelector('#bt-queen-n');
        var resetBtn = contentEl.querySelector('#bt-queen-reset');
        function buildAndRun(n) {
            descEl.textContent = n + '\u00d7' + n + ' 체스판에 퀸 ' + n + '개를 서로 공격할 수 없게 놓습니다.';
            var cellSize = n <= 5 ? 48 : (n <= 6 ? 42 : 36);
            boardEl.style.gridTemplateColumns = 'repeat(' + n + ',' + cellSize + 'px)';
            boardEl.innerHTML = '';
            for (var r = 0; r < n; r++) {
                for (var c = 0; c < n; c++) {
                    var cell = document.createElement('div');
                    cell.style.cssText = 'width:' + cellSize + 'px;height:' + cellSize + 'px;display:flex;align-items:center;justify-content:center;font-size:' + (cellSize > 40 ? '1.4' : '1.1') + 'rem;border-radius:4px;transition:all 0.3s;' + ((r+c)%2===0 ? 'background:#f0d9b5;' : 'background:#b58863;');
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    boardEl.appendChild(cell);
                }
            }
            function getCell(r, c) { return boardEl.querySelector('[data-row="' + r + '"][data-col="' + c + '"]'); }
            infoEl.innerHTML = '<span style="color:var(--text2);">행별로 퀸을 배치합니다.</span>';

            // 탐색 트리 구축용 데이터
            var treeNodes = []; // { id, label, depth, parentId, status: 'try'|'place'|'fail'|'solution'|'backtrack' }
            var treeNodeId = 0;
            treeNodes.push({ id: treeNodeId++, label: '시작', depth: 0, parentId: -1, status: 'root' });

            var steps = [], queens = [], solCount = 0;
            for (var i = 0; i < n; i++) queens.push(-1);
            function isValid(row, col) { for (var r = 0; r < row; r++) { if (queens[r] === col || Math.abs(queens[r]-col) === Math.abs(r-row)) return false; } return true; }

            // 트리 렌더링: 텍스트 기반 트리
            function renderTree(highlightId, highlightStatus) {
                var byParent = {};
                for (var i = 0; i < treeNodes.length; i++) {
                    var pid = treeNodes[i].parentId;
                    if (!byParent[pid]) byParent[pid] = [];
                    byParent[pid].push(treeNodes[i]);
                }
                var lines = [];
                function drawNode(node, prefix, isLast) {
                    var connector = node.parentId < 0 ? '' : (isLast ? '\u2514\u2500 ' : '\u251c\u2500 ');
                    var color = 'var(--text2)';
                    var weight = '400';
                    if (node.status === 'solution') { color = 'var(--green)'; weight = '700'; }
                    else if (node.status === 'fail') { color = 'var(--red)'; }
                    else if (node.status === 'backtrack') { color = 'var(--red)'; }
                    else if (node.status === 'place') { color = 'var(--accent)'; weight = '600'; }
                    else if (node.status === 'root') { color = 'var(--accent)'; weight = '700'; }
                    var isHighlight = (node.id === highlightId);
                    var bg = isHighlight ? 'background:var(--yellow);color:#333;padding:0 4px;border-radius:3px;' : '';
                    lines.push('<span style="color:' + color + ';font-weight:' + weight + ';' + bg + '">' + prefix + connector + node.label + '</span>');
                    var children = byParent[node.id] || [];
                    for (var c = 0; c < children.length; c++) {
                        var childPrefix = node.parentId < 0 ? '' : (prefix + (isLast ? '   ' : '\u2502  '));
                        drawNode(children[c], childPrefix, c === children.length - 1);
                    }
                }
                drawNode(treeNodes[0], '', true);
                treeEl.innerHTML = lines.join('\n');
            }

            // 현재 부모 트리 노드 ID를 추적하는 스택
            var parentStack = [0]; // root id

            var solve = function(row) {
                if (row === n) {
                    solCount++;
                    var sc = solCount, qs = queens.slice();
                    var solNodeId = treeNodeId++;
                    treeNodes.push({ id: solNodeId, label: '\u2705 해 #' + sc, depth: row + 1, parentId: parentStack[parentStack.length - 1], status: 'solution' });
                    (function(sc, qs, nid) {
                        steps.push({ description: sc + '번째 해를 찾았습니다!',
                            action: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = '#00b894'; infoEl.innerHTML = '<strong style="color:var(--green);">' + sc + '번째 해 발견!</strong>'; renderTree(nid, 'solution'); },
                            undo: function() { for (var r = 0; r < n; r++) getCell(r, qs[r]).style.background = (r+qs[r])%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(sc, qs, solNodeId);
                    return;
                }
                for (var col = 0; col < n; col++) {
                    var cr = row, cc = col;
                    var tryNodeId = treeNodeId++;
                    var curParent = parentStack[parentStack.length - 1];
                    treeNodes.push({ id: tryNodeId, label: (cr+1) + '행' + (cc+1) + '열?', depth: row + 1, parentId: curParent, status: 'try' });
                    (function(cr, cc, nid) {
                        steps.push({ description: (cr+1) + '행 ' + (cc+1) + '열에 퀸을 시도...',
                            action: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; renderTree(nid, 'try'); },
                            undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                        });
                    })(cr, cc, tryNodeId);
                    if (isValid(row, col)) {
                        queens[row] = col;
                        // 배치 성공 — 트리 노드 상태를 place로 변경
                        treeNodes[tryNodeId].status = 'place';
                        treeNodes[tryNodeId].label = (cr+1) + '행' + (cc+1) + '열 \u265b';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u2705 ' + (cr+1) + '행 ' + (cc+1) + '열: 충돌 없음! 퀸 배치',
                                action: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; renderTree(nid, 'place'); },
                                undo: function() { getCell(cr, cc).textContent = '?'; getCell(cr, cc).style.background = '#fdcb6e'; getCell(cr,cc).style.color = ''; }
                            });
                        })(cr, cc, tryNodeId);
                        parentStack.push(tryNodeId);
                        solve(row + 1);
                        parentStack.pop();
                        queens[row] = -1;
                        treeNodes[tryNodeId].status = 'backtrack';
                        treeNodes[tryNodeId].label = (cr+1) + '행' + (cc+1) + '열 \u21a9';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u21a9\ufe0f ' + (cr+1) + '행 ' + (cc+1) + '열 퀸 제거 (되돌아감)',
                                action: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; getCell(cr,cc).style.color = ''; renderTree(nid, 'backtrack'); },
                                undo: function() { getCell(cr, cc).textContent = '\u265b'; getCell(cr, cc).style.background = '#d63031'; getCell(cr,cc).style.color = 'white'; }
                            });
                        })(cr, cc, tryNodeId);
                    } else {
                        treeNodes[tryNodeId].status = 'fail';
                        treeNodes[tryNodeId].label = (cr+1) + '행' + (cc+1) + '열 \u2715';
                        (function(cr, cc, nid) {
                            steps.push({ description: '\u274c ' + (cr+1) + '행 ' + (cc+1) + '열: 충돌! 건너뜀',
                                action: function() { getCell(cr, cc).textContent = '\u2715'; getCell(cr, cc).style.background = '#e17055'; renderTree(nid, 'fail'); setTimeout(function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }, 400); },
                                undo: function() { getCell(cr, cc).textContent = ''; getCell(cr, cc).style.background = (cr+cc)%2===0 ? '#f0d9b5' : '#b58863'; }
                            });
                        })(cr, cc, tryNodeId);
                    }
                }
            };
            solve(0);
            var fsc = solCount;
            steps.push({ description: '탐색 완료! ' + fsc + '개의 해를 찾았습니다', action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 총 ' + fsc + '개의 해</strong>'; renderTree(-1, ''); }, undo: function(){} });
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var n = Math.max(4, Math.min(8, parseInt(inputN.value) || defaultN));
            inputN.value = n;
            self._clearVizState();
            buildAndRun(n);
        });
        buildAndRun(defaultN);
    },

    // ====================================================================
    // 시뮬레이션 8: 스도쿠 (boj-2580)
    // ====================================================================
    _renderVizSudoku(contentEl) {
        var self = this, suffix = '-sdk';
        // 4x4 mini sudoku presets
        var presets = [
            { name: '퍼즐 1 (빈칸 8개)', board: [[1,0,0,4],[0,4,1,0],[0,1,4,0],[4,0,0,1]] },
            { name: '퍼즐 2 (빈칸 10개)', board: [[0,0,3,0],[0,3,0,1],[1,0,0,0],[0,0,1,0]] },
            { name: '퍼즐 3 (빈칸 6개)', board: [[0,2,0,4],[3,0,0,2],[2,0,0,3],[0,3,0,1]] }
        ];
        var selectOptions = presets.map(function(p, i) { return '<option value="' + i + '">' + p.name + '</option>'; }).join('');
        contentEl.innerHTML =
            '<h3 style="margin-bottom:8px;">스도쿠 (4\u00d74 미니)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">퍼즐 선택: <select id="bt-sudo-preset" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;">' + selectOptions + '</select></label>' +
            '<button class="btn btn-primary" id="bt-sudo-reset">\ud83d\udd04</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4\u00d74 스도쿠의 빈 칸을 백트래킹으로 채웁니다. 각 행, 열, 2\u00d72 박스에 1~4가 하나씩.</p>' +
            self._createStepDesc(suffix) +
            '<div id="sdk-board' + suffix + '" style="display:grid;grid-template-columns:repeat(4,48px);gap:2px;justify-content:center;margin-bottom:8px;"></div>' +
            '<div id="sdk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var boardEl = contentEl.querySelector('#sdk-board' + suffix);
        var infoEl = contentEl.querySelector('#sdk-info' + suffix);
        var presetSelect = contentEl.querySelector('#bt-sudo-preset');
        var resetBtn = contentEl.querySelector('#bt-sudo-reset');
        function buildAndRun(board) {
            var gridState = board.map(function(row) { return row.slice(); });
            boardEl.innerHTML = '';
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
                    steps.push({ description: '\u2705 스도쿠 완성!',
                        action: function() { for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) { var cl = getCell(r,c); if (board[r][c] === 0) cl.style.color = 'var(--green)'; } infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">\u2705 스도쿠 완성!</strong>'; },
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
                            steps.push({ description: '\u2705 (' + (br+1) + ',' + (bc+1) + ') = ' + num + ' 가능! 배치',
                                action: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = 'var(--accent)'; },
                                undo: function() { getCell(br, bc).textContent = num; getCell(br, bc).style.color = '#6c5ce7'; }
                            });
                        })(br, bc, num);
                        solve(idx + 1);
                        if (solved) return;
                        gridState[br][bc] = 0;
                        (function(br, bc) {
                            steps.push({ description: '\u21a9\ufe0f (' + (br+1) + ',' + (bc+1) + ') 되돌림',
                                action: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; },
                                undo: function() {}
                            });
                        })(br, bc);
                    } else {
                        (function(br, bc, num) {
                            steps.push({ description: '\u274c (' + (br+1) + ',' + (bc+1) + ')에 ' + num + ' 불가 (충돌)',
                                action: function() { getCell(br, bc).style.background = '#e1705530'; setTimeout(function() { getCell(br, bc).style.background = 'white'; getCell(br, bc).textContent = ''; getCell(br,bc).style.color = ''; }, 300); },
                                undo: function() { getCell(br, bc).textContent = ''; getCell(br, bc).style.color = ''; getCell(br, bc).style.background = 'white'; }
                            });
                        })(br, bc, num);
                    }
                }
            };
            solve(0);
            self._initStepController(contentEl, steps, suffix);
        }
        resetBtn.addEventListener('click', function() {
            var idx = parseInt(presetSelect.value) || 0;
            var board = presets[idx].board;
            self._clearVizState();
            buildAndRun(board);
        });
        buildAndRun(presets[0].board);
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul><li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li></ul>
                <h4>입력</h4>
                <p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>출력</h4>
                <p>한 줄에 하나씩 문제의 조건을 만족하는 수열을 출력한다. 중복되는 수열을 여러 번 출력하면 안되며, 각 수열은 공백으로 구분해서 출력해야 한다.</p>
                <p>수열은 사전 순으로 증가하는 순서로 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2</pre></div>
                    <div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 1\n2 3\n2 4\n3 1\n3 2\n3 4\n4 1\n4 2\n4 3</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '1~N에서 M개를 뽑는 모든 수열을 만들어야 해. 가장 직관적인 방법은? M중 for문! 예를 들어 M=3이면 <code>for i / for j / for k</code>로 전부 돌리면 되지 않을까?' },
                { title: '근데 이러면 문제가 있어', content: 'M이 몇인지 <strong>입력으로</strong> 들어오잖아. M=2면 2중 for문, M=5면 5중 for문... 코드로는 "M중 for문"을 짤 수가 없어! 게다가 중복 체크도 매번 직접 해줘야 하고.<br><br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=2</div><code>for i: for j:</code></div><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=3</div><code>for i: for j: for k:</code></div><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">M=?</div><code>for ...: ???</code></div></div>' },
                { title: '이렇게 하면 어떨까?', content: 'for문 대신 <strong>재귀</strong>를 쓰면 깊이가 자유자재야! <code>backtrack()</code> 함수가 자기 자신을 호출하면서 한 자리씩 채워가는 거지. 그리고 <code>used</code> 배열로 "이미 쓴 숫자"를 표시해두면 중복 방지도 깔끔해.<br><br>핵심 패턴: <strong>선택 → 재귀 → 되돌리기</strong><br>숫자를 고르고 → 다음 자리로 재귀하고 → 돌아오면 <code>used[i] = False</code>와 <code>path.pop()</code>으로 원상복구해서 다른 숫자를 시도해.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)\n\ndef backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:\n            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\nbool used[9];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        if (!used[i]) {\n            used[i] = true;\n            path[depth] = i;\n            backtrack(depth + 1);\n            used[i] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0);\n}'
            },
            solutions: [{
                approach: 'used 배열 백트래킹',
                description: 'used 배열로 사용 여부를 추적하며 순열을 생성한다',
                timeComplexity: 'O(N!/(N-M)!)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '기본 세팅', desc: 'used 배열로 각 숫자의 사용 여부를 추적합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\nused = [False] * (n + 1)' },
                        { title: '백트래킹 함수', desc: '길이가 M이면 출력하고, 아니면 1~N 중 미사용 숫자를 탐색합니다.', code: 'def backtrack():\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(1, n + 1):\n        if not used[i]:' },
                        { title: '선택과 되돌리기', desc: '숫자를 선택 후 재귀하고, 돌아오면 원상복구하여 다른 선택을 시도합니다.', code: '            used[i] = True\n            path.append(i)\n            backtrack()\n            path.pop()\n            used[i] = False\n\nbacktrack()' }
                    ],
                    cpp: [
                        { title: '기본 세팅', desc: 'path를 depth 인덱스로 관리.\nused 배열로 사용 여부 추적.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\nbool used[9];' },
                        { title: '백트래킹 함수', desc: 'depth가 M이면 출력, 아니면 미사용 숫자를 순회합니다.', code: 'void backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        if (!used[i]) {' },
                        { title: '선택과 되돌리기', desc: '선택 → 재귀 → 복구의 백트래킹 핵심 패턴입니다.', code: '            used[i] = true;\n            path[depth] = i;\n            backtrack(depth + 1);\n            used[i] = false;  // 되돌리기\n        }\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0);\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul><li>1부터 N까지 자연수 중에서 중복 없이 M개를 고른 수열</li><li>고른 수열은 오름차순이어야 한다.</li></ul>
                <h4>입력</h4>
                <p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>출력</h4>
                <p>한 줄에 하나씩 문제의 조건을 만족하는 수열을 출력한다. 중복되는 수열을 여러 번 출력하면 안되며, 각 수열은 공백으로 구분해서 출력해야 한다.</p>
                <p>수열은 사전 순으로 증가하는 순서로 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2</pre></div>
                    <div><strong>출력</strong><pre>1 2\n1 3\n1 4\n2 3\n2 4\n3 4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N과 M (1)처럼 수열을 다 만들고, 오름차순이 아닌 것만 걸러내면 되지 않을까? <code>used</code> 배열로 순열 만들고, 출력 전에 정렬 여부를 체크하는 거야.' },
                { title: '근데 이러면 문제가 있어', content: '그러면 N!/(N-M)!개를 다 만들어 놓고 대부분을 버리게 돼. 예를 들어 N=8, M=4면 1680개를 만들어서 70개만 남기는 셈이야. <strong>만들기 전에</strong> 걸러낼 수 없을까?<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">순열 전부 생성</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">1680개</div></div><div style="font-size:1.5rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">오름차순만</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">70개</div></div><div style="font-size:0.75rem;color:var(--text3);">96% 버림!</div></div>' },
                { title: '이렇게 하면 어떨까?', content: '핵심 아이디어: 이전에 고른 숫자보다 <strong>큰 것만</strong> 고르면 자동으로 오름차순이야!<br><br><code>backtrack(start)</code>에서 반복문을 <code>start</code>부터 시작하고, 재귀할 때 <code>i+1</code>을 넘기면 돼. 이러면 <code>used</code> 배열도 필요 없어! <code>start</code> 파라미터가 "여기부터만 골라"라고 범위를 제한해주니까.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i + 1)\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i + 1);\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0, 1);\n}'
            },
            solutions: [{
                approach: 'start 파라미터 조합',
                description: 'start 파라미터로 오름차순 조합만 생성한다',
                timeComplexity: 'O(C(N,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', desc: 'used 배열 없이 start 파라미터만으로 조합을 구성합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start 파라미터', desc: 'start부터 순회하므로 이전 숫자를 다시 고르지 않아 오름차순이 보장됩니다.', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'i+1로 재귀', desc: 'i+1을 넘겨 자기보다 큰 수만 선택하게 하여 중복 없는 조합을 만듭니다.', code: '        path.append(i)\n        backtrack(i + 1)  # i+1로 오름차순 보장\n        path.pop()\n\nbacktrack(1)' }
                    ],
                    cpp: [
                        { title: '세팅', desc: 'used 배열 불필요 — start 파라미터가 순서를 제어합니다.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];' },
                        { title: 'start 파라미터', desc: 'used 배열 불필요 — start가 중복 방지.', code: 'void backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {' },
                        { title: 'i+1로 재귀', desc: 'i+1을 넘겨 현재보다 큰 수만 선택 → 오름차순 조합.', code: '        path[depth] = i;\n        backtrack(depth + 1, i + 1);  // i+1로 오름차순 보장\n    }\n}\n\nint main() {\n    cin >> n >> m;\n    backtrack(0, 1);\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul><li>1부터 N까지 자연수 중에서 M개를 고른 수열</li><li>같은 수를 여러 번 골라도 된다.</li></ul>
                <h4>입력</h4>
                <p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 7)</p>
                <h4>출력</h4>
                <p>한 줄에 하나씩 문제의 조건을 만족하는 수열을 출력한다. 중복되는 수열을 여러 번 출력하면 안되며, 각 수열은 공백으로 구분해서 출력해야 한다.</p>
                <p>수열은 사전 순으로 증가하는 순서로 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2</pre></div>
                    <div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 1\n2 2\n2 3\n2 4\n3 1\n3 2\n3 3\n3 4\n4 1\n4 2\n4 3\n4 4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ M ≤ N ≤ 7</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N과 M (1)과 비슷한데, 이번엔 같은 숫자를 여러 번 써도 돼! 그러면 (1)처럼 <code>used</code> 배열을 쓰되, 재귀 후 되돌릴 때 다시 허용하면 되려나?' },
                { title: '근데 이러면 문제가 있어', content: '잠깐, <code>used</code>를 쓰고 되돌리는 건 (1)에서 이미 하고 있잖아! 중복을 <strong>허용</strong>하는 거니까, 애초에 "이 숫자 썼는지" 확인 자체가 필요 없는 거야.' },
                { title: '이렇게 하면 어떨까?', content: '<code>used</code> 배열을 <strong>완전히 없애면</strong> 끝! 매번 1~N 전체를 자유롭게 골라. 코드가 오히려 (1)보다 더 간단해져.<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">(1) 중복 X</div><code>used[i]</code> 체크 O</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">(3) 중복 O</div><code>used</code> 필요 없음!</div></div><br>단, 출력량이 N<sup>M</sup>개로 어마어마하게 많아질 수 있으니 빠른 출력이 필수야!<br><span class="lang-py">Python: <code>sys.stdout.write()</code>로 한 번에 모아서 출력</span><span class="lang-cpp">C++: <code>printf</code> 또는 <code>ios::sync_with_stdio(false)</code> 사용</span>' }
            ],
            templates: {
                python: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []\n\ndef backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):\n        path.append(i)\n        backtrack()\n        path.pop()\n\nbacktrack()\nsys.stdout.write(\'\\n\'.join(result))',
                cpp: '#include <cstdio>\n\nint n, m;\nint path[8];\n\nvoid backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            printf("%d%c", path[i], i < m-1 ? \' \' : \'\\n\');\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1);\n    }\n}\n\nint main() {\n    scanf("%d %d", &n, &m);\n    backtrack(0);\n}'
            },
            solutions: [{
                approach: '제한 없는 중복 순열',
                description: 'used 배열 없이 모든 조합을 생성한다',
                timeComplexity: 'O(N^M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', desc: 'result에 모아 한 번에 출력 — 출력량이 N^M으로 많기 때문입니다.', code: 'import sys\n\nn, m = map(int, sys.stdin.readline().split())\npath = []\nresult = []' },
                        { title: '백트래킹 (used 없음)', desc: '중복 허용이라 used 체크 없이 매번 1~N 전부 선택 가능합니다.', code: 'def backtrack():\n    if len(path) == m:\n        result.append(\' \'.join(map(str, path)))\n        return\n    for i in range(1, n + 1):  # 제한 없이 1~N\n        path.append(i)\n        backtrack()\n        path.pop()' },
                        { title: '전체 출력 최적화', desc: 'stdout.write로 한 번에 출력하여 I/O 병목을 줄입니다.', code: 'backtrack()\nsys.stdout.write(\'\\n\'.join(result))' }
                    ],
                    cpp: [
                        { title: '세팅', desc: 'printf로 빠른 출력 — N^M개가 많을 수 있음.', code: '#include <cstdio>\n\nint n, m;\nint path[8];' },
                        { title: '백트래킹 (used 없음)', desc: '중복 허용이라 used 체크 없이 1~N 전체 순회.', code: 'void backtrack(int depth) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            printf("%d%c", path[i], i < m-1 ? \' \' : \'\\n\');\n        return;\n    }\n    for (int i = 1; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1);\n    }\n}' },
                        { title: '입력 및 실행', desc: 'scanf로 빠른 입력 — printf와 짝을 맞춥니다.', code: 'int main() {\n    scanf("%d %d", &n, &m);\n    backtrack(0);\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 M이 주어졌을 때, 아래 조건을 만족하는 길이가 M인 수열을 모두 구하는 프로그램을 작성하시오.</p>
                <ul><li>1부터 N까지 자연수 중에서 M개를 고른 수열</li><li>같은 수를 여러 번 골라도 된다.</li><li>고른 수열은 비내림차순이어야 한다.</li></ul>
                <h4>입력</h4>
                <p>첫째 줄에 자연수 N과 M이 주어진다. (1 ≤ M ≤ N ≤ 8)</p>
                <h4>출력</h4>
                <p>한 줄에 하나씩 문제의 조건을 만족하는 수열을 출력한다. 중복되는 수열을 여러 번 출력하면 안되며, 각 수열은 공백으로 구분해서 출력해야 한다.</p>
                <p>수열은 사전 순으로 증가하는 순서로 출력해야 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 1</pre></div>
                    <div><strong>출력</strong><pre>1\n2\n3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2</pre></div>
                    <div><strong>출력</strong><pre>1 1\n1 2\n1 3\n1 4\n2 2\n2 3\n2 4\n3 3\n3 4\n4 4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ M ≤ N ≤ 8</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '비내림차순 + 중복 허용이라... (3)처럼 중복 허용으로 전부 만들고, 비내림차순이 아닌 건 버리면 되지 않을까? 아니면 (2)의 오름차순 코드에서 중복만 허용하면?' },
                { title: '근데 이러면 문제가 있어', content: '(3)처럼 전부 만들고 거르면 낭비가 크고, (2)의 코드는 <code>i+1</code>을 넘기니까 같은 수를 다시 못 골라. 그럼 어디를 바꿔야 "같은 수도 다시 고를 수 있게" 될까?<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">(2) 오름차순</div><code>backtrack(i+1)</code><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">다음 수부터 → 중복 X</div></div><div style="font-size:1.3rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">(4) 비내림차순</div><code>backtrack(i)</code><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">같은 수부터 → 중복 O</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '(2)에서 딱 한 글자만 바꾸면 돼! 재귀 호출 시 <code>i+1</code> 대신 <code>i</code>를 넘기면, 자기 자신을 다시 선택할 수 있어. <code>start</code>가 안 올라가니까 같은 수를 또 고를 수 있는 거지.<br><br>📌 <strong>N과 M 시리즈 정리:</strong><br>(1) 순서 O, 중복 X → <code>used</code> 배열<br>(2) 순서 X, 중복 X → <code>start</code>, <code>i+1</code><br>(3) 순서 O, 중복 O → 제한 없음<br>(4) 순서 X, 중복 O → <code>start</code>, <code>i</code>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []\n\ndef backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):\n        path.append(i)\n        backtrack(i)    # i+1이 아닌 i!\n        path.pop()\n\nbacktrack(1)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];\n\nvoid backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {\n        path[depth] = i;\n        backtrack(depth + 1, i);  // i+1이 아닌 i!\n    }\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    cin >> n >> m;\n    backtrack(0, 1);\n}'
            },
            solutions: [{
                approach: 'start 파라미터 중복 조합',
                description: 'start를 i로 넘겨 중복 허용 비내림차순 조합을 생성한다',
                timeComplexity: 'O(C(N+M-1,M))',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: '세팅', desc: 'N과 M (2)와 구조 동일 — 차이는 재귀 호출 인자뿐입니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn, m = map(int, input().split())\npath = []' },
                        { title: 'start 파라미터', desc: 'start부터 순회하여 비내림차순을 보장합니다.', code: 'def backtrack(start):\n    if len(path) == m:\n        print(*path)\n        return\n    for i in range(start, n + 1):' },
                        { title: 'i로 재귀 (i+1 아님)', desc: 'i를 넘기면 같은 수를 다시 고를 수 있어 중복 조합이 됩니다.', code: '        path.append(i)\n        backtrack(i)    # i+1이 아닌 i!\n        path.pop()\n\nbacktrack(1)' }
                    ],
                    cpp: [
                        { title: '세팅', desc: 'N과 M (2)와 동일한 구조 — 재귀 인자만 다릅니다.', code: '#include <iostream>\nusing namespace std;\n\nint n, m;\nint path[9];' },
                        { title: 'start 파라미터', desc: 'start 이상의 수만 순회하여 비내림차순을 유지합니다.', code: 'void backtrack(int depth, int start) {\n    if (depth == m) {\n        for (int i = 0; i < m; i++)\n            cout << path[i] << (i < m-1 ? " " : "\\n");\n        return;\n    }\n    for (int i = start; i <= n; i++) {' },
                        { title: 'i로 재귀 (i+1 아님)', desc: 'i+1이 아닌 i → 같은 수를 또 선택 가능.', code: '        path[depth] = i;\n        backtrack(depth + 1, i);  // i+1이 아닌 i!\n    }\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(0);\n    cin >> n >> m;\n    backtrack(0, 1);\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수로 이루어진 수열 A1, A2, ..., AN이 주어진다. 또, 수와 수 사이에 끼워넣을 수 있는 N-1개의 연산자가 주어진다. 연산자는 덧셈(+), 뺄셈(-), 곱셈(\u00d7), 나눗셈(\u00f7)으로만 이루어져 있다.</p>
                <p>식의 계산은 연산자 우선 순위를 무시하고 앞에서부터 진행한다. 나눗셈은 정수 나눗셈(C++14의 기준)으로 몫만 취한다. 음수를 양수로 나눌 때는 양수로 바꾼 뒤 몫을 취하고 음수로 바꾼다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 수의 개수 N(2 ≤ N ≤ 11)이 주어진다. 둘째 줄에는 A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>이 주어진다. (1 ≤ A<sub>i</sub> ≤ 100) 셋째 줄에는 합이 N-1인 4개의 정수가 주어지는데, 차례대로 덧셈(+)의 개수, 뺄셈(-)의 개수, 곱셈(\u00d7)의 개수, 나눗셈(\u00f7)의 개수이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 만들 수 있는 식의 결과의 최댓값을, 둘째 줄에는 최솟값을 출력한다. 연산자를 어떻게 끼워넣어도 항상 -10억보다 크거나 같고, 10억보다 작거나 같은 결과가 나오는 입력만 주어진다. 또한, 앞에서부터 계산했을 때, 중간에 계산되는 식의 결과도 항상 -10억보다 크거나 같고, 10억보다 작거나 같다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2\n5 6\n0 0 1 0</pre></div>
                    <div><strong>출력</strong><pre>30\n30</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n3 4 5\n1 0 1 0</pre></div>
                    <div><strong>출력</strong><pre>35\n17</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6\n1 2 3 4 5 6\n2 1 1 1</pre></div>
                    <div><strong>출력</strong><pre>54\n-24</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>2 \u2264 N \u2264 11</li><li>1 \u2264 A<sub>i</sub> \u2264 100</li><li>연산자 개수의 합은 N-1</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '숫자 사이에 연산자 N-1개를 끼워 넣는 거니까... 연산자의 모든 <strong>순서</strong>를 시도해보면 되지 않을까? 예를 들어 [+, -, ×] 가 있으면 이걸 배치하는 모든 순열을 만들어서 계산해보는 거야.' },
                { title: '근데 이러면 문제가 있어', content: '같은 종류의 연산자가 여러 개일 수 있어! 예를 들어 +가 2개, ×가 1개면, 순열로 만들면 중복 배치가 생기고 비효율적이야. 연산자를 "종류별 개수"로 관리하면 더 깔끔하지 않을까?' },
                { title: '이렇게 하면 어떨까?', content: '<code>ops = [+개수, -개수, ×개수, ÷개수]</code>로 남은 개수를 관리해! 각 자리에서 남은 연산자 4종류를 확인하고, 개수가 0보다 큰 것만 사용해.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><span style="padding:4px 8px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">선택</span><span style="color:var(--text3);">ops[i] -= 1</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 8px;border-radius:6px;background:var(--yellow);color:white;font-weight:600;">재귀</span><span style="color:var(--text3);">backtrack()</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">되돌리기</span><span style="color:var(--text3);">ops[i] += 1</span></div>' },
                { title: '함정 주의: 나눗셈!', content: '이 문제의 나눗셈은 <strong>0 방향으로 버림</strong>이야. 양수끼리는 상관없지만, 음수가 섞이면 조심해야 해!<br><span class="lang-py">Python: <code>a // b</code>는 음수에서 바닥 방향으로 내림해서 결과가 달라. <code>int(a / b)</code>를 써야 0 방향 버림이 돼!</span><span class="lang-cpp">C++: <code>a / b</code>가 기본적으로 0 방향 버림이라 그대로 쓰면 돼.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))  # +, -, *, //\n\nmax_val = -1e9\nmin_val = 1e9\n\ndef backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])  # 0 방향 버림\n            backtrack(idx + 1, nxt)\n            ops[i] += 1\n\nbacktrack(1, nums[0])\nprint(max_val)\nprint(min_val)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint n, nums[12], ops[4];\nint maxVal = -1e9, minVal = 1e9;\n\nvoid backtrack(int idx, int cur) {\n    if (idx == n) {\n        maxVal = max(maxVal, cur);\n        minVal = min(minVal, cur);\n        return;\n    }\n    for (int i = 0; i < 4; i++) {\n        if (ops[i] > 0) {\n            ops[i]--;\n            int nxt;\n            if (i == 0) nxt = cur + nums[idx];\n            else if (i == 1) nxt = cur - nums[idx];\n            else if (i == 2) nxt = cur * nums[idx];\n            else nxt = cur / nums[idx];\n            backtrack(idx + 1, nxt);\n            ops[i]++;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    for (int i = 0; i < 4; i++) cin >> ops[i];\n    backtrack(1, nums[0]);\n    cout << maxVal << "\\n" << minVal << endl;\n}'
            },
            solutions: [{
                approach: '연산자 배치 백트래킹',
                description: '연산자 개수를 소모/복구하며 모든 배치를 시도한다',
                timeComplexity: 'O(4^(N-1))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력 처리', desc: 'ops 리스트로 +, -, *, // 각 연산자의 남은 개수를 관리합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\nops = list(map(int, input().split()))\n\nmax_val = -1e9\nmin_val = 1e9' },
                        { title: '연산자 소모/복구', desc: '연산자를 하나 쓰고(ops[i]-=1) 재귀 후 복구(ops[i]+=1)하여 모든 배치를 시도합니다.', code: 'def backtrack(idx, current):\n    global max_val, min_val\n    if idx == n:\n        max_val = max(max_val, current)\n        min_val = min(min_val, current)\n        return\n    for i in range(4):\n        if ops[i] > 0:\n            ops[i] -= 1\n            if i == 0:   nxt = current + nums[idx]\n            elif i == 1: nxt = current - nums[idx]\n            elif i == 2: nxt = current * nums[idx]\n            else:        nxt = int(current / nums[idx])\n            backtrack(idx + 1, nxt)\n            ops[i] += 1' },
                        { title: '최대/최소 갱신', desc: '첫 번째 수(nums[0])부터 시작해 모든 연산자 배치의 최대/최소를 구합니다.', code: 'backtrack(1, nums[0])\nprint(max_val)\nprint(min_val)' }
                    ],
                    cpp: [
                        { title: '입력 처리', desc: 'ops[4]로 +, -, *, / 각 연산자의 남은 개수를 관리합니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint n, nums[12], ops[4];\nint maxVal = -1e9, minVal = 1e9;' },
                        { title: '연산자 소모/복구', desc: 'C++ 정수 나눗셈은 기본이 0 방향 버림 → 별도 처리 불필요.', code: 'void backtrack(int idx, int cur) {\n    if (idx == n) {\n        maxVal = max(maxVal, cur);\n        minVal = min(minVal, cur);\n        return;\n    }\n    for (int i = 0; i < 4; i++) {\n        if (ops[i] > 0) {\n            ops[i]--;\n            int nxt;\n            if (i == 0) nxt = cur + nums[idx];\n            else if (i == 1) nxt = cur - nums[idx];\n            else if (i == 2) nxt = cur * nums[idx];\n            else nxt = cur / nums[idx];  // 0 방향 버림 (C++ 기본)\n            backtrack(idx + 1, nxt);\n            ops[i]++;  // 되돌리기\n        }\n    }\n}' },
                        { title: '최대/최소 갱신', desc: 'nums[0]을 초기값으로 시작해 모든 배치를 탐색합니다.', code: 'int main() {\n    cin >> n;\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    for (int i = 0; i < 4; i++) cin >> ops[i];\n    backtrack(1, nums[0]);\n    cout << maxVal << "\\n" << minVal << endl;\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>짝수 N명을 N/2명씩 두 팀으로 나눈다. S<sub>ij</sub>는 i번과 j번이 같은 팀일 때 능력치. 팀의 능력치는 팀원 쌍의 S<sub>ij</sub> 합. 두 팀의 능력치 차이의 최솟값을 구하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N(4 ≤ N ≤ 20, N은 짝수)이 주어진다. 둘째 줄부터 N개의 줄에 S가 주어진다. 각 줄은 N개의 수로 이루어져 있고, i번 줄의 j번째 수는 S<sub>ij</sub>이다. S<sub>ii</sub>는 항상 0이고, 나머지 S<sub>ij</sub>는 1보다 크거나 같고, 100보다 작거나 같은 정수이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 스타트 팀과 링크 팀의 능력치의 차이의 최솟값을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4\n0 1 2 3\n4 0 5 6\n7 1 0 2\n3 4 5 0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6\n0 1 2 3 4 5\n1 0 2 3 4 5\n1 2 0 3 4 5\n1 2 3 0 4 5\n1 2 3 4 0 5\n1 2 3 4 5 0</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>4 \u2264 N \u2264 20 (짝수)</li><li>1 \u2264 S<sub>ij</sub> \u2264 100</li><li>S<sub>ii</sub> = 0</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N명을 두 팀으로 나누는 거니까, 모든 가능한 팀 조합을 만들어보면 되지 않을까? N명 중 N/2명을 고르면 그게 스타트 팀이고, 나머지가 링크 팀이잖아.' },
                { title: '근데 이러면 문제가 있어', content: '맞아, 근데 N이 최대 20이야. C(20, 10) = 184,756가지인데, 각 조합마다 팀 능력치를 계산해야 해.<br><br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">조합 수</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent);">C(20,10) = 184,756</div></div><div style="font-size:1rem;color:var(--text3);">×</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">능력치 계산</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent);">O(N<sup>2</sup>)</div></div><div style="font-size:1rem;color:var(--text3);">=</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);">총 연산</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">충분!</div></div></div>능력치는 팀원 모든 쌍 (i, j)에 대해 <code>S[i][j] + S[j][i]</code>를 합산하는 거야. 더 줄일 수 있을까?' },
                { title: '이렇게 하면 어떨까?', content: '팀 나누기는 0번 사람부터 순서대로 "스타트에 넣을까, 말까?"를 결정하는 백트래킹으로 구현해. N과 M (2)의 조합 패턴과 비슷해!<br><br>💡 <strong>가지치기 팁:</strong> {1,2,3}을 스타트로 고르는 것과 {4,5,6}을 스타트로 고르는 건 서로 반대팀일 뿐 결과가 같아 (대칭). 그래서 0번 사람은 <strong>항상 스타트 팀에 고정</strong>하면 탐색량이 절반으로 줄어!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')\n\ndef calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\ndef backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n:\n        return\n    if n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)\n\nbacktrack(0, [])\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint n, s[20][20];\nbool team[20];\nint ans = 1e9;\n\nvoid backtrack(int idx, int cnt) {\n    if (cnt == n / 2) {\n        int s1 = 0, s2 = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i+1; j < n; j++) {\n                if (team[i] && team[j])\n                    s1 += s[i][j] + s[j][i];\n                else if (!team[i] && !team[j])\n                    s2 += s[i][j] + s[j][i];\n            }\n        ans = min(ans, abs(s1 - s2));\n        return;\n    }\n    if (idx >= n) return;\n    if (n - idx < n/2 - cnt) return;\n    team[idx] = true;\n    backtrack(idx + 1, cnt + 1);\n    team[idx] = false;\n    backtrack(idx + 1, cnt);\n}\n\nint main() {\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            cin >> s[i][j];\n    backtrack(0, 0);\n    cout << ans << endl;\n}'
            },
            solutions: [{
                approach: '팀 분배 백트래킹',
                description: 'N명 중 N/2명을 선택하여 시너지 차이를 최소화한다',
                timeComplexity: 'O(C(N,N/2)*N^2)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력과 초기화', desc: 'N×N 시너지 행렬을 읽고, 최솟값을 무한대로 초기화합니다.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ns = [list(map(int, input().split())) for _ in range(n)]\nans = float(\'inf\')' },
                        { title: 'N/2명 선택', desc: '각 사람을 팀에 넣거나 빼며 C(N,N/2) 조합을 탐색합니다.', code: 'def backtrack(idx, team):\n    global ans\n    if len(team) == n // 2:\n        other = [i for i in range(n) if i not in set(team)]\n        diff = abs(calc(team) - calc(other))\n        ans = min(ans, diff)\n        return\n    if idx >= n or n - idx < n // 2 - len(team):\n        return\n    team.append(idx)\n    backtrack(idx + 1, team)\n    team.pop()\n    backtrack(idx + 1, team)' },
                        { title: '시너지 계산과 차이', desc: '팀원 모든 쌍의 S[i][j]+S[j][i]를 합산하여 두 팀 차이를 구합니다.', code: 'def calc(team):\n    total = 0\n    for i in range(len(team)):\n        for j in range(i+1, len(team)):\n            total += s[team[i]][team[j]] + s[team[j]][team[i]]\n    return total\n\nbacktrack(0, [])\nprint(ans)' }
                    ],
                    cpp: [
                        { title: '입력과 초기화', desc: 'bool team[] 배열로 팀 소속 관리.\nPython의 list.append/pop 대신 bool 토글.', code: '#include <iostream>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint n, s[20][20];\nbool team[20];\nint ans = 1e9;' },
                        { title: 'N/2명 선택', desc: '가지치기: 남은 인원이 부족하면 조기 종료.', code: 'void backtrack(int idx, int cnt) {\n    if (cnt == n / 2) {\n        int s1 = 0, s2 = 0;\n        for (int i = 0; i < n; i++)\n            for (int j = i + 1; j < n; j++) {\n                if (team[i] && team[j])\n                    s1 += s[i][j] + s[j][i];\n                else if (!team[i] && !team[j])\n                    s2 += s[i][j] + s[j][i];\n            }\n        ans = min(ans, abs(s1 - s2));\n        return;\n    }\n    if (idx >= n || n - idx < n/2 - cnt) return;\n    team[idx] = true;\n    backtrack(idx + 1, cnt + 1);\n    team[idx] = false;  // 되돌리기\n    backtrack(idx + 1, cnt);\n}' },
                        { title: '시너지 계산과 차이', desc: 'team[] 배열로 팀 분류 후, 쌍별 시너지 합을 비교합니다.', code: 'int main() {\n    cin >> n;\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++)\n            cin >> s[i][j];\n    backtrack(0, 0);\n    cout << ans << endl;\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>N\u00d7N인 체스판 위에 퀸 N개를 서로 공격할 수 없게 놓는 문제이다. N이 주어졌을 때, 퀸을 놓는 방법의 수를 구하는 프로그램을 작성하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N이 주어진다. (1 ≤ N < 15)</p>
                <h4>출력</h4>
                <p>첫째 줄에 퀸 N개를 서로 공격할 수 없게 놓는 경우의 수를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>8</pre></div>
                    <div><strong>출력</strong><pre>92</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 \u2264 N \u2264 15 (단, 시간제한 10초)</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'N×N 체스판의 모든 칸에 퀸을 놓아볼까? N개의 퀸을 N<sup>2</sup>개의 칸 중에 배치하는 모든 경우의 수를 시도하면... 되긴 하겠지?' },
                { title: '근데 이러면 문제가 있어', content: 'N=8이면 64칸 중 8개를 고르는 건 C(64, 8) = 약 44억 가지야! 너무 많아.<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);margin-bottom:3px;">모든 칸 조합</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">C(64,8) ≈ 44억</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--yellow);margin-bottom:3px;">행별 1개씩</div><div style="font-size:1.1rem;font-weight:700;color:var(--yellow);">8<sup>8</sup> = 1677만</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">+ 가지치기</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">훨씬 적음!</div></div></div>퀸은 같은 행에 두 개가 올 수 없으니까, <strong>한 행에 하나씩</strong>만 놓으면 줄어들고, 충돌 체크로 더 가지치기하면 훨씬 빨라져.' },
                { title: '이렇게 하면 어떨까?', content: '행별로 퀸을 놓을 <strong>열</strong>을 선택하면서 백트래킹해! 행 충돌은 구조적으로 불가능하고, 확인할 건 세 가지:<br>① 같은 열에 이미 퀸이 있나? → <code>col[c]</code><br>② ↘ 대각선에 퀸이 있나? → 같은 대각선은 <code>row - col</code> 값이 같아! → <code>diag1[r-c+N]</code><br>③ ↗ 대각선에 퀸이 있나? → 같은 대각선은 <code>row + col</code> 값이 같아! → <code>diag2[r+c]</code>' },
                { title: '더 빠르게 할 수 있어!', content: '2차원 보드 대신 <strong>1차원 배열 3개</strong>(col, diag1, diag2)만 쓰면 충돌 확인이 O(1)이야. 매번 보드를 탐색할 필요 없이 배열 인덱스 하나만 보면 되니까 엄청 빨라져. N=15까지도 10초 안에 해결할 수 있어!' }
            ],
            templates: {
                python: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0\n\ndef solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):\n        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint n, cnt = 0;\nbool col[15], diag1[30], diag2[30];\n\nvoid solve(int row) {\n    if (row == n) { cnt++; return; }\n    for (int c = 0; c < n; c++) {\n        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n            col[c] = diag1[row-c+n] = diag2[row+c] = true;\n            solve(row + 1);\n            col[c] = diag1[row-c+n] = diag2[row+c] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    solve(0);\n    cout << cnt << endl;\n}'
            },
            solutions: [{
                approach: '열/대각선 체크 백트래킹',
                description: 'col, diag1, diag2 배열로 O(1) 충돌 체크한다',
                timeComplexity: 'O(N!)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '충돌 배열 세팅', desc: 'col/diag1/diag2 세 배열로 열과 양쪽 대각선 사용 여부를 O(1)에 체크합니다.', code: 'import sys\n\nn = int(sys.stdin.readline())\ncol = [False] * n\ndiag1 = [False] * (2 * n)  # row - col + n\ndiag2 = [False] * (2 * n)  # row + col\ncount = 0' },
                        { title: '행별 퀸 배치', desc: '한 행에 퀸을 하나만 놓으므로, 행별로 열을 선택하며 재귀합니다.', code: 'def solve(row):\n    global count\n    if row == n:\n        count += 1\n        return\n    for c in range(n):' },
                        { title: '대각선 충돌 체크', desc: 'row-c+n(↘ 대각선), row+c(↗ 대각선) 인덱스로 충돌을 판별합니다.', code: '        if not col[c] and not diag1[row - c + n] and not diag2[row + c]:\n            col[c] = diag1[row - c + n] = diag2[row + c] = True\n            solve(row + 1)\n            col[c] = diag1[row - c + n] = diag2[row + c] = False\n\nsolve(0)\nprint(count)' }
                    ],
                    cpp: [
                        { title: '충돌 배열 세팅', desc: 'col: 열 사용 여부, diag1/diag2: 대각선 사용 여부.\nbool 배열 3개로 O(1) 충돌 체크.', code: '#include <iostream>\nusing namespace std;\n\nint n, cnt = 0;\nbool col[15], diag1[30], diag2[30];' },
                        { title: '행별 퀸 배치', desc: '행마다 열을 하나 선택 — 행 충돌은 구조적으로 불가능합니다.', code: 'void solve(int row) {\n    if (row == n) {\n        cnt++;\n        return;\n    }\n    for (int c = 0; c < n; c++) {' },
                        { title: '대각선 충돌 체크', desc: 'row-c+n: ↘ 대각선 인덱스 (음수 방지).\nrow+c: ↗ 대각선 인덱스.', code: '        if (!col[c] && !diag1[row-c+n] && !diag2[row+c]) {\n            col[c] = diag1[row-c+n] = diag2[row+c] = true;\n            solve(row + 1);\n            col[c] = diag1[row-c+n] = diag2[row+c] = false;\n        }\n    }\n}\n\nint main() {\n    cin >> n;\n    solve(0);\n    cout << cnt << endl;\n}' }
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>스도쿠는 18세기 스위스 수학자가 만든 '라틴 사각형'이라는 퍼즐에서 유래한 것으로, 가로 9칸, 세로 9칸으로 이루어져 있는 표에 1부터 9까지의 숫자를 채워넣는 퍼즐이다.</p>
                <p>같은 행, 같은 열, 같은 3\u00d73 정사각형 안에는 같은 숫자가 들어가지 않도록 하면서 빈 칸(0)을 채워 완성하시오. 답이 여러 개이면 하나만 출력.</p>
                <h4>입력</h4>
                <p>아홉 줄에 걸쳐 한 줄에 9개씩 게임 시작 전 스도쿠판 각 줄에 쓰여 있는 숫자가 한 칸씩 띄워서 차례로 주어진다. 스도쿠 판의 빈 칸의 경우에는 0이 주어진다. 스도쿠 판을 규칙대로 채울 수 없는 경우의 입력은 주어지지 않는다.</p>
                <h4>출력</h4>
                <p>모든 빈 칸이 채워진 스도쿠 판의 최종 모습을 아홉 줄에 걸쳐 한 줄에 9개씩 한 칸씩 띄워서 출력한다.</p>
                <p>스도쿠 판을 채우는 방법이 여럿인 경우는 그 중 하나만을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>0 3 5 4 6 9 2 7 8\n7 8 2 1 0 5 6 0 9\n0 6 0 2 7 8 1 3 5\n3 2 1 0 4 6 8 9 7\n8 0 4 9 1 3 5 0 6\n5 9 6 8 2 0 4 1 3\n9 1 7 6 5 2 0 8 0\n6 0 3 7 0 1 9 5 2\n2 5 8 3 9 4 7 6 0</pre></div>
                    <div><strong>출력</strong><pre>1 3 5 4 6 9 2 7 8\n7 8 2 1 3 5 6 4 9\n4 6 9 2 7 8 1 3 5\n3 2 1 5 4 6 8 9 7\n8 7 4 9 1 3 5 2 6\n5 9 6 8 2 7 4 1 3\n9 1 7 6 5 2 3 8 4\n6 4 3 7 8 1 9 5 2\n2 5 8 3 9 4 7 6 1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>빈 칸은 0으로 표시</li><li>답이 여러 개이면 하나만 출력</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '빈 칸에 1~9를 넣어보면 되지 않을까? 첫 번째 빈 칸에 1을 넣어보고, 두 번째 빈 칸에 1을 넣어보고... 이런 식으로 모든 경우를 시도하는 거야.' },
                { title: '근데 이러면 문제가 있어', content: '빈 칸이 많으면 9<sup>빈칸수</sup>가지를 전부 시도하게 돼! 하지만 스도쿠는 규칙이 빡빡하잖아 — 같은 행, 같은 열, 같은 3×3 박스에 중복 불가. 이 조건을 <strong>넣는 순간에</strong> 체크하면 불가능한 가지를 미리 잘라낼 수 있어.' },
                { title: '이렇게 하면 어떨까?', content: '빈 칸 좌표를 미리 모아두고, 순서대로 하나씩 채워가면서 백트래킹해!<br><br>매번 숫자를 넣을 때 세 가지를 확인해:<br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--accent);">① 행 체크</div><div style="display:flex;gap:2px;margin-top:4px;"><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">5</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">3</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">?</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">7</span></div></div><div style="border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--green);">② 열 체크</div><div style="display:flex;flex-direction:column;gap:2px;margin-top:4px;align-items:center;"><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">6</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">?</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);">9</span></div></div><div style="border:1.5px solid var(--yellow);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;color:var(--yellow);">③ 3×3 박스</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:4px;"><span style="padding:2px 5px;border-radius:3px;background:var(--yellow);color:white;font-size:0.7rem;">5</span><span style="padding:2px 5px;border-radius:3px;background:var(--yellow);color:white;font-size:0.7rem;">3</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">?</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">6</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;"> </span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">9</span><span style="padding:2px 5px;border-radius:3px;background:var(--bg3);font-size:0.7rem;">8</span></div></div></div>3×3 박스의 시작점은 <code>(row//3*3, col//3*3)</code>로 계산해. 실패하면 0으로 되돌리고 다음 숫자를 시도!' },
                { title: '마지막 포인트: 즉시 종료!', content: '답이 여러 개일 수 있지만 <strong>하나만 출력</strong>하면 돼. 빈 칸을 모두 채우면 바로 출력하고 프로그램을 종료해야 해.<br><span class="lang-py">Python: <code>sys.exit()</code>로 즉시 종료</span><span class="lang-cpp">C++: <code>exit(0)</code>으로 즉시 종료</span><br><br>💡 더 빠르게 하려면? 가능한 숫자가 <strong>가장 적은</strong> 빈 칸부터 채우면 가지치기 효과가 커져!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]\n\ndef is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True\n\ndef solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)',
                cpp: '#include <iostream>\n#include <vector>\n#include <cstdlib>\nusing namespace std;\n\nint board[9][9];\nvector<pair<int,int>> blanks;\n\nbool isValid(int r, int c, int num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == num) return false;\n        if (board[i][c] == num) return false;\n    }\n    int sr = r/3*3, sc = c/3*3;\n    for (int i = sr; i < sr+3; i++)\n        for (int j = sc; j < sc+3; j++)\n            if (board[i][j] == num) return false;\n    return true;\n}\n\nvoid solve(int idx) {\n    if (idx == blanks.size()) {\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++)\n                cout << board[i][j] << (j < 8 ? " " : "\\n");\n        }\n        exit(0);\n    }\n    auto [r, c] = blanks[idx];\n    for (int num = 1; num <= 9; num++) {\n        if (isValid(r, c, num)) {\n            board[r][c] = num;\n            solve(idx + 1);\n            board[r][c] = 0;\n        }\n    }\n}\n\nint main() {\n    for (int i = 0; i < 9; i++)\n        for (int j = 0; j < 9; j++) {\n            cin >> board[i][j];\n            if (board[i][j] == 0) blanks.push_back({i, j});\n        }\n    solve(0);\n}'
            },
            solutions: [{
                approach: '빈칸 채우기 백트래킹',
                description: '빈칸을 순서대로 1~9를 넣어보며 충돌 검사한다',
                timeComplexity: 'O(9^빈칸수)',
                spaceComplexity: 'O(81)',
                codeSteps: {
                    python: [
                        { title: '빈칸 수집', desc: '빈칸(0) 좌표를 미리 모아두면 순서대로 채우기만 하면 됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nboard = [list(map(int, input().split())) for _ in range(9)]\nblanks = [(r, c) for r in range(9) for c in range(9) if board[r][c] == 0]' },
                        { title: '행/열/박스 검증', desc: '같은 행, 열, 3x3 박스에 중복이 없는지 확인합니다.', code: 'def is_valid(r, c, num):\n    if num in board[r]: return False\n    for i in range(9):\n        if board[i][c] == num: return False\n    sr, sc = r // 3 * 3, c // 3 * 3\n    for i in range(sr, sr + 3):\n        for j in range(sc, sc + 3):\n            if board[i][j] == num: return False\n    return True' },
                        { title: '채우기와 출력', desc: '1~9를 넣어보고 실패 시 0으로 되돌리며, 완성 시 sys.exit()로 즉시 종료합니다.', code: 'def solve(idx):\n    if idx == len(blanks):\n        for row in board:\n            print(*row)\n        sys.exit()\n    r, c = blanks[idx]\n    for num in range(1, 10):\n        if is_valid(r, c, num):\n            board[r][c] = num\n            solve(idx + 1)\n            board[r][c] = 0\n\nsolve(0)' }
                    ],
                    cpp: [
                        { title: '빈칸 수집', desc: 'auto [r, c]로 구조적 바인딩 (C++17).\nexit(0)으로 답 찾으면 즉시 종료.', code: '#include <iostream>\n#include <vector>\n#include <cstdlib>\nusing namespace std;\n\nint board[9][9];\nvector<pair<int,int>> blanks;' },
                        { title: '행/열/박스 검증', desc: 'r/3*3, c/3*3으로 3x3 박스 시작점을 계산합니다.', code: 'bool isValid(int r, int c, int num) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == num) return false;  // 행\n        if (board[i][c] == num) return false;  // 열\n    }\n    int sr = r/3*3, sc = c/3*3;  // 3x3 박스 시작점\n    for (int i = sr; i < sr+3; i++)\n        for (int j = sc; j < sc+3; j++)\n            if (board[i][j] == num) return false;\n    return true;\n}' },
                        { title: '채우기와 출력', desc: '1~9를 넣어보고 실패 시 0으로 되돌리며, exit(0)으로 첫 답 즉시 종료합니다.', code: 'void solve(int idx) {\n    if (idx == (int)blanks.size()) {\n        for (int i = 0; i < 9; i++) {\n            for (int j = 0; j < 9; j++)\n                cout << board[i][j] << (j < 8 ? " " : "\\n");\n        }\n        exit(0);  // 답 하나만 출력 후 즉시 종료\n    }\n    auto [r, c] = blanks[idx];\n    for (int num = 1; num <= 9; num++) {\n        if (isValid(r, c, num)) {\n            board[r][c] = num;\n            solve(idx + 1);\n            board[r][c] = 0;  // 되돌리기\n        }\n    }\n}\n\nint main() {\n    for (int i = 0; i < 9; i++)\n        for (int j = 0; j < 9; j++) {\n            cin >> board[i][j];\n            if (board[i][j] == 0)\n                blanks.push_back({i, j});\n        }\n    solve(0);\n}' }
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
