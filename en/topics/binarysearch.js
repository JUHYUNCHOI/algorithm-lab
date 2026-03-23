// ===== Binary Search Topic Module =====
const binarySearchTopic = {
    id: 'binarysearch',
    title: 'Binary Search',
    icon: '🔍',
    category: 'Search (Silver)',
    order: 8,
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
                <h2>🔍 Binary Search</h2>
                <p class="hero-sub">By discarding half each time, you can find anything quickly — no matter how large the data</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is Binary Search?</div>
                <div class="analogy-box">
                    Imagine you need to find the word "mango" in a thick dictionary. Would you start at page 1 and flip through every single page? That could take thousands of flips!<br><br>
                    Instead, you'd open the dictionary right in the middle. You land near "L." Since "M" comes after "L," you know mango must be in the second half -- so you toss the first half and never look at it again.<br>
                    Now open the middle of what's left, toss another half, and repeat. In just 20 flips, you could find any word in a million-page dictionary!<br><br>
                    That's <strong>binary search</strong>: throw away half the remaining options at every step. It's incredibly fast.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try It — Find a Value with Binary Search</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        Follow each step of binary search on a sorted array to find the target.<br>
                        Watch how <strong>half the elements are eliminated</strong> at every step!
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">Array:
                            <input type="text" id="bs-demo-intro-arr" value="2, 5, 8, 12, 16, 23, 38, 56, 72, 91" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:260px;">
                        </label>
                        <label style="font-weight:600;font-size:0.9rem;">target:
                            <input type="number" id="bs-demo-intro-target" value="23" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;">
                        </label>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-intro-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-intro-reset">Start Over ↺</button>
                    </div>
                    <div id="bs-demo-intro-arr-viz" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>
                    <div id="bs-demo-intro-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-intro-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-intro-msg">👆 Press Step to see how binary search halves the search range at each step!</div>
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
                <div class="analogy-box">
                    Binary search is like a guessing game. Your friend picks a number between 1 and 100, and after each guess they say "higher" or "lower." What's the smartest strategy? Always guess the middle! That way you cut the possibilities in half every time. Here are the three rules you need:
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <h3>① Numbers must be sorted!</h3>
                        <p>This trick only works when the data is in order. Otherwise, "higher" and "lower" don't help you toss out half.</p>
                    </div>
                    <div class="concept-card">
                        <h3>② Always check the middle</h3>
                        <p>Pick the middle spot: <strong>mid = (lo + hi) / 2</strong>. Is it the answer? If not, you know which half to keep.</p>
                    </div>
                    <div class="concept-card">
                        <h3>③ Shrink the range</h3>
                        <p>Target bigger than mid? Move <strong>lo</strong> up. Smaller? Move <strong>hi</strong> down. Half the range vanishes every step.</p>
                    </div>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Search Failure Experience — What happens when the value isn't there?</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        What happens when you search for a value that <strong>doesn't exist</strong> in the array? As lo and hi narrow down, eventually <strong>lo &gt; hi</strong>, and we determine "not found!"
                        Try changing the target to see the failure process yourself.
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">Sorted array: <span style="color:var(--accent);font-weight:700;">[1, 3, 5, 7, 9, 11, 13]</span></label>
                        <label style="font-weight:600;font-size:0.9rem;">target:
                            <input type="number" id="bs-demo-fail-target" value="6" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;">
                        </label>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-fail-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-fail-reset">Start Over ↺</button>
                    </div>
                    <div id="bs-demo-fail-arr" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>
                    <div id="bs-demo-fail-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-fail-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-fail-msg">👆 Enter a value not in the array (e.g., 6, 4, 0) as the target and search!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Time Complexity: How Fast is O(log N) — halving each time?</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Size Comparison — Change N and feel the difference</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        As data grows, the gap between linear search and binary search <strong>explodes</strong>.
                        Move the slider to see how the number of comparisons changes as N increases.
                    </p>
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">Data size N:</label>
                        <input type="range" id="bs-demo-speed-slider" min="1" max="30" value="10" style="flex:1;min-width:150px;">
                        <span id="bs-demo-speed-n" style="font-weight:700;color:var(--accent);font-size:1rem;min-width:100px;">1,024</span>
                    </div>
                    <div style="display:flex;gap:20px;align-items:flex-end;margin-bottom:12px;min-height:180px;" id="bs-demo-speed-chart">
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                            <div id="bs-demo-speed-linear-count" style="font-weight:700;font-size:0.85rem;color:var(--red);"></div>
                            <div style="width:100%;background:var(--bg2);border-radius:8px;position:relative;height:160px;overflow:hidden;">
                                <div id="bs-demo-speed-linear-bar" style="position:absolute;bottom:0;width:100%;background:var(--red);border-radius:8px;transition:height 0.4s;"></div>
                            </div>
                            <div style="font-size:0.8rem;font-weight:600;color:var(--text2);">Linear Search<br>O(N)</div>
                        </div>
                        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
                            <div id="bs-demo-speed-binary-count" style="font-weight:700;font-size:0.85rem;color:var(--green);"></div>
                            <div style="width:100%;background:var(--bg2);border-radius:8px;position:relative;height:160px;overflow:hidden;">
                                <div id="bs-demo-speed-binary-bar" style="position:absolute;bottom:0;width:100%;background:var(--green);border-radius:8px;transition:height 0.4s;"></div>
                            </div>
                            <div style="font-size:0.8rem;font-weight:600;color:var(--text2);">Binary Search<br>O(log N)</div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="bs-demo-speed-msg">Move the slider to change N!</div>
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
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 Try it yourself — Finding the boundary where conditions change</div>
                    <p style="color:var(--text2);font-size:0.9rem;margin-bottom:12px;">
                        Can you fit items into a backpack? As weight increases, at some point it becomes "impossible (NO)".<br>
                        <strong>Finding the boundary where NO→YES or YES→NO changes</strong> using binary search is parametric search.
                        Follow along step by step below to see how binary search finds the boundary.
                    </p>
                    <div style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap;">
                        <label style="font-weight:600;font-size:0.9rem;">Backpack capacity:
                            <input type="number" id="bs-demo-param-capacity" value="15" min="1" max="50" style="padding:5px 10px;border:1px solid var(--border);border-radius:8px;font-size:0.95rem;width:70px;"> kg
                        </label>
                        <span style="font-size:0.85rem;color:var(--text3);">Item weights: [2, 4, 5, 7, 8, 10, 12, 15, 18, 20] kg</span>
                    </div>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="bs-demo-param-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="bs-demo-param-reset">Start Over ↺</button>
                    </div>
                    <div style="margin-bottom:6px;font-size:0.85rem;color:var(--text2);" id="bs-demo-param-question"></div>
                    <div id="bs-demo-param-arr" style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:10px;"></div>
                    <div id="bs-demo-param-pointers" style="font-size:0.85rem;color:var(--text2);margin-bottom:6px;min-height:22px;"></div>
                    <div id="bs-demo-param-log" style="padding:12px;background:var(--bg);border-radius:8px;font-size:0.88rem;line-height:1.7;min-height:40px;max-height:220px;overflow-y:auto;"></div>
                    <div class="concept-demo-msg" id="bs-demo-param-msg">👆 Set the backpack capacity and click "Find Boundary"!</div>
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

        // ── Demo 0: Basic Binary Search Experience (Section 1) ──
        (function() {
            var introArrInput = container.querySelector('#bs-demo-intro-arr');
            var introTargetInput = container.querySelector('#bs-demo-intro-target');
            var introStepBtn = container.querySelector('#bs-demo-intro-step');
            var introResetBtn = container.querySelector('#bs-demo-intro-reset');
            var introArrViz = container.querySelector('#bs-demo-intro-arr-viz');
            var introPointers = container.querySelector('#bs-demo-intro-pointers');
            var introLog = container.querySelector('#bs-demo-intro-log');
            var introMsg = container.querySelector('#bs-demo-intro-msg');
            if (!introStepBtn) return;

            var introState = { arr: [], steps: [], stepIdx: -1, logLines: [], target: 23 };

            function parseArr(str) {
                return str.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            }

            function introCell(v, i, style) {
                return '<div style="width:44px;text-align:center;padding:7px 3px;border-radius:8px;font-weight:600;font-size:0.88rem;transition:all 0.3s;' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderIntroArr(arr, lo, hi, mid, foundIdx) {
                introArrViz.innerHTML = arr.map(function(v, i) {
                    if (foundIdx === i) return introCell(v, i, 'background:var(--green);color:white;box-shadow:0 0 10px var(--green);');
                    if (i === mid) return introCell(v, i, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (i >= lo && i <= hi) return introCell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return introCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.5;');
                }).join('');
            }

            function buildIntroSteps() {
                var arr = parseArr(introArrInput.value);
                if (arr.length < 2) { introMsg.textContent = 'Please enter at least 2 numbers in the array!'; return; }
                arr.sort(function(a, b) { return a - b; });
                var target = parseInt(introTargetInput.value);
                if (isNaN(target)) { introMsg.textContent = 'Please enter a number for target!'; return; }

                introState.arr = arr;
                introState.target = target;
                introState.steps = [];
                introState.stepIdx = -1;
                introState.logLines = [];

                var lo = 0, hi = arr.length - 1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (arr[mid] === target) {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: true, round: round });
                        break;
                    } else if (arr[mid] < target) {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, dir: 'right', newLo: mid + 1, newHi: hi, eliminated: mid - lo + 1 });
                        lo = mid + 1;
                    } else {
                        introState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, dir: 'left', newLo: lo, newHi: mid - 1, eliminated: hi - mid + 1 });
                        hi = mid - 1;
                    }
                }
                if (!introState.steps.length || !introState.steps[introState.steps.length - 1].found) {
                    introState.steps.push({ failed: true, round: round + 1 });
                }

                renderIntroArr(arr, 0, arr.length - 1, -1, -1);
                introPointers.innerHTML = 'lo=0, hi=' + (arr.length - 1) + ' — Starting with the full range';
                introLog.innerHTML = '';
                introMsg.textContent = 'Press Step to search for target=' + target + '! (' + introState.steps.length + ' steps)';
            }

            function introStep() {
                if (introState.steps.length === 0 || introState.stepIdx >= introState.steps.length - 1) {
                    buildIntroSteps();
                    return;
                }
                introState.stepIdx++;
                var s = introState.steps[introState.stepIdx];
                var arr = introState.arr;
                var target = introState.target;

                if (s.failed) {
                    renderIntroArr(arr, 0, 0, -1, -1);
                    introPointers.innerHTML = '<strong style="color:var(--red);">lo > hi — Search range exhausted!</strong>';
                    introState.logLines.push('<span style="color:var(--red);font-weight:700;">Result: ' + target + ' is not in the array!</span>');
                    introMsg.innerHTML = '<strong style="color:var(--red);">Binary search complete — value not found.</strong>';
                } else if (s.found) {
                    renderIntroArr(arr, s.lo, s.hi, -1, s.mid);
                    introPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    introState.logLines.push('<span style="color:var(--green);font-weight:700;">Round ' + s.round + ': arr[' + s.mid + ']=' + arr[s.mid] + ' == ' + target + ' — Found it! 🎉</span>');
                    introMsg.innerHTML = '<strong style="color:var(--green);">Found in just ' + s.round + ' step(s)!</strong> Out of ' + arr.length + ' elements, halving narrowed it down quickly.';
                } else {
                    renderIntroArr(arr, s.lo, s.hi, s.mid, -1);
                    introPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    var dirText = s.dir === 'right'
                        ? arr[s.mid] + ' < ' + target + ' — Discard left half (' + s.eliminated + ' elements)!'
                        : arr[s.mid] + ' > ' + target + ' — Discard right half (' + s.eliminated + ' elements)!';
                    introState.logLines.push('Round ' + s.round + ': arr[' + s.mid + ']=' + dirText + ' → range [' + s.newLo + '~' + s.newHi + ']');
                    var remaining = s.newHi - s.newLo + 1;
                    introMsg.textContent = s.eliminated + ' eliminated at once! Remaining range: ' + remaining + ' elements. Press Step to continue.';
                }
                introLog.innerHTML = introState.logLines.join('<br>');
                introLog.scrollTop = introLog.scrollHeight;
            }

            function introReset() {
                var arr = parseArr(introArrInput.value);
                if (arr.length < 2) arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
                arr.sort(function(a, b) { return a - b; });
                introState = { arr: arr, steps: [], stepIdx: -1, logLines: [], target: parseInt(introTargetInput.value) || 23 };
                renderIntroArr(arr, 0, arr.length - 1, -1, -1);
                introPointers.innerHTML = '';
                introLog.innerHTML = '';
                introMsg.textContent = 'Press Step to see how binary search halves the search range at each step!';
            }

            var defaultArr = parseArr(introArrInput.value);
            defaultArr.sort(function(a, b) { return a - b; });
            introState.arr = defaultArr;
            renderIntroArr(defaultArr, 0, defaultArr.length - 1, -1, -1);
            introStepBtn.addEventListener('click', introStep);
            introResetBtn.addEventListener('click', introReset);
        })();

        // ── Demo 1: Search Failure Experience ──
        (function() {
            var FAIL_ARR = [1, 3, 5, 7, 9, 11, 13];
            var failTargetInput = container.querySelector('#bs-demo-fail-target');
            var failStepBtn = container.querySelector('#bs-demo-fail-step');
            var failResetBtn = container.querySelector('#bs-demo-fail-reset');
            var failArrEl = container.querySelector('#bs-demo-fail-arr');
            var failPointers = container.querySelector('#bs-demo-fail-pointers');
            var failLog = container.querySelector('#bs-demo-fail-log');
            var failMsg = container.querySelector('#bs-demo-fail-msg');
            if (!failStepBtn) return;

            var failState = { steps: [], stepIdx: -1, logLines: [], target: 6 };

            function failCell(v, i, style) {
                return '<div style="width:44px;text-align:center;padding:7px 3px;border-radius:8px;font-weight:600;font-size:0.88rem;transition:all 0.3s;' + style + '"><div>' + v + '</div><div style="font-size:0.65rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderFailArr(lo, hi, mid, dimAll) {
                failArrEl.innerHTML = FAIL_ARR.map(function(v, i) {
                    if (dimAll) return failCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.7;');
                    if (i === mid) return failCell(v, i, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (i >= lo && i <= hi) return failCell(v, i, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return failCell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;');
                }).join('');
            }

            function buildFailSteps() {
                var target = parseInt(failTargetInput.value);
                if (isNaN(target)) { failMsg.textContent = 'Please enter a number for target!'; return; }
                failState.target = target;
                failState.steps = [];
                failState.stepIdx = -1;
                failState.logLines = [];

                var found = FAIL_ARR.indexOf(target) !== -1;
                var lo = 0, hi = FAIL_ARR.length - 1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (FAIL_ARR[mid] === target) {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: true, round: round });
                        break;
                    } else if (FAIL_ARR[mid] < target) {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, newLo: mid + 1, newHi: hi });
                        lo = mid + 1;
                    } else {
                        failState.steps.push({ lo: lo, hi: hi, mid: mid, found: false, round: round, newLo: lo, newHi: mid - 1 });
                        hi = mid - 1;
                    }
                }
                if (!found) {
                    failState.steps.push({ failed: true, round: round + 1 });
                }
                // Initial state render
                renderFailArr(0, FAIL_ARR.length - 1, -1, false);
                failPointers.innerHTML = '';
                failLog.innerHTML = '';
                failMsg.textContent = 'Click Step to advance target=' + target + ' search one step at a time. (' + failState.steps.length + ' steps)';
            }

            function failStep() {
                // Build steps on first click
                if (failState.steps.length === 0 || failState.stepIdx >= failState.steps.length - 1) {
                    buildFailSteps();
                    return;
                }
                failState.stepIdx++;
                var s = failState.steps[failState.stepIdx];
                var target = failState.target;
                if (s.failed) {
                    failPointers.innerHTML = '<strong style="color:var(--red);">lo > hi \u2192 Search range is gone!</strong>';
                    renderFailArr(0, 0, -1, true);
                    failState.logLines.push('<span style="color:var(--red);font-weight:700;">Result: ' + target + ' is not in the array! \u2192 return -1</span>');
                    failMsg.innerHTML = '<strong style="color:var(--red);">When lo > hi, we determine "not found".</strong> This is why binary search returns -1.';
                } else if (s.found) {
                    renderFailArr(s.lo, s.hi, s.mid, false);
                    failPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    failState.logLines.push('<span style="color:var(--green);font-weight:700;">Round ' + s.round + ': arr[' + s.mid + ']=' + FAIL_ARR[s.mid] + ' == ' + target + ' \u2192 Found!</span>');
                    failMsg.innerHTML = '<strong style="color:var(--green);">Found it!</strong> The value exists in the array. Try entering a value that\'s not in the array!';
                } else {
                    renderFailArr(s.lo, s.hi, s.mid, false);
                    failPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    var cmp = FAIL_ARR[s.mid] < target ? (FAIL_ARR[s.mid] + ' < ' + target + ' \u2192 go right!') : (FAIL_ARR[s.mid] + ' > ' + target + ' \u2192 go left!');
                    failState.logLines.push('Round ' + s.round + ': arr[' + s.mid + ']=' + cmp + ' (lo=' + s.newLo + ', hi=' + s.newHi + ')');
                    if (s.newLo > s.newHi) {
                        failMsg.innerHTML = 'lo=' + s.newLo + ' > hi=' + s.newHi + ' \u2192 <strong>Range is about to disappear!</strong>';
                    } else {
                        failMsg.textContent = 'Range narrowed to [' + s.newLo + '~' + s.newHi + ']. Click Step to continue.';
                    }
                }
                failLog.innerHTML = failState.logLines.join('<br>');
                failLog.scrollTop = failLog.scrollHeight;
            }

            function failReset() {
                failState = { steps: [], stepIdx: -1, logLines: [], target: parseInt(failTargetInput.value) || 6 };
                renderFailArr(0, FAIL_ARR.length - 1, -1, false);
                failPointers.innerHTML = '';
                failLog.innerHTML = '';
                failMsg.textContent = 'Enter a value not in the array (e.g., 6, 4, 0) as target and click Step!';
            }

            renderFailArr(0, FAIL_ARR.length - 1, -1, false);
            failStepBtn.addEventListener('click', failStep);
            failResetBtn.addEventListener('click', failReset);
        })();

        // ── Demo 2: Speed Comparison (slider) ──
        (function() {
            var slider = container.querySelector('#bs-demo-speed-slider');
            var nLabel = container.querySelector('#bs-demo-speed-n');
            var linearBar = container.querySelector('#bs-demo-speed-linear-bar');
            var binaryBar = container.querySelector('#bs-demo-speed-binary-bar');
            var linearCount = container.querySelector('#bs-demo-speed-linear-count');
            var binaryCount = container.querySelector('#bs-demo-speed-binary-count');
            var speedMsg = container.querySelector('#bs-demo-speed-msg');
            if (!slider) return;

            function formatNum(n) {
                if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
                if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
                if (n >= 1e3) return n.toLocaleString();
                return '' + n;
            }

            function updateSpeedChart() {
                var exp = parseInt(slider.value);
                var N = Math.pow(2, exp);
                var logN = exp;
                nLabel.textContent = formatNum(N) + ' (2^' + exp + ')';

                linearBar.style.height = '100%';
                var binaryPct = Math.max((logN / N) * 100, 0.5);
                binaryBar.style.height = binaryPct + '%';

                linearCount.textContent = formatNum(N) + ' times';
                binaryCount.textContent = logN + ' times';

                var ratio = Math.floor(N / logN);
                if (exp <= 3) {
                    speedMsg.textContent = 'At N=' + N + ', the difference is small. Move the slider further right!';
                } else if (exp <= 15) {
                    speedMsg.innerHTML = 'Linear search: <strong>' + formatNum(N) + ' times</strong>, Binary search: <strong>' + logN + ' times</strong>. About <strong>' + formatNum(ratio) + 'x</strong> difference!';
                } else {
                    speedMsg.innerHTML = '<strong style="color:var(--red);">' + formatNum(N) + ' times</strong> vs <strong style="color:var(--green);">' + logN + ' times</strong> \u2014 a whopping <strong>' + formatNum(ratio) + 'x</strong> difference! This is the power of O(log N).';
                }
            }

            slider.addEventListener('input', updateSpeedChart);
            updateSpeedChart();
        })();

        // ── Demo 3: Parametric Search (boundary finding) ──
        (function() {
            var WEIGHTS = [2, 4, 5, 7, 8, 10, 12, 15, 18, 20];
            var capacityInput = container.querySelector('#bs-demo-param-capacity');
            var paramStepBtn = container.querySelector('#bs-demo-param-step');
            var paramResetBtn = container.querySelector('#bs-demo-param-reset');
            var paramArrEl = container.querySelector('#bs-demo-param-arr');
            var paramPointers = container.querySelector('#bs-demo-param-pointers');
            var paramLog = container.querySelector('#bs-demo-param-log');
            var paramMsg = container.querySelector('#bs-demo-param-msg');
            var paramQuestion = container.querySelector('#bs-demo-param-question');
            if (!paramStepBtn) return;

            var paramState = { steps: [], stepIdx: -1, logLines: [], capacity: 15 };

            function paramCell(v, i, canCarry, style) {
                var label = canCarry ? '<span style="color:var(--green);font-weight:700;">YES</span>' : '<span style="color:var(--red);font-weight:700;">NO</span>';
                return '<div style="width:52px;text-align:center;padding:6px 3px;border-radius:8px;font-size:0.82rem;transition:all 0.3s;' + style + '"><div style="font-weight:600;">' + v + 'kg</div><div>' + label + '</div><div style="font-size:0.6rem;color:var(--text3);">[' + i + ']</div></div>';
            }

            function renderParamArr(capacity, lo, hi, mid, boundaryIdx) {
                paramArrEl.innerHTML = WEIGHTS.map(function(w, i) {
                    var canCarry = w <= capacity;
                    if (boundaryIdx !== -1 && i === boundaryIdx) return paramCell(w, i, canCarry, 'background:var(--green);color:white;box-shadow:0 0 10px var(--green);');
                    if (i === mid) return paramCell(w, i, canCarry, 'background:var(--yellow);color:#333;box-shadow:0 0 8px var(--yellow);');
                    if (lo !== -1 && i >= lo && i <= hi) return paramCell(w, i, canCarry, 'background:var(--accent)15;border:2px solid var(--accent);');
                    return paramCell(w, i, canCarry, 'background:var(--bg2);');
                }).join('');
            }

            function showInitialArr(capacity) {
                paramArrEl.innerHTML = WEIGHTS.map(function(w, i) {
                    var canCarry = w <= capacity;
                    var bg = canCarry ? 'background:var(--green)18;border:1.5px solid var(--green);' : 'background:var(--red)18;border:1.5px solid var(--red);';
                    return paramCell(w, i, canCarry, bg);
                }).join('');
            }

            function buildParamSteps() {
                var capacity = parseInt(capacityInput.value);
                if (isNaN(capacity) || capacity < 1) { paramMsg.textContent = 'Please enter a positive number for backpack capacity!'; return; }
                paramState.capacity = capacity;
                paramState.steps = [];
                paramState.stepIdx = -1;
                paramState.logLines = [];
                paramQuestion.innerHTML = '<strong>"Can we fit item weighing X kg into the backpack (capacity ' + capacity + 'kg)?"</strong> \u2192 Find the <strong>heaviest X</strong> where the answer is YES.';

                var lo = 0, hi = WEIGHTS.length - 1;
                var answer = -1;
                var round = 0;
                while (lo <= hi) {
                    var mid = Math.floor((lo + hi) / 2);
                    round++;
                    if (WEIGHTS[mid] <= capacity) {
                        answer = mid;
                        paramState.steps.push({ lo: lo, hi: hi, mid: mid, canCarry: true, round: round, newLo: mid + 1, newHi: hi });
                        lo = mid + 1;
                    } else {
                        paramState.steps.push({ lo: lo, hi: hi, mid: mid, canCarry: false, round: round, newLo: lo, newHi: mid - 1 });
                        hi = mid - 1;
                    }
                }
                paramState.steps.push({ done: true, answer: answer });
                showInitialArr(capacity);
                paramPointers.innerHTML = '';
                paramLog.innerHTML = '';
                paramMsg.textContent = 'Click Step to advance boundary search one step at a time. (' + paramState.steps.length + ' steps)';
            }

            function paramStep() {
                if (paramState.steps.length === 0 || paramState.stepIdx >= paramState.steps.length - 1) {
                    buildParamSteps();
                    return;
                }
                paramState.stepIdx++;
                var s = paramState.steps[paramState.stepIdx];
                var capacity = paramState.capacity;
                if (s.done) {
                    if (s.answer === -1) {
                        renderParamArr(capacity, -1, -1, -1, -1);
                        paramState.logLines.push('<span style="color:var(--red);font-weight:700;">No item can fit!</span>');
                        paramMsg.innerHTML = '<strong style="color:var(--red);">Backpack capacity is too small to fit anything.</strong>';
                    } else {
                        renderParamArr(capacity, -1, -1, -1, s.answer);
                        paramState.logLines.push('<span style="color:var(--green);font-weight:700;">Boundary found! Heaviest item that fits: ' + WEIGHTS[s.answer] + 'kg (index ' + s.answer + ')</span>');
                        paramMsg.innerHTML = '<strong style="color:var(--green);">Found the YES\u2192NO boundary!</strong> ' + WEIGHTS[s.answer] + 'kg fits, ' + (s.answer + 1 < WEIGHTS.length ? WEIGHTS[s.answer + 1] + 'kg doesn\'t' : 'all items fit') + '. This is parametric search!';
                    }
                    paramPointers.innerHTML = '';
                } else {
                    renderParamArr(capacity, s.lo, s.hi, s.mid, -1);
                    paramPointers.innerHTML = 'lo=' + s.lo + ', hi=' + s.hi + ', <strong>mid=' + s.mid + '</strong>';
                    if (s.canCarry) {
                        paramState.logLines.push('Round ' + s.round + ': ' + WEIGHTS[s.mid] + 'kg <= ' + capacity + 'kg \u2192 <span style="color:var(--green);font-weight:600;">YES!</span> Search heavier side (lo=' + s.newLo + ')');
                        paramMsg.textContent = WEIGHTS[s.mid] + 'kg fits! Can something heavier fit too? Click Step to continue.';
                    } else {
                        paramState.logLines.push('Round ' + s.round + ': ' + WEIGHTS[s.mid] + 'kg > ' + capacity + 'kg \u2192 <span style="color:var(--red);font-weight:600;">NO!</span> Search lighter side (hi=' + s.newHi + ')');
                        paramMsg.textContent = WEIGHTS[s.mid] + 'kg doesn\'t fit! Click Step to move to lighter items.';
                    }
                }
                paramLog.innerHTML = paramState.logLines.join('<br>');
                paramLog.scrollTop = paramLog.scrollHeight;
            }

            function paramReset() {
                paramState = { steps: [], stepIdx: -1, logLines: [], capacity: parseInt(capacityInput.value) || 15 };
                showInitialArr(paramState.capacity);
                paramPointers.innerHTML = '';
                paramLog.innerHTML = '';
                paramQuestion.innerHTML = '<strong>"Can we fit item weighing X kg into the backpack (capacity ' + paramState.capacity + 'kg)?"</strong> \u2192 Find the <strong>heaviest X</strong> where the answer is YES.';
                paramMsg.textContent = 'Set the backpack capacity and click Step!';
            }

            showInitialArr(15);
            paramQuestion.innerHTML = '<strong>"Can we fit item weighing X kg into the backpack (capacity 15kg)?"</strong> \u2192 Find the <strong>heaviest X</strong> where the answer is YES.';
            paramStepBtn.addEventListener('click', paramStep);
            paramResetBtn.addEventListener('click', paramReset);
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25b6 Click Next to start</div>';
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
        var prevBtn = container.querySelector('#viz-prev' + suffix);
        var nextBtn = container.querySelector('#viz-next' + suffix);
        var counter = container.querySelector('#viz-step-counter' + suffix);
        var desc = container.querySelector('#viz-step-desc' + suffix);
        if (!prevBtn || !nextBtn) return;
        function updateUI() {
            var idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = 'Before start'; desc.innerHTML = '▶ Click Next to start'; }
            else { counter.textContent = (idx + 1) + ' / ' + total; desc.innerHTML = '<span>' + state.steps[idx].description + '</span>'; }
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
            self._createStepDesc(suffix) +
            '<div id="bs-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bs-arr' + suffix + '" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bs-arr' + suffix);
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
                    return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;');
                }).join('');
            }
            renderArr(0, arr.length - 1, -1, -1);
            var steps = [];
            var lo = 0, hi = arr.length - 1, round = 0, found = false;
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                round++;
                if (arr[mid] === target) {
                    (function(cLo, cHi, mid, round, a, t) {
                        steps.push({ description: round + 'Round: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' == ' + t + ' → <strong style="color:var(--green);">Found it!</strong> ✅',
                            action: function() { renderArr(cLo, cHi, -1, mid); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, round, arr, target);
                    found = true;
                    break;
                } else if (arr[mid] < target) {
                    (function(cLo, cHi, mid, newLo, round, a, t) {
                        steps.push({ description: round + 'Round: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &lt; ' + t + ' → <strong>Discard left half!</strong> (lo=' + newLo + ')',
                            action: function() { renderArr(newLo, cHi, mid, -1); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, mid + 1, round, arr, target);
                    lo = mid + 1;
                } else {
                    (function(cLo, cHi, mid, newHi, round, a, t) {
                        steps.push({ description: round + 'Round: lo=' + cLo + ', hi=' + cHi + ', mid=' + mid + ' → arr[' + mid + ']=' + a[mid] + ' &gt; ' + t + ' → <strong>Discard right half!</strong> (hi=' + newHi + ')',
                            action: function() { renderArr(cLo, newHi, mid, -1); },
                            undo: function() { renderArr(cLo, cHi, -1, -1); }
                        });
                    })(cLo, cHi, mid, mid - 1, round, arr, target);
                    hi = mid - 1;
                }
            }
            if (!found) {
                (function(t) {
                    steps.push({ description: 'Search complete: lo &gt; hi → <strong style="color:var(--red);">' + t + ' is not in the array.</strong> ❌',
                        action: function() { arrEl.innerHTML = arr.map(function(v, i) { return cell(v, i, 'background:var(--bg2);color:var(--text3);opacity:0.75;'); }).join(''); },
                        undo: function() { renderArr(0, arr.length - 1, -1, -1); }
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
            self._createStepDesc(suffix) +
            '<div id="bd-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="bd-arr' + suffix + '" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#bd-arr' + suffix);
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
            // compute bisect_left
            var leftIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] < target) blo = bm + 1; else bhi = bm; } leftIdx = blo; }
            // compute bisect_right
            var rightIdx = 0;
            { var blo = 0, bhi = arr.length; while (blo < bhi) { var bm = Math.floor((blo + bhi) / 2); if (arr[bm] <= target) blo = bm + 1; else bhi = bm; } rightIdx = blo; }
            var count = rightIdx - leftIdx;
            var steps = [
                { description: 'bisect_left(' + target + '): first position >= ' + target + ' → bisect_left = <strong>' + leftIdx + '</strong>' + (leftIdx < arr.length ? ' (arr[' + leftIdx + ']=' + arr[leftIdx] + ')' : ' (end of array)'),
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); },
                  undo: function() { renderArr(null); }
                },
                { description: 'bisect_right(' + target + '): first position > ' + target + ' → bisect_right = <strong>' + rightIdx + '</strong>' + (rightIdx >= arr.length ? ' (past end of array)' : '') + '. Range: [' + leftIdx + ', ' + rightIdx + ')',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } renderArr(h); },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (arr[i] >= target) h[i] = 'background:var(--accent)20;border:2px solid var(--accent);'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } if (leftIdx < arr.length) h[leftIdx] = 'background:var(--accent);color:white;'; renderArr(h); }
                },
                { description: '<strong style="color:var(--green);">✅ ' + target + ' count = ' + rightIdx + ' - ' + leftIdx + ' = ' + count + '</strong>',
                  action: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;box-shadow:0 0 8px var(--green)40;'; else h[i] = 'background:var(--bg2);opacity:0.7;'; } renderArr(h); },
                  undo: function() { var h = {}; for (var i = 0; i < arr.length; i++) { if (i >= leftIdx && i < rightIdx) h[i] = 'background:var(--green);color:white;'; else h[i] = 'background:var(--bg2);opacity:0.75;'; } renderArr(h); }
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
            self._createStepDesc(suffix) +
            '<div id="cb-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="cb-bars' + suffix + '" style="margin-bottom:12px;"></div>' +
            self._createStepControls(suffix);
        var barsEl = container.querySelector('#cb-bars' + suffix);
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
            var steps = [], lo = 1, hi = maxC, answer = 0, round = 0;
            // Step 0: initial search range explanation
            steps.push({
                description: 'Setting the search range for cut length x. From minimum <strong>1cm</strong> to the longest cable <strong>' + maxC + 'cm</strong> → <strong>lo=1, hi=' + maxC + '</strong>',
                action: function() { renderBars(0); },
                undo: function() { renderBars(0); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var count = cables.reduce(function(s, c) { return s + Math.floor(c / mid); }, 0);
                var piecesDetail = cables.map(function(c) { return c + '÷' + mid + '=' + Math.floor(c / mid); }).join(', ');
                var piecesSum = cables.map(function(c) { return Math.floor(c / mid); }).join('+');
                round++;
                // Step A: mid calculation
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>Round ' + round + '</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. Try cutting at length ' + mid + 'cm.',
                        action: function() { renderBars(0); },
                        undo: function() { renderBars(0); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: cut each cable
                (function(mid, piecesDetail, piecesSum, count) {
                    steps.push({
                        description: 'Cut each cable at ' + mid + 'cm: ' + piecesDetail + ' → Total <strong>' + piecesSum + ' = ' + count + ' pieces</strong>',
                        action: function() { renderBars(mid); },
                        undo: function() { renderBars(0); }
                    });
                })(mid, piecesDetail, piecesSum, count);
                // Step C: decision
                if (count >= N) {
                    answer = mid; lo = mid + 1;
                    (function(mid, count, round, newLo) {
                        steps.push({
                            description: '<strong>' + count + ' pieces</strong> ≥ ' + N + '(needed) → <span style="color:var(--green);">Enough!</span> ' + mid + 'cm is a candidate answer. Could an even longer length work? ' + mid + ' is already checked, so start from the next one → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderBars(mid); },
                            undo: function() { renderBars(mid); }
                        });
                    })(mid, count, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, count, round, newHi) {
                        steps.push({
                            description: '<strong>' + count + ' pieces</strong> &lt; ' + N + '(needed) → <span style="color:var(--red);">Not enough!</span> ' + mid + 'cm is too long to be the answer. Exclude ' + mid + ' and search below → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderBars(mid); },
                            undo: function() { renderBars(mid); }
                        });
                    })(mid, count, round, hi);
                }
            }
            var fa = answer, fc = cables.reduce(function(s, c) { return s + Math.floor(c / fa); }, 0);
            steps.push({ description: 'lo &gt; hi → Search complete! <strong style="color:var(--green);">✅ Answer: x = ' + fa + 'cm (' + fc + ' pieces ≥ ' + N + ')</strong>',
                action: function() { renderBars(fa); },
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
            self._createStepDesc(suffix) +
            '<div id="tr-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="tr-chart' + suffix + '" style="display:flex;gap:16px;justify-content:center;align-items:flex-end;height:160px;margin-bottom:12px;position:relative;"></div>' +
            self._createStepControls(suffix);
        var chartEl = container.querySelector('#tr-chart' + suffix);
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
            var steps = [], lo = 0, hi = maxH, answer = 0, round = 0;
            // Step 0: initial search range explanation
            steps.push({
                description: 'Setting the search range for cutter height H. From <strong>0m</strong> (cut everything) to the tallest tree <strong>' + maxH + 'm</strong> → <strong>lo=0, hi=' + maxH + '</strong>',
                action: function() { renderTrees(-1); },
                undo: function() { renderTrees(-1); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var gained = trees.reduce(function(s, h) { return s + Math.max(0, h - mid); }, 0);
                var gainsDetail = trees.map(function(h) { return h > mid ? h + '-' + mid + '=' + (h - mid) + 'm' : h + '-' + mid + '=0'; }).join(', ');
                var gainsSum = trees.map(function(h) { return Math.max(0, h - mid); }).join('+');
                round++;
                // Step A: mid calculation
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>Round ' + round + '</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. Try cutting at height ' + mid + 'm.',
                        action: function() { renderTrees(-1); },
                        undo: function() { renderTrees(-1); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: cut each tree
                (function(mid, gainsDetail, gainsSum, gained) {
                    steps.push({
                        description: 'Cut each tree at ' + mid + 'm height: ' + gainsDetail + ' → Total <strong>' + gainsSum + ' = ' + gained + 'm</strong>',
                        action: function() { renderTrees(mid); },
                        undo: function() { renderTrees(-1); }
                    });
                })(mid, gainsDetail, gainsSum, gained);
                // Step C: decision
                if (gained >= M) {
                    answer = mid; lo = mid + 1;
                    (function(mid, gained, round, newLo) {
                        steps.push({
                            description: '<strong>' + gained + 'm</strong> ≥ ' + M + '(required) → <span style="color:var(--green);">Enough!</span> ' + mid + 'm is a candidate answer. Could we cut even higher? ' + mid + ' is already checked, so start above it → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderTrees(mid); },
                            undo: function() { renderTrees(mid); }
                        });
                    })(mid, gained, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, gained, round, newHi) {
                        steps.push({
                            description: '<strong>' + gained + 'm</strong> &lt; ' + M + '(required) → <span style="color:var(--red);">Not enough!</span> ' + mid + 'm is too high to be the answer. Exclude ' + mid + ' and search below → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderTrees(mid); },
                            undo: function() { renderTrees(mid); }
                        });
                    })(mid, gained, round, hi);
                }
            }
            var fa = answer, fg = trees.reduce(function(s, h) { return s + Math.max(0, h - fa); }, 0);
            steps.push({ description: 'lo &gt; hi → Search complete! <strong style="color:var(--green);">✅ Answer: H = ' + fa + 'm (cut: ' + fg + 'm ≥ ' + M + ')</strong>',
                action: function() { renderTrees(fa); },
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
            self._createStepDesc(suffix) +
            '<div id="rt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="rt-line' + suffix + '" style="position:relative;height:80px;margin:16px 0;"></div>' +
            self._createStepControls(suffix);
        var lineEl = container.querySelector('#rt-line' + suffix);
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
            function tryPlace(d) {
                var placed = [houses[0]], last = houses[0];
                for (var i = 1; i < houses.length; i++) {
                    if (houses[i] - last >= d) { placed.push(houses[i]); last = houses[i]; }
                }
                return placed;
            }
            var steps = [], lo = 1, hi = maxPos - houses[0], answer = 0, round = 0;
            // Step 0: initial search range explanation
            steps.push({
                description: 'Setting the search range for minimum distance d. From <strong>1</strong> to the difference between the farthest houses <strong>' + maxPos + '−' + houses[0] + ' = ' + (maxPos - houses[0]) + '</strong> → <strong>lo=1, hi=' + (maxPos - houses[0]) + '</strong>',
                action: function() { renderLine(0, []); },
                undo: function() { renderLine(0, []); }
            });
            while (lo <= hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var placed = tryPlace(mid);
                round++;
                // Step A: mid calculation
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>Round ' + round + '</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>. Try installing with min distance ' + mid + '.',
                        action: function() { renderLine(0, []); },
                        undo: function() { renderLine(0, []); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: placement simulation
                (function(mid, placed) {
                    steps.push({
                        description: 'Place with gap ≥ ' + mid + ': [' + placed.join(', ') + '] → Total <strong>' + placed.length + '</strong> installed',
                        action: function() { renderLine(mid, placed); },
                        undo: function() { renderLine(0, []); }
                    });
                })(mid, placed);
                // Step C: decision
                if (placed.length >= C) {
                    answer = mid; lo = mid + 1;
                    (function(mid, placed, round, newLo) {
                        steps.push({
                            description: '<strong>' + placed.length + '</strong> ≥ ' + C + '(needed) → <span style="color:var(--green);">Enough!</span> Distance ' + mid + ' is a candidate answer. Could an even wider gap work? ' + mid + ' is already checked, so start above it → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderLine(mid, placed); },
                            undo: function() { renderLine(mid, placed); }
                        });
                    })(mid, placed, round, lo);
                } else {
                    hi = mid - 1;
                    (function(mid, placed, round, newHi) {
                        steps.push({
                            description: '<strong>' + placed.length + '</strong> &lt; ' + C + '(needed) → <span style="color:var(--red);">Not enough!</span> Distance ' + mid + ' is too large to be the answer. Exclude ' + mid + ' and search below → hi = mid−1 = ' + mid + '−1 = <strong>' + newHi + '</strong>',
                            action: function() { renderLine(mid, placed); },
                            undo: function() { renderLine(mid, placed); }
                        });
                    })(mid, placed, round, hi);
                }
            }
            var fp = tryPlace(answer);
            steps.push({ description: 'lo &gt; hi → Search complete! <strong style="color:var(--green);">✅ Answer: d = ' + answer + ' (placed: [' + fp.join(', ') + '])</strong>',
                action: function() { renderLine(answer, fp); },
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
            self._createStepDesc(suffix) +
            '<div id="kt-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div id="kt-table' + suffix + '" style="margin-bottom:12px;"></div>' +
            self._createStepControls(suffix);
        var tableEl = container.querySelector('#kt-table' + suffix);
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
            var steps = [], lo = 1, hi = k, round = 0;
            // Step 0: initial search range explanation
            steps.push({
                description: 'Setting the search range for answer x. From minimum <strong>1</strong> to at most <strong>' + k + '</strong> (since it\'s the K-th) → <strong>lo=1, hi=' + k + '</strong>',
                action: function() { renderTable(-1); },
                undo: function() { renderTable(-1); }
            });
            while (lo < hi) {
                var cLo = lo, cHi = hi, mid = Math.floor((lo + hi) / 2);
                var cnt = 0;
                var cntDetail = [];
                for (var i = 1; i <= N; i++) {
                    var rowCnt = Math.min(Math.floor(mid / i), N);
                    cntDetail.push('min(⌊' + mid + '÷' + i + '⌋,' + N + ')=' + rowCnt);
                    cnt += rowCnt;
                }
                var cntSum = [];
                for (var i = 1; i <= N; i++) cntSum.push(Math.min(Math.floor(mid / i), N));
                round++;
                // Step A: mid calculation
                (function(cLo, cHi, mid, round) {
                    steps.push({
                        description: '<strong>Round ' + round + '</strong> — lo=' + cLo + ', hi=' + cHi + ' → mid = ⌊(' + cLo + '+' + cHi + ')/2⌋ = <strong>' + mid + '</strong>.',
                        action: function() { renderTable(-1); },
                        undo: function() { renderTable(-1); }
                    });
                })(cLo, cHi, mid, round);
                // Step B: count numbers <= mid
                (function(mid, cntDetail, cntSum, cnt) {
                    steps.push({
                        description: 'Count numbers ≤ ' + mid + ': ' + cntDetail.join(', ') + ' → Total <strong>' + cntSum.join('+') + ' = ' + cnt + '</strong>',
                        action: function() { renderTable(mid); },
                        undo: function() { renderTable(-1); }
                    });
                })(mid, cntDetail, cntSum, cnt);
                // Step C: decision
                if (cnt >= k) {
                    hi = mid;
                    (function(mid, cnt, round) {
                        steps.push({
                            description: '<strong>' + cnt + '</strong> ≥ ' + k + '(K) → <span style="color:var(--green);">Enough!</span> The answer is ≤ ' + mid + '. ' + mid + ' could still be the answer, so include it → hi = mid = <strong>' + mid + '</strong>',
                            action: function() { renderTable(mid); },
                            undo: function() { renderTable(mid); }
                        });
                    })(mid, cnt, round);
                } else {
                    lo = mid + 1;
                    (function(mid, cnt, round, newLo) {
                        steps.push({
                            description: '<strong>' + cnt + '</strong> &lt; ' + k + '(K) → <span style="color:var(--red);">Not enough!</span> The answer is > ' + mid + '. ' + mid + ' can\'t be the answer, so start above it → lo = mid+1 = ' + mid + '+1 = <strong>' + newLo + '</strong>',
                            action: function() { renderTable(mid); },
                            undo: function() { renderTable(mid); }
                        });
                    })(mid, cnt, round, lo);
                }
            }
            steps.push({ description: 'lo ≥ hi → Search complete! <strong style="color:var(--green);">✅ Answer: ' + k + '-th number = ' + lo + '</strong>',
                action: function() { renderTable(lo); },
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
        var BOX_W = 52, BOX_GAP = 6;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">LIS + Binary Search</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Sequence: <input type="text" id="bs-lis-arr" value="' + DEFAULT_A.join(',') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
                '<button class="btn btn-primary" id="bs-lis-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="lis-desc' + suffix + '" style="color:var(--text2);margin-bottom:12px;"></div>' +
            '<div style="position:relative;">' +
                '<div style="margin-bottom:8px;"><strong>Original Sequence</strong></div>' +
                '<div id="lis-arr' + suffix + '" style="display:flex;gap:' + BOX_GAP + 'px;margin-bottom:24px;position:relative;"></div>' +
                '<div style="margin-bottom:8px;"><strong>tails array</strong></div>' +
                '<div id="lis-tails' + suffix + '" style="display:flex;gap:' + BOX_GAP + 'px;margin-bottom:12px;min-height:48px;position:relative;"></div>' +
                '<div id="lis-flying' + suffix + '" style="position:absolute;top:0;left:0;pointer-events:none;z-index:10;"></div>' +
            '</div>' +
            self._createStepControls(suffix);
        var arrEl = container.querySelector('#lis-arr' + suffix);
        var tailsEl = container.querySelector('#lis-tails' + suffix);
        var flyEl = container.querySelector('#lis-flying' + suffix);
        var descEl = container.querySelector('#lis-desc' + suffix);
        var wrapEl = flyEl.parentElement;
        function boxHtml(v, hl, id) {
            return '<div' + (id ? ' id="' + id + '"' : '') + ' style="width:' + BOX_W + 'px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:600;transition:opacity 0.3s,background 0.3s,transform 0.3s;' + (hl || 'background:var(--bg2);') + '">' + v + '</div>';
        }
        function rebuild() {
            var A = container.querySelector('#bs-lis-arr').value.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (A.length === 0) A = DEFAULT_A.slice();
            descEl.innerHTML = 'Sequence: [' + A.join(', ') + ']. Building the tails array with binary search.';
            function renderArr(curIdx) {
                arrEl.innerHTML = A.map(function(v, i) {
                    if (i === curIdx) return boxHtml(v, 'background:var(--accent);color:white;', 'lis-a-' + i);
                    if (curIdx >= 0 && i < curIdx) return boxHtml(v, 'background:var(--bg2);opacity:0.7;', 'lis-a-' + i);
                    return boxHtml(v, 'background:var(--bg2);', 'lis-a-' + i);
                }).join('');
            }
            function renderTails(tails, hlIdx) {
                if (tails.length === 0) { tailsEl.innerHTML = '<div style="color:var(--text3);padding:10px;">Empty</div>'; return; }
                tailsEl.innerHTML = tails.map(function(v, i) {
                    if (i === hlIdx) return boxHtml(v, 'background:var(--green);color:white;', 'lis-t-' + i);
                    return boxHtml(v, 'background:var(--green)20;border:2px solid var(--green);', 'lis-t-' + i);
                }).join('');
            }
            function animateMove(value, srcId, destId, color, onDone) {
                var srcEl = container.querySelector('#' + srcId);
                var wrapRect = wrapEl.getBoundingClientRect();
                if (!srcEl) { if (onDone) onDone(); return; }
                var srcRect = srcEl.getBoundingClientRect();
                var ghost = document.createElement('div');
                ghost.textContent = value;
                ghost.style.cssText = 'position:absolute;width:' + BOX_W + 'px;text-align:center;padding:10px 4px;border-radius:8px;font-weight:700;font-size:inherit;z-index:20;' +
                    'background:' + color + ';color:white;box-shadow:0 4px 20px ' + color + '60;' +
                    'left:' + (srcRect.left - wrapRect.left) + 'px;top:' + (srcRect.top - wrapRect.top) + 'px;' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;transform:scale(1.15);';
                flyEl.appendChild(ghost);
                requestAnimationFrame(function() {
                    var destEl = container.querySelector('#' + destId);
                    var destLeft, destTop;
                    if (destEl) {
                        var destRect = destEl.getBoundingClientRect();
                        destLeft = destRect.left - wrapRect.left;
                        destTop = destRect.top - wrapRect.top;
                    } else {
                        var tailsRect = tailsEl.getBoundingClientRect();
                        var tailsChildren = tailsEl.children.length;
                        destLeft = tailsRect.left - wrapRect.left + tailsChildren * (BOX_W + BOX_GAP);
                        destTop = tailsRect.top - wrapRect.top;
                    }
                    requestAnimationFrame(function() {
                        ghost.style.left = destLeft + 'px';
                        ghost.style.top = destTop + 'px';
                        ghost.style.transform = 'scale(1)';
                    });
                    setTimeout(function() {
                        if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                        if (onDone) onDone();
                    }, 550);
                });
            }
            renderArr(-1);
            renderTails([], -1);
            var steps = [], tails = [];
            A.forEach(function(x, idx) {
                var prevTails = tails.slice();
                var pos = 0, lo2 = 0, hi2 = tails.length;
                while (lo2 < hi2) { var m = Math.floor((lo2 + hi2) / 2); if (tails[m] < x) lo2 = m + 1; else hi2 = m; }
                pos = lo2;
                if (pos === tails.length) {
                    tails.push(x);
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({
                            description: 'A[' + idx + ']=' + x + ': ' + x + ' &gt; tails end → <strong>append!</strong> tails=[' + newTails.join(',') + '] (length ' + newTails.length + ')',
                            action: function(dir) {
                                flyEl.innerHTML = '';
                                renderArr(idx);
                                if (dir === 'forward') {
                                    renderTails(prevTails, -1);
                                    animateMove(x, 'lis-a-' + idx, 'lis-t-' + pos, 'var(--green)', function() {
                                        renderTails(newTails, pos);
                                    });
                                } else {
                                    renderTails(newTails, pos);
                                }
                            },
                            undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(prevTails, -1); }
                        });
                    })(idx, x, pos, prevTails, newTails);
                } else {
                    tails[pos] = x;
                    var newTails = tails.slice();
                    (function(idx, x, pos, prevTails, newTails) {
                        steps.push({
                            description: 'A[' + idx + ']=' + x + ': bisect_left → pos=' + pos + ', tails[' + pos + '] <strong>replaced</strong> with ' + x + '. tails=[' + newTails.join(',') + ']',
                            action: function(dir) {
                                flyEl.innerHTML = '';
                                renderArr(idx);
                                if (dir === 'forward') {
                                    renderTails(prevTails, pos);
                                    animateMove(x, 'lis-a-' + idx, 'lis-t-' + pos, 'var(--accent)', function() {
                                        renderTails(newTails, pos);
                                    });
                                } else {
                                    renderTails(newTails, pos);
                                }
                            },
                            undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(prevTails, -1); }
                        });
                    })(idx, x, pos, prevTails, newTails);
                }
            });
            var ft = tails.slice();
            steps.push({ description: '<strong style="color:var(--green);">✅ LIS length = ' + ft.length + ' (tails=[' + ft.join(',') + '])</strong>',
                action: function() { flyEl.innerHTML = ''; renderArr(A.length); renderTails(ft, -1); },
                undo: function() { flyEl.innerHTML = ''; renderArr(-1); renderTails(ft, -1); }
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
                <h4>Input</h4>
                <p>The first line contains the natural number N (1 ≤ N ≤ 100,000). The next line contains N integers A[1], A[2], ..., A[N]. The next line contains M (1 ≤ M ≤ 100,000). The next line contains M numbers to check for existence in A. All integers are in the range -2<sup>31</sup> to less than 2<sup>31</sup>.</p>
                <h4>Output</h4>
                <p>Print M lines of answers. Print 1 if the number exists, 0 if it does not.</p>
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
                { title: 'But there\'s a problem with this', content: 'N and M are up to <strong>100,000</strong>. In the worst case, 100,000 x 100,000 = <strong>10 billion</strong> comparisons.<br>No way this finishes within the time limit! O(N x M) is way too slow.<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:120px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.75rem;color:var(--text2);margin-top:4px;">O(NM)<br>10B</div></div><div style="text-align:center;"><div style="width:40px;height:20px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.75rem;color:var(--text2);margin-top:4px;">O(MlogN)<br>1.7M</div></div></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the number of number cards Sanggeun has, N (1 ≤ N ≤ 500,000). The second line contains the integers written on each card, separated by spaces. The numbers on the cards are in the range -10,000,000 to 10,000,000. The third line contains M (1 ≤ M ≤ 500,000). The fourth line contains M integers to query.</p>
                <h4>Output</h4>
                <p>Print how many of each of the M given numbers Sanggeun has, separated by spaces on the first line.</p>
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
                { title: 'But there\'s a problem with this', content: 'N and M are up to <strong>500,000</strong>. Scanning 500K cards per query means 500,000 x 500,000 = <strong>250 billion</strong> operations!<br>O(N x M) is guaranteed TLE.<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:120px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">O(NM)<br>250B</div></div><div style="text-align:center;"><div style="width:40px;height:15px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">O(MlogN)<br>10M</div></div></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the number of LAN cables K that Young-sik already has and the number of cables N needed. K is an integer between 1 and 10,000, and N is an integer between 1 and 1,000,000. K ≤ N always holds. The next K lines contain the length of each cable as an integer in centimeters. The cable length is a natural number ≤ 2<sup>31</sup>-1.</p>
                <h4>Output</h4>
                <p>Print the maximum cable length in centimeters as an integer on the first line.</p>
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
                { title: 'But there\'s a problem with this', content: 'Cable lengths can be up to <strong>2<sup>31</sup> - 1</strong> (about 2.1 billion). Trying every length from 1 to 2.1 billion one by one?<br>In the worst case, 2.1 billion iterations x K cables to check = <strong>billions of operations</strong>... TLE for sure!<br><br><div style="display:flex;gap:2px;align-items:center;padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.8rem;flex-wrap:wrap;"><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--green);color:white;border-radius:3px;">YES</span><span style="padding:2px 6px;background:var(--yellow);color:#333;border-radius:3px;font-weight:700;border:2px solid var(--accent);">YES</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="padding:2px 6px;background:var(--red);color:white;border-radius:3px;opacity:0.7;">NO</span><span style="color:var(--text3);margin-left:4px;">← binary search the boundary!</span></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the number of trees N and the length of wood M that Sanggeun wants to take home. (1 ≤ N ≤ 1,000,000, 1 ≤ M ≤ 2,000,000,000)</p>
                <p>The second line contains the heights of the trees. The sum of tree heights is always ≥ M, so Sanggeun can always take home the needed wood. Heights are non-negative integers ≤ 1,000,000,000.</p>
                <h4>Output</h4>
                <p>Print the maximum height that can be set on the cutter to take home at least M meters of wood.</p>
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
                { title: 'But there\'s a problem with this', content: 'Tree heights can be up to <strong>1 billion</strong>! Incrementing height from 0 to 1B one by one means up to <strong>1 billion iterations</strong> x N trees to check...<br>N is also up to 1M, so the number of operations is astronomical. Guaranteed TLE!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">Linear<br>1B*N</div></div><div style="text-align:center;"><div style="width:40px;height:12px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">Binary<br>30*N</div></div></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the number of houses N (2 ≤ N ≤ 200,000) and the number of routers C (2 ≤ C ≤ N), separated by one or more spaces. From the second line, N lines each contain a house coordinate x<sub>i</sub> (0 ≤ x<sub>i</sub> ≤ 1,000,000,000).</p>
                <h4>Output</h4>
                <p>Print the maximum distance between the two closest routers on the first line.</p>
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
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>200,000</strong>. The number of ways to choose C out of N is... astronomically huge!<br>For example, choosing 100,000 out of 200,000? That is <strong>absolutely impossible</strong> to compute.<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.85rem;"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><span style="color:var(--red);font-weight:600;">Brute force:</span> <span style="color:var(--text2);">C(200K,100K) = impossible</span></div><div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap;"><span style="color:var(--green);font-weight:600;">Parametric:</span> <span style="color:var(--text);">O(N log D) = millions</span></div></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the size of the array N. N is a natural number ≤ 10<sup>5</sup>. The second line contains k. k is a natural number ≤ min(10<sup>9</sup>, N<sup>2</sup>).</p>
                <h4>Output</h4>
                <p>Print B[k].</p>
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
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>10<sup>5</sup></strong>. N² = <strong>10<sup>10</sup></strong> (10 billion) values in an array?<br>That requires tens of GB of memory, and sorting takes even longer. <strong>Both MLE and TLE</strong>!<br><br><div style="padding:8px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);font-size:0.82rem;"><table style="border-collapse:collapse;width:100%;"><tr><td style="padding:4px 8px;color:var(--text2);">Method</td><td style="padding:4px 8px;color:var(--text2);">Time</td><td style="padding:4px 8px;color:var(--text2);">Memory</td></tr><tr><td style="padding:4px 8px;color:var(--red);font-weight:600;">Sort all</td><td style="padding:4px 8px;">O(N² log N²)</td><td style="padding:4px 8px;">tens of GB</td></tr><tr><td style="padding:4px 8px;color:var(--green);font-weight:600;">Binary search</td><td style="padding:4px 8px;">O(N log k)</td><td style="padding:4px 8px;">O(1)</td></tr></table></div>' },
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
                <h4>Input</h4>
                <p>The first line contains the size of sequence A, N (1 ≤ N ≤ 1,000,000). The second line contains the elements A<sub>i</sub> of the sequence. (1 ≤ A<sub>i</sub> ≤ 1,000,000)</p>
                <h4>Output</h4>
                <p>Print the length of the longest increasing subsequence of sequence A on the first line.</p>
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
                { title: 'But there\'s a problem with this', content: 'N can be up to <strong>1,000,000</strong> (1M)! The double loop in DP is O(N squared) = <strong>1 trillion</strong> operations...<br>This would not finish even in minutes. We need a faster approach!<br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">DP O(N\u00b2)<br>1T</div></div><div style="text-align:center;"><div style="width:40px;height:8px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">tails+BS<br>20M</div></div></div><br><br><div style="display:flex;gap:12px;align-items:flex-end;padding:10px 12px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"><div style="text-align:center;"><div style="width:40px;height:100px;background:var(--red);border-radius:4px 4px 0 0;opacity:0.85;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">DP O(N\u00b2)<br>1T</div></div><div style="text-align:center;"><div style="width:40px;height:8px;background:var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.72rem;color:var(--text2);margin-top:4px;">tails+BS<br>20M</div></div></div>' },
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
