// ===== 이분 탐색 토픽 모듈 =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: '이분 탐색',
    icon: '🔍',
    category: '정렬과 탐색',
    order: 7,
    description: '정렬된 데이터에서 원하는 값을 빠르게 찾는 기법',
    relatedNote: '이분 탐색은 최적화 문제에서 결정 문제로 변환하는 매개변수 탐색(Parametric Search) 기법으로 자주 확장됩니다.',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔍 이분 탐색 (Binary Search)</h2>
                <p class="hero-sub">절반씩 버리면, 아무리 많은 데이터에서도 빠르게 찾을 수 있습니다</p>
            </div>

            <!-- ① 이분 탐색이란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 이분 탐색이란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 국어사전에서 "사과"를 찾는다고 생각해 보세요.<br><br>
                    첫 페이지부터 한 장씩 넘기면? 몇 천 페이지를 넘겨야 합니다!<br>
                    하지만 <strong>사전의 중간</strong>을 펴면? "ㅁ" 근처가 나옵니다.<br>
                    "사"는 "ㅁ"보다 뒤에 있으니 → <strong>앞 절반은 버립니다!</strong><br>
                    다시 남은 절반의 중간을 펴고... 이것을 반복하면 금방 찾습니다!<br><br>
                    이것이 바로 <strong>이분 탐색</strong>입니다. 매번 <strong>절반을 버리기</strong> 때문에 매우 빠릅니다.
                </div>

                <div class="code-block"><pre><code class="language-python"># 이분 탐색 기본 코드
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid          # 찾았다!
        elif arr[mid] < target:
            lo = mid + 1        # 오른쪽 절반으로
        else:
            hi = mid - 1        # 왼쪽 절반으로

    return -1  # 못 찾음</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">100만 개의 정렬된 숫자에서 하나를 찾으려면, 이분 탐색은 최대 몇 번 비교하면 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>최대 20번</strong>이면 충분합니다!<br>
                        log₂(1,000,000) ≈ 20<br><br>
                        하나씩 찾으면 최대 <strong>100만 번</strong>인데,<br>
                        이분 탐색으로는 <strong>20번</strong>이면 됩니다. 5만 배나 빠릅니다!
                    </div>
                </div>
            </div>

            <!-- ② 이분 탐색의 동작 원리 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 이분 탐색의 동작 원리</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="5" y="30" width="70" height="20" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <text x="10" y="44" font-size="10" fill="var(--accent)">1 3 5 7 9</text>
                            </svg>
                        </div>
                        <h3>① 정렬 필수!</h3>
                        <p>이분 탐색은 <strong>정렬된 배열</strong>에서만 작동합니다. 정렬이 안 되어 있으면 먼저 정렬해야 합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="8" y="35" font-size="10" fill="var(--green)">lo</text>
                                <text x="32" y="35" font-size="10" fill="var(--yellow)">mid</text>
                                <text x="58" y="35" font-size="10" fill="var(--red)">hi</text>
                                <rect x="5" y="40" width="70" height="16" rx="4" fill="none" stroke="var(--border)" stroke-width="2"/>
                            </svg>
                        </div>
                        <h3>② 세 개의 포인터</h3>
                        <p><strong>lo</strong>(시작), <strong>hi</strong>(끝), <strong>mid</strong>(중간).<br>mid = (lo + hi) / 2로 중간 위치를 계산합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="5" y="30" width="30" height="20" rx="4" fill="rgba(224,82,70,0.15)" stroke="var(--red)" stroke-width="1.5"/>
                                <rect x="45" y="30" width="30" height="20" rx="4" fill="rgba(0,184,148,0.15)" stroke="var(--green)" stroke-width="1.5"/>
                                <text x="35" y="55" font-size="20" fill="var(--text2)">✂</text>
                            </svg>
                        </div>
                        <h3>③ 절반 버리기</h3>
                        <p>mid와 비교 후, <strong>필요 없는 절반을 버립니다</strong>.<br>target이 더 크면 lo = mid + 1<br>target이 더 작으면 hi = mid - 1</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 예시: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]에서 23 찾기

# 1회차: lo=0, hi=9, mid=4 → arr[4]=16 < 23 → lo=5
# 2회차: lo=5, hi=9, mid=7 → arr[7]=56 > 23 → hi=6
# 3회차: lo=5, hi=6, mid=5 → arr[5]=23 == 23 → 찾았다! (인덱스 5)</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">[1, 3, 5, 7, 9, 11, 13, 15]에서 7을 찾으려면 몇 번 비교해야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>2번</strong>이면 찾습니다!<br>
                        1회차: lo=0, hi=7, mid=3 → arr[3]=<strong>7</strong> == 7 → 찾았습니다!<br><br>
                        사실 운이 좋으면 1번에 찾을 수도 있습니다. <strong>최악의 경우</strong>가 log₂(8) = 3번입니다.
                    </div>
                </div>
            </div>

            <!-- ③ lower_bound와 upper_bound -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> lower_bound와 upper_bound</div>
                <div class="concept-grid">
                    <div class="concept-card" style="border-color: var(--accent);">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="6" y="40" font-size="12" fill="var(--accent)">1 3 [5] 5 5 7</text>
                                <path d="M24 50 L24 60" stroke="var(--accent)" stroke-width="2"/>
                                <text x="12" y="72" font-size="10" fill="var(--accent)">lower</text>
                            </svg>
                        </div>
                        <h3>lower_bound</h3>
                        <p>target <strong>이상</strong>인 값이 처음 나타나는 위치.<br>같은 값이 여러 개면 <strong>가장 왼쪽</strong> 위치를 반환합니다.</p>
                    </div>
                    <div class="concept-card" style="border-color: var(--green);">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="6" y="40" font-size="12" fill="var(--green)">1 3 5 5 5 [7]</text>
                                <path d="M56 50 L56 60" stroke="var(--green)" stroke-width="2"/>
                                <text x="44" y="72" font-size="10" fill="var(--green)">upper</text>
                            </svg>
                        </div>
                        <h3>upper_bound</h3>
                        <p>target을 <strong>초과</strong>하는 값이 처음 나타나는 위치.<br>같은 값의 <strong>다음 위치</strong>를 반환합니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># [1, 3, 5, 5, 5, 7, 9]에서 5의 개수 구하기
from bisect import bisect_left, bisect_right

arr = [1, 3, 5, 5, 5, 7, 9]
lower = bisect_left(arr, 5)   # 2 (첫 번째 5의 위치)
upper = bisect_right(arr, 5)  # 5 (마지막 5 다음 위치)

count = upper - lower          # 5 - 2 = 3개!</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">[1, 2, 2, 2, 3, 3, 4]에서 2는 몇 개 있을까요? lower_bound와 upper_bound를 사용해 보세요.</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        lower_bound(2) = <strong>1</strong> (인덱스 1에서 처음 등장)<br>
                        upper_bound(2) = <strong>4</strong> (인덱스 4에서 2보다 큰 값 등장)<br>
                        개수 = 4 - 1 = <strong>3개</strong>입니다!
                    </div>
                </div>
            </div>

            <!-- ④ 매개변수 탐색 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 매개변수 탐색 (Parametric Search)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "업다운 게임"을 생각해 보세요!<br><br>
                    친구가 1~100 중 하나를 정했습니다. 여러분이 숫자를 말하면 "업!" 또는 "다운!"이라고 알려줍니다.<br>
                    매개변수 탐색도 똑같습니다!<br><br>
                    <strong>"최적값을 구하라"</strong> → <strong>"이 값이 가능한가? (YES/NO)"</strong>로 바꿉니다.<br>
                    그리고 YES/NO 경계를 이분 탐색으로 찾으면 됩니다!
                </div>

                <div class="concept-grid">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="15" y="45" font-size="16" fill="var(--green)">✓ ✓ ✓</text>
                                <text x="15" y="65" font-size="16" fill="var(--red)">✗ ✗ ✗</text>
                            </svg>
                        </div>
                        <h3>YES/NO 판별</h3>
                        <p>"길이 x로 잘라서 N개를 만들 수 있나?"<br>"높이 H로 잘라서 M미터를 얻을 수 있나?"<br>YES/NO로 답할 수 있으면 매개변수 탐색!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="5" y="35" font-size="9" fill="var(--green)">YES YES YES</text>
                                <text x="5" y="50" font-size="9" fill="var(--red)">NO  NO  NO</text>
                                <line x1="38" y1="20" x2="38" y2="62" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,3"/>
                                <text x="22" y="75" font-size="9" fill="var(--yellow)">경계!</text>
                            </svg>
                        </div>
                        <h3>경계 찾기</h3>
                        <p>YES와 NO의 <strong>경계</strong>에 최적값이 있습니다.<br>이 경계를 이분 탐색으로 빠르게 찾습니다!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"랜선 4개 (802, 743, 457, 539cm)를 잘라서 11개를 만들 때 최대 길이"를 매개변수 탐색으로 바꾸면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>"길이 x cm로 잘랐을 때 11개 이상 만들 수 있는가?"</strong>로 바꿉니다!<br><br>
                        x=200이면? 802/200 + 743/200 + 457/200 + 539/200 = 4+3+2+2 = <strong>11개 → YES</strong><br>
                        x=201이면? 3+3+2+2 = <strong>10개 → NO</strong><br><br>
                        따라서 YES→NO 경계인 <strong>200</strong>이 정답입니다!
                    </div>
                </div>
            </div>

            <!-- ⑤ 이분 탐색 문제 푸는 3단계 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 이분 탐색 문제 푸는 3단계</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="12" y="35" font-size="10" fill="var(--green)">lo</text>
                                <text x="52" y="35" font-size="10" fill="var(--red)">hi</text>
                                <rect x="10" y="40" width="60" height="14" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>
                                <line x1="10" y1="47" x2="70" y2="47" stroke="var(--accent)" stroke-width="1" stroke-dasharray="3,3"/>
                            </svg>
                        </div>
                        <h3>① 탐색 범위 정하기</h3>
                        <p><strong>lo</strong>와 <strong>hi</strong>를 정합니다. 가능한 답의 최솟값과 최댓값이 범위입니다. 배열이면 0~N-1, 값이면 1~최대값.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <text x="8" y="35" font-size="10" fill="var(--accent)">check(mid)</text>
                                <text x="8" y="52" font-size="10" fill="var(--green)">→ YES?</text>
                                <text x="8" y="68" font-size="10" fill="var(--red)">→ NO?</text>
                            </svg>
                        </div>
                        <h3>② 판별 함수 만들기</h3>
                        <p><strong>check(mid)</strong> 함수를 만듭니다. 이 값이 조건을 만족하면 YES, 아니면 NO를 반환합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg viewBox="0 0 80 80" class="icon-svg">
                                <rect x="10" y="30" width="25" height="20" rx="4" fill="rgba(0,184,148,0.15)" stroke="var(--green)" stroke-width="1.5"/>
                                <rect x="45" y="30" width="25" height="20" rx="4" fill="rgba(224,82,70,0.15)" stroke="var(--red)" stroke-width="1.5"/>
                                <text x="30" y="62" font-size="18" fill="var(--accent)">→</text>
                            </svg>
                        </div>
                        <h3>③ 범위 좁히기</h3>
                        <p>YES면 <strong>더 큰 값 시도</strong> (lo = mid + 1)<br>NO면 <strong>더 작은 값 시도</strong> (hi = mid - 1)<br>문제에 따라 방향이 반대일 수도 있습니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"나무 높이 [20, 15, 10, 17]에서 최소 7m를 얻으려면?"의 3단계를 적용하면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        ① <strong>탐색 범위</strong>: lo=0, hi=20 (가장 높은 나무)<br>
                        ② <strong>판별 함수</strong>: check(H) = 각 나무에서 max(0, 높이-H)의 합 ≥ 7인가?<br>
                        ③ <strong>범위 좁히기</strong>: YES면 lo = mid + 1 (더 높은 H 시도), NO면 hi = mid - 1<br><br>
                        정답은 <strong>H = 15</strong>입니다! (잘린 양: 5+0+0+2 = 7)
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
                <button class="viz-tab active" data-viz="basic">기본 이분 탐색</button>
                <button class="viz-tab" data-viz="parametric">매개변수 탐색 (나무 자르기)</button>
            </div>
            <div id="bs-viz-content"></div>
        `;

        const vizContent = container.querySelector('#bs-viz-content');
        const tabs = container.querySelectorAll('.viz-tab');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                self._clearVizState();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.viz === 'basic') self._renderVizBasic(vizContent);
                else self._renderVizParametric(vizContent);
            });
        });

        this._renderVizBasic(vizContent);
    },

    // ===== 기본 이분 탐색 시각화 =====
    _renderVizBasic(container) {
        let arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        let target = 23;

        container.innerHTML = `
            <div class="viz-card">
                <h3>기본 이분 탐색</h3>
                <p style="color:var(--text2);margin-bottom:12px;">정렬된 배열에서 원하는 값을 절반씩 버리며 찾습니다.</p>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                    <label>찾을 값: <input type="number" id="bs-target" value="23" style="width:70px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <button class="btn btn-primary" id="bs-basic-apply">시작</button>
                </div>
                <div class="bs-array" id="bs-array"></div>
                <div class="bs-pointers" id="bs-pointers"></div>
                <div class="bs-info" id="bs-info" style="margin-top:12px;padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;
        const arrayEl = container.querySelector('#bs-array');
        const pointersEl = container.querySelector('#bs-pointers');
        const infoEl = container.querySelector('#bs-info');

        function renderArray() {
            arrayEl.innerHTML = arr.map((v, i) =>
                `<div class="bs-cell in-range" id="bs-c-${i}">
                    <div class="bs-cell-val">${v}</div>
                    <div class="bs-cell-idx">${i}</div>
                </div>`
            ).join('');
            pointersEl.innerHTML = '';
        }

        function buildAndInit() {
            self._clearVizState();
            target = parseInt(container.querySelector('#bs-target').value);
            if (isNaN(target)) { alert('숫자를 입력해 주세요.'); return; }

            renderArray();
            infoEl.innerHTML = `<span style="color:var(--text2)">배열에서 <strong>${target}</strong>을 찾습니다.</span>`;

            const steps = [];
            let lo = 0, hi = arr.length - 1;
            let found = false;
            let round = 0;

            while (lo <= hi) {
                const curLo = lo, curHi = hi;
                const mid = Math.floor((lo + hi) / 2);
                round++;

                if (arr[mid] === target) {
                    steps.push({
                        description: `${round}회차: lo=${curLo}, hi=${curHi}, mid=${mid} → arr[${mid}]=${arr[mid]} == ${target} → 찾았습니다! ✅`,
                        action() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                cell.className = 'bs-cell' + (i >= curLo && i <= curHi ? ' in-range' : ' excluded');
                            }
                            container.querySelector(`#bs-c-${mid}`).className = 'bs-cell found';
                            updatePointers(curLo, curHi, mid);
                            infoEl.innerHTML = `<strong style="color:var(--green);font-size:1.1rem;">✅ 찾았습니다! arr[${mid}] = ${target}</strong>`;
                        },
                        undo() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                cell.className = 'bs-cell' + (i >= curLo && i <= curHi ? ' in-range' : ' excluded');
                            }
                            if (round > 1) {
                                updatePointers(curLo, curHi, mid);
                            } else {
                                pointersEl.innerHTML = '';
                            }
                            infoEl.innerHTML = `<span style="color:var(--text2)">배열에서 <strong>${target}</strong>을 찾습니다.</span>`;
                        }
                    });
                    found = true;
                    break;
                } else if (arr[mid] < target) {
                    const prevLo = lo;
                    lo = mid + 1;
                    steps.push({
                        description: `${round}회차: lo=${curLo}, hi=${curHi}, mid=${mid} → arr[${mid}]=${arr[mid]} < ${target} → 오른쪽으로! (lo=${lo})`,
                        action() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                if (i < curLo || i > curHi) cell.className = 'bs-cell excluded';
                                else if (i === mid) cell.className = 'bs-cell mid';
                                else if (i >= curLo && i <= mid) cell.className = 'bs-cell excluded';
                                else cell.className = 'bs-cell in-range';
                            }
                            updatePointers(curLo, curHi, mid);
                            infoEl.innerHTML = `arr[${mid}]=${arr[mid]} < ${target} → <strong>왼쪽 절반 제거!</strong> 다음: lo=${mid + 1}, hi=${curHi}`;
                        },
                        undo() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                cell.className = 'bs-cell' + (i >= curLo && i <= curHi ? ' in-range' : ' excluded');
                            }
                            infoEl.innerHTML = `<span style="color:var(--text2)">배열에서 <strong>${target}</strong>을 찾습니다.</span>`;
                            pointersEl.innerHTML = '';
                        }
                    });
                } else {
                    const prevHi = hi;
                    hi = mid - 1;
                    steps.push({
                        description: `${round}회차: lo=${curLo}, hi=${curHi}, mid=${mid} → arr[${mid}]=${arr[mid]} > ${target} → 왼쪽으로! (hi=${hi})`,
                        action() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                if (i < curLo || i > curHi) cell.className = 'bs-cell excluded';
                                else if (i === mid) cell.className = 'bs-cell mid';
                                else if (i >= mid && i <= curHi) cell.className = 'bs-cell excluded';
                                else cell.className = 'bs-cell in-range';
                            }
                            updatePointers(curLo, curHi, mid);
                            infoEl.innerHTML = `arr[${mid}]=${arr[mid]} > ${target} → <strong>오른쪽 절반 제거!</strong> 다음: lo=${curLo}, hi=${mid - 1}`;
                        },
                        undo() {
                            for (let i = 0; i < arr.length; i++) {
                                const cell = container.querySelector(`#bs-c-${i}`);
                                cell.className = 'bs-cell' + (i >= curLo && i <= curHi ? ' in-range' : ' excluded');
                            }
                            infoEl.innerHTML = `<span style="color:var(--text2)">배열에서 <strong>${target}</strong>을 찾습니다.</span>`;
                            pointersEl.innerHTML = '';
                        }
                    });
                }
            }

            if (!found) {
                steps.push({
                    description: `탐색 종료: lo > hi → ${target}은 배열에 없습니다! ❌`,
                    action() {
                        infoEl.innerHTML = `<strong style="color:var(--red);font-size:1.1rem;">❌ ${target}은 배열에 없습니다.</strong>`;
                    },
                    undo() {
                        infoEl.innerHTML = `<span style="color:var(--text2)">배열에서 <strong>${target}</strong>을 찾습니다.</span>`;
                    }
                });
            }

            self._initStepController(container, steps);
        }

        function updatePointers(lo, hi, mid) {
            const cells = container.querySelectorAll('.bs-cell');
            if (cells.length === 0) return;
            const containerRect = arrayEl.getBoundingClientRect();
            pointersEl.innerHTML = '';
            const cellWidth = 100 / arr.length;

            const loLabel = document.createElement('span');
            loLabel.className = 'bs-pointer lo';
            loLabel.textContent = `lo=${lo}`;
            loLabel.style.left = `${lo * cellWidth + cellWidth / 2}%`;
            pointersEl.appendChild(loLabel);

            const hiLabel = document.createElement('span');
            hiLabel.className = 'bs-pointer hi';
            hiLabel.textContent = `hi=${hi}`;
            hiLabel.style.left = `${hi * cellWidth + cellWidth / 2}%`;
            pointersEl.appendChild(hiLabel);

            const midLabel = document.createElement('span');
            midLabel.className = 'bs-pointer mid';
            midLabel.textContent = `mid=${mid}`;
            midLabel.style.left = `${mid * cellWidth + cellWidth / 2}%`;
            pointersEl.appendChild(midLabel);
        }

        container.querySelector('#bs-basic-apply').addEventListener('click', buildAndInit);
        buildAndInit();
    },

    // ===== 매개변수 탐색 시각화 (나무 자르기) =====
    _renderVizParametric(container) {
        const trees = [20, 15, 10, 17];
        let M = 7;

        container.innerHTML = `
            <div class="viz-card">
                <h3>매개변수 탐색 — 나무 자르기</h3>
                <p style="color:var(--text2);margin-bottom:12px;">절단기 높이 H를 이분 탐색합니다. H보다 높은 부분만 잘립니다.</p>
                <p style="color:var(--text3);margin-bottom:12px;font-size:0.85rem;">나무 높이: [${trees.join(', ')}], 필요한 나무: ${M}m</p>
                <div class="bs-tree-chart" id="bs-tree-chart"></div>
                <div class="bs-search-info" id="bs-search-info" style="margin-top:12px;padding:10px;background:var(--bg);border-radius:var(--radius);text-align:center;min-height:36px;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;
        const chartEl = container.querySelector('#bs-tree-chart');
        const infoEl = container.querySelector('#bs-search-info');
        const maxH = Math.max(...trees);

        // 나무 바 렌더링
        chartEl.innerHTML = trees.map((h, i) =>
            `<div class="bs-tree-wrapper">
                <div class="bs-tree-bar" id="bs-tree-${i}" style="height:${(h / maxH) * 100}%;">
                    <span class="bs-tree-label">${h}m</span>
                </div>
                <div class="bs-tree-cut" id="bs-cut-${i}" style="display:none;"></div>
            </div>`
        ).join('') + '<div class="bs-cut-line" id="bs-cut-line" style="display:none;"></div>';

        infoEl.innerHTML = `<span style="color:var(--text2)">높이 H를 이분 탐색하여 최소 ${M}m의 나무를 얻을 수 있는 최대 H를 찾습니다.</span>`;

        // 이분 탐색 시뮬레이션
        const steps = [];
        let lo = 0, hi = maxH;
        let answer = 0;
        let round = 0;

        while (lo <= hi) {
            const curLo = lo, curHi = hi;
            const mid = Math.floor((lo + hi) / 2);
            const gained = trees.reduce((sum, h) => sum + Math.max(0, h - mid), 0);
            round++;

            if (gained >= M) {
                answer = mid;
                const prevLo = lo;
                lo = mid + 1;

                steps.push({
                    description: `${round}회차: lo=${curLo}, hi=${curHi}, mid=${mid} → 잘린 양=${gained}m ≥ ${M}m → YES! (lo=${lo}, 정답 후보=${mid})`,
                    action() {
                        showCutLine(mid, curLo, curHi, gained, true);
                    },
                    undo() {
                        hideCutLine();
                        infoEl.innerHTML = `<span style="color:var(--text2)">높이 H를 이분 탐색하여 최소 ${M}m의 나무를 얻을 수 있는 최대 H를 찾습니다.</span>`;
                    }
                });
            } else {
                hi = mid - 1;

                steps.push({
                    description: `${round}회차: lo=${curLo}, hi=${curHi}, mid=${mid} → 잘린 양=${gained}m < ${M}m → NO! (hi=${mid - 1})`,
                    action() {
                        showCutLine(mid, curLo, curHi, gained, false);
                    },
                    undo() {
                        hideCutLine();
                        infoEl.innerHTML = `<span style="color:var(--text2)">높이 H를 이분 탐색하여 최소 ${M}m의 나무를 얻을 수 있는 최대 H를 찾습니다.</span>`;
                    }
                });
            }
        }

        const finalAns = answer;
        const finalGained = trees.reduce((sum, h) => sum + Math.max(0, h - finalAns), 0);
        steps.push({
            description: `완성! 최대 높이 H = ${finalAns}m (잘린 양: ${finalGained}m)`,
            action() {
                showCutLine(finalAns, 0, 0, finalGained, true);
                infoEl.innerHTML = `<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: H = ${finalAns}m (잘린 양: ${finalGained}m ≥ ${M}m)</strong>`;
            },
            undo() {
                hideCutLine();
            }
        });

        function showCutLine(H, lo, hi, gained, isYes) {
            const cutLine = container.querySelector('#bs-cut-line');
            const pct = ((maxH - H) / maxH) * 100;
            cutLine.style.display = 'block';
            cutLine.style.top = `${pct}%`;
            cutLine.innerHTML = `H=${H}`;

            trees.forEach((h, i) => {
                const bar = container.querySelector(`#bs-tree-${i}`);
                const cutSection = container.querySelector(`#bs-cut-${i}`);
                if (h > H) {
                    const cutPct = ((h - H) / maxH) * 100;
                    cutSection.style.display = 'block';
                    cutSection.style.height = `${cutPct / (h / maxH * 100) * 100}%`;
                    cutSection.className = 'bs-tree-cut ' + (isYes ? 'yes' : 'no');
                    cutSection.textContent = `${h - H}`;
                } else {
                    cutSection.style.display = 'none';
                }
            });

            infoEl.innerHTML = `H=${H} | 잘린 양: ${trees.map(h => Math.max(0, h - H)).join('+')} = <strong>${gained}m</strong> | ` +
                (isYes ? `<span style="color:var(--green)">≥ ${M} → YES</span> (lo=${lo+1})` : `<span style="color:var(--red)">< ${M} → NO</span> (hi=${H-1})`);
        }

        function hideCutLine() {
            const cutLine = container.querySelector('#bs-cut-line');
            if (cutLine) cutLine.style.display = 'none';
            trees.forEach((h, i) => {
                const cutSection = container.querySelector(`#bs-cut-${i}`);
                if (cutSection) cutSection.style.display = 'none';
            });
        }

        self._initStepController(container, steps);
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
        { num: 1, title: '기본 이분 탐색', desc: '배열에서 값 찾기 (Silver IV)', problemIds: ['boj-1920', 'boj-10816'] },
        { num: 2, title: '매개변수 탐색 입문', desc: '최적값을 이분 탐색으로 (Silver II)', problemIds: ['boj-1654', 'boj-2805'] },
        { num: 3, title: '매개변수 탐색 심화', desc: '복잡한 판별 함수 (Gold)', problemIds: ['boj-2110', 'boj-1300'] },
        { num: 4, title: '응용', desc: 'LIS + 이분 탐색 (Gold II)', problemIds: ['boj-12015'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 기본 이분 탐색 ==========
        {
            id: 'boj-1920',
            title: 'BOJ 1920 - 수 찾기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1920',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정수 A[1]~A[N]이 주어져 있을 때, X라는 정수가 A 안에 존재하는지 알아내는 프로그램을 작성하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 100,000). 다음 줄에 N개의 정수. 다음 줄에 M (1 ≤ M ≤ 100,000). 다음 줄에 M개의 정수.</p></div>
                    <div><h4>출력</h4><p>M개의 줄에 존재하면 1, 존재하지 않으면 0을 출력.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5\n4 1 5 2 3\n5\n1 3 7 9 5</pre></div>
                        <div><strong>출력</strong><pre>1\n1\n0\n0\n1</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '배열을 <strong>정렬</strong>한 뒤, 각 질문에 대해 <strong>이분 탐색</strong>으로 존재 여부를 확인합니다.' },
                { title: '핵심 코드', content: 'Python의 <code>bisect_left</code>를 사용하거나, 직접 이분 탐색을 구현합니다. set()을 사용해도 됩니다.' },
                { title: '시간 복잡도', content: '정렬 O(N log N) + 탐색 M × O(log N) = <strong>O((N+M) log N)</strong>' }
            ],
            inputDefault: 5,
            solve() { return '1\n1\n0\n0\n1'; },
            templates: {
                python: `import sys
from bisect import bisect_left
input = sys.stdin.readline

N = int(input())
A = sorted(list(map(int, input().split())))
M = int(input())
queries = list(map(int, input().split()))

for x in queries:
    idx = bisect_left(A, x)
    if idx < N and A[idx] == x:
        print(1)
    else:
        print(0)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int N, M, A[100001];

bool bsearch(int target) {
    int lo = 0, hi = N - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (A[mid] == target) return true;
        else if (A[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> N;
    for (int i = 0; i < N; i++) cin >> A[i];
    sort(A, A + N);
    cin >> M;
    for (int i = 0; i < M; i++) {
        int x; cin >> x;
        cout << (bsearch(x) ? 1 : 0) << "\\n";
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        int[] A = new int[N];
        for (int i = 0; i < N; i++) A[i] = Integer.parseInt(st.nextToken());
        Arrays.sort(A);
        int M = Integer.parseInt(br.readLine().trim());
        st = new StringTokenizer(br.readLine());
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < M; i++) {
            int x = Integer.parseInt(st.nextToken());
            sb.append(Arrays.binarySearch(A, x) >= 0 ? 1 : 0).append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-10816',
            title: 'BOJ 10816 - 숫자 카드 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10816',
            descriptionHTML: `
                <h3>문제</h3>
                <p>숫자 카드 N장이 있습니다. 정수 M개가 주어졌을 때, 각 정수가 적힌 숫자 카드를 몇 장 가지고 있는지 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 500,000). 다음 줄에 N개의 정수. 다음 줄에 M. 다음 줄에 M개의 정수.</p></div>
                    <div><h4>출력</h4><p>각 수가 적힌 카드의 개수를 공백으로 구분하여 출력.</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>10\n6 3 2 10 10 10 -10 -10 7 3\n8\n10 9 -5 2 3 4 5 -10</pre></div>
                        <div><strong>출력</strong><pre>3 0 0 1 2 0 0 2</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>lower_bound와 upper_bound</strong>를 사용합니다. 개수 = upper_bound - lower_bound' },
                { title: '핵심 코드', content: 'Python: <code>bisect_right(x) - bisect_left(x)</code><br>C++: <code>upper_bound - lower_bound</code>' }
            ],
            inputDefault: 10,
            solve() { return '3 0 0 1 2 0 0 2'; },
            templates: {
                python: `import sys
from bisect import bisect_left, bisect_right
input = sys.stdin.readline

N = int(input())
cards = sorted(list(map(int, input().split())))
M = int(input())
queries = list(map(int, input().split()))

result = []
for x in queries:
    result.append(bisect_right(cards, x) - bisect_left(cards, x))

print(' '.join(map(str, result)))`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int N; cin >> N;
    int cards[500001];
    for (int i = 0; i < N; i++) cin >> cards[i];
    sort(cards, cards + N);

    int M; cin >> M;
    for (int i = 0; i < M; i++) {
        int x; cin >> x;
        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);
        cout << cnt << (i < M - 1 ? " " : "\\n");
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int lowerBound(int[] arr, int target) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
    static int upperBound(int[] arr, int target) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] <= target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int[] cards = new int[N];
        StringTokenizer st = new StringTokenizer(br.readLine());
        for (int i = 0; i < N; i++) cards[i] = Integer.parseInt(st.nextToken());
        Arrays.sort(cards);
        int M = Integer.parseInt(br.readLine().trim());
        st = new StringTokenizer(br.readLine());
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < M; i++) {
            int x = Integer.parseInt(st.nextToken());
            if (i > 0) sb.append(' ');
            sb.append(upperBound(cards, x) - lowerBound(cards, x));
        }
        System.out.println(sb);
    }
}`
            }
        },

        // ========== 2단계: 매개변수 탐색 입문 ==========
        {
            id: 'boj-1654',
            title: 'BOJ 1654 - 랜선 자르기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1654',
            descriptionHTML: `
                <h3>문제</h3>
                <p>이미 가지고 있는 K개의 랜선을 잘라서 N개의 같은 길이의 랜선을 만들려 합니다. 만들 수 있는 최대 랜선의 길이를 구하시오. (N개보다 많이 만드는 것도 N개를 만드는 것에 포함)</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 K (1 ≤ K ≤ 10,000)과 N (1 ≤ N ≤ 1,000,000). K ≤ N.<br>이후 K줄에 각 랜선의 길이 (자연수, ≤ 2^31-1)</p></div>
                    <div><h4>출력</h4><p>N개를 만들 수 있는 랜선의 최대 길이 (정수)</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 11\n802\n743\n457\n539</pre></div>
                        <div><strong>출력</strong><pre>200</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>매개변수 탐색!</strong> "길이 x로 잘랐을 때 N개 이상 만들 수 있는가?"를 이분 탐색합니다.' },
                { title: '판별 함수', content: '<code>check(x) = sum(각 랜선 // x) >= N</code><br>YES면 lo = mid + 1 (더 긴 길이 시도), NO면 hi = mid - 1' },
                { title: '범위 주의', content: 'lo=1, hi=max(랜선). <strong>lo=0이면 0으로 나누기 에러!</strong> 또한 hi가 int 범위를 넘을 수 있으므로 long 사용.' }
            ],
            inputDefault: 4,
            solve() { return '200'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

K, N = map(int, input().split())
cables = [int(input()) for _ in range(K)]

lo, hi = 1, max(cables)
answer = 0

while lo <= hi:
    mid = (lo + hi) // 2
    count = sum(c // mid for c in cables)
    if count >= N:
        answer = mid
        lo = mid + 1    # 더 긴 길이 시도
    else:
        hi = mid - 1    # 더 짧은 길이 시도

print(answer)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;
typedef long long ll;

int main() {
    int K, N;
    cin >> K >> N;
    ll cables[10001], maxLen = 0;
    for (int i = 0; i < K; i++) {
        cin >> cables[i];
        maxLen = max(maxLen, cables[i]);
    }

    ll lo = 1, hi = maxLen, answer = 0;
    while (lo <= hi) {
        ll mid = (lo + hi) / 2;
        ll count = 0;
        for (int i = 0; i < K; i++) count += cables[i] / mid;
        if (count >= N) {
            answer = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    cout << answer << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int K = sc.nextInt(), N = sc.nextInt();
        long[] cables = new long[K];
        long maxLen = 0;
        for (int i = 0; i < K; i++) {
            cables[i] = sc.nextLong();
            maxLen = Math.max(maxLen, cables[i]);
        }
        long lo = 1, hi = maxLen, answer = 0;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long count = 0;
            for (long c : cables) count += c / mid;
            if (count >= N) { answer = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        System.out.println(answer);
    }
}`
            }
        },
        {
            id: 'boj-2805',
            title: 'BOJ 2805 - 나무 자르기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2805',
            descriptionHTML: `
                <h3>문제</h3>
                <p>목재절단기에 높이 H를 설정하면 H보다 높은 나무의 윗부분이 잘립니다. 적어도 M미터의 나무를 집에 가져가기 위해 설정할 수 있는 높이의 최댓값을 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 1,000,000)과 M (1 ≤ M ≤ 2,000,000,000).<br>둘째 줄에 나무 높이들 (≤ 1,000,000,000)</p></div>
                    <div><h4>출력</h4><p>절단기 높이의 최댓값</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>4 7\n20 15 10 17</pre></div>
                        <div><strong>출력</strong><pre>15</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>매개변수 탐색!</strong> "높이 H로 잘랐을 때 M미터 이상 얻을 수 있는가?"를 이분 탐색합니다.' },
                { title: '판별 함수', content: '<code>check(H) = sum(max(0, tree - H) for tree in trees) >= M</code>' },
                { title: '범위', content: 'lo=0, hi=max(나무). YES면 lo=mid+1, NO면 hi=mid-1. <strong>합계가 int 범위를 넘을 수 있으므로 long 사용!</strong>' }
            ],
            inputDefault: 4,
            solve() { return '15'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
trees = list(map(int, input().split()))

lo, hi = 0, max(trees)
answer = 0

while lo <= hi:
    mid = (lo + hi) // 2
    gained = sum(max(0, t - mid) for t in trees)
    if gained >= M:
        answer = mid
        lo = mid + 1
    else:
        hi = mid - 1

print(answer)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int N; ll M;
    cin >> N >> M;
    int trees[1000001];
    int maxH = 0;
    for (int i = 0; i < N; i++) {
        cin >> trees[i];
        maxH = max(maxH, trees[i]);
    }

    ll lo = 0, hi = maxH, answer = 0;
    while (lo <= hi) {
        ll mid = (lo + hi) / 2;
        ll gained = 0;
        for (int i = 0; i < N; i++)
            if (trees[i] > mid) gained += trees[i] - mid;
        if (gained >= M) { answer = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << answer << endl;
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        long M = Long.parseLong(st.nextToken());
        st = new StringTokenizer(br.readLine());
        int[] trees = new int[N];
        int maxH = 0;
        for (int i = 0; i < N; i++) {
            trees[i] = Integer.parseInt(st.nextToken());
            maxH = Math.max(maxH, trees[i]);
        }
        long lo = 0, hi = maxH, answer = 0;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            long gained = 0;
            for (int t : trees) if (t > mid) gained += t - mid;
            if (gained >= M) { answer = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        System.out.println(answer);
    }
}`
            }
        },

        // ========== 3단계: 매개변수 탐색 심화 ==========
        {
            id: 'boj-2110',
            title: 'BOJ 2110 - 공유기 설치',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2110',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 집에 C개의 공유기를 설치하려 합니다. 가장 인접한 두 공유기 사이의 거리를 최대화하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (2 ≤ N ≤ 200,000)과 C (2 ≤ C ≤ N).<br>이후 N줄에 집의 좌표 (0 ≤ x ≤ 1,000,000,000)</p></div>
                    <div><h4>출력</h4><p>가장 인접한 두 공유기 사이의 최대 거리</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>5 3\n1\n2\n8\n4\n9</pre></div>
                        <div><strong>출력</strong><pre>3</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>"최소 거리 d 이상으로 C개를 설치할 수 있는가?"</strong>를 이분 탐색합니다.' },
                { title: '판별 함수', content: '집을 정렬한 후, 첫 집에 설치하고, 이전 설치 위치에서 d 이상 떨어진 집에 다음 설치. 설치 수 ≥ C면 YES.' },
                { title: '범위', content: 'lo=1, hi=max(집)-min(집). YES면 lo=mid+1 (더 큰 거리 시도), NO면 hi=mid-1.' }
            ],
            inputDefault: 5,
            solve() { return '3'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, C = map(int, input().split())
houses = sorted([int(input()) for _ in range(N)])

lo, hi = 1, houses[-1] - houses[0]
answer = 0

while lo <= hi:
    mid = (lo + hi) // 2
    # 거리 mid 이상으로 C개 설치 가능?
    count = 1
    last = houses[0]
    for i in range(1, N):
        if houses[i] - last >= mid:
            count += 1
            last = houses[i]
    if count >= C:
        answer = mid
        lo = mid + 1
    else:
        hi = mid - 1

print(answer)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;

int N, C;
int houses[200001];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> N >> C;
    for (int i = 0; i < N; i++) cin >> houses[i];
    sort(houses, houses + N);

    long long lo = 1, hi = houses[N-1] - houses[0], answer = 0;
    while (lo <= hi) {
        long long mid = (lo + hi) / 2;
        int count = 1, last = houses[0];
        for (int i = 1; i < N; i++) {
            if (houses[i] - last >= mid) {
                count++;
                last = houses[i];
            }
        }
        if (count >= C) { answer = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    cout << answer << endl;
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken()), C = Integer.parseInt(st.nextToken());
        int[] houses = new int[N];
        for (int i = 0; i < N; i++) houses[i] = Integer.parseInt(br.readLine().trim());
        Arrays.sort(houses);

        long lo = 1, hi = houses[N-1] - houses[0], answer = 0;
        while (lo <= hi) {
            long mid = (lo + hi) / 2;
            int count = 1, last = houses[0];
            for (int i = 1; i < N; i++) {
                if (houses[i] - last >= mid) { count++; last = houses[i]; }
            }
            if (count >= C) { answer = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        System.out.println(answer);
    }
}`
            }
        },
        {
            id: 'boj-1300',
            title: 'BOJ 1300 - K번째 수',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1300',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 배열 A에서 A[i][j] = i × j입니다. 이 배열을 일차원으로 펼치고 오름차순 정렬했을 때, k번째 수를 구하시오. (인덱스는 1부터)</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (≤ 10^5). 둘째 줄에 k (≤ min(10^9, N^2)).</p></div>
                    <div><h4>출력</h4><p>k번째 수</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>3\n7</pre></div>
                        <div><strong>출력</strong><pre>6</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '<strong>"x 이하인 수가 k개 이상인가?"</strong>를 이분 탐색합니다. 배열을 실제로 만들 필요 없습니다!' },
                { title: '판별 함수', content: 'i행에서 i×j ≤ x인 j의 개수 = min(x÷i, N).<br>전체 개수 = <code>sum(min(x//i, N) for i in 1..N)</code>' },
                { title: '범위', content: 'lo=1, hi=k (답은 항상 k 이하). YES면 hi=mid, NO면 lo=mid+1 (lower_bound 형태).' }
            ],
            inputDefault: 3,
            solve() { return '6'; },
            templates: {
                python: `N = int(input())
k = int(input())

lo, hi = 1, k  # 답은 항상 k 이하

while lo < hi:
    mid = (lo + hi) // 2
    # mid 이하인 수의 개수
    count = 0
    for i in range(1, N + 1):
        count += min(mid // i, N)
    if count >= k:
        hi = mid
    else:
        lo = mid + 1

print(lo)`,
                cpp: `#include <iostream>
#include <algorithm>
using namespace std;
typedef long long ll;

int main() {
    ll N, k;
    cin >> N >> k;

    ll lo = 1, hi = k;
    while (lo < hi) {
        ll mid = (lo + hi) / 2;
        ll count = 0;
        for (ll i = 1; i <= N; i++)
            count += min(mid / i, N);
        if (count >= k) hi = mid;
        else lo = mid + 1;
    }
    cout << lo << endl;
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        long N = sc.nextLong(), k = sc.nextLong();

        long lo = 1, hi = k;
        while (lo < hi) {
            long mid = (lo + hi) / 2;
            long count = 0;
            for (long i = 1; i <= N; i++)
                count += Math.min(mid / i, N);
            if (count >= k) hi = mid;
            else lo = mid + 1;
        }
        System.out.println(lo);
    }
}`
            }
        },

        // ========== 4단계: 응용 ==========
        {
            id: 'boj-12015',
            title: 'BOJ 12015 - 가장 긴 증가하는 부분 수열 2',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12015',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수열 A가 주어졌을 때, 가장 긴 증가하는 부분 수열(LIS)의 길이를 구하시오.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄에 N (1 ≤ N ≤ 1,000,000).<br>둘째 줄에 수열 A (1 ≤ Ai ≤ 1,000,000)</p></div>
                    <div><h4>출력</h4><p>LIS의 길이</p></div>
                </div>
                <div class="problem-example">
                    <h4>예제</h4>
                    <div class="example-grid">
                        <div><strong>입력</strong><pre>6\n10 20 10 30 20 50</pre></div>
                        <div><strong>출력</strong><pre>4</pre></div>
                    </div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'DP로 O(N²)은 N=100만에서 시간 초과. <strong>이분 탐색</strong>으로 O(N log N)에 풀어야 합니다.' },
                { title: '핵심 아이디어', content: '<code>tails</code> 배열을 유지합니다. tails[i] = 길이 i+1인 증가 수열의 마지막 원소 중 최솟값.<br>새 값이 오면 <strong>bisect_left</strong>로 들어갈 위치를 찾습니다.' },
                { title: '구현', content: 'tails의 끝보다 크면 append, 아니면 bisect_left로 찾은 위치에 덮어쓰기. 최종 답 = len(tails).' }
            ],
            inputDefault: 6,
            solve() { return '4'; },
            templates: {
                python: `import sys
from bisect import bisect_left
input = sys.stdin.readline

N = int(input())
A = list(map(int, input().split()))

tails = []  # tails[i] = 길이 i+1인 LIS의 마지막 최솟값

for x in A:
    pos = bisect_left(tails, x)
    if pos == len(tails):
        tails.append(x)    # LIS 길이 증가
    else:
        tails[pos] = x     # 더 작은 값으로 교체

print(len(tails))`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int N; cin >> N;
    vector<int> tails;

    for (int i = 0; i < N; i++) {
        int x; cin >> x;
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    cout << tails.size() << endl;
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        StringTokenizer st = new StringTokenizer(br.readLine());
        List<Integer> tails = new ArrayList<>();

        for (int i = 0; i < N; i++) {
            int x = Integer.parseInt(st.nextToken());
            int pos = Collections.binarySearch(tails, x);
            if (pos < 0) pos = -(pos + 1);
            if (pos == tails.size()) tails.add(x);
            else tails.set(pos, x);
        }
        System.out.println(tails.size());
    }
}`
            }
        }
    ],

    // ===== 문제풀이 탭 렌더링 =====
    renderProblem(container) {
        container.innerHTML = '';

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
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });

            stageList.appendChild(stageCard);
        });

        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">BOJ에서 풀기 ↗</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

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
window.AlgoTopics.binarysearch = binarySearchTopic;
