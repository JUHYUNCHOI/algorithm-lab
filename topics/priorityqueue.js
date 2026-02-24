// ===== 우선순위 큐 토픽 모듈 =====
const priorityQueueTopic = {
    id: 'priorityqueue',
    title: '우선순위 큐',
    icon: '🏥',
    category: '알고리즘',
    order: 6,
    description: '가장 중요한 것부터 꺼내는 자료구조',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🏥 우선순위 큐 (Priority Queue)</h2>
                <p class="hero-sub">가장 중요한 것부터 먼저 꺼내는 특별한 줄서기입니다</p>
            </div>

            <!-- ① 우선순위 큐란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 우선순위 큐란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 응급실에서는 먼저 온 사람이 아니라, <strong>가장 위급한 환자</strong>부터 치료합니다.<br><br>
                    편의점 계산대에서는 먼저 온 순서대로 계산하지요? (FIFO)<br>
                    하지만 응급실에서는 감기 환자보다 골절 환자가 먼저, 골절 환자보다 심정지 환자가 먼저입니다!<br><br>
                    이처럼 <strong>우선순위가 높은 것부터 먼저 꺼내는</strong> 자료구조가 바로 <strong>우선순위 큐</strong>입니다.<br>
                    넣을 때는 아무 순서로 넣어도 되지만, 꺼낼 때는 항상 <strong>가장 우선순위가 높은 것</strong>이 나옵니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="18" width="40" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="24" r="3" fill="currentColor"/><circle cx="22" cy="24" r="3" fill="currentColor"/><circle cx="32" cy="24" r="3" fill="currentColor"/><path d="M40 24l6-4M40 24l6 4" stroke="currentColor" stroke-width="2" fill="none"/></svg></span></div>
                        <h3>일반 큐 (FIFO)</h3>
                        <p>먼저 들어온 것이 먼저 나갑니다.<br>편의점 계산대처럼 순서대로!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="14" width="40" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="12" y="28" font-size="10" font-weight="bold" fill="currentColor">3</text><text x="22" y="28" font-size="10" font-weight="bold" fill="currentColor">1</text><text x="32" y="28" font-size="14" font-weight="bold" fill="#e74c3c">★</text><path d="M40 24l6-4M40 24l6 4" stroke="#e74c3c" stroke-width="2.5" fill="none"/></svg></span></div>
                        <h3>우선순위 큐</h3>
                        <p>우선순위가 높은 것이 먼저 나갑니다.<br>응급실처럼 위급한 순서대로!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">응급실에 감기(위험도 1), 골절(위험도 5), 심정지(위험도 10) 환자가 왔습니다. 어떤 순서로 치료할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        심정지(10) → 골절(5) → 감기(1) 순서입니다!<br>
                        이것이 바로 <strong>최대 우선순위 큐</strong>입니다. 숫자가 클수록 먼저 나옵니다.<br>
                        반대로 숫자가 작을수록 먼저 나오는 것은 <strong>최소 우선순위 큐</strong>입니다.
                    </div>
                </div>
            </div>

            <!-- ② 힙(Heap)의 구조 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 힙(Heap)의 구조</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 힙은 <strong>완전 이진 트리</strong>라는 특별한 나무 모양입니다.<br>
                    회사 조직도를 생각해 보세요! 사장님이 맨 위에, 그 아래에 부장님들, 그 아래에 과장님들...<br><br>
                    <strong>최소 힙</strong>에서는 부모가 항상 자식보다 작습니다.<br>
                    즉, 맨 위(루트)에 항상 <strong>가장 작은 값</strong>이 있습니다!
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="36" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="20" y1="15" x2="15" y2="25" stroke="currentColor" stroke-width="2"/><line x1="28" y1="15" x2="33" y2="25" stroke="currentColor" stroke-width="2"/></svg></span></div>
                        <h3>완전 이진 트리</h3>
                        <p>왼쪽부터 빈틈없이 채우는<br>이진 트리입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="#00b894" stroke-width="2.5"/><text x="24" y="14" text-anchor="middle" font-size="9" font-weight="bold" fill="#00b894">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">3</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">5</text><line x1="20" y1="15" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>힙 속성</h3>
                        <p>최소 힙: 부모 ≤ 자식<br>루트가 항상 최솟값!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="2" y="18" width="44" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="10" y="28" font-size="8" font-weight="bold" fill="currentColor">1</text><text x="20" y="28" font-size="8" font-weight="bold" fill="currentColor">3</text><text x="30" y="28" font-size="8" font-weight="bold" fill="currentColor">5</text><text x="40" y="28" font-size="8" font-weight="bold" fill="currentColor">7</text><text x="10" y="14" font-size="7" fill="currentColor">0</text><text x="20" y="14" font-size="7" fill="currentColor">1</text><text x="30" y="14" font-size="7" fill="currentColor">2</text><text x="40" y="14" font-size="7" fill="currentColor">3</text></svg></span></div>
                        <h3>배열로 저장</h3>
                        <p>부모 = i//2<br>왼쪽 자식 = 2*i, 오른쪽 = 2*i+1</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 힙을 배열로 저장하기 (1-indexed)
#
#        1          <- 인덱스 1 (루트)
#       / \\
#      3    5       <- 인덱스 2, 3
#     / \\  /
#    7   9 8       <- 인덱스 4, 5, 6
#
# 배열: [-, 1, 3, 5, 7, 9, 8]  (0번 인덱스는 사용 안 함)
#
# 부모 인덱스:    i // 2
# 왼쪽 자식:      i * 2
# 오른쪽 자식:    i * 2 + 1</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">배열 [-, 2, 5, 3, 8, 7]에서 인덱스 2(값 5)의 부모와 자식은 무엇일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        부모 = 2 // 2 = <strong>인덱스 1 → 값 2</strong><br>
                        왼쪽 자식 = 2 × 2 = <strong>인덱스 4 → 값 8</strong><br>
                        오른쪽 자식 = 2 × 2 + 1 = <strong>인덱스 5 → 값 7</strong>
                    </div>
                </div>
            </div>

            <!-- ③ 힙의 동작: 삽입과 삭제 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 힙의 동작: 삽입과 삭제</div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card" style="border-left:4px solid var(--green)">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><path d="M24 36V12" stroke="#00b894" stroke-width="3" fill="none"/><path d="M16 20l8-8 8 8" stroke="#00b894" stroke-width="3" fill="none"/></svg></span></div>
                        <h3>삽입 (Push) — 위로 올라가기</h3>
                        <p>
                            ① 배열 맨 끝에 새 값을 추가합니다<br>
                            ② 부모와 비교합니다<br>
                            ③ 부모보다 작으면 교환! (최소 힙)<br>
                            ④ 루트까지 반복합니다 (Sift-Up)
                        </p>
                    </div>
                    <div class="concept-card" style="border-left:4px solid var(--red)">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><path d="M24 12V36" stroke="#e74c3c" stroke-width="3" fill="none"/><path d="M16 28l8 8 8-8" stroke="#e74c3c" stroke-width="3" fill="none"/></svg></span></div>
                        <h3>삭제 (Pop) — 아래로 내려가기</h3>
                        <p>
                            ① 루트(최솟값)를 꺼냅니다<br>
                            ② 마지막 원소를 루트로 이동합니다<br>
                            ③ 더 작은 자식과 비교합니다<br>
                            ④ 자식보다 크면 교환! (Sift-Down)
                        </p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 최소 힙 삽입 (Sift-Up)
def push(heap, val):
    heap.append(val)
    i = len(heap) - 1
    while i > 1 and heap[i] < heap[i // 2]:
        heap[i], heap[i // 2] = heap[i // 2], heap[i]
        i = i // 2

# 최소 힙 삭제 (Sift-Down)
def pop(heap):
    if len(heap) <= 1:
        return None
    root = heap[1]
    heap[1] = heap[-1]
    heap.pop()
    i = 1
    while i * 2 < len(heap):
        child = i * 2
        # 오른쪽 자식이 더 작으면 오른쪽 선택
        if child + 1 < len(heap) and heap[child + 1] < heap[child]:
            child += 1
        if heap[i] > heap[child]:
            heap[i], heap[child] = heap[child], heap[i]
            i = child
        else:
            break
    return root</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">최소 힙 [-, 1, 3, 5, 7]에 2를 삽입하면 어떻게 될까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        ① 끝에 추가: [-, 1, 3, 5, 7, <strong>2</strong>] (인덱스 5)<br>
                        ② 부모(인덱스 2) = 3, 2 < 3이므로 교환!<br>
                        → [-, 1, <strong>2</strong>, 5, 7, <strong>3</strong>]<br>
                        ③ 부모(인덱스 1) = 1, 2 > 1이므로 끝!<br>
                        결과: [-, 1, 2, 5, 7, 3]
                    </div>
                </div>
            </div>

            <!-- ④ 파이썬의 heapq 사용법 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 파이썬의 heapq 사용법</div>

                <div class="code-block"><pre><code class="language-python">import heapq

# ===== 기본 사용법 (최소 힙) =====
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
print(heapq.heappop(heap))  # 1 (가장 작은 값)
print(heapq.heappop(heap))  # 3
print(heapq.heappop(heap))  # 5

# ===== 최대 힙 트릭 =====
# Python heapq는 최소 힙만 지원합니다!
# -1을 곱해서 넣으면 최대 힙처럼 동작합니다.
max_heap = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -1)
heapq.heappush(max_heap, -3)
print(-heapq.heappop(max_heap))  # 5 (가장 큰 값!)

# ===== 튜플로 정렬 기준 바꾸기 =====
# 절댓값이 작은 순, 같으면 실제 값이 작은 순
abs_heap = []
heapq.heappush(abs_heap, (abs(-3), -3))  # (3, -3)
heapq.heappush(abs_heap, (abs(2), 2))    # (2, 2)
heapq.heappush(abs_heap, (abs(-1), -1))  # (1, -1)
val = heapq.heappop(abs_heap)  # (1, -1) → 절댓값 1인 -1이 먼저!</code></pre></div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><text x="24" y="30" text-anchor="middle" font-size="24" fill="currentColor">⬆</text></svg></span></div>
                        <h3>heappush / heappop</h3>
                        <p>둘 다 O(log N)입니다.<br>Python heapq는 항상 <strong>최소 힙</strong>입니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><text x="24" y="30" text-anchor="middle" font-size="24" fill="currentColor">🔄</text></svg></span></div>
                        <h3>최대 힙 트릭</h3>
                        <p>값에 <strong>-1을 곱해서</strong> 넣고,<br>꺼낼 때 다시 -1을 곱합니다!</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">heapq로 절댓값이 가장 작은 수를 먼저 꺼내려면 어떻게 해야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>(abs(x), x)</strong> 튜플을 넣으면 됩니다!<br>
                        튜플은 첫 번째 원소부터 비교하므로, 절댓값이 작은 것이 먼저 나옵니다.<br>
                        절댓값이 같으면? 두 번째 원소(실제 값)가 작은 것이 먼저 나옵니다.<br>
                        이것이 바로 <strong>BOJ 11286 절댓값 힙</strong>의 핵심입니다!
                    </div>
                </div>
            </div>

            <!-- ⑤ 우선순위 큐 문제 푸는 팁 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 우선순위 큐 문제 푸는 팁</div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">1</text><circle cx="14" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="34" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="19" y1="18" x2="16" y2="27" stroke="currentColor" stroke-width="1.5"/><line x1="29" y1="18" x2="32" y2="27" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>① 기본 힙 연산</h3>
                        <p>heappush/heappop으로<br>최대·최소·절댓값 힙을<br>구현합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="currentColor">Top K</text></svg></span></div>
                        <h3>② 크기 제한 힙</h3>
                        <p>힙 크기를 N개로 유지하여<br><strong>N번째 큰 수</strong>를<br>효율적으로 구합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="16" cy="20" r="10" fill="none" stroke="#6c5ce7" stroke-width="2"/><circle cx="32" cy="20" r="10" fill="none" stroke="#00b894" stroke-width="2"/><text x="16" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="#6c5ce7">MAX</text><text x="32" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="#00b894">MIN</text><text x="24" y="40" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">중앙값</text></svg></span></div>
                        <h3>③ 두 개의 힙</h3>
                        <p>최대 힙 + 최소 힙으로<br><strong>중앙값</strong>을 실시간으로<br>구합니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">보석 도둑 문제에서 왜 그리디 + 힙이 필요할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        가방을 <strong>용량이 작은 순서</strong>로 처리합니다.<br>
                        각 가방에 들어갈 수 있는 보석들을 <strong>최대 힙</strong>에 넣고, 가장 비싼 것을 꺼냅니다.<br><br>
                        작은 가방에 넣을 수 있는 보석은 큰 가방에도 넣을 수 있으므로,<br>
                        한 번 힙에 넣은 보석은 다시 빼지 않아도 됩니다!<br>
                        이것이 <strong>그리디 + 힙</strong>의 핵심 아이디어입니다.
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
                <button class="viz-tab active" data-viz="minheap">최소 힙 삽입/삭제</button>
                <button class="viz-tab" data-viz="median">두 개의 힙으로 중앙값</button>
            </div>
            <div id="pq-viz-content"></div>
        `;

        const vizContent = container.querySelector('#pq-viz-content');
        const tabs = container.querySelectorAll('.viz-tab');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                self._clearVizState();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.viz === 'minheap') self._renderVizMinHeap(vizContent);
                else self._renderVizMedian(vizContent);
            });
        });

        this._renderVizMinHeap(vizContent);
    },

    // ===== 최소 힙 삽입/삭제 시각화 =====
    _renderVizMinHeap(container) {
        // 1-indexed min-heap: index 0 unused
        let heap = [null, 3, 5, 7, 9, 8];
        const INITIAL_HEAP = [null, 3, 5, 7, 9, 8];

        container.innerHTML = `
            <div class="viz-card">
                <h3>최소 힙 삽입/삭제</h3>
                <p style="color:var(--text2);margin-bottom:12px;">숫자를 삽입하거나 최솟값을 삭제하면서 힙의 동작을 관찰합니다.</p>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">
                    <label>값: <input type="number" id="pq-insert-val" value="2" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <button class="btn btn-primary" id="pq-insert-btn">삽입</button>
                    <button class="btn" id="pq-delete-btn" style="background:var(--red);color:#fff;">삭제 (최솟값)</button>
                    <button class="btn" id="pq-reset-btn">초기화</button>
                </div>
                <div class="pq-tree-container" id="pq-tree" style="position:relative;min-height:260px;overflow:hidden;">
                    <svg id="pq-edges" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></svg>
                </div>
                <div class="pq-array-row" id="pq-array" style="display:flex;justify-content:center;gap:4px;flex-wrap:wrap;margin:12px 0;padding:8px;background:var(--bg);border-radius:8px;"></div>
                <div id="pq-info" style="margin-top:8px;padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;font-weight:600;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;
        const treeEl = container.querySelector('#pq-tree');
        const edgesEl = container.querySelector('#pq-edges');
        const arrayEl = container.querySelector('#pq-array');
        const infoEl = container.querySelector('#pq-info');

        function getNodePos(idx, w) {
            if (idx < 1) return { x: 0, y: 0 };
            const level = Math.floor(Math.log2(idx));
            const posInLevel = idx - Math.pow(2, level);
            const nodesInLevel = Math.pow(2, level);
            const x = w * (posInLevel + 1) / (nodesInLevel + 1);
            const y = 30 + level * 70;
            return { x, y };
        }

        function renderTree(h, highlights) {
            highlights = highlights || {};
            const w = treeEl.clientWidth || 500;
            // Remove old nodes
            treeEl.querySelectorAll('.pq-node').forEach(n => n.remove());
            // Draw edges
            let edgeSvg = '';
            for (let i = 2; i < h.length; i++) {
                const parent = Math.floor(i / 2);
                const pPos = getNodePos(parent, w);
                const cPos = getNodePos(i, w);
                const cls = (highlights[i] === 'swapping' || highlights[parent] === 'swapping') ? 'pq-edge active' : 'pq-edge';
                edgeSvg += `<line x1="${pPos.x}" y1="${pPos.y}" x2="${cPos.x}" y2="${cPos.y}" class="${cls}" stroke="var(--border)" stroke-width="2"/>`;
            }
            edgesEl.innerHTML = edgeSvg;

            // Draw nodes
            for (let i = 1; i < h.length; i++) {
                const pos = getNodePos(i, w);
                const node = document.createElement('div');
                node.className = 'pq-node' + (highlights[i] ? ' ' + highlights[i] : '');
                node.style.left = (pos.x - 24) + 'px';
                node.style.top = (pos.y - 24) + 'px';
                node.textContent = h[i];
                node.id = 'pq-n-' + i;
                treeEl.appendChild(node);
            }
        }

        function renderArray(h, highlights) {
            highlights = highlights || {};
            let html = '';
            for (let i = 1; i < h.length; i++) {
                const cls = highlights[i] ? ' ' + highlights[i] : '';
                html += `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
                    <div class="pq-array-cell${cls}" style="width:42px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid var(--border);border-radius:6px;font-weight:600;font-size:0.85rem;">${h[i]}</div>
                    <div style="font-size:0.7rem;color:var(--text-secondary);">${i}</div>
                </div>`;
            }
            arrayEl.innerHTML = html;
        }

        function renderAll(h, highlights, msg) {
            renderTree(h, highlights);
            renderArray(h, highlights);
            if (msg !== undefined) infoEl.innerHTML = msg;
        }

        // Initial render
        renderAll(heap, {}, '힙: [' + heap.slice(1).join(', ') + '] — 삽입 또는 삭제를 눌러보세요.');

        // Insert
        container.querySelector('#pq-insert-btn').addEventListener('click', () => {
            self._clearVizState();
            const val = parseInt(container.querySelector('#pq-insert-val').value);
            if (isNaN(val)) return;

            // Clone heap and compute sift-up steps
            const h = heap.slice();
            h.push(val);
            let idx = h.length - 1;
            const swaps = [];
            while (idx > 1) {
                const parent = Math.floor(idx / 2);
                if (h[idx] < h[parent]) {
                    swaps.push({ child: idx, parent: parent, childVal: h[idx], parentVal: h[parent] });
                    const tmp = h[idx]; h[idx] = h[parent]; h[parent] = tmp;
                    idx = parent;
                } else {
                    break;
                }
            }

            // Build steps
            const steps = [];
            const snapshots = [];
            // snapshot 0: before insert
            snapshots.push(heap.slice());

            // Step 0: add to end
            const afterAdd = heap.slice();
            afterAdd.push(val);
            snapshots.push(afterAdd.slice());
            steps.push({
                description: `값 ${val}을(를) 배열 끝(인덱스 ${afterAdd.length - 1})에 추가합니다.`,
                action() {
                    renderAll(afterAdd, { [afterAdd.length - 1]: 'inserted' },
                        `배열 끝에 ${val} 추가! 이제 부모와 비교합니다.`);
                },
                undo() {
                    renderAll(snapshots[0], {}, '삽입 전 상태로 되돌립니다.');
                }
            });

            // Swap steps
            let simHeap = afterAdd.slice();
            let curIdx = afterAdd.length - 1;
            for (let s = 0; s < swaps.length; s++) {
                const swap = swaps[s];
                const beforeSwap = simHeap.slice();
                const parentIdx = swap.parent;
                const childIdx = swap.child - s * 0; // compute correctly
                // Perform swap on simHeap
                const ci = curIdx;
                const pi = Math.floor(ci / 2);
                const cVal = simHeap[ci];
                const pVal = simHeap[pi];
                const tmp2 = simHeap[ci]; simHeap[ci] = simHeap[pi]; simHeap[pi] = tmp2;
                const afterSwap = simHeap.slice();
                const nextIdx = pi;

                steps.push({
                    description: `${cVal} < 부모(${pVal})이므로 교환합니다! (인덱스 ${ci} ↔ ${pi})`,
                    action() {
                        renderAll(afterSwap, { [ci]: 'swapping', [pi]: 'swapping' },
                            `${cVal}과 ${pVal}을 교환! ${nextIdx === 1 ? '루트에 도달했습니다.' : '계속 올라갑니다...'}`);
                    },
                    undo() {
                        renderAll(beforeSwap, { [ci]: 'active' },
                            `교환 전 상태로 되돌립니다.`);
                    }
                });
                curIdx = nextIdx;
            }

            // Final step
            const finalHeap = simHeap.slice();
            steps.push({
                description: `삽입 완료! 힙 속성이 유지됩니다.`,
                action() {
                    heap = finalHeap.slice();
                    renderAll(heap, {}, `✅ 삽입 완료! 힙: [${heap.slice(1).join(', ')}]`);
                },
                undo() {
                    const prev = steps.length >= 3 ? simHeap : afterAdd;
                    renderAll(simHeap, {}, '삽입 완료 전 상태입니다.');
                }
            });

            self._initStepController(container, steps);
        });

        // Delete
        container.querySelector('#pq-delete-btn').addEventListener('click', () => {
            self._clearVizState();
            if (heap.length <= 1) {
                infoEl.innerHTML = '❌ 힙이 비어있습니다!';
                return;
            }

            const rootVal = heap[1];
            const lastVal = heap[heap.length - 1];
            const origHeap = heap.slice();

            // Simulate sift-down
            const h = heap.slice();
            h[1] = h[h.length - 1];
            h.pop();
            const swaps = [];
            let idx = 1;
            const hCopy = h.slice();
            while (idx * 2 < hCopy.length) {
                let child = idx * 2;
                if (child + 1 < hCopy.length && hCopy[child + 1] < hCopy[child]) child = child + 1;
                if (hCopy[idx] > hCopy[child]) {
                    swaps.push({ parent: idx, child: child, parentVal: hCopy[idx], childVal: hCopy[child] });
                    const tmp = hCopy[idx]; hCopy[idx] = hCopy[child]; hCopy[child] = tmp;
                    idx = child;
                } else {
                    break;
                }
            }

            const steps = [];

            // Step 0: remove root
            steps.push({
                description: `루트(최솟값 ${rootVal})를 꺼냅니다.`,
                action() {
                    renderAll(origHeap, { 1: 'removed' },
                        `루트 ${rootVal}을(를) 꺼냅니다!`);
                },
                undo() {
                    renderAll(origHeap, {}, '삭제 전 상태입니다.');
                }
            });

            // Step 1: move last to root
            const afterMove = origHeap.slice();
            afterMove[1] = afterMove[afterMove.length - 1];
            afterMove.pop();
            steps.push({
                description: `마지막 원소(${lastVal})를 루트로 이동합니다.`,
                action() {
                    renderAll(afterMove, { 1: 'inserted' },
                        `${lastVal}을(를) 루트로 이동! 이제 자식과 비교합니다.`);
                },
                undo() {
                    renderAll(origHeap, { 1: 'removed' },
                        `루트 ${rootVal}을(를) 꺼냅니다!`);
                }
            });

            // Sift-down swap steps
            let simHeap2 = afterMove.slice();
            let curIdx2 = 1;
            for (let s = 0; s < swaps.length; s++) {
                const beforeSwap = simHeap2.slice();
                const pi = curIdx2;
                let ci = pi * 2;
                if (ci + 1 < simHeap2.length && simHeap2[ci + 1] < simHeap2[ci]) ci = ci + 1;
                const pVal = simHeap2[pi];
                const cVal = simHeap2[ci];
                const tmp3 = simHeap2[pi]; simHeap2[pi] = simHeap2[ci]; simHeap2[ci] = tmp3;
                const afterSwap = simHeap2.slice();
                const nextIdx = ci;

                steps.push({
                    description: `${pVal} > 자식(${cVal})이므로 교환합니다! (인덱스 ${pi} ↔ ${ci})`,
                    action() {
                        renderAll(afterSwap, { [pi]: 'swapping', [ci]: 'swapping' },
                            `${pVal}과 ${cVal}을 교환!`);
                    },
                    undo() {
                        renderAll(beforeSwap, { [pi]: 'active' },
                            `교환 전 상태로 되돌립니다.`);
                    }
                });
                curIdx2 = nextIdx;
            }

            // Final step
            const finalHeap2 = simHeap2.slice();
            steps.push({
                description: `삭제 완료! 꺼낸 값: ${rootVal}`,
                action() {
                    heap = finalHeap2.slice();
                    renderAll(heap, {},
                        `✅ 삭제 완료! 꺼낸 값: ${rootVal}. 힙: [${heap.slice(1).join(', ')}]`);
                },
                undo() {
                    renderAll(simHeap2, {}, '삭제 완료 전 상태입니다.');
                }
            });

            self._initStepController(container, steps);
        });

        // Reset
        container.querySelector('#pq-reset-btn').addEventListener('click', () => {
            self._clearVizState();
            heap = INITIAL_HEAP.slice();
            renderAll(heap, {}, '힙: [' + heap.slice(1).join(', ') + '] — 초기 상태로 돌아왔습니다.');
            const counter = container.querySelector('#viz-step-counter');
            const desc = container.querySelector('#viz-step-desc');
            const prevBtn = container.querySelector('#viz-prev');
            const nextBtn = container.querySelector('#viz-next');
            if (counter) counter.textContent = '시작 전';
            if (desc) desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
        });
    },

    // ===== 두 개의 힙으로 중앙값 시각화 =====
    _renderVizMedian(container) {
        container.innerHTML = `
            <div class="viz-card">
                <h3>두 개의 힙으로 중앙값 구하기</h3>
                <p style="color:var(--text2);margin-bottom:12px;">숫자를 하나씩 넣으면서, 최대 힙과 최소 힙으로 중앙값을 실시간으로 구합니다.</p>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">
                    <label>입력 수열: <input type="text" id="pq-median-input" value="1 5 2 8 3" style="width:160px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>
                    <button class="btn btn-primary" id="pq-median-start">시작</button>
                </div>
                <div class="pq-heap-pair" id="pq-heap-pair" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:12px;">
                    <div>
                        <div class="pq-heap-label" style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:8px;">최대 힙 (작은 절반)</div>
                        <div id="pq-maxheap-display" style="min-height:60px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div>
                    </div>
                    <div>
                        <div class="pq-heap-label" style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:8px;">최소 힙 (큰 절반)</div>
                        <div id="pq-minheap-display" style="min-height:60px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div>
                    </div>
                </div>
                <div id="pq-median-value" style="text-align:center;font-size:1.3rem;font-weight:800;padding:12px;background:linear-gradient(135deg,rgba(108,92,231,0.08),rgba(0,184,148,0.08));border:2px solid var(--primary);border-radius:12px;margin-bottom:12px;">현재 중앙값: ?</div>
                <div id="pq-median-info" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;font-weight:600;"></div>
                ${this._createStepControls()}
            </div>
        `;

        const self = this;
        const maxHeapEl = container.querySelector('#pq-maxheap-display');
        const minHeapEl = container.querySelector('#pq-minheap-display');
        const medianEl = container.querySelector('#pq-median-value');
        const infoEl = container.querySelector('#pq-median-info');

        function renderHeapBubbles(el, arr, color, isMax) {
            if (arr.length === 0) {
                el.innerHTML = '<span style="color:var(--text-secondary);font-size:0.85rem;">비어있음</span>';
                return;
            }
            // Show sorted for readability
            const sorted = arr.slice().sort((a, b) => isMax ? b - a : a - b);
            el.innerHTML = sorted.map((v, i) =>
                `<span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:${i === 0 ? color : 'var(--bg)'};border:2px solid ${color};color:${i === 0 ? '#fff' : 'var(--text)'};font-weight:700;font-size:0.9rem;${i === 0 ? 'transform:scale(1.15);box-shadow:0 0 8px ' + color + ';' : ''}">${v}</span>`
            ).join('');
        }

        function renderState(maxH, minH, median, highlighted) {
            renderHeapBubbles(maxHeapEl, maxH, 'var(--primary)', true);
            renderHeapBubbles(minHeapEl, minH, 'var(--green)', false);
            if (median !== null && median !== undefined) {
                medianEl.innerHTML = `현재 중앙값: <span style="color:var(--primary);font-size:1.5rem;">${median}</span>`;
            } else {
                medianEl.innerHTML = '현재 중앙값: ?';
            }
        }

        renderState([], [], null);
        infoEl.innerHTML = '수열을 입력하고 시작을 누르세요.';

        container.querySelector('#pq-median-start').addEventListener('click', () => {
            self._clearVizState();
            const input = container.querySelector('#pq-median-input').value.trim();
            const nums = input.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
            if (nums.length === 0) return;

            // Pre-compute all states
            const states = []; // each: { maxHeap, minHeap, median, description }
            let maxH = []; // max-heap (store as positive, but conceptually max)
            let minH = []; // min-heap

            function getMedian() {
                if (maxH.length === 0) return null;
                if (maxH.length > minH.length) return Math.max(...maxH);
                return Math.max(...maxH);
            }

            function insertAndBalance(val) {
                const subSteps = [];

                // Decide where to insert
                if (maxH.length === 0 || val <= Math.max(...maxH)) {
                    maxH.push(val);
                    subSteps.push({
                        maxHeap: maxH.slice(), minHeap: minH.slice(),
                        median: null,
                        desc: `${val}을(를) 최대 힙(작은 절반)에 넣습니다.`
                    });
                } else {
                    minH.push(val);
                    subSteps.push({
                        maxHeap: maxH.slice(), minHeap: minH.slice(),
                        median: null,
                        desc: `${val}을(를) 최소 힙(큰 절반)에 넣습니다.`
                    });
                }

                // Rebalance: maxH.length should be equal to or 1 more than minH.length
                if (maxH.length > minH.length + 1) {
                    const moved = Math.max(...maxH);
                    maxH.splice(maxH.indexOf(moved), 1);
                    minH.push(moved);
                    subSteps.push({
                        maxHeap: maxH.slice(), minHeap: minH.slice(),
                        median: null,
                        desc: `크기 균형을 맞추기 위해 ${moved}을(를) 최대 힙 → 최소 힙으로 이동합니다.`
                    });
                } else if (minH.length > maxH.length) {
                    const moved = Math.min(...minH);
                    minH.splice(minH.indexOf(moved), 1);
                    maxH.push(moved);
                    subSteps.push({
                        maxHeap: maxH.slice(), minHeap: minH.slice(),
                        median: null,
                        desc: `크기 균형을 맞추기 위해 ${moved}을(를) 최소 힙 → 최대 힙으로 이동합니다.`
                    });
                }

                // Compute median
                const med = getMedian();
                subSteps[subSteps.length - 1].median = med;
                subSteps[subSteps.length - 1].desc += ` → 중앙값 = ${med}`;

                return subSteps;
            }

            // Build all steps
            const allSteps = [];
            for (let i = 0; i < nums.length; i++) {
                const subSteps = insertAndBalance(nums[i]);
                subSteps.forEach(ss => {
                    allSteps.push(ss);
                });
            }

            // Convert to step objects
            const steps = [];
            // Initial state
            const prevStates = [{ maxHeap: [], minHeap: [], median: null }];

            for (let i = 0; i < allSteps.length; i++) {
                const st = allSteps[i];
                const prevSt = i > 0 ? allSteps[i - 1] : { maxHeap: [], minHeap: [], median: null };

                steps.push({
                    description: st.desc,
                    action() {
                        renderState(st.maxHeap, st.minHeap, st.median);
                        infoEl.innerHTML = st.desc;
                    },
                    undo() {
                        renderState(prevSt.maxHeap, prevSt.minHeap, prevSt.median);
                        infoEl.innerHTML = prevSt.desc || '수열을 입력하고 시작을 누르세요.';
                    }
                });
            }

            // Final step
            const finalMedian = getMedian();
            steps.push({
                description: `완료! 최종 중앙값: ${finalMedian}`,
                action() {
                    const lastSt = allSteps[allSteps.length - 1];
                    renderState(lastSt.maxHeap, lastSt.minHeap, finalMedian);
                    infoEl.innerHTML = `✅ 모든 숫자를 넣었습니다! 최종 중앙값: ${finalMedian}`;
                },
                undo() {
                    const lastSt = allSteps[allSteps.length - 1];
                    renderState(lastSt.maxHeap, lastSt.minHeap, lastSt.median);
                    infoEl.innerHTML = lastSt.desc;
                }
            });

            self._initStepController(container, steps);
        });
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
        { num: 1, title: '기본 힙 연산', desc: '힙의 삽입과 삭제 (Silver)', problemIds: ['boj-11279', 'boj-1927', 'boj-11286'] },
        { num: 2, title: '힙 활용', desc: '힙을 활용한 문제 풀기 (Gold)', problemIds: ['boj-2075', 'boj-2696'] },
        { num: 3, title: '그리디 + 힙', desc: '그리디와 힙의 결합 (Gold II)', problemIds: ['boj-1202'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ========== 1단계: 기본 힙 연산 ==========
        {
            id: 'boj-11279',
            title: 'BOJ 11279 - 최대 힙',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11279',
            descriptionHTML: `
                <h3>문제</h3>
                <p>최대 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p>
                <p>배열에 자연수 x를 넣는다. 배열에서 가장 큰 값을 출력하고, 그 값을 배열에서 제거한다.</p>
                <p>프로그램은 처음에 비어있는 배열에서 시작합니다.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 연산의 개수 N (1 ≤ N ≤ 100,000). 다음 N개의 줄에 정수 x. x가 자연수이면 배열에 x를 넣고, x가 0이면 배열에서 가장 큰 값을 출력하고 제거합니다.</div>
                    <div><strong>출력</strong><br>입력에서 0이 주어질 때마다, 배열에서 가장 큰 값을 출력합니다. 배열이 비어 있으면 0을 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력</strong><pre>13
0
1
2
0
0
3
2
1
0
0
0
0
0</pre></div>
                    <div><strong>예제 출력</strong><pre>0
2
1
3
2
1
0
0</pre></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'Python의 heapq는 <strong>최소 힙</strong>만 지원합니다. 최대 힙을 만들려면 값에 <strong>-1을 곱해서</strong> 넣으면 됩니다!' },
                { title: '핵심 코드', content: '<code>heapq.heappush(heap, -x)</code>로 넣고, <code>-heapq.heappop(heap)</code>로 꺼내면 최대 힙처럼 동작합니다.' },
                { title: '시간 복잡도', content: '각 연산 O(log N), 전체 O(N log N)입니다.' }
            ],
            inputDefault: 13,
            solve() { return '0\n2\n1\n3\n2\n1\n0\n0'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

n = int(input())
heap = []
for _ in range(n):
    x = int(input())
    if x > 0:
        heapq.heappush(heap, -x)  # 음수로 넣어서 최대 힙
    else:
        if heap:
            print(-heapq.heappop(heap))  # 꺼낼 때 다시 음수
        else:
            print(0)`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, x;
    cin >> n;
    priority_queue<int> pq;  // 기본이 최대 힙

    while (n--) {
        cin >> x;
        if (x > 0) {
            pq.push(x);
        } else {
            if (!pq.empty()) {
                cout << pq.top() << '\\n';
                pq.pop();
            } else {
                cout << 0 << '\\n';
            }
        }
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int n = Integer.parseInt(br.readLine().trim());
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());

        for (int i = 0; i < n; i++) {
            int x = Integer.parseInt(br.readLine().trim());
            if (x > 0) {
                pq.offer(x);
            } else {
                sb.append(pq.isEmpty() ? 0 : pq.poll()).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`
            }
        },

        {
            id: 'boj-1927',
            title: 'BOJ 1927 - 최소 힙',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1927',
            descriptionHTML: `
                <h3>문제</h3>
                <p>최소 힙을 이용하여 다음과 같은 연산을 지원하는 프로그램을 작성하시오.</p>
                <p>배열에 자연수 x를 넣는다. 배열에서 가장 작은 값을 출력하고, 그 값을 배열에서 제거한다.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 연산의 개수 N (1 ≤ N ≤ 100,000). 다음 N개의 줄에 정수 x. x가 자연수이면 배열에 x를 넣고, x가 0이면 가장 작은 값을 출력하고 제거합니다.</div>
                    <div><strong>출력</strong><br>입력에서 0이 주어질 때마다, 가장 작은 값을 출력합니다. 배열이 비어 있으면 0을 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력</strong><pre>9
0
12345678
1
2
0
0
0
0
32</pre></div>
                    <div><strong>예제 출력</strong><pre>0
1
2
12345678
0</pre></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: 'Python의 heapq는 기본이 <strong>최소 힙</strong>이므로 그대로 사용하면 됩니다!' },
                { title: '핵심 코드', content: '<code>heapq.heappush(heap, x)</code>로 넣고 <code>heapq.heappop(heap)</code>로 꺼내면 됩니다.' },
                { title: '시간 복잡도', content: 'O(N log N)입니다.' }
            ],
            inputDefault: 9,
            solve() { return '0\n1\n2\n12345678\n0'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

n = int(input())
heap = []
for _ in range(n):
    x = int(input())
    if x > 0:
        heapq.heappush(heap, x)
    else:
        if heap:
            print(heapq.heappop(heap))
        else:
            print(0)`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, x;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> pq;  // 최소 힙

    while (n--) {
        cin >> x;
        if (x > 0) {
            pq.push(x);
        } else {
            if (!pq.empty()) {
                cout << pq.top() << '\\n';
                pq.pop();
            } else {
                cout << 0 << '\\n';
            }
        }
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int n = Integer.parseInt(br.readLine().trim());
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        for (int i = 0; i < n; i++) {
            int x = Integer.parseInt(br.readLine().trim());
            if (x > 0) {
                pq.offer(x);
            } else {
                sb.append(pq.isEmpty() ? 0 : pq.poll()).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`
            }
        },

        {
            id: 'boj-11286',
            title: 'BOJ 11286 - 절댓값 힙',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11286',
            descriptionHTML: `
                <h3>문제</h3>
                <p>절댓값 힙은 다음과 같은 연산을 지원하는 자료구조입니다.</p>
                <p>① 배열에 정수 x (x ≠ 0)를 넣는다.<br>② 배열에서 절댓값이 가장 작은 값을 출력하고 제거한다. 절댓값이 같으면 실제 값이 가장 작은 것을 출력하고 제거한다.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 연산의 개수 N (1 ≤ N ≤ 100,000). 다음 N개의 줄에 정수 x. x가 0이 아니면 배열에 넣고, 0이면 절댓값이 가장 작은 값을 출력합니다.</div>
                    <div><strong>출력</strong><br>입력에서 0이 주어질 때마다 답을 출력합니다. 배열이 비어 있으면 0을 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력</strong><pre>18
1
-1
0
0
0
1
1
-1
-1
2
-2
0
0
0
0
0
0
0</pre></div>
                    <div><strong>예제 출력</strong><pre>-1
1
0
-1
-1
1
1
-2
2
0</pre></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '절댓값이 같으면 실제 값이 작은 것이 먼저! <strong>튜플 (abs(x), x)</strong>를 힙에 넣으면 자동으로 해결됩니다.' },
                { title: '핵심 코드', content: '<code>heapq.heappush(heap, (abs(x), x))</code>로 넣고 <code>heapq.heappop(heap)[1]</code>로 실제 값을 꺼냅니다.' },
                { title: '시간 복잡도', content: 'O(N log N)입니다.' }
            ],
            inputDefault: 18,
            solve() { return '-1\n1\n0\n-1\n-1\n1\n1\n-2\n2\n0'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

n = int(input())
heap = []
for _ in range(n):
    x = int(input())
    if x != 0:
        heapq.heappush(heap, (abs(x), x))
    else:
        if heap:
            print(heapq.heappop(heap)[1])
        else:
            print(0)`,
                cpp: `#include <iostream>
#include <queue>
#include <cstdlib>
using namespace std;

struct cmp {
    bool operator()(int a, int b) {
        if (abs(a) == abs(b)) return a > b;
        return abs(a) > abs(b);
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, x;
    cin >> n;
    priority_queue<int, vector<int>, cmp> pq;

    while (n--) {
        cin >> x;
        if (x != 0) {
            pq.push(x);
        } else {
            if (!pq.empty()) {
                cout << pq.top() << '\\n';
                pq.pop();
            } else {
                cout << 0 << '\\n';
            }
        }
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int n = Integer.parseInt(br.readLine().trim());
        PriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> {
            if (Math.abs(a) != Math.abs(b)) return Math.abs(a) - Math.abs(b);
            return a - b;
        });

        for (int i = 0; i < n; i++) {
            int x = Integer.parseInt(br.readLine().trim());
            if (x != 0) {
                pq.offer(x);
            } else {
                sb.append(pq.isEmpty() ? 0 : pq.poll()).append('\\n');
            }
        }
        System.out.print(sb);
    }
}`
            }
        },

        // ========== 2단계: 힙 활용 ==========
        {
            id: 'boj-2075',
            title: 'BOJ 2075 - N번째 큰 수',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2075',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 표에 N²개의 수가 채워져 있습니다. 모든 수는 자기 바로 위에 있는 수보다 큽니다.</p>
                <p>이때, N번째로 큰 수를 찾으시오. 표에 채워진 수는 모두 다릅니다.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 N (1 ≤ N ≤ 1,500). 다음 N개의 줄에 각각 N개의 수가 주어집니다.</div>
                    <div><strong>출력</strong><br>N번째 큰 수를 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력</strong><pre>5
12 7 9 15 5
13 8 11 19 6
21 10 26 31 16
48 14 28 35 25
52 20 32 41 49</pre></div>
                    <div><strong>예제 출력</strong><pre>35</pre></div>
                </div>

                <p><strong>⚠ 주의:</strong> 메모리 제한이 <strong>12MB</strong>입니다! N²개를 모두 저장하면 안 됩니다.</p>
            `,
            hints: [
                { title: '접근법', content: '메모리 12MB → N²개를 다 저장할 수 없습니다! <strong>크기 N인 최소 힙</strong>을 유지하면서 하나씩 처리합니다.' },
                { title: '핵심 코드', content: '힙 크기가 N보다 작으면 <code>heappush</code>, N이면 새 값이 힙 루트보다 클 때만 <code>heapreplace</code>로 교체합니다.' },
                { title: '시간 복잡도', content: 'O(N² log N). 힙에는 항상 가장 큰 N개만 남으므로, 최종 루트가 N번째 큰 수입니다!' }
            ],
            inputDefault: 5,
            solve() { return '35'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

n = int(input())
heap = []

for _ in range(n):
    row = list(map(int, input().split()))
    for x in row:
        if len(heap) < n:
            heapq.heappush(heap, x)
        elif x > heap[0]:
            heapq.heapreplace(heap, x)

print(heap[0])  # 크기 N인 최소 힙의 루트 = N번째 큰 수`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, x;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> pq;  // 최소 힙

    for (int i = 0; i < n * n; i++) {
        cin >> x;
        if ((int)pq.size() < n) {
            pq.push(x);
        } else if (x > pq.top()) {
            pq.pop();
            pq.push(x);
        }
    }
    cout << pq.top() << endl;
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        PriorityQueue<Integer> pq = new PriorityQueue<>();

        for (int i = 0; i < n; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            while (st.hasMoreTokens()) {
                int x = Integer.parseInt(st.nextToken());
                if (pq.size() < n) {
                    pq.offer(x);
                } else if (x > pq.peek()) {
                    pq.poll();
                    pq.offer(x);
                }
            }
        }
        System.out.println(pq.peek());
    }
}`
            }
        },

        {
            id: 'boj-2696',
            title: 'BOJ 2696 - 중앙값 구하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2696',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수열을 읽고, 홀수 번째 수를 읽을 때마다 지금까지 읽은 값의 중앙값을 출력합니다.</p>
                <p>예를 들어 수열이 1, 5, 4, 3, 2이면, 1번째: 1, 3번째: 4, 5번째: 3이 중앙값입니다.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 테스트 케이스 T. 각 테스트 케이스는 수열의 크기 M (홀수, 1 ≤ M ≤ 9999)과 수열의 원소들.</div>
                    <div><strong>출력</strong><br>각 테스트 케이스마다 출력한 중앙값의 개수와 중앙값들을 한 줄에 10개씩 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력</strong><pre>3
9
1 2 3 4 5 6 7 8 9
9
9 8 7 6 5 4 3 2 1
23
23 41 13 22 -3 24 -31 -11 -8 -7
3 5 103 211 -311 -45 -67 -73 -81 -99
-33 24 56</pre></div>
                    <div><strong>예제 출력</strong><pre>5
1 2 3 4 5
5
9 8 7 6 5
12
23 23 22 22 13 3 5 5 3 -3
-7 -3</pre></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '숫자를 하나씩 추가하면서 매번 중앙값을 빠르게 구해야 합니다. <strong>두 개의 힙</strong>을 사용합니다!' },
                { title: '핵심 코드', content: '최대 힙(작은 절반) + 최소 힙(큰 절반). 최대 힙의 크기가 항상 같거나 1개 더 크게 유지하면, <strong>최대 힙의 루트 = 중앙값</strong>입니다.' },
                { title: '시간 복잡도', content: '각 삽입 O(log N), 전체 O(M log M)입니다.' }
            ],
            inputDefault: 3,
            solve() { return '5\n1 2 3 4 5\n5\n9 8 7 6 5\n12\n23 23 22 22 13 3 5 5 3 -3\n-7 -3'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

T = int(input())
for _ in range(T):
    M = int(input())
    nums = []
    while len(nums) < M:
        nums.extend(map(int, input().split()))

    maxH = []  # 최대 힙 (음수로 저장)
    minH = []  # 최소 힙
    medians = []

    for i, x in enumerate(nums):
        # 최대 힙에 넣을지 최소 힙에 넣을지 결정
        if not maxH or x <= -maxH[0]:
            heapq.heappush(maxH, -x)
        else:
            heapq.heappush(minH, x)

        # 크기 균형 맞추기 (maxH가 같거나 1개 더 크게)
        if len(maxH) > len(minH) + 1:
            heapq.heappush(minH, -heapq.heappop(maxH))
        elif len(minH) > len(maxH):
            heapq.heappush(maxH, -heapq.heappop(minH))

        # 홀수 번째면 중앙값 출력
        if (i + 1) % 2 == 1:
            medians.append(-maxH[0])

    print(len(medians))
    for i in range(0, len(medians), 10):
        print(' '.join(map(str, medians[i:i+10])))`,
                cpp: `#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int T;
    cin >> T;
    while (T--) {
        int M;
        cin >> M;
        priority_queue<int> maxH;                              // 최대 힙
        priority_queue<int, vector<int>, greater<int>> minH;   // 최소 힙
        vector<int> medians;

        for (int i = 0; i < M; i++) {
            int x;
            cin >> x;
            if (maxH.empty() || x <= maxH.top())
                maxH.push(x);
            else
                minH.push(x);

            if ((int)maxH.size() > (int)minH.size() + 1) {
                minH.push(maxH.top()); maxH.pop();
            } else if ((int)minH.size() > (int)maxH.size()) {
                maxH.push(minH.top()); minH.pop();
            }

            if ((i + 1) % 2 == 1)
                medians.push_back(maxH.top());
        }

        cout << medians.size() << '\\n';
        for (int i = 0; i < (int)medians.size(); i++) {
            cout << medians[i];
            if ((i + 1) % 10 == 0 || i == (int)medians.size() - 1) cout << '\\n';
            else cout << ' ';
        }
    }
    return 0;
}`,
                java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int T = Integer.parseInt(br.readLine().trim());

        while (T-- > 0) {
            int M = Integer.parseInt(br.readLine().trim());
            PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder());
            PriorityQueue<Integer> minH = new PriorityQueue<>();
            List<Integer> medians = new ArrayList<>();

            List<Integer> nums = new ArrayList<>();
            while (nums.size() < M) {
                StringTokenizer st = new StringTokenizer(br.readLine());
                while (st.hasMoreTokens()) nums.add(Integer.parseInt(st.nextToken()));
            }

            for (int i = 0; i < M; i++) {
                int x = nums.get(i);
                if (maxH.isEmpty() || x <= maxH.peek()) maxH.offer(x);
                else minH.offer(x);

                if (maxH.size() > minH.size() + 1) { minH.offer(maxH.poll()); }
                else if (minH.size() > maxH.size()) { maxH.offer(minH.poll()); }

                if ((i + 1) % 2 == 1) medians.add(maxH.peek());
            }

            sb.append(medians.size()).append('\\n');
            for (int i = 0; i < medians.size(); i++) {
                sb.append(medians.get(i));
                if ((i + 1) % 10 == 0 || i == medians.size() - 1) sb.append('\\n');
                else sb.append(' ');
            }
        }
        System.out.print(sb);
    }
}`
            }
        },

        // ========== 3단계: 그리디 + 힙 ==========
        {
            id: 'boj-1202',
            title: 'BOJ 1202 - 보석 도둑',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1202',
            descriptionHTML: `
                <h3>문제</h3>
                <p>세계적인 도둑 상덕이는 보석점을 털기로 했습니다.</p>
                <p>보석점에는 N개의 보석이 있으며, 각 보석은 무게 M<sub>i</sub>와 가격 V<sub>i</sub>를 가지고 있습니다.</p>
                <p>상덕이는 K개의 가방을 가지고 있으며, 각 가방에는 최대 C<sub>i</sub>만큼의 무게를 담을 수 있습니다.</p>
                <p>가방에는 최대 한 개의 보석만 넣을 수 있습니다. 훔칠 수 있는 보석의 최대 가격 합을 구하시오.</p>

                <div class="problem-io">
                    <div><strong>입력</strong><br>첫째 줄에 N, K (1 ≤ N, K ≤ 300,000). 다음 N줄에 각 보석의 무게와 가격. 다음 K줄에 각 가방의 최대 용량.</div>
                    <div><strong>출력</strong><br>훔칠 수 있는 보석 가격의 합의 최댓값을 출력합니다.</div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력 1</strong><pre>2 1
5 10
100 100
11</pre></div>
                    <div><strong>예제 출력 1</strong><pre>10</pre></div>
                </div>

                <div class="problem-example">
                    <div><strong>예제 입력 2</strong><pre>3 2
1 65
5 23
2 99
10
2</pre></div>
                    <div><strong>예제 출력 2</strong><pre>164</pre></div>
                </div>
            `,
            hints: [
                { title: '접근법', content: '가방을 <strong>용량이 작은 순서</strong>로 정렬합니다. 보석도 <strong>무게가 가벼운 순서</strong>로 정렬합니다. 각 가방마다 들어갈 수 있는 보석 중 가장 비싼 것을 고릅니다.' },
                { title: '핵심 코드', content: '가방을 작은 순서대로 처리하면서, 현재 가방에 들어가는 보석들을 <strong>최대 힙</strong>에 넣습니다. 힙에서 가장 비싼 보석을 꺼냅니다. 이전에 넣은 보석은 큰 가방에도 당연히 들어가므로 다시 빼지 않아도 됩니다!' },
                { title: '시간 복잡도', content: '정렬 O(N log N + K log K) + 힙 연산 O(N log N) = 전체 O((N+K) log N)' }
            ],
            inputDefault: 2,
            solve() { return '10'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

N, K = map(int, input().split())
jewels = []
for _ in range(N):
    m, v = map(int, input().split())
    jewels.append((m, v))
bags = [int(input()) for _ in range(K)]

jewels.sort()  # 무게순 정렬
bags.sort()    # 용량순 정렬

answer = 0
heap = []  # 최대 힙 (가격의 음수)
j = 0

for bag in bags:
    # 이 가방에 들어가는 보석들을 힙에 추가
    while j < N and jewels[j][0] <= bag:
        heapq.heappush(heap, -jewels[j][1])
        j += 1
    # 힙에서 가장 비싼 보석 선택
    if heap:
        answer += -heapq.heappop(heap)

print(answer)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, K;
    cin >> N >> K;
    vector<pair<int,int>> jewels(N);
    vector<int> bags(K);

    for (int i = 0; i < N; i++) cin >> jewels[i].first >> jewels[i].second;
    for (int i = 0; i < K; i++) cin >> bags[i];

    sort(jewels.begin(), jewels.end());
    sort(bags.begin(), bags.end());

    priority_queue<int> pq;
    long long answer = 0;
    int j = 0;

    for (int i = 0; i < K; i++) {
        while (j < N && jewels[j].first <= bags[i]) {
            pq.push(jewels[j].second);
            j++;
        }
        if (!pq.empty()) {
            answer += pq.top();
            pq.pop();
        }
    }
    cout << answer << endl;
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

        int[][] jewels = new int[N][2];
        for (int i = 0; i < N; i++) {
            st = new StringTokenizer(br.readLine());
            jewels[i][0] = Integer.parseInt(st.nextToken());
            jewels[i][1] = Integer.parseInt(st.nextToken());
        }
        int[] bags = new int[K];
        for (int i = 0; i < K; i++) bags[i] = Integer.parseInt(br.readLine().trim());

        Arrays.sort(jewels, (a, b) -> a[0] - b[0]);
        Arrays.sort(bags);

        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        long answer = 0;
        int j = 0;

        for (int bag : bags) {
            while (j < N && jewels[j][0] <= bag) {
                pq.offer(jewels[j][1]);
                j++;
            }
            if (!pq.isEmpty()) answer += pq.poll();
        }
        System.out.println(answer);
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
window.AlgoTopics.priorityqueue = priorityQueueTopic;
