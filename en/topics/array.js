// =========================================================
// Array Topic Module
// =========================================================
const arrayTopic = {
    id: 'array',
    title: 'Array',
    icon: '📊',
    category: 'Fundamentals (Bronze~Silver)',
    order: 2,
    description: 'Key patterns for solving array problems: Two Pointers, Sliding Window, and range processing',
    relatedNote: 'Other techniques like Kadane\'s algorithm, Monotone Stack, and Dutch National Flag are also commonly used in array problems.',

    sidebarExpandable: true,

    // Single unified tab (for topic overview)
    tabs: [{ id: 'concept', label: 'Learn' }],

    // Problem-type mapping
    problemMeta: {
        'boj-10818': { type: 'Min/Max', color: '#00b894', vizMethod: '_renderVizMinMax' },
        'lc-1':     { type: 'Hash Map Lookup',    color: 'var(--accent)', vizMethod: '_renderVizTwoSum' },
        'lc-121':   { type: 'Single Pass',        color: 'var(--green)',  vizMethod: '_renderVizStock' },
        'lc-15':    { type: 'Two Pointers',       color: '#e17055',      vizMethod: '_renderViz3Sum' },
        'boj-2003': { type: 'Sliding Window',     color: '#6c5ce7',      vizMethod: '_renderVizSlidingWindow' }
    },

    // ===== Problem tab definitions =====
    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: 'Problem', icon: '📋' },
            { id: 'think', label: 'Approach', icon: '💡' },
            { id: 'sim', label: 'Simulation', icon: '🎮' },
            { id: 'code', label: 'Code', icon: '💻' }
        ];
    },

    // ===== Problem content rendering (called from app.js) =====
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
            case 'sim':     if (meta.vizMethod) self[meta.vizMethod](contentDiv); break;
            case 'code':    self._renderCodeTab(contentDiv, prob); break;
        }

        // Next tab navigation button
        var tabOrder = ['problem', 'think', 'sim', 'code'];
        var tabLabels = { problem: 'Problem', think: 'Approach', sim: 'Simulation', code: 'Code' };
        var ctaTexts = { problem: 'Understood the problem?', think: 'Reviewed all hints?', sim: 'Understand how it works?' };
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

    // ===== Problem sub-tab: Problem =====
    _renderProblemTab(contentEl, prob) {
        const isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    // ===== Problem sub-tab: Approach =====
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

            // If viz exists, add container in advance
            if (hint.viz) {
                var vizArea = document.createElement('div');
                vizArea.className = 'hint-viz-area';
                step.querySelector('.hint-step-body').appendChild(vizArea);
            }

            step.querySelector('.hint-step-header').addEventListener('click', function() {
                if (step.classList.contains('locked')) return;
                var wasOpened = step.classList.contains('opened');
                step.classList.toggle('opened');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('opened') ? '▴' : '▾';
                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < prob.hints.length) {
                        var nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
                // viz lifecycle management
                if (hint.viz) {
                    var va = step.querySelector('.hint-viz-area');
                    if (!wasOpened) {
                        // Opened: start viz (clean up previous one first)
                        if (step._vizCtrl) { step._vizCtrl.destroy(); }
                        va.innerHTML = '';
                        step._vizCtrl = hint.viz(va);
                    } else {
                        // Closed: stop viz
                        if (step._vizCtrl) { step._vizCtrl.stop(); }
                    }
                }
            });
            hintsDiv.appendChild(step);
        });
        contentEl.appendChild(hintsDiv);

        // Apply hljs highlighting + line-by-line animation to code blocks
        if (window.hljs) {
            hintsDiv.querySelectorAll('pre code').forEach(function(codeEl) {
                hljs.highlightElement(codeEl);
                var lines = codeEl.innerHTML.split('\n');
                codeEl.innerHTML = lines.map(function(line, i) {
                    return '<div class="code-line" style="--i:' + i + '">' + (line || '&nbsp;') + '</div>';
                }).join('');
            });
        }
    },

    // ===== Problem sub-tab: Code =====
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
            var langMap = { python: 'language-python', cpp: 'language-cpp' };
            codeEl.className = langMap[lang];
            codeEl.textContent = prob.templates[lang];
            if (window.hljs) hljs.highlightElement(codeEl);
        });
        contentEl.appendChild(wrapper);
    },
    // ===== Concept Tab =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📊 Array</h2>
                <p class="hero-sub">Learn the key patterns for solving array problems efficiently!</p>
            </div>

            <!-- Section 1: Array Basics -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> Array Basics
                </div>
                <div class="analogy-box">
                    Think of a row of numbered lockers at school -- Locker 0, Locker 1, Locker 2... If someone tells you "open Locker 5," you walk straight to it. No searching, no guessing. That's what makes arrays awesome: you jump right to any spot instantly.
                    But what if you need to squeeze a new locker between Locker 2 and Locker 3? You'd have to slide every locker after it down by one. With 100 lockers, that's up to 100 moves! So arrays are great for reading, but inserting in the middle is expensive.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Index O(1) Access vs Value Search O(n)</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-index-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Index:
                                <input type="number" id="arr-demo-index-input" min="0" max="7" value="0" style="width:56px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-index-go">⚡ O(1) Direct Access</button>
                            <button class="concept-demo-btn" id="arr-demo-index-search" style="background:var(--yellow);color:#333;">🔍 Start O(n) Search</button>
                        </div>
                        <div id="arr-demo-search-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-search-prev" class="concept-demo-btn">← Prev</button>
                            <span id="arr-demo-search-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>
                            <button id="arr-demo-search-next" class="concept-demo-btn">Next →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-index-msg">👆 Enter an index and click a button! Feel the difference between "direct access" and "value search."</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="2" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.3"/><rect x="14" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.6"/><rect x="26" y="14" width="10" height="10" rx="2" fill="var(--accent)" opacity="0.9"/></svg>
                        </div>
                        <h3>Index Access O(1)</h3>
                        <p>Access any position instantly with <code>arr[i]</code>. This is the biggest advantage of arrays!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">O(n)</text></svg>
                        </div>
                        <h3>Traversal</h3>
                        <p>Visiting every element once takes O(n). This is the foundation of most array problems.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="12" font-weight="bold" fill="var(--yellow)">insert</text></svg>
                        </div>
                        <h3>Insert/Delete O(n)</h3>
                        <p>Inserting or removing in the middle requires shifting all elements after it. Operations at the end are O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">sorted</text></svg>
                        </div>
                        <h3>Sorted Array</h3>
                        <p>When sorted, binary search — O(log n) — halving each time — becomes possible. Two pointers also work after sorting.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Array (list) basic operations
arr = [3, 1, 4, 1, 5, 9, 2, 6]

print(arr[0])       # 3 — first element
print(arr[-1])      # 6 — last element
print(len(arr))     # 8 — length

arr.append(7)       # Append to end: O(1)
arr.sort()          # Sort: O(n log n) — fast sorting speed
print(arr)          # [1, 1, 2, 3, 4, 5, 6, 7, 9]

# List comprehension — filter even numbers
evens = [x for x in arr if x % 2 == 0]
print(evens)        # [2, 4, 6]</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

int main() {
    vector&lt;int&gt; arr = {3, 1, 4, 1, 5, 9, 2, 6};

    cout &lt;&lt; arr[0] &lt;&lt; endl;       // 3 — first element
    cout &lt;&lt; arr.back() &lt;&lt; endl;   // 6 — last element
    cout &lt;&lt; arr.size() &lt;&lt; endl;   // 8 — length

    arr.push_back(7);              // Append to end: O(1)
    sort(arr.begin(), arr.end());  // Sort: O(n log n)

    // Filter even numbers
    vector&lt;int&gt; evens;
    for (int x : arr) {
        if (x % 2 == 0) evens.push_back(x);
    }
    // evens = {2, 4, 6}
}</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#list" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: list ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/vector" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: vector ↗</a></span>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Insert/Delete Cost</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-insert-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;min-height:60px;align-items:flex-end;"></div>
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <button class="concept-demo-btn" id="arr-demo-insert-mid">📥 Insert in Middle (O(n))</button>
                            <button class="concept-demo-btn green" id="arr-demo-insert-end">📥 Append to End (O(1))</button>
                            <button class="concept-demo-btn danger" id="arr-demo-insert-reset">🔄 Reset</button>
                        </div>
                        <div id="arr-demo-insert-controls" style="display:none;gap:12px;justify-content:center;align-items:center;margin-top:4px;">
                            <button id="arr-demo-insert-prev" class="concept-demo-btn">← Prev</button>
                            <span id="arr-demo-insert-counter" style="font-size:0.85rem;color:var(--text2);">Before Start</span>
                            <button id="arr-demo-insert-next" class="concept-demo-btn">Next →</button>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-insert-msg">👆 Click "Insert in Middle" to see how elements shift one by one!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the time complexity of inserting an element at the middle (index 3) of an array? Why?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>! Because all elements after index 3 must be shifted back by one position.
                        If the array length is n, up to n-3 elements need to be moved.
                    </div>
                </div>
            </div>

            <!-- Section 2: Two Pointers -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> Two Pointers (shrink from both ends)
                </div>
                <div class="analogy-box">
                    Imagine two friends standing at opposite ends of a hallway, walking toward each other. One starts at the left wall, the other at the right wall, and they meet somewhere in the middle. That's exactly how Two Pointers works on a sorted array!
                    Need to find two numbers that add up to a target? If the sum is too big, the right friend steps left. Too small? The left friend steps right. Instead of checking every possible pair -- with 100 numbers that's 5,000 pairs! -- you find the answer in just one walk across the array.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Find a Sum with Two Pointers</div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Target sum:
                                <input type="number" id="arr-demo-tp-target" value="10" style="width:60px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                            </label>
                            <button class="concept-demo-btn" id="arr-demo-tp-step">▶ Next Step</button>
                            <button class="concept-demo-btn danger" id="arr-demo-tp-reset">🔄 Reset</button>
                        </div>
                        <div id="arr-demo-tp-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div id="arr-demo-tp-pointers" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;font-size:0.75rem;font-weight:700;min-height:20px;"></div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-tp-msg">👆 Click "Next Step" to see how the L and R pointers move!</div>
                </div>

                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--green)">L→</text></svg>
                        </div>
                        <h3>Start from Left</h3>
                        <p>Start at <code>left = 0</code> and move rightward.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">←R</text></svg>
                        </div>
                        <h3>Start from Right</h3>
                        <p>Start at <code>right = n-1</code> and move leftward.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="22" font-size="18" font-weight="bold" fill="var(--yellow)">↔</text></svg>
                        </div>
                        <h3>Move by Condition</h3>
                        <p>If sum is too large, right--; if too small, left++. Done in O(n)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Two Pointers: find two numbers summing to target in sorted array
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1      # Sum too small, move left up
        else:
            right -= 1     # Sum too large, move right down
    return [-1, -1]        # Not found

arr = [1, 2, 4, 6, 8, 10]
print(two_sum_sorted(arr, 10))  # [1, 4] → 2+8=10</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;iostream&gt;
using namespace std;

// Two Pointers: find two numbers summing to target in sorted array
vector&lt;int&gt; two_sum_sorted(vector&lt;int&gt;&amp; arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left &lt; right) {
        int s = arr[left] + arr[right];
        if (s == target)
            return {left, right};
        else if (s &lt; target)
            left++;        // Sum too small, move left up
        else
            right--;       // Sum too large, move right down
    }
    return {-1, -1};       // Not found
}

int main() {
    vector&lt;int&gt; arr = {1, 2, 4, 6, 8, 10};
    auto res = two_sum_sorted(arr, 10);
    cout &lt;&lt; res[0] &lt;&lt; ", " &lt;&lt; res[1] &lt;&lt; endl;  // 1, 4 → 2+8=10
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How many comparisons does Two Pointers need to find two numbers summing to 12 in sorted [1, 3, 5, 7, 9]?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>Just 2!</strong> 1+9=10 (too small, L++), 3+9=12 (found!). It only takes 2 comparisons.
                        A double for loop would need up to 10 comparisons — Two Pointers is much faster.
                    </div>
                </div>
            </div>

            <!-- Section 3: Sliding Window -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> Sliding Window (slide a range across)
                </div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think of <em>"sliding a window across to see the view"</em>!
                    Slide a fixed-size window one position at a time across the array,
                    tracking the sum/max/min of the elements visible in the window.
                    Instead of recalculating from scratch each time, just subtract what left and add what entered!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Find Max Sum with Sliding Window</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;margin-bottom:8px;">
                        <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Window size K:
                            <input type="number" id="arr-demo-sw-k" min="2" max="5" value="3" style="width:56px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                        </label>
                        <button class="concept-demo-btn" id="arr-demo-sw-step">▶ Next Step</button>
                        <button class="concept-demo-btn danger" id="arr-demo-sw-reset">🔄 Reset</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-sw-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <span style="font-size:0.9rem;font-weight:600;">Current sum: <span id="arr-demo-sw-sum" style="color:var(--accent);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">Max sum: <span id="arr-demo-sw-max" style="color:var(--green);font-size:1.1rem;">—</span></span>
                        </div>
                        <div id="arr-demo-sw-calc" style="font-size:0.85rem;color:var(--text2);min-height:20px;text-align:center;"></div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-sw-msg">👆 Click "Next Step" to see the window slide and update the sum!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="20" height="14" rx="3" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4,2"/><rect x="6" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/><rect x="13" y="14" width="6" height="10" rx="1" fill="var(--green)" opacity="0.4"/></svg>
                        </div>
                        <h3>Fixed-size Window</h3>
                        <p>Slide a window of size K one position at a time, updating the sum. O(n)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="12" width="28" height="14" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,2"/><text x="10" y="22" font-size="8" fill="var(--text2)">flex</text></svg>
                        </div>
                        <h3>Variable-size Window</h3>
                        <p>Shrink the left side when the condition is met, expand the right side otherwise.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Sliding Window: max sum of subarray of size K
def max_subarray_sum(arr, k):
    # Sum of the first window
    window_sum = sum(arr[:k])
    max_sum = window_sum

    # Slide one step: add new element, subtract old one
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

arr = [2, 1, 5, 1, 3, 2]
print(max_subarray_sum(arr, 3))  # 9 (= 5+1+3)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;iostream&gt;
using namespace std;

// Sliding Window: max sum of subarray of size K
int max_subarray_sum(vector&lt;int&gt;&amp; arr, int k) {
    // Sum of the first window
    int window_sum = 0;
    for (int i = 0; i &lt; k; i++)
        window_sum += arr[i];
    int max_sum = window_sum;

    // Slide one step: add new element, subtract old one
    for (int i = k; i &lt; (int)arr.size(); i++) {
        window_sum += arr[i] - arr[i - k];
        max_sum = max(max_sum, window_sum);
    }
    return max_sum;
}

int main() {
    vector&lt;int&gt; arr = {2, 1, 5, 1, 3, 2};
    cout &lt;&lt; max_subarray_sum(arr, 3) &lt;&lt; endl;  // 9 (= 5+1+3)
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">What is the maximum sum of a subarray of size 4 in [1, 4, 2, 10, 2, 3, 1, 0, 20]?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>24</strong>! From [2, 3, 1, 0, 20], the window [3, 1, 0, 20] = 24.
                        Other windows: [10, 2, 3, 1] = 16, [2, 3, 1, 0] = 6, [3, 1, 0, 20] = 24. The answer is 24!
                    </div>
                </div>
            </div>

            <!-- Section 4: Array Problem-Solving Strategies -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> Array Problem-Solving Strategies
                </div>
                <div class="analogy-box">
                    <strong>Know the patterns and the solution reveals itself!</strong> When you see an array problem, ask yourself:
                    Does sorting help? → Two Pointers. Looking at ranges? → Sliding Window.
                    Precompute results per element? → Preprocessing (Prefix Sum / Product Array).
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Max Stock Profit (Min Price Tracking)</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center;margin-bottom:8px;">
                        <label style="font-size:0.85rem;font-weight:600;color:var(--text2);">Prices:
                            <input type="text" id="arr-demo-stock-input" value="7,1,5,3,6,4" style="width:180px;padding:4px 8px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;">
                        </label>
                        <button class="concept-demo-btn" id="arr-demo-stock-step">▶ Next Step</button>
                        <button class="concept-demo-btn danger" id="arr-demo-stock-reset">🔄 Reset</button>
                    </div>
                    <div class="concept-demo-body" style="display:flex;flex-direction:column;align-items:center;gap:12px;">
                        <div id="arr-demo-stock-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;justify-content:center;">
                            <span style="font-size:0.9rem;font-weight:600;">Min price: <span id="arr-demo-stock-min" style="color:var(--accent);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">Current profit: <span id="arr-demo-stock-cur" style="color:var(--yellow);font-size:1.1rem;">—</span></span>
                            <span style="font-size:0.9rem;font-weight:600;">Max profit: <span id="arr-demo-stock-profit" style="color:var(--green);font-size:1.1rem;">—</span></span>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="arr-demo-stock-msg">👆 Click "Next Step" to see how min price tracking finds the maximum profit in a single pass!</div>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">sort</text></svg>
                        </div>
                        <h3>Sort then Search</h3>
                        <p>Sort O(n log n) + Two Pointers O(n) = O(n log n) total. Faster than brute force O(n²)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">←→</text></svg>
                        </div>
                        <h3>Left-Right Preprocessing</h3>
                        <p>Scan left-to-right and right-to-left to precompute information at each position.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">max</text></svg>
                        </div>
                        <h3>State Tracking</h3>
                        <p>Track min/max/cumulative values in variables as you traverse — get the answer in a single pass.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Example: max stock profit (single pass, tracking min)
def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)        # Lowest price so far
        max_profit = max(max_profit, price - min_price)  # What if we sell now?
    return max_profit

prices = [7, 1, 5, 3, 6, 4]
print(max_profit(prices))  # 5 (buy at 1, sell at 6)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;climits&gt;
#include &lt;iostream&gt;
using namespace std;

// Example: max stock profit (single pass, tracking min)
int max_profit(vector&lt;int&gt;&amp; prices) {
    int min_price = INT_MAX;
    int profit = 0;
    for (int price : prices) {
        min_price = min(min_price, price);        // Lowest price so far
        profit = max(profit, price - min_price);   // What if we sell now?
    }
    return profit;
}

int main() {
    vector&lt;int&gt; prices = {7, 1, 5, 3, 6, 4};
    cout &lt;&lt; max_profit(prices) &lt;&lt; endl;  // 5 (buy at 1, sell at 6)
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">A double for loop solution is O(n²), but the approach above is O(?). Why?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>O(n)</strong>! We traverse the array just once, tracking the minimum price so far in a single variable.
                        At each position, we can instantly calculate "what profit would we make if we sold now?"
                    </div>
                </div>
            </div>
        `;

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => {
                const box = btn.closest('.think-box');
                box.classList.add('revealed');
                btn.style.display = 'none';
            });
        });

        // --- helper: create array box ---
        var _mkBox = function(val, idx) {
            var d = document.createElement('div');
            d.className = 'str-char-box';
            d.innerHTML = '<span class="str-char-idx">' + idx + '</span><span class="str-char-val">' + val + '</span>';
            return d;
        };

        // --- 1. Index O(1) Access Demo ---
        {
            var idxArr = [10, 25, 8, 42, 17, 33, 5, 61];
            var boxesEl = container.querySelector('#arr-demo-index-boxes');
            var inputEl = container.querySelector('#arr-demo-index-input');
            var goBtn = container.querySelector('#arr-demo-index-go');
            var searchBtn = container.querySelector('#arr-demo-index-search');
            var msgEl = container.querySelector('#arr-demo-index-msg');
            var animating = false;

            var renderBoxes = function() {
                boxesEl.innerHTML = '';
                for (var i = 0; i < idxArr.length; i++) {
                    boxesEl.appendChild(_mkBox(idxArr[i], i));
                }
            };
            renderBoxes();

            var clearHighlights = function() {
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.background = '';
                    b.style.transform = '';
                    b.style.boxShadow = '';
                });
            };

            goBtn.addEventListener('click', function() {
                if (animating) return;
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = 'Index must be between 0 and ' + (idxArr.length - 1) + '!';
                    return;
                }
                var boxes = boxesEl.querySelectorAll('.str-char-box');
                boxes[idx].classList.add('matched');
                msgEl.textContent = 'arr[' + idx + '] = ' + idxArr[idx] + ' → Direct access! 0 comparisons, O(1). Just knowing the index is enough.';
            });

            // --- Linear search: manual step controls ---
            var searchControlsEl = container.querySelector('#arr-demo-search-controls');
            var searchPrevBtn = container.querySelector('#arr-demo-search-prev');
            var searchNextBtn = container.querySelector('#arr-demo-search-next');
            var searchCounterEl = container.querySelector('#arr-demo-search-counter');
            var searchSteps = [];
            var searchStep = -1;
            var searchActive = false;

            var buildSearchSteps = function(targetIdx) {
                var targetVal = idxArr[targetIdx];
                var steps = [];
                for (var i = 0; i <= targetIdx; i++) {
                    (function(si) {
                        if (si < targetIdx) {
                            steps.push({
                                desc: 'arr[' + si + '] = ' + idxArr[si] + ' → Not ' + targetVal + '. Next!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('comparing');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        } else {
                            steps.push({
                                desc: 'Found value ' + targetVal + '! ' + (si + 1) + ' comparisons made. O(n) — worst case requires ' + idxArr.length + ' comparisons!',
                                action: function() {
                                    var boxes = boxesEl.querySelectorAll('.str-char-box');
                                    boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                    for (var j = 0; j < si; j++) { boxes[j].style.opacity = '0.5'; }
                                    boxes[si].style.opacity = '';
                                    boxes[si].classList.add('matched');
                                    for (var j = si + 1; j < boxes.length; j++) { boxes[j].style.opacity = ''; }
                                }
                            });
                        }
                    })(i);
                }
                return steps;
            };

            var updateSearchUI = function() {
                if (searchStep < 0) {
                    searchCounterEl.textContent = 'Before Start';
                    searchPrevBtn.disabled = true;
                    searchNextBtn.disabled = false;
                } else if (searchStep >= searchSteps.length - 1) {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = true;
                } else {
                    searchCounterEl.textContent = (searchStep + 1) + ' / ' + searchSteps.length;
                    searchPrevBtn.disabled = false;
                    searchNextBtn.disabled = false;
                }
                if (searchStep >= 0 && searchStep < searchSteps.length) {
                    msgEl.textContent = searchSteps[searchStep].desc;
                    searchSteps[searchStep].action();
                } else {
                    clearHighlights();
                    boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                }
            };

            var resetSearch = function() {
                searchActive = false;
                searchStep = -1;
                searchSteps = [];
                searchControlsEl.style.display = 'none';
                goBtn.disabled = false;
                searchBtn.disabled = false;
                searchBtn.textContent = '🔍 Start O(n) Search';
                inputEl.disabled = false;
                clearHighlights();
                boxesEl.querySelectorAll('.str-char-box').forEach(function(b) { b.style.opacity = ''; });
                msgEl.textContent = '👆 Enter an index and click a button! Feel the difference between "direct access" and "value search."';
            };

            searchBtn.addEventListener('click', function() {
                if (searchActive) {
                    resetSearch();
                    return;
                }
                clearHighlights();
                var idx = parseInt(inputEl.value);
                if (isNaN(idx) || idx < 0 || idx >= idxArr.length) {
                    msgEl.textContent = 'Index must be between 0 and ' + (idxArr.length - 1) + '!';
                    return;
                }
                searchSteps = buildSearchSteps(idx);
                searchStep = -1;
                searchActive = true;
                goBtn.disabled = true;
                inputEl.disabled = true;
                searchBtn.textContent = '🔄 Reset Search';
                searchControlsEl.style.display = 'flex';
                msgEl.textContent = 'Searching for value ' + idxArr[idx] + ' by checking one by one from the start. Click "Next →"!';
                updateSearchUI();
            });

            searchNextBtn.addEventListener('click', function() {
                if (searchStep < searchSteps.length - 1) {
                    searchStep++;
                    updateSearchUI();
                }
            });

            searchPrevBtn.addEventListener('click', function() {
                if (searchStep > -1) {
                    searchStep--;
                    updateSearchUI();
                    if (searchStep < 0) {
                        msgEl.textContent = 'Checking values one by one from the start to find it. Click "Next →"!';
                    }
                }
            });
        }

        // --- 2. Insert/Delete Cost Demo ---
        {
            var insertArr = [3, 7, 1, 9, 4, 6];
            var insertBoxesEl = container.querySelector('#arr-demo-insert-boxes');
            var insertMidBtn = container.querySelector('#arr-demo-insert-mid');
            var insertEndBtn = container.querySelector('#arr-demo-insert-end');
            var insertResetBtn = container.querySelector('#arr-demo-insert-reset');
            var insertMsgEl = container.querySelector('#arr-demo-insert-msg');
            var insertControlsEl = container.querySelector('#arr-demo-insert-controls');
            var insertPrevBtn = container.querySelector('#arr-demo-insert-prev');
            var insertNextBtn = container.querySelector('#arr-demo-insert-next');
            var insertCounterEl = container.querySelector('#arr-demo-insert-counter');
            var insertCount = 0;
            var insertSteps = [];
            var insertStep = -1;
            var insertActive = false;

            var renderInsertBoxes = function() {
                insertBoxesEl.innerHTML = '';
                for (var i = 0; i < insertArr.length; i++) {
                    insertBoxesEl.appendChild(_mkBox(insertArr[i], i));
                }
            };
            renderInsertBoxes();

            var buildInsertSteps = function(arr, midIdx, newVal) {
                var steps = [];
                var arrCopy = arr.slice();
                // Step for each element shifting (from right to left)
                for (var si = arrCopy.length - 1; si >= midIdx; si--) {
                    (function(shiftI, totalShifts) {
                        steps.push({
                            desc: 'Shifting arr[' + shiftI + '] = ' + arrCopy[shiftI] + ' one position to the right... (' + (arrCopy.length - shiftI) + '/' + totalShifts + ')',
                            action: function() {
                                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                                if (boxes[shiftI]) {
                                    boxes[shiftI].classList.add('comparing');
                                }
                            }
                        });
                    })(si, arrCopy.length - midIdx);
                }
                // Final step: insert the element
                steps.push({
                    desc: 'Inserted ' + newVal + ' at index ' + midIdx + '! Shifted ' + (arrCopy.length - midIdx) + ' elements → O(n)',
                    action: function() {
                        insertArr.splice(midIdx, 0, newVal);
                        renderInsertBoxes();
                        var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        newBoxes[midIdx].classList.add('matched');
                    },
                    isFinal: true
                });
                return steps;
            };

            var updateInsertUI = function() {
                if (insertStep < 0) {
                    insertCounterEl.textContent = 'Before Start';
                    insertPrevBtn.disabled = true;
                    insertNextBtn.disabled = false;
                } else if (insertStep >= insertSteps.length - 1) {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = true;
                } else {
                    insertCounterEl.textContent = (insertStep + 1) + ' / ' + insertSteps.length;
                    insertPrevBtn.disabled = false;
                    insertNextBtn.disabled = false;
                }
                if (insertStep >= 0 && insertStep < insertSteps.length) {
                    insertMsgEl.textContent = insertSteps[insertStep].desc;
                    insertSteps[insertStep].action();
                }
            };

            var resetInsertDemo = function() {
                insertActive = false;
                insertStep = -1;
                insertSteps = [];
                insertControlsEl.style.display = 'none';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertMidBtn.textContent = '📥 Insert in Middle (O(n))';
                var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                insertMsgEl.textContent = '👆 Click "Insert in Middle" to see how elements shift one by one!';
            };

            insertMidBtn.addEventListener('click', function() {
                if (insertArr.length >= 10) return;
                if (insertActive) {
                    resetInsertDemo();
                    return;
                }
                var midIdx = Math.floor(insertArr.length / 2);
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertSteps = buildInsertSteps(insertArr, midIdx, newVal);
                insertStep = -1;
                insertActive = true;
                insertEndBtn.disabled = true;
                insertMidBtn.textContent = '🔄 Reset Insert';
                insertControlsEl.style.display = 'flex';
                insertMsgEl.textContent = 'Inserting ' + newVal + ' at index ' + midIdx + '. First, we need to shift the elements after it! Click "Next →"!';
                updateInsertUI();
            });

            insertNextBtn.addEventListener('click', function() {
                if (insertStep < insertSteps.length - 1) {
                    insertStep++;
                    updateInsertUI();
                    // If final step reached, finish the insertion
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        insertCount++;
                        // Auto-finish after a moment
                        setTimeout(function() {
                            insertActive = false;
                            insertSteps = [];
                            insertStep = -1;
                            insertControlsEl.style.display = 'none';
                            insertMidBtn.textContent = '📥 Insert in Middle (O(n))';
                            insertMidBtn.disabled = insertArr.length >= 10;
                            insertEndBtn.disabled = insertArr.length >= 10;
                        }, 1200);
                    }
                }
            });

            insertPrevBtn.addEventListener('click', function() {
                if (insertStep > -1) {
                    // If we were on the final step, undo the splice
                    if (insertSteps[insertStep] && insertSteps[insertStep].isFinal) {
                        var midIdx = Math.floor((insertArr.length - 1) / 2);
                        insertArr.splice(midIdx, 1);
                        renderInsertBoxes();
                        insertCount--;
                    }
                    insertStep--;
                    if (insertStep >= 0) {
                        updateInsertUI();
                    } else {
                        insertCounterEl.textContent = 'Before Start';
                        insertPrevBtn.disabled = true;
                        insertNextBtn.disabled = false;
                        var boxes = insertBoxesEl.querySelectorAll('.str-char-box');
                        boxes.forEach(function(b) { b.classList.remove('comparing', 'matched'); });
                        insertMsgEl.textContent = 'Inserting value at index. Click "Next →"!';
                    }
                }
            });

            insertEndBtn.addEventListener('click', function() {
                if (insertActive || insertArr.length >= 10) return;
                var newVal = [0, 8, 2, 5, 11, 15][insertCount % 6];
                insertArr.push(newVal);
                renderInsertBoxes();
                var newBoxes = insertBoxesEl.querySelectorAll('.str-char-box');
                newBoxes[newBoxes.length - 1].classList.add('matched');
                insertMsgEl.textContent = 'Appended ' + newVal + ' to the end! Nothing to shift → O(1). Just add it at the back!';
                insertMidBtn.disabled = insertArr.length >= 10;
                insertEndBtn.disabled = insertArr.length >= 10;
                insertCount++;
            });

            insertResetBtn.addEventListener('click', function() {
                if (insertActive) {
                    resetInsertDemo();
                }
                insertArr = [3, 7, 1, 9, 4, 6];
                insertCount = 0;
                renderInsertBoxes();
                resetInsertDemo();
            });
        }

        // --- 3. Two Pointers Demo ---
        {
            var tpArr = [1, 2, 4, 6, 8, 10, 13, 15];
            var tpBoxesEl = container.querySelector('#arr-demo-tp-boxes');
            var tpPointersEl = container.querySelector('#arr-demo-tp-pointers');
            var tpStepBtn = container.querySelector('#arr-demo-tp-step');
            var tpResetBtn = container.querySelector('#arr-demo-tp-reset');
            var tpTargetEl = container.querySelector('#arr-demo-tp-target');
            var tpMsgEl = container.querySelector('#arr-demo-tp-msg');
            var tpL, tpR, tpDone;

            var renderTpBoxes = function() {
                tpBoxesEl.innerHTML = '';
                tpPointersEl.innerHTML = '';
                for (var i = 0; i < tpArr.length; i++) {
                    tpBoxesEl.appendChild(_mkBox(tpArr[i], i));
                    var ptr = document.createElement('span');
                    ptr.style.cssText = 'display:inline-block;width:44px;text-align:center;';
                    ptr.id = 'arr-demo-tp-ptr-' + i;
                    tpPointersEl.appendChild(ptr);
                }
            };

            var updateTpPointers = function() {
                for (var i = 0; i < tpArr.length; i++) {
                    var ptr = container.querySelector('#arr-demo-tp-ptr-' + i);
                    if (ptr) {
                        var labels = [];
                        if (i === tpL) labels.push('L');
                        if (i === tpR) labels.push('R');
                        ptr.textContent = labels.join(' ');
                        ptr.style.color = i === tpL ? 'var(--green)' : i === tpR ? 'var(--accent)' : '';
                    }
                }
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');
                boxes.forEach(function(b, idx) {
                    b.classList.remove('comparing', 'matched');
                    b.style.borderColor = '';
                    b.style.boxShadow = '';
                    if (idx === tpL) {
                        b.style.borderColor = 'var(--green)';
                        b.style.boxShadow = '0 0 8px rgba(0,184,148,0.4)';
                    }
                    if (idx === tpR) {
                        b.style.borderColor = 'var(--accent)';
                        b.style.boxShadow = '0 0 8px rgba(108,92,231,0.4)';
                    }
                });
            };

            var tpInit = function() {
                tpL = 0;
                tpR = tpArr.length - 1;
                tpDone = false;
                renderTpBoxes();
                updateTpPointers();
                tpStepBtn.disabled = false;
                tpMsgEl.textContent = '👆 Click "Next Step" to see how the L and R pointers move!';
            };
            tpInit();

            tpStepBtn.addEventListener('click', function() {
                if (tpDone || tpL >= tpR) {
                    tpMsgEl.textContent = 'Search is complete! Click 🔄 Reset to try again.';
                    tpStepBtn.disabled = true;
                    return;
                }
                var target = parseInt(tpTargetEl.value) || 10;
                var sum = tpArr[tpL] + tpArr[tpR];
                var boxes = tpBoxesEl.querySelectorAll('.str-char-box');

                if (sum === target) {
                    boxes[tpL].classList.add('matched');
                    boxes[tpR].classList.add('matched');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' ✓ Found the answer!';
                    tpDone = true;
                    tpStepBtn.disabled = true;
                } else if (sum < target) {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' < ' + target + ' → Sum too small, move L right!';
                    setTimeout(function() {
                        tpL++;
                        updateTpPointers();
                    }, 500);
                } else {
                    boxes[tpL].classList.add('comparing');
                    boxes[tpR].classList.add('comparing');
                    tpMsgEl.textContent = 'arr[' + tpL + '] + arr[' + tpR + '] = ' + tpArr[tpL] + ' + ' + tpArr[tpR] + ' = ' + sum + ' > ' + target + ' → Sum too large, move R left!';
                    setTimeout(function() {
                        tpR--;
                        updateTpPointers();
                    }, 500);
                }
            });

            tpResetBtn.addEventListener('click', function() {
                tpInit();
            });
        }

        // --- 4. Sliding Window Demo ---
        {
            var swArr = [2, 1, 5, 1, 3, 2];
            var swBoxesEl = container.querySelector('#arr-demo-sw-boxes');
            var swStepBtn = container.querySelector('#arr-demo-sw-step');
            var swResetBtn = container.querySelector('#arr-demo-sw-reset');
            var swKInput = container.querySelector('#arr-demo-sw-k');
            var swSumEl = container.querySelector('#arr-demo-sw-sum');
            var swMaxEl = container.querySelector('#arr-demo-sw-max');
            var swCalcEl = container.querySelector('#arr-demo-sw-calc');
            var swMsgEl = container.querySelector('#arr-demo-sw-msg');
            var swPos = -1, swSum = 0, swMaxSum = 0, swK = 3;
            var swBoxes = [];

            function swInit() {
                swK = parseInt(swKInput.value) || 3;
                if (swK < 2) swK = 2;
                if (swK > swArr.length) swK = swArr.length;
                swPos = -1; swSum = 0; swMaxSum = 0;
                swBoxesEl.innerHTML = '';
                swBoxes = [];
                for (var i = 0; i < swArr.length; i++) {
                    var b = _mkBox(swArr[i], i);
                    swBoxesEl.appendChild(b);
                    swBoxes.push(b);
                }
                swSumEl.textContent = '—';
                swMaxEl.textContent = '—';
                swCalcEl.textContent = '';
                swMsgEl.textContent = '👆 Click "Next Step" to see the window slide and update the sum!';
            }
            swInit();

            swStepBtn.addEventListener('click', function() {
                swPos++;
                if (swPos === 0) {
                    swSum = 0;
                    for (var i = 0; i < swK; i++) swSum += swArr[i];
                    swMaxSum = swSum;
                    swBoxes.forEach(function(b) { b.className = 'str-char-box'; });
                    for (var i = 0; i < swK; i++) swBoxes[i].classList.add('comparing');
                    swSumEl.textContent = swSum;
                    swMaxEl.textContent = swMaxSum;
                    var parts = swArr.slice(0, swK).join(' + ');
                    swCalcEl.textContent = 'Initial window: ' + parts + ' = ' + swSum;
                    swMsgEl.textContent = 'Initial sum of window size ' + swK + ' = ' + swSum + '. Now let\'s slide!';
                    return;
                }
                var slideIdx = swPos - 1 + swK;
                if (slideIdx >= swArr.length) {
                    swMsgEl.textContent = 'Done! Max sum is ' + swMaxSum + ' 🎉';
                    swBoxes.forEach(function(b) { b.classList.remove('comparing'); b.classList.add('matched'); });
                    swCalcEl.textContent = '';
                    return;
                }
                var outIdx = swPos - 1;
                var outVal = swArr[outIdx];
                var inVal = swArr[slideIdx];
                swSum = swSum - outVal + inVal;
                var oldMax = swMaxSum;
                swMaxSum = Math.max(swMaxSum, swSum);
                swBoxes.forEach(function(b) { b.className = 'str-char-box'; });
                swBoxes[outIdx].style.opacity = '0.4';
                for (var i = swPos; i <= slideIdx; i++) swBoxes[i].classList.add('comparing');
                swSumEl.textContent = swSum;
                swMaxEl.textContent = swMaxSum;
                swCalcEl.innerHTML = 'Previous sum <b>' + (swSum + outVal - inVal) + '</b> − removed <b>' + outVal + '</b> + added <b>' + inVal + '</b> = <b>' + swSum + '</b>';
                var isNew = swMaxSum > oldMax;
                swMsgEl.textContent = 'Window [' + swPos + '~' + slideIdx + '] sum = ' + swSum + (isNew ? ' → New max!' : ' (max ' + swMaxSum + ' unchanged)');
            });

            swResetBtn.addEventListener('click', swInit);
        }

        // --- 5. Stock Max Profit Demo ---
        {
            var stockArr = [7, 1, 5, 3, 6, 4];
            var stockBoxesEl = container.querySelector('#arr-demo-stock-boxes');
            var stockStepBtn = container.querySelector('#arr-demo-stock-step');
            var stockResetBtn = container.querySelector('#arr-demo-stock-reset');
            var stockInputEl = container.querySelector('#arr-demo-stock-input');
            var stockMinEl = container.querySelector('#arr-demo-stock-min');
            var stockCurEl = container.querySelector('#arr-demo-stock-cur');
            var stockProfitEl = container.querySelector('#arr-demo-stock-profit');
            var stockMsgEl = container.querySelector('#arr-demo-stock-msg');
            var stockPos = -1, stockMin = Infinity, stockProfit = 0;
            var stockBoxes = [];

            function stockInit() {
                var raw = stockInputEl.value.split(',').map(function(v) { return parseInt(v.trim()); }).filter(function(v) { return !isNaN(v); });
                if (raw.length >= 2) stockArr = raw;
                stockPos = -1; stockMin = Infinity; stockProfit = 0;
                stockBoxesEl.innerHTML = '';
                stockBoxes = [];
                for (var i = 0; i < stockArr.length; i++) {
                    var b = _mkBox(stockArr[i], i);
                    stockBoxesEl.appendChild(b);
                    stockBoxes.push(b);
                }
                stockMinEl.textContent = '—';
                stockCurEl.textContent = '—';
                stockProfitEl.textContent = '—';
                stockMsgEl.textContent = '👆 Click "Next Step" to see how min price tracking finds the maximum profit in a single pass!';
            }
            stockInit();

            stockStepBtn.addEventListener('click', function() {
                stockPos++;
                if (stockPos >= stockArr.length) {
                    stockMsgEl.textContent = 'Done! Max profit is ' + stockProfit + ' 🎉';
                    stockBoxes.forEach(function(b) { b.classList.remove('comparing'); b.classList.add('matched'); });
                    return;
                }
                var price = stockArr[stockPos];
                var isNewMin = price < stockMin;
                stockMin = Math.min(stockMin, price);
                var curProfit = price - stockMin;
                var isNewMax = curProfit > stockProfit;
                stockProfit = Math.max(stockProfit, curProfit);

                stockBoxes.forEach(function(b, i) {
                    b.className = 'str-char-box';
                    if (i < stockPos) b.style.opacity = '0.5';
                    else b.style.opacity = '1';
                });
                stockBoxes[stockPos].classList.add('comparing');
                for (var mi = 0; mi <= stockPos; mi++) {
                    if (stockArr[mi] === stockMin) {
                        stockBoxes[mi].style.opacity = '1';
                        stockBoxes[mi].classList.add('matched');
                        break;
                    }
                }

                stockMinEl.textContent = stockMin;
                stockCurEl.textContent = curProfit;
                stockProfitEl.textContent = stockProfit;

                if (isNewMin) {
                    stockMsgEl.textContent = 'Price ' + price + ' → New minimum! Best buy price so far.';
                } else if (isNewMax) {
                    stockMsgEl.textContent = 'Price ' + price + ' − min ' + stockMin + ' = profit ' + curProfit + ' → New max profit!';
                } else {
                    stockMsgEl.textContent = 'Price ' + price + ' − min ' + stockMin + ' = profit ' + curProfit + ' (max profit ' + stockProfit + ' unchanged)';
                }
            });

            stockResetBtn.addEventListener('click', stockInit);
        }
    },

    // ===== Visualization Tab =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== Visualization: Min/Max (BOJ 10818) =====
    _renderVizMinMax(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_ARR = [5, 20, -1, 7, 3, -8, 15];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="minmax-input" value="5, 20, -1, 7, 3, -8, 15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;">' +
            '<button class="viz-input-reset" id="minmax-reset" title="Reset after input change">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> Checking</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Current Min</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> Current Max</span></div>' +
            '<div id="minmax-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Min</div>' +
            '<div id="minmax-min" style="font-weight:700;font-size:1.1rem;color:var(--green);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Max</div>' +
            '<div id="minmax-max" style="font-weight:700;font-size:1.1rem;color:var(--accent);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#minmax-boxes');
        var minEl = container.querySelector('#minmax-min');
        var maxEl = container.querySelector('#minmax-max');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) {
            var b = boxesEl.querySelector('[data-idx="' + idx + '"]');
            if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }
        function saveState(data) {
            return {
                boxClasses: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b) { return b.className; }),
                min: minEl.innerHTML,
                max: maxEl.innerHTML
            };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b, i) { b.className = s.boxClasses[i]; });
            minEl.innerHTML = s.min;
            maxEl.innerHTML = s.max;
        }

        function buildSteps() {
            var input = container.querySelector('#minmax-input').value;
            var data = input.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (data.length < 1) { data = DEFAULT_ARR; }
            renderBoxes(data);
            minEl.textContent = '—';
            maxEl.textContent = '—';

            var steps = [];
            var curMin = data[0], curMax = data[0], minIdx = 0, maxIdx = 0;

            // Step 0: initialize with first element
            (function() {
                var _val = data[0];
                steps.push({
                    description: 'Set arr[0]=' + _val + ' as both the initial min and max. We\'ve only seen one number, so it\'s both!',
                    _before: null,
                    action: function() {
                        this._before = saveState(data);
                        for (var j = 0; j < data.length; j++) setBoxState(j, '');
                        setBoxState(0, 'matched');
                        minEl.innerHTML = '<strong>' + _val + '</strong> (idx 0)';
                        maxEl.innerHTML = '<strong>' + _val + '</strong> (idx 0)';
                    },
                    undo: function() { restoreState(this._before); }
                });
            })();

            // Compare remaining elements one by one
            for (var i = 1; i < data.length; i++) {
                (function(idx) {
                    var val = data[idx];
                    var prevMin = curMin, prevMax = curMax, prevMinIdx = minIdx, prevMaxIdx = maxIdx;
                    var isNewMin = val < curMin;
                    var isNewMax = val > curMax;

                    // Comparison step
                    steps.push({
                        description: 'Check arr[' + idx + ']=' + val + '. Compare with min ' + prevMin + ': ' +
                            (val < prevMin ? val + ' < ' + prevMin + ' — smaller! Need to update min!' : val + ' >= ' + prevMin + ' — min stays.') +
                            ' Compare with max ' + prevMax + ': ' +
                            (val > prevMax ? val + ' > ' + prevMax + ' — larger! Need to update max!' : val + ' <= ' + prevMax + ' — max stays.'),
                        _before: null,
                        action: function() {
                            this._before = saveState(data);
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(idx, 'comparing');
                            setBoxState(prevMinIdx, 'matched');
                            if (prevMaxIdx !== prevMinIdx) setBoxState(prevMaxIdx, 'visited');
                            minEl.innerHTML = '<strong>' + prevMin + '</strong> (idx ' + prevMinIdx + ')';
                            maxEl.innerHTML = '<strong>' + prevMax + '</strong> (idx ' + prevMaxIdx + ')';
                        },
                        undo: function() { restoreState(this._before); }
                    });

                    // Update step if min or max changed
                    if (isNewMin || isNewMax) {
                        var newMin = isNewMin ? val : prevMin;
                        var newMax = isNewMax ? val : prevMax;
                        var newMinIdx = isNewMin ? idx : prevMinIdx;
                        var newMaxIdx = isNewMax ? idx : prevMaxIdx;
                        steps.push({
                            description: (isNewMin ? 'Min updated! ' + prevMin + ' → ' + val : '') +
                                (isNewMin && isNewMax ? ' / ' : '') +
                                (isNewMax ? 'Max updated! ' + prevMax + ' → ' + val : ''),
                            _before: null,
                            action: function() {
                                this._before = saveState(data);
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(newMinIdx, 'matched');
                                if (newMaxIdx !== newMinIdx) setBoxState(newMaxIdx, 'visited');
                                minEl.innerHTML = '<strong>' + newMin + '</strong> (idx ' + newMinIdx + ')';
                                maxEl.innerHTML = '<strong>' + newMax + '</strong> (idx ' + newMaxIdx + ')';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }

                    if (isNewMin) { curMin = val; minIdx = idx; }
                    if (isNewMax) { curMax = val; maxIdx = idx; }
                })(i);
            }

            // Final result
            var finalMin = curMin, finalMax = curMax, finalMinIdx = minIdx, finalMaxIdx = maxIdx;
            steps.push({
                description: 'Done! Min = ' + finalMin + ', Max = ' + finalMax + '. We scanned the array just once — O(n) time!',
                _before: null,
                action: function() {
                    this._before = saveState(data);
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    setBoxState(finalMinIdx, 'matched');
                    if (finalMaxIdx !== finalMinIdx) setBoxState(finalMaxIdx, 'visited');
                    minEl.innerHTML = '<strong style="font-size:1.3rem;">' + finalMin + '</strong> ✅';
                    maxEl.innerHTML = '<strong style="font-size:1.3rem;">' + finalMax + '</strong> ✅';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // Reset button
        container.querySelector('#minmax-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            var input = container.querySelector('#minmax-input').value;
            var data = input.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (data.length < 1) { data = DEFAULT_ARR; }
            renderBoxes(data);
            minEl.textContent = '—';
            maxEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_ARR);
        self._initStepController(container, buildSteps);
    },

    // ===== Visualization: Two Sum (Hash Map) =====
    _renderVizTwoSum(container) {
        const self = this;
        self._clearVizState();

        const DEFAULT_ARR = [2, 7, 11, 4, 1, 5, 3, 8];

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
                <label style="font-weight:600;">Target sum:
                    <input type="number" id="arr-target" value="9"
                        style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;">
                    <button class="viz-input-reset" id="arr-viz-reset" title="Reset after input change">🔄</button>
                </label>
            </div>

            ${self._createStepDesc()}
            <div id="arr-sim-box" class="sim-card" style="overflow:visible;padding:0;position:relative;">
                <div id="arr-fly" style="position:absolute;inset:0;pointer-events:none;z-index:20;"></div>
                <div style="padding:24px;display:flex;flex-direction:column;align-items:center;gap:16px;">
                    <div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> Checking</span>
                        <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Answer</span>
                    </div>
                    <div id="arr-boxes" style="display:flex;gap:4px;flex-wrap:wrap;justify-content:center;"></div>
                    <div id="arr-pointer-info" style="font-size:1.1rem;font-weight:600;color:var(--text2);text-align:center;min-height:28px;"></div>
                </div>

                <div style="display:flex;gap:24px;padding:0 24px 16px;flex-wrap:wrap;">
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">seen (hash map)</div>
                        <div id="sw-seen" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:8px 12px;font-family:'SF Mono','Consolas',monospace;font-size:0.85rem;">{ }</div>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:6px;font-size:0.85rem;color:var(--text3);">Status</div>
                        <div id="arr-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">—</div>
                    </div>
                </div>

                <div id="arr-step-bar" style="display:flex;align-items:center;justify-content:center;gap:1rem;padding:12px 24px;border-top:1px solid var(--bg3);background:var(--bg1);">
                    <button id="arr-prev-btn" class="btn code-step-btn" disabled style="font-size:0.85rem;">← Prev</button>
                    <span id="arr-step-counter" style="font-size:0.85rem;font-weight:600;color:var(--accent);min-width:60px;text-align:center;">Before Start</span>
                    <button id="arr-next-btn" class="btn btn-primary code-step-btn" style="font-size:0.85rem;">Next →</button>
                </div>
            </div>
        `;

        const boxes = container.querySelector('#arr-boxes');
        const ptrEl = container.querySelector('#arr-pointer-info');
        const seenEl = container.querySelector('#sw-seen');
        const statusEl = container.querySelector('#arr-status');
        const flyEl = container.querySelector('#arr-fly');
        const wrapEl = container.querySelector('#arr-sim-box');

        function renderBoxes(arr) {
            boxes.innerHTML = '';
            arr.forEach((v, i) => {
                const box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = `<div class="str-char-idx">${i}</div><div class="str-char-val">${v}</div>`;
                boxes.appendChild(box);
            });
        }

        function setBoxState(idx, cls) {
            const box = boxes.querySelector(`[data-idx="${idx}"]`);
            if (box) box.className = 'str-char-box' + (cls ? ' ' + cls : '');
        }

        function renderSeen(seen) {
            if (Object.keys(seen).length === 0) { seenEl.innerHTML = '{ }'; return; }
            seenEl.innerHTML = Object.entries(seen).map(([k, v]) =>
                `<span id="seen-key-${k}" style="background:rgba(0,0,0,0.05);padding:2px 8px;border-radius:5px;border:1px solid rgba(0,0,0,0.08);transition:all 0.3s;"><span style="color:#d63384;font-weight:600;">${k}</span><span style="color:#999;">:</span><span style="color:#0d6efd;">${v}</span></span>`
            ).join(' ');
        }

        function highlightSeenKey(key, found) {
            const el = seenEl.querySelector('#seen-key-' + key);
            if (found && el) {
                el.style.background = 'rgba(0,184,148,0.4)';
                el.style.transform = 'scale(1.15)';
                el.style.display = 'inline-block';
            } else {
                // not found — briefly dim all
                seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => { s.style.opacity = '0.4'; });
            }
        }

        function clearSeenHighlight() {
            seenEl.querySelectorAll('span[id^="seen-key"]').forEach(s => {
                s.style.background = 'rgba(0,0,0,0.05)'; s.style.transform = ''; s.style.opacity = '';
            });
        }

        function saveState() {
            return {
                boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(b => b.className),
                pointer: ptrEl.innerHTML,
                seen: seenEl.innerHTML,
                status: statusEl.innerHTML
            };
        }

        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach((b, i) => { b.className = s.boxClasses[i]; });
            ptrEl.innerHTML = s.pointer;
            seenEl.innerHTML = s.seen;
            statusEl.innerHTML = s.status;
        }

        renderBoxes(DEFAULT_ARR);

        const prevBtn = container.querySelector('#arr-prev-btn');
        const nextBtn = container.querySelector('#arr-next-btn');
        const stepCounter = container.querySelector('#arr-step-counter');
        const state = self._vizState;

        function buildSteps() {
            const target = parseInt(container.querySelector('#arr-target').value) || 9;
            const nums = DEFAULT_ARR;
            const steps = [];
            const seen = {};

            for (let idx = 0; idx < nums.length; idx++) {
                const i = idx, num = nums[i], comp = target - num;
                const found = seen.hasOwnProperty(comp);
                const foundIdx = found ? seen[comp] : -1;

                steps.push({
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        flyEl.innerHTML = '';
                        for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                        setBoxState(i, 'current');
                        ptrEl.innerHTML = `Looking for complement <strong>${comp}</strong> of <strong>${num}</strong>…`;
                        if (found) {
                            highlightSeenKey(comp, true);
                            statusEl.innerHTML = `<span style="color:var(--green);">${comp} found! 🎉</span>`;
                        } else {
                            highlightSeenKey(comp, false);
                            statusEl.innerHTML = `<span style="color:var(--text3);">${comp} not found → save and move on</span>`;
                        }
                    },
                    undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                });

                if (found) {
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            for (let j = 0; j < nums.length; j++) setBoxState(j, '');
                            setBoxState(foundIdx, 'matched');
                            setBoxState(i, 'matched');
                            clearSeenHighlight();
                            ptrEl.innerHTML = `<span style="color:var(--green);">${nums[foundIdx]} + ${num} = ${target} ✅</span>`;
                            statusEl.innerHTML = `<span style="color:var(--green);font-size:1.1rem;">Found! [${foundIdx}, ${i}]</span>`;
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    break;
                } else {
                    const seenSnap = Object.assign({}, seen);
                    seenSnap[num] = i;
                    steps.push({
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            flyEl.innerHTML = '';
                            var srcBox = boxes.querySelector('[data-idx="' + i + '"]');
                            var srcRect = srcBox ? srcBox.getBoundingClientRect() : null;
                            clearSeenHighlight();
                            setBoxState(i, '');
                            renderSeen(seenSnap);
                            statusEl.innerHTML = `Saved ${num} to seen ✓`;
                            // Flying ghost: array box → hashmap entry
                            var dstKey = seenEl.querySelector('#seen-key-' + num);
                            if (srcRect && dstKey && wrapEl) {
                                var wr = wrapEl.getBoundingClientRect();
                                var dr = dstKey.getBoundingClientRect();
                                dstKey.style.opacity = '0';
                                var ghost = document.createElement('div');
                                ghost.textContent = num;
                                ghost.style.cssText = 'position:absolute;z-index:20;padding:4px 10px;' +
                                    'left:' + (srcRect.left - wr.left) + 'px;top:' + (srcRect.top - wr.top) + 'px;' +
                                    'font-weight:700;font-size:0.9rem;background:var(--accent);color:white;border-radius:8px;' +
                                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
                                flyEl.appendChild(ghost);
                                requestAnimationFrame(function() { requestAnimationFrame(function() {
                                    ghost.style.left = (dr.left - wr.left) + 'px';
                                    ghost.style.top = (dr.top - wr.top) + 'px';
                                }); });
                                setTimeout(function() {
                                    if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                                    if (dstKey) {
                                        dstKey.style.opacity = '1';
                                        dstKey.style.background = 'rgba(108,92,231,0.3)';
                                        dstKey.style.transform = 'scale(1.15)';
                                        dstKey.style.display = 'inline-block';
                                        setTimeout(function() {
                                            dstKey.style.background = 'rgba(0,0,0,0.05)';
                                            dstKey.style.transform = '';
                                        }, 400);
                                    }
                                }, 550);
                            }
                        },
                        undo: function() { flyEl.innerHTML = ''; restoreState(this._before); }
                    });
                    seen[num] = i;
                }
            }
            return steps;
        }

        function resetAll() {
            state.steps = [];
            state.currentStep = -1;
            flyEl.innerHTML = '';
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = '—';
            stepCounter.textContent = 'Before Start';
            prevBtn.disabled = true;
            nextBtn.disabled = false;
            nextBtn.textContent = 'Next →';
        }

        function updateUI() {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = idx <= 0;
            nextBtn.disabled = idx >= total - 1;
            if (idx >= 0) {
                stepCounter.textContent = `${idx + 1} / ${total}`;
            }
            if (idx >= total - 1) {
                nextBtn.disabled = false;
                nextBtn.textContent = '▶ Replay';
            } else {
                nextBtn.textContent = 'Next →';
            }
        }

        // Next button
        nextBtn.addEventListener('click', function() {
            // First click: build steps
            if (state.steps.length === 0) {
                renderBoxes(DEFAULT_ARR);
                ptrEl.textContent = ''; seenEl.innerHTML = '{ }'; statusEl.textContent = 'Ready to search';
                state.steps = buildSteps();
                state.currentStep = -1;
            }
            // Reset if at last step
            if (state.currentStep >= state.steps.length - 1) {
                resetAll();
                return;
            }
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        // Previous button
        prevBtn.addEventListener('click', function() {
            if (state.currentStep > 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
                updateUI();
            }
        });

        // Reset button
        container.querySelector('#arr-viz-reset').addEventListener('click', resetAll);

        // Keyboard support
        state.keydownHandler = function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') { nextBtn.click(); e.preventDefault(); }
            if (e.key === 'ArrowLeft') { prevBtn.click(); e.preventDefault(); }
        };
        document.addEventListener('keydown', state.keydownHandler);
    },

    // ===== Visualization State Management =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null, buildSteps: null },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1; s.buildSteps = null;
        // Clean up hint mini simulations
        document.querySelectorAll('.hint-step').forEach(function(step) {
            if (step._vizCtrl && step._vizCtrl.destroy) { step._vizCtrl.destroy(); step._vizCtrl = null; }
        });
    },

    _createStepDesc(suffix) {
        const s = suffix || '';
        return `<div class="viz-step-desc" data-role="desc" data-step-group="${s}" style="display:none;"></div>`;
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return `
            <div class="viz-step-controls initial-state" data-step-group="${s}">
                <button class="btn viz-step-btn viz-step-prev" data-role="prev" disabled>&larr; Prev</button>
                <span class="viz-step-counter" data-role="counter"></span>
                <button class="btn btn-primary viz-step-btn" data-role="next">Next &rarr;</button>
            </div>
        `;
    },

    // stepsOrFn: steps array or buildSteps callback function
    _initStepController(el, stepsOrFn, suffix) {
        const state = this._vizState;
        // Clean up existing keyboard handler
        if (state.keydownHandler) {
            document.removeEventListener('keydown', state.keydownHandler);
            state.keydownHandler = null;
        }
        const group = suffix || '';
        const isLazy = typeof stepsOrFn === 'function';
        state.steps = isLazy ? [] : stepsOrFn;
        state.buildSteps = isLazy ? stepsOrFn : null;
        state.currentStep = -1;

        const controls = el.querySelector(`.viz-step-controls[data-step-group="${group}"]`);
        const prevBtn = controls.querySelector('[data-role="prev"]');
        const nextBtn = controls.querySelector('[data-role="next"]');
        const counter = controls.querySelector('[data-role="counter"]');
        const desc = el.querySelector(`.viz-step-desc[data-step-group="${group}"]`);

        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            const isInitial = idx < 0;
            const isLast = total > 0 && idx >= total - 1;

            // Initial state toggle
            controls.classList.toggle('initial-state', isInitial);

            // Previous button
            prevBtn.disabled = (idx <= 0);

            // Next/restart button
            if (isLast) {
                nextBtn.innerHTML = '🔄 Restart';
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('restart-btn');
                nextBtn.disabled = false;
            } else {
                nextBtn.innerHTML = 'Next &rarr;';
                nextBtn.classList.add('btn-primary');
                nextBtn.classList.remove('restart-btn');
                nextBtn.disabled = false;
            }

            // Counter + description
            if (isInitial) {
                counter.textContent = '';
                if (desc) desc.style.display = 'none';
            } else {
                counter.textContent = `${idx + 1} / ${total}`;
                if (desc) { desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; desc.style.display = ''; }
            }
        };

        var actionDelay = 350;
        nextBtn.addEventListener('click', () => {
            // Last step → Restart
            if (state.steps.length > 0 && state.currentStep >= state.steps.length - 1) {
                while (state.currentStep >= 0) {
                    if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                    state.currentStep--;
                }
                if (state.buildSteps) state.steps = [];
                updateUI();
                return;
            }
            // Initial state + lazy → build steps
            if (state.currentStep === -1 && state.buildSteps && state.steps.length === 0) {
                state.steps = state.buildSteps();
                if (!state.steps || state.steps.length === 0) return;
            }
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            updateUI();
            setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay);
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep <= 0) {
                // Step 0, go prev → back to initial state
                var stepToUndo = state.currentStep;
                state.currentStep = -1;
                updateUI();
                setTimeout(() => {
                    if (stepToUndo === 0 && state.steps[0] && state.steps[0].undo) state.steps[0].undo();
                    if (state.buildSteps) state.steps = [];
                }, actionDelay);
                return;
            }
            var stepToUndo = state.currentStep;
            state.currentStep--;
            updateUI();
            setTimeout(() => { if (state.steps[stepToUndo] && state.steps[stepToUndo].undo) state.steps[stepToUndo].undo(); }, actionDelay);
        });

        const handleKeydown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); }
        };
        document.addEventListener('keydown', handleKeydown);
        state.keydownHandler = handleKeydown;
        updateUI();
    },

    // ===== Visualization: Best Time to Buy and Sell Stock =====
    _renderVizStock(container) {
        const self = this;
        self._clearVizState();
        const PRICES = [7, 1, 5, 3, 6, 4, 2, 8, 1];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Prices: <input type="text" id="stock-input" value="7, 1, 5, 3, 6, 4, 2, 8, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;">' +
            '<button class="viz-input-reset" id="stock-reset" title="Reset after input change">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> Checking</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Min Price</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--accent);background:rgba(108,92,231,0.15);vertical-align:middle;"></span> Best Sell</span></div>' +
            '<div id="stock-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Min Price</div>' +
            '<div id="stock-min" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Profit</div>' +
            '<div id="stock-profit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Max Profit</div>' +
            '<div id="stock-maxprofit" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        const boxes = container.querySelector('#stock-boxes');
        const minEl = container.querySelector('#stock-min');
        const profitEl = container.querySelector('#stock-profit');
        const maxProfitEl = container.querySelector('#stock-maxprofit');

        function renderBoxes(data) {
            boxes.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">Day ' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxes.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxes.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState(data) {
            return { boxClasses: Array.from(boxes.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), min: minEl.innerHTML, profit: profitEl.innerHTML, maxP: maxProfitEl.innerHTML };
        }
        function restoreState(s) {
            boxes.querySelectorAll('.str-char-box').forEach(function(b,i){ b.className = s.boxClasses[i]; });
            minEl.innerHTML = s.min; profitEl.innerHTML = s.profit; maxProfitEl.innerHTML = s.maxP;
        }

        function buildSteps() {
            var input = container.querySelector('#stock-input').value;
            var data = input.split(',').map(function(s){ return parseInt(s.trim()); }).filter(function(n){ return !isNaN(n); });
            if (data.length < 2) { data = PRICES; }
            renderBoxes(data);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';

            var minPrice = Infinity, maxProfit = 0, minIdx = -1, bestBuy = -1, bestSell = -1;
            var steps = [];

            data.forEach(function(price, i) {
                var curMin = minPrice, curMinIdx = minIdx, curMax = maxProfit, curBestBuy = bestBuy, curBestSell = bestSell;
                var newMin = false, newProfit = false;
                if (price < minPrice) { minPrice = price; minIdx = i; newMin = true; }
                var profit = price - minPrice;
                if (profit > maxProfit) { maxProfit = profit; bestBuy = minIdx; bestSell = i; newProfit = true; }
                var _i = i, _price = price, _minPrice = minPrice, _minIdx = minIdx, _profit = profit, _maxProfit = maxProfit, _newMin = newMin, _newProfit = newProfit, _bestBuy = bestBuy, _bestSell = bestSell;

                steps.push({
                    description: _newProfit ? 'Price ' + _price + ', buy at min(' + _minPrice + ') sell now → profit ' + _profit + ' → new best profit! 🎉' : _newMin ? 'Price ' + _price + ' → cheapest so far, update min! We\'ll look for a higher selling price later. 🏷️' : _profit > 0 ? 'Price ' + _price + ', buy at min(' + _minPrice + ') → profit ' + _profit + ', but not beating best (' + _maxProfit + ')' : 'Price ' + _price + ', at or below min(' + _minPrice + ') → no profit, skip',
                    _before: null,
                    action: function() {
                        this._before = saveState(data);
                        for (var j = 0; j < data.length; j++) setBoxState(j, '');
                        setBoxState(_minIdx, 'matched');
                        setBoxState(_i, 'comparing');
                        if (_bestSell >= 0 && _bestSell !== _i) setBoxState(_bestSell, 'visited');
                        minEl.innerHTML = '<strong>' + _minPrice + '</strong> (Day ' + _minIdx + ')';
                        profitEl.innerHTML = _price + ' - ' + _minPrice + ' = <strong>' + _profit + '</strong>';
                        maxProfitEl.innerHTML = '<strong>' + _maxProfit + '</strong>' + (_bestBuy >= 0 ? ' (Day ' + _bestBuy + '→' + _bestSell + ')' : '');
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#stock-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(PRICES);
            minEl.textContent = '—'; profitEl.textContent = '—'; maxProfitEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(PRICES);
        self._initStepController(container, buildSteps);
    },

    // ===== Visualization: 3Sum =====
    _renderViz3Sum(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_DATA = [-1, 0, 1, 2, -1, -4, 3, -2];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="three-input" value="-1, 0, 1, 2, -1, -4, 3, -2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;">' +
            '<button class="viz-input-reset" id="three-reset" title="Reset after input change">🔄</button></label></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid #e17055;background:rgba(225,112,85,0.2);vertical-align:middle;"></span> i (fixed)</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> L / R</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Found</span></div>' +
            '<div id="three-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="three-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Current Sum</div>' +
            '<div id="three-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:120px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Found Triplets</div>' +
            '<div id="three-results" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#three-boxes');
        var ptrEl = container.querySelector('#three-pointer');
        var sumEl = container.querySelector('#three-sum');
        var resultsEl = container.querySelector('#three-results');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, res: resultsEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; resultsEl.innerHTML=s.res;
        }

        function buildSteps() {
            var input = container.querySelector('#three-input').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 3) data = DEFAULT_DATA.slice();
            data.sort(function(a,b){return a-b;});
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';

            var steps = [];
            var foundResults = [];

            // helper: show negative in parentheses
            function fv(v) { return v < 0 ? '(' + v + ')' : '' + v; }

            // Step 1: sort
            steps.push({
                description: 'First, sort the array',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = 'Sort complete';
                    sumEl.textContent = '—'; resultsEl.textContent = '—';
                },
                undo: function() { restoreState(this._before); }
            });

            for (var i = 0; i < data.length - 2; i++) {
                // Skip duplicate i
                if (i > 0 && data[i] === data[i-1]) {
                    let _i = i;
                    steps.push({
                        description: 'i=' + _i + ' same as previous value, skip',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + ' (skip duplicate)</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    continue;
                }

                var left = i + 1, right = data.length - 1;

                // Fix i + set up pointers step
                (function(_i, _l, _r) {
                    steps.push({
                        description: 'i=' + _i + ' (' + data[_i] + ') fixed, narrowing from both sides',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_i, 'fixed');
                            setBoxState(_l, 'comparing');
                            setBoxState(_r, 'comparing');
                            ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                            sumEl.textContent = '—';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                })(i, left, right);

                while (left < right) {
                    var s = data[i] + data[left] + data[right];
                    let _i = i, _l = left, _r = right, _s = s, _match = (s === 0);
                    let _foundBefore = foundResults.slice();

                    if (_match) {
                        let _foundAfter = _foundBefore.slice();
                        _foundAfter.push('[' + data[_i] + ',' + data[_l] + ',' + data[_r] + ']');

                        steps.push({
                            description: 'Sum = 0! Triplet found! 🎉',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'matched');
                                setBoxState(_l, 'matched');
                                setBoxState(_r, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">i=' + _i + '</span> &nbsp; <span style="color:var(--green);">L=' + _l + '</span> &nbsp; <span style="color:var(--green);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong style="color:var(--green);">0</strong>';
                                resultsEl.innerHTML = _foundAfter.join(', ');
                            },
                            undo: function() { restoreState(this._before); }
                        });

                        foundResults.push('[' + data[i] + ',' + data[left] + ',' + data[right] + ']');
                        while (left < right && data[left] === data[left+1]) left++;
                        while (left < right && data[right] === data[right-1]) right--;
                        left++; right--;
                    } else if (s < 0) {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: 'Sum =' + _s + ' → Too small! Move L right',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        left++;
                    } else {
                        let _foundCopy = _foundBefore.slice();
                        steps.push({
                            description: 'Sum =' + _s + ' → Too large! Move R left',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                setBoxState(_i, 'fixed');
                                setBoxState(_l, 'comparing');
                                setBoxState(_r, 'comparing');
                                ptrEl.innerHTML = '<span style="color:#e17055;">i=' + _i + '</span> &nbsp; <span style="color:var(--yellow);">L=' + _l + '</span> &nbsp; <span style="color:var(--accent);">R=' + _r + '</span>';
                                sumEl.innerHTML = data[_i] + ' + ' + fv(data[_l]) + ' + ' + fv(data[_r]) + ' = <strong>' + _s + '</strong>';
                                resultsEl.innerHTML = _foundCopy.length > 0 ? _foundCopy.join(', ') : '—';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                        right--;
                    }
                }
            }

            // Final completion step
            var _finalResults = foundResults.slice();
            steps.push({
                description: 'Done! ' + (_finalResults.length > 0 ? _finalResults.length + ' triplet(s) found' : 'No triplets found'),
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ Search complete</span>';
                    sumEl.textContent = '—';
                    resultsEl.innerHTML = _finalResults.length > 0 ? _finalResults.join(', ') : 'None';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#three-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_DATA);
            ptrEl.textContent = ''; sumEl.textContent = '—'; resultsEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_DATA);
        self._initStepController(container, buildSteps);
    },

    // ===== Visualization: Sliding Window (Sum of Numbers) =====
    _renderVizSlidingWindow(container) {
        const self = this;
        self._clearVizState();
        const DEFAULT_ARR = [1, 2, 3, 1, 1, 2, 1, 3];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="sw-arr" value="1, 2, 3, 1, 1, 2, 1, 3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<label style="font-weight:600;">Target Sum M: <input type="number" id="sw-target" value="5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="viz-input-reset" id="sw-reset" title="Reset after input change">🔄</button></div>' +

            self._createStepDesc() +
            '<div class="sim-card" style="overflow:hidden;padding:0;">' +

            '<div style="padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:20px;">' +
            '<div style="display:flex;gap:12px;font-size:0.7rem;color:var(--text3);font-weight:600;">' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--yellow);background:rgba(253,203,110,0.2);vertical-align:middle;"></span> Window</span>' +
            '<span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;border:2px solid var(--green);background:rgba(0,184,148,0.2);vertical-align:middle;"></span> Sum = M</span></div>' +
            '<div id="sw-boxes" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="sw-pointer" style="font-size:0.95rem;font-weight:600;color:var(--text2);text-align:center;min-height:24px;"></div>' +
            '</div>' +

            '<div style="display:flex;gap:16px;padding:0 24px 24px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Subarray Sum</div>' +
            '<div id="sw-sum" style="font-weight:700;font-size:1.1rem;color:var(--text);">—</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Match Count</div>' +
            '<div id="sw-count" style="font-weight:700;font-size:1.1rem;color:var(--text);">0</div></div>' +
            '<div style="flex:1;min-width:100px;text-align:center;">' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--text3);margin-bottom:8px;">Status</div>' +
            '<div id="sw-status" style="font-weight:600;font-size:0.9rem;color:var(--text2);">—</div></div>' +
            '</div>' +

            '</div>' +
            self._createStepControls();

        var boxesEl = container.querySelector('#sw-boxes');
        var ptrEl = container.querySelector('#sw-pointer');
        var sumEl = container.querySelector('#sw-sum');
        var countEl = container.querySelector('#sw-count');
        var statusEl = container.querySelector('#sw-status');

        function renderBoxes(data) {
            boxesEl.innerHTML = '';
            data.forEach(function(v, i) {
                var box = document.createElement('div');
                box.className = 'str-char-box';
                box.dataset.idx = i;
                box.innerHTML = '<div class="str-char-idx">' + i + '</div><div class="str-char-val">' + v + '</div>';
                boxesEl.appendChild(box);
            });
        }
        function setBoxState(idx, cls) { var b = boxesEl.querySelector('[data-idx="' + idx + '"]'); if (b) b.className = 'str-char-box' + (cls ? ' ' + cls : ''); }
        function saveState() {
            return { bc: Array.from(boxesEl.querySelectorAll('.str-char-box')).map(function(b){return b.className;}), ptr: ptrEl.innerHTML, sum: sumEl.innerHTML, cnt: countEl.innerHTML, st: statusEl.innerHTML };
        }
        function restoreState(s) {
            boxesEl.querySelectorAll('.str-char-box').forEach(function(b,i){b.className=s.bc[i];}); ptrEl.innerHTML=s.ptr; sumEl.innerHTML=s.sum; countEl.innerHTML=s.cnt; statusEl.innerHTML=s.st;
        }

        function buildSteps() {
            var input = container.querySelector('#sw-arr').value;
            var data = input.split(',').map(function(s){return parseInt(s.trim());}).filter(function(n){return !isNaN(n);});
            if (data.length < 1) data = DEFAULT_ARR.slice();
            var M = parseInt(container.querySelector('#sw-target').value) || 3;
            renderBoxes(data);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';

            var steps = [];
            var start = 0, end = 0, curSum = 0, count = 0;

            // Step 0: initial state
            steps.push({
                description: 'Find contiguous subarrays summing to ' + M + ' in [' + data.join(', ') + ']!',
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">start=0</span> &nbsp; <span style="color:var(--accent);">end=0</span>';
                    sumEl.textContent = '0'; countEl.textContent = '0'; statusEl.textContent = 'Two pointers ready!';
                },
                undo: function() { restoreState(this._before); }
            });

            while (true) {
                if (curSum >= M) {
                    let _s = start, _e = end, _sum = curSum, _matched = (curSum === M);
                    if (_matched) {
                        count++;
                        // Match found step (green)
                        let _cnt = count;
                        let windowStr = '[' + data.slice(_s, _e).join(', ') + ']';
                        steps.push({
                            description: '🎉 ' + windowStr + ' = ' + _sum + ' Found! (count=' + _cnt + ')',
                            _before: null,
                            action: function() {
                                this._before = saveState();
                                for (var j = 0; j < data.length; j++) setBoxState(j, '');
                                for (var j = _s; j < _e; j++) setBoxState(j, 'matched');
                                ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                                sumEl.innerHTML = '<strong style="color:var(--green);">' + _sum + '</strong>';
                                countEl.innerHTML = '<strong style="color:var(--green);">' + _cnt + '</strong>';
                                statusEl.innerHTML = '<span style="color:var(--green);">✓ Sum =' + M + '! count++</span>';
                            },
                            undo: function() { restoreState(this._before); }
                        });
                    }
                    // Move start step
                    let _cnt2 = count, _removeVal = data[start];
                    let _sAfter = start + 1;
                    steps.push({
                        description: (_matched ? 'To find next subarray,' : 'Sum(' + _sum + ') > M(' + M + '), so') + ' remove arr[' + _s + ']=' + _removeVal + ' → move start',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            setBoxState(_s, 'removing');
                            for (var j = _sAfter; j < _e; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + ' → ' + _sAfter + '</span> &nbsp; <span style="color:var(--accent);">end=' + _e + '</span>';
                            sumEl.innerHTML = '<strong>' + (_sum - _removeVal) + '</strong>';
                            countEl.innerHTML = '<strong>' + _cnt2 + '</strong>';
                            statusEl.innerHTML = _sum + ' - ' + _removeVal + ' = ' + (_sum - _removeVal);
                        },
                        undo: function() { restoreState(this._before); }
                    });
                    curSum -= data[start]; start++;
                } else if (end >= data.length) {
                    break;
                } else {
                    let _s = start, _e = end, _val = data[end];
                    curSum += data[end]; end++;
                    let _sum = curSum, _endAfter = end;
                    let windowStr = '[' + data.slice(_s, _endAfter).join(', ') + ']';
                    let desc = 'arr[' + _e + ']=' + _val + ' added → ' + windowStr + ' Sum =' + _sum;
                    if (_sum < M) desc += ' (Less than M, keep expanding!)';
                    else if (_sum === M) desc += ' (Exact match!)';
                    steps.push({
                        description: desc, _before: null,
                        action: function() {
                            this._before = saveState();
                            for (var j = 0; j < data.length; j++) setBoxState(j, '');
                            for (var j = _s; j < _endAfter; j++) setBoxState(j, 'comparing');
                            ptrEl.innerHTML = '<span style="color:var(--green);">start=' + _s + '</span> &nbsp; <span style="color:var(--accent);">end=' + _endAfter + '</span>';
                            sumEl.innerHTML = '<strong>' + _sum + '</strong>';
                            statusEl.innerHTML = _sum < M ? 'Sum < M → expand right!' : _sum === M ? 'Sum = M! Check in next step' : 'Sum ≥ M → need to shrink';
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            }

            // Final completion step
            let _finalCount = count;
            steps.push({
                description: '✅ Search complete! Contiguous subarrays with sum ' + M + ' = total ' + _finalCount,
                _before: null,
                action: function() {
                    this._before = saveState();
                    for (var j = 0; j < data.length; j++) setBoxState(j, '');
                    ptrEl.innerHTML = '<span style="color:var(--green);">✓ Search complete</span>';
                    sumEl.textContent = '—';
                    countEl.innerHTML = '<strong style="color:var(--green);font-size:1.3rem;">' + _finalCount + '</strong>';
                    statusEl.innerHTML = '<span style="color:var(--green);font-size:1.05rem;">✓ Found ' + _finalCount + ' total!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            return steps;
        }

        // 🔄 Reset button
        container.querySelector('#sw-reset').addEventListener('click', function() {
            var state = self._vizState;
            while (state.currentStep >= 0) {
                if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo();
                state.currentStep--;
            }
            state.steps = [];
            renderBoxes(DEFAULT_ARR);
            ptrEl.textContent = ''; sumEl.textContent = '—'; countEl.textContent = '0'; statusEl.textContent = '—';
            self._initStepController(container, buildSteps);
        });

        renderBoxes(DEFAULT_ARR);
        self._initStepController(container, buildSteps);
    },

    // ===== Problems tab =====
    stages: [
        { num: 1, title: 'Min/Max', desc: 'Array traversal basics', problemIds: ['boj-10818'] },
        { num: 2, title: 'Array Basics', desc: 'Single pass, Two Pointers basics (Easy~Silver)', problemIds: ['lc-1', 'lc-121'] },
        { num: 3, title: 'Array Advanced', desc: 'Advanced Two Pointers, preprocessing (Medium~Gold)', problemIds: ['boj-2003', 'lc-15'] }
    ],

    problems: [
        {
            id: 'boj-10818',
            title: 'BOJ 10818 - Min, Max',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/10818',
            simIntro: 'Watch how we traverse the array from start to end, tracking the minimum and maximum values step by step!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N integers, write a program to find the minimum and maximum values.</p>

                <h4>Input</h4>
                <p>The first line contains the number of integers N (1 ≤ N ≤ 1,000,000). The second line contains N integers separated by spaces. All integers are between -1,000,000 and 1,000,000 inclusive.</p>

                <h4>Output</h4>
                <p>Print the minimum and maximum values separated by a space on the first line.</p>

                <div class="problem-example"><h4>Sample Input 1</h4>
                <pre>5
20 10 35 30 7</pre></div>

                <div class="problem-example"><h4>Sample Output 1</h4>
                <pre>7 35</pre></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>-1,000,000 ≤ each integer ≤ 1,000,000</li>
                </ul>
            `,
            inputDefault: 0,
            solve() { return '7 35'; },
            hints: [
                { title: 'Understanding the problem', content: '<div class="hint-key">💡 Find the smallest and largest among N integers!</div><p>Example: [20, 10, 35, 30, 7] → Min <strong>7</strong>, Max <strong>35</strong></p><p>Can we find both values in a single pass through the array?</p>' },
                { title: 'How to set initial values?', content: '<div class="hint-key">🤔 We need a baseline to compare against!</div><p>Set the first element as the <strong>initial min and max</strong>.</p><p>Since we haven\'t seen any other numbers yet, the first number is both the current minimum and maximum.</p><span class="lang-py"><pre><code class="language-python">min_val = nums[0]  # initial min\nmax_val = nums[0]  # initial max</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">int minVal = nums[0]; // initial min\nint maxVal = nums[0]; // initial max</code></pre></span>' },
                { title: 'Traverse and compare!', content: '<div class="hint-key">🔄 Compare each element from the second one onwards</div><p>For each element, check two things:</p><ul><li>Is it <strong>smaller</strong> than current min? → Update min</li><li>Is it <strong>larger</strong> than current max? → Update max</li></ul><div style="display:flex;gap:4px;align-items:end;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;flex-wrap:wrap;justify-content:center;"><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">20</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=0</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">10</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=1</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">35</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=2</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">30</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=3</div></div><div style="text-align:center;"><div style="background:#dfe6e9;color:#636e72;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;">7</div><div style="font-size:0.7rem;color:var(--text3);margin-top:2px;">i=4</div></div></div><div style="display:flex;gap:12px;justify-content:center;margin-bottom:8px;"><span style="color:#00b894;font-weight:700;">min=7</span> <span style="color:#e17055;font-weight:700;">max=35</span></div><p>This way we solve it in <strong>one pass</strong> — O(n)!</p>' },
                { title: 'There\'s an even simpler way!', content: '<div class="hint-key">💡 Most languages have built-in min/max functions!</div><span class="lang-py"><p>Python: <code>min()</code> and <code>max()</code> — pass a list and get the result instantly.</p></span><span class="lang-cpp"><p>C++: <code>*min_element()</code> and <code>*max_element()</code> — found in the <code>&lt;algorithm&gt;</code> header.</p></span><p>Built-in functions also traverse the array internally, so time complexity is the same <strong>O(n)</strong>, but the code is much shorter and more readable!</p>' }
            ],
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().split()))

# Initialize with first element, then traverse and update
min_val = nums[0]
max_val = nums[0]
for x in nums[1:]:
    if x < min_val:
        min_val = x
    if x > max_val:
        max_val = x

print(min_val, max_val)`,
                cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    // Initialize with first element, then traverse and update
    int minVal = nums[0], maxVal = nums[0];
    for (int i = 1; i < n; i++) {
        if (nums[i] < minVal) minVal = nums[i];
        if (nums[i] > maxVal) maxVal = nums[i];
    }
    cout << minVal << " " << maxVal << endl;
    return 0;
}`
            },
            solutions: [{
                approach: 'Direct Traversal',
                description: 'Traverse the array once from start to end, tracking min and max',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: 'Understanding the problem', content: '<div class="hint-key">💡 Find the smallest and largest among N integers!</div><p>Example: [20, 10, 35, 30, 7] → Min <strong>7</strong>, Max <strong>35</strong></p><p>Can we find both values in a single pass through the array?</p>' },
                    { title: 'How to set initial values?', content: '<div class="hint-key">🤔 We need a baseline to compare against!</div><p>Set the first element as the <strong>initial min and max</strong>.</p><p>Since we haven\'t seen any other numbers yet, the first number is both the current minimum and maximum.</p><span class="lang-py"><pre><code class="language-python">min_val = nums[0]  # initial min\nmax_val = nums[0]  # initial max</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">int minVal = nums[0]; // initial min\nint maxVal = nums[0]; // initial max</code></pre></span>' },
                    { title: 'Traverse and compare!', content: '<div class="hint-key">🔄 Compare each element from the second one onwards</div><p>For each element, check two things:</p><ul><li>Is it <strong>smaller</strong> than current min? → Update min</li><li>Is it <strong>larger</strong> than current max? → Update max</li></ul><p>This way we solve it in <strong>one pass</strong> — O(n)!</p>' },
                    { title: 'Output the result', content: '<div class="hint-key">✅ After traversal, min and max are determined!</div><p>Print them separated by a space and you\'re done!</p><span class="lang-py"><pre><code class="language-python">print(min_val, max_val)  # e.g., 7 35</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">cout << minVal << " " << maxVal << endl;</code></pre></span>' }
                ],
                vizMethod: '_renderVizMinMax',
                simIntro: 'Watch how we find min and max by traversing the array!',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\n\n# Initialize with first element, then traverse and update\nmin_val = nums[0]\nmax_val = nums[0]\nfor x in nums[1:]:\n    if x < min_val:\n        min_val = x\n    if x > max_val:\n        max_val = x\n\nprint(min_val, max_val)`,
                    cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n\n    // Initialize with first element, then traverse and update\n    int minVal = nums[0], maxVal = nums[0];\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < minVal) minVal = nums[i];\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }\n    cout << minVal << " " << maxVal << endl;\n    return 0;\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Read input', desc: 'Read N and the N integers.\nUsing sys.stdin.readline for speed since N can be up to 1 million!', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))' },
                        { title: 'Set initial values', desc: 'Use the first element as baseline for both min and max.\nWe\'ve only seen one number so far, so it\'s both the min and max!', code: 'min_val = nums[0]  # baseline: first element\nmax_val = nums[0]' },
                        { title: 'Traverse and compare', desc: 'Compare each element from the second one onwards.\nUpdate min/max whenever we find a smaller/larger value!', code: 'for x in nums[1:]:\n    if x < min_val:   # smaller than current min?\n        min_val = x    # → update min!\n    if x > max_val:   # larger than current max?\n        max_val = x    # → update max!' },
                        { title: 'Print result', desc: 'After traversal, min_val and max_val hold the answer!\nO(n) — we only look at each element once.', code: 'print(min_val, max_val)  # space-separated output' }
                    ],
                    cpp: [
                        { title: 'Read input', desc: 'Read N and the N integers.\nios::sync_with_stdio(false) for faster I/O!', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];' },
                        { title: 'Set initial values', desc: 'Use the first element as baseline for both min and max.', code: '    int minVal = nums[0], maxVal = nums[0];' },
                        { title: 'Traverse and compare', desc: 'Compare each element from index 1 onwards.\nTwo if-statements to track min and max simultaneously!', code: '    for (int i = 1; i < n; i++) {\n        if (nums[i] < minVal) minVal = nums[i];\n        if (nums[i] > maxVal) maxVal = nums[i];\n    }' },
                        { title: 'Print result', desc: 'O(n) single pass gives us both min and max.', code: '    cout << minVal << " " << maxVal << endl;\n    return 0;\n}' }
                    ]
                }
            }, {
                approach: 'Built-in Functions',
                description: 'Use Python min()/max() or C++ algorithm library',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: 'There\'s an easier way!', content: '<div class="hint-key">💡 Most languages have built-in functions for min/max!</div><span class="lang-py"><p>Python: <code>min()</code> and <code>max()</code> — pass a list and get the result directly.</p></span><span class="lang-cpp"><p>C++: <code>*min_element()</code> and <code>*max_element()</code> — found in the <code>&lt;algorithm&gt;</code> header.</p></span>' },
                    { title: 'Same principle internally!', content: '<p>Built-in functions also traverse the array internally. Time complexity is the same <strong>O(n)</strong>.</p><p>Same performance as manual traversal, but much shorter and more readable code!</p>' }
                ],
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))\n\n# Simple with built-in min() and max()!\nprint(min(nums), max(nums))`,
                    cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n\n    // Simple with min_element and max_element!\n    cout << *min_element(nums.begin(), nums.end()) << " "\n         << *max_element(nums.begin(), nums.end()) << endl;\n    return 0;\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Read input', desc: 'Same input reading as before.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\nnums = list(map(int, input().split()))' },
                        { title: 'Use built-in functions!', desc: 'min() returns the smallest, max() returns the largest.\nInternally O(n) traversal — same performance, shorter code!', code: 'print(min(nums), max(nums))  # one line!' }
                    ],
                    cpp: [
                        { title: 'Read input', desc: 'Same input reading as before.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>  // min_element, max_element\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];' },
                        { title: 'Use algorithm functions!', desc: 'min_element/max_element return iterators → dereference with *.\nInternally O(n) traversal — same performance, shorter code!', code: '    cout << *min_element(nums.begin(), nums.end()) << " "\n         << *max_element(nums.begin(), nums.end()) << endl;\n    return 0;\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-1',
            title: 'LeetCode 1 - Two Sum',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/two-sum/',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an array of integers <code>nums</code> and an integer <code>target</code>,
                return <strong>indices of the two numbers</strong> such that they add up to <code>target</code>.</p>
                <p>You may not use the same element twice, and exactly one answer exists.
                You may return the answer in any order.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [2,7,11,15], target = 9</pre></div>
                    <div><strong>Output</strong><pre>[0, 1]</pre></div>
                </div>
                <p class="example-explain">Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [3,2,4], target = 6</pre></div>
                    <div><strong>Output</strong><pre>[1, 2]</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [3,3], target = 6</pre></div>
                    <div><strong>Output</strong><pre>[0, 1]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
                    <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
                    <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
                    <li>Exactly one valid answer exists.</li>
                </ul>

                <div class="hint-key">💡 Follow-up</div>
                <p>Can you come up with an algorithm that is better than O(n²)?</p>
            `,
            inputDefault: 0,
            solve() { return '[0, 1]'; },
            hints: [
                { title: 'First thought: Nested loops', content: '<div class="hint-key">💡 Simplest approach: Check every pair!</div><p>Compare all two-number combinations in the array one by one.</p><span class="lang-py"><pre><code class="language-python">for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">for (int i = 0; i < nums.size(); i++)\n    for (int j = i+1; j < nums.size(); j++)\n        if (nums[i] + nums[j] == target)\n            return {i, j};</code></pre></span>' },
                {
                    title: 'Try it — how many comparisons does brute force take?',
                    content: '<div class="hint-key">🔍 Let\'s try Brute Force!</div><div class="hint-sub">Tap to compare each pair one by one</div>',
                    viz: function(container) {
                        var nums = [1, 3, 4, 9, 2, 7], target = 9;
                        container.setAttribute('data-clickable', '');
                        container.innerHTML =
                            '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                            '<div class="hint-viz-cells"></div>' +
                            '<div class="hint-viz-msg"></div>' +
                            '<div class="hint-viz-tap">👆 Tap for next comparison</div>' +
                            '<div class="hint-viz-replay" style="display:none"><button>▶ Restart</button></div>';
                        var cellsEl = container.querySelector('.hint-viz-cells');
                        var msgEl = container.querySelector('.hint-viz-msg');
                        var tapEl = container.querySelector('.hint-viz-tap');
                        var replayEl = container.querySelector('.hint-viz-replay');
                        nums.forEach(function(v, i) {
                            var cell = document.createElement('div');
                            cell.className = 'hint-viz-cell';
                            cell.dataset.idx = i;
                            cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                            cellsEl.appendChild(cell);
                        });
                        function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                        function clearCells() {
                            cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                        }
                        var pairs = [];
                        for (var i = 0; i < nums.length; i++) {
                            for (var j = i + 1; j < nums.length; j++) {
                                pairs.push([i, j]);
                                if (nums[i] + nums[j] === target) { i = nums.length; break; }
                            }
                        }
                        var si = 0, done = false, timer = null;
                        function advance() {
                            if (done) return;
                            if (si >= pairs.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                            var pi = pairs[si][0], pj = pairs[si][1];
                            var sum = nums[pi] + nums[pj];
                            var isMatch = sum === target;
                            var c = si + 1;
                            clearCells();
                            getCell(pi).classList.add('comparing');
                            getCell(pj).classList.add('comparing');
                            msgEl.innerHTML = '<span style="color:var(--text3)">#' + c + '</span> i=' + pi + ', j=' + pj + ': <strong>' + nums[pi] + ' + ' + nums[pj] + ' = ' + sum + '</strong>';
                            clearTimeout(timer);
                            timer = setTimeout(function() {
                                if (isMatch) {
                                    getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                    getCell(pi).classList.add('matched'); getCell(pj).classList.add('matched');
                                    msgEl.innerHTML = '<span class="viz-result">✅ Found! [' + pi + ', ' + pj + '] — ' + c + ' comparisons</span>';
                                    done = true; tapEl.style.display = 'none'; replayEl.style.display = '';
                                } else {
                                    getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                    getCell(pi).classList.add('mismatch'); getCell(pj).classList.add('mismatch');
                                    msgEl.innerHTML += ' ❌';
                                }
                            }, 400);
                            si++;
                        }
                        function reset() {
                            clearTimeout(timer); si = 0; done = false;
                            clearCells(); msgEl.innerHTML = '';
                            tapEl.style.display = ''; replayEl.style.display = 'none';
                        }
                        container.addEventListener('click', function(e) {
                            if (e.target.closest('.hint-viz-replay')) return;
                            advance();
                        });
                        replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                        return {
                            stop: function() { clearTimeout(timer); },
                            reset: function() { reset(); },
                            play: function() {},
                            destroy: function() { clearTimeout(timer); }
                        };
                    }
                },
                { title: 'Problem: Too slow!', content: '<p>With n = <strong>10,000</strong>, that\'s about <strong>50 million</strong> comparisons! 😱</p><p>Scanning all remaining numbers for each element leads to time limit exceeded.</p><div class="hint-key">💡 "What if we could remember the numbers we\'ve already seen?"</div><p>Key insight: for each number, calculate <strong>target - num = complement</strong>,<br>and check if the complement exists in a <strong>hash map — O(1) lookup</strong>!</p>' },
                {
                    title: 'Hash map does it in one pass!',
                    content: '<div class="hint-key">✨ Find the "complement" with a hash map</div><div class="hint-sub">For each number, instantly check if its complement was seen before!<br>Brute force: 15 comparisons vs hash map: how many? Tap to compare!</div>',
                    viz: function(container) {
                        var nums = [1, 3, 4, 9, 2, 7], target = 9;
                        container.setAttribute('data-clickable', '');
                        container.innerHTML =
                            '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                            '<div class="hint-viz-split">' +
                            '  <div><div class="hint-viz-label" style="margin-bottom:4px">Array</div><div class="hint-viz-cells"></div></div>' +
                            '  <div><div class="hint-viz-label" style="margin-bottom:4px">seen { }</div><div class="hint-viz-hashmap"></div></div>' +
                            '</div>' +
                            '<div class="hint-viz-msg"></div>' +
                            '<div class="hint-viz-tap">👆 Tap for next step</div>' +
                            '<div class="hint-viz-replay" style="display:none"><button>▶ Restart</button></div>';
                        var cellsEl = container.querySelector('.hint-viz-cells');
                        var hmEl = container.querySelector('.hint-viz-hashmap');
                        var msgEl = container.querySelector('.hint-viz-msg');
                        var tapEl = container.querySelector('.hint-viz-tap');
                        var replayEl = container.querySelector('.hint-viz-replay');
                        nums.forEach(function(v, i) {
                            var cell = document.createElement('div');
                            cell.className = 'hint-viz-cell';
                            cell.dataset.idx = i;
                            cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                            cellsEl.appendChild(cell);
                        });
                        function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                        function clearCells() {
                            cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                        }
                        function addHmRow(key, val) {
                            var row = document.createElement('div');
                            row.className = 'hm-row';
                            row.dataset.key = key;
                            row.innerHTML = '<span class="hm-key">' + key + '</span><span class="hm-val">→ ' + val + '</span>';
                            hmEl.appendChild(row);
                        }
                        function clearHmHighlight() {
                            hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.remove('hm-found', 'hm-miss'); });
                        }
                        function highlightHmRow(key, found) {
                            clearHmHighlight();
                            if (found) {
                                var row = hmEl.querySelector('[data-key="' + key + '"]');
                                if (row) row.classList.add('hm-found');
                            } else {
                                hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.add('hm-miss'); });
                            }
                        }
                        var steps = [], seen = {}, foundI = -1, foundJ = -1;
                        for (var idx = 0; idx < nums.length; idx++) {
                            (function(i) {
                                var num = nums[i], comp = target - num;
                                if (seen.hasOwnProperty(comp)) {
                                    foundI = seen[comp]; foundJ = i;
                                    steps.push(function() {
                                        clearCells(); getCell(i).classList.add('current');
                                        highlightHmRow(comp, true);
                                        msgEl.innerHTML = 'Complement of <strong>' + num + '</strong> = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 Check seen… ✨ <strong>Found!</strong>';
                                    });
                                    steps.push(function() {
                                        clearHmHighlight();
                                        getCell(foundI).classList.add('matched');
                                        getCell(i).classList.remove('current'); getCell(i).classList.add('matched');
                                        msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — Just ' + (i + 1) + ' lookups! (brute force needed 15)</span>';
                                    });
                                } else {
                                    steps.push(function() {
                                        clearCells(); getCell(i).classList.add('current');
                                        highlightHmRow(comp, false);
                                        msgEl.innerHTML = 'Complement of <strong>' + num + '</strong> = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 Check seen… Not found';
                                    });
                                    steps.push(function() {
                                        clearHmHighlight();
                                        addHmRow(num, i);
                                        msgEl.innerHTML = 'Remember ' + num + ' → seen[' + num + '] = ' + i;
                                    });
                                    seen[num] = i;
                                }
                                if (foundJ >= 0) return;
                            })(idx);
                            if (foundJ >= 0) break;
                        }
                        var si = 0, done = false;
                        function advance() {
                            if (done) return;
                            if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                            steps[si]();
                            si++;
                            if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; }
                        }
                        function reset() {
                            si = 0; done = false;
                            clearCells(); hmEl.innerHTML = ''; msgEl.innerHTML = '';
                            tapEl.style.display = ''; replayEl.style.display = 'none';
                            steps = []; seen = {}; foundI = -1; foundJ = -1;
                            for (var idx2 = 0; idx2 < nums.length; idx2++) {
                                (function(i) {
                                    var num = nums[i], comp = target - num;
                                    if (seen.hasOwnProperty(comp)) {
                                        foundI = seen[comp]; foundJ = i;
                                        steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, true); msgEl.innerHTML = 'Complement of <strong>' + num + '</strong> = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 Check seen… ✨ <strong>Found!</strong>'; });
                                        steps.push(function() { clearHmHighlight(); getCell(foundI).classList.add('matched'); getCell(i).classList.remove('current'); getCell(i).classList.add('matched'); msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — Just ' + (i + 1) + ' lookups! (brute force needed 15)</span>'; });
                                    } else {
                                        steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, false); msgEl.innerHTML = 'Complement of <strong>' + num + '</strong> = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 Check seen… Not found'; });
                                        steps.push(function() { clearHmHighlight(); addHmRow(num, i); msgEl.innerHTML = 'Remember ' + num + ' → seen[' + num + '] = ' + i; });
                                        seen[num] = i;
                                    }
                                    if (foundJ >= 0) return;
                                })(idx2);
                                if (foundJ >= 0) break;
                            }
                        }
                        container.addEventListener('click', function(e) {
                            if (e.target.closest('.hint-viz-replay')) return;
                            advance();
                        });
                        replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                        return {
                            stop: function() {},
                            reset: function() { reset(); },
                            play: function() {},
                            destroy: function() {}
                        };
                    }
                }
            ],
            templates: {
                python: `class Solution:
    def twoSum(self, nums, target):
        seen = {}  # value → index
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
                cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all pairs with nested loops to find a pair that sums to target',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                hints: [
                    { title: 'First thought: Nested loops', content: '<div class="hint-key">💡 Simplest approach: Check every pair!</div><p>Compare all two-number combinations in the array one by one.</p><span class="lang-py"><pre><code class="language-python">for i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            return [i, j]</code></pre></span><span class="lang-cpp"><pre><code class="language-cpp">for (int i = 0; i < nums.size(); i++)\n    for (int j = i+1; j < nums.size(); j++)\n        if (nums[i] + nums[j] == target)\n            return {i, j};</code></pre></span>' },
                    {
                        title: 'Try it yourself',
                        content: '<div class="hint-key">🔍 Find it with Brute Force!</div><div class="hint-sub">Tap to compare one pair at a time</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-cells"></div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 Tap for next comparison</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ From start</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            // Generate all brute force pairs
                            var pairs = [];
                            for (var i = 0; i < nums.length; i++) {
                                for (var j = i + 1; j < nums.length; j++) {
                                    pairs.push([i, j]);
                                    if (nums[i] + nums[j] === target) { i = nums.length; break; }
                                }
                            }
                            var si = 0, done = false, timer = null;
                            function advance() {
                                if (done) return;
                                if (si >= pairs.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                var pi = pairs[si][0], pj = pairs[si][1];
                                var sum = nums[pi] + nums[pj];
                                var isMatch = sum === target;
                                var c = si + 1;
                                // Compare: yellow highlight
                                clearCells();
                                getCell(pi).classList.add('comparing');
                                getCell(pj).classList.add('comparing');
                                msgEl.innerHTML = '<span style="color:var(--text3)">#' + c + '</span> i=' + pi + ', j=' + pj + ': <strong>' + nums[pi] + ' + ' + nums[pj] + ' = ' + sum + '</strong>';
                                // Show result after short delay
                                clearTimeout(timer);
                                timer = setTimeout(function() {
                                    if (isMatch) {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('matched'); getCell(pj).classList.add('matched');
                                        msgEl.innerHTML = '<span class="viz-result">✅ Found! [' + pi + ', ' + pj + '] — ' + c + ' comparisons</span>';
                                        done = true; tapEl.style.display = 'none'; replayEl.style.display = '';
                                    } else {
                                        getCell(pi).classList.remove('comparing'); getCell(pj).classList.remove('comparing');
                                        getCell(pi).classList.add('mismatch'); getCell(pj).classList.add('mismatch');
                                        msgEl.innerHTML += ' ❌';
                                    }
                                }, 400);
                                si++;
                            }
                            function reset() {
                                clearTimeout(timer); si = 0; done = false;
                                clearCells(); msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() { clearTimeout(timer); },
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() { clearTimeout(timer); }
                            };
                        }
                    }
                ],
                limitation: '<p>If n is <strong>10,000</strong>, that\'s about <strong>50 million</strong> comparisons! 😱</p><p>Having to scan all remaining numbers every time causes TLE.</p><div class="hint-key">💡 "What if we could remember numbers we\'ve already seen?"</div>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        for i in range(len(nums)):\n            for j in range(i + 1, len(nums)):\n                if nums[i] + nums[j] == target:\n                    return [i, j]`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        for (int i = 0; i < nums.size(); i++) {\n            for (int j = i + 1; j < nums.size(); j++) {\n                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Pick first number', desc: 'Fix the first number one at a time\nto check all possible pairs.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        # Check all pairs (i, j) → O(n²)\n        for i in range(len(nums)):' },
                        { title: 'Search second number', desc: 'Only check numbers after i.\nStarting from j = i+1 → never check the same pair twice!', code: '            for j in range(i + 1, len(nums)):' },
                        { title: 'Check sum + return', desc: 'If the two numbers sum to target, return indices immediately!\nThe problem guarantees "exactly one answer exists", so we can return right away.', code: '                if nums[i] + nums[j] == target:\n                    return [i, j]' }
                    ],
                    cpp: [
                        { title: 'Pick first number', desc: 'Fix i to check all pairs.\nO(n²) but the most intuitive approach.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Check all pairs (i, j) → O(n²)\n        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'Search second number', desc: 'Start from j = i+1 → never check the same pair twice', code: '            for (int j = i + 1; j < nums.size(); j++) {' },
                        { title: 'Check sum + return', desc: 'If sum equals target, return immediately!', code: '                if (nums[i] + nums[j] == target)\n                    return {i, j};\n            }\n        }\n        return {};\n    }\n};' }
                    ]
                }
            }, {
                approach: 'HashMap',
                description: 'Single pass using a hash map (dictionary) to check for complement',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                hints: [
                    { title: 'Key idea: Remember the "complement"!', content: '<div class="hint-key">💡 target - num = complement</div><p>For each number, calculate <strong>target - that number = complement</strong>,<br>then check if the complement exists among previously seen numbers using a <strong>hash map in O(1)</strong>!</p>' },
                    {
                        title: 'HashMap in one pass!',
                        content: '<div class="hint-key">✨ Find the "complement" with a hash map</div><div class="hint-sub">Instantly check if each number\'s complement has already appeared!<br>Brute force: 15 comparisons vs hash map: how many? Tap to compare!</div>',
                        viz: function(container) {
                            var nums = [1, 3, 4, 9, 2, 7], target = 9;
                            container.setAttribute('data-clickable', '');
                            container.innerHTML =
                                '<div class="hint-viz-label">nums = [1, 3, 4, 9, 2, 7], target = 9</div>' +
                                '<div class="hint-viz-split">' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">Array</div><div class="hint-viz-cells"></div></div>' +
                                '  <div><div class="hint-viz-label" style="margin-bottom:4px">seen { }</div><div class="hint-viz-hashmap"></div></div>' +
                                '</div>' +
                                '<div class="hint-viz-msg"></div>' +
                                '<div class="hint-viz-tap">👆 Tap for next step</div>' +
                                '<div class="hint-viz-replay" style="display:none"><button>▶ From start</button></div>';
                            var cellsEl = container.querySelector('.hint-viz-cells');
                            var hmEl = container.querySelector('.hint-viz-hashmap');
                            var msgEl = container.querySelector('.hint-viz-msg');
                            var tapEl = container.querySelector('.hint-viz-tap');
                            var replayEl = container.querySelector('.hint-viz-replay');
                            nums.forEach(function(v, i) {
                                var cell = document.createElement('div');
                                cell.className = 'hint-viz-cell';
                                cell.dataset.idx = i;
                                cell.innerHTML = '<div class="viz-idx">' + i + '</div><div class="viz-val">' + v + '</div>';
                                cellsEl.appendChild(cell);
                            });
                            function getCell(i) { return cellsEl.querySelector('[data-idx="' + i + '"]'); }
                            function clearCells() {
                                cellsEl.querySelectorAll('.hint-viz-cell').forEach(function(c) { c.className = 'hint-viz-cell'; });
                            }
                            function addHmRow(key, val) {
                                var row = document.createElement('div');
                                row.className = 'hm-row';
                                row.dataset.key = key;
                                row.innerHTML = '<span class="hm-key">' + key + '</span><span class="hm-val">→ ' + val + '</span>';
                                hmEl.appendChild(row);
                            }
                            function clearHmHighlight() {
                                hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.remove('hm-found', 'hm-miss'); });
                            }
                            function highlightHmRow(key, found) {
                                clearHmHighlight();
                                if (found) {
                                    var row = hmEl.querySelector('[data-key="' + key + '"]');
                                    if (row) row.classList.add('hm-found');
                                } else {
                                    hmEl.querySelectorAll('.hm-row').forEach(function(r) { r.classList.add('hm-miss'); });
                                }
                            }
                            // Pre-generate steps
                            var steps = [], seen = {}, foundI = -1, foundJ = -1;
                            for (var idx = 0; idx < nums.length; idx++) {
                                (function(i) {
                                    var num = nums[i], comp = target - num;
                                    if (seen.hasOwnProperty(comp)) {
                                        foundI = seen[comp]; foundJ = i;
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, true);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… ✨ <strong>Found!</strong>';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            getCell(foundI).classList.add('matched');
                                            getCell(i).classList.remove('current'); getCell(i).classList.add('matched');
                                            msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — just' + (i + 1) + ' lookups and done! (brute force needed 15)</span>';
                                        });
                                    } else {
                                        steps.push(function() {
                                            clearCells(); getCell(i).classList.add('current');
                                            highlightHmRow(comp, false);
                                            msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… None';
                                        });
                                        steps.push(function() {
                                            clearHmHighlight();
                                            addHmRow(num, i);
                                            msgEl.innerHTML = num + ' not found, remember it → seen[' + num + '] = ' + i;
                                        });
                                        seen[num] = i;
                                    }
                                    if (foundJ >= 0) return;
                                })(idx);
                                if (foundJ >= 0) break;
                            }
                            var si = 0, done = false;
                            function advance() {
                                if (done) return;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; return; }
                                steps[si]();
                                si++;
                                if (si >= steps.length) { done = true; tapEl.style.display = 'none'; replayEl.style.display = ''; }
                            }
                            function reset() {
                                si = 0; done = false;
                                clearCells(); hmEl.innerHTML = ''; msgEl.innerHTML = '';
                                tapEl.style.display = ''; replayEl.style.display = 'none';
                                // Regenerate steps (reset seen)
                                steps = []; seen = {}; foundI = -1; foundJ = -1;
                                for (var idx2 = 0; idx2 < nums.length; idx2++) {
                                    (function(i) {
                                        var num = nums[i], comp = target - num;
                                        if (seen.hasOwnProperty(comp)) {
                                            foundI = seen[comp]; foundJ = i;
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, true); msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… ✨ <strong>Found!</strong>'; });
                                            steps.push(function() { clearHmHighlight(); getCell(foundI).classList.add('matched'); getCell(i).classList.remove('current'); getCell(i).classList.add('matched'); msgEl.innerHTML = '<span class="viz-result">✅ Answer! [' + foundI + ', ' + i + '] — just' + (i + 1) + ' lookups and done! (brute force needed 15)</span>'; });
                                        } else {
                                            steps.push(function() { clearCells(); getCell(i).classList.add('current'); highlightHmRow(comp, false); msgEl.innerHTML = '<strong>' + num + '</strong>\\\'s complement = ' + target + ' - ' + num + ' = <strong>' + comp + '</strong> → 🔍 searching seen… None'; });
                                            steps.push(function() { clearHmHighlight(); addHmRow(num, i); msgEl.innerHTML = num + ' not found, remember it → seen[' + num + '] = ' + i; });
                                            seen[num] = i;
                                        }
                                        if (foundJ >= 0) return;
                                    })(idx2);
                                    if (foundJ >= 0) break;
                                }
                            }
                            container.addEventListener('click', function(e) {
                                if (e.target.closest('.hint-viz-replay')) return;
                                advance();
                            });
                            replayEl.querySelector('button').addEventListener('click', function() { reset(); });
                            return {
                                stop: function() {},
                                reset: function() { reset(); },
                                play: function() {},
                                destroy: function() {}
                            };
                        }
                    }
                ],
                vizMethod: '_renderVizTwoSum',
                simIntro: 'Watch step-by-step how the hash map finds the complement!',
                comparison: '<p><strong>O(n²) → O(n)</strong> — trading space (hash map) for time!</p><p>Brute force needed 15 comparisons, but hash map finds the answer in just <strong>6</strong> lookups.</p>',
                templates: {
                    python: `class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # value → index\n        for i, num in enumerate(nums):\n            complement = target - num\n            if complement in seen:\n                return [seen[complement], i]\n            seen[num] = i`,
                    cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize hash map', desc: 'Key idea: check "Have I seen this number before?" in O(1)!\nStore {value: index} in a dictionary.', code: 'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}  # {value: index} → O(1) lookup' },
                        { title: 'Iterate array', desc: 'enumerate gives both index (i) and value (num) at once.', code: '        for i, num in enumerate(nums):' },
                        { title: 'Compute complement + check', desc: 'Key: target - num = "complement"!\nIf complement is already in seen → answer found!\nHash map lookup is O(1), so overall O(n).', code: '            complement = target - num  # compute complement\n            if complement in seen:      # O(1) lookup!\n                return [seen[complement], i]' },
                        { title: 'Store current value', desc: 'If complement not found, record the current value.\n→ Future numbers may find this value as their complement!', code: '            seen[num] = i  # store so future numbers can find it' }
                    ],
                    cpp: [
                        { title: 'Initialize hash map', desc: 'unordered_map → O(1) lookup!\nStore {value: index} to quickly find complements.', code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen; // {value: index}' },
                        { title: 'Iterate array', desc: 'Loop through indices and values with a for loop.', code: '        for (int i = 0; i < nums.size(); i++) {' },
                        { title: 'Compute complement + check', desc: 'Key: target - nums[i] = complement!\nIf complement exists in seen, return answer (O(1) lookup).', code: '            int comp = target - nums[i]; // complement\n            if (seen.count(comp)) return {seen[comp], i};' },
                        { title: 'Store current value + finish', desc: 'If not found, record current value → future numbers can find it', code: '            seen[nums[i]] = i; // store so it can be found later\n        }\n        return {};\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-121',
            title: 'LeetCode 121 - Best Time to Buy and Sell Stock',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            simIntro: 'Watch step-by-step how we track the minimum price and compute profit!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>You are given an array <code>prices</code> where
                <code>prices[i]</code> is the price of a given stock on the i-th day.</p>
                <p>You want to maximize your profit by choosing a <strong>single day to buy</strong> and a different day in the future to sell.
                Return the <strong>maximum profit</strong>. If no profit is possible, return <code>0</code>.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>prices = [7,1,5,3,6,4]</pre></div>
                    <div><strong>Output</strong><pre>5</pre></div>
                </div>
                <p class="example-explain">Buy on day 1 (price = 1) and sell on day 4 (price = 6), profit = 6 - 1 = 5</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>prices = [7,6,4,3,1]</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div>
                <p class="example-explain">Prices keep falling, so no profit is possible.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ prices.length ≤ 10⁵</li>
                    <li>0 ≤ prices[i] ≤ 10⁴</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it in a single pass through the array?</p>
            `,
            hints: [
                { title: 'First Thought: How to Solve?', content: 'You must buy on some day and sell on a later day. The simplest approach? A double for loop checking all (buy day, sell day) combinations!<br><code>profit = prices[j] - prices[i]</code> (j &gt; i) find the maximum.' },
                { title: 'Let\'s Try It!', content: 'Let\'s try with <code>prices = [7, 1, 5, 3, 6, 4]</code>:<br>• Buy at 7? → 1(-6), 5(-2), 3(-4), 6(-1), 4(-3) → all losses!<br>• Buy at 1? → 5(+4), 3(+2), 6(<strong>+5</strong>), 4(+3) → max +5!<br>• Check the rest... buying at 1 and selling at 6 is the best.' },
                { title: 'Problem Found!', content: 'A double for loop is <strong>O(n²)</strong>. With n = 100,000, that\'s about 5 billion operations!<div style="display:flex;gap:14px;margin:14px 0;align-items:end;justify-content:center;"><div style="text-align:center;"><div style="background:#ff6b6b;width:52px;height:90px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:6px;color:white;font-size:0.8rem;font-weight:700;">O(n²)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">double for</div></div><div style="text-align:center;"><div style="background:#51cf66;width:52px;height:18px;border-radius:8px;display:flex;align-items:end;justify-content:center;padding-bottom:4px;color:white;font-size:0.8rem;font-weight:700;">O(n)</div><div style="font-size:0.75rem;margin-top:4px;color:var(--text3);">single pass</div></div></div>Key observation: When selling on any day, the maximum profit comes from <strong>"buying at the lowest price seen so far"</strong>.<br>So we just need to track the minimum price seen so far as we iterate!' },
                { title: 'A Better Approach!', content: 'Iterate through the array <strong>just once</strong>:<br>• <code>min_price</code>: Track the lowest price seen so far<br>• <code>max_profit</code>: Track the maximum profit so far<br><br>If <code>price - min_price</code> is greater than the current max profit, update it.' },
                { title: 'Key Idea Summary', content: '"State tracking" pattern using just 2 variables:<br>① <code>min_price = min(min_price, price)</code> — Update the lowest price so far<br>② <code>max_profit = max(max_profit, price - min_price)</code> — Update the maximum profit<br><br><strong>O(n²) → O(n) time, O(1) space</strong> — Solved with just variables, no extra data structures!' }
            ],
            inputDefault: 0,
            solve() { return '5'; },
            templates: {
                python: `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
                cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = INT_MAX, maxP = 0;
        for (int p : prices) {
            minP = min(minP, p);
            maxP = max(maxP, p - minP);
        }
        return maxP;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all (buy day, sell day) combinations with a double for loop',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0\n        for i in range(len(prices)):\n            for j in range(i + 1, len(prices)):\n                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0;\n        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {\n                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Max Profit', desc: 'Start at 0 for the case when no profit is possible.\nThe problem says "return 0 if no profit"!', code: 'class Solution:\n    def maxProfit(self, prices):\n        max_profit = 0  # return 0 if no profit' },
                        { title: 'Select Buy Day', desc: 'Try buying on each day i.\nConsider every day as a potential buy day.', code: '        for i in range(len(prices)):' },
                        { title: 'Search Sell Day', desc: 'Can only sell after buy day, so j starts from i+1.\nCan\'t go back in time to sell!', code: '            for j in range(i + 1, len(prices)):' },
                        { title: 'Calculate Profit + Update Max', desc: '(sell price - buy price) and update max profit.\nO(n²) — slow because it checks all pairs', code: '                profit = prices[j] - prices[i]\n                max_profit = max(max_profit, profit)\n        return max_profit' }
                    ],
                    cpp: [
                        { title: 'Initialize', desc: 'Start at 0 to return 0 if no profit', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0; // 0 if no profit' },
                        { title: 'Double For Loop', desc: 'Check all (buy day i, sell day j) combos.\nj = i+1 → can\'t sell in the past', code: '        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {' },
                        { title: 'Calculate Profit + Return', desc: 'Update max of (sell - buy) and return', code: '                maxP = max(maxP, prices[j] - prices[i]);\n            }\n        }\n        return maxP;\n    }\n};' }
                    ]
                }
            }, {
                approach: 'Single Pass',
                description: 'Track minimum price and calculate max profit from the difference with current price',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            min_price = min(min_price, price)\n            max_profit = max(max_profit, price - min_price)\n        return max_profit`,
                    cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Variables', desc: 'Key idea: Remember "the cheapest day so far"!\nmin_price = ∞ → any price will update it initially.\nmax_profit = 0 → return 0 if no profit.', code: 'class Solution:\n    def maxProfit(self, prices):\n        min_price = float(\'inf\')  # lowest price seen so far\n        max_profit = 0             # max profit' },
                        { title: 'Iterate Prices', desc: 'Solved in a single pass! O(n)\nFor each day\'s price, ask "what if I sell today?"', code: '        for price in prices:' },
                        { title: 'Update Minimum', desc: 'If today\'s price is lower than the lowest so far, update it.\n→ Future days can buy at this price and sell later!', code: '            min_price = min(min_price, price)  # Update min price' },
                        { title: 'Calculate Profit', desc: 'Key: "What if I sell today?" → price - min_price\nIf this exceeds the current max profit, update it.', code: '            max_profit = max(max_profit, price - min_price)  # What if I sell today?' },
                        { title: 'Return Result', desc: 'Found the maximum profit in a single pass!\nO(n) time, O(1) space — optimal solution.', code: '        return max_profit' }
                    ],
                    cpp: [
                        { title: 'Initialize variables', desc: 'Key: Remember "the cheapest day so far"!\nINT_MAX → any price will update it initially.', code: 'class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0; // min price, max profit' },
                        { title: 'Iterate + Update Minimum', desc: 'Update min price at each step.\n→ Future days can buy at this price', code: '        for (int p : prices) {\n            minP = min(minP, p); // update min price' },
                        { title: 'Calculate Profit + Result', desc: '"What if I sell today?" → p - minP\nO(n) single pass for optimal solution.', code: '            maxP = max(maxP, p - minP); // what if I sell today?\n        }\n        return maxP;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'boj-2003',
            title: 'BOJ 2003 - Sum of Numbers 2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2003',
            simIntro: 'Watch how the sliding window maintains the sum as it moves!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a sequence of N numbers,
                find the number of <strong>contiguous subsequences</strong> whose sum equals M.</p>
                <h4>Input</h4>
                <p>The first line contains N (1 &le; N &le; 10,000) and M (1 &le; M &le; 300,000,000). The next line contains A[1], A[2], ..., A[N] separated by spaces. Each A[x] is a natural number not exceeding 30,000.</p>
                <h4>Output</h4>
                <p>Print the number of cases on the first line.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>N = 4, M = 2
sequence =[1, 1, 1, 1]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[1,1](index 0~1), [1,1](1~2), [1,1](2~3) → 3 total</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>N = 10, M = 5
sequence =[1, 2, 3, 4, 2, 5, 3, 1, 1, 2]</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">[2,3](index 1~2), [3,2](3~4), [5](5) → 3 total</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10,000</li>
                    <li>1 ≤ M ≤ 300,000,000</li>
                    <li>Each element of the sequence is a natural number (≥ 1)</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it faster than O(n²)? (Two Pointers / Sliding Window)</p>
            `,
            hints: [
                {
                    title: 'What is a contiguous subarray sum?',
                    content: `<strong>"Sum of consecutive numbers"</strong> is the key. You can\'t pick any numbers you want — only <strong>adjacent numbers</strong> can be summed!
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:16px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=2?'#6c5ce7':'#dfe6e9'};color:${i>=1&&i<=2?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="font-weight:600;">[2, 3] → Sum =<strong style="color:var(--green);">5</strong> ✅ Contiguous — OK!</div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin:12px 0;padding:12px;background:rgba(255,118,117,0.08);border-radius:10px;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i===0||i===3?'#e17055':'#dfe6e9'};color:${i===0||i===3?'white':'#636e72'};border-radius:8px;font-weight:700;font-size:1.1em;">${v}</span>`).join('')}
                        </div>
                        <div style="color:#e17055;font-weight:600;">[1, 4] → Sum = 5 but ❌ not adjacent — doesn't count!</div>
                    </div>
                    <p style="margin-top:16px;padding:10px 14px;background:rgba(253,203,110,0.15);border-radius:8px;font-size:0.92em;">Check all contiguous ranges and count those with sum = M! 🤔<br>But how do we check all contiguous ranges?</p>`
                },
                {
                    title: 'Easiest approach: Try everything!',
                    content: `From every starting point, expand one at a time and compute the sum.<br>Why? Since it\'s <strong>contiguous, once you fix the start, you just extend the end one by one and check the sum</strong>!
                    <div style="margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;font-size:0.9em;line-height:1.8;border:1px solid var(--bg3);">
                        <code>[1, 2, 3, 4, 2]</code>, M=5:<br>
                        • From i=0: [1]=1, [1,2]=3, [1,2,3]=6... can't find 5<br>
                        • From i=1: [2]=2, [<strong>2,3</strong>]=<strong style="color:var(--green);">5 ✅</strong><br>
                        • From i=2: [3]=3, [3,4]=7... can't find 5<br>
                        • From i=3: [4]=4, [<strong>4,2</strong>... that's 6] can't find 5<br>
                        • Wait, [5] alone is 5! → at i=5... hmm, there might be some we missed..
                    </div>
                    <p style="margin-top:10px;">This is doable with <strong>nested for loops</strong>. But...</p>
                    <p style="margin-top:8px;padding:10px 14px;background:rgba(255,118,117,0.1);border-radius:8px;font-size:0.92em;color:#e17055;">⏱ Time complexity is <strong>O(n²)</strong>! If N = 10,000, that\'s 100 million operations... could be slow!</p>`
                },
                {
                    title: 'Key insight: Slide the window!',
                    content: `Wait — what happens if we slide the range one position to the right?
                    <div style="display:flex;flex-direction:column;align-items:center;gap:8px;margin:14px 0;">
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=0&&i<=2?'var(--yellow)':'#dfe6e9'};color:${i>=0&&i<=2?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[1,2,3] Sum =6</div>
                        <div style="font-size:1.5em;">⬇️ Slide one step?</div>
                        <div style="display:flex;gap:4px;">
                            ${[1,2,3,4,2].map((v,i) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:${i>=1&&i<=3?'var(--yellow)':'#dfe6e9'};color:${i>=1&&i<=3?'var(--text)':'#636e72'};border-radius:8px;font-weight:700;">${v}</span>`).join('')}
                        </div>
                        <div>[2,3,4] Sum =6 - <strong style="color:#e17055;">1</strong> + <strong style="color:var(--green);">4</strong> = 9</div>
                    </div>
                    <p style="margin-top:10px;padding:12px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">💡 <strong>No need to recompute the sum from scratch each time!</strong><br>Subtract the element that leaves the front, add the element that enters the back.<br>This is the <strong>"Sliding Window"</strong> idea!</p>`
                },
                {
                    title: 'Smart with Two Pointers!',
                    content: `Use two pointers, start and end, to control the window size!
                    <div style="margin:14px 0;padding:14px;background:var(--bg2);border-radius:10px;font-size:0.93em;line-height:2;border:1px solid var(--bg3);">
                        📌 <strong>If sum &lt; M</strong> → move end right (add more numbers to increase sum)<br>
                        📌 <strong>If sum ≥ M</strong> → move start right (remove from front to decrease sum)<br>
                        📌 <strong>If sum == M</strong> → found one! count++
                    </div>
                    <p style="margin-top:10px;">Why does this work? Because all numbers are <strong>positive (≥ 1)</strong>!<br>Adding a number always increases the sum, removing always decreases it — guaranteed.</p>
                    <p style="margin-top:12px;padding:10px 14px;background:rgba(0,184,148,0.1);border-radius:8px;">⏱ start and end each move at most N times → <strong>O(n)</strong>!<br>From O(n²) to O(n) — a huge improvement! 💪</p>
                    <p style="margin-top:8px;font-size:0.88em;color:var(--text3);">📝 Check the Simulation tab to watch the window slide in action!</p>`
                }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

N, M = map(int, input().split())
arr = list(map(int, input().split()))

start, end = 0, 0
current_sum = 0
count = 0

while True:
    if current_sum >= M:
        current_sum -= arr[start]
        start += 1
    elif end >= N:
        break
    else:
        current_sum += arr[end]
        end += 1

    if current_sum == M:
        count += 1

print(count)`,
                cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    vector<int> arr(N);
    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);

    int s = 0, e = 0, sum = 0, cnt = 0;
    while (true) {
        if (sum >= M) sum -= arr[s++];
        else if (e >= N) break;
        else sum += arr[e++];
        if (sum == M) cnt++;
    }
    printf("%d\\n", cnt);
}`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all contiguous subarray sums with nested loops',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0\nfor i in range(N):\n    total = 0\n    for j in range(i, N):\n        total += arr[j]\n        if total == M:\n            count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;\n    for (int i = 0; i < N; i++) {\n        int total = 0;\n        for (int j = i; j < N; j++) {\n            total += arr[j];\n            if (total == M) cnt++;\n        }\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Input + Initialize', desc: 'Read N, M and array, initialize count to 0.\nsys.stdin.readline for faster input.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\ncount = 0' },
                        { title: 'Iterate Starting Points', desc: 'Check contiguous sums starting from index i.\nReset total to 0 for each starting point.', code: 'for i in range(N):\n    total = 0  # Reset sum for new start' },
                        { title: 'Extend Endpoint + Check Sum', desc: 'Extend j from i to end, computing cumulative sum.\nO(n^2) checks all contiguous ranges.', code: '    for j in range(i, N):\n        total += arr[j]       # sum of range [i..j]\n        if total == M:\n            count += 1' },
                        { title: 'Output Result', desc: 'Output the count of contiguous ranges summing to M.', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input + Initialize', desc: 'Read N, M and array, initialize count.', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int cnt = 0;' },
                        { title: 'Double For Loop Subarray Check', desc: 'Compute cumulative sum from start i to end j.\nKeep adding to total, so O(1) update in inner loop.', code: '    for (int i = 0; i < N; i++) {\n        int total = 0; // Reset for new start\n        for (int j = i; j < N; j++) {\n            total += arr[j]; // sum of range [i..j]\n            if (total == M) cnt++;\n        }\n    }' },
                        { title: 'Output Result', desc: 'Output the count of ranges summing to M.', code: '    printf("%d\\n", cnt);\n}' }
                    ]
                }
            }, {
                approach: 'Two Pointers',
                description: 'Use two pointers to maintain subarray sum and find cases equaling M',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0\ncurrent_sum = 0\ncount = 0\n\nwhile True:\n    if current_sum >= M:\n        current_sum -= arr[start]\n        start += 1\n    elif end >= N:\n        break\n    else:\n        current_sum += arr[end]\n        end += 1\n\n    if current_sum == M:\n        count += 1\n\nprint(count)`,
                    cpp: `#include <iostream>
#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0;\n    while (true) {\n        if (sum >= M) sum -= arr[s++];\n        else if (e >= N) break;\n        else sum += arr[e++];\n        if (sum == M) cnt++;\n    }\n    printf("%d\\n", cnt);\n}`
                },
                codeSteps: {
                    python: [
                        { title: 'Input + Initialize Pointers', desc: 'Key idea: Adjust the range with two pointers start and end!\nIf sum too small extend end, if too large shrink start.\nO(n) since each pointer moves at most N times.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\nstart, end = 0, 0    # range [start, end)\ncurrent_sum = 0       # current subarray sum\ncount = 0' },
                        { title: 'Main Loop: Adjust Range', desc: 'Sum >= M means range too large, subtract start and advance.\nIf end reaches the end, stop.\nSum < M means range too small, add end and expand.', code: 'while True:\n    if current_sum >= M:\n        current_sum -= arr[start]  # remove start element\n        start += 1                 # shrink range\n    elif end >= N:\n        break                      # cannot expand more\n    else:\n        current_sum += arr[end]    # add end element\n        end += 1                   # expand range' },
                        { title: 'Check Sum', desc: 'After adjusting, if current sum equals M, increment count!\nThe if check runs every iteration.', code: '    if current_sum == M:\n        count += 1  # Found a range summing to M!' },
                        { title: 'Output Result', desc: 'Found all ranges in a single O(n) pass.\nstart, end each move at most N times, so O(2N) = O(n).', code: 'print(count)' }
                    ],
                    cpp: [
                        { title: 'Input + Initialize Pointers', desc: 'Manage range [s, e) with two pointers.\nIf sum too small extend e, too large shrink s, so O(n).', code: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n\n    int s = 0, e = 0, sum = 0, cnt = 0; // range [s, e)' },
                        { title: 'Main Loop + Check Sum', desc: 'Sum >= M means subtract s and advance (shrink).\nIf e reaches end, stop.\nSum < M means add e and expand.\nCheck sum == M each iteration.', code: '    while (true) {\n        if (sum >= M) sum -= arr[s++];     // shrink range\n        else if (e >= N) break;            // End\n        else sum += arr[e++];              // expand range\n        if (sum == M) cnt++;               // sum equals M!\n    }' },
                        { title: 'Output Result', desc: 'O(n) since s and e each move at most N times.', code: '    printf("%d\\n", cnt);\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-15',
            title: 'LeetCode 15 - 3Sum',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/3sum/',
            simIntro: 'Watch how fixing one number and using two pointers narrows down the search!',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>In the integer array <code>nums</code>, find all
                combinations of <strong>three numbers</strong> that sum to <code>0</code>.</p>
                <p>Duplicate combinations must be removed.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [-1,0,1,2,-1,-4]</pre></div>
                    <div><strong>Output</strong><pre>[[-1,-1,2],[-1,0,1]]</pre></div>
                </div>
                <p class="example-explain">(-1)+(-1)+2 = 0, (-1)+0+1 = 0</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [0,1,1]</pre></div>
                    <div><strong>Output</strong><pre>[]</pre></div>
                </div>
                <p class="example-explain">There are no three numbers that sum to 0.</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [0,0,0]</pre></div>
                    <div><strong>Output</strong><pre>[[0,0,0]]</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>3 ≤ nums.length ≤ 3000</li>
                    <li>-10⁵ ≤ nums[i] ≤ 10⁵</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it faster than O(n³)?</p>
            `,
            hints: [
                { title: 'First Thought: How to Solve?', content: 'We need to find all combinations of three numbers that sum to 0. The simplest approach? A triple for loop checking all three-number combinations!<br><code>if nums[i] + nums[j] + nums[k] == 0</code> then add to results.' },
                { title: 'Let\'s Try It!', content: '<code>nums = [-1, 0, 1, 2, -1, -4]</code> let\'s try:<br>• (-1)+0+1=0 ✅, (-1)+2+(-1)=0 ✅, 0+1+(-1)=0 → this is the same combination as above!<br><br>We get duplicates! [-1, 0, 1] can appear multiple times. We can use a Set to remove duplicates, but... the triple for loop itself is too slow.' },
                { title: 'Problem Found!', content: 'A triple for loop is <strong>O(n³)</strong>! with n = 3,000 that\'s 27 billion operations! 😱<br><br><strong>Key question:</strong> What benefit does sorting the array give us?<br>Sorting enables ① easy duplicate skipping and ② using <strong>two pointers</strong> to find the other two numbers!' },
                { title: 'A Better Approach!', content: 'After sorting, <strong>fix one number</strong> and find the other two with <strong>two pointers</strong>!<div style="display:flex;gap:4px;align-items:center;margin:14px 0;padding:12px;background:var(--bg2);border-radius:10px;justify-content:center;flex-wrap:wrap;"><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#e17055;color:white;border-radius:8px;font-weight:700;font-size:0.9em;">-4</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#fdcb6e;color:#2d3436;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #e17055;">-1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #00b894;">-1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#dfe6e9;color:#636e72;border-radius:8px;font-weight:700;font-size:0.9em;">0</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#dfe6e9;color:#636e72;border-radius:8px;font-weight:700;font-size:0.9em;">1</span><span style="display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;background:#6c5ce7;color:white;border-radius:8px;font-weight:700;font-size:0.9em;box-shadow:0 0 0 2px #00b894;">2</span></div><div style="display:flex;justify-content:center;gap:12px;margin-bottom:8px;font-size:0.85em;"><span style="color:#e17055;font-weight:600;">i(fixed)</span><span style="color:#00b894;font-weight:600;">L→ ←R (two pointers)</span></div>• Fix i → left=i+1, right=end<br>• If the sum of three is less than 0, left++; if greater, right--<br><br>This gives O(n) × O(n) = <strong>O(n²)</strong>!' },
                { title: 'Key Idea Summary', content: '① Sort the array — O(n log n)<br>② Iterate i from 0, skip if <code>nums[i] == nums[i-1]</code> (remove duplicates)<br>③ Two pointer search with left=i+1, right=end<br>④ If sum is 0, add to results + skip left/right duplicates<br><br><strong>O(n³) → O(n²)</strong> improvement! Sorting is the key.' }
            ],
            inputDefault: 0,
            solve() { return '[[-1, -1, 2], [-1, 0, 1]]'; },
            templates: {
                python: `class Solution:
    def threeSum(self, nums):
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue  # skip duplicates
            left, right = i + 1, len(nums) - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]: left += 1
                    while left < right and nums[right] == nums[right - 1]: right -= 1
                    left += 1; right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1
        return result`,
                cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i-1]) continue;
            int l = i + 1, r = nums.size() - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l+1]) l++;
                    while (l < r && nums[r] == nums[r-1]) r--;
                    l++; r--;
                } else if (s < 0) l++;
                else r--;
            }
        }
        return res;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all three-number combinations with triple for loop, remove duplicates with Set',
                timeComplexity: 'O(n³)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        result = set()\n        n = len(nums)\n        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):\n                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)\n        return [list(t) for t in result]`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet;\n        int n = nums.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }\n        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Initialize Result Set', desc: 'Use set to prevent duplicate combinations.\n[-1,0,1] and [0,-1,1] are the same → sort then add to set for dedup!', code: 'class Solution:\n    def threeSum(self, nums):\n        result = set()  # automatically removes duplicate combos\n        n = len(nums)' },
                        { title: 'Triple For Loop', desc: 'Check all (i, j, k) combinations one by one.\nO(n³) — most intuitive but slow approach.', code: '        for i in range(n):\n            for j in range(i + 1, n):\n                for k in range(j + 1, n):' },
                        { title: 'Check Sum + Remove Duplicates', desc: 'If sum is 0, add as sorted tuple to set.\nsorted → same combination regardless of order becomes same tuple!', code: '                    if nums[i] + nums[j] + nums[k] == 0:\n                        triplet = tuple(sorted([nums[i], nums[j], nums[k]]))\n                        result.add(triplet)  # set auto-removes duplicates' },
                        { title: 'Convert Results', desc: 'Convert set of tuples to list of lists and return.', code: '        return [list(t) for t in result]' }
                    ],
                    cpp: [
                        { title: 'Initialize Set', desc: 'Use set<vector<int>> for dedup.\nSorted vectors automatically deduplicate identical combinations.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        set<vector<int>> resultSet; // remove duplicates\n        int n = nums.size();' },
                        { title: 'Triple For Loop + Check Sum', desc: 'Check all (i,j,k) combinations → O(n³).\nIf sum is 0, sort and insert into set.', code: '        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        vector<int> triplet = {nums[i], nums[j], nums[k]};\n                        sort(triplet.begin(), triplet.end());\n                        resultSet.insert(triplet);\n                    }\n                }\n            }\n        }' },
                        { title: 'Return Result', desc: 'Convert set → vector and return.', code: '        return vector<vector<int>>(resultSet.begin(), resultSet.end());\n    }\n};' }
                    ]
                }
            }, {
                approach: 'Sort + Two Pointers',
                description: 'Sort, fix one number, and search for the other two with two pointers',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:\n    def threeSum(self, nums):\n        nums.sort()\n        result = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            left, right = i + 1, len(nums) - 1\n            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:\n                    left += 1\n                else:\n                    right -= 1\n        return result`,
                    cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};`
                },
                codeSteps: {
                    python: [
                        { title: 'Sort', desc: 'Key: sorting enables two pointers!\nIn a sorted array, if sum is too small → left↑, too large → right↓.', code: 'class Solution:\n    def threeSum(self, nums):\n        nums.sort()  # Sort → enables two pointers!\n        result = []' },
                        { title: 'Fix First Number + Skip Duplicates', desc: 'Fix i and find the other two with two pointers.\nSkip duplicate values of i to prevent duplicate combinations!', code: '        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:  # skip duplicate\n                continue' },
                        { title: 'Set Up Two Pointers', desc: 'left = right after i, right = end of array.\nNarrow these two pointers until they meet.', code: '            left, right = i + 1, len(nums) - 1' },
                        { title: 'Compare Sum + Move Pointers', desc: 'Sum == 0 → Answer! Add to results and skip duplicates.\nSum < 0 → need larger value → left++\nSum > 0 → need smaller value → right--', code: '            while left < right:\n                s = nums[i] + nums[left] + nums[right]\n                if s == 0:\n                    result.append([nums[i], nums[left], nums[right]])\n                    while left < right and nums[left] == nums[left + 1]: left += 1\n                    while left < right and nums[right] == nums[right - 1]: right -= 1\n                    left += 1; right -= 1\n                elif s < 0:   # sum too small → move left right\n                    left += 1\n                else:          # sum too large → move right left\n                    right -= 1' },
                        { title: 'Return Result', desc: 'O(n²) — Sort O(n log n) + two pointers O(n) for each i\nMuch faster than O(n³) brute force!', code: '        return result' }
                    ],
                    cpp: [
                        { title: 'Sort + Initialize', desc: 'Sorting enables two pointers!\nIf sum too small → left↑, too large → right↓.', code: 'class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end()); // Sort → two pointers!\n        vector<vector<int>> res;' },
                        { title: 'Fix i + Skip Duplicates', desc: 'Fix i, find rest with two pointers.\nSkip same values → prevent duplicate combinations!', code: '        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue; // skip duplicates' },
                        { title: 'Two Pointer Search', desc: 'Sum == 0 → Answer! Skip duplicates, move both.\nSum < 0 → left++, Sum > 0 → right--', code: '            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int s = nums[i] + nums[l] + nums[r];\n                if (s == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (s < 0) l++;  // sum small → move left\n                else r--;               // sum large → move right\n            }\n        }\n        return res;\n    }\n};' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) {
        container.innerHTML = '';
        const stageList = document.createElement('div');
        stageList.className = 'problem-stages';

        this.stages.forEach(stage => {
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-card';
            stageCard.innerHTML = `
                <div class="stage-header">
                    <span class="stage-num">Stage ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;
            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });
            stageList.appendChild(stageCard);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn'; backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'Solve on LeetCode ↗' : 'Solve on BOJ ↗'}</a></div>${problem.descriptionHTML}`;
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
        solveArea.innerHTML = `
            <div class="editor-header"><h3>Write Solution</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div>
            <textarea id="code-editor" spellcheck="false" placeholder="Write your code here..."></textarea>
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ Run</button><button id="check-btn" class="btn btn-success">✓ Check Answer</button></div>
            <div id="output-area" class="output-area"><div class="output-label">Output</div><pre id="output-text"></pre></div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => { if (window.hljs) hljs.highlightElement(codeEl); });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
        });

        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `Expected Answer:\n${expected}\n\n(Your code should output the above result)`);
        });
        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `Expected Answer:\n${expected}\n\n💡 Submit your code to ${site} to verify your answer!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.array = arrayTopic;
