// ===== 누적합 토픽 모듈 =====
const prefixSumTopic = {
    id: 'prefixsum',
    title: '누적합',
    icon: '📊',
    category: '알고리즘 기법',
    order: 14,
    description: '구간의 합을 한 번에 구하는 기법',
    relatedNote: '누적합은 IMOS법(차분 배열), 2차원 확장, 나머지 연산과의 조합 등으로 다양하게 응용됩니다.',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📊 누적합 (Prefix Sum)</h2>
                <p class="hero-sub">미리 합을 쌓아두면, 어떤 구간의 합이든 한 번에 구할 수 있습니다</p>
            </div>

            <!-- ① 누적합이란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 누적합이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 여러분이 매일 용돈을 저금통에 넣는다고 생각해 보세요.<br>
                    월요일에 3원, 화요일에 1원, 수요일에 4원, 목요일에 1원, 금요일에 5원.<br><br>
                    저금통에는 매일 <strong>지금까지 모은 총 금액</strong>이 적혀 있습니다:<br>
                    <code>0원 → 3원 → 4원 → 8원 → 9원 → 14원</code><br><br>
                    이제 "화요일부터 목요일까지 모은 돈"을 알고 싶다면?<br>
                    <strong>목요일까지 총액(9원) - 월요일까지 총액(3원) = 6원</strong><br>
                    이것이 바로 <strong>누적합</strong>입니다!
                </div>

                <div class="code-block"><pre><code class="language-python"># 원래 배열
arr    = [3, 1, 4, 1, 5]

# 누적합 배열 (맨 앞에 0을 추가)
prefix = [0, 3, 4, 8, 9, 14]
#         ↑  ↑  ↑  ↑  ↑   ↑
#         0  3 3+1 4+4 8+1 9+5

# 2번째~4번째 합 = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열 [3, 1, 4, 1, 5]에서 3번째부터 5번째까지의 합은 얼마입니까?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>10</strong>입니다!<br>
                        누적합 배열: [0, 3, 4, 8, 9, 14]<br>
                        prefix[5] - prefix[2] = 14 - 4 = <strong>10</strong><br>
                        실제로 4 + 1 + 5 = 10 맞습니다!
                    </div>
                </div>
            </div>

            <!-- ② 누적합 만드는 방법 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 누적합 만드는 방법</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="5" y="50" width="12" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="22" y="40" width="12" height="30" rx="2" fill="var(--accent)" opacity="0.55"/>
                                <rect x="39" y="25" width="12" height="45" rx="2" fill="var(--accent)" opacity="0.7"/>
                                <rect x="56" y="10" width="12" height="60" rx="2" fill="var(--accent)" opacity="0.9"/>
                            </svg>
                        </div>
                        <h3>하나씩 쌓아 올리기</h3>
                        <p><code>prefix[i] = prefix[i-1] + arr[i]</code><br>이전까지의 합에 현재 값을 더하면 됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="25" fill="none" stroke="var(--green)" stroke-width="3"/>
                                <text x="40" y="46" text-anchor="middle" fill="var(--green)" font-size="24" font-weight="bold">O(N)</text>
                            </svg>
                        </div>
                        <h3>딱 한 번이면 충분</h3>
                        <p>누적합 배열을 만드는 데 배열을 <strong>한 번만</strong> 쭉 훑으면 됩니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 누적합 배열 만들기
N = len(arr)
prefix = [0] * (N + 1)       # 길이를 N+1로 (0번 칸은 0)

for i in range(1, N + 1):
    prefix[i] = prefix[i - 1] + arr[i - 1]

# 결과: prefix = [0, 3, 4, 8, 9, 14]</code></pre></div>

                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">직접 눌러서 누적합이 만들어지는 과정을 확인해 보세요!</p>
                <div class="ps-build-demo" id="ps-build-demo">
                    <div class="ps-array-row" id="ps-original-row"></div>
                    <div class="ps-arrow-label">↓ 하나씩 더하기</div>
                    <div class="ps-array-row" id="ps-prefix-row"></div>
                    <button class="btn btn-primary" id="ps-build-next" style="margin-top: 0.8rem;">다음 칸 채우기 →</button>
                    <button class="matryoshka-reset hidden" id="ps-build-reset">↺ 다시하기</button>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">누적합 배열의 맨 앞에 왜 0을 넣을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>첫 번째 원소부터의 구간 합</strong>을 구할 때 편하기 때문입니다!<br>
                        예를 들어 1번째~3번째 합 = prefix[3] - prefix[0] = 8 - 0 = 8<br>
                        0이 없으면 1번째부터 시작하는 구간에서 예외 처리가 필요합니다.
                    </div>
                </div>
            </div>

            <!-- ③ 구간 합을 한 번에! -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 구간 합을 한 번에!</div>
                <div class="approach-grid">
                    <div class="approach-card">
                        <h4>😰 반복문으로 구하기</h4>
                        <div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기
total = 0
for i in range(L, R + 1):
    total += arr[i]
# 시간: O(N) — 질문마다 처음부터 더해야 합니다</code></pre></div>
                        <p class="approach-note">질문이 M개면 총 <strong>O(N × M)</strong> → 느립니다!</p>
                    </div>
                    <div class="approach-card featured">
                        <h4>😎 누적합으로 구하기</h4>
                        <div class="code-block"><pre><code class="language-python"># L번째 ~ R번째 합 구하기
total = prefix[R] - prefix[L - 1]
# 시간: O(1) — 뺄셈 한 번이면 끝!</code></pre></div>
                        <p class="approach-note">질문이 M개여도 총 <strong>O(N + M)</strong> → 빠릅니다!</p>
                    </div>
                </div>

                <div class="key-difference-box">
                    <strong>핵심 공식:</strong>
                    <code>arr[L] + arr[L+1] + ... + arr[R] = prefix[R] - prefix[L-1]</code><br>
                    <span style="color:var(--text2)">R까지의 합에서 L-1까지의 합을 빼면, L부터 R까지의 합만 남습니다!</span>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열 크기가 100,000이고 질문이 100,000개라면, 반복문은 몇 번 계산하고 누적합은 몇 번 계산할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        반복문: 최대 <strong>100,000 × 100,000 = 100억 번</strong> (시간 초과!)<br>
                        누적합: <strong>100,000 + 100,000 = 200,000번</strong> (한순간!)<br><br>
                        이 차이가 바로 누적합을 쓰는 이유입니다.
                    </div>
                </div>
            </div>

            <!-- ④ 2차원 누적합 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 2차원 누적합</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 격자 모양 지도에서 각 칸에 보물이 있다고 생각해 보세요.<br>
                    "이 직사각형 영역 안에 보물이 총 몇 개인가?" 하는 질문에 빠르게 답하려면,<br>
                    <strong>왼쪽 위 모서리(1,1)부터 각 칸까지의 보물 합계</strong>를 미리 구해두면 됩니다!
                </div>

                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">2차원 누적합 공식 (포함-배제 원리)</p>
                <div class="ps-2d-formula">
                    <div class="ps-2d-step">
                        <div class="ps-2d-grid-mini">
                            <div class="ps-2d-area full">전체</div>
                        </div>
                        <span class="ps-2d-op">prefix[r2][c2]</span>
                    </div>
                    <div class="ps-2d-step">
                        <span class="ps-2d-minus">−</span>
                        <div class="ps-2d-grid-mini">
                            <div class="ps-2d-area sub-top">위쪽</div>
                        </div>
                        <span class="ps-2d-op">prefix[r1-1][c2]</span>
                    </div>
                    <div class="ps-2d-step">
                        <span class="ps-2d-minus">−</span>
                        <div class="ps-2d-grid-mini">
                            <div class="ps-2d-area sub-left">왼쪽</div>
                        </div>
                        <span class="ps-2d-op">prefix[r2][c1-1]</span>
                    </div>
                    <div class="ps-2d-step">
                        <span class="ps-2d-minus">+</span>
                        <div class="ps-2d-grid-mini">
                            <div class="ps-2d-area add-corner">겹침</div>
                        </div>
                        <span class="ps-2d-op">prefix[r1-1][c1-1]</span>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 2차원 누적합 만들기
for i in range(1, N + 1):
    for j in range(1, M + 1):
        prefix[i][j] = (arr[i][j]
                       + prefix[i-1][j]
                       + prefix[i][j-1]
                       - prefix[i-1][j-1])

# (r1, c1) ~ (r2, c2) 영역의 합
def query(r1, c1, r2, c2):
    return (prefix[r2][c2]
          - prefix[r1-1][c2]
          - prefix[r2][c1-1]
          + prefix[r1-1][c1-1])</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">2차원에서 왜 빼고 나서 다시 더하는 부분이 있을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        위쪽과 왼쪽을 빼면 <strong>왼쪽 위 모서리 부분이 두 번 빠지기</strong> 때문입니다!<br>
                        한 번 빼진 것을 다시 더해서 정확한 값을 구하는 것입니다.<br>
                        이것을 <strong>포함-배제 원리</strong>라고 합니다.
                    </div>
                </div>
            </div>

            <!-- ⑤ 누적합 문제 푸는 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 누적합 문제 푸는 3단계</div>
                <p style="color:var(--text2); margin-bottom:1rem;">누적합 문제를 만나면 이 3단계를 따라가세요.</p>
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="50" width="15" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>
                                <rect x="32" y="35" width="15" height="35" rx="2" fill="var(--accent)" opacity="0.6"/>
                                <rect x="54" y="15" width="15" height="55" rx="2" fill="var(--accent)" opacity="0.9"/>
                            </svg>
                        </div>
                        <h3>① 누적합 배열 만들기</h3>
                        <p>원래 배열을 쭉 훑으면서 합을 쌓아 올립니다. 2차원이면 행/열 방향으로 쌓습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="25" cy="40" r="18" fill="none" stroke="var(--green)" stroke-width="3" opacity="0.6"/>
                                <circle cx="55" cy="40" r="18" fill="none" stroke="var(--green)" stroke-width="3" opacity="0.6"/>
                                <text x="40" y="46" text-anchor="middle" fill="var(--green)" font-size="22" font-weight="bold">−</text>
                            </svg>
                        </div>
                        <h3>② 공식 적용하기</h3>
                        <p>1차원: <code>prefix[R] - prefix[L-1]</code><br>2차원: 포함-배제 공식을 적용합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="40" r="22" fill="none" stroke="var(--yellow)" stroke-width="3"/>
                                <text x="40" y="35" text-anchor="middle" fill="var(--yellow)" font-size="24" font-weight="bold">!</text>
                                <rect x="37" y="42" width="6" height="6" rx="1" fill="var(--yellow)"/>
                            </svg>
                        </div>
                        <h3>③ 예외 확인하기</h3>
                        <p>인덱스가 0 이하가 되지 않는지, 나머지 연산 등 특수 조건을 확인합니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"구간 합을 여러 번 물어보는 문제"를 보면 가장 먼저 어떤 방법을 떠올려야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>누적합</strong>입니다!<br>
                        "구간 합"이라는 키워드가 보이면 거의 반사적으로 누적합을 떠올리면 됩니다.<br>
                        특히 "여러 번 물어본다"는 말이 있으면 반복문으로는 느리고, 누적합이 필수입니다.
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
    },

    // ===== 개념 인터랙션 초기화 =====
    _initConceptInteractions(container) {
        // Think-box 토글
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('revealed');
            });
        });

        // 누적합 만들기 인터랙티브 데모
        const demo = container.querySelector('#ps-build-demo');
        if (demo) {
            const arr = [3, 1, 4, 1, 5];
            const prefix = [0];
            let step = 0;

            const origRow = demo.querySelector('#ps-original-row');
            const prefixRow = demo.querySelector('#ps-prefix-row');
            const nextBtn = demo.querySelector('#ps-build-next');
            const resetBtn = demo.querySelector('#ps-build-reset');

            // 원본 배열 표시
            origRow.innerHTML = '<span class="ps-row-label">arr</span>' +
                arr.map((v, i) => `<div class="ps-cell">${v}</div>`).join('');

            // prefix 배열 초기 표시
            const renderPrefix = () => {
                prefixRow.innerHTML = '<span class="ps-row-label">prefix</span>' +
                    Array.from({length: arr.length + 1}, (_, i) => {
                        if (i < prefix.length) {
                            const cls = i === prefix.length - 1 && step > 0 ? 'ps-cell built' : 'ps-cell built';
                            return `<div class="${cls}">${prefix[i]}</div>`;
                        }
                        return '<div class="ps-cell empty">?</div>';
                    }).join('');
            };
            renderPrefix();

            nextBtn.addEventListener('click', () => {
                if (step >= arr.length) return;
                prefix.push(prefix[prefix.length - 1] + arr[step]);
                step++;
                renderPrefix();

                // 현재 추가된 셀 하이라이트
                const cells = prefixRow.querySelectorAll('.ps-cell');
                cells[step].classList.add('building');
                setTimeout(() => cells[step].classList.remove('building'), 600);

                if (step >= arr.length) {
                    nextBtn.disabled = true;
                    nextBtn.textContent = '완성!';
                    resetBtn.classList.remove('hidden');
                }
            });

            resetBtn.addEventListener('click', () => {
                step = 0;
                prefix.length = 1;
                prefix[0] = 0;
                nextBtn.disabled = false;
                nextBtn.textContent = '다음 칸 채우기 →';
                resetBtn.classList.add('hidden');
                renderPrefix();
            });
        }

        // 코드 하이라이트
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        container.innerHTML = `
            <h2>누적합 시각화</h2>
            <div class="viz-type-selector">
                <button class="viz-type-btn active" data-viz="ps1d">1차원 누적합</button>
                <button class="viz-type-btn" data-viz="ps2d">2차원 누적합</button>
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

        switchViz('ps1d');
    },

    _renderVizType(container, type) {
        if (type === 'ps1d') this._renderViz1D(container);
        else if (type === 'ps2d') this._renderViz2D(container);
    },

    // ===== 1차원 누적합 시각화 =====
    _renderViz1D(container) {
        const defaultArr = [3, 1, 4, 1, 5, 9, 2, 6];

        container.innerHTML = `
            <div class="viz-card">
                <h3>1차원 누적합 만들기 & 구간 합 구하기</h3>
                <div class="ps-input-group">
                    <label>배열 (쉼표로 구분):</label>
                    <input type="text" id="ps1d-input" value="${defaultArr.join(', ')}" class="ps-input">
                    <button class="btn" id="ps1d-apply">적용</button>
                </div>
                <div class="ps-viz-area" id="ps1d-viz-area">
                    <div class="ps-row-wrapper">
                        <span class="ps-row-label">원본 배열</span>
                        <div class="ps-array-row" id="ps1d-arr-row"></div>
                    </div>
                    <div class="ps-row-wrapper">
                        <span class="ps-row-label">누적합 배열</span>
                        <div class="ps-array-row" id="ps1d-prefix-row"></div>
                    </div>
                    <div class="ps-formula-display" id="ps1d-formula"></div>
                </div>
                ${this._createStepControls()}
            </div>
        `;

        let arr = [...defaultArr];
        const self = this;

        const buildAndInit = () => {
            self._clearVizState();
            const prefix = [0];
            for (let i = 0; i < arr.length; i++) {
                prefix.push(prefix[i] + arr[i]);
            }

            const arrRow = container.querySelector('#ps1d-arr-row');
            const prefRow = container.querySelector('#ps1d-prefix-row');
            const formula = container.querySelector('#ps1d-formula');

            // 인덱스 표시
            arrRow.innerHTML = arr.map((v, i) =>
                `<div class="ps-cell" data-idx="${i}"><span class="ps-idx">${i + 1}</span>${v}</div>`
            ).join('');
            prefRow.innerHTML = prefix.map((v, i) =>
                `<div class="ps-cell" data-idx="${i}"><span class="ps-idx">${i}</span><span class="ps-val">?</span></div>`
            ).join('');
            formula.innerHTML = '';

            // 스텝 생성: Phase 1 - 누적합 만들기, Phase 2 - 구간 쿼리 예시
            const steps = [];
            const prefCells = () => prefRow.querySelectorAll('.ps-cell');
            const arrCells = () => arrRow.querySelectorAll('.ps-cell');

            // Phase 1: 누적합 배열 채우기
            steps.push({
                description: '누적합 배열의 0번째 칸에 0을 넣습니다 (시작값)',
                action() {
                    const cell = prefCells()[0];
                    cell.querySelector('.ps-val').textContent = '0';
                    cell.classList.add('built');
                    formula.innerHTML = '<span class="ps-formula-text">prefix[0] = 0</span>';
                },
                undo() {
                    const cell = prefCells()[0];
                    cell.querySelector('.ps-val').textContent = '?';
                    cell.classList.remove('built');
                    formula.innerHTML = '';
                }
            });

            for (let i = 0; i < arr.length; i++) {
                const idx = i;
                steps.push({
                    description: `prefix[${idx + 1}] = prefix[${idx}](${prefix[idx]}) + arr[${idx + 1}](${arr[idx]}) = ${prefix[idx + 1]}`,
                    action() {
                        const pCell = prefCells()[idx + 1];
                        pCell.querySelector('.ps-val').textContent = prefix[idx + 1];
                        pCell.classList.add('building');
                        setTimeout(() => { pCell.classList.remove('building'); pCell.classList.add('built'); }, 400);

                        // 원본 배열 현재 칸 강조
                        arrCells()[idx].classList.add('highlighted');
                        // 이전 prefix 칸 강조
                        prefCells()[idx].classList.add('highlighted');

                        formula.innerHTML = `<span class="ps-formula-text">prefix[${idx + 1}] = prefix[${idx}] + arr[${idx + 1}] = ${prefix[idx]} + ${arr[idx]} = <strong>${prefix[idx + 1]}</strong></span>`;
                    },
                    undo() {
                        const pCell = prefCells()[idx + 1];
                        pCell.querySelector('.ps-val').textContent = '?';
                        pCell.classList.remove('built', 'building');
                        arrCells()[idx].classList.remove('highlighted');
                        prefCells()[idx].classList.remove('highlighted');
                        if (idx > 0) {
                            formula.innerHTML = `<span class="ps-formula-text">prefix[${idx}] = ${prefix[idx]}</span>`;
                        } else {
                            formula.innerHTML = '<span class="ps-formula-text">prefix[0] = 0</span>';
                        }
                    }
                });
            }

            // Phase 2: 구간 합 쿼리 예시
            const queryExamples = [
                { L: 2, R: 5 },
                { L: 3, R: 7 },
                { L: 1, R: arr.length }
            ];

            // 누적합 완성 단계
            steps.push({
                description: '누적합 배열이 완성되었습니다! 이제 구간 합을 구해봅시다.',
                action() {
                    // 모든 하이라이트 제거
                    arrCells().forEach(c => c.classList.remove('highlighted'));
                    prefCells().forEach(c => c.classList.remove('highlighted'));
                    formula.innerHTML = '<span class="ps-formula-text" style="color:var(--green)">✅ 누적합 배열 완성! 이제 어떤 구간이든 O(1)에 합을 구할 수 있습니다.</span>';
                },
                undo() {
                    const lastIdx = arr.length - 1;
                    arrCells()[lastIdx].classList.add('highlighted');
                    prefCells()[lastIdx].classList.add('highlighted');
                    formula.innerHTML = `<span class="ps-formula-text">prefix[${arr.length}] = ${prefix[arr.length]}</span>`;
                }
            });

            queryExamples.forEach(({L, R}) => {
                if (R > arr.length) return;
                const ans = prefix[R] - prefix[L - 1];
                steps.push({
                    description: `구간 합 구하기: ${L}번째 ~ ${R}번째 합 = prefix[${R}] - prefix[${L - 1}] = ${prefix[R]} - ${prefix[L - 1]} = ${ans}`,
                    action() {
                        // 모든 하이라이트 제거
                        arrCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result'));
                        prefCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result'));

                        // 원본 배열에서 해당 구간 하이라이트
                        for (let i = L - 1; i < R; i++) {
                            arrCells()[i].classList.add('result');
                        }
                        // prefix[R] 강조 (보라)
                        prefCells()[R].classList.add('highlighted');
                        // prefix[L-1] 강조 (빨강 = 빼는 부분)
                        if (L - 1 >= 0) prefCells()[L - 1].classList.add('subtracting');

                        formula.innerHTML = `<span class="ps-formula-text">arr[${L}]~arr[${R}]의 합 = <span class="ps-highlight">prefix[${R}]</span> − <span class="ps-subtract">prefix[${L - 1}]</span> = ${prefix[R]} − ${prefix[L - 1]} = <strong class="ps-result-num">${ans}</strong></span>`;
                    },
                    undo() {
                        arrCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result'));
                        prefCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result'));
                        formula.innerHTML = '<span class="ps-formula-text" style="color:var(--green)">✅ 누적합 배열 완성!</span>';
                    }
                });
            });

            self._initStepController(container, steps);
        };

        // 배열 입력 적용
        container.querySelector('#ps1d-apply').addEventListener('click', () => {
            const input = container.querySelector('#ps1d-input').value;
            const parsed = input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (parsed.length < 2 || parsed.length > 12) {
                alert('배열 크기는 2~12개로 입력해 주세요.');
                return;
            }
            arr = parsed;
            buildAndInit();
        });

        buildAndInit();
    },

    // ===== 2차원 누적합 시각화 =====
    _renderViz2D(container) {
        const defaultGrid = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16]
        ];
        let N = 4;

        container.innerHTML = `
            <div class="viz-card">
                <h3>2차원 누적합 만들기 & 영역 합 구하기</h3>
                <div class="ps-input-group">
                    <label>격자 크기:</label>
                    <input type="range" id="ps2d-size" min="3" max="5" value="${N}" class="ps-slider">
                    <span id="ps2d-size-label">${N}×${N}</span>
                </div>
                <div class="ps-2d-viz-area" id="ps2d-viz-area">
                    <div class="ps-2d-grids">
                        <div>
                            <h4 style="text-align:center; margin-bottom:0.5rem;">원본 배열</h4>
                            <div class="ps-grid" id="ps2d-arr-grid"></div>
                        </div>
                        <div>
                            <h4 style="text-align:center; margin-bottom:0.5rem;">누적합 배열</h4>
                            <div class="ps-grid" id="ps2d-prefix-grid"></div>
                        </div>
                    </div>
                    <div class="ps-formula-display" id="ps2d-formula"></div>
                </div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;

        const buildAndInit = () => {
            self._clearVizState();

            // 격자 데이터 생성
            const grid = [];
            for (let i = 0; i < N; i++) {
                grid[i] = [];
                for (let j = 0; j < N; j++) {
                    grid[i][j] = (i < defaultGrid.length && j < defaultGrid[0].length)
                        ? defaultGrid[i][j]
                        : (i + 1) * (j + 1);
                }
            }

            // 2D prefix 계산
            const prefix = Array.from({length: N + 1}, () => Array(N + 1).fill(0));
            for (let i = 1; i <= N; i++) {
                for (let j = 1; j <= N; j++) {
                    prefix[i][j] = grid[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
                }
            }

            const arrGrid = container.querySelector('#ps2d-arr-grid');
            const prefGrid = container.querySelector('#ps2d-prefix-grid');
            const formula = container.querySelector('#ps2d-formula');

            // 그리드 렌더링
            arrGrid.style.gridTemplateColumns = `repeat(${N}, 48px)`;
            prefGrid.style.gridTemplateColumns = `repeat(${N + 1}, 48px)`;

            arrGrid.innerHTML = grid.map((row, i) =>
                row.map((v, j) => `<div class="ps-grid-cell" data-r="${i}" data-c="${j}">${v}</div>`).join('')
            ).join('');

            // prefix grid (N+1)×(N+1)
            let prefHTML = '';
            for (let i = 0; i <= N; i++) {
                for (let j = 0; j <= N; j++) {
                    prefHTML += `<div class="ps-grid-cell" data-r="${i}" data-c="${j}"><span class="ps-val">?</span></div>`;
                }
            }
            prefGrid.innerHTML = prefHTML;

            formula.innerHTML = '';

            const steps = [];
            const pCells = () => prefGrid.querySelectorAll('.ps-grid-cell');
            const aCells = () => arrGrid.querySelectorAll('.ps-grid-cell');
            const getPC = (r, c) => pCells()[r * (N + 1) + c];
            const getAC = (r, c) => aCells()[r * N + c];
            const clearAllHighlights = () => {
                pCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result', 'built', 'building', 'region-full', 'region-sub', 'region-add', 'region-result'));
                aCells().forEach(c => c.classList.remove('highlighted', 'subtracting', 'result', 'region-full', 'region-sub', 'region-add', 'region-result'));
            };

            // Phase 1: 0번 행, 0번 열 채우기
            steps.push({
                description: '누적합 배열의 0번 행과 0번 열을 모두 0으로 채웁니다',
                action() {
                    for (let i = 0; i <= N; i++) {
                        getPC(0, i).querySelector('.ps-val').textContent = '0';
                        getPC(0, i).classList.add('built');
                        getPC(i, 0).querySelector('.ps-val').textContent = '0';
                        getPC(i, 0).classList.add('built');
                    }
                    formula.innerHTML = '<span class="ps-formula-text">0번 행과 0번 열 = 모두 0 (시작값)</span>';
                },
                undo() {
                    for (let i = 0; i <= N; i++) {
                        getPC(0, i).querySelector('.ps-val').textContent = '?';
                        getPC(0, i).classList.remove('built');
                        getPC(i, 0).querySelector('.ps-val').textContent = '?';
                        getPC(i, 0).classList.remove('built');
                    }
                    formula.innerHTML = '';
                }
            });

            // Phase 2: 나머지 칸 채우기 (행 단위)
            for (let i = 1; i <= N; i++) {
                for (let j = 1; j <= N; j++) {
                    const ri = i, cj = j;
                    steps.push({
                        description: `prefix[${ri}][${cj}] = arr[${ri}][${cj}](${grid[ri-1][cj-1]}) + prefix[${ri-1}][${cj}](${prefix[ri-1][cj]}) + prefix[${ri}][${cj-1}](${prefix[ri][cj-1]}) − prefix[${ri-1}][${cj-1}](${prefix[ri-1][cj-1]}) = ${prefix[ri][cj]}`,
                        action() {
                            const cell = getPC(ri, cj);
                            cell.querySelector('.ps-val').textContent = prefix[ri][cj];
                            cell.classList.add('building');
                            setTimeout(() => { cell.classList.remove('building'); cell.classList.add('built'); }, 400);
                            getAC(ri - 1, cj - 1).classList.add('highlighted');
                            formula.innerHTML = `<span class="ps-formula-text">prefix[${ri}][${cj}] = ${grid[ri-1][cj-1]} + ${prefix[ri-1][cj]} + ${prefix[ri][cj-1]} − ${prefix[ri-1][cj-1]} = <strong>${prefix[ri][cj]}</strong></span>`;
                        },
                        undo() {
                            const cell = getPC(ri, cj);
                            cell.querySelector('.ps-val').textContent = '?';
                            cell.classList.remove('built', 'building');
                            getAC(ri - 1, cj - 1).classList.remove('highlighted');
                            if (ri === 1 && cj === 1) {
                                formula.innerHTML = '<span class="ps-formula-text">0번 행과 0번 열 = 모두 0</span>';
                            } else {
                                const pi = cj > 1 ? ri : ri - 1;
                                const pj = cj > 1 ? cj - 1 : N;
                                formula.innerHTML = `<span class="ps-formula-text">prefix[${pi}][${pj}] = ${prefix[pi][pj]}</span>`;
                            }
                        }
                    });
                }
            }

            // Phase 3: 완성 메시지
            steps.push({
                description: '2차원 누적합 배열이 완성되었습니다! 이제 영역 합을 구해봅시다.',
                action() {
                    clearAllHighlights();
                    pCells().forEach(c => c.classList.add('built'));
                    formula.innerHTML = '<span class="ps-formula-text" style="color:var(--green)">✅ 2차원 누적합 완성! 포함-배제 공식으로 영역 합을 구합니다.</span>';
                },
                undo() {
                    const lastI = N, lastJ = N;
                    getAC(lastI - 1, lastJ - 1).classList.add('highlighted');
                    formula.innerHTML = `<span class="ps-formula-text">prefix[${lastI}][${lastJ}] = ${prefix[lastI][lastJ]}</span>`;
                }
            });

            // Phase 4: 영역 쿼리 예시
            const queries = [
                { r1: 2, c1: 2, r2: 3, c2: 3 },
                { r1: 1, c1: 2, r2: N, c2: N }
            ];

            queries.forEach(({r1, c1, r2, c2}) => {
                if (r2 > N || c2 > N) return;
                const ans = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1];

                // 4단계: 전체 → 위 빼기 → 왼쪽 빼기 → 겹침 더하기
                steps.push({
                    description: `영역 (${r1},${c1})~(${r2},${c2}) 합 구하기: 1단계 — 전체 영역 prefix[${r2}][${c2}] = ${prefix[r2][c2]}`,
                    action() {
                        clearAllHighlights();
                        // 원본 배열에서 해당 영역 표시
                        for (let i = r1 - 1; i < r2; i++) {
                            for (let j = c1 - 1; j < c2; j++) {
                                getAC(i, j).classList.add('region-result');
                            }
                        }
                        getPC(r2, c2).classList.add('region-full');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">prefix[${r2}][${c2}]</span> = ${prefix[r2][c2]}</span>`;
                    },
                    undo() {
                        clearAllHighlights();
                        pCells().forEach(c => c.classList.add('built'));
                        formula.innerHTML = '<span class="ps-formula-text" style="color:var(--green)">✅ 2차원 누적합 완성!</span>';
                    }
                });

                steps.push({
                    description: `2단계 — 위쪽 빼기: − prefix[${r1-1}][${c2}] = −${prefix[r1-1][c2]}`,
                    action() {
                        getPC(r1-1, c2).classList.add('region-sub');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">${prefix[r2][c2]}</span> − <span class="ps-subtract">${prefix[r1-1][c2]}</span></span>`;
                    },
                    undo() {
                        getPC(r1-1, c2).classList.remove('region-sub');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">prefix[${r2}][${c2}]</span> = ${prefix[r2][c2]}</span>`;
                    }
                });

                steps.push({
                    description: `3단계 — 왼쪽 빼기: − prefix[${r2}][${c1-1}] = −${prefix[r2][c1-1]}`,
                    action() {
                        getPC(r2, c1-1).classList.add('region-sub');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">${prefix[r2][c2]}</span> − <span class="ps-subtract">${prefix[r1-1][c2]}</span> − <span class="ps-subtract">${prefix[r2][c1-1]}</span></span>`;
                    },
                    undo() {
                        getPC(r2, c1-1).classList.remove('region-sub');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">${prefix[r2][c2]}</span> − <span class="ps-subtract">${prefix[r1-1][c2]}</span></span>`;
                    }
                });

                steps.push({
                    description: `4단계 — 겹쳐서 빠진 부분 더하기: + prefix[${r1-1}][${c1-1}] = +${prefix[r1-1][c1-1]} → 결과: ${ans}`,
                    action() {
                        getPC(r1-1, c1-1).classList.add('region-add');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">${prefix[r2][c2]}</span> − <span class="ps-subtract">${prefix[r1-1][c2]}</span> − <span class="ps-subtract">${prefix[r2][c1-1]}</span> + <span class="ps-add">${prefix[r1-1][c1-1]}</span> = <strong class="ps-result-num">${ans}</strong></span>`;
                    },
                    undo() {
                        getPC(r1-1, c1-1).classList.remove('region-add');
                        formula.innerHTML = `<span class="ps-formula-text"><span class="ps-highlight">${prefix[r2][c2]}</span> − <span class="ps-subtract">${prefix[r1-1][c2]}</span> − <span class="ps-subtract">${prefix[r2][c1-1]}</span></span>`;
                    }
                });
            });

            self._initStepController(container, steps);
        };

        // 사이즈 슬라이더
        container.querySelector('#ps2d-size').addEventListener('input', (e) => {
            N = parseInt(e.target.value);
            container.querySelector('#ps2d-size-label').textContent = `${N}×${N}`;
            buildAndInit();
        });

        buildAndInit();
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
        { num: 1, title: '1차원 입문', desc: '기본 누적합 (Silver III)', problemIds: ['boj-11659', 'boj-2559'] },
        { num: 2, title: '응용', desc: '누적합 활용 (Silver I ~ Gold III)', problemIds: ['boj-16139', 'boj-10986'] },
        { num: 3, title: '2차원', desc: '2차원 누적합 (Silver I ~ Gold V)', problemIds: ['boj-11660', 'boj-25682'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 1차원 입문 ==========
        {
            id: 'boj-11659',
            title: 'BOJ 11659 - 구간 합 구하기 4',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11659',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수 N개가 주어졌을 때, i번째 수부터 j번째 수까지의 합을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 수의 개수 N과 합을 구해야 하는 횟수 M이 주어진다. (1 ≤ N ≤ 100,000, 1 ≤ M ≤ 100,000)<br>둘째 줄에 N개의 수가 주어진다. 각 수는 1,000 이하의 자연수이다.<br>셋째 줄부터 M개의 줄에는 합을 구해야 하는 구간 i와 j가 주어진다.</p></div>
                    <div><h4>출력</h4><p>총 M개의 줄에 입력으로 주어진 i번째 수부터 j번째 수까지의 합을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5 3\n5 4 3 2 1\n1 3\n2 4\n5 5</pre></div>
                        <div><strong>출력</strong><pre>12\n9\n1</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '질문이 최대 100,000번이므로 매번 반복문으로 합을 구하면 시간 초과입니다. <strong>누적합</strong>을 미리 만들어 두세요.' },
                { title: '핵심 공식', content: '<code>prefix[j] - prefix[i-1]</code>로 i번째~j번째의 합을 O(1)에 구할 수 있습니다.' },
                { title: '주의할 점', content: '인덱스가 1부터 시작합니다. <code>prefix[0] = 0</code>으로 두면 예외 처리 없이 깔끔하게 풀 수 있습니다.' }
            ],
            inputDefault: 5,
            solve(n) {
                const arr = [5, 4, 3, 2, 1];
                const prefix = [0];
                for (let i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
                const queries = [[1,3],[2,4],[5,5]];
                return queries.map(([i,j]) => prefix[j] - prefix[i-1]).join('\n');
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

# 누적합 배열 만들기
prefix = [0] * (N + 1)
for i in range(1, N + 1):
    prefix[i] = prefix[i - 1] + arr[i - 1]

# 각 질문에 답하기
for _ in range(M):
    i, j = map(int, input().split())
    print(prefix[j] - prefix[i - 1])`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;

    long long prefix[100001] = {0};
    for (int i = 1; i <= N; i++) {
        int x;
        cin >> x;
        prefix[i] = prefix[i - 1] + x;
    }

    while (M--) {
        int i, j;
        cin >> i >> j;
        cout << prefix[j] - prefix[i - 1] << '\\n';
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        long[] prefix = new long[N + 1];
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= N; i++) {
            prefix[i] = prefix[i - 1] + Integer.parseInt(st.nextToken());
        }

        StringBuilder sb = new StringBuilder();
        for (int q = 0; q < M; q++) {
            st = new StringTokenizer(br.readLine());
            int i = Integer.parseInt(st.nextToken());
            int j = Integer.parseInt(st.nextToken());
            sb.append(prefix[j] - prefix[i - 1]).append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-2559',
            title: 'BOJ 2559 - 수열',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2559',
            descriptionHTML: `
                <h3>문제</h3>
                <p>매일 측정한 온도가 N일 동안 주어졌을 때, 연속적인 K일 동안의 온도의 합이 가장 큰 값을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N과 K가 주어진다. (1 ≤ K ≤ N ≤ 100,000)<br>둘째 줄에 N개의 정수가 주어진다. (-100 ≤ 각 값 ≤ 100)</p></div>
                    <div><h4>출력</h4><p>연속적인 K일의 온도 합의 최대값을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10 2\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div>
                        <div><strong>출력</strong><pre>21</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '연속 K일의 합 = 길이가 K인 구간의 합입니다. 누적합을 만들어 모든 길이 K 구간의 합을 구하고 최대값을 찾으세요.' },
                { title: '핵심 공식', content: 'i번째부터 K개 합 = <code>prefix[i + K - 1] - prefix[i - 1]</code><br>이것을 i = 1부터 N - K + 1까지 반복하며 최대값을 구합니다.' },
                { title: '다른 방법', content: '슬라이딩 윈도우로도 풀 수 있습니다. 하지만 누적합을 쓰면 코드가 더 간단합니다.' }
            ],
            inputDefault: 10,
            solve(n) {
                const arr = [3, -2, -4, -9, 0, 3, 7, 13, 8, -3];
                const K = 2;
                const prefix = [0];
                for (let i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
                let max = -Infinity;
                for (let i = 1; i <= arr.length - K + 1; i++) {
                    max = Math.max(max, prefix[i + K - 1] - prefix[i - 1]);
                }
                return String(max);
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, K = map(int, input().split())
arr = list(map(int, input().split()))

# 누적합 배열 만들기
prefix = [0] * (N + 1)
for i in range(1, N + 1):
    prefix[i] = prefix[i - 1] + arr[i - 1]

# 길이 K인 모든 구간의 합 중 최대값
ans = -float('inf')
for i in range(1, N - K + 2):
    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])

print(ans)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;

    long long prefix[100001] = {0};
    for (int i = 1; i <= N; i++) {
        int x;
        cin >> x;
        prefix[i] = prefix[i - 1] + x;
    }

    long long ans = -1e18;
    for (int i = 1; i <= N - K + 1; i++) {
        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);
    }
    cout << ans << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int K = Integer.parseInt(st.nextToken());

        long[] prefix = new long[N + 1];
        st = new StringTokenizer(br.readLine());
        for (int i = 1; i <= N; i++) {
            prefix[i] = prefix[i - 1] + Integer.parseInt(st.nextToken());
        }

        long ans = Long.MIN_VALUE;
        for (int i = 1; i <= N - K + 1; i++) {
            ans = Math.max(ans, prefix[i + K - 1] - prefix[i - 1]);
        }
        System.out.println(ans);
    }
}`
            }
        },

        // ========== 2단계: 응용 ==========
        {
            id: 'boj-16139',
            title: 'BOJ 16139 - 인간-컴퓨터 상호작용',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/16139',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 S와 질문이 주어집니다. 각 질문은 알파벳 하나와 구간 [l, r]로 이루어져 있으며, S의 l번째부터 r번째까지에서 그 알파벳이 몇 번 나오는지 구해야 합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 문자열 S (길이 ≤ 200,000)<br>둘째 줄에 질문의 수 q (≤ 200,000)<br>다음 q줄에 알파벳, l, r이 주어진다.</p></div>
                    <div><h4>출력</h4><p>각 질문에 대한 답을 한 줄에 하나씩 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>seungjaehwang\n4\na 0 12\ns 0 12\na 3 7\na 0 5</pre></div>
                        <div><strong>출력</strong><pre>2\n1\n0\n1</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '알파벳 하나에 대한 누적합이 아니라, <strong>26개 알파벳 각각에 대해 누적합 배열</strong>을 만들어야 합니다.' },
                { title: '핵심 아이디어', content: '<code>count[c][i]</code> = 문자열의 처음부터 i번째까지 알파벳 c가 나온 횟수<br>답: <code>count[c][r+1] - count[c][l]</code>' },
                { title: '구현 팁', content: '인덱스가 0부터 시작합니다. 누적합 배열은 길이를 N+1로 만들면 편합니다.' }
            ],
            inputDefault: 13,
            solve(n) {
                return '2\n1\n0\n1';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

S = input().strip()
N = len(S)
q = int(input())

# 26개 알파벳별 누적합
count = [[0] * (N + 1) for _ in range(26)]
for i in range(N):
    for c in range(26):
        count[c][i + 1] = count[c][i]
    count[ord(S[i]) - ord('a')][i + 1] += 1

for _ in range(q):
    parts = input().split()
    c = ord(parts[0]) - ord('a')
    l, r = int(parts[1]), int(parts[2])
    print(count[c][r + 1] - count[c][l])`,
                cpp: `#include <iostream>
#include <cstring>
using namespace std;

int count[26][200002];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string S;
    cin >> S;
    int N = S.size();
    int q;
    cin >> q;

    for (int i = 0; i < N; i++) {
        for (int c = 0; c < 26; c++)
            count[c][i + 1] = count[c][i];
        count[S[i] - 'a'][i + 1]++;
    }

    while (q--) {
        char ch;
        int l, r;
        cin >> ch >> l >> r;
        cout << count[ch - 'a'][r + 1] - count[ch - 'a'][l] << '\\n';
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String S = br.readLine().trim();
        int N = S.length();
        int q = Integer.parseInt(br.readLine().trim());

        int[][] count = new int[26][N + 1];
        for (int i = 0; i < N; i++) {
            for (int c = 0; c < 26; c++)
                count[c][i + 1] = count[c][i];
            count[S.charAt(i) - 'a'][i + 1]++;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int c = st.nextToken().charAt(0) - 'a';
            int l = Integer.parseInt(st.nextToken());
            int r = Integer.parseInt(st.nextToken());
            sb.append(count[c][r + 1] - count[c][l]).append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-10986',
            title: 'BOJ 10986 - 나머지 합',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10986',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수 N개가 주어졌을 때, 연속된 부분 구간의 합이 M으로 나누어 떨어지는 구간의 개수를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N과 M이 주어진다. (1 ≤ N ≤ 1,000,000, 2 ≤ M ≤ 1,000)<br>둘째 줄에 N개의 수가 주어진다. (0 ≤ 각 수 ≤ 1,000,000,000)</p></div>
                    <div><h4>출력</h4><p>M으로 나누어 떨어지는 구간의 수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5 3\n1 2 3 1 2</pre></div>
                        <div><strong>출력</strong><pre>7</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '구간 합 = <code>prefix[j] - prefix[i]</code>가 M의 배수 ⟺ <code>prefix[j] % M == prefix[i] % M</code>입니다.' },
                { title: '핵심 아이디어', content: '누적합의 나머지가 같은 것끼리 짝을 지으면 됩니다!<br><code>cnt[r]</code> = 나머지가 r인 prefix 값의 개수<br>답 = Σ <code>cnt[r] × (cnt[r]-1) / 2</code> (나머지가 같은 쌍의 수)' },
                { title: '주의할 점', content: '<code>prefix[0] = 0</code>도 포함해야 합니다 (나머지 0).<br>또한 답이 매우 커질 수 있으므로 <strong>long long</strong> 타입을 사용하세요.' }
            ],
            inputDefault: 5,
            solve(n) {
                return '7';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

# 나머지별 개수 세기
cnt = [0] * M
prefix_mod = 0
cnt[0] = 1  # prefix[0] = 0의 나머지는 0

for x in arr:
    prefix_mod = (prefix_mod + x) % M
    cnt[prefix_mod] += 1

# 나머지가 같은 쌍의 수 = nC2
ans = 0
for c in cnt:
    ans += c * (c - 1) // 2

print(ans)`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;

    long long cnt[1001] = {0};
    cnt[0] = 1;
    long long prefix_mod = 0;

    for (int i = 0; i < N; i++) {
        long long x;
        cin >> x;
        prefix_mod = (prefix_mod + x) % M;
        cnt[prefix_mod]++;
    }

    long long ans = 0;
    for (int r = 0; r < M; r++) {
        ans += cnt[r] * (cnt[r] - 1) / 2;
    }
    cout << ans << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        long[] cnt = new long[M];
        cnt[0] = 1;
        long prefixMod = 0;

        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < N; i++) {
            prefixMod = (prefixMod + Long.parseLong(st.nextToken())) % M;
            cnt[(int) prefixMod]++;
        }

        long ans = 0;
        for (int r = 0; r < M; r++) {
            ans += cnt[r] * (cnt[r] - 1) / 2;
        }
        System.out.println(ans);
    }
}`
            }
        },

        // ========== 3단계: 2차원 ==========
        {
            id: 'boj-11660',
            title: 'BOJ 11660 - 구간 합 구하기 5',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11660',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 표에 수가 채워져 있습니다. (x1, y1)부터 (x2, y2)까지 합을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 표의 크기 N과 합을 구해야 하는 횟수 M이 주어진다. (1 ≤ N ≤ 1024, 1 ≤ M ≤ 100,000)<br>다음 N줄에 표의 수가 주어진다.<br>다음 M줄에 x1, y1, x2, y2가 주어진다.</p></div>
                    <div><h4>출력</h4><p>총 M줄에 걸쳐 (x1, y1)부터 (x2, y2)까지의 합을 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 3\n1 2 3 4\n2 3 4 5\n3 4 5 6\n4 5 6 7\n2 2 3 4\n3 4 3 4\n1 1 4 4</pre></div>
                        <div><strong>출력</strong><pre>27\n6\n64</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>2차원 누적합</strong>을 사용합니다. 개념 설명에서 배운 포함-배제 공식을 그대로 적용하세요.' },
                { title: '누적합 만들기', content: '<code>prefix[i][j] = arr[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]</code>' },
                { title: '쿼리 공식', content: '<code>prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]</code>' }
            ],
            inputDefault: 4,
            solve(n) {
                return '27\n6\n64';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())

# 2차원 누적합 만들기
prefix = [[0] * (N + 1) for _ in range(N + 1)]
for i in range(1, N + 1):
    row = list(map(int, input().split()))
    for j in range(1, N + 1):
        prefix[i][j] = (row[j - 1]
                        + prefix[i - 1][j]
                        + prefix[i][j - 1]
                        - prefix[i - 1][j - 1])

# 각 질문에 답하기
for _ in range(M):
    x1, y1, x2, y2 = map(int, input().split())
    ans = (prefix[x2][y2]
          - prefix[x1 - 1][y2]
          - prefix[x2][y1 - 1]
          + prefix[x1 - 1][y1 - 1])
    print(ans)`,
                cpp: `#include <iostream>
using namespace std;

int prefix[1025][1025];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            int x;
            cin >> x;
            prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
        }
    }

    while (M--) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        cout << prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1] << '\\n';
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        int[][] prefix = new int[N + 1][N + 1];
        for (int i = 1; i <= N; i++) {
            st = new StringTokenizer(br.readLine());
            for (int j = 1; j <= N; j++) {
                int x = Integer.parseInt(st.nextToken());
                prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int q = 0; q < M; q++) {
            st = new StringTokenizer(br.readLine());
            int x1 = Integer.parseInt(st.nextToken());
            int y1 = Integer.parseInt(st.nextToken());
            int x2 = Integer.parseInt(st.nextToken());
            int y2 = Integer.parseInt(st.nextToken());
            sb.append(prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]).append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-25682',
            title: 'BOJ 25682 - 체스판 다시 칠하기 2',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/25682',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M 보드에서 K×K 크기로 잘라 체스판을 만들려 합니다. 체스판은 검은색과 흰색이 번갈아 칠해져 있어야 합니다. 다시 칠해야 하는 칸의 최소 개수를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N, M, K가 주어진다. (1 ≤ K ≤ N, M ≤ 2,000)<br>다음 N줄에 보드의 상태가 B(검정) 또는 W(흰색)로 주어진다.</p></div>
                    <div><h4>출력</h4><p>다시 칠해야 하는 칸의 최소 개수를 출력한다.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 4 3\nBBBB\nBBBB\nBBBB\nBBBB</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '체스판 패턴은 2가지입니다: (1) 왼쪽 위가 검정, (2) 왼쪽 위가 흰색. 각 패턴에 대해 "다시 칠해야 하는 칸"을 0/1로 만든 뒤, <strong>2차원 누적합</strong>으로 K×K 영역의 합을 빠르게 구합니다.' },
                { title: '핵심 아이디어', content: '(i+j)가 짝수인 칸이 B인지 W인지로 체스판 패턴과 다른지 판단합니다.<br>칸 (i,j)에서 기대 색이 아니면 1, 맞으면 0인 배열을 만든 뒤 2차원 누적합을 구합니다.' },
                { title: '최적화', content: '패턴 1의 "다시 칠할 수"가 x이면, 패턴 2의 "다시 칠할 수"는 K×K - x입니다. 그래서 한 번만 누적합을 만들면 됩니다.' }
            ],
            inputDefault: 4,
            solve(n) {
                return '4';
            },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M, K = map(int, input().split())
board = [input().strip() for _ in range(N)]

# (i+j)가 짝수인 칸에 B가 와야 하는 패턴 기준
# 다른 칸이면 1, 같으면 0
diff = [[0] * (M + 1) for _ in range(N + 1)]
for i in range(N):
    for j in range(M):
        expected = 'B' if (i + j) % 2 == 0 else 'W'
        diff[i + 1][j + 1] = 1 if board[i][j] != expected else 0

# 2차원 누적합
prefix = [[0] * (M + 1) for _ in range(N + 1)]
for i in range(1, N + 1):
    for j in range(1, M + 1):
        prefix[i][j] = (diff[i][j]
                        + prefix[i-1][j]
                        + prefix[i][j-1]
                        - prefix[i-1][j-1])

ans = float('inf')
for i in range(1, N - K + 2):
    for j in range(1, M - K + 2):
        # 패턴 1: (i+j) 짝수 = B
        cost1 = (prefix[i+K-1][j+K-1]
                - prefix[i-1][j+K-1]
                - prefix[i+K-1][j-1]
                + prefix[i-1][j-1])
        # 패턴 2: 반대 = K*K - cost1
        cost2 = K * K - cost1
        ans = min(ans, cost1, cost2)

print(ans)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int prefix[2001][2001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M, K;
    cin >> N >> M >> K;

    for (int i = 1; i <= N; i++) {
        string row;
        cin >> row;
        for (int j = 1; j <= M; j++) {
            char expected = ((i + j) % 2 == 0) ? 'B' : 'W';
            int diff = (row[j - 1] != expected) ? 1 : 0;
            prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
        }
    }

    int ans = N * M;
    for (int i = 1; i <= N - K + 1; i++) {
        for (int j = 1; j <= M - K + 1; j++) {
            int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];
            int cost2 = K * K - cost1;
            ans = min({ans, cost1, cost2});
        }
    }
    cout << ans << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int K = Integer.parseInt(st.nextToken());

        int[][] prefix = new int[N + 1][M + 1];
        for (int i = 1; i <= N; i++) {
            String row = br.readLine().trim();
            for (int j = 1; j <= M; j++) {
                char expected = ((i + j) % 2 == 0) ? 'B' : 'W';
                int diff = (row.charAt(j - 1) != expected) ? 1 : 0;
                prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            }
        }

        int ans = N * M;
        for (int i = 1; i <= N - K + 1; i++) {
            for (int j = 1; j <= M - K + 1; j++) {
                int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];
                int cost2 = K * K - cost1;
                ans = Math.min(ans, Math.min(cost1, cost2));
            }
        }
        System.out.println(ans);
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
            const n = problem.inputDefault;
            const expected = problem.solve(n);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const n = problem.inputDefault;
            const expected = problem.solve(n);
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
window.AlgoTopics.prefixsum = prefixSumTopic;
