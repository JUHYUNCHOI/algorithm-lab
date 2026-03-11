// =========================================================
// 최단 경로 (Shortest Path) 토픽 모듈 — 4탭 시스템
// =========================================================
var shortestPathTopic = {
    id: 'shortestpath',
    title: '최단 경로',
    icon: '🛤️',
    category: '고급 자료구조와 그래프',
    order: 18,
    description: '가중치 그래프에서 최소 비용 경로를 찾는 알고리즘',
    relatedNote: '이 외에도 벨만-포드(음수 간선), SPFA, A* 탐색 등의 최단 경로 알고리즘이 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-1753': { type: '다익스트라 기본',   color: 'var(--accent)', vizMethod: '_renderVizDijkstra' },
        'boj-11404':{ type: '플로이드-워셜',     color: 'var(--green)',  vizMethod: '_renderVizFloyd' },
        'boj-1916': { type: '다익스트라 응용',   color: '#e17055',       vizMethod: '_renderVizMinCost' },
        'lc-743':   { type: '다익스트라 응용',   color: '#6c5ce7',       vizMethod: '_renderVizDelay' }
    },

    getProblemTabs: function(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent: function(container, problemId, tabId) {
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
            sim:     { intro: prob.simIntro || '최단 경로 알고리즘이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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

    // ===== 공통 탭 렌더러 =====
    _renderProblemTab: function(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab: function(contentEl, prob) {
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

    _renderCodeTab: function(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept: function(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>🛤️ 최단 경로 (Shortest Path)</h2>\
                <p class="hero-sub">가중치 그래프에서 최소 비용으로 목적지까지 가는 방법을 배워봅시다!</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> 최단 경로란?\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 자동차 <strong>네비게이션</strong>을 생각해 보세요!<br><br>\
                    집에서 학교까지 가는 길이 여러 개 있습니다. 어떤 길은 거리가 짧고, 어떤 길은 멀지요.<br>\
                    네비게이션은 모든 길을 비교해서 <strong>가장 빠른(비용이 적은) 경로</strong>를 찾아줍니다.<br><br>\
                    이것이 바로 <strong>최단 경로 알고리즘</strong>입니다!<br>\
                    그래프의 간선에 <strong>가중치(비용)</strong>가 있을 때, 출발지에서 목적지까지 <strong>비용 합이 최소</strong>인 경로를 찾습니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--green)">3</text></svg>\
                        </div>\
                        <h3>양수 가중치</h3>\
                        <p>간선의 비용이 모두 0 이상입니다.<br><strong>다익스트라 알고리즘</strong>으로 해결합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--red, #e17055)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--red, #e17055)">-2</text></svg>\
                        </div>\
                        <h3>음수 가중치</h3>\
                        <p>간선의 비용이 음수일 수 있습니다.<br><strong>벨만-포드 알고리즘</strong>이 필요합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="19" cy="30" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="15" y1="10" x2="23" y2="10" stroke="var(--accent)" stroke-width="2"/><line x1="12" y1="15" x2="17" y2="25" stroke="var(--accent)" stroke-width="2"/><line x1="26" y1="15" x2="21" y2="25" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>단일 출발점</h3>\
                        <p>하나의 시작점에서 모든 정점까지의 최단 거리를 구합니다.<br>다익스트라, 벨만-포드가 해당됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--yellow)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--yellow)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--yellow)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--yellow)" stroke-width="1"/><text x="10" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">0</text><text x="21" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">3</text><text x="10" y="23" text-anchor="middle" font-size="7" fill="var(--yellow)">5</text></svg>\
                        </div>\
                        <h3>모든 쌍 최단경로</h3>\
                        <p>모든 정점 쌍 사이의 최단 거리를 구합니다.<br><strong>플로이드-워셜 알고리즘</strong>이 해당됩니다.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">BFS로도 최단 경로를 구할 수 있는데, 다익스트라는 왜 필요할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        BFS는 <strong>모든 간선의 가중치가 1일 때만</strong> 최단 경로를 보장합니다!<br>\
                        간선마다 비용이 다르면 BFS로는 최단 경로를 구할 수 없습니다.<br>\
                        예: A→B 비용 1, A→C 비용 10이면, BFS는 둘 다 "1칸"으로 취급합니다.<br>\
                        <strong>가중치가 다를 때</strong>는 다익스트라가 필요합니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> 다익스트라 알고리즘 (Dijkstra)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "가장 가까운 곳부터 탐색하기"를 생각해 보세요!<br><br>\
                    여러분이 동네 지도를 갖고 있다고 합시다. 집에서 출발해서 가장 가까운 편의점에 먼저 가고,<br>\
                    그다음 가까운 곳을 방문하고... 이렇게 <strong>항상 현재까지 가장 가까운 미방문 장소</strong>부터 처리합니다.<br><br>\
                    이것이 다익스트라 알고리즘의 핵심입니다! 단, <strong>가중치가 모두 양수(0 이상)</strong>일 때만 올바르게 동작합니다.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--accent)">+</text></svg>\
                        </div>\
                        <h3>양수 가중치 전용</h3>\
                        <p>간선 가중치가 음수이면 올바른 결과를 보장하지 않습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="12" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--green)">min</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><line x1="16" y1="17" x2="12" y2="25" stroke="var(--border)" stroke-width="1.5"/><line x1="22" y1="17" x2="26" y2="25" stroke="var(--border)" stroke-width="1.5"/></svg>\
                        </div>\
                        <h3>최소 힙(heapq) 사용</h3>\
                        <p>거리가 가장 짧은 정점을 빠르게 꺼냅니다. 우선순위 큐를 사용합니다!<br>\
                        <span class="lang-py"><a href="https://docs.python.org/3/library/heapq.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: heapq ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/priority_queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: priority_queue ↗</a></span></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">O((V+E)</text><text x="19" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">log V)</text></svg>\
                        </div>\
                        <h3>시간 복잡도</h3>\
                        <p>우선순위 큐를 사용하면 O((V+E)logV)입니다. 매우 효율적입니다!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># 다익스트라 알고리즘 (최소 힙 사용)\
\nimport heapq\
\nimport sys\
\ninput = sys.stdin.readline\
\nINF = float(\'inf\')\
\n\
\ndef dijkstra(start, graph, N):\
\n    dist = [INF] * (N + 1)\
\n    dist[start] = 0\
\n    heap = [(0, start)]\
\n\
\n    while heap:\
\n        d, v = heapq.heappop(heap)\
\n        if d > dist[v]:\
\n            continue\
\n        for u, w in graph[v]:\
\n            nd = d + w\
\n            if nd < dist[u]:\
\n                dist[u] = nd\
\n                heapq.heappush(heap, (nd, u))\
\n    return dist</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// 다익스트라 알고리즘 (최소 힙 사용)\
\n#include &lt;iostream&gt;\
\n#include &lt;vector&gt;\
\n#include &lt;queue&gt;\
\n#include &lt;climits&gt;\
\nusing namespace std;\
\n\
\nvoid dijkstra(int start, vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt;&amp; graph, int N) {\
\n    vector&lt;int&gt; dist(N + 1, INT_MAX);\
\n    // greater&lt;&gt;로 최소 힙 구현 (Python heapq와 동일)\
\n    priority_queue&lt;pair&lt;int,int&gt;, vector&lt;pair&lt;int,int&gt;&gt;, greater&lt;pair&lt;int,int&gt;&gt;&gt; pq;\
\n    dist[start] = 0;\
\n    pq.push({0, start});\
\n\
\n    while (!pq.empty()) {\
\n        auto [d, v] = pq.top(); pq.pop();\
\n        if (d &gt; dist[v]) continue;\
\n        for (auto [u, w] : graph[v]) {\
\n            int nd = d + w;\
\n            if (nd &lt; dist[u]) {\
\n                dist[u] = nd;\
\n                pq.push({nd, u});\
\n            }\
\n        }\
\n    }\
\n}</code></pre>\
                </div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">다익스트라에서 <code>if d > dist[v]: continue</code>는 왜 필요할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        힙에는 같은 정점이 여러 번 들어갈 수 있습니다!<br>\
                        예: A→B 비용 5로 (5, B)를 넣었는데, 나중에 A→C→B 비용 3으로 (3, B)를 또 넣습니다.<br>\
                        (3, B)가 먼저 처리된 후 (5, B)가 나오면, 이미 더 짧은 경로로 처리되었으므로 <strong>무시</strong>합니다.<br>\
                        이 조건이 없으면 불필요한 연산이 많아져 느려집니다!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> 벨만-포드 알고리즘 (Bellman-Ford)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "모든 길을 반복해서 확인하기"를 생각해 보세요!<br><br>\
                    네비게이션이 고장나서, 한 번에 가장 가까운 곳을 못 찾습니다.<br>\
                    대신 <strong>모든 도로를 한 바퀴씩 돌면서</strong> "더 짧은 길이 있나?" 확인합니다.<br>\
                    이걸 <strong>V-1번</strong> 반복하면 모든 최단 경로를 찾을 수 있습니다!<br><br>\
                    장점: <strong>음수 가중치</strong>가 있어도 동작합니다.<br>\
                    V번째 반복에서도 거리가 줄어들면? <strong>음수 사이클</strong>이 존재하는 것입니다!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--green)">-</text></svg>\
                        </div>\
                        <h3>음수 가중치 OK</h3>\
                        <p>다익스트라와 달리 간선 가중치가 음수여도 정확히 동작합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--accent)">V-1</text><text x="19" y="30" text-anchor="middle" font-size="9" fill="var(--text2)">번 반복</text></svg>\
                        </div>\
                        <h3>V-1번 완화</h3>\
                        <p>모든 간선을 V-1번 반복하며 거리를 갱신(완화)합니다.<br>\
                        <a href="https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Bellman-Ford algorithm ↗</a></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="26" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="19" cy="28" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M16 14 L24 14 M24 16 L21 24 M17 24 L14 16" stroke="var(--red, #e17055)" stroke-width="1.5"/><text x="19" y="37" text-anchor="middle" font-size="7" fill="var(--red, #e17055)">음수사이클</text></svg>\
                        </div>\
                        <h3>음수 사이클 탐지</h3>\
                        <p>V번째에도 갱신이 되면 음수 사이클이 존재합니다! O(VE)</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># 벨만-포드 알고리즘\
\nimport sys\
\ninput = sys.stdin.readline\
\nINF = float(\'inf\')\
\n\
\nN, M = map(int, input().split())\
\nedges = []\
\nfor _ in range(M):\
\n    u, v, w = map(int, input().split())\
\n    edges.append((u, v, w))\
\n\
\ndist = [INF] * (N + 1)\
\ndist[1] = 0\
\n\
\nfor i in range(N - 1):\
\n    for u, v, w in edges:\
\n        if dist[u] != INF and dist[u] + w < dist[v]:\
\n            dist[v] = dist[u] + w\
\n\
\nhas_negative_cycle = False\
\nfor u, v, w in edges:\
\n    if dist[u] != INF and dist[u] + w < dist[v]:\
\n        has_negative_cycle = True\
\n        break</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// 벨만-포드 알고리즘\
\n#include &lt;iostream&gt;\
\n#include &lt;vector&gt;\
\n#include &lt;climits&gt;\
\nusing namespace std;\
\n\
\nint main() {\
\n    int N, M;\
\n    cin &gt;&gt; N &gt;&gt; M;\
\n    vector&lt;tuple&lt;int,int,int&gt;&gt; edges(M);\
\n    for (auto&amp; [u, v, w] : edges)\
\n        cin &gt;&gt; u &gt;&gt; v &gt;&gt; w;\
\n\
\n    vector&lt;int&gt; dist(N + 1, INT_MAX);\
\n    dist[1] = 0;\
\n\
\n    // V-1번 모든 간선을 완화\
\n    for (int i = 0; i &lt; N - 1; i++) {\
\n        for (auto [u, v, w] : edges) {\
\n            if (dist[u] != INT_MAX &amp;&amp; dist[u] + w &lt; dist[v])\
\n                dist[v] = dist[u] + w;\
\n        }\
\n    }\
\n\
\n    // V번째에도 갱신되면 음수 사이클 존재\
\n    bool has_negative_cycle = false;\
\n    for (auto [u, v, w] : edges) {\
\n        if (dist[u] != INT_MAX &amp;&amp; dist[u] + w &lt; dist[v]) {\
\n            has_negative_cycle = true;\
\n            break;\
\n        }\
\n    }\
\n}</code></pre>\
                </div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">왜 V-1번 반복하면 모든 최단 경로를 찾을 수 있을까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        최단 경로는 최대 <strong>V-1개의 간선</strong>을 지나갑니다 (V개 정점을 거치므로).<br>\
                        1번 반복하면 간선 1개짜리 최단 경로가 확정되고,<br>\
                        2번 반복하면 간선 2개짜리 최단 경로가 확정되고...<br>\
                        V-1번 반복하면 모든 최단 경로가 확정됩니다!<br>\
                        만약 V번째에도 갱신이 되면, 간선을 무한히 지나갈수록 비용이 줄어드는 <strong>음수 사이클</strong>이 있다는 뜻입니다.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">4</span> 플로이드-워셜 알고리즘 (Floyd-Warshall)\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> "경유지를 하나씩 추가하기"를 생각해 보세요!<br><br>\
                    서울에서 부산까지 바로 가면 5시간이 걸립니다.<br>\
                    그런데 <strong>대전을 경유</strong>하면? 서울→대전 2시간 + 대전→부산 2시간 = 4시간!<br>\
                    이렇게 모든 정점을 경유지 후보로 넣어보면서, 더 짧은 경로가 있으면 갱신합니다.<br><br>\
                    <strong>모든 쌍</strong>의 최단 경로를 한 번에 구할 수 있습니다!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--accent)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--accent)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--accent)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--accent)" stroke-width="1"/></svg>\
                        </div>\
                        <h3>2차원 배열 dp[i][j]</h3>\
                        <p>dp[i][j] = i에서 j까지의 최단 거리. 모든 쌍을 저장합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="16" text-anchor="middle" font-size="8" fill="var(--accent)">for k</text><text x="19" y="25" text-anchor="middle" font-size="8" fill="var(--accent)">for i</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--accent)">for j</text></svg>\
                        </div>\
                        <h3>3중 for문</h3>\
                        <p>경유지 k를 바깥 루프에 놓습니다. 순서가 매우 중요합니다!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">O(V³)</text></svg>\
                        </div>\
                        <h3>시간 복잡도 O(V³)</h3>\
                        <p>정점이 많으면 느리지만, 코드가 매우 간단합니다. V ≤ 500 정도면 사용 가능합니다.<br>\
                        <a href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Floyd-Warshall algorithm ↗</a></p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># 플로이드-워셜 알고리즘\
\nINF = float(\'inf\')\
\n\
\n# dp[i][j] = i에서 j까지의 최단 거리\
\nfor k in range(1, N + 1):       # 경유지\
\n    for i in range(1, N + 1):   # 출발지\
\n        for j in range(1, N + 1):  # 도착지\
\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// 플로이드-워셜 알고리즘\
\nconst int INF = 1e9;\
\n\
\n// dp[i][j] = i에서 j까지의 최단 거리\
\nfor (int k = 1; k &lt;= N; k++)        // 경유지\
\n    for (int i = 1; i &lt;= N; i++)    // 출발지\
\n        for (int j = 1; j &lt;= N; j++)   // 도착지\
\n            if (dp[i][k] != INF &amp;&amp; dp[k][j] != INF)\
\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);</code></pre>\
                </div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">플로이드-워셜에서 왜 경유지 k가 가장 바깥 루프여야 할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        <strong>k가 바깥 루프</strong>에 있어야 "1번 정점만 경유 → 1,2번 정점만 경유 → ... → 모든 정점 경유"로<br>\
                        점차 경유 가능한 정점을 늘려가며 <strong>DP를 올바르게 갱신</strong>할 수 있습니다!<br><br>\
                        만약 k를 안쪽에 넣으면, 아직 갱신되지 않은 dp[i][k]를 사용하게 되어 잘못된 결과가 나옵니다.<br>\
                        <strong>반드시 k → i → j 순서</strong>를 지켜야 합니다!\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box').forEach(function(box) {
            var trigger = box.querySelector('.think-box-trigger');
            var answer = box.querySelector('.think-box-answer');
            if (trigger && answer) {
                trigger.addEventListener('click', function() {
                    answer.classList.toggle('show');
                    trigger.textContent = answer.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
                });
            }
        });
        container.querySelectorAll('pre code').forEach(function(el) {
            if (window.hljs) hljs.highlightElement(el);
        });
    },

    // ===== 시각화 탭 (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-sp';
        var NODES = ['A', 'B', 'C', 'D', 'E'];
        var INF = Infinity;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">다익스트라 알고리즘 시각화</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">5개 노드의 방향 그래프에서 A를 출발점으로 최단 경로를 찾습니다.</p>' +
            '<div id="sp-dist-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' +
            NODES.map(function(n, i) {
                return '<div class="str-char-box" data-node="' + i + '" style="min-width:52px;text-align:center;">' +
                    '<div style="font-weight:700;font-size:0.85rem;">' + n + '</div>' +
                    '<div class="sp-dist-val" style="font-size:1.1rem;font-weight:600;color:var(--accent);">&infin;</div></div>';
            }).join('') +
            '</div>' +
            '<div id="sp-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;">' +
            '<span style="color:var(--text2);">A에서 출발하여 다익스트라를 실행합니다.</span></div>' +
            self._createStepControls(suffix);

        var distEl = container.querySelector('#sp-dist-' + suffix);
        var infoEl = container.querySelector('#sp-info-' + suffix);

        var adj = [
            [[1,4],[2,2]],
            [[3,3],[4,1]],
            [[1,1],[3,5]],
            [[4,2]],
            []
        ];

        // Pre-simulate dijkstra
        var simDist = [0, INF, INF, INF, INF];
        var simVisited = [];
        var simHeap = [[0, 0]];
        var steps = [];

        function renderDist(dist, highlight) {
            distEl.innerHTML = NODES.map(function(n, i) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var cls = highlight === i ? ' updated' : '';
                return '<div class="str-char-box" data-node="' + i + '" style="min-width:52px;text-align:center;">' +
                    '<div style="font-weight:700;font-size:0.85rem;">' + n + '</div>' +
                    '<div class="sp-dist-val' + cls + '" style="font-size:1.1rem;font-weight:600;color:var(--accent);">' + val + '</div></div>';
            }).join('');
        }

        var savedStates = [];
        function saveSnapshot() {
            return { dist: simDist.slice(), visited: simVisited.slice(), heap: simHeap.map(function(h) { return h.slice(); }), info: infoEl.innerHTML, distHTML: distEl.innerHTML };
        }
        function restoreSnapshot(s) {
            simDist = s.dist.slice(); simVisited = s.visited.slice(); simHeap = s.heap.map(function(h) { return h.slice(); });
            infoEl.innerHTML = s.info; distEl.innerHTML = s.distHTML;
        }

        // Step 0: init
        var snap0 = saveSnapshot();
        steps.push({
            description: '초기화: dist[A]=0, 나머지=\u221E. 힙에 (0, A)를 넣습니다.',
            action: function() { renderDist(simDist, 0); infoEl.innerHTML = 'dist = [0, \u221E, \u221E, \u221E, \u221E], heap = [(0, A)]'; },
            undo: function() { restoreSnapshot(snap0); }
        });

        // Process each node
        var processOrder = [];
        var tmpDist = [0, INF, INF, INF, INF];
        var tmpVis = [false, false, false, false, false];
        var tmpHeap = [[0, 0]];
        while (tmpHeap.length > 0) {
            tmpHeap.sort(function(a, b) { return a[0] - b[0]; });
            var top = tmpHeap.shift();
            var d = top[0], v = top[1];
            if (tmpVis[v]) continue;
            tmpVis[v] = true;
            var updates = [];
            for (var ei = 0; ei < adj[v].length; ei++) {
                var u = adj[v][ei][0], w = adj[v][ei][1];
                var nd = d + w;
                if (nd < tmpDist[u]) {
                    updates.push({ node: u, oldDist: tmpDist[u], newDist: nd });
                    tmpDist[u] = nd;
                    tmpHeap.push([nd, u]);
                }
            }
            processOrder.push({ node: v, dist: d, updates: updates });
        }

        processOrder.forEach(function(step) {
            var v = step.node, d = step.dist;
            // Pop + process
            (function(v, d, updates) {
                var snapBefore;
                steps.push({
                    description: '힙에서 (' + d + ', ' + NODES[v] + ')을 꺼내 처리합니다. ' +
                        (updates.length > 0 ?
                            updates.map(function(u) {
                                return NODES[v] + '\u2192' + NODES[u.node] + ': dist=' + (u.oldDist === INF ? '\u221E' : u.oldDist) + ' \u2192 ' + u.newDist;
                            }).join(', ') :
                            '갱신할 이웃이 없습니다.'),
                    action: function() {
                        snapBefore = saveSnapshot();
                        simVisited.push(v);
                        for (var i = 0; i < updates.length; i++) {
                            simDist[updates[i].node] = updates[i].newDist;
                        }
                        renderDist(simDist, updates.length > 0 ? updates[updates.length - 1].node : -1);
                        var visitedStr = simVisited.map(function(vi) { return NODES[vi]; }).join(', ');
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 완료 (dist=' + d + ')</strong>. 방문: {' + visitedStr + '}';
                    },
                    undo: function() { restoreSnapshot(snapBefore); }
                });
            })(v, d, step.updates);
        });

        // Final
        var snapFinal;
        steps.push({
            description: '다익스트라 완료! A=0, B=3, C=2, D=6, E=4',
            action: function() {
                snapFinal = saveSnapshot();
                infoEl.innerHTML = '<strong style="color:var(--green);">완료! dist = [0, 3, 2, 6, 4]</strong>';
            },
            undo: function() { restoreSnapshot(snapFinal); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== 시각화 상태 관리 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls: function(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>\u25C0 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 \u25B6</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">\u25B6 다음 버튼을 눌러 시작하세요</div>';
    },

    _initStepController: function(container, steps, suffix) {
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '\u25B6 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
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

    // ====================================================================
    // 시뮬레이션 1: 다익스트라 기본 (boj-1753)
    // ====================================================================
    _renderVizDijkstra: function(container) {
        var self = this;
        var suffix = '-dijk';
        var INF = Infinity;

        var DEFAULT_N = 5;
        var DEFAULT_EDGES = '1 2 2, 1 3 3, 2 3 4, 2 4 5, 3 4 6';
        var DEFAULT_START = 1;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">다익스트라: BOJ 1753 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">정점에서 출발하여 모든 정점까지의 최단 거리를 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">노드 수: <input type="number" id="sp-dijk-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">시작 노드: <input type="number" id="sp-dijk-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">간선 (from to weight): <input type="text" id="sp-dijk-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
                '<button class="btn btn-primary" id="sp-dijk-reset">\uD83D\uDD04</button>' +
            '</div>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function parseEdges(edgeStr, nodeCount) {
            var adj = [];
            for (var i = 0; i < nodeCount; i++) adj.push([]);
            var parts = edgeStr.split(',');
            for (var p = 0; p < parts.length; p++) {
                var tokens = parts[p].trim().split(/\s+/);
                if (tokens.length >= 3) {
                    var from = parseInt(tokens[0]) - 1;
                    var to = parseInt(tokens[1]) - 1;
                    var w = parseInt(tokens[2]);
                    if (from >= 0 && from < nodeCount && to >= 0 && to < nodeCount && !isNaN(w)) {
                        adj[from].push([to, w]);
                    }
                }
            }
            return adj;
        }

        function buildAndRun(nodeCount, adj, startIdx) {
            var NODES = [];
            for (var ni = 0; ni < nodeCount; ni++) NODES.push(String(ni + 1));

            function renderDist(dist, hlIdx) {
                arrEl.innerHTML = NODES.map(function(n, i) {
                    var val = dist[i] === INF ? '\u221E' : dist[i];
                    var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                    return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
                }).join('');
            }

            var simDist = [];
            for (var si = 0; si < nodeCount; si++) simDist.push(si === startIdx ? 0 : INF);
            renderDist(simDist, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">정점 ' + (startIdx + 1) + '에서 다익스트라를 시작합니다.</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E. 힙에 (0, ' + (startIdx + 1) + ')을 넣습니다.',
                action: function() { renderDist(simDist, startIdx); infoEl.innerHTML = 'dist=[' + initDistStr + '], heap=[(0,' + (startIdx + 1) + ')]'; },
                undo: function() { restore(s0); }
            });

            var processOrder = [];
            var td = [];
            for (var ti = 0; ti < nodeCount; ti++) td.push(ti === startIdx ? 0 : INF);
            var tv = [];
            for (var tvi = 0; tvi < nodeCount; tvi++) tv.push(false);
            var th = [[0, startIdx]];
            while (th.length > 0) {
                th.sort(function(a, b) { return a[0] - b[0]; });
                var top = th.shift(), dd = top[0], vv = top[1];
                if (tv[vv]) continue;
                tv[vv] = true;
                var upd = [];
                for (var i = 0; i < adj[vv].length; i++) {
                    var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                    if (nnd < td[uu]) { upd.push({ node: uu, old: td[uu], nw: nnd }); td[uu] = nnd; th.push([nnd, uu]); }
                }
                processOrder.push({ node: vv, dist: dd, updates: upd });
            }

            processOrder.forEach(function(st) {
                (function(v, d, updates) {
                    var sb;
                    steps.push({
                        description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ' dist=' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw; }).join(', ') : '갱신 없음'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                        },
                        undo: function() { restore(sb); }
                    });
                })(st.node, st.dist, st.updates);
            });

            var finalDist = td.map(function(v) { return v === INF ? 'INF' : v; }).join(', ');
            var sf;
            steps.push({
                description: '완료! dist = [' + finalDist + ']',
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! dist=[' + finalDist + ']</strong>'; },
                undo: function() { restore(sf); }
            });

            self._initStepController(container, steps, suffix);
        }

        function runFromInputs() {
            var n = parseInt(container.querySelector('#sp-dijk-n').value) || DEFAULT_N;
            var start = parseInt(container.querySelector('#sp-dijk-start').value) || DEFAULT_START;
            var edgeStr = container.querySelector('#sp-dijk-edges').value || DEFAULT_EDGES;
            if (n < 2) n = 2; if (n > 10) n = 10;
            if (start < 1) start = 1; if (start > n) start = n;
            var adj = parseEdges(edgeStr, n);
            buildAndRun(n, adj, start - 1);
        }

        container.querySelector('#sp-dijk-reset').addEventListener('click', function() {
            self._clearVizState();
            runFromInputs();
        });

        runFromInputs();
    },

    // ====================================================================
    // 시뮬레이션 2: 플로이드-워셜 (boj-11404)
    // ====================================================================
    _renderVizFloyd: function(container) {
        var self = this;
        var suffix = '-floyd';
        var INF = Infinity;

        var DEFAULT_N = 3;
        var DEFAULT_EDGES = '1 2 4, 1 3 11, 2 1 6, 2 3 2, 3 1 3';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">플로이드-워셜: 모든 쌍 최단 경로</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">경유지 k를 차례로 고려하며 모든 쌍의 최단 거리를 갱신합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">노드 수: <input type="number" id="sp-floyd-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="8"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">간선 (from to weight): <input type="text" id="sp-floyd-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
                '<button class="btn btn-primary" id="sp-floyd-reset">\uD83D\uDD04</button>' +
            '</div>' +
            '<div id="sp-grid' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var gridEl = container.querySelector('#sp-grid' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function buildAndRun(N, edgeStr) {
            // Build dp matrix from edges
            var dp = [];
            for (var i = 0; i < N; i++) {
                var row = [];
                for (var j = 0; j < N; j++) row.push(i === j ? 0 : INF);
                dp.push(row);
            }
            var parts = edgeStr.split(',');
            for (var p = 0; p < parts.length; p++) {
                var tokens = parts[p].trim().split(/\s+/);
                if (tokens.length >= 3) {
                    var from = parseInt(tokens[0]) - 1;
                    var to = parseInt(tokens[1]) - 1;
                    var w = parseInt(tokens[2]);
                    if (from >= 0 && from < N && to >= 0 && to < N && !isNaN(w)) {
                        if (w < dp[from][to]) dp[from][to] = w;
                    }
                }
            }

            function renderGrid(dpArr, hlI, hlJ) {
                var html = '<table style="border-collapse:collapse;margin:0 auto;"><tr><th style="padding:6px 12px;"></th>';
                for (var j = 0; j < N; j++) html += '<th style="padding:6px 12px;font-weight:600;">' + (j + 1) + '</th>';
                html += '</tr>';
                for (var i = 0; i < N; i++) {
                    html += '<tr><th style="padding:6px 12px;font-weight:600;">' + (i + 1) + '</th>';
                    for (var j2 = 0; j2 < N; j2++) {
                        var bg = (i === hlI && j2 === hlJ) ? 'background:var(--green);color:white;' : '';
                        var val = dpArr[i][j2] === INF ? '\u221E' : dpArr[i][j2];
                        html += '<td style="padding:6px 12px;text-align:center;border:1px solid var(--border);font-weight:600;' + bg + '">' + val + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                gridEl.innerHTML = html;
            }

            renderGrid(dp, -1, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">초기 거리 행렬입니다.</span>';

            var steps = [];
            var curDp = dp.map(function(r) { return r.slice(); });

            function snapF() { return { dp: curDp.map(function(r) { return r.slice(); }), info: infoEl.innerHTML, grid: gridEl.innerHTML }; }
            function restoreF(s) { curDp = s.dp.map(function(r) { return r.slice(); }); infoEl.innerHTML = s.info; gridEl.innerHTML = s.grid; }

            var s0 = snapF();
            steps.push({
                description: '초기 상태: 직접 간선으로 구한 거리 행렬입니다.',
                action: function() { renderGrid(curDp, -1, -1); infoEl.innerHTML = '초기 거리 행렬'; },
                undo: function() { restoreF(s0); }
            });

            for (var k = 0; k < N; k++) {
                (function(k) {
                    var updated = [];
                    for (var i = 0; i < N; i++) {
                        for (var j = 0; j < N; j++) {
                            if (i === j) continue;
                            if (curDp[i][k] === INF || curDp[k][j] === INF) continue;
                            var via = curDp[i][k] + curDp[k][j];
                            if (via < curDp[i][j]) {
                                updated.push({ i: i, j: j, old: curDp[i][j], nw: via });
                                curDp[i][j] = via;
                            }
                        }
                    }
                    var sb;
                    var desc = '경유지 k=' + (k + 1) + ': ';
                    if (updated.length > 0) {
                        desc += updated.map(function(u) {
                            return 'dp[' + (u.i + 1) + '][' + (u.j + 1) + '] ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw;
                        }).join(', ');
                    } else {
                        desc += '갱신 없음';
                    }
                    var snapDp = curDp.map(function(r) { return r.slice(); });
                    var lastUpd = updated.length > 0 ? updated[updated.length - 1] : null;
                    steps.push({
                        description: desc,
                        action: function() {
                            sb = snapF();
                            curDp = snapDp.map(function(r) { return r.slice(); });
                            renderGrid(curDp, lastUpd ? lastUpd.i : -1, lastUpd ? lastUpd.j : -1);
                            infoEl.innerHTML = '<strong>경유지 k=' + (k + 1) + ' 처리 완료</strong>';
                        },
                        undo: function() { restoreF(sb); }
                    });
                })(k);
            }

            var sfF;
            steps.push({
                description: '플로이드-워셜 완료! 모든 쌍의 최단 거리가 확정되었습니다.',
                action: function() { sfF = snapF(); infoEl.innerHTML = '<strong style="color:var(--green);">완료!</strong>'; },
                undo: function() { restoreF(sfF); }
            });

            self._initStepController(container, steps, suffix);
        }

        function runFromInputs() {
            var n = parseInt(container.querySelector('#sp-floyd-n').value) || DEFAULT_N;
            var edgeStr = container.querySelector('#sp-floyd-edges').value || DEFAULT_EDGES;
            if (n < 2) n = 2; if (n > 8) n = 8;
            buildAndRun(n, edgeStr);
        }

        container.querySelector('#sp-floyd-reset').addEventListener('click', function() {
            self._clearVizState();
            runFromInputs();
        });

        runFromInputs();
    },

    // ====================================================================
    // 시뮬레이션 3: 최소비용 구하기 (boj-1916)
    // ====================================================================
    _renderVizMinCost: function(container) {
        var self = this;
        var suffix = '-mincost';
        var INF = Infinity;

        var DEFAULT_N = 5;
        var DEFAULT_EDGES = '1 2 2, 1 3 3, 1 4 1, 1 5 10, 2 4 2, 3 4 1, 3 5 1, 4 5 3';
        var DEFAULT_START = 1;
        var DEFAULT_END = 5;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최소비용 구하기: BOJ 1916 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">출발점에서 도착점까지의 최소 비용을 다익스트라로 구합니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">노드 수: <input type="number" id="sp-mincost-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">출발: <input type="number" id="sp-mincost-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
                '<label style="font-weight:600;">도착: <input type="number" id="sp-mincost-end" value="' + DEFAULT_END + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">간선 (from to weight): <input type="text" id="sp-mincost-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
                '<button class="btn btn-primary" id="sp-mincost-reset">\uD83D\uDD04</button>' +
            '</div>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function parseEdges(edgeStr, nodeCount) {
            var adj = [];
            for (var i = 0; i < nodeCount; i++) adj.push([]);
            var parts = edgeStr.split(',');
            for (var p = 0; p < parts.length; p++) {
                var tokens = parts[p].trim().split(/\s+/);
                if (tokens.length >= 3) {
                    var from = parseInt(tokens[0]) - 1;
                    var to = parseInt(tokens[1]) - 1;
                    var w = parseInt(tokens[2]);
                    if (from >= 0 && from < nodeCount && to >= 0 && to < nodeCount && !isNaN(w)) {
                        adj[from].push([to, w]);
                    }
                }
            }
            return adj;
        }

        function buildAndRun(nodeCount, adj, startIdx, endIdx) {
            var NODES = [];
            for (var ni = 0; ni < nodeCount; ni++) NODES.push(String(ni + 1));

            function renderDist(dist, hlIdx) {
                arrEl.innerHTML = NODES.map(function(n, i) {
                    var val = dist[i] === INF ? '\u221E' : dist[i];
                    var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                    return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
                }).join('');
            }

            var simDist = [];
            for (var si = 0; si < nodeCount; si++) simDist.push(si === startIdx ? 0 : INF);
            renderDist(simDist, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">정점 ' + (startIdx + 1) + '에서 다익스트라를 시작합니다. 목표: 정점 ' + (endIdx + 1) + '</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E.',
                action: function() { renderDist(simDist, startIdx); infoEl.innerHTML = 'dist=[' + initDistStr + ']'; },
                undo: function() { restore(s0); }
            });

            var processOrder = [];
            var td = [];
            for (var ti = 0; ti < nodeCount; ti++) td.push(ti === startIdx ? 0 : INF);
            var tv = [];
            for (var tvi = 0; tvi < nodeCount; tvi++) tv.push(false);
            var th = [[0, startIdx]];
            while (th.length > 0) {
                th.sort(function(a, b) { return a[0] - b[0]; });
                var top = th.shift(), dd = top[0], vv = top[1];
                if (tv[vv]) continue;
                tv[vv] = true;
                var upd = [];
                for (var i = 0; i < adj[vv].length; i++) {
                    var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                    if (nnd < td[uu]) { upd.push({ node: uu, old: td[uu], nw: nnd }); td[uu] = nnd; th.push([nnd, uu]); }
                }
                processOrder.push({ node: vv, dist: dd, updates: upd });
            }

            processOrder.forEach(function(st) {
                (function(v, d, updates) {
                    var sb;
                    steps.push({
                        description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ' dist=' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw; }).join(', ') : '갱신 없음'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                        },
                        undo: function() { restore(sb); }
                    });
                })(st.node, st.dist, st.updates);
            });

            var endDist = td[endIdx];
            var endDistStr = endDist === INF ? 'INF' : endDist;
            var sf;
            steps.push({
                description: '완료! dist[' + (endIdx + 1) + '] = ' + endDistStr + ' 가 최소 비용입니다.',
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! ' + (startIdx + 1) + '\u2192' + (endIdx + 1) + ' 최소비용 = ' + endDistStr + '</strong>'; },
                undo: function() { restore(sf); }
            });

            self._initStepController(container, steps, suffix);
        }

        function runFromInputs() {
            var n = parseInt(container.querySelector('#sp-mincost-n').value) || DEFAULT_N;
            var start = parseInt(container.querySelector('#sp-mincost-start').value) || DEFAULT_START;
            var end = parseInt(container.querySelector('#sp-mincost-end').value) || DEFAULT_END;
            var edgeStr = container.querySelector('#sp-mincost-edges').value || DEFAULT_EDGES;
            if (n < 2) n = 2; if (n > 10) n = 10;
            if (start < 1) start = 1; if (start > n) start = n;
            if (end < 1) end = 1; if (end > n) end = n;
            var adj = parseEdges(edgeStr, n);
            buildAndRun(n, adj, start - 1, end - 1);
        }

        container.querySelector('#sp-mincost-reset').addEventListener('click', function() {
            self._clearVizState();
            runFromInputs();
        });

        runFromInputs();
    },

    // ====================================================================
    // 시뮬레이션 4: Network Delay Time (lc-743)
    // ====================================================================
    _renderVizDelay: function(container) {
        var self = this;
        var suffix = '-delay';
        var INF = Infinity;

        var DEFAULT_N = 4;
        var DEFAULT_K = 2;
        var DEFAULT_EDGES = '2 1 1, 2 3 1, 3 4 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Network Delay Time: LC 743 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">시작 노드에서 신호를 보냅니다. 모든 노드가 받는 최소 시간 = max(dist).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">노드 수 N: <input type="number" id="sp-delay-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">시작 노드 K: <input type="number" id="sp-delay-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">간선 (from to weight): <input type="text" id="sp-delay-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
                '<button class="btn btn-primary" id="sp-delay-reset">\uD83D\uDD04</button>' +
            '</div>' +
            '<div id="sp-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#sp-arr' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function parseEdges(edgeStr, nodeCount) {
            var adj = [];
            for (var i = 0; i < nodeCount; i++) adj.push([]);
            var parts = edgeStr.split(',');
            for (var p = 0; p < parts.length; p++) {
                var tokens = parts[p].trim().split(/\s+/);
                if (tokens.length >= 3) {
                    var from = parseInt(tokens[0]) - 1;
                    var to = parseInt(tokens[1]) - 1;
                    var w = parseInt(tokens[2]);
                    if (from >= 0 && from < nodeCount && to >= 0 && to < nodeCount && !isNaN(w)) {
                        adj[from].push([to, w]);
                    }
                }
            }
            return adj;
        }

        function buildAndRun(nodeCount, adj, startIdx) {
            var NODES = [];
            for (var ni = 0; ni < nodeCount; ni++) NODES.push(String(ni + 1));

            function renderDist(dist, hlIdx) {
                arrEl.innerHTML = NODES.map(function(n, i) {
                    var val = dist[i] === INF ? '\u221E' : dist[i];
                    var bg = hlIdx === i ? 'background:var(--green);color:white;' : 'background:var(--bg2);';
                    return '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + n + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
                }).join('');
            }

            var simDist = [];
            for (var si = 0; si < nodeCount; si++) simDist.push(si === startIdx ? 0 : INF);
            renderDist(simDist, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">노드 ' + (startIdx + 1) + '에서 다익스트라를 시작합니다.</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E.',
                action: function() { renderDist(simDist, startIdx); infoEl.innerHTML = 'dist=[' + initDistStr + ']'; },
                undo: function() { restore(s0); }
            });

            var processOrder = [];
            var td = [];
            for (var ti = 0; ti < nodeCount; ti++) td.push(ti === startIdx ? 0 : INF);
            var tv = [];
            for (var tvi = 0; tvi < nodeCount; tvi++) tv.push(false);
            var th = [[0, startIdx]];
            while (th.length > 0) {
                th.sort(function(a, b) { return a[0] - b[0]; });
                var top = th.shift(), dd = top[0], vv = top[1];
                if (tv[vv]) continue;
                tv[vv] = true;
                var upd = [];
                for (var i = 0; i < adj[vv].length; i++) {
                    var uu = adj[vv][i][0], ww = adj[vv][i][1], nnd = dd + ww;
                    if (nnd < td[uu]) { upd.push({ node: uu, old: td[uu], nw: nnd }); td[uu] = nnd; th.push([nnd, uu]); }
                }
                processOrder.push({ node: vv, dist: dd, updates: upd });
            }

            processOrder.forEach(function(st) {
                (function(v, d, updates) {
                    var sb;
                    steps.push({
                        description: '(' + d + ', ' + NODES[v] + ') 처리: ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ' dist=' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw; }).join(', ') : '갱신 없음'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' 방문 (dist=' + d + ')</strong>';
                        },
                        undo: function() { restore(sb); }
                    });
                })(st.node, st.dist, st.updates);
            });

            // Compute max(dist) for all nodes
            var maxDist = 0;
            var hasUnreachable = false;
            for (var mi = 0; mi < nodeCount; mi++) {
                if (td[mi] === INF) { hasUnreachable = true; break; }
                if (td[mi] > maxDist) maxDist = td[mi];
            }
            var ansStr = hasUnreachable ? '-1 (도달 불가 노드 존재)' : String(maxDist);

            var sf;
            steps.push({
                description: '완료! ' + (hasUnreachable ? '도달 불가능한 노드가 있으므로 답: -1' : 'max(dist) = ' + maxDist + '. 모든 노드가 신호를 받는 시간 = ' + maxDist + '.'),
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">완료! ' + (hasUnreachable ? '답: -1' : 'max(dist)=' + maxDist + ' \u2192 답: ' + maxDist) + '</strong>'; },
                undo: function() { restore(sf); }
            });

            self._initStepController(container, steps, suffix);
        }

        function runFromInputs() {
            var n = parseInt(container.querySelector('#sp-delay-n').value) || DEFAULT_N;
            var k = parseInt(container.querySelector('#sp-delay-k').value) || DEFAULT_K;
            var edgeStr = container.querySelector('#sp-delay-edges').value || DEFAULT_EDGES;
            if (n < 2) n = 2; if (n > 10) n = 10;
            if (k < 1) k = 1; if (k > n) k = n;
            var adj = parseEdges(edgeStr, n);
            buildAndRun(n, adj, k - 1);
        }

        container.querySelector('#sp-delay-reset').addEventListener('click', function() {
            self._clearVizState();
            runFromInputs();
        });

        runFromInputs();
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 최단 경로', desc: '다익스트라와 플로이드-워셜의 기본 구현을 연습합니다 (Gold IV~V)', problemIds: ['boj-1753', 'boj-11404'] },
        { num: 2, title: '최단 경로 응용', desc: '다익스트라를 다양한 상황에 응용합니다 (Gold V ~ Medium)', problemIds: ['boj-1916', 'lc-743'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 기본 최단 경로 =====
        {
            id: 'boj-1753',
            title: 'BOJ 1753 - 최단경로',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1753',
            simIntro: '다익스트라가 정점을 하나씩 처리하며 최단 거리를 확정하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>방향그래프가 주어지면 주어진 시작점에서 다른 모든 정점으로의 최단 경로를 구하는 프로그램을 작성하시오. 단, 모든 간선의 가중치는 10 이하의 자연수이다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 6\n1\n5 1 1\n1 2 2\n1 3 3\n2 3 4\n2 4 5\n3 4 6</pre></div>
                    <div><strong>출력</strong><pre>0\n2\n3\n7\nINF</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ V ≤ 20,000</li>
                    <li>1 ≤ E ≤ 300,000</li>
                    <li>간선 가중치 ≤ 10</li>
                    <li>서로 다른 두 정점 사이에 여러 간선이 존재할 수 있다</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '시작점에서 다른 모든 정점까지 최단 경로를 구해야 해요.<br>일단 떠오르는 건 <strong>BFS</strong>처럼 시작점에서 출발해서 이웃을 하나씩 방문하는 거예요.<br>근데 이 문제는 간선마다 <strong>가중치(비용)</strong>가 달라요. 가중치 없는 BFS는 "한 칸 = 1"이지만, 여기선 간선마다 비용이 다르니까 단순 BFS로는 안 돼요.' },
                { title: '근데 이러면 문제가 있어', content: '가중치가 있는 그래프에서 그냥 BFS를 쓰면, <strong>먼저 도착한 게 최단이 아닐 수 있어요!</strong><br>예를 들어 A→B 비용 10, A→C→B 비용 2+3=5이면, B에 먼저 도착하는 건 직행(10)이지만 실제 최단은 경유(5)에요.<br>그러면 "가장 가까운 정점부터 처리"하는 방법이 필요한데... 이게 바로 <strong>다익스트라 알고리즘</strong>이에요!' },
                { title: '이렇게 하면 어떨까?', content: '<strong>다익스트라</strong>의 핵심: 아직 확정 안 된 정점 중 <strong>거리가 가장 짧은 것</strong>부터 꺼내서 처리해요.<br>① dist 배열을 INF로 초기화하고, 시작점만 0으로 설정<br>② <strong>최소 힙</strong>에 (0, 시작점)을 넣어요<br>③ 힙에서 꺼낸 (거리, 정점)이 이미 확정된 거리보다 크면 → 무시!<br>④ 이웃 정점의 거리를 갱신할 수 있으면 갱신하고 힙에 추가<br>이렇게 하면 O((V+E) log V)로 모든 정점까지의 최단 거리를 구할 수 있어요!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에선 <code>heapq</code> 모듈로 최소 힙을 쓸 수 있어요.<br><code>heapq.heappush(heap, (거리, 정점))</code>으로 넣고, <code>heapq.heappop(heap)</code>으로 가장 가까운 걸 꺼내요.<br>힙이 알아서 거리순 정렬을 유지해주니까, 우리는 그냥 넣고 빼기만 하면 돼요!</span><span class="lang-cpp">C++에선 <code>priority_queue</code>에 <code>greater&lt;pair&lt;int,int&gt;&gt;</code>를 넣어 최소 힙을 만들어요.<br><code>pq.push({거리, 정점})</code>으로 넣고, <code>pq.top()</code> + <code>pq.pop()</code>으로 가장 가까운 걸 꺼내요.<br>C++ priority_queue는 기본이 최대 힙이라 <code>greater</code>를 꼭 써야 최소 힙이 돼요!</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\ndist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nfor i in range(1, V + 1):\n    print(dist[i] if dist[i] != INF else "INF")',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int V, E, K;\n    scanf("%d %d %d", &V, &E, &K);\n    vector<vector<pii>> graph(V + 1);\n    for (int i = 0; i < E; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n\n    vector<int> dist(V + 1, INF);\n    dist[K] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, K});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    for (int i = 1; i <= V; i++) {\n        if (dist[i] == INF) puts("INF");\n        else printf("%d\\n", dist[i]);\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '다익스트라 (최소 힙)',
                description: '시작점에서 heapq를 이용하여 모든 정점까지의 최단 거리를 구합니다.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '인접 리스트로 방향 가중 그래프를 저장합니다.\n각 간선을 (도착정점, 가중치) 튜플로 추가합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: '다익스트라 초기화', desc: '시작점 거리를 0으로 설정하고 최소 힙에 넣습니다.\n나머지는 INF로 초기화하여 "아직 모름" 상태를 표현합니다.', code: 'dist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]' },
                        { title: '다익스트라 실행', desc: '힙에서 가장 가까운 정점을 꺼내 인접 정점을 완화합니다.\nd > dist[v]이면 이미 더 짧은 경로를 찾았으므로 스킵합니다.', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: 'pair<int,int>로 (정점, 가중치) 저장.\ntypedef로 pii 축약.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int V, E, K;\n    scanf("%d %d %d", &V, &E, &K);\n    vector<vector<pii>> graph(V + 1);\n    for (int i = 0; i < E; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }' },
                        { title: '다익스트라 초기화', desc: 'greater<pii> → 최소 힙 (거리 기준).', code: '    vector<int> dist(V + 1, INF);\n    dist[K] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, K});' },
                        { title: '다익스트라 실행', desc: '최소 힙에서 거리가 가장 짧은 정점부터 처리합니다.\nauto [d, v]로 구조적 바인딩하여 거리와 정점을 분리합니다.', code: '    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;  // 이미 더 짧은 경로 발견됨\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-11404',
            title: 'BOJ 11404 - 플로이드',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11404',
            simIntro: '경유지 k를 하나씩 추가하며 거리 행렬이 갱신되는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>n(2 ≤ n ≤ 100)개의 도시가 있다. 그리고 한 도시에서 출발하여 다른 도시에 도착하는 m(1 ≤ m ≤ 100,000)개의 버스가 있다. 각 버스는 한 번 사용할 때 필요한 비용이 있다.</p>
                <p>모든 도시의 쌍 (A, B)에 대해서 도시 A에서 B로 가는데 필요한 비용의 최솟값을 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n14\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n3 5 10\n3 1 8\n1 4 2\n5 1 7\n3 4 2\n5 2 4</pre></div>
                    <div><strong>출력</strong><pre>0 2 3 1 4\n12 0 15 2 5\n8 5 0 1 1\n10 7 13 0 3\n7 4 10 6 0</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ n ≤ 100</li>
                    <li>1 ≤ m ≤ 100,000</li>
                    <li>비용 ≤ 100,000</li>
                    <li>갈 수 없는 경우 0을 출력</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '모든 도시 쌍 (A, B)의 최단 경로를 구해야 해요.<br>일단 떠오르는 건, 각 도시를 시작점으로 해서 <strong>다익스트라를 n번</strong> 돌리는 거예요.<br>도시 1에서 다익스트라, 도시 2에서 다익스트라, ... 도시 n에서 다익스트라. 이러면 모든 쌍의 최단 거리를 구할 수 있어요!' },
                { title: '근데 이러면 문제가 있어', content: '다익스트라를 n번 돌리면 시간 복잡도가 O(n × (n+m) log n)이에요.<br>이 문제는 n ≤ 100으로 작으니까 사실 돌아가긴 하지만... 구현이 복잡해요.<br>n이 이렇게 작으면 <strong>더 간단한 방법</strong>이 있지 않을까?<br>O(n\u00B3) = 100\u00B3 = 1,000,000이면 충분히 빠르거든요!' },
                { title: '이렇게 하면 어떨까?', content: '<strong>플로이드-워셜 알고리즘</strong>은 3중 for문 하나로 모든 쌍의 최단 경로를 구해요!<br>아이디어: "i에서 j로 갈 때, <strong>k를 경유</strong>하면 더 짧아질까?"를 모든 k에 대해 확인해요.<br><code>dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code><br><br>⚠️ 주의할 점 두 가지:<br>① <strong>k(경유지)가 가장 바깥 루프</strong>여야 해요! k→i→j 순서가 핵심이에요.<br>② 같은 출발-도착에 <strong>여러 버스가 있으면 최솟값</strong>만 저장해야 해요!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에선 2차원 리스트를 <code>[[INF] * (n+1) for _ in range(n+1)]</code>로 초기화해요.<br>3중 for문을 돌린 후, INF가 남아있는 칸은 갈 수 없는 경우이므로 <strong>0으로 바꿔서</strong> 출력해요.<br>입출력이 많으니 <code>sys.stdin.readline</code>을 쓰는 게 안전해요!</span><span class="lang-cpp">C++에선 <code>vector&lt;vector&lt;int&gt;&gt; dp(n+1, vector&lt;int&gt;(n+1, INF))</code>로 초기화해요.<br>3중 for문 후 INF는 0으로 바꿔서 출력하면 돼요.<br><code>scanf/printf</code>를 쓰면 입출력 속도가 빨라요!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0\n\nfor _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)\n\nfor k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])\n\nfor i in range(1, n + 1):\n    print(\' \'.join(str(x) if x != INF else \'0\' for x in dp[i][1:n+1]))',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nconst int INF = 1e9;\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    vector<vector<int>> dp(n + 1, vector<int>(n + 1, INF));\n    for (int i = 1; i <= n; i++) dp[i][i] = 0;\n\n    for (int i = 0; i < m; i++) {\n        int a, b, c;\n        scanf("%d %d %d", &a, &b, &c);\n        dp[a][b] = min(dp[a][b], c);\n    }\n\n    for (int k = 1; k <= n; k++)\n        for (int i = 1; i <= n; i++)\n            for (int j = 1; j <= n; j++)\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);\n\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= n; j++) {\n            printf("%d ", dp[i][j] == INF ? 0 : dp[i][j]);\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '플로이드-워셜',
                description: '3중 for문으로 모든 쌍의 최단 거리를 O(N\u00B3)에 구합니다.',
                timeComplexity: 'O(N\u00B3)',
                spaceComplexity: 'O(N\u00B2)',
                codeSteps: {
                    python: [
                        { title: '입력 및 초기화', desc: '2차원 배열을 INF로 채우고, 자기 자신(dp[i][i])은 0으로 설정합니다.\n모든 쌍의 최단 거리를 담을 거리 행렬을 준비합니다.', code: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0' },
                        { title: '간선 입력', desc: '같은 출발-도착에 여러 간선이 있을 수 있으므로\nmin으로 최솟값만 저장합니다.', code: 'for _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)' },
                        { title: '플로이드-워셜 실행', desc: '경유지 k를 하나씩 추가하며 모든 쌍의 거리를 갱신합니다.\nk → i → j 순서가 핵심입니다 (k가 가장 바깥 루프).', code: 'for k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])' }
                    ],
                    cpp: [
                        { title: '입력 및 초기화', desc: 'vector<vector<int>>로 N×N 거리 행렬을 INF로 초기화합니다.\n자기 자신까지의 거리는 0입니다.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nconst int INF = 1e9;\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    vector<vector<int>> dp(n+1, vector<int>(n+1, INF));\n    for (int i = 1; i <= n; i++) dp[i][i] = 0;' },
                        { title: '간선 입력', desc: '같은 출발-도착에 여러 간선 → min으로 최솟값만 저장.', code: '    for (int i = 0; i < m; i++) {\n        int a, b, c;\n        scanf("%d %d %d", &a, &b, &c);\n        dp[a][b] = min(dp[a][b], c);\n    }' },
                        { title: '플로이드-워셜 실행', desc: 'k(경유지) → i(출발) → j(도착) 순서 필수!', code: '    for (int k = 1; k <= n; k++)\n        for (int i = 1; i <= n; i++)\n            for (int j = 1; j <= n; j++)\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 최단 경로 응용 =====
        {
            id: 'boj-1916',
            title: 'BOJ 1916 - 최소비용 구하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1916',
            simIntro: '다익스트라로 출발점에서 도착점까지의 최소 비용을 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 도시가 있다. 그리고 한 도시에서 출발하여 다른 도시에 도착하는 M개의 버스가 있다. 우리는 A번째 도시에서 B번째 도시까지 가는데 드는 버스 비용을 최소화 시키려고 한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5\n8\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n1 5</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>0 ≤ 비용 ≤ 100,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: 'A 도시에서 B 도시까지 가는 <strong>최소 비용</strong>을 구해야 해요.<br>일단 가장 단순하게, A에서 B까지 가능한 <strong>모든 경로</strong>를 탐색해서 비용을 비교하면 어떨까요?<br>DFS로 A에서 출발해서 B에 도착하는 모든 경로의 비용을 구하고, 그 중 최솟값을 찾는 거예요.' },
                { title: '근데 이러면 문제가 있어', content: '모든 경로를 탐색하면 경로 수가 <strong>지수적으로</strong> 늘어나요!<br>도시가 1,000개이고 버스가 100,000개면, 가능한 경로가 어마어마하게 많아서 시간 초과가 나요.<br>이전 문제(1753번)에서 배운 <strong>다익스트라</strong>를 쓰면 훨씬 빠르게 해결할 수 있어요!' },
                { title: '이렇게 하면 어떨까?', content: '1753번과 거의 같은 구조예요! <strong>다익스트라</strong>로 출발 도시 A에서 모든 도시까지의 최단 거리를 구해요.<br>다른 점은 딱 하나: 마지막에 <strong>모든 정점의 거리</strong>를 출력하는 대신, <strong>도착 도시 B의 거리만</strong> 출력하면 끝!<br><br>⚠️ 주의: 같은 출발-도착에 <strong>여러 버스</strong>가 있을 수 있어요.<br>하지만 인접 리스트에 모두 추가하면 다익스트라가 알아서 최솟값을 찾아줘요!' },
                { title: '1753번과 비교하면?', content: '이 문제는 1753번의 <strong>변형</strong>이에요. 핵심 차이를 정리하면:<br><br><table style="border-collapse:collapse;width:100%;font-size:0.9em;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;border:1px solid var(--bg3);">구분</th><th style="padding:6px 10px;border:1px solid var(--bg3);">1753번</th><th style="padding:6px 10px;border:1px solid var(--bg3);">1916번</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">출력</td><td style="padding:6px 10px;border:1px solid var(--bg3);">모든 정점의 dist</td><td style="padding:6px 10px;border:1px solid var(--bg3);">도착 도시 dist[E]만</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">입력 순서</td><td style="padding:6px 10px;border:1px solid var(--bg3);">V, E → 시작점</td><td style="padding:6px 10px;border:1px solid var(--bg3);">N → M → 간선들 → 출발, 도착</td></tr></table><br>다익스트라 코드 자체는 <strong>완전히 동일</strong>하고, 입출력만 다른 거예요!' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\nS, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<pii>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n    int S, E;\n    scanf("%d %d", &S, &E);\n\n    vector<int> dist(N + 1, INF);\n    dist[S] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, S});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    printf("%d\\n", dist[E]);\n    return 0;\n}'
            },
            solutions: [{
                approach: '다익스트라 (특정 도착점)',
                description: '다익스트라를 돌린 뒤 도착 도시의 dist 값만 출력합니다.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N+M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '도시와 버스 정보를 인접 리스트로 저장합니다.\n같은 경로에 여러 버스가 있어도 모두 추가합니다.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: '출발/도착 입력 및 초기화', desc: '출발 도시 S에서 시작하여 도착 도시 E까지의 최소 비용을 구합니다.\n시작점만 0, 나머지는 INF로 초기화합니다.', code: 'S, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]' },
                        { title: '다익스트라 + 출력', desc: '1753번과 동일한 다익스트라를 실행한 뒤,\n도착 도시의 최단 거리 dist[E]만 출력합니다.', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: 'pair<int,int>로 (도착정점, 비용)을 저장하는 인접 리스트를 구성합니다.\ntypedef pii로 타입을 축약하여 코드를 간결하게 합니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<pii>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }' },
                        { title: '출발/도착 입력 및 초기화', desc: 'greater<pii>로 최소 힙을 만들어 거리가 짧은 것부터 꺼냅니다.\n출발 도시 S의 거리를 0으로 설정하고 힙에 삽입합니다.', code: '    int S, E;\n    scanf("%d %d", &S, &E);\n    vector<int> dist(N + 1, INF);\n    dist[S] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, S});' },
                        { title: '다익스트라 + 출력', desc: '다익스트라를 실행한 뒤 도착 도시 E의 최단 거리만 출력합니다.\n구조는 1753번과 동일하고, 출력만 다릅니다.', code: '    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n    printf("%d\\n", dist[E]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[2].templates; }
            }]
        },
        {
            id: 'lc-743',
            title: 'LeetCode 743 - Network Delay Time',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/network-delay-time/',
            simIntro: '다익스트라 결과에서 max(dist)를 구해 답을 도출하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>n개의 노드로 이루어진 네트워크가 있고, 1부터 n까지 번호가 매겨져 있습니다. times[i] = (u<sub>i</sub>, v<sub>i</sub>, w<sub>i</sub>)는 소스 노드 u<sub>i</sub>에서 타겟 노드 v<sub>i</sub>로 신호가 이동하는 데 w<sub>i</sub>의 시간이 걸린다는 것을 의미합니다.</p>
                <p>노드 k에서 신호를 보내면, 모든 n개의 노드가 신호를 받는 데 걸리는 최소 시간을 반환하세요. 모든 노드가 신호를 받을 수 없으면 -1을 반환하세요.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2</pre></div>
                    <div><strong>출력</strong><pre>2</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>times = [[1,2,1]], n = 2, k = 1</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>times = [[1,2,1]], n = 2, k = 2</pre></div>
                    <div><strong>출력</strong><pre>-1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>1 ≤ k ≤ n ≤ 100</li>
                    <li>1 ≤ times.length ≤ 6,000</li>
                    <li>times[i].length == 3</li>
                    <li>1 ≤ u<sub>i</sub>, v<sub>i</sub> ≤ n</li>
                    <li>u<sub>i</sub> ≠ v<sub>i</sub></li>
                    <li>0 ≤ w<sub>i</sub> ≤ 100</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '노드 k에서 신호를 보내면 <strong>모든 노드가 신호를 받는 데 걸리는 시간</strong>을 구해야 해요.<br>일단 가장 직관적인 방법: k에서 모든 노드까지 가능한 경로를 전부 탐색(DFS/BFS)해서, 각 노드에 도달하는 최소 시간을 구하는 거예요.<br>그리고 그 중 가장 큰 값이 "모든 노드가 신호를 받는 시간"이에요.' },
                { title: '근데 이러면 문제가 있어', content: '모든 경로를 탐색하면 중복 방문이 많아져서 느려요!<br>간선이 최대 6,000개이고 가중치가 있으니까, 단순 BFS로도 최단 시간을 보장할 수 없어요.<br>가중치가 있는 그래프에서 한 점 → 모든 점 최단 경로... 이건 <strong>다익스트라</strong>가 딱이에요!' },
                { title: '이렇게 하면 어떨까?', content: '<strong>다익스트라</strong>로 k에서 모든 노드까지의 최단 시간을 구해요. 여기까진 1753번과 같아요!<br><br>그런데 이 문제는 한 가지가 더 있어요: <strong>"모든 노드가 신호를 받는 시간"</strong>이 정답이에요.<br>신호는 동시에 퍼져나가니까, 가장 <strong>늦게 도착하는 노드의 시간 = 전체 시간</strong>이에요.<br>→ dist 배열에서 <strong>최댓값</strong>을 구하면 끝!<br><br>⚠️ 한 가지 더: 도달 불가능한 노드가 있으면(dist가 INF) <strong>-1</strong>을 반환해야 해요.' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">다익스트라 후 <code>max(dist[1:n+1])</code>로 최댓값을 구해요.<br>이 값이 <code>float(\'inf\')</code>이면 도달 불가능한 노드가 있다는 뜻이니까 -1을 반환해요.<br><code>return ans if ans != INF else -1</code> 한 줄로 깔끔하게 처리!</span><span class="lang-cpp">다익스트라 후 <code>*max_element(dist.begin()+1, dist.end())</code>로 최댓값을 구해요.<br>이 값이 INF(1e9)이면 도달 불가능한 노드가 있으므로 -1을 반환해요.<br><code>return ans == INF ? -1 : ans;</code> 삼항 연산자로 간결하게 처리!</span>' }
            ],
            templates: {
                python: 'class Solution:\n    def networkDelayTime(self, times, n, k):\n        import heapq\n        INF = float(\'inf\')\n        graph = [[] for _ in range(n + 1)]\n        for u, v, w in times:\n            graph[u].append((v, w))\n\n        dist = [INF] * (n + 1)\n        dist[k] = 0\n        heap = [(0, k)]\n\n        while heap:\n            d, v = heapq.heappop(heap)\n            if d > dist[v]:\n                continue\n            for u, w in graph[v]:\n                nd = d + w\n                if nd < dist[u]:\n                    dist[u] = nd\n                    heapq.heappush(heap, (nd, u))\n\n        ans = max(dist[1:n+1])\n        return ans if ans != INF else -1',
                cpp: 'class Solution {\npublic:\n    int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n        const int INF = 1e9;\n        vector<vector<pair<int,int>>> graph(n + 1);\n        for (auto& t : times) {\n            graph[t[0]].push_back({t[1], t[2]});\n        }\n\n        vector<int> dist(n + 1, INF);\n        dist[k] = 0;\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n        pq.push({0, k});\n\n        while (!pq.empty()) {\n            auto [d, v] = pq.top(); pq.pop();\n            if (d > dist[v]) continue;\n            for (auto [u, w] : graph[v]) {\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.push({nd, u});\n                }\n            }\n        }\n\n        int ans = *max_element(dist.begin() + 1, dist.end());\n        return ans == INF ? -1 : ans;\n    }\n};'
            },
            solutions: [{
                approach: '다익스트라 + max',
                description: '다익스트라로 모든 노드까지의 최단 거리를 구한 뒤 최댓값을 반환합니다.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: '그래프 구성', desc: 'times 배열에서 인접 리스트를 만듭니다.\n각 간선을 (도착노드, 시간) 튜플로 저장합니다.', code: 'import heapq\nINF = float(\'inf\')\ngraph = [[] for _ in range(n + 1)]\nfor u, v, w in times:\n    graph[u].append((v, w))' },
                        { title: '다익스트라 실행', desc: '시작 노드 k에서 모든 노드까지의 최단 시간을 구합니다.\n표준 다익스트라로 각 노드에 신호가 도달하는 최소 시간을 계산합니다.', code: 'dist = [INF] * (n + 1)\ndist[k] = 0\nheap = [(0, k)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' },
                        { title: '결과 반환', desc: '모든 노드 중 가장 늦게 도착하는 시간이 정답입니다.\nINF가 남아있으면 도달 불가능한 노드가 있으므로 -1을 반환합니다.', code: 'ans = max(dist[1:n+1])\nreturn ans if ans != INF else -1' }
                    ],
                    cpp: [
                        { title: '그래프 구성', desc: 'times 벡터에서 인접 리스트를 구성합니다.\nauto&로 복사 없이 참조하여 성능을 최적화합니다.', code: 'const int INF = 1e9;\nvector<vector<pair<int,int>>> graph(n + 1);\nfor (auto& t : times)\n    graph[t[0]].push_back({t[1], t[2]});' },
                        { title: '다익스트라 실행', desc: 'greater<>로 최소 힙을 구성하여 거리가 짧은 노드부터 처리합니다.\n모든 노드까지의 최단 신호 전달 시간을 계산합니다.', code: 'vector<int> dist(n + 1, INF);\ndist[k] = 0;\npriority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\npq.push({0, k});\n\nwhile (!pq.empty()) {\n    auto [d, v] = pq.top(); pq.pop();\n    if (d > dist[v]) continue;\n    for (auto [u, w] : graph[v]) {\n        int nd = d + w;\n        if (nd < dist[u]) {\n            dist[u] = nd;\n            pq.push({nd, u});\n        }\n    }\n}' },
                        { title: '결과 반환', desc: 'max_element로 dist[1]~dist[n] 중 최대값 확인.', code: 'int ans = *max_element(dist.begin()+1, dist.end());\nreturn ans == INF ? -1 : ans;' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[3].templates; }
            }]
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.shortestpath = shortestPathTopic;
