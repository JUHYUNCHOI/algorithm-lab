// ===== 그래프와 순회 토픽 모듈 =====
const graphTopic = {
    id: 'graph',
    title: '그래프와 순회',
    icon: '🕸️',
    category: '고급 자료구조와 그래프',
    order: 16,
    description: '정점과 간선으로 이루어진 그래프를 DFS/BFS로 탐색하는 기법',
    relatedNote: '이 외에도 위상 정렬, 최단 경로, 최소 신장 트리, 강한 연결 요소 등의 심화 그래프 알고리즘이 있습니다.',

    // ===== 개념 설명 렌더링 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🕸️ 그래프와 순회 (Graph Traversal)</h2>
                <p class="hero-sub">정점과 간선으로 이루어진 그래프를 빠짐없이 탐색하는 방법을 배웁니다</p>
            </div>

            <!-- ① 그래프란? -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 그래프란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 여러분의 <strong>친구 관계</strong>를 그림으로 그려 봅시다!<br><br>
                    각 사람을 <strong>점(정점)</strong>으로, 친구 사이를 <strong>줄(간선)</strong>로 연결하면 됩니다.<br>
                    예를 들어, 민수가 영희와 친구이고, 영희가 철수와 친구이면:<br>
                    <strong>민수 — 영희 — 철수</strong> 이렇게 연결됩니다.<br><br>
                    이런 그림을 <strong>그래프</strong>라고 합니다. SNS 친구 관계, 지하철 노선도, 인터넷 연결 등 모두 그래프입니다!
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="34" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="14" x2="29" y2="14" stroke="currentColor" stroke-width="2"/><line x1="16" y1="19" x2="22" y2="29" stroke="currentColor" stroke-width="2"/><line x1="32" y1="19" x2="26" y2="29" stroke="currentColor" stroke-width="2"/></svg></span></div>
                        <h3>정점(Vertex)과 간선(Edge)</h3>
                        <p>정점은 점, 간선은 점 사이를 잇는 줄입니다.<br>N개의 정점과 M개의 간선이 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="22" x2="29" y2="22" stroke="currentColor" stroke-width="2"/><line x1="19" y1="26" x2="29" y2="26" stroke="currentColor" stroke-width="2"/><polygon points="29,20 33,22 29,24" fill="currentColor"/><polygon points="19,24 15,26 19,28" fill="currentColor"/></svg></span></div>
                        <h3>방향 vs 무방향 그래프</h3>
                        <p>무방향: 양쪽 다 이동 가능 (친구 관계)<br>방향: 한 방향만 이동 (팔로우 관계)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><text x="4" y="14" font-size="10" fill="currentColor">1:</text><text x="16" y="14" font-size="10" fill="currentColor">[2, 3]</text><text x="4" y="28" font-size="10" fill="currentColor">2:</text><text x="16" y="28" font-size="10" fill="currentColor">[1, 4]</text><text x="4" y="42" font-size="10" fill="currentColor">3:</text><text x="16" y="42" font-size="10" fill="currentColor">[1]</text></svg></span></div>
                        <h3>인접 리스트</h3>
                        <p>각 정점마다 연결된 이웃 목록을 저장합니다.<br>메모리 효율적! (주로 사용)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" stroke-width="1"/><line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" stroke-width="1"/><line x1="18" y1="4" x2="18" y2="44" stroke="currentColor" stroke-width="1"/><line x1="32" y1="4" x2="32" y2="44" stroke="currentColor" stroke-width="1"/><text x="25" y="14" text-anchor="middle" font-size="9" fill="currentColor">1</text><text x="11" y="28" text-anchor="middle" font-size="9" fill="currentColor">1</text></svg></span></div>
                        <h3>인접 행렬</h3>
                        <p>N×N 표에 연결 여부를 0/1로 저장합니다.<br>간선이 많으면 비효율적입니다.</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 인접 리스트 만들기 (무방향 그래프)
import sys
input = sys.stdin.readline

N, M = map(int, input().split())  # 정점 수, 간선 수
graph = [[] for _ in range(N + 1)]

for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)  # 무방향이므로 양쪽 다 추가</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">5명의 학생(1~5번)이 있고, 친구 관계가 (1,2), (1,3), (2,4), (3,5)일 때, 1번의 인접 리스트는 무엇일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        1번의 인접 리스트는 <strong>[2, 3]</strong>입니다!<br>
                        1번과 직접 연결된 정점은 2번과 3번이기 때문입니다.<br>
                        4번과 5번은 1번과 직접 연결되지 않았으므로 포함되지 않습니다.
                    </div>
                </div>
            </div>

            <!-- ② DFS (깊이 우선 탐색) -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> DFS (깊이 우선 탐색)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 미로를 탐험한다고 생각해 보세요!<br><br>
                    갈림길이 나오면 <strong>한 방향으로 끝까지</strong> 가봅니다.<br>
                    막다른 길이면? <strong>되돌아와서</strong> 다른 방향으로 갑니다!<br><br>
                    이것이 바로 <strong>DFS(깊이 우선 탐색)</strong>입니다.<br>
                    "깊이" 우선이니까, 한 방향으로 최대한 <strong>깊이</strong> 들어갑니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="14" y="4" width="20" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="18" y="8" width="12" height="6" rx="2" fill="currentColor" opacity="0.3"/><rect x="18" y="18" width="12" height="6" rx="2" fill="currentColor" opacity="0.5"/><rect x="18" y="28" width="12" height="6" rx="2" fill="currentColor" opacity="0.8"/><path d="M24 38l-4-4h8z" fill="currentColor"/></svg></span></div>
                        <h3>스택 / 재귀</h3>
                        <p>DFS는 <strong>스택</strong> 또는 <strong>재귀</strong>로 구현합니다.<br>가장 최근 방문한 곳부터 탐색!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 24l4 4 8-8" stroke="#00b894" stroke-width="3" fill="none"/></svg></span></div>
                        <h3>방문 체크 (visited)</h3>
                        <p>한 번 방문한 정점은 다시 방문하지 않습니다.<br><strong>visited 배열</strong>로 체크합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><path d="M10 38 L24 8 L38 38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 8 L24 28" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/><path d="M24 28 L10 38" stroke="#e74c3c" stroke-width="2.5"/><circle cx="24" cy="28" r="3" fill="#e74c3c"/></svg></span></div>
                        <h3>백트래킹</h3>
                        <p>막다른 길에 도달하면 되돌아갑니다.<br>스택/재귀가 자동으로 처리해 줍니다!</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># DFS — 재귀 방식
def dfs(v):
    visited[v] = True
    for u in graph[v]:
        if not visited[u]:
            dfs(u)

# DFS — 스택 방식
def dfs_stack(start):
    stack = [start]
    visited[start] = True
    while stack:
        v = stack.pop()
        for u in graph[v]:
            if not visited[u]:
                visited[u] = True
                stack.append(u)</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">그래프가 1-2, 1-3, 2-4, 2-5일 때, 1번에서 DFS를 시작하면 방문 순서는? (작은 번호부터 방문)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>1 → 2 → 4 → 5 → 3</strong> 순서입니다!<br>
                        1에서 시작 → 이웃 중 작은 2로 이동 → 2의 이웃 중 미방문인 4로 → 4는 막다른 길이니 돌아와서 5로 → 돌아와서 3으로!<br>
                        한 길로 끝까지 간 다음 돌아오는 모습이 보이시나요?
                    </div>
                </div>
            </div>

            <!-- ③ BFS (너비 우선 탐색) -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> BFS (너비 우선 탐색)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 연못에 돌멩이를 던지면 <strong>동그란 물결</strong>이 점점 퍼져나갑니다!<br><br>
                    BFS도 마찬가지입니다. 시작점에서 <strong>가까운 곳부터</strong> 차례대로 탐색합니다.<br>
                    거리 1인 곳을 모두 방문 → 거리 2인 곳을 모두 방문 → 거리 3인 곳을 ... <br><br>
                    그래서 BFS로 탐색하면 <strong>최단 거리</strong>를 자동으로 구할 수 있습니다!
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="16" width="40" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="24" r="4" fill="currentColor" opacity="0.3"/><circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5"/><circle cx="36" cy="24" r="4" fill="currentColor" opacity="0.8"/><path d="M4 24l-2-3M4 24l-2 3" stroke="currentColor" stroke-width="2"/><path d="M44 24l2-3M44 24l2 3" stroke="currentColor" stroke-width="2"/></svg></span></div>
                        <h3>큐(Queue) 사용</h3>
                        <p>BFS는 <strong>큐</strong>를 사용합니다.<br>먼저 넣은 것을 먼저 꺼냅니다 (FIFO).</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="12" r="6" fill="none" stroke="#00b894" stroke-width="2"/><text x="24" y="15" text-anchor="middle" font-size="9" fill="#00b894">0</text><circle cx="14" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><line x1="20" y1="17" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="17" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>
                        <h3>거리(Level) 계산</h3>
                        <p>시작점 거리 = 0<br>이웃의 거리 = 현재 거리 + 1</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="4" fill="#00b894"/><circle cx="24" cy="24" r="4" fill="#fdcb6e"/><circle cx="40" cy="24" r="4" fill="#e17055"/><path d="M12 24h8M28 24h8" stroke="currentColor" stroke-width="2"/><text x="24" y="40" text-anchor="middle" font-size="8" fill="currentColor">최단!</text></svg></span></div>
                        <h3>최단 거리 보장</h3>
                        <p>간선 가중치가 모두 1일 때<br>BFS = <strong>최단 거리</strong>를 보장합니다!</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># BFS — 큐 사용
from collections import deque

def bfs(start):
    queue = deque([start])
    visited[start] = True
    dist[start] = 0

    while queue:
        v = queue.popleft()
        for u in graph[v]:
            if not visited[u]:
                visited[u] = True
                dist[u] = dist[v] + 1
                queue.append(u)</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">DFS와 BFS 중, 미로에서 출구까지의 최단 경로를 찾으려면 어떤 것을 써야 할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>BFS</strong>를 써야 합니다!<br>
                        BFS는 가까운 곳부터 탐색하므로, 출구에 처음 도달했을 때가 <strong>최단 거리</strong>입니다.<br>
                        DFS는 한 방향으로 깊이 들어가므로, 먼 길을 돌아갈 수도 있습니다.
                    </div>
                </div>
            </div>

            <!-- ④ 그리드에서의 탐색 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 그리드에서의 탐색</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 바둑판 위에서 상하좌우로 이동한다고 생각해 보세요!<br><br>
                    격자(Grid)에서는 각 칸이 <strong>정점</strong>이고, 상하좌우 이웃 칸으로 가는 것이 <strong>간선</strong>입니다.<br>
                    "이 칸에서 갈 수 있는 곳"은 위, 아래, 왼쪽, 오른쪽 4방향뿐입니다!<br><br>
                    격자 밖으로 나가거나 벽을 통과하면 안 되니까 <strong>범위 체크</strong>가 중요합니다.
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="4" fill="#0984e3"/><path d="M24 16v-6M24 32v6M16 24h-6M32 24h6" stroke="#0984e3" stroke-width="2.5" stroke-linecap="round"/><text x="24" y="8" text-anchor="middle" font-size="7" fill="currentColor">↑</text><text x="24" y="46" text-anchor="middle" font-size="7" fill="currentColor">↓</text><text x="4" y="27" text-anchor="middle" font-size="7" fill="currentColor">←</text><text x="44" y="27" text-anchor="middle" font-size="7" fill="currentColor">→</text></svg></span></div>
                        <h3>dx/dy 배열</h3>
                        <p>상하좌우 이동을 배열로 표현합니다.<br>dx = [0, 0, 1, -1]<br>dy = [1, -1, 0, 0]</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="8" y="8" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/><circle cx="24" cy="24" r="3" fill="#00b894"/><line x1="24" y1="24" x2="24" y2="8" stroke="#e74c3c" stroke-width="2"/><text x="28" y="12" font-size="8" fill="#e74c3c">✗</text></svg></span></div>
                        <h3>범위 체크</h3>
                        <p>이동할 칸이 격자 안에 있는지,<br>벽이 아닌지 반드시 확인합니다!</p>
                    </div>
                </div>

                <div class="code-block"><pre><code class="language-python"># 격자 탐색 패턴 (BFS)
dx = [0, 0, 1, -1]  # 상하좌우
dy = [1, -1, 0, 0]

for d in range(4):
    nx, ny = x + dx[d], y + dy[d]
    # 범위 체크: 격자 안에 있는지?
    if 0 <= nx < N and 0 <= ny < M:
        # 벽이 아니고, 방문하지 않았으면?
        if grid[nx][ny] != 0 and not visited[nx][ny]:
            visited[nx][ny] = True
            queue.append((nx, ny))</code></pre></div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">5×5 격자에서 (2, 3) 칸의 상하좌우 이웃은 어디일까요? (0-indexed)</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        상: (1, 3), 하: (3, 3), 좌: (2, 2), 우: (2, 4)<br>
                        모두 0~4 범위 안에 있으므로 4개 다 유효합니다!<br>
                        만약 (0, 0)이었다면? 상: (-1, 0)과 좌: (0, -1)은 범위 밖이므로 2개만 유효합니다.
                    </div>
                </div>
            </div>

            <!-- ⑤ 문제 유형 정리 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> 그래프 탐색 문제 유형 정리</div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="4" fill="#0984e3"/><circle cx="24" cy="14" r="4" fill="#0984e3"/><line x1="16" y1="14" x2="20" y2="14" stroke="#0984e3" stroke-width="2"/><circle cx="12" cy="34" r="4" fill="#e17055"/><circle cx="24" cy="34" r="4" fill="#e17055"/><circle cx="36" cy="34" r="4" fill="#e17055"/><line x1="16" y1="34" x2="20" y2="34" stroke="#e17055" stroke-width="2"/><line x1="28" y1="34" x2="32" y2="34" stroke="#e17055" stroke-width="2"/></svg></span></div>
                        <h3>① 연결 요소 세기</h3>
                        <p>DFS/BFS로 한 덩어리씩 탐색하여 <strong>몇 개의 그룹</strong>이 있는지 셉니다.<br>예: 바이러스 전파, 단지 수 세기</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="5" fill="#00b894"/><circle cx="24" cy="24" r="5" fill="#fdcb6e"/><circle cx="40" cy="24" r="5" fill="#e17055"/><path d="M13 24h6M29 24h6" stroke="currentColor" stroke-width="2"/><text x="8" y="27" text-anchor="middle" font-size="8" fill="white">0</text><text x="24" y="27" text-anchor="middle" font-size="8" fill="white">1</text><text x="40" y="27" text-anchor="middle" font-size="8" fill="white">2</text></svg></span></div>
                        <h3>② BFS 최단 거리</h3>
                        <p>모든 간선 가중치가 1일 때, BFS로 <strong>최단 거리</strong>를 구합니다.<br>예: 미로 탈출, 숨바꼭질</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="5" fill="#e74c3c"/><circle cx="36" cy="14" r="5" fill="#e74c3c"/><circle cx="24" cy="38" r="5" fill="#fdcb6e"/><path d="M14 19l8 14M34 19l-8 14" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>
                        <h3>③ 다중 시작점 BFS</h3>
                        <p>여러 시작점을 큐에 동시에 넣고 BFS합니다.<br>예: 토마토 익히기 (여러 곳에서 동시에 퍼짐)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="13" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="35" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="13" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+상태</text><text x="35" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+상태</text></svg></span></div>
                        <h3>④ 상태 확장 BFS</h3>
                        <p>방문 배열에 추가 정보를 넣습니다.<br>예: visited[x][y][벽을 부쉈는지]</p>
                    </div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"격자에서 1인 칸끼리 연결된 덩어리가 몇 개인지 세기" — 어떤 유형의 문제일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>① 연결 요소 세기</strong> 유형입니다!<br>
                        격자를 순회하면서 아직 방문하지 않은 1을 발견하면 DFS/BFS로 연결된 모든 1을 방문합니다.<br>
                        이것을 <strong>Flood Fill</strong>이라고도 합니다. DFS/BFS를 시작한 횟수가 곧 덩어리 수입니다!
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
                <button class="viz-tab active" data-viz="dfsbfs">DFS vs BFS 비교</button>
                <button class="viz-tab" data-viz="gridbfs">그리드 BFS 최단 경로</button>
            </div>
            <div id="graph-viz-content"></div>
        `;

        const vizContent = container.querySelector('#graph-viz-content');
        const tabs = container.querySelectorAll('.viz-tab');
        const self = this;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                self._clearVizState();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.viz === 'dfsbfs') self._renderVizDfsBfs(vizContent);
                else self._renderVizGridBfs(vizContent);
            });
        });

        this._renderVizDfsBfs(vizContent);
    },

    // ===== DFS vs BFS 비교 시각화 =====
    _renderVizDfsBfs(container) {
        const NODE_POS = {
            1: { x: 250, y: 45 },
            2: { x: 130, y: 130 },
            3: { x: 370, y: 130 },
            4: { x: 70, y: 220 },
            5: { x: 190, y: 220 },
            6: { x: 430, y: 220 },
            7: { x: 250, y: 305 }
        };
        const EDGES = [[1,2],[1,3],[2,4],[2,5],[3,6],[5,7]];
        const ADJ = { 1:[2,3], 2:[1,4,5], 3:[1,6], 4:[2], 5:[2,7], 6:[3], 7:[5] };

        let svgEdges = '';
        EDGES.forEach(([a, b]) => {
            svgEdges += `<line id="ge-${a}-${b}" class="graph-edge" x1="${NODE_POS[a].x}" y1="${NODE_POS[a].y}" x2="${NODE_POS[b].x}" y2="${NODE_POS[b].y}"/>`;
        });
        let svgNodes = '';
        for (let id = 1; id <= 7; id++) {
            const { x, y } = NODE_POS[id];
            svgNodes += `<circle id="gn-${id}" class="graph-node" cx="${x}" cy="${y}" r="22"/>`;
            svgNodes += `<text class="graph-node-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${id}</text>`;
        }

        container.innerHTML = `
            <div class="viz-card">
                <h3>DFS vs BFS 비교</h3>
                <p style="color:var(--text2);margin-bottom:12px;">7개 노드 그래프에서 DFS와 BFS가 어떻게 탐색하는지 비교합니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
                    <button class="btn btn-primary" id="graph-dfs-btn">DFS 시작</button>
                    <button class="btn btn-primary" id="graph-bfs-btn">BFS 시작</button>
                </div>
                <div class="graph-svg-container">
                    <svg viewBox="0 0 500 350" width="100%" height="350">
                        ${svgEdges}
                        ${svgNodes}
                    </svg>
                </div>
                <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;align-items:flex-start;">
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:600;margin-bottom:4px;" id="graph-ds-label">스택/큐</div>
                        <div class="graph-queue-display" id="graph-ds-display"></div>
                    </div>
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:600;margin-bottom:4px;">방문 순서</div>
                        <div class="graph-queue-display" id="graph-visit-order"></div>
                    </div>
                </div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--border);vertical-align:middle;margin-right:4px;"></span> 미방문</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);vertical-align:middle;margin-right:4px;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,var(--accent-vivid),var(--accent2));vertical-align:middle;margin-right:4px;"></span> 방문 완료</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;border:2px dashed var(--green);vertical-align:middle;margin-right:4px;"></span> 대기 중</span>
            </div>
        `;

        const self = this;
        const svgEl = container.querySelector('svg');
        const dsLabel = container.querySelector('#graph-ds-label');
        const dsDisplay = container.querySelector('#graph-ds-display');
        const visitOrder = container.querySelector('#graph-visit-order');

        function resetGraph() {
            self._clearVizState();
            for (let i = 1; i <= 7; i++) {
                const c = svgEl.querySelector(`#gn-${i}`);
                c.setAttribute('class', 'graph-node');
            }
            EDGES.forEach(([a, b]) => {
                svgEl.querySelector(`#ge-${a}-${b}`).setAttribute('class', 'graph-edge');
            });
            dsDisplay.innerHTML = '';
            visitOrder.innerHTML = '';
        }

        function setNodeClass(id, cls) {
            svgEl.querySelector(`#gn-${id}`).setAttribute('class', 'graph-node ' + cls);
        }
        function setEdgeClass(a, b, cls) {
            const el = svgEl.querySelector(`#ge-${a}-${b}`) || svgEl.querySelector(`#ge-${b}-${a}`);
            if (el) el.setAttribute('class', 'graph-edge ' + cls);
        }
        function renderDS(arr, type) {
            dsDisplay.innerHTML = arr.map(v => `<span class="graph-queue-item">${v}</span>`).join('');
            dsLabel.textContent = type === 'dfs' ? '스택 (Stack)' : '큐 (Queue)';
        }
        function renderVisitOrder(arr) {
            visitOrder.innerHTML = arr.map((v, i) => `<span class="graph-queue-item visited">${v}</span>`).join('');
        }

        // Build DFS steps
        function buildDfsSteps() {
            resetGraph();
            const steps = [];
            const visited = new Set();
            const order = [];
            const stack = [];
            const nodeStates = {};
            const edgeStates = {};
            for (let i = 1; i <= 7; i++) nodeStates[i] = '';
            EDGES.forEach(([a, b]) => edgeStates[a + '-' + b] = '');

            function saveState() {
                return {
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    stack: [...stack],
                    order: [...order],
                    visited: new Set(visited)
                };
            }
            function restoreState(s) {
                for (let i = 1; i <= 7; i++) { nodeStates[i] = s.nodeStates[i]; setNodeClass(i, s.nodeStates[i]); }
                EDGES.forEach(([a, b]) => { edgeStates[a + '-' + b] = s.edgeStates[a + '-' + b]; setEdgeClass(a, b, s.edgeStates[a + '-' + b]); });
                stack.length = 0; stack.push(...s.stack);
                order.length = 0; order.push(...s.order);
                visited.clear(); s.visited.forEach(v => visited.add(v));
                renderDS(stack, 'dfs');
                renderVisitOrder(order);
            }

            // Step: push start
            stack.push(1);
            const s0 = saveState();
            steps.push({
                description: '시작 정점 1을 스택에 넣습니다.',
                action() {
                    stack.push(1);
                    nodeStates[1] = 'queued'; setNodeClass(1, 'queued');
                    renderDS(stack, 'dfs');
                },
                undo() { restoreState(s0); stack.length = 0; renderDS([], 'dfs'); nodeStates[1] = ''; setNodeClass(1, ''); }
            });

            // Simulate DFS
            const simStack = [1];
            const simVisited = new Set();
            while (simStack.length > 0) {
                const v = simStack.pop();
                if (simVisited.has(v)) {
                    const beforeSkip = saveState();
                    const capturedV = v;
                    steps.push({
                        description: `스택에서 ${v}을 꺼냈지만 이미 방문했으므로 건너뜁니다.`,
                        action() {
                            const idx = stack.lastIndexOf(capturedV);
                            if (idx >= 0) stack.splice(idx, 1);
                            renderDS(stack, 'dfs');
                        },
                        undo() { restoreState(beforeSkip); }
                    });
                    continue;
                }
                simVisited.add(v);

                const beforeVisit = saveState();
                const capturedV2 = v;
                steps.push({
                    description: `스택에서 ${v}을 꺼내 방문합니다.`,
                    action() {
                        visited.add(capturedV2);
                        order.push(capturedV2);
                        const idx = stack.lastIndexOf(capturedV2);
                        if (idx >= 0) stack.splice(idx, 1);
                        nodeStates[capturedV2] = 'active'; setNodeClass(capturedV2, 'active');
                        renderDS(stack, 'dfs');
                        renderVisitOrder(order);
                    },
                    undo() { restoreState(beforeVisit); }
                });

                const neighbors = ADJ[v].slice().sort((a, b) => b - a); // reverse for stack
                const unvisitedNeighbors = neighbors.filter(n => !simVisited.has(n));

                if (unvisitedNeighbors.length > 0) {
                    const beforePush = saveState();
                    // We need to capture state AFTER the visit step
                    const capturedV3 = v;
                    const capturedNeighbors = [...unvisitedNeighbors];
                    capturedNeighbors.forEach(n => simStack.push(n));

                    steps.push({
                        description: `정점 ${v}의 이웃 [${unvisitedNeighbors.slice().reverse().join(', ')}]을 스택에 추가합니다.`,
                        action() {
                            nodeStates[capturedV3] = 'visited'; setNodeClass(capturedV3, 'visited');
                            capturedNeighbors.forEach(n => {
                                stack.push(n);
                                if (!visited.has(n)) {
                                    setEdgeClass(capturedV3, n, 'active');
                                    if (nodeStates[n] !== 'visited') { nodeStates[n] = 'queued'; setNodeClass(n, 'queued'); }
                                }
                            });
                            renderDS(stack, 'dfs');
                        },
                        undo() { restoreState(beforePush); }
                    });
                } else {
                    const beforeDone = saveState();
                    const capturedV4 = v;
                    steps.push({
                        description: `정점 ${v}의 미방문 이웃이 없습니다. (백트래킹)`,
                        action() {
                            nodeStates[capturedV4] = 'visited'; setNodeClass(capturedV4, 'visited');
                            renderDS(stack, 'dfs');
                        },
                        undo() { restoreState(beforeDone); }
                    });
                }
            }

            // Final step
            const beforeFinal = saveState();
            steps.push({
                description: `탐색 완료! 방문 순서: ${[...simVisited].join(' → ')}`,
                action() {
                    for (let i = 1; i <= 7; i++) { nodeStates[i] = 'visited'; setNodeClass(i, 'visited'); }
                    EDGES.forEach(([a, b]) => setEdgeClass(a, b, 'visited'));
                    renderDS([], 'dfs');
                },
                undo() { restoreState(beforeFinal); }
            });

            return steps;
        }

        // Build BFS steps
        function buildBfsSteps() {
            resetGraph();
            const steps = [];
            const visited = new Set();
            const order = [];
            const queue = [];
            const nodeStates = {};
            const edgeStates = {};
            for (let i = 1; i <= 7; i++) nodeStates[i] = '';
            EDGES.forEach(([a, b]) => edgeStates[a + '-' + b] = '');

            function saveState() {
                return {
                    nodeStates: { ...nodeStates },
                    edgeStates: { ...edgeStates },
                    queue: [...queue],
                    order: [...order],
                    visited: new Set(visited)
                };
            }
            function restoreState(s) {
                for (let i = 1; i <= 7; i++) { nodeStates[i] = s.nodeStates[i]; setNodeClass(i, s.nodeStates[i]); }
                EDGES.forEach(([a, b]) => { edgeStates[a + '-' + b] = s.edgeStates[a + '-' + b]; setEdgeClass(a, b, s.edgeStates[a + '-' + b]); });
                queue.length = 0; queue.push(...s.queue);
                order.length = 0; order.push(...s.order);
                visited.clear(); s.visited.forEach(v => visited.add(v));
                renderDS(queue, 'bfs');
                renderVisitOrder(order);
            }

            // Step: enqueue start
            const s0 = saveState();
            steps.push({
                description: '시작 정점 1을 큐에 넣고 방문 표시합니다.',
                action() {
                    queue.push(1);
                    visited.add(1);
                    nodeStates[1] = 'queued'; setNodeClass(1, 'queued');
                    renderDS(queue, 'bfs');
                },
                undo() { restoreState(s0); }
            });

            // Simulate BFS
            const simQueue = [1];
            const simVisited = new Set([1]);
            const simDist = { 1: 0 };
            while (simQueue.length > 0) {
                const v = simQueue.shift();
                const dist = simDist[v];
                const beforeVisit = saveState();
                const capturedV = v;
                const capturedDist = dist;

                steps.push({
                    description: `큐에서 ${v}을 꺼내 방문합니다. (거리 ${dist})`,
                    action() {
                        queue.shift();
                        order.push(capturedV);
                        nodeStates[capturedV] = 'active'; setNodeClass(capturedV, 'active');
                        renderDS(queue, 'bfs');
                        renderVisitOrder(order);
                    },
                    undo() { restoreState(beforeVisit); }
                });

                const neighbors = ADJ[v].slice().sort((a, b) => a - b);
                const newNeighbors = neighbors.filter(n => !simVisited.has(n));
                newNeighbors.forEach(n => { simVisited.add(n); simQueue.push(n); simDist[n] = dist + 1; });

                if (newNeighbors.length > 0) {
                    const beforeEnqueue = saveState();
                    const capturedV2 = v;
                    const capturedNew = [...newNeighbors];
                    steps.push({
                        description: `정점 ${v}의 이웃 [${newNeighbors.join(', ')}]을 큐에 추가합니다.`,
                        action() {
                            nodeStates[capturedV2] = 'visited'; setNodeClass(capturedV2, 'visited');
                            capturedNew.forEach(n => {
                                visited.add(n);
                                queue.push(n);
                                setEdgeClass(capturedV2, n, 'active');
                                nodeStates[n] = 'queued'; setNodeClass(n, 'queued');
                            });
                            renderDS(queue, 'bfs');
                        },
                        undo() { restoreState(beforeEnqueue); }
                    });
                } else {
                    const beforeDone = saveState();
                    const capturedV3 = v;
                    steps.push({
                        description: `정점 ${v}의 미방문 이웃이 없습니다.`,
                        action() {
                            nodeStates[capturedV3] = 'visited'; setNodeClass(capturedV3, 'visited');
                            renderDS(queue, 'bfs');
                        },
                        undo() { restoreState(beforeDone); }
                    });
                }
            }

            const beforeFinal = saveState();
            steps.push({
                description: '탐색 완료! BFS는 가까운 곳부터 방문합니다: 1 → 2 → 3 → 4 → 5 → 6 → 7',
                action() {
                    for (let i = 1; i <= 7; i++) { nodeStates[i] = 'visited'; setNodeClass(i, 'visited'); }
                    EDGES.forEach(([a, b]) => setEdgeClass(a, b, 'visited'));
                    renderDS([], 'bfs');
                },
                undo() { restoreState(beforeFinal); }
            });

            return steps;
        }

        container.querySelector('#graph-dfs-btn').addEventListener('click', () => {
            resetGraph();
            const steps = buildDfsSteps();
            self._initStepController(container, steps);
        });

        container.querySelector('#graph-bfs-btn').addEventListener('click', () => {
            resetGraph();
            const steps = buildBfsSteps();
            self._initStepController(container, steps);
        });
    },

    // ===== 그리드 BFS 최단 경로 시각화 =====
    _renderVizGridBfs(container) {
        const ROWS = 6, COLS = 6;
        const GRID = [
            [0,0,0,1,0,0],
            [0,1,0,1,0,0],
            [0,1,0,0,0,1],
            [0,0,1,1,0,0],
            [1,0,0,0,1,0],
            [0,0,1,0,0,0]
        ];
        const START = [0, 0], END = [5, 5];

        let cellsHTML = '';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                let cls = 'graph-grid-cell';
                let label = '';
                if (GRID[r][c] === 1) { cls += ' wall'; label = '■'; }
                else if (r === START[0] && c === START[1]) { cls += ' start'; label = 'S'; }
                else if (r === END[0] && c === END[1]) { cls += ' end'; label = 'E'; }
                cellsHTML += `<div id="gc-${r}-${c}" class="${cls}"><span class="graph-grid-cell-dist">${label}</span></div>`;
            }
        }

        container.innerHTML = `
            <div class="viz-card">
                <h3>그리드 BFS 최단 경로</h3>
                <p style="color:var(--text2);margin-bottom:12px;">6×6 격자에서 S(시작)→E(도착)까지 BFS로 최단 경로를 찾습니다. ■은 벽입니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button class="btn btn-primary" id="grid-bfs-start-btn">BFS 시작</button>
                </div>
                <div class="graph-grid-container" style="grid-template-columns: repeat(${COLS}, 44px);">
                    ${cellsHTML}
                </div>
                <div style="margin-top:12px;">
                    <div style="font-weight:600;margin-bottom:4px;">큐 (Queue)</div>
                    <div class="graph-queue-display" id="grid-queue-display" style="min-height:36px;"></div>
                </div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;background:#2d3436;border-radius:3px;vertical-align:middle;margin-right:4px;"></span> 벽</span>
                <span><span style="display:inline-block;width:14px;height:14px;background:var(--green);border-radius:3px;vertical-align:middle;margin-right:4px;opacity:0.5;"></span> 시작/도착</span>
                <span><span style="display:inline-block;width:14px;height:14px;background:var(--yellow);border-radius:3px;vertical-align:middle;margin-right:4px;opacity:0.5;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;background:var(--accent);border-radius:3px;vertical-align:middle;margin-right:4px;opacity:0.3;"></span> 방문 완료</span>
                <span><span style="display:inline-block;width:14px;height:14px;background:var(--green);border-radius:3px;vertical-align:middle;margin-right:4px;opacity:0.3;"></span> 최단 경로</span>
            </div>
        `;

        const self = this;
        const queueDisplay = container.querySelector('#grid-queue-display');

        function getCell(r, c) { return container.querySelector(`#gc-${r}-${c}`); }
        function setCellClass(r, c, cls) {
            const cell = getCell(r, c);
            if (cell) cell.className = 'graph-grid-cell ' + cls;
        }
        function setCellDist(r, c, val) {
            const cell = getCell(r, c);
            if (cell) cell.querySelector('.graph-grid-cell-dist').textContent = val;
        }
        function renderQueue(arr) {
            queueDisplay.innerHTML = arr.map(([r, c]) => `<span class="graph-queue-item">(${r},${c})</span>`).join('');
        }

        function resetGrid() {
            self._clearVizState();
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    let cls = '';
                    let label = '';
                    if (GRID[r][c] === 1) { cls = 'wall'; label = '■'; }
                    else if (r === START[0] && c === START[1]) { cls = 'start'; label = 'S'; }
                    else if (r === END[0] && c === END[1]) { cls = 'end'; label = 'E'; }
                    setCellClass(r, c, cls);
                    setCellDist(r, c, label);
                }
            }
            queueDisplay.innerHTML = '';
        }

        function buildGridBfsSteps() {
            resetGrid();
            const steps = [];
            const dx = [0, 0, 1, -1], dy = [1, -1, 0, 0];
            const dist = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
            const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
            const cellStates = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
            for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
                if (GRID[r][c] === 1) cellStates[r][c] = 'wall';
                else if (r === START[0] && c === START[1]) cellStates[r][c] = 'start';
                else if (r === END[0] && c === END[1]) cellStates[r][c] = 'end';
            }
            const queue = [];

            function saveState() {
                return {
                    dist: dist.map(r => [...r]),
                    prev: prev.map(r => [...r]),
                    cellStates: cellStates.map(r => [...r]),
                    queue: queue.map(q => [...q])
                };
            }
            function restoreState(s) {
                for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
                    dist[r][c] = s.dist[r][c];
                    prev[r][c] = s.prev[r][c];
                    cellStates[r][c] = s.cellStates[r][c];
                    setCellClass(r, c, s.cellStates[r][c]);
                    if (GRID[r][c] === 1) setCellDist(r, c, '■');
                    else if (s.dist[r][c] >= 0) setCellDist(r, c, s.dist[r][c]);
                    else if (r === START[0] && c === START[1]) setCellDist(r, c, 'S');
                    else if (r === END[0] && c === END[1]) setCellDist(r, c, 'E');
                    else setCellDist(r, c, '');
                }
                queue.length = 0; s.queue.forEach(q => queue.push(q));
                renderQueue(queue);
            }

            // Precompute BFS
            const simQueue = [[START[0], START[1]]];
            const simDist = Array.from({ length: ROWS }, () => Array(COLS).fill(-1));
            const simPrev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
            simDist[START[0]][START[1]] = 0;

            // Step 0: init
            const s0 = saveState();
            steps.push({
                description: `시작점 (${START[0]},${START[1]})에서 BFS를 시작합니다. 거리 = 0`,
                action() {
                    dist[START[0]][START[1]] = 0;
                    queue.push([START[0], START[1]]);
                    cellStates[START[0]][START[1]] = 'start active';
                    setCellClass(START[0], START[1], 'start active');
                    setCellDist(START[0], START[1], '0');
                    renderQueue(queue);
                },
                undo() { restoreState(s0); }
            });

            while (simQueue.length > 0) {
                const [r, c] = simQueue.shift();
                const d = simDist[r][c];

                const beforeProcess = saveState();
                const cr = r, cc = c, cd = d;
                const newCells = [];

                for (let i = 0; i < 4; i++) {
                    const nr = r + dx[i], nc = c + dy[i];
                    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
                    if (GRID[nr][nc] === 1 || simDist[nr][nc] >= 0) continue;
                    simDist[nr][nc] = d + 1;
                    simPrev[nr][nc] = [r, c];
                    simQueue.push([nr, nc]);
                    newCells.push([nr, nc, d + 1]);
                }

                if (newCells.length > 0) {
                    const capturedNew = newCells.map(x => [...x]);
                    steps.push({
                        description: `(${cr},${cc})를 처리합니다 (거리 ${cd}). 이웃 ${capturedNew.map(([r,c]) => `(${r},${c})`).join(', ')}을 큐에 추가합니다.`,
                        action() {
                            // Remove current from queue
                            const idx = queue.findIndex(q => q[0] === cr && q[1] === cc);
                            if (idx >= 0) queue.splice(idx, 1);
                            // Mark current as visited
                            cellStates[cr][cc] = 'visited';
                            setCellClass(cr, cc, 'active');
                            setCellDist(cr, cc, cd);
                            // Add neighbors
                            capturedNew.forEach(([nr, nc, nd]) => {
                                dist[nr][nc] = nd;
                                prev[nr][nc] = [cr, cc];
                                queue.push([nr, nc]);
                                cellStates[nr][nc] = 'queued';
                                setCellClass(nr, nc, 'queued');
                                setCellDist(nr, nc, nd);
                            });
                            renderQueue(queue);
                            // After brief highlight, set current to visited
                            setTimeout(() => {
                                setCellClass(cr, cc, 'visited');
                            }, 300);
                        },
                        undo() { restoreState(beforeProcess); }
                    });
                } else {
                    steps.push({
                        description: `(${cr},${cc})를 처리합니다 (거리 ${cd}). 추가할 이웃이 없습니다.`,
                        action() {
                            const idx = queue.findIndex(q => q[0] === cr && q[1] === cc);
                            if (idx >= 0) queue.splice(idx, 1);
                            cellStates[cr][cc] = 'visited';
                            setCellClass(cr, cc, 'visited');
                            setCellDist(cr, cc, cd);
                            renderQueue(queue);
                        },
                        undo() { restoreState(beforeProcess); }
                    });
                }
            }

            // Final step: trace path
            const path = [];
            let pr = END[0], pc = END[1];
            while (pr !== START[0] || pc !== START[1]) {
                path.push([pr, pc]);
                const p = simPrev[pr][pc];
                if (!p) break;
                [pr, pc] = p;
            }
            path.push([START[0], START[1]]);
            path.reverse();

            const beforePath = saveState();
            const capturedPath = path.map(p => [...p]);
            const finalDist = simDist[END[0]][END[1]];
            steps.push({
                description: `최단 경로를 찾았습니다! 거리 = ${finalDist}, 경로: ${capturedPath.map(([r,c]) => `(${r},${c})`).join(' → ')}`,
                action() {
                    capturedPath.forEach(([r, c]) => {
                        setCellClass(r, c, 'path');
                    });
                    renderQueue([]);
                },
                undo() { restoreState(beforePath); }
            });

            return steps;
        }

        container.querySelector('#grid-bfs-start-btn').addEventListener('click', () => {
            resetGrid();
            const steps = buildGridBfsSteps();
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
        { num: 1, title: 'DFS/BFS 기본', desc: 'DFS와 BFS의 기본 구현을 연습합니다 (Silver II~III)', problemIds: ['boj-2606', 'boj-24479', 'boj-24480', 'boj-24444', 'boj-24445', 'boj-1260'] },
        { num: 2, title: '그리드 탐색과 Flood Fill', desc: '격자에서 연결 요소를 탐색합니다 (Silver I~II)', problemIds: ['boj-1012', 'boj-2667'] },
        { num: 3, title: 'BFS 최단 거리', desc: 'BFS로 최단 거리를 구합니다 (Silver I)', problemIds: ['boj-2178', 'boj-1697', 'boj-7562'] },
        { num: 4, title: '심화 BFS', desc: '다중 시작점, 상태 확장 BFS (Gold III~V)', problemIds: ['boj-7576', 'boj-7569', 'boj-16928', 'boj-1707', 'boj-2206'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: DFS/BFS 기본 =====
        {
            id: 'boj-2606',
            title: 'BOJ 2606 - 바이러스',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2606',
            descriptionHTML: `
                <h3>문제</h3>
                <p>어느 날 1번 컴퓨터가 웜 바이러스에 걸렸습니다. 1번 컴퓨터가 바이러스에 걸리면 네트워크를 통해 연결된 다른 컴퓨터도 바이러스에 감염됩니다.</p>
                <p>컴퓨터의 수와 네트워크 연결 정보가 주어질 때, 1번 컴퓨터를 통해 바이러스에 감염되는 컴퓨터의 수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: 컴퓨터 수 N (≤100)<br>둘째 줄: 연결 수<br>이후: 연결 쌍</p></div>
                    <div><h4>출력</h4><p>1번 컴퓨터를 통해 감염되는 컴퓨터 수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7
6
1 2
2 3
1 5
5 2
5 6
4 7</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>`,
            hints: [
                { title: '어떤 알고리즘을 쓸까?', content: '1번 컴퓨터에서 출발하여 연결된 모든 컴퓨터를 찾는 문제입니다. <strong>DFS 또는 BFS</strong>로 탐색하면 됩니다!' },
                { title: '핵심 아이디어', content: '인접 리스트를 만들고, 1번에서 DFS/BFS를 시작합니다. 방문한 컴퓨터의 개수에서 1번 자신을 빼면 정답입니다.' },
                { title: '정답 코드 구조', content: '<code>graph[u].append(v), graph[v].append(u)</code>로 인접 리스트를 만들고,<br>1번에서 BFS 또는 DFS를 돌려서 <code>len(visited) - 1</code>을 출력합니다.' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N = int(input())
M = int(input())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

visited = [False] * (N + 1)
queue = deque([1])
visited[1] = True
count = 0

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            queue.append(u)
            count += 1

print(count)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(1);
    visited[1] = true;
    int count = 0;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                q.push(u);
                count++;
            }
        }
    }
    printf("%d\\n", count);
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), M = sc.nextInt();
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            int u = sc.nextInt(), v = sc.nextInt();
            graph.get(u).add(v);
            graph.get(v).add(u);
        }

        boolean[] visited = new boolean[N + 1];
        Queue<Integer> q = new LinkedList<>();
        q.add(1); visited[1] = true;
        int count = 0;
        while (!q.isEmpty()) {
            int v = q.poll();
            for (int u : graph.get(v)) {
                if (!visited[u]) {
                    visited[u] = true;
                    q.add(u);
                    count++;
                }
            }
        }
        System.out.println(count);
    }
}`
            }
        },
        {
            id: 'boj-24479',
            title: 'BOJ 24479 - 깊이 우선 탐색 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24479',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 DFS로 탐색할 때, 각 정점의 방문 순서를 출력하세요.</p>
                <p>인접 정점은 <strong>오름차순</strong>으로 방문합니다. 방문하지 못하는 정점은 0을 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M, R (정점 수, 간선 수, 시작 정점)</p></div>
                    <div><h4>출력</h4><p>각 정점의 방문 순서 (N줄)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
2
3
4
0</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '인접 리스트를 <strong>오름차순 정렬</strong>한 후 재귀 DFS를 수행합니다. 방문할 때마다 순서를 기록합니다.' },
                { title: '구현 포인트', content: '<code>order[v] = ++cnt</code>로 방문 순서를 기록합니다.<br>재귀 DFS에서 이웃을 순서대로 방문하면 됩니다.' }
            ],
            inputDefault: 0,
            solve() { return '1\n2\n3\n4\n0'; },
            templates: {
                python: `import sys
sys.setrecursionlimit(200000)
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()  # 오름차순 정렬

order = [0] * (N + 1)
cnt = 0

def dfs(v):
    global cnt
    cnt += 1
    order[v] = cnt
    for u in graph[v]:
        if order[u] == 0:
            dfs(u)

dfs(R)
for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int N, M, R, cnt = 0;
vector<int> graph[100001];
int order_arr[100001];

void dfs(int v) {
    order_arr[v] = ++cnt;
    for (int u : graph[v]) {
        if (order_arr[u] == 0) dfs(u);
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &R);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());
    dfs(R);
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static List<List<Integer>> graph;
    static int[] order;
    static int cnt = 0;

    static void dfs(int v) {
        order[v] = ++cnt;
        for (int u : graph.get(v)) {
            if (order[u] == 0) dfs(u);
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int R = Integer.parseInt(st.nextToken());

        graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        for (int i = 1; i <= N; i++) Collections.sort(graph.get(i));
        order = new int[N + 1];
        dfs(R);
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= N; i++) sb.append(order[i]).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-24480',
            title: 'BOJ 24480 - 깊이 우선 탐색 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24480',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 DFS로 탐색할 때, 각 정점의 방문 순서를 출력하세요.</p>
                <p>인접 정점은 <strong>내림차순</strong>으로 방문합니다. 방문하지 못하는 정점은 0을 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M, R (정점 수, 간선 수, 시작 정점)</p></div>
                    <div><h4>출력</h4><p>각 정점의 방문 순서 (N줄)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
4
3
2
0</pre></div>
                </div></div>`,
            hints: [
                { title: '24479와 뭐가 다를까?', content: '24479번과 거의 같지만, 인접 리스트를 <strong>내림차순</strong>으로 정렬합니다.<br><code>graph[i].sort(reverse=True)</code> 한 줄만 바꾸면 됩니다!' },
                { title: '정답 코드 구조', content: '24479번 코드에서 정렬 방향만 바꿉니다:<br>Python: <code>sort(reverse=True)</code><br>C++: <code>sort(rbegin(), rend())</code>' }
            ],
            inputDefault: 0,
            solve() { return '1\n4\n3\n2\n0'; },
            templates: {
                python: `import sys
sys.setrecursionlimit(200000)
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort(reverse=True)  # 내림차순 정렬!

order = [0] * (N + 1)
cnt = 0

def dfs(v):
    global cnt
    cnt += 1
    order[v] = cnt
    for u in graph[v]:
        if order[u] == 0:
            dfs(u)

dfs(R)
for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int N, M, R, cnt = 0;
vector<int> graph[100001];
int order_arr[100001];

void dfs(int v) {
    order_arr[v] = ++cnt;
    for (int u : graph[v]) {
        if (order_arr[u] == 0) dfs(u);
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &R);
    for (int i = 0; i < M; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // 내림차순!
    dfs(R);
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static List<List<Integer>> graph;
    static int[] order;
    static int cnt = 0;

    static void dfs(int v) {
        order[v] = ++cnt;
        for (int u : graph.get(v)) {
            if (order[u] == 0) dfs(u);
        }
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int R = Integer.parseInt(st.nextToken());

        graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        for (int i = 1; i <= N; i++) graph.get(i).sort(Collections.reverseOrder()); // 내림차순!
        order = new int[N + 1];
        dfs(R);
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= N; i++) sb.append(order[i]).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-24444',
            title: 'BOJ 24444 - 너비 우선 탐색 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24444',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 BFS로 탐색할 때, 각 정점의 방문 순서를 출력하세요.</p>
                <p>인접 정점은 <strong>오름차순</strong>으로 방문합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M, R (정점 수, 간선 수, 시작 정점)</p></div>
                    <div><h4>출력</h4><p>각 정점의 방문 순서 (N줄)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
2
3
4
0</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: 'DFS 대신 <strong>BFS</strong>를 사용합니다. 큐(deque)에서 꺼낸 정점의 이웃을 <strong>오름차순</strong>으로 큐에 넣습니다.' },
                { title: '구현 포인트', content: '인접 리스트를 오름차순 정렬한 후, BFS를 수행하면서 <code>order[v] = ++cnt</code>로 순서를 기록합니다.' }
            ],
            inputDefault: 0,
            solve() { return '1\n2\n3\n4\n0'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()  # 오름차순

order = [0] * (N + 1)
cnt = 0

queue = deque([R])
visited = [False] * (N + 1)
visited[R] = True
cnt += 1
order[R] = cnt

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            cnt += 1
            order[u] = cnt
            queue.append(u)

for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M, R;
    scanf("%d %d %d", &N, &M, &R);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());

    vector<int> order_arr(N + 1, 0);
    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(R); visited[R] = true;
    int cnt = 0;
    order_arr[R] = ++cnt;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                order_arr[u] = ++cnt;
                q.push(u);
            }
        }
    }
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int R = Integer.parseInt(st.nextToken());

        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        for (int i = 1; i <= N; i++) Collections.sort(graph.get(i));

        int[] order = new int[N + 1];
        boolean[] visited = new boolean[N + 1];
        Queue<Integer> q = new LinkedList<>();
        q.add(R); visited[R] = true;
        int cnt = 0; order[R] = ++cnt;

        while (!q.isEmpty()) {
            int v = q.poll();
            for (int u : graph.get(v)) {
                if (!visited[u]) {
                    visited[u] = true;
                    order[u] = ++cnt;
                    q.add(u);
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= N; i++) sb.append(order[i]).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-24445',
            title: 'BOJ 24445 - 너비 우선 탐색 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24445',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 정점과 M개의 간선으로 구성된 무방향 그래프가 주어집니다. 정점 R에서 시작하여 BFS로 탐색할 때, 각 정점의 방문 순서를 출력하세요.</p>
                <p>인접 정점은 <strong>내림차순</strong>으로 방문합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M, R</p></div>
                    <div><h4>출력</h4><p>각 정점의 방문 순서 (N줄)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1
3
4
2
0</pre></div>
                </div></div>`,
            hints: [
                { title: '24444와 뭐가 다를까?', content: '24444번과 거의 같지만, 인접 리스트를 <strong>내림차순</strong>으로 정렬합니다.' },
                { title: '정답 코드 구조', content: '24444번 코드에서 정렬 방향만 바꿉니다:<br>Python: <code>sort(reverse=True)</code>' }
            ],
            inputDefault: 0,
            solve() { return '1\n3\n4\n2\n0'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M, R = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort(reverse=True)  # 내림차순!

order = [0] * (N + 1)
cnt = 0
queue = deque([R])
visited = [False] * (N + 1)
visited[R] = True
cnt += 1
order[R] = cnt

while queue:
    v = queue.popleft()
    for u in graph[v]:
        if not visited[u]:
            visited[u] = True
            cnt += 1
            order[u] = cnt
            queue.append(u)

for i in range(1, N + 1):
    print(order[i])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M, R;
    scanf("%d %d %d", &N, &M, &R);
    vector<vector<int>> graph(N + 1);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // 내림차순!

    vector<int> order_arr(N + 1, 0);
    vector<bool> visited(N + 1, false);
    queue<int> q;
    q.push(R); visited[R] = true;
    int cnt = 0; order_arr[R] = ++cnt;

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : graph[v]) {
            if (!visited[u]) {
                visited[u] = true;
                order_arr[u] = ++cnt;
                q.push(u);
            }
        }
    }
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int R = Integer.parseInt(st.nextToken());

        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        for (int i = 1; i <= N; i++) graph.get(i).sort(Collections.reverseOrder());

        int[] order = new int[N + 1];
        boolean[] visited = new boolean[N + 1];
        Queue<Integer> q = new LinkedList<>();
        q.add(R); visited[R] = true;
        int cnt = 0; order[R] = ++cnt;

        while (!q.isEmpty()) {
            int v = q.poll();
            for (int u : graph.get(v)) {
                if (!visited[u]) {
                    visited[u] = true;
                    order[u] = ++cnt;
                    q.add(u);
                }
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= N; i++) sb.append(order[i]).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-1260',
            title: 'BOJ 1260 - DFS와 BFS',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1260',
            descriptionHTML: `
                <h3>문제</h3>
                <p>그래프를 DFS로 탐색한 결과와 BFS로 탐색한 결과를 출력하세요.</p>
                <p>정점 번호가 작은 것을 먼저 방문합니다. 시작 정점은 V입니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N M V (정점 수, 간선 수, 시작 정점)<br>이후 M개의 간선</p></div>
                    <div><h4>출력</h4><p>첫째 줄: DFS 방문 순서<br>둘째 줄: BFS 방문 순서</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 5 1
1 2
1 3
1 4
2 4
3 4</pre></div>
                    <div><strong>출력</strong><pre>1 2 4 3
1 2 3 4</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: 'DFS와 BFS를 <strong>둘 다</strong> 구현하면 됩니다! 인접 리스트를 오름차순 정렬하고, 각각 실행합니다.' },
                { title: '구현 포인트', content: 'DFS는 재귀로, BFS는 deque으로 구현합니다.<br>각각의 방문 순서를 리스트에 저장하고, 공백으로 구분하여 출력합니다.' },
                { title: '주의사항', content: 'DFS와 BFS에서 각각 <strong>별도의 visited 배열</strong>을 사용해야 합니다!' }
            ],
            inputDefault: 0,
            solve() { return '1 2 4 3\n1 2 3 4'; },
            templates: {
                python: `import sys
from collections import deque
sys.setrecursionlimit(10000)
input = sys.stdin.readline

N, M, V = map(int, input().split())
graph = [[] for _ in range(N + 1)]
for _ in range(M):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

for i in range(1, N + 1):
    graph[i].sort()

# DFS
dfs_result = []
visited_dfs = [False] * (N + 1)

def dfs(v):
    visited_dfs[v] = True
    dfs_result.append(v)
    for u in graph[v]:
        if not visited_dfs[u]:
            dfs(u)

dfs(V)

# BFS
bfs_result = []
visited_bfs = [False] * (N + 1)
queue = deque([V])
visited_bfs[V] = True

while queue:
    v = queue.popleft()
    bfs_result.append(v)
    for u in graph[v]:
        if not visited_bfs[u]:
            visited_bfs[u] = True
            queue.append(u)

print(*dfs_result)
print(*bfs_result)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int N, M, V;
vector<int> graph[1001];
bool vis[1001];

vector<int> dfs_result, bfs_result;

void dfs(int v) {
    vis[v] = true;
    dfs_result.push_back(v);
    for (int u : graph[v])
        if (!vis[u]) dfs(u);
}

void bfs(int start) {
    memset(vis, false, sizeof(vis));
    queue<int> q;
    q.push(start); vis[start] = true;
    while (!q.empty()) {
        int v = q.front(); q.pop();
        bfs_result.push_back(v);
        for (int u : graph[v]) {
            if (!vis[u]) { vis[u] = true; q.push(u); }
        }
    }
}

int main() {
    scanf("%d %d %d", &N, &M, &V);
    for (int i = 0; i < M; i++) {
        int u, v; scanf("%d %d", &u, &v);
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    for (int i = 1; i <= N; i++) sort(graph[i].begin(), graph[i].end());

    dfs(V);
    bfs(V);

    for (int i = 0; i < (int)dfs_result.size(); i++) printf("%d%c", dfs_result[i], i+1<(int)dfs_result.size()?' ':'\\n');
    for (int i = 0; i < (int)bfs_result.size(); i++) printf("%d%c", bfs_result[i], i+1<(int)bfs_result.size()?' ':'\\n');
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static List<List<Integer>> graph;
    static boolean[] vis;
    static StringBuilder dfsResult = new StringBuilder();

    static void dfs(int v) {
        vis[v] = true;
        dfsResult.append(v).append(' ');
        for (int u : graph.get(v))
            if (!vis[u]) dfs(u);
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        int V = Integer.parseInt(st.nextToken());

        graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int u = Integer.parseInt(st.nextToken());
            int v = Integer.parseInt(st.nextToken());
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        for (int i = 1; i <= N; i++) Collections.sort(graph.get(i));

        vis = new boolean[N + 1];
        dfs(V);

        vis = new boolean[N + 1];
        Queue<Integer> q = new LinkedList<>();
        q.add(V); vis[V] = true;
        StringBuilder bfsResult = new StringBuilder();
        while (!q.isEmpty()) {
            int v = q.poll();
            bfsResult.append(v).append(' ');
            for (int u : graph.get(v)) {
                if (!vis[u]) { vis[u] = true; q.add(u); }
            }
        }
        System.out.println(dfsResult.toString().trim());
        System.out.println(bfsResult.toString().trim());
    }
}`
            }
        },
        // ===== 2단계: 그리드 탐색과 Flood Fill =====
        {
            id: 'boj-1012',
            title: 'BOJ 1012 - 유기농 배추',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1012',
            descriptionHTML: `
                <h3>문제</h3>
                <p>배추밭에 배추가 심어져 있습니다. 서로 인접한(상하좌우) 배추끼리는 한 마리의 배추흰지렁이가 보호할 수 있습니다.</p>
                <p>배추가 심어진 위치가 주어질 때, 필요한 배추흰지렁이의 최소 수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>테스트 케이스 수 T<br>각 케이스: M(가로), N(세로), K(배추 수)<br>이후 K개의 배추 위치</p></div>
                    <div><h4>출력</h4><p>각 테스트 케이스마다 필요한 지렁이 수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
10 8 17
0 0
1 0
1 1
4 2
4 3
4 5
2 4
3 4
7 4
8 4
9 4
7 5
8 5
9 5
7 6
8 6
9 6
10 6 1
5 3</pre></div>
                    <div><strong>출력</strong><pre>5
1</pre></div>
                </div></div>`,
            hints: [
                { title: '어떤 유형의 문제일까?', content: '<strong>연결 요소 세기</strong> 문제입니다! 배추가 상하좌우로 연결된 덩어리가 몇 개인지 세면 됩니다.' },
                { title: '풀이 방법', content: '격자를 순회하며, 방문하지 않은 배추(1)를 발견하면 DFS/BFS로 연결된 모든 배추를 방문합니다.<br>DFS/BFS를 시작한 횟수가 곧 필요한 지렁이 수입니다!' },
                { title: '주의사항', content: '테스트 케이스가 여러 개이므로, 각 케이스마다 visited 배열을 초기화해야 합니다.<br>좌표가 (x, y) 형태로 주어지므로 grid[y][x]로 저장합니다.' }
            ],
            inputDefault: 0,
            solve() { return '5\n1'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]

T = int(input())
for _ in range(T):
    M, N, K = map(int, input().split())
    grid = [[0] * M for _ in range(N)]
    for _ in range(K):
        x, y = map(int, input().split())
        grid[y][x] = 1

    visited = [[False] * M for _ in range(N)]
    count = 0

    for r in range(N):
        for c in range(M):
            if grid[r][c] == 1 and not visited[r][c]:
                # BFS로 연결된 배추 모두 방문
                queue = deque([(r, c)])
                visited[r][c] = True
                while queue:
                    cr, cc = queue.popleft()
                    for d in range(4):
                        nr, nc = cr + dx[d], cc + dy[d]
                        if 0 <= nr < N and 0 <= nc < M:
                            if grid[nr][nc] == 1 and not visited[nr][nc]:
                                visited[nr][nc] = True
                                queue.append((nr, nc))
                count += 1

    print(count)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int dx[] = {0,0,1,-1};
int dy[] = {1,-1,0,0};

int main() {
    int T; scanf("%d", &T);
    while (T--) {
        int M, N, K;
        scanf("%d %d %d", &M, &N, &K);
        vector<vector<int>> grid(N, vector<int>(M, 0));
        vector<vector<bool>> vis(N, vector<bool>(M, false));
        for (int i = 0; i < K; i++) {
            int x, y; scanf("%d %d", &x, &y);
            grid[y][x] = 1;
        }
        int count = 0;
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < M; c++) {
                if (grid[r][c] == 1 && !vis[r][c]) {
                    queue<pair<int,int>> q;
                    q.push({r, c}); vis[r][c] = true;
                    while (!q.empty()) {
                        auto [cr, cc] = q.front(); q.pop();
                        for (int d = 0; d < 4; d++) {
                            int nr = cr+dx[d], nc = cc+dy[d];
                            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==1&&!vis[nr][nc]) {
                                vis[nr][nc] = true;
                                q.push({nr, nc});
                            }
                        }
                    }
                    count++;
                }
            }
        }
        printf("%d\\n", count);
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] dx = {0,0,1,-1};
    static int[] dy = {1,-1,0,0};

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();
        while (T-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int M = Integer.parseInt(st.nextToken());
            int N = Integer.parseInt(st.nextToken());
            int K = Integer.parseInt(st.nextToken());
            int[][] grid = new int[N][M];
            boolean[][] vis = new boolean[N][M];
            for (int i = 0; i < K; i++) {
                st = new StringTokenizer(br.readLine());
                int x = Integer.parseInt(st.nextToken());
                int y = Integer.parseInt(st.nextToken());
                grid[y][x] = 1;
            }
            int count = 0;
            for (int r = 0; r < N; r++) for (int c = 0; c < M; c++) {
                if (grid[r][c] == 1 && !vis[r][c]) {
                    Queue<int[]> q = new LinkedList<>();
                    q.add(new int[]{r, c}); vis[r][c] = true;
                    while (!q.isEmpty()) {
                        int[] cur = q.poll();
                        for (int d = 0; d < 4; d++) {
                            int nr = cur[0]+dx[d], nc = cur[1]+dy[d];
                            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==1&&!vis[nr][nc]) {
                                vis[nr][nc] = true; q.add(new int[]{nr, nc});
                            }
                        }
                    }
                    count++;
                }
            }
            sb.append(count).append("\\n");
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-2667',
            title: 'BOJ 2667 - 단지번호붙이기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2667',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×N 지도에서 1은 집이 있는 곳, 0은 없는 곳입니다. 상하좌우로 연결된 집의 모임을 "단지"라고 합니다.</p>
                <p>총 단지 수와 각 단지에 속하는 집의 수를 오름차순으로 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N (5≤N≤25)<br>N줄의 0/1 지도</p></div>
                    <div><h4>출력</h4><p>총 단지 수<br>각 단지의 집 수 (오름차순)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7
0110100
0110101
1110101
0000111
0100000
0111110
0111000</pre></div>
                    <div><strong>출력</strong><pre>3
7
8
9</pre></div>
                </div></div>`,
            hints: [
                { title: '1012번과 뭐가 다를까?', content: '연결 요소의 <strong>개수</strong>뿐만 아니라, 각 연결 요소의 <strong>크기</strong>(집 수)도 구해야 합니다!' },
                { title: '풀이 방법', content: 'DFS/BFS로 각 연결 요소를 탐색하면서, 방문한 칸의 수를 세어 리스트에 저장합니다.<br>마지막에 리스트를 오름차순 정렬하여 출력합니다.' }
            ],
            inputDefault: 0,
            solve() { return '3\n7\n8\n9'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N = int(input())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
visited = [[False] * N for _ in range(N)]
sizes = []

for r in range(N):
    for c in range(N):
        if grid[r][c] == 1 and not visited[r][c]:
            queue = deque([(r, c)])
            visited[r][c] = True
            cnt = 0
            while queue:
                cr, cc = queue.popleft()
                cnt += 1
                for d in range(4):
                    nr, nc = cr + dx[d], cc + dy[d]
                    if 0 <= nr < N and 0 <= nc < N:
                        if grid[nr][nc] == 1 and not visited[nr][nc]:
                            visited[nr][nc] = True
                            queue.append((nr, nc))
            sizes.append(cnt)

sizes.sort()
print(len(sizes))
for s in sizes:
    print(s)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int N;
int grid[25][25];
bool vis[25][25];
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int main() {
    scanf("%d", &N);
    for (int i = 0; i < N; i++) {
        char s[30]; scanf("%s", s);
        for (int j = 0; j < N; j++) grid[i][j] = s[j] - '0';
    }

    vector<int> sizes;
    for (int r = 0; r < N; r++) for (int c = 0; c < N; c++) {
        if (grid[r][c] == 1 && !vis[r][c]) {
            queue<pair<int,int>> q;
            q.push({r, c}); vis[r][c] = true;
            int cnt = 0;
            while (!q.empty()) {
                auto [cr, cc] = q.front(); q.pop();
                cnt++;
                for (int d = 0; d < 4; d++) {
                    int nr = cr+dx[d], nc = cc+dy[d];
                    if (nr>=0&&nr<N&&nc>=0&&nc<N&&grid[nr][nc]==1&&!vis[nr][nc]) {
                        vis[nr][nc] = true; q.push({nr,nc});
                    }
                }
            }
            sizes.push_back(cnt);
        }
    }
    sort(sizes.begin(), sizes.end());
    printf("%d\\n", (int)sizes.size());
    for (int s : sizes) printf("%d\\n", s);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int[][] grid = new int[N][N];
        boolean[][] vis = new boolean[N][N];
        int[] dx = {0,0,1,-1}, dy = {1,-1,0,0};

        for (int i = 0; i < N; i++) {
            String line = br.readLine().trim();
            for (int j = 0; j < N; j++) grid[i][j] = line.charAt(j) - '0';
        }

        List<Integer> sizes = new ArrayList<>();
        for (int r = 0; r < N; r++) for (int c = 0; c < N; c++) {
            if (grid[r][c] == 1 && !vis[r][c]) {
                Queue<int[]> q = new LinkedList<>();
                q.add(new int[]{r, c}); vis[r][c] = true;
                int cnt = 0;
                while (!q.isEmpty()) {
                    int[] cur = q.poll(); cnt++;
                    for (int d = 0; d < 4; d++) {
                        int nr = cur[0]+dx[d], nc = cur[1]+dy[d];
                        if (nr>=0&&nr<N&&nc>=0&&nc<N&&grid[nr][nc]==1&&!vis[nr][nc]) {
                            vis[nr][nc] = true; q.add(new int[]{nr, nc});
                        }
                    }
                }
                sizes.add(cnt);
            }
        }
        Collections.sort(sizes);
        StringBuilder sb = new StringBuilder();
        sb.append(sizes.size()).append("\\n");
        for (int s : sizes) sb.append(s).append("\\n");
        System.out.print(sb);
    }
}`
            }
        },
        // ===== 3단계: BFS 최단 거리 ====
        {
            id: 'boj-2178',
            title: 'BOJ 2178 - 미로 탐색',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2178',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M 미로에서 (1,1)에서 (N,M)까지 이동할 때, 지나야 하는 최소 칸 수를 구하세요.</p>
                <p>1은 이동 가능, 0은 벽입니다. 상하좌우로만 이동할 수 있습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M (2≤N,M≤100)<br>N줄의 0/1 미로</p></div>
                    <div><h4>출력</h4><p>최소 칸 수 (시작칸과 도착칸 포함)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 6
101111
101010
101011
111011</pre></div>
                    <div><strong>출력</strong><pre>15</pre></div>
                </div></div>`,
            hints: [
                { title: '어떤 알고리즘?', content: '<strong>BFS 최단 거리</strong> 문제입니다! 격자에서 벽을 피해 최단 경로를 찾습니다.' },
                { title: '풀이 방법', content: '(0,0)에서 BFS를 시작합니다. dist[r][c] = dist[이전][이전] + 1로 거리를 기록합니다.<br>dist[N-1][M-1]이 정답입니다.' },
                { title: '주의사항', content: '시작칸과 도착칸도 포함하므로, dist[0][0] = 1로 시작합니다.' }
            ],
            inputDefault: 0,
            solve() { return '15'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
dist = [[-1] * M for _ in range(N)]
dist[0][0] = 1
queue = deque([(0, 0)])

while queue:
    r, c = queue.popleft()
    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 1 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))

print(dist[N-1][M-1])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<string> grid(N);
    for (int i = 0; i < N; i++) { char s[110]; scanf("%s", s); grid[i] = s; }

    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};
    vector<vector<int>> dist(N, vector<int>(M, -1));
    dist[0][0] = 1;
    queue<pair<int,int>> q;
    q.push({0, 0});

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]=='1'&&dist[nr][nc]==-1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    printf("%d\\n", dist[N-1][M-1]);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        char[][] grid = new char[N][];
        for (int i = 0; i < N; i++) grid[i] = br.readLine().trim().toCharArray();

        int[] dx = {0,0,1,-1}, dy = {1,-1,0,0};
        int[][] dist = new int[N][M];
        for (int[] row : dist) Arrays.fill(row, -1);
        dist[0][0] = 1;
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{0, 0});

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int d = 0; d < 4; d++) {
                int nr = cur[0]+dx[d], nc = cur[1]+dy[d];
                if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]=='1'&&dist[nr][nc]==-1) {
                    dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                    q.add(new int[]{nr, nc});
                }
            }
        }
        System.out.println(dist[N-1][M-1]);
    }
}`
            }
        },
        {
            id: 'boj-1697',
            title: 'BOJ 1697 - 숨바꼭질',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1697',
            descriptionHTML: `
                <h3>문제</h3>
                <p>수빈이는 위치 N에, 동생은 위치 K에 있습니다. 수빈이가 할 수 있는 행동:</p>
                <ul><li>걷기: X-1 또는 X+1로 이동 (1초)</li><li>순간이동: 2*X로 이동 (1초)</li></ul>
                <p>수빈이가 동생을 찾는 가장 빠른 시간을 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N K (0 ≤ N, K ≤ 100,000)</p></div>
                    <div><h4>출력</h4><p>가장 빠른 시간(초)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 17</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '좌표를 <strong>정점</strong>, 이동을 <strong>간선</strong>으로 생각합니다!<br>각 위치 X에서 X-1, X+1, 2*X로 이동 가능 → BFS로 최단 거리를 구합니다.' },
                { title: '구현 포인트', content: 'visited 배열 크기는 100,001 (0~100,000)<br>범위를 벗어나지 않도록 0 ≤ nx ≤ 100,000 체크!' },
                { title: '예제 풀이', content: '5 → 10 → 9 → 18 → 17 (4초)<br>또는 5 → 4 → 8 → 16 → 17 (4초)' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `from collections import deque

N, K = map(int, input().split())

MAX = 100001
dist = [-1] * MAX
dist[N] = 0
queue = deque([N])

while queue:
    x = queue.popleft()
    if x == K:
        print(dist[x])
        break
    for nx in [x - 1, x + 1, 2 * x]:
        if 0 <= nx < MAX and dist[nx] == -1:
            dist[nx] = dist[x] + 1
            queue.append(nx)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int dist[100001];

int main() {
    int N, K;
    scanf("%d %d", &N, &K);
    memset(dist, -1, sizeof(dist));
    dist[N] = 0;
    queue<int> q;
    q.push(N);

    while (!q.empty()) {
        int x = q.front(); q.pop();
        if (x == K) { printf("%d\\n", dist[x]); return 0; }
        for (int nx : {x-1, x+1, 2*x}) {
            if (nx >= 0 && nx <= 100000 && dist[nx] == -1) {
                dist[nx] = dist[x] + 1;
                q.push(nx);
            }
        }
    }
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), K = sc.nextInt();
        int[] dist = new int[100001];
        Arrays.fill(dist, -1);
        dist[N] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.add(N);

        while (!q.isEmpty()) {
            int x = q.poll();
            if (x == K) { System.out.println(dist[x]); return; }
            for (int nx : new int[]{x-1, x+1, 2*x}) {
                if (nx >= 0 && nx <= 100000 && dist[nx] == -1) {
                    dist[nx] = dist[x] + 1;
                    q.add(nx);
                }
            }
        }
    }
}`
            }
        },
        {
            id: 'boj-7562',
            title: 'BOJ 7562 - 나이트의 이동',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7562',
            descriptionHTML: `
                <h3>문제</h3>
                <p>체스판에서 나이트가 한 번에 이동할 수 있는 칸은 8가지입니다. 나이트가 시작점에서 도착점까지 이동하는 최소 횟수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>테스트 케이스 수<br>각 케이스: 체스판 크기 I, 시작 좌표, 도착 좌표</p></div>
                    <div><h4>출력</h4><p>최소 이동 횟수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3
8
0 0
7 0
100
0 0
30 50
10
1 1
1 1</pre></div>
                    <div><strong>출력</strong><pre>5
28
0</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '나이트의 8방향 이동을 dx/dy 배열로 정의합니다:<br><code>dx = [-2,-2,-1,-1,1,1,2,2]</code><br><code>dy = [-1,1,-2,2,-2,2,-1,1]</code>' },
                { title: '풀이 방법', content: '시작점에서 BFS를 수행합니다. 각 이동은 비용 1이므로 BFS가 최단 거리를 보장합니다.' }
            ],
            inputDefault: 0,
            solve() { return '5\n28\n0'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

dx = [-2, -2, -1, -1, 1, 1, 2, 2]
dy = [-1, 1, -2, 2, -2, 2, -1, 1]

T = int(input())
for _ in range(T):
    I = int(input())
    sr, sc = map(int, input().split())
    er, ec = map(int, input().split())

    if sr == er and sc == ec:
        print(0)
        continue

    dist = [[-1] * I for _ in range(I)]
    dist[sr][sc] = 0
    queue = deque([(sr, sc)])

    while queue:
        r, c = queue.popleft()
        if r == er and c == ec:
            print(dist[r][c])
            break
        for d in range(8):
            nr, nc = r + dx[d], c + dy[d]
            if 0 <= nr < I and 0 <= nc < I and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int dx[] = {-2,-2,-1,-1,1,1,2,2};
int dy[] = {-1,1,-2,2,-2,2,-1,1};

int main() {
    int T; scanf("%d", &T);
    while (T--) {
        int I; scanf("%d", &I);
        int sr, sc, er, ec;
        scanf("%d %d %d %d", &sr, &sc, &er, &ec);
        if (sr==er && sc==ec) { puts("0"); continue; }

        vector<vector<int>> dist(I, vector<int>(I, -1));
        dist[sr][sc] = 0;
        queue<pair<int,int>> q;
        q.push({sr, sc});

        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            if (r==er && c==ec) { printf("%d\\n", dist[r][c]); break; }
            for (int d = 0; d < 8; d++) {
                int nr = r+dx[d], nc = c+dy[d];
                if (nr>=0&&nr<I&&nc>=0&&nc<I&&dist[nr][nc]==-1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q.push({nr, nc});
                }
            }
        }
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine().trim());
        int[] dx = {-2,-2,-1,-1,1,1,2,2};
        int[] dy = {-1,1,-2,2,-2,2,-1,1};
        StringBuilder sb = new StringBuilder();

        while (T-- > 0) {
            int I = Integer.parseInt(br.readLine().trim());
            StringTokenizer st = new StringTokenizer(br.readLine());
            int sr = Integer.parseInt(st.nextToken()), sc = Integer.parseInt(st.nextToken());
            st = new StringTokenizer(br.readLine());
            int er = Integer.parseInt(st.nextToken()), ec = Integer.parseInt(st.nextToken());

            if (sr==er && sc==ec) { sb.append("0\\n"); continue; }

            int[][] dist = new int[I][I];
            for (int[] row : dist) Arrays.fill(row, -1);
            dist[sr][sc] = 0;
            Queue<int[]> q = new LinkedList<>();
            q.add(new int[]{sr, sc});

            while (!q.isEmpty()) {
                int[] cur = q.poll();
                if (cur[0]==er && cur[1]==ec) { sb.append(dist[cur[0]][cur[1]]).append("\\n"); break; }
                for (int d = 0; d < 8; d++) {
                    int nr = cur[0]+dx[d], nc = cur[1]+dy[d];
                    if (nr>=0&&nr<I&&nc>=0&&nc<I&&dist[nr][nc]==-1) {
                        dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                        q.add(new int[]{nr, nc});
                    }
                }
            }
        }
        System.out.print(sb);
    }
}`
            }
        },
        // ===== 4단계: 심화 BFS =====
        {
            id: 'boj-7576',
            title: 'BOJ 7576 - 토마토',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7576',
            descriptionHTML: `
                <h3>문제</h3>
                <p>M×N 상자에 토마토가 보관되어 있습니다. 익은 토마토(1)의 상하좌우에 있는 안 익은 토마토(0)는 하루가 지나면 익습니다.</p>
                <p>모든 토마토가 익는 데 걸리는 최소 일수를 구하세요. 토마토가 모두 익지 못하면 -1을 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>M, N (가로, 세로, 2≤M,N≤1000)<br>N줄의 격자 (1: 익음, 0: 안 익음, -1: 빈 칸)</p></div>
                    <div><h4>출력</h4><p>모든 토마토가 익는 최소 일수, 또는 -1</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 1</pre></div>
                    <div><strong>출력</strong><pre>8</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '<strong>다중 시작점 BFS</strong>입니다! 처음부터 익은 토마토(1)를 <strong>모두</strong> 큐에 넣고 BFS를 시작합니다.' },
                { title: '풀이 방법', content: '1. 익은 토마토 위치를 모두 큐에 넣습니다. (dist = 0)<br>2. BFS로 안 익은 토마토를 익히면서 거리를 기록합니다.<br>3. BFS 후, 아직 0인 칸이 있으면 -1, 아니면 최대 거리를 출력합니다.' },
                { title: '시간 복잡도', content: 'O(N×M) — BFS는 각 칸을 한 번만 방문합니다.' }
            ],
            inputDefault: 0,
            solve() { return '8'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

M, N = map(int, input().split())
grid = []
queue = deque()

for r in range(N):
    row = list(map(int, input().split()))
    grid.append(row)
    for c in range(M):
        if row[c] == 1:
            queue.append((r, c))  # 다중 시작점!

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
dist = [[-1] * M for _ in range(N)]

# 초기 익은 토마토의 거리 = 0
for r, c in queue:
    dist[r][c] = 0

while queue:
    r, c = queue.popleft()
    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 0 and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                grid[nr][nc] = 1
                queue.append((nr, nc))

ans = 0
for r in range(N):
    for c in range(M):
        if grid[r][c] == 0:
            print(-1)
            exit()
        ans = max(ans, dist[r][c])

print(ans)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int M, N;
    scanf("%d %d", &M, &N);
    vector<vector<int>> grid(N, vector<int>(M));
    vector<vector<int>> dist(N, vector<int>(M, -1));
    queue<pair<int,int>> q;
    int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

    for (int r = 0; r < N; r++)
        for (int c = 0; c < M; c++) {
            scanf("%d", &grid[r][c]);
            if (grid[r][c] == 1) { q.push({r, c}); dist[r][c] = 0; }
        }

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==0&&dist[nr][nc]==-1) {
                dist[nr][nc] = dist[r][c] + 1;
                grid[nr][nc] = 1;
                q.push({nr, nc});
            }
        }
    }

    int ans = 0;
    for (int r = 0; r < N; r++)
        for (int c = 0; c < M; c++) {
            if (grid[r][c] == 0) { puts("-1"); return 0; }
            ans = max(ans, dist[r][c]);
        }
    printf("%d\\n", ans);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int M = Integer.parseInt(st.nextToken()), N = Integer.parseInt(st.nextToken());
        int[][] grid = new int[N][M];
        int[][] dist = new int[N][M];
        int[] dx = {0,0,1,-1}, dy = {1,-1,0,0};
        Queue<int[]> q = new LinkedList<>();

        for (int r = 0; r < N; r++) {
            st = new StringTokenizer(br.readLine());
            for (int c = 0; c < M; c++) {
                grid[r][c] = Integer.parseInt(st.nextToken());
                dist[r][c] = -1;
                if (grid[r][c] == 1) { q.add(new int[]{r, c}); dist[r][c] = 0; }
            }
        }

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int d = 0; d < 4; d++) {
                int nr = cur[0]+dx[d], nc = cur[1]+dy[d];
                if (nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nr][nc]==0&&dist[nr][nc]==-1) {
                    dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                    grid[nr][nc] = 1;
                    q.add(new int[]{nr, nc});
                }
            }
        }

        int ans = 0;
        for (int r = 0; r < N; r++)
            for (int c = 0; c < M; c++) {
                if (grid[r][c] == 0) { System.out.println(-1); return; }
                ans = Math.max(ans, dist[r][c]);
            }
        System.out.println(ans);
    }
}`
            }
        },
        {
            id: 'boj-7569',
            title: 'BOJ 7569 - 토마토 (3D)',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7569',
            descriptionHTML: `
                <h3>문제</h3>
                <p>7576번의 3차원 버전입니다. M×N×H 상자에서 토마토가 위, 아래, 앞, 뒤, 왼쪽, 오른쪽 <strong>6방향</strong>으로 영향을 줍니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>M, N, H (가로, 세로, 높이)<br>H개 층의 N×M 격자</p></div>
                    <div><h4>출력</h4><p>모든 토마토가 익는 최소 일수, 또는 -1</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 3 2
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>`,
            hints: [
                { title: '7576번과 뭐가 다를까?', content: '2D → 3D로 확장됩니다! 4방향 → <strong>6방향</strong> (상하좌우 + 위층/아래층)' },
                { title: '구현 포인트', content: 'dz = [0,0,0,0,1,-1]을 추가하고, dist[z][r][c] 3차원 배열을 사용합니다.<br>나머지 로직은 7576번과 동일합니다.' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

M, N, H = map(int, input().split())
grid = []
queue = deque()

for h in range(H):
    layer = []
    for r in range(N):
        row = list(map(int, input().split()))
        layer.append(row)
        for c in range(M):
            if row[c] == 1:
                queue.append((h, r, c))
    grid.append(layer)

# 6방향: 상하좌우 + 위/아래층
dh = [0, 0, 0, 0, 1, -1]
dr = [0, 0, 1, -1, 0, 0]
dc = [1, -1, 0, 0, 0, 0]

dist = [[[-1]*M for _ in range(N)] for _ in range(H)]
for h, r, c in queue:
    dist[h][r][c] = 0

while queue:
    h, r, c = queue.popleft()
    for d in range(6):
        nh, nr, nc = h+dh[d], r+dr[d], c+dc[d]
        if 0<=nh<H and 0<=nr<N and 0<=nc<M:
            if grid[nh][nr][nc] == 0 and dist[nh][nr][nc] == -1:
                dist[nh][nr][nc] = dist[h][r][c] + 1
                grid[nh][nr][nc] = 1
                queue.append((nh, nr, nc))

ans = 0
for h in range(H):
    for r in range(N):
        for c in range(M):
            if grid[h][r][c] == 0:
                print(-1)
                exit()
            ans = max(ans, dist[h][r][c])
print(ans)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int grid[100][100][100], dist_arr[100][100][100];
int dh[]={0,0,0,0,1,-1}, dr[]={0,0,1,-1,0,0}, dc[]={1,-1,0,0,0,0};

int main() {
    int M, N, H;
    scanf("%d %d %d", &M, &N, &H);
    queue<tuple<int,int,int>> q;
    memset(dist_arr, -1, sizeof(dist_arr));

    for (int h = 0; h < H; h++)
        for (int r = 0; r < N; r++)
            for (int c = 0; c < M; c++) {
                scanf("%d", &grid[h][r][c]);
                if (grid[h][r][c] == 1) { q.push({h,r,c}); dist_arr[h][r][c] = 0; }
            }

    while (!q.empty()) {
        auto [h,r,c] = q.front(); q.pop();
        for (int d = 0; d < 6; d++) {
            int nh=h+dh[d], nr=r+dr[d], nc=c+dc[d];
            if (nh>=0&&nh<H&&nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nh][nr][nc]==0&&dist_arr[nh][nr][nc]==-1) {
                dist_arr[nh][nr][nc] = dist_arr[h][r][c]+1;
                grid[nh][nr][nc] = 1;
                q.push({nh,nr,nc});
            }
        }
    }

    int ans = 0;
    for (int h = 0; h < H; h++)
        for (int r = 0; r < N; r++)
            for (int c = 0; c < M; c++) {
                if (grid[h][r][c] == 0) { puts("-1"); return 0; }
                ans = max(ans, dist_arr[h][r][c]);
            }
    printf("%d\\n", ans);
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int M = Integer.parseInt(st.nextToken());
        int N = Integer.parseInt(st.nextToken());
        int H = Integer.parseInt(st.nextToken());
        int[][][] grid = new int[H][N][M];
        int[][][] dist = new int[H][N][M];
        int[] dh={0,0,0,0,1,-1}, dr={0,0,1,-1,0,0}, dc={1,-1,0,0,0,0};
        Queue<int[]> q = new LinkedList<>();

        for (int h = 0; h < H; h++)
            for (int r = 0; r < N; r++) {
                st = new StringTokenizer(br.readLine());
                for (int c = 0; c < M; c++) {
                    grid[h][r][c] = Integer.parseInt(st.nextToken());
                    dist[h][r][c] = -1;
                    if (grid[h][r][c] == 1) { q.add(new int[]{h,r,c}); dist[h][r][c] = 0; }
                }
            }

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            for (int d = 0; d < 6; d++) {
                int nh=cur[0]+dh[d], nr=cur[1]+dr[d], nc=cur[2]+dc[d];
                if (nh>=0&&nh<H&&nr>=0&&nr<N&&nc>=0&&nc<M&&grid[nh][nr][nc]==0&&dist[nh][nr][nc]==-1) {
                    dist[nh][nr][nc] = dist[cur[0]][cur[1]][cur[2]]+1;
                    grid[nh][nr][nc] = 1;
                    q.add(new int[]{nh,nr,nc});
                }
            }
        }

        int ans = 0;
        for (int h = 0; h < H; h++)
            for (int r = 0; r < N; r++)
                for (int c = 0; c < M; c++) {
                    if (grid[h][r][c] == 0) { System.out.println(-1); return; }
                    ans = Math.max(ans, dist[h][r][c]);
                }
        System.out.println(ans);
    }
}`
            }
        },
        {
            id: 'boj-16928',
            title: 'BOJ 16928 - 뱀과 사다리 게임',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/16928',
            descriptionHTML: `
                <h3>문제</h3>
                <p>10×10 보드에서 1번 칸에서 100번 칸까지 가는 최소 주사위 횟수를 구하세요.</p>
                <p>주사위를 굴려 1~6만큼 이동합니다. 사다리를 만나면 위로, 뱀을 만나면 아래로 강제 이동합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M (사다리 수, 뱀 수)<br>이후 사다리/뱀 정보 (x → y)</p></div>
                    <div><h4>출력</h4><p>최소 주사위 횟수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 7
32 62
42 68
12 98
95 13
97 25
93 37
79 27
75 19
49 47
67 17</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '칸 번호(1~100)를 <strong>정점</strong>, 주사위 이동을 <strong>간선</strong>으로 생각합니다.<br>사다리/뱀은 해당 칸에 도착하면 <strong>강제 이동</strong>하는 것입니다.' },
                { title: '풀이 방법', content: '1번 칸에서 BFS를 시작합니다.<br>현재 칸 + 주사위(1~6) = 다음 칸인데, 그 칸에 사다리/뱀이 있으면 목적지로 이동합니다.<br>100번 칸에 도달하면 거리를 출력합니다.' }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `from collections import deque

N, M = map(int, input().split())
teleport = {}
for _ in range(N + M):
    x, y = map(int, input().split())
    teleport[x] = y

dist = [-1] * 101
dist[1] = 0
queue = deque([1])

while queue:
    pos = queue.popleft()
    if pos == 100:
        print(dist[pos])
        break
    for dice in range(1, 7):
        npos = pos + dice
        if npos > 100:
            continue
        # 사다리 또는 뱀이 있으면 강제 이동
        if npos in teleport:
            npos = teleport[npos]
        if dist[npos] == -1:
            dist[npos] = dist[pos] + 1
            queue.append(npos)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    int teleport[101] = {};
    for (int i = 0; i < N + M; i++) {
        int x, y; scanf("%d %d", &x, &y);
        teleport[x] = y;
    }

    int dist[101];
    memset(dist, -1, sizeof(dist));
    dist[1] = 0;
    queue<int> q;
    q.push(1);

    while (!q.empty()) {
        int pos = q.front(); q.pop();
        if (pos == 100) { printf("%d\\n", dist[pos]); return 0; }
        for (int d = 1; d <= 6; d++) {
            int npos = pos + d;
            if (npos > 100) continue;
            if (teleport[npos]) npos = teleport[npos];
            if (dist[npos] == -1) {
                dist[npos] = dist[pos] + 1;
                q.push(npos);
            }
        }
    }
    return 0;
}`,
                java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(), M = sc.nextInt();
        int[] teleport = new int[101];
        for (int i = 0; i < N + M; i++) {
            int x = sc.nextInt(), y = sc.nextInt();
            teleport[x] = y;
        }

        int[] dist = new int[101];
        Arrays.fill(dist, -1);
        dist[1] = 0;
        Queue<Integer> q = new LinkedList<>();
        q.add(1);

        while (!q.isEmpty()) {
            int pos = q.poll();
            if (pos == 100) { System.out.println(dist[pos]); return; }
            for (int d = 1; d <= 6; d++) {
                int npos = pos + d;
                if (npos > 100) continue;
                if (teleport[npos] != 0) npos = teleport[npos];
                if (dist[npos] == -1) {
                    dist[npos] = dist[pos] + 1;
                    q.add(npos);
                }
            }
        }
    }
}`
            }
        },
        {
            id: 'boj-1707',
            title: 'BOJ 1707 - 이분 그래프',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1707',
            descriptionHTML: `
                <h3>문제</h3>
                <p>그래프가 이분 그래프인지 판별하세요. 이분 그래프란 모든 정점을 두 그룹으로 나누어, 같은 그룹 내의 정점끼리는 간선이 없는 그래프입니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>테스트 케이스 수 K<br>각 케이스: V, E (정점, 간선 수)<br>이후 E개의 간선</p></div>
                    <div><h4>출력</h4><p>각 케이스마다 YES 또는 NO</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
3 2
1 3
2 3
4 4
1 2
2 3
3 4
4 2</pre></div>
                    <div><strong>출력</strong><pre>YES
NO</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '<strong>2-coloring</strong> 문제입니다! 정점을 두 가지 색으로 칠하되, 인접한 정점은 다른 색이어야 합니다.<br>색칠 도중 충돌이 생기면 이분 그래프가 아닙니다.' },
                { title: '풀이 방법', content: 'BFS/DFS로 시작 정점을 색 0으로 칠하고, 이웃을 색 1로, 그 이웃을 색 0으로... 반복합니다.<br>이미 색칠된 이웃의 색이 현재와 같으면 NO입니다.' },
                { title: '주의사항', content: '그래프가 <strong>연결 그래프가 아닐 수</strong> 있습니다! 모든 정점에 대해 BFS를 해야 합니다.<br>각 테스트 케이스마다 초기화를 잊지 마세요.' }
            ],
            inputDefault: 0,
            solve() { return 'YES\nNO'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

K = int(input())
for _ in range(K):
    V, E = map(int, input().split())
    graph = [[] for _ in range(V + 1)]
    for _ in range(E):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    color = [-1] * (V + 1)
    is_bipartite = True

    for start in range(1, V + 1):
        if color[start] != -1:
            continue
        color[start] = 0
        queue = deque([start])
        while queue:
            v = queue.popleft()
            for u in graph[v]:
                if color[u] == -1:
                    color[u] = 1 - color[v]  # 반대 색
                    queue.append(u)
                elif color[u] == color[v]:
                    is_bipartite = False
                    break
            if not is_bipartite:
                break
        if not is_bipartite:
            break

    print("YES" if is_bipartite else "NO")`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int K; scanf("%d", &K);
    while (K--) {
        int V, E; scanf("%d %d", &V, &E);
        vector<vector<int>> graph(V + 1);
        for (int i = 0; i < E; i++) {
            int u, v; scanf("%d %d", &u, &v);
            graph[u].push_back(v);
            graph[v].push_back(u);
        }

        vector<int> color(V + 1, -1);
        bool ok = true;

        for (int s = 1; s <= V && ok; s++) {
            if (color[s] != -1) continue;
            color[s] = 0;
            queue<int> q;
            q.push(s);
            while (!q.empty() && ok) {
                int v = q.front(); q.pop();
                for (int u : graph[v]) {
                    if (color[u] == -1) {
                        color[u] = 1 - color[v];
                        q.push(u);
                    } else if (color[u] == color[v]) {
                        ok = false;
                    }
                }
            }
        }
        puts(ok ? "YES" : "NO");
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int K = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();

        while (K-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int V = Integer.parseInt(st.nextToken());
            int E = Integer.parseInt(st.nextToken());
            List<List<Integer>> graph = new ArrayList<>();
            for (int i = 0; i <= V; i++) graph.add(new ArrayList<>());
            for (int i = 0; i < E; i++) {
                st = new StringTokenizer(br.readLine());
                int u = Integer.parseInt(st.nextToken());
                int v = Integer.parseInt(st.nextToken());
                graph.get(u).add(v);
                graph.get(v).add(u);
            }

            int[] color = new int[V + 1];
            Arrays.fill(color, -1);
            boolean ok = true;

            for (int s = 1; s <= V && ok; s++) {
                if (color[s] != -1) continue;
                color[s] = 0;
                Queue<Integer> q = new LinkedList<>();
                q.add(s);
                while (!q.isEmpty() && ok) {
                    int v = q.poll();
                    for (int u : graph.get(v)) {
                        if (color[u] == -1) { color[u] = 1 - color[v]; q.add(u); }
                        else if (color[u] == color[v]) ok = false;
                    }
                }
            }
            sb.append(ok ? "YES" : "NO").append("\\n");
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-2206',
            title: 'BOJ 2206 - 벽 부수고 이동하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2206',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N×M 맵에서 (1,1)에서 (N,M)까지 최단 경로를 구하세요. 벽(1)은 통과할 수 없지만, <strong>딱 한 번</strong> 벽을 부수고 이동할 수 있습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N, M (1≤N,M≤1000)<br>N줄의 0/1 맵</p></div>
                    <div><h4>출력</h4><p>최단 경로 길이 (시작/도착 포함), 불가능하면 -1</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4
0100
0110
0000
0010
0100
0000</pre></div>
                    <div><strong>출력</strong><pre>15</pre></div>
                </div></div>`,
            hints: [
                { title: '핵심 아이디어', content: '<strong>상태 확장 BFS</strong>입니다! 방문 배열을 3차원으로 확장합니다:<br><code>visited[r][c][벽을 부쉈는지(0 또는 1)]</code>' },
                { title: '풀이 방법', content: 'BFS 큐에 (r, c, broken) 상태를 넣습니다.<br>벽이 있는 칸: broken=0이면 벽을 부수고(broken=1) 이동 가능<br>빈 칸: 그냥 이동' },
                { title: '주의사항', content: '벽을 부수지 않은 상태와 부순 상태를 <strong>별도로</strong> 관리해야 합니다.<br>같은 (r,c)라도 broken 값이 다르면 다른 상태입니다!' }
            ],
            inputDefault: 0,
            solve() { return '15'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
grid = []
for _ in range(N):
    grid.append(list(map(int, input().strip())))

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]

# dist[r][c][broken]: broken=0(아직 안 부숨), broken=1(이미 부숨)
dist = [[[-1] * 2 for _ in range(M)] for _ in range(N)]
dist[0][0][0] = 1
queue = deque([(0, 0, 0)])  # (r, c, broken)

while queue:
    r, c, broken = queue.popleft()
    if r == N - 1 and c == M - 1:
        print(dist[r][c][broken])
        exit()

    for d in range(4):
        nr, nc = r + dx[d], c + dy[d]
        if 0 <= nr < N and 0 <= nc < M:
            if grid[nr][nc] == 0 and dist[nr][nc][broken] == -1:
                # 빈 칸으로 이동
                dist[nr][nc][broken] = dist[r][c][broken] + 1
                queue.append((nr, nc, broken))
            elif grid[nr][nc] == 1 and broken == 0 and dist[nr][nc][1] == -1:
                # 벽을 부수고 이동 (한 번만 가능)
                dist[nr][nc][1] = dist[r][c][broken] + 1
                queue.append((nr, nc, 1))

print(-1)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int N, M;
char grid[1000][1001];
int dist_arr[1000][1000][2];
int dx[] = {0,0,1,-1}, dy[] = {1,-1,0,0};

int main() {
    scanf("%d %d", &N, &M);
    for (int i = 0; i < N; i++) scanf("%s", grid[i]);
    memset(dist_arr, -1, sizeof(dist_arr));

    dist_arr[0][0][0] = 1;
    queue<tuple<int,int,int>> q;
    q.push({0, 0, 0});

    while (!q.empty()) {
        auto [r, c, b] = q.front(); q.pop();
        if (r == N-1 && c == M-1) {
            printf("%d\\n", dist_arr[r][c][b]);
            return 0;
        }
        for (int d = 0; d < 4; d++) {
            int nr = r+dx[d], nc = c+dy[d];
            if (nr<0||nr>=N||nc<0||nc>=M) continue;
            if (grid[nr][nc]=='0' && dist_arr[nr][nc][b]==-1) {
                dist_arr[nr][nc][b] = dist_arr[r][c][b]+1;
                q.push({nr,nc,b});
            }
            if (grid[nr][nc]=='1' && b==0 && dist_arr[nr][nc][1]==-1) {
                dist_arr[nr][nc][1] = dist_arr[r][c][b]+1;
                q.push({nr,nc,1});
            }
        }
    }
    puts("-1");
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());
        char[][] grid = new char[N][];
        for (int i = 0; i < N; i++) grid[i] = br.readLine().trim().toCharArray();

        int[] dx = {0,0,1,-1}, dy = {1,-1,0,0};
        int[][][] dist = new int[N][M][2];
        for (int[][] a : dist) for (int[] b : a) Arrays.fill(b, -1);
        dist[0][0][0] = 1;
        Queue<int[]> q = new LinkedList<>();
        q.add(new int[]{0, 0, 0});

        while (!q.isEmpty()) {
            int[] cur = q.poll();
            int r = cur[0], c = cur[1], broken = cur[2];
            if (r == N-1 && c == M-1) {
                System.out.println(dist[r][c][broken]);
                return;
            }
            for (int d = 0; d < 4; d++) {
                int nr = r+dx[d], nc = c+dy[d];
                if (nr<0||nr>=N||nc<0||nc>=M) continue;
                if (grid[nr][nc]=='0' && dist[nr][nc][broken]==-1) {
                    dist[nr][nc][broken] = dist[r][c][broken]+1;
                    q.add(new int[]{nr,nc,broken});
                }
                if (grid[nr][nc]=='1' && broken==0 && dist[nr][nc][1]==-1) {
                    dist[nr][nc][1] = dist[r][c][broken]+1;
                    q.add(new int[]{nr,nc,1});
                }
            }
        }
        System.out.println(-1);
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
window.AlgoTopics.graph = graphTopic;
