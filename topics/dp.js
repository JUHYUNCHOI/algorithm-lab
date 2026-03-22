// ===== DP 토픽 모듈 =====
var dpTopic = {
    id: 'dp',
    title: '다이나믹 프로그래밍 (DP)',
    icon: '🧩',
    category: '문제 해결 기법 (Silver~Gold)',
    order: 12,
    description: '다이나믹 프로그래밍 — 한 번 푼 건 다시 안 풀기!',
    relatedNote: 'DP는 피보나치, 계단 오르기, LIS 등 기본 문제부터 배낭 문제, LCS까지 거의 모든 코딩테스트에 출제되는 핵심 기법입니다.',

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
                <h2>다이나믹 프로그래밍 (DP)</h2>
                <p class="hero-sub">큰 문제를 작은 조각으로, 한 번 푼 건 다시 풀지 않는다</p>
            </div>

            <!-- ① DP란 무엇인가? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> DP란 무엇인가?</div>
                <div class="analogy-box">
                    <strong>1+1+1+1+1 = 5</strong>를 이미 계산했어요.<br>
                    그런데 누가 <strong>1+1+1+1+1+1</strong>은 얼마냐고 물어보면?<br>
                    처음부터 다시 더할 필요 없죠? 아까 답 5에다 1만 더하면 돼요!<br><br>
                    DP는 바로 이 아이디어예요. <strong>이미 풀어본 건 기억해뒀다가 다시 쓰는 것!</strong>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 피보나치를 기억하며 풀기</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">표가 한 칸씩 채워지는 걸 봐 보세요. 한 번 계산한 건 다시 안 해도 돼요!</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-fib-input" value="8" min="3" max="12" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-fib-go">테이블 채우기</button>
                        <button class="concept-demo-btn green" id="dp-demo-fib-reset" style="display:none;">다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-fib-table" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;"></div>
                        <div id="dp-demo-fib-formula" style="text-align:center;font-size:0.95rem;color:var(--text);font-weight:600;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-fib-msg">dp[i] = dp[i-1] + dp[i-2]. 작은 값부터 채워나갑니다.</div>
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

                <div style="margin:1rem 0;font-size:0.85rem;color:var(--text2);">
                    <strong>참고 자료:</strong>
                    <a href="https://en.wikipedia.org/wiki/Dynamic_programming" target="_blank" style="color:var(--accent);text-decoration:underline;">Wikipedia: Dynamic Programming ↗</a> ·
                    <a href="https://en.wikipedia.org/wiki/Overlapping_subproblems" target="_blank" style="color:var(--accent);text-decoration:underline;">Overlapping Subproblems ↗</a> ·
                    <a href="https://en.wikipedia.org/wiki/Optimal_substructure" target="_blank" style="color:var(--accent);text-decoration:underline;">Optimal Substructure ↗</a> ·
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functools.html#functools.lru_cache" target="_blank" style="color:var(--accent);text-decoration:underline;">Python functools.lru_cache ↗</a></span>
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="color:var(--accent);text-decoration:underline;">C++ unordered_map ↗</a></span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 피보나치 호출 트리: 중복을 눈으로 확인!</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">fib(N)을 재귀로 호출하면 같은 값이 여러 번 호출됩니다. <strong style="color:var(--red);">빨간색</strong>으로 표시된 노드가 중복 호출입니다!</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-calltree-input" value="5" min="3" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-calltree-go">호출 트리 보기</button>
                        <button class="concept-demo-btn green" id="dp-demo-calltree-reset" style="display:none;">다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-calltree-viz" style="overflow-x:auto;padding:10px 0;"></div>
                        <div id="dp-demo-calltree-stats" style="text-align:center;font-size:0.9rem;color:var(--text2);margin-top:8px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-calltree-msg">중복 부분 문제: 같은 fib(k)가 여러 번 호출됩니다. DP는 이 중복을 제거합니다!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 재귀 vs DP: 중복 제거 체험</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">같은 fib(N)을 <strong>단순 재귀</strong>로 풀 때와 <strong>DP(메모이제이션)</strong>으로 풀 때, 함수 호출이 얼마나 달라지는지 직접 비교합니다.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-recvsdp-input" value="5" min="3" max="7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-recvsdp-rec" style="background:var(--red);color:white;">재귀로 풀기</button>
                        <button class="concept-demo-btn" id="dp-demo-recvsdp-dp" style="background:var(--green);color:white;">DP로 풀기</button>
                        <button class="concept-demo-btn green" id="dp-demo-recvsdp-reset" style="display:none;">다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start;">
                            <div style="flex:1;min-width:200px;">
                                <div style="font-weight:600;margin-bottom:6px;font-size:0.9rem;">호출 로그</div>
                                <div id="dp-demo-recvsdp-log" style="font-size:0.8rem;color:var(--text2);max-height:180px;overflow-y:auto;padding:8px 10px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);min-height:60px;"></div>
                            </div>
                            <div style="flex:0 0 auto;min-width:140px;text-align:center;">
                                <div style="font-weight:600;margin-bottom:6px;font-size:0.9rem;">메모 테이블</div>
                                <div id="dp-demo-recvsdp-memo" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:44px;"></div>
                            </div>
                        </div>
                        <div id="dp-demo-recvsdp-counter" style="text-align:center;font-size:1rem;font-weight:700;margin-top:12px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-recvsdp-msg">재귀: 같은 계산을 반복합니다. DP: 한 번 계산하면 저장해서 다시 쓰니까 호출 횟수가 확 줄어듭니다!</div>
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

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 계단 오르기 4단계</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">1칸 또는 2칸씩 올라갈 수 있을 때, 각 계단까지 가는 방법의 수를 구합니다.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">계단 수:
                            <input type="number" id="dp-demo-stair-input" value="6" min="2" max="10" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-stair-go">채우기 시작</button>
                        <button class="concept-demo-btn green" id="dp-demo-stair-reset" style="display:none;">다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="dp-demo-stair-viz" style="display:flex;align-items:flex-end;gap:6px;flex-wrap:wrap;min-height:120px;padding-bottom:10px;"></div>
                        <div id="dp-demo-stair-formula" style="text-align:center;font-size:0.95rem;color:var(--text);font-weight:600;min-height:1.5em;margin-top:8px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-stair-msg">dp[i] = dp[i-1] + dp[i-2]. i번째 계단은 (i-1)에서 1칸 올라오거나 (i-2)에서 2칸 올라오는 두 가지!</div>
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

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — Top-Down vs Bottom-Up</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">같은 fib(N)을 두 방식으로 풀 때, 계산 순서가 어떻게 다른지 비교합니다.</p>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <label style="font-weight:600;font-size:0.9rem;">N:
                            <input type="number" id="dp-demo-compare-input" value="6" min="3" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">
                        </label>
                        <button class="concept-demo-btn" id="dp-demo-compare-go">비교 시작</button>
                        <button class="concept-demo-btn green" id="dp-demo-compare-reset" style="display:none;">다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Top-Down (재귀+메모)</div>
                                <div id="dp-demo-td-cells" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;"></div>
                                <div id="dp-demo-td-log" style="font-size:0.8rem;color:var(--text2);min-height:3em;max-height:100px;overflow-y:auto;"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;">Bottom-Up (반복문)</div>
                                <div id="dp-demo-bu-cells" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;"></div>
                                <div id="dp-demo-bu-log" style="font-size:0.8rem;color:var(--text2);min-height:3em;max-height:100px;overflow-y:auto;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-compare-msg">Top-Down은 필요한 것만 계산하고, Bottom-Up은 작은 것부터 전부 계산합니다.</div>
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

                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — DP 유형 맞추기 퀴즈</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">문제 설명을 읽고 어떤 DP 유형인지 맞춰보세요!</p>
                    <div class="concept-demo-body">
                        <div id="dp-demo-quiz-cards" style="display:flex;flex-direction:column;gap:10px;"></div>
                        <div id="dp-demo-quiz-score" style="text-align:center;font-size:1rem;font-weight:600;margin-top:12px;min-height:1.5em;"></div>
                    </div>
                    <div class="concept-demo-msg" id="dp-demo-quiz-msg">문제를 클릭하면 정답이 나타납니다. 맞히면 초록, 틀리면 빨강!</div>
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

        // concept demos
        this._initConceptDemos(container);
    },

    _initConceptDemos(container) {
        var self = this;

        // === Demo 1: 피보나치 메모이제이션 테이블 ===
        {
            var fibGoBtn = container.querySelector('#dp-demo-fib-go');
            var fibResetBtn = container.querySelector('#dp-demo-fib-reset');
            var fibInput = container.querySelector('#dp-demo-fib-input');
            var fibTable = container.querySelector('#dp-demo-fib-table');
            var fibFormula = container.querySelector('#dp-demo-fib-formula');
            var fibMsg = container.querySelector('#dp-demo-fib-msg');

            function cellStyle(state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--bg2)');
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--border)');
                var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 10px var(--yellow)50;transform:scale(1.08);' : '';
                return 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:52px;height:52px;border-radius:10px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.9rem;transition:all 0.3s;' + shadow;
            }

            function renderCells(n, dp, activeIdx) {
                fibTable.innerHTML = '';
                for (var i = 1; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (dp[i] !== undefined ? 'done' : 'empty');
                    var div = document.createElement('div');
                    div.style.cssText = cellStyle(state);
                    div.innerHTML = '<div style="font-size:0.65rem;opacity:0.7;">dp[' + i + ']</div><div>' + (dp[i] !== undefined ? dp[i] : '?') + '</div>';
                    fibTable.appendChild(div);
                }
            }

            fibGoBtn.addEventListener('click', function() {
                fibGoBtn.style.display = 'none';
                fibResetBtn.style.display = '';
                var n = Math.max(3, Math.min(12, parseInt(fibInput.value) || 8));
                var dp = {};
                dp[1] = 1; dp[2] = 1;
                renderCells(n, dp);
                fibFormula.textContent = 'dp[1] = 1, dp[2] = 1 (초기값 설정)';

                var idx = 3;
                function nextFill() {
                    if (idx > n) {
                        renderCells(n, dp);
                        fibFormula.innerHTML = 'fib(' + n + ') = <strong style="color:var(--green);">' + dp[n] + '</strong>';
                        fibMsg.textContent = '완료! dp 테이블을 작은 것부터 채워서 fib(' + n + ')을 구했습니다.';
                        return;
                    }
                    renderCells(n, dp, idx);
                    fibFormula.textContent = 'dp[' + idx + '] = dp[' + (idx - 1) + '](' + dp[idx - 1] + ') + dp[' + (idx - 2) + '](' + dp[idx - 2] + ') = ' + (dp[idx - 1] + dp[idx - 2]);
                    setTimeout(function() {
                        dp[idx] = dp[idx - 1] + dp[idx - 2];
                        renderCells(n, dp);
                        idx++;
                        setTimeout(nextFill, 450);
                    }, 400);
                }
                setTimeout(nextFill, 600);
            });

            fibResetBtn.addEventListener('click', function() {
                fibGoBtn.style.display = '';
                fibResetBtn.style.display = 'none';
                fibTable.innerHTML = '';
                fibFormula.textContent = '';
                fibMsg.textContent = 'dp[i] = dp[i-1] + dp[i-2]. 작은 값부터 채워나갑니다.';
            });
        }

        // === Demo 2: 계단 오르기 ===
        {
            var stairGoBtn = container.querySelector('#dp-demo-stair-go');
            var stairResetBtn = container.querySelector('#dp-demo-stair-reset');
            var stairInput = container.querySelector('#dp-demo-stair-input');
            var stairViz = container.querySelector('#dp-demo-stair-viz');
            var stairFormula = container.querySelector('#dp-demo-stair-formula');
            var stairMsg = container.querySelector('#dp-demo-stair-msg');

            function renderStairs(n, dp, activeIdx) {
                stairViz.innerHTML = '';
                for (var i = 0; i <= n; i++) {
                    var h = 30 + i * 14;
                    var state = (i === activeIdx) ? 'active' : (dp[i] !== undefined ? 'done' : 'empty');
                    var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--accent)' : 'var(--bg3)');
                    var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                    var shadow = state === 'active' ? 'box-shadow:0 0 12px var(--yellow)50;' : '';
                    var div = document.createElement('div');
                    div.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;width:50px;height:' + h + 'px;background:' + bg + ';border-radius:8px 8px 0 0;color:' + color + ';font-weight:700;padding-bottom:6px;transition:all 0.3s;' + shadow;
                    div.innerHTML = '<div style="font-size:0.65rem;opacity:0.8;">' + (i === 0 ? '바닥' : i + '칸') + '</div><div style="font-size:0.9rem;">' + (dp[i] !== undefined ? dp[i] : '?') + '</div>';
                    stairViz.appendChild(div);
                }
            }

            stairGoBtn.addEventListener('click', function() {
                stairGoBtn.style.display = 'none';
                stairResetBtn.style.display = '';
                var n = Math.max(2, Math.min(10, parseInt(stairInput.value) || 6));
                var dp = {};
                dp[0] = 1; dp[1] = 1;
                renderStairs(n, dp);
                stairFormula.textContent = 'dp[0] = 1 (바닥), dp[1] = 1 (1가지 방법)';

                var idx = 2;
                function nextStep() {
                    if (idx > n) {
                        renderStairs(n, dp);
                        stairFormula.innerHTML = n + '칸까지 가는 방법: <strong style="color:var(--green);">' + dp[n] + '가지</strong>';
                        stairMsg.textContent = '완료! 각 계단의 방법 수 = 바로 아래(1칸) + 두 칸 아래(2칸)의 합입니다.';
                        return;
                    }
                    renderStairs(n, dp, idx);
                    dp[idx] = dp[idx - 1] + dp[idx - 2];
                    stairFormula.textContent = 'dp[' + idx + '] = dp[' + (idx - 1) + '](' + dp[idx - 1] + ') + dp[' + (idx - 2) + '](' + dp[idx - 2] + ') = ' + dp[idx];
                    setTimeout(function() {
                        renderStairs(n, dp);
                        idx++;
                        setTimeout(nextStep, 450);
                    }, 400);
                }
                setTimeout(nextStep, 600);
            });

            stairResetBtn.addEventListener('click', function() {
                stairGoBtn.style.display = '';
                stairResetBtn.style.display = 'none';
                stairViz.innerHTML = '';
                stairFormula.textContent = '';
                stairMsg.textContent = 'dp[i] = dp[i-1] + dp[i-2]. i번째 계단은 (i-1)에서 1칸 올라오거나 (i-2)에서 2칸 올라오는 두 가지!';
            });
        }

        // === Demo 3: Top-Down vs Bottom-Up 비교 ===
        {
            var cmpGoBtn = container.querySelector('#dp-demo-compare-go');
            var cmpResetBtn = container.querySelector('#dp-demo-compare-reset');
            var cmpInput = container.querySelector('#dp-demo-compare-input');
            var tdCells = container.querySelector('#dp-demo-td-cells');
            var buCells = container.querySelector('#dp-demo-bu-cells');
            var tdLog = container.querySelector('#dp-demo-td-log');
            var buLog = container.querySelector('#dp-demo-bu-log');
            var cmpMsg = container.querySelector('#dp-demo-compare-msg');

            function cmpCellStyle(state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : (state === 'memo' ? 'var(--accent)' : 'var(--bg2)'));
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : (state === 'memo' ? 'var(--accent)' : 'var(--border)'));
                var color = state !== 'empty' ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 8px var(--yellow)50;' : '';
                return 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.8rem;transition:all 0.3s;' + shadow;
            }

            function renderCmpCells(el, n, vals, activeIdx) {
                el.innerHTML = '';
                for (var i = 1; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (vals[i] !== undefined ? 'done' : 'empty');
                    var div = document.createElement('div');
                    div.style.cssText = cmpCellStyle(state);
                    div.innerHTML = '<div style="font-size:0.6rem;opacity:0.7;">[' + i + ']</div>' + (vals[i] !== undefined ? vals[i] : '?');
                    el.appendChild(div);
                }
            }

            cmpGoBtn.addEventListener('click', function() {
                cmpGoBtn.style.display = 'none';
                cmpResetBtn.style.display = '';
                var n = Math.max(3, Math.min(8, parseInt(cmpInput.value) || 6));
                var tdVals = {}, buVals = {};
                tdLog.innerHTML = '';
                buLog.innerHTML = '';
                renderCmpCells(tdCells, n, tdVals);
                renderCmpCells(buCells, n, buVals);

                // Bottom-Up: straightforward i=1..n
                var buSteps = [];
                buSteps.push({ i: 1, val: 1, log: 'dp[1] = 1 (초기값)' });
                buSteps.push({ i: 2, val: 1, log: 'dp[2] = 1 (초기값)' });
                for (var bi = 3; bi <= n; bi++) {
                    var bprev = buSteps[bi - 2].val, bprev2 = buSteps[bi - 3].val;
                    buSteps.push({ i: bi, val: bprev + bprev2, log: 'dp[' + bi + '] = dp[' + (bi - 1) + '] + dp[' + (bi - 2) + '] = ' + (bprev + bprev2) });
                }

                // Top-Down: simulate recursive call order for fib(n) with memoization
                var tdSteps = [];
                var memo = {};
                function simTD(x) {
                    if (memo[x] !== undefined) {
                        tdSteps.push({ i: x, val: memo[x], log: 'fib(' + x + ') = memo[' + x + '] = ' + memo[x] + ' (저장됨!)' });
                        return memo[x];
                    }
                    if (x <= 2) { memo[x] = 1; tdSteps.push({ i: x, val: 1, log: 'fib(' + x + ') = 1 (기저)' }); return 1; }
                    var a = simTD(x - 1);
                    var b = simTD(x - 2);
                    memo[x] = a + b;
                    tdSteps.push({ i: x, val: a + b, log: 'fib(' + x + ') = ' + a + ' + ' + b + ' = ' + (a + b) });
                    return a + b;
                }
                simTD(n);

                var maxSteps = Math.max(tdSteps.length, buSteps.length);
                var step = 0;
                var tdDone = {}, buDone2 = {};

                function animateStep() {
                    if (step >= maxSteps) {
                        cmpMsg.textContent = 'Top-Down: ' + tdSteps.length + '단계, Bottom-Up: ' + buSteps.length + '단계. 결과는 같지만 계산 순서가 다릅니다!';
                        return;
                    }
                    if (step < tdSteps.length) {
                        var ts = tdSteps[step];
                        tdDone[ts.i] = ts.val;
                        renderCmpCells(tdCells, n, tdDone, ts.i);
                        tdLog.innerHTML += '<div>' + ts.log + '</div>';
                        tdLog.scrollTop = tdLog.scrollHeight;
                    }
                    if (step < buSteps.length) {
                        var bs = buSteps[step];
                        buDone2[bs.i] = bs.val;
                        renderCmpCells(buCells, n, buDone2, bs.i);
                        buLog.innerHTML += '<div>' + bs.log + '</div>';
                        buLog.scrollTop = buLog.scrollHeight;
                    }
                    step++;
                    setTimeout(animateStep, 600);
                }
                animateStep();
            });

            cmpResetBtn.addEventListener('click', function() {
                cmpGoBtn.style.display = '';
                cmpResetBtn.style.display = 'none';
                tdCells.innerHTML = '';
                buCells.innerHTML = '';
                tdLog.innerHTML = '';
                buLog.innerHTML = '';
                cmpMsg.textContent = 'Top-Down은 필요한 것만 계산하고, Bottom-Up은 작은 것부터 전부 계산합니다.';
            });
        }

        // === Demo 4: DP 유형 맞추기 퀴즈 ===
        {
            var quizData = [
                { q: '피보나치 수열의 N번째 값 구하기', answer: '1차원 DP', options: ['1차원 DP', '2차원 DP', 'LIS', '배낭'] },
                { q: '삼각형 꼭대기에서 바닥까지 최대 합 경로', answer: '2차원 DP', options: ['1차원 DP', '2차원 DP', 'LCS', '배낭'] },
                { q: '수열에서 가장 긴 증가하는 부분 수열의 길이', answer: 'LIS', options: ['1차원 DP', 'LIS', 'LCS', '배낭'] },
                { q: '두 문자열의 가장 긴 공통 부분 수열의 길이', answer: 'LCS', options: ['1차원 DP', 'LIS', 'LCS', '2차원 DP'] },
                { q: '무게 제한이 있는 가방에 물건을 넣어 최대 가치 구하기', answer: '배낭', options: ['1차원 DP', '2차원 DP', 'LCS', '배낭'] }
            ];
            var quizCards = container.querySelector('#dp-demo-quiz-cards');
            var quizScore = container.querySelector('#dp-demo-quiz-score');
            var quizMsgEl = container.querySelector('#dp-demo-quiz-msg');
            var totalCorrect = 0, totalAnswered = 0;

            quizData.forEach(function(item, qIdx) {
                var card = document.createElement('div');
                card.style.cssText = 'padding:14px 18px;border-radius:12px;border:2px solid var(--border);background:var(--bg2);transition:all 0.3s;';
                var qDiv = document.createElement('div');
                qDiv.style.cssText = 'font-weight:600;font-size:0.95rem;margin-bottom:10px;color:var(--text);';
                qDiv.textContent = (qIdx + 1) + '. ' + item.q;
                card.appendChild(qDiv);
                var optWrap = document.createElement('div');
                optWrap.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';

                item.options.forEach(function(opt) {
                    var btn = document.createElement('button');
                    btn.style.cssText = 'padding:6px 14px;border-radius:8px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:0.85rem;cursor:pointer;transition:all 0.2s;';
                    btn.textContent = opt;
                    btn.addEventListener('click', function() {
                        if (card.dataset.answered) return;
                        card.dataset.answered = 'true';
                        totalAnswered++;
                        var correct = (opt === item.answer);
                        if (correct) {
                            totalCorrect++;
                            btn.style.background = 'var(--green)';
                            btn.style.color = 'white';
                            btn.style.borderColor = 'var(--green)';
                            card.style.borderColor = 'var(--green)';
                        } else {
                            btn.style.background = 'var(--red)';
                            btn.style.color = 'white';
                            btn.style.borderColor = 'var(--red)';
                            card.style.borderColor = 'var(--red)';
                            // highlight correct
                            optWrap.querySelectorAll('button').forEach(function(b) {
                                if (b.textContent === item.answer) {
                                    b.style.background = 'var(--green)';
                                    b.style.color = 'white';
                                    b.style.borderColor = 'var(--green)';
                                }
                            });
                        }
                        quizScore.innerHTML = totalCorrect + ' / ' + totalAnswered + ' 정답' + (totalAnswered === quizData.length ? ' — ' + (totalCorrect === quizData.length ? '<span style="color:var(--green);">전부 맞았습니다!</span>' : '<span style="color:var(--accent);">다시 도전해보세요!</span>') : '');
                    });
                    optWrap.appendChild(btn);
                });
                card.appendChild(optWrap);
                quizCards.appendChild(card);
            });
        }

        // === Demo 5: 피보나치 호출 트리 (중복 부분 문제 시각화) ===
        {
            var ctGoBtn = container.querySelector('#dp-demo-calltree-go');
            var ctResetBtn = container.querySelector('#dp-demo-calltree-reset');
            var ctInput = container.querySelector('#dp-demo-calltree-input');
            var ctViz = container.querySelector('#dp-demo-calltree-viz');
            var ctStats = container.querySelector('#dp-demo-calltree-stats');
            var ctMsg = container.querySelector('#dp-demo-calltree-msg');

            function buildTree(n) {
                if (n <= 1) return { val: n, left: null, right: null };
                return { val: n, left: buildTree(n - 1), right: buildTree(n - 2) };
            }

            function countCalls(node, counts) {
                if (!node) return;
                counts[node.val] = (counts[node.val] || 0) + 1;
                countCalls(node.left, counts);
                countCalls(node.right, counts);
            }

            function totalNodes(node) {
                if (!node) return 0;
                return 1 + totalNodes(node.left) + totalNodes(node.right);
            }

            function renderTree(node, counts, depth) {
                if (!node) return '';
                var isDup = counts[node.val] > 1;
                var bg = isDup ? 'var(--red)' : 'var(--green)';
                var glow = isDup ? 'box-shadow:0 0 8px var(--red);' : '';
                var label = isDup ? ' title="중복! ' + counts[node.val] + '번 호출"' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                html += '<div' + label + ' style="display:inline-flex;align-items:center;justify-content:center;width:' + (depth > 4 ? 32 : 38) + 'px;height:' + (depth > 4 ? 32 : 38) + 'px;border-radius:50%;background:' + bg + ';color:white;font-weight:700;font-size:' + (depth > 4 ? '0.7' : '0.8') + 'rem;' + glow + 'cursor:default;">f(' + node.val + ')</div>';
                if (node.left || node.right) {
                    html += '<div style="width:1px;height:8px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:' + Math.max(2, 12 - depth * 2) + 'px;">';
                    if (node.left) html += renderTree(node.left, counts, depth + 1);
                    if (node.right) html += renderTree(node.right, counts, depth + 1);
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }

            if (ctGoBtn) ctGoBtn.addEventListener('click', function() {
                ctGoBtn.style.display = 'none';
                ctResetBtn.style.display = '';
                var n = Math.max(3, Math.min(7, parseInt(ctInput.value) || 5));
                var tree = buildTree(n);
                var counts = {};
                countCalls(tree, counts);
                var total = totalNodes(tree);
                var dupCount = 0;
                for (var k in counts) if (counts[k] > 1) dupCount += (counts[k] - 1);
                ctViz.innerHTML = renderTree(tree, counts, 0);
                ctStats.innerHTML = '총 <strong>' + total + '</strong>번 호출 중 <strong style="color:var(--red);">' + dupCount + '</strong>번이 중복! DP로 저장하면 <strong style="color:var(--green);">' + (n + 1) + '</strong>번이면 충분합니다.';
                ctMsg.textContent = '빨간 노드가 중복 호출입니다. N이 커질수록 중복이 폭발적으로 늘어납니다!';
            });

            if (ctResetBtn) ctResetBtn.addEventListener('click', function() {
                ctGoBtn.style.display = '';
                ctResetBtn.style.display = 'none';
                ctViz.innerHTML = '';
                ctStats.innerHTML = '';
                ctMsg.textContent = '중복 부분 문제: 같은 fib(k)가 여러 번 호출됩니다. DP는 이 중복을 제거합니다!';
            });
        }

        // === Demo 6: 재귀 vs DP 중복 제거 체험 ===
        {
            var rvdRecBtn = container.querySelector('#dp-demo-recvsdp-rec');
            var rvdDpBtn = container.querySelector('#dp-demo-recvsdp-dp');
            var rvdResetBtn = container.querySelector('#dp-demo-recvsdp-reset');
            var rvdInput = container.querySelector('#dp-demo-recvsdp-input');
            var rvdLog = container.querySelector('#dp-demo-recvsdp-log');
            var rvdMemo = container.querySelector('#dp-demo-recvsdp-memo');
            var rvdCounter = container.querySelector('#dp-demo-recvsdp-counter');
            var rvdMsg = container.querySelector('#dp-demo-recvsdp-msg');
            var rvdTimer = null;

            function rvdMemoCell(i, val, state) {
                var bg = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--bg2)');
                var border = state === 'active' ? 'var(--yellow)' : (state === 'done' ? 'var(--green)' : 'var(--border)');
                var color = (state === 'active' || state === 'done') ? 'white' : 'var(--text3)';
                var shadow = state === 'active' ? 'box-shadow:0 0 8px var(--yellow)50;transform:scale(1.08);' : '';
                return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:44px;height:44px;border-radius:8px;border:2px solid ' + border + ';background:' + bg + ';color:' + color + ';font-weight:700;font-size:0.8rem;transition:all 0.3s;' + shadow + '"><div style="font-size:0.6rem;opacity:0.7;">[' + i + ']</div>' + (val !== undefined ? val : '?') + '</div>';
            }

            function rvdRenderMemo(n, memo, activeIdx) {
                var html = '';
                for (var i = 0; i <= n; i++) {
                    var state = (i === activeIdx) ? 'active' : (memo[i] !== undefined ? 'done' : 'empty');
                    html += rvdMemoCell(i, memo[i], state);
                }
                rvdMemo.innerHTML = html;
            }

            function rvdReset() {
                if (rvdTimer) clearTimeout(rvdTimer);
                rvdTimer = null;
                rvdRecBtn.style.display = '';
                rvdDpBtn.style.display = '';
                rvdResetBtn.style.display = 'none';
                rvdLog.innerHTML = '';
                rvdMemo.innerHTML = '';
                rvdCounter.innerHTML = '';
                rvdMsg.textContent = '재귀: 같은 계산을 반복합니다. DP: 한 번 계산하면 저장해서 다시 쓰니까 호출 횟수가 확 줄어듭니다!';
            }

            // 재귀 호출 순서를 추적하는 함수
            function rvdTraceRecursive(n) {
                var calls = [];
                function fib(x, depth) {
                    var indent = '';
                    for (var d = 0; d < depth; d++) indent += '&nbsp;&nbsp;';
                    if (x <= 1) {
                        calls.push({ text: indent + 'fib(' + x + ') = ' + x + ' <span style="color:var(--green);">(기저)</span>', val: x, idx: x, isDup: false });
                        return x;
                    }
                    calls.push({ text: indent + 'fib(' + x + ') 호출...', val: undefined, idx: x, isDup: false, isCall: true });
                    var a = fib(x - 1, depth + 1);
                    var b = fib(x - 2, depth + 1);
                    calls.push({ text: indent + 'fib(' + x + ') = ' + a + ' + ' + b + ' = <strong>' + (a + b) + '</strong>', val: a + b, idx: x, isDup: false });
                    return a + b;
                }
                fib(n, 0);
                // 중복 표시: 같은 fib(x)가 2번 이상 호출되면 표시
                var seen = {};
                for (var i = 0; i < calls.length; i++) {
                    if (calls[i].isCall) {
                        if (seen[calls[i].idx]) calls[i].isDup = true;
                        seen[calls[i].idx] = true;
                    }
                }
                return calls;
            }

            // DP 호출 순서를 추적하는 함수
            function rvdTraceDP(n) {
                var calls = [];
                var memo = {};
                function fib(x, depth) {
                    var indent = '';
                    for (var d = 0; d < depth; d++) indent += '&nbsp;&nbsp;';
                    if (memo[x] !== undefined) {
                        calls.push({ text: indent + 'fib(' + x + ') → memo[' + x + '] = ' + memo[x] + ' <span style="color:var(--accent);font-weight:600;">저장된 값!</span>', val: memo[x], idx: x, isMemo: true });
                        return memo[x];
                    }
                    if (x <= 1) {
                        memo[x] = x;
                        calls.push({ text: indent + 'fib(' + x + ') = ' + x + ' <span style="color:var(--green);">(기저) → 저장</span>', val: x, idx: x, save: true });
                        return x;
                    }
                    calls.push({ text: indent + 'fib(' + x + ') 호출...', val: undefined, idx: x, isCall: true });
                    var a = fib(x - 1, depth + 1);
                    var b = fib(x - 2, depth + 1);
                    memo[x] = a + b;
                    calls.push({ text: indent + 'fib(' + x + ') = ' + a + ' + ' + b + ' = <strong>' + (a + b) + '</strong> → <span style="color:var(--green);">저장!</span>', val: a + b, idx: x, save: true });
                    return a + b;
                }
                fib(n, 0);
                return { calls: calls, memo: memo };
            }

            function rvdAnimate(steps, isDP) {
                rvdRecBtn.style.display = 'none';
                rvdDpBtn.style.display = 'none';
                rvdResetBtn.style.display = '';
                rvdLog.innerHTML = '';
                rvdMemo.innerHTML = '';
                var n = Math.max(3, Math.min(7, parseInt(rvdInput.value) || 5));
                var memoState = {};
                if (isDP) rvdRenderMemo(n, memoState);
                var callCount = 0;
                var idx = 0;

                var traceData = isDP ? rvdTraceDP(n) : { calls: rvdTraceRecursive(n) };
                var allCalls = traceData.calls || traceData;

                function tick() {
                    if (idx >= allCalls.length) {
                        var label = isDP ? 'DP(메모이제이션)' : '단순 재귀';
                        rvdCounter.innerHTML = label + ': 총 <strong>' + callCount + '</strong>번 호출';
                        if (isDP) {
                            rvdMsg.innerHTML = 'DP는 이미 저장된 값을 바로 꺼내 쓰므로 <strong style="color:var(--green);">호출 횟수가 대폭 줄어듭니다</strong>!';
                        } else {
                            rvdMsg.innerHTML = '같은 값을 여러 번 계산합니다. 이제 <strong>"DP로 풀기"</strong>를 눌러 비교해보세요!';
                            rvdRecBtn.style.display = 'none';
                            rvdDpBtn.style.display = '';
                        }
                        return;
                    }
                    var step = allCalls[idx];
                    callCount++;
                    var color = step.isDup ? 'color:var(--red);' : (step.isMemo ? 'color:var(--accent);' : '');
                    var dupTag = step.isDup ? ' <span style="color:var(--red);font-weight:600;">← 중복!</span>' : '';
                    rvdLog.innerHTML += '<div style="' + color + '">' + step.text + dupTag + '</div>';
                    rvdLog.scrollTop = rvdLog.scrollHeight;

                    if (isDP && (step.save || step.isMemo) && step.val !== undefined) {
                        memoState[step.idx] = step.val;
                        rvdRenderMemo(n, memoState, step.isMemo ? undefined : step.idx);
                    }

                    rvdCounter.innerHTML = (isDP ? 'DP' : '재귀') + ': <strong>' + callCount + '</strong>번째 호출';
                    idx++;
                    rvdTimer = setTimeout(tick, 350);
                }
                tick();
            }

            if (rvdRecBtn) rvdRecBtn.addEventListener('click', function() {
                rvdAnimate(null, false);
            });
            if (rvdDpBtn) rvdDpBtn.addEventListener('click', function() {
                rvdAnimate(null, true);
            });
            if (rvdResetBtn) rvdResetBtn.addEventListener('click', rvdReset);
        }
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
    // 시뮬레이션 1: 피보나치 수 1 (boj-24416)
    // ====================================================================
    _renderVizFib1(container) {
        var self = this, suffix = '-fib1';
        var DEFAULT_N = 5;

        function fibVal(n) { if (n <= 2) return 1; var a=1,b=1; for(var i=3;i<=n;i++){var t=a+b;a=b;b=t;} return b; }

        // SVG 기반 재귀 호출 트리 생성 (n이 작을 때만 표시, 큰 경우 텍스트만)
        function buildCallTree(n) {
            var nodes = [], edges = [], nodeId = 0;
            function layout(val, depth, xCenter, xSpan) {
                var id = nodeId++;
                nodes.push({ id: id, val: val, x: xCenter, y: depth * 50 + 24, depth: depth });
                if (val <= 1) return id;
                var leftId = layout(val - 1, depth + 1, xCenter - xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: leftId });
                var rightId = layout(val - 2, depth + 1, xCenter + xSpan / 2, xSpan / 2);
                edges.push({ from: id, to: rightId });
                return id;
            }
            var totalWidth = Math.max(300, Math.pow(2, Math.min(n, 7)) * 32);
            var totalHeight = (Math.min(n, 7) + 1) * 50 + 16;
            layout(n, 0, totalWidth / 2, totalWidth / 3);
            return { nodes: nodes, edges: edges, width: totalWidth, height: totalHeight };
        }

        function renderCallTreeSVG(tree) {
            var svgNS = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', tree.width);
            svg.setAttribute('height', tree.height);
            svg.style.cssText = 'display:block;margin:0 auto;';
            // edges
            for (var e = 0; e < tree.edges.length; e++) {
                var fromN = tree.nodes[tree.edges[e].from];
                var toN = tree.nodes[tree.edges[e].to];
                var line = document.createElementNS(svgNS, 'line');
                line.setAttribute('x1', fromN.x); line.setAttribute('y1', fromN.y + 12);
                line.setAttribute('x2', toN.x); line.setAttribute('y2', toN.y - 12);
                line.setAttribute('stroke', 'var(--border)'); line.setAttribute('stroke-width', '1.5');
                svg.appendChild(line);
            }
            // nodes — 중복 호출은 빨간색으로 표시
            var seen = {};
            for (var i = 0; i < tree.nodes.length; i++) {
                var nd = tree.nodes[i];
                var isDup = seen[nd.val] === true;
                seen[nd.val] = true;
                var g = document.createElementNS(svgNS, 'g');
                var circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', nd.x); circle.setAttribute('cy', nd.y);
                circle.setAttribute('r', 13);
                circle.setAttribute('fill', isDup ? 'rgba(214,48,49,0.15)' : 'var(--bg2)');
                circle.setAttribute('stroke', isDup ? 'var(--red)' : 'var(--border)');
                circle.setAttribute('stroke-width', isDup ? '2' : '1.5');
                g.appendChild(circle);
                var text = document.createElementNS(svgNS, 'text');
                text.setAttribute('x', nd.x); text.setAttribute('y', nd.y + 4);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', '10'); text.setAttribute('font-family', 'monospace');
                text.setAttribute('fill', isDup ? 'var(--red)' : 'var(--text)');
                text.textContent = 'f(' + nd.val + ')';
                g.appendChild(text);
                svg.appendChild(g);
            }
            return svg;
        }

        function renderDpTable(n) {
            var dp = [0, 1, 1];
            for (var i = 3; i <= n; i++) dp.push(dp[i-1] + dp[i-2]);
            var html = '<div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;">';
            for (var i = 1; i <= n; i++) {
                html += '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div style="font-size:0.65rem;color:var(--text3);">dp[' + i + ']</div>';
                html += '<div style="min-width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid var(--green);border-radius:8px;font-weight:700;font-size:0.85rem;background:rgba(0,184,148,0.1);color:var(--green);">' + dp[i] + '</div>';
                if (i >= 3) {
                    html += '<div style="font-size:0.6rem;color:var(--text3);">' + dp[i-1] + '+' + dp[i-2] + '</div>';
                }
                html += '</div>';
            }
            html += '</div>';
            return html;
        }

        function buildSteps(n, vizAreaEl, recValEl, dpValEl, infoEl) {
            var recCount = fibVal(n);
            var dpCount = Math.max(n - 2, 0);
            var bigN = Math.min(n + 20, 40);
            var bigRec = fibVal(bigN);
            var bigDp = Math.max(bigN - 2, 0);
            var ratio = bigDp > 0 ? Math.round(bigRec / bigDp) : 0;
            var showTree = (n <= 8); // 트리가 너무 커지지 않는 범위에서만 SVG 표시
            return [
                { description: 'fib(' + n + ')을 재귀로 구하면, <strong>같은 하위 문제를 반복 계산</strong>하기 때문에 호출 횟수가 기하급수적으로 늘어납니다.',
                  action: function() {
                      infoEl.innerHTML = '재귀: fib(' + n + ')=fib(' + (n-1) + ')+fib(' + (n-2) + '), ... 중복이 생깁니다.';
                      vizAreaEl.innerHTML = '<div style="text-align:center;color:var(--text2);padding:20px;font-size:0.9rem;">다음 스텝에서 재귀 호출 트리를 볼 수 있습니다.</div>';
                  },
                  undo: function() { infoEl.innerHTML = ''; vizAreaEl.innerHTML = ''; } },
                { description: '재귀는 fib(' + (n-1) + ')과 fib(' + (n-2) + ')을 <strong>각각 독립적으로 다시 계산</strong>하므로, 총 호출 수가 ' + recCount.toLocaleString() + '회나 됩니다. <span style="color:var(--red);">빨간 노드 = 중복 호출</span>',
                  action: function() {
                      recValEl.textContent = recCount.toLocaleString();
                      infoEl.innerHTML = '재귀 호출 트리의 리프(return 1) 개수 = <strong>' + recCount.toLocaleString() + '</strong>';
                      if (showTree) {
                          var tree = buildCallTree(n);
                          vizAreaEl.innerHTML = '<div style="font-weight:600;font-size:0.85rem;color:var(--red);margin-bottom:6px;text-align:center;">재귀 호출 트리 — 빨간 노드가 중복 호출</div>';
                          vizAreaEl.querySelector('div').style.overflow = 'auto';
                          vizAreaEl.appendChild(renderCallTreeSVG(tree));
                      } else {
                          vizAreaEl.innerHTML = '<div style="text-align:center;color:var(--red);padding:16px;font-size:0.9rem;">n=' + n + '이면 트리가 너무 커서 표시할 수 없습니다.<br>호출 수: <strong>' + recCount.toLocaleString() + '</strong>회!</div>';
                      }
                  },
                  undo: function() { recValEl.textContent = '?'; infoEl.innerHTML = ''; vizAreaEl.innerHTML = ''; } },
                { description: 'DP는 <strong>이미 계산한 값을 저장해두고 재사용</strong>하므로, 3부터 ' + n + '까지 단 ' + dpCount + '번의 덧셈이면 충분합니다.',
                  action: function() {
                      dpValEl.textContent = dpCount;
                      infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] → <strong>' + dpCount + '번</strong>';
                      vizAreaEl.innerHTML = '<div style="font-weight:600;font-size:0.85rem;color:var(--green);margin-bottom:6px;text-align:center;">DP 테이블 — 한 번씩만 계산</div>' + renderDpTable(n);
                  },
                  undo: function() { dpValEl.textContent = '?'; } },
                { description: 'n=' + bigN + '으로 늘리면? 재귀는 <strong>지수적으로 폭발</strong>(' + bigRec.toLocaleString() + '회)하지만, DP는 여전히 ' + bigDp + '번이면 끝납니다.',
                  action: function() {
                      infoEl.innerHTML = '<strong style="color:var(--green);">n=' + bigN + ': 재귀 ' + bigRec.toLocaleString() + '회 vs DP ' + bigDp + '회. DP가 ' + ratio.toLocaleString() + '배 빠릅니다!</strong>';
                      vizAreaEl.innerHTML = '<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;align-items:center;">' +
                          '<div style="text-align:center;padding:12px 20px;border:2px solid var(--red);border-radius:12px;background:rgba(214,48,49,0.05);"><div style="font-size:0.8rem;color:var(--red);font-weight:600;">재귀 (n=' + bigN + ')</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">' + bigRec.toLocaleString() + '회</div></div>' +
                          '<div style="font-size:1.5rem;color:var(--text3);">vs</div>' +
                          '<div style="text-align:center;padding:12px 20px;border:2px solid var(--green);border-radius:12px;background:rgba(0,184,148,0.05);"><div style="font-size:0.8rem;color:var(--green);font-weight:600;">DP (n=' + bigN + ')</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">' + bigDp + '회</div></div>' +
                          '</div>';
                  },
                  undo: function() { infoEl.innerHTML = 'DP: dp[3]=dp[2]+dp[1], ..., dp[' + n + '] → <strong>' + dpCount + '번</strong>'; } }
            ];
        }

        function init(n) {
            container.innerHTML =
                '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="dp-fib-n" value="' + n + '" min="3" max="40" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="dp-fib-reset">🔄</button>' +
                '</div>' +
                self._createStepDesc(suffix) +
                '<h3 style="margin-bottom:8px;">fib(' + n + ') 호출 횟수: 재귀 vs DP</h3>' +
                '<p style="color:var(--text2);margin-bottom:12px;">재귀는 중복 호출이 폭발하지만, DP는 n-2번이면 충분합니다.</p>' +
                '<div id="fib1-area' + suffix + '" style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;">' +
                '<div id="fib1-rec' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">재귀 호출 수</div><div id="fib1-rec-val' + suffix + '" style="font-size:2rem;color:var(--red);font-weight:700;">?</div></div>' +
                '<div id="fib1-dp' + suffix + '" style="text-align:center;"><div style="font-weight:600;margin-bottom:6px;">DP 연산 수</div><div id="fib1-dp-val' + suffix + '" style="font-size:2rem;color:var(--green);font-weight:700;">?</div></div>' +
                '</div>' +
                '<div id="fib1-viz' + suffix + '" style="overflow-x:auto;margin-bottom:12px;min-height:60px;"></div>' +
                '<div id="fib1-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
                self._createStepControls(suffix);
            var recValEl = container.querySelector('#fib1-rec-val' + suffix);
            var dpValEl = container.querySelector('#fib1-dp-val' + suffix);
            var vizAreaEl = container.querySelector('#fib1-viz' + suffix);
            var infoEl = container.querySelector('#fib1-info' + suffix);
            var steps = buildSteps(n, vizAreaEl, recValEl, dpValEl, infoEl);
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
                { description: 'w(' + a + ',' + b + ',' + c + ') 호출 — memo에 저장된 값이 없으므로, <strong>하위 문제로 분해</strong>하여 계산해야 합니다.',
                  action: function() { lines.push('→ w(' + a + ',' + b + ',' + c + ') 호출'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: subDesc,
                  action: function() { lines.push('  필요: ' + subCalls); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: '하위 호출 결과를 <strong>memo에 저장</strong>해두면, 나중에 같은 인자로 호출할 때 다시 계산하지 않고 바로 꺼내 씁니다.',
                  action: function() { lines.push('  ' + memoEntries + ' 저장!'); logEl.textContent = lines.join('\n'); },
                  undo: function() { lines.pop(); logEl.textContent = lines.join('\n'); } },
                { description: '하위 결과를 모두 조합하면 w(' + a + ',' + b + ',' + c + ') = ' + result + '. 이 값도 memo에 저장하여 <strong>이후 중복 호출을 방지</strong>합니다.',
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: 'dp[1]=0: 목표인 1에 <strong>이미 도달</strong>한 상태이므로 추가 연산이 필요 없습니다.',
              action: function() { setCell(1, '0', 'var(--accent)15'); infoEl.innerHTML = 'dp[1] = 0'; },
              undo: function() { resetCell(1); infoEl.innerHTML = ''; } });
            // Individual steps: fill each dp[k] separately
            for (var k = 2; k <= n - 1; k++) {
                (function(idx) {
                    var ops = [];
                    if (idx % 3 === 0) ops.push('÷3→dp[' + (idx/3) + ']=' + dp[idx/3]);
                    if (idx % 2 === 0) ops.push('÷2→dp[' + (idx/2) + ']=' + dp[idx/2]);
                    ops.push('-1→dp[' + (idx-1) + ']=' + dp[idx-1]);
                    var desc = idx + '를 1로 만드는 <strong>세 가지 역연산</strong>(÷3, ÷2, -1) 중 이전 결과가 가장 작은 경로를 택합니다. dp[' + idx + '] = min(' + ops.join(', ') + ')+1 = ' + dp[idx];
                    steps.push({
                        description: desc,
                        action: function() { setCell(idx, dp[idx], 'var(--accent)15'); infoEl.innerHTML = desc; },
                        undo: function() { resetCell(idx); }
                    });
                })(k);
            }
            // Final step: show answer and path
            var pathStr = path.join('→');
            steps.push({ description: '<strong>최종 답</strong>: ' + n + '→1까지 최소 ' + dp[n] + '번. 각 단계에서 가장 적은 연산을 쓰는 경로: ' + pathStr,
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: 'dp[1]=1: 길이 1인 수열은 <strong>"1" 하나</strong>뿐입니다. "0" 단독은 불가능하므로("00" 타일이니까).', action: function() { setTile(1,'1','#6c5ce715'); infoEl.innerHTML = 'dp[1]=1 (수열: 1)'; }, undo: function() { resetTile(1); infoEl.innerHTML=''; } });
            steps.push({ description: 'dp[2]=2: 길이 2인 수열은 <strong>"1"+"1" 또는 "00" 타일</strong> 두 가지. 이것이 기저 조건입니다.', action: function() { setTile(2,'2','#6c5ce715'); infoEl.innerHTML = 'dp[2]=2 (수열: 11, 00)'; }, undo: function() { resetTile(2); } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    steps.push({ description: 'dp[' + idx + ']: 끝에 <strong>"1"을 붙이면</strong> dp[' + (idx-1) + ']가지, <strong>"00"을 붙이면</strong> dp[' + (idx-2) + ']가지 → 합 = ' + dp[idx],
                      action: function() { setTile(idx, dp[idx], '#6c5ce715'); infoEl.innerHTML = 'dp[' + idx + ']=' + dp[idx-1] + '+' + dp[idx-2] + '=' + dp[idx]; },
                      undo: function() { resetTile(idx); } });
                })(i);
            }
            steps.push({ description: '<strong>최종 답</strong> dp[' + n + ']: 끝에 "1" 붙이기(' + dp[n-1] + '가지) + "00" 붙이기(' + dp[n-2] + '가지) = ' + dp[n],
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '기저: dp[1]=' + dp[1] + '(1번 계단만 밟음)' + (n>=2 ? ', dp[2]=' + dp[2] + '(1→2 연속 가능하므로 둘 다 밟음)' : ''),
              action: function() { setSt(1, dp[1], '#fdcb6e15'); if(n>=2) setSt(2, dp[2], '#fdcb6e15'); infoEl.innerHTML='dp[1]=' + sc[0] + (n>=2 ? ', dp[2]=' + sc[0] + '+' + sc[1] + '=' + dp[2] : ''); },
              undo: function() { resetSt(1); if(n>=2) resetSt(2); infoEl.innerHTML=''; } });
            if (n >= 3) {
                steps.push({ description: 'dp[3]: <strong>3연속 불가 규칙</strong> 때문에 1번 또는 2번 중 하나만 밟을 수 있음 → max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3],
                  action: function() { setSt(3, dp[3], '#fdcb6e15'); infoEl.innerHTML='dp[3]=max(' + sc[0] + ',' + sc[1] + ')+' + sc[2] + '=' + dp[3]; },
                  undo: function() { resetSt(3); } });
            }
            for (var i = 4; i < n; i++) {
                (function(idx) {
                    var opt1 = dp[idx-2] + sc[idx-1];
                    var opt2 = dp[idx-3] + sc[idx-2] + sc[idx-1];
                    steps.push({ description: 'dp[' + idx + ']: <strong>2칸 전에서 점프</strong>(dp[' + (idx-2) + ']+' + sc[idx-1] + '=' + opt1 + ') vs <strong>1칸 전 연속</strong>(dp[' + (idx-3) + ']+' + sc[idx-2] + '+' + sc[idx-1] + '=' + opt2 + ') 중 큰 값 = ' + dp[idx],
                      action: function() { setSt(idx, dp[idx], '#fdcb6e15'); infoEl.innerHTML='dp[' + idx + ']=max(' + opt1 + ',' + opt2 + ')=' + dp[idx]; },
                      undo: function() { resetSt(idx); } });
                })(i);
            }
            // Final step
            if (n >= 4) {
                var fopt1 = dp[n-2] + sc[n-1];
                var fopt2 = dp[n-3] + sc[n-2] + sc[n-1];
                steps.push({ description: '<strong>최종 답</strong> dp[' + n + ']: 2칸 전 점프(' + (dp[n-2]+sc[n-1]) + ') vs 1칸 전 연속(' + (dp[n-3]+sc[n-2]+sc[n-1]) + ') → 최대 점수 = ' + dp[n],
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '기저: dp[1]=' + dp[1] + '(첫 잔은 당연히 마심)' + (n>=2 ? ', dp[2]=' + dp[2] + '(2연속까지는 허용이므로 둘 다 마심)' : ''),
              action: function() { setWn(1, dp[1], '#00b89415'); if(n>=2) setWn(2, dp[2], '#00b89415'); infoEl.innerHTML='dp[1]=' + w[0] + (n>=2 ? ', dp[2]=' + w[0] + '+' + w[1] + '=' + dp[2] : ''); },
              undo: function() { resetWn(1); if(n>=2) resetWn(2); infoEl.innerHTML=''; } });
            for (var i = 3; i < n; i++) {
                (function(idx) {
                    var o1 = dp[idx-1], o2 = dp[idx-2] + w[idx-1], o3 = dp[idx-3] + w[idx-2] + w[idx-1];
                    steps.push({ description: 'dp[' + idx + ']: 3가지 선택 — ①<strong>이번 잔 안 마심</strong>(' + o1 + '), ②<strong>이번만 마심</strong>(한 칸 건너 dp[' + (idx-2) + ']+' + w[idx-1] + '=' + o2 + '), ③<strong>이전+이번 연속</strong>(dp[' + (idx-3) + ']+' + w[idx-2] + '+' + w[idx-1] + '=' + o3 + ') → max=' + dp[idx],
                      action: function() { setWn(idx, dp[idx], '#00b89415'); infoEl.innerHTML='dp[' + idx + ']=max(' + o1 + ', ' + o2 + ', ' + o3 + ')=' + dp[idx]; },
                      undo: function() { resetWn(idx); } });
                })(i);
            }
            // Final
            var fo1 = dp[n-1], fo2 = dp[n-2] + w[n-1], fo3 = (n>=3 ? dp[n-3] + w[n-2] + w[n-1] : 0);
            steps.push({ description: '<strong>최종 답</strong> dp[' + n + ']: 안 마심(' + fo1 + ') / 이번만(' + fo2 + ') / 연속(' + fo3 + ') 중 최대 = ' + dp[n],
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: 'dp[0]=' + a[0] + ': 첫 원소에서는 <strong>이전 구간이 없으므로</strong> 자기 자신이 곧 최대 연속합입니다.',
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
                    var details = [];
                    for (var k = s; k <= e; k++) {
                        var extended = (k > 0 ? curArr[k-1] + a[k] : a[k]);
                        var alone = a[k];
                        if (k > 0 && extended > alone) details.push('dp[' + k + ']: 이전 합에 이어감(' + extended + ')>' + alone + ' → ' + curArr[k]);
                        else if (k > 0) details.push('dp[' + k + ']: <strong>새로 시작</strong>이 유리(' + alone + '≥' + extended + ') → ' + curArr[k]);
                        else details.push('dp[' + k + ']=' + curArr[k]);
                    }
                    var desc = details.join(', ');
                    if (lastStep) desc += '. <strong>최종 답</strong>=' + res.ans;
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '기저: 길이 1인 계단수는 1~9 각각 1개. <strong>0으로 시작하는 수는 없으므로</strong> dp[1][0]=0.',
              action: function() { setEs(0,'0','var(--bg2)'); for(var j=1;j<=9;j++) setEs(j,'1','#0984e315'); infoEl.innerHTML='길이 1인 계단수: 1,2,...,9 (9개)'; },
              undo: function() { for(var j=0;j<=9;j++) resetEs(j); infoEl.innerHTML=''; } });
            // Steps for each length up to n
            for (var len = 2; len <= n; len++) {
                (function(l) {
                    var isLast = (l === n);
                    steps.push({ description: '길이 ' + l + ' 경계: 끝자리 0은 <strong>1에서만 내려올 수 있고</strong>(dp[' + l + '][0]=' + dpTable[l][0] + '), 끝자리 9는 <strong>8에서만 올라올 수 있음</strong>(dp[' + l + '][9]=' + dpTable[l][9] + ').',
                      action: function() { setEs(0, dpTable[l][0], '#0984e315'); setEs(9, dpTable[l][9], '#0984e315'); infoEl.innerHTML='끝0←1에서만=' + dpTable[l][0] + ', 끝9←8에서만=' + dpTable[l][9]; },
                      undo: function() { var prev = l > 1 ? dpTable[l-1] : null; setEs(0, prev ? prev[0] : '0', prev && prev[0] > 0 ? '#0984e315' : 'var(--bg2)'); setEs(9, prev ? prev[9] : '?', '#0984e315'); } });
                    steps.push({ description: '길이 ' + l + ', 끝자리 1~8: 인접한 <strong>두 자릿수(j-1, j+1)에서 올 수 있으므로</strong> 두 값의 합.',
                      action: function() { for(var j=1;j<=8;j++) setEs(j, dpTable[l][j], '#0984e315'); infoEl.innerHTML='끝1~8은 양쪽(j-1, j+1)에서 전이'; },
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '기저 — 집1: 이전 집이 없으므로 <strong>제약 없이</strong> 각 색의 비용이 그대로 dp 값이 됩니다. R=' + costs[0][0] + ', G=' + costs[0][1] + ', B=' + costs[0][2],
              action: function() { for(var j=0;j<3;j++) setRgb(0,j,costs[0][j]+'','#e8439315'); infoEl.innerHTML='첫 집은 제약 없이 비용 그대로'; },
              undo: function() { for(var j=0;j<3;j++) resetRgb(0,j); infoEl.innerHTML=''; } });
            // Each subsequent house
            for (var i = 1; i < n; i++) {
                (function(idx) {
                    var isLast = (idx === n - 1);
                    steps.push({ description: '집' + (idx+1) + ': <strong>이웃과 다른 색</strong>이어야 하므로, 각 색은 이전 집의 <em>나머지 두 색</em> 중 최소비용 + 자기 비용. R=' + dpArr[idx][0] + ', G=' + dpArr[idx][1] + ', B=' + dpArr[idx][2],
                      action: function() { for(var j=0;j<3;j++) setRgb(idx,j,dpArr[idx][j]+'','#e8439315'); infoEl.innerHTML='dp[' + (idx+1) + ']: 이전의 다른 색 최솟값 + 현재 비용'; },
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
            steps.push({ description: '<strong>최종 답</strong>: 마지막 집 R/G/B 중 최소 = ' + minVal + '. 이웃 색 제약을 만족하는 최적 경로: ' + pathStr,
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '기저: ' + n + '행(맨 아래)은 <strong>더 내려갈 곳이 없으므로</strong> 자기 자신이 곧 최대 합입니다.',
              action: function() { for(var j=0;j<tri[n-1].length;j++) setTri(n-1,j,tri[n-1][j],'#fab1a015'); infoEl.innerHTML='맨 아래 행: 자기 값이 곧 dp 값'; },
              undo: function() { for(var j=0;j<tri[n-1].length;j++) resetTri(n-1,j); infoEl.innerHTML=''; } });
            // Each row from bottom-1 to 1
            for (var i = n - 2; i >= 1; i--) {
                (function(row) {
                    var details = [];
                    for (var j = 0; j <= row; j++) details.push(tri[row][j] + '+max(' + dpArr[row+1][j] + ',' + dpArr[row+1][j+1] + ')=' + dpArr[row][j]);
                    steps.push({ description: (row+1) + '행: 각 칸은 <strong>아래 좌/우 자식 중 더 큰 합</strong>을 선택하여 자기 값을 더합니다. ' + details.join(', '),
                      action: function() { for(var j=0;j<=row;j++) setTri(row,j,dpArr[row][j],'#fab1a015'); infoEl.innerHTML=details.join(', '); },
                      undo: function() { for(var j=0;j<=row;j++) resetTri(row,j); } });
                })(i);
            }
            // Top: answer
            steps.push({ description: '<strong>꼭대기</strong>: ' + tri[0][0] + ' + max(' + dpArr[1][0] + ',' + dpArr[1][1] + ') = ' + dpArr[0][0] + '. 아래에서 올라온 최대 합이 여기에 모입니다.',
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
                self._createStepDesc(suffix) +
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
                    if (dp[idx] === 1) reason += ': 앞에 a[' + idx + ']=' + a[idx] + '보다 <strong>작은 수가 없어</strong> 자기 혼자 수열의 시작';
                    else {
                        for (var j = 0; j < idx; j++) {
                            if (a[j] < a[idx] && dp[j] + 1 === dp[idx]) { reason += ': a[' + j + ']=' + a[j] + '로 끝나는 증가 수열(길이 ' + dp[j] + ') <strong>뒤에 ' + a[idx] + '을 이을 수 있으므로</strong> +1'; break; }
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
            steps.push({ description: '<strong>최종 답</strong>: dp 배열의 최댓값이 LIS 길이 = ' + maxLen + '. 실제 수열: {' + lisVals.join(',') + '}',
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: '먼저 <strong>왼→우 LIS</strong>를 구합니다. 각 위치에서 "여기까지 올라올 수 있는 최대 길이"를 뜻합니다. [' + res.lis.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); infoEl.innerHTML='LIS 배열: [' + res.lis.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) resetBi(i); infoEl.innerHTML=''; } });
            steps.push({ description: '다음으로 <strong>우→좌 LIS(=LDS)</strong>를 구합니다. "여기서부터 내려갈 수 있는 최대 길이"입니다. [' + res.lds.join(',') + ']',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); infoEl.innerHTML='LDS 배열: [' + res.lds.join(',') + ']'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,'L:'+res.lis[i],'#a29bfe15'); } });
            steps.push({ description: '<strong>lis[i]+lds[i]-1</strong>: 각 위치를 꼭짓점으로 삼았을 때 "올라가는 길이 + 내려가는 길이 - 자기 자신 중복 제거". [' + res.sums.join(',') + '] → i=' + res.maxIdx + '이 최대(' + res.maxVal + ')',
              action: function() { for(var i=0;i<n;i++) setBi(i,res.sums[i],(res.sums[i]>=res.maxVal-1?'#a29bfe30':'#a29bfe15')); infoEl.innerHTML='합: [' + res.sums.join(',') + '] → i=' + res.maxIdx + '이 최대'; },
              undo: function() { for(var i=0;i<n;i++) setBi(i,res.lis[i]+'/'+res.lds[i],'#a29bfe15'); } });
            steps.push({ description: '<strong>최종 답</strong>: 꼭짓점 a[' + res.maxIdx + ']=' + a[res.maxIdx] + '을 기준으로 올라갔다 내려오는 최장 바이토닉 = ' + res.maxVal,
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
                self._createStepDesc(suffix) +
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
            steps.push({ description: 'A 기준으로 정렬하면 <strong>B의 순서가 증가하는 선끼리는 교차하지 않습니다</strong>. 따라서 B의 LIS = 최대 비교차 선 수.',
              action: function() { infoEl.innerHTML='B = [' + b.join(', ') + ']. B에서 LIS를 구하면 교차 없는 최대 선 수!'; },
              undo: function() { infoEl.innerHTML=''; } });
            // Fill dp individually — each element gets its own step
            for (var k = 0; k < n - 1; k++) {
                (function(idx) {
                    var comparisons = [];
                    for (var j = 0; j < idx; j++) {
                        if (b[j] < b[idx]) comparisons.push('B[' + j + ']=' + b[j] + '<' + b[idx]);
                    }
                    var desc = 'dp[' + idx + ']=' + dp[idx] + (comparisons.length ? ': ' + comparisons.join(', ') + ' → <strong>앞의 더 작은 B값 뒤에 이을 수 있음</strong>' : ': 앞에 더 작은 B값이 없어 <strong>혼자 시작</strong>');
                    steps.push({ description: desc,
                      action: function() { setWr(idx, dp[idx], '#55efc415'); infoEl.innerHTML = desc; },
                      undo: function() { resetWr(idx); } });
                })(k);
            }
            // Final
            var remove = n - res.lisLen;
            steps.push({ description: '<strong>최종 답</strong>: LIS=' + res.lisLen + '(교차 없는 최대 선 수). 전체 ' + n + '개에서 빼면 <strong>제거할 전깃줄 = ' + remove + '개</strong>.',
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
                self._createStepDesc(suffix) +
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
                        description: row + '행: A[' + row + ']="' + a[row-1] + '"를 B의 각 문자와 비교. ' + (matchCols.length > 0 ? '<strong>같은 글자를 찾으면</strong> 양쪽 이전 상태(대각선)+1, 다르면 왼쪽/위 중 큰 값 유지' : '매칭되는 글자가 없어 모두 왼쪽/위 중 큰 값 유지'),
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
                description: '<strong>최종 답</strong>: dp[' + n + '][' + m + ']=' + dp[n][m] + '. 두 문자열의 최장 공통 부분수열 길이 = ' + dp[n][m] + (lcsStr ? ' (LCS: ' + lcsStr + ')' : ''),
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
                self._createStepDesc(suffix) +
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
                        description: '물건' + (idx+1) + '(' + item.w + 'kg, 가치' + item.v + ') 고려: 용량 w에서 "<strong>이 물건을 넣을까 말까</strong>" 판단 — dp[w-' + item.w + ']+' + item.v + '이 기존 dp[w]보다 크면 갱신. ' + changeStr,
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
                description: '<strong>최종 답</strong>: 용량 ' + W + 'kg에서 담을 수 있는 최대 가치 = ' + finalDp[W] + '.' + (selDesc ? ' 선택: ' + selDesc : ''),
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
                self._createStepDesc(suffix) +
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
    <h4>입력</h4>
    <p>첫째 줄에 n이 주어진다. (5 ≤ n ≤ 40)</p>
    <h4>출력</h4>
    <p>첫째 줄에 재귀 호출의 기본 연산 횟수와 동적 프로그래밍의 기본 연산 횟수를 공백으로 구분하여 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '잠깐, 재귀에서 매번 카운트 변수를 따로 관리해야 할까요? 사실 잘 생각해보면, 재귀의 기본 연산 <code>return 1</code>이 실행되는 횟수는 곧 <strong>fib(n)의 값 자체</strong>예요! 리프 노드에 도달한 횟수 = fib(n)이니까요. 그러면 카운트를 따로 셀 필요 없이 그냥 fib(n) 값을 구하면 되는 거죠.<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;"><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text3);">재귀 기본 연산</div><div style="font-size:1.3rem;font-weight:700;color:var(--red);">fib(n) 값</div></div><div style="font-size:1.2rem;color:var(--text3);">vs</div><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text3);">DP 기본 연산</div><div style="font-size:1.3rem;font-weight:700;color:var(--green);">n − 2</div></div></div>' },
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
    <h4>입력</h4>
    <p>입력은 여러 개의 테스트 케이스로 이루어져 있다. 각 테스트 케이스는 한 줄에 세 정수 a, b, c가 주어진다. 입력의 마지막은 -1 -1 -1로 나타내며, 세 수가 모두 -1인 경우는 입력의 마지막을 나타내므로 처리하지 않는다. (-50 ≤ a, b, c ≤ 50)</p>
    <h4>출력</h4>
    <p>각 테스트 케이스마다 w(a, b, c)의 값을 출력한다. 출력 형식은 예제를 참고한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '그대로 재귀를 돌리면 같은 (a, b, c) 조합이 수없이 반복 호출됩니다.<br><br><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);margin-bottom:2px;">순수 재귀</div><div style="font-size:0.75rem;">같은 호출 반복</div><div style="font-weight:700;color:var(--red);font-size:1.1rem;">O(3<sup>n</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:2px;">메모이제이션</div><div style="font-size:0.75rem;">한 번만 계산</div><div style="font-weight:700;color:var(--green);font-size:1.1rem;">O(21<sup>3</sup>)</div></div></div><strong>이미 계산한 값을 다시 계산하는 건 낭비</strong>죠!' },
                { title: '이렇게 하면 어떨까?', content: '한 번 계산한 w(a,b,c)의 결과를 저장해두고, 다음에 같은 호출이 오면 바로 꺼내 쓰면 됩니다 — 이것이 <strong>메모이제이션</strong>이에요!<br><br><code>dp[a][b][c]</code>에 결과를 저장하면 되는데, a, b, c가 0~20 범위이므로 <code>dp[21][21][21]</code> 크기면 충분합니다. 함수 시작에서 "이미 계산했나?" 체크 한 줄만 추가하면 끝!<br><br><div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.85rem;"><div style="padding:6px 10px;border-radius:8px;background:var(--yellow);color:white;font-weight:600;">w(2,2,2) 호출</div><div>→</div><div style="padding:6px 10px;border-radius:8px;background:var(--accent);color:white;">dp에 저장</div><div>→</div><div style="padding:6px 10px;border-radius:8px;background:var(--yellow);color:white;font-weight:600;">w(2,2,2) 또 호출</div><div>→</div><div style="padding:6px 10px;border-radius:8px;background:var(--green);color:white;font-weight:600;">dp에서 바로 반환!</div></div>' },
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
    <h4>입력</h4>
    <p>첫째 줄에 정수 N이 주어진다. (1 ≤ N ≤ 10<sup>6</sup>)</p>
    <h4>출력</h4>
    <p>첫째 줄에 연산을 하는 횟수의 최솟값을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '10을 생각해보세요.<br><div style="display:flex;flex-direction:column;gap:6px;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--red);">그리디:</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;font-weight:600;">10</span><span>→-1→</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">5</span><span>→-1→</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">4</span><span>→÷2→</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">2</span><span>→÷2→</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;">1</span><span style="font-weight:600;color:var(--red);">= 4번</span></div><div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;color:var(--green);">최적:</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">10</span><span>→-1→</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">9</span><span>→÷3→</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">3</span><span>→÷3→</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">1</span><span style="font-weight:600;color:var(--green);">= 3번</span></div></div>큰 수로 나누는 게 항상 최선이 아니에요! 때로는 1을 빼서 3의 배수로 만드는 게 더 나을 수 있습니다. 모든 경우를 따져봐야 해요.' },
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
    <h4>입력</h4>
    <p>첫째 줄에 자연수 N이 주어진다. (1 ≤ N ≤ 1,000,000)</p>
    <h4>출력</h4>
    <p>첫째 줄에 지원이가 만들 수 있는 길이가 N인 모든 2진 수열의 개수를 15746으로 나눈 나머지를 출력한다.</p>
    <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
        <div><strong>입력</strong><pre>4</pre></div>
        <div><strong>출력</strong><pre>5</pre></div>
    </div></div>
    <h4>제약 조건</h4>
    <ul><li>1 ≤ N ≤ 1,000,000</li></ul>
`,
            hints: [
                { title: '처음 떠오르는 방법', content: '사용할 수 있는 타일이 "1"(길이 1)과 "00"(길이 2)이에요. 길이 N인 수열을 만들어야 하니까... 일단 모든 조합을 다 만들어볼까요? 길이 1짜리를 N개 쓰는 것부터, 00을 최대한 많이 쓰는 것까지 경우를 나누면 될 것 같아요.' },
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>100만</strong>이에요! 모든 조합을 세려면 경우의 수가 엄청 많습니다. 그런데 잠깐, <strong>마지막에 놓는 타일</strong>에 집중해보면 어떨까요?<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">마지막 = "1"</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--text);">N-1칸</span><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;font-weight:600;">1</span></div><div style="font-size:0.75rem;margin-top:3px;">= dp[N-1]가지</div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">마지막 = "00"</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--bg3);color:var(--text);">N-2칸</span><span style="padding:3px 8px;border-radius:4px;background:var(--green);color:white;font-weight:600;">00</span></div><div style="font-size:0.75rem;margin-top:3px;">= dp[N-2]가지</div></div></div>어딘가 익숙하지 않나요? <code>dp[N] = dp[N-1] + dp[N-2]</code> — 피보나치!' },
                { title: '이렇게 하면 어떨까?', content: '바로 <strong>피보나치</strong>와 같은 구조입니다!<br><br><code>dp[i]</code> = 길이 i인 수열의 개수라고 하면:<br><code>dp[i] = dp[i-1] + dp[i-2]</code><br><br><div style="display:flex;gap:4px;align-items:flex-end;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;"><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[1]</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">1</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[2]</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">2</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[3]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">3</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[4]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">5</div></div><div style="text-align:center;"><div style="font-size:0.65rem;color:var(--text3);">dp[5]</div><div style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;font-weight:600;">8</div></div></div>초기값: dp[1] = 1 ("1" 하나), dp[2] = 2 ("11", "00")<br><br>매 계산마다 <strong>15746으로 나머지</strong>를 취하는 것 잊지 마세요! 안 하면 숫자가 어마어마하게 커집니다.' },
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
    <h4>입력</h4>
    <p>입력의 첫째 줄에 계단의 개수가 주어진다. 둘째 줄부터 한 줄에 하나씩 제일 아래에 놓인 계단부터 순서대로 각 계단에 쓰여 있는 점수가 주어진다. 계단의 개수는 300 이하의 자연수이고, 계단에 쓰여 있는 점수는 10,000 이하의 자연수이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 계단 오르기 게임에서 얻을 수 있는 총 점수의 최댓값을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 300이면 경우의 수가 폭발적으로 늘어나서 전부 해보는 건 불가능해요. 대신 이렇게 생각해볼까요 — i번째 계단을 밟는 순간, <strong>바로 직전(i-1)을 밟았냐 안 밟았냐</strong>에 따라 딱 두 가지 경우뿐이에요:<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">① 2칸 점프</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-2</span><span style="color:var(--text3);">···</span><span style="padding:3px 8px;border-radius:4px;background:var(--yellow);color:white;font-weight:600;">i</span></div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">② 1칸+1칸</div><div style="display:flex;gap:3px;align-items:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--green);color:white;">i-1</span><span style="padding:3px 8px;border-radius:4px;background:var(--yellow);color:white;font-weight:600;">i</span></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i-2는 안 밟아야 함!</div></div></div>' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 계단을 밟았을 때의 최대 점수라고 하면:<br><br><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--accent);margin-bottom:4px;">경우 ①: 2칸 점프</div><div style="display:flex;gap:4px;align-items:center;"><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">i-2</span><span style="color:var(--text3);">···</span><span style="padding:3px 8px;border-radius:6px;background:var(--yellow);color:white;">i</span></div><div style="margin-top:4px;font-size:0.8rem;"><code>dp[i-2] + s[i]</code></div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:8px 12px;"><div style="font-weight:600;color:var(--green);margin-bottom:4px;">경우 ②: 1칸+1칸</div><div style="display:flex;gap:4px;align-items:center;"><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">i-3</span><span style="color:var(--text3);">·</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;">i-1</span><span style="padding:3px 8px;border-radius:6px;background:var(--yellow);color:white;">i</span></div><div style="margin-top:4px;font-size:0.8rem;"><code>dp[i-3] + s[i-1] + s[i]</code></div></div></div><code>dp[i] = max(경우①, 경우②)</code><br><br>초기값 3개만 수동으로 채우면 됩니다:<br>dp[1] = score[1], dp[2] = score[1]+score[2], dp[3] = max(score[1], score[2])+score[3]' },
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
    <h4>입력</h4>
    <p>첫째 줄에 포도주 잔의 개수 n이 주어진다. (1 ≤ n ≤ 10,000) 둘째 줄부터 n+1번째 줄까지 포도주 잔에 들어있는 포도주의 양이 순서대로 주어진다. 포도주의 양은 1,000 이하의 음이 아닌 정수이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 최대로 마실 수 있는 포도주의 양을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '잠깐, 계단 오르기와 <strong>결정적인 차이</strong>가 있어요!<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--accent);margin-bottom:3px;">계단 오르기</div><div style="font-size:0.75rem;">마지막 계단 <strong>반드시</strong> 밟아야</div><div style="font-size:0.75rem;color:var(--text3);">→ 2가지 경우</div></div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">포도주 시식</div><div style="font-size:0.75rem;">i번째 잔을 <strong>건너뛸 수 있음</strong></div><div style="font-size:0.75rem;color:var(--text3);">→ 3가지 경우</div></div></div>이 차이 때문에 "i번째를 건너뛰는" 경우가 추가됩니다. 계단 오르기의 점화식을 그대로 쓰면 이 경우를 놓쳐서 틀릴 수 있어요!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = 1번~i번째 잔까지 <strong>고려</strong>했을 때 최대 양 (i번째를 안 마실 수도 있음!)으로 정의하면, 3가지 경우가 생겨요:<br><br><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="border:1.5px solid var(--text3);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">① 안 마심</div><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text3);">i</span><div style="margin-top:3px;"><code>dp[i-1]</code></div></div><div style="border:1.5px solid var(--accent);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">② 1잔만</div><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text3);">i-1</span> <span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">i</span><div style="margin-top:3px;"><code>dp[i-2]+w[i]</code></div></div><div style="border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;text-align:center;"><div style="font-weight:600;margin-bottom:3px;">③ 연속 2잔</div><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">i-1</span> <span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;">i</span><div style="margin-top:3px;"><code>dp[i-3]+w[i-1]+w[i]</code></div></div></div><code>dp[i] = max(①, ②, ③)</code><br><br>계단 오르기보다 ①번 경우가 추가된 거예요!' },
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
    <h4>입력</h4>
    <p>첫째 줄에 정수 n(1 ≤ n ≤ 100,000)이 주어지고, 둘째 줄에는 n개의 정수로 이루어진 수열이 주어진다. 수는 -1,000보다 크거나 같고, 1,000보다 작거나 같은 정수이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 답을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 <strong>10만</strong>이에요! 이중 for문은 O(N<sup>2</sup>) = 100억 번이라 시간 초과입니다.<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;"><div style="font-size:0.8rem;font-weight:600;color:var(--red);">이중 for문</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">O(N<sup>2</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-size:0.8rem;font-weight:600;color:var(--green);">카데인</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">O(N)</div></div></div>매 위치에서 결정해야 할 건 딱 하나예요:<br>"지금까지 이어온 연속합이 플러스인가, 마이너스인가?"<br>마이너스면 <strong>여기서 새로 시작</strong>하는 게 낫고, 플러스면 <strong>이어 붙이는</strong> 게 낫죠!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> 최대 연속합이라 하면:<br><br><code>dp[i] = max(dp[i-1] + a[i], a[i])</code><br><br><div style="display:flex;gap:3px;align-items:flex-end;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.75rem;"><div style="text-align:center;"><div style="color:var(--text3);">10</div><div style="width:28px;height:40px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">10</div></div><div style="text-align:center;"><div style="color:var(--text3);">-4</div><div style="width:28px;height:24px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">6</div></div><div style="text-align:center;"><div style="color:var(--text3);">3</div><div style="width:28px;height:36px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">9</div></div><div style="text-align:center;"><div style="color:var(--text3);">1</div><div style="width:28px;height:40px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">10</div></div><div style="text-align:center;"><div style="color:var(--text3);">5</div><div style="width:28px;height:60px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">15</div></div><div style="text-align:center;"><div style="color:var(--text3);">6</div><div style="width:28px;height:84px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">21</div></div><div style="text-align:center;"><div style="color:var(--text3);">-35</div><div style="width:28px;height:4px;background:var(--red);border-radius:4px;"></div><div style="color:var(--red);font-weight:600;">-14</div></div><div style="text-align:center;"><div style="color:var(--text3);">12</div><div style="width:28px;height:48px;background:var(--yellow);border-radius:4px;"></div><div style="color:var(--yellow);font-weight:600;">12</div></div><div style="text-align:center;"><div style="color:var(--text3);">21</div><div style="width:28px;height:100px;background:var(--green);border-radius:4px;"></div><div style="color:var(--green);font-weight:600;">33</div></div><div style="text-align:center;"><div style="color:var(--text3);">-1</div><div style="width:28px;height:90px;background:var(--accent);border-radius:4px;"></div><div style="color:var(--accent);font-weight:600;">32</div></div></div><div style="text-align:center;font-size:0.8rem;color:var(--text2);margin-top:4px;">↑ 각 위치의 dp 값 (밑에서부터 높이). <span style="color:var(--yellow);">노란색</span>: 새로 시작한 지점</div><br>최종 답은 <code>max(dp[0], dp[1], ..., dp[n-1])</code>. 이 방법이 바로 <strong>카데인(Kadane) 알고리즘</strong>이에요. O(N)에 끝납니다!' },
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
    <h4>입력</h4>
    <p>첫째 줄에 N이 주어진다. N은 1 이상 100 이하의 자연수이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 정답을 1,000,000,000으로 나눈 나머지를 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 100이면 숫자가 10<sup>100</sup>개까지 가능해요! 전부 만들어보는 건 당연히 불가능합니다.<br><br>그런데 잘 보면, 계단 수의 다음 자릿수는 <strong>마지막 자릿수에만 의존</strong>해요.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><span style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-weight:600;">...3</span><span style="font-size:1.2rem;color:var(--text3);">→</span><span style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;">2</span><span style="color:var(--text3);">또는</span><span style="padding:4px 10px;border-radius:6px;background:var(--green);color:white;">4</span><span style="color:var(--text3);font-size:0.8rem;">(±1만 가능)</span></div>그러면 <strong>"마지막 자릿수"를 상태로 관리</strong>하면 되지 않을까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][j]</code> = 길이 i이고 마지막 자릿수가 j인 계단 수의 개수로 정의합시다!<br><br><div style="padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;text-align:center;font-size:0.8rem;"><div style="margin-bottom:6px;font-weight:600;color:var(--text2);">끝자리 전이 규칙</div><div style="display:flex;gap:3px;align-items:center;justify-content:center;flex-wrap:wrap;"><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;font-weight:600;">0</span><span>←→</span><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">1</span><span>←→</span><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">2</span><span>←→</span><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">3</span><span>←→</span><span style="color:var(--text3);">...</span><span>←→</span><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">8</span><span>←→</span><span style="padding:3px 8px;border-radius:6px;background:var(--red);color:white;font-weight:600;">9</span></div><div style="margin-top:6px;color:var(--text3);font-size:0.75rem;"><span style="color:var(--red);">0</span>은 1에서만, <span style="color:var(--red);">9</span>는 8에서만 올 수 있음 (경계!)</div></div>초기값: dp[1][1~9] = 1 (0으로 시작하는 건 계단 수가 아님!)<br>답: <code>dp[N][0] + dp[N][1] + ... + dp[N][9]</code>' },
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
    <h4>입력</h4>
    <p>첫째 줄에 집의 수 N(2 ≤ N ≤ 1,000)이 주어진다. 둘째 줄부터 N개의 줄에는 각 집을 빨강, 초록, 파랑으로 칠하는 비용이 1번 집부터 한 줄에 하나씩 주어진다. 집을 칠하는 비용은 1,000 이하의 자연수이다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 모든 집을 칠하는 비용의 최솟값을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 1000이면 3<sup>1000</sup>... 우주의 나이보다 긴 시간이 걸려요!<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);">전수 조사</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">3<sup>1000</sup></div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);">DP</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">N × 3</div></div></div>i번째 집의 색을 정할 때 중요한 건 <strong>바로 직전 집(i-1)이 무슨 색이냐</strong>뿐이에요. "마지막에 칠한 색"만 기억하면 되지 않을까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][c]</code> = i번째 집을 색 c(R=0, G=1, B=2)로 칠했을 때의 최소 총 비용<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">집 1</div><div style="width:36px;height:30px;background:#e74c3c;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">R</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">집 2</div><div style="width:36px;height:30px;background:#2ecc71;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">G</div></div><div style="text-align:center;"><div style="font-size:0.7rem;color:var(--text3);">집 3</div><div style="width:36px;height:30px;background:#3498db;border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">B</div></div><div style="font-size:0.75rem;color:var(--text3);margin-left:8px;">← 이웃이 같은 색이면 안 됨!</div></div>이웃 색이 달라야 하므로:<br>• 빨강: <code>dp[i][0] = min(dp[i-1][1], dp[i-1][2]) + cost[i][0]</code><br>• 초록: <code>dp[i][1] = min(dp[i-1][0], dp[i-1][2]) + cost[i][1]</code><br>• 파랑: <code>dp[i][2] = min(dp[i-1][0], dp[i-1][1]) + cost[i][2]</code><br><br>답: <code>min(dp[N][0], dp[N][1], dp[N][2])</code>' },
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
    <h4>입력</h4>
    <p>첫째 줄에 삼각형의 크기 n(1 ≤ n ≤ 500)이 주어지고, 둘째 줄부터 n+1번째 줄까지 정수 삼각형이 주어진다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 합이 최대가 되는 경로에 있는 수의 합을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'n이 최대 500이면 2<sup>499</sup>개의 경로... 불가능하죠!<br><br>그런데 삼각형의 각 칸 (i, j)에는 <strong>두 곳에서만</strong> 올 수 있어요:<br><br><div style="text-align:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="display:flex;gap:20px;justify-content:center;align-items:end;"><div style="text-align:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-1,j-1</span><div style="font-size:0.7rem;color:var(--text3);">왼쪽 위</div></div><div style="text-align:center;"><span style="padding:3px 8px;border-radius:4px;background:var(--accent);color:white;">i-1,j</span><div style="font-size:0.7rem;color:var(--text3);">바로 위</div></div></div><div style="font-size:1.2rem;color:var(--text3);">↘ ↙</div><div><span style="padding:4px 10px;border-radius:6px;background:var(--yellow);color:white;font-weight:600;">i, j</span></div></div>이전 칸까지의 최대 합만 알면 현재 칸의 최대 합도 바로 구할 수 있죠!' },
                { title: '이렇게 하면 어떨까?', content: '위→아래로 풀 수도 있지만, <strong>아래→위</strong>로 올라가면 더 간단해요!<br><br><div style="text-align:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;line-height:2;"><div><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">30</span></div><div><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">23</span> <span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">21</span></div><div><span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">20</span> <span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">13</span> <span style="padding:3px 8px;border-radius:6px;background:var(--accent);color:white;">10</span></div><div><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">7</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">12</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">10</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">10</span></div><div><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">4</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">5</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">2</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">6</span> <span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">5</span></div><div style="font-size:0.75rem;color:var(--text3);margin-top:4px;">↑ 아래에서 위로 큰 값을 더해 올라감. 꼭대기 = 답!</div></div>맨 아래 행부터 시작해서, 각 칸에서 아래 두 자식 중 큰 값을 더해 올라갑니다:<br><code>tri[i][j] += max(tri[i+1][j], tri[i+1][j+1])</code><br><br>이러면 경계 처리도 필요 없고, 최종 답이 <code>tri[0][0]</code> 하나에 깔끔하게 모입니다!' },
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
    <h4>입력</h4>
    <p>첫째 줄에 수열 A의 크기 N (1 ≤ N ≤ 1,000)이 주어진다. 둘째 줄에는 수열 A를 이루고 있는 A<sub>i</sub>가 주어진다. (1 ≤ A<sub>i</sub> ≤ 1,000)</p>
    <h4>출력</h4>
    <p>첫째 줄에 수열 A의 가장 긴 증가하는 부분 수열의 길이를 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N개 원소의 부분 수열은 2<sup>N</sup>개예요. N=1000이면... 전혀 안 됩니다!<br><br>대신 이렇게 생각해볼까요: 각 원소를 "마지막 원소"로 끝나는 가장 긴 증가 수열의 길이를 구하는 거예요.<br><br><div style="display:flex;gap:4px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">10</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">20</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">10</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">30</span><span style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">20</span><span style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">50</span></div><div style="text-align:center;font-size:0.75rem;color:var(--text3);">LIS = {10, 20, 30, 50} 길이 4</div>i번째 원소로 끝나는 LIS를 구하려면, 앞에 있는 <strong>나보다 작은</strong> 원소들의 LIS 길이를 참고하면 되죠!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i]</code> = i번째 원소를 <strong>마지막으로 포함하는</strong> LIS 길이로 정의합시다.<br><br><div style="display:flex;gap:3px;align-items:flex-end;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">10</div><div style="color:var(--green);font-weight:600;">1</div></div><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">20</div><div style="color:var(--green);font-weight:600;">2</div></div><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">10</div><div style="color:var(--text3);">1</div></div><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">30</div><div style="color:var(--green);font-weight:600;">3</div></div><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--bg3);color:var(--text);">20</div><div style="color:var(--text3);">2</div></div><div style="text-align:center;"><div style="padding:3px 8px;border-radius:6px;background:var(--green);color:white;font-weight:600;">50</div><div style="color:var(--green);font-weight:600;">4</div></div></div><div style="text-align:center;font-size:0.75rem;color:var(--text3);margin-bottom:8px;">↑ 위: 수열 값, 아래: dp[i] (LIS 길이). <span style="color:var(--green);">초록</span> = LIS에 포함</div>초기값: dp[i] = 1 (자기 자신만 포함)<br>0 &le; j &lt; i인 모든 j에 대해:<br><code>A[j] &lt; A[i]</code>이면 → <code>dp[i] = max(dp[i], dp[j] + 1)</code><br><br>답: <code>max(dp[0], dp[1], ..., dp[n-1])</code><br><br>이중 for문으로 O(N<sup>2</sup>). N &le; 1000이므로 충분합니다!' },
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
    <h4>입력</h4>
    <p>첫째 줄에 수열 A의 크기 N이 주어지고, 둘째 줄에는 수열 A를 이루고 있는 A<sub>i</sub>가 주어진다. (1 ≤ N ≤ 1,000, 1 ≤ A<sub>i</sub> ≤ 1,000)</p>
    <h4>출력</h4>
    <p>첫째 줄에 수열 A의 가장 긴 바이토닉 부분 수열의 길이를 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '꼭짓점 k마다 왼쪽 LIS, 오른쪽 감소 수열을 매번 새로 구하면 O(N<sup>3</sup>)이 돼요.<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);">매번 계산</div><div style="font-size:0.75rem;">N번 × O(N<sup>2</sup>)</div><div style="font-weight:700;color:var(--red);">O(N<sup>3</sup>)</div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);">미리 구해놓기</div><div style="font-size:0.75rem;">LIS 1회 + LDS 1회</div><div style="font-weight:700;color:var(--green);">O(N<sup>2</sup>)</div></div></div><strong>왼쪽에서의 LIS</strong>와 <strong>오른쪽에서의 LIS</strong>(= 감소 수열)를 <strong>한 번씩만</strong> 미리 구해놓으면, 합치는 건 O(N)이에요!' },
                { title: '이렇게 하면 어떨까?', content: '두 배열을 미리 구합시다:<br>• <code>lis[i]</code> = 왼→오 방향에서 i를 마지막으로 하는 LIS 길이<br>• <code>lds[i]</code> = 오→왼 방향에서 i를 마지막으로 하는 LIS 길이 (= i를 시작으로 하는 감소 수열 길이)<br><br><div style="text-align:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="display:flex;gap:3px;justify-content:center;align-items:flex-end;margin-bottom:4px;"><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">1</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">5</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">2</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">1</span><span style="padding:2px 6px;border-radius:4px;background:var(--yellow);color:white;font-weight:700;">4</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">3</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">4</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:700;">5</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">2</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">1</span></div><div style="font-size:0.7rem;color:var(--text3);">lis: 1 2 2 1 <span style="color:var(--yellow);">3</span> 3 4 <span style="color:var(--green);">5</span> 2 1</div><div style="font-size:0.7rem;color:var(--text3);">lds: 1 4 2 1 <span style="color:var(--yellow);">3</span> 2 2 <span style="color:var(--green);">3</span> 2 1</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">합: 1 5 3 1 <span style="color:var(--yellow);">5</span> 4 5 <span style="color:var(--green);font-weight:600;">7</span> 3 1 ← <span style="color:var(--green);">최대 7</span></div></div>그러면 각 꼭짓점 i에서의 바이토닉 수열 길이는:<br><code>lis[i] + lds[i] - 1</code><br>(-1은 꼭짓점이 양쪽에서 중복 카운트되기 때문)<br><br>답: 모든 i에 대해 이 값의 최대!' },
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
    <h4>입력</h4>
    <p>첫째 줄에는 두 전봇대 사이의 전깃줄의 개수가 주어진다. 전깃줄의 개수는 100 이하의 자연수이다. 둘째 줄부터 한 줄에 하나씩 전깃줄이 A전봇대와 연결되는 위치의 번호와 B전봇대와 연결되는 위치의 번호가 차례로 주어진다. 위치의 번호는 500 이하의 자연수이고, 같은 위치에 두 개 이상의 전깃줄이 연결될 수 없다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 남아있는 모든 전깃줄이 서로 교차하지 않게 하기 위해 없애야 하는 전깃줄의 최소 개수를 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '제거 조합을 모두 시도하면 2<sup>N</sup>이 되어 안 돼요. <strong>발상을 전환</strong>해봅시다!<br><br><div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.85rem;"><div style="text-align:center;border:1.5px solid var(--red);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--red);">제거 최소?</div><div style="font-size:0.75rem;color:var(--text3);">직접 구하기 어려움</div></div><div style="font-size:1.2rem;color:var(--text3);">⟺</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);">남기기 최대!</div><div style="font-size:0.75rem;color:var(--text3);">N − 남긴 수 = 답</div></div></div>"교차하지 않는 전깃줄의 최대 집합"은 어떤 구조일까요?' },
                { title: '이렇게 하면 어떨까?', content: 'A 전봇대 기준으로 전깃줄을 정렬해봅시다. 그러면 교차하지 않으려면 B 쪽 번호도 <strong>증가해야</strong> 해요!<br><br><div style="padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-weight:600;">A (정렬됨)</span><span style="font-weight:600;">B</span></div><div style="display:flex;justify-content:space-between;"><div style="display:flex;gap:3px;"><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">1</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">2</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">3</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">4</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">6</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">7</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">9</span><span style="padding:2px 6px;border-radius:4px;background:var(--accent);color:white;">10</span></div><div style="display:flex;gap:3px;"><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text);">8</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:600;">2</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text);">9</span><span style="padding:2px 6px;border-radius:4px;background:var(--bg3);color:var(--text);">1</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:600;">4</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:600;">6</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:600;">7</span><span style="padding:2px 6px;border-radius:4px;background:var(--green);color:white;font-weight:600;">10</span></div></div><div style="text-align:center;font-size:0.7rem;color:var(--text3);margin-top:4px;"><span style="color:var(--green);">초록</span> = B의 LIS → 교차 안 하는 전깃줄!</div></div>결국 <strong>B 배열의 LIS</strong>를 구하는 문제예요!<br>답: <code>N - LIS 길이</code>' },
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
    <h4>입력</h4>
    <p>첫째 줄과 둘째 줄에 두 문자열이 주어진다. 문자열은 알파벳 대문자로만 이루어져 있으며, 최대 1000글자로 이루어져 있다.</p>
    <h4>출력</h4>
    <p>첫째 줄에 입력으로 주어진 두 문자열의 LCS의 길이를 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '길이 N인 문자열의 부분 수열은 2<sup>N</sup>개! N이 1000이면 전혀 안 되죠.<br><br>대신 이렇게 생각해봐요: A의 i번째 문자와 B의 j번째 문자를 비교할 때,<br><br><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">A[i] == B[j]</div><div style="font-size:0.75rem;">포함! 양쪽 한 칸 앞으로</div><div><code>dp[i-1][j-1] + 1</code></div></div><div style="text-align:center;border:1.5px solid var(--text3);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;margin-bottom:3px;">A[i] != B[j]</div><div style="font-size:0.75rem;">둘 중 나은 쪽</div><div><code>max(dp[i-1][j], dp[i][j-1])</code></div></div></div>이걸 표로 정리하면 어떨까요?' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][j]</code> = A의 처음 i글자와 B의 처음 j글자의 LCS 길이로 정의하면:<br><br><div style="overflow-x:auto;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;"><table style="border-collapse:collapse;font-size:0.75rem;margin:0 auto;"><tr><td style="padding:3px 6px;"></td><td style="padding:3px 6px;color:var(--text3);"></td><td style="padding:3px 6px;font-weight:600;">C</td><td style="padding:3px 6px;font-weight:600;">A</td><td style="padding:3px 6px;font-weight:600;">P</td><td style="padding:3px 6px;font-weight:600;">C</td><td style="padding:3px 6px;font-weight:600;">A</td><td style="padding:3px 6px;font-weight:600;">K</td></tr><tr><td style="padding:3px 6px;color:var(--text3);"></td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;color:var(--text3);">0</td></tr><tr><td style="padding:3px 6px;font-weight:600;">A</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;">0</td><td style="padding:3px 6px;background:var(--green);color:white;border-radius:4px;font-weight:600;">1</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">1</td></tr><tr><td style="padding:3px 6px;font-weight:600;">C</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;background:var(--green);color:white;border-radius:4px;font-weight:600;">1</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td></tr><tr><td style="padding:3px 6px;font-weight:600;">A</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;background:var(--green);color:white;border-radius:4px;font-weight:600;">3</td><td style="padding:3px 6px;">3</td></tr><tr><td style="padding:3px 6px;font-weight:600;">Y</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">3</td><td style="padding:3px 6px;">3</td></tr><tr><td style="padding:3px 6px;font-weight:600;">K</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">3</td><td style="padding:3px 6px;background:var(--green);color:white;border-radius:4px;font-weight:600;">4</td></tr><tr><td style="padding:3px 6px;font-weight:600;">P</td><td style="padding:3px 6px;color:var(--text3);">0</td><td style="padding:3px 6px;">1</td><td style="padding:3px 6px;">2</td><td style="padding:3px 6px;">3</td><td style="padding:3px 6px;">3</td><td style="padding:3px 6px;">3</td><td style="padding:3px 6px;background:var(--accent);color:white;border-radius:4px;font-weight:700;">4</td></tr></table><div style="text-align:center;font-size:0.7rem;color:var(--text3);margin-top:4px;"><span style="color:var(--green);">초록</span> = 같은 문자 매칭 (+1), 우하단 = 답!</div></div>• <code>A[i] == B[j]</code>: 같은 문자 발견! → <code>dp[i][j] = dp[i-1][j-1] + 1</code><br>• <code>A[i] != B[j]</code>: 둘 중 나은 쪽 → <code>dp[i][j] = max(dp[i-1][j], dp[i][j-1])</code><br><br>0행, 0열은 모두 0 (빈 문자열과의 LCS = 0)<br>답: <code>dp[len(A)][len(B)]</code>' },
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
    <h4>입력</h4>
    <p>첫 줄에 물품의 수 N(1 ≤ N ≤ 100)과 준서가 버틸 수 있는 무게 K(1 ≤ K ≤ 100,000)가 주어진다. 두 번째 줄부터 N개의 줄에 거쳐 각 물건의 무게 W(1 ≤ W ≤ 100,000)와 해당 물건의 가치 V(0 ≤ V ≤ 1,000)가 주어진다.</p>
    <h4>출력</h4>
    <p>한 줄에 배낭에 넣을 수 있는 물건들의 가치합의 최댓값을 출력한다.</p>
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
                { title: '근데 이러면 문제가 있어', content: 'N이 최대 100이면 2<sup>100</sup> = 약 10<sup>30</sup>... 전부 해보는 건 불가능해요!<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;"><div style="font-weight:600;color:var(--red);">전수 조사</div><div style="font-size:1.1rem;font-weight:700;color:var(--red);">2<sup>100</sup></div></div><div style="font-size:1.2rem;color:var(--text3);">→</div><div style="text-align:center;"><div style="font-weight:600;color:var(--green);">DP (물건 × 용량)</div><div style="font-size:1.1rem;font-weight:700;color:var(--green);">N × K</div></div></div>i번째 물건을 고려할 때 중요한 건 <strong>지금까지 쓴 무게(남은 용량)</strong>뿐이에요. "이전 물건 수 + 현재 용량"을 상태로 잡으면 될 것 같아요!' },
                { title: '이렇게 하면 어떨까?', content: '<code>dp[i][w]</code> = 처음 i개 물건까지 고려하고, 배낭 용량이 w일 때의 최대 가치<br><br><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;padding:10px;background:var(--bg2);border-radius:10px;margin:8px 0;font-size:0.8rem;"><div style="text-align:center;border:1.5px solid var(--text3);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;margin-bottom:3px;">안 넣기</div><div style="font-size:0.75rem;color:var(--text3);">무게 그대로</div><div><code>dp[i-1][w]</code></div></div><div style="display:flex;align-items:center;font-size:1.2rem;color:var(--text3);">vs</div><div style="text-align:center;border:1.5px solid var(--green);border-radius:8px;padding:6px 10px;"><div style="font-weight:600;color:var(--green);margin-bottom:3px;">넣기!</div><div style="font-size:0.75rem;color:var(--text3);">무게 W[i]만큼 사용</div><div><code>dp[i-1][w-W[i]] + V[i]</code></div></div></div><code>dp[i][w] = max(안 넣기, 넣기)</code><br><br>이것이 유명한 <strong>0/1 배낭 문제(Knapsack)</strong>입니다!' },
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
