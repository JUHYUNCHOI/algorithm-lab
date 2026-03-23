// =========================================================
// Topological Sort Topic Module
// =========================================================
var topologicalSortTopic = {
    id: 'topologicalsort',
    title: 'Topological Sort',
    icon: '📋',
    category: 'Advanced (Gold~Platinum)',
    order: 17,
    description: 'A technique for linearly ordering all nodes in a DAG while respecting precedence constraints',
    relatedNote: 'Topological sort is used in build systems, course scheduling, task scheduling, and other problems with prerequisite constraints.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-14567': { type: 'Prerequisite Order',       color: '#00b894',      vizMethod: '_renderVizPrereq' },
        'boj-2252': { type: 'Basic Topological Sort',   color: 'var(--accent)', vizMethod: '_renderVizLineup' },
        'boj-1766': { type: 'Priority Queue Application',  color: 'var(--green)',  vizMethod: '_renderVizWorkbook' },
        'boj-3665': { type: 'Edge Reversal Application',    color: '#e17055',      vizMethod: '_renderVizRanking' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
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
            sim:     { intro: prob.simIntro || 'See how topological sort actually works in action.', icon: '🎮' },
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

    _renderProblemTab(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
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

    _renderCodeTab(contentEl, prob) {
        if (window.renderSolutionsCodeTab) {
            window.renderSolutionsCodeTab(contentEl, prob);
        } else {
            contentEl.innerHTML = '<p>Loading code tab...</p>';
        }
    },

    // ===== Render Concept Page =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📋 Topological Sort</h2>
                <p class="hero-sub">Learn the algorithm for ordering nodes in a directed graph!</p>
            </div>

            <!-- Section 1: What is a DAG? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> What is a DAG?
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think about "the order you get dressed"!
                    You must put on pants before socks, and underwear before pants.
                    When there is a relationship like <em>"you must do A before you can do B"</em>,
                    we call this a <strong>Directed Acyclic Graph (DAG)</strong>.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="19" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="16" y1="19" x2="22" y2="19" stroke="var(--accent)" stroke-width="2" marker-end="url(#arrow)"/><defs><marker id="arrow" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--accent)"/></marker></defs></svg>
                        </div>
                        <h3>Directed Graph</h3>
                        <p>Edges have direction. A→B means "A comes before B".</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="8" cy="30" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="30" cy="30" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="17" y1="12" x2="10" y2="26" stroke="var(--green)" stroke-width="2"/><line x1="21" y1="12" x2="28" y2="26" stroke="var(--green)" stroke-width="2"/></svg>
                        </div>
                        <h3>Acyclic</h3>
                        <p>There must be no cycles. If there is a circular path, we cannot determine an ordering!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="10" fill="none" stroke="var(--yellow)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--yellow)">0</text><line x1="5" y1="10" x2="12" y2="15" stroke="var(--yellow)" stroke-width="2" marker-end="url(#arrow)"/><line x1="5" y1="28" x2="12" y2="23" stroke="var(--yellow)" stroke-width="2" marker-end="url(#arrow)"/></svg>
                        </div>
                        <h3>in-degree (In-degree)</h3>
                        <p>The number of arrows pointing into a node. If in-degree is 0, it means "a task that can be started right away".<br>
                        <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: queue ↗</a></span></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.5"/><rect x="26" y="12" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.8"/><line x1="12" y1="17" x2="14" y2="17" stroke="var(--accent)" stroke-width="2"/><line x1="24" y1="17" x2="26" y2="17" stroke="var(--accent)" stroke-width="2"/></svg>
                        </div>
                        <h3>Topological Order</h3>
                        <p>A linear ordering of all nodes in a DAG such that for every edge u→v, u appears before v.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Build a directed graph (adjacency list) + in-degree array
import sys
from collections import deque
input = sys.stdin.readline

N, M = map(int, input().split())
graph = [[] for _ in range(N + 1)]
in_degree = [0] * (N + 1)

for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)  # a → b (a comes first!)
    in_degree[b] += 1   # increment in-degree of b</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Build a directed graph (adjacency list) + in-degree array
#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;queue&gt;
using namespace std;

int main() {
    int N, M;
    cin &gt;&gt; N &gt;&gt; M;

    vector&lt;vector&lt;int&gt;&gt; graph(N + 1);  // adjacency list
    vector&lt;int&gt; in_degree(N + 1, 0);   // in-degree

    for (int i = 0; i &lt; M; i++) {
        int a, b;
        cin &gt;&gt; a &gt;&gt; b;
        graph[a].push_back(b);  // a → b (a comes first!)
        in_degree[b]++;         // increment in-degree of b
    }
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">In a course prerequisite chain where Calculus→Probability and Linear Algebra→Probability, what is the in-degree of Probability?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        The answer is <strong>2</strong>! Because two arrows (from Calculus and Linear Algebra) point into Probability.
                    </div>
                </div>

                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Click a Node to See Its In-degree</div>
                    <p style="font-size:0.88rem;color:var(--text2);margin-bottom:0.8rem;">Click any node to highlight its incoming edges and see its in-degree value.</p>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;">
                        <svg id="ts-demo-dag-svg" viewBox="0 0 420 200" width="100%" style="max-width:420px;max-height:200px;">
                            <defs>
                                <marker id="ts-demo-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)"/></marker>
                                <marker id="ts-demo-arrow-hl" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
                            </defs>
                        </svg>
                    </div>
                    <div class="concept-demo-msg" id="ts-demo-dag-msg">👆 Click any node!</div>
                </div>
            </div>

            <!-- Section 2: What is Topological Sort? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> What is Topological Sort?
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think about "making a school schedule"!
                    You cannot take advanced math without first completing basic math.
                    Arranging all courses in a line while respecting all prerequisite relationships is <strong>topological sorting</strong>.
                    There can be multiple valid results!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="14" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="12" y1="12" x2="26" y2="26" stroke="var(--red, #e17055)" stroke-width="2"/><line x1="26" y1="12" x2="12" y2="26" stroke="var(--red, #e17055)" stroke-width="2"/></svg>
                        </div>
                        <h3>Only Works on DAGs</h3>
                        <p>If there is a cycle, topological sort is impossible! Because we cannot determine an ordering.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><path d="M8,19 L14,10 L20,19 L26,10 L32,19" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="32" text-anchor="middle" font-size="10" fill="var(--text2)">Multiple</text></svg>
                        </div>
                        <h3>Multiple Valid Answers</h3>
                        <p>Nodes without precedence constraints can appear in any order. There can be multiple correct answers.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="8" width="30" height="22" rx="3" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="10" y1="15" x2="28" y2="15" stroke="var(--green)" stroke-width="1.5"/><line x1="10" y1="21" x2="24" y2="21" stroke="var(--green)" stroke-width="1.5"/><line x1="10" y1="27" x2="20" y2="27" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>Usage Examples</h3>
                        <p>Used in build systems, task scheduling, course prerequisite ordering, and more.</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">If 4 people line up and the only constraints are 1→3 and 2→3, is [2,1,3,4] a valid topological sort?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Yes, it is valid!</strong> Both 1 and 2 appear before 3, and 4 can be placed anywhere.
                        [1,2,3,4], [2,1,3,4], [1,2,4,3] and more are all valid answers.
                    </div>
                </div>

                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Find a Valid Topological Order!</div>
                    <p style="font-size:0.88rem;color:var(--text2);margin-bottom:0.8rem;">Click nodes in a valid order. You can only click nodes with in-degree 0 (no unresolved prerequisites).</p>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;">
                        <svg id="ts-demo-puzzle-svg" viewBox="0 0 420 180" width="100%" style="max-width:420px;max-height:180px;">
                            <defs>
                                <marker id="ts-puzzle-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)"/></marker>
                            </defs>
                        </svg>
                        <div style="margin-top:0.6rem;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <span style="font-size:0.85rem;color:var(--text2);font-weight:600;">Your order:</span>
                            <span id="ts-demo-puzzle-result" style="font-size:0.95rem;font-weight:700;color:var(--accent);min-width:100px;">[ ]</span>
                        </div>
                        <button class="concept-demo-btn" id="ts-demo-puzzle-reset" style="margin-top:0.6rem;">🔄 Reset</button>
                    </div>
                    <div class="concept-demo-msg" id="ts-demo-puzzle-msg">👆 Click a node with in-degree 0 to start!</div>
                </div>
            </div>

            <!-- Section 3: Kahn's Algorithm -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> BFS Approach (Kahn's Algorithm)
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think about a "To-Do List"!
                    First, pick a task that has <em>no prerequisites at all</em> and complete it.
                    Once that task is done, other tasks lose one prerequisite each.
                    Pick the next task whose prerequisites are all resolved. Repeat this process!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">1</text></svg>
                        </div>
                        <h3>Step 1: Initialize</h3>
                        <p>Add all nodes with in-degree 0 to the queue.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">2</text></svg>
                        </div>
                        <h3>Step 2: Process</h3>
                        <p>Dequeue a node, add it to the result, and decrease the in-degree of its neighbors by 1.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="26" text-anchor="middle" font-size="22" font-weight="bold" fill="var(--accent)">3</text></svg>
                        </div>
                        <h3>Step 3: Repeat</h3>
                        <p>Add nodes whose in-degree becomes 0 to the queue. Repeat until the queue is empty.<br>
                        <a href="https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Kahn's Algorithm ↗</a></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Kahn's Algorithm (BFS Topological Sort)
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

# If result length is not N, a cycle exists!
if len(result) != N:
    print("Cycle detected — topological sort impossible!")
else:
    print(*result)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Kahn's Algorithm (BFS Topological Sort)
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

// If result size is not N, a cycle exists!
if (result.size() != N)
    cout &lt;&lt; "Cycle detected - topological sort impossible!" &lt;&lt; endl;
else {
    for (int i = 0; i &lt; result.size(); i++)
        cout &lt;&lt; result[i] &lt;&lt; (i + 1 &lt; result.size() ? " " : "\n");
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Given edges 1→3, 1→4, 2→3, 3→4 with N=4, what is the result of Kahn's Algorithm?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Initial in-degrees: [1:0, 2:0, 3:2, 4:2]. Queue: {1,2}.<br>
                        Process 1 → decrease in-degree of 3,4 → [3:1, 4:1].<br>
                        Process 2 → decrease in-degree of 3 → [3:0, 4:1]. Add 3 to queue.<br>
                        Process 3 → decrease in-degree of 4 → [4:0]. Add 4 to queue.<br>
                        Process 4. Result: <strong>1 2 3 4</strong>
                    </div>
                </div>

                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Kahn's Algorithm Step-by-Step</div>
                    <p style="font-size:0.88rem;color:var(--text2);margin-bottom:0.8rem;">Watch Kahn's algorithm process a DAG one step at a time. Graph: 1→3, 1→4, 2→3, 3→4, 2→5, 5→4</p>
                    <div class="concept-demo-body" id="ts-demo-kahn-body" style="display:flex;flex-direction:column;align-items:center;gap:10px;">
                        <svg id="ts-demo-kahn-svg" viewBox="0 0 400 160" width="100%" style="max-width:400px;max-height:160px;">
                            <defs>
                                <marker id="ts-kahn-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)"/></marker>
                                <marker id="ts-kahn-arrow-dim" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)" opacity="0.2"/></marker>
                            </defs>
                        </svg>
                        <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center;width:100%;">
                            <div style="text-align:center;">
                                <div style="font-size:0.78rem;color:var(--text2);font-weight:600;margin-bottom:4px;">In-degree</div>
                                <div id="ts-demo-kahn-indeg" style="display:flex;gap:4px;justify-content:center;"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:0.78rem;color:var(--text2);font-weight:600;margin-bottom:4px;">Queue</div>
                                <div id="ts-demo-kahn-queue" style="display:flex;gap:4px;justify-content:center;min-width:60px;min-height:28px;background:var(--bg2);border-radius:6px;padding:2px 6px;align-items:center;font-size:0.85rem;font-weight:600;color:var(--accent);"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:0.78rem;color:var(--text2);font-weight:600;margin-bottom:4px;">Result</div>
                                <div id="ts-demo-kahn-result" style="display:flex;gap:4px;justify-content:center;min-width:60px;min-height:28px;background:var(--bg2);border-radius:6px;padding:2px 6px;align-items:center;font-size:0.85rem;font-weight:700;color:var(--green);"></div>
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="concept-demo-btn" id="ts-demo-kahn-next">Next Step ▶</button>
                            <button class="concept-demo-btn" id="ts-demo-kahn-reset">🔄 Reset</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="ts-demo-kahn-msg">Press "Next Step" to begin Kahn's algorithm!</div>
                </div>
            </div>

            <!-- Section 4: Priority Queue + Topological Sort -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> Application: Priority Queue + Topological Sort
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> "When multiple tasks are available, what if you want to do the smallest-numbered (easiest) one first?"
                    Use a <strong>min-heap</strong> instead of a regular queue!
                    The rest of the logic is exactly the same as Kahn's Algorithm.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--border)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="11" fill="var(--text2)">Any</text></svg>
                        </div>
                        <h3>Regular Queue</h3>
                        <p>Processes any available node whose prerequisites are resolved. Multiple valid answers are possible.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--green)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--green)">Min</text></svg>
                        </div>
                        <h3>Min-Heap</h3>
                        <p>Always processes the <strong>smallest-numbered node</strong> among those with resolved prerequisites. This produces a unique answer.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Topological sort using a priority queue
import heapq

heap = []
for i in range(1, N + 1):
    if in_degree[i] == 0:
        heapq.heappush(heap, i)

result = []
while heap:
    v = heapq.heappop(heap)  # smallest number first!
    result.append(v)
    for u in graph[v]:
        in_degree[u] -= 1
        if in_degree[u] == 0:
            heapq.heappush(heap, u)

print(*result)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Topological sort using a priority queue
// greater&lt;int&gt; creates a min-heap (smallest number first!)
priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;
for (int i = 1; i &lt;= N; i++) {
    if (in_degree[i] == 0)
        pq.push(i);
}

vector&lt;int&gt; result;
while (!pq.empty()) {
    int v = pq.top();  // smallest number first!
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
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">With edges 1→4, 2→4, 3→4, what happens with a regular queue? What about a min-heap?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Regular queue: [1,2,3,4] or [3,2,1,4] etc. — multiple orderings are possible.<br>
                        Min-heap: Always <strong>[1,2,3,4]</strong>. Because it always dequeues the smallest number first.
                    </div>
                </div>

                <div class="concept-demo" style="margin-top:1.5rem;">
                    <div class="concept-demo-title">🎮 Try It — Queue vs Min-Heap Side by Side</div>
                    <p style="font-size:0.88rem;color:var(--text2);margin-bottom:0.8rem;">Same graph (edges: 3→5, 1→5, 2→4, 4→5), different data structures. Watch how the processing order differs!</p>
                    <div class="concept-demo-body" id="ts-demo-cmp-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;width:100%;">
                            <div style="flex:1;min-width:180px;max-width:260px;text-align:center;">
                                <div style="font-weight:700;font-size:0.9rem;color:var(--accent);margin-bottom:6px;">Regular Queue (FIFO)</div>
                                <div style="font-size:0.78rem;color:var(--text2);margin-bottom:4px;">Processing order:</div>
                                <div id="ts-demo-cmp-queue-order" style="min-height:28px;background:var(--bg2);border-radius:6px;padding:4px 8px;font-size:0.9rem;font-weight:700;color:var(--accent);display:flex;gap:4px;justify-content:center;align-items:center;flex-wrap:wrap;"></div>
                                <div style="font-size:0.78rem;color:var(--text2);margin-top:4px;">Queue contents:</div>
                                <div id="ts-demo-cmp-queue-q" style="min-height:28px;background:var(--bg2);border-radius:6px;padding:4px 8px;font-size:0.85rem;font-weight:600;color:var(--text);display:flex;gap:4px;justify-content:center;align-items:center;"></div>
                            </div>
                            <div style="flex:1;min-width:180px;max-width:260px;text-align:center;">
                                <div style="font-weight:700;font-size:0.9rem;color:var(--green);margin-bottom:6px;">Min-Heap (smallest first)</div>
                                <div style="font-size:0.78rem;color:var(--text2);margin-bottom:4px;">Processing order:</div>
                                <div id="ts-demo-cmp-heap-order" style="min-height:28px;background:var(--bg2);border-radius:6px;padding:4px 8px;font-size:0.9rem;font-weight:700;color:var(--green);display:flex;gap:4px;justify-content:center;align-items:center;flex-wrap:wrap;"></div>
                                <div style="font-size:0.78rem;color:var(--text2);margin-top:4px;">Heap contents:</div>
                                <div id="ts-demo-cmp-heap-q" style="min-height:28px;background:var(--bg2);border-radius:6px;padding:4px 8px;font-size:0.85rem;font-weight:600;color:var(--text);display:flex;gap:4px;justify-content:center;align-items:center;"></div>
                            </div>
                        </div>
                        <div style="display:flex;gap:8px;">
                            <button class="concept-demo-btn" id="ts-demo-cmp-run">▶ Run Both</button>
                            <button class="concept-demo-btn" id="ts-demo-cmp-reset">🔄 Reset</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="ts-demo-cmp-msg">Press "Run Both" to see the difference!</div>
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ========== Demo 1: DAG & In-degree Interactive ==========
        (function() {
            var svg = container.querySelector('#ts-demo-dag-svg');
            var msgEl = container.querySelector('#ts-demo-dag-msg');
            if (!svg || !msgEl) return;

            var nodes = [
                { id: 1, x: 60,  y: 40  },
                { id: 2, x: 180, y: 40  },
                { id: 3, x: 300, y: 40  },
                { id: 4, x: 120, y: 130 },
                { id: 5, x: 240, y: 130 },
                { id: 6, x: 360, y: 130 }
            ];
            var edges = [
                [1, 4], [2, 4], [2, 5], [3, 5], [3, 6], [4, 5]
            ];
            var R = 20;

            function shortenLine(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1;
                var len = Math.sqrt(dx * dx + dy * dy);
                var ratio = r / len;
                return { x1: x1 + dx * ratio, y1: y1 + dy * ratio, x2: x2 - dx * ratio, y2: y2 - dy * ratio };
            }

            // Draw edges
            edges.forEach(function(e) {
                var a = nodes[e[0] - 1], b = nodes[e[1] - 1];
                var p = shortenLine(a.x, a.y, b.x, b.y, R);
                var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', p.x1); line.setAttribute('y1', p.y1);
                line.setAttribute('x2', p.x2); line.setAttribute('y2', p.y2);
                line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#ts-demo-arrow)');
                line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                line.setAttribute('class', 'ts-demo-edge');
                line.style.transition = 'stroke 0.3s, stroke-width 0.3s';
                svg.appendChild(line);
            });

            // Draw nodes
            nodes.forEach(function(n) {
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', R);
                circle.setAttribute('fill', 'var(--bg2)'); circle.setAttribute('stroke', 'var(--accent)');
                circle.setAttribute('stroke-width', '2.5'); circle.setAttribute('data-id', n.id);
                circle.setAttribute('class', 'ts-demo-node');
                circle.style.cursor = 'pointer'; circle.style.transition = 'fill 0.3s, stroke 0.3s';
                svg.appendChild(circle);

                var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', n.x); label.setAttribute('y', n.y + 5);
                label.setAttribute('text-anchor', 'middle'); label.setAttribute('font-size', '14');
                label.setAttribute('font-weight', 'bold'); label.setAttribute('fill', 'var(--text)');
                label.style.pointerEvents = 'none';
                label.textContent = n.id;
                svg.appendChild(label);
            });

            // Calculate in-degrees
            var inDeg = {};
            nodes.forEach(function(n) { inDeg[n.id] = 0; });
            edges.forEach(function(e) { inDeg[e[1]]++; });

            // Click handler
            svg.addEventListener('click', function(ev) {
                var target = ev.target;
                if (!target.classList.contains('ts-demo-node')) return;
                var nodeId = parseInt(target.getAttribute('data-id'));

                // Reset all
                svg.querySelectorAll('.ts-demo-node').forEach(function(c) {
                    c.setAttribute('fill', 'var(--bg2)'); c.setAttribute('stroke', 'var(--accent)');
                });
                svg.querySelectorAll('.ts-demo-edge').forEach(function(l) {
                    l.setAttribute('stroke', 'var(--text2)'); l.setAttribute('stroke-width', '2');
                    l.setAttribute('marker-end', 'url(#ts-demo-arrow)');
                });

                // Highlight selected node
                target.setAttribute('fill', 'var(--yellow)'); target.setAttribute('stroke', 'var(--yellow)');

                // Highlight incoming edges
                var count = 0;
                svg.querySelectorAll('.ts-demo-edge').forEach(function(l) {
                    if (parseInt(l.getAttribute('data-to')) === nodeId) {
                        l.setAttribute('stroke', 'var(--yellow)'); l.setAttribute('stroke-width', '3');
                        l.setAttribute('marker-end', 'url(#ts-demo-arrow-hl)');
                        count++;
                    }
                });

                msgEl.textContent = 'Node ' + nodeId + ' has in-degree = ' + inDeg[nodeId] +
                    (inDeg[nodeId] === 0 ? ' (can start immediately!)' : ' (' + count + ' incoming edge' + (count > 1 ? 's' : '') + ')');
            });
        })();

        // ========== Demo 2: Ordering Puzzle ==========
        (function() {
            var svg = container.querySelector('#ts-demo-puzzle-svg');
            var msgEl = container.querySelector('#ts-demo-puzzle-msg');
            var resultEl = container.querySelector('#ts-demo-puzzle-result');
            var resetBtn = container.querySelector('#ts-demo-puzzle-reset');
            if (!svg || !msgEl || !resultEl || !resetBtn) return;

            var nodes = [
                { id: 1, x: 60,  y: 40  },
                { id: 2, x: 200, y: 40  },
                { id: 3, x: 340, y: 40  },
                { id: 4, x: 130, y: 130 },
                { id: 5, x: 270, y: 130 }
            ];
            var edges = [
                [1, 4], [2, 4], [2, 5], [3, 5]
            ];
            var R = 20;

            function shortenLine(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1;
                var len = Math.sqrt(dx * dx + dy * dy);
                var ratio = r / len;
                return { x1: x1 + dx * ratio, y1: y1 + dy * ratio, x2: x2 - dx * ratio, y2: y2 - dy * ratio };
            }

            var state = { picked: [], currentInDeg: {}, done: false };

            function resetPuzzle() {
                svg.innerHTML = '<defs><marker id="ts-puzzle-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)"/></marker></defs>';
                state.picked = []; state.done = false;
                state.currentInDeg = {};
                nodes.forEach(function(n) { state.currentInDeg[n.id] = 0; });
                edges.forEach(function(e) { state.currentInDeg[e[1]]++; });

                // Draw edges
                edges.forEach(function(e) {
                    var a = nodes[e[0] - 1], b = nodes[e[1] - 1];
                    var p = shortenLine(a.x, a.y, b.x, b.y, R);
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', p.x1); line.setAttribute('y1', p.y1);
                    line.setAttribute('x2', p.x2); line.setAttribute('y2', p.y2);
                    line.setAttribute('stroke', 'var(--text2)'); line.setAttribute('stroke-width', '2');
                    line.setAttribute('marker-end', 'url(#ts-puzzle-arrow)');
                    line.setAttribute('data-from', e[0]); line.setAttribute('data-to', e[1]);
                    line.setAttribute('class', 'ts-puzzle-edge');
                    line.style.transition = 'opacity 0.3s';
                    svg.appendChild(line);
                });

                // Draw nodes
                nodes.forEach(function(n) {
                    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', R);
                    circle.setAttribute('stroke-width', '2.5'); circle.setAttribute('data-id', n.id);
                    circle.setAttribute('class', 'ts-puzzle-node');
                    circle.style.cursor = 'pointer'; circle.style.transition = 'fill 0.3s, stroke 0.3s';
                    if (state.currentInDeg[n.id] === 0) {
                        circle.setAttribute('fill', 'var(--bg2)'); circle.setAttribute('stroke', 'var(--green)');
                    } else {
                        circle.setAttribute('fill', 'var(--bg2)'); circle.setAttribute('stroke', 'var(--text2)');
                    }
                    svg.appendChild(circle);

                    var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', n.x); label.setAttribute('y', n.y + 5);
                    label.setAttribute('text-anchor', 'middle'); label.setAttribute('font-size', '14');
                    label.setAttribute('font-weight', 'bold'); label.setAttribute('fill', 'var(--text)');
                    label.style.pointerEvents = 'none'; label.setAttribute('class', 'ts-puzzle-label');
                    label.setAttribute('data-id', n.id);
                    label.textContent = n.id;
                    svg.appendChild(label);
                });

                resultEl.textContent = '[ ]';
                msgEl.textContent = '👆 Click a node with in-degree 0 (green border) to start!';
                msgEl.style.color = '';
            }

            function updateNodeColors() {
                svg.querySelectorAll('.ts-puzzle-node').forEach(function(c) {
                    var nid = parseInt(c.getAttribute('data-id'));
                    if (state.picked.indexOf(nid) >= 0) return; // already picked
                    if (state.currentInDeg[nid] === 0) {
                        c.setAttribute('stroke', 'var(--green)');
                    } else {
                        c.setAttribute('stroke', 'var(--text2)');
                    }
                });
            }

            svg.addEventListener('click', function(ev) {
                var target = ev.target;
                if (!target.classList.contains('ts-puzzle-node') || state.done) return;
                var nodeId = parseInt(target.getAttribute('data-id'));
                if (state.picked.indexOf(nodeId) >= 0) return;

                if (state.currentInDeg[nodeId] !== 0) {
                    // Invalid choice - flash red
                    target.setAttribute('fill', 'var(--red)');
                    setTimeout(function() { target.setAttribute('fill', 'var(--bg2)'); }, 400);
                    msgEl.textContent = 'Node ' + nodeId + ' still has prerequisites! (in-degree = ' + state.currentInDeg[nodeId] + ')';
                    msgEl.style.color = 'var(--red)';
                    return;
                }

                // Valid choice
                state.picked.push(nodeId);
                target.setAttribute('fill', 'var(--green)'); target.setAttribute('stroke', 'var(--green)');
                target.style.cursor = 'default';

                // Reduce in-degrees of neighbors and dim edges
                edges.forEach(function(e) {
                    if (e[0] === nodeId) {
                        state.currentInDeg[e[1]]--;
                        svg.querySelectorAll('.ts-puzzle-edge').forEach(function(l) {
                            if (parseInt(l.getAttribute('data-from')) === nodeId) {
                                l.style.opacity = '0.2';
                            }
                        });
                    }
                });

                updateNodeColors();
                resultEl.textContent = '[ ' + state.picked.join(', ') + ' ]';

                if (state.picked.length === nodes.length) {
                    state.done = true;
                    msgEl.textContent = 'Correct! ' + resultEl.textContent + ' is a valid topological order!';
                    msgEl.style.color = 'var(--green)';
                } else {
                    msgEl.textContent = 'Node ' + nodeId + ' picked! Choose the next node with in-degree 0.';
                    msgEl.style.color = '';
                }
            });

            resetBtn.addEventListener('click', resetPuzzle);
            resetPuzzle();
        })();

        // ========== Demo 3: Kahn's Algorithm Step-by-Step ==========
        (function() {
            var svgEl = container.querySelector('#ts-demo-kahn-svg');
            var indegEl = container.querySelector('#ts-demo-kahn-indeg');
            var queueEl = container.querySelector('#ts-demo-kahn-queue');
            var resultEl = container.querySelector('#ts-demo-kahn-result');
            var msgEl = container.querySelector('#ts-demo-kahn-msg');
            var nextBtn = container.querySelector('#ts-demo-kahn-next');
            var resetBtn = container.querySelector('#ts-demo-kahn-reset');
            if (!svgEl || !nextBtn || !resetBtn) return;

            var nodes = [
                { id: 1, x: 60,  y: 40  },
                { id: 2, x: 200, y: 40  },
                { id: 3, x: 120, y: 120 },
                { id: 4, x: 280, y: 80  },
                { id: 5, x: 340, y: 40  }
            ];
            var edges = [
                [1, 3], [1, 4], [2, 3], [3, 4], [2, 5], [5, 4]
            ];
            var R = 18;

            function shortenLine(x1, y1, x2, y2, r) {
                var dx = x2 - x1, dy = y2 - y1;
                var len = Math.sqrt(dx * dx + dy * dy);
                var ratio = r / len;
                return { x1: x1 + dx * ratio, y1: y1 + dy * ratio, x2: x2 - dx * ratio, y2: y2 - dy * ratio };
            }

            // Build adjacency list
            var adj = {}; nodes.forEach(function(n) { adj[n.id] = []; });
            edges.forEach(function(e) { adj[e[0]].push(e[1]); });

            // Pre-compute all steps for Kahn's
            function buildKahnSteps() {
                var inDeg = {}; nodes.forEach(function(n) { inDeg[n.id] = 0; });
                edges.forEach(function(e) { inDeg[e[1]]++; });
                var queue = [];
                nodes.forEach(function(n) { if (inDeg[n.id] === 0) queue.push(n.id); });
                queue.sort(function(a, b) { return a - b; });

                var steps = [];
                // Step 0: initialization
                steps.push({
                    desc: 'Initialize: find all nodes with in-degree 0 and add them to the queue.',
                    inDeg: JSON.parse(JSON.stringify(inDeg)),
                    queue: queue.slice(),
                    result: [],
                    highlightNode: null,
                    dimmedNodes: [],
                    dimmedEdges: [],
                    highlightEdges: []
                });

                var result = [];
                var dimmedNodes = [];
                var dimmedEdges = [];

                while (queue.length > 0) {
                    var v = queue.shift();
                    // Step: dequeue node
                    steps.push({
                        desc: 'Dequeue node ' + v + ' from the queue and add it to the result.',
                        inDeg: JSON.parse(JSON.stringify(inDeg)),
                        queue: queue.slice(),
                        result: result.concat([v]),
                        highlightNode: v,
                        dimmedNodes: dimmedNodes.slice(),
                        dimmedEdges: dimmedEdges.slice(),
                        highlightEdges: []
                    });
                    result.push(v);
                    dimmedNodes.push(v);

                    // Process neighbors one by one
                    var neighbors = adj[v].slice().sort(function(a, b) { return a - b; });
                    neighbors.forEach(function(u) {
                        inDeg[u]--;
                        dimmedEdges.push([v, u]);
                        var newInQueue = inDeg[u] === 0;
                        if (newInQueue) queue.push(u);
                        queue.sort(function(a, b) { return a - b; });
                        steps.push({
                            desc: 'Edge ' + v + '→' + u + ' removed. in-degree[' + u + '] decreases to ' + inDeg[u] + '.' +
                                  (newInQueue ? ' Now 0 — add node ' + u + ' to queue!' : ''),
                            inDeg: JSON.parse(JSON.stringify(inDeg)),
                            queue: queue.slice(),
                            result: result.slice(),
                            highlightNode: v,
                            dimmedNodes: dimmedNodes.slice(),
                            dimmedEdges: dimmedEdges.slice(),
                            highlightEdges: [[v, u]]
                        });
                    });
                }

                steps.push({
                    desc: 'Done! Queue is empty. Result: [' + result.join(', ') + ']',
                    inDeg: JSON.parse(JSON.stringify(inDeg)),
                    queue: [],
                    result: result.slice(),
                    highlightNode: null,
                    dimmedNodes: dimmedNodes.slice(),
                    dimmedEdges: dimmedEdges.slice(),
                    highlightEdges: []
                });

                return steps;
            }

            var kahnSteps = [];
            var stepIdx = -1;

            function drawGraph(step) {
                svgEl.innerHTML = '<defs>' +
                    '<marker id="ts-kahn-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)"/></marker>' +
                    '<marker id="ts-kahn-arrow-dim" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--text2)" opacity="0.2"/></marker>' +
                    '<marker id="ts-kahn-arrow-hl" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>' +
                    '</defs>';

                // Draw edges
                edges.forEach(function(e) {
                    var a = nodes[e[0] - 1], b = nodes[e[1] - 1];
                    var p = shortenLine(a.x, a.y, b.x, b.y, R);
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', p.x1); line.setAttribute('y1', p.y1);
                    line.setAttribute('x2', p.x2); line.setAttribute('y2', p.y2);
                    line.setAttribute('stroke-width', '2');

                    var isDimmed = step && step.dimmedEdges.some(function(de) { return de[0] === e[0] && de[1] === e[1]; });
                    var isHL = step && step.highlightEdges.some(function(he) { return he[0] === e[0] && he[1] === e[1]; });

                    if (isHL) {
                        line.setAttribute('stroke', 'var(--yellow)'); line.setAttribute('stroke-width', '3');
                        line.setAttribute('marker-end', 'url(#ts-kahn-arrow-hl)');
                    } else if (isDimmed) {
                        line.setAttribute('stroke', 'var(--text2)'); line.style.opacity = '0.2';
                        line.setAttribute('marker-end', 'url(#ts-kahn-arrow-dim)');
                    } else {
                        line.setAttribute('stroke', 'var(--text2)');
                        line.setAttribute('marker-end', 'url(#ts-kahn-arrow)');
                    }
                    svgEl.appendChild(line);
                });

                // Draw nodes
                nodes.forEach(function(n) {
                    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y); circle.setAttribute('r', R);
                    circle.setAttribute('stroke-width', '2.5');

                    var isDimmed = step && step.dimmedNodes.indexOf(n.id) >= 0;
                    var isHL = step && step.highlightNode === n.id;
                    var isInResult = step && step.result.indexOf(n.id) >= 0;

                    if (isHL) {
                        circle.setAttribute('fill', 'var(--yellow)'); circle.setAttribute('stroke', 'var(--yellow)');
                    } else if (isInResult || isDimmed) {
                        circle.setAttribute('fill', 'var(--green)'); circle.setAttribute('stroke', 'var(--green)');
                        circle.style.opacity = '0.5';
                    } else {
                        circle.setAttribute('fill', 'var(--bg2)'); circle.setAttribute('stroke', 'var(--accent)');
                    }
                    svgEl.appendChild(circle);

                    var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', n.x); label.setAttribute('y', n.y + 5);
                    label.setAttribute('text-anchor', 'middle'); label.setAttribute('font-size', '13');
                    label.setAttribute('font-weight', 'bold'); label.setAttribute('fill', 'var(--text)');
                    if (isDimmed || isInResult) label.style.opacity = '0.5';
                    label.textContent = n.id;
                    svgEl.appendChild(label);
                });
            }

            function renderState(step) {
                // In-degree display
                indegEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var cell = document.createElement('span');
                    cell.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;padding:2px 6px;border-radius:4px;font-size:0.78rem;';
                    var val = step ? step.inDeg[n.id] : 0;
                    if (val === 0) cell.style.background = 'var(--green)15';
                    cell.innerHTML = '<span style="color:var(--text2);font-size:0.7rem;">' + n.id + '</span><span style="font-weight:700;color:' + (val === 0 ? 'var(--green)' : 'var(--text)') + ';">' + val + '</span>';
                    indegEl.appendChild(cell);
                });

                // Queue display
                queueEl.textContent = step && step.queue.length > 0 ? step.queue.join(', ') : '(empty)';

                // Result display
                resultEl.textContent = step && step.result.length > 0 ? step.result.join(', ') : '(empty)';

                // Message
                if (step) msgEl.textContent = step.desc;

                // Graph
                drawGraph(step);
            }

            function resetKahn() {
                kahnSteps = buildKahnSteps();
                stepIdx = -1;
                nextBtn.disabled = false;
                renderState(null);
                // Render initial in-degrees
                var initInDeg = {}; nodes.forEach(function(n) { initInDeg[n.id] = 0; });
                edges.forEach(function(e) { initInDeg[e[1]]++; });
                indegEl.innerHTML = '';
                nodes.forEach(function(n) {
                    var cell = document.createElement('span');
                    cell.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;padding:2px 6px;border-radius:4px;font-size:0.78rem;';
                    var val = initInDeg[n.id];
                    if (val === 0) cell.style.background = 'var(--green)15';
                    cell.innerHTML = '<span style="color:var(--text2);font-size:0.7rem;">' + n.id + '</span><span style="font-weight:700;color:' + (val === 0 ? 'var(--green)' : 'var(--text)') + ';">' + val + '</span>';
                    indegEl.appendChild(cell);
                });
                queueEl.textContent = '(empty)';
                resultEl.textContent = '(empty)';
                msgEl.textContent = 'Press "Next Step" to begin Kahn\'s algorithm!';
            }

            nextBtn.addEventListener('click', function() {
                stepIdx++;
                if (stepIdx >= kahnSteps.length) {
                    nextBtn.disabled = true;
                    return;
                }
                renderState(kahnSteps[stepIdx]);
                if (stepIdx >= kahnSteps.length - 1) nextBtn.disabled = true;
            });

            resetBtn.addEventListener('click', resetKahn);
            resetKahn();
        })();

        // ========== Demo 4: Queue vs Min-Heap Comparison ==========
        (function() {
            var queueOrderEl = container.querySelector('#ts-demo-cmp-queue-order');
            var heapOrderEl = container.querySelector('#ts-demo-cmp-heap-order');
            var queueQEl = container.querySelector('#ts-demo-cmp-queue-q');
            var heapQEl = container.querySelector('#ts-demo-cmp-heap-q');
            var msgEl = container.querySelector('#ts-demo-cmp-msg');
            var runBtn = container.querySelector('#ts-demo-cmp-run');
            var resetBtn = container.querySelector('#ts-demo-cmp-reset');
            if (!runBtn || !resetBtn) return;

            // Graph: 3→5, 1→5, 2→4, 4→5
            // Nodes: 1,2,3,4,5
            var nodeIds = [1, 2, 3, 4, 5];
            var edges = [[3, 5], [1, 5], [2, 4], [4, 5]];
            var adj = {}; nodeIds.forEach(function(n) { adj[n] = []; });
            edges.forEach(function(e) { adj[e[0]].push(e[1]); });

            function runTopo(useMinHeap) {
                var inDeg = {}; nodeIds.forEach(function(n) { inDeg[n] = 0; });
                edges.forEach(function(e) { inDeg[e[1]]++; });

                var q = [];
                nodeIds.forEach(function(n) { if (inDeg[n] === 0) q.push(n); });
                // Regular queue: insertion order (which is 1,2,3 since we iterate in order)
                // Min-heap: sorted
                if (useMinHeap) q.sort(function(a, b) { return a - b; });

                var steps = []; // each step: { dequeued, queue, result }
                var result = [];
                steps.push({ dequeued: null, queue: q.slice(), result: [] });

                while (q.length > 0) {
                    var v;
                    if (useMinHeap) {
                        q.sort(function(a, b) { return a - b; });
                        v = q.shift();
                    } else {
                        v = q.shift();
                    }
                    result.push(v);
                    adj[v].forEach(function(u) {
                        inDeg[u]--;
                        if (inDeg[u] === 0) q.push(u);
                    });
                    if (useMinHeap) q.sort(function(a, b) { return a - b; });
                    steps.push({ dequeued: v, queue: q.slice(), result: result.slice() });
                }
                return steps;
            }

            var animTimer = null;
            var running = false;

            function resetCmp() {
                if (animTimer) { clearTimeout(animTimer); animTimer = null; }
                running = false;
                runBtn.disabled = false;
                queueOrderEl.innerHTML = ''; heapOrderEl.innerHTML = '';
                queueQEl.textContent = '(empty)'; heapQEl.textContent = '(empty)';
                msgEl.textContent = 'Press "Run Both" to see the difference!';
                msgEl.style.color = '';
            }

            function animateSteps(qSteps, hSteps) {
                var maxLen = Math.max(qSteps.length, hSteps.length);
                var i = 0;
                running = true;
                runBtn.disabled = true;

                function tick() {
                    if (i >= maxLen) {
                        var qResult = qSteps[qSteps.length - 1].result;
                        var hResult = hSteps[hSteps.length - 1].result;
                        var same = qResult.join(',') === hResult.join(',');
                        msgEl.textContent = same
                            ? 'Both produced the same order this time! But the queue result can vary.'
                            : 'Different orders! Queue: [' + qResult.join(',') + '] vs Heap: [' + hResult.join(',') + ']. The min-heap always picks the smallest available node.';
                        msgEl.style.color = same ? 'var(--accent)' : 'var(--green)';
                        running = false;
                        return;
                    }

                    // Update queue side
                    if (i < qSteps.length) {
                        var qs = qSteps[i];
                        queueQEl.textContent = qs.queue.length > 0 ? qs.queue.join(', ') : '(empty)';
                        if (qs.dequeued !== null) {
                            var span = document.createElement('span');
                            span.textContent = qs.dequeued;
                            span.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--accent);color:white;font-weight:700;font-size:0.85rem;';
                            queueOrderEl.appendChild(span);
                        }
                    }

                    // Update heap side
                    if (i < hSteps.length) {
                        var hs = hSteps[i];
                        heapQEl.textContent = hs.queue.length > 0 ? hs.queue.join(', ') : '(empty)';
                        if (hs.dequeued !== null) {
                            var span2 = document.createElement('span');
                            span2.textContent = hs.dequeued;
                            span2.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:var(--green);color:white;font-weight:700;font-size:0.85rem;';
                            heapOrderEl.appendChild(span2);
                        }
                    }

                    if (i === 0) {
                        msgEl.textContent = 'Initial: nodes with in-degree 0 go into the queue/heap.';
                    } else {
                        var qd = i < qSteps.length && qSteps[i].dequeued ? qSteps[i].dequeued : '-';
                        var hd = i < hSteps.length && hSteps[i].dequeued ? hSteps[i].dequeued : '-';
                        msgEl.textContent = 'Step ' + i + ': Queue picks ' + qd + ', Heap picks ' + hd;
                    }
                    msgEl.style.color = '';
                    i++;
                    animTimer = setTimeout(tick, 800);
                }

                tick();
            }

            runBtn.addEventListener('click', function() {
                if (running) return;
                resetCmp();
                var qSteps = runTopo(false);
                var hSteps = runTopo(true);
                animateSteps(qSteps, hSteps);
            });

            resetBtn.addEventListener('click', resetCmp);
            resetCmp();
        })();
    },

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 Click Next to start</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button>' +
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

    // ===== Visualization Tab =====
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
                '<h3>Kahn\'s Algorithm Visualization</h3>' +
                '<p>Watch the topological sort process step by step on a 7-node DAG.</p>' +
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
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">in-degree (In-degree)</div>' +
                        '<div class="ts-indegree-display" id="ts-indegree-display-' + suffix + '">' + indegCells + '</div>' +
                    '</div>' +
                    '<div style="flex:1;min-width:140px;">' +
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Queue</div>' +
                        '<div class="graph-queue-display" id="ts-queue-display-' + suffix + '"></div>' +
                    '</div>' +
                    '<div style="flex:1;min-width:140px;">' +
                        '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Result</div>' +
                        '<div class="graph-queue-display" id="ts-result-display-' + suffix + '"></div>' +
                    '</div>' +
                '</div>' +
                self._createStepDesc(suffix) +
                self._createStepControls(suffix) +
            '</div>' +
            '<div class="graph-legend" style="margin-top:12px;">' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Unvisited</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> Currently Processing</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:rgba(0,184,148,0.15);border:2px dashed var(--green, #00b894);vertical-align:middle;"></span> In Queue</span>' +
                '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> Processed</span>' +
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
            description: 'Initialize: Add nodes 1, 2, 3 (in-degree 0) to the queue. — <em>no prerequisites, so they can be processed immediately</em>',
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
                description: 'Dequeue ' + v + ' and add it to the result. — <em>in-degree 0 means all prerequisites are done, so it can be processed now</em>',
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

                var desc2 = 'Decrease in-degree of neighbors [' + neighbors.join(', ') + '] of ' + v + '. — <em>completing ' + v + ' removes one prerequisite from each neighbor</em>';
                if (newQueued.length > 0) {
                    desc2 += ' → ' + newQueued.join(', ') + ' reached in-degree 0, added to queue.';
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
                        description: v2 + ' has no neighbors. Processing complete! — <em>no downstream tasks, so no other node\'s in-degree is affected</em>',
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
            description: 'Topological sort complete! Result: 1 → 2 → 3 → 4 → 5 → 6 → 7',
            _before: null,
            action: function() { this._before = saveState(); },
            undo: function() { restoreState(this._before); }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 0: Prerequisite (boj-14567) — Kahn's Algorithm + Semester Calc
    // ====================================================================
    _renderVizPrereq(container) {
        var self = this, suffix = '-prereq';
        var DEFAULT_N = 5;
        var DEFAULT_EDGES_STR = '1 2, 1 3, 2 4, 3 4, 4 5';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Prerequisites — Find Earliest Semester</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Use Kahn\'s Algorithm to find the earliest semester for each course. Try changing the values!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (courses): <input type="number" id="ts-prereq-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Prerequisites (A B format): <input type="text" id="ts-prereq-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="ts-prereq-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="pq-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="pq-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="pq-semester' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:12px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Queue</div><div id="pq-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Process Order</div><div id="pq-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
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
            var edgeDesc = edges.map(function(e) { return e[0] + '\u2192' + e[1]; }).join(', ');
            (function(initInd) {
                steps.push({
                    description: 'Calculate in-degrees from edges [' + edgeDesc + ']. \u2014 <em>In-degree = "number of prerequisites for this course"</em>',
                    action: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester(simSemester, n); renderQueue([]); renderResult([]); infoEl.innerHTML = 'In-degree calculation complete'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Starting prerequisite topological sort.</span>'; }
                });
            })(JSON.parse(JSON.stringify(initIndeg)));

            // Step 2: Enqueue in-degree 0 nodes + set semester=1
            var zeroNodes = simQueue.slice();
            if (zeroNodes.length === 0) {
                steps.push({
                    description: 'No nodes with in-degree 0! \u2014 <em>Possible cycle exists</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">No nodes with in-degree 0!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = 'In-degree calculation complete'; }
                });
                return steps;
            }

            zeroNodes.forEach(function(v) { simSemester[v] = 1; });

            (function(zn, semSnap, initInd) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                steps.push({
                    description: 'Enqueue in-degree 0 nodes [' + zn.join(', ') + '] and set <strong>semester=1</strong>. \u2014 <em>No prerequisites, so they can be taken in semester 1!</em>',
                    action: function() { renderNodes(queuedNodes, n); renderIndeg(initInd, n); renderSemester(semSnap, n); renderQueue(zn.slice()); renderResult([]); infoEl.innerHTML = 'Semester 1 courses: <strong>' + zn.join(', ') + '</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initInd, n); renderSemester({}, n); renderQueue([]); renderResult([]); infoEl.innerHTML = 'In-degree calculation complete'; }
                });
            })(zeroNodes.slice(), JSON.parse(JSON.stringify(simSemester)), JSON.parse(JSON.stringify(initIndeg)));

            // Process BFS
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
                var prevSem = JSON.parse(JSON.stringify(simSemester));
                var prevIndeg = {};
                for (var pp = 1; pp <= n; pp++) prevIndeg[pp] = simIndeg[pp];

                // Dequeue step
                (function(vv, pns, cq, cr, ps) {
                    steps.push({
                        description: 'Dequeue <strong>course ' + vv + '</strong> (semester=' + ps[vv] + '). \u2014 <em>In-degree is 0, so all prerequisites are done!</em>',
                        action: function() { renderNodes(pns, n); renderSemester(ps, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = 'Processing <strong>course ' + vv + '</strong> (semester ' + ps[vv] + ')'; },
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
                    var desc = 'Process edge ' + v + '\u2192' + u + ': ' + semExplain + ' \u2014 <em>Course ' + v + ' is in semester ' + prevSem[v] + ', so course ' + u + ' needs at least semester ' + newSemU + '</em>';
                    if (becameZero) {
                        desc += '<br>\u2192 Course ' + u + ' in-degree becomes 0 \u2014 added to queue! <em>All prerequisites completed</em>';
                    }

                    (function(desc2, ans, aind, aq, asem) {
                        steps.push({
                            description: desc2,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderSemester(asem, n); renderQueue(aq); infoEl.innerHTML = 'Processing edges...'; },
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
                            description: 'Course ' + vv2 + ' has no dependent courses. Done! \u2014 <em>No courses require this as a prerequisite</em>',
                            action: function() { renderNodes(dns, n); infoEl.innerHTML = 'Course ' + vv2 + ' done (no dependents)'; },
                            undo: function() {}
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)));
                }
            }

            // Final step
            var finalSem = JSON.parse(JSON.stringify(simSemester));
            var finalResult = simResult.slice();
            steps.push({
                description: 'Topological sort complete! The earliest semester for each course has been determined.',
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderQueue([]); renderResult(finalResult); renderSemester(finalSem, n);
                    var semStr = [];
                    for (var s = 1; s <= n; s++) semStr.push(finalSem[s] || 0);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">Done! Semesters: ' + semStr.join(' ') + '</strong>';
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting prerequisite topological sort.</span>';
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
    // Simulation 1: Lineup (boj-2252) — Basic Kahn's Algorithm
    // ====================================================================
    _renderVizLineup(container) {
        var self = this, suffix = '-lineup';
        var DEFAULT_N = 4;
        var DEFAULT_EDGES_STR = '1 3, 2 3, 3 4';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Lineup — Basic Topological Sort</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Line up students using Kahn\'s Algorithm. Try changing the values!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (students): <input type="number" id="ts-lineup-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Edges (A B format): <input type="text" id="ts-lineup-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="ts-lineup-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="lu-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="lu-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Queue</div><div id="lu-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Result</div><div id="lu-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
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
                    description: 'No node with in-degree 0! — <em>every node has a prerequisite, so nothing can start; this implies a cycle exists</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">No node with in-degree 0!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with Kahn\'s Algorithm.</span>'; }
                });
                return steps;
            }

            // Step: init queue
            (function(zn, initN, initInd) {
                var queuedNodes = {};
                for (var k = 1; k <= n; k++) queuedNodes[k] = 'default';
                zn.forEach(function(v) { queuedNodes[v] = 'queued'; });
                steps.push({
                    description: 'Initialize: Add nodes ' + zn.join(', ') + ' (in-degree 0) to the queue. — <em>no prerequisites, so they can be processed immediately</em>',
                    action: function() { renderNodes(queuedNodes, n); renderQueue(zn.slice()); renderResult([]); infoEl.innerHTML = 'in-degree 0: <strong>' + zn.join(', ') + '</strong> → added to queue'; },
                    undo: function() { renderNodes(initN, n); renderIndeg(initInd, n); renderQueue([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with Kahn\'s Algorithm.</span>'; }
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
                        description: 'Dequeue ' + vv + ' and add it to the result. — <em>in-degree 0 = all prerequisites done, so it can be processed now</em>',
                        action: function() { renderNodes(pns, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = '<strong>' + vv + '</strong> processing...'; },
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

                    var desc2 = 'Decrease in-degree of neighbors [' + neighbors.join(', ') + '] of ' + v + '. — <em>completing ' + v + ' removes one prerequisite from each neighbor</em>';
                    if (newQueued.length > 0) {
                        desc2 += ' → ' + newQueued.join(', ') + ' reached in-degree 0, added to queue!';
                    }

                    (function(vv2, ans, aind, aq, desc3, pns2, pind, pcq, pcr) {
                        steps.push({
                            description: desc3,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderQueue(aq); infoEl.innerHTML = vv2 + ' processing complete'; },
                            undo: function() { renderNodes(pns2, n); renderIndeg(pind, n); renderQueue(pcq); renderResult(pcr); infoEl.innerHTML = '<strong>' + vv2 + '</strong> processing...'; }
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
                            description: vv3 + ' has no neighbors. Processing complete! — <em>no downstream tasks, so no other node\'s in-degree is affected</em>',
                            action: function() { renderNodes(dns, n); renderIndeg(pind2, n); infoEl.innerHTML = vv3 + ' processing complete (no neighbors)'; },
                            undo: function() { renderNodes(pns3, n); renderIndeg(pind2, n); renderQueue(pcq2); renderResult(pcr2); infoEl.innerHTML = '<strong>' + vv3 + '</strong> processing...'; }
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)), JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curQueue.slice(), curResult.slice());
                }
            }

            // Final step
            var finalResult = simResult.slice();
            steps.push({
                description: 'Topological sort complete! Result: ' + finalResult.join(' → '),
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderQueue([]); renderResult(finalResult);
                    if (finalResult.length < n) {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">Cycle detected! Only ' + finalResult.length + '/' + n + ' sorted</strong>';
                    } else {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">Topological sort complete! Result: ' + finalResult.join(' ') + '</strong>';
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with Kahn\'s Algorithm.</span>';
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
    // Simulation 2: Workbook (boj-1766) — Min-Heap + Topological Sort
    // ====================================================================
    _renderVizWorkbook(container) {
        var self = this, suffix = '-workbook';
        var DEFAULT_N = 4;
        var DEFAULT_EDGES_STR = '4 2, 3 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Workbook — Min-Heap + Topological Sort</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Using a <strong>min-heap</strong> to solve easier problems first! Try changing the values!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N (problems): <input type="number" id="ts-work-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;" min="2" max="10"></label>' +
                '<label style="font-weight:600;">Prerequisites (A B format): <input type="text" id="ts-work-edges" value="' + DEFAULT_EDGES_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="ts-work-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="wb-nodes' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="wb-indeg' + suffix + '" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Heap (min-heap)</div><div id="wb-heap' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Result</div><div id="wb-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
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
                    description: 'No node with in-degree 0! — <em>every node has a prerequisite, so nothing can start; this implies a cycle exists</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">No node with in-degree 0!</strong>'; },
                    undo: function() { renderNodes(initNodes, n); renderIndeg(initIndeg, n); renderHeap([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with min-heap.</span>'; }
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
                    description: 'Initialize: Add nodes ' + zn.join(', ') + ' (in-degree 0) to the heap. Since it is a min-heap, ' + zn[0] + ' comes first! — <em>processing smallest-numbered node first among those with no prerequisites guarantees lexicographically smallest order</em>',
                    action: function() { renderNodes(queuedNodes, n); renderHeap(heapDisplay); renderResult([]); infoEl.innerHTML = 'in-degree 0: <strong>' + zn.join(', ') + '</strong> → added to min-heap. Min value: ' + zn[0]; },
                    undo: function() { renderNodes(initN, n); renderIndeg(initInd, n); renderHeap([]); renderResult([]); infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with min-heap.</span>'; }
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
                        description: 'Pop minimum value ' + vv + ' from the heap and add to result. — <em>among in-degree 0 nodes, picking the smallest ensures lexicographic order</em>',
                        action: function() { renderNodes(pns, n); renderHeap(chd); renderResult(cr); infoEl.innerHTML = '<strong>' + vv + '</strong> processing... (min from heap)'; },
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

                    var desc2 = 'Decrease in-degree of neighbors [' + neighbors.join(', ') + '] of ' + v + '. — <em>completing ' + v + ' removes one prerequisite from each neighbor</em>';
                    if (newQueued.length > 0) {
                        desc2 += ' → ' + newQueued.join(', ') + ' reached in-degree 0, added to heap!';
                    }

                    (function(vv2, ans, aind, ah, desc3, pns2, pind, phd, pr) {
                        steps.push({
                            description: desc3,
                            action: function() { renderNodes(ans, n); renderIndeg(aind, n); renderHeap(ah); infoEl.innerHTML = vv2 + ' processing complete. Heap: [' + ah.join(', ') + ']'; },
                            undo: function() { renderNodes(pns2, n); renderIndeg(pind, n); renderHeap(phd); renderResult(pr); infoEl.innerHTML = '<strong>' + vv2 + '</strong> processing...'; }
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
                            description: vv3 + ' has no neighbors. Processing complete! — <em>no downstream tasks, so no other node\'s in-degree is affected</em>',
                            action: function() { renderNodes(dns, n); renderIndeg(pind2, n); infoEl.innerHTML = vv3 + ' processing complete (no neighbors)'; },
                            undo: function() { renderNodes(pns3, n); renderIndeg(pind2, n); renderHeap(phd2); renderResult(pr2); infoEl.innerHTML = '<strong>' + vv3 + '</strong> processing...'; }
                        });
                    })(v, JSON.parse(JSON.stringify(doneNodeStates)), JSON.parse(JSON.stringify(prevNodeStates)), JSON.parse(JSON.stringify(prevIndeg)), curHeapDisplay.slice(), curResult.slice());
                }
            }

            // Final step
            var finalResult = simResult.slice();
            steps.push({
                description: 'Topological sort complete! Result: ' + finalResult.join(' → '),
                action: function() {
                    var fs = {};
                    for (var f = 1; f <= n; f++) fs[f] = 'done';
                    renderNodes(fs, n); renderHeap([]); renderResult(finalResult);
                    if (finalResult.length < n) {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">Cycle detected! Only ' + finalResult.length + '/' + n + ' sorted</strong>';
                    } else {
                        infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">Topological sort complete! Result: ' + finalResult.join(' ') + '</strong>';
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting topological sort with min-heap.</span>';
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
    // Simulation 3: Final Ranking (boj-3665) — Edge Reversal + Topological Sort
    // ====================================================================
    _renderVizRanking(container) {
        var self = this, suffix = '-ranking';
        var DEFAULT_RANK_STR = '2, 3, 1';
        var DEFAULT_SWAPS_STR = '';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Final Ranking — Edge Reversal + Topological Sort</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Build edges from last year\'s ranking and apply topological sort. Try changing the values!</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Last year ranking: <input type="text" id="ts-rank-order" value="' + DEFAULT_RANK_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">Changed pairs (A B format): <input type="text" id="ts-rank-swaps" value="' + DEFAULT_SWAPS_STR + '" placeholder="e.g. 2 1, 3 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<button class="btn btn-primary" id="ts-rank-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="rk-graph' + suffix + '" style="margin-bottom:12px;text-align:center;"></div>' +
            '<div style="display:flex;gap:16px;margin-bottom:12px;flex-wrap:wrap;">' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Queue</div><div id="rk-queue' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
                '<div style="flex:1;min-width:120px;"><div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Result</div><div id="rk-result' + suffix + '" style="display:flex;gap:4px;min-height:36px;"></div></div>' +
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
                html += '<div style="margin-top:8px;font-size:0.85rem;color:var(--text2);">Edges: ';
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
                    description: 'Build edges for all pairs from last year ranking [' + lastRank.join(',') + ']: ' + edgeStr + ' — <em>higher-ranked team points to lower-ranked team to represent precedence</em>',
                    action: function() { renderGraph(ae, ins, n); infoEl.innerHTML = 'Edge construction complete. in-degree: ' + ids; },
                    undo: function() { renderGraph([], ins, n); infoEl.innerHTML = '<span style="color:var(--text2);">Building edges from last year ranking, then applying topological sort.</span>'; }
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
                        description: 'Apply changed pairs to reverse edges. Current edges: ' + swapEdgeStr + ' — <em>reversing edges for swapped pairs reflects this year\'s new relative rankings</em>',
                        action: function() { renderGraph(ae2, ins2, n); infoEl.innerHTML = 'Edge reversal complete. in-degree: ' + sids; },
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
                    description: 'No node with in-degree 0! — <em>edge reversals created a cycle, making ranking determination impossible</em>',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">IMPOSSIBLE — Cycle detected!</strong>'; },
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
                    description: 'Add nodes ' + zn.join(', ') + ' (in-degree 0) to the queue. — <em>no teams ranked above them, so they are first-place candidates</em>',
                    action: function() { renderGraph(ae3, queuedNodes, n); renderQueue(zn.slice()); infoEl.innerHTML = 'in-degree 0: <strong>' + zn.join(', ') + '</strong> → added to queue'; },
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

                var desc = 'Dequeue ' + v + ' and add to result.';
                if (neighbors.length > 0) {
                    desc += ' Decrease in-degree of neighbors [' + neighbors.join(', ') + '].';
                    if (newQueued.length > 0) {
                        desc += ' ' + newQueued.join(', ') + ' reached in-degree 0, added to queue!';
                    }
                } else {
                    desc += ' No neighbors.';
                }

                var curQueue = simQueue.slice();
                var curResult = simResult.slice();

                (function(vv, ans2, cq, cr, desc4, ae4) {
                    steps.push({
                        description: desc4,
                        action: function() { renderGraph(ae4, ans2, n); renderQueue(cq); renderResult(cr); infoEl.innerHTML = vv + ' processing complete'; },
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
                        description: 'IMPOSSIBLE — A cycle exists, so topological sort is not possible!',
                        action: function() {
                            var fs = {};
                            for (var f = 1; f <= n; f++) fs[f] = fr.indexOf(f) >= 0 ? 'done' : 'default';
                            renderGraph(ae5, fs, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--red);">IMPOSSIBLE — Cycle detected! Only ' + fr.length + '/' + n + ' sorted</strong>';
                        },
                        undo: function() {}
                    });
                } else if (amb) {
                    steps.push({
                        description: 'Cannot determine a unique ranking (?). The queue had 2+ nodes at the same time. — <em>when multiple nodes have in-degree 0 simultaneously, their relative order is ambiguous</em>',
                        action: function() {
                            var fs2 = {};
                            for (var f2 = 1; f2 <= n; f2++) fs2[f2] = 'done';
                            renderGraph(ae5, fs2, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--yellow-vivid,#f9a825);">? — Ranking cannot be determined</strong>';
                        },
                        undo: function() {}
                    });
                } else {
                    steps.push({
                        description: 'Topological sort complete! Result: ' + fr.join(' → '),
                        action: function() {
                            var fs3 = {};
                            for (var f3 = 1; f3 <= n; f3++) fs3[f3] = 'done';
                            renderGraph(ae5, fs3, n); renderQueue([]); renderResult(fr);
                            infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">Topological sort complete! Result: ' + fr.join(' ') + '</strong>';
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
            infoEl.innerHTML = '<span style="color:var(--text2);">Building edges from last year ranking, then applying topological sort.</span>';
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

    // ===== Empty Stub =====
    renderProblem(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Prerequisites (Intro)', desc: 'Introduction to topological sort — find prerequisite course order (Gold V)', problemIds: ['boj-14567'] },
        { num: 2, title: 'Basic Topological Sort', desc: 'Basic topological sort using in-degree and BFS (Gold III)', problemIds: ['boj-2252'] },
        { num: 3, title: 'Advanced Topological Sort', desc: 'Priority queue, cycle detection, and other advanced applications (Gold I~II)', problemIds: ['boj-1766', 'boj-3665'] }
    ],

    // ===== Problem List =====
    problems: [
        // ===== Stage 1: Prerequisites (Intro) =====
        {
            id: 'boj-14567',
            title: 'BOJ 14567 - Prerequisite (Prerequisite)',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/14567',
            simIntro: 'Build a DAG from prerequisite relationships and use Kahn\'s Algorithm to find the earliest semester for each course.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Students at Z University must take a total of N courses under the new curriculum. Each course may have prerequisite courses that must be completed first.</p>
                <p>There is no limit on the number of courses that can be taken per semester. All courses are offered every semester.</p>
                <p>Find the earliest semester in which each course can be taken.</p>
                <h4>Input</h4>
                <p>The first line contains the number of courses N (1 ≤ N ≤ 1000) and the number of prerequisite conditions M (0 ≤ M ≤ 500,000).</p>
                <p>The next M lines each contain two integers A and B, meaning course A is a prerequisite for course B (you must complete A before taking B).</p>
                <h4>Output</h4>
                <p>Print the earliest semester number for each course from 1 to N, separated by spaces, on a single line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 2\n2 3\n1 2</pre></div>
                    <div><strong>Output</strong><pre>1 1 2</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6 4\n1 2\n1 3\n2 5\n4 5</pre></div>
                    <div><strong>Output</strong><pre>1 2 2 1 3 1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ N ≤ 1000</li><li>0 ≤ M ≤ 500,000</li></ul>
            `,
            hints: [
                {
                    title: 'First thought — model as a graph',
                    content: '"Must complete A before taking B" → There\'s a directed <strong>edge</strong> from A to B in a directed acyclic graph (DAG).<br>What algorithm is perfect for handling such precedence relationships? <strong>Topological sort</strong>!'
                },
                {
                    title: 'How do we find the "earliest semester"?',
                    content: 'No prerequisites → Can take it in <strong>semester 1</strong> right away!<br>Has prerequisites → Can take it the <strong>next semester</strong> after all prerequisites are completed.<br><br><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">Sem 1</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">Sem 2</div></div><div style="font-size:1rem;color:var(--text2);">→</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);background:var(--yellow)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--yellow);">C</div><div style="font-size:0.6rem;color:var(--yellow);font-weight:600;">max(1,2)+1 = <strong>Sem 3</strong></div></div></div>In other words, <code>semester[B] = max(semester[all A\'s]) + 1</code> — the latest prerequisite + 1!'
                },
                {
                    title: 'Implement with BFS (Kahn\'s Algorithm)',
                    content: 'Put courses with in-degree 0 (no prerequisites) in the queue and start with semester=1.<br>For each dequeued course, update neighbors: <code>semester[neighbor] = max(semester[neighbor], semester[current] + 1)</code>!<br>When in-degree becomes 0, add to queue.<br><br><span class="lang-py">Python: implement BFS with <code>deque</code></span><span class="lang-cpp">C++: implement BFS with <code>queue</code></span>'
                },
                {
                    title: 'Check the time complexity',
                    content: 'We process each node once and check each edge once, so it\'s <strong>O(N + M)</strong>.<br>With N ≤ 1000 and M ≤ 500,000, this is fast enough!'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nsemester = [0] * (N + 1)\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n        semester[i] = 1\n\nwhile queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        semester[u] = max(semester[u], semester[v] + 1)\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)\n\nprint(*semester[1:])',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    vector<int> semester(N + 1, 0);\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) {\n            q.push(i);\n            semester[i] = 1;\n        }\n    }\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            semester[u] = max(semester[u], semester[v] + 1);\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }\n\n    for (int i = 1; i <= N; i++)\n        printf("%d%c", semester[i], i == N ? \'\\n\' : \' \');\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Kahn\'s Algorithm + Semester Calculation',
                description: 'BFS from courses with in-degree 0, calculating the earliest semester for each course.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input and Build Graph', desc: 'Store prerequisite relationships as an adjacency list\nand count in-degrees to prepare for topological sort.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]  # adjacency list\nin_degree = [0] * (N + 1)           # in-degree count\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)  # edge a → b\n    in_degree[b] += 1   # increase b\'s in-degree' },
                        { title: 'Enqueue In-degree 0 Courses', desc: 'Courses with no prerequisites can be taken in semester 1,\nso add them to the queue and initialize semester=1.', code: 'semester = [0] * (N + 1)\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n        semester[i] = 1  # no prereqs → semester 1' },
                        { title: 'BFS + Semester Calculation', desc: 'For each dequeued course, update neighbor semesters to\nmax(current, prerequisite semester + 1).\nThe latest prerequisite + 1 gives the earliest possible semester!', code: 'while queue:\n    v = queue.popleft()\n    for u in graph[v]:\n        # latest prerequisite + 1\n        semester[u] = max(semester[u], semester[v] + 1)\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)' },
                        { title: 'Output', desc: 'Print the earliest semester for each course from 1 to N.', code: 'print(*semester[1:])' }
                    ],
                    cpp: [
                        { title: 'Input and Build Graph', desc: 'Store prerequisite relationships as an adjacency list\nand count in-degrees to prepare for topological sort.', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);  // edge a → b\n        in_degree[b]++;         // increase b\'s in-degree\n    }' },
                        { title: 'Enqueue In-degree 0 Courses', desc: 'Courses with no prerequisites go into the queue\nwith semester=1.', code: '    vector<int> semester(N + 1, 0);\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) {\n            q.push(i);\n            semester[i] = 1;  // no prereqs → semester 1\n        }\n    }' },
                        { title: 'BFS + Semester Calculation', desc: 'For each dequeued course, update neighbor semesters to\nmax(current, prerequisite semester + 1).', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        for (int u : graph[v]) {\n            // latest prerequisite + 1\n            semester[u] = max(semester[u], semester[v] + 1);\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }' },
                        { title: 'Output', desc: 'Print the earliest semester for each course and exit.', code: '    for (int i = 1; i <= N; i++)\n        printf("%d%c", semester[i], i == N ? \'\\n\' : \' \');\n    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[0].templates; }
            }]
        },

        // ===== Stage 2: Basic Topological Sort =====
        {
            id: 'boj-2252',
            title: 'BOJ 2252 - Lineup',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2252',
            simIntro: 'Watch how Kahn\'s Algorithm lines up students step by step.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>We want to line up N students by height. Some height comparison results between students are given. For example, if we know that student A must stand in front of student B, then A must appear before B. Given the comparison results, write a program that lines up the students. If there are multiple valid answers, print any one of them.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 2\n1 3\n2 3</pre></div>
                    <div><strong>Output</strong><pre>1 2 3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2\n4 2\n3 1</pre></div>
                    <div><strong>Output</strong><pre>4 3 2 1</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains N (1 ≤ N ≤ 32,000) and M (1 ≤ M ≤ 100,000). M is the number of height comparisons. The next M lines each contain two student numbers A and B, meaning student A must stand in front of student B.</p>
                <h4>Output</h4>
                <p>Output the result of lining up students from front to back. If there are multiple valid answers, print any one of them.</p>
                <h4>Constraints</h4>
                <ul><li>1 ≤ N ≤ 32,000</li><li>1 ≤ M ≤ 100,000</li></ul>
            `,
            hints: [
                {
                    title: 'Sorting with ordering constraints?',
                    content: 'We are given multiple conditions like "A must come before B." We need to find an order that <strong>satisfies all conditions</strong>.<br>This type of problem is called <strong>"Topological Sort"</strong>!'
                },
                {
                    title: 'Start from nodes with in-degree 0',
                    content: 'A student that nobody is required to stand before — meaning a student with <strong>in-degree 0</strong> — can be placed first.<br><br><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--green);background:var(--green)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--green);">1</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">in=0</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--green);background:var(--green)20;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;box-shadow:0 0 6px var(--green);">4</div><div style="font-size:0.6rem;color:var(--green);font-weight:600;">in=0</div></div><div style="font-size:1rem;color:var(--text2);">→</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);background:var(--accent)10;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">3</div><div style="font-size:0.6rem;color:var(--text2);">in=1</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);background:var(--accent)10;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">5</div><div style="font-size:0.6rem;color:var(--text2);">in=2</div></div></div>Once that student is placed, the in-degree of students who must come after decreases by 1.'
                },
                {
                    title: 'Implement with BFS (Kahn\'s Algorithm)',
                    content: 'Add all nodes with in-degree 0 to a queue, dequeue one at a time, and decrease the in-degree of connected nodes. When in-degree becomes 0, add to queue!<br><br><span class="lang-py">Python: Implement BFS using <code>deque</code></span><span class="lang-cpp">C++: Implement BFS using <code>queue</code></span>'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nqueue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)\n\nprint(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) q.push(i);\n    }\n\n    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Kahn\'s Algorithm (BFS)',
                description: 'Start by enqueuing nodes with in-degree 0 and perform topological sort via BFS.',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input and Graph Construction', desc: 'Build the adjacency list and in-degree array\nas the foundation for BFS topological sort.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: 'Add in-degree 0 nodes to queue', desc: 'Nodes with no prerequisites (in-degree 0) can\nbe processed first, so add them to the queue.', code: 'queue = deque()\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        queue.append(i)' },
                        { title: 'BFS Topological Sort', desc: 'Decrease in-degree of neighbors for each dequeued node.\nWhen in-degree reaches 0, add to queue — core of Kahn\'s Algorithm.', code: 'result = []\nwhile queue:\n    v = queue.popleft()\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            queue.append(u)' },
                        { title: 'Output', desc: 'Print the topological sort result separated by spaces.', code: 'print(*result)' }
                    ],
                    cpp: [
                        { title: 'Input and Graph Construction', desc: 'Build the adjacency list and in-degree array\nas the foundation for BFS topological sort.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }' },
                        { title: 'Add in-degree 0 nodes to queue', desc: 'Add prerequisite-free nodes to the queue\nas the starting points for topological sort.', code: '    queue<int> q;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) q.push(i);\n    }' },
                        { title: 'BFS Topological Sort', desc: 'Dequeue nodes and decrease neighbor in-degrees.\nWhen in-degree reaches 0, add to queue — core of Kahn\'s Algorithm.', code: '    while (!q.empty()) {\n        int v = q.front(); q.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) q.push(u);\n        }\n    }' },
                        { title: 'Output', desc: 'Print the topological sort result and exit.', code: '    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[1].templates; }
            }]
        },

        // ===== Stage 2: Advanced Topological Sort =====
        {
            id: 'boj-1766',
            title: 'BOJ 1766 - Workbook',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1766',
            simIntro: 'Watch how a min-heap is used to solve easier (lower-numbered) problems first.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Mino wants to solve a workbook consisting of N problems numbered 1 to N. The problems are ordered by difficulty, with problem 1 being the easiest and problem N the hardest. M prerequisite pairs are given (problem A must be solved before problem B). Mino wants to solve easier problems first (lower-numbered ones) whenever possible. Print the order in which the problems should be solved.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 2\n4 2\n3 1</pre></div>
                    <div><strong>Output</strong><pre>3 1 4 2</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of problems N (1 ≤ N ≤ 32,000) and the number of prerequisite pairs M (1 ≤ M ≤ 100,000). From the second line, M lines each contain two integers A and B, meaning problem A should be solved before problem B.</p>
                <h4>Output</h4>
                <p>Output the problem numbers in the order they should be solved, separated by spaces.</p>
                <h4>Constraints</h4>
                <ul><li>1 ≤ N ≤ 32,000</li><li>1 ≤ M ≤ 100,000</li></ul>
            `,
            hints: [
                {
                    title: 'Topological sort + easier problems first',
                    content: 'Since there are "must solve first" conditions, we need topological sort. But there is one more constraint — <strong>"solve easier problems first when possible"</strong>, meaning prioritize smaller numbers.'
                },
                {
                    title: 'A regular queue will not work!',
                    content: 'If we use a regular queue like in problem 2252, when multiple nodes have in-degree 0, it processes <strong>any of them</strong> first.<br><br><div style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;"><div style="flex:1;min-width:120px;padding:8px 10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;text-align:center;"><div style="font-size:0.72rem;font-weight:700;color:var(--red);margin-bottom:4px;">Regular queue</div><div style="display:flex;gap:3px;justify-content:center;"><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">5</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">2</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">3</div></div><div style="font-size:0.65rem;color:var(--red);margin-top:4px;">-> 5 first (arbitrary)</div></div><div style="flex:1;min-width:120px;padding:8px 10px;border:2px solid var(--green);border-radius:8px;background:var(--green)06;text-align:center;"><div style="font-size:0.72rem;font-weight:700;color:var(--green);margin-bottom:4px;">Min-heap</div><div style="display:flex;gap:3px;justify-content:center;"><div style="padding:3px 7px;border-radius:4px;background:var(--green)20;font-size:0.8rem;font-weight:700;color:var(--green);">2</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">3</div><div style="padding:3px 7px;border-radius:4px;background:var(--bg3);font-size:0.8rem;font-weight:600;">5</div></div><div style="font-size:0.65rem;color:var(--green);margin-top:4px;">-> 2 first (smallest!)</div></div></div>There is no way to always pick the smallest number!'
                },
                {
                    title: 'Use a priority queue (min-heap)!',
                    content: 'If we use a <strong>min-heap</strong> instead of a queue, we can always process the <strong>smallest-numbered node</strong> among those with in-degree 0.<br><br><span class="lang-py">Python: <code>heapq</code> — it is a min-heap by default, ready to use</span><span class="lang-cpp">C++: <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code> — must add greater for min-heap</span>'
                }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1\n\nheap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)\n\nresult = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)\n\nprint(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }\n\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) pq.push(i);\n    }\n\n    while (!pq.empty()) {\n        int v = pq.top(); pq.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) pq.push(u);\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Min-Heap + Kahn\'s Algorithm',
                description: 'Use a min-heap instead of a regular queue to process smaller-numbered problems first.',
                timeComplexity: 'O((N + M) log N)',
                spaceComplexity: 'O(N + M)',
                codeSteps: {
                    python: [
                        { title: 'Input and Graph Construction', desc: 'Store prerequisites as an adjacency list and\ncount in-degrees to prepare for topological sort.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ngraph = [[] for _ in range(N + 1)]\nin_degree = [0] * (N + 1)\n\nfor _ in range(M):\n    a, b = map(int, input().split())\n    graph[a].append(b)\n    in_degree[b] += 1' },
                        { title: 'Initialize Min-Heap', desc: 'Since we want to solve easier problems first,\nuse a min-heap instead of a regular queue.', code: 'heap = []\nfor i in range(1, N + 1):\n    if in_degree[i] == 0:\n        heapq.heappush(heap, i)' },
                        { title: 'Heap-Based Topological Sort', desc: 'heappop always extracts the smallest number first,\nautomatically satisfying the "easier problems first" constraint.', code: 'result = []\nwhile heap:\n    v = heapq.heappop(heap)\n    result.append(v)\n    for u in graph[v]:\n        in_degree[u] -= 1\n        if in_degree[u] == 0:\n            heapq.heappush(heap, u)' },
                        { title: 'Output', desc: 'Print the result sorted by min-heap.', code: 'print(*result)' }
                    ],
                    cpp: [
                        { title: 'Input and Graph Construction', desc: 'Store prerequisites as an adjacency list and\ncount in-degrees to prepare for topological sort.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<vector<int>> graph(N + 1);\n    vector<int> in_degree(N + 1, 0);\n\n    for (int i = 0; i < M; i++) {\n        int a, b;\n        scanf("%d %d", &a, &b);\n        graph[a].push_back(b);\n        in_degree[b]++;\n    }' },
                        { title: 'Initialize Min-Heap', desc: 'Adding greater<int> to priority_queue makes it a min-heap!\nThe default is max-heap, so be careful.', code: '    // greater<int> -> min-heap (default is max-heap)\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 1; i <= N; i++) {\n        if (in_degree[i] == 0) pq.push(i);\n    }' },
                        { title: 'Heap-Based Topological Sort', desc: 'pq.top() always returns the minimum value,\nso smaller numbers are processed automatically first.', code: '    while (!pq.empty()) {\n        int v = pq.top(); pq.pop();\n        printf("%d ", v);\n        for (int u : graph[v]) {\n            if (--in_degree[u] == 0) pq.push(u);\n        }\n    }' },
                        { title: 'Output', desc: 'Print the topological sort result and exit.', code: '    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-3665',
            title: 'BOJ 3665 - Final Ranking',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/3665',
            simIntro: 'Watch how edges are built from last year\'s ranking and topological sort is applied.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A total of n teams participated in this year's ACM-ICPC Daejeon Internet Preliminary. Last year's ranking is given, along with pairs of teams whose relative ranking changed this year. Use the changed information to determine this year's ranking. If the ranking cannot be uniquely determined, print "?". If there is an inconsistency, print "IMPOSSIBLE".</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n5\n5 4 3 2 1\n2\n2 4\n3 4\n3\n2 3 1\n0\n4\n1 2 3 4\n3\n1 2\n3 4\n2 3</pre></div>
                    <div><strong>Output</strong><pre>5 3 2 4 1\n2 3 1\nIMPOSSIBLE</pre></div>
                </div></div>
                <h4>Input</h4>
                <p>The first line contains the number of test cases. For each test case, the first line contains the number of teams n (2 ≤ n ≤ 500). The second line contains the team numbers in last year's ranking order. The third line contains the number of changed pairs m (0 ≤ m ≤ 25,000). The next m lines each contain a pair of teams whose relative ranking has changed.</p>
                <h4>Output</h4>
                <p>For each test case, output this year's ranking. If the ranking cannot be uniquely determined, print "?". If the data is inconsistent and no ranking is possible, print "IMPOSSIBLE".</p>
                <h4>Constraints</h4>
                <ul><li>2 ≤ n ≤ 500</li><li>0 ≤ m ≤ 25,000</li><li>T is the number of test cases</li></ul>
            `,
            hints: [
                {
                    title: 'Start from last year\'s ranking',
                    content: 'Last year\'s ranking is essentially an initial topological sort result. Create edges from earlier-ranked teams to later-ranked teams for <strong>all pairs</strong>, forming a DAG.<br>Example: If [5,4,3,2,1] then 5→4, 5→3, ..., 4→3, 4→2, ... all pairs!'
                },
                {
                    title: 'Edge reversal is the key',
                    content: '<strong>Reversing the edge direction</strong> for changed pairs is the core of this problem.<br><br><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div><span style="font-size:0.9rem;color:var(--red);text-decoration:line-through;">-></span><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div></div><div style="font-size:1rem;font-weight:700;color:var(--yellow);">⇒</div><div style="display:flex;align-items:center;gap:6px;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">B</div><span style="font-size:0.9rem;color:var(--green);font-weight:700;">-></span><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);background:var(--green)15;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">A</div></div></div><div style="font-size:0.82rem;margin-top:4px;">If A was ranked above B last year but it flipped this year -> remove the A->B edge and add B->A instead. Adjust in-degrees accordingly.</div>'
                },
                {
                    title: 'IMPOSSIBLE and ?',
                    content: 'During topological sort, if the queue has <strong>2 or more</strong> nodes at the same time, the ranking cannot be uniquely determined → print <strong>"?"</strong>.<br>If not all nodes are visited, a cycle exists → print <strong>"IMPOSSIBLE"</strong>.'
                }
            ],
            templates: {
                python: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    n = int(input())\n    rank = list(map(int, input().split()))\n\n    # Create edges for all pairs\n    graph = [[False] * (n + 1) for _ in range(n + 1)]\n    in_degree = [0] * (n + 1)\n\n    for i in range(n):\n        for j in range(i + 1, n):\n            graph[rank[i]][rank[j]] = True\n            in_degree[rank[j]] += 1\n\n    m = int(input())\n    for _ in range(m):\n        a, b = map(int, input().split())\n        if graph[a][b]:\n            graph[a][b] = False\n            graph[b][a] = True\n            in_degree[b] -= 1\n            in_degree[a] += 1\n        else:\n            graph[b][a] = False\n            graph[a][b] = True\n            in_degree[a] -= 1\n            in_degree[b] += 1\n\n    queue = deque()\n    for i in range(1, n + 1):\n        if in_degree[i] == 0:\n            queue.append(i)\n\n    result = []\n    ambiguous = False\n\n    for _ in range(n):\n        if len(queue) == 0:\n            break\n        if len(queue) > 1:\n            ambiguous = True\n        v = queue.popleft()\n        result.append(v)\n        for u in range(1, n + 1):\n            if graph[v][u]:\n                in_degree[u] -= 1\n                if in_degree[u] == 0:\n                    queue.append(u)\n\n    if len(result) != n:\n        print("IMPOSSIBLE")\n    elif ambiguous:\n        print("?")\n    else:\n        print(*result)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int n;\n        scanf("%d", &n);\n        vector<int> rank_arr(n);\n        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);\n\n        vector<vector<bool>> graph(n + 1, vector<bool>(n + 1, false));\n        vector<int> in_deg(n + 1, 0);\n\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                graph[rank_arr[i]][rank_arr[j]] = true;\n                in_deg[rank_arr[j]]++;\n            }\n        }\n\n        int m;\n        scanf("%d", &m);\n        for (int i = 0; i < m; i++) {\n            int a, b;\n            scanf("%d %d", &a, &b);\n            if (graph[a][b]) {\n                graph[a][b] = false; graph[b][a] = true;\n                in_deg[b]--; in_deg[a]++;\n            } else {\n                graph[b][a] = false; graph[a][b] = true;\n                in_deg[a]--; in_deg[b]++;\n            }\n        }\n\n        queue<int> q;\n        for (int i = 1; i <= n; i++) {\n            if (in_deg[i] == 0) q.push(i);\n        }\n\n        vector<int> result;\n        bool ambiguous = false;\n\n        for (int i = 0; i < n; i++) {\n            if (q.empty()) { result.clear(); break; }\n            if (q.size() > 1) ambiguous = true;\n            int v = q.front(); q.pop();\n            result.push_back(v);\n            for (int u = 1; u <= n; u++) {\n                if (graph[v][u]) {\n                    if (--in_deg[u] == 0) q.push(u);\n                }\n            }\n        }\n\n        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");\n        else if (ambiguous) printf("?\\n");\n        else {\n            for (int i = 0; i < n; i++)\n                printf("%d%c", result[i], i == n - 1 ? \'\\n\' : \' \');\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Edge Reversal + Kahn\'s Algorithm',
                description: 'Build edges for all pairs from last year\'s ranking, reverse edges for changed pairs, then apply topological sort.',
                timeComplexity: 'O(N^2)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: 'Input and Build All-Pair Edges', desc: 'Create edges from earlier to later for all pairs\nin last year\'s ranking, representing "higher rank" relationships as a graph.', code: 'import sys\nfrom collections import deque\ninput = sys.stdin.readline\n\nn = int(input())\nrank = list(map(int, input().split()))\n\ngraph = [[False] * (n + 1) for _ in range(n + 1)]\nin_degree = [0] * (n + 1)\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        graph[rank[i]][rank[j]] = True\n        in_degree[rank[j]] += 1' },
                        { title: 'Reverse Changed Pair Edges', desc: 'Reverse the edge direction for pairs whose relative\norder changed this year, reflecting new ranking relationships.', code: 'm = int(input())\nfor _ in range(m):\n    a, b = map(int, input().split())\n    if graph[a][b]:\n        graph[a][b] = False\n        graph[b][a] = True\n        in_degree[b] -= 1\n        in_degree[a] += 1\n    else:\n        graph[b][a] = False\n        graph[a][b] = True\n        in_degree[a] -= 1\n        in_degree[b] += 1' },
                        { title: 'Topological Sort + Detection', desc: 'If queue has 2+ nodes simultaneously, ranking is ambiguous ("?").\nIf result count is less than n, a cycle exists ("IMPOSSIBLE").', code: 'queue = deque()\nfor i in range(1, n + 1):\n    if in_degree[i] == 0:\n        queue.append(i)\n\nresult = []\nambiguous = False\n\nfor _ in range(n):\n    if len(queue) == 0: break\n    if len(queue) > 1: ambiguous = True\n    v = queue.popleft()\n    result.append(v)\n    for u in range(1, n + 1):\n        if graph[v][u]:\n            in_degree[u] -= 1\n            if in_degree[u] == 0:\n                queue.append(u)' },
                        { title: 'Output Result', desc: 'Print IMPOSSIBLE for cycles, ? for ambiguous ranking,\notherwise print the confirmed ranking for this year.', code: 'if len(result) != n:\n    print("IMPOSSIBLE")\nelif ambiguous:\n    print("?")\nelse:\n    print(*result)' }
                    ],
                    cpp: [
                        { title: 'Input and Build All-Pair Edges', desc: 'Build edges for all pairs from last year ranking.\n2D bool array for O(1) edge lookup.', code: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int T; scanf("%d", &T);\n    while (T--) {\n        int n; scanf("%d", &n);\n        vector<int> rank_arr(n);\n        for (int i = 0; i < n; i++) scanf("%d", &rank_arr[i]);\n\n        vector<vector<bool>> graph(n+1, vector<bool>(n+1, false));\n        vector<int> in_deg(n+1, 0);\n        for (int i = 0; i < n; i++)\n            for (int j = i+1; j < n; j++) {\n                graph[rank_arr[i]][rank_arr[j]] = true;\n                in_deg[rank_arr[j]]++;\n            }' },
                        { title: 'Reverse Changed Pair Edges', desc: 'Reverse existing edge direction and update in-degrees.', code: '        int m; scanf("%d", &m);\n        for (int i = 0; i < m; i++) {\n            int a, b; scanf("%d %d", &a, &b);\n            if (graph[a][b]) {\n                graph[a][b] = false; graph[b][a] = true;\n                in_deg[b]--; in_deg[a]++;\n            } else {\n                graph[b][a] = false; graph[a][b] = true;\n                in_deg[a]--; in_deg[b]++;\n            }\n        }' },
                        { title: 'Topological Sort + Detection', desc: 'Queue has 2+ nodes at once -> "?", result < n -> "IMPOSSIBLE".', code: '        queue<int> q;\n        for (int i = 1; i <= n; i++)\n            if (in_deg[i] == 0) q.push(i);\n\n        vector<int> result;\n        bool ambiguous = false;\n        for (int i = 0; i < n; i++) {\n            if (q.empty()) break;\n            if (q.size() > 1) ambiguous = true;\n            int v = q.front(); q.pop();\n            result.push_back(v);\n            for (int u = 1; u <= n; u++)\n                if (graph[v][u] && --in_deg[u] == 0) q.push(u);\n        }' },
                        { title: 'Output Result', desc: 'Print IMPOSSIBLE for cycles, ? for ambiguous ranking,\notherwise print the confirmed ranking for this year.', code: '        if ((int)result.size() != n) printf("IMPOSSIBLE\\n");\n        else if (ambiguous) printf("?\\n");\n        else {\n            for (int i = 0; i < n; i++)\n                printf("%d%c", result[i], i==n-1?\'\\n\':\' \');\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return topologicalSortTopic.problems[3].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { topologicalSortTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.topologicalsort = topologicalSortTopic;
