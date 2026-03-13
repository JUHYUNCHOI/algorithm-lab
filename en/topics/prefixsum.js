// ===== Prefix Sum Topic Module =====
var prefixSumTopic = {
    id: 'prefixsum',
    title: 'Prefix Sum',
    icon: '📊',
    category: 'Algorithm Techniques',
    order: 14,
    description: 'A technique for computing range sums in constant time',
    relatedNote: 'Prefix sums can be extended to IMOS method (difference arrays), 2D applications, and combinations with modular arithmetic.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-11659': { type: '1D Prefix Sum', color: 'var(--accent)', vizMethod: '_renderVizRange', suffix: '-range' },
        'boj-2559':  { type: 'Range Sum', color: 'var(--green)', vizMethod: '_renderVizWindow', suffix: '-win' },
        'boj-16139': { type: 'Per-Character Prefix', color: '#e17055', vizMethod: '_renderVizCharSum', suffix: '-char' },
        'boj-10986': { type: 'Modular Sum', color: '#6c5ce7', vizMethod: '_renderVizModSum', suffix: '-mod' },
        'boj-11660': { type: '2D Prefix Sum', color: '#00b894', vizMethod: '_renderViz2DSum', suffix: '-2d' },
        'boj-25682': { type: '2D Application', color: '#d63031', vizMethod: '_renderVizChess', suffix: '-chess' }
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
            sim:     { intro: prob.simIntro || 'See how prefix sums actually work in practice.', icon: '🎮' },
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

    _renderProblemTab: function(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
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
                <h2>📊 Prefix Sum</h2>\
                <p class="hero-sub">By precomputing cumulative sums, you can answer any range sum query in constant time</p>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">1</span> What is a Prefix Sum?</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Imagine you save pocket money in a piggy bank every day.<br>\
                    Monday $3, Tuesday $1, Wednesday $4, Thursday $1, Friday $5.<br><br>\
                    The piggy bank label shows the <strong>running total so far</strong>:<br>\
                    <code>$0 → $3 → $4 → $8 → $9 → $14</code><br><br>\
                    Now if you want to know "how much was saved from Tuesday to Thursday"?<br>\
                    <strong>Total through Thursday ($9) - Total through Monday ($3) = $6</strong><br>\
                    This is exactly a <strong>prefix sum</strong>!\
                </div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.wikipedia.org/wiki/Prefix_sum" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Prefix Sum ↗</a>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Original array\n\
arr    = [3, 1, 4, 1, 5]\n\
\n\
# Prefix sum array (add 0 at the front)\n\
prefix = [0, 3, 4, 8, 9, 14]\n\
#         ↑  ↑  ↑  ↑  ↑   ↑\n\
#         0  3 3+1 4+4 8+1 9+5\n\
\n\
# Sum of 2nd~4th = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Original array\n\
vector&lt;int&gt; arr = {3, 1, 4, 1, 5};\n\
\n\
// Prefix sum array (add 0 at the front)\n\
vector&lt;int&gt; prefix = {0, 3, 4, 8, 9, 14};\n\
//                     ↑  ↑  ↑  ↑  ↑   ↑\n\
//                     0  3 3+1 4+4 8+1 9+5\n\
\n\
// Sum of 2nd~4th = prefix[4] - prefix[1] = 9 - 3 = 6</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">What is the sum from the 3rd to 5th element of the array [3, 1, 4, 1, 5]??</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        The answer is <strong>10</strong>!<br>\
                        Prefix sum array: [0, 3, 4, 8, 9, 14]<br>\
                        prefix[5] - prefix[2] = 14 - 4 = <strong>10</strong><br>\
                        Indeed 4 + 1 + 5 = 10, correct!\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">2</span> How to Build a Prefix Sum</div>\
                <div class="concept-grid">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <rect x="5" y="50" width="12" height="20" rx="2" fill="var(--accent)" opacity="0.4"/>\
                                <rect x="22" y="40" width="12" height="30" rx="2" fill="var(--accent)" opacity="0.55"/>\
                                <rect x="39" y="25" width="12" height="45" rx="2" fill="var(--accent)" opacity="0.7"/>\
                                <rect x="56" y="10" width="12" height="60" rx="2" fill="var(--accent)" opacity="0.9"/>\
                            </svg>\
                        </div>\
                        <h3>Build One at a Time</h3>\
                        <p><code>prefix[i] = prefix[i-1] + arr[i]</code><br>Just add the current value to the previous cumulative sum.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg viewBox="0 0 80 80" class="icon-svg">\
                                <circle cx="40" cy="40" r="25" fill="none" stroke="var(--green)" stroke-width="3"/>\
                                <text x="40" y="46" text-anchor="middle" fill="var(--green)" font-size="24" font-weight="bold">O(N)</text>\
                            </svg>\
                        </div>\
                        <h3>One Pass is Enough</h3>\
                        <p>Building the prefix sum array only requires <strong>one pass</strong> through the array.</p>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Building the prefix sum array\n\
N = len(arr)\n\
prefix = [0] * (N + 1)       # Length N+1 (index 0 is 0)\n\
\n\
for i in range(1, N + 1):\n\
    prefix[i] = prefix[i - 1] + arr[i - 1]\n\
\n\
# Result: prefix = [0, 3, 4, 8, 9, 14]</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Building the prefix sum array\n\
int N = arr.size();\n\
vector&lt;int&gt; prefix(N + 1, 0); // Length N+1 (index 0 is 0)\n\
\n\
for (int i = 1; i &lt;= N; i++) {\n\
    prefix[i] = prefix[i - 1] + arr[i - 1];\n\
}\n\
\n\
// Result: prefix = {0, 3, 4, 8, 9, 14}</code></pre></div></span>\
\
                <div style="margin:0.8rem 0 0.5rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/itertools.html#itertools.accumulate" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: itertools.accumulate() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/partial_sum" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: partial_sum ↗</a></span>\
                    <p style="font-size:0.85rem;color:var(--text2);margin-top:4px;">\
                        <span class="lang-py"><code>itertools.accumulate(arr)</code> \u2014 A standard library function that automatically builds prefix sums.</span>\
                        <span class="lang-cpp"><code>std::partial_sum()</code> \u2014 A prefix sum building function in the &lt;numeric&gt; header.</span>\
                    </p>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Why do we put a 0 at the front of the prefix sum array??</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Because it makes computing <strong>range sums starting from the first element</strong> convenient!<br>\
                        For example, sum of 1st~3rd = prefix[3] - prefix[0] = 8 - 0 = 8<br>\
                        Without the 0, ranges starting from index 1 would require special handling.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">3</span> Range Sum in One Shot!</div>\
                <div class="approach-grid">\
                    <div class="approach-card">\
                        <h4>Using a loop</h4>\
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Find the sum from L-th to R-th\n\
total = 0\n\
for i in range(L, R + 1):\n\
    total += arr[i]\n\
# Time: O(N) — must add from the start for every query</code></pre></div></span>\
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Find the sum from L-th to R-th\n\
int total = 0;\n\
for (int i = L; i &lt;= R; i++) {\n\
    total += arr[i];\n\
}\n\
// Time: O(N) — must add from the start for every query</code></pre></div></span>\
                        <p class="approach-note">With M queries, total <strong>O(N × M)</strong> → Slow!</p>\
                    </div>\
                    <div class="approach-card featured">\
                        <h4>Using prefix sums</h4>\
                        <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Find the sum from L-th to R-th\n\
total = prefix[R] - prefix[L - 1]\n\
# Time: O(1) — just one subtraction!</code></pre></div></span>\
                        <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Find the sum from L-th to R-th\n\
int total = prefix[R] - prefix[L - 1];\n\
// Time: O(1) — just one subtraction!</code></pre></div></span>\
                        <p class="approach-note">Even with M queries, total <strong>O(N + M)</strong> → Fast!</p>\
                    </div>\
                </div>\
\
                <div class="key-difference-box">\
                    <strong>Key Formula:</strong>\
                    <code>arr[L] + arr[L+1] + ... + arr[R] = prefix[R] - prefix[L-1]</code><br>\
                    <span style="color:var(--text2)">Subtracting the sum up to L-1 from the sum up to R leaves only the sum from L to R!</span>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">If the array has 100,000 elements and there are 100,000 queries, how many operations does the loop approach take vs. prefix sums?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Loop: up to <strong>100,000 × 100,000 = 10 billion ops</strong> (TLE!)<br>\
                        Prefix sum: <strong>100,000 + 100,000 = 200,000 ops</strong> (instant!)<br><br>\
                        This difference is exactly why we use prefix sums.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">4</span> 2D Prefix Sum</div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> Imagine a grid-shaped map where each cell has treasure.<br>\
                    To quickly answer "How many treasures are in this rectangular area?",<br>\
                    <strong>precompute the total treasures from the top-left corner (1,1) to each cell</strong>!\
                </div>\
\
                <p style="margin: 1rem 0 0.5rem; font-weight: 600;">2D Prefix Sum Formula (Inclusion-Exclusion Principle)</p>\
                <div class="ps-2d-formula">\
                    <div class="ps-2d-step">\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area full">Full</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-top">Top</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c2]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">−</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area sub-left">Left</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r2][c1-1]</span>\
                    </div>\
                    <div class="ps-2d-step">\
                        <span class="ps-2d-minus">+</span>\
                        <div class="ps-2d-grid-mini">\
                            <div class="ps-2d-area add-corner">Overlap</div>\
                        </div>\
                        <span class="ps-2d-op">prefix[r1-1][c1-1]</span>\
                    </div>\
                </div>\
\
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Build 2D prefix sum\n\
for i in range(1, N + 1):\n\
    for j in range(1, M + 1):\n\
        prefix[i][j] = (arr[i][j]\n\
                       + prefix[i-1][j]\n\
                       + prefix[i][j-1]\n\
                       - prefix[i-1][j-1])\n\
\n\
# Sum of region (r1, c1) ~ (r2, c2)\n\
def query(r1, c1, r2, c2):\n\
    return (prefix[r2][c2]\n\
          - prefix[r1-1][c2]\n\
          - prefix[r2][c1-1]\n\
          + prefix[r1-1][c1-1])</code></pre></div></span>\
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Build 2D prefix sum\n\
for (int i = 1; i &lt;= N; i++) {\n\
    for (int j = 1; j &lt;= M; j++) {\n\
        prefix[i][j] = arr[i][j]\n\
                     + prefix[i-1][j]\n\
                     + prefix[i][j-1]\n\
                     - prefix[i-1][j-1];\n\
    }\n\
}\n\
\n\
// Sum of region (r1, c1) ~ (r2, c2)\n\
int query(int r1, int c1, int r2, int c2) {\n\
    return prefix[r2][c2]\n\
         - prefix[r1-1][c2]\n\
         - prefix[r2][c1-1]\n\
         + prefix[r1-1][c1-1];\n\
}</code></pre></div></span>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">In 2D, why do we subtract and then add back a part?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        When we subtract the top and left, <strong>the top-left corner gets subtracted twice</strong>!<br>\
                        We add it back once to get the correct value.<br>\
                        This is called the <strong>Inclusion-Exclusion Principle</strong>.\
                    </div>\
                </div>\
            </div>\
\
            <div class="concept-section">\
                <div class="concept-section-title"><span class="section-num">5</span> 3 Steps to Solve Prefix Sum Problems</div>\
                <p style="color:var(--text2); margin-bottom:1rem;">When you encounter a prefix sum problem, follow these 3 steps.</p>\
                <div class="concept-grid" style="grid-template-columns: 1fr 1fr 1fr;">\
                    <div class="concept-card">\
                        <h3>① Build the Prefix Sum Array</h3>\
                        <p>Scan through the original array accumulating sums. For 2D, accumulate along rows and columns.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>② Apply the Formula</h3>\
                        <p>1D: <code>prefix[R] - prefix[L-1]</code><br>2D: Apply the inclusion-exclusion formula.</p>\
                    </div>\
                    <div class="concept-card">\
                        <h3>③ Check Edge Cases</h3>\
                        <p>Verify indices don\'t go below 0, and check special conditions like modular arithmetic.</p>\
                    </div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">When you see a problem that "asks for range sums multiple times," what approach should you think of first?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>Prefix Sum</strong>!<br>\
                        When you see the keyword "range sum," you should almost reflexively think of prefix sums.<br>\
                        Especially when "asked multiple times" is mentioned — loops would be too slow, and prefix sums are essential.\
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
                btn.textContent = ans.classList.contains('show') ? '🔼 Collapse' : '🤔 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== Visualization (concept suffix) =====
    renderVisualize: function(container) {
        var self = this;
        var suffix = 'concept-ps';
        container.innerHTML =
            '<h2>Prefix Sum Visualization</h2>' +
            '<div class="viz-type-selector">' +
            '<button class="viz-type-btn active" data-viz="ps1d">1D Prefix Sum</button>' +
            '<button class="viz-type-btn" data-viz="ps2d">2D Prefix Sum</button>' +
            '</div>' +
            '<div id="viz-content-' + suffix + '"></div>';
        var vizContent = container.querySelector('#viz-content-' + suffix);
        var buttons = container.querySelectorAll('.viz-type-btn');
        var switchViz = function(type) {
            self._clearVizState();
            buttons.forEach(function(b) { b.classList.toggle('active', b.dataset.viz === type); });
            vizContent.innerHTML = '';
            if (type === 'ps1d') self._renderConceptViz1D(vizContent, suffix);
            else self._renderConceptViz2D(vizContent, suffix);
        };
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() { switchViz(btn.dataset.viz); });
        });
        switchViz('ps1d');
    },

    _renderConceptViz1D: function(container, suffix) {
        var self = this;
        var arr = [3, 1, 4, 1, 5, 9, 2, 6];
        var prefix = [0];
        var i;
        for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
        container.innerHTML =
            '<div class="viz-card"><h3>1D Prefix Sum</h3>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-arr-' + suffix + '"></div>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;" id="cv1d-pref-' + suffix + '"></div>' +
            '<div id="cv1d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix) + '</div>';
        var arrEl = container.querySelector('#cv1d-arr-' + suffix);
        var prefEl = container.querySelector('#cv1d-pref-' + suffix);
        var infoEl = container.querySelector('#cv1d-info-' + suffix);
        arrEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">arr:</span>' + arr.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">' + v + '</div>'; }).join('');
        prefEl.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">prefix:</span>' + prefix.map(function(v, idx) { return '<div class="ps-cell" style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);">?</div>'; }).join('');
        var steps = [];
        var prefCells = function() { return prefEl.querySelectorAll('.ps-cell'); };
        steps.push({ description: 'prefix[0] = 0 (initial value)', action: function() { prefCells()[0].textContent = '0'; prefCells()[0].style.background = 'var(--accent)15'; infoEl.innerHTML = 'prefix[0] = 0'; }, undo: function() { prefCells()[0].textContent = '?'; prefCells()[0].style.background = 'var(--bg2)'; infoEl.innerHTML = ''; } });
        for (i = 0; i < arr.length; i++) {
            (function(idx) {
                steps.push({ description: 'prefix[' + (idx+1) + '] = prefix[' + idx + '] + arr[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = ' + prefix[idx+1],
                    action: function() { prefCells()[idx+1].textContent = prefix[idx+1]; prefCells()[idx+1].style.background = 'var(--green)20'; infoEl.innerHTML = 'prefix[' + (idx+1) + '] = ' + prefix[idx] + ' + ' + arr[idx] + ' = <strong>' + prefix[idx+1] + '</strong>'; },
                    undo: function() { prefCells()[idx+1].textContent = '?'; prefCells()[idx+1].style.background = 'var(--bg2)'; infoEl.innerHTML = idx > 0 ? 'prefix[' + idx + '] = ' + prefix[idx] : 'prefix[0] = 0'; }
                });
            })(i);
        }
        steps.push({ description: 'Prefix sum complete! Range sum example: arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">arr[2]~arr[5] = prefix[5] - prefix[1] = ' + prefix[5] + ' - ' + prefix[1] + ' = ' + (prefix[5]-prefix[1]) + '</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[' + arr.length + '] = ' + prefix[arr.length]; }
        });
        self._initStepController(container, steps, suffix);
    },

    _renderConceptViz2D: function(container, suffix) {
        var self = this;
        container.innerHTML =
            '<div class="viz-card"><h3>2D Prefix Sum</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Use 2D prefix sums and the inclusion-exclusion principle to compute region sums.</p>' +
            '<div id="cv2d-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix) + '</div>';
        var infoEl = container.querySelector('#cv2d-info-' + suffix);
        var grid = [[1,2,3],[4,5,6],[7,8,9]];
        var prefix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        var r, c;
        for (r = 1; r <= 3; r++) for (c = 1; c <= 3; c++) prefix[r][c] = grid[r-1][c-1] + prefix[r-1][c] + prefix[r][c-1] - prefix[r-1][c-1];
        var steps = [];
        steps.push({ description: 'Compute the 2D prefix sum of a 3x3 grid.', action: function() { infoEl.innerHTML = 'Grid: [[1,2,3],[4,5,6],[7,8,9]]'; }, undo: function() { infoEl.innerHTML = ''; } });
        steps.push({ description: 'Initialize row/col 0 = 0', action: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; }, undo: function() { infoEl.innerHTML = 'Grid: [[1,2,3],[4,5,6],[7,8,9]]'; } });
        steps.push({ description: 'prefix[1][1] = 1+0+0-0 = 1', action: function() { infoEl.innerHTML = 'prefix[1][1] = grid[1][1] + prefix[0][1] + prefix[1][0] - prefix[0][0] = <strong>1</strong>'; }, undo: function() { infoEl.innerHTML = 'prefix[0][*] = prefix[*][0] = 0'; } });
        steps.push({ description: 'Region (1,1)~(2,2) sum = prefix[2][2] - prefix[0][2] - prefix[2][0] + prefix[0][0] = ' + prefix[2][2] + ' - 0 - 0 + 0 = ' + prefix[2][2],
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) sum = ' + prefix[2][2] + ' (= 1+2+4+5 = 12)</strong>'; },
            undo: function() { infoEl.innerHTML = 'prefix[1][1] = <strong>1</strong>'; }
        });
        steps.push({ description: 'Region (2,2)~(3,3) sum = prefix[3][3] - prefix[1][3] - prefix[3][1] + prefix[1][1] = ' + prefix[3][3] + ' - ' + prefix[1][3] + ' - ' + prefix[3][1] + ' + ' + prefix[1][1] + ' = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]),
            action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(2,2)~(3,3) sum = ' + (prefix[3][3]-prefix[1][3]-prefix[3][1]+prefix[1][1]) + ' (= 5+6+8+9 = 28)</strong>'; },
            undo: function() { infoEl.innerHTML = '<strong style="color:var(--green)">(1,1)~(2,2) sum = ' + prefix[2][2] + '</strong>'; }
        });
        self._initStepController(container, steps, suffix);
    },

    // ===== Visualization State =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls: function(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ Prev</button>' +
            '<span id="str-indicator-' + suffix + '">Before Start</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">Next ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ Click Next to start</div>';
    },

    _initStepController: function(container, steps, suffix) {
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
    // Simulation 1: 1D Range Sum (boj-11659)
    // ====================================================================
    _renderVizRange: function(container) {
        var self = this, suffix = '-range';
        var DEFAULT_ARR = [5, 4, 3, 2, 1];
        var DEFAULT_QUERIES = [[1,3],[2,4],[5,5]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">1D Range Sum (BOJ 11659)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="ps-range-arr" value="5, 4, 3, 2, 1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">Queries (i j): <input type="text" id="ps-range-queries" value="1 3, 2 4, 5 5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="ps-range-reset">🔄</button>' +
            '</div>' +
            '<div id="rng-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-pref' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="rng-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#rng-arr' + suffix);
        var prefEl = container.querySelector('#rng-pref' + suffix);
        var infoEl = container.querySelector('#rng-info' + suffix);

        function renderCells(el, label, vals) { el.innerHTML = '<span style="width:60px;font-weight:600;line-height:40px;">' + label + '</span>' + vals.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join(''); }

        function buildSteps(arr, queries) {
            var prefix = [0]; var i;
            for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
            renderCells(arrEl, 'arr:', arr);
            renderCells(prefEl, 'prefix:', prefix);
            infoEl.innerHTML = '<span style="color:var(--text2)">Compute range sums in O(1) using prefix sums.</span>';
            var steps = [];
            steps.push({ description: 'Prefix sum array: prefix = [' + prefix.join(', ') + ']', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = '<span style="color:var(--text2)">Compute range sums in O(1) using prefix sums.</span>'; } });
            queries.forEach(function(q) {
                var L = q[0], R = q[1];
                if (L < 1 || R > arr.length || L > R) return;
                var ans = prefix[R] - prefix[L-1];
                steps.push({ description: 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = ' + ans,
                    action: function() { infoEl.innerHTML = 'arr[' + L + ']~arr[' + R + '] = prefix[' + R + '] - prefix[' + (L-1) + '] = ' + prefix[R] + ' - ' + prefix[L-1] + ' = <strong>' + ans + '</strong>'; },
                    undo: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }
                });
            });
            var results = queries.map(function(q) { return (q[0] >= 1 && q[1] <= arr.length && q[0] <= q[1]) ? (prefix[q[1]] - prefix[q[0]-1]) : '?'; });
            steps.push({ description: 'All queries processed in O(1)!', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">✅ Results: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; infoEl.innerHTML = 'arr[' + q[0] + ']~arr[' + q[1] + '] = ' + (prefix[q[1]] - prefix[q[0]-1]); } else { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-range-arr').value;
            var qInput = container.querySelector('#ps-range-queries').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/); return [parseInt(parts[0], 10), parseInt(parts[1], 10)]; }).filter(function(q) { return !isNaN(q[0]) && !isNaN(q[1]); });
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(arr, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-range-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 2: Max Subarray Sum of Length K (boj-2559)
    // ====================================================================
    _renderVizWindow: function(container) {
        var self = this, suffix = '-win';
        var DEFAULT_ARR = [3, -2, -4, -9, 0, 3, 7, 13, 8, -3];
        var DEFAULT_K = 2;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Max Sum of K Consecutive Days (BOJ 2559)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="ps-window-arr" value="3, -2, -4, -9, 0, 3, 7, 13, 8, -3" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:300px;"></label>' +
            '<label style="font-weight:600;">K: <input type="number" id="ps-window-k" value="2" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-window-reset">🔄</button>' +
            '</div>' +
            '<div id="win-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="win-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#win-arr' + suffix);
        var infoEl = container.querySelector('#win-info' + suffix);

        function buildSteps(arr, K) {
            var prefix = [0]; var i;
            for (i = 0; i < arr.length; i++) prefix.push(prefix[i] + arr[i]);
            arrEl.innerHTML = arr.map(function(v) { return '<div style="width:40px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;font-size:0.85rem;">' + v + '</div>'; }).join('');
            infoEl.innerHTML = '';
            var steps = [];
            var maxVal = -Infinity, maxPos = -1;
            steps.push({ description: 'Build the prefix sum array and compute the sum of every subarray of length ' + K + '.', action: function() { infoEl.innerHTML = 'prefix = [' + prefix.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            for (i = 1; i <= arr.length - K + 1; i++) {
                (function(idx) {
                    var sum = prefix[idx + K - 1] - prefix[idx - 1];
                    if (sum > maxVal) { maxVal = sum; maxPos = idx; }
                    var curMax = maxVal, curPos = maxPos;
                    steps.push({ description: 'i=' + idx + ': prefix[' + (idx+K-1) + '] - prefix[' + (idx-1) + '] = ' + prefix[idx+K-1] + ' - ' + prefix[idx-1] + ' = ' + sum,
                        action: function() { infoEl.innerHTML = 'arr[' + idx + ']~arr[' + (idx+K-1) + '] sum = <strong>' + sum + '</strong>' + (sum === curMax && idx === curPos ? ' <- current max!' : ''); },
                        undo: function() { infoEl.innerHTML = idx > 1 ? 'arr[' + (idx-1) + ']~arr[' + (idx+K-2) + '] sum = ' + (prefix[idx+K-2] - prefix[idx-2]) : 'prefix = [' + prefix.join(', ') + ']'; }
                    });
                })(i);
            }
            var fMaxVal = maxVal, fMaxPos = maxPos;
            steps.push({ description: 'Max = ' + fMaxVal + ' (position: arr[' + fMaxPos + ']~arr[' + (fMaxPos+K-1) + '])', action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">Max sum = ' + fMaxVal + '</strong>'; }, undo: function() { var last = arr.length - K + 1; infoEl.innerHTML = 'arr[' + last + ']~arr[' + (last+K-1) + '] sum = ' + (prefix[last+K-1] - prefix[last-1]); } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-window-arr').value;
            var kInput = container.querySelector('#ps-window-k').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var K = parseInt(kInput, 10);
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (K > arr.length) K = arr.length;
            var steps = buildSteps(arr, K);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-window-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_K);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 3: Per-Character Prefix Sum (boj-16139)
    // ====================================================================
    _renderVizCharSum: function(container) {
        var self = this, suffix = '-char';
        var DEFAULT_S = 'seungjaehwang';
        var DEFAULT_QUERIES = [['a',0,12],['s',0,12],['a',3,7],['a',0,5]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Per-Character Prefix Sum (BOJ 16139)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">String: <input type="text" id="ps-char-str" value="seungjaehwang" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">Queries (char l r): <input type="text" id="ps-char-queries" value="a 0 12, s 0 12, a 3 7, a 0 5" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="ps-char-reset">🔄</button>' +
            '</div>' +
            '<div id="ch-str' + suffix + '" style="display:flex;gap:2px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="ch-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var strEl = container.querySelector('#ch-str' + suffix);
        var infoEl = container.querySelector('#ch-info' + suffix);

        function buildSteps(S, queries) {
            strEl.innerHTML = S.split('').map(function(c) { return '<div style="width:28px;text-align:center;padding:4px 2px;border-radius:4px;background:var(--bg2);font-family:monospace;font-weight:600;">' + c + '</div>'; }).join('');
            infoEl.innerHTML = '';
            // Prefix sum for each of the 26 letters
            var count = [];
            var c;
            for (c = 0; c < 26; c++) { count[c] = [0]; for (var j = 0; j < S.length; j++) { count[c].push(count[c][j] + (S.charCodeAt(j) - 97 === c ? 1 : 0)); } }
            var steps = [];
            steps.push({ description: 'Build a prefix sum array for each of the 26 letters.', action: function() { infoEl.innerHTML = 'Building a prefix sum array for each letter.'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: 'Example: prefix sum for "a" = [' + count[0].join(',') + ']', action: function() { infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; }, undo: function() { infoEl.innerHTML = 'Building a prefix sum array for each letter.'; } });
            queries.forEach(function(q, qi) {
                var ch = q[0], l = q[1], r = q[2];
                var ci = ch.charCodeAt(0) - 97;
                if (ci < 0 || ci >= 26 || l < 0 || r >= S.length || l > r) return;
                var ans = count[ci][r+1] - count[ci][l];
                steps.push({ description: '"' + ch + '" in [' + l + ',' + r + '] = count["' + ch + '"][' + (r+1) + '] - count["' + ch + '"][' + l + '] = ' + count[ci][r+1] + ' - ' + count[ci][l] + ' = ' + ans,
                    action: function() { infoEl.innerHTML = '"' + ch + '" in S[' + l + '..' + r + '] = <strong>' + ans + '</strong>'; },
                    undo: function() { if (qi === 0) infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; else { var pq = queries[qi-1]; var pci = pq[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + pq[0] + '" in S[' + pq[1] + '..' + pq[2] + '] = ' + (count[pci][pq[2]+1] - count[pci][pq[1]]); } }
                });
            });
            var results = queries.map(function(q) { var ci = q[0].charCodeAt(0)-97; return (ci >= 0 && ci < 26 && q[1] >= 0 && q[2] < S.length) ? (count[ci][q[2]+1] - count[ci][q[1]]) : '?'; });
            steps.push({ description: 'Results: ' + results.join(', '), action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">Results: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; var ci = q[0].charCodeAt(0)-97; infoEl.innerHTML = '"' + q[0] + '" in S[' + q[1] + '..' + q[2] + '] = ' + (count[ci][q[2]+1] - count[ci][q[1]]); } else { infoEl.innerHTML = 'count["a"] = [' + count[0].join(', ') + ']'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var strInput = container.querySelector('#ps-char-str').value.trim().toLowerCase();
            var qInput = container.querySelector('#ps-char-queries').value;
            var S = strInput || DEFAULT_S;
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/); if (parts.length >= 3) return [parts[0], parseInt(parts[1], 10), parseInt(parts[2], 10)]; return null; }).filter(function(q) { return q && !isNaN(q[1]) && !isNaN(q[2]); });
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(S, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-char-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_S, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 4: Remainder Sum (boj-10986)
    // ====================================================================
    _renderVizModSum: function(container) {
        var self = this, suffix = '-mod';
        var DEFAULT_ARR = [1, 2, 3, 1, 2];
        var DEFAULT_M = 3;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Remainder Sum (BOJ 10986)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Array: <input type="text" id="ps-mod-arr" value="1, 2, 3, 1, 2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<label style="font-weight:600;">M: <input type="number" id="ps-mod-m" value="3" min="2" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-mod-reset">🔄</button>' +
            '</div>' +
            '<div id="mod-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="mod-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var arrEl = container.querySelector('#mod-arr' + suffix);
        var infoEl = container.querySelector('#mod-info' + suffix);

        function buildSteps(arr, M) {
            arrEl.innerHTML = arr.map(function(v) { return '<div style="width:44px;text-align:center;padding:6px 2px;border-radius:6px;background:var(--bg2);font-weight:600;">' + v + '</div>'; }).join('');
            infoEl.innerHTML = '';
            var prefMod = [0]; var cnt = []; var i, r;
            for (r = 0; r < M; r++) cnt[r] = 0;
            cnt[0] = 1;
            for (i = 0; i < arr.length; i++) { prefMod.push(((prefMod[i] + arr[i]) % M + M) % M); cnt[prefMod[i+1]]++; }
            var steps = [];
            steps.push({ description: 'Build the prefix_mod array (each prefix sum modulo M=' + M + ').', action: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            var cntStr = [];
            for (r = 0; r < M; r++) cntStr.push('cnt[' + r + ']=' + cnt[r]);
            steps.push({ description: 'Count per remainder: ' + cntStr.join(', '), action: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + '] (count of remainders 0~' + (M-1) + ')'; }, undo: function() { infoEl.innerHTML = 'prefix_mod = [' + prefMod.join(', ') + ']'; } });
            var combParts = []; var ans = 0;
            for (r = 0; r < M; r++) { var c = cnt[r]*(cnt[r]-1)/2; combParts.push(cnt[r] + 'C2'); ans += c; }
            var combVals = [];
            for (r = 0; r < M; r++) combVals.push(cnt[r]*(cnt[r]-1)/2);
            steps.push({ description: 'Pairs with same remainder = nC2: ' + combParts.join(' + '), action: function() { infoEl.innerHTML = combParts.join(' + ') + ' = ' + combVals.join(' + ') + ' = <strong>' + ans + '</strong>'; }, undo: function() { infoEl.innerHTML = 'cnt = [' + cnt.join(', ') + ']'; } });
            steps.push({ description: 'Answer: ' + ans, action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">Subarrays with sum divisible by ' + M + ' = ' + ans + '</strong>'; }, undo: function() { infoEl.innerHTML = 'Answer = ' + ans; } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var arrInput = container.querySelector('#ps-mod-arr').value;
            var mInput = container.querySelector('#ps-mod-m').value;
            var arr = arrInput.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            var M = parseInt(mInput, 10);
            if (arr.length === 0) arr = DEFAULT_ARR;
            if (isNaN(M) || M < 2) M = DEFAULT_M;
            var steps = buildSteps(arr, M);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-mod-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_ARR, DEFAULT_M);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 5: 2D Prefix Sum (boj-11660)
    // ====================================================================
    _renderViz2DSum: function(container) {
        var self = this, suffix = '-2d';
        var DEFAULT_GRID = [[1,2,3,4],[2,3,4,5],[3,4,5,6],[4,5,6,7]];
        var DEFAULT_QUERIES = [[2,2,3,4],[3,4,3,4],[1,1,4,4]];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">2D Range Sum (BOJ 11660)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Grid (rows separated by ;): <input type="text" id="ps-2d-grid" value="1 2 3 4; 2 3 4 5; 3 4 5 6; 4 5 6 7" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;"></label>' +
            '<label style="font-weight:600;">Queries (x1 y1 x2 y2): <input type="text" id="ps-2d-queries" value="2 2 3 4, 3 4 3 4, 1 1 4 4" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="ps-2d-reset">🔄</button>' +
            '</div>' +
            '<div id="d2-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var infoEl = container.querySelector('#d2-info' + suffix);

        function buildSteps(grid, queries) {
            var N = grid.length;
            var M2 = grid[0] ? grid[0].length : 0;
            var prefix = []; var i, j;
            for (i = 0; i <= N; i++) { prefix[i] = []; for (j = 0; j <= M2; j++) prefix[i][j] = 0; }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) prefix[i][j] = grid[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            infoEl.innerHTML = '';
            var gridStr = grid.map(function(row) { return '[' + row.join(',') + ']'; }).join(',');
            var steps = [];
            steps.push({ description: 'Build the 2D prefix sum for a ' + N + 'x' + M2 + ' grid.', action: function() { infoEl.innerHTML = 'Grid: [' + gridStr + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: '2D prefix sum array complete', action: function() { infoEl.innerHTML = 'Computed prefix sums using inclusion-exclusion.'; }, undo: function() { infoEl.innerHTML = 'Grid: [' + gridStr + ']'; } });
            queries.forEach(function(q, qi) {
                var x1 = q[0], y1 = q[1], x2 = q[2], y2 = q[3];
                if (x1 < 1 || y1 < 1 || x2 > N || y2 > M2 || x1 > x2 || y1 > y2) return;
                var ans = prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1];
                steps.push({ description: '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + '): prefix[' + x2 + '][' + y2 + '] - prefix[' + (x1-1) + '][' + y2 + '] - prefix[' + x2 + '][' + (y1-1) + '] + prefix[' + (x1-1) + '][' + (y1-1) + '] = ' + ans,
                    action: function() { infoEl.innerHTML = '(' + x1 + ',' + y1 + ')~(' + x2 + ',' + y2 + ') = ' + prefix[x2][y2] + ' - ' + prefix[x1-1][y2] + ' - ' + prefix[x2][y1-1] + ' + ' + prefix[x1-1][y1-1] + ' = <strong>' + ans + '</strong>'; },
                    undo: function() { if (qi === 0) infoEl.innerHTML = 'Computed prefix sums using inclusion-exclusion.'; else { var pq = queries[qi-1]; var pa = prefix[pq[2]][pq[3]] - prefix[pq[0]-1][pq[3]] - prefix[pq[2]][pq[1]-1] + prefix[pq[0]-1][pq[1]-1]; infoEl.innerHTML = '(' + pq[0] + ',' + pq[1] + ')~(' + pq[2] + ',' + pq[3] + ') = ' + pa; } }
                });
            });
            var results = queries.map(function(q) { return (q[0] >= 1 && q[1] >= 1 && q[2] <= N && q[3] <= M2 && q[0] <= q[2] && q[1] <= q[3]) ? (prefix[q[2]][q[3]] - prefix[q[0]-1][q[3]] - prefix[q[2]][q[1]-1] + prefix[q[0]-1][q[1]-1]) : '?'; });
            steps.push({ description: 'Results: ' + results.join(', '), action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">Results: ' + results.join(', ') + '</strong>'; }, undo: function() { if (queries.length > 0) { var q = queries[queries.length-1]; var a = prefix[q[2]][q[3]] - prefix[q[0]-1][q[3]] - prefix[q[2]][q[1]-1] + prefix[q[0]-1][q[1]-1]; infoEl.innerHTML = '(' + q[0] + ',' + q[1] + ')~(' + q[2] + ',' + q[3] + ') = ' + a; } else { infoEl.innerHTML = 'Computed prefix sums using inclusion-exclusion.'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var gridInput = container.querySelector('#ps-2d-grid').value;
            var qInput = container.querySelector('#ps-2d-queries').value;
            var grid = gridInput.split(';').map(function(row) { return row.trim().split(/\s+/).map(function(s) { return parseInt(s, 10); }).filter(function(n) { return !isNaN(n); }); }).filter(function(row) { return row.length > 0; });
            var queries = qInput.split(',').map(function(s) { var parts = s.trim().split(/\s+/).map(function(p) { return parseInt(p, 10); }); return parts.length >= 4 ? [parts[0], parts[1], parts[2], parts[3]] : null; }).filter(function(q) { return q && !isNaN(q[0]) && !isNaN(q[1]) && !isNaN(q[2]) && !isNaN(q[3]); });
            if (grid.length === 0) grid = DEFAULT_GRID;
            if (queries.length === 0) queries = DEFAULT_QUERIES;
            var steps = buildSteps(grid, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-2d-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_GRID, DEFAULT_QUERIES);
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // Simulation 6: Chessboard Repainting (boj-25682)
    // ====================================================================
    _renderVizChess: function(container) {
        var self = this, suffix = '-chess';
        var DEFAULT_N = 4, DEFAULT_K = 3;

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Repainting the Chessboard (BOJ 25682)</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (grid size): <input type="number" id="ps-chess-n" value="4" min="1" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">K (chessboard size): <input type="number" id="ps-chess-k" value="3" min="1" max="8" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ps-chess-reset">🔄</button>' +
            '<span style="color:var(--text3);font-size:0.8rem;">(all-B NxN board)</span>' +
            '</div>' +
            '<div id="cs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var infoEl = container.querySelector('#cs-info' + suffix);

        function buildSteps(N, K) {
            // Generate an all-B NxN board
            var board = []; var i, j;
            for (i = 0; i < N; i++) { var row = ''; for (j = 0; j < N; j++) row += 'B'; board.push(row); }
            var M2 = N;
            infoEl.innerHTML = '';
            // diff array: 1 if cell differs from the (i+j) even=B pattern
            var diff = []; var prefix = [];
            for (i = 0; i <= N; i++) { diff[i] = []; prefix[i] = []; for (j = 0; j <= M2; j++) { diff[i][j] = 0; prefix[i][j] = 0; } }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) { var exp = (i+j) % 2 === 0 ? 'B' : 'W'; diff[i][j] = board[i-1][j-1] !== exp ? 1 : 0; }
            for (i = 1; i <= N; i++) for (j = 1; j <= M2; j++) prefix[i][j] = diff[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
            var steps = [];
            steps.push({ description: 'Build the diff array: 1 where cell differs from (i+j) even=B pattern.', action: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; }, undo: function() { infoEl.innerHTML = ''; } });
            steps.push({ description: 'Compute the 2D prefix sum of the diff array.', action: function() { infoEl.innerHTML = '2D prefix sum array complete'; }, undo: function() { var rows = []; for (var r = 1; r <= N; r++) { var row = []; for (var c = 1; c <= M2; c++) row.push(diff[r][c]); rows.push('[' + row.join(',') + ']'); } infoEl.innerHTML = 'diff = [' + rows.join(', ') + ']'; } });
            // Scan all K x K regions
            var bestCost = N * M2;
            var results = [];
            for (i = 1; i <= N - K + 1; i++) {
                for (j = 1; j <= M2 - K + 1; j++) {
                    var cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];
                    var cost2 = K*K - cost1;
                    var best = Math.min(cost1, cost2);
                    results.push({i:i, j:j, cost1:cost1, cost2:cost2, best:best});
                    if (best < bestCost) bestCost = best;
                }
            }
            results.forEach(function(r, ri) {
                steps.push({ description: 'Region (' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): pattern1=' + r.cost1 + ', pattern2=' + r.cost2 + ', min=' + r.best,
                    action: function() { infoEl.innerHTML = '(' + r.i + ',' + r.j + ')~(' + (r.i+K-1) + ',' + (r.j+K-1) + '): pattern1=' + r.cost1 + ', pattern2=' + r.cost2 + ' -> <strong>' + r.best + '</strong>'; },
                    undo: function() { if (ri === 0) infoEl.innerHTML = '2D prefix sum array complete'; else { var p = results[ri-1]; infoEl.innerHTML = '(' + p.i + ',' + p.j + ')~(' + (p.i+K-1) + ',' + (p.j+K-1) + '): min=' + p.best; } }
                });
            });
            steps.push({ description: 'Minimum cost = ' + bestCost, action: function() { infoEl.innerHTML = '<strong style="color:var(--green)">Min cells to repaint = ' + bestCost + '</strong>'; }, undo: function() { if (results.length > 0) { var last = results[results.length-1]; infoEl.innerHTML = '(' + last.i + ',' + last.j + '): min=' + last.best; } else { infoEl.innerHTML = '2D prefix sum array complete'; } } });
            return steps;
        }

        function parseAndReset() {
            var state = self._vizState;
            while (state.currentStep >= 0) { if (state.steps[state.currentStep].undo) state.steps[state.currentStep].undo(); state.currentStep--; }
            state.steps = [];
            var nInput = container.querySelector('#ps-chess-n').value;
            var kInput = container.querySelector('#ps-chess-k').value;
            var N = parseInt(nInput, 10);
            var K = parseInt(kInput, 10);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (N > 8) N = 8;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (K > N) K = N;
            var steps = buildSteps(N, K);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#ps-chess-reset').addEventListener('click', parseAndReset);
        var steps = buildSteps(DEFAULT_N, DEFAULT_K);
        self._initStepController(container, steps, suffix);
    },

    // ===== Empty Stub =====
    renderProblem: function(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: '1D Basics', desc: 'Basic Prefix Sum (Silver III)', problemIds: ['boj-11659', 'boj-2559'] },
        { num: 2, title: 'Applications', desc: 'Prefix Sum Applications (Silver I ~ Gold III)', problemIds: ['boj-16139', 'boj-10986'] },
        { num: 3, title: '2D', desc: '2D Prefix Sum (Silver I ~ Gold V)', problemIds: ['boj-11660', 'boj-25682'] }
    ],

    // ===== Problem List =====
    problems: [
        // ========== Stage 1: 1D Basics ==========
        {
            id: 'boj-11659', title: 'BOJ 11659 - Range Sum Query 4', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11659',
            simIntro: 'Watch how we build a prefix sum array and process range sum queries in O(1).',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N numbers, write a program that computes the sum from the i-th number to the j-th number.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 3\n5 4 3 2 1\n1 3\n2 4\n5 5</pre></div>
                    <div><strong>Output</strong><pre>12\n9\n1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>1 ≤ each number ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need to compute range sums, why not just loop from i to j and add up the numbers for each query?<br><br><strong>Example: Range sum of [5, 4, 3, 2, 1] from 1 to 3</strong><br>arr[1] + arr[2] + arr[3] = 5 + 4 + 3 = 12<br>O(N) per query seems fine!' },
                { title: 'But there\'s a problem with this', content: 'There are up to <strong>100,000 queries</strong> and 100,000 numbers.<br>Looping every time means worst case 100,000 x 100,000 = <strong>10 billion operations</strong>... guaranteed TLE!<br><br>O(N) per query means O(N x M) total. We need to reduce this.' },
                { title: 'What if we try this?', content: 'What if we precompute a <strong>prefix sum array</strong>?<br><code>prefix[k]</code> = sum from the 1st to the k-th element<br><br>Then the range sum from i to j = <code>prefix[j] - prefix[i-1]</code> -- just one subtraction!<br>Preprocessing O(N) + each query O(1) = total <strong>O(N + M)</strong><br><br>Tip: Setting <code>prefix[0] = 0</code> means even when i=1, <code>prefix[1-1] = prefix[0] = 0</code>, so no special case handling needed!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# Building the prefix sum array\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# Answer each query\nfor _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    while (M--) {\n        int i, j;\n        cin >> i >> j;\n        cout << prefix[j] - prefix[i - 1] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '1D Prefix Sum',
                description: 'Build a prefix sum array, then answer each query with prefix[j] - prefix[i-1] in O(1).',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Fast input with sys.stdin.readline.\nRead N numbers and M queries.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: 'Build Prefix Sum Array', desc: 'prefix[i] = sum of arr[0]~arr[i-1].\nPreprocessing so we can answer range sums in O(1).', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: 'Process Queries', desc: 'Range sum = prefix[j] - prefix[i-1].\nThanks to preprocessing, each query is answered in O(1).', code: 'for _ in range(M):\n    i, j = map(int, input().split())\n    print(prefix[j] - prefix[i - 1])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'ios::sync_with_stdio(false) optimizes I/O speed.\nEssential for handling large numbers of queries.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: 'Build Prefix Sum Array', desc: 'Compute prefix sums on the fly while reading input.\nlong long prevents overflow.', code: '    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;  // Accumulate while reading\n    }' },
                        { title: 'Process Queries', desc: 'Output range sum as prefix[j] - prefix[i-1] in O(1).\n\'\\n\' is faster than endl.', code: '    while (M--) {\n        int i, j;\n        cin >> i >> j;\n        cout << prefix[j] - prefix[i - 1] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-2559', title: 'BOJ 2559 - Sequence', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2559',
            simIntro: 'Watch how prefix sums compute the sum of every subarray of length K to find the maximum.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a sequence of daily temperatures as integers, write a program to find the maximum sum of temperatures over K consecutive days.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 2\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div>
                    <div><strong>Output</strong><pre>21</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10 5\n3 -2 -4 -9 0 3 7 13 8 -3</pre></div>
                    <div><strong>Output</strong><pre>31</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N ≤ 100,000</li>
                    <li>1 ≤ K ≤ N</li>
                    <li>-100 ≤ temperature ≤ 100</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we want the "maximum sum of K consecutive days," why not try all consecutive K-day windows?<br><br>i=1: arr[1]+arr[2]+...+arr[K]<br>i=2: arr[2]+arr[3]+...+arr[K+1]<br>...<br>Just add up K elements for each window to get the sum!' },
                { title: 'But there\'s a problem with this', content: 'There are N-K+1 windows, and summing K elements for each makes it <strong>O(N x K)</strong> total.<br>If N is 100,000 and K is similar... it could be quite slow!<br><br>Also, summing K elements from scratch each time is wasteful -- the previous window overlaps with the current one by K-1 elements, yet we are adding them all over again.' },
                { title: 'What if we try this?', content: 'If we precompute prefix sums, we can get the sum of any K-length subarray with <strong>just one subtraction</strong>!<br><br>Sum of K elements starting at i = <code>prefix[i + K - 1] - prefix[i - 1]</code><br><br>Loop from i = 1 to N-K+1, updating the maximum each time, and we are done!<br>Preprocessing O(N) + scanning O(N) = <strong>O(N)</strong><br><br>Note: A sliding window approach (subtract front, add back) also runs in O(N), but prefix sums make the code more concise!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))\n\n# Building the prefix sum array\nprefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]\n\n# Maximum sum among all subarrays of length K\nans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n\n    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }\n\n    long long ans = -1e18;\n    for (int i = 1; i <= N - K + 1; i++) {\n        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Prefix Sum + Sliding',
                description: 'Compute all subarray sums of length K from the prefix sum array and find the maximum.',
                timeComplexity: 'O(N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read N temperatures and K consecutive days.\nUsing sys.stdin.readline for fast input.', code: 'import sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: 'Prefix Sum', desc: 'With prefix sums, any K-length subarray sum\ncan be computed as prefix[i+K-1] - prefix[i-1] in O(1).', code: 'prefix = [0] * (N + 1)\nfor i in range(1, N + 1):\n    prefix[i] = prefix[i - 1] + arr[i - 1]' },
                        { title: 'Max Subarray Sum', desc: 'Compute all K-length subarray sums in O(1) each and track the max.\nInitialize to -inf since temperatures can be negative.', code: 'ans = -float(\'inf\')\nfor i in range(1, N - K + 2):\n    ans = max(ans, prefix[i + K - 1] - prefix[i - 1])\n\nprint(ans)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read N temperatures and K consecutive days.\nalgorithm header is included for the max function.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;' },
                        { title: 'Prefix Sum', desc: 'long long: temperature sums may exceed int range.\nCompute prefix sums on the fly while reading input.', code: '    long long prefix[100001] = {0};\n    for (int i = 1; i <= N; i++) {\n        int x;\n        cin >> x;\n        prefix[i] = prefix[i - 1] + x;\n    }' },
                        { title: 'Max Subarray Sum', desc: '-1e18: need a sufficiently small initial value since temps can be negative.', code: '    long long ans = -1e18;  // Small enough for negative temps\n    for (int i = 1; i <= N - K + 1; i++) {\n        ans = max(ans, prefix[i + K - 1] - prefix[i - 1]);\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[1].templates; }
            }]
        },

        // ========== Stage 2: Applications ==========
        {
            id: 'boj-16139', title: 'BOJ 16139 - Human-Computer Interaction', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/16139',
            simIntro: 'Watch how per-character prefix sums handle character frequency queries for all 26 letters.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a string S and q queries. Each query consists of a lowercase letter a and two integers l, r. Determine how many times a appears from the l-th to the r-th character of S (0-indexed).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>seungjaehwang\n4\na 0 5\na 0 12\ns 0 12\nn 2 7</pre></div>
                    <div><strong>Output</strong><pre>0\n2\n1\n1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ |S| ≤ 200,000</li>
                    <li>1 ≤ q ≤ 200,000</li>
                    <li>0 ≤ l ≤ r < |S|</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'For each query, scan from l to r and count every time the target letter appears. Simple enough, right?<br><br><strong>Example: "seungjaehwang", letter \'a\', range 0~12</strong><br>s(X) e(X) u(X) n(X) g(X) j(X) <strong>a(O)</strong> e(X) h(X) w(X) <strong>a(O)</strong> n(X) g(X) -> 2 occurrences<br>Just scan the range for each query!' },
                { title: 'But there\'s a problem with this', content: 'The string length is up to 200,000, and there are up to 200,000 queries.<br>Scanning the range each time: 200,000 x 200,000 = <strong>40 billion operations</strong>... TLE!<br><br>We know prefix sums work for range sums, but here we need the <strong>"count of a specific character"</strong>, not a sum. How do we apply prefix sums here?' },
                { title: 'What if we try this?', content: 'Instead of summing numbers, <strong>accumulate character occurrence counts</strong>!<br><br>Since there are 26 letters, build <strong>26 prefix sum arrays</strong>:<br><code>count[c][i]</code> = number of times letter c appears from the start up to position i<br><br>Then the count of letter c in range l~r = <code>count[c][r+1] - count[c][l]</code><br>-- just one subtraction, O(1)! Preprocessing O(26 x N) + queries O(Q) = fast enough!<br><br>Tip: Since indices start from 0, making the prefix array length N+1 keeps things simple.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())\n\n# Prefix sum for each of 26 letters\ncount = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1\n\nfor _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])',
                cpp: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint count[26][200002];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string S;\n    cin >> S;\n    int N = S.size();\n    int q;\n    cin >> q;\n\n    for (int i = 0; i < N; i++) {\n        for (int c = 0; c < 26; c++)\n            count[c][i + 1] = count[c][i];\n        count[S[i] - \'a\'][i + 1]++;\n    }\n\n    while (q--) {\n        char ch;\n        int l, r;\n        cin >> ch >> l >> r;\n        cout << count[ch - \'a\'][r + 1] - count[ch - \'a\'][l] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Per-Character Prefix Sum',
                description: 'Build a prefix sum array for each of the 26 letters to answer queries in O(1).',
                timeComplexity: 'O(26N + Q)',
                spaceComplexity: 'O(26N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read string S and the number of queries.\nstrip() removes the trailing newline.', code: 'import sys\ninput = sys.stdin.readline\n\nS = input().strip()\nN = len(S)\nq = int(input())' },
                        { title: '26-Letter Prefix Sum', desc: 'Build a prefix sum per letter so we can\nquery character frequency in a range in O(1).', code: 'count = [[0] * (N + 1) for _ in range(26)]\nfor i in range(N):\n    for c in range(26):\n        count[c][i + 1] = count[c][i]\n    count[ord(S[i]) - ord(\'a\')][i + 1] += 1' },
                        { title: 'Process Queries', desc: 'count[c][r+1] - count[c][l] gives the character count in range in O(1).\nord() converts a character to a 0~25 index.', code: 'for _ in range(q):\n    parts = input().split()\n    c = ord(parts[0]) - ord(\'a\')\n    l, r = int(parts[1]), int(parts[2])\n    print(count[c][r + 1] - count[c][l])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'count array declared globally to avoid stack size limits.', code: '#include <iostream>\n#include <cstring>\nusing namespace std;\n\n// Global: 26 letters x max length (prevents stack overflow)\nint count[26][200002];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    string S;\n    cin >> S;\n    int N = S.size();\n    int q;\n    cin >> q;' },
                        { title: '26-Letter Prefix Sum', desc: 'S[i] - \'a\' converts char to index.\nUses char subtraction instead of ord().', code: '    for (int i = 0; i < N; i++) {\n        for (int c = 0; c < 26; c++)\n            count[c][i + 1] = count[c][i];  // Copy previous values\n        count[S[i] - \'a\'][i + 1]++;  // Increment only matching letter\n    }' },
                        { title: 'Process Queries', desc: 'ch - \'a\' converts character to index for\nO(1) lookup in the prefix sum array.', code: '    while (q--) {\n        char ch;\n        int l, r;\n        cin >> ch >> l >> r;\n        cout << count[ch - \'a\'][r + 1] - count[ch - \'a\'][l] << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-10986', title: 'BOJ 10986 - Remainder Sum', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/10986',
            simIntro: 'Watch how we count pairs of prefix sums with the same remainder.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N numbers A<sub>1</sub>, A<sub>2</sub>, ..., A<sub>N</sub>, write a program to count the number of contiguous subarrays whose sum is divisible by M. That is, count the number of pairs (i, j) where i ≤ j and A<sub>i</sub> + ... + A<sub>j</sub> is divisible by M.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 3\n1 2 3 1 2</pre></div>
                    <div><strong>Output</strong><pre>7</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10<sup>6</sup></li>
                    <li>2 ≤ M ≤ 10<sup>3</sup></li>
                    <li>0 ≤ A<sub>i</sub> ≤ 10<sup>9</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Try all (i, j) pairs, compute the subarray sum, and check if it is divisible by M?<br><br>Use a double for-loop for i and j, then compute the subarray sum = <code>prefix[j] - prefix[i]</code> and check divisibility by M.' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>1,000,000</strong> (one million)!<br>All (i, j) pairs is about N^2 / 2 = <strong>500 billion</strong>... absolutely impossible!<br><br>But wait -- if the subarray sum is a multiple of M, that means <code>prefix[j] - prefix[i]</code> is a multiple of M.<br>Rephrasing: <code>prefix[j] % M == prefix[i] % M</code>!' },
                { title: 'What if we try this?', content: '<strong>Pair up prefix sums with the same remainder</strong>!<br><br>1. Compute the remainder of each prefix sum modulo M<br>2. <code>cnt[r]</code> = count of prefix values with remainder r<br>3. Choosing any 2 with the same remainder gives a subarray sum divisible by M!<br>&nbsp;&nbsp;&nbsp;Answer = sum of <code>cnt[r] x (cnt[r]-1) / 2</code> for each remainder<br><br>Do not forget <code>prefix[0] = 0</code>! It must be included in remainder 0.<br><span class="lang-cpp">The answer can be very large, so <code>long long</code> is required!</span><span class="lang-py">Python handles big numbers automatically, so no worries!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))\n\n# Count per remainder\ncnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1  # remainder of prefix[0] = 0 is 0\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1\n\n# Pairs with same remainder = nC2\nans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    long long cnt[1001] = {0};\n    cnt[0] = 1;\n    long long prefix_mod = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long x;\n        cin >> x;\n        prefix_mod = (prefix_mod + x) % M;\n        cnt[prefix_mod]++;\n    }\n\n    long long ans = 0;\n    for (int r = 0; r < M; r++) {\n        ans += cnt[r] * (cnt[r] - 1) / 2;\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Remainder Classification',
                description: 'Count pairs of prefix sums with the same remainder using combinations (nC2).',
                timeComplexity: 'O(N + M)',
                spaceComplexity: 'O(M)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read N numbers and divisor M.\nWe count subarrays whose sum is divisible by M.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\narr = list(map(int, input().split()))' },
                        { title: 'Count Per Remainder', desc: 'Two positions with the same prefix sum remainder form a subarray divisible by M.\ncnt[0]=1: include prefix[0]=0 in remainder 0.', code: 'cnt = [0] * M\nprefix_mod = 0\ncnt[0] = 1\n\nfor x in arr:\n    prefix_mod = (prefix_mod + x) % M\n    cnt[prefix_mod] += 1' },
                        { title: 'Combination Count', desc: 'Pairs with same remainder = nC2 = n*(n-1)//2.\nSum over all remainders to get the answer.', code: 'ans = 0\nfor c in cnt:\n    ans += c * (c - 1) // 2\n\nprint(ans)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read N numbers and divisor M.\nsync_with_stdio(false) for fast I/O.', code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: 'Count Per Remainder', desc: 'Must count prefix[0]=0 too, so cnt[0]=1.\nlong long: values up to 1 billion, prevents prefix sum overflow.', code: '    long long cnt[1001] = {0};\n    cnt[0] = 1;  // Include prefix[0]=0 in remainder 0\n    long long prefix_mod = 0;\n\n    for (int i = 0; i < N; i++) {\n        long long x;\n        cin >> x;\n        prefix_mod = (prefix_mod + x) % M;\n        cnt[prefix_mod]++;\n    }' },
                        { title: 'Combination Count', desc: 'nC2 = n*(n-1)/2.\nAnswer can be very large, so long long is required.', code: '    long long ans = 0;\n    for (int r = 0; r < M; r++) {\n        ans += cnt[r] * (cnt[r] - 1) / 2;  // nC2\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[3].templates; }
            }]
        },

        // ========== Stage 3: 2D ==========
        {
            id: 'boj-11660', title: 'BOJ 11660 - Range Sum Query 5', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11660',
            simIntro: 'Watch how 2D prefix sums and the inclusion-exclusion formula compute region sums.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>An N x N table is filled with N x N numbers. Write a program that computes the sum from (x1, y1) to (x2, y2).</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 3\n1 2 3 4\n2 3 4 5\n3 4 5 6\n4 5 6 7\n2 2 3 4\n3 4 3 4\n1 1 4 4</pre></div>
                    <div><strong>Output</strong><pre>27\n6\n64</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,024</li>
                    <li>1 ≤ M ≤ 100,000</li>
                    <li>1 ≤ each number ≤ 1,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Since we need the sum from (x1,y1) to (x2,y2), why not use a double for-loop to add up the entire rectangular region?<br><br><strong>Example: Region (2,2)~(3,4)</strong><br>for i in range(x1, x2+1):<br>&nbsp;&nbsp;for j in range(y1, y2+1):<br>&nbsp;&nbsp;&nbsp;&nbsp;total += arr[i][j]<br>Just sum the region for each query!' },
                { title: 'But there\'s a problem with this', content: 'Since N is 1,024, the region size is at most 1,024 x 1,024 = about <strong>1 million</strong>.<br>With 100,000 queries, that is 1 million x 100K = <strong>100 billion operations</strong>... TLE!<br><br>In 1D, we used prefix sums for O(1) range sums. Can we do something similar in 2D?' },
                { title: 'What if we try this?', content: 'Build a <strong>2D prefix sum</strong>! Apply the <strong>inclusion-exclusion</strong> principle we learned in the concept page.<br><br><strong>Step 1 - Build prefix sums:</strong><br><code>prefix[i][j] = arr[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]</code><br>(above + left - overlap + current value)<br><br><strong>Step 2 - Answer queries:</strong><br><code>prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]</code><br>(total - top - left + double-subtracted corner)<br><br>Preprocessing O(N^2) + queries O(1) x M = <strong>O(N^2 + M)</strong>!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\n\n# Build 2D prefix sum\nprefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = (row[j - 1]\n                        + prefix[i - 1][j]\n                        + prefix[i][j - 1]\n                        - prefix[i - 1][j - 1])\n\n# Answer each query\nfor _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    ans = (prefix[x2][y2]\n          - prefix[x1 - 1][y2]\n          - prefix[x2][y1 - 1]\n          + prefix[x1 - 1][y1 - 1])\n    print(ans)',
                cpp: '#include <iostream>\nusing namespace std;\n\nint prefix[1025][1025];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int x;\n            cin >> x;\n            prefix[i][j] = x + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    while (M--) {\n        int x1, y1, x2, y2;\n        cin >> x1 >> y1 >> x2 >> y2;\n        cout << prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1] << \'\\n\';\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '2D Prefix Sum',
                description: '2D prefix sum + inclusion-exclusion formula to compute region sums in O(1).',
                timeComplexity: 'O(N^2 + M)',
                spaceComplexity: 'O(N^2)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the N x N table and M queries.\n2D prefix sums enable fast region sum queries.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: '2D Prefix Sum', desc: 'Inclusion-exclusion: above + left - diagonal + current value.\nAfter this, any rectangular region sum can be computed in O(1).', code: 'prefix = [[0] * (N + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(1, N + 1):\n        prefix[i][j] = row[j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]' },
                        { title: 'Process Queries', desc: 'Inclusion-exclusion formula for (x1,y1)~(x2,y2) region sum in O(1).\ntotal - top - left + overlap.', code: 'for _ in range(M):\n    x1, y1, x2, y2 = map(int, input().split())\n    print(prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1])' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Global 2D array: 1025x1025 would cause stack overflow as a local variable.', code: '#include <iostream>\nusing namespace std;\n\n// Global: large 2D array prevents stack overflow\nint prefix[1025][1025];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;' },
                        { title: '2D Prefix Sum', desc: 'Inclusion-exclusion: above + left - diagonal + current.\nCompute prefix sums on the fly while reading input.', code: '    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int x;\n            cin >> x;\n            // Inclusion-exclusion for prefix sum\n            prefix[i][j] = x + prefix[i-1][j]\n                             + prefix[i][j-1]\n                             - prefix[i-1][j-1];\n        }\n    }' },
                        { title: 'Process Queries', desc: 'Inclusion-exclusion formula for rectangular region sum in O(1).\n\'\\n\' is faster than endl for large query counts.', code: '    while (M--) {\n        int x1, y1, x2, y2;\n        cin >> x1 >> y1 >> x2 >> y2;\n        cout << prefix[x2][y2] - prefix[x1-1][y2]\n                - prefix[x2][y1-1] + prefix[x1-1][y1-1]\n             << \'\\n\';\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-25682', title: 'BOJ 25682 - Repainting the Chessboard 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/25682',
            simIntro: 'Watch how 2D prefix sums quickly count cells that differ from the chessboard pattern.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an M x N board, cut out a K x K chessboard and write a program to find the minimum number of squares that need to be repainted. A chessboard must have alternating black and white squares.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 4 3\nBBBB\nBBBB\nBBBB\nBBBB</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>8 8 8\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW\nWBWBWBWB\nBWBWBWBW</pre></div>
                    <div><strong>Output</strong><pre>0</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ K ≤ min(N, M)</li>
                    <li>1 ≤ N, M ≤ 2,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'For each K x K region, count how many cells differ from the chessboard pattern. Simple enough, right?<br><br>There are 2 possible patterns (top-left is B / top-left is W), so count differing cells for each and pick the smaller one.' },
                { title: 'But there\'s a problem with this', content: 'Number of K x K regions = (N-K+1) x (M-K+1), checking K x K cells for each...<br>With N, M up to 2,000, total <strong>O(N x M x K^2)</strong> -- way too slow!<br><br>But wait, "sum over a K x K region"... did we not do exactly this in the previous problem (Range Sum Query 5)? We could use 2D prefix sums to get it in O(1)!' },
                { title: 'What if we try this?', content: '1. First, create an array marking cells that <strong>differ from the pattern as 1, same as 0</strong>.<br>&nbsp;&nbsp;&nbsp;Pattern rule: (i+j) even means B, odd means W.<br><br>2. Compute the <strong>2D prefix sum</strong> of this 0/1 array!<br><br>3. For every K x K region, cost1 = number of differing cells (computed in O(1) via prefix sums).<br>&nbsp;&nbsp;&nbsp;The opposite pattern costs <code>K x K - cost1</code>, so we only need one prefix sum!<br>&nbsp;&nbsp;&nbsp;Answer = minimum of <code>min(cost1, K x K - cost1)</code> across all regions!<br><br>Preprocessing O(N x M) + scanning O(N x M) = <strong>O(N x M)</strong>!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]\n\n# Pattern: cell (i,j) should be B when (i+j) is even\ndiff = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i + j) % 2 == 0 else \'W\'\n        diff[i + 1][j + 1] = 1 if board[i][j] != expected else 0\n\n# 2D prefix sum\nprefix = [[0] * (M + 1) for _ in range(N + 1)]\nfor i in range(1, N + 1):\n    for j in range(1, M + 1):\n        prefix[i][j] = (diff[i][j]\n                        + prefix[i-1][j]\n                        + prefix[i][j-1]\n                        - prefix[i-1][j-1])\n\nans = float(\'inf\')\nfor i in range(1, N - K + 2):\n    for j in range(1, M - K + 2):\n        cost1 = (prefix[i+K-1][j+K-1]\n                - prefix[i-1][j+K-1]\n                - prefix[i+K-1][j-1]\n                + prefix[i-1][j-1])\n        cost2 = K * K - cost1\n        ans = min(ans, cost1, cost2)\n\nprint(ans)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint prefix[2001][2001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M, K;\n    cin >> N >> M >> K;\n\n    for (int i = 1; i <= N; i++) {\n        string row;\n        cin >> row;\n        for (int j = 1; j <= M; j++) {\n            char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n            int diff = (row[j - 1] != expected) ? 1 : 0;\n            prefix[i][j] = diff + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];\n        }\n    }\n\n    int ans = N * M;\n    for (int i = 1; i <= N - K + 1; i++) {\n        for (int j = 1; j <= M - K + 1; j++) {\n            int cost1 = prefix[i+K-1][j+K-1] - prefix[i-1][j+K-1] - prefix[i+K-1][j-1] + prefix[i-1][j-1];\n            int cost2 = K * K - cost1;\n            ans = min({ans, cost1, cost2});\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: '2D Prefix Sum + Chessboard Pattern',
                description: 'Build a 0/1 array for cells differing from the chessboard pattern, then use 2D prefix sums to find the minimum cost.',
                timeComplexity: 'O(N*M)',
                spaceComplexity: 'O(N*M)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the N x M board and chessboard size K.\nstrip() removes trailing newlines.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M, K = map(int, input().split())\nboard = [input().strip() for _ in range(N)]' },
                        { title: 'diff + Prefix Sum', desc: '(i+j)%2 determines expected color; mark differing cells as 1.\n2D prefix sum enables O(1) cost for any K x K region.', code: 'diff = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(N):\n    for j in range(M):\n        expected = \'B\' if (i+j)%2==0 else \'W\'\n        diff[i+1][j+1] = 1 if board[i][j] != expected else 0\n\nprefix = [[0]*(M+1) for _ in range(N+1)]\nfor i in range(1,N+1):\n    for j in range(1,M+1):\n        prefix[i][j] = diff[i][j]+prefix[i-1][j]+prefix[i][j-1]-prefix[i-1][j-1]' },
                        { title: 'Min K x K Region', desc: 'cost1 = cost for pattern 1; K*K-cost1 = cost for the opposite pattern.\nThe smaller of the two is the minimum repainting cost for that region.', code: 'ans = float(\'inf\')\nfor i in range(1, N-K+2):\n    for j in range(1, M-K+2):\n        cost1 = prefix[i+K-1][j+K-1]-prefix[i-1][j+K-1]-prefix[i+K-1][j-1]+prefix[i-1][j-1]\n        ans = min(ans, cost1, K*K-cost1)\nprint(ans)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Global array: 2001x2001 would cause stack overflow as a local variable.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint prefix[2001][2001];  // Global: prevents stack overflow\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M, K;\n    cin >> N >> M >> K;' },
                        { title: 'diff + Prefix Sum', desc: '(i+j)%2 determines expected color; compute diff and prefix sum in one pass.\nUnlike Python, no need for a separate diff array.', code: '    for (int i = 1; i <= N; i++) {\n        string row;\n        cin >> row;\n        for (int j = 1; j <= M; j++) {\n            // (i+j) even means B expected\n            char expected = ((i + j) % 2 == 0) ? \'B\' : \'W\';\n            int diff = (row[j - 1] != expected) ? 1 : 0;\n            prefix[i][j] = diff + prefix[i-1][j]\n                               + prefix[i][j-1]\n                               - prefix[i-1][j-1];\n        }\n    }' },
                        { title: 'Min K x K Region', desc: 'cost1 = pattern 1 cost, K*K-cost1 = pattern 2 cost.\nmin({a,b,c}) compares all three in one call.', code: '    int ans = N * M;  // Large enough initial value\n    for (int i = 1; i <= N - K + 1; i++) {\n        for (int j = 1; j <= M - K + 1; j++) {\n            int cost1 = prefix[i+K-1][j+K-1]\n                      - prefix[i-1][j+K-1]\n                      - prefix[i+K-1][j-1]\n                      + prefix[i-1][j-1];\n            int cost2 = K * K - cost1;\n            ans = min({ans, cost1, cost2});\n        }\n    }\n    cout << ans << endl;\n    return 0;\n}' }
                    ]
                },
                get templates() { return prefixSumTopic.problems[5].templates; }
            }]
        }
    ]
};

// ===== Register =====
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.prefixsum = prefixSumTopic;
