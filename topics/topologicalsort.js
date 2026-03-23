// =========================================================
// 위상 정렬 (Topological Sort) 토픽 모듈
// =========================================================
var topologicalSortTopic = {
    id: 'topologicalsort',
    title: '위상 정렬',
    icon: '📋',
    category: '심화 (Gold~Platinum)',
    order: 17,
    description: 'DAG에서 선후관계를 지키며 모든 노드를 일렬로 나열하는 기법',
    relatedNote: '위상 정렬은 빌드 시스템, 수강 순서, 작업 스케줄링 등 선행 조건이 있는 문제에 활용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-14567': { type: '선수과목 순서',     color: '#00b894',      vizMethod: '_renderVizPrereq' },
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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';        container.appendChild(contentDiv);
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
                        <p>한 노드로 들어오는 화살표의 수입니다. 진입 차수가 0이면 "바로 시작할 수 있는 일"입니다.<br>
                        <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: queue ↗</a></span></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.5"/><rect x="26" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.8"/><line x1="12" y1="17" x2="14" y2="17" stroke="var(--accent)" stroke-width="2"/><line x1="24" y1="17" x2="26" y2="17" stroke="var(--accent)" stroke-width="2"/></svg>
                        </div>
                        <h3>위상 순서</h3>
                        <p>DAG의 모든 간선 u→v에서 u가 v보다 앞에 오도록 일렬로 나열한 것입니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 방향 그래프 (인접 리스트) + 진입 차수 만들기
#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;queue&gt;
using namespace std;

int main() {
    int N, M;
    cin &gt;&gt; N &gt;&gt; M;

    vector&lt;vector&lt;int&gt;&gt; graph(N + 1);  // 인접 리스트
    vector&lt;int&gt; in_degree(N + 1, 0);   // 진입 차수

    for (int i = 0; i &lt; M; i++) {
        int a, b;
        cin &gt;&gt; a &gt;&gt; b;
        graph[a].push_back(b);  // a → b (a를 먼저!)
        in_degree[b]++;         // b의 진입 차수 +1
    }
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — DAG & 진입 차수</div>
                    <div class="concept-demo-msg" id="ts-demo-dag-msg">👆 노드를 클릭해서 진입 차수를 확인하세요!</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;">
                        <svg id="ts-demo-dag-svg" viewBox="0 0 400 220" width="100%" style="max-width:420px;max-height:220px;">
                            <defs>
                                <marker id="ts-dag-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill="var(--text2)"/>
                                </marker>
                                <marker id="ts-dag-arrow-hl" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill="var(--yellow)"/>
                                </marker>
                            </defs>
                            <!-- edges drawn by JS -->
                            <g id="ts-dag-edges"></g>
                            <g id="ts-dag-nodes"></g>
                        </svg>
                        <div id="ts-dag-info" style="margin-top:0.8rem;font-size:0.95rem;color:var(--text2);min-height:1.6em;text-align:center;"></div>
                    </div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 순서 맞추기 퍼즐</div>
                    <div class="concept-demo-msg" id="ts-demo-order-msg">진입 차수가 0인 노드를 순서대로 클릭하세요! 올바른 위상 정렬을 만들어 보세요.</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="ts-demo-order-reset">🔄 다시 시도</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;">
                        <svg id="ts-demo-order-svg" viewBox="0 0 400 200" width="100%" style="max-width:420px;max-height:200px;">
                            <defs>
                                <marker id="ts-order-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill="var(--text2)"/>
                                </marker>
                            </defs>
                            <g id="ts-order-edges"></g>
                            <g id="ts-order-nodes"></g>
                        </svg>
                        <div style="margin-top:0.8rem;">
                            <span style="font-size:0.85rem;color:var(--text2);">선택한 순서:</span>
                            <span id="ts-demo-order-result" style="font-size:1rem;font-weight:600;color:var(--accent);margin-left:0.5rem;">[ ]</span>
                        </div>
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
                        <p>진입 차수가 0이 된 노드를 큐에 추가합니다. 큐가 빌 때까지 반복합니다.<br>
                        <a href="https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Kahn's Algorithm ↗</a></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Kahn's Algorithm (BFS 위상 정렬)
queue&lt;int&gt; q;
for (int i = 1; i &lt;= N; i++) {
    if (in_degree[i] == 0)
        q.push(i);
}

vector&lt;int&gt; result;
while (!q.empty()) {
    int v = q.front();
    q.pop();
    result.push_back(v);
    for (int u : graph[v]) {
        in_degree[u]--;
        if (in_degree[u] == 0)
            q.push(u);
    }
}

// result의 크기가 N이 아니면 사이클 존재!
if (result.size() != N)
    cout &lt;&lt; "사이클이 있어 위상 정렬 불가!" &lt;&lt; endl;
else {
    for (int i = 0; i &lt; result.size(); i++)
        cout &lt;&lt; result[i] &lt;&lt; (i + 1 &lt; result.size() ? " " : "\n");
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — Kahn's Algorithm 따라가기</div>
                    <div class="concept-demo-msg" id="ts-demo-kahn-msg">▶ 다음 버튼을 눌러 Kahn's Algorithm을 단계별로 따라가 보세요!</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="ts-demo-kahn-prev" disabled>◀ 이전</button>
                        <span id="ts-demo-kahn-counter" style="font-size:0.85rem;color:var(--text2);min-width:60px;text-align:center;">시작 전</span>
                        <button class="concept-demo-btn green" id="ts-demo-kahn-next">다음 ▶</button>
                        <button class="concept-demo-btn" id="ts-demo-kahn-reset" style="margin-left:0.5rem;">🔄</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
                        <svg id="ts-demo-kahn-svg" viewBox="0 0 400 180" width="100%" style="max-width:420px;max-height:180px;">
                            <defs>
                                <marker id="ts-kahn-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                                    <path d="M0,0 L10,5 L0,10 Z" fill="var(--text2)"/>
                                </marker>
                            </defs>
                            <g id="ts-kahn-edges"></g>
                            <g id="ts-kahn-nodes"></g>
                        </svg>
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;justify-content:center;width:100%;">
                            <div style="text-align:center;">
                                <div style="font-size:0.8rem;color:var(--text2);margin-bottom:4px;">진입 차수</div>
                                <div id="ts-kahn-indeg" style="display:flex;gap:4px;justify-content:center;"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:0.8rem;color:var(--text2);margin-bottom:4px;">큐</div>
                                <div id="ts-kahn-queue" style="display:flex;gap:4px;justify-content:center;min-height:32px;padding:4px 8px;background:var(--bg2);border-radius:8px;min-width:60px;align-items:center;font-size:0.9rem;color:var(--accent);font-weight:600;"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:0.8rem;color:var(--text2);margin-bottom:4px;">결과</div>
                                <div id="ts-kahn-result" style="display:flex;gap:4px;justify-content:center;min-height:32px;padding:4px 8px;background:var(--bg2);border-radius:8px;min-width:60px;align-items:center;font-size:0.9rem;color:var(--green);font-weight:600;"></div>
                            </div>
                        </div>
                    </div>
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
                <span class="lang-py"><div class="code-block">
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
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 우선순위 큐를 사용한 위상 정렬
// greater&lt;int&gt;로 최소 힙 구성 (작은 번호 먼저!)
priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;
for (int i = 1; i &lt;= N; i++) {
    if (in_degree[i] == 0)
        pq.push(i);
}

vector&lt;int&gt; result;
while (!pq.empty()) {
    int v = pq.top();  // 가장 작은 번호 먼저!
    pq.pop();
    result.push_back(v);
    for (int u : graph[v]) {
        in_degree[u]--;
        if (in_degree[u] == 0)
            pq.push(u);
    }
}

for (int i = 0; i &lt; result.size(); i++)
    cout &lt;&lt; result[i] &lt;&lt; (i + 1 &lt; result.size() ? " " : "\n");</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 큐 vs 최소 힙 비교</div>
                    <div class="concept-demo-msg" id="ts-demo-cmp-msg">아래 버튼을 눌러 같은 그래프에서 큐와 최소 힙의 처리 순서 차이를 확인하세요!</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn green" id="ts-demo-cmp-run">▶ 동시에 실행</button>
                        <button class="concept-demo-btn" id="ts-demo-cmp-reset">🔄 리셋</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;">
                        <div style="flex:1;min-width:180px;max-width:280px;">
                            <div style="text-align:center;font-weight:600;color:var(--accent);margin-bottom:0.5rem;">일반 큐 (FIFO)</div>
                            <svg id="ts-cmp-queue-svg" viewBox="0 0 280 150" width="100%" style="max-height:150px;">
                                <defs>
                                    <marker id="ts-cmp-q-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                                        <path d="M0,0 L10,5 L0,10 Z" fill="var(--text2)"/>
                                    </marker>
                                </defs>
                                <g id="ts-cmp-q-edges"></g>
                                <g id="ts-cmp-q-nodes"></g>
                            </svg>
                            <div style="text-align:center;margin-top:4px;">
                                <span style="font-size:0.8rem;color:var(--text2);">결과: </span>
                                <span id="ts-cmp-q-result" style="font-size:0.95rem;font-weight:600;color:var(--accent);">[ ]</span>
                            </div>
                        </div>
                        <div style="flex:1;min-width:180px;max-width:280px;">
                            <div style="text-align:center;font-weight:600;color:var(--green);margin-bottom:0.5rem;">최소 힙 (Min-Heap)</div>
                            <svg id="ts-cmp-heap-svg" viewBox="0 0 280 150" width="100%" style="max-height:150px;">
                                <defs>
                                    <marker id="ts-cmp-h-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                                        <path d="M0,0 L10,5 L0,10 Z" fill="var(--text2)"/>
                                    </marker>
                                </defs>
                                <g id="ts-cmp-h-edges"></g>
                                <g id="ts-cmp-h-nodes"></g>
                            </svg>
                            <div style="text-align:center;margin-top:4px;">
                                <span style="font-size:0.8rem;color:var(--text2);">결과: </span>
                                <span id="ts-cmp-h-result" style="font-size:0.95rem;font-weight:600;color:var(--green);">[ ]</span>
                            </div>
                        </div>
                    </div>
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

        // ===== Demo 1: DAG & In-degree =====
        (function() {
            var nodes = [
                { id: 1, x: 60, y: 40 },
                { id: 2, x: 200, y: 40 },
                { id: 3, x: 340, y: 40 },
                { id: 4, x: 130, y: 130 },
                { id: 5, x: 270, y: 130 },
                { id: 6, x: 200, y: 195 }
            ];
            var edges = [[1,4],[2,4],[2,5],[3,5],[4,6],[5,6]];
            var R = 22;
            var nodeMap = {};
            nodes.forEach(function(n) { nodeMap[n.id] = n; });

            function shorten(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy), rat = r / len;
                return { x1: x1 + dx*rat, y1: y1 + dy*rat, x2: x2 - dx*rat, y2: y2 - dy*rat };
            }

            var edgesG = container.querySelector('#ts-dag-edges');
            var nodesG = container.querySelector('#ts-dag-nodes');
            var infoEl = container.querySelector('#ts-dag-info');
            var msgEl = container.querySelector('#ts-demo-dag-msg');
            if (!edgesG || !nodesG) return;

            // draw edges
            edges.forEach(function(e) {
                var a = nodeMap[e[0]], b = nodeMap[e[1]];
                var s = shorten(a.x, a.y, b.x, b.y, R);
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', s.x1); line.setAttribute('y1', s.y1);
                line.setAttribute('x2', s.x2); line.setAttribute('y2', s.y2);
                line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#ts-dag-arrow)');
                line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                line.style.transition = 'stroke 0.3s, stroke-width 0.3s';
                edgesG.appendChild(line);
            });

            // draw nodes
            nodes.forEach(function(n) {
                var circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', R);
                circ.setAttribute('fill', 'var(--bg2)'); circ.setAttribute('stroke', 'var(--accent)');
                circ.setAttribute('stroke-width', '2.5'); circ.setAttribute('data-id', n.id);
                circ.style.cursor = 'pointer'; circ.style.transition = 'fill 0.3s, stroke 0.3s';
                nodesG.appendChild(circ);
                var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 5);
                txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '14');
                txt.setAttribute('font-weight', 'bold'); txt.setAttribute('fill', 'var(--text)');
                txt.setAttribute('data-id', n.id); txt.style.pointerEvents = 'none';
                txt.textContent = n.id;
                nodesG.appendChild(txt);
            });

            var selectedNode = null;

            function resetHighlight() {
                edgesG.querySelectorAll('line').forEach(function(l) {
                    l.setAttribute('stroke', 'var(--text2)'); l.setAttribute('stroke-width', '2');
                    l.setAttribute('marker-end', 'url(#ts-dag-arrow)');
                });
                nodesG.querySelectorAll('circle').forEach(function(c) {
                    c.setAttribute('fill', 'var(--bg2)'); c.setAttribute('stroke', 'var(--accent)');
                });
            }

            function highlightNode(id) {
                resetHighlight();
                selectedNode = id;
                var inDeg = 0;
                var fromNodes = [];
                edgesG.querySelectorAll('line').forEach(function(l) {
                    if (parseInt(l.getAttribute('data-to')) === id) {
                        l.setAttribute('stroke', 'var(--yellow)'); l.setAttribute('stroke-width', '3');
                        l.setAttribute('marker-end', 'url(#ts-dag-arrow-hl)');
                        inDeg++;
                        fromNodes.push(l.getAttribute('data-from'));
                    }
                });
                nodesG.querySelectorAll('circle[data-id="' + id + '"]').forEach(function(c) {
                    c.setAttribute('fill', 'var(--yellow)'); c.setAttribute('stroke', 'var(--yellow)');
                });
                var label = inDeg === 0
                    ? '노드 ' + id + '의 진입 차수 = <strong>0</strong> — 바로 시작 가능!'
                    : '노드 ' + id + '의 진입 차수 = <strong>' + inDeg + '</strong> (노드 ' + fromNodes.join(', ') + '에서 들어옴)';
                infoEl.innerHTML = label;
                msgEl.textContent = inDeg === 0
                    ? '진입 차수가 0이면 선행 조건 없이 바로 처리할 수 있습니다!'
                    : '노란 화살표가 이 노드로 들어오는 간선입니다. 개수 = 진입 차수!';
            }

            container.querySelector('#ts-demo-dag-svg').addEventListener('click', function(e) {
                var tgt = e.target;
                var id = tgt.getAttribute('data-id');
                if (id) highlightNode(parseInt(id));
            });
        })();

        // ===== Demo 2: Ordering Puzzle =====
        (function() {
            var nodes = [
                { id: 1, x: 60, y: 40 },
                { id: 2, x: 200, y: 40 },
                { id: 3, x: 340, y: 40 },
                { id: 4, x: 130, y: 140 },
                { id: 5, x: 270, y: 140 }
            ];
            var edges = [[1,4],[2,4],[3,5],[4,5]];
            var R = 22;
            var nodeMap = {};
            nodes.forEach(function(n) { nodeMap[n.id] = n; });

            function shorten(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy), rat = r / len;
                return { x1: x1 + dx*rat, y1: y1 + dy*rat, x2: x2 - dx*rat, y2: y2 - dy*rat };
            }

            var edgesG = container.querySelector('#ts-order-edges');
            var nodesG = container.querySelector('#ts-order-nodes');
            var msgEl = container.querySelector('#ts-demo-order-msg');
            var resultEl = container.querySelector('#ts-demo-order-result');
            var resetBtn = container.querySelector('#ts-demo-order-reset');
            if (!edgesG || !nodesG) return;

            function drawGraph() {
                edgesG.innerHTML = '';
                nodesG.innerHTML = '';
                edges.forEach(function(e) {
                    var a = nodeMap[e[0]], b = nodeMap[e[1]];
                    var s = shorten(a.x, a.y, b.x, b.y, R);
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', s.x1); line.setAttribute('y1', s.y1);
                    line.setAttribute('x2', s.x2); line.setAttribute('y2', s.y2);
                    line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '2');
                    line.setAttribute('marker-end', 'url(#ts-order-arrow)');
                    line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                    line.style.transition = 'opacity 0.3s';
                    edgesG.appendChild(line);
                });
                nodes.forEach(function(n) {
                    var circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', R);
                    circ.setAttribute('fill', 'var(--bg2)'); circ.setAttribute('stroke', 'var(--accent)');
                    circ.setAttribute('stroke-width', '2.5'); circ.setAttribute('data-id', n.id);
                    circ.style.cursor = 'pointer'; circ.style.transition = 'fill 0.3s, stroke 0.3s, opacity 0.3s';
                    nodesG.appendChild(circ);
                    var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 5);
                    txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '14');
                    txt.setAttribute('font-weight', 'bold'); txt.setAttribute('fill', 'var(--text)');
                    txt.setAttribute('data-id', n.id); txt.style.pointerEvents = 'none';
                    txt.textContent = n.id;
                    nodesG.appendChild(txt);
                });
            }

            var chosen = [];
            var inDeg = {};

            function initState() {
                chosen = [];
                inDeg = {};
                nodes.forEach(function(n) { inDeg[n.id] = 0; });
                edges.forEach(function(e) { inDeg[e[1]]++; });
                drawGraph();
                resultEl.textContent = '[ ]';
                msgEl.textContent = '진입 차수가 0인 노드를 순서대로 클릭하세요! 올바른 위상 정렬을 만들어 보세요.';
                msgEl.style.color = '';
            }

            function handleNodeClick(id) {
                if (chosen.indexOf(id) !== -1) return;
                if (chosen.length >= nodes.length) return;

                if (inDeg[id] !== 0) {
                    // invalid choice - flash red
                    var circ = nodesG.querySelector('circle[data-id="' + id + '"]');
                    circ.setAttribute('fill', 'var(--red)');
                    setTimeout(function() { circ.setAttribute('fill', 'var(--bg2)'); }, 400);
                    msgEl.textContent = '노드 ' + id + '은(는) 아직 진입 차수가 ' + inDeg[id] + '입니다! 선행 노드를 먼저 처리하세요.';
                    msgEl.style.color = 'var(--red)';
                    return;
                }

                // valid choice
                chosen.push(id);
                var circ = nodesG.querySelector('circle[data-id="' + id + '"]');
                circ.setAttribute('fill', 'var(--green)'); circ.setAttribute('stroke', 'var(--green)');
                circ.style.cursor = 'default';

                // reduce in-degrees
                edges.forEach(function(e) {
                    if (e[0] === id) {
                        inDeg[e[1]]--;
                        edgesG.querySelectorAll('line[data-from="' + id + '"]').forEach(function(l) {
                            l.style.opacity = '0.3';
                        });
                    }
                });

                resultEl.textContent = '[ ' + chosen.join(', ') + ' ]';

                if (chosen.length === nodes.length) {
                    msgEl.textContent = '완벽합니다! [ ' + chosen.join(', ') + ' ]은(는) 올바른 위상 정렬입니다!';
                    msgEl.style.color = 'var(--green)';
                } else {
                    // highlight available nodes
                    var available = [];
                    nodes.forEach(function(n) {
                        if (chosen.indexOf(n.id) === -1 && inDeg[n.id] === 0) available.push(n.id);
                    });
                    msgEl.textContent = '좋아요! 다음으로 선택 가능한 노드: ' + available.join(', ');
                    msgEl.style.color = 'var(--accent)';
                }
            }

            container.querySelector('#ts-demo-order-svg').addEventListener('click', function(e) {
                var tgt = e.target;
                var id = tgt.getAttribute('data-id');
                if (id) handleNodeClick(parseInt(id));
            });

            resetBtn.addEventListener('click', function() { initState(); });
            initState();
        })();

        // ===== Demo 3: Kahn's Algorithm Step-by-Step =====
        (function() {
            var nodes = [
                { id: 1, x: 60, y: 40 },
                { id: 2, x: 200, y: 40 },
                { id: 3, x: 340, y: 40 },
                { id: 4, x: 130, y: 120 },
                { id: 5, x: 270, y: 120 }
            ];
            var edges = [[1,4],[2,4],[2,5],[3,5],[4,5]];
            var R = 20;
            var nodeMap = {};
            nodes.forEach(function(n) { nodeMap[n.id] = n; });

            function shorten(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy), rat = r / len;
                return { x1: x1 + dx*rat, y1: y1 + dy*rat, x2: x2 - dx*rat, y2: y2 - dy*rat };
            }

            var svgEl = container.querySelector('#ts-demo-kahn-svg');
            var edgesG = container.querySelector('#ts-kahn-edges');
            var nodesG = container.querySelector('#ts-kahn-nodes');
            var indegEl = container.querySelector('#ts-kahn-indeg');
            var queueEl = container.querySelector('#ts-kahn-queue');
            var resultEl = container.querySelector('#ts-kahn-result');
            var msgEl = container.querySelector('#ts-demo-kahn-msg');
            var counterEl = container.querySelector('#ts-demo-kahn-counter');
            var prevBtn = container.querySelector('#ts-demo-kahn-prev');
            var nextBtn = container.querySelector('#ts-demo-kahn-next');
            var resetBtnK = container.querySelector('#ts-demo-kahn-reset');
            if (!svgEl || !edgesG || !nodesG) return;

            // Build steps for Kahn's algorithm
            // Graph: 1->4, 2->4, 2->5, 3->5, 4->5
            // In-degrees: 1:0, 2:0, 3:0, 4:2, 5:3
            // Queue starts with [1,2,3]
            // Process 1: remove 1->4, indeg[4]=1. Queue [2,3]
            // Process 2: remove 2->4, indeg[4]=0 (add 4); remove 2->5, indeg[5]=2. Queue [3,4]
            // Process 3: remove 3->5, indeg[5]=1. Queue [4]
            // Process 4: remove 4->5, indeg[5]=0 (add 5). Queue [5]
            // Process 5: done. Result [1,2,3,4,5]

            var snapshots = [
                // step 0: init - find in-degree 0 nodes
                { desc: '초기 상태: 진입 차수가 0인 노드(1, 2, 3)를 큐에 넣습니다. 선행 조건이 없으니 바로 시작 가능!',
                  indeg: {1:0,2:0,3:0,4:2,5:3}, queue: [1,2,3], result: [],
                  processing: null, removedEdges: [], doneNodes: [], highlightNodes: [1,2,3] },
                // step 1: dequeue 1
                { desc: '큐에서 1을 꺼냅니다. 1의 이웃 4의 진입 차수를 1 줄입니다 (2→1). 아직 0이 아니므로 큐에 넣지 않습니다.',
                  indeg: {1:0,2:0,3:0,4:1,5:3}, queue: [2,3], result: [1],
                  processing: 1, removedEdges: [[1,4]], doneNodes: [1], highlightNodes: [4] },
                // step 2: dequeue 2
                { desc: '큐에서 2를 꺼냅니다. 2의 이웃: 4(진입차수 1→0, 큐에 추가!), 5(진입차수 3→2).',
                  indeg: {1:0,2:0,3:0,4:0,5:2}, queue: [3,4], result: [1,2],
                  processing: 2, removedEdges: [[1,4],[2,4],[2,5]], doneNodes: [1,2], highlightNodes: [4,5] },
                // step 3: dequeue 3
                { desc: '큐에서 3을 꺼냅니다. 3의 이웃 5의 진입 차수를 1 줄입니다 (2→1). 아직 0이 아닙니다.',
                  indeg: {1:0,2:0,3:0,4:0,5:1}, queue: [4], result: [1,2,3],
                  processing: 3, removedEdges: [[1,4],[2,4],[2,5],[3,5]], doneNodes: [1,2,3], highlightNodes: [5] },
                // step 4: dequeue 4
                { desc: '큐에서 4를 꺼냅니다. 4의 이웃 5의 진입 차수를 1 줄입니다 (1→0). 0이 되었으니 큐에 추가!',
                  indeg: {1:0,2:0,3:0,4:0,5:0}, queue: [5], result: [1,2,3,4],
                  processing: 4, removedEdges: [[1,4],[2,4],[2,5],[3,5],[4,5]], doneNodes: [1,2,3,4], highlightNodes: [5] },
                // step 5: dequeue 5
                { desc: '큐에서 5를 꺼냅니다. 이웃이 없으므로 바로 결과에 추가. 큐가 비었으니 완료! 결과: [1, 2, 3, 4, 5]',
                  indeg: {1:0,2:0,3:0,4:0,5:0}, queue: [], result: [1,2,3,4,5],
                  processing: 5, removedEdges: [[1,4],[2,4],[2,5],[3,5],[4,5]], doneNodes: [1,2,3,4,5], highlightNodes: [] }
            ];

            var kahnStep = -1;

            function drawKahnGraph() {
                edgesG.innerHTML = '';
                nodesG.innerHTML = '';
                edges.forEach(function(e) {
                    var a = nodeMap[e[0]], b = nodeMap[e[1]];
                    var s = shorten(a.x, a.y, b.x, b.y, R);
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', s.x1); line.setAttribute('y1', s.y1);
                    line.setAttribute('x2', s.x2); line.setAttribute('y2', s.y2);
                    line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '2');
                    line.setAttribute('marker-end', 'url(#ts-kahn-arrow)');
                    line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                    line.style.transition = 'opacity 0.3s, stroke 0.3s';
                    edgesG.appendChild(line);
                });
                nodes.forEach(function(n) {
                    var circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', R);
                    circ.setAttribute('fill', 'var(--bg2)'); circ.setAttribute('stroke', 'var(--accent)');
                    circ.setAttribute('stroke-width', '2.5'); circ.setAttribute('data-id', n.id);
                    circ.style.transition = 'fill 0.3s, stroke 0.3s, opacity 0.3s';
                    nodesG.appendChild(circ);
                    var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 5);
                    txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '13');
                    txt.setAttribute('font-weight', 'bold'); txt.setAttribute('fill', 'var(--text)');
                    txt.style.pointerEvents = 'none'; txt.textContent = n.id;
                    nodesG.appendChild(txt);
                });
            }

            function renderKahnState(snap) {
                // update edges
                edgesG.querySelectorAll('line').forEach(function(l) {
                    var from = parseInt(l.getAttribute('data-from'));
                    var to = parseInt(l.getAttribute('data-to'));
                    var removed = snap.removedEdges.some(function(re) { return re[0] === from && re[1] === to; });
                    l.style.opacity = removed ? '0.15' : '1';
                    l.setAttribute('stroke', removed ? 'var(--text2)' : 'var(--text2)');
                });

                // update nodes
                nodesG.querySelectorAll('circle').forEach(function(c) {
                    var id = parseInt(c.getAttribute('data-id'));
                    if (snap.doneNodes.indexOf(id) !== -1) {
                        c.setAttribute('fill', 'var(--green)'); c.setAttribute('stroke', 'var(--green)');
                        c.style.opacity = id === snap.processing ? '1' : '0.5';
                    } else if (snap.highlightNodes.indexOf(id) !== -1) {
                        c.setAttribute('fill', 'var(--yellow)'); c.setAttribute('stroke', 'var(--yellow)');
                        c.style.opacity = '1';
                    } else {
                        c.setAttribute('fill', 'var(--bg2)'); c.setAttribute('stroke', 'var(--accent)');
                        c.style.opacity = '1';
                    }
                });

                // update in-degree display
                var indegHTML = '';
                nodes.forEach(function(n) {
                    var val = snap.indeg[n.id];
                    var isDone = snap.doneNodes.indexOf(n.id) !== -1;
                    var isZero = val === 0 && !isDone;
                    var bg = isDone ? 'var(--green)' : isZero ? 'var(--yellow)' : 'var(--bg3, #e0e0e0)';
                    var clr = isDone || isZero ? '#fff' : 'var(--text)';
                    indegHTML += '<span style="display:inline-flex;flex-direction:column;align-items:center;min-width:28px;">' +
                        '<span style="font-size:0.7rem;color:var(--text2);">' + n.id + '</span>' +
                        '<span style="background:' + bg + ';color:' + clr + ';border-radius:6px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:600;">' +
                        (isDone ? '✓' : val) + '</span></span>';
                });
                indegEl.innerHTML = indegHTML;

                // update queue display
                queueEl.textContent = snap.queue.length > 0 ? snap.queue.join(' → ') : '(비어 있음)';

                // update result display
                resultEl.textContent = snap.result.length > 0 ? '[ ' + snap.result.join(', ') + ' ]' : '[ ]';
            }

            function updateKahnUI() {
                prevBtn.disabled = (kahnStep < 0);
                nextBtn.disabled = (kahnStep >= snapshots.length - 1);
                if (kahnStep < 0) {
                    counterEl.textContent = '시작 전';
                    msgEl.textContent = '▶ 다음 버튼을 눌러 Kahn\'s Algorithm을 단계별로 따라가 보세요!';
                    // show initial blank state
                    drawKahnGraph();
                    indegEl.innerHTML = '';
                    queueEl.textContent = '';
                    resultEl.textContent = '[ ]';
                } else {
                    counterEl.textContent = (kahnStep + 1) + ' / ' + snapshots.length;
                    msgEl.textContent = snapshots[kahnStep].desc;
                    renderKahnState(snapshots[kahnStep]);
                }
            }

            nextBtn.addEventListener('click', function() {
                if (kahnStep >= snapshots.length - 1) return;
                kahnStep++;
                updateKahnUI();
            });
            prevBtn.addEventListener('click', function() {
                if (kahnStep < 0) return;
                kahnStep--;
                updateKahnUI();
            });
            resetBtnK.addEventListener('click', function() {
                kahnStep = -1;
                drawKahnGraph();
                updateKahnUI();
            });

            drawKahnGraph();
            updateKahnUI();
        })();

        // ===== Demo 4: Queue vs Min-Heap Comparison =====
        (function() {
            // Graph: edges cause different orderings with queue vs heap
            // Nodes: 5,3,1,4,2 — edges: 5->4, 3->4, 1->2, 4->2
            // In-degrees: 5:0, 3:0, 1:0, 4:2, 2:2
            // Queue (insertion order 5,3,1): process 5 -> 3 -> 1 -> 4 -> 2  (result: [5,3,1,4,2])
            // Heap (always min): process 1 -> 3 -> 5 -> 4 -> 2  (result: [1,3,5,4,2])
            var nodes = [
                { id: 5, x: 50, y: 40 },
                { id: 3, x: 140, y: 40 },
                { id: 1, x: 230, y: 40 },
                { id: 4, x: 95, y: 110 },
                { id: 2, x: 185, y: 110 }
            ];
            var edges = [[5,4],[3,4],[1,2],[4,2]];
            var R = 18;
            var nodeMap = {};
            nodes.forEach(function(n) { nodeMap[n.id] = n; });

            function shorten(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx*dx + dy*dy), rat = r / len;
                return { x1: x1 + dx*rat, y1: y1 + dy*rat, x2: x2 - dx*rat, y2: y2 - dy*rat };
            }

            var qEdgesG = container.querySelector('#ts-cmp-q-edges');
            var qNodesG = container.querySelector('#ts-cmp-q-nodes');
            var hEdgesG = container.querySelector('#ts-cmp-h-edges');
            var hNodesG = container.querySelector('#ts-cmp-h-nodes');
            var qResultEl = container.querySelector('#ts-cmp-q-result');
            var hResultEl = container.querySelector('#ts-cmp-h-result');
            var runBtn = container.querySelector('#ts-demo-cmp-run');
            var resetBtnC = container.querySelector('#ts-demo-cmp-reset');
            var msgElC = container.querySelector('#ts-demo-cmp-msg');
            if (!qEdgesG || !qNodesG || !hEdgesG || !hNodesG) return;

            function drawCmpGraph(eG, nG, arrowId) {
                eG.innerHTML = '';
                nG.innerHTML = '';
                edges.forEach(function(e) {
                    var a = nodeMap[e[0]], b = nodeMap[e[1]];
                    var s = shorten(a.x, a.y, b.x, b.y, R);
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', s.x1); line.setAttribute('y1', s.y1);
                    line.setAttribute('x2', s.x2); line.setAttribute('y2', s.y2);
                    line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('marker-end', 'url(#' + arrowId + ')');
                    line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                    line.style.transition = 'opacity 0.3s';
                    eG.appendChild(line);
                });
                nodes.forEach(function(n) {
                    var circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circ.setAttribute('cx', n.x); circ.setAttribute('cy', n.y); circ.setAttribute('r', R);
                    circ.setAttribute('fill', 'var(--bg2)'); circ.setAttribute('stroke', 'var(--accent)');
                    circ.setAttribute('stroke-width', '2'); circ.setAttribute('data-id', n.id);
                    circ.style.transition = 'fill 0.3s, stroke 0.3s, opacity 0.3s';
                    nG.appendChild(circ);
                    var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    txt.setAttribute('x', n.x); txt.setAttribute('y', n.y + 5);
                    txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '12');
                    txt.setAttribute('font-weight', 'bold'); txt.setAttribute('fill', 'var(--text)');
                    txt.style.pointerEvents = 'none'; txt.textContent = n.id;
                    nG.appendChild(txt);
                });
            }

            function runKahn(order, eG, nG, resultEl, color, callback) {
                // order: 'fifo' or 'heap'
                var indeg = {};
                nodes.forEach(function(n) { indeg[n.id] = 0; });
                edges.forEach(function(e) { indeg[e[1]]++; });

                var adj = {};
                nodes.forEach(function(n) { adj[n.id] = []; });
                edges.forEach(function(e) { adj[e[0]].push(e[1]); });

                // find initial zero in-degree nodes
                var initial = [];
                nodes.forEach(function(n) { if (indeg[n.id] === 0) initial.push(n.id); });

                // queue: FIFO keeps insertion order (5,3,1 as they appear in nodes array)
                // heap: always picks smallest
                var queue = order === 'heap' ? initial.slice().sort(function(a,b){return a-b;}) : initial.slice();
                var result = [];
                var stepDelay = 600;
                var removedEdges = [];

                function processNext(i) {
                    if (queue.length === 0) {
                        resultEl.textContent = '[ ' + result.join(', ') + ' ]';
                        if (callback) callback();
                        return;
                    }
                    var v = queue.shift();
                    result.push(v);

                    // highlight processing node
                    nG.querySelectorAll('circle[data-id="' + v + '"]').forEach(function(c) {
                        c.setAttribute('fill', color); c.setAttribute('stroke', color);
                    });

                    // fade edges
                    adj[v].forEach(function(u) {
                        indeg[u]--;
                        eG.querySelectorAll('line[data-from="' + v + '"]').forEach(function(l) {
                            l.style.opacity = '0.15';
                        });
                        if (indeg[u] === 0) {
                            if (order === 'heap') {
                                queue.push(u);
                                queue.sort(function(a,b){return a-b;});
                            } else {
                                queue.push(u);
                            }
                        }
                    });

                    resultEl.textContent = '[ ' + result.join(', ') + ' ]';

                    setTimeout(function() {
                        nG.querySelectorAll('circle[data-id="' + v + '"]').forEach(function(c) {
                            c.style.opacity = '0.4';
                        });
                        processNext(i + 1);
                    }, stepDelay);
                }

                processNext(0);
            }

            var running = false;

            function resetCmp() {
                running = false;
                drawCmpGraph(qEdgesG, qNodesG, 'ts-cmp-q-arrow');
                drawCmpGraph(hEdgesG, hNodesG, 'ts-cmp-h-arrow');
                qResultEl.textContent = '[ ]';
                hResultEl.textContent = '[ ]';
                runBtn.disabled = false;
                msgElC.textContent = '아래 버튼을 눌러 같은 그래프에서 큐와 최소 힙의 처리 순서 차이를 확인하세요!';
                msgElC.style.color = '';
            }

            runBtn.addEventListener('click', function() {
                if (running) return;
                running = true;
                runBtn.disabled = true;
                msgElC.textContent = '실행 중... 같은 그래프에서 처리 순서가 어떻게 달라지는지 관찰하세요!';
                msgElC.style.color = 'var(--accent)';
                var done = 0;
                function checkDone() {
                    done++;
                    if (done === 2) {
                        msgElC.innerHTML = '큐는 먼저 들어온 순서(FIFO)로, 힙은 <strong>항상 가장 작은 번호</strong>부터 처리합니다. 결과 순서가 다르죠!';
                        msgElC.style.color = 'var(--green)';
                    }
                }
                runKahn('fifo', qEdgesG, qNodesG, qResultEl, 'var(--accent)', checkDone);
                runKahn('heap', hEdgesG, hNodesG, hResultEl, 'var(--green)', checkDone);
            });

            resetBtnC.addEventListener('click', function() { resetCmp(); });
            resetCmp();
        })();
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var s = suffix || '';
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        var indicator = container.querySelector('#viz-step-counter' + s);
        var desc = container.querySelector('#viz-step-desc' + s);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
        }
        var actionDelay = 350;
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; updateUI(); setTimeout(function() { state.steps[state.currentStep].action(); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep; state.currentStep--; updateUI(); setTimeout(function() { state.steps[stepToUndo].undo(); }, actionDelay);
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
                self._createStepDesc(suffix) +
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
            description: '초기화: 진입 차수가 0인 노드 1, 2, 3을 큐에 넣습니다. — <em>선행 작업이 없으므로 바로 처리 가능한 노드들</em>',
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
                description: '큐에서 ' + v + '을(를) 꺼내 결과에 추가합니다. — <em>in-degree가 0 = 모든 선행 작업 완료 → 지금 바로 처리 가능</em>',
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

                var desc2 = v + '의 이웃 [' + neighbors.join(', ') + ']의 진입 차수를 줄입니다 — <em>' + v + '이(가) 완료되었으므로 이웃의 선행 조건 하나가 충족됨</em>.';
                if (newQueued.length > 0) {
                    desc2 += ' → ' + newQueued.join(', ') + '의 진입 차수가 0이 되어 큐에 추가! <em>모든 선행 작업이 끝났으므로 처리 가능</em>';
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
                        description: v2 + '에는 이웃이 없습니다. 처리 완료! — <em>후속 작업이 없으므로 다른 노드의 진입 차수에 영향 없음</em>',
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
    // 시뮬레이션 0: 선수과목 (boj-14567) — Kahn's Algorithm + 학기 계산
    // ====================================================================
    _renderVizPrereq(container) {
        var self = this, suffix = '-prereq';
        var DEFAULT_N = 5;
        var DEFAULT_EDGES_STR = '1 2, 1 3, 2 4, 3 4, 4 5';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">선수과목 — 최소 이수 학기 구하기</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Kahn\'s Algorithm으로 각 과목의 가장 빠른 이수 학기를 구합니다. 값을 바꿔보세요!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (과목 수): <input type="number" id="ts-prereq-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">선수조건 (A B 형태): <input type="text" id="ts-prereq-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="ts-prereq-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="pq-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="pq-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="pq-semester' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">큐</div><div id="pq-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">처리 순서</div><div id="pq-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
            '</div>' +
            '<div id="pq-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var nodesEl = container.querySelector('#pq-nodes' + suffix);
        var indegEl = container.querySelector('#pq-indeg' + suffix);
        var semEl = container.querySelector('#pq-semester' + suffix);
        var queueEl = container.querySelector('#pq-queue' + suffix);
        var resultEl = container.querySelector('#pq-result' + suffix);
        var infoEl = container.querySelector('#pq-info' + suffix);

        function nodeBox(nid, cls) { return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;transition:all 0.3s;' + cls + '">' + nid + '</div>'; }

        function renderNodes(states, n) {
            nodesEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                var st = states[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(108,92,231,0.15);border:2px dashed var(--accent);color:var(--accent);';
                if (st === 'active') cls = 'background:var(--yellow);border:2px solid var(--yellow-vivid,#f9a825);color:#333;box-shadow:0 0 12px rgba(249,168,37,0.5);';
                if (st === 'done') cls = 'background:var(--green);border:2px solid var(--green);color:white;';
                nodesEl.innerHTML += nodeBox(i, cls);
            }
        }
        function renderIndeg(indArr, n) {
            indegEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                indegEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;color:var(--text2);">in=' + (indArr[i] != null ? indArr[i] : 0) + '</div>';
            }
        }
        function renderSemester(semArr, n) {
            semEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                var val = semArr[i] || '-';
                var bg = val !== '-' ? 'background:rgba(0,184,148,0.1);color:var(--green);font-weight:600;' : 'color:var(--text3);';
                semEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;border-radius:6px;padding:2px 0;' + bg + '">sem=' + val + '</div>';
            }
        }
        function renderQueue(arr) { queueEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--green);background:rgba(0,184,148,0.08);">' + x + '</div>'; }).join(''); }

        function parseEdges(str) {
            var edges = [];
            str.split(',').forEach(function(part) {
                var nums = part.trim().split(/\s+/).map(Number);
                if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    edges.push([nums[0], nums[1]]);
                }
            });
            return edges;
        }

        function buildGraph(n, edges) {
            var adj = {};
            var indeg = {};
            for (var i = 1; i <= n; i++) { adj[i] = []; indeg[i] = 0; }
            edges.forEach(function(e) {
                if (e[0] >= 1 && e[0] <= n && e[1] >= 1 && e[1] <= n) {
                    adj[e[0]].push(e[1]);
                    indeg[e[1]]++;
                }
            });
            return { adj: adj, indeg: indeg };
        }

        function buildSteps(n, edges) {
            var g = buildGraph(n, edges);
            var adj = g.adj;
            var initIndeg = {};
            for (var i = 1; i <= n; i++) initIndeg[i] = g.indeg[i];

            var simIndeg = {};
            for (var i2 = 1; i2 <= n; i2++) simIndeg[i2] = initIndeg[i2];
            var simQueue = [];
            var simSemester = {};
            for (var i3 = 1; i3 <= n; i3++) simSemester[i3] = 0;

            for (var i4 = 1; i4 <= n; i4++) {
                if (simIndeg[i4] === 0) simQueue.push(i4);
            }

            var simResult = [];
            var steps = [];

            var initNodes = {};
            for (var i5 = 1; i5 <= n; i5++) initNodes[i5] = 'default';

            // Step 1: Show initial in-degrees
            var edgeDesc = edges.map(function(e) { return e[0] + '→' + e[1]; }).join(', ');
            (function(initInd) {
                steps.push({
                    description: '간선 [' + edgeDesc + ']에서 각 노드의 진입 차수를 계산합니다. — <em>진입 차수 = "이 과목을 듣기 위해 먼저 들어야 하는 과목 수"</em>',
                    action: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester(simSemester, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '진입 차수 계산 완료'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">선수과목 위상 정렬을 시작합니다.</span>'; }
                });
            })(JSON.parse(JSON.stringify(initIndeg)));

            // Step 2: Enqueue in-degree 0 nodes + set semester=1
            var zeroNodes = simQueue.slice();
            if (zeroNodes.length === 0) {
                steps.push({
                    description: '진입 차수가 0인 노드가 없습니다! — <em>사이클 존재 가능</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">진입 차수가 0인 노드가 없습니다!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '진입 차수 계산 완료'; }
                });
                return steps;
            }

            zeroNodes.forEach(function(v) { simSemester[v] = 1; });

            (function(zn, semSnap, initInd) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                steps.push({
                    description: '진입 차수 0인 노드 [' + zn.join(', ') + ']을 큐에 넣고 <strong>학기=1</strong>로 설정합니다. — <em>선수과목이 없으므로 1학기에 바로 수강 가능!</em>',
                    action: function() { renderNodes(queuedNodes, n); renderIndeg(initInd, n); renderSemester(semSnap, n); renderQueue(zn.slice()); renderResult([]); infoEl.innerHTML = '1학기 과목: <strong>' + zn.join(', ') + '</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '진입 차수 계산 완료'; }
                });
            })(zeroNodes.slice(), JSON.parse(JSON.stringify(simSemester)), JSON.parse(JSON.stringify(initIndeg)));

            // Process BFS
            while (simQueue.length > 0) {
                var v = simQueue.shift();
                simResult.push(v);

                // Snapshot before processing
                var prevNodeStates = {};
                for (var p = 1; p <= n; p++) {
                    if (simResult.indexOf(p) >= 0 && p !== v) prevNodeStates[p] = 'done';
                    else if (simQueue.indexOf(p) >= 0) prevNodeStates[p] = 'queued';
                    else prevNodeStates[p] = 'default';
                }
                prevNodeStates[v] = 'active';
                var curQueue = simQueue.slice();
                var curResult = simResult.slice();
                var prevSem = JSON.parse(JSON.stringify(simSemester));
                var prevIndeg = {};
                for (var pp = 1; pp <= n; pp++) prevIndeg[pp] = simIndeg[pp];

                // Dequeue step
                (function(vv, pns, cq, cr, ps) {
                    steps.push({
                        description: '<strong>' + vv + '번 과목</strong>을 큐에서 꺼냅니다 (학기=' + ps[vv] + '). — <em>진입 차수가 0이라 모든 선수과목 이수 완료!</em>',
                        action: function() { renderNodes(pns, n); renderSemester(ps, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = '<strong>' + vv + '번 과목</strong> 처리 중 (학기 ' + ps[vv] + ')'; },
                        undo: function() {}
                    });
                })(v, JSON.parse(JSON.stringify(prevNodeStates)), curQueue.slice(), curResult.slice(), JSON.parse(JSON.stringify(prevSem)));

                // Process each neighbor individually
                var neighbors = adj[v] || [];
                for (var ni = 0; ni < neighbors.length; ni++) {
                    var u = neighbors[ni];
                    var oldSemU = simSemester[u];
                    var newSemU = Math.max(simSemester[u], simSemester[v] + 1);
                    simSemester[u] = newSemU;
                    simIndeg[u]--;
                    var becameZero = (simIndeg[u] === 0);
                    if (becameZero) simQueue.push(u);

                    // Snapshot after this neighbor
                    var afterNodeStates = {};
                    for (var a = 1; a <= n; a++) {
                        if (simResult.indexOf(a) >= 0) afterNodeStates[a] = 'done';
                        else if (simQueue.indexOf(a) >= 0) afterNodeStates[a] = 'queued';
                        else afterNodeStates[a] = 'default';
                    }
                    var afterIndeg = {};
                    for (var ai = 1; ai <= n; ai++) afterIndeg[ai] = simIndeg[ai];
                    var afterQueue = simQueue.slice();
                    var afterSem = JSON.parse(JSON.stringify(simSemester));

                    var semExplain = 'semester[' + u + '] = max(' + oldSemU + ', semester[' + v + ']+1) = max(' + oldSemU + ', ' + (simSemester[v] + 1) + ') = ' + newSemU;
                    var desc = v + '→' + u + ' 간선 처리: ' + semExplain + ' — <em>' + v + '번을 ' + prevSem[v] + '학기에 들으니 ' + u + '번은 최소 ' + newSemU + '학기</em>';
                    if (becameZero) {
                        desc += '<br>→ ' + u + '번의 진입 차수가 0이 되어 큐에 추가! <em>모든 선수과목 이수 완료</em>';
                    }

                    (function(desc2, ans, aind, aq, asem) {
                        steps.push({
                            description: desc2,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderSemester(asem, n); renderQueue(aq); infoEl.innerHTML = '간선 처리 중...'; },
                            undo: function() {}
                        });
                    })(desc, JSON.parse(JSON.stringify(afterNodeStates)), JSON.parse(JSON.stringify(afterIndeg)), afterQueue.slice(), JSON.parse(JSON.stringify(afterSem)));
                }

                if (neighbors.length === 0) {
                    var doneNodeStates = {};
                    for (var d = 1; d <= n; d++) {
                        if (simResult.indexOf(d) >= 0) doneNodeStates[d] = 'done';
                        else if (simQueue.indexOf(d) >= 0) doneNodeStates[d] = 'queued';
                        else doneNodeStates[d] = 'default';
                    }
                    (function(vv2, dns) {
                        steps.push({
                            description: vv2 + '번 과목에는 후속 과목이 없습니다. 처리 완료! — <em>이 과목을 선수과목으로 요구하는 과목 없음</em>',
                            action: function() { renderNodes(dns, n); infoEl.innerHTML = vv2 + '번 처리 완료 (후속 없음)'; },
                            undo: function() {}
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)));
                }
            }

            // Final step
            var finalSem = JSON.parse(JSON.stringify(simSemester));
            var finalResult = simResult.slice();
            steps.push({
                description: '위상 정렬 완료! 각 과목의 최소 이수 학기가 결정되었습니다.',
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderQueue([]); renderResult(finalResult); renderSemester(finalSem, n);
                    var semStr = [];
                    for (var s = 1; s <= n; s++) semStr.push(finalSem[s] || 0);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">완료! 학기: ' + semStr.join(' ') + '</strong>';
                },
                undo: function() {}
            });

            return steps;
        }

        function resetViz(n, edges) {
            self._clearVizState();
            var g = buildGraph(n, edges);
            var initNodes = {};
            for (var i = 1; i <= n; i++) initNodes[i] = 'default';
            renderNodes(initNodes, n);
            renderIndeg(g.indeg, n);
            renderSemester({}, n);
            renderQueue([]);
            renderResult([]);
            infoEl.innerHTML = '<span style="color:var(--text2);">선수과목 위상 정렬을 시작합니다.</span>';
            var steps = buildSteps(n, edges);
            self._initStepController(container, steps, suffix);
        }

        resetViz(DEFAULT_N, parseEdges(DEFAULT_EDGES_STR));

        container.querySelector('#ts-prereq-reset').addEventListener('click', function() {
            var n = parseInt(container.querySelector('#ts-prereq-n').value) || DEFAULT_N;
            if (n < 2) n = 2;
            if (n > 10) n = 10;
            var edges = parseEdges(container.querySelector('#ts-prereq-edges').value);
            resetViz(n, edges);
        });
    },

    // ====================================================================
    // 시뮬레이션 1: 줄 세우기 (boj-2252) — 기본 Kahn's Algorithm
    // ====================================================================
    _renderVizLineup(container) {
        var self = this, suffix = '-lineup';
        var DEFAULT_N = 4;
        var DEFAULT_EDGES_STR = '1 3, 2 3, 3 4';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">줄 세우기 — 기본 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Kahn\'s Algorithm으로 학생들을 줄 세웁니다. 값을 바꿔보세요!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (학생 수): <input type="number" id="ts-lineup-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">간선 (A B 형태): <input type="text" id="ts-lineup-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="ts-lineup-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
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

        var curN = DEFAULT_N;

        function nodeBox(nid, cls) { return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;transition:all 0.3s;' + cls + '">' + nid + '</div>'; }
        function renderNodes(states, n) {
            nodesEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                var st = states[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'active') cls = 'background:var(--yellow);border:2px solid var(--yellow-vivid,#f9a825);color:#333;';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                nodesEl.innerHTML += nodeBox(i, cls);
            }
        }
        function renderIndeg(indArr, n) {
            indegEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                indegEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;color:var(--text2);">in=' + (indArr[i] || 0) + '</div>';
            }
        }
        function renderQueue(arr) { queueEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        function parseEdges(str) {
            var edges = [];
            str.split(',').forEach(function(part) {
                var nums = part.trim().split(/\s+/).map(Number);
                if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    edges.push([nums[0], nums[1]]);
                }
            });
            return edges;
        }

        function buildGraph(n, edges) {
            var adj = {};
            var indeg = {};
            for (var i = 1; i <= n; i++) { adj[i] = []; indeg[i] = 0; }
            edges.forEach(function(e) {
                if (e[0] >= 1 && e[0] <= n && e[1] >= 1 && e[1] <= n) {
                    adj[e[0]].push(e[1]);
                    indeg[e[1]]++;
                }
            });
            return { adj: adj, indeg: indeg };
        }

        function buildSteps(n, edges) {
            var g = buildGraph(n, edges);
            var adj = g.adj;
            var initIndeg = {};
            for (var i = 1; i <= n; i++) initIndeg[i] = g.indeg[i];

            // BFS topological sort simulation
            var simIndeg = {};
            for (var i2 = 1; i2 <= n; i2++) simIndeg[i2] = initIndeg[i2];
            var simQueue = [];
            for (var i3 = 1; i3 <= n; i3++) {
                if (simIndeg[i3] === 0) simQueue.push(i3);
            }
            var simResult = [];
            var steps = [];

            // Initial state
            var initNodes = {};
            for (var i4 = 1; i4 <= n; i4++) initNodes[i4] = 'default';

            var zeroNodes = simQueue.slice();
            if (zeroNodes.length === 0) {
                steps.push({
                    description: '진입 차수가 0인 노드가 없습니다! — <em>모든 노드에 선행 조건이 있어 시작할 수 없음 → 사이클 존재 가능</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">진입 차수가 0인 노드가 없습니다!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Kahn\'s Algorithm으로 위상 정렬을 시작합니다.</span>'; }
                });
                return steps;
            }

            // Step: init queue
            (function(zn, initN, initInd) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                steps.push({
                    description: '초기화: in-degree가 0인 노드 ' + zn.join(', ') + '을(를) 큐에 넣습니다. — <em>선행 조건이 없으므로 바로 처리 가능한 노드들</em>',
                    action: function() { renderNodes(queuedNodes, n); renderQueue(zn.slice()); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>' + zn.join(', ') + '</strong> → 큐에 추가'; },
                    undo: function() { renderNodes(initN, n); renderIndeg(initInd, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Kahn\'s Algorithm으로 위상 정렬을 시작합니다.</span>'; }
                });
            })(zeroNodes.slice(), JSON.parse(JSON.stringify(initNodes)), JSON.parse(JSON.stringify(initIndeg)));

            // Process nodes one by one
            while (simQueue.length > 0) {
                var v = simQueue.shift();
                simResult.push(v);

                var prevNodeStates = {};
                for (var p = 1; p <= n; p++) {
                    if (simResult.indexOf(p) >= 0 && p !== v) prevNodeStates[p] = 'done';
                    else if (simQueue.indexOf(p) >= 0) prevNodeStates[p] = 'queued';
                    else prevNodeStates[p] = 'default';
                }
                prevNodeStates[v] = 'active';
                var curQueue = simQueue.slice();
                var curResult = simResult.slice();
                var prevIndeg = {};
                for (var pp = 1; pp <= n; pp++) prevIndeg[pp] = simIndeg[pp];

                // Dequeue step
                (function(vv, pns, cq, cr) {
                    steps.push({
                        description: vv + '을(를) 큐에서 꺼내 결과에 추가합니다. — <em>in-degree 0 = 모든 선행 작업 완료 → 바로 처리 가능</em>',
                        action: function() { renderNodes(pns, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = '<strong>' + vv + '</strong> 처리 중...'; },
                        undo: function() {
                            var prev = steps[steps.length - 1];
                            if (prev && prev._undoState) {
                                renderNodes(prev._undoState.ns, n); renderIndeg(prev._undoState.ind, n); renderQueue(prev._undoState.q); renderResult(prev._undoState.r); infoEl.innerHTML = prev._undoState.info;
                            }
                        },
                        _undoState: null
                    });
                })(v, JSON.parse(JSON.stringify(prevNodeStates)), curQueue.slice(), curResult.slice());

                // Process neighbors
                var neighbors = adj[v] || [];
                var newQueued = [];
                neighbors.forEach(function(u) {
                    simIndeg[u]--;
                    if (simIndeg[u] === 0) {
                        simQueue.push(u);
                        newQueued.push(u);
                    }
                });

                if (neighbors.length > 0) {
                    var afterNodeStates = {};
                    for (var a = 1; a <= n; a++) {
                        if (simResult.indexOf(a) >= 0) afterNodeStates[a] = 'done';
                        else if (simQueue.indexOf(a) >= 0) afterNodeStates[a] = 'queued';
                        else afterNodeStates[a] = 'default';
                    }
                    var afterIndeg = {};
                    for (var ai = 1; ai <= n; ai++) afterIndeg[ai] = simIndeg[ai];
                    var afterQueue = simQueue.slice();

                    var desc2 = v + '의 이웃 [' + neighbors.join(', ') + ']의 진입 차수를 줄입니다 — <em>' + v + ' 처리 완료로 이웃의 선행 조건 하나 충족</em>.';
                    if (newQueued.length > 0) {
                        desc2 += ' → ' + newQueued.join(', ') + '의 in-degree가 0이 되어 큐에 추가! <em>모든 선행 작업 완료 → 처리 가능</em>';
                    }

                    (function(vv2, ans, aind, aq, desc3, pns2, pind, pcq, pcr) {
                        steps.push({
                            description: desc3,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderQueue(aq); infoEl.innerHTML = vv2 + ' 처리 완료'; },
                            undo: function() { renderNodes(pns2, n); renderIndeg(pind, n); renderQueue(pcq); renderResult(pcr); infoEl.innerHTML = '<strong>' + vv2 + '</strong> 처리 중...'; }
                        });
                        // Store undo state for the dequeue step
                        var deqStep = steps[steps.length - 2];
                        if (deqStep) {
                            var prevStepIdx = steps.length - 3;
                            if (prevStepIdx >= 0) {
                                // We need to capture what was shown before the dequeue step
                            }
                        }
                    })(v, JSON.parse(JSON.stringify(afterNodeStates)), JSON.parse(JSON.stringify(afterIndeg)), afterQueue.slice(), desc2,
                       JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curQueue.slice(), curResult.slice());
                } else {
                    var doneNodeStates = {};
                    for (var d = 1; d <= n; d++) {
                        if (simResult.indexOf(d) >= 0) doneNodeStates[d] = 'done';
                        else if (simQueue.indexOf(d) >= 0) doneNodeStates[d] = 'queued';
                        else doneNodeStates[d] = 'default';
                    }
                    (function(vv3, dns, pns3, pind2, pcq2, pcr2) {
                        steps.push({
                            description: vv3 + '에는 이웃이 없습니다. 처리 완료! — <em>후속 작업이 없으므로 다른 노드에 영향 없음</em>',
                            action: function() { renderNodes(dns, n); renderIndeg(pind2, n); infoEl.innerHTML = vv3 + ' 처리 완료 (이웃 없음)'; },
                            undo: function() { renderNodes(pns3, n); renderIndeg(pind2, n); renderQueue(pcq2); renderResult(pcr2); infoEl.innerHTML = '<strong>' + vv3 + '</strong> 처리 중...'; }
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)), JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curQueue.slice(), curResult.slice());
                }
            }

            // Final step
            var finalResult = simResult.slice();
            steps.push({
                description: '위상 정렬 완료! 결과: ' + finalResult.join(' → '),
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderQueue([]); renderResult(finalResult);
                    if (finalResult.length < n) {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">사이클 존재! ' + finalResult.length + '/' + n + '개만 정렬됨</strong>';
                    } else {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: ' + finalResult.join(' ') + '</strong>';
                    }
                },
                undo: function() {}
            });

            return steps;
        }

        function resetViz(n, edges) {
            curN = n;
            self._clearVizState();
            var g = buildGraph(n, edges);
            var initNodes = {};
            for (var i = 1; i <= n; i++) initNodes[i] = 'default';
            renderNodes(initNodes, n);
            renderIndeg(g.indeg, n);
            renderQueue([]);
            renderResult([]);
            infoEl.innerHTML = '<span style="color:var(--text2);">Kahn\'s Algorithm으로 위상 정렬을 시작합니다.</span>';
            var steps = buildSteps(n, edges);
            self._initStepController(container, steps, suffix);
        }

        // Initial render
        resetViz(DEFAULT_N, parseEdges(DEFAULT_EDGES_STR));

        // Reset button handler
        container.querySelector('#ts-lineup-reset').addEventListener('click', function() {
            var n = parseInt(container.querySelector('#ts-lineup-n').value) || DEFAULT_N;
            if (n < 2) n = 2;
            if (n > 10) n = 10;
            var edges = parseEdges(container.querySelector('#ts-lineup-edges').value);
            resetViz(n, edges);
        });
    },

    // ====================================================================
    // 시뮬레이션 2: 문제집 (boj-1766) — 최소 힙 + 위상 정렬
    // ====================================================================
    _renderVizWorkbook(container) {
        var self = this, suffix = '-workbook';
        var DEFAULT_N = 4;
        var DEFAULT_EDGES_STR = '4 2, 3 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문제집 — 최소 힙 + 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">번호가 작은 것부터 풀기 위해 <strong>최소 힙</strong> 사용! 값을 바꿔보세요!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (문제 수): <input type="number" id="ts-work-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">선행조건 (A B 형태): <input type="text" id="ts-work-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="ts-work-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
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

        var curN = DEFAULT_N;

        function nodeBox(nid, cls) { return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;transition:all 0.3s;' + cls + '">' + nid + '</div>'; }
        function renderNodes(states, n) {
            nodesEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                var st = states[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'active') cls = 'background:var(--yellow);border:2px solid var(--yellow-vivid,#f9a825);color:#333;';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                nodesEl.innerHTML += nodeBox(i, cls);
            }
        }
        function renderIndeg(indArr, n) {
            indegEl.innerHTML = '';
            for (var i = 1; i <= n; i++) {
                indegEl.innerHTML += '<div style="width:48px;text-align:center;font-size:0.8rem;color:var(--text2);">in=' + (indArr[i] || 0) + '</div>';
            }
        }
        function renderHeap(arr) { heapEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--green);background:rgba(0,184,148,0.08);">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        function parseEdges(str) {
            var edges = [];
            str.split(',').forEach(function(part) {
                var nums = part.trim().split(/\s+/).map(Number);
                if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    edges.push([nums[0], nums[1]]);
                }
            });
            return edges;
        }

        function buildGraph(n, edges) {
            var adj = {};
            var indeg = {};
            for (var i = 1; i <= n; i++) { adj[i] = []; indeg[i] = 0; }
            edges.forEach(function(e) {
                if (e[0] >= 1 && e[0] <= n && e[1] >= 1 && e[1] <= n) {
                    adj[e[0]].push(e[1]);
                    indeg[e[1]]++;
                }
            });
            return { adj: adj, indeg: indeg };
        }

        // Min-heap helper (simple array-based)
        function heapPush(heap, val) {
            heap.push(val);
            var i = heap.length - 1;
            while (i > 0) {
                var parent = Math.floor((i - 1) / 2);
                if (heap[parent] > heap[i]) {
                    var tmp = heap[parent]; heap[parent] = heap[i]; heap[i] = tmp;
                    i = parent;
                } else break;
            }
        }
        function heapPop(heap) {
            if (heap.length === 1) return heap.pop();
            var top = heap[0];
            heap[0] = heap.pop();
            var i = 0;
            while (true) {
                var l = 2 * i + 1, r = 2 * i + 2, smallest = i;
                if (l < heap.length && heap[l] < heap[smallest]) smallest = l;
                if (r < heap.length && heap[r] < heap[smallest]) smallest = r;
                if (smallest !== i) {
                    var tmp2 = heap[i]; heap[i] = heap[smallest]; heap[smallest] = tmp2;
                    i = smallest;
                } else break;
            }
            return top;
        }

        function buildSteps(n, edges) {
            var g = buildGraph(n, edges);
            var adj = g.adj;
            var initIndeg = {};
            for (var i = 1; i <= n; i++) initIndeg[i] = g.indeg[i];

            var simIndeg = {};
            for (var i2 = 1; i2 <= n; i2++) simIndeg[i2] = initIndeg[i2];

            // Use min-heap for ordering
            var simHeap = [];
            for (var i3 = 1; i3 <= n; i3++) {
                if (simIndeg[i3] === 0) heapPush(simHeap, i3);
            }
            var simResult = [];
            var steps = [];

            var initNodes = {};
            for (var i4 = 1; i4 <= n; i4++) initNodes[i4] = 'default';

            var zeroNodes = simHeap.slice().sort(function(a, b) { return a - b; });
            if (zeroNodes.length === 0) {
                steps.push({
                    description: '진입 차수가 0인 노드가 없습니다! — <em>모든 노드에 선행 조건이 있어 시작 불가 → 사이클 존재 가능</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">진입 차수가 0인 노드가 없습니다!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderHeap([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">최소 힙을 사용한 위상 정렬을 시작합니다.</span>'; }
                });
                return steps;
            }

            // Step: init heap
            (function(zn, initN, initInd) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                var heapDisplay = simHeap.slice();
                steps.push({
                    description: '초기화: in-degree가 0인 노드 ' + zn.join(', ') + '을(를) 힙에 넣습니다. 최소 힙이므로 ' + zn[0] + '이(가) 먼저! — <em>선행 조건 없는 노드 중 번호가 작은 것부터 처리하여 사전순 보장</em>',
                    action: function() { renderNodes(queuedNodes, n); renderHeap(heapDisplay); renderResult([]); infoEl.innerHTML = '진입 차수 0: <strong>' + zn.join(', ') + '</strong> → 최소 힙에 추가. 최솟값: ' + zn[0]; },
                    undo: function() { renderNodes(initN, n); renderIndeg(initInd, n); renderHeap([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">최소 힙을 사용한 위상 정렬을 시작합니다.</span>'; }
                });
            })(zeroNodes.slice(), JSON.parse(JSON.stringify(initNodes)), JSON.parse(JSON.stringify(initIndeg)));

            // Process nodes using min-heap
            while (simHeap.length > 0) {
                var v = heapPop(simHeap);
                simResult.push(v);

                var prevNodeStates = {};
                for (var p = 1; p <= n; p++) {
                    if (simResult.indexOf(p) >= 0 && p !== v) prevNodeStates[p] = 'done';
                    else if (simHeap.indexOf(p) >= 0) prevNodeStates[p] = 'queued';
                    else prevNodeStates[p] = 'default';
                }
                prevNodeStates[v] = 'active';
                var curHeapDisplay = simHeap.slice();
                var curResult = simResult.slice();
                var prevIndeg = {};
                for (var pp = 1; pp <= n; pp++) prevIndeg[pp] = simIndeg[pp];

                // Pop step
                (function(vv, pns, chd, cr) {
                    steps.push({
                        description: '힙에서 최솟값 ' + vv + '을(를) 꺼내 결과에 추가합니다. — <em>in-degree 0인 노드 중 가장 작은 번호를 선택하여 사전순 최소 결과 보장</em>',
                        action: function() { renderNodes(pns, n); renderHeap(chd); renderResult(cr); infoEl.innerHTML = '<strong>' + vv + '</strong> 처리 중... (힙에서 최솟값)'; },
                        undo: function() {}
                    });
                })(v, JSON.parse(JSON.stringify(prevNodeStates)), curHeapDisplay.slice(), curResult.slice());

                // Process neighbors
                var neighbors = adj[v] || [];
                var newQueued = [];
                neighbors.forEach(function(u) {
                    simIndeg[u]--;
                    if (simIndeg[u] === 0) {
                        heapPush(simHeap, u);
                        newQueued.push(u);
                    }
                });

                if (neighbors.length > 0) {
                    var afterNodeStates = {};
                    for (var a = 1; a <= n; a++) {
                        if (simResult.indexOf(a) >= 0) afterNodeStates[a] = 'done';
                        else if (simHeap.indexOf(a) >= 0) afterNodeStates[a] = 'queued';
                        else afterNodeStates[a] = 'default';
                    }
                    var afterIndeg = {};
                    for (var ai = 1; ai <= n; ai++) afterIndeg[ai] = simIndeg[ai];
                    var afterHeap = simHeap.slice();

                    var desc2 = v + '의 이웃 [' + neighbors.join(', ') + ']의 진입 차수를 줄입니다 — <em>' + v + ' 처리 완료로 이웃의 선행 조건 하나 충족</em>.';
                    if (newQueued.length > 0) {
                        desc2 += ' → ' + newQueued.join(', ') + '의 in-degree가 0이 되어 힙에 추가! <em>모든 선행 작업 완료 → 처리 가능</em>';
                    }

                    (function(vv2, ans, aind, ah, desc3, pns2, pind, phd, pr) {
                        steps.push({
                            description: desc3,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderHeap(ah); infoEl.innerHTML = vv2 + ' 처리 완료. 힙: [' + ah.join(', ') + ']'; },
                            undo: function() { renderNodes(pns2, n); renderIndeg(pind, n); renderHeap(phd); renderResult(pr); infoEl.innerHTML = '<strong>' + vv2 + '</strong> 처리 중...'; }
                        });
                    })(v, JSON.parse(JSON.stringify(afterNodeStates)), JSON.parse(JSON.stringify(afterIndeg)), afterHeap.slice(), desc2,
                       JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curHeapDisplay.slice(), curResult.slice());
                } else {
                    var doneNodeStates = {};
                    for (var d = 1; d <= n; d++) {
                        if (simResult.indexOf(d) >= 0) doneNodeStates[d] = 'done';
                        else if (simHeap.indexOf(d) >= 0) doneNodeStates[d] = 'queued';
                        else doneNodeStates[d] = 'default';
                    }
                    (function(vv3, dns, pns3, pind2, phd2, pr2) {
                        steps.push({
                            description: vv3 + '에는 이웃이 없습니다. 처리 완료! — <em>후속 작업이 없으므로 다른 노드에 영향 없음</em>',
                            action: function() { renderNodes(dns, n); renderIndeg(pind2, n); infoEl.innerHTML = vv3 + ' 처리 완료 (이웃 없음)'; },
                            undo: function() { renderNodes(pns3, n); renderIndeg(pind2, n); renderHeap(phd2); renderResult(pr2); infoEl.innerHTML = '<strong>' + vv3 + '</strong> 처리 중...'; }
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)), JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curHeapDisplay.slice(), curResult.slice());
                }
            }

            // Final step
            var finalResult = simResult.slice();
            steps.push({
                description: '위상 정렬 완료! 결과: ' + finalResult.join(' → '),
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderHeap([]); renderResult(finalResult);
                    if (finalResult.length < n) {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">사이클 존재! ' + finalResult.length + '/' + n + '개만 정렬됨</strong>';
                    } else {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: ' + finalResult.join(' ') + '</strong>';
                    }
                },
                undo: function() {}
            });

            return steps;
        }

        function resetViz(n, edges) {
            curN = n;
            self._clearVizState();
            var g = buildGraph(n, edges);
            var initNodes = {};
            for (var i = 1; i <= n; i++) initNodes[i] = 'default';
            renderNodes(initNodes, n);
            renderIndeg(g.indeg, n);
            renderHeap([]);
            renderResult([]);
            infoEl.innerHTML = '<span style="color:var(--text2);">최소 힙을 사용한 위상 정렬을 시작합니다.</span>';
            var steps = buildSteps(n, edges);
            self._initStepController(container, steps, suffix);
        }

        // Initial render
        resetViz(DEFAULT_N, parseEdges(DEFAULT_EDGES_STR));

        // Reset button handler
        container.querySelector('#ts-work-reset').addEventListener('click', function() {
            var n = parseInt(container.querySelector('#ts-work-n').value) || DEFAULT_N;
            if (n < 2) n = 2;
            if (n > 10) n = 10;
            var edges = parseEdges(container.querySelector('#ts-work-edges').value);
            resetViz(n, edges);
        });
    },

    // ====================================================================
    // 시뮬레이션 3: 최종 순위 (boj-3665) — 간선 반전 + 위상 정렬
    // ====================================================================
    _renderVizRanking(container) {
        var self = this, suffix = '-ranking';
        var DEFAULT_RANK_STR = '2, 3, 1';
        var DEFAULT_SWAPS_STR = '';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최종 순위 — 간선 반전 + 위상 정렬</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">작년 순위로부터 간선을 만들고 위상 정렬합니다. 값을 바꿔보세요!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">작년 순위: <input type="text" id="ts-rank-order" value="' + DEFAULT_RANK_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">바뀐 쌍 (A B 형태): <input type="text" id="ts-rank-swaps" value="' + DEFAULT_SWAPS_STR + '" placeholder="예: 2 1, 3 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="ts-rank-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
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

        var curN = 3;

        function renderGraph(edgeList, nodeStates, n) {
            var html = '<div style="display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap;">';
            for (var i = 1; i <= n; i++) {
                var st = nodeStates[i] || 'default';
                var cls = 'background:var(--bg2);border:2px solid var(--border);color:var(--text);';
                if (st === 'queued') cls = 'background:rgba(0,184,148,0.15);border:2px dashed var(--green);color:var(--green);';
                if (st === 'done') cls = 'background:var(--accent-vivid,#6c5ce7);border:2px solid var(--accent2,#a29bfe);color:white;';
                html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-weight:700;font-size:1.1rem;' + cls + '">' + i + '</div>';
            }
            html += '</div>';
            if (edgeList.length > 0) {
                html += '<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">간선: ';
                html += edgeList.map(function(e) { return e[0] + '\u2192' + e[1]; }).join(', ');
                html += '</div>';
            }
            graphEl.innerHTML = html;
        }
        function renderQueue(arr) { queueEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item">' + x + '</div>'; }).join(''); }
        function renderResult(arr) { resultEl.innerHTML = arr.map(function(x) { return '<div class="graph-queue-item" style="border-color:var(--accent-vivid,#6c5ce7);background:rgba(108,92,231,0.08);">' + x + '</div>'; }).join(''); }

        function parseList(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(x) { return !isNaN(x); });
        }
        function parseSwaps(str) {
            if (!str.trim()) return [];
            var swaps = [];
            str.split(',').forEach(function(part) {
                var nums = part.trim().split(/\s+/).map(Number);
                if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1])) {
                    swaps.push([nums[0], nums[1]]);
                }
            });
            return swaps;
        }

        function buildSteps(lastRank, swaps) {
            var n = 0;
            lastRank.forEach(function(v) { if (v > n) n = v; });
            curN = n;
            var steps = [];

            // Build all edges from last rank (all pairs)
            // graph[a][b] = true means a -> b
            var graph = {};
            var indeg = {};
            for (var i = 1; i <= n; i++) { graph[i] = {}; indeg[i] = 0; }
            var allEdges = [];
            for (var i2 = 0; i2 < lastRank.length; i2++) {
                for (var j = i2 + 1; j < lastRank.length; j++) {
                    var a = lastRank[i2], b = lastRank[j];
                    graph[a][b] = true;
                    indeg[b]++;
                    allEdges.push([a, b]);
                }
            }

            var initNodes = {};
            for (var i3 = 1; i3 <= n; i3++) initNodes[i3] = 'default';

            // Step: build edges from last rank
            var edgeStr = allEdges.map(function(e) { return e[0] + '\u2192' + e[1]; }).join(', ');
            var indegStr = '';
            for (var i4 = 1; i4 <= n; i4++) indegStr += i4 + '=<strong>' + indeg[i4] + '</strong>' + (i4 < n ? ', ' : '');

            (function(ae, ins, ids) {
                steps.push({
                    description: '작년 순위 [' + lastRank.join(',') + ']에서 모든 쌍의 간선 생성: ' + edgeStr + ' — <em>순위가 높은 팀 → 낮은 팀으로 간선을 만들어 선후관계를 표현</em>',
                    action: function() { renderGraph(ae, ins, n); infoEl.innerHTML = '간선 생성 완료. in-degree: ' + ids; },
                    undo: function() { renderGraph([], ins, n); infoEl.innerHTML = '<span style="color:var(--text2);">작년 순위로부터 간선을 생성한 뒤 위상 정렬합니다.</span>'; }
                });
            })(allEdges.slice(), JSON.parse(JSON.stringify(initNodes)), indegStr);

            // Apply swaps
            if (swaps.length > 0) {
                swaps.forEach(function(swap) {
                    var sa = swap[0], sb = swap[1];
                    if (sa >= 1 && sa <= n && sb >= 1 && sb <= n) {
                        if (graph[sa] && graph[sa][sb]) {
                            delete graph[sa][sb];
                            graph[sb][sa] = true;
                            indeg[sb]--;
                            indeg[sa]++;
                            // Remove old edge, add new
                            allEdges = allEdges.filter(function(e) { return !(e[0] === sa && e[1] === sb); });
                            allEdges.push([sb, sa]);
                        } else if (graph[sb] && graph[sb][sa]) {
                            delete graph[sb][sa];
                            graph[sa][sb] = true;
                            indeg[sa]--;
                            indeg[sb]++;
                            allEdges = allEdges.filter(function(e) { return !(e[0] === sb && e[1] === sa); });
                            allEdges.push([sa, sb]);
                        }
                    }
                });
                var swapEdgeStr = allEdges.map(function(e) { return e[0] + '\u2192' + e[1]; }).join(', ');
                var swapIndegStr = '';
                for (var s = 1; s <= n; s++) swapIndegStr += s + '=<strong>' + indeg[s] + '</strong>' + (s < n ? ', ' : '');

                (function(ae2, ins2, sids, swpDesc) {
                    steps.push({
                        description: '바뀐 쌍을 적용하여 간선을 반전합니다. 현재 간선: ' + swapEdgeStr + ' — <em>올해 상대 순위가 바뀐 쌍은 간선 방향을 뒤집어 새 관계 반영</em>',
                        action: function() { renderGraph(ae2, ins2, n); infoEl.innerHTML = '간선 반전 완료. in-degree: ' + sids; },
                        undo: function() {}
                    });
                })(allEdges.slice(), JSON.parse(JSON.stringify(initNodes)), swapIndegStr, swaps);
            }

            // BFS topological sort
            var simIndeg = {};
            for (var si = 1; si <= n; si++) simIndeg[si] = indeg[si];
            var simQueue = [];
            for (var si2 = 1; si2 <= n; si2++) {
                if (simIndeg[si2] === 0) simQueue.push(si2);
            }
            var simResult = [];

            var zeroNodes = simQueue.slice();
            if (zeroNodes.length === 0) {
                steps.push({
                    description: '진입 차수가 0인 노드가 없습니다! — <em>간선 반전으로 사이클이 생겨 순위 결정 불가</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">IMPOSSIBLE — 사이클 존재!</strong>'; },
                    undo: function() {}
                });
                return steps;
            }

            // Step: init queue
            (function(zn, ae3) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                steps.push({
                    description: 'in-degree가 0인 노드 ' + zn.join(', ') + '을(를) 큐에 넣습니다. — <em>앞에 올 팀이 없으므로 1등 후보</em>',
                    action: function() { renderGraph(ae3, queuedNodes, n); renderQueue(zn.slice()); infoEl.innerHTML = '진입 차수 0: <strong>' + zn.join(', ') + '</strong> → 큐에 추가'; },
                    undo: function() {}
                });
            })(zeroNodes.slice(), allEdges.slice());

            // BFS process
            var ambiguous = false;
            while (simQueue.length > 0) {
                if (simQueue.length > 1) ambiguous = true;
                var v = simQueue.shift();
                simResult.push(v);

                var nodeStates = {};
                for (var ns = 1; ns <= n; ns++) {
                    if (simResult.indexOf(ns) >= 0 && ns !== v) nodeStates[ns] = 'done';
                    else if (simQueue.indexOf(ns) >= 0) nodeStates[ns] = 'queued';
                    else nodeStates[ns] = 'default';
                }
                nodeStates[v] = 'done';

                // Find neighbors of v
                var neighbors = [];
                for (var nb = 1; nb <= n; nb++) {
                    if (graph[v] && graph[v][nb]) neighbors.push(nb);
                }

                var newQueued = [];
                neighbors.forEach(function(u) {
                    simIndeg[u]--;
                    if (simIndeg[u] === 0) {
                        simQueue.push(u);
                        newQueued.push(u);
                    }
                });

                // Update node states after neighbor processing
                var afterNodeStates = {};
                for (var an = 1; an <= n; an++) {
                    if (simResult.indexOf(an) >= 0) afterNodeStates[an] = 'done';
                    else if (simQueue.indexOf(an) >= 0) afterNodeStates[an] = 'queued';
                    else afterNodeStates[an] = 'default';
                }

                var desc = v + '을(를) 꺼내 결과에 추가 — <em>선행 조건 모두 충족, 순위 확정</em>.';
                if (neighbors.length > 0) {
                    desc += ' 이웃 [' + neighbors.join(', ') + ']의 in-degree 줄임 (<em>' + v + ' 완료로 선행 조건 하나 충족</em>).';
                    if (newQueued.length > 0) {
                        desc += ' ' + newQueued.join(', ') + '의 in-degree가 0이 되어 큐에 추가!';
                    }
                } else {
                    desc += ' 이웃이 없습니다.';
                }

                var curQueue = simQueue.slice();
                var curResult = simResult.slice();

                (function(vv, ans2, cq, cr, desc4, ae4) {
                    steps.push({
                        description: desc4,
                        action: function() { renderGraph(ae4, ans2, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = vv + ' 처리 완료'; },
                        undo: function() {}
                    });
                })(v, JSON.parse(JSON.stringify(afterNodeStates)), curQueue.slice(), curResult.slice(), desc, allEdges.slice());
            }

            // Final step
            var finalResult = simResult.slice();
            var wasAmbiguous = ambiguous;
            (function(fr, ae5, amb) {
                if (fr.length < n) {
                    steps.push({
                        description: 'IMPOSSIBLE — 사이클이 존재하여 위상 정렬이 불가능합니다!',
                        action: function() {
                            var fs = {};
                            for (var f = 1; f <= n; f++) fs[f] = fr.indexOf(f) >= 0 ? 'done' : 'default';
                            renderGraph(ae5, fs, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">IMPOSSIBLE — 사이클 존재! ' + fr.length + '/' + n + '개만 정렬됨</strong>';
                        },
                        undo: function() {}
                    });
                } else if (amb) {
                    steps.push({
                        description: '순위를 확정할 수 없습니다 (?). 큐에 2개 이상이 동시에 있었습니다. — <em>in-degree 0인 노드가 여럿이면 순서를 특정할 수 없음</em>',
                        action: function() {
                            var fs2 = {};
                            for (var f2 = 1; f2 <= n; f2++) fs2[f2] = 'done';
                            renderGraph(ae5, fs2, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--yellow-vivid,#f9a825);">? — 순위 확정 불가</strong>';
                        },
                        undo: function() {}
                    });
                } else {
                    steps.push({
                        description: '위상 정렬 완료! 결과: ' + fr.join(' → '),
                        action: function() {
                            var fs3 = {};
                            for (var f3 = 1; f3 <= n; f3++) fs3[f3] = 'done';
                            renderGraph(ae5, fs3, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">위상 정렬 완료! 결과: ' + fr.join(' ') + '</strong>';
                        },
                        undo: function() {}
                    });
                }
            })(finalResult.slice(), allEdges.slice(), wasAmbiguous);

            return steps;
        }

        function resetViz(lastRank, swaps) {
            self._clearVizState();
            var n = 0;
            lastRank.forEach(function(v) { if (v > n) n = v; });
            curN = n;
            var initNodes = {};
            for (var i = 1; i <= n; i++) initNodes[i] = 'default';
            renderGraph([], initNodes, n);
            renderQueue([]);
            renderResult([]);
            infoEl.innerHTML = '<span style="color:var(--text2);">작년 순위로부터 간선을 생성한 뒤 위상 정렬합니다.</span>';
            var steps = buildSteps(lastRank, swaps);
            self._initStepController(container, steps, suffix);
        }

        // Initial render
        resetViz(parseList(DEFAULT_RANK_STR), parseSwaps(DEFAULT_SWAPS_STR));

        // Reset button handler
        container.querySelector('#ts-rank-reset').addEventListener('click', function() {
            var rank = parseList(container.querySelector('#ts-rank-order').value);
            var swaps = parseSwaps(container.querySelector('#ts-rank-swaps').value);
            if (rank.length < 2) rank = [2, 3, 1];
            resetViz(rank, swaps);
        });
    },

    // ===== 빈 스텁 =====
    renderProblem(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '선수과목 (입문)', desc: '위상 정렬 입문 — 선수과목 순서 구하기 (Gold V)', problemIds: ['boj-14567'] },
        { num: 2, title: '기본 위상 정렬', desc: '진입 차수와 BFS를 활용한 기본 위상 정렬 (Gold III)', problemIds: ['boj-2252'] },
        { num: 3, title: '심화 위상 정렬', desc: '우선순위 큐, 사이클 판별 등 심화 응용 (Gold I~II)', problemIds: ['boj-1766', 'boj-3665'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 선수과목 (입문) =====
        {
            id: 'boj-14567',
            title: 'BOJ 14567 - 선수과목 (Prerequisite)',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/14567',
            simIntro: '선수과목 관계를 DAG로 만들고, Kahn\'s Algorithm으로 각 과목의 최소 이수 학기를 구해보세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>올해 Z대학 , , 학번인 학생들은 새로운 커리큘럼을 맞아 , 총 N개의 과목을 수강해야 한다. 각 과목을 수강하기 위해 반드시 먼저 이수해야 하는 선수과목이 있을 수 있다.</p>
                <p>한 학기에 들을 수 있는 과목 수에는 제한이 없다. 모든 과목은 매 학기 개설된다.</p>
                <p>각 과목을 가장 빠르게 이수할 수 있는 학기를 구하라.</p>
                <h4>입력</h4>
                <p>첫 번째 줄에 과목의 수 N(1 ≤ N ≤ 1000)과 선수과목 조건의 수 M(0 ≤ M ≤ 500000)이 주어진다.</p>
                <p>다음 M개의 줄에 선수과목 조건을 나타내는 두 정수 A, B가 주어진다. A번 과목이 B번 과목의 선수과목이다. (A번을 이수해야 B번을 들을 수 있다.)</p>
                <h4>출력</h4>
                <p>1번 과목부터 N번 과목까지 각 과목을 이수할 수 있는 가장 빠른 학기를 공백으로 구분하여 한 줄에 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 2\n2 3\n1 2</pre></div>
                    <div><strong>출력</strong><pre>1 1 2</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6 4\n1 2\n1 3\n2 5\n4 5</pre></div>
                    <div><strong>출력</strong><pre>1 2 2 1 3 1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ N ≤ 1000</li><li>0 ≤ M ≤ 500,000</li></ul>
            `,
            hints: [
                {
                    title: '처음 떠오르는 생각 — 그래프로 모델링',
                    content: '"A를 먼저 들어야 B를 들을 수 있다" → A에서 B로 향하는 <strong>간선</strong>이 있는 방향 그래프(DAG)예요.<br>이런 선후관계를 처리하는 데 딱 맞는 알고리즘이 뭘까요? 바로 <strong>위상 정렬</strong>입니다!'
                },
                {
                    title: '"가장 빠른 학기"는 어떻게 구하지?',
                    content: '선수과목이 없으면 → <strong>1학기</strong>에 바로 수강 가능!<br>선수과목이 있으면 → 선수과목들이 모두 이수된 <strong>다음 학기</strong>에 들을 수 있어요.<br><br><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">1학기</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">2학기</div></div><div style="font-size:1rem;color:var(--text2);">→</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);background:var(--yellow)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--yellow);">C</div><div style="font-size:0.6rem;color:var(--yellow);font-weight:600;">max(1,2)+1 = <strong>3학기</strong></div></div></div>즉, <code>semester[B] = max(semester[A들]) + 1</code> — 선수과목 중 가장 늦게 끝나는 것 + 1!'
                },
                {
                    title: 'BFS(Kahn\'s 알고리즘)로 구현',
                    content: '진입차수가 0인 과목(선수과목 없음)을 큐에 넣고 학기=1로 시작.<br>큐에서 꺼낸 과목의 이웃 진입차수를 줄이면서 <code>semester[이웃] = max(semester[이웃], semester[현재] + 1)</code>로 갱신!<br>진입차수가 0이 되면 큐에 추가.<br><br><span class="lang-py">Python: <code>deque</code>로 BFS 구현</span><span class="lang-cpp">C++: <code>queue</code>로 BFS 구현</span>'
                },
                {
                    title: '시간 복잡도 확인',
                    content: '모든 노드를 한 번씩 처리하고, 모든 간선을 한 번씩 확인하므로 <strong>O(N + M)</strong>이에요.<br>N ≤ 1000, M ≤ 500,000이니 충분히 빠릅니다!'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nsemester = [0] * (N + 1)\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n        semester[i] = 1\n\nwhile queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        semester[u] = max(semester[u], semester[v] + 1)\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)\n\nprint(*semester[1:])',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    vector<int> semester(N + 1, 0);\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) {\n            q.push(i);\n            semester[i] = 1;\n        }\n    }\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            semester[u] = max(semester[u], semester[v] + 1);\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }\n\n    for (int i = 1; i <= N; i++)\n        printf("%d%c", semester[i], i == N ? \'\\n\' : \' \');\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Kahn\'s Algorithm + 학기 계산',
                description: '진입 차수가 0인 과목부터 BFS하면서 각 과목의 최소 이수 학기를 구합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구축', desc: '선수과목 관계를 인접 리스트로 저장하고\n진입 차수를 세어 위상 정렬을 준비합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]  # 인접 리스트\nin_degree = [0] * (N + 1)           # 진입 차수\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)  # a → b 간선\n    in_degree[b] += 1   # b의 진입 차수 증가' },
                        { title: '진입 차수 0인 과목 큐에 추가', desc: '선수과목이 없는 과목은 1학기에 바로 수강 가능하므로\n큐에 넣고 semester=1로 초기화합니다.', code: 'semester = [0] * (N + 1)\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n        semester[i] = 1  # 선수과목 없음 → 1학기' },
                        { title: 'BFS + 학기 계산', desc: '큐에서 꺼낸 과목의 이웃 학기를\nmax(현재값, 선수과목 학기+1)로 갱신합니다.\n모든 선수과목 중 가장 늦은 것 + 1이 최소 이수 학기!', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        # 선수과목 중 가장 늦게 끝나는 것 + 1\n        semester[u] = max(semester[u], semester[v] + 1)\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)' },
                        { title: '출력', desc: '1번부터 N번까지 각 과목의 최소 이수 학기를 출력합니다.', code: 'print(*semester[1:])' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구축', desc: '선수과목 관계를 인접 리스트로 저장하고\n진입 차수를 세어 위상 정렬을 준비합니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);  // a → b 간선\n        in_degree[b]++;         // b의 진입 차수 증가\n    }' },
                        { title: '진입 차수 0인 과목 큐에 추가', desc: '선수과목이 없는 과목을 queue에 넣고\nsemester=1로 초기화합니다.', code: '    vector<int> semester(N + 1, 0);\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) {\n            q.push(i);\n            semester[i] = 1;  // 선수과목 없음 → 1학기\n        }\n    }' },
                        { title: 'BFS + 학기 계산', desc: '큐에서 꺼낸 과목의 이웃 학기를\nmax(현재값, 선수과목 학기+1)로 갱신합니다.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            // 선수과목 중 가장 늦게 끝나는 것 + 1\n            semester[u] = max(semester[u], semester[v] + 1);\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }' },
                        { title: '출력', desc: '각 과목의 최소 이수 학기를 출력하고 프로그램을 종료합니다.', code: '    for (int i = 1; i <= N; i++)\n        printf("%d%c", semester[i], i == N ? \'\\n\' : \' \');\n    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[0].templates; }
            }]
        },

        // ===== 2단계: 기본 위상 정렬 =====
        {
            id: 'boj-2252',
            title: 'BOJ 2252 - 줄 세우기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2252',
            simIntro: 'Kahn\'s Algorithm으로 학생들을 줄 세우는 과정을 단계별로 확인하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N명의 학생들을 키 순서대로 줄을 세우려고 한다. 일부 학생들의 키를 비교한 결과가 주어진다. 예를 들어, 학생 A가 학생 B 앞에 서야 한다는 것을 알고 있다면 A는 B보다 앞에 서야 한다. 키를 비교한 결과가 주어질 때, 학생들을 줄 세우는 프로그램을 작성하시오. 답이 여러 가지인 경우 아무거나 출력한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N(1 ≤ N ≤ 32,000), M(1 ≤ M ≤ 100,000)이 주어진다. M은 키를 비교한 횟수이다. 다음 M개의 줄에는 키를 비교한 두 학생의 번호 A, B가 주어진다. 이는 학생 A가 학생 B의 앞에 서야 한다는 의미이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 학생들을 앞에서부터 줄을 세운 결과를 출력한다. 답이 여러 가지인 경우에는 아무거나 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3 2\n1 3\n2 3</pre></div>
                    <div><strong>출력</strong><pre>1 2 3</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2\n4 2\n3 1</pre></div>
                    <div><strong>출력</strong><pre>4 3 2 1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ N ≤ 32,000</li><li>1 ≤ M ≤ 100,000</li></ul>
            `,
            hints: [
                {
                    title: '순서가 정해진 정렬?',
                    content: 'A가 B 앞이라는 조건이 여러 개 주어져요. 이 조건을 <strong>모두 만족하는 순서</strong>를 찾아야 합니다.<br>이런 문제를 <strong>"위상 정렬"</strong>이라고 불러요!'
                },
                {
                    title: '진입차수가 0인 노드부터',
                    content: '아무도 "나보다 앞에 서야 한다"고 지정하지 않은 학생 — 즉 <strong>진입차수가 0</strong>인 학생을 먼저 세울 수 있어요.<br><br><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--green);background:var(--green)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--green);">1</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">진입0</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--green);background:var(--green)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--green);">4</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">진입0</div></div><div style="font-size:1rem;color:var(--text2);">→</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);background:var(--accent)10;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">3</div><div style="font-size:0.6rem;color:var(--text2);">진입1</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);background:var(--accent)10;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">5</div><div style="font-size:0.6rem;color:var(--text2);">진입2</div></div></div>그 학생을 세우면, 그 학생 뒤에 와야 하는 학생들의 진입차수가 1씩 줄어듭니다.'
                },
                {
                    title: 'BFS(Kahn\'s 알고리즘)로 구현',
                    content: '큐에 진입차수 0인 노드를 넣고, 하나씩 빼면서 연결된 노드의 진입차수를 줄여요. 진입차수가 0이 되면 큐에 추가!<br><br><span class="lang-py">Python: <code>deque</code>를 사용해 BFS 구현</span><span class="lang-cpp">C++: <code>queue</code>를 사용해 BFS 구현</span>'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)\n\nprint(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) q.push(i);\n    }\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Kahn\'s Algorithm (BFS)',
                description: '진입 차수가 0인 노드부터 큐에 넣고 BFS로 위상 정렬합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구축', desc: '인접 리스트와 진입 차수 배열을 만들어야\nBFS 위상 정렬의 기반이 됩니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: '진입 차수 0인 노드 큐에 추가', desc: '선행 조건이 없는 노드(진입 차수 0)를\n먼저 처리할 수 있으므로 큐에 넣습니다.', code: 'queue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)' },
                        { title: 'BFS 위상 정렬', desc: '큐에서 꺼낸 노드의 이웃 진입 차수를 줄여\n0이 되면 큐에 추가하는 Kahn\'s Algorithm 핵심 루프.', code: 'result = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)' },
                        { title: '출력', desc: '위상 정렬 결과를 공백 구분으로 출력합니다.', code: 'print(*result)' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구축', desc: '인접 리스트와 진입 차수 배열을 만들어야\nBFS 위상 정렬의 기반이 됩니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }' },
                        { title: '진입 차수 0인 노드 큐에 추가', desc: '선행 조건이 없는 노드를 queue에 넣어\n위상 정렬의 시작점으로 사용합니다.', code: '    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) q.push(i);\n    }' },
                        { title: 'BFS 위상 정렬', desc: '큐에서 꺼내며 이웃의 진입 차수를 줄이고,\n0이 되면 큐에 추가하는 Kahn\'s Algorithm 핵심.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }' },
                        { title: '출력', desc: '위상 정렬 결과를 출력하고 프로그램을 종료합니다.', code: '    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[1].templates; }
            }]
        },

        // ===== 3단계: 심화 위상 정렬 =====
        {
            id: 'boj-1766',
            title: 'BOJ 1766 - 문제집',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1766',
            simIntro: '최소 힙을 사용하여 번호가 작은 문제부터 풀어나가는 과정을 확인하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>민오는 1번부터 N번까지 총 N개의 문제로 되어 있는 문제집을 풀려고 한다. 문제는 난이도 순서로 출제되어 있어서 1번 문제가 가장 쉽고 N번 문제가 가장 어렵다. 먼저 풀어야 하는 문제 쌍이 M개 주어진다. 가능하면 쉬운 문제부터(번호가 작은 것부터) 풀려고 한다. 문제를 풀 순서를 출력하시오.</p>
                <h4>입력</h4>
                <p>첫째 줄에 문제의 수 N(1 ≤ N ≤ 32,000)과 먼저 푸는 것이 좋은 문제에 대한 정보의 개수 M(1 ≤ M ≤ 100,000)이 주어진다. 둘째 줄부터 M개의 줄에 걸쳐 두 정수의 순서쌍 A, B가 빈칸을 사이에 두고 주어진다. 이는 A번 문제는 B번 문제보다 먼저 푸는 것이 좋다는 의미이다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 문제 번호를 나타내는 1 이상 N 이하의 정수들을 문제를 풀어야 하는 순서대로 빈칸을 사이에 두고 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 2\n4 2\n3 1</pre></div>
                    <div><strong>출력</strong><pre>3 1 4 2</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ N ≤ 32,000</li><li>1 ≤ M ≤ 100,000</li></ul>
            `,
            hints: [
                {
                    title: '위상 정렬 + 쉬운 문제 우선',
                    content: '"먼저 풀어야 하는 조건"이 있으니 위상 정렬이 필요해요. 그런데 조건이 하나 더 — <strong>"가능하면 쉬운 문제부터"</strong>, 즉 번호가 작은 것을 우선해야 합니다.'
                },
                {
                    title: '일반 큐로는 안 돼!',
                    content: '2252번처럼 일반 큐를 쓰면 진입차수 0인 노드가 여러 개일 때 <strong>아무거나</strong> 먼저 처리해버려요.<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;"><div style="flex:1;min-width:120px;padding:8px 10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;text-align:center;"><div style="font-size:0.72rem;font-weight:700;color:var(--red);margin-bottom:4px;">일반 큐</div><div style="display:flex;gap:3px;justify-content:center;"><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">5</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">2</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">3</div></div><div style="font-size:0.65rem;color:var(--red);margin-top:4px;">→ 5 먼저 (순서 무관)</div></div><div style="flex:1;min-width:120px;padding:8px 10px;border:2px solid var(--green);border-radius:8px;background:var(--green)06;text-align:center;"><div style="font-size:0.72rem;font-weight:700;color:var(--green);margin-bottom:4px;">최소 힙</div><div style="display:flex;gap:3px;justify-content:center;"><div style="padding:3px 7px;border-radius:4px;background:var(--green)20;font-size:0.8rem;font-weight:700;color:var(--green);">2</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">3</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">5</div></div><div style="font-size:0.65rem;color:var(--green);margin-top:4px;">→ 2 먼저 (최솟값!)</div></div></div>번호가 작은 것을 먼저 골라낼 방법이 없습니다!'
                },
                {
                    title: '우선순위 큐(최소 힙)로!',
                    content: '큐 대신 <strong>최소 힙</strong>을 쓰면 진입차수 0인 노드 중 항상 번호가 <strong>가장 작은 것</strong>을 먼저 처리할 수 있어요.<br><br><span class="lang-py">Python: <code>heapq</code> — 기본이 최소 힙이라 바로 사용 가능</span><span class="lang-cpp">C++: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code> — greater를 넣어야 최소 힙</span>'
                }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nheap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)\n\nresult = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)\n\nprint(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) pq.push(i);\n    }\n\n    while (!pq.empty()) {\n        int v = pq.top(); pq.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) pq.push(u);\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '최소 힙 + Kahn\'s Algorithm',
                description: '일반 큐 대신 최소 힙을 사용하여 번호가 작은 문제부터 처리합니다.',
                timeComplexity: 'O((N + M) log N)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구축', desc: '선행 조건을 인접 리스트로 저장하고\n진입 차수를 세어 위상 정렬을 준비합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: '최소 힙 초기화', desc: '번호가 작은 문제를 먼저 풀어야 하므로\n일반 큐 대신 최소 힙을 사용합니다.', code: 'heap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)' },
                        { title: '힙 기반 위상 정렬', desc: 'heappop으로 항상 가장 작은 번호를 먼저 꺼내어\n"쉬운 문제부터" 조건을 자동으로 만족합니다.', code: 'result = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)' },
                        { title: '출력', desc: '최소 힙으로 정렬된 결과를 출력합니다.', code: 'print(*result)' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구축', desc: '선행 조건을 인접 리스트로 저장하고\n진입 차수를 세어 위상 정렬을 준비합니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }' },
                        { title: '최소 힙 초기화', desc: 'priority_queue에 greater<int>를 넣으면 최소 힙!\n기본은 최대 힙이라 주의.', code: '    // greater<int> → 최소 힙 (기본은 최대 힙)\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) pq.push(i);\n    }' },
                        { title: '힙 기반 위상 정렬', desc: 'pq.top()이 항상 최솟값을 반환하므로\n작은 번호부터 자동으로 처리됩니다.', code: '    while (!pq.empty()) {\n        int v = pq.top(); pq.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) pq.push(u);\n        }\n    }' },
                        { title: '출력', desc: '위상 정렬 결과를 출력하고 프로그램을 종료합니다.', code: '    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-3665',
            title: 'BOJ 3665 - 최종 순위',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/3665',
            simIntro: '작년 순위로부터 간선을 만들고 위상 정렬하는 과정을 확인하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>올해 ACM-ICPC 대전 인터넷 예선에는 총 n개의 팀이 참가했다. 작년 순위가 주어지고, 올해 상대적인 순위가 바뀐 쌍이 주어진다. 바뀐 정보를 이용해서 올해 순위를 만들어라. 확실한 순위를 찾을 수 없다면 "?", 일관성이 없는 경우 "IMPOSSIBLE"을 출력한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에는 테스트 케이스의 개수가 주어진다. 각 테스트 케이스의 첫째 줄에는 팀의 수 n(2 ≤ n ≤ 500)이 주어진다. 둘째 줄에는 작년에 i등을 한 팀의 번호가 차례대로 주어진다. 셋째 줄에는 상대적인 등수가 바뀐 쌍의 수 m(0 ≤ m ≤ 25,000)이 주어진다. 다음 m개 줄에는 상대적인 등수가 바뀐 쌍이 주어진다.</p>
                <h4>출력</h4>
                <p>각 테스트 케이스에 대해서 올해 순위를 출력한다. 만약 확실한 순위를 찾을 수 없다면 "?"를, 데이터에 일관성이 없어서 순위를 정할 수 없는 경우에는 "IMPOSSIBLE"을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n5\n5 4 3 2 1\n2\n2 4\n3 4\n3\n2 3 1\n0\n4\n1 2 3 4\n3\n1 2\n3 4\n2 3</pre></div>
                    <div><strong>출력</strong><pre>5 3 2 4 1\n2 3 1\nIMPOSSIBLE</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>2 ≤ n ≤ 500</li><li>0 ≤ m ≤ 25,000</li><li>T는 테스트 케이스 수</li></ul>
            `,
            hints: [
                {
                    title: '작년 순위에서 시작',
                    content: '작년 순위가 곧 초기 위상 정렬 결과예요. 앞에 있는 팀 → 뒤에 있는 팀으로 <strong>모든 쌍</strong>에 간선을 만들면 DAG가 됩니다.<br>예: [5,4,3,2,1]이면 5→4, 5→3, ..., 4→3, 4→2, ... 모든 쌍!'
                },
                {
                    title: '간선 뒤집기가 핵심',
                    content: '올해 바뀐 쌍의 간선 방향을 <strong>뒤집는 것</strong>이 이 문제의 핵심이에요.<br><br><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><span style="font-size:0.9rem;color:var(--red);text-decoration:line-through;">→</span><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div></div><div style="font-size:1rem;font-weight:700;color:var(--yellow);">⇒</div><div style="display:flex;align-items:center;gap:6px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><span style="font-size:0.9rem;color:var(--green);font-weight:700;">→</span><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div></div></div><div style="font-size:0.82rem;margin-top:4px;">작년에 A가 B보다 앞이었는데 올해 뒤집혔다면 → A→B 간선을 제거하고 B→A로 변경. 진입차수도 함께 조정합니다.</div>'
                },
                {
                    title: 'IMPOSSIBLE과 ?',
                    content: '위상 정렬 도중 큐에 노드가 <strong>2개 이상</strong>이면 순서를 확정할 수 없어요 → <strong>"?"</strong> 출력.<br>모든 노드를 방문하지 못하면 사이클이 존재한다는 뜻 → <strong>"IMPOSSIBLE"</strong> 출력.'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    n = int(input())\n    rank = list(map(int, input().split()))\n\n    # 모든 쌍에 대해 간선 생성\n    graph = [[False] * (n + 1) for _ in range(n + 1)]\n    in_degree = [0] * (n + 1)\n\n    for i in range(n):\n        for j in range(i + 1, n):\n            graph[rank[i]][rank[j]] = True\n            in_degree[rank[j]] += 1\n\n    m = int(input())\n    for _ in range(m):\n        a, b = map(int, input().split())\n        if graph[a][b]:\n            graph[a][b] = False\n            graph[b][a] = True\n            in_degree[b] -= 1\n            in_degree[a] += 1\n        else:\n            graph[b][a] = False\n            graph[a][b] = True\n            in_degree[a] -= 1\n            in_degree[b] += 1\n\n    queue = deque()\n    for i in range(1, n + 1):\n        if in_degree[i] == 0:\n            queue.append(i)\n\n    result = []\n    ambiguous = False\n\n    for _ in range(n):\n        if len(queue) == 0:\n            break\n        if len(queue) > 1:\n            ambiguous = True\n        v = queue.popleft()\n        result.append(v)\n        for u in range(1, n + 1):\n            if graph[v][u]:\n                in_degree[u] -= 1\n                if in_degree[u] == 0:\n                    queue.append(u)\n\n    if len(result) != n:\n        print("IMPOSSIBLE")\n    elif ambiguous:\n        print("?")\n    else:\n        print(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n;\n        scanf("%d", &n);\n        vector<int> rank_arr(n);\n        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);\n\n        vector<vector<bool>> graph(n + 1, vector<bool>(n + 1, false));\n        vector<int> in_deg(n + 1, 0);\n\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                graph[rank_arr[i]][rank_arr[j]] = true;\n                in_deg[rank_arr[j]]++;\n            }\n        }\n\n        int m;\n        scanf("%d", &m);\n        for (int i = 0; i < m; i++) {\n            int a, b;\n            scanf("%d %d", &a, &b);\n            if (graph[a][b]) {\n                graph[a][b] = false; graph[b][a] = true;\n                in_deg[b]--; in_deg[a]++;\n            } else {\n                graph[b][a] = false; graph[a][b] = true;\n                in_deg[a]--; in_deg[b]++;\n            }\n        }\n\n        queue<int> q;\n        for (int i = 1; i <= n; i++) {\n            if (in_deg[i] == 0) q.push(i);\n        }\n\n        vector<int> result;\n        bool ambiguous = false;\n\n        for (int i = 0; i < n; i++) {\n            if (q.empty()) { result.clear(); break; }\n            if (q.size() > 1) ambiguous = true;\n            int v = q.front(); q.pop();\n            result.push_back(v);\n            for (int u = 1; u <= n; u++) {\n                if (graph[v][u]) {\n                    if (--in_deg[u] == 0) q.push(u);\n                }\n            }\n        }\n\n        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");\n        else if (ambiguous) printf("?\\n");\n        else {\n            for (int i = 0; i < n; i++)\n                printf("%d%c", result[i], i == n - 1 ? \'\\n\' : \' \');\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '간선 반전 + Kahn\'s Algorithm',
                description: '작년 순위로 모든 쌍의 간선을 만들고, 바뀐 쌍의 간선을 뒤집은 뒤 위상 정렬합니다.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 모든 쌍 간선 생성', desc: '작년 순위에서 앞→뒤 모든 쌍에 간선을 만들어\n"앞선 팀이 더 높은 순위"라는 관계를 그래프로 표현합니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nn = int(input())\nrank = list(map(int, input().split()))\n\ngraph = [[False] * (n + 1) for _ in range(n + 1)]\nin_degree = [0] * (n + 1)\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        graph[rank[i]][rank[j]] = True\n        in_degree[rank[j]] += 1' },
                        { title: '바뀐 쌍 간선 반전', desc: '올해 상대적 순서가 바뀐 쌍의 간선 방향을\n뒤집어 새로운 순위 관계를 반영합니다.', code: 'm = int(input())\nfor _ in range(m):\n    a, b = map(int, input().split())\n    if graph[a][b]:\n        graph[a][b] = False\n        graph[b][a] = True\n        in_degree[b] -= 1\n        in_degree[a] += 1\n    else:\n        graph[b][a] = False\n        graph[a][b] = True\n        in_degree[a] -= 1\n        in_degree[b] += 1' },
                        { title: '위상 정렬 + 판별', desc: '큐에 동시에 2개 이상 있으면 순서 불확정("?"),\n결과 수가 n보다 적으면 사이클("IMPOSSIBLE").', code: 'queue = deque()\nfor i in range(1, n + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nambiguous = False\n\nfor _ in range(n):\n    if len(queue) == 0: break\n    if len(queue) > 1: ambiguous = True\n    v = queue.popleft()\n    result.append(v)\n    for u in range(1, n + 1):\n        if graph[v][u]:\n            in_degree[u] -= 1\n            if in_degree[u] == 0:\n                queue.append(u)' },
                        { title: '결과 출력', desc: '사이클이면 IMPOSSIBLE, 순서 불확정이면 ?,\n그 외엔 확정된 올해 순위를 출력합니다.', code: 'if len(result) != n:\n    print("IMPOSSIBLE")\nelif ambiguous:\n    print("?")\nelse:\n    print(*result)' }
                    ],
                    cpp: [
                        { title: '입력 및 모든 쌍 간선 생성', desc: '작년 순위에서 앞→뒤 모든 쌍에 간선.\n2차원 bool 배열로 O(1) 간선 확인.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int T; scanf("%d", &T);\n    while (T--) {\n        int n; scanf("%d", &n);\n        vector<int> rank_arr(n);\n        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);\n\n        vector<vector<bool>> graph(n+1, vector<bool>(n+1, false));\n        vector<int> in_deg(n+1, 0);\n        for (int i = 0; i < n; i++)\n            for (int j = i+1; j < n; j++) {\n                graph[rank_arr[i]][rank_arr[j]] = true;\n                in_deg[rank_arr[j]]++;\n            }' },
                        { title: '바뀐 쌍 간선 반전', desc: '기존 방향을 뒤집고 진입 차수 갱신.', code: '        int m; scanf("%d", &m);\n        for (int i = 0; i < m; i++) {\n            int a, b; scanf("%d %d", &a, &b);\n            if (graph[a][b]) {\n                graph[a][b] = false; graph[b][a] = true;\n                in_deg[b]--; in_deg[a]++;\n            } else {\n                graph[b][a] = false; graph[a][b] = true;\n                in_deg[a]--; in_deg[b]++;\n            }\n        }' },
                        { title: '위상 정렬 + 판별', desc: '큐에 2개 이상 → "?", 결과<n → "IMPOSSIBLE".', code: '        queue<int> q;\n        for (int i = 1; i <= n; i++)\n            if (in_deg[i] == 0) q.push(i);\n\n        vector<int> result;\n        bool ambiguous = false;\n        for (int i = 0; i < n; i++) {\n            if (q.empty()) break;\n            if (q.size() > 1) ambiguous = true;\n            int v = q.front(); q.pop();\n            result.push_back(v);\n            for (int u = 1; u <= n; u++)\n                if (graph[v][u] && --in_deg[u] == 0) q.push(u);\n        }' },
                        { title: '결과 출력', desc: '사이클이면 IMPOSSIBLE, 순서 불확정이면 ?,\n그 외엔 확정된 올해 순위를 출력합니다.', code: '        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");\n        else if (ambiguous) printf("?\\n");\n        else {\n            for (int i = 0; i < n; i++)\n                printf("%d%c", result[i], i==n-1?\'\\n\':\' \');\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[3].templates; }
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
