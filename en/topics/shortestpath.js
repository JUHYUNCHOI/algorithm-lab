// =========================================================
// Shortest Path Topic Module — 4-Tab System
// =========================================================
var shortestPathTopic = {
    id: 'shortestpath',
    title: 'Shortest Path',
    icon: '🛤️',
    category: 'Advanced (Gold~Platinum)',
    order: 19,
    description: 'Algorithms for finding minimum-cost paths in weighted graphs',
    relatedNote: 'There are also other shortest path algorithms such as Bellman-Ford (negative edges), SPFA, A* search, and more.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-18352':{ type: 'BFS Shortest Dist',    color: '#00b894',       vizMethod: '_renderVizCityDist' },
        'boj-1753': { type: 'Dijkstra Basics',      color: 'var(--accent)', vizMethod: '_renderVizDijkstra' },
        'boj-11404':{ type: 'Floyd-Warshall',       color: 'var(--green)',  vizMethod: '_renderVizFloyd' },
        'boj-1916': { type: 'Dijkstra Applied',     color: '#e17055',       vizMethod: '_renderVizMinCost' },
        'lc-743':   { type: 'Dijkstra Applied',     color: '#6c5ce7',       vizMethod: '_renderVizDelay' }
    },

    getProblemTabs: function(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent: function(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how shortest path algorithms actually work in action.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
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
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
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

    // ===== Common Tab Renderers =====
    _renderProblemTab: function(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab: function(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
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
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
    renderConcept: function(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>🛤️ Shortest Path</h2>\
                <p class="hero-sub">Learn how to find the minimum-cost route to a destination in weighted graphs!</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> What is a Shortest Path?\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of a car <strong>GPS navigation</strong> system!<br><br>\
                    There are multiple roads from your home to school. Some roads are short, and some are long.<br>\
                    The GPS compares all routes and finds the <strong>fastest (lowest-cost) path</strong>.<br><br>\
                    This is exactly what a <strong>shortest path algorithm</strong> does!<br>\
                    When edges in a graph have <strong>weights (costs)</strong>, it finds the path from source to destination with the <strong>minimum total cost</strong>.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--green)">3</text></svg>\
                        </div>\
                        <h3>Positive Weights</h3>\
                        <p>All edge costs are 0 or greater.<br>Solved using <strong>Dijkstra algorithm</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="30" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="13" y1="19" x2="25" y2="19" stroke="var(--red, #e17055)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--red, #e17055)">-2</text></svg>\
                        </div>\
                        <h3>Negative Weights</h3>\
                        <p>Edge costs can be negative.<br><strong>Bellman-Ford algorithm</strong> is needed.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="10" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="19" cy="30" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="15" y1="10" x2="23" y2="10" stroke="var(--accent)" stroke-width="2"/><line x1="12" y1="15" x2="17" y2="25" stroke="var(--accent)" stroke-width="2"/><line x1="26" y1="15" x2="21" y2="25" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>Single Source</h3>\
                        <p>Find shortest distances from one starting vertex to all others.<br>Dijkstra and Bellman-Ford fall into this category.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--yellow)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--yellow)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--yellow)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--yellow)" stroke-width="1"/><text x="10" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">0</text><text x="21" y="12" text-anchor="middle" font-size="7" fill="var(--yellow)">3</text><text x="10" y="23" text-anchor="middle" font-size="7" fill="var(--yellow)">5</text></svg>\
                        </div>\
                        <h3>All-Pairs Shortest Path</h3>\
                        <p>Find shortest distances between all pairs of vertices.<br><strong>Floyd-Warshall algorithm</strong> falls into this category.</p>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — BFS hop count vs weighted sum</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">See how BFS (edge count) and weighted sum differ on the same graph!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s1-graph" style="display:flex;gap:2rem;align-items:center;justify-content:center;flex-wrap:wrap;min-height:60px;"></div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-top:12px;">\
                            <div id="sp-demo-s1-bfs" style="flex:1;min-width:160px;padding:10px;border-radius:var(--radius);background:var(--bg);"></div>\
                            <div id="sp-demo-s1-wt" style="flex:1;min-width:160px;padding:10px;border-radius:var(--radius);background:var(--bg);"></div>\
                        </div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s1-path1">Path 1: A→B→D</button>\
                        <button class="concept-demo-btn" id="sp-demo-s1-path2">Path 2: A→C→D</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s1-msg">Click a button to compare two paths! BFS only counts edges and ignores weights.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">BFS can also find shortest paths, so why do we need Dijkstra?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        BFS only guarantees shortest paths <strong>when all edge weights are 1</strong>!<br>\
                        If edges have different costs, BFS cannot find the shortest path.<br>\
                        Example: If A to B costs 1 and A to C costs 10, BFS treats both as "1 step."<br>\
                        <strong>When weights differ</strong>, Dijkstra is needed!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> Dijkstra Algorithm\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of "exploring the closest place first"!<br><br>\
                    Imagine you have a neighborhood map. Starting from home, you visit the nearest store first,<br>\
                    then the next closest place, and so on... You always process the <strong>closest unvisited location so far</strong>.<br><br>\
                    This is the core of the Dijkstra algorithm! However, it only works correctly when <strong>all weights are non-negative (0 or greater)</strong>.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--accent)">+</text></svg>\
                        </div>\
                        <h3>Positive Weights Only</h3>\
                        <p>Does not guarantee correct results when edge weights are negative.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="12" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-size="8" font-weight="bold" fill="var(--green)">min</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="2"/><line x1="16" y1="17" x2="12" y2="25" stroke="var(--border)" stroke-width="1.5"/><line x1="22" y1="17" x2="26" y2="25" stroke="var(--border)" stroke-width="1.5"/></svg>\
                        </div>\
                        <h3>Uses Min-Heap (heapq)</h3>\
                        <p>Quickly retrieves the vertex with the shortest distance. Uses a priority queue!<br>\
                        <span class="lang-py"><a href="https://docs.python.org/3/library/heapq.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: heapq ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/priority_queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: priority_queue ↗</a></span></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">O((V+E)</text><text x="19" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--accent)">log V)</text></svg>\
                        </div>\
                        <h3>Time Complexity</h3>\
                        <p>With a priority queue, it runs in O((V+E)logV). Very efficient!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># Dijkstra Algorithm (using min-heap)\
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
                    <pre><code class="language-cpp">// Dijkstra Algorithm (using min-heap)\
\n#include &lt;iostream&gt;\
\n#include &lt;vector&gt;\
\n#include &lt;queue&gt;\
\n#include &lt;climits&gt;\
\nusing namespace std;\
\n\
\nvoid dijkstra(int start, vector&lt;vector&lt;pair&lt;int,int&gt;&gt;&gt;&amp; graph, int N) {\
\n    vector&lt;int&gt; dist(N + 1, INT_MAX);\
\n    // greater&lt;&gt; implements min-heap (same as Python heapq)\
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
                    <div class="concept-demo-title">Try It — Relaxation condition</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Click an edge to check <code>dist[u] + w &lt; dist[v]</code> and update distances!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s2-dist" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s2-edges" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s2-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;"><button class="concept-demo-btn green" id="sp-demo-s2-reset">↺ Reset</button></div>\
                    <div class="concept-demo-msg" id="sp-demo-s2-msg">Click edge buttons to try relaxation! If a shorter path is found, the distance is updated.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In Dijkstra, why is <code>if d > dist[v]: continue</code> needed?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        The same vertex can be pushed to the heap multiple times!<br>\
                        Example: We push (5, B) via A to B cost 5, then later push (3, B) via A to C to B cost 3.<br>\
                        After (3, B) is processed first, when (5, B) comes out, it was already processed via a shorter path, so we <strong>skip</strong> it.<br>\
                        Without this condition, unnecessary computations pile up and slow things down!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> Bellman-Ford Algorithm\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of "checking all roads repeatedly"!<br><br>\
                    Your GPS is broken, so it cannot find the closest place all at once.<br>\
                    Instead, it <strong>goes through every road one round at a time</strong> asking "Is there a shorter path?"<br>\
                    Repeat this <strong>V-1 times</strong> and all shortest paths will be found!<br><br>\
                    Advantage: It works even with <strong>negative weights</strong>.<br>\
                    If distances still decrease on the V-th iteration, a <strong>negative cycle</strong> exists!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="var(--green)">-</text></svg>\
                        </div>\
                        <h3>Negative Weights OK</h3>\
                        <p>Unlike Dijkstra, it works correctly even when edge weights are negative.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--accent)">V-1</text><text x="19" y="30" text-anchor="middle" font-size="9" fill="var(--text2)">rounds</text></svg>\
                        </div>\
                        <h3>V-1 Relaxations</h3>\
                        <p>Iterates over all edges V-1 times, updating (relaxing) distances.<br>\
                        <a href="https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Bellman-Ford algorithm ↗</a></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="26" cy="12" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="19" cy="28" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M16 14 L24 14 M24 16 L21 24 M17 24 L14 16" stroke="var(--red, #e17055)" stroke-width="1.5"/><text x="19" y="37" text-anchor="middle" font-size="7" fill="var(--red, #e17055)">neg cycle</text></svg>\
                        </div>\
                        <h3>Negative Cycle Detection</h3>\
                        <p>If updates still occur on the V-th iteration, a negative cycle exists! O(VE)</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># Bellman-Ford Algorithm\
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
                    <pre><code class="language-cpp">// Bellman-Ford Algorithm\
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
\n    // Relax all edges V-1 times\
\n    for (int i = 0; i &lt; N - 1; i++) {\
\n        for (auto [u, v, w] : edges) {\
\n            if (dist[u] != INT_MAX &amp;&amp; dist[u] + w &lt; dist[v])\
\n                dist[v] = dist[u] + w;\
\n        }\
\n    }\
\n\
\n    // If update occurs on V-th iteration, negative cycle exists\
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
                    <div class="concept-demo-title">Try It — Confirmed range per iteration</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Click "Next Iteration" to see how the i-th iteration confirms shortest paths using at most i edges!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s3-nodes" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s3-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s3-next">▶ Next Iteration</button>\
                        <button class="concept-demo-btn green" id="sp-demo-s3-reset">↺ Reset</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s3-msg">Each iteration scans all edges once to update distances. After V-1 iterations, all paths are confirmed!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Why does repeating V-1 times guarantee finding all shortest paths?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        A shortest path uses at most <strong>V-1 edges</strong> (passing through V vertices).<br>\
                        After 1 iteration, shortest paths with 1 edge are finalized.<br>\
                        After 2 iterations, shortest paths with 2 edges are finalized...<br>\
                        After V-1 iterations, all shortest paths are finalized!<br>\
                        If distances still decrease on the V-th iteration, it means there is a <strong>negative cycle</strong> where costs decrease endlessly as you traverse more edges.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">4</span> Floyd-Warshall Algorithm\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of "adding intermediate stops one by one"!<br><br>\
                    Going directly from New York to Los Angeles takes 5 hours.<br>\
                    But what if you <strong>go via Chicago</strong>? NY to Chicago 2 hours + Chicago to LA 2 hours = 4 hours!<br>\
                    By trying every vertex as a possible intermediate stop, we update whenever a shorter path is found.<br><br>\
                    This finds the shortest paths for <strong>all pairs</strong> at once!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="3" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="4" y1="15" x2="34" y2="15" stroke="var(--accent)" stroke-width="1"/><line x1="4" y1="26" x2="34" y2="26" stroke="var(--accent)" stroke-width="1"/><line x1="15" y1="4" x2="15" y2="34" stroke="var(--accent)" stroke-width="1"/><line x1="26" y1="4" x2="26" y2="34" stroke="var(--accent)" stroke-width="1"/></svg>\
                        </div>\
                        <h3>2D Array dp[i][j]</h3>\
                        <p>dp[i][j] = shortest distance from i to j. Stores all pairs.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="16" text-anchor="middle" font-size="8" fill="var(--accent)">for k</text><text x="19" y="25" text-anchor="middle" font-size="8" fill="var(--accent)">for i</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--accent)">for j</text></svg>\
                        </div>\
                        <h3>Triple Nested Loop</h3>\
                        <p>The intermediate vertex k goes in the outermost loop. The order is crucial!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--accent)">O(V³)</text></svg>\
                        </div>\
                        <h3>Time Complexity O(V³)</h3>\
                        <p>Slow with many vertices, but the code is very simple. Usable when V ≤ 500 or so.<br>\
                        <a href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Floyd-Warshall algorithm ↗</a></p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># Floyd-Warshall Algorithm\
\nINF = float(\'inf\')\
\n\
\n# dp[i][j] = shortest distance from i to j\
\nfor k in range(1, N + 1):       # intermediate\
\n    for i in range(1, N + 1):   # source\
\n        for j in range(1, N + 1):  # destination\
\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// Floyd-Warshall Algorithm\
\nconst int INF = 1e9;\
\n\
\n// dp[i][j] = shortest distance from i to j\
\nfor (int k = 1; k &lt;= N; k++)        // intermediate\
\n    for (int i = 1; i &lt;= N; i++)    // source\
\n        for (int j = 1; j &lt;= N; j++)   // destination\
\n            if (dp[i][k] != INF &amp;&amp; dp[k][j] != INF)\
\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);</code></pre>\
                </div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Shorten distances by adding intermediate vertices</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Add intermediate vertex K one by one and watch dp[i][j] decrease!</p>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-s4-table" style="overflow-x:auto;margin-bottom:8px;"></div>\
                        <div id="sp-demo-s4-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div style="margin-top:8px;">\
                        <button class="concept-demo-btn" id="sp-demo-s4-next">▶ Add Next Intermediate</button>\
                        <button class="concept-demo-btn green" id="sp-demo-s4-reset">↺ Reset</button>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-s4-msg">Adding intermediates reveals cases where going via another vertex is cheaper than the direct path!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In Floyd-Warshall, why must the intermediate vertex k be in the outermost loop?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        With <strong>k in the outer loop</strong>, we progressively expand the set of allowed intermediates: "only vertex 1 as intermediate, then vertices 1 and 2, ... then all vertices," allowing the <strong>DP to update correctly</strong>!<br><br>\
                        If k were in an inner loop, we would use dp[i][k] values that have not been updated yet, producing incorrect results.<br>\
                        The order <strong>must be k, then i, then j</strong>!\
                    </div>\
                </div>\
            </div>\
\
            <!-- Section 5: Demo — BFS vs Dijkstra -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">5</span> Demo: BFS vs Dijkstra\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Same graph, different results</div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Graph: A→B(1), A→C(4), B→C(2), B→D(6), C→D(1)</div>\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--accent);">BFS Result <span style="font-size:0.8rem;color:var(--text3);">(by edge count)</span></div>\
                                <div id="sp-demo-bfs-result" style="font-size:0.9rem;color:var(--text2);line-height:1.8;"></div>\
                                <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-top:12px;">\
                                    <button id="sp-demo-bfs-prev" class="concept-demo-btn">\u2190 Prev</button>\
                                    <span id="sp-demo-bfs-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>\
                                    <button id="sp-demo-bfs-next" class="concept-demo-btn">Next \u2192</button>\
                                </div>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--green);">Dijkstra Result <span style="font-size:0.8rem;color:var(--text3);">(by weight sum)</span></div>\
                                <div id="sp-demo-dij-result" style="font-size:0.9rem;color:var(--text2);line-height:1.8;"></div>\
                                <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-top:12px;">\
                                    <button id="sp-demo-dij-prev" class="concept-demo-btn">\u2190 Prev</button>\
                                    <span id="sp-demo-dij-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>\
                                    <button id="sp-demo-dij-next" class="concept-demo-btn">Next \u2192</button>\
                                </div>\
                            </div>\
                        </div>\
                        <div id="sp-demo-compare-log" style="margin-top:10px;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-compare-msg">👆 Click "Next \u2192" on BFS and Dijkstra to compare them step by step!</div>\
                </div>\
            </div>\
\
            <!-- Section 6: Demo — Dijkstra Step-by-Step -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">6</span> Demo: Dijkstra Step-by-Step\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Watch the distance table update</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-step-next">▶ Next Step</button>\
                        <button class="concept-demo-btn green" id="sp-demo-step-reset">↺ Reset</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Distance Table (start: A)</div>\
                        <div id="sp-demo-step-dist" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>\
                        <div id="sp-demo-step-visited" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;"></div>\
                        <div id="sp-demo-step-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-step-msg">👆 Click "Next Step" to see how Dijkstra works one step at a time!</div>\
                </div>\
            </div>\
\
            <!-- Section 7: Demo — Greedy Proof -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">7</span> Demo: Why Does Greedy Work?\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Why the closest unvisited vertex is optimal</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-greedy-btn">💡 Show Proof</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="sp-demo-greedy-viz" style="font-size:0.9rem;color:var(--text);line-height:2;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-greedy-msg">👆 Click the button to see why Dijkstra\'s greedy choice is always optimal!</div>\
                </div>\
            </div>\
\
            <!-- Section 8: Demo — Bellman-Ford Relaxation -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">8</span> Demo: Bellman-Ford Relaxation Process\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Relax edges V-1 times</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="sp-demo-bf-next">▶ Next Relaxation</button>\
                        <button class="concept-demo-btn green" id="sp-demo-bf-reset">↺ Reset</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Distance Table (start: A) — Edges: A→B(4), A→C(3), B→D(1), C→B(-2), C→D(5)</div>\
                        <div id="sp-demo-bf-dist" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;"></div>\
                        <div id="sp-demo-bf-round" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;"></div>\
                        <div id="sp-demo-bf-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="sp-demo-bf-msg">👆 Click "Next Relaxation" to see Bellman-Ford relax all edges repeatedly! It works even with negative edges (-2).</div>\
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
                    trigger.textContent = answer.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
                });
            }
        });
        container.querySelectorAll('pre code').forEach(function(el) {
            if (window.hljs) hljs.highlightElement(el);
        });

        // ====== Section 1 demo: BFS hop count vs weighted sum ======
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
            bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (edge count)</div><div style="font-size:0.85rem;color:var(--text2);">Select a path</div>';
            wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">Weighted sum</div><div style="font-size:0.85rem;color:var(--text2);">Select a path</div>';
            container.querySelector('#sp-demo-s1-path1').addEventListener('click', function() {
                bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (edge count)</div><div>A→B→D = <strong>2 hops</strong></div>';
                wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">Weighted sum</div><div>1 + 7 = <strong style="color:var(--red);">8</strong></div>';
                msgEl.textContent = 'BFS says 2 hops! But the weighted cost is 8 — expensive. Try the other path!';
            });
            container.querySelector('#sp-demo-s1-path2').addEventListener('click', function() {
                bfsEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">BFS (edge count)</div><div>A→C→D = <strong>2 hops</strong></div>';
                wtEl.innerHTML = '<div style="font-weight:600;margin-bottom:4px;">Weighted sum</div><div>3 + 2 = <strong style="color:var(--green);">5</strong></div>';
                msgEl.textContent = 'BFS also says 2 hops, but the weight sum is only 5 — cheaper! BFS cannot tell the difference.';
            });
        })();

        // ====== Section 2 demo: Relaxation condition ======
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
                logEl.textContent = 'Click an edge to try relaxation!';
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
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '] = ∞, cannot relax!';
                        } else if (dist[u] + w < dist[v]) {
                            var old = dist[v] === Infinity ? '∞' : dist[v];
                            dist[v] = dist[u] + w;
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '](' + dist[u] + ') + ' + w + ' = ' + (dist[u]) + ' < ' + old + ' → <span style="color:var(--green);">dist[' + v + '] = ' + dist[v] + ' updated!</span>';
                            render();
                        } else {
                            logEl.innerHTML = '<strong>' + u + '→' + v + '</strong>: dist[' + u + '](' + dist[u] + ') + ' + w + ' = ' + (dist[u]+w) + ' ≥ dist[' + v + '](' + dist[v] + ') → no update needed.';
                        }
                    });
                });
            }
            reset();
            container.querySelector('#sp-demo-s2-reset').addEventListener('click', reset);
        })();

        // ====== Section 3 demo: Bellman-Ford iterations ======
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
                logEl.textContent = 'No iterations yet. Click "Next Iteration"!';
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
                    logEl.textContent = 'V-1 = ' + (nodes.length - 1) + ' iterations complete! All shortest distances are confirmed.';
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
                    logEl.innerHTML = 'Iteration ' + round + ': Paths with ≤' + round + ' edges confirmed! Updated: ' + changed.join(', ');
                } else {
                    logEl.innerHTML = 'Iteration ' + round + ': No updates. Already confirmed!';
                }
            }
            reset();
            container.querySelector('#sp-demo-s3-next').addEventListener('click', doRound);
            container.querySelector('#sp-demo-s3-reset').addEventListener('click', reset);
        })();

        // ====== Section 4 demo: Floyd-Warshall intermediates ======
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
                logEl.textContent = 'No intermediates added yet. Click "Add Next Intermediate"!';
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
                    logEl.textContent = 'All intermediates (' + N.join(',') + ') added! All-pairs shortest distances complete!';
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
                    logEl.innerHTML = 'Intermediate <strong>' + N[k] + '</strong> added! ' + changed.map(function(c) { return N[c[0]] + '→' + N[c[1]] + '=' + dp[c[0]][c[1]]; }).join(', ') + ' updated!';
                } else {
                    logEl.innerHTML = 'Intermediate <strong>' + N[k] + '</strong> added! No updates.';
                }
            }
            reset();
            container.querySelector('#sp-demo-s4-next').addEventListener('click', addVia);
            container.querySelector('#sp-demo-s4-reset').addEventListener('click', reset);
        })();

        // ====== Demo 1: BFS vs Dijkstra ======
        (function() {
            var adj = { A: [['B', 1], ['C', 4]], B: [['C', 2], ['D', 6]], C: [['D', 1]], D: [] };
            var bfsResult = container.querySelector('#sp-demo-bfs-result');
            var dijResult = container.querySelector('#sp-demo-dij-result');
            var logEl = container.querySelector('#sp-demo-compare-log');

            // --- BFS step calculation ---
            var bfsDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
            var bfsQueue = ['A'];
            var bfsVisited = { A: true };
            var bfsLines = ['A: distance 0 (start)'];
            while (bfsQueue.length) {
                var u = bfsQueue.shift();
                adj[u].forEach(function(edge) {
                    var v = edge[0];
                    if (!bfsVisited[v]) {
                        bfsVisited[v] = true;
                        bfsDist[v] = bfsDist[u] + 1;
                        bfsQueue.push(v);
                        bfsLines.push(v + ': distance ' + bfsDist[v] + ' (edge count)');
                    }
                });
            }
            var bfsLogMsg = 'BFS A\u2192D: <strong>' + bfsDist['D'] + ' hops</strong> (edge count). But it ignores weights!';

            // --- Dijkstra step calculation ---
            var dijDist = { A: 0, B: Infinity, C: Infinity, D: Infinity };
            var dijVisited = {};
            var dijLines = ['A: distance 0 (start)'];
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
                        dijLines.push(v + ': distance ' + nd + ' (path: via ' + uu + ', weight ' + w + ')');
                    }
                });
            }
            var dijLogMsg = 'Dijkstra A\u2192D: <strong>' + dijDist['D'] + '</strong> (weight sum: A\u2192B(1)\u2192C(2)\u2192D(1)=4). BFS said 2 hops, but the actual shortest cost is <strong>4</strong>!';

            // --- BFS manual controls ---
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
                    bfsCounter.textContent = 'Before Start';
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

            // --- Dijkstra manual controls ---
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
                    dijCounter.textContent = 'Before Start';
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

        // ====== Demo 2: Dijkstra Step-by-Step ======
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
                visitedEl.textContent = 'Visited: (none)';
                logEl.textContent = 'Click "Next Step" to start!';
                nextBtn.disabled = false;
            }

            function renderDist(highlight) {
                distEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.style.cssText = 'min-width:50px;text-align:center;transition:all 0.3s ease;';
                    var val = dist[n] === INF ? '\u221E' : dist[n];
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
                    logEl.innerHTML = '<strong style="color:var(--green);">Done!</strong> Found shortest distances to all vertices.';
                    nextBtn.disabled = true;
                    return;
                }
                stepQueue.sort(function(a, b) { return a[0] - b[0]; });
                var cur = stepQueue.shift();
                var d = cur[0], u = cur[1];
                if (visited[u]) {
                    logEl.innerHTML = u + ' was already visited, so we skip it (<code>if d > dist[v]: continue</code>)';
                    return;
                }
                visited[u] = true;
                renderDist(u);
                visitedEl.textContent = 'Visited: {' + Object.keys(visited).join(', ') + '}';
                var updates = [];
                adj[u].forEach(function(edge) {
                    var v = edge[0], w = edge[1];
                    var nd = d + w;
                    if (nd < dist[v]) {
                        dist[v] = nd;
                        stepQueue.push([nd, v]);
                        updates.push(v + ': ' + d + '+' + w + '=' + nd + (nd < (dist[v] === nd ? INF : dist[v]) ? ' (updated!)' : ''));
                    }
                });
                logEl.innerHTML = '<strong style="color:var(--yellow);">Visit ' + u + '</strong> (distance: ' + d + '). ' +
                    (updates.length ? 'Neighbor updates: ' + updates.join(', ') : 'No neighbors to update');

                setTimeout(function() { renderDist(); }, 400);

                if (Object.keys(visited).length === nodes.length) {
                    stepDone = true;
                }
            });

            resetBtn.addEventListener('click', init);
        })();

        // ====== Demo 3: Greedy Proof ======
        (function() {
            var greedyBtn = container.querySelector('#sp-demo-greedy-btn');
            var vizEl = container.querySelector('#sp-demo-greedy-viz');

            greedyBtn.addEventListener('click', function() {
                var steps = [
                    '<strong>Assumption:</strong> Let u be the unvisited vertex with the shortest distance. dist[u] = d.',
                    '<strong>Question:</strong> "Could there be a shorter path to u through another route?"',
                    '<strong>Think about it:</strong> Any other path must go through some <span style="color:var(--red);">unvisited vertex w</span>.',
                    'But dist[w] \u2265 dist[u]. <span style="color:var(--accent);">(Because u has the shortest distance!)</span>',
                    'Since all weights are <strong>non-negative (\u22650)</strong>, going through w gives dist[w] + (positive) \u2265 dist[u].',
                    'Therefore, no other path can be <strong>shorter than dist[u]</strong>.',
                    '<div style="margin-top:8px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;border-left:3px solid var(--green);"><strong style="color:var(--green);">Conclusion:</strong> The closest unvisited vertex\'s distance is already optimal! The greedy choice is always correct.</div>',
                    '<div style="margin-top:6px;padding:8px 14px;background:rgba(225,112,85,0.1);border-radius:8px;border-left:3px solid var(--red);"><strong style="color:var(--red);">Caution:</strong> What about negative weights? dist[w] + (negative) could be less than dist[u], so the greedy approach fails. That\'s why we need Bellman-Ford!</div>'
                ];
                vizEl.innerHTML = '';
                steps.forEach(function(s, i) {
                    setTimeout(function() {
                        vizEl.innerHTML += '<div style="animation:fadeIn 0.3s ease;padding:3px 0;">' + s + '</div>';
                    }, i * 600);
                });
            });
        })();

        // ====== Demo 4: Bellman-Ford Relaxation ======
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
                roundEl.textContent = 'Round: 1 / ' + totalRounds + ' | Edge: 0 / ' + edges.length;
                logEl.textContent = 'Click "Next Relaxation" to start!';
                nextBtn.disabled = false;
            }

            function renderDist(highlight) {
                distEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.style.cssText = 'min-width:50px;text-align:center;transition:all 0.3s ease;';
                    var val = dist[n] === INF ? '\u221E' : dist[n];
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
                    logEl.innerHTML = '<strong style="color:var(--green);">Done!</strong> ' + totalRounds + ' rounds of relaxation complete. Final distances: ' +
                        nodes.map(function(n) { return n + '=' + (dist[n] === INF ? '\u221E' : dist[n]); }).join(', ');
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
                    logEl.innerHTML = 'Edge (' + u + '\u2192' + v + ', weight ' + w + '): dist[' + u + ']+' + w + ' = <strong>' + dist[v] + '</strong> < previous \u2192 <strong style="color:var(--green);">Updated!</strong>';
                } else {
                    renderDist();
                    var reason = dist[u] === INF ? 'dist[' + u + ']=\u221E so skip' : dist[u] + '+' + w + '=' + (dist[u] + w) + ' \u2265 ' + (dist[v] === INF ? '\u221E' : dist[v]) + ' \u2192 no change';
                    logEl.innerHTML = 'Edge (' + u + '\u2192' + v + ', weight ' + w + '): ' + reason;
                }
                edgeIdx++;
                if (edgeIdx >= edges.length) {
                    edgeIdx = 0;
                    round++;
                }
                roundEl.textContent = 'Round: ' + Math.min(round, totalRounds) + ' / ' + totalRounds + ' | Edge: ' + edgeIdx + ' / ' + edges.length;
            });

            resetBtn.addEventListener('click', init);
        })();
    },

    // ===== Visualization Tab (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-sp';
        var NODES = ['A', 'B', 'C', 'D', 'E'];
        var INF = Infinity;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Dijkstra Algorithm Visualization</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finding shortest paths from A in a directed graph with 5 nodes.</p>' +
            '<div id="sp-dist-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' +
            NODES.map(function(n, i) {
                return '<div class="str-char-box" data-node="' + i + '" style="min-width:52px;text-align:center;">' +
                    '<div style="font-weight:700;font-size:0.85rem;">' + n + '</div>' +
                    '<div class="sp-dist-val" style="font-size:1.1rem;font-weight:600;color:var(--accent);">&infin;</div></div>';
            }).join('') +
            '</div>' +
            '<div id="sp-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;">' +
            '<span style="color:var(--text2);">Running Dijkstra starting from A.</span></div>' +
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
            description: 'Initialize: dist[A]=0, rest=\u221E \u2014 start node distance is 0, everything else is unknown (infinity). Push (0, A) to the min-heap to begin exploration.',
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
                    description: 'Pop (' + d + ', ' + NODES[v] + ') from heap \u2014 shortest distance confirmed (greedy: the heap minimum cannot decrease further). ' +
                        (updates.length > 0 ?
                            'Update neighbors: ' + updates.map(function(u) {
                                return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.oldDist === INF ? '\u221E' : u.oldDist) + ' \u2192 ' + u.newDist + ' (going via ' + NODES[v] + ' is shorter)';
                            }).join(', ') :
                            'No neighbors have a shorter path through this node.'),
                    action: function() {
                        snapBefore = saveSnapshot();
                        simVisited.push(v);
                        for (var i = 0; i < updates.length; i++) {
                            simDist[updates[i].node] = updates[i].newDist;
                        }
                        renderDist(simDist, updates.length > 0 ? updates[updates.length - 1].node : -1);
                        var visitedStr = simVisited.map(function(vi) { return NODES[vi]; }).join(', ');
                        infoEl.innerHTML = '<strong>' + NODES[v] + ' visited (dist=' + d + ')</strong>. Visited: {' + visitedStr + '}';
                    },
                    undo: function() { restoreSnapshot(snapBefore); }
                });
            })(v, d, step.updates);
        });

        // Final
        var snapFinal;
        steps.push({
            description: 'Dijkstra complete! A=0, B=3, C=2, D=6, E=4 \u2014 all shortest distances confirmed greedily',
            action: function() {
                snapFinal = saveSnapshot();
                infoEl.innerHTML = '<strong style="color:var(--green);">Done! dist = [0, 3, 2, 6, 4]</strong>';
            },
            undo: function() { restoreSnapshot(snapFinal); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== Visualization State Management =====
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 Click Next to start</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button>' +
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
            if (idx < 0) { indicator.textContent = 'Before start'; desc.textContent = '\u25B6 Click Next to start'; }
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
    // Simulation 0: Find Cities at Specific Distance (boj-18352) — BFS
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
            '<h3 style="margin-bottom:8px;">BFS Shortest Distance: BOJ 18352 Example</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Find shortest distances from a starting city using BFS, then identify cities at distance K.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Cities N: <input type="number" id="sp-cd-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Target dist K: <input type="number" id="sp-cd-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
                '<label style="font-weight:600;">Start city X: <input type="number" id="sp-cd-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Edges (from to): <input type="text" id="sp-cd-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
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

            // Draw directed edges
            for (var i = 0; i < n; i++) {
                for (var j = 0; j < adj[i].length; j++) {
                    var to = adj[i][j];
                    var x1 = pos[i].x, y1 = pos[i].y, x2 = pos[to].x, y2 = pos[to].y;
                    var dx = x2 - x1, dy = y2 - y1;
                    var len = Math.sqrt(dx * dx + dy * dy);
                    if (len === 0) continue;
                    var ux = dx / len, uy = dy / len;
                    var nr = 22;
                    var sx = x1 + ux * nr, sy = y1 + uy * nr;
                    var ex = x2 - ux * nr, ey = y2 - uy * nr;
                    var arrowLen = 10, arrowAngle = Math.PI / 6;
                    var ax1 = ex - arrowLen * Math.cos(Math.atan2(ey - sy, ex - sx) - arrowAngle);
                    var ay1 = ey - arrowLen * Math.sin(Math.atan2(ey - sy, ex - sx) - arrowAngle);
                    var ax2 = ex - arrowLen * Math.cos(Math.atan2(ey - sy, ex - sx) + arrowAngle);
                    var ay2 = ey - arrowLen * Math.sin(Math.atan2(ey - sy, ex - sx) + arrowAngle);
                    svg += '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="var(--text3)" stroke-width="1.5" />';
                    svg += '<polygon points="' + ex + ',' + ey + ' ' + ax1 + ',' + ay1 + ' ' + ax2 + ',' + ay2 + '" fill="var(--text3)" />';
                }
            }

            // Draw nodes
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting BFS from city ' + (startIdx + 1) + '. Let\'s find cities at distance ' + targetK + '!</span>';

            var steps = [];
            function snapState() { return { d: simDist.slice(), info: infoEl.innerHTML, graph: graphEl.innerHTML, distHtml: distEl.innerHTML }; }
            function restoreState(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; graphEl.innerHTML = s.graph; distEl.innerHTML = s.distHtml; }

            // Initialization step
            var s0 = snapState();
            steps.push({
                description: 'Initialize: dist[' + (startIdx + 1) + ']=0, rest=\u221E \u2014 Set starting city distance to 0 and add to BFS queue. Since all edges have weight 1, BFS guarantees shortest distances.',
                action: function() {
                    renderGraph(nodeCount, adj, simDist, startIdx, [], targetK);
                    renderDistTable(nodeCount, simDist, targetK);
                    infoEl.innerHTML = 'Queue: [' + (startIdx + 1) + '], dist[' + (startIdx + 1) + ']=0';
                },
                undo: function() { restoreState(s0); }
            });

            // Pre-compute BFS steps
            var bfsDist = [];
            for (var bi = 0; bi < nodeCount; bi++) bfsDist.push(bi === startIdx ? 0 : INF);
            var queue = [startIdx];
            var bfsSteps = [];

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

            // Convert BFS steps to simulation steps
            bfsSteps.forEach(function(bs) {
                (function(step) {
                    var sb;
                    if (step.type === 'dequeue') {
                        steps.push({
                            description: 'Dequeue city <strong>' + (step.node + 1) + '</strong> (dist=' + simDist[step.node] + ') \u2014 Check its neighbors. BFS guarantees shortest distances because cities dequeued first are closer.',
                            action: function() {
                                sb = snapState();
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                var qStr = step.queueAfter.map(function(x) { return x + 1; }).join(', ');
                                infoEl.innerHTML = '<strong>Processing city ' + (step.node + 1) + '</strong> (dist=' + simDist[step.node] + '), Queue: [' + qStr + ']';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    } else if (step.type === 'visit') {
                        steps.push({
                            description: 'City ' + (step.node + 1) + ' \u2192 City <strong>' + (step.neighbor + 1) + '</strong>: Not yet visited, so set dist[' + (step.neighbor + 1) + '] = ' + step.newDist + ' and add to queue.',
                            action: function() {
                                sb = snapState();
                                simDist[step.neighbor] = step.newDist;
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                var qStr = step.queueAfter.map(function(x) { return x + 1; }).join(', ');
                                infoEl.innerHTML = 'dist[' + (step.neighbor + 1) + '] = ' + step.newDist + ', Queue: [' + qStr + ']';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    } else if (step.type === 'skip') {
                        steps.push({
                            description: 'City ' + (step.node + 1) + ' \u2192 City <strong>' + (step.neighbor + 1) + '</strong>: Already visited, skip (dist[' + (step.neighbor + 1) + ']=' + simDist[step.neighbor] + ', shortest distance already set).',
                            action: function() {
                                sb = snapState();
                                renderGraph(nodeCount, adj, simDist, step.node, step.queueAfter, targetK);
                                renderDistTable(nodeCount, simDist, targetK);
                                infoEl.innerHTML = 'City ' + (step.neighbor + 1) + ' already visited \u2014 skip';
                            },
                            undo: function() { restoreState(sb); }
                        });
                    }
                })(bs);
            });

            // Result step
            var resultNodes = [];
            for (var ri = 0; ri < nodeCount; ri++) {
                if (bfsDist[ri] === targetK) resultNodes.push(ri + 1);
            }
            var sf;
            steps.push({
                description: '\u2705 BFS complete! Cities at distance ' + targetK + ': ' + (resultNodes.length > 0 ? '<strong>' + resultNodes.join(', ') + '</strong>' : '<strong>none (-1)</strong>') + ' \u2014 All shortest distances are finalized.',
                action: function() {
                    sf = snapState();
                    for (var fi = 0; fi < nodeCount; fi++) simDist[fi] = bfsDist[fi];
                    renderGraph(nodeCount, adj, simDist, -1, [], targetK);
                    renderDistTable(nodeCount, simDist, targetK);
                    if (resultNodes.length > 0) {
                        infoEl.innerHTML = '<strong style="color:var(--green);">Answer: ' + resultNodes.join(', ') + '</strong> (distance ' + targetK + ')';
                    } else {
                        infoEl.innerHTML = '<strong style="color:var(--red);">Answer: -1</strong> (no cities at distance ' + targetK + ')';
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
    // Simulation 1: Dijkstra Basics (boj-1753)
    // ====================================================================
    _renderVizDijkstra: function(container) {
        var self = this;
        var suffix = '-dijk';
        var INF = Infinity;

        var DEFAULT_N = 5;
        var DEFAULT_EDGES = '1 2 2, 1 3 3, 2 3 4, 2 4 5, 3 4 6';
        var DEFAULT_START = 1;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Dijkstra: BOJ 1753 Example</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Find shortest distances from a starting vertex to all other vertices.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Nodes: <input type="number" id="sp-dijk-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Start Node: <input type="number" id="sp-dijk-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Edges (from to weight): <input type="text" id="sp-dijk-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting Dijkstra from vertex ' + (startIdx + 1) + '.</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: 'Initialize: dist[' + (startIdx + 1) + ']=0, rest=\u221E \u2014 only the start vertex distance is known (0), all others are unconfirmed. Push (0, ' + (startIdx + 1) + ') to heap to begin.',
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
                        description: 'Pop (' + d + ', ' + NODES[v] + ') \u2014 shortest distance confirmed (heap minimum cannot decrease further). ' +
                            (updates.length > 0 ? 'Update neighbors: ' + updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + ' (going via ' + NODES[v] + ' is shorter)'; }).join(', ') : 'No shorter path through this node'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' visited (dist=' + d + ')</strong>';
                        },
                        undo: function() { restore(sb); }
                    });
                })(st.node, st.dist, st.updates);
            });

            var finalDist = td.map(function(v) { return v === INF ? 'INF' : v; }).join(', ');
            var sf;
            steps.push({
                description: 'Done! dist = [' + finalDist + '] \u2014 all shortest distances confirmed greedily by Dijkstra',
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">Done! dist=[' + finalDist + ']</strong>'; },
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
    // Simulation 2: Floyd-Warshall (boj-11404)
    // ====================================================================
    _renderVizFloyd: function(container) {
        var self = this;
        var suffix = '-floyd';
        var INF = Infinity;

        var DEFAULT_N = 3;
        var DEFAULT_EDGES = '1 2 4, 1 3 11, 2 1 6, 2 3 2, 3 1 3';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Floyd-Warshall: All-Pairs Shortest Path</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Considering intermediate vertex k one by one, updating shortest distances for all pairs.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Nodes: <input type="number" id="sp-floyd-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="8"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Edges (from to weight): <input type="text" id="sp-floyd-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Initial distance matrix.</span>';

            var steps = [];
            var curDp = dp.map(function(r) { return r.slice(); });

            function snapF() { return { dp: curDp.map(function(r) { return r.slice(); }), info: infoEl.innerHTML, grid: gridEl.innerHTML }; }
            function restoreF(s) { curDp = s.dp.map(function(r) { return r.slice(); }); infoEl.innerHTML = s.info; gridEl.innerHTML = s.grid; }

            var s0 = snapF();
            steps.push({
                description: 'Initial state: distance matrix from direct edges only \u2014 no intermediate vertices used yet.',
                action: function() { renderGrid(curDp, -1, -1); infoEl.innerHTML = 'Initial distance matrix'; },
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
                    var desc = 'Intermediate k=' + (k + 1) + ' \u2014 try routing i\u2192k\u2192j; update if shorter than direct path: ';
                    if (updated.length > 0) {
                        desc += updated.map(function(u) {
                            return 'dp[' + (u.i + 1) + '][' + (u.j + 1) + '] ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + ' (via k is shorter)';
                        }).join(', ');
                    } else {
                        desc += 'No path through k=' + (k + 1) + ' is shorter';
                    }
                    var snapDp = curDp.map(function(r) { return r.slice(); });
                    var lastUpd = updated.length > 0 ? updated[updated.length - 1] : null;
                    steps.push({
                        description: desc,
                        action: function() {
                            sb = snapF();
                            curDp = snapDp.map(function(r) { return r.slice(); });
                            renderGrid(curDp, lastUpd ? lastUpd.i : -1, lastUpd ? lastUpd.j : -1);
                            infoEl.innerHTML = '<strong>Intermediate k=' + (k + 1) + ' processed</strong>';
                        },
                        undo: function() { restoreF(sb); }
                    });
                })(k);
            }

            var sfF;
            steps.push({
                description: 'Floyd-Warshall complete! All-pairs shortest distances are finalized after trying every vertex as an intermediate node.',
                action: function() { sfF = snapF(); infoEl.innerHTML = '<strong style="color:var(--green);">Done!</strong>'; },
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
    // Simulation 3: Find Minimum Cost (boj-1916)
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
            '<h3 style="margin-bottom:8px;">Find Minimum Cost: BOJ 1916 Example</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Find the minimum cost from source to destination using Dijkstra.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Nodes: <input type="number" id="sp-mincost-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Start: <input type="number" id="sp-mincost-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
                '<label style="font-weight:600;">End: <input type="number" id="sp-mincost-end" value="' + DEFAULT_END + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Edges (from to weight): <input type="text" id="sp-mincost-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting Dijkstra from vertex ' + (startIdx + 1) + '. Target: vertex ' + (endIdx + 1) + '</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: 'Initialize: dist[' + (startIdx + 1) + ']=0, rest=\u221E \u2014 only the start vertex distance is confirmed (0), all others are unconfirmed.',
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
                        description: 'Pop (' + d + ', ' + NODES[v] + ') \u2014 shortest distance confirmed (heap minimum cannot decrease further). ' +
                            (updates.length > 0 ? 'Update neighbors: ' + updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + ' (going via ' + NODES[v] + ' is shorter)'; }).join(', ') : 'No shorter path through this node'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' visited (dist=' + d + ')</strong>';
                        },
                        undo: function() { restore(sb); }
                    });
                })(st.node, st.dist, st.updates);
            });

            var endDist = td[endIdx];
            var endDistStr = endDist === INF ? 'INF' : endDist;
            var sf;
            steps.push({
                description: 'Done! dist[' + (endIdx + 1) + '] = ' + endDistStr + ' \u2014 shortest path from start to destination confirmed by Dijkstra.',
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">Done! ' + (startIdx + 1) + '\u2192' + (endIdx + 1) + ' min cost = ' + endDistStr + '</strong>'; },
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
    // Simulation 4: Network Delay Time (lc-743)
    // ====================================================================
    _renderVizDelay: function(container) {
        var self = this;
        var suffix = '-delay';
        var INF = Infinity;

        var DEFAULT_N = 4;
        var DEFAULT_K = 2;
        var DEFAULT_EDGES = '2 1 1, 2 3 1, 3 4 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Network Delay Time: LC 743 Example</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Send a signal from the start node. Minimum time for all nodes to receive it = max(dist).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Nodes N: <input type="number" id="sp-delay-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Start Node K: <input type="number" id="sp-delay-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="1"></label>' +
            '</div>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Edges (from to weight): <input type="text" id="sp-delay-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting Dijkstra from node ' + (startIdx + 1) + '.</span>';

            var steps = [];
            function snap() { return { d: simDist.slice(), info: infoEl.innerHTML, html: arrEl.innerHTML }; }
            function restore(s) { simDist = s.d.slice(); infoEl.innerHTML = s.info; arrEl.innerHTML = s.html; }

            var initDistStr = simDist.map(function(v) { return v === INF ? '\u221E' : v; }).join(', ');
            var s0 = snap();
            steps.push({
                description: 'Initialize: dist[' + (startIdx + 1) + ']=0, rest=\u221E \u2014 only the start vertex distance is confirmed (0), all others are unconfirmed.',
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
                        description: 'Pop (' + d + ', ' + NODES[v] + ') \u2014 shortest distance confirmed (heap minimum cannot decrease further). ' +
                            (updates.length > 0 ? 'Update neighbors: ' + updates.map(function(u) { return NODES[v] + '\u2192' + NODES[u.node] + ': ' + (u.old === INF ? '\u221E' : u.old) + '\u2192' + u.nw + ' (going via ' + NODES[v] + ' is shorter)'; }).join(', ') : 'No shorter path through this node'),
                        action: function() {
                            sb = snap();
                            updates.forEach(function(u) { simDist[u.node] = u.nw; });
                            renderDist(simDist, v);
                            infoEl.innerHTML = '<strong>' + NODES[v] + ' visited (dist=' + d + ')</strong>';
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
            var ansStr = hasUnreachable ? '-1 (unreachable node exists)' : String(maxDist);

            var sf;
            steps.push({
                description: 'Done! ' + (hasUnreachable ? 'Unreachable node exists, answer: -1 \u2014 all nodes must be reached but some cannot be' : 'max(dist) = ' + maxDist + ' \u2014 the farthest node determines when all nodes have received the signal'),
                action: function() { sf = snap(); infoEl.innerHTML = '<strong style="color:var(--green);">Done! ' + (hasUnreachable ? 'Answer: -1' : 'max(dist)=' + maxDist + ' \u2192 Answer: ' + maxDist) + '</strong>'; },
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

    // ===== Empty Stub =====
    renderProblem: function(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'BFS Shortest Distance', desc: 'Find shortest distances in unweighted graphs using BFS (Silver II)', problemIds: ['boj-18352'] },
        { num: 2, title: 'Dijkstra', desc: 'Dijkstra basics and applications (Gold IV~V ~ Medium)', problemIds: ['boj-1753', 'boj-1916', 'lc-743'] },
        { num: 3, title: 'Floyd-Warshall', desc: 'All-pairs shortest path (Gold IV)', problemIds: ['boj-11404'] }
    ],

    // ===== Problem List =====
    problems: [
        {
            id: 'boj-18352',
            title: 'BOJ 18352 - Finding Cities at Specific Distance',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/18352',
            simIntro: 'Observe how BFS finds shortest distances from the starting city and identifies cities at distance K.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A country has N cities numbered from 1 to N and M one-way roads. Every road has a distance of 1.</p>
                <p>Write a program that, starting from a specific city X, outputs the numbers of all cities whose shortest distance from X is exactly K. The shortest distance from city X to itself is always 0.</p>
                <p>For example, when N=4, K=2, X=1 with the given graph, the only city at shortest distance 2 from city 1 is city 4. Cities 2 and 3 have shortest distance 1, so they are not included.</p>
                <h4>Input</h4>
                <p>The first line contains the number of cities N, number of roads M, distance K, and starting city X. (2 \u2264 N \u2264 300,000, 1 \u2264 M \u2264 1,000,000, 1 \u2264 K \u2264 300,000, 1 \u2264 X \u2264 N) From the second line, M lines follow with two natural numbers A and B, meaning there is a one-way road from city A to city B. A and B are different natural numbers.</p>
                <h4>Output</h4>
                <p>Output the numbers of all cities whose shortest distance from X is exactly K, one per line in ascending order.</p>
                <p>If no reachable city has shortest distance exactly K, output -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 4 2 1\n1 2\n1 3\n2 3\n2 4</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 3 2 1\n1 2\n1 3\n1 4</pre></div>
                    <div><strong>Output</strong><pre>-1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 \u2264 N \u2264 300,000</li>
                    <li>1 \u2264 M \u2264 1,000,000</li>
                    <li>1 \u2264 K \u2264 300,000</li>
                    <li>1 \u2264 X \u2264 N</li>
                    <li>All roads have distance 1</li>
                </ul>
            `,
            hints: [
                { title: 'First idea that comes to mind', content: 'We need to find the <strong>shortest distance</strong> from starting city X to all other cities.<br>The most intuitive approach is to <strong>explore all paths</strong> from X.<br>Maybe DFS to try every path and record the minimum distance to each city?' },
                { title: 'But there\'s a problem with that', content: 'DFS explores all paths, which means <strong>the same city might be visited multiple times</strong>.<br>With N up to 300,000 and M up to 1,000,000, this would take way too long!<br><br>Key observation: every road in this problem has distance <strong>1</strong>.<br>When all distances are equal, <strong>the first arrival is the shortest distance</strong>. There\'s a perfect algorithm for this situation...' },
                { title: 'How about this approach?', content: '<strong>BFS (Breadth-First Search)</strong> is the answer!<br><br>BFS explores <strong>in order of proximity</strong>, so it guarantees shortest distances when all edge weights are 1.<br>\u2460 Initialize dist array to -1 (unvisited), set dist[X] = 0<br>\u2461 Add X to queue and start BFS<br>\u2462 Dequeue a city, set unvisited neighbors\' distance to current+1<br>\u2463 After BFS, output cities with dist equal to K in ascending order<br><br>Time complexity: O(N + M) \u2014 each city and road checked exactly once!' },
                { title: 'In Python/C++', content: '<span class="lang-py">In Python, use <code>collections.deque</code> as the BFS queue.<br><code>deque</code> supports O(1) append and popleft, perfect for BFS.<br>Using <code>list.pop(0)</code> is O(N) and will be too slow!<br>With large input, <code>sys.stdin.readline</code> is also essential.</span><span class="lang-cpp">In C++, use <code>queue&lt;int&gt;</code> as the BFS queue.<br><code>queue</code> works FIFO with <code>push()</code> and <code>front()</code>+<code>pop()</code>.<br>With N up to 300,000, use <code>scanf/printf</code> for fast I/O.</span>' }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, K, X = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n\ndist = [-1] * (N + 1)\ndist[X] = 0\nq = deque([X])\n\nwhile q:\n    v = q.popleft()\n    for u in graph[v]:\n        if dist[u] == -1:\n            dist[u] = dist[v] + 1\n            q.append(u)\n\nresult = [i for i in range(1, N + 1) if dist[i] == K]\nif result:\n    for city in result:\n        print(city)\nelse:\n    print(-1)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M, K, X;\n    scanf("%d %d %d %d", &N, &M, &K, &X);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n    }\n\n    vector<int> dist(N + 1, -1);\n    dist[X] = 0;\n    queue<int> q;\n    q.push(X);\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (dist[u] == -1) {\n                dist[u] = dist[v] + 1;\n                q.push(u);\n            }\n        }\n    }\n\n    bool found = false;\n    for (int i = 1; i <= N; i++) {\n        if (dist[i] == K) {\n            printf("%d\\n", i);\n            found = true;\n        }\n    }\n    if (!found) printf("-1\\n");\n    return 0;\n}'
            },
            solutions: [{
                approach: 'BFS Shortest Distance',
                description: 'Since all edges have weight 1, use BFS to find shortest distances, then output cities at distance K.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Build Graph', desc: 'Store the directed graph as an adjacency list.\nUse sys.stdin.readline for fast input to avoid TLE with large N and M.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, K, X = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)' },
                        { title: 'BFS for Shortest Distances', desc: 'Since all edge weights are 1, BFS gives shortest distances.\nIf dist[v] is -1, it\'s unvisited \u2014 update to current+1 and enqueue.\ndeque\'s popleft() is O(1), much faster than list\'s pop(0).', code: 'dist = [-1] * (N + 1)  # -1 = unvisited\ndist[X] = 0             # start city at distance 0\nq = deque([X])\n\nwhile q:\n    v = q.popleft()     # dequeue front city\n    for u in graph[v]:  # check neighbors\n        if dist[u] == -1:        # not yet visited\n            dist[u] = dist[v] + 1  # distance = current + 1\n            q.append(u)            # add to queue' },
                        { title: 'Output Result', desc: 'Output cities with dist exactly K in ascending order.\nIterating from 1 to N naturally gives ascending order.\nIf no such city exists, output -1.', code: 'result = [i for i in range(1, N + 1) if dist[i] == K]\nif result:\n    for city in result:\n        print(city)\nelse:\n    print(-1)' }
                    ],
                    cpp: [
                        { title: 'Input & Build Graph', desc: 'Build a directed adjacency list using vector<vector<int>>.\nWith N up to 300,000, use scanf for fast input.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M, K, X;\n    scanf("%d %d %d %d", &N, &M, &K, &X);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n    }' },
                        { title: 'BFS for Shortest Distances', desc: 'Use queue<int> for BFS.\nInitialize dist to -1 to track both visited status and distance.\nOnly unvisited neighbors are enqueued, so each city is processed once.', code: '    vector<int> dist(N + 1, -1); // -1 = unvisited\n    dist[X] = 0;                  // start at distance 0\n    queue<int> q;\n    q.push(X);\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop(); // dequeue\n        for (int u : graph[v]) {    // check neighbors\n            if (dist[u] == -1) {    // unvisited\n                dist[u] = dist[v] + 1; // update distance\n                q.push(u);             // enqueue\n            }\n        }\n    }' },
                        { title: 'Output Result', desc: 'Iterate from 1 to N to output cities at distance K.\nSequential iteration guarantees ascending order automatically.', code: '    bool found = false;\n    for (int i = 1; i <= N; i++) {\n        if (dist[i] == K) {\n            printf("%d\\n", i);\n            found = true;\n        }\n    }\n    if (!found) printf("-1\\n");\n    return 0;\n}' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[0].templates; }
            }]
        },

        // ===== Stage 2: Basic Shortest Path =====,
        {
            id: 'boj-1753',
            title: 'BOJ 1753 - Shortest Path',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1753',
            simIntro: 'Observe how Dijkstra processes vertices one by one, finalizing shortest distances.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a directed graph, write a program that finds the shortest paths from a given starting vertex to all other vertices. All edge weights are natural numbers no greater than 10.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 6\n1\n5 1 1\n1 2 2\n1 3 3\n2 3 4\n2 4 5\n3 4 6</pre></div>
                    <div><strong>Output</strong><pre>0\n2\n3\n7\nINF</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of vertices V and edges E. (1 ≤ V ≤ 20,000, 1 ≤ E ≤ 300,000) All vertices are numbered from 1 to V. The second line contains the starting vertex number K (1 ≤ K ≤ V). From the third line, E lines each contain three integers (u, v, w) representing an edge from u to v with weight w. u and v are different, and w is a natural number no greater than 10. Note that multiple edges can exist between two different vertices.</p>
                <h4>Output</h4>
                <p>Output V lines. The i-th line contains the shortest path distance to vertex i. Output 0 for the starting vertex itself, and INF if no path exists.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ V ≤ 20,000</li>
                    <li>1 ≤ E ≤ 300,000</li>
                    <li>Edge weight ≤ 10</li>
                    <li>Multiple edges can exist between two different vertices</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We need to find shortest paths from the start to all other vertices.<br>The first thing that comes to mind is visiting neighbors one by one like <strong>BFS</strong>.<br>But this problem has different <strong>weights (costs)</strong> on each edge. Unweighted BFS treats every edge as "1 step," so plain BFS will not work here.' },
                { title: 'But there\'s a problem with this', content: 'In a weighted graph, using plain BFS means <strong>arriving first does not guarantee the shortest path!</strong><br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;text-align:center;"><div style="font-weight:600;margin-bottom:10px;">Example where BFS fails</div><div style="position:relative;display:inline-block;"><div style="display:flex;gap:60px;align-items:center;"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">A</div><div style="display:flex;flex-direction:column;gap:24px;"><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">B</div><div style="width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">C</div></div></div></div><div style="margin-top:8px;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;"><span style="padding:3px 10px;background:var(--red);color:#fff;border-radius:4px;">A→B direct: cost 10</span><span style="padding:3px 10px;background:var(--green);color:#fff;border-radius:4px;">A→C→B detour: 2+3 = 5</span></div><div style="margin-top:6px;color:var(--text2);font-size:0.85em;">BFS finds the direct route (10) first, but the actual shortest is the detour (5)!</div></div>So we need a method that "processes the closest vertex first"... and that is exactly <strong>Dijkstra algorithm</strong>!' },
                { title: 'What if we try this?', content: 'The core of <strong>Dijkstra</strong>: always pop the vertex with the <strong>shortest distance</strong> among those not yet finalized.<br>1. Initialize the dist array to INF, set only the start to 0<br>2. Push (0, start) into a <strong>min-heap</strong><br>3. If the (distance, vertex) popped from the heap is greater than the already known distance, skip it!<br>4. If a neighbor vertex distance can be improved, update it and push to the heap<br>This gives us shortest distances to all vertices in O((V+E) log V)!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">In Python, use the <code>heapq</code> module for a min-heap.<br><code>heapq.heappush(heap, (distance, vertex))</code> to insert, and <code>heapq.heappop(heap)</code> to extract the closest.<br>The heap automatically maintains sorted order by distance, so we just push and pop!</span><span class="lang-cpp">In C++, use <code>priority_queue</code> with <code>greater&lt;pair&lt;int,int&gt;&gt;</code> to create a min-heap.<br><code>pq.push({distance, vertex})</code> to insert, and <code>pq.top()</code> + <code>pq.pop()</code> to extract the closest.<br>C++ priority_queue defaults to a max-heap, so you must use <code>greater</code> to make it a min-heap!</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\ndist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nfor i in range(1, V + 1):\n    print(dist[i] if dist[i] != INF else "INF")',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int V, E, K;\n    scanf("%d %d %d", &V, &E, &K);\n    vector<vector<pii>> graph(V + 1);\n    for (int i = 0; i < E; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n\n    vector<int> dist(V + 1, INF);\n    dist[K] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, K});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    for (int i = 1; i <= V; i++) {\n        if (dist[i] == INF) puts("INF");\n        else printf("%d\\n", dist[i]);\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Dijkstra (Min-Heap)',
                description: 'Find shortest distances from the start vertex to all vertices using heapq.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Construction', desc: 'Store the directed weighted graph as an adjacency list.\nEach edge is added as a (destination, weight) tuple.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nV, E = map(int, input().split())\nK = int(input())\ngraph = [[] for _ in range(V + 1)]\nfor _ in range(E):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: 'Dijkstra Initialization', desc: 'Set start vertex distance to 0 and push it to the min-heap.\nInitialize all others to INF to represent "unknown" state.', code: 'dist = [INF] * (V + 1)\ndist[K] = 0\nheap = [(0, K)]' },
                        { title: 'Run Dijkstra', desc: 'Pop the closest vertex from the heap and relax adjacent vertices.\nIf d > dist[v], a shorter path was already found, so skip.', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Construction', desc: 'Store (vertex, weight) as pair<int,int>.\ntypedef pii for brevity.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int V, E, K;\n    scanf("%d %d %d", &V, &E, &K);\n    vector<vector<pii>> graph(V + 1);\n    for (int i = 0; i < E; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }' },
                        { title: 'Dijkstra Initialization', desc: 'greater<pii> creates a min-heap (by distance).', code: '    vector<int> dist(V + 1, INF);\n    dist[K] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, K});' },
                        { title: 'Run Dijkstra', desc: 'Process vertices with shortest distance first from the min-heap.\nauto [d, v] uses structured bindings to separate distance and vertex.', code: '    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;  // shorter path already found\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1916',
            title: 'BOJ 1916 - Find Minimum Cost',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1916',
            simIntro: 'Observe how Dijkstra finds the minimum cost from source to destination.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There are N cities. There are M buses, each departing from one city and arriving at another. We want to minimize the bus cost of traveling from city A to city B.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n8\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n1 5</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of cities N (1 ≤ N ≤ 1,000). The second line contains the number of buses M (1 ≤ M ≤ 100,000). From the third line to the (M+2)-th line, each line contains a bus's departure city, arrival city, and cost. The bus cost is a non-negative integer no greater than 100,000. The (M+3)-th line contains the departure city and destination city numbers.</p>
                <h4>Output</h4>
                <p>Output the minimum cost of traveling from the departure city to the destination city.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>0 ≤ Cost ≤ 100,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We need to find the <strong>minimum cost</strong> from city A to city B.<br>The simplest approach: search <strong>all possible paths</strong> from A to B and compare their costs.<br>Use DFS starting from A, compute costs for every path reaching B, and find the minimum.' },
                { title: 'But there\'s a problem with this', content: 'Searching all paths causes the number of paths to grow <strong>exponentially</strong>!<br>With 1,000 cities and 100,000 buses, there are astronomically many possible paths, resulting in a time limit exceeded.<br>Using <strong>Dijkstra</strong> from the previous problem (1753) solves this much more efficiently!' },
                { title: 'What if we try this?', content: 'Almost the same structure as problem 1753! Use <strong>Dijkstra</strong> to find shortest distances from departure city A to all cities.<br>The only difference: instead of printing <strong>distances to all vertices</strong>, just print <strong>the distance to destination city B</strong>!<br><br>Note: There can be <strong>multiple buses</strong> for the same source-destination pair.<br>But if you add them all to the adjacency list, Dijkstra automatically finds the minimum!' },
                { title: 'Compared to problem 1753?', content: 'This problem is a <strong>variation</strong> of 1753. Here are the key differences:<br><br><table style="border-collapse:collapse;width:100%;font-size:0.9em;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;border:1px solid var(--bg3);">Aspect</th><th style="padding:6px 10px;border:1px solid var(--bg3);">1753</th><th style="padding:6px 10px;border:1px solid var(--bg3);">1916</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">Output</td><td style="padding:6px 10px;border:1px solid var(--bg3);">dist for all vertices</td><td style="padding:6px 10px;border:1px solid var(--bg3);">Only dist[E] for destination</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">Input order</td><td style="padding:6px 10px;border:1px solid var(--bg3);">V, E, then start</td><td style="padding:6px 10px;border:1px solid var(--bg3);">N, M, edges, then start and end</td></tr></table><br>The Dijkstra code itself is <strong>completely identical</strong> -- only I/O differs!' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))\n\nS, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<pii>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }\n    int S, E;\n    scanf("%d %d", &S, &E);\n\n    vector<int> dist(N + 1, INF);\n    dist[S] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, S});\n\n    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n\n    printf("%d\\n", dist[E]);\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Dijkstra (Specific Destination)',
                description: 'Run Dijkstra, then output only the dist value for the destination city.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N+M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Construction', desc: 'Store city and bus info as an adjacency list.\nEven if multiple buses exist for the same route, add them all.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v, w = map(int, input().split())\n    graph[u].append((v, w))' },
                        { title: 'Start/End Input & Initialization', desc: 'Find the minimum cost from departure city S to destination city E.\nSet start to 0, all others to INF.', code: 'S, E = map(int, input().split())\n\ndist = [INF] * (N + 1)\ndist[S] = 0\nheap = [(0, S)]' },
                        { title: 'Dijkstra + Output', desc: 'Run the same Dijkstra as problem 1753,\nthen output only the shortest distance dist[E] for the destination city.', code: 'while heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))\n\nprint(dist[E])' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Construction', desc: 'Build adjacency list storing (destination, cost) as pair<int,int>.\ntypedef pii for concise code.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\ntypedef pair<int,int> pii;\nconst int INF = 1e9;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<pii>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v, w;\n        scanf("%d %d %d", &u, &v, &w);\n        graph[u].push_back({v, w});\n    }' },
                        { title: 'Start/End Input & Initialization', desc: 'Create a min-heap with greater<pii> to extract shortest distance first.\nSet departure city S distance to 0 and push to heap.', code: '    int S, E;\n    scanf("%d %d", &S, &E);\n    vector<int> dist(N + 1, INF);\n    dist[S] = 0;\n    priority_queue<pii, vector<pii>, greater<pii>> pq;\n    pq.push({0, S});' },
                        { title: 'Dijkstra + Output', desc: 'Run Dijkstra, then output only the shortest distance to destination city E.\nThe structure is identical to 1753, only the output differs.', code: '    while (!pq.empty()) {\n        auto [d, v] = pq.top(); pq.pop();\n        if (d > dist[v]) continue;\n        for (auto [u, w] : graph[v]) {\n            int nd = d + w;\n            if (nd < dist[u]) {\n                dist[u] = nd;\n                pq.push({nd, u});\n            }\n        }\n    }\n    printf("%d\\n", dist[E]);\n    return 0;\n}' }
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
            simIntro: 'Observe how the answer is derived by computing max(dist) from the Dijkstra result.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>You are given a network of n nodes, labeled from 1 to n. times[i] = (u<sub>i</sub>, v<sub>i</sub>, w<sub>i</sub>) means that a signal traveling from source node u<sub>i</sub> to target node v<sub>i</sub> takes w<sub>i</sub> time.</p>
                <p>We send a signal from node k. Return the minimum time it takes for all n nodes to receive the signal. If it is impossible for all nodes to receive the signal, return -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>times = [[1,2,1]], n = 2, k = 1</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>times = [[1,2,1]], n = 2, k = 2</pre></div>
                    <div><strong>Output</strong><pre>-1</pre></div>
                </div></div>
                <h4>Constraints</h4>
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
                { title: 'First intuition', content: 'We need to find <strong>the time for all nodes to receive the signal</strong> sent from node k.<br>The most intuitive approach: search all possible paths from k (DFS/BFS), finding the minimum time to reach each node.<br>The largest of those values is "the time for all nodes to receive the signal."' },
                { title: 'But there\'s a problem with this', content: 'Searching all paths leads to many redundant visits and becomes slow!<br>With up to 6,000 edges and varying weights, even plain BFS cannot guarantee shortest times.<br>Single source shortest path in a weighted graph... <strong>Dijkstra</strong> is the perfect fit!' },
                { title: 'What if we try this?', content: 'Use <strong>Dijkstra</strong> to find the shortest time from k to all nodes. Up to here, same as problem 1753!<br><br>But this problem has one more twist: the answer is <strong>"the time for all nodes to receive the signal."</strong><br>Since the signal spreads simultaneously, the <strong>time of the last node to be reached = total time</strong>.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">dist array after Dijkstra</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">0</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">node1(k)</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">1</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">node2</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--accent);color:#fff;border-radius:6px;">1</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">node3</div></div><div style="text-align:center;"><div style="padding:6px 12px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;box-shadow:0 0 8px var(--green);">2</div><div style="font-size:0.78em;color:var(--text2);margin-top:2px;">node4</div></div></div><div style="text-align:center;margin-top:8px;color:var(--green);font-weight:600;">max(dist) = 2 → answer!</div></div>So just find the <strong>maximum</strong> in the dist array!<br><br>One more thing: if any node is unreachable (dist is INF), return <strong>-1</strong>.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">After Dijkstra, use <code>max(dist[1:n+1])</code> to get the maximum.<br>If this value is <code>float(\'inf\')</code>, it means some node is unreachable, so return -1.<br><code>return ans if ans != INF else -1</code> handles it cleanly in one line!</span><span class="lang-cpp">After Dijkstra, use <code>*max_element(dist.begin()+1, dist.end())</code> to get the maximum.<br>If this value is INF (1e9), some node is unreachable, so return -1.<br><code>return ans == INF ? -1 : ans;</code> handles it concisely with the ternary operator!</span>' }
            ],
            templates: {
                python: 'class Solution:\n    def networkDelayTime(self, times, n, k):\n        import heapq\n        INF = float(\'inf\')\n        graph = [[] for _ in range(n + 1)]\n        for u, v, w in times:\n            graph[u].append((v, w))\n\n        dist = [INF] * (n + 1)\n        dist[k] = 0\n        heap = [(0, k)]\n\n        while heap:\n            d, v = heapq.heappop(heap)\n            if d > dist[v]:\n                continue\n            for u, w in graph[v]:\n                nd = d + w\n                if nd < dist[u]:\n                    dist[u] = nd\n                    heapq.heappush(heap, (nd, u))\n\n        ans = max(dist[1:n+1])\n        return ans if ans != INF else -1',
                cpp: 'class Solution {\npublic:\n    int networkDelayTime(vector<vector<int>>& times, int n, int k) {\n        const int INF = 1e9;\n        vector<vector<pair<int,int>>> graph(n + 1);\n        for (auto& t : times) {\n            graph[t[0]].push_back({t[1], t[2]});\n        }\n\n        vector<int> dist(n + 1, INF);\n        dist[k] = 0;\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n        pq.push({0, k});\n\n        while (!pq.empty()) {\n            auto [d, v] = pq.top(); pq.pop();\n            if (d > dist[v]) continue;\n            for (auto [u, w] : graph[v]) {\n                int nd = d + w;\n                if (nd < dist[u]) {\n                    dist[u] = nd;\n                    pq.push({nd, u});\n                }\n            }\n        }\n\n        int ans = *max_element(dist.begin() + 1, dist.end());\n        return ans == INF ? -1 : ans;\n    }\n};'
            },
            solutions: [{
                approach: 'Dijkstra + max',
                description: 'Find the shortest distance to all nodes using Dijkstra, then return the maximum value.',
                timeComplexity: 'O((V+E) log V)',
                spaceComplexity: 'O(V+E)',
                codeSteps: {
                    python: [
                        { title: 'Build Graph', desc: 'Build an adjacency list from the times array.\nStore each edge as a (destination, time) tuple.', code: 'import heapq\nINF = float(\'inf\')\ngraph = [[] for _ in range(n + 1)]\nfor u, v, w in times:\n    graph[u].append((v, w))' },
                        { title: 'Run Dijkstra', desc: 'Find the shortest time from starting node k to all nodes.\nUse standard Dijkstra to compute the minimum signal arrival time for each node.', code: 'dist = [INF] * (n + 1)\ndist[k] = 0\nheap = [(0, k)]\n\nwhile heap:\n    d, v = heapq.heappop(heap)\n    if d > dist[v]:\n        continue\n    for u, w in graph[v]:\n        nd = d + w\n        if nd < dist[u]:\n            dist[u] = nd\n            heapq.heappush(heap, (nd, u))' },
                        { title: 'Return Result', desc: 'The latest arrival time among all nodes is the answer.\nIf INF remains, there is an unreachable node, so return -1.', code: 'ans = max(dist[1:n+1])\nreturn ans if ans != INF else -1' }
                    ],
                    cpp: [
                        { title: 'Build Graph', desc: 'Build an adjacency list from the times vector.\nUse auto& to reference without copying, optimizing performance.', code: 'const int INF = 1e9;\nvector<vector<pair<int,int>>> graph(n + 1);\nfor (auto& t : times)\n    graph[t[0]].push_back({t[1], t[2]});' },
                        { title: 'Run Dijkstra', desc: 'Use greater<> to build a min-heap, processing nodes with shorter distances first.\nCompute the shortest signal delivery time to all nodes.', code: 'vector<int> dist(n + 1, INF);\ndist[k] = 0;\npriority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\npq.push({0, k});\n\nwhile (!pq.empty()) {\n    auto [d, v] = pq.top(); pq.pop();\n    if (d > dist[v]) continue;\n    for (auto [u, w] : graph[v]) {\n        int nd = d + w;\n        if (nd < dist[u]) {\n            dist[u] = nd;\n            pq.push({nd, u});\n        }\n    }\n}' },
                        { title: 'Return Result', desc: 'Use max_element to find the maximum value among dist[1]~dist[n].', code: 'int ans = *max_element(dist.begin()+1, dist.end());\nreturn ans == INF ? -1 : ans;' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-11404',
            title: 'BOJ 11404 - Floyd',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11404',
            simIntro: 'Observe how the distance matrix updates as intermediate vertex k is added one by one.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There are n (2 ≤ n ≤ 100) cities. There are m (1 ≤ m ≤ 100,000) buses, each departing from one city and arriving at another. Each bus has a cost for a single use.</p>
                <p>Write a program that finds the minimum cost of traveling from city A to city B for all pairs of cities (A, B).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n14\n1 2 2\n1 3 3\n1 4 1\n1 5 10\n2 4 2\n3 4 1\n3 5 1\n4 5 3\n3 5 10\n3 1 8\n1 4 2\n5 1 7\n3 4 2\n5 2 4</pre></div>
                    <div><strong>Output</strong><pre>0 2 3 1 4\n12 0 15 2 5\n8 5 0 1 1\n10 7 13 0 3\n7 4 10 6 0</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of cities n (2 ≤ n ≤ 100). The second line contains the number of buses m (1 ≤ m ≤ 100,000). From the third line to the (m+2)-th line, each line contains a bus's departure city, arrival city, and cost. The bus cost is a non-negative integer less than 100,000.</p>
                <h4>Output</h4>
                <p>Output n lines. The j-th number on the i-th line is the minimum cost of traveling from city i to city j. If there is no path from i to j, output 0.</p>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ n ≤ 100</li>
                    <li>1 ≤ m ≤ 100,000</li>
                    <li>Cost ≤ 100,000</li>
                    <li>Output 0 if there is no path</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We need the shortest path for all city pairs (A, B).<br>The first idea is to run <strong>Dijkstra n times</strong>, once starting from each city.<br>Dijkstra from city 1, Dijkstra from city 2, ... Dijkstra from city n. This gives shortest distances for all pairs!' },
                { title: 'But there\'s a problem with this', content: 'Running Dijkstra n times gives a time complexity of O(n * (n+m) log n).<br>Since n ≤ 100, it would actually work, but the implementation is complex.<br>With n this small, is there a <strong>simpler method</strong>?<br>O(n\u00B3) = 100\u00B3 = 1,000,000 is fast enough!' },
                { title: 'What if we try this?', content: 'The <strong>Floyd-Warshall algorithm</strong> finds all-pairs shortest paths with a single triple nested loop!<br>Idea: "When going from i to j, would it be shorter <strong>via k</strong>?" Check for every k.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;text-align:center;"><div style="font-weight:600;margin-bottom:8px;">Is it shorter to go through k?</div><div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;"><span style="padding:6px 12px;border:2px solid var(--accent);border-radius:50%;font-weight:700;">i</span><span style="color:var(--text2);">——<span style="font-size:0.8em;">dp[i][k]</span>——→</span><span style="padding:6px 12px;border:2px solid var(--yellow);background:var(--warm-bg);border-radius:50%;font-weight:700;">k</span><span style="color:var(--text2);">——<span style="font-size:0.8em;">dp[k][j]</span>——→</span><span style="padding:6px 12px;border:2px solid var(--accent);border-radius:50%;font-weight:700;">j</span></div><div style="margin-top:8px;"><code style="background:var(--bg);padding:4px 10px;border-radius:4px;">dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])</code></div><div style="margin-top:6px;color:var(--text2);font-size:0.85em;">Try k=1,2,...,n as intermediate nodes to find all-pairs shortest paths!</div></div>Two important notes:<br>1. <strong>k (intermediate) must be the outermost loop</strong>! The k, i, j order is essential.<br>2. If there are <strong>multiple buses for the same route, store only the minimum</strong>!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">In Python, initialize a 2D list with <code>[[INF] * (n+1) for _ in range(n+1)]</code>.<br>After the triple loop, cells still at INF mean no path exists, so <strong>replace them with 0</strong> for output.<br>With heavy I/O, using <code>sys.stdin.readline</code> is recommended!</span><span class="lang-cpp">In C++, initialize with <code>vector&lt;vector&lt;int&gt;&gt; dp(n+1, vector&lt;int&gt;(n+1, INF))</code>.<br>After the triple loop, replace INF with 0 for output.<br>Using <code>scanf/printf</code> speeds up I/O!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0\n\nfor _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)\n\nfor k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])\n\nfor i in range(1, n + 1):\n    print(\' \'.join(str(x) if x != INF else \'0\' for x in dp[i][1:n+1]))',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nconst int INF = 1e9;\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    vector<vector<int>> dp(n + 1, vector<int>(n + 1, INF));\n    for (int i = 1; i <= n; i++) dp[i][i] = 0;\n\n    for (int i = 0; i < m; i++) {\n        int a, b, c;\n        scanf("%d %d %d", &a, &b, &c);\n        dp[a][b] = min(dp[a][b], c);\n    }\n\n    for (int k = 1; k <= n; k++)\n        for (int i = 1; i <= n; i++)\n            for (int j = 1; j <= n; j++)\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);\n\n    for (int i = 1; i <= n; i++) {\n        for (int j = 1; j <= n; j++) {\n            printf("%d ", dp[i][j] == INF ? 0 : dp[i][j]);\n        }\n        printf("\\n");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Floyd-Warshall',
                description: 'Find all-pairs shortest distances in O(N\u00B3) with a triple nested loop.',
                timeComplexity: 'O(N\u00B3)',
                spaceComplexity: 'O(N\u00B2)',
                codeSteps: {
                    python: [
                        { title: 'Input & Initialization', desc: 'Fill the 2D array with INF, set dp[i][i] to 0.\nPrepare the distance matrix to hold all-pairs shortest distances.', code: 'import sys\ninput = sys.stdin.readline\nINF = float(\'inf\')\n\nn = int(input())\nm = int(input())\ndp = [[INF] * (n + 1) for _ in range(n + 1)]\nfor i in range(1, n + 1):\n    dp[i][i] = 0' },
                        { title: 'Edge Input', desc: 'Multiple edges can exist for the same source-destination pair,\nso store only the minimum using min.', code: 'for _ in range(m):\n    a, b, c = map(int, input().split())\n    dp[a][b] = min(dp[a][b], c)' },
                        { title: 'Run Floyd-Warshall', desc: 'Add intermediate vertex k one at a time, updating all-pairs distances.\nThe k, i, j order is essential (k must be the outermost loop).', code: 'for k in range(1, n + 1):\n    for i in range(1, n + 1):\n        for j in range(1, n + 1):\n            dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])' }
                    ],
                    cpp: [
                        { title: 'Input & Initialization', desc: 'Initialize N*N distance matrix with INF using vector<vector<int>>.\nDistance from a vertex to itself is 0.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nconst int INF = 1e9;\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    vector<vector<int>> dp(n+1, vector<int>(n+1, INF));\n    for (int i = 1; i <= n; i++) dp[i][i] = 0;' },
                        { title: 'Edge Input', desc: 'Multiple edges for same route: store only the minimum with min.', code: '    for (int i = 0; i < m; i++) {\n        int a, b, c;\n        scanf("%d %d %d", &a, &b, &c);\n        dp[a][b] = min(dp[a][b], c);\n    }' },
                        { title: 'Run Floyd-Warshall', desc: 'k (intermediate) then i (source) then j (destination) order is mandatory!', code: '    for (int k = 1; k <= n; k++)\n        for (int i = 1; i <= n; i++)\n            for (int j = 1; j <= n; j++)\n                dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j]);' }
                    ]
                },
                get templates() { return shortestPathTopic.problems[2].templates; }
            }]
        },

        // ===== Stage 3: Shortest Path Applications =====
    ]
};

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.shortestpath = shortestPathTopic;
