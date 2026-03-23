// ===== Graphs & Traversal Topic Module =====
var graphTopic = {
    id: 'graph',
    title: 'Graphs & Traversal',
    icon: '🕸️',
    category: 'Search (Silver)',
    order: 9,
    description: 'Techniques for traversing graphs made of vertices and edges using DFS/BFS',
    relatedNote: 'There are also advanced graph algorithms such as topological sort, shortest path, minimum spanning tree, and strongly connected components.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-2606':  { type: 'DFS Basics',   color: 'var(--accent)', vizMethod: '_renderVizVirus',     suffix: '-virus' },
        'boj-24479': { type: 'DFS',          color: 'var(--green)',  vizMethod: '_renderVizDFS1',      suffix: '-dfs1' },
        'boj-24480': { type: 'DFS',          color: '#e17055',       vizMethod: '_renderVizDFS2',      suffix: '-dfs2' },
        'boj-24444': { type: 'BFS',          color: '#6c5ce7',       vizMethod: '_renderVizBFS1',      suffix: '-bfs1' },
        'boj-24445': { type: 'BFS',          color: '#fdcb6e',       vizMethod: '_renderVizBFS2',      suffix: '-bfs2' },
        'boj-1260':  { type: 'DFS+BFS',      color: '#00b894',       vizMethod: '_renderVizDFSBFS',    suffix: '-dfsbfs' },
        'boj-1012':  { type: 'Connected Components', color: '#d63031', vizMethod: '_renderVizCabbage',   suffix: '-cab' },
        'boj-2667':  { type: 'Connected Components', color: '#0984e3', vizMethod: '_renderVizComplex',   suffix: '-cpx' },
        'boj-2178':  { type: 'Shortest BFS', color: '#e84393',       vizMethod: '_renderVizMaze',      suffix: '-maze' },
        'boj-1697':  { type: 'Shortest BFS', color: '#fab1a0',       vizMethod: '_renderVizHide',      suffix: '-hide' },
        'boj-7562':  { type: 'Shortest BFS', color: '#74b9ff',       vizMethod: '_renderVizKnight',    suffix: '-knight' },
        'boj-7576':  { type: 'Multi-source BFS', color: '#a29bfe',   vizMethod: '_renderVizTomato',    suffix: '-tom' },
        'boj-7569':  { type: '3D BFS',       color: '#55efc4',       vizMethod: '_renderVizTomato3',   suffix: '-tom3' },
        'boj-16928': { type: 'Graph BFS',     color: '#fd79a8',       vizMethod: '_renderVizSnake',     suffix: '-snake' },
        'boj-1707':  { type: 'Bipartite',    color: '#636e72',       vizMethod: '_renderVizBipartite', suffix: '-bip' },
        'boj-2206':  { type: 'State BFS',    color: '#2d3436',       vizMethod: '_renderVizWall',      suffix: '-wall' }
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
            sim:     { intro: prob.simIntro || 'See how graph traversal actually works in action.', icon: '🎮' },
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
                <h2>\uD83D\uDD78\uFE0F Graphs & Traversal</h2>\
                <p class="hero-sub">Learn how to traverse graphs made of vertices and edges without missing any</p>\
            </div>\
\
            <!-- 1. What is a Graph? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> What is a Graph?</div>\
                <div class="analogy-box">\
                    Think about your friend group. You know Alice, Alice knows Bob, Bob knows Charlie. If you drew dots for people and lines for friendships, you\'d get a web of connections. That web is called a <strong>graph</strong>!<br><br>\
                    Each person is a <strong>vertex</strong> (a dot), and each friendship is an <strong>edge</strong> (a line between two dots).<br>\
                    Graphs are everywhere once you start looking -- subway maps, social networks, even the internet itself is one giant graph.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="34" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="14" x2="29" y2="14" stroke="currentColor" stroke-width="2"/><line x1="16" y1="19" x2="22" y2="29" stroke="currentColor" stroke-width="2"/><line x1="32" y1="19" x2="26" y2="29" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>Vertex & Edge</h3>\
                        <p>A vertex is a point, an edge is a line connecting two points.<br>There are N vertices and M edges.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="14" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="19" y1="22" x2="29" y2="22" stroke="currentColor" stroke-width="2"/><line x1="19" y1="26" x2="29" y2="26" stroke="currentColor" stroke-width="2"/><polygon points="29,20 33,22 29,24" fill="currentColor"/><polygon points="19,24 15,26 19,28" fill="currentColor"/></svg></span></div>\
                        <h3>Directed vs Undirected Graph</h3>\
                        <p>Undirected: can travel both ways (friendships)<br>Directed: one-way only (follower relationships)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><text x="4" y="14" font-size="10" fill="currentColor">1:</text><text x="16" y="14" font-size="10" fill="currentColor">[2, 3]</text><text x="4" y="28" font-size="10" fill="currentColor">2:</text><text x="16" y="28" font-size="10" fill="currentColor">[1, 4]</text><text x="4" y="42" font-size="10" fill="currentColor">3:</text><text x="16" y="42" font-size="10" fill="currentColor">[1]</text></svg></span></div>\
                        <h3>Adjacency List</h3>\
                        <p>Stores a list of connected neighbors for each vertex.<br>Memory efficient! (most commonly used)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="18" x2="44" y2="18" stroke="currentColor" stroke-width="1"/><line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" stroke-width="1"/><line x1="18" y1="4" x2="18" y2="44" stroke="currentColor" stroke-width="1"/><line x1="32" y1="4" x2="32" y2="44" stroke="currentColor" stroke-width="1"/><text x="25" y="14" text-anchor="middle" font-size="9" fill="currentColor">1</text><text x="11" y="28" text-anchor="middle" font-size="9" fill="currentColor">1</text></svg></span></div>\
                        <h3>Adjacency Matrix</h3>\
                        <p>Stores connections as 0/1 in an N\u00D7N table.<br>Inefficient when there are many edges.</p>\
                    </div>\
                </div>\
\
                <div style="margin:1.5rem 0;overflow-x:auto;">\
                    <p style="font-weight:600;font-size:0.95rem;margin-bottom:0.8rem;color:var(--text);">Adjacency List vs Adjacency Matrix — When to use which?</p>\
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                    <thead><tr style="background:var(--bg2);">\
                        <th style="padding:10px;text-align:left;border:1px solid var(--bg3);"></th>\
                        <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Adjacency List</th>\
                        <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Adjacency Matrix</th>\
                    </tr></thead>\
                    <tbody>\
                        <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Memory</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V\u00B2)</td></tr>\
                        <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Edge existence check</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(degree)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(1)</td></tr>\
                        <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Best for</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Graphs with few edges (sparse)</td>\
                            <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Graphs with many edges (dense)</td></tr>\
                    </tbody>\
                    </table>\
                    <p style="margin-top:0.6rem;font-size:0.85rem;color:var(--text2);">\
                        In most algorithm problems, graphs are sparse (few edges), so <strong>adjacency lists</strong> are primarily used.\
                    </p>\
                </div>\
\
                <p style="margin:0.5rem 0 0.8rem; font-size:0.9rem; color:var(--text2);">\
                    <span class="lang-py">In Python, using <code>defaultdict(list)</code> is convenient since you don\'t need to check if a key exists.</span>\
                    <span class="lang-cpp">In C++, adjacency lists are implemented using <code>vector&lt;vector&lt;int&gt;&gt;</code>.</span>\
                </p>\
                <div style="margin-bottom:0.8rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.defaultdict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: collections.defaultdict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: vector ↗</a></span>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Building an adjacency list (undirected graph)\nimport sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())  # number of vertices, number of edges\ngraph = [[] for _ in range(N + 1)]\n\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)  # undirected, so add both directions</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Building an adjacency list (undirected graph)\n#include &lt;iostream&gt;\n#include &lt;vector&gt;\nusing namespace std;\n\nint main() {\n    int N, M;  // number of vertices, number of edges\n    cin &gt;&gt; N &gt;&gt; M;\n    vector&lt;vector&lt;int&gt;&gt; graph(N + 1);\n\n    for (int i = 0; i &lt; M; i++) {\n        int u, v;\n        cin &gt;&gt; u &gt;&gt; v;\n        graph[u].push_back(v);\n        graph[v].push_back(u);  // undirected, so add both directions\n    }\n    return 0;\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Build an Adjacency List</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Enter two vertex numbers and click "Add Edge"! See how the graph and adjacency list change.</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="number" id="graph-demo-adj-u" value="1" min="1" max="6" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <span style="font-weight:600;">—</span>\
                        <input type="number" id="graph-demo-adj-v" value="2" min="1" max="6" style="padding:6px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="graph-demo-adj-add">+ Add Edge</button>\
                        <button class="concept-demo-btn" id="graph-demo-adj-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                    </div>\
                    <div class="concept-demo-body" style="display:flex;gap:2rem;flex-wrap:wrap;">\
                        <div style="flex:1;min-width:220px;">\
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Graph Visualization</div>\
                            <svg id="graph-demo-adj-svg" width="280" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                        </div>\
                        <div style="flex:1;min-width:200px;">\
                            <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Adjacency List</div>\
                            <div id="graph-demo-adj-list" style="font-family:monospace;font-size:0.9rem;line-height:1.8;color:var(--text);"></div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-adj-msg">Try adding edges between vertices 1~6! Since this is an undirected graph, both sides get updated.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">There are 5 students (numbered 1~5), and the friendships are (1,2), (1,3), (2,4), (3,5). What is the adjacency list for student 1?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        The adjacency list for student 1 is <strong>[2, 3]</strong>!<br>\
                        Because the vertices directly connected to 1 are 2 and 3.<br>\
                        4 and 5 are not directly connected to 1, so they are not included.\
                    </div>\
                </div>\
            </div>\
\
            <!-- 2. DFS (Depth-First Search) -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> DFS (Depth-First Search)</div>\
                <div class="analogy-box">\
                    Imagine you\'re exploring a cave with branching tunnels. At every fork, you always pick one tunnel and go as far as you can. Hit a dead end? Turn around, go back to the last fork, and try the next tunnel. That way you eventually explore <em>every</em> tunnel without missing any.<br><br>\
                    That\'s <strong>DFS</strong> -- Depth-First Search. "Depth first" just means you dive as deep as possible before coming back to try other paths.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="14" y="4" width="20" height="40" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="18" y="8" width="12" height="6" rx="2" fill="currentColor" opacity="0.3"/><rect x="18" y="18" width="12" height="6" rx="2" fill="currentColor" opacity="0.5"/><rect x="18" y="28" width="12" height="6" rx="2" fill="currentColor" opacity="0.8"/><path d="M24 38l-4-4h8z" fill="currentColor"/></svg></span></div>\
                        <h3>Stack / Recursion</h3>\
                        <p>DFS is implemented with a <strong>stack</strong> or <strong>recursion</strong>.<br>Explores from the most recently visited node!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 24l4 4 8-8" stroke="#00b894" stroke-width="3" fill="none"/></svg></span></div>\
                        <h3>Visited Check</h3>\
                        <p>Once a vertex is visited, we don\'t visit it again.<br>We track this with a <strong>visited array</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><path d="M10 38 L24 8 L38 38" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 8 L24 28" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/><path d="M24 28 L10 38" stroke="#e74c3c" stroke-width="2.5"/><circle cx="24" cy="28" r="3" fill="#e74c3c"/></svg></span></div>\
                        <h3>Backtracking</h3>\
                        <p>When you hit a dead end, you go back.<br>Stack/Recursion handles this automatically!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># DFS \u2014 Recursive approach\ndef dfs(v):\n    visited[v] = True\n    for u in graph[v]:\n        if not visited[u]:\n            dfs(u)\n\n# DFS \u2014 Stack approach\ndef dfs_stack(start):\n    stack = [start]\n    visited[start] = True\n    while stack:\n        v = stack.pop()\n        for u in graph[v]:\n            if not visited[u]:\n                visited[u] = True\n                stack.append(u)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// DFS \u2014 Recursive approach\nvoid dfs(int v, vector&lt;vector&lt;int&gt;&gt;&amp; graph, vector&lt;bool&gt;&amp; visited) {\n    visited[v] = true;\n    for (int u : graph[v]) {\n        if (!visited[u]) {\n            dfs(u, graph, visited);\n        }\n    }\n}\n\n// DFS \u2014 Stack approach\nvoid dfs_stack(int start, vector&lt;vector&lt;int&gt;&gt;&amp; graph, vector&lt;bool&gt;&amp; visited) {\n    stack&lt;int&gt; stk;\n    stk.push(start);\n    visited[start] = true;\n    while (!stk.empty()) {\n        int v = stk.top(); stk.pop();\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                stk.push(u);\n            }\n        }\n    }\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Follow the DFS</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">DFS starts from vertex 1. Watch how it goes deep in one direction, then backtracks when it hits a dead end!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-dfs-step">Next Step ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-dfs-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="graph-demo-dfs-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:220px;">\
                                <svg id="graph-demo-dfs-svg" width="300" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:160px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);">Stack</div>\
                                <div id="graph-demo-dfs-stack" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:40px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">Visit Order</div>\
                                <div id="graph-demo-dfs-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-dfs-msg">Graph: 1-2, 1-3, 2-4, 2-5 (visit smaller numbers first). Click "Next Step" to follow the DFS process step by step!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">If the graph has edges 1-2, 1-3, 2-4, 2-5, and DFS starts from vertex 1, what is the visit order? (visit smaller numbers first)</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        The order is <strong>1 \u2192 2 \u2192 4 \u2192 5 \u2192 3</strong>!<br>\
                        Start at 1 \u2192 move to smaller neighbor 2 \u2192 move to unvisited neighbor 4 \u2192 4 is a dead end, backtrack to 5 \u2192 backtrack to 3!<br>\
                        Can you see how it goes all the way down one path before backtracking?\
                    </div>\
                </div>\
            </div>\
\
            <!-- 3. BFS (Breadth-First Search) -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> BFS (Breadth-First Search)</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> When you throw a stone into a pond, <strong>circular ripples</strong> spread outward!<br><br>\
                    BFS works the same way. It explores <strong>closest nodes first</strong>, layer by layer.<br>\
                    Visit all nodes at distance 1 \u2192 all nodes at distance 2 \u2192 distance 3 ... <br><br>\
                    That\'s why BFS automatically finds the <strong>shortest distance</strong>!\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="16" width="40" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="24" r="4" fill="currentColor" opacity="0.3"/><circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.5"/><circle cx="36" cy="24" r="4" fill="currentColor" opacity="0.8"/><path d="M4 24l-2-3M4 24l-2 3" stroke="currentColor" stroke-width="2"/><path d="M44 24l2-3M44 24l2 3" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>Uses a Queue</h3>\
                        <p>BFS uses a <strong>queue</strong>.<br>FIFO — First In, First Out!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="12" r="6" fill="none" stroke="#00b894" stroke-width="2"/><text x="24" y="15" text-anchor="middle" font-size="9" fill="#00b894">0</text><circle cx="14" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="#0984e3" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="9" fill="#0984e3">1</text><line x1="20" y1="17" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="17" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Distance (Level) Calculation</h3>\
                        <p>Starting node distance = 0<br>Neighbor\'s distance = current distance + 1</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="4" fill="#00b894"/><circle cx="24" cy="24" r="4" fill="#fdcb6e"/><circle cx="40" cy="24" r="4" fill="#e17055"/><path d="M12 24h8M28 24h8" stroke="currentColor" stroke-width="2"/><text x="24" y="40" text-anchor="middle" font-size="8" fill="currentColor">Shortest!</text></svg></span></div>\
                        <h3>Guarantees Shortest Distance</h3>\
                        <p>When all edge weights are 1,<br>BFS guarantees the <strong>shortest distance</strong>!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># BFS \u2014 Using a queue\nfrom collections import deque\n\ndef bfs(start):\n    queue = deque([start])\n    visited[start] = True\n    dist[start] = 0\n\n    while queue:\n        v = queue.popleft()\n        for u in graph[v]:\n            if not visited[u]:\n                visited[u] = True\n                dist[u] = dist[v] + 1\n                queue.append(u)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// BFS \u2014 Using a queue\n#include &lt;queue&gt;\n\nvoid bfs(int start, vector&lt;vector&lt;int&gt;&gt;&amp; graph,\n         vector&lt;bool&gt;&amp; visited, vector&lt;int&gt;&amp; dist) {\n    queue&lt;int&gt; q;\n    q.push(start);\n    visited[start] = true;\n    dist[start] = 0;\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();  // get front element and remove it\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                dist[u] = dist[v] + 1;\n                q.push(u);\n            }\n        }\n    }\n}</code></pre></div></span>\
                <div style="margin-top:0.6rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: queue ↗</a></span>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Follow the BFS</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">BFS starts from vertex 1. Watch how it visits nearby vertices first, layer by layer, along with the queue!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-bfs-step">Next Step ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-bfs-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="graph-demo-bfs-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:220px;">\
                                <svg id="graph-demo-bfs-svg" width="300" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:160px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);">Queue</div>\
                                <div id="graph-demo-bfs-queue" style="display:flex;gap:4px;min-height:40px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);flex-wrap:wrap;"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">Visit Order (distance)</div>\
                                <div id="graph-demo-bfs-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-bfs-msg">Graph: 1-2, 1-3, 2-4, 3-5, 4-6 (visit smaller numbers first). Click "Next Step" to follow the BFS process!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Between DFS and BFS, which should you use to find the shortest path to the exit in a maze?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        You should use <strong>BFS</strong>!<br>\
                        BFS explores closest nodes first, so the first time it reaches the exit is the <strong>shortest distance</strong>.<br>\
                        DFS goes deep in one direction, so it might take a long detour.\
                    </div>\
                </div>\
\
                <div class="analogy-box" style="margin-top:1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);">\
                    <strong>Why does BFS guarantee the shortest distance?</strong><br><br>\
                    The order BFS dequeues nodes is exactly the <strong>distance order</strong>:<br>\
                    <strong>Step 1)</strong> Process the node at distance 0 (the start) first.<br>\
                    <strong>Step 2)</strong> Neighbors of distance-0 nodes = distance-1 nodes are enqueued and processed in order.<br>\
                    <strong>Step 3)</strong> Neighbors of distance-1 nodes = distance-2 nodes are enqueued and processed in order.<br>\
                    <strong>...</strong><br><br>\
                    Because BFS explores level by level, the <strong>first time it reaches any node</strong> is the <strong>shortest path</strong>.<br>\
                    If a shorter path existed, it would have been visited in a previous level!<br><br>\
                    <span style="font-size:0.85rem;color:var(--text2);">\u26A0\uFE0F Note: This only holds when all edge weights are <strong>1 (equal)</strong>. For different weights, algorithms like Dijkstra are needed.</span>\
                </div>\
            </div>\
\
            <!-- DFS vs BFS Comparison -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num" style="background:var(--accent);">\u2194\uFE0F</span> DFS vs BFS \u2014 What\'s the difference?</div>\
                <p style="font-size:0.92rem;color:var(--text2);margin-bottom:1rem;">Both DFS and BFS traverse the entire graph, but they differ in traversal order and the types of problems they\'re suited for.</p>\
                <div style="overflow-x:auto;">\
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                <thead><tr style="background:var(--bg2);">\
                    <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">Comparison</th>\
                    <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">DFS</th>\
                    <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">BFS</th>\
                </tr></thead>\
                <tbody>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Data Structure</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Stack / Recursion</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Queue</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Traversal Order</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Depth-first</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Breadth-first (level order)</td></tr>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Shortest Path?</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;color:var(--text2);">Not guaranteed</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;color:var(--green);font-weight:600;">\u2705 Guaranteed (unweighted)</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Memory Usage</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(depth)</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(width)</td></tr>\
                    <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Best For</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Connected components, cycle detection, topological sort</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">Shortest distance, level-order processing</td></tr>\
                    <tr style="background:var(--bg2);"><td style="padding:10px;border:1px solid var(--bg3);font-weight:500;">Time Complexity</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td>\
                        <td style="padding:10px;border:1px solid var(--bg3);text-align:center;">O(V+E)</td></tr>\
                </tbody>\
                </table>\
                </div>\
\
                <div class="concept-demo" style="margin-top:1.5rem;">\
                    <div class="concept-demo-title">Try it — DFS vs BFS on the Same Graph</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Run DFS and BFS on the same graph. Compare how the traversal order differs!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-cmp-dfs" style="background:var(--accent);">Run DFS</button>\
                        <button class="concept-demo-btn" id="graph-demo-cmp-bfs" style="background:#00b894;">Run BFS</button>\
                        <button class="concept-demo-btn" id="graph-demo-cmp-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="graph-demo-cmp-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">\
                            <div style="flex:1;min-width:240px;">\
                                <svg id="graph-demo-cmp-svg" width="320" height="220" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></svg>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:6px;color:var(--text);" id="graph-demo-cmp-ds-label">Data Structure</div>\
                                <div id="graph-demo-cmp-ds" style="display:flex;gap:4px;flex-wrap:wrap;min-height:36px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                                <div style="font-weight:600;margin:10px 0 6px;color:var(--text);">Visit Order</div>\
                                <div id="graph-demo-cmp-order" style="display:flex;gap:6px;flex-wrap:wrap;min-height:32px;"></div>\
                                <div id="graph-demo-cmp-result" style="margin-top:12px;padding:10px 14px;border-radius:8px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);font-size:0.88rem;display:none;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-cmp-msg">Graph: 1-2, 1-3, 2-4, 3-5, 4-6. Click "Run DFS" or "Run BFS" to compare traversal orders on the same graph!</div>\
                </div>\
\
                <div class="think-box" style="margin-top:1.2rem;">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">To check if a graph contains a cycle, which is more suitable: DFS or BFS?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        <strong>DFS</strong> is more suitable!<br>\
                        DFS follows one path deeply, so if it encounters an <strong>already-visited node</strong> during traversal, it means there\'s a cycle.<br>\
                        BFS can also do it, but DFS is more natural and intuitive for this.\
                    </div>\
                </div>\
            </div>\
\
            <!-- 4. Traversal on a Grid -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> Traversal on a Grid</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Imagine moving up/down/left/right on a grid board!<br><br>\
                    In a grid, each cell is a <strong>vertex</strong>, and moving to an adjacent cell is an <strong>edge</strong>.<br>\
                    From any cell, you can only go in 4 directions: up, down, left, right!<br><br>\
                    You can\'t go outside the grid or through walls, so <strong>bounds checking</strong> is crucial.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="24" r="4" fill="#0984e3"/><path d="M24 16v-6M24 32v6M16 24h-6M32 24h6" stroke="#0984e3" stroke-width="2.5" stroke-linecap="round"/><text x="24" y="8" text-anchor="middle" font-size="7" fill="currentColor">\u2191</text><text x="24" y="46" text-anchor="middle" font-size="7" fill="currentColor">\u2193</text><text x="4" y="27" text-anchor="middle" font-size="7" fill="currentColor">\u2190</text><text x="44" y="27" text-anchor="middle" font-size="7" fill="currentColor">\u2192</text></svg></span></div>\
                        <h3>dx/dy Arrays</h3>\
                        <p>Represent up/down/left/right moves as arrays.<br>dx = [0, 0, 1, -1]<br>dy = [1, -1, 0, 0]</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="8" y="8" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,2"/><circle cx="24" cy="24" r="3" fill="#00b894"/><line x1="24" y1="24" x2="24" y2="8" stroke="#e74c3c" stroke-width="2"/><text x="28" y="12" font-size="8" fill="#e74c3c">\u2717</text></svg></span></div>\
                        <h3>Bounds Checking</h3>\
                        <p>Always check if the next cell is inside the grid<br>and is not a wall!</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Grid traversal pattern (BFS)\ndx = [0, 0, 1, -1]  # up, down, right, left\ndy = [1, -1, 0, 0]\n\nfor d in range(4):\n    nx, ny = x + dx[d], y + dy[d]\n    # Bounds check: is it inside the grid?\n    if 0 <= nx < N and 0 <= ny < M:\n        # Not a wall and not visited?\n        if grid[nx][ny] != 0 and not visited[nx][ny]:\n            visited[nx][ny] = True\n            queue.append((nx, ny))</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Grid traversal pattern (BFS)\nint dx[] = {0, 0, 1, -1};  // up, down, right, left\nint dy[] = {1, -1, 0, 0};\n\nfor (int d = 0; d &lt; 4; d++) {\n    int nx = x + dx[d], ny = y + dy[d];\n    // Bounds check: is it inside the grid?\n    if (nx &gt;= 0 &amp;&amp; nx &lt; N &amp;&amp; ny &gt;= 0 &amp;&amp; ny &lt; M) {\n        // Not a wall and not visited?\n        if (grid[nx][ny] != 0 &amp;&amp; !visited[nx][ny]) {\n            visited[nx][ny] = true;\n            q.push({nx, ny});\n        }\n    }\n}</code></pre></div></span>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Grid BFS (Flood Fill)</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Select a starting cell (blue), then click "Start BFS". It explores up/down/left/right like ripples spreading! Black cells are walls (click to toggle).</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <button class="concept-demo-btn" id="graph-demo-grid-start">Start BFS</button>\
                        <button class="concept-demo-btn" id="graph-demo-grid-step" style="display:none;">Next Step ▶</button>\
                        <button class="concept-demo-btn" id="graph-demo-grid-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="graph-demo-grid-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="graph-demo-grid-area" style="display:inline-grid;grid-template-columns:repeat(7,36px);gap:3px;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-grid-msg">Click cells to toggle walls (black). The blue cell is the starting point. Numbers show the distance from the start!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In a 5\u00D75 grid, what are the up/down/left/right neighbors of cell (2, 3)? (0-indexed)</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        Up: (1, 3), Down: (3, 3), Left: (2, 2), Right: (2, 4)<br>\
                        All are within the 0~4 range, so all 4 are valid!<br>\
                        What if it were (0, 0)? Up: (-1, 0) and Left: (0, -1) are out of bounds, so only 2 are valid.\
                    </div>\
                </div>\
            </div>\
\
            <!-- 5. Graph Traversal Problem Types -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> Graph Traversal Problem Types</div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="4" fill="#0984e3"/><circle cx="24" cy="14" r="4" fill="#0984e3"/><line x1="16" y1="14" x2="20" y2="14" stroke="#0984e3" stroke-width="2"/><circle cx="12" cy="34" r="4" fill="#e17055"/><circle cx="24" cy="34" r="4" fill="#e17055"/><circle cx="36" cy="34" r="4" fill="#e17055"/><line x1="16" y1="34" x2="20" y2="34" stroke="#e17055" stroke-width="2"/><line x1="28" y1="34" x2="32" y2="34" stroke="#e17055" stroke-width="2"/></svg></span></div>\
                        <h3>\u2460 Counting Connected Components</h3>\
                        <p>Use DFS/BFS to traverse one component at a time and count <strong>how many groups</strong> there are.<br>e.g., Virus spread, counting neighborhoods</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="8" cy="24" r="5" fill="#00b894"/><circle cx="24" cy="24" r="5" fill="#fdcb6e"/><circle cx="40" cy="24" r="5" fill="#e17055"/><path d="M13 24h6M29 24h6" stroke="currentColor" stroke-width="2"/><text x="8" y="27" text-anchor="middle" font-size="8" fill="white">0</text><text x="24" y="27" text-anchor="middle" font-size="8" fill="white">1</text><text x="40" y="27" text-anchor="middle" font-size="8" fill="white">2</text></svg></span></div>\
                        <h3>\u2461 BFS Shortest Distance</h3>\
                        <p>When all edge weights are 1, BFS finds the <strong>shortest distance</strong>.<br>e.g., Maze escape, hide and seek</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="12" cy="14" r="5" fill="#e74c3c"/><circle cx="36" cy="14" r="5" fill="#e74c3c"/><circle cx="24" cy="38" r="5" fill="#fdcb6e"/><path d="M14 19l8 14M34 19l-8 14" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>\
                        <h3>\u2462 Multi-source BFS</h3>\
                        <p>Put multiple starting points into the queue at once and run BFS.<br>e.g., Ripening tomatoes (spreading from multiple sources simultaneously)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="4" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="26" y="26" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="13" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="35" y="17" text-anchor="middle" font-size="7" fill="currentColor">x,y</text><text x="13" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+state</text><text x="35" y="39" text-anchor="middle" font-size="7" fill="#e74c3c">+state</text></svg></span></div>\
                        <h3>\u2463 State-extended BFS</h3>\
                        <p>Add extra information to the visited array.<br>e.g., visited[x][y][wallBroken]</p>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Type Matching Quiz</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Read the problem description and choose the most appropriate traversal method: DFS / BFS / Both!</p>\
                    <div id="graph-demo-quiz-area" style="display:flex;flex-direction:column;gap:16px;"></div>\
                    <div style="margin-top:12px;text-align:center;">\
                        <button class="concept-demo-btn" id="graph-demo-quiz-check">Check Answers</button>\
                        <button class="concept-demo-btn" id="graph-demo-quiz-retry" style="display:none;background:var(--bg2);color:var(--text2);">Try Again</button>\
                    </div>\
                    <div class="concept-demo-msg" id="graph-demo-quiz-msg">Choose the best traversal method for each problem, then click "Check Answers"!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"Count how many connected clusters of 1s exist in a grid" \u2014 which problem type is this?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think and click!</button>\
                    <div class="think-box-answer">\
                        It\'s the <strong>\u2460 Counting Connected Components</strong> type!<br>\
                        Iterate through the grid, and when you find an unvisited 1, use DFS/BFS to visit all connected 1s.<br>\
                        This is also called <strong>Flood Fill</strong>. The number of times you start DFS/BFS equals the number of clusters!\
                    </div>\
                </div>\
            </div>\
        ';

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '\uD83D\uDD3C Collapse' : '\uD83E\uDD14 Think and click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ========== Demo 1: Build an Adjacency List ==========
        (function() {
            var NODE_COUNT = 6;
            var positions = [
                {x:140,y:30},{x:60,y:90},{x:220,y:90},
                {x:30,y:180},{x:140,y:180},{x:250,y:180}
            ];
            var adj = {};
            var edgeSet = {};
            for (var i = 1; i <= NODE_COUNT; i++) adj[i] = [];

            var svgEl = container.querySelector('#graph-demo-adj-svg');
            var listEl = container.querySelector('#graph-demo-adj-list');
            var msgEl = container.querySelector('#graph-demo-adj-msg');
            var addBtn = container.querySelector('#graph-demo-adj-add');
            var resetBtn = container.querySelector('#graph-demo-adj-reset');
            var uInput = container.querySelector('#graph-demo-adj-u');
            var vInput = container.querySelector('#graph-demo-adj-v');

            function render() {
                var html = '';
                for (var key in edgeSet) {
                    var parts = key.split('-');
                    var a = parseInt(parts[0]) - 1, b = parseInt(parts[1]) - 1;
                    html += '<line x1="' + positions[a].x + '" y1="' + positions[a].y + '" x2="' + positions[b].x + '" y2="' + positions[b].y + '" stroke="var(--accent)" stroke-width="2.5" opacity="0.6"/>';
                }
                for (var i = 0; i < NODE_COUNT; i++) {
                    html += '<circle cx="' + positions[i].x + '" cy="' + positions[i].y + '" r="18" fill="var(--card)" stroke="var(--accent)" stroke-width="2.5"/>';
                    html += '<text x="' + positions[i].x + '" y="' + (positions[i].y + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--accent)">' + (i + 1) + '</text>';
                }
                svgEl.innerHTML = html;

                var listHtml = '';
                for (var i = 1; i <= NODE_COUNT; i++) {
                    var neighbors = adj[i].slice().sort(function(a,b){return a-b;});
                    listHtml += '<div style="padding:3px 0;' + (neighbors.length > 0 ? 'color:var(--text);' : 'color:var(--text3);') + '">' +
                        '<span style="color:var(--accent);font-weight:700;">' + i + '</span>: [' + neighbors.join(', ') + ']</div>';
                }
                listEl.innerHTML = listHtml;
            }
            render();

            addBtn.addEventListener('click', function() {
                var u = parseInt(uInput.value), v = parseInt(vInput.value);
                if (isNaN(u) || isNaN(v) || u < 1 || u > NODE_COUNT || v < 1 || v > NODE_COUNT || u === v) {
                    msgEl.textContent = 'Please enter different vertex numbers between 1 and ' + NODE_COUNT + '!';
                    msgEl.style.color = 'var(--red)';
                    return;
                }
                var key = Math.min(u,v) + '-' + Math.max(u,v);
                if (edgeSet[key]) {
                    msgEl.textContent = 'Edge ' + u + '-' + v + ' already exists!';
                    msgEl.style.color = 'var(--yellow)';
                    return;
                }
                edgeSet[key] = true;
                adj[u].push(v);
                adj[v].push(u);
                msgEl.textContent = 'Edge ' + u + ' — ' + v + ' added! Both adjacency lists are updated (undirected).';
                msgEl.style.color = 'var(--green)';
                render();
            });

            resetBtn.addEventListener('click', function() {
                adj = {}; edgeSet = {};
                for (var i = 1; i <= NODE_COUNT; i++) adj[i] = [];
                msgEl.textContent = 'Reset complete! Try adding edges.';
                msgEl.style.color = 'var(--text2)';
                render();
            });
        })();

        // ========== Demo 2: Follow the DFS ==========
        (function() {
            var dfsAdj = {1:[2,3], 2:[1,4,5], 3:[1], 4:[2], 5:[2]};
            var positions = [{x:150,y:30},{x:70,y:100},{x:230,y:100},{x:40,y:190},{x:130,y:190}];
            var edges = [[1,2],[1,3],[2,4],[2,5]];
            var nodeLabels = [1,2,3,4,5];

            var svgEl = container.querySelector('#graph-demo-dfs-svg');
            var stackEl = container.querySelector('#graph-demo-dfs-stack');
            var orderEl = container.querySelector('#graph-demo-dfs-order');
            var stepBtn = container.querySelector('#graph-demo-dfs-step');
            var resetBtn = container.querySelector('#graph-demo-dfs-reset');
            var counterEl = container.querySelector('#graph-demo-dfs-counter');
            var msgEl = container.querySelector('#graph-demo-dfs-msg');

            var visited, stack, visitOrder, dfsSteps, stepIdx;

            function buildDfsSteps() {
                visited = {}; stack = [1]; visitOrder = []; dfsSteps = []; stepIdx = -1;
                var vis = {}, stk = [1], ord = [];
                vis[1] = true;
                dfsSteps.push({type:'init', node:1, stack:[1], order:[], desc:'Start: push vertex 1 onto the stack and mark as visited.'});
                while (stk.length > 0) {
                    var v = stk.pop();
                    ord.push(v);
                    var snap = stk.slice();
                    dfsSteps.push({type:'pop', node:v, stack:snap.slice(), order:ord.slice(), desc:'Pop vertex ' + v + ' from the stack and process it. Visit order: ' + ord.join(' \u2192 ')});
                    var neighbors = dfsAdj[v].slice().sort(function(a,b){return b-a;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            stk.push(u);
                            snap = stk.slice();
                            dfsSteps.push({type:'push', node:u, from:v, stack:snap.slice(), order:ord.slice(), desc:'Push neighbor ' + u + ' of vertex ' + v + ' onto the stack and mark as visited.'});
                        }
                    });
                }
                dfsSteps.push({type:'done', stack:[], order:ord.slice(), desc:'DFS complete! Visit order: ' + ord.join(' \u2192 ')});
            }

            function renderDfs(step) {
                var html = '';
                edges.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                for (var i = 0; i < 5; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.order && step.order.indexOf(nd) >= 0) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.node === nd && step.type === 'pop') {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    if (step && step.node === nd && step.type === 'push') {
                        stroke = 'var(--accent)';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="20" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                }
                svgEl.innerHTML = html;

                stackEl.innerHTML = '';
                if (step && step.stack) {
                    step.stack.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:6px 14px;background:var(--accent);color:white;border-radius:6px;font-weight:700;text-align:center;font-size:0.9rem;';
                        div.textContent = nd;
                        stackEl.appendChild(div);
                    });
                }
                if (!step || !step.stack || step.stack.length === 0) {
                    stackEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Empty</span>';
                }

                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'width:32px;height:32px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;';
                        div.textContent = nd;
                        orderEl.appendChild(div);
                    });
                }
            }

            function reset() {
                buildDfsSteps();
                stepIdx = -1;
                renderDfs(null);
                counterEl.textContent = '';
                msgEl.textContent = 'Graph: 1-2, 1-3, 2-4, 2-5 (visit smaller numbers first). Click "Next Step" to follow the DFS process step by step!';
                stepBtn.disabled = false;
            }

            stepBtn.addEventListener('click', function() {
                stepIdx++;
                if (stepIdx >= dfsSteps.length) { stepBtn.disabled = true; return; }
                var s = dfsSteps[stepIdx];
                renderDfs(s);
                counterEl.textContent = (stepIdx + 1) + ' / ' + dfsSteps.length;
                msgEl.textContent = s.desc;
                if (stepIdx >= dfsSteps.length - 1) stepBtn.disabled = true;
            });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 3: Follow the BFS ==========
        (function() {
            var bfsAdj = {1:[2,3], 2:[1,4], 3:[1,5], 4:[2,6], 5:[3], 6:[4]};
            var positions = [{x:150,y:25},{x:70,y:95},{x:230,y:95},{x:40,y:180},{x:230,y:180},{x:120,y:180}];
            var edges = [[1,2],[1,3],[2,4],[3,5],[4,6]];
            var nodeLabels = [1,2,3,4,5,6];

            var svgEl = container.querySelector('#graph-demo-bfs-svg');
            var queueEl = container.querySelector('#graph-demo-bfs-queue');
            var orderEl = container.querySelector('#graph-demo-bfs-order');
            var stepBtn = container.querySelector('#graph-demo-bfs-step');
            var resetBtn = container.querySelector('#graph-demo-bfs-reset');
            var counterEl = container.querySelector('#graph-demo-bfs-counter');
            var msgEl = container.querySelector('#graph-demo-bfs-msg');

            var bfsSteps, stepIdx, dist;

            function buildBfsSteps() {
                bfsSteps = []; dist = {};
                var vis = {}, queue = [1], ord = [];
                vis[1] = true; dist[1] = 0;
                bfsSteps.push({type:'init', node:1, queue:[1], order:[], dist:{1:0}, desc:'Start: enqueue vertex 1 and mark as visited. Distance=0.'});
                while (queue.length > 0) {
                    var v = queue.shift();
                    ord.push(v);
                    var snap = queue.slice();
                    var dSnap = {};
                    for (var k in dist) dSnap[k] = dist[k];
                    bfsSteps.push({type:'dequeue', node:v, queue:snap.slice(), order:ord.slice(), dist:Object.assign({},dSnap), desc:'Dequeue vertex ' + v + ' and process it. Distance=' + dist[v] + '. Visit order: ' + ord.join(' \u2192 ')});
                    var neighbors = bfsAdj[v].slice().sort(function(a,b){return a-b;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            dist[u] = dist[v] + 1;
                            queue.push(u);
                            snap = queue.slice();
                            dSnap = {};
                            for (var k in dist) dSnap[k] = dist[k];
                            bfsSteps.push({type:'enqueue', node:u, from:v, queue:snap.slice(), order:ord.slice(), dist:Object.assign({},dSnap), desc:'Enqueue neighbor ' + u + ' of vertex ' + v + '. Distance=' + dist[u] + '.'});
                        }
                    });
                }
                bfsSteps.push({type:'done', queue:[], order:ord.slice(), dist:Object.assign({},dist), desc:'BFS complete! Visit order: ' + ord.join(' \u2192 ') + '. Shortest distances to all vertices have been calculated.'});
            }

            function renderBfs(step) {
                var html = '';
                edges.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                for (var i = 0; i < nodeLabels.length; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.order && step.order.indexOf(nd) >= 0) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.node === nd && step.type === 'dequeue') {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    if (step && step.node === nd && step.type === 'enqueue') {
                        stroke = 'var(--accent)'; if (step.order.indexOf(nd) < 0) fill = 'var(--accent)15';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="20" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                    if (step && step.dist && step.dist[nd] !== undefined) {
                        html += '<text x="'+(positions[i].x+22)+'" y="'+(positions[i].y-14)+'" text-anchor="middle" font-size="10" fill="var(--accent)" font-weight="600">d='+step.dist[nd]+'</text>';
                    }
                }
                svgEl.innerHTML = html;

                queueEl.innerHTML = '';
                if (step && step.queue && step.queue.length > 0) {
                    step.queue.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:6px 14px;background:var(--accent);color:white;border-radius:6px;font-weight:700;font-size:0.9rem;';
                        div.textContent = nd;
                        queueEl.appendChild(div);
                    });
                } else {
                    queueEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Empty</span>';
                }

                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var d = step.dist && step.dist[nd] !== undefined ? step.dist[nd] : '?';
                        var div = document.createElement('div');
                        div.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
                        div.innerHTML = '<div style="width:32px;height:32px;border-radius:50%;background:var(--green);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">'+nd+'</div><span style="font-size:0.7rem;color:var(--text2);">d='+d+'</span>';
                        orderEl.appendChild(div);
                    });
                }
            }

            function reset() {
                buildBfsSteps();
                stepIdx = -1;
                renderBfs(null);
                counterEl.textContent = '';
                msgEl.textContent = 'Graph: 1-2, 1-3, 2-4, 3-5, 4-6 (visit smaller numbers first). Click "Next Step" to follow the BFS process!';
                stepBtn.disabled = false;
            }

            stepBtn.addEventListener('click', function() {
                stepIdx++;
                if (stepIdx >= bfsSteps.length) { stepBtn.disabled = true; return; }
                var s = bfsSteps[stepIdx];
                renderBfs(s);
                counterEl.textContent = (stepIdx + 1) + ' / ' + bfsSteps.length;
                msgEl.textContent = s.desc;
                if (stepIdx >= bfsSteps.length - 1) stepBtn.disabled = true;
            });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 4: Grid BFS (Flood Fill) ==========
        (function() {
            var ROWS = 6, COLS = 7;
            var grid, dist, startR, startC, bfsQueue, bfsRunning, bfsStepIdx;
            var areaEl = container.querySelector('#graph-demo-grid-area');
            var startBtn = container.querySelector('#graph-demo-grid-start');
            var stepBtn = container.querySelector('#graph-demo-grid-step');
            var resetBtn = container.querySelector('#graph-demo-grid-reset');
            var counterEl = container.querySelector('#graph-demo-grid-counter');
            var msgEl = container.querySelector('#graph-demo-grid-msg');
            var dx = [-1,1,0,0], dy = [0,0,-1,1];

            function initGrid() {
                grid = []; dist = [];
                for (var r = 0; r < ROWS; r++) {
                    grid[r] = []; dist[r] = [];
                    for (var c = 0; c < COLS; c++) { grid[r][c] = 0; dist[r][c] = -1; }
                }
                [[1,2],[1,3],[2,3],[3,1],[3,4],[4,4]].forEach(function(w) { grid[w[0]][w[1]] = 1; });
                startR = 0; startC = 0;
                bfsQueue = []; bfsRunning = false; bfsStepIdx = 0;
            }

            function renderGrid() {
                areaEl.innerHTML = '';
                for (var r = 0; r < ROWS; r++) {
                    for (var c = 0; c < COLS; c++) {
                        var cell = document.createElement('div');
                        cell.dataset.r = r; cell.dataset.c = c;
                        cell.style.cssText = 'width:36px;height:36px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;cursor:pointer;transition:all 0.2s;border:2px solid var(--bg3);';
                        if (grid[r][c] === 1) {
                            cell.style.background = '#333'; cell.style.color = '#666';
                        } else if (r === startR && c === startC) {
                            cell.style.background = 'var(--accent)'; cell.style.color = 'white';
                            cell.textContent = 'S';
                        } else if (dist[r][c] >= 0) {
                            var hue = 120 + dist[r][c] * 30;
                            cell.style.background = 'hsl(' + (hue % 360) + ', 60%, 55%)';
                            cell.style.color = 'white';
                            cell.textContent = dist[r][c];
                        } else {
                            cell.style.background = 'var(--card)'; cell.style.color = 'var(--text3)';
                        }
                        if (!bfsRunning) {
                            cell.addEventListener('click', (function(rr,cc) {
                                return function() {
                                    if (rr === startR && cc === startC) return;
                                    grid[rr][cc] = grid[rr][cc] === 1 ? 0 : 1;
                                    renderGrid();
                                };
                            })(r,c));
                        }
                        areaEl.appendChild(cell);
                    }
                }
            }

            function reset() {
                initGrid();
                renderGrid();
                startBtn.style.display = '';
                stepBtn.style.display = 'none';
                counterEl.textContent = '';
                msgEl.textContent = 'Click cells to toggle walls (black). The blue cell is the starting point.';
                msgEl.style.color = 'var(--text2)';
            }

            startBtn.addEventListener('click', function() {
                bfsRunning = true;
                dist = [];
                for (var r = 0; r < ROWS; r++) { dist[r] = []; for (var c = 0; c < COLS; c++) dist[r][c] = -1; }
                dist[startR][startC] = 0;
                bfsQueue = [{r:startR, c:startC}];
                bfsStepIdx = 0;
                startBtn.style.display = 'none';
                stepBtn.style.display = '';
                renderGrid();
                msgEl.textContent = 'BFS started! Starting from (' + startR + ',' + startC + '). Click "Next Step" to watch the ripples spread.';
                msgEl.style.color = 'var(--accent)';
            });

            stepBtn.addEventListener('click', function() {
                if (bfsQueue.length === 0) {
                    msgEl.textContent = 'BFS complete! Shortest distances to all reachable cells are shown.';
                    msgEl.style.color = 'var(--green)';
                    stepBtn.disabled = true;
                    return;
                }
                var cur = bfsQueue.shift();
                bfsStepIdx++;
                var added = [];
                for (var d = 0; d < 4; d++) {
                    var nr = cur.r + dx[d], nc = cur.c + dy[d];
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === 0 && dist[nr][nc] < 0) {
                        dist[nr][nc] = dist[cur.r][cur.c] + 1;
                        bfsQueue.push({r:nr, c:nc});
                        added.push('(' + nr + ',' + nc + ')');
                    }
                }
                renderGrid();
                counterEl.textContent = 'Step ' + bfsStepIdx + ' | Queue: ' + bfsQueue.length;
                if (added.length > 0) {
                    msgEl.textContent = 'Processing (' + cur.r + ',' + cur.c + ') (distance ' + dist[cur.r][cur.c] + '). Added neighbors ' + added.join(', ') + ' to queue.';
                } else {
                    msgEl.textContent = 'Processing (' + cur.r + ',' + cur.c + ') (distance ' + dist[cur.r][cur.c] + '). No new neighbors to add.';
                }
                msgEl.style.color = 'var(--text)';
            });

            resetBtn.addEventListener('click', function() {
                bfsRunning = false;
                stepBtn.disabled = false;
                reset();
            });
            reset();
        })();

        // ========== Demo: DFS vs BFS Comparison Demo ==========
        (function() {
            var adj = {1:[2,3], 2:[1,4], 3:[1,5], 4:[2,6], 5:[3], 6:[4]};
            var positions = [{x:160,y:25},{x:70,y:90},{x:250,y:90},{x:40,y:175},{x:250,y:175},{x:130,y:175}];
            var edgeList = [[1,2],[1,3],[2,4],[3,5],[4,6]];
            var nodeLabels = [1,2,3,4,5,6];

            var svgEl = container.querySelector('#graph-demo-cmp-svg');
            var dsEl = container.querySelector('#graph-demo-cmp-ds');
            var dsLabel = container.querySelector('#graph-demo-cmp-ds-label');
            var orderEl = container.querySelector('#graph-demo-cmp-order');
            var resultEl = container.querySelector('#graph-demo-cmp-result');
            var dfsBtn = container.querySelector('#graph-demo-cmp-dfs');
            var bfsBtn = container.querySelector('#graph-demo-cmp-bfs');
            var resetBtn = container.querySelector('#graph-demo-cmp-reset');
            var counterEl = container.querySelector('#graph-demo-cmp-counter');
            var msgEl = container.querySelector('#graph-demo-cmp-msg');

            var steps, stepIdx, mode, autoTimer, dfsResult, bfsResult;

            function buildDfsSteps() {
                steps = []; mode = 'DFS'; dsLabel.textContent = 'Stack';
                var vis = {}, stk = [1], ord = [];
                vis[1] = true;
                steps.push({node:1, ds:[1], order:[], desc:'DFS start: push vertex 1 onto the stack and mark as visited.', highlight:1, visited:{}});
                while (stk.length > 0) {
                    var v = stk.pop();
                    ord.push(v);
                    var visSnap = {}; for (var k in vis) visSnap[k]=true; ord.forEach(function(o){visSnap[o]=true;});
                    steps.push({node:v, ds:stk.slice(), order:ord.slice(), desc:'Pop ' + v + ' from stack. Visit order: ' + ord.join(' → '), highlight:v, visited:visSnap});
                    var neighbors = adj[v].slice().sort(function(a,b){return b-a;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            stk.push(u);
                            var visSnap2 = {}; for (var k in vis) visSnap2[k]=true;
                            steps.push({node:u, ds:stk.slice(), order:ord.slice(), desc:'Push neighbor ' + u + ' of ' + v + ' onto the stack.', highlight:u, visited:visSnap2});
                        }
                    });
                }
                steps.push({node:null, ds:[], order:ord.slice(), desc:'DFS complete! Visit order: ' + ord.join(' → '), highlight:null, visited:vis});
                dfsResult = ord.slice();
            }

            function buildBfsSteps() {
                steps = []; mode = 'BFS'; dsLabel.textContent = 'Queue';
                var vis = {}, queue = [1], ord = [];
                vis[1] = true;
                steps.push({node:1, ds:[1], order:[], desc:'BFS start: enqueue vertex 1 and mark as visited.', highlight:1, visited:{}});
                while (queue.length > 0) {
                    var v = queue.shift();
                    ord.push(v);
                    var visSnap = {}; for (var k in vis) visSnap[k]=true; ord.forEach(function(o){visSnap[o]=true;});
                    steps.push({node:v, ds:queue.slice(), order:ord.slice(), desc:'Dequeue ' + v + '. Visit order: ' + ord.join(' → '), highlight:v, visited:visSnap});
                    var neighbors = adj[v].slice().sort(function(a,b){return a-b;});
                    neighbors.forEach(function(u) {
                        if (!vis[u]) {
                            vis[u] = true;
                            queue.push(u);
                            var visSnap2 = {}; for (var k in vis) visSnap2[k]=true;
                            steps.push({node:u, ds:queue.slice(), order:ord.slice(), desc:'Enqueue neighbor ' + u + ' of ' + v + '.', highlight:u, visited:visSnap2});
                        }
                    });
                }
                steps.push({node:null, ds:[], order:ord.slice(), desc:'BFS complete! Visit order: ' + ord.join(' → '), highlight:null, visited:vis});
                bfsResult = ord.slice();
            }

            function renderCmpGraph(step) {
                var html = '';
                edgeList.forEach(function(e) {
                    var a = e[0]-1, b = e[1]-1;
                    html += '<line x1="'+positions[a].x+'" y1="'+positions[a].y+'" x2="'+positions[b].x+'" y2="'+positions[b].y+'" stroke="var(--bg3)" stroke-width="2.5"/>';
                });
                for (var i = 0; i < nodeLabels.length; i++) {
                    var nd = nodeLabels[i];
                    var fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                    if (step && step.visited && step.visited[nd]) {
                        fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white';
                    }
                    if (step && step.highlight === nd) {
                        fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333';
                    }
                    html += '<circle cx="'+positions[i].x+'" cy="'+positions[i].y+'" r="22" fill="'+fill+'" stroke="'+stroke+'" stroke-width="3"/>';
                    html += '<text x="'+positions[i].x+'" y="'+(positions[i].y+6)+'" text-anchor="middle" font-size="15" font-weight="700" fill="'+txtColor+'">'+nd+'</text>';
                }
                svgEl.innerHTML = html;

                dsEl.innerHTML = '';
                if (step && step.ds && step.ds.length > 0) {
                    step.ds.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'padding:5px 12px;background:' + (mode === 'DFS' ? 'var(--accent)' : '#00b894') + ';color:white;border-radius:6px;font-weight:700;font-size:0.88rem;';
                        div.textContent = nd;
                        dsEl.appendChild(div);
                    });
                } else {
                    dsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Empty</span>';
                }

                orderEl.innerHTML = '';
                if (step && step.order) {
                    step.order.forEach(function(nd) {
                        var div = document.createElement('div');
                        div.style.cssText = 'width:30px;height:30px;border-radius:50%;background:' + (mode === 'DFS' ? 'var(--accent)' : '#00b894') + ';color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;';
                        div.textContent = nd;
                        orderEl.appendChild(div);
                    });
                }
            }

            function showResult() {
                if (dfsResult && bfsResult) {
                    resultEl.style.display = 'block';
                    resultEl.innerHTML = '<strong>Comparison</strong><br><span style="color:var(--accent);font-weight:600;">DFS:</span> ' + dfsResult.join(' → ') + '<br><span style="color:#00b894;font-weight:600;">BFS:</span> ' + bfsResult.join(' → ') + '<br><span style="font-size:0.85rem;color:var(--text2);margin-top:4px;display:inline-block;">Same graph, different traversal orders!</span>';
                }
            }

            function runAuto() {
                if (autoTimer) clearInterval(autoTimer);
                stepIdx = -1;
                dfsBtn.disabled = true; bfsBtn.disabled = true;
                autoTimer = setInterval(function() {
                    stepIdx++;
                    if (stepIdx >= steps.length) {
                        clearInterval(autoTimer);
                        dfsBtn.disabled = false; bfsBtn.disabled = false;
                        showResult();
                        return;
                    }
                    var s = steps[stepIdx];
                    renderCmpGraph(s);
                    counterEl.textContent = (stepIdx + 1) + ' / ' + steps.length;
                    msgEl.textContent = s.desc;
                }, 600);
            }

            function reset() {
                if (autoTimer) clearInterval(autoTimer);
                steps = []; stepIdx = -1; mode = '';
                dfsResult = null; bfsResult = null;
                dsLabel.textContent = 'Data Structure';
                resultEl.style.display = 'none';
                renderCmpGraph(null);
                counterEl.textContent = '';
                msgEl.textContent = 'Graph: 1-2, 1-3, 2-4, 3-5, 4-6. Click "Run DFS" or "Run BFS" to compare traversal orders on the same graph!';
                dfsBtn.disabled = false; bfsBtn.disabled = false;
            }

            dfsBtn.addEventListener('click', function() { buildDfsSteps(); runAuto(); });
            bfsBtn.addEventListener('click', function() { buildBfsSteps(); runAuto(); });
            resetBtn.addEventListener('click', reset);
            reset();
        })();

        // ========== Demo 5: Type Matching Quiz ==========
        (function() {
            var quizData = [
                {q:'Find the shortest distance to the exit in a maze', answer:'BFS', why:'BFS explores closest nodes first, so it guarantees the shortest distance.'},
                {q:'Count the number of connected components in a graph', answer:'Both', why:'Connected components can be found with either DFS or BFS. Both work!'},
                {q:'Detect if a cycle exists', answer:'DFS', why:'DFS follows one path deeply, making cycle detection natural.'},
                {q:'Tomatoes ripening from multiple sources simultaneously', answer:'BFS', why:'Multi-source BFS! Put all starting points into the queue at once.'},
                {q:'Simulating water spreading simultaneously across a grid', answer:'BFS', why:'Simultaneous spreading matches BFS level-by-level traversal exactly.'}
            ];
            var choices = ['DFS', 'BFS', 'Both'];
            var quizArea = container.querySelector('#graph-demo-quiz-area');
            var checkBtn = container.querySelector('#graph-demo-quiz-check');
            var retryBtn = container.querySelector('#graph-demo-quiz-retry');
            var quizMsg = container.querySelector('#graph-demo-quiz-msg');
            var userAnswers = [];

            function renderQuiz() {
                quizArea.innerHTML = '';
                userAnswers = [];
                quizData.forEach(function(item, idx) {
                    userAnswers.push(null);
                    var card = document.createElement('div');
                    card.style.cssText = 'padding:14px 18px;background:var(--card);border-radius:10px;border:1.5px solid var(--bg3);';
                    card.id = 'graph-demo-quiz-q' + idx;
                    var html = '<div style="font-weight:600;color:var(--text);margin-bottom:8px;">' + (idx+1) + '. ' + item.q + '</div>';
                    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
                    choices.forEach(function(ch) {
                        html += '<button class="concept-demo-btn graph-demo-quiz-opt" data-idx="' + idx + '" data-val="' + ch + '" style="padding:6px 16px;font-size:0.85rem;background:var(--bg2);color:var(--text);border:1.5px solid var(--bg3);">' + ch + '</button>';
                    });
                    html += '</div>';
                    html += '<div class="graph-demo-quiz-feedback" style="margin-top:8px;font-size:0.85rem;color:var(--text2);display:none;"></div>';
                    card.innerHTML = html;
                    quizArea.appendChild(card);
                });
                quizArea.querySelectorAll('.graph-demo-quiz-opt').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var idx = parseInt(btn.dataset.idx);
                        var val = btn.dataset.val;
                        userAnswers[idx] = val;
                        var card = container.querySelector('#graph-demo-quiz-q' + idx);
                        card.querySelectorAll('.graph-demo-quiz-opt').forEach(function(b) {
                            b.style.background = 'var(--bg2)'; b.style.borderColor = 'var(--bg3)'; b.style.color = 'var(--text)';
                        });
                        btn.style.background = 'var(--accent)'; btn.style.color = 'white'; btn.style.borderColor = 'var(--accent)';
                    });
                });
            }

            checkBtn.addEventListener('click', function() {
                var score = 0;
                quizData.forEach(function(item, idx) {
                    var card = container.querySelector('#graph-demo-quiz-q' + idx);
                    var fb = card.querySelector('.graph-demo-quiz-feedback');
                    fb.style.display = 'block';
                    if (userAnswers[idx] === item.answer) {
                        score++;
                        fb.innerHTML = '<span style="color:var(--green);font-weight:600;">Correct!</span> ' + item.why;
                        card.style.borderColor = 'var(--green)';
                    } else if (userAnswers[idx] === null) {
                        fb.innerHTML = '<span style="color:var(--text2);">Not answered.</span> Answer: <strong>' + item.answer + '</strong>. ' + item.why;
                        card.style.borderColor = 'var(--yellow)';
                    } else {
                        fb.innerHTML = '<span style="color:var(--red);font-weight:600;">Wrong!</span> Answer: <strong>' + item.answer + '</strong>. ' + item.why;
                        card.style.borderColor = 'var(--red)';
                    }
                    card.querySelectorAll('.graph-demo-quiz-opt').forEach(function(b) { b.disabled = true; });
                });
                quizMsg.textContent = score + ' out of ' + quizData.length + ' correct!';
                quizMsg.style.color = score === quizData.length ? 'var(--green)' : 'var(--accent)';
                checkBtn.style.display = 'none';
                retryBtn.style.display = '';
            });

            retryBtn.addEventListener('click', function() {
                renderQuiz();
                quizMsg.textContent = 'Choose the best traversal method for each problem, then click "Check Answers"!';
                quizMsg.style.color = 'var(--text2)';
                checkBtn.style.display = '';
                retryBtn.style.display = 'none';
            });

            renderQuiz();
        })();
    },

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

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
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next ▶</button>' +
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
    // Simulation 1: Virus (boj-2606)
    // ====================================================================
    _renderVizVirus: function(container) {
        var self = this, suffix = '-virus';
        var DEFAULT_N = 7, DEFAULT_EDGES = '1 2, 2 3, 1 5, 5 2, 5 6, 4 7';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Virus Spread (BFS)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Starting from computer 1, infect all connected computers.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-virus-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-virus-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
            '<button class="btn btn-primary" id="gr-virus-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) {
            return s.split(',').map(function(e) { var p = e.trim().split(/\s+/); return [parseInt(p[0]), parseInt(p[1])]; }).filter(function(e) { return !isNaN(e[0]) && !isNaN(e[1]); });
        }
        function buildAdj(n, edges) {
            var adj = {}; for (var i = 1; i <= n; i++) adj[i] = [];
            edges.forEach(function(e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
            for (var i = 1; i <= n; i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, vis, current, q) {
            var nodes = []; for (var i = 1; i <= n; i++) nodes.push(i);
            areaEl.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">' + nodes.map(function(nd) {
                var bg = 'var(--bg2)';
                if (vis[nd]) bg = 'linear-gradient(135deg,var(--accent-vivid),var(--accent2))';
                if (nd === current) bg = 'var(--yellow)';
                return '<div style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;background:' + bg + ';color:' + (vis[nd] ? 'white' : 'var(--text)') + ';">' + nd + '</div>';
            }).join('') + '</div>' + (q.length ? '<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: [' + q.join(', ') + ']</div>' : '');
        }
        function buildSteps(n, edges) {
            var adj = buildAdj(n, edges);
            var steps = [], visited = {}, queue = [];
            // BFS from node 1
            steps.push({ description: '<strong>Node 1</strong> is the infection source — enqueue it to prepare for neighbor exploration. BFS explores <em>nearest neighbors first</em>, so it can find all connected computers without missing any.',
                action: function() { visited = {1:true}; queue = [1]; renderNodes(n, visited, 1, queue); infoEl.innerHTML = 'visited[1] = True, Queue = [1]'; },
                undo: function() { visited = {}; queue = []; renderNodes(n, {}, null, []); infoEl.innerHTML = ''; } });
            // simulate BFS to generate steps
            var simVis = {1:true}, simQ = [1];
            while (simQ.length > 0) {
                var v = simQ.shift();
                var neighbors = (adj[v] || []).filter(function(u) { return !simVis[u]; });
                if (neighbors.length > 0) {
                    (function(cv, nb) {
                        var addedNodes = nb.slice();
                        steps.push({
                            description: 'Dequeue <strong>front</strong> node ' + cv + ' — FIFO order ensures we process closer nodes first. Neighbors <strong>' + nb.join(', ') + '</strong> are unvisited, so infect them and add to queue.',
                            action: function() { addedNodes.forEach(function(u) { visited[u] = true; }); queue = simQ.slice(); renderNodes(n, visited, cv, queue); infoEl.innerHTML = 'Unvisited neighbors of ' + cv + ': ' + nb.join(', ') + ' → infected!'; },
                            undo: function() { addedNodes.forEach(function(u) { delete visited[u]; }); renderNodes(n, visited, null, []); infoEl.innerHTML = ''; }
                        });
                    })(v, neighbors);
                    neighbors.forEach(function(u) { simVis[u] = true; simQ.push(u); });
                } else if (v !== 1) {
                    (function(cv) {
                        steps.push({
                            description: 'Dequeue ' + cv + ' — all neighbors are <em>already visited</em>. The visited check prevents infinite loops and duplicate processing, so there is nothing more to spread from this node.',
                            action: function() { renderNodes(n, visited, cv, simQ.slice()); infoEl.innerHTML = 'All neighbors of ' + cv + ' already visited'; },
                            undo: function() { renderNodes(n, visited, null, []); infoEl.innerHTML = ''; }
                        });
                    })(v);
                }
            }
            // final step
            var infectedCount = Object.keys(simVis).length - 1;
            var infectedList = Object.keys(simVis).filter(function(k){return k!=='1';}).join(',');
            steps.push({ description: 'BFS queue is empty, so <strong>traversal is complete</strong> — all computers reachable from node 1 have been visited. Infected computers = <strong>' + infectedCount + '</strong>',
                action: function() { queue = []; renderNodes(n, visited, null, []); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">\u2705 Infected computers = ' + infectedCount + ' (' + infectedList + ')</strong>'; },
                undo: function() { renderNodes(n, visited, null, []); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-virus-n').value) || DEFAULT_N;
            var edges = parseEdges(container.querySelector('#gr-virus-edges').value);
            renderNodes(n, {}, null, []);
            infoEl.innerHTML = '';
            var steps = buildSteps(n, edges);
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#gr-virus-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 2: DFS Ascending Order (boj-24479)
    // ====================================================================
    _renderVizDFS1: function(container) {
        var self = this, suffix = '-dfs1';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS Ascending Order Visit</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Records the DFS visit order in ascending order.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfs1-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start: <input type="number" id="gr-dfs1-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-dfs1-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfs1-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, ord, cur) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'var(--accent)':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {}, cnt = 0;
            // DFS simulation
            var simOrder = {}, simCnt = 0, visitLog = [];
            function dfs(v, from) {
                simCnt++; simOrder[v] = simCnt;
                visitLog.push({ node: v, order: simCnt, from: from, neighbors: (adj[v]||[]).slice() });
                (adj[v]||[]).forEach(function(u) { if (!simOrder[u]) dfs(u, v); });
            }
            dfs(start, -1);
            visitLog.forEach(function(entry, idx) {
                (function(e, i) {
                    var desc;
                    if (e.from === -1) {
                        desc = 'Start DFS from <strong>' + e.node + '</strong> — recursive calls explore <em>as deep as possible</em> before backtracking. order[' + e.node + ']=' + e.order;
                    } else {
                        desc = 'From ' + e.from + ', dive into the smallest unvisited neighbor <strong>' + e.node + '</strong> (ascending order) — DFS goes as deep as possible in one direction. order[' + e.node + ']=' + e.order;
                    }
                    steps.push({
                        description: desc,
                        action: function() { order[e.node] = e.order; renderNodes(n, order, e.node); infoEl.innerHTML = 'order[' + e.node + '] = ' + e.order; },
                        undo: function() { delete order[e.node]; var prev = i > 0 ? visitLog[i-1] : null; renderNodes(n, order, prev ? prev.node : null); infoEl.innerHTML = prev ? 'order[' + prev.node + '] = ' + prev.order : ''; }
                    });
                })(entry, idx);
            });
            // final
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: 'All recursive calls finished — <strong>traversal complete</strong>. Since this is ascending DFS, smaller-numbered neighbors were visited first. Visit order: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 visit order: ' + result.join(',') + '</strong>'; },
                undo: function() { var last = visitLog[visitLog.length-1]; renderNodes(n, order, last.node); infoEl.innerHTML = 'order[' + last.node + '] = ' + last.order; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-dfs1-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-dfs1-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-dfs1-edges').value);
            renderNodes(n, {}, null); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-dfs1-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 3: DFS Descending Order (boj-24480)
    // ====================================================================
    _renderVizDFS2: function(container) {
        var self = this, suffix = '-dfs2';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS Descending Order Visit</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Records the DFS visit order in descending order.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfs2-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start: <input type="number" id="gr-dfs2-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-dfs2-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfs2-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return b-a;}); // descending
            return adj;
        }
        function renderNodes(n, ord, cur) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#e17055':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            var simOrder = {}, simCnt = 0, visitLog = [];
            function dfs(v, from) {
                simCnt++; simOrder[v] = simCnt;
                visitLog.push({ node: v, order: simCnt, from: from });
                (adj[v]||[]).forEach(function(u) { if (!simOrder[u]) dfs(u, v); });
            }
            dfs(start, -1);
            visitLog.forEach(function(entry, idx) {
                (function(e, i) {
                    var desc;
                    if (e.from === -1) {
                        desc = 'Start DFS from <strong>' + e.node + '</strong> — this time we visit neighbors in <em>descending</em> order. Same graph, but different visit order. order[' + e.node + ']=' + e.order;
                    } else {
                        desc = 'From ' + e.from + ', dive into the largest unvisited neighbor <strong>' + e.node + '</strong> (descending order). order[' + e.node + ']=' + e.order;
                    }
                    steps.push({
                        description: desc,
                        action: function() { order[e.node] = e.order; renderNodes(n, order, e.node); infoEl.innerHTML = desc; },
                        undo: function() { delete order[e.node]; var prev = i > 0 ? visitLog[i-1] : null; renderNodes(n, order, prev ? prev.node : null); infoEl.innerHTML = prev ? 'order[' + prev.node + '] = ' + prev.order : ''; }
                    });
                })(entry, idx);
            });
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: 'Traversal complete — descending order visited larger-numbered neighbors first. Compare with ascending DFS to see how <em>visit order changes</em>! Result: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 visit order: ' + result.join(',') + '</strong>'; },
                undo: function() { var last = visitLog[visitLog.length-1]; renderNodes(n, order, last.node); infoEl.innerHTML = 'order[' + last.node + '] = ' + last.order; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-dfs2-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-dfs2-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-dfs2-edges').value);
            renderNodes(n, {}, null); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-dfs2-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 4: BFS Ascending Order (boj-24444)
    // ====================================================================
    _renderVizBFS1: function(container) {
        var self = this, suffix = '-bfs1';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">BFS Ascending Order Visit</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Records the BFS visit order in ascending order.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bfs1-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start: <input type="number" id="gr-bfs1-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-bfs1-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bfs1-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function renderNodes(n, ord, cur, q) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#6c5ce7':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'white':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>'+(q&&q.length?'<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: ['+q.join(', ')+']</div>':'');
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            // BFS simulation
            var simOrder = {}, simCnt = 0, simQ = [start], simVis = {};
            simVis[start] = true; simCnt++; simOrder[start] = simCnt;
            var bfsLog = [{ type: 'start', node: start, order: simCnt, queue: simQ.slice() }];
            while (simQ.length > 0) {
                var v = simQ.shift();
                var added = [];
                (adj[v]||[]).forEach(function(u) {
                    if (!simVis[u]) { simVis[u] = true; simCnt++; simOrder[u] = simCnt; simQ.push(u); added.push(u); }
                });
                bfsLog.push({ type: 'process', node: v, added: added, queue: simQ.slice() });
            }
            bfsLog.forEach(function(entry, idx) {
                (function(e, i) {
                    if (e.type === 'start') {
                        steps.push({ description: 'Start BFS from <strong>' + e.node + '</strong> — enqueue and mark visited. BFS uses a queue (FIFO) to explore <em>nearest nodes first, in order</em>. order[' + e.node + ']=1',
                            action: function() { order[e.node] = 1; renderNodes(n, order, e.node, [e.node]); infoEl.innerHTML = 'order[' + e.node + '] = 1, Queue = [' + e.node + ']'; },
                            undo: function() { order = {}; renderNodes(n, {}, null, []); infoEl.innerHTML = ''; } });
                    } else {
                        var addedDesc = e.added.length > 0 ? 'Unvisited neighbors <strong>' + e.added.join(', ') + '</strong> added to back of queue — ascending order means smaller numbers first' : 'All neighbors already visited — visited check prevents infinite loops';
                        steps.push({ description: 'Dequeue front node <strong>' + e.node + '</strong> (FIFO: process nodes that entered first) \u2192 ' + addedDesc,
                            action: function() { e.added.forEach(function(u) { order[u] = simOrder[u]; }); renderNodes(n, order, e.node, e.queue); infoEl.innerHTML = addedDesc + '. Queue = [' + e.queue.join(', ') + ']'; },
                            undo: function() { e.added.forEach(function(u) { delete order[u]; }); renderNodes(n, order, null, []); infoEl.innerHTML = ''; } });
                    }
                })(entry, idx);
            });
            var result = []; for (var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: 'Queue is empty — <strong>traversal complete</strong>. Thanks to FIFO, BFS visited nodes in order of distance: distance-1 nodes first, then distance-2, and so on. Result: <strong>' + result.join(',') + '</strong>',
                action: function() { renderNodes(n, order, null, []); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 visit order: ' + result.join(',') + '</strong>'; },
                undo: function() { renderNodes(n, order, null, []); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n = parseInt(container.querySelector('#gr-bfs1-n').value)||DEFAULT_N;
            var start = parseInt(container.querySelector('#gr-bfs1-start').value)||DEFAULT_START;
            var edges = parseEdges(container.querySelector('#gr-bfs1-edges').value);
            renderNodes(n, {}, null, []); infoEl.innerHTML = '';
            self._initStepController(container, buildSteps(n, start, edges), suffix);
        }
        container.querySelector('#gr-bfs1-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 5: BFS Descending Order (boj-24445)
    // ====================================================================
    _renderVizBFS2: function(container) {
        var self = this, suffix = '-bfs2';
        var DEFAULT_N = 5, DEFAULT_START = 1, DEFAULT_EDGES = '1 4, 1 2, 2 3, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">BFS Descending Order Visit</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Records the BFS visit order in descending order.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bfs2-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start: <input type="number" id="gr-bfs2-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-bfs2-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bfs2-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return b-a;}); // descending
            return adj;
        }
        function renderNodes(n, ord, cur, q) {
            var nodes=[]; for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'+nodes.map(function(nd){
                var bg=ord[nd]?'#fdcb6e':'var(--bg2)'; if(nd===cur) bg='var(--yellow)';
                return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;background:'+bg+';color:'+(ord[nd]?'#2d3436':'var(--text)')+';">'+
                '<div>'+nd+'</div><div style="font-size:0.7rem;">'+(ord[nd]?'order='+ord[nd]:'')+'</div></div>';
            }).join('')+'</div>'+(q&&q.length?'<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">\uD050: ['+q.join(', ')+']</div>':'');
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [], order = {};
            var simOrder = {}, simCnt = 0, simQ = [start], simVis = {};
            simVis[start] = true; simCnt++; simOrder[start] = simCnt;
            var bfsLog = [{ type: 'start', node: start, order: simCnt, queue: simQ.slice() }];
            while (simQ.length > 0) {
                var v = simQ.shift(); var added = [];
                (adj[v]||[]).forEach(function(u) { if (!simVis[u]) { simVis[u]=true; simCnt++; simOrder[u]=simCnt; simQ.push(u); added.push(u); } });
                bfsLog.push({ type:'process', node:v, added:added, queue:simQ.slice() });
            }
            bfsLog.forEach(function(entry) {
                (function(e) {
                    if (e.type==='start') {
                        steps.push({ description: 'Start BFS from <strong>'+e.node+'</strong> — this time neighbors are explored in <em>descending</em> order. Changing the enqueue order changes the visit order.',
                            action: function() { order[e.node]=1; renderNodes(n,order,e.node,[e.node]); infoEl.innerHTML='order['+e.node+'] = 1'; },
                            undo: function() { order={}; renderNodes(n,{},null,[]); infoEl.innerHTML=''; } });
                    } else {
                        var addedDesc = e.added.length>0 ? 'Unvisited neighbors <strong>'+e.added.join(', ')+'</strong> added to queue in descending order' : 'All neighbors already visited — nothing more to spread';
                        steps.push({ description: 'Dequeue front node <strong>'+e.node+'</strong> (FIFO) \u2192 '+addedDesc,
                            action: function() { e.added.forEach(function(u){order[u]=simOrder[u];}); renderNodes(n,order,e.node,e.queue); infoEl.innerHTML=addedDesc; },
                            undo: function() { e.added.forEach(function(u){delete order[u];}); renderNodes(n,order,null,[]); infoEl.innerHTML=''; } });
                    }
                })(entry);
            });
            var result=[]; for(var i=1;i<=n;i++) result.push(simOrder[i]||0);
            steps.push({ description: 'Traversal complete — compare with ascending BFS: the <em>visit order is different</em>. Adjacency list sort order affects BFS results. Result: <strong>'+result.join(',')+'</strong>',
                action: function() { renderNodes(n,order,null,[]); infoEl.innerHTML='<strong style="color:var(--green);">\u2705 visit order: '+result.join(',')+'</strong>'; },
                undo: function() { renderNodes(n,order,null,[]); infoEl.innerHTML=''; } });
            return steps;
        }
        function init() {
            var n=parseInt(container.querySelector('#gr-bfs2-n').value)||DEFAULT_N;
            var start=parseInt(container.querySelector('#gr-bfs2-start').value)||DEFAULT_START;
            var edges=parseEdges(container.querySelector('#gr-bfs2-edges').value);
            renderNodes(n,{},null,[]); infoEl.innerHTML='';
            self._initStepController(container, buildSteps(n,start,edges), suffix);
        }
        container.querySelector('#gr-bfs2-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 6: DFS and BFS (boj-1260)
    // ====================================================================
    _renderVizDFSBFS: function(container) {
        var self = this, suffix = '-dfsbfs';
        var DEFAULT_N = 4, DEFAULT_START = 1, DEFAULT_EDGES = '1 2, 1 3, 1 4, 2 4, 3 4';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">DFS vs BFS Comparison</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Compares DFS and BFS visit orders.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-dfsbfs-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start: <input type="number" id="gr-dfsbfs-start" value="' + DEFAULT_START + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-dfsbfs-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-dfsbfs-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s) { return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);}); }
        function buildAdj(n, edges) {
            var adj={}; for(var i=1;i<=n;i++) adj[i]=[];
            edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});
            for(var i=1;i<=n;i++) adj[i].sort(function(a,b){return a-b;});
            return adj;
        }
        function buildSteps(n, start, edges) {
            var adj = buildAdj(n, edges), steps = [];
            // DFS
            var dfsResult = [], dfsVis = {};
            function dfs(v) { dfsVis[v]=true; dfsResult.push(v); (adj[v]||[]).forEach(function(u){if(!dfsVis[u]) dfs(u);}); }
            dfs(start);
            // BFS
            var bfsResult = [], bfsVis = {}, bfsQ = [start]; bfsVis[start]=true; bfsResult.push(start);
            while(bfsQ.length>0) { var v=bfsQ.shift(); (adj[v]||[]).forEach(function(u){if(!bfsVis[u]){bfsVis[u]=true;bfsResult.push(u);bfsQ.push(u);}}); }

            var dfsShown = [];
            dfsResult.forEach(function(node, idx) {
                (function(nd, i) {
                    steps.push({
                        description: 'DFS: ' + (i===0 ? '<strong>' + nd + '</strong> — start. DFS uses recursion/stack to explore <em>one path as deep as possible</em> before backtracking' : '\u2192 <strong>' + nd + '</strong> — dive deeper. If there is a deeper unvisited node, DFS keeps going'),
                        action: function() { dfsShown = dfsResult.slice(0,i+1); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsShown.join(' \u2192 '); infoEl.innerHTML = 'DFS in progress...'; },
                        undo: function() { dfsShown = dfsResult.slice(0,i); areaEl.innerHTML = i>0 ? '<strong>DFS:</strong> ' + dfsShown.join(' \u2192 ') : ''; infoEl.innerHTML = ''; }
                    });
                })(node, idx);
            });
            var bfsShown = [];
            bfsResult.forEach(function(node, idx) {
                (function(nd, i) {
                    steps.push({
                        description: 'BFS: ' + (i===0 ? '<strong>' + nd + '</strong> — start. BFS uses a queue (FIFO) to visit <em>all nodes at the same distance first</em>' : '\u2192 <strong>' + nd + '</strong> — queue order processes closer nodes first, so BFS visits in a different order than DFS'),
                        action: function() { bfsShown = bfsResult.slice(0,i+1); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsShown.join(' \u2192 '); infoEl.innerHTML = 'BFS in progress...'; },
                        undo: function() { bfsShown = bfsResult.slice(0,i); areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' \u2192 ') + (i>0?'<br><strong>BFS:</strong> '+bfsShown.join(' \u2192 '):''); infoEl.innerHTML = ''; }
                    });
                })(node, idx);
            });
            steps.push({ description: '<strong>Comparison complete!</strong> DFS explored depth-first along one path before backtracking, while BFS spread level by level in distance order. Same graph, <em>different traversal orders</em>.',
                action: function() { areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsResult.join(' '); infoEl.innerHTML = '<strong style="color:var(--green);">\u2705 DFS: ' + dfsResult.join(' ') + ' / BFS: ' + bfsResult.join(' ') + '</strong>'; },
                undo: function() { areaEl.innerHTML = '<strong>DFS:</strong> ' + dfsResult.join(' ') + '<br><strong>BFS:</strong> ' + bfsResult.join(' \u2192 '); infoEl.innerHTML = ''; } });
            return steps;
        }
        function init() {
            var n=parseInt(container.querySelector('#gr-dfsbfs-n').value)||DEFAULT_N;
            var start=parseInt(container.querySelector('#gr-dfsbfs-start').value)||DEFAULT_START;
            var edges=parseEdges(container.querySelector('#gr-dfsbfs-edges').value);
            areaEl.innerHTML=''; infoEl.innerHTML='';
            self._initStepController(container, buildSteps(n,start,edges), suffix);
        }
        container.querySelector('#gr-dfsbfs-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 7: Organic Cabbage (boj-1012)
    // ====================================================================
    _renderVizCabbage: function(container) {
        var self = this, suffix = '-cab';
        var DEFAULT_GRID = '1 1 0 0; 0 1 0 1; 0 0 0 1; 1 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Organic Cabbage — Flood Fill</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Counting cabbage clusters (connected components).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by ;): <input type="text" id="gr-cab-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-cab-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseGrid(s) { return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);}); }
        var palette = ['var(--bg2)', '#d63031', '#0984e3', '#00b894', '#e17055', '#6c5ce7', '#fdcb6e', '#00cec9'];
        function renderGrid(grid, colors) {
            var cols = grid[0].length;
            areaEl.innerHTML = '<div style="display:inline-grid;grid-template-columns:repeat('+cols+',44px);gap:3px;">' + grid.map(function(row,r) {
                return row.map(function(v,c) {
                    var bg = colors[r][c] ? palette[colors[r][c] % palette.length] : (v ? '#dfe6e9' : 'var(--bg2)');
                    return '<div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;background:'+bg+';color:'+(colors[r][c]?'white':'var(--text3)')+';">'+(v?'\uD83E\uDD66':'')+'</div>';
                }).join('');
            }).join('') + '</div>';
        }
        function buildSteps(grid) {
            var R = grid.length, C = grid[0].length;
            var vis = [], colors = [];
            for (var r=0;r<R;r++) { vis.push([]); colors.push([]); for(var c=0;c<C;c++) { vis[r].push(false); colors[r].push(0); } }
            var dx=[0,0,1,-1], dy=[1,-1,0,0], steps=[], groupId=0;
            for (var r=0;r<R;r++) for(var c=0;c<C;c++) {
                if (grid[r][c]===1 && !vis[r][c]) {
                    groupId++;
                    // BFS to find component
                    var q=[[r,c]], comp=[];
                    vis[r][c]=true;
                    while(q.length>0) { var cur=q.shift(); comp.push(cur); for(var d=0;d<4;d++){var nr=cur[0]+dx[d],nc=cur[1]+dy[d]; if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1&&!vis[nr][nc]){vis[nr][nc]=true;q.push([nr,nc]);}}}
                    (function(gid, cells) {
                        var cellStr = cells.map(function(p){return '('+p[0]+','+p[1]+')';}).join(',');
                        steps.push({
                            description: 'Found <strong>unvisited cabbage</strong> at ('+cells[0][0]+','+cells[0][1]+') — this means a new connected component. BFS/DFS explores all connected cabbages to form cluster #'+gid+': <strong>'+cells.length+' cells</strong>. One worm covers this entire cluster.',
                            action: function() { cells.forEach(function(p){colors[p[0]][p[1]]=gid;}); renderGrid(grid,colors); infoEl.innerHTML='Cluster #'+gid+': '+cellStr+' → '+cells.length+' cells'; },
                            undo: function() { cells.forEach(function(p){colors[p[0]][p[1]]=0;}); renderGrid(grid,colors); infoEl.innerHTML=''; }
                        });
                    })(groupId, comp);
                }
            }
            var totalGroups = groupId;
            steps.push({ description: 'Entire grid scanned — <strong>traversal complete</strong>. One connected component = one worm, so <strong>'+totalGroups+' worms</strong> are needed.',
                action: function() { renderGrid(grid,colors); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 Worms needed = '+totalGroups+'</strong>'; },
                undo: function() { renderGrid(grid,colors); infoEl.innerHTML=''; } });
            return steps;
        }
        function init() {
            var grid = parseGrid(container.querySelector('#gr-cab-grid').value);
            var emptyColors = grid.map(function(row){return row.map(function(){return 0;});});
            renderGrid(grid, emptyColors); infoEl.innerHTML='';
            self._initStepController(container, buildSteps(grid), suffix);
        }
        container.querySelector('#gr-cab-reset').addEventListener('click', function() { self._clearVizState(); init(); });
        init();
    },

    // ====================================================================
    // Simulation 8: Numbering Neighborhoods (boj-2667)
    // ====================================================================
    _renderVizComplex: function(container) {
        var self = this, suffix = '-cpx';
        var DEFAULT_GRID = '0 1 1 0 1 0 0; 0 1 1 0 1 0 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Numbering Neighborhoods</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finds the number and sizes of connected components.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by ;): <input type="text" id="gr-cpx-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-cpx-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s) { return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);}); }
        var palette = ['var(--bg2)', '#0984e3', '#d63031', '#00b894', '#e17055', '#6c5ce7', '#fdcb6e'];
        function renderGrid(grid, colors) {
            var cols=grid[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+cols+',40px);gap:2px;">'+grid.map(function(row,r){
                return row.map(function(v,c){
                    var bg=colors[r][c]?palette[colors[r][c]%palette.length]:(v?'#dfe6e9':'var(--bg2)');
                    return '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(colors[r][c]?'white':'var(--text3)')+';">'+(v?v:'')+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(grid) {
            var R=grid.length, C=grid[0].length, vis=[], colors=[];
            for(var r=0;r<R;r++){vis.push([]);colors.push([]);for(var c=0;c<C;c++){vis[r].push(false);colors[r].push(0);}}
            var dx=[0,0,1,-1],dy=[1,-1,0,0],steps=[],groupId=0,sizes=[];
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){
                if(grid[r][c]===1&&!vis[r][c]){
                    groupId++;
                    var q=[[r,c]],comp=[];vis[r][c]=true;
                    while(q.length>0){var cur=q.shift();comp.push(cur);for(var d=0;d<4;d++){var nr=cur[0]+dx[d],nc=cur[1]+dy[d];if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===1&&!vis[nr][nc]){vis[nr][nc]=true;q.push([nr,nc]);}}}
                    sizes.push(comp.length);
                    (function(gid,cells){
                        steps.push({
                            description:'Found <strong>unvisited house</strong> at ('+cells[0][0]+','+cells[0][1]+') — BFS explores all 4-directionally connected houses to form one neighborhood. Neighborhood #'+gid+': <strong>'+cells.length+' cells</strong>',
                            action:function(){cells.forEach(function(p){colors[p[0]][p[1]]=gid;});renderGrid(grid,colors);infoEl.innerHTML='Neighborhood #'+gid+': '+cells.length+' cells';},
                            undo:function(){cells.forEach(function(p){colors[p[0]][p[1]]=0;});renderGrid(grid,colors);infoEl.innerHTML='';}
                        });
                    })(groupId,comp);
                }
            }
            var sortedSizes=sizes.slice().sort(function(a,b){return a-b;});
            steps.push({description:'Grid scan complete — connected component = neighborhood, so <strong>'+groupId+' neighborhoods</strong>. Sizes in ascending order: <strong>'+sortedSizes.join(', ')+'</strong>',
                action:function(){renderGrid(grid,colors);infoEl.innerHTML='<strong style="color:var(--green);">\u2705 Neighborhoods: '+groupId+' / Sizes (ascending): '+sortedSizes.join(', ')+'</strong>';},
                undo:function(){renderGrid(grid,colors);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-cpx-grid').value);
            var emptyColors=grid.map(function(row){return row.map(function(){return 0;});});
            renderGrid(grid,emptyColors);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-cpx-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 9: Maze Exploration (boj-2178)
    // ====================================================================
    _renderVizMaze: function(container) {
        var self = this, suffix = '-maze';
        var DEFAULT_GRID = '1 0 1 1; 1 1 1 0; 0 1 0 1; 0 1 1 1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Maze Exploration — BFS Shortest Distance</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finds the BFS shortest path from (0,0) to (N-1,M-1).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (1=path, 0=wall; rows separated by ;): <input type="text" id="gr-maze-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-maze-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderMaze(maze, dist){
            var C=maze[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+C+',48px);gap:3px;">'+maze.map(function(row,r){
                return row.map(function(v,c){
                    var bg=v===0?'#2d3436':(dist[r][c]>=0?'#e84393':'#dfe6e9');
                    return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(dist[r][c]>=0?'white':(v===0?'#636e72':'var(--text)'))+';">'+(dist[r][c]>=0?dist[r][c]:(v===0?'\u2588':'\u00B7'))+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(maze){
            var R=maze.length, C=maze[0].length, dist=[];
            for(var r=0;r<R;r++){dist.push([]);for(var c=0;c<C;c++) dist[r].push(-1);}
            var dx=[0,0,1,-1],dy=[1,-1,0,0],steps=[];
            // BFS simulation level by level
            dist[0][0]=1;
            var q=[[0,0]], level=1;
            var bfsLevels=[[{r:0,c:0,d:1}]];
            while(q.length>0){
                var nextQ=[], nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<4;d++){
                        var nr=pos[0]+dx[d],nc=pos[1]+dy[d];
                        if(nr>=0&&nr<R&&nc>=0&&nc<C&&maze[nr][nc]===1&&dist[nr][nc]<0){
                            dist[nr][nc]=dist[pos[0]][pos[1]]+1;
                            nextQ.push([nr,nc]);
                            nextLevel.push({r:nr,c:nc,d:dist[nr][nc]});
                        }
                    }
                });
                if(nextLevel.length>0) bfsLevels.push(nextLevel);
                q=nextQ;
            }
            var finalDist=dist[R-1][C-1];
            // reset dist for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[r][c]=-1;

            bfsLevels.forEach(function(levelCells, li){
                (function(cells,idx){
                    var cellsStr=cells.map(function(p){return '('+p.r+','+p.c+')='+p.d;}).join(', ');
                    steps.push({
                        description: idx===0?'BFS starts from (0,0) — BFS explores <em>closest cells first</em>, so the first time we reach a cell is guaranteed to be the shortest distance. dist=1':'<strong>Level '+idx+'</strong> expansion: '+cellsStr+' — all unvisited path cells one step away from the previous level are discovered.',
                        action:function(){cells.forEach(function(p){dist[p.r][p.c]=p.d;});renderMaze(maze,dist);infoEl.innerHTML=cellsStr;},
                        undo:function(){cells.forEach(function(p){dist[p.r][p.c]=-1;});renderMaze(maze,dist);infoEl.innerHTML='';}
                    });
                })(levelCells,li);
            });
            steps.push({description:'BFS complete — <strong>(0,0)\u2192('+(R-1)+','+(C-1)+')</strong> shortest distance = <strong>'+(finalDist>=0?finalDist+' cells':'unreachable')+'</strong>. BFS expands level by level, so the first path to arrive is always the shortest.',
                action:function(){renderMaze(maze,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 Shortest distance = '+(finalDist>=0?finalDist+' cells':'unreachable')+'</strong>';},
                undo:function(){renderMaze(maze,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var maze=parseGrid(container.querySelector('#gr-maze-grid').value);
            var emptyDist=maze.map(function(row){return row.map(function(){return -1;});});
            renderMaze(maze,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(maze),suffix);
        }
        container.querySelector('#gr-maze-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 10: Hide and Seek (boj-1697)
    // ====================================================================
    _renderVizHide: function(container) {
        var self = this, suffix = '-hide';
        var DEFAULT_N = 5, DEFAULT_K = 17;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Hide and Seek — Coordinate BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Move from N to K using (X-1, X+1, 2*X).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (start): <input type="number" id="gr-hide-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">K (target): <input type="number" id="gr-hide-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="gr-hide-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function buildSteps(startN, targetK) {
            // BFS to find shortest path then trace back
            var MAX = Math.max(startN, targetK) * 2 + 5;
            if (MAX > 200001) MAX = 200001;
            var dist = new Array(MAX); for(var i=0;i<MAX;i++) dist[i]=-1;
            var prev = new Array(MAX); for(var i=0;i<MAX;i++) prev[i]=-1;
            dist[startN]=0;
            var q=[startN];
            while(q.length>0){
                var v=q.shift();
                if(v===targetK) break;
                var nexts=[v-1,v+1,v*2];
                nexts.forEach(function(nv){
                    if(nv>=0&&nv<MAX&&dist[nv]<0){dist[nv]=dist[v]+1;prev[nv]=v;q.push(nv);}
                });
            }
            // trace path
            var path=[];
            if(dist[targetK]>=0){
                var cur=targetK; while(cur!==-1){path.unshift(cur);cur=prev[cur];}
            } else {
                path=[startN];
            }
            var steps=[], shown=[];
            path.forEach(function(node, idx){
                (function(nd,i){
                    var desc;
                    if(i===0) desc='Start at position <strong>'+nd+'</strong> — BFS explores X-1, X+1, 2*X as three edges, guaranteeing the <em>minimum number of moves</em>.';
                    else {
                        var prevNode=path[i-1];
                        if(nd===prevNode*2) desc=prevNode+'\u00D72=<strong>'+nd+'</strong> teleport ('+i+'s) — multiplication reaches farther faster, so BFS chose this path.';
                        else if(nd===prevNode+1) desc=prevNode+'+1=<strong>'+nd+'</strong> step forward ('+i+'s) — at this point, +1 is part of the shortest path.';
                        else desc=prevNode+'-1=<strong>'+nd+'</strong> step back ('+i+'s) — stepping back before a 2x jump can be faster than walking forward.';
                    }
                    steps.push({
                        description:desc,
                        action:function(){ shown=path.slice(0,i+1); areaEl.innerHTML=shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 '); infoEl.innerHTML='dist['+nd+'] = '+i; },
                        undo:function(){ shown=path.slice(0,i); areaEl.innerHTML=shown.length>0?shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 '):''; infoEl.innerHTML=i>0?'dist['+path[i-1]+'] = '+(i-1):''; }
                    });
                })(node,idx);
            });
            if(dist[targetK]>=0){
                steps.push({description:'<strong>Target reached!</strong> BFS treats all moves as cost 1, so the first path found is the <em>shortest path</em>. Minimum time = <strong>'+dist[targetK]+'s</strong>',
                    action:function(){areaEl.innerHTML=path.join(' \u2192 ');infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 Minimum time = '+dist[targetK]+'s</strong>';},
                    undo:function(){areaEl.innerHTML=path.map(function(p,j){return j===path.length-1?'<strong>'+p+'</strong>':p;}).join(' \u2192 ');infoEl.innerHTML='';}});
            }
            return steps;
        }
        function init(){
            var n=parseInt(container.querySelector('#gr-hide-n').value); if(isNaN(n)) n=DEFAULT_N;
            var k=parseInt(container.querySelector('#gr-hide-k').value); if(isNaN(k)) k=DEFAULT_K;
            areaEl.innerHTML='';infoEl.innerHTML='';
            self._initStepController(container,buildSteps(n,k),suffix);
        }
        container.querySelector('#gr-hide-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 11: Knight Moves (boj-7562)
    // ====================================================================
    _renderVizKnight: function(container) {
        var self = this, suffix = '-knight';
        var DEFAULT_SIZE = 8, DEFAULT_SR = 0, DEFAULT_SC = 0, DEFAULT_ER = 7, DEFAULT_EC = 0;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Knight Moves — BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finds the minimum number of knight moves on a chessboard.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Size: <input type="number" id="gr-knight-size" value="' + DEFAULT_SIZE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Start(r,c): <input type="text" id="gr-knight-start" value="' + DEFAULT_SR + ',' + DEFAULT_SC + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">Target(r,c): <input type="text" id="gr-knight-end" value="' + DEFAULT_ER + ',' + DEFAULT_EC + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="gr-knight-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        var kdr=[-2,-2,-1,-1,1,1,2,2],kdc=[-1,1,-2,2,-2,2,-1,1];

        function buildSteps(sz, sr, sc, er, ec) {
            var dist=[]; for(var r=0;r<sz;r++){dist.push([]);for(var c=0;c<sz;c++) dist[r].push(-1);}
            var prev=[]; for(var r=0;r<sz;r++){prev.push([]);for(var c=0;c<sz;c++) prev[r].push(null);}
            dist[sr][sc]=0;
            var q=[[sr,sc]];
            // BFS level by level
            var levels=[[{r:sr,c:sc}]];
            var found=false;
            while(q.length>0&&!found){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<8;d++){
                        var nr=pos[0]+kdr[d],nc=pos[1]+kdc[d];
                        if(nr>=0&&nr<sz&&nc>=0&&nc<sz&&dist[nr][nc]<0){
                            dist[nr][nc]=dist[pos[0]][pos[1]]+1;
                            prev[nr][nc]=[pos[0],pos[1]];
                            nextQ.push([nr,nc]);
                            nextLevel.push({r:nr,c:nc});
                            if(nr===er&&nc===ec) found=true;
                        }
                    }
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var finalDist=dist[er][ec];
            var steps=[];
            // Show level by level (but max ~6 levels to keep concise)
            var maxLevels = Math.min(levels.length, finalDist >= 0 ? finalDist + 2 : levels.length);
            for(var li=0;li<maxLevels;li++){
                (function(levelIdx, cells){
                    var cellsStr = cells.length<=6 ? cells.map(function(p){return '('+p.r+','+p.c+')';}).join(', ') : cells.length+' positions';
                    steps.push({
                        description: levelIdx===0 ? 'Start at ('+sr+','+sc+') — the knight has 8 L-shaped moves. BFS discovers <em>cells with fewer moves first</em>, guaranteeing the minimum number of moves.' : '<strong>Move '+levelIdx+'</strong>: positions reachable — '+cellsStr+'. These are all unvisited cells reachable by L-shaped jumps from the previous level.',
                        action: function() { areaEl.innerHTML = 'Move '+levelIdx+': '+cellsStr; infoEl.innerHTML = 'dist='+levelIdx+', '+cells.length+' positions'; },
                        undo: function() { areaEl.innerHTML = ''; infoEl.innerHTML = ''; }
                    });
                })(li, levels[li]);
            }
            steps.push({description: finalDist>=0 ? 'BFS complete — <strong>'+finalDist+' moves</strong> to reach ('+er+','+ec+')! This is the minimum guaranteed by BFS.' : '('+er+','+ec+') is <strong>unreachable</strong> — the knight\'s L-shaped moves cannot reach that position.',
                action: function() { areaEl.innerHTML = '('+sr+','+sc+') \u2192 ('+er+','+ec+')<br><strong>'+finalDist+' moves</strong>'; infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">\u2705 Minimum moves = '+finalDist+'</strong>'; },
                undo: function() { areaEl.innerHTML = ''; infoEl.innerHTML = ''; }});
            return steps;
        }
        function init(){
            var sz=parseInt(container.querySelector('#gr-knight-size').value)||DEFAULT_SIZE;
            var sp=container.querySelector('#gr-knight-start').value.split(',').map(Number);
            var ep=container.querySelector('#gr-knight-end').value.split(',').map(Number);
            var sr=sp[0]||0,sc=sp[1]||0,er=ep[0]||0,ec=ep[1]||0;
            areaEl.innerHTML='';infoEl.innerHTML='';
            self._initStepController(container,buildSteps(sz,sr,sc,er,ec),suffix);
        }
        container.querySelector('#gr-knight-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 12: Tomato (boj-7576)
    // ====================================================================
    _renderVizTomato: function(container) {
        var self = this, suffix = '-tom';
        var DEFAULT_GRID = '0 0 0 1; 0 -1 0 0; 0 0 0 0; 1 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Tomato — Multi-source BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">1=ripe, 0=unripe, -1=empty. BFS from all ripe tomatoes simultaneously.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by ;): <input type="text" id="gr-tom-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-tom-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderTomato(grid, dist){
            var C=grid[0].length;
            areaEl.innerHTML='<div style="display:inline-grid;grid-template-columns:repeat('+C+',48px);gap:3px;">'+grid.map(function(row,r){
                return row.map(function(v,c){
                    var bg=v===-1?'#2d3436':(dist[r][c]>=0?'#a29bfe':'#dfe6e9');
                    var txt=v===-1?'X':(dist[r][c]>=0?dist[r][c]:'\uD83C\uDF45');
                    return '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:'+bg+';color:'+(dist[r][c]>=0?'white':(v===-1?'#636e72':'var(--text)'))+';">'+txt+'</div>';
                }).join('');
            }).join('')+'</div>';
        }
        function buildSteps(grid){
            var R=grid.length,C=grid[0].length,dist=[],dx=[0,0,1,-1],dy=[1,-1,0,0];
            for(var r=0;r<R;r++){dist.push([]);for(var c=0;c<C;c++) dist[r].push(-1);}
            var q=[];
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) if(grid[r][c]===1){dist[r][c]=0;q.push([r,c]);}
            // BFS level by level
            var levels=[q.map(function(p){return {r:p[0],c:p[1]};})];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<4;d++){var nr=pos[0]+dx[d],nc=pos[1]+dy[d];
                        if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc]===0&&dist[nr][nc]<0){dist[nr][nc]=dist[pos[0]][pos[1]]+1;nextQ.push([nr,nc]);nextLevel.push({r:nr,c:nc,d:dist[nr][nc],pr:pos[0],pc:pos[1]});}}
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var maxDist=0,impossible=false;
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){if(grid[r][c]===0&&dist[r][c]<0) impossible=true; if(dist[r][c]>maxDist) maxDist=dist[r][c];}
            // reset dist for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[r][c]=-1;
            var steps=[];
            // level 0: initial ripe tomatoes
            var initCells=levels[0];
            steps.push({
                description:'<strong>Multi-source BFS</strong> — enqueue all <strong>'+initCells.length+'</strong> ripe tomatoes <em>simultaneously</em> as starting points. Even with multiple sources, a single BFS handles it all.',
                action:function(){initCells.forEach(function(p){dist[p.r][p.c]=0;});renderTomato(grid,dist);infoEl.innerHTML='Starting points: '+initCells.length;},
                undo:function(){initCells.forEach(function(p){dist[p.r][p.c]=-1;});renderTomato(grid,dist);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell,levelIdx){
                        var desc='<strong>Day '+levelIdx+'</strong>: ('+cell.r+','+cell.c+') ripens from adjacent ('+cell.pr+','+cell.pc+') — ripening spreads one cell per day in 4 directions, so BFS level = number of elapsed days.';
                        steps.push({
                            description:desc,
                            action:function(){dist[cell.r][cell.c]=cell.d;renderTomato(grid,dist);infoEl.innerHTML=desc;},
                            undo:function(){dist[cell.r][cell.c]=-1;renderTomato(grid,dist);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci],li);
                }
            }
            steps.push({description:impossible?'BFS finished but <strong>unripe tomatoes remain</strong> — walls (-1) block propagation to some cells, so the answer is <strong>-1</strong>':'BFS complete! The distance of the last tomato to ripen is the answer — minimum days to ripen all = <strong>'+maxDist+'</strong>',
                action:function(){renderTomato(grid,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(impossible?'Result = -1 (impossible)':'Minimum days = '+maxDist)+'</strong>';},
                undo:function(){renderTomato(grid,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-tom-grid').value);
            var emptyDist=grid.map(function(row){return row.map(function(){return -1;});});
            renderTomato(grid,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-tom-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 13: Tomato 3D (boj-7569)
    // ====================================================================
    _renderVizTomato3: function(container) {
        var self = this, suffix = '-tom3';
        var DEFAULT_LAYERS = '0 0 0, 0 0 0 | 0 0 1, 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Tomato 3D — 6-directional BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Layers separated by |, rows by comma. 6 directions (up/down/left/right + above/below).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">3D Grid: <input type="text" id="gr-tom3-layers" value="' + DEFAULT_LAYERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:340px;"></label>' +
            '<button class="btn btn-primary" id="gr-tom3-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseLayers(s){
            return s.split('|').map(function(layer){
                return layer.trim().split(',').map(function(row){return row.trim().split(/\s+/).map(Number);});
            });
        }
        function render3D(layers, dist){
            var html='';
            layers.forEach(function(layer,h){
                var C=layer[0].length;
                html+='<div style="margin-bottom:8px;"><strong style="font-size:0.8rem;color:var(--text3);">'+(h+1)+' Floor</strong><div style="display:inline-grid;grid-template-columns:repeat('+C+',36px);gap:2px;margin-top:4px;">';
                layer.forEach(function(row,r){
                    row.forEach(function(v,c){
                        var bg=v===-1?'#2d3436':(dist[h][r][c]>=0?'#55efc4':'#dfe6e9');
                        var txt=v===-1?'X':(dist[h][r][c]>=0?dist[h][r][c]:(v===1?'1':'\u00B7'));
                        html+='<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist[h][r][c]>=0?'#2d3436':(v===-1?'#636e72':'var(--text)'))+';">'+txt+'</div>';
                    });
                });
                html+='</div></div>';
            });
            areaEl.innerHTML=html;
        }
        function buildSteps(layers){
            var H=layers.length, R=layers[0].length, C=layers[0][0].length;
            var dist=[]; for(var h=0;h<H;h++){dist.push([]);for(var r=0;r<R;r++){dist[h].push([]);for(var c=0;c<C;c++) dist[h][r].push(-1);}}
            var dh=[0,0,0,0,1,-1],dr=[0,0,1,-1,0,0],dc=[1,-1,0,0,0,0];
            var q=[];
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++) if(layers[h][r][c]===1){dist[h][r][c]=0;q.push([h,r,c]);}
            var levels=[q.map(function(p){return {h:p[0],r:p[1],c:p[2]};})];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    for(var d=0;d<6;d++){var nh=pos[0]+dh[d],nr=pos[1]+dr[d],nc=pos[2]+dc[d];
                        if(nh>=0&&nh<H&&nr>=0&&nr<R&&nc>=0&&nc<C&&layers[nh][nr][nc]===0&&dist[nh][nr][nc]<0){
                            dist[nh][nr][nc]=dist[pos[0]][pos[1]][pos[2]]+1;nextQ.push([nh,nr,nc]);nextLevel.push({h:nh,r:nr,c:nc,d:dist[nh][nr][nc],ph:pos[0],pr:pos[1],pc:pos[2]});}}
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var maxDist=0,impossible=false;
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++){if(layers[h][r][c]===0&&dist[h][r][c]<0) impossible=true; if(dist[h][r][c]>maxDist) maxDist=dist[h][r][c];}
            // reset for step-by-step
            for(var h=0;h<H;h++) for(var r=0;r<R;r++) for(var c=0;c<C;c++) dist[h][r][c]=-1;
            var steps=[];
            // level 0: initial ripe tomatoes
            var initCells3=levels[0];
            steps.push({
                description:'<strong>3D Multi-source BFS</strong> — enqueue <strong>'+initCells3.length+'</strong> ripe tomatoes. Same principle as 2D, but propagation includes up/down floors for <em>6 directions</em> total.',
                action:function(){initCells3.forEach(function(p){dist[p.h][p.r][p.c]=0;});render3D(layers,dist);infoEl.innerHTML='Starting points: '+initCells3.length;},
                undo:function(){initCells3.forEach(function(p){dist[p.h][p.r][p.c]=-1;});render3D(layers,dist);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell,levelIdx){
                        var desc='<strong>Day '+levelIdx+'</strong>: floor '+cell.h+'('+cell.r+','+cell.c+') ripens from floor '+cell.ph+'('+cell.pr+','+cell.pc+') — '+(cell.h!==cell.ph?'cross-floor propagation (up/down among the 6 directions)':'same-floor 4-directional spread');
                        steps.push({
                            description:desc,
                            action:function(){dist[cell.h][cell.r][cell.c]=cell.d;render3D(layers,dist);infoEl.innerHTML=desc;},
                            undo:function(){dist[cell.h][cell.r][cell.c]=-1;render3D(layers,dist);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci],li);
                }
            }
            steps.push({description:impossible?'<strong>Unreachable tomatoes exist</strong> — even 6-directional propagation cannot reach some cells, so the answer is <strong>-1</strong>':'3D BFS complete! Maximum distance across 6-directional propagation is the answer — <strong>minimum days = '+maxDist+'</strong>',
                action:function(){render3D(layers,dist);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(impossible?'Result = -1':'3D BFS minimum days = '+maxDist)+'</strong>';},
                undo:function(){render3D(layers,dist);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var layers=parseLayers(container.querySelector('#gr-tom3-layers').value);
            var emptyDist=layers.map(function(l){return l.map(function(r){return r.map(function(){return -1;});});});
            render3D(layers,emptyDist);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(layers),suffix);
        }
        container.querySelector('#gr-tom3-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 14: Snakes and Ladders (boj-16928)
    // ====================================================================
    _renderVizSnake: function(container) {
        var self = this, suffix = '-snake';
        var DEFAULT_LADDERS = '12 98, 32 62, 42 68';
        var DEFAULT_SNAKES = '95 13, 97 25, 93 37';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Snakes and Ladders — BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finds the minimum dice rolls from square 1 to 100 using BFS.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Ladders (a b, ...): <input type="text" id="gr-snake-ladders" value="' + DEFAULT_LADDERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">Snakes (a b, ...): <input type="text" id="gr-snake-snakes" value="' + DEFAULT_SNAKES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="gr-snake-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parsePairs(s){return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);});}
        function buildSteps(ladders, snakes){
            var warp={};
            ladders.forEach(function(p){warp[p[0]]=p[1];});
            snakes.forEach(function(p){warp[p[0]]=p[1];});
            // BFS
            var dist=new Array(101); for(var i=0;i<=100;i++) dist[i]=-1;
            var prev=new Array(101); for(var i=0;i<=100;i++) prev[i]=-1;
            var warpUsed=new Array(101); for(var i=0;i<=100;i++) warpUsed[i]=null;
            dist[1]=0; var q=[1];
            while(q.length>0){
                var v=q.shift(); if(v===100) break;
                for(var dice=1;dice<=6;dice++){
                    var nv=v+dice; if(nv>100) continue;
                    var actual=warp[nv]!==undefined?warp[nv]:nv;
                    if(dist[actual]<0){dist[actual]=dist[v]+1;prev[actual]=v;if(warp[nv]!==undefined) warpUsed[actual]=nv;q.push(actual);}
                }
            }
            // trace path
            var path=[]; var cur=100;
            while(cur!==-1){path.unshift(cur);cur=prev[cur];}
            if(path[0]!==1) path=[1]; // no path found

            var steps=[], shown=[];
            var ladderSummary=ladders.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            var snakeSummary=snakes.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            areaEl.innerHTML='\uD83E\uDE9C Ladders: '+ladderSummary+'<br>\uD83D\uDC0D Snakes: '+snakeSummary;

            path.forEach(function(node,idx){
                (function(nd,i){
                    var desc;
                    if(i===0) desc='Start at <strong>square 1</strong> — dice rolls 1~6 become 6 BFS edges. Ladders/snakes are <em>automatic warps</em> with no extra cost, included within the same edge.';
                    else {
                        var prevNode=path[i-1];
                        if(warpUsed[nd]!==null){
                            var wp=warpUsed[nd];
                            var isLadder=ladders.some(function(l){return l[0]===wp;});
                            desc='<strong>Roll '+i+'</strong>: '+prevNode+' \u2192 '+wp+(isLadder?' \u2192 \uD83E\uDE9CLadder to <strong>'+nd+'</strong>! Free jump at no extra cost.':' \u2192 \uD83D\uDC0DSnake to <strong>'+nd+'</strong>! BFS accounts for this setback and still finds the optimal path.');
                        } else {
                            desc='<strong>Roll '+i+'</strong>: '+prevNode+' \u2192 <strong>'+nd+'</strong> — dice move along the shortest path found by BFS.';
                        }
                    }
                    steps.push({
                        description:desc,
                        action:function(){shown=path.slice(0,i+1);areaEl.innerHTML=shown.map(function(p,j){return j===shown.length-1?'<strong>'+p+'</strong>':''+p;}).join(' \u2192 ');infoEl.innerHTML='dist['+nd+'] = '+i;},
                        undo:function(){shown=path.slice(0,i);areaEl.innerHTML=shown.length>0?shown.join(' \u2192 '):'\uD83E\uDE9C Ladders: '+ladderSummary+'<br>\uD83D\uDC0D Snakes: '+snakeSummary;infoEl.innerHTML='';}
                    });
                })(node,idx);
            });
            if(dist[100]>=0){
                steps.push({description:'<strong>Reached square 100!</strong> BFS treats each dice roll as cost 1, so accounting for ladders and snakes, the <em>minimum dice rolls</em> = <strong>'+dist[100]+'</strong>',
                    action:function(){areaEl.innerHTML=path.join(' \u2192 ')+' \uD83C\uDFC1';infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 Minimum dice rolls = '+dist[100]+'</strong>';},
                    undo:function(){areaEl.innerHTML=path.join(' \u2192 ');infoEl.innerHTML='';}});
            }
            return steps;
        }
        function init(){
            var ladders=parsePairs(container.querySelector('#gr-snake-ladders').value);
            var snakes=parsePairs(container.querySelector('#gr-snake-snakes').value);
            var ladderSummary=ladders.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            var snakeSummary=snakes.map(function(p){return p[0]+'\u2192'+p[1];}).join(', ');
            areaEl.innerHTML='\uD83E\uDE9C Ladders: '+ladderSummary+'<br>\uD83D\uDC0D Snakes: '+snakeSummary;
            infoEl.innerHTML='';
            self._initStepController(container,buildSteps(ladders,snakes),suffix);
        }
        container.querySelector('#gr-snake-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 15: Bipartite Graph (boj-1707)
    // ====================================================================
    _renderVizBipartite: function(container) {
        var self = this, suffix = '-bip';
        var DEFAULT_N = 3, DEFAULT_EDGES = '1 3, 2 3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Bipartite Graph Check — 2-Coloring</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Checks whether adjacent vertices can be colored with different colors.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="gr-bip-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
            '<label style="font-weight:600;">Edges: <input type="text" id="gr-bip-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="gr-bip-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);

        function parseEdges(s){return s.split(',').map(function(e){var p=e.trim().split(/\s+/);return [parseInt(p[0]),parseInt(p[1])];}).filter(function(e){return !isNaN(e[0])&&!isNaN(e[1]);});}
        function buildAdj(n,edges){var adj={};for(var i=1;i<=n;i++) adj[i]=[];edges.forEach(function(e){adj[e[0]].push(e[1]);adj[e[1]].push(e[0]);});return adj;}
        function renderBip(n, colors){
            var nodes=[];for(var i=1;i<=n;i++) nodes.push(i);
            areaEl.innerHTML='<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px;">'+nodes.map(function(nd){
                var bg=colors[nd]===0?'#636e72':(colors[nd]===1?'#d63031':'var(--bg2)');
                return '<div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;background:'+bg+';color:'+(colors[nd]!==undefined?'white':'var(--text)')+';">'+nd+'</div>';
            }).join('')+'</div>';
        }
        function buildSteps(n, edges){
            var adj=buildAdj(n,edges), steps=[], colors={};
            // BFS 2-coloring
            var simColors={}, colorLog=[], isBipartite=true;
            for(var start=1;start<=n;start++){
                if(simColors[start]!==undefined) continue;
                simColors[start]=0;
                colorLog.push({node:start,color:0});
                var q=[start];
                while(q.length>0){
                    var v=q.shift();
                    (adj[v]||[]).forEach(function(u){
                        if(simColors[u]===undefined){
                            simColors[u]=1-simColors[v];
                            colorLog.push({node:u,color:simColors[u],from:v});
                            q.push(u);
                        } else if(simColors[u]===simColors[v]){
                            isBipartite=false;
                        }
                    });
                }
            }
            colorLog.forEach(function(entry,idx){
                (function(e,i){
                    var colorName=e.color===0?'0(gray)':'1(red)';
                    var desc=e.from?'Color neighbor <strong>'+e.node+'</strong> of '+e.from+' with the <em>opposite</em> color '+colorName+' — a bipartite graph requires all adjacent nodes to have different colors.':'Start BFS 2-coloring from <strong>'+e.node+'</strong> with color '+colorName+' — begin coloring from an uncolored node.';
                    steps.push({
                        description:desc,
                        action:function(){colors[e.node]=e.color;renderBip(n,colors);infoEl.innerHTML='color['+e.node+'] = '+e.color+(e.from?' (different from '+e.from+')':'');},
                        undo:function(){delete colors[e.node];renderBip(n,colors);infoEl.innerHTML='';}
                    });
                })(entry,idx);
            });
            steps.push({description:isBipartite?'All adjacent nodes have <em>different colors</em> \u2192 <strong>Bipartite YES!</strong> The graph can be split into two groups.':'Adjacent nodes with the <em>same color</em> found \u2192 <strong>Bipartite NO!</strong> An odd-length cycle exists in the graph.',
                action:function(){renderBip(n,colors);infoEl.innerHTML='<strong style="color:'+(isBipartite?'var(--green)':'var(--red)')+';font-size:1.1rem;">'+(isBipartite?'\u2705 Bipartite Graph (YES)':'\u274C Not Bipartite (NO)')+'</strong>';},
                undo:function(){renderBip(n,colors);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var n=parseInt(container.querySelector('#gr-bip-n').value)||DEFAULT_N;
            var edges=parseEdges(container.querySelector('#gr-bip-edges').value);
            renderBip(n,{});infoEl.innerHTML='';
            self._initStepController(container,buildSteps(n,edges),suffix);
        }
        container.querySelector('#gr-bip-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ====================================================================
    // Simulation 16: Breaking Walls (boj-2206)
    // ====================================================================
    _renderVizWall: function(container) {
        var self = this, suffix = '-wall';
        var DEFAULT_GRID = '0 1 0; 0 1 0; 0 0 0';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Breaking Walls — State BFS</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">visited[r][c][broken] 3D visited array. 0=path, 1=wall.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by ;): <input type="text" id="gr-wall-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<button class="btn btn-primary" id="gr-wall-reset">\uD83D\uDD04</button></div>' +
            self._createStepDesc(suffix) +
            '<div id="viz-area' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:60px;"></div>' +
            '<div id="viz-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var areaEl = container.querySelector('#viz-area' + suffix);
        var infoEl = container.querySelector('#viz-info' + suffix);
        function parseGrid(s){return s.split(';').map(function(row){return row.trim().split(/\s+/).map(Number);});}
        function renderWall(grid, dist0, dist1){
            var C=grid[0].length;
            var html='<div style="display:flex;gap:24px;justify-content:center;flex-wrap:wrap;">';
            html+='<div><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;font-weight:600;">Wall intact</div>';
            html+='<div style="display:inline-grid;grid-template-columns:repeat('+C+',40px);gap:2px;">';
            grid.forEach(function(row,r){row.forEach(function(v,c){
                var bg=v===1?'#e74c3c':(dist0[r][c]>=0?'#2d3436':'#dfe6e9');
                html+='<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist0[r][c]>=0||v===1?'white':'var(--text)')+';">'+(v===1?'\u2588':(dist0[r][c]>=0?dist0[r][c]:'\u00B7'))+'</div>';
            });});
            html+='</div></div>';
            html+='<div><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;font-weight:600;">Wall broken</div>';
            html+='<div style="display:inline-grid;grid-template-columns:repeat('+C+',40px);gap:2px;">';
            grid.forEach(function(row,r){row.forEach(function(v,c){
                var bg=v===1?'#e74c3c':(dist1[r][c]>=0?'#6c5ce7':'#dfe6e9');
                html+='<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:5px;font-weight:600;font-size:0.75rem;background:'+bg+';color:'+(dist1[r][c]>=0||v===1?'white':'var(--text)')+';">'+(v===1?'\u2588':(dist1[r][c]>=0?dist1[r][c]:'\u00B7'))+'</div>';
            });});
            html+='</div></div></div>';
            areaEl.innerHTML=html;
        }
        function buildSteps(grid){
            var R=grid.length,C=grid[0].length,dx=[0,0,1,-1],dy=[1,-1,0,0];
            // 3D BFS: dist[r][c][b]
            var dist3=[];for(var r=0;r<R;r++){dist3.push([]);for(var c=0;c<C;c++){dist3[r].push([-1,-1]);}}
            dist3[0][0][0]=1;
            var q=[[0,0,0]]; // r,c,broken
            var levels=[[{r:0,c:0,b:0,d:1}]];
            while(q.length>0){
                var nextQ=[],nextLevel=[];
                q.forEach(function(pos){
                    var cr=pos[0],cc=pos[1],cb=pos[2];
                    for(var d=0;d<4;d++){
                        var nr=cr+dx[d],nc=cc+dy[d];
                        if(nr<0||nr>=R||nc<0||nc>=C) continue;
                        if(grid[nr][nc]===0&&dist3[nr][nc][cb]<0){
                            dist3[nr][nc][cb]=dist3[cr][cc][cb]+1;
                            nextQ.push([nr,nc,cb]);
                            nextLevel.push({r:nr,c:nc,b:cb,d:dist3[nr][nc][cb],pr:cr,pc:cc});
                        }
                        if(grid[nr][nc]===1&&cb===0&&dist3[nr][nc][1]<0){
                            dist3[nr][nc][1]=dist3[cr][cc][cb]+1;
                            nextQ.push([nr,nc,1]);
                            nextLevel.push({r:nr,c:nc,b:1,d:dist3[nr][nc][1],pr:cr,pc:cc});
                        }
                    }
                });
                if(nextLevel.length>0) levels.push(nextLevel);
                q=nextQ;
            }
            var ans=-1;
            if(dist3[R-1][C-1][0]>=0) ans=dist3[R-1][C-1][0];
            if(dist3[R-1][C-1][1]>=0&&(ans<0||dist3[R-1][C-1][1]<ans)) ans=dist3[R-1][C-1][1];

            // reset for step-by-step
            for(var r=0;r<R;r++) for(var c=0;c<C;c++){dist3[r][c][0]=-1;dist3[r][c][1]=-1;}
            var dist0=[],dist1=[];
            for(var r=0;r<R;r++){dist0.push([]);dist1.push([]);for(var c=0;c<C;c++){dist0[r].push(-1);dist1[r].push(-1);}}

            var steps=[];
            // level 0: start at (0,0)
            var initW=levels[0];
            steps.push({
                description:'Start at (0,0) — <strong>State BFS</strong>: visited[r][c][<em>wall broken?</em>]. The same cell with vs. without a broken wall is a <em>different state</em>, requiring a 3D visited array.',
                action:function(){initW.forEach(function(p){dist3[p.r][p.c][p.b]=p.d;if(p.b===0) dist0[p.r][p.c]=p.d; else dist1[p.r][p.c]=p.d;});renderWall(grid,dist0,dist1);infoEl.innerHTML='dist[0][0][0] = 1';},
                undo:function(){initW.forEach(function(p){dist3[p.r][p.c][p.b]=-1;if(p.b===0) dist0[p.r][p.c]=-1; else dist1[p.r][p.c]=-1;});renderWall(grid,dist0,dist1);infoEl.innerHTML='';}
            });
            // each subsequent cell individually
            for(var li=1;li<levels.length;li++){
                for(var ci=0;ci<levels[li].length;ci++){
                    (function(cell){
                        var broke=cell.b===1;
                        var desc=broke?'('+cell.r+','+cell.c+') <strong>broke through wall</strong> \u2190 from ('+cell.pr+','+cell.pc+'). Wall-breaking chance used, so no more walls can be broken afterward. dist='+cell.d:'('+cell.r+','+cell.c+') move along path \u2190 from ('+cell.pr+','+cell.pc+'). Wall-intact state is preserved. dist='+cell.d;
                        steps.push({
                            description:desc,
                            action:function(){dist3[cell.r][cell.c][cell.b]=cell.d;if(cell.b===0) dist0[cell.r][cell.c]=cell.d; else dist1[cell.r][cell.c]=cell.d;renderWall(grid,dist0,dist1);infoEl.innerHTML=desc;},
                            undo:function(){dist3[cell.r][cell.c][cell.b]=-1;if(cell.b===0) dist0[cell.r][cell.c]=-1; else dist1[cell.r][cell.c]=-1;renderWall(grid,dist0,dist1);infoEl.innerHTML='';}
                        });
                    })(levels[li][ci]);
                }
            }
            steps.push({description:ans>=0?'State BFS complete — the <em>shorter</em> of the wall-broken and wall-intact paths is the answer. <strong>Shortest path = '+ans+' cells</strong>':'Both states are <strong>unreachable</strong> — even breaking one wall cannot create a path. Answer: <strong>-1</strong>',
                action:function(){renderWall(grid,dist0,dist1);infoEl.innerHTML='<strong style="color:var(--green);font-size:1.1rem;">\u2705 '+(ans>=0?'Shortest path = '+ans+' cells':'Unreachable (-1)')+'</strong>';},
                undo:function(){renderWall(grid,dist0,dist1);infoEl.innerHTML='';}});
            return steps;
        }
        function init(){
            var grid=parseGrid(container.querySelector('#gr-wall-grid').value);
            var empty0=grid.map(function(r){return r.map(function(){return -1;});});
            var empty1=grid.map(function(r){return r.map(function(){return -1;});});
            renderWall(grid,empty0,empty1);infoEl.innerHTML='';
            self._initStepController(container,buildSteps(grid),suffix);
        }
        container.querySelector('#gr-wall-reset').addEventListener('click',function(){self._clearVizState();init();});
        init();
    },

    // ===== Empty Stub =====
    renderVisualize: function(container) {},
    renderProblem: function(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'DFS/BFS Basics', desc: 'Practice basic DFS and BFS implementations (Silver II~III)', problemIds: ['boj-2606', 'boj-24479', 'boj-24480', 'boj-24444', 'boj-24445', 'boj-1260'] },
        { num: 2, title: 'Grid Traversal & Flood Fill', desc: 'Explore connected components on a grid (Silver I~II)', problemIds: ['boj-1012', 'boj-2667'] },
        { num: 3, title: 'BFS Shortest Distance', desc: 'Find shortest distances using BFS (Silver I)', problemIds: ['boj-2178', 'boj-1697', 'boj-7562'] },
        { num: 4, title: 'Advanced BFS', desc: 'Multi-source and state-extended BFS (Gold III~V)', problemIds: ['boj-7576', 'boj-7569', 'boj-16928', 'boj-1707', 'boj-2206'] }
    ],

    problems: [
        {
            id: 'boj-2606',
            title: 'BOJ 2606 - Virus',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2606',
            simIntro: 'Simulates BFS traversal as a virus spreads from computer 1 to all connected computers.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A new type of worm virus spreads through a network. When a computer is infected with the worm virus, all computers connected to it through the network also become infected.</p>
                <p>For example, suppose 7 computers are connected on a network as shown in Figure 1. If computer 1 is infected with the worm virus, the virus spreads through computers 2 and 5 to reach computers 3 and 6, infecting 2, 3, 5, 6 (four computers total). However, computers 4 and 7 are not connected to computer 1 on the network, so they are not affected.</p>
                <p>One day, computer 1 was infected with the worm virus. Given the number of computers and their network connections, write a program to output the number of computers that will be infected through computer 1.</p>
                <h4>Input</h4>
                <p>The first line contains the number of computers. The number of computers is a positive integer ≤ 100, and each computer is numbered sequentially starting from 1. The second line contains the number of directly connected computer pairs on the network. Following that, each line contains a pair of computer numbers that are directly connected on the network.</p>
                <h4>Output</h4>
                <p>Print the number of computers that will be infected by the worm virus through computer 1 on the first line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>7
6
1 2
2 3
1 5
5 2
5 6
4 7</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3
0</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div><p class="example-explain">No connected computers, so no computers are infected.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ Number of computers ≤ 100</li>
                    <li>1 ≤ Number of connections ≤ 100 × 99 / 2</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'Since the virus spreads from computer 1... we find computers connected to 1, then find computers connected to those, and repeat... right?<br><br>Exactly! The key is <strong>"finding all connected computers"</strong>. This type of problem is called <strong>graph traversal</strong>.<br><br><div style="display:flex;gap:8px;align-items:center;justify-content:center;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);flex-wrap:wrap;"><div style="width:36px;height:36px;border-radius:50%;background:var(--red);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">1</div><span style="color:var(--text2);font-size:0.9rem;">→</span><div style="width:36px;height:36px;border-radius:50%;background:var(--yellow);color:#333;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">2</div><span style="color:var(--text2);font-size:0.9rem;">→</span><div style="width:36px;height:36px;border-radius:50%;background:var(--yellow);color:#333;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">3</div><span style="color:var(--text3);font-size:0.8rem;margin-left:8px;">Virus spreads!</span></div>' },
                { title: 'But how do we find them all?', content: 'If we follow connected computers one by one, we might miss some or visit the same one twice.<br><br>The systematic way to do this is <strong>BFS (Breadth-First Search)</strong> and <strong>DFS (Depth-First Search)</strong>!<br>Both use a <strong>visited array</strong> to check already-visited nodes, preventing duplicate visits.<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">visited:</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text2);border-radius:4px;">F</span><span style="padding:3px 10px;background:var(--green);color:white;border-radius:4px;">T</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text2);border-radius:4px;">F</span><span style="color:var(--text3);margin-left:6px;">← track visits!</span></div>' },
                { title: 'What if we try this?', content: 'Enqueue computer 1 and start BFS:<br>1. Dequeue a computer<br>2. Enqueue its unvisited connected neighbors<br>3. Repeat until the queue is empty!<br><br>The answer is the number of visited computers minus computer 1 itself.' },
                { title: 'Implementation tip', content: 'Since connections are bidirectional, add both directions to the adjacency list:<br><span class="lang-py">Python: <code>graph[u].append(v)</code> and <code>graph[v].append(u)</code> both! Use <code>deque</code> for BFS.</span><span class="lang-cpp">C++: <code>graph[u].push_back(v)</code> and <code>graph[v].push_back(u)</code> both! Use <code>queue&lt;int&gt;</code> for BFS.</span>' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Traversal',
                description: 'Visits all connected computers from computer 1 via BFS and counts infected ones.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Construction', desc: 'Bidirectional edges, so add both directions to the adjacency list.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN = int(input())\nM = int(input())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)' },
                        { title: 'BFS Initialization', desc: 'Starting from computer 1, so enqueue 1 in the deque.', code: 'visited = [False] * (N + 1)\nqueue = deque([1])\nvisited[1] = True\ncount = 0' },
                        { title: 'BFS Traversal & Output', desc: 'Visit all connected computers, count infections, and output.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if not visited[u]:\n            visited[u] = True\n            queue.append(u)\n            count += 1\nprint(count)' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Construction', desc: 'vector adjacency list with fast scanf input', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    // adjacency list: store graph using vector array\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }' },
                        { title: 'BFS Initialization', desc: 'Using queue<int> instead of deque', code: '    vector<bool> visited(N + 1, false);\n    queue<int> q;\n    q.push(1);\n    visited[1] = true;\n    int count = 0;' },
                        { title: 'BFS Traversal & Output', desc: 'Traverse until queue is empty, counting infected computers.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (!visited[u]) {\n                visited[u] = true;\n                q.push(u);\n                count++;\n            }\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-24479',
            title: 'BOJ 24479 - DFS 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24479',
            simIntro: 'Performs DFS in ascending order from the starting vertex and records each vertex visit order.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an undirected graph with N vertices and M edges. Starting from vertex R, visit nodes using Depth-First Search (DFS) and output the visit order of each node.</p>
                <p>Visit adjacent vertices in <strong>ascending order</strong>. The starting vertex has visit order 1. Output 0 for vertices unreachable from the starting vertex.</p>
                <h4>Input</h4>
                <p>The first line contains the number of vertices N (5 ≤ N ≤ 100,000), the number of edges M (1 ≤ M ≤ 200,000), and the starting vertex R (1 ≤ R ≤ N).</p>
                <p>The next M lines contain edge information u v, representing a bidirectional edge with weight 1 between vertex u and vertex v. (1 ≤ u &lt; v ≤ N, u ≠ v) All (u, v) pairs are distinct.</p>
                <h4>Output</h4>
                <p>Print N lines, one integer per line. The i-th line contains the visit order of vertex i. The visit order of the starting vertex is 1. Print 0 if the vertex is unreachable from the starting vertex.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>Output</strong><pre>1
2
3
4
0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'Run DFS from starting vertex R, assigning order 1, 2, 3... each time we visit a node!<br><br>Exactly. Record each vertex visit order in the <code>order[v]</code> array. Output 0 for unvisited vertices.<br><br><div style="display:flex;gap:4px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">order:</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">1</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">2</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">3</span><span style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">4</span><span style="padding:3px 8px;background:var(--bg2);color:var(--text2);border-radius:4px;">0</span><span style="color:var(--text3);margin-left:4px;">← 5 not visited</span></div>' },
                { title: 'But there\'s a problem with this', content: 'The problem says to visit adjacent vertices in <strong>ascending order</strong>. Without sorting, DFS visits neighbors in insertion order, so the visit order could be different!<br><br><div style="display:flex;gap:12px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div><span style="color:var(--red);">Before sort:</span> [4, 2, 3]</div><span style="font-size:1.1rem;">→</span><div><span style="color:var(--green);">After sort:</span> [2, 3, 4]</div></div>' },
                { title: 'What if we try this?', content: 'Just sort each vertex adjacency list in <strong>ascending order</strong> before DFS!<br><br>Then DFS naturally visits smaller numbers first:<br><span class="lang-py">Python: Sort with <code>graph[i].sort()</code>, then use <code>global cnt</code> in recursive DFS to assign order.</span><span class="lang-cpp">C++: Sort with <code>sort(graph[i].begin(), graph[i].end())</code>, then use global variable <code>cnt</code> to assign order.</span>' },
                { title: 'Watch out!', content: 'With up to 100,000 vertices: <span class="lang-py">In Python, you must increase the recursion limit with <code>sys.setrecursionlimit(200000)</code>!</span><span class="lang-cpp">In C++, the default stack size is usually sufficient, but using global arrays is safer.</span>' }
            ],
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
    graph[i].sort()  # ascending sort

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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'Ascending DFS',
                description: 'Sorts adjacency lists in ascending order then records visit order via recursive DFS.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Sorting', desc: 'Sort adjacency lists with sort() for ascending order visits.', code: 'import sys\nsys.setrecursionlimit(200000)\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'DFS Function Definition', desc: 'Recursive DFS that records visit order in the order array.', code: 'order = [0] * (N + 1)\ncnt = 0\n\ndef dfs(v):\n    global cnt\n    cnt += 1\n    order[v] = cnt\n    for u in graph[v]:\n        if order[u] == 0:\n            dfs(u)' },
                        { title: 'DFS Execution & Output', desc: 'Execute DFS from starting vertex R and output each vertex visit order.', code: 'dfs(R)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Sorting', desc: 'Global arrays + sort() for ascending order', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint N, M, R, cnt = 0;\nvector<int> graph[100001];\nint order_arr[100001]; // array to record visit order' },
                        { title: 'DFS Function Definition', desc: 'Using global variable cnt instead of Python global keyword', code: 'void dfs(int v) {\n    order_arr[v] = ++cnt; // record visit order\n    for (int u : graph[v]) {\n        if (order_arr[u] == 0) dfs(u);\n    }\n}' },
                        { title: 'DFS Execution & Output', desc: 'In main, handle input, sorting, DFS, and output in order.', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &R);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // ascending sort: to visit smaller numbers first\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());\n    dfs(R);\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-24480',
            title: 'BOJ 24480 - DFS 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24480',
            simIntro: 'Performs DFS in descending order from the starting vertex and records each vertex visit order.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an undirected graph with N vertices and M edges. Starting from vertex R, visit nodes using Depth-First Search (DFS) and output the visit order of each node.</p>
                <p>Visit adjacent vertices in <strong>descending order</strong>. The starting vertex has visit order 1. Output 0 for vertices unreachable from the starting vertex.</p>
                <h4>Input</h4>
                <p>The first line contains the number of vertices N (5 ≤ N ≤ 100,000), the number of edges M (1 ≤ M ≤ 200,000), and the starting vertex R (1 ≤ R ≤ N).</p>
                <p>The next M lines contain edge information u v, representing a bidirectional edge with weight 1 between vertex u and vertex v. (1 ≤ u &lt; v ≤ N, u ≠ v) All (u, v) pairs are distinct.</p>
                <h4>Output</h4>
                <p>Print N lines, one integer per line. The i-th line contains the visit order of vertex i. The visit order of the starting vertex is 1. Print 0 if the vertex is unreachable from the starting vertex.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>Output</strong><pre>1
4
3
2
0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'If you already solved 24479 (DFS 1), you can use the same DFS approach. Recording visit order in the <code>order</code> array is identical.' },
                { title: 'But there\'s a problem with this', content: 'This time we need to visit adjacent vertices in <strong>descending order</strong>! Sorting in ascending order like 24479 would give different visit orders.<br><br>Ultimately, you just need to change <strong>one line</strong> - the sort direction.<br><br><div style="display:flex;gap:12px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div><span style="color:var(--text2);">Ascending:</span> [2, 3, 4]</div><span style="font-size:1.1rem;">→</span><div><span style="color:var(--accent);font-weight:600;">Descending:</span> [4, 3, 2]</div></div>' },
                { title: 'What if we try this?', content: 'Just change the sort direction to descending in the 24479 code:<br><span class="lang-py">Python: <code>graph[i].sort(reverse=True)</code></span><span class="lang-cpp">C++: <code>sort(graph[i].rbegin(), graph[i].rend())</code></span><br><br>The rest of the DFS logic is completely identical!' }
            ],
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
    graph[i].sort(reverse=True)  # descending sort!

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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // descending!
    dfs(R);
    for (int i = 1; i <= N; i++) printf("%d\\n", order_arr[i]);
    return 0;
}`
            },
            solutions: [{
                approach: 'Descending DFS',
                description: 'Sorts adjacency lists in descending order then records visit order via recursive DFS.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Descending Sort', desc: 'Sort with reverse=True for descending order visits.', code: 'import sys\nsys.setrecursionlimit(200000)\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort(reverse=True)' },
                        { title: 'DFS Function Definition', desc: 'Same recursive DFS as 24479, only the sort order differs.', code: 'order = [0] * (N + 1)\ncnt = 0\n\ndef dfs(v):\n    global cnt\n    cnt += 1\n    order[v] = cnt\n    for u in graph[v]:\n        if order[u] == 0:\n            dfs(u)' },
                        { title: 'DFS Execution & Output', desc: 'Execute DFS from starting vertex R and output each vertex visit order.', code: 'dfs(R)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: 'Input & Descending Sort', desc: 'Descending sort using rbegin()/rend()', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint N, M, R, cnt = 0;\nvector<int> graph[100001];\nint order_arr[100001];' },
                        { title: 'DFS Function Definition', desc: 'Same recursive DFS structure as 24479.', code: 'void dfs(int v) {\n    order_arr[v] = ++cnt;\n    for (int u : graph[v]) {\n        if (order_arr[u] == 0) dfs(u);\n    }\n}' },
                        { title: 'DFS Execution & Output', desc: 'Reverse sort via rbegin/rend, execute DFS, output results.', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &R);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // descending: reverse sort via rbegin/rend\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].rbegin(), graph[i].rend());\n    dfs(R);\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-24444',
            title: 'BOJ 24444 - BFS 1',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24444',
            simIntro: 'Performs BFS in ascending order from the starting vertex and records each vertex visit order.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an undirected graph with N vertices and M edges. Starting from vertex R, visit nodes using Breadth-First Search (BFS) and output the visit order of each node.</p>
                <p>Visit adjacent vertices in <strong>ascending order</strong>. The starting vertex has visit order 1. Output 0 for vertices unreachable from the starting vertex.</p>
                <h4>Input</h4>
                <p>The first line contains the number of vertices N (5 ≤ N ≤ 100,000), the number of edges M (1 ≤ M ≤ 200,000), and the starting vertex R (1 ≤ R ≤ N).</p>
                <p>The next M lines contain edge information u v, representing a bidirectional edge with weight 1 between vertex u and vertex v. (1 ≤ u &lt; v ≤ N, u ≠ v) All (u, v) pairs are distinct.</p>
                <h4>Output</h4>
                <p>Print N lines, one integer per line. The i-th line contains the visit order of vertex i. The visit order of the starting vertex is 1. Print 0 if the vertex is unreachable from the starting vertex.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>Output</strong><pre>1
2
3
4
0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'Like 24479 with DFS... wait, this time we need to find visit order with <strong>BFS (Breadth-First Search)</strong>!<br><br>BFS visits vertices closest to the start first, in order. It uses a queue.<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><span style="font-weight:600;color:var(--text);">Queue:</span><span style="padding:3px 10px;background:#00b894;color:white;border-radius:4px;">R</span><span style="color:var(--text3);">→</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text);border-radius:4px;">2</span><span style="padding:3px 10px;background:var(--bg2);color:var(--text);border-radius:4px;">3</span><span style="color:var(--text3);margin-left:4px;">← closest first!</span></div>' },
                { title: 'But order matters', content: 'The problem requires visiting adjacent vertices in <strong>ascending order</strong>, so just like the DFS problems, we need to sort adjacency lists first. Without sorting, the order would be different!' },
                { title: 'What if we try this?', content: '1. Sort adjacency lists in ascending order<br>2. Enqueue starting vertex R and set <code>order[R] = 1</code><br>3. For each dequeued vertex, enqueue unvisited neighbors in order while recording visit order<br><br><span class="lang-py">Python: BFS with <code>deque</code>, dequeue with <code>popleft()</code>.</span><span class="lang-cpp">C++: BFS with <code>queue&lt;int&gt;</code>, dequeue with <code>q.front(); q.pop();</code>.</span>' }
            ],
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
    graph[i].sort()  # ascending

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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'Ascending BFS',
                description: 'Sorts adjacency lists in ascending order then records visit order via BFS.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Sorting', desc: 'Sort adjacency lists for ascending order BFS.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'BFS Initialization', desc: 'Enqueue starting vertex R and record visit order 1.', code: 'order = [0] * (N + 1)\ncnt = 0\nqueue = deque([R])\ncnt += 1\norder[R] = cnt' },
                        { title: 'BFS Traversal & Output', desc: 'Visit neighbors of dequeued vertex in ascending order.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if order[u] == 0:\n            cnt += 1\n            order[u] = cnt\n            queue.append(u)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Sorting', desc: 'Ascending sort using vector<vector<int>> and sort()', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M, R;\n    scanf("%d %d %d", &N, &M, &R);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());' },
                        { title: 'BFS Initialization', desc: 'Using queue instead of deque', code: '    vector<int> order_arr(N + 1, 0);\n    int cnt = 0;\n    queue<int> q;\n    q.push(R);\n    order_arr[R] = ++cnt;' },
                        { title: 'BFS Traversal & Output', desc: 'Record visit order during BFS and output results.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (order_arr[u] == 0) {\n                order_arr[u] = ++cnt;\n                q.push(u);\n            }\n        }\n    }\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-24445',
            title: 'BOJ 24445 - BFS 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/24445',
            simIntro: 'Performs BFS in descending order from the starting vertex and records each vertex visit order.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an undirected graph with N vertices and M edges. Starting from vertex R, visit nodes using Breadth-First Search (BFS) and output the visit order of each node.</p>
                <p>Visit adjacent vertices in <strong>descending order</strong>. The starting vertex has visit order 1. Output 0 for vertices unreachable from the starting vertex.</p>
                <h4>Input</h4>
                <p>The first line contains the number of vertices N (5 ≤ N ≤ 100,000), the number of edges M (1 ≤ M ≤ 200,000), and the starting vertex R (1 ≤ R ≤ N).</p>
                <p>The next M lines contain edge information u v, representing a bidirectional edge with weight 1 between vertex u and vertex v. (1 ≤ u &lt; v ≤ N, u ≠ v) All (u, v) pairs are distinct.</p>
                <h4>Output</h4>
                <p>Print N lines, one integer per line. The i-th line contains the visit order of vertex i. The visit order of the starting vertex is 1. Print 0 if the vertex is unreachable from the starting vertex.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 5 1
1 4
1 2
2 3
2 4
3 4</pre></div>
                    <div><strong>Output</strong><pre>1
3
4
2
0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 200,000</li>
                    <li>1 ≤ R ≤ N</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'If you solved 24444 (BFS 1), you can use the exact same BFS logic. Dequeue, enqueue neighbors...' },
                { title: 'But there\'s a problem with this', content: 'This time we need to visit adjacent vertices in <strong>descending order</strong>! Using ascending sort would give completely different visit orders.<br><br>Just change <strong>one line</strong> in the 24444 code.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><span class="lang-py"><code>graph[i].sort()</code> → <code style="color:var(--accent);font-weight:600;">graph[i].sort(reverse=True)</code></span><span class="lang-cpp"><code>sort(g.begin(), g.end())</code> → <code style="color:var(--accent);font-weight:600;">sort(g.rbegin(), g.rend())</code></span></div>' },
                { title: 'What if we try this?', content: 'Just change the sort direction to descending and you are done!<br><span class="lang-py">Python: <code>graph[i].sort(reverse=True)</code></span><span class="lang-cpp">C++: <code>sort(graph[i].rbegin(), graph[i].rend())</code></span><br><br>The BFS logic itself is completely identical to 24444.' }
            ],
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
    graph[i].sort(reverse=True)  # descending!

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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
    for (int i = 1; i <= N; i++) sort(graph[i].rbegin(), graph[i].rend()); // descending!

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
}`
            },
            solutions: [{
                approach: 'Descending BFS',
                description: 'Sorts adjacency lists in descending order then records visit order via BFS.',
                timeComplexity: 'O(N + M log M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Descending Sort', desc: 'Sort with reverse=True for descending order BFS.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M, R = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    u, v = map(int, input().split())\n    graph[u].append(v)\n    graph[v].append(u)\nfor i in range(1, N + 1):\n    graph[i].sort(reverse=True)' },
                        { title: 'BFS Initialization', desc: 'Enqueue starting vertex R and record visit order 1.', code: 'order = [0] * (N + 1)\ncnt = 0\nqueue = deque([R])\ncnt += 1\norder[R] = cnt' },
                        { title: 'BFS Traversal & Output', desc: 'Visit neighbors of dequeued vertex in descending order.', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        if order[u] == 0:\n            cnt += 1\n            order[u] = cnt\n            queue.append(u)\nfor i in range(1, N + 1):\n    print(order[i])' }
                    ],
                    cpp: [
                        { title: 'Input & Descending Sort', desc: 'Descending sort using rbegin()/rend()', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M, R;\n    scanf("%d %d %d", &N, &M, &R);\n    vector<vector<int>> graph(N + 1);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    // descending: reverse sort via rbegin/rend\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].rbegin(), graph[i].rend());' },
                        { title: 'BFS Initialization', desc: 'Enqueue starting vertex and record visit order.', code: '    vector<int> order_arr(N + 1, 0);\n    int cnt = 0;\n    queue<int> q;\n    q.push(R);\n    order_arr[R] = ++cnt;' },
                        { title: 'BFS Traversal & Output', desc: 'Perform BFS with descending adjacency lists and output results.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            if (order_arr[u] == 0) {\n                order_arr[u] = ++cnt;\n                q.push(u);\n            }\n        }\n    }\n    for (int i = 1; i <= N; i++)\n        printf("%d\\n", order_arr[i]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1260',
            title: 'BOJ 1260 - DFS and BFS',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1260',
            simIntro: 'Performs both DFS and BFS and compares their traversal orders.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Write a program that outputs the results of DFS and BFS traversals on a graph. When multiple vertices can be visited, visit the one with the smaller number first. Terminate when there are no more vertices to visit. Vertex numbers range from 1 to N.</p>
                <h4>Input</h4>
                <p>The first line contains the number of vertices N (1 ≤ N ≤ 1,000), the number of edges M (1 ≤ M ≤ 10,000), and the starting vertex number V. The next M lines each contain two vertex numbers connected by an edge. There may be multiple edges between two vertices. The edges are bidirectional.</p>
                <h4>Output</h4>
                <p>Print the result of DFS on the first line, and the result of BFS on the next line. Print the vertices in order of visitation starting from V.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 5 1
1 2
1 3
1 4
2 4
3 4</pre></div>
                    <div><strong>Output</strong><pre>1 2 4 3
1 2 3 4</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 5 3
5 4
5 2
1 2
3 4
3 1</pre></div>
                    <div><strong>Output</strong><pre>3 1 2 5 4
3 1 4 2 5</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>1000 1 1000
999 1000</pre></div>
                    <div><strong>Output</strong><pre>1000 999
1000 999</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000</li>
                    <li>1 ≤ M ≤ 10,000</li>
                    <li>1 ≤ V ≤ N</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'We need to output both DFS and BFS results, so let us implement both as we learned!<br><br>Build an adjacency list and sort in ascending order since we visit smaller vertex numbers first.' },
                { title: 'But there\'s a problem with this', content: 'If we run DFS first, the visited array becomes all True. Running BFS in that state would visit nothing!<br><br>We need to use <strong>separate visited arrays</strong> for DFS and BFS, or reset visited after DFS.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;"><span style="color:var(--red);">After DFS:</span> visited = <span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;font-size:0.8rem;">T T T T T</span> ← all True!</div><div><span style="color:var(--accent);">Fix:</span> <strong>Reset</strong> visited or use <strong>separate arrays</strong></div></div>' },
                { title: 'What if we try this?', content: '1. Sort adjacency lists in ascending order<br>2. Perform DFS (recursion) and record visit order<br>3. Reset visited and perform BFS (queue), recording visit order<br>4. Output each result separated by spaces<br><br><span class="lang-py">Python: Implement DFS as a recursive function, BFS with <code>deque</code>.</span><span class="lang-cpp">C++: Implement DFS as a recursive function, BFS with <code>queue</code>, reset with <code>memset(vis, false, sizeof(vis))</code>.</span>' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'DFS + BFS',
                description: 'Performs both DFS and BFS on the same graph and outputs each visit order.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Construction', desc: 'Sort adjacency lists for ascending order visits.', code: 'import sys\nfrom collections import deque\nsys.setrecursionlimit(10000)\ninput = sys.stdin.readline\n\nN, M, V = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    graph[b].append(a)\nfor i in range(1, N + 1):\n    graph[i].sort()' },
                        { title: 'DFS Execution', desc: 'Record visit order in dfs_result via recursive DFS.', code: 'dfs_result = []\nvisited = [False] * (N + 1)\ndef dfs(v):\n    visited[v] = True\n    dfs_result.append(v)\n    for u in graph[v]:\n        if not visited[u]:\n            dfs(u)\ndfs(V)' },
                        { title: 'BFS Execution & Output', desc: 'Perform BFS with a separate visited array and output DFS/BFS results.', code: 'bfs_result = []\nvisited2 = [False] * (N + 1)\nq = deque([V])\nvisited2[V] = True\nwhile q:\n    v = q.popleft()\n    bfs_result.append(v)\n    for u in graph[v]:\n        if not visited2[u]:\n            visited2[u] = True\n            q.append(u)\nprint(*dfs_result)\nprint(*bfs_result)' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Construction', desc: 'Global arrays + memset for visited management', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint N, M, V;\nvector<int> graph[1001];\nbool vis[1001];\nvector<int> dfs_result, bfs_result;' },
                        { title: 'DFS Execution', desc: 'Record visit order in a vector via recursive DFS.', code: 'void dfs(int v) {\n    vis[v] = true;\n    dfs_result.push_back(v);\n    for (int u : graph[v])\n        if (!vis[u]) dfs(u);\n}' },
                        { title: 'BFS Execution & Output', desc: 'Reset visited via memset then perform separate BFS', code: 'int main() {\n    scanf("%d %d %d", &N, &M, &V);\n    for (int i = 0; i < M; i++) {\n        int u, v;\n        scanf("%d %d", &u, &v);\n        graph[u].push_back(v);\n        graph[v].push_back(u);\n    }\n    for (int i = 1; i <= N; i++)\n        sort(graph[i].begin(), graph[i].end());\n\n    dfs(V);\n\n    // BFS: visited\uB97C \uCD08\uAE30\uD654\uD558\uACE0 \uB2E4\uC2DC \uD0D0\uC0C9\n    memset(vis, false, sizeof(vis));\n    queue<int> q;\n    q.push(V); vis[V] = true;\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        bfs_result.push_back(v);\n        for (int u : graph[v]) {\n            if (!vis[u]) { vis[u] = true; q.push(u); }\n        }\n    }\n\n    for (int i = 0; i < (int)dfs_result.size(); i++)\n        printf(i ? " %d" : "%d", dfs_result[i]);\n    puts("");\n    for (int i = 0; i < (int)bfs_result.size(); i++)\n        printf(i ? " %d" : "%d", bfs_result[i]);\n    puts("");\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-1012',
            title: 'BOJ 1012 - Organic Cabbage',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1012',
            simIntro: 'Traverses the cabbage field counting connected cabbage regions (connected components).',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Hanna, a next-generation farmer, decided to grow organic cabbage in the highlands of Gangwon-do. Since growing cabbage without pesticides requires protecting them from insects, Hanna decided to purchase cabbage white worms that are effective at pest prevention. These worms live near the cabbages and protect them by eating harmful insects.</p>
                <p>If even one cabbage white worm lives in a cabbage, the worm can move to adjacent cabbages, so those cabbages are also protected from pests. A cabbage is considered adjacent if another cabbage is located in one of the four directions: up, down, left, or right.</p>
                <p>Since the land where Hanna grows cabbage is uneven, cabbages are planted here and there. Since only one cabbage white worm is needed per cluster of adjacent cabbages, we can find the total number of worms needed by counting how many separate clusters of adjacent cabbages exist. For example, if the cabbage field is arranged as shown below, a minimum of 5 cabbage white worms are needed.</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases T. For each test case, the first line contains the width M (1 ≤ M ≤ 50) and height N (1 ≤ N ≤ 50) of the cabbage field, and the number of cabbage locations K (1 ≤ K ≤ 2,500). The next K lines contain cabbage positions X (0 ≤ X ≤ M-1), Y (0 ≤ Y ≤ N-1). No two cabbages share the same position.</p>
                <h4>Output</h4>
                <p>For each test case, print the minimum number of cabbage white worms needed.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>1
5 3 6
0 2
1 2
2 2
3 2
4 2
4 0</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ T ≤ 10</li>
                    <li>1 ≤ M, N ≤ 50</li>
                    <li>1 ≤ K ≤ 2,500</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'When scanning the cabbage field, whenever we find a cell with a cabbage (1), we need to find all cabbages connected in four directions from there.<br><br>This is essentially asking <strong>"How many connected clusters are there?"</strong> Since each cluster needs just one worm!<br><br><div style="display:inline-grid;grid-template-columns:repeat(5,28px);gap:2px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:4px;background:var(--green);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--green);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span><span style="text-align:center;padding:4px;background:var(--accent);color:white;border-radius:3px;font-size:0.75rem;">1</span><span style="text-align:center;padding:4px;background:var(--bg2);color:var(--text3);border-radius:3px;font-size:0.75rem;">0</span></div> <span style="font-size:0.82rem;color:var(--text2);">← 2 clusters = 2 worms</span>' },
                { title: 'But how do we count the clusters?', content: 'Scan the grid from (0,0). Each time we find a cabbage (1), mark all connected cabbages as visited using BFS/DFS.<br><br>The number of times BFS/DFS is <strong>started anew</strong> = number of clusters (connected components) = number of worms needed!' },
                { title: 'What if we try this?', content: '1. Scan the grid and find an unvisited cabbage (1)<br>2. Start BFS from that cell and mark all connected cabbages as visited<br>3. count += 1<br>4. Repeat until the entire grid is scanned<br><br>4-directional movement: <code>dx = [0, 0, 1, -1]</code>, <code>dy = [1, -1, 0, 0]</code>' },
                { title: 'Watch out for this', content: 'Since there are multiple test cases, you must <strong>reset the visited array</strong> each time!<br><br>Also, coordinates are given as (x, y), so you should store them as <code>grid[y][x] = 1</code>. Do not confuse row (y) with column (x)!' }
            ],
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
                # BFS to visit all connected cabbages
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Connected Components',
                description: 'Traverses the cabbage field via BFS counting connected cabbage regions.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Map Construction', desc: 'Create the cabbage field grid for each test case.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M, N, K = map(int, input().split())\n    field = [[0] * M for _ in range(N)]\n    for _ in range(K):\n        x, y = map(int, input().split())\n        field[y][x] = 1' },
                        { title: 'BFS Function Definition', desc: 'When finding cabbage (1), visit all connected cells via BFS.', code: '    dx = [0, 0, 1, -1]\n    dy = [1, -1, 0, 0]\n    visited = [[False]*M for _ in range(N)]\n    def bfs(sy, sx):\n        q = deque([(sy, sx)])\n        visited[sy][sx] = True\n        while q:\n            y, x = q.popleft()\n            for d in range(4):\n                ny, nx = y+dy[d], x+dx[d]\n                if 0<=ny<N and 0<=nx<M and not visited[ny][nx] and field[ny][nx]==1:\n                    visited[ny][nx] = True\n                    q.append((ny, nx))' },
                        { title: 'Connected Component Count', desc: 'Start BFS for each unvisited cabbage found, incrementing worm count.', code: '    count = 0\n    for i in range(N):\n        for j in range(M):\n            if field[i][j] == 1 and not visited[i][j]:\n                bfs(i, j)\n                count += 1\n    print(count)' }
                    ],
                    cpp: [
                        { title: 'Input & Map Construction', desc: 'BFS queue using pair<int,int>', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int M, N, K;\n        scanf("%d %d %d", &M, &N, &K);\n        vector<vector<int>> field(N, vector<int>(M, 0));\n        vector<vector<bool>> vis(N, vector<bool>(M, false));\n        for (int i = 0; i < K; i++) {\n            int x, y;\n            scanf("%d %d", &x, &y);\n            field[y][x] = 1;\n        }' },
                        { title: 'BFS Function Definition', desc: 'Using queue<pair<int,int>> with structured binding', code: '        int count = 0;\n        for (int r = 0; r < N; r++) {\n            for (int c = 0; c < M; c++) {\n                if (field[r][c] == 1 && !vis[r][c]) {\n                    // BFS\uB85C \uC5F0\uACB0\uB41C \uBC30\uCD94 \uBAA8\uB450 \uBC29\uBB38\n                    queue<pair<int,int>> q;\n                    q.push({r, c});\n                    vis[r][c] = true;\n                    while (!q.empty()) {\n                        auto [cr, cc] = q.front(); q.pop();\n                        for (int d = 0; d < 4; d++) {\n                            int nr = cr+dx[d], nc = cc+dy[d];\n                            if (nr>=0 && nr<N && nc>=0 && nc<M\n                                && field[nr][nc]==1 && !vis[nr][nc]) {\n                                vis[nr][nc] = true;\n                                q.push({nr, nc});\n                            }\n                        }\n                    }' },
                        { title: 'Connected Component Count', desc: 'Increment count after each BFS to tally region count.', code: '                    count++;\n                }\n            }\n        }\n        printf("%d\\n", count);\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-2667',
            title: 'BOJ 2667 - Numbering Neighborhoods',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2667',
            simIntro: 'Finds connected house neighborhoods on the map and calculates the size of each.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>As shown in Figure 1, there is a square-shaped map. 1 indicates a location with a house, and 0 indicates one without. Cheolsu wants to define neighborhoods (groups of connected houses) on this map and assign numbers to them. Here, "connected" means that another house is located to the left, right, above, or below. Houses on a diagonal are not considered connected.</p>
                <p>Write a program that reads the map, outputs the number of neighborhoods, and outputs the number of houses in each neighborhood sorted in ascending order.</p>
                <h4>Input</h4>
                <p>The first line contains the size of the map N (a square, so width and height are the same, 5 ≤ N ≤ 25). The next N lines each contain N values (0 or 1).</p>
                <h4>Output</h4>
                <p>Print the total number of neighborhoods on the first line. Then print the number of houses in each neighborhood, sorted in ascending order, one per line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>7
0110100
0110101
1110101
0000111
0100000
0111110
0111000</pre></div>
                    <div><strong>Output</strong><pre>3
7
8
9</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>5 ≤ N ≤ 25</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'Just like problem 1012 (Organic Cabbage), we need to find connected clusters (neighborhoods) of houses! Scan the grid, and when we find a house (1), traverse all connected houses using BFS/DFS...' },
                { title: 'But there\'s a problem with this', content: 'Unlike problem 1012, this time we need not just the <strong>count</strong> of neighborhoods, but also the <strong>number of houses</strong> in each neighborhood!<br><br>And we need to output the results in <strong>ascending order</strong>.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;">Count visited cells during BFS:</div><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;"><span style="padding:3px 10px;background:var(--accent);color:white;border-radius:4px;">Group1: 7</span><span style="padding:3px 10px;background:#00b894;color:white;border-radius:4px;">Group2: 8</span><span style="padding:3px 10px;background:var(--yellow);color:#333;border-radius:4px;">Group3: 9</span><span style="color:var(--text3);">→ sorted: 7, 8, 9</span></div></div>' },
                { title: 'What if we try this?', content: 'Count the number of cells visited during BFS:<br>1. Scan the grid and find an unvisited house (1)<br>2. Start BFS, incrementing <code>cnt += 1</code> for each visited cell<br>3. When BFS finishes, store <code>sizes.append(cnt)</code><br>4. After all traversals, sort <code>sizes</code> in ascending order and output<br><br><span class="lang-py">Python: sort with <code>sizes.sort()</code> then output</span><span class="lang-cpp">C++: sort with <code>sort(sizes.begin(), sizes.end())</code> then output</span>' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Connected Components + Sizes',
                description: 'Finds connected house neighborhoods via BFS and outputs each size in ascending order.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: 'Input & Map Construction', desc: 'Convert string input to list to build the grid.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN = int(input())\nboard = []\nfor _ in range(N):\n    board.append(list(input().strip()))' },
                        { title: 'BFS Traversal Function', desc: 'Visit all connected houses via BFS and return neighborhood size.', code: 'dx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nvisited = [[False]*N for _ in range(N)]\n\ndef bfs(sy, sx):\n    q = deque([(sy, sx)])\n    visited[sy][sx] = True\n    cnt = 1\n    while q:\n        y, x = q.popleft()\n        for d in range(4):\n            ny, nx = y+dy[d], x+dx[d]\n            if 0<=ny<N and 0<=nx<N and not visited[ny][nx] and board[ny][nx]=="1":\n                visited[ny][nx] = True\n                q.append((ny, nx))\n                cnt += 1\n    return cnt' },
                        { title: 'Neighborhood Search & Output', desc: 'Collect neighborhood sizes, sort in ascending order, and output.', code: 'sizes = []\nfor i in range(N):\n    for j in range(N):\n        if board[i][j] == "1" and not visited[i][j]:\n            sizes.append(bfs(i, j))\nsizes.sort()\nprint(len(sizes))\nfor s in sizes:\n    print(s)' }
                    ],
                    cpp: [
                        { title: 'Input & Map Construction', desc: 'Read string input into char array then convert to numbers', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint N;\nint grid[25][25];\nbool vis[25][25];\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++) {\n        char s[30];\n        scanf("%s", s);\n        for (int j = 0; j < N; j++)\n            grid[i][j] = s[j] - \'0\'; // \uBB38\uC790 -> \uC22B\uC790 \uBCC0\uD658\n    }' },
                        { title: 'BFS Traversal Function', desc: 'pair<int,int> \uD050\uB85C \uACA9\uC790 BFS', code: '    vector<int> sizes;\n    for (int r = 0; r < N; r++) {\n        for (int c = 0; c < N; c++) {\n            if (grid[r][c] == 1 && !vis[r][c]) {\n                queue<pair<int,int>> q;\n                q.push({r, c});\n                vis[r][c] = true;\n                int cnt = 0;\n                while (!q.empty()) {\n                    auto [cr, cc] = q.front(); q.pop();\n                    cnt++;\n                    for (int d = 0; d < 4; d++) {\n                        int nr = cr+dx[d], nc = cc+dy[d];\n                        if (nr>=0 && nr<N && nc>=0 && nc<N\n                            && grid[nr][nc]==1 && !vis[nr][nc]) {\n                            vis[nr][nc] = true;\n                            q.push({nr, nc});\n                        }\n                    }\n                }\n                sizes.push_back(cnt);\n            }\n        }\n    }' },
                        { title: 'Neighborhood Search & Output', desc: 'Sort the sizes array and output neighborhood count and each size.', code: '    sort(sizes.begin(), sizes.end());\n    printf("%d\\n", (int)sizes.size());\n    for (int s : sizes)\n        printf("%d\\n", s);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[7].templates; }
            }]
        },
        {
            id: 'boj-2178',
            title: 'BOJ 2178 - Maze Exploration',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2178',
            simIntro: 'Explores the BFS shortest path in a maze from (1,1) to (N,M).',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There is a maze represented by an N by M array. In the maze, 1 represents a passable cell and 0 represents an impassable cell. Given such a maze, write a program to find the minimum number of cells that must be passed through when moving from (1, 1) to (N, M). When moving from one cell to another, you can only move to adjacent cells.</p>
                <p>In the example above, 15 cells must be passed through to reach position (N, M). When counting cells, both the starting and ending positions are included.</p>
                <h4>Input</h4>
                <p>The first line contains two integers N, M (2 ≤ N, M ≤ 100). The next N lines contain M integers representing the maze. The numbers are given <strong>concatenated</strong> (no spaces).</p>
                <h4>Output</h4>
                <p>Print the minimum number of cells to pass through on the first line. It is guaranteed that a path to the destination always exists.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 6
101111
101010
101011
111011</pre></div>
                    <div><strong>Output</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 6
110110
110110
111111
111101</pre></div>
                    <div><strong>Output</strong><pre>9</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N, M ≤ 100</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'We need to find the <strong>shortest path</strong> from (1,1) to (N,M) in the maze. Could we explore all paths with DFS and pick the shortest one?' },
                { title: 'But there\'s a problem with this', content: 'DFS explores all possible paths, so it takes a long time. If the maze is 100x100, the number of paths can be enormous!<br><br><strong>BFS</strong> is much more efficient for finding shortest distances. Since BFS explores the nearest cells first, the first time it reaches the destination is the shortest distance!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--red);">DFS:</span> <span style="color:var(--text2);">explores all paths → slow</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--green);font-weight:600;">BFS:</span> <span style="color:var(--text);">closest first → first arrival = shortest!</span></div></div>' },
                { title: 'What if we try this?', content: 'Start BFS from (0,0) and record the distance as +1 for each move:<br><code>dist[nr][nc] = dist[r][c] + 1</code><br><br>Since we count the starting cell too, start with <code>dist[0][0] = 1</code>, and <code>dist[N-1][M-1]</code> is the answer.' },
                { title: 'Implementation tip', content: 'Since the input has no spaces between digits, you need to read each line and parse character by character:<br><span class="lang-py">Python: convert each digit to a list with <code>list(map(int, input().strip()))</code></span><span class="lang-cpp">C++: read as a string with <code>char s[110]; scanf("%s", s);</code> then convert with <code>s[j] - \'0\'</code></span>' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Shortest Distance',
                description: 'Finds the shortest path in the maze from (1,1) to (N,M) using BFS.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Maze Construction', desc: 'Convert input without spaces into a list.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nmaze = []\nfor _ in range(N):\n    maze.append(list(input().strip()))' },
                        { title: 'BFS Traversal', desc: 'Set starting cell (0,0) to 1 and prepare BFS.', code: 'dist = [[0]*M for _ in range(N)]\ndist[0][0] = 1\nq = deque([(0, 0)])\ndx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]' },
                        { title: 'BFS Loop & Output', desc: 'Record distance +1 for adjacent cells and output destination distance.', code: 'while q:\n    y, x = q.popleft()\n    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M and maze[ny][nx]=="1" and dist[ny][nx]==0:\n            dist[ny][nx] = dist[y][x] + 1\n            q.append((ny, nx))\nprint(dist[N-1][M-1])' }
                    ],
                    cpp: [
                        { title: 'Input & Maze Construction', desc: 'char \uBC30\uC5F4\uB85C \uBB38\uC790\uC5F4 \uC785\uB825, string \uB300\uC2E0 scanf', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<string> maze(N);\n    for (int i = 0; i < N; i++) {\n        char s[110];\n        scanf("%s", s);\n        maze[i] = s;\n    }' },
                        { title: 'BFS Traversal', desc: 'Initialize dist to -1, set starting cell to 1.', code: '    int dx[] = {0, 0, 1, -1};\n    int dy[] = {1, -1, 0, 0};\n    // dist \uBC30\uC5F4: -1\uC774\uBA74 \uBBF8\uBC29\uBB38, 1\uBD80\uD130 \uC2DC\uC791(\uC2DC\uC791\uCE78 \uD3EC\uD568)\n    vector<vector<int>> dist(N, vector<int>(M, -1));\n    dist[0][0] = 1;\n    queue<pair<int,int>> q;\n    q.push({0, 0});' },
                        { title: 'BFS Loop & Output', desc: 'Record shortest distances via 4-directional search and output destination value.', code: '    while (!q.empty()) {\n        auto [r, c] = q.front(); q.pop();\n        for (int d = 0; d < 4; d++) {\n            int nr = r+dx[d], nc = c+dy[d];\n            if (nr>=0 && nr<N && nc>=0 && nc<M\n                && maze[nr][nc]==\'1\' && dist[nr][nc]==-1) {\n                dist[nr][nc] = dist[r][c] + 1;\n                q.push({nr, nc});\n            }\n        }\n    }\n    printf("%d\\n", dist[N-1][M-1]);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[8].templates; }
            }]
        },
        {
            id: 'boj-1697',
            title: 'BOJ 1697 - Hide and Seek',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1697',
            simIntro: 'Subin finds the minimum number of moves to reach their sibling using BFS.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Subin is currently at point N (0 <= N <= 100,000), and their sibling is at point K (0 <= K <= 100,000). Subin can walk or teleport. If Subin is at position X and walks, they move to X-1 or X+1 after 1 second. If they teleport, they move to position 2*X after 1 second.</p>
                <p>Given the positions of Subin and their sibling, write a program to find the fastest time (in seconds) for Subin to find their sibling.</p>
                <h4>Input</h4>
                <p>The first line contains Subin's position N and the sibling's position K. N and K are integers.</p>
                <h4>Output</h4>
                <p>Print the fastest time for Subin to find their sibling.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 17</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>0 0</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div><p class="example-explain">If Subin and their sibling are at the same position, no movement is needed.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>0 ≤ N ≤ 100,000</li>
                    <li>0 ≤ K ≤ 100,000</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'Subin can move from position N in three ways: X-1, X+1, or 2*X. What if we try all possible moves until we reach sibling K?<br><br>Does this look familiar?' },
                { title: 'But there\'s a problem with this', content: 'If we blindly try all moves, we might go back and forth to the same positions. And we need the <strong>fastest</strong> time...<br><br>Wait, this can be converted into a <strong>graph problem</strong>! If we think of each coordinate as a <strong>vertex</strong> and each move (X-1, X+1, 2X) as an <strong>edge</strong>, we can find the shortest distance using BFS!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="width:30px;height:30px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">5</div><span style="color:var(--text3);">→</span><div style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:0.8rem;">-1</div><div style="padding:2px 8px;background:var(--bg2);border-radius:4px;font-size:0.8rem;">+1</div><div style="padding:2px 8px;background:var(--yellow);color:#333;border-radius:4px;font-size:0.8rem;font-weight:600;">x2</div><span style="color:var(--text3);margin-left:4px;">← 3 moves = 3 edges</span></div>' },
                { title: 'What if we try this?', content: 'Start BFS from N, moving in three directions from each position:<br>1. X-1 (walk backward)<br>2. X+1 (walk forward)<br>3. 2*X (teleport)<br><br>Since it is BFS, the first time we reach K is the minimum time!<br>Example: 5 -> 10 -> 9 -> 18 -> 17 (4 seconds)' },
                { title: 'Watch out for this', content: 'Since positions range from 0 to 100,000, the <code>dist</code> array size must be 100,001.<br>Ignore any position that is less than 0 or greater than 100,000!<br><br><span class="lang-py">Python: move in three directions with <code>for nx in (x-1, x+1, x*2):</code></span><span class="lang-cpp">C++: move in three directions with <code>for (int nx : {x-1, x+1, 2*x}):</code></span>' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Shortest Moves',
                description: 'Explores +1, -1, *2 moves from the starting position via BFS to find the minimum time.',
                timeComplexity: 'O(max_pos)',
                spaceComplexity: 'O(max_pos)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read starting position N and target position K.', code: 'from collections import deque\n\nN, K = map(int, input().split())' },
                        { title: 'BFS Traversal', desc: 'Initialize visited to -1, set starting point to 0.', code: 'MAX = 100001\nvisited = [-1] * MAX\nvisited[N] = 0\nq = deque([N])' },
                        { title: 'BFS Loop & Output', desc: 'Explore X-1, X+1, 2*X three directional moves via BFS.', code: 'while q:\n    x = q.popleft()\n    if x == K:\n        print(visited[x])\n        break\n    for nx in (x-1, x+1, x*2):\n        if 0 <= nx < MAX and visited[nx] == -1:\n            visited[nx] = visited[x] + 1\n            q.append(nx)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Manage distances in range 0~100000 with a global dist array.', code: '#include <iostream>\n#include <queue>\n#include <cstring>\nusing namespace std;\n\nint dist[100001]; // \uAC01 \uC704\uCE58\uAE4C\uC9C0\uC758 \uCD5C\uC18C \uC774\uB3D9 \uD69F\uC218\n\nint main() {\n    int N, K;\n    scanf("%d %d", &N, &K);' },
                        { title: 'BFS Traversal', desc: 'memset\uC73C\uB85C -1 \uCD08\uAE30\uD654, initializer list\uB85C 3\uBC29\uD5A5 \uC774\uB3D9', code: '    memset(dist, -1, sizeof(dist));\n    dist[N] = 0;\n    queue<int> q;\n    q.push(N);' },
                        { title: 'BFS Loop & Output', desc: 'Output minimum moves upon reaching target position K.', code: '    while (!q.empty()) {\n        int x = q.front(); q.pop();\n        if (x == K) {\n            printf("%d\\n", dist[x]);\n            return 0;\n        }\n        // X-1, X+1, 2*X \uC138 \uBC29\uD5A5 \uC774\uB3D9\n        for (int nx : {x-1, x+1, 2*x}) {\n            if (nx >= 0 && nx <= 100000 && dist[nx] == -1) {\n                dist[nx] = dist[x] + 1;\n                q.push(nx);\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[9].templates; }
            }]
        },
        {
            id: 'boj-7562',
            title: 'BOJ 7562 - Knight Moves',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7562',
            simIntro: 'A knight on a chessboard finds the minimum moves to the target using BFS.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A knight is placed on a chessboard. The cells the knight can move to in one step are shown in the figure below. The cell the knight wants to move to is given. How many moves does the knight need to reach that cell?</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases. Each test case consists of three lines. The first line contains the length of one side of the chessboard l (4 ≤ l ≤ 300). The chessboard size is l x l. Each cell is represented by a pair of numbers {0, ..., l-1} x {0, ..., l-1}. The second and third lines contain the knight's current cell and the target cell, respectively.</p>
                <h4>Output</h4>
                <p>For each test case, print the minimum number of moves for the knight.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3
8
0 0
7 0
100
0 0
30 50
10
1 1
1 1</pre></div>
                    <div><strong>Output</strong><pre>5
28
0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>4 <= I <= 300 (length of one side of the chessboard)</li>
                    <li>T <= 100 (number of test cases)</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'We need to find the <strong>minimum number of moves</strong> for the knight to reach the target cell. The knight can move in 8 L-shaped directions.<br><br>Like the previous problem (Hide and Seek), let us think of <strong>shortest distance = BFS</strong>!' },
                { title: 'But there\'s a problem with this', content: 'Maze exploration used 4 directions (up/down/left/right), but the knight has <strong>8 directions</strong>. How do we represent these 8 directions?<br><br>The knight moves 2 horizontally + 1 vertically, or 1 horizontally + 2 vertically, so we can create 8 combinations using dx/dy arrays!<br><br><div style="display:inline-grid;grid-template-columns:repeat(5,24px);gap:2px;padding:6px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--accent);color:white;font-size:0.7rem;border-radius:3px;font-weight:700;">N</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span><span style="text-align:center;padding:2px;background:var(--yellow);color:#333;font-size:0.7rem;border-radius:3px;">x</span><span style="text-align:center;padding:2px;font-size:0.7rem;border-radius:3px;"></span></div> <span style="font-size:0.82rem;color:var(--text2);">← knight 8 dirs</span>' },
                { title: 'What if we try this?', content: 'The knight moves in 8 directions:<br><code>dx = [-2, -2, -1, -1, 1, 1, 2, 2]</code><br><code>dy = [-1, 1, -2, 2, -2, 2, -1, 1]</code><br><br>Running BFS from the starting cell, the first time we reach the target cell gives the minimum number of moves. It is the same pattern as maze exploration!' },
                { title: 'Watch out for this', content: 'If the starting and ending positions are the same, output 0 immediately!<br><br>Since there are multiple test cases, you must reinitialize the <code>dist</code> array each time.' }
            ],
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Knight Moves',
                description: 'Explores the 8-directional knight moves on a chessboard via BFS to find minimum moves.',
                timeComplexity: 'O(L^2)',
                spaceComplexity: 'O(L^2)',
                codeSteps: {
                    python: [
                        { title: 'Input & Initialization', desc: 'Define knight 8-directional moves as a list of tuples.', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nT = int(input())\nmoves = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]' },
                        { title: 'BFS Traversal', desc: 'Initialize dist array and prepare BFS for each test case.', code: 'for _ in range(T):\n    L = int(input())\n    sx, sy = map(int, input().split())\n    ex, ey = map(int, input().split())\n    dist = [[-1]*L for _ in range(L)]\n    dist[sx][sy] = 0\n    q = deque([(sx, sy)])' },
                        { title: 'BFS Loop & Output', desc: 'Output minimum moves upon reaching the target via 8-directional moves.', code: '    while q:\n        x, y = q.popleft()\n        if x == ex and y == ey:\n            print(dist[x][y])\n            break\n        for dx, dy in moves:\n            nx, ny = x+dx, y+dy\n            if 0<=nx<L and 0<=ny<L and dist[nx][ny]==-1:\n                dist[nx][ny] = dist[x][y] + 1\n                q.append((nx, ny))' }
                    ],
                    cpp: [
                        { title: 'Input & Initialization', desc: '\uB098\uC774\uD2B8 8\uBC29\uD5A5 \uC774\uB3D9\uC744 dx/dy \uBC30\uC5F4\uB85C \uC815\uC758', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\n// \uB098\uC774\uD2B8\uC758 8\uBC29\uD5A5 \uC774\uB3D9\nint dx[] = {-2, -2, -1, -1, 1, 1, 2, 2};\nint dy[] = {-1, 1, -2, 2, -2, 2, -1, 1};\n\nint main() {\n    int T;\n    scanf("%d", &T);' },
                        { title: 'BFS Traversal', desc: 'Output 0 if start equals destination, otherwise begin BFS.', code: '    while (T--) {\n        int L;\n        scanf("%d", &L);\n        int sr, sc, er, ec;\n        scanf("%d %d %d %d", &sr, &sc, &er, &ec);\n        if (sr == er && sc == ec) { puts("0"); continue; }\n\n        vector<vector<int>> dist(L, vector<int>(L, -1));\n        dist[sr][sc] = 0;\n        queue<pair<int,int>> q;\n        q.push({sr, sc});' },
                        { title: 'BFS Loop & Output', desc: 'Output minimum moves upon reaching target via 8-directional BFS.', code: '        while (!q.empty()) {\n            auto [r, c] = q.front(); q.pop();\n            if (r == er && c == ec) {\n                printf("%d\\n", dist[r][c]);\n                break;\n            }\n            for (int d = 0; d < 8; d++) {\n                int nr = r+dx[d], nc = c+dy[d];\n                if (nr>=0 && nr<L && nc>=0 && nc<L && dist[nr][nc]==-1) {\n                    dist[nr][nc] = dist[r][c] + 1;\n                    q.push({nr, nc});\n                }\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[10].templates; }
            }]
        },
        {
            id: 'boj-7576',
            title: 'BOJ 7576 - Tomato',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7576',
            simIntro: 'Starts BFS simultaneously from all ripe tomatoes to find the minimum days to ripen all.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Cheolsu has a large warehouse at his tomato farm for storing tomatoes. Tomatoes are stored in the warehouse by placing them one by one in the cells of a grid-shaped box, as shown in the figure below.</p>
                <p>Among the tomatoes stored in the warehouse, some may be ripe while others are still unripe. After one day of storage, unripe tomatoes adjacent to ripe tomatoes become ripe due to the influence of the ripe tomatoes. Adjacent cells of a tomato refer to the four directions: left, right, front, and back. Tomatoes in diagonal directions are not affected, and we assume tomatoes do not ripen on their own.</p>
                <p>Write a program to find the minimum number of days until all stored tomatoes are ripe. Note that some cells in the box may not contain tomatoes. Integer 1 represents a ripe tomato, integer 0 represents an unripe tomato, and integer -1 represents an empty cell.</p>
                <p>If all tomatoes cannot ripen, output -1. If all tomatoes are already ripe when stored, output 0.</p>
                <h4>Input</h4>
                <p>The first line contains two integers M and N representing the size of the box. M is the number of horizontal cells and N is the number of vertical cells, where 2 ≤ M, N ≤ 1,000. From the second line, N lines contain the tomato information. Each line contains M integers: 1 for ripe, 0 for unripe, -1 for empty. At least one tomato is given in the input.</p>
                <h4>Output</h4>
                <p>Print the minimum number of days until all tomatoes are ripe. If all tomatoes are already ripe when stored, print 0. If not all tomatoes can ripen, print -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6 4
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 0
0 0 0 0 0 1</pre></div>
                    <div><strong>Output</strong><pre>8</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6 4
0 0 -1 0 0 0
0 0 1 0 -1 0
0 0 -1 0 0 0
0 0 0 0 -1 1</pre></div>
                    <div><strong>Output</strong><pre>6</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6 4
1 -1 0 0 0 0
0 -1 0 0 0 0
0 0 0 0 -1 0
0 0 0 0 -1 1</pre></div>
                    <div><strong>Output</strong><pre>-1</pre></div>
                </div><p class="example-explain">Some tomatoes cannot be reached because they are blocked by walls (-1).</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ M, N ≤ 1,000</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'If we pick one ripe tomato and run BFS... wait, there can be <strong>multiple</strong> ripe tomatoes! Do we need to run BFS from each one separately?' },
                { title: 'But there\'s a problem with this', content: 'Running separate BFS from each ripe tomato is inefficient. And if you look carefully at the problem, the ripe tomatoes ripen their neighbors <strong>simultaneously</strong>!<br><br>That is, all adjacent cells of all ripe tomatoes must ripen at the same time each day. Spreading one by one in order would give a different answer!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;"><span style="font-weight:600;">Multi-source BFS:</span><span style="padding:3px 8px;background:var(--red);color:white;border-radius:4px;">tomA</span><span style="padding:3px 8px;background:var(--red);color:white;border-radius:4px;">tomB</span><span style="color:var(--text3);">→ enqueue together!</span></div></div>' },
                { title: 'What if we try this?', content: 'Use <strong>multi-source BFS</strong>! Put all ripe tomatoes (1) into the queue from the start and run BFS just once:<br><br>1. While reading the grid, enqueue all cells with value 1 (dist = 0)<br>2. BFS: ripen adjacent unripe tomatoes (0) while recording distance<br>3. After BFS, if any 0 cells remain, output -1; otherwise the maximum distance is the answer' },
                { title: 'Why does this work?', content: 'Since BFS processes cells closest first, putting all starting points in simultaneously naturally achieves the "spreading simultaneously" effect.<br><br>Time complexity is O(N*M) - very efficient since each cell is visited exactly once!' }
            ],
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
            queue.append((r, c))  # multi-source starting point!

dx = [0, 0, 1, -1]
dy = [1, -1, 0, 0]
dist = [[-1] * M for _ in range(N)]

# distance of initially ripe tomatoes = 0
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'Multi-source BFS',
                description: 'Performs BFS simultaneously from all ripe tomatoes to find the minimum days.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Initial Tomato Collection', desc: 'Enqueue all ripe tomatoes (1) to create multiple starting points.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nM, N = map(int, input().split())\nbox = []\nq = deque()\nfor i in range(N):\n    row = list(map(int, input().split()))\n    box.append(row)\n    for j in range(M):\n        if row[j] == 1:\n            q.append((i, j))' },
                        { title: 'BFS Traversal', desc: 'Ripen unripe tomatoes in 4 directions while recording days.', code: 'dx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nwhile q:\n    y, x = q.popleft()\n    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M and box[ny][nx]==0:\n            box[ny][nx] = box[y][x] + 1\n            q.append((ny, nx))' },
                        { title: 'Result Calculation & Output', desc: 'Output -1 if unripe tomatoes remain, otherwise output max days.', code: 'ans = 0\nfor i in range(N):\n    for j in range(M):\n        if box[i][j] == 0:\n            print(-1)\n            exit()\n        ans = max(ans, box[i][j])\nprint(ans - 1)' }
                    ],
                    cpp: [
                        { title: 'Input & Initial Tomato Collection', desc: '\uB2E4\uC911 \uC2DC\uC791\uC810 BFS: \uC775\uC740 \uD1A0\uB9C8\uD1A0\uB97C \uBAA8\uB450 \uD050\uC5D0 \uB123\uACE0 \uC2DC\uC791', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int M, N;\n    scanf("%d %d", &M, &N);\n    vector<vector<int>> box(N, vector<int>(M));\n    queue<pair<int,int>> q;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++) {\n            scanf("%d", &box[i][j]);\n            if (box[i][j] == 1)\n                q.push({i, j}); // \uC775\uC740 \uD1A0\uB9C8\uD1A0 \uBAA8\uB450 \uD050\uC5D0 \uB123\uAE30\n        }' },
                        { title: 'BFS Traversal', desc: 'Performs 4-directional BFS, ripening adjacent tomatoes and recording days.', code: '    int dx[] = {0, 0, 1, -1};\n    int dy[] = {1, -1, 0, 0};\n    while (!q.empty()) {\n        auto [y, x] = q.front(); q.pop();\n        for (int d = 0; d < 4; d++) {\n            int ny = y+dx[d], nx = x+dy[d];\n            if (ny>=0 && ny<N && nx>=0 && nx<M && box[ny][nx]==0) {\n                box[ny][nx] = box[y][x] + 1;\n                q.push({ny, nx});\n            }\n        }\n    }' },
                        { title: 'Result Calculation & Output', desc: 'If any 0 remains, output -1; otherwise the answer is max value minus 1.', code: '    int ans = 0;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++) {\n            if (box[i][j] == 0) { puts("-1"); return 0; }\n            ans = max(ans, box[i][j]);\n        }\n    printf("%d\\n", ans - 1);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[11].templates; }
            }]
        },
        {
            id: 'boj-7569',
            title: 'BOJ 7569 - Tomato (3D)',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/7569',
            simIntro: 'Ripe tomatoes in a 3D box perform 6-directional BFS.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Cheolsu has a large warehouse at his tomato farm for storing tomatoes. Tomatoes are stored in the warehouse by placing them one by one in the cells of grid-shaped boxes.</p>
                <p>Among the stored tomatoes, some may be ripe while others are still unripe. After one day, unripe tomatoes adjacent to ripe tomatoes become ripe. Adjacent cells of a tomato refer to the <strong>six directions</strong>: up, down, left, right, front, and back. Tomatoes in diagonal directions are not affected, and we assume tomatoes do not ripen on their own.</p>
                <p>Write a program to find the minimum number of days until all stored tomatoes are ripe. Note that some cells in the box may not contain tomatoes.</p>
                <h4>Input</h4>
                <p>The first line contains two integers M, N and the number of stacked boxes H. M is the number of horizontal cells, N is the number of vertical cells, where 2 ≤ M, N ≤ 100, 1 ≤ H ≤ 100. From the second line, tomato information is given from the bottom box to the top box. Each box has N lines with M integers: 1 for ripe, 0 for unripe, -1 for empty. At least one tomato is given in the input.</p>
                <h4>Output</h4>
                <p>Print the minimum number of days until all tomatoes are ripe. If all tomatoes are already ripe when stored, print 0. If not all tomatoes can ripen, print -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 3 2
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 1 0 0
0 0 0 0 0</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ M, N ≤ 100</li>
                    <li>1 ≤ H ≤ 100</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'If you solved problem 7576 (Tomato 2D), it seems like we can use the same multi-source BFS. Put all ripe tomatoes in the queue and run BFS...' },
                { title: 'But there\'s a problem with this', content: 'This time the boxes are stacked in <strong>multiple layers</strong>! In 2D it was 4 directions (up/down/left/right), but in 3D we need to extend to <strong>6 directions</strong> including <strong>above/below layers</strong>.<br><br>The array also changes from 2D to 3D: <code>grid[h][r][c]</code><br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--text2);">2D: 4 dirs</span> <span style="padding:2px 8px;background:var(--bg2);border-radius:4px;">up/down/left/right</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--accent);font-weight:600;">3D: 6 dirs</span> <span style="padding:2px 8px;background:var(--bg2);border-radius:4px;">up/down/left/right</span><span style="padding:2px 8px;background:var(--yellow);color:#333;border-radius:4px;font-weight:600;">+ above/below</span></div></div>' },
                { title: 'What if we try this?', content: 'Just change two things from problem 7576 code:<br><br>1. Add above/below to direction arrays:<br><code>dh = [0,0,0,0,1,-1]</code> (above +1, below -1)<br><code>dr = [0,0,1,-1,0,0]</code><br><code>dc = [1,-1,0,0,0,0]</code><br><br>2. Put <code>(h, r, c)</code> 3 coordinates in the queue<br><br>The rest of the multi-source BFS logic is exactly the same as problem 7576!' }
            ],
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

# 6 directions: up/down/left/right + above/below floors
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
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: '3D Multi-source BFS',
                description: 'Performs 6-directional BFS from ripe tomatoes in a 3D box.',
                timeComplexity: 'O(H * N * M)',
                spaceComplexity: 'O(H * N * M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Initial Tomato Collection', desc: 'Read the 3D box layer by layer and enqueue ripe tomatoes.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nM, N, H = map(int, input().split())\nbox = []\nq = deque()\nfor h in range(H):\n    layer = []\n    for i in range(N):\n        row = list(map(int, input().split()))\n        layer.append(row)\n        for j in range(M):\n            if row[j] == 1:\n                q.append((h, i, j))\n    box.append(layer)' },
                        { title: '6-directional BFS Traversal', desc: 'Ripen tomatoes in 6 directions: up/down/left/right + above/below.', code: 'dz = [0, 0, 0, 0, 1, -1]\ndy = [1, -1, 0, 0, 0, 0]\ndx = [0, 0, 1, -1, 0, 0]\nwhile q:\n    z, y, x = q.popleft()\n    for d in range(6):\n        nz, ny, nx = z+dz[d], y+dy[d], x+dx[d]\n        if 0<=nz<H and 0<=ny<N and 0<=nx<M and box[nz][ny][nx]==0:\n            box[nz][ny][nx] = box[z][y][x] + 1\n            q.append((nz, ny, nx))' },
                        { title: 'Result Calculation & Output', desc: 'Check for unripe tomatoes with triple loop and output max days.', code: 'ans = 0\nfor h in range(H):\n    for i in range(N):\n        for j in range(M):\n            if box[h][i][j] == 0:\n                print(-1)\n                exit()\n            ans = max(ans, box[h][i][j])\nprint(ans - 1)' }
                    ],
                    cpp: [
                        { title: 'Input & Initial Tomato Collection', desc: 'tuple<int,int,int> \uD050\uB85C 3\uCC28\uC6D0 BFS, \uC804\uC5ED \uBC30\uC5F4\uB85C \uBA54\uBAA8\uB9AC \uD655\uBCF4', code: '#include <iostream>\n#include <queue>\n#include <tuple>\n#include <algorithm>\n#include <cstring>\nusing namespace std;\n\nint grid[100][100][100];\nint dh[] = {0,0,0,0,1,-1};\nint dr[] = {0,0,1,-1,0,0};\nint dc[] = {1,-1,0,0,0,0};\n\nint main() {\n    int M, N, H;\n    scanf("%d %d %d", &M, &N, &H);\n    queue<tuple<int,int,int>> q;\n\n    for (int h = 0; h < H; h++)\n        for (int r = 0; r < N; r++)\n            for (int c = 0; c < M; c++) {\n                scanf("%d", &grid[h][r][c]);\n                if (grid[h][r][c] == 1)\n                    q.push({h, r, c});\n            }' },
                        { title: '6-directional BFS Traversal', desc: 'Perform BFS in 6 directions: up/down/left/right + above/below layers.', code: '    while (!q.empty()) {\n        auto [h, r, c] = q.front(); q.pop();\n        for (int d = 0; d < 6; d++) {\n            int nh = h+dh[d], nr = r+dr[d], nc = c+dc[d];\n            if (nh>=0 && nh<H && nr>=0 && nr<N && nc>=0 && nc<M\n                && grid[nh][nr][nc] == 0) {\n                grid[nh][nr][nc] = grid[h][r][c] + 1;\n                q.push({nh, nr, nc});\n            }\n        }\n    }' },
                        { title: 'Result Calculation & Output', desc: 'Check for remaining 0s via triple loop, then output max-1.', code: '    int ans = 0;\n    for (int h = 0; h < H; h++)\n        for (int r = 0; r < N; r++)\n            for (int c = 0; c < M; c++) {\n                if (grid[h][r][c] == 0) {\n                    puts("-1"); return 0;\n                }\n                ans = max(ans, grid[h][r][c]);\n            }\n    printf("%d\\n", ans - 1);\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[12].templates; }
            }]
        },
        {
            id: 'boj-16928',
            title: 'BOJ 16928 - Snakes and Ladders',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/16928',
            simIntro: 'Models the Snakes and Ladders board as a graph to find minimum moves via BFS.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Cubelover, who enjoys playing the Snakes and Ladders game, became curious about the minimum number of dice rolls needed to get from square 1 to square 100, achievable on any game board.</p>
                <p>The game involves rolling a die and moving the game piece by the number rolled. If the piece lands on a snake, it slides down. If it lands on a ladder, it climbs up. The die is rolled with the piece on the board, and the die value indicates the number of squares to move. The piece cannot move past square 100. If the piece lands on a ladder, it must climb up; if it lands on a snake, it must slide down.</p>
                <h4>Input</h4>
                <p>The first line contains the number of ladders N (1 ≤ N ≤ 15) and the number of snakes M (1 ≤ M ≤ 15).</p>
                <p>The next N lines contain ladder information x, y (x &lt; y). Landing on square x moves you to square y.</p>
                <p>The next M lines contain snake information u, v (u &gt; v). Landing on square u moves you to square v.</p>
                <p>Squares 1 and 100 have no ladder or snake. No square has more than one ladder or snake.</p>
                <h4>Output</h4>
                <p>Print the minimum number of dice rolls needed to get from square 1 to square 100.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 7
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
                    <div><strong>Output</strong><pre>3</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 15</li>
                    <li>Starting and ending positions of all ladders and snakes are distinct</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'We need to roll the die from square 1 to reach square 100. Rolling moves us 1 to 6 squares; ladders take us up, snakes take us down...<br><br>We need the minimum number of dice rolls, so do we have to try all cases?' },
                { title: 'But there\'s a problem with this', content: 'Exploring all cases blindly would give too many possibilities. Wait, can we view this as a <strong>graph</strong> problem?<br><br>If we think of square numbers (1 to 100) as <strong>vertices</strong> and die moves (1 to 6) as <strong>edges</strong>, we can solve it with <strong>shortest distance = BFS</strong>!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">sq3</div><span style="color:var(--text3);">→ dice</span><div style="padding:3px 8px;background:var(--bg2);border-radius:4px;">sq7</div><span style="color:var(--text3);">→ ladder!</span><div style="padding:3px 8px;background:var(--green);color:white;border-radius:4px;">sq32</div></div>' },
                { title: 'What if we try this?', content: 'Start BFS from square 1:<br>1. From the current square, compute next squares using die rolls 1 to 6<br>2. If the next square has a ladder/snake, <strong>teleport</strong> to its destination<br>3. If the square has not been visited yet, enqueue it<br>4. When square 100 is reached, output the distance!<br><br><span class="lang-py">Python: store ladders/snakes in a <code>dict</code>: <code>teleport[x] = y</code></span><span class="lang-cpp">C++: store in an array: <code>teleport[x] = y</code> (0 means no ladder/snake)</span>' }
            ],
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
        # forced move if ladder or snake is present
        if npos in teleport:
            npos = teleport[npos]
        if dist[npos] == -1:
            dist[npos] = dist[pos] + 1
            queue.append(npos)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Graph Search',
                description: 'Models snakes and ladders as edges and finds minimum moves from 1 to 100 via BFS.',
                timeComplexity: 'O(100)',
                spaceComplexity: 'O(100)',
                codeSteps: {
                    python: [
                        { title: 'Input & Snake/Ladder Setup', desc: 'Store ladder/snake destinations in the move array.', code: 'from collections import deque\n\nN, M = map(int, input().split())\nmove = [0] * 101\nfor _ in range(N + M):\n    a, b = map(int, input().split())\n    move[a] = b' },
                        { title: 'BFS Initialization', desc: 'Starting from square 1, set dist[1]=0.', code: 'dist = [-1] * 101\ndist[1] = 0\nq = deque([1])' },
                        { title: 'BFS Traversal & Output', desc: 'Move 1~6 with dice, but force-move if ladder/snake present.', code: 'while q:\n    x = q.popleft()\n    for dice in range(1, 7):\n        nx = x + dice\n        if nx > 100: continue\n        if move[nx] != 0: nx = move[nx]\n        if dist[nx] == -1:\n            dist[nx] = dist[x] + 1\n            q.append(nx)\nprint(dist[100])' }
                    ],
                    cpp: [
                        { title: 'Input & Snake/Ladder Setup', desc: '\uBC30\uC5F4\uB85C \uC0AC\uB2E4\uB9AC/\uBC40 \uB9F5\uD551 \uC800\uC7A5', code: '#include <iostream>\n#include <queue>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    int teleport[101] = {}; // \uC0AC\uB2E4\uB9AC/\uBC40 \uC774\uB3D9 \uB9F5\uD551\n    for (int i = 0; i < N + M; i++) {\n        int x, y;\n        scanf("%d %d", &x, &y);\n        teleport[x] = y;\n    }' },
                        { title: 'BFS Initialization', desc: 'Initialize dist to -1 via memset, start from square 1.', code: '    int dist[101];\n    memset(dist, -1, sizeof(dist));\n    dist[1] = 0;\n    queue<int> q;\n    q.push(1);' },
                        { title: 'BFS Traversal & Output', desc: 'Handle forced moves via teleport array after dice roll 1~6.', code: '    while (!q.empty()) {\n        int pos = q.front(); q.pop();\n        if (pos == 100) {\n            printf("%d\\n", dist[pos]);\n            return 0;\n        }\n        for (int d = 1; d <= 6; d++) {\n            int npos = pos + d;\n            if (npos > 100) continue;\n            // \uC0AC\uB2E4\uB9AC/\uBC40\uC774 \uC788\uC73C\uBA74 \uAC15\uC81C \uC774\uB3D9\n            if (teleport[npos]) npos = teleport[npos];\n            if (dist[npos] == -1) {\n                dist[npos] = dist[pos] + 1;\n                q.push(npos);\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[13].templates; }
            }]
        },
        {
            id: 'boj-1707',
            title: 'BOJ 1707 - Bipartite Graph',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1707',
            simIntro: 'Determines bipartiteness by 2-coloring the graph using BFS.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>When the set of vertices of a graph can be partitioned into two groups such that no two vertices within the same group are adjacent, such a graph is called a Bipartite Graph.</p>
                <p>Given a graph as input, write a program to determine whether the graph is bipartite or not.</p>
                <h4>Input</h4>
                <p>The input consists of multiple test cases. The first line contains the number of test cases K. For each test case, the first line contains the number of vertices V and the number of edges E, separated by a space. Vertices are numbered from 1 to V. The next E lines each contain two adjacent vertex numbers u, v (1 ≤ u, v ≤ V), separated by a space.</p>
                <h4>Output</h4>
                <p>For each of the K test cases, print YES if the graph is bipartite, NO otherwise, one per line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2
3 2
1 3
2 3
4 4
1 2
2 3
3 4
4 2</pre></div>
                    <div><strong>Output</strong><pre>YES
NO</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ K ≤ 5</li>
                    <li>1 ≤ V ≤ 20,000</li>
                    <li>1 ≤ E ≤ 200,000</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'A bipartite graph is one where vertices can be divided into two groups with no edges within the same group.<br><br>Could we try all possible 2-way partitions? With V vertices, that is 2^V cases...' },
                { title: 'But there\'s a problem with this', content: 'If V is at most 20,000, that is 2^20000 cases?! That is absolutely impossible.<br><br>Let us think differently. A bipartite graph can be <strong>2-colored</strong>: if adjacent vertices always have different colors, it is bipartite!<br><br><div style="display:flex;gap:6px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;flex-wrap:wrap;"><div style="width:28px;height:28px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><span style="color:var(--text3);">—</span><div style="width:28px;height:28px;border-radius:50%;background:#00b894;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><span style="color:var(--text3);">—</span><div style="width:28px;height:28px;border-radius:50%;background:var(--accent);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">C</div><span style="color:var(--text3);margin-left:6px;">← alternate colors!</span></div>' },
                { title: 'What if we try this?', content: 'Use <strong>2-coloring BFS</strong>:<br>1. Color the starting vertex with color 0<br>2. Use BFS to color neighbors with 1, their neighbors with 0, alternating<br>3. If a neighbor already colored has the <strong>same color</strong> as the current vertex, it is NOT bipartite (NO)<br>4. If no conflict occurs, it IS bipartite (YES)' },
                { title: 'Watch out for this', content: 'The graph may <strong>not be connected</strong>! That is, there can be multiple disconnected components.<br><br>You must iterate through all vertices, and if an uncolored vertex is found, start a new BFS from there.<br>Do not forget to reinitialize the <code>color</code> array for each test case!' }
            ],
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
                    color[u] = 1 - color[v]  # opposite color
                    queue.append(u)
                elif color[u] == color[v]:
                    is_bipartite = False
                    break
            if not is_bipartite:
                break
        if not is_bipartite:
            break

    print("YES" if is_bipartite else "NO")`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'BFS Bipartite Check',
                description: 'Colors the graph with 2 colors and checks if adjacent vertices share a color.',
                timeComplexity: 'O(V + E)',
                spaceComplexity: 'O(V + E)',
                codeSteps: {
                    python: [
                        { title: 'Input & Graph Construction', desc: 'Create a fresh graph for each test case.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nK = int(input())\nfor _ in range(K):\n    V, E = map(int, input().split())\n    graph = [[] for _ in range(V + 1)]\n    for _ in range(E):\n        u, v = map(int, input().split())\n        graph[u].append(v)\n        graph[v].append(u)' },
                        { title: 'BFS 2-Coloring', desc: 'Color adjacent vertices with opposite colors; conflict means not bipartite.', code: '    color = [0] * (V + 1)\n    is_bipartite = True\n    for start in range(1, V + 1):\n        if color[start] != 0: continue\n        q = deque([start])\n        color[start] = 1\n        while q and is_bipartite:\n            v = q.popleft()\n            for u in graph[v]:\n                if color[u] == 0:\n                    color[u] = -color[v]\n                    q.append(u)\n                elif color[u] == color[v]:\n                    is_bipartite = False' },
                        { title: 'Output Result', desc: 'Output YES/NO based on bipartite check result.', code: '    print("YES" if is_bipartite else "NO")' }
                    ],
                    cpp: [
                        { title: 'Input & Graph Construction', desc: 'Create a vector graph for each test case.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int K;\n    scanf("%d", &K);\n    while (K--) {\n        int V, E;\n        scanf("%d %d", &V, &E);\n        vector<vector<int>> graph(V + 1);\n        for (int i = 0; i < E; i++) {\n            int u, v;\n            scanf("%d %d", &u, &v);\n            graph[u].push_back(v);\n            graph[v].push_back(u);\n        }' },
                        { title: 'BFS 2-Coloring', desc: 'vector<int> color\uB85C 0/1/-1 \uC0C9 \uAD00\uB9AC', code: '        // 0: \uBBF8\uBC29\uBB38, 1/-1: \uB450 \uAC00\uC9C0 \uC0C9\n        vector<int> color(V + 1, 0);\n        bool ok = true;\n        for (int s = 1; s <= V && ok; s++) {\n            if (color[s] != 0) continue;\n            color[s] = 1;\n            queue<int> q;\n            q.push(s);\n            while (!q.empty() && ok) {\n                int v = q.front(); q.pop();\n                for (int u : graph[v]) {\n                    if (color[u] == 0) {\n                        color[u] = -color[v]; // \uBC18\uB300 \uC0C9 \uCE60\uD558\uAE30\n                        q.push(u);\n                    } else if (color[u] == color[v]) {\n                        ok = false; // \uAC19\uC740 \uC0C9\uC774\uBA74 \uC774\uBD84 \uADF8\uB798\uD504 X\n                    }\n                }\n            }\n        }' },
                        { title: 'Output Result', desc: 'Output check result as YES/NO.', code: '        puts(ok ? "YES" : "NO");\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[14].templates; }
            }]
        },
        {
            id: 'boj-2206',
            title: 'BOJ 2206 - Breaking Walls',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2206',
            simIntro: 'Performs 3D BFS separating wall-broken and wall-intact states.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There is a map represented as an N by M matrix. In the map, 0 indicates a passable location and 1 indicates a wall that cannot be passed. You want to move from (1, 1) to (N, M) using the shortest path. The shortest path means the path passing through the fewest cells, counting both the starting and ending cells.</p>
                <p>If breaking one wall during movement results in a shorter path, you may break up to one wall and continue moving.</p>
                <p>From each cell, you can move to an adjacent cell in the four directions: up, down, left, and right. Given the map, write a program to find the shortest path.</p>
                <h4>Input</h4>
                <p>The first line contains N (1 ≤ N ≤ 1,000) and M (1 ≤ M ≤ 1,000). The next N lines contain M digits representing the map. (1, 1) and (N, M) are always 0.</p>
                <h4>Output</h4>
                <p>Print the shortest distance on the first line. If impossible, print -1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6 4
0100
0110
0000
0010
0100
0000</pre></div>
                    <div><strong>Output</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 4
0111
1111
1111
1110</pre></div>
                    <div><strong>Output</strong><pre>-1</pre></div>
                </div><p class="example-explain">Since only one wall can be broken, it is impossible to reach (4,4) from (1,1).</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 1,000</li>
                </ul>`,
            hints: [
                { title: 'First intuition', content: 'We need to find the shortest path from (1,1) to (N,M). We can break up to one wall... so should we first try BFS without breaking walls, then repeat BFS breaking each wall one at a time?' },
                { title: 'But there\'s a problem with this', content: 'If there are many walls, we would need to run BFS for each wall. With N, M up to 1,000, there could be hundreds of thousands of walls, so wall count * O(NM) = time limit exceeded!<br><br>Is there a way to handle wall breaking <strong>within</strong> BFS?<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="margin-bottom:4px;font-weight:600;color:var(--accent);">State expansion: (r, c, broken)</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><span style="padding:3px 8px;background:var(--bg2);border-radius:4px;">(3,2,0) no break</span><span style="padding:3px 8px;background:var(--yellow);color:#333;border-radius:4px;">(3,2,1) wall broken</span></div><div style="margin-top:4px;color:var(--text2);">Same position, different state!</div></div>' },
                { title: 'What if we try this?', content: 'Use <strong>state-extended BFS</strong>! Add "whether a wall has been broken" to position (r, c) to manage 3D states:<br><br><code>dist[r][c][broken]</code> (broken: 0=not yet broken, 1=already broken)<br><br>Movement rules:<br>- Empty cell (0): move normally (keep broken state)<br>- Wall (1) + broken=0: break the wall and move (change broken to 1)<br>- Wall (1) + broken=1: cannot move (already used the break)' },
                { title: 'Why does this work?', content: 'Even at the same (r, c), <strong>whether a wall was broken or not</strong> represents completely different states!<br><br>For example, arriving at (3, 4) without breaking a wall and arriving after breaking one have different paths available ahead. That is why they must be managed as separate states.<br><br>Put <code>(r, c, broken)</code> in the BFS queue, and the first time we reach the destination is the shortest distance.' }
            ],
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

# dist[r][c][broken]: broken=0 (not yet broken), broken=1 (already broken)
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
                # move to empty cell
                dist[nr][nc][broken] = dist[r][c][broken] + 1
                queue.append((nr, nc, broken))
            elif grid[nr][nc] == 1 and broken == 0 and dist[nr][nc][1] == -1:
                # break wall and move (only once allowed)
                dist[nr][nc][1] = dist[r][c][broken] + 1
                queue.append((nr, nc, 1))

print(-1)`,
                cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
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
}`
            },
            solutions: [{
                approach: 'State BFS (Wall Breaking)',
                description: 'Finds the shortest distance in a 3D state space (y, x, wallBroken) using BFS.',
                timeComplexity: 'O(N * M)',
                spaceComplexity: 'O(N * M)',
                codeSteps: {
                    python: [
                        { title: 'Input & Initialization', desc: 'Manages states using a 3D array: dist[y][x][wallBroken].', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nboard = []\nfor _ in range(N):\n    board.append(list(input().strip()))\n\ndist = [[[0]*2 for _ in range(M)] for _ in range(N)]\ndist[0][0][0] = 1' },
                        { title: 'BFS Traversal', desc: 'Dequeue (y, x, broken) states and check for arrival.', code: 'q = deque([(0, 0, 0)])  # y, x, broken\ndx = [0, 0, 1, -1]\ndy = [1, -1, 0, 0]\nwhile q:\n    y, x, broken = q.popleft()\n    if y == N-1 and x == M-1:\n        print(dist[y][x][broken])\n        exit()' },
                        { title: 'Wall Handling & Movement', desc: 'Move to empty cells directly; break walls only if not yet broken.', code: '    for d in range(4):\n        ny, nx = y+dy[d], x+dx[d]\n        if 0<=ny<N and 0<=nx<M:\n            if board[ny][nx]=="0" and dist[ny][nx][broken]==0:\n                dist[ny][nx][broken] = dist[y][x][broken] + 1\n                q.append((ny, nx, broken))\n            elif board[ny][nx]=="1" and broken==0 and dist[ny][nx][1]==0:\n                dist[ny][nx][1] = dist[y][x][broken] + 1\n                q.append((ny, nx, 1))\nprint(-1)' }
                    ],
                    cpp: [
                        { title: 'Input & Initialization', desc: '3\uCC28\uC6D0 \uBC30\uC5F4 dist[r][c][broken]\uC73C\uB85C \uC0C1\uD0DC \uD655\uC7A5 BFS', code: '#include <iostream>\n#include <queue>\n#include <tuple>\n#include <cstring>\nusing namespace std;\n\nint N, M;\nchar grid[1000][1001];\nint dist[1000][1000][2]; // [y][x][\uBCBD \uBD80\uC22C \uC5EC\uBD80]\nint dx[] = {0, 0, 1, -1};\nint dy[] = {1, -1, 0, 0};\n\nint main() {\n    scanf("%d %d", &N, &M);\n    for (int i = 0; i < N; i++) scanf("%s", grid[i]);\n    memset(dist, -1, sizeof(dist));\n    dist[0][0][0] = 1;' },
                        { title: 'BFS Traversal', desc: 'tuple<int,int,int>\uC73C\uB85C (y, x, broken) \uC0C1\uD0DC \uAD00\uB9AC', code: '    queue<tuple<int,int,int>> q;\n    q.push({0, 0, 0});\n\n    while (!q.empty()) {\n        auto [r, c, b] = q.front(); q.pop();\n        if (r == N-1 && c == M-1) {\n            printf("%d\\n", dist[r][c][b]);\n            return 0;\n        }' },
                        { title: 'Wall Handling & Movement', desc: 'Move to empty cells directly; break walls only when b==0.', code: '        for (int d = 0; d < 4; d++) {\n            int nr = r+dx[d], nc = c+dy[d];\n            if (nr<0 || nr>=N || nc<0 || nc>=M) continue;\n            // \uBE48 \uCE78: \uADF8\uB0E5 \uC774\uB3D9\n            if (grid[nr][nc]==\'0\' && dist[nr][nc][b]==-1) {\n                dist[nr][nc][b] = dist[r][c][b] + 1;\n                q.push({nr, nc, b});\n            }\n            // \uBCBD: \uC544\uC9C1 \uC548 \uBD80\uC20C\uC744 \uB54C\uB9CC \uBD80\uC218\uACE0 \uC774\uB3D9\n            if (grid[nr][nc]==\'1\' && b==0 && dist[nr][nc][1]==-1) {\n                dist[nr][nc][1] = dist[r][c][b] + 1;\n                q.push({nr, nc, 1});\n            }\n        }\n    }\n    puts("-1");\n    return 0;\n}' }
                    ]
                },
                get templates() { return graphTopic.problems[15].templates; }
            }]
        }
    ],

    // ===== Compatibility stubs =====
    _renderProblemDetail: function() {}
};

// ===== Register =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.graph = graphTopic;
