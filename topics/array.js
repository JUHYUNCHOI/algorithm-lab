// =========================================================
// 배열 (Array) 토픽 모듈
// =========================================================
const arrayTopic = {
    id: 'array',
    title: '배열',
    icon: '📊',
    category: '자료구조 활용',
    order: 2,
    description: '배열을 활용한 투 포인터, 슬라이딩 윈도우, 구간 처리 기법',
    relatedNote: '이 외에도 카데인 알고리즘, 모노톤 스택, Dutch National Flag 등의 기법이 배열 문제에 활용됩니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📊 배열 (Array)</h2>
                <p class="hero-sub">배열 위에서 효율적으로 문제를 푸는 핵심 패턴을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 배열 기초 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 배열 기초
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 배열은 <em>"번호가 적힌 사물함"</em>입니다!
                    0번 사물함, 1번 사물함... 순서대로 나란히 있고, 번호만 알면 바로 열어볼 수 있습니다(O(1)).
                    다만 중간에 사물함을 끼워넣으려면 뒤의 것들을 모두 밀어야 합니다(O(n)).
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.6"/><rect x="26" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/></svg>
                        </div>
                        <h3>인덱스 접근 O(1)</h3>
                        <p><code>arr[i]</code>로 어떤 위치든 바로 접근할 수 있습니다. 배열의 가장 큰 장점입니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">O(n)</text></svg>
                        </div>
                        <h3>순회</h3>
                        <p>배열의 모든 원소를 한 번씩 보면 O(n)입니다. 대부분의 배열 문제의 기본입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="12" font-weight="bold" fill="var(--yellow)">insert</text></svg>
                        </div>
                        <h3>삽입/삭제 O(n)</h3>
                        <p>중간에 넣거나 빼려면 뒤의 원소를 모두 밀어야 합니다. 끝에서의 작업은 O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">sorted</text></svg>
                        </div>
                        <h3>정렬된 배열</h3>
                        <p>정렬되어 있으면 이분 탐색(O(log n))이 가능합니다. 투 포인터도 정렬 후 사용합니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 배열(리스트) 기본 조작
arr = [3, 1, 4, 1, 5, 9, 2, 6]

print(arr[0])       # 3 — 첫 원소
print(arr[-1])      # 6 — 마지막 원소
print(len(arr))     # 8 — 길이

arr.append(7)       # 끝에 추가: O(1)
arr.sort()          # 정렬: O(n log n)
print(arr)          # [1, 1, 2, 3, 4, 5, 6, 7, 9]

# 리스트 컴프리헨션 — 짝수만 골라내기
evens = [x for x in arr if x % 2 == 0]
print(evens)        # [2, 4, 6]</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열의 중간(인덱스 3)에 원소를 삽입하면 시간 복잡도는? 왜 그럴까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>입니다! 인덱스 3 이후의 모든 원소를 한 칸씩 뒤로 밀어야 하기 때문입니다.
                        배열 길이가 n이면 최대 n-3개의 원소를 이동해야 합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 투 포인터 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 투 포인터 (Two Pointers)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"양쪽 끝에서 동시에 걸어오는 두 사람"</em>입니다!
                    정렬된 배열에서 두 수의 합을 찾을 때, 합이 너무 크면 오른쪽을 줄이고, 너무 작으면 왼쪽을 늘립니다.
                    이중 for문(O(n²)) 대신 <strong>O(n)</strong>에 해결할 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">L→</text></svg>
                        </div>
                        <h3>왼쪽에서 시작</h3>
                        <p><code>left = 0</code>에서 시작하여 오른쪽으로 이동합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">←R</text></svg>
                        </div>
                        <h3>오른쪽에서 시작</h3>
                        <p><code>right = n-1</code>에서 시작하여 왼쪽으로 이동합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="22" font-size="18" font-weight="bold" fill="var(--yellow)">↔</text></svg>
                        </div>
                        <h3>조건에 따라 이동</h3>
                        <p>합이 크면 right--, 작으면 left++. O(n)에 완료!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 투 포인터: 정렬된 배열에서 합이 target인 두 수 찾기
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1      # 합이 작으니 왼쪽을 키움
        else:
            right -= 1     # 합이 크니 오른쪽을 줄임
    return [-1, -1]        # 못 찾음

arr = [1, 2, 4, 6, 8, 10]
print(two_sum_sorted(arr, 10))  # [1, 4] → 2+8=10</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">정렬된 [1, 3, 5, 7, 9]에서 합이 12인 두 수를 투 포인터로 찾으면 몇 번 비교할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>3번</strong>입니다! 1+9=10(작음→L++), 3+9=12(찾음!). 실제로는 2번만에 찾습니다.
                        이중 for문이라면 최대 10번 비교해야 할 것을 훨씬 빠르게 해결합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 슬라이딩 윈도우 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 슬라이딩 윈도우 (Sliding Window)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"창문을 옆으로 밀면서 바깥 풍경 보기"</em>입니다!
                    크기가 고정된 창문(윈도우)을 배열 위에서 한 칸씩 밀면서,
                    창문 안에 보이는 원소들의 합/최대/최소를 계속 추적합니다.
                    매번 처음부터 다시 세지 않고, 빠진 것은 빼고 들어온 것은 더합니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="20" height="14" rx="3" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4,2"/><rect x="6" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/><rect x="13" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/></svg>
                        </div>
                        <h3>고정 크기 윈도우</h3>
                        <p>크기 K인 윈도우를 한 칸씩 밀며 합을 갱신합니다. O(n)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="28" height="14" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,2"/><text x="10" y="22" font-size="8" fill="var(--text2)">가변</text></svg>
                        </div>
                        <h3>가변 크기 윈도우</h3>
                        <p>조건을 만족하면 왼쪽을 줄이고, 아니면 오른쪽을 늘립니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 슬라이딩 윈도우: 크기 K인 부분 배열의 최대 합
def max_subarray_sum(arr, k):
    # 처음 윈도우의 합
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # 한 칸씩 밀기: 새로 들어온 건 더하고, 나간 건 빼기
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
print(max_subarray_sum(arr, 3))  # 9 (= 5+1+3)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">[1, 4, 2, 10, 2, 3, 1, 0, 20]에서 크기 4인 부분 배열의 최대 합은?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>24</strong>입니다! [2, 3, 1, 0, 20]에서 윈도우 [3, 1, 0, 20] = 24가 아니라,
                        [10, 2, 3, 1] = 16, [2, 3, 1, 0] = 6, [3, 1, 0, 20] = 24. 정답은 24!
                    </div>
                </div>
            </div>

            <!-- 섹션 4: 배열 문제 풀이 전략 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> 배열 문제 풀이 전략
                </div>
                <div class="analogy-box">
                    <strong>패턴을 알면 풀이가 보입니다!</strong> 배열 문제를 보면 먼저 이런 질문을 해보세요:
                    정렬하면 쉬워지나? → 투 포인터. 구간을 보는 건가? → 슬라이딩 윈도우.
                    각 원소에서 결과를 미리 계산? → 전처리(누적합/곱 배열).
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">sort</text></svg>
                        </div>
                        <h3>정렬 후 탐색</h3>
                        <p>정렬 O(n log n) 후 투 포인터 O(n) = 전체 O(n log n). 브루트 포스 O(n²)보다 빠릅니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">←→</text></svg>
                        </div>
                        <h3>좌우 전처리</h3>
                        <p>왼쪽→오른쪽, 오른쪽→왼쪽 두 번 훑으면 각 위치의 정보를 미리 계산할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">max</text></svg>
                        </div>
                        <h3>상태 추적</h3>
                        <p>순회하면서 최솟값/최댓값/누적값을 변수에 추적하면 한 번에 답을 구할 수 있습니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 예시: 주식 최대 이익 (한 번 순회, 최솟값 추적)
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)        # 지금까지 최저가
        max_profit = max(max_profit, price - min_price)  # 지금 팔면?
    return max_profit

prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices))  # 5 (1에 사서 6에 판다)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">주식 문제를 이중 for문으로 풀면 O(n²)인데, 위의 풀이는 O(?)입니다. 왜 그럴까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>입니다! 배열을 딱 한 번만 순회하면서, "지금까지의 최솟값"을 변수 하나로 추적하기 때문입니다.
                        각 위치에서 "지금 팔면 이익이 얼마?"를 바로 계산할 수 있습니다.
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.toggle('open');
                btn.style.display = 'none';
            });
        });
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>투 포인터 시각화</h2>
                <p class="hero-sub">정렬된 배열에서 두 수의 합을 찾는 과정을 단계별로 봅시다.</p>
            </div>

            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">목표 합:
                    <input type="number" id="arr-target" value="9"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;">
                </label>
                <button class="btn btn-primary" id="arr-viz-start">탐색 시작</button>
            </div>

            <div class="graph-svg-container" style="min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;">
                <div id="arr-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                <div id="arr-pointer-info" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div>
            </div>

            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 합</div>
                    <div id="arr-sum-display" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.2rem;">시작을 눌러주세요</div>
                </div>
                <div style="flex:1;min-width:150px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">상태</div>
                    <div id="arr-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">—</div>
                </div>
            </div>

            ${self._createStepControls()}

            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 미검사</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:var(--yellow);border:2px solid var(--yellow);vertical-align:middle;"></span> 현재 포인터</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:rgba(0,184,148,0.3);border:2px solid var(--green);vertical-align:middle;"></span> 정답 찾음</span>
            </div>
        `;

        const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const boxes = container.querySelector('#arr-boxes');
        const pointerInfo = container.querySelector('#arr-pointer-info');
        const sumDisplay = container.querySelector('#arr-sum-display');
        const statusEl = container.querySelector('#arr-status');

        function renderBoxes() {
            boxes.innerHTML = '';
            DATA.forEach((v, i) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `
                    <div class="str-char-idx">${i}</div>
                    <div class="str-char-val">${v}</div>
                `;
                boxes.appendChild(box);
            });
        }

        function setBoxState(idx, cls) {
            const box = boxes.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function saveState() {
            return {
                boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(b => b.className),
                pointer: pointerInfo.innerHTML,
                sum: sumDisplay.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxClasses[i]; });
            pointerInfo.innerHTML = s.pointer;
            sumDisplay.innerHTML = s.sum;
            statusEl.innerHTML = s.status;
        }

        renderBoxes();

        container.querySelector('#arr-viz-start').addEventListener('click', function() {
            self._clearVizState();
            renderBoxes();

            const target = parseInt(container.querySelector('#arr-target').value) || 9;
            pointerInfo.textContent = '';
            sumDisplay.textContent = '—';
            statusEl.textContent = '탐색 준비 완료';

            let left = 0, right = DATA.length - 1;
            const steps = [];
            let found = false;

            while (left < right) {
                const l = left, r = right;
                const s = DATA[l] + DATA[r];
                const match = s === target;
                const tooSmall = s < target;

                steps.push({
                    description: `left=${l}(${DATA[l]}) + right=${r}(${DATA[r]}) = ${s} ${match ? '= ' + target + ' 찾음!' : tooSmall ? '< ' + target + ' → left++' : '> ' + target + ' → right--'}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let i = 0; i < DATA.length; i++) setBoxState(i, '');
                        setBoxState(l, match ? 'matched' : 'comparing');
                        setBoxState(r, match ? 'matched' : 'comparing');
                        pointerInfo.innerHTML = `<span style="color:var(--green);">L→ ${l}</span> &nbsp;&nbsp; <span style="color:var(--accent);">R→ ${r}</span>`;
                        sumDisplay.innerHTML = `${DATA[l]} + ${DATA[r]} = <strong>${s}</strong>`;
                        if (match) {
                            statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">✓ 찾았습니다! ${DATA[l]} + ${DATA[r]} = ${target}</span>`;
                        } else if (tooSmall) {
                            statusEl.innerHTML = `${s} < ${target} → <span style="color:var(--green);">left를 오른쪽으로!</span>`;
                        } else {
                            statusEl.innerHTML = `${s} > ${target} → <span style="color:var(--accent);">right를 왼쪽으로!</span>`;
                        }
                    },
                    undo: function() { restoreState(this._before); }
                });

                if (match) { found = true; break; }
                if (tooSmall) left++;
                else right--;
            }

            if (!found) {
                steps.push({
                    description: `합이 ${target}인 두 수를 찾을 수 없습니다.`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        statusEl.innerHTML = '<span style="color:var(--red,#e17055);">✗ 찾을 수 없습니다</span>';
                    },
                    undo: function() { restoreState(this._before); }
                });
            }

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls() {
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button>
                <span id="viz-step-counter" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>
        `;
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { counter.textContent = `Step ${idx + 1} / ${total}`; desc.textContent = state.steps[idx].description; }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
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

    // ===== 문제풀이 탭 =====
    stages: [
        { num: 1, title: '배열 기본', desc: '한 번 순회, 투 포인터 기본 (Easy~Silver)', problemIds: ['lc-1', 'lc-121'] },
        { num: 2, title: '배열 심화', desc: '투 포인터 심화, 전처리 (Medium~Gold)', problemIds: ['lc-15', 'boj-2003'] }
    ],

    problems: [
        {
            id: 'lc-1',
            title: 'LeetCode 1 - Two Sum',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/two-sum/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>와 정수 <code>target</code>이 주어집니다.
                합이 <code>target</code>이 되는 <strong>두 수의 인덱스</strong>를 반환하세요.</p>
                <p>같은 원소를 두 번 사용할 수 없고, 정답은 정확히 하나 존재합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>nums = [2,7,11,15], target = 9</p></div>
                    <div><h4>출력</h4><p>[0, 1]  (nums[0]+nums[1]=2+7=9)</p></div>
                </div>
            `,
            hints: [
                { title: '브루트 포스', content: '이중 for문으로 모든 쌍을 확인하면 O(n²)에 풀 수 있습니다. 하지만 더 빠른 방법이 있습니다!' },
                { title: '해시맵 활용', content: '순회하면서 <code>target - nums[i]</code>가 이미 해시맵에 있는지 확인합니다. 있으면 바로 정답!' },
                { title: '시간 복잡도', content: '해시맵 풀이: O(n) 시간, O(n) 공간. 한 번 순회로 끝!' }
            ],
            inputDefault: 0,
            solve() { return '[0, 1]'; },
            templates: {
                python: `class Solution:
    def twoSum(self, nums, target):
        seen = {}  # 값 → 인덱스
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
                cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
                java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (seen.containsKey(comp)) return new int[]{seen.get(comp), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
            }
        },
        {
            id: 'lc-121',
            title: 'LeetCode 121 - Best Time to Buy and Sell Stock',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>주식 가격 배열 <code>prices</code>가 주어집니다. <code>prices[i]</code>는 i번째 날의 주가입니다.</p>
                <p>한 번 사고 한 번 팔아서 얻을 수 있는 <strong>최대 이익</strong>을 반환하세요.
                이익을 낼 수 없으면 0을 반환합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>prices = [7, 1, 5, 3, 6, 4]</p></div>
                    <div><h4>출력</h4><p>5  (1에 사서 6에 판다)</p></div>
                </div>
            `,
            hints: [
                { title: '핵심 관찰', content: '팔기 전에 사야 합니다! 즉, <strong>앞에서 최솟값</strong>을 추적하면서 "지금 팔면 얼마?"를 계속 계산합니다.' },
                { title: '한 번 순회', content: '<code>min_price</code>를 유지하면서, 각 날의 <code>price - min_price</code>가 현재 최대 이익보다 크면 갱신합니다.' },
                { title: '시간 복잡도', content: 'O(n) 시간, O(1) 공간. 변수 2개만으로 해결!' }
            ],
            inputDefault: 0,
            solve() { return '5'; },
            templates: {
                python: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
                cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = INT_MAX, maxP = 0;
        for (int p : prices) {
            minP = min(minP, p);
            maxP = max(maxP, p - minP);
        }
        return maxP;
    }
};`,
                java: `class Solution {
    public int maxProfit(int[] prices) {
        int minP = Integer.MAX_VALUE, maxP = 0;
        for (int p : prices) {
            minP = Math.min(minP, p);
            maxP = Math.max(maxP, p - minP);
        }
        return maxP;
    }
}`
            }
        },
        {
            id: 'lc-15',
            title: 'LeetCode 15 - 3Sum',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/3sum/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정수 배열 <code>nums</code>에서 합이 0이 되는 <strong>세 수의 조합</strong>을 모두 찾으세요.</p>
                <p>중복되는 조합은 제거해야 합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>nums = [-1, 0, 1, 2, -1, -4]</p></div>
                    <div><h4>출력</h4><p>[[-1, -1, 2], [-1, 0, 1]]</p></div>
                </div>
            `,
            hints: [
                { title: '정렬이 핵심!', content: '먼저 배열을 정렬합니다. 그러면 중복 제거와 투 포인터 사용이 모두 쉬워집니다!' },
                { title: '하나 고정 + 투 포인터', content: 'i를 고정하고, <code>left=i+1</code>, <code>right=n-1</code>로 투 포인터. 세 수의 합이 0보다 크면 right--, 작으면 left++.' },
                { title: '중복 제거', content: '같은 값의 i는 건너뜁니다: <code>if i > 0 and nums[i] == nums[i-1]: continue</code>. left/right도 마찬가지!' }
            ],
            inputDefault: 0,
            solve() { return '[[-1, -1, 2], [-1, 0, 1]]'; },
            templates: {
                python: `class Solution:
    def threeSum(self, nums):
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # 중복 건너뛰기
            left, right = i + 1, len(nums) - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]: left += 1
                    while left < right and nums[right] == nums[right - 1]: right -= 1
                    left += 1; right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1
        return result`,
                cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`,
                java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
}`
            }
        },
        {
            id: 'boj-2003',
            title: 'BOJ 2003 - 수들의 합 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2003',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 수로 이루어진 수열에서, 연속된 수들의 부분합 중 합이 M이 되는 경우의 수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N M (1&le;N&le;10,000, 1&le;M&le;300,000,000)<br>
                    둘째 줄: N개의 자연수</p></div>
                    <div><h4>출력</h4><p>합이 M이 되는 부분합의 개수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2\n1 1 1 1</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
            `,
            hints: [
                { title: '투 포인터/슬라이딩 윈도우', content: '<code>start</code>와 <code>end</code> 두 포인터를 둡니다. 합이 M보다 작으면 end를 늘리고, 크거나 같으면 start를 줄입니다.' },
                { title: '핵심 아이디어', content: '구간 합이 M이면 카운트 증가! 그리고 start를 한 칸 오른쪽으로 이동시켜서 다음 경우를 찾습니다.' },
                { title: '시간 복잡도', content: 'O(n). start와 end 모두 최대 n번만 이동하므로 전체 2n번 연산!' }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

start, end = 0, 0
current_sum = 0
count = 0

while True:
    if current_sum >= M:
        current_sum -= arr[start]
        start += 1
    elif end >= N:
        break
    else:
        current_sum += arr[end]
        end += 1

    if current_sum == M:
        count += 1

print(count)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<int> arr(N);
    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);

    int s = 0, e = 0, sum = 0, cnt = 0;
    while (true) {
        if (sum >= M) sum -= arr[s++];
        else if (e >= N) break;
        else sum += arr[e++];
        if (sum == M) cnt++;
    }
    printf("%d\\n", cnt);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int[] arr = new int[N];
        st = new StringTokenizer(br.readLine());
        for (int i = 0; i < N; i++) arr[i] = Integer.parseInt(st.nextToken());

        int s = 0, e = 0, sum = 0, cnt = 0;
        while (true) {
            if (sum >= M) sum -= arr[s++];
            else if (e >= N) break;
            else sum += arr[e++];
            if (sum == M) cnt++;
        }
        System.out.println(cnt);
    }
}`
            }
        }
    ],

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
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
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
        backBtn.className = 'btn'; backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
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
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) { openedState[idx] = true; if (idx + 1 < problem.hints.length) { const ns = hintsDiv.children[idx + 1]; if (ns) ns.classList.remove('locked'); } }
            });
            hintsDiv.appendChild(step);
        });
        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div>
            <div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => { if (window.hljs) hljs.highlightElement(codeEl); });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
        });

        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });
        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.array = arrayTopic;
