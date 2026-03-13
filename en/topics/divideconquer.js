// ===== Divide & Conquer Algorithm Topic Module =====
var divideConquerTopic = {
    id: 'divideconquer',
    title: 'Divide & Conquer',
    icon: '🔪',
    category: 'Algorithm Techniques',
    order: 11,
    description: 'Break a big problem into smaller pieces, solve each, and combine the results',
    relatedNote: 'Divide & Conquer is the foundation of merge sort, quick sort, and is also used in advanced algorithms such as FFT and Karatsuba multiplication.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-2630':  { type: 'Area Division',       color: 'var(--accent)', vizMethod: '_renderVizPaper',  suffix: '-paper' },
        'boj-1992':  { type: 'Quadtree',            color: 'var(--green)',  vizMethod: '_renderVizQuad',   suffix: '-quad' },
        'boj-1780':  { type: '9-Partition',          color: '#e17055',       vizMethod: '_renderVizNine',   suffix: '-nine' },
        'boj-1629':  { type: 'Exponentiation',      color: '#6c5ce7',       vizMethod: '_renderVizPow',    suffix: '-pow' },
        'boj-11401': { type: "Fermat's Little Thm",  color: '#fdcb6e',       vizMethod: '_renderVizBinom',  suffix: '-binom' },
        'boj-2740':  { type: 'Matrix Multiply',     color: '#00b894',       vizMethod: '_renderVizMatMul', suffix: '-matmul' },
        'boj-10830': { type: 'Matrix Exponent',      color: '#d63031',       vizMethod: '_renderVizMatPow', suffix: '-matpow' },
        'boj-11444': { type: 'Fibonacci Matrix',    color: '#0984e3',       vizMethod: '_renderVizFibMat', suffix: '-fibmat' },
        'boj-6549':  { type: 'Range Division',       color: '#e84393',       vizMethod: '_renderVizHisto',  suffix: '-histo' }
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
        var diffMap = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: 'Start by reading the problem and understanding the I/O format.', icon: '📋' },
            think:   { intro: 'Don\'t jump to coding — open the hints step by step to build your strategy.', icon: '💡' },
            sim:     { intro: prob.simIntro || 'See how divide & conquer actually works in action.', icon: '🎮' },
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
        container.appendChild(contentDiv);
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
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
        container.innerHTML = '\
            <div class="hero">\
                <h2>🔪 Divide and Conquer</h2>\
                <p class="hero-sub">Break a big problem into smaller pieces, solve each, then combine for the full answer</p>\
            </div>\
\
            <!-- 1. What is Divide and Conquer? -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> What is Divide and Conquer?</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> You need to share a pizza among 8 people.<br><br>\
                    1. <strong>Divide</strong>: Cut the pizza in half, then in half again, then in half once more — 8 slices!<br>\
                    2. <strong>Conquer</strong>: Each person eats their own slice.<br>\
                    3. <strong>Combine</strong>: Everyone is now full!<br><br>\
                    This is divide and conquer: <strong>break a big problem into smaller problems, solve each, and combine the results</strong>.<br>\
                    <a href="https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Divide and Conquer ↗</a>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Binary search (simplest example of divide and conquer)\ndef binary_search(arr, target, lo, hi):\n    if lo > hi:\n        return -1                    # Base case: no range to search\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        return mid                   # Found it!\n    elif arr[mid] < target:\n        return binary_search(arr, target, mid + 1, hi)  # Right half\n    else:\n        return binary_search(arr, target, lo, mid - 1)  # Left half</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Binary search (simplest example of divide and conquer)\nint binary_search(vector&lt;int&gt;&amp; arr, int target, int lo, int hi) {\n    if (lo &gt; hi)\n        return -1;                   // Base case: no range to search\n    int mid = (lo + hi) / 2;\n    if (arr[mid] == target)\n        return mid;                  // Found it!\n    else if (arr[mid] &lt; target)\n        return binary_search(arr, target, mid + 1, hi);  // Right half\n    else\n        return binary_search(arr, target, lo, mid - 1);  // Left half\n}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">When searching for a number in 1024 sorted numbers using binary search, how many comparisons are needed at most?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>At most 10 times</strong>!<br>\
                        1024 → 512 → 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2 → 1<br>\
                        Since we halve each time, <strong>log₂(1024) = 10</strong> comparisons are enough.<br>\
                        A linear search would need up to 1024 comparisons, but divide and conquer does it in just <strong>10</strong>!\
                    </div>\
                </div>\
            </div>\
\
            <!-- 2. The 3 Steps of Divide and Conquer -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> The 3 Steps of Divide and Conquer</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>1. Divide</h3>\
                        <p>Split the big problem into <strong>smaller subproblems of the same form</strong>. Usually split in half, or into 4 parts.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <path d="M28 55 L40 68 L52 55" fill="none" stroke="var(--green)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>2. Conquer</h3>\
                        <p>Solve the smaller subproblems <strong>recursively</strong>. When they can no longer be divided, solve them directly.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="30" rx="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <path d="M33 40 L47 40" stroke="var(--yellow)" stroke-width="3" marker-end="url(#arrowhead)"/>\
                            </svg>\
                        </div>\
                        <h3>3. Combine</h3>\
                        <p><strong>Merge</strong> the answers from the smaller subproblems to form the answer to the original big problem.<br>\
                        <a href="https://en.wikipedia.org/wiki/Merge_sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Merge Sort ↗</a></p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Merge Sort — the classic divide and conquer example\ndef merge_sort(arr):\n    if len(arr) <= 1:       # Base case\n        return arr\n\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])    # 1. Sort left half\n    right = merge_sort(arr[mid:])   # 1. Sort right half\n    return merge(left, right)       # 3. Combine\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Merge Sort — the classic divide and conquer example\n#include &lt;vector&gt;\nusing namespace std;\n\nvector&lt;int&gt; merge(vector&lt;int&gt;&amp; left, vector&lt;int&gt;&amp; right) {\n    vector&lt;int&gt; result;\n    int i = 0, j = 0;\n    while (i &lt; left.size() &amp;&amp; j &lt; right.size()) {\n        if (left[i] &lt;= right[j])\n            result.push_back(left[i++]);\n        else\n            result.push_back(right[j++]);\n    }\n    while (i &lt; left.size()) result.push_back(left[i++]);   // Remaining left\n    while (j &lt; right.size()) result.push_back(right[j++]); // Remaining right\n    return result;\n}\n\nvector&lt;int&gt; merge_sort(vector&lt;int&gt; arr) {\n    if (arr.size() &lt;= 1) return arr;  // Base case\n\n    int mid = arr.size() / 2;\n    // Vector slicing (corresponds to Python arr[:mid], arr[mid:])\n    vector&lt;int&gt; left(arr.begin(), arr.begin() + mid);   // 1. Left half\n    vector&lt;int&gt; right(arr.begin() + mid, arr.end());     // 1. Right half\n    left = merge_sort(left);    // 2. Sort left\n    right = merge_sort(right);  // 2. Sort right\n    return merge(left, right);  // 3. Combine\n}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">If you merge sort [5, 3, 1, 4, 2], how does it split in the divide step?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        [5, 3, 1, 4, 2] → [5, 3] + [1, 4, 2]<br>\
                        [5, 3] → [5] + [3]<br>\
                        [1, 4, 2] → [1] + [4, 2] → [1] + [4] + [2]<br><br>\
                        Combine: [3,5] + [1,2,4] → <strong>[1, 2, 3, 4, 5]</strong>\
                    </div>\
                </div>\
            </div>\
\
            <!-- 3. Divide & Conquer vs Recursion vs DP -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> Divide & Conquer vs Recursion vs DP</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="30" r="12" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <path d="M30 48 Q40 60 50 48" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <line x1="40" y1="42" x2="40" y2="52" stroke="var(--blue)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>Recursion</h3>\
                        <p>A technique where a function <strong>calls itself</strong>.<br>Both divide and conquer and DP use recursion.</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="25" x2="40" y2="55" stroke="var(--red)" stroke-width="2" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>Divide & Conquer</h3>\
                        <p><strong>Divide + Combine</strong>.<br>Split the problem into independent pieces, solve each, and combine. Subproblems <strong>do not overlap</strong>.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="20" width="60" height="40" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <line x1="30" y1="20" x2="30" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                                <line x1="50" y1="20" x2="50" y2="60" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--green)" stroke-width="1" stroke-dasharray="3,3"/>\
                            </svg>\
                        </div>\
                        <h3>DP (Dynamic Programming)</h3>\
                        <p><strong>Store and reuse</strong>.<br>When subproblems <strong>overlap</strong> and the same computation is repeated, store results and reuse them.</p>\
                    </div>\
                </div>\
\
                <div class="key-difference-box" style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius);border-left:4px solid var(--accent);">\
                    <strong>Key Difference!</strong><br>\
                    • <strong>Divide & Conquer</strong>: Subproblems <span style="color:var(--accent)">do not overlap</span> — just solve each independently<br>\
                    • <strong>DP</strong>: Subproblems <span style="color:var(--green)">overlap</span> — store and reuse for speed<br>\
                    Example: Merge sort: left/right are independent → <strong>Divide & Conquer</strong> | Fibonacci: F(3) computed multiple times → <strong>DP</strong><br>\
                    <a href="https://en.wikipedia.org/wiki/Master_theorem_(analysis_of_algorithms)" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Master Theorem ↗</a> — A formula to easily compute the time complexity of divide and conquer\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Can "finding the sum from 1 to N" be solved with divide and conquer?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Yes! It is possible.<br>\
                        sum(1, N) = sum(1, N/2) + sum(N/2+1, N).<br>\
                        Base case: sum(a, a) = a (when only one element remains, it is the answer itself)<br><br>\
                        However, for this problem the formula <strong>N×(N+1)/2</strong> is faster.<br>\
                        Divide and conquer shines on <strong>more complex problems</strong>!\
                    </div>\
                </div>\
            </div>\
\
            <!-- 4. Common Divide & Conquer Patterns -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> Common Divide & Conquer Patterns</div>\
                <div class="concept-grid">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="10" width="60" height="60" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="10" x2="40" y2="70" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>\
                                <line x1="10" y1="40" x2="70" y2="40" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>Area Division</h3>\
                        <p>Divide a 2D area into <strong>4 parts (quadtree)</strong> or <strong>9 parts</strong> and process each. Paper cutting and quadtree problems are classic examples.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <text x="15" y="48" font-size="28" fill="var(--green)">a</text>\
                                <text x="40" y="32" font-size="16" fill="var(--green)">n</text>\
                            </svg>\
                        </div>\
                        <h3>Fast Exponentiation</h3>\
                        <p>When computing a^n, <strong>halving the exponent</strong> allows O(log n) computation. Used for exponentiation of very large numbers.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <rect x="45" y="20" width="25" height="25" rx="2" fill="none" stroke="var(--yellow)" stroke-width="2"/>\
                                <text x="30" y="58" font-size="14" fill="var(--yellow)">×</text>\
                            </svg>\
                        </div>\
                        <h3>Matrix Exponentiation</h3>\
                        <p>Matrix exponentiation works on the same principle. Used to compute <strong>Fibonacci numbers</strong> in O(log n).</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="50" width="12" height="20" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="24" y="30" width="12" height="40" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="38" y="40" width="12" height="30" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                                <rect x="52" y="20" width="12" height="50" fill="none" stroke="var(--blue)" stroke-width="2"/>\
                            </svg>\
                        </div>\
                        <h3>Range Division</h3>\
                        <p>Split an array into <strong>left and right halves</strong>, find the answer for each, and handle the crossing case. The histogram problem is a classic example.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How many multiplications does it take to compute 2^100 directly? How many with divide and conquer?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Direct multiplication: You need to multiply 2 a total of <strong>99 times</strong>.<br><br>\
                        Divide and conquer: 2^100 = (2^50)² → 2^50 = (2^25)² → 2^25 = (2^12)² × 2 → ...<br>\
                        Only about <strong>7 multiplications</strong> needed! (log₂(100) ≈ 7)<br><br>\
                        99 times → 7 times, nearly <strong>14x faster!</strong>\
                    </div>\
                </div>\
            </div>\
\
            <!-- 5. 3 Steps to Solve Divide & Conquer Problems -->\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 3 Steps to Solve Divide & Conquer Problems</div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="35" r="18" fill="none" stroke="var(--red)" stroke-width="2"/>\
                                <text x="34" y="42" font-size="18" fill="var(--red)">!</text>\
                            </svg>\
                        </div>\
                        <h3>Step 1: Define the Base Case</h3>\
                        <p>Determine <strong>the smallest size that cannot be divided further</strong>. e.g., array size 1, exponent 0 or 1, etc.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="10" y="25" width="60" height="30" rx="4" fill="none" stroke="var(--accent)" stroke-width="2"/>\
                                <line x1="40" y1="20" x2="40" y2="60" stroke="var(--red)" stroke-width="2.5" stroke-dasharray="4,3"/>\
                            </svg>\
                        </div>\
                        <h3>Step 2: Define the Division Rule</h3>\
                        <p>Decide how to divide the problem. <strong>In half? Into 4 parts? Into 9 parts?</strong> It depends on the problem type.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="8" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <rect x="47" y="25" width="25" height="25" rx="4" fill="none" stroke="var(--green)" stroke-width="2"/>\
                                <path d="M33 37 L47 37" stroke="var(--green)" stroke-width="3"/>\
                                <text x="36" y="62" font-size="16" fill="var(--green)">+</text>\
                            </svg>\
                        </div>\
                        <h3>Step 3: Define the Combine Method</h3>\
                        <p>Decide how to combine the results of subproblems. <strong>Addition? Multiplication? Maximum?</strong> It varies by problem.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">How do you apply the 3 steps to "check if an N×N paper is entirely one color"?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Step 1: <strong>Base case</strong>: If size is 1×1, the color itself is the answer<br>\
                        Step 2: <strong>Divide</strong>: Split into 4 parts (top-left, top-right, bottom-left, bottom-right)<br>\
                        Step 3: <strong>Combine</strong>: If all 4 parts are the same color, merge them; otherwise keep each separate<br><br>\
                        This is exactly the core of the <strong>Paper Cutting / Quadtree</strong> problem!\
                    </div>\
                </div>\
            </div>\
        ';

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
    },

    // ===== Visualization (empty stubs for concept tab) =====
    renderVisualize(container) {},

    // ===== Problem tab empty stubs =====
    renderProblem(container) {},

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ Prev</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">Next ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
    },

    _initStepController(container, steps, suffix) {
        var state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;
        var prevBtn = container.querySelector('#str-prev-' + suffix);
        var nextBtn = container.querySelector('#str-next-' + suffix);
        var indicator = container.querySelector('#str-indicator-' + suffix);
        var desc = container.querySelector('#str-desc-' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { indicator.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
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
    // Simulation 1: Paper Cutting (boj-2630)
    // ====================================================================
    _renderVizPaper(container) {
        var self = this, suffix = '-paper';
        var DEFAULT_GRID = '0011/0011/1011/0111';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Paper Cutting</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Recursively split a 4×4 paper into 4 parts and check if each is a single color. (white=0, blue=1)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by /): <input type="text" id="dc-paper-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-paper-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-paper-input');
        var resetBtn = container.querySelector('#dc-paper-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [];
                for (var j = 0; j < rows[i].length; j++) row.push(parseInt(rows[i][j]) || 0);
                g.push(row);
            }
            return g;
        }

        function cellStyle(v, hl) {
            var bg = v === 1 ? 'var(--accent)' : 'var(--bg2)';
            var extra = hl || '';
            return 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;background:' + bg + ';color:' + (v === 1 ? 'white' : 'var(--text)') + ';' + extra;
        }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',48px)';

            function renderGrid(highlights) {
                var html = '';
                for (var r = 0; r < SIZE; r++) {
                    for (var c = 0; c < SIZE; c++) {
                        var hl = highlights && highlights[r + ',' + c] ? highlights[r + ',' + c] : '';
                        html += '<div style="' + cellStyle(grid[r][c], hl) + '">' + grid[r][c] + '</div>';
                    }
                }
                gridEl.innerHTML = html;
            }
            renderGrid(null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Inspecting the ' + SIZE + '×' + SIZE + ' paper.</span>';

            // Recursively generate steps
            var steps = [];
            var whiteCnt = 0, blueCnt = 0;

            function buildSteps(r, c, size, grid) {
                // Check if all cells in the region are the same
                var first = grid[r][c];
                var allSame = true;
                for (var i = r; i < r + size && allSame; i++)
                    for (var j = c; j < c + size && allSame; j++)
                        if (grid[i][j] !== first) allSame = false;

                if (allSame) {
                    var color = first === 1 ? 'blue' : 'white';
                    var borderColor = first === 1 ? 'var(--accent)' : 'var(--green)';
                    (function(r2,c2,sz,col,bc,f) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': all ' + col + '! ' + col + '+1',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:3px solid ' + bc + ';box-shadow:0 0 8px ' + bc + '40;';
                                renderGrid(h);
                                if (f === 0) whiteCnt++; else blueCnt++;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': all ' + col + ' → <strong>' + col + ' +1</strong> (W:' + whiteCnt + ', B:' + blueCnt + ')';
                            },
                            undo: function() {
                                if (f === 0) whiteCnt--; else blueCnt--;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, size, color, borderColor, first);
                } else {
                    (function(r2,c2,sz) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': mixed colors → split into 4!',
                            action: function() {
                                var h = {};
                                for (var i = r2; i < r2 + sz; i++)
                                    for (var j = c2; j < c2 + sz; j++)
                                        h[i + ',' + j] = 'border:3px solid var(--red);';
                                renderGrid(h);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz + '×' + sz + ': different colors → <strong>split into 4!</strong>';
                            },
                            undo: function() {
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, size);
                    var half = size / 2;
                    buildSteps(r, c, half, grid);
                    buildSteps(r, c + half, half, grid);
                    buildSteps(r + half, c, half, grid);
                    buildSteps(r + half, c + half, half, grid);
                }
            }
            whiteCnt = 0; blueCnt = 0;
            buildSteps(0, 0, SIZE, grid);
            var finalW = 0, finalB = 0;
            (function countAll(r,c,sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) { if(f===0) finalW++; else finalB++; }
                else { var h2=sz/2; countAll(r,c,h2); countAll(r,c+h2,h2); countAll(r+h2,c,h2); countAll(r+h2,c+h2,h2); }
            })(0,0,SIZE);
            steps.push({
                description: 'Done! White: ' + finalW + ', Blue: ' + finalB,
                action: function() { renderGrid(null); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">Done! White: ' + finalW + ', Blue: ' + finalB + '</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            whiteCnt = 0; blueCnt = 0;
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 2: Quadtree (boj-1992)
    // ====================================================================
    _renderVizQuad(container) {
        var self = this, suffix = '-quad';
        var DEFAULT_GRID = '1100/1100/0010/0001';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Quadtree Compression</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Compresses a 4x4 image into a quadtree string.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by /): <input type="text" id="dc-quad-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-quad-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:8px;"></div>' +
            '<div id="dc-result' + suffix + '" style="font-family:monospace;font-size:1.1rem;padding:8px;background:var(--bg);border-radius:8px;margin-bottom:12px;text-align:center;min-height:30px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var resultEl = container.querySelector('#dc-result' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-quad-input');
        var resetBtn = container.querySelector('#dc-quad-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [];
                for (var j = 0; j < rows[i].length; j++) row.push(parseInt(rows[i][j]) || 0);
                g.push(row);
            }
            return g;
        }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',48px)';

            function renderGrid(highlights) {
                var html = '';
                for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
                    var v = grid[r][c];
                    var bg = v === 1 ? 'var(--accent)' : 'var(--bg2)';
                    var hl = highlights && highlights[r+','+c] ? highlights[r+','+c] : '';
                    html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;background:' + bg + ';color:' + (v?'white':'var(--text)') + ';' + hl + '">' + v + '</div>';
                }
                gridEl.innerHTML = html;
            }
            renderGrid(null);
            resultEl.textContent = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">Starting Quadtree Compression.</span>';

            var steps = [];
            var resultStr = '';

            // Compute Quadtree result first
            function quadResult(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) return '' + f;
                var h = sz/2;
                return '(' + quadResult(r,c,h) + quadResult(r,c+h,h) + quadResult(r+h,c,h) + quadResult(r+h,c+h,h) + ')';
            }
            var finalResult = quadResult(0, 0, SIZE);

            function buildSteps(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) {
                    (function(r2,c2,sz2,val) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': all' + val + ' → "' + val + '"',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--green);';
                                renderGrid(h);
                                resultStr += '' + val;
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + ']: all' + val + ' → <strong>"' + val + '"</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz, f);
                } else {
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': mixed colors → "(" start, divide into 4!',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--red);';
                                renderGrid(h);
                                resultStr += '(';
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': mixed → <strong>open "("</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                    var h = sz/2;
                    buildSteps(r, c, h);
                    buildSteps(r, c+h, h);
                    buildSteps(r+h, c, h);
                    buildSteps(r+h, c+h, h);
                    // Closing parenthesis
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ' done → close ")"',
                            action: function() {
                                renderGrid(null);
                                resultStr += ')';
                                resultEl.textContent = resultStr;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] region done → <strong>close ")"</strong>';
                            },
                            undo: function() {
                                resultStr = resultStr.slice(0, -1);
                                resultEl.textContent = resultStr;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                }
            }
            buildSteps(0, 0, SIZE);
            steps.push({
                description: 'Done! Result: ' + finalResult,
                action: function() { renderGrid(null); resultEl.textContent = finalResult; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Done! ' + finalResult + '</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            resultStr = '';
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 3: Paper Count (boj-1780)
    // ====================================================================
    _renderVizNine(container) {
        var self = this, suffix = '-nine';
        var DEFAULT_GRID = '00-1/001/-110';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Paper Count (9-Partition)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Inspects a 3×3 paper. If not all the same, divides into 9 parts (1×1).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (-1,0,1 / row sep /): <input type="text" id="dc-nine-input" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="dc-nine-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-grid' + suffix + '" style="display:inline-grid;gap:2px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#dc-grid' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-nine-input');
        var resetBtn = container.querySelector('#dc-nine-reset');

        function parseGrid(str) {
            var rows = str.trim().split('/');
            var g = [];
            for (var i = 0; i < rows.length; i++) {
                var row = [], s = rows[i], j = 0;
                while (j < s.length) {
                    if (s[j] === '-') { row.push(-1); j += 2; }
                    else { row.push(parseInt(s[j]) || 0); j++; }
                }
                g.push(row);
            }
            return g;
        }

        function colorOf(v) { return v === -1 ? '#e17055' : v === 0 ? 'var(--bg2)' : 'var(--accent)'; }

        function buildAndRun(grid) {
            var SIZE = grid.length;
            gridEl.style.gridTemplateColumns = 'repeat(' + SIZE + ',56px)';

            function renderGrid(highlights) {
                var html = '';
                for (var r = 0; r < SIZE; r++) for (var c = 0; c < SIZE; c++) {
                    var v = grid[r][c];
                    var hl = highlights && highlights[r+','+c] ? highlights[r+','+c] : '';
                    html += '<div style="width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:700;background:' + colorOf(v) + ';color:' + (v===0?'var(--text)':'white') + ';' + hl + '">' + v + '</div>';
                }
                gridEl.innerHTML = html;
            }
            renderGrid(null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Inspecting the ' + SIZE + '×' + SIZE + ' paper.</span>';

            var steps = [];
            var cnt = {'-1': 0, '0': 0, '1': 0};

            function buildSteps(r, c, sz) {
                var f = grid[r][c], ok = true;
                for (var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) {
                    (function(r2,c2,sz2,val) {
                        var borderColor = val === -1 ? '#e17055' : val === 0 ? 'var(--green)' : 'var(--accent)';
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': all' + val + ' → ' + val + ' +1',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid ' + borderColor + ';box-shadow:0 0 6px ' + borderColor + '40;';
                                renderGrid(h);
                                cnt['' + val]++;
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': all' + val + ' → <strong>' + val + ' +1</strong> (-1:' + cnt['-1'] + ', 0:' + cnt['0'] + ', 1:' + cnt['1'] + ')';
                            },
                            undo: function() {
                                cnt['' + val]--;
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz, f);
                } else {
                    (function(r2,c2,sz2) {
                        steps.push({
                            description: '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': values are mixed → 9-partition!',
                            action: function() {
                                var h = {};
                                for (var i=r2;i<r2+sz2;i++) for(var j=c2;j<c2+sz2;j++) h[i+','+j]='border:3px solid var(--red);';
                                renderGrid(h);
                                infoEl.innerHTML = '[' + r2 + ',' + c2 + '] ' + sz2 + '×' + sz2 + ': values differ → <strong>9-partition!</strong>';
                            },
                            undo: function() {
                                renderGrid(null);
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(r, c, sz);
                    var third = sz / 3;
                    for (var dr = 0; dr < 3; dr++)
                        for (var dc = 0; dc < 3; dc++)
                            buildSteps(r + dr * third, c + dc * third, third);
                }
            }
            buildSteps(0, 0, SIZE);
            // Pre-compute final counts
            var fCnt = {'-1': 0, '0': 0, '1': 0};
            (function countAll(r,c,sz) {
                var f = grid[r][c], ok = true;
                for(var i=r;i<r+sz&&ok;i++) for(var j=c;j<c+sz&&ok;j++) if(grid[i][j]!==f) ok=false;
                if (ok) { fCnt[''+f]++; }
                else { var t=sz/3; for(var dr=0;dr<3;dr++) for(var dc=0;dc<3;dc++) countAll(r+dr*t,c+dc*t,t); }
            })(0,0,SIZE);
            steps.push({
                description: 'Done! -1: ' + fCnt['-1'] + ', 0: ' + fCnt['0'] + ', 1: ' + fCnt['1'] + '',
                action: function() { renderGrid(null); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Done! -1: ' + fCnt['-1'] + ', 0: ' + fCnt['0'] + ', 1: ' + fCnt['1'] + '</strong>'; },
                undo: function() { renderGrid(null); infoEl.innerHTML = '(undo)'; }
            });
            cnt = {'-1': 0, '0': 0, '1': 0};
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseGrid(DEFAULT_GRID));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseGrid(inputEl.value));
        });
    },

    // ====================================================================
    // Simulation 4: Fast Exponentiation (boj-1629)
    // ====================================================================
    _renderVizPow(container) {
        var self = this, suffix = '-pow';
        var DEF_A = 10, DEF_B = 11, DEF_C = 12;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Fast Exponentiation</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Computes A<sup>B</sup> mod C using divide and conquer.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">A: <input type="number" id="dc-pow-a" value="' + DEF_A + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">B: <input type="number" id="dc-pow-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">C: <input type="number" id="dc-pow-c" value="' + DEF_C + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-pow-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-tree' + suffix + '" style="margin-bottom:12px;padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var treeEl = container.querySelector('#dc-tree' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpA = container.querySelector('#dc-pow-a');
        var inpB = container.querySelector('#dc-pow-b');
        var inpC = container.querySelector('#dc-pow-c');
        var resetBtn = container.querySelector('#dc-pow-reset');

        function buildAndRun(A, B, C) {
            if (C < 1) C = 1;
            if (B < 1) B = 1;
            treeEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">Halving the exponent to compute.</span>';

            // Follow the exponent to build a divide tree
            var nodes = [];
            function buildTree(exp, depth) {
                var idx = nodes.length;
                nodes.push({exp: exp, depth: depth, value: null});
                if (exp > 1) buildTree(Math.floor(exp / 2), depth + 1);
            }
            buildTree(B, 0);

            function renderTree() {
                treeEl.innerHTML = nodes.map(function(n) {
                    var pad = '&nbsp;&nbsp;'.repeat(n.depth);
                    var val = n.value !== null ? ' = <strong style="color:var(--green);">' + n.value + '</strong>' : '';
                    return '<div style="padding:4px 0;">' + pad + A + '<sup>' + n.exp + '</sup> mod ' + C + val + '</div>';
                }).join('');
            }
            renderTree();

            var steps = [];
            // Divide steps: explain the split for each node
            for (var i = 0; i < nodes.length - 1; i++) {
                (function(idx) {
                    var exp = nodes[idx].exp;
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: A + '^' + exp + ': ' + (odd ? 'odd' : 'even') + ' → ' + A + '^' + half + ' × ' + A + '^' + half + (odd ? ' × ' + A : ''),
                        action: function() {
                            infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + A + '<sup>' + half + '</sup> × ' + A + '<sup>' + half + '</sup>' + (odd ? ' × ' + A : '') + ' (' + (odd ? 'odd: half×half×base' : 'even: half×half') + ')';
                        },
                        undo: function() {
                            infoEl.innerHTML = '(undo)';
                        }
                    });
                })(i);
            }
            // Base case
            var baseExp = nodes[nodes.length - 1].exp;
            var baseVal = A % C;
            (function(be, bv, lastIdx) {
                steps.push({
                    description: 'Base case: ' + A + '^' + be + ' = ' + bv + ' (mod ' + C + ')',
                    action: function() { nodes[lastIdx].value = bv; renderTree(); infoEl.innerHTML = 'base case: ' + A + '<sup>' + be + '</sup> mod ' + C + ' = <strong>' + bv + '</strong>'; },
                    undo: function() { nodes[lastIdx].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
                });
            })(baseExp, baseVal, nodes.length - 1);

            // Combine steps: bottom to top
            function pw(a, b, m) { var r = 1; a = a % m; if (a === 0) return 0; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }
            for (var i = nodes.length - 2; i >= 0; i--) {
                (function(idx) {
                    var exp = nodes[idx].exp;
                    var half = Math.floor(exp / 2);
                    var halfVal = pw(A, half, C);
                    var result = halfVal * halfVal % C;
                    if (exp % 2 === 1) result = result * (A % C) % C;
                    steps.push({
                        description: 'Combine: ' + A + '^' + exp + ' = ' + halfVal + '×' + halfVal + (exp % 2 === 1 ? '×' + (A%C) : '') + ' mod ' + C + ' = ' + result,
                        action: function() { nodes[idx].value = result; renderTree(); infoEl.innerHTML = A + '<sup>' + exp + '</sup> = ' + halfVal + ' × ' + halfVal + (exp % 2 === 1 ? ' × ' + (A%C) : '') + ' mod ' + C + ' = <strong>' + result + '</strong>'; },
                        undo: function() { nodes[idx].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
                    });
                })(i);
            }
            // Final result
            var finalVal = pw(A, B, C);
            steps.push({
                description: 'Done! ' + A + '^' + B + ' mod ' + C + ' = ' + finalVal,
                action: function() { nodes[0].value = finalVal; renderTree(); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + A + '<sup>' + B + '</sup> mod ' + C + ' = ' + finalVal + '</strong>'; },
                undo: function() { nodes[0].value = null; renderTree(); infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_A, DEF_B, DEF_C);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpA.value) || 2, parseInt(inpB.value) || 1, parseInt(inpC.value) || 1);
        });
    },

    // ====================================================================
    // Simulation 5: Binomial Coefficient 3 (boj-11401)
    // ====================================================================
    _renderVizBinom(container) {
        var self = this, suffix = '-binom';
        var DEF_N = 5, DEF_K = 2, DEF_MOD = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Binomial Coefficient (Fermat\'s Little Theorem)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Computes C(N,K) mod P via factorial + modular inverse. (P must be prime)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="dc-binom-n" value="' + DEF_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">K: <input type="number" id="dc-binom-k" value="' + DEF_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">P(prime): <input type="number" id="dc-binom-mod" value="' + DEF_MOD + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-binom-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-calc' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var calcEl = container.querySelector('#dc-calc' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpN = container.querySelector('#dc-binom-n');
        var inpK = container.querySelector('#dc-binom-k');
        var inpMod = container.querySelector('#dc-binom-mod');
        var resetBtn = container.querySelector('#dc-binom-reset');

        function pw(a, b, m) { var r = 1; a = a % m; if (a === 0) return 0; while (b > 0) { if (b % 2 === 1) r = r * a % m; b = Math.floor(b / 2); a = a * a % m; } return r; }

        function buildAndRun(N, K, MOD) {
            if (N < 0) N = 0;
            if (K < 0) K = 0;
            if (K > N) K = N;
            if (MOD < 2) MOD = 2;
            var fac = [1]; for (var i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;
            var invK = pw(fac[K], MOD - 2, MOD);
            var invNK = pw(fac[N - K], MOD - 2, MOD);
            var ans = fac[N] * invK % MOD * invNK % MOD;
            calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)';
            infoEl.innerHTML = '<span style="color:var(--text2);">Computing modular inverse via Fermat\'s Little Theorem.</span>';

            var facStr = fac.map(function(v,i){return i+'!='+v;}).join(', ');
            var steps = [
                { description: 'Compute factorials: ' + facStr + ' (mod ' + MOD + ')',
                  action: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = 'Factorial computation complete (mod ' + MOD + ')'; },
                  undo: function() { calcEl.textContent = 'C(' + N + ',' + K + ') = ' + N + '! / (' + K + '! × ' + (N-K) + '!)'; infoEl.innerHTML = '<span style="color:var(--text2);">Computing modular inverse via Fermat\'s Little Theorem.</span>'; }
                },
                { description: 'Fermat\'s Little Theorem: ' + K + '!inverse = ' + fac[K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invK,
                  action: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → inverse = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!modular inverse: <strong>' + invK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = facStr; infoEl.innerHTML = 'Factorial computation complete (mod ' + MOD + ')'; }
                },
                { description: (N-K) + '!inverse = ' + fac[N-K] + '^' + (MOD-2) + ' mod ' + MOD + ' = ' + invNK,
                  action: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → inverse = ' + fac[N-K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!modular inverse: <strong>' + invNK + '</strong>'; },
                  undo: function() { calcEl.innerHTML = K + '! = ' + fac[K] + ' → inverse = ' + fac[K] + '<sup>' + (MOD-2) + '</sup> mod ' + MOD + ' = <strong>' + invK + '</strong>'; infoEl.innerHTML = K + '!modular inverse: <strong>' + invK + '</strong>'; }
                },
                { description: 'Combine: ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = ' + ans,
                  action: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; },
                  undo: function() { calcEl.innerHTML = (N-K) + '! = ' + fac[N-K] + ' → inverse = <strong>' + invNK + '</strong>'; infoEl.innerHTML = (N-K) + '!modular inverse: <strong>' + invNK + '</strong>'; }
                },
                { description: 'Done! C(' + N + ',' + K + ') mod ' + MOD + ' = ' + ans,
                  action: function() { calcEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong style="font-size:1.2rem;color:var(--green);">' + ans + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ C(' + N + ',' + K + ') mod ' + MOD + ' = ' + ans + '</strong>'; },
                  undo: function() { calcEl.innerHTML = N + '! × (' + K + '!)⁻¹ × (' + (N-K) + '!)⁻¹ = ' + fac[N] + ' × ' + invK + ' × ' + invNK + ' mod ' + MOD + ' = <strong>' + ans + '</strong>'; infoEl.innerHTML = 'C(' + N + ',' + K + ') mod ' + MOD + ' = <strong>' + ans + '</strong>'; }
                }
            ];
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_N, DEF_K, DEF_MOD);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpN.value) || 0, parseInt(inpK.value) || 0, parseInt(inpMod.value) || 7);
        });
    },

    // ====================================================================
    // Simulation 6: Matrix Multiplication (boj-2740)
    // ====================================================================
    _renderVizMatMul(container) {
        var self = this, suffix = '-matmul';
        var DEF_A = '1,2;3,4', DEF_B = '-1,0;0,3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Matrix Multiplication</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Computes 2x2 Matrix A x B step by step. (rows separated by ;)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">A: <input type="text" id="dc-matmul-a" value="' + DEF_A + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<label style="font-weight:600;">B: <input type="text" id="dc-matmul-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<button class="btn btn-primary" id="dc-matmul-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpA = container.querySelector('#dc-matmul-a');
        var inpB = container.querySelector('#dc-matmul-b');
        var resetBtn = container.querySelector('#dc-matmul-reset');

        function parseMat(s) {
            return s.trim().split(';').map(function(row) { return row.split(',').map(function(v) { return parseInt(v) || 0; }); });
        }
        function showMat(m, label) {
            var cols = m[0].length;
            return '<div style="display:inline-block;margin:0 8px;vertical-align:middle;"><div style="font-size:0.8rem;color:var(--text3);margin-bottom:4px;">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:8px;display:inline-grid;grid-template-columns:repeat(' + cols + ',1fr);gap:4px;">' + m.map(function(row) { return row.map(function(v) { return '<span style="padding:4px 8px;text-align:center;">' + v + '</span>'; }).join(''); }).join('') + '</div></div>';
        }

        function buildAndRun(A, B) {
            var N = A.length, M = A[0].length, K = B[0].length;
            var C = [];
            for (var i = 0; i < N; i++) { C[i] = []; for (var j = 0; j < K; j++) C[i][j] = 0; }
            matEl.innerHTML = showMat(A, 'A') + ' × ' + showMat(B, 'B') + ' = ' + showMat(C, 'C');
            infoEl.innerHTML = '<span style="color:var(--text2);">C[i][j] = sum(A[i][k] × B[k][j])</span>';

            var steps = [];
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < K; j++) {
                    (function(ii, jj) {
                        var val = 0;
                        var parts = [];
                        for (var k = 0; k < M; k++) { val += A[ii][k] * B[k][jj]; parts.push(A[ii][k] + '×' + B[k][jj]); }
                        var isLast = (ii === N - 1 && jj === K - 1);
                        steps.push({
                            description: 'C[' + ii + '][' + jj + '] = ' + parts.join(' + ') + ' = ' + val + (isLast ? '. Done!' : ''),
                            action: function() {
                                C[ii][jj] = val;
                                matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C');
                                if (isLast) {
                                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Done! C = [' + C.map(function(r){return '['+r.join(',')+']';}).join(',') + ']</strong>';
                                } else {
                                    infoEl.innerHTML = 'C[' + ii + '][' + jj + '] = ' + parts.join(' + ') + ' = <strong>' + val + '</strong>';
                                }
                            },
                            undo: function() {
                                C[ii][jj] = 0;
                                matEl.innerHTML = showMat(A,'A') + ' × ' + showMat(B,'B') + ' = ' + showMat(C,'C');
                                infoEl.innerHTML = '(undo)';
                            }
                        });
                    })(i, j);
                }
            }
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseMat(DEF_A), parseMat(DEF_B));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseMat(inpA.value), parseMat(inpB.value));
        });
    },

    // ====================================================================
    // Simulation 7: Matrix Exponentiation (boj-10830)
    // ====================================================================
    _renderVizMatPow(container) {
        var self = this, suffix = '-matpow';
        var DEF_MAT = '1,2;3,4', DEF_B = 5, DEF_MOD = 1000;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Matrix Exponentiation</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Computes 2x2 matrix exponentiation via divide and conquer. (rows separated by ;)</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Matrix: <input type="text" id="dc-matpow-mat" value="' + DEF_MAT + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:140px;"></label>' +
            '<label style="font-weight:600;">exponent: <input type="number" id="dc-matpow-b" value="' + DEF_B + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">mod: <input type="number" id="dc-matpow-mod" value="' + DEF_MOD + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:100px;"></label>' +
            '<button class="btn btn-primary" id="dc-matpow-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-mat' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var matEl = container.querySelector('#dc-mat' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpMat = container.querySelector('#dc-matpow-mat');
        var inpB = container.querySelector('#dc-matpow-b');
        var inpMod = container.querySelector('#dc-matpow-mod');
        var resetBtn = container.querySelector('#dc-matpow-reset');

        function parseMat(s) {
            return s.trim().split(';').map(function(row) { return row.split(',').map(function(v) { return parseInt(v) || 0; }); });
        }
        function showM(m, label) {
            return '<div style="display:inline-block;vertical-align:middle;margin:0 6px;"><div style="font-size:0.75rem;color:var(--text3);">' + label + '</div><div style="border:2px solid var(--border);border-radius:6px;padding:6px;display:inline-grid;grid-template-columns:1fr 1fr;gap:2px;">' + m[0][0] + ' ' + m[0][1] + '<br>' + m[1][0] + ' ' + m[1][1] + '</div></div>';
        }
        function matStr(m) { return '[[' + m[0].join(',') + '],[' + m[1].join(',') + ']]'; }

        function buildAndRun(M, B, MOD) {
            if (B < 1) B = 1;
            if (MOD < 1) MOD = 1;
            function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=(r[i][j]+X[i][k]*Y[k][j])%MOD; return r; }
            function matPow(base, exp) { if (exp === 1) return [[base[0][0]%MOD,base[0][1]%MOD],[base[1][0]%MOD,base[1][1]%MOD]]; var half = matPow(base, Math.floor(exp/2)); var result = mm(half,half); if (exp%2===1) result = mm(result,base); return result; }

            // Build list of exponents during the divide phase
            var exps = [];
            var e = B;
            while (e > 1) { exps.push(e); e = Math.floor(e / 2); }
            exps.push(e); // base case (1)

            matEl.innerHTML = 'M<sup>' + B + '</sup> mod ' + MOD + ' computed via divide and conquer.';
            infoEl.innerHTML = '<span style="color:var(--text2);">Halving the exponent to perform matrix exponentiation.</span>';

            var steps = [];
            // Divide phase: top-down (excluding base case)
            for (var i = 0; i < exps.length - 1; i++) {
                (function(exp) {
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: 'M^' + exp + ' = M^' + half + ' × M^' + half + (odd ? ' × M' : '') + ' (' + (odd ? 'odd' : 'even') + ')',
                        action: function() { matEl.innerHTML = 'M<sup>' + exp + '</sup> → compute M<sup>' + half + '</sup> first!'; infoEl.innerHTML = (odd ? 'odd' : 'even') + ' exponent: M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> × M<sup>' + half + '</sup>' + (odd ? ' × M' : ''); },
                        undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }
            // base case: M^1 = M mod MOD
            var M1 = [[M[0][0]%MOD,M[0][1]%MOD],[M[1][0]%MOD,M[1][1]%MOD]];
            steps.push({
                description: 'M^1 = ' + matStr(M1) + ' (mod ' + MOD + ')',
                action: function() { matEl.innerHTML = showM(M1, 'M¹'); infoEl.innerHTML = 'base case: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            // Combine phase: bottom-up
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(M, exp);
                    var superscripts = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
                    var supStr = ('' + exp).split('').map(function(d){return superscripts[d]||d;}).join('');
                    steps.push({
                        description: 'M^' + exp + ' = ' + matStr(result),
                        action: function() { matEl.innerHTML = showM(result, 'M' + supStr); infoEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); },
                        undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }
            // Final result
            var finalM = matPow(M, B);
            steps.push({
                description: 'Done! M^' + B + ' mod ' + MOD + ' = ' + matStr(finalM),
                action: function() { matEl.innerHTML = showM(finalM, 'M^' + B + ' mod ' + MOD); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Done! ' + matStr(finalM) + '</strong>'; },
                undo: function() { matEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseMat(DEF_MAT), DEF_B, DEF_MOD);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseMat(inpMat.value), parseInt(inpB.value) || 1, parseInt(inpMod.value) || 1000);
        });
    },

    // ====================================================================
    // Simulation 8: Fibonacci Number 6 (boj-11444)
    // ====================================================================
    _renderVizFibMat(container) {
        var self = this, suffix = '-fibmat';
        var DEF_N = 10;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Fibonacci Number (Matrix Exponentiation)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">[[1,1],[1,0]]<sup>N</sup>[0][1] gives F(N).</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N: <input type="number" id="dc-fibmat-n" value="' + DEF_N + '" min="1" max="50" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<button class="btn btn-primary" id="dc-fibmat-reset">🔄</button>' +
            '<span style="font-size:0.8rem;color:var(--text3);">(range 1~50 for visualization)</span>' +
            '</div>' +
            '<div id="dc-fib' + suffix + '" style="padding:12px;background:var(--bg);border-radius:8px;font-family:monospace;margin-bottom:12px;text-align:center;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var fibEl = container.querySelector('#dc-fib' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inpN = container.querySelector('#dc-fibmat-n');
        var resetBtn = container.querySelector('#dc-fibmat-reset');

        function buildAndRun(n) {
            if (n < 1) n = 1;
            if (n > 50) n = 50;
            function mm(X,Y) { var r=[[0,0],[0,0]]; for(var i=0;i<2;i++) for(var j=0;j<2;j++) for(var k=0;k<2;k++) r[i][j]=r[i][j]+X[i][k]*Y[k][j]; return r; }
            function matPow(base, exp) { if (exp === 1) return [[base[0][0],base[0][1]],[base[1][0],base[1][1]]]; var half = matPow(base, Math.floor(exp/2)); var result = mm(half,half); if (exp%2===1) result = mm(result,base); return result; }
            function matStr(m) { return '[[' + m[0].join(',') + '],[' + m[1].join(',') + ']]'; }

            fibEl.textContent = '[[1,1],[1,0]]^' + n + ' computed via divide and conquer.';
            infoEl.innerHTML = '<span style="color:var(--text2);">F(' + n + ') = [[1,1],[1,0]]^' + n + ' [0][1] element</span>';

            // Exponent splitting list
            var exps = [];
            var e = n;
            while (e > 1) { exps.push(e); e = Math.floor(e / 2); }
            exps.push(e);

            var base = [[1,1],[1,0]];
            var steps = [];

            // Divide phase
            for (var i = 0; i < exps.length - 1; i++) {
                (function(exp) {
                    var half = Math.floor(exp / 2);
                    var odd = exp % 2 === 1;
                    steps.push({
                        description: 'M^' + exp + ' = M^' + half + ' x M^' + half + (odd ? ' x M' : '') + '. ' + (odd ? 'odd' : 'even') + ', so ' + (odd ? 'half x half x M' : 'half x half') + '!',
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = M<sup>' + half + '</sup> x M<sup>' + half + '</sup>' + (odd ? ' x M' : '') + ' (' + (odd ? 'odd' : 'even') + ')'; infoEl.innerHTML = exp + ' is ' + (odd ? 'odd' : 'even') + ' → <strong>compute M^' + half + ' first</strong>'; },
                        undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }

            // base case: M^1
            var M1 = [[1,1],[1,0]];
            steps.push({
                description: 'M^1 = [[1,1],[1,0]] (base case)',
                action: function() { fibEl.innerHTML = 'M<sup>1</sup> = ' + matStr(M1); infoEl.innerHTML = 'base case: M<sup>1</sup> = ' + matStr(M1); },
                undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });

            // Combine phase
            for (var i = exps.length - 2; i >= 0; i--) {
                (function(exp) {
                    var result = matPow(base, exp);
                    steps.push({
                        description: 'M^' + exp + ' = ' + matStr(result),
                        action: function() { fibEl.innerHTML = 'M<sup>' + exp + '</sup> = ' + matStr(result); infoEl.innerHTML = 'M<sup>' + exp + '</sup>[0][1] = <strong>' + result[0][1] + '</strong>'; },
                        undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
                    });
                })(exps[i]);
            }

            // Final result
            var finalM = matPow(base, n);
            var fibN = finalM[0][1];
            steps.push({
                description: 'Done! F(' + n + ') = ' + fibN,
                action: function() { fibEl.innerHTML = 'F(' + n + ') = M<sup>' + n + '</sup>[0][1] = <strong style="font-size:1.2rem;color:var(--green);">' + fibN + '</strong>'; infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ F(' + n + ') = ' + fibN + ' (computed in O(log n)!)</strong>'; },
                undo: function() { fibEl.innerHTML = '(undo)'; infoEl.innerHTML = '(undo)'; }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(DEF_N);
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseInt(inpN.value) || 10);
        });
    },

    // ====================================================================
    // Simulation 9: Histogram (boj-6549)
    // ====================================================================
    _renderVizHisto(container) {
        var self = this, suffix = '-histo';
        var DEF_BARS = '2,1,4,5,1,3,3';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Largest Rectangle in Histogram</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Finds the largest rectangle via divide and conquer.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Heights (comma-separated): <input type="text" id="dc-histo-input" value="' + DEF_BARS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="dc-histo-reset">🔄</button>' +
            '</div>' +
            '<div id="dc-bars' + suffix + '" style="display:flex;gap:2px;align-items:flex-end;height:160px;margin-bottom:12px;"></div>' +
            '<div id="dc-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#dc-bars' + suffix);
        var infoEl = container.querySelector('#dc-info' + suffix);
        var inputEl = container.querySelector('#dc-histo-input');
        var resetBtn = container.querySelector('#dc-histo-reset');

        function parseBars(s) { return s.trim().split(',').map(function(v) { return Math.max(0, parseInt(v) || 0); }).filter(function(v) { return v >= 0; }); }

        function buildAndRun(bars) {
            if (bars.length < 1) bars = [1];
            var maxH = Math.max.apply(null, bars) || 1;

            function renderBars(highlights, rectRange) {
                barsEl.innerHTML = bars.map(function(h, i) {
                    var pct = (h / maxH) * 100;
                    var bg = 'var(--accent)';
                    var extra = '';
                    if (highlights && highlights[i]) { bg = highlights[i]; }
                    if (rectRange && i >= rectRange.l && i <= rectRange.r) { extra = 'box-shadow:0 0 6px var(--green)40;'; bg = 'var(--green)'; }
                    return '<div style="width:40px;height:' + (pct/100*160) + 'px;background:' + bg + ';border-radius:4px 4px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:4px;font-size:0.8rem;font-weight:600;color:white;' + extra + '">' + h + '</div>';
                }).join('');
            }
            renderBars(null, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Split array in half and find max among left, right, and crossing cases.</span>';

            // Find largest rectangle via divide and conquer (+ track where it came from)
            function solve(lo, hi) {
                if (lo === hi) return { area: bars[lo], l: lo, r: lo };
                var mid = Math.floor((lo + hi) / 2);
                var leftRes = solve(lo, mid);
                var rightRes = solve(mid + 1, hi);
                // Crossing case
                var l = mid, r = mid + 1;
                var h = Math.min(bars[l], bars[r]);
                var crossMax = h * 2, cl = l, cr = r;
                while (l > lo || r < hi) {
                    if (l > lo && (r >= hi || bars[l-1] >= bars[r+1])) { l--; h = Math.min(h, bars[l]); }
                    else { r++; h = Math.min(h, bars[r]); }
                    if (h * (r - l + 1) > crossMax) { crossMax = h * (r - l + 1); cl = l; cr = r; }
                }
                var crossRes = { area: crossMax, l: cl, r: cr };
                if (leftRes.area >= rightRes.area && leftRes.area >= crossRes.area) return leftRes;
                if (rightRes.area >= crossRes.area) return rightRes;
                return crossRes;
            }

            var n = bars.length;
            var mid = Math.floor((n - 1) / 2);
            var leftRes = n > 1 ? solve(0, mid) : { area: bars[0], l: 0, r: 0 };
            var rightRes = n > 1 ? solve(mid + 1, n - 1) : { area: 0, l: 0, r: 0 };
            // Crossing case
            var cl = mid, cr = mid + 1;
            if (cr >= n) cr = mid;
            var ch = n > 1 ? Math.min(bars[cl], bars[cr]) : bars[0];
            var crossMax = n > 1 ? ch * 2 : bars[0];
            var bestCl = cl, bestCr = cr;
            if (n > 1) {
                var tl = cl, tr = cr, th = ch;
                while (tl > 0 || tr < n - 1) {
                    if (tl > 0 && (tr >= n - 1 || bars[tl-1] >= bars[tr+1])) { tl--; th = Math.min(th, bars[tl]); }
                    else { tr++; th = Math.min(th, bars[tr]); }
                    if (th * (tr - tl + 1) > crossMax) { crossMax = th * (tr - tl + 1); bestCl = tl; bestCr = tr; }
                }
            }
            var crossRes = { area: crossMax, l: bestCl, r: bestCr };
            var best = leftRes;
            if (rightRes.area > best.area) best = rightRes;
            if (crossRes.area > best.area) best = crossRes;

            var steps = [];
            // Step 1: Split in half
            steps.push({
                description: 'Split [0..' + (n-1) + '] in half: left [0..' + mid + '], right [' + (mid+1) + '..' + (n-1) + ']',
                action: function() {
                    var h = {};
                    for (var i = 0; i <= mid; i++) h[i] = 'var(--accent)';
                    for (var i = mid+1; i < n; i++) h[i] = '#6c5ce7';
                    renderBars(h, null);
                    infoEl.innerHTML = 'Left [0..' + mid + '] (blue), right [' + (mid+1) + '..' + (n-1) + '] (purple)';
                },
                undo: function() { renderBars(null, null); infoEl.innerHTML = '<span style="color:var(--text2);">Split array in half and find max among left, right, and crossing cases.</span>'; }
            });
            // Step 2: Left max
            steps.push({
                description: 'Left [0..' + mid + '] max: bars[' + leftRes.l + '..' + leftRes.r + '], area=' + leftRes.area,
                action: function() { renderBars(null, {l: leftRes.l, r: leftRes.r}); infoEl.innerHTML = 'Left max: bars[' + leftRes.l + '..' + leftRes.r + '], area = <strong>' + leftRes.area + '</strong>'; },
                undo: function() { var h = {}; for (var i=0;i<=mid;i++) h[i]='var(--accent)'; for(var i=mid+1;i<n;i++) h[i]='#6c5ce7'; renderBars(h, null); infoEl.innerHTML = 'Left/right split'; }
            });
            // Step 3: Right max
            if (n > 1) {
                steps.push({
                    description: 'Right [' + (mid+1) + '..' + (n-1) + '] max: bars[' + rightRes.l + '..' + rightRes.r + '], area=' + rightRes.area,
                    action: function() { renderBars(null, {l: rightRes.l, r: rightRes.r}); infoEl.innerHTML = 'Right max: bars[' + rightRes.l + '..' + rightRes.r + '], area = <strong>' + rightRes.area + '</strong>'; },
                    undo: function() { renderBars(null, {l: leftRes.l, r: leftRes.r}); infoEl.innerHTML = 'Left max: <strong>' + leftRes.area + '</strong>'; }
                });
            }
            // Step 4: Crossing case
            if (n > 1) {
                steps.push({
                    description: 'Crossing case: expand from mid=' + mid + ' both ways -> bars[' + bestCl + '..' + bestCr + '], area=' + crossMax,
                    action: function() {
                        var h = {};
                        for (var i = bestCl; i <= bestCr; i++) h[i] = 'var(--red)';
                        renderBars(h, null);
                        infoEl.innerHTML = 'Crossing: bars[' + bestCl + '..' + bestCr + '], area = <strong>' + crossMax + '</strong>';
                    },
                    undo: function() { renderBars(null, {l: rightRes.l, r: rightRes.r}); infoEl.innerHTML = 'Right max: <strong>' + rightRes.area + '</strong>'; }
                });
            }
            // Step 5: Final result
            steps.push({
                description: 'Done! max(left ' + leftRes.area + ', right ' + rightRes.area + ', crossing ' + crossMax + ') = ' + best.area,
                action: function() { renderBars(null, {l: best.l, r: best.r}); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Largest rectangle area = ' + best.area + ' (bars[' + best.l + '..' + best.r + '])</strong>'; },
                undo: function() {
                    if (n > 1) { var h = {}; for (var i=bestCl;i<=bestCr;i++) h[i]='var(--red)'; renderBars(h, null); infoEl.innerHTML = 'Crossing: <strong>' + crossMax + '</strong>'; }
                    else { renderBars(null, null); infoEl.innerHTML = '(undo)'; }
                }
            });
            self._initStepController(container, steps, suffix);
        }

        buildAndRun(parseBars(DEF_BARS));
        resetBtn.addEventListener('click', function() {
            self._clearVizState();
            buildAndRun(parseBars(inputEl.value));
        });
    },

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Area Division', desc: 'Recursive 2D area partitioning (Silver)', problemIds: ['boj-2630', 'boj-1992', 'boj-1780'] },
        { num: 2, title: 'Exponentiation', desc: 'Divide and conquer exponentiation (Silver~Gold)', problemIds: ['boj-1629', 'boj-11401'] },
        { num: 3, title: 'Matrix', desc: 'Matrix multiplication + exponentiation (Silver~Gold)', problemIds: ['boj-2740', 'boj-10830', 'boj-11444'] },
        { num: 4, title: 'Advanced', desc: 'Range divide and conquer (Platinum)', problemIds: ['boj-6549'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: Area Division ==========
        {
            id: 'boj-2630', title: 'BOJ 2630 - Making Colored Paper', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2630',
            simIntro: 'Watch a 4x4 paper being recursively split into 4 parts, checking if each is a single color.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>A square-shaped piece of paper made up of multiple square cells is given, where each cell is colored either white or blue. We want to cut this paper according to a specific rule to create colored papers of various sizes that are entirely white or entirely blue. If the entire paper is a single color, use it as is; otherwise, split it into 4 equal parts and repeat recursively.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>8\n1 1 0 0 0 0 1 1\n1 1 0 0 0 0 1 1\n0 0 0 0 1 1 0 0\n0 0 0 0 1 1 0 0\n1 0 0 0 1 1 1 1\n0 1 0 0 1 1 1 1\n0 0 1 1 1 1 1 1\n0 0 1 1 1 1 1 1</pre></div>
        <div><strong>Output</strong><pre>9\n7</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N is one of 2, 4, 8, 16, 32, 64, 128</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'We need to count "how many white, how many blue" papers, so why not just <strong>check every single cell</strong>?<br><br>But wait — if you re-read the problem, we are not simply counting cells. We are counting <strong>"the number of paper pieces made entirely of one color"</strong>. In other words, an entire region must be the same color to count as one piece.' },
                { title: 'But there\'s a problem with this', content: 'So how do we determine whether a region is entirely one color?<br><br>If the whole paper is one color, we are done. But if not? The problem says to <strong>split into 4 equal parts</strong> and check each part again. This is exactly <strong>divide and conquer</strong>!<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;margin-top:8px;font-size:0.9rem;">Check entire region -> if not uniform, split into 4 -> check each part -> if not uniform, split again -> ... -> 1x1 is always counted</div>' },
                { title: 'What if we try this?', content: 'Let us create a <code>solve(r, c, size)</code> function:<br><br>1. Check if the size x size region starting at (r,c) is all the same color<br>2. If yes -> count that color +1, done!<br>3. If no -> <code>half = size / 2</code>, split into 4 and recursively call each<br><br><strong>Base case</strong>: if the region is 1x1, always count that cell. It cannot be split further!<br><br>Time complexity: at each level we check all cells, depth is log2(N), so <strong>O(N^2 log N)</strong>.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\n\nwhite = blue = 0\n\ndef solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n\n    if all_same:\n        if first == 0:\n            white += 1\n        else:\n            blue += 1\n    else:\n        half = size // 2\n        solve(r, c, half)\n        solve(r, c + half, half)\n        solve(r + half, c, half)\n        solve(r + half, c + half, half)\n\nsolve(0, 0, N)\nprint(white)\nprint(blue)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint paper[128][128];\nint N, white_cnt = 0, blue_cnt = 0;\n\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n\n    if (allSame) {\n        if (first == 0) white_cnt++;\n        else blue_cnt++;\n    } else {\n        int half = size / 2;\n        solve(r, c, half);\n        solve(r, c + half, half);\n        solve(r + half, c, half);\n        solve(r + half, c + half, half);\n    }\n}\n\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << white_cnt << "\\n" << blue_cnt << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Recursive 4-partition',
                description: 'If the region is one color, count it; otherwise split into 4 and recurse.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Fast input via sys.stdin.readline.\nPrepare a 2D list and white/blue counters.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\nwhite = blue = 0' },
                        { title: 'Recursive function', desc: 'If all cells are the same color, count and return.\nOtherwise, split into 4 and recurse on each.', code: 'def solve(r, c, size):\n    global white, blue\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        if first == 0: white += 1\n        else: blue += 1\n    else:\n        half = size // 2\n        for dr in (0, half):\n            for dc in (0, half):\n                solve(r+dr, c+dc, half)' },
                        { title: 'Run and output', desc: 'Start from the full paper (0,0,N) and recursively partition.', code: 'solve(0, 0, N)\nprint(white)\nprint(blue)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Declare 2D array globally and read via cin.', code: '#include <iostream>\nusing namespace std;\n\nint paper[128][128];\nint N, white_cnt = 0, blue_cnt = 0;  // global counters' },
                        { title: 'Recursive function', desc: 'Early exit optimization: && allSame condition stops as soon as a different color is found.', code: 'void solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    // Check if entire region is the same color\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n\n    if (allSame) {\n        if (first == 0) white_cnt++;\n        else blue_cnt++;\n    } else {\n        int half = size / 2;  // split into 4\n        solve(r, c, half);\n        solve(r, c + half, half);\n        solve(r + half, c, half);\n        solve(r + half, c + half, half);\n    }\n}' },
                        { title: 'Run and output', desc: 'Start from (0,0,N) and recursively partition into 4.', code: 'int main() {\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << white_cnt << "\\n" << blue_cnt << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1992', title: 'BOJ 1992 - Quadtree', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1992',
            simIntro: 'Watch a 4x4 image being compressed into a quadtree string.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>A quadtree is a data structure that compresses a black-and-white image. If the given N x N image is entirely 0, represent it as 0; if entirely 1, represent it as 1. Otherwise, split into 4 equal parts, recursively compress each, and wrap the result in parentheses. Order: top-left, top-right, bottom-left, bottom-right.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>8\n11110000\n11110000\n00011100\n00011100\n11110000\n11110000\n11110011\n11110011</pre></div>
        <div><strong>Output</strong><pre>((110(0101))(0010)(1(0010)0)100)</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N is a power of 2</li><li>1 ≤ N ≤ 64</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Doesn\'t this look similar to Making Colored Paper (2630)? If the region is all the same value, write that value; otherwise split into 4 parts!<br><br>But this time we need to produce a <strong>string representation</strong> instead of a count. We build a "compressed result" as a string and return it.' },
                { title: 'But there\'s a problem with this', content: 'Counting used a single global variable, but how do we combine strings?<br><br>The key is to make the <strong>recursive function return a string</strong>:<br>- All same -> return that value ("0" or "1")<br>- Different -> <strong>wrap the 4 results in parentheses</strong> and return<br><br>The order is <strong>top-left -> top-right -> bottom-left -> bottom-right</strong>. Getting this wrong means a wrong answer!' },
                { title: 'What if we try this?', content: 'The function structure looks like this:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>solve(r, c, size)</code>:<br>1. Entire region same value? -> return that value<br>2. Otherwise -> <code>"(" + solve(TL) + solve(TR) + solve(BL) + solve(BR) + ")"</code></div><br>Compared to the colored paper problem, "count +1" becomes "return string", and "recursive call" becomes "string concatenation". The structure is exactly the same!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]\n\ndef solve(r, c, size):\n    first = img[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if img[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half) + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\"\n\nprint(solve(0, 0, N))',
                cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint N;\nstring img[64];\nstring solve(int r, int c, int size) {\n    char first = img[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (img[i][j] != first) allSame = false;\n    if (allSame) return string(1, first);\n    int half = size / 2;\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n         + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n}\nint main() {\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> img[i];\n    cout << solve(0, 0, N) << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Recursive string combine',
                description: 'If all same, return that value; otherwise wrap 4 sub-results in parentheses.',
                timeComplexity: 'O(N² log N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Store each row as a string — img[r][c] gives direct access.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nimg = [input().strip() for _ in range(N)]' },
                        { title: 'Recursive function', desc: 'Unlike colored paper, returns a string instead of counting.\nIf mixed, wraps the 4 sub-results in parentheses.', code: 'def solve(r, c, size):\n    first = img[r][c]\n    all_same = all(img[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        return first\n    half = size // 2\n    return \"(\" + solve(r,c,half) + solve(r,c+half,half) + solve(r+half,c,half) + solve(r+half,c+half,half) + \")\"' },
                        { title: 'Output', desc: 'The final returned string is the quadtree compression result.', code: 'print(solve(0, 0, N))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Store each row in a string array.', code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint N;\nstring img[64];' },
                        { title: 'Recursive function', desc: 'Returns string — string(1, first) converts char to string.', code: 'string solve(int r, int c, int size) {\n    char first = img[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (img[i][j] != first) allSame = false;\n    if (allSame) return string(1, first);  // char -> string conversion\n    int half = size / 2;\n    return \"(\" + solve(r, c, half) + solve(r, c + half, half)\n         + solve(r + half, c, half) + solve(r + half, c + half, half) + \")\";\n}' },
                        { title: 'Output', desc: 'Print the entire string returned by solve on one line.', code: 'int main() {\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> img[i];\n    cout << solve(0, 0, N) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1780', title: 'BOJ 1780 - Paper Count', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1780',
            simIntro: 'Watch a 3x3 paper being split into 9 parts, checking if each has a uniform value.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>There is a paper represented as an N x N matrix. Each cell contains -1, 0, or 1. If the entire paper is filled with the same number, use it as is; otherwise, split into 9 equal parts and repeat recursively. Output the count of papers filled with only -1, only 0, and only 1.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>9\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n0 0 0 1 1 1 -1 -1 -1\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n1 1 1 0 0 0 0 0 0\n0 1 -1 0 1 -1 0 1 -1\n0 -1 1 0 -1 1 0 -1 1\n0 1 -1 1 0 -1 0 1 -1</pre></div>
        <div><strong>Output</strong><pre>10\n12\n11</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>N is of the form 3<sup>k</sup> (1 ≤ k ≤ 7, i.e., N ≤ 2,187)</li><li>Each cell contains only -1, 0, or 1</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'This looks almost the same as Making Colored Paper (2630)! If the region is all the same value, count it; otherwise split and recurse, right?<br><br>But there is one difference — this time there are not 2 values (white/blue) but <strong>3 values (-1, 0, 1)</strong>. We need 3 counters.' },
                { title: 'But there\'s a problem with this', content: 'Colored paper used 4-partition (2x2), but in this problem N is a power of 3. A 4-partition would not work!<br><br>Since N = 3<sup>k</sup>, we need to <strong>9-partition (3x3)</strong>. Divide with <code>third = size / 3</code> and make 3x3 = <strong>9 recursive calls</strong>.<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">4-partition (2x2) -> <code>half = size/2</code>, 4 calls<br>9-partition (3x3) -> <code>third = size/3</code>, 9 calls</div>' },
                { title: 'What if we try this?', content: 'Changes from the colored paper code:<br><br>1. <code>half = size // 2</code> -> <code>third = size // 3</code><br>2. Double loop over (0, half) -> double loop over <code>range(3)</code><br>3. Counters: 2 (white/blue) -> 3 (-1, 0, 1)<br><br>N is at most 2187 (= 3<sup>7</sup>), so recursion depth is at most 7 — no stack overflow worry!<br><br><span class="lang-py">In Python, counting with <code>cnt = {-1: 0, 0: 0, 1: 0}</code> dictionary is clean.</span><span class="lang-cpp">In C++, use <code>cnt[first + 1]++</code> for index mapping (-1->0, 0->1, 1->2).</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}\n\ndef solve(r, c, size):\n    first = paper[r][c]\n    all_same = True\n    for i in range(r, r + size):\n        for j in range(c, c + size):\n            if paper[i][j] != first:\n                all_same = False\n                break\n        if not all_same:\n            break\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr * third, c + dc * third, third)\n\nsolve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])',
                cpp: '#include <iostream>\nusing namespace std;\nint paper[2187][2187];\nint N, cnt[3];\nvoid solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n    if (allSame) { cnt[first + 1]++; }\n    else {\n        int t = size / 3;\n        for (int dr = 0; dr < 3; dr++)\n            for (int dc = 0; dc < 3; dc++)\n                solve(r + dr * t, c + dc * t, t);\n    }\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Recursive 9-partition',
                description: 'If all same, count it; otherwise split into 9 (size/3) and recurse.',
                timeComplexity: 'O(N² log₃N)',
                spaceComplexity: 'O(N²)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Use a dictionary to manage counters for the 3 types: -1, 0, 1.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\npaper = [list(map(int, input().split())) for _ in range(N)]\ncnt = {-1: 0, 0: 0, 1: 0}' },
                        { title: 'Recursive function', desc: 'The key difference is 9-partition (3x3) instead of 4.\nDivide by third = size // 3 and make 3x3 = 9 recursive calls.', code: 'def solve(r, c, size):\n    first = paper[r][c]\n    all_same = all(paper[i][j] == first\n        for i in range(r, r+size)\n        for j in range(c, c+size))\n    if all_same:\n        cnt[first] += 1\n    else:\n        third = size // 3\n        for dr in range(3):\n            for dc in range(3):\n                solve(r + dr*third, c + dc*third, third)' },
                        { title: 'Run and output', desc: 'Output in order: -1, 0, 1.', code: 'solve(0, 0, N)\nprint(cnt[-1])\nprint(cnt[0])\nprint(cnt[1])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'cnt[3] array: index 0->-1, 1->0, 2->1 (mapped via first+1).', code: '#include <iostream>\nusing namespace std;\n\nint paper[2187][2187];\nint N, cnt[3];  // cnt[0]=-1, cnt[1]=0, cnt[2]=1' },
                        { title: 'Recursive function', desc: 'Maps -1,0,1 to indices 0,1,2 via cnt[first+1].', code: 'void solve(int r, int c, int size) {\n    int first = paper[r][c];\n    bool allSame = true;\n    for (int i = r; i < r + size && allSame; i++)\n        for (int j = c; j < c + size && allSame; j++)\n            if (paper[i][j] != first) allSame = false;\n    if (allSame) {\n        cnt[first + 1]++;  // -1->0, 0->1, 1->2\n    } else {\n        int t = size / 3;  // 9-partition\n        for (int dr = 0; dr < 3; dr++)\n            for (int dc = 0; dc < 3; dc++)\n                solve(r + dr * t, c + dc * t, t);\n    }\n}' },
                        { title: 'Run and output', desc: 'ios::sync_with_stdio(false) for faster I/O — needed since N can be up to 2187.', code: 'int main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> paper[i][j];\n    solve(0, 0, N);\n    cout << cnt[0] << "\\n" << cnt[1] << "\\n" << cnt[2] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[2].templates; }
            }]
        },

        // ========== Stage 2: Exponentiation ==========
        {
            id: 'boj-1629', title: 'BOJ 1629 - Multiplication', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1629',
            simIntro: 'Watch A^B mod C being computed by halving the exponent at each step.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>We want to find the natural number A multiplied by itself B times. Since the result can be very large, write a program that computes the remainder when divided by C.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>10 11 12</pre></div>
        <div><strong>Output</strong><pre>4</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>A, B, C are all natural numbers at most 2,147,483,647</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Since we just multiply A by itself B times, why not loop B times?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;"><code>result = 1</code><br><code>for i in range(B): result = result * A % C</code></div><br>Looks simple, right?' },
                { title: 'But there\'s a problem with this', content: 'B can be up to <strong>2,147,483,647</strong> (about 2.1 billion)! Looping 2.1 billion times will definitely time out.<br><br>But recall a mathematical property:<br>- A<sup>8</sup> = A x A x A x A x A x A x A x A (8 multiplications)<br>- A<sup>8</sup> = (A<sup>4</sup>)<sup>2</sup> = ((A<sup>2</sup>)<sup>2</sup>)<sup>2</sup> (only <strong>3</strong> multiplications!)<br><br>By <strong>halving the exponent</strong>, the number of multiplications drops dramatically!' },
                { title: 'What if we try this?', content: '<strong>Divide and conquer exponentiation</strong>: halving the exponent each time gives O(log B)!<br><br>- B is even: A<sup>B</sup> = (A<sup>B/2</sup>)^2 mod C<br>- B is odd: A<sup>B</sup> = (A<sup>B/2</sup>)^2 x A mod C<br><br>Even for 2.1 billion, log2(2.1 billion) is about <strong>31 steps</strong>!<br><br><span class="lang-cpp">In C++, intermediate multiplications can overflow — <code>long long</code> is required!</span><span class="lang-py">Python handles big numbers automatically, so no overflow worries. The built-in <code>pow(A, B, C)</code> works on the same principle!</span>' }
            ],
            templates: {
                python: 'A, B, C = map(int, input().split())\n\ndef power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result\n\nprint(power(A, B, C))',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nll power(ll a, ll b, ll c) {\n    if (b == 1) return a % c;\n    ll half = power(a, b / 2, c);\n    ll result = half * half % c;\n    if (b % 2 == 1) result = result * a % c;\n    return result;\n}\nint main() {\n    ll A, B, C;\n    cin >> A >> B >> C;\n    cout << power(A, B, C) << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'divide and conquer Exponentiation',
                description: 'Halve the exponent each step to compute in O(log B).',
                timeComplexity: 'O(log B)',
                spaceComplexity: 'O(log B)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read three numbers A, B, C from one line.', code: 'A, B, C = map(int, input().split())' },
                        { title: 'Exponentiation function', desc: 'Core function that halves the exponent for O(log B).\nIf even, square; if odd, multiply once more.', code: 'def power(a, b, c):\n    if b == 1:\n        return a % c\n    half = power(a, b // 2, c)\n    result = half * half % c\n    if b % 2 == 1:\n        result = result * a % c\n    return result' },
                        { title: 'Output', desc: 'Python handles big numbers automatically, no overflow concern.', code: 'print(power(A, B, C))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'A,B,C up to 2.1 billion -> long long required.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;  // max 2^31-1, so long long needed\n\nll A, B, C;' },
                        { title: 'Exponentiation function', desc: 'Apply mod after every half*half to prevent overflow.', code: 'll power(ll a, ll b, ll c) {\n    if (b == 1) return a % c;\n    ll half = power(a, b / 2, c);\n    ll result = half * half % c;  // even: (a^(b/2))^2\n    if (b % 2 == 1)\n        result = result * a % c;  // odd: multiply once more\n    return result;\n}' },
                        { title: 'Output', desc: 'Read input then call power in main — simple structure.', code: 'int main() {\n    cin >> A >> B >> C;\n    cout << power(A, B, C) << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-11401', title: 'BOJ 11401 - Binomial Coefficient 3', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11401',
            simIntro: 'Watch binomial coefficients computed via modular inverse using Fermat\'s Little Theorem.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Given a natural number N and integer K, write a program to compute the binomial coefficient C(N, K) modulo 1,000,000,007. Use Fermat\'s Little Theorem to compute the modular inverse.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>5 2</pre></div>
        <div><strong>Output</strong><pre>10</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N ≤ 4,000,000</li><li>0 ≤ K ≤ N</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Since C(N, K) = N! / (K! x (N-K)!), why not compute the factorials and divide?<br><br>If we precompute up to N!, we can directly get the numerator (N!) and denominator (K! x (N-K)!).' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>4 million</strong>. The factorial of 4 million is astronomically large and cannot be directly divided.<br><br>That is why we compute the remainder modulo 1,000,000,007... but <strong>division does not work directly in modular arithmetic!</strong><br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">(a / b) % p != (a % p) / (b % p) -- this does not work!</div><br>How do we handle division?' },
                { title: 'What if we try this?', content: 'This is where <strong>Fermat\'s Little Theorem</strong> comes in!<br><br>When p is prime: <strong>a<sup>-1</sup> = a<sup>(p-2)</sup> mod p</strong><br><br>In other words, we can replace division with <strong>exponentiation (multiplication)</strong>!<br><br>C(N,K) mod p = N! x (K!)<sup>(p-2)</sup> x ((N-K)!)<sup>(p-2)</sup> mod p<br><br>Implementation in 3 steps:<br>1. Precompute factorial array (0! through N!)<br>2. Use <strong>divide and conquer exponentiation</strong> to compute the inverse<br>3. Multiply the three values and we are done!<br><br>The exponentiation code from problem 1629 can be reused directly here.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD\n\ndef power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1: result = result * a % mod\n    return result\n\nans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\nll fac[4000001];\nll power(ll a, ll b, ll mod) {\n    if (b == 0) return 1;\n    if (b == 1) return a % mod;\n    ll half = power(a, b / 2, mod);\n    ll result = half * half % mod;\n    if (b % 2 == 1) result = result * a % mod;\n    return result;\n}\nint main() {\n    int N, K; cin >> N >> K;\n    fac[0] = 1;\n    for (int i = 1; i <= N; i++) fac[i] = fac[i-1] * i % MOD;\n    ll ans = fac[N];\n    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Factorial + Fermat\'s Little Theorem',
                description: 'Precompute factorials, then compute inverse via divide and conquer exponentiation.',
                timeComplexity: 'O(N + log p)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input and factorials', desc: 'Precompute factorials from 0! to N!.\nUsed later in C(N,K) = N! / (K! * (N-K)!).', code: 'MOD = 1_000_000_007\nN, K = map(int, input().split())\n\nfac = [1] * (N + 1)\nfor i in range(1, N + 1):\n    fac[i] = fac[i - 1] * i % MOD' },
                        { title: 'Exponentiation (for inverse)', desc: 'Direct modular division is not possible. Use Fermat\'s Little Theorem.\na^(p-2) mod p is the modular inverse of a.', code: 'def power(a, b, mod):\n    if b == 0: return 1\n    if b == 1: return a % mod\n    half = power(a, b // 2, mod)\n    result = half * half % mod\n    if b % 2 == 1:\n        result = result * a % mod\n    return result' },
                        { title: 'Compute result', desc: 'N! x (K!)^(p-2) x ((N-K)!)^(p-2) mod p\nreplaces division with multiplication.', code: 'ans = fac[N]\nans = ans * power(fac[K], MOD - 2, MOD) % MOD\nans = ans * power(fac[N - K], MOD - 2, MOD) % MOD\nprint(ans)' }
                    ],
                    cpp: [
                        { title: 'Input and factorials', desc: 'Precompute factorials in a global array.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\nll fac[4000001];  // N up to 4 million' },
                        { title: 'Exponentiation (for inverse)', desc: 'Fermat\'s Little Theorem: a^(-1) ≡ a^(p-2) mod p.', code: 'll power(ll a, ll b, ll mod) {\n    if (b == 0) return 1;\n    if (b == 1) return a % mod;\n    ll half = power(a, b / 2, mod);\n    ll result = half * half % mod;\n    if (b % 2 == 1)\n        result = result * a % mod;\n    return result;\n}' },
                        { title: 'Compute result', desc: 'Precompute factorials in main, then compute C(N,K) via two inverse calls.', code: 'int main() {\n    int N, K;\n    cin >> N >> K;\n    fac[0] = 1;\n    for (int i = 1; i <= N; i++)\n        fac[i] = fac[i - 1] * i % MOD;\n    // C(N,K) = N! * (K!)^(p-2) * ((N-K)!)^(p-2)\n    ll ans = fac[N];\n    ans = ans * power(fac[K], MOD - 2, MOD) % MOD;\n    ans = ans * power(fac[N - K], MOD - 2, MOD) % MOD;\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[4].templates; }
            }]
        },

        // ========== Stage 3: Matrix ==========
        {
            id: 'boj-2740', title: 'BOJ 2740 - Matrix Multiplication', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2740',
            simIntro: 'Watch 2x2 matrix multiplication step by step.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Given an N x M matrix A and an M x K matrix B, write a program that outputs the product of the two matrices.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>3 2\n1 2\n3 4\n5 6\n2 3\n-1 -2 0\n0 0 3</pre></div>
        <div><strong>Output</strong><pre>-1 -2 6\n-3 -6 12\n-5 -10 18</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ N, M, K ≤ 100</li><li>Absolute value of matrix elements ≤ 100</li><li>Absolute value of result matrix elements ≤ 2<sup>31</sup></li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Let us recall the matrix multiplication rule. To get C[i][j], multiply <strong>row i of A</strong> with <strong>column j of B</strong> element-wise and sum.<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">C[i][j] = A[i][0] x B[0][j] + A[i][1] x B[1][j] + ... + A[i][M-1] x B[M-1][j]</div><br>This is the <strong>dot product</strong>!' },
                { title: 'But there\'s a problem with this', content: 'The result matrix C has size N x K, and computing each element requires M multiplications, so we need a <strong>triple nested loop</strong>:<br><br>- Outer: i = 0 to N-1 (row of C)<br>- Middle: j = 0 to K-1 (column of C)<br>- Inner: k = 0 to M-1 (dot product sum)<br><br>N, M, K <= 100, so at most 1 million operations — that is plenty for this problem!<br><br>Note: A must be N x <strong>M</strong> and B must be <strong>M</strong> x K for multiplication to work. Column count of A must equal row count of B!' },
                { title: 'What if we try this?', content: 'This problem itself is not divide and conquer — it is basic matrix multiplication. But it lays the <strong>foundation for matrix exponentiation</strong>!<br><br>Just like creating a function for number multiplication, if we make a <code>mat_mul(A, B)</code> function, we can reuse it directly in matrix exponentiation (problem 10830).<br><br><span class="lang-py">In Python, initialize cleanly with list comprehension: <code>C = [[0]*K for _ in range(N)]</code></span><span class="lang-cpp">In C++, use <code>int C[100][100] = {};</code> for zero initialization.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]\n\nC = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]\n\nfor row in C:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int N, M, M2, K;\n    cin >> N >> M;\n    int A[100][100], B[100][100], C[100][100] = {};\n    for (int i = 0; i < N; i++) for (int j = 0; j < M; j++) cin >> A[i][j];\n    cin >> M2 >> K;\n    for (int i = 0; i < M; i++) for (int j = 0; j < K; j++) cin >> B[i][j];\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < K; j++)\n            for (int k = 0; k < M; k++)\n                C[i][j] += A[i][k] * B[k][j];\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < K; j++) cout << C[i][j] << (j < K-1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Triple nested loop',
                description: 'Directly compute C[i][j] = sum(A[i][k] * B[k][j]).',
                timeComplexity: 'O(N × M × K)',
                spaceComplexity: 'O(N × K)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'A is N x M, B is M x K.\nColumn count of A = row count of B (M) must match for multiplication.', code: 'N, M = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nM2, K = map(int, input().split())\nB = [list(map(int, input().split())) for _ in range(M)]' },
                        { title: 'Matrix multiplication', desc: 'C[i][j] = dot product of row i of A and column j of B.\nTriple nested loop is the basic pattern for matrix multiplication.', code: 'C = [[0] * K for _ in range(N)]\nfor i in range(N):\n    for j in range(K):\n        for k in range(M):\n            C[i][j] += A[i][k] * B[k][j]' },
                        { title: 'Output', desc: 'Print each row with spaces separating elements.', code: 'for row in C:\n    print(\' \'.join(map(str, row)))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Declare matrices as static 2D arrays.', code: '#include <iostream>\nusing namespace std;\n\nint N, M, M2, K;\nint A[100][100], B[100][100], C[100][100];' },
                        { title: 'Matrix multiplication', desc: 'Row i, column j, sum over k — the foundational pattern for matrix exponentiation.', code: 'int main() {\n    cin >> N >> M;\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < M; j++)\n            cin >> A[i][j];\n    cin >> M2 >> K;\n    for (int i = 0; i < M; i++)\n        for (int j = 0; j < K; j++)\n            cin >> B[i][j];\n    // C[i][j] = sum(A[i][k] * B[k][j]) — triple loop\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < K; j++)\n            for (int k = 0; k < M; k++)\n                C[i][j] += A[i][k] * B[k][j];' },
                        { title: 'Output', desc: 'Print with no trailing space after the last column, just a newline.', code: '    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < K; j++)\n            cout << C[i][j] << (j < K - 1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-10830', title: 'BOJ 10830 - Matrix Exponentiation', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10830',
            simIntro: 'Watch matrix exponentiation performed via divide and conquer.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>Given an N x N matrix A, write a program to compute A raised to the B-th power. Since the numbers can be very large, output each element of A^B modulo 1,000.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>2 5\n1 2\n3 4</pre></div>
        <div><strong>Output</strong><pre>69 558\n337 406</pre></div>
    </div></div>
    <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
        <div><strong>Input</strong><pre>3 3\n1 2 3\n4 5 6\n7 8 9</pre></div>
        <div><strong>Output</strong><pre>468 576 684\n62 305 548\n656 34 412</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>2 ≤ N ≤ 5</li><li>1 ≤ B ≤ 100,000,000,000</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Since we multiply A by itself B times, why not loop and multiply the matrix B times?<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">result = identity matrix<br>for i in range(B): result = mat_mul(result, A)</div><br>We can reuse the matrix multiplication function from problem 2740!' },
                { title: 'But there\'s a problem with this', content: 'B can be up to <strong>100 billion</strong> (10<sup>11</sup>)! Repeating matrix multiplication 100 billion times will obviously time out.<br><br>But wait... does this pattern look familiar?<br><br>In problem 1629, we solved <strong>multiplying a number</strong> B times using divide and conquer in O(log B)! If we <strong>replace numbers with matrices</strong>, the same principle applies!' },
                { title: 'What if we try this?', content: 'Changes from problem 1629 code:<br><br>- <code>half * half</code> -> <code>mat_mul(half, half)</code><br>- <code>result * a</code> -> <code>mat_mul(result, A)</code><br>- Base case: when B=1, return A itself (with mod applied to each element!)<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">Number exponentiation: uses * operator<br>Matrix exponentiation: uses mat_mul function<br>The structure is <strong>exactly the same</strong>!</div><br>Apply <strong>mod 1000</strong> during each matrix multiplication to prevent overflow.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nresult = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))',
                cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\ntypedef long long ll;\ntypedef vector<vector<ll>> Matrix;\nint N; ll B;\nconst int MOD = 1000;\nMatrix mat_mul(const Matrix& X, const Matrix& Y) {\n    Matrix C(N, vector<ll>(N, 0));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            for (int k = 0; k < N; k++)\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD;\n    return C;\n}\nMatrix mat_pow(Matrix M, ll b) {\n    if (b == 1) { for (int i=0;i<N;i++) for (int j=0;j<N;j++) M[i][j]%=MOD; return M; }\n    Matrix half = mat_pow(M, b/2);\n    Matrix result = mat_mul(half, half);\n    if (b%2==1) result = mat_mul(result, M);\n    return result;\n}\nint main() {\n    cin >> N >> B;\n    Matrix A(N, vector<ll>(N));\n    for (int i=0;i<N;i++) for (int j=0;j<N;j++) cin >> A[i][j];\n    Matrix result = mat_pow(A, B);\n    for (int i=0;i<N;i++) { for (int j=0;j<N;j++) cout << result[i][j] << (j<N-1?" ":""); cout << "\\n"; }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Matrix divide and conquer Exponentiation',
                description: 'Apply the same principle as number exponentiation to matrices.',
                timeComplexity: 'O(N³ log B)',
                spaceComplexity: 'O(N² log B)',
                codeSteps: {
                    python: [
                        { title: 'Input and matrix multiplication', desc: 'mat_mul: matrix multiplication function. Apply mod at each\nelement computation to prevent intermediate values from growing.', code: 'N, B = map(int, input().split())\nA = [list(map(int, input().split())) for _ in range(N)]\nMOD = 1000\n\ndef mat_mul(X, Y):\n    n = len(X)\n    C = [[0]*n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] = (C[i][j] + X[i][k]*Y[k][j]) % MOD\n    return C' },
                        { title: 'Matrix exponentiation', desc: 'Same divide and conquer structure as number exponentiation.\nMultiplies and returns matrices instead of numbers.', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(N)] for i in range(N)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: 'Output', desc: 'Print each row of the result matrix separated by spaces.', code: 'result = mat_pow(A, B)\nfor row in result:\n    print(\' \'.join(map(str, row)))' }
                    ],
                    cpp: [
                        { title: 'Input and matrix multiplication', desc: 'Define matrix type as vector<vector<ll>>.', code: '#include <iostream>\n#include <vector>\nusing namespace std;\ntypedef long long ll;\ntypedef vector<vector<ll>> Matrix;\n\nint N; ll B;\nconst int MOD = 1000;\n\nMatrix mat_mul(const Matrix& X, const Matrix& Y) {\n    Matrix C(N, vector<ll>(N, 0));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            for (int k = 0; k < N; k++)\n                C[i][j] = (C[i][j] + X[i][k] * Y[k][j]) % MOD;\n    return C;\n}' },
                        { title: 'Matrix exponentiation', desc: 'Same divide and conquer as number exponentiation, applied to matrices.', code: 'Matrix mat_pow(Matrix M, ll b) {\n    if (b == 1) {\n        // base case: apply mod to each element\n        for (int i = 0; i < N; i++)\n            for (int j = 0; j < N; j++)\n                M[i][j] %= MOD;\n        return M;\n    }\n    Matrix half = mat_pow(M, b / 2);\n    Matrix result = mat_mul(half, half);\n    if (b % 2 == 1)\n        result = mat_mul(result, M);\n    return result;\n}' },
                        { title: 'Output', desc: 'B can be up to 100 billion -> must use ll type.', code: 'int main() {\n    cin >> N >> B;\n    Matrix A(N, vector<ll>(N));\n    for (int i = 0; i < N; i++)\n        for (int j = 0; j < N; j++)\n            cin >> A[i][j];\n    Matrix result = mat_pow(A, B);\n    for (int i = 0; i < N; i++) {\n        for (int j = 0; j < N; j++)\n            cout << result[i][j] << (j < N - 1 ? " " : "");\n        cout << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[6].templates; }
            }]
        },
        {
            id: 'boj-11444', title: 'BOJ 11444 - Fibonacci Number 6', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/11444',
            simIntro: 'Observe the process of computing Fibonacci numbers via [[1,1],[1,0]]^n matrix exponentiation.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>The Fibonacci sequence starts with 0 and 1. The 0th Fibonacci number is 0 and the 1st is 1. Write a program to find the nth Fibonacci number using matrix exponentiation. Output the result modulo 1,000,000,007.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>1000</pre></div>
        <div><strong>Output</strong><pre>517691607</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>0 ≤ n ≤ 10<sup>18</sup></li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'Computing Fibonacci numbers is simple! We can use a loop to compute F(0), F(1), F(2), ... in order:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">a, b = 0, 1<br>for i in range(n): a, b = b, a + b</div><br>Would O(n) be enough?' },
                { title: 'But there\'s a problem with this', content: 'n can be up to <strong>10<sup>18</sup></strong> (a quintillion)! Looping 10<sup>18</sup> times is absolutely impossible.<br><br>We need to solve it in O(log n), but how do we apply divide and conquer to Fibonacci?<br><br>Here is the key idea -- <strong>the Fibonacci recurrence can be expressed as a matrix</strong>:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">[[F(n+1), F(n)], [F(n), F(n-1)]] = [[1,1],[1,0]]<sup>n</sup></div><br>And matrix exponentiation can be done in O(log n)!' },
                { title: 'What if we try this?', content: 'Just reuse the code from problem 10830 (Matrix Exponentiation) adapted for a <strong>2x2 matrix</strong>!<br><br>1. Base matrix: <code>base = [[1,1],[1,0]]</code><br>2. <code>mat_pow(base, n)</code> for O(log n) exponentiation<br>3. The result matrix <strong>[0][1]</strong> is F(n)!<br><br>Since the size is fixed at 2x2, implementing matrix multiplication directly is faster than using loops for a general NxN matrix.<br><br>Warning: edge cases -- if n=0 output 0, if n=1 output 1 directly. Matrix exponentiation should only be used when n &gt; 1!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nMOD = 1_000_000_007\nn = int(input())\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0] + X[0][1]*Y[1][0]) % MOD,\n         (X[0][0]*Y[0][1] + X[0][1]*Y[1][1]) % MOD],\n        [(X[1][0]*Y[0][0] + X[1][1]*Y[1][0]) % MOD,\n         (X[1][0]*Y[0][1] + X[1][1]*Y[1][1]) % MOD]\n    ]\n\ndef mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j] % MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result\n\nif n <= 1:\n    print(n)\nelse:\n    base = [[1, 1], [1, 0]]\n    result = mat_pow(base, n)\n    print(result[0][1])',
                cpp: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\ntypedef ll Matrix[2][2];\nvoid mat_mul(Matrix A, Matrix B, Matrix C) {\n    ll temp[2][2] = {};\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) for (int k=0;k<2;k++)\n        temp[i][j] = (temp[i][j] + A[i][k]*B[k][j]) % MOD;\n    for (int i=0;i<2;i++) for (int j=0;j<2;j++) C[i][j]=temp[i][j];\n}\nvoid mat_pow(Matrix M, ll b, Matrix result) {\n    if (b==1) { for(int i=0;i<2;i++) for(int j=0;j<2;j++) result[i][j]=M[i][j]%MOD; return; }\n    Matrix half; mat_pow(M,b/2,half);\n    mat_mul(half,half,result);\n    if (b%2==1) { Matrix tmp; for(int i=0;i<2;i++) for(int j=0;j<2;j++) tmp[i][j]=result[i][j]; mat_mul(tmp,M,result); }\n}\nint main() {\n    ll n; cin >> n;\n    if (n<=1) { cout << n; return 0; }\n    Matrix base = {{1,1},{1,0}}, result;\n    mat_pow(base,n,result);\n    cout << result[0][1] << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Matrix Exponentiation',
                description: 'Computes F(n) in O(log n) via [[1,1],[1,0]]^n.',
                timeComplexity: 'O(log n)',
                spaceComplexity: 'O(log n)',
                codeSteps: {
                    python: [
                        { title: 'Matrix multiplication', desc: 'Fixed 2x2 size, so direct implementation is faster than general NxN loops.\nApply mod at every multiplication to prevent overflow.', code: 'MOD = 1_000_000_007\n\ndef mat_mul(X, Y):\n    return [\n        [(X[0][0]*Y[0][0]+X[0][1]*Y[1][0])%MOD,\n         (X[0][0]*Y[0][1]+X[0][1]*Y[1][1])%MOD],\n        [(X[1][0]*Y[0][0]+X[1][1]*Y[1][0])%MOD,\n         (X[1][0]*Y[0][1]+X[1][1]*Y[1][1])%MOD]\n    ]' },
                        { title: 'Matrix exponentiation', desc: 'Computes [[1,1],[1,0]]^n in O(log n) via divide and conquer.\nSame structure as problem 10830.', code: 'def mat_pow(M, b):\n    if b == 1:\n        return [[M[i][j]%MOD for j in range(2)] for i in range(2)]\n    half = mat_pow(M, b // 2)\n    result = mat_mul(half, half)\n    if b % 2 == 1:\n        result = mat_mul(result, M)\n    return result' },
                        { title: 'Execution', desc: 'Handle n=0,1 as edge cases. Result matrix [0][1] is F(n).', code: 'n = int(input())\nif n <= 1:\n    print(n)\nelse:\n    base = [[1,1],[1,0]]\n    result = mat_pow(base, n)\n    print(result[0][1])  # F(n)' }
                    ],
                    cpp: [
                        { title: 'Matrix multiplication', desc: 'Uses typedef ll Matrix[2][2] for fixed 2x2 arrays. Uses temp to prevent overwriting the result during computation.', code: '#include <iostream>\nusing namespace std;\ntypedef long long ll;\nconst ll MOD = 1000000007;\ntypedef ll Matrix[2][2];\n\n// Use temp to safely copy into result C\nvoid mat_mul(Matrix A, Matrix B, Matrix C) {\n    ll temp[2][2] = {};\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 2; j++)\n            for (int k = 0; k < 2; k++)\n                temp[i][j] = (temp[i][j] + A[i][k] * B[k][j]) % MOD;\n    for (int i = 0; i < 2; i++)\n        for (int j = 0; j < 2; j++)\n            C[i][j] = temp[i][j];\n}' },
                        { title: 'Matrix exponentiation', desc: 'C-style arrays are passed by pointer.', code: 'void mat_pow(Matrix M, ll b, Matrix result) {\n    if (b == 1) {\n        for (int i = 0; i < 2; i++)\n            for (int j = 0; j < 2; j++)\n                result[i][j] = M[i][j] % MOD;\n        return;\n    }\n    Matrix half;\n    mat_pow(M, b / 2, half);\n    mat_mul(half, half, result);  // result = half^2\n    if (b % 2 == 1) {\n        Matrix tmp;\n        for (int i = 0; i < 2; i++)\n            for (int j = 0; j < 2; j++)\n                tmp[i][j] = result[i][j];\n        mat_mul(tmp, M, result);  // result = half^2 * M\n    }\n}' },
                        { title: 'Execution', desc: 'n can be up to 10^18, so ll is required. Handle n<=1 separately.', code: 'int main() {\n    ll n; cin >> n;\n    if (n <= 1) { cout << n; return 0; }\n    // [[1,1],[1,0]]^n [0][1] is F(n)\n    Matrix base = {{1, 1}, {1, 0}}, result;\n    mat_pow(base, n, result);\n    cout << result[0][1] << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[7].templates; }
            }]
        },

        // ========== Stage 4: Advanced ==========
        {
            id: 'boj-6549', title: 'BOJ 6549 - Largest Rectangle in a Histogram', difficulty: 'platinum',
            link: 'https://www.acmicpc.net/problem/6549',
            simIntro: 'Observe the process of dividing the histogram via divide and conquer to find the largest rectangle.',
            descriptionHTML: `
    <h3>Problem</h3>
    <p>A histogram is a shape where several rectangles are aligned along the bottom. Each rectangle has the same width, but their heights can all be different. Write a program to find the rectangle with the largest area in the histogram. The input consists of multiple test cases. The first number of each test case is n (1 ≤ n ≤ 100,000), followed by n heights. The program terminates when 0 is given as input.</p>
    <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
        <div><strong>Input</strong><pre>7 2 1 4 5 1 3 3\n4 1000 1000 1000 1000\n0</pre></div>
        <div><strong>Output</strong><pre>8\n4000</pre></div>
    </div></div>
    <h4>Constraints</h4>
    <ul><li>1 ≤ n ≤ 100,000</li><li>0 ≤ height ≤ 1,000,000,000</li><li>Program terminates when 0 is given as input</li></ul>
`,
            hints: [
                { title: 'First intuition', content: 'What if we use each bar as a starting point, expanding both left and right to find the maximum area?<br><br>For each bar i, find the contiguous range where heights are at least h[i], then area = h[i] x range length.<br><br>If we try this for every bar, we can find the maximum!' },
                { title: 'But there\'s a problem with this', content: 'If we search both directions for every bar, the worst case is O(n^2). With n up to <strong>100,000</strong>, that will time out!<br><br>Let us think of a divide and conquer approach. If we split the array in half, the largest rectangle must be one of <strong>three cases</strong>:<br><br><div style="background:var(--bg2);padding:12px;border-radius:8px;font-size:0.9rem;">1. Entirely in the left half<br>2. Entirely in the right half<br>3. Spanning across the middle</div><br>Cases 1 and 2 can be solved recursively, but how do we handle case 3?' },
                { title: 'What if we try this?', content: 'Case 3, spanning the middle: start from the two center bars and <strong>expand one step at a time toward the taller side</strong>!<br><br>At each expansion, update the minimum height, compute area = min height x width, and track the maximum.<br><br>Why expand toward the taller side? To maximize area, we need to keep the height as high as possible while widening!<br><br>Time complexity: T(n) = 2T(n/2) + O(n) -> <strong>O(n log n)</strong><br><br><span class="lang-cpp">Warning: in C++, height x width can overflow int range -- <code>long long</code> is required!</span><span class="lang-py">Python handles large numbers automatically, so no extra handling needed.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)\n    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))\n    return max(left_max, right_max, cross_max)\n\nwhile True:\n    line = list(map(int, input().split()))\n    if line[0] == 0: break\n    n = line[0]\n    heights = line[1:]\n    print(solve(heights, 0, n - 1))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint n; ll h[100001];\nll solve(int lo, int hi) {\n    if (lo == hi) return h[lo];\n    int mid = (lo + hi) / 2;\n    ll leftMax = solve(lo, mid), rightMax = solve(mid+1, hi);\n    int l = mid, r = mid + 1;\n    ll minH = min(h[l], h[r]), crossMax = minH * 2;\n    while (l > lo || r < hi) {\n        if (l > lo && (r >= hi || h[l-1] >= h[r+1])) { l--; minH = min(minH, h[l]); }\n        else { r++; minH = min(minH, h[r]); }\n        crossMax = max(crossMax, minH * (r - l + 1));\n    }\n    return max({leftMax, rightMax, crossMax});\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    while (cin >> n && n) {\n        for (int i = 0; i < n; i++) cin >> h[i];\n        cout << solve(0, n-1) << "\\n";\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'divide and conquer',
                description: 'Divides into left/right/spanning cases to find the largest rectangle.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'Divide and conquer function', desc: 'Recursively find the maximum in the left half and right half.\nBase case: if there is only one bar, its height is the maximum.', code: 'def solve(heights, lo, hi):\n    if lo == hi:\n        return heights[lo]\n    mid = (lo + hi) // 2\n    left_max = solve(heights, lo, mid)\n    right_max = solve(heights, mid + 1, hi)' },
                        { title: 'Spanning the middle case', desc: 'Start from the center and expand toward the taller side.\nAt each expansion, update the minimum height and compute the area.', code: '    l, r = mid, mid + 1\n    h = min(heights[l], heights[r])\n    cross_max = h * 2\n    while l > lo or r < hi:\n        if l > lo and (r >= hi or heights[l-1] >= heights[r+1]):\n            l -= 1\n            h = min(h, heights[l])\n        else:\n            r += 1\n            h = min(h, heights[r])\n        cross_max = max(cross_max, h * (r - l + 1))' },
                        { title: 'Return maximum', desc: 'Returns the maximum among the three cases: left, right, and spanning.', code: '    return max(left_max, right_max, cross_max)' }
                    ],
                    cpp: [
                        { title: 'Divide and conquer function', desc: 'Uses long long because height * width can overflow int range.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint n;\nll h[100001];\n\nll solve(int lo, int hi) {\n    if (lo == hi) return h[lo];\n    int mid = (lo + hi) / 2;\n    ll leftMax = solve(lo, mid);\n    ll rightMax = solve(mid + 1, hi);' },
                        { title: 'Spanning the middle case', desc: 'Expands toward the taller side and updates the maximum area.', code: '    int l = mid, r = mid + 1;\n    ll minH = min(h[l], h[r]);\n    ll crossMax = minH * 2;\n    // Expand both sides: prioritize the taller side\n    while (l > lo || r < hi) {\n        if (l > lo && (r >= hi || h[l-1] >= h[r+1])) {\n            l--;\n            minH = min(minH, h[l]);\n        } else {\n            r++;\n            minH = min(minH, h[r]);\n        }\n        crossMax = max(crossMax, minH * (r - l + 1));\n    }' },
                        { title: 'Return maximum', desc: 'max({a,b,c}) uses initializer_list to return the maximum of three values.\nRepeats test cases until 0 is given as input.', code: '    return max({leftMax, rightMax, crossMax});\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    while (cin >> n && n) {\n        for (int i = 0; i < n; i++) cin >> h[i];\n        cout << solve(0, n - 1) << "\\n";\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return divideConquerTopic.problems[8].templates; }
            }]
        }
    ]
};

// ===== Register =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.divideconquer = divideConquerTopic;
