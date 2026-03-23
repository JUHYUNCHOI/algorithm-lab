// =========================================================
// Union-Find Topic Module
// =========================================================
var unionFindTopic = {
    id: 'unionfind',
    title: 'Union-Find',
    icon: '🤝',
    category: 'Advanced (Gold~Platinum)',
    order: 21,
    description: 'A data structure for efficiently managing disjoint sets',
    relatedNote: 'Union-Find is a core component of Kruskal MST, network connectivity, dynamic connectivity queries, and more.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-1717':  { type: 'Basic Implementation',  color: 'var(--accent)', vizMethod: '_renderVizBasicUF' },
        'boj-1976':  { type: 'Connected Components', color: 'var(--green)',  vizMethod: '_renderVizTravel' },
        'lc-200':    { type: 'Grid Components',      color: '#e17055',       vizMethod: '_renderVizIslands' },
        'boj-4195':  { type: 'Set Size Tracking',    color: '#6c5ce7',       vizMethod: '_renderVizFriendNet' }
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
            sim:     { intro: prob.simIntro || 'See how Union-Find actually works in action.', icon: '🎮' },
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
        container.innerHTML = `
            <div class="hero">
                <h2>🤝 Union-Find</h2>
                <p class="hero-sub">Learn the data structure that quickly determines who belongs to the same group!</p>
            </div>

            <!-- Section 1: What is Union-Find? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> What is Union-Find?
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think of "merging clubs"!<br><br>
                    A school has many clubs. Each club has a <strong>representative (president)</strong>.<br>
                    When two clubs merge, one president goes under the other.<br>
                    "Are these two students in the same club?" Just check if their <strong>representatives are the same</strong>!<br><br>
                    This is exactly what <strong>Union-Find</strong> does: it manages <strong>disjoint sets</strong>.
                </div>
                <div style="margin:0.5rem 0 0.8rem;">
                    <a href="https://en.wikipedia.org/wiki/Disjoint-set_data_structure" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Disjoint-set (Union-Find) ↗</a>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="10" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="19" y1="16" x2="19" y2="22" stroke="var(--accent)" stroke-width="2"/><text x="19" y="14" text-anchor="middle" font-size="9" fill="var(--accent)">?</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="1.5"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="1.5"/><line x1="15" y1="25" x2="10" y2="26" stroke="var(--accent)" stroke-width="1.5"/><line x1="23" y1="25" x2="28" y2="26" stroke="var(--accent)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>find (Find Representative)</h3>
                        <p>Finds the <strong>representative (root)</strong> of the set an element belongs to. Follows parent pointers upward until reaching the root.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="14" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="28" cy="14" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><path d="M16,14 L22,14" stroke="var(--green)" stroke-width="2" stroke-dasharray="3,2"/><circle cx="19" cy="30" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="18" x2="17" y2="25" stroke="var(--green)" stroke-width="1.5"/><line x1="25" y1="18" x2="21" y2="25" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>union (Merge)</h3>
                        <p><strong>Merges two sets into one</strong>. Makes one representative a child of the other.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="19" r="8" fill="rgba(108,92,231,0.1)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="26" cy="19" r="8" fill="rgba(0,184,148,0.1)" stroke="var(--green)" stroke-width="1.5"/><text x="12" y="22" text-anchor="middle" font-size="9" fill="var(--accent)">A</text><text x="26" y="22" text-anchor="middle" font-size="9" fill="var(--green)">B</text></svg>
                        </div>
                        <h3>Disjoint Sets</h3>
                        <p>Sets with no overlapping elements. Every element belongs to <strong>exactly one set</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><text x="8" y="22" font-size="9" fill="var(--yellow)">0 1 2 3 4</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--text2)">parent[]</text></svg>
                        </div>
                        <h3>parent Array</h3>
                        <p><code>parent[i]</code> is the parent of i. The root satisfies <code>parent[i] = i</code>.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Basic Union-Find implementation
parent = list(range(N + 1))  # Initially each element is its own representative

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # Path compression!
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a != b:
        parent[b] = a  # Change b's representative to a</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;numeric&gt;
using namespace std;

// Basic Union-Find implementation
vector&lt;int&gt; parent(N + 1);
iota(parent.begin(), parent.end(), 0);  // Initially each element is its own representative

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // Path compression!
    return parent[x];
}

void union_(int a, int b) {
    a = find(a); b = find(b);
    if (a != b)
        parent[b] = a;  // Change b's representative to a
}</code></pre>
                </div></span>
                <div style="margin:0.8rem 0 0.5rem;">
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/iota" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: iota (fill with sequential values) ↗</a></span>
                    <span class="lang-cpp"><p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>std::iota()</code> &mdash; A function in the &lt;numeric&gt; header that fills an array with sequential values 0, 1, 2, ...</p></span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Watch the parent array change</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Select two nodes and run union to see how the parent array updates!</p>
                    <div class="concept-demo-body">
                        <div id="uf-s1-parent" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <span style="font-size:0.85rem;">union(</span>
                            <select id="uf-s1-a" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>0</option><option selected>1</option><option>2</option><option>3</option><option>4</option></select>
                            <span>,</span>
                            <select id="uf-s1-b" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>0</option><option>1</option><option selected>2</option><option>3</option><option>4</option></select>
                            <span>)</span>
                            <button class="concept-demo-btn" id="uf-s1-go">Run</button>
                            <button class="concept-demo-btn green" id="uf-s1-reset">↺</button>
                        </div>
                        <div id="uf-s1-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-s1-msg">Running union(1, 2) sets parent[2] = 1. Try it yourself!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">If parent = [0, 1, 2, 3, 4], what happens to the parent array after union(1, 2)?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        find(1)=1, find(2)=2, so parent[2] becomes 1.<br>
                        Result: parent = [0, <strong>1</strong>, <strong>1</strong>, 3, 4]<br>
                        Now 1 and 2 are in the same set, with representative 1!
                    </div>
                </div>
            </div>

            <!-- Section 2: Optimization Techniques -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> Optimization Techniques
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> If you merge carelessly, the tree can become a long chain.<br>
                    Just like a single-file line where the person at the end has to walk a long way to find the leader!<br><br>
                    Two optimizations solve this problem:<br>
                    1. <strong>Path Compression</strong>: While finding the root, connect every node directly to the root.<br>
                    2. <strong>Union by Rank</strong>: Always attach the smaller tree under the larger tree.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="6" r="4" fill="var(--accent)" opacity="0.3"/><circle cx="19" cy="18" r="4" fill="var(--accent)" opacity="0.5"/><circle cx="19" cy="30" r="4" fill="var(--accent)" opacity="0.8"/><line x1="19" y1="10" x2="19" y2="14" stroke="var(--accent)" stroke-width="1.5"/><line x1="19" y1="22" x2="19" y2="26" stroke="var(--accent)" stroke-width="1.5"/><path d="M24,30 C30,24 30,12 19,6" stroke="var(--green)" stroke-width="1.5" fill="none" stroke-dasharray="3,2" marker-end="url(#uf-arrow)"/><defs><marker id="uf-arrow" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--green)"/></marker></defs></svg>
                        </div>
                        <h3>Path Compression</h3>
                        <p>During find, <strong>connect every node directly to the root</strong>. Future finds become nearly O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="10" r="4" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="8" cy="22" r="3" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="16" cy="22" r="3" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="10" r="4" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M26,10 L14,10" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#uf-arrow2)"/><defs><marker id="uf-arrow2" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--border)"/></marker></defs></svg>
                        </div>
                        <h3>Union by Rank</h3>
                        <p>Attaches the <strong>smaller tree under the larger tree</strong>. Prevents the tree height from growing.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--yellow)">O(α(n))</text><text x="19" y="28" text-anchor="middle" font-size="8" fill="var(--text2)">≈ O(1)</text><rect x="4" y="4" width="30" height="30" rx="6" fill="none" stroke="var(--yellow)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>Nearly O(1)</h3>
                        <p>With both optimizations combined: <strong>O(alpha(n))</strong>. alpha is the inverse Ackermann function, which is effectively constant!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Path compression + union by rank
parent = list(range(N + 1))
rank = [0] * (N + 1)

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # Path compression
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a == b:
        return  # Already in the same set
    # Attach the smaller rank to the larger rank
    if rank[a] < rank[b]:
        a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]:
        rank[a] += 1</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;numeric&gt;
using namespace std;

// Path compression + union by rank
vector&lt;int&gt; parent(N + 1), rnk(N + 1, 0);
iota(parent.begin(), parent.end(), 0);

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // Path compression
    return parent[x];
}

void union_(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;  // Already in the same set
    // Attach the smaller rank to the larger rank
    if (rnk[a] &lt; rnk[b]) swap(a, b);
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Path compression before vs after</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Build a chain and run find to compare parent arrays before and after path compression!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:6px;">Without compression</div>
                                <div id="uf-s2-before" style="font-family:monospace;font-size:0.85rem;color:var(--text2);min-height:3em;"></div>
                            </div>
                            <div style="flex:1;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:6px;">After compression</div>
                                <div id="uf-s2-after" style="font-family:monospace;font-size:0.85rem;color:var(--text2);min-height:3em;"></div>
                            </div>
                        </div>
                        <div id="uf-s2-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div style="margin-top:8px;">
                        <button class="concept-demo-btn" id="uf-s2-run">Run find(5)!</button>
                        <button class="concept-demo-btn green" id="uf-s2-reset">↺</button>
                    </div>
                    <div class="concept-demo-msg" id="uf-s2-msg">Click "Run find(5)!" to see path compression in action!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">Without path compression, given the chain 1->2->3->4->5, how many parent hops does find(5) require? What about after path compression?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Without compression: 5->4->3->2->1, requires <strong>4 hops</strong>.<br>
                        After compression: 5's parent points directly to 1, so the next find(5) only takes <strong>1 hop</strong>!<br>
                        Nodes 3 and 4 on the path also get their parent set to 1.
                    </div>
                </div>
            </div>

            <!-- Section 3: Union-Find Applications -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> Union-Find Applications
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="12" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="22" cy="12" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="16" cy="24" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><line x1="13" y1="14" x2="15" y2="21" stroke="var(--accent)" stroke-width="1.5"/><line x1="20" y1="15" x2="17" y2="21" stroke="var(--accent)" stroke-width="1.5"/><circle cx="32" cy="20" r="4" fill="rgba(0,184,148,0.2)" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>Graph Connected Components</h3>
                        <p>Union nodes connected by edges to quickly identify connected components.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="28" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M15,16 L23,22" stroke="var(--red, #e17055)" stroke-width="1.5"/><path d="M15,22 L23,16" stroke="var(--red, #e17055)" stroke-width="1.5"/><circle cx="19" cy="8" r="4" fill="none" stroke="var(--red, #e17055)" stroke-width="1.5"/><line x1="13" y1="15" x2="17" y2="11" stroke="var(--red, #e17055)" stroke-width="1.5"/><line x1="21" y1="11" x2="25" y2="15" stroke="var(--red, #e17055)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>Cycle Detection</h3>
                        <p>When adding edge (u, v), if find(u)==find(v), a <strong>cycle exists</strong>!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="8" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="8" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="8" cy="30" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="30" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><line x1="8" y1="12" x2="8" y2="26" stroke="var(--green)" stroke-width="2"/><line x1="12" y1="8" x2="26" y2="8" stroke="var(--green)" stroke-width="2"/><line x1="12" y1="30" x2="26" y2="30" stroke="var(--green)" stroke-width="2"/><text x="19" y="22" text-anchor="middle" font-size="7" fill="var(--green)">MST</text></svg>
                        </div>
                        <h3>Kruskal MST</h3>
                        <p>Sort edges by weight, then add only edges that do not create a cycle. Union-Find is the key!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><circle cx="28" cy="19" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><circle cx="19" cy="10" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="14" y1="16" x2="16" y2="13" stroke="var(--yellow)" stroke-width="1.5"/><line x1="22" y1="13" x2="24" y2="16" stroke="var(--yellow)" stroke-width="1.5"/><line x1="15" y1="19" x2="23" y2="19" stroke="var(--yellow)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>Network Connectivity</h3>
                        <p>Quickly check "are two nodes connected?" in computer networks, city connections, and more.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Union-Find in Kruskal MST
edges.sort(key=lambda x: x[2])  # Sort by weight
mst_cost = 0
mst_edges = 0

for u, v, w in edges:
    if find(u) != find(v):  # Not a cycle
        union(u, v)
        mst_cost += w
        mst_edges += 1
        if mst_edges == N - 1:
            break  # MST complete!

print(mst_cost)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Union-Find in Kruskal MST
// edges: vector&lt;tuple&lt;int,int,int&gt;&gt; (u, v, w)
sort(edges.begin(), edges.end(), [](auto&amp; a, auto&amp; b) {
    return get&lt;2&gt;(a) &lt; get&lt;2&gt;(b);  // Sort by weight
});
int mst_cost = 0, mst_edges = 0;

for (auto&amp; [u, v, w] : edges) {
    if (find(u) != find(v)) {  // Not a cycle
        union_(u, v);
        mst_cost += w;
        mst_edges++;
        if (mst_edges == N - 1)
            break;  // MST complete!
    }
}

cout &lt;&lt; mst_cost &lt;&lt; endl;</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">Try It — Check if nodes are in the same group</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Union groups together, then use find to check representatives!</p>
                    <div class="concept-demo-body">
                        <div id="uf-s3-parent" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <button class="concept-demo-btn" id="uf-s3-u12">union(1,2)</button>
                            <button class="concept-demo-btn" id="uf-s3-u34">union(3,4)</button>
                            <button class="concept-demo-btn" id="uf-s3-u23">union(2,3)</button>
                        </div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                            <span style="font-size:0.85rem;">find(</span>
                            <select id="uf-s3-q" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>1</option><option>2</option><option>3</option><option>4</option></select>
                            <span>)</span>
                            <button class="concept-demo-btn" id="uf-s3-find">Find</button>
                            <button class="concept-demo-btn green" id="uf-s3-reset">↺</button>
                        </div>
                        <div id="uf-s3-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-s3-msg">Use union buttons to merge groups, then find to check representatives!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">With 4 nodes (1-4) and edges (1-2, weight 3), (2-3, weight 1), (3-4, weight 2), (1-4, weight 5), what does Kruskal MST produce?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Sort by weight: (2-3,1), (3-4,2), (1-2,3), (1-4,5)<br>
                        1. (2-3,1): find(2)!=find(3) -> union! Added to MST. Cost=1<br>
                        2. (3-4,2): find(3)!=find(4) -> union! Added to MST. Cost=3<br>
                        3. (1-2,3): find(1)!=find(2) -> union! Added to MST. Cost=<strong>6</strong><br>
                        4. (1-4,5): find(1)==find(4) -> cycle! Skip<br>
                        MST cost = <strong>6</strong>
                    </div>
                </div>
            </div>

            <!-- Section 4: Demo — Union & Find Experience -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> Demo: Union & Find Experience
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Click nodes to Union & Find</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <span style="font-size:0.85rem;color:var(--text2);">Click 2 nodes → Union | Click 1 node → Find</span>
                        <button class="concept-demo-btn green" id="uf-demo-uf-reset">↺ Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="uf-demo-uf-nodes" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-uf-parent" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;font-family:monospace;"></div>
                        <div id="uf-demo-uf-groups" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div id="uf-demo-uf-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-uf-msg">👆 Click the nodes! Click 2 to Union (merge), or double-click 1 to Find (find representative).</div>
                </div>
            </div>

            <!-- Section 5: Demo — Path Compression -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">5</span> Demo: Path Compression Visualization
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Watch a long chain get compressed</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="uf-demo-pc-build">🔗 Build Chain (1→2→3→4→5)</button>
                        <button class="concept-demo-btn" id="uf-demo-pc-find" style="display:none;">🔍 Run find(5)</button>
                        <button class="concept-demo-btn green" id="uf-demo-pc-reset" style="display:none;">↺ Again</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Tree Structure</div>
                                <div id="uf-demo-pc-tree" style="font-family:monospace;font-size:0.9rem;line-height:1.8;color:var(--text);"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">parent Array</div>
                                <div id="uf-demo-pc-arr" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                            </div>
                        </div>
                        <div id="uf-demo-pc-log" style="margin-top:10px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-pc-msg">👆 Click "Build Chain" to create a long chain, then click "Run find(5)" to see path compression in action!</div>
                </div>
            </div>

            <!-- Section 6: Demo — Cycle Detection -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">6</span> Demo: Cycle Detection
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Add edges and detect cycles</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="uf-demo-cycle-step">➕ Add Next Edge</button>
                        <button class="concept-demo-btn green" id="uf-demo-cycle-reset">↺ Reset</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="uf-demo-cycle-edges" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-cycle-nodes" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-cycle-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-cycle-msg">👆 Click "Add Next Edge"! It detects the moment a cycle is formed.</div>
                </div>
            </div>
        `;

        this._initConceptInteractions(container);
    },

    _initConceptInteractions: function(container) {
        container.querySelectorAll('.think-box-trigger').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var ans = btn.nextElementSibling;
                ans.classList.toggle('show');
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ====== Section 1 demo: parent array changes ======
        (function() {
            var parentEl = container.querySelector('#uf-s1-parent');
            var logEl = container.querySelector('#uf-s1-log');
            if (!parentEl) return;
            var p;
            function reset() { p = [0,1,2,3,4]; render(); logEl.textContent = 'Select two nodes and click "Run"!'; }
            function find(x) { while (p[x] !== x) x = p[x]; return x; }
            function render() {
                parentEl.innerHTML = p.map(function(v,i) {
                    var isRoot = p[i] === i;
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.7rem;color:var(--text2);">p[' + i + ']</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;font-weight:700;background:' + (isRoot?'var(--accent)':'var(--bg2)') + ';color:' + (isRoot?'#fff':'var(--text)') + ';">' + v + '</span></div>';
                }).join('');
            }
            reset();
            container.querySelector('#uf-s1-go').addEventListener('click', function() {
                var a = parseInt(container.querySelector('#uf-s1-a').value);
                var b = parseInt(container.querySelector('#uf-s1-b').value);
                var ra = find(a), rb = find(b);
                if (ra === rb) { logEl.textContent = 'find(' + a + ')=' + ra + ', find(' + b + ')=' + rb + ' — already same group!'; return; }
                p[rb] = ra;
                render();
                logEl.innerHTML = 'union(' + a + ',' + b + '): find(' + a + ')=' + ra + ', find(' + b + ')=' + rb + ' — <strong>parent[' + rb + '] = ' + ra + '</strong> updated!';
            });
            container.querySelector('#uf-s1-reset').addEventListener('click', reset);
        })();

        // ====== Section 2 demo: path compression before vs after ======
        (function() {
            var beforeEl = container.querySelector('#uf-s2-before');
            var afterEl = container.querySelector('#uf-s2-after');
            var logEl = container.querySelector('#uf-s2-log');
            if (!beforeEl) return;
            function showChain() {
                beforeEl.innerHTML = 'parent: [_, 1, 1, 2, 3, 4]<br>chain: 5→4→3→2→1';
                afterEl.innerHTML = '<span style="color:var(--text2);">Not run yet</span>';
                logEl.textContent = 'Click "Run find(5)!"';
            }
            showChain();
            container.querySelector('#uf-s2-run').addEventListener('click', function() {
                beforeEl.innerHTML = 'parent: [_, 1, 1, 2, 3, 4]<br>find(5): 5→4→3→2→1 (<strong>4 hops</strong>)';
                afterEl.innerHTML = 'parent: [_, 1, 1, <span style="color:var(--green);font-weight:700;">1</span>, <span style="color:var(--green);font-weight:700;">1</span>, <span style="color:var(--green);font-weight:700;">1</span>]<br>next find(5): 5→1 (<strong style="color:var(--green);">1 hop</strong>!)';
                logEl.innerHTML = 'Path compression makes 3, 4, 5 all <strong>point directly to 1</strong>! Next find is much faster.';
            });
            container.querySelector('#uf-s2-reset').addEventListener('click', showChain);
        })();

        // ====== Section 3 demo: find to check same group ======
        (function() {
            var parentEl = container.querySelector('#uf-s3-parent');
            var logEl = container.querySelector('#uf-s3-log');
            if (!parentEl) return;
            var p;
            function reset() { p = [0,1,2,3,4]; render(); logEl.textContent = 'Click union buttons to merge groups!'; }
            function find(x) { if (p[x]!==x) p[x]=find(p[x]); return p[x]; }
            function union(a,b) { var ra=find(a),rb=find(b); if(ra!==rb) p[rb]=ra; }
            function render() {
                parentEl.innerHTML = p.map(function(v,i) {
                    if (i===0) return '';
                    var colors = ['','var(--accent)','var(--green)','var(--yellow)','var(--red)'];
                    var root = find(i);
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.7rem;color:var(--text2);">' + i + '</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;font-weight:700;border:2px solid ' + colors[root] + ';color:var(--text);">p=' + v + '</span></div>';
                }).join('');
            }
            reset();
            container.querySelector('#uf-s3-u12').addEventListener('click', function() { union(1,2); render(); logEl.textContent = 'union(1,2) done! Nodes 1 and 2 are in the same group.'; });
            container.querySelector('#uf-s3-u34').addEventListener('click', function() { union(3,4); render(); logEl.textContent = 'union(3,4) done! Nodes 3 and 4 are in the same group.'; });
            container.querySelector('#uf-s3-u23').addEventListener('click', function() { union(2,3); render(); logEl.textContent = 'union(2,3) done! Now 1,2,3,4 are all in the same group!'; });
            container.querySelector('#uf-s3-find').addEventListener('click', function() {
                var q = parseInt(container.querySelector('#uf-s3-q').value);
                var r = find(q);
                logEl.innerHTML = 'find(' + q + ') = <strong>' + r + '</strong> — the representative (root) of node ' + q + ' is ' + r + '!';
            });
            container.querySelector('#uf-s3-reset').addEventListener('click', reset);
        })();

        // ====== Demo 1: Union & Find Experience ======
        (function() {
            var N = 6;
            var parent = [];
            var selected = [];
            var groupColors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#0984e3', '#d63031'];
            var nodesEl = container.querySelector('#uf-demo-uf-nodes');
            var parentEl = container.querySelector('#uf-demo-uf-parent');
            var groupsEl = container.querySelector('#uf-demo-uf-groups');
            var logEl = container.querySelector('#uf-demo-uf-log');
            var resetBtn = container.querySelector('#uf-demo-uf-reset');

            function init() {
                parent = [];
                selected = [];
                for (var i = 0; i < N; i++) parent.push(i);
                render();
                logEl.textContent = 'Click a node!';
            }

            function find(x) {
                if (parent[x] !== x) parent[x] = find(parent[x]);
                return parent[x];
            }

            function union(a, b) {
                a = find(a); b = find(b);
                if (a !== b) { parent[b] = a; return true; }
                return false;
            }

            function render() {
                nodesEl.innerHTML = '';
                var groups = {};
                for (var i = 0; i < N; i++) {
                    var root = find(i);
                    if (!groups[root]) groups[root] = [];
                    groups[root].push(i);
                }

                for (var i = 0; i < N; i++) {
                    var root = find(i);
                    var colorIdx = Object.keys(groups).indexOf(String(root));
                    var color = groupColors[colorIdx % groupColors.length];
                    var node = document.createElement('div');
                    node.style.cssText = 'width:48px;height:48px;border-radius:50%;border:2.5px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;cursor:pointer;transition:all 0.2s ease;color:' + color + ';background:var(--card);user-select:none;';
                    if (selected.indexOf(i) >= 0) {
                        node.style.boxShadow = '0 0 10px ' + color;
                        node.style.transform = 'scale(1.1)';
                    }
                    node.textContent = i;
                    node.dataset.idx = i;
                    node.addEventListener('click', function() {
                        var idx = parseInt(this.dataset.idx);
                        if (selected.indexOf(idx) >= 0) {
                            selected = selected.filter(function(s) { return s !== idx; });
                        } else {
                            selected.push(idx);
                        }
                        if (selected.length === 1) {
                            var root = find(selected[0]);
                            logEl.innerHTML = '<strong>find(' + selected[0] + ')</strong> = <strong style="color:var(--green);">' + root + '</strong> (representative). Click a 2nd node to Union.';
                            render();
                        } else if (selected.length >= 2) {
                            var a = selected[0], b = selected[1];
                            var merged = union(a, b);
                            if (merged) {
                                logEl.innerHTML = '<strong>union(' + a + ', ' + b + ')</strong> → <strong style="color:var(--green);">Merged!</strong> ' + b + '\'s representative changed to ' + find(a);
                            } else {
                                logEl.innerHTML = '<strong>union(' + a + ', ' + b + ')</strong> → Already in the same group! (representative: ' + find(a) + ')';
                            }
                            selected = [];
                            render();
                        } else {
                            render();
                        }
                    });
                    nodesEl.appendChild(node);
                }

                parentEl.textContent = 'parent = [' + parent.join(', ') + ']';

                groupsEl.innerHTML = '';
                var rootKeys = Object.keys(groups);
                rootKeys.forEach(function(root, idx) {
                    var badge = document.createElement('span');
                    badge.style.cssText = 'padding:4px 10px;border-radius:12px;font-size:0.8rem;font-weight:600;color:#fff;background:' + groupColors[idx % groupColors.length] + ';';
                    badge.textContent = 'Group ' + root + ': {' + groups[root].join(', ') + '}';
                    groupsEl.appendChild(badge);
                });
            }

            init();
            resetBtn.addEventListener('click', init);
        })();

        // ====== Demo 2: Path Compression ======
        (function() {
            var parent = [0, 0, 1, 2, 3, 4];
            var treeEl = container.querySelector('#uf-demo-pc-tree');
            var arrEl = container.querySelector('#uf-demo-pc-arr');
            var logEl = container.querySelector('#uf-demo-pc-log');
            var buildBtn = container.querySelector('#uf-demo-pc-build');
            var findBtn = container.querySelector('#uf-demo-pc-find');
            var resetBtn = container.querySelector('#uf-demo-pc-reset');

            function renderTree(highlight) {
                treeEl.innerHTML = '';
                var lines = [];
                function buildLines(node, prefix, isLast) {
                    var children = [];
                    for (var i = 0; i < parent.length; i++) {
                        if (i !== node && parent[i] === node) children.push(i);
                    }
                    var nodeStr = '<span style="' + (highlight && highlight.indexOf(node) >= 0 ? 'color:var(--green);font-weight:700;' : 'color:var(--text);') + '">' + node + '</span>';
                    if (parent[node] === node) nodeStr += ' <span style="font-size:0.75rem;color:var(--accent);">(root)</span>';
                    lines.push(prefix + nodeStr);
                    children.forEach(function(c, i) {
                        var last = i === children.length - 1;
                        var connector = last ? '└─ ' : '├─ ';
                        var nextPrefix = prefix + (last ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;');
                        buildLines(c, prefix + connector, last);
                    });
                }
                var root = 0;
                for (var i = 0; i < parent.length; i++) {
                    if (parent[i] === i) { root = i; break; }
                }
                buildLines(root, '', true);
                treeEl.innerHTML = lines.map(function(l) { return '<div>' + l + '</div>'; }).join('');
            }

            function renderArr(highlight) {
                arrEl.innerHTML = '';
                for (var i = 0; i < parent.length; i++) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-idx" style="font-size:0.65rem;">' + i + '</div><div class="str-char-val">' + parent[i] + '</div>';
                    if (highlight && highlight.indexOf(i) >= 0) {
                        box.style.borderColor = 'var(--green)';
                        box.style.boxShadow = '0 0 6px var(--green)';
                    }
                    arrEl.appendChild(box);
                }
            }

            function resetState() {
                parent = [0, 0, 0, 0, 0, 0];
                buildBtn.style.display = '';
                findBtn.style.display = 'none';
                resetBtn.style.display = 'none';
                treeEl.innerHTML = '';
                arrEl.innerHTML = '';
                logEl.textContent = 'Click "Build Chain" to get started!';
            }
            resetState();

            buildBtn.addEventListener('click', function() {
                parent = [0, 0, 1, 2, 3, 4];
                renderTree();
                renderArr();
                logEl.innerHTML = 'Chain created: 5→4→3→2→1→<strong>0 (root)</strong>. Running find(5) requires traversing 5 hops!';
                buildBtn.style.display = 'none';
                findBtn.style.display = '';
                resetBtn.style.display = '';
            });

            findBtn.addEventListener('click', function() {
                var path = [5, 4, 3, 2, 1, 0];
                var step = 0;
                function animate() {
                    if (step < path.length) {
                        renderTree(path.slice(0, step + 1));
                        renderArr(path.slice(0, step + 1));
                        logEl.innerHTML = 'find(5): ' + path.slice(0, step + 1).join(' → ') + (step < path.length - 1 ? ' → ...' : ' → <strong style="color:var(--green);">Root found!</strong>');
                        step++;
                        setTimeout(animate, 500);
                    } else {
                        setTimeout(function() {
                            parent = [0, 0, 0, 0, 0, 0];
                            for (var i = 1; i <= 5; i++) parent[i] = 0;
                            renderTree([1, 2, 3, 4, 5]);
                            renderArr([1, 2, 3, 4, 5]);
                            logEl.innerHTML = '<strong style="color:var(--green);">Path compression complete!</strong> All nodes now point directly to root (0). The next find takes just <strong>1 hop</strong>!';
                        }, 600);
                    }
                }
                findBtn.style.display = 'none';
                animate();
            });

            resetBtn.addEventListener('click', resetState);
        })();

        // ====== Demo 3: Cycle Detection ======
        (function() {
            var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]];
            var parent = [0, 1, 2, 3, 4];
            var addedEdges = [];
            var stepIdx = 0;
            var cycleFound = false;
            var edgesEl = container.querySelector('#uf-demo-cycle-edges');
            var nodesEl = container.querySelector('#uf-demo-cycle-nodes');
            var logEl = container.querySelector('#uf-demo-cycle-log');
            var stepBtn = container.querySelector('#uf-demo-cycle-step');
            var resetBtn = container.querySelector('#uf-demo-cycle-reset');

            function find(x) {
                if (parent[x] !== x) parent[x] = find(parent[x]);
                return parent[x];
            }

            function render() {
                edgesEl.innerHTML = '';
                edges.forEach(function(e, i) {
                    var badge = document.createElement('span');
                    var added = i < addedEdges.length;
                    var isCycle = added && addedEdges[i] === 'cycle';
                    badge.style.cssText = 'padding:4px 10px;border-radius:12px;font-size:0.8rem;font-weight:600;transition:all 0.3s ease;';
                    if (isCycle) {
                        badge.style.background = 'rgba(225,112,85,0.2)';
                        badge.style.color = 'var(--red)';
                        badge.style.border = '1.5px solid var(--red)';
                        badge.textContent = e[0] + '-' + e[1] + ' (cycle!)';
                    } else if (added) {
                        badge.style.background = 'rgba(0,184,148,0.15)';
                        badge.style.color = 'var(--green)';
                        badge.style.border = '1.5px solid var(--green)';
                        badge.textContent = e[0] + '-' + e[1] + ' ✓';
                    } else {
                        badge.style.background = 'var(--bg)';
                        badge.style.color = 'var(--text3)';
                        badge.style.border = '1.5px solid var(--border)';
                        badge.textContent = e[0] + '-' + e[1];
                    }
                    edgesEl.appendChild(badge);
                });

                nodesEl.innerHTML = '';
                var groups = {};
                for (var i = 0; i < 5; i++) {
                    var root = find(i);
                    if (!groups[root]) groups[root] = [];
                    groups[root].push(i);
                }
                var gColors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#0984e3'];
                for (var i = 0; i < 5; i++) {
                    var root = find(i);
                    var cidx = Object.keys(groups).indexOf(String(root));
                    var node = document.createElement('div');
                    node.style.cssText = 'width:40px;height:40px;border-radius:50%;border:2.5px solid ' + gColors[cidx % gColors.length] + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:' + gColors[cidx % gColors.length] + ';background:var(--card);';
                    node.textContent = i;
                    nodesEl.appendChild(node);
                }
            }

            function init() {
                parent = [0, 1, 2, 3, 4];
                addedEdges = [];
                stepIdx = 0;
                cycleFound = false;
                stepBtn.disabled = false;
                render();
                logEl.textContent = 'Click "Add Next Edge"!';
            }
            init();

            stepBtn.addEventListener('click', function() {
                if (stepIdx >= edges.length || cycleFound) return;
                var e = edges[stepIdx];
                var ra = find(e[0]), rb = find(e[1]);
                if (ra === rb) {
                    addedEdges.push('cycle');
                    cycleFound = true;
                    logEl.innerHTML = '<strong style="color:var(--red);">Cycle detected!</strong> Edge (' + e[0] + '-' + e[1] + '): find(' + e[0] + ')=' + ra + ', find(' + e[1] + ')=' + rb + ' → Same group, so it\'s a cycle!';
                    stepBtn.disabled = true;
                } else {
                    parent[rb] = ra;
                    addedEdges.push('ok');
                    logEl.innerHTML = 'Edge (' + e[0] + '-' + e[1] + ') added: find(' + e[0] + ')=' + ra + ', find(' + e[1] + ')=' + rb + ' → <strong style="color:var(--green);">Different groups, merged!</strong>';
                }
                stepIdx++;
                render();
            });

            resetBtn.addEventListener('click', init);
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

    // ===== Visualization Tab (Concept Visualization) =====
    renderVisualize: function(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-uf';

        container.innerHTML =
            '<div class="viz-card">' +
            '<h3>Union-Find Operations Visualization</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Step through union/find operations on 6 nodes (1-6).</p>' +
            '<div style="margin-bottom:12px;">' +
            '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">parent array</div>' +
            '<div id="uf-parent-' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
            '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">Tree Structure</div>' +
            '<div id="uf-tree-' + suffix + '" style="min-height:160px;background:var(--bg);border-radius:var(--radius);padding:12px;font-family:var(--font-mono, monospace);white-space:pre;line-height:1.6;font-size:0.92rem;"></div>' +
            '</div>' +
            '<div id="uf-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;"></div>' +
            self._createStepDesc(suffix) +
            self._createStepControls(suffix) +
            '</div>' +
            '<div class="graph-legend" style="margin-top:12px;">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> Individual Node</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> Currently Processing</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> Merged Set</span>' +
            '</div>';

        var parentDisplay = container.querySelector('#uf-parent-' + suffix);
        var treeDisplay = container.querySelector('#uf-tree-' + suffix);
        var infoEl = container.querySelector('#uf-info-' + suffix);

        function renderParent(par, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 1; i <= 6; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:48px;text-align:center;">' +
                    '<div style="font-size:0.75rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1.05rem;">' + par[i] + '</div>' +
                    '</div>';
            }
            parentDisplay.innerHTML = html;
        }

        function buildTreeText(par) {
            var children = {};
            var roots = [];
            for (var i = 1; i <= 6; i++) children[i] = [];
            for (var i = 1; i <= 6; i++) {
                if (par[i] === i) roots.push(i);
                else children[par[i]].push(i);
            }
            var text = '';
            for (var ri = 0; ri < roots.length; ri++) {
                if (ri > 0) text += '\n';
                text += renderNode(roots[ri], '', true);
            }
            return text;

            function renderNode(node, prefix, isLast) {
                var line = '';
                if (prefix === '') {
                    line = '[' + node + '] (root)\n';
                } else {
                    line = prefix + (isLast ? '└── ' : '├── ') + '[' + node + ']\n';
                }
                var kids = children[node];
                for (var ci = 0; ci < kids.length; ci++) {
                    var childPrefix = prefix === '' ? '    ' : prefix + (isLast ? '    ' : '│   ');
                    line += renderNode(kids[ci], childPrefix, ci === kids.length - 1);
                }
                return line;
            }
        }

        function renderTree(par) {
            treeDisplay.textContent = buildTreeText(par);
        }

        // Initialize
        var initPar = [0, 1, 2, 3, 4, 5, 6];
        renderParent(initPar);
        renderTree(initPar);
        infoEl.innerHTML = '<span style="color:var(--text2)">6 nodes, each in its own independent set. parent[i] = i</span>';

        var steps = [];

        // Step 1: union(1, 2)
        steps.push({
            description: 'union(1, 2): Merge nodes 1 and 2. parent[2] = 1 — <em>link 2\'s parent to 1 to mark them as the same set</em>',
            action: function() {
                var par = [0, 1, 1, 3, 4, 5, 6];
                renderParent(par, {1: 'active', 2: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 2): Change parent of 2 to 1. {1, 2} are now in the same set.';
            },
            undo: function() {
                var par = [0, 1, 2, 3, 4, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = '<span style="color:var(--text2)">6 nodes, each in its own independent set.</span>';
            }
        });

        // Step 2: union(3, 4)
        steps.push({
            description: 'union(3, 4): Merge nodes 3 and 4. parent[4] = 3 — <em>link parent to group the two nodes into one set</em>',
            action: function() {
                var par = [0, 1, 1, 3, 3, 5, 6];
                renderParent(par, {3: 'active', 4: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(3, 4): Change parent of 4 to 3. {3, 4} are now in the same set.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 4, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(1, 2): Change parent of 2 to 1. {1, 2} are now in the same set.';
            }
        });

        // Step 3: union(5, 6)
        steps.push({
            description: 'union(5, 6): Merge nodes 5 and 6. parent[6] = 5 — <em>link parent to group the two nodes into one set</em>',
            action: function() {
                var par = [0, 1, 1, 3, 3, 5, 5];
                renderParent(par, {5: 'active', 6: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(5, 6): Change parent of 6 to 5. {5, 6} are now in the same set.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 3, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(3, 4): Change parent of 4 to 3. {3, 4} are now in the same set.';
            }
        });

        // Step 4: union(1, 3)
        steps.push({
            description: 'union(1, 3): Merge {1,2} and {3,4}. parent[3] = 1 — <em>connecting the roots merges the entire two sets at once</em>',
            action: function() {
                var par = [0, 1, 1, 1, 3, 5, 5];
                renderParent(par, {1: 'active', 3: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. Change parent of 3 to 1. {1, 2, 3, 4} are now in the same set.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 3, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(5, 6): Change parent of 6 to 5. {5, 6} are now in the same set.';
            }
        });

        // Step 5: find(4) with path compression
        steps.push({
            description: 'find(4): Follow path 4->3->1 to find root 1. <strong>Path compression</strong>: set parent[4]=1 directly — <em>so the next find(4) is O(1) instead of following the chain again</em>',
            action: function() {
                var par = [0, 1, 1, 1, 1, 5, 5];
                renderParent(par, {4: 'changed', 1: 'active'});
                renderTree(par);
                infoEl.innerHTML = 'find(4): Follow path 4->3->1. <strong>Path compression!</strong> Connect parent[4] directly to 1.';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 3, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. Change parent of 3 to 1.';
            }
        });

        // Step 6: union(1, 5)
        steps.push({
            description: 'union(1, 5): Merge {1,2,3,4} and {5,6}. parent[5] = 1 — <em>all nodes now share the same root, forming a single unified set</em>',
            action: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par, {1: 'active', 5: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 5): Change parent of 5 to 1. Now <strong>all nodes are in one set</strong>!';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 1, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'find(4): Path compression connects parent[4] directly to 1.';
            }
        });

        // Step 7: final
        steps.push({
            description: 'Done! All nodes are merged into one set under root 1. — <em>comparing any two nodes via find() returns the same root, so same-set check is O(1)</em>',
            action: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">Done! All 6 nodes are merged into one set. Representative is 1.</strong>';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par, {1: 'active', 5: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 5): Change parent of 5 to 1. Now all nodes are in one set!';
            }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 1: Basic Union-Find (boj-1717)
    // ====================================================================
    _renderVizBasicUF: function(container) {
        var self = this, suffix = '-uf1';
        var DEFAULT_N = 7;
        var DEFAULT_OPS = '0 1 3, 0 7 6, 0 3 7, 1 1 7, 1 1 6';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Set Representation — Basic Union-Find</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Nodes N: <input type="number" id="uf-basic-n" value="' + DEFAULT_N + '" min="2" max="15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">Operations: <input type="text" id="uf-basic-ops" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;" title="0 a b = union(a,b), 1 a b = find(a)==find(b)?"></label>' +
            '<button class="btn btn-primary" id="uf-basic-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: <code>0 a b</code> = union(a,b), <code>1 a b</code> = find(a)==find(b)? — comma separated</p>' +
            self._createStepDesc(suffix) +
            '<div id="uf-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="uf-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var parEl = container.querySelector('#uf-par' + suffix);
        var infoEl = container.querySelector('#uf-info' + suffix);

        function renderPar(par, N, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 0; i <= N; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:44px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }

        function parseOps(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return { op: parts[0], a: parts[1], b: parts[2] };
            }).filter(function(o) { return !isNaN(o.op) && !isNaN(o.a) && !isNaN(o.b); });
        }

        function ufFind(par, x) {
            var path = [];
            while (par[x] !== x) { path.push(x); x = par[x]; }
            var root = x;
            for (var i = 0; i < path.length; i++) par[path[i]] = root;
            return { root: root, path: path };
        }

        function buildSteps(N, ops) {
            var initPar = [];
            for (var i = 0; i <= N; i++) initPar[i] = i;
            renderPar(initPar, N);
            infoEl.innerHTML = '<span style="color:var(--text2);">' + (N + 1) + ' nodes, each in its own independent set.</span>';

            var steps = [];
            var curPar = initPar.slice();

            for (var oi = 0; oi < ops.length; oi++) {
                (function(op, prevPar) {
                    if (op.op === 0) {
                        // union operation
                        var parBefore = prevPar.slice();
                        var findA = ufFind(parBefore.slice(), op.a);
                        var findB = ufFind(parBefore.slice(), op.b);
                        var ra = findA.root, rb = findB.root;
                        var newPar = prevPar.slice();
                        // apply find path compression
                        for (var pi = 0; pi < findA.path.length; pi++) newPar[findA.path[pi]] = ra;
                        for (var pi = 0; pi < findB.path.length; pi++) newPar[findB.path[pi]] = rb;
                        var sameSet = (ra === rb);
                        if (!sameSet) {
                            newPar[rb] = ra;
                        }
                        var highlights = {};
                        highlights[ra] = 'active';
                        if (!sameSet) highlights[rb] = 'changed';

                        var descText = sameSet
                            ? 'union(' + op.a + ', ' + op.b + '): find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' -> already same set! — <em>same root means they are already connected</em>'
                            : 'union(' + op.a + ', ' + op.b + '): find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' -> parent[' + rb + ']=' + ra + ' — <em>linking roots merges the entire two sets</em>';
                        var infoText = sameSet
                            ? 'union(' + op.a + ',' + op.b + '): Already in the same set, no change.'
                            : 'union(' + op.a + ',' + op.b + '): parent[' + rb + ']=' + ra + '. {' + op.a + ',' + op.b + '} same set.';

                        steps.push({
                            description: descText,
                            action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                            undo: function() { renderPar(prevPar, N); infoEl.innerHTML = oi === 0 ? '<span style="color:var(--text2);">' + (N + 1) + ' nodes, each in its own independent set.</span>' : ''; }
                        });
                        curPar = newPar;
                    } else {
                        // find/check operation
                        var parBefore = prevPar.slice();
                        var newPar = prevPar.slice();
                        var findA = ufFind(newPar.slice(), op.a);
                        var findB = ufFind(newPar.slice(), op.b);
                        // apply path compression
                        var pathA = ufFind(newPar, op.a);
                        var pathB = ufFind(newPar, op.b);
                        var ra = pathA.root, rb = pathB.root;
                        var same = (ra === rb);
                        var pathStr = '';
                        if (pathA.path.length > 0) pathStr += op.a + '→' + pathA.path.slice().reverse().concat([ra]).join('→');
                        var highlights = {};
                        highlights[op.a] = 'active';
                        highlights[op.b] = 'active';

                        var descText = 'find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → ' + (same ? 'YES ✅ — <em>same root means same set</em>' : 'NO ❌ — <em>different roots means different sets</em>');
                        var infoText = same
                            ? '<strong style="color:var(--green);font-size:1.05rem;">find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' -> same set! YES</strong>'
                            : '<strong style="color:var(--red, #e17055);font-size:1.05rem;">find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' -> different sets! NO</strong>';

                        steps.push({
                            description: descText,
                            action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                            undo: function() { renderPar(parBefore, N); infoEl.innerHTML = ''; }
                        });
                        curPar = newPar;
                    }
                })(ops[oi], curPar.slice());
            }

            return steps;
        }

        function init() {
            var N = parseInt(container.querySelector('#uf-basic-n').value) || DEFAULT_N;
            var ops = parseOps(container.querySelector('#uf-basic-ops').value);
            if (N < 1) N = 1;
            if (N > 15) N = 15;
            var steps = buildSteps(N, ops);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-basic-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // Simulation 2: Let's Travel (boj-1976)
    // ====================================================================
    _renderVizTravel: function(container) {
        var self = this, suffix = '-travel';
        var DEFAULT_N = 5;
        var DEFAULT_EDGES = '1 2, 2 3, 4 5';
        var DEFAULT_PLAN = '1 2 3';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Let\'s Travel — Connected Component Check</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Cities N: <input type="number" id="uf-travel-n" value="' + DEFAULT_N + '" min="2" max="12" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">Routes: <input type="text" id="uf-travel-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;" title="a b pairs, comma separated"></label>' +
            '<label style="font-weight:600;">Travel Plan: <input type="text" id="uf-travel-plan" value="' + DEFAULT_PLAN + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;" title="Cities to visit, space separated"></label>' +
            '<button class="btn btn-primary" id="uf-travel-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Route format: <code>a b</code> pairs, comma separated. Travel plan: city numbers, space separated</p>' +
            self._createStepDesc(suffix) +
            '<div id="tv-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="tv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var parEl = container.querySelector('#tv-par' + suffix);
        var infoEl = container.querySelector('#tv-info' + suffix);

        function renderPar(par, N, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 1; i <= N; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:56px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1.05rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }

        function parseEdges(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return { a: parts[0], b: parts[1] };
            }).filter(function(e) { return !isNaN(e.a) && !isNaN(e.b); });
        }

        function parsePlan(str) {
            return str.trim().split(/\s+/).map(Number).filter(function(n) { return !isNaN(n); });
        }

        function ufFind(par, x) {
            while (par[x] !== x) x = par[x];
            return x;
        }

        function buildSteps(N, edges, plan) {
            var initPar = [0];
            for (var i = 1; i <= N; i++) initPar[i] = i;
            renderPar(initPar, N);
            infoEl.innerHTML = '<span style="color:var(--text2);">Initializing ' + N + ' cities, each in its own set.</span>';

            var steps = [];
            var curPar = initPar.slice();

            // Step group 1: union edges
            for (var ei = 0; ei < edges.length; ei++) {
                (function(edge, prevPar) {
                    var newPar = prevPar.slice();
                    var ra = ufFind(newPar, edge.a);
                    var rb = ufFind(newPar, edge.b);
                    var already = (ra === rb);
                    if (!already) newPar[rb] = ra;
                    // path compression for a and b
                    var x = edge.a; while (newPar[x] !== x) { newPar[x] = ra; x = newPar[x]; }
                    x = edge.b; while (newPar[x] !== x) { newPar[x] = ra; x = newPar[x]; }

                    var highlights = {};
                    highlights[ra] = 'active';
                    if (!already) highlights[rb] = 'changed';

                    var descText = already
                        ? 'Route ' + edge.a + '-' + edge.b + ': already same set (find=' + ra + ') — <em>already connected, no action needed</em>'
                        : 'Route ' + edge.a + '-' + edge.b + ' -> union: parent[' + rb + ']=' + ra + ' — <em>connecting the cities so they belong to the same group</em>';
                    var infoText = already
                        ? 'Cities ' + edge.a + ' and ' + edge.b + ' are already connected.'
                        : 'union(' + edge.a + ',' + edge.b + '): parent[' + rb + ']=' + ra + '. Cities ' + edge.a + ' and ' + edge.b + ' are now connected.';

                    steps.push({
                        description: descText,
                        action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                        undo: function() { renderPar(prevPar, N); infoEl.innerHTML = ''; }
                    });
                    curPar = newPar;
                })(edges[ei], curPar.slice());
            }

            // Step group 2: check travel plan
            if (plan.length > 0) {
                (function(checkPar) {
                    var roots = {};
                    var allSame = true;
                    var firstRoot = ufFind(checkPar, plan[0]);
                    var highlights = {};
                    for (var pi = 0; pi < plan.length; pi++) {
                        var r = ufFind(checkPar, plan[pi]);
                        roots[plan[pi]] = r;
                        highlights[plan[pi]] = 'active';
                        if (r !== firstRoot) allSame = false;
                    }
                    var rootList = plan.map(function(c) { return 'find(' + c + ')=' + ufFind(checkPar, c); }).join(', ');

                    steps.push({
                        description: 'Check travel plan: ' + rootList + ' — <em>all cities must share the same root to be reachable</em>',
                        action: function() { renderPar(checkPar, N, highlights); infoEl.innerHTML = 'Travel city representatives: ' + rootList; },
                        undo: function() { renderPar(checkPar, N); infoEl.innerHTML = ''; }
                    });

                    steps.push({
                        description: allSame ? 'Result: All cities share the same root -> travel is possible → YES ✅' : 'Result: Different roots found -> cities are disconnected → NO ❌',
                        action: function() {
                            renderPar(checkPar, N, highlights);
                            infoEl.innerHTML = allSame
                                ? '<strong style="color:var(--green);font-size:1.05rem;">Travel possible! YES</strong>'
                                : '<strong style="color:var(--red, #e17055);font-size:1.05rem;">Travel impossible! NO</strong>';
                        },
                        undo: function() { renderPar(checkPar, N, highlights); infoEl.innerHTML = 'Travel city representatives: ' + rootList; }
                    });
                })(curPar.slice());
            }

            return steps;
        }

        function init() {
            var N = parseInt(container.querySelector('#uf-travel-n').value) || DEFAULT_N;
            var edges = parseEdges(container.querySelector('#uf-travel-edges').value);
            var plan = parsePlan(container.querySelector('#uf-travel-plan').value);
            if (N < 2) N = 2;
            if (N > 12) N = 12;
            var steps = buildSteps(N, edges, plan);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-travel-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // Simulation 3: Number of Islands (lc-200)
    // ====================================================================
    _renderVizIslands: function(container) {
        var self = this, suffix = '-island';
        var DEFAULT_GRID = '1 1 0 0 0; 1 1 0 0 0; 0 0 1 0 0; 0 0 0 1 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Number of Islands — Grid Union-Find</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid: <input type="text" id="uf-island-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;" title="Rows separated by semicolons, cells by spaces"></label>' +
            '<button class="btn btn-primary" id="uf-island-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: rows separated by <code>;</code>, cells by spaces. Example: <code>1 1 0; 1 0 1; 0 1 1</code></p>' +
            self._createStepDesc(suffix) +
            '<div id="is-grid' + suffix + '" style="display:inline-grid;gap:4px;margin-bottom:12px;"></div>' +
            '<div id="is-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var gridEl = container.querySelector('#is-grid' + suffix);
        var infoEl = container.querySelector('#is-info' + suffix);

        function parseGrid(str) {
            var rows = str.split(';').map(function(row) {
                return row.trim().split(/\s+/).map(function(v) { return v === '1' ? '1' : '0'; });
            }).filter(function(row) { return row.length > 0; });
            return rows;
        }

        function findRoot(par, x) {
            while (par[x] !== x) x = par[x];
            return x;
        }

        function renderGrid(grid, R, C, parent, highlights) {
            highlights = highlights || {};
            gridEl.style.gridTemplateColumns = 'repeat(' + C + ', 48px)';
            var colors = ['var(--accent)', 'var(--green)', '#e17055', '#fdcb6e', '#6c5ce7', '#00cec9', '#e84393', '#636e72'];
            var rootColor = {};
            var ci = 0;
            var html = '';
            for (var r = 0; r < R; r++) {
                for (var c = 0; c < C; c++) {
                    var idx = r * C + c;
                    var bg = 'var(--bg2)';
                    var clr = 'var(--text3)';
                    if (grid[r][c] === '1' && parent) {
                        var root = findRoot(parent, idx);
                        if (!(root in rootColor)) { rootColor[root] = colors[ci % colors.length]; ci++; }
                        bg = rootColor[root] + '25';
                        clr = rootColor[root];
                        if (highlights[idx]) { bg = rootColor[root]; clr = 'white'; }
                    }
                    html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;font-size:0.95rem;background:' + bg + ';color:' + clr + ';border:2px solid ' + (highlights[idx] ? clr : 'transparent') + ';">' + grid[r][c] + '</div>';
                }
            }
            gridEl.innerHTML = html;
        }

        function buildSteps(grid) {
            var R = grid.length, C = grid[0].length;
            var totalOnes = 0;
            for (var r = 0; r < R; r++)
                for (var c = 0; c < C; c++)
                    if (grid[r][c] === '1') totalOnes++;

            var initPar = [];
            for (var i = 0; i < R * C; i++) initPar[i] = i;

            renderGrid(grid, R, C, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Number of \'1\' cells = ' + totalOnes + ' -> initial island count = ' + totalOnes + '</span>';

            var steps = [];
            var curPar = initPar.slice();
            var count = totalOnes;

            // Step 1: show initial state with parent array
            steps.push({
                description: 'Initial: ' + totalOnes + ' \'1\' cells, each starts as an independent island. count=' + totalOnes + ' — <em>union adjacent cells to reduce count and discover connected islands</em>',
                action: function() { renderGrid(grid, R, C, initPar.slice()); infoEl.innerHTML = 'Each \'1\' cell is an independent island. <strong>count = ' + totalOnes + '</strong>'; },
                undo: function() { renderGrid(grid, R, C, null); infoEl.innerHTML = '<span style="color:var(--text2);">Number of \'1\' cells = ' + totalOnes + ' -> initial island count = ' + totalOnes + '</span>'; }
            });

            // Scan grid and create union steps for adjacent '1' cells
            var dr = [0, 1], dc = [1, 0]; // right and down
            for (var r = 0; r < R; r++) {
                for (var c = 0; c < C; c++) {
                    if (grid[r][c] !== '1') continue;
                    for (var d = 0; d < 2; d++) {
                        var nr = r + dr[d], nc = c + dc[d];
                        if (nr >= R || nc >= C || grid[nr][nc] !== '1') continue;
                        var idx1 = r * C + c, idx2 = nr * C + nc;
                        (function(prevPar, i1, i2, rr, cc, nrr, ncc, prevCount) {
                            var newPar = prevPar.slice();
                            var r1 = findRoot(newPar, i1);
                            var r2 = findRoot(newPar, i2);
                            var merged = false;
                            if (r1 !== r2) {
                                newPar[r2] = r1;
                                merged = true;
                            }
                            var newCount = merged ? prevCount - 1 : prevCount;
                            var highlights = {};
                            highlights[i1] = true;
                            highlights[i2] = true;

                            var descText = merged
                                ? 'union(' + i1 + ',' + i2 + '): (' + rr + ',' + cc + ')~(' + nrr + ',' + ncc + ') merged. count=' + newCount + ' — <em>adjacent land cells belong to the same island</em>'
                                : '(' + rr + ',' + cc + ')~(' + nrr + ',' + ncc + '): already same set. count=' + newCount + ' — <em>already connected, no count change</em>';
                            var infoText = merged
                                ? '(' + rr + ',' + cc + ')~(' + nrr + ',' + ncc + ') union! <strong>count = ' + newCount + '</strong>'
                                : '(' + rr + ',' + cc + ')~(' + nrr + ',' + ncc + ') already same set. count = ' + newCount;

                            steps.push({
                                description: descText,
                                action: function() { renderGrid(grid, R, C, newPar, highlights); infoEl.innerHTML = infoText; },
                                undo: function() { renderGrid(grid, R, C, prevPar); infoEl.innerHTML = ''; }
                            });
                            curPar = newPar;
                            count = newCount;
                        })(curPar.slice(), idx1, idx2, r, c, nr, nc, count);
                    }
                }
            }

            // Final step
            var finalPar = curPar.slice();
            var finalCount = count;
            steps.push({
                description: 'Done! After unioning all adjacent \'1\' cells → ' + finalCount + ' island(s)',
                action: function() { renderGrid(grid, R, C, finalPar); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">Answer: ' + finalCount + ' island(s)</strong>'; },
                undo: function() { renderGrid(grid, R, C, finalPar); infoEl.innerHTML = ''; }
            });

            return steps;
        }

        function init() {
            var grid = parseGrid(container.querySelector('#uf-island-grid').value);
            if (grid.length === 0) grid = [['1','0'],['0','1']];
            // Ensure all rows have same length
            var maxC = 0;
            for (var i = 0; i < grid.length; i++) if (grid[i].length > maxC) maxC = grid[i].length;
            for (var i = 0; i < grid.length; i++) while (grid[i].length < maxC) grid[i].push('0');
            var steps = buildSteps(grid);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-island-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // Simulation 4: Friend Network (boj-4195)
    // ====================================================================
    _renderVizFriendNet: function(container) {
        var self = this, suffix = '-friend';
        var DEFAULT_PAIRS = 'Fred Barney, Barney Betty, Betty Wilma';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Friend Network — Set Size Tracking</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Friend Pairs: <input type="text" id="uf-friend-pairs" value="' + DEFAULT_PAIRS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;" title="Name1 Name2 pairs, comma separated"></label>' +
            '<button class="btn btn-primary" id="uf-friend-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: <code>Name1 Name2</code> pairs, comma separated. Example: <code>Fred Barney, Barney Betty</code></p>' +
            self._createStepDesc(suffix) +
            '<div id="fn-names' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="fn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var namesEl = container.querySelector('#fn-names' + suffix);
        var infoEl = container.querySelector('#fn-info' + suffix);

        function parsePairs(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length >= 2) return { a: parts[0], b: parts[1] };
                return null;
            }).filter(function(p) { return p !== null && p.a && p.b; });
        }

        function findR(par, x) { while (par[x] !== x) x = par[x]; return x; }

        function renderNames(par, sz, nameMap, highlights) {
            highlights = highlights || {};
            var html = '';
            var keys = Object.keys(nameMap);
            for (var k = 0; k < keys.length; k++) {
                var name = keys[k];
                var id = nameMap[name];
                var cls = 'str-char-box';
                if (highlights[id] === 'active') cls += ' active';
                else if (highlights[id] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:70px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">' + name + '</div>' +
                    '<div style="font-weight:700;font-size:1rem;">p=' + par[id] + ' s=' + sz[findR(par, id)] + '</div></div>';
            }
            namesEl.innerHTML = html;
        }

        function buildSteps(pairs) {
            namesEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">Adding friend relationships one by one.</span>';

            var steps = [];
            var nameMap = {};
            var par = [];
            var sz = [];
            var idx = 0;
            var outputs = [];

            for (var pi = 0; pi < pairs.length; pi++) {
                (function(pair, prevNameMap, prevPar, prevSz, prevIdx, stepIdx) {
                    var curMap = {};
                    for (var k in prevNameMap) curMap[k] = prevNameMap[k];
                    var curPar = prevPar.slice();
                    var curSz = prevSz.slice();
                    var curIdx = prevIdx;

                    // Register new names
                    if (!(pair.a in curMap)) {
                        curMap[pair.a] = curIdx;
                        curPar[curIdx] = curIdx;
                        curSz[curIdx] = 1;
                        curIdx++;
                    }
                    if (!(pair.b in curMap)) {
                        curMap[pair.b] = curIdx;
                        curPar[curIdx] = curIdx;
                        curSz[curIdx] = 1;
                        curIdx++;
                    }

                    var idA = curMap[pair.a], idB = curMap[pair.b];
                    var rA = findR(curPar, idA), rB = findR(curPar, idB);
                    var highlights = {};
                    var merged = false;
                    if (rA !== rB) {
                        if (curSz[rA] < curSz[rB]) { var tmp = rA; rA = rB; rB = tmp; }
                        curPar[rB] = rA;
                        curSz[rA] += curSz[rB];
                        merged = true;
                    }
                    var networkSize = curSz[findR(curPar, idA)];
                    outputs.push(networkSize);

                    highlights[rA] = 'active';
                    if (merged) highlights[rB] = 'changed';

                    var nameA = pair.a, nameB = pair.b;
                    var findAName = '', findBName = '';
                    // Find name for root
                    var keys = Object.keys(curMap);
                    for (var ki = 0; ki < keys.length; ki++) {
                        if (curMap[keys[ki]] === rA) findAName = keys[ki];
                        if (curMap[keys[ki]] === rB) findBName = keys[ki];
                    }
                    var descText = merged
                        ? nameA + '-' + nameB + ': find(' + nameB + ')=' + findBName + ' -> union -> size = ' + networkSize + ' — <em>merge networks and update size by adding both groups</em>'
                        : nameA + '-' + nameB + ': already same network. size = ' + networkSize + ' — <em>already friends, just report current network size</em>';
                    var infoText = merged
                        ? nameA + '-' + nameB + ': union! Network size = <strong>' + networkSize + '</strong>'
                        : nameA + '-' + nameB + ': already same network. Size = <strong>' + networkSize + '</strong>';

                    // Capture for closure
                    var snapPar = curPar.slice();
                    var snapSz = curSz.slice();
                    var snapMap = {};
                    for (var k in curMap) snapMap[k] = curMap[k];
                    var snapHighlights = {};
                    for (var k in highlights) snapHighlights[k] = highlights[k];

                    var prevSnapPar = prevPar.slice();
                    var prevSnapSz = prevSz.slice();
                    var prevSnapMap = {};
                    for (var k in prevNameMap) prevSnapMap[k] = prevNameMap[k];

                    steps.push({
                        description: descText,
                        action: function() { renderNames(snapPar, snapSz, snapMap, snapHighlights); infoEl.innerHTML = infoText; },
                        undo: function() {
                            if (stepIdx === 0) { namesEl.innerHTML = ''; infoEl.innerHTML = '<span style="color:var(--text2);">Adding friend relationships one by one.</span>'; }
                            else { renderNames(prevSnapPar, prevSnapSz, prevSnapMap); infoEl.innerHTML = ''; }
                        }
                    });

                    // Update outer state for next iteration
                    nameMap = curMap;
                    par = curPar;
                    sz = curSz;
                    idx = curIdx;
                })(pairs[pi], JSON.parse(JSON.stringify(nameMap)), par.slice(), sz.slice(), idx, pi);
            }

            // Final step showing all outputs
            if (pairs.length > 0) {
                var finalPar = par.slice();
                var finalSz = sz.slice();
                var finalMap = {};
                for (var k in nameMap) finalMap[k] = nameMap[k];
                var outputStr = outputs.join(' → ');
                steps.push({
                    description: 'Done! Output: ' + outputStr,
                    action: function() { renderNames(finalPar, finalSz, finalMap); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">Output: ' + outputStr + '</strong>'; },
                    undo: function() { renderNames(finalPar, finalSz, finalMap); infoEl.innerHTML = ''; }
                });
            }

            return steps;
        }

        function init() {
            var pairs = parsePairs(container.querySelector('#uf-friend-pairs').value);
            var steps = buildSteps(pairs);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-friend-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ===== Problem List =====
    renderProblem: function(container) {},

    stages: [
        { num: 1, title: 'Basic Union-Find', desc: 'Basic Union-Find implementation and set membership (Gold IV-V)', problemIds: ['boj-1717', 'boj-1976'] },
        { num: 2, title: 'Union-Find Applications', desc: 'Island counting, network size, and more (Medium-Gold)', problemIds: ['lc-200', 'boj-4195'] }
    ],

    problems: [
        // ===== Stage 1: Basic Union-Find =====
        {
            id: 'boj-1717', title: 'BOJ 1717 - Set Representation', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1717',
            simIntro: 'See how basic Union-Find operations (union, find) work.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Initially, {0}, {1}, ..., {n} form n+1 separate sets. Perform union operations and queries to check if two elements belong to the same set.</p>
                <p>0 a b: Merge the set containing a with the set containing b.</p>
                <p>1 a b: Check if a and b belong to the same set.</p>
                <h4>Input</h4>
                <p>The first line contains n and m. m is the number of operations. From the second line, each of the m lines contains an operation in the form of 0 a b or 1 a b. (1 &le; n &le; 1,000,000, 1 &le; m &le; 100,000)</p>
                <h4>Output</h4>
                <p>For each operation starting with 1, print "YES" or "NO" on a separate line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>7 8\n0 1 3\n1 1 7\n0 7 6\n1 7 1\n0 3 7\n0 4 2\n0 1 1\n1 1 1</pre></div>
                    <div><strong>Output</strong><pre>NO\nNO\nYES</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ n ≤ 1,000,000</li><li>1 ≤ m ≤ 100,000</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'To manage sets... what if we store each set as a <span class="lang-py"><strong>list</strong></span><span class="lang-cpp"><strong>vector</strong></span>?<br><br>When "0 a b" comes, merge the list containing a with the list containing b.<br>When "1 a b" comes, check if a and b are in the same list!' },
                { title: 'But there\'s a problem with this', content: 'When merging, we have to move all elements from one list to another. If there are k elements, that requires <strong>O(k)</strong> moves...<br><br>With n up to <strong>1,000,000</strong> and m up to <strong>100,000</strong>, we might need to move hundreds of thousands of elements each merge. Way too slow!<br><br>Checking if two elements are in the same set also takes <strong>O(n)</strong> if we have to scan the entire list.' },
                { title: 'What if we try this?', content: 'Instead of lists, use a <strong>tree structure</strong>! Have each element point to a "parent":<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">parent[] array → tree structure</div><div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">parent = [0,1,1,3,1]</div><table style="border-collapse:collapse;font-family:monospace;margin:0 auto;"><tr><td style="padding:2px 8px;border:1px solid var(--bg3);text-align:center;font-size:0.8em;color:var(--text2);">idx</td><td style="padding:2px 8px;border:1px solid var(--bg3);">0</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">2</td><td style="padding:2px 8px;border:1px solid var(--bg3);">3</td><td style="padding:2px 8px;border:1px solid var(--bg3);">4</td></tr><tr><td style="padding:2px 8px;border:1px solid var(--bg3);text-align:center;font-size:0.8em;color:var(--text2);">par</td><td style="padding:2px 8px;border:1px solid var(--bg3);">0</td><td style="padding:2px 8px;border:1px solid var(--bg3);font-weight:700;color:var(--green);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">3</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td></tr></table></div><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">Tree form</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><span style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;">1 (root)</span><div style="display:flex;gap:16px;"><span style="border-left:2px solid var(--text2);height:12px;"></span><span style="border-left:2px solid var(--text2);height:12px;"></span></div><div style="display:flex;gap:12px;"><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">2</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">4</span></div></div></div></div></div>* <strong>find(x)</strong>: Follow parents upward from x to find the root. Same root = same set!<br>* <strong>union(a, b)</strong>: Attach one root as a child of the other. Done!<br><br>Add two optimizations and it becomes nearly <strong>O(1)</strong>:<br>1. <strong>Path compression</strong> - during find, connect every node directly to the root<br>2. <strong>Union by rank</strong> - attach the shorter tree under the taller one' },
                { title: 'Implementation tips', content: 'Since n can be up to 1,000,000, I/O speed matters!<br><br><span class="lang-py">Use <code>sys.stdin.readline</code> for fast input, and if using recursive find, increase <code>sys.setrecursionlimit</code>. Alternatively, implement find iteratively.</span><span class="lang-cpp">Using <code>scanf/printf</code> is fast enough. Make sure array size is 1,000,001. In C++, <code>union</code> is a reserved keyword, so name the function <code>unite</code> instead!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b:\n        return\n    if rank[a] < rank[b]:\n        a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]:\n        rank[a] += 1\n\nn, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)\n\nfor _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")',
                cpp: '#include <cstdio>\n#include <algorithm>\nusing namespace std;\n\nint parent[1000001], rnk[1000001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return;\n    if (rnk[a] < rnk[b]) swap(a, b);\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i <= n; i++) {\n        parent[i] = i;\n        rnk[i] = 0;\n    }\n    while (m--) {\n        int op, a, b;\n        scanf("%d %d %d", &op, &a, &b);\n        if (op == 0) unite(a, b);\n        else printf("%s\\n", find(a) == find(b) ? "YES" : "NO");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Path Compression + Union by Rank',
                description: 'Implement union/find using parent and rank arrays.',
                timeComplexity: 'O(m * α(n))',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'find/union implementation', desc: 'Path compression find + union by rank ensures nearly O(1) operations.', code: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1' },
                        { title: 'Initialize', desc: 'Each node starts as its own parent. Initially all nodes are independent sets.', code: 'n, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)' },
                        { title: 'Process queries', desc: 'op=0 means union, op=1 means check if same set using find.', code: 'for _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")' }
                    ],
                    cpp: [
                        { title: 'find/unite implementation', desc: 'Global arrays + path compression + union by rank.\nIn C++, union is a reserved keyword, so use unite.', code: '#include <cstdio>\n#include <algorithm>\nusing namespace std;\n\nint parent[1000001], rnk[1000001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);  // Path compression\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return;\n    if (rnk[a] < rnk[b]) swap(a, b);  // Union by rank\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n}' },
                        { title: 'Initialize', desc: 'Global arrays, so initialize 0 through n to point to themselves in main.', code: 'int main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i <= n; i++) {\n        parent[i] = i;\n        rnk[i] = 0;\n    }' },
                        { title: 'Process queries', desc: 'op=0 means unite, otherwise compare find values and print YES/NO.', code: '    while (m--) {\n        int op, a, b;\n        scanf("%d %d %d", &op, &a, &b);\n        if (op == 0) unite(a, b);\n        else printf("%s\\n", find(a)==find(b) ? "YES" : "NO");\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return unionFindTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1976', title: 'BOJ 1976 - Let\'s Travel', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1976',
            simIntro: 'Watch how cities are unioned via an adjacency matrix, then the travel plan is verified.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Donghyuk wants to travel between cities. There are N cities, and some pairs are connected. Determine whether a given travel itinerary is possible. Visiting the same city multiple times is allowed.</p>
                <h4>Input</h4>
                <p>The first line contains the number of cities N (N &le; 200). The second line contains the number of cities M in the travel plan (M &le; 1000). The next N lines contain N integers each representing the connectivity between cities: 1 means connected, 0 means not connected. The last line contains the travel plan.</p>
                <h4>Output</h4>
                <p>Print "YES" if the travel plan is possible, "NO" otherwise.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n3\n0 1 0\n1 0 1\n0 1 0\n1 2 3</pre></div>
                    <div><strong>Output</strong><pre>YES</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 ≤ N ≤ 200</li><li>1 ≤ M ≤ 1,000</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'If the travel route is 1->2->3... we could check one by one whether we can go from 1 to 2, then 2 to 3, right?<br><br>Check direct connections in the adjacency matrix, or use <strong>BFS/DFS</strong> to find a path if not directly connected!' },
                { title: 'But there\'s a problem with this', content: 'Wait, if the travel plan visits M cities, we would need to run BFS/DFS each time. Worst case could be <strong>O(M * N^2)</strong>.<br><br>But actually... do we really need to check if we can go "1->2->3 in that exact order"?<br>Re-reading the problem: we can visit the same city multiple times, and the exact path does not matter. So what is the key insight?' },
                { title: 'What if we try this?', content: 'Key observation: As long as all travel cities are in the <strong>same connected component</strong>, the trip is possible!<br><br>If they are connected, we can reach any city from any other. The problem simplifies to:<br><br>1. <strong>union</strong> all connected city pairs from the adjacency matrix<br>2. If all travel cities have the same <strong>find</strong> value, answer is YES!<br><br>N is at most 200, so reading the adjacency matrix and performing unions in O(N^2) is more than fast enough. Clean solution with Union-Find!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        parent[b] = a\n\nN = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1:\n            union(i, j + 1)\n\ncities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")',
                cpp: '#include <cstdio>\nusing namespace std;\n\nint parent[201];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) parent[b] = a;\n}\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    for (int i = 1; i <= N; i++) parent[i] = i;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int v;\n            scanf("%d", &v);\n            if (v == 1) unite(i, j);\n        }\n    }\n\n    int first, city;\n    scanf("%d", &first);\n    bool ok = true;\n    for (int i = 1; i < M; i++) {\n        scanf("%d", &city);\n        if (find(city) != find(first)) ok = false;\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Adjacency Matrix + Union-Find',
                description: 'Union connected cities from the adjacency matrix, then check if all travel cities share the same find value.',
                timeComplexity: 'O(N^2 * α(N))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'find/union implementation', desc: 'Path compression flattens the tree, making find operations fast.', code: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b: parent[b] = a' },
                        { title: 'Input and adjacency matrix union', desc: 'Find cells with value 1 in the adjacency matrix and union those city pairs. Directly connected cities become part of the same set.', code: 'N = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1: union(i, j + 1)' },
                        { title: 'Check travel feasibility', desc: 'If all travel cities have the same find value, they are in the same connected component, so travel is possible.', code: 'cities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")' }
                    ],
                    cpp: [
                        { title: 'find/unite implementation', desc: 'With at most 200 cities, the array is small. Path compression alone is sufficient.', code: '#include <cstdio>\nusing namespace std;\n\nint parent[201];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) parent[b] = a;\n}' },
                        { title: 'Input and adjacency matrix unite', desc: 'Read the N*N adjacency matrix. For each cell with value 1, unite the corresponding city pair into the same set.', code: 'int main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    for (int i = 1; i <= N; i++) parent[i] = i;\n\n    for (int i = 1; i <= N; i++)\n        for (int j = 1; j <= N; j++) {\n            int v; scanf("%d", &v);\n            if (v == 1) unite(i, j);\n        }' },
                        { title: 'Check travel feasibility', desc: 'Compare each travel city root with the first city root. If any differs, answer is NO.', code: '    int first, city;\n    scanf("%d", &first);\n    bool ok = true;\n    for (int i = 1; i < M; i++) {\n        scanf("%d", &city);\n        if (find(city) != find(first)) ok = false;\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}' }
                    ]
                },
                get templates() { return unionFindTopic.problems[1].templates; }
            }]
        },

        // ===== Stage 2: Union-Find Applications =====
        {
            id: 'lc-200', title: 'LeetCode 200 - Number of Islands', difficulty: 'medium',
            link: 'https://leetcode.com/problems/number-of-islands/',
            simIntro: 'Watch how adjacent land cells are unioned on a grid to count islands.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an m x n 2D binary grid map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>m == grid.length</li><li>n == grid[i].length</li><li>1 &lt;= m, n &lt;= 300</li><li>grid[i][j] is '0' or '1'</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'To find islands in a grid... when we encounter a \'1\' cell, we could <strong>BFS or DFS</strong> to mark all connected \'1\' cells as visited, right?<br><br>Number of times we start a search = number of islands! This is the classic graph traversal pattern.' },
                { title: 'But there is another way', content: 'BFS/DFS works, but we can also solve this with <strong>Union-Find</strong>!<br><br>Think about it: grouping adjacent \'1\' cells into "the same group" is exactly a union operation.<br>Start with each \'1\' cell as an independent island, then union adjacent \'1\' cells to merge islands!' },
                { title: 'What if we try this?', content: 'Concrete approach:<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">2D → 1D index conversion (cols=5)</div><div style="display:flex;gap:2px;justify-content:center;flex-wrap:wrap;font-family:monospace;"><div style="display:flex;gap:2px;"><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">0</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">1</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">2</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">3</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">4</span></div><div style="display:flex;gap:2px;"><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">5</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">6</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">7</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">8</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">9</span></div></div><div style="text-align:center;margin-top:6px;color:var(--text2);font-size:0.85em;">(r,c) → r*5+c: (1,0)→5, (1,1)→6</div><div style="text-align:center;margin-top:4px;color:var(--green);font-weight:600;">Green cells union together → one island!</div></div>1. Convert 2D coordinates (r, c) to a <strong>1D index</strong> via <code>r * cols + c</code> (for the parent array!)<br>2. Initial island count = total number of \'1\' cells<br>3. Scan all \'1\' cells and union with <strong>right/down</strong> neighbors that are also \'1\'<br>4. Each successful union (merging two different sets) <strong>decreases island count by 1</strong><br><br>Why only right/down? Left/up were already checked in previous iterations, avoiding duplicates!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">In Python, initialize with <code>parent = list(range(rows * cols))</code> and have union return <code>True/False</code> to cleanly handle count decrements!</span><span class="lang-cpp">In C++, use <code>iota(parent.begin(), parent.end(), 0)</code> to initialize 0,1,2,... in one call! Make unite return <code>bool</code> so you can cleanly do count-- on success.</span>' }
            ],
            templates: {
                python: 'class Solution:\n    def numIslands(self, grid):\n        if not grid:\n            return 0\n        rows, cols = len(grid), len(grid[0])\n        parent = list(range(rows * cols))\n        rank = [0] * (rows * cols)\n\n        def find(x):\n            while parent[x] != x:\n                parent[x] = parent[parent[x]]\n                x = parent[x]\n            return x\n\n        def union(a, b):\n            a, b = find(a), find(b)\n            if a == b:\n                return False\n            if rank[a] < rank[b]:\n                a, b = b, a\n            parent[b] = a\n            if rank[a] == rank[b]:\n                rank[a] += 1\n            return True\n\n        count = sum(grid[r][c] == \'1\'\n                     for r in range(rows)\n                     for c in range(cols))\n\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == \'1\':\n                    idx = r * cols + c\n                    for dr, dc in [(0, 1), (1, 0)]:\n                        nr, nc = r + dr, c + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == \'1\':\n                            if union(idx, nr * cols + nc):\n                                count -= 1\n        return count',
                cpp: 'class Solution {\npublic:\n    vector<int> parent, rnk;\n\n    int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rnk[a] < rnk[b]) swap(a, b);\n        parent[b] = a;\n        if (rnk[a] == rnk[b]) rnk[a]++;\n        return true;\n    }\n\n    int numIslands(vector<vector<char>>& grid) {\n        int rows = grid.size(), cols = grid[0].size();\n        parent.resize(rows * cols);\n        rnk.resize(rows * cols, 0);\n        iota(parent.begin(), parent.end(), 0);\n\n        int count = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == \'1\') count++;\n\n        int dr[] = {0, 1}, dc[] = {1, 0};\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] == \'1\') {\n                    for (int d = 0; d < 2; d++) {\n                        int nr = r + dr[d], nc = c + dc[d];\n                        if (nr < rows && nc < cols && grid[nr][nc] == \'1\')\n                            if (unite(r * cols + c, nr * cols + nc))\n                                count--;\n                    }\n                }\n            }\n        }\n        return count;\n    }\n};'
            },
            solutions: [{
                approach: 'Counting Islands with Union-Find',
                description: 'Union adjacent \'1\' cells and decrement count on successful unions to get the island count.',
                timeComplexity: 'O(m * n * α(m*n))',
                spaceComplexity: 'O(m * n)',
                codeSteps: {
                    python: [
                        { title: 'find/union implementation', desc: 'union returns True on success, used to decrement island count.', code: 'parent = list(range(rows * cols))\nrank = [0] * (rows * cols)\n\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return False\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1\n    return True' },
                        { title: 'Calculate initial island count', desc: 'Initially assume every \'1\' cell is an independent island and count the total.', code: 'count = sum(grid[r][c] == \'1\'\n             for r in range(rows)\n             for c in range(cols))' },
                        { title: 'Union adjacent cells', desc: 'Checking only right/down avoids duplicate processing of pairs. Decrement island count on successful union.', code: 'for r in range(rows):\n    for c in range(cols):\n        if grid[r][c] == \'1\':\n            idx = r * cols + c\n            for dr, dc in [(0,1),(1,0)]:\n                nr, nc = r+dr, c+dc\n                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==\'1\':\n                    if union(idx, nr*cols+nc):\n                        count -= 1\nreturn count' }
                    ],
                    cpp: [
                        { title: 'find/unite implementation', desc: 'Class members parent/rnk vectors.\niota initializes 0,1,2,...', code: 'vector<int> parent, rnk;\n\nint find(int x) {\n    while (parent[x] != x) {\n        parent[x] = parent[parent[x]];  // Path compression\n        x = parent[x];\n    }\n    return x;\n}\n\nbool unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return false;\n    if (rnk[a] < rnk[b]) swap(a, b);\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n    return true;  // union success -> island count -1\n}' },
                        { title: 'Calculate initial island count', desc: 'Use iota to initialize parent as 0,1,2,..., and set initial island count to number of \'1\' cells.', code: 'int rows = grid.size(), cols = grid[0].size();\nparent.resize(rows * cols);\nrnk.resize(rows * cols, 0);\niota(parent.begin(), parent.end(), 0);\n\nint count = 0;\nfor (int r = 0; r < rows; r++)\n    for (int c = 0; c < cols; c++)\n        if (grid[r][c] == \'1\') count++;' },
                        { title: 'Unite adjacent cells', desc: 'Only check right (0,1) and down (1,0) directions. On successful unite, two islands merge, so count decreases.', code: 'int dr[] = {0, 1}, dc[] = {1, 0};\nfor (int r = 0; r < rows; r++)\n    for (int c = 0; c < cols; c++)\n        if (grid[r][c] == \'1\')\n            for (int d = 0; d < 2; d++) {\n                int nr = r+dr[d], nc = c+dc[d];\n                if (nr<rows && nc<cols && grid[nr][nc]==\'1\')\n                    if (unite(r*cols+c, nr*cols+nc))\n                        count--;\n            }\nreturn count;' }
                    ]
                },
                get templates() { return unionFindTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-4195', title: 'BOJ 4195 - Friend Network', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/4195',
            simIntro: 'Watch how name-to-number mapping and a size array track network size.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Minhyuk built a social networking site. Whenever two people become friends, output the number of people in their combined friend network. Friendship is transitive (if A-B are friends and B-C are friends, then A-C are in the same network).</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases. For each test case, the first line contains the number of friend relationships F (1 &le; F &le; 100,000). The next F lines each contain a friendship represented by two user IDs, which are strings of up to 20 alphanumeric characters.</p>
                <h4>Output</h4>
                <p>Whenever a friendship is formed, print the number of people in their combined friend network.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2\n3\nFred Barney\nBarney Betty\nBetty Wilma\n3\nFred Barney\nBetty Wilma\nBarney Betty</pre></div>
                    <div><strong>Output</strong><pre>2\n3\n4\n2\n2\n4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul><li>1 &lt;= T</li><li>1 &lt;= F &lt;= 100,000</li><li>Names are at most 20 alphabetic characters</li></ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Every time two people become friends, we need to output the network size. Union-Find seems perfect for merging friend relationships!<br><br>But... the names are strings like "Fred" and "Barney". How do we put them in Union-Find when the parent array uses numeric indices?' },
                { title: 'But there\'s a problem with this', content: 'Converting names to numbers is easy with <span class="lang-py">a <strong>dictionary (dict)</strong></span><span class="lang-cpp">a <strong>hash map (unordered_map)</strong></span>! Assign a number to each new name as it appears.<br><br>But there is another issue. We can do union, but how do we know the <strong>network size</strong> after merging?<br>Counting all members in the same set each time is <strong>O(n)</strong>. With F up to 100,000, that is way too slow!' },
                { title: 'What if we try this?', content: 'In addition to the parent array, maintain a <strong>size array</strong>!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">union(A, B) with size tracking</div><div style="display:flex;gap:20px;justify-content:center;align-items:flex-end;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">Before union</div><div style="display:flex;gap:16px;justify-content:center;"><div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;font-weight:600;">A</div><div style="font-size:0.78em;color:var(--text2);">size=2</div></div><div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;font-weight:600;">B</div><div style="font-size:0.78em;color:var(--text2);">size=3</div></div></div></div><div style="font-size:1.2em;color:var(--text2);">→</div><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">After union</div><div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;">B (root)</div><div style="font-size:0.78em;color:var(--green);font-weight:600;">size = 2 + 3 = 5</div><div style="border-left:2px solid var(--text2);height:8px;"></div><div style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">A</div></div></div></div></div>* Initially every person has <code>size = 1</code> (just themselves)<br>* During union, attach one root under the other and do <code>size[new_root] += size[attached_root]</code><br>* Since size is always stored at the <strong>root only</strong>, after union <code>size[find(a)]</code> is the answer!<br><br>This gives us size in O(1). Total time complexity is <strong>O(F * alpha(F))</strong>, which is nearly linear!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">In Python, using dictionaries for parent and size naturally connects with name mapping. Use a <code>name_to_id</code> dict for name-to-number conversion, then <code>parent[idx] = idx</code>, <code>size[idx] = 1</code> for initialization. Clean!</span><span class="lang-cpp">In C++, use <code>unordered_map&lt;string, int&gt;</code> for name mapping, with global arrays <code>parent[]</code> and <code>sz[]</code>. Do not forget to reset idx to 0 for each test case!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]:\n            a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]\n\nT = int(input())\nfor _ in range(T):\n    F = int(input())\n    parent = {}\n    size = {}\n    name_to_id = {}\n    idx = 0\n\n    for _ in range(F):\n        a, b = input().split()\n        if a not in name_to_id:\n            name_to_id[a] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        if b not in name_to_id:\n            name_to_id[b] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        print(union(name_to_id[a], name_to_id[b]))',
                cpp: '#include <cstdio>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint parent[200001], sz[200001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nint unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) {\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    return sz[a];\n}\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int F;\n        scanf("%d", &F);\n        unordered_map<string, int> nameToId;\n        int idx = 0;\n        char a[21], b[21];\n\n        for (int i = 0; i < F; i++) {\n            scanf("%s %s", a, b);\n            string sa(a), sb(b);\n            if (nameToId.find(sa) == nameToId.end()) {\n                nameToId[sa] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            if (nameToId.find(sb) == nameToId.end()) {\n                nameToId[sb] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            printf("%d\\n", unite(nameToId[sa], nameToId[sb]));\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Name Mapping + Size Tracking Union-Find',
                description: 'Map names to numbers, then update a size array during union to output network size.',
                timeComplexity: 'O(F * α(F))',
                spaceComplexity: 'O(F)',
                codeSteps: {
                    python: [
                        { title: 'find/union with size', desc: 'Use a size array instead of rank to directly track set size during union.', code: 'def find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]: a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]' },
                        { title: 'Name-to-number mapping', desc: 'Map string names to integers using a dict. Assign a new number for each new name and initialize parent/size.', code: 'name_to_id = {}\nidx = 0\nfor name in [a, b]:\n    if name not in name_to_id:\n        name_to_id[name] = idx\n        parent[idx] = idx\n        size[idx] = 1\n        idx += 1' },
                        { title: 'Output size after union', desc: 'Since union returns the root size, just print it directly.', code: 'print(union(name_to_id[a], name_to_id[b]))' }
                    ],
                    cpp: [
                        { title: 'find/unite with size', desc: 'Track set size with the sz array.\nunite returns the root size after merging.', code: 'int parent[200001], sz[200001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nint unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) {\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    return sz[a];  // merged set size\n}' },
                        { title: 'Name-to-number mapping', desc: 'Map with unordered_map<string,int>.\nAssign number + initialize on new name.', code: 'unordered_map<string, int> nameToId;\nint idx = 0;\n// For each name:\nif (nameToId.find(name) == nameToId.end()) {\n    nameToId[name] = idx;\n    parent[idx] = idx;\n    sz[idx] = 1;\n    idx++;\n}' },
                        { title: 'Output size after unite', desc: 'unite returns the merged set sz, so print it directly with printf.', code: 'printf("%d\\n", unite(nameToId[a], nameToId[b]));' }
                    ]
                },
                get templates() { return unionFindTopic.problems[3].templates; }
            }]
        }
    ]
};

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.unionfind = unionFindTopic;
