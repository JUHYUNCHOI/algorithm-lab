// ===== 그리디 알고리즘 토픽 모듈 =====
const greedyTopic = {
    id: 'greedy',
    title: '그리디',
    icon: '🏆',
    category: '알고리즘',
    order: 3,
    description: '지금 당장 가장 좋은 선택을 반복하는 기법',

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

    // ===== 개념 인터랙션 초기화 =====
    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>그리디 시각화</h2>
            <div class="viz-type-selector">
                <button class="viz-type-btn active" data-viz="coin">동전 거스름돈</button>
                <button class="viz-type-btn" data-viz="meeting">회의실 배정</button>
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

        switchViz('coin');
    },

    _renderVizType(container, type) {
        if (type === 'coin') this._renderVizCoin(container);
        else if (type === 'meeting') this._renderVizMeeting(container);
    },

    // ===== 동전 거스름돈 시각화 =====
    _renderVizCoin(container) {
        const defaultCoins = [500, 100, 50, 10];
        let targetAmount = 4200;

        container.innerHTML = `
            <div class="viz-card">
                <h3>동전 거스름돈 (그리디)</h3>
                <div class="ps-input-group">
                    <label>거슬러 줄 금액:</label>
                    <input type="number" id="gr-coin-amount" value="${targetAmount}" min="10" max="99990" step="10" class="ps-input" style="width:120px;">
                    <span>원</span>
                    <button class="btn" id="gr-coin-apply">적용</button>
                </div>
                <div class="gr-viz-area">
                    <div class="gr-amount-display" id="gr-remaining">남은 금액: <strong>${targetAmount}원</strong></div>
                    <div class="gr-coin-area" id="gr-coin-area"></div>
                    <div class="gr-total-display" id="gr-total" style="display:none;"></div>
                </div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;

        const buildAndInit = () => {
            self._clearVizState();
            const remaining = container.querySelector('#gr-remaining');
            const coinArea = container.querySelector('#gr-coin-area');
            const totalDisplay = container.querySelector('#gr-total');

            coinArea.innerHTML = defaultCoins.map(coin =>
                `<div class="gr-coin-row" data-coin="${coin}">
                    <div class="gr-coin">${coin}</div>
                    <span class="gr-coin-count">× <strong id="gr-cnt-${coin}">0</strong>개</span>
                </div>`
            ).join('');
            totalDisplay.style.display = 'none';

            const steps = [];
            let rem = targetAmount;
            let totalCoins = 0;
            const usedCoins = {};

            defaultCoins.forEach(coin => {
                const cnt = Math.floor(rem / coin);
                if (cnt > 0) {
                    const coinVal = coin;
                    const coinCnt = cnt;
                    const prevRem = rem;
                    rem -= coinCnt * coinVal;
                    totalCoins += coinCnt;

                    const afterRem = rem;
                    const afterTotal = totalCoins;

                    steps.push({
                        description: `${coinVal}원짜리: ${prevRem} ÷ ${coinVal} = ${coinCnt}개 사용 → 남은 금액: ${afterRem}원`,
                        action() {
                            container.querySelector(`#gr-cnt-${coinVal}`).textContent = coinCnt;
                            container.querySelector(`[data-coin="${coinVal}"]`).classList.add('active');
                            remaining.innerHTML = `남은 금액: <strong>${afterRem}원</strong>`;
                            usedCoins[coinVal] = coinCnt;
                        },
                        undo() {
                            container.querySelector(`#gr-cnt-${coinVal}`).textContent = '0';
                            container.querySelector(`[data-coin="${coinVal}"]`).classList.remove('active');
                            remaining.innerHTML = `남은 금액: <strong>${prevRem}원</strong>`;
                            delete usedCoins[coinVal];
                        }
                    });
                }
            });

            const finalTotal = totalCoins;
            steps.push({
                description: `완성! 총 동전 ${finalTotal}개로 ${targetAmount}원을 거슬러 줄 수 있습니다.`,
                action() {
                    remaining.innerHTML = `남은 금액: <strong style="color:var(--green)">0원 ✅</strong>`;
                    totalDisplay.style.display = 'block';
                    totalDisplay.innerHTML = `<strong style="font-size:1.2rem; color:var(--green);">총 동전 수: ${finalTotal}개</strong>`;
                },
                undo() {
                    remaining.innerHTML = `남은 금액: <strong>${targetAmount - Object.entries(usedCoins).reduce((s, [c, n]) => s + c * n, 0)}원</strong>`;
                    totalDisplay.style.display = 'none';
                }
            });

            self._initStepController(container, steps);
        };

        container.querySelector('#gr-coin-apply').addEventListener('click', () => {
            const val = parseInt(container.querySelector('#gr-coin-amount').value);
            if (isNaN(val) || val < 10 || val > 99990 || val % 10 !== 0) {
                alert('10 이상 99990 이하의 10의 배수를 입력해 주세요.');
                return;
            }
            targetAmount = val;
            container.querySelector('#gr-remaining').innerHTML = `남은 금액: <strong>${targetAmount}원</strong>`;
            buildAndInit();
        });

        buildAndInit();
    },

    // ===== 회의실 배정 시각화 =====
    _renderVizMeeting(container) {
        const meetings = [
            [1,4],[3,5],[0,6],[5,7],[3,8],[5,9],[6,10],[8,11],[8,12],[2,13],[12,14]
        ];

        container.innerHTML = `
            <div class="viz-card">
                <h3>회의실 배정 (Activity Selection)</h3>
                <p style="color:var(--text2); margin-bottom:12px;">끝나는 시간이 빠른 순서로 정렬한 뒤, 겹치지 않는 회의를 선택합니다.</p>
                <div class="gr-timeline-container">
                    <div class="gr-timeline-header" id="gr-timeline-header"></div>
                    <div class="gr-timeline-area" id="gr-timeline-area"></div>
                </div>
                <div class="gr-meeting-info" id="gr-meeting-info"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;

        // 끝나는 시간 기준 정렬 (같으면 시작 시간 기준)
        const sorted = [...meetings].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
        const maxTime = Math.max(...sorted.map(m => m[1]));

        // 타임라인 헤더 (시간 눈금)
        const headerEl = container.querySelector('#gr-timeline-header');
        let headerHTML = '';
        for (let t = 0; t <= maxTime; t++) {
            headerHTML += `<span class="gr-time-tick">${t}</span>`;
        }
        headerEl.innerHTML = headerHTML;

        // 회의 바 렌더링
        const areaEl = container.querySelector('#gr-timeline-area');
        areaEl.innerHTML = sorted.map((m, i) =>
            `<div class="gr-meeting-bar waiting" id="gr-m-${i}" style="left:${(m[0] / maxTime) * 100}%; width:${((m[1] - m[0]) / maxTime) * 100}%;">
                <span class="gr-meeting-label">(${m[0]},${m[1]})</span>
            </div>`
        ).join('');

        const infoEl = container.querySelector('#gr-meeting-info');
        infoEl.innerHTML = `<span style="color:var(--text2)">정렬 완료: 끝나는 시간 기준 오름차순</span>`;

        const steps = [];
        let lastEnd = -1;
        let selected = [];

        sorted.forEach((m, i) => {
            const [start, end] = m;
            const idx = i;

            if (start >= lastEnd) {
                // 선택
                const prevEnd = lastEnd;
                lastEnd = end;
                selected.push(idx);
                const selCount = selected.length;

                steps.push({
                    description: `회의 (${start}~${end}): 시작(${start}) ≥ 이전 종료(${prevEnd < 0 ? '없음' : prevEnd}) → ✅ 선택! (${selCount}개째)`,
                    action() {
                        const bar = container.querySelector(`#gr-m-${idx}`);
                        bar.classList.remove('waiting');
                        bar.classList.add('selected');
                        infoEl.innerHTML = `선택한 회의: <strong style="color:var(--green)">${selCount}개</strong> | 마지막 종료 시각: ${end}`;
                    },
                    undo() {
                        const bar = container.querySelector(`#gr-m-${idx}`);
                        bar.classList.remove('selected');
                        bar.classList.add('waiting');
                        infoEl.innerHTML = prevEnd < 0
                            ? `<span style="color:var(--text2)">정렬 완료: 끝나는 시간 기준 오름차순</span>`
                            : `선택한 회의: <strong style="color:var(--green)">${selCount - 1}개</strong> | 마지막 종료 시각: ${prevEnd}`;
                    }
                });
            } else {
                // 건너뛰기
                const curEnd = lastEnd;
                steps.push({
                    description: `회의 (${start}~${end}): 시작(${start}) < 이전 종료(${curEnd}) → ❌ 겹침! 건너뜁니다.`,
                    action() {
                        const bar = container.querySelector(`#gr-m-${idx}`);
                        bar.classList.remove('waiting');
                        bar.classList.add('skipped');
                    },
                    undo() {
                        const bar = container.querySelector(`#gr-m-${idx}`);
                        bar.classList.remove('skipped');
                        bar.classList.add('waiting');
                    }
                });
            }
        });

        const finalCount = selected.length;
        steps.push({
            description: `완성! 최대 ${finalCount}개의 회의를 겹치지 않게 배정할 수 있습니다.`,
            action() {
                infoEl.innerHTML = `<strong style="font-size:1.1rem; color:var(--green);">✅ 최대 ${finalCount}개 회의 배정 완료!</strong>`;
            },
            undo() {
                infoEl.innerHTML = `선택한 회의: <strong style="color:var(--green)">${finalCount}개</strong>`;
            }
        });

        this._initStepController(container, steps);
    },

    // ===== 공유 메서드: 시각화 상태 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>준규가 가지고 있는 동전은 총 N종류이고, 각각의 동전을 매우 많이 가지고 있습니다. 동전을 적절히 사용해서 그 가치의 합을 K로 만들려고 합니다. 이때 필요한 동전 개수의 최솟값을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N과 K가 주어진다. (1 ≤ N ≤ 10, 1 ≤ K ≤ 100,000,000)<br>둘째 줄부터 N개의 줄에 동전의 가치 Ai가 오름차순으로 주어진다. (A1 = 1, Ai는 Ai-1의 배수)</p></div>
                    <div><h4>출력</h4><p>K원을 만드는데 필요한 동전 개수의 최솟값을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10 4200\n1\n5\n10\n50\n100\n500\n1000\n5000\n10000\n50000</pre></div>
                        <div><strong>출력</strong><pre>6</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '동전이 항상 이전 동전의 배수이므로, <strong>가장 큰 동전부터</strong> 최대한 많이 사용하면 됩니다.' },
                { title: '핵심 코드', content: '큰 동전부터 반복하면서 <code>count += K // coin</code>, <code>K %= coin</code>을 반복합니다.' },
                { title: '왜 그리디가 되나요?', content: '동전이 배수 관계이기 때문에, 작은 동전 여러 개 = 큰 동전 하나로 항상 바꿀 수 있습니다. 따라서 큰 것부터 쓰는 것이 항상 최적입니다.' }
            ],
            inputDefault: 4200,
            solve(n) {
                const coins = [50000,10000,5000,1000,500,100,50,10,5,1];
                let K = 4200, count = 0;
                for (const coin of coins) { count += Math.floor(K / coin); K %= coin; }
                return String(count);
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, K = map(int, input().split())
coins = [int(input()) for _ in range(N)]

count = 0
for coin in reversed(coins):    # 큰 동전부터
    count += K // coin
    K %= coin

print(count)`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;

    int coins[10];
    for (int i = 0; i < N; i++) cin >> coins[i];

    int count = 0;
    for (int i = N - 1; i >= 0; i--) {
        count += K / coins[i];
        K %= coins[i];
    }
    cout << count << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), K = sc.nextInt();
        int[] coins = new int[N];
        for (int i = 0; i < N; i++) coins[i] = sc.nextInt();

        int count = 0;
        for (int i = N - 1; i >= 0; i--) {
            count += K / coins[i];
            K %= coins[i];
        }
        System.out.println(count);
    }
}`
            }
        },
        {
            id: 'boj-11399',
            title: 'BOJ 11399 - ATM',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11399',
            descriptionHTML: `
                <h3>문제</h3>
                <p>ATM 앞에 N명이 줄을 서 있습니다. i번 사람이 돈을 인출하는 데 Pi분이 걸립니다. 각 사람이 돈을 인출하는 데 필요한 시간의 합이 최소가 되도록 줄을 세우고, 그 최솟값을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 사람의 수 N (1 ≤ N ≤ 1,000)<br>둘째 줄에 각 사람의 인출 시간 Pi (1 ≤ Pi ≤ 1,000)</p></div>
                    <div><h4>출력</h4><p>각 사람이 돈을 인출하는 데 필요한 시간의 합의 최솟값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5\n3 1 4 3 2</pre></div>
                        <div><strong>출력</strong><pre>32</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '앞 사람이 오래 걸리면 뒤의 <strong>모든 사람이 기다려야</strong> 합니다. 따라서 <strong>짧은 시간 순서</strong>로 줄을 세워야 합니다.' },
                { title: '핵심 공식', content: '오름차순 정렬 후, i번째 사람의 대기시간 = <code>P[0] + P[1] + ... + P[i]</code><br>전체 합 = 이 누적합들의 합입니다.' },
                { title: '간단한 계산법', content: 'i번째(0-indexed) 사람의 시간은 (N-i)번 더해집니다.<br>따라서 답 = <code>Σ P[i] × (N - i)</code> (정렬 후)' }
            ],
            inputDefault: 5,
            solve(n) {
                const arr = [3, 1, 4, 3, 2].sort((a, b) => a - b);
                let total = 0, acc = 0;
                for (const p of arr) { acc += p; total += acc; }
                return String(total);
            },
            templates: {
                python: `N = int(input())
P = list(map(int, input().split()))

P.sort()    # 짧은 시간부터

total = 0
acc = 0
for p in P:
    acc += p        # 누적 대기시간
    total += acc    # 각 사람의 대기시간 더하기

print(total)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int N;
    cin >> N;
    int P[1000];
    for (int i = 0; i < N; i++) cin >> P[i];

    sort(P, P + N);

    int total = 0, acc = 0;
    for (int i = 0; i < N; i++) {
        acc += P[i];
        total += acc;
    }
    cout << total << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        int[] P = new int[N];
        for (int i = 0; i < N; i++) P[i] = sc.nextInt();

        Arrays.sort(P);

        int total = 0, acc = 0;
        for (int p : P) {
            acc += p;
            total += acc;
        }
        System.out.println(total);
    }
}`
            }
        },

        // ========== 2단계: 정렬 + 그리디 ==========
        {
            id: 'boj-1931',
            title: 'BOJ 1931 - 회의실 배정',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1931',
            descriptionHTML: `
                <h3>문제</h3>
                <p>한 개의 회의실에 N개의 회의가 신청되었습니다. 각 회의의 시작시간과 끝나는 시간이 주어집니다. 겹치지 않게 회의실을 사용할 수 있는 회의의 최대 개수를 구하시오.</p>
                <p>한 회의가 끝나는 것과 동시에 다음 회의가 시작될 수 있습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 회의의 수 N (1 ≤ N ≤ 100,000)<br>둘째 줄부터 각 회의의 시작시간과 끝나는 시간이 주어진다.</p></div>
                    <div><h4>출력</h4><p>최대 사용할 수 있는 회의의 수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>11\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11\n8 12\n2 13\n12 14</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '회의를 <strong>끝나는 시간</strong> 기준으로 오름차순 정렬합니다. 끝나는 시간이 같으면 시작 시간 기준 오름차순 정렬합니다.' },
                { title: '선택 기준', content: '이전에 선택한 회의의 끝나는 시간 이후에 시작하는 회의만 선택합니다.<br><code>if start >= last_end: 선택</code>' },
                { title: '왜 끝나는 시간 기준?', content: '일찍 끝나는 회의를 선택해야 남은 시간이 최대한 확보되어, 더 많은 회의를 넣을 수 있습니다.' }
            ],
            inputDefault: 11,
            solve(n) { return '4'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
meetings = []
for _ in range(N):
    s, e = map(int, input().split())
    meetings.append((e, s))     # (끝, 시작) 으로 저장

meetings.sort()     # 끝나는 시간 기준 정렬

count = 0
last_end = 0
for end, start in meetings:
    if start >= last_end:
        count += 1
        last_end = end

print(count)`,
                cpp: `#include <iostream>
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;
    vector<pair<int,int>> meetings(N);
    for (int i = 0; i < N; i++) {
        int s, e;
        cin >> s >> e;
        meetings[i] = {e, s};  // {끝, 시작}
    }
    sort(meetings.begin(), meetings.end());

    int count = 0, lastEnd = 0;
    for (auto& [end, start] : meetings) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    cout << count << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int[][] meetings = new int[N][2];
        for (int i = 0; i < N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            meetings[i][0] = Integer.parseInt(st.nextToken()); // 시작
            meetings[i][1] = Integer.parseInt(st.nextToken()); // 끝
        }
        Arrays.sort(meetings, (a, b) -> a[1] != b[1] ? a[1] - b[1] : a[0] - b[0]);

        int count = 0, lastEnd = 0;
        for (int[] m : meetings) {
            if (m[0] >= lastEnd) {
                count++;
                lastEnd = m[1];
            }
        }
        System.out.println(count);
    }
}`
            }
        },
        {
            id: 'boj-1541',
            title: 'BOJ 1541 - 잃어버린 괄호',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1541',
            descriptionHTML: `
                <h3>문제</h3>
                <p>양수와 +, -로 이루어진 식이 주어졌을 때, 괄호를 적절히 쳐서 식의 값을 최소로 만드시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 식이 주어진다. 식은 0~9, +, -로만 이루어져 있다. 길이는 50 이하이다.</p></div>
                    <div><h4>출력</h4><p>괄호를 쳐서 만들 수 있는 식의 최솟값을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>55-50+40</pre></div>
                        <div><strong>출력</strong><pre>-35</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>10+20+30+40</pre></div>
                        <div><strong>출력</strong><pre>100</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '첫 번째 <code>-</code> 뒤에 나오는 모든 수를 빼면 최솟값이 됩니다! <code>-</code> 뒤의 <code>+</code>를 괄호로 묶으면 전부 빼기가 됩니다.' },
                { title: '핵심 아이디어', content: '식을 <code>-</code> 기준으로 나눕니다. 각 그룹 안의 <code>+</code>로 연결된 수들을 합칩니다.<br>첫 그룹은 더하고, 나머지 그룹은 모두 뺍니다.' },
                { title: '예시', content: '<code>55-50+40</code> → [55], [50+40=90]<br>55 - 90 = <strong>-35</strong>' }
            ],
            inputDefault: 0,
            solve(n) { return '-35'; },
            templates: {
                python: `expr = input()

# '-' 기준으로 나누기
groups = expr.split('-')

# 각 그룹 안의 수들을 더하기
sums = []
for group in groups:
    sums.append(sum(map(int, group.split('+'))))

# 첫 그룹은 더하고, 나머지는 빼기
result = sums[0]
for i in range(1, len(sums)):
    result -= sums[i]

print(result)`,
                cpp: `#include <iostream>
#include <string>
#include <sstream>
using namespace std;

int main() {
    string expr;
    cin >> expr;

    // '-' 기준 분리 후 각 그룹의 합 계산
    int result = 0;
    bool first = true;
    bool subtract = false;

    stringstream ss(expr);
    string group;

    // '-'를 구분자로 분리
    int pos = 0;
    string token;
    bool isFirst = true;

    // 간단한 파싱
    stringstream full(expr);
    string segment;
    while (getline(full, segment, '-')) {
        // segment 내 '+' 분리 후 합산
        int groupSum = 0;
        stringstream gs(segment);
        string num;
        while (getline(gs, num, '+')) {
            groupSum += stoi(num);
        }
        if (isFirst) {
            result += groupSum;
            isFirst = false;
        } else {
            result -= groupSum;
        }
    }

    cout << result << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String expr = sc.next();

        String[] groups = expr.split("-");
        int result = 0;

        for (int g = 0; g < groups.length; g++) {
            int groupSum = 0;
            for (String num : groups[g].split("\\\\+")) {
                groupSum += Integer.parseInt(num);
            }
            if (g == 0) result += groupSum;
            else result -= groupSum;
        }

        System.out.println(result);
    }
}`
            }
        },

        // ========== 3단계: 응용 그리디 ==========
        {
            id: 'boj-13305',
            title: 'BOJ 13305 - 주유소',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/13305',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 도시가 일직선 도로 위에 있습니다. 제일 왼쪽 도시에서 제일 오른쪽 도시로 이동하려고 합니다. 각 도시에 주유소가 있고, 리터당 가격이 다릅니다. 1km마다 1리터를 사용합니다. 최소 비용으로 이동하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 도시의 수 N (2 ≤ N ≤ 100,000)<br>둘째 줄에 인접한 도시 사이 도로 길이 N-1개<br>셋째 줄에 각 도시의 주유소 리터당 가격 N개</p></div>
                    <div><h4>출력</h4><p>최소 비용을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4\n2 3 1\n5 2 4 1</pre></div>
                        <div><strong>출력</strong><pre>18</pre></div>
                    </div>
                    <div class="example-grid" style="margin-top:8px;">
                        <div><strong>입력</strong><pre>4\n3 3 4\n1 1 1 1</pre></div>
                        <div><strong>출력</strong><pre>10</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '왼쪽에서 오른쪽으로 이동하면서, <strong>지금까지 본 가장 싼 가격</strong>을 기억합니다. 각 구간에서는 그 최소 가격으로 기름을 넣습니다.' },
                { title: '핵심 아이디어', content: '더 싼 주유소를 만나면 최소 가격을 갱신합니다.<br>각 도로 구간의 비용 = <code>min(지금까지의 최소 가격) × 도로 길이</code>' },
                { title: '주의할 점', content: '값이 매우 커질 수 있으므로 Python은 자동으로 되지만, C++/Java는 <strong>long long</strong> 타입을 사용해야 합니다. 마지막 도시의 가격은 사용하지 않습니다.' }
            ],
            inputDefault: 4,
            solve(n) { return '18'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
dist = list(map(int, input().split()))
price = list(map(int, input().split()))

min_price = price[0]
total = 0

for i in range(N - 1):
    min_price = min(min_price, price[i])
    total += min_price * dist[i]

print(total)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int N;
    cin >> N;

    long long dist[100000], price[100000];
    for (int i = 0; i < N - 1; i++) cin >> dist[i];
    for (int i = 0; i < N; i++) cin >> price[i];

    long long minPrice = price[0];
    long long total = 0;

    for (int i = 0; i < N - 1; i++) {
        minPrice = min(minPrice, price[i]);
        total += minPrice * dist[i];
    }

    cout << total << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());

        StringTokenizer st = new StringTokenizer(br.readLine());
        long[] dist = new long[N - 1];
        for (int i = 0; i < N - 1; i++) dist[i] = Long.parseLong(st.nextToken());

        st = new StringTokenizer(br.readLine());
        long[] price = new long[N];
        for (int i = 0; i < N; i++) price[i] = Long.parseLong(st.nextToken());

        long minPrice = price[0];
        long total = 0;

        for (int i = 0; i < N - 1; i++) {
            minPrice = Math.min(minPrice, price[i]);
            total += minPrice * dist[i];
        }

        System.out.println(total);
    }
}`
            }
        }
    ],

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
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 BOJ에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status = '') {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// ===== 등록 =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.greedy = greedyTopic;
