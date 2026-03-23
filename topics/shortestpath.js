// =========================================================
// 최단 경로 (Shortest Path) 토픽 모듈 — 4탭 시스템
// =========================================================
var shortestPathTopic = {
    id: 'shortestpath',
    title: '최단 경로',
    icon: '🛤️',
    category: '심화 (Gold~Platinum)',
    order: 19,
    description: '가중치 그래프에서 최소 비용 경로를 찾는 알고리즘',
    relatedNote: '이 외에도 벨만-포드(음수 간선), SPFA, A* 탐색 등의 최단 경로 알고리즘이 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-18352':{ type: 'BFS 최단거리',      color: '#00b894',       vizMethod: '_renderVizCityDist' },
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
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — BFS 홉 수 vs 가중치 합</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">같은 그래프에서 BFS(간선 수)와 가중치 합이 어떻게 다른지 확인하세요!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s1-graph" style="display:flex;gap:2rem;align-items:center;justify-content:center;flex-wrap:wrap;min-height:60px;"></div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-top:12px;">\
                            <div id="sp-demo-s1-bfs" style="flex:1;min-width:160px;padding:10px;border-radius:var(--radius);background:var(--bg);"></div>\
                            <div id="sp-demo-s1-wt" style="flex:1;min-width:160px;padding:10px;border-radius:var(--radius);background:var(--bg);"></div>\
                        </div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s1-path1">경로 1: A→B→D</button>\
                        <button class="concept-demo-btn" id="sp-demo-s1-path2">경로 2: A→C→D</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s1-msg">버튼을 눌러 두 경로를 비교하세요! BFS는 간선 수만 세고, 가중치를 무시합니다.</div>\
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
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 완화(Relaxation) 조건 체험</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">간선을 클릭하면 <code>dist[u] + w &lt; dist[v]</code> 조건을 확인하고 거리를 갱신합니다!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s2-dist" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s2-edges" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s2-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;"><button class="concept-demo-btn green" id="sp-demo-s2-reset">↺ 초기화</button></div>\
                    <div class="concept-demo-msg" id="sp-demo-s2-msg">간선 버튼을 클릭해서 완화(relaxation)를 시도하세요! 더 짧은 경로를 발견하면 거리가 갱신됩니다.</div>\
                </div>\
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
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 반복 횟수별 확정 범위</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">"다음 반복"을 누르면 i번째 반복 후 간선 i개 이하인 최단 경로가 확정되는 모습을 봅니다!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s3-nodes" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s3-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s3-next">▶ 다음 반복</button>\
                        <button class="concept-demo-btn green" id="sp-demo-s3-reset">↺ 초기화</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s3-msg">각 반복마다 모든 간선을 한 번씩 확인하여 거리를 갱신합니다. V-1번이면 모든 경로가 확정!</div>\
                </div>\
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
                <div class="concept-demo">\
                    <div class="concept-demo-title">직접 해보기 — 경유지 추가로 거리 단축</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">경유지 K를 하나씩 추가하면서, dp[i][j]가 어떻게 줄어드는지 확인하세요!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s4-table" style="overflow-x:auto;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s4-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s4-next">▶ 다음 경유지 추가</button>\
                        <button class="concept-demo-btn green" id="sp-demo-s4-reset">↺ 초기화</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s4-msg">경유지를 하나씩 추가하면 "직접 가는 것보다 돌아가는 게 빠른 경우"가 발견됩니다!</div>\
                </div>\
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
            <!-- 섹션 5: 데모 — BFS vs 다익스트라 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">5</span> 데모: BFS vs 다익스트라\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 같은 그래프, 다른 결과</div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">그래프: A→B(1), A→C(4), B→C(2), B→D(6), C→D(1)</div>\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--accent);">BFS 결과 <span style="font-size:0.8rem;color:var(--text3);">(간선 수 기준)</span></div>\
                                <div id="sp-demo-bfs-result" style="font-size:0.9rem;color:var(--text2);line-height:1.8;"></div>\
                                <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-top:12px;">\
                                    <button id="sp-demo-bfs-prev" class="concept-demo-btn">← 이전</button>\
                                    <span id="sp-demo-bfs-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>\
                                    <button id="sp-demo-bfs-next" class="concept-demo-btn">다음 →</button>\
                                </div>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--green);">다익스트라 결과 <span style="font-size:0.8rem;color:var(--text3);">(가중치 합 기준)</span></div>\
                                <div id="sp-demo-dij-result" style="font-size:0.9rem;color:var(--text2);line-height:1.8;"></div>\
                                <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-top:12px;">\
                                    <button id="sp-demo-dij-prev" class="concept-demo-btn">← 이전</button>\
                                    <span id="sp-demo-dij-counter" style="font-size:0.85rem;color:var(--text2);">시작 전</span>\
                                    <button id="sp-demo-dij-next" class="concept-demo-btn">다음 →</button>\
                                </div>\
                            </div>\
                        </div>\
                        <div id="sp-demo-compare-log" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-compare-msg">👆 BFS와 다익스트라를 각각 "다음 →"을 눌러 단계별로 비교해보세요!</div>\
                </div>\
            </div>\
\
            <!-- 섹션 6: 데모 — 다익스트라 스텝 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">6</span> 데모: 다익스트라 단계별 실행\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 거리 테이블이 업데이트되는 과정</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-step-next">▶ 다음 스텝</button>\
                        <button class="concept-demo-btn green" id="sp-demo-step-reset">↺ 초기화</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">거리 테이블 (출발: A)</div>\
                        <div id="sp-demo-step-dist" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>\
                        <div id="sp-demo-step-visited" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;"></div>\
                        <div id="sp-demo-step-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-step-msg">👆 "다음 스텝"을 눌러 다익스트라가 한 단계씩 어떻게 동작하는지 확인하세요!</div>\
                </div>\
            </div>\
\
            <!-- 섹션 7: 데모 — 그리디 증명 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">7</span> 데모: 왜 그리디가 동작할까?\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — 가장 가까운 미방문 정점이 최적인 이유</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-greedy-btn">💡 증명 보기</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-greedy-viz" style="font-size:0.9rem;color:var(--text);line-height:2;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-greedy-msg">👆 버튼을 눌러 다익스트라의 그리디 선택이 왜 최적인지 확인하세요!</div>\
                </div>\
            </div>\
\
            <!-- 섹션 8: 데모 — 벨만-포드 완화 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">8</span> 데모: 벨만-포드 완화 과정\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 직접 해보기 — V-1번 반복하며 간선을 완화</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-bf-next">▶ 다음 완화</button>\
                        <button class="concept-demo-btn green" id="sp-demo-bf-reset">↺ 초기화</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">거리 테이블 (출발: A) — 간선: A→B(4), A→C(3), B→D(1), C→B(-2), C→D(5)</div>\
                        <div id="sp-demo-bf-dist" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>\
                        <div id="sp-demo-bf-round" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;"></div>\
                        <div id="sp-demo-bf-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-bf-msg">👆 "다음 완화"를 눌러 벨만-포드가 모든 간선을 반복 완화하는 과정을 확인하세요! 음수 간선(-2)이 있어도 동작합니다.</div>\
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

        // ====== 섹션 1 데모: BFS 홉 수 vs 가중치 합 ======
        (function() {
            var graphEl = container.querySelector('#sp-demo-s1-graph');
            var bfsEl = container.querySelector('#sp-demo-s1-bfs');
            var wtEl = container.querySelector('#sp-demo-s1-wt');
            var msgEl = container.querySelector('#sp-demo-s1-msg');
            if (!graphEl) return;
            var nodeStyle = 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:2px solid var(--accent);font-weight:600;font-size:0.95rem;';
            var edgeStyle = 'font-size:0.8rem;color:var(--text2);';
            graphEl.innerHTML = '<span style="' + nodeStyle + '">A</span>' +
                '<span style="' + edgeStyle + '">—<strong>1</strong>→</span><span style="' + nodeStyle + '">B</span>' +
                '<span style="' + edgeStyle + '">—<strong>7</strong>→</span><span style="' + nodeStyle + '">D</span>' +
                '<br><span style="' + nodeStyle + '">A</span>' +
                '<span style="' + edgeStyle + '">—<strong>3</strong>→</span><span style="' + nodeStyle + '">C</span>' +
                '<span style="' + edgeStyle + '">—<strong>2</strong>→</span><span style="' + nodeStyle + '">D</span>';
            bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (간선 수)</div><div style="font-size:0.85rem;color:var(--text2);">경로를 선택하세요</div>';
            wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">가중치 합</div><div style="font-size:0.85rem;color:var(--text2);">경로를 선택하세요</div>';
            container.querySelector('#sp-demo-s1-path1').addEventListener('click', function() {
                bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (간선 수)</div><div>A→B→D = <strong>2칸</strong></div>';
                wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">가중치 합</div><div>1 + 7 = <strong style="color:var(--red);">8</strong></div>';
                msgEl.textContent = 'BFS는 2칸! 하지만 가중치 합은 8로 비쌉니다. 다른 경로도 확인해보세요!';
            });
            container.querySelector('#sp-demo-s1-path2').addEventListener('click', function() {
                bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (간선 수)</div><div>A→C→D = <strong>2칸</strong></div>';
                wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">가중치 합</div><div>3 + 2 = <strong style="color:var(--green);">5</strong></div>';
                msgEl.textContent = 'BFS도 2칸으로 같은데, 가중치 합은 5로 더 싸다! BFS는 이 차이를 구분 못합니다.';
            });
        })();

        // ====== 섹션 2 데모: 완화 조건 체험 ======
        (function() {
            var distEl = container.querySelector('#sp-demo-s2-dist');
            var edgesEl = container.querySelector('#sp-demo-s2-edges');
            var logEl = container.querySelector('#sp-demo-s2-log');
            if (!distEl) return;
            var nodes = ['A','B','C','D'];
            var edges = [['A','B',1],['A','C',4],['B','C',2],['B','D',6],['C','D',1]];
            var dist;
            function reset() {
                dist = {A:0, B:Infinity, C:Infinity, D:Infinity};
                render();
                logEl.textContent = '간선을 클릭해서 완화를 시도하세요!';
            }
            function render() {
                distEl.innerHTML = nodes.map(function(n) {
                    var v = dist[n] === Infinity ? '∞' : dist[n];
                    var bg = dist[n] === Infinity ? 'var(--bg2)' : 'var(--green)';
                    var c = dist[n] === Infinity ? 'var(--text2)' : '#fff';
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.75rem;color:var(--text2);">dist[' + n + ']</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:' + bg + ';color:' + c + ';font-weight:700;">' + v + '</span></div>';
                }).join('');
                edgesEl.innerHTML = edges.map(function(e, i) {
                    return '<button class="concept-demo-btn sp-s2-edge" data-idx="' + i + '" style="font-size:0.8rem;">' + e[0] + '→' + e[1] + ' (w=' + e[2] + ')</button>';
                }).join('');
                edgesEl.querySelectorAll('.sp-s2-edge').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var idx = parseInt(btn.getAttribute('data-idx'));
                        var e = edges[idx];
                        var u = e[0], v = e[1], w = e[2];
                        if (dist[u] === Infinity) {
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '] = ∞이므로 완화 불가!';
                        } else if (dist[u] + w < dist[v]) {
                            var old = dist[v] === Infinity ? '∞' : dist[v];
                            dist[v] = dist[u] + w;
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '](' + dist[u] + ') + ' + w + ' = ' + (dist[u]) + ' < ' + old + ' → <span style="color:var(--green);">dist[' + v + '] = ' + dist[v] + '으로 갱신!</span>';
                            render();
                        } else {
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '](' + dist[u] + ') + ' + w + ' = ' + (dist[u]+w) + ' ≥ dist[' + v + '](' + dist[v] + ') → 갱신 불필요.';
                        }
                    });
                });
            }
            reset();
            container.querySelector('#sp-demo-s2-reset').addEventListener('click', reset);
        })();

        // ====== 섹션 3 데모: 벨만-포드 반복 횟수별 확정 ======
        (function() {
            var nodesEl = container.querySelector('#sp-demo-s3-nodes');
            var logEl = container.querySelector('#sp-demo-s3-log');
            if (!nodesEl) return;
            var nodes = ['S','A','B','C'];
            var edges = [['S','A',3],['S','B',7],['A','B',2],['A','C',5],['B','C',1]];
            var dist, round;
            function reset() {
                dist = {S:0, A:Infinity, B:Infinity, C:Infinity};
                round = 0;
                render();
                logEl.textContent = '아직 반복 전입니다. "다음 반복"을 눌러보세요!';
            }
            function render() {
                nodesEl.innerHTML = nodes.map(function(n) {
                    var v = dist[n] === Infinity ? '∞' : dist[n];
                    var confirmed = (n === 'S') || (round > 0 && dist[n] !== Infinity);
                    var bg = confirmed ? 'var(--green)' : 'var(--bg2)';
                    var c = confirmed ? '#fff' : 'var(--text2)';
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.75rem;color:var(--text2);">' + n + '</span><span style="display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;background:' + bg + ';color:' + c + ';font-weight:700;font-size:1.1rem;">' + v + '</span></div>';
                }).join('');
            }
            function doRound() {
                if (round >= nodes.length - 1) {
                    logEl.textContent = 'V-1 = ' + (nodes.length - 1) + '번 반복 완료! 모든 최단 거리가 확정되었습니다.';
                    return;
                }
                round++;
                var changed = [];
                edges.forEach(function(e) {
                    var u = e[0], v = e[1], w = e[2];
                    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
                        dist[v] = dist[u] + w;
                        changed.push(v + '=' + dist[v]);
                    }
                });
                render();
                if (changed.length > 0) {
                    logEl.innerHTML = '반복 ' + round + ': 간선 ' + round + '개 이하 최단 경로 확정! 갱신: ' + changed.join(', ');
                } else {
                    logEl.innerHTML = '반복 ' + round + ': 갱신 없음. 이미 모두 확정!';
                }
            }
            reset();
            container.querySelector('#sp-demo-s3-next').addEventListener('click', doRound);
            container.querySelector('#sp-demo-s3-reset').addEventListener('click', reset);
        })();

        // ====== 섹션 4 데모: 플로이드-워셜 경유지 ======
        (function() {
            var tableEl = container.querySelector('#sp-demo-s4-table');
            var logEl = container.querySelector('#sp-demo-s4-log');
            if (!tableEl) return;
            var N = ['1','2','3'];
            var INF = Infinity;
            var initDist = [[0,4,INF],[INF,0,1],[2,INF,0]];
            var dp, kIdx;
            function reset() {
                dp = initDist.map(function(r) { return r.slice(); });
                kIdx = 0;
                renderTable([]);
                logEl.textContent = '아직 경유지를 추가하지 않았습니다. "다음 경유지 추가"를 눌러보세요!';
            }
            function renderTable(highlights) {
                var html = '<table style="border-collapse:collapse;font-size:0.85rem;"><tr><th style="padding:6px 10px;border:1px solid var(--border);background:var(--bg2);">→</th>';
                N.forEach(function(n) { html += '<th style="padding:6px 10px;border:1px solid var(--border);background:var(--bg2);">' + n + '</th>'; });
                html += '</tr>';
                for (var i = 0; i < N.length; i++) {
                    html += '<tr><th style="padding:6px 10px;border:1px solid var(--border);background:var(--bg2);">' + N[i] + '</th>';
                    for (var j = 0; j < N.length; j++) {
                        var v = dp[i][j] === Infinity ? '∞' : dp[i][j];
                        var hl = highlights.some(function(h) { return h[0]===i && h[1]===j; });
                        var bg = hl ? 'var(--yellow)' : 'var(--bg)';
                        html += '<td style="padding:6px 10px;border:1px solid var(--border);text-align:center;font-weight:' + (hl?'700':'400') + ';background:' + bg + ';">' + v + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                tableEl.innerHTML = html;
            }
            function addVia() {
                if (kIdx >= N.length) {
                    logEl.textContent = '모든 경유지(' + N.join(',') + ')를 추가했습니다! 모든 쌍 최단거리가 완성!';
                    return;
                }
                var k = kIdx;
                var changed = [];
                for (var i = 0; i < N.length; i++) {
                    for (var j = 0; j < N.length; j++) {
                        if (dp[i][k] !== Infinity && dp[k][j] !== Infinity && dp[i][k] + dp[k][j] < dp[i][j]) {
                            dp[i][j] = dp[i][k] + dp[k][j];
                            changed.push([i, j]);
                        }
                    }
                }
                kIdx++;
                renderTable(changed);
                if (changed.length > 0) {
                    logEl.innerHTML = '경유지 <strong>' + N[k] + '</strong> 추가! ' + changed.map(function(c) { return N[c[0]] + '→' + N[c[1]] + '=' + dp[c[0]][c[1]]; }).join(', ') + ' 갱신됨!';
                } else {
                    logEl.innerHTML = '경유지 <strong>' + N[k] + '</strong> 추가! 갱신 없음.';
                }
            }
            reset();
            container.querySelector('#sp-demo-s4-next').addEventListener('click', addVia);
            container.querySelector('#sp-demo-s4-reset').addEventListener('click', reset);
        })();

        // ====== 데모 1: BFS vs 다익스트라 ======
        (function() {
            var adj = { A: [['B', 1], ['C', 4]], B: [['C', 2], ['D', 6]], C: [['D', 1]], D: [] };
            var bfsResult = container.querySelector('#sp-demo-bfs-result');
            var dijResult = container.querySelector('#sp-demo-dij-result');
            var logEl = container.querySelector('#sp-demo-compare-log');

            // --- BFS 스텝 계산 ---
            var bfsDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
            var bfsQueue = ['A'];
            var bfsVisited = { A: true };
            var bfsLines = ['A: 거리 0 (시작)'];
            while (bfsQueue.length) {
                var u = bfsQueue.shift();
                adj[u].forEach(function(edge) {
                    var v = edge[0];
                    if (!bfsVisited[v]) {
                        bfsVisited[v] = true;
                        bfsDist[v] = bfsDist[u] + 1;
                        bfsQueue.push(v);
                        bfsLines.push(v + ': 거리 ' + bfsDist[v] + ' (간선 수)');
                    }
                });
            }
            var bfsLogMsg = 'BFS로 A→D: <strong>' + bfsDist['D'] + '칸</strong> (간선 수). 하지만 가중치를 무시합니다!';

            // --- 다익스트라 스텝 계산 ---
            var dijDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
            var dijVisited = {};
            var dijLines = ['A: 거리 0 (시작)'];
            var pq = [[0, 'A']];
            while (pq.length) {
                pq.sort(function(a, b) { return a[0] - b[0]; });
                var cur = pq.shift();
                var d = cur[0], uu = cur[1];
                if (dijVisited[uu]) continue;
                dijVisited[uu] = true;
                adj[uu].forEach(function(edge) {
                    var v = edge[0], w = edge[1];
                    var nd = d + w;
                    if (nd < dijDist[v]) {
                        dijDist[v] = nd;
                        pq.push([nd, v]);
                        dijLines.push(v + ': 거리 ' + nd + ' (경로: via ' + uu + ', 가중치 ' + w + ')');
                    }
                });
            }
            var dijLogMsg = '다익스트라로 A→D: <strong>' + dijDist['D'] + '</strong> (가중치 합: A→B(1)→C(2)→D(1)=4). BFS는 간선 2개라 했지만, 실제 최단 비용은 <strong>4</strong>!';

            // --- BFS 수동 컨트롤 ---
            var bfsCur = -1;
            var bfsPrev = container.querySelector('#sp-demo-bfs-prev');
            var bfsNext = container.querySelector('#sp-demo-bfs-next');
            var bfsCounter = container.querySelector('#sp-demo-bfs-counter');

            function updateBfs() {
                bfsResult.innerHTML = '';
                for (var i = 0; i <= bfsCur; i++) {
                    bfsResult.innerHTML += '<div style="animation:fadeIn 0.3s ease;">' + bfsLines[i] + '</div>';
                }
                if (bfsCur < 0) {
                    bfsCounter.textContent = '시작 전';
                    logEl.innerHTML = '';
                } else {
                    bfsCounter.textContent = (bfsCur + 1) + ' / ' + bfsLines.length;
                    if (bfsCur === bfsLines.length - 1) {
                        logEl.innerHTML = bfsLogMsg;
                    }
                }
            }

            bfsNext.addEventListener('click', function() {
                if (bfsCur < bfsLines.length - 1) { bfsCur++; updateBfs(); }
            });
            bfsPrev.addEventListener('click', function() {
                if (bfsCur >= 0) { bfsCur--; updateBfs(); }
            });

            // --- 다익스트라 수동 컨트롤 ---
            var dijCur = -1;
            var dijPrev = container.querySelector('#sp-demo-dij-prev');
            var dijNext = container.querySelector('#sp-demo-dij-next');
            var dijCounter = container.querySelector('#sp-demo-dij-counter');

            function updateDij() {
                dijResult.innerHTML = '';
                for (var i = 0; i <= dijCur; i++) {
                    dijResult.innerHTML += '<div style="animation:fadeIn 0.3s ease;">' + dijLines[i] + '</div>';
                }
                if (dijCur < 0) {
                    dijCounter.textContent = '시작 전';
                } else {
                    dijCounter.textContent = (dijCur + 1) + ' / ' + dijLines.length;
                    if (dijCur === dijLines.length - 1) {
                        logEl.innerHTML = dijLogMsg;
                    }
                }
            }

            dijNext.addEventListener('click', function() {
                if (dijCur < dijLines.length - 1) { dijCur++; updateDij(); }
            });
            dijPrev.addEventListener('click', function() {
                if (dijCur >= 0) { dijCur--; updateDij(); }
            });
        })();

        // ====== 데모 2: 다익스트라 스텝 ======
        (function() {
            var nodes = ['A', 'B', 'C', 'D', 'E'];
            var adj = { A: [['B', 4], ['C', 2]], B: [['D', 3], ['E', 1]], C: [['B', 1], ['D', 5]], D: [['E', 2]], E: [] };
            var INF = Infinity;
            var dist, visited, stepQueue, stepDone;

            var distEl = container.querySelector('#sp-demo-step-dist');
            var visitedEl = container.querySelector('#sp-demo-step-visited');
            var logEl = container.querySelector('#sp-demo-step-log');
            var nextBtn = container.querySelector('#sp-demo-step-next');
            var resetBtn = container.querySelector('#sp-demo-step-reset');

            function init() {
                dist = { A: 0, B: INF, C: INF, D: INF, E: INF };
                visited = {};
                stepQueue = [[0, 'A']];
                stepDone = false;
                renderDist();
                visitedEl.textContent = '방문 완료: (없음)';
                logEl.textContent = '"다음 스텝"을 눌러 시작하세요!';
                nextBtn.disabled = false;
            }

            function renderDist(highlight) {
                distEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.style.cssText = 'min-width:50px;text-align:center;transition:all 0.3s ease;';
                    var val = dist[n] === INF ? '∞' : dist[n];
                    box.innerHTML = '<div class="str-char-idx" style="font-size:0.7rem;font-weight:700;">' + n + '</div><div class="str-char-val" style="font-size:1rem;">' + val + '</div>';
                    if (visited[n]) {
                        box.style.borderColor = 'var(--green)';
                        box.style.background = 'rgba(0,184,148,0.1)';
                    }
                    if (highlight === n) {
                        box.style.borderColor = 'var(--yellow)';
                        box.style.boxShadow = '0 0 8px var(--yellow)';
                    }
                    distEl.appendChild(box);
                });
            }

            init();

            nextBtn.addEventListener('click', function() {
                if (stepDone || stepQueue.length === 0) {
                    logEl.innerHTML = '<strong style="color:var(--green);">완료!</strong> 모든 정점까지의 최단 거리를 찾았습니다.';
                    nextBtn.disabled = true;
                    return;
                }
                stepQueue.sort(function(a, b) { return a[0] - b[0]; });
                var cur = stepQueue.shift();
                var d = cur[0], u = cur[1];
                if (visited[u]) {
                    logEl.innerHTML = u + '는 이미 방문했으므로 건너뜁니다 (<code>if d > dist[v]: continue</code>)';
                    return;
                }
                visited[u] = true;
                renderDist(u);
                visitedEl.textContent = '방문 완료: {' + Object.keys(visited).join(', ') + '}';
                var updates = [];
                adj[u].forEach(function(edge) {
                    var v = edge[0], w = edge[1];
                    var nd = d + w;
                    if (nd < dist[v]) {
                        dist[v] = nd;
                        stepQueue.push([nd, v]);
                        updates.push(v + ': ' + d + '+' + w + '=' + nd + (nd < (dist[v] === nd ? INF : dist[v]) ? ' (갱신!)' : ''));
                    }
                });
                logEl.innerHTML = '<strong style="color:var(--yellow);">' + u + ' 방문</strong> (거리: ' + d + '). ' +
                    (updates.length ? '이웃 갱신: ' + updates.join(', ') : '갱신할 이웃 없음');

                setTimeout(function() { renderDist(); }, 400);

                if (Object.keys(visited).length === nodes.length) {
                    stepDone = true;
                }
            });

            resetBtn.addEventListener('click', init);
        })();

        // ====== 데모 3: 그리디 증명 ======
        (function() {
            var greedyBtn = container.querySelector('#sp-demo-greedy-btn');
            var vizEl = container.querySelector('#sp-demo-greedy-viz');

            greedyBtn.addEventListener('click', function() {
                var steps = [
                    '<strong>가정:</strong> 현재 미방문 정점 중 거리가 가장 짧은 정점을 u라 하자. dist[u] = d.',
                    '<strong>의문:</strong> "다른 경로로 u에 더 짧게 도달할 수 있을까?"',
                    '<strong>생각해보기:</strong> 다른 경로는 반드시 <span style="color:var(--red);">미방문 정점 w</span>를 경유해야 합니다.',
                    '그런데 dist[w] ≥ dist[u]입니다. <span style="color:var(--accent);">(u가 가장 짧으니까!)</span>',
                    '가중치가 모두 <strong>양수(≥0)</strong>이므로, w를 경유하면 dist[w] + (양수) ≥ dist[u].',
                    '따라서 다른 경로는 dist[u]보다 <strong>길거나 같습니다</strong>.',
                    '<div style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;border-left:3px solid var(--green);"><strong style="color:var(--green);">결론:</strong> 가장 가까운 미방문 정점의 거리는 이미 최적! 그리디 선택이 항상 맞습니다.</div>',
                    '<div style="margin-top:6px;padding:8px 14px;background:rgba(225,112,85,0.1);border-radius:8px;border-left:3px solid var(--red);"><strong style="color:var(--red);">주의:</strong> 음수 가중치가 있으면? dist[w] + (음수)가 dist[u]보다 작을 수 있어 그리디가 실패합니다. 그래서 벨만-포드가 필요합니다!</div>'
                ];
                vizEl.innerHTML = '';
                steps.forEach(function(s, i) {
                    setTimeout(function() {
                        vizEl.innerHTML += '<div style="animation:fadeIn 0.3s ease;padding:3px 0;">' + s + '</div>';
                    }, i * 600);
                });
            });
        })();

        // ====== 데모 4: 벨만-포드 완화 ======
        (function() {
            var nodes = ['A', 'B', 'C', 'D'];
            var edges = [['A', 'B', 4], ['A', 'C', 3], ['B', 'D', 1], ['C', 'B', -2], ['C', 'D', 5]];
            var INF = Infinity;
            var dist, round, edgeIdx, totalRounds;

            var distEl = container.querySelector('#sp-demo-bf-dist');
            var roundEl = container.querySelector('#sp-demo-bf-round');
            var logEl = container.querySelector('#sp-demo-bf-log');
            var nextBtn = container.querySelector('#sp-demo-bf-next');
            var resetBtn = container.querySelector('#sp-demo-bf-reset');

            function init() {
                dist = { A: 0, B: INF, C: INF, D: INF };
                round = 1;
                edgeIdx = 0;
                totalRounds = nodes.length - 1;
                renderDist();
                roundEl.textContent = '라운드: 1 / ' + totalRounds + ' | 간선: 0 / ' + edges.length;
                logEl.textContent = '"다음 완화"를 눌러 시작하세요!';
                nextBtn.disabled = false;
            }

            function renderDist(highlight) {
                distEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.style.cssText = 'min-width:50px;text-align:center;transition:all 0.3s ease;';
                    var val = dist[n] === INF ? '∞' : dist[n];
                    box.innerHTML = '<div class="str-char-idx" style="font-size:0.7rem;font-weight:700;">' + n + '</div><div class="str-char-val" style="font-size:1rem;">' + val + '</div>';
                    if (highlight === n) {
                        box.style.borderColor = 'var(--green)';
                        box.style.boxShadow = '0 0 8px var(--green)';
                    }
                    distEl.appendChild(box);
                });
            }

            init();

            nextBtn.addEventListener('click', function() {
                if (round > totalRounds) {
                    logEl.innerHTML = '<strong style="color:var(--green);">완료!</strong> ' + totalRounds + '라운드 완화 끝. 최종 거리: ' +
                        nodes.map(function(n) { return n + '=' + (dist[n] === INF ? '∞' : dist[n]); }).join(', ');
                    nextBtn.disabled = true;
                    return;
                }
                var e = edges[edgeIdx];
                var u = e[0], v = e[1], w = e[2];
                var relaxed = false;
                if (dist[u] !== INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    relaxed = true;
                    renderDist(v);
                    logEl.innerHTML = '간선 (' + u + '→' + v + ', 가중치 ' + w + '): dist[' + u + ']+' + w + ' = <strong>' + dist[v] + '</strong> < 기존 → <strong style="color:var(--green);">갱신!</strong>';
                } else {
                    renderDist();
                    var reason = dist[u] === INF ? 'dist[' + u + ']=∞이므로 skip' : dist[u] + '+' + w + '=' + (dist[u] + w) + ' ≥ ' + (dist[v] === INF ? '∞' : dist[v]) + ' → 변화 없음';
                    logEl.innerHTML = '간선 (' + u + '→' + v + ', 가중치 ' + w + '): ' + reason;
                }
                edgeIdx++;
                if (edgeIdx >= edges.length) {
                    edgeIdx = 0;
                    round++;
                }
                roundEl.textContent = '라운드: ' + Math.min(round, totalRounds) + ' / ' + totalRounds + ' | 간선: ' + edgeIdx + ' / ' + edges.length;
            });

            resetBtn.addEventListener('click', init);
        })();
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
            self._createStepDesc(suffix) +
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
            description: '초기화: dist[A]=0, 나머지=\u221E — 시작점 거리를 0으로 놓고, 나머지는 아직 모르므로 무한대. 힙에 (0, A)를 넣어 탐색 시작',
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
                    description: '힙에서 (' + d + ', ' + NODES[v] + ') 꺼냄 — <strong>최단 거리 확정</strong>(그리디: 힙 최솟값은 더 줄어들 수 없음). ' +
                        (updates.length > 0 ?
                            '이웃 갱신: ' + updates.map(function(u) {
                                return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.oldDist === INF ? '\u221E' : u.oldDist) + ' \u2192 ' + u.newDist + '(경유가 더 짧으므로)';
                            }).join(', ') :
                            '이웃 중 더 짧은 경로가 없어 갱신 불필요'),
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
            description: '✅ 다익스트라 완료! A=0, B=3, C=2, D=6, E=4 — 모든 노드의 최단 거리가 그리디하게 확정됨',
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

    _createStepDesc: function(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>\u25C0 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 \u25B6</button>' +
            '</div>';
    },

    _initStepController: function(container, steps, suffix) {
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '\u25B6 다음 버튼을 눌러 시작하세요'; }
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

    // ====================================================================
    // 시뮬레이션 0: 특정 거리의 도시 찾기 (boj-18352) — BFS 최단거리
    // ====================================================================
    _renderVizCityDist: function(container) {
        var self = this;
        var suffix = '-citydist';
        var INF = Infinity;

        var DEFAULT_N = 4;
        var DEFAULT_EDGES = '1 2, 1 3, 2 3, 2 4';
        var DEFAULT_K = 2;
        var DEFAULT_START = 1;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">BFS 최단거리: BOJ 18352 예제</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">시작 도시에서 BFS로 각 도시까지의 최단 거리를 구하고, 거리가 K인 도시를 찾습니다.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">도시 수 N: <input type="number" id="sp-cd-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">목표 거리 K: <input type="number" id="sp-cd-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
                '<label style="font-weight:600;">시작 도시 X: <input type="number" id="sp-cd-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">간선 (from to): <input type="text" id="sp-cd-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
                '<button class="btn btn-primary" id="sp-cd-reset">\uD83D\uDD04</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="sp-graph' + suffix + '" style="position:relative;width:100%;min-height:300px;background:var(--bg);border-radius:12px;margin-bottom:8px;overflow:hidden;"></div>' +
            '<div id="sp-dist' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="sp-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var graphEl = container.querySelector('#sp-graph' + suffix);
        var distEl = container.querySelector('#sp-dist' + suffix);
        var infoEl = container.querySelector('#sp-info' + suffix);

        function parseEdges(edgeStr, nodeCount) {
            var adj = [];
            for (var i = 0; i < nodeCount; i++) adj.push([]);
            var parts = edgeStr.split(',');
            for (var p = 0; p < parts.length; p++) {
                var tokens = parts[p].trim().split(/\s+/);
                if (tokens.length >= 2) {
                    var from = parseInt(tokens[0]) - 1;
                    var to = parseInt(tokens[1]) - 1;
                    if (from >= 0 && from < nodeCount && to >= 0 && to < nodeCount) {
                        adj[from].push(to);
                    }
                }
            }
            return adj;
        }

        function getNodePositions(n, width, height) {
            var positions = [];
            var cx = width / 2, cy = height / 2;
            var r = Math.min(width, height) * 0.35;
            for (var i = 0; i < n; i++) {
                var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                positions.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
            }
            return positions;
        }

        function renderGraph(n, adj, dist, currentNode, queueNodes, targetK) {
            var w = graphEl.clientWidth || 400;
            var h = 300;
            graphEl.style.height = h + 'px';
            var pos = getNodePositions(n, w, h);
            var svg = '<svg width="' + w + '" height="' + h + '" style="position:absolute;top:0;left:0;">';

            // 간선 그리기 (방향 화살표)
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < adj[i].length; j++) {
                    var to = adj[i][j];
                    var x1 = pos[i].x, y1 = pos[i].y, x2 = pos[to].x, y2 = pos[to].y;
                    var dx = x2 - x1, dy = y2 - y1;
                    var len = Math.sqrt(dx * dx + dy * dy);
                    if (len === 0) continue;
                    var ux = dx / len, uy = dy / len;
                    // 노드 반지름만큼 줄이기
                    var nr = 22;
                    var sx = x1 + ux * nr, sy = y1 + uy * nr;
                    var ex = x2 - ux * nr, ey = y2 - uy * nr;
                    // 화살표 머리
                    var arrowLen = 10, arrowAngle = Math.PI / 6;
                    var ax1 = ex - arrowLen * Math.cos(Math.atan2(ey - sy, ex - sx) - arrowAngle);
                    var ay1 = ey - arrowLen * Math.sin(Math.atan2(ey - sy, ex - sx) - arrowAngle);
                    var ax2 = ex - arrowLen * Math.cos(Math.atan2(ey - sy, ex - sx) + arrowAngle);
                    var ay2 = ey - arrowLen * Math.sin(Math.atan2(ey - sy, ex - sx) + arrowAngle);
                    svg += '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="var(--text3)" stroke-width="1.5" />';
                    svg += '<polygon points="' + ex + ',' + ey + ' ' + ax1 + ',' + ay1 + ' ' + ax2 + ',' + ay2 + '" fill="var(--text3)" />';
                }
            }

            // 노드 그리기
            for (var ni = 0; ni < n; ni++) {
                var fill = 'var(--bg2)';
                var stroke = 'var(--text3)';
                var textColor = 'var(--text)';
                var glow = '';
                if (currentNode === ni) {
                    fill = 'var(--yellow)'; stroke = 'var(--yellow)'; textColor = '#000';
                    glow = ' filter="url(#glow-yellow)"';
                } else if (dist[ni] !== INF && dist[ni] === targetK) {
                    fill = 'var(--green)'; stroke = 'var(--green)'; textColor = 'white';
                    glow = ' filter="url(#glow-green)"';
                } else if (queueNodes && queueNodes.indexOf(ni) >= 0) {
                    fill = 'var(--accent)'; stroke = 'var(--accent)'; textColor = 'white';
                } else if (dist[ni] !== INF && dist[ni] >= 0) {
                    fill = 'var(--bg3)'; stroke = 'var(--accent)';
                }
                var distLabel = dist[ni] === INF ? '\u221E' : dist[ni];
                svg += '<circle cx="' + pos[ni].x + '" cy="' + pos[ni].y + '" r="20" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"' + glow + ' />';
                svg += '<text x="' + pos[ni].x + '" y="' + (pos[ni].y + 1) + '" text-anchor="middle" dominant-baseline="middle" fill="' + textColor + '" font-weight="600" font-size="14">' + (ni + 1) + '</text>';
                svg += '<text x="' + pos[ni].x + '" y="' + (pos[ni].y + 34) + '" text-anchor="middle" fill="var(--text2)" font-size="11">d=' + distLabel + '</text>';
            }

            // SVG 필터 정의
            svg = svg.replace('<svg ', '<svg ') ;
            var defs = '<defs>' +
                '<filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
                '<filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
                '</defs>';
            svg = svg.replace('</svg>', defs + '</svg>');

            graphEl.innerHTML = svg;
        }

        function renderDistTable(n, dist, targetK) {
            distEl.innerHTML = '';
            for (var i = 0; i < n; i++) {
                var val = dist[i] === INF ? '\u221E' : dist[i];
                var bg = 'background:var(--bg2);';
                if (dist[i] !== INF && dist[i] === targetK) bg = 'background:var(--green);color:white;';
                distEl.innerHTML += '<div style="min-width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;' + bg + '"><div>' + (i + 1) + '</div><div style="font-size:0.85rem;">' + val + '</div></div>';
            }
        }

        function buildAndRun(nodeCount, adj, startIdx, targetK) {
            var simDist = [];
            for (var i = 0; i < nodeCount; i++) simDist.push(INF);
            simDist[startIdx] = 0;

            renderGraph(nodeCount, adj, simDist, -1, [], targetK);
            renderDistTable(nodeCount, simDist, targetK);
            infoEl.innerHTML = '<span style="color:var(--text2);">도시 ' + (startIdx + 1) + '에서 BFS를 시작합니다. 거리 ' + targetK + '인 도시를 찾아봅시다!</span>';

            var steps = [];
            function snapState() { return { d: simDist.slice(), info: infoEl.innerHTML, graph: graphEl.innerHTML, distHtml: distEl.innerHTML }; }
            function restoreState(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; graphEl.innerHTML = s.graph; distEl.innerHTML = s.distHtml; }

            // 초기화 스텝
            var s0 = snapState();
            steps.push({
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E — 시작 도시만 거리 0으로 설정하고 BFS 큐에 넣습니다. 가중치가 없으므로 BFS만으로 최단거리를 구할 수 있습니다.',
                action: function() {
                    renderGraph(nodeCount, adj, simDist, startIdx, [], targetK);
                    renderDistTable(nodeCount, simDist, targetK);
                    infoEl.innerHTML = '큐: [' + (startIdx + 1) + '], dist[' + (startIdx + 1) + ']=0';
                },
                undo: function() { restoreState(s0); }
            });

            // BFS 시뮬레이션: 사전에 모든 스텝을 계산
            var bfsDist = [];
            for (var bi = 0; bi < nodeCount; bi++) bfsDist.push(bi === startIdx ? 0 : INF);
            var queue = [startIdx];
            var bfsSteps = []; // { type: 'dequeue'|'visit', node, neighbor?, dist? }

            while (queue.length > 0) {
                var curr = queue.shift();
                bfsSteps.push({ type: 'dequeue', node: curr, queueAfter: queue.slice() });
                for (var ei = 0; ei < adj[curr].length; ei++) {
                    var nb = adj[curr][ei];
                    if (bfsDist[nb] === INF) {
                        bfsDist[nb] = bfsDist[curr] + 1;
                        queue.push(nb);
                        bfsSteps.push({ type: 'visit', node: curr, neighbor: nb, newDist: bfsDist[nb], queueAfter: queue.slice() });
                    } else {
                        bfsSteps.push({ type: 'skip', node: curr, neighbor: nb, queueAfter: queue.slice() });
                    }
                }
            }

            // BFS 스텝을 시뮬레이션 스텝으로 변환
            bfsSteps.forEach(function(bs) {
                (function(step) {
                    var sb;
                    if (step.type === 'dequeue') {
                        steps.push({
                            description: '큐에서 도시 <strong>' + (step.node + 1) + '</strong>을 꺼냄 (dist=' + simDist[step.node] + ') — 이 도시의 이웃들을 확인합니다. 큐에서 먼저 꺼낸 도시가 거리가 가깝기 때문에 BFS는 최단거리를 보장합니다.',
                            action: function() {
                                sb = snapState();
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                var qStr = step.queueAfter.map(function(x) { return x + 1; }).join(', ');
                                infoEl.innerHTML = '<strong>도시 ' + (step.node + 1) + ' 처리 중</strong> (dist=' + simDist[step.node] + '), 큐: [' + qStr + ']';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    } else if (step.type === 'visit') {
                        steps.push({
                            description: '도시 ' + (step.node + 1) + ' \u2192 도시 <strong>' + (step.neighbor + 1) + '</strong>: 아직 방문하지 않았으므로 dist[' + (step.neighbor + 1) + '] = ' + step.newDist + '로 설정하고 큐에 추가합니다.',
                            action: function() {
                                sb = snapState();
                                simDist[step.neighbor] = step.newDist;
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                var qStr = step.queueAfter.map(function(x) { return x + 1; }).join(', ');
                                infoEl.innerHTML = 'dist[' + (step.neighbor + 1) + '] = ' + step.newDist + ', 큐: [' + qStr + ']';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    } else if (step.type === 'skip') {
                        steps.push({
                            description: '도시 ' + (step.node + 1) + ' \u2192 도시 <strong>' + (step.neighbor + 1) + '</strong>: 이미 방문한 도시이므로 건너뜁니다 (dist[' + (step.neighbor + 1) + ']=' + simDist[step.neighbor] + ', 이미 최단거리 확정).',
                            action: function() {
                                sb = snapState();
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                infoEl.innerHTML = '도시 ' + (step.neighbor + 1) + '은 이미 방문함 — 스킵';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    }
                })(bs);
            });

            // 결과 스텝
            var resultNodes = [];
            for (var ri = 0; ri < nodeCount; ri++) {
                if (bfsDist[ri] === targetK) resultNodes.push(ri + 1);
            }
            var sf;
            steps.push({
                description: '\u2705 BFS 완료! 거리가 ' + targetK + '인 도시: ' + (resultNodes.length > 0 ? '<strong>' + resultNodes.join(', ') + '</strong>' : '<strong>없음 (-1)</strong>') + ' — 모든 도시의 최단 거리가 확정되었습니다.',
                action: function() {
                    sf = snapState();
                    // 최종 상태: dist가 K인 노드를 초록으로 표시
                    for (var fi = 0; fi < nodeCount; fi++) simDist[fi] = bfsDist[fi];
                    renderGraph(nodeCount, adj, simDist, -1, [], targetK);
                    renderDistTable(nodeCount, simDist, targetK);
                    if (resultNodes.length > 0) {
                        infoEl.innerHTML = '<strong style="color:var(--green);">정답: ' + resultNodes.join(', ') + '</strong> (거리 ' + targetK + ')';
                    } else {
                        infoEl.innerHTML = '<strong style="color:var(--red);">정답: -1</strong> (거리 ' + targetK + '인 도시가 없음)';
                    }
                },
                undo: function() { restoreState(sf); }
            });

            self._initStepController(container, steps, suffix);
        }

        function runFromInputs() {
            var n = parseInt(container.querySelector('#sp-cd-n').value) || DEFAULT_N;
            var k = parseInt(container.querySelector('#sp-cd-k').value) || DEFAULT_K;
            var start = parseInt(container.querySelector('#sp-cd-start').value) || DEFAULT_START;
            var edgeStr = container.querySelector('#sp-cd-edges').value || DEFAULT_EDGES;
            if (n < 2) n = 2; if (n > 10) n = 10;
            if (start < 1) start = 1; if (start > n) start = n;
            if (k < 1) k = 1;
            var adj = parseEdges(edgeStr, n);
            buildAndRun(n, adj, start - 1, k);
        }

        container.querySelector('#sp-cd-reset').addEventListener('click', function() {
            self._clearVizState();
            runFromInputs();
        });

        runFromInputs();
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
            self._createStepDesc(suffix) +
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
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E — 시작점만 거리 0, 나머지는 미확정. 힙에 (0, ' + (startIdx + 1) + ')을 넣어 탐색 시작',
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
                        description: '(' + d + ', ' + NODES[v] + ') 꺼냄 — <strong>최단 거리 확정</strong>(힙 최솟값이므로 더 줄어들 수 없음). ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + '(경유가 더 짧음)'; }).join(', ') : '이웃 중 더 짧은 경로 없음'),
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
                description: '✅ 완료! dist = [' + finalDist + '] — 모든 노드의 최단 거리가 그리디하게 확정됨',
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
            self._createStepDesc(suffix) +
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
                description: '초기 상태: 직접 간선만으로 구한 거리 행렬 — 경유지를 거치지 않은 최초 거리',
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
                    var desc = '경유지 k=' + (k + 1) + ' — i→k→j 경유가 직접 경로보다 짧으면 갱신: ';
                    if (updated.length > 0) {
                        desc += updated.map(function(u) {
                            return 'dp[' + (u.i + 1) + '][' + (u.j + 1) + '] ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + '(k 경유가 더 짧음)';
                        }).join(', ');
                    } else {
                        desc += 'k=' + (k + 1) + '을 경유해도 더 짧아지는 경로 없음';
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
                description: '✅ 플로이드-워셜 완료! 모든 노드를 경유지로 시도한 뒤 모든 쌍의 최단 거리가 확정됨',
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
            self._createStepDesc(suffix) +
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
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E — 시작점만 거리 0으로 확정, 나머지는 아직 미확정',
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
                        description: '(' + d + ', ' + NODES[v] + ') 꺼냄 — <strong>최단 거리 확정</strong>(힙 최솟값이므로 더 줄어들 수 없음). ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + '(경유가 더 짧음)'; }).join(', ') : '이웃 중 더 짧은 경로 없음'),
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
                description: '✅ 완료! dist[' + (endIdx + 1) + '] = ' + endDistStr + ' — 시작→도착 최단 경로가 다익스트라로 확정됨',
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
            self._createStepDesc(suffix) +
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
                description: '초기화: dist[' + (startIdx + 1) + ']=0, 나머지=\u221E — 시작점만 거리 0으로 확정, 나머지는 아직 미확정',
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
                        description: '(' + d + ', ' + NODES[v] + ') 꺼냄 — <strong>최단 거리 확정</strong>(힙 최솟값이므로 더 줄어들 수 없음). ' +
                            (updates.length > 0 ? updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + '(경유가 더 짧음)'; }).join(', ') : '이웃 중 더 짧은 경로 없음'),
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
                description: '✅ 완료! ' + (hasUnreachable ? '도달 불가능한 노드가 있으므로 답: -1 — 모든 노드에 도달해야 하지만 불가' : 'max(dist) = ' + maxDist + ' — 가장 먼 노드까지의 최단 거리가 곧 모든 노드에 신호가 도달하는 시간'),
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
        { num: 1, title: 'BFS 최단거리', desc: '가중치 없는 그래프에서 BFS로 최단 거리를 구합니다 (Silver II)', problemIds: ['boj-18352'] },
        { num: 2, title: '다익스트라', desc: '다익스트라 기본 구현과 응용 (Gold IV~V ~ Medium)', problemIds: ['boj-1753', 'boj-1916', 'lc-743'] },
        { num: 3, title: '플로이드-워셜', desc: '모든 쌍 최단 경로 (Gold IV)', problemIds: ['boj-11404'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        {
            id: 'boj-18352',
            title: 'BOJ 18352 - 특정 거리의 도시 찾기',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/18352',
            simIntro: 'BFS로 시작 도시에서 각 도시까지의 최단 거리를 구하고, 거리가 K인 도시를 찾는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>어떤 나라에는 1번부터 N번까지의 도시와 M개의 단방향 도로가 있다. 모든 도로의 거리는 1이다.</p>
                <p>이 때 특정한 도시 X로부터 출발하여 도달할 수 있는 모든 도시 중에서, 최단 거리가 정확히 K인 모든 도시들의 번호를 출력하는 프로그램을 작성하시오. 또한 출발 도시 X에서 출발 도시 X로의 최단 거리는 항상 0이라고 가정한다.</p>
                <p>예를 들어 N=4, K=2, X=1일 때 다음과 같이 그래프가 구성되어 있다고 가정하자.</p>
                <p>이 때 1번 도시에서 출발하여 도달할 수 있는 도시 중에서, 최단 거리가 2인 도시는 4번 도시뿐이다. 2번과 3번 도시의 경우, 최단 거리가 1이기 때문에 출력하지 않는다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 도시의 개수 N, 도로의 개수 M, 거리 정보 K, 출발 도시의 번호 X가 주어진다. (2 ≤ N ≤ 300,000, 1 ≤ M ≤ 1,000,000, 1 ≤ K ≤ 300,000, 1 ≤ X ≤ N) 둘째 줄부터 M개의 줄에 걸쳐서 두 개의 자연수 A, B가 주어지며, A번 도시에서 B번 도시로 이동하는 단방향 도로가 존재한다는 의미이다. 단, A와 B는 서로 다른 자연수이다.</p>
                <h4>출력</h4>
                <p>X로부터 출발하여 도달할 수 있는 도시 중에서, 최단 거리가 정확히 K인 모든 도시의 번호를 한 줄에 하나씩 오름차순으로 출력한다.</p>
                <p>이 때 도달할 수 있는 도시 중에서, 최단 거리가 정확히 K인 도시가 하나도 없으면 -1을 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 4 2 1\n1 2\n1 3\n2 3\n2 4</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4 3 2 1\n1 2\n1 3\n1 4</pre></div>
                    <div><strong>출력</strong><pre>-1</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul>
                    <li>2 ≤ N ≤ 300,000</li>
                    <li>1 ≤ M ≤ 1,000,000</li>
                    <li>1 ≤ K ≤ 300,000</li>
                    <li>1 ≤ X ≤ N</li>
                    <li>모든 도로의 거리는 1</li>
                </ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '시작 도시 X에서 다른 모든 도시까지의 <strong>최단 거리</strong>를 구해야 해요.<br>일단 가장 먼저 떠오르는 건, X에서 출발해서 <strong>모든 경로를 탐색</strong>하는 거예요.<br>DFS로 모든 경로를 시도하고, 각 도시에 도착하는 최소 거리를 기록하면 되지 않을까요?' },
                { title: '근데 이러면 문제가 있어', content: 'DFS로 모든 경로를 탐색하면, <strong>같은 도시를 여러 번</strong> 방문할 수 있어요.<br>N이 최대 300,000이고 M이 1,000,000이면 시간이 엄청 오래 걸려요!<br><br>핵심 관찰: 이 문제의 모든 도로 거리는 <strong>1</strong>이에요.<br>거리가 모두 같다면, <strong>먼저 도착한 게 곧 최단 거리</strong>예요. 이런 상황에서 딱 맞는 알고리즘이 있는데...' },
                { title: '이렇게 하면 어떨까?', content: '<strong>BFS(너비 우선 탐색)</strong>가 정답이에요!<br><br>BFS는 시작점에서 <strong>가까운 순서대로</strong> 탐색하기 때문에, 모든 간선 가중치가 1일 때 최단거리를 보장해요.<br>① dist 배열을 -1(미방문)로 초기화, dist[X] = 0<br>② 큐에 X를 넣고 BFS 시작<br>③ 큐에서 도시를 꺼내서, 아직 방문하지 않은 이웃 도시의 거리를 현재+1로 설정<br>④ BFS 끝나면, dist가 K인 도시를 오름차순으로 출력<br><br>시간 복잡도: O(N + M) — 각 도시와 도로를 한 번씩만 확인!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에선 <code>collections.deque</code>를 BFS 큐로 사용해요.<br><code>deque</code>는 양쪽 끝에서 O(1)으로 넣고 뺄 수 있어서 BFS에 딱이에요.<br>리스트의 <code>pop(0)</code>은 O(N)이라 느리니까, 반드시 <code>deque</code>를 쓰세요!<br>입력이 많으니 <code>sys.stdin.readline</code>도 필수에요.</span><span class="lang-cpp">C++에선 <code>queue&lt;int&gt;</code>를 BFS 큐로 사용해요.<br><code>queue</code>는 FIFO 방식으로 <code>push()</code>와 <code>front()</code>+<code>pop()</code>으로 동작해요.<br>N이 최대 300,000이므로 <code>scanf/printf</code>로 빠른 입출력을 하는 게 안전해요!</span>' }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, K, X = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n\ndist = [-1] * (N + 1)\ndist[X] = 0\nq = deque([X])\n\nwhile q:\n    v = q.popleft()\n    for u in graph[v]:\n        if dist[u] == -1:\n            dist[u] = dist[v] + 1\n            q.append(u)\n\nresult = [i for i in range(1, N + 1) if dist[i] == K]\nif result:\n    for city in result:\n        print(city)\nelse:\n    print(-1)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M, K, X;\n    scanf("%d %d %d %d", &N, &M, &K, &X);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n    }\n\n    vector<int> dist(N + 1, -1);\n    dist[X] = 0;\n    queue<int> q;\n    q.push(X);\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (dist[u] == -1) {\n                dist[u] = dist[v] + 1;\n                q.push(u);\n            }\n        }\n    }\n\n    bool found = false;\n    for (int i = 1; i <= N; i++) {\n        if (dist[i] == K) {\n            printf("%d\\n", i);\n            found = true;\n        }\n    }\n    if (!found) printf("-1\\n");\n    return 0;\n}'
            },
            solutions: [{
                approach: 'BFS 최단거리',
                description: '모든 간선의 가중치가 1이므로 BFS로 최단 거리를 구한 뒤, 거리가 K인 도시를 출력합니다.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: '입력 및 그래프 구성', desc: '인접 리스트로 단방향 그래프를 저장합니다.\nsys.stdin.readline으로 빠른 입력을 받아야 N, M이 클 때 시간 초과를 피할 수 있습니다.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, K, X = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)' },
                        { title: 'BFS로 최단 거리 계산', desc: '모든 간선 가중치가 1이므로 BFS가 곧 최단 거리입니다.\ndist[v]가 -1이면 미방문 → 현재 거리+1로 갱신하고 큐에 추가합니다.\ndeque의 popleft()는 O(1)이라 list의 pop(0)보다 훨씬 빠릅니다.', code: 'dist = [-1] * (N + 1)  # -1 = 미방문\ndist[X] = 0             # 시작점은 거리 0\nq = deque([X])\n\nwhile q:\n    v = q.popleft()     # 큐에서 가장 앞의 도시를 꺼냄\n    for u in graph[v]:  # 이웃 도시 확인\n        if dist[u] == -1:        # 아직 방문하지 않았다면\n            dist[u] = dist[v] + 1  # 거리 = 현재 + 1\n            q.append(u)            # 큐에 추가' },
                        { title: '결과 출력', desc: 'dist가 정확히 K인 도시를 오름차순으로 출력합니다.\n1번부터 N번까지 순서대로 확인하면 자연스럽게 오름차순이 됩니다.\n해당 도시가 없으면 -1을 출력합니다.', code: 'result = [i for i in range(1, N + 1) if dist[i] == K]\nif result:\n    for city in result:\n        print(city)\nelse:\n    print(-1)' }
                    ],
                    cpp: [
                        { title: '입력 및 그래프 구성', desc: 'vector<vector<int>>로 단방향 인접 리스트를 구성합니다.\nN이 최대 300,000이므로 scanf로 빠른 입력을 받습니다.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M, K, X;\n    scanf("%d %d %d %d", &N, &M, &K, &X);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n    }' },
                        { title: 'BFS로 최단 거리 계산', desc: 'queue<int>로 BFS를 수행합니다.\ndist를 -1로 초기화하여 방문 여부와 거리를 동시에 관리합니다.\n방문하지 않은 이웃만 큐에 추가하므로 각 도시는 한 번만 처리됩니다.', code: '    vector<int> dist(N + 1, -1); // -1 = 미방문\n    dist[X] = 0;                  // 시작점 거리 0\n    queue<int> q;\n    q.push(X);\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop(); // 큐에서 꺼냄\n        for (int u : graph[v]) {    // 이웃 확인\n            if (dist[u] == -1) {    // 미방문이면\n                dist[u] = dist[v] + 1; // 거리 갱신\n                q.push(u);             // 큐에 추가\n            }\n        }\n    }' },
                        { title: '결과 출력', desc: '1번부터 N번까지 순회하며 dist가 K인 도시를 출력합니다.\n순서대로 확인하므로 자동으로 오름차순이 보장됩니다.', code: '    bool found = false;\n    for (int i = 1; i <= N; i++) {\n        if (dist[i] == K) {\n            printf("%d\\n", i);\n            found = true;\n        }\n    }\n    if (!found) printf("-1\\n");\n    return 0;\n}' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[0].templates; }
            }]
        },

        // ===== 2단계: 기본 최단 경로 =====,
        {
            id: 'boj-1753',
            title: 'BOJ 1753 - 최단경로',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1753',
            simIntro: '다익스트라가 정점을 하나씩 처리하며 최단 거리를 확정하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>방향그래프가 주어지면 주어진 시작점에서 다른 모든 정점으로의 최단 경로를 구하는 프로그램을 작성하시오. 단, 모든 간선의 가중치는 10 이하의 자연수이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 정점의 개수 V와 간선의 개수 E가 주어진다. (1 ≤ V ≤ 20,000, 1 ≤ E ≤ 300,000) 모든 정점에는 1부터 V까지 번호가 매겨져 있다고 가정한다. 둘째 줄에는 시작 정점의 번호 K(1 ≤ K ≤ V)가 주어진다. 셋째 줄부터 E개의 줄에 걸쳐 각 간선을 나타내는 세 개의 정수 (u, v, w)가 순서대로 주어진다. 이는 u에서 v로 가는 가중치 w인 간선이 존재한다는 뜻이다. u와 v는 서로 다르며 w는 10 이하의 자연수이다. 서로 다른 두 정점 사이에 여러 개의 간선이 존재할 수도 있음에 유의한다.</p>
                <h4>출력</h4>
                <p>첫째 줄부터 V개의 줄에 걸쳐, i번째 줄에 i번 정점으로의 최단 경로의 경로값을 출력한다. 시작점 자신은 0으로 출력하고, 경로가 존재하지 않는 경우에는 INF를 출력하면 된다.</p>
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
                { title: '근데 이러면 문제가 있어', content: '가중치가 있는 그래프에서 그냥 BFS를 쓰면, <strong>먼저 도착한 게 최단이 아닐 수 있어요!</strong><br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;text-align:center;"><div style="font-weight:600;margin-bottom:10px;">BFS가 실패하는 예시</div><div style="position:relative;display:inline-block;"><div style="display:flex;gap:60px;align-items:center;"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">A</div><div style="display:flex;flex-direction:column;gap:24px;"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">B</div><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">C</div></div></div></div><div style="margin-top:8px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;"><span style="padding:3px 10px;background:var(--red);color:#fff;border-radius:4px;">A→B 직행: 비용 10</span><span style="padding:3px 10px;background:var(--green);color:#fff;border-radius:4px;">A→C→B 경유: 2+3 = 5</span></div><div style="margin-top:6px;color:var(--text2);font-size:0.85em;">BFS는 직행(10)을 먼저 찾지만, 실제 최단은 경유(5)!</div></div>그러면 "가장 가까운 정점부터 처리"하는 방법이 필요한데... 이게 바로 <strong>다익스트라 알고리즘</strong>이에요!' },
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
                get templates() { return shortestPathTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1916',
            title: 'BOJ 1916 - 최소비용 구하기',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1916',
            simIntro: '다익스트라로 출발점에서 도착점까지의 최소 비용을 구하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 도시가 있다. 그리고 한 도시에서 출발하여 다른 도시에 도착하는 M개의 버스가 있다. 우리는 A번째 도시에서 B번째 도시까지 가는데 드는 버스 비용을 최소화 시키려고 한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 도시의 개수 N(1 ≤ N ≤ 1,000)이 주어진다. 둘째 줄에는 버스의 개수 M(1 ≤ M ≤ 100,000)이 주어진다. 셋째 줄부터 M+2줄까지 다음과 같은 버스의 정보가 주어진다. 먼저 처음에는 그 버스의 출발 도시의 번호가 주어진다. 그리고 그 다음에는 도착지의 도시 번호가 주어지고 또 그 버스 비용이 주어진다. 버스 비용은 0보다 크거나 같고, 100,000보다 작은 정수이다. 그리고 M+3째 줄에는 우리가 구하고자 하는 구간 출발점의 도시번호와 도착점의 도시번호가 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 출발 도시에서 도착 도시까지 가는데 드는 최소 비용을 출력한다.</p>
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
                get templates() { return shortestPathTopic.problems[3].templates; }
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
                { title: '이렇게 하면 어떨까?', content: '<strong>다익스트라</strong>로 k에서 모든 노드까지의 최단 시간을 구해요. 여기까진 1753번과 같아요!<br><br>그런데 이 문제는 한 가지가 더 있어요: <strong>"모든 노드가 신호를 받는 시간"</strong>이 정답이에요.<br>신호는 동시에 퍼져나가니까, 가장 <strong>늦게 도착하는 노드의 시간 = 전체 시간</strong>이에요.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">다익스트라 후 dist 배열</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">0</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">노드1(k)</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">1</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">노드2</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">1</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">노드3</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;box-shadow:0 0 8px var(--green);">2</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">노드4</div></div></div><div style="text-align:center;margin-top:8px;color:var(--green);font-weight:600;">max(dist) = 2 → 정답!</div></div>→ dist 배열에서 <strong>최댓값</strong>을 구하면 끝!<br><br>⚠️ 한 가지 더: 도달 불가능한 노드가 있으면(dist가 INF) <strong>-1</strong>을 반환해야 해요.' },
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
                get templates() { return shortestPathTopic.problems[4].templates; }
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
                <h4>입력</h4>
                <p>첫째 줄에 도시의 개수 n(2 ≤ n ≤ 100)이 주어지고 둘째 줄에는 버스의 개수 m(1 ≤ m ≤ 100,000)이 주어진다. 그리고 셋째 줄부터 m+2줄까지 다음과 같은 버스의 정보가 주어진다. 먼저 처음에는 그 버스의 출발 도시의 번호가 주어진다. 그리고 그 다음에는 도착지의 도시 번호가 주어지고 또 그 버스 비용이 주어진다. 버스 비용은 0보다 크거나 같고, 100,000보다 작은 정수이다.</p>
                <h4>출력</h4>
                <p>n개의 줄을 출력해야 한다. i번째 줄에 출력하는 j번째 숫자는 도시 i에서 j로 가는데 필요한 최소 비용이다. 만약, i에서 j로 갈 수 없는 경우에는 그 자리에 0을 출력한다.</p>
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
                { title: '이렇게 하면 어떨까?', content: '<strong>플로이드-워셜 알고리즘</strong>은 3중 for문 하나로 모든 쌍의 최단 경로를 구해요!<br>아이디어: "i에서 j로 갈 때, <strong>k를 경유</strong>하면 더 짧아질까?"를 모든 k에 대해 확인해요.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;text-align:center;"><div style="font-weight:600;margin-bottom:8px;">경유지 k를 거치면 더 짧아질까?</div><div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;"><span style="padding:6px 12px;border:2px solid var(--accent);border-radius:50%;font-weight:700;">i</span><span style="color:var(--text2);">——<span style="font-size:0.8em;">dp[i][k]</span>——→</span><span style="padding:6px 12px;border:2px solid var(--yellow);background:var(--warm-bg);border-radius:50%;font-weight:700;">k</span><span style="color:var(--text2);">——<span style="font-size:0.8em;">dp[k][j]</span>——→</span><span style="padding:6px 12px;border:2px solid var(--accent);border-radius:50%;font-weight:700;">j</span></div><div style="margin-top:8px;"><code style="background:var(--bg);padding:4px 10px;border-radius:4px;">dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code></div><div style="margin-top:6px;color:var(--text2);font-size:0.85em;">k=1,2,...,n을 순서대로 경유지로 시도하면 모든 쌍의 최단 경로가 구해짐!</div></div>⚠️ 주의할 점 두 가지:<br>① <strong>k(경유지)가 가장 바깥 루프</strong>여야 해요! k→i→j 순서가 핵심이에요.<br>② 같은 출발-도착에 <strong>여러 버스가 있으면 최솟값</strong>만 저장해야 해요!' },
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
                get templates() { return shortestPathTopic.problems[2].templates; }
            }]
        },

        // ===== 3단계: 최단 경로 응용 =====
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.shortestpath = shortestPathTopic;
