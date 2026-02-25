// =========================================================
// 위상 정렬 (Topological Sort) 토픽 모듈
// =========================================================
const topologicalSortTopic = {
    id: 'topologicalsort',
    title: '위상 정렬',
    icon: '📋',
    category: '고급 자료구조와 그래프',
    order: 17,
    description: 'DAG에서 선후관계를 지키며 모든 노드를 일렬로 나열하는 기법',
    relatedNote: '위상 정렬은 빌드 시스템, 수강 순서, 작업 스케줄링 등 선행 조건이 있는 문제에 활용됩니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📋 위상 정렬 (Topological Sort)</h2>
                <p class="hero-sub">방향 그래프에서 순서를 정하는 알고리즘을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: DAG란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> DAG란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "옷 입는 순서"를 생각해 보세요!
                    양말을 신기 전에 먼저 바지를 입어야 하고, 바지를 입기 전에 속옷을 입어야 합니다.
                    이렇게 <em>"A를 먼저 해야 B를 할 수 있다"</em>는 관계가 있을 때,
                    이를 <strong>방향 비순환 그래프(DAG)</strong>라 합니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="19" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="16" y1="19" x2="22" y2="19" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow)"/><defs><marker id="arrow" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)"/></marker></defs></svg>
                        </div>
                        <h3>방향 그래프</h3>
                        <p>간선에 방향이 있습니다. A→B는 "A 다음에 B"라는 뜻입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="8" cy="30" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="30" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="17" y1="12" x2="10" y2="26" stroke="var(--green)" stroke-width="2"/><line x1="21" y1="12" x2="28" y2="26" stroke="var(--green)" stroke-width="2"/></svg>
                        </div>
                        <h3>비순환 (Acyclic)</h3>
                        <p>사이클(순환)이 없어야 합니다. 돌고 도는 경로가 있으면 순서를 정할 수 없습니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="10" fill="none" stroke="var(--yellow)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--yellow)">0</text><line x1="5" y1="10" x2="12" y2="15" stroke="var(--yellow)" stroke-width="2" marker-end="url(#arrow)"/><line x1="5" y1="28" x2="12" y2="23" stroke="var(--yellow)" stroke-width="2" marker-end="url(#arrow)"/></svg>
                        </div>
                        <h3>진입 차수 (In-degree)</h3>
                        <p>한 노드로 들어오는 화살표의 수입니다. 진입 차수가 0이면 "바로 시작할 수 있는 일"입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.5"/><rect x="26" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.8"/><line x1="12" y1="17" x2="14" y2="17" stroke="var(--accent)" stroke-width="2"/><line x1="24" y1="17" x2="26" y2="17" stroke="var(--accent)" stroke-width="2"/></svg>
                        </div>
                        <h3>위상 순서</h3>
                        <p>DAG의 모든 간선 u→v에서 u가 v보다 앞에 오도록 일렬로 나열한 것입니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 방향 그래프 (인접 리스트) + 진입 차수 만들기
import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
graph = [[] for _ in range(N + 1)]
in_degree = [0] * (N + 1)

for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)  # a → b (a를 먼저!)
    in_degree[b] += 1   # b의 진입 차수 +1</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">과목 이수 순서에서 미적분학→확률통계, 선형대수→확률통계일 때, 확률통계의 진입 차수는?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        정답은 <strong>2</strong>입니다! 미적분학과 선형대수, 2개의 화살표가 확률통계로 들어오기 때문입니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 위상 정렬이란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 위상 정렬이란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "학교 시간표 짜기"를 생각해 보세요!
                    수학 기초를 듣지 않고 고급 수학을 들을 수는 없습니다.
                    선수 과목 관계를 모두 지키면서 과목을 일렬로 나열하는 것이 <strong>위상 정렬</strong>입니다.
                    결과가 여러 개일 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="14" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="12" y1="12" x2="26" y2="26" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="26" y1="12" x2="12" y2="26" stroke="var(--red, #e17055)" stroke-width="2"/></svg>
                        </div>
                        <h3>DAG에서만 가능</h3>
                        <p>사이클이 있으면 위상 정렬은 불가능합니다! 순서를 정할 수 없기 때문입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><path d="M8,19 L14,10 L20,19 L26,10 L32,19" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="32" text-anchor="middle" font-size="10" fill="var(--text2)">여러 답</text></svg>
                        </div>
                        <h3>여러 정답 가능</h3>
                        <p>선후 관계가 없는 노드끼리는 순서가 자유롭습니다. 정답이 여러 개일 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="8" width="30" height="22" rx="3" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="10" y1="15" x2="28" y2="15" stroke="var(--green)" stroke-width="1.5"/><line x1="10" y1="21" x2="24" y2="21" stroke="var(--green)" stroke-width="1.5"/><line x1="10" y1="27" x2="20" y2="27" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>활용 예시</h3>
                        <p>빌드 시스템, 작업 스케줄링, 과목 이수 순서 등에 사용됩니다.</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">4명이 줄 서는데, 1→3, 2→3 관계만 있다면 [2,1,3,4]는 올바른 위상 정렬일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        <strong>네, 올바릅니다!</strong> 1과 2가 모두 3보다 앞에 있고, 4는 어디에 있든 상관없습니다.
                        [1,2,3,4], [2,1,3,4], [1,2,4,3] 등 여러 답이 가능합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 3: Kahn's Algorithm -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> BFS 방식 (Kahn's Algorithm)
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "할 일 목록(To-Do List)"을 생각해 보세요!
                    먼저 <em>선행 조건이 하나도 없는 일</em>을 골라서 합니다.
                    그 일을 끝내면 다른 일의 선행 조건이 하나씩 줄어듭니다.
                    선행 조건이 모두 해결된 일을 다시 골라서 합니다. 이것을 반복합니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">1</text></svg>
                        </div>
                        <h3>Step 1: 초기화</h3>
                        <p>진입 차수가 0인 모든 노드를 큐에 넣습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">2</text></svg>
                        </div>
                        <h3>Step 2: 처리</h3>
                        <p>큐에서 꺼낸 노드를 결과에 추가하고, 이웃의 진입 차수를 1씩 줄입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">3</text></svg>
                        </div>
                        <h3>Step 3: 반복</h3>
                        <p>진입 차수가 0이 된 노드를 큐에 추가합니다. 큐가 빌 때까지 반복합니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># Kahn's Algorithm (BFS 위상 정렬)
from collections import deque

queue = deque()
for i in range(1, N + 1):
    if in_degree[i] == 0:
        queue.append(i)

result = []
while queue:
    v = queue.popleft()
    result.append(v)
    for u in graph[v]:
        in_degree[u] -= 1
        if in_degree[u] == 0:
            queue.append(u)

# result의 길이가 N이 아니면 사이클 존재!
if len(result) != N:
    print("사이클이 있어 위상 정렬 불가!")
else:
    print(*result)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">그래프가 1→3, 1→4, 2→3, 3→4이고 N=4일 때, Kahn's Algorithm의 결과는?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        초기 진입차수: [1:0, 2:0, 3:2, 4:2]. 큐에 {1,2}.<br>
                        1 처리 → 3,4 차수 감소 → [3:1, 4:1].<br>
                        2 처리 → 3 차수 감소 → [3:0, 4:1]. 3을 큐에 추가.<br>
                        3 처리 → 4 차수 감소 → [4:0]. 4를 큐에 추가.<br>
                        4 처리. 결과: <strong>1 2 3 4</strong>
                    </div>
                </div>
            </div>

            <!-- 섹션 4: 우선순위 큐 + 위상 정렬 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> 응용: 우선순위 큐 + 위상 정렬
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "가능한 일이 여러 개일 때, 번호가 작은(쉬운) 것부터 하고 싶다면?"
                    일반 큐 대신 <strong>최소 힙(min-heap)</strong>을 사용합니다!
                    나머지 로직은 Kahn's Algorithm과 완전히 동일합니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--border)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="11" fill="var(--text2)">아무거나</text></svg>
                        </div>
                        <h3>일반 큐</h3>
                        <p>선행 조건이 해결된 것 중 아무거나 먼저 처리합니다. 여러 정답이 가능합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--green)">최솟값</text></svg>
                        </div>
                        <h3>최소 힙</h3>
                        <p>선행 조건이 해결된 것 중 <strong>번호가 가장 작은 것</strong> 먼저 처리합니다. 유일한 정답입니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 우선순위 큐를 사용한 위상 정렬
import heapq

heap = []
for i in range(1, N + 1):
    if in_degree[i] == 0:
        heapq.heappush(heap, i)

result = []
while heap:
    v = heapq.heappop(heap)  # 가장 작은 번호 먼저!
    result.append(v)
    for u in graph[v]:
        in_degree[u] -= 1
        if in_degree[u] == 0:
            heapq.heappush(heap, u)

print(*result)</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">1→4, 2→4, 3→4일 때, 일반 큐를 쓰면? 최소 힙을 쓰면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        일반 큐: [1,2,3,4] 또는 [3,2,1,4] 등 여러 가지 가능합니다.<br>
                        최소 힙: 반드시 <strong>[1,2,3,4]</strong>입니다. 항상 가장 작은 번호를 먼저 꺼내기 때문입니다.
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

        const NODE_POS = {
            1: { x: 80, y: 55 },
            2: { x: 250, y: 55 },
            3: { x: 420, y: 55 },
            4: { x: 160, y: 170 },
            5: { x: 330, y: 170 },
            6: { x: 160, y: 290 },
            7: { x: 330, y: 290 }
        };
        const EDGES = [[1,4],[2,4],[2,5],[3,5],[4,6],[4,7],[5,7]];
        const R = 22;

        function shortenLine(x1, y1, x2, y2, r) {
            const dx = x2 - x1, dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ratio = r / len;
            return {
                x1: x1 + dx * ratio, y1: y1 + dy * ratio,
                x2: x2 - dx * ratio, y2: y2 - dy * ratio
            };
        }

        let svgEdges = '';
        EDGES.forEach(([a, b]) => {
            const p = shortenLine(NODE_POS[a].x, NODE_POS[a].y, NODE_POS[b].x, NODE_POS[b].y, R);
            svgEdges += `<line class="graph-edge ts-directed" data-from="${a}" data-to="${b}"
                x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}"
                marker-end="url(#ts-arrowhead)"/>`;
        });

        let svgNodes = '';
        for (let id = 1; id <= 7; id++) {
            const p = NODE_POS[id];
            svgNodes += `<circle class="graph-node" data-id="${id}" cx="${p.x}" cy="${p.y}" r="${R}"/>`;
            svgNodes += `<text class="graph-node-label" x="${p.x}" y="${p.y + 5}" text-anchor="middle">${id}</text>`;
        }

        const INIT_INDEG = { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2, 6: 1, 7: 2 };

        let indegCells = '';
        for (let id = 1; id <= 7; id++) {
            indegCells += `<div class="ts-indegree-cell${INIT_INDEG[id] === 0 ? ' zero' : ''}" data-id="${id}">
                <span class="ts-node-id">${id}</span>
                <span class="ts-deg-val">${INIT_INDEG[id]}</span>
            </div>`;
        }

        container.innerHTML = `
            <div class="viz-card">
                <h3>Kahn's Algorithm 시각화</h3>
                <p>7개 노드의 DAG에서 위상 정렬 과정을 단계별로 확인합니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button class="btn btn-primary" id="ts-start-btn">위상 정렬 시작</button>
                </div>
                <div class="graph-svg-container">
                    <svg viewBox="0 0 500 340" width="100%" style="max-height:340px;">
                        <defs>
                            <marker id="ts-arrowhead" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--border)"/>
                            </marker>
                            <marker id="ts-arrowhead-active" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--yellow-vivid, #f9a825)"/>
                            </marker>
                            <marker id="ts-arrowhead-visited" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-vivid, #6c5ce7)"/>
                            </marker>
                        </defs>
                        ${svgEdges}
                        ${svgNodes}
                    </svg>
                </div>
                <div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;align-items:flex-start;">
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">진입 차수 (In-degree)</div>
                        <div class="ts-indegree-display" id="ts-indegree-display">${indegCells}</div>
                    </div>
                    <div style="flex:1;min-width:140px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">큐 (Queue)</div>
                        <div class="graph-queue-display" id="ts-queue-display"></div>
                    </div>
                    <div style="flex:1;min-width:140px;">
                        <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">결과 (Result)</div>
                        <div class="graph-queue-display" id="ts-result-display"></div>
                    </div>
                </div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 미방문</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:rgba(0,184,148,0.15);border:2px dashed var(--green, #00b894);vertical-align:middle;"></span> 큐 대기</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> 처리 완료</span>
            </div>
        `;

        const self = this;
        const svg = container.querySelector('svg');
        const indegDisplay = container.querySelector('#ts-indegree-display');
        const queueDisplay = container.querySelector('#ts-queue-display');
        const resultDisplay = container.querySelector('#ts-result-display');

        function saveState() {
            const nodeStates = {};
            svg.querySelectorAll('.graph-node').forEach(n => {
                nodeStates[n.dataset.id] = n.getAttribute('class');
            });
            const edgeStates = {};
            svg.querySelectorAll('.graph-edge').forEach(e => {
                edgeStates[e.dataset.from + '-' + e.dataset.to] = { cls: e.getAttribute('class'), marker: e.getAttribute('marker-end') };
            });
            return {
                nodeStates,
                edgeStates,
                indegHTML: indegDisplay.innerHTML,
                queueHTML: queueDisplay.innerHTML,
                resultHTML: resultDisplay.innerHTML
            };
        }

        function restoreState(state) {
            svg.querySelectorAll('.graph-node').forEach(n => {
                n.setAttribute('class', state.nodeStates[n.dataset.id]);
            });
            svg.querySelectorAll('.graph-edge').forEach(e => {
                const key = e.dataset.from + '-' + e.dataset.to;
                e.setAttribute('class', state.edgeStates[key].cls);
                e.setAttribute('marker-end', state.edgeStates[key].marker);
            });
            indegDisplay.innerHTML = state.indegHTML;
            queueDisplay.innerHTML = state.queueHTML;
            resultDisplay.innerHTML = state.resultHTML;
        }

        function setNode(id, cls) {
            const node = svg.querySelector(`.graph-node[data-id="${id}"]`);
            if (node) node.setAttribute('class', 'graph-node ' + cls);
        }

        function setEdge(from, to, cls, marker) {
            const edge = svg.querySelector(`.graph-edge[data-from="${from}"][data-to="${to}"]`);
            if (edge) {
                edge.setAttribute('class', 'graph-edge ts-directed ' + cls);
                edge.setAttribute('marker-end', marker);
            }
        }

        function setIndeg(id, val, extraCls) {
            const cell = indegDisplay.querySelector(`.ts-indegree-cell[data-id="${id}"]`);
            if (cell) {
                cell.querySelector('.ts-deg-val').textContent = val;
                cell.className = 'ts-indegree-cell' + (extraCls ? ' ' + extraCls : '');
            }
        }

        function setQueue(items) {
            queueDisplay.innerHTML = items.map(i =>
                `<div class="graph-queue-item">${i}</div>`
            ).join('');
        }

        function setResult(items) {
            resultDisplay.innerHTML = items.map(i =>
                `<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">${i}</div>`
            ).join('');
        }

        container.querySelector('#ts-start-btn').addEventListener('click', function() {
            self._clearVizState();

            // Reset visual state
            for (let id = 1; id <= 7; id++) {
                setNode(id, '');
                setIndeg(id, INIT_INDEG[id], INIT_INDEG[id] === 0 ? 'zero' : '');
            }
            EDGES.forEach(([a, b]) => setEdge(a, b, '', 'url(#ts-arrowhead)'));
            setQueue([]);
            setResult([]);

            // Simulation state
            const indeg = { ...INIT_INDEG };
            const adj = { 1: [4], 2: [4, 5], 3: [5], 4: [6, 7], 5: [7], 6: [], 7: [] };
            let queue = [];
            let result = [];

            const steps = [];

            // Step 0: 초기화 - 진입차수 0인 노드를 큐에 넣기
            const s0 = saveState();
            steps.push({
                description: '초기화: 진입 차수가 0인 노드 1, 2, 3을 큐에 넣습니다.',
                action: () => {
                    queue = [1, 2, 3];
                    setNode(1, 'queued');
                    setNode(2, 'queued');
                    setNode(3, 'queued');
                    setQueue(queue);
                },
                undo: () => restoreState(s0)
            });

            // Process each node
            const processOrder = [1, 2, 3, 4, 5, 6, 7];
            let simQueue = [1, 2, 3];
            let simResult = [];
            const simIndeg = { ...INIT_INDEG };

            processOrder.forEach(v => {
                // Step A: Dequeue and mark active
                const sA = null; // placeholder, captured at action time
                const prevQueue = [...simQueue];
                const prevResult = [...simResult];
                simQueue.shift();
                simResult.push(v);
                const curQueue = [...simQueue];
                const curResult = [...simResult];

                steps.push({
                    description: `큐에서 ${v}을(를) 꺼내 결과에 추가합니다.`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setNode(v, 'active');
                        setQueue(curQueue);
                        setResult(curResult);
                    },
                    undo: function() { restoreState(this._before); }
                });

                // Step B: Process neighbors
                const neighbors = adj[v];
                if (neighbors.length > 0) {
                    const newQueued = [];
                    neighbors.forEach(u => {
                        simIndeg[u]--;
                        if (simIndeg[u] === 0) {
                            simQueue.push(u);
                            newQueued.push(u);
                        }
                    });
                    const afterQueue = [...simQueue];
                    const neighborIndeg = {};
                    neighbors.forEach(u => { neighborIndeg[u] = simIndeg[u]; });

                    let desc = `${v}의 이웃 [${neighbors.join(', ')}]의 진입 차수를 줄입니다.`;
                    if (newQueued.length > 0) {
                        desc += ` → ${newQueued.join(', ')}의 진입 차수가 0이 되어 큐에 추가합니다.`;
                    }

                    steps.push({
                        description: desc,
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            setNode(v, 'visited');
                            neighbors.forEach(u => {
                                setEdge(v, u, 'visited', 'url(#ts-arrowhead-visited)');
                                setIndeg(u, neighborIndeg[u], neighborIndeg[u] === 0 ? 'zero' : '');
                            });
                            setIndeg(v, 0, 'processed');
                            newQueued.forEach(u => setNode(u, 'queued'));
                            setQueue(afterQueue);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                } else {
                    // No neighbors, just mark visited
                    steps.push({
                        description: `${v}에는 이웃이 없습니다. 처리 완료!`,
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            setNode(v, 'visited');
                            setIndeg(v, 0, 'processed');
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            });

            // Final step
            steps.push({
                description: '위상 정렬 완료! 결과: 1 → 2 → 3 → 4 → 5 → 6 → 7',
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
            title: '기본 위상 정렬',
            desc: '진입 차수와 BFS를 활용한 기본 위상 정렬 (Gold III)',
            problemIds: ['boj-2252']
        },
        {
            num: 2,
            title: '심화 위상 정렬',
            desc: '우선순위 큐, 사이클 판별 등 심화 응용 (Gold I~II)',
            problemIds: ['boj-1766', 'boj-3665']
        }
    ],

    problems: [
        // ===== 1단계: 기본 위상 정렬 =====
        {
            id: 'boj-2252',
            title: 'BOJ 2252 - 줄 세우기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2252',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N명의 학생들을 키 순서대로 줄을 세우려고 합니다.
                일부 학생들의 키를 비교한 결과가 주어질 때, 줄을 세우는 순서를 구하세요.</p>
                <p>두 학생의 키를 비교한 결과 "학생 A가 학생 B 앞에 서야 한다"는 정보가 M개 주어집니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N M (학생 수, 비교 횟수, N&le;32,000, M&le;100,000)<br>
                    이후 M줄: A B (A가 B 앞에 서야 함)</p></div>
                    <div><h4>출력</h4>
                    <p>줄을 세운 결과를 출력합니다. 답이 여러 개면 아무거나 출력합니다.</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 2\n1 3\n2 3</pre></div>
                    <div><strong>출력</strong><pre>1 2 3</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 알고리즘을 쓸까?',
                    content: '"A가 B 앞에 서야 한다" = A → B 간선. 이 관계를 모두 지키면서 일렬로 나열 = <strong>위상 정렬</strong>입니다!'
                },
                {
                    title: '핵심 아이디어',
                    content: '방향 그래프를 만들고 각 노드의 <strong>진입 차수(in-degree)</strong>를 구합니다.<br>진입 차수가 0인 노드부터 큐에 넣고, BFS 방식(Kahn\'s Algorithm)으로 처리합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>graph[a].append(b)</code>로 인접 리스트, <code>in_degree[b] += 1</code>로 진입 차수 계산.<br>큐에서 꺼내며 이웃의 진입 차수를 줄이고, 0이 되면 큐에 추가합니다. 결과를 출력합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '1 2 3'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
graph = [[] for _ in range(N + 1)]
in_degree = [0] * (N + 1)

for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)
    in_degree[b] += 1

queue = deque()
for i in range(1, N + 1):
    if in_degree[i] == 0:
        queue.append(i)

result = []
while queue:
    v = queue.popleft()
    result.append(v)
    for u in graph[v]:
        in_degree[u] -= 1
        if in_degree[u] == 0:
            queue.append(u)

print(*result)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<vector<int>> graph(N + 1);
    vector<int> in_degree(N + 1, 0);

    for (int i = 0; i < M; i++) {
        int a, b;
        scanf("%d %d", &a, &b);
        graph[a].push_back(b);
        in_degree[b]++;
    }

    queue<int> q;
    for (int i = 1; i <= N; i++) {
        if (in_degree[i] == 0) q.push(i);
    }

    while (!q.empty()) {
        int v = q.front(); q.pop();
        printf("%d ", v);
        for (int u : graph[v]) {
            if (--in_degree[u] == 0) q.push(u);
        }
    }
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

        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        int[] inDeg = new int[N + 1];

        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            graph.get(a).add(b);
            inDeg[b]++;
        }

        Queue<Integer> q = new LinkedList<>();
        for (int i = 1; i <= N; i++) {
            if (inDeg[i] == 0) q.add(i);
        }

        StringBuilder sb = new StringBuilder();
        while (!q.isEmpty()) {
            int v = q.poll();
            sb.append(v).append(" ");
            for (int u : graph.get(v)) {
                if (--inDeg[u] == 0) q.add(u);
            }
        }
        System.out.println(sb.toString().trim());
    }
}`
            }
        },

        // ===== 2단계: 심화 위상 정렬 =====
        {
            id: 'boj-1766',
            title: 'BOJ 1766 - 문제집',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1766',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 문제가 있고, 번호가 작을수록 쉬운 문제입니다.
                M개의 "A번 문제를 풀어야 B번 문제를 풀 수 있다"는 조건이 있습니다.</p>
                <p>모든 문제를 풀되, 조건을 지키면서 가능하면 쉬운 문제(번호가 작은 것)부터 풀어야 합니다.
                풀어야 하는 순서를 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N M (N&le;32,000, M&le;100,000)<br>
                    이후 M줄: A B (A를 먼저 풀어야 B를 풀 수 있음)</p></div>
                    <div><h4>출력</h4>
                    <p>문제를 풀어야 하는 순서를 출력합니다.</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2\n4 2\n3 1</pre></div>
                    <div><strong>출력</strong><pre>3 1 4 2</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '2252번과 뭐가 다를까?',
                    content: '2252번은 아무 순서나 출력하면 되지만, 이 문제는 <strong>가능한 것 중 번호가 가장 작은 것부터</strong> 풀어야 합니다.'
                },
                {
                    title: '핵심 아이디어',
                    content: 'Kahn\'s Algorithm에서 일반 큐(deque) 대신 <strong>최소 힙(min-heap)</strong>을 사용합니다!<br>이러면 진입 차수가 0인 노드 중 항상 가장 작은 번호를 먼저 처리합니다.'
                },
                {
                    title: '정답 코드 구조',
                    content: '<code>heapq.heappush(heap, i)</code>와 <code>heapq.heappop(heap)</code>을 사용합니다.<br>나머지는 2252번과 동일합니다. Python의 heapq는 기본적으로 최소 힙입니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '3 1 4 2'; },
            templates: {
                python: `import sys
import heapq
input = sys.stdin.readline

N, M = map(int, input().split())
graph = [[] for _ in range(N + 1)]
in_degree = [0] * (N + 1)

for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)
    in_degree[b] += 1

heap = []
for i in range(1, N + 1):
    if in_degree[i] == 0:
        heapq.heappush(heap, i)

result = []
while heap:
    v = heapq.heappop(heap)
    result.append(v)
    for u in graph[v]:
        in_degree[u] -= 1
        if in_degree[u] == 0:
            heapq.heappush(heap, u)

print(*result)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<vector<int>> graph(N + 1);
    vector<int> in_degree(N + 1, 0);

    for (int i = 0; i < M; i++) {
        int a, b;
        scanf("%d %d", &a, &b);
        graph[a].push_back(b);
        in_degree[b]++;
    }

    priority_queue<int, vector<int>, greater<int>> pq;
    for (int i = 1; i <= N; i++) {
        if (in_degree[i] == 0) pq.push(i);
    }

    while (!pq.empty()) {
        int v = pq.top(); pq.pop();
        printf("%d ", v);
        for (int u : graph[v]) {
            if (--in_degree[u] == 0) pq.push(u);
        }
    }
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

        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());
        int[] inDeg = new int[N + 1];

        for (int i = 0; i < M; i++) {
            st = new StringTokenizer(br.readLine());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            graph.get(a).add(b);
            inDeg[b]++;
        }

        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int i = 1; i <= N; i++) {
            if (inDeg[i] == 0) pq.add(i);
        }

        StringBuilder sb = new StringBuilder();
        while (!pq.isEmpty()) {
            int v = pq.poll();
            sb.append(v).append(" ");
            for (int u : graph.get(v)) {
                if (--inDeg[u] == 0) pq.add(u);
            }
        }
        System.out.println(sb.toString().trim());
    }
}`
            }
        },
        {
            id: 'boj-3665',
            title: 'BOJ 3665 - 최종 순위',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/3665',
            descriptionHTML: `
                <h3>문제</h3>
                <p>작년 순위가 주어지고, 올해 상대적 순서가 바뀐 쌍들이 주어집니다.
                올해의 최종 순위를 구하세요.</p>
                <p>작년에 앞에 있던 팀이 올해도 앞이라고 가정하되, 바뀐 쌍은 순서가 뒤집힙니다.</p>
                <p>순위를 확정할 수 없으면 "?", 데이터에 모순이 있으면 "IMPOSSIBLE"을 출력합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>T (테스트 케이스 수, &le;100)<br>
                    각 케이스: n (팀 수, &le;500), n개 정수 (작년 순위), m (바뀐 쌍 수), m줄의 쌍</p></div>
                    <div><h4>출력</h4>
                    <p>각 케이스마다 올해 순위 또는 "?" 또는 "IMPOSSIBLE"</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n5\n5 4 3 2 1\n2\n2 4\n3 4\n3\n2 3 1\n0\n4\n1 2 3 4\n3\n1 2\n3 4\n2 3</pre></div>
                    <div><strong>출력</strong><pre>5 3 2 4 1\n2 3 1\nIMPOSSIBLE</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떻게 그래프를 만들까?',
                    content: '작년 순위에서 앞에 있는 팀 → 뒤에 있는 팀으로 <strong>모든 쌍</strong>에 대해 간선을 만듭니다.<br>예: [5,4,3,2,1]이면 5→4, 5→3, 5→2, 5→1, 4→3, 4→2, ... 모든 쌍에 간선을 만듭니다.'
                },
                {
                    title: '바뀐 쌍은 어떻게 처리할까?',
                    content: '바뀐 쌍 (a, b)에 대해: 기존 간선의 방향을 <strong>뒤집습니다</strong>.<br>a→b 간선이 있으면 제거하고 b→a로 바꿉니다. 진입 차수도 함께 갱신합니다.'
                },
                {
                    title: '"?" vs "IMPOSSIBLE" 판별',
                    content: '위상 정렬 중 큐에 2개 이상이 동시에 있으면 순서가 확정되지 않아 <strong>"?"</strong>입니다.<br>위상 정렬 결과의 길이가 n보다 작으면 사이클이 있으므로 <strong>"IMPOSSIBLE"</strong>입니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '5 3 2 4 1'; },
            templates: {
                python: `import sys
from collections import deque
input = sys.stdin.readline

T = int(input())
for _ in range(T):
    n = int(input())
    rank = list(map(int, input().split()))

    # 모든 쌍에 대해 간선 생성
    graph = [[False] * (n + 1) for _ in range(n + 1)]
    in_degree = [0] * (n + 1)

    for i in range(n):
        for j in range(i + 1, n):
            graph[rank[i]][rank[j]] = True
            in_degree[rank[j]] += 1

    m = int(input())
    for _ in range(m):
        a, b = map(int, input().split())
        if graph[a][b]:
            graph[a][b] = False
            graph[b][a] = True
            in_degree[b] -= 1
            in_degree[a] += 1
        else:
            graph[b][a] = False
            graph[a][b] = True
            in_degree[a] -= 1
            in_degree[b] += 1

    queue = deque()
    for i in range(1, n + 1):
        if in_degree[i] == 0:
            queue.append(i)

    result = []
    ambiguous = False

    for _ in range(n):
        if len(queue) == 0:
            break
        if len(queue) > 1:
            ambiguous = True
        v = queue.popleft()
        result.append(v)
        for u in range(1, n + 1):
            if graph[v][u]:
                in_degree[u] -= 1
                if in_degree[u] == 0:
                    queue.append(u)

    if len(result) != n:
        print("IMPOSSIBLE")
    elif ambiguous:
        print("?")
    else:
        print(*result)`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int n;
        scanf("%d", &n);
        vector<int> rank_arr(n);
        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);

        vector<vector<bool>> graph(n + 1, vector<bool>(n + 1, false));
        vector<int> in_deg(n + 1, 0);

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                graph[rank_arr[i]][rank_arr[j]] = true;
                in_deg[rank_arr[j]]++;
            }
        }

        int m;
        scanf("%d", &m);
        for (int i = 0; i < m; i++) {
            int a, b;
            scanf("%d %d", &a, &b);
            if (graph[a][b]) {
                graph[a][b] = false; graph[b][a] = true;
                in_deg[b]--; in_deg[a]++;
            } else {
                graph[b][a] = false; graph[a][b] = true;
                in_deg[a]--; in_deg[b]++;
            }
        }

        queue<int> q;
        for (int i = 1; i <= n; i++) {
            if (in_deg[i] == 0) q.push(i);
        }

        vector<int> result;
        bool ambiguous = false;

        for (int i = 0; i < n; i++) {
            if (q.empty()) { result.clear(); break; }
            if (q.size() > 1) ambiguous = true;
            int v = q.front(); q.pop();
            result.push_back(v);
            for (int u = 1; u <= n; u++) {
                if (graph[v][u]) {
                    if (--in_deg[u] == 0) q.push(u);
                }
            }
        }

        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");
        else if (ambiguous) printf("?\\n");
        else {
            for (int i = 0; i < n; i++)
                printf("%d%c", result[i], i == n - 1 ? '\\n' : ' ');
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
        StringBuilder out = new StringBuilder();

        while (T-- > 0) {
            int n = Integer.parseInt(br.readLine().trim());
            StringTokenizer st = new StringTokenizer(br.readLine());
            int[] rank = new int[n];
            for (int i = 0; i < n; i++) rank[i] = Integer.parseInt(st.nextToken());

            boolean[][] graph = new boolean[n + 1][n + 1];
            int[] inDeg = new int[n + 1];

            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    graph[rank[i]][rank[j]] = true;
                    inDeg[rank[j]]++;
                }
            }

            int m = Integer.parseInt(br.readLine().trim());
            for (int i = 0; i < m; i++) {
                st = new StringTokenizer(br.readLine());
                int a = Integer.parseInt(st.nextToken());
                int b = Integer.parseInt(st.nextToken());
                if (graph[a][b]) {
                    graph[a][b] = false; graph[b][a] = true;
                    inDeg[b]--; inDeg[a]++;
                } else {
                    graph[b][a] = false; graph[a][b] = true;
                    inDeg[a]--; inDeg[b]++;
                }
            }

            Queue<Integer> q = new LinkedList<>();
            for (int i = 1; i <= n; i++) {
                if (inDeg[i] == 0) q.add(i);
            }

            List<Integer> result = new ArrayList<>();
            boolean ambiguous = false;

            for (int i = 0; i < n; i++) {
                if (q.isEmpty()) { result.clear(); break; }
                if (q.size() > 1) ambiguous = true;
                int v = q.poll();
                result.add(v);
                for (int u = 1; u <= n; u++) {
                    if (graph[v][u]) {
                        if (--inDeg[u] == 0) q.add(u);
                    }
                }
            }

            if (result.size() != n) out.append("IMPOSSIBLE\\n");
            else if (ambiguous) out.append("?\\n");
            else {
                for (int i = 0; i < n; i++) {
                    out.append(result.get(i));
                    out.append(i == n - 1 ? "\\n" : " ");
                }
            }
        }
        System.out.print(out);
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
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `
                    <span class="problem-title">${prob.title}</span>
                    <span class="problem-diff">${prob.difficulty === 'gold' ? 'Gold' : prob.difficulty === 'silver' ? 'Silver' : 'Platinum'}</span>
                `;
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
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary">BOJ에서 풀기 ↗</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

        // 힌트 섹션
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
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('open') ? '▼' : '▶';

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

        // 코드 에디터
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

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

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

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.topologicalsort = topologicalSortTopic;
