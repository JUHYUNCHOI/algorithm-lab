// =========================================================
// Hash Table Topic Module
// =========================================================
const hashTableTopic = {
    id: 'hashtable',
    title: 'Hash Table',
    icon: '🗂️',
    category: 'Data Structures',
    order: 3,
    description: 'O(1) lookup and counting techniques using dictionaries and sets',
    relatedNote: 'HashMaps are often used alongside two pointers and sliding window, and are a key tool for reducing time by using O(1) lookup instead of sorting.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'lc-217':   { type: 'HashSet Usage',          color: 'var(--accent)', vizMethod: '_renderVizContainsDup' },
        'lc-3':     { type: 'Sliding Window',          color: '#6c5ce7',      vizMethod: '_renderVizLongestSub' },
        'lc-560':   { type: 'Prefix Sum + HashMap',    color: '#e17055',      vizMethod: '_renderVizSubarraySum' },
        'boj-7785': { type: 'Set Management',          color: 'var(--green)',  vizMethod: '_renderVizCompany' }
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
        const diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
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
            (isLC ? 'LeetCodeSolve on LeetCode ↗' : 'BOJSolve on LeetCode ↗') + '</a></div>';
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

    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🗂️ Hash Table</h2>
                <p class="hero-sub">Let's learn the magical data structure that instantly finds values with a single key!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> What is a Hash Table?</div>
                <div class="analogy-box">
                    <strong>Origin of the name:</strong> <em>"Hash"</em> means to <strong>chop into small pieces</strong> in cooking.
                    The process of breaking data (keys) into pieces and converting them to numbers is similar to chopping ingredients, hence "Hashing."
                    Since we use that number as an <strong>index in an array (table)</strong> — <em>Hash + Table</em> = <strong>Hash Table</strong>!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">key→val</text></svg></div>
                        <h3>Key-Value Pairs</h3>
                        <p>Store values by key and retrieve them instantly. <span class="lang-py">Python's <code>dict</code></span><span class="lang-cpp">C++'s <code>unordered_map</code></span>.</p>
                        <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: dict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: unordered_map ↗</a></span>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(1)</text></svg></div>
                        <h3>Average O(1)</h3>
                        <p>Insert, delete, and search are all O(1) on average. Much faster than O(n) search in arrays!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">#</text></svg></div>
                        <h3>Hash Function</h3>
                        <p>Converts a key into a number (hash value). The same key always produces the same hash value.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">set{}</text></svg></div>
                        <h3>Set</h3>
                        <p>Stores only values and <strong>does not allow duplicates</strong>. <span class="lang-py">The <code>in</code> operation is O(1)!</span><span class="lang-cpp">The <code>count()</code>/<code>find()</code> operation is O(1)!</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Basic hash table usage
d = {}
d["apple"] = 3       # Insert: O(1)
d["banana"] = 5
print(d["apple"])     # Lookup: O(1) → 3
print("apple" in d)   # Existence check: O(1) → True

# Set — remove duplicates, fast existence check
s = set([1, 2, 2, 3, 3, 3])
print(s)              # {1, 2, 3}
print(2 in s)         # O(1) → True</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;unordered_map&gt;
#include &lt;unordered_set&gt;
using namespace std;

int main() {
    // Basic hash table usage
    unordered_map&lt;string, int&gt; d;
    d["apple"] = 3;        // Insert: O(1)
    d["banana"] = 5;
    cout &lt;&lt; d["apple"] &lt;&lt; endl;         // Lookup: O(1) → 3
    cout &lt;&lt; (d.count("apple") ? "true" : "false") &lt;&lt; endl;  // Existence check: O(1)

    // Set — remove duplicates, fast existence check
    unordered_set&lt;int&gt; s = {1, 2, 2, 3, 3, 3};
    // Only {1, 2, 3} stored in s
    cout &lt;&lt; (s.count(2) ? "true" : "false") &lt;&lt; endl;  // O(1)
    return 0;
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">Checking if an element exists in an array is O(n), but why is it O(1) in a set?</span></div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">An array has to compare one by one from start to end, but a set uses a <strong>hash function</strong> to calculate the position directly! It's like looking up a name directly in a phone book.</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> How Does a Hash Function Work?</div>
                <div class="analogy-box">
                    <strong>Key question:</strong> How do we convert the string <code>"apple"</code> into a <strong>number</strong>?
                    A hash function works in 3 steps: <em>Split → Mix → Fit</em>.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">a=97</text></svg></div>
                        <h3>① Split</h3>
                        <p>Convert each character to a number (ASCII).<br><code>a→97, p→112, l→108, e→101</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">Σ=530</text></svg></div>
                        <h3>② Mix</h3>
                        <p>Combine the numbers into a single value.<br><code>97+112+112+108+101 = 530</code></p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--green)">%10=0</text></svg></div>
                        <h3>③ Fit</h3>
                        <p>Apply modulo with the table size.<br><code>530 % 10 = 0</code> → <strong>Slot 0!</strong></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># How a hash function works (simple version)
def simple_hash(key, table_size):
    total = 0
    for ch in key:
        total += ord(ch)      # Character → Number (Split + Mix)
    return total % table_size  # Fit to table size

# When table size is 10
print(simple_hash("apple", 10))   # 530 % 10 = 0 → Slot 0
print(simple_hash("banana", 10))  # 609 % 10 = 9 → Slot 9
print(simple_hash("grape", 10))   # 527 % 10 = 7 → Slot 7</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

// How a hash function works (simple version)
int simple_hash(const string&amp; key, int table_size) {
    int total = 0;
    for (char ch : key) {
        total += (int)ch;      // Character → Number (Split + Mix)
    }
    return total % table_size;  // Fit to table size
}

int main() {
    // When table size is 10
    cout &lt;&lt; simple_hash("apple", 10) &lt;&lt; endl;   // 530 % 10 = 0 → Slot 0
    cout &lt;&lt; simple_hash("banana", 10) &lt;&lt; endl;  // 609 % 10 = 9 → Slot 9
    cout &lt;&lt; simple_hash("grape", 10) &lt;&lt; endl;   // 527 % 10 = 7 → Slot 7
    return 0;
}</code></pre>
                </div></span>
                <div class="analogy-box" style="border-left-color: var(--green);">
                    <strong>Why is it fast?</strong> To find <code>"apple"</code> in an array, you have to compare one by one from the start (O(n)).
                    But a hash table computes <code>hash("apple") = 0</code> and <strong>goes directly to slot 0</strong> (O(1)).
                    It's like going straight to a shelf number in a library instead of flipping through books one by one! 📚→🎯
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">What happens if the table has 10 slots but there are 100 data items?</span></div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">Each slot would hold an average of 10 items, degrading performance! That's why in practice, the <strong>table is made much larger than the data count</strong>, and the table is automatically expanded (resizing) as data grows. <span class="lang-py">Python's <code>dict</code> handles this automatically.</span><span class="lang-cpp">C++'s <code>unordered_map</code> handles this automatically (rehash).</span></div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> HashMap Usage Patterns</div>
                <div class="analogy-box">
                    <strong>Knowing patterns makes problems easier!</strong> The 3 key uses of hashmaps:
                    (1) <em>Frequency counting</em> — counting occurrences directly,
                    (2) <em>Existence check</em> — "Have I seen this value before?",
                    (3) <em>Mapping</em> — "What is this value's index/complement?"
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="11" font-weight="bold" fill="var(--green)">count</text></svg></div>
                        <h3>Frequency Counting</h3>
                        <p>Used in problems like "most frequent element" or "find duplicates."</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">in?</text></svg></div>
                        <h3>Existence Check</h3>
                        <p>In Two Sum, checking "does target - num already exist?" in O(1).</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">a↔b</text></svg></div>
                        <h3>Mapping</h3>
                        <p>Connects two pieces of information: value→index, character→frequency, etc.</p>
                    </div>
                </div>
                <div style="margin-bottom:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/library/collections.html#collections.Counter" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: Counter ↗</a></span>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Pattern 1: Frequency counting
from collections import Counter
words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
freq = Counter(words)
print(freq.most_common(1))  # [('apple', 3)]

# Pattern 2: Solving Two Sum in O(n) with a hashmap
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:          # O(1) existence check!
            return [seen[comp], i]
        seen[num] = i             # value → index mapping
    return []

# Pattern 3: Longest substring without repeating characters
def longest_unique(s):
    seen = {}
    start = max_len = 0
    for i, c in enumerate(s):
        if c in seen and seen[c] >= start:
            start = seen[c] + 1
        seen[c] = i
        max_len = max(max_len, i - start + 1)
    return max_len</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;unordered_map&gt;
#include &lt;algorithm&gt;
using namespace std;

// Pattern 1: Frequency counting — direct counting with unordered_map
vector&lt;string&gt; words = {"apple", "banana", "apple", "cherry", "banana", "apple"};
unordered_map&lt;string, int&gt; freq;
for (auto&amp; w : words) freq[w]++;
// freq["apple"] = 3, freq["banana"] = 2, freq["cherry"] = 1

// Pattern 2: Solving Two Sum in O(n) with a hashmap
vector&lt;int&gt; two_sum(vector&lt;int&gt;&amp; nums, int target) {
    unordered_map&lt;int, int&gt; seen;
    for (int i = 0; i &lt; nums.size(); i++) {
        int comp = target - nums[i];
        if (seen.count(comp))      // O(1) existence check!
            return {seen[comp], i};
        seen[nums[i]] = i;         // value → index mapping
    }
    return {};
}

// Pattern 3: Longest substring without repeating characters
int longest_unique(const string&amp; s) {
    unordered_map&lt;char, int&gt; seen;
    int start = 0, max_len = 0;
    for (int i = 0; i &lt; s.size(); i++) {
        if (seen.count(s[i]) &amp;&amp; seen[s[i]] &gt;= start)
            start = seen[s[i]] + 1;
        seen[s[i]] = i;
        max_len = max(max_len, i - start + 1);
    }
    return max_len;
}</code></pre>
                </div></span>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">Why can Two Sum be solved with a hashmap (O(n)) instead of nested for loops (O(n²))?</span></div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">Nested for loops compare "all pairs," but a hashmap checks "does this number's pair already exist?" in O(1) during a <strong>single pass</strong>. n times × O(1) = O(n)!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> Hash Collisions and Resolution</div>
                <div class="analogy-box">
                    <strong>The problem:</strong> If the table has 10 slots and both <code>"apple"</code> and <code>"melon"</code> are assigned to <strong>slot 0</strong>?
                    This is a <em>"Hash Collision"</em>. There are two ways to resolve it.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">→→</text></svg></div>
                        <h3>① Chaining</h3>
                        <p><strong>Link items in a list</strong> at the same slot.<br>
                        <code>[0] → apple → melon</code><br>
                        <code>[7] → grape</code><br>
                        This is the most commonly used method in real hash table implementations.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">↓↓</text></svg></div>
                        <h3>② Open Addressing</h3>
                        <p>If a slot is occupied, <strong>find the next empty slot</strong>.<br>
                        <code>[0] apple</code> ← arrived first<br>
                        <code>[1] melon</code> ← slot 0 is full, go to 1!<br>
                        <span class="lang-py">Python's <code>dict</code> uses this approach.</span><span class="lang-cpp">C++'s <code>unordered_map</code> also uses this approach (open addressing variant).</span></p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># Chaining method — implementing it yourself
class HashTable:
    def __init__(self, size=10):
        self.table = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in key) % len(self.table)

    def put(self, key, value):
        idx = self._hash(key)
        # If key exists in the list at this slot, update; otherwise, append
        for pair in self.table[idx]:
            if pair[0] == key:
                pair[1] = value
                return
        self.table[idx].append([key, value])

    def get(self, key):
        idx = self._hash(key)
        for pair in self.table[idx]:
            if pair[0] == key:
                return pair[1]
        return None</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;list&gt;
using namespace std;

// Chaining method — implementing it yourself
struct HashTable {
    int size;
    vector&lt;list&lt;pair&lt;string, int&gt;&gt;&gt; table;  // Each slot is a linked list

    HashTable(int sz = 10) : size(sz), table(sz) {}

    int _hash(const string&amp; key) {
        int total = 0;
        for (char c : key) total += (int)c;
        return total % size;
    }

    void put(const string&amp; key, int value) {
        int idx = _hash(key);
        // If key exists in the list at this slot, update; otherwise, append
        for (auto&amp; p : table[idx]) {
            if (p.first == key) { p.second = value; return; }
        }
        table[idx].push_back({key, value});
    }

    int get(const string&amp; key) {
        int idx = _hash(key);
        for (auto&amp; p : table[idx]) {
            if (p.first == key) return p.second;
        }
        return -1;  // Return -1 instead of nullptr (not found)
    }
};</code></pre>
                </div></span>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">O(n)?</text></svg></div>
                        <h3>What if there are many collisions?</h3>
                        <p>If data piles up in one slot, you have to search through it one by one. Worst case O(n) — but with a <strong>good hash function + sufficient table size</strong>, this rarely happens.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">Order</text></svg></div>
                        <h3>Order Guarantee</h3>
                        <p><span class="lang-py">Python 3.7+'s <code>dict</code> preserves insertion order!</span><span class="lang-cpp">C++'s <code>unordered_map</code> does not guarantee order, but <code>map</code> maintains sorted key order.</span> However, hash tables themselves are not in sorted order.</p>
                    </div>
                </div>
                <div class="think-box">
                    <div class="think-box-question"><span class="think-box-question-icon">Q</span><span class="think-box-question-text">The worst-case time complexity of a hash table is O(n), so why do we say "O(1)"?</span></div>
                    <button class="think-box-trigger">🤔 Think first, then click!</button>
                    <div class="think-box-answer">O(n) is an extremely rare worst case where all keys have the same hash value. <strong>On average, it's O(1)</strong>, and with a good hash function, collisions are nearly nonexistent! <span class="lang-py">In practice, Python's <code>dict</code> automatically doubles the table size when it's more than 2/3 full to prevent collisions.</span><span class="lang-cpp">In practice, C++'s <code>unordered_map</code> automatically increases the bucket count (rehash) when the load factor (default 1.0) is exceeded to prevent collisions.</span></div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        container.querySelectorAll('.think-box-trigger').forEach(btn => {
            btn.addEventListener('click', () => { const box = btn.closest('.think-box'); box.classList.add('revealed'); btn.style.display = 'none'; });
        });
    },

    // ===== Visualization Tab (concept tab stub) =====
    renderVisualize(container) { container.innerHTML = ''; },

    // ===== Hash Table Insert Visualization (concept tab only) =====
    _renderVizHashTableInsert(container) {
        const self = this;
        self._clearVizState();

        const DEFAULT_ITEMS = 'apple 3, banana 5, cherry 2, date 8, elderberry 1';
        const TABLE_SIZE = 7;

        function simpleHash(key) {
            let h = 0;
            for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % TABLE_SIZE;
            return h;
        }

        function parseItems(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length < 2) return null;
                return { key: parts[0], val: parts.slice(1).join(' ') };
            }).filter(function(x) { return x !== null && x.key; });
        }

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>Hash Table Insert Visualization</h2>
                <p class="hero-sub">Watch how keys are converted by a hash function and placed into the table.</p>
            </div>
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">Key-Value Pairs: <input type="text" id="ht-insert-input" value="${DEFAULT_ITEMS}" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-insert-reset">🔄</button>
            </div>
            ${self._createStepDesc()}
            <div class="sim-card">
                <div style="display:flex;gap:24px;margin-top:0;flex-wrap:wrap;width:100%;">
                    <div style="flex:1;min-width:200px;">
                        <div style="font-weight:700;margin-bottom:8px;">Hash Table (size ${TABLE_SIZE})</div>
                        <div id="ht-table" style="display:flex;flex-direction:column;gap:4px;"></div>
                    </div>
                    <div style="flex:1;min-width:150px;">
                        <div style="font-weight:700;margin-bottom:8px;">Current Operation</div>
                        <div id="ht-info" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">▶ Click Next to start</div>
                    </div>
                </div>
            </div>
            ${self._createStepControls()}
        `;

        const tableEl = container.querySelector('#ht-table');
        const infoEl = container.querySelector('#ht-info');

        function renderEmptyTable() {
            tableEl.innerHTML = '';
            for (let i = 0; i < TABLE_SIZE; i++) {
                const row = document.createElement('div');
                row.className = 'str-char-box';
                row.dataset.idx = i;
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                row.innerHTML = '<span style="font-weight:700;color:var(--text3);min-width:20px;">[' + i + ']</span><span class="ht-content" style="font-weight:600;">\u2014</span>';
                tableEl.appendChild(row);
            }
        }

        function setSlot(idx, text, cls) {
            const row = tableEl.querySelector('[data-idx="' + idx + '"]');
            if (row) {
                row.querySelector('.ht-content').textContent = text;
                row.className = 'str-char-box' + (cls ? ' ' + cls : '');
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
            }
        }

        function saveState() {
            return {
                table: Array.from(tableEl.querySelectorAll('.str-char-box')).map(r => ({ cls: r.className, text: r.querySelector('.ht-content').textContent })),
                info: infoEl.innerHTML
            };
        }
        function restoreState(s) {
            tableEl.querySelectorAll('.str-char-box').forEach((r, i) => {
                r.className = s.table[i].cls;
                r.querySelector('.ht-content').textContent = s.table[i].text;
            });
            infoEl.innerHTML = s.info;
        }

        function buildAndRun() {
            self._clearVizState();
            var items = parseItems(container.querySelector('#ht-insert-input').value);
            if (items.length === 0) items = parseItems(DEFAULT_ITEMS);

            renderEmptyTable();
            infoEl.innerHTML = '▶ Click Next to start';

            const steps = [];
            const stored = {};

            items.forEach(function(item) {
                const h = simpleHash(item.key);
                steps.push({
                    description: '"' + item.key + '" \u2192 hash into slot ' + h + '!',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        for (let i = 0; i < TABLE_SIZE; i++) {
                            const row = tableEl.querySelector('[data-idx="' + i + '"]');
                            if (row && row.classList.contains('comparing')) {
                                row.className = 'str-char-box' + (stored[i] ? ' matched' : '');
                                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                            }
                        }
                        stored[h] = stored[h] ? stored[h] + ', ' + item.key + ':' + item.val : item.key + ':' + item.val;
                        setSlot(h, stored[h], 'comparing');
                        infoEl.innerHTML = 'hash("' + item.key + '") = <strong>' + h + '</strong><br>\u2192 table[' + h + '] = ' + item.key + ':' + item.val;
                    },
                    undo: function() { restoreState(this._before); }
                });

                steps.push({
                    description: '"' + item.key + '" stored \u2713',
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        setSlot(h, stored[h], 'matched');
                        infoEl.innerHTML = '\u2713 "' + item.key + '" stored successfully';
                    },
                    undo: function() { restoreState(this._before); }
                });
            });

            steps.push({
                description: 'All items inserted! 🎉',
                _before: null,
                action: function() {
                    this._before = saveState();
                    infoEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">\u2713 All items inserted successfully!</span>';
                },
                undo: function() { restoreState(this._before); }
            });

            self._initStepController(container, steps);
        }

        container.querySelector('#ht-insert-reset').addEventListener('click', buildAndRun);
        buildAndRun();
    },

    _vizState: { steps: [], currentStep: -1, keydownHandler: null },
    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },
    _createStepDesc(suffix) {
        const s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ Click Next to start</div>';
    },
    _createStepControls(suffix) {
        const s = suffix || '';
        return '<div class="viz-step-controls"><button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button><span id="viz-step-counter' + s + '" class="viz-step-counter">Before Start</span><button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button></div>';
    },
    _initStepController(el, steps, suffix) {
        const s = suffix || '';
        const state = this._vizState; state.steps = steps; state.currentStep = -1;
        const prevBtn = el.querySelector('#viz-prev' + s), nextBtn = el.querySelector('#viz-next' + s);
        const counter = el.querySelector('#viz-step-counter' + s), desc = el.querySelector('#viz-step-desc' + s);
        const updateUI = () => {
            const idx = state.currentStep, total = state.steps.length;
            prevBtn.disabled = (idx < 0); nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) { counter.textContent = 'Before Start'; desc.textContent = '▶ Click Next to start'; }
            else { counter.textContent = `Step ${idx + 1} / ${total}`; desc.textContent = state.steps[idx].description; }
        };
        var actionDelay = 350;
        nextBtn.addEventListener('click', () => { if (state.currentStep >= state.steps.length - 1) return; state.currentStep++; updateUI(); setTimeout(() => { state.steps[state.currentStep].action(); }, actionDelay); });
        prevBtn.addEventListener('click', () => { if (state.currentStep < 0) return; var stepToUndo = state.currentStep; state.currentStep--; updateUI(); setTimeout(() => { state.steps[stepToUndo].undo(); }, actionDelay); });
        const handleKeydown = (e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextBtn.click(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); prevBtn.click(); } };
        document.addEventListener('keydown', handleKeydown); state.keydownHandler = handleKeydown; updateUI();
    },

    // ===== Problem Simulation: Contains Duplicate =====
    _renderVizContainsDup(container) {
        const self = this;
        const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6];
        container.innerHTML = `
            ${self._createStepDesc('-cd')}
            <div class="sim-card">
                <div style="margin-bottom:16px;">
                    <label>Array: <input type="text" id="ht-cd-input" value="${DEFAULT_ARR.join(', ')}" style="width:280px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-cd-start" style="margin-left:8px;">🔄</button>
                </div>
                <div id="ht-cd-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                    <div>HashSet: <span id="ht-cd-set" style="font-weight:600;color:var(--accent);">{ }</span></div>
                    <div>Result: <span id="ht-cd-result" style="font-weight:600;">—</span></div>
                </div>
            </div>
            ${self._createStepControls('-cd')}
        `;
        const boxesEl = container.querySelector('#ht-cd-boxes');
        const setEl = container.querySelector('#ht-cd-set');
        const resultEl = container.querySelector('#ht-cd-result');

        container.querySelector('#ht-cd-start').addEventListener('click', function() {
            self._clearVizState();
            const arr = container.querySelector('#ht-cd-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            boxesEl.innerHTML = '';
            arr.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; boxesEl.appendChild(b); });
            setEl.textContent = '{ }'; resultEl.textContent = '—';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => b.className), set: setEl.textContent, result: resultEl.textContent };
            }
            function restoreState(s) {
                Array.from(boxesEl.children).forEach((b, i) => b.className = s.boxes[i]);
                setEl.textContent = s.set; resultEl.textContent = s.result;
            }

            const steps = [];
            const seen = new Set();
            const buildSeen = new Set();
            let found = false;
            arr.forEach((v, i) => {
                if (found) return;
                const isDup = buildSeen.has(v);
                buildSeen.add(v);
                if (isDup) found = true;
                steps.push({ description: isDup ? `${v} → Duplicate found! 🎉` : `${v} → Not seen, store it!`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach(b => { if (b.classList.contains('comparing')) b.className = 'str-char-box matched'; });
                        boxesEl.children[i].className = 'str-char-box comparing';
                        if (seen.has(v)) {
                            resultEl.innerHTML = '<span style="color:var(--green);">✓ Duplicate found! → true</span>';
                            boxesEl.children[i].className = 'str-char-box' + ' comparing';
                            boxesEl.children[i].style.background = '#e17055'; boxesEl.children[i].style.color = '#fff';
                            found = true;
                        } else {
                            seen.add(v);
                            setEl.textContent = '{ ' + Array.from(seen).join(', ') + ' }';
                        }
                    },
                    undo: function() { restoreState(this._before); if (found) { found = false; seen.delete(v); } boxesEl.children[i].style.background = ''; boxesEl.children[i].style.color = ''; }
                });
            });
            if (!found) {
                steps.push({ description: 'All checked → No duplicates!', _before: null,
                    action: function() { this._before = saveState(); resultEl.innerHTML = '<span style="color:var(--accent);">No duplicates → false</span>'; },
                    undo: function() { restoreState(this._before); }
                });
            }
            found = false;
            self._initStepController(container, steps, '-cd');
        });
        container.querySelector('#ht-cd-start').click();
    },

    // ===== Problem Simulation: Longest Substring Without Repeating =====
    _renderVizLongestSub(container) {
        const self = this;
        const DEFAULT_STR = 'abcabcbb';
        container.innerHTML = `
            ${self._createStepDesc('-ls')}
            <div class="sim-card">
                <div style="margin-bottom:16px;">
                    <label>String: <input type="text" id="ht-ls-input" value="${DEFAULT_STR}" style="width:200px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-ls-start" style="margin-left:8px;">🔄</button>
                </div>
                <div id="ht-ls-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;"></div>
                <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px;">
                    <div>seen: <span id="ht-ls-map" style="font-weight:600;color:var(--accent);">{ }</span></div>
                    <div>start = <span id="ht-ls-start-val" style="font-weight:600;">0</span></div>
                    <div>Max Length = <span id="ht-ls-max" style="font-weight:600;color:var(--green);">0</span></div>
                </div>
            </div>
            ${self._createStepControls('-ls')}
        `;
        const boxesEl = container.querySelector('#ht-ls-boxes');
        const mapEl = container.querySelector('#ht-ls-map');
        const startValEl = container.querySelector('#ht-ls-start-val');
        const maxEl = container.querySelector('#ht-ls-max');

        container.querySelector('#ht-ls-start').addEventListener('click', function() {
            self._clearVizState();
            const s = container.querySelector('#ht-ls-input').value;
            boxesEl.innerHTML = '';
            s.split('').forEach((c, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = c; b.dataset.idx = i; boxesEl.appendChild(b); });
            mapEl.textContent = '{ }'; startValEl.textContent = '0'; maxEl.textContent = '0';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => b.className), map: mapEl.textContent, start: startValEl.textContent, max: maxEl.textContent };
            }
            function restoreState(st) {
                Array.from(boxesEl.children).forEach((b, i) => b.className = st.boxes[i]);
                mapEl.textContent = st.map; startValEl.textContent = st.start; maxEl.textContent = st.max;
            }

            const steps = [];
            const seen = {};
            let start = 0, maxLen = 0;
            for (let i = 0; i < s.length; i++) {
                const c = s[i];
                const oldStart = start;
                if (seen[c] !== undefined && seen[c] >= start) start = seen[c] + 1;
                seen[c] = i;
                const curLen = i - start + 1;
                if (curLen > maxLen) maxLen = curLen;

                const capturedStart = start, capturedMax = maxLen, capturedSeen = JSON.parse(JSON.stringify(seen));
                const movedStart = start !== oldStart;
                steps.push({ description: `'${c}' → ${movedStart ? 'Duplicate! Move start, ' : ''}length ${curLen}${curLen === capturedMax && curLen > 0 ? ' → New max! 🎉' : ''}`,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach((b, j) => {
                            b.className = 'str-char-box' + (j >= capturedStart && j <= i ? ' matched' : '');
                        });
                        boxesEl.children[i].className = 'str-char-box comparing';
                        const mapEntries = Object.entries(capturedSeen).map(([k, v]) => `'${k}':${v}`).join(', ');
                        mapEl.textContent = '{ ' + mapEntries + ' }';
                        startValEl.textContent = capturedStart;
                        maxEl.textContent = capturedMax;
                    },
                    undo: function() { restoreState(this._before); }
                });
            }
            steps.push({ description: `Done! Max length ${maxLen} 🎉`, _before: null,
                action: function() { this._before = saveState(); maxEl.innerHTML = '<span style="color:var(--green);font-size:1.1rem;">✓ ' + maxLen + '</span>'; },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ls');
        });
        container.querySelector('#ht-ls-start').click();
    },

    // ===== Problem Simulation: Subarray Sum Equals K =====
    _renderVizSubarraySum(container) {
        const self = this;
        const DEFAULT_ARR = [1, 2, 1, 3, 2, 1, 1, 2];
        const DEFAULT_K = 3;
        container.innerHTML = `
            ${self._createStepDesc('-ss')}
            <div class="sim-card">
                <div style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                    <label>Array: <input type="text" id="ht-ss-input" value="${DEFAULT_ARR.join(', ')}" style="width:280px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <label>k: <input type="number" id="ht-ss-k" value="${DEFAULT_K}" style="width:60px;padding:6px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"></label>
                    <button class="btn btn-primary" id="ht-ss-start">🔄</button>
                </div>
                <div id="ht-ss-boxes" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px;"></div>
                <div id="ht-ss-explain" style="padding:12px 16px;border-radius:10px;border:1px solid var(--border);background:var(--bg);margin-bottom:12px;">
                    <div style="display:flex;flex-direction:column;gap:6px;font-size:0.9rem;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:0.82rem;color:var(--text2);font-weight:600;">Prefix Sum Comparison</span>
                            <span style="font-size:0.82rem;">Subarrays found: <strong id="ht-ss-cnt" style="color:var(--green);">0</strong></span>
                        </div>
                        <div>① Sum so far: <span id="ht-ss-sum" style="font-weight:700;">—</span></div>
                        <div>② Previous prefix sum: <span id="ht-ss-lookup" style="font-weight:700;">—</span></div>
                        <div id="ht-ss-result" style="border-top:1px dashed var(--border);padding-top:6px;margin-top:2px;font-weight:600;color:var(--text3);">—</div>
                    </div>
                </div>
                <div style="margin-bottom:12px;width:100%;">
                    <div style="font-weight:600;margin-bottom:6px;font-size:0.88rem;color:var(--text2);">③ Sum Record <span style="font-weight:400;font-size:0.82rem;">(How many times has the sum been X so far?)</span></div>
                    <div id="ht-ss-pc" style="display:flex;flex-direction:column;gap:3px;"></div>
                </div>
            </div>
            ${self._createStepControls('-ss')}
        `;
        const boxesEl = container.querySelector('#ht-ss-boxes');
        const explainEl = container.querySelector('#ht-ss-explain');
        const sumEl = container.querySelector('#ht-ss-sum');
        const lookupEl = container.querySelector('#ht-ss-lookup');
        const resultEl = container.querySelector('#ht-ss-result');
        const pcEl = container.querySelector('#ht-ss-pc');
        const cntEl = container.querySelector('#ht-ss-cnt');

        container.querySelector('#ht-ss-start').addEventListener('click', function() {
            self._clearVizState();
            const arr = container.querySelector('#ht-ss-input').value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const k = parseInt(container.querySelector('#ht-ss-k').value) || 0;
            boxesEl.innerHTML = '';
            arr.forEach((v, i) => { const b = document.createElement('div'); b.className = 'str-char-box'; b.textContent = v; b.dataset.idx = i; boxesEl.appendChild(b); });
            function renderPcTable(pc, highlightKey) {
                return Object.entries(pc).map(function(e) {
                    var key = e[0], val = e[1];
                    var isHL = highlightKey !== undefined && String(key) === String(highlightKey);
                    return '<div style="display:flex;gap:8px;align-items:center;padding:5px 12px;border-radius:6px;font-size:0.9rem;' +
                        (isHL ? 'background:rgba(108,92,231,0.15);border:1px solid var(--accent);' : 'background:var(--bg);border:1px solid var(--border);') +
                        '"><span style="color:var(--text2);">sum=</span>' +
                        '<span style="font-weight:700;min-width:20px;text-align:center;">' + key + '</span>' +
                        '<span style="color:var(--text2);">seen:</span>' +
                        '<span style="font-weight:700;color:' + (isHL ? 'var(--accent)' : 'var(--text)') + ';">' + val + ' time(s)</span>' +
                        (isHL ? '<span style="color:var(--accent);font-weight:600;margin-left:auto;">← Found!</span>' : '') + '</div>';
                }).join('');
            }
            sumEl.innerHTML = '—'; lookupEl.innerHTML = '—'; resultEl.innerHTML = '—'; resultEl.style.color = 'var(--text3)';
            explainEl.style.borderColor = 'var(--border)'; explainEl.style.background = 'var(--bg)';
            pcEl.innerHTML = renderPcTable({0: 1}); cntEl.textContent = '0';

            function saveState() {
                return { boxes: Array.from(boxesEl.children).map(b => ({ cls: b.className, st: b.style.cssText })),
                    sum: sumEl.innerHTML, lookup: lookupEl.innerHTML, result: resultEl.innerHTML, resultColor: resultEl.style.color,
                    explainBorder: explainEl.style.borderColor, explainBg: explainEl.style.background,
                    pc: pcEl.innerHTML, cnt: cntEl.innerHTML };
            }
            function restoreState(s) {
                Array.from(boxesEl.children).forEach((b, i) => { b.className = s.boxes[i].cls; b.style.cssText = s.boxes[i].st; });
                sumEl.innerHTML = s.sum; lookupEl.innerHTML = s.lookup;
                resultEl.innerHTML = s.result; resultEl.style.color = s.resultColor;
                explainEl.style.borderColor = s.explainBorder; explainEl.style.background = s.explainBg;
                pcEl.innerHTML = s.pc; cntEl.innerHTML = s.cnt;
            }

            const steps = [];
            const prefixCount = { 0: 1 };
            const prefixLastPos = { 0: -1 };
            let prefixSum = 0, count = 0;

            arr.forEach((num, i) => {
                prefixSum += num;
                const diff = prefixSum - k;
                const found = prefixCount[diff] || 0;
                var subStart = -1, subEnd = -1;
                if (found > 0 && diff in prefixLastPos) { subStart = prefixLastPos[diff] + 1; subEnd = i; }

                const countBefore = count;
                count += found;
                const countAfter = count;

                const pcBeforeRecord = JSON.parse(JSON.stringify(prefixCount));
                prefixCount[prefixSum] = (prefixCount[prefixSum] || 0) + 1;
                if (!(prefixSum in prefixLastPos)) prefixLastPos[prefixSum] = i;
                const pcAfterRecord = JSON.parse(JSON.stringify(prefixCount));

                // Capture values
                const cs = prefixSum, cd = diff, cf = found;
                const cSS = subStart, cSE = subEnd;
                var formula = arr.slice(0, i + 1).join(' + ') + ' = <strong>' + cs + '</strong>';
                var prevPos = cSS >= 0 ? cSS - 1 : -99;
                var prevPosLabel = prevPos < 0 ? 'Before Start' : 'index ' + prevPos;

                // ──── Step A: Add ────
                steps.push({ description: 'arr[' + i + '] = ' + num + ' add → sum so far = ' + cs,
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j < i ? ' matched' : ''); b.style.cssText = ''; });
                        boxesEl.children[i].className = 'str-char-box comparing';
                        sumEl.innerHTML = formula;
                        lookupEl.innerHTML = '—';
                        resultEl.innerHTML = '—'; resultEl.style.color = 'var(--text3)';
                        explainEl.style.borderColor = 'var(--border)'; explainEl.style.background = 'var(--bg)';
                        pcEl.innerHTML = renderPcTable(pcBeforeRecord);
                        cntEl.textContent = countBefore;
                    },
                    undo: function() { restoreState(this._before); }
                });

                if (cf > 0) {
                    // ──── Step B: Lookup (match found) ────
                    var lookupMatch = cs + ' − ' + k + ' = <strong>' + cd + '</strong>' +
                        ' → <span style="color:var(--green);">Point where sum=' + cd + ': ' + prevPosLabel + '!</span>';

                    steps.push({ description: 'Was there a point where sum=' + cd + '? → Yes! (' + prevPosLabel + ')',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j < i ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[i].className = 'str-char-box comparing';
                            sumEl.innerHTML = formula;
                            lookupEl.innerHTML = lookupMatch;
                            resultEl.innerHTML = '—'; resultEl.style.color = 'var(--text3)';
                            explainEl.style.borderColor = 'var(--accent)'; explainEl.style.background = 'rgba(108,92,231,0.05)';
                            pcEl.innerHTML = renderPcTable(pcBeforeRecord, cd);
                            cntEl.textContent = countBefore;
                        },
                        undo: function() { restoreState(this._before); }
                    });

                    // ──── Step C: Found! ────
                    var subArr = arr.slice(cSS, cSE + 1);
                    var resultMatch = '→ After ' + prevPosLabel + ' (index ' + cSS + ') ~ here (index ' + cSE + ') = <strong>[' + subArr.join(', ') + ']</strong>, sum = ' + cs + ' − ' + cd + ' = ' + k + ' = k ✅';

                    steps.push({ description: '[' + subArr.join(', ') + '] found! sum = ' + k + ' 🎉',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j <= i ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[i].className = 'str-char-box comparing';
                            for (var j = cSS; j <= cSE; j++) {
                                boxesEl.children[j].style.cssText = 'border-bottom:3px solid var(--green);background:rgba(0,184,148,0.12);';
                            }
                            sumEl.innerHTML = formula;
                            lookupEl.innerHTML = lookupMatch;
                            resultEl.innerHTML = resultMatch; resultEl.style.color = 'var(--green)';
                            explainEl.style.borderColor = 'var(--green)'; explainEl.style.background = 'rgba(0,184,148,0.06)';
                            pcEl.innerHTML = renderPcTable(pcAfterRecord);
                            cntEl.textContent = countAfter;
                        },
                        undo: function() { restoreState(this._before); }
                    });
                } else {
                    // ──── Step B: Lookup (no match) ────
                    var lookupMiss = cs + ' − ' + k + ' = <strong>' + cd + '</strong>' +
                        ' → <span style="color:var(--text3);">No point where sum=' + cd + '</span>';

                    steps.push({ description: 'Was there a point where sum=' + cd + '? → No. Skip',
                        _before: null,
                        action: function() {
                            this._before = saveState();
                            Array.from(boxesEl.children).forEach(function(b, j) { b.className = 'str-char-box' + (j <= i ? ' matched' : ''); b.style.cssText = ''; });
                            boxesEl.children[i].className = 'str-char-box comparing';
                            sumEl.innerHTML = formula;
                            lookupEl.innerHTML = lookupMiss;
                            resultEl.innerHTML = '→ No contiguous subarray'; resultEl.style.color = 'var(--text3)';
                            explainEl.style.borderColor = 'var(--border)'; explainEl.style.background = 'var(--bg)';
                            pcEl.innerHTML = renderPcTable(pcAfterRecord);
                            cntEl.textContent = countAfter;
                        },
                        undo: function() { restoreState(this._before); }
                    });
                }
            });

            steps.push({ description: 'Done! Total ' + count + ' subarrays with sum ' + k + ' 🎉', _before: null,
                action: function() {
                    this._before = saveState();
                    Array.from(boxesEl.children).forEach(function(b) { b.className = 'str-char-box matched'; b.style.cssText = ''; });
                    resultEl.innerHTML = '✅ Found <strong>' + count + '</strong> total!'; resultEl.style.color = 'var(--green)';
                    explainEl.style.borderColor = 'var(--green)'; explainEl.style.background = 'rgba(0,184,148,0.06)';
                    cntEl.innerHTML = '<span style="color:var(--green);">' + count + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-ss');
        });
        container.querySelector('#ht-ss-start').click();
    },

    // ===== Problem Simulation: People at Company =====
    _renderVizCompany(container) {
        const self = this;
        const DEFAULT_LOGS = 'Baha enter, Asber enter, Baha leave, Artem enter';

        function parseLogs(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length < 2) return null;
                var name = parts[0];
                var action = parts[1].toLowerCase();
                if (action !== 'enter' && action !== 'leave') return null;
                return { name: name, action: action };
            }).filter(function(x) { return x !== null; });
        }

        container.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">
                <label style="font-weight:600;">Entry Logs: <input type="text" id="ht-company-input" value="${DEFAULT_LOGS}" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:380px;background:var(--card);color:var(--text);"></label>
                <button class="btn btn-primary" id="ht-company-reset">🔄</button>
            </div>
            ${self._createStepDesc('-co')}
            <div class="sim-card">
                <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:16px;width:100%;">
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:8px;">Entry Logs</div>
                        <div id="ht-co-logs" style="display:flex;flex-direction:column;gap:4px;"></div>
                    </div>
                    <div style="flex:1;min-width:180px;">
                        <div style="font-weight:700;margin-bottom:8px;">People at Company (Set)</div>
                        <div id="ht-co-set" class="graph-queue-display" style="min-height:60px;padding:12px;font-size:0.95rem;">{ }</div>
                    </div>
                </div>
                <div>Result (Reverse Alphabetical): <span id="ht-co-result" style="font-weight:600;">\u2014</span></div>
            </div>
            ${self._createStepControls('-co')}
        `;
        const logsEl = container.querySelector('#ht-co-logs');
        const setEl = container.querySelector('#ht-co-set');
        const resultEl = container.querySelector('#ht-co-result');

        function renderLogRows(logs) {
            logsEl.innerHTML = '';
            logs.forEach(function(log, i) {
                const row = document.createElement('div');
                row.className = 'str-char-box';
                row.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                row.innerHTML = '<span style="font-weight:600;">' + log.name + '</span> <span style="color:' + (log.action === 'enter' ? 'var(--green)' : 'var(--red, #e17055)') + '">' + log.action + '</span>';
                row.dataset.idx = i;
                logsEl.appendChild(row);
            });
        }

        function saveState() {
            return { logs: Array.from(logsEl.children).map(r => r.className), set: setEl.textContent, result: resultEl.textContent };
        }
        function restoreState(s) {
            Array.from(logsEl.children).forEach((r, i) => { r.className = s.logs[i]; r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;'; });
            setEl.textContent = s.set; resultEl.textContent = s.result;
        }

        function buildAndRun() {
            self._clearVizState();
            var logs = parseLogs(container.querySelector('#ht-company-input').value);
            if (logs.length === 0) logs = parseLogs(DEFAULT_LOGS);

            renderLogRows(logs);
            setEl.textContent = '{ }';
            resultEl.textContent = '\u2014';

            const steps = [];
            const company = new Set();
            logs.forEach(function(log, i) {
                const isEnter = log.action === 'enter';
                steps.push({ description: log.name + ' ' + (isEnter ? 'enters! 📥' : 'leaves! 📤'),
                    _before: null,
                    action: function() {
                        this._before = saveState();
                        Array.from(logsEl.children).forEach(r => { if (r.classList.contains('comparing')) { r.className = 'str-char-box matched'; r.style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;'; } });
                        logsEl.children[i].className = 'str-char-box comparing';
                        logsEl.children[i].style.cssText = 'flex-direction:row;gap:8px;justify-content:flex-start;padding:8px 12px;min-width:100%;';
                        if (isEnter) company.add(log.name); else company.delete(log.name);
                        setEl.textContent = company.size > 0 ? '{ ' + Array.from(company).join(', ') + ' }' : '{ }';
                    },
                    undo: function() { restoreState(this._before); if (isEnter) company.delete(log.name); else company.add(log.name); }
                });
            });
            steps.push({ description: 'Sort in reverse alphabetical order! 🎉', _before: null,
                action: function() {
                    this._before = saveState();
                    const sorted = Array.from(company).sort().reverse();
                    resultEl.innerHTML = '<span style="color:var(--green);">' + sorted.join(', ') + '</span>';
                },
                undo: function() { restoreState(this._before); }
            });
            self._initStepController(container, steps, '-co');
        }

        container.querySelector('#ht-company-reset').addEventListener('click', buildAndRun);
        buildAndRun();
    },

    // ===== Problem Solving Tab =====
    stages: [
        { num: 1, title: 'HashMap Basics', desc: 'Frequency, existence check, mapping (Easy~Silver)', problemIds: ['lc-217', 'lc-3'] },
        { num: 2, title: 'HashMap Applications', desc: 'Pattern matching, contiguous subarrays (Medium~Gold)', problemIds: ['lc-560', 'boj-7785'] }
    ],

    problems: [
        {
            id: 'lc-217',
            title: 'LeetCode 217 - Contains Duplicate',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/contains-duplicate/',
            descriptionHTML: `<h3>Problem</h3>
                <p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,2,3,1]</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,2,3,4]</pre></div>
                    <div><strong>Output</strong><pre>false</pre></div>
                </div></div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,1,1,3,3,4,3,2,4,2]</pre></div>
                    <div><strong>Output</strong><pre>true</pre></div>
                </div></div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ nums.length ≤ 10⁵</li>
                    <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it without extra space by using sorting?</p>`,
            hints: [
                { title: 'Understanding the problem', content: 'In <code>[1, 2, 3, 1]</code>, <strong>1 appears twice</strong>, so there is a duplicate → <code>true</code>.<br><code>[1, 2, 3, 4]</code> has all different numbers → <code>false</code>.<br>All we need to check is <strong>"does any number appear more than once?"</strong>' },
                { title: 'The simplest approach?', content: 'Compare every pair of numbers. Compare the first number with all others, then the second with all others...<br>A nested for loop would work, but with <strong>100,000 numbers</strong>, that is about <strong>5 billion comparisons</strong>! Way too slow 😱' },
                { title: 'Remembering "have I seen this before?"', content: 'What if we check each number one by one, asking <strong>"have I seen this number before?"</strong><br>We just need to store the numbers we have seen somewhere. What data structure would be good for this?' },
                { title: 'Using a Set gives O(1)!', content: 'A Set checks "does this value exist?" in <strong>O(1)</strong>!<br><br>1. Take a number<br>2. Already in the set? → Return <code>true</code>!<br>3. Not there? → Add to set and move on<br><br><span class="lang-py">Python: <code>set()</code> → check with <code>in</code>, add with <code>add()</code></span><span class="lang-cpp">C++: <code>unordered_set&lt;int&gt;</code> → check with <code>count()</code>, add with <code>insert()</code></span><br><br>We only scan the array once, so it is <strong>O(n)</strong>.' },
                { title: 'You can also use sorting', content: 'If you sort the array, identical numbers are placed <strong>next to each other</strong>.<br><code>[1, 3, 1, 2]</code> → sort → <code>[1, 1, 2, 3]</code><br>Just compare neighbors — simple!<br>However, sorting takes <strong>O(n log n)</strong>, which is slower than the set approach at O(n).' }
            ],
            simIntro: 'Watch how elements are added to a HashSet while iterating through the array to detect duplicates!',
            inputDefault: 0, solve() { return 'true'; },
            templates: {
                python: `class Solution:
    def containsDuplicate(self, nums):
        seen = set()
        for n in nums:
            if n in seen: return True
            seen.add(n)
        return False`,
                cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Compare all pairs using nested for loops to check for duplicates',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:
    def containsDuplicate(self, nums):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False`,
                    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        for (int i = 0; i < nums.size(); i++)
            for (int j = i + 1; j < nums.size(); j++)
                if (nums[i] == nums[j]) return true;
        return false;
    }
};`
                }
            }, {
                approach: 'HashSet',
                description: 'Iterate with O(1) existence check using a HashSet',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: 'Function definition', desc: 'Check if the integer array nums contains any duplicates.', code: 'class Solution:\n    def containsDuplicate(self, nums):' },
                        { title: 'Initialize HashSet', desc: 'A set can check "have I seen this number?" in O(1)!\nList\'s in is O(n), but set\'s in is O(1).', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        # set → O(1) membership check\n        seen = set()' },
                        { title: 'Iterate and check duplicates', desc: 'If a number was already seen, return True immediately (duplicate found!)\nIf it is new, add it to the set to record it.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:      # Already seen → duplicate!\n                return True\n            seen.add(n)        # First time seeing this → record it' },
                        { title: 'Return Result', desc: 'If all numbers were checked with no duplicates, return False.', code: 'class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for n in nums:\n            if n in seen:\n                return True\n            seen.add(n)\n        return False  # No duplicates found' }
                    ],
                    cpp: [
                        { title: 'Function definition + Set init', desc: 'unordered_set allows O(1) membership checks.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // HashSet with O(1) lookup\n        unordered_set<int> seen;' },
                        { title: 'Iterate and check duplicates', desc: 'If already present, return true (duplicate!). Otherwise insert to record it.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true; // Duplicate!\n            seen.insert(n); // Record it\n        }' },
                        { title: 'Return Result', desc: 'If no duplicates found after full traversal, return false.', code: 'class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-3',
            title: 'LeetCode 3 - Longest Substring Without Repeating',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            descriptionHTML: `<h3>Problem</h3>
                <p>Given a string <code>s</code>, find the length of the <strong>longest substring without repeating characters</strong>.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "abcabcbb"</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">"abc" is the longest substring without repeating characters.</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "bbbbb"</pre></div>
                    <div><strong>Output</strong><pre>1</pre></div>
                </div>
                <p class="example-explain">"b" is the longest, with a length of 1.</p>
                </div>

                <div class="problem-example"><h4>Example 3</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>s = "pwwkew"</pre></div>
                    <div><strong>Output</strong><pre>3</pre></div>
                </div>
                <p class="example-explain">"wke" is the answer. Note that "pwke" is a subsequence, not a substring.</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>0 ≤ s.length ≤ 5 × 10⁴</li>
                    <li>s consists of English letters, digits, symbols, and spaces</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Can you solve it in O(n) with a single pass?</p>`,
            hints: [
                { title: 'Understanding the problem', content: 'Try finding non-repeating windows in <code>"abcabcbb"</code>.<br><code>"abc"</code> → 3 characters (no repeats ✓)<br><code>"abca"</code> → "a" appears twice! (repeat ✗)<br>Find the length of the <strong>longest window without repeating characters</strong>.' },
                { title: 'Checking all windows?', content: 'You could pick a start and end point to form every possible substring.<br>But if the length is n, there are about <strong>n² substrings</strong>... way too many!' },
                { title: 'Sliding window idea', content: 'Slide a window by moving the <strong>start (L)</strong> and <strong>end (R)</strong> to the right.<br><br>1. No repeats → move R right (expand the window)<br>2. Repeat found → move L right (shrink the window)<br><br>This way, you can find the answer without checking every window!' },
                { title: 'Remember duplicate positions with a hashmap', content: 'Store the <strong>last position where each character appeared</strong> in a hashmap.<br>When a duplicate occurs, you immediately know where to move L!<br><br><span class="lang-py">Python: <code>seen = {"a": 0, "b": 1}</code> (dict)</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, int&gt; seen;</code></span><br><br>If "a" appears again → move L to <code>seen["a"] + 1</code>!' },
                { title: 'Time complexity is O(n)', content: 'R only moves right, and L only moves right.<br>Each character is processed exactly once, so it is <strong>O(n)</strong>!' }
            ],
            simIntro: 'Watch how sliding window + hashmap finds the longest substring without repeating characters!',
            inputDefault: 0, solve() { return '3'; },
            templates: {
                python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        start = max_len = 0
        for i, c in enumerate(s):
            if c in seen and seen[c] >= start:
                start = seen[c] + 1
            seen[c] = i
            max_len = max(max_len, i - start + 1)
        return max_len`,
                cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int start = 0, maxLen = 0;
        for (int i = 0; i < s.size(); i++) {
            if (seen.count(s[i]) && seen[s[i]] >= start)
                start = seen[s[i]] + 1;
            seen[s[i]] = i;
            maxLen = max(maxLen, i - start + 1);
        }
        return maxLen;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check all substrings to find the maximum length without repeats',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(min(m,n))',
                templates: {
                    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_len = 0
        for i in range(len(s)):
            seen = set()
            for j in range(i, len(s)):
                if s[j] in seen:
                    break
                seen.add(s[j])
            max_len = max(max_len, len(seen))
        return max_len`,
                    cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLen = 0;
        for (int i = 0; i < s.size(); i++) {
            unordered_set<char> seen;
            for (int j = i; j < s.size(); j++) {
                if (seen.count(s[j])) break;
                seen.insert(s[j]);
            }
            maxLen = max(maxLen, (int)seen.size());
        }
        return maxLen;
    }
};`
                }
            }, {
                approach: 'Sliding Window + HashMap',
                description: 'Track last seen position with a hashmap while expanding the window',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(min(m,n))',
                get templates() { return hashTableTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: 'Function definition', desc: 'Find the length of the longest substring without repeating characters in string s.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:' },
                        { title: 'Initialize variables', desc: 'seen: character → last seen position (for duplicate checking)\nstart: start of the current window\nmax_len: maximum length found so far', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}          # {char: last position}\n        start = max_len = 0' },
                        { title: 'Iterate through string', desc: 'Process one character at a time while managing the sliding window.\ni is the window end (right), start is the window start (left).', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):' },
                        { title: 'Key: Handle duplicate characters', desc: 'Key insight! If a previously seen character is within the current window,\nmove start past that character → remove the duplicate!\nThe seen[c] >= start condition checks "is it inside the window?".', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            # If same char exists in the window\n            # → move start past it (remove duplicate)\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1' },
                        { title: 'Record position + update length', desc: 'Record the current character position,\nthen compare window size (i - start + 1) with the maximum length.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i  # Record current position\n            max_len = max(max_len, i - start + 1)' },
                        { title: 'Return Result', desc: 'Return the length of the longest substring without repeating characters.', code: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        seen = {}\n        start = max_len = 0\n        for i, c in enumerate(s):\n            if c in seen and seen[c] >= start:\n                start = seen[c] + 1\n            seen[c] = i\n            max_len = max(max_len, i - start + 1)\n        return max_len' }
                    ],
                    cpp: [
                        { title: 'Function definition + init', desc: 'seen: record last position of each character (O(1) lookup)\nstart: window start, maxLen: maximum length', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen; // {char: position}\n        int start = 0, maxLen = 0;' },
                        { title: 'Iterate + handle duplicates', desc: 'If the same character exists in the window, move start to remove the duplicate.\nRecord current position, then compare window size with the max.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            // Duplicate in window → move start\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i; // Record position\n            maxLen = max(maxLen, i - start + 1);\n        }' },
                        { title: 'Return Result', desc: 'Return the maximum length.', code: 'class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> seen;\n        int start = 0, maxLen = 0;\n        for (int i = 0; i < s.size(); i++) {\n            if (seen.count(s[i]) && seen[s[i]] >= start)\n                start = seen[s[i]] + 1;\n            seen[s[i]] = i;\n            maxLen = max(maxLen, i - start + 1);\n        }\n        return maxLen;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'lc-560',
            title: 'LeetCode 560 - Subarray Sum Equals K',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
            descriptionHTML: `<h3>Problem</h3>
                <p>Given an array of integers <code>nums</code> and an integer <code>k</code>, return the total number of <strong>contiguous subarrays</strong> whose sum equals <code>k</code>.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,1,1], k = 2</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div>
                <p class="example-explain">[1,1] (index 0~1) and [1,1] (index 1~2) — two subarrays</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>nums = [1,2,3], k = 3</pre></div>
                    <div><strong>Output</strong><pre>2</pre></div>
                </div>
                <p class="example-explain">[1,2] (index 0~1) and [3] (index 2) — two subarrays</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ nums.length ≤ 2 × 10⁴</li>
                    <li>-1000 ≤ nums[i] ≤ 1000</li>
                    <li>-10⁷ ≤ k ≤ 10⁷</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>Two pointers do not work because of negative numbers. Try using prefix sums!</p>`,
            hints: [
                { title: 'Understanding the problem', content: 'Find <strong>contiguous subarrays</strong> with sum equal to 2 in <code>[1, 1, 1]</code>.<br><code>[1,1]</code> (index 0~1) sum = 2 ✓<br><code>[1,1]</code> (index 1~2) sum = 2 ✓<br>→ The answer is <strong>2</strong>!' },
                { title: 'Checking all ranges?', content: 'You could compute the sum from start i to end j,<br>but that requires nested for loops — <strong>O(n²)</strong>. Is there a faster way?' },
                { title: 'What is a prefix sum?', content: 'It means continuously recording the running total from the start to the current position.<br><br>Prefix sums of <code>[1, 2, 3]</code>:<br>index 0: 1<br>index 1: 1+2 = 3<br>index 2: 1+2+3 = 6<br><br>Sum of range [1~2] = prefix[2] - prefix[0] = 6 - 1 = <strong>5</strong><br>You can get any range sum with just one subtraction!' },
                { title: 'Key idea: prefix sum - k', content: 'If the current prefix sum is <code>sum</code>,<br>and there was a previous point where the prefix sum was <code>sum - k</code>,<br>then the sum from that point to the current position is exactly <strong>k</strong>!<br><br>Store {prefix sum: occurrence count} in a hashmap<br>to check "how many times has sum - k appeared?" in <strong>O(1)</strong>!' },
                { title: 'Do not forget the initial value', content: 'You must start with <code>{0: 1}</code>.<br>Why? To avoid missing cases where the prefix sum itself equals k!<br><br>Example: <code>[3]</code>, k=3 → prefix sum is 3, and 3-3=0 must exist for it to count.<br>Without {0: 1}, this case would be missed.' }
            ],
            simIntro: 'Watch step by step how prefix sums and a hashmap count subarrays with sum equal to k!',
            inputDefault: 0, solve() { return '2'; },
            templates: {
                python: `class Solution:
    def subarraySum(self, nums, k):
        # {prefix_sum: occurrence count} record
        # {0: 1} → Before start, sum=0 exists once
        prefix_count = {0: 1}
        prefix_sum = 0  # Running total from start to current
        count = 0       # Number of subarrays with sum = k
        for num in nums:
            prefix_sum += num  # Update prefix sum
            # Key: if prefix_sum - k appeared before,
            # → the sum from that point to here = k!
            if (prefix_sum - k) in prefix_count:
                count += prefix_count[prefix_sum - k]
            # Record current prefix sum → later elements will look for this
            if prefix_sum in prefix_count:
                prefix_count[prefix_sum] += 1
            else:
                prefix_count[prefix_sum] = 1
        return count`,
                cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        // {prefix_sum: count} - starting point where sum=0 occurs once
        unordered_map<int, int> pc;
        pc[0] = 1;
        int sum = 0, cnt = 0; // prefix sum, result count
        for (int n : nums) {
            sum += n; // Update prefix sum
            // If sum - k appeared before → subarray sum = k
            if (pc.count(sum - k)) cnt += pc[sum - k];
            pc[sum]++; // Record current prefix sum
        }
        return cnt;
    }
};`
            },
            solutions: [{
                approach: 'Brute Force',
                description: 'Check sums of all contiguous subarrays using nested for loops',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(1)',
                templates: {
                    python: `class Solution:
    def subarraySum(self, nums, k):
        count = 0
        for i in range(len(nums)):
            total = 0
            for j in range(i, len(nums)):
                total += nums[j]
                if total == k:
                    count += 1
        return count`,
                    cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        int cnt = 0;
        for (int i = 0; i < nums.size(); i++) {
            int sum = 0;
            for (int j = i; j < nums.size(); j++) {
                sum += nums[j];
                if (sum == k) cnt++;
            }
        }
        return cnt;
    }
};`
                },
                codeSteps: {
                    python: [
                        { title: 'Function definition + count', desc: 'Create a variable to count subarrays with sum equal to k.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0  # Number of subarrays with sum = k' },
                        { title: 'Iterate start index i', desc: 'Try every starting position from 0 to the end.\nReset the range sum to 0 for each new start.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        # Try every possible start i\n        for i in range(len(nums)):\n            total = 0  # Fresh range sum from i' },
                        { title: 'Expand end j + compare sum', desc: 'Extend end point j one by one, accumulating the sum.\nIf the sum equals k, increment the count.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        for i in range(len(nums)):\n            total = 0\n            # Extend end j one by one, checking sum\n            for j in range(i, len(nums)):\n                total += nums[j]   # Include one more element\n                if total == k:     # Range sum = k → count it!\n                    count += 1' },
                        { title: 'Return Result', desc: 'After checking all start-end combinations, return the total count.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        count = 0\n        for i in range(len(nums)):\n            total = 0\n            for j in range(i, len(nums)):\n                total += nums[j]\n                if total == k:\n                    count += 1\n        return count' }
                    ],
                    cpp: [
                        { title: 'Function definition + count', desc: 'Initialize a counter for subarrays with sum equal to k.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0; // Number of subarrays with sum = k' },
                        { title: 'Nested loop + sum comparison', desc: 'Try every start i and end j, checking the range sum.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            int sum = 0; // Range sum from i\n            for (int j = i; j < nums.size(); j++) {\n                sum += nums[j]; // Add element\n                if (sum == k) cnt++; // Sum = k → count it\n            }\n        }' },
                        { title: 'Return Result', desc: 'Return the total count.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        int cnt = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            int sum = 0;\n            for (int j = i; j < nums.size(); j++) {\n                sum += nums[j];\n                if (sum == k) cnt++;\n            }\n        }\n        return cnt;\n    }\n};' }
                    ]
                }
            }, {
                approach: 'Prefix Sum + HashMap',
                description: 'Check prefix sum differences in O(1) using a hashmap',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: 'Function definition', desc: 'Takes integer array nums and target sum k.', code: 'class Solution:\n    def subarraySum(self, nums, k):' },
                        { title: 'Initialize prefix sum record', desc: '{0: 1} means "before the start, there is 1 point where the sum is 0."\nWithout this, we would miss cases where the range sum from the beginning equals k!', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        # {prefix_sum: occurrence count} record\n        # {0: 1} → Before start, sum=0 exists once\n        prefix_count = {0: 1}' },
                        { title: 'Initialize variables', desc: 'prefix_sum: tracks the running total from start to current\ncount: number of subarrays with sum = k', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0  # Running total from start to current\n        count = 0       # Number of subarrays with sum = k' },
                        { title: 'Loop + update prefix sum', desc: 'Iterate through the array, adding one element at a time\nto compute the running total from start to current.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            # Add current element to update prefix sum\n            prefix_sum += num' },
                        { title: 'Key: Find in previous prefix sums', desc: 'Key idea!\nIf a previous prefix sum of "prefix_sum - k" exists,\nthen the range from that point to here sums to exactly k!\nThanks to the hashmap, we can check in O(1)!', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            # Key: if prefix_sum - k appeared before,\n            # → the sum from that point to here = k!\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]' },
                        { title: 'Record current prefix sum', desc: 'Record the current prefix sum in the dictionary.\nLater elements will look for this value via "prefix_sum - k".', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]\n            # Record current prefix sum → later elements will look for this\n            if prefix_sum in prefix_count:\n                prefix_count[prefix_sum] += 1\n            else:\n                prefix_count[prefix_sum] = 1' },
                        { title: 'Return Result', desc: 'Return the total number of contiguous subarrays with sum equal to k.', code: 'class Solution:\n    def subarraySum(self, nums, k):\n        prefix_count = {0: 1}\n        prefix_sum = 0\n        count = 0\n        for num in nums:\n            prefix_sum += num\n            # Key: if prefix_sum - k appeared before,\n            # → the sum from that point to here = k!\n            if (prefix_sum - k) in prefix_count:\n                count += prefix_count[prefix_sum - k]\n            # Record current prefix sum → later elements will look for this\n            if prefix_sum in prefix_count:\n                prefix_count[prefix_sum] += 1\n            else:\n                prefix_count[prefix_sum] = 1\n        return count' }
                    ],
                    cpp: [
                        { title: 'Function definition', desc: 'Takes integer array and target sum k.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {' },
                        { title: 'Initialize prefix sum record', desc: '{0: 1} means "before the start, there is 1 point where sum is 0."\nWithout this, we would miss ranges from the beginning that sum to k.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        // {prefix_sum: count} - starting point sum=0 once\n        unordered_map<int, int> pc;\n        pc[0] = 1;' },
                        { title: 'Initialize variables', desc: 'sum is the running prefix sum, cnt is the result count.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0; // prefix sum, result count' },
                        { title: 'Loop + update prefix sum', desc: 'Add elements one by one to compute the running total from start to current.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n; // Update prefix sum' },
                        { title: 'Key: Find previous prefix sum + record', desc: 'If sum - k appeared before, that range sums to k!\nAlso record the current prefix sum so later elements can find it.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            // If sum - k appeared before → subarray sum = k\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++; // Record current prefix sum\n        }' },
                        { title: 'Return Result', desc: 'Return the total count.', code: 'class Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> pc;\n        pc[0] = 1;\n        int sum = 0, cnt = 0;\n        for (int n : nums) {\n            sum += n;\n            if (pc.count(sum - k)) cnt += pc[sum - k];\n            pc[sum]++;\n        }\n        return cnt;\n    }\n};' }
                    ]
                }
            }]
        },
        {
            id: 'boj-7785',
            title: 'BOJ 7785 - People at Company',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/7785',
            descriptionHTML: `<h3>Problem</h3>
                <p>You are given entry logs. <code>"enter"</code> means entering, <code>"leave"</code> means leaving.
                Print the <strong>people still remaining</strong> at the company in reverse alphabetical order.</p>

                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>4
Baha enter
Asber enter
Baha leave
Artem enter</pre></div>
                    <div><strong>Output</strong><pre>Asber
Artem</pre></div>
                </div>
                <p class="example-explain">Baha has left, so print the remaining Asber and Artem in reverse alphabetical order</p>
                </div>

                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2
Kim enter
Kim leave</pre></div>
                    <div><strong>Output</strong><pre>(none)</pre></div>
                </div>
                <p class="example-explain">Everyone has left, so no one remains</p>
                </div>

                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ n ≤ 10⁶</li>
                    <li>Names consist of uppercase and lowercase letters, length 1~20</li>
                    <li>The same name will not enter twice without leaving first</li>
                </ul>

                <h4>💡 Follow-up</h4>
                <p>What data structure supports O(1) insertion and deletion?</p>`,
            hints: [
                { title: 'Understanding the problem', content: 'People swipe a card at the company door.<br><code>enter</code> = coming to work (entering the company)<br><code>leave</code> = leaving work (exiting the company)<br><br>After processing all records, print the <strong>people still at the company</strong>!' },
                { title: 'Which data structure works best?', content: 'We need to <strong>add when entering, remove when leaving</strong>.<br>With an array, finding a name to remove takes O(n)...<br><br>A <strong>Set</strong> makes both add and remove <strong>O(1)</strong>!<br><span class="lang-py">Python: <code>set.add()</code> / <code>set.discard()</code></span><span class="lang-cpp">C++: <code>set&lt;string&gt;</code> with <code>insert()</code> / <code>erase()</code></span>' },
                { title: 'Solving with a Set', content: 'Create an empty set, then read logs one by one:<br><br>1. <code>"Baha enter"</code> → add Baha to set<br>2. <code>"Asher enter"</code> → add Asher to set<br>3. <code>"Baha leave"</code> → remove Baha from set<br><br>Done! People remaining in the set = people at the company' },
                { title: 'Printing in reverse alphabetical order', content: 'Print the remaining people in <strong>reverse alphabetical order (Z→A)</strong>.<br><span class="lang-py">Python: <code>sorted(company, reverse=True)</code></span><span class="lang-cpp">C++: <code>set&lt;string, greater&lt;string&gt;&gt;</code> for automatic reverse order, or iterate with <code>rbegin()</code>~<code>rend()</code></span><br><br>Example: {Asher, Cam} → reverse → Cam, Asher!' },
                { title: 'Time complexity', content: 'Processing n records: set add/remove each O(1) → <strong>O(n)</strong><br>Sorting m remaining people: <strong>O(m log m)</strong><br><br>Total: <strong>O(n + m log m)</strong>.' }
            ],
            simIntro: 'Watch how entry logs are processed by adding/removing people from a set!',
            inputDefault: 0, solve() { return 'Asber\\nArtem'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

n = int(input())
company = set()

for _ in range(n):
    name, action = input().split()
    if action == 'enter':
        company.add(name)
    else:
        company.discard(name)

for name in sorted(company, reverse=True):
    print(name)`,
                cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <set>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    set<string, greater<string>> company;
    while (n--) {
        char name[20], action[10];
        scanf("%s %s", name, action);
        if (action[0] == 'e') company.insert(name);
        else company.erase(name);
    }
    for (auto& s : company) printf("%s\\n", s.c_str());
}`
            },
            solutions: [{
                approach: 'Brute Force (List)',
                description: 'Add to list / linear search removal, then sort',
                timeComplexity: 'O(n²)',
                spaceComplexity: 'O(n)',
                templates: {
                    python: `import sys
input = sys.stdin.readline

n = int(input())
company = []

for _ in range(n):
    name, action = input().split()
    if action == 'enter':
        company.append(name)
    else:
        company.remove(name)  # O(n) linear search

company.sort(reverse=True)
for name in company:
    print(name)`,
                    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    int n; scanf("%d", &n);
    vector<string> company;
    while (n--) {
        char name[20], action[10];
        scanf("%s %s", name, action);
        if (action[0] == 'e') {
            company.push_back(name);
        } else {
            // O(n) linear search + delete
            auto it = find(company.begin(), company.end(), string(name));
            if (it != company.end()) company.erase(it);
        }
    }
    sort(company.rbegin(), company.rend());
    for (auto& s : company) printf("%s\\n", s.c_str());
}`
                }
            }, {
                approach: 'Using a Set',
                description: 'Add on enter, remove on leave, then sort in reverse alphabetical order',
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                get templates() { return hashTableTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: 'Input setup', desc: 'BOJ may have large input, so use sys.stdin.readline\nfor fast input.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())' },
                        { title: 'Initialize Set', desc: 'Key: set has O(1) add/discard!\nList remove is O(n), so for frequent entries/exits, set is much faster.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)' },
                        { title: 'Process entry logs', desc: 'enter → add with add(), leave → remove with discard().\ndiscard does not raise an error if the element is missing, making it safe.\n(remove raises KeyError if missing!)', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)      # O(1) add\n    else:\n        company.discard(name)  # O(1) remove (safe if missing)' },
                        { title: 'Print in reverse alphabetical order', desc: 'Sort with sorted() and reverse=True for reverse output.\nSets have no order, so sorting before printing is required.', code: 'import sys\ninput = sys.stdin.readline\n\nn = int(input())\ncompany = set()  # set → add/discard O(1)\n\nfor _ in range(n):\n    name, action = input().split()\n    if action == "enter":\n        company.add(name)      # O(1) add\n    else:\n        company.discard(name)  # O(1) remove (safe if missing)\n\n# set has no order → must sort before printing\nfor name in sorted(company, reverse=True):\n    print(name)' }
                    ],
                    cpp: [
                        { title: 'Headers + reverse-ordered set', desc: 'C++ set is automatically sorted! Using greater<string>\nautomatically sorts in reverse alphabetical order on insertion.\n→ No need to sort separately at the end', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → auto reverse sort on insert\n    set<string, greater<string>> company;' },
                        { title: 'Process entry logs', desc: 'insert/erase are both O(log n) — faster than O(n) with a list.\naction[0] == \'e\' is a simple way to distinguish enter/leave.', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → auto reverse sort on insert\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);  // O(log n)\n        else company.erase(name);                     // O(log n)\n    }' },
                        { title: 'Output Result', desc: 'set<greater> is already in reverse sorted order!\nJust print in order without additional sorting.', code: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n; scanf("%d", &n);\n    // greater → auto reverse sort on insert\n    set<string, greater<string>> company;\n    while (n--) {\n        char name[20], action[10];\n        scanf("%s %s", name, action);\n        if (action[0] == \'e\') company.insert(name);  // O(log n)\n        else company.erase(name);                     // O(log n)\n    }\n    // Already reverse sorted → print as-is\n    for (auto& s : company) printf("%s\\n", s.c_str());\n}' }
                    ]
                }
            }]
        }
    ],

    renderProblem(container) {
        container.innerHTML = '';
        const stageList = document.createElement('div'); stageList.className = 'problem-stages';
        this.stages.forEach(stage => {
            const sc = document.createElement('div'); sc.className = 'stage-card';
            sc.innerHTML = `<div class="stage-header"><span class="stage-num">Stage ${stage.num}</span><h3>${stage.title}</h3><p>${stage.desc}</p></div><div class="stage-problems"></div>`;
            const pd = sc.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid); if (!prob) return;
                const dm = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button'); btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${dm[prob.difficulty]||prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob)); pd.appendChild(btn);
            });
            stageList.appendChild(sc);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const bb = document.createElement('button'); bb.className = 'btn'; bb.textContent = '← Back to Problems';
        bb.addEventListener('click', () => this.renderProblem(container)); container.appendChild(bb);
        const isLC = problem.link.includes('leetcode');
        const dd = document.createElement('div'); dd.className = 'problem-detail';
        dd.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC?'LeetCodeSolve on LeetCode ↗':'BOJSolve on LeetCode ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(dd);

        const hs = document.createElement('div'); hs.className = 'hints-section'; hs.innerHTML = '<h3>Step-by-step Hints</h3>';
        const hd = document.createElement('div'); hd.className = 'hints-steps'; const os = {};
        problem.hints.forEach((h, i) => {
            const st = document.createElement('div'); st.className = 'hint-step' + (i > 0 ? ' locked' : '');
            st.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${i+1}</span><span class="hint-step-title">${h.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${h.content}</div>`;
            st.querySelector('.hint-step-header').addEventListener('click', () => {
                if (st.classList.contains('locked')) return; st.classList.toggle('open');
                st.querySelector('.hint-step-toggle').textContent = st.classList.contains('open') ? '▼' : '▶';
                if (!os[i]) { os[i] = true; if (i+1 < problem.hints.length) { const ns = hd.children[i+1]; if (ns) ns.classList.remove('locked'); } }
            });
            hd.appendChild(st);
        });
        hs.appendChild(hd); container.appendChild(hs);

        const sa = document.createElement('div'); sa.className = 'solve-area';
        sa.innerHTML = `<div class="editor-header"><h3>Write Solution</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="Write your code here..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ Run</button><button id="check-btn" class="btn btn-success">✓ Check Answer</button></div><div id="output-area" class="output-area"><div class="output-label">Output</div><pre id="output-text"></pre></div>`;
        container.appendChild(sa);
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        const ed = container.querySelector('#code-editor'), ls = container.querySelector('#lang-select');
        ed.value = problem.templates.python;
        ls.addEventListener('change', () => { ed.value = problem.templates[ls.value]; });
        ed.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ed.selectionStart; ed.value = ed.value.substring(0, s) + '    ' + ed.value.substring(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = s + 4; } });
        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => { this._showOutput(container, `Expected answer:\n${problem.solve(0)}\n\n(If your code outputs the result above, it is correct)`); });
        container.querySelector('#check-btn').addEventListener('click', () => { this._showOutput(container, `Expected answer:\n${problem.solve(0)}\n\nSubmit your code on ${site} to verify!`); });
    },

    _showOutput(container, text) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.hashtable = hashTableTopic;
