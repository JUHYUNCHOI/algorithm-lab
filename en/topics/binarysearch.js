// ===== Binary Search Topic Module =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: 'Binary Search',
    icon: '🔍',
    category: 'Sorting & Searching',
    order: 7,
    description: 'A technique for quickly finding a value in sorted data',
    relatedNote: 'Binary search is often extended to Parametric Search, a technique that converts optimization problems into decision problems.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-1920':  { type: 'Basic Search',     color: 'var(--accent)', vizMethod: '_renderVizBasicSearch' },
        'boj-10816': { type: 'Lower/Upper Bound', color: 'var(--green)',  vizMethod: '_renderVizBounds' },
        'boj-1654':  { type: 'Parametric Search', color: '#e17055',       vizMethod: '_renderVizCable' },
        'boj-2805':  { type: 'Parametric Search', color: '#e17055',       vizMethod: '_renderVizTreeCut' },
        'boj-2110':  { type: 'Optimization Search', color: '#6c5ce7',    vizMethod: '_renderVizRouter' },
        'boj-1300':  { type: 'Decision Problem',  color: '#fdcb6e',      vizMethod: '_renderVizKth' },
        'boj-12015': { type: 'LIS + Binary Search', color: '#00b894',    vizMethod: '_renderVizLIS' }
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
            sim:     { intro: prob.simIntro || 'See how binary search actually works in action.', icon: '🎮' },
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
        container.innerHTML = `
            <div class="hero">
                <h2>🔍 Binary Search</h2>
                <p class="hero-sub">By discarding half each time, you can find anything quickly — no matter how large the data</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is Binary Search?</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Imagine looking up "mango" in a dictionary.<br><br>
                    Flipping from the first page one by one? You'd have to turn thousands of pages!<br>
                    But if you open to the <strong>middle of the dictionary</strong>? You land near "L".<br>
                    "M" comes after "L", so → <strong>discard the first half!</strong><br>
                    Open the middle of the remaining half again... repeat and you'll find it quickly!<br><br>
                    This is exactly <strong>binary search</strong>. It's extremely fast because it <strong>discards half</strong> each time.
                </div>
                <span class="lang-py"><div class="code-block"><pre><code class="language-python"># Binary search basic code
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] &lt; target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</code></pre></div></span>
                <span class="lang-cpp"><div class="code-block"><pre><code class="language-cpp">// Binary search basic code
#include &lt;vector&gt;
using namespace std;

int binary_search(vector&lt;int&gt;&amp; arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo &lt;= hi) {
        int mid = (lo + hi) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] &lt; target)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}</code></pre></div></span>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">To find one number among 1 million sorted numbers, how many comparisons does binary search need at most?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        <strong>At most 20 times</strong> is enough!<br>
                        log₂(1,000,000) ≈ 20<br><br>
                        Linear search would need up to <strong>1 million</strong> comparisons,<br>
                        but binary search needs only <strong>20</strong>. That's 50,000 times faster!
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> How Binary Search Works</div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <h3>① Sorting Required!</h3>
                        <p>Binary search only works on a <strong>sorted array</strong>.</p>
                    </div>
                    <div class="concept-card">
                        <h3>② Check the Middle</h3>
                        <p><strong>mid = (lo + hi) / 2</strong><br>Compare with the middle value and discard half.</p>
                    </div>
                    <div class="concept-card">
                        <h3>③ Narrow the Range</h3>
                        <p>If target > mid → <strong>lo = mid+1</strong><br>If target < mid → <strong>hi = mid-1</strong></p>
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Time Complexity: How Fast is O(log N)?</div>
                <div class="analogy-box">
                    <strong>Key Point:</strong> Binary search cuts the search range in <strong>half</strong> each time.
                    Why is "halving each time" so incredibly fast?
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Linear Search O(N) vs Binary Search O(log N) Comparison</div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-top:8px;">
                            <tr style="background:var(--bg2);">
                                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);">Data Size N</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">Linear Search<br>(Worst)</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">Binary Search<br>(Worst)</th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">Difference</th>
                            </tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">1,000</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~10 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">100x</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">1M</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000,000 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~20 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">50,000x</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);">1B</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--red);">1,000,000,000 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);color:var(--green);font-weight:700;">~30 times</td><td style="padding:6px 12px;text-align:center;border-bottom:1px solid var(--border);">30M x!</td></tr>
                        </table>
                    </div>
                    <div class="concept-demo-msg" style="margin-top:12px;">
                        <strong>Why is it so fast?</strong> Halving each time means:<br>
                        2<sup>10</sup> = 1,024 → <strong>10 steps covers 1,000</strong> elements<br>
                        2<sup>20</sup> = 1,048,576 → <strong>20 steps covers 1 million</strong> elements<br>
                        2<sup>30</sup> = 1,073,741,824 → <strong>30 steps covers 1 billion</strong> elements!
                    </div>
                </div>
                <div class="concept-grid">
                    <span class="lang-py"><div class="concept-card">
                        <h3>Python: bisect</h3>
                        <p><code>from bisect import bisect_left, bisect_right</code><br>
                        O(log N) search in a sorted array.<br>
                        <code>bisect_left(arr, x)</code> → first position where value >= x<br>
                        <code>bisect_right(arr, x)</code> → first position where value > x</p>
                        <a href="https://docs.python.org/3/library/bisect.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: bisect ↗</a>
                    </div></span>
                    <span class="lang-cpp"><div class="concept-card">
                        <h3>C++: &lt;algorithm&gt;</h3>
                        <p><code>lower_bound(begin, end, x)</code> → first position where value >= x<br>
                        <code>upper_bound(begin, end, x)</code> → first position where value > x<br>
                        <code>binary_search(begin, end, x)</code> → existence check (true/false)</p>
                        <a href="https://en.cppreference.com/w/cpp/algorithm/lower_bound" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: lower_bound / upper_bound ↗</a>
                    </div></span>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Parametric Search</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Think of the "Higher or Lower" game!<br><br>
                    <strong>"Find the optimal value"</strong> → Transform it into <strong>"Is this value feasible? (YES/NO)"</strong>.<br>
                    Then use binary search to find the boundary between YES and NO!
                </div>
                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>YES/NO Decision</h3>
                        <p>"Can we cut to length x and make N pieces?"<br>"Can we cut at height H and get M meters?"</p>
                    </div>
                    <div class="concept-card">
                        <h3>Finding the Boundary</h3>
                        <p>The optimal value lies at the <strong>boundary</strong> between YES and NO.<br>We find this boundary quickly using binary search!</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">How would you convert "Find the maximum length when cutting 4 cables (802, 743, 457, 539cm) into 11 pieces" into parametric search?</span>
                    </div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">
                        Transform it to: <strong>"When cutting at x cm, can we make 11 or more pieces?"</strong><br><br>
                        x=200? 802/200 + 743/200 + 457/200 + 539/200 = 4+3+2+2 = <strong>11 pieces → YES</strong><br>
                        x=201? 3+3+2+2 = <strong>10 pieces → NO</strong><br>
                        Therefore, the YES→NO boundary <strong>200</strong> is the answer!
                    </div>
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
    },

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
    // Simulation 1: Basic Binary Search (boj-1920)
    // ====================================================================
    _renderVizBasicSearch(container) {
        var self = this;
        var DEFAULT_ARR = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        var DEFAULT_TARGET = 23;
        var suffix = '-bs1';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Basic Binary Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array: <input type="text" id="bs-basic-arr" value="' + DEFAULT_ARR.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<label style="font-weight:600;">target: <input type="number" id="bs-basic-target" value="' + DEFAULT_TARGET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-basic-reset">🔄</button>' +
            '</div>' +
            '<div id="bs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bs-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bs-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bs-arr' + suffix);
        var infoEl = container.querySelector('#bs-info' + suffix);
        var descEl = container.querySelector('#bs-desc' + suffix);
        function cell(v, i, cls) { return '<div style="width:52px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;font-size:0.9rem;transition:all 0.3s;' + cls + '"><div>' + v + '</div><div style="font-size:0.7rem;color:var(--text3);">[' + i + ']</div></div>'; }
        function rebuild() {
            var rawArr = container.querySelector('#bs-basic-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var arr = rawArr.slice().sort(function(a, b) { return a - b; });
            var target = parseInt(container.querySelector('#bs-basic-target').value);
            if (isNaN(target)) target = DEFAULT_TARGET;
            if (arr.length === 0) arr = DEFAULT_ARR.slice();
            descEl.innerHTML = 'Searching for <strong>' + target + '</strong> in the sorted array.';
            function renderArr(lo, hi, mid, foundIdx) {
                arrEl.innerHTML = arr.map(function(v, i) {
                    if (foundIdx === i) return cell(v, i, 'background:var(--green);color:white;');
                    if (i === mid) return cell(v, i, 'background:var(--accent);color:white;');
                    if (i >= lo && i <= hi) return cell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;');
                }).join('');
            }
            renderArr(0, arr.length - 1, -1, -1);
            infoEl.innerHTML = '<span style="color:var(--text2)">Searching for <strong>' + target + '</strong> in the array.</span>';
            var steps = [];
            var lo = 0, hi = arr.length - 1, round = 0, found = false;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                round++;
                if (arr[mid] === target) {
                    (function(cLo, cHi, mid, round, a, t) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' == ' + t + ' → Found it! ✅',
                            action: function() { renderArr(cLo, cHi, -1, mid); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.1rem;">✅ Found! arr[' + mid + '] = ' + t + '</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">Searching for <strong>' + t + '</strong> in the array.</span>'; }
                        });
                    })(cLo, cHi, mid, round, arr, target);
                    found = true;
                    break;
                } else if (arr[mid] < target) {
                    (function(cLo, cHi, mid, newLo, round, a, t) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → Go right! (lo=' + newLo + ')',
                            action: function() { renderArr(newLo, cHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → <strong>Discard left half!</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">Searching for <strong>' + t + '</strong> in the array.</span>'; }
                        });
                    })(cLo, cHi, mid, mid + 1, round, arr, target);
                    lo = mid + 1;
                } else {
                    (function(cLo, cHi, mid, newHi, round, a, t) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → Go left! (hi=' + newHi + ')',
                            action: function() { renderArr(cLo, newHi, mid, -1); infoEl.innerHTML = 'arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → <strong>Discard right half!</strong>'; },
                            undo: function() { renderArr(cLo, cHi, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">Searching for <strong>' + t + '</strong> in the array.</span>'; }
                        });
                    })(cLo, cHi, mid, mid - 1, round, arr, target);
                    hi = mid - 1;
                }
            }
            if (!found) {
                (function(t) {
                    steps.push({ description: 'Search complete: lo &gt; hi → ' + t + ' is not in the array. ❌',
                        action: function() { arrEl.innerHTML = arr.map(function(v, i) { return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;'); }).join(''); infoEl.innerHTML = '<strong style="color:var(--red);font-size:1.1rem;">❌ ' + t + ' is not in the array.</strong>'; },
                        undo: function() { renderArr(0, arr.length - 1, -1, -1); infoEl.innerHTML = '<span style="color:var(--text2)">Searching for <strong>' + t + '</strong> in the array.</span>'; }
                    });
                })(target);
            }
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-basic-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 2: Lower/Upper Bound (boj-10816)
    // ====================================================================
    _renderVizBounds(container) {
        var self = this, suffix = '-bound';
        var DEFAULT_ARR = [-10, -10, 2, 3, 3, 6, 7, 10, 10, 10];
        var DEFAULT_TARGET = 10;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Lower/Upper Bound</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array: <input type="text" id="bs-bound-arr" value="' + DEFAULT_ARR.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:240px;"></label>' +
                '<label style="font-weight:600;">target: <input type="number" id="bs-bound-target" value="' + DEFAULT_TARGET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-bound-reset">🔄</button>' +
            '</div>' +
            '<div id="bd-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bd-arr' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="bd-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bd-arr' + suffix);
        var infoEl = container.querySelector('#bd-info' + suffix);
        var descEl = container.querySelector('#bd-desc' + suffix);
        function rebuild() {
            var rawArr = container.querySelector('#bs-bound-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var arr = rawArr.slice().sort(function(a, b) { return a - b; });
            var target = parseInt(container.querySelector('#bs-bound-target').value);
            if (isNaN(target)) target = DEFAULT_TARGET;
            if (arr.length === 0) arr = DEFAULT_ARR.slice();
            descEl.innerHTML = 'Count occurrences of <strong>' + target + '</strong> in the sorted array using bisect_left/right.';
            function renderArr(highlights) {
                arrEl.innerHTML = arr.map(function(v, i) {
                    var st = 'width:48px;text-align:center;padding:8px 4px;border-radius:8px;font-weight:600;font-size:0.85rem;transition:all 0.3s;';
                    if (highlights && highlights[i]) st += highlights[i];
                    else st += 'background:var(--bg2);';
                    return '<div style="' + st + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
                }).join('');
            }
            renderArr(null);
            infoEl.innerHTML = '<span style="color:var(--text2);">Count occurrences of ' + target + ' using bisect_left and bisect_right.</span>';
            // compute bisect_left
            var leftIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] < target) blo = bm + 1; else bhi = bm; } leftIdx = blo; }
            // compute bisect_right
            var rightIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] <= target) blo = bm + 1; else bhi = bm; } rightIdx = blo; }
            var count = rightIdx - leftIdx;
            var steps = [
                { description: 'bisect_left(' + target + '): ' + target + ' — find first position >= ' + target + '.',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong>' + (leftIdx < arr.length ? ' (arr[' + leftIdx + ']=' + arr[leftIdx] + ' is the first value >= ' + target + ')' : ' (end of array)'); },
                  undo: function() { renderArr(null); infoEl.innerHTML = '<span style="color:var(--text2);">Count occurrences of ' + target + ' using bisect_left and bisect_right.</span>'; }
                },
                { description: 'bisect_right(' + target + '): ' + target + ' — find first position > ' + target + '.',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong>' + (rightIdx >= arr.length ? ' (past end of array)' : '') + '. Range: [' + leftIdx + ', ' + rightIdx + ')'; },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); infoEl.innerHTML = 'bisect_left = <strong>' + leftIdx + '</strong>'; }
                },
                { description: 'Count = bisect_right - bisect_left = ' + rightIdx + ' - ' + leftIdx + ' = ' + count,
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;box-shadow:0 0 8px var(--green)40;'; else h[i] = 'background:var(--bg2);opacity:0.4;'; } renderArr(h); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ ' + target + ' count = ' + rightIdx + ' - ' + leftIdx + ' = ' + count + '</strong>'; },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.5;'; } renderArr(h); infoEl.innerHTML = 'bisect_right = <strong>' + rightIdx + '</strong>'; }
                }
            ];
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-bound-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 3: Cable Cutting (boj-1654)
    // ====================================================================
    _renderVizCable(container) {
        var self = this, suffix = '-cable';
        var DEFAULT_CABLES = [802, 743, 457, 539], DEFAULT_N = 11;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Cable Cutting — Parametric Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Cable lengths: <input type="text" id="bs-cable-arr" value="' + DEFAULT_CABLES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
                '<label style="font-weight:600;">Required N: <input type="number" id="bs-cable-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-cable-reset">🔄</button>' +
            '</div>' +
            '<div id="cb-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cb-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="cb-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#cb-bars' + suffix);
        var infoEl = container.querySelector('#cb-info' + suffix);
        var descEl = container.querySelector('#cb-desc' + suffix);
        function rebuild() {
            var cables = container.querySelector('#bs-cable-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var N = parseInt(container.querySelector('#bs-cable-n').value);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (cables.length === 0) cables = DEFAULT_CABLES.slice();
            var maxC = Math.max.apply(null, cables);
            descEl.innerHTML = 'Find the maximum x such that cutting at length x yields ' + N + ' or more pieces.';
            function renderBars(cutLen) {
                barsEl.innerHTML = cables.map(function(c, i) {
                    var pct = (c / maxC) * 100;
                    var pieces = cutLen > 0 ? Math.floor(c / cutLen) : 0;
                    var segs = '';
                    if (cutLen > 0) {
                        for (var j = 0; j < pieces; j++) {
                            var segPct = (cutLen / c) * 100;
                            segs += '<div style="width:' + segPct + '%;height:100%;background:var(--accent);border-right:2px solid white;"></div>';
                        }
                    }
                    return '<div style="margin-bottom:6px;">' +
                        '<div style="font-size:0.8rem;color:var(--text3);margin-bottom:2px;">' + c + 'cm → ' + pieces + ' pieces</div>' +
                        '<div style="width:' + pct + '%;height:24px;border-radius:6px;overflow:hidden;display:flex;background:var(--bg2);">' + segs + '</div></div>';
                }).join('');
            }
            renderBars(0);
            infoEl.innerHTML = '<span style="color:var(--text2);">Finding the optimal length using binary search.</span>';
            var steps = [], lo = 1, hi = maxC, answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var count = cables.reduce(function(s, c) { return s + Math.floor(c / mid); }, 0);
                round++;
                if (count >= N) {
                    answer = mid; lo = mid + 1;
                    (function(cLo, cHi, mid, count, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + count + ' pcs ≥ ' + N + ' → YES! (lo=' + (mid + 1) + ')',
                            action: function() { renderBars(mid); infoEl.innerHTML = 'x=' + mid + 'cm → <strong>' + count + ' pcs</strong> ≥ ' + N + ' → <span style="color:var(--green);">YES</span> (candidate answer)'; },
                            undo: function() { renderBars(0); infoEl.innerHTML = '<span style="color:var(--text2);">Finding the optimal length using binary search.</span>'; }
                        });
                    })(cLo, cHi, mid, count, round);
                } else {
                    hi = mid - 1;
                    (function(cLo, cHi, mid, count, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + count + ' pcs &lt; ' + N + ' → NO! (hi=' + (mid - 1) + ')',
                            action: function() { renderBars(mid); infoEl.innerHTML = 'x=' + mid + 'cm → <strong>' + count + ' pcs</strong> &lt; ' + N + ' → <span style="color:var(--red);">NO</span>'; },
                            undo: function() { renderBars(0); infoEl.innerHTML = '<span style="color:var(--text2);">Finding the optimal length using binary search.</span>'; }
                        });
                    })(cLo, cHi, mid, count, round);
                }
            }
            var fa = answer, fc = cables.reduce(function(s, c) { return s + Math.floor(c / fa); }, 0);
            steps.push({ description: 'Done! Max length =' + fa + 'cm (' + fc + ' pieces)',
                action: function() { renderBars(fa); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: x = ' + fa + 'cm (' + fc + ' pieces ≥ ' + N + ')</strong>'; },
                undo: function() { renderBars(0); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-cable-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 4: Tree Cutting (boj-2805)
    // ====================================================================
    _renderVizTreeCut(container) {
        var self = this, suffix = '-tree';
        var DEFAULT_TREES = [20, 15, 10, 17], DEFAULT_M = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Tree Cutting — Parametric Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Tree heights: <input type="text" id="bs-tree-arr" value="' + DEFAULT_TREES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">Required M: <input type="number" id="bs-tree-m" value="' + DEFAULT_M + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-tree-reset">🔄</button>' +
            '</div>' +
            '<div id="tr-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="tr-chart' + suffix + '" style="display:flex;gap:16px;justify-content:center;align-items:flex-end;height:160px;margin-bottom:12px;position:relative;"></div>' +
            '<div id="tr-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var chartEl = container.querySelector('#tr-chart' + suffix);
        var infoEl = container.querySelector('#tr-info' + suffix);
        var descEl = container.querySelector('#tr-desc' + suffix);
        function rebuild() {
            var trees = container.querySelector('#bs-tree-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n) && n > 0; });
            var M = parseInt(container.querySelector('#bs-tree-m').value);
            if (isNaN(M) || M < 1) M = DEFAULT_M;
            if (trees.length === 0) trees = DEFAULT_TREES.slice();
            var maxH = Math.max.apply(null, trees);
            descEl.innerHTML = 'Binary search for cutter height H. Required: ' + M + 'm';
            function renderTrees(H) {
                chartEl.innerHTML = trees.map(function(h) {
                    var pct = (h / maxH) * 100;
                    var cutPct = H >= 0 && h > H ? ((h - H) / maxH) * 100 : 0;
                    var mainPct = pct - cutPct;
                    return '<div style="display:flex;flex-direction:column;align-items:center;width:48px;">' +
                        '<div style="font-size:0.8rem;font-weight:600;margin-bottom:2px;">' + h + 'm</div>' +
                        (cutPct > 0 ? '<div style="width:100%;height:' + (cutPct / 100 * 160) + 'px;background:var(--red)30;border:2px dashed var(--red);border-radius:4px 4px 0 0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--red);font-weight:600;">' + (h - H) + '</div>' : '') +
                        '<div style="width:100%;height:' + (mainPct / 100 * 160) + 'px;background:var(--green);border-radius:' + (cutPct > 0 ? '0 0' : '4px 4px') + ' 4px 4px;"></div></div>';
                }).join('');
                if (H >= 0) {
                    var lineTop = ((maxH - H) / maxH) * 160;
                    chartEl.innerHTML += '<div style="position:absolute;left:0;right:0;top:' + lineTop + 'px;border-top:2px dashed var(--accent);font-size:0.75rem;color:var(--accent);text-align:right;padding-right:4px;">H=' + H + '</div>';
                }
            }
            renderTrees(-1);
            infoEl.innerHTML = '<span style="color:var(--text2);">Binary search for height H to get at least ' + M + 'm.</span>';
            var steps = [], lo = 0, hi = maxH, answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var gained = trees.reduce(function(s, h) { return s + Math.max(0, h - mid); }, 0);
                round++;
                if (gained >= M) {
                    answer = mid; lo = mid + 1;
                    (function(mid, gained, cLo, cHi, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + gained + 'm ≥ ' + M + ' → YES (lo=' + (mid + 1) + ')',
                            action: function() { renderTrees(mid); infoEl.innerHTML = 'H=' + mid + ' → cut amount =<strong>' + gained + 'm</strong> ≥ ' + M + ' → <span style="color:var(--green);">YES</span>'; },
                            undo: function() { renderTrees(-1); infoEl.innerHTML = '<span style="color:var(--text2);">Binary searching for height H.</span>'; }
                        });
                    })(mid, gained, cLo, cHi, round);
                } else {
                    hi = mid - 1;
                    (function(mid, gained, cLo, cHi, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + gained + 'm &lt; ' + M + ' → NO (hi=' + (mid - 1) + ')',
                            action: function() { renderTrees(mid); infoEl.innerHTML = 'H=' + mid + ' → cut amount =<strong>' + gained + 'm</strong> &lt; ' + M + ' → <span style="color:var(--red);">NO</span>'; },
                            undo: function() { renderTrees(-1); infoEl.innerHTML = '<span style="color:var(--text2);">Binary searching for height H.</span>'; }
                        });
                    })(mid, gained, cLo, cHi, round);
                }
            }
            var fa = answer, fg = trees.reduce(function(s, h) { return s + Math.max(0, h - fa); }, 0);
            steps.push({ description: 'Done! H = ' + fa + 'm (cut amount: ' + fg + 'm)',
                action: function() { renderTrees(fa); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: H = ' + fa + 'm (cut: ' + fg + 'm ≥ ' + M + ')</strong>'; },
                undo: function() { renderTrees(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-tree-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 5: Router Installation (boj-2110)
    // ====================================================================
    _renderVizRouter(container) {
        var self = this, suffix = '-router';
        var DEFAULT_HOUSES = [1, 2, 4, 8, 9], DEFAULT_C = 3;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Router Installation — Optimization Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Houses: <input type="text" id="bs-router-arr" value="' + DEFAULT_HOUSES.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
                '<label style="font-weight:600;">Routers C: <input type="number" id="bs-router-c" value="' + DEFAULT_C + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-router-reset">🔄</button>' +
            '</div>' +
            '<div id="rt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="rt-line' + suffix + '" style="position:relative;height:80px;margin:16px 0;"></div>' +
            '<div id="rt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var lineEl = container.querySelector('#rt-line' + suffix);
        var infoEl = container.querySelector('#rt-info' + suffix);
        var descEl = container.querySelector('#rt-desc' + suffix);
        function rebuild() {
            var houses = container.querySelector('#bs-router-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            houses.sort(function(a, b) { return a - b; });
            var C = parseInt(container.querySelector('#bs-router-c').value);
            if (isNaN(C) || C < 2) C = DEFAULT_C;
            if (houses.length < 2) houses = DEFAULT_HOUSES.slice();
            var maxPos = houses[houses.length - 1];
            descEl.innerHTML = 'Houses: [' + houses.join(', ') + '], ' + C + ' routers. Can we install with min distance >= d?';
            function renderLine(d, placed) {
                var html = '<div style="position:absolute;left:5%;right:5%;top:35px;height:4px;background:var(--border);border-radius:2px;"></div>';
                houses.forEach(function(h) {
                    var pct = 5 + (h / maxPos) * 90;
                    var isPlaced = placed && placed.indexOf(h) >= 0;
                    html += '<div style="position:absolute;left:' + pct + '%;top:20px;transform:translateX(-50%);text-align:center;">' +
                        '<div style="width:12px;height:12px;border-radius:50%;margin:0 auto;background:' + (isPlaced ? 'var(--accent)' : 'var(--text3)') + ';"></div>' +
                        (isPlaced ? '<div style="font-size:1.2rem;margin-top:2px;">📡</div>' : '') +
                        '<div style="font-size:0.75rem;color:var(--text3);margin-top:2px;">' + h + '</div></div>';
                });
                if (d > 0 && placed && placed.length >= 2) {
                    html += '<div style="position:absolute;left:5%;right:5%;top:62px;font-size:0.75rem;color:var(--text2);text-align:center;">min distance d = ' + d + '</div>';
                }
                lineEl.innerHTML = html;
            }
            renderLine(0, []);
            infoEl.innerHTML = '<span style="color:var(--text2);">Binary searching for minimum distance d.</span>';
            function tryPlace(d) {
                var placed = [houses[0]], last = houses[0];
                for (var i = 1; i < houses.length; i++) {
                    if (houses[i] - last >= d) { placed.push(houses[i]); last = houses[i]; }
                }
                return placed;
            }
            var steps = [], lo = 1, hi = maxPos - houses[0], answer = 0, round = 0;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var placed = tryPlace(mid);
                round++;
                if (placed.length >= C) {
                    answer = mid; lo = mid + 1;
                    (function(mid, placed, cLo, cHi, round) {
                        steps.push({ description: round + 'Round d=' + mid + ' → ' + placed.length + ' installed [' + placed.join(',') + '] ≥ ' + C + ' → YES',
                            action: function() { renderLine(mid, placed); infoEl.innerHTML = 'd=' + mid + ' → <strong>' + placed.length + ' installed</strong> → <span style="color:var(--green);">YES</span> (lo=' + (mid + 1) + ')'; },
                            undo: function() { renderLine(0, []); infoEl.innerHTML = '<span style="color:var(--text2);">Binary searching for minimum distance d.</span>'; }
                        });
                    })(mid, placed, cLo, cHi, round);
                } else {
                    hi = mid - 1;
                    (function(mid, placed, cLo, cHi, round) {
                        steps.push({ description: round + 'Round d=' + mid + ' → ' + placed.length + ' installed &lt; ' + C + ' → NO',
                            action: function() { renderLine(mid, placed); infoEl.innerHTML = 'd=' + mid + ' → <strong>' + placed.length + ' installed</strong> → <span style="color:var(--red);">NO</span> (hi=' + (mid - 1) + ')'; },
                            undo: function() { renderLine(0, []); infoEl.innerHTML = '<span style="color:var(--text2);">Binary searching for minimum distance d.</span>'; }
                        });
                    })(mid, placed, cLo, cHi, round);
                }
            }
            var fp = tryPlace(answer);
            steps.push({ description: 'Done! Maximum minimum distance d = ' + answer,
                action: function() { renderLine(answer, fp); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: d = ' + answer + ' (placed: [' + fp.join(', ') + '])</strong>'; },
                undo: function() { renderLine(0, []); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-router-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 6: K-th Number (boj-1300)
    // ====================================================================
    _renderVizKth(container) {
        var self = this, suffix = '-kth';
        var DEFAULT_N = 3, DEFAULT_K = 7;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">K-th Number — N×N Multiplication Table</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">N: <input type="number" id="bs-kth-n" value="' + DEFAULT_N + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;" min="1" max="8"></label>' +
                '<label style="font-weight:600;">K: <input type="number" id="bs-kth-k" value="' + DEFAULT_K + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
                '<button class="btn btn-primary" id="bs-kth-reset">🔄</button>' +
            '</div>' +
            '<div id="kt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="kt-table' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="kt-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var tableEl = container.querySelector('#kt-table' + suffix);
        var infoEl = container.querySelector('#kt-info' + suffix);
        var descEl = container.querySelector('#kt-desc' + suffix);
        function rebuild() {
            var N = parseInt(container.querySelector('#bs-kth-n').value);
            var k = parseInt(container.querySelector('#bs-kth-k').value);
            if (isNaN(N) || N < 1) N = DEFAULT_N;
            if (N > 8) N = 8; // cap for visual display
            if (isNaN(k) || k < 1) k = DEFAULT_K;
            if (k > N * N) k = N * N;
            descEl.innerHTML = 'Find the k=' + k + '-th smallest number in the ' + N + '×' + N + ' multiplication table.';
            function renderTable(x) {
                var html = '<table style="border-collapse:collapse;margin:0 auto;">';
                html += '<tr><td style="padding:6px 12px;font-weight:600;color:var(--text3);">×</td>';
                for (var j = 1; j <= N; j++) html += '<td style="padding:6px 12px;font-weight:600;color:var(--text3);">' + j + '</td>';
                html += '</tr>';
                for (var i = 1; i <= N; i++) {
                    html += '<tr><td style="padding:6px 12px;font-weight:600;color:var(--text3);">' + i + '</td>';
                    for (var j = 1; j <= N; j++) {
                        var v = i * j;
                        var bg = x >= 0 && v <= x ? 'background:var(--accent)20;' : '';
                        html += '<td style="padding:6px 12px;text-align:center;border:1px solid var(--border);border-radius:4px;' + bg + '">' + v + '</td>';
                    }
                    html += '</tr>';
                }
                html += '</table>';
                if (x >= 0) {
                    var cnt = 0;
                    for (var i = 1; i <= N; i++) cnt += Math.min(Math.floor(x / i), N);
                    html += '<div style="text-align:center;margin-top:8px;font-size:0.85rem;color:var(--text2);">' + x + ' or less: <strong>' + cnt + '</strong></div>';
                }
                tableEl.innerHTML = html;
            }
            renderTable(-1);
            infoEl.innerHTML = '<span style="color:var(--text2);">Find smallest x where numbers <= x total at least ' + k + '.</span>';
            var steps = [], lo = 1, hi = k, round = 0;
            while (lo < hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var cnt = 0;
                for (var i = 1; i <= N; i++) cnt += Math.min(Math.floor(mid / i), N);
                round++;
                if (cnt >= k) {
                    hi = mid;
                    (function(mid, cnt, cLo, cHi, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + cnt + ' pcs ≥ ' + k + ' → hi=' + mid,
                            action: function() { renderTable(mid); infoEl.innerHTML = 'x=' + mid + ' → <strong>' + cnt + ' pcs</strong> ≥ ' + k + ' → <span style="color:var(--green);">hi=' + mid + '</span>'; },
                            undo: function() { renderTable(-1); infoEl.innerHTML = '<span style="color:var(--text2);">Find smallest x where numbers <= x total at least ' + k + '.</span>'; }
                        });
                    })(mid, cnt, cLo, cHi, round);
                } else {
                    lo = mid + 1;
                    (function(mid, cnt, cLo, cHi, round) {
                        steps.push({ description: round + 'Round lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → ' + cnt + ' pcs &lt; ' + k + ' → lo=' + (mid + 1),
                            action: function() { renderTable(mid); infoEl.innerHTML = 'x=' + mid + ' → <strong>' + cnt + ' pcs</strong> &lt; ' + k + ' → <span style="color:var(--red);">lo=' + (mid + 1) + '</span>'; },
                            undo: function() { renderTable(-1); infoEl.innerHTML = '<span style="color:var(--text2);">Find smallest x where numbers <= x total at least ' + k + '.</span>'; }
                        });
                    })(mid, cnt, cLo, cHi, round);
                }
            }
            steps.push({ description: 'Done! k=' + k + '-th number = ' + lo,
                action: function() { renderTable(lo); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: ' + k + '-th number = ' + lo + '</strong>'; },
                undo: function() { renderTable(-1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-kth-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ====================================================================
    // Simulation 7: LIS (boj-12015)
    // ====================================================================
    _renderVizLIS(container) {
        var self = this, suffix = '-lis';
        var DEFAULT_A = [10, 20, 10, 30, 20, 50];
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS + Binary Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Sequence: <input type="text" id="bs-lis-arr" value="' + DEFAULT_A.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="bs-lis-reset">🔄</button>' +
            '</div>' +
            '<div id="lis-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div style="margin-bottom:8px;"><strong>Original Sequence</strong></div>' +
            '<div id="lis-arr' + suffix + '" style="display:flex;gap:4px;margin-bottom:16px;"></div>' +
            '<div style="margin-bottom:8px;"><strong>tails array</strong></div>' +
            '<div id="lis-tails' + suffix + '" style="display:flex;gap:4px;margin-bottom:12px;min-height:48px;"></div>' +
            '<div id="lis-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#lis-arr' + suffix);
        var tailsEl = container.querySelector('#lis-tails' + suffix);
        var infoEl = container.querySelector('#lis-info' + suffix);
        var descEl = container.querySelector('#lis-desc' + suffix);
        function box(v, hl) { return '<div style="width:48px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:600;' + (hl || 'background:var(--bg2);') + '">' + v + '</div>'; }
        function rebuild() {
            var A = container.querySelector('#bs-lis-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (A.length === 0) A = DEFAULT_A.slice();
            descEl.innerHTML = 'Sequence: [' + A.join(', ') + ']. Building the tails array with binary search.';
            function renderArr(curIdx) {
                arrEl.innerHTML = A.map(function(v, i) {
                    if (i === curIdx) return box(v, 'background:var(--accent);color:white;');
                    if (i < curIdx) return box(v, 'background:var(--bg2);opacity:0.5;');
                    return box(v, 'background:var(--bg2);');
                }).join('');
            }
            function renderTails(tails, hlIdx) {
                if (tails.length === 0) { tailsEl.innerHTML = '<div style="color:var(--text3);padding:10px;">Empty</div>'; return; }
                tailsEl.innerHTML = tails.map(function(v, i) {
                    if (i === hlIdx) return box(v, 'background:var(--green);color:white;');
                    return box(v, 'background:var(--green)20;border:2px solid var(--green);');
                }).join('');
            }
            renderArr(-1);
            renderTails([], -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">Iterating through each element to build the tails array.</span>';
            var steps = [], tails = [];
            A.forEach(function(x, idx) {
                var prevTails = tails.slice();
                // bisect_left
                var pos = 0, lo2 = 0, hi2 = tails.length;
                while (lo2 < hi2) { var m = Math.floor((lo2 + hi2) / 2); if (tails[m] < x) lo2 = m + 1; else hi2 = m; }
                pos = lo2;
                if (pos === tails.length) {
                    tails.push(x);
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({ description: 'A[' + idx + ']=' + x + ': greater than tails end → append. tails=[' + newTails.join(',') + '] (length ' + newTails.length + ')',
                            action: function() { renderArr(idx); renderTails(newTails, pos); infoEl.innerHTML = x + ' &gt; tails end → <strong>append</strong>. LIS length = ' + newTails.length; },
                            undo: function() { renderArr(-1); renderTails(prevTails, -1); infoEl.innerHTML = '<span style="color:var(--text2);">Iterating through each element to build the tails array.</span>'; }
                        });
                    })(idx, x, pos, prevTails, newTails);
                } else {
                    tails[pos] = x;
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({ description: 'A[' + idx + ']=' + x + ': bisect_left → pos=' + pos + ', tails[' + pos + ']=' + x + ' replaced. tails=[' + newTails.join(',') + ']',
                            action: function() { renderArr(idx); renderTails(newTails, pos); infoEl.innerHTML = x + ' → tails[' + pos + '] <strong>replaced</strong>. LIS length = ' + newTails.length; },
                            undo: function() { renderArr(-1); renderTails(prevTails, -1); infoEl.innerHTML = '<span style="color:var(--text2);">Iterating through each element to build the tails array.</span>'; }
                        });
                    })(idx, x, pos, prevTails, newTails);
                }
            });
            var ft = tails.slice();
            steps.push({ description: 'Done! LIS length = ' + ft.length,
                action: function() { renderArr(A.length); renderTails(ft, -1); infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ LIS length = ' + ft.length + ' (tails=[' + ft.join(',') + '])</strong>'; },
                undo: function() { renderArr(-1); renderTails(ft, -1); }
            });
            self._initStepController(container, steps, suffix);
        }
        container.querySelector('#bs-lis-reset').addEventListener('click', function() { self._clearVizState(); rebuild(); });
        rebuild();
    },

    // ===== Empty Stub =====
    renderVisualize(container) {},
    renderProblem(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Basic Binary Search', desc: 'Finding values in an array (Silver IV)', problemIds: ['boj-1920', 'boj-10816'] },
        { num: 2, title: 'Parametric Search Intro', desc: 'Finding optimal values with binary search (Silver II)', problemIds: ['boj-1654', 'boj-2805'] },
        { num: 3, title: 'Parametric Search Advanced', desc: 'Complex decision functions (Gold)', problemIds: ['boj-2110', 'boj-1300'] },
        { num: 4, title: 'Applications', desc: 'LIS + Binary Search (Gold II)', problemIds: ['boj-12015'] }
    ],

    // ===== Problem List =====
    problems: [
        {
            id: 'boj-1920', title: 'BOJ 1920 - Find a Number', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1920',
            simIntro: 'Observe how binary search finds a value in a sorted array.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N integers A[1], A[2], ..., A[N], write a program to determine whether an integer X exists in this set.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n4 1 5 2 3\n5\n1 3 7 9 5</pre></div>
                    <div><strong>Output</strong><pre>1\n1\n0\n0\n1</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 100,000</li>
                    <li>-2<sup>31</sup> ≤ element ≤ 2<sup>31</sup></li>
                    <li>1 ≤ M ≤ 100,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'For each query, we could <strong>scan the entire array</strong> to check if the number exists, right?<br>M queries x N elements compared one by one → solve with a double loop!' },
                { title: 'But there\'s a problem with this', content: 'N and M are up to <strong>100,000</strong>. In the worst case, 100,000 x 100,000 = <strong>10 billion</strong> comparisons.<br>No way this finishes within the time limit! O(N x M) is way too slow.' },
                { title: 'What if we try this?', content: 'What if we <strong>sort the array first</strong>? In a sorted array, we can use <strong>binary search</strong> to halve the search range each time!<br>One search is O(log N), so all M queries take O(M log N). Even with sorting O(N log N), the total <strong>O((N+M) log N)</strong> is more than fast enough.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: Use <code>bisect_left(A, x)</code> to find where x would be inserted, then check if the value at that position equals x!</span><span class="lang-cpp">C++: <code>binary_search(A, A+N, x)</code> checks existence in one line! Or use <code>lower_bound()</code> to find the position and compare.</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nfor x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, M, A[100001];\nbool bsearch(int target) {\n    int lo = 0, hi = N - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (A[mid] == target) return true;\n        else if (A[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return false;\n}\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n    cin >> M;\n    for (int i = 0; i < M; i++) { int x; cin >> x; cout << (bsearch(x) ? 1 : 0) << "\\n"; }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Sort + Binary Search',
                description: 'Sort the array, then use bisect_left to check existence.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input & Sort', desc: 'Binary search only works on sorted arrays.\nSort the input array right away.', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = sorted(list(map(int, input().split())))' },
                        { title: 'Query Input', desc: 'Read M numbers to check for existence.', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: 'Binary Search', desc: 'Use bisect_left to find where x would be inserted, then check if the value at that position equals x.\nLinear scan is O(N), but binary search determines it in O(log N).', code: 'for x in queries:\n    idx = bisect_left(A, x)\n    if idx < N and A[idx] == x:\n        print(1)\n    else:\n        print(0)' }
                    ],
                    cpp: [
                        { title: 'Input & Sort', desc: 'Binary search only works on sorted arrays.\nSort in ascending order with sort() to prepare for searching.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);  // Must sort before binary search!' },
                        { title: 'Query Input', desc: 'Read M numbers to check for existence.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n\n    int M;\n    cin >> M;' },
                        { title: 'Binary Search', desc: 'Use binary_search from <algorithm> to check existence in O(log N).\nUsing STL instead of manual implementation keeps the code concise.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, A[100001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> A[i];\n    sort(A, A + N);\n\n    int M;\n    cin >> M;\n\n    while (M--) {\n        int x;\n        cin >> x;\n        // binary_search: binary search function from <algorithm>\n        cout << (binary_search(A, A + N, x) ? 1 : 0) << "\\n";\n    }\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-10816', title: 'BOJ 10816 - Number Card 2', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10816',
            simIntro: 'Visually observe the difference between lower_bound and upper_bound.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>A number card has one integer written on it. Sanggeun has N number cards. Given M integers, write a program to find how many number cards Sanggeun has with each given number.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>10\n6 3 2 10 10 10 -10 -10 7 3\n8\n10 9 -5 2 3 4 5 -10</pre></div>
                    <div><strong>Output</strong><pre>3 0 0 1 2 0 0 2</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 500,000</li>
                    <li>1 ≤ M ≤ 500,000</li>
                    <li>-10<sup>7</sup> ≤ card value ≤ 10<sup>7</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'For each query, <strong>scan the entire card array</strong> and count how many match, right?<br>A simple loop can count them!' },
                { title: 'But there\'s a problem with this', content: 'N and M are up to <strong>500,000</strong>. Scanning 500K cards per query means 500,000 x 500,000 = <strong>250 billion</strong> operations!<br>O(N x M) is guaranteed TLE.' },
                { title: 'What if we try this?', content: 'If we <strong>sort</strong> the array, identical numbers are <strong>grouped together</strong>!<br>Then we just need to find "where x starts" and "where x ends" to get count = end - start.<br>Finding both positions with binary search is O(log N) each, so the total is <strong>O((N+M) log N)</strong>!' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>bisect_right(cards, x) - bisect_left(cards, x)</code> gives you the count of x in one line!<br><code>bisect_left</code> gives where x starts, <code>bisect_right</code> gives where the next value after x starts.</span><span class="lang-cpp">C++: <code>upper_bound(cards, cards+N, x) - lower_bound(cards, cards+N, x)</code> computes the range length the same way!<br><code>lower_bound</code> returns the first position >= x, <code>upper_bound</code> returns the first position > x.</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))\nM = int(input())\nqueries = list(map(int, input().split()))\n\nresult = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    int cards[500001];\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n    int M; cin >> M;\n    for (int i = 0; i < M; i++) {\n        int x; cin >> x;\n        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);\n        cout << cnt << (i < M - 1 ? " " : "\\n");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: 'bisect_left + bisect_right',
                description: 'Sort then compute count using upper_bound - lower_bound.',
                timeComplexity: 'O((N+M) log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input & Sort', desc: 'Sort the card array for binary search.\nAfter sorting, identical numbers are grouped consecutively, so we can count by range.', code: 'import sys\nfrom bisect import bisect_left, bisect_right\ninput = sys.stdin.readline\n\nN = int(input())\ncards = sorted(list(map(int, input().split())))' },
                        { title: 'Query Processing', desc: 'Read M numbers whose counts need to be checked.', code: 'M = int(input())\nqueries = list(map(int, input().split()))' },
                        { title: 'Count & Output', desc: 'bisect_right(x) - bisect_left(x) = length of the range where x appears = count.\nIn a sorted array, identical values form a contiguous range, so the difference of the two endpoints is the count.', code: 'result = []\nfor x in queries:\n    result.append(bisect_right(cards, x) - bisect_left(cards, x))\n\nprint(\' \'.join(map(str, result)))' }
                    ],
                    cpp: [
                        { title: 'Input & Sort', desc: 'Sort the card array for binary search.\nAfter sorting, identical numbers are grouped consecutively, so we can count by range.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);' },
                        { title: 'Query Processing', desc: 'Read M numbers whose counts need to be checked.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n\n    int M;\n    cin >> M;' },
                        { title: 'Count & Output', desc: 'Compute the count of each value in O(log N) using upper_bound - lower_bound.\nSTL upper_bound returns the first position > x, lower_bound returns the first position >= x.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, cards[500001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    cin >> N;\n    for (int i = 0; i < N; i++) cin >> cards[i];\n    sort(cards, cards + N);\n\n    int M;\n    cin >> M;\n\n    while (M--) {\n        int x;\n        cin >> x;\n        // upper_bound - lower_bound = count of this value\n        int cnt = upper_bound(cards, cards + N, x) - lower_bound(cards, cards + N, x);\n        cout << cnt;\n        if (M) cout << " ";\n    }\n    cout << "\\n";\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[1].templates; }
            }]
        },
        {
            id: 'boj-1654', title: 'BOJ 1654 - Cutting LAN Cables', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1654',
            simIntro: 'Observe how binary search determines the cable cutting length.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Young-sik already has K LAN cables and wants to cut them to make N cables of equal length. Assume there is no loss when cutting. It is guaranteed that N cables can always be made from the K cables. Making more than N counts as making N. Find the maximum possible length of each cable.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 11\n802\n743\n457\n539</pre></div>
                    <div><strong>Output</strong><pre>200</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ K ≤ 10,000</li>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>Cable length is a natural number ≤ 2<sup>31</sup> - 1</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'What if we start from length 1cm and increment by 1 each time, checking whether we can make N or more pieces at that length?<br>Keep going until we find the longest possible length!' },
                { title: 'But there\'s a problem with this', content: 'Cable lengths can be up to <strong>2<sup>31</sup> - 1</strong> (about 2.1 billion). Trying every length from 1 to 2.1 billion one by one?<br>In the worst case, 2.1 billion iterations x K cables to check = <strong>billions of operations</strong>... TLE for sure!' },
                { title: 'What if we try this?', content: '"Can we make N or more pieces when cutting at length x?" — the answer is YES when x is small and flips to NO at some point as x grows.<br>This <strong>monotonicity</strong> means we can use <strong>Parametric Search (binary search)</strong> to find the boundary!<br>Set lo=1, hi=max(cables), and at mid, count = sum(each cable // mid).<br>If count >= N, try longer (lo=mid+1). If not enough, try shorter (hi=mid-1).<br>Warning: <strong>lo=0 causes division by zero!</strong> Always start from lo=1.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>sum(c // mid for c in cables)</code> counts pieces in one line. Integer division <code>//</code> is the key!</span><span class="lang-cpp">C++: Cable lengths go up to 2<sup>31</sup>-1, so you must use <code>long long</code>. Accumulate <code>cables[i] / mid</code> in a <code>for</code> loop.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]\n\nlo, hi = 1, max(cables)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    int K, N; cin >> K >> N;\n    ll cables[10001], maxLen = 0;\n    for (int i = 0; i < K; i++) { cin >> cables[i]; maxLen = max(maxLen, cables[i]); }\n    ll lo = 1, hi = maxLen, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Parametric Search',
                description: 'Binary search whether cutting at length x yields N or more pieces.',
                timeComplexity: 'O(K log max)',
                spaceComplexity: 'O(K)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the lengths of K cables.\nWe need to cut them into N pieces.', code: 'import sys\ninput = sys.stdin.readline\n\nK, N = map(int, input().split())\ncables = [int(input()) for _ in range(K)]' },
                        { title: 'Binary Search Range', desc: 'Parametric Search: "Can we make N or more pieces when cutting at length x?".\nlo=1 (minimum length), hi=max(cables) (longest cable). lo=0 would cause division by zero!', code: 'lo, hi = 1, max(cables)\nanswer = 0' },
                        { title: 'Binary Search + Decision', desc: 'If the sum of floor(cable/mid) for all cables is >= N, it is feasible. Try a longer length.\nIf not feasible, try a shorter length. Store the maximum feasible length in answer.', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = sum(c // mid for c in cables)\n    if count >= N:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: 'Output', desc: 'Print the maximum cable length that satisfies the condition.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read the lengths of K cables.\nSince cable lengths can be up to 2^31-1, we use long long.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }' },
                        { title: 'Binary Search Range', desc: 'Parametric Search: "Can we make N or more pieces when cutting at length x?".\nlo=1, hi=max cable length. Use long long to prevent overflow.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;' },
                        { title: 'Binary Search + Decision', desc: 'If the sum of floor(cable/mid) for all cables is >= N, try a longer length (lo = mid + 1).\nIf not feasible, try shorter (hi = mid - 1). Update answer whenever feasible.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) {\n            answer = mid;  // Feasible! Try longer length\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;  // Not feasible, try shorter\n        }\n    }' },
                        { title: 'Output', desc: 'Print the maximum cable length that satisfies the condition.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    int K, N;\n    cin >> K >> N;\n    ll cables[10001];\n    ll maxLen = 0;\n    for (int i = 0; i < K; i++) {\n        cin >> cables[i];\n        maxLen = max(maxLen, cables[i]);\n    }\n\n    ll lo = 1, hi = maxLen;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (int i = 0; i < K; i++) count += cables[i] / mid;\n        if (count >= N) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-2805', title: 'BOJ 2805 - Cutting Trees', difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2805',
            simIntro: 'Observe how binary search determines the cutter height.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Sanggeun needs M meters of wood. When a cutter height H is set, all trees in a row are cut at height H, removing everything above H. Trees shorter than H are not cut. Find the maximum height H that the cutter can be set to in order to take home at least M meters of wood.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4 7\n20 15 10 17</pre></div>
                    <div><strong>Output</strong><pre>15</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 20\n4 42 40 26 46</pre></div>
                    <div><strong>Output</strong><pre>36</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ M ≤ 2,000,000,000</li>
                    <li>0 ≤ tree height ≤ 1,000,000,000</li>
                    <li>M is always achievable from the given trees</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'What if we start with cutter height 0 and increment by 1 each time, checking whether we can get M meters or more of wood?<br>From each tree we can take <code>max(0, tree_height - H)</code>, so summing them all gives the total wood gathered.' },
                { title: 'But there\'s a problem with this', content: 'Tree heights can be up to <strong>1 billion</strong>! Incrementing height from 0 to 1B one by one means up to <strong>1 billion iterations</strong> x N trees to check...<br>N is also up to 1M, so the number of operations is astronomical. Guaranteed TLE!' },
                { title: 'What if we try this?', content: 'Same pattern as Cable Cutting! "Can we get M meters or more when cutting at height H?"<br>Low H means lots of wood (YES), high H means little wood (NO) — there is <strong>monotonicity</strong>!<br>Binary search with lo=0, hi=max(trees). Total wood at mid = sum(max(0, tree - mid)).<br>If >= M, try higher (lo=mid+1). If not enough, go lower (hi=mid-1).<br>Warning: <span class="lang-py">Python has no integer overflow, but</span><span class="lang-cpp">in C++ the total wood can <strong>exceed int range, so you must use long long</strong>!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))\n\nlo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; ll M; cin >> N >> M;\n    int trees[1000001]; int maxH = 0;\n    for (int i = 0; i < N; i++) { cin >> trees[i]; maxH = max(maxH, trees[i]); }\n    ll lo = 0, hi = maxH, answer = 0;\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2, gained = 0;\n        for (int i = 0; i < N; i++) if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Parametric Search',
                description: 'Binary search on cutter height H to check if the cut amount is at least M.',
                timeComplexity: 'O(N log max)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Read the heights of N trees and the required wood amount M.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())\ntrees = list(map(int, input().split()))' },
                        { title: 'Binary Search', desc: 'Parametric Search: "Can we get M meters or more when cutting at height H?".\nIf feasible, try a higher H (lo=mid+1). If not, try lower (hi=mid-1).\nWe want to maximize H, so update answer whenever feasible.', code: 'lo, hi = 0, max(trees)\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    gained = sum(max(0, t - mid) for t in trees)\n    if gained >= M:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: 'Output', desc: 'Print the maximum cutter height that satisfies the condition.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'Read the heights of N trees and the required wood amount M.\nThe total wood can exceed int range, so M is declared as long long.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }' },
                        { title: 'Binary Search', desc: 'Parametric Search: "Can we get M meters or more when cutting at height mid?".\nThe total gained can exceed int range, so accumulate with long long.\nIf feasible, try higher. If not, lower the height.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }\n\n    ll lo = 0, hi = maxH;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll gained = 0;\n        for (int i = 0; i < N; i++)\n            if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }' },
                        { title: 'Output', desc: 'Print the maximum cutter height that satisfies the condition.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    ll M;\n    cin >> N >> M;\n    int trees[1000001];\n    int maxH = 0;\n    for (int i = 0; i < N; i++) {\n        cin >> trees[i];\n        maxH = max(maxH, trees[i]);\n    }\n\n    ll lo = 0, hi = maxH;\n    ll answer = 0;\n\n    while (lo <= hi) {\n        ll mid = (lo + hi) / 2;\n        ll gained = 0;\n        for (int i = 0; i < N; i++)\n            if (trees[i] > mid) gained += trees[i] - mid;\n        if (gained >= M) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-2110', title: 'BOJ 2110 - Installing Routers', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/2110',
            simIntro: 'Observe how binary search on minimum distance d places the routers.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Dohyun has N houses on a number line. Given the coordinates of each house, he wants to install C routers. He wants to maximize the minimum distance between any two adjacent routers. Print this maximum possible minimum distance.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 3\n1\n2\n8\n4\n9</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div><p class="example-explain">Installing at 1, 4, 8 gives a minimum adjacent distance of 3.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>2 ≤ N ≤ 200,000</li>
                    <li>2 ≤ C ≤ N</li>
                    <li>0 ≤ coordinate ≤ 1,000,000,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'How about trying <strong>every combination</strong> of C houses out of N to install routers?<br>For each combination, compute the minimum adjacent distance, and take the maximum of all those!' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>200,000</strong>. The number of ways to choose C out of N is... astronomically huge!<br>For example, choosing 100,000 out of 200,000? That is <strong>absolutely impossible</strong> to compute.' },
                { title: 'What if we try this?', content: 'Flip the idea! Instead of trying combinations, ask: <strong>"Can we install C routers such that the minimum distance between any two is at least d?"</strong><br>The check is simple: sort the houses, place a router at the first house, then <strong>greedily</strong> place routers at the next house that is at least d away.<br>If the count &ge; C, it is feasible! If feasible, try a larger distance (lo=mid+1). If not, try smaller (hi=mid-1).<br>Range: lo=1, hi=distance between the farthest two houses.' },
                { title: 'In Python/C++!', content: 'The key is to sort and build a greedy decision function:<br><span class="lang-py">Python: After sorting, iterate with a <code>for</code> loop and install when <code>houses[i] - last &gt;= mid</code>, then update <code>last</code>.</span><span class="lang-cpp">C++: Same logic, but since coordinates can be up to 1B, using <code>long long</code> for distance calculations is safer.</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])\n\nlo, hi = 1, houses[-1] - houses[0]\nanswer = 0\n\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1\n\nprint(answer)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint N, C, houses[200001];\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n    long long lo = 1, hi = houses[N-1] - houses[0], answer = 0;\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) { if (houses[i] - last >= mid) { count++; last = houses[i]; } }\n        if (count >= C) { answer = mid; lo = mid + 1; } else hi = mid - 1;\n    }\n    cout << answer << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Parametric Search (distance)',
                description: 'Binary search whether C routers can be installed with minimum distance d or more.',
                timeComplexity: 'O(N log(max-min))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input & Sort', desc: 'Sort the house coordinates.\nSorting is required so we can greedily place routers from left to right.', code: 'import sys\ninput = sys.stdin.readline\n\nN, C = map(int, input().split())\nhouses = sorted([int(input()) for _ in range(N)])' },
                        { title: 'Binary Search Range', desc: 'Parametric Search: "Can we install C routers with minimum distance d or more?".\nlo=1 (minimum distance), hi=distance between the farthest two houses.', code: 'lo, hi = 1, houses[-1] - houses[0]\nanswer = 0' },
                        { title: 'Search + Greedy Decision', desc: 'Greedy check: install at the first house, then install at the next house that is at least d away. Repeat.\nIf installed count >= C, feasible. Try a larger distance. Otherwise, try smaller.', code: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    count = 1\n    last = houses[0]\n    for i in range(1, N):\n        if houses[i] - last >= mid:\n            count += 1\n            last = houses[i]\n    if count >= C:\n        answer = mid\n        lo = mid + 1\n    else:\n        hi = mid - 1' },
                        { title: 'Output', desc: 'Print the maximum minimum distance between any two adjacent routers.', code: 'print(answer)' }
                    ],
                    cpp: [
                        { title: 'Input & Sort', desc: 'Sort the house coordinates.\nSorting is required so we can greedily place routers from left to right.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);' },
                        { title: 'Binary Search Range', desc: 'Parametric Search: "Can we install C routers with minimum distance mid or more?".\nlo=1, hi=distance between the farthest two houses. Use long long to prevent overflow.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;' },
                        { title: 'Search + Greedy Decision', desc: 'Greedy check: install at the first house, then install at the next house that is at least mid away. Repeat.\nIf installed count >= C, feasible. Try larger distance. Otherwise, try smaller.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;\n\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) {\n            if (houses[i] - last >= mid) {\n                count++;\n                last = houses[i];\n            }\n        }\n        if (count >= C) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }' },
                        { title: 'Output', desc: 'Print the maximum minimum distance between any two adjacent routers.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\nint houses[200001];\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N, C;\n    cin >> N >> C;\n    for (int i = 0; i < N; i++) cin >> houses[i];\n    sort(houses, houses + N);\n\n    long long lo = 1, hi = houses[N-1] - houses[0];\n    long long answer = 0;\n\n    while (lo <= hi) {\n        long long mid = (lo + hi) / 2;\n        int count = 1, last = houses[0];\n        for (int i = 1; i < N; i++) {\n            if (houses[i] - last >= mid) {\n                count++;\n                last = houses[i];\n            }\n        }\n        if (count >= C) {\n            answer = mid;\n            lo = mid + 1;\n        } else {\n            hi = mid - 1;\n        }\n    }\n\n    cout << answer << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[4].templates; }
            }]
        },
        {
            id: 'boj-1300', title: 'BOJ 1300 - K-th Number', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1300',
            simIntro: 'Observe how binary search counts numbers <= x in the N*N multiplication table.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Sejun created an N*N array A where A[i][j] = i * j. If all these values are placed into a 1D array B of size N*N and B is sorted in ascending order, find B[k]. Array indices for A and B start from 1.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n7</pre></div>
                    <div><strong>Output</strong><pre>6</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 10<sup>5</sup></li>
                    <li>1 ≤ k ≤ min(10<sup>9</sup>, N<sup>2</sup>)</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'Put all values from the N*N multiplication table into an array, <strong>sort</strong> it, and pick the k-th element, right?<br>Since A[i][j] = i * j, a double loop generates all N² values, then sort!' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>10<sup>5</sup></strong>. N² = <strong>10<sup>10</sup></strong> (10 billion) values in an array?<br>That requires tens of GB of memory, and sorting takes even longer. <strong>Both MLE and TLE</strong>!' },
                { title: 'What if we try this?', content: 'We do not need to generate all values. We just need to quickly count <strong>"how many values are <= x?"</strong><br>In row i, the count of j where i*j &le; x is min(x &divide; i, N). Summing from i=1 to N gives the total in O(N).<br>Then binary search for the <strong>smallest x where count >= k</strong> — that is the answer!<br>Range: lo=1, hi=k (the k-th number is always <= k). If <code>count &ge; k</code>, set hi=mid. Otherwise lo=mid+1 (lower_bound style).' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>count = sum(min(mid // i, N) for i in range(1, N+1))</code> counts values <= x in one line!</span><span class="lang-cpp">C++: <code>for (ll i = 1; i &lt;= N; i++) count += min(mid / i, N);</code> implements the same logic. Since N and k can be large, use <code>long long</code>.</span>' }
            ],
            templates: {
                python: 'N = int(input())\nk = int(input())\n\nlo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1\n\nprint(lo)',
                cpp: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\nint main() {\n    ll N, k; cin >> N >> k;\n    ll lo = 1, hi = k;\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2, count = 0;\n        for (ll i = 1; i <= N; i++) count += min(mid / i, N);\n        if (count >= k) hi = mid; else lo = mid + 1;\n    }\n    cout << lo << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'Decision Problem + Binary Search',
                description: 'Count values <= x in O(N), then binary search for the smallest x where count >= k.',
                timeComplexity: 'O(N log k)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'We need to find the k-th smallest number in the N*N multiplication table.\nSorting all N² values would cause MLE, so we use binary search instead.', code: 'N = int(input())\nk = int(input())' },
                        { title: 'Binary Search (lower_bound)', desc: 'Find the smallest x where "count of values <= x is at least k" (lower_bound style).\nIn row i, the count of j where i*j <= x is min(x//i, N), computable in O(N).\nhi=k because the k-th number is always <= k.', code: 'lo, hi = 1, k\n\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    count = 0\n    for i in range(1, N + 1):\n        count += min(mid // i, N)\n    if count >= k:\n        hi = mid\n    else:\n        lo = mid + 1' },
                        { title: 'Output', desc: 'When lo == hi, that value is the k-th number.', code: 'print(lo)' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'We need to find the k-th smallest number in the N*N multiplication table.\nN is up to 10^5, so sorting all N² values would cause MLE. Use binary search instead.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;' },
                        { title: 'Binary Search (lower_bound)', desc: 'Find the smallest x where "count of values <= x is at least k" (lower_bound style).\nIn row i, count of j where i*j <= x is min(mid/i, N), computable in O(N).\nIf count >= k, set hi = mid. Otherwise, lo = mid + 1.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;\n\n    ll lo = 1, hi = k;\n\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (ll i = 1; i <= N; i++)\n            count += min(mid / i, N);  // values <= mid in row i\n        if (count >= k)\n            hi = mid;\n        else\n            lo = mid + 1;\n    }' },
                        { title: 'Output', desc: 'When lo == hi, that value is the k-th number.', code: '#include <iostream>\n#include <algorithm>\nusing namespace std;\ntypedef long long ll;\n\nint main() {\n    ll N, k;\n    cin >> N >> k;\n\n    ll lo = 1, hi = k;\n\n    while (lo < hi) {\n        ll mid = (lo + hi) / 2;\n        ll count = 0;\n        for (ll i = 1; i <= N; i++)\n            count += min(mid / i, N);\n        if (count >= k)\n            hi = mid;\n        else\n            lo = mid + 1;\n    }\n\n    cout << lo << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[5].templates; }
            }]
        },
        {
            id: 'boj-12015', title: 'BOJ 12015 - Longest Increasing Subsequence 2', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/12015',
            simIntro: 'Observe the LIS algorithm inserting elements into the tails array with binary search.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a sequence A, write a program to find the length of the longest increasing subsequence. For example, if A = {10, 20, 10, 30, 20, 50}, the longest increasing subsequence is A = {<strong>10</strong>, <strong>20</strong>, 10, <strong>30</strong>, 20, <strong>50</strong>}, and its length is 4.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>6\n10 20 10 30 20 50</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N ≤ 1,000,000</li>
                    <li>1 ≤ A<sub>i</sub> ≤ 1,000,000</li>
                </ul>
            `,
            hints: [
                { title: 'First intuition', content: 'We can solve it with <strong>DP</strong>! Define dp[i] = "LIS length ending at the i-th element".<br>For each element, check all previous elements: if <code>A[j] &lt; A[i]</code>, update <code>dp[i] = max(dp[i], dp[j] + 1)</code>.' },
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>1,000,000</strong> (1M)! The double loop in DP is O(N squared) = <strong>1 trillion</strong> operations...<br>This would not finish even in minutes. We need a faster approach!' },
                { title: 'What if we try this?', content: 'Maintain an array called <code>tails</code>. tails[i] = "the <strong>smallest</strong> ending value of an increasing subsequence of length i+1".<br>When processing a new element x:<br>- If x is greater than the end of tails? The LIS grows, so <strong>append</strong> it!<br>- Otherwise? Use <strong>binary search</strong> to find where x belongs in tails and <strong>replace</strong> that value.<br>Replacing does not change the LIS immediately, but increases the chance of building a longer LIS later!<br>Since tails is always sorted, binary search works, and the total time is <strong>O(N log N)</strong>.' },
                { title: 'In Python/C++!', content: '<span class="lang-py">Python: <code>bisect_left(tails, x)</code> finds the replacement position in O(log N). If pos == len(tails), <code>append</code>. Otherwise, <code>tails[pos] = x</code> to replace!</span><span class="lang-cpp">C++: <code>lower_bound(tails.begin(), tails.end(), x)</code> serves the same role as bisect_left. If at the end, <code>push_back</code>. Otherwise, <code>*it = x</code> to replace!</span>' }
            ],
            templates: {
                python: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))\n\ntails = []\n\nfor x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)\n    else:\n        tails[pos] = x\n\nprint(len(tails))',
                cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false); cin.tie(nullptr);\n    int N; cin >> N;\n    vector<int> tails;\n    for (int i = 0; i < N; i++) {\n        int x; cin >> x;\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    cout << tails.size() << endl;\n    return 0;\n}'
            },
            solutions: [{
                approach: 'tails array + bisect_left',
                description: 'Maintain the tails array and use binary search to find LIS length in O(N log N).',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'N can be up to 1M, so O(N^2) DP will TLE.\nWe use the binary search-based O(N log N) algorithm.', code: 'import sys\nfrom bisect import bisect_left\ninput = sys.stdin.readline\n\nN = int(input())\nA = list(map(int, input().split()))' },
                        { title: 'Initialize tails array', desc: 'tails[i] = "smallest ending value of an increasing subsequence of length i+1".\nKeep tails always sorted so binary search can be applied.', code: 'tails = []' },
                        { title: 'Build LIS', desc: 'If new element x is greater than the end of tails, LIS length increases (append).\nOtherwise, use bisect_left to find the replacement position and substitute with a smaller value.\nReplacing increases the chance of building a longer LIS later.', code: 'for x in A:\n    pos = bisect_left(tails, x)\n    if pos == len(tails):\n        tails.append(x)    # LIS length increases\n    else:\n        tails[pos] = x     # Replace with smaller value' },
                        { title: 'Output', desc: 'The length of the tails array is the LIS length.\n(The actual contents of tails may not be the LIS itself, but the length is correct.)', code: 'print(len(tails))' }
                    ],
                    cpp: [
                        { title: 'Input', desc: 'N can be up to 1M, so O(N^2) DP will TLE.\nWe use the binary search-based O(N log N) algorithm.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];' },
                        { title: 'Initialize tails array', desc: 'tails[i] = "smallest ending value of an increasing subsequence of length i+1".\nDeclared as a vector so it can grow dynamically.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;  // tails[i] = smallest ending value of LIS with length i+1' },
                        { title: 'Build LIS', desc: 'Use lower_bound (equivalent to bisect_left in Python) to find where x belongs.\nIf past the end, push_back (extend LIS). Otherwise, replace the value at that position.\nReplacing increases the chance of building a longer LIS later.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;\n\n    for (int x : A) {\n        // lower_bound: first position >= x (= bisect_left in Python)\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end())\n            tails.push_back(x);   // LIS length increases\n        else\n            *it = x;              // Replace with smaller value\n    }' },
                        { title: 'Output', desc: 'The size of the tails array is the LIS length.\nThe actual contents of tails may not be the LIS itself, but the length is correct.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int N;\n    cin >> N;\n    vector<int> A(N);\n    for (int i = 0; i < N; i++) cin >> A[i];\n\n    vector<int> tails;\n\n    for (int x : A) {\n        auto it = lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end())\n            tails.push_back(x);\n        else\n            *it = x;\n    }\n\n    cout << tails.size() << endl;\n}' }
                    ]
                },
                get templates() { return binarySearchTopic.problems[6].templates; }
            }]
        }
    ],

    // ===== Legacy Stub =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        var backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← Back to Problems';
        backBtn.addEventListener('click', function() { binarySearchTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.binarysearch = binarySearchTopic;
