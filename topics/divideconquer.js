// ===== 분할정복 알고리즘 토픽 모듈 =====
const divideConquerTopic = {
    id: 'divideconquer',
    title: '분할정복',
    icon: '🔪',
    category: '알고리즘',
    order: 4,
    description: '큰 문제를 작게 나눠서 풀고 합치는 기법',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔪 분할정복 (Divide and Conquer)</h2>
                <p class="hero-sub">큰 문제를 작게 나누고, 각각 풀어서, 합치면 전체 답이 됩니다</p>
            </div>

            <!-- ① 분할정복이란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 분할정복이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 피자를 8명이 나눠 먹어야 합니다.<br><br>
                    1. <strong>나누기(Divide)</strong>: 피자를 반으로 자릅니다 → 또 반으로 → 또 반으로 → 8조각!<br>
                    2. <strong>풀기(Conquer)</strong>: 각 조각을 한 명씩 먹습니다.<br>
                    3. <strong>합치기(Combine)</strong>: 모두가 배부르게 됩니다!<br><br>
                    이렇게 <strong>큰 문제를 작은 문제로 나누고, 작은 문제를 풀고, 결과를 합치는 것</strong>이 분할정복입니다.
                </div>

                <div class="code-block"><pre><code class="language-python"># 이진 탐색 (분할정복의 가장 간단한 예)
def binary_search(arr, target, lo, hi):
    if lo > hi:
        return -1                    # 기저 조건: 찾을 범위 없음
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid                   # 찾았다!
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, hi)  # 오른쪽 절반
    else:
        return binary_search(arr, target, lo, mid - 1)  # 왼쪽 절반</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">1024개의 정렬된 숫자에서 이진 탐색으로 원하는 숫자를 찾으려면 최대 몇 번 비교해야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>최대 10번</strong>입니다!<br>
                        1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1<br>
                        매번 반으로 나누므로 <strong>log₂(1024) = 10</strong>번이면 충분합니다.<br>
                        하나씩 찾으면 최대 1024번인데, 분할정복으로 <strong>10번</strong>이면 됩니다!
                    </div>
                </div>
            </div>

            <!-- ② 분할정복의 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 분할정복의 3단계</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>
                            </svg>
                        </div>
                        <h3>1. 나누기 (Divide)</h3>
                        <p>큰 문제를 <strong>같은 형태의 작은 문제</strong>로 나눕니다. 보통 절반으로 나누거나, 4등분 합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>
                                <path d="M28 55 L40 68 L52 55" fill="none" stroke="var(--green)" stroke-width="2"/>
                            </svg>
                        </div>
                        <h3>2. 풀기 (Conquer)</h3>
                        <p>작은 문제들을 <strong>재귀적으로</strong> 풀어나갑니다. 더 이상 나눌 수 없으면 바로 답을 구합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>
                                <path d="M33 40 L47 40" stroke="var(--yellow)" stroke-width="3" marker-end="url(#arrowhead)"/>
                            </svg>
                        </div>
                        <h3>3. 합치기 (Combine)</h3>
                        <p>작은 문제의 답들을 <strong>합쳐서</strong> 원래 큰 문제의 답을 만듭니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 합병 정렬 (Merge Sort) — 분할정복의 대표 예시
def merge_sort(arr):
    if len(arr) <= 1:       # 기저 조건
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # 1. 왼쪽 절반 정렬
    right = merge_sort(arr[mid:])   # 1. 오른쪽 절반 정렬
    return merge(left, right)       # 3. 합치기

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">[5, 3, 1, 4, 2]를 합병 정렬하면, 나누기 단계에서 어떻게 쪼개질까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        [5, 3, 1, 4, 2] → [5, 3] + [1, 4, 2]<br>
                        [5, 3] → [5] + [3]<br>
                        [1, 4, 2] → [1] + [4, 2] → [1] + [4] + [2]<br><br>
                        합치기: [3,5] + [1,2,4] → <strong>[1, 2, 3, 4, 5]</strong>
                    </div>
                </div>
            </div>

            <!-- ③ 분할정복 vs 재귀 vs DP -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 분할정복 vs 재귀 vs DP</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="30" r="12" fill="none" stroke="var(--blue)" stroke-width="2"/>
                                <path d="M30 48 Q40 60 50 48" fill="none" stroke="var(--blue)" stroke-width="2"/>
                                <line x1="40" y1="42" x2="40" y2="52" stroke="var(--blue)" stroke-width="2"/>
                            </svg>
                        </div>
                        <h3>재귀</h3>
                        <p><strong>자기 자신을 호출</strong>하는 기법.<br>함수가 자기 자신을 부르는 것이 재귀입니다. 분할정복과 DP 모두 재귀를 사용합니다.</p>
                    </div>
                    <div class="concept-card" style="border-color: var(--accent);">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>
                            </svg>
                        </div>
                        <h3>분할정복</h3>
                        <p><strong>나누고 + 합치기</strong>.<br>문제를 독립적인 조각으로 나누고, 각각 풀고, 결과를 합칩니다. 부분 문제가 <strong>겹치지 않습니다</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="20" width="60" height="40" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>
                                <line x1="30" y1="20" x2="30" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>
                                <line x1="50" y1="20" x2="50" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>
                            </svg>
                        </div>
                        <h3>DP (동적 프로그래밍)</h3>
                        <p><strong>저장하며 풀기</strong>.<br>부분 문제가 <strong>겹쳐서</strong> 같은 계산을 여러 번 하게 될 때, 결과를 저장해서 재사용합니다.</p>
                    </div>
                </div>

                <div class="key-difference-box" style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius);border-left:4px solid var(--accent);">
                    <strong>핵심 차이!</strong><br>
                    • <strong>분할정복</strong>: 부분 문제가 서로 <span style="color:var(--accent)">겹치지 않음</span> → 그냥 각각 풀면 됨<br>
                    • <strong>DP</strong>: 부분 문제가 서로 <span style="color:var(--green)">겹침</span> → 저장해서 재사용해야 빠름<br>
                    예) 합병 정렬: 왼쪽/오른쪽 독립 → <strong>분할정복</strong> | 피보나치: F(3)을 여러 번 계산 → <strong>DP</strong>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"1부터 N까지의 합을 구하는 문제"는 분할정복으로 풀 수 있을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        네! 가능합니다.<br>
                        sum(1, N) = sum(1, N/2) + sum(N/2+1, N) 으로 나눌 수 있습니다.<br>
                        기저 조건: sum(a, a) = a (하나만 남으면 그 자체가 답)<br><br>
                        하지만 이 문제는 <strong>N×(N+1)/2</strong> 공식이 더 빠릅니다.<br>
                        분할정복은 단순한 문제보다 <strong>복잡한 문제에서 빛을 발합니다!</strong>
                    </div>
                </div>
            </div>

            <!-- ④ 자주 쓰이는 분할정복 패턴 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 자주 쓰이는 분할정복 패턴</div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <line x1="40" y1="10" x2="40" y2="70" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>
                            </svg>
                        </div>
                        <h3>영역 나누기</h3>
                        <p>2D 영역을 <strong>4등분(쿼드트리)</strong> 또는 <strong>9등분</strong>으로 나눠서 처리합니다. 색종이, 쿼드트리 문제가 대표적입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="15" y="48" font-size="28" fill="var(--green)">a</text>
                                <text x="40" y="32" font-size="16" fill="var(--green)">n</text>
                            </svg>
                        </div>
                        <h3>빠른 거듭제곱</h3>
                        <p>a^n을 구할 때, <strong>지수를 반으로 나누면</strong> O(log n)에 계산할 수 있습니다. 매우 큰 수의 거듭제곱에 사용합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>
                                <rect x="45" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>
                                <text x="30" y="58" font-size="14" fill="var(--yellow)">×</text>
                            </svg>
                        </div>
                        <h3>행렬 거듭제곱</h3>
                        <p>행렬의 거듭제곱도 같은 원리입니다. <strong>피보나치 수</strong>를 O(log n)에 구하는 데 사용합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="50" width="12" height="20" fill="none" stroke="var(--blue)" stroke-width="2"/>
                                <rect x="24" y="30" width="12" height="40" fill="none" stroke="var(--blue)" stroke-width="2"/>
                                <rect x="38" y="40" width="12" height="30" fill="none" stroke="var(--blue)" stroke-width="2"/>
                                <rect x="52" y="20" width="12" height="50" fill="none" stroke="var(--blue)" stroke-width="2"/>
                            </svg>
                        </div>
                        <h3>구간 분할</h3>
                        <p>배열을 <strong>왼쪽/오른쪽으로 나눠서</strong> 각각의 답을 구하고, 걸치는 경우를 처리합니다. 히스토그램 문제가 대표적입니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">2^100을 직접 곱하면 몇 번 곱해야 할까요? 분할정복으로는 몇 번이면 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        직접 곱하기: 2를 <strong>99번</strong> 곱해야 합니다.<br><br>
                        분할정복: 2^100 = (2^50)² → 2^50 = (2^25)² → 2^25 = (2^12)² × 2 → ...<br>
                        총 <strong>약 7번</strong>의 곱셈이면 됩니다! (log₂(100) ≈ 7)<br><br>
                        99번 → 7번, 거의 <strong>14배나 빠릅니다!</strong>
                    </div>
                </div>
            </div>

            <!-- ⑤ 분할정복 문제 푸는 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 분할정복 문제 푸는 3단계</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <circle cx="40" cy="35" r="18" fill="none" stroke="var(--red)" stroke-width="2"/>
                                <text x="34" y="42" font-size="18" fill="var(--red)">!</text>
                            </svg>
                        </div>
                        <h3>① 기저 조건 정하기</h3>
                        <p><strong>더 이상 나눌 수 없는 가장 작은 크기</strong>를 정합니다. 예) 배열 크기 1, 지수가 0 또는 1 등</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <line x1="40" y1="20" x2="40" y2="60" stroke="var(--red)" stroke-width="2.5" stroke-dasharray="4,3"/>
                            </svg>
                        </div>
                        <h3>② 나누는 기준 정하기</h3>
                        <p>문제를 어떻게 나눌지 결정합니다. <strong>절반? 4등분? 9등분?</strong> 문제 유형에 따라 달라집니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="8" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>
                                <rect x="47" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>
                                <path d="M33 37 L47 37" stroke="var(--green)" stroke-width="3"/>
                                <text x="36" y="62" font-size="16" fill="var(--green)">+</text>
                            </svg>
                        </div>
                        <h3>③ 합치는 방법 정하기</h3>
                        <p>작은 문제의 결과를 어떻게 합칠지 정합니다. <strong>더하기? 곱하기? 최댓값?</strong> 문제마다 다릅니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"N×N 색종이가 전부 같은 색인지 확인하는 문제"에서 3단계를 적용하면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        ① <strong>기저 조건</strong>: 1×1 크기면 그 색이 곧 답<br>
                        ② <strong>나누기</strong>: 4등분 (왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래)<br>
                        ③ <strong>합치기</strong>: 4조각이 모두 같은 색이면 합치고, 아니면 각각 유지<br><br>
                        이것이 바로 <strong>색종이 만들기 / 쿼드트리</strong> 문제의 핵심입니다!
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    },

    // ===== 시각화 렌더링 =====
    renderVisualize(container) {
        this._clearVizState();

        container.innerHTML = `
            <div class="viz-tabs">
                <button class="viz-tab active" data-viz="quad">영역 분할 (쿼드트리)</button>
                <button class="viz-tab" data-viz="exp">빠른 거듭제곱</button>
            </div>
            <div id="dc-viz-content"></div>
        `;

        const vizContent = container.querySelector('#dc-viz-content');
        const tabs = container.querySelectorAll('.viz-tab');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                self._clearVizState();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.viz === 'quad') self._renderVizQuad(vizContent);
                else self._renderVizExp(vizContent);
            });
        });

        this._renderVizQuad(vizContent);
    },

    // ===== 쿼드트리 시각화 =====
    _renderVizQuad(container) {
        const SIZE = 8;
        // 기본 패턴: 부분적으로 채워진 8×8
        const defaultGrid = [
            [1,1,1,1,0,0,0,0],
            [1,1,1,1,0,0,0,0],
            [1,1,1,1,0,0,1,1],
            [1,1,1,1,0,0,1,1],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,1,1,0,0],
            [0,0,0,0,1,1,0,0]
        ];

        let grid = defaultGrid.map(r => [...r]);

        container.innerHTML = `
            <div class="viz-card">
                <h3>영역 분할 — 쿼드트리 (색종이 문제)</h3>
                <p style="color:var(--text2);margin-bottom:12px;">8×8 영역을 검사합니다. 모두 같은 색이면 하나로, 아니면 4등분해서 재귀합니다.</p>
                <p style="color:var(--text3);margin-bottom:12px;font-size:0.85rem;">셀을 클릭하면 색을 바꿀 수 있습니다. [리셋] 버튼으로 기본 패턴으로 돌아갑니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button class="btn btn-primary" id="dc-quad-apply">시각화 시작</button>
                    <button class="btn" id="dc-quad-reset">리셋</button>
                </div>
                <div class="dc-grid-wrapper">
                    <div class="dc-grid" id="dc-grid"></div>
                    <div class="dc-overlays" id="dc-overlays"></div>
                </div>
                <div class="dc-quad-result" id="dc-quad-result" style="margin-top:12px;padding:10px;background:var(--bg);border-radius:var(--radius);font-family:monospace;min-height:36px;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const gridEl = container.querySelector('#dc-grid');
        const overlaysEl = container.querySelector('#dc-overlays');
        const resultEl = container.querySelector('#dc-quad-result');
        const self = this;

        gridEl.style.display = 'grid';
        gridEl.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;

        function renderGrid() {
            gridEl.innerHTML = '';
            for (let r = 0; r < SIZE; r++) {
                for (let c = 0; c < SIZE; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'dc-cell ' + (grid[r][c] ? 'blue' : 'white');
                    cell.dataset.r = r;
                    cell.dataset.c = c;
                    cell.addEventListener('click', () => {
                        grid[r][c] = grid[r][c] ? 0 : 1;
                        cell.className = 'dc-cell ' + (grid[r][c] ? 'blue' : 'white');
                    });
                    gridEl.appendChild(cell);
                }
            }
        }

        renderGrid();

        container.querySelector('#dc-quad-reset').addEventListener('click', () => {
            grid = defaultGrid.map(r => [...r]);
            renderGrid();
            overlaysEl.innerHTML = '';
            resultEl.textContent = '';
            self._clearVizState();
            const prevBtn = container.querySelector('#viz-prev');
            const nextBtn = container.querySelector('#viz-next');
            const counter = container.querySelector('#viz-step-counter');
            const desc = container.querySelector('#viz-step-desc');
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = false;
            if (counter) counter.textContent = '시작 전';
            if (desc) desc.textContent = '▶ [시각화 시작] 버튼을 눌러주세요';
        });

        container.querySelector('#dc-quad-apply').addEventListener('click', () => {
            self._clearVizState();
            overlaysEl.innerHTML = '';
            resultEl.textContent = '';
            buildAndInit();
        });

        function buildAndInit() {
            const steps = [];
            const resultParts = {};
            let partCounter = 0;

            // 재귀적으로 스텝 생성
            function buildSteps(sr, sc, size, depth, label) {
                const partId = partCounter++;

                // 영역이 모두 같은 색인지 확인
                const firstVal = grid[sr][sc];
                let allSame = true;
                for (let r = sr; r < sr + size && allSame; r++) {
                    for (let c = sc; c < sc + size && allSame; c++) {
                        if (grid[r][c] !== firstVal) allSame = false;
                    }
                }

                if (allSame || size === 1) {
                    const color = grid[sr][sc];
                    const colorName = color ? '파란색' : '흰색';
                    steps.push({
                        description: `${label} (${size}×${size}) 검사: 전부 ${colorName}! → ${color}`,
                        action() {
                            // 하이라이트 검사 영역
                            const overlay = document.createElement('div');
                            overlay.className = 'dc-region-overlay decided';
                            overlay.id = `dc-overlay-${partId}`;
                            overlay.style.cssText = `left:${(sc/SIZE)*100}%;top:${(sr/SIZE)*100}%;width:${(size/SIZE)*100}%;height:${(size/SIZE)*100}%;background:${color ? 'rgba(9,132,227,0.25)' : 'rgba(200,200,200,0.25)'};border:2px solid ${color ? 'var(--blue)' : 'var(--text3)'}`;
                            overlaysEl.appendChild(overlay);
                            resultParts[partId] = String(color);
                            updateResult();
                        },
                        undo() {
                            const ov = container.querySelector(`#dc-overlay-${partId}`);
                            if (ov) ov.remove();
                            delete resultParts[partId];
                            updateResult();
                        }
                    });
                } else {
                    // 검사 단계
                    steps.push({
                        description: `${label} (${size}×${size}) 검사: 색이 섞여 있음 → 4등분합니다!`,
                        action() {
                            const overlay = document.createElement('div');
                            overlay.className = 'dc-region-overlay checking';
                            overlay.id = `dc-overlay-${partId}`;
                            overlay.style.cssText = `left:${(sc/SIZE)*100}%;top:${(sr/SIZE)*100}%;width:${(size/SIZE)*100}%;height:${(size/SIZE)*100}%;`;
                            overlaysEl.appendChild(overlay);

                            // 분할선 표시
                            const hLine = document.createElement('div');
                            hLine.className = 'dc-split-line horizontal';
                            hLine.id = `dc-hline-${partId}`;
                            hLine.style.cssText = `left:${(sc/SIZE)*100}%;top:${((sr+size/2)/SIZE)*100}%;width:${(size/SIZE)*100}%;`;
                            overlaysEl.appendChild(hLine);

                            const vLine = document.createElement('div');
                            vLine.className = 'dc-split-line vertical';
                            vLine.id = `dc-vline-${partId}`;
                            vLine.style.cssText = `top:${(sr/SIZE)*100}%;left:${((sc+size/2)/SIZE)*100}%;height:${(size/SIZE)*100}%;`;
                            overlaysEl.appendChild(vLine);

                            resultParts[partId] = '(';
                        },
                        undo() {
                            const ov = container.querySelector(`#dc-overlay-${partId}`);
                            if (ov) ov.remove();
                            const hl = container.querySelector(`#dc-hline-${partId}`);
                            if (hl) hl.remove();
                            const vl = container.querySelector(`#dc-vline-${partId}`);
                            if (vl) vl.remove();
                            delete resultParts[partId];
                            updateResult();
                        }
                    });

                    const half = size / 2;
                    // 왼쪽 위, 오른쪽 위, 왼쪽 아래, 오른쪽 아래
                    buildSteps(sr, sc, half, depth + 1, `${label}→좌상`);
                    buildSteps(sr, sc + half, half, depth + 1, `${label}→우상`);
                    buildSteps(sr + half, sc, half, depth + 1, `${label}→좌하`);
                    buildSteps(sr + half, sc + half, half, depth + 1, `${label}→우하`);

                    // 닫는 괄호 단계
                    const closeId = partCounter++;
                    steps.push({
                        description: `${label} (${size}×${size}) 4개 영역 합치기 완료 → 괄호 닫기`,
                        action() {
                            // 검사 오버레이 제거
                            const ov = container.querySelector(`#dc-overlay-${partId}`);
                            if (ov) ov.remove();
                            resultParts[closeId] = ')';
                            updateResult();
                        },
                        undo() {
                            // 검사 오버레이 복원
                            const overlay = document.createElement('div');
                            overlay.className = 'dc-region-overlay checking';
                            overlay.id = `dc-overlay-${partId}`;
                            overlay.style.cssText = `left:${(sc/SIZE)*100}%;top:${(sr/SIZE)*100}%;width:${(size/SIZE)*100}%;height:${(size/SIZE)*100}%;`;
                            overlaysEl.appendChild(overlay);
                            delete resultParts[closeId];
                            updateResult();
                        }
                    });
                }
            }

            function updateResult() {
                const keys = Object.keys(resultParts).map(Number).sort((a, b) => a - b);
                resultEl.innerHTML = '<strong>결과:</strong> ' + keys.map(k => resultParts[k]).join('');
            }

            buildSteps(0, 0, SIZE, 0, '전체');

            // 최종 단계
            const whiteCount = grid.flat().filter(v => v === 0).length;
            const blueCount = grid.flat().filter(v => v === 1).length;
            steps.push({
                description: `완성! 쿼드트리 압축이 완료되었습니다.`,
                action() {
                    updateResult();
                },
                undo() {}
            });

            self._initStepController(container, steps);
        }

        // 초기 안내
        const desc = container.querySelector('#viz-step-desc');
        if (desc) desc.textContent = '▶ [시각화 시작] 버튼을 눌러주세요';
        const nextBtn = container.querySelector('#viz-next');
        if (nextBtn) nextBtn.disabled = true;
    },

    // ===== 거듭제곱 시각화 =====
    _renderVizExp(container) {
        let base = 2, exp = 10, mod = 1000;

        container.innerHTML = `
            <div class="viz-card">
                <h3>빠른 거듭제곱 (Fast Exponentiation)</h3>
                <p style="color:var(--text2);margin-bottom:12px;">지수를 반으로 나누면서 계산합니다. O(n) → O(log n)으로 빨라집니다!</p>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                    <label>밑: <input type="number" id="dc-exp-base" value="2" min="1" max="100" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <label>지수: <input type="number" id="dc-exp-exp" value="10" min="1" max="64" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <label>mod: <input type="number" id="dc-exp-mod" value="1000" min="2" max="1000000" style="width:80px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <button class="btn btn-primary" id="dc-exp-apply">시작</button>
                </div>
                <div class="dc-exp-tree" id="dc-exp-tree"></div>
                <div class="dc-exp-info" id="dc-exp-info" style="margin-top:12px;padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;
        const treeEl = container.querySelector('#dc-exp-tree');
        const infoEl = container.querySelector('#dc-exp-info');

        function buildAndInit() {
            self._clearVizState();
            base = parseInt(container.querySelector('#dc-exp-base').value) || 2;
            exp = parseInt(container.querySelector('#dc-exp-exp').value) || 10;
            mod = parseInt(container.querySelector('#dc-exp-mod').value) || 1000;

            if (exp > 64) { exp = 64; container.querySelector('#dc-exp-exp').value = 64; }
            if (exp < 1) { exp = 1; container.querySelector('#dc-exp-exp').value = 1; }

            treeEl.innerHTML = '';
            infoEl.innerHTML = `<span style="color:var(--text2)">${base}<sup>${exp}</sup> mod ${mod} 을 분할정복으로 계산합니다.</span>`;

            // 노드 데이터 생성
            const nodes = [];
            function buildTree(b, e, parentId, depth) {
                const id = nodes.length;
                nodes.push({ id, base: b, exp: e, parentId, depth, value: null, children: [] });
                if (parentId >= 0) nodes[parentId].children.push(id);

                if (e === 0) {
                    nodes[id].value = 1;
                } else if (e === 1) {
                    nodes[id].value = b % mod;
                } else {
                    const halfExp = Math.floor(e / 2);
                    buildTree(b, halfExp, id, depth + 1);
                    if (e % 2 === 1) {
                        // 홀수: half * half * base
                    }
                }
                return id;
            }
            buildTree(base, exp, -1, 0);

            // 재귀 트리를 flat하게 다시 생성 (깊이 우선)
            const nodeList = [];
            function genNodes(b, e, depth) {
                const idx = nodeList.length;
                nodeList.push({ base: b, exp: e, depth, value: null, label: `${b}^${e}` });
                if (e <= 1) {
                    nodeList[idx].value = e === 0 ? 1 : b % mod;
                    return idx;
                }
                const halfExp = Math.floor(e / 2);
                const childIdx = genNodes(b, halfExp, depth + 1);
                nodeList[idx].childIdx = childIdx;
                nodeList[idx].isOdd = (e % 2 === 1);
                return idx;
            }
            genNodes(base, exp, 0);

            // 시각화 요소 생성
            treeEl.innerHTML = '';
            nodeList.forEach((node, i) => {
                const div = document.createElement('div');
                div.className = 'dc-exp-node';
                div.id = `dc-node-${i}`;
                div.style.marginLeft = (node.depth * 40) + 'px';
                div.innerHTML = `<span class="dc-exp-label">${base}<sup>${node.exp}</sup></span><span class="dc-exp-value" id="dc-val-${i}"></span>`;
                treeEl.appendChild(div);
            });

            // 스텝 생성
            const steps = [];

            // 분할 단계 (위→아래)
            for (let i = 0; i < nodeList.length; i++) {
                const node = nodeList[i];
                if (node.exp <= 1) {
                    const val = node.exp === 0 ? 1 : base % mod;
                    steps.push({
                        description: node.exp === 0
                            ? `${base}^0 = 1 (기저 조건: 어떤 수의 0제곱은 1)`
                            : `${base}^1 = ${base % mod} (기저 조건: 1제곱은 자기 자신)`,
                        action() {
                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.add('active');
                            container.querySelector(`#dc-val-${i}`).textContent = `= ${val}`;
                            node.value = val;
                            setTimeout(() => el.classList.replace('active', 'computed'), 300);
                        },
                        undo() {
                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.remove('active', 'computed');
                            container.querySelector(`#dc-val-${i}`).textContent = '';
                            node.value = null;
                        }
                    });
                } else {
                    const halfExp = Math.floor(node.exp / 2);
                    const isOdd = node.exp % 2 === 1;

                    steps.push({
                        description: isOdd
                            ? `${base}^${node.exp} = ${base}^${halfExp} × ${base}^${halfExp} × ${base} (홀수: 반 × 반 × 밑)`
                            : `${base}^${node.exp} = ${base}^${halfExp} × ${base}^${halfExp} (짝수: 반 × 반)`,
                        action() {
                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.add('active');
                        },
                        undo() {
                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.remove('active');
                        }
                    });
                }
            }

            // 합치기 단계 (아래→위)
            for (let i = nodeList.length - 1; i >= 0; i--) {
                const node = nodeList[i];
                if (node.exp > 1) {
                    const halfExp = Math.floor(node.exp / 2);
                    const isOdd = node.exp % 2 === 1;

                    steps.push({
                        description: (() => {
                            const childNode = nodeList[node.childIdx];
                            const halfVal = childNode.value !== null ? childNode.value : '?';
                            let val;
                            if (typeof halfVal === 'number') {
                                val = (halfVal * halfVal) % mod;
                                if (isOdd) val = (val * (base % mod)) % mod;
                            }
                            return isOdd
                                ? `합치기: ${base}^${node.exp} = ${halfVal} × ${halfVal} × ${base} mod ${mod} = ${val !== undefined ? val : '?'}`
                                : `합치기: ${base}^${node.exp} = ${halfVal} × ${halfVal} mod ${mod} = ${val !== undefined ? val : '?'}`;
                        })(),
                        action() {
                            const childNode = nodeList[node.childIdx];
                            const halfVal = childNode.value;
                            let val = (halfVal * halfVal) % mod;
                            if (isOdd) val = (val * (base % mod)) % mod;
                            node.value = val;

                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.remove('active');
                            el.classList.add('computed');
                            container.querySelector(`#dc-val-${i}`).textContent = `= ${val}`;
                        },
                        undo() {
                            node.value = null;
                            const el = container.querySelector(`#dc-node-${i}`);
                            el.classList.remove('computed');
                            el.classList.add('active');
                            container.querySelector(`#dc-val-${i}`).textContent = '';
                        }
                    });
                }
            }

            // 최종 결과
            steps.push({
                description: `완성! ${base}^${exp} mod ${mod} 의 계산이 완료되었습니다.`,
                action() {
                    const rootVal = nodeList[0].value;
                    infoEl.innerHTML = `<strong style="font-size:1.1rem;color:var(--green);">✅ ${base}<sup>${exp}</sup> mod ${mod} = ${rootVal}</strong><br><span style="color:var(--text2);font-size:0.9rem;">총 ${nodeList.length}번의 연산으로 계산 완료! (직접 곱하면 ${exp - 1}번 필요)</span>`;
                },
                undo() {
                    infoEl.innerHTML = `<span style="color:var(--text2)">${base}<sup>${exp}</sup> mod ${mod} 을 분할정복으로 계산합니다.</span>`;
                }
            });

            self._initStepController(container, steps);
        }

        container.querySelector('#dc-exp-apply').addEventListener('click', buildAndInit);
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
        { num: 1, title: '영역 나누기', desc: '2D 영역을 재귀로 분할 (Silver)', problemIds: ['boj-2630', 'boj-1992', 'boj-1780'] },
        { num: 2, title: '거듭제곱', desc: '분할정복 거듭제곱 (Silver~Gold)', problemIds: ['boj-1629', 'boj-11401'] },
        { num: 3, title: '행렬 거듭제곱', desc: '행렬 곱셈 + 거듭제곱 (Silver~Gold)', problemIds: ['boj-2740', 'boj-10830', 'boj-11444'] },
        { num: 4, title: '심화', desc: '구간 분할정복 (Platinum)', problemIds: ['boj-6549'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 영역 나누기 ==========
        {
            id: 'boj-2630',
            title: 'BOJ 2630 - 색종이 만들기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2630',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 크기의 종이가 있습니다. 각 칸은 흰색(0) 또는 파란색(1)입니다. 전체가 같은 색이면 그대로 사용하고, 아니면 4등분하여 같은 과정을 반복합니다. 최종적으로 흰색 종이와 파란색 종이의 개수를 각각 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (2의 거듭제곱, 2 ≤ N ≤ 128)<br>둘째 줄부터 N×N 배열 (0 또는 1)</p></div>
                    <div><h4>출력</h4><p>첫째 줄에 흰색 종이 수, 둘째 줄에 파란색 종이 수</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>8
1 1 0 0 0 0 1 1
1 1 0 0 0 0 1 1
0 0 1 1 1 1 0 0
0 0 1 1 1 1 0 0
1 0 0 0 1 1 1 1
0 1 0 0 1 1 1 1
0 0 1 1 1 1 1 1
0 0 1 1 1 1 1 1</pre></div>
                        <div><strong>출력</strong><pre>9
7</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '영역을 확인해서 모두 같은 색이면 카운트하고, 아니면 <strong>4등분</strong>해서 재귀 호출합니다.' },
                { title: '핵심 코드', content: '<code>solve(r, c, size)</code> 함수를 만들고, 모두 같으면 카운트, 아니면 <code>solve(r, c, size/2)</code> 4번 호출합니다.' },
                { title: '기저 조건', content: '영역이 1×1이면 무조건 해당 색을 카운트합니다. 또는 영역 내 모든 칸이 같은 색이면 카운트합니다.' }
            ],
            inputDefault: 8,
            solve() { return '9\n7'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
paper = [list(map(int, input().split())) for _ in range(N)]

white = blue = 0

def solve(r, c, size):
    global white, blue
    # 영역 내 모든 칸 확인
    first = paper[r][c]
    all_same = True
    for i in range(r, r + size):
        for j in range(c, c + size):
            if paper[i][j] != first:
                all_same = False
                break
        if not all_same:
            break

    if all_same:
        if first == 0:
            white += 1
        else:
            blue += 1
    else:
        half = size // 2
        solve(r, c, half)            # 왼쪽 위
        solve(r, c + half, half)     # 오른쪽 위
        solve(r + half, c, half)     # 왼쪽 아래
        solve(r + half, c + half, half)  # 오른쪽 아래

solve(0, 0, N)
print(white)
print(blue)`,
                cpp: `#include <iostream>
using namespace std;

int paper[128][128];
int N, white_cnt = 0, blue_cnt = 0;

void solve(int r, int c, int size) {
    int first = paper[r][c];
    bool allSame = true;
    for (int i = r; i < r + size && allSame; i++)
        for (int j = c; j < c + size && allSame; j++)
            if (paper[i][j] != first) allSame = false;

    if (allSame) {
        if (first == 0) white_cnt++;
        else blue_cnt++;
    } else {
        int half = size / 2;
        solve(r, c, half);
        solve(r, c + half, half);
        solve(r + half, c, half);
        solve(r + half, c + half, half);
    }
}

int main() {
    cin >> N;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            cin >> paper[i][j];
    solve(0, 0, N);
    cout << white_cnt << "\\n" << blue_cnt << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static int[][] paper;
    static int white = 0, blue = 0;

    static void solve(int r, int c, int size) {
        int first = paper[r][c];
        boolean allSame = true;
        for (int i = r; i < r + size && allSame; i++)
            for (int j = c; j < c + size && allSame; j++)
                if (paper[i][j] != first) allSame = false;

        if (allSame) {
            if (first == 0) white++;
            else blue++;
        } else {
            int half = size / 2;
            solve(r, c, half);
            solve(r, c + half, half);
            solve(r + half, c, half);
            solve(r + half, c + half, half);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        paper = new int[N][N];
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                paper[i][j] = sc.nextInt();
        solve(0, 0, N);
        System.out.println(white);
        System.out.println(blue);
    }
}`
            }
        },
        {
            id: 'boj-1992',
            title: 'BOJ 1992 - 쿼드트리',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1992',
            descriptionHTML: `
                <h3>문제</h3>
                <p>흑백 영상을 쿼드트리로 압축합니다. N×N 크기의 영상에서 모든 픽셀이 같으면 그 값을 출력하고, 다르면 4개 영역으로 나눈 결과를 괄호로 묶어 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (2의 거듭제곱, 1 ≤ N ≤ 64)<br>둘째 줄부터 N줄의 문자열 (0과 1로 구성)</p></div>
                    <div><h4>출력</h4><p>압축한 결과를 한 줄로 출력</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>8
11110000
11110000
00011100
00011100
11110000
11110000
11110011
11110011</pre></div>
                        <div><strong>출력</strong><pre>(110(0010)0(0110))</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '색종이 문제와 동일한 구조입니다. 대신 카운트 대신 <strong>문자열을 반환</strong>합니다.' },
                { title: '핵심 코드', content: '모두 같으면 그 값을 반환, 아니면 <code>"(" + 좌상 + 우상 + 좌하 + 우하 + ")"</code>를 반환합니다.' }
            ],
            inputDefault: 8,
            solve() { return '(110(0010)0(0110))'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
img = [input().strip() for _ in range(N)]

def solve(r, c, size):
    first = img[r][c]
    all_same = True
    for i in range(r, r + size):
        for j in range(c, c + size):
            if img[i][j] != first:
                all_same = False
                break
        if not all_same:
            break

    if all_same:
        return first

    half = size // 2
    return '(' + solve(r, c, half) + solve(r, c + half, half) + solve(r + half, c, half) + solve(r + half, c + half, half) + ')'

print(solve(0, 0, N))`,
                cpp: `#include <iostream>
#include <string>
using namespace std;

int N;
string img[64];

string solve(int r, int c, int size) {
    char first = img[r][c];
    bool allSame = true;
    for (int i = r; i < r + size && allSame; i++)
        for (int j = c; j < c + size && allSame; j++)
            if (img[i][j] != first) allSame = false;

    if (allSame) return string(1, first);

    int half = size / 2;
    return "(" + solve(r, c, half) + solve(r, c + half, half)
         + solve(r + half, c, half) + solve(r + half, c + half, half) + ")";
}

int main() {
    cin >> N;
    for (int i = 0; i < N; i++) cin >> img[i];
    cout << solve(0, 0, N) << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static String[] img;

    static String solve(int r, int c, int size) {
        char first = img[r].charAt(c);
        boolean allSame = true;
        for (int i = r; i < r + size && allSame; i++)
            for (int j = c; j < c + size && allSame; j++)
                if (img[i].charAt(j) != first) allSame = false;

        if (allSame) return String.valueOf(first);

        int half = size / 2;
        return "(" + solve(r, c, half) + solve(r, c + half, half)
             + solve(r + half, c, half) + solve(r + half, c + half, half) + ")";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt();
        img = new String[N];
        for (int i = 0; i < N; i++) img[i] = sc.next();
        System.out.println(solve(0, 0, N));
    }
}`
            }
        },
        {
            id: 'boj-1780',
            title: 'BOJ 1780 - 종이의 개수',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1780',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 크기의 종이가 있습니다. 각 칸에는 -1, 0, 1 중 하나가 저장되어 있습니다. 전체가 같은 수이면 그대로 사용하고, 아니면 <strong>9등분</strong>하여 같은 과정을 반복합니다. 최종적으로 -1, 0, 1로만 이루어진 종이의 개수를 각각 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (3의 거듭제곱, 1 ≤ N ≤ 2187)<br>둘째 줄부터 N×N 배열</p></div>
                    <div><h4>출력</h4><p>-1로만 채워진 종이 수, 0으로만 채워진 종이 수, 1로만 채워진 종이 수</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>9
0 0 0 1 1 1 -1 -1 -1
0 0 0 1 1 1 -1 -1 -1
0 0 0 1 1 1 -1 -1 -1
1 1 1 0 0 0 0 0 0
1 1 1 0 0 0 0 0 0
1 1 1 0 0 0 0 0 0
0 1 -1 0 1 -1 0 1 -1
0 -1 1 0 1 -1 0 1 -1
0 1 -1 1 0 -1 0 1 -1</pre></div>
                        <div><strong>출력</strong><pre>10
12
11</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '색종이 문제와 같은 구조입니다. 차이점은 <strong>4등분이 아니라 9등분</strong>(3×3)이라는 것입니다.' },
                { title: '핵심 코드', content: '<code>solve(r, c, size)</code>에서 모두 같으면 카운트, 아니면 <code>third = size // 3</code>으로 9등분합니다.' },
                { title: '주의사항', content: 'N이 최대 2187(= 3^7)이므로 재귀 깊이가 최대 7입니다. 시간은 충분합니다.' }
            ],
            inputDefault: 9,
            solve() { return '10\n12\n11'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
paper = [list(map(int, input().split())) for _ in range(N)]

cnt = {-1: 0, 0: 0, 1: 0}

def solve(r, c, size):
    first = paper[r][c]
    all_same = True
    for i in range(r, r + size):
        for j in range(c, c + size):
            if paper[i][j] != first:
                all_same = False
                break
        if not all_same:
            break

    if all_same:
        cnt[first] += 1
    else:
        third = size // 3
        for dr in range(3):
            for dc in range(3):
                solve(r + dr * third, c + dc * third, third)

solve(0, 0, N)
print(cnt[-1])
print(cnt[0])
print(cnt[1])`,
                cpp: `#include <iostream>
using namespace std;

int paper[2187][2187];
int N, cnt[3]; // cnt[0]=-1, cnt[1]=0, cnt[2]=1

void solve(int r, int c, int size) {
    int first = paper[r][c];
    bool allSame = true;
    for (int i = r; i < r + size && allSame; i++)
        for (int j = c; j < c + size && allSame; j++)
            if (paper[i][j] != first) allSame = false;

    if (allSame) {
        cnt[first + 1]++;
    } else {
        int t = size / 3;
        for (int dr = 0; dr < 3; dr++)
            for (int dc = 0; dc < 3; dc++)
                solve(r + dr * t, c + dc * t, t);
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> N;
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            cin >> paper[i][j];
    solve(0, 0, N);
    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[][] paper;
    static int[] cnt = new int[3]; // 0:-1, 1:0, 2:1

    static void solve(int r, int c, int size) {
        int first = paper[r][c];
        boolean allSame = true;
        for (int i = r; i < r + size && allSame; i++)
            for (int j = c; j < c + size && allSame; j++)
                if (paper[i][j] != first) allSame = false;

        if (allSame) {
            cnt[first + 1]++;
        } else {
            int t = size / 3;
            for (int dr = 0; dr < 3; dr++)
                for (int dc = 0; dc < 3; dc++)
                    solve(r + dr * t, c + dc * t, t);
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        paper = new int[N][N];
        for (int i = 0; i < N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            for (int j = 0; j < N; j++)
                paper[i][j] = Integer.parseInt(st.nextToken());
        }
        solve(0, 0, N);
        System.out.println(cnt[0]);
        System.out.println(cnt[1]);
        System.out.println(cnt[2]);
    }
}`
            }
        },

        // ========== 2단계: 거듭제곱 ==========
        {
            id: 'boj-1629',
            title: 'BOJ 1629 - 곱셈',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1629',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 A, B, C가 주어졌을 때, A를 B번 곱한 수를 C로 나눈 나머지를 구하시오. (즉, A^B mod C)</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 A, B, C가 주어진다. (2 ≤ A, B, C ≤ 2,147,483,647)</p></div>
                    <div><h4>출력</h4><p>A를 B번 곱한 수를 C로 나눈 나머지</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10 11 12</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'B가 최대 21억이므로 단순 반복은 불가능합니다. <strong>분할정복 거듭제곱</strong>으로 O(log B)에 풀어야 합니다.' },
                { title: '핵심 공식', content: 'B가 짝수: A^B = (A^(B/2))² mod C<br>B가 홀수: A^B = (A^(B/2))² × A mod C<br>B가 1: A^1 = A mod C' },
                { title: '오버플로우 주의', content: 'A^(B/2) × A^(B/2) 계산 시 <strong>중간 결과가 매우 커질 수 있습니다</strong>. Python은 자동이지만, C++/Java는 long long이 필요합니다.' }
            ],
            inputDefault: 10,
            solve() { return '4'; },
            templates: {
                python: `A, B, C = map(int, input().split())

def power(a, b, c):
    if b == 1:
        return a % c
    half = power(a, b // 2, c)
    result = half * half % c
    if b % 2 == 1:
        result = result * a % c
    return result

print(power(A, B, C))`,
                cpp: `#include <iostream>
using namespace std;
typedef long long ll;

ll power(ll a, ll b, ll c) {
    if (b == 1) return a % c;
    ll half = power(a, b / 2, c);
    ll result = half * half % c;
    if (b % 2 == 1) result = result * a % c;
    return result;
}

int main() {
    ll A, B, C;
    cin >> A >> B >> C;
    cout << power(A, B, C) << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static long power(long a, long b, long c) {
        if (b == 1) return a % c;
        long half = power(a, b / 2, c);
        long result = half * half % c;
        if (b % 2 == 1) result = result * a % c;
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long A = sc.nextLong(), B = sc.nextLong(), C = sc.nextLong();
        System.out.println(power(A, B, C));
    }
}`
            }
        },
        {
            id: 'boj-11401',
            title: 'BOJ 11401 - 이항 계수 3',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11401',
            descriptionHTML: `
                <h3>문제</h3>
                <p>자연수 N과 정수 K가 주어졌을 때, 이항 계수 C(N, K)를 1,000,000,007로 나눈 나머지를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N과 K가 주어진다. (1 ≤ N ≤ 4,000,000, 0 ≤ K ≤ N)</p></div>
                    <div><h4>출력</h4><p>C(N, K) mod 1,000,000,007</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5 2</pre></div>
                        <div><strong>출력</strong><pre>10</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'C(N,K) = N! / (K! × (N-K)!)<br>나눗셈을 모듈러로 하려면 <strong>페르마 소정리</strong>를 사용합니다: a^(-1) ≡ a^(p-2) mod p' },
                { title: '핵심 공식', content: 'C(N,K) mod p = N! × (K!)^(p-2) × ((N-K)!)^(p-2) mod p<br>팩토리얼을 미리 계산하고, 분할정복 거듭제곱으로 역원을 구합니다.' },
                { title: '구현 단계', content: '1. 팩토리얼 배열 계산 (N!까지)<br>2. 분할정복 거듭제곱으로 (K!)^(p-2)과 ((N-K)!)^(p-2) 계산<br>3. 세 값을 곱하기' }
            ],
            inputDefault: 5,
            solve() { return '10'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

MOD = 1_000_000_007
N, K = map(int, input().split())

# 팩토리얼 계산
fac = [1] * (N + 1)
for i in range(1, N + 1):
    fac[i] = fac[i - 1] * i % MOD

# 분할정복 거듭제곱
def power(a, b, mod):
    if b == 0:
        return 1
    if b == 1:
        return a % mod
    half = power(a, b // 2, mod)
    result = half * half % mod
    if b % 2 == 1:
        result = result * a % mod
    return result

# 페르마 소정리: a^(-1) = a^(p-2) mod p
ans = fac[N]
ans = ans * power(fac[K], MOD - 2, MOD) % MOD
ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD

print(ans)`,
                cpp: `#include <iostream>
using namespace std;
typedef long long ll;

const ll MOD = 1000000007;
ll fac[4000001];

ll power(ll a, ll b, ll mod) {
    if (b == 0) return 1;
    if (b == 1) return a % mod;
    ll half = power(a, b / 2, mod);
    ll result = half * half % mod;
    if (b % 2 == 1) result = result * a % mod;
    return result;
}

int main() {
    int N, K;
    cin >> N >> K;

    fac[0] = 1;
    for (int i = 1; i <= N; i++)
        fac[i] = fac[i - 1] * i % MOD;

    ll ans = fac[N];
    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;
    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;

    cout << ans << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static final long MOD = 1_000_000_007;

    static long power(long a, long b, long mod) {
        if (b == 0) return 1;
        if (b == 1) return a % mod;
        long half = power(a, b / 2, mod);
        long result = half * half % mod;
        if (b % 2 == 1) result = result * a % mod;
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), K = sc.nextInt();

        long[] fac = new long[N + 1];
        fac[0] = 1;
        for (int i = 1; i <= N; i++)
            fac[i] = fac[i - 1] * i % MOD;

        long ans = fac[N];
        ans = ans * power(fac[K], MOD - 2, MOD) % MOD;
        ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;

        System.out.println(ans);
    }
}`
            }
        },

        // ========== 3단계: 행렬 거듭제곱 ==========
        {
            id: 'boj-2740',
            title: 'BOJ 2740 - 행렬 곱셈',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2740',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M 크기의 행렬 A와 M×K 크기의 행렬 B가 주어졌을 때, 두 행렬을 곱한 결과를 출력하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N, M (1 ≤ N, M ≤ 100)<br>다음 N줄에 행렬 A<br>그 다음 줄에 M, K<br>다음 M줄에 행렬 B</p></div>
                    <div><h4>출력</h4><p>N×K 크기의 결과 행렬</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3 2
1 2
3 4
5 6
2 3
-1 -2 0
0 0 3</pre></div>
                        <div><strong>출력</strong><pre>-1 -2 6
-3 -6 12
-5 -10 18</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '기본 행렬 곱셈입니다. 이 문제는 분할정복이 아니라 <strong>행렬 거듭제곱의 기초</strong>로 풀어봅니다.' },
                { title: '핵심 공식', content: 'C[i][j] = A[i][0]×B[0][j] + A[i][1]×B[1][j] + ... + A[i][M-1]×B[M-1][j]<br>3중 반복문으로 구현합니다.' }
            ],
            inputDefault: 3,
            solve() { return '-1 -2 6\n-3 -6 12\n-5 -10 18'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(N)]
M2, K = map(int, input().split())
B = [list(map(int, input().split())) for _ in range(M)]

# 행렬 곱셈: A(N×M) × B(M×K) = C(N×K)
C = [[0] * K for _ in range(N)]
for i in range(N):
    for j in range(K):
        for k in range(M):
            C[i][j] += A[i][k] * B[k][j]

for row in C:
    print(' '.join(map(str, row)))`,
                cpp: `#include <iostream>
using namespace std;

int main() {
    int N, M, M2, K;
    cin >> N >> M;
    int A[100][100], B[100][100], C[100][100] = {};
    for (int i = 0; i < N; i++)
        for (int j = 0; j < M; j++)
            cin >> A[i][j];
    cin >> M2 >> K;
    for (int i = 0; i < M; i++)
        for (int j = 0; j < K; j++)
            cin >> B[i][j];

    for (int i = 0; i < N; i++)
        for (int j = 0; j < K; j++)
            for (int k = 0; k < M; k++)
                C[i][j] += A[i][k] * B[k][j];

    for (int i = 0; i < N; i++) {
        for (int j = 0; j < K; j++)
            cout << C[i][j] << (j < K - 1 ? " " : "");
        cout << "\\n";
    }
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), M = sc.nextInt();
        int[][] A = new int[N][M];
        for (int i = 0; i < N; i++)
            for (int j = 0; j < M; j++)
                A[i][j] = sc.nextInt();

        int M2 = sc.nextInt(), K = sc.nextInt();
        int[][] B = new int[M][K];
        for (int i = 0; i < M; i++)
            for (int j = 0; j < K; j++)
                B[i][j] = sc.nextInt();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < K; j++) {
                int sum = 0;
                for (int k = 0; k < M; k++)
                    sum += A[i][k] * B[k][j];
                if (j > 0) sb.append(' ');
                sb.append(sum);
            }
            sb.append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-10830',
            title: 'BOJ 10830 - 행렬 제곱',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10830',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 크기의 행렬 A가 주어졌을 때, A의 B제곱을 구하시오. 각 원소를 1,000으로 나눈 나머지를 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N, B (2 ≤ N ≤ 5, 1 ≤ B ≤ 100,000,000,000)</p></div>
                    <div><h4>출력</h4><p>N×N 결과 행렬 (각 원소 mod 1000)</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>2 5
1 2
3 4</pre></div>
                        <div><strong>출력</strong><pre>69 558
837 406</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'B가 최대 1000억이므로 <strong>분할정복 거듭제곱</strong>을 행렬에 적용해야 합니다. 숫자 대신 행렬을 곱하면 됩니다.' },
                { title: '핵심 코드', content: '행렬 곱셈 함수를 만들고, 거듭제곱 함수에서 숫자 곱셈 대신 <strong>행렬 곱셈</strong>을 호출합니다.' },
                { title: '기저 조건', content: 'B=1이면 행렬 A 자체를 반환합니다. <strong>단위 행렬</strong>(대각선이 1)은 B=0일 때 사용합니다.' }
            ],
            inputDefault: 2,
            solve() { return '69 558\n837 406'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, B = map(int, input().split())
A = [list(map(int, input().split())) for _ in range(N)]
MOD = 1000

def mat_mul(X, Y):
    n = len(X)
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] = (C[i][j] + X[i][k] * Y[k][j]) % MOD
    return C

def mat_pow(M, b):
    if b == 1:
        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]
    half = mat_pow(M, b // 2)
    result = mat_mul(half, half)
    if b % 2 == 1:
        result = mat_mul(result, M)
    return result

result = mat_pow(A, B)
for row in result:
    print(' '.join(map(str, row)))`,
                cpp: `#include <iostream>
#include <vector>
using namespace std;
typedef long long ll;
typedef vector<vector<ll>> Matrix;

int N;
ll B;
const int MOD = 1000;

Matrix mat_mul(const Matrix& X, const Matrix& Y) {
    Matrix C(N, vector<ll>(N, 0));
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            for (int k = 0; k < N; k++)
                C[i][j] = (C[i][j] + X[i][k] * Y[k][j]) % MOD;
    return C;
}

Matrix mat_pow(Matrix M, ll b) {
    if (b == 1) {
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                M[i][j] %= MOD;
        return M;
    }
    Matrix half = mat_pow(M, b / 2);
    Matrix result = mat_mul(half, half);
    if (b % 2 == 1) result = mat_mul(result, M);
    return result;
}

int main() {
    cin >> N >> B;
    Matrix A(N, vector<ll>(N));
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            cin >> A[i][j];

    Matrix result = mat_pow(A, B);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++)
            cout << result[i][j] << (j < N - 1 ? " " : "");
        cout << "\\n";
    }
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static int N;
    static final int MOD = 1000;

    static long[][] matMul(long[][] X, long[][] Y) {
        long[][] C = new long[N][N];
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                for (int k = 0; k < N; k++)
                    C[i][j] = (C[i][j] + X[i][k] * Y[k][j]) % MOD;
        return C;
    }

    static long[][] matPow(long[][] M, long b) {
        if (b == 1) {
            long[][] R = new long[N][N];
            for (int i = 0; i < N; i++)
                for (int j = 0; j < N; j++)
                    R[i][j] = M[i][j] % MOD;
            return R;
        }
        long[][] half = matPow(M, b / 2);
        long[][] result = matMul(half, half);
        if (b % 2 == 1) result = matMul(result, M);
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        N = sc.nextInt();
        long B = sc.nextLong();
        long[][] A = new long[N][N];
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                A[i][j] = sc.nextLong();

        long[][] result = matPow(A, B);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (j > 0) sb.append(' ');
                sb.append(result[i][j]);
            }
            sb.append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-11444',
            title: 'BOJ 11444 - 피보나치 수 6',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11444',
            descriptionHTML: `
                <h3>문제</h3>
                <p>피보나치 수열의 n번째 수를 1,000,000,007로 나눈 나머지를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 n이 주어진다. (1 ≤ n ≤ 1,000,000,000,000,000,000)</p></div>
                    <div><h4>출력</h4><p>n번째 피보나치 수를 1,000,000,007로 나눈 나머지</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>1000</pre></div>
                        <div><strong>출력</strong><pre>517691607</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'n이 최대 10^18이므로 단순 반복은 불가능합니다.<br>핵심 아이디어: <strong>[[1,1],[1,0]]^n의 [0][0]</strong>이 F(n+1)입니다.' },
                { title: '행렬 거듭제곱 원리', content: '[[F(n+1), F(n)], [F(n), F(n-1)]] = [[1,1],[1,0]]^n<br>따라서 행렬 거듭제곱 하나로 피보나치 수를 O(log n)에 구할 수 있습니다.' },
                { title: '구현', content: '10830번(행렬 제곱) 코드를 재사용합니다. 2×2 행렬의 거듭제곱만 구현하면 됩니다.' }
            ],
            inputDefault: 1000,
            solve() { return '517691607'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

MOD = 1_000_000_007
n = int(input())

def mat_mul(X, Y):
    return [
        [(X[0][0]*Y[0][0] + X[0][1]*Y[1][0]) % MOD,
         (X[0][0]*Y[0][1] + X[0][1]*Y[1][1]) % MOD],
        [(X[1][0]*Y[0][0] + X[1][1]*Y[1][0]) % MOD,
         (X[1][0]*Y[0][1] + X[1][1]*Y[1][1]) % MOD]
    ]

def mat_pow(M, b):
    if b == 1:
        return [[M[i][j] % MOD for j in range(2)] for i in range(2)]
    half = mat_pow(M, b // 2)
    result = mat_mul(half, half)
    if b % 2 == 1:
        result = mat_mul(result, M)
    return result

if n <= 1:
    print(n)
else:
    base = [[1, 1], [1, 0]]
    result = mat_pow(base, n)
    print(result[0][1])  # F(n)`,
                cpp: `#include <iostream>
using namespace std;
typedef long long ll;
typedef ll Matrix[2][2];

const ll MOD = 1000000007;
ll n;

void mat_mul(Matrix A, Matrix B, Matrix C) {
    ll temp[2][2] = {};
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            for (int k = 0; k < 2; k++)
                temp[i][j] = (temp[i][j] + A[i][k] * B[k][j]) % MOD;
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++)
            C[i][j] = temp[i][j];
}

void mat_pow(Matrix M, ll b, Matrix result) {
    if (b == 1) {
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++)
                result[i][j] = M[i][j] % MOD;
        return;
    }
    Matrix half;
    mat_pow(M, b / 2, half);
    mat_mul(half, half, result);
    if (b % 2 == 1) {
        Matrix temp;
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++)
                temp[i][j] = result[i][j];
        mat_mul(temp, M, result);
    }
}

int main() {
    cin >> n;
    if (n <= 1) { cout << n; return 0; }
    Matrix base = {{1, 1}, {1, 0}};
    Matrix result;
    mat_pow(base, n, result);
    cout << result[0][1] << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    static final long MOD = 1_000_000_007;

    static long[][] matMul(long[][] A, long[][] B) {
        long[][] C = new long[2][2];
        for (int i = 0; i < 2; i++)
            for (int j = 0; j < 2; j++)
                for (int k = 0; k < 2; k++)
                    C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
        return C;
    }

    static long[][] matPow(long[][] M, long b) {
        if (b == 1) {
            long[][] R = new long[2][2];
            for (int i = 0; i < 2; i++)
                for (int j = 0; j < 2; j++)
                    R[i][j] = M[i][j] % MOD;
            return R;
        }
        long[][] half = matPow(M, b / 2);
        long[][] result = matMul(half, half);
        if (b % 2 == 1) result = matMul(result, M);
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long n = sc.nextLong();
        if (n <= 1) { System.out.println(n); return; }
        long[][] base = {{1, 1}, {1, 0}};
        long[][] result = matPow(base, n);
        System.out.println(result[0][1]);
    }
}`
            }
        },

        // ========== 4단계: 심화 ==========
        {
            id: 'boj-6549',
            title: 'BOJ 6549 - 히스토그램에서 가장 큰 직사각형',
            difficulty: 'platinum',
            link: 'https://www.acmicpc.net/problem/6549',
            descriptionHTML: `
                <h3>문제</h3>
                <p>히스토그램에서 가장 큰 직사각형의 넓이를 구하시오. 히스토그램은 너비가 1인 막대들로 이루어져 있으며, 각 막대의 높이가 주어집니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>각 테스트 케이스는 한 줄로, 첫 번째 수 n (1 ≤ n ≤ 100,000)과 n개의 높이 (0 ≤ hi ≤ 1,000,000,000)가 주어집니다. 0이 입력되면 종료합니다.</p></div>
                    <div><h4>출력</h4><p>각 테스트 케이스에 대해 가장 큰 직사각형의 넓이</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>7 2 1 4 5 1 3 3
4 1000 1000 1000 1000
0</pre></div>
                        <div><strong>출력</strong><pre>8
4000</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '분할정복 접근법', content: '배열을 반으로 나누면, 최대 직사각형은 세 경우 중 하나입니다:<br>① 왼쪽 절반에만 있는 경우<br>② 오른쪽 절반에만 있는 경우<br>③ 가운데를 걸치는 경우' },
                { title: '가운데 걸치는 경우', content: '중앙에서 시작하여 <strong>양쪽으로 확장</strong>합니다. 높이가 더 높은 쪽으로 확장하면서 최대 넓이를 갱신합니다. 이 부분이 O(n)입니다.' },
                { title: '시간 복잡도', content: '분할정복: T(n) = 2T(n/2) + O(n) → <strong>O(n log n)</strong><br>스택 풀이도 가능하며 O(n)이지만, 분할정복으로 먼저 이해하는 것이 좋습니다.' }
            ],
            inputDefault: 7,
            solve() { return '8'; },
            templates: {
                python: `import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

def solve(heights, lo, hi):
    if lo == hi:
        return heights[lo]
    mid = (lo + hi) // 2

    # 왼쪽, 오른쪽 최대
    left_max = solve(heights, lo, mid)
    right_max = solve(heights, mid + 1, hi)

    # 가운데 걸치는 최대
    l, r = mid, mid + 1
    h = min(heights[l], heights[r])
    cross_max = h * 2

    while l > lo or r < hi:
        if l > lo and (r >= hi or heights[l - 1] >= heights[r + 1]):
            l -= 1
            h = min(h, heights[l])
        else:
            r += 1
            h = min(h, heights[r])
        cross_max = max(cross_max, h * (r - l + 1))

    return max(left_max, right_max, cross_max)

while True:
    line = list(map(int, input().split()))
    if line[0] == 0:
        break
    n = line[0]
    heights = line[1:]
    print(solve(heights, 0, n - 1))`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;
typedef long long ll;

int n;
ll h[100001];

ll solve(int lo, int hi) {
    if (lo == hi) return h[lo];
    int mid = (lo + hi) / 2;

    ll leftMax = solve(lo, mid);
    ll rightMax = solve(mid + 1, hi);

    int l = mid, r = mid + 1;
    ll minH = min(h[l], h[r]);
    ll crossMax = minH * 2;

    while (l > lo || r < hi) {
        if (l > lo && (r >= hi || h[l - 1] >= h[r + 1])) {
            l--;
            minH = min(minH, h[l]);
        } else {
            r++;
            minH = min(minH, h[r]);
        }
        crossMax = max(crossMax, minH * (r - l + 1));
    }

    return max({leftMax, rightMax, crossMax});
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    while (cin >> n && n) {
        for (int i = 0; i < n; i++) cin >> h[i];
        cout << solve(0, n - 1) << "\\n";
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static long[] h;

    static long solve(int lo, int hi) {
        if (lo == hi) return h[lo];
        int mid = (lo + hi) / 2;

        long leftMax = solve(lo, mid);
        long rightMax = solve(mid + 1, hi);

        int l = mid, r = mid + 1;
        long minH = Math.min(h[l], h[r]);
        long crossMax = minH * 2;

        while (l > lo || r < hi) {
            if (l > lo && (r >= hi || h[l - 1] >= h[r + 1])) {
                l--;
                minH = Math.min(minH, h[l]);
            } else {
                r++;
                minH = Math.min(minH, h[r]);
            }
            crossMax = Math.max(crossMax, minH * (r - l + 1));
        }

        return Math.max(Math.max(leftMax, rightMax), crossMax);
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            StringTokenizer st = new StringTokenizer(line);
            int n = Integer.parseInt(st.nextToken());
            if (n == 0) break;
            h = new long[n];
            for (int i = 0; i < n; i++) h[i] = Long.parseLong(st.nextToken());
            sb.append(solve(0, n - 1)).append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        }
    ],

    // ===== 문제풀이 탭 렌더링 =====
    renderProblem(container) {
        container.innerHTML = '';

        // 단계별 카드
        const stageList = document.createElement('div');
        stageList.className = 'problem-stages';

        this.stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            stageCard.innerHTML = `
                <div class="stage-header">
                    <span class="stage-num">단계 ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;

            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `
                    <span class="problem-title">${prob.title}</span>
                    <span class="problem-diff">${prob.difficulty === 'platinum' ? 'Platinum' : prob.difficulty === 'gold' ? 'Gold' : 'Silver'}</span>
                `;
                btn.addEventListener('click', () => {
                    this._renderProblemDetail(container, prob);
                });
                problemsDiv.appendChild(btn);
            });

            stageList.appendChild(stageCard);
        });

        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        // 뒤로가기
        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        // 문제 설명
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">BOJ에서 풀기 ↗</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

        // 힌트 단계별
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">▶</span>
                </div>
                <div class="hint-step-content">${hint.content}</div>
            `;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) {
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
window.AlgoTopics.divideconquer = divideConquerTopic;
