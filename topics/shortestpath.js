// =========================================================
// 최단 경로 (Shortest Path) 토픽 모듈
// =========================================================
const shortestPathTopic = {
    id: 'shortestpath',
    title: '최단 경로',
    icon: '🛤️',
    category: '고급 자료구조와 그래프',
    order: 18,
    description: '가중치 그래프에서 최소 비용 경로를 찾는 알고리즘',
    relatedNote: '이 외에도 벨만-포드(음수 간선), SPFA, A* 탐색 등의 최단 경로 알고리즘이 있습니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🛤️ 최단 경로 (Shortest Path)</h2>
                <p class="hero-sub">가중치 그래프에서 최소 비용으로 목적지까지 가는 방법을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 최단 경로란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 최단 경로란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 자동차 <strong>네비게이션</strong>을 생각해 보세요!<br><br>
                    집에서 학교까지 가는 길이 여러 개 있습니다. 어떤 길은 거리가 짧고, 어떤 길은 멀지요.<br>
                    네비게이션은 모든 길을 비교해서 <strong>가장 빠른(비용이 적은) 경로</strong>를 찾아줍니다.<br><br>
                    이것이 바로 <strong>최단 경로 알고리즘</strong>입니다!<br>
                    그래프의 간선에 <strong>가중치(비용)</strong>가 있을 때, 출발지에서 목적지까지 <strong>비용 합이 최소</strong>인 경로를 찾습니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--green)">3</text></svg>
                        </div>
                        <h3>양수 가중치</h3>
                        <p>간선의 비용이 모두 0 이상입니다.<br><strong>다익스트라 알고리즘</strong>으로 해결합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--red, #e17055)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--red, #e17055)">-2</text></svg>
                        </div>
                        <h3>음수 가중치</h3>
                        <p>간선의 비용이 음수일 수 있습니다.<br><strong>벨만-포드 알고리즘</strong>이 필요합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="19" cy="30" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="15" y1="10" x2="23" y2="10" stroke="var(--accent)" stroke-width="2"/><line x1="12" y1="15" x2="17" y2="25" stroke="var(--accent)" stroke-width="2"/><line x1="26" y1="15" x2="21" y2="25" stroke="var(--accent)" stroke-width="2"/></svg>
                        </div>
                        <h3>단일 출발점</h3>
                        <p>하나의 시작점에서 모든 정점까지의 최단 거리를 구합니다.<br>다익스트라, 벨만-포드가 해당됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--yellow)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--yellow)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--yellow)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--yellow)" stroke-width="1"/><text x="10" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">0</text><text x="21" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">3</text><text x="10" y="23" text-anchor="middle" font-size="7" fill="var(--yellow)">5</text></svg>
                        </div>
                        <h3>모든 쌍 최단경로</h3>
                        <p>모든 정점 쌍 사이의 최단 거리를 구합니다.<br><strong>플로이드-워셜 알고리즘</strong>이 해당됩니다.</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">BFS로도 최단 경로를 구할 수 있는데, 다익스트라는 왜 필요할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        BFS는 <strong>모든 간선의 가중치가 1일 때만</strong> 최단 경로를 보장합니다!<br>
                        간선마다 비용이 다르면 BFS로는 최단 경로를 구할 수 없습니다.<br>
                        예: A→B 비용 1, A→C 비용 10이면, BFS는 둘 다 "1칸"으로 취급합니다.<br>
                        <strong>가중치가 다를 때</strong>는 다익스트라가 필요합니다!
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 다익스트라 알고리즘 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 다익스트라 알고리즘 (Dijkstra)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "가장 가까운 곳부터 탐색하기"를 생각해 보세요!<br><br>
                    여러분이 동네 지도를 갖고 있다고 합시다. 집에서 출발해서 가장 가까운 편의점에 먼저 가고,<br>
                    그다음 가까운 곳을 방문하고... 이렇게 <strong>항상 현재까지 가장 가까운 미방문 장소</strong>부터 처리합니다.<br><br>
                    이것이 다익스트라 알고리즘의 핵심입니다! 단, <strong>가중치가 모두 양수(0 이상)</strong>일 때만 올바르게 동작합니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--accent)">+</text></svg>
                        </div>
                        <h3>양수 가중치 전용</h3>
                        <p>간선 가중치가 음수이면 올바른 결과를 보장하지 않습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="12" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--green)">min</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><line x1="16" y1="17" x2="12" y2="25" stroke="var(--border)" stroke-width="1.5"/><line x1="22" y1="17" x2="26" y2="25" stroke="var(--border)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>최소 힙(heapq) 사용</h3>
                        <p>거리가 가장 짧은 정점을 빠르게 꺼냅니다. 우선순위 큐를 사용합니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">O((V+E)</text><text x="19" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">log V)</text></svg>
                        </div>
                        <h3>시간 복잡도</h3>
                        <p>우선순위 큐를 사용하면 O((V+E)logV)입니다. 매우 효율적입니다!</p>
                    </div>
                </div>

                <div class="code-block">
                    <pre><code class="language-python"># 다익스트라 알고리즘 (최소 힙 사용)
import heapq
import sys
input = sys.stdin.readline
INF = float('inf')

def dijkstra(start, graph, N):
    dist = [INF] * (N + 1)
    dist[start] = 0
    heap = [(0, start)]  # (거리, 정점)

    while heap:
        d, v = heapq.heappop(heap)
        if d > dist[v]:    # 이미 더 짧은 경로를 찾은 경우 무시
            continue
        for u, w in graph[v]:  # (이웃 정점, 가중치)
            nd = d + w
            if nd < dist[u]:
                dist[u] = nd
                heapq.heappush(heap, (nd, u))
    return dist

# 그래프 입력
N, M = map(int, input().split())
start = int(input())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))

dist = dijkstra(start, graph, N)
for i in range(1, N + 1):
    print(dist[i] if dist[i] != INF else "INF")</code></pre>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">다익스트라에서 <code>if d > dist[v]: continue</code>는 왜 필요할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        힙에는 같은 정점이 여러 번 들어갈 수 있습니다!<br>
                        예: A→B 비용 5로 (5, B)를 넣었는데, 나중에 A→C→B 비용 3으로 (3, B)를 또 넣습니다.<br>
                        (3, B)가 먼저 처리된 후 (5, B)가 나오면, 이미 더 짧은 경로로 처리되었으므로 <strong>무시</strong>합니다.<br>
                        이 조건이 없으면 불필요한 연산이 많아져 느려집니다!
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 벨만-포드 알고리즘 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 벨만-포드 알고리즘 (Bellman-Ford)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "모든 길을 반복해서 확인하기"를 생각해 보세요!<br><br>
                    네비게이션이 고장나서, 한 번에 가장 가까운 곳을 못 찾습니다.<br>
                    대신 <strong>모든 도로를 한 바퀴씩 돌면서</strong> "더 짧은 길이 있나?" 확인합니다.<br>
                    이걸 <strong>V-1번</strong> 반복하면 모든 최단 경로를 찾을 수 있습니다!<br><br>
                    장점: <strong>음수 가중치</strong>가 있어도 동작합니다.<br>
                    V번째 반복에서도 거리가 줄어들면? <strong>음수 사이클</strong>이 존재하는 것입니다!
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--green)">-</text></svg>
                        </div>
                        <h3>음수 가중치 OK</h3>
                        <p>다익스트라와 달리 간선 가중치가 음수여도 정확히 동작합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--accent)">V-1</text><text x="19" y="30" text-anchor="middle" font-size="9" fill="var(--text2)">번 반복</text></svg>
                        </div>
                        <h3>V-1번 완화</h3>
                        <p>모든 간선을 V-1번 반복하며 거리를 갱신(완화)합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="26" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="19" cy="28" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M16 14 L24 14 M24 16 L21 24 M17 24 L14 16" stroke="var(--red, #e17055)" stroke-width="1.5"/><text x="19" y="37" text-anchor="middle" font-size="7" fill="var(--red, #e17055)">음수사이클</text></svg>
                        </div>
                        <h3>음수 사이클 탐지</h3>
                        <p>V번째에도 갱신이 되면 음수 사이클이 존재합니다! O(VE)</p>
                    </div>
                </div>

                <div class="code-block">
                    <pre><code class="language-python"># 벨만-포드 알고리즘
import sys
input = sys.stdin.readline
INF = float('inf')

N, M = map(int, input().split())
edges = []
for _ in range(M):
    u, v, w = map(int, input().split())
    edges.append((u, v, w))

dist = [INF] * (N + 1)
dist[1] = 0  # 시작점

# V-1번 모든 간선 완화
for i in range(N - 1):
    for u, v, w in edges:
        if dist[u] != INF and dist[u] + w < dist[v]:
            dist[v] = dist[u] + w

# V번째 완화 시도 → 음수 사이클 판별
has_negative_cycle = False
for u, v, w in edges:
    if dist[u] != INF and dist[u] + w < dist[v]:
        has_negative_cycle = True
        break

if has_negative_cycle:
    print("음수 사이클 존재!")
else:
    for i in range(1, N + 1):
        print(dist[i] if dist[i] != INF else "INF")</code></pre>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">왜 V-1번 반복하면 모든 최단 경로를 찾을 수 있을까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        최단 경로는 최대 <strong>V-1개의 간선</strong>을 지나갑니다 (V개 정점을 거치므로).<br>
                        1번 반복하면 간선 1개짜리 최단 경로가 확정되고,<br>
                        2번 반복하면 간선 2개짜리 최단 경로가 확정되고...<br>
                        V-1번 반복하면 모든 최단 경로가 확정됩니다!<br>
                        만약 V번째에도 갱신이 되면, 간선을 무한히 지나갈수록 비용이 줄어드는 <strong>음수 사이클</strong>이 있다는 뜻입니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 4: 플로이드-워셜 알고리즘 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> 플로이드-워셜 알고리즘 (Floyd-Warshall)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "경유지를 하나씩 추가하기"를 생각해 보세요!<br><br>
                    서울에서 부산까지 바로 가면 5시간이 걸립니다.<br>
                    그런데 <strong>대전을 경유</strong>하면? 서울→대전 2시간 + 대전→부산 2시간 = 4시간!<br>
                    이렇게 모든 정점을 경유지 후보로 넣어보면서, 더 짧은 경로가 있으면 갱신합니다.<br><br>
                    <strong>모든 쌍</strong>의 최단 경로를 한 번에 구할 수 있습니다!
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--accent)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--accent)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--accent)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--accent)" stroke-width="1"/></svg>
                        </div>
                        <h3>2차원 배열 dp[i][j]</h3>
                        <p>dp[i][j] = i에서 j까지의 최단 거리. 모든 쌍을 저장합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="16" text-anchor="middle" font-size="8" fill="var(--accent)">for k</text><text x="19" y="25" text-anchor="middle" font-size="8" fill="var(--accent)">for i</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--accent)">for j</text></svg>
                        </div>
                        <h3>3중 for문</h3>
                        <p>경유지 k를 바깥 루프에 놓습니다. 순서가 매우 중요합니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">O(V³)</text></svg>
                        </div>
                        <h3>시간 복잡도 O(V³)</h3>
                        <p>정점이 많으면 느리지만, 코드가 매우 간단합니다. V ≤ 500 정도면 사용 가능합니다.</p>
                    </div>
                </div>

                <div class="code-block">
                    <pre><code class="language-python"># 플로이드-워셜 알고리즘
import sys
input = sys.stdin.readline
INF = float('inf')

N = int(input())  # 정점 수
M = int(input())  # 간선 수

# dp[i][j] = i에서 j까지의 최단 거리
dp = [[INF] * (N + 1) for _ in range(N + 1)]
for i in range(1, N + 1):
    dp[i][i] = 0  # 자기 자신까지 거리는 0

for _ in range(M):
    a, b, c = map(int, input().split())
    dp[a][b] = min(dp[a][b], c)  # 같은 간선이 여러 개일 수 있음

# 핵심: 경유지 k를 바깥 루프에!
for k in range(1, N + 1):       # 경유지
    for i in range(1, N + 1):   # 출발지
        for j in range(1, N + 1):  # 도착지
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])

# 결과 출력
for i in range(1, N + 1):
    for j in range(1, N + 1):
        print(dp[i][j] if dp[i][j] != INF else 0, end=' ')
    print()</code></pre>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">플로이드-워셜에서 왜 경유지 k가 가장 바깥 루프여야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>k가 바깥 루프</strong>에 있어야 "1번 정점만 경유 → 1,2번 정점만 경유 → ... → 모든 정점 경유"로<br>
                        점차 경유 가능한 정점을 늘려가며 <strong>DP를 올바르게 갱신</strong>할 수 있습니다!<br><br>
                        만약 k를 안쪽에 넣으면, 아직 갱신되지 않은 dp[i][k]를 사용하게 되어 잘못된 결과가 나옵니다.<br>
                        <strong>반드시 k → i → j 순서</strong>를 지켜야 합니다!
                    </div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
    },

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box').forEach(box => {
            const trigger = box.querySelector('.think-box-trigger');
            const answer = box.querySelector('.think-box-answer');
            if (trigger && answer) {
                trigger.addEventListener('click', () => {
                    answer.classList.toggle('show');
                    trigger.textContent = answer.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
                });
            }
        });
        container.querySelectorAll('pre code').forEach(el => {
            if (window.hljs) hljs.highlightElement(el);
        });
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        this._clearVizState();

        // 5-node weighted graph: A(0), B(1), C(2), D(3), E(4)
        // Edges: A-B:4, A-C:2, B-D:3, B-E:1, C-B:1, C-D:5, D-E:2
        const NODES = ['A', 'B', 'C', 'D', 'E'];
        const EDGES = [
            { from: 0, to: 1, w: 4 }, // A→B:4
            { from: 0, to: 2, w: 2 }, // A→C:2
            { from: 1, to: 3, w: 3 }, // B→D:3
            { from: 1, to: 4, w: 1 }, // B→E:1
            { from: 2, to: 1, w: 1 }, // C→B:1
            { from: 2, to: 3, w: 5 }, // C→D:5
            { from: 3, to: 4, w: 2 }  // D→E:2
        ];

        // Distance display using str-char-box
        let distBoxes = NODES.map((n, i) => `<div class="str-char-box" data-node="${i}" style="min-width:52px;text-align:center;">
            <div style="font-weight:700;font-size:0.85rem;">${n}</div>
            <div class="sp-dist-val" style="font-size:1.1rem;font-weight:600;color:var(--accent);">&infin;</div>
        </div>`).join('');

        container.innerHTML = `
            <div class="viz-card">
                <h3>다익스트라 알고리즘 시각화</h3>
                <p>5개 노드의 가중치 방향 그래프에서 A를 출발점으로 최단 경로를 찾습니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button class="btn btn-primary" id="sp-start-btn">다익스트라 시작</button>
                </div>

                <!-- Graph using HTML/CSS (not SVG) -->
                <div class="sp-graph-container" style="position:relative;width:100%;max-width:500px;height:320px;margin:0 auto 16px;border:1.5px solid var(--border);border-radius:12px;background:var(--card);">
                    <!-- Nodes -->
                    <div class="sp-node" data-id="0" style="left:60px;top:40px;">A</div>
                    <div class="sp-node" data-id="1" style="left:250px;top:40px;">B</div>
                    <div class="sp-node" data-id="2" style="left:120px;top:180px;">C</div>
                    <div class="sp-node" data-id="3" style="left:380px;top:120px;">D</div>
                    <div class="sp-node" data-id="4" style="left:380px;top:250px;">E</div>

                    <!-- Edge labels (positioned manually for clarity) -->
                    <div class="sp-edge-label" data-edge="0-1" style="left:155px;top:28px;">4</div>
                    <div class="sp-edge-label" data-edge="0-2" style="left:65px;top:118px;">2</div>
                    <div class="sp-edge-label" data-edge="1-3" style="left:320px;top:60px;">3</div>
                    <div class="sp-edge-label" data-edge="1-4" style="left:320px;top:155px;">1</div>
                    <div class="sp-edge-label" data-edge="2-1" style="left:175px;top:100px;">1</div>
                    <div class="sp-edge-label" data-edge="2-3" style="left:258px;top:165px;">5</div>
                    <div class="sp-edge-label" data-edge="3-4" style="left:400px;top:190px;">2</div>

                    <!-- SVG for edges -->
                    <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;">
                        <defs>
                            <marker id="sp-arrow" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)"/>
                            </marker>
                            <marker id="sp-arrow-active" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--yellow-vivid, #f9a825)"/>
                            </marker>
                            <marker id="sp-arrow-done" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-vivid, #6c5ce7)"/>
                            </marker>
                        </defs>
                        <!-- A→B --><line class="sp-edge" data-edge="0-1" x1="95" y1="58" x2="248" y2="58" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- A→C --><line class="sp-edge" data-edge="0-2" x1="82" y1="76" x2="128" y2="178" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- B→D --><line class="sp-edge" data-edge="1-3" x1="290" y1="62" x2="378" y2="128" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- B→E --><line class="sp-edge" data-edge="1-4" x1="282" y1="74" x2="382" y2="248" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- C→B --><line class="sp-edge" data-edge="2-1" x1="155" y1="186" x2="255" y2="72" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- C→D --><line class="sp-edge" data-edge="2-3" x1="162" y1="198" x2="375" y2="138" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                        <!-- D→E --><line class="sp-edge" data-edge="3-4" x1="400" y1="156" x2="400" y2="248" marker-end="url(#sp-arrow)" stroke="var(--border)" stroke-width="2"/>
                    </svg>
                </div>

                <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;align-items:flex-start;">
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">거리 배열 (dist[])</div>
                        <div id="sp-dist-display" style="display:flex;gap:6px;flex-wrap:wrap;">
                            ${distBoxes}
                        </div>
                    </div>
                    <div style="flex:1;min-width:140px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">방문 완료 (Visited)</div>
                        <div class="graph-queue-display" id="sp-visited-display"></div>
                    </div>
                    <div style="flex:1;min-width:140px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">우선순위 큐 (Heap)</div>
                        <div class="graph-queue-display" id="sp-queue-display"></div>
                    </div>
                </div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 미방문</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> 방문 완료</span>
            </div>

            <style>
                .sp-node {
                    position: absolute;
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    background: var(--card);
                    border: 2.5px solid var(--border);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 700; font-size: 1rem;
                    color: var(--text);
                    z-index: 2;
                    transition: all 0.3s;
                }
                .sp-node.active {
                    background: var(--yellow);
                    border-color: var(--yellow-vivid, #f9a825);
                    transform: scale(1.15);
                    box-shadow: 0 0 12px rgba(249,168,37,0.5);
                }
                .sp-node.visited {
                    background: var(--accent-vivid, #6c5ce7);
                    border-color: var(--accent2, #a29bfe);
                    color: #fff;
                }
                .sp-node.updated {
                    background: rgba(0,184,148,0.15);
                    border-color: var(--green, #00b894);
                    border-style: dashed;
                }
                .sp-edge-label {
                    position: absolute;
                    background: var(--bg);
                    padding: 1px 6px;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text2);
                    z-index: 1;
                    border: 1px solid var(--border);
                }
                .sp-edge-label.highlight {
                    background: var(--yellow);
                    color: var(--text);
                    border-color: var(--yellow-vivid, #f9a825);
                }
                .sp-dist-val.updated {
                    color: var(--green, #00b894) !important;
                    font-weight: 800 !important;
                }
            </style>
        `;

        const self = this;
        const graphContainer = container.querySelector('.sp-graph-container');
        const distDisplay = container.querySelector('#sp-dist-display');
        const visitedDisplay = container.querySelector('#sp-visited-display');
        const queueDisplay = container.querySelector('#sp-queue-display');

        function saveState() {
            const nodeStates = {};
            graphContainer.querySelectorAll('.sp-node').forEach(n => {
                nodeStates[n.dataset.id] = n.getAttribute('class');
            });
            const edgeStates = {};
            graphContainer.querySelectorAll('.sp-edge').forEach(e => {
                edgeStates[e.dataset.edge] = { stroke: e.getAttribute('stroke'), marker: e.getAttribute('marker-end') };
            });
            const labelStates = {};
            graphContainer.querySelectorAll('.sp-edge-label').forEach(l => {
                labelStates[l.dataset.edge] = l.getAttribute('class');
            });
            return {
                nodeStates,
                edgeStates,
                labelStates,
                distHTML: distDisplay.innerHTML,
                visitedHTML: visitedDisplay.innerHTML,
                queueHTML: queueDisplay.innerHTML
            };
        }

        function restoreState(state) {
            graphContainer.querySelectorAll('.sp-node').forEach(n => {
                n.setAttribute('class', state.nodeStates[n.dataset.id]);
            });
            graphContainer.querySelectorAll('.sp-edge').forEach(e => {
                e.setAttribute('stroke', state.edgeStates[e.dataset.edge].stroke);
                e.setAttribute('marker-end', state.edgeStates[e.dataset.edge].marker);
            });
            graphContainer.querySelectorAll('.sp-edge-label').forEach(l => {
                l.setAttribute('class', state.labelStates[l.dataset.edge]);
            });
            distDisplay.innerHTML = state.distHTML;
            visitedDisplay.innerHTML = state.visitedHTML;
            queueDisplay.innerHTML = state.queueHTML;
        }

        function setNodeClass(id, cls) {
            const node = graphContainer.querySelector(`.sp-node[data-id="${id}"]`);
            if (node) node.setAttribute('class', 'sp-node' + (cls ? ' ' + cls : ''));
        }

        function setEdgeHighlight(from, to, active) {
            const edge = graphContainer.querySelector(`.sp-edge[data-edge="${from}-${to}"]`);
            if (edge) {
                edge.setAttribute('stroke', active ? 'var(--yellow-vivid, #f9a825)' : 'var(--border)');
                edge.setAttribute('marker-end', active ? 'url(#sp-arrow-active)' : 'url(#sp-arrow)');
            }
            const label = graphContainer.querySelector(`.sp-edge-label[data-edge="${from}-${to}"]`);
            if (label) label.setAttribute('class', 'sp-edge-label' + (active ? ' highlight' : ''));
        }

        function setEdgeDone(from, to) {
            const edge = graphContainer.querySelector(`.sp-edge[data-edge="${from}-${to}"]`);
            if (edge) {
                edge.setAttribute('stroke', 'var(--accent-vivid, #6c5ce7)');
                edge.setAttribute('marker-end', 'url(#sp-arrow-done)');
            }
        }

        function setDist(nodeIdx, val, highlight) {
            const box = distDisplay.querySelector(`.str-char-box[data-node="${nodeIdx}"]`);
            if (box) {
                const valEl = box.querySelector('.sp-dist-val');
                valEl.textContent = val === Infinity ? '\u221E' : val;
                if (highlight) valEl.classList.add('updated');
                else valEl.classList.remove('updated');
            }
        }

        function setVisited(items) {
            visitedDisplay.innerHTML = items.map(i =>
                `<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">${NODES[i]}</div>`
            ).join('');
        }

        function setQueue(items) {
            queueDisplay.innerHTML = items.map(([d, i]) =>
                `<div class="graph-queue-item">(${d}, ${NODES[i]})</div>`
            ).join('');
        }

        container.querySelector('#sp-start-btn').addEventListener('click', function() {
            self._clearVizState();

            // Reset visual state
            NODES.forEach((_, i) => {
                setNodeClass(i, '');
                setDist(i, Infinity, false);
            });
            EDGES.forEach(e => setEdgeHighlight(e.from, e.to, false));
            setVisited([]);
            setQueue([]);

            const INF = Infinity;
            const adj = [
                [[1,4],[2,2]],     // A: B(4), C(2)
                [[3,3],[4,1]],     // B: D(3), E(1)
                [[1,1],[3,5]],     // C: B(1), D(5)
                [[4,2]],           // D: E(2)
                []                 // E: (none)
            ];

            // Pre-simulate dijkstra to build steps
            const dist = [INF, INF, INF, INF, INF];
            const visited = [false, false, false, false, false];
            const visitedOrder = [];
            const steps = [];

            // Step 0: Initialize
            const s0 = saveState();
            steps.push({
                description: '초기화: 출발점 A의 거리를 0으로, 나머지는 무한대(∞)로 설정합니다. 힙에 (0, A)를 넣습니다.',
                action: () => {
                    dist[0] = 0;
                    setDist(0, 0, true);
                    setNodeClass(0, 'updated');
                    setQueue([[0, 0]]);
                },
                undo: () => restoreState(s0)
            });

            // Simulate dijkstra step by step
            let simDist = [0, INF, INF, INF, INF];
            let simVisited = [false, false, false, false, false];
            let simVisitedOrder = [];
            let simHeap = [[0, 0]]; // [dist, node]

            // Process order: A(0), C(2), B(1), D(3), E(4) — this is what dijkstra gives
            const processSequence = [];

            // Build the actual sequence by simulating
            const tmpDist = [0, INF, INF, INF, INF];
            const tmpVisited = [false, false, false, false, false];
            const tmpHeap = [[0, 0]];
            const tmpVisitedOrder = [];

            while (tmpHeap.length > 0) {
                // Sort heap to get minimum (simple simulation)
                tmpHeap.sort((a, b) => a[0] - b[0]);
                const [d, v] = tmpHeap.shift();
                if (tmpVisited[v]) continue;
                tmpVisited[v] = true;
                tmpVisitedOrder.push(v);

                const updates = [];
                for (const [u, w] of adj[v]) {
                    const nd = d + w;
                    if (nd < tmpDist[u]) {
                        tmpDist[u] = nd;
                        tmpHeap.push([nd, u]);
                        updates.push({ node: u, newDist: nd, oldDist: nd === tmpDist[u] ? INF : tmpDist[u] });
                    }
                }

                processSequence.push({
                    node: v,
                    dist: d,
                    updates: updates.map(u => ({ ...u })),
                    heapAfter: tmpHeap.map(h => [...h]),
                    visitedAfter: [...tmpVisitedOrder]
                });
            }

            // Re-simulate properly to build correct steps with proper before-states
            let reDist = [0, INF, INF, INF, INF];
            let reVisited = [];
            let reHeap = [[0, 0]];

            processSequence.forEach(step => {
                const v = step.node;
                const d = step.dist;

                // Step A: Pop from heap & mark as active
                steps.push({
                    description: `힙에서 (${d}, ${NODES[v]})을 꺼냅니다. ${NODES[v]}를 처리합니다. (현재 최단 거리: ${d})`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setNodeClass(v, 'active');
                        // Update heap display
                        reHeap = reHeap.filter(h => !(h[0] === d && h[1] === v));
                        setQueue(reHeap);
                    },
                    undo: function() { restoreState(this._before); }
                });

                // Step B: Process neighbors and update distances
                const neighbors = adj[v];
                if (neighbors.length > 0) {
                    const updateInfo = [];
                    neighbors.forEach(([u, w]) => {
                        const nd = d + w;
                        if (nd < reDist[u]) {
                            updateInfo.push({ node: u, weight: w, oldDist: reDist[u], newDist: nd });
                            reDist[u] = nd;
                            reHeap.push([nd, u]);
                        }
                    });

                    if (updateInfo.length > 0) {
                        const capturedUpdates = updateInfo.map(u => ({ ...u }));
                        const capturedHeap = reHeap.map(h => [...h]);
                        const capturedDist = [...reDist];

                        let desc = `${NODES[v]}의 이웃을 확인합니다: `;
                        desc += capturedUpdates.map(u =>
                            `${NODES[v]}→${NODES[u.node]}(비용${u.weight}): dist[${NODES[u.node]}] = min(${u.oldDist === INF ? '∞' : u.oldDist}, ${d}+${u.weight}=${u.newDist}) → ${u.newDist}${u.newDist < (u.oldDist === INF ? INF : u.oldDist) ? ' ✓갱신!' : ''}`
                        ).join(', ');

                        steps.push({
                            description: desc,
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                capturedUpdates.forEach(u => {
                                    setEdgeHighlight(v, u.node, true);
                                    setDist(u.node, u.newDist, true);
                                    if (!reVisited.includes(u.node)) setNodeClass(u.node, 'updated');
                                });
                                setQueue(capturedHeap.slice().sort((a, b) => a[0] - b[0]));
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    } else {
                        steps.push({
                            description: `${NODES[v]}의 이웃을 확인했지만 갱신할 거리가 없습니다.`,
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                neighbors.forEach(([u, w]) => setEdgeHighlight(v, u, true));
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }
                }

                // Step C: Mark as visited
                reVisited.push(v);
                const capturedVisited = [...reVisited];
                steps.push({
                    description: `${NODES[v]} 방문 완료! 최단 거리 확정: ${d}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setNodeClass(v, 'visited');
                        setDist(v, d, false);
                        setVisited(capturedVisited);
                        // Reset edge highlights
                        EDGES.forEach(e => {
                            if (e.from === v) setEdgeDone(e.from, e.to);
                            else setEdgeHighlight(e.from, e.to, false);
                        });
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            // Final step
            steps.push({
                description: '다익스트라 완료! 최단 거리: A=0, B=3, C=2, D=6, E=4',
                _before: null,
                action: function() { this._before = saveState(); },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        });
    },

    // ===== 시각화 상태 관리 =====
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
            <div id="viz-step-desc" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>
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

    // ===== 문제풀이 탭 =====
    stages: [
        {
            num: 1,
            title: '기본 최단 경로',
            desc: '다익스트라와 플로이드-워셜의 기본 구현을 연습합니다 (Gold IV~V)',
            problemIds: ['boj-1753', 'boj-11404']
        },
        {
            num: 2,
            title: '최단 경로 응용',
            desc: '다익스트라를 다양한 상황에 응용합니다 (Gold V ~ Medium)',
            problemIds: ['boj-1916', 'lc-743']
        }
    ],

    problems: [
        // ===== 1단계: 기본 최단 경로 =====
        {
            id: 'boj-1753',
            title: 'BOJ 1753 - 최단경로',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1753',
            descriptionHTML: `
                <h3>문제</h3>
                <p>방향 그래프가 주어지면, 주어진 시작점에서 다른 모든 정점으로의 최단 경로를 구하는 프로그램을 작성하세요.</p>
                <p>단, 모든 간선의 가중치는 10 이하의 자연수입니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: V E (정점 수, 간선 수, V&le;20,000, E&le;300,000)<br>
                    둘째 줄: 시작 정점 번호 K<br>
                    이후 E줄: u v w (u→v 가중치 w)</p></div>
                    <div><h4>출력</h4>
                    <p>i번째 줄에 시작점에서 i번 정점으로의 최단 경로값 출력 (경로 없으면 INF)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 6
1
5 1 1
1 2 2
1 3 3
2 3 4
2 4 5
3 4 6</pre></div>
                    <div><strong>출력</strong><pre>0
2
3
7
INF</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 알고리즘을 쓸까?',
                    content: '한 시작점에서 다른 모든 정점까지의 최단 경로 → <strong>다익스트라 알고리즘</strong>입니다! 가중치가 모두 양수이므로 다익스트라를 사용할 수 있습니다.'
                },
                {
                    title: '핵심 아이디어',
                    content: '인접 리스트와 <strong>최소 힙(heapq)</strong>을 사용합니다.<br>힙에서 (거리, 정점)을 꺼내고, 이미 확정된 거리보다 크면 무시합니다.<br>이웃 정점의 거리를 갱신하면 힙에 추가합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>dist = [INF] * (V+1), dist[K] = 0</code>으로 초기화.<br><code>heapq.heappush(heap, (0, K))</code>로 시작.<br>힙에서 꺼낸 (d, v)에서 <code>d > dist[v]</code>이면 continue.<br>이웃 (u, w)에 대해 <code>d + w < dist[u]</code>이면 갱신.'
                }
            ],
            inputDefault: 0,
            solve() { return '0\n2\n3\n7\nINF'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline
INF = float('inf')

V, E = map(int, input().split())
K = int(input())
graph = [[] for _ in range(V + 1)]
for _ in range(E):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))

dist = [INF] * (V + 1)
dist[K] = 0
heap = [(0, K)]

while heap:
    d, v = heapq.heappop(heap)
    if d > dist[v]:
        continue
    for u, w in graph[v]:
        nd = d + w
        if nd < dist[u]:
            dist[u] = nd
            heapq.heappush(heap, (nd, u))

for i in range(1, V + 1):
    print(dist[i] if dist[i] != INF else "INF")`,
                cpp: `#include <bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
const int INF = 1e9;

int main() {
    int V, E, K;
    scanf("%d %d %d", &V, &E, &K);
    vector<vector<pii>> graph(V + 1);
    for (int i = 0; i < E; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        graph[u].push_back({v, w});
    }

    vector<int> dist(V + 1, INF);
    dist[K] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, K});

    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : graph[v]) {
            int nd = d + w;
            if (nd < dist[u]) {
                dist[u] = nd;
                pq.push({nd, u});
            }
        }
    }

    for (int i = 1; i <= V; i++) {
        if (dist[i] == INF) puts("INF");
        else printf("%d\\n", dist[i]);
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int V = Integer.parseInt(st.nextToken());
        int E = Integer.parseInt(st.nextToken());
        int K = Integer.parseInt(br.readLine().trim());

        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= V; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < E; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            int w = Integer.parseInt(st.nextToken());
            graph.get(u).add(new int[]{v, w});
        }

        int[] dist = new int[V + 1];
        int INF = (int)1e9;
        Arrays.fill(dist, INF);
        dist[K] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, K});

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], v = cur[1];
            if (d > dist[v]) continue;
            for (int[] edge : graph.get(v)) {
                int u = edge[0], w = edge[1];
                int nd = d + w;
                if (nd < dist[u]) {
                    dist[u] = nd;
                    pq.offer(new int[]{nd, u});
                }
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= V; i++) {
            sb.append(dist[i] == INF ? "INF" : dist[i]).append("\\n");
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-11404',
            title: 'BOJ 11404 - 플로이드',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11404',
            descriptionHTML: `
                <h3>문제</h3>
                <p>n개의 도시가 있습니다. 한 도시에서 출발하여 다른 도시에 도착하는 m개의 버스가 있습니다.
                각 버스는 한 번 사용할 때 필요한 비용이 있습니다.</p>
                <p>모든 도시의 쌍 (A, B)에 대해서 도시 A에서 도시 B로 가는데 필요한 비용의 최솟값을 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: n (도시 수, n&le;100)<br>
                    둘째 줄: m (버스 수, m&le;100,000)<br>
                    이후 m줄: a b c (a→b 비용 c)</p></div>
                    <div><h4>출력</h4>
                    <p>n줄에 걸쳐 n×n 행렬로 출력 (갈 수 없으면 0)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5
14
1 2 2
1 3 3
1 4 1
1 5 10
2 4 2
3 4 1
3 5 1
4 5 3
3 5 10
3 1 8
1 4 2
5 1 7
3 4 2
5 2 4</pre></div>
                    <div><strong>출력</strong><pre>0 2 3 1 4
12 0 15 2 5
8 5 0 1 1
10 7 13 0 3
7 4 10 6 0</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 알고리즘을 쓸까?',
                    content: '<strong>모든 쌍</strong>의 최단 경로를 구해야 합니다 → <strong>플로이드-워셜 알고리즘</strong>! n이 100 이하이므로 O(n³)으로 충분합니다.'
                },
                {
                    title: '핵심 아이디어',
                    content: '2차원 배열 dp[i][j]를 INF로 초기화하고, 입력 간선으로 갱신합니다.<br><strong>같은 출발-도착에 여러 간선이 있으면 최솟값</strong>을 저장합니다!<br>3중 for문: k(경유지) → i(출발) → j(도착) 순서로 <code>dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code>'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>dp[i][j] = min(dp[i][j], c)</code>로 초기화 (같은 간선 중 최소).<br>3중 for문 돌린 후, INF는 0으로 바꿔서 출력합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '0 2 3 1 4\n12 0 15 2 5\n8 5 0 1 1\n10 7 13 0 3\n7 4 10 6 0'; },
            templates: {
                python: `import sys
input = sys.stdin.readline
INF = float('inf')

n = int(input())
m = int(input())
dp = [[INF] * (n + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    dp[i][i] = 0

for _ in range(m):
    a, b, c = map(int, input().split())
    dp[a][b] = min(dp[a][b], c)

for k in range(1, n + 1):
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])

for i in range(1, n + 1):
    print(' '.join(str(x) if x != INF else '0' for x in dp[i][1:n+1]))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;
const int INF = 1e9;

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, INF));
    for (int i = 1; i <= n; i++) dp[i][i] = 0;

    for (int i = 0; i < m; i++) {
        int a, b, c;
        scanf("%d %d %d", &a, &b, &c);
        dp[a][b] = min(dp[a][b], c);
    }

    for (int k = 1; k <= n; k++)
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            printf("%d ", dp[i][j] == INF ? 0 : dp[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(br.readLine().trim());
        int m = Integer.parseInt(br.readLine().trim());
        int INF = (int)1e9;
        int[][] dp = new int[n + 1][n + 1];
        for (int[] row : dp) Arrays.fill(row, INF);
        for (int i = 1; i <= n; i++) dp[i][i] = 0;

        for (int i = 0; i < m; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            int c = Integer.parseInt(st.nextToken());
            dp[a][b] = Math.min(dp[a][b], c);
        }

        for (int k = 1; k <= n; k++)
            for (int i = 1; i <= n; i++)
                for (int j = 1; j <= n; j++)
                    dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j]);

        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                sb.append(dp[i][j] == INF ? 0 : dp[i][j]);
                if (j < n) sb.append(' ');
            }
            sb.append('\\n');
        }
        System.out.print(sb);
    }
}`
            }
        },

        // ===== 2단계: 최단 경로 응용 =====
        {
            id: 'boj-1916',
            title: 'BOJ 1916 - 최소비용 구하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1916',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 도시가 있습니다. 한 도시에서 출발하여 다른 도시에 도착하는 M개의 버스가 있습니다.
                A번째 도시에서 B번째 도시까지 가는데 드는 버스 비용을 최소화하려고 합니다.</p>
                <p>A번째 도시에서 B번째 도시까지 가는데 드는 최소비용을 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N (도시 수, N&le;1,000)<br>
                    둘째 줄: M (버스 수, M&le;100,000)<br>
                    이후 M줄: 출발 도착 비용<br>
                    마지막 줄: 출발 도시 도착 도시</p></div>
                    <div><h4>출력</h4>
                    <p>출발 도시에서 도착 도시까지의 최소 비용</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5
8
1 2 2
1 3 3
1 4 1
1 5 10
2 4 2
3 4 1
3 5 1
4 5 3
1 5</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 알고리즘을 쓸까?',
                    content: '한 도시에서 다른 한 도시까지의 최소 비용 → <strong>다익스트라 알고리즘</strong>입니다! 출발점에서 다익스트라를 돌리고 도착점의 거리를 출력하면 됩니다.'
                },
                {
                    title: '핵심 아이디어',
                    content: 'BOJ 1753번과 거의 같은 구조입니다!<br>다만 마지막에 <strong>모든 정점의 거리</strong>가 아닌 <strong>특정 도착 도시</strong>의 거리만 출력합니다.<br>같은 출발-도착에 여러 버스가 있을 수 있으므로, 인접 리스트에 모두 추가합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '1753번과 동일한 다익스트라 코드를 사용합니다.<br>마지막 줄에서 출발 도시와 도착 도시를 입력받고,<br><code>print(dist[도착도시])</code>로 결과를 출력합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline
INF = float('inf')

N = int(input())
M = int(input())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v, w = map(int, input().split())
    graph[u].append((v, w))

S, E = map(int, input().split())

dist = [INF] * (N + 1)
dist[S] = 0
heap = [(0, S)]

while heap:
    d, v = heapq.heappop(heap)
    if d > dist[v]:
        continue
    for u, w in graph[v]:
        nd = d + w
        if nd < dist[u]:
            dist[u] = nd
            heapq.heappush(heap, (nd, u))

print(dist[E])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;
typedef pair<int,int> pii;
const int INF = 1e9;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<vector<pii>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v, w;
        scanf("%d %d %d", &u, &v, &w);
        graph[u].push_back({v, w});
    }
    int S, E;
    scanf("%d %d", &S, &E);

    vector<int> dist(N + 1, INF);
    dist[S] = 0;
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, S});

    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;
        for (auto [u, w] : graph[v]) {
            int nd = d + w;
            if (nd < dist[u]) {
                dist[u] = nd;
                pq.push({nd, u});
            }
        }
    }

    printf("%d\\n", dist[E]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int M = Integer.parseInt(br.readLine().trim());

        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            int w = Integer.parseInt(st.nextToken());
            graph.get(u).add(new int[]{v, w});
        }
        StringTokenizer st = new StringTokenizer(br.readLine());
        int S = Integer.parseInt(st.nextToken());
        int E = Integer.parseInt(st.nextToken());

        int INF = (int)1e9;
        int[] dist = new int[N + 1];
        Arrays.fill(dist, INF);
        dist[S] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, S});

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], v = cur[1];
            if (d > dist[v]) continue;
            for (int[] edge : graph.get(v)) {
                int u = edge[0], w = edge[1];
                int nd = d + w;
                if (nd < dist[u]) {
                    dist[u] = nd;
                    pq.offer(new int[]{nd, u});
                }
            }
        }

        System.out.println(dist[E]);
    }
}`
            }
        },
        {
            id: 'lc-743',
            title: 'LeetCode 743 - Network Delay Time',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/network-delay-time/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>n개의 노드로 구성된 네트워크가 있습니다. times[i] = (u, v, w)는 노드 u에서 v로 신호를 보내는 데 w 시간이 걸린다는 뜻입니다.</p>
                <p>노드 k에서 신호를 보냈을 때, 모든 노드가 신호를 받는 데 걸리는 최소 시간을 구하세요. 모든 노드가 신호를 받을 수 없으면 -1을 반환합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>times: 간선 목록 [[u,v,w], ...]<br>
                    n: 노드 수 (1 ≤ n ≤ 100)<br>
                    k: 시작 노드</p></div>
                    <div><h4>출력</h4>
                    <p>모든 노드가 신호를 받는 최소 시간 (불가능하면 -1)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>times = [[2,1,1],[2,3,1],[3,4,1]]
n = 4, k = 2</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 알고리즘을 쓸까?',
                    content: '한 시작점(k)에서 모든 노드까지의 최단 거리를 구하고, 그 중 <strong>최댓값</strong>이 정답입니다 → <strong>다익스트라 알고리즘</strong>!'
                },
                {
                    title: '핵심 아이디어',
                    content: '다익스트라로 k에서 모든 노드까지의 최단 거리를 구합니다.<br>모든 거리 중 <strong>최댓값</strong>이 "모든 노드가 신호를 받는 시간"입니다.<br>도달 불가능한 노드가 있으면 -1을 반환합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '인접 리스트를 만들고 다익스트라를 실행합니다.<br><code>max(dist[1:n+1])</code>이 INF이면 -1, 아니면 그 값을 반환합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '2'; },
            templates: {
                python: `class Solution:
    def networkDelayTime(self, times, n, k):
        import heapq
        INF = float('inf')
        graph = [[] for _ in range(n + 1)]
        for u, v, w in times:
            graph[u].append((v, w))

        dist = [INF] * (n + 1)
        dist[k] = 0
        heap = [(0, k)]

        while heap:
            d, v = heapq.heappop(heap)
            if d > dist[v]:
                continue
            for u, w in graph[v]:
                nd = d + w
                if nd < dist[u]:
                    dist[u] = nd
                    heapq.heappush(heap, (nd, u))

        ans = max(dist[1:n+1])
        return ans if ans != INF else -1`,
                cpp: `class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        const int INF = 1e9;
        vector<vector<pair<int,int>>> graph(n + 1);
        for (auto& t : times) {
            graph[t[0]].push_back({t[1], t[2]});
        }

        vector<int> dist(n + 1, INF);
        dist[k] = 0;
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
        pq.push({0, k});

        while (!pq.empty()) {
            auto [d, v] = pq.top(); pq.pop();
            if (d > dist[v]) continue;
            for (auto [u, w] : graph[v]) {
                int nd = d + w;
                if (nd < dist[u]) {
                    dist[u] = nd;
                    pq.push({nd, u});
                }
            }
        }

        int ans = *max_element(dist.begin() + 1, dist.end());
        return ans == INF ? -1 : ans;
    }
};`,
                java: `class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        int INF = (int)1e9;
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
        for (int[] t : times) {
            graph.get(t[0]).add(new int[]{t[1], t[2]});
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, INF);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.offer(new int[]{0, k});

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int d = cur[0], v = cur[1];
            if (d > dist[v]) continue;
            for (int[] edge : graph.get(v)) {
                int u = edge[0], w = edge[1];
                int nd = d + w;
                if (nd < dist[u]) {
                    dist[u] = nd;
                    pq.offer(new int[]{nd, u});
                }
            }
        }

        int ans = 0;
        for (int i = 1; i <= n; i++) {
            ans = Math.max(ans, dist[i]);
        }
        return ans == INF ? -1 : ans;
    }
}`
            }
        }
    ],

    // ===== 문제 목록 렌더링 =====
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

    // ===== 문제 상세 렌더링 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn'; backBtn.textContent = '\u2190 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'LeetCode에서 풀기 \u2197' : 'BOJ에서 풀기 \u2197'}</a></div>${problem.descriptionHTML}`;
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
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">\u25B6</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '\u25BC' : '\u25B6';
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
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">\u25B6 실행</button><button id="check-btn" class="btn btn-success">\u2713 정답 확인</button></div>
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
            this._showOutput(container, `예상 정답:\n${expected}\n\n\uD83D\uDCA1 코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.shortestpath = shortestPathTopic;
