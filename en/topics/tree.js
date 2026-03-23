// ===== Tree Topic Module =====
var treeTopic = {
    id: 'tree',
    title: 'Tree',
    icon: '🌳',
    category: 'Advanced (Gold~Platinum)',
    order: 15,
    description: 'Learn about trees that represent hierarchical structures and various traversal methods',
    relatedNote: 'There are also advanced tree data structures such as Binary Search Trees (BST), Segment Trees, AVL Trees, and Red-Black Trees.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'lc-104':   { type: 'DFS/Recursion', color: 'var(--accent)', vizMethod: '_renderVizMaxDepth',      suffix: '-depth' },
        'lc-226':   { type: 'Tree Transform', color: 'var(--green)',  vizMethod: '_renderVizInvert',        suffix: '-invert' },
        'lc-102':   { type: 'BFS',         color: '#e17055',       vizMethod: '_renderVizLevelOrder',    suffix: '-level' },
        'boj-1991': { type: 'Tree Traversal', color: '#6c5ce7',       vizMethod: '_renderVizTreeTraversal', suffix: '-order' }
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
            sim:     { intro: prob.simIntro || 'See how the tree actually works in action.', icon: '🎮' },
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
                <h2>🌳 Tree</h2>\
                <p class="hero-sub">Learn about the tree data structure for representing hierarchical structures and traversal methods</p>\
            </div>\
\
            <!-- 1. What is a Tree? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> What is a Tree?</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of your <strong>family tree</strong>!<br><br>\
                    At the very top is your <strong>grandfather (root)</strong>, and below are your <strong>father and uncle (child nodes)</strong>.<br>\
                    Below your father are <strong>you and your sibling (grandchild nodes)</strong>.<br>\
                    Anyone with no one below them is a <strong>leaf node</strong>.<br><br>\
                    This structure that branches out from top to bottom is exactly what a <strong>tree</strong> is!<br>\
                    Folder structures, org charts, and the HTML DOM are all trees.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="2"/><line x1="27" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>Node and Edge</h3>\
                        <p>A node is a point that holds data, and an edge is a line connecting nodes.<br>If there are N nodes, there are exactly <strong>N-1 edges</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="#e17055" stroke="currentColor" stroke-width="2"/><text x="24" y="11" text-anchor="middle" font-size="8" fill="white">R</text><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Root</h3>\
                        <p>The node at the <strong>very top</strong> of the tree.<br>It is the only node with no parent.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="42" r="4" fill="#00b894" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="24" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="31" x2="9" y2="38" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="31" x2="19" y2="38" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Leaf</h3>\
                        <p>A node with no children is called a <strong>leaf</strong> node.<br>These are the terminal nodes of the tree.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="20" width="32" height="24" rx="4" fill="none" stroke="#0984e3" stroke-width="2" stroke-dasharray="4,2"/><circle cx="14" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="30" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="42" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="12" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="33" x2="9" y2="39" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="33" x2="19" y2="39" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Subtree</h3>\
                        <p>A <strong>subtree</strong> rooted at a given node.<br>This is key when leveraging the recursive nature of trees!</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How many edges are in a tree with 7 nodes?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>6</strong>!<br>\
                        In a tree with N nodes, there are always <strong>N-1 edges</strong>.<br>\
                        This is because every node except the root is connected to exactly one parent.\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Tree Terminology Check</div>\
                    <div class="concept-demo-body">\
                        <div id="tree-demo-terms-info" style="text-align:center;padding:0.6rem 1rem;margin-bottom:0.8rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.9rem;line-height:1.7;min-height:2.4em;">👆 Click a node to check its terminology!</div>\
                        <svg id="tree-demo-terms-svg" viewBox="0 0 440 260" width="100%" style="max-width:440px;display:block;margin:0 auto;cursor:pointer;"></svg>\
                    </div>\
                    <div class="concept-demo-msg" id="tree-demo-terms-msg">Click a node to see its parent, children, depth, height, and whether it is a leaf. Try clicking all 7 nodes!</div>\
                </div>\
            </div>\
\
            <!-- 2. Binary Tree -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> Binary Tree</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of a <strong>"Yes/No quiz"</strong>!<br><br>\
                    "Is it an animal?" -> Yes -> "Can it fly?" -> No -> "Does it have 4 legs?" -> ...<br>\
                    At each question, you branch into <strong>left (Yes) or right (No)</strong>, two paths.<br><br>\
                    A tree where each node has <strong>at most 2 children</strong> is called a <strong>binary tree</strong>!<br>\
                    It is the most commonly used tree form in algorithms.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="14" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="34" cy="30" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/><line x1="21" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="2"/><line x1="27" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>Binary Tree</h3>\
                        <p>Each node has <strong>at most 2</strong> children (left, right).<br>This is the most basic tree form.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.7"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.7"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.7"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.7"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Complete Binary Tree</h3>\
                        <p>All levels are fully filled except possibly the last,<br>which is filled from <strong>left to right</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="6" r="4" fill="currentColor" opacity="0.8"/><circle cx="14" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="34" cy="20" r="4" fill="currentColor" opacity="0.8"/><circle cx="8" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="20" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="28" cy="34" r="4" fill="currentColor" opacity="0.8"/><circle cx="40" cy="34" r="4" fill="currentColor" opacity="0.8"/><line x1="21" y1="9" x2="16" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="9" x2="32" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="23" x2="9" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="23" x2="19" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="31" y1="23" x2="29" y2="31" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="23" x2="39" y2="31" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Full (Perfect) Binary Tree</h3>\
                        <p>A tree where all levels are <strong>completely</strong> filled.<br>With height h, node count = <strong>2^(h+1) - 1</strong></p>\
                    </div>\
                </div>\
\
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">Why do tree types matter?</strong><br>\
                    <strong>Complete Binary Tree</strong>: Since it fills from left to right with no gaps, it can be <strong>stored in an array</strong>. This is the foundation of the <strong>Heap</strong>! (children of index i = 2i+1, 2i+2)<br>\
                    <strong>Balanced Tree</strong>: The height stays at <strong>O(log n)</strong>. Even with 1 million nodes, the height is about 20 — so search/insert is fast.<br>\
                    <strong>Skewed Tree</strong>: If it leans to one side, it is essentially a <strong>linked list</strong>. The height becomes O(n), making all operations slow.<br>\
                    <span style="color:var(--accent);font-weight:600;">Key point:</span> Whether the tree is balanced or not is the key to performance! Balanced = O(log n), skewed = degrades to O(n).\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Binary tree node definition\n\
class TreeNode:\n\
    def __init__(self, val=0, left=None, right=None):\n\
        self.val = val\n\
        self.left = left    # left child\n\
        self.right = right  # right child\n\
\n\
# Max nodes in a binary tree of height h: 2^(h+1) - 1\n\
# Height of a complete binary tree with N nodes: O(log N)\n\
# e.g.) N = 1,000,000 -> height ~ 20 (very short!)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Binary tree node definition\n\
struct TreeNode {\n\
    int val;\n\
    TreeNode *left, *right;\n\
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}\n\
};\n\
\n\
// Max nodes in a binary tree of height h: 2^(h+1) - 1\n\
// Height of a complete binary tree with N nodes: O(log N)\n\
// e.g.) N = 1,000,000 -> height ~ 20 (very short!)</code></pre></div></span>\
                <div style="margin-top:8px;"><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/nullptr" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: nullptr ↗</a></span></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How many nodes are in a perfect binary tree of height 3? (root height = 0)</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>15</strong>!<br>\
                        Number of nodes in a perfect binary tree of height h = 2^(h+1) - 1 = 2^4 - 1 = <strong>15</strong><br>\
                        Level 0: 1, Level 1: 2, Level 2: 4, Level 3: 8 -> Total: 15.\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — BST Node Insertion</div>\
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:0.5rem 0;">\
                        <input type="number" id="tree-demo-bst-input" value="6" min="1" max="99" style="width:70px;padding:6px 10px;border:1.5px solid var(--bg3);border-radius:8px;font-size:0.95rem;background:var(--bg);color:var(--text);text-align:center;">\
                        <button class="concept-demo-btn" id="tree-demo-bst-insert">➕ Start Insert</button>\
                        <button class="concept-demo-btn green" id="tree-demo-bst-reset">↺ Reset</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div id="tree-demo-bst-desc" style="text-align:center;padding:0.6rem 1rem;margin-bottom:0.8rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.9rem;line-height:1.7;min-height:2.4em;">Enter a value and click "Start Insert"!</div>\
                        <svg id="tree-demo-bst-svg" viewBox="0 0 500 280" width="100%" style="max-width:500px;display:block;margin:0 auto;"></svg>\
                    </div>\
                    <div class="concept-demo-btns" style="justify-content:center;display:none;" id="tree-demo-bst-step-btns">\
                        <button class="concept-demo-btn" id="tree-demo-bst-next">Next Comparison →</button>\
                    </div>\
                    <div class="concept-demo-msg" id="tree-demo-bst-msg">In a BST (Binary Search Tree), when inserting a value: if it is smaller than the current node, go left; if larger, go right. Follow the comparison path step by step!</div>\
                </div>\
            </div>\
\
            <!-- 3. Tree Traversal -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> Tree Traversal</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Think of <strong>visiting an art museum</strong>!<br><br>\
                    The order you visit each room (node) determines the method.<br>\
                    <strong>Preorder</strong>: <strong>View the art first</strong> upon entering a room, then go left room -> right room.<br>\
                    <strong>Inorder</strong>: Visit the left room first, <strong>come back and view the art</strong>, then go right.<br>\
                    <strong>Postorder</strong>: Visit left and right rooms first, then <strong>view the art last</strong>.<br>\
                    <strong>Level Order (BFS)</strong>: View all rooms on floor 1, then floor 2, floor 3... in order.\
                </div>\
\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="var(--accent)" opacity="0.8"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Preorder Traversal</h3>\
                        <p><strong>Root -> Left -> Right</strong><br>Visit the parent first.<br>Used for tree copying and serialization.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--green);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">2</text><circle cx="14" cy="30" r="6" fill="var(--green)" opacity="0.8"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="white">1</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="currentColor">3</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Inorder Traversal</h3>\
                        <p><strong>Left -> Root -> Right</strong><br>In a BST, this outputs values in <strong>sorted order</strong>!<br>The most commonly used traversal.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--yellow);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="24" y="13" text-anchor="middle" font-size="8" fill="currentColor">3</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="33" text-anchor="middle" font-size="8" fill="currentColor">1</text><circle cx="34" cy="30" r="6" fill="var(--yellow)" opacity="0.8"/><text x="34" y="33" text-anchor="middle" font-size="8" fill="white">2</text><line x1="20" y1="15" x2="16" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="32" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Postorder Traversal</h3>\
                        <p><strong>Left -> Right -> Root</strong><br>Process children first, then the parent.<br>Used for tree deletion and expression evaluation.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--red);">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="5" fill="var(--red)" opacity="0.7"/><text x="24" y="11" text-anchor="middle" font-size="7" fill="white">1</text><circle cx="14" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="14" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="34" cy="24" r="5" fill="var(--red)" opacity="0.5"/><text x="34" y="27" text-anchor="middle" font-size="7" fill="white">2</text><circle cx="8" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="8" y="43" text-anchor="middle" font-size="7" fill="white">3</text><circle cx="20" cy="40" r="5" fill="var(--red)" opacity="0.3"/><text x="20" y="43" text-anchor="middle" font-size="7" fill="white">3</text><line x1="20" y1="12" x2="16" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="12" x2="32" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="28" x2="9" y2="36" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="28" x2="19" y2="36" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Level Order (BFS)</h3>\
                        <p><strong>Level 0 -> Level 1 -> Level 2 -> ...</strong><br>Uses a Queue.<br>Used when level-by-level processing is needed.</p>\
                    </div>\
                </div>\
\
                <div style="margin-top:1.5rem;overflow-x:auto;">\
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">\
                        <thead><tr style="background:var(--bg2);">\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">Traversal</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">Visit Order</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">Data Structure</th>\
                            <th style="padding:10px 12px;text-align:left;border-bottom:2px solid var(--bg3);font-weight:700;">Common Use</th>\
                        </tr></thead>\
                        <tbody>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--accent);">Preorder</td>\
                                <td style="padding:10px 12px;">Root -> L -> R</td>\
                                <td style="padding:10px 12px;">Stack/Recursion</td>\
                                <td style="padding:10px 12px;">Tree copy, serialization</td>\
                            </tr>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--green);">Inorder</td>\
                                <td style="padding:10px 12px;">L -> Root -> R</td>\
                                <td style="padding:10px 12px;">Stack/Recursion</td>\
                                <td style="padding:10px 12px;">BST sorted output</td>\
                            </tr>\
                            <tr style="border-bottom:1px solid var(--bg3);">\
                                <td style="padding:10px 12px;font-weight:600;color:var(--yellow);">Postorder</td>\
                                <td style="padding:10px 12px;">L -> R -> Root</td>\
                                <td style="padding:10px 12px;">Stack/Recursion</td>\
                                <td style="padding:10px 12px;">Tree deletion, expression eval</td>\
                            </tr>\
                            <tr>\
                                <td style="padding:10px 12px;font-weight:600;color:var(--red);">Level Order (BFS)</td>\
                                <td style="padding:10px 12px;">Level 0->1->2...</td>\
                                <td style="padding:10px 12px;">Queue</td>\
                                <td style="padding:10px 12px;">Level-by-level processing</td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
\
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">DFS (Pre/In/Postorder) vs BFS (Level Order) — When to use which?</strong><br>\
                    <span style="color:var(--accent);font-weight:600;">DFS</span>: When you need to explore deep to the leaves — height calculation, path sum, subtree checks, etc.<br>\
                    <span style="color:var(--red);font-weight:600;">BFS</span>: When you need to process level by level — level order output, minimum depth, level averages, etc.<br>\
                    <span style="color:var(--text2);">DFS uses a stack (including the recursion call stack), BFS uses a queue. If the problem is about "depth/path", think DFS first. If it is about "level/breadth", think BFS first!</span>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Preorder Traversal: Root -> Left -> Right\n\
def preorder(node):\n\
    if node is None:\n\
        return\n\
    print(node.val, end=\' \')  # Root first!\n\
    preorder(node.left)\n\
    preorder(node.right)\n\
\n\
# Inorder Traversal: Left -> Root -> Right\n\
def inorder(node):\n\
    if node is None:\n\
        return\n\
    inorder(node.left)\n\
    print(node.val, end=\' \')  # In the middle!\n\
    inorder(node.right)\n\
\n\
# Postorder Traversal: Left -> Right -> Root\n\
def postorder(node):\n\
    if node is None:\n\
        return\n\
    postorder(node.left)\n\
    postorder(node.right)\n\
    print(node.val, end=\' \')  # Last!\n\
\n\
# Level Order Traversal (BFS): using a queue\n\
from collections import deque\n\
def level_order(root):\n\
    if not root:\n\
        return\n\
    queue = deque([root])\n\
    while queue:\n\
        node = queue.popleft()\n\
        print(node.val, end=\' \')\n\
        if node.left:  queue.append(node.left)\n\
        if node.right: queue.append(node.right)</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Preorder Traversal: Root -> Left -> Right\n\
void preorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // Root first!\n\
    preorder(node-&gt;left);\n\
    preorder(node-&gt;right);\n\
}\n\
\n\
// Inorder Traversal: Left -> Root -> Right\n\
void inorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    inorder(node-&gt;left);\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // In the middle!\n\
    inorder(node-&gt;right);\n\
}\n\
\n\
// Postorder Traversal: Left -> Right -> Root\n\
void postorder(TreeNode* node) {\n\
    if (node == nullptr) return;\n\
    postorder(node-&gt;left);\n\
    postorder(node-&gt;right);\n\
    cout &lt;&lt; node-&gt;val &lt;&lt; " ";  // Last!\n\
}\n\
\n\
// Level Order Traversal (BFS): using a queue\n\
#include &lt;queue&gt;\n\
void level_order(TreeNode* root) {\n\
    if (!root) return;\n\
    queue&lt;TreeNode*&gt; q;\n\
    q.push(root);\n\
    while (!q.empty()) {\n\
        TreeNode* node = q.front(); q.pop();\n\
        cout &lt;&lt; node-&gt;val &lt;&lt; " ";\n\
        if (node-&gt;left)  q.push(node-&gt;left);\n\
        if (node-&gt;right) q.push(node-&gt;right);\n\
    }\n\
}</code></pre></div></span>\
                <div style="margin-top:8px;"><span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: std::queue ↗</a></span></div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">What is the inorder traversal result of binary tree [1, 2, 3, 4, 5, 6, 7]? (1 is root, 2/3 are children, 4/5/6/7 are grandchildren)</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Inorder (Left -> Root -> Right) result: <strong>4 2 5 1 6 3 7</strong><br><br>\
                        Visit the left subtree (4->2->5) first, then root (1), then right subtree (6->3->7).<br>\
                        Preorder: 1 2 4 5 3 6 7 | Postorder: 4 5 2 6 7 3 1\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — Preorder Traversal Step by Step</div>\
                    <div class="concept-demo-body">\
                        <div id="tree-demo-preorder-desc" style="text-align:center;padding:0.6rem 1rem;margin-bottom:0.8rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.9rem;line-height:1.7;min-height:2.4em;">▶ Click "Next Visit" to follow the preorder traversal!</div>\
                        <svg id="tree-demo-preorder-svg" viewBox="0 0 440 240" width="100%" style="max-width:440px;display:block;margin:0 auto;"></svg>\
                        <div id="tree-demo-preorder-result" style="text-align:center;margin-top:0.8rem;font-size:0.95rem;font-weight:600;color:var(--text2);min-height:1.5em;">Visit order: <span id="tree-demo-preorder-order" style="color:var(--accent);"></span></div>\
                    </div>\
                    <div class="concept-demo-btns" style="justify-content:center;">\
                        <button class="concept-demo-btn" id="tree-demo-preorder-next">Next Visit →</button>\
                        <button class="concept-demo-btn green" id="tree-demo-preorder-reset" style="display:none;">↺ Start Over</button>\
                    </div>\
                    <div class="concept-demo-msg" id="tree-demo-preorder-msg">Preorder traversal follows <strong>Root → Left → Right</strong> order. At each node, record it first, then go to the left child. Once the left is done, go right!</div>\
                </div>\
            </div>\
\
            <!-- 4. Tree Usage Patterns -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> Tree Usage Patterns</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="#0984e3" stroke-width="2.5"/><path d="M4 42 L8 36 L12 42" fill="none" stroke="#0984e3" stroke-width="2"/></svg></span></div>\
                        <h3>Finding Depth (DFS)</h3>\
                        <p>Calculate the <strong>depth</strong> from root to leaf using DFS.<br><code>depth(node) = 1 + max(depth(left), depth(right))</code></p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="36" r="4" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="25" x2="19" y2="33" stroke="currentColor" stroke-width="1.5"/><text x="40" y="10" font-size="10" fill="var(--accent)">h=2</text></svg></span></div>\
                        <h3>Maximum Depth</h3>\
                        <p>The distance to the <strong>deepest leaf</strong> of the tree.<br>Recursively take the larger of left/right + 1</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="30" r="5" fill="none" stroke="#e17055" stroke-width="2"/><circle cx="34" cy="30" r="5" fill="none" stroke="#0984e3" stroke-width="2"/><path d="M17 28 L31 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><path d="M31 28 L17 32" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/><line x1="20" y1="14" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="14" x2="32" y2="26" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Invert Tree</h3>\
                        <p>Swap <strong>left and right</strong> at every node!<br>Can be implemented simply with recursion.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="8" r="4" fill="#fdcb6e" stroke="currentColor" stroke-width="2"/><circle cx="14" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="34" cy="22" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="36" r="4" fill="#e17055" stroke="currentColor" stroke-width="2"/><circle cx="40" cy="36" r="4" fill="#0984e3" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="16" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="27" y1="12" x2="32" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="25" x2="9" y2="33" stroke="currentColor" stroke-width="1.5"/><line x1="37" y1="25" x2="39" y2="33" stroke="currentColor" stroke-width="1.5"/><path d="M10 40 L24 12 L38 40" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,2"/></svg></span></div>\
                        <h3>LCA (Lowest Common Ancestor)</h3>\
                        <p>Find the <strong>closest common ancestor</strong> of two nodes.<br>Recursively search both subtrees.</p>\
                    </div>\
                </div>\
\
                <div style="margin-top:1.2rem;padding:1.2rem 1.5rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.92rem;line-height:1.75;">\
                    <strong style="font-size:0.95rem;">Why does this work?</strong><br><br>\
                    <strong style="color:var(--accent);">maxDepth: Why <code>1 + max(left, right)</code>?</strong><br>\
                    The current node occupies <strong>1 level</strong>, and the <strong>deeper side</strong> of left/right child subtrees determines the total depth. When we reach a leaf node (no children), we return 0, and add 1 as we go back up.<br><br>\
                    <strong style="color:var(--accent);">invertTree: Why is recursion natural here?</strong><br>\
                    The small problem of "inverting a subtree" has the <strong>exact same structure</strong> as the big problem of "inverting the entire tree". Swap left and right at the current node, then invert each subtree recursively. That is it! This is the essence of recursion — <strong>calling itself with smaller input</strong>.<br><br>\
                    <strong style="color:var(--accent);">LCA: Why is the current node the LCA when both sides are non-null?</strong><br>\
                    Finding p (or q) in the left subtree and q (or p) in the right subtree means the two nodes are in <strong>different subtrees</strong>. Then the current node is the <strong>lowest (closest) ancestor</strong> that contains both nodes.\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Find maximum depth\n\
def maxDepth(root):\n\
    if not root:\n\
        return 0\n\
    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n\
\n\
# Invert tree\n\
def invertTree(root):\n\
    if not root:\n\
        return None\n\
    root.left, root.right = root.right, root.left  # Swap left and right!\n\
    invertTree(root.left)\n\
    invertTree(root.right)\n\
    return root\n\
\n\
# LCA (Lowest Common Ancestor) - Binary Tree\n\
def lowestCommonAncestor(root, p, q):\n\
    if not root or root == p or root == q:\n\
        return root\n\
    left = lowestCommonAncestor(root.left, p, q)\n\
    right = lowestCommonAncestor(root.right, p, q)\n\
    if left and right:   # Found in both sides -> current node is LCA\n\
        return root\n\
    return left or right  # Found in only one side</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Find maximum depth\n\
int maxDepth(TreeNode* root) {\n\
    if (!root) return 0;\n\
    return 1 + max(maxDepth(root-&gt;left), maxDepth(root-&gt;right));\n\
}\n\
\n\
// Invert tree\n\
TreeNode* invertTree(TreeNode* root) {\n\
    if (!root) return nullptr;\n\
    swap(root-&gt;left, root-&gt;right);  // Swap left and right!\n\
    invertTree(root-&gt;left);\n\
    invertTree(root-&gt;right);\n\
    return root;\n\
}\n\
\n\
// LCA (Lowest Common Ancestor) - Binary Tree\n\
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n\
    if (!root || root == p || root == q)\n\
        return root;\n\
    TreeNode* left = lowestCommonAncestor(root-&gt;left, p, q);\n\
    TreeNode* right = lowestCommonAncestor(root-&gt;right, p, q);\n\
    if (left &amp;&amp; right) return root;  // Found in both sides -> current node is LCA\n\
    return left ? left : right;       // Found in only one side\n\
}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In tree [1, 2, 3, 4, 5], what is the LCA (Lowest Common Ancestor) of nodes 4 and 5?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>Node 2</strong>!<br>\
                        Node 4 is the left child of 2, and node 5 is the right child of 2.<br>\
                        Since one is found in each subtree of node 2, node 2 is the LCA.\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">🎮 Try It — DFS Depth Search (Stack Visualization)</div>\
                    <div class="concept-demo-body">\
                        <div id="tree-demo-dfs-desc" style="text-align:center;padding:0.6rem 1rem;margin-bottom:0.8rem;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:8px;font-size:0.9rem;line-height:1.7;min-height:2.4em;">▶ Click "Next Step" to see how DFS works with a stack!</div>\
                        <div style="display:flex;gap:2rem;align-items:flex-start;justify-content:center;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:240px;max-width:320px;">\
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:0.5rem;">Tree</div>\
                                <svg id="tree-demo-dfs-svg" viewBox="0 0 320 220" width="100%" style="display:block;margin:0 auto;"></svg>\
                            </div>\
                            <div style="min-width:120px;max-width:160px;">\
                                <div style="text-align:center;font-weight:600;font-size:0.85rem;color:var(--text2);margin-bottom:0.5rem;">Stack</div>\
                                <div id="tree-demo-dfs-stack" style="border:2px solid var(--bg3);border-radius:10px;min-height:180px;padding:0.5rem;display:flex;flex-direction:column-reverse;gap:4px;align-items:center;background:var(--bg2);"></div>\
                            </div>\
                        </div>\
                        <div id="tree-demo-dfs-visited" style="text-align:center;margin-top:0.8rem;font-size:0.95rem;font-weight:600;color:var(--text2);min-height:1.5em;">Visited: <span id="tree-demo-dfs-visited-list" style="color:var(--green);"></span></div>\
                    </div>\
                    <div class="concept-demo-btns" style="justify-content:center;">\
                        <button class="concept-demo-btn" id="tree-demo-dfs-next">Next Step →</button>\
                        <button class="concept-demo-btn green" id="tree-demo-dfs-reset" style="display:none;">↺ Start Over</button>\
                    </div>\
                    <div class="concept-demo-msg" id="tree-demo-dfs-msg">DFS uses a <strong>stack</strong>. It pops a node from the stack and pushes its children. Recursive calls use the call stack internally, so the same principle applies!</div>\
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ============================
        // Common SVG Tree Drawing Helper
        // ============================
        var _svgNS = 'http://www.w3.org/2000/svg';
        function _drawTreeSVG(svg, nodes, opts) {
            var o = opts || {};
            var r = o.r || 22;
            var fontSize = o.fontSize || '14';
            svg.innerHTML = '';
            if (o.edgePairs) {
                o.edgePairs.forEach(function(ep) {
                    var line = document.createElementNS(_svgNS, 'line');
                    line.setAttribute('x1', ep.x1); line.setAttribute('y1', ep.y1);
                    line.setAttribute('x2', ep.x2); line.setAttribute('y2', ep.y2);
                    line.setAttribute('stroke', 'var(--bg3)'); line.setAttribute('stroke-width', '2');
                    line.id = ep.id || '';
                    svg.appendChild(line);
                });
            }
            nodes.forEach(function(n) {
                var g = document.createElementNS(_svgNS, 'g');
                g.id = n.id || '';
                g.style.cursor = o.clickable ? 'pointer' : 'default';
                var circle = document.createElementNS(_svgNS, 'circle');
                circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
                circle.setAttribute('r', r);
                circle.setAttribute('fill', o.nodeColor || 'var(--bg2)');
                circle.setAttribute('stroke', o.strokeColor || 'var(--accent)');
                circle.setAttribute('stroke-width', '2.5');
                circle.setAttribute('class', 'tree-demo-node-circle');
                g.appendChild(circle);
                var text = document.createElementNS(_svgNS, 'text');
                text.setAttribute('x', n.x); text.setAttribute('y', parseFloat(n.y) + 5);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', fontSize); text.setAttribute('font-weight', '700');
                text.setAttribute('fill', o.textColor || 'var(--text)');
                text.setAttribute('pointer-events', 'none');
                text.textContent = n.val;
                g.appendChild(text);
                svg.appendChild(g);
            });
        }

        // ============================
        // Demo 1: Tree Terminology Check
        // ============================
        (function() {
            var svg = container.querySelector('#tree-demo-terms-svg');
            var infoEl = container.querySelector('#tree-demo-terms-info');
            if (!svg || !infoEl) return;

            var treeData = [
                { val: 1, x: 220, y: 40, depth: 0, height: 2, parent: null, children: [2,3], isLeaf: false },
                { val: 2, x: 120, y: 120, depth: 1, height: 1, parent: 1, children: [4,5], isLeaf: false },
                { val: 3, x: 320, y: 120, depth: 1, height: 1, parent: 1, children: [6,7], isLeaf: false },
                { val: 4, x: 70,  y: 200, depth: 2, height: 0, parent: 2, children: [], isLeaf: true },
                { val: 5, x: 170, y: 200, depth: 2, height: 0, parent: 2, children: [], isLeaf: true },
                { val: 6, x: 270, y: 200, depth: 2, height: 0, parent: 3, children: [], isLeaf: true },
                { val: 7, x: 370, y: 200, depth: 2, height: 0, parent: 3, children: [], isLeaf: true }
            ];
            var edges = [
                { x1:220, y1:40, x2:120, y2:120, id:'tree-demo-terms-e01' },
                { x1:220, y1:40, x2:320, y2:120, id:'tree-demo-terms-e02' },
                { x1:120, y1:120, x2:70,  y2:200, id:'tree-demo-terms-e12' },
                { x1:120, y1:120, x2:170, y2:200, id:'tree-demo-terms-e13' },
                { x1:320, y1:120, x2:270, y2:200, id:'tree-demo-terms-e14' },
                { x1:320, y1:120, x2:370, y2:200, id:'tree-demo-terms-e15' }
            ];
            var svgNodes = treeData.map(function(n) {
                return { val: n.val, x: n.x, y: n.y, id: 'tree-demo-terms-n' + n.val };
            });
            _drawTreeSVG(svg, svgNodes, { edgePairs: edges, clickable: true, r: 24 });

            for (var d = 0; d <= 2; d++) {
                var label = document.createElementNS(_svgNS, 'text');
                label.setAttribute('x', 430); label.setAttribute('y', 40 + d * 80 + 5);
                label.setAttribute('text-anchor', 'end'); label.setAttribute('font-size', '11');
                label.setAttribute('fill', 'var(--text3)'); label.setAttribute('font-weight', '600');
                label.textContent = 'depth ' + d;
                svg.appendChild(label);
            }

            var clickedSet = {};
            svg.addEventListener('click', function(e) {
                var g = e.target.closest('g');
                if (!g || !g.id || !g.id.startsWith('tree-demo-terms-n')) return;
                var val = parseInt(g.id.replace('tree-demo-terms-n', ''));
                var nd = treeData.find(function(n) { return n.val === val; });
                if (!nd) return;
                clickedSet[val] = true;

                treeData.forEach(function(n) {
                    var el = svg.querySelector('#tree-demo-terms-n' + n.val + ' circle');
                    if (el) { el.setAttribute('fill', 'var(--bg2)'); el.setAttribute('stroke', 'var(--accent)'); el.style.filter = ''; }
                });
                var clickedCircle = svg.querySelector('#tree-demo-terms-n' + val + ' circle');
                if (clickedCircle) {
                    clickedCircle.setAttribute('fill', 'var(--yellow)');
                    clickedCircle.setAttribute('stroke', 'var(--yellow)');
                    clickedCircle.style.filter = 'drop-shadow(0 0 6px var(--yellow))';
                }
                nd.children.forEach(function(cv) {
                    var cc = svg.querySelector('#tree-demo-terms-n' + cv + ' circle');
                    if (cc) { cc.setAttribute('fill', 'var(--green)'); cc.setAttribute('stroke', 'var(--green)'); cc.style.filter = 'drop-shadow(0 0 4px var(--green))'; }
                });
                if (nd.parent !== null) {
                    var pc = svg.querySelector('#tree-demo-terms-n' + nd.parent + ' circle');
                    if (pc) { pc.setAttribute('fill', 'var(--accent)'); pc.setAttribute('stroke', 'var(--accent)'); pc.style.filter = 'drop-shadow(0 0 4px var(--accent))'; }
                }

                var parentStr = nd.parent !== null ? '<span style="color:var(--accent);font-weight:700;">' + nd.parent + '</span>' : 'None (root)';
                var childStr = nd.children.length > 0 ? nd.children.map(function(c) { return '<span style="color:var(--green);font-weight:700;">' + c + '</span>'; }).join(', ') : 'None (leaf)';
                infoEl.innerHTML =
                    '<strong style="color:var(--yellow);">Node ' + val + '</strong> — ' +
                    'Parent: ' + parentStr + ' | ' +
                    'Children: ' + childStr + ' | ' +
                    'depth: <strong>' + nd.depth + '</strong> | ' +
                    'height: <strong>' + nd.height + '</strong> | ' +
                    (nd.isLeaf ? '<span style="color:var(--green);">Leaf node</span>' : (nd.parent === null ? '<span style="color:var(--red);">Root node</span>' : 'Internal node'));

                var count = Object.keys(clickedSet).length;
                var msgEl = container.querySelector('#tree-demo-terms-msg');
                if (msgEl) {
                    if (count >= 7) msgEl.textContent = 'You have checked all nodes! Do you understand the depth, height, and parent/child relationships?';
                    else msgEl.textContent = count + '/7 nodes checked. Click the remaining nodes too!';
                }
            });
        })();

        // ============================
        // Demo 2: BST Node Insertion
        // ============================
        (function() {
            var svg = container.querySelector('#tree-demo-bst-svg');
            var inputEl = container.querySelector('#tree-demo-bst-input');
            var insertBtn = container.querySelector('#tree-demo-bst-insert');
            var resetBtn = container.querySelector('#tree-demo-bst-reset');
            var descEl = container.querySelector('#tree-demo-bst-desc');
            var stepBtns = container.querySelector('#tree-demo-bst-step-btns');
            var nextBtn = container.querySelector('#tree-demo-bst-next');
            if (!svg || !insertBtn) return;

            var bstNodes = [];
            var bstEdges = [];
            var insertSteps = [];
            var insertIdx = 0;
            var inserting = false;

            var initVals = [8, 3, 10, 1, 5, 14];

            function bstLayout() {
                if (bstNodes.length === 0) return;
                var root = bstNodes[0];
                var q = [{ node: root, x: 250, y: 40, span: 120 }];
                bstEdges = [];
                while (q.length > 0) {
                    var cur = q.shift();
                    cur.node.x = cur.x;
                    cur.node.y = cur.y;
                    if (cur.node.left !== null) {
                        var leftNode = bstNodes.find(function(n) { return n.val === cur.node.left; });
                        if (leftNode) {
                            bstEdges.push({ x1: cur.x, y1: cur.y, x2: cur.x - cur.span, y2: cur.y + 70 });
                            q.push({ node: leftNode, x: cur.x - cur.span, y: cur.y + 70, span: cur.span * 0.55 });
                        }
                    }
                    if (cur.node.right !== null) {
                        var rightNode = bstNodes.find(function(n) { return n.val === cur.node.right; });
                        if (rightNode) {
                            bstEdges.push({ x1: cur.x, y1: cur.y, x2: cur.x + cur.span, y2: cur.y + 70 });
                            q.push({ node: rightNode, x: cur.x + cur.span, y: cur.y + 70, span: cur.span * 0.55 });
                        }
                    }
                }
            }

            function bstInsert(val) {
                var newNode = { val: val, left: null, right: null, x: 0, y: 0 };
                if (bstNodes.length === 0) {
                    bstNodes.push(newNode);
                    return [];
                }
                var steps = [];
                var current = bstNodes[0];
                while (true) {
                    if (val < current.val) {
                        steps.push({ node: current.val, dir: 'left', desc: val + ' < ' + current.val + ' → go left (smaller values go left!)' });
                        if (current.left === null) {
                            current.left = val;
                            bstNodes.push(newNode);
                            steps.push({ node: val, dir: 'placed', desc: val + ' inserted as ' + current.val + '\'s left child!' });
                            break;
                        }
                        current = bstNodes.find(function(n) { return n.val === current.left; });
                    } else {
                        steps.push({ node: current.val, dir: 'right', desc: val + ' >= ' + current.val + ' → go right (larger or equal values go right!)' });
                        if (current.right === null) {
                            current.right = val;
                            bstNodes.push(newNode);
                            steps.push({ node: val, dir: 'placed', desc: val + ' inserted as ' + current.val + '\'s right child!' });
                            break;
                        }
                        current = bstNodes.find(function(n) { return n.val === current.right; });
                    }
                }
                return steps;
            }

            function drawBST(highlightVal, highlightColor) {
                bstLayout();
                svg.innerHTML = '';
                bstEdges.forEach(function(e) {
                    var line = document.createElementNS(_svgNS, 'line');
                    line.setAttribute('x1', e.x1); line.setAttribute('y1', e.y1);
                    line.setAttribute('x2', e.x2); line.setAttribute('y2', e.y2);
                    line.setAttribute('stroke', 'var(--bg3)'); line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                });
                bstNodes.forEach(function(n) {
                    var g = document.createElementNS(_svgNS, 'g');
                    var circle = document.createElementNS(_svgNS, 'circle');
                    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
                    circle.setAttribute('r', '20');
                    var isHL = highlightVal === n.val;
                    circle.setAttribute('fill', isHL ? (highlightColor || 'var(--yellow)') : 'var(--bg2)');
                    circle.setAttribute('stroke', isHL ? (highlightColor || 'var(--yellow)') : 'var(--accent)');
                    circle.setAttribute('stroke-width', '2.5');
                    if (isHL) circle.style.filter = 'drop-shadow(0 0 8px ' + (highlightColor || 'var(--yellow)') + ')';
                    g.appendChild(circle);
                    var text = document.createElementNS(_svgNS, 'text');
                    text.setAttribute('x', n.x); text.setAttribute('y', parseFloat(n.y) + 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '13'); text.setAttribute('font-weight', '700');
                    text.setAttribute('fill', isHL ? 'white' : 'var(--text)');
                    text.setAttribute('pointer-events', 'none');
                    text.textContent = n.val;
                    g.appendChild(text);
                    svg.appendChild(g);
                });
            }

            function initBST() {
                bstNodes = []; bstEdges = [];
                initVals.forEach(function(v) { bstInsert(v); });
                drawBST();
                insertSteps = []; insertIdx = 0; inserting = false;
                stepBtns.style.display = 'none';
                descEl.textContent = 'Enter a value and click "Start Insert"!';
            }

            initBST();

            insertBtn.addEventListener('click', function() {
                var val = parseInt(inputEl.value);
                if (isNaN(val) || val < 1 || val > 99) { descEl.textContent = 'Please enter a number between 1 and 99!'; return; }
                if (bstNodes.find(function(n) { return n.val === val; })) { descEl.textContent = val + ' is already in the tree. Try a different value!'; return; }

                var stepsPreview = [];
                var current = bstNodes[0];
                while (true) {
                    if (val < current.val) {
                        stepsPreview.push({ node: current.val, dir: 'left', desc: val + ' < ' + current.val + ' → go left (smaller values go left!)' });
                        if (current.left === null) {
                            stepsPreview.push({ node: current.val, dir: 'place-left', desc: current.val + '\'s left is empty! Inserting ' + val + ' here.' });
                            break;
                        }
                        current = bstNodes.find(function(n) { return n.val === current.left; });
                    } else {
                        stepsPreview.push({ node: current.val, dir: 'right', desc: val + ' >= ' + current.val + ' → go right (larger or equal values go right!)' });
                        if (current.right === null) {
                            stepsPreview.push({ node: current.val, dir: 'place-right', desc: current.val + '\'s right is empty! Inserting ' + val + ' here.' });
                            break;
                        }
                        current = bstNodes.find(function(n) { return n.val === current.right; });
                    }
                }
                insertSteps = stepsPreview;
                insertIdx = 0; inserting = true;
                stepBtns.style.display = 'flex';
                nextBtn.style.display = '';
                descEl.textContent = 'Starting insertion of ' + val + '! Click "Next Comparison".';
                drawBST();
            });

            nextBtn.addEventListener('click', function() {
                if (!inserting || insertIdx >= insertSteps.length) return;
                var step = insertSteps[insertIdx];
                descEl.textContent = step.desc;
                if (step.dir === 'place-left' || step.dir === 'place-right') {
                    var val = parseInt(inputEl.value);
                    bstInsert(val);
                    drawBST(val, 'var(--green)');
                    inserting = false;
                    nextBtn.style.display = 'none';
                    descEl.textContent = step.desc;
                } else {
                    drawBST(step.node, 'var(--yellow)');
                }
                insertIdx++;
            });

            resetBtn.addEventListener('click', function() {
                initBST();
                inputEl.value = '6';
            });
        })();

        // ============================
        // Demo 3: Preorder Traversal
        // ============================
        (function() {
            var svg = container.querySelector('#tree-demo-preorder-svg');
            var descEl = container.querySelector('#tree-demo-preorder-desc');
            var nextBtn = container.querySelector('#tree-demo-preorder-next');
            var resetBtn = container.querySelector('#tree-demo-preorder-reset');
            var orderEl = container.querySelector('#tree-demo-preorder-order');
            if (!svg || !nextBtn) return;

            var treeLayout = [
                { val: 1, x: 220, y: 35 },
                { val: 2, x: 120, y: 105 },
                { val: 3, x: 320, y: 105 },
                { val: 4, x: 70,  y: 180 },
                { val: 5, x: 170, y: 180 },
                { val: 6, x: 270, y: 180 },
                { val: 7, x: 370, y: 180 }
            ];
            var treeEdges = [
                { x1:220, y1:35, x2:120, y2:105 },
                { x1:220, y1:35, x2:320, y2:105 },
                { x1:120, y1:105, x2:70,  y2:180 },
                { x1:120, y1:105, x2:170, y2:180 },
                { x1:320, y1:105, x2:270, y2:180 },
                { x1:320, y1:105, x2:370, y2:180 }
            ];

            var preorderSteps = [
                { visit: 1, desc: 'Visit root node 1. Preorder records the current node first!' },
                { visit: 2, desc: 'Go down to left child 2. Record 2 first.' },
                { visit: 4, desc: 'Go down to 2\'s left child 4. Record 4. Node 4 is a leaf!' },
                { visit: 5, desc: '4 is done, so go to 2\'s right child 5. Record 5. Node 5 is also a leaf!' },
                { visit: 3, desc: '2\'s subtree is done. Now go to root\'s right child 3. Record 3.' },
                { visit: 6, desc: 'Go down to 3\'s left child 6. Record 6. Node 6 is a leaf!' },
                { visit: 7, desc: 'Go to 3\'s right child 7. Record 7. Traversal complete!' }
            ];

            var visitedList = [];
            var currentStepIdx = -1;

            function drawTree() {
                svg.innerHTML = '';
                treeEdges.forEach(function(e) {
                    var line = document.createElementNS(_svgNS, 'line');
                    line.setAttribute('x1', e.x1); line.setAttribute('y1', e.y1);
                    line.setAttribute('x2', e.x2); line.setAttribute('y2', e.y2);
                    line.setAttribute('stroke', 'var(--bg3)'); line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                });
                treeLayout.forEach(function(n) {
                    var g = document.createElementNS(_svgNS, 'g');
                    var circle = document.createElementNS(_svgNS, 'circle');
                    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
                    circle.setAttribute('r', '22');
                    var isVisited = visitedList.indexOf(n.val) !== -1;
                    var isCurrent = currentStepIdx >= 0 && preorderSteps[currentStepIdx].visit === n.val;
                    if (isCurrent) {
                        circle.setAttribute('fill', 'var(--yellow)');
                        circle.setAttribute('stroke', 'var(--yellow)');
                        circle.style.filter = 'drop-shadow(0 0 8px var(--yellow))';
                    } else if (isVisited) {
                        circle.setAttribute('fill', 'var(--green)');
                        circle.setAttribute('stroke', 'var(--green)');
                        circle.style.filter = 'drop-shadow(0 0 4px var(--green))';
                    } else {
                        circle.setAttribute('fill', 'var(--bg2)');
                        circle.setAttribute('stroke', 'var(--accent)');
                    }
                    circle.setAttribute('stroke-width', '2.5');
                    g.appendChild(circle);
                    var text = document.createElementNS(_svgNS, 'text');
                    text.setAttribute('x', n.x); text.setAttribute('y', parseFloat(n.y) + 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '14'); text.setAttribute('font-weight', '700');
                    text.setAttribute('fill', (isCurrent || isVisited) ? 'white' : 'var(--text)');
                    text.setAttribute('pointer-events', 'none');
                    text.textContent = n.val;
                    g.appendChild(text);
                    var visitIdx = visitedList.indexOf(n.val);
                    if (visitIdx !== -1) {
                        var badge = document.createElementNS(_svgNS, 'text');
                        badge.setAttribute('x', parseFloat(n.x) + 18); badge.setAttribute('y', parseFloat(n.y) - 16);
                        badge.setAttribute('text-anchor', 'middle');
                        badge.setAttribute('font-size', '10'); badge.setAttribute('font-weight', '700');
                        badge.setAttribute('fill', 'var(--accent)');
                        badge.textContent = '#' + (visitIdx + 1);
                        g.appendChild(badge);
                    }
                    svg.appendChild(g);
                });
            }

            function reset() {
                visitedList = [];
                currentStepIdx = -1;
                drawTree();
                orderEl.textContent = '';
                descEl.textContent = '▶ Click "Next Visit" to follow the preorder traversal!';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            }

            reset();

            nextBtn.addEventListener('click', function() {
                if (currentStepIdx >= preorderSteps.length - 1) return;
                currentStepIdx++;
                var step = preorderSteps[currentStepIdx];
                visitedList.push(step.visit);
                descEl.textContent = step.desc;
                orderEl.textContent = visitedList.join(' → ');
                drawTree();

                if (currentStepIdx >= preorderSteps.length - 1) {
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                    descEl.textContent = 'Preorder traversal complete! Result: 1 → 2 → 4 → 5 → 3 → 6 → 7. We followed the "Root → Left → Right" order.';
                }
            });

            resetBtn.addEventListener('click', function() { reset(); });
        })();

        // ============================
        // Demo 4: DFS Depth Search (Stack)
        // ============================
        (function() {
            var svg = container.querySelector('#tree-demo-dfs-svg');
            var stackEl = container.querySelector('#tree-demo-dfs-stack');
            var descEl = container.querySelector('#tree-demo-dfs-desc');
            var nextBtn = container.querySelector('#tree-demo-dfs-next');
            var resetBtn = container.querySelector('#tree-demo-dfs-reset');
            var visitedListEl = container.querySelector('#tree-demo-dfs-visited-list');
            if (!svg || !nextBtn) return;

            var treeLayout = [
                { val: 1, x: 160, y: 35 },
                { val: 2, x: 80,  y: 100 },
                { val: 3, x: 240, y: 100 },
                { val: 4, x: 40,  y: 170 },
                { val: 5, x: 120, y: 170 },
                { val: 6, x: 200, y: 170 },
                { val: 7, x: 280, y: 170 }
            ];
            var treeEdges = [
                { x1:160, y1:35, x2:80,  y2:100 },
                { x1:160, y1:35, x2:240, y2:100 },
                { x1:80,  y1:100, x2:40,  y2:170 },
                { x1:80,  y1:100, x2:120, y2:170 },
                { x1:240, y1:100, x2:200, y2:170 },
                { x1:240, y1:100, x2:280, y2:170 }
            ];
            var childrenMap = { 1: [2,3], 2: [4,5], 3: [6,7], 4: [], 5: [], 6: [], 7: [] };

            var dfsSteps = [
                { type: 'push', val: 1, stack: [1], visited: [], current: null,
                  desc: 'Push root node 1 onto the stack. DFS explores by popping from the stack.' },
                { type: 'pop', val: 1, stack: [], visited: [1], current: 1,
                  desc: 'Pop 1 from the stack. Node 1 visited! Push its children onto the stack.' },
                { type: 'push-children', val: 1, stack: [3, 2], visited: [1], current: 1,
                  desc: 'Push 1\'s children: right 3 first, then left 2. Why? Stack is LIFO, so left (2) comes out first!' },
                { type: 'pop', val: 2, stack: [3], visited: [1, 2], current: 2,
                  desc: 'Stack top is 2 → pop and visit! Push 2\'s children.' },
                { type: 'push-children', val: 2, stack: [3, 5, 4], visited: [1, 2], current: 2,
                  desc: 'Push 2\'s children: right 5, then left 4. Stack top is 4 → next we visit 4.' },
                { type: 'pop', val: 4, stack: [3, 5], visited: [1, 2, 4], current: 4,
                  desc: 'Stack top is 4 → pop and visit! Node 4 is a leaf, no children to push.' },
                { type: 'pop', val: 5, stack: [3], visited: [1, 2, 4, 5], current: 5,
                  desc: 'Stack top is 5 → pop and visit! Node 5 is also a leaf. 2\'s subtree is done!' },
                { type: 'pop', val: 3, stack: [], visited: [1, 2, 4, 5, 3], current: 3,
                  desc: 'Stack top is 3 → pop and visit! Push 3\'s children.' },
                { type: 'push-children', val: 3, stack: [7, 6], visited: [1, 2, 4, 5, 3], current: 3,
                  desc: 'Push 3\'s children: right 7, then left 6. Stack top is 6 → next we visit 6.' },
                { type: 'pop', val: 6, stack: [7], visited: [1, 2, 4, 5, 3, 6], current: 6,
                  desc: 'Stack top is 6 → pop and visit! Node 6 is a leaf.' },
                { type: 'pop', val: 7, stack: [], visited: [1, 2, 4, 5, 3, 6, 7], current: 7,
                  desc: 'Stack top is 7 → pop and visit! Stack is empty. DFS traversal complete!' }
            ];

            var currentStepIdx = -1;

            function drawDFS(step) {
                var visited = step ? step.visited : [];
                var current = step ? step.current : null;
                var stackArr = step ? step.stack : [];

                svg.innerHTML = '';
                treeEdges.forEach(function(e) {
                    var line = document.createElementNS(_svgNS, 'line');
                    line.setAttribute('x1', e.x1); line.setAttribute('y1', e.y1);
                    line.setAttribute('x2', e.x2); line.setAttribute('y2', e.y2);
                    line.setAttribute('stroke', 'var(--bg3)'); line.setAttribute('stroke-width', '2');
                    svg.appendChild(line);
                });
                treeLayout.forEach(function(n) {
                    var g = document.createElementNS(_svgNS, 'g');
                    var circle = document.createElementNS(_svgNS, 'circle');
                    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
                    circle.setAttribute('r', '20');
                    var isCurrent = current === n.val;
                    var isVisited = visited.indexOf(n.val) !== -1;
                    var inStack = stackArr.indexOf(n.val) !== -1;
                    if (isCurrent) {
                        circle.setAttribute('fill', 'var(--yellow)');
                        circle.setAttribute('stroke', 'var(--yellow)');
                        circle.style.filter = 'drop-shadow(0 0 8px var(--yellow))';
                    } else if (isVisited) {
                        circle.setAttribute('fill', 'var(--green)');
                        circle.setAttribute('stroke', 'var(--green)');
                        circle.style.filter = 'drop-shadow(0 0 4px var(--green))';
                    } else if (inStack) {
                        circle.setAttribute('fill', 'var(--accent)');
                        circle.setAttribute('stroke', 'var(--accent)');
                        circle.style.filter = 'drop-shadow(0 0 4px var(--accent))';
                    } else {
                        circle.setAttribute('fill', 'var(--bg2)');
                        circle.setAttribute('stroke', 'var(--text3)');
                    }
                    circle.setAttribute('stroke-width', '2.5');
                    g.appendChild(circle);
                    var text = document.createElementNS(_svgNS, 'text');
                    text.setAttribute('x', n.x); text.setAttribute('y', parseFloat(n.y) + 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '13'); text.setAttribute('font-weight', '700');
                    text.setAttribute('fill', (isCurrent || isVisited || inStack) ? 'white' : 'var(--text)');
                    text.setAttribute('pointer-events', 'none');
                    text.textContent = n.val;
                    g.appendChild(text);
                    var depthMap = { 1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 };
                    if (isVisited || isCurrent) {
                        var dl = document.createElementNS(_svgNS, 'text');
                        dl.setAttribute('x', parseFloat(n.x)); dl.setAttribute('y', parseFloat(n.y) + 35);
                        dl.setAttribute('text-anchor', 'middle');
                        dl.setAttribute('font-size', '10'); dl.setAttribute('fill', 'var(--text3)'); dl.setAttribute('font-weight', '600');
                        dl.textContent = 'd=' + depthMap[n.val];
                        g.appendChild(dl);
                    }
                    svg.appendChild(g);
                });

                stackEl.innerHTML = '';
                if (stackArr.length === 0) {
                    stackEl.innerHTML = '<div style="color:var(--text3);font-size:0.8rem;padding:1rem 0;">Empty</div>';
                } else {
                    stackArr.forEach(function(v, i) {
                        var item = document.createElement('div');
                        item.style.cssText = 'padding:6px 18px;background:var(--accent);color:white;border-radius:6px;font-weight:700;font-size:0.9rem;text-align:center;min-width:40px;transition:all 0.3s;';
                        if (i === stackArr.length - 1) {
                            item.style.background = 'var(--yellow)';
                            item.style.boxShadow = '0 0 8px var(--yellow)';
                            item.textContent = v + ' ← top';
                        } else {
                            item.textContent = '' + v;
                        }
                        stackEl.appendChild(item);
                    });
                }

                visitedListEl.textContent = visited.join(' → ');
            }

            function reset() {
                currentStepIdx = -1;
                drawDFS(null);
                descEl.textContent = '▶ Click "Next Step" to see how DFS works with a stack!';
                visitedListEl.textContent = '';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            }

            reset();

            nextBtn.addEventListener('click', function() {
                if (currentStepIdx >= dfsSteps.length - 1) return;
                currentStepIdx++;
                var step = dfsSteps[currentStepIdx];
                descEl.textContent = step.desc;
                drawDFS(step);

                if (currentStepIdx >= dfsSteps.length - 1) {
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', function() { reset(); });
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

    // ====================================================================
    // Common helper: level-order string -> tree node array
    // ====================================================================
    _parseLevelOrder: function(str) {
        // "3, 9, 20, null, null, 15, 7" → [{val, left, right, idx}, ...]
        var tokens = str.split(',').map(function(s) { return s.trim(); });
        if (!tokens.length || tokens[0] === '' || tokens[0] === 'null' || tokens[0] === 'n') return [];
        var arr = tokens.map(function(t) {
            if (t === 'null' || t === 'n' || t === '') return null;
            var n = Number(t);
            return isNaN(n) ? t : n;  // number if numeric, otherwise keep as string (A,B,C...)
        });
        // Build node objects
        var nodes = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== null) {
                nodes.push({ val: arr[i], left: null, right: null, idx: i });
            } else {
                nodes.push(null);
            }
        }
        // Link children
        var childIdx = 1;
        for (var i = 0; i < nodes.length && childIdx < nodes.length; i++) {
            if (nodes[i] === null) continue;
            if (childIdx < nodes.length) { nodes[i].left = nodes[childIdx]; childIdx++; }
            if (childIdx < nodes.length) { nodes[i].right = nodes[childIdx]; childIdx++; }
        }
        return nodes;
    },

    // Extract only actual nodes from level-order tree (exclude null)
    _getTreeNodes: function(parsed) {
        return parsed.filter(function(n) { return n !== null; });
    },

    // Compute tree layout: BFS-based coordinate assignment
    _computeTreeLayout: function(root, width, levelHeight, topY) {
        if (!root) return { positions: {}, edges: [], nodeOrder: [] };
        width = width || 400;
        levelHeight = levelHeight || 70;
        topY = topY || 40;
        var positions = {};
        var edges = [];
        var nodeOrder = [];
        // BFS with position ranges
        var queue = [{ node: root, xMin: 0, xMax: width, depth: 0 }];
        while (queue.length > 0) {
            var item = queue.shift();
            var nd = item.node, xMin = item.xMin, xMax = item.xMax, depth = item.depth;
            var cx = (xMin + xMax) / 2;
            var cy = topY + depth * levelHeight;
            var key = String(nd.val);
            // Use idx-based key since there may be duplicate values
            var uniqueKey = key + '_' + nd.idx;
            positions[uniqueKey] = { x: cx, y: cy, val: nd.val };
            nodeOrder.push(uniqueKey);
            if (nd.left) {
                var lKey = String(nd.left.val) + '_' + nd.left.idx;
                edges.push([uniqueKey, lKey]);
                queue.push({ node: nd.left, xMin: xMin, xMax: cx, depth: depth + 1 });
            }
            if (nd.right) {
                var rKey = String(nd.right.val) + '_' + nd.right.idx;
                edges.push([uniqueKey, rKey]);
                queue.push({ node: nd.right, xMin: cx, xMax: xMax, depth: depth + 1 });
            }
        }
        return { positions: positions, edges: edges, nodeOrder: nodeOrder };
    },

    // SVG render: positions + edges + highlights -> SVG string
    _makeTreeSvg: function(layout, highlights, viewWidth, viewHeight, nodeRadius, extraLabels) {
        highlights = highlights || {};
        viewWidth = viewWidth || 460;
        viewHeight = viewHeight || 220;
        nodeRadius = nodeRadius || 22;
        extraLabels = extraLabels || {};
        var positions = layout.positions;
        var edges = layout.edges;
        var nodeOrder = layout.nodeOrder;
        var svg = '<svg viewBox="0 0 ' + viewWidth + ' ' + viewHeight + '" width="100%" height="' + viewHeight + '">';
        // edges
        edges.forEach(function(e) {
            var p1 = positions[e[0]], p2 = positions[e[1]];
            if (p1 && p2) {
                svg += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="var(--border)" stroke-width="2"/>';
            }
        });
        // nodes
        nodeOrder.forEach(function(key) {
            var n = positions[key];
            var hl = highlights[key] || '';
            var fill = hl === 'active' ? 'var(--accent)' : hl === 'done' ? 'var(--green)' : hl === 'current' ? 'var(--accent)' : hl === 'swap' ? '#e17055' : hl === 'pre' ? 'var(--accent)' : hl === 'in' ? 'var(--green)' : hl === 'post' ? '#e17055' : 'var(--bg2)';
            var textFill = (hl && hl !== '') ? 'white' : 'var(--text)';
            if (!hl) textFill = 'var(--text)';
            svg += '<circle cx="' + n.x + '" cy="' + n.y + '" r="' + nodeRadius + '" fill="' + fill + '" stroke="var(--border)" stroke-width="2"/>';
            svg += '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle" font-size="14" font-weight="600" fill="' + textFill + '">' + n.val + '</text>';
            if (extraLabels[key] !== undefined) {
                svg += '<text x="' + (n.x + nodeRadius + 6) + '" y="' + (n.y - 8) + '" font-size="11" fill="var(--accent)" font-weight="600">' + extraLabels[key] + '</text>';
            }
        });
        svg += '</svg>';
        return svg;
    },

    // Compute tree height
    _getTreeHeight: function(root) {
        if (!root) return 0;
        var self = this;
        return 1 + Math.max(self._getTreeHeight(root.left), self._getTreeHeight(root.right));
    },

    // ====================================================================
    // Simulation 1: Maximum Depth (lc-104)
    // ====================================================================
    _renderVizMaxDepth: function(container) {
        var self = this;
        var suffix = '-depth';
        var DEFAULT_TREE = '3, 9, 20, null, null, 15, 7';

        function buildDepthSteps(treeStr, svgEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);

            function renderSvg(highlights, depthLabels) {
                return self._makeTreeSvg(layout, highlights, 460, svgH, 22, depthLabels);
            }

            // DFS post-order to build steps: visit node, recurse left, recurse right, compute depth
            var steps = [];
            var currentHL = {};   // key → 'active'|'done'
            var depthMap = {};    // key → depth number
            var depthVals = {};   // key → computed depth value

            function dfs(node, parentKey) {
                if (!node) return 0;
                var key = String(node.val) + '_' + node.idx;
                var isLeaf = (!node.left && !node.right);
                var childDesc = '';
                if (node.left && node.right) childDesc = ' -> move to left child';
                else if (node.left) childDesc = ' -> move to left child';
                else if (node.right) childDesc = ' -> move to right child';

                // Step: visit this node
                (function(k, isL, cDesc, v) {
                    var prevHL = JSON.parse(JSON.stringify(currentHL));
                    var prevDepth = JSON.parse(JSON.stringify(depthMap));
                    currentHL[k] = 'active';
                    var snapHL = JSON.parse(JSON.stringify(currentHL));
                    var snapDepth = JSON.parse(JSON.stringify(depthMap));
                    var desc = isL
                        ? 'Visit node ' + v + ' — leaf node, so depth=1 (counting only itself)'
                        : 'Visit node ' + v + ' — recurse into children to find subtree depth' + cDesc;
                    var info = isL
                        ? 'Visit node <strong>' + v + '</strong> — leaf node: no children, so depth=1'
                        : 'Visit node <strong>' + v + '</strong> — recurse left/right subtrees to find depth' + cDesc;
                    steps.push({
                        description: desc,
                        action: function() { svgEl.innerHTML = renderSvg(snapHL, snapDepth); infoEl.innerHTML = info; },
                        undo: function() { svgEl.innerHTML = renderSvg(prevHL, prevDepth); infoEl.innerHTML = steps.length > 1 ? '' : '<span style="color:var(--text2);">Current depth: 0</span>'; }
                    });
                })(key, isLeaf, childDesc, node.val);

                var leftD = dfs(node.left, key);
                var rightD = dfs(node.right, key);
                var d = 1 + Math.max(leftD, rightD);

                // Step: compute depth for this node
                (function(k, v, leftD, rightD, d) {
                    var prevHL = JSON.parse(JSON.stringify(currentHL));
                    var prevDepth = JSON.parse(JSON.stringify(depthMap));
                    currentHL[k] = 'done';
                    depthMap[k] = 'd=' + d;
                    var snapHL = JSON.parse(JSON.stringify(currentHL));
                    var snapDepth = JSON.parse(JSON.stringify(depthMap));
                    var desc = 'Node ' + v + ': max(' + leftD + ', ' + rightD + ') + 1 = depth ' + d + ' — take the deeper subtree and add 1 for this node';
                    var info = 'Node ' + v + ': max(' + leftD + ', ' + rightD + ') + 1 = <strong>depth ' + d + '</strong> — deeper side + 1';
                    steps.push({
                        description: desc,
                        action: function() { svgEl.innerHTML = renderSvg(snapHL, snapDepth); infoEl.innerHTML = info; },
                        undo: function() { svgEl.innerHTML = renderSvg(prevHL, prevDepth); }
                    });
                })(key, node.val, leftD, rightD, d);

                depthVals[key] = d;
                return d;
            }

            var totalDepth = dfs(root, null);

            // Final step
            var finalHL = JSON.parse(JSON.stringify(currentHL));
            var finalDepth = JSON.parse(JSON.stringify(depthMap));
            var prevHL2 = steps.length > 0 ? null : {};
            steps.push({
                description: 'Done! Maximum depth = ' + totalDepth + ' — the length of the path from root to the deepest leaf',
                action: function() {
                    svgEl.innerHTML = renderSvg(finalHL, finalDepth);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Maximum depth = ' + totalDepth + '</strong>';
                },
                undo: function() {}
            });

            // Fix undo references: each step's undo should restore the state from the previous step's action
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }
            steps[0].undo = function() {
                svgEl.innerHTML = renderSvg({}, {});
                infoEl.innerHTML = '<span style="color:var(--text2);">Current depth: 0</span>';
            };

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Maximum Depth — DFS Recursion</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Tree (level-order): <input type="text" id="tree-depth-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-depth-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">Enter in BFS order. null = empty node. e.g.: 3, 9, 20, null, null, 15, 7</p>' +
            self._createStepDesc(suffix) +
            '<div id="depth-svg' + suffix + '"></div>' +
            '<div id="depth-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">Current depth: 0</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#depth-svg' + suffix);
        var infoEl = container.querySelector('#depth-info' + suffix);

        function initSim(treeStr) {
            var steps = buildDepthSteps(treeStr, svgEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">Please enter a valid tree.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22, {});
            infoEl.innerHTML = '<span style="color:var(--text2);">Current depth: 0</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-depth-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-depth-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // Simulation 2: Invert Binary Tree (lc-226)
    // ====================================================================
    _renderVizInvert: function(container) {
        var self = this;
        var suffix = '-invert';
        var DEFAULT_TREE = '4, 2, 7, 1, 3, 6, 9';

        function cloneNode(node) {
            if (!node) return null;
            var c = { val: node.val, left: null, right: null, idx: node.idx };
            c.left = cloneNode(node.left);
            c.right = cloneNode(node.right);
            return c;
        }

        function invertNode(node) {
            if (!node) return;
            var tmp = node.left;
            node.left = node.right;
            node.right = tmp;
            invertNode(node.left);
            invertNode(node.right);
        }

        function treeToLevelOrder(root) {
            if (!root) return '';
            var result = [];
            var queue = [root];
            while (queue.length > 0) {
                var node = queue.shift();
                if (node === null) { result.push('null'); continue; }
                result.push(String(node.val));
                queue.push(node.left);
                queue.push(node.right);
            }
            // Trim trailing nulls
            while (result.length > 0 && result[result.length - 1] === 'null') result.pop();
            return result.join(', ');
        }

        function buildInvertSteps(treeStr, svgEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;

            // We track tree mutations: at each step we clone, swap, and recompute layout
            var steps = [];
            var highlightState = {};  // key → 'swap'|'done'

            // Pre-order traversal to build inversion steps
            function buildSteps(node) {
                if (!node) return;
                var key = String(node.val) + '_' + node.idx;
                var isLeaf = (!node.left && !node.right);

                if (isLeaf) {
                    // Leaf: just mark as done
                    (function(k, v) {
                        var prevHL = JSON.parse(JSON.stringify(highlightState));
                        highlightState[k] = 'done';
                        var snapHL = JSON.parse(JSON.stringify(highlightState));
                        steps.push({
                            description: 'Node ' + v + ': leaf node — no children to swap, so skip',
                            hl: snapHL, prevHL: prevHL,
                            swapNode: null,
                            info: 'Node ' + v + ': leaf node (no swap needed)'
                        });
                    })(key, node.val);
                } else {
                    // Has children: swap them
                    var leftVal = node.left ? node.left.val : 'null';
                    var rightVal = node.right ? node.right.val : 'null';
                    (function(k, v, lv, rv) {
                        var prevHL = JSON.parse(JSON.stringify(highlightState));
                        highlightState[k] = 'swap';
                        var snapHL = JSON.parse(JSON.stringify(highlightState));
                        steps.push({
                            description: 'Node ' + v + ': swap left(' + lv + ') ↔ right(' + rv + ')! — <em>mirror-flip by swapping left/right children at every node</em>',
                            hl: snapHL, prevHL: prevHL,
                            swapNode: k,
                            info: 'Node ' + v + ': <strong>' + lv + ' ↔ ' + rv + '</strong> swap complete!'
                        });
                    })(key, node.val, leftVal, rightVal);

                    // Actually swap in tree for subsequent steps
                    var tmp = node.left;
                    node.left = node.right;
                    node.right = tmp;

                    highlightState[key] = 'done';

                    // Recurse on children (now swapped)
                    buildSteps(node.left);
                    buildSteps(node.right);
                }
            }

            // Clone so we can mutate
            var workRoot = cloneNode(root);
            buildSteps(workRoot);

            // Now build actual step objects with SVG rendering
            // We need to replay the tree mutations to get correct layouts
            var actualSteps = [];
            var replayRoot = cloneNode(root);
            var replayHL = {};

            // Initial SVG
            var initLayout = self._computeTreeLayout(replayRoot, svgW, 70, 40);
            var initSvg = self._makeTreeSvg(initLayout, {}, svgW, svgH, 22);

            for (var si = 0; si < steps.length; si++) {
                var stepInfo = steps[si];
                // Apply swap if needed
                if (stepInfo.swapNode) {
                    // Find the node to swap in replayRoot
                    (function swapInTree(node, targetKey) {
                        if (!node) return;
                        var k = String(node.val) + '_' + node.idx;
                        if (k === targetKey) {
                            var tmp = node.left;
                            node.left = node.right;
                            node.right = tmp;
                            return;
                        }
                        swapInTree(node.left, targetKey);
                        swapInTree(node.right, targetKey);
                    })(replayRoot, stepInfo.swapNode);
                }

                // Compute layout after potential swap
                var layout = self._computeTreeLayout(replayRoot, svgW, 70, 40);
                // Build highlight map
                replayHL = JSON.parse(JSON.stringify(stepInfo.hl));

                (function(lay, hl, desc, info, prevLay, prevHL) {
                    actualSteps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = self._makeTreeSvg(lay, hl, svgW, svgH, 22);
                            infoEl.innerHTML = info;
                        },
                        undo: function() {} // will be patched below
                    });
                })(
                    JSON.parse(JSON.stringify(layout)),
                    JSON.parse(JSON.stringify(replayHL)),
                    stepInfo.description,
                    stepInfo.info,
                    null, null
                );
            }

            // Get inverted level-order for final message
            var finalRoot = cloneNode(root);
            invertNode(finalRoot);
            var invertedStr = treeToLevelOrder(finalRoot);

            // Final completion step
            var finalLayout = self._computeTreeLayout(finalRoot, svgW, 70, 40);
            var allDone = {};
            var finalNodes = [];
            (function collectKeys(node) {
                if (!node) return;
                var k = String(node.val) + '_' + node.idx;
                allDone[k] = 'done';
                finalNodes.push(k);
                collectKeys(node.left);
                collectKeys(node.right);
            })(finalRoot);

            actualSteps.push({
                description: 'Done! All nodes have had their left/right children swapped — the tree is now mirror-inverted: [' + invertedStr + ']',
                action: function() {
                    svgEl.innerHTML = self._makeTreeSvg(finalLayout, allDone, svgW, svgH, 22);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Invert complete! [' + invertedStr + ']</strong>';
                },
                undo: function() {}
            });

            // Patch undo: each step's undo calls previous step's action
            for (var i = 1; i < actualSteps.length; i++) {
                (function(idx) {
                    var prevAction = actualSteps[idx - 1].action;
                    actualSteps[idx].undo = function() { prevAction(); };
                })(i);
            }
            actualSteps[0].undo = function() {
                var origLayout = self._computeTreeLayout(root, svgW, 70, 40);
                svgEl.innerHTML = self._makeTreeSvg(origLayout, {}, svgW, svgH, 22);
                infoEl.innerHTML = '<span style="color:var(--text2);">Swap the left and right children at each node.</span>';
            };

            return actualSteps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Invert Binary Tree — Recursive Left-Right Swap</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Tree (level-order): <input type="text" id="tree-invert-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-invert-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">Enter in BFS order. null = empty node. e.g.: 4, 2, 7, 1, 3, 6, 9</p>' +
            self._createStepDesc(suffix) +
            '<div id="inv-svg' + suffix + '"></div>' +
            '<div id="inv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">Swap the left and right children at each node.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#inv-svg' + suffix);
        var infoEl = container.querySelector('#inv-info' + suffix);

        function initSim(treeStr) {
            var steps = buildInvertSteps(treeStr, svgEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">Please enter a valid tree.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22);
            infoEl.innerHTML = '<span style="color:var(--text2);">Swap the left and right children at each node.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-invert-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-invert-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // Simulation 3: Level Order Traversal (lc-102)
    // ====================================================================
    _renderVizLevelOrder: function(container) {
        var self = this;
        var suffix = '-level';
        var DEFAULT_TREE = '3, 9, 20, null, null, 15, 7';

        function buildLevelSteps(treeStr, svgEl, queueEl, resultEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;
            var layout = self._computeTreeLayout(root, svgW, 70, 40);

            function renderSvg(highlights) {
                return self._makeTreeSvg(layout, highlights, svgW, svgH, 22);
            }
            function showQueue(arr) { queueEl.innerHTML = '<strong>Queue:</strong> ' + (arr.length ? '[' + arr.join(', ') + ']' : '<span style="color:var(--text3);">Empty</span>'); }
            function showResult(arr) { resultEl.innerHTML = '<strong>Result:</strong> [' + arr.map(function(a) { return '[' + a.join(', ') + ']'; }).join(', ') + ']'; }

            // BFS level-by-level to build steps
            var steps = [];
            var highlights = {};
            var result = [];

            // Step 0: Init — put root in queue
            var rootKey = String(root.val) + '_' + root.idx;
            steps.push({
                description: 'Initialize: add root(' + root.val + ') to the queue. — <em>BFS uses a queue to visit nodes level by level, closest first</em>',
                action: function() {
                    var hl = {}; hl[rootKey] = 'current';
                    svgEl.innerHTML = renderSvg(hl);
                    showQueue([root.val]);
                    showResult([]);
                    infoEl.innerHTML = 'Queue = [' + root.val + '], starting level 0';
                },
                undo: function() {
                    svgEl.innerHTML = renderSvg({});
                    showQueue([]);
                    resultEl.innerHTML = '<strong>Result:</strong> <span style="color:var(--text3);">[]</span>';
                    infoEl.innerHTML = '<span style="color:var(--text2);">Starting BFS level-by-level traversal.</span>';
                }
            });

            // BFS level by level
            var bfsQueue = [root];
            var doneKeys = {};
            var levelNum = 0;

            while (bfsQueue.length > 0) {
                var levelSize = bfsQueue.length;
                var levelVals = [];
                var levelCurrentHL = {};
                var nextQueue = [];

                // Process current level
                for (var i = 0; i < levelSize; i++) {
                    var node = bfsQueue[i];
                    var key = String(node.val) + '_' + node.idx;
                    levelVals.push(node.val);
                    doneKeys[key] = true;
                    if (node.left) nextQueue.push(node.left);
                    if (node.right) nextQueue.push(node.right);
                }

                result.push(levelVals.slice());
                var snapResult = result.map(function(a) { return a.slice(); });
                var snapDone = JSON.parse(JSON.stringify(doneKeys));
                var nextVals = nextQueue.map(function(n) { return n.val; });
                var snapNextVals = nextVals.slice();

                // Highlight: done keys as 'done', current level nodes as 'current' (during processing)
                var stepHL = {};
                Object.keys(snapDone).forEach(function(k) { stepHL[k] = 'done'; });
                // Mark current level as 'current' for display during step
                for (var i = 0; i < levelSize; i++) {
                    var node = bfsQueue[i];
                    var key = String(node.val) + '_' + node.idx;
                    stepHL[key] = 'current';
                }

                var childDesc = '';
                if (nextQueue.length > 0) {
                    var childNames = nextQueue.map(function(n) { return n.val; });
                    childDesc = '. Add children ' + childNames.join(', ') + ' to queue';
                } else {
                    childDesc = '. Queue is empty!';
                }

                var lvlN = levelNum;
                var lvlVals = levelVals.slice();

                (function(hl, sResult, sNextVals, desc, lvlN, lvlVals) {
                    steps.push({
                        description: 'Level ' + lvlN + ': process nodes ' + lvlVals.join(', ') + '. — <em>dequeue all nodes at the same depth to group them by level</em>',
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            showQueue(sNextVals);
                            showResult(sResult);
                            infoEl.innerHTML = 'Level ' + lvlN + ' complete: [' + lvlVals.join(', ') + ']' + desc;
                        },
                        undo: function() {} // patched below
                    });
                })(JSON.parse(JSON.stringify(stepHL)), snapResult, snapNextVals, childDesc, lvlN, lvlVals);

                bfsQueue = nextQueue;
                levelNum++;
            }

            // Final step
            var allDone = {};
            layout.nodeOrder.forEach(function(k) { allDone[k] = 'done'; });
            var finalResult = result.map(function(a) { return a.slice(); });
            var resultStr = '[' + finalResult.map(function(a) { return '[' + a.join(', ') + ']'; }).join(', ') + ']';
            steps.push({
                description: 'Done! Queue is empty, all levels traversed. Result: ' + resultStr,
                action: function() {
                    svgEl.innerHTML = renderSvg(allDone);
                    showQueue([]);
                    showResult(finalResult);
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Result: ' + resultStr + '</strong>';
                },
                undo: function() {}
            });

            // Patch undo
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Level Order Traversal — BFS</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Tree (level-order): <input type="text" id="tree-level-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="tree-level-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">Enter in BFS order. null = empty node. e.g.: 3, 9, 20, null, null, 15, 7</p>' +
            self._createStepDesc(suffix) +
            '<div id="lvl-svg' + suffix + '"></div>' +
            '<div id="lvl-queue' + suffix + '" style="margin-bottom:8px;text-align:center;font-size:0.9rem;"><strong>Queue:</strong> <span style="color:var(--text3);">Empty</span></div>' +
            '<div id="lvl-result' + suffix + '" style="margin-bottom:12px;text-align:center;font-size:0.9rem;"><strong>Result:</strong> <span style="color:var(--text3);">[]</span></div>' +
            '<div id="lvl-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">Starting BFS level-by-level traversal.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#lvl-svg' + suffix);
        var queueEl = container.querySelector('#lvl-queue' + suffix);
        var resultEl = container.querySelector('#lvl-result' + suffix);
        var infoEl = container.querySelector('#lvl-info' + suffix);

        function initSim(treeStr) {
            var steps = buildLevelSteps(treeStr, svgEl, queueEl, resultEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">Please enter a valid tree.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 22);
            queueEl.innerHTML = '<strong>Queue:</strong> <span style="color:var(--text3);">Empty</span>';
            resultEl.innerHTML = '<strong>Result:</strong> <span style="color:var(--text3);">[]</span>';
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting BFS level-by-level traversal.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-level-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-level-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ====================================================================
    // Simulation 4: Tree Traversal (boj-1991)
    // ====================================================================
    _renderVizTreeTraversal: function(container) {
        var self = this;
        var suffix = '-order';
        // Default: A-B-C-D-E-F-G mapped to level-order for input
        // The BOJ problem uses letters, so we keep letter support
        var DEFAULT_TREE = 'A, B, C, D, null, E, F, null, null, null, null, null, G';

        function buildTraversalSteps(treeStr, svgEl, preEl, inEl, postEl, infoEl) {
            var parsed = self._parseLevelOrder(treeStr);
            if (!parsed.length || !parsed[0]) return [];
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var svgW = 460;
            var layout = self._computeTreeLayout(root, svgW, 70, 40);

            // Compute traversal orders
            var preOrder = [], inOrder = [], postOrder = [];
            function preorderDFS(node) {
                if (!node) return;
                preOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
                preorderDFS(node.left);
                preorderDFS(node.right);
            }
            function inorderDFS(node) {
                if (!node) return;
                inorderDFS(node.left);
                inOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
                inorderDFS(node.right);
            }
            function postorderDFS(node) {
                if (!node) return;
                postorderDFS(node.left);
                postorderDFS(node.right);
                postOrder.push({ val: node.val, key: String(node.val) + '_' + node.idx });
            }
            preorderDFS(root);
            inorderDFS(root);
            postorderDFS(root);

            var sep = (typeof preOrder[0].val === 'string') ? '' : ' ';

            function renderSvg(highlights) {
                return self._makeTreeSvg(layout, highlights, svgW, svgH, 20);
            }

            var steps = [];

            // === Phase 1: Preorder ===
            var preCur = [];
            for (var pi = 0; pi < preOrder.length; pi++) {
                var item = preOrder[pi];
                preCur.push(item.val);
                var snapPre = preCur.slice();
                var hl = {};
                for (var j = 0; j < pi; j++) hl[preOrder[j].key] = 'done';
                hl[item.key] = 'pre';
                var isFirst = (pi === 0);
                var isLast = (pi === preOrder.length - 1);
                var desc = isFirst
                    ? 'Preorder: visit root ' + item.val + ' — print itself first, then recurse left -> right'
                    : 'Preorder: visit ' + item.val + ' — print current node, then descend to children';
                if (isLast) {
                    // Mark all done
                    for (var j = 0; j < preOrder.length; j++) hl[preOrder[j].key] = 'done';
                    desc = 'Preorder traversal complete!';
                }
                (function(snapPre, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = snapPre.join(sep);
                            inEl.textContent = '';
                            postEl.textContent = '';
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapPre, JSON.parse(JSON.stringify(hl)), desc);
            }

            // === Phase 2: Inorder ===
            var fullPre = preOrder.map(function(x) { return x.val; }).join(sep);
            var inCur = [];
            for (var ii = 0; ii < inOrder.length; ii++) {
                var item = inOrder[ii];
                inCur.push(item.val);
                var snapIn = inCur.slice();
                var hl = {};
                for (var j = 0; j < ii; j++) hl[inOrder[j].key] = 'done';
                hl[item.key] = 'in';
                var isFirst = (ii === 0);
                var isLast = (ii === inOrder.length - 1);
                var desc = isFirst
                    ? 'Inorder: visit leftmost ' + item.val + ' first — process entire left subtree before printing itself'
                    : 'Inorder: visit ' + item.val + ' — left done, print, then go right';
                if (isLast) {
                    for (var j = 0; j < inOrder.length; j++) hl[inOrder[j].key] = 'done';
                    desc = 'Inorder traversal complete!';
                }
                (function(snapIn, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = fullPre;
                            inEl.textContent = snapIn.join(sep);
                            postEl.textContent = '';
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapIn, JSON.parse(JSON.stringify(hl)), desc);
            }

            // === Phase 3: Postorder ===
            var fullIn = inOrder.map(function(x) { return x.val; }).join(sep);
            var postCur = [];
            for (var pti = 0; pti < postOrder.length; pti++) {
                var item = postOrder[pti];
                postCur.push(item.val);
                var snapPost = postCur.slice();
                var hl = {};
                for (var j = 0; j < pti; j++) hl[postOrder[j].key] = 'done';
                hl[item.key] = 'post';
                var isFirst = (pti === 0);
                var isLast = (pti === postOrder.length - 1);
                var desc = isFirst
                    ? 'Postorder: visit deepest left ' + item.val + ' first — process all children before printing itself'
                    : 'Postorder: visit ' + item.val + ' — both children done, now print';
                if (isLast) {
                    for (var j = 0; j < postOrder.length; j++) hl[postOrder[j].key] = 'done';
                    desc = 'Postorder: print root ' + item.val + ' last — root is always the final output in postorder!';
                }
                (function(snapPost, hl, desc) {
                    steps.push({
                        description: desc,
                        action: function() {
                            svgEl.innerHTML = renderSvg(hl);
                            preEl.textContent = fullPre;
                            inEl.textContent = fullIn;
                            postEl.textContent = snapPost.join(sep);
                            infoEl.innerHTML = desc;
                        },
                        undo: function() {}
                    });
                })(snapPost, JSON.parse(JSON.stringify(hl)), desc);
            }

            // Final step
            var fullPost = postOrder.map(function(x) { return x.val; }).join(sep);
            var allDone = {};
            layout.nodeOrder.forEach(function(k) { allDone[k] = 'done'; });
            steps.push({
                description: 'Done! Preorder: ' + fullPre + ', Inorder: ' + fullIn + ', Postorder: ' + fullPost,
                action: function() {
                    svgEl.innerHTML = renderSvg(allDone);
                    preEl.textContent = fullPre;
                    inEl.textContent = fullIn;
                    postEl.textContent = fullPost;
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ All three traversals complete!</strong>';
                },
                undo: function() {}
            });

            // Patch undo
            for (var i = 1; i < steps.length; i++) {
                (function(idx) {
                    var prevAction = steps[idx - 1].action;
                    steps[idx].undo = function() { prevAction(); };
                })(i);
            }
            steps[0].undo = function() {
                svgEl.innerHTML = renderSvg({});
                preEl.textContent = '';
                inEl.textContent = '';
                postEl.textContent = '';
                infoEl.innerHTML = '<span style="color:var(--text2);">Step through all three traversals.</span>';
            };

            return steps;
        }

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Tree Traversal — Preorder / Inorder / Postorder</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Tree (level-order): <input type="text" id="tree-trav-input" value="' + DEFAULT_TREE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;"></label>' +
            '<button class="btn btn-primary" id="tree-trav-reset">🔄</button></div>' +
            '<p style="color:var(--text3);font-size:0.8rem;margin-bottom:12px;">Enter in BFS order. null = empty node. e.g.: A, B, C, D, null, E, F</p>' +
            self._createStepDesc(suffix) +
            '<div id="trav-svg' + suffix + '"></div>' +
            '<div id="trav-pre' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--accent);">Preorder:</strong> <span id="trav-pre-val' + suffix + '"></span></div>' +
            '<div id="trav-in' + suffix + '" style="margin-bottom:4px;font-size:0.9rem;"><strong style="color:var(--green);">Inorder:</strong> <span id="trav-in-val' + suffix + '"></span></div>' +
            '<div id="trav-post' + suffix + '" style="margin-bottom:12px;font-size:0.9rem;"><strong style="color:#e17055;">Postorder:</strong> <span id="trav-post-val' + suffix + '"></span></div>' +
            '<div id="trav-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"><span style="color:var(--text2);">Step through all three traversals.</span></div>' +
            self._createStepControls(suffix);

        var svgEl = container.querySelector('#trav-svg' + suffix);
        var preEl = container.querySelector('#trav-pre-val' + suffix);
        var inEl = container.querySelector('#trav-in-val' + suffix);
        var postEl = container.querySelector('#trav-post-val' + suffix);
        var infoEl = container.querySelector('#trav-info' + suffix);

        function initSim(treeStr) {
            var steps = buildTraversalSteps(treeStr, svgEl, preEl, inEl, postEl, infoEl);
            if (steps.length === 0) {
                svgEl.innerHTML = '<p style="color:var(--red);text-align:center;">Please enter a valid tree.</p>';
                return;
            }
            // Show initial SVG
            var parsed = self._parseLevelOrder(treeStr);
            var root = parsed[0];
            var h = self._getTreeHeight(root);
            var svgH = Math.max(180, h * 70 + 40);
            var layout = self._computeTreeLayout(root, 460, 70, 40);
            svgEl.innerHTML = self._makeTreeSvg(layout, {}, 460, svgH, 20);
            preEl.textContent = '';
            inEl.textContent = '';
            postEl.textContent = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">Step through all three traversals.</span>';
            self._initStepController(container, steps, suffix);
        }

        initSim(DEFAULT_TREE);

        container.querySelector('#tree-trav-reset').addEventListener('click', function() {
            var val = container.querySelector('#tree-trav-input').value.trim();
            if (!val) val = DEFAULT_TREE;
            self._clearVizState();
            initSim(val);
        });
    },

    // ===== Empty Stub =====
    renderVisualize: function(container) {},
    renderProblem: function(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Basic Trees', desc: 'Practice basic DFS/BFS tree problems (Easy)', problemIds: ['lc-104', 'lc-226'] },
        { num: 2, title: 'Tree Applications', desc: 'Practice tree traversal and level-by-level processing (Medium ~ Silver)', problemIds: ['lc-102', 'boj-1991'] }
    ],

    // ===== Problem List =====
    problems: [
        // ===== Stage 1: Basic Trees =====
        {
            id: 'lc-104',
            title: 'LeetCode 104 - Maximum Depth of Binary Tree',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
            simIntro: 'Observe how DFS recursion finds the maximum depth of a tree.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given the <code>root</code> of a binary tree, return its maximum depth. A binary tree's <strong>maximum depth</strong> is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [3,9,20,null,null,15,7]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [1,null,2]</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>The number of nodes is in the range <code>[0, 10<sup>4</sup>]</code>.</li>
                    <li><code>-100 ≤ Node.val ≤ 100</code></li>
                </ul>
            `,
            hints: [
                { title: 'How do we measure the depth of a tree?', content: 'To find the "maximum depth" of a tree, we ultimately need to <strong>visit every node</strong> while tracking the depth.<br><br>Two approaches come to mind:<br>1. <strong>BFS</strong>: go level by level and count levels<br>2. <strong>DFS</strong>: go deep and track the maximum depth<br><br>Either way, visiting all nodes is unavoidable, so let us find the more concise approach.' },
                { title: 'Think recursively', content: 'Tree problems are a perfect match for recursion. Think of it this way:<br><br><strong>"Max depth of this node = 1 + max(left depth, right depth)"</strong><br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;text-align:center;"><div style="display:flex;justify-content:center;"><span style="padding:3px 10px;background:var(--accent);color:white;border-radius:50%;font-weight:700;">3</span></div><div style="display:flex;justify-content:center;gap:40px;margin-top:4px;"><span style="padding:3px 10px;background:var(--accent);color:white;border-radius:50%;opacity:0.8;">9</span><span style="padding:3px 10px;background:var(--accent);color:white;border-radius:50%;opacity:0.8;">20</span></div><div style="display:flex;justify-content:center;margin-top:4px;margin-left:40px;gap:20px;"><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:50%;opacity:0.6;font-size:0.75rem;">15</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:50%;opacity:0.6;font-size:0.75rem;">7</span></div><div style="margin-top:6px;color:var(--text2);font-size:0.78rem;">depth = 1 + max(1, 2) = <strong style="color:var(--accent);">3</strong></div></div><br><br>Take the larger of the left subtree depth and right subtree depth, and add 1 for the current node.<br><br>Base case: if the node is empty (<span class="lang-py"><code>None</code></span><span class="lang-cpp"><code>nullptr</code></span>), the depth is <strong>0</strong>.' },
                { title: 'One line of code!', content: 'Feel the power of recursion — this single line is all you need:<br><br><span class="lang-py"><code>return 0 if not root else 1 + max(depth(root.left), depth(root.right))</code></span><span class="lang-cpp"><code>return !root ? 0 : 1 + max(maxDepth(root->left), maxDepth(root->right));</code></span><br><br>"Empty node returns 0, otherwise 1 + the larger child depth" — that is everything!' }
            ],
            templates: {
                python: '# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\nclass Solution:\n    def maxDepth(self, root) -> int:\n        if not root:\n            return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))',
                cpp: '/**\n * Definition for a binary tree node.\n * struct TreeNode {\n *     int val;\n *     TreeNode *left;\n *     TreeNode *right;\n * };\n */\nclass Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};'
            },
            solutions: [{
                approach: 'Recursive DFS',
                description: 'Return 0 for an empty node; otherwise return 1 + the larger of left/right subtree depths.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: 'Base Case', desc: 'Return depth 0 for an empty node to stop recursion.', code: 'if not root:\n    return 0' },
                        { title: 'Recursive Calls', desc: 'Recursively compute the depth of left and right subtrees.', code: 'left = self.maxDepth(root.left)\nright = self.maxDepth(root.right)' },
                        { title: 'Return Result', desc: 'Current node (+1) plus the deeper child gives the total depth.', code: 'return 1 + max(left, right)' }
                    ],
                    cpp: [
                        { title: 'Base Case', desc: 'Return 0 for empty node (nullptr).', code: 'if (!root) return 0;' },
                        { title: 'Recursive Calls', desc: 'Use -> to access pointer members.', code: 'int left = maxDepth(root->left);\nint right = maxDepth(root->right);' },
                        { title: 'Return Result', desc: 'Current node (+1) + larger child depth = total max depth.', code: 'return 1 + max(left, right);' }
                    ]
                },
                get templates() { return treeTopic.problems[0].templates; }
            }]
        },
        {
            id: 'lc-226',
            title: 'LeetCode 226 - Invert Binary Tree',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/invert-binary-tree/',
            simIntro: 'Observe how recursion swaps the left and right children of the tree.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given the <code>root</code> of a binary tree, invert the tree, and return its root. Swap the left and right children of every node.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [4,2,7,1,3,6,9]</pre></div>
                    <div><strong>Output</strong><pre>[4,7,2,9,6,3,1]</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [2,1,3]</pre></div>
                    <div><strong>Output</strong><pre>[2,3,1]</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = []</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>The number of nodes is in the range <code>[0, 100]</code>.</li>
                    <li><code>-100 ≤ Node.val ≤ 100</code></li>
                </ul>
            `,
            hints: [
                { title: 'Inverting = swapping left and right', content: '"Inverting a tree" sounds fancy, but it simply means <strong>swapping the left and right children at every node</strong>.<br><br>Since we need to visit every node, any traversal method works — DFS or BFS. The key is "swap at every single node without missing any".' },
                { title: 'Simple with recursion', content: 'Recursion makes this very clean:<br><br>1. <strong>Swap</strong> the current node\'s <code>left</code> and <code>right</code><br>2. Recursively invert the left subtree<br>3. Recursively invert the right subtree<br><br><div style="display:flex;gap:20px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;flex-wrap:wrap;"><div style="text-align:center;"><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:50%;font-weight:700;">4</div><div style="display:flex;gap:12px;margin-top:4px;"><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:50%;opacity:0.8;">2</span><span style="padding:2px 8px;background:var(--accent);color:white;border-radius:50%;opacity:0.8;">7</span></div></div><span style="font-size:1.2rem;color:var(--text3);">→</span><div style="text-align:center;"><div style="padding:3px 10px;background:var(--green);color:white;border-radius:50%;font-weight:700;">4</div><div style="display:flex;gap:12px;margin-top:4px;"><span style="padding:2px 8px;background:var(--green);color:white;border-radius:50%;opacity:0.8;">7</span><span style="padding:2px 8px;background:var(--green);color:white;border-radius:50%;opacity:0.8;">2</span></div></div></div><br><br>Base case: if the node is empty (<span class="lang-py"><code>None</code></span><span class="lang-cpp"><code>nullptr</code></span>), just return.' },
                { title: 'Does the order matter?', content: 'Interesting point — depending on the order of swap and recursion, you get preorder/postorder:<br><br><strong>Preorder</strong> (swap first -> recurse): swap current node, then invert children<br><strong>Postorder</strong> (recurse first -> swap): invert children first, then swap current node<br><br>Both work correctly. However, be careful with <strong>inorder</strong> (recurse left -> swap -> recurse right)! After swapping, left and right are switched, so you end up inverting the same side twice.' }
            ],
            templates: {
                python: 'class Solution:\n    def invertTree(self, root):\n        if not root:\n            return None\n        root.left, root.right = root.right, root.left\n        self.invertTree(root.left)\n        self.invertTree(root.right)\n        return root',
                cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        swap(root->left, root->right);\n        invertTree(root->left);\n        invertTree(root->right);\n        return root;\n    }\n};'
            },
            solutions: [{
                approach: 'Recursive Left-Right Swap',
                description: 'Swap left/right children at each node, and recursively invert the subtrees.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(h)',
                codeSteps: {
                    python: [
                        { title: 'Base Case', desc: 'Empty node has nothing to swap, return None.', code: 'if not root:\n    return None' },
                        { title: 'Swap Left and Right', desc: 'Simultaneously swap the left and right children of the current node.', code: 'root.left, root.right = root.right, root.left' },
                        { title: 'Recursive Calls + Return', desc: 'After swapping, recursively invert the child subtrees.', code: 'self.invertTree(root.left)\nself.invertTree(root.right)\nreturn root' }
                    ],
                    cpp: [
                        { title: 'Base Case', desc: 'nullptr means no children to swap, return immediately.', code: 'if (!root) return nullptr;' },
                        { title: 'Swap Left and Right', desc: 'swap() exchanges pointers. Same as Python simultaneous assignment.', code: 'swap(root->left, root->right);' },
                        { title: 'Recursive Calls + Return', desc: 'After swapping, recursively invert the child subtrees.', code: 'invertTree(root->left);\ninvertTree(root->right);\nreturn root;' }
                    ]
                },
                get templates() { return treeTopic.problems[1].templates; }
            }]
        },
        // ===== Stage 2: Tree Applications =====
        {
            id: 'lc-102',
            title: 'LeetCode 102 - Binary Tree Level Order Traversal',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
            simIntro: 'Observe how BFS traverses the tree level by level.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given the <code>root</code> of a binary tree, return the <strong>level order traversal</strong> of its nodes\' values. (i.e., from left to right, level by level).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [3,9,20,null,null,15,7]</pre></div>
                    <div><strong>Output</strong><pre>[[3],[9,20],[15,7]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = [1]</pre></div>
                    <div><strong>Output</strong><pre>[[1]]</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>root = []</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>The number of nodes is in the range <code>[0, 2000]</code>.</li>
                    <li><code>-1000 ≤ Node.val ≤ 1000</code></li>
                </ul>
            `,
            hints: [
                { title: 'How do we group by level?', content: 'We need to go top-down through the tree, <strong>grouping nodes of the same level together</strong>.<br><br>DFS can do it too — track the depth and add to the corresponding level list. But there is a more natural approach...' },
                { title: 'BFS is perfect!', content: '<strong>BFS (Breadth-First Search)</strong> inherently explores level by level, making it a perfect fit for this problem!<br><br>Key trick: <strong>pop only as many nodes as the current queue size</strong>, and exactly one level is processed.<br><br>As we dequeue nodes and enqueue their children, the next level naturally builds up in the queue.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;"><div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;"><span style="color:var(--text2);min-width:50px;">Level 0:</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;">3</span></div><div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;"><span style="color:var(--text2);min-width:50px;">Level 1:</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.8;">9</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.8;">20</span></div><div style="display:flex;gap:4px;align-items:center;"><span style="color:var(--text2);min-width:50px;">Level 2:</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.6;">15</span><span style="padding:3px 8px;background:var(--accent);color:white;border-radius:4px;opacity:0.6;">7</span></div></div>' },
                { title: '<span class="lang-py">Python: collections.deque</span><span class="lang-cpp">C++: queue</span>', content: '<span class="lang-py">Using Python\'s <code>collections.deque</code>, <code>popleft()</code> is O(1). A regular list\'s <code>pop(0)</code> is O(n) and slow!<br><br>Use <code>for _ in range(len(queue)):</code> to process exactly the current level size, and <code>queue.append()</code> to add children.</span><span class="lang-cpp">Use C++\'s <code>queue&lt;TreeNode*&gt;</code>. Retrieve with <code>q.front()</code> and remove with <code>q.pop()</code>.<br><br>Important: <strong>save <code>int sz = q.size();</code> before the loop</strong>. During the loop, <code>q.push()</code> adds children which changes <code>q.size()</code>!</span>' }
            ],
            templates: {
                python: 'from collections import deque\n\nclass Solution:\n    def levelOrder(self, root):\n        if not root:\n            return []\n        result = []\n        queue = deque([root])\n        while queue:\n            level = []\n            for _ in range(len(queue)):\n                node = queue.popleft()\n                level.append(node.val)\n                if node.left:  queue.append(node.left)\n                if node.right: queue.append(node.right)\n            result.append(level)\n        return result',
                cpp: 'class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> result;\n        if (!root) return result;\n        queue<TreeNode*> q;\n        q.push(root);\n        while (!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for (int i = 0; i < sz; i++) {\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if (node->left)  q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n            result.push_back(level);\n        }\n        return result;\n    }\n};'
            },
            solutions: [{
                approach: 'BFS (using Queue)',
                description: 'Add root to the queue, and at each level, dequeue exactly queue-size nodes to process.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Initialize', desc: 'Prepare the result list and BFS queue, add root to queue.', code: 'result = []\nqueue = deque([root])' },
                        { title: 'Process by Level', desc: 'Dequeue exactly queue-size nodes to process only the current level.', code: 'while queue:\n    level = []\n    for _ in range(len(queue)):\n        node = queue.popleft()\n        level.append(node.val)' },
                        { title: 'Add Children + Return', desc: 'Enqueue children of dequeued nodes to automatically build the next level.', code: '        if node.left:  queue.append(node.left)\n        if node.right: queue.append(node.right)\n    result.append(level)\nreturn result' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Prepare result vector and BFS queue, add root to queue.', code: 'vector<vector<int>> result;\nqueue<TreeNode*> q;\nq.push(root);' },
                        { title: 'Process by Level', desc: 'Save q.size() first -> process exactly current level size.', code: 'while (!q.empty()) {\n    int sz = q.size();  // current level size\n    vector<int> level;\n    for (int i = 0; i < sz; i++) {\n        TreeNode* node = q.front(); q.pop();\n        level.push_back(node->val);' },
                        { title: 'Add Children + Return', desc: 'Enqueue child nodes to naturally build the next level.', code: '        if (node->left)  q.push(node->left);\n        if (node->right) q.push(node->right);\n    }\n    result.push_back(level);\n}\nreturn result;' }
                    ]
                },
                get templates() { return treeTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-1991',
            title: 'BOJ 1991 - Tree Traversal',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1991',
            simIntro: 'See the order in which preorder/inorder/postorder traversals visit nodes.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Write a program that takes a binary tree as input and outputs the results of preorder, inorder, and postorder traversals.</p>
                <p>For example, given the binary tree above,</p>
                <ul>
                    <li>Preorder traversal result: ABDCEFG</li>
                    <li>Inorder traversal result: DBAECFG</li>
                    <li>Postorder traversal result: DBEGFCA</li>
                </ul>
                <p>are the outputs.</p>
                <h4>Input</h4>
                <p>The first line contains the number of nodes N (1 &le; N &le; 26). From the second line, N lines each contain a node and its left and right children. Node names are uppercase letters starting from A, and A is always the root. A period (.) indicates no child.</p>
                <h4>Output</h4>
                <p>Print the preorder traversal result on the first line, the inorder traversal result on the second line, and the postorder traversal result on the third line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>7
A B C
B D .
C E F
D . .
E . .
F . G
G . .</pre></div>
                    <div><strong>Output</strong><pre>ABDCEFG
DBAECFG
DBEGFCA</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li><code>1 ≤ N ≤ 26</code></li>
                    <li>Node names are assigned as uppercase letters starting from A.</li>
                    <li>A is always the root node.</li>
                </ul>
            `,
            hints: [
                { title: 'Pre/In/Postorder — only the order differs', content: 'All three traversals visit in the <strong>left -> right</strong> direction, but differ in <strong>"when to print the current node"</strong>:<br><br><br><br><div style="display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.8rem;"><div style="padding:4px 8px;background:var(--accent);color:white;border-radius:4px;"><strong>Pre</strong>: <u>print</u>→L→R</div><div style="padding:4px 8px;background:#00b894;color:white;border-radius:4px;"><strong>In</strong>: L→<u>print</u>→R</div><div style="padding:4px 8px;background:var(--yellow);color:#333;border-radius:4px;"><strong>Post</strong>: L→R→<u>print</u></div></div><br><strong>Preorder</strong>: print first -> left -> right (root comes first)<br><strong>Inorder</strong>: left -> print -> right (root in the middle)<br><strong>Postorder</strong>: left -> right -> print (root comes last)<br><br>Remember this and the recursive code writes itself!' },
                { title: 'How to store the input?', content: 'The input is given as <code>A B C</code>, so we need to store it somewhere.<br><br><span class="lang-py">Store as <code>tree[node] = (left, right)</code> in a <code>dict</code>, then access children directly with <code>tree["A"]</code> during recursion!</span><span class="lang-cpp">Store in <code>map&lt;char, pair&lt;char, char&gt;&gt;</code>, then access the left child with <code>tree[\'A\'].first</code> and the right child with <code>.second</code>!</span><br><br>Missing children are marked with <code>.</code>, so stop recursion when encountering <code>.</code>.' },
                { title: 'One recursive function for three traversals', content: 'The recursive function structure is identical — <strong>just change where <span class="lang-py"><code>print(node)</code></span><span class="lang-cpp"><code>cout &lt;&lt; node</code></span> goes</strong> to get all three traversals:<br><br><span class="lang-py"><pre>def traverse(node):\n    if node == \'.\': return\n    # print(node) <- here for preorder\n    traverse(tree[node][0])\n    # print(node) <- here for inorder\n    traverse(tree[node][1])\n    # print(node) <- here for postorder</pre></span><span class="lang-cpp"><pre>void traverse(char node) {\n    if (node == \'.\') return;\n    // cout << node; <- here for preorder\n    traverse(tree[node].first);\n    // cout << node; <- here for inorder\n    traverse(tree[node].second);\n    // cout << node; <- here for postorder\n}</pre></span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ntree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)\n\ndef preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])\n\ndef inorder(node):\n    if node == \'.\':\n        return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\':\n        return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')\n\npreorder(\'A\')\nprint()\ninorder(\'A\')\nprint()\npostorder(\'A\')\nprint()',
                cpp: '#include <iostream>\n#include <map>\nusing namespace std;\n\nmap<char, pair<char, char>> tree;\n\nvoid preorder(char node) {\n    if (node == \'.\') return;\n    cout << node;\n    preorder(tree[node].first);\n    preorder(tree[node].second);\n}\n\nvoid inorder(char node) {\n    if (node == \'.\') return;\n    inorder(tree[node].first);\n    cout << node;\n    inorder(tree[node].second);\n}\n\nvoid postorder(char node) {\n    if (node == \'.\') return;\n    postorder(tree[node].first);\n    postorder(tree[node].second);\n    cout << node;\n}\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    for (int i = 0; i < N; i++) {\n        char node, left, right;\n        scanf(" %c %c %c", &node, &left, &right);\n        tree[node] = {left, right};\n    }\n    preorder(\'A\'); cout << "\\n";\n    inorder(\'A\');  cout << "\\n";\n    postorder(\'A\'); cout << "\\n";\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Recursive Traversal',
                description: 'Store the tree in a dictionary, then perform preorder/inorder/postorder traversals with recursive functions.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Store Tree Input', desc: 'Store left/right children of each node in a dictionary.', code: 'tree = {}\nfor _ in range(N):\n    node, left, right = input().split()\n    tree[node] = (left, right)' },
                        { title: 'Preorder Traversal', desc: 'Print -> left -> right order. Visit root first.', code: 'def preorder(node):\n    if node == \'.\':\n        return\n    print(node, end=\'\')\n    preorder(tree[node][0])\n    preorder(tree[node][1])' },
                        { title: 'Inorder/Postorder Traversal', desc: 'Inorder: left -> print -> right. Postorder: left -> right -> print. Only the print position differs.', code: 'def inorder(node):\n    if node == \'.\': return\n    inorder(tree[node][0])\n    print(node, end=\'\')\n    inorder(tree[node][1])\n\ndef postorder(node):\n    if node == \'.\': return\n    postorder(tree[node][0])\n    postorder(tree[node][1])\n    print(node, end=\'\')' }
                    ],
                    cpp: [
                        { title: 'Store Tree Input', desc: 'Store children in map<char, pair<char,char>>.\nSame role as Python dict.', code: 'map<char, pair<char, char>> tree;\nfor (int i = 0; i < N; i++) {\n    char node, left, right;\n    scanf(" %c %c %c", &node, &left, &right);\n    tree[node] = {left, right};\n}' },
                        { title: 'Preorder Traversal', desc: 'Print -> left -> right order.\n.first = left, .second = right.', code: 'void preorder(char node) {\n    if (node == \'.\') return;\n    cout << node;\n    preorder(tree[node].first);\n    preorder(tree[node].second);\n}' },
                        { title: 'Inorder/Postorder Traversal', desc: 'Inorder: left -> print -> right. Postorder: left -> right -> print. Only the cout position differs.', code: 'void inorder(char node) {\n    if (node == \'.\') return;\n    inorder(tree[node].first);\n    cout << node;\n    inorder(tree[node].second);\n}\n\nvoid postorder(char node) {\n    if (node == \'.\') return;\n    postorder(tree[node].first);\n    postorder(tree[node].second);\n    cout << node;\n}' }
                    ]
                },
                get templates() { return treeTopic.problems[3].templates; }
            }]
        }
    ]
};

// ===== Register =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.tree = treeTopic;
