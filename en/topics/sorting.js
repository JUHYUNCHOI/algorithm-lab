// =========================================================
// Sort (Sorting) Topic Module
// =========================================================
const sortingTopic = {
    id: 'sorting',
    title: 'Sort',
    icon: '🔢',
    category: 'Search (Silver)',
    order: 7,
    description: 'Everything about sorting — from Bubble/Selection/Insertion to Merge/Quick Sort',
    relatedNote: 'Also important are special sorts like Counting Sort and Radix Sort, as well as the concept of sort stability.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'boj-25305': { type: 'Sort Application', color: '#00b894',      vizMethod: '_renderVizCutline' },
        'boj-2750':  { type: 'Basic Sort',    color: 'var(--accent)', vizMethod: '_renderVizSelection' },
        'boj-11650': { type: 'Custom Sort',   color: 'var(--green)',  vizMethod: '_renderVizCoordSort' },
        'lc-56':     { type: 'Interval Merge',     color: '#e17055',      vizMethod: '_renderVizMergeIntervals' },
        'boj-10814': { type: 'Stable Sort',     color: '#6c5ce7',      vizMethod: '_renderVizStableSort' }
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
        var diffMap = { bronze: 'Bronze', gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
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
                <h2>🔢 Sorting</h2>
                <p class="hero-sub">Let's learn the various ways to arrange data in order!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> Basic Sorts -- simple but slow</div>
                <div class="analogy-box">
                    Ever sorted a messy hand of cards? There are a few natural ways to do it.
                    You could scan for the <strong>smallest card</strong> and move it to the front each time -- that's <em>Selection Sort</em>.
                    Or you could pick up one card at a time and <strong>slide it into the right spot</strong> in your already-sorted hand -- that's <em>Insertion Sort</em>.
                    Or you could just keep <strong>swapping neighbors</strong> that are out of order until everything settles -- that's <em>Bubble Sort</em>.
                    They all work, but with 100 cards, each one could take up to 10,000 steps. So how can we do better? Keep reading!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--accent)">Sel</text></svg></div>
                        <h3>Selection Sort</h3>
                        <p>Each time, <strong>find the minimum</strong> and move it to the front. The number of comparisons is always the same — consistent but slow.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">Ins</text></svg></div>
                        <h3>Insertion Sort</h3>
                        <p><strong>Insert a card into the correct position</strong>. For nearly sorted data, it runs in O(n) — check one by one — very fast!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">Bub</text></svg></div>
                        <h3>Bubble Sort</h3>
                        <p><strong>Compare and swap</strong> adjacent elements. Larger elements "bubble up" to the end. Great for learning!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Selection Sort
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

# Insertion Sort
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Selection Sort
#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

void selection_sort(vector&lt;int&gt;&amp; arr) {
    int n = arr.size();
    for (int i = 0; i &lt; n; i++) {
        int min_idx = i;
        for (int j = i + 1; j &lt; n; j++) {
            if (arr[j] &lt; arr[min_idx])
                min_idx = j;
        }
        swap(arr[i], arr[min_idx]);
    }
}

// Insertion Sort
void insertion_sort(vector&lt;int&gt;&amp; arr) {
    for (int i = 1; i &lt; (int)arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j &gt;= 0 &amp;&amp; arr[j] &gt; key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> Among the three O(n²) sorts, which is actually used the most?
                    Insertion Sort! If data is nearly sorted, it runs in O(n), and it's fast for small arrays.
                    <span class="lang-py">Python's <code>sort()</code> internally uses Insertion Sort (TimSort).</span>
                    <span class="lang-cpp">C++'s <code>std::sort()</code> also uses Insertion Sort for small subarrays (IntroSort).</span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Three Sorts — What's the Difference?</div>
                    <div style="margin-top:1rem;overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                            <thead><tr style="background:var(--bg2);">
                                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">Comparison</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Selection Sort</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Insertion Sort</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Bubble Sort</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Best Time</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);font-weight:600;">O(n) ✨</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Worst Time</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n²)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Stable?</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);">❌</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Key Strength</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Fewest swaps</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Fast on nearly sorted data</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Simplest to implement</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">How It Works</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Find min, place at front</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Insert into sorted portion</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Swap adjacent pairs</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>Key Difference:</strong> Only Insertion Sort can achieve best-case O(n)! On already-sorted data, it only compares without moving elements. That's why practical sorting algorithms (TimSort, IntroSort) use Insertion Sort for small subarrays. Selection Sort has the fewest swaps at O(n), making it advantageous when swap cost is high.
                    </div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Selection Sort Mini Demo</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Each round, find the <strong>minimum among remaining elements</strong> and swap it to the front.<br>
                        Click "Step" to follow along <em>one comparison at a time</em> — see how the minimum gets updated!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-sel-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-sel-reset">Start Over ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-sel-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-sel-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-sel-msg">▶ Click Step to start Selection Sort!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Insertion Sort Mini Demo</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Expand the <strong>sorted portion</strong> (green) from the left. <em>Pull out</em> the next element and hold it above, then find its correct position by <em>inserting</em> it!<br>
                        Watch larger elements shift right, one step at a time.
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-ins-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-ins-reset">Start Over ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-ins-key" style="display:flex;justify-content:center;min-height:52px;margin-bottom:8px;align-items:center;"></div>
                            <div id="sort-demo-ins-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-ins-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-ins-msg">▶ Click Step to start Insertion Sort!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Bubble Sort Mini Demo</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Compare two adjacent elements — if the left one is larger, <strong>swap</strong> them. After one pass, the largest element "bubbles up" to the end.<br>
                        Follow along one comparison at a time!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-bub-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-bub-reset">Start Over ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="position:relative;">
                            <div id="sort-demo-bub-arr" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;min-height:50px;"></div>
                            <div id="sort-demo-bub-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-bub-msg">▶ Click Step to start Bubble Sort!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Speed Race: Selection vs Insertion vs Bubble</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Sort the same array with all three algorithms simultaneously. See how the <strong>number of comparisons</strong> and <strong>number of swaps</strong> differ!<br>
                        All are O(n²), but the actual operation counts vary.
                    </p>
                    <div style="display:flex;gap:12px;justify-content:center;align-items:center;margin-bottom:8px;">
                        <button class="concept-demo-btn" id="sort-demo-race-prev">&larr; Prev</button>
                        <span id="sort-demo-race-counter" style="font-size:0.85rem;color:var(--text2);min-width:80px;text-align:center;">Before Start</span>
                        <button class="concept-demo-btn" id="sort-demo-race-next">Next &rarr;</button>
                        <button class="concept-demo-btn danger" id="sort-demo-race-reset" style="margin-left:8px;">🔄</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:8px;">
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--accent);">Selection Sort</div>
                                <div id="sort-demo-race-sel" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">Comparisons: <span id="sort-demo-race-sel-cmp" style="font-weight:700;color:var(--accent);">0</span> · Swaps: <span id="sort-demo-race-sel-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--green);">Insertion Sort</div>
                                <div id="sort-demo-race-ins" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">Comparisons: <span id="sort-demo-race-ins-cmp" style="font-weight:700;color:var(--accent);">0</span> · Shifts: <span id="sort-demo-race-ins-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-weight:700;margin-bottom:6px;color:var(--yellow);">Bubble Sort</div>
                                <div id="sort-demo-race-bub" style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:44px;"></div>
                                <div style="margin-top:6px;font-size:0.82rem;">Comparisons: <span id="sort-demo-race-bub-cmp" style="font-weight:700;color:var(--accent);">0</span> · Swaps: <span id="sort-demo-race-bub-swp" style="font-weight:700;color:var(--red);">0</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-race-msg">▶ Click "Next →" to compare all three sorts!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Merge Sort -- the fast way</div>
                <div class="analogy-box">
                    The basic sorts we just saw are painfully slow for big lists. So how can we sort faster?
                    Here's a clever trick: take a messy pile of cards, rip it in half, sort each half separately, then merge the two sorted halves back together like a zipper.
                    Since you keep splitting in half, you only need about 17 levels of splitting for 100,000 cards. Compare that to 10 billion steps for basic sorts! This "split, sort, merge" strategy is called <strong>Divide & Conquer</strong>.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--accent)">÷2</text></svg></div>
                        <h3>Divide</h3>
                        <p><strong>Split the array in half</strong>. Recursively, until each piece has just 1 element!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--green)">↗↗</text></svg></div>
                        <h3>Conquer</h3>
                        <p>A single-element array is already sorted!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">⊕</text></svg></div>
                        <h3>Merge</h3>
                        <p><strong>Combine two sorted arrays into one</strong>. Compare from the front in O(n)!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # Sort left half
    right = merge_sort(arr[mid:])   # Sort right half

    # Merge
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
using namespace std;

void merge(vector&lt;int&gt;&amp; arr, int l, int m, int r) {
    vector&lt;int&gt; left(arr.begin() + l, arr.begin() + m + 1);
    vector&lt;int&gt; right(arr.begin() + m + 1, arr.begin() + r + 1);

    int i = 0, j = 0, k = l;
    while (i &lt; (int)left.size() &amp;&amp; j &lt; (int)right.size()) {
        if (left[i] &lt;= right[j])   // &lt;= for stable sort
            arr[k++] = left[i++];
        else
            arr[k++] = right[j++];
    }
    while (i &lt; (int)left.size()) arr[k++] = left[i++];
    while (j &lt; (int)right.size()) arr[k++] = right[j++];
}

void merge_sort(vector&lt;int&gt;&amp; arr, int l, int r) {
    if (l &gt;= r) return;

    int m = l + (r - l) / 2;
    merge_sort(arr, l, m);       // Sort left half
    merge_sort(arr, m + 1, r);   // Sort right half
    merge(arr, l, m, r);         // Merge
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> Merge Sort is always O(n log n)!
                    It's stable even in the worst case, but the downside is it requires O(n) extra memory.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Merge Sort Mini Demo</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Follow along step by step as array [38, 27, 43, 3, 9, 82, 10] gets <strong>split in half → merged</strong>!<br>
                        The key is comparing front elements of two arrays and picking the smaller one.
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-merge-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-merge-reset">Start Over ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-merge-viz" style="min-height:120px;overflow-x:auto;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-merge-msg">▶ Press Step to start Merge Sort!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> Quick Sort: Average O(n log n)</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Quick Sort is <em>"pick a pivot and partition left and right"</em>!
                    Choose a pivot value, send smaller elements left and larger elements right.
                    Then recursively sort each side.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">pivot</text></svg></div>
                        <h3>Pivot Selection</h3>
                        <p>Choose a reference value. Typically the first, last, or middle element.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">O(n²)</text></svg></div>
                        <h3>Worst Case</h3>
                        <p>If the pivot is always at the end on an already-sorted array, it's O(n²)! Use a random pivot to avoid this.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python">def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]  # Use middle element as pivot
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + mid + quick_sort(right)

# In practice, use Python's built-in sort!
arr = [38, 27, 43, 3, 9, 82, 10]
arr.sort()          # In-place sort (TimSort, O(n log n))
sorted_arr = sorted(arr)  # Returns a new list</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;algorithm&gt;
using namespace std;

int partition(vector&lt;int&gt;&amp; arr, int lo, int hi) {
    int pivot = arr[hi];  // Use last element as pivot
    int i = lo - 1;
    for (int j = lo; j &lt; hi; j++) {
        if (arr[j] &lt; pivot)
            swap(arr[++i], arr[j]);
    }
    swap(arr[i + 1], arr[hi]);
    return i + 1;
}

void quick_sort(vector&lt;int&gt;&amp; arr, int lo, int hi) {
    if (lo &gt;= hi) return;
    int p = partition(arr, lo, hi);
    quick_sort(arr, lo, p - 1);
    quick_sort(arr, p + 1, hi);
}

// In practice, use C++'s built-in sort!
vector&lt;int&gt; arr = {38, 27, 43, 3, 9, 82, 10};
sort(arr.begin(), arr.end());  // IntroSort, O(n log n)</code></pre>
                </div></span>
                <div style="margin-top:10px;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#list.sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: list.sort() / sorted() ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/sort" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: std::sort() ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 Think about it:</strong> In coding tests, you almost always use <code>sort()</code>!
                    But knowing how sorting algorithms work lets you <strong>customize sort criteria</strong><span class="lang-py"> (<code>key</code>, <code>lambda</code>)</span><span class="lang-cpp"> (comparator functions, lambdas)</span>
                    with ease.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Quick Sort Mini Demo</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        Follow along step by step as array [38, 27, 43, 3, 9, 82, 10] gets partitioned: <strong>pick a pivot</strong>, send smaller elements left and larger elements right!
                    </p>
                    <div class="concept-demo-btns">
                        <button class="concept-demo-btn" id="sort-demo-quick-step">Next ▶</button>
                        <button class="concept-demo-btn danger" id="sort-demo-quick-reset">Start Over ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-quick-viz" style="min-height:120px;overflow-x:auto;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-quick-msg">▶ Press Step to start Quick Sort!</div>
                </div>

                <div class="concept-demo">
                    <div class="concept-demo-title">Merge Sort vs Quick Sort — What's the Difference?</div>
                    <div style="margin-top:1rem;overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                            <thead><tr style="background:var(--bg2);">
                                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">Comparison</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Merge Sort</th>
                                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">Quick Sort</th>
                            </tr></thead>
                            <tbody>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Average Time</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n log n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n log n)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Worst Time</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">O(n log n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);font-weight:600;">O(n²) ⚠️</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Extra Memory</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">O(n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">O(log n)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Stable?</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--green);">✅</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;color:var(--red);">❌</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">Key Strength</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Always guaranteed O(n log n)</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Fastest in practice (cache-friendly)</td></tr>
                                <tr><td style="padding:8px 10px;border:1px solid var(--bg3);font-weight:600;">How It Works</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Divide → Sort → Merge</td><td style="padding:8px 10px;border:1px solid var(--bg3);text-align:center;">Partition by pivot → Recurse</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div style="margin-top:1rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>Why Quick Sort is usually faster in practice:</strong> Both are O(n log n), but Quick Sort is an in-place sort with a higher cache hit rate, making it faster in real-world usage. Merge Sort needs to create new arrays every time it merges, which scatters memory accesses.
                    </div>
                    <div style="margin-top:0.7rem;padding:10px 14px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:6px;font-size:0.88rem;line-height:1.7;">
                        <strong>How to avoid worst-case O(n²)?</strong> Choose the pivot randomly or use the median-of-three strategy (pick the median of first, middle, and last elements). C++'s <code>std::sort()</code> uses IntroSort, a hybrid of Quick Sort + Heap Sort, to solve this problem.
                    </div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Sorting Application Patterns</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Sorting is not the goal itself, but <em>"preprocessing to solve other problems"</em>!
                    Once sorted, you can apply binary search, two pointers, grouping, and many other techniques.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--accent)">key=</text></svg></div>
                        <h3>Custom Sort</h3>
                        <p><span class="lang-py"><code>sort(key=lambda x: ...)</code> to sort by any criteria!</span><span class="lang-cpp"><code>sort(begin, end, comparator)</code> to sort by any criteria!</span> Coordinate sorting, string sorting, etc.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">stable</text></svg></div>
                        <h3>Stable Sort</h3>
                        <p>The original order of equal values is preserved. <span class="lang-py">Python's sort() is stable (TimSort)!</span><span class="lang-cpp">C++'s <code>stable_sort()</code> is stable! (<code>sort()</code> is unstable)</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Custom sort examples
coords = [(3, 4), (1, 2), (3, 1), (1, 5)]

# Sort by x, then by y if equal
coords.sort(key=lambda p: (p[0], p[1]))
# [(1, 2), (1, 5), (3, 1), (3, 4)]

# Sort by string length
words = ["banana", "pie", "apple", "fig"]
words.sort(key=len)  # ["pie", "fig", "apple", "banana"]

# Multiple criteria: ascending length → then lexicographic
words.sort(key=lambda w: (len(w), w))</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// Custom sort examples
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;string&gt;
using namespace std;

vector&lt;pair&lt;int,int&gt;&gt; coords = {{3,4},{1,2},{3,1},{1,5}};

// Sort by x, then by y if equal
sort(coords.begin(), coords.end());
// pair compares by first, then second by default
// {{1,2},{1,5},{3,1},{3,4}}

// Sort by string length
vector&lt;string&gt; words = {"banana","pie","apple","fig"};
sort(words.begin(), words.end(),
    [](const string&amp; a, const string&amp; b) {
        return a.size() &lt; b.size();
    });
// {"pie","fig","apple","banana"}

// Multiple criteria: ascending length → then lexicographic
sort(words.begin(), words.end(),
    [](const string&amp; a, const string&amp; b) {
        if (a.size() != b.size()) return a.size() &lt; b.size();
        return a &lt; b;
    });</code></pre>
                </div></span>

                <div class="concept-demo">
                    <div class="concept-demo-title">Try Custom Sorting</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:12px;line-height:1.7;">
                        The same data can be ordered completely differently depending on the <strong>sort key</strong>!<br>
                        Click the buttons to change the criteria — see how the result changes with each key!
                    </p>
                    <div class="concept-demo-btns" id="sort-demo-custom-btns">
                        <button class="concept-demo-btn" data-key="score">By Score ▼</button>
                        <button class="concept-demo-btn" data-key="name">By Name (A-Z)</button>
                        <button class="concept-demo-btn" data-key="length">By Name Length</button>
                        <button class="concept-demo-btn danger" data-key="reset">Original Order ↺</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="sort-demo-custom-arr" style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;min-height:70px;transition:opacity 0.2s;"></div>
                    </div>
                    <div class="concept-demo-msg" id="sort-demo-custom-msg">Click a button to change the sort criteria!</div>
                </div>

                <div class="think-box">
                    <strong>💡 Think about it:</strong>
                    <span class="lang-py">In C++, custom comparators for <code>sort()</code> use the form
                    <code>sort(v.begin(), v.end(), [](auto& a, auto& b) { ... })</code>.</span>
                    <span class="lang-cpp">In Python, custom sorting uses <code>sort(key=lambda x: ...)</code>,
                    using a key function instead of a comparator.</span>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">5</span> In Practice: What Sort Does Python/C++ sort() Use?</div>
                <div class="analogy-box">
                    <strong>Key Point:</strong> You'll rarely implement Selection/Insertion/Bubble Sort yourself.
                    In practice, you use the language's built-in <code>sort()</code>.
                    But what sorting algorithm does <code>sort()</code> use internally?
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card" style="border-left:3px solid var(--yellow);">
                        <h3>🐍 Python: TimSort</h3>
                        <p>A hybrid of <strong>Insertion Sort + Merge Sort</strong></p>
                        <ul style="font-size:0.88rem;margin-top:8px;padding-left:1.2rem;">
                            <li>Finds already-sorted segments (<strong>runs</strong>) in the data and leverages them</li>
                            <li>Small segments are sorted quickly with <strong>Insertion Sort</strong></li>
                            <li>Large segments are merged with <strong>Merge Sort</strong></li>
                            <li><strong>Stable sort</strong> → preserves original order for equal keys</li>
                        </ul>
                        <div style="margin-top:8px;padding:6px 10px;background:rgba(243,156,18,0.08);border-radius:8px;font-size:0.82rem;">
                            💡 Real-world data is often partially sorted,<br>
                            so TimSort, which leverages this, is very fast in practice!
                        </div>
                    </div>
                    <div class="concept-card" style="border-left:3px solid var(--accent);">
                        <h3>⚡ C++: IntroSort</h3>
                        <p>A hybrid of <strong>Quick Sort + Heap Sort + Insertion Sort</strong></p>
                        <ul style="font-size:0.88rem;margin-top:8px;padding-left:1.2rem;">
                            <li>Primarily uses <strong>Quick Sort</strong> (fastest on average)</li>
                            <li>Switches to <strong>Heap Sort</strong> when recursion depth gets too deep → prevents worst-case O(n²)</li>
                            <li>Small segments are finished with <strong>Insertion Sort</strong></li>
                            <li><strong>Unstable sort</strong> → use <code>stable_sort()</code> when stability is needed</li>
                        </ul>
                        <div style="margin-top:8px;padding:6px 10px;background:rgba(108,92,231,0.08);border-radius:8px;font-size:0.82rem;">
                            💡 <code>std::sort()</code> is unstable! If you need order preservation,<br>
                            you must use <code>std::stable_sort()</code>.
                        </div>
                    </div>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">Comparison: Python vs C++ Sort</div>
                    <div style="overflow-x:auto;">
                        <table style="width:100%;border-collapse:collapse;font-size:0.88rem;margin-top:8px;">
                            <tr style="background:var(--bg2);">
                                <th style="padding:8px 12px;text-align:left;border-bottom:2px solid var(--border);"></th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">🐍 Python <code>sort()</code></th>
                                <th style="padding:8px 12px;text-align:center;border-bottom:2px solid var(--border);">⚡ C++ <code>std::sort()</code></th>
                            </tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">Algorithm</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">TimSort</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">IntroSort</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">Average</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">Worst</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;">O(n log n)</td></tr>
                            <tr><td style="padding:6px 12px;border-bottom:1px solid var(--border);font-weight:600;">Stable?</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;color:var(--green);">✅ Stable</td><td style="padding:6px 12px;border-bottom:1px solid var(--border);text-align:center;color:var(--red);">❌ Unstable</td></tr>
                            <tr><td style="padding:6px 12px;font-weight:600;">Stable Version</td><td style="padding:6px 12px;text-align:center;">Stable by default!</td><td style="padding:6px 12px;text-align:center;"><code>stable_sort()</code></td></tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });

        // ── Selection Sort Mini Demo ──
        {
            var selArr = [64, 25, 12, 22, 11];
            var selState = { arr: selArr.slice(), i: 0, j: 0, minIdx: 0, phase: 'start', done: false };
            var selArrEl = container.querySelector('#sort-demo-sel-arr');
            var selFlyEl = container.querySelector('#sort-demo-sel-fly');
            var selMsg = container.querySelector('#sort-demo-sel-msg');

            var selStepBtn = container.querySelector('#sort-demo-sel-step');
            var selAnimating = false;

            function renderSelArr() {
                selArrEl.innerHTML = selState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    var showLabels = (selState.phase === 'compare' || selState.phase === 'ready_swap');
                    if (selState.done || idx < selState.i) {
                        cls += ' matched';
                        if (selState.phase === 'swapped' && idx === selState.i - 1) {
                            extra = 'border-color:var(--green);box-shadow:0 0 14px var(--green);transform:scale(1.1);';
                        }
                    } else if (selState.phase === 'swap' && (idx === selState.i || idx === selState.minIdx)) {
                        extra = 'border-color:var(--accent);box-shadow:0 0 12px var(--accent);transform:scale(1.08);';
                    } else if (idx === selState.minIdx && showLabels) {
                        extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                    }
                    if (idx === selState.j && selState.phase === 'compare' && idx !== selState.minIdx) {
                        extra = 'border-color:var(--red);box-shadow:0 0 6px var(--red);';
                    }
                    var label = '';
                    if (idx === selState.minIdx && showLabels) label = '<div style="font-size:0.65rem;color:var(--yellow);margin-top:2px;">min</div>';
                    if (idx === selState.j && selState.phase === 'compare') label += '<div style="font-size:0.65rem;color:var(--red);margin-top:2px;">j</div>';
                    if (selState.phase === 'swap' && idx === selState.i && selState.i !== selState.minIdx) label = '<div style="font-size:0.65rem;color:var(--accent);margin-top:2px;">i</div>';
                    if (selState.phase === 'swap' && idx === selState.minIdx) label += '<div style="font-size:0.65rem;color:var(--accent);margin-top:2px;">min</div>';
                    return '<div style="display:flex;flex-direction:column;align-items:center;">' +
                        '<div class="' + cls + '" id="sel-box-' + idx + '" style="' + extra + '">' + v + '</div>' + label + '</div>';
                }).join('');
            }

            function animateConceptSwap(arrEl, flyEl, idxA, idxB, valA, valB, colorA, colorB, onDone) {
                var elA = arrEl.querySelector('#sel-box-' + idxA);
                var elB = arrEl.querySelector('#sel-box-' + idxB);
                var wrapRect = arrEl.parentElement.getBoundingClientRect();
                if (!elA || !elB) { if (onDone) onDone(); return; }
                var rectA = elA.getBoundingClientRect();
                var rectB = elB.getBoundingClientRect();
                elA.style.opacity = '0.15'; elB.style.opacity = '0.15';
                function mkGhost(val, rect, color) {
                    var g = document.createElement('div');
                    g.textContent = val;
                    g.className = 'str-char-box';
                    g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                        'left:' + (rect.left - wrapRect.left) + 'px;' +
                        'top:' + (rect.top - wrapRect.top) + 'px;' +
                        'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                        'display:flex;align-items:center;justify-content:center;' +
                        'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);' +
                        'background:' + color + ';color:white;border-color:' + color + ';' +
                        'box-shadow:0 0 12px ' + color + ';transform:scale(1.1);';
                    return g;
                }
                var gA = mkGhost(valA, rectA, colorA);
                var gB = mkGhost(valB, rectB, colorB);
                flyEl.appendChild(gA); flyEl.appendChild(gB);
                requestAnimationFrame(function() {
                    requestAnimationFrame(function() {
                        gA.style.left = (rectB.left - wrapRect.left) + 'px';
                        gB.style.left = (rectA.left - wrapRect.left) + 'px';
                    });
                });
                setTimeout(function() {
                    if (gA.parentNode) gA.parentNode.removeChild(gA);
                    if (gB.parentNode) gB.parentNode.removeChild(gB);
                    if (onDone) onDone();
                }, 550);
            }

            function selStep() {
                if (selState.done || selAnimating) return;
                if (selState.phase === 'start') {
                    selState.i = 0; selState.minIdx = 0; selState.j = 1;
                    selState.phase = 'compare';
                    selMsg.textContent = 'Round 0: Set ' + selState.arr[0] + ' as tentative min. Compare with j=1 (' + selState.arr[1] + ').';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'swapped') {
                    selState.minIdx = selState.i;
                    selState.j = selState.i + 1;
                    selState.phase = 'compare';
                    selMsg.textContent = 'Round ' + selState.i + ': Set ' + selState.arr[selState.i] + ' as tentative min. Compare with j=' + (selState.i + 1) + ' (' + selState.arr[selState.i + 1] + ').';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'compare') {
                    if (selState.j < selState.arr.length) {
                        if (selState.arr[selState.j] < selState.arr[selState.minIdx]) {
                            selState.minIdx = selState.j;
                            selMsg.textContent = selState.arr[selState.j] + ' < current min → Update min to ' + selState.arr[selState.j] + ' (index ' + selState.j + ')!';
                        } else {
                            selMsg.textContent = selState.arr[selState.j] + ' >= current min ' + selState.arr[selState.minIdx] + ' → No change.';
                        }
                        selState.j++;
                        if (selState.j >= selState.arr.length) {
                            selState.phase = 'ready_swap';
                        }
                        renderSelArr();
                        return;
                    }
                    selState.phase = 'ready_swap';
                }
                if (selState.phase === 'ready_swap') {
                    var a = selState.i, b = selState.minIdx;
                    if (a !== b) {
                        selMsg.textContent = 'Comparisons done! Min = ' + selState.arr[b] + ' (index ' + b + '). Next Step will swap with arr[' + a + ']=' + selState.arr[a] + '.';
                    } else {
                        selMsg.textContent = 'Comparisons done! Min = ' + selState.arr[b] + ' — already in place. Position ' + a + ' finalized!';
                    }
                    selState.phase = 'swap';
                    renderSelArr();
                    return;
                }
                if (selState.phase === 'swap') {
                    var a = selState.i, b = selState.minIdx;
                    if (a !== b) {
                        selMsg.textContent = 'Swap! arr[' + a + ']=' + selState.arr[a] + ' ↔ arr[' + b + ']=' + selState.arr[b];
                        var valA = selState.arr[a], valB = selState.arr[b];
                        selFlyEl.innerHTML = '';
                        selAnimating = true;
                        selStepBtn.disabled = true;
                        selStepBtn.style.opacity = '0.5';
                        animateConceptSwap(selArrEl, selFlyEl, a, b, valA, valB, '#e17055', 'var(--yellow)', function() {
                            selAnimating = false;
                            selStepBtn.disabled = false;
                            selStepBtn.style.opacity = '';
                            var tmp = selState.arr[a]; selState.arr[a] = selState.arr[b]; selState.arr[b] = tmp;
                            selState.i++;
                            if (selState.i >= selState.arr.length - 1) {
                                selState.done = true;
                                selMsg.textContent = 'Sort complete! [' + selState.arr.join(', ') + '] — Total comparisons: n(n-1)/2';
                            } else {
                                selState.phase = 'swapped';
                                selMsg.textContent = 'Position ' + a + ' finalized: ' + selState.arr[a] + '. Click Step for next round!';
                            }
                            renderSelArr();
                        });
                    } else {
                        selState.i++;
                        if (selState.i >= selState.arr.length - 1) {
                            selState.done = true;
                            selMsg.textContent = 'Sort complete! [' + selState.arr.join(', ') + '] — Total comparisons: n(n-1)/2';
                        } else {
                            selState.phase = 'swapped';
                            selMsg.textContent = 'Min already in place! Position ' + (selState.i - 1) + ' finalized: ' + selState.arr[selState.i - 1] + '. Click Step for next round!';
                        }
                        renderSelArr();
                    }
                }
            }

            function selReset() {
                selState = { arr: [64, 25, 12, 22, 11], i: 0, j: 0, minIdx: 0, phase: 'start', done: false };
                selAnimating = false;
                selStepBtn.disabled = false;
                selStepBtn.style.opacity = '';
                selMsg.textContent = '▶ Click Step to start Selection Sort!';
                renderSelArr();
            }

            container.querySelector('#sort-demo-sel-step').addEventListener('click', selStep);
            container.querySelector('#sort-demo-sel-reset').addEventListener('click', selReset);
            renderSelArr();
        }

        // ── Insertion Sort Mini Demo ──
        // key is shown floating above the array, with a hole (dashed box) in its original position
        {
            var insInitArr = [64, 25, 12, 22, 11];
            var insState = { arr: insInitArr.slice(), i: 1, j: -1, key: -1, hole: -1, phase: 'pick', done: false };
            var insArrEl = container.querySelector('#sort-demo-ins-arr');
            var insKeyEl = container.querySelector('#sort-demo-ins-key');
            var insFlyEl = container.querySelector('#sort-demo-ins-fly');
            var insMsg = container.querySelector('#sort-demo-ins-msg');

            function renderInsArr() {
                // Key area: show key floating above array when extracted
                if (insState.phase !== 'pick' && !insState.done) {
                    insKeyEl.innerHTML =
                        '<div style="display:flex;flex-direction:column;align-items:center;">' +
                            '<div style="font-size:0.6rem;color:var(--yellow);margin-bottom:2px;font-weight:700;">key</div>' +
                            '<div class="str-char-box" style="border-color:var(--yellow);box-shadow:0 0 12px var(--yellow);background:rgba(253,203,110,0.15);font-weight:700;">' + insState.key + '</div>' +
                        '</div>';
                } else {
                    insKeyEl.innerHTML = '';
                }

                // Array area
                insArrEl.innerHTML = insState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    var content = v;
                    var label = '';

                    if (insState.done) {
                        cls += ' matched';
                    } else if (insState.phase === 'pick') {
                        if (idx < insState.i) cls += ' matched';
                        if (idx === insState.i) extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                    } else {
                        if (idx === insState.hole) {
                            content = '';
                            extra = 'border:2px dashed var(--text3);background:transparent;color:transparent;box-shadow:none;';
                            label = '<div style="font-size:0.55rem;color:var(--text3);margin-top:2px;">hole</div>';
                        } else if (idx < insState.i && idx !== insState.hole) {
                            cls += ' matched';
                            if (insState.phase === 'compare' && idx === insState.j) {
                                extra = 'border-color:var(--red);box-shadow:0 0 10px var(--red);';
                                label = '<div style="font-size:0.55rem;color:var(--red);margin-top:2px;">compare</div>';
                            }
                        }
                    }
                    return '<div style="display:flex;flex-direction:column;align-items:center;">' +
                        '<div class="' + cls + '" id="ins-box-' + idx + '" style="' + extra + '">' + content + '</div>' + label + '</div>';
                }).join('');
            }

            var insStepBtn = container.querySelector('#sort-demo-ins-step');
            var insAnimating = false;

            function insStep() {
                if (insState.done || insAnimating) return;

                if (insState.phase === 'pick') {
                    if (insState.i >= insState.arr.length) {
                        insState.done = true;
                        insMsg.textContent = '\u2705 Sort complete! [' + insState.arr.join(', ') + '] \u2014 Nearly O(n) on almost-sorted data!';
                        renderInsArr();
                        return;
                    }
                    insState.key = insState.arr[insState.i];
                    insState.hole = insState.i;
                    insState.j = insState.i - 1;
                    insMsg.textContent = '\uD83C\uDCCF Pulled out key = ' + insState.key + ' (index ' + insState.i + '). Now find where it belongs in the sorted portion.';
                    insState.phase = 'compare';
                    renderInsArr();
                    return;
                }

                if (insState.phase === 'compare') {
                    if (insState.j >= 0 && insState.arr[insState.j] > insState.key) {
                        insMsg.textContent = '\uD83D\uDD0D ' + insState.arr[insState.j] + ' > key(' + insState.key + ') \u2192 It\u2019s bigger, so it needs to shift right!';
                        insState.phase = 'shift';
                        renderInsArr();
                    } else if (insState.j >= 0) {
                        insMsg.textContent = '\u2713 ' + insState.arr[insState.j] + ' \u2264 key(' + insState.key + ') \u2192 Found the spot! Insert key into the hole.';
                        insState.phase = 'insert';
                        renderInsArr();
                    } else {
                        insMsg.textContent = '\u2713 Reached the beginning! Index 0 is where key belongs.';
                        insState.phase = 'insert';
                        renderInsArr();
                    }
                    return;
                }

                if (insState.phase === 'shift') {
                    var srcIdx = insState.j;
                    var destIdx = insState.hole;
                    var shiftVal = insState.arr[srcIdx];
                    insFlyEl.innerHTML = '';

                    var elSrc = insArrEl.querySelector('#ins-box-' + srcIdx);
                    var wrapRect = insArrEl.parentElement.getBoundingClientRect();
                    if (elSrc) {
                        var rectSrc = elSrc.getBoundingClientRect();
                        var elDest = insArrEl.querySelector('#ins-box-' + destIdx);
                        var rectDest = elDest ? elDest.getBoundingClientRect() : rectSrc;
                        elSrc.style.opacity = '0.15';
                        var g = document.createElement('div');
                        g.textContent = shiftVal;
                        g.className = 'str-char-box';
                        g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                            'left:' + (rectSrc.left - wrapRect.left) + 'px;' +
                            'top:' + (rectSrc.top - wrapRect.top) + 'px;' +
                            'width:' + rectSrc.width + 'px;height:' + rectSrc.height + 'px;' +
                            'display:flex;align-items:center;justify-content:center;' +
                            'transition:left 0.4s cubic-bezier(.4,0,.2,1);' +
                            'background:#e17055;color:white;border-color:#e17055;' +
                            'box-shadow:0 0 10px #e17055;transform:scale(1.05);';
                        insFlyEl.appendChild(g);
                        insAnimating = true;
                        insStepBtn.disabled = true;
                        insStepBtn.style.opacity = '0.5';
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                g.style.left = (rectDest.left - wrapRect.left) + 'px';
                            });
                        });
                        setTimeout(function() {
                            insAnimating = false;
                            insStepBtn.disabled = false;
                            insStepBtn.style.opacity = '';
                            if (g.parentNode) g.parentNode.removeChild(g);
                            insState.arr[destIdx] = shiftVal;
                            insState.hole = srcIdx;
                            insState.j--;
                            insMsg.textContent = '\u2192 Shifted ' + shiftVal + ' right. The hole moved left.';
                            insState.phase = 'compare';
                            renderInsArr();
                        }, 450);
                    }
                    return;
                }

                if (insState.phase === 'insert') {
                    insState.arr[insState.hole] = insState.key;
                    insMsg.textContent = '\uD83D\uDCE5 Inserted key=' + insState.key + ' at index ' + insState.hole + '! \u2192 [' + insState.arr.join(', ') + ']';
                    insState.i++;
                    insState.phase = 'pick';
                    insState.hole = -1;
                    insFlyEl.innerHTML = '';
                    renderInsArr();
                }
            }

            function insReset() {
                insState = { arr: insInitArr.slice(), i: 1, j: -1, key: -1, hole: -1, phase: 'pick', done: false };
                insMsg.textContent = '\u25B6 Click Step to start Insertion Sort!';
                insFlyEl.innerHTML = '';
                renderInsArr();
            }

            container.querySelector('#sort-demo-ins-step').addEventListener('click', insStep);
            container.querySelector('#sort-demo-ins-reset').addEventListener('click', insReset);
            renderInsArr();
        }

        // ── Bubble Sort Mini Demo ──
        {
            var bubInitArr = [64, 25, 12, 22, 11];
            var bubState = { arr: bubInitArr.slice(), pass: 0, j: 0, phase: 'compare', done: false };
            var bubArrEl = container.querySelector('#sort-demo-bub-arr');
            var bubFlyEl = container.querySelector('#sort-demo-bub-fly');
            var bubMsg = container.querySelector('#sort-demo-bub-msg');
            var bubStepBtn = container.querySelector('#sort-demo-bub-step');
            var bubAnimating = false;

            function renderBubArr() {
                var n = bubState.arr.length;
                bubArrEl.innerHTML = bubState.arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = '';
                    if (bubState.done || idx >= n - bubState.pass) {
                        cls += ' matched';
                    }
                    if (!bubState.done && (idx === bubState.j || idx === bubState.j + 1) && idx < n - bubState.pass) {
                        if (bubState.phase === 'need_swap') {
                            extra = 'border-color:var(--red);box-shadow:0 0 10px var(--red);transform:scale(1.08);';
                        } else {
                            extra = 'border-color:var(--yellow);box-shadow:0 0 8px var(--yellow);';
                        }
                    }
                    return '<div class="' + cls + '" id="bub-box-' + idx + '" style="' + extra + '">' + v + '</div>';
                }).join('');
            }

            function bubAdvanceJ() {
                var n = bubState.arr.length;
                bubState.j++;
                if (bubState.j >= n - 1 - bubState.pass) {
                    bubState.pass++;
                    bubState.j = 0;
                    if (bubState.pass >= n - 1) {
                        bubState.done = true;
                        bubMsg.textContent = 'Sort complete! [' + bubState.arr.join(', ') + '] — Took ' + bubState.pass + ' passes total.';
                    }
                }
                bubState.phase = 'compare';
            }

            function bubStep() {
                if (bubState.done || bubAnimating) return;
                var n = bubState.arr.length;
                if (bubState.pass >= n - 1) {
                    bubState.done = true;
                    bubMsg.textContent = 'Sort complete! [' + bubState.arr.join(', ') + ']';
                    renderBubArr();
                    return;
                }
                if (bubState.phase === 'compare') {
                    var a = bubState.j, b = bubState.j + 1;
                    if (bubState.arr[a] > bubState.arr[b]) {
                        bubMsg.textContent = bubState.arr[a] + ' > ' + bubState.arr[b] + ' → Swap needed! (Pass ' + (bubState.pass + 1) + ', comparison ' + (bubState.j + 1) + ')';
                        bubState.phase = 'need_swap';
                    } else {
                        bubMsg.textContent = bubState.arr[a] + ' <= ' + bubState.arr[b] + ' → No swap. (Pass ' + (bubState.pass + 1) + ', comparison ' + (bubState.j + 1) + ')';
                        bubAdvanceJ();
                    }
                    renderBubArr();
                    return;
                }
                if (bubState.phase === 'need_swap') {
                    var a = bubState.j, b = bubState.j + 1;
                    var valA = bubState.arr[a], valB = bubState.arr[b];
                    bubMsg.textContent = 'Swapping ' + bubState.arr[a] + ' and ' + bubState.arr[b] + '!';
                    bubFlyEl.innerHTML = '';
                    bubAnimating = true;
                    bubStepBtn.disabled = true;
                    bubStepBtn.style.opacity = '0.5';
                    (function(idxA, idxB) {
                        var elA = bubArrEl.querySelector('#bub-box-' + idxA);
                        var elB = bubArrEl.querySelector('#bub-box-' + idxB);
                        var wrapRect = bubArrEl.parentElement.getBoundingClientRect();
                        if (!elA || !elB) { bubAnimating = false; bubStepBtn.disabled = false; bubStepBtn.style.opacity = ''; return; }
                        var rectA = elA.getBoundingClientRect();
                        var rectB = elB.getBoundingClientRect();
                        elA.style.opacity = '0.15'; elB.style.opacity = '0.15';
                        function mkG(val, rect, color) {
                            var g = document.createElement('div');
                            g.textContent = val;
                            g.className = 'str-char-box';
                            g.style.cssText = 'position:absolute;z-index:20;margin:0;' +
                                'left:' + (rect.left - wrapRect.left) + 'px;' +
                                'top:' + (rect.top - wrapRect.top) + 'px;' +
                                'width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                                'display:flex;align-items:center;justify-content:center;' +
                                'transition:left 0.5s cubic-bezier(.4,0,.2,1);' +
                                'background:' + color + ';color:white;border-color:' + color + ';' +
                                'box-shadow:0 0 12px ' + color + ';transform:scale(1.1);';
                            return g;
                        }
                        var gA = mkG(valA, rectA, '#e17055');
                        var gB = mkG(valB, rectB, 'var(--yellow)');
                        bubFlyEl.appendChild(gA); bubFlyEl.appendChild(gB);
                        requestAnimationFrame(function() {
                            requestAnimationFrame(function() {
                                gA.style.left = (rectB.left - wrapRect.left) + 'px';
                                gB.style.left = (rectA.left - wrapRect.left) + 'px';
                            });
                        });
                        setTimeout(function() {
                            bubAnimating = false;
                            bubStepBtn.disabled = false;
                            bubStepBtn.style.opacity = '';
                            if (gA.parentNode) gA.parentNode.removeChild(gA);
                            if (gB.parentNode) gB.parentNode.removeChild(gB);
                            var tmp = bubState.arr[idxA]; bubState.arr[idxA] = bubState.arr[idxB]; bubState.arr[idxB] = tmp;
                            bubAdvanceJ();
                            renderBubArr();
                        }, 550);
                    })(a, b);
                }
            }

            function bubReset() {
                bubState = { arr: bubInitArr.slice(), pass: 0, j: 0, phase: 'compare', done: false };
                bubAnimating = false;
                bubStepBtn.disabled = false;
                bubStepBtn.style.opacity = '';
                bubMsg.textContent = '▶ Click Step to start Bubble Sort!';
                renderBubArr();
            }

            container.querySelector('#sort-demo-bub-step').addEventListener('click', bubStep);
            container.querySelector('#sort-demo-bub-reset').addEventListener('click', bubReset);
            renderBubArr();
        }

        // ── Speed Race Demo ──
        {
            var raceInitArr = [64, 34, 25, 12, 22, 11, 90];

            function renderRaceArr(elId, arr, highlights) {
                var el = container.querySelector('#' + elId);
                if (!el) return;
                el.innerHTML = arr.map(function(v, idx) {
                    var cls = 'str-char-box';
                    var extra = 'font-size:0.78rem;min-width:28px;padding:4px 6px;';
                    if (highlights && highlights.sorted && idx < highlights.sorted) cls += ' matched';
                    if (highlights && highlights.active && highlights.active.indexOf(idx) >= 0) extra += 'border-color:var(--yellow);box-shadow:0 0 6px var(--yellow);';
                    return '<div class="' + cls + '" style="' + extra + '">' + v + '</div>';
                }).join('');
            }

            // Pre-compute all race steps once
            var raceSelSteps = [], raceInsSteps = [], raceBubSteps = [];
            var raceAllSteps = []; // unified steps array (one per tick)

            function raceBuildSteps() {
                raceSelSteps = []; raceInsSteps = []; raceBubSteps = [];

                // Selection sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 0; i < a.length - 1; i++) {
                        var mi = i;
                        for (var j = i + 1; j < a.length; j++) {
                            raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length + 1, swp: sw, sorted: i, active: [mi, j] });
                            if (a[j] < a[mi]) mi = j;
                        }
                        if (mi !== i) { var t = a[i]; a[i] = a[mi]; a[mi] = t; sw++; }
                        raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length + 1, swp: sw, sorted: i + 1, active: [] });
                    }
                    raceSelSteps.push({ arr: a.slice(), cmp: raceSelSteps.length, swp: sw, sorted: a.length, active: [] });
                })();

                // Insertion sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 1; i < a.length; i++) {
                        var key = a[i], j = i - 1;
                        while (j >= 0 && a[j] > key) {
                            raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length + 1, swp: sw, sorted: i, active: [j, j + 1] });
                            a[j + 1] = a[j]; j--; sw++;
                        }
                        raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length + 1, swp: sw, sorted: i, active: [j + 1] });
                        a[j + 1] = key;
                    }
                    raceInsSteps.push({ arr: a.slice(), cmp: raceInsSteps.length, swp: sw, sorted: a.length, active: [] });
                })();

                // Bubble sort steps
                (function() {
                    var a = raceInitArr.slice(), sw = 0;
                    for (var i = 0; i < a.length - 1; i++) {
                        for (var j = 0; j < a.length - 1 - i; j++) {
                            raceBubSteps.push({ arr: a.slice(), cmp: raceBubSteps.length + 1, swp: sw, sorted: a.length - i, active: [j, j + 1] });
                            if (a[j] > a[j + 1]) { var t = a[j]; a[j] = a[j + 1]; a[j + 1] = t; sw++; }
                        }
                    }
                    raceBubSteps.push({ arr: a.slice(), cmp: raceBubSteps.length, swp: sw, sorted: 0, active: [] });
                })();

                var maxLen = Math.max(raceSelSteps.length, raceInsSteps.length, raceBubSteps.length);
                raceAllSteps = [];
                for (var t = 0; t < maxLen; t++) {
                    raceAllSteps.push(t);
                }
            }

            var raceStep = -1;

            function raceRenderStep(idx) {
                var maxLen = raceAllSteps.length;
                var si = Math.min(idx, raceSelSteps.length - 1);
                var ii = Math.min(idx, raceInsSteps.length - 1);
                var bi = Math.min(idx, raceBubSteps.length - 1);
                var ss = raceSelSteps[si], is2 = raceInsSteps[ii], bs = raceBubSteps[bi];
                renderRaceArr('sort-demo-race-sel', ss.arr, { sorted: ss.sorted, active: ss.active });
                container.querySelector('#sort-demo-race-sel-cmp').textContent = ss.cmp;
                container.querySelector('#sort-demo-race-sel-swp').textContent = ss.swp;
                renderRaceArr('sort-demo-race-ins', is2.arr, { sorted: is2.sorted, active: is2.active });
                container.querySelector('#sort-demo-race-ins-cmp').textContent = is2.cmp;
                container.querySelector('#sort-demo-race-ins-swp').textContent = is2.swp;
                renderRaceArr('sort-demo-race-bub', bs.arr, { sorted: bs.sorted, active: bs.active });
                container.querySelector('#sort-demo-race-bub-cmp').textContent = bs.cmp;
                container.querySelector('#sort-demo-race-bub-swp').textContent = bs.swp;
            }

            function raceUpdateUI() {
                var counterEl = container.querySelector('#sort-demo-race-counter');
                var msgEl = container.querySelector('#sort-demo-race-msg');
                var prevBtn = container.querySelector('#sort-demo-race-prev');
                var nextBtn = container.querySelector('#sort-demo-race-next');
                var maxLen = raceAllSteps.length;

                if (raceStep < 0) {
                    counterEl.textContent = 'Before Start';
                    msgEl.textContent = '\u25B6 Click "Next \u2192" to compare all three sorts!';
                    renderRaceArr('sort-demo-race-sel', raceInitArr, {});
                    renderRaceArr('sort-demo-race-ins', raceInitArr, {});
                    renderRaceArr('sort-demo-race-bub', raceInitArr, {});
                    container.querySelector('#sort-demo-race-sel-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-sel-swp').textContent = '0';
                    container.querySelector('#sort-demo-race-ins-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-ins-swp').textContent = '0';
                    container.querySelector('#sort-demo-race-bub-cmp').textContent = '0';
                    container.querySelector('#sort-demo-race-bub-swp').textContent = '0';
                } else {
                    counterEl.textContent = (raceStep + 1) + ' / ' + maxLen;
                    raceRenderStep(raceStep);
                    if (raceStep >= maxLen - 1) {
                        var selF = raceSelSteps[raceSelSteps.length - 1], insF = raceInsSteps[raceInsSteps.length - 1], bubF = raceBubSteps[raceBubSteps.length - 1];
                        msgEl.textContent = 'Done! Selection: cmp ' + selF.cmp + ' \u00b7 swaps ' + selF.swp + ' | Insertion: cmp ' + insF.cmp + ' \u00b7 shifts ' + insF.swp + ' | Bubble: cmp ' + bubF.cmp + ' \u00b7 swaps ' + bubF.swp;
                    } else {
                        msgEl.textContent = 'Race in progress... all three sorts advance one step at a time.';
                    }
                }
                prevBtn.disabled = raceStep < 0;
                nextBtn.disabled = raceStep >= maxLen - 1;
            }

            function raceReset() {
                raceStep = -1;
                raceUpdateUI();
            }

            raceBuildSteps();

            container.querySelector('#sort-demo-race-next').addEventListener('click', function() {
                if (raceStep < raceAllSteps.length - 1) { raceStep++; raceUpdateUI(); }
            });
            container.querySelector('#sort-demo-race-prev').addEventListener('click', function() {
                if (raceStep >= 0) { raceStep--; raceUpdateUI(); }
            });
            container.querySelector('#sort-demo-race-reset').addEventListener('click', raceReset);
            raceReset();
        }

        // ── Merge Sort Mini Demo (Tree Visualization) ──
        {
            var mergeInitArr = [38, 27, 43, 3, 9, 82, 10];
            var mergeSteps = [];
            var mergeStepIdx = -1;
            var mergeVizEl = container.querySelector('#sort-demo-merge-viz');
            var mergeMsg = container.querySelector('#sort-demo-merge-msg');
            var mergeStepBtn = container.querySelector('#sort-demo-merge-step');

            var mergeTree = null;
            var mergeNodeId = 0;

            function mergeBuildTree(arr) {
                var node = { arr: arr.slice(), left: null, right: null, merged: null, id: mergeNodeId++ };
                if (arr.length <= 1) { node.merged = arr.slice(); return node; }
                var mid = Math.floor(arr.length / 2);
                node.left = mergeBuildTree(arr.slice(0, mid));
                node.right = mergeBuildTree(arr.slice(mid));
                return node;
            }

            function mergeGetLevels(root) {
                var levels = [];
                var queue = [{ node: root, depth: 0 }];
                while (queue.length) {
                    var item = queue.shift();
                    if (!levels[item.depth]) levels[item.depth] = [];
                    levels[item.depth].push(item.node);
                    if (item.node.left) queue.push({ node: item.node.left, depth: item.depth + 1 });
                    if (item.node.right) queue.push({ node: item.node.right, depth: item.depth + 1 });
                }
                return levels;
            }

            function mergeBuildSteps() {
                mergeSteps = [];
                mergeNodeId = 0;
                mergeTree = mergeBuildTree(mergeInitArr);
                var levels = mergeGetLevels(mergeTree);

                mergeSteps.push({ type: 'init', visibleDepth: 0, activeId: -1, mergeDetail: null, desc: 'Initial array: [' + mergeInitArr.join(', ') + ']. We will split it in half repeatedly!' });

                for (var d = 1; d < levels.length; d++) {
                    mergeSteps.push({ type: 'split', visibleDepth: d, activeId: -1, mergeDetail: null, desc: 'Split (level ' + d + '): divide each group in half \u2192 ' + levels[d].map(function(n) { return '[' + n.arr.join(',') + ']'; }).join('  ') });
                }

                function mergeCollect(node) {
                    if (!node.left || !node.right) return;
                    mergeCollect(node.left);
                    mergeCollect(node.right);
                    var a = node.left.merged, b = node.right.merged;
                    mergeSteps.push({ type: 'mergeStart', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: null, desc: 'Merge: comparing [' + a.join(',') + '] and [' + b.join(',') + ']' });
                    var result = [], ai = 0, bi = 0;
                    while (ai < a.length && bi < b.length) {
                        var pick = a[ai] <= b[bi] ? 'left' : 'right';
                        var pickDesc = pick === 'left'
                            ? a[ai] + ' \u2264 ' + b[bi] + ' \u2192 pick left(' + a[ai] + ')'
                            : b[bi] + ' < ' + a[ai] + ' \u2192 pick right(' + b[bi] + ')';
                        mergeSteps.push({ type: 'mergeCompare', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: { left: a.slice(), right: b.slice(), li: ai, ri: bi, result: result.slice(), pick: pick }, desc: 'Compare: ' + pickDesc });
                        if (pick === 'left') { result.push(a[ai]); ai++; }
                        else { result.push(b[bi]); bi++; }
                    }
                    while (ai < a.length) { result.push(a[ai]); ai++; }
                    while (bi < b.length) { result.push(b[bi]); bi++; }
                    node.merged = result;
                    mergeSteps.push({ type: 'mergeDone', visibleDepth: levels.length - 1, activeId: node.id, focusIds: [node.id, node.left.id, node.right.id], mergeDetail: null, desc: 'Merge complete! \u2192 [' + result.join(', ') + ']' });
                }
                mergeCollect(mergeTree);
                mergeSteps.push({ type: 'done', visibleDepth: 0, activeId: mergeTree.id, mergeDetail: null, desc: 'Sorted! [' + mergeTree.merged.join(', ') + '] \u2014 O(n log n) time, O(n) extra memory' });
            }

            function renderMergeTreeLevel(nodes, step) {
                var html = '';
                var hasFocus = step.focusIds && step.focusIds.length > 0;
                for (var i = 0; i < nodes.length; i++) {
                    var n = nodes[i];
                    var isMerged = n.merged !== null;
                    var isActive = step.activeId === n.id;
                    var isDone = step.type === 'done';
                    var isFocused = !hasFocus || step.focusIds.indexOf(n.id) >= 0;
                    var dimStyle = (!isFocused && !isDone) ? 'opacity:0.3;' : '';
                    var vals = isMerged ? n.merged : n.arr;
                    var borderColor = 'var(--bg3)';
                    var shadow = '';
                    if (isDone) { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                    else if (isActive && step.type === 'mergeDone') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                    else if (isActive && (step.type === 'mergeStart' || step.type === 'mergeCompare')) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                    html += '<div style="display:flex;gap:3px;padding:4px 8px;border-radius:8px;border:2px solid ' + borderColor + ';background:var(--bg2);' + shadow + dimStyle + 'transition:opacity 0.3s;" data-merge-node="' + n.id + '">';
                    for (var j = 0; j < vals.length; j++) {
                        var ecls = 'str-char-box';
                        var estyle = 'min-width:28px;padding:3px 6px;font-size:0.82rem;';
                        if (isDone || (isActive && step.type === 'mergeDone')) ecls += ' matched';
                        html += '<div class="' + ecls + '" style="' + estyle + '">' + vals[j] + '</div>';
                    }
                    html += '</div>';
                }
                return html;
            }

            function renderMergeViz(step) {
                if (!step) { mergeVizEl.innerHTML = ''; return; }
                var levels = mergeGetLevels(mergeTree);
                var maxDepth = step.visibleDepth;
                if (step.type === 'mergeStart' || step.type === 'mergeCompare' || step.type === 'mergeDone' || step.type === 'done') {
                    maxDepth = levels.length - 1;
                }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:fit-content;">';
                for (var d = 0; d <= maxDepth && d < levels.length; d++) {
                    html += '<div style="display:flex;align-items:center;gap:10px;width:100%;justify-content:center;">';
                    html += '<span style="font-size:0.65rem;color:var(--text3);min-width:14px;text-align:right;">L' + d + '</span>';
                    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;">';
                    html += renderMergeTreeLevel(levels[d], step);
                    html += '</div></div>';
                    if (d < maxDepth && d + 1 < levels.length) {
                        html += '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">';
                        var connectors = [];
                        for (var ni = 0; ni < levels[d].length; ni++) {
                            if (levels[d][ni].left) connectors.push('\u2571\u2572');
                            else connectors.push('\u2502');
                        }
                        html += connectors.join('&nbsp;&nbsp;&nbsp;&nbsp;');
                        html += '</div>';
                    }
                }

                if (step.mergeDetail) {
                    var d2 = step.mergeDetail;
                    var leftVal = d2.left[d2.li];
                    var rightVal = d2.right[d2.ri];
                    var pickedVal = d2.pick === 'left' ? leftVal : rightVal;
                    var isLeftSmaller = d2.pick === 'left';
                    html += '<div style="margin-top:12px;padding:14px 18px;border:2px solid var(--yellow);border-radius:10px;background:var(--bg2);">';
                    // Compare area: left value vs right value
                    html += '<div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:12px;">';
                    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                    html += '<span style="font-size:0.65rem;color:var(--accent);font-weight:700;">Left</span>';
                    html += '<div class="str-char-box" style="min-width:36px;padding:6px 10px;font-size:1rem;font-weight:700;' + (isLeftSmaller ? 'border-color:var(--green);box-shadow:0 0 12px var(--green);background:rgba(0,184,148,0.15);' : 'border-color:var(--bg3);') + '">' + leftVal + '</div>';
                    if (isLeftSmaller) html += '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">✓ Smaller!</span>';
                    html += '</div>';
                    html += '<span style="font-size:1.2rem;font-weight:700;color:var(--text3);">vs</span>';
                    html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">';
                    html += '<span style="font-size:0.65rem;color:var(--yellow);font-weight:700;">Right</span>';
                    html += '<div class="str-char-box" style="min-width:36px;padding:6px 10px;font-size:1rem;font-weight:700;' + (!isLeftSmaller ? 'border-color:var(--green);box-shadow:0 0 12px var(--green);background:rgba(0,184,148,0.15);' : 'border-color:var(--bg3);') + '">' + rightVal + '</div>';
                    if (!isLeftSmaller) html += '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">✓ Smaller!</span>';
                    html += '</div>';
                    html += '</div>';
                    // Arrow → Result
                    html += '<div style="text-align:center;color:var(--green);font-size:0.9rem;margin-bottom:8px;">↓ Add to result</div>';
                    // Result array
                    html += '<div style="display:flex;gap:6px;align-items:center;justify-content:center;">';
                    html += '<span style="font-size:0.72rem;color:var(--green);font-weight:700;">Result</span>';
                    for (var r = 0; r < d2.result.length; r++) {
                        html += '<div class="str-char-box matched" style="min-width:28px;padding:3px 6px;font-size:0.82rem;">' + d2.result[r] + '</div>';
                    }
                    html += '<div class="str-char-box" style="min-width:28px;padding:3px 6px;font-size:0.82rem;border-color:var(--green);box-shadow:0 0 10px var(--green);background:rgba(0,184,148,0.15);">' + pickedVal + '</div>';
                    html += '</div>';
                    html += '</div>';
                }

                html += '</div>';
                mergeVizEl.innerHTML = html;
            }

            function mergeResetTree() {
                function resetNode(node) {
                    if (!node) return;
                    if (node.left || node.right) node.merged = null;
                    else node.merged = node.arr.slice();
                    resetNode(node.left);
                    resetNode(node.right);
                }
                resetNode(mergeTree);
            }

            function mergeFindNode(node, id) {
                if (!node) return null;
                if (node.id === id) return node;
                return mergeFindNode(node.left, id) || mergeFindNode(node.right, id);
            }

            function mergeApplyStepsUpTo(idx) {
                mergeResetTree();
                for (var si = 0; si <= idx; si++) {
                    var s = mergeSteps[si];
                    if (s.type === 'mergeDone') {
                        var nd = mergeFindNode(mergeTree, s.activeId);
                        if (nd && nd.left && nd.right && nd.left.merged && nd.right.merged) {
                            var a = nd.left.merged, b = nd.right.merged;
                            var result = [], ai = 0, bi = 0;
                            while (ai < a.length && bi < b.length) {
                                if (a[ai] <= b[bi]) { result.push(a[ai]); ai++; }
                                else { result.push(b[bi]); bi++; }
                            }
                            while (ai < a.length) { result.push(a[ai]); ai++; }
                            while (bi < b.length) { result.push(b[bi]); bi++; }
                            nd.merged = result;
                        }
                    }
                }
            }

            function mergeStep() {
                if (mergeStepIdx >= mergeSteps.length - 1) return;
                mergeStepIdx++;
                mergeApplyStepsUpTo(mergeStepIdx);
                var s = mergeSteps[mergeStepIdx];
                mergeMsg.textContent = s.desc;
                renderMergeViz(s);
            }

            function mergeReset() {
                mergeStepIdx = -1;
                mergeResetTree();
                mergeBuildSteps();
                mergeMsg.textContent = '\u25B6 Press Step to start Merge Sort!';
                mergeVizEl.innerHTML = '';
            }

            mergeBuildSteps();
            mergeStepBtn.addEventListener('click', mergeStep);
            container.querySelector('#sort-demo-merge-reset').addEventListener('click', mergeReset);
        }

        // ── Quick Sort Mini Demo (Tree Visualization) ──
        {
            var quickInitArr = [38, 27, 43, 3, 9, 82, 10];
            var quickSteps = [];
            var quickStepIdx = -1;
            var quickVizEl = container.querySelector('#sort-demo-quick-viz');
            var quickMsg = container.querySelector('#sort-demo-quick-msg');
            var quickStepBtn = container.querySelector('#sort-demo-quick-step');

            var quickTree = null;
            var quickNodeId = 0;

            function quickBuildTree(arr, depth) {
                var node = { arr: arr.slice(), pivot: null, left: null, pivotNode: null, right: null, sorted: null, id: quickNodeId++, depth: depth };
                if (arr.length <= 1) { node.sorted = arr.slice(); return node; }
                var pivotIdx = Math.floor(arr.length / 2);
                var pivot = arr[pivotIdx];
                node.pivot = pivot;
                var leftArr = [], equalArr = [], rightArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] < pivot) leftArr.push(arr[i]);
                    else if (arr[i] > pivot) rightArr.push(arr[i]);
                    else equalArr.push(arr[i]);
                }
                node.left = quickBuildTree(leftArr, depth + 1);
                node.pivotNode = { arr: equalArr.slice(), sorted: equalArr.slice(), id: quickNodeId++, depth: depth + 1, pivot: null, left: null, pivotNode: null, right: null };
                node.right = quickBuildTree(rightArr, depth + 1);
                return node;
            }

            function quickBuildSteps() {
                quickSteps = [];
                quickNodeId = 0;
                quickTree = quickBuildTree(quickInitArr, 0);

                quickSteps.push({ type: 'init', activeId: -1, scanDetail: null, desc: 'Initial array: [' + quickInitArr.join(', ') + ']. Starting Quick Sort!' });

                function processNode(node, label) {
                    if (node.arr.length <= 1) {
                        if (node.arr.length === 1) {
                            node.sorted = node.arr.slice();
                            quickSteps.push({ type: 'base', activeId: node.id, scanDetail: null, desc: label + '[' + node.arr[0] + '] \u2014 a single element is already sorted!' });
                        }
                        return;
                    }
                    quickSteps.push({ type: 'choose', activeId: node.id, scanDetail: null, desc: label + 'Array [' + node.arr.join(', ') + ']: choose pivot = ' + node.pivot + ' (middle element).' });

                    var leftSoFar = [], equalSoFar = [], rightSoFar = [];
                    for (var i = 0; i < node.arr.length; i++) {
                        var v = node.arr[i];
                        var side = v < node.pivot ? 'left' : (v > node.pivot ? 'right' : 'equal');
                        if (side === 'left') leftSoFar.push(v);
                        else if (side === 'right') rightSoFar.push(v);
                        else equalSoFar.push(v);
                        quickSteps.push({
                            type: 'scan', activeId: node.id,
                            scanDetail: { sub: node.arr, pivot: node.pivot, scanIdx: i, left: leftSoFar.slice(), right: rightSoFar.slice(), equal: equalSoFar.slice() },
                            desc: v + (side === 'left' ? ' < ' + node.pivot + ' \u2192 goes left' : (side === 'right' ? ' > ' + node.pivot + ' \u2192 goes right' : ' == ' + node.pivot + ' \u2192 pivot group'))
                        });
                    }

                    quickSteps.push({ type: 'partitioned', activeId: node.id, scanDetail: null, desc: 'Partition done! Left[' + node.left.arr.join(',') + '] | Pivot[' + node.pivotNode.arr.join(',') + '] | Right[' + node.right.arr.join(',') + ']' });

                    processNode(node.left, 'Left part: ');
                    processNode(node.right, 'Right part: ');

                    var sortedLeft = node.left.sorted || [];
                    var sortedRight = node.right.sorted || [];
                    var pivotArr = node.pivotNode.sorted || [];
                    node.sorted = sortedLeft.concat(pivotArr).concat(sortedRight);
                    quickSteps.push({ type: 'combined', activeId: node.id, scanDetail: null, desc: 'Combine: [' + sortedLeft.join(',') + '] + [' + pivotArr.join(',') + '] + [' + sortedRight.join(',') + '] = [' + node.sorted.join(', ') + ']' });
                }

                processNode(quickTree, '');
                quickSteps.push({ type: 'done', activeId: quickTree.id, scanDetail: null, desc: 'Sorted! [' + quickTree.sorted.join(', ') + '] \u2014 Average O(n log n)' });
            }

            function renderQuickNodeBox(node, step, isPivotChild) {
                var isActive = step.activeId === node.id;
                var isSorted = node.sorted !== null;
                var isDone = step.type === 'done';
                var vals = isSorted ? node.sorted : node.arr;
                var borderColor = 'var(--bg3)';
                var shadow = '';
                var pivotLabel = '';
                if (isDone) { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                else if (isActive && step.type === 'combined') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 10px var(--green);'; }
                else if (isActive && step.type === 'choose') { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                else if (isActive && (step.type === 'scan' || step.type === 'partitioned')) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 8px var(--yellow);'; }
                else if (isActive && step.type === 'base') { borderColor = 'var(--green)'; shadow = 'box-shadow:0 0 8px var(--green);'; }
                if (isPivotChild) { borderColor = 'var(--yellow)'; shadow = 'box-shadow:0 0 6px var(--yellow);'; pivotLabel = '<div style="font-size:0.6rem;color:var(--yellow);font-weight:700;text-align:center;">pivot</div>'; }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div style="display:flex;gap:3px;padding:4px 8px;border-radius:8px;border:2px solid ' + borderColor + ';background:var(--bg2);' + shadow + '">';
                for (var j = 0; j < vals.length; j++) {
                    var ecls = 'str-char-box';
                    var estyle = 'min-width:28px;padding:3px 6px;font-size:0.82rem;';
                    if (isDone || (isActive && step.type === 'combined') || (isActive && step.type === 'base')) ecls += ' matched';
                    html += '<div class="' + ecls + '" style="' + estyle + '">' + vals[j] + '</div>';
                }
                if (vals.length === 0) html += '<span style="color:var(--text3);font-size:0.75rem;">empty</span>';
                html += '</div>' + pivotLabel + '</div>';
                return html;
            }

            function renderQuickViz(step) {
                if (!step) { quickVizEl.innerHTML = ''; return; }

                var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:fit-content;">';

                function collectVisible(node) {
                    if (!node) return [];
                    var result = [{ node: node, children: [] }];
                    if (node._expanded) {
                        var leftChildren = collectVisible(node.left);
                        var pivotChildren = node.pivotNode ? [{ node: node.pivotNode, children: [], isPivot: true }] : [];
                        var rightChildren = collectVisible(node.right);
                        result[0].children = leftChildren.concat(pivotChildren).concat(rightChildren);
                    }
                    return result;
                }

                function renderLevel(items, step, depth) {
                    if (!items.length) return '';
                    var h = '<div style="display:flex;align-items:flex-start;gap:10px;width:100%;justify-content:center;">';
                    h += '<span style="font-size:0.65rem;color:var(--text3);min-width:14px;text-align:right;">L' + depth + '</span>';
                    h += '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:nowrap;">';
                    for (var i = 0; i < items.length; i++) {
                        h += renderQuickNodeBox(items[i].node, step, items[i].isPivot || false);
                    }
                    h += '</div></div>';
                    var hasChildren = items.some(function(it) { return it.children && it.children.length > 0; });
                    if (hasChildren) {
                        h += '<div style="text-align:center;color:var(--text3);font-size:0.7rem;line-height:1;letter-spacing:2px;">';
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].children && items[i].children.length > 0) h += '\u2571\u2502\u2572';
                            else h += '\u2502';
                            if (i < items.length - 1) h += '&nbsp;&nbsp;';
                        }
                        h += '</div>';
                        var nextItems = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].children) nextItems = nextItems.concat(items[i].children);
                        }
                        h += renderLevel(nextItems, step, depth + 1);
                    }
                    return h;
                }

                var tree = collectVisible(quickTree);
                html += renderLevel(tree, step, 0);

                if (step.scanDetail) {
                    var sd = step.scanDetail;
                    html += '<div style="margin-top:12px;padding:10px 16px;border:2px solid var(--yellow);border-radius:10px;background:var(--bg2);">';
                    html += '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;">';
                    for (var i = 0; i < sd.sub.length; i++) {
                        var ex = '';
                        if (i === sd.scanIdx) ex = 'border-color:var(--accent);box-shadow:0 0 10px var(--accent);transform:scale(1.1);';
                        else if (i < sd.scanIdx) ex = 'opacity:0.4;';
                        html += '<div class="str-char-box" style="min-width:28px;padding:3px 6px;font-size:0.82rem;' + ex + '">' + sd.sub[i] + '</div>';
                    }
                    html += '</div>';
                    html += '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--accent);font-weight:700;margin-bottom:3px;">Left (&lt;' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--accent);border-radius:8px;">';
                    sd.left.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;">' + v + '</div>'; });
                    html += '</div></div>';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--yellow);font-weight:700;margin-bottom:3px;">Pivot (=' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--yellow);border-radius:8px;">';
                    sd.equal.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;border-color:var(--yellow);">' + v + '</div>'; });
                    html += '</div></div>';
                    html += '<div style="text-align:center;"><div style="font-size:0.68rem;color:var(--red);font-weight:700;margin-bottom:3px;">Right (&gt;' + sd.pivot + ')</div><div style="display:flex;gap:3px;justify-content:center;min-height:30px;padding:3px 6px;border:1.5px dashed var(--red, #e17055);border-radius:8px;">';
                    sd.right.forEach(function(v) { html += '<div class="str-char-box" style="font-size:0.78rem;min-width:26px;padding:2px 4px;">' + v + '</div>'; });
                    html += '</div></div></div></div>';
                }

                html += '</div>';
                quickVizEl.innerHTML = html;
            }

            function quickResetExpanded(node) {
                if (!node) return;
                node._expanded = false;
                quickResetExpanded(node.left);
                quickResetExpanded(node.pivotNode);
                quickResetExpanded(node.right);
            }

            function quickApplyStepsUpTo(idx) {
                quickResetExpanded(quickTree);
                function resetSorted(n) {
                    if (!n) return;
                    if (n.left || n.right) n.sorted = null;
                    else if (n.arr.length <= 1) n.sorted = n.arr.slice();
                    resetSorted(n.left);
                    resetSorted(n.pivotNode);
                    resetSorted(n.right);
                }
                resetSorted(quickTree);

                for (var si = 0; si <= idx; si++) {
                    var s = quickSteps[si];
                    if (s.type === 'partitioned') {
                        var nd = quickFindNode(quickTree, s.activeId);
                        if (nd) nd._expanded = true;
                    } else if (s.type === 'combined') {
                        var nd2 = quickFindNode(quickTree, s.activeId);
                        if (nd2 && nd2.left && nd2.right && nd2.pivotNode) {
                            var sl = nd2.left.sorted || [];
                            var sr = nd2.right.sorted || [];
                            var sp = nd2.pivotNode.sorted || [];
                            nd2.sorted = sl.concat(sp).concat(sr);
                        }
                    } else if (s.type === 'base') {
                        var nd3 = quickFindNode(quickTree, s.activeId);
                        if (nd3) nd3.sorted = nd3.arr.slice();
                    } else if (s.type === 'done') {
                        var nd4 = quickFindNode(quickTree, s.activeId);
                        if (nd4 && !nd4.sorted) {
                            var sl2 = nd4.left ? (nd4.left.sorted || []) : [];
                            var sr2 = nd4.right ? (nd4.right.sorted || []) : [];
                            var sp2 = nd4.pivotNode ? (nd4.pivotNode.sorted || []) : [];
                            nd4.sorted = sl2.concat(sp2).concat(sr2);
                        }
                    }
                }
            }

            function quickFindNode(node, id) {
                if (!node) return null;
                if (node.id === id) return node;
                return quickFindNode(node.left, id) || quickFindNode(node.pivotNode, id) || quickFindNode(node.right, id);
            }

            function quickStep() {
                if (quickStepIdx >= quickSteps.length - 1) return;
                quickStepIdx++;
                var s = quickSteps[quickStepIdx];
                quickApplyStepsUpTo(quickStepIdx);
                quickMsg.textContent = s.desc;
                renderQuickViz(s);
            }

            function quickReset() {
                quickStepIdx = -1;
                quickResetExpanded(quickTree);
                quickBuildSteps();
                quickMsg.textContent = '\u25B6 Press Step to start Quick Sort!';
                quickVizEl.innerHTML = '';
            }

            quickBuildSteps();
            quickStepBtn.addEventListener('click', quickStep);
            container.querySelector('#sort-demo-quick-reset').addEventListener('click', quickReset);
        }

        // ── Custom Sort Mini Demo ──
        {
            var customData = [
                { name: 'Alice', score: 72 },
                { name: 'Bob', score: 95 },
                { name: 'Charlie', score: 88 },
                { name: 'Dana', score: 65 },
                { name: 'Eve', score: 91 },
                { name: 'Frank', score: 80 }
            ];
            var customOriginal = customData.slice();
            var customArrEl = container.querySelector('#sort-demo-custom-arr');
            var customMsg = container.querySelector('#sort-demo-custom-msg');
            var customBtns = container.querySelector('#sort-demo-custom-btns');
            var customActiveKey = null;

            function renderCustomArr(data, highlightKey) {
                customArrEl.style.opacity = '0';
                setTimeout(function() {
                    customArrEl.innerHTML = data.map(function(s, i) {
                        var keyVal = highlightKey === 'score' ? s.score + 'pts'
                                   : highlightKey === 'length' ? s.name.length + ' chars'
                                   : '';
                        return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' +
                            '<div class="str-char-box" style="min-width:56px;padding:8px 10px;font-size:0.88rem;' +
                            'border-color:var(--accent);box-shadow:0 0 6px rgba(108,92,231,0.15);">' +
                            '<strong>' + s.name + '</strong><br>' +
                            '<span style="font-size:0.78rem;color:var(--text2);">' + s.score + 'pts</span></div>' +
                            (keyVal ? '<span style="font-size:0.72rem;color:var(--accent);font-weight:600;">key: ' + keyVal + '</span>' : '') +
                            '</div>';
                    }).join('');
                    customArrEl.style.opacity = '1';
                }, 180);
            }

            function customSortBy(key) {
                var sorted = customData.slice();
                if (key === 'score') {
                    sorted.sort(function(a, b) { return a.score - b.score; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: x.score)</code> — sorted by score, lowest first!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.score < b.score; })</code> — sorted by score, lowest first!</span>';
                } else if (key === 'name') {
                    sorted.sort(function(a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: x.name)</code> — sorted alphabetically!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.name < b.name; })</code> — sorted alphabetically!</span>';
                } else if (key === 'length') {
                    sorted.sort(function(a, b) { return a.name.length - b.name.length; });
                    customMsg.innerHTML = '<span class="lang-py"><code>sort(key=lambda x: len(x.name))</code> — sorted by name length, shortest first!</span>' +
                        '<span class="lang-cpp"><code>sort(…, [](auto& a, auto& b){ return a.name.size() < b.name.size(); })</code> — sorted by name length, shortest first!</span>';
                } else {
                    sorted = customOriginal.slice();
                    customMsg.textContent = 'Back to the original order.';
                }
                customData = sorted;
                renderCustomArr(sorted, key === 'reset' ? null : key);
            }

            renderCustomArr(customOriginal, null);

            customBtns.addEventListener('click', function(e) {
                var btn = e.target.closest('[data-key]');
                if (!btn) return;
                var key = btn.getAttribute('data-key');
                customActiveKey = key === 'reset' ? null : key;
                customBtns.querySelectorAll('.concept-demo-btn:not(.danger)').forEach(function(b) {
                    b.style.background = b.getAttribute('data-key') === customActiveKey ? 'var(--accent)' : '';
                    b.style.color = b.getAttribute('data-key') === customActiveKey ? 'white' : '';
                });
                customSortBy(key);
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 Click Next to start</div>';
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
                if (descEl) descEl.innerHTML = '\u25B6 Click Next to start';
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
            setTimeout(function() { steps[current].action(); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (current < 0) return;
            current--;
            updateUI();
            setTimeout(function() {
                if (current >= 0) {
                    steps[current].action();
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

    // ── Bar chart render utility ──
    _renderBars(el, arr, sortedUpTo, comparing, minIdx) {
        var maxVal = Math.max.apply(null, arr);
        el.innerHTML = arr.map(function(v, i) {
            var bg = 'var(--accent)';
            if (i <= sortedUpTo) bg = 'var(--green)';
            else if (i === minIdx) bg = 'var(--yellow)';
            else if (comparing && comparing.indexOf(i) >= 0) bg = 'var(--red, #e17055)';
            var h = Math.max(20, (v / maxVal) * 160);
            return '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">' +
                '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:all 0.3s;"></div></div>';
        }).join('');
    },

    // ── Cutline (boj-25305) ──
    _renderVizCutline(container) {
        var self = this;
        var DEFAULT_SCORES = [100, 76, 85, 93, 98];
        var DEFAULT_K = 2;

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Scores: <input type="text" id="sort-cut-input" value="' + DEFAULT_SCORES.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<label style="font-weight:600;">k: <input type="number" id="sort-cut-k" value="' + DEFAULT_K + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:60px;"></label>' +
                '<button class="btn btn-primary" id="sort-cut-reset">\uD83D\uDD04</button>' +
            '</div>' +
            self._createStepDesc('-cut') +
            '<div class="viz-area" style="position:relative;">' +
                '<div id="sort-bars-cut" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:220px;padding:20px 0;"></div>' +
                '<div id="sort-fly-cut" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-cut');

        var barsEl = container.querySelector('#sort-bars-cut');
        var flyEl = container.querySelector('#sort-fly-cut');

        function renderCutBars(arr, highlights) {
            var hl = highlights || {};
            var maxVal = Math.max.apply(null, arr);
            barsEl.innerHTML = arr.map(function(v, i) {
                var bg = 'var(--accent)';
                var glow = '';
                var lbl = '<span style="font-size:0.65rem;color:var(--text2);">[' + i + ']</span>';
                if (hl.answer === i) {
                    bg = 'var(--green)';
                    glow = 'box-shadow:0 0 16px var(--green);';
                    lbl = '<span style="font-size:0.6rem;color:var(--green);font-weight:700;">k=' + (i + 1) + ' \u2713</span>';
                } else if (hl.counting && hl.counting.indexOf(i) >= 0) {
                    bg = 'var(--yellow)';
                    glow = 'box-shadow:0 0 10px var(--yellow);';
                    lbl = '<span style="font-size:0.6rem;color:var(--yellow);font-weight:700;">#' + (i + 1) + '</span>';
                } else if (hl.sorted) {
                    bg = '#636e72';
                }
                var h = Math.max(20, (v / maxVal) * 160);
                return '<div id="sort-bar-cut-' + i + '" style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity 0.3s;">' +
                    '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                    '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:all 0.3s;' + glow + '"></div>' +
                    lbl + '</div>';
            }).join('');
        }

        function buildCutlineSteps(scores, k) {
            var steps = [];
            var arr = scores.slice();
            var n = arr.length;
            if (k < 1) k = 1;
            if (k > n) k = n;

            steps.push({
                description: 'Initial array: [' + arr.join(', ') + ']. N=' + n + ' scores given, top k=' + k + ' students get a prize.',
                action: function() { renderCutBars(arr, {}); }
            });

            steps.push({
                description: 'To find the top ' + k + ' students, we need to sort in descending order. Highest scores first!',
                action: function() { renderCutBars(arr, {}); }
            });

            var sorted = arr.slice().sort(function(a, b) { return b - a; });
            steps.push({
                description: 'Sorted in descending order! [' + sorted.join(', ') + ']. Now the first k elements are the prize winners.',
                action: function() { renderCutBars(sorted, { sorted: true }); }
            });

            for (var c = 0; c < k; c++) {
                (function(idx) {
                    var countArr = [];
                    for (var ci = 0; ci <= idx; ci++) countArr.push(ci);
                    var isLast = idx === k - 1;
                    var desc = '#' + (idx + 1) + ': score ' + sorted[idx] + (isLast ? ' \u2190 This is the cutline! The lowest score among prize winners.' : '');
                    steps.push({
                        description: desc,
                        action: function() {
                            renderCutBars(sorted, { sorted: true, counting: countArr, answer: isLast ? idx : -1 });
                        }
                    });
                })(c);
            }

            steps.push({
                description: 'Answer: the cutline is ' + sorted[k - 1] + '! After sorting in descending order, output the k-th element (0-indexed: arr[' + (k - 1) + ']).',
                action: function() {
                    renderCutBars(sorted, { sorted: true, answer: k - 1 });
                }
            });

            return steps;
        }

        function resetCutline() {
            var raw = container.querySelector('#sort-cut-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SCORES.slice();
            var k = parseInt(container.querySelector('#sort-cut-k').value, 10);
            if (isNaN(k) || k < 1) k = 1;
            if (k > parsed.length) k = parsed.length;
            barsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildCutlineSteps(parsed, k);
            self._initStepController(container, steps, '-cut');
        }

        container.querySelector('#sort-cut-reset').addEventListener('click', resetCutline);
        resetCutline();
    },

    // ── Selection Sort (boj-2750) ──
    _renderVizSelection(container) {
        var self = this;
        var DEFAULT_SEL_ARR = [38, 27, 43, 3, 9, 82, 10];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array: <input type="text" id="sort-sel-input" value="' + DEFAULT_SEL_ARR.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="sort-sel-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-sel') +
            '<div class="viz-area" style="position:relative;">' +
                '<div id="sort-bars-sel" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:220px;padding:20px 0;"></div>' +
                '<div id="sort-fly-sel" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-sel');

        var barsEl = container.querySelector('#sort-bars-sel');
        var flyEl = container.querySelector('#sort-fly-sel');
        var wrapEl = container.querySelector('.viz-area');

        function renderBars(arr, sortedUpTo, comparing, minIdx) {
            var maxVal = Math.max.apply(null, arr);
            barsEl.innerHTML = arr.map(function(v, i) {
                var bg = 'var(--accent)';
                var glow = '';
                if (i <= sortedUpTo) bg = 'var(--green)';
                else if (i === minIdx) { bg = 'var(--yellow)'; glow = 'box-shadow:0 0 12px var(--yellow);'; }
                else if (comparing.indexOf(i) >= 0) { bg = '#e17055'; glow = 'box-shadow:0 0 12px #e1705580;'; }
                var h = Math.max(20, (v / maxVal) * 160);
                var lbl = (i === minIdx && minIdx >= 0) ? '<span style="font-size:0.6rem;color:var(--yellow);font-weight:700;">min</span>'
                    : '<span style="font-size:0.65rem;color:var(--text2);">[' + i + ']</span>';
                return '<div id="sort-bar-sel-' + i + '" style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:opacity 0.2s;">' +
                    '<span style="font-size:0.8rem;font-weight:600;">' + v + '</span>' +
                    '<div style="width:36px;height:' + h + 'px;background:' + bg + ';border-radius:4px 4px 0 0;transition:background 0.3s;' + glow + '"></div>' +
                    lbl + '</div>';
            }).join('');
        }

        function animateSwap(beforeArr, idxA, idxB, onDone) {
            var elA = container.querySelector('#sort-bar-sel-' + idxA);
            var elB = container.querySelector('#sort-bar-sel-' + idxB);
            if (!elA || !elB) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var rectA = elA.getBoundingClientRect();
            var rectB = elB.getBoundingClientRect();
            elA.style.opacity = '0.15';
            elB.style.opacity = '0.15';
            function mkGhost(val, rect, color) {
                var g = document.createElement('div');
                g.textContent = val;
                g.style.cssText = 'position:absolute;z-index:20;width:' + rect.width + 'px;height:' + rect.height + 'px;' +
                    'left:' + (rect.left - wrapRect.left) + 'px;top:' + (rect.top - wrapRect.top) + 'px;' +
                    'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;' +
                    'background:' + color + ';color:white;border-radius:8px;' +
                    'box-shadow:0 4px 20px rgba(0,0,0,0.25);' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1);';
                return g;
            }
            var gA = mkGhost(beforeArr[idxA], rectA, '#e17055');
            var gB = mkGhost(beforeArr[idxB], rectB, 'var(--yellow)');
            flyEl.appendChild(gA);
            flyEl.appendChild(gB);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    gA.style.left = (rectB.left - wrapRect.left) + 'px';
                    gB.style.left = (rectA.left - wrapRect.left) + 'px';
                });
            });
            setTimeout(function() {
                if (gA.parentNode) gA.parentNode.removeChild(gA);
                if (gB.parentNode) gB.parentNode.removeChild(gB);
                if (onDone) onDone();
            }, 550);
        }

        function buildSelectionSteps(original) {
            var stepData = [];
            var arr = original.slice();
            var n = arr.length;

            stepData.push({ arr: arr.slice(), sortedUpTo: -1, comparing: [], minIdx: -1,
                desc: 'Initial array: [' + arr.join(', ') + ']. Starting Selection Sort!', swapInfo: null });

            for (var i = 0; i < n - 1; i++) {
                var minIdx = i;
                stepData.push({ arr: arr.slice(), sortedUpTo: i - 1, comparing: [], minIdx: i,
                    desc: 'Position ' + i + ': Finding minimum in remaining elements. Current candidate A[' + i + ']=' + arr[i], swapInfo: null });

                for (var j = i + 1; j < n; j++) {
                    var isSmaller = arr[j] < arr[minIdx];
                    var prevMin = minIdx;
                    if (isSmaller) minIdx = j;
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i - 1, comparing: [j, prevMin], minIdx: minIdx,
                        desc: isSmaller
                            ? 'A[' + j + ']=' + arr[j] + ' < current min A[' + prevMin + ']=' + arr[prevMin] + ' → New minimum! min=A[' + j + ']'
                            : 'A[' + j + ']=' + arr[j] + ' ≥ current min A[' + minIdx + ']=' + arr[minIdx] + ' → No change',
                        swapInfo: null
                    });
                }

                var beforeArr = arr.slice();
                if (i !== minIdx) {
                    var tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i, comparing: [], minIdx: -1,
                        desc: 'Swap! A[' + i + ']=' + beforeArr[i] + ' ↔ A[' + minIdx + ']=' + beforeArr[minIdx] + ' → Position ' + i + ' finalized: ' + arr[i],
                        swapInfo: { a: i, b: minIdx, beforeArr: beforeArr }
                    });
                } else {
                    stepData.push({
                        arr: arr.slice(), sortedUpTo: i, comparing: [], minIdx: -1,
                        desc: 'A[' + i + ']=' + arr[i] + ' is already the minimum! No swap needed. Position ' + i + ' finalized.',
                        swapInfo: null
                    });
                }
            }

            stepData.push({ arr: arr.slice(), sortedUpTo: n - 1, comparing: [], minIdx: -1,
                desc: 'Sort complete! [' + arr.join(', ') + ']. Selection Sort always has O(n²) time complexity.', swapInfo: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        if (st.swapInfo && dir === 'forward') {
                            renderBars(st.swapInfo.beforeArr, st.sortedUpTo - 1, [st.swapInfo.a, st.swapInfo.b], -1);
                            requestAnimationFrame(function() {
                                animateSwap(st.swapInfo.beforeArr, st.swapInfo.a, st.swapInfo.b, function() {
                                    renderBars(st.arr, st.sortedUpTo, [], -1);
                                });
                            });
                        } else {
                            renderBars(st.arr, st.sortedUpTo, st.comparing, st.minIdx);
                        }
                    }
                };
            });
        }

        function resetSelection() {
            var raw = container.querySelector('#sort-sel-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SEL_ARR.slice();
            barsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildSelectionSteps(parsed);
            self._initStepController(container, steps, '-sel');
        }

        container.querySelector('#sort-sel-reset').addEventListener('click', resetSelection);
        resetSelection();
    },

    // ── Coordinate Sort (boj-11650) ──
    _renderVizCoordSort(container) {
        var self = this;
        var DEFAULT_COORDS = [[3,4],[1,1],[1,-1],[2,2],[3,3]];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Coordinates (x y pairs): <input type="text" id="sort-coord-input" value="' + DEFAULT_COORDS.map(function(c) { return c[0] + ' ' + c[1]; }).join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="sort-coord-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-coord') +
            '<div class="viz-area" style="position:relative;">' +
                '<div style="font-weight:600;margin-bottom:8px;">Coordinate Array</div>' +
                '<div id="sort-coords" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
                '<div id="sort-fly-coord" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            self._createStepControls('-coord');

        var coordsEl = container.querySelector('#sort-coords');
        var flyEl = container.querySelector('#sort-fly-coord');
        var wrapEl = container.querySelector('.viz-area');

        function renderCoords(arr, sortedUpTo, comparingIdx, shiftIdx) {
            coordsEl.innerHTML = arr.map(function(c, i) {
                var cls = 'str-char-box';
                if (i <= sortedUpTo) cls += ' matched';
                else if (i === comparingIdx) cls += ' comparing';
                if (i === shiftIdx) cls += ' comparing';
                return '<div id="sort-coord-' + i + '" class="' + cls + '" style="min-width:60px;text-align:center;font-size:0.9rem;">(' + c[0] + ', ' + c[1] + ')</div>';
            }).join('');
        }

        function coordStr(c) { return '(' + c[0] + ',' + c[1] + ')'; }
        function coordGt(a, b) { return a[0] > b[0] || (a[0] === b[0] && a[1] > b[1]); }

        function animateMove(srcIdx, destIdx, value, onDone) {
            var srcEl = container.querySelector('#sort-coord-' + srcIdx);
            var destEl = container.querySelector('#sort-coord-' + destIdx);
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();
            srcEl.style.opacity = '0.15';
            var ghost = document.createElement('div');
            ghost.textContent = value;
            ghost.className = 'str-char-box comparing';
            ghost.style.cssText = 'position:absolute;z-index:20;min-width:60px;text-align:center;font-size:0.9rem;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.4s cubic-bezier(.4,0,.2,1),top 0.4s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                });
            });
            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 450);
        }

        function buildCoordSteps(coords) {
            var stepData = [];
            var simArr = coords.map(function(c) { return c.slice(); });
            var snap = function() { return simArr.map(function(c) { return c.slice(); }); };

            stepData.push({ arr: snap(), sortedUpTo: -1, comp: -1, shift: -1,
                desc: 'Initial coordinates: ' + simArr.map(coordStr).join(', ') + '. Starting Insertion Sort!', moveInfo: null });

            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i].slice();
                // Announce element to insert
                stepData.push({ arr: snap(), sortedUpTo: i - 1, comp: i, shift: -1,
                    desc: 'Insert ' + coordStr(key) + ' into the sorted portion.', moveInfo: null });

                var j = i - 1;
                while (j >= 0 && coordGt(simArr[j], key)) {
                    // Comparison step
                    stepData.push({ arr: snap(), sortedUpTo: i - 1, comp: i, shift: j,
                        desc: coordStr(simArr[j]) + ' > ' + coordStr(key) + ' → shift ' + coordStr(simArr[j]) + ' right',
                        moveInfo: { from: j, to: j + 1, label: coordStr(simArr[j]) } });
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                // Insertion complete step
                stepData.push({ arr: snap(), sortedUpTo: i, comp: -1, shift: -1,
                    desc: 'Inserted ' + coordStr(key) + ' at [' + (j + 1) + ']! → ' + simArr.slice(0, i + 1).map(coordStr).join(', '),
                    moveInfo: null });
            }
            stepData.push({ arr: snap(), sortedUpTo: simArr.length - 1, comp: -1, shift: -1,
                desc: 'Sort complete! ' + simArr.map(coordStr).join(', ') + ' ✓', moveInfo: null });

            return stepData.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        if (st.moveInfo && dir === 'forward') {
                            var mi = st.moveInfo;
                            renderCoords(st.arr, st.sortedUpTo, st.comp, mi.from);
                            requestAnimationFrame(function() {
                                animateMove(mi.from, mi.to, mi.label, function() {
                                    renderCoords(st.arr, st.sortedUpTo, st.comp, -1);
                                });
                            });
                        } else {
                            renderCoords(st.arr, st.sortedUpTo, st.comp, -1);
                        }
                    }
                };
            });
        }

        function resetCoord() {
            var raw = container.querySelector('#sort-coord-input').value;
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(c) { return c !== null && !isNaN(c[0]) && !isNaN(c[1]); });
            if (parsed.length < 2) parsed = DEFAULT_COORDS.map(function(c) { return c.slice(); });
            coordsEl.innerHTML = '';
            flyEl.innerHTML = '';
            var steps = buildCoordSteps(parsed);
            self._initStepController(container, steps, '-coord');
        }

        container.querySelector('#sort-coord-reset').addEventListener('click', resetCoord);
        resetCoord();
    },

    // ── Interval Merge (lc-56) ──
    _renderVizMergeIntervals(container) {
        var self = this;
        var DEFAULT_INTERVALS = [[1,3],[2,6],[8,10],[15,18]];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Intervals (start end pairs): <input type="text" id="sort-merge-input" value="' + DEFAULT_INTERVALS.map(function(iv) { return iv[0] + ' ' + iv[1]; }).join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
                '<button class="btn btn-primary" id="sort-merge-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-intv') +
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">Interval Array (sorted by start)</div>' +
                '<div id="sort-intervals" style="position:relative;min-height:60px;padding:20px 0;"></div>' +
                '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;">Merge Result</div>' +
                '<div id="sort-merged" style="position:relative;min-height:60px;padding:8px 0;"></div>' +
            '</div>' +
            self._createStepControls('-intv');

        var intervalsEl = container.querySelector('#sort-intervals');
        var mergedEl = container.querySelector('#sort-merged');
        var descEl = container.querySelector('#viz-step-desc-intv');

        function renderIntervalBar(el, intArr, highlightIdx) {
            var maxVal = 0;
            intArr.forEach(function(iv) { if (iv[1] > maxVal) maxVal = iv[1]; });
            var scale = maxVal > 0 ? Math.min(30, Math.floor(500 / maxVal)) : 30;
            el.innerHTML = intArr.map(function(iv, i) {
                var w = Math.max(40, (iv[1] - iv[0]) * scale);
                var l = iv[0] * scale;
                var bg = i === highlightIdx ? 'var(--accent)' : 'var(--green)';
                return '<div style="position:absolute;left:' + l + 'px;width:' + w + 'px;height:28px;background:' + bg + ';border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;color:white;">[' + iv[0] + ',' + iv[1] + ']</div>';
            }).join('');
        }

        function buildMergeSteps(intervals) {
            // Sort by start point first
            intervals = intervals.slice().sort(function(a, b) { return a[0] - b[0] || a[1] - b[1]; });

            var states = [];
            var merged = [];
            states.push({ intervals: intervals, merged: [], highlight: -1,
                desc: 'Intervals: ' + intervals.map(function(v) { return '[' + v + ']'; }).join(', ') + '. Already sorted by start point.' });

            merged.push(intervals[0].slice());
            states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: 0,
                desc: 'Add the first interval [' + intervals[0] + '] to the result.' });

            for (var i = 1; i < intervals.length; i++) {
                var cur = intervals[i];
                var last = merged[merged.length - 1];
                if (cur[0] <= last[1]) {
                    last[1] = Math.max(last[1], cur[1]);
                    states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                        desc: '[' + cur + '] start(' + cur[0] + ') \u2264 prev end(' + last[1] + ') \u2192 Overlap! Merged to [' + last[0] + ',' + last[1] + ']' });
                } else {
                    merged.push(cur.slice());
                    states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: i,
                        desc: '[' + cur + '] start(' + cur[0] + ') > prev end \u2192 No overlap. Add new interval!' });
                }
            }
            states.push({ intervals: intervals, merged: merged.map(function(v) { return v.slice(); }), highlight: -1,
                desc: 'Merge complete! Result: ' + merged.map(function(v) { return '[' + v + ']'; }).join(', ') + ' \u2713' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderIntervalBar(intervalsEl, st.intervals, st.highlight);
                    renderIntervalBar(mergedEl, st.merged, -1);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetMerge() {
            var raw = container.querySelector('#sort-merge-input').value;
            // Parse "start end, start end, ..." format
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(iv) { return iv !== null && !isNaN(iv[0]) && !isNaN(iv[1]) && iv[0] <= iv[1]; });
            if (parsed.length < 1) parsed = DEFAULT_INTERVALS.map(function(iv) { return iv.slice(); });
            intervalsEl.innerHTML = '';
            mergedEl.innerHTML = '';
            descEl.innerHTML = '';
            var steps = buildMergeSteps(parsed);
            self._initStepController(container, steps, '-intv');
        }

        container.querySelector('#sort-merge-reset').addEventListener('click', resetMerge);
        resetMerge();
    },

    // ── Stable Sort (boj-10814) ──
    _renderVizStableSort(container) {
        var self = this;
        var DEFAULT_STABLE = '21 Junkyu, 21 Dohyun, 20 Sunyoung, 22 Alice, 20 Bob';
        var PALETTE = ['var(--accent)', 'var(--green)', '#e17055', '#6c5ce7', 'var(--yellow)', '#00b894', '#fdcb6e', '#e84393', '#0984e3', '#636e72'];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Age Name list: <input type="text" id="sort-stable-input" value="' + DEFAULT_STABLE + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:360px;"></label>' +
                '<button class="btn btn-primary" id="sort-stable-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc('-stable') +
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">Member List (input order)</div>' +
                '<div id="sort-members" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:12px 0;"></div>' +
            '</div>' +
            self._createStepControls('-stable');

        var membersEl = container.querySelector('#sort-members');
        var descEl = container.querySelector('#viz-step-desc-stable');

        function renderMembers(arr, sortedUpTo) {
            membersEl.innerHTML = arr.map(function(m, i) {
                var cls = 'str-char-box' + (i <= sortedUpTo ? ' matched' : '');
                var color = PALETTE[m.order % PALETTE.length];
                return '<div class="' + cls + '" style="min-width:100px;text-align:center;font-size:0.85rem;border-left:3px solid ' + color + ';">' +
                    '<div style="font-weight:600;">' + m.age + '</div>' +
                    '<div style="font-size:0.75rem;color:var(--text-secondary);">' + m.name + '</div></div>';
            }).join('');
        }

        function buildStableSteps(members) {
            var stepData = [];
            var simArr = members.map(function(m) { return { age: m.age, name: m.name, order: m.order }; });
            var snap = function() { return simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }); };

            stepData.push({ arr: snap(), sortedUpTo: -1,
                desc: 'Initial input: ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '. Starting stable sort by age!' });

            // Insertion sort by age only (stable) — individual comparison steps
            for (var i = 1; i < simArr.length; i++) {
                var key = { age: simArr[i].age, name: simArr[i].name, order: simArr[i].order };
                stepData.push({ arr: snap(), sortedUpTo: i - 1,
                    desc: 'Insert ' + key.age + ' ' + key.name + ' into the sorted portion.' });

                var j = i - 1;
                while (j >= 0 && simArr[j].age > key.age) {
                    stepData.push({ arr: snap(), sortedUpTo: i - 1,
                        desc: simArr[j].age + ' ' + simArr[j].name + ' (age ' + simArr[j].age + ') > ' + key.name + ' (age ' + key.age + ') → shift right' });
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                if (j >= 0 && simArr[j].age === key.age) {
                    stepData.push({ arr: snap(), sortedUpTo: i - 1,
                        desc: simArr[j].age + ' ' + simArr[j].name + ' (age ' + simArr[j].age + ') = ' + key.age + ' → Same age! Stop here to preserve input order (stable sort)' });
                }
                simArr[j + 1] = key;
                stepData.push({ arr: snap(), sortedUpTo: i,
                    desc: key.age + ' ' + key.name + ' inserted at [' + (j + 1) + ']. Insertion complete!' });
            }

            var ageGroups = {};
            simArr.forEach(function(m) {
                if (!ageGroups[m.age]) ageGroups[m.age] = [];
                ageGroups[m.age].push(m.name);
            });
            var stableNote = '';
            Object.keys(ageGroups).forEach(function(age) {
                if (ageGroups[age].length > 1) {
                    stableNote += ' Age ' + age + ': ' + ageGroups[age].join(', ') + ' — input order is preserved.';
                }
            });
            stepData.push({ arr: snap(), sortedUpTo: simArr.length - 1,
                desc: 'Sort complete! ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '.' + (stableNote || '') + ' \u2713' });

            return stepData.map(function(st) {
                return { description: st.desc, action: function() {
                    renderMembers(st.arr, st.sortedUpTo);
                }};
            });
        }

        function parseStableInput(raw) {
            // Parse "age name, age name, ..." format
            return raw.split(',').map(function(entry, idx) {
                var parts = entry.trim().split(/\s+/);
                if (parts.length >= 2) {
                    var age = parseInt(parts[0], 10);
                    var name = parts.slice(1).join(' ');
                    if (!isNaN(age) && name) return { age: age, name: name, order: idx };
                }
                return null;
            }).filter(function(m) { return m !== null; });
        }

        function resetStable() {
            var raw = container.querySelector('#sort-stable-input').value;
            var parsed = parseStableInput(raw);
            if (parsed.length < 2) parsed = parseStableInput(DEFAULT_STABLE);
            membersEl.innerHTML = '';
            descEl.innerHTML = '';
            var steps = buildStableSteps(parsed);
            self._initStepController(container, steps, '-stable');
        }

        container.querySelector('#sort-stable-reset').addEventListener('click', resetStable);
        resetStable();
    },

    // ===== Problem Tab =====
    stages: [
        { num: 1, title: 'Cutline', desc: 'Sort and index', problemIds: ['boj-25305'] },
        { num: 2, title: 'Basic Sort', desc: 'Sort implementation and custom sorting (Bronze~Silver)', problemIds: ['boj-2750', 'boj-11650', 'boj-10814'] },
        { num: 3, title: 'Sort Applications', desc: 'Sorting-based problem solving (Medium)', problemIds: ['lc-56'] }
    ],

    problems: [
        {
            id: 'boj-25305',
            title: 'BOJ 25305 - Cutline',
            difficulty: 'bronze',
            link: 'https://www.acmicpc.net/problem/25305',
            simIntro: 'Observe how sorting scores in descending order and picking the k-th element gives us the cutline.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>N students took a coding test at Yonsei University. The top k students will receive a prize. Find the cutline score.</p>
                <p>The cutline is the lowest score among the prize winners.</p>
                <h4>Input</h4>
                <p>The first line contains the number of test takers N and the number of prize winners k, separated by a space.</p>
                <p>The second line contains each student's score x, separated by spaces.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 2\n100 76 85 93 98</pre></div>
                    <div><strong>Output</strong><pre>98</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; k &le; N &le; 1,000</li>
                    <li>1 &le; x &le; 10,000</li>
                </ul>
            `,
            hints: [
                { title: 'First thought', content: 'We need to find the top k students. What if we just line up the scores from highest to lowest?<br><strong>Sort in descending order</strong> and the highest score will be at the front!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">100</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">76</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">85</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">93</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">98</div></div><div style="text-align:center;margin:8px 0;font-size:1.2rem;">\u2193 Descending sort</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;font-size:0.9rem;">100</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;font-size:0.9rem;">98</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">93</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">85</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;font-size:0.9rem;">76</div></div>' },
                { title: 'Where to look after sorting?', content: 'After sorting in descending order, the k-th element is the lowest score among prize winners \u2014 the <strong>cutline</strong>.<br>Since array indices start at 0, the answer is <code>arr[k-1]</code>!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;align-items:flex-end;flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[0]</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">100</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--yellow);font-weight:700;">[k-1] \u2190 cutline!</div><div style="padding:6px 14px;border-radius:8px;border:2px solid var(--yellow);box-shadow:0 0 8px var(--yellow);font-weight:700;">98</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[2]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">93</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[3]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">85</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[4]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">76</div></div></div>' },
                { title: 'Ascending order works too!', content: 'What if you sorted in ascending order? Just look at the k-th element from the end!<br><span class="lang-py"><code>arr[N-k]</code> or <code>arr[-k]</code> (Python negative index)</span><span class="lang-cpp"><code>arr[N-k]</code> gives the answer</span><div style="display:flex;gap:6px;justify-content:center;margin-top:12px;align-items:flex-end;flex-wrap:wrap;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[0]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">76</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[1]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">85</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[2]</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">93</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--yellow);font-weight:700;"><span class="lang-py">[-k]</span><span class="lang-cpp">[N-k]</span> \u2190 cutline!</div><div style="padding:6px 14px;border-radius:8px;border:2px solid var(--yellow);box-shadow:0 0 8px var(--yellow);font-weight:700;">98</div></div><div style="display:flex;flex-direction:column;align-items:center;"><div style="font-size:0.65rem;color:var(--text3);">[4]</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">100</div></div></div>' },
                { title: 'Time complexity', content: 'Since N \u2264 1,000, any sort works fine. Built-in sort is O(N log N), more than enough.<div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">Method</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">Time</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">N=1000</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">O(n\u00B2) sort</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n\u00B2)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">1,000,000 \u2705</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py">sort()</span><span class="lang-cpp">sort()</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n log n)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">~10,000 \u2705\u2705</td></tr></table></div>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)  # Sort descending\nprint(scores[k - 1])  # k-th element is the cutline`,
                cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());  // Descending\n    cout << scores[k - 1] << endl;  // k-th element is the cutline\n}`
            },
            solutions: [
                {
                    approach: 'Descending sort + indexing',
                    description: 'Sort scores in descending order \u2014 the k-th element is the cutline.',
                    timeComplexity: 'O(N log N)',
                    spaceComplexity: 'O(N)',
                    get templates() { return sortingTopic.problems[0].templates; },
                    codeSteps: {
                        python: [
                            { title: 'Read Input', desc: 'Read N, k and the score array.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))' },
                            { title: 'Sort Descending', desc: 'Use reverse=True so the highest score comes first. This makes finding the top k easy!', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)  # Highest scores first!' },
                            { title: 'Print Cutline', desc: 'Since indices start at 0, arr[k-1] is the k-th highest score = cutline.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort(reverse=True)\nprint(scores[k - 1])  # k-th = cutline' }
                        ],
                        cpp: [
                            { title: 'Read Input', desc: 'Read N, k and the score array.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];' },
                            { title: 'Sort Descending', desc: 'Use greater<int>() to sort highest scores first.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());  // Descending' },
                            { title: 'Print Cutline', desc: 'Since indices start at 0, scores[k-1] is the k-th highest score = cutline.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end(), greater<int>());\n    cout << scores[k - 1] << endl;  // k-th = cutline\n}' }
                        ]
                    }
                },
                {
                    approach: 'Ascending sort + k-th from end',
                    description: 'Sort in ascending order, then output the k-th element from the end.',
                    timeComplexity: 'O(N log N)',
                    spaceComplexity: 'O(N)',
                    templates: {
                        python: `import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()  # Ascending sort\nprint(scores[-k])  # k-th from end = cutline`,
                        cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());  // Ascending\n    cout << scores[N - k] << endl;  // k-th from end = cutline\n}`
                    },
                    codeSteps: {
                        python: [
                            { title: 'Read Input', desc: 'Read N, k and the score array.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))' },
                            { title: 'Sort Ascending', desc: 'Default sort() is ascending. Smallest scores come first.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()  # Ascending sort' },
                            { title: 'Print k-th from end', desc: 'Python negative indexing! scores[-k] is the k-th element from the end.', code: 'import sys\ninput = sys.stdin.readline\n\nN, k = map(int, input().split())\nscores = list(map(int, input().split()))\nscores.sort()\nprint(scores[-k])  # k-th from end = cutline' }
                        ],
                        cpp: [
                            { title: 'Read Input', desc: 'Read N, k and the score array.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];' },
                            { title: 'Sort Ascending', desc: 'Default sort() is ascending.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());  // Ascending' },
                            { title: 'Print k-th from end', desc: 'In C++, scores[N-k] accesses the k-th element from the end.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N, k;\n    cin >> N >> k;\n    vector<int> scores(N);\n    for (int i = 0; i < N; i++) cin >> scores[i];\n    sort(scores.begin(), scores.end());\n    cout << scores[N - k] << endl;  // k-th from end = cutline\n}' }
                        ]
                    }
                }
            ]
        },
        {
            id: 'boj-2750',
            title: 'BOJ 2750 - Sort Numbers',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2750',
            simIntro: 'Observe how Selection Sort sorts an array. Each time, it finds the minimum and swaps it.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N numbers, write a program that sorts them in ascending order.</p>
                <h4>Input</h4>
                <p>The first line contains the count of numbers N (1 ≤ N ≤ 1,000). From the second line, N lines each contain a number. The absolute value of each number is ≤ 1,000. Numbers do not repeat.</p>
                <h4>Output</h4>
                <p>Print the sorted result in ascending order, one number per line, from the first line to the N-th line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n5\n2\n3\n4\n1</pre></div>
                    <div><strong>Output</strong><pre>1\n2\n3\n4\n5</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; N &le; 1,000</li>
                    <li>|number| &le; 1,000</li>
                    <li>Numbers do not repeat.</li>
                </ul>
            `,
            hints: [
                { title: 'The simplest approach', content: 'Use any sorting algorithm you know! Selection Sort, Insertion Sort, Bubble Sort \u2014 anything works.<br>Since N &le; 1,000, even O(n&sup2;) fits within the time limit. A great practice problem for implementing sorts yourself!<div style="display:flex;gap:6px;justify-content:center;margin-top:12px;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">5</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">2</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">3</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">4</div><div style="padding:6px 14px;border-radius:8px;background:var(--bg2);font-weight:700;">1</div></div><div style="text-align:center;margin:6px 0;font-size:1.2rem;">\u2193 Any sort!</div><div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;"><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">1</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">2</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">3</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">4</div><div style="padding:6px 14px;border-radius:8px;background:var(--green);color:white;font-weight:700;">5</div></div>' },
                { title: 'Faster sort is possible', content: 'Instead of implementing yourself, built-in sort gives you O(n log n) \u2014 much faster.<br><span class="lang-py">Python: <code>sorted()</code> or <code>.sort()</code> uses O(n log n) Timsort.</span><span class="lang-cpp">C++: <code>sort()</code> uses O(n log n) IntroSort. Requires <code>&lt;algorithm&gt;</code> header!</span><div style="margin-top:10px;overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><tr style="background:var(--bg2);"><th style="padding:6px 10px;text-align:left;border:1px solid var(--bg3);">Method</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">Time</th><th style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">Recommended?</th></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);">Manual (O(n\u00B2))</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n\u00B2)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">For practice \u270F\uFE0F</td></tr><tr><td style="padding:6px 10px;border:1px solid var(--bg3);"><span class="lang-py">sort()</span><span class="lang-cpp">sort()</span></td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);">O(n log n)</td><td style="padding:6px 10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:700;">Best for real use \u2705</td></tr></table></div>' },
                { title: 'I/O optimization', content: 'Sort is correct but getting TLE? I/O might be the bottleneck!<br><span class="lang-py">Python: Use <code>sys.stdin.readline</code> for fast input + <code>"\\n".join()</code> for batch output<div style="margin-top:8px;padding:8px 12px;background:var(--bg2);border-radius:8px;font-size:0.85rem;font-family:monospace;"><span style="color:var(--green);">import</span> sys<br>input = sys.stdin.readline &nbsp; <span style="color:var(--text3);"># Fast input!</span><br>print(<span style="color:var(--yellow);">\'\\n\'</span>.join(map(str, arr))) &nbsp; <span style="color:var(--text3);"># Batch output!</span></div></span><span class="lang-cpp">C++: Use <code>ios::sync_with_stdio(false)</code> and <code>cin.tie(nullptr)</code> for fast I/O<div style="margin-top:8px;padding:8px 12px;background:var(--bg2);border-radius:8px;font-size:0.85rem;font-family:monospace;"><span style="color:var(--green);">ios</span>::sync_with_stdio(<span style="color:var(--red);">false</span>);<br>cin.tie(<span style="color:var(--red);">nullptr</span>); &nbsp; <span style="color:var(--text3);">// Fast I/O!</span></div></span>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint('\\n'.join(map(str, arr)))`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) scanf("%d", &arr[i]);\n    sort(arr.begin(), arr.end());\n    for (int x : arr) printf("%d\\n", x);\n}`
            },
            solutions: [{
                approach: 'Using built-in sort',
                description: 'Store input in a list and call sort().',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: 'Read Input', desc: 'Use sys.stdin.readline for fast input and store in an array.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]' },
                        { title: 'Sort', desc: 'Built-in sort() uses TimSort (O(n log n)), the fastest and simplest option.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()' },
                        { title: 'Output', desc: 'Using join for batch output is much faster than calling print repeatedly.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\narr = [int(input()) for _ in range(N)]\narr.sort()\nprint(\'\\n\'.join(map(str, arr)))' }
                    ],
                    cpp: [
                        { title: 'Read Input', desc: 'Read N integers into a vector.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];' },
                        { title: 'Sort', desc: 'STL sort() uses IntroSort (O(n log n)), faster and safer than manual implementation.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];\n\n    sort(arr.begin(), arr.end());  // O(n log n) IntroSort' },
                        { title: 'Output', desc: 'Use "\\n" for newline output. Faster than endl.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<int> arr(N);\n    for (int i = 0; i < N; i++) cin >> arr[i];\n\n    sort(arr.begin(), arr.end());\n\n    for (int x : arr) cout << x << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-11650',
            title: 'BOJ 11650 - Sort Coordinates',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/11650',
            simIntro: 'Observe the process of creating (x, y) tuples from coordinates and sorting them.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N points on a 2D plane, write a program that sorts the coordinates in ascending order of x-coordinate, and if x-coordinates are equal, in ascending order of y-coordinate, then prints the result.</p>
                <h4>Input</h4>
                <p>The first line contains the number of points N (1 ≤ N ≤ 100,000). From the second line, N lines each contain the x<sub>i</sub> and y<sub>i</sub> coordinates of the i-th point. (-100,000 ≤ x<sub>i</sub>, y<sub>i</sub> ≤ 100,000) Coordinates are always integers, and no two points share the same position.</p>
                <h4>Output</h4>
                <p>Print the sorted points, one per line, from the first line to the N-th line.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5\n3 4\n1 1\n1 -1\n2 2\n3 3</pre></div>
                    <div><strong>Output</strong><pre>1 -1\n1 1\n2 2\n3 3\n3 4</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; N &le; 100,000</li>
                    <li>-100,000 &le; x, y &le; 100,000</li>
                    <li>Coordinates are integers.</li>
                </ul>
            `,
            hints: [
                { title: 'Coordinate sort = 2 comparison keys', content: 'Compare x first, then y if x is equal. Do we need to write a custom comparator?' },
                { title: 'The magic of tuple/pair sorting', content: 'No need to write a custom comparator!<br><span class="lang-py">Python: Sorting <code>(x, y)</code> tuples automatically sorts by x first, then y. Just <code>coords.sort()</code> — one line!</span><span class="lang-cpp">C++: Sorting <code>pair&lt;int,int&gt;</code> with <code>sort()</code> automatically sorts by first, then second!</span>' },
                { title: 'I/O is the key', content: 'Since N can be up to 100,000, fast I/O is essential. Slow I/O can cause TLE even with a correct solution!<br><span class="lang-py">Python: Use <code>sys.stdin.readline</code> for fast input</span><span class="lang-cpp">C++: Use <code>ios::sync_with_stdio(false)</code> and <code>cin.tie(nullptr)</code> for fast I/O</span>' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # Tuples auto-sort by (x, y) order!\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint('\\n'.join(output))`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        scanf("%d %d", &coords[i].first, &coords[i].second);\n    sort(coords.begin(), coords.end());\n    for (auto& [x, y] : coords)\n        printf("%d %d\\n", x, y);\n}`
            },
            solutions: [{
                approach: 'Tuple sorting',
                description: 'Storing coordinates as (x, y) tuples enables automatic x → y sorting.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: 'Read Input', desc: 'Store coordinates as (x, y) tuples so they auto-compare by x then y when sorted.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))' },
                        { title: 'Tuple Sort', desc: 'Python tuples compare element by element, so just calling sort() with no key is enough.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()  # Auto-sorts by (x, y) order!' },
                        { title: 'Output', desc: 'Format with f-string and batch output with join for better speed.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\ncoords = []\nfor _ in range(N):\n    x, y = map(int, input().split())\n    coords.append((x, y))\n\ncoords.sort()\n\noutput = []\nfor x, y in coords:\n    output.append(f"{x} {y}")\nprint(\'\\n\'.join(output))' }
                    ],
                    cpp: [
                        { title: 'Read Input', desc: 'Storing coordinates as pair<int,int> enables auto-comparison by first then second when sorted.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;' },
                        { title: 'Pair Sort', desc: 'STL sort() automatically compares pairs by first, then by second if equal.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;\n\n    sort(coords.begin(), coords.end());  // Pair auto-sort (first, then second)' },
                        { title: 'Output', desc: 'Use structured bindings (auto& [x, y]) for clean output.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int,int>> coords(N);\n    for (int i = 0; i < N; i++)\n        cin >> coords[i].first >> coords[i].second;\n\n    sort(coords.begin(), coords.end());\n\n    for (auto& [x, y] : coords)\n        cout << x << " " << y << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-10814',
            title: 'BOJ 10814 - Sort by Age',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10814',
            simIntro: 'Observe how Stable Sort preserves input order when sorting by age.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>You are given the ages and names of people who signed up for an online judge, in the order they registered. Write a program that sorts the members in ascending order of age, and for members with the same age, those who registered earlier should come first.</p>
                <h4>Input</h4>
                <p>The first line contains the number of online judge members N (1 ≤ N ≤ 100,000).</p>
                <p>From the second line, N lines each contain the age and name of a member, separated by a space. The age is an integer between 1 and 200, and the name is a string of uppercase and lowercase letters with length ≤ 100. The input is given in the order of registration.</p>
                <h4>Output</h4>
                <p>Print the members sorted by age in ascending order, one per line, with age and name separated by a space. For members with the same age, those who registered earlier come first.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>3\n21 Junkyu\n21 Dohyun\n20 Sunyoung</pre></div>
                    <div><strong>Output</strong><pre>20 Sunyoung\n21 Junkyu\n21 Dohyun</pre></div>
                </div></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; N &le; 100,000</li>
                    <li>1 &le; age &le; 200</li>
                    <li>Names consist of uppercase and lowercase letters only, with length at most 100.</li>
                </ul>
            `,
            hints: [
                { title: 'Sort by age, but what about same age?', content: 'Sorting by age is easy. But look carefully — for the same age, <strong>whoever registered first should come first</strong>. In other words, for equal ages, the input order must be preserved. This kind of sort is called a <strong>"stable sort"</strong>.' },
                { title: 'Using stable sort', content: 'If you sort by age only (as the key), stable sort preserves the original order for equal ages!<br><span class="lang-py">Python: <code>sorted()</code> and <code>.sort()</code> are stable by default (TimSort)! Just use <code>key=lambda x: int(x.split()[0])</code>.</span><span class="lang-cpp">C++: Use <code>stable_sort()</code>. Warning: <code>sort()</code> is unstable — it may reorder elements with the same age!</span>' },
                { title: 'Time complexity', content: 'O(n log n) is sufficient. With N &le; 100,000, it fits comfortably.' }
            ],
            templates: {
                python: `import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort is stable → sorting by age only preserves input order\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>\nusing namespace std;\n\nint main() {\n    int N;\n    scanf("%d", &N);\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    // stable_sort: preserves input order for same age\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });\n\n    for (auto& [age, name] : v)\n        printf("%d %s\\n", age, name.c_str());\n}`
            },
            solutions: [{
                approach: 'Using stable sort',
                description: 'Sorting by age only with sort() automatically preserves input order thanks to stable sort.',
                timeComplexity: 'O(N log N)',
                spaceComplexity: 'O(N)',
                get templates() { return sortingTopic.problems[4].templates; },
                codeSteps: {
                    python: [
                        { title: 'Read Input', desc: 'Store age (int) and name (str) as tuples. We\'ll only use age as the sort key.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))' },
                        { title: 'Sort by Age (Stable)', desc: 'Python sort() is a stable sort (TimSort), so using only age as the key preserves input order for equal ages.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\n# Python sort is stable!\nmembers.sort(key=lambda x: x[0])' },
                        { title: 'Output', desc: 'Print the sorted result with age and name.', code: 'import sys\ninput = sys.stdin.readline\n\nN = int(input())\nmembers = []\nfor _ in range(N):\n    line = input().split()\n    members.append((int(line[0]), line[1]))\n\nmembers.sort(key=lambda x: x[0])\n\nfor age, name in members:\n    print(age, name)' }
                    ],
                    cpp: [
                        { title: 'Read Input', desc: 'Store age and name together as pair<int, string>.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;' },
                        { title: 'Stable Sort by Age', desc: 'C++ sort() is unstable, so stable_sort() is needed to preserve input order for equal ages.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    // stable_sort: preserves input order for equal keys!\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });' },
                        { title: 'Output', desc: 'Use structured bindings to cleanly output age and name.', code: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int N;\n    cin >> N;\n    vector<pair<int, string>> v(N);\n    for (int i = 0; i < N; i++)\n        cin >> v[i].first >> v[i].second;\n\n    stable_sort(v.begin(), v.end(), [](auto& a, auto& b) {\n        return a.first < b.first;\n    });\n\n    for (auto& [age, name] : v)\n        cout << age << " " << name << "\\n";\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-56',
            title: 'LeetCode 56 - Merge Intervals',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/merge-intervals/',
            simIntro: 'Observe the process of sorting by start point, then merging overlapping intervals in order.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given an array of <code>intervals</code> where <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>intervals = [[1,3],[2,6],[8,10],[15,18]]</pre></div>
                    <div><strong>Output</strong><pre>[[1,6],[8,10],[15,18]]</pre></div>
                </div><p class="example-explain">Intervals [1,3] and [2,6] overlap, so they are merged into [1,6].</p></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>intervals = [[1,4],[4,5]]</pre></div>
                    <div><strong>Output</strong><pre>[[1,5]]</pre></div>
                </div><p class="example-explain">Intervals [1,4] and [4,5] are considered overlapping.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 &le; intervals.length &le; 10<sup>4</sup></li>
                    <li>intervals[i].length == 2</li>
                    <li>0 &le; start<sub>i</sub> &le; end<sub>i</sub> &le; 10<sup>4</sup></li>
                </ul>
            `,
            hints: [
                { title: 'First thought: compare one by one?', content: 'You could compare every pair of intervals to check for overlap. But with n intervals, that\'s O(n&sup2;) comparisons... With 10,000 intervals, that\'s 100 million comparisons!' },
                { title: 'Sorting makes it easy!', content: '<strong>Sort by start point</strong>, and overlapping intervals will always be adjacent. Then just scan once from left to right and merge! Sort O(n log n) + scan O(n) = <strong>O(n log n)</strong>' },
                { title: 'Merge logic', content: 'If the current interval\'s end &ge; next interval\'s start, they overlap — merge them: <code>end = max(current end, next end)</code>.<br>If they don\'t overlap? Add the new interval to the result and move on.' }
            ],
            templates: {
                python: `class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda x: x[0])  # Sort by start point\n        merged = [intervals[0]]\n\n        for start, end in intervals[1:]:\n            if start <= merged[-1][1]:  # Overlap!\n                merged[-1][1] = max(merged[-1][1], end)\n            else:\n                merged.append([start, end])\n\n        return merged`,
                cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged = {intervals[0]};\n\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= merged.back()[1])\n                merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n            else\n                merged.push_back(intervals[i]);\n        }\n        return merged;\n    }\n};`
            },
            solutions: [{
                approach: 'Sort + Sequential Merge',
                description: 'Sort by start point, then update end with max when overlapping.',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return sortingTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: 'Sort by Start', desc: 'Sorting by start point ensures overlapping intervals are adjacent, allowing a single-pass merge.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])' },
                        { title: 'Add First Interval', desc: 'Put the first interval in the result list as the starting point for comparison.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]' },
                        { title: 'Overlap Check + Merge', desc: 'If the current interval\'s start is less than or equal to the previous interval\'s end, they overlap — extend end with max.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:  # Overlap!\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])' },
                        { title: 'Return Result', desc: 'Return the merged interval list.', code: 'def merge(self, intervals):\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n\n    return merged' }
                    ],
                    cpp: [
                        { title: 'Sort by Start', desc: 'Sorting by start point ensures overlapping intervals are adjacent, allowing a single-pass merge.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());' },
                        { title: 'Add First Interval', desc: 'Put the first interval in the result vector as the starting point for comparison.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};' },
                        { title: 'Overlap Check + Merge', desc: 'If the current interval\'s start is less than or equal to the previous interval\'s end, they overlap — extend end with max.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};\n\n    for (int i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] <= merged.back()[1])\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        else\n            merged.push_back(intervals[i]);\n    }' },
                        { title: 'Return Result', desc: 'Return the merged interval vector.', code: 'vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n\n    vector<vector<int>> merged = {intervals[0]};\n\n    for (int i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] <= merged.back()[1])\n            merged.back()[1] = max(merged.back()[1], intervals[i][1]);\n        else\n            merged.push_back(intervals[i]);\n    }\n\n    return merged;\n}' }
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
        backBtn.addEventListener('click', function() { sortingTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.sorting = sortingTopic;
