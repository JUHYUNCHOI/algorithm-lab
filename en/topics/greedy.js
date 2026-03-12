// ===== 그리디 알고리즘 토픽 모듈 =====
var greedyTopic = {
    id: 'greedy',
    title: '그리디',
    icon: '🏆',
    category: 'Algorithm Techniques',
    order: 12,
    description: '지금 당장 가장 좋은 선택을 반복하는 기법',
    relatedNote: '그리디는 정렬, 우선순위 큐와 함께 사용되는 경우가 많으며, 최적해를 보장하는지 증명하는 것이 핵심입니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-11047': { type: '동전 문제', color: 'var(--accent)', vizMethod: '_renderVizCoin', suffix: '-coin' },
        'boj-11399': { type: '정렬 기반', color: 'var(--green)', vizMethod: '_renderVizATM', suffix: '-atm' },
        'boj-1931':  { type: '활동 선택', color: '#e17055', vizMethod: '_renderVizMeeting', suffix: '-meet' },
        'boj-1541':  { type: '괄호 배치', color: '#6c5ce7', vizMethod: '_renderVizBracket', suffix: '-brk' },
        'boj-13305': { type: '최소 비용', color: '#00b894', vizMethod: '_renderVizGas', suffix: '-gas' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || '그리디 알고리즘이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
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
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
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
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
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
                    <strong>Understanding by analogy:</strong> 편의점에서 거스름돈을 줄 때를 생각해 보세요.<br>
                    거슬러 줘야 할 금액이 <strong>1,260원</strong>이라면?<br><br>
                    <strong>가장 큰 동전부터</strong> 최대한 많이 사용합니다:<br>
                    1000원 × 1개 → 남은 260원<br>
                    100원 × 2개 → 남은 60원<br>
                    50원 × 1개 → 남은 10원<br>
                    10원 × 1개 → 남은 0원<br><br>
                    이렇게 <strong>매번 지금 줄 수 있는 가장 큰 동전을 선택</strong>하는 것이 그리디입니다!
                </div>

                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># 거스름돈 문제 (그리디)
coins = [1000, 500, 100, 50, 10]  # 큰 것부터
change = 1260
count = 0

for coin in coins:
    count += change // coin   # 이 동전을 최대한 많이 사용
    change %= coin            # 남은 금액 갱신

print(count)  # 5개</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int main() {
    // 거스름돈 문제 (그리디)
    vector&lt;int&gt; coins = {1000, 500, 100, 50, 10};  // 큰 것부터
    int change = 1260;
    int count = 0;

    for (int coin : coins) {
        count += change / coin;   // 이 동전을 최대한 많이 사용
        change %= coin;           // 남은 금액 갱신
    }

    cout &lt;&lt; count &lt;&lt; endl;  // 5개
    return 0;
}</code></pre></div></span>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">거스름돈이 4,730원이라면 동전은 최소 몇 개 필요할까요? (1000, 500, 100, 50, 10원)</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
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
                <div style="margin-top:0.6rem;">
                    <a href="https://en.wikipedia.org/wiki/Greedy_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Greedy Algorithm (탐욕 선택 속성 & 최적 부분 구조) ↗</a>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">동전이 100원, 70원, 10원짜리만 있을 때, 120원을 그리디로 거슬러 주면 어떻게 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
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
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
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
                <div style="margin-top:0.6rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/functions.html#sorted" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: sorted() & key 파라미터 ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: std::sort ↗</a></span>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"줄 서는 순서를 바꿔서 전체 대기시간을 최소로" — 어떤 기준으로 정렬해야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
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
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
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
            if (idx < 0) { indicator.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
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
    // Simulation 1: 동전 0 (boj-11047)
    // ====================================================================
    _renderVizCoin(container) {
        var self = this, suffix = '-coin';
        var coins = [1000, 500, 100, 50, 10, 1];
        var DEFAULT_K = 4200;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">동전 거스름돈 — 큰 동전부터</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">거스름돈 (K): <input type="number" id="gr-coin-input" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
                '<button class="btn btn-primary" id="gr-coin-reset">🔄</button>' +
            '</div>' +
            '<div id="cn-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cn-coins' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#cn-desc' + suffix);
        var coinsEl = container.querySelector('#cn-coins' + suffix);
        var infoEl = container.querySelector('#cn-info' + suffix);

        function buildAndRun(K) {
            self._clearVizState();
            descEl.innerHTML = 'K=<strong>' + K + '</strong>원을 동전 [' + coins.join(', ') + ']으로 거슬러 줍니다.';
            var usedSoFar = {};
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
            var rem = K, totalCount = 0;
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
        }
        container.querySelector('#gr-coin-reset').addEventListener('click', function() {
            var val = parseInt(container.querySelector('#gr-coin-input').value);
            if (isNaN(val) || val <= 0) val = DEFAULT_K;
            buildAndRun(val);
        });
        buildAndRun(DEFAULT_K);
    },

    // ====================================================================
    // Simulation 2: ATM (boj-11399)
    // ====================================================================
    _renderVizATM(container) {
        var self = this, suffix = '-atm';
        var DEFAULT_ARR = '3, 1, 4, 3, 2';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">ATM 대기시간 최소화</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">인출 시간: <input type="text" id="gr-atm-input" value="' + DEFAULT_ARR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="gr-atm-reset">🔄</button>' +
            '</div>' +
            '<div id="atm-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="atm-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="atm-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#atm-desc' + suffix);
        var barsEl = container.querySelector('#atm-bars' + suffix);
        var infoEl = container.querySelector('#atm-info' + suffix);

        function buildAndRun(original) {
            self._clearVizState();
            var sorted = original.slice().sort(function(a, b) { return a - b; });
            descEl.innerHTML = '인출 시간: [' + original.join(', ') + '] → 정렬: [' + sorted.join(', ') + ']';
            var maxVal = Math.max.apply(null, sorted);
            function renderBars(highlight, accValues) {
                barsEl.innerHTML = sorted.map(function(v, i) {
                    var pct = maxVal > 0 ? (v / maxVal) * 100 : 0;
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
        }
        container.querySelector('#gr-atm-reset').addEventListener('click', function() {
            var arr = container.querySelector('#gr-atm-input').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            if (arr.length === 0) arr = [3, 1, 4, 3, 2];
            buildAndRun(arr);
        });
        buildAndRun([3, 1, 4, 3, 2]);
    },

    // ====================================================================
    // Simulation 3: 회의실 배정 (boj-1931)
    // ====================================================================
    _renderVizMeeting(container) {
        var self = this, suffix = '-meet';
        var DEFAULT_MEETINGS = '1 4, 3 5, 0 6, 5 7, 3 8, 5 9, 6 10, 8 11, 8 12, 2 13, 12 14';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">회의실 배정 — 끝나는 시간 기준 정렬</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">회의 (시작 끝, ...): <input type="text" id="gr-meet-input" value="' + DEFAULT_MEETINGS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:360px;"></label>' +
                '<button class="btn btn-primary" id="gr-meet-reset">🔄</button>' +
            '</div>' +
            '<div id="mt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="mt-area' + suffix + '" style="position:relative;margin-bottom:12px;border-left:2px solid var(--border);padding-left:40px;"></div>' +
            '<div id="mt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#mt-desc' + suffix);
        var areaEl = container.querySelector('#mt-area' + suffix);
        var infoEl = container.querySelector('#mt-info' + suffix);

        function buildAndRun(meetings) {
            self._clearVizState();
            var sorted = meetings.slice().sort(function(a, b) { return a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]; });
            var maxTime = 0;
            for (var i = 0; i < sorted.length; i++) { if (sorted[i][1] > maxTime) maxTime = sorted[i][1]; }
            descEl.innerHTML = sorted.length + '개 회의를 끝나는 시간 기준으로 정렬 후 선택합니다.';
            areaEl.style.minHeight = (sorted.length * 32 + 30) + 'px';
            var timelineHTML = '';
            var tickStep = maxTime <= 15 ? 1 : maxTime <= 30 ? 2 : 5;
            for (var ti = 0; ti <= maxTime; ti += tickStep) {
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
                                if (bar) { bar.style.background = 'var(--green)'; bar.style.borderColor = 'var(--green)'; bar.style.color = 'white'; }
                                infoEl.innerHTML = '선택: <strong style="color:var(--green);">' + cnt + '개</strong> | 마지막 종료: ' + end;
                            },
                            undo: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)'; }
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
                                if (bar) { bar.style.background = 'var(--red)15'; bar.style.borderColor = 'var(--red)'; bar.style.color = 'var(--red)'; bar.style.opacity = '0.5'; }
                            },
                            undo: function() {
                                var bar = container.querySelector('#mt-bar-' + i + suffix);
                                if (bar) { bar.style.background = 'var(--bg2)'; bar.style.borderColor = 'var(--border)'; bar.style.color = 'var(--text2)'; bar.style.opacity = '1'; }
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
        }
        function parseMeetings(str) {
            var pairs = str.split(',');
            var result = [];
            for (var i = 0; i < pairs.length; i++) {
                var nums = pairs[i].trim().split(/\s+/).map(Number);
                if (nums.length >= 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    result.push([nums[0], nums[1]]);
                }
            }
            return result;
        }
        container.querySelector('#gr-meet-reset').addEventListener('click', function() {
            var meetings = parseMeetings(container.querySelector('#gr-meet-input').value);
            if (meetings.length === 0) meetings = [[1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]];
            buildAndRun(meetings);
        });
        buildAndRun([[1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]]);
    },

    // ====================================================================
    // Simulation 4: 잃어버린 괄호 (boj-1541)
    // ====================================================================
    _renderVizBracket(container) {
        var self = this, suffix = '-brk';
        var DEFAULT_EXPR = '55-50+40-30+20-10';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">잃어버린 괄호 — 최솟값 만들기</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">수식: <input type="text" id="gr-bracket-input" value="' + DEFAULT_EXPR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="gr-bracket-reset">🔄</button>' +
            '</div>' +
            '<div id="bk-expr' + suffix + '" style="font-size:1.3rem;font-weight:700;text-align:center;padding:16px;background:var(--bg);border-radius:8px;margin-bottom:12px;font-family:monospace;"></div>' +
            '<div id="bk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var exprEl = container.querySelector('#bk-expr' + suffix);
        var infoEl = container.querySelector('#bk-info' + suffix);

        function buildAndRun(expr) {
            self._clearVizState();
            // parse expression into groups split by '-'
            var groups = expr.split('-');
            var sums = [];
            var groupTexts = [];
            for (var g = 0; g < groups.length; g++) {
                var parts = groups[g].split('+').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                var s = 0;
                for (var p = 0; p < parts.length; p++) s += parts[p];
                sums.push(s);
                groupTexts.push(groups[g].trim());
            }
            var result = sums[0];
            for (var r = 1; r < sums.length; r++) result -= sums[r];

            exprEl.innerHTML = expr;
            infoEl.innerHTML = '<span style="color:var(--text2);">"-" 뒤에 괄호를 넣어 뺄 수 있는 값을 최대로 만듭니다.</span>';

            var steps = [];
            // Step 1: split by '-'
            var groupLabels = groups.map(function(gt, gi) {
                return gi === 0
                    ? '<span style="color:var(--accent);">' + gt.trim() + '</span>'
                    : '<span style="color:#e17055;">' + gt.trim() + '</span>';
            });
            var splitDisplay = groupLabels.join(' <span style="color:var(--red);font-size:1.5rem;">-</span> ');
            var groupDescParts = groups.map(function(gt, gi) { return '그룹 ' + (gi + 1) + ': <strong>' + gt.trim() + '</strong>'; });
            steps.push({
                description: 'Step 1: 수식을 "-" 기준으로 ' + groups.length + '개 그룹으로 분리합니다.',
                action: function() {
                    exprEl.innerHTML = splitDisplay;
                    infoEl.innerHTML = groupDescParts.join(', ');
                },
                undo: function() { exprEl.innerHTML = expr; infoEl.innerHTML = '<span style="color:var(--text2);">"-" 뒤에 괄호를 넣어 뺄 수 있는 값을 최대로 만듭니다.</span>'; }
            });
            // Step 2: wrap groups after first '-' in parentheses
            if (groups.length > 1) {
                var bracketParts = groups.slice(1).map(function(gt) { return gt.trim(); });
                var bracketExpr = bracketParts.join('+');
                var wrappedDisplay = '<span style="color:var(--accent);">' + groups[0].trim() + '</span> - <span style="color:#e17055;border:2px dashed #e17055;padding:2px 8px;border-radius:6px;">(' + bracketExpr + ')</span>';
                steps.push({
                    description: 'Step 2: "-" 뒤의 그룹들을 괄호로 묶습니다.',
                    action: function() {
                        exprEl.innerHTML = wrappedDisplay;
                        infoEl.innerHTML = '괄호를 넣으면: ' + groups[0].trim() + ' - <strong>(' + bracketExpr + ')</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = splitDisplay;
                        infoEl.innerHTML = groupDescParts.join(', ');
                    }
                });
                // Step 3: compute each group sum
                var restSum = 0;
                for (var rs = 1; rs < sums.length; rs++) restSum += sums[rs];
                var sumDescs = groups.map(function(gt, gi) {
                    return '그룹 ' + (gi + 1) + ' 합: ' + (groupTexts[gi].indexOf('+') >= 0 ? groupTexts[gi] + ' = ' : '') + '<strong>' + sums[gi] + '</strong>';
                });
                steps.push({
                    description: 'Step 3: 각 그룹의 합을 계산합니다.',
                    action: function() {
                        exprEl.innerHTML = '<span style="color:var(--accent);">' + sums[0] + '</span> - <span style="color:#e17055;">(' + restSum + ')</span>';
                        infoEl.innerHTML = sumDescs.join(', ');
                    },
                    undo: function() {
                        exprEl.innerHTML = wrappedDisplay;
                        infoEl.innerHTML = '괄호를 넣으면: ' + groups[0].trim() + ' - <strong>(' + bracketExpr + ')</strong>';
                    }
                });
                // Step 4: compute result
                steps.push({
                    description: 'Step 4: 첫 그룹은 더하고 나머지는 빼기 → ' + sums[0] + ' - ' + restSum + ' = ' + result,
                    action: function() {
                        exprEl.innerHTML = sums[0] + ' - ' + restSum + ' = <span style="color:var(--green);font-size:1.5rem;">' + result + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최솟값: ' + result + '</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = '<span style="color:var(--accent);">' + sums[0] + '</span> - <span style="color:#e17055;">(' + restSum + ')</span>';
                        infoEl.innerHTML = sumDescs.join(', ');
                    }
                });
                // Step 5: final confirmation
                steps.push({
                    description: '완성! 핵심: 첫 번째 "-" 뒤의 모든 수를 괄호로 묶어 빼면 최솟값!',
                    action: function() {
                        exprEl.innerHTML = sums[0] + ' - <span style="border:2px solid var(--green);padding:2px 8px;border-radius:6px;color:var(--green);">(' + bracketExpr + ')</span> = <strong style="color:var(--green);">' + result + '</strong>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: ' + result + ' (괄호로 "-" 뒤를 전부 빼기!)</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = sums[0] + ' - ' + restSum + ' = <span style="color:var(--green);font-size:1.5rem;">' + result + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 최솟값: ' + result + '</strong>';
                    }
                });
            } else {
                // No '-' in expression — result is just the sum
                steps.push({
                    description: '수식에 "-"가 없어서 결과는 그대로 ' + sums[0] + '입니다.',
                    action: function() {
                        exprEl.innerHTML = '<span style="color:var(--green);font-size:1.5rem;">' + sums[0] + '</span>';
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 결과: ' + sums[0] + '</strong>';
                    },
                    undo: function() {
                        exprEl.innerHTML = splitDisplay;
                        infoEl.innerHTML = groupDescParts.join(', ');
                    }
                });
            }
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-bracket-reset').addEventListener('click', function() {
            var val = container.querySelector('#gr-bracket-input').value.trim();
            if (!val) val = DEFAULT_EXPR;
            buildAndRun(val);
        });
        buildAndRun(DEFAULT_EXPR);
    },

    // ====================================================================
    // Simulation 5: 주유소 (boj-13305)
    // ====================================================================
    _renderVizGas(container) {
        var self = this, suffix = '-gas';
        var DEFAULT_DIST = '2, 3, 1';
        var DEFAULT_PRICE = '5, 2, 4, 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">주유소 — 최소 비용 이동</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">거리: <input type="text" id="gr-gas-dist" value="' + DEFAULT_DIST + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
                '<label style="font-weight:600;">기름값: <input type="text" id="gr-gas-price" value="' + DEFAULT_PRICE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
                '<button class="btn btn-primary" id="gr-gas-reset">🔄</button>' +
            '</div>' +
            '<div id="gs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="gs-road' + suffix + '" style="position:relative;height:100px;margin:16px 0;"></div>' +
            '<div id="gs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var descEl = container.querySelector('#gs-desc' + suffix);
        var roadEl = container.querySelector('#gs-road' + suffix);
        var infoEl = container.querySelector('#gs-info' + suffix);

        function buildAndRun(dist, price) {
            self._clearVizState();
            var N = price.length;
            descEl.innerHTML = '도시 ' + N + '개, 거리: [' + dist.join(', ') + '], 기름값: [' + price.join(', ') + ']';
            var totalDist = 0;
            for (var d = 0; d < dist.length; d++) totalDist += dist[d];
            function renderRoad(curCity, minP, costs) {
                var html = '<div style="position:absolute;left:5%;right:5%;top:45px;height:4px;background:var(--border);border-radius:2px;"></div>';
                var cumDist = 0;
                for (var i = 0; i < N; i++) {
                    var pct = totalDist > 0 ? 5 + (cumDist / totalDist) * 90 : 5 + (i / (N - 1)) * 90;
                    var isCur = (curCity === i);
                    var usedPrice = costs && costs[i] !== undefined;
                    html += '<div style="position:absolute;left:' + pct + '%;top:20px;transform:translateX(-50%);text-align:center;">' +
                        '<div style="font-size:0.75rem;color:var(--text3);">도시 ' + (i + 1) + '</div>' +
                        '<div style="width:16px;height:16px;border-radius:50%;margin:4px auto;background:' + (isCur ? 'var(--accent)' : usedPrice ? 'var(--green)' : 'var(--text3)') + ';"></div>' +
                        '<div style="font-size:0.8rem;font-weight:600;color:' + (isCur ? 'var(--accent)' : 'var(--text2)') + ';">' + price[i] + '원/L</div></div>';
                    if (i < N - 1) {
                        var nextCum = cumDist + dist[i];
                        var nextPct = totalDist > 0 ? 5 + (nextCum / totalDist) * 90 : 5 + ((i + 1) / (N - 1)) * 90;
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
        }
        container.querySelector('#gr-gas-reset').addEventListener('click', function() {
            var distArr = container.querySelector('#gr-gas-dist').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var priceArr = container.querySelector('#gr-gas-price').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            // price should have exactly distArr.length + 1 elements
            if (distArr.length === 0 || priceArr.length === 0) { distArr = [2, 3, 1]; priceArr = [5, 2, 4, 1]; }
            if (priceArr.length < distArr.length + 1) {
                while (priceArr.length < distArr.length + 1) priceArr.push(1);
            } else if (priceArr.length > distArr.length + 1) {
                priceArr = priceArr.slice(0, distArr.length + 1);
            }
            buildAndRun(distArr, priceArr);
        });
        buildAndRun([2, 3, 1], [5, 2, 4, 1]);
    },

    // ===== Empty Stub =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: '기본 그리디', desc: '간단한 탐욕 선택 (Silver IV)', problemIds: ['boj-11047', 'boj-11399'] },
        { num: 2, title: '정렬 + 그리디', desc: '정렬이 핵심인 그리디 (Silver I~II)', problemIds: ['boj-1931', 'boj-1541'] },
        { num: 3, title: '응용 그리디', desc: '조건이 복잡한 그리디 (Silver III)', problemIds: ['boj-13305'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== 1단계: 기본 그리디 ==========
        {
            id: 'boj-11047',
            title: 'BOJ 11047 - 동전 0',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11047',
            simIntro: '큰 동전부터 차례로 사용하는 그리디 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>준규가 가지고 있는 동전은 총 N종류이고, 각각의 동전을 매우 많이 가지고 있다. 동전을 적절히 사용해서 그 가치의 합을 K로 만들려고 한다. 이때 필요한 동전 개수의 최솟값을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 4200\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div>
                    <div><strong>Output</strong><pre>6</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 4790\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div>
                    <div><strong>Output</strong><pre>12</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10</li>
                    <li>1 ≤ K ≤ 100,000,000</li>
                    <li>A<sub>1</sub> = 1</li>
                    <li>A<sub>i</sub>는 A<sub>i-1</sub>의 배수</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '동전 N종류가 있고 금액 K를 만들어야 해. 일단 <strong>가장 작은 동전(1원)부터</strong> 하나씩 채워볼까?<br>1원짜리 K개 쓰면 무조건 만들 수 있긴 해. 근데 동전 수가 너무 많아지겠지...' },
                { title: 'But there\'s a problem with this', content: 'K가 최대 1억이야. 1원짜리로 1억 개? 말이 안 돼!<br>동전 수를 <strong>최소</strong>로 하려면, 큰 동전을 최대한 많이 써야 하지 않을까?<br>예를 들어 4200원을 만들 때, 1000원짜리 4개 쓰면 벌써 4000원이잖아.' },
                { title: 'What if we try this?', content: '<strong>가장 큰 동전부터</strong> 최대한 많이 쓰고, 나머지는 그다음 동전으로 처리하자!<br>이 문제는 동전이 <strong>배수 관계</strong>(A<sub>i</sub>는 A<sub>i-1</sub>의 배수)라서 이 전략이 항상 최적이야.<br>작은 동전 여러 개 = 큰 동전 하나로 항상 바꿀 수 있거든. 그래서 큰 것부터 쓰는 게 손해가 없어!' },
                { title: 'In Python/C++!', content: '큰 동전부터 역순으로 반복하면서:<br><span class="lang-py"><code>count += K // coin</code> → 몫 = 사용 개수<br><code>K %= coin</code> → 나머지 = 남은 금액</span><span class="lang-cpp"><code>count += K / coins[i]</code> → 몫 = 사용 개수<br><code>K %= coins[i]</code> → 나머지 = 남은 금액</span><br>딱 N번 반복이면 끝! O(N)으로 아주 빠르지.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]\n\ncount = 0\nfor coin in reversed(coins):    # 큰 동전부터\n    count += K // coin\n    K %= coin\n\nprint(count)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    int coins[10];\n    for (int i = 0; i < N; i++) cin >> coins[i];\n\n    int count = 0;\n    for (int i = N - 1; i >= 0; i--) {\n        count += K / coins[i];\n        K %= coins[i];\n    }\n    cout << count << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '큰 동전부터 그리디',
                description: '가장 큰 동전부터 최대한 사용하여 동전 수를 최소화합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: 'N종류 동전과 목표 금액 K를 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\ncoins = [int(input()) for _ in range(N)]' },
                        { title: '큰 동전부터 그리디', desc: '큰 동전부터 최대한 사용해야 동전 수가 최소가 됩니다.\n배수 관계이므로 그리디가 항상 최적입니다.', code: 'count = 0\nfor coin in reversed(coins):    # 큰 동전부터\n    count += K // coin\n    K %= coin' },
                        { title: '출력', desc: '최소 동전 개수를 출력합니다.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'N종류 동전과 목표 금액 K를 입력받습니다.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    int coins[10];\n    for (int i = 0; i < N; i++) cin >> coins[i];' },
                        { title: '큰 동전부터 그리디', desc: '큰 동전부터 역순 순회.\n// 나눈 몫 = 사용 개수, 나머지 = 남은 금액.', code: '    int count = 0;\n    for (int i = N - 1; i >= 0; i--) {\n        count += K / coins[i];  // 몫 = 사용 개수\n        K %= coins[i];          // 나머지 = 남은 금액\n    }' },
                        { title: '출력', desc: '최소 동전 개수를 출력합니다.', code: '    cout << count << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
                <h3>Problem</h3>
                <p>인하은행에는 ATM이 1대밖에 없다. 지금 N명이 줄을 서 있다. 각 사람이 돈을 인출하는데 걸리는 시간 Pi가 주어졌을 때, 각 사람이 돈을 인출하는데 필요한 시간의 합의 최솟값을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n3 1 4 3 2</pre></div>
                    <div><strong>Output</strong><pre>32</pre></div>
                </div><p>순서를 1, 2, 3, 3, 4로 바꾸면 1 + 3 + 6 + 9 + 13 = 32</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ P<sub>i</sub> ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'N명이 ATM 앞에 줄 서 있어. 모든 가능한 줄 세우기 순서를 시도해서 총 대기시간이 최소인 걸 찾으면 되지 않을까?<br>순서를 전부 바꿔보면... N! (팩토리얼) 가지야.' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 1,000이면 1000!은 우주가 끝나도 못 세는 수야...<br>잠깐, 생각해 보자. 앞 사람이 오래 걸리면 <strong>뒤의 모든 사람이 기다려야</strong> 해.<br>예: [3, 1]이면 → 1번: 3분, 2번: 3+1=4분, 총 7분<br>반대로 [1, 3]이면 → 1번: 1분, 2번: 1+3=4분, 총 5분. <strong>짧은 사람이 앞에 오니까 더 좋아!</strong>' },
                { title: 'What if we try this?', content: '<strong>짧은 시간 순서로 정렬</strong>하면 끝이야! 이유를 정리하면:<br>앞 사람의 시간은 뒤의 <em>모든</em> 사람 대기시간에 더해져. 그러니 짧은 시간을 앞에 둬야 뒤 사람들의 대기가 줄어들지.<br>정렬 후 각 사람의 실제 대기시간 = 앞 사람들의 시간 <strong>누적합</strong>이고, 이 누적합들을 전부 더하면 답이야.' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>P.sort()</code>로 정렬하고, <code>acc += p</code>로 누적합을 구하면서 <code>total += acc</code>로 더해가면 끝!</span><span class="lang-cpp"><code>sort(P, P + N)</code>으로 정렬하고, <code>acc += P[i]</code>로 누적합, <code>total += acc</code>로 합산!</span><br>정렬 O(N log N) + 순회 O(N) = 전체 O(N log N). 깔끔!' }
            ],
            templates: {
                python: 'N = int(input())\nP = list(map(int, input().split()))\n\nP.sort()    # 짧은 시간부터\n\ntotal = 0\nacc = 0\nfor p in P:\n    acc += p        # 누적 대기시간\n    total += acc    # 각 사람의 대기시간 더하기\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    int P[1000];\n    for (int i = 0; i < N; i++) cin >> P[i];\n\n    sort(P, P + N);\n\n    int total = 0, acc = 0;\n    for (int i = 0; i < N; i++) {\n        acc += P[i];\n        total += acc;\n    }\n    cout << total << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '정렬 + 누적합',
                description: '오름차순 정렬 후 누적 대기시간의 합을 구합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '사람 수 N과 각 인출 시간을 입력받습니다.', code: 'N = int(input())\nP = list(map(int, input().split()))' },
                        { title: 'Sort', desc: '짧은 시간부터 정렬해야 뒤 사람들의 대기시간이 줄어듭니다.', code: 'P.sort()    # 짧은 시간부터' },
                        { title: '누적합 계산', desc: '각 사람의 실제 대기시간 = 앞 사람들의 시간 누적합입니다.\n누적합들의 총합이 전체 대기시간입니다.', code: 'total = 0\nacc = 0\nfor p in P:\n    acc += p        # 누적 대기시간\n    total += acc    # 각 사람의 대기시간 더하기' },
                        { title: '출력', desc: '최소 총 대기시간을 출력합니다.', code: 'print(total)' }
                    ],
                    cpp: [
                        { title: '입력', desc: '사람 수 N과 각 인출 시간을 입력받습니다.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    int P[1000];\n    for (int i = 0; i < N; i++) cin >> P[i];' },
                        { title: 'Sort', desc: '오름차순 정렬로 짧은 시간을 앞에 배치합니다.', code: '    sort(P, P + N);  // 짧은 시간부터' },
                        { title: '누적합 계산', desc: '각 사람의 실제 대기시간 = 앞 사람들의 시간 누적합입니다.\n누적합들의 총합이 전체 대기시간입니다.', code: '    int total = 0, acc = 0;\n    for (int i = 0; i < N; i++) {\n        acc += P[i];    // 누적 대기시간\n        total += acc;   // 각 사람의 대기시간 더하기\n    }' },
                        { title: '출력', desc: '최소 총 대기시간을 출력합니다.', code: '    cout << total << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
                <h3>Problem</h3>
                <p>한 개의 회의실이 있는데 이를 사용하고자 하는 N개의 회의에 대하여 회의실 사용표를 만들려고 한다. 각 회의 I에 대해 시작시간과 끝나는 시간이 주어져 있고, 각 회의가 겹치지 않게 하면서 회의실을 사용할 수 있는 회의의 최대 개수를 찾아보자. 회의가 끝나는 것과 동시에 다음 회의가 시작될 수 있다. 시작시간과 끝나는 시간이 같을 수 있다(이 경우 시작하자마자 끝난 것으로 간주).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>0 ≤ 시작시간 < 끝나는 시간 ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'N개의 회의 중 겹치지 않는 조합을 전부 만들어서, 그중 가장 많이 들어가는 걸 찾으면 되지 않을까?<br>부분집합을 모두 확인하면... 2<sup>N</sup> 가지. N이 최대 100,000이니까 이건 절대 불가능!' },
                { title: 'But there\'s a problem with this', content: '그렇다면 회의를 어떤 기준으로 정렬해서 하나씩 골라보면 어떨까?<br><strong>시작 시간</strong> 기준? → 일찍 시작하지만 아주 긴 회의(0시~24시)를 먼저 골라버리면 다른 회의를 못 넣어!<br><strong>회의 길이</strong> 기준? → 짧은 회의가 다른 여러 회의와 겹칠 수도 있어.' },
                { title: 'What if we try this?', content: '<strong>끝나는 시간</strong> 기준으로 정렬하자! 일찍 끝나는 회의를 먼저 선택하면 <strong>남은 시간이 최대한 확보</strong>되니까, 더 많은 회의를 넣을 수 있어.<br>이전 회의가 끝난 뒤에 시작하는 회의만 골라가면 돼: <code>if start &gt;= last_end → 선택!</code><br>끝나는 시간이 같으면? 시작 시간이 빠른 걸 먼저 (시작=끝 인 0초짜리 회의도 놓치지 않게!).' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>(끝, 시작)</code> 튜플로 저장하면 <code>sort()</code> 한 번으로 끝나는 시간 기준 정렬 완료!</span><span class="lang-cpp"><code>pair&lt;int,int&gt;</code>의 <code>{끝, 시작}</code> 형태로 저장하면 <code>sort()</code>가 first 기준으로 자동 정렬해줘!</span><br>정렬 O(N log N) + 순회 O(N) = 전체 O(N log N).' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))     # (끝, 시작) 으로 저장\n\nmeetings.sort()     # 끝나는 시간 기준 정렬\n\ncount = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end\n\nprint(count)',
                cpp: '#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N;\n    cin >> N;\n    vector<pair<int,int>> meetings(N);\n    for (int i = 0; i < N; i++) {\n        int s, e;\n        cin >> s >> e;\n        meetings[i] = {e, s};  // {끝, 시작}\n    }\n    sort(meetings.begin(), meetings.end());\n\n    int count = 0, lastEnd = 0;\n    for (auto& [end, start] : meetings) {\n        if (start >= lastEnd) {\n            count++;\n            lastEnd = end;\n        }\n    }\n    cout << count << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '끝나는 시간 기준 정렬 + 그리디',
                description: '끝나는 시간 기준으로 정렬하고 겹치지 않는 회의를 선택합니다.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '(끝, 시작) 순서로 저장하면 sort()만으로 끝나는 시간 기준 정렬이 됩니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmeetings = []\nfor _ in range(N):\n    s, e = map(int, input().split())\n    meetings.append((e, s))' },
                        { title: '끝나는 시간 기준 정렬', desc: '일찍 끝나는 회의부터 선택해야 남은 시간이 최대로 확보됩니다.', code: 'meetings.sort()     # 끝나는 시간 기준 정렬' },
                        { title: '그리디 선택', desc: '이전 회의 종료 이후에 시작하는 회의만 선택합니다.\n겹치는 회의는 건너뛰어 최대 개수를 확보합니다.', code: 'count = 0\nlast_end = 0\nfor end, start in meetings:\n    if start >= last_end:\n        count += 1\n        last_end = end' },
                        { title: '출력', desc: '겹치지 않게 선택한 최대 회의 수를 출력합니다.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'pair<int,int>의 {끝, 시작} 형태로 저장.\nsort하면 끝나는 시간 기준 자동 정렬!', code: '#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> meetings(N);\n    for (int i = 0; i < N; i++) {\n        int s, e; cin >> s >> e;\n        meetings[i] = {e, s};  // {끝, 시작}\n    }' },
                        { title: '끝나는 시간 기준 정렬', desc: 'pair는 first 기준 자동 정렬되므로 끝나는 시간 기준으로 정렬됩니다.', code: '    sort(meetings.begin(), meetings.end());' },
                        { title: '그리디 선택', desc: 'auto& [end, start]로 구조적 바인딩.', code: '    int count = 0, lastEnd = 0;\n    for (auto& [end, start] : meetings) {\n        if (start >= lastEnd) {\n            count++;\n            lastEnd = end;\n        }\n    }' },
                        { title: '출력', desc: '겹치지 않게 선택한 최대 회의 수를 출력합니다.', code: '    cout << count << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
                <h3>Problem</h3>
                <p>세준이는 양수와 +, -로 이루어진 식이 있다. 여기에 괄호를 적절히 쳐서 이 식의 값을 최소로 만들려고 한다. 괄호를 적절히 쳐서 이 식의 값을 최소로 만드는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>55-50+40</pre></div>
                    <div><strong>Output</strong><pre>-35</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10+20+30+40</pre></div>
                    <div><strong>Output</strong><pre>100</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>00009-00009</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>수식은 '0'~'9', '+', '-'만 포함</li>
                    <li>수식 길이 ≤ 50</li>
                    <li>수의 크기 ≤ 5자리</li>
                    <li>수는 0으로 시작 가능</li>
                    <li>수식은 숫자로 시작하고 숫자로 끝남</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '괄호를 어디에 넣을 수 있는지 모든 경우를 시도해 볼까? 수식에 연산자가 여러 개 있으면 괄호 위치 조합이 꽤 많아질 텐데...<br>그냥 수식을 왼쪽부터 순서대로 계산하면 어떨까?' },
                { title: 'But there\'s a problem with this', content: '그냥 순서대로 계산하면 최솟값이 아닐 수도 있어!<br>예: <code>55-50+40</code> → 순서대로 하면 55-50+40 = 45인데, 괄호를 쳐서 <code>55-(50+40)</code> = 55-90 = <strong>-35</strong>가 더 작아!<br>핵심은 이거야: <strong>빼기 뒤에 있는 수들을 최대한 많이 빼면</strong> 값이 작아져.' },
                { title: 'What if we try this?', content: '첫 번째 <code>-</code>가 등장하면, 그 뒤에 나오는 <code>+</code>를 전부 괄호로 묶어버리자!<br>그러면 <code>-</code> 뒤의 모든 수가 다 빼기가 돼.<br><strong>구현 방법</strong>: 식을 <code>-</code> 기준으로 나누고, 각 그룹 안의 <code>+</code>로 연결된 수를 합산해. 첫 그룹만 더하고 나머지 그룹은 전부 빼면 최솟값!' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>expr.split(\'-\')</code>로 <code>-</code> 기준 분리 → 각 그룹을 <code>split(\'+\')</code>로 나눠서 <code>sum(map(int, ...))</code>으로 합산!</span><span class="lang-cpp"><code>getline(stream, segment, \'-\')</code>로 <code>-</code> 기준 분리 → 다시 <code>getline(gs, num, \'+\')</code>로 <code>+</code> 기준 분리해서 <code>stoi()</code>로 변환!</span><br>전체 O(N), 수식 길이만큼만 한 번 훑으면 끝이야.' }
            ],
            templates: {
                python: 'expr = input()\n\n# \'-\' 기준으로 나누기\ngroups = expr.split(\'-\')\n\n# 각 그룹 안의 수들을 더하기\nsums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))\n\n# 첫 그룹은 더하고, 나머지는 빼기\nresult = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)',
                cpp: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string expr;\n    cin >> expr;\n\n    int result = 0;\n    bool isFirst = true;\n\n    stringstream full(expr);\n    string segment;\n    while (getline(full, segment, \'-\')) {\n        int groupSum = 0;\n        stringstream gs(segment);\n        string num;\n        while (getline(gs, num, \'+\')) {\n            groupSum += stoi(num);\n        }\n        if (isFirst) {\n            result += groupSum;\n            isFirst = false;\n        } else {\n            result -= groupSum;\n        }\n    }\n\n    cout << result << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '"- 뒤 전부 빼기" 그리디',
                description: '"-" 기준으로 그룹을 나누고, 첫 그룹만 더하고 나머지는 전부 뺍니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '양수와 +, -로 이루어진 수식을 입력받습니다.', code: 'expr = input()' },
                        { title: '"-" 기준 분리', desc: '"-" 뒤의 "+"를 괄호로 묶으면 전부 빼기가 되므로,\n"-" 기준으로 그룹을 나눕니다.', code: 'groups = expr.split(\'-\')' },
                        { title: '각 그룹 합산', desc: '각 그룹 안의 "+"로 연결된 수들을 합산합니다.\nmap(int, ...) + sum으로 간결하게 처리합니다.', code: 'sums = []\nfor group in groups:\n    sums.append(sum(map(int, group.split(\'+\'))))' },
                        { title: '첫 그룹 더하고 나머지 빼기', desc: '첫 그룹만 더하고 나머지 그룹은 전부 빼면 최솟값입니다.\n"-" 뒤를 최대한 많이 빼는 것이 핵심입니다.', code: 'result = sums[0]\nfor i in range(1, len(sums)):\n    result -= sums[i]\n\nprint(result)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'stringstream을 사용하기 위해 <sstream>을 포함합니다.', code: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string expr;\n    cin >> expr;' },
                        { title: '"-" 기준 분리', desc: 'getline(stream, var, delimiter)로 문자열 분리.\nstringstream으로 문자열을 스트림처럼 사용.', code: '    int result = 0;\n    bool isFirst = true;\n    stringstream full(expr);\n    string segment;' },
                        { title: '각 그룹 합산', desc: '"-" 구분 후 다시 "+" 기준으로 분리하여 합산합니다.\nstoi()로 문자열을 정수로 변환합니다.', code: '    while (getline(full, segment, \'-\')) {\n        int groupSum = 0;\n        stringstream gs(segment);\n        string num;\n        while (getline(gs, num, \'+\'))\n            groupSum += stoi(num);' },
                        { title: '첫 그룹 더하고 나머지 빼기', desc: '첫 그룹만 더하고 나머지는 전부 빼서 최솟값을 구합니다.', code: '        if (isFirst) { result += groupSum; isFirst = false; }\n        else result -= groupSum;\n    }\n    cout << result << endl;\n    return 0;\n}' }
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
            descriptionHTML: `
                <h3>Problem</h3>
                <p>일직선 도로 위에 N개의 도시가 있다. 제일 왼쪽 도시에서 제일 오른쪽 도시로 가려 한다. 각 도시에는 주유소가 있고, 1리터당 가격이 다르다. 도시 사이의 거리와 각 도시의 주유 가격이 주어질 때, 제일 왼쪽에서 오른쪽 끝까지 가는데 드는 최소 비용을 구하시오.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n2 3 1\n5 2 4 1</pre></div>
                    <div><strong>Output</strong><pre>18</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n3 3 4\n1 1 1 1</pre></div>
                    <div><strong>Output</strong><pre>10</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N ≤ 100,000</li>
                    <li>1 ≤ 거리 ≤ 10<sup>9</sup></li>
                    <li>1 ≤ 리터당 가격 ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: '각 도시에서 "다음에 더 싼 주유소가 나올 때까지만" 딱 필요한 만큼 기름을 넣으면 되지 않을까?<br>매 도시마다 앞으로의 주유소 가격을 전부 살펴봐야 하니까... O(N<sup>2</sup>)이겠네.' },
                { title: 'But there\'s a problem with this', content: 'N이 최대 100,000이면 O(N<sup>2</sup>)은 100억 번 연산... 시간 초과!<br>그리고 미래의 모든 주유소를 보는 건 복잡해. 더 간단한 방법이 없을까?<br>잠깐, 핵심을 다시 생각해보자: 어떤 구간을 이동할 때, <strong>지금까지 지나온 주유소 중 가장 싼 곳</strong>에서 미리 넣어두면 되잖아!' },
                { title: 'What if we try this?', content: '왼쪽에서 오른쪽으로 한 번만 훑으면서, <strong>지금까지 본 최소 가격</strong>을 기억하자!<br>더 싼 주유소를 만나면 최소 가격을 갱신하고, 각 구간 비용 = <code>최소 가격 x 도로 길이</code>로 계산하면 끝.<br>한 번 순회로 O(N)에 해결! (마지막 도시의 가격은 이동할 구간이 없으니 안 써도 돼)' },
                { title: 'In Python/C++!', content: '<span class="lang-py"><code>min_price = min(min_price, price[i])</code>로 최소 가격 갱신, <code>total += min_price * dist[i]</code>로 비용 누적. Python은 큰 수를 자동 처리해서 편해!</span><span class="lang-cpp"><code>minPrice = min(minPrice, price[i])</code>로 갱신, <code>total += minPrice * dist[i]</code>로 누적. 값이 10<sup>9</sup> x 10<sup>5</sup>까지 갈 수 있으니 <strong>long long</strong> 필수!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))\n\nmin_price = price[0]\ntotal = 0\n\nfor i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]\n\nprint(total)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n\n    long long dist[100000], price[100000];\n    for (int i = 0; i < N - 1; i++) cin >> dist[i];\n    for (int i = 0; i < N; i++) cin >> price[i];\n\n    long long minPrice = price[0];\n    long long total = 0;\n\n    for (int i = 0; i < N - 1; i++) {\n        minPrice = min(minPrice, price[i]);\n        total += minPrice * dist[i];\n    }\n\n    cout << total << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '최소 가격 추적 그리디',
                description: '지금까지 본 최소 기름값을 유지하며 각 구간 비용을 계산합니다.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: '입력', desc: '도시 수, 도시 간 거리, 각 도시의 기름값을 입력받습니다.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ndist = list(map(int, input().split()))\nprice = list(map(int, input().split()))' },
                        { title: '초기 최소 가격', desc: '첫 도시의 기름값을 초기 최소 가격으로 설정합니다.', code: 'min_price = price[0]\ntotal = 0' },
                        { title: '그리디 순회', desc: '지금까지 본 최소 기름값으로 각 구간을 이동합니다.\n더 싼 주유소를 만나면 즉시 최소 가격을 갱신합니다.', code: 'for i in range(N - 1):\n    min_price = min(min_price, price[i])\n    total += min_price * dist[i]' },
                        { title: '출력', desc: '최소 이동 비용을 출력합니다.', code: 'print(total)' }
                    ],
                    cpp: [
                        { title: '입력', desc: 'long long으로 큰 수 처리.\n값이 10^9 × 10^5까지 가능!', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    long long dist[100000], price[100000];\n    for (int i = 0; i < N-1; i++) cin >> dist[i];\n    for (int i = 0; i < N; i++) cin >> price[i];' },
                        { title: '초기 최소 가격', desc: '첫 도시의 기름값을 초기 최소 가격으로 설정합니다.', code: '    long long minPrice = price[0];\n    long long total = 0;' },
                        { title: '그리디 순회', desc: '지금까지 본 최소 기름값으로 각 구간을 이동합니다.\n더 싼 주유소를 만나면 즉시 최소 가격을 갱신합니다.', code: '    for (int i = 0; i < N-1; i++) {\n        minPrice = min(minPrice, price[i]);\n        total += minPrice * dist[i];\n    }' },
                        { title: '출력', desc: '최소 이동 비용을 출력합니다.', code: '    cout << total << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return greedyTopic.problems[4].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { greedyTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.greedy = greedyTopic;
