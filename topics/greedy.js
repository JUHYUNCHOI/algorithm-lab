// ===== 그리디 알고리즘 토픽 모듈 =====
var greedyTopic = {
    id: 'greedy',
    title: '그리디',
    icon: '🏆',
    category: '알고리즘 기법',
    order: 12,
    description: '지금 당장 가장 좋은 선택을 반복하는 기법',
    relatedNote: '그리디는 정렬, 우선순위 큐와 함께 사용되는 경우가 많으며, 최적해를 보장하는지 증명하는 것이 핵심입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-11047': { type: '동전 문제', color: 'var(--accent)', vizMethod: '_renderVizCoin', suffix: '-coin' },
        'boj-11399': { type: '정렬 기반', color: 'var(--green)', vizMethod: '_renderVizATM', suffix: '-atm' },
        'boj-1931':  { type: '활동 선택', color: '#e17055', vizMethod: '_renderVizMeeting', suffix: '-meet' },
        'boj-1541':  { type: '괄호 배치', color: '#6c5ce7', vizMethod: '_renderVizBracket', suffix: '-brk' },
        'boj-13305': { type: '최소 비용', color: '#00b894', vizMethod: '_renderVizGas', suffix: '-gas' }
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
            sim:     { intro: prob.simIntro || '그리디 알고리즘이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
                <h2>🏆 그리디 (Greedy)</h2>
                <p class="hero-sub">매 순간 가장 좋아 보이는 것을 선택하면, 전체 답도 최선이 됩니다</p>
            </div>

            <!-- ① 그리디란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 그리디란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 편의점에서 거스름돈을 줄 때를 생각해 보세요.<br>
                    거슬러 줘야 할 금액이 <strong>1,260원</strong>이라면?<br><br>
                    <strong>가장 큰 동전부터</strong> 최대한 많이 사용합니다:<br>
                    1000원 × 1개 → 남은 260원<br>
                    100원 × 2개 → 남은 60원<br>
                    50원 × 1개 → 남은 10원<br>
                    10원 × 1개 → 남은 0원<br><br>
                    이렇게 <strong>매번 지금 줄 수 있는 가장 큰 동전을 선택</strong>하는 것이 그리디입니다!
                </div>

                <div class="code-block"><pre><code class="language-python"># 거스름돈 문제 (그리디)
coins = [1000, 500, 100, 50, 10]  # 큰 것부터
change = 1260
count = 0

for coin in coins:
    count += change // coin   # 이 동전을 최대한 많이 사용
    change %= coin            # 남은 금액 갱신

print(count)  # 5개</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">거스름돈이 4,730원이라면 동전은 최소 몇 개 필요할까요? (1000, 500, 100, 50, 10원)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>11개</strong>입니다!<br>
                        1000원 × 4개 = 4000원 (남은 730원)<br>
                        500원 × 1개 = 500원 (남은 230원)<br>
                        100원 × 2개 = 200원 (남은 30원)<br>
                        50원 × 0개 (남은 30원)<br>
                        10원 × 3개 = 30원 (남은 0원)<br>
                        합계: 4 + 1 + 2 + 0 + 3 = <strong>11개</strong>
                    </div>
                </div>
            </div>

            <!-- ② 그리디가 통하는 조건 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 그리디가 통하는 조건</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <path d="M30 40 L37 48 L52 32" fill="none" stroke="var(--green)" stroke-width="3"/>
                            </svg>
                        </div>
                        <h3>지금 최선 = 전체 최선</h3>
                        <p>매 순간의 최선 선택이 모여서 전체 문제의 최선이 되어야 합니다. 이것을 <strong>"탐욕 선택 속성"</strong>이라고 합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="15" y="25" width="20" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <rect x="45" y="25" width="20" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <path d="M35 40 L45 40" stroke="var(--text3)" stroke-width="2" stroke-dasharray="3,3"/>
                            </svg>
                        </div>
                        <h3>앞 선택이 뒤에 영향 없음</h3>
                        <p>한 번 한 선택이 이후의 선택지를 망치지 않아야 합니다. 각 선택이 <strong>독립적</strong>이어야 합니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">동전이 100원, 70원, 10원짜리만 있을 때, 120원을 그리디로 거슬러 주면 어떻게 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        그리디: 100원 × 1 + 10원 × 2 = <strong>3개</strong><br>
                        하지만 최적: 70원 × 1 + 10원 × 5 = <strong>6개</strong>... 아닙니다!<br>
                        사실 최적은 없습니다... 아! <strong>70원 + 50원은 불가능</strong>이고,<br>
                        실제 최적: 100원 × 1 + 10원 × 2 = 3개 vs 70원 × 1 + 10원 × 5 = 6개<br><br>
                        이 경우 그리디가 맞지만, 만약 <strong>140원</strong>이라면?<br>
                        그리디: 100원 × 1 + 10원 × 4 = <strong>5개</strong><br>
                        최적: 70원 × 2 = <strong>2개</strong><br><br>
                        동전이 배수 관계가 아니면 그리디가 <strong>틀릴 수 있습니다!</strong><br>
                        이런 경우에는 DP를 사용해야 합니다.
                    </div>
                </div>
            </div>

            <!-- ③ 그리디 vs DP -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 그리디 vs DP</div>
                <div class="approach-grid">
                    <div class="approach-card featured">
                        <h4>🏆 그리디</h4>
                        <ul style="list-style:none; padding:0; margin:0.5rem 0;">
                            <li>✅ 매 순간 최선을 선택</li>
                            <li>✅ 한 번 선택하면 되돌아가지 않음</li>
                            <li>✅ 빠름 — 보통 O(N) 또는 O(N log N)</li>
                            <li>⚠️ 항상 최적이 아닐 수 있음</li>
                        </ul>
                    </div>
                    <div class="approach-card">
                        <h4>🧩 DP</h4>
                        <ul style="list-style:none; padding:0; margin:0.5rem 0;">
                            <li>✅ 모든 경우를 비교 후 최적 선택</li>
                            <li>✅ 항상 최적해를 보장</li>
                            <li>✅ 중복 계산을 저장해서 빠르게</li>
                            <li>⚠️ 그리디보다 느릴 수 있음</li>
                        </ul>
                    </div>
                </div>

                <div class="key-difference-box">
                    <strong>핵심 차이:</strong>
                    그리디는 <strong>"지금 최선"만 보고 바로 결정</strong>합니다. DP는 <strong>"나중 결과까지 다 따져보고 결정"</strong>합니다.<br>
                    <span style="color:var(--text2)">그리디가 통하는 문제는 그리디로 풀면 훨씬 빠르고 간단합니다!</span>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"N개의 회의 중 겹치지 않게 최대한 많이 선택하기"는 그리디? DP?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>그리디</strong>입니다!<br>
                        끝나는 시간이 빠른 회의부터 선택하면 항상 최적입니다.<br>
                        왜냐하면 일찍 끝나는 회의를 선택해야 남은 시간이 최대한 많이 확보되기 때문입니다.<br>
                        이것이 유명한 <strong>"활동 선택 문제 (Activity Selection)"</strong>입니다.
                    </div>
                </div>
            </div>

            <!-- ④ 자주 쓰이는 그리디 패턴 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 자주 쓰이는 그리디 패턴</div>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="15" y="55" width="10" height="15" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="30" y="40" width="10" height="30" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="45" y="25" width="10" height="45" rx="2" fill="var(--accent)" opacity="0.8"/>
                                <rect x="60" y="10" width="10" height="60" rx="2" fill="var(--accent)" opacity="1"/>
                            </svg>
                        </div>
                        <h3>정렬 후 선택</h3>
                        <p>기준에 맞게 정렬한 뒤, 앞에서부터 하나씩 선택합니다. (ATM, 회의실 배정)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="35" r="22" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <text x="40" y="42" text-anchor="middle" fill="var(--green)" font-size="18" font-weight="bold">MAX</text>
                            </svg>
                        </div>
                        <h3>가장 큰/작은 것부터</h3>
                        <p>가장 크거나 작은 것부터 처리합니다. (동전 거스름돈)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <line x1="15" y1="45" x2="65" y2="45" stroke="var(--yellow)" stroke-width="3"/>
                                <rect x="15" y="35" width="20" height="10" rx="3" fill="var(--green)" opacity="0.7"/>
                                <rect x="40" y="35" width="25" height="10" rx="3" fill="var(--accent)" opacity="0.7"/>
                            </svg>
                        </div>
                        <h3>끝나는 시간 기준</h3>
                        <p>일찍 끝나는 것부터 선택해서 남은 시간을 최대화합니다. (회의실 배정)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M15 60 L35 30 L55 50 L65 20" fill="none" stroke="var(--red)" stroke-width="3"/>
                                <circle cx="35" cy="30" r="4" fill="var(--green)"/>
                            </svg>
                        </div>
                        <h3>최소/최대 추적</h3>
                        <p>지금까지 본 최소(최대)값을 기억하며 진행합니다. (주유소)</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"줄 서는 순서를 바꿔서 전체 대기시간을 최소로" — 어떤 기준으로 정렬해야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>걸리는 시간이 짧은 사람부터</strong> 앞에 세워야 합니다!<br>
                        앞에 선 사람의 시간은 뒤의 모든 사람이 기다려야 하므로,<br>
                        짧은 시간이 앞에 와야 기다리는 총합이 줄어듭니다.<br>
                        이것이 BOJ 11399 (ATM) 문제의 핵심입니다.
                    </div>
                </div>
            </div>

            <!-- ⑤ 그리디 문제 푸는 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 그리디 문제 푸는 3단계</div>
                <p style="color:var(--text2); margin-bottom:1rem;">그리디 문제를 만나면 이 3단계를 따라가세요.</p>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--accent)" stroke-width="3"/>
                                <text x="40" y="46" text-anchor="middle" fill="var(--accent)" font-size="20" font-weight="bold">?</text>
                            </svg>
                        </div>
                        <h3>① 기준 정하기</h3>
                        <p>"무엇을 기준으로 선택할지" 정합니다. 가장 큰 것? 가장 빨리 끝나는 것? 가장 싼 것?</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="55" width="12" height="15" rx="2" fill="var(--green)" opacity="0.5"/>
                                <rect x="27" y="40" width="12" height="30" rx="2" fill="var(--green)" opacity="0.65"/>
                                <rect x="44" y="25" width="12" height="45" rx="2" fill="var(--green)" opacity="0.8"/>
                                <rect x="61" y="10" width="12" height="60" rx="2" fill="var(--green)" opacity="1"/>
                            </svg>
                        </div>
                        <h3>② 정렬하기</h3>
                        <p>정한 기준에 따라 데이터를 정렬합니다. 대부분의 그리디는 정렬이 핵심입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <path d="M20 60 L40 20 L60 60" fill="none" stroke="var(--yellow)" stroke-width="3"/>
                                <circle cx="40" cy="20" r="5" fill="var(--yellow)"/>
                            </svg>
                        </div>
                        <h3>③ 하나씩 선택하기</h3>
                        <p>앞에서부터 하나씩 보면서, 조건에 맞으면 선택합니다. 되돌아가지 않습니다!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"그리디로 풀어도 되는지" 어떻게 확인할 수 있을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>반례를 찾아보세요!</strong><br>
                        그리디 기준을 정한 뒤, 작은 예시로 "이 기준으로 선택하면 항상 최선인가?" 확인합니다.<br>
                        반례가 없다면 그리디를 써도 됩니다.<br>
                        반례가 있다면 DP나 다른 방법을 고려해야 합니다.
                    </div>
                </div>
            </div>
        `;

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
    // 시뮬레이션 1: 동전 0 (boj-11047)
    // ====================================================================
    _renderVizCoin(container) {
        var self = this, suffix = '-coin';
        var coins = [1000, 500, 100, 50, 10, 1];
        var K = 4200;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">동전 거스름돈 — 큰 동전부터</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">K=<strong>' + K + '</strong>원을 동전 [' + coins.join(', ') + ']으로 거슬러 줍니다.</p>' +
            '<div id="cn-coins' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var coinsEl = container.querySelector('#cn-coins' + suffix);
        var infoEl = container.querySelector('#cn-info' + suffix);
        function renderCoins(usedMap) {
            coinsEl.innerHTML = coins.map(function(c) {
                var cnt = usedMap[c] || 0;
                var active = cnt > 0;
                return '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:4px;border-radius:8px;background:' + (active ? 'var(--accent)10' : 'var(--bg2)') + ';border:2px solid ' + (active ? 'var(--accent)' : 'transparent') + ';">' +
                    '<div style="width:48px;height:48px;border-radius:50%;background:' + (active ? 'var(--accent)' : 'var(--text3)') + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">' + c + '</div>' +
                    '<span style="font-weight:600;font-size:1rem;">' + (active ? cnt + '개 사용' : '-') + '</span></div>';
            }).join('');
        }
        renderCoins({});
        infoEl.innerHTML = '<span style="color:var(--text2);">남은 금액: <strong>' + K + '원</strong></span>';
        var steps = [];
        var rem = K, totalCount = 0, usedSoFar = {};
        coins.forEach(function(coin) {
            var cnt = Math.floor(rem / coin);
            if (cnt > 0) {
                var prevRem = rem;
                rem -= cnt * coin;
                totalCount += cnt;
                var afterRem = rem, afterTotal = totalCount;
                (function(coin, cnt, prevRem, afterRem, afterTotal) {
                    steps.push({
                        description: coin + '원: ' + prevRem + ' ÷ ' + coin + ' = ' + cnt + '개 사용 → 남은 금액: ' + afterRem + '원',
                        action: function() { usedSoFar[coin] = cnt; renderCoins(usedSoFar); infoEl.innerHTML = coin + '원 × ' + cnt + '개 = ' + (coin * cnt) + '원 사용 → 남은: <strong>' + afterRem + '원</strong>'; },
                        undo: function() { delete usedSoFar[coin]; renderCoins(usedSoFar); infoEl.innerHTML = '<span style="color:var(--text2);">남은 금액: <strong>' + prevRem + '원</strong></span>'; }
                    });
                })(coin, cnt, prevRem, afterRem, afterTotal);
            }
        });
        var finalTotal = totalCount;
        steps.push({
            description: '완성! 총 ' + finalTotal + '개 동전으로 ' + K + '원을 거슬러 줄 수 있습니다.',
            action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 총 동전 수: ' + finalTotal + '개</strong>'; },
            undo: function() { infoEl.innerHTML = '남은: <strong>0원</strong>'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: ATM (boj-11399)
    // ====================================================================
    _renderVizATM(container) {
        var self = this, suffix = '-atm';
        var original = [3, 1, 4, 3, 2];
        var sorted = original.slice().sort(function(a, b) { return a - b; });
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">ATM 대기시간 최소화</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">인출 시간: [' + original.join(', ') + '] → 정렬: [' + sorted.join(', ') + ']</p>' +
            '<div id="atm-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="atm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#atm-bars' + suffix);
        var infoEl = container.querySelector('#atm-info' + suffix);
        var maxVal = Math.max.apply(null, sorted);
        function renderBars(highlight, accValues) {
            barsEl.innerHTML = sorted.map(function(v, i) {
                var pct = (v / maxVal) * 100;
                var isHl = (highlight === i);
                var accText = accValues && accValues[i] !== undefined ? ' (누적: ' + accValues[i] + ')' : '';
                return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                    '<div style="width:30px;text-align:right;font-size:0.85rem;font-weight:600;color:' + (isHl ? 'var(--accent)' : 'var(--text2)') + ';">P' + (i + 1) + '</div>' +
                    '<div style="flex:1;height:28px;border-radius:6px;overflow:hidden;background:var(--bg2);">' +
                    '<div style="width:' + pct + '%;height:100%;background:' + (isHl ? 'var(--accent)' : 'var(--green)') + ';border-radius:6px;display:flex;align-items:center;padding-left:8px;color:white;font-weight:600;font-size:0.8rem;">' + v + '분' + accText + '</div></div></div>';
            }).join('');
        }
        renderBars(-1, null);
        infoEl.innerHTML = '<span style="color:var(--text2);">짧은 시간부터 처리하여 총 대기시간을 줄입니다.</span>';
        var steps = [];
        var acc = 0, total = 0, accArr = [];
        sorted.forEach(function(v, i) {
            acc += v;
            total += acc;
            var curAcc = acc, curTotal = total;
            accArr.push(curAcc);
            var snapshot = accArr.slice();
            (function(i, v, curAcc, curTotal, snapshot) {
                steps.push({
                    description: 'P' + (i + 1) + '=' + v + '분: 누적 대기 = ' + curAcc + '분, 총합 = ' + curTotal + '분',
                    action: function() { renderBars(i, snapshot); infoEl.innerHTML = 'P' + (i + 1) + ': 대기 <strong>' + curAcc + '분</strong>, 누적 합계: <strong>' + curTotal + '분</strong>'; },
                    undo: function() { renderBars(-1, null); infoEl.innerHTML = '<span style="color:var(--text2);">짧은 시간부터 처리하여 총 대기시간을 줄입니다.</span>'; }
                });
            })(i, v, curAcc, curTotal, snapshot);
        });
        var finalTotal = total;
        steps.push({
            description: '완성! 최소 총 대기시간 = ' + finalTotal + '분',
            action: function() { renderBars(-1, accArr); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최소 총 대기시간: ' + finalTotal + '분</strong>'; },
            undo: function() { renderBars(-1, null); }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 회의실 배정 (boj-1931)
    // ====================================================================
    _renderVizMeeting(container) {
        var self = this, suffix = '-meet';
        var meetings = [[1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]];
        var sorted = meetings.slice().sort(function(a, b) { return a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]; });
        var maxTime = 0;
        for (var i = 0; i < sorted.length; i++) { if (sorted[i][1] > maxTime) maxTime = sorted[i][1]; }
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">회의실 배정 — 끝나는 시간 기준 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">' + sorted.length + '개 회의를 끝나는 시간 기준으로 정렬 후 선택합니다.</p>' +
            '<div id="mt-area' + suffix + '" style="position:relative;min-height:' + (sorted.length * 32 + 30) + 'px;margin-bottom:12px;border-left:2px solid var(--border);padding-left:40px;"></div>' +
            '<div id="mt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#mt-area' + suffix);
        var infoEl = container.querySelector('#mt-info' + suffix);
        // render timeline
        var timelineHTML = '';
        for (var ti = 0; ti <= maxTime; ti++) {
            timelineHTML += '<div style="position:absolute;left:' + (40 + (ti / maxTime) * 80) + '%;top:0;font-size:0.65rem;color:var(--text3);transform:translateX(-50%);">' + ti + '</div>';
        }
        sorted.forEach(function(m, i) {
            var left = 40 + (m[0] / maxTime) * 80;
            var width = ((m[1] - m[0]) / maxTime) * 80;
            timelineHTML += '<div id="mt-bar-' + i + suffix + '" style="position:absolute;left:' + left + '%;top:' + (18 + i * 30) + 'px;width:' + width + '%;height:24px;border-radius:6px;background:var(--bg2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:600;color:var(--text2);transition:all 0.3s;">(' + m[0] + ',' + m[1] + ')</div>';
        });
        areaEl.innerHTML = timelineHTML;
        infoEl.innerHTML = '<span style="color:var(--text2);">끝나는 시간 기준 오름차순 정렬 완료</span>';
        var steps = [];
        var lastEnd = -1, selectedCount = 0;
        sorted.forEach(function(m, i) {
            var start = m[0], end = m[1];
            if (start >= lastEnd) {
                var prevEnd = lastEnd;
                lastEnd = end;
                selectedCount++;
                var cnt = selectedCount;
                (function(i, start, end, prevEnd, cnt) {
                    steps.push({
                        description: '회의 (' + start + '~' + end + '): 시작(' + start + ') >= 이전 종료(' + (prevEnd < 0 ? '없음' : prevEnd) + ') → 선택! (' + cnt + '개째)',
                        action: function() {
                            var bar = container.querySelector('#mt-bar-' + i + suffix);
                            bar.style.background = 'var(--green)'; bar.style.borderColor = 'var(--green)'; bar.style.color = 'white';
                            infoEl.innerHTML = '선택: <strong style="color:var(--green);">' + cnt + '개</strong> | 마지막 종료: ' + end;
                        },
                        undo: function() {
                            var bar = container.querySelector('#mt-bar-' + i + suffix);
                            bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)';
                            infoEl.innerHTML = prevEnd < 0 ? '<span style="color:var(--text2);">끝나는 시간 기준 오름차순 정렬 완료</span>' : '선택: <strong style="color:var(--green);">' + (cnt - 1) + '개</strong>';
                        }
                    });
                })(i, start, end, prevEnd, cnt);
            } else {
                var curEnd = lastEnd;
                (function(i, start, end, curEnd) {
                    steps.push({
                        description: '회의 (' + start + '~' + end + '): 시작(' + start + ') < 이전 종료(' + curEnd + ') → 겹침! 건너뜀',
                        action: function() {
                            var bar = container.querySelector('#mt-bar-' + i + suffix);
                            bar.style.background = 'var(--red)15'; bar.style.borderColor = 'var(--red)'; bar.style.color = 'var(--red)'; bar.style.opacity = '0.5';
                        },
                        undo: function() {
                            var bar = container.querySelector('#mt-bar-' + i + suffix);
                            bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)'; bar.style.opacity = '1';
                        }
                    });
                })(i, start, end, curEnd);
            }
        });
        var finalCount = selectedCount;
        steps.push({
            description: '완성! 최대 ' + finalCount + '개 회의를 겹치지 않게 배정!',
            action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최대 ' + finalCount + '개 회의 배정 완료!</strong>'; },
            undo: function() { infoEl.innerHTML = '선택: <strong style="color:var(--green);">' + finalCount + '개</strong>'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 잃어버린 괄호 (boj-1541)
    // ====================================================================
    _renderVizBracket(container) {
        var self = this, suffix = '-brk';
        var expr = '55-50+40';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">잃어버린 괄호 — 최솟값 만들기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">수식: <strong>' + expr + '</strong></p>' +
            '<div id="bk-expr' + suffix + '" style="font-size:1.3rem;font-weight:700;text-align:center;padding:16px;background:var(--bg);border-radius:8px;margin-bottom:12px;font-family:monospace;"></div>' +
            '<div id="bk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = container.querySelector('#bk-expr' + suffix);
        var infoEl = container.querySelector('#bk-info' + suffix);
        exprEl.innerHTML = expr;
        infoEl.innerHTML = '<span style="color:var(--text2);">"-" 뒤에 괄호를 넣어 뺄 수 있는 값을 최대로 만듭니다.</span>';
        var steps = [
            {
                description: 'Step 1: 수식을 "-" 기준으로 분리합니다.',
                action: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> <span style="color:var(--red);font-size:1.5rem;">-</span> <span style="color:#e17055;">50+40</span>';
                    infoEl.innerHTML = '그룹 1: <strong>55</strong>, 그룹 2: <strong>50+40</strong>';
                },
                undo: function() { exprEl.innerHTML = expr; infoEl.innerHTML = '<span style="color:var(--text2);">"-" 뒤에 괄호를 넣어 뺄 수 있는 값을 최대로 만듭니다.</span>'; }
            },
            {
                description: 'Step 2: "-" 뒤의 그룹을 괄호로 묶습니다 → 55-(50+40)',
                action: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> - <span style="color:#e17055;border:2px dashed #e17055;padding:2px 8px;border-radius:6px;">(50+40)</span>';
                    infoEl.innerHTML = '괄호를 넣으면: 55 - <strong>(50+40)</strong>';
                },
                undo: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> <span style="color:var(--red);font-size:1.5rem;">-</span> <span style="color:#e17055;">50+40</span>';
                    infoEl.innerHTML = '그룹 1: <strong>55</strong>, 그룹 2: <strong>50+40</strong>';
                }
            },
            {
                description: 'Step 3: 각 그룹의 합을 계산합니다.',
                action: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> - <span style="color:#e17055;">(90)</span>';
                    infoEl.innerHTML = '그룹 1 합: <strong>55</strong>, 그룹 2 합: 50+40 = <strong>90</strong>';
                },
                undo: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> - <span style="color:#e17055;border:2px dashed #e17055;padding:2px 8px;border-radius:6px;">(50+40)</span>';
                    infoEl.innerHTML = '괄호를 넣으면: 55 - <strong>(50+40)</strong>';
                }
            },
            {
                description: 'Step 4: 첫 그룹은 더하고 나머지는 빼기 → 55 - 90 = -35',
                action: function() {
                    exprEl.innerHTML = '55 - 90 = <span style="color:var(--green);font-size:1.5rem;">-35</span>';
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최솟값: -35</strong>';
                },
                undo: function() {
                    exprEl.innerHTML = '<span style="color:var(--accent);">55</span> - <span style="color:#e17055;">(90)</span>';
                    infoEl.innerHTML = '그룹 1 합: <strong>55</strong>, 그룹 2 합: <strong>90</strong>';
                }
            },
            {
                description: '완성! 핵심: 첫 번째 "-" 뒤의 모든 수를 괄호로 묶어 빼면 최솟값!',
                action: function() {
                    exprEl.innerHTML = '55 - <span style="border:2px solid var(--green);padding:2px 8px;border-radius:6px;color:var(--green);">(50 + 40)</span> = <strong style="color:var(--green);">-35</strong>';
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: -35 (괄호로 "-" 뒤를 전부 빼기!)</strong>';
                },
                undo: function() {
                    exprEl.innerHTML = '55 - 90 = <span style="color:var(--green);font-size:1.5rem;">-35</span>';
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최솟값: -35</strong>';
                }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 5: 주유소 (boj-13305)
    // ====================================================================
    _renderVizGas(container) {
        var self = this, suffix = '-gas';
        var dist = [2, 3, 1];
        var price = [5, 2, 4, 1];
        var N = 4;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">주유소 — 최소 비용 이동</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">도시 ' + N + '개, 거리: [' + dist.join(', ') + '], 기름값: [' + price.join(', ') + ']</p>' +
            '<div id="gs-road' + suffix + '" style="position:relative;height:100px;margin:16px 0;"></div>' +
            '<div id="gs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var roadEl = container.querySelector('#gs-road' + suffix);
        var infoEl = container.querySelector('#gs-info' + suffix);
        var totalDist = 0;
        for (var d = 0; d < dist.length; d++) totalDist += dist[d];
        function renderRoad(curCity, minP, costs) {
            var html = '<div style="position:absolute;left:5%;right:5%;top:45px;height:4px;background:var(--border);border-radius:2px;"></div>';
            var cumDist = 0;
            for (var i = 0; i < N; i++) {
                var pct = 5 + (cumDist / totalDist) * 90;
                var isCur = (curCity === i);
                var usedPrice = costs && costs[i] !== undefined;
                html += '<div style="position:absolute;left:' + pct + '%;top:20px;transform:translateX(-50%);text-align:center;">' +
                    '<div style="font-size:0.75rem;color:var(--text3);">도시 ' + (i + 1) + '</div>' +
                    '<div style="width:16px;height:16px;border-radius:50%;margin:4px auto;background:' + (isCur ? 'var(--accent)' : usedPrice ? 'var(--green)' : 'var(--text3)') + ';"></div>' +
                    '<div style="font-size:0.8rem;font-weight:600;color:' + (isCur ? 'var(--accent)' : 'var(--text2)') + ';">' + price[i] + '원/L</div></div>';
                if (i < N - 1) {
                    var nextPct = 5 + ((cumDist + dist[i]) / totalDist) * 90;
                    var midPct = (pct + nextPct) / 2;
                    html += '<div style="position:absolute;left:' + midPct + '%;top:54px;transform:translateX(-50%);font-size:0.7rem;color:var(--text3);">' + dist[i] + 'km</div>';
                    cumDist += dist[i];
                }
            }
            roadEl.innerHTML = html;
        }
        renderRoad(-1, -1, null);
        infoEl.innerHTML = '<span style="color:var(--text2);">지금까지 본 최소 가격으로 기름을 넣습니다.</span>';
        var steps = [];
        var minPrice = price[0], totalCost = 0, costMap = {};
        for (var ci = 0; ci < N - 1; ci++) {
            if (price[ci] < minPrice) minPrice = price[ci];
            var segCost = minPrice * dist[ci];
            totalCost += segCost;
            costMap[ci] = segCost;
            var cMinP = minPrice, cTotal = totalCost, cCity = ci, cSegCost = segCost, cDist = dist[ci];
            (function(cCity, cMinP, cTotal, cSegCost, cDist) {
                steps.push({
                    description: '도시 ' + (cCity + 1) + ': 최소가격 ' + cMinP + '원 × ' + cDist + 'km = ' + cSegCost + '원 (누적: ' + cTotal + '원)',
                    action: function() { renderRoad(cCity, cMinP, costMap); infoEl.innerHTML = '도시 ' + (cCity + 1) + ': <strong>' + cMinP + '원/L</strong> × ' + cDist + 'km = ' + cSegCost + '원, 누적: <strong>' + cTotal + '원</strong>'; },
                    undo: function() { renderRoad(-1, -1, null); infoEl.innerHTML = '<span style="color:var(--text2);">지금까지 본 최소 가격으로 기름을 넣습니다.</span>'; }
                });
            })(cCity, cMinP, cTotal, cSegCost, cDist);
        }
        var finalCost = totalCost;
        steps.push({
            description: '완성! 최소 비용 = ' + finalCost + '원',
            action: function() { renderRoad(N - 1, -1, costMap); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최소 비용: ' + finalCost + '원</strong>'; },
            undo: function() { renderRoad(-1, -1, null); }
        });
        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 그리디', desc: '간단한 탐욕 선택 (Silver IV)', problemIds: ['boj-11047', 'boj-11399'] },
        { num: 2, title: '정렬 + 그리디', desc: '정렬이 핵심인 그리디 (Silver I~II)', problemIds: ['boj-1931', 'boj-1541'] },
        { num: 3, title: '응용 그리디', desc: '조건이 복잡한 그리디 (Silver III)', problemIds: ['boj-13305'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 기본 그리디 ==========
        {
            id: 'boj-11047',
            title: 'BOJ 11047 - 동전 0',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11047',
            simIntro: '큰 동전부터 차례로 사용하는 그리디 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>준규가 가지고 있는 동전은 총 N종류이고, 각각의 동전을 매우 많이 가지고 있습니다. 동전을 적절히 사용해서 그 가치의 합을 K로 만들려고 합니다. 이때 필요한 동전 개수의 최솟값을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 N과 K가 주어진다. (1 ≤ N ≤ 10, 1 ≤ K ≤ 100,000,000)<br>둘째 줄부터 N개의 줄에 동전의 가치 Ai가 오름차순으로 주어진다. (A1 = 1, Ai는 Ai-1의 배수)</p></div><div><h4>출력</h4><p>K원을 만드는데 필요한 동전 개수의 최솟값을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>10 4200\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div><div><strong>출력</strong><pre>6</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '동전이 항상 이전 동전의 배수이므로, <strong>가장 큰 동전부터</strong> 최대한 많이 사용하면 됩니다.' },
                { title: '핵심 코드', content: '큰 동전부터 반복하면서 <code>count += K // coin</code>, <code>K %= coin</code>을 반복합니다.' },
                { title: '왜 그리디가 되나요?', content: '동전이 배수 관계이기 때문에, 작은 동전 여러 개 = 큰 동전 하나로 항상 바꿀 수 있습니다. 따라서 큰 것부터 쓰는 것이 항상 최적입니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]\n\ncount = 0\nfor coin in reversed(coins):    # 큰 동전부터\n    count += K // coin\n    K %= coin\n\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    int coins[10];\n    for (int i = 0; i < N; i++) cin >> coins[i];\n\n    int count = 0;\n    for (int i = N - 1; i >= 0; i--) {\n        count += K / coins[i];\n        K %= coins[i];\n    }\n    cout << count << endl;\n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt(), K = sc.nextInt();\n        int[] coins = new int[N];\n        for (int i = 0; i < N; i++) coins[i] = sc.nextInt();\n\n        int count = 0;\n        for (int i = N - 1; i >= 0; i--) {\n            count += K / coins[i];\n            K %= coins[i];\n        }\n        System.out.println(count);\n    }\n}'
            },
            solutions: [{
                approach: '큰 동전부터 그리디',
                description: '가장 큰 동전부터 최대한 사용하여 동전 수를 최소화합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]' },
                        { title: '큰 동전부터 그리디', code: 'count = 0\nfor coin in reversed(coins):    # 큰 동전부터\n    count += K // coin\n    K %= coin' },
                        { title: '출력', code: 'print(count)' }
                    ]
                },
                get templates() { return greedyTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-11399',
            title: 'BOJ 11399 - ATM',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11399',
            simIntro: '짧은 시간 순서로 정렬하여 총 대기시간을 최소화하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>ATM 앞에 N명이 줄을 서 있습니다. i번 사람이 돈을 인출하는 데 Pi분이 걸립니다. 각 사람이 돈을 인출하는 데 필요한 시간의 합이 최소가 되도록 줄을 세우고, 그 최솟값을 구하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 사람의 수 N (1 ≤ N ≤ 1,000)<br>둘째 줄에 각 사람의 인출 시간 Pi (1 ≤ Pi ≤ 1,000)</p></div><div><h4>출력</h4><p>각 사람이 돈을 인출하는 데 필요한 시간의 합의 최솟값</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5\n3 1 4 3 2</pre></div><div><strong>출력</strong><pre>32</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '앞 사람이 오래 걸리면 뒤의 <strong>모든 사람이 기다려야</strong> 합니다. 따라서 <strong>짧은 시간 순서</strong>로 줄을 세워야 합니다.' },
                { title: '핵심 공식', content: '오름차순 정렬 후, i번째 사람의 대기시간 = <code>P[0] + P[1] + ... + P[i]</code><br>전체 합 = 이 누적합들의 합입니다.' },
                { title: '간단한 계산법', content: 'i번째(0-indexed) 사람의 시간은 (N-i)번 더해집니다.<br>따라서 답 = <code>Σ P[i] × (N - i)</code> (정렬 후)' }
            ],
            templates: {
                python: 'N = int(input())\nP = list(map(int, input().split()))\n\nP.sort()    # 짧은 시간부터\n\ntotal = 0\nacc = 0\nfor p in P:\n    acc += p        # 누적 대기시간\n    total += acc    # 각 사람의 대기시간 더하기\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    int P[1000];\n    for (int i = 0; i < N; i++) cin >> P[i];\n\n    sort(P, P + N);\n\n    int total = 0, acc = 0;\n    for (int i = 0; i < N; i++) {\n        acc += P[i];\n        total += acc;\n    }\n    cout << total << endl;\n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int N = sc.nextInt();\n        int[] P = new int[N];\n        for (int i = 0; i < N; i++) P[i] = sc.nextInt();\n\n        Arrays.sort(P);\n\n        int total = 0, acc = 0;\n        for (int p : P) {\n            acc += p;\n            total += acc;\n        }\n        System.out.println(total);\n    }\n}'
            },
            solutions: [{
                approach: '정렬 + 누적합',
                description: '오름차순 정렬 후 누적 대기시간의 합을 구합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'N = int(input())\nP = list(map(int, input().split()))' },
                        { title: '정렬', code: 'P.sort()    # 짧은 시간부터' },
                        { title: '누적합 계산', code: 'total = 0\nacc = 0\nfor p in P:\n    acc += p        # 누적 대기시간\n    total += acc    # 각 사람의 대기시간 더하기' },
                        { title: '출력', code: 'print(total)' }
                    ]
                },
                get templates() { return greedyTopic.problems[1].templates; }
            }]
        },

        // ========== 2단계: 정렬 + 그리디 ==========
        {
            id: 'boj-1931',
            title: 'BOJ 1931 - 회의실 배정',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1931',
            simIntro: '끝나는 시간 기준으로 정렬하고 선택하는 활동 선택 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>한 개의 회의실에 N개의 회의가 신청되었습니다. 각 회의의 시작시간과 끝나는 시간이 주어집니다. 겹치지 않게 회의실을 사용할 수 있는 회의의 최대 개수를 구하시오.</p><p>한 회의가 끝나는 것과 동시에 다음 회의가 시작될 수 있습니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 회의의 수 N (1 ≤ N ≤ 100,000)<br>둘째 줄부터 각 회의의 시작시간과 끝나는 시간이 주어진다.</p></div><div><h4>출력</h4><p>최대 사용할 수 있는 회의의 수를 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '회의를 <strong>끝나는 시간</strong> 기준으로 오름차순 정렬합니다. 끝나는 시간이 같으면 시작 시간 기준 오름차순 정렬합니다.' },
                { title: '선택 기준', content: '이전에 선택한 회의의 끝나는 시간 이후에 시작하는 회의만 선택합니다.<br><code>if start >= last_end: 선택</code>' },
                { title: '왜 끝나는 시간 기준?', content: '일찍 끝나는 회의를 선택해야 남은 시간이 최대한 확보되어, 더 많은 회의를 넣을 수 있습니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))     # (끝, 시작) 으로 저장\n\nmeetings.sort()     # 끝나는 시간 기준 정렬\n\ncount = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end\n\nprint(count)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N;\n    cin >> N;\n    vector<pair<int,int>> meetings(N);\n    for (int i = 0; i < N; i++) {\n        int s, e;\n        cin >> s >> e;\n        meetings[i] = {e, s};  // {끝, 시작}\n    }\n    sort(meetings.begin(), meetings.end());\n\n    int count = 0, lastEnd = 0;\n    for (auto& [end, start] : meetings) {\n        if (start >= lastEnd) {\n            count++;\n            lastEnd = end;\n        }\n    }\n    cout << count << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int[][] meetings = new int[N][2];\n        for (int i = 0; i < N; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            meetings[i][0] = Integer.parseInt(st.nextToken());\n            meetings[i][1] = Integer.parseInt(st.nextToken());\n        }\n        Arrays.sort(meetings, (a, b) -> a[1] != b[1] ? a[1] - b[1] : a[0] - b[0]);\n\n        int count = 0, lastEnd = 0;\n        for (int[] m : meetings) {\n            if (m[0] >= lastEnd) {\n                count++;\n                lastEnd = m[1];\n            }\n        }\n        System.out.println(count);\n    }\n}'
            },
            solutions: [{
                approach: '끝나는 시간 기준 정렬 + 그리디',
                description: '끝나는 시간 기준으로 정렬하고 겹치지 않는 회의를 선택합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))' },
                        { title: '끝나는 시간 기준 정렬', code: 'meetings.sort()     # 끝나는 시간 기준 정렬' },
                        { title: '그리디 선택', code: 'count = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end' },
                        { title: '출력', code: 'print(count)' }
                    ]
                },
                get templates() { return greedyTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1541',
            title: 'BOJ 1541 - 잃어버린 괄호',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1541',
            simIntro: '수식에서 "-" 뒤에 괄호를 넣어 값을 최소화하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>양수와 +, -로 이루어진 식이 주어졌을 때, 괄호를 적절히 쳐서 식의 값을 최소로 만드시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 식이 주어진다. 식은 0~9, +, -로만 이루어져 있다. 길이는 50 이하이다.</p></div><div><h4>출력</h4><p>괄호를 쳐서 만들 수 있는 식의 최솟값을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>55-50+40</pre></div><div><strong>출력</strong><pre>-35</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '첫 번째 <code>-</code> 뒤에 나오는 모든 수를 빼면 최솟값이 됩니다! <code>-</code> 뒤의 <code>+</code>를 괄호로 묶으면 전부 빼기가 됩니다.' },
                { title: '핵심 아이디어', content: '식을 <code>-</code> 기준으로 나눕니다. 각 그룹 안의 <code>+</code>로 연결된 수들을 합칩니다.<br>첫 그룹은 더하고, 나머지 그룹은 모두 뺍니다.' },
                { title: '예시', content: '<code>55-50+40</code> → [55], [50+40=90]<br>55 - 90 = <strong>-35</strong>' }
            ],
            templates: {
                python: 'expr = input()\n\n# \'-\' 기준으로 나누기\ngroups = expr.split(\'-\')\n\n# 각 그룹 안의 수들을 더하기\nsums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))\n\n# 첫 그룹은 더하고, 나머지는 빼기\nresult = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)',
                cpp: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string expr;\n    cin >> expr;\n\n    int result = 0;\n    bool isFirst = true;\n\n    stringstream full(expr);\n    string segment;\n    while (getline(full, segment, \'-\')) {\n        int groupSum = 0;\n        stringstream gs(segment);\n        string num;\n        while (getline(gs, num, \'+\')) {\n            groupSum += stoi(num);\n        }\n        if (isFirst) {\n            result += groupSum;\n            isFirst = false;\n        } else {\n            result -= groupSum;\n        }\n    }\n\n    cout << result << endl;\n    return 0;\n}',
                java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String expr = sc.next();\n\n        String[] groups = expr.split("-");\n        int result = 0;\n\n        for (int g = 0; g < groups.length; g++) {\n            int groupSum = 0;\n            for (String num : groups[g].split("\\\\+")) {\n                groupSum += Integer.parseInt(num);\n            }\n            if (g == 0) result += groupSum;\n            else result -= groupSum;\n        }\n\n        System.out.println(result);\n    }\n}'
            },
            solutions: [{
                approach: '"- 뒤 전부 빼기" 그리디',
                description: '"-" 기준으로 그룹을 나누고, 첫 그룹만 더하고 나머지는 전부 뺍니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'expr = input()' },
                        { title: '"-" 기준 분리', code: 'groups = expr.split(\'-\')' },
                        { title: '각 그룹 합산', code: 'sums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))' },
                        { title: '첫 그룹 더하고 나머지 빼기', code: 'result = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)' }
                    ]
                },
                get templates() { return greedyTopic.problems[3].templates; }
            }]
        },

        // ========== 3단계: 응용 그리디 ==========
        {
            id: 'boj-13305',
            title: 'BOJ 13305 - 주유소',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/13305',
            simIntro: '도시별 기름값을 비교하며 최소 비용으로 이동하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 도시가 일직선 도로 위에 있습니다. 제일 왼쪽 도시에서 제일 오른쪽 도시로 이동하려고 합니다. 각 도시에 주유소가 있고, 리터당 가격이 다릅니다. 1km마다 1리터를 사용합니다. 최소 비용으로 이동하시오.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄에 도시의 수 N (2 ≤ N ≤ 100,000)<br>둘째 줄에 인접한 도시 사이 도로 길이 N-1개<br>셋째 줄에 각 도시의 주유소 리터당 가격 N개</p></div><div><h4>출력</h4><p>최소 비용을 출력한다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>4\n2 3 1\n5 2 4 1</pre></div><div><strong>출력</strong><pre>18</pre></div></div></div>',
            hints: [
                { title: '접근법', content: '왼쪽에서 오른쪽으로 이동하면서, <strong>지금까지 본 가장 싼 가격</strong>을 기억합니다. 각 구간에서는 그 최소 가격으로 기름을 넣습니다.' },
                { title: '핵심 아이디어', content: '더 싼 주유소를 만나면 최소 가격을 갱신합니다.<br>각 도로 구간의 비용 = <code>min(지금까지의 최소 가격) × 도로 길이</code>' },
                { title: '주의할 점', content: '값이 매우 커질 수 있으므로 Python은 자동으로 되지만, C++/Java는 <strong>long long</strong> 타입을 사용해야 합니다. 마지막 도시의 가격은 사용하지 않습니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))\n\nmin_price = price[0]\ntotal = 0\n\nfor i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n\n    long long dist[100000], price[100000];\n    for (int i = 0; i < N - 1; i++) cin >> dist[i];\n    for (int i = 0; i < N; i++) cin >> price[i];\n\n    long long minPrice = price[0];\n    long long total = 0;\n\n    for (int i = 0; i < N - 1; i++) {\n        minPrice = min(minPrice, price[i]);\n        total += minPrice * dist[i];\n    }\n\n    cout << total << endl;\n    return 0;\n}',
                java: 'import java.io.*;\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        long[] dist = new long[N - 1];\n        for (int i = 0; i < N - 1; i++) dist[i] = Long.parseLong(st.nextToken());\n\n        st = new StringTokenizer(br.readLine());\n        long[] price = new long[N];\n        for (int i = 0; i < N; i++) price[i] = Long.parseLong(st.nextToken());\n\n        long minPrice = price[0];\n        long total = 0;\n\n        for (int i = 0; i < N - 1; i++) {\n            minPrice = Math.min(minPrice, price[i]);\n            total += minPrice * dist[i];\n        }\n\n        System.out.println(total);\n    }\n}'
            },
            solutions: [{
                approach: '최소 가격 추적 그리디',
                description: '지금까지 본 최소 기름값을 유지하며 각 구간 비용을 계산합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))' },
                        { title: '초기 최소 가격', code: 'min_price = price[0]\ntotal = 0' },
                        { title: '그리디 순회', code: 'for i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]' },
                        { title: '출력', code: 'print(total)' }
                    ]
                },
                get templates() { return greedyTopic.problems[4].templates; }
            }]
        }
    ],

    // ===== 역호환 스텁 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { greedyTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.greedy = greedyTopic;
