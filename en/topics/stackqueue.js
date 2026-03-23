// =========================================================
// Stack & Queue Topic Module
// =========================================================
const stackQueueTopic = {
    id: 'stackqueue',
    title: 'Stack & Queue',
    icon: '📦',
    category: 'Fundamentals (Bronze~Silver)',
    order: 3,
    description: 'Principles of LIFO stacks and FIFO queues, bracket validation, and deque usage',
    relatedNote: 'Other commonly tested stack/queue problems include monotone stacks, postfix expression conversion, and sliding window maximum (deque).',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-10828': { type: 'Stack Implementation', color: '#00b894',      vizMethod: '_renderVizStackImpl' },
        'boj-10773': { type: 'Stack Basics',       color: 'var(--accent)', vizMethod: '_renderVizZero' },
        'lc-20':     { type: 'Bracket Validation', color: '#e17055',      vizMethod: '_renderVizParentheses' },
        'boj-2164':  { type: 'Queue Usage',        color: '#6c5ce7',      vizMethod: '_renderVizCard2' },
        'lc-155':    { type: 'Auxiliary Stack',     color: 'var(--green)',  vizMethod: '_renderVizMinStack' }
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
        const self = this;
        const prob = self.problems.find(p => p.id === problemId);
        if (!prob) { container.innerHTML = '<p>Problem not found.</p>'; return; }
        const meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>Problem metadata not found.</p>'; return; }
        self._clearVizState();
        const diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        const flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how the concepts from the hints actually work in practice.', icon: '🎮' },
            code:    { intro: 'Now let\'s turn the approach into code!', icon: '💻' }
        };
        const ft = flowMap[tabId];
        if (ft) {
            const introDiv = document.createElement('div');
            introDiv.className = 'flow-intro';
            introDiv.innerHTML = '<span class="flow-intro-icon">' + ft.icon + '</span><span>' + ft.intro + '</span>';
            container.appendChild(introDiv);
        }
        const contentDiv = document.createElement('div');
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';
        container.appendChild(contentDiv);
        switch (tabId) {
            case 'problem': self._renderProblemTab(contentDiv, prob); break;
            case 'think':   self._renderThinkTab(contentDiv, prob); break;
            case 'sim':     self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }
        const tabOrder = ['problem', 'think', 'sim', 'code'];
        const tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        const ctaTexts = { problem: 'Once you understand the problem,', think: 'Once you\'ve reviewed all hints,', sim: 'Once you understand how it works,' };
        const curIdx = tabOrder.indexOf(tabId);
        if (curIdx >= 0 && curIdx < tabOrder.length - 1) {
            const nextId = tabOrder[curIdx + 1];
            const nextDiv = document.createElement('div');
            nextDiv.className = 'flow-next';
            nextDiv.innerHTML = '<button class="flow-next-btn">' + ctaTexts[tabId] + ' → ' + tabLabels[nextId] + ' →</button>';
            nextDiv.querySelector('button').addEventListener('click', function() { window._switchToTab(nextId); });
            container.appendChild(nextDiv);
        }
    },

    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
        const guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = 'Click each step to reveal hints';
        contentEl.appendChild(guide);
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hint-steps';
        const openedState = {};
        prob.hints.forEach(function(hint, idx) {
            const step = document.createElement('div');
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
        const isLC = prob.link.includes('leetcode');
        const wrapper = document.createElement('div');
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
                <h2>📦 Stack & Queue</h2>
                <p class="hero-sub">Let's learn two rules for inserting and removing data!</p>
            </div>

            <!-- Section 1: Stack -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> Stack</div>
                <div class="analogy-box">
                    Picture a stack of cafeteria trays. You can only grab the tray on top, and when you add a new one, it goes on top too. The last tray you put down is the first one you pick up -- that's called <strong>LIFO</strong>, Last In First Out.
                    Stacks show up everywhere: your browser's "Back" button is a stack of pages, and when your computer runs functions, it uses a stack to remember where to return to!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Push & Pop</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-push">📥 Push</button>
                        <button class="concept-demo-btn danger" id="sq-demo-pop" disabled>📤 Pop</button>
                        <button class="concept-demo-btn green" id="sq-demo-peek" disabled>👀 Peek</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-stack-wrap">
                            <div class="demo-stack-label">Stack</div>
                            <div class="demo-stack" id="sq-demo-stack">
                                <div class="demo-stack-empty">(Empty)</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-stack-msg">👆 Press the Push button to add numbers to the stack!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">push</text></svg></div>
                        <h3>push(x)</h3>
                        <p>Pushes element x onto the top of the stack. <span class="lang-py">In Python, use <code>append()</code></span><span class="lang-cpp">In C++, use <code>push()</code></span>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">pop</text></svg></div>
                        <h3>pop()</h3>
                        <p>Removes and returns the top element. Raises an error if empty! An <code>O(1)</code> — instant — operation.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">peek</text></svg></div>
                        <h3>peek / top</h3>
                        <p>Views the top element without removing it. <span class="lang-py">In Python, use <code>stack[-1]</code></span><span class="lang-cpp">In C++, use <code>stk.top()</code></span>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">LIFO</text></svg></div>
                        <h3>Usage Examples</h3>
                        <p>Used in bracket validation, browser back button, recursion call stack, and DFS implementation.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Basic stack usage (In Python, a list IS a stack!)
stack = []
stack.append(1)   # push → [1]
stack.append(2)   # push → [1, 2]
stack.append(3)   # push → [1, 2, 3]
top = stack[-1]   # peek → 3
val = stack.pop() # pop  → 3, stack = [1, 2]
print(len(stack)) # size → 2</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;stack&gt;
using namespace std;

stack&lt;int&gt; stk;
stk.push(1);          // push → {1}
stk.push(2);          // push → {1, 2}
stk.push(3);          // push → {1, 2, 3}
int top = stk.top();  // peek → 3
stk.pop();            // pop  → {1, 2}
cout &lt;&lt; stk.size();   // size → 2</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: Using Lists as Stacks ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/stack" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: stack ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> What data structure does a web browser's "Back" button use?
                    Visited pages are pushed onto a stack, and pressing Back pops the top!
                </div>
            </div>

            <!-- Section 2: Queue -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Queue</div>
                <div class="analogy-box">
                    Now imagine waiting in line at a movie theater. The person who showed up first gets in first -- fair and simple. New people join at the back, and the person at the front goes in next. That's a <strong>queue</strong>, and the rule is <strong>FIFO</strong>, First In First Out.
                    Your computer uses queues constantly: printing documents, handling web requests, and exploring mazes with BFS all rely on this fair "wait your turn" idea.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Enqueue & Dequeue</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-enqueue">📥 Enqueue (add to back)</button>
                        <button class="concept-demo-btn danger" id="sq-demo-dequeue" disabled>📤 Dequeue (remove from front)</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-queue-wrap">
                            <div class="demo-queue" id="sq-demo-queue">
                                <div class="demo-queue-empty">(Empty)</div>
                            </div>
                            <div class="demo-queue-pointers" id="sq-demo-queue-ptrs" style="display:none;">
                                <div class="demo-pointer" style="color:var(--red);">▲ front</div>
                                <div class="demo-pointer" style="color:var(--green);">▲ back</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-queue-msg">👆 Press the Enqueue button to add data to the queue!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">enqueue</text></svg></div>
                        <h3>enqueue(x)</h3>
                        <p>Adds an element to the back of the queue. <span class="lang-py">Same as <code>append()</code></span><span class="lang-cpp">Same as <code>push()</code></span>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">dequeue</text></svg></div>
                        <h3>dequeue()</h3>
                        <p>Removes an element from the front of the queue. <span class="lang-py">Python <code>deque</code>'s <code>popleft()</code></span><span class="lang-cpp">C++ <code>queue</code>'s <code>front()</code> + <code>pop()</code></span>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">FIFO</text></svg></div>
                        <h3>Usage Examples</h3>
                        <p>Used in BFS traversal, printer queues, and process scheduling.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">from collections import deque

q = deque()
q.append(1)     # enqueue → [1]
q.append(2)     # enqueue → [1, 2]
q.append(3)     # enqueue → [1, 2, 3]
val = q.popleft()  # dequeue → 1, q = [2, 3]
front = q[0]       # peek   → 2

# ⚠️ list.pop(0) is O(n) and slow!
# deque.popleft() is O(1), so always use deque.</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;queue&gt;
using namespace std;

queue&lt;int&gt; q;
q.push(1);           // enqueue → {1}
q.push(2);           // enqueue → {1, 2}
q.push(3);           // enqueue → {1, 2, 3}
int val = q.front(); // peek   → 1
q.pop();             // dequeue → {2, 3}
int f = q.front();   // peek   → 2

// C++ queue: front() to view, pop() to remove
// Both front() and pop() are O(1) operations.</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: queue ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> <span class="lang-py">Why is <code>list.pop(0)</code> slow in Python?
                    Because removing the front element requires shifting all remaining elements one position forward -- O(n)!</span><span class="lang-cpp">Why are <code>front()</code> and <code>pop()</code> separate in a queue?
                    For exception safety -- separating value retrieval from removal is safer!</span>
                </div>
            </div>

            <!-- Section 3: Deque -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Deque (Double-Ended Queue)</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> A deque is like a <em>"tunnel with doors on both ends"</em>!
                    You can insert and remove from both the front and the back.
                    It is a <strong>versatile data structure</strong> that can replace both stacks and queues.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Double-Ended Insert/Remove</div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sq-demo-appendleft">◀ appendleft</button>
                        <button class="concept-demo-btn" id="sq-demo-append">append ▶</button>
                        <button class="concept-demo-btn danger" id="sq-demo-popleft" disabled>◀ popleft</button>
                        <button class="concept-demo-btn danger" id="sq-demo-popright" disabled>pop ▶</button>
                    </div>
                    <div class="concept-demo-body">
                        <div class="demo-queue-wrap">
                            <div class="demo-queue" id="sq-demo-deque">
                                <div class="demo-queue-empty">(Empty)</div>
                            </div>
                            <div class="demo-queue-pointers" id="sq-demo-deque-ptrs" style="display:none;">
                                <div class="demo-pointer" style="color:var(--red);">▲ front</div>
                                <div class="demo-pointer" style="color:var(--green);">▲ back</div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-deque-msg">👆 Press the buttons to freely insert and remove from both ends!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">←append→</text></svg></div>
                        <h3>Double-Ended Insert</h3>
                        <p><span class="lang-py"><code>appendleft(x)</code>: add to front, <code>append(x)</code>: add to back.</span><span class="lang-cpp"><code>push_front(x)</code>: add to front, <code>push_back(x)</code>: add to back.</span> All O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--red, #e17055)">←pop→</text></svg></div>
                        <h3>Double-Ended Remove</h3>
                        <p><span class="lang-py"><code>popleft()</code>: remove from front, <code>pop()</code>: remove from back.</span><span class="lang-cpp"><code>pop_front()</code>: remove from front, <code>pop_back()</code>: remove from back.</span> All O(1)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">from collections import deque

dq = deque([1, 2, 3])
dq.appendleft(0)  # [0, 1, 2, 3]
dq.append(4)      # [0, 1, 2, 3, 4]
dq.popleft()       # 0,  dq = [1, 2, 3, 4]
dq.pop()           # 4,  dq = [1, 2, 3]

# Deques are also used for sliding window max/min!
# Setting maxlen automatically removes old elements.
dq = deque(maxlen=3)
dq.append(1); dq.append(2); dq.append(3)  # [1, 2, 3]
dq.append(4)  # [2, 3, 4] ← 1 is automatically removed!</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;deque&gt;
using namespace std;

deque&lt;int&gt; dq = {1, 2, 3};
dq.push_front(0);  // {0, 1, 2, 3}
dq.push_back(4);   // {0, 1, 2, 3, 4}
dq.pop_front();    // removes 0, dq = {1, 2, 3, 4}
dq.pop_back();     // removes 4, dq = {1, 2, 3}

// Deques are also used for sliding window max/min!
// In C++, you manage size limits manually.
deque&lt;int&gt; dq2;
dq2.push_back(1); dq2.push_back(2); dq2.push_back(3);
dq2.push_back(4);
if (dq2.size() > 3) dq2.pop_front();
// dq2 = {2, 3, 4} ← 1 is manually removed!</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: collections.deque ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/deque" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: deque ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> What if a problem asks you to "implement a stack"?
                    <span class="lang-py">In Python, just use a list! <code>append()</code> and <code>pop()</code> are both O(1).
                    Only use <code>deque</code> when implementing a queue.</span><span class="lang-cpp">In C++, use <code>stack&lt;int&gt;</code>! <code>push()</code> and <code>pop()</code> are both O(1).
                    For queues use <code>queue&lt;int&gt;</code>, and for deques use <code>deque&lt;int&gt;</code>.</span>
                </div>
            </div>

            <!-- Section 3.5: Stack vs Queue vs Deque Comparison -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3.5</span> Stack vs Queue vs Deque — What's the Difference?</div>
                <p style="margin-bottom:1.2rem;line-height:1.75;">All three data structures are used to <strong>insert and remove data</strong>. But they differ in <em>where</em> insertions and removals happen. The table below gives you a quick comparison.</p>
                <div style="overflow-x:auto;margin-bottom:1.5rem;">
                    <table style="width:100%;border-collapse:collapse;font-size:0.9rem;line-height:1.75;">
                        <thead>
                            <tr style="background:var(--bg2);border-bottom:2px solid var(--accent);">
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Data Structure</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Insert Where</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Remove Where</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Time Complexity</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Typical Use Cases</th>
                                <th style="padding:12px 16px;text-align:left;font-weight:700;">Implementation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid var(--bg3);">
                                <td style="padding:12px 16px;font-weight:600;">Stack</td>
                                <td style="padding:12px 16px;">Back (top)</td>
                                <td style="padding:12px 16px;">Back (top)</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> push/pop</td>
                                <td style="padding:12px 16px;">Bracket validation, DFS, undo</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>list</code> (append/pop)</span><span class="lang-cpp"><code>stack&lt;T&gt;</code></span></td>
                            </tr>
                            <tr style="border-bottom:1px solid var(--bg3);">
                                <td style="padding:12px 16px;font-weight:600;">Queue</td>
                                <td style="padding:12px 16px;">Back</td>
                                <td style="padding:12px 16px;">Front</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> enqueue/dequeue</td>
                                <td style="padding:12px 16px;">BFS, printer queue, scheduling</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>collections.deque</code></span><span class="lang-cpp"><code>queue&lt;T&gt;</code></span></td>
                            </tr>
                            <tr>
                                <td style="padding:12px 16px;font-weight:600;">Deque</td>
                                <td style="padding:12px 16px;">Front + Back</td>
                                <td style="padding:12px 16px;">Front + Back</td>
                                <td style="padding:12px 16px;"><code>O(1)</code> both ends</td>
                                <td style="padding:12px 16px;">Sliding window, stack+queue hybrid</td>
                                <td style="padding:12px 16px;"><span class="lang-py"><code>collections.deque</code></span><span class="lang-cpp"><code>deque&lt;T&gt;</code></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="think-box">
                    <strong>Key Differences:</strong>
                    <ul style="margin:0.5rem 0 0 1.2rem;line-height:1.75;">
                        <li><strong>Stack</strong> inserts and removes from one end (top) only → <strong>LIFO</strong></li>
                        <li><strong>Queue</strong> inserts at the back and removes from the front → <strong>FIFO</strong></li>
                        <li><strong>Deque</strong> inserts and removes from both ends → can replace both stack and queue!</li>
                    </ul>
                    <p style="margin-top:0.8rem;"><span class="lang-py">In Python, <code>collections.deque</code> alone can implement a stack, queue, or deque. For stacks only, a plain list works fine too!</span><span class="lang-cpp">In C++, choose the right container for the job: <code>stack</code>, <code>queue</code>, and <code>deque</code> are each provided separately.</span></p>
                </div>
            </div>

            <!-- Section 4: Bracket Validation Pattern -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Key Stack Pattern: Bracket Validation</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Bracket validation is like a <em>"matching pairs game"</em>!
                    When an opening bracket appears, push it onto the stack. When a closing bracket appears, pop from the stack and check if they match.
                    If the stack is empty at the end, all brackets are properly matched!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Bracket Validation Simulation</div>
                    <div class="demo-paren-input" id="sq-demo-paren-input"></div>
                    <div style="display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:0.8rem;">
                        <div class="demo-paren-stack-label">Stack:</div>
                        <div class="demo-paren-stack" id="sq-demo-paren-stack">
                            <span style="color:var(--text3);font-size:0.85rem;">(Empty)</span>
                        </div>
                    </div>
                    <div class="demo-paren-step-info">
                        <div class="concept-demo-btns" style="margin-bottom:0;">
                            <button class="concept-demo-btn" id="sq-demo-paren-next">Next Step →</button>
                            <button class="concept-demo-btn green" id="sq-demo-paren-reset" style="display:none;">↺ Start Over</button>
                        </div>
                        <span id="sq-demo-paren-counter" style="font-size:0.85rem;color:var(--text2);font-weight:600;"></span>
                    </div>
                    <div class="concept-demo-msg" id="sq-demo-paren-msg">👆 Press "Next Step" to check each bracket one by one!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--accent)">(</text></svg></div>
                        <h3>Step 1</h3>
                        <p>When you encounter an opening bracket <code>( [ {</code>, push it onto the stack.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--red, #e17055)">)</text></svg></div>
                        <h3>Step 2</h3>
                        <p>When you encounter a closing bracket, pop from the stack and check if <strong>they match</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--green)">✓</text></svg></div>
                        <h3>Step 3</h3>
                        <p>After checking everything, if the stack is <strong>empty</strong>, the brackets are valid!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for c in s:
        if c in '([{':
            stack.append(c)     # opening bracket → push
        elif c in ')]}':
            if not stack or stack[-1] != pairs[c]:
                return False    # mismatch!
            stack.pop()         # match found, pop

    return len(stack) == 0  # no remaining brackets

print(is_valid("([{}])"))   # True
print(is_valid("([)]"))     # False</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;stack&gt;
#include &lt;string&gt;
#include &lt;unordered_map&gt;
using namespace std;

bool isValid(string s) {
    stack&lt;char&gt; stk;
    unordered_map&lt;char, char&gt; pairs = {
        {')', '('}, {']', '['}, {'}', '{'}
    };

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            stk.push(c);        // opening bracket → push
        } else if (pairs.count(c)) {
            if (stk.empty() || stk.top() != pairs[c])
                return false;    // mismatch!
            stk.pop();           // match found, pop
        }
    }
    return stk.empty();  // no remaining brackets
}

// isValid("([{}])") → true
// isValid("([)]")   → false</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> Bracket problems are the most classic application of stacks.
                    Once you are comfortable with this pattern, you can apply stacks to any problem that requires "matching with the most recently opened item first"!
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });

        // ========== Inline Demo Interactions ==========

        // ── Common Helper: DOM Element Creation ──
        const _mkItem = (text, enterCls) => {
            const el = document.createElement('div');
            el.className = 'demo-item' + (enterCls ? ' ' + enterCls : '');
            el.textContent = text;
            // Remove class after enter animation ends (for reuse)
            if (enterCls) el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
            return el;
        };
        const _removeItem = (el, removeCls, onDone) => {
            if (!el) { if (onDone) onDone(); return; }
            el.classList.add(removeCls);
            el.addEventListener('animationend', () => { el.remove(); if (onDone) onDone(); }, { once: true });
        };

        // --- 1. Stack Push/Pop Demo (Direct DOM manipulation) ---
        {
            const stackEl = container.querySelector('#sq-demo-stack');
            const pushBtn = container.querySelector('#sq-demo-push');
            const popBtn = container.querySelector('#sq-demo-pop');
            const peekBtn = container.querySelector('#sq-demo-peek');
            const msgEl = container.querySelector('#sq-demo-stack-msg');
            const values = [1, 5, 3, 7, 2, 9];
            let pushIdx = 0;
            let stack = [];
            let animating = false;
            stackEl.innerHTML = '<div class="demo-stack-empty">(Empty)</div>';

            const updateStackTags = () => {
                const items = stackEl.querySelectorAll('.demo-item');
                items.forEach((el, i) => {
                    el.classList.remove('top-item');
                    const tag = el.querySelector('.item-tag');
                    if (tag) tag.remove();
                });
                if (items.length > 0) {
                    const topEl = items[items.length - 1];
                    topEl.classList.add('top-item');
                    const tag = document.createElement('span');
                    tag.className = 'item-tag';
                    tag.style.color = 'var(--accent)';
                    tag.textContent = '← top';
                    topEl.appendChild(tag);
                }
                popBtn.disabled = stack.length === 0 || animating;
                peekBtn.disabled = stack.length === 0 || animating;
                pushBtn.disabled = stack.length >= 6 || animating;
            };

            pushBtn.addEventListener('click', () => {
                if (stack.length >= 6 || animating) return;
                // Remove empty indicator
                const empty = stackEl.querySelector('.demo-stack-empty');
                if (empty) empty.remove();
                const val = values[pushIdx % values.length];
                pushIdx++;
                stack.push(val);
                const el = _mkItem(val, 'enter-stack');
                stackEl.appendChild(el);
                updateStackTags();
                msgEl.textContent = 'push(' + val + ') → Placed ' + val + ' on top of the stack. Stack: [' + stack.join(', ') + ']';
            });

            popBtn.addEventListener('click', () => {
                if (stack.length === 0 || animating) return;
                animating = true;
                const val = stack.pop();
                const topEl = stackEl.querySelector('.demo-item:last-child');
                pushBtn.disabled = true; popBtn.disabled = true; peekBtn.disabled = true;
                _removeItem(topEl, 'remove-up', () => {
                    animating = false;
                    if (stack.length === 0) stackEl.innerHTML = '<div class="demo-stack-empty">(Empty)</div>';
                    updateStackTags();
                });
                msgEl.textContent = 'pop() → Removed ' + val + ' from the top! (LIFO) Stack: [' + stack.join(', ') + ']';
            });

            peekBtn.addEventListener('click', () => {
                if (stack.length === 0) return;
                const val = stack[stack.length - 1];
                msgEl.textContent = 'peek() → The top element is ' + val + '. (Just looking, not removing!)';
                const topEl = stackEl.querySelector('.top-item');
                if (topEl) {
                    topEl.style.transform = 'scale(1.15)';
                    topEl.style.transition = 'transform 0.15s ease';
                    setTimeout(() => { topEl.style.transform = ''; }, 300);
                }
            });
        }

        // --- 2. Queue Enqueue/Dequeue Demo (Direct DOM manipulation) ---
        {
            const queueEl = container.querySelector('#sq-demo-queue');
            const enqBtn = container.querySelector('#sq-demo-enqueue');
            const deqBtn = container.querySelector('#sq-demo-dequeue');
            const ptrsEl = container.querySelector('#sq-demo-queue-ptrs');
            const msgEl = container.querySelector('#sq-demo-queue-msg');
            const letters = 'ABCDEFGH';
            let enqIdx = 0;
            let queue = [];
            let animating = false;
            queueEl.innerHTML = '<div class="demo-queue-empty">(Empty)</div>';

            const updateQueueTags = () => {
                const items = queueEl.querySelectorAll('.demo-item');
                items.forEach(el => el.classList.remove('front-item', 'back-item'));
                if (items.length >= 2) {
                    items[0].classList.add('front-item');
                    items[items.length - 1].classList.add('back-item');
                } else if (items.length === 1) {
                    items[0].classList.add('front-item');
                }
                ptrsEl.style.display = items.length > 1 ? 'flex' : 'none';
                deqBtn.disabled = queue.length === 0 || animating;
                enqBtn.disabled = queue.length >= 6 || animating;
            };

            enqBtn.addEventListener('click', () => {
                if (queue.length >= 6 || animating) return;
                const empty = queueEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = letters[enqIdx % letters.length];
                enqIdx++;
                queue.push(val);
                const el = _mkItem(val, 'enter-right');
                queueEl.appendChild(el);
                updateQueueTags();
                msgEl.textContent = 'enqueue("' + val + '") → Added to the back! Queue: [' + queue.join(', ') + ']';
            });

            deqBtn.addEventListener('click', () => {
                if (queue.length === 0 || animating) return;
                animating = true;
                const val = queue.shift();
                const firstEl = queueEl.querySelector('.demo-item');
                enqBtn.disabled = true; deqBtn.disabled = true;
                _removeItem(firstEl, 'remove-left', () => {
                    animating = false;
                    if (queue.length === 0) queueEl.innerHTML = '<div class="demo-queue-empty">(Empty)</div>';
                    updateQueueTags();
                });
                msgEl.textContent = 'dequeue() → Removed "' + val + '" from the front! (FIFO) Queue: [' + queue.join(', ') + ']';
            });
        }

        // --- 3. Deque Double-Ended Demo (Direct DOM manipulation) ---
        {
            const dequeEl = container.querySelector('#sq-demo-deque');
            const appendLeftBtn = container.querySelector('#sq-demo-appendleft');
            const appendBtn = container.querySelector('#sq-demo-append');
            const popLeftBtn = container.querySelector('#sq-demo-popleft');
            const popRightBtn = container.querySelector('#sq-demo-popright');
            const ptrsEl = container.querySelector('#sq-demo-deque-ptrs');
            const msgEl = container.querySelector('#sq-demo-deque-msg');
            let nextNum = 1;
            let deque = [];
            let animating = false;
            dequeEl.innerHTML = '<div class="demo-queue-empty">(Empty)</div>';

            const updateDequeTags = () => {
                const items = dequeEl.querySelectorAll('.demo-item');
                items.forEach(el => el.classList.remove('front-item', 'back-item'));
                if (items.length >= 2) {
                    items[0].classList.add('front-item');
                    items[items.length - 1].classList.add('back-item');
                } else if (items.length === 1) {
                    items[0].classList.add('front-item');
                }
                ptrsEl.style.display = items.length > 1 ? 'flex' : 'none';
                popLeftBtn.disabled = deque.length === 0 || animating;
                popRightBtn.disabled = deque.length === 0 || animating;
                appendLeftBtn.disabled = deque.length >= 7 || animating;
                appendBtn.disabled = deque.length >= 7 || animating;
            };

            appendLeftBtn.addEventListener('click', () => {
                if (deque.length >= 7 || animating) return;
                const empty = dequeEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = nextNum++;
                deque.unshift(val);
                const el = _mkItem(val, 'enter-left');
                dequeEl.prepend(el);
                updateDequeTags();
                msgEl.textContent = 'appendleft(' + val + ') → Added to front! O(1) Deque: [' + deque.join(', ') + ']';
            });

            appendBtn.addEventListener('click', () => {
                if (deque.length >= 7 || animating) return;
                const empty = dequeEl.querySelector('.demo-queue-empty');
                if (empty) empty.remove();
                const val = nextNum++;
                deque.push(val);
                const el = _mkItem(val, 'enter-right');
                dequeEl.appendChild(el);
                updateDequeTags();
                msgEl.textContent = 'append(' + val + ') → Added to back! O(1) Deque: [' + deque.join(', ') + ']';
            });

            popLeftBtn.addEventListener('click', () => {
                if (deque.length === 0 || animating) return;
                animating = true;
                const val = deque.shift();
                const firstEl = dequeEl.querySelector('.demo-item');
                appendLeftBtn.disabled = true; appendBtn.disabled = true;
                popLeftBtn.disabled = true; popRightBtn.disabled = true;
                _removeItem(firstEl, 'remove-left', () => {
                    animating = false;
                    if (deque.length === 0) dequeEl.innerHTML = '<div class="demo-queue-empty">(Empty)</div>';
                    updateDequeTags();
                });
                msgEl.textContent = 'popleft() → Removed ' + val + ' from front! O(1) Deque: [' + deque.join(', ') + ']';
            });

            popRightBtn.addEventListener('click', () => {
                if (deque.length === 0 || animating) return;
                animating = true;
                const val = deque.pop();
                const lastEl = dequeEl.querySelector('.demo-item:last-child');
                appendLeftBtn.disabled = true; appendBtn.disabled = true;
                popLeftBtn.disabled = true; popRightBtn.disabled = true;
                _removeItem(lastEl, 'remove-right', () => {
                    animating = false;
                    if (deque.length === 0) dequeEl.innerHTML = '<div class="demo-queue-empty">(Empty)</div>';
                    updateDequeTags();
                });
                msgEl.textContent = 'pop() → Removed ' + val + ' from back! O(1) Deque: [' + deque.join(', ') + ']';
            });
        }

        // --- 4. Bracket Validation Step Demo ---
        {
            const input = '([{}])';
            const chars = input.split('');
            const pairs = { ')': '(', ']': '[', '}': '{' };
            const inputEl = container.querySelector('#sq-demo-paren-input');
            const stackEl = container.querySelector('#sq-demo-paren-stack');
            const nextBtn = container.querySelector('#sq-demo-paren-next');
            const resetBtn = container.querySelector('#sq-demo-paren-reset');
            const counterEl = container.querySelector('#sq-demo-paren-counter');
            const msgEl = container.querySelector('#sq-demo-paren-msg');
            let step = 0;
            let stack = [];
            let matchedIndices = [];

            // Initial render
            inputEl.innerHTML = chars.map(c => '<div class="demo-paren-char">' + c + '</div>').join('');
            counterEl.textContent = '0 / ' + (chars.length + 1);

            const renderParenState = () => {
                // Render input string
                const charEls = inputEl.querySelectorAll('.demo-paren-char');
                charEls.forEach((el, i) => {
                    el.className = 'demo-paren-char';
                    if (i === step - 1 && step <= chars.length) el.classList.add('active');
                    if (matchedIndices.includes(i)) el.classList.add('done');
                });

                // Render stack
                if (stack.length === 0) {
                    stackEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">(Empty)</span>';
                } else {
                    stackEl.innerHTML = stack.map(v =>
                        '<div class="demo-item" style="min-width:32px;padding:4px 8px;font-size:1.1rem;">' + v + '</div>'
                    ).join('');
                }
                counterEl.textContent = step + ' / ' + (chars.length + 1);
            };

            nextBtn.addEventListener('click', () => {
                if (step > chars.length) return;

                if (step < chars.length) {
                    const c = chars[step];
                    if ('([{'.includes(c)) {
                        stack.push(c);
                        step++;
                        renderParenState();
                        msgEl.textContent = '"' + c + '" → Opening bracket! Push onto stack. Stack: [' + stack.join(', ') + ']';
                    } else {
                        const top = stack[stack.length - 1];
                        stack.pop();
                        // Find matching pair index
                        const openIdx = chars.lastIndexOf(pairs[c], step - 1);
                        for (let j = step - 1; j >= 0; j--) {
                            if (chars[j] === pairs[c] && !matchedIndices.includes(j)) {
                                matchedIndices.push(j);
                                break;
                            }
                        }
                        matchedIndices.push(step);
                        step++;
                        renderParenState();
                        msgEl.textContent = '"' + c + '" → Closing bracket! pop "' + top + '" → Match found ✓ Stack: [' + stack.join(', ') + ']';
                    }
                } else {
                    // Final verdict
                    step++;
                    renderParenState();
                    if (stack.length === 0) {
                        msgEl.innerHTML = '✅ <strong>Stack is empty, so all brackets are valid!</strong> → return true';
                    } else {
                        msgEl.innerHTML = '❌ <strong>Brackets remain in the stack, so it is invalid!</strong> → return false';
                    }
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                step = 0;
                stack = [];
                matchedIndices = [];
                renderParenState();
                msgEl.textContent = '👆 Press "Next Step" to check each bracket one by one!';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            });
        }

        // think-box toggle
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                if (box) box.classList.toggle('revealed');
            });
        });
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

    // ── Animation Helper: Update DOM element from HTML string ──
    _updateElFromHTML(existingEl, htmlString) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = htmlString;
        const newEl = wrapper.firstElementChild;
        if (!newEl) return;
        existingEl.className = newEl.className;
        existingEl.innerHTML = newEl.innerHTML;
        const newStyle = newEl.getAttribute('style');
        if (newStyle) existingEl.setAttribute('style', newStyle);
        else existingEl.removeAttribute('style');
    },

    // ── Animation Helper: Sync container children to target state ──
    // targetItems: [{html: '<div class="str-char-box ...">value</div>'}]
    // opts: { enterClass, removeClass, removePosition('end'|'start'), emptyHTML, animate }
    _syncContainer(containerEl, targetItems, opts) {
        const self = this;
        const o = opts || {};
        const enterCls = o.enterClass || '';
        const removeCls = o.removeClass || '';
        const removePos = o.removePosition || 'end';
        const emptyHTML = o.emptyHTML || '';
        const animate = o.animate !== false;

        // 1. Clean up ongoing exit animations immediately
        containerEl.querySelectorAll('.anim-removing').forEach(el => el.remove());
        // Also clean up ongoing enter animation classes
        containerEl.querySelectorAll('.anim-enter-stack, .anim-enter-right').forEach(el => {
            el.classList.remove('anim-enter-stack', 'anim-enter-right');
        });

        // 2. Remove empty state placeholder
        const placeholder = containerEl.querySelector('[data-empty]');
        if (placeholder) placeholder.remove();

        // 3. Current .str-char-box elements
        const currentChildren = Array.from(containerEl.querySelectorAll(':scope > .str-char-box'));
        const currentCount = currentChildren.length;
        const targetCount = targetItems.length;

        // 4. Target is empty
        if (targetCount === 0) {
            if (animate && currentCount > 0 && removeCls) {
                // Exit animation on last/first element
                const idx = removePos === 'start' ? 0 : currentCount - 1;
                const el = currentChildren[idx];
                el.classList.add(removeCls, 'anim-removing');
                el.addEventListener('animationend', () => {
                    el.remove();
                    if (containerEl.querySelectorAll(':scope > .str-char-box').length === 0 && emptyHTML) {
                        containerEl.innerHTML = emptyHTML;
                    }
                }, { once: true });
                // Remove the rest immediately
                currentChildren.forEach((c, i) => { if (i !== idx) c.remove(); });
            } else {
                containerEl.innerHTML = emptyHTML;
            }
            return;
        }

        // 5. Currently empty → create all new elements
        if (currentCount === 0) {
            containerEl.innerHTML = '';
            targetItems.forEach((item, i) => {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = item.html;
                const el = wrapper.firstElementChild;
                if (animate && enterCls && i === targetCount - 1) {
                    el.classList.add(enterCls);
                    el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
                }
                containerEl.appendChild(el);
            });
            return;
        }

        // 6. Elements added (push / enqueue)
        if (targetCount > currentCount) {
            // Update existing elements
            for (let i = 0; i < currentCount; i++) {
                self._updateElFromHTML(currentChildren[i], targetItems[i].html);
            }
            // Add new elements
            for (let i = currentCount; i < targetCount; i++) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = targetItems[i].html;
                const el = wrapper.firstElementChild;
                if (animate && enterCls) {
                    el.classList.add(enterCls);
                    el.addEventListener('animationend', () => el.classList.remove(enterCls), { once: true });
                }
                containerEl.appendChild(el);
            }
            return;
        }

        // 7. Elements removed (pop / dequeue)
        if (targetCount < currentCount) {
            if (removePos === 'start') {
                // Queue: remove from front
                const removedCount = currentCount - targetCount;
                for (let i = 0; i < removedCount; i++) {
                    const el = currentChildren[i];
                    if (animate && removeCls) {
                        el.classList.add(removeCls, 'anim-removing');
                        el.addEventListener('animationend', () => el.remove(), { once: true });
                    } else {
                        el.remove();
                    }
                }
                // Update remaining
                for (let i = removedCount; i < currentCount; i++) {
                    self._updateElFromHTML(currentChildren[i], targetItems[i - removedCount].html);
                }
            } else {
                // Stack: remove from end
                for (let i = currentCount - 1; i >= targetCount; i--) {
                    const el = currentChildren[i];
                    if (animate && removeCls) {
                        el.classList.add(removeCls, 'anim-removing');
                        el.addEventListener('animationend', () => el.remove(), { once: true });
                    } else {
                        el.remove();
                    }
                }
                // Update remaining
                for (let i = 0; i < targetCount; i++) {
                    self._updateElFromHTML(currentChildren[i], targetItems[i].html);
                }
            }
            return;
        }

        // 8. Same count → in-place update (CSS transition handles color changes)
        for (let i = 0; i < targetCount; i++) {
            self._updateElFromHTML(currentChildren[i], targetItems[i].html);
        }
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
    },

    _createStepControls(suffix) {
        const s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before Start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix, resetAction) {
        const s = suffix || '';
        const state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        const prevBtn = container.querySelector('#viz-prev' + s);
        const nextBtn = container.querySelector('#viz-next' + s);
        const counter = container.querySelector('#viz-step-counter' + s);
        const desc = container.querySelector('#viz-step-desc' + s);
        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = 'Before Start';
                desc.textContent = '▶ Click Next to start';
            } else {
                counter.textContent = 'Step ' + (idx + 1) + ' / ' + total;
                desc.innerHTML = '<span>' + state.steps[idx].description + '</span>';
            }
        };
        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action('forward'); }, actionDelay);
        });
        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => {
                if (stepToUndo > 0 && state.currentStep >= 0) {
                    state.steps[state.currentStep].action('backward');
                } else if (resetAction) {
                    resetAction();
                }
            }, actionDelay);
        });
        const keyHandler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', keyHandler);
        state.keydownHandler = keyHandler;
        updateUI();
    },

    // ── Stack Implementation (BOJ 10828) Visualization ──
    _renderVizStackImpl(container) {
        const self = this;
        var DEFAULT_CMDS = 'push 1\npush 2\ntop\nsize\npop\npush 3\nempty';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Commands:<br><textarea id="sq-impl-input" style="padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:220px;height:120px;font-family:monospace;resize:vertical;">' + DEFAULT_CMDS + '</textarea></label>' +
            '<button class="btn btn-primary" id="sq-impl-reset" style="margin-top:22px;">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-impl-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Stack</div>' +
            '<div id="sq-stack-impl" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:100px;width:110px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;min-width:160px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Output</div>' +
            '<div id="sq-output-impl" style="font-family:monospace;font-size:0.95rem;line-height:1.8;color:var(--text);min-height:40px;"></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-impl') + vizHTML + self._createStepControls('-impl');

        var stackEl = container.querySelector('#sq-stack-impl');
        var outputEl = container.querySelector('#sq-output-impl');
        var flyEl = container.querySelector('#sq-impl-fly');
        var wrapEl = flyEl.parentElement;

        function parseCmds() {
            var raw = container.querySelector('#sq-impl-input').value;
            return raw.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    var isTip = (i === arr.length - 1);
                    return '<div class="str-char-box' + (isTip ? ' comparing' : '') + '" id="sq-impl-stk-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + (isTip ? ' \u2190top' : '') + '</div>';
                }).join('');
            }
        }

        function renderOutput(lines) {
            outputEl.innerHTML = lines.map(function(l, i) {
                return '<div' + (i === lines.length - 1 ? ' style="color:var(--accent);font-weight:700;"' : '') + '>' + l + '</div>';
            }).join('');
        }

        function animatePush(value, afterArr, onDone) {
            renderStack(afterArr, afterArr.length - 1);
            var dstEl = stackEl.querySelector('#sq-impl-stk-' + (afterArr.length - 1));
            if (!dstEl) { renderStack(afterArr); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + dr.width + 'px;height:' + dr.height + 'px;' +
                'left:' + (dr.left - wr.left) + 'px;top:' + (dr.top - wr.top - 60) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);opacity:0;' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (dr.top - wr.top) + 'px';
                ghost.style.opacity = '1';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterArr);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeArr, onDone) {
            renderStack(beforeArr);
            var topEl = stackEl.querySelector('#sq-impl-stk-' + (beforeArr.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeArr[beforeArr.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildImplSteps(cmds) {
            var stepData = [];
            var stack = [];
            var outputs = [];
            stepData.push({ arr: [], outputs: [], cmd: '', desc: 'Process stack commands one by one. There are 5 commands: push, pop, size, empty, top.', pushVal: null, isPop: false });

            cmds.forEach(function(cmd) {
                var parts = cmd.split(/\s+/);
                var op = parts[0];
                if (op === 'push') {
                    var val = parseInt(parts[1], 10);
                    stack = [].concat(stack, [val]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>push ' + val + '</strong> \u2014 Push ' + val + ' onto the stack. No output.', pushVal: val, isPop: false });
                } else if (op === 'pop') {
                    if (stack.length === 0) {
                        outputs = [].concat(outputs, ['-1']);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>pop</strong> \u2014 Stack is empty, so print <span style="color:var(--red);font-weight:700;">-1</span>.', pushVal: null, isPop: false });
                    } else {
                        var popped = stack[stack.length - 1];
                        var before = [].concat(stack);
                        stack = stack.slice(0, -1);
                        outputs = [].concat(outputs, [String(popped)]);
                        stepData.push({ arr: [].concat(stack), beforeArr: before, outputs: [].concat(outputs), cmd: cmd, desc: '<strong>pop</strong> \u2014 Print top value <span style="color:var(--red);font-weight:700;">' + popped + '</span> and remove it.', pushVal: null, isPop: true });
                    }
                } else if (op === 'size') {
                    outputs = [].concat(outputs, [String(stack.length)]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>size</strong> \u2014 Stack has ' + stack.length + ' element(s), print <span style="color:var(--accent);font-weight:700;">' + stack.length + '</span>.', pushVal: null, isPop: false });
                } else if (op === 'empty') {
                    var res = stack.length === 0 ? '1' : '0';
                    outputs = [].concat(outputs, [res]);
                    stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>empty</strong> \u2014 Stack is ' + (stack.length === 0 ? 'empty' : 'not empty') + ', print <span style="color:var(--accent);font-weight:700;">' + res + '</span>.', pushVal: null, isPop: false });
                } else if (op === 'top') {
                    if (stack.length === 0) {
                        outputs = [].concat(outputs, ['-1']);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>top</strong> \u2014 Stack is empty, so print <span style="color:var(--red);font-weight:700;">-1</span>.', pushVal: null, isPop: false });
                    } else {
                        var topVal = stack[stack.length - 1];
                        outputs = [].concat(outputs, [String(topVal)]);
                        stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: cmd, desc: '<strong>top</strong> \u2014 Top value is <span style="color:var(--green);font-weight:700;">' + topVal + '</span>. Print without removing.', pushVal: null, isPop: false });
                    }
                }
            });
            stepData.push({ arr: [].concat(stack), outputs: [].concat(outputs), cmd: '', desc: 'All commands processed! Output: <strong>' + outputs.join(', ') + '</strong>', pushVal: null, isPop: false });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderOutput(st.outputs);
                        if (dir === 'forward' && st.pushVal !== null) {
                            animatePush(st.pushVal, st.arr, null);
                        } else if (dir === 'forward' && st.isPop && st.beforeArr) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetImplViz() {
            var cmds = parseCmds();
            if (cmds.length === 0) return;
            flyEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            outputEl.innerHTML = '';
            var steps = buildImplSteps(cmds);
            self._initStepController(container, steps, '-impl');
        }

        container.querySelector('#sq-impl-reset').addEventListener('click', resetImplViz);
        resetImplViz();
    },

    // ── Zero (BOJ 10773) Visualization ──
    _renderVizZero(container) {
        const self = this;
        var DEFAULT_ZERO_NUMS = '1, 3, 5, 4, 0, 0, 7, 0, 0, 6';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Input Sequence: <input type="text" id="sq-zero-input" value="' + DEFAULT_ZERO_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="sq-zero-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-zero-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;max-width:320px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Input Sequence</div>' +
            '<div id="sq-input-zero" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Stack</div>' +
            '<div id="sq-stack-zero" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:80px;width:100px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;">' +
            '<div style="font-weight:600;color:var(--text-secondary);">sum = <span id="sq-sum-zero">0</span></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-zero') + vizHTML + self._createStepControls('-zero');

        var inputEl = container.querySelector('#sq-input-zero');
        var stackEl = container.querySelector('#sq-stack-zero');
        var sumEl = container.querySelector('#sq-sum-zero');
        var flyEl = container.querySelector('#sq-zero-fly');
        var wrapEl = flyEl.parentElement;

        function parseZeroInput() {
            var raw = container.querySelector('#sq-zero-input').value;
            return raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
        }

        function renderInput(nums, highlightIdx, allDone) {
            inputEl.innerHTML = nums.map(function(n, i) {
                var cls = 'str-char-box';
                if (i === highlightIdx) cls += ' comparing';
                else if (i < highlightIdx || allDone) cls += ' matched';
                return '<div class="' + cls + '" id="sq-zero-inp-' + i + '" style="width:32px;text-align:center;">' + n + '</div>';
            }).join('');
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-zero-stk-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + (i === arr.length - 1 ? ' \u2190top' : '') + '</div>';
                }).join('');
            }
        }

        function animatePush(inputIdx, value, afterArr, onDone) {
            renderStack(afterArr, afterArr.length - 1);
            var srcEl = inputEl.querySelector('#sq-zero-inp-' + inputIdx);
            var dstEl = stackEl.querySelector('#sq-zero-stk-' + (afterArr.length - 1));
            if (!srcEl || !dstEl) { renderStack(afterArr); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = srcEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterArr);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeArr, onDone) {
            renderStack(beforeArr);
            var topEl = stackEl.querySelector('#sq-zero-stk-' + (beforeArr.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeArr[beforeArr.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildZeroSteps(nums) {
            var stepData = [];
            var stack = [];
            stepData.push({ arr: [], beforeArr: null, highlight: -1, desc: 'We manage numbers with a stack. When 0 is entered, pop the most recent number.', pushInfo: null, popInfo: null });

            nums.forEach(function(n, i) {
                if (n === 0) {
                    var popped = stack[stack.length - 1];
                    var before = [].concat(stack);
                    stack = stack.slice(0, -1);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, highlight: i, desc: 'Input: 0 \u2192 pop() \u2192 removed ' + popped + '! Stack: [' + stack.join(', ') + ']', pushInfo: null, popInfo: { value: popped, inputIdx: i } });
                } else {
                    var before = [].concat(stack);
                    stack = [].concat(stack, [n]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, highlight: i, desc: 'push(' + n + ') \u2192 Stack: [' + stack.join(', ') + ']', pushInfo: { value: n, inputIdx: i }, popInfo: null });
                }
            });
            var finalSum = stack.reduce(function(a, b) { return a + b; }, 0);
            stepData.push({ arr: [].concat(stack), beforeArr: null, highlight: -1, desc: 'Done! Sum of remaining numbers = ' + finalSum, pushInfo: null, popInfo: null });

            return stepData.map(function(st, idx) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderInput(nums, st.highlight, st.highlight === -1 && idx === stepData.length - 1);
                        sumEl.textContent = st.arr.reduce(function(a, b) { return a + b; }, 0);
                        if (dir === 'forward' && st.pushInfo) {
                            animatePush(st.pushInfo.inputIdx, st.pushInfo.value, st.arr, null);
                        } else if (dir === 'forward' && st.popInfo) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetZeroViz() {
            var nums = parseZeroInput();
            if (nums.length === 0) return;
            flyEl.innerHTML = '';
            inputEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            sumEl.textContent = '0';
            var steps = buildZeroSteps(nums);
            self._initStepController(container, steps, '-zero');
        }

        container.querySelector('#sq-zero-reset').addEventListener('click', resetZeroViz);
        resetZeroViz();
    },

    // ── Valid Parentheses (LeetCode 20) Visualization ──
    _renderVizParentheses(container) {
        const self = this;
        var DEFAULT_PAREN_STR = '([{}])';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Bracket String: <input type="text" id="sq-paren-input" value="' + DEFAULT_PAREN_STR + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="sq-paren-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-paren-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Input String</div>' +
            '<div id="sq-input-paren" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Stack</div>' +
            '<div id="sq-stack-paren" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:80px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-paren') + vizHTML + self._createStepControls('-paren');

        var inputEl = container.querySelector('#sq-input-paren');
        var stackEl = container.querySelector('#sq-stack-paren');
        var flyEl = container.querySelector('#sq-paren-fly');
        var wrapEl = flyEl.parentElement;

        function parseParenInput() {
            var raw = container.querySelector('#sq-paren-input').value;
            return raw.replace(/[^()\[\]{}]/g, '').split('');
        }

        function renderInput(chars, highlightIdx, matchedPairs) {
            inputEl.innerHTML = chars.map(function(c, i) {
                var cls = 'str-char-box';
                if (i === highlightIdx) cls += ' comparing';
                else if (matchedPairs.indexOf(i) >= 0) cls += ' matched';
                return '<div class="' + cls + '" id="sq-paren-inp-' + i + '" style="width:32px;text-align:center;font-size:1.2rem;">' + c + '</div>';
            }).join('');
        }

        function renderStack(arr, hideIdx) {
            if (arr.length === 0) {
                stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            } else {
                stackEl.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-paren-stk-' + i + '" style="text-align:center;font-weight:600;font-size:1.2rem;' + hide + '">' + v + '</div>';
                }).join('');
            }
        }

        function animatePush(charIdx, value, afterStack, onDone) {
            renderStack(afterStack, afterStack.length - 1);
            var srcEl = inputEl.querySelector('#sq-paren-inp-' + charIdx);
            var dstEl = stackEl.querySelector('#sq-paren-stk-' + (afterStack.length - 1));
            if (!srcEl || !dstEl) { renderStack(afterStack); if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = srcEl.getBoundingClientRect();
            var dr = dstEl.getBoundingClientRect();
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderStack(afterStack);
                if (onDone) onDone();
            }, 550);
        }

        function animatePop(beforeStack, onDone) {
            renderStack(beforeStack);
            var topEl = stackEl.querySelector('#sq-paren-stk-' + (beforeStack.length - 1));
            if (!topEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = topEl.getBoundingClientRect();
            topEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeStack[beforeStack.length - 1];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;' +
                'background:var(--green);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildParenSteps(chars) {
            var pairs = { ')': '(', ']': '[', '}': '{' };
            var stepData = [];
            var stack = [];
            var matchedPairs = [];
            var failed = false;
            stepData.push({ arr: [], beforeArr: null, charIdx: -1, desc: 'Check each character of the string in order.', matchedPairs: [], pushInfo: null, popInfo: null });

            for (var i = 0; i < chars.length; i++) {
                var c = chars[i];
                if ('([{'.indexOf(c) >= 0) {
                    var before = [].concat(stack);
                    stack = [].concat(stack, [c]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, charIdx: i, desc: '"' + c + '" \u2192 Opening bracket! Push onto the stack.', matchedPairs: [].concat(matchedPairs), pushInfo: { value: c, charIdx: i }, popInfo: null });
                } else if (')]}'.indexOf(c) >= 0) {
                    if (stack.length === 0 || stack[stack.length - 1] !== pairs[c]) {
                        var topVal = stack.length > 0 ? stack[stack.length - 1] : 'none';
                        stepData.push({ arr: [].concat(stack), beforeArr: [].concat(stack), charIdx: i, desc: '"' + c + '" \u2192 Closing bracket! Stack top "' + topVal + '" \u2192 Mismatch \u2717 \u2192 false', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                        failed = true;
                        break;
                    }
                    var top = stack[stack.length - 1];
                    var before = [].concat(stack);
                    stack = stack.slice(0, -1);
                    matchedPairs = [].concat(matchedPairs, [i]);
                    stepData.push({ arr: [].concat(stack), beforeArr: before, charIdx: i, desc: '"' + c + '" \u2192 Closing bracket! pop "' + top + '" \u2192 Match found \u2713', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: { value: top, charIdx: i } });
                }
            }
            if (!failed) {
                if (stack.length === 0) {
                    stepData.push({ arr: [], beforeArr: null, charIdx: -1, desc: 'Stack is empty, so brackets are valid! \u2192 true \u2713', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                } else {
                    stepData.push({ arr: [].concat(stack), beforeArr: null, charIdx: -1, desc: 'Brackets remain in the stack, so it is invalid! \u2192 false \u2717', matchedPairs: [].concat(matchedPairs), pushInfo: null, popInfo: null });
                }
            }

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderInput(chars, st.charIdx, st.matchedPairs);
                        if (dir === 'forward' && st.pushInfo) {
                            animatePush(st.pushInfo.charIdx, st.pushInfo.value, st.arr, null);
                        } else if (dir === 'forward' && st.popInfo) {
                            animatePop(st.beforeArr, function() { renderStack(st.arr); });
                        } else {
                            renderStack(st.arr);
                        }
                    }
                };
            });
        }

        function resetParenViz() {
            var chars = parseParenInput();
            if (chars.length === 0) return;
            flyEl.innerHTML = '';
            inputEl.innerHTML = '';
            stackEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.85rem;text-align:center;padding:20px 0;">(Empty)</div>';
            var steps = buildParenSteps(chars);
            self._initStepController(container, steps, '-paren');
        }

        container.querySelector('#sq-paren-reset').addEventListener('click', resetParenViz);
        resetParenViz();
    },

    // ── Card2 (BOJ 2164) Visualization ──
    _renderVizCard2(container) {
        const self = this;
        var DEFAULT_CARD_N = 6;

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (number of cards): <input type="number" id="sq-card-input" value="' + DEFAULT_CARD_N + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="sq-card-reset">🔄</button>' +
            '</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-card-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div>' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);text-align:center;">Queue (front \u2190 \u2192 back)</div>' +
            '<div id="sq-queue-card" style="display:flex;gap:4px;justify-content:center;min-height:44px;align-items:center;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div>Discarded Cards: <span id="sq-discarded-card" style="color:var(--red,#e17055);font-weight:600;"></span></div>' +
            '</div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-card') + vizHTML + self._createStepControls('-card');

        var queueEl = container.querySelector('#sq-queue-card');
        var discardedEl = container.querySelector('#sq-discarded-card');
        var flyEl = container.querySelector('#sq-card-fly');
        var wrapEl = flyEl.parentElement;

        function parseCardInput() {
            var val = parseInt(container.querySelector('#sq-card-input').value, 10);
            if (isNaN(val) || val < 2) val = 2;
            if (val > 20) val = 20;
            return val;
        }

        function renderQueue(arr, highlightFront, highlightBack) {
            if (arr.length === 0) {
                queueEl.innerHTML = '<div style="color:var(--text-secondary);">(Empty)</div>';
            } else {
                queueEl.innerHTML = arr.map(function(v, i) {
                    var cls = 'str-char-box';
                    if (highlightFront && i === 0) cls += ' comparing';
                    if (highlightBack && i === arr.length - 1) cls += ' matched';
                    if (arr.length === 1 && !highlightFront && !highlightBack) cls += ' matched';
                    return '<div class="' + cls + '" id="sq-card-q-' + i + '" style="width:40px;text-align:center;font-weight:600;">' + v +
                        (i === 0 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">front</div>' : '') +
                        (i === arr.length - 1 && arr.length > 1 ? '<div style="font-size:0.65rem;color:var(--text-secondary);">back</div>' : '') +
                        '</div>';
                }).join('');
            }
        }

        function animateDiscard(beforeQueue, onDone) {
            renderQueue(beforeQueue, true, false);
            var frontEl = queueEl.querySelector('#sq-card-q-0');
            if (!frontEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var sr = frontEl.getBoundingClientRect();
            frontEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeQueue[0];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--red,#e17055);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.top = (sr.top - wr.top - 60) + 'px';
                ghost.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function animateMove(beforeQueue, afterQueue, onDone) {
            renderQueue(beforeQueue, true, false);
            var frontEl = queueEl.querySelector('#sq-card-q-0');
            if (!frontEl) { if (onDone) onDone(); return; }
            renderQueue(afterQueue, false, true);
            var backEl = queueEl.querySelector('#sq-card-q-' + (afterQueue.length - 1));
            if (!backEl) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var dr = backEl.getBoundingClientRect();
            renderQueue(beforeQueue, true, false);
            frontEl = queueEl.querySelector('#sq-card-q-0');
            var sr = frontEl.getBoundingClientRect();
            frontEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = beforeQueue[0];
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:' + sr.width + 'px;height:' + sr.height + 'px;' +
                'left:' + (sr.left - wr.left) + 'px;top:' + (sr.top - wr.top) + 'px;' +
                'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                'background:var(--accent);color:white;border-radius:8px;padding:0 6px;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                ghost.style.left = (dr.left - wr.left) + 'px';
                ghost.style.top = (dr.top - wr.top) + 'px';
            }); });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                renderQueue(afterQueue, false, true);
                if (onDone) onDone();
            }, 550);
        }

        function buildCardSteps(N) {
            var stepData = [];
            var q = [];
            for (var i = 1; i <= N; i++) q.push(i);
            var discarded = [];
            stepData.push({ queue: [].concat(q), discarded: [], desc: 'Cards 1 through ' + N + ' are placed in order from top to bottom.', beforeQueue: null, animType: null });

            while (q.length > 1) {
                var beforeQ = [].concat(q);
                var removed = q.shift();
                discarded = [].concat(discarded, [removed]);
                stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: 'Discard the top card ' + removed + '.', beforeQueue: beforeQ, animType: 'discard' });
                if (q.length > 1) {
                    var beforeQ2 = [].concat(q);
                    var moved = q.shift();
                    q.push(moved);
                    stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: 'Move the next card ' + moved + ' to the bottom.', beforeQueue: beforeQ2, animType: 'move' });
                }
            }
            stepData.push({ queue: [].concat(q), discarded: [].concat(discarded), desc: 'The last remaining card is ' + q[0] + '!', beforeQueue: null, animType: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        discardedEl.textContent = st.discarded.join(', ');
                        if (dir === 'forward' && st.animType === 'discard') {
                            animateDiscard(st.beforeQueue, function() { renderQueue(st.queue, false, false); });
                        } else if (dir === 'forward' && st.animType === 'move') {
                            animateMove(st.beforeQueue, st.queue, null);
                        } else {
                            var hf = st.animType === 'discard';
                            var hb = st.animType === 'move';
                            renderQueue(st.queue, hf, hb);
                        }
                    }
                };
            });
        }

        function resetCardViz() {
            var N = parseCardInput();
            flyEl.innerHTML = '';
            queueEl.innerHTML = '';
            discardedEl.textContent = '';
            var steps = buildCardSteps(N);
            self._initStepController(container, steps, '-card');
        }

        container.querySelector('#sq-card-reset').addEventListener('click', resetCardViz);
        resetCardViz();
    },

    // ── Min Stack (LeetCode 155) Visualization ──
    _renderVizMinStack(container) {
        const self = this;
        var DEFAULT_MS_OPS = 'push -2, push 0, push -3, getMin, pop, top, getMin';

        var inputFieldHTML = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Operations: <input type="text" id="sq-minstack-input" value="' + DEFAULT_MS_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:420px;"></label>' +
            '<button class="btn btn-primary" id="sq-minstack-reset">🔄</button>' +
            '</div>' +
            '<div style="font-size:0.8rem;color:var(--text3);margin-bottom:12px;margin-top:-12px;">Format: push value, pop, top, getMin (comma separated)</div>';

        var vizHTML = '<div class="sim-card">' +
            '<div style="position:relative;">' +
            '<div id="sq-ms-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>' +
            '<div style="display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">Main Stack</div>' +
            '<div id="sq-main-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:120px;width:80px;border:2px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;align-items:center;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--green);">Min Stack</div>' +
            '<div id="sq-min-ms" style="display:flex;flex-direction:column-reverse;gap:4px;min-height:120px;width:80px;border:2px solid var(--green);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-secondary);"></div>' +
            '</div>' +
            '<div style="flex:0 0 auto;">' +
            '<div id="sq-result-ms" style="padding:10px;background:rgba(108,92,231,0.06);border-radius:8px;font-weight:600;color:var(--accent);min-height:30px;"></div>' +
            '</div></div></div></div>';
        container.innerHTML = inputFieldHTML + self._createStepDesc('-ms') + vizHTML + self._createStepControls('-ms');

        var mainEl = container.querySelector('#sq-main-ms');
        var minEl = container.querySelector('#sq-min-ms');
        var resultEl = container.querySelector('#sq-result-ms');
        var flyEl = container.querySelector('#sq-ms-fly');
        var wrapEl = flyEl.parentElement;

        function parseMsInput() {
            var raw = container.querySelector('#sq-minstack-input').value;
            var parts = raw.split(',');
            var ops = [];
            for (var i = 0; i < parts.length; i++) {
                var trimmed = parts[i].trim().toLowerCase();
                if (!trimmed) continue;
                if (trimmed.indexOf('push') === 0) {
                    var valStr = trimmed.replace('push', '').trim();
                    var val = parseInt(valStr, 10);
                    if (!isNaN(val)) ops.push({ op: 'push', val: val });
                } else if (trimmed === 'pop') {
                    ops.push({ op: 'pop' });
                } else if (trimmed === 'top') {
                    ops.push({ op: 'top' });
                } else if (trimmed === 'getmin') {
                    ops.push({ op: 'getMin' });
                }
            }
            return ops;
        }

        function renderMsStack(el, arr, prefix, hideIdx) {
            if (arr.length === 0) {
                el.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(empty)</div>';
            } else {
                el.innerHTML = arr.map(function(v, i) {
                    var hide = (i === hideIdx) ? 'opacity:0;' : '';
                    return '<div class="str-char-box' + (i === arr.length - 1 ? ' comparing' : '') + '" id="sq-ms-' + prefix + '-' + i + '" style="text-align:center;font-weight:600;' + hide + '">' + v + '</div>';
                }).join('');
            }
        }

        function animateMsPush(mainArr, minArr, value, minValue, onDone) {
            renderMsStack(mainEl, mainArr, 'main', mainArr.length - 1);
            renderMsStack(minEl, minArr, 'min', minArr.length - 1);
            var mainDst = mainEl.querySelector('#sq-ms-main-' + (mainArr.length - 1));
            var minDst = minEl.querySelector('#sq-ms-min-' + (minArr.length - 1));
            if (!mainDst || !minDst) {
                renderMsStack(mainEl, mainArr, 'main', -1);
                renderMsStack(minEl, minArr, 'min', -1);
                if (onDone) onDone(); return;
            }
            var wr = wrapEl.getBoundingClientRect();
            var mdr = mainDst.getBoundingClientRect();
            var ndr = minDst.getBoundingClientRect();
            function mkGhost(val, dstRect, color, startX) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;min-width:' + dstRect.width + 'px;height:' + dstRect.height + 'px;' +
                    'left:' + startX + 'px;top:' + (dstRect.top - wr.top - 60) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;padding:0 6px;opacity:0.3;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.3s ease;';
                return g;
            }
            var gMain = mkGhost(value, mdr, 'var(--accent)', mdr.left - wr.left);
            var gMin = mkGhost(minValue, ndr, 'var(--green)', ndr.left - wr.left);
            flyEl.appendChild(gMain);
            flyEl.appendChild(gMin);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                gMain.style.top = (mdr.top - wr.top) + 'px';
                gMain.style.opacity = '1';
                gMin.style.top = (ndr.top - wr.top) + 'px';
                gMin.style.opacity = '1';
            }); });
            setTimeout(function() {
                if (gMain.parentNode) gMain.parentNode.removeChild(gMain);
                if (gMin.parentNode) gMin.parentNode.removeChild(gMin);
                renderMsStack(mainEl, mainArr, 'main', -1);
                renderMsStack(minEl, minArr, 'min', -1);
                if (onDone) onDone();
            }, 550);
        }

        function animateMsPop(beforeMain, beforeMin, onDone) {
            renderMsStack(mainEl, beforeMain, 'main', -1);
            renderMsStack(minEl, beforeMin, 'min', -1);
            var mainTop = mainEl.querySelector('#sq-ms-main-' + (beforeMain.length - 1));
            var minTop = minEl.querySelector('#sq-ms-min-' + (beforeMin.length - 1));
            if (!mainTop || !minTop) { if (onDone) onDone(); return; }
            var wr = wrapEl.getBoundingClientRect();
            var mr = mainTop.getBoundingClientRect();
            var nr = minTop.getBoundingClientRect();
            mainTop.style.opacity = '0.15';
            minTop.style.opacity = '0.15';
            function mkGhost(val, rect, color) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;min-width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                    'left:' + (rect.left - wr.left) + 'px;top:' + (rect.top - wr.top) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;padding:0 6px;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:top 0.5s cubic-bezier(.4,0,.2,1),opacity 0.5s ease;';
                return g;
            }
            var gMain = mkGhost(beforeMain[beforeMain.length - 1], mr, 'var(--red,#e17055)');
            var gMin = mkGhost(beforeMin[beforeMin.length - 1], nr, 'var(--red,#e17055)');
            flyEl.appendChild(gMain);
            flyEl.appendChild(gMin);
            requestAnimationFrame(function() { requestAnimationFrame(function() {
                gMain.style.top = (mr.top - wr.top - 60) + 'px';
                gMain.style.opacity = '0';
                gMin.style.top = (nr.top - wr.top - 60) + 'px';
                gMin.style.opacity = '0';
            }); });
            setTimeout(function() {
                if (gMain.parentNode) gMain.parentNode.removeChild(gMain);
                if (gMin.parentNode) gMin.parentNode.removeChild(gMin);
                if (onDone) onDone();
            }, 550);
        }

        function buildMsSteps(ops) {
            var stepData = [];
            var mainStack = [];
            var minStack = [];
            stepData.push({ main: [], min: [], beforeMain: null, beforeMin: null, desc: 'Prepare two stacks: a main stack and a min-tracking stack.', result: '', animType: null });

            for (var i = 0; i < ops.length; i++) {
                var o = ops[i];
                if (o.op === 'push') {
                    var bm = [].concat(mainStack);
                    var bn = [].concat(minStack);
                    mainStack = [].concat(mainStack, [o.val]);
                    var curMin = minStack.length === 0 ? o.val : Math.min(o.val, minStack[minStack.length - 1]);
                    minStack = [].concat(minStack, [curMin]);
                    stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: bm, beforeMin: bn, desc: 'push(' + o.val + ') \u2192 main gets ' + o.val + ', min stack gets min(' + o.val + ', ' + (minStack.length > 1 ? minStack[minStack.length - 2] : '\u2205') + ') = ' + curMin, result: '', animType: 'push', pushVal: o.val, pushMin: curMin });
                } else if (o.op === 'pop') {
                    if (mainStack.length === 0) {
                        stepData.push({ main: [], min: [], beforeMain: null, beforeMin: null, desc: 'pop() \u2192 Stack is empty, cannot execute!', result: '', animType: null });
                    } else {
                        var bm = [].concat(mainStack);
                        var bn = [].concat(minStack);
                        var popped = mainStack[mainStack.length - 1];
                        mainStack = mainStack.slice(0, -1);
                        minStack = minStack.slice(0, -1);
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: bm, beforeMin: bn, desc: 'pop() \u2192 removed ' + popped + '. Pop from both stacks!', result: '', animType: 'pop' });
                    }
                } else if (o.op === 'top') {
                    if (mainStack.length === 0) {
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'top() \u2192 Stack is empty, cannot execute!', result: '', animType: null });
                    } else {
                        var topVal = mainStack[mainStack.length - 1];
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'top() \u2192 Check the top value of the main stack', result: 'top() = ' + topVal, animType: 'highlight' });
                    }
                } else if (o.op === 'getMin') {
                    if (minStack.length === 0) {
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'getMin() \u2192 Stack is empty, cannot execute!', result: '', animType: null });
                    } else {
                        var minVal = minStack[minStack.length - 1];
                        stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'getMin() \u2192 Top of the min stack = current minimum!', result: 'getMin() = ' + minVal, animType: 'highlight' });
                    }
                }
            }
            stepData.push({ main: [].concat(mainStack), min: [].concat(minStack), beforeMain: null, beforeMin: null, desc: 'Thanks to the auxiliary stack, getMin() is always O(1)!', result: '', animType: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        resultEl.textContent = st.result;
                        if (dir === 'forward' && st.animType === 'push') {
                            animateMsPush(st.main, st.min, st.pushVal, st.pushMin, null);
                        } else if (dir === 'forward' && st.animType === 'pop') {
                            animateMsPop(st.beforeMain, st.beforeMin, function() {
                                renderMsStack(mainEl, st.main, 'main', -1);
                                renderMsStack(minEl, st.min, 'min', -1);
                            });
                        } else {
                            renderMsStack(mainEl, st.main, 'main', -1);
                            renderMsStack(minEl, st.min, 'min', -1);
                        }
                    }
                };
            });
        }

        function resetMsViz() {
            var ops = parseMsInput();
            if (ops.length === 0) return;
            flyEl.innerHTML = '';
            mainEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(empty)</div>';
            minEl.innerHTML = '<div style="color:var(--text-secondary);font-size:0.8rem;text-align:center;padding:20px 0;">(empty)</div>';
            resultEl.textContent = '';
            var steps = buildMsSteps(ops);
            self._initStepController(container, steps, '-ms');
        }

        container.querySelector('#sq-minstack-reset').addEventListener('click', resetMsViz);
        resetMsViz();
    },

    // ===== Problem Tab =====
    stages: [
        { num: 1, title: 'Implement a Stack', desc: 'Implement basic stack commands from scratch (Silver IV)', problemIds: ['boj-10828'] },
        { num: 2, title: 'Basic Stack & Queue', desc: 'Basic stack/queue operations and bracket validation (Silver~Easy)', problemIds: ['boj-10773', 'lc-20'] },
        { num: 3, title: 'Stack & Queue Applications', desc: 'Deque usage and monotone stack (Silver~Medium)', problemIds: ['boj-2164', 'lc-155'] }
    ],

    problems: [
        {
            id: 'boj-10828',
            title: 'BOJ 10828 - Stack',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10828',
            simIntro: 'Watch how push, pop, size, empty, and top commands operate on a stack step by step.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Implement a stack that stores integers, then process the given commands.</p>
                <p>There are five commands:</p>
                <ul>
                    <li><code>push X</code>: Push integer X onto the stack.</li>
                    <li><code>pop</code>: Print the top integer and remove it. Print -1 if the stack is empty.</li>
                    <li><code>size</code>: Print the number of integers in the stack.</li>
                    <li><code>empty</code>: Print 1 if the stack is empty, 0 otherwise.</li>
                    <li><code>top</code>: Print the top integer. Print -1 if the stack is empty.</li>
                </ul>
                <h4>Input</h4>
                <p>The first line contains the number of commands N (1 &le; N &le; 10,000). Each of the next N lines contains one command. Integers are between 1 and 100,000 inclusive.</p>
                <h4>Output</h4>
                <p>For each command that requires output, print one result per line.</p>

                <div class="problem-example"><h4>Example</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>14\npush 1\npush 2\ntop\nsize\npop\npush 3\nempty\npop\npop\npop\npush 4\nempty\ntop\npop</pre></div>
                    <div><strong>Output</strong><pre>2\n2\n2\n0\n3\n1\n-1\n0\n4\n4</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; N &le; 10,000</li>
                    <li>1 &le; X &le; 100,000</li>
                </ul>
            `,
            hints: [
                { title: 'What is a stack?', content: 'A stack is like <strong>"stacking plates"</strong>!<br><br>You stack plates on top one by one, and can only remove from the top.<br>The last item added is the first one removed -- this is called <strong>LIFO (Last In, First Out)</strong>.<div style="display:flex;justify-content:center;margin:12px 0 8px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="font-size:0.75rem;color:var(--text3);">← top</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 16px;border:2px solid var(--bg3);border-radius:8px;min-height:80px;background:var(--bg2);"><div style="padding:4px 18px;background:var(--accent);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">1</div><div style="padding:4px 18px;background:var(--accent);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">2</div><div style="padding:4px 18px;background:var(--green);color:white;border-radius:6px;font-size:0.85rem;font-weight:600;">3</div></div><div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">push order: 1→2→3</div></div></div>This problem asks you to implement this LIFO structure and handle 5 commands!' },
                { title: 'Understanding the 5 commands', content: 'Here is what each command does:<br><br>📥 <strong>push X</strong> → Push X onto the top of the stack (no output)<br>📤 <strong>pop</strong> → Print and remove the top value. Print -1 if empty<br>📏 <strong>size</strong> → Print the number of elements in the stack<br>❓ <strong>empty</strong> → Print 1 if empty, 0 otherwise<br>👀 <strong>top</strong> → Print the top value without removing. Print -1 if empty<div style="display:flex;justify-content:center;gap:24px;margin:12px 0 8px;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text2);font-weight:600;margin-bottom:4px;">pop (remove + return)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">A</div><div style="padding:3px 14px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;opacity:0.5;text-decoration:line-through;">B</div></div></div><div style="text-align:center;"><div style="font-size:0.8rem;color:var(--text2);font-weight:600;margin-bottom:4px;">top (peek only)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">A</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;box-shadow:0 0 6px var(--yellow);">B</div></div></div></div><strong>Difference between pop and top</strong>: pop removes the element, top only peeks!' },
                { title: 'Which data structure to use?', content: '<span class="lang-py">In Python, a <strong>list</strong> IS a stack!<br><br><code>append(x)</code> → push (add to end)<br><code>pop()</code> → pop (remove from end + return)<br><code>stack[-1]</code> → top (peek at end)<br><code>len(stack)</code> → size<br><br>All are <strong>O(1)</strong> operations!<br><a href="https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks" target="_blank" style="font-size:0.85rem;color:var(--accent);">Python docs: Using Lists as Stacks ↗</a></span><span class="lang-cpp">In C++, you can use <code>vector&lt;int&gt;</code> or <code>stack&lt;int&gt;</code>.<br><br><code>push_back(x)</code> / <code>push(x)</code> → push<br><code>pop_back()</code> / <code>pop()</code> → pop (save value first!)<br><code>back()</code> / <code>top()</code> → top<br><code>size()</code> → size<br><br>All are <strong>O(1)</strong> operations!<br><a href="https://en.cppreference.com/w/cpp/container/stack" target="_blank" style="font-size:0.85rem;color:var(--accent);">C++ stack reference ↗</a></span>' },
                { title: 'Handling the empty stack is key!', content: '<strong>pop</strong> and <strong>top</strong> must print -1 when the stack is empty.<br><br>Forgetting this causes a runtime error! (Trying to pop from an empty stack)<div style="display:flex;justify-content:center;margin:10px 0;"><div style="padding:8px 16px;background:var(--red);color:white;border-radius:8px;font-size:0.85rem;opacity:0.9;">⚠️ pop() on empty stack → Runtime Error!</div></div>Processing steps:<br>1. Parse the command (read the number for push)<br>2. Use if-else to branch on all 5 commands<br>3. <strong>Always check if empty before pop/top!</strong><br><br><span class="lang-py">Python: <code>if not stack:</code> checks for empty</span><span class="lang-cpp">C++: <code>if (st.empty())</code> checks for empty</span>' }
            ],
            inputDefault: 0,
            solve() { return '2\n2\n2\n0\n3\n1\n-1\n0\n4\n4'; },
            solutions: [
                {
                    approach: 'Stack with list/array',
                    description: 'Use a list as a stack and handle all 5 commands.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Input Setup', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []  # Use list as a stack (LIFO)', desc: 'sys.stdin.readline for fast input.\nA list IS a stack! append/pop are both O(1).' },
                            { title: 'Handle push', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))  # Add value to top', desc: 'Split the command with split() and branch on the first word.\nFor push, convert the second word to int and append!' },
                            { title: 'Handle pop / top', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))\n    elif cmd[0] == "pop":\n        # Print -1 if empty, otherwise pop and print\n        print(-1 if not stack else stack.pop())\n    elif cmd[0] == "top":\n        # Print -1 if empty, otherwise peek at top (no removal!)\n        print(-1 if not stack else stack[-1])', desc: 'Both pop and top must check for empty stack!\npop() removes and returns, stack[-1] only peeks.' },
                            { title: 'Handle size / empty', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nstack = []\n\nfor _ in range(N):\n    cmd = input().split()\n    if cmd[0] == "push":\n        stack.append(int(cmd[1]))\n    elif cmd[0] == "pop":\n        print(-1 if not stack else stack.pop())\n    elif cmd[0] == "size":\n        print(len(stack))  # Number of elements\n    elif cmd[0] == "empty":\n        print(1 if not stack else 0)  # 1 if empty\n    elif cmd[0] == "top":\n        print(-1 if not stack else stack[-1])', desc: 'size uses len(), empty checks if the list is empty.\nAll operations are O(1), so overall O(N)!' }
                        ],
                        cpp: [
                            { title: 'Input Setup', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;  // C++ standard stack', desc: 'Using the C++ <stack> library.\npush/pop/top/size/empty are all O(1).' },
                            { title: 'Handle push', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x;\n            cin >> x;\n            st.push(x);  // Add to top of stack\n        }', desc: 'Read the command as a string and branch.\nOnly push reads an additional integer x.' },
                            { title: 'Handle pop / top', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x; cin >> x;\n            st.push(x);\n        } else if (cmd == "pop") {\n            if (st.empty()) cout << -1 << "\\n";\n            else { cout << st.top() << "\\n"; st.pop(); }\n            // Must read top() first, then pop()!\n        } else if (cmd == "top") {\n            if (st.empty()) cout << -1 << "\\n";\n            else cout << st.top() << "\\n";\n            // top only peeks, no removal\n        }', desc: 'C++ pop() does NOT return a value!\nYou must read with top() first, then remove with pop().\nForgetting the empty check causes a runtime error!' },
                            { title: 'Handle size / empty + full code', code: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    stack<int> st;\n\n    while (N--) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int x; cin >> x;\n            st.push(x);\n        } else if (cmd == "pop") {\n            if (st.empty()) cout << -1 << "\\n";\n            else { cout << st.top() << "\\n"; st.pop(); }\n        } else if (cmd == "size") {\n            cout << st.size() << "\\n";\n        } else if (cmd == "empty") {\n            cout << (st.empty() ? 1 : 0) << "\\n";\n        } else if (cmd == "top") {\n            if (st.empty()) cout << -1 << "\\n";\n            else cout << st.top() << "\\n";\n        }\n    }\n    return 0;\n}', desc: 'size() and empty() are straightforward.\nUsing "\\n" is faster than endl!\nOverall time complexity: O(N) -- all operations are O(1)!' }
                        ]
                    }
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

N = int(input())
stack = []

for _ in range(N):
    cmd = input().split()
    if cmd[0] == "push":
        stack.append(int(cmd[1]))
    elif cmd[0] == "pop":
        print(-1 if not stack else stack.pop())
    elif cmd[0] == "size":
        print(len(stack))
    elif cmd[0] == "empty":
        print(1 if not stack else 0)
    elif cmd[0] == "top":
        print(-1 if not stack else stack[-1])`,
                cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

int main() {
    int N;
    cin >> N;
    stack<int> st;

    while (N--) {
        string cmd;
        cin >> cmd;
        if (cmd == "push") {
            int x; cin >> x;
            st.push(x);
        } else if (cmd == "pop") {
            if (st.empty()) cout << -1 << "\\n";
            else { cout << st.top() << "\\n"; st.pop(); }
        } else if (cmd == "size") {
            cout << st.size() << "\\n";
        } else if (cmd == "empty") {
            cout << (st.empty() ? 1 : 0) << "\\n";
        } else if (cmd == "top") {
            if (st.empty()) cout << -1 << "\\n";
            else cout << st.top() << "\\n";
        }
    }
    return 0;
}`
            }
        },
        {
            id: 'boj-10773',
            title: 'BOJ 10773 - Zero',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10773',
            simIntro: 'See how the most recent number is popped from the stack when 0 is given as input.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Jaemin, the leader of Nacoder, is organizing the ledger. Being very energetic, he came up with a fun game. Jaemin calls out K numbers. If a number is not "0", write it in the ledger. If it is "0", erase the most recently written number. When the game is over, write a program to find the sum of all numbers remaining in the ledger. When 0 is given, there is always a number to erase.</p>
                <h4>Input</h4>
                <p>The first line contains the integer K. (1 &le; K &le; 100,000)</p>
                <p>Each of the following K lines contains one integer. Integers range from 0 to 100,000, and if the integer is "0", erase the most recently written number; otherwise, write that number.</p>
                <h4>Output</h4>
                <p>Print the sum of all numbers remaining in the ledger when the game is over. This value is at most 2<sup>31</sup> - 1.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4\n3\n0\n4\n0</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10\n1\n3\n5\n4\n0\n0\n7\n0\n0\n6</pre></div>
                    <div><strong>Output</strong><pre>7</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; K &le; 100,000</li>
                    <li>1 &le; each number &le; 100,000</li>
                    <li>When 0 is given, there is always a number to erase</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Write numbers down and erase when 0 comes... How about just <strong>putting numbers into a list</strong>?<br><br>For example: 3 comes in → [3], then 0 comes → erase 3 → []<br>1, 5, 0 come in → [1, 5] → 0 means erase → [1]<br><br>But what exactly does "erase" remove? It removes <strong>"the most recently written number"</strong>!' },
                { title: 'How do we remove "the most recent"?', content: '"Removing the most recently added item"... Does this pattern sound familiar?<br><br>It is like stacking plates and <strong>removing from the top</strong>!<br>Adding and removing from only one end -- that is <strong>LIFO (Last In, First Out) = Stack</strong>!<div style="display:flex;justify-content:center;gap:24px;margin:12px 0;flex-wrap:wrap;align-items:flex-end;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:4px;">After push 1, 3, 5</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--yellow);">5</div></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">top → 5</div></div><div style="font-size:1.2rem;color:var(--text3);">→ pop</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--green);margin-bottom:4px;">5 removed (most recent!)</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 14px;border:2px solid var(--bg3);border-radius:8px;min-height:60px;background:var(--bg2);"><div style="padding:3px 14px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 14px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--yellow);">3</div></div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">top → 3</div></div></div>When a number comes, push it. When 0 comes, pop. The "most recent number" is naturally removed.' },
                { title: 'Implementing with a stack!', content: '1. Non-zero number → <code>push(x)</code><br>2. Zero → <code>pop()</code> (most recent number is removed)<br>3. After K iterations → the sum of remaining numbers in the stack is the answer!<div style="display:flex;justify-content:center;margin:12px 0;"><div style="display:flex;align-items:flex-end;gap:16px;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:3px;">Input: 1, 3, 0, 5</div><div style="display:flex;gap:4px;justify-content:center;"><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 10px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;text-decoration:line-through;opacity:0.5;">0</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">5</div></div></div><div style="font-size:1.2rem;color:var(--text3);margin-bottom:2px;">→</div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text3);margin-bottom:3px;">Stack result</div><div style="display:flex;gap:4px;justify-content:center;"><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">1</div><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">5</div></div><div style="font-size:0.75rem;color:var(--green);margin-top:3px;">sum = 6</div></div></div></div>The problem guarantees the stack is never empty when 0 is given, so no extra check is needed.<br>Time complexity: <strong>O(K)</strong> -- push/pop are both O(1), so K iterations means O(K)!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">In Python, a <code>list</code> IS a stack!<br><code>append(x)</code> for push, <code>pop()</code> for pop -- both O(1).<br>At the end, <code>sum(stack)</code> gives the sum of remaining numbers!</span><span class="lang-cpp">In C++, use <code>stack&lt;int&gt;</code>!<br><code>push(x)</code> to add, <code>pop()</code> to remove.<br>Since there is no <code>sum()</code>, use <code>while (!st.empty())</code> to pop and accumulate one by one.</span>' }
            ],
            inputDefault: 0,
            solve() { return '0'; },
            solutions: [
                {
                    approach: 'Using a Stack',
                    description: 'Pop on 0, push otherwise, then sum the remaining values.',
                    timeComplexity: 'O(K)',
                    spaceComplexity: 'O(K)',
                    get templates() { return stackQueueTopic.problems[1].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Input Setup', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # Stack: last in, first out (LIFO)', desc: 'Why a stack? Because when 0 appears, we must remove "the most recent number"!\nThe LIFO structure is a perfect fit.' },
                            { title: 'Loop', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # Stack: last in, first out (LIFO)\n\nfor _ in range(K):\n    n = int(input())  # Read each number one by one', desc: 'Loop K times, reading each number.\nThe behavior differs depending on whether it is 0 or not.' },
                            { title: 'Conditional Branch', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # Stack: last in, first out (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "erase the last number!"\n        stack.pop()     # LIFO: most recent number is removed\n    else:\n        stack.append(n) # Not 0, so push it onto the stack', desc: 'Core logic: pop on 0, push otherwise!\npop() always removes the most recently added number.\nThis is an O(1) operation thanks to the stack!' },
                            { title: 'Output Result', code: 'import sys\ninput = sys.stdin.readline\n\nK = int(input())\nstack = []  # Stack: last in, first out (LIFO)\n\nfor _ in range(K):\n    n = int(input())\n    if n == 0:          # 0 = "erase the last number!"\n        stack.pop()     # LIFO: most recent number is removed\n    else:\n        stack.append(n) # Not 0, so push it onto the stack\n\nprint(sum(stack))  # Sum of remaining numbers after all erasures', desc: 'The sum of all numbers remaining in the stack after processing all zeros!' }
                        ],
                        cpp: [
                            { title: 'Input Setup', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // Stack: LIFO (Last In, First Out)', desc: 'Why a stack? Because when 0 appears, we must remove "the most recent number"!\nThe LIFO structure is a perfect fit.\nC++ provides stack via the <stack> header.' },
                            { title: 'Loop', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // Stack: LIFO (Last In, First Out)\n\n    while (K--) {       // Repeat K times\n        int n;\n        cin >> n;       // Read each number one by one', desc: 'while (K--) decrements K each iteration until it reaches 0.\nThe behavior differs depending on whether the number is 0 or not.' },
                            { title: 'Conditional Branch', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // Stack: LIFO (Last In, First Out)\n\n    while (K--) {\n        int n;\n        cin >> n;\n        if (n == 0)       // 0 = "erase the last number!"\n            st.pop();     // LIFO: most recent number is removed\n        else\n            st.push(n);   // Not 0, so push it onto the stack', desc: 'Core logic: pop on 0, push otherwise!\nIn C++, use push() to add and pop() to remove.\npop() always removes the most recently added number -- O(1)!' },
                            { title: 'Output Result', code: '#include <iostream>\n#include <stack>\nusing namespace std;\n\nint main() {\n    int K;\n    cin >> K;\n    stack<int> st;  // Stack: LIFO (Last In, First Out)\n\n    while (K--) {\n        int n;\n        cin >> n;\n        if (n == 0)       // 0 = "erase the last number!"\n            st.pop();     // LIFO: most recent number is removed\n        else\n            st.push(n);   // Not 0, so push it onto the stack\n    }\n\n    int total = 0;\n    while (!st.empty()) {   // Until the stack is empty\n        total += st.top();  // Read value with top()\n        st.pop();           // Remove with pop()\n    }\n    cout << total << endl;  // Print sum of remaining numbers', desc: 'C++ stack has no sum(), so we pop and accumulate one by one.\ntop() only returns the value (no removal), pop() only removes (no return)!\nThis is different from Python where pop() does both.' }
                        ]
                    }
                }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

K = int(input())
stack = []

for _ in range(K):
    n = int(input())
    if n == 0:
        stack.pop()
    else:
        stack.append(n)

print(sum(stack))`,
                cpp: `#include <iostream>
#include <stack>
using namespace std;

int main() {
    int K, n;
    scanf("%d", &K);
    stack<int> st;

    while (K--) {
        scanf("%d", &n);
        if (n == 0) st.pop();
        else st.push(n);
    }

    long long sum = 0;
    while (!st.empty()) { sum += st.top(); st.pop(); }
    printf("%lld\\n", sum);
}`
            }
        },
        {
            id: 'lc-20',
            title: 'LeetCode 20 - Valid Parentheses',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/valid-parentheses/',
            simIntro: 'Watch how opening brackets are pushed onto the stack and matched when a closing bracket appears.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code>, and <code>']'</code>, determine if the input string is valid.</p>
                <p>An input string is valid if:</p>
                <ol>
                    <li>Open brackets must be closed by the <strong>same type of brackets</strong>.</li>
                    <li>Open brackets must be closed in the <strong>correct order</strong>.</li>
                    <li>Every close bracket has a corresponding <strong>open bracket of the same type</strong>.</li>
                </ol>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "()"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "()[]{}"</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "(]"</pre></div>
                    <div><strong>Output</strong><pre>false</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; s.length &le; 10<sup>4</sup></li>
                    <li><code>s</code> consists of parentheses only <code>'()[]{}'</code></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'What if the <strong>number of opening and closing brackets are equal</strong>, it is valid?<br><br><code>"()"</code> → 1 open, 1 close → valid ✓<br><code>"()[]{}"</code> → 3 open, 3 close → valid ✓<div style="display:flex;justify-content:center;gap:16px;margin:12px 0;flex-wrap:wrap;"><div style="text-align:center;padding:8px 14px;background:var(--bg2);border-radius:8px;"><div style="font-family:monospace;font-size:1.1rem;letter-spacing:3px;margin-bottom:4px;"><span style="color:var(--accent);">(</span> <span style="color:var(--green);">)</span></div><div style="font-size:0.75rem;color:var(--text3);">open 1 = close 1 ✓</div></div><div style="text-align:center;padding:8px 14px;background:var(--bg2);border-radius:8px;"><div style="font-family:monospace;font-size:1.1rem;letter-spacing:3px;margin-bottom:4px;"><span style="color:var(--accent);">(</span><span style="color:var(--green);">)</span><span style="color:var(--accent);">[</span><span style="color:var(--green);">]</span><span style="color:var(--accent);">{</span><span style="color:var(--green);">}</span></div><div style="font-size:0.75rem;color:var(--text3);">open 3 = close 3 ✓</div></div></div>It seems like just counting would be a simple solution...' },
                { title: 'But there is a problem with this', content: '<code>"(]"</code> → 1 open bracket, 1 close bracket... <strong>The counts match but it is not valid!</strong><br><code>"([)]"</code> → 2 open, 2 close... Again counts match but it is not valid!<div style="display:flex;justify-content:center;gap:20px;margin:12px 0;flex-wrap:wrap;"><div style="text-align:center;padding:8px 14px;background:var(--bg2);border:2px solid var(--green);border-radius:8px;"><div style="font-size:0.8rem;color:var(--green);font-weight:600;margin-bottom:4px;">Valid ✓</div><div style="font-size:1.1rem;font-family:monospace;letter-spacing:2px;"><span style="color:var(--accent);">(</span><span style="color:var(--accent);">[</span><span style="color:var(--green);">]</span><span style="color:var(--green);">)</span></div></div><div style="text-align:center;padding:8px 14px;background:var(--bg2);border:2px solid var(--red);border-radius:8px;"><div style="font-size:0.8rem;color:var(--red);font-weight:600;margin-bottom:4px;">Invalid ✗</div><div style="font-size:1.1rem;font-family:monospace;letter-spacing:2px;"><span style="color:var(--accent);">(</span><span style="color:var(--accent);">[</span><span style="color:var(--red);">)</span><span style="color:var(--red);">]</span></div></div></div>Counting alone cannot verify the <strong>"type"</strong> (same bracket shape) and <strong>"order"</strong> (inner brackets close first).<br>So how can we check both type and order?' },
                { title: 'What if we try this?', content: 'Look at <code>"([{}])"</code>: opened in order <code>(</code> → <code>[</code> → <code>{</code>,<br>so they must close in order <code>}</code> → <code>]</code> → <code>)</code>, closing <strong>the most recently opened bracket first</strong>.<div style="display:flex;justify-content:center;margin:12px 0;"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="font-size:0.7rem;color:var(--text3);">Stack</div><div style="display:flex;flex-direction:column-reverse;gap:2px;padding:6px 10px;border:2px solid var(--bg3);border-radius:6px;min-height:50px;background:var(--bg2);"><div style="padding:2px 10px;background:var(--accent);color:white;border-radius:4px;font-size:0.8rem;">(</div><div style="padding:2px 10px;background:var(--accent);color:white;border-radius:4px;font-size:0.8rem;">[</div><div style="padding:2px 10px;background:var(--yellow);color:var(--text);border-radius:4px;font-size:0.8rem;font-weight:600;">{</div></div></div><div style="font-size:0.85rem;color:var(--text2);max-width:180px;line-height:1.5;"><code>}</code> appears!<br>Stack top = <code>{</code><br>Match found, pop!</div></div></div>"Remove the most recently added and compare"... Does this pattern look familiar? → <strong>Stack</strong>!<br>Opening bracket → push, closing bracket → pop and check if they match.<br><br>Two edge cases to watch:<br>1. Closing bracket but <strong>stack is empty?</strong> → No match, fail<br>2. Finished scanning but <strong>stack still has items?</strong> → Unclosed brackets remain, fail' },
                { title: 'In Python/C++!', content: 'Pre-mapping pairs lets us compare in O(1) when a closing bracket appears:<br><br><span class="lang-py">Python: <code>pairs = {")" : "(", "]" : "[", "}" : "{"}</code> (<a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="color:var(--accent);">dictionary</a>)<br>Stack is implemented with <code>list</code> using <code>append/pop</code>!<br>Closing bracket → if <code>stack[-1] != pairs[c]</code>, mismatch → <code>False</code></span><span class="lang-cpp">C++: Map with <code><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="color:var(--accent);">unordered_map</a>&lt;char,char&gt;</code> or use if/else<br>Stack is <code>stack&lt;char&gt;</code> with <code>push/top/pop</code>!<br>Closing bracket → if <code>st.top() != pairs[c]</code>, mismatch → <code>false</code></span>' }
            ],
            inputDefault: 0,
            solve() { return 'true'; },
            solutions: [
                {
                    approach: 'Stack-Based Bracket Matching',
                    description: 'Push opening brackets, compare closing brackets against the top to match.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[2].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Initial Setup', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # Stack to hold opening brackets\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # closing→opening mapping', desc: 'Why a dictionary? To find the matching pair in O(1) when a closing bracket appears!\npairs[")"] = "(" and so on.' },
                            { title: 'Character Traversal', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # Stack to hold opening brackets\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # closing→opening mapping\n\n        for c in s:  # Check each character one by one', desc: 'Examine each character in the string one by one.\nProcessing differs depending on whether it is opening or closing.' },
                            { title: 'Push Opening Brackets', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # Stack to hold opening brackets\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # closing→opening mapping\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # Hold until we find its closing match', desc: 'Why push? Opening brackets do not have a match yet, so we store them!\nWe will pop and compare when a closing bracket appears later.' },
                            { title: 'Validate Closing Brackets', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # Stack to hold opening brackets\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # closing→opening mapping\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # Hold until we find its closing match\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # Stack empty or mismatch\n                    return False\n                stack.pop()  # Match found, consume it!', desc: 'Key point: when a closing bracket appears, compare with the stack top!\nnot stack → no opening bracket to pair with → fail\nstack[-1] != pairs[c] → most recent opening bracket does not match → fail' },
                            { title: 'Final Verdict', code: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []  # Stack to hold opening brackets\n        pairs = {\')\': \'(\', \']\': \'[\', \'}\': \'{\'}  # closing→opening mapping\n\n        for c in s:\n            if c in \'([{\':\n                stack.append(c)  # Hold until we find its closing match\n            elif c in \')]}\':\n                if not stack or stack[-1] != pairs[c]:  # Stack empty or mismatch\n                    return False\n                stack.pop()  # Match found, consume it!\n\n        return len(stack) == 0  # Remaining opening brackets = fail!', desc: 'Why len(stack) == 0?\nIf opening brackets remain in the stack, they were never matched!\nFor example, "(()": "(" remains in the stack, so return False.' }
                        ],
                        cpp: [
                            { title: 'Initial Setup', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;  // Stack to hold opening brackets\n        // closing→opening bracket mapping (O(1) lookup)\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };', desc: 'Why unordered_map? To find the matching pair in O(1) when a closing bracket appears!\npairs[\')\'] = \'(\' and so on.\nIn C++, use stack<char> to create a character stack.' },
                            { title: 'Character Traversal', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {  // Check each character one by one', desc: 'Range-based for loop iterates through each character in the string.\nProcessing differs depending on whether it is opening or closing.' },
                            { title: 'Push Opening Brackets', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);  // Hold until we find its closing match', desc: 'Why push? Opening brackets do not have a match yet, so we store them!\nWe will pop and compare when a closing bracket appears later.' },
                            { title: 'Validate Closing Brackets', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);  // Hold until we find its closing match\n            else {\n                // Stack empty or mismatch → fail\n                if (st.empty() || st.top() != pairs[c])\n                    return false;\n                st.pop();    // Match found, consume it!', desc: 'Key point: when a closing bracket appears, compare with the stack top!\nst.empty() → no opening bracket to pair with → fail\nst.top() != pairs[c] → most recent opening bracket does not match → fail' },
                            { title: 'Final Verdict', code: '#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> pairs = {\n            {\')\', \'(\'}, {\']\', \'[\'}, {\'}\', \'{\'}\n        };\n\n        for (char c : s) {\n            if (c == \'(\' || c == \'[\' || c == \'{\')\n                st.push(c);\n            else {\n                if (st.empty() || st.top() != pairs[c])\n                    return false;\n                st.pop();\n            }\n        }\n\n        return st.empty();  // Remaining opening brackets = fail!\n    }\n};', desc: 'Why st.empty()?\nIf opening brackets remain in the stack, they were never matched!\nFor example, "(()": \'(\' remains in the stack, so return false.' }
                        ]
                    }
                }
            ],
            templates: {
                python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}

        for c in s:
            if c in '([{':
                stack.append(c)
            elif c in ')]}':
                if not stack or stack[-1] != pairs[c]:
                    return False
                stack.pop()

        return len(stack) == 0`,
                cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};

        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`
            }
        },
        {
            id: 'boj-2164',
            title: 'BOJ 2164 - Card2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2164',
            simIntro: 'Watch how the top card is discarded from the queue and the next card is moved to the bottom.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There are N cards. Each card is numbered from 1 to N, with card 1 on top and card N on the bottom. The following operations are repeated until only one card remains: First, discard the top card. Then move the next top card to the bottom. Find the last remaining card.</p>
                <h4>Input</h4>
                <p>The first line contains the integer N (1 &le; N &le; 500,000).</p>
                <h4>Output</h4>
                <p>Print the number of the last remaining card.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; N &le; 500,000</li>
                </ul>
            `,
            hints: [
                { title: 'Understanding the problem', content: 'When N=4, cards are arranged as [1, 2, 3, 4].<br>"<strong>Discard the top card, then move the next top to the bottom</strong>" -- repeat!<div style="margin:12px 0;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.82rem;width:100%;"><thead><tr style="background:var(--bg2);"><th style="padding:5px 8px;border:1px solid var(--bg3);">Step</th><th style="padding:5px 8px;border:1px solid var(--bg3);">Action</th><th style="padding:5px 8px;border:1px solid var(--bg3);">Queue State</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">Init</td><td style="padding:4px 8px;border:1px solid var(--bg3);">-</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[1, 2, 3, 4]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">Discard 1</span>, move 2→bottom</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[3, 4, 2]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">Discard 3</span>, move 4→bottom</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[2, 4]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">3</td><td style="padding:4px 8px;border:1px solid var(--bg3);"><span style="color:var(--red);">Discard 2</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;color:var(--green);font-weight:600;">[4] ← Answer!</td></tr></tbody></table></div>This is a pattern of removing from one end (top) and inserting at the other (bottom)!' },
                { title: 'How about using an array?', content: 'Removing from the front and adding to the back of an array would work, right?<br>(<span class="lang-py">Python: <code>list.pop(0)</code></span><span class="lang-cpp">C++: <code>erase(v.begin())</code></span>)<br><br>But think about what "removing from the front" actually does each time...' },
                { title: 'The trap of removing from the front of an array!', content: 'Removing from the front means <strong>shifting all remaining elements forward by one</strong> → <strong>O(n)</strong><div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;align-items:center;gap:6px;"><div style="padding:3px 10px;background:var(--red);color:white;border-radius:5px;font-size:0.8rem;opacity:0.4;text-decoration:line-through;">1</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">2</div><div style="font-size:0.8rem;color:var(--text3);">←</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">3</div><div style="font-size:0.8rem;color:var(--text3);">←</div><div style="padding:3px 10px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;">4</div><div style="font-size:0.75rem;color:var(--red);margin-left:8px;font-weight:600;">All shift! O(n)</div></div></div>(<span class="lang-py">Python: <code>list.pop(0)</code></span><span class="lang-cpp">C++: <code>vector.erase(begin())</code></span> are both O(n))<br><br>What if there are <strong>500,000 cards</strong>? O(n) per operation x n repetitions → O(n^2) → <strong>Time Limit Exceeded!</strong><br>We need a data structure where "removing from the front is fast".' },
                { title: 'A Queue solves it!', content: 'With a queue, removing from the front is <strong>O(1)</strong>!<div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;align-items:center;gap:4px;padding:8px 12px;background:var(--bg2);border:2px solid var(--bg3);border-radius:8px;"><div style="font-size:0.75rem;color:var(--red);margin-right:4px;">← out</div><div style="padding:3px 10px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">3</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">4</div><div style="padding:3px 10px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="font-size:0.75rem;color:var(--accent);margin-left:4px;">in →</div></div></div><span class="lang-py">Python: <code><a href="https://docs.python.org/3/library/collections.html#collections.deque" target="_blank" style="color:var(--accent);">collections.deque</a></code> with <code>popleft()</code></span><span class="lang-cpp">C++: <code><a href="https://en.cppreference.com/w/cpp/container/queue" target="_blank" style="color:var(--accent);">queue&lt;int&gt;</a></code> with <code>front()</code> + <code>pop()</code></span><br><br>The FIFO structure of removing from the front and adding to the back is a perfect fit for this problem!' },
                { title: 'Why is a queue so fast?', content: '<strong>Queue</strong> = FIFO (First In, First Out) data structure<br>Both removing from the front and adding to the back are <strong>O(1)</strong>.<div style="display:flex;justify-content:center;margin:10px 0;"><div style="display:flex;flex-direction:column;gap:6px;align-items:center;"><div style="display:flex;align-items:center;gap:12px;"><div style="font-size:0.8rem;color:var(--red);font-weight:600;width:100px;text-align:right;">array pop(0)</div><div style="padding:3px 16px;background:var(--red);color:white;border-radius:5px;font-size:0.85rem;opacity:0.8;">O(n)</div></div><div style="display:flex;align-items:center;gap:12px;"><div style="font-size:0.8rem;color:var(--green);font-weight:600;width:100px;text-align:right;">queue popleft()</div><div style="padding:3px 16px;background:var(--green);color:white;border-radius:5px;font-size:0.85rem;">O(1)</div></div></div></div><span class="lang-py">Python: <code>from collections import deque</code> → <code>popleft()</code> O(1)</span><span class="lang-cpp">C++: <code>#include &lt;queue&gt;</code> → <code>front()</code> + <code>pop()</code> O(1)</span><br><br>Compared to O(n) for removing from the front of an array, <strong>the difference is enormous for large data</strong>!' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            solutions: [
                {
                    approach: 'Queue (deque) Simulation',
                    description: 'Repeatedly discard the front card and move the next card to the back.',
                    timeComplexity: 'O(N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return stackQueueTopic.problems[3].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Initial Setup', code: 'from collections import deque  # O(1) insert/remove from both ends\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # Cards 1~N in queue (front = top)', desc: 'Why deque? list.pop(0) is O(n) but deque.popleft() is O(1)!\nSince removing from the front is the key operation, deque is essential.' },
                            { title: 'Loop Condition', code: 'from collections import deque  # O(1) insert/remove from both ends\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # Cards 1~N in queue (front = top)\n\nwhile len(q) > 1:  # Until 1 card remains', desc: 'When 1 card remains, that is the answer!\nEach iteration removes one card (by discarding).' },
                            { title: 'Card Operations', code: 'from collections import deque  # O(1) insert/remove from both ends\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # Cards 1~N in queue (front = top)\n\nwhile len(q) > 1:\n    q.popleft()            # Step 1: Discard the top card (O(1))\n    q.append(q.popleft())  # Step 2: Move the next card to the bottom', desc: 'Two key steps:\nStep 1: popleft() discards the top card\nStep 2: popleft() to take the next, append() to put it at the back\nAll O(1), so total is O(N)!' },
                            { title: 'Output Result', code: 'from collections import deque  # O(1) insert/remove from both ends\nimport sys\ninput = sys.stdin.readline\n\nN = int(input())\nq = deque(range(1, N + 1))  # Cards 1~N in queue (front = top)\n\nwhile len(q) > 1:\n    q.popleft()            # Step 1: Discard the top card (O(1))\n    q.append(q.popleft())  # Step 2: Move the next card to the bottom\n\nprint(q[0])  # The last remaining card!', desc: 'The last remaining card is the answer.' }
                        ],
                        cpp: [
                            { title: 'Initial Setup', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // Queue: FIFO (First In, First Out)\n    for (int i = 1; i <= N; i++)\n        q.push(i);  // Put cards 1~N into the queue', desc: 'Why queue? It supports removing from front (pop) and adding to back (push)!\nC++ provides queue via the <queue> header.\nUse front() to view the front and pop() to remove it.' },
                            { title: 'Loop Condition', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // Queue: FIFO (First In, First Out)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {  // Until 1 card remains', desc: 'When 1 card remains, that is the answer!\nEach iteration removes one card (by discarding).' },
                            { title: 'Card Operations', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // Queue: FIFO (First In, First Out)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {\n        q.pop();              // Step 1: Discard the top card\n        q.push(q.front());    // Step 2: Move the next card to the bottom\n        q.pop();              // Step 2 cont: Remove from original position (after push)', desc: 'Three key steps:\nStep 1: pop() discards the top card\nStep 2: front() reads the value, push() puts it at the back,\n   then pop() removes from the original position\nC++ pop() does not return a value, so you must read with front() first!' },
                            { title: 'Output Result', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    queue<int> q;  // Queue: FIFO (First In, First Out)\n    for (int i = 1; i <= N; i++)\n        q.push(i);\n\n    while (q.size() > 1) {\n        q.pop();              // Step 1: Discard the top card\n        q.push(q.front());    // Step 2: Move the next card to the bottom\n        q.pop();              // Remove from original position\n    }\n\n    cout << q.front() << endl;  // The last remaining card!', desc: 'The last remaining card is the answer.\nq.front() returns the front value of the queue.' }
                        ]
                    }
                }
            ],
            templates: {
                python: `from collections import deque
import sys
input = sys.stdin.readline

N = int(input())
q = deque(range(1, N + 1))

while len(q) > 1:
    q.popleft()          # Discard the top card
    q.append(q.popleft()) # Move the next card to the bottom

print(q[0])`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    int N;
    scanf("%d", &N);
    queue<int> q;
    for (int i = 1; i <= N; i++) q.push(i);

    while (q.size() > 1) {
        q.pop();             // Discard the top card
        q.push(q.front());   // Move the next card to the bottom
        q.pop();
    }
    printf("%d\\n", q.front());
}`
            }
        },
        {
            id: 'lc-155',
            title: 'LeetCode 155 - Min Stack',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/min-stack/',
            simIntro: 'Watch how the main stack and the min-tracking auxiliary stack work together.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Design a <code>MinStack</code> class that supports the following operations.</p>
                <ul>
                    <li><code>MinStack()</code> — initializes the stack object.</li>
                    <li><code>void push(int val)</code> — pushes <code>val</code> onto the stack.</li>
                    <li><code>void pop()</code> — removes the element on the top of the stack.</li>
                    <li><code>int top()</code> — gets the top element of the stack.</li>
                    <li><code>int getMin()</code> — retrieves the minimum element in the stack.</li>
                </ul>
                <p>Each function must run in <strong>O(1) time</strong>.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[], [-2], [0], [-3], [], [], [], []]</pre></div>
                    <div><strong>Output</strong><pre>[null, null, null, null, -3, null, 0, -2]</pre></div>
                </div><p class="example-explain">push(-2), push(0), push(-3) → getMin()=-3 → pop() → top()=0 → getMin()=-2</p></div>

                <h4>Constraints</h4>
                <ul>
                    <li>-2<sup>31</sup> &le; val &le; 2<sup>31</sup> - 1</li>
                    <li><code>pop</code>, <code>top</code>, <code>getMin</code> will only be called on non-empty stacks</li>
                    <li>At most 3 × 10<sup>4</sup> calls</li>
                </ul>
            `,
            hints: [
                { title: 'Understanding the problem', content: '<code>push</code>, <code>pop</code>, <code>top</code> are the same as a regular stack. The tricky part is <strong>getMin()</strong>!<br><br><code>getMin()</code> must always <strong>return the smallest value in the stack in O(1)</strong>.<br>Normally, finding the minimum requires scanning everything... but O(1)?' },
                { title: 'Would a single min variable work?', content: 'What if we update <code>min_val = min(min_val, x)</code> every time we push?<br><br><code>push(5)</code>, <code>push(2)</code>, <code>push(7)</code> → min_val = 2 ✓<br>But what if we <code>pop()</code> and <strong>remove 2?</strong> min_val is still 2, but 2 is gone!' },
                { title: 'After popping, how do we know the previous minimum?', content: 'After popping 2, we need to <strong>revert</strong> to the previous minimum (5).<br><br>"Reverting to a previous state"... Does that feel <strong>stack-like</strong>?<br>What if we "remember" the minimum at each point in time?' },
                { title: 'Use an auxiliary stack to remember the min at each point', content: 'Create one more stack called <strong>min_stack</strong>!<br><br>On <code>push(x)</code>: also push <code>min(x, current top of min_stack)</code> onto min_stack<br>On <code>pop()</code>: also pop from min_stack → the previous minimum automatically becomes the top!<br><code>getMin()</code>: just look at the top of min_stack → <strong>O(1)!</strong><div style="display:flex;justify-content:center;gap:20px;margin:12px 0;flex-wrap:wrap;align-items:flex-end;"><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--text2);font-weight:600;margin-bottom:4px;">stack</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 12px;border:2px solid var(--bg3);border-radius:8px;background:var(--bg2);"><div style="padding:3px 12px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">5</div><div style="padding:3px 12px;background:var(--accent);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="padding:3px 12px;background:var(--yellow);color:var(--text);border-radius:5px;font-size:0.8rem;font-weight:600;">7</div></div></div><div style="text-align:center;"><div style="font-size:0.75rem;color:var(--green);font-weight:600;margin-bottom:4px;">min_stack</div><div style="display:flex;flex-direction:column-reverse;align-items:center;gap:3px;padding:8px 12px;border:2px solid var(--green);border-radius:8px;background:var(--bg2);"><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">5</div><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;">2</div><div style="padding:3px 12px;background:var(--green);color:white;border-radius:5px;font-size:0.8rem;font-weight:600;box-shadow:0 0 6px var(--green);">2</div></div><div style="font-size:0.7rem;color:var(--green);margin-top:2px;">top = current min!</div></div></div>' },
                { title: 'Verify with an example', content: '<code>push(5)</code>: stack=[5], min_stack=[<strong>5</strong>]<br><code>push(2)</code>: stack=[5,2], min_stack=[5,<strong>2</strong>] ← min(2,5)=2<br><code>push(7)</code>: stack=[5,2,7], min_stack=[5,2,<strong>2</strong>] ← min(7,2)=2<br><br><code>pop()</code>: stack=[5,2], min_stack=[5,<strong>2</strong>] → getMin()=2 ✓<br><code>pop()</code>: stack=[5], min_stack=[<strong>5</strong>] → getMin()=5 ✓<br><br>Even though 2 was removed, the minimum automatically reverts to 5!' }
            ],
            inputDefault: 0,
            solve() { return '-3, 0, -2'; },
            solutions: [
                {
                    approach: 'Auxiliary Stack for Min Tracking',
                    description: 'Maintain a separate min stack alongside the main stack for O(1) getMin.',
                    timeComplexity: 'O(1) per op',
                    spaceComplexity: 'O(n)',
                    get templates() { return stackQueueTopic.problems[4].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Initialize', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # Main stack: actual data\n        self.min_stack = []  # Auxiliary stack: records the min at each point', desc: 'Why two stacks? To make getMin() O(1), we must always know "what the current min is"!\nThe top of min_stack always points to the current minimum.' },
                            { title: 'Implement push', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # Main stack: actual data\n        self.min_stack = []  # Auxiliary stack: records the min at each point\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)              # New minimum!\n        else:\n            self.min_stack.append(self.min_stack[-1])  # Min unchanged, copy as-is', desc: 'Key: always push to min_stack along with the main stack!\nIf val is less than or equal to current min → push val\nOtherwise → copy the existing min as-is\nThis keeps both stacks at the same height!' },
                            { title: 'Implement pop', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # Main stack: actual data\n        self.min_stack = []  # Auxiliary stack: records the min at each point\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()      # Remove from main\n        self.min_stack.pop()  # Remove from aux too → keep heights in sync!', desc: 'Why pop both?\nTo always keep the two stacks synchronized in height!\nAfter popping, min_stack[-1] still points to the correct minimum.' },
                            { title: 'top and getMin', code: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # Main stack: actual data\n        self.min_stack = []  # Auxiliary stack: records the min at each point\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if not self.min_stack or val <= self.min_stack[-1]:\n            self.min_stack.append(val)\n        else:\n            self.min_stack.append(self.min_stack[-1])\n\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self) -> int:\n        return self.stack[-1]      # Top of main stack\n\n    def getMin(self) -> int:\n        return self.min_stack[-1]  # Top of aux stack = current min! O(1)', desc: 'All operations are O(1)!\ntop() → stack[-1], getMin() → min_stack[-1]\nThanks to the auxiliary stack, there is no need to scan for the minimum each time.' }
                        ],
                        cpp: [
                            { title: 'Initialize', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // Main stack: actual data\n    stack<int> minSt;    // Auxiliary stack: records the min at each point', desc: 'Why two stacks? To make getMin() O(1), we must always know "what the current min is"!\nminSt.top() always points to the current minimum.\nIn C++, use stack<int> to create an integer stack.' },
                            { title: 'Implement push', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // Main stack\n    stack<int> minSt;    // Auxiliary stack: min at each point\n\npublic:\n    void push(int val) {\n        st.push(val);\n        // If aux stack is empty or new value is <= current min, update\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);              // New minimum!\n        else\n            minSt.push(minSt.top());      // Min unchanged, copy as-is', desc: 'Key: always push to minSt along with the main stack!\nIf val is less than or equal to current min → push val\nOtherwise → copy the existing min as-is\nThis keeps both stacks at the same height!' },
                            { title: 'Implement pop', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // Main stack\n    stack<int> minSt;    // Auxiliary stack: min at each point\n\npublic:\n    void push(int val) {\n        st.push(val);\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);\n        else\n            minSt.push(minSt.top());\n    }\n\n    void pop() {\n        st.pop();      // Remove from main\n        minSt.pop();   // Remove from aux too → keep heights in sync!', desc: 'Why pop both?\nTo always keep the two stacks synchronized in height!\nAfter popping, minSt.top() still points to the correct minimum.' },
                            { title: 'top and getMin', code: '#include <stack>\nusing namespace std;\n\nclass MinStack {\n    stack<int> st;       // Main stack\n    stack<int> minSt;    // Auxiliary stack: min at each point\n\npublic:\n    void push(int val) {\n        st.push(val);\n        if (minSt.empty() || val <= minSt.top())\n            minSt.push(val);\n        else\n            minSt.push(minSt.top());\n    }\n\n    void pop() {\n        st.pop();\n        minSt.pop();\n    }\n\n    int top() {\n        return st.top();       // Top of main stack\n    }\n\n    int getMin() {\n        return minSt.top();    // Top of aux stack = current min! O(1)\n    }\n};', desc: 'All operations are O(1)!\ntop() → st.top(), getMin() → minSt.top()\nThanks to the auxiliary stack, there is no need to scan for the minimum each time.' }
                        ]
                    }
                }
            ],
            templates: {
                python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []  # Auxiliary stack: min at each point

    def push(self, val: int) -> None:
        self.stack.append(val)
        # If min_stack is empty or new value is smaller, update
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
        else:
            self.min_stack.append(self.min_stack[-1])

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
                cpp: `class MinStack {
    stack<int> st, minSt;
public:
    MinStack() {}

    void push(int val) {
        st.push(val);
        if (minSt.empty() || val <= minSt.top())
            minSt.push(val);
        else
            minSt.push(minSt.top());
    }

    void pop() {
        st.pop();
        minSt.pop();
    }

    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`
            }
        }
    ],

    renderProblem(container) { container.innerHTML = ''; },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLeetCode = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLeetCode ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(descDiv);

        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>Step-by-step Hints</h3>';
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};
        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) { openedState[idx] = true; if (idx + 1 < problem.hints.length) { const ns = hintsDiv.children[idx + 1]; if (ns) ns.classList.remove('locked'); } }
            });
            hintsDiv.appendChild(step);
        });
        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `<div class="editor-header"><h3>Write Solution</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="Write your code here..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ Run</button><button id="check-btn" class="btn btn-success">✓ Check Answer</button></div><div id="output-area" class="output-area"><div class="output-label">Output</div><pre id="output-text"></pre></div>`;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; } });
        container.querySelector('#run-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); this._showOutput(container, `Expected answer:\n${expected}\n\n(Your code is correct if it produces the above output)`); });
        container.querySelector('#check-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); const site = isLeetCode ? 'LeetCode' : 'BOJ'; this._showOutput(container, `Expected answer:\n${expected}\n\nSubmit your code on ${site} to verify!`); });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.stackqueue = stackQueueTopic;
