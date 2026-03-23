// =========================================================
// Linked List Topic Module
// =========================================================
const linkedListTopic = {
    id: 'linkedlist',
    title: 'Linked List',
    icon: '🔗',
    category: 'Fundamentals (Bronze~Silver)',
    order: 5,
    description: 'Nodes and pointers, singly/doubly linked lists, cycle detection and reversal',
    relatedNote: 'Beyond this, there are also advanced concepts such as doubly linked lists, LRU cache (hashmap + list), skip lists, and more.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'lc-206':   { type: 'Pointer Manipulation',  color: 'var(--accent)', vizMethod: '_renderVizReverse' },
        'lc-21':    { type: 'Merge Technique',    color: 'var(--green)',  vizMethod: '_renderVizMerge' },
        'lc-141':   { type: 'Cycle Detection',  color: '#e17055',      vizMethod: '_renderVizCycle' },
        'boj-1158': { type: 'Circular Simulation', color: '#6c5ce7',   vizMethod: '_renderVizJosephus' }
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
            sim:     { intro: prob.simIntro || 'See how the concepts from the hints actually work in practice.', icon: '🎮' },
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
                '<span class="hint-step-toggle">▾</span></div>' +
                '<div class="hint-step-body">' + hint.content + '</div>';
            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('opened') ? '▴' : '▾';
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
        if (prob.solutions && prob.solutions.length > 0) {
            window.renderSolutionsCodeTab(contentEl, prob);
            return;
        }
        var isLC = prob.link.includes('leetcode');
        var wrapper = document.createElement('div');
        wrapper.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;flex-wrap:wrap;">' +
            '<select class="str-lang-select" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;background:var(--card);color:var(--text);">' +
            '<option value="python">Python</option><option value="cpp">C++</option></select>' +
            '<a href="' + prob.link + '" target="_blank" class="btn btn-primary" style="font-size:0.85rem;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>' +
            '<div class="code-block"><pre><code class="language-python"></code></pre></div>';
        var codeEl = wrapper.querySelector('code');
        codeEl.textContent = prob.templates.python;
        if (window.hljs) hljs.highlightElement(codeEl);
        wrapper.querySelector('.str-lang-select').addEventListener('change', function() {
            var lang = this.value;
            codeEl.className = 'language-' + (lang === 'cpp' ? 'cpp' : lang);
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });
        contentEl.appendChild(wrapper);
    },

    // ===== Concept Tab =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔗 Linked List</h2>
                <p class="hero-sub">Let's learn about the dynamic data structure connected by nodes and pointers!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is a Linked List?</div>
                <div class="analogy-box">
                    Ever done a treasure hunt where each clue tells you where to find the next one? A linked list works exactly like that! Each stop along the way is called a <strong>node</strong>, and it holds two things: some data and a note saying "the next node is over there."
                    You start at the first node, called the <strong>head</strong>, and follow the trail from node to node. The cool part? You can easily add a new stop in the middle -- just change two notes. No need to move anything else!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">node</text></svg></div>
                        <h3>Node</h3>
                        <p>Consists of <strong>data</strong> and a <strong>pointer (next) that points to the next node</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">head</text></svg></div>
                        <h3>Head</h3>
                        <p>The starting point of the linked list. Knowing just the head lets you traverse the entire list.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">O(1)</text></svg></div>
                        <h3>Fast Insertion/Deletion</h3>
                        <p>Mid-list insertion/deletion is <strong>O(1)</strong> — instant lookup! (if you know the position) Arrays require O(n) — check one by one.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">O(n)</text></svg></div>
                        <h3>Slow Access</h3>
                        <p>To find the i-th element, you must follow pointers from head i times → <strong>O(n)</strong>. Arrays are O(1)!</p>
                    </div>
                </div>
                <div class="comparison-table" style="margin-top:1.5rem;overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                <thead><tr style="background:var(--bg2);">
                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">Operation</th>
                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Array</th>
                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Linked List</th>
                </tr></thead>
                <tbody>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Index Access</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) ✅</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — must traverse from head</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Insert at Front</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — must shift everything</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) ✅</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Insert in Middle (position known)</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — must shift everything after</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) — just change pointers</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Delete (position known)</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — must shift everything after</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) — just change pointers</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Memory</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);">Requires contiguous space</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);">Scattered is OK (connected by pointers)</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">Cache Performance</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">Good — contiguous memory</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">Poor — scattered memory</td></tr>
                </tbody>
                </table>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🔍 Why is insertion/deletion O(1)? — Step-by-step understanding</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;"><strong>1. What if you insert in the middle of an array?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">[1, 2, <span style="color:var(--yellow);font-weight:600;">★</span>, 3, 4, 5] ← To insert at position 3, you must shift 3, 4, 5 one position back. With n elements, up to n shifts → <strong style="color:var(--red);">O(n)</strong></p>
                        <p style="margin-top:0.8rem;margin-bottom:0.5rem;"><strong>2. What about in a linked list?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">If you already know the node at the insertion point, <strong>just change 2 pointers and you're done</strong>:<br>
                        ① Point the new node's next → to the next node<br>
                        ② Point the previous node's next → to the new node</p>
                        <p style="margin-top:0.8rem;margin-bottom:0.5rem;"><strong>3. So why is it fast?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">Because you <strong>don't need to touch any other nodes</strong> at all! Even with 1 million nodes, just changing 2 pointers completes the insertion → <strong style="color:var(--green);">O(1)</strong></p>
                        <p style="margin-top:0.8rem;font-size:0.85rem;color:var(--text3);">⚠️ The condition "when position is known" is key! If you don't know the position, you must search first, which takes O(n).</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Linked list node definition
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Create list: 1 → 2 → 3 → None
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

# Traversal
node = head
while node:
    print(node.val, end=" → ")
    node = node.next
# Output: 1 → 2 → 3 →</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Linked list node definition
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Create list: 1 → 2 → 3 → nullptr
ListNode* head = new ListNode(1);
head-&gt;next = new ListNode(2);
head-&gt;next-&gt;next = new ListNode(3);

// Traversal
ListNode* node = head;
while (node) {
    cout &lt;&lt; node-&gt;val &lt;&lt; " → ";
    node = node-&gt;next;
}
// Output: 1 → 2 → 3 →</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/tutorial/classes.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: Classes ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/nullptr" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: nullptr ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> Array vs Linked List: An array is like an "apartment building" (find by number instantly O(1)),
                    a linked list is like a "train" (move car by car O(n)). But it's easy to insert a car into a train!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Linked List Traversal</div>
                    <div class="concept-demo-body">
                        <div class="demo-ll-chain" id="ll-demo-traverse-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;"></div>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-traverse-next">Next Node →</button>
                        <button class="concept-demo-btn green" id="ll-demo-traverse-reset" style="display:none;">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-traverse-msg">👆 Click "Next Node" to traverse one step at a time from head! Unlike arrays, you can't jump directly to the i-th element.</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Reversing a Linked List</div>
                <div class="analogy-box">
                    What if you wanted to walk the treasure hunt backwards? You'd need to flip every clue so it points to the <em>previous</em> stop instead of the next one. That's reversing a linked list: take 1→2→3 and turn it into 3→2→1 by flipping each arrow.
                    The trick is simple -- you walk along the list with three helpers named <strong>prev</strong>, <strong>curr</strong>, and <strong>next</strong>, flipping one arrow at a time.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--accent)">prev</text></svg></div>
                        <h3>Step 1</h3>
                        <p>Start with <code>prev = None</code>, <code>curr = head</code>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">→←</text></svg></div>
                        <h3>Step 2</h3>
                        <p>Change <code>curr.next</code> to <code>prev</code> (flip the direction!).</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">▶▶</text></svg></div>
                        <h3>Step 3</h3>
                        <p>Move prev and curr one step forward. When done, prev is the new head!</p>
                    </div>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🤔 Why do we need 3 pointers?</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;">The key to reversal is <code>curr.next = prev</code> (flipping the arrow direction). But at this moment a problem arises:</p>
                        <p style="margin-left:1rem;margin-bottom:0.5rem;color:var(--text2);">
                            <strong>Before:</strong> <code>... ← prev &nbsp; curr → next_node → ...</code><br>
                            <strong>After <code>curr.next = prev</code>:</strong> <code>... ← prev ← curr &nbsp; <span style="color:var(--red);">next_node → ...</span></code>
                        </p>
                        <p style="margin-bottom:0.5rem;">The moment you change <code>curr.next</code> to <code>prev</code>, <strong style="color:var(--red);">you lose the reference to the original next node (next_node)!</strong></p>
                        <p style="margin-bottom:0.5rem;">That's why <strong>before</strong> flipping the direction, we save the next node with <code>next_node = curr.next</code>.</p>
                        <p style="font-size:0.85rem;color:var(--text3);">💡 Summary: <strong>prev</strong> (reversed side) + <strong>curr</strong> (currently processing) + <strong>next_node</strong> (not yet visited side) — we need 3 pointers to manage the boundaries of these three regions.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Reverse linked list (iterative)
def reverseList(head):
    prev = None
    curr = head

    while curr:
        next_node = curr.next  # Save next node
        curr.next = prev       # Flip direction!
        prev = curr            # Move prev
        curr = next_node       # Move curr

    return prev  # prev is the new head</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Reverse linked list (iterative)
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;

    while (curr) {
        ListNode* next_node = curr-&gt;next;  // Save next node
        curr-&gt;next = prev;                  // Flip direction!
        prev = curr;                         // Move prev
        curr = next_node;                    // Move curr
    }

    return prev;  // prev is the new head
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> Reversing a linked list is a fundamental technique that appears frequently in competitive programming!
                    It's great if you can implement both the iterative and recursive versions.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — List Reversal Simulation</div>
                    <div class="concept-demo-body">
                        <div class="demo-ll-chain" id="ll-demo-reverse-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;"></div>
                    </div>
                    <div class="demo-ll-info" id="ll-demo-reverse-info" style="margin-bottom:0.8rem;">
                        <span><strong>prev:</strong> <span id="ll-demo-reverse-prev-val">None</span></span>
                        <span><strong>curr:</strong> <span id="ll-demo-reverse-curr-val">-</span></span>
                        <span><strong>next_node:</strong> <span id="ll-demo-reverse-next-val">-</span></span>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-reverse-step">Next Step →</button>
                        <button class="concept-demo-btn green" id="ll-demo-reverse-reset" style="display:none;">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-reverse-msg">👆 Click "Next Step" to watch prev/curr/next pointers move and arrows flip!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Two Pointers (shrink from both ends): Tortoise and Hare</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think about <em>"running on a circular track"</em>!
                    If a fast runner (fast, 2 steps at a time) and a slow runner (slow, 1 step at a time) run on a circular track,
                    they will always meet. This is how we can perform <strong>cycle detection</strong>!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--accent)">🐢🐇</text></svg></div>
                        <h3>Cycle Detection</h3>
                        <p>slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle! (Floyd's Algorithm)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">mid</text></svg></div>
                        <h3>Finding the Middle Node</h3>
                        <p>When fast reaches the end, slow is exactly in the middle! Finds the middle in a single pass.</p>
                    </div>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🤔 Why does Floyd's Algorithm work?</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;"><strong>1. If there is no cycle?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.8rem;">fast reaches <code>None(nullptr)</code> first. → Confirmed: no cycle!</p>
                        <p style="margin-bottom:0.5rem;"><strong>2. If there is a cycle?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">Both fast and slow enter the cycle. Here's the key insight:</p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">• fast moves <strong>2 steps</strong> per turn, slow moves <strong>1 step</strong> → fast <strong>catches up by 1 step</strong> each turn</p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">• If the cycle length is C, the distance between them decreases by 1 each step</p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.8rem;">• Therefore they <strong>must meet within C steps</strong>! (distance: C, C-1, C-2, ..., 1, <span style="color:var(--green);font-weight:600;">0 = they meet!</span>)</p>
                        <p style="font-size:0.85rem;color:var(--text3);">💡 Analogy: Two runners at different speeds on a circular track will always meet. It's the same principle as the faster runner "lapping" the slower one!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Cycle detection (Floyd's Cycle Detection)
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        if slow == fast:
            return True  # Cycle found!
    return False  # fast reached the end = no cycle

# Find the middle node
def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # slow is at the middle!</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Cycle detection (Floyd's Cycle Detection)
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;          // Move 1 step
        fast = fast-&gt;next-&gt;next;    // Move 2 steps
        if (slow == fast)
            return true;  // Cycle found!
    }
    return false;  // fast reached the end = no cycle
}

// Find the middle node
ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;
        fast = fast-&gt;next-&gt;next;
    }
    return slow;  // slow is at the middle!
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> When you encounter a linked list problem,
                    remember these 4 patterns: "reversal", "cycle detection", "finding the middle", and "merging"!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Tortoise and Hare (Floyd's Cycle Detection)</div>
                    <div class="concept-demo-body">
                        <div id="ll-demo-cycle-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;position:relative;"></div>
                    </div>
                    <div class="demo-ll-info" id="ll-demo-cycle-info" style="margin-bottom:0.8rem;">
                        <span>🐢 <strong>slow:</strong> <span id="ll-demo-cycle-slow-val">node 1</span></span>
                        <span>🐇 <strong>fast:</strong> <span id="ll-demo-cycle-fast-val">node 1</span></span>
                        <span id="ll-demo-cycle-step-count" style="color:var(--text3);">Step: 0</span>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-cycle-step">Next Step →</button>
                        <button class="concept-demo-btn green" id="ll-demo-cycle-reset" style="display:none;">↺ Start Over</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-cycle-msg">👆 Click "Next Step" to watch slow (1 step) and fast (2 steps) move. If they meet inside the cycle, cycle detected!</div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });

        // ========== Inline Demo Interactions ==========

        // ── Common helper: node HTML generation ──
        const _llNodeHtml = (val, labels, cls) => {
            var labelHtml = '';
            if (labels && labels.length) {
                labelHtml = labels.map(l => {
                    var lCls = 'demo-ll-label';
                    if (l === 'head') lCls += ' lbl-head';
                    else if (l === 'prev') lCls += ' lbl-prev';
                    else if (l === 'curr') lCls += ' lbl-curr';
                    else if (l === 'slow' || l === '🐢slow') lCls += ' lbl-slow';
                    else if (l === 'fast' || l === '🐇fast') lCls += ' lbl-fast';
                    return '<span class="' + lCls + '">' + l + '</span>';
                }).join('');
            }
            return '<div class="demo-ll-node">' + labelHtml +
                '<div class="demo-ll-node-box' + (cls ? ' ' + cls : '') + '">' + val + '</div></div>';
        };
        const _llArrowHtml = (reversed) => {
            return '<span class="demo-ll-arrow' + (reversed ? ' rev' : '') + '">' + (reversed ? '←' : '→') + '</span>';
        };

        // --- 1. Traversal Demo ---
        {
            const chainEl = container.querySelector('#ll-demo-traverse-chain');
            const nextBtn = container.querySelector('#ll-demo-traverse-next');
            const resetBtn = container.querySelector('#ll-demo-traverse-reset');
            const msgEl = container.querySelector('#ll-demo-traverse-msg');
            const nodes = [10, 20, 30, 40, 50];
            let currentIdx = -1;

            const renderChain = () => {
                let html = '';
                for (let i = 0; i < nodes.length; i++) {
                    let labels = [];
                    let cls = '';
                    if (i === 0) labels.push('head');
                    if (i === currentIdx) {
                        labels.push('curr');
                        cls = 'current';
                    } else if (i < currentIdx) {
                        cls = 'visited';
                    }
                    html += _llNodeHtml(nodes[i], labels, cls);
                    if (i < nodes.length - 1) html += _llArrowHtml(false);
                }
                html += '<span class="demo-ll-none">None</span>';
                chainEl.innerHTML = html;
            };

            renderChain();

            nextBtn.addEventListener('click', () => {
                if (currentIdx >= nodes.length - 1) return;
                currentIdx++;
                renderChain();
                if (currentIdx === 0) {
                    msgEl.textContent = 'curr = head → Starting at node ' + nodes[currentIdx] + '. A linked list always starts from head!';
                } else if (currentIdx < nodes.length - 1) {
                    msgEl.textContent = 'curr = curr.next → Moved to node ' + nodes[currentIdx] + '. (Reaching the ' + (currentIdx + 1) + 'th node requires ' + currentIdx + ' moves!)';
                } else {
                    msgEl.textContent = 'Arrived at node ' + nodes[currentIdx] + '! curr.next is None, so traversal is complete. Took ' + currentIdx + ' moves total. With an array, arr[' + currentIdx + '] would be O(1)!';
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                currentIdx = -1;
                renderChain();
                msgEl.textContent = '👆 Click "Next Node" to traverse one step at a time from head! Unlike arrays, you can\'t jump directly to the i-th element.';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            });
        }

        // --- 2. Reversal Demo ---
        {
            const chainEl = container.querySelector('#ll-demo-reverse-chain');
            const stepBtn = container.querySelector('#ll-demo-reverse-step');
            const resetBtn = container.querySelector('#ll-demo-reverse-reset');
            const msgEl = container.querySelector('#ll-demo-reverse-msg');
            const prevValEl = container.querySelector('#ll-demo-reverse-prev-val');
            const currValEl = container.querySelector('#ll-demo-reverse-curr-val');
            const nextValEl = container.querySelector('#ll-demo-reverse-next-val');
            const vals = [1, 2, 3, 4, 5];

            let arrows, prevIdx, currIdx, stepNum, done;

            const buildSteps = () => {
                const steps = [];
                steps.push({
                    desc: 'Initialize prev = None, curr = head (node ' + vals[0] + ').',
                    prevI: -1, currI: 0, arrowsState: new Array(vals.length - 1).fill(false), sub: 'init'
                });

                let arrs = new Array(vals.length - 1).fill(false);
                let pI = -1, cI = 0;

                while (cI < vals.length) {
                    const nextI = cI + 1 < vals.length ? cI + 1 : -1;
                    steps.push({
                        desc: 'next_node = curr.next → Save ' + (nextI >= 0 ? 'node ' + vals[nextI] : 'None') + ' temporarily. We\'d lose the next node when flipping the arrow!',
                        prevI: pI, currI: cI, nextI: nextI, arrowsState: arrs.slice(), sub: 'save_next'
                    });
                    const newArrs = arrs.slice();
                    if (cI > 0) newArrs[cI - 1] = true;
                    steps.push({
                        desc: 'curr.next = prev → Flip node ' + vals[cI] + '\'s arrow to point toward ' + (pI >= 0 ? 'node ' + vals[pI] : 'None') + '!',
                        prevI: pI, currI: cI, nextI: nextI, arrowsState: newArrs.slice(), sub: 'flip'
                    });
                    arrs = newArrs;
                    const oldCI = cI;
                    pI = cI;
                    cI = nextI >= 0 ? nextI : vals.length;
                    if (cI < vals.length) {
                        steps.push({
                            desc: 'Advance: prev = node ' + vals[pI] + ', curr = node ' + vals[cI] + '.',
                            prevI: pI, currI: cI, arrowsState: arrs.slice(), sub: 'move'
                        });
                    } else {
                        steps.push({
                            desc: 'curr is now None, so the loop ends! prev (node ' + vals[pI] + ') is the new head. Reversal complete!',
                            prevI: pI, currI: -1, arrowsState: arrs.slice(), sub: 'done'
                        });
                    }
                }
                return steps;
            };

            let steps;

            const renderReverseChain = (step) => {
                let html = '';
                if (step.sub === 'done') {
                    for (let i = vals.length - 1; i >= 0; i--) {
                        let labels = [];
                        let cls = 'reversed';
                        if (i === vals.length - 1) labels.push('head');
                        if (i === step.prevI) labels.push('prev');
                        html += _llNodeHtml(vals[i], labels, cls);
                        if (i > 0) html += _llArrowHtml(false);
                    }
                    html += '<span class="demo-ll-none">None</span>';
                } else {
                    for (let i = 0; i < vals.length; i++) {
                        let labels = [];
                        let cls = '';
                        if (i === 0 && !step.arrowsState.some((v, idx) => idx < i && v)) labels.push('head');
                        if (i === step.prevI) { labels.push('prev'); cls = 'visited'; }
                        if (i === step.currI) { labels.push('curr'); cls = 'current'; }
                        if (step.nextI !== undefined && i === step.nextI && step.sub === 'save_next') { labels.push('next'); }
                        if (i < step.prevI && step.prevI >= 0) cls = 'reversed';
                        html += _llNodeHtml(vals[i], labels, cls);
                        if (i < vals.length - 1) {
                            html += _llArrowHtml(step.arrowsState[i]);
                        }
                    }
                    html += '<span class="demo-ll-none">None</span>';
                }
                chainEl.innerHTML = html;
            };

            const resetReverse = () => {
                steps = buildSteps();
                stepNum = -1;
                done = false;
                let html = '';
                for (let i = 0; i < vals.length; i++) {
                    let labels = i === 0 ? ['head'] : [];
                    html += _llNodeHtml(vals[i], labels, '');
                    if (i < vals.length - 1) html += _llArrowHtml(false);
                }
                html += '<span class="demo-ll-none">None</span>';
                chainEl.innerHTML = html;
                prevValEl.textContent = 'None';
                currValEl.textContent = '-';
                nextValEl.textContent = '-';
                msgEl.textContent = '👆 Click "Next Step" to watch prev/curr/next pointers move and arrows flip!';
                stepBtn.style.display = '';
                resetBtn.style.display = 'none';
            };

            resetReverse();

            stepBtn.addEventListener('click', () => {
                if (done) return;
                stepNum++;
                if (stepNum >= steps.length) return;
                const step = steps[stepNum];
                renderReverseChain(step);
                msgEl.textContent = step.desc;
                prevValEl.textContent = step.prevI >= 0 ? vals[step.prevI] : 'None';
                currValEl.textContent = step.currI >= 0 ? vals[step.currI] : 'None';
                nextValEl.textContent = step.nextI !== undefined && step.nextI >= 0 ? vals[step.nextI] : '-';
                if (step.sub === 'done') {
                    done = true;
                    stepBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                resetReverse();
            });
        }

        // --- 3. Tortoise and Hare (Floyd's Cycle) Demo ---
        {
            const chainEl = container.querySelector('#ll-demo-cycle-chain');
            const stepBtn = container.querySelector('#ll-demo-cycle-step');
            const resetBtn = container.querySelector('#ll-demo-cycle-reset');
            const msgEl = container.querySelector('#ll-demo-cycle-msg');
            const slowValEl = container.querySelector('#ll-demo-cycle-slow-val');
            const fastValEl = container.querySelector('#ll-demo-cycle-fast-val');
            const stepCountEl = container.querySelector('#ll-demo-cycle-step-count');

            const vals = [1, 2, 3, 4, 5];
            const cycleBackTo = 2;
            let slowIdx, fastIdx, stepCount, met;

            const renderCycleChain = () => {
                let html = '';
                for (let i = 0; i < vals.length; i++) {
                    let labels = [];
                    let cls = '';
                    if (i === 0) labels.push('head');
                    if (i === slowIdx && i === fastIdx) {
                        if (met) {
                            labels.push('🐢🐇met!');
                            cls = 'meet';
                        } else {
                            labels.push('🐢slow');
                            labels.push('🐇fast');
                            cls = 'current';
                        }
                    } else {
                        if (i === slowIdx) { labels.push('🐢slow'); cls = 'slow'; }
                        if (i === fastIdx) { labels.push('🐇fast'); cls = 'fast'; }
                    }
                    html += _llNodeHtml(vals[i], labels, cls);
                    if (i < vals.length - 1) {
                        html += _llArrowHtml(false);
                    }
                }
                html += '<span class="demo-ll-arrow" style="color:var(--red);font-weight:700;" title="cycle: back to node ' + vals[cycleBackTo] + '">↩ ' + vals[cycleBackTo] + '</span>';
                chainEl.innerHTML = html;
            };

            const resetCycle = () => {
                slowIdx = 0;
                fastIdx = 0;
                stepCount = 0;
                met = false;
                renderCycleChain();
                slowValEl.textContent = 'node ' + vals[0];
                fastValEl.textContent = 'node ' + vals[0];
                stepCountEl.textContent = 'Step: 0';
                msgEl.textContent = '👆 Click "Next Step" to watch slow (1 step) and fast (2 steps) move. If they meet inside the cycle, cycle detected!';
                stepBtn.style.display = '';
                resetBtn.style.display = 'none';
            };

            const nextIdx = (idx) => {
                if (idx === vals.length - 1) return cycleBackTo;
                return idx + 1;
            };

            resetCycle();

            stepBtn.addEventListener('click', () => {
                if (met) return;
                stepCount++;
                slowIdx = nextIdx(slowIdx);
                fastIdx = nextIdx(nextIdx(fastIdx));

                renderCycleChain();
                slowValEl.textContent = 'node ' + vals[slowIdx];
                fastValEl.textContent = 'node ' + vals[fastIdx];
                stepCountEl.textContent = 'Step: ' + stepCount;

                if (slowIdx === fastIdx) {
                    met = true;
                    renderCycleChain();
                    msgEl.textContent = '🎉 At step ' + stepCount + ', slow and fast met at node ' + vals[slowIdx] + '! A cycle exists! Since fast catches up by 1 step each turn, they always meet.';
                    stepBtn.style.display = 'none';
                    resetBtn.style.display = '';
                } else {
                    msgEl.textContent = 'Step ' + stepCount + ': slow → node ' + vals[slowIdx] + ' (1 step), fast → node ' + vals[fastIdx] + ' (2 steps). They haven\'t met yet. fast is catching up by 1 step each turn!';
                }
            });

            resetBtn.addEventListener('click', () => {
                resetCycle();
            });
        }
    },

    // ===== Visualization =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },
    _clearVizState() {
        if (this._vizState.keydownHandler) {
            document.removeEventListener('keydown', this._vizState.keydownHandler);
        }
        this._vizState = { steps: [], currentStep: -1, keydownHandler: null };
    },

    renderVisualize(container) { container.innerHTML = ''; },

    _createStepDesc(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
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
        var s = suffix || '';
        var current = -1;
        var actionDelay = 350;
        var counter = container.querySelector('#viz-step-counter' + s);
        var prevBtn = container.querySelector('#viz-prev' + s);
        var nextBtn = container.querySelector('#viz-next' + s);
        if (!counter || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var descEl = container.querySelector('#viz-step-desc' + s);
        var updateUI = function() {
            if (current < 0) {
                counter.textContent = 'Before start';
                if (descEl) descEl.innerHTML = '▶ Click Next to start';
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                counter.textContent = (current + 1) + ' / ' + total;
                if (descEl && steps[current].description) descEl.innerHTML = steps[current].description;
                prevBtn.disabled = current === 0;
                nextBtn.disabled = current >= total - 1;
            }
            self._vizState.currentStep = current;
        };
        nextBtn.addEventListener('click', function() {
            if (current >= total - 1) return;
            current++;
            updateUI();
            setTimeout(function() { steps[current].action('forward'); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (current < 0) return;
            current--;
            updateUI();
            setTimeout(function() {
                if (current >= 0) {
                    steps[current].action('backward');
                }
            }, actionDelay);
        });
        var keyHandler = function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') { nextBtn.click(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
        };
        document.addEventListener('keydown', keyHandler);
        self._vizState.keydownHandler = keyHandler;
        self._vizState.steps = steps;
        updateUI();
    },

    // ── _renderNodeChain: Node chain HTML generation utility ──
    _nodeBox(val, labels, cls) {
        var c = 'str-char-box' + (cls ? ' ' + cls : '');
        var labelHtml = labels && labels.length
            ? '<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.7rem;white-space:nowrap;font-weight:600;color:var(--accent);">' + labels.join(',') + '</div>'
            : '';
        return '<div class="' + c + '" style="min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;position:relative;">' + labelHtml + val + '</div>';
    },

    // ── Reverse Linked List (lc-206) ──
    _renderVizReverse(container) {
        var self = this;
        var DEFAULT_VALUES = [1, 2, 3, 4];

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Node values: <input type="text" id="ll-rev-input" value="' + DEFAULT_VALUES.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="ll-rev-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-rev-wrap" style="position:relative;min-height:80px;padding:20px 0;">' +
            '<div id="ll-nodes-rev" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;"></div>' +
            '<div id="ll-rev-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-rev') + vizHTML + self._createStepControls('-rev');

        var nodesEl = container.querySelector('#ll-nodes-rev');
        var wrapEl = container.querySelector('#ll-rev-wrap');
        var flyEl = container.querySelector('#ll-rev-fly');
        var descEl = container.querySelector('#viz-step-desc-rev');

        function renderNodes(nodes, prevIdx, currIdx, newHead) {
            var html = '';
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var isP = i === prevIdx;
                var isC = i === currIdx;
                var cls = isC ? ' comparing' : (isP ? ' matched' : '');
                var labels = [];
                if (isP) labels.push('prev');
                if (isC) labels.push('curr');
                if (i === newHead) labels.push('new head');
                html += '<div id="ll-rev-pair-' + i + '" style="display:flex;align-items:center;">';
                html += '<div id="ll-rev-node-' + i + '" class="str-char-box' + (cls ? ' ' + cls : '') + '" style="min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;position:relative;">' +
                    (labels.length ? '<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.7rem;white-space:nowrap;font-weight:600;color:var(--accent);">' + labels.join(',') + '</div>' : '') +
                    n.val + '</div>';
                if (n.nextIdx >= 0) {
                    html += '<span id="ll-rev-arrow-' + i + '" style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">&rarr;</span>';
                } else {
                    html += '<span id="ll-rev-arrow-' + i + '" style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">&rarr; None</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
        }

        // Ghost animation: shows a curved arrow from curr node flying back to prev node
        function animatePointerFlip(currNodeIdx, prevNodeIdx, onDone) {
            var currEl = container.querySelector('#ll-rev-node-' + currNodeIdx);
            var prevEl = prevNodeIdx >= 0 ? container.querySelector('#ll-rev-node-' + prevNodeIdx) : null;
            if (!currEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var currRect = currEl.getBoundingClientRect();

            // Create ghost arrow element showing the pointer reversal
            var ghost = document.createElement('div');
            ghost.textContent = '\u21A9';
            ghost.style.cssText = 'position:absolute;z-index:20;font-size:1.6rem;font-weight:700;' +
                'left:' + (currRect.left - wrapRect.left + currRect.width / 2 - 12) + 'px;' +
                'top:' + (currRect.top - wrapRect.top - 8) + 'px;' +
                'color:var(--accent);opacity:0;transform:scale(0.5);' +
                'transition:all 0.45s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);

            // If there's a prev node, also create a flying ghost of the value
            var valueGhost = null;
            if (prevEl) {
                var prevRect = prevEl.getBoundingClientRect();
                valueGhost = document.createElement('div');
                valueGhost.className = 'str-char-box comparing';
                valueGhost.textContent = currEl.textContent.trim();
                valueGhost.style.cssText = 'position:absolute;z-index:21;min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;' +
                    'left:' + (currRect.left - wrapRect.left) + 'px;' +
                    'top:' + (currRect.top - wrapRect.top) + 'px;' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                    'transform:scale(1.15);';
                flyEl.appendChild(valueGhost);
                currEl.style.opacity = '0.2';
            }

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    // Animate the arrow appearing
                    ghost.style.opacity = '1';
                    ghost.style.transform = 'scale(1)';
                    ghost.style.top = (currRect.top - wrapRect.top - 28) + 'px';

                    // Animate value ghost settling back (slight bounce)
                    if (valueGhost) {
                        valueGhost.style.transform = 'scale(1)';
                    }
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (valueGhost && valueGhost.parentNode) valueGhost.parentNode.removeChild(valueGhost);
                if (currEl) currEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(values) {
            var simNodes = values.map(function(v, i) { return { val: v, nextIdx: i < values.length - 1 ? i + 1 : -1 }; });
            var simPrev = -1, simCurr = 0;
            var states = [];
            // Initial state
            states.push({
                nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: -1, currIdx: 0, newHead: -1,
                desc: 'Initial state: ' + values.join(' &rarr; ') + ' &rarr; None. prev = None, curr = head(' + values[0] + '). Three pointers are set up to reverse the direction.',
                animInfo: null
            });

            // Step through reversal — split into sub-steps for granularity
            for (var step = 0; step < values.length; step++) {
                var sc = simCurr;
                var sp = simPrev;
                var snext = simNodes[sc].nextIdx;

                // Sub-step 1: Save next_node
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: sp, currIdx: sc, newHead: -1,
                    desc: 'next_node = curr.next &rarr; save ' + (snext >= 0 ? 'node ' + values[snext] : 'None') + '. We must save the next node before flipping the pointer, or we lose access to the rest of the list!',
                    animInfo: null
                });

                // Sub-step 2: Flip pointer
                simNodes[sc].nextIdx = simPrev;
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: sp, currIdx: sc, newHead: -1,
                    desc: 'curr(' + values[sc] + ').next = prev' + (sp >= 0 ? '(' + values[sp] + ')' : '(None)') + ' &rarr; Flip the arrow direction! This is the core reversal operation.',
                    animInfo: { currNode: sc, prevNode: sp }
                });

                // Sub-step 3: Move prev and curr
                simPrev = sc;
                simCurr = snext;
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: simCurr >= 0 ? simCurr : -1, newHead: -1,
                    desc: 'Move prev = ' + values[simPrev] + ', curr = ' + (simCurr >= 0 && simCurr < values.length ? values[simCurr] : 'None') + '. Advance to process the next node.',
                    animInfo: null
                });

                if (simCurr < 0 || simCurr >= values.length) break;
            }
            var reversed = values.slice().reverse();
            states.push({
                nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: -1, newHead: simPrev,
                desc: 'curr = None, so the loop ends! prev(' + values[simPrev] + ') is the new head. Result: ' + reversed.join(' &rarr; ') + ' &rarr; None &#10003;',
                animInfo: null
            });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderNodes(st.nodes, st.prevIdx, st.currIdx, st.newHead);
                        if (dir === 'forward' && st.animInfo) {
                            animatePointerFlip(st.animInfo.currNode, st.animInfo.prevNode);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var raw = container.querySelector('#ll-rev-input').value;
            var values = raw.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (values.length < 2) values = DEFAULT_VALUES.slice();
            nodesEl.innerHTML = '';
            flyEl.innerHTML = '';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(values);
            self._initStepController(container, steps, '-rev');
        }

        container.querySelector('#ll-rev-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── Merge Two Sorted Lists (lc-21) ──
    _renderVizMerge(container) {
        var self = this;
        var DEFAULT_LIST1 = [1, 2, 4];
        var DEFAULT_LIST2 = [1, 3, 4];

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">List 1: <input type="text" id="ll-merge-input1" value="' + DEFAULT_LIST1.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
            '<label style="font-weight:600;">List 2: <input type="text" id="ll-merge-input2" value="' + DEFAULT_LIST2.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
            '<button class="btn btn-primary" id="ll-merge-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-merge-wrap" style="position:relative;">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">list1</div>' +
            '<div id="ll-list1-merge" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;color:var(--text);">list2</div>' +
            '<div id="ll-list2-merge" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Merged Result</div>' +
            '<div id="ll-result-merge" style="display:flex;gap:4px;flex-wrap:wrap;min-height:40px;"></div>' +
            '</div></div>' +
            '<div id="ll-merge-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-merge') + vizHTML + self._createStepControls('-merge');

        var list1El = container.querySelector('#ll-list1-merge');
        var list2El = container.querySelector('#ll-list2-merge');
        var resultEl = container.querySelector('#ll-result-merge');
        var wrapEl = container.querySelector('#ll-merge-wrap');
        var flyEl = container.querySelector('#ll-merge-fly');
        var descEl = container.querySelector('#viz-step-desc-merge');

        function renderLists(list1, list2, st) {
            list1El.innerHTML = list1.map(function(v, i) {
                var cls = i === st.i1 ? ' comparing' : (i < st.i1 ? ' matched' : '');
                return '<div id="ll-merge-l1-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
            list2El.innerHTML = list2.map(function(v, i) {
                var cls = i === st.i2 ? ' comparing' : (i < st.i2 ? ' matched' : '');
                return '<div id="ll-merge-l2-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
            resultEl.innerHTML = st.result.map(function(v, i) {
                return '<div id="ll-merge-res-' + i + '" class="str-char-box matched" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
        }

        function animateMergeMove(srcId, destIdx, value, onDone) {
            var srcEl = container.querySelector('#' + srcId);
            var destEl = container.querySelector('#ll-merge-res-' + destIdx);
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();

            srcEl.style.opacity = '0.15';
            destEl.style.opacity = '0.15';

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box comparing';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                'transform:scale(1.15);';
            flyEl.appendChild(ghost);

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                    ghost.style.transform = 'scale(1)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (srcEl) srcEl.style.opacity = '';
                if (destEl) destEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(list1, list2) {
            var states = [];
            var i1 = 0, i2 = 0, result = [];
            states.push({ i1: 0, i2: 0, result: [], desc: 'Create a dummy node. By tracking the result via dummy.next, we avoid special-casing the first node.', animInfo: null });

            while (i1 < list1.length && i2 < list2.length) {
                // Step 1: Compare
                states.push({ i1: i1, i2: i2, result: result.slice(),
                    desc: 'Compare list1[' + i1 + ']=' + list1[i1] + ' and list2[' + i2 + ']=' + list2[i2] + '. Since both lists are sorted, comparing only the fronts preserves the overall order.',
                    animInfo: null });
                if (list1[i1] <= list2[i2]) {
                    // Step 2: Pick from list1
                    result.push(list1[i1]);
                    states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                        desc: list1[i1] + ' &le; ' + list2[i2] + ', so connect ' + list1[i1] + ' from list1 to the result. We pick the smaller value to maintain sorted order.',
                        animInfo: { srcId: 'll-merge-l1-' + i1, destIdx: result.length - 1, value: list1[i1] } });
                    i1++;
                } else {
                    // Step 2: Pick from list2
                    result.push(list2[i2]);
                    states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                        desc: list1[i1] + ' &gt; ' + list2[i2] + ', so connect ' + list2[i2] + ' from list2 to the result. We pick the smaller value to maintain sorted order.',
                        animInfo: { srcId: 'll-merge-l2-' + i2, destIdx: result.length - 1, value: list2[i2] } });
                    i2++;
                }
            }
            while (i1 < list1.length) {
                result.push(list1[i1]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                    desc: 'list2 is exhausted! Connect remaining ' + list1[i1] + ' from list1. Since list1 is already sorted, we can append the rest directly.',
                    animInfo: { srcId: 'll-merge-l1-' + i1, destIdx: result.length - 1, value: list1[i1] } });
                i1++;
            }
            while (i2 < list2.length) {
                result.push(list2[i2]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                    desc: 'list1 is exhausted! Connect remaining ' + list2[i2] + ' from list2. Since list2 is already sorted, we can append the rest directly.',
                    animInfo: { srcId: 'll-merge-l2-' + i2, destIdx: result.length - 1, value: list2[i2] } });
                i2++;
            }
            states.push({ i1: i1, i2: i2, result: result.slice(),
                desc: 'Merge complete! Result: [' + result.join(', ') + ']. Two sorted lists have been merged into one sorted list &#10003;', animInfo: null });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderLists(list1, list2, st);
                        if (dir === 'forward' && st.animInfo) {
                            animateMergeMove(st.animInfo.srcId, st.animInfo.destIdx, st.animInfo.value);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var raw1 = container.querySelector('#ll-merge-input1').value;
            var raw2 = container.querySelector('#ll-merge-input2').value;
            var l1 = raw1.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var l2 = raw2.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (l1.length < 1) l1 = DEFAULT_LIST1.slice();
            if (l2.length < 1) l2 = DEFAULT_LIST2.slice();
            l1.sort(function(a, b) { return a - b; });
            l2.sort(function(a, b) { return a - b; });
            list1El.innerHTML = '';
            list2El.innerHTML = '';
            resultEl.innerHTML = '';
            flyEl.innerHTML = '';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(l1, l2);
            self._initStepController(container, steps, '-merge');
        }

        container.querySelector('#ll-merge-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── Linked List Cycle (lc-141) ──
    _renderVizCycle(container) {
        var self = this;
        var DEFAULT_VALS = [3, 2, 0, -4];
        var DEFAULT_CYCLE = 1;

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Node values: <input type="text" id="ll-cycle-input" value="' + DEFAULT_VALS.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
            '<label style="font-weight:600;">Cycle start index: <input type="number" id="ll-cycle-pos" value="' + DEFAULT_CYCLE + '" min="-1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<span style="font-size:0.8rem;color:var(--text-secondary);">(-1 = no cycle)</span>' +
            '<button class="btn btn-primary" id="ll-cycle-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-nodes-cycle" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;min-height:80px;padding:20px 0;"></div>' +
            '<div id="ll-cycle-info" style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-top:4px;"></div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
            '<div style="padding:8px 16px;background:var(--accent)15;border-radius:8px;font-size:0.9rem;">&#x1F422; slow: <span id="ll-slow-val" style="font-weight:700;color:var(--accent);">-</span></div>' +
            '<div style="padding:8px 16px;background:var(--green)15;border-radius:8px;font-size:0.9rem;">&#x1F407; fast: <span id="ll-fast-val" style="font-weight:700;color:var(--green);">-</span></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-cycle') + vizHTML + self._createStepControls('-cycle');

        var nodesEl = container.querySelector('#ll-nodes-cycle');
        var cycleInfoEl = container.querySelector('#ll-cycle-info');
        var slowVal = container.querySelector('#ll-slow-val');
        var fastVal = container.querySelector('#ll-fast-val');
        var descEl = container.querySelector('#viz-step-desc-cycle');

        function renderCycleNodes(nodeVals, cycleStart, slowIdx, fastIdx) {
            var html = '';
            for (var i = 0; i < nodeVals.length; i++) {
                var isSlow = i === slowIdx;
                var isFast = i === fastIdx;
                var cls = (isSlow && isFast) ? ' comparing' : isSlow ? ' matched' : isFast ? ' comparing' : '';
                var labels = [];
                if (isSlow) labels.push('&#x1F422;');
                if (isFast) labels.push('&#x1F407;');
                html += '<div style="display:flex;align-items:center;">';
                html += self._nodeBox(nodeVals[i], labels, cls.trim());
                if (i < nodeVals.length - 1) {
                    html += '<span style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">&rarr;</span>';
                } else if (cycleStart >= 0) {
                    html += '<span style="font-size:1.2rem;color:#e17055;margin:0 2px;">&rarr;&#8617;</span>';
                } else {
                    html += '<span style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">&rarr; None</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
            slowVal.textContent = slowIdx >= 0 ? nodeVals[slowIdx] : '-';
            fastVal.textContent = fastIdx >= 0 ? nodeVals[fastIdx] : '-';
        }

        function buildSteps(nodeVals, cycleStart) {
            var hasCycle = cycleStart >= 0 && cycleStart < nodeVals.length;
            if (hasCycle) {
                cycleInfoEl.innerHTML = '&uarr; Node ' + nodeVals[nodeVals.length - 1] + '\'s next points to node ' + nodeVals[cycleStart] + ' (cycle!)';
            } else {
                cycleInfoEl.innerHTML = 'No cycle &mdash; last node\'s next = None';
            }

            var states = [];
            var slow = 0, fast = 0;
            if (hasCycle) {
                states.push({ slow: 0, fast: 0, desc: 'Initial state: slow = fast = head(' + nodeVals[0] + '). Cycle: ' + nodeVals[nodeVals.length - 1] + ' &rarr; ' + nodeVals[cycleStart] + '.' });
            } else {
                states.push({ slow: 0, fast: 0, desc: 'Initial state: slow = fast = head(' + nodeVals[0] + '). This list has no cycle.' });
            }

            function nextIdx(idx) {
                if (idx === nodeVals.length - 1) {
                    return hasCycle ? cycleStart : -1;
                }
                return idx + 1;
            }

            var maxIter = 30;
            var found = false;
            for (var iter = 0; iter < maxIter; iter++) {
                // slow moves 1 step
                slow = nextIdx(slow);
                if (slow < 0) {
                    states.push({ slow: -1, fast: fast,
                        desc: 'slow reached None! No cycle &rarr; return False' });
                    break;
                }
                // fast moves 2 steps
                fast = nextIdx(fast);
                if (fast < 0) {
                    states.push({ slow: slow, fast: -1,
                        desc: 'fast reached None! No cycle &rarr; return False' });
                    break;
                }
                fast = nextIdx(fast);
                if (fast < 0) {
                    states.push({ slow: slow, fast: -1,
                        desc: 'fast.next reached None! No cycle &rarr; return False' });
                    break;
                }

                if (slow === fast) {
                    states.push({ slow: slow, fast: fast,
                        desc: 'slow=' + nodeVals[slow] + ', fast=' + nodeVals[fast] + ' &rarr; &#x1F389; They met! Cycle confirmed!' });
                    found = true;
                    break;
                } else {
                    states.push({ slow: slow, fast: fast,
                        desc: 'slow &rarr; ' + nodeVals[slow] + ' (1 step), fast &rarr; ' + nodeVals[fast] + ' (2 steps). Not yet equal.' });
                }
            }
            if (found) {
                states.push({ slow: slow, fast: fast,
                    desc: 'Floyd\'s Algorithm complete! slow and fast met at node ' + nodeVals[slow] + ' &rarr; return True &#10003;' });
            }

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function() {
                        renderCycleNodes(nodeVals, cycleStart, st.slow, st.fast);
                        descEl.innerHTML = st.desc;
                    }
                };
            });
        }

        function parseAndRun() {
            var raw = container.querySelector('#ll-cycle-input').value;
            var nodeVals = raw.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (nodeVals.length < 2) nodeVals = DEFAULT_VALS.slice();
            var cycleStart = parseInt(container.querySelector('#ll-cycle-pos').value);
            if (isNaN(cycleStart)) cycleStart = DEFAULT_CYCLE;
            if (cycleStart >= nodeVals.length) cycleStart = nodeVals.length - 1;
            nodesEl.innerHTML = '';
            descEl.innerHTML = '';
            slowVal.textContent = '-';
            fastVal.textContent = '-';
            self._clearVizState();
            var steps = buildSteps(nodeVals, cycleStart);
            self._initStepController(container, steps, '-cycle');
        }

        container.querySelector('#ll-cycle-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── Josephus Problem (boj-1158) ──
    _renderVizJosephus(container) {
        var self = this;
        var DEFAULT_N = 7, DEFAULT_K = 3;

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (people): <input type="number" id="ll-joseph-n" value="' + DEFAULT_N + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">K (interval): <input type="number" id="ll-joseph-k" value="' + DEFAULT_K + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ll-joseph-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-jos-title" style="font-weight:600;margin-bottom:8px;color:var(--text);"></div>' +
            '<div id="ll-jos-wrap" style="position:relative;min-height:50px;padding:12px 0;">' +
            '<div id="ll-circle-jos" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="ll-jos-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:12px;flex-wrap:wrap;">' +
            '<div style="font-weight:600;color:var(--text-secondary);">Elimination order: <span id="ll-removed-jos" style="color:var(--accent);">-</span></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-jos') + vizHTML + self._createStepControls('-jos');

        var josTitleEl = container.querySelector('#ll-jos-title');
        var circleEl = container.querySelector('#ll-circle-jos');
        var wrapEl = container.querySelector('#ll-jos-wrap');
        var flyEl = container.querySelector('#ll-jos-fly');
        var removedEl = container.querySelector('#ll-removed-jos');
        var descEl = container.querySelector('#viz-step-desc-jos');

        function renderQueue(queue, pointer) {
            circleEl.innerHTML = queue.map(function(v, i) {
                var cls = i === pointer ? ' comparing' : '';
                return '<div id="ll-jos-item-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('') || '<span style="color:var(--text-secondary);">Empty queue</span>';
        }

        // Ghost animation: element flies from front (idx 0) to back (last idx)
        function animateJosMove(value, queueLen, onDone) {
            var srcEl = container.querySelector('#ll-jos-item-0');
            var destEl = container.querySelector('#ll-jos-item-' + (queueLen - 1));
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box comparing';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                'transform:scale(1.15);';
            flyEl.appendChild(ghost);
            destEl.style.opacity = '0.15';

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                    ghost.style.transform = 'scale(1)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (destEl) destEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        // Ghost animation: element flies up and fades out (removal)
        function animateJosRemove(value, onDone) {
            var srcEl = container.querySelector('#ll-jos-item-0');
            if (!srcEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:all 0.5s cubic-bezier(.4,0,.2,1);' +
                'background:var(--red);color:white;transform:scale(1.15);opacity:1;';
            flyEl.appendChild(ghost);

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.top = (srcRect.top - wrapRect.top - 40) + 'px';
                    ghost.style.opacity = '0';
                    ghost.style.transform = 'scale(0.5)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(N, K) {
            josTitleEl.textContent = 'Circular Queue (N=' + N + ', K=' + K + ')';

            var states = [];
            var queue = [];
            for (var i = 1; i <= N; i++) queue.push(i);
            var removed = [];

            states.push({ queue: queue.slice(), removed: [], pointer: -1, desc: 'People 1 through ' + N + ' are seated in a circle. Every K=' + K + '-th person is eliminated.', animType: null });

            while (queue.length > 0) {
                for (var j = 0; j < K - 1; j++) {
                    var moved = queue.shift();
                    queue.push(moved);
                    states.push({ queue: queue.slice(), removed: removed.slice(), pointer: queue.length - 1,
                        desc: 'Move #' + (j + 1) + ': Send ' + moved + ' to the back. Queue: [' + queue.join(', ') + ']',
                        animType: 'move', animValue: moved, animQueueLen: queue.length });
                }
                var out = queue.shift();
                removed.push(out);
                states.push({ queue: queue.slice(), removed: removed.slice(), pointer: -1, justRemoved: out,
                    desc: 'Eliminate the ' + K + '-th person: ' + out + '! Elimination order: &lt;' + removed.join(', ') + '&gt;',
                    animType: 'remove', animValue: out });
            }

            states.push({ queue: [], removed: removed.slice(), pointer: -1,
                desc: 'Complete! Josephus permutation: &lt;' + removed.join(', ') + '&gt; &#10003;', animType: null });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderQueue(st.queue, st.pointer);
                        removedEl.textContent = st.removed.length > 0 ? '<' + st.removed.join(', ') + '>' : '-';
                        if (dir === 'forward' && st.animType === 'move') {
                            animateJosMove(st.animValue, st.animQueueLen);
                        } else if (dir === 'forward' && st.animType === 'remove') {
                            animateJosRemove(st.animValue);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var N = parseInt(container.querySelector('#ll-joseph-n').value);
            var K = parseInt(container.querySelector('#ll-joseph-k').value);
            if (isNaN(N) || N < 2) N = DEFAULT_N;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (N > 20) N = 20;
            circleEl.innerHTML = '';
            flyEl.innerHTML = '';
            removedEl.textContent = '-';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(N, K);
            self._initStepController(container, steps, '-jos');
        }

        container.querySelector('#ll-joseph-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ===== Problem Tab =====
    stages: [
        { num: 1, title: 'Basic Linked List', desc: 'Fundamentals of reversal and merging (Easy)', problemIds: ['lc-206', 'lc-21'] },
        { num: 2, title: 'Linked List Applications', desc: 'Cycle detection and simulation (Easy~Silver)', problemIds: ['lc-141', 'boj-1158'] }
    ],

    problems: [
        {
            id: 'lc-206',
            title: 'LeetCode 206 - Reverse Linked List',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/reverse-linked-list/',
            simIntro: 'Watch how the three pointers prev, curr, and next move step by step to reverse the direction.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = [1,2,3,4,5]</pre></div>
                    <div><strong>Output</strong><pre>[5,4,3,2,1]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = [1,2]</pre></div>
                    <div><strong>Output</strong><pre>[2,1]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = []</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>The number of nodes in the list is in the range [0, 5000].</li>
                    <li>-5000 &le; Node.val &le; 5000</li>
                </ul>

                <div class="hint-key">💡 Follow-up: Can you reverse the linked list both iteratively and recursively?</div>
            `,
            hints: [
                { title: 'First thought: Store in array and reverse?', content: 'The first approach that comes to mind — traverse the list, store values in an array, reverse the array, and build a new linked list. Would that work?<br><br>This approach is intuitive and easy, but since you <strong>copy all values into an array</strong>, it requires O(n) extra space. With thousands of nodes, that means an array of thousands of elements... seems wasteful, right?' },
                { title: 'Can we save space?', content: 'What if we could <strong>change the direction of the nodes themselves</strong> without an array? Each node\'s <code>next</code> pointer points to the "next node" — if we change them one by one to point to the "previous node" instead, we can reverse in-place!<br><br>But there\'s one problem — once you change <code>curr.next</code>, <strong>you can\'t move to the next node</strong>. You\'ve lost the address of the next node.' },
                { title: 'In-place reversal with 3 pointers', content: 'That\'s why we need 3 pointers!<br><br>① <code>prev</code> — previous node (target for direction change)<br>② <code>curr</code> — current node<br>③ <code>next_node</code> — next node (saved in advance)<div style="margin:12px 0;"><div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px;">Before (original):</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">4</div><div style="color:var(--text3);">→ null</div></div><div style="text-align:center;margin:6px 0;font-size:0.9rem;color:var(--yellow);">↓ Flip one by one with prev, curr, next</div><div style="font-size:0.8rem;color:var(--green);margin-bottom:6px;">After (reversed):</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="color:var(--text3);">null ←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div></div></div>At each step:<br>1. <code>next_node = curr.next</code> → save next node<br>2. <code>curr.next = prev</code> → flip direction!<br>3. <code>prev = curr</code>, <code>curr = next_node</code> → move one step forward<br><br>This completes the reversal with only <strong>O(1) space</strong>! The recursive version from the follow-up uses the same principle, but stack frames use O(n) space, so iterative is more efficient.' }
            ],
            templates: {
                python: `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev

    # Recursive version
    def reverseList_recursive(self, head):
        if not head or not head.next:
            return head
        new_head = self.reverseList_recursive(head.next)
        head.next.next = head
        head.next = None
        return new_head`,
                cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`
            },
            solutions: [{
                approach: 'Iterative with 3 Pointers',
                description: 'Move step by step with prev, curr, and next pointers to reverse the direction.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: 'Initialize', desc: 'prev=None (start of reversed list), curr=head (current node).\nPrepare two pointers to move step by step and flip directions.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head' },
                        { title: 'Iterative Traversal', desc: 'Repeat until curr becomes None.\nWhen we reach the end of the list, all node directions will be reversed.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:' },
                        { title: 'Flip Direction + Move', desc: 'Core 4 steps: ①save next ②flip curr→prev ③move prev ④move curr.\nIf you don\'t save next first, you lose the next node after changing curr.next.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next  # Save next node\n        curr.next = prev       # Flip direction!\n        prev = curr            # Move prev\n        curr = next_node       # Move curr' },
                        { title: 'Return New Head', desc: 'When the loop ends, curr=None and prev is the last node (= new head).\nThe node that was originally the tail becomes the new head.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev  # prev is the new head' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'prev=nullptr (start of reversed list), curr=head (current node).\nIn C++, use nullptr instead of null.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;  // nullptr → C++ null\n    ListNode* curr = head;' },
                        { title: 'Iterative Traversal', desc: 'Repeat while curr is not nullptr.\nIn C++, pointers can be used as booleans, so while(curr) checks validity.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {  // curr != nullptr' },
                        { title: 'Flip Direction + Move', desc: 'Core 4 steps: ①save next ②flip curr→prev ③move prev ④move curr.\nIn C++, use -> to access members through a pointer.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* next = curr->next;  // Save next node\n        curr->next = prev;            // Flip direction!\n        prev = curr;                  // Move prev\n        curr = next;                  // Move curr' },
                        { title: 'Return New Head', desc: 'When the loop ends, curr=nullptr and prev is the last node (= new head).\nReturn type is ListNode*, so return the pointer directly.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;  // prev is the new head\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-21',
            title: 'LeetCode 21 - Merge Two Sorted Lists',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            simIntro: 'Watch how we select the smaller value from list1 and list2 to build the merged result list.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>list1 = [1,2,4], list2 = [1,3,4]</pre></div>
                    <div><strong>Output</strong><pre>[1,1,2,3,4,4]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>list1 = [], list2 = []</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>list1 = [], list2 = [0]</pre></div>
                    <div><strong>Output</strong><pre>[0]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>The number of nodes in both lists is in the range [0, 50].</li>
                    <li>-100 &le; Node.val &le; 100</li>
                    <li>Both <code>list1</code> and <code>list2</code> are sorted in non-decreasing order.</li>
                </ul>
            `,
            hints: [
                { title: 'How do we merge two lists?', content: 'Since both lists are sorted, can\'t we just compare the heads of both sides and take the smaller one to append to the result list?<div style="margin:12px 0;"><div style="display:flex;align-items:center;gap:4px;justify-content:center;margin-bottom:6px;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--text2);width:40px;text-align:right;">list1:</div><div style="padding:3px 10px;border-radius:5px;border:2px solid var(--yellow);font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">2</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">4</div></div><div style="display:flex;align-items:center;gap:4px;justify-content:center;margin-bottom:6px;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--text2);width:40px;text-align:right;">list2:</div><div style="padding:3px 10px;border-radius:5px;border:2px solid var(--yellow);font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">3</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">4</div></div><div style="text-align:center;font-size:0.85rem;color:var(--yellow);margin:4px 0;">↓ Compare heads, pick the smaller one!</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--green);width:45px;text-align:right;">result:</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div></div></div>It\'s just like merging two sorted piles of cards — compare the top cards of both piles, put down the smaller one. When one pile runs out, just append the rest of the other pile!' },
                { title: 'The dummy node trick', content: 'But there\'s one annoying issue — how do we track the <strong>first node</strong> of the result list?<br><br>If list1.val is smaller, the head of the result is list1; otherwise it\'s list2... handling this branching every time is tedious.<br><br>💡 Create a <strong>dummy node (dummy head)</strong> and append nodes after it? At the end, just return <code>dummy.next</code> — clean and simple for tracking the start node!' },
                { title: 'Recursion works too!', content: 'Instead of a loop, you can also solve this naturally with recursion.<br><br>🔁 <strong>Base case</strong>: If one list is empty, return the other<br>🔁 <strong>Recursive step</strong>: Connect the smaller side\'s <code>next</code> to the recursively merged result of the rest<br><br><span class="lang-py">Python: <code>list1.next = self.mergeTwoLists(list1.next, list2)</code></span><span class="lang-cpp">C++: <code>list1->next = mergeTwoLists(list1->next, list2);</code></span><br><br>The code is shorter and more intuitive, but the recursion depth is O(n+m), so watch out for stack overflow!' }
            ],
            templates: {
                python: `class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        curr = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next

        curr.next = list1 or list2  # Connect remaining list
        return dummy.next`,
                cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
            else { curr->next = l2; l2 = l2->next; }
            curr = curr->next;
        }
        curr->next = l1 ? l1 : l2;
        return dummy.next;
    }
};`
            },
            solutions: [{
                approach: 'Dummy Node Merge',
                description: 'Create a dummy node and connect smaller values from both lists in order.',
                timeComplexity: 'O(n + m)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: 'Create Dummy Node', desc: 'Create a dummy node to use as the starting point of the result list.\nNo special handling needed for the first node, keeping the code clean.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy' },
                        { title: 'Compare Loop', desc: 'Repeat while both lists still have nodes remaining.\nWhen one runs out, append the rest of the other list entirely.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:' },
                        { title: 'Connect Smaller Value', desc: 'Connect the smaller value among the current nodes to curr.next.\nSince the lists are already sorted, always picking the smaller one keeps the result sorted.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next' },
                        { title: 'Connect Remaining + Return', desc: 'When one list runs out, connect the remaining list in its entirety.\nlist1 or list2 is a Python trick that returns whichever is non-empty.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n\n    curr.next = list1 or list2\n    return dummy.next' }
                    ],
                    cpp: [
                        { title: 'Create Dummy Node', desc: 'Create a dummy node on the stack and get its address with &.\nIn C++, creating as a stack variable without new makes memory management easier.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);       // Create dummy node on stack\n    ListNode* curr = &dummy; // Connect via pointer' },
                        { title: 'Compare Loop', desc: 'Repeat while both lists are valid.\nIn C++, a nullptr pointer is false, so use && to check both.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {' },
                        { title: 'Connect Smaller Value', desc: 'Connect the smaller value to curr->next.\nIn C++, use -> instead of . to access members through a pointer.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            curr->next = l1;\n            l1 = l1->next;\n        } else {\n            curr->next = l2;\n            l2 = l2->next;\n        }\n        curr = curr->next;' },
                        { title: 'Connect Remaining + Return', desc: 'Use the ternary operator (? :) to connect the remaining list entirely.\ndummy.next is the actual starting point of the result list.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            curr->next = l1;\n            l1 = l1->next;\n        } else {\n            curr->next = l2;\n            l2 = l2->next;\n        }\n        curr = curr->next;\n    }\n    curr->next = l1 ? l1 : l2;  // Ternary operator to connect remaining list\n    return dummy.next;\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-141',
            title: 'LeetCode 141 - Linked List Cycle',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/linked-list-cycle/',
            simIntro: 'If the tortoise (slow) and hare (fast) meet while moving, a cycle exists!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given <code>head</code>, the head of a linked list, determine if the linked list has a cycle in it.</p>
                <p>There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the <code>next</code> pointer. Internally, <code>pos</code> is used to denote the index of the node that tail's <code>next</code> pointer is connected to (0-indexed). <code>pos</code> is -1 if there is no cycle. Note: <code>pos</code> is not passed as a parameter.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = [3,2,0,-4], pos = 1</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">There is a cycle. The tail connects to node at index 1.</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = [1,2], pos = 0</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">There is a cycle. The tail connects to node at index 0.</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>head = [1], pos = -1</pre></div>
                    <div><strong>Output</strong><pre>false</pre></div>
                </div>
                <p class="example-explain">There is no cycle.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>Number of nodes is in range [0, 10<sup>4</sup>]</li>
                    <li>-10<sup>5</sup> &le; Node.val &le; 10<sup>5</sup></li>
                    <li><code>pos</code> is -1 or a valid index</li>
                </ul>

                <div class="hint-key">💡 Follow-up: Can you solve it using O(1) memory (constant space)?</div>
            `,
            hints: [
                { title: 'First Thought: Keeping Track of Visited Nodes', content: 'Follow nodes one by one and "have I seen this node before?" check if we have<br><br><span class="lang-py">Python <code>set()</code> to store visited nodes, and if we see one again, cycle!</span><span class="lang-cpp">C++ <code>unordered_set&lt;ListNode*&gt;</code> stores visited node addresses, and if we encounter one already in the set, it is a cycle!</span><br><br>This method works reliably, but... if there are 100,000 nodes, the Set also holds 100,000 entries — <strong>O(n) extra space</strong> is required.' },
                { title: 'Can We Do It Without Extra Memory?', content: 'The follow-up asks for <strong>O(1) space</strong>. How can we detect a cycle without storing visited nodes?<br><br>Hint: Think of a running track. If a fast and slow runner run on the same track... <strong>if the track is circular, the fast runner will eventually catch up to the slow runner!</strong> If the track has an end (no cycle), the fast runner reaches the end first.' },
                { title: 'Tortoise and Hare (Floyd\'s Algorithm)', content: '🐢 <code>slow</code> moves one step, 🐇 <code>fast</code> moves two steps!<div style="margin:12px 0;"><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">3</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">2</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">0</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">-4</div><div style="color:var(--red);">↩ back to 2</div></div><div style="display:flex;justify-content:center;gap:16px;margin-top:8px;flex-wrap:wrap;"><div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--green);"></div><div style="font-size:0.75rem;color:var(--text2);">slow: 1 step</div></div><div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--red);"></div><div style="font-size:0.75rem;color:var(--text2);">fast: 2 steps</div></div><div style="font-size:0.75rem;color:var(--yellow);font-weight:600;">They must meet inside the cycle!</div></div></div><strong>If there is a cycle</strong>: After both enter the cycle, fast closes the gap with slow by 1 node each turn. They will eventually meet!<br><strong>If there is no cycle</strong>: fast reaches <code>null</code> first and the loop ends.<br><br>Space O(1), Time O(n) — saves memory compared to the Set approach while maintaining the same time complexity!' }
            ],
            templates: {
                python: `class Solution:
    def hasCycle(self, head) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        return False`,
                cpp: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`
            },
            solutions: [{
                approach: 'Floyd Cycle Detection',
                description: 'Checks if slow (1 step) and fast (2 steps) meet inside a cycle.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: 'Initialize Two Pointers', desc: 'Start both slow and fast at head.\nThe Floyd algorithm detects cycles using two pointers with different speeds.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head' },
                        { title: 'Loop Until Fast Reaches End', desc: 'Both fast and fast.next must exist for a 2-step move.\nIf fast reaches the end, there is no cycle.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:' },
                        { title: 'Move + Compare', desc: 'Move slow 1 step, fast 2 steps, then check if they meet.\nIn a cycle, fast closes the gap by 1 each turn, so they must meet.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next        # 1 step\n        fast = fast.next.next   # 2 steps\n        if slow == fast:\n            return True  # They met!' },
                        { title: 'Return No Cycle', desc: 'If fast reaches the end of the list, there is no cycle.\nTwo pointers use O(1) space vs HashSet O(n) space.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False  # fast reached the end' }
                    ],
                    cpp: [
                        { title: 'Initialize Two Pointers', desc: 'Declare slow and fast as ListNode* pointers.\nUnlike Python, C++ requires explicit pointer types.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;' },
                        { title: 'Loop Until Fast Reaches End', desc: 'Check both fast and fast->next conditions.\nAccessing nullptr causes Segmentation Fault, so validation is required.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {  // pointer validity check' },
                        { title: 'Move + Compare', desc: 'Move slow 1 step (->next), fast 2 steps (->next->next).\nIf there is a cycle, fast catches up and both point to the same address.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;        // 1 step\n        fast = fast->next->next;  // 2 steps\n        if (slow == fast)\n            return true;  // They met!' },
                        { title: 'Return No Cycle', desc: 'If fast reaches nullptr, the list has an end, so there is no cycle.\nReturn type is bool, so use lowercase true/false.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast)\n            return true;\n    }\n    return false;  // fast reached the end\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-1158',
            title: 'BOJ 1158 - Josephus Problem',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1158',
            simIntro: 'Watch the queue simulation of the Josephus problem with N=7, K=3.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>N people sit in a circle numbered from 1 to N, and a positive integer K (&le; N) is given. Starting from the first person, every K-th person is eliminated. Once a person is removed, the process continues around the remaining circle. This process repeats until all N people have been eliminated. The order in which people are removed is called the (N, K)-Josephus permutation. The (7, 3)-Josephus permutation is &lt;3, 6, 2, 7, 5, 1, 4&gt;.</p>
                <h4>Input</h4>
                <p>The first line contains N and K separated by a space. (1 &le; K &le; N &le; 5,000)</p>
                <h4>Output</h4>
                <p>Print the Josephus permutation as shown in the example.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>7 3</pre></div>
                    <div><strong>Output</strong><pre>&lt;3, 6, 2, 7, 5, 1, 4&gt;</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; K &le; N &le; 5,000</li>
                </ul>
            `,
            hints: [
                { title: 'First Thought: Repeatedly Remove K-th from Array', content: 'Put 1 to N in an array and repeatedly find and remove the K-th from the current position?<br><br>Intuitive but there is a problem — removing from the middle requires shifting all elements after it. <strong>Each removal costs O(n)</strong>, and repeating N times gives a total of <strong>O(n&sup2;)</strong>. If N is 5,000, that is 25 million operations... not terribly slow, but not clean either.' },
                { title: 'Efficient Simulation with Queue', content: 'Representing the circular structure with a queue is much cleaner!<br><br>Key idea: Move K-1 people from front to back, then remove the K-th person from front!<div style="margin:12px 0;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.82rem;width:100%;"><thead><tr style="background:var(--bg2);"><th style="padding:5px 8px;border:1px solid var(--bg3);">Step</th><th style="padding:5px 8px;border:1px solid var(--bg3);">Action</th><th style="padding:5px 8px;border:1px solid var(--bg3);">Queue State</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">Init</td><td style="padding:4px 8px;border:1px solid var(--bg3);">-</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[1, 2, 3, 4, 5, 6, 7]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);">1→back, 2→back, <span style="color:var(--red);font-weight:600;">remove 3!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[4, 5, 6, 7, 1, 2]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:4px 8px;border:1px solid var(--bg3);">4→back, 5→back, <span style="color:var(--red);font-weight:600;">remove 6!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[7, 1, 2, 4, 5]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">3</td><td style="padding:4px 8px;border:1px solid var(--bg3);">7→back, 1→back, <span style="color:var(--red);font-weight:600;">remove 2!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[4, 5, 7, 1]</td></tr></tbody></table></div>If dequeue-from-front and enqueue-to-back are both O(1), the entire process becomes a clean <strong>O(nK)</strong>.' },
                { title: '<span class="lang-py">Python deque implementation</span><span class="lang-cpp">C++ queue implementation</span>', content: '<span class="lang-py">Python\'s <code>collections.deque</code> provides O(1) insertion and deletion on both ends!<br><br><code>deque.popleft()</code> removes from front, <code>deque.append()</code> adds to back.<br>Collect results in a list and output in <code>&lt;a, b, c, ...&gt;</code> format to finish!</span><span class="lang-cpp">C++ <code>queue</code> uses <code>front()</code>+<code>pop()</code> to remove from front, and <code>push()</code> to add to back.<br><br>Collect results in a <code>vector</code> and output in <code>&lt;a, b, c, ...&gt;</code> format to finish!</span>' }
            ],
            templates: {
                python: `from collections import deque
import sys
input = sys.stdin.readline

N, K = map(int, input().split())
q = deque(range(1, N + 1))
result = []

while q:
    for _ in range(K - 1):
        q.append(q.popleft())  # Send K-1 people to back
    result.append(q.popleft())  # Remove K-th Person

print('<' + ', '.join(map(str, result)) + '>')`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;
    queue<int> q;
    for (int i = 1; i <= N; i++) q.push(i);

    cout << "<";
    while (!q.empty()) {
        for (int i = 0; i < K - 1; i++) {
            q.push(q.front());
            q.pop();
        }
        cout << q.front(); q.pop();
        if (!q.empty()) cout << ", ";
    }
    cout << ">" << endl;
}`
            },
            solutions: [{
                approach: 'Queue Simulation',
                description: 'Simulate circular structure with deque, removing every K-th person.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(N)',
                get templates() { return linkedListTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: 'Initialize Queue', desc: 'Put 1~N in deque to simulate circular structure.\ndeque has O(1) insertion/deletion on both ends, optimal for circular queue.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []' },
                        { title: 'Move K-1 People to Back', desc: 'Moving K-1 from front to back puts the K-th person at front.\npopleft()->append() implements circular rotation.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())  # send to back' },
                        { title: 'Remove K-th Person', desc: 'After rotation, the front person is K-th, so remove with popleft().\nRecord the removal order in result.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())  # Remove K-th!' },
                        { title: 'Output Result', desc: 'Output in BOJ format <a, b, c, ...> .\nUse sys.stdin.readline for faster input.', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())\n\nprint(\'<\' + \', \'.join(map(str, result)) + \'>\')' }
                    ],
                    cpp: [
                        { title: 'Initialize Queue', desc: 'Put 1~N in queue for circular structure.\nC++ queue supports FIFO with front()/push()/pop().', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);' },
                        { title: 'Move K-1 People to Back', desc: 'Read with front(), push() to back, then pop() from front.\nC++ pop() does not return value, so call front() first.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());  // send to back\n            q.pop();' },
                        { title: 'Remove K-th Person', desc: 'After rotation, front() is K-th person, print and pop().\nAdd comma if not last element.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());\n            q.pop();\n        }\n        cout << q.front();  // Remove K-th!\n        q.pop();\n        if (!q.empty()) cout << ", ";' },
                        { title: 'Output Result', desc: 'Wrap with angle brackets (<>) to match the BOJ output format.\nDirect cout output saves memory.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());\n            q.pop();\n        }\n        cout << q.front();\n        q.pop();\n        if (!q.empty()) cout << ", ";\n    }\n    cout << ">" << endl;\n}' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) { container.innerHTML = ''; },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { linkedListTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.linkedlist = linkedListTopic;
