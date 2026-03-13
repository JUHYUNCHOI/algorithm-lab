// =========================================================
// Sort (Sorting) Topic Module
// =========================================================
const sortingTopic = {
    id: 'sorting',
    title: 'Sort',
    icon: '🔢',
    category: 'Sorting & Searching',
    order: 6,
    description: 'Everything about sorting — from Bubble/Selection/Insertion to Merge/Quick Sort',
    relatedNote: 'Also important are special sorts like Counting Sort and Radix Sort, as well as the concept of sort stability.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>' +
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
                <div class="concept-section-title"><span class="section-num">1</span> Basic Sorts: O(n²)</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Imagine sorting a hand of cards!
                    <em>Selection Sort</em> is "find the smallest card and place it at the front",
                    <em>Insertion Sort</em> is "insert a new card into the correct position",
                    <em>Bubble Sort</em> is "compare adjacent cards and swap them".
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
                        <p><strong>Insert a card into the correct position</strong>. For nearly sorted data, it runs in O(n) — very fast!</p>
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
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> Merge Sort: O(n log n)</div>
                <div class="analogy-box">
                    <strong>Understanding by analogy:</strong> Merge Sort is <em>"split in half, sort each half, then merge"</em>!
                    Split a pile of cards in half, sort each half, then merge the two piles by comparing from the top.
                    This is a classic example of <strong>Divide & Conquer</strong>.
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

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="str-step-controls" id="str-step-controls' + s + '" style="position:fixed;bottom:0;left:var(--sidebar-w,280px);right:0;background:var(--card);border-top:1px solid var(--border);padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:12px;z-index:100;">' +
            '<button class="btn" id="str-prev' + s + '">◀ Prev</button>' +
            '<span id="str-indicator' + s + '" style="font-size:0.9rem;color:var(--text-secondary);min-width:60px;text-align:center;">0 / 0</span>' +
            '<button class="btn" id="str-next' + s + '">Next ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var s = suffix || '';
        var current = -1;
        var actionDelay = 350;
        var indicator = container.querySelector('#str-indicator' + s);
        var prevBtn = container.querySelector('#str-prev' + s);
        var nextBtn = container.querySelector('#str-next' + s);
        if (!indicator || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var descEl = container.querySelector('[id$="desc' + s + '"]');
        var updateUI = function() {
            if (current < 0) {
                indicator.textContent = 'Before Start';
                if (descEl) descEl.innerHTML = '▶ Press Next to start the simulation.';
                prevBtn.disabled = true;
                nextBtn.disabled = false;
            } else {
                indicator.textContent = (current + 1) + ' / ' + total;
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

    // ── Selection Sort (boj-2750) ──
    _renderVizSelection(container) {
        var self = this;
        var DEFAULT_SEL_ARR = [38, 27, 43, 3, 9, 82, 10];

        container.innerHTML =
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
                '<label style="font-weight:600;">Array: <input type="text" id="sort-sel-input" value="' + DEFAULT_SEL_ARR.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
                '<button class="btn btn-primary" id="sort-sel-reset">🔄</button>' +
            '</div>' +
            '<div class="viz-area">' +
                '<div id="sort-bars-sel" style="display:flex;gap:6px;align-items:flex-end;justify-content:center;min-height:200px;padding:20px 0;"></div>' +
                '<div id="sort-desc-sel" style="padding:14px;background:var(--bg-secondary);border-radius:8px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-sel');

        var barsEl = container.querySelector('#sort-bars-sel');
        var descEl = container.querySelector('#sort-desc-sel');

        function buildSelectionSteps(original) {
            var states = [];
            var simArr = original.slice();
            states.push({ arr: simArr.slice(), sortedUpTo: -1, minIdx: -1, desc: 'Initial array: [' + original.join(', ') + ']. Starting Selection Sort!' });

            for (var i = 0; i < simArr.length - 1; i++) {
                var minIdx = i;
                for (var j = i + 1; j < simArr.length; j++) {
                    if (simArr[j] < simArr[minIdx]) minIdx = j;
                }
                states.push({ arr: simArr.slice(), sortedUpTo: i - 1, minIdx: minIdx,
                    desc: 'Position ' + i + ': Found minimum ' + simArr[minIdx] + '! (index ' + minIdx + ')' });
                var tmp = simArr[i]; simArr[i] = simArr[minIdx]; simArr[minIdx] = tmp;
                states.push({ arr: simArr.slice(), sortedUpTo: i, minIdx: -1,
                    desc: 'Swap complete → [' + simArr.join(', ') + ']. Position ' + i + ' finalized!' });
            }
            states.push({ arr: simArr.slice(), sortedUpTo: simArr.length - 1, minIdx: -1,
                desc: 'Sort complete! [' + simArr.join(', ') + ']. Selection Sort always has O(n²) time complexity.' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    self._renderBars(barsEl, st.arr, st.sortedUpTo, [], st.minIdx);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetSelection() {
            var raw = container.querySelector('#sort-sel-input').value;
            var parsed = raw.split(',').map(function(s) { return parseInt(s.trim(), 10); }).filter(function(n) { return !isNaN(n); });
            if (parsed.length < 2) parsed = DEFAULT_SEL_ARR.slice();
            barsEl.innerHTML = '';
            descEl.innerHTML = '';
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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">Coordinate Array</div>' +
                '<div id="sort-coords" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
                '<div id="sort-desc-coord" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-coord');

        var coordsEl = container.querySelector('#sort-coords');
        var descEl = container.querySelector('#sort-desc-coord');

        function renderCoords(arr, sortedUpTo, comparingIdx) {
            coordsEl.innerHTML = arr.map(function(c, i) {
                var cls = 'str-char-box';
                if (i <= sortedUpTo) cls += ' matched';
                else if (i === comparingIdx) cls += ' comparing';
                return '<div class="' + cls + '" style="min-width:60px;text-align:center;font-size:0.9rem;">(' + c[0] + ', ' + c[1] + ')</div>';
            }).join('');
        }

        function buildCoordSteps(coords) {
            var states = [];
            var simArr = coords.map(function(c) { return c.slice(); });
            states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: -1, comp: -1,
                desc: 'Initial coordinates: ' + simArr.map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') + '. Starting tuple sort!' });

            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i].slice();
                var j = i - 1;
                states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: i - 1, comp: i,
                    desc: 'Inserting (' + key[0] + ', ' + key[1] + ') into the correct position.' });
                while (j >= 0 && (simArr[j][0] > key[0] || (simArr[j][0] === key[0] && simArr[j][1] > key[1]))) {
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: i, comp: -1,
                    desc: 'Insertion complete: ' + simArr.slice(0, i + 1).map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') });
            }
            states.push({ arr: simArr.map(function(c) { return c.slice(); }), sortedUpTo: simArr.length - 1, comp: -1,
                desc: 'Sort complete! ' + simArr.map(function(c) { return '(' + c.join(',') + ')'; }).join(', ') + ' ✓' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderCoords(st.arr, st.sortedUpTo, st.comp);
                    descEl.innerHTML = st.desc;
                }};
            });
        }

        function resetCoord() {
            var raw = container.querySelector('#sort-coord-input').value;
            // Parse "x y, x y, ..." format
            var parsed = raw.split(',').map(function(pair) {
                var parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
                return null;
            }).filter(function(c) { return c !== null && !isNaN(c[0]) && !isNaN(c[1]); });
            if (parsed.length < 2) parsed = DEFAULT_COORDS.map(function(c) { return c.slice(); });
            coordsEl.innerHTML = '';
            descEl.innerHTML = '';
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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">Interval Array (sorted by start)</div>' +
                '<div id="sort-intervals" style="position:relative;min-height:60px;padding:20px 0;"></div>' +
                '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;">Merge Result</div>' +
                '<div id="sort-merged" style="position:relative;min-height:60px;padding:8px 0;"></div>' +
                '<div id="sort-desc-intv" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-intv');

        var intervalsEl = container.querySelector('#sort-intervals');
        var mergedEl = container.querySelector('#sort-merged');
        var descEl = container.querySelector('#sort-desc-intv');

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
            '<div class="viz-area">' +
                '<div style="font-weight:600;margin-bottom:8px;">Member List (input order)</div>' +
                '<div id="sort-members" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;padding:12px 0;"></div>' +
                '<div id="sort-desc-stable" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>' +
            self._createStepControls('-stable');

        var membersEl = container.querySelector('#sort-members');
        var descEl = container.querySelector('#sort-desc-stable');

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
            var states = [];
            var simArr = members.map(function(m) { return { age: m.age, name: m.name, order: m.order }; });
            states.push({ arr: simArr.slice(), sortedUpTo: -1,
                desc: 'Initial input: ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '. Starting stable sort by age!' });

            // Insertion sort by age only (stable)
            for (var i = 1; i < simArr.length; i++) {
                var key = simArr[i];
                var j = i - 1;
                while (j >= 0 && simArr[j].age > key.age) {
                    simArr[j + 1] = simArr[j];
                    j--;
                }
                simArr[j + 1] = key;
                states.push({ arr: simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }), sortedUpTo: i,
                    desc: 'Insert ' + key.age + ' ' + key.name + ' \u2192 When ages are equal, input order is preserved! (stable sort)' });
            }
            // Find same-age groups for final description
            var ageGroups = {};
            simArr.forEach(function(m) {
                if (!ageGroups[m.age]) ageGroups[m.age] = [];
                ageGroups[m.age].push(m.name);
            });
            var stableNote = '';
            Object.keys(ageGroups).forEach(function(age) {
                if (ageGroups[age].length > 1) {
                    stableNote += ' Age ' + age + ': ' + ageGroups[age].join(', ') + ' — input order preserved.';
                }
            });
            states.push({ arr: simArr.map(function(m) { return { age: m.age, name: m.name, order: m.order }; }), sortedUpTo: simArr.length - 1,
                desc: 'Sort complete! ' + simArr.map(function(m) { return m.age + ' ' + m.name; }).join(', ') + '.' + (stableNote || '') + ' \u2713' });

            return states.map(function(st) {
                return { description: st.desc, action: function() {
                    renderMembers(st.arr, st.sortedUpTo);
                    descEl.innerHTML = st.desc;
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
        { num: 1, title: 'Basic Sort', desc: 'Sort implementation and custom sorting (Bronze~Silver)', problemIds: ['boj-2750', 'boj-11650'] },
        { num: 2, title: 'Sort Applications', desc: 'Sorting-based problem solving (Easy~Medium)', problemIds: ['lc-56', 'boj-10814'] }
    ],

    problems: [
        {
            id: 'boj-2750',
            title: 'BOJ 2750 - Sort Numbers',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2750',
            simIntro: 'Observe how Selection Sort sorts an array. Each time, it finds the minimum and swaps it.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given N numbers, write a program that sorts them in ascending order.</p>
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
                { title: 'The simplest approach', content: 'Use any sorting algorithm you know! Selection Sort, Insertion Sort, Bubble Sort — anything works.<br>Since N &le; 1,000, even O(n&sup2;) fits within the time limit. A great practice problem for implementing sorts yourself!' },
                { title: 'Faster sort is possible', content: 'Instead of implementing yourself, built-in sort gives you O(n log n) — much faster.<br><span class="lang-py">Python: <code>sorted()</code> or <code>.sort()</code> uses O(n log n) Timsort.</span><span class="lang-cpp">C++: <code>sort()</code> uses O(n log n) IntroSort. Requires <code>&lt;algorithm&gt;</code> header!</span>' },
                { title: 'I/O optimization', content: 'Sort is correct but getting TLE? I/O might be the bottleneck!<br><span class="lang-py">Python: Use <code>sys.stdin.readline</code> for fast input + <code>"\\n".join()</code> for batch output</span><span class="lang-cpp">C++: Use <code>ios::sync_with_stdio(false)</code> and <code>cin.tie(nullptr)</code> for fast I/O</span>' }
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
                get templates() { return sortingTopic.problems[0].templates; },
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
                get templates() { return sortingTopic.problems[1].templates; },
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
                get templates() { return sortingTopic.problems[2].templates; },
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
                get templates() { return sortingTopic.problems[3].templates; },
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
