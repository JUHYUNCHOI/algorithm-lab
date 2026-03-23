// ===== Priority Queue Topic Module =====
var priorityQueueTopic = {
    id: 'priorityqueue',
    title: 'Priority Queue',
    icon: '🏥',
    category: 'Advanced (Gold~Platinum)',
    order: 16,
    description: 'A data structure that always retrieves the most important item first',
    relatedNote: 'Priority queues are a key building block in many algorithms, including Dijkstra, Huffman coding, median maintenance, and task scheduling.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-11279': { type: 'Basic Heap',        color: 'var(--accent)', vizMethod: '_renderVizMaxHeap' },
        'boj-1927':  { type: 'Basic Heap',        color: 'var(--accent)', vizMethod: '_renderVizMinHeap' },
        'boj-11286': { type: 'Custom Heap',      color: 'var(--green)',  vizMethod: '_renderVizAbsHeap' },
        'boj-2075':  { type: 'Size-Limited Heap',   color: '#e17055',       vizMethod: '_renderVizNthLargest' },
        'boj-2696':  { type: 'Two Heaps',     color: '#6c5ce7',       vizMethod: '_renderVizMedianHeap' },
        'boj-1202':  { type: 'Greedy + Heap',    color: '#fdcb6e',       vizMethod: '_renderVizJewelThief' }
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
            sim:     { intro: prob.simIntro || 'See how the priority queue actually works in action.', icon: '🎮' },
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
                <h2>\uD83C\uDFE5 Priority Queue</h2>\
                <p class="hero-sub">A special kind of line where the most important item is always served first</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> What is a Priority Queue?</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> In an emergency room, patients are not treated in arrival order; the <strong>most critical patient</strong> is treated first.<br><br>\
                    At a convenience store checkout, customers are served in the order they arrive (FIFO).<br>\
                    But in an ER, a fracture patient comes before a cold patient, and a cardiac arrest patient comes before a fracture patient!<br><br>\
                    A data structure that <strong>always retrieves the highest-priority item first</strong> is called a <strong>priority queue</strong>.<br>\
                    You can insert items in any order, but when you remove one, the item with the <strong>highest priority</strong> always comes out.\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="18" width="40" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="12" cy="24" r="3" fill="currentColor"/><circle cx="22" cy="24" r="3" fill="currentColor"/><circle cx="32" cy="24" r="3" fill="currentColor"/><path d="M40 24l6-4M40 24l6 4" stroke="currentColor" stroke-width="2" fill="none"/></svg></span></div>\
                        <h3>Regular Queue (FIFO)</h3>\
                        <p>First in, first out.<br>Like a checkout line at the store!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="4" y="14" width="40" height="20" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="12" y="28" font-size="10" font-weight="bold" fill="currentColor">3</text><text x="22" y="28" font-size="10" font-weight="bold" fill="currentColor">1</text><text x="32" y="28" font-size="14" font-weight="bold" fill="#e74c3c">\u2605</text><path d="M40 24l6-4M40 24l6 4" stroke="#e74c3c" stroke-width="2.5" fill="none"/></svg></span></div>\
                        <h3>Priority Queue</h3>\
                        <p>The highest-priority item comes out first.<br>Like an ER treating the most urgent cases first!</p>\
                    </div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Patients arrive at the ER: cold (severity 1), fracture (severity 5), cardiac arrest (severity 10). In what order are they treated?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Cardiac arrest (10) \u2192 Fracture (5) \u2192 Cold (1)!<br>\
                        This is exactly how a <strong>max priority queue</strong> works. Larger numbers come out first.<br>\
                        The opposite, where smaller numbers come out first, is a <strong>min priority queue</strong>.\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try it — Regular Queue vs Priority Queue</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="pq-demo-qcmp-input" value="3,7,1,5,2" placeholder="comma separated" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:150px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-qcmp-btn">Insert & Remove</button>\
                        <button class="concept-demo-btn green" id="pq-demo-qcmp-reset" style="display:none;">Reset</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:8px;">Regular Queue (FIFO)</div>\
                                <div id="pq-demo-qcmp-fifo" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;"></div>\
                                <div id="pq-demo-qcmp-fifo-out" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:180px;">\
                                <div style="font-weight:600;margin-bottom:8px;">Priority Queue (Min-Heap)</div>\
                                <div id="pq-demo-qcmp-pq" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;"></div>\
                                <div id="pq-demo-qcmp-pq-out" style="margin-top:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-qcmp-msg">Insert the same values and remove one by one: the queue follows insertion order, while the priority queue removes smallest first!</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> Structure of a Heap</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> A heap has the shape of a <strong>complete binary tree</strong>.<br>\
                    Think of a company org chart! The CEO is at the top, directors below, and managers below that...<br><br>\
                    In a <strong>min heap</strong>, a parent is always smaller than its children.<br>\
                    This means the <strong>smallest value</strong> is always at the top (root)!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="36" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="20" y1="15" x2="15" y2="25" stroke="currentColor" stroke-width="2"/><line x1="28" y1="15" x2="33" y2="25" stroke="currentColor" stroke-width="2"/></svg></span></div>\
                        <h3>Complete Binary Tree</h3>\
                        <p>A binary tree filled<br>from left to right with no gaps.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><circle cx="24" cy="10" r="6" fill="none" stroke="#00b894" stroke-width="2.5"/><text x="24" y="14" text-anchor="middle" font-size="9" font-weight="bold" fill="#00b894">1</text><circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="14" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">3</text><circle cx="34" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/><text x="34" y="34" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">5</text><line x1="20" y1="15" x2="17" y2="25" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="15" x2="31" y2="25" stroke="currentColor" stroke-width="1.5"/></svg></span></div>\
                        <h3>Heap Property</h3>\
                        <p>Min heap: parent \u2264 child<br>Root is always the minimum!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon"><span class="icon-svg"><svg viewBox="0 0 48 48" width="40" height="40"><rect x="2" y="18" width="44" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><text x="10" y="28" font-size="8" font-weight="bold" fill="currentColor">1</text><text x="20" y="28" font-size="8" font-weight="bold" fill="currentColor">3</text><text x="30" y="28" font-size="8" font-weight="bold" fill="currentColor">5</text><text x="40" y="28" font-size="8" font-weight="bold" fill="currentColor">7</text><text x="10" y="14" font-size="7" fill="currentColor">0</text><text x="20" y="14" font-size="7" fill="currentColor">1</text><text x="30" y="14" font-size="7" fill="currentColor">2</text><text x="40" y="14" font-size="7" fill="currentColor">3</text></svg></span></div>\
                        <h3>Stored as an Array</h3>\
                        <p>Parent = i//2<br>Left child = 2*i, Right = 2*i+1</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Storing a heap as an array (1-indexed)\n#\n#        1          <- index 1 (root)\n#       / \\\\\n#      3    5       <- index 2, 3\n#     / \\\\  /\n#    7   9 8       <- index 4, 5, 6\n#\n# Array: [-, 1, 3, 5, 7, 9, 8]  (index 0 is unused)\n#\n# Parent index:    i // 2\n# Left child:      i * 2\n# Right child:     i * 2 + 1</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Storing a heap as an array (1-indexed)\n//\n//        1          &lt;- index 1 (root)\n//       / \\\\\n//      3    5       &lt;- index 2, 3\n//     / \\\\  /\n//    7   9 8       &lt;- index 4, 5, 6\n//\n// Array: {-, 1, 3, 5, 7, 9, 8}  (index 0 is unused)\n//\n// Parent index:    i / 2\n// Left child:      i * 2\n// Right child:     i * 2 + 1</code></pre></div></span>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In the array [-, 2, 5, 3, 8, 7], what are the parent and children of index 2 (value 5)?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Parent = 2 // 2 = <strong>index 1 \u2192 value 2</strong><br>\
                        Left child = 2 \u00D7 2 = <strong>index 4 \u2192 value 8</strong><br>\
                        Right child = 2 \u00D7 2 + 1 = <strong>index 5 \u2192 value 7</strong>\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try it — Array Index and Tree Position</div>\
                    <p style="color:var(--text2);font-size:0.85rem;margin-bottom:10px;">Click a cell in the array to see its position in the tree and its parent/child relationships.</p>\
                    <div class="concept-demo-body">\
                        <div style="margin-bottom:8px;font-weight:600;">Array (1-indexed)</div>\
                        <div id="pq-demo-a2t-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>\
                        <div style="margin-bottom:8px;font-weight:600;">Tree Structure</div>\
                        <div id="pq-demo-a2t-tree" style="position:relative;width:100%;height:150px;margin-bottom:8px;"></div>\
                        <div id="pq-demo-a2t-info" style="padding:8px 12px;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;min-height:1.5em;"></div>\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> Heap Operations: Insert and Delete</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-left:4px solid var(--green)">\
                        <h3>Insert (Push) \u2014 Bubble Up</h3>\
                        <p>\u2460 Add the new value at the end of the array<br>\u2461 Compare with the parent<br>\u2462 If smaller than parent, swap! (min heap)<br>\u2463 Repeat up to the root (Sift-Up)</p>\
                    </div>\
                    <div class="concept-card" style="border-left:4px solid var(--red)">\
                        <h3>Delete (Pop) \u2014 Trickle Down</h3>\
                        <p>\u2460 Remove the root (minimum)<br>\u2461 Move the last element to the root<br>\u2462 Compare with the smaller child<br>\u2463 If larger than child, swap! (Sift-Down)</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Min heap insert (Sift-Up)\ndef push(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 1 and heap[i] < heap[i // 2]:\n        heap[i], heap[i // 2] = heap[i // 2], heap[i]\n        i = i // 2\n\n# Min heap delete (Sift-Down)\ndef pop(heap):\n    if len(heap) <= 1:\n        return None\n    root = heap[1]\n    heap[1] = heap[-1]\n    heap.pop()\n    i = 1\n    while i * 2 < len(heap):\n        child = i * 2\n        if child + 1 < len(heap) and heap[child + 1] < heap[child]:\n            child += 1\n        if heap[i] > heap[child]:\n            heap[i], heap[child] = heap[child], heap[i]\n            i = child\n        else:\n            break\n    return root</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Min heap insert (Sift-Up)\nvoid push(vector&lt;int&gt;&amp; heap, int val) {\n    heap.push_back(val);\n    int i = heap.size() - 1;\n    while (i &gt; 1 &amp;&amp; heap[i] &lt; heap[i / 2]) {\n        swap(heap[i], heap[i / 2]);\n        i = i / 2;\n    }\n}\n\n// Min heap delete (Sift-Down)\nint pop(vector&lt;int&gt;&amp; heap) {\n    if (heap.size() &lt;= 1) return -1;\n    int root = heap[1];\n    heap[1] = heap.back();\n    heap.pop_back();\n    int i = 1;\n    while (i * 2 &lt; (int)heap.size()) {\n        int child = i * 2;\n        if (child + 1 &lt; (int)heap.size() &amp;&amp; heap[child + 1] &lt; heap[child])\n            child++;\n        if (heap[i] &gt; heap[child]) {\n            swap(heap[i], heap[child]);\n            i = child;\n        } else break;\n    }\n    return root;\n}</code></pre></div></span>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">What happens when you insert 2 into the min heap [-, 1, 3, 5, 7]?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        \u2460 Append to end: [-, 1, 3, 5, 7, <strong>2</strong>] (index 5)<br>\
                        \u2461 Parent (index 2) = 3, since 2 < 3, swap!<br>\
                        \u2192 [-, 1, <strong>2</strong>, 5, 7, <strong>3</strong>]<br>\
                        \u2462 Parent (index 1) = 1, since 2 > 1, done!<br>\
                        Result: [-, 1, 2, 5, 7, 3]\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try it — Sift-Up Insertion Animation</div>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <label style="font-size:0.85rem;color:var(--text2);">Current heap:</label>\
                        <input type="text" id="pq-demo-sift-heap" value="1,3,5,7,9" placeholder="comma separated" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:140px;background:var(--card);color:var(--text);">\
                        <label style="font-size:0.85rem;color:var(--text2);">Insert value:</label>\
                        <input type="number" id="pq-demo-sift-val" value="2" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-sift-btn">Insert!</button>\
                        <button class="concept-demo-btn green" id="pq-demo-sift-reset" style="display:none;">Reset</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;">Heap Array</div>\
                        <div id="pq-demo-sift-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;min-height:44px;"></div>\
                        <div id="pq-demo-sift-info" style="padding:8px 12px;background:var(--warm-bg);border-left:4px solid var(--warm-accent);border-radius:0 8px 8px 0;font-size:0.9rem;min-height:1.5em;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-sift-msg">After inserting at the end, watch the value bubble up by comparing with its parent (Sift-Up).</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> <span class="lang-py">Python heapq</span><span class="lang-cpp">C++ priority_queue</span> Usage</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try it — Min Heap vs Max Heap</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Push numbers and compare pop order for min heap vs max heap!</p>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">\
                            <input type="text" id="pq-s4-input" value="5,1,8,3" placeholder="comma separated" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                            <button class="concept-demo-btn" id="pq-s4-go">Push then Pop All</button>\
                        </div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:140px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">Min Heap</div>\
                                <div id="pq-s4-min" style="font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:140px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">Max Heap</div>\
                                <div id="pq-s4-max" style="font-size:0.9rem;color:var(--text);min-height:1.5em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-s4-msg"><span class="lang-py">Python heapq is a min heap by default. For max heap, multiply by -1!</span><span class="lang-cpp">C++ priority_queue is a max heap by default. Use greater&lt;&gt; for min heap!</span></div>\
                </div>\
            </div>\
            <span class="lang-py"><div class="concept-section" style="margin-top:0;">\
                <div class="concept-section-title"><span class="section-num">4</span> Using Python heapq</div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://docs.python.org/3/library/heapq.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: heapq ↗</a>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>heapq</code> \u2014 A min heap implementation module from the Python standard library.</p>\
                </div>\
                <div class="code-block"><pre><code class="language-python">import heapq\n\nheap = []\nheapq.heappush(heap, 5)\nheapq.heappush(heap, 1)\nheapq.heappush(heap, 3)\nprint(heapq.heappop(heap))  # 1 (smallest value)\n\n# Max heap trick: multiply by -1 when inserting, multiply by -1 again when removing\nmax_heap = []\nheapq.heappush(max_heap, -5)\nprint(-heapq.heappop(max_heap))  # 5\n\n# Change sort criteria using tuples\nabs_heap = []\nheapq.heappush(abs_heap, (abs(-3), -3))\nheapq.heappush(abs_heap, (abs(2), 2))\nval = heapq.heappop(abs_heap)  # (2, 2)</code></pre></div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card"><h3>heappush / heappop</h3><p>Both are O(log N).<br>Python heapq is always a <strong>min heap</strong>!</p></div>\
                    <div class="concept-card"><h3>Max Heap Trick</h3><p>Multiply by <strong>-1</strong> when inserting,<br>multiply by -1 again when removing!</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How can you use heapq to pop the number with the smallest absolute value first?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Insert <strong>(abs(x), x)</strong> tuples!<br>\
                        When absolute values are equal, the one with the smaller actual value comes out first.<br>\
                        This is the key idea behind <strong>Absolute Value Heap</strong> problems!\
                    </div>\
                </div>\
            </div></span>\
            <span class="lang-cpp"><div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> Using C++ priority_queue</div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.cppreference.com/w/cpp/container/priority_queue" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: priority_queue ↗</a>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>priority_queue</code> \u2014 A heap-based container adapter from the C++ standard library in the &lt;queue&gt; header.</p>\
                </div>\
                <div class="code-block"><pre><code class="language-cpp">#include &lt;queue&gt;\n#include &lt;vector&gt;\n#include &lt;iostream&gt;\nusing namespace std;\n\n// Default: max heap\npriority_queue&lt;int&gt; maxPQ;\nmaxPQ.push(5);\nmaxPQ.push(1);\nmaxPQ.push(3);\ncout &lt;&lt; maxPQ.top() &lt;&lt; endl;  // 5 (largest value)\nmaxPQ.pop();\n\n// Min heap: use greater comparator\npriority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; minPQ;\nminPQ.push(5);\nminPQ.push(1);\nminPQ.push(3);\ncout &lt;&lt; minPQ.top() &lt;&lt; endl;  // 1 (smallest value)\nminPQ.pop();\n\n// Change sort criteria using pairs\npriority_queue&lt;pair&lt;int,int&gt;, vector&lt;pair&lt;int,int&gt;&gt;, greater&lt;pair&lt;int,int&gt;&gt;&gt; absPQ;\nabsPQ.push({abs(-3), -3});\nabsPQ.push({abs(2), 2});\nauto val = absPQ.top();  // {2, 2}\nabsPQ.pop();</code></pre></div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card"><h3>push / top / pop</h3><p>push, pop are O(log N), top is O(1).<br>C++ priority_queue is a <strong>max heap</strong> by default!</p></div>\
                    <div class="concept-card"><h3>Making a Min Heap</h3><p><code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code><br>creates a <strong>min heap</strong>!</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How can you use priority_queue to pop the number with the smallest absolute value first?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Insert <strong>{abs(x), x}</strong> pairs into a min heap!<br>\
                        When absolute values are equal, the one with the smaller actual value comes out first.<br>\
                        This is the key idea behind <strong>Absolute Value Heap</strong> problems!\
                    </div>\
                </div>\
            </div></span>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> Heap Simulator</div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try it — Push / Pop Simulator</div>\
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="number" id="pq-demo-sim-val" value="4" style="padding:6px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:60px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="pq-demo-sim-push">Push</button>\
                        <button class="concept-demo-btn" id="pq-demo-sim-pop" style="background:var(--red);color:#fff;">Pop</button>\
                        <button class="concept-demo-btn green" id="pq-demo-sim-clear">Clear</button>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:200px;">\
                                <div style="font-weight:600;margin-bottom:8px;">Tree View</div>\
                                <div id="pq-demo-sim-tree" style="position:relative;width:100%;min-height:140px;margin-bottom:8px;"></div>\
                            </div>\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;margin-bottom:8px;">Array View</div>\
                                <div id="pq-demo-sim-arr" style="display:flex;gap:4px;flex-wrap:wrap;min-height:44px;margin-bottom:8px;"></div>\
                            </div>\
                        </div>\
                        <div id="pq-demo-sim-log" style="padding:8px 12px;background:var(--bg);border-radius:8px;font-size:0.85rem;color:var(--text2);min-height:1.5em;max-height:100px;overflow-y:auto;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="pq-demo-sim-msg">Push values in and Pop the minimum out. The tree and array update simultaneously!</div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">6</span> Tips for Solving Priority Queue Problems</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <span class="lang-py"><div class="concept-card"><h3>\u2460 Basic Heap Ops</h3><p>Use heappush/heappop to implement<br>max\u00B7min\u00B7absolute value heaps.</p></div></span>\
                    <span class="lang-cpp"><div class="concept-card"><h3>\u2460 Basic Heap Ops</h3><p>Use push/top/pop to implement<br>max\u00B7min\u00B7absolute value heaps.</p></div></span>\
                    <div class="concept-card"><h3>\u2461 Size-Limited Heap</h3><p>Keep the heap at size N to efficiently<br>find the <strong>Nth largest number</strong>.</p></div>\
                    <div class="concept-card"><h3>\u2462 Two Heaps</h3><p>Use max heap + min heap to find<br>the <strong>median</strong> in real time.</p></div>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Why does the Jewel Thief problem require greedy + heap?</span>\
                    </div>\
                    <button class="think-box-trigger">\uD83E\uDD14 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Process bags in order of <strong>smallest capacity first</strong>.<br>\
                        For each bag, put all jewels that fit into a <strong>max heap</strong> and pick the most valuable one.<br><br>\
                        Jewels that fit in a small bag also fit in a larger bag, so<br>\
                        once a jewel is added to the heap, it never needs to be removed!\
                    </div>\
                </div>\
\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Type Matching Quiz</div>\
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">Pick the best heap/priority queue pattern for each problem!</p>\
                    <div id="pq-demo-quiz" style="display:flex;flex-direction:column;gap:12px;"></div>\
                    <div id="pq-demo-quiz-score" style="margin-top:12px;padding:8px 12px;background:var(--bg);border-radius:8px;text-align:center;min-height:1.5em;font-size:0.9rem;"></div>\
                </div>\
            </div>\
        ';
        this._initConceptInteractions(container);
        this._initConceptDemos(container);
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
    },

    _initConceptDemos: function(container) {
        // Helper: render tree from array (1-indexed)
        function renderTree(treeEl, heap, highlightIdx) {
            treeEl.innerHTML = '';
            if (heap.length <= 1) { treeEl.innerHTML = '<span style="color:var(--text3);">Empty</span>'; return; }
            var levels = Math.ceil(Math.log2(heap.length));
            var nodeW = 40, nodeH = 40;
            var totalW = treeEl.offsetWidth || 300;
            // Draw edges first, then nodes
            for (var i = 1; i < heap.length; i++) {
                var level = Math.floor(Math.log2(i));
                var posInLevel = i - Math.pow(2, level);
                var totalInLevel = Math.pow(2, level);
                var x = totalW * (posInLevel + 0.5) / totalInLevel;
                var y = level * 45 + 10;
                // Edge to parent
                if (i > 1) {
                    var pi = Math.floor(i / 2);
                    var pLevel = Math.floor(Math.log2(pi));
                    var pPos = pi - Math.pow(2, pLevel);
                    var pTotal = Math.pow(2, pLevel);
                    var px = totalW * (pPos + 0.5) / pTotal;
                    var py = pLevel * 45 + 10;
                    var line = document.createElement('div');
                    line.style.cssText = 'position:absolute;height:2px;background:var(--border);transform-origin:0 0;';
                    var dx = x - px, dy = y - py;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    line.style.width = dist + 'px';
                    line.style.left = px + 'px';
                    line.style.top = (py + nodeH / 2) + 'px';
                    line.style.transform = 'rotate(' + angle + 'deg)';
                    treeEl.appendChild(line);
                }
            }
            for (var i = 1; i < heap.length; i++) {
                var level = Math.floor(Math.log2(i));
                var posInLevel = i - Math.pow(2, level);
                var totalInLevel = Math.pow(2, level);
                var x = totalW * (posInLevel + 0.5) / totalInLevel;
                var y = level * 45 + 10;
                var node = document.createElement('div');
                node.style.cssText = 'position:absolute;width:' + nodeW + 'px;height:' + nodeH + 'px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;transition:all 0.3s ease;';
                node.style.left = (x - nodeW / 2) + 'px';
                node.style.top = y + 'px';
                if (highlightIdx === i) {
                    node.style.background = 'var(--yellow)';
                    node.style.color = '#333';
                    node.style.boxShadow = '0 0 10px var(--yellow)80';
                } else {
                    node.style.background = 'var(--accent)';
                    node.style.color = '#fff';
                }
                node.textContent = heap[i];
                treeEl.appendChild(node);
            }
            treeEl.style.height = (levels * 45 + 20) + 'px';
        }

        function renderArrBoxes(arrEl, heap, highlightIdx) {
            arrEl.innerHTML = '';
            for (var i = 1; i < heap.length; i++) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.style.cssText = 'min-width:36px;text-align:center;transition:all 0.3s ease;';
                if (highlightIdx === i) {
                    box.style.background = 'var(--yellow)20';
                    box.style.boxShadow = '0 0 6px var(--yellow)60';
                }
                box.innerHTML = '<div class="str-char-idx" style="font-size:0.6rem;">' + i + '</div><div class="str-char-val">' + heap[i] + '</div>';
                arrEl.appendChild(box);
            }
            if (heap.length <= 1) arrEl.innerHTML = '<span style="color:var(--text3);">Empty</span>';
        }

        // ===== Section 4 demo: Min Heap vs Max Heap =====
        (function() {
            var inputEl = container.querySelector('#pq-s4-input');
            var minEl = container.querySelector('#pq-s4-min');
            var maxEl = container.querySelector('#pq-s4-max');
            var goBtn = container.querySelector('#pq-s4-go');
            if (!goBtn) return;
            goBtn.addEventListener('click', function() {
                var vals = inputEl.value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
                if (!vals.length) return;
                var sorted = vals.slice().sort(function(a,b) { return a-b; });
                var rSorted = vals.slice().sort(function(a,b) { return b-a; });
                var minBoxes = sorted.map(function(v) {
                    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:var(--green);color:#fff;font-weight:700;font-size:0.9rem;">' + v + '</span>';
                }).join(' → ');
                var maxBoxes = rSorted.map(function(v) {
                    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:var(--accent);color:#fff;font-weight:700;font-size:0.9rem;">' + v + '</span>';
                }).join(' → ');
                minEl.innerHTML = 'Pop order: ' + minBoxes;
                maxEl.innerHTML = 'Pop order: ' + maxBoxes;
            });
        })();

        // ===== Demo 1: Queue vs Priority Queue =====
        {
            var qcmpBtn = container.querySelector('#pq-demo-qcmp-btn');
            var qcmpReset = container.querySelector('#pq-demo-qcmp-reset');
            var qcmpInput = container.querySelector('#pq-demo-qcmp-input');
            var fifoEl = container.querySelector('#pq-demo-qcmp-fifo');
            var pqEl = container.querySelector('#pq-demo-qcmp-pq');
            var fifoOut = container.querySelector('#pq-demo-qcmp-fifo-out');
            var pqOut = container.querySelector('#pq-demo-qcmp-pq-out');
            var qcmpMsg = container.querySelector('#pq-demo-qcmp-msg');
            var qcmpAnimating = false;

            function parseQArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
            }
            function makeBox(val, bg) {
                return '<div style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:' + bg + ';color:#fff;font-weight:700;font-size:0.9rem;transition:all 0.3s ease;">' + val + '</div>';
            }

            if (qcmpBtn) {
                qcmpBtn.addEventListener('click', function() {
                    if (qcmpAnimating) return;
                    qcmpAnimating = true;
                    qcmpBtn.style.display = 'none';
                    qcmpReset.style.display = '';
                    var vals = parseQArr(qcmpInput.value);
                    if (vals.length === 0) { qcmpMsg.textContent = 'Please enter values!'; qcmpAnimating = false; qcmpBtn.style.display = ''; qcmpReset.style.display = 'none'; return; }

                    // Phase 1: Insert all
                    fifoEl.innerHTML = '';
                    pqEl.innerHTML = '';
                    fifoOut.textContent = '';
                    pqOut.textContent = '';
                    var fifoQueue = [];
                    var pqArr = [];
                    var insertStep = 0;

                    function insertNext() {
                        if (insertStep >= vals.length) {
                            fifoOut.textContent = 'All inserted! Now removing one by one...';
                            pqOut.textContent = 'All inserted! Now removing one by one...';
                            setTimeout(popNext, 800);
                            return;
                        }
                        var v = vals[insertStep];
                        fifoQueue.push(v);
                        pqArr.push(v);
                        pqArr.sort(function(a, b) { return a - b; });
                        fifoEl.innerHTML = fifoQueue.map(function(x) { return makeBox(x, 'var(--accent)'); }).join('');
                        pqEl.innerHTML = pqArr.map(function(x) { return makeBox(x, 'var(--green)'); }).join('');
                        insertStep++;
                        setTimeout(insertNext, 500);
                    }

                    // Phase 2: Pop all
                    var fifoPopped = [];
                    var pqPopped = [];
                    function popNext() {
                        if (fifoQueue.length === 0) {
                            fifoOut.innerHTML = 'Output order: <strong>' + fifoPopped.join(' \u2192 ') + '</strong>';
                            pqOut.innerHTML = 'Output order: <strong style="color:var(--green);">' + pqPopped.join(' \u2192 ') + '</strong>';
                            qcmpMsg.textContent = 'The queue outputs in insertion order, while the priority queue outputs smallest first!';
                            qcmpAnimating = false;
                            return;
                        }
                        var fv = fifoQueue.shift();
                        fifoPopped.push(fv);
                        var pv = pqArr.shift();
                        pqPopped.push(pv);
                        fifoEl.innerHTML = fifoQueue.map(function(x) { return makeBox(x, 'var(--accent)'); }).join('');
                        pqEl.innerHTML = pqArr.map(function(x) { return makeBox(x, 'var(--green)'); }).join('');
                        if (fifoQueue.length === 0) { fifoEl.innerHTML = '<span style="color:var(--text3);">Empty</span>'; pqEl.innerHTML = '<span style="color:var(--text3);">Empty</span>'; }
                        fifoOut.innerHTML = 'Removed: ' + fifoPopped.join(' \u2192 ');
                        pqOut.innerHTML = 'Removed: ' + pqPopped.join(' \u2192 ');
                        setTimeout(popNext, 600);
                    }

                    insertNext();
                });

                qcmpReset.addEventListener('click', function() {
                    qcmpAnimating = false;
                    qcmpBtn.style.display = '';
                    qcmpReset.style.display = 'none';
                    fifoEl.innerHTML = '';
                    pqEl.innerHTML = '';
                    fifoOut.textContent = '';
                    pqOut.textContent = '';
                    qcmpMsg.textContent = 'Insert the same values and remove one by one: the queue follows insertion order, while the priority queue removes smallest first!';
                });
            }
        }

        // ===== Demo 2: Array <-> Tree Conversion =====
        {
            var a2tArr = container.querySelector('#pq-demo-a2t-arr');
            var a2tTree = container.querySelector('#pq-demo-a2t-tree');
            var a2tInfo = container.querySelector('#pq-demo-a2t-info');
            var heapVals = [null, 1, 3, 5, 7, 9, 8]; // 1-indexed

            if (a2tArr) {
                function renderA2T(highlightIdx) {
                    a2tArr.innerHTML = '';
                    for (var i = 1; i < heapVals.length; i++) {
                        var box = document.createElement('div');
                        box.className = 'str-char-box';
                        box.style.cssText = 'min-width:38px;text-align:center;cursor:pointer;transition:all 0.3s ease;';
                        box.dataset.idx = i;
                        if (highlightIdx === i) {
                            box.style.background = 'var(--yellow)20';
                            box.style.boxShadow = '0 0 8px var(--yellow)60';
                        }
                        box.innerHTML = '<div class="str-char-idx" style="font-size:0.6rem;">i=' + i + '</div><div class="str-char-val">' + heapVals[i] + '</div>';
                        box.addEventListener('click', function() {
                            var idx = parseInt(this.dataset.idx);
                            renderA2T(idx);
                            var parent = Math.floor(idx / 2);
                            var left = idx * 2;
                            var right = idx * 2 + 1;
                            var info = '<strong>Index ' + idx + '</strong> (value: ' + heapVals[idx] + ')<br>';
                            info += 'Parent: ' + (parent >= 1 ? 'i/' + 2 + ' = index ' + parent + ' (value: ' + heapVals[parent] + ')' : 'None (root)') + '<br>';
                            info += 'Left child: ' + (left < heapVals.length ? '2*i = index ' + left + ' (value: ' + heapVals[left] + ')' : 'None') + '<br>';
                            info += 'Right child: ' + (right < heapVals.length ? '2*i+1 = index ' + right + ' (value: ' + heapVals[right] + ')' : 'None');
                            a2tInfo.innerHTML = info;
                        });
                        a2tArr.appendChild(box);
                    }
                    renderTree(a2tTree, heapVals, highlightIdx);
                }
                renderA2T(null);
                a2tInfo.innerHTML = 'Click a cell in the array!';
            }
        }

        // ===== Demo 3: Sift-Up Insertion =====
        {
            var siftBtn = container.querySelector('#pq-demo-sift-btn');
            var siftReset = container.querySelector('#pq-demo-sift-reset');
            var siftHeapInput = container.querySelector('#pq-demo-sift-heap');
            var siftValInput = container.querySelector('#pq-demo-sift-val');
            var siftArrEl = container.querySelector('#pq-demo-sift-arr');
            var siftInfo = container.querySelector('#pq-demo-sift-info');
            var siftMsg = container.querySelector('#pq-demo-sift-msg');
            var siftAnimating = false;

            function parseSiftArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(v) { return !isNaN(v); });
            }
            function renderSiftArr(heap, highlightIdx) {
                renderArrBoxes(siftArrEl, heap, highlightIdx);
            }

            if (siftBtn) {
                var initHeap = parseSiftArr(siftHeapInput.value);
                var h0 = [null].concat(initHeap);
                renderSiftArr(h0, null);
                siftInfo.innerHTML = 'Click Insert to see Sift-Up in action';

                siftBtn.addEventListener('click', function() {
                    if (siftAnimating) return;
                    siftAnimating = true;
                    siftBtn.style.display = 'none';
                    siftReset.style.display = '';
                    var heapArr = parseSiftArr(siftHeapInput.value);
                    var val = parseInt(siftValInput.value);
                    if (isNaN(val)) { siftMsg.textContent = 'Please enter a value to insert!'; siftAnimating = false; siftBtn.style.display = ''; siftReset.style.display = 'none'; return; }
                    var heap = [null].concat(heapArr);
                    heap.push(val);
                    var idx = heap.length - 1;
                    renderSiftArr(heap, idx);
                    siftInfo.innerHTML = 'Added <strong>' + val + '</strong> at the end (index ' + idx + ')';

                    function siftStep() {
                        if (idx <= 1) { siftInfo.innerHTML = '<strong style="color:var(--green);">Reached root! Sift-Up complete.</strong> Result: [' + heap.slice(1).join(', ') + ']'; siftAnimating = false; return; }
                        var parent = Math.floor(idx / 2);
                        if (heap[idx] < heap[parent]) {
                            siftInfo.innerHTML = heap[idx] + ' < ' + heap[parent] + ' (parent) \u2192 <strong>Swap!</strong>';
                            var tmp = heap[idx]; heap[idx] = heap[parent]; heap[parent] = tmp;
                            idx = parent;
                            renderSiftArr(heap, idx);
                            setTimeout(siftStep, 800);
                        } else {
                            siftInfo.innerHTML = heap[idx] + ' \u2265 ' + heap[parent] + ' (parent) \u2192 <strong style="color:var(--green);">Sift-Up complete!</strong> Result: [' + heap.slice(1).join(', ') + ']';
                            renderSiftArr(heap, null);
                            siftAnimating = false;
                        }
                    }
                    setTimeout(siftStep, 800);
                });

                siftReset.addEventListener('click', function() {
                    siftAnimating = false;
                    siftBtn.style.display = '';
                    siftReset.style.display = 'none';
                    var h = [null].concat(parseSiftArr(siftHeapInput.value));
                    renderSiftArr(h, null);
                    siftInfo.innerHTML = 'Click Insert to see Sift-Up in action';
                    siftMsg.textContent = 'After inserting at the end, watch the value bubble up by comparing with its parent (Sift-Up).';
                });
            }
        }

        // ===== Demo 4: Push/Pop Simulator =====
        {
            var simPush = container.querySelector('#pq-demo-sim-push');
            var simPop = container.querySelector('#pq-demo-sim-pop');
            var simClear = container.querySelector('#pq-demo-sim-clear');
            var simValInput = container.querySelector('#pq-demo-sim-val');
            var simTreeEl = container.querySelector('#pq-demo-sim-tree');
            var simArrEl = container.querySelector('#pq-demo-sim-arr');
            var simLog = container.querySelector('#pq-demo-sim-log');
            var simHeap = [null]; // 1-indexed

            function siftUp(heap, idx) {
                while (idx > 1) {
                    var parent = Math.floor(idx / 2);
                    if (heap[idx] < heap[parent]) {
                        var tmp = heap[idx]; heap[idx] = heap[parent]; heap[parent] = tmp;
                        idx = parent;
                    } else break;
                }
            }
            function siftDown(heap, idx) {
                while (idx * 2 < heap.length) {
                    var child = idx * 2;
                    if (child + 1 < heap.length && heap[child + 1] < heap[child]) child++;
                    if (heap[idx] > heap[child]) {
                        var tmp = heap[idx]; heap[idx] = heap[child]; heap[child] = tmp;
                        idx = child;
                    } else break;
                }
            }
            function renderSim(hl) {
                renderTree(simTreeEl, simHeap, hl);
                renderArrBoxes(simArrEl, simHeap, hl);
            }

            if (simPush) {
                renderSim(null);
                simLog.textContent = 'Use Push/Pop buttons to manipulate the heap.';

                simPush.addEventListener('click', function() {
                    var val = parseInt(simValInput.value);
                    if (isNaN(val)) return;
                    simHeap.push(val);
                    siftUp(simHeap, simHeap.length - 1);
                    renderSim(simHeap.length - 1);
                    simLog.innerHTML = 'Push(' + val + ') \u2192 Array: [' + simHeap.slice(1).join(', ') + ']<br>' + simLog.innerHTML;
                });

                simPop.addEventListener('click', function() {
                    if (simHeap.length <= 1) { simLog.innerHTML = 'Heap is empty!<br>' + simLog.innerHTML; return; }
                    var popped = simHeap[1];
                    simHeap[1] = simHeap[simHeap.length - 1];
                    simHeap.pop();
                    if (simHeap.length > 1) siftDown(simHeap, 1);
                    renderSim(1);
                    simLog.innerHTML = 'Pop() \u2192 Removed <strong>' + popped + '</strong>! Remaining: [' + simHeap.slice(1).join(', ') + ']<br>' + simLog.innerHTML;
                });

                simClear.addEventListener('click', function() {
                    simHeap = [null];
                    renderSim(null);
                    simLog.textContent = 'Heap cleared.';
                });
            }
        }

        // ===== Demo 5: Type Matching Quiz =====
        {
            var quizEl = container.querySelector('#pq-demo-quiz');
            var quizScore = container.querySelector('#pq-demo-quiz-score');
            if (quizEl) {
                var quizData = [
                    { q: '"Numbers keep arriving, output the largest each time"', a: 'Max Heap', choices: ['Max Heap', 'Min Heap', 'Sorting', 'Stack'] },
                    { q: '"Find the Kth largest number among N numbers"', a: 'Size-Limited Heap', choices: ['Brute Force', 'Size-Limited Heap', 'Binary Search', 'Sorting'] },
                    { q: '"Numbers keep arriving, output the median each time"', a: 'Two Heaps', choices: ['Sorting', 'Min Heap', 'Two Heaps', 'Binary Search'] },
                    { q: '"Pick the most expensive jewel that fits in the bag"', a: 'Greedy + Heap', choices: ['DP', 'Greedy + Heap', 'BFS', 'Two Pointers'] },
                    { q: '"Process edges with smallest weight first in a graph"', a: 'Min Heap', choices: ['Stack', 'DFS', 'Min Heap', 'Queue'] }
                ];
                var correct = 0;
                var answered = 0;

                quizData.forEach(function(item, idx) {
                    var qDiv = document.createElement('div');
                    qDiv.style.cssText = 'padding:12px 16px;background:var(--bg2);border-radius:10px;border:1px solid var(--border);';
                    var qText = document.createElement('div');
                    qText.style.cssText = 'font-weight:600;margin-bottom:8px;font-size:0.9rem;';
                    qText.textContent = (idx + 1) + '. ' + item.q;
                    qDiv.appendChild(qText);
                    var btnsDiv = document.createElement('div');
                    btnsDiv.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;';
                    item.choices.forEach(function(ch) {
                        var btn = document.createElement('button');
                        btn.className = 'concept-demo-btn';
                        btn.style.cssText = 'font-size:0.8rem;padding:4px 12px;';
                        btn.textContent = ch;
                        btn.addEventListener('click', function() {
                            if (qDiv.dataset.done) return;
                            qDiv.dataset.done = '1';
                            answered++;
                            var isCorrect = (ch === item.a);
                            if (isCorrect) {
                                correct++;
                                btn.style.background = 'var(--green)';
                                btn.style.color = '#fff';
                                btn.style.boxShadow = '0 0 8px var(--green)60';
                            } else {
                                btn.style.background = 'var(--red)';
                                btn.style.color = '#fff';
                                btnsDiv.querySelectorAll('button').forEach(function(b) {
                                    if (b.textContent === item.a) { b.style.background = 'var(--green)'; b.style.color = '#fff'; }
                                });
                            }
                            if (answered === quizData.length) {
                                quizScore.innerHTML = '<strong>' + correct + '/' + quizData.length + '</strong> correct! ' + (correct === quizData.length ? 'Perfect!' : 'Review the ones you missed.');
                                quizScore.style.color = correct === quizData.length ? 'var(--green)' : 'var(--text)';
                            } else {
                                quizScore.textContent = correct + '/' + answered + ' correct (' + (quizData.length - answered) + ' remaining)';
                            }
                        });
                        btnsDiv.appendChild(btn);
                    });
                    qDiv.appendChild(btnsDiv);
                    quizEl.appendChild(qDiv);
                });
            }
        }
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
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
            if (idx < 0) { indicator.textContent = 'Before start'; desc.textContent = '▶ Click Next to start'; }
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
    // Simulation 1: Max Heap (boj-11279)
    // ====================================================================
    _renderVizMaxHeap: function(container) {
        var self = this, suffix = '-maxheap';
        var DEFAULT_OPS = '1 1, 1 2, 1 3, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Ops: <input type="text" id="pq-maxh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-maxh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: "1 value" = insert, "0" = delete (comma separated). Ex:1 5, 1 3, 0, 1 7, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="mxh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="mxh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#mxh-arr' + suffix);
        var infoEl = container.querySelector('#mxh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">Empty</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--accent);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseOps(str) {
            return str.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; }).map(function(s) {
                var parts = s.split(/\s+/);
                if (parts[0] === '0') return { type: 'pop' };
                return { type: 'push', val: parseInt(parts[1]) || 0 };
            });
        }
        function buildSteps(ops) {
            var heap = [], states = [{ h: [], msg: 'Let us insert and remove values in a max heap.' }];
            ops.forEach(function(op) {
                if (op.type === 'push') {
                    heap.push(op.val); heap.sort(function(a, b) { return b - a; });
                    states.push({ h: heap.slice(), msg: 'Inserted ' + op.val + ', sorted order maintained! Heap: [' + heap.join(', ') + '] \u2014 max heap always keeps the largest value at the front' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: 'Heap is empty, output 0 \u2014 nothing to delete' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: 'Popped max ' + popped + '! \u2014 the root of a max heap is always the maximum, so removal takes O(log N)' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({
                        description: cur.msg,
                        action: function() { renderHeap(cur.h, cur.msg); },
                        undo: function() { renderHeap(prev.h, prev.msg); }
                    });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var ops = parseOps(opsStr);
            var result = buildSteps(ops);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-maxh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-maxh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // Simulation 2: Min Heap (boj-1927)
    // ====================================================================
    _renderVizMinHeap: function(container) {
        var self = this, suffix = '-minheap';
        var DEFAULT_OPS = '1 5, 1 1, 1 3, 1 2, 0, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Ops: <input type="text" id="pq-minh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-minh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: "1 value" = insert, "0" = delete (comma separated). Ex:1 5, 1 1, 0, 1 3, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="mnh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="mnh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#mnh-arr' + suffix);
        var infoEl = container.querySelector('#mnh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">Empty</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseOps(str) {
            return str.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; }).map(function(s) {
                var parts = s.split(/\s+/);
                if (parts[0] === '0') return { type: 'pop' };
                return { type: 'push', val: parseInt(parts[1]) || 0 };
            });
        }
        function buildSteps(ops) {
            var heap = [], states = [{ h: [], msg: 'Let us insert and remove values in a min heap.' }];
            ops.forEach(function(op) {
                if (op.type === 'push') {
                    heap.push(op.val); heap.sort(function(a, b) { return a - b; });
                    states.push({ h: heap.slice(), msg: 'Inserted ' + op.val + ', sorted order maintained! Heap: [' + heap.join(', ') + '] \u2014 min heap always keeps the smallest value at the front' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: 'Heap is empty, output 0 \u2014 nothing to delete' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: 'Popped min ' + popped + '! \u2014 the root of a min heap is always the minimum, so removal takes O(log N)' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({
                        description: cur.msg,
                        action: function() { renderHeap(cur.h, cur.msg); },
                        undo: function() { renderHeap(prev.h, prev.msg); }
                    });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var ops = parseOps(opsStr);
            var result = buildSteps(ops);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-minh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-minh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // Simulation 3: Absolute Value Heap (boj-11286)
    // ====================================================================
    _renderVizAbsHeap: function(container) {
        var self = this, suffix = '-absheap';
        var DEFAULT_OPS = '1, -1, 0, 0, 0';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Ops: <input type="text" id="pq-absh-input" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<button class="btn btn-primary" id="pq-absh-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Format: non-zero integer = insert, 0 = delete (comma separated). Ex: 1, -1, 0, -2, 3, 0</p>' +
            self._createStepDesc(suffix) +
            '<div id="abh-arr' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="abh-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#abh-arr' + suffix);
        var infoEl = container.querySelector('#abh-info' + suffix);
        function renderHeap(h, msg) {
            arrEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">Empty</span>' :
                h.map(function(v) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function absSort(a, b) { if (Math.abs(a) !== Math.abs(b)) return Math.abs(a) - Math.abs(b); return a - b; }
        function parseOps(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(seq) {
            var heap = [], states = [{ h: [], msg: 'Starting absolute value heap simulation. Sorted by |value|, then by actual value for ties.' }];
            seq.forEach(function(x) {
                if (x !== 0) {
                    heap.push(x); heap.sort(absSort);
                    states.push({ h: heap.slice(), msg: 'Inserted ' + x + '! Heap: [' + heap.join(', ') + '] \u2014 sorted by absolute value so the smallest |value| stays at front' });
                } else {
                    if (heap.length === 0) {
                        states.push({ h: [], msg: 'Heap is empty, output 0 \u2014 nothing to delete' });
                    } else {
                        var popped = heap.shift();
                        states.push({ h: heap.slice(), msg: 'Popped abs-min ' + popped + ' (|' + popped + '|=' + Math.abs(popped) + ')! \u2014 the element with smallest absolute value is always at the root' });
                    }
                }
            });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg, action: function() { renderHeap(cur.h, cur.msg); }, undo: function() { renderHeap(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(opsStr) {
            var seq = parseOps(opsStr);
            var result = buildSteps(seq);
            renderHeap(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-absh-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-absh-input').value);
        });
        runSim(DEFAULT_OPS);
    },

    // ====================================================================
    // Simulation 4: Nth Largest Number (boj-2075)
    // ====================================================================
    _renderVizNthLargest: function(container) {
        var self = this, suffix = '-nth';
        var DEFAULT_N = 3;
        var DEFAULT_ROWS = '12 7 9, 13 8 11, 21 10 26';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="pq-nth-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">Row data: <input type="text" id="pq-nth-rows" value="' + DEFAULT_ROWS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="pq-nth-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Rows separated by commas, values by spaces. Ex: 12 7 9, 13 8 11, 21 10 26</p>' +
            self._createStepDesc(suffix) +
            '<div id="nth-heap' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="nth-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var heapEl = container.querySelector('#nth-heap' + suffix);
        var infoEl = container.querySelector('#nth-info' + suffix);
        function renderH(h, msg) {
            heapEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">Empty</span>' :
                h.map(function(v, i) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:' + (i === 0 ? 'var(--accent)' : 'var(--bg2)') + ';color:' + (i === 0 ? 'white' : 'var(--text)') + ';font-weight:700;border:2px solid var(--accent);">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseRows(str) {
            return str.split(',').map(function(s) {
                return s.trim().split(/\s+/).map(Number).filter(function(n) { return !isNaN(n); });
            }).filter(function(row) { return row.length > 0; });
        }
        function buildSteps(N, rows) {
            var heap = [], states = [{ h: [], msg: 'Maintain a min heap of size ' + N + ' \u2014 the root will always be the Nth largest value.' }];
            rows.forEach(function(row) {
                row.forEach(function(x) {
                    if (heap.length < N) {
                        heap.push(x); heap.sort(function(a, b) { return a - b; });
                        states.push({ h: heap.slice(), msg: 'Insert ' + x + ' (heap size &lt; ' + N + ', so we must fill it first). Heap: [' + heap.join(', ') + ']' });
                    } else if (x > heap[0]) {
                        var old = heap[0]; heap[0] = x; heap.sort(function(a, b) { return a - b; });
                        states.push({ h: heap.slice(), msg: x + ' &gt; root(' + old + ') \u2014 ' + x + ' could be among the top ' + N + ', so replace the smallest. Heap: [' + heap.join(', ') + ']' });
                    } else {
                        states.push({ h: heap.slice(), msg: x + ' \u2264 root(' + heap[0] + ') \u2014 too small to be in the top ' + N + ', skip!' });
                    }
                });
            });
            states.push({ h: heap.slice(), msg: '<strong style="color:var(--green);">\u2705 Nth largest = ' + heap[0] + ' (heap root)</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(nVal, rowsStr) {
            var N = parseInt(nVal) || 1;
            var rows = parseRows(rowsStr);
            var result = buildSteps(N, rows);
            renderH(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-nth-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-nth-n').value, container.querySelector('#pq-nth-rows').value);
        });
        runSim(DEFAULT_N, DEFAULT_ROWS);
    },

    // ====================================================================
    // Simulation 5: Finding Median (boj-2696)
    // ====================================================================
    _renderVizMedianHeap: function(container) {
        var self = this, suffix = '-median';
        var DEFAULT_NUMS = '1, 5, 4, 3, 2';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Sequence: <input type="text" id="pq-median-input" value="' + DEFAULT_NUMS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="pq-median-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Comma-separated integers. The median is printed at every odd position.</p>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:4px;">Max Heap (smaller half)</div><div id="md-max' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div>' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:4px;">Min Heap (larger half)</div><div id="md-min' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;"></div></div></div>' +
            self._createStepDesc(suffix) +
            '<div id="md-val' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:700;padding:10px;background:linear-gradient(135deg,rgba(108,92,231,0.08),rgba(0,184,148,0.08));border:2px solid var(--primary);border-radius:12px;margin-bottom:12px;">Current Median: ?</div>' +
            '<div id="md-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var maxEl = container.querySelector('#md-max' + suffix);
        var minEl = container.querySelector('#md-min' + suffix);
        var valEl = container.querySelector('#md-val' + suffix);
        var infoEl = container.querySelector('#md-info' + suffix);
        function renderBubbles(el, arr, color) {
            if (arr.length === 0) { el.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Empty</span>'; return; }
            el.innerHTML = arr.map(function(v, i) { return '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:' + (i === 0 ? color : 'var(--bg2)') + ';color:' + (i === 0 ? '#fff' : 'var(--text)') + ';font-weight:700;border:2px solid ' + color + ';">' + v + '</span>'; }).join('');
        }
        function renderState(maxH, minH, med, msg) {
            var mxSorted = maxH.slice().sort(function(a, b) { return b - a; });
            var mnSorted = minH.slice().sort(function(a, b) { return a - b; });
            renderBubbles(maxEl, mxSorted, 'var(--primary)');
            renderBubbles(minEl, mnSorted, 'var(--green)');
            valEl.innerHTML = med !== null ? 'Current Median: <span style="color:var(--primary);font-size:1.4rem;">' + med + '</span>' : 'Current Median: ?';
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseNums(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(nums) {
            var maxH = [], minH = [], medians = [];
            var states = [{ mx: [], mn: [], med: null, msg: 'Insert numbers one by one. Max heap holds the smaller half, min heap holds the larger half \u2014 the median is always the max heap root.' }];
            nums.forEach(function(x, idx) {
                if (maxH.length === 0 || x <= Math.max.apply(null, maxH)) { maxH.push(x); } else { minH.push(x); }
                if (maxH.length > minH.length + 1) { var mv = Math.max.apply(null, maxH); maxH.splice(maxH.indexOf(mv), 1); minH.push(mv); }
                else if (minH.length > maxH.length) { var mv2 = Math.min.apply(null, minH); minH.splice(minH.indexOf(mv2), 1); maxH.push(mv2); }
                var med = Math.max.apply(null, maxH);
                var isOdd = (idx + 1) % 2 === 1;
                if (isOdd) medians.push(med);
                states.push({ mx: maxH.slice(), mn: minH.slice(), med: med, msg: 'Inserted ' + x + '. ' + (isOdd ? 'Odd position \u2192 Median = ' + med + ' (max heap root is always the middle value)' : 'Even position \u2014 no median output yet') });
            });
            states.push({ mx: maxH.slice(), mn: minH.slice(), med: Math.max.apply(null, maxH), msg: '<strong style="color:var(--green);">\u2705 Done! Medians output: ' + medians.join(', ') + '</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderState(cur.mx, cur.mn, cur.med, cur.msg); }, undo: function() { renderState(prev.mx, prev.mn, prev.med, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(numsStr) {
            var nums = parseNums(numsStr);
            if (nums.length === 0) return;
            var result = buildSteps(nums);
            renderState(result.initial.mx, result.initial.mn, result.initial.med, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-median-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-median-input').value);
        });
        runSim(DEFAULT_NUMS);
    },

    // ====================================================================
    // Simulation 6: Jewel Thief (boj-1202)
    // ====================================================================
    _renderVizJewelThief: function(container) {
        var self = this, suffix = '-jewel';
        var DEFAULT_JEWELS = '1 65, 5 23, 2 99';
        var DEFAULT_BAGS = '10, 2';
        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Jewels (weight price): <input type="text" id="pq-jewel-jewels" value="' + DEFAULT_JEWELS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<label style="font-weight:600;">Bag capacity: <input type="text" id="pq-jewel-bags" value="' + DEFAULT_BAGS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:120px;"></label>' +
            '<button class="btn btn-primary" id="pq-jewel-reset">\uD83D\uDD04</button></div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">Jewels: "weight price" pairs, comma separated. Bags: capacities, comma separated.</p>' +
            self._createStepDesc(suffix) +
            '<div id="jw-heap' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="jw-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var heapEl = container.querySelector('#jw-heap' + suffix);
        var infoEl = container.querySelector('#jw-info' + suffix);
        function renderH(h, msg) {
            heapEl.innerHTML = h.length === 0 ? '<span style="color:var(--text3);">Heap Empty</span>' :
                h.map(function(v) { return '<div style="padding:6px 12px;border-radius:8px;background:var(--accent)15;border:2px solid var(--accent);font-weight:600;">Price:' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        function parseJewels(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1]) ? [parts[0], parts[1]] : null;
            }).filter(function(j) { return j !== null; });
        }
        function parseBags(str) {
            return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        }
        function buildSteps(jewels, bags) {
            var sortedJ = jewels.slice().sort(function(a, b) { return a[0] - b[0]; });
            var sortedB = bags.slice().sort(function(a, b) { return a - b; });
            var states = [{ h: [], msg: 'Jewels: sorted by weight ' + sortedJ.map(function(j) { return '(' + j[0] + ',' + j[1] + ')'; }).join(', ') + '. Bags: sorted by capacity [' + sortedB.join(', ') + ']' }];
            var heap2 = [], j2 = 0, answer = 0;
            sortedB.forEach(function(bag) {
                while (j2 < sortedJ.length && sortedJ[j2][0] <= bag) {
                    heap2.push(sortedJ[j2][1]); heap2.sort(function(a, b) { return b - a; });
                    states.push({ h: heap2.slice(), msg: 'Bag capacity ' + bag + ': jewel(weight ' + sortedJ[j2][0] + ', price ' + sortedJ[j2][1] + ') fits \u2014 add price to max heap as a candidate. Heap: [' + heap2.join(', ') + ']' });
                    j2++;
                }
                if (heap2.length > 0) {
                    var picked = heap2.shift();
                    answer += picked;
                    states.push({ h: heap2.slice(), msg: 'Bag capacity ' + bag + ': greedily pick the most expensive jewel (' + picked + ') from the heap \u2014 maximizes total value. Running total: ' + answer });
                } else {
                    states.push({ h: heap2.slice(), msg: 'Bag capacity ' + bag + ': no jewels light enough to fit in this bag' });
                }
            });
            states.push({ h: [], msg: '<strong style="color:var(--green);">\u2705 Maximum total price = ' + answer + '</strong>' });
            var steps = [];
            for (var i = 1; i < states.length; i++) {
                (function(cur, prev) {
                    steps.push({ description: cur.msg.replace(/<[^>]+>/g, ''), action: function() { renderH(cur.h, cur.msg); }, undo: function() { renderH(prev.h, prev.msg); } });
                })(states[i], states[i - 1]);
            }
            return { steps: steps, initial: states[0] };
        }
        function runSim(jewelsStr, bagsStr) {
            var jewels = parseJewels(jewelsStr);
            var bags = parseBags(bagsStr);
            if (jewels.length === 0 || bags.length === 0) return;
            var result = buildSteps(jewels, bags);
            renderH(result.initial.h, result.initial.msg);
            self._initStepController(container, result.steps, suffix);
        }
        container.querySelector('#pq-jewel-reset').addEventListener('click', function() {
            self._clearVizState();
            runSim(container.querySelector('#pq-jewel-jewels').value, container.querySelector('#pq-jewel-bags').value);
        });
        runSim(DEFAULT_JEWELS, DEFAULT_BAGS);
    },

    // ===== Visualization Tab =====
    renderVisualize: function(container) {
        this._clearVizState();
        var self = this;
        var suffix = 'concept-pq';
        container.innerHTML =
            '<div class="viz-tabs">' +
            '<button class="viz-tab active" data-viz="minheap">Min Heap Insert/Delete</button>' +
            '<button class="viz-tab" data-viz="median">Median with Two Heaps</button>' +
            '</div>' +
            '<div id="pq-viz-content-' + suffix + '"></div>';
        var vizContent = container.querySelector('#pq-viz-content-' + suffix);
        var tabs = container.querySelectorAll('.viz-tab');
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                self._clearVizState();
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                if (tab.dataset.viz === 'minheap') self._renderVizConceptMinHeap(vizContent, suffix);
                else self._renderVizConceptMedian(vizContent, suffix);
            });
        });
        self._renderVizConceptMinHeap(vizContent, suffix);
    },

    renderProblem: function(container) {},

    _renderVizConceptMinHeap: function(container, suffix) {
        var self = this;
        var heap = [null, 3, 5, 7, 9, 8];
        var INITIAL = [null, 3, 5, 7, 9, 8];
        container.innerHTML =
            '<div class="viz-card"><h3>Min Heap Insert/Delete</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Insert numbers or delete the minimum to observe how the heap works.</p>' +
            '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">' +
            '<label>Value: <input type="number" id="pq-insert-val-' + suffix + '" value="2" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>' +
            '<button class="btn btn-primary" id="pq-insert-btn-' + suffix + '">Insert</button>' +
            '<button class="btn" id="pq-delete-btn-' + suffix + '" style="background:var(--red);color:#fff;">Delete (min)</button>' +
            '<button class="btn" id="pq-reset-btn-' + suffix + '">Reset</button></div>' +
            '<div id="pq-arr-' + suffix + '" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:8px;min-height:48px;"></div>' +
            '<div id="pq-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;font-weight:600;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var arrEl = container.querySelector('#pq-arr-' + suffix);
        var infoEl = container.querySelector('#pq-info-' + suffix);
        function renderAll(h, msg) {
            arrEl.innerHTML = h.length <= 1 ? '<span style="color:var(--text3);">Empty</span>' :
                h.slice(1).map(function(v, i) { return '<div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--green);color:white;font-weight:700;">' + v + '</div>'; }).join('');
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        renderAll(heap, 'Heap: [' + heap.slice(1).join(', ') + '] \u2014 Click Insert or Delete to begin.');
        container.querySelector('#pq-insert-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            var val = parseInt(container.querySelector('#pq-insert-val-' + suffix).value);
            if (isNaN(val)) return;
            var h = heap.slice(); h.push(val);
            var swaps = [], idx = h.length - 1;
            while (idx > 1) { var p = Math.floor(idx / 2); if (h[idx] < h[p]) { swaps.push({ ci: idx, pi: p, cv: h[idx], pv: h[p] }); var t = h[idx]; h[idx] = h[p]; h[p] = t; idx = p; } else break; }
            var steps = [], afterAdd = heap.slice(); afterAdd.push(val);
            steps.push({ description: 'Append ' + val + ' to end of array \u2014 heaps are complete binary trees, so we always insert at the last position', action: function() { renderAll(afterAdd, val + ' added! Now compare with parent to maintain heap property.'); }, undo: function() { renderAll(heap, 'Before insert'); } });
            var sim = afterAdd.slice(), ci = afterAdd.length - 1;
            swaps.forEach(function(sw) { var pi = Math.floor(ci / 2); var cv = sim[ci], pv = sim[pi]; var t2 = sim[ci]; sim[ci] = sim[pi]; sim[pi] = t2; var after = sim.slice(); var next = pi;
                steps.push({ description: cv + ' < ' + pv + ' \u2192 swap! In a min heap, the parent must be smaller than its children, so we sift up', action: function() { renderAll(after, cv + ' < ' + pv + ' \u2192 heap property violated! Swap to move the smaller value up.'); }, undo: function() { renderAll(afterAdd, 'Before swap'); } }); ci = next; });
            var fin = sim.slice();
            steps.push({ description: 'Insert complete! Parent \u2264 child condition is now satisfied \u2014 heap property restored', action: function() { heap = fin.slice(); renderAll(heap, '\u2705 Insert complete! Heap: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim, 'Before completion'); } });
            self._initStepController(container, steps, suffix);
        });
        container.querySelector('#pq-delete-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            if (heap.length <= 1) { infoEl.innerHTML = '\u274C Heap is empty!'; return; }
            var rootVal = heap[1], lastVal = heap[heap.length - 1], orig = heap.slice();
            var h2 = heap.slice(); h2[1] = h2[h2.length - 1]; h2.pop();
            var swaps2 = [], idx2 = 1, hc = h2.slice();
            while (idx2 * 2 < hc.length) { var c = idx2 * 2; if (c + 1 < hc.length && hc[c + 1] < hc[c]) c++; if (hc[idx2] > hc[c]) { swaps2.push({ pi: idx2, ci: c }); var t3 = hc[idx2]; hc[idx2] = hc[c]; hc[c] = t3; idx2 = c; } else break; }
            var steps2 = [];
            steps2.push({ description: 'Remove root(' + rootVal + ') \u2014 in a min heap the root is always the minimum, so we can access it in O(1)', action: function() { renderAll(orig, 'Removing ' + rootVal + '! The root is always the minimum in a min heap.'); }, undo: function() { renderAll(orig, 'Before delete'); } });
            var afterMove = orig.slice(); afterMove[1] = afterMove[afterMove.length - 1]; afterMove.pop();
            steps2.push({ description: 'Move ' + lastVal + ' to root \u2014 to keep the complete binary tree shape, move the last element to the root position', action: function() { renderAll(afterMove, lastVal + ' moved to root! Now compare with children to restore heap property.'); }, undo: function() { renderAll(orig, 'Removing ' + rootVal + '!'); } });
            var sim2 = afterMove.slice(), ci2 = 1;
            swaps2.forEach(function() { var c2 = ci2 * 2; if (c2 + 1 < sim2.length && sim2[c2 + 1] < sim2[c2]) c2++; var pv2 = sim2[ci2], cv2 = sim2[c2]; var t4 = sim2[ci2]; sim2[ci2] = sim2[c2]; sim2[c2] = t4; var af = sim2.slice();
                steps2.push({ description: pv2 + ' > ' + cv2 + ' \u2192 swap! Parent is larger than child, violating min heap property \u2014 sift down by swapping with the smaller child', action: function() { renderAll(af, pv2 + ' > ' + cv2 + ' \u2192 heap property violated! Swap with the smaller child.'); }, undo: function() { renderAll(afterMove, 'Before swap'); } }); ci2 = c2; });
            var fin2 = sim2.slice();
            steps2.push({ description: 'Delete complete! Popped minimum: ' + rootVal + ' \u2014 sift-down restored the heap property', action: function() { heap = fin2.slice(); renderAll(heap, '\u2705 Delete complete! Popped: ' + rootVal + '. Heap: [' + heap.slice(1).join(', ') + ']'); }, undo: function() { renderAll(sim2, 'Before completion'); } });
            self._initStepController(container, steps2, suffix);
        });
        container.querySelector('#pq-reset-btn-' + suffix).addEventListener('click', function() {
            self._clearVizState(); heap = INITIAL.slice();
            renderAll(heap, 'Heap: [' + heap.slice(1).join(', ') + '] \u2014 Reset to initial state.');
        });
    },

    _renderVizConceptMedian: function(container, suffix) {
        var self = this;
        container.innerHTML =
            '<div class="viz-card"><h3>Finding Median with Two Heaps</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Insert numbers one by one and find the median in real time.</p>' +
            '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">' +
            '<label>Input Sequence: <input type="text" id="pq-median-input-' + suffix + '" value="1 5 2 8 3 6 4 7" style="width:220px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;"></label>' +
            '<button class="btn btn-primary" id="pq-median-start-' + suffix + '">Start</button></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(108,92,231,0.1);color:var(--primary);margin-bottom:4px;">Max Heap (smaller half)</div>' +
            '<div id="cm-max-' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;"></div></div>' +
            '<div><div style="text-align:center;font-weight:700;padding:6px;border-radius:8px;background:rgba(0,184,148,0.1);color:var(--green);margin-bottom:4px;">Min Heap (larger half)</div>' +
            '<div id="cm-min-' + suffix + '" style="min-height:48px;padding:8px;background:var(--bg);border-radius:8px;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;"></div></div></div>' +
            '<div id="cm-val-' + suffix + '" style="text-align:center;font-size:1.2rem;font-weight:700;padding:10px;border:2px solid var(--primary);border-radius:12px;margin-bottom:12px;">Current Median: ?</div>' +
            '<div id="cm-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepDesc(suffix) + self._createStepControls(suffix) + '</div>';
        var maxEl = container.querySelector('#cm-max-' + suffix);
        var minEl = container.querySelector('#cm-min-' + suffix);
        var valEl = container.querySelector('#cm-val-' + suffix);
        var infoEl = container.querySelector('#cm-info-' + suffix);
        function renderBubbles(el, arr, color) {
            if (arr.length === 0) { el.innerHTML = '<span style="color:var(--text3);">Empty</span>'; return; }
            el.innerHTML = arr.map(function(v, i) { return '<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:' + (i === 0 ? color : 'var(--bg2)') + ';color:' + (i === 0 ? '#fff' : 'var(--text)') + ';font-weight:700;border:2px solid ' + color + ';">' + v + '</span>'; }).join('');
        }
        function renderState(mxH, mnH, med, msg) {
            renderBubbles(maxEl, mxH.slice().sort(function(a, b) { return b - a; }), 'var(--primary)');
            renderBubbles(minEl, mnH.slice().sort(function(a, b) { return a - b; }), 'var(--green)');
            valEl.innerHTML = med !== null ? 'Current Median: <span style="color:var(--primary);font-size:1.4rem;">' + med + '</span>' : 'Current Median: ?';
            if (msg !== undefined) infoEl.innerHTML = msg;
        }
        renderState([], [], null, 'Enter a sequence and click Start.');
        container.querySelector('#pq-median-start-' + suffix).addEventListener('click', function() {
            self._clearVizState();
            var input = container.querySelector('#pq-median-input-' + suffix).value.trim();
            var nums = input.split(/[\s,]+/).map(Number).filter(function(n) { return !isNaN(n); });
            if (nums.length === 0) return;
            var mxH = [], mnH = [], allSteps = [];
            nums.forEach(function(val) {
                if (mxH.length === 0 || val <= Math.max.apply(null, mxH)) { mxH.push(val); allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: 'Insert ' + val + ' into max heap \u2014 it belongs in the smaller half because ' + (mxH.length === 1 ? 'the heap is empty' : val + ' \u2264 max heap root') }); }
                else { mnH.push(val); allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: 'Insert ' + val + ' into min heap \u2014 it belongs in the larger half because ' + val + ' > max heap root' }); }
                if (mxH.length > mnH.length + 1) { var mv = Math.max.apply(null, mxH); mxH.splice(mxH.indexOf(mv), 1); mnH.push(mv);
                    allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: 'Move ' + mv + ' from max heap \u2192 min heap \u2014 rebalancing so the two heaps stay equal in size' }); }
                else if (mnH.length > mxH.length) { var mv2 = Math.min.apply(null, mnH); mnH.splice(mnH.indexOf(mv2), 1); mxH.push(mv2);
                    allSteps.push({ mx: mxH.slice(), mn: mnH.slice(), med: null, desc: 'Move ' + mv2 + ' from min heap \u2192 max heap \u2014 rebalancing so max heap has \u2265 min heap elements' }); }
                var med = Math.max.apply(null, mxH);
                allSteps[allSteps.length - 1].med = med;
                allSteps[allSteps.length - 1].desc += ' \u2192 Median = ' + med;
            });
            var steps = [];
            for (var i = 0; i < allSteps.length; i++) {
                var st = allSteps[i], prev = i > 0 ? allSteps[i - 1] : { mx: [], mn: [], med: null, desc: '' };
                (function(st2, prev2) {
                    steps.push({ description: st2.desc, action: function() { renderState(st2.mx, st2.mn, st2.med, st2.desc); }, undo: function() { renderState(prev2.mx, prev2.mn, prev2.med, prev2.desc || 'Enter a sequence and press Start.'); } });
                })(st, prev);
            }
            var finalMed = Math.max.apply(null, mxH);
            steps.push({ description: '\u2705 Done! Final median: ' + finalMed,
                action: function() { var ls = allSteps[allSteps.length - 1]; renderState(ls.mx, ls.mn, finalMed, '\u2705 All numbers inserted! Final median: ' + finalMed); },
                undo: function() { var ls = allSteps[allSteps.length - 1]; renderState(ls.mx, ls.mn, ls.med, ls.desc); }
            });
            self._initStepController(container, steps, suffix);
        });
    },

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Basic Heap Operations', desc: 'Max / Min / Absolute Value Heap (Silver II)', problemIds: ['boj-11279', 'boj-1927', 'boj-11286'] },
        { num: 2, title: 'Heap Applications', desc: 'Size-limited Heap, Two Heaps (Gold)', problemIds: ['boj-2075', 'boj-2696'] },
        { num: 3, title: 'Greedy + Heap', desc: 'Sorting + Heap for Optimal Solution (Gold II)', problemIds: ['boj-1202'] }
    ],

    // ===== Problem List =====
    problems: [
        {
            id: 'boj-11279', title: 'BOJ 11279 - Max Heap', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11279',
            simIntro: 'Observe how insertion and deletion work in a max heap.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There is a well-known data structure called a max heap. Write a program that supports the following operations using a max heap.</p>
                <p>Insert a natural number x into the array. Print the largest value in the array and remove it.</p>
                <p>The program starts with an empty array.</p>
                <p>If x is a natural number, insert x into the array. If x is 0, print the largest value in the array and remove it. If the array is empty when asked to print the largest value, print 0.</p>
                <h4>Input</h4>
                <p>The first line contains the number of operations N (1 &le; N &le; 100,000). Each of the next N lines contains an integer x representing an operation. If x is a natural number, it means inserting x into the array; if x is 0, it means printing and removing the largest value. x is a natural number less than 2<sup>31</sup> or 0, and negative integers are not given as input.</p>
                <h4>Output</h4>
                <p>Print the answer once for each time 0 is given in the input, one per line. If the array is empty when asked to print the largest value, print 0.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>13
1
2
0
0
3
2
1
0
0
0
0
0
0</pre></div>
                    <div><strong>Output</strong><pre>2
1
3
2
1
0
0</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>x is a natural number or 0</li>
                    <li>x ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need to "print the largest value"... we could put numbers into an array, and every time 0 appears, <strong>search the entire array for the maximum</strong>, right?<br><br>Just find it with <code>max()</code> each time and remove it!' },
                { title: 'But there\'s a problem with this', content: 'Finding the max in an array = <strong>O(N)</strong>, removing it is also <strong>O(N)</strong>.<br>With up to 100,000 operations, doing O(N) each time means <strong>100K x 100K = 10 billion operations</strong>... TLE!<br><br><div style="display:flex;align-items:flex-end;gap:18px;justify-content:center;margin:12px 0 8px;"><div style="text-align:center;"><div style="width:48px;height:120px;background:var(--red);border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;color:#fff;font-weight:700;font-size:0.8em;">10<sup>10</sup></div><div style="font-size:0.78em;color:var(--text2);margin-top:4px;">Array<br>O(N) &times; N</div></div><div style="text-align:center;"><div style="width:48px;height:30px;background:var(--green);border-radius:6px 6px 0 0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;color:#fff;font-weight:700;font-size:0.8em;">10<sup>5</sup></div><div style="font-size:0.78em;color:var(--text2);margin-top:4px;">Heap<br>O(log N) &times; N</div></div></div>Insertion is fast, but <strong>scanning everything on each extraction is the bottleneck</strong>.' },
                { title: 'What if we try this?', content: 'Using a <strong>Heap</strong>, both insertion and extracting the max are O(log N)!<br>A heap is a special tree structure where "the max (or min) is always at the top."<br><br>But there is one thing to note:<br><span class="lang-py">Python\'s <code>heapq</code> only supports <strong>min heaps</strong>. We need a max heap, so what do we do?<br>Multiply by <strong>-1</strong> before inserting! The smallest negative number = the originally largest number!</span><span class="lang-cpp">C++\'s <code>priority_queue&lt;int&gt;</code> is a <strong>max heap by default</strong>, so just use it directly! Even simpler than Python.</span>' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py">Insert with <code>heapq.heappush(heap, <strong>-x</strong>)</code>, and when extracting, restore the sign with <code><strong>-</strong>heapq.heappop(heap)</code>!<br>Both insert/delete are <strong>O(log N)</strong>, so the total is <strong>O(N log N)</strong> and passes easily.</span><span class="lang-cpp">Insert with <code>pq.push(x)</code>, check the max with <code>pq.top()</code>, and remove with <code>pq.pop()</code>!<br>Both insert/delete are <strong>O(log N)</strong>, so the total is <strong>O(N log N)</strong> and passes easily.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)\n    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Max Heap (multiply by -1)',
                description: 'Insert -x into heapq and multiply by -1 when extracting.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and Initialization', desc: 'Since heapq is a min heap, inserting with -1 multiplied makes it behave like a max heap.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: 'Process Operations', desc: 'If x > 0, push -x to achieve the max heap effect.', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, -x)' },
                        { title: 'Output', desc: 'Multiply the extracted value by -1 again to restore the original value.', code: '    else:\n        if heap:\n            print(-heapq.heappop(heap))\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: 'Input and Initialization', desc: 'C++ priority_queue is a max heap by default, so no need to multiply by -1.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    priority_queue<int> pq;  // default: max heap' },
                        { title: 'Process Operations', desc: 'If x > 0, push directly. No conversion needed since it is a max heap by default.', code: '    while (n--) {\n        cin >> x;\n        if (x > 0) {\n            pq.push(x);\n        }' },
                        { title: 'Output', desc: 'Check the max with top() and remove with pop().', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1927', title: 'BOJ 1927 - Min Heap', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1927',
            simIntro: 'Observe how insertion and deletion work in a min heap.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>There is a well-known data structure called a min heap. Write a program that supports the following operations using a min heap.</p>
                <p>Insert a natural number x into the array. Print the smallest value in the array and remove it.</p>
                <p>If x is a natural number, insert x into the array. If x is 0, print the smallest value and remove it. If the array is empty, print 0.</p>
                <h4>Input</h4>
                <p>The first line contains the number of operations N (1 &le; N &le; 100,000). Each of the next N lines contains an integer x representing an operation. If x is a natural number, it means inserting x into the array; if x is 0, it means printing and removing the smallest value. x is a natural number less than 2<sup>31</sup> or 0, and negative integers are not given as input.</p>
                <h4>Output</h4>
                <p>Print the answer once for each time 0 is given in the input, one per line. If the array is empty when asked to print the smallest value, print 0.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>9
0
12345678
1
2
0
0
0
0
32</pre></div>
                    <div><strong>Output</strong><pre>0
1
2
12345678
0</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ x ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need to "print the smallest value"... we could put numbers in an array, and when 0 appears, <strong>sort the array and take the first element</strong>, right?<br><br>Or find the minimum with <code>min()</code> each time and remove it!' },
                { title: 'But there\'s a problem with this', content: 'Sorting each time is <strong>O(N log N)</strong>, and finding min() is <strong>O(N)</strong>.<br>With up to 100,000 operations, the worst case is <strong>100K x 100K = 10 billion operations</strong>... way too slow!<br><br>This is the same situation as the max heap problem. <strong>Scanning everything each time</strong> is the issue.' },
                { title: 'What if we try this?', content: 'Using a <strong>min heap</strong>, insertion is O(log N) and extracting the minimum is O(log N)!<br>A heap always has "the min (or max) at the top," so you can extract it immediately without scanning everything.<br><br>The max heap problem required the -1 multiplication trick, but <strong>for a min heap, just insert directly!</strong>' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py"><code>heapq</code> is a <strong>min heap by default</strong>, so with no tricks at all, just use <code>heappush(heap, x)</code> to insert and <code>heappop(heap)</code> to extract!<br>Even simpler than the max heap. Total <strong>O(N log N)</strong>.</span><span class="lang-cpp">C++ <code>priority_queue</code> is a max heap by default, so you need to change it to a min heap.<br>Use <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code> with <strong>greater&lt;int&gt;</strong> to make it a min heap!<br>After that, use <code>pq.push(x)</code>, <code>pq.top()</code>, <code>pq.pop()</code> as usual. Total <strong>O(N log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)\n    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    while (n--) {\n        cin >> x;\n        if (x > 0) pq.push(x);\n        else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Min Heap (heapq default)',
                description: 'Use heapq as-is without any tricks.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and Initialization', desc: 'heapq is a min heap by default, so just use it directly.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: 'Process Operations', desc: 'If x is a natural number, insert into the min heap with heappush.', code: 'for _ in range(n):\n    x = int(input())\n    if x > 0:\n        heapq.heappush(heap, x)' },
                        { title: 'Output', desc: 'heappop always extracts the smallest value. Print 0 if empty.', code: '    else:\n        if heap:\n            print(heapq.heappop(heap))\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: 'Input and Initialization', desc: 'Adding greater<int> makes it a min heap.\nSame behavior as Python heapq.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    // greater<int> -> min heap (same as Python heapq default)\n    priority_queue<int, vector<int>, greater<int>> pq;' },
                        { title: 'Process Operations', desc: 'If x > 0, push. Thanks to greater<int>, the smallest value is automatically at top.', code: '    while (n--) {\n        cin >> x;\n        if (x > 0) {\n            pq.push(x);\n        }' },
                        { title: 'Output', desc: 'top() is the smallest value. Remove with pop() and print.', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-11286', title: 'BOJ 11286 - Absolute Value Heap', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11286',
            simIntro: 'Observe how the (abs(x), x) tuple is sorted in an absolute value heap.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>An absolute value heap is a data structure that supports the following operations.</p>
                <p>Insert an integer x (x != 0) into the array. Print the value with the smallest absolute value and remove it from the array. If there are multiple values with the smallest absolute value, print the smallest one among them and remove it.</p>
                <p>If x is not 0, insert x into the array. If x is 0, print and remove the value with the smallest absolute value.</p>
                <h4>Input</h4>
                <p>The first line contains the number of operations N (1 &le; N &le; 100,000). Each of the next N lines contains an integer x representing an operation. If x is not 0, it means inserting x into the array; if x is 0, it means printing and removing the value with the smallest absolute value. The input integers are greater than -2<sup>31</sup> and less than 2<sup>31</sup>.</p>
                <h4>Output</h4>
                <p>Print the answer once for each time 0 is given in the input, one per line. If the array is empty when asked to print the value with the smallest absolute value, print 0.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>18
1
-1
0
0
0
1
1
-1
-1
2
-2
0
0
0
0
0
0
0</pre></div>
                    <div><strong>Output</strong><pre>-1
1
0
-1
-1
1
1
-2
2
0</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>-2<sup>31</sup> < x < 2<sup>31</sup></li>
                    <li>x != 0 (0 in input means a print/remove command)</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need to "extract the value with the smallest absolute value"... we could put numbers into an array, and when 0 appears, <strong>compare all absolute values</strong> to find the smallest one, right?<br><br>If there are ties in absolute value, just pick the smallest actual value!' },
                { title: 'But there\'s a problem with this', content: 'Scanning the entire array each time is <strong>O(N)</strong>. With up to 100,000 operations, TLE again!<br><br>A heap seems like it could work, but the problem is it needs to sort by <strong>"absolute value"</strong>.<br>A regular min heap sorts by actual value, so it would extract -1 before 1. But both have absolute value 1, so we need tie-breaking!' },
                { title: 'What if we try this?', content: 'Instead of inserting just the number, insert it as a <strong>(absolute value, actual value)</strong> pair!<br><br><div style="margin:10px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="margin-bottom:6px;font-weight:600;color:var(--text);">Input → Tuple conversion:</div><div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;"><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>1</code> → <code>(1, 1)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>-1</code> → <code>(1, -1)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>3</code> → <code>(3, 3)</code></div><div style="padding:4px 10px;background:var(--bg);border:1px solid var(--bg3);border-radius:6px;"><code>-3</code> → <code>(3, -3)</code></div></div><div style="margin-top:8px;font-weight:600;color:var(--text);">Heap order (top → bottom):</div><div style="display:flex;gap:6px;margin-top:4px;justify-content:center;"><div style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:600;">(1,-1)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(1, 1)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(3,-3)</div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;">(3, 3)</div></div></div>The heap sorts by the first value (absolute value) first, and if equal, by the second value (actual value), so <strong>when absolute values are equal, negatives come first</strong>! Exactly the behavior the problem wants.' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py">Insert a tuple with <code>heapq.heappush(heap, (abs(x), x))</code>, and when extracting, get just the original value with <code>heappop(heap)[1]</code>!<br>Python tuple comparison automatically sorts by (absolute value, then actual value), making the code very clean.</span><span class="lang-cpp">In C++, you need to create a <strong>custom comparison struct</strong>:<br><code>struct cmp { bool operator()(int a, int b) { if(abs(a)==abs(b)) return a&gt;b; return abs(a)&gt;abs(b); } };</code><br>This lets you create an absolute-value-based min heap with <code>priority_queue&lt;int, vector&lt;int&gt;, cmp&gt;</code>!<br>Since C++ does not have automatic tuple comparison like Python, you define the comparator yourself.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))\n    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)',
                cpp: '#include <iostream>\n#include <queue>\n#include <cstdlib>\nusing namespace std;\nstruct cmp { bool operator()(int a, int b) { if (abs(a)==abs(b)) return a>b; return abs(a)>abs(b); } };\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, cmp> pq;\n    while (n--) { cin >> x; if (x!=0) pq.push(x); else { if (!pq.empty()) { cout << pq.top() << "\\n"; pq.pop(); } else cout << 0 << "\\n"; } }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Tuple (abs(x), x)',
                description: 'Bundle the absolute value and actual value as a tuple and insert into the heap.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and Initialization', desc: 'Insert (|x|, x) tuples into the heap to implement absolute-value-based sorting.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: 'Process Operations', desc: 'Tuple comparison: sort by first value (absolute value), then by second value (original value) if tied.', code: 'for _ in range(n):\n    x = int(input())\n    if x != 0:\n        heapq.heappush(heap, (abs(x), x))' },
                        { title: 'Output', desc: 'Use heappop()[1] to extract only the original value from the tuple.', code: '    else:\n        if heap:\n            print(heapq.heappop(heap)[1])\n        else:\n            print(0)' }
                    ],
                    cpp: [
                        { title: 'Input and Initialization', desc: 'Implement absolute-value-based min heap with a custom comparator.\nIf absolute values are equal, prioritize the smaller actual value.', code: '#include <iostream>\n#include <queue>\n#include <cstdlib>\nusing namespace std;\n\n// Custom compare: if |a|==|b|, prioritize smaller actual value\nstruct cmp {\n    bool operator()(int a, int b) {\n        if (abs(a) == abs(b)) return a > b;\n        return abs(a) > abs(b);\n    }\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    priority_queue<int, vector<int>, cmp> pq;' },
                        { title: 'Process Operations', desc: 'Thanks to the cmp struct, just push and it automatically sorts by absolute value.', code: '    while (n--) {\n        cin >> x;\n        if (x != 0) {\n            pq.push(x);\n        }' },
                        { title: 'Output', desc: 'top() is the value with the smallest absolute value. Same result as the Python tuple approach.', code: '        else {\n            if (!pq.empty()) {\n                cout << pq.top() << \'\\n\';\n                pq.pop();\n            } else {\n                cout << 0 << \'\\n\';\n            }\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2075', title: 'BOJ 2075 - Nth Largest Number', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2075',
            simIntro: 'Observe the process of finding the Nth largest number while maintaining a min heap of size N.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>An N x N table is filled with N<sup>2</sup> numbers. The numbers have one property: every number is greater than the number directly above it. Find the Nth largest number.</p>
                <p>The memory limit is 12MB.</p>
                <h4>Input</h4>
                <p>The first line contains N (1 &le; N &le; 1,500). Each of the next N lines contains N numbers. The numbers in the table are integers between -1,000,000,000 and 1,000,000,000.</p>
                <h4>Output</h4>
                <p>Print the Nth largest number on the first line.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5
12 22 31 36 44
11 26 27 28 45
16 25 33 34 46
15 29 30 35 47
14 24 32 39 48</pre></div>
                    <div><strong>Output</strong><pre>35</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,500</li>
                    <li>All numbers in the table are between -1,000,000,000 and 1,000,000,000</li>
                    <li>Memory limit: 12MB</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'To find the Nth largest number... we could <strong>put all N\u00B2 numbers into an array and sort</strong> to get the Nth one, right?<br><br>If N is 1,500, there are 1,500 x 1,500 = <strong>2.25 million numbers</strong>. Sorting should give us the answer!' },
                { title: 'But there\'s a problem with this', content: 'Look at the problem again... <strong>the memory limit is 12MB</strong>!<br>2.25 million ints = about 9MB, which is tight for just the array, and sorting needs additional memory that could exceed the limit.<br><br>The key question is: "Can we find the Nth largest number <strong>without storing all 2.25 million</strong>?"' },
                { title: 'What if we try this?', content: 'Think about it: we only need to <strong>remember the top N numbers</strong>!<br><br>Maintain a <strong>min heap of size N</strong>:<br>1. If heap size < N, just insert<br>2. If heap size is N, only replace when the new value is <strong>greater than</strong> the heap root (minimum)<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;text-align:center;font-size:0.88em;"><div style="font-weight:600;margin-bottom:8px;">Size-3 min heap process (N=3)</div><div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;"><div><div style="color:var(--text2);font-size:0.8em;">Input: 5,2,8</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">2</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span></div></div><div style="display:flex;align-items:center;font-size:1.2em;color:var(--text2);">→</div><div><div style="color:var(--text2);font-size:0.8em;">Input: 9 (9 &gt; 2, replace!)</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">9</span></div></div><div style="display:flex;align-items:center;font-size:1.2em;color:var(--text2);">→</div><div><div style="color:var(--text2);font-size:0.8em;">Input: 1 (1 &lt; 5, skip)</div><div style="display:flex;gap:4px;margin-top:4px;justify-content:center;"><span style="padding:3px 8px;background:var(--green);color:#fff;border-radius:4px;font-weight:600;">5</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">8</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">9</span></div></div></div><div style="margin-top:6px;color:var(--green);font-weight:600;">Root (5) = 3rd largest!</div></div>This way, the heap always contains "the N largest numbers seen so far." After reading everything, <strong>the heap root (minimum) = the Nth largest number</strong>!<br>Since we only store N elements, 12MB is more than enough.' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py">If heap size &lt; N, use <code>heappush</code>. Otherwise, only replace when the new value &gt; <code>heap[0]</code> (root) using <code>heapreplace(heap, x)</code>!<br><code>heapreplace</code> efficiently does pop+push in one call.<br>At the end, <code>heap[0]</code> is the answer. Total <strong>O(N\u00B2 log N)</strong>.</span><span class="lang-cpp">Create a min heap with <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code>.<br>If heap size &lt; N, use <code>pq.push(x)</code>. Otherwise, if <code>x &gt; pq.top()</code>, replace with <code>pq.pop(); pq.push(x);</code>!<br>At the end, <code>pq.top()</code> is the answer. Total <strong>O(N\u00B2 log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []\nfor _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)\nprint(heap[0])',
                cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int n, x; cin >> n;\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int i = 0; i < n*n; i++) { cin >> x; if ((int)pq.size()<n) pq.push(x); else if (x>pq.top()) { pq.pop(); pq.push(x); } }\n    cout << pq.top() << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Size-limited Min Heap',
                description: 'Maintain heap size at N to find the Nth largest number.',
                timeComplexity: 'O(N\u00B2 log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Limit heap size to N to stay within the 12MB memory constraint.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nn = int(input())\nheap = []' },
                        { title: 'Maintain Heap', desc: 'If heap size < N, push. Otherwise, replace with heapreplace only when new value > root.', code: 'for _ in range(n):\n    row = list(map(int, input().split()))\n    for x in row:\n        if len(heap) < n:\n            heapq.heappush(heap, x)\n        elif x > heap[0]:\n            heapq.heapreplace(heap, x)' },
                        { title: 'Output', desc: 'The root of the size-N min heap is the Nth largest number.', code: 'print(heap[0])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Maintain size N with a min heap.\nStoring all N\u00B2 elements would exceed the 12MB memory limit!', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, x;\n    cin >> n;\n    // Min heap: maintaining size N means root = Nth largest\n    priority_queue<int, vector<int>, greater<int>> pq;' },
                        { title: 'Maintain Heap', desc: 'If heap size < N, just push.\nOnly pop then push when new value > heap root (equivalent to heapreplace).', code: '    for (int i = 0; i < n * n; i++) {\n        cin >> x;\n        if ((int)pq.size() < n) {\n            pq.push(x);\n        } else if (x > pq.top()) {\n            pq.pop();   // remove smallest value\n            pq.push(x); // replace with larger value\n        }\n    }' },
                        { title: 'Output', desc: 'top() is the Nth largest number. Same role as heap[0] in Python.', code: '    cout << pq.top() << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2696', title: 'BOJ 2696 - Finding the Median', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2696',
            simIntro: 'Observe the process of computing the median in real time using a max heap + min heap.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Read a sequence of numbers, and every time an odd-numbered element is read, print the median of all values read so far.</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases T. For each test case, the first line contains the sequence size M, and the following lines contain the elements of the sequence with up to 10 per line. M is an odd number at most 9999.</p>
                <h4>Output</h4>
                <p>For each test case, print the number of medians on the first line, then print the medians on the following lines with up to 10 per line.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3
9
1 2 3 4 5 6 7 8 9
9
9 8 7 6 5 4 3 2 1
23
23 41 13 22 -3 24 -31 -11 -8 -7
3 5 103 211 -311 -45 0 1 2 3
0 -2 99</pre></div>
                    <div><strong>Output</strong><pre>5
1 2 3 4 5
5
9 9 8 7 6
12
23 23 22 22 13 3 5 5 3 0 0 -2</pre></div>
                </div>
                <p class="example-explain">First line of output: number of medians. Following lines: print medians, at most 10 per line.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>T <= 1,000 (number of test cases)</li>
                    <li>M is an odd number <= 9,999</li>
                    <li>Each value in the sequence is between -32,768 and 32,767</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need to output "the current median" every time an odd-numbered element is read...<br>Could we just <strong>sort all numbers read so far</strong> each time and pick the middle value?<br><br>Example: [1, 2, 3, 4, 5] -> sort -> middle (3rd) = 3!' },
                { title: 'But there\'s a problem with this', content: 'Sorting everything each time a number comes in is <strong>O(N log N)</strong>.<br>If M is up to 9,999, sorting at every odd step -> about 5,000 x 10,000 x log(10,000) = <strong>600 million operations</strong>... TLE risk!<br><br><strong>Re-sorting from scratch</strong> each time a number is added is wasteful. The data is already mostly sorted with just one addition...' },
                { title: 'What if we try this?', content: 'Key idea: manage the sequence by <strong>splitting it in half</strong>!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="display:flex;gap:20px;justify-content:center;align-items:flex-start;flex-wrap:wrap;"><div style="text-align:center;flex:1;min-width:120px;"><div style="font-weight:700;color:var(--accent);margin-bottom:6px;">Max Heap (maxH)</div><div style="font-size:0.82em;color:var(--text2);margin-bottom:6px;">Smaller half</div><div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><span style="padding:4px 14px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;font-size:1.1em;">3 ← root</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">1</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">2</span></div></div><div style="display:flex;align-items:center;font-size:1.5em;color:var(--text2);padding-top:30px;">|</div><div style="text-align:center;flex:1;min-width:120px;"><div style="font-weight:700;color:var(--accent);margin-bottom:6px;">Min Heap (minH)</div><div style="font-size:0.82em;color:var(--text2);margin-bottom:6px;">Larger half</div><div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">5</span><span style="padding:3px 10px;background:var(--accent);color:#fff;border-radius:4px;">7</span></div></div></div><div style="text-align:center;margin-top:8px;color:var(--green);font-weight:600;">maxH root (3) = median!</div></div>\u2022 <strong>Max heap (maxH)</strong>: the smaller half -> its root is the largest in this half<br>\u2022 <strong>Min heap (minH)</strong>: the larger half -> its root is the smallest in this half<br><br>If we keep the two heaps balanced (maxH size >= minH size), <strong>the root of maxH is exactly the median</strong>!<br><br>When a new number arrives:<br>1. If smaller than maxH root, insert into maxH; otherwise into minH<br>2. If sizes become unbalanced, move an element from one heap to the other<br><br>Insertion + rebalancing is <strong>O(log N)</strong>, so the total is <strong>O(M log M)</strong>!' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py">Since <code>heapq</code> is a min heap, maxH requires the <strong>multiply-by-(-1) trick</strong>.<br>Insert with <code>heappush(maxH, -x)</code>, and check the root with <code>-maxH[0]</code>.<br>Rebalancing: if maxH has 2 more, move to minH; if minH has more, move to maxH!</span><span class="lang-cpp">C++ <code>priority_queue&lt;int&gt;</code> is a max heap by default, so maxH works as-is!<br>For minH, use <code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;</code> for a min heap.<br><code>maxH.top()</code> is the median. No need to multiply by -1 like in Python, so it is more intuitive.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))\n    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))\n        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))',
                cpp: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int T; cin >> T;\n    while (T--) {\n        int M; cin >> M;\n        priority_queue<int> maxH;\n        priority_queue<int, vector<int>, greater<int>> minH;\n        vector<int> med;\n        for (int i = 0; i < M; i++) {\n            int x; cin >> x;\n            if (maxH.empty()||x<=maxH.top()) maxH.push(x); else minH.push(x);\n            if ((int)maxH.size()>(int)minH.size()+1){minH.push(maxH.top());maxH.pop();}\n            else if ((int)minH.size()>(int)maxH.size()){maxH.push(minH.top());minH.pop();}\n            if ((i+1)%2==1) med.push_back(maxH.top());\n        }\n        cout << med.size() << "\\n";\n        for (int i=0;i<(int)med.size();i++){cout<<med[i];if((i+1)%10==0||i==(int)med.size()-1)cout<<"\\n";else cout<<" ";}\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Two Heaps',
                description: 'Maintain the median in real time using max heap + min heap.',
                timeComplexity: 'O(M log M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Input and Initialization', desc: 'Maintain the median in real time using two heaps (max heap + min heap).', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nT = int(input())\nfor _ in range(T):\n    M = int(input())\n    nums = []\n    while len(nums) < M:\n        nums.extend(map(int, input().split()))' },
                        { title: 'Heap Insert and Rebalance', desc: 'Balance maxH (smaller half) and minH (larger half) sizes so that maxH root = median.', code: '    maxH, minH, medians = [], [], []\n    for i, x in enumerate(nums):\n        if not maxH or x <= -maxH[0]:\n            heapq.heappush(maxH, -x)\n        else:\n            heapq.heappush(minH, x)\n        if len(maxH) > len(minH) + 1:\n            heapq.heappush(minH, -heapq.heappop(maxH))\n        elif len(minH) > len(maxH):\n            heapq.heappush(maxH, -heapq.heappop(minH))' },
                        { title: 'Output Medians', desc: 'At every odd step, the maxH root (-maxH[0]) is the median. Print 10 per line.', code: '        if (i + 1) % 2 == 1:\n            medians.append(-maxH[0])\n    print(len(medians))\n    for i in range(0, len(medians), 10):\n        print(\' \'.join(map(str, medians[i:i+10])))' }
                    ],
                    cpp: [
                        { title: 'Input and Initialization', desc: 'C++ priority_queue is a max heap by default, so maxH works as-is.\nminH uses greater<int> for a min heap.', code: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int T;\n    cin >> T;\n    while (T--) {\n        int M;\n        cin >> M;\n        priority_queue<int> maxH;  // max heap (smaller half)\n        priority_queue<int, vector<int>, greater<int>> minH;  // min heap (larger half)\n        vector<int> med;' },
                        { title: 'Heap Insert and Rebalance', desc: 'Maintain maxH size >= minH size.\nmaxH top = median.', code: '        for (int i = 0; i < M; i++) {\n            int x;\n            cin >> x;\n            // Insert into smaller half or larger half\n            if (maxH.empty() || x <= maxH.top())\n                maxH.push(x);\n            else\n                minH.push(x);\n            // Rebalance: maxH size >= minH size\n            if ((int)maxH.size() > (int)minH.size() + 1) {\n                minH.push(maxH.top()); maxH.pop();\n            } else if ((int)minH.size() > (int)maxH.size()) {\n                maxH.push(minH.top()); minH.pop();\n            }' },
                        { title: 'Output Medians', desc: 'At every odd step, maxH.top() is the median. Print 10 per line.', code: '            if ((i + 1) % 2 == 1)\n                med.push_back(maxH.top());\n        }\n        cout << med.size() << \'\\n\';\n        for (int i = 0; i < (int)med.size(); i++) {\n            cout << med[i];\n            if ((i + 1) % 10 == 0 || i == (int)med.size() - 1)\n                cout << \'\\n\';\n            else\n                cout << \' \';\n        }\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1202', title: 'BOJ 1202 - Jewel Thief', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1202',
            simIntro: 'Observe the process of finding the optimal solution with greedy + heap, processing bags from smallest to largest.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>The world-famous thief Sangdeok has decided to rob a jewelry store. There are N jewels in the store. Each jewel has a weight M<sub>i</sub> and a value V<sub>i</sub>. Sangdeok has K bags, and each bag can hold a maximum weight of C<sub>i</sub>. Each bag can hold at most one jewel.</p>
                <p>Find the maximum total value of jewels that Sangdeok can steal.</p>
                <h4>Input</h4>
                <p>The first line contains N and K. (1 &le; N, K &le; 300,000)</p>
                <p>Each of the next N lines contains the weight M<sub>i</sub> and value V<sub>i</sub> of each jewel. (0 &le; M<sub>i</sub>, V<sub>i</sub> &le; 1,000,000)</p>
                <p>Each of the next K lines contains the maximum weight C<sub>i</sub> that each bag can hold. (1 &le; C<sub>i</sub> &le; 100,000,000)</p>
                <h4>Output</h4>
                <p>Print the maximum total value of jewels that Sangdeok can steal on the first line.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2 1
5 10
100 100
11</pre></div>
                    <div><strong>Output</strong><pre>10</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3 2
1 65
5 23
2 99
10
2</pre></div>
                    <div><strong>Output</strong><pre>164</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N, K ≤ 300,000</li>
                    <li>0 ≤ M<sub>i</sub>, V<sub>i</sub> ≤ 1,000,000</li>
                    <li>1 ≤ C<sub>i</sub> ≤ 100,000,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since each bag holds one jewel... for each bag, just put in <strong>the most expensive jewel that fits</strong>, right?<br><br>For each bag, check all jewels and pick "the one that fits and is most expensive"!' },
                { title: 'But there\'s a problem with this', content: 'If N and K are up to 300,000, then 300K bags x 300K jewels = <strong>90 billion comparisons</strong>... total TLE!<br><br>Also, once a jewel goes in bag A, it cannot go in bag B, so <strong>which jewel goes in which bag</strong> matters. Simple brute force will not work.' },
                { title: 'What if we try this?', content: '<strong>Greedy strategy</strong>: process bags in order of <strong>smallest capacity first</strong>!<br><br>Why smallest first? Jewels that fit in a small bag also fit in a large bag, but not vice versa. So processing <strong>bags with fewer options first</strong> is optimal.<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;margin-bottom:8px;text-align:center;">Processing bags by capacity (example)</div><table style="border-collapse:collapse;width:100%;"><tr style="background:var(--bg3);"><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">Step</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">Bag Cap.</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">Added to Heap</th><th style="padding:5px 8px;border:1px solid var(--bg3);font-size:0.9em;">Chosen</th></tr><tr><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:5px 8px;border:1px solid var(--bg3);">wt&le;2: (1,65), (2,99)</td><td style="padding:5px 8px;border:1px solid var(--bg3);color:var(--green);font-weight:600;">99 picked!</td></tr><tr><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:5px 8px;border:1px solid var(--bg3);text-align:center;">10</td><td style="padding:5px 8px;border:1px solid var(--bg3);">wt&le;10: (5,23) added</td><td style="padding:5px 8px;border:1px solid var(--bg3);color:var(--green);font-weight:600;">65 picked!</td></tr></table><div style="margin-top:6px;text-align:center;color:var(--green);font-weight:600;">Total = 99 + 65 = 164</div></div>When processing each bag:<br>1. Put all jewels that <strong>fit by weight</strong> into a max heap<br>2. Extract the <strong>most expensive jewel</strong> from the heap<br><br>If jewels are sorted by weight too, a single pointer can scan "jewels not yet added that fit" in order!' },
                { title: '<span class="lang-py">Python</span><span class="lang-cpp">C++</span> implementation', content: '<span class="lang-py">Sort jewels by weight, bags by capacity.<br>Use pointer <code>j</code> to scan jewels in order, pushing values with <code>heappush(heap, -v)</code> into a max heap (multiply-by-(-1) trick!).<br>For each bag, select the most expensive jewel with <code>-heappop(heap)</code>.<br>Total <strong>O((N+K) log N)</strong> and passes!</span><span class="lang-cpp">C++ <code>priority_queue&lt;int&gt;</code> is a max heap by default, so just push values directly!<br>Use pointer <code>j</code> to scan jewels by weight, pushing with <code>pq.push(v)</code>, and for each bag select the most expensive with <code>pq.top()</code>.<br>The answer may exceed int range, so use <code>long long</code>! Total <strong>O((N+K) log N)</strong>.</span>' }
            ],
            templates: {
                python: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\n\njewels.sort()\nbags.sort()\n\nanswer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)\nprint(answer)',
                cpp: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N, K; cin >> N >> K;\n    vector<pair<int,int>> jewels(N); vector<int> bags(K);\n    for (int i=0;i<N;i++) cin >> jewels[i].first >> jewels[i].second;\n    for (int i=0;i<K;i++) cin >> bags[i];\n    sort(jewels.begin(),jewels.end()); sort(bags.begin(),bags.end());\n    priority_queue<int> pq; long long ans=0; int j=0;\n    for (int i=0;i<K;i++){while(j<N&&jewels[j].first<=bags[i]){pq.push(jewels[j].second);j++;}if(!pq.empty()){ans+=pq.top();pq.pop();}}\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Greedy + Max Heap',
                description: 'Process bags in order and select the most expensive jewel using a max heap.',
                timeComplexity: 'O((N+K) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and Sort', desc: 'Sort jewels by weight, bags by capacity. Process smallest bags first.', code: 'import sys\nimport heapq\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\njewels = []\nfor _ in range(N):\n    m, v = map(int, input().split())\n    jewels.append((m, v))\nbags = [int(input()) for _ in range(K)]\njewels.sort()\nbags.sort()' },
                        { title: 'Greedy + Heap', desc: 'For each bag, add all fitting jewels to a max heap, then select the most expensive.', code: 'answer = 0\nheap = []\nj = 0\nfor bag in bags:\n    while j < N and jewels[j][0] <= bag:\n        heapq.heappush(heap, -jewels[j][1])\n        j += 1\n    if heap:\n        answer += -heapq.heappop(heap)' },
                        { title: 'Output', desc: 'After processing all bags, print the accumulated total value.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: 'Input and Sort', desc: 'Sort as pair<weight, value> for automatic weight-based sorting.\nAlso sort bags by capacity (smallest first).', code: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, K;\n    cin >> N >> K;\n    vector<pair<int,int>> jewels(N);  // {weight, value}\n    vector<int> bags(K);\n    for (int i = 0; i < N; i++)\n        cin >> jewels[i].first >> jewels[i].second;\n    for (int i = 0; i < K; i++)\n        cin >> bags[i];\n    sort(jewels.begin(), jewels.end());\n    sort(bags.begin(), bags.end());' },
                        { title: 'Greedy + Heap', desc: 'For each bag, add all fitting jewels to the max heap,\nthen extract the most expensive jewel.\nC++ priority_queue is a max heap by default, so no -1 trick needed.', code: '    priority_queue<int> pq;  // max heap: most expensive jewel at top\n    long long ans = 0;\n    int j = 0;\n    for (int i = 0; i < K; i++) {\n        // Add all jewels that fit in the current bag to the heap\n        while (j < N && jewels[j].first <= bags[i]) {\n            pq.push(jewels[j].second);\n            j++;\n        }\n        if (!pq.empty()) {\n            ans += pq.top();\n            pq.pop();\n        }\n    }' },
                        { title: 'Output', desc: 'Print the total value accumulated as long long.', code: '    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return priorityQueueTopic.problems[5].templates; }
            }]
        }
    ],

    _renderProblemDetail: function(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { priorityQueueTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.priorityqueue = priorityQueueTopic;
