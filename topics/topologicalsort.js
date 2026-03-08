// =========================================================
// 위상 정렬 (Topological Sort) 토픽 모듈
// =========================================================
var topologicalSortTopic = {
    id: 'topologicalsort',
    title: '위상 정렬',
    icon: '📋',
    category: '고급 자료구조와 그래프',
    order: 17,
    description: 'DAG에서 선후관계를 지키며 모든 노드를 일렬로 나열하는 기법',
    relatedNote: '위상 정렬은 빌드 시스템, 수강 순서, 작업 스케줄링 등 선행 조건이 있는 문제에 활용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-2252': { type: '기본 위상 정렬',   color: 'var(--accent)', vizMethod: '_renderVizLineup' },
        'boj-1766': { type: '우선순위 큐 응용',  color: 'var(--green)',  vizMethod: '_renderVizWorkbook' },
        'boj-3665': { type: '간선 반전 응용',    color: '#e17055',      vizMethod: '_renderVizRanking' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '위상 정렬이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
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
        var tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        var ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
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
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
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
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
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
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
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

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-topo';

        var NODE_POS = {
            1: { x: 80, y: 55 },
            2: { x: 250, y: 55 },
            3: { x: 420, y: 55 },
            4: { x: 160, y: 170 },
            5: { x: 330, y: 170 },
            6: { x: 160, y: 290 },
            7: { x: 330, y: 290 }
        };
        var EDGES = [[1,4],[2,4],[2,5],[3,5],[4,6],[4,7],[5,7]];
        var R = 22;

        function shortenLine(x1, y1, x2, y2, r) {
            var dx = x2 - x1, dy = y2 - y1;
            var len = Math.sqrt(dx * dx + dy * dy);
            var ratio = r / len;
            return {
                x1: x1 + dx * ratio, y1: y1 + dy * ratio,
                x2: x2 - dx * ratio, y2: y2 - dy * ratio
            };
        }

        var svgEdges = '';
        EDGES.forEach(function(edge) {
            var a = edge[0], b = edge[1];
            var p = shortenLine(NODE_POS[a].x, NODE_POS[a].y, NODE_POS[b].x, NODE_POS[b].y, R);
            svgEdges += '<line class="graph-edge ts-directed" data-from="' + a + '" data-to="' + b + '"' +
                ' x1="' + p.x1 + '" y1="' + p.y1 + '" x2="' + p.x2 + '" y2="' + p.y2 + '"' +
                ' marker-end="url(#ts-arrowhead)"/>';
        });

        var svgNodes = '';
        for (var id = 1; id <= 7; id++) {
            var p = NODE_POS[id];
            svgNodes += '<circle class="graph-node" data-id="' + id + '" cx="' + p.x + '" cy="' + p.y + '" r="' + R + '"/>';
            svgNodes += '<text class="graph-node-label" x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle">' + id + '</text>';
        }

        var INIT_INDEG = { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2, 6: 1, 7: 2 };

        var indegCells = '';
        for (var id2 = 1; id2 <= 7; id2++) {
            indegCells += '<div class="ts-indegree-cell' + (INIT_INDEG[id2] === 0 ? ' zero' : '') + '" data-id="' + id2 + '">' +
                '<span class="ts-node-id">' + id2 + '</span>' +
                '<span class="ts-deg-val">' + INIT_INDEG[id2] + '</span>' +
                '</div>';
        }

        container.innerHTML =
            '<div class="viz-card">' +
                '<h3>Kahn\'s Algorithm 시각화</h3>' +
                '<p>7개 노드의 DAG에서 위상 정렬 과정을 단계별로 확인합니다.</p>' +
                '<div class="graph-svg-container">' +
                    '<svg viewBox="0 0 500 340" width="100%" style="max-height:340px;">' +
                        '<defs>' +
                            '<marker id="ts-arrowhead" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">' +
                                '<polygon points="0 0, 10 3.5, 0 7" fill="var(--border)"/>' +
                            '</marker>' +
                            '<marker id="ts-arrowhead-active" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">' +
                                '<polygon points="0 0, 10 3.5, 0 7" fill="var(--yellow-vivid, #f9a825)"/>' +
                            '</marker>' +
                            '<marker id="ts-arrowhead-visited" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">' +
                                '<polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-vivid, #6c5ce7)"/>' +
                            '</marker>' +
                        '</defs>' +
                        svgEdges +
                        svgNodes +
                    '</svg>' +
                '</div>' +
                '<div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;align-items:flex-start;">' +
                    '<div style="flex:1;min-width:180px;">' +
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">진입 차수 (In-degree)</div>' +
                        '<div class="ts-indegree-display" id="ts-indegree-display-' + suffix + '">' + indegCells + '</div>' +
                    '</div>' +
                    '<div style="flex:1;min-width:140px;">' +
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">큐 (Queue)</div>' +
                        '<div class="graph-queue-display" id="ts-queue-display-' + suffix + '"></div>' +
                    '</div>' +
                    '<div style="flex:1;min-width:140px;">' +
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">결과 (Result)</div>' +
                        '<div class="graph-queue-display" id="ts-result-display-' + suffix + '"></div>' +
                    '</div>' +
                '</div>' +
                self._createStepControls(suffix) +
            '</div>' +
            '<div class="graph-legend" style="margin-top:12px;">' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 미방문</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> 현재 처리 중</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:rgba(0,184,148,0.15);border:2px dashed var(--green, #00b894);vertical-align:middle;"></span> 큐 대기</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> 처리 완료</span>' +
            '</div>';

        var svg = container.querySelector('svg');
        var indegDisplay = container.querySelector('#ts-indegree-display-' + suffix);
        var queueDisplay = container.querySelector('#ts-queue-display-' + suffix);
        var resultDisplay = container.querySelector('#ts-result-display-' + suffix);

        function saveState() {
            var nodeStates = {};
            svg.querySelectorAll('.graph-node').forEach(function(n) {
                nodeStates[n.dataset.id] = n.getAttribute('class');
            });
            var edgeStates = {};
            svg.querySelectorAll('.graph-edge').forEach(function(e) {
                edgeStates[e.dataset.from + '-' + e.dataset.to] = { cls: e.getAttribute('class'), marker: e.getAttribute('marker-end') };
            });
            return {
                nodeStates: nodeStates,
                edgeStates: edgeStates,
                indegHTML: indegDisplay.innerHTML,
                queueHTML: queueDisplay.innerHTML,
                resultHTML: resultDisplay.innerHTML
            };
        }

        function restoreState(state) {
            svg.querySelectorAll('.graph-node').forEach(function(n) {
                n.setAttribute('class', state.nodeStates[n.dataset.id]);
            });
            svg.querySelectorAll('.graph-edge').forEach(function(e) {
                var key = e.dataset.from + '-' + e.dataset.to;
                e.setAttribute('class', state.edgeStates[key].cls);
                e.setAttribute('marker-end', state.edgeStates[key].marker);
            });
            indegDisplay.innerHTML = state.indegHTML;
            queueDisplay.innerHTML = state.queueHTML;
            resultDisplay.innerHTML = state.resultHTML;
        }

        function setNode(nid, cls) {
            var node = svg.querySelector('.graph-node[data-id="' + nid + '"]');
            if (node) node.setAttribute('class', 'graph-node ' + cls);
        }

        function setEdge(from, to, cls, marker) {
            var edge = svg.querySelector('.graph-edge[data-from="' + from + '"][data-to="' + to + '"]');
            if (edge) {
                edge.setAttribute('class', 'graph-edge ts-directed ' + cls);
                edge.setAttribute('marker-end', marker);
            }
        }

        function setIndeg(nid, val, extraCls) {
            var cell = indegDisplay.querySelector('.ts-indegree-cell[data-id="' + nid + '"]');
            if (cell) {
                cell.querySelector('.ts-deg-val').textContent = val;
                cell.className = 'ts-indegree-cell' + (extraCls ? ' ' + extraCls : '');
            }
        }

        function setQueue(items) {
            queueDisplay.innerHTML = items.map(function(i) {
                return '<div class="graph-queue-item">' + i + '</div>';
            }).join('');
        }

        function setResult(items) {
            resultDisplay.innerHTML = items.map(function(i) {
                return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + i + '</div>';
            }).join('');
        }

        // Build steps for the concept visualization
        var adj = { 1: [4], 2: [4, 5], 3: [5], 4: [6, 7], 5: [7], 6: [], 7: [] };
        var processOrder = [1, 2, 3, 4, 5, 6, 7];
        var simQueue = [1, 2, 3];
        var simResult = [];
        var simIndeg = { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2, 6: 1, 7: 2 };
        var steps = [];

        // Step 0: init
        var s0 = saveState();
        steps.push({
            description: '초기화: 진입 차수가 0인 노드 1, 2, 3을 큐에 넣습니다.',
            action: function() {
                setNode(1, 'queued'); setNode(2, 'queued'); setNode(3, 'queued');
                setQueue([1, 2, 3]);
            },
            undo: function() { restoreState(s0); }
        });

        processOrder.forEach(function(v) {
            var prevQueue = simQueue.slice();
            var prevResult = simResult.slice();
            simQueue.shift();
            simResult.push(v);
            var curQueue = simQueue.slice();
            var curResult = simResult.slice();

            steps.push({
                description: '큐에서 ' + v + '을(를) 꺼내 결과에 추가합니다.',
                _before: null,
                action: function() {
                    this._before = saveState();
                    setNode(v, 'active');
                    setQueue(curQueue);
                    setResult(curResult);
                },
                undo: function() { restoreState(this._before); }
            });

            var neighbors = adj[v];
            if (neighbors.length > 0) {
                var newQueued = [];
                neighbors.forEach(function(u) {
                    simIndeg[u]--;
                    if (simIndeg[u] === 0) {
                        simQueue.push(u);
                        newQueued.push(u);
                    }
                });
                var afterQueue = simQueue.slice();
                var neighborIndeg = {};
                neighbors.forEach(function(u) { neighborIndeg[u] = simIndeg[u]; });

                var desc2 = v + '의 이웃 [' + neighbors.join(', ') + ']의 진입 차수를 줄입니다.';
                if (newQueued.length > 0) {
                    desc2 += ' → ' + newQueued.join(', ') + '의 진입 차수가 0이 되어 큐에 추가합니다.';
                }

                (function(v2, neighbors2, neighborIndeg2, newQueued2, afterQueue2, desc3) {
                    steps.push({
                        description: desc3,
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            setNode(v2, 'visited');
                            neighbors2.forEach(function(u) {
                                setEdge(v2, u, 'visited', 'url(#ts-arrowhead-visited)');
                                setIndeg(u, neighborIndeg2[u], neighborIndeg2[u] === 0 ? 'zero' : '');
                            });
                            setIndeg(v2, 0, 'processed');
                            newQueued2.forEach(function(u) { setNode(u, 'queued'); });
                            setQueue(afterQueue2);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(v, neighbors.slice(), Object.assign({}, neighborIndeg), newQueued.slice(), afterQueue.slice(), desc2);
            } else {
                (function(v2) {
                    steps.push({
                        description: v2 + '에는 이웃이 없습니다. 처리 완료!',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            setNode(v2, 'visited');
                            setIndeg(v2, 0, 'processed');
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(v);
            }
        });

        steps.push({
            description: '위상 정렬 완료! 결과: 1 → 2 → 3 → 4 → 5 → 6 → 7',
            _before: null,
            action: function() { this._before = saveState(); },
            undo: function() { restoreState(this._before); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 1: 줄 세우기 (boj-2252) — 기본 Kahn's Algorithm
    // ====================================================================
    _renderVizLineup(container) {
        var self = this, suffix = '-lineup';
        var N = 4;
        var edges = [[1,3],[2,3],[3,4]];
        var adjSim = { 1: [3], 2: [3], 3: [4], 4: [] };
        var initIndeg = { 1: 0, 2: 0, 3: 2, 4: 1 };

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">줄 세우기 — 기본 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4명의 학생, 간선: 1→3, 2→3, 3→4. Kahn\'s Algorithm으로 정렬합니다.</p>' +
            '<div id="lu-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="lu-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">큐</div><div id="lu-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">결과</div><div id="lu-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
            '</div>' +
            '<div id="lu-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var nodesEl = container.querySelector('#lu-nodes' + suffix);
        var indegEl = container.querySelector('#lu-indeg' + suffix);
        var queueEl = container.querySelector('#lu-queue' + suffix);
        var resultEl = container.querySelector('#lu-result' + suffix);
        var infoEl = container.querySelector('#lu-info' + suffix);

        function nodeBox(nid, cls) { return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;transition:all 0.3s;' + cls + '">' + nid + '</div>'; }
        function renderNodes(states) {
            nodesEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                var st = states[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'active') cls = 'background:var(--yellow);border:2px solid var(--yellow-vivid,#f9a825);color:#333;';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                nodesEl.innerHTML += nodeBox(i, cls);
            }
        }
        function renderIndeg(indArr) {
            indegEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                indegEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;color:var(--text2);">in=' + indArr[i] + '</div>';
            }
        }
        function renderQueue(arr) { queueEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        var nodeStates = { 1: 'default', 2: 'default', 3: 'default', 4: 'default' };
        var indeg = { 1: 0, 2: 0, 3: 2, 4: 1 };
        renderNodes(nodeStates);
        renderIndeg(indeg);
        renderQueue([]);
        renderResult([]);
        infoEl.innerHTML = '<span style="color:var(--text2);">Kahn\'s Algorithm으로 위상 정렬을 시작합니다.</span>';

        var steps = [];
        // Step 1: init queue
        steps.push({ description: '초기화: in-degree가 0인 노드 1, 2를 큐에 넣습니다.',
            action: function() { nodeStates = { 1: 'queued', 2: 'queued', 3: 'default', 4: 'default' }; renderNodes(nodeStates); renderQueue([1, 2]); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>1, 2</strong> → 큐에 추가'; },
            undo: function() { nodeStates = { 1: 'default', 2: 'default', 3: 'default', 4: 'default' }; renderNodes(nodeStates); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Kahn\'s Algorithm으로 위상 정렬을 시작합니다.</span>'; }
        });
        // Step 2: dequeue 1
        steps.push({ description: '1을 큐에서 꺼내 결과에 추가. 이웃 3의 in-degree를 1로 줄입니다.',
            action: function() { nodeStates = { 1: 'done', 2: 'queued', 3: 'default', 4: 'default' }; indeg = { 1: 0, 2: 0, 3: 1, 4: 1 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([2]); renderResult([1]); infoEl.innerHTML = '1 처리 → 3의 in-degree: 2→<strong>1</strong>'; },
            undo: function() { nodeStates = { 1: 'queued', 2: 'queued', 3: 'default', 4: 'default' }; indeg = { 1: 0, 2: 0, 3: 2, 4: 1 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([1, 2]); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>1, 2</strong> → 큐에 추가'; }
        });
        // Step 3: dequeue 2
        steps.push({ description: '2를 큐에서 꺼내 결과에 추가. 3의 in-degree가 0이 되어 큐에 추가!',
            action: function() { nodeStates = { 1: 'done', 2: 'done', 3: 'queued', 4: 'default' }; indeg = { 1: 0, 2: 0, 3: 0, 4: 1 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([3]); renderResult([1, 2]); infoEl.innerHTML = '2 처리 → 3의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; },
            undo: function() { nodeStates = { 1: 'done', 2: 'queued', 3: 'default', 4: 'default' }; indeg = { 1: 0, 2: 0, 3: 1, 4: 1 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([2]); renderResult([1]); infoEl.innerHTML = '1 처리 → 3의 in-degree: 2→<strong>1</strong>'; }
        });
        // Step 4: dequeue 3
        steps.push({ description: '3을 큐에서 꺼내 결과에 추가. 4의 in-degree가 0이 되어 큐에 추가!',
            action: function() { nodeStates = { 1: 'done', 2: 'done', 3: 'done', 4: 'queued' }; indeg = { 1: 0, 2: 0, 3: 0, 4: 0 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([4]); renderResult([1, 2, 3]); infoEl.innerHTML = '3 처리 → 4의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; },
            undo: function() { nodeStates = { 1: 'done', 2: 'done', 3: 'queued', 4: 'default' }; indeg = { 1: 0, 2: 0, 3: 0, 4: 1 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([3]); renderResult([1, 2]); infoEl.innerHTML = '2 처리 → 3의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; }
        });
        // Step 5: dequeue 4 -> done
        steps.push({ description: '4를 큐에서 꺼내 결과에 추가. 위상 정렬 완료! 결과: 1 2 3 4',
            action: function() { nodeStates = { 1: 'done', 2: 'done', 3: 'done', 4: 'done' }; renderNodes(nodeStates); renderQueue([]); renderResult([1, 2, 3, 4]); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: 1 2 3 4</strong>'; },
            undo: function() { nodeStates = { 1: 'done', 2: 'done', 3: 'done', 4: 'queued' }; indeg = { 1: 0, 2: 0, 3: 0, 4: 0 }; renderNodes(nodeStates); renderIndeg(indeg); renderQueue([4]); renderResult([1, 2, 3]); infoEl.innerHTML = '3 처리 → 4의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 문제집 (boj-1766) — 최소 힙 + 위상 정렬
    // ====================================================================
    _renderVizWorkbook(container) {
        var self = this, suffix = '-workbook';
        var N = 4;
        var edgesData = [[4, 2], [3, 1]]; // 4→2, 3→1
        var adjSim = { 1: [], 2: [], 3: [1], 4: [2] };
        var initIndeg = { 1: 1, 2: 1, 3: 0, 4: 0 };

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문제집 — 최소 힙 + 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">4개 문제, 선행조건: 4→2, 3→1. 번호가 작은 것부터 풀기 위해 <strong>최소 힙</strong> 사용!</p>' +
            '<div id="wb-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="wb-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">힙 (min-heap)</div><div id="wb-heap' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">결과</div><div id="wb-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
            '</div>' +
            '<div id="wb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var nodesEl = container.querySelector('#wb-nodes' + suffix);
        var indegEl = container.querySelector('#wb-indeg' + suffix);
        var heapEl = container.querySelector('#wb-heap' + suffix);
        var resultEl = container.querySelector('#wb-result' + suffix);
        var infoEl = container.querySelector('#wb-info' + suffix);

        function nodeBox(nid, cls) { return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;transition:all 0.3s;' + cls + '">' + nid + '</div>'; }
        function renderNodes(states) {
            nodesEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                var st = states[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'active') cls = 'background:var(--yellow);border:2px solid var(--yellow-vivid,#f9a825);color:#333;';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                nodesEl.innerHTML += nodeBox(i, cls);
            }
        }
        function renderIndeg(indArr) {
            indegEl.innerHTML = '';
            for (var i = 1; i <= N; i++) {
                indegEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;color:var(--text2);">in=' + indArr[i] + '</div>';
            }
        }
        function renderHeap(arr) { heapEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--green);background:rgba(0,184,148,0.08);">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        renderNodes({ 1: 'default', 2: 'default', 3: 'default', 4: 'default' });
        renderIndeg(initIndeg);
        renderHeap([]);
        renderResult([]);
        infoEl.innerHTML = '<span style="color:var(--text2);">최소 힙을 사용한 위상 정렬을 시작합니다.</span>';

        var steps = [];
        // Step 1: init heap with indeg=0 nodes (3,4), sorted as min-heap → [3,4]
        steps.push({ description: '초기화: in-degree가 0인 노드 3, 4를 힙에 넣습니다. 최소 힙이므로 3이 먼저!',
            action: function() { renderNodes({ 1: 'default', 2: 'default', 3: 'queued', 4: 'queued' }); renderHeap([3, 4]); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>3, 4</strong> → 최소 힙에 추가. 최솟값: 3'; },
            undo: function() { renderNodes({ 1: 'default', 2: 'default', 3: 'default', 4: 'default' }); renderHeap([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">최소 힙을 사용한 위상 정렬을 시작합니다.</span>'; }
        });
        // Step 2: pop 3
        steps.push({ description: '힙에서 최솟값 3을 꺼내 결과에 추가. 이웃 1의 in-degree가 0이 되어 힙에 추가!',
            action: function() { renderNodes({ 1: 'queued', 2: 'default', 3: 'done', 4: 'queued' }); renderIndeg({ 1: 0, 2: 1, 3: 0, 4: 0 }); renderHeap([1, 4]); renderResult([3]); infoEl.innerHTML = '3 처리 → 1의 in-degree: 1→<strong>0</strong> → 힙에 추가! 힙: [1, 4]'; },
            undo: function() { renderNodes({ 1: 'default', 2: 'default', 3: 'queued', 4: 'queued' }); renderIndeg(initIndeg); renderHeap([3, 4]); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>3, 4</strong> → 최소 힙에 추가. 최솟값: 3'; }
        });
        // Step 3: pop 1
        steps.push({ description: '힙에서 최솟값 1을 꺼내 결과에 추가. 1에는 이웃이 없습니다.',
            action: function() { renderNodes({ 1: 'done', 2: 'default', 3: 'done', 4: 'queued' }); renderHeap([4]); renderResult([3, 1]); infoEl.innerHTML = '1 처리 완료. 힙: [4]'; },
            undo: function() { renderNodes({ 1: 'queued', 2: 'default', 3: 'done', 4: 'queued' }); renderIndeg({ 1: 0, 2: 1, 3: 0, 4: 0 }); renderHeap([1, 4]); renderResult([3]); infoEl.innerHTML = '3 처리 → 1의 in-degree: 1→<strong>0</strong> → 힙에 추가!'; }
        });
        // Step 4: pop 4
        steps.push({ description: '힙에서 4를 꺼내 결과에 추가. 이웃 2의 in-degree가 0이 되어 힙에 추가!',
            action: function() { renderNodes({ 1: 'done', 2: 'queued', 3: 'done', 4: 'done' }); renderIndeg({ 1: 0, 2: 0, 3: 0, 4: 0 }); renderHeap([2]); renderResult([3, 1, 4]); infoEl.innerHTML = '4 처리 → 2의 in-degree: 1→<strong>0</strong> → 힙에 추가!'; },
            undo: function() { renderNodes({ 1: 'done', 2: 'default', 3: 'done', 4: 'queued' }); renderIndeg({ 1: 0, 2: 1, 3: 0, 4: 0 }); renderHeap([4]); renderResult([3, 1]); infoEl.innerHTML = '1 처리 완료. 힙: [4]'; }
        });
        // Step 5: pop 2 -> done
        steps.push({ description: '힙에서 2를 꺼내 결과에 추가. 위상 정렬 완료! 결과: 3 1 4 2',
            action: function() { renderNodes({ 1: 'done', 2: 'done', 3: 'done', 4: 'done' }); renderHeap([]); renderResult([3, 1, 4, 2]); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: 3 1 4 2</strong>'; },
            undo: function() { renderNodes({ 1: 'done', 2: 'queued', 3: 'done', 4: 'done' }); renderIndeg({ 1: 0, 2: 0, 3: 0, 4: 0 }); renderHeap([2]); renderResult([3, 1, 4]); infoEl.innerHTML = '4 처리 → 2의 in-degree: 1→<strong>0</strong> → 힙에 추가!'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 최종 순위 (boj-3665) — 간선 반전 + 위상 정렬
    // ====================================================================
    _renderVizRanking(container) {
        var self = this, suffix = '-ranking';
        var N = 3;
        var lastRank = [2, 3, 1]; // 작년 순위: 2→3→1

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최종 순위 — 간선 반전 + 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">작년 순위: [2, 3, 1]. 바뀐 쌍 없음. 간선 생성 과정을 확인합니다.</p>' +
            '<div id="rk-graph' + suffix + '" style="margin-bottom:12px;text-align:center;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">큐</div><div id="rk-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">결과</div><div id="rk-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
            '</div>' +
            '<div id="rk-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var graphEl = container.querySelector('#rk-graph' + suffix);
        var queueEl = container.querySelector('#rk-queue' + suffix);
        var resultEl = container.querySelector('#rk-result' + suffix);
        var infoEl = container.querySelector('#rk-info' + suffix);

        function renderGraph(edgeList, nodeStates) {
            var html = '<div style="display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;">';
            for (var i = 1; i <= N; i++) {
                var st = nodeStates[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;' + cls + '">' + i + '</div>';
            }
            html += '</div>';
            if (edgeList.length > 0) {
                html += '<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">간선: ';
                html += edgeList.map(function(e) { return e[0] + '→' + e[1]; }).join(', ');
                html += '</div>';
            }
            graphEl.innerHTML = html;
        }
        function renderQueue(arr) { queueEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        renderGraph([], { 1: 'default', 2: 'default', 3: 'default' });
        renderQueue([]);
        renderResult([]);
        infoEl.innerHTML = '<span style="color:var(--text2);">작년 순위로부터 간선을 생성한 뒤 위상 정렬합니다.</span>';

        // All edges from last rank: 2→3, 2→1, 3→1
        var allEdges = [[2, 3], [2, 1], [3, 1]];
        // in-degree: 1:2, 2:0, 3:1

        var steps = [];
        // Step 1: build edges
        steps.push({ description: '작년 순위 [2,3,1]에서 모든 쌍의 간선 생성: 2→3, 2→1, 3→1',
            action: function() { renderGraph(allEdges, { 1: 'default', 2: 'default', 3: 'default' }); infoEl.innerHTML = '간선 생성 완료. in-degree: 1=<strong>2</strong>, 2=<strong>0</strong>, 3=<strong>1</strong>'; },
            undo: function() { renderGraph([], { 1: 'default', 2: 'default', 3: 'default' }); infoEl.innerHTML = '<span style="color:var(--text2);">작년 순위로부터 간선을 생성한 뒤 위상 정렬합니다.</span>'; }
        });
        // Step 2: init queue with indeg=0 → [2]
        steps.push({ description: 'in-degree가 0인 노드 2를 큐에 넣습니다.',
            action: function() { renderGraph(allEdges, { 1: 'default', 2: 'queued', 3: 'default' }); renderQueue([2]); infoEl.innerHTML = '진입 차수 0: <strong>2</strong> → 큐에 추가'; },
            undo: function() { renderGraph(allEdges, { 1: 'default', 2: 'default', 3: 'default' }); renderQueue([]); infoEl.innerHTML = '간선 생성 완료. in-degree: 1=<strong>2</strong>, 2=<strong>0</strong>, 3=<strong>1</strong>'; }
        });
        // Step 3: pop 2
        steps.push({ description: '2를 꺼내 결과에 추가. 이웃 3,1의 in-degree 줄임. 3의 in-degree가 0이 되어 큐에 추가!',
            action: function() { renderGraph(allEdges, { 1: 'default', 2: 'done', 3: 'queued' }); renderQueue([3]); renderResult([2]); infoEl.innerHTML = '2 처리 → 3의 in-degree: 1→<strong>0</strong>, 1의 in-degree: 2→<strong>1</strong>'; },
            undo: function() { renderGraph(allEdges, { 1: 'default', 2: 'queued', 3: 'default' }); renderQueue([2]); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>2</strong> → 큐에 추가'; }
        });
        // Step 4: pop 3
        steps.push({ description: '3을 꺼내 결과에 추가. 이웃 1의 in-degree가 0이 되어 큐에 추가!',
            action: function() { renderGraph(allEdges, { 1: 'queued', 2: 'done', 3: 'done' }); renderQueue([1]); renderResult([2, 3]); infoEl.innerHTML = '3 처리 → 1의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; },
            undo: function() { renderGraph(allEdges, { 1: 'default', 2: 'done', 3: 'queued' }); renderQueue([3]); renderResult([2]); infoEl.innerHTML = '2 처리 → 3의 in-degree: 1→<strong>0</strong>, 1의 in-degree: 2→<strong>1</strong>'; }
        });
        // Step 5: pop 1 -> done
        steps.push({ description: '1을 꺼내 결과에 추가. 위상 정렬 완료! 결과: 2 3 1',
            action: function() { renderGraph(allEdges, { 1: 'done', 2: 'done', 3: 'done' }); renderQueue([]); renderResult([2, 3, 1]); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: 2 3 1</strong>'; },
            undo: function() { renderGraph(allEdges, { 1: 'queued', 2: 'done', 3: 'done' }); renderQueue([1]); renderResult([2, 3]); infoEl.innerHTML = '3 처리 → 1의 in-degree: 1→<strong>0</strong> → 큐에 추가!'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderProblem(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 위상 정렬', desc: '진입 차수와 BFS를 활용한 기본 위상 정렬 (Gold III)', problemIds: ['boj-2252'] },
        { num: 2, title: '심화 위상 정렬', desc: '우선순위 큐, 사이클 판별 등 심화 응용 (Gold I~II)', problemIds: ['boj-1766', 'boj-3665'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 기본 위상 정렬 =====
        {
            id: 'boj-2252',
            title: 'BOJ 2252 - 줄 세우기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2252',
            simIntro: 'Kahn\'s Algorithm으로 학생들을 줄 세우는 과정을 단계별로 확인하세요.',
            descriptionHTML: '<h3>문제</h3>' +
                '<p>N명의 학생들을 키 순서대로 줄을 세우려고 합니다. ' +
                '일부 학생들의 키를 비교한 결과가 주어질 때, 줄을 세우는 순서를 구하세요.</p>' +
                '<p>두 학생의 키를 비교한 결과 "학생 A가 학생 B 앞에 서야 한다"는 정보가 M개 주어집니다.</p>' +
                '<div class="problem-io">' +
                    '<div><h4>입력</h4>' +
                    '<p>첫째 줄: N M (학생 수, 비교 횟수, N&le;32,000, M&le;100,000)<br>' +
                    '이후 M줄: A B (A가 B 앞에 서야 함)</p></div>' +
                    '<div><h4>출력</h4>' +
                    '<p>줄을 세운 결과를 출력합니다. 답이 여러 개면 아무거나 출력합니다.</p></div>' +
                '</div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                    '<div><strong>입력</strong><pre>3 2\n1 3\n2 3</pre></div>' +
                    '<div><strong>출력</strong><pre>1 2 3</pre></div>' +
                '</div></div>',
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
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)\n\nprint(*result)',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) q.push(i);\n    }\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        List<List<Integer>> graph = new ArrayList<>();\n        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());\n        int[] inDeg = new int[N + 1];\n\n        for (int i = 0; i < M; i++) {\n            st = new StringTokenizer(br.readLine());\n            int a = Integer.parseInt(st.nextToken());\n            int b = Integer.parseInt(st.nextToken());\n            graph.get(a).add(b);\n            inDeg[b]++;\n        }\n\n        Queue<Integer> q = new LinkedList<>();\n        for (int i = 1; i <= N; i++) {\n            if (inDeg[i] == 0) q.add(i);\n        }\n\n        StringBuilder sb = new StringBuilder();\n        while (!q.isEmpty()) {\n            int v = q.poll();\n            sb.append(v).append(" ");\n            for (int u : graph.get(v)) {\n                if (--inDeg[u] == 0) q.add(u);\n            }\n        }\n        System.out.println(sb.toString().trim());\n    }\n}'
            },
            solutions: [{
                approach: 'Kahn\'s Algorithm (BFS)',
                description: '진입 차수가 0인 노드부터 큐에 넣고 BFS로 위상 정렬합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구축', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: '진입 차수 0인 노드 큐에 추가', code: 'queue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)' },
                        { title: 'BFS 위상 정렬', code: 'result = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)' },
                        { title: '출력', code: 'print(*result)' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[0].templates; }
            }]
        },

        // ===== 2단계: 심화 위상 정렬 =====
        {
            id: 'boj-1766',
            title: 'BOJ 1766 - 문제집',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1766',
            simIntro: '최소 힙을 사용하여 번호가 작은 문제부터 풀어나가는 과정을 확인하세요.',
            descriptionHTML: '<h3>문제</h3>' +
                '<p>N개의 문제가 있고, 번호가 작을수록 쉬운 문제입니다. ' +
                'M개의 "A번 문제를 풀어야 B번 문제를 풀 수 있다"는 조건이 있습니다.</p>' +
                '<p>모든 문제를 풀되, 조건을 지키면서 가능하면 쉬운 문제(번호가 작은 것)부터 풀어야 합니다. ' +
                '풀어야 하는 순서를 출력하세요.</p>' +
                '<div class="problem-io">' +
                    '<div><h4>입력</h4>' +
                    '<p>첫째 줄: N M (N&le;32,000, M&le;100,000)<br>' +
                    '이후 M줄: A B (A를 먼저 풀어야 B를 풀 수 있음)</p></div>' +
                    '<div><h4>출력</h4>' +
                    '<p>문제를 풀어야 하는 순서를 출력합니다.</p></div>' +
                '</div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                    '<div><strong>입력</strong><pre>4 2\n4 2\n3 1</pre></div>' +
                    '<div><strong>출력</strong><pre>3 1 4 2</pre></div>' +
                '</div></div>',
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
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nheap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)\n\nresult = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)\n\nprint(*result)',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) pq.push(i);\n    }\n\n    while (!pq.empty()) {\n        int v = pq.top(); pq.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) pq.push(u);\n        }\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        List<List<Integer>> graph = new ArrayList<>();\n        for (int i = 0; i <= N; i++) graph.add(new ArrayList<>());\n        int[] inDeg = new int[N + 1];\n\n        for (int i = 0; i < M; i++) {\n            st = new StringTokenizer(br.readLine());\n            int a = Integer.parseInt(st.nextToken());\n            int b = Integer.parseInt(st.nextToken());\n            graph.get(a).add(b);\n            inDeg[b]++;\n        }\n\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int i = 1; i <= N; i++) {\n            if (inDeg[i] == 0) pq.add(i);\n        }\n\n        StringBuilder sb = new StringBuilder();\n        while (!pq.isEmpty()) {\n            int v = pq.poll();\n            sb.append(v).append(" ");\n            for (int u : graph.get(v)) {\n                if (--inDeg[u] == 0) pq.add(u);\n            }\n        }\n        System.out.println(sb.toString().trim());\n    }\n}'
            },
            solutions: [{
                approach: '최소 힙 + Kahn\'s Algorithm',
                description: '일반 큐 대신 최소 힙을 사용하여 번호가 작은 문제부터 처리합니다.',
                timeComplexity: 'O((N + M) log N)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구축', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: '최소 힙 초기화', code: 'heap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)' },
                        { title: '힙 기반 위상 정렬', code: 'result = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)' },
                        { title: '출력', code: 'print(*result)' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-3665',
            title: 'BOJ 3665 - 최종 순위',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/3665',
            simIntro: '작년 순위로부터 간선을 만들고 위상 정렬하는 과정을 확인하세요.',
            descriptionHTML: '<h3>문제</h3>' +
                '<p>작년 순위가 주어지고, 올해 상대적 순서가 바뀐 쌍들이 주어집니다. ' +
                '올해의 최종 순위를 구하세요.</p>' +
                '<p>작년에 앞에 있던 팀이 올해도 앞이라고 가정하되, 바뀐 쌍은 순서가 뒤집힙니다.</p>' +
                '<p>순위를 확정할 수 없으면 "?", 데이터에 모순이 있으면 "IMPOSSIBLE"을 출력합니다.</p>' +
                '<div class="problem-io">' +
                    '<div><h4>입력</h4>' +
                    '<p>T (테스트 케이스 수, &le;100)<br>' +
                    '각 케이스: n (팀 수, &le;500), n개 정수 (작년 순위), m (바뀐 쌍 수), m줄의 쌍</p></div>' +
                    '<div><h4>출력</h4>' +
                    '<p>각 케이스마다 올해 순위 또는 "?" 또는 "IMPOSSIBLE"</p></div>' +
                '</div>' +
                '<div class="problem-example"><h4>예제</h4><div class="example-grid">' +
                    '<div><strong>입력</strong><pre>3\n5\n5 4 3 2 1\n2\n2 4\n3 4\n3\n2 3 1\n0\n4\n1 2 3 4\n3\n1 2\n3 4\n2 3</pre></div>' +
                    '<div><strong>출력</strong><pre>5 3 2 4 1\n2 3 1\nIMPOSSIBLE</pre></div>' +
                '</div></div>',
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
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    n = int(input())\n    rank = list(map(int, input().split()))\n\n    # 모든 쌍에 대해 간선 생성\n    graph = [[False] * (n + 1) for _ in range(n + 1)]\n    in_degree = [0] * (n + 1)\n\n    for i in range(n):\n        for j in range(i + 1, n):\n            graph[rank[i]][rank[j]] = True\n            in_degree[rank[j]] += 1\n\n    m = int(input())\n    for _ in range(m):\n        a, b = map(int, input().split())\n        if graph[a][b]:\n            graph[a][b] = False\n            graph[b][a] = True\n            in_degree[b] -= 1\n            in_degree[a] += 1\n        else:\n            graph[b][a] = False\n            graph[a][b] = True\n            in_degree[a] -= 1\n            in_degree[b] += 1\n\n    queue = deque()\n    for i in range(1, n + 1):\n        if in_degree[i] == 0:\n            queue.append(i)\n\n    result = []\n    ambiguous = False\n\n    for _ in range(n):\n        if len(queue) == 0:\n            break\n        if len(queue) > 1:\n            ambiguous = True\n        v = queue.popleft()\n        result.append(v)\n        for u in range(1, n + 1):\n            if graph[v][u]:\n                in_degree[u] -= 1\n                if in_degree[u] == 0:\n                    queue.append(u)\n\n    if len(result) != n:\n        print("IMPOSSIBLE")\n    elif ambiguous:\n        print("?")\n    else:\n        print(*result)',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n;\n        scanf("%d", &n);\n        vector<int> rank_arr(n);\n        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);\n\n        vector<vector<bool>> graph(n + 1, vector<bool>(n + 1, false));\n        vector<int> in_deg(n + 1, 0);\n\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                graph[rank_arr[i]][rank_arr[j]] = true;\n                in_deg[rank_arr[j]]++;\n            }\n        }\n\n        int m;\n        scanf("%d", &m);\n        for (int i = 0; i < m; i++) {\n            int a, b;\n            scanf("%d %d", &a, &b);\n            if (graph[a][b]) {\n                graph[a][b] = false; graph[b][a] = true;\n                in_deg[b]--; in_deg[a]++;\n            } else {\n                graph[b][a] = false; graph[a][b] = true;\n                in_deg[a]--; in_deg[b]++;\n            }\n        }\n\n        queue<int> q;\n        for (int i = 1; i <= n; i++) {\n            if (in_deg[i] == 0) q.push(i);\n        }\n\n        vector<int> result;\n        bool ambiguous = false;\n\n        for (int i = 0; i < n; i++) {\n            if (q.empty()) { result.clear(); break; }\n            if (q.size() > 1) ambiguous = true;\n            int v = q.front(); q.pop();\n            result.push_back(v);\n            for (int u = 1; u <= n; u++) {\n                if (graph[v][u]) {\n                    if (--in_deg[u] == 0) q.push(u);\n                }\n            }\n        }\n\n        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");\n        else if (ambiguous) printf("?\\n");\n        else {\n            for (int i = 0; i < n; i++)\n                printf("%d%c", result[i], i == n - 1 ? \'\\n\' : \' \');\n        }\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int T = Integer.parseInt(br.readLine().trim());\n        StringBuilder out = new StringBuilder();\n\n        while (T-- > 0) {\n            int n = Integer.parseInt(br.readLine().trim());\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            int[] rank = new int[n];\n            for (int i = 0; i < n; i++) rank[i] = Integer.parseInt(st.nextToken());\n\n            boolean[][] graph = new boolean[n + 1][n + 1];\n            int[] inDeg = new int[n + 1];\n\n            for (int i = 0; i < n; i++) {\n                for (int j = i + 1; j < n; j++) {\n                    graph[rank[i]][rank[j]] = true;\n                    inDeg[rank[j]]++;\n                }\n            }\n\n            int m = Integer.parseInt(br.readLine().trim());\n            for (int i = 0; i < m; i++) {\n                st = new StringTokenizer(br.readLine());\n                int a = Integer.parseInt(st.nextToken());\n                int b = Integer.parseInt(st.nextToken());\n                if (graph[a][b]) {\n                    graph[a][b] = false; graph[b][a] = true;\n                    inDeg[b]--; inDeg[a]++;\n                } else {\n                    graph[b][a] = false; graph[a][b] = true;\n                    inDeg[a]--; inDeg[b]++;\n                }\n            }\n\n            Queue<Integer> q = new LinkedList<>();\n            for (int i = 1; i <= n; i++) {\n                if (inDeg[i] == 0) q.add(i);\n            }\n\n            List<Integer> result = new ArrayList<>();\n            boolean ambiguous = false;\n\n            for (int i = 0; i < n; i++) {\n                if (q.isEmpty()) { result.clear(); break; }\n                if (q.size() > 1) ambiguous = true;\n                int v = q.poll();\n                result.add(v);\n                for (int u = 1; u <= n; u++) {\n                    if (graph[v][u]) {\n                        if (--inDeg[u] == 0) q.add(u);\n                    }\n                }\n            }\n\n            if (result.size() != n) out.append("IMPOSSIBLE\\n");\n            else if (ambiguous) out.append("?\\n");\n            else {\n                for (int i = 0; i < n; i++) {\n                    out.append(result.get(i));\n                    out.append(i == n - 1 ? "\\n" : " ");\n                }\n            }\n        }\n        System.out.print(out);\n    }\n}'
            },
            solutions: [{
                approach: '간선 반전 + Kahn\'s Algorithm',
                description: '작년 순위로 모든 쌍의 간선을 만들고, 바뀐 쌍의 간선을 뒤집은 뒤 위상 정렬합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 모든 쌍 간선 생성', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nn = int(input())\nrank = list(map(int, input().split()))\n\ngraph = [[False] * (n + 1) for _ in range(n + 1)]\nin_degree = [0] * (n + 1)\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        graph[rank[i]][rank[j]] = True\n        in_degree[rank[j]] += 1' },
                        { title: '바뀐 쌍 간선 반전', code: 'm = int(input())\nfor _ in range(m):\n    a, b = map(int, input().split())\n    if graph[a][b]:\n        graph[a][b] = False\n        graph[b][a] = True\n        in_degree[b] -= 1\n        in_degree[a] += 1\n    else:\n        graph[b][a] = False\n        graph[a][b] = True\n        in_degree[a] -= 1\n        in_degree[b] += 1' },
                        { title: '위상 정렬 + 판별', code: 'queue = deque()\nfor i in range(1, n + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nambiguous = False\n\nfor _ in range(n):\n    if len(queue) == 0: break\n    if len(queue) > 1: ambiguous = True\n    v = queue.popleft()\n    result.append(v)\n    for u in range(1, n + 1):\n        if graph[v][u]:\n            in_degree[u] -= 1\n            if in_degree[u] == 0:\n                queue.append(u)' },
                        { title: '결과 출력', code: 'if len(result) != n:\n    print("IMPOSSIBLE")\nelif ambiguous:\n    print("?")\nelse:\n    print(*result)' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[2].templates; }
            }]
        }
    ],

    // ===== 역호환 스텁 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { topologicalSortTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.topologicalsort = topologicalSortTopic;
