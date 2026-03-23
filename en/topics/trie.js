// =========================================================
// Trie Topic Module
// =========================================================
var trieTopic = {
    id: 'trie',
    title: 'Trie',
    icon: '🔠',
    category: 'Advanced (Gold~Platinum)',
    order: 18,
    description: 'A tree data structure for efficiently storing and searching strings',
    relatedNote: 'Tries are used in autocomplete, spell-checking, IP routing, and more. A compressed trie (Radix Tree) can save memory.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: 'Learn' }],

    problemMeta: {
        'lc-208':    { type: 'Trie Implementation', color: 'var(--accent)', vizMethod: '_renderVizImplement' },
        'boj-14425': { type: 'String Set',           color: 'var(--green)',  vizMethod: '_renderVizStringSet' },
        'boj-5052':  { type: 'Prefix Detection',     color: '#e17055',       vizMethod: '_renderVizPhoneBook' },
        'lc-14':     { type: 'Common Prefix',         color: '#6c5ce7',       vizMethod: '_renderVizLCP' }
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
            sim:     { intro: prob.simIntro || 'See how the trie actually works in action.', icon: '🎮' },
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
                <h2>🔠 Trie</h2>\
                <p class="hero-sub">Let us learn about a special tree that stores and searches strings quickly!</p>\
            </div>\
\
            <!-- Section 1: What Is a Trie? -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> What Is a Trie?\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> <em>"the index of a phone book"</em>!<br><br>\
                    To find "cat" in a dictionary, you follow c → a → t in order.<br>\
                    Similarly, a trie <strong>stores strings one character at a time in a tree</strong>.<br>\
                    To find "cat", just go down from the root: c → a → t!<br><br>\
                    Words with the same prefix <strong>share the same path</strong>.\
                    "cat" and "car" walk the same path up to "ca" before branching off.\
                    This makes <strong>prefix search extremely fast!</strong>\
                </div>\
                <div style="margin:0.5rem 0 0.8rem;">\
                    <a href="https://en.wikipedia.org/wiki/Trie" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Trie (Prefix Tree) ↗</a>\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="10" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="17" y1="12" x2="12" y2="24" stroke="var(--accent)" stroke-width="2"/><line x1="21" y1="12" x2="26" y2="24" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>Tree Structure</h3>\
                        <p>A trie is a <strong>tree</strong> data structure. Starting from the root, it descends one character at a time to child nodes.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(L)</text></svg>\
                        </div>\
                        <h3>O(L) Search</h3>\
                        <p>If the string length is L, the search finishes in <strong>exactly L steps</strong>! Accurate without worrying about hash collisions.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="16" font-size="10" fill="var(--text2)">cat</text><text x="2" y="30" font-size="10" fill="var(--text2)">car</text><text x="22" y="23" font-size="12" fill="var(--yellow)">ca...</text></svg>\
                        </div>\
                        <h3>Prefix Sharing</h3>\
                        <p>Words with the same prefix <strong>share the same path</strong>. This saves memory!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">Pre*</text></svg>\
                        </div>\
                        <h3>Best for Prefix Search</h3>\
                        <p>Finding words that start with "app"! A trie is the <strong>optimal data structure</strong> for prefix search.</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># Trie vs other methods\n# N strings, average length L\n\n# 1) Search in list: O(N * L) -- compare one by one\n# 2) Search in set: O(L) average -- uses hashing\n# 3) Search in trie: O(L) worst case -- always fast!\n\n# The real strength of a trie: prefix search!\n# Find all words starting with "app"\n# -> list/set: O(N * L) must check all\n# -> trie: O(prefix length) + O(result count) very fast!</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// Trie vs other methods\n// N strings, average length L\n\n// 1) Search in vector: O(N * L) -- compare one by one\n// 2) Search in unordered_set: O(L) average -- uses hashing\n// 3) Search in trie: O(L) worst case -- always fast!\n\n// The real strength of a trie: prefix search!\n// Find all words starting with "app"\n// -> vector/set: O(N * L) must check all\n// -> trie: O(prefix length) + O(result count) very fast!</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Build a Trie</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Enter a word and click "Insert" to see each character being added to the trie one by one!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-build-input" value="cat" placeholder="Enter a word" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="trie-demo-build-insert">+ Insert</button>\
                        <button class="concept-demo-btn" id="trie-demo-build-step" style="display:none;">Step ▶</button>\
                        <button class="concept-demo-btn" id="trie-demo-build-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="trie-demo-build-counter" style="font-size:0.8rem;color:var(--text3);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Trie Structure</div>\
                        <svg id="trie-demo-build-svg" width="400" height="260" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);display:block;margin:0 auto;"></svg>\
                        <div style="margin-top:10px;font-weight:600;color:var(--text);">Inserted Words</div>\
                        <div id="trie-demo-build-words" style="display:flex;gap:8px;flex-wrap:wrap;min-height:30px;margin-top:4px;"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-build-msg">Try inserting "cat", "car", "card"! Watch how they share the same prefix path.</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">If we insert "apple", "app", "apt", "bat" into a trie, how many children does the root have?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        The answer is <strong>2</strong>! Since the first letters are only \'a\' and \'b\',\
                        the root gets 2 child nodes: \'a\' and \'b\' .\
                        "apple", "app", and "apt" all start with \'a\', so they share the same child.\
                    </div>\
                </div>\
            </div>\
\
            <!-- Section 2: Trie vs HashMap -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> Trie vs HashMap — Why Do We Need a Trie?\
                </div>\
                <div class="analogy-box">\
                    <strong>Key Question:</strong> A hash set (<span class="lang-py"><code>set</code></span><span class="lang-cpp"><code>unordered_set</code></span>) can search in O(1), so why do we need a Trie?\
                    The answer lies in <strong>"prefixes"</strong>!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card" style="border-color: var(--green);">\
                        <h3>HashMap (Set)</h3>\
                        <p><strong>Exact word search</strong>: O(L) average ✅<br>\
                        <strong>Find words starting with "app"</strong>: Must scan all entries → O(N×L) ❌<br>\
                        <strong>Lexicographic order</strong>: Requires separate sorting ❌</p>\
                    </div>\
                    <div class="concept-card" style="border-color: var(--accent);">\
                        <h3>Trie</h3>\
                        <p><strong>Exact word search</strong>: O(L) worst case ✅<br>\
                        <strong>Find words starting with "app"</strong>: Follow prefix path → O(L + results) ✅<br>\
                        <strong>Lexicographic order</strong>: Naturally sorted ✅</p>\
                    </div>\
                </div>\
                <div class="key-difference-box" style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius);border-left:4px solid var(--accent);">\
                    <strong>Key Difference!</strong><br>\
                    • <strong>HashMap</strong>: "Does this word exist?" → ✅ Fast | "What words start with this prefix?" → ❌ Slow<br>\
                    • <strong>Trie</strong>: Both are fast! When prefix search is needed, Trie is the answer<br><br>\
                    <strong>When to use a Trie?</strong> Autocomplete, prefix matching, lexicographic traversal, checking prefix relationships in a set of strings\
                </div>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Exact search vs Prefix search</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Enter a query and compare exact search (hash is fine) vs prefix search (trie needed)!</p>\
                    <div class="concept-demo-body">\
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">\
                            <input type="text" id="trie-s2-input" value="app" placeholder="Query" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:100px;background:var(--card);color:var(--text);">\
                            <button class="concept-demo-btn" id="trie-s2-exact">Exact Search</button>\
                            <button class="concept-demo-btn" id="trie-s2-prefix">Prefix Search</button>\
                        </div>\
                        <div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px;">Stored words: apple, app, application, apt, bat, ball, banana</div>\
                        <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">Hash Set</div>\
                                <div id="trie-s2-hash" style="font-size:0.85rem;color:var(--text2);min-height:2em;"></div>\
                            </div>\
                            <div style="flex:1;min-width:150px;">\
                                <div style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">Trie</div>\
                                <div id="trie-s2-trie" style="font-size:0.85rem;color:var(--text2);min-height:2em;"></div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-s2-msg">Exact search is fast for both, but prefix search is only efficient with a trie!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">With 100,000 words stored, which is faster at finding all words starting with "pre" — a hash set or a trie?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        <strong>Trie wins by a huge margin!</strong><br>\
                        Hash set: Check all 100,000 entries with startsWith("pre") → O(100,000 × L)<br>\
                        Trie: Move to p → r → e node in 3 steps, then collect words below → O(3 + result count)<br>\
                        The more words stored, the bigger the difference!\
                    </div>\
                </div>\
            </div>\
\
            <!-- Section 3: Implementing a Trie -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> Implementing a Trie\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> each node is like <em>"a signpost at a crossroads"</em>!<br>\
                    Each signpost has arrows (children) pointing to the next characters,\
                    and a flag (is_end) that says "a word ends here".\
                    Inserting "cat" creates signposts c → a → t, and plants a flag at t!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" fill="var(--accent)">{ }</text></svg>\
                        </div>\
                        <h3>TrieNode</h3>\
                        <p><code>children</code>: dictionary of child nodes<br><code>is_end</code>: end-of-word flag</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">insert</text></svg>\
                        </div>\
                        <h3>Insert</h3>\
                        <p>Follow each character, creating new nodes as needed. Mark <code>is_end = True</code> at the end!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">search</text></svg>\
                        </div>\
                        <h3>Search</h3>\
                        <p>Follow each character; if a character is missing, return False. If you reach the end and <code>is_end</code> is True, the word exists!</p>\
                    </div>\
                </div>\
                <div style="margin:0.8rem 0 0.5rem;">\
                    <span class="lang-py"><a href="https://docs.python.org/3/library/stdtypes.html#dict" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python Docs: dict ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/container/unordered_map" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ Reference: unordered_map ↗</a></span>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python">class TrieNode:\n    def __init__(self):\n        self.children = {}   # {\'a\': TrieNode, \'b\': TrieNode, ...}\n        self.is_end = False  # Does a word end at this node?\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """Insert a word into the trie."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()  # Create if missing\n            node = node.children[ch]\n        node.is_end = True  # Mark end of word!\n\n    def search(self, word):\n        """Check if a word exists in the trie."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False  # No path means no word!\n            node = node.children[ch]\n        return node.is_end  # Must have end flag to be a real word!\n\n    def startsWith(self, prefix):\n        """Check if any word starts with this prefix."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True  # Path exists is enough! (is_end not needed)\n\n# Usage example\ntrie = Trie()\ntrie.insert("apple")\ntrie.insert("app")\nprint(trie.search("apple"))      # True\nprint(trie.search("app"))        # True\nprint(trie.search("ap"))         # False (is_end is False!)\nprint(trie.startsWith("app"))    # True\nprint(trie.startsWith("b"))      # False</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// C++ Trie Implementation\n#include &lt;iostream&gt;\n#include &lt;string&gt;\n#include &lt;unordered_map&gt;\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map&lt;char, TrieNode*&gt; children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(const string& prefix) {\n        TrieNode* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};\n\n// Usage example\nint main() {\n    Trie trie;\n    trie.insert("apple");\n    trie.insert("app");\n    cout &lt;&lt; trie.search("apple") &lt;&lt; endl;      // 1 (true)\n    cout &lt;&lt; trie.search("app") &lt;&lt; endl;        // 1 (true)\n    cout &lt;&lt; trie.search("ap") &lt;&lt; endl;         // 0 (false, is_end is false!)\n    cout &lt;&lt; trie.startsWith("app") &lt;&lt; endl;    // 1 (true)\n    cout &lt;&lt; trie.startsWith("b") &lt;&lt; endl;      // 0 (false)\n}</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Search in a Trie</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">The trie contains "apple", "app", "apt", "bat". Enter a word to search and follow the path character by character!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-search-input" value="app" placeholder="Word to search" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:120px;background:var(--card);color:var(--text);">\
                        <button class="concept-demo-btn" id="trie-demo-search-step">Next Character ▶</button>\
                        <button class="concept-demo-btn" id="trie-demo-search-reset" style="background:var(--bg2);color:var(--text2);">Reset</button>\
                        <span id="trie-demo-search-counter" style="font-size:0.85rem;color:var(--text2);"></span>\
                    </div>\
                    <div class="concept-demo-body">\
                        <svg id="trie-demo-search-svg" width="400" height="260" style="background:var(--bg);border-radius:8px;border:1px solid var(--bg3);display:block;margin:0 auto;"></svg>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-search-msg">Try searching "apple", "app", "bat"! If the path is missing, it fails. If is_end is true at the end, it succeeds!</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">After inserting "app" and "apple" into a trie, what is the difference between search("app") and startsWith("app")?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        Both return <strong>True</strong>! Since "app" was inserted, the \'p\' node has <code>is_end = True</code>.\
                        If only "apple" was inserted (not "app"), then <code>search("app")</code> would be <strong>False</strong> while\
                        <code>startsWith("app")</code> would still be <strong>True</strong>. Because search checks is_end, but startsWith only checks if the path exists!\
                    </div>\
                </div>\
            </div>\
\
            <!-- Section 4: Trie Applications -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">4</span> Trie Applications\
                </div>\
                <div class="analogy-box">\
                    <strong>Understanding by analogy:</strong> When you type on your smartphone,\
                    <em>"autocomplete suggestions"</em> pop up!\
                    When you type "app", it suggests "apple", "application", "appetite", and more.\
                    This autocomplete feature is a classic example of a trie in action!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🔍</text></svg>\
                        </div>\
                        <h3>Autocomplete</h3>\
                        <p>Quickly finds and suggests words starting with the entered prefix. Widely used in search engines and input methods.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--green)">📖</text></svg>\
                        </div>\
                        <h3>Dictionary Lookup</h3>\
                        <p>Stores a large number of words and quickly checks if a word exists. Also used in spell checkers.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--yellow)">📞</text></svg>\
                        </div>\
                        <h3>Prefix Matching</h3>\
                        <p>Quickly checks whether a phone number is a prefix of another in a phone book.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🗂️</text></svg>\
                        </div>\
                        <h3>String Set Management</h3>\
                        <p>Efficiently handles insertion, deletion, and lookup of many strings. Also used in IP routing tables.</p>\
                    </div>\
                </div>\
                <span class="lang-py"><div class="code-block">\
                    <pre><code class="language-python"># Trie application: autocomplete\nclass AutocompleteTrie(Trie):\n    def _collect(self, node, prefix, results):\n        """Collect all words starting from the current node."""\n        if node.is_end:\n            results.append(prefix)\n        for ch, child in sorted(node.children.items()):\n            self._collect(child, prefix + ch, results)\n\n    def autocomplete(self, prefix):\n        """Return all words that start with the given prefix."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return []  # Empty list if the prefix does not exist\n            node = node.children[ch]\n        results = []\n        self._collect(node, prefix, results)\n        return results\n\n# Usage example\ntrie = AutocompleteTrie()\nfor word in ["apple", "app", "application", "apt", "bat"]:\n    trie.insert(word)\n\nprint(trie.autocomplete("app"))\n# [\'app\', \'apple\', \'application\']\nprint(trie.autocomplete("b"))\n# [\'bat\']</code></pre>\
                </div></span>\
                <span class="lang-cpp"><div class="code-block">\
                    <pre><code class="language-cpp">// Trie application: autocomplete\n#include &lt;iostream&gt;\n#include &lt;string&gt;\n#include &lt;vector&gt;\n#include &lt;map&gt;\nusing namespace std;\n\nstruct TrieNode {\n    map&lt;char, TrieNode*&gt; children;  // Maintain sorted order\n    bool is_end = false;\n};\n\nclass AutocompleteTrie {\n    TrieNode* root;\n\n    // Collect all words from the current node\n    void collect(TrieNode* node, string& prefix, vector&lt;string&gt;& results) {\n        if (node-&gt;is_end)\n            results.push_back(prefix);\n        for (auto& [ch, child] : node-&gt;children) {\n            prefix.push_back(ch);\n            collect(child, prefix, results);\n            prefix.pop_back();\n        }\n    }\n\npublic:\n    AutocompleteTrie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node-&gt;children.count(ch))\n                node-&gt;children[ch] = new TrieNode();\n            node = node-&gt;children[ch];\n        }\n        node-&gt;is_end = true;\n    }\n\n    vector&lt;string&gt; autocomplete(const string& prefix) {\n        TrieNode* node = root;\n        for (char ch : prefix) {\n            if (!node-&gt;children.count(ch))\n                return {};  // Empty vector if the prefix does not exist\n            node = node-&gt;children[ch];\n        }\n        vector&lt;string&gt; results;\n        string p = prefix;\n        collect(node, p, results);\n        return results;\n    }\n};\n\n// Usage example\nint main() {\n    AutocompleteTrie trie;\n    for (auto& w : {"apple", "app", "application", "apt", "bat"})\n        trie.insert(w);\n\n    for (auto& s : trie.autocomplete("app"))\n        cout &lt;&lt; s &lt;&lt; " ";  // app apple application\n    cout &lt;&lt; endl;\n    for (auto& s : trie.autocomplete("b"))\n        cout &lt;&lt; s &lt;&lt; " ";  // bat\n}</code></pre>\
                </div></span>\
                <div class="concept-demo">\
                    <div class="concept-demo-title">Try It — Autocomplete</div>\
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">Type a prefix and the trie will instantly suggest all words starting with that prefix!</p>\
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">\
                        <input type="text" id="trie-demo-auto-input" value="" placeholder="Type a prefix (e.g. ap)" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:160px;background:var(--card);color:var(--text);">\
                        <span style="font-size:0.85rem;color:var(--text2);">Word list:</span>\
                        <input type="text" id="trie-demo-auto-words" value="apple,app,application,apt,bat,ball,banana" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:0.9rem;width:260px;background:var(--card);color:var(--text);">\
                    </div>\
                    <div class="concept-demo-body">\
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text);">Suggestions</div>\
                        <div id="trie-demo-auto-results" style="display:flex;gap:8px;flex-wrap:wrap;min-height:36px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--bg3);"></div>\
                    </div>\
                    <div class="concept-demo-msg" id="trie-demo-auto-msg">Type a prefix character by character! Watch the suggestions update in real time. "ap" → apple, app, application, apt</div>\
                </div>\
\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">Given a phone book ["119", "1195", "112"], "119" is a prefix of "1195". How can we detect this with a trie?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 Think first, then click!</button>\
                    <div class="think-box-answer">\
                        While inserting all numbers into the trie, if you pass through a node with <code>is_end = True</code>,\
                        it means <strong>an existing number is a prefix of the current number</strong>!\
                        Conversely, if the final node already has children, <strong>the current number is a prefix of another number</strong>.\
                        This approach can be used to solve "Phone List" type problems.\
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
                btn.textContent = ans.classList.contains('show') ? '\uD83D\uDD3C Collapse' : '\uD83E\uDD14 Think first, then click!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });

        // ====== Section 2 demo: Exact vs Prefix search ======
        (function() {
            var inputEl = container.querySelector('#trie-s2-input');
            var hashEl = container.querySelector('#trie-s2-hash');
            var trieEl = container.querySelector('#trie-s2-trie');
            var msgEl = container.querySelector('#trie-s2-msg');
            if (!inputEl) return;
            var words = ['apple','app','application','apt','bat','ball','banana'];
            var wordSet = {};
            words.forEach(function(w) { wordSet[w] = true; });
            container.querySelector('#trie-s2-exact').addEventListener('click', function() {
                var q = inputEl.value.trim().toLowerCase();
                if (wordSet[q]) {
                    hashEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(L) — Found!</span> "' + q + '" exists.';
                    trieEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(L) — Found!</span> "' + q + '" exists.';
                    msgEl.textContent = 'Exact search is O(L) for both hash set and trie!';
                } else {
                    hashEl.innerHTML = '<span style="color:var(--red);">O(L) — Not found.</span>';
                    trieEl.innerHTML = '<span style="color:var(--red);">O(L) — Not found.</span>';
                    msgEl.textContent = 'Both quickly determine the word does not exist.';
                }
            });
            container.querySelector('#trie-s2-prefix').addEventListener('click', function() {
                var q = inputEl.value.trim().toLowerCase();
                var matches = words.filter(function(w) { return w.indexOf(q) === 0; });
                hashEl.innerHTML = '<span style="color:var(--red);font-weight:600;">O(N*L)</span> — Must check all entries!<br>Check all 7 words with startsWith';
                trieEl.innerHTML = '<span style="color:var(--green);font-weight:600;">O(' + q.length + ' + ' + matches.length + ')</span> — Traverse ' + q.length + ' chars, then collect!<br>Results: ' + (matches.length ? matches.join(', ') : 'none');
                msgEl.textContent = 'For prefix search, trie wins by a huge margin! The more data, the bigger the gap.';
            });
        })();

        // ===== Trie data structure shared across demos =====
        function TrieNode() { this.children = {}; this.isEnd = false; }
        function TrieDS() { this.root = new TrieNode(); }
        TrieDS.prototype.insert = function(word) {
            var node = this.root;
            for (var i = 0; i < word.length; i++) {
                var ch = word[i];
                if (!node.children[ch]) node.children[ch] = new TrieNode();
                node = node.children[ch];
            }
            node.isEnd = true;
        };
        TrieDS.prototype.search = function(word) {
            var node = this.root;
            for (var i = 0; i < word.length; i++) {
                if (!node.children[word[i]]) return null;
                node = node.children[word[i]];
            }
            return node;
        };
        TrieDS.prototype.collect = function(node, prefix) {
            var results = [];
            if (node.isEnd) results.push(prefix);
            var keys = Object.keys(node.children).sort();
            for (var i = 0; i < keys.length; i++) {
                results = results.concat(this.collect(node.children[keys[i]], prefix + keys[i]));
            }
            return results;
        };
        TrieDS.prototype.autocomplete = function(prefix) {
            var node = this.search(prefix);
            if (!node) return [];
            return this.collect(node, prefix);
        };

        // ===== Shared trie rendering helper =====
        function layoutTrie(root) {
            var levels = [];
            var queue = [{node:root, ch:'root', depth:0, parent:null, idx:0}];
            var allNodes = [];
            while (queue.length > 0) {
                var cur = queue.shift();
                if (!levels[cur.depth]) levels[cur.depth] = [];
                cur.levelIdx = levels[cur.depth].length;
                levels[cur.depth].push(cur);
                allNodes.push(cur);
                var keys = Object.keys(cur.node.children).sort();
                for (var i = 0; i < keys.length; i++) {
                    queue.push({node:cur.node.children[keys[i]], ch:keys[i], depth:cur.depth+1, parent:cur, idx:i});
                }
            }
            var svgW = 400, yGap = 50, startY = 30;
            allNodes.forEach(function(n) {
                n.y = startY + n.depth * yGap;
            });
            for (var d = levels.length - 1; d >= 0; d--) {
                var lvl = levels[d];
                for (var i = 0; i < lvl.length; i++) {
                    var n = lvl[i];
                    var childKeys = Object.keys(n.node.children).sort();
                    if (childKeys.length === 0) {
                        n.x = null;
                    } else {
                        var childNodes = allNodes.filter(function(c) { return c.parent === n; });
                        var sumX = 0, cnt = 0;
                        childNodes.forEach(function(c) { if (c.x !== null && c.x !== undefined) { sumX += c.x; cnt++; } });
                        if (cnt > 0) n.x = sumX / cnt;
                    }
                }
            }
            var leafCounter = 0;
            var leaves = allNodes.filter(function(n) { return Object.keys(n.node.children).length === 0; });
            var spacing = Math.min(50, (svgW - 40) / Math.max(leaves.length, 1));
            var startX = (svgW - spacing * (leaves.length - 1)) / 2;
            leaves.forEach(function(n) { n.x = startX + leafCounter * spacing; leafCounter++; });
            for (var d = levels.length - 1; d >= 0; d--) {
                levels[d].forEach(function(n) {
                    var childNodes = allNodes.filter(function(c) { return c.parent === n; });
                    if (childNodes.length > 0) {
                        var sumX = 0;
                        childNodes.forEach(function(c) { sumX += c.x; });
                        n.x = sumX / childNodes.length;
                    }
                });
            }
            allNodes.forEach(function(n) { n.x = Math.max(20, Math.min(svgW - 20, n.x || svgW/2)); });
            return allNodes;
        }

        function renderTrieSvg(svgEl, allNodes, highlightPath, highlightResult) {
            var html = '';
            allNodes.forEach(function(n) {
                if (n.parent) {
                    var edgeColor = 'var(--bg3)';
                    if (highlightPath && highlightPath.indexOf(n) >= 0 && highlightPath.indexOf(n.parent) >= 0) {
                        edgeColor = highlightResult === 'searching' ? 'var(--yellow)' : (highlightResult === 'found' ? 'var(--green)' : (highlightResult === 'fail' ? 'var(--red)' : 'var(--accent)'));
                    }
                    html += '<line x1="'+n.parent.x+'" y1="'+n.parent.y+'" x2="'+n.x+'" y2="'+n.y+'" stroke="'+edgeColor+'" stroke-width="2.5"/>';
                }
            });
            allNodes.forEach(function(n) {
                var r = 16, fill = 'var(--card)', stroke = 'var(--bg3)', txtColor = 'var(--text)';
                if (n.node.isEnd) { stroke = 'var(--green)'; }
                if (highlightPath && highlightPath.indexOf(n) >= 0) {
                    if (highlightResult === 'searching') { fill = 'var(--yellow)'; stroke = 'var(--yellow)'; txtColor = '#333'; }
                    else if (highlightResult === 'found') { fill = 'var(--green)'; stroke = 'var(--green)'; txtColor = 'white'; }
                    else if (highlightResult === 'fail') { fill = 'var(--red)'; stroke = 'var(--red)'; txtColor = 'white'; }
                    else { fill = 'var(--accent)'; stroke = 'var(--accent)'; txtColor = 'white'; }
                }
                html += '<circle cx="'+n.x+'" cy="'+n.y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.5"/>';
                html += '<text x="'+n.x+'" y="'+(n.y+5)+'" text-anchor="middle" font-size="13" font-weight="700" fill="'+txtColor+'">'+n.ch+'</text>';
                if (n.node.isEnd) {
                    html += '<circle cx="'+(n.x+12)+'" cy="'+(n.y-12)+'" r="5" fill="var(--green)"/>';
                }
            });
            svgEl.innerHTML = html;
        }

        // ========== Demo 1: Build a Trie ==========
        (function() {
            var trie = new TrieDS();
            var insertedWords = [];
            var svgEl = container.querySelector('#trie-demo-build-svg');
            var wordsEl = container.querySelector('#trie-demo-build-words');
            var inputEl = container.querySelector('#trie-demo-build-input');
            var insertBtn = container.querySelector('#trie-demo-build-insert');
            var stepBtn = container.querySelector('#trie-demo-build-step');
            var resetBtn = container.querySelector('#trie-demo-build-reset');
            var counterEl = container.querySelector('#trie-demo-build-counter');
            var msgEl = container.querySelector('#trie-demo-build-msg');

            // State for step-by-step insertion
            var buildState = { word: '', stepIdx: 0, node: null, inserting: false };

            function renderBuild() {
                var allNodes = layoutTrie(trie.root);
                renderTrieSvg(svgEl, allNodes, null, null);
                wordsEl.innerHTML = '';
                insertedWords.forEach(function(w) {
                    var span = document.createElement('span');
                    span.style.cssText = 'padding:4px 12px;background:var(--green)15;color:var(--green);border-radius:8px;font-weight:600;font-size:0.85rem;border:1px solid var(--green)30;';
                    span.textContent = w;
                    wordsEl.appendChild(span);
                });
                if (insertedWords.length === 0) {
                    wordsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">No words inserted yet</span>';
                }
            }

            function renderBuildWords() {
                wordsEl.innerHTML = '';
                insertedWords.forEach(function(w) {
                    var span = document.createElement('span');
                    span.style.cssText = 'padding:4px 12px;background:var(--green)15;color:var(--green);border-radius:8px;font-weight:600;font-size:0.85rem;border:1px solid var(--green)30;';
                    span.textContent = w;
                    wordsEl.appendChild(span);
                });
            }

            function buildStepExec() {
                var word = buildState.word;
                var i = buildState.stepIdx;
                // Total steps: word.length (one per char) + 1 (final is_end marking)
                if (i >= word.length) {
                    // Final step: mark is_end
                    buildState.node.isEnd = true;
                    insertedWords.push(word);
                    var allNodes = layoutTrie(trie.root);
                    var hp = [allNodes[0]];
                    var cur = trie.root;
                    for (var j = 0; j < word.length; j++) {
                        cur = cur.children[word[j]];
                        var found = allNodes.filter(function(n) { return n.node === cur; });
                        if (found.length > 0) hp.push(found[0]);
                    }
                    renderTrieSvg(svgEl, allNodes, hp, 'found');
                    renderBuildWords();
                    msgEl.textContent = '"' + word + '" inserted! Check the is_end marker (green dot).';
                    msgEl.style.color = 'var(--green)';
                    counterEl.textContent = (i + 1) + ' / ' + (word.length + 1);
                    // Done — hide step, show insert again
                    buildState.inserting = false;
                    stepBtn.style.display = 'none';
                    insertBtn.disabled = false;
                    return;
                }
                var ch = word[i];
                if (!buildState.node.children[ch]) {
                    buildState.node.children[ch] = new TrieNode();
                    msgEl.textContent = 'Node "' + ch + '" does not exist, creating a new one! (depth ' + (i+1) + ')';
                    msgEl.style.color = 'var(--accent)';
                } else {
                    msgEl.textContent = 'Node "' + ch + '" already exists, following it. (shared!)';
                    msgEl.style.color = 'var(--yellow)';
                }
                buildState.node = buildState.node.children[ch];
                var allNodes = layoutTrie(trie.root);
                var hp = [allNodes[0]];
                var cur = trie.root;
                for (var j = 0; j <= i; j++) {
                    cur = cur.children[word[j]];
                    var found = allNodes.filter(function(n) { return n.node === cur; });
                    if (found.length > 0) hp.push(found[0]);
                }
                renderTrieSvg(svgEl, allNodes, hp, 'searching');
                counterEl.textContent = (i + 1) + ' / ' + (word.length + 1);
                buildState.stepIdx++;
            }

            insertBtn.addEventListener('click', function() {
                if (buildState.inserting) return;
                var word = inputEl.value.trim().toLowerCase();
                if (!word || !/^[a-z]+$/.test(word)) {
                    msgEl.textContent = 'Please enter a lowercase English word!';
                    msgEl.style.color = 'var(--red)';
                    return;
                }
                if (insertedWords.indexOf(word) >= 0) {
                    msgEl.textContent = '"' + word + '" has already been inserted!';
                    msgEl.style.color = 'var(--yellow)';
                    return;
                }
                // Begin step-by-step insertion
                buildState.word = word;
                buildState.stepIdx = 0;
                buildState.node = trie.root;
                buildState.inserting = true;
                insertBtn.disabled = true;
                stepBtn.style.display = '';
                counterEl.textContent = '0 / ' + (word.length + 1);
                msgEl.textContent = 'Inserting "' + word + '". Press the Step button to advance one character at a time.';
                msgEl.style.color = 'var(--text2)';
            });

            stepBtn.addEventListener('click', function() {
                if (!buildState.inserting) return;
                buildStepExec();
            });

            resetBtn.addEventListener('click', function() {
                trie = new TrieDS();
                insertedWords = [];
                buildState.inserting = false;
                buildState.word = '';
                buildState.stepIdx = 0;
                buildState.node = null;
                stepBtn.style.display = 'none';
                insertBtn.disabled = false;
                counterEl.textContent = '';
                renderBuild();
                msgEl.textContent = 'Try inserting "cat", "car", "card"! Watch how they share the same prefix path.';
                msgEl.style.color = 'var(--text2)';
            });

            renderBuild();
        })();

        // ========== Demo 2: Search in a Trie ==========
        (function() {
            var trie2 = new TrieDS();
            ['apple','app','apt','bat'].forEach(function(w) { trie2.insert(w); });

            var svgEl = container.querySelector('#trie-demo-search-svg');
            var inputEl = container.querySelector('#trie-demo-search-input');
            var stepBtn = container.querySelector('#trie-demo-search-step');
            var resetBtn = container.querySelector('#trie-demo-search-reset');
            var counterEl = container.querySelector('#trie-demo-search-counter');
            var msgEl = container.querySelector('#trie-demo-search-msg');

            var searchWord, searchIdx, searchNode, searchPath, allNodes2, searching;

            function resetSearch() {
                searchWord = ''; searchIdx = -1; searchNode = null; searchPath = []; searching = false;
                allNodes2 = layoutTrie(trie2.root);
                renderTrieSvg(svgEl, allNodes2, null, null);
                counterEl.textContent = '';
                stepBtn.disabled = false;
                msgEl.textContent = 'Try searching "apple", "app", "bat"! If the path is missing, it fails. If is_end is true at the end, it succeeds!';
                msgEl.style.color = 'var(--text2)';
            }

            stepBtn.addEventListener('click', function() {
                if (!searching) {
                    searchWord = inputEl.value.trim().toLowerCase();
                    if (!searchWord || !/^[a-z]+$/.test(searchWord)) {
                        msgEl.textContent = 'Please enter a lowercase English word!';
                        msgEl.style.color = 'var(--red)';
                        return;
                    }
                    searching = true;
                    searchIdx = 0;
                    searchNode = trie2.root;
                    allNodes2 = layoutTrie(trie2.root);
                    searchPath = [allNodes2[0]];
                    renderTrieSvg(svgEl, allNodes2, searchPath, 'searching');
                    msgEl.textContent = 'Searching for "' + searchWord + '"! Starting from the root.';
                    msgEl.style.color = 'var(--accent)';
                    counterEl.textContent = '0 / ' + searchWord.length;
                    return;
                }

                if (searchIdx >= searchWord.length) {
                    if (searchNode.isEnd) {
                        renderTrieSvg(svgEl, allNodes2, searchPath, 'found');
                        msgEl.textContent = 'Search for "' + searchWord + '" succeeded! is_end = true, so this word exists in the trie.';
                        msgEl.style.color = 'var(--green)';
                    } else {
                        renderTrieSvg(svgEl, allNodes2, searchPath, 'fail');
                        msgEl.textContent = 'Search for "' + searchWord + '" failed! The path exists but is_end = false, so this word was not stored.';
                        msgEl.style.color = 'var(--red)';
                    }
                    stepBtn.disabled = true;
                    searching = false;
                    return;
                }

                var ch = searchWord[searchIdx];
                if (!searchNode.children[ch]) {
                    renderTrieSvg(svgEl, allNodes2, searchPath, 'fail');
                    msgEl.textContent = 'No child node "' + ch + '"! Search for "' + searchWord + '" failed.';
                    msgEl.style.color = 'var(--red)';
                    stepBtn.disabled = true;
                    searching = false;
                    return;
                }

                searchNode = searchNode.children[ch];
                var found = allNodes2.filter(function(n) { return n.node === searchNode; });
                if (found.length > 0) searchPath.push(found[0]);
                searchIdx++;
                counterEl.textContent = searchIdx + ' / ' + searchWord.length;
                renderTrieSvg(svgEl, allNodes2, searchPath, 'searching');
                msgEl.textContent = 'Found node "' + ch + '"! Following it. (' + searchIdx + '/' + searchWord.length + ' characters)';
                msgEl.style.color = 'var(--yellow)';

                if (searchIdx >= searchWord.length) {
                    msgEl.textContent += ' All characters traversed. Next step will check is_end!';
                }
            });

            resetBtn.addEventListener('click', resetSearch);
            resetSearch();
        })();

        // ========== Demo 3: Autocomplete ==========
        (function() {
            var autoInput = container.querySelector('#trie-demo-auto-input');
            var wordsInput = container.querySelector('#trie-demo-auto-words');
            var resultsEl = container.querySelector('#trie-demo-auto-results');
            var msgEl = container.querySelector('#trie-demo-auto-msg');

            function buildTrieFromWords(words) {
                var t = new TrieDS();
                words.forEach(function(w) { var ww = w.trim().toLowerCase(); if (ww) t.insert(ww); });
                return t;
            }

            function update() {
                var words = wordsInput.value.split(',').map(function(w) { return w.trim(); }).filter(function(w) { return w.length > 0; });
                var t = buildTrieFromWords(words);
                var prefix = autoInput.value.trim().toLowerCase();
                resultsEl.innerHTML = '';

                if (!prefix) {
                    resultsEl.innerHTML = '<span style="color:var(--text3);font-size:0.85rem;">Type a prefix to see suggestions</span>';
                    msgEl.textContent = 'Type a prefix character by character! Watch the suggestions update in real time.';
                    msgEl.style.color = 'var(--text2)';
                    return;
                }

                var results = t.autocomplete(prefix);
                if (results.length === 0) {
                    resultsEl.innerHTML = '<span style="color:var(--red);font-size:0.85rem;">No words starting with "' + prefix + '"</span>';
                    msgEl.textContent = 'No words in the trie start with this prefix. Try a different prefix or add more words!';
                    msgEl.style.color = 'var(--red)';
                } else {
                    results.forEach(function(w) {
                        var span = document.createElement('span');
                        span.style.cssText = 'padding:6px 14px;background:var(--accent)12;color:var(--accent);border-radius:8px;font-weight:600;font-size:0.9rem;border:1.5px solid var(--accent)30;';
                        span.innerHTML = '<strong>' + w.substring(0, prefix.length) + '</strong>' + w.substring(prefix.length);
                        resultsEl.appendChild(span);
                    });
                    msgEl.textContent = results.length + ' word(s) found starting with "' + prefix + '"! The trie follows the prefix path, then collects all words below.';
                    msgEl.style.color = 'var(--green)';
                }
            }

            autoInput.addEventListener('input', update);
            wordsInput.addEventListener('change', update);
            update();
        })();
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 Click Next to start</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; Prev</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">Before start</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">Next &rarr;</button>' +
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
            if (idx < 0) { indicator.textContent = 'Before start'; desc.textContent = '\u25B6 Click Next to start'; }
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

    // ===== Concept Visualization Tab =====
    renderVisualize: function(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-trie';

        container.innerHTML =
            '<div class="hero" style="padding-bottom:12px;">' +
            '<h2>Trie Insertion Visualization</h2>' +
            '<p class="hero-sub">Let us watch the step-by-step process of inserting "cat", "car", "card" into a trie.</p>' +
            '</div>' +
            '<div class="graph-svg-container" style="min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;position:relative;">' +
            '<div id="str-tree-' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:0;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Current Status</div>' +
            '<div id="str-status-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">Click Next to begin</div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Inserted Words</div>' +
            '<div id="str-words-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">None</div>' +
            '</div>' +
            '</div>' +
            self._createStepDesc(suffix) +
            self._createStepControls(suffix) +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span class="str-char-box" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">R</span> Existing Node</span>' +
            '<span><span class="str-char-box comparing" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">A</span> Currently Visiting</span>' +
            '<span><span class="str-char-box matched" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">N</span> Newly Created</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);vertical-align:middle;"></span> End of Word (is_end)</span>' +
            '</div>';

        var treeEl = container.querySelector('#str-tree-' + suffix);
        var statusEl = container.querySelector('#str-status-' + suffix);
        var wordsEl = container.querySelector('#str-words-' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) {
            return { ch: ch, children: {}, is_end: false, id: 'tn-' + (nodeIdCounter++) };
        }

        function renderTrie(root, highlightIds, newIds, endIds) {
            highlightIds = highlightIds || {};
            newIds = newIds || {};
            endIds = endIds || {};

            function renderNode(node) {
                var childKeys = Object.keys(node.children).sort();
                var isHighlight = highlightIds[node.id];
                var isNew = newIds[node.id];
                var isEnd = node.is_end || endIds[node.id];

                var cls = 'str-char-box';
                if (isNew) cls += ' matched';
                else if (isHighlight) cls += ' comparing';

                var label = node.ch === '' ? 'root' : node.ch;
                var endMarker = isEnd ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:4px;vertical-align:middle;" title="End of Word"></span>' : '';

                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:36px;min-height:36px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;position:relative;" data-node-id="' + node.id + '">' + label + endMarker + '</div>';

                if (childKeys.length > 0) {
                    html += '<div style="width:2px;height:16px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:12px;align-items:flex-start;">';
                    childKeys.forEach(function(k) {
                        html += renderNode(node.children[k]);
                    });
                    html += '</div>';
                }

                html += '</div>';
                return html;
            }

            return renderNode(root);
        }

        var words = ['cat', 'car', 'card'];
        var rootBuild = makeNode('');
        var allSteps = [];
        var doneWords = [];

        var initialHTML = renderTrie(rootBuild, {}, {}, {});

        words.forEach(function(word) {
            var wordCopy = word;
            var beforeHTML = renderTrie(rootBuild, {}, {}, {});
            var beforeWordsHTML = doneWords.length > 0
                ? doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ')
                : 'None';

            allSteps.push({
                description: '"' + wordCopy + '" will be inserted.',
                treeHTML: beforeHTML,
                statusHTML: '<strong>"' + wordCopy + '"</strong> Starting insertion.',
                wordsHTML: beforeWordsHTML
            });

            var node = rootBuild;
            for (var i = 0; i < word.length; i++) {
                var ch = word[i];
                var isNew = !(ch in node.children);
                var lettersSoFar = word.substring(0, i + 1);

                if (isNew) {
                    node.children[ch] = makeNode(ch);
                }

                var currentNodeId = node.children[ch].id;
                var hl = {};
                hl[currentNodeId] = true;
                var nw = {};
                if (isNew) nw[currentNodeId] = true;

                var snapHTML = renderTrie(rootBuild, hl, isNew ? nw : {}, {});
                var descText = isNew
                    ? '"' + wordCopy + '": \'' + ch + '\' creating a new node. (path: ' + lettersSoFar + ')'
                    : '"' + wordCopy + '": \'' + ch + '\' node already exists. Reusing. (path: ' + lettersSoFar + ')';
                var statHTML = isNew
                    ? '<span style="color:var(--green);">\'' + ch + '\' node created!</span> (' + lettersSoFar + ')'
                    : '<span style="color:var(--yellow);">\'' + ch + '\' reused</span> (' + lettersSoFar + ')';

                allSteps.push({
                    description: descText,
                    treeHTML: snapHTML,
                    statusHTML: statHTML,
                    wordsHTML: beforeWordsHTML
                });

                node = node.children[ch];
            }

            node.is_end = true;
            doneWords.push(wordCopy);

            var doneHTML = renderTrie(rootBuild, {}, {}, {});
            var doneWordsHTML = doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ');

            allSteps.push({
                description: '"' + wordCopy + '" Insertion complete! \'' + word[word.length - 1] + '\' node is marked with is_end.',
                treeHTML: doneHTML,
                statusHTML: '<strong style="color:var(--green);">"' + wordCopy + '" Insertion complete!</strong>',
                wordsHTML: doneWordsHTML
            });
        });

        var finalHTML = renderTrie(rootBuild, {}, {}, {});
        var finalWordsHTML = doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ');
        allSteps.push({
            description: 'All words inserted! "cat", "car", "card" share the "ca" prefix.',
            treeHTML: finalHTML,
            statusHTML: '<strong style="color:var(--green);">Done!</strong> "cat", "car", "card" all share the "ca" path.',
            wordsHTML: finalWordsHTML
        });

        treeEl.innerHTML = initialHTML;

        var vizSteps = [];
        allSteps.forEach(function(snap) {
            vizSteps.push({
                description: snap.description,
                _before: null,
                action: function() {
                    this._before = {
                        tree: treeEl.innerHTML,
                        status: statusEl.innerHTML,
                        words: wordsEl.innerHTML
                    };
                    treeEl.innerHTML = snap.treeHTML;
                    statusEl.innerHTML = snap.statusHTML;
                    wordsEl.innerHTML = snap.wordsHTML;
                },
                undo: function() {
                    treeEl.innerHTML = this._before.tree;
                    statusEl.innerHTML = this._before.status;
                    wordsEl.innerHTML = this._before.words;
                }
            });
        });

        self._initStepController(container, vizSteps, suffix);
    },

    // ====================================================================
    // Simulation 1: Trie Implementation (lc-208)
    // ====================================================================
    _renderVizImplement: function(container) {
        var self = this;
        var suffix = '-impl';
        var DEFAULT_WORDS = 'apple, app';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Trie Implementation Simulation</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Insert words, then test search/startsWith.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Words to insert: <input type="text" id="trie-impl-input" value="' + DEFAULT_WORDS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:220px;"></label>' +
            '<button class="btn btn-primary" id="trie-impl-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-tree' + suffix + '" style="display:flex;flex-direction:column;align-items:center;min-height:180px;margin-bottom:12px;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var treeEl = container.querySelector('#str-tree' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) { return { ch: ch, children: {}, is_end: false, id: 'tn-' + (nodeIdCounter++) }; }

        function renderTrie(root, hlIds, newIds) {
            hlIds = hlIds || {}; newIds = newIds || {};
            function renderNode(node) {
                var keys = Object.keys(node.children).sort();
                var cls = 'str-char-box';
                if (newIds[node.id]) cls += ' matched';
                else if (hlIds[node.id]) cls += ' comparing';
                var label = node.ch === '' ? 'root' : node.ch;
                var endM = node.is_end ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:3px;vertical-align:middle;"></span>' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:32px;min-height:32px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">' + label + endM + '</div>';
                if (keys.length > 0) {
                    html += '<div style="width:2px;height:12px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:10px;align-items:flex-start;">';
                    keys.forEach(function(k) { html += renderNode(node.children[k]); });
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }
            return renderNode(root);
        }

        function buildSteps(words) {
            nodeIdCounter = 0;
            var root = makeNode('');
            var steps = [];
            var builtHTML = renderTrie(root, {}, {});
            treeEl.innerHTML = builtHTML;
            infoEl.innerHTML = '<span style="color:var(--text2);">Inserting and searching words.</span>';

            // Insert words step by step
            words.forEach(function(word) {
                var prevHTML = renderTrie(root, {}, {});
                var node = root;
                for (var i = 0; i < word.length; i++) {
                    var ch = word[i];
                    var isNew = !(ch in node.children);
                    if (isNew) node.children[ch] = makeNode(ch);
                    node = node.children[ch];
                }
                node.is_end = true;
                var afterHTML = renderTrie(root, {}, {});

                (function(word, prevHTML, afterHTML) {
                    steps.push({
                        description: 'insert("' + word + '") — Inserting into the trie.',
                        action: function() { treeEl.innerHTML = afterHTML; infoEl.innerHTML = '<strong style="color:var(--green);">"' + word + '" Inserted!</strong>'; },
                        undo: function() { treeEl.innerHTML = prevHTML; infoEl.innerHTML = '<span style="color:var(--text2);">Inserting and searching words.</span>'; }
                    });
                })(word, prevHTML, afterHTML);
            });

            // Build search queries from the inserted words
            var searches = [];
            words.forEach(function(w) {
                searches.push({ word: w, type: 'search', expected: true });
            });
            // Add a prefix-only search (first word minus last char) if possible
            if (words.length > 0 && words[0].length > 1) {
                var prefix = words[0].substring(0, words[0].length - 1);
                // Check if prefix itself was inserted
                var prefixInserted = words.indexOf(prefix) >= 0;
                searches.push({ word: prefix, type: 'search', expected: prefixInserted });
            }
            // Add a startsWith query for common prefix
            if (words.length > 0) {
                var sw = words[0].length > 2 ? words[0].substring(0, 3) : words[0].substring(0, 1);
                searches.push({ word: sw, type: 'startsWith', expected: true });
            }

            // Search/startsWith steps
            var stableHTML = renderTrie(root, {}, {});
            searches.forEach(function(s) {
                // Actually compute the result against the trie
                var node = root;
                var found = true;
                var hlIds = {};
                for (var i = 0; i < s.word.length; i++) {
                    if (!(s.word[i] in node.children)) { found = false; break; }
                    node = node.children[s.word[i]];
                    hlIds[node.id] = true;
                }
                var result;
                if (s.type === 'search') { result = found && node.is_end; }
                else { result = found; }

                var typeLabel = s.type === 'search' ? 'search' : 'startsWith';
                var resultStr = result ? '<span style="color:var(--green);font-weight:700;">True</span>' : '<span style="color:var(--red);font-weight:700;">False</span>';
                var reason = '';
                if (s.type === 'search' && found && !node.is_end) reason = ' (is_end is False)';
                else if (s.type === 'search' && !found) reason = ' (path does not exist)';
                else if (s.type === 'startsWith' && result) reason = ' (path exists, that is enough)';
                var hlHTML = renderTrie(root, hlIds, {});

                (function(typeLabel, word, result, resultStr, reason, hlHTML, stableHTML) {
                    steps.push({
                        description: typeLabel + '("' + word + '") → ' + (result ? 'True' : 'False') + reason,
                        action: function() { treeEl.innerHTML = hlHTML; infoEl.innerHTML = '<code>' + typeLabel + '("' + word + '")</code> → ' + resultStr + reason; },
                        undo: function() { treeEl.innerHTML = stableHTML; infoEl.innerHTML = '<span style="color:var(--text2);">Starting search.</span>'; }
                    });
                })(typeLabel, s.word, result, resultStr, reason, hlHTML, stableHTML);
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-impl-input').value;
            var words = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (words.length === 0) words = DEFAULT_WORDS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(words);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-impl-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // Simulation 2: String Set (boj-14425)
    // ====================================================================
    _renderVizStringSet: function(container) {
        var self = this, suffix = '-strset';
        var DEFAULT_SET = 'baekjoon, codeplus, startlink';
        var DEFAULT_QUERIES = 'baekjoon, codeminus, startlink, lucky';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">String Set Simulation</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Insert words into set S, then check if query strings are in the set.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Set S: <input type="text" id="trie-set-input" value="' + DEFAULT_SET + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<label style="font-weight:600;">Queries: <input type="text" id="trie-set-query" value="' + DEFAULT_QUERIES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:280px;"></label>' +
            '<button class="btn btn-primary" id="trie-set-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div style="display:flex;gap:24px;margin-bottom:12px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Set S</div>' +
            '<div id="str-set' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">Search Results</div>' +
            '<div id="str-result' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '</div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var setEl = container.querySelector('#str-set' + suffix);
        var resultEl = container.querySelector('#str-result' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        function buildSteps(setWords, queries) {
            setEl.innerHTML = 'Empty';
            resultEl.innerHTML = '—';
            infoEl.innerHTML = '<span style="color:var(--text2);">Inserting words into the trie and searching.</span>';

            var setLookup = {};
            setWords.forEach(function(w) { setLookup[w] = true; });

            var insertedSet = [];
            var foundCount = 0;
            var searchResults = [];
            var steps = [];

            // Insert steps
            setWords.forEach(function(w) {
                var prevInserted = insertedSet.slice();
                insertedSet.push(w);
                var afterInserted = insertedSet.slice();

                (function(w, prevInserted, afterInserted) {
                    steps.push({
                        description: 'Inserting "' + w + '" into set S.',
                        action: function() {
                            setEl.innerHTML = afterInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ');
                            infoEl.innerHTML = '<strong>"' + w + '"</strong> Inserted. Set size: ' + afterInserted.length;
                        },
                        undo: function() {
                            setEl.innerHTML = prevInserted.length > 0 ? prevInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ') : 'Empty';
                            infoEl.innerHTML = '<span style="color:var(--text2);">Inserting words into the trie and searching.</span>';
                        }
                    });
                })(w, prevInserted, afterInserted);
            });

            // Search steps
            queries.forEach(function(q) {
                var found = !!setLookup[q];
                var prevResults = searchResults.slice();
                var prevCount = foundCount;
                searchResults.push({ word: q, found: found });
                if (found) foundCount++;
                var afterResults = searchResults.slice();
                var afterCount = foundCount;

                (function(q, found, prevResults, prevCount, afterResults, afterCount) {
                    steps.push({
                        description: 'search("' + q + '") → ' + (found ? 'YES (found in set)' : 'NO (not in set)'),
                        action: function() {
                            resultEl.innerHTML = afterResults.map(function(r) {
                                var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                                return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                            }).join(' ');
                            infoEl.innerHTML = '"' + q + '" → ' + (found ? '<span style="color:var(--green);font-weight:700;">Found!</span>' : '<span style="color:var(--red);font-weight:700;">Not found</span>') + ' (found count: ' + afterCount + ')';
                        },
                        undo: function() {
                            resultEl.innerHTML = prevResults.length > 0 ? prevResults.map(function(r) {
                                var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                                return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                            }).join(' ') : '—';
                            infoEl.innerHTML = 'Searching...';
                        }
                    });
                })(q, found, prevResults, prevCount, afterResults, afterCount);
            });

            // Final step
            var totalFound = foundCount;
            steps.push({
                description: 'Done! Strings found in set S: ' + totalFound + ' total',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ Answer: ' + totalFound + ' total</strong>'; },
                undo: function() { infoEl.innerHTML = 'Searching...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var rawSet = container.querySelector('#trie-set-input').value;
            var rawQ = container.querySelector('#trie-set-query').value;
            var setWords = rawSet.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            var queries = rawQ.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (setWords.length === 0) setWords = DEFAULT_SET.split(',').map(function(s) { return s.trim(); });
            if (queries.length === 0) queries = DEFAULT_QUERIES.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(setWords, queries);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-set-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // Simulation 3: Phone List (boj-5052)
    // ====================================================================
    _renderVizPhoneBook: function(container) {
        var self = this, suffix = '-phone';
        var DEFAULT_NUMBERS = '911, 97625999, 91125426';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Phone List — Prefix Detection</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Insert phone numbers into a trie and check for prefix relationships.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Phone numbers: <input type="text" id="trie-phone-input" value="' + DEFAULT_NUMBERS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="trie-phone-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-tree' + suffix + '" style="display:flex;flex-direction:column;align-items:center;min-height:160px;margin-bottom:12px;overflow-x:auto;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var treeEl = container.querySelector('#str-tree' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        var nodeIdCounter = 0;
        function makeNode(ch) { return { ch: ch, children: {}, is_end: false, id: 'pn-' + (nodeIdCounter++) }; }

        function renderTrie(root, hlIds, alertIds) {
            hlIds = hlIds || {}; alertIds = alertIds || {};
            function renderNode(node) {
                var keys = Object.keys(node.children).sort();
                var cls = 'str-char-box';
                if (alertIds[node.id]) cls += ' matched';
                else if (hlIds[node.id]) cls += ' comparing';
                var label = node.ch === '' ? 'root' : node.ch;
                var endM = node.is_end ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--green);margin-left:3px;vertical-align:middle;"></span>' : '';
                var html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += '<div class="' + cls + '" style="min-width:28px;min-height:28px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">' + label + endM + '</div>';
                if (keys.length > 0) {
                    html += '<div style="width:2px;height:10px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:6px;align-items:flex-start;">';
                    keys.forEach(function(k) { html += renderNode(node.children[k]); });
                    html += '</div>';
                }
                html += '</div>';
                return html;
            }
            return renderNode(root);
        }

        function buildSteps(numbers) {
            nodeIdCounter = 0;
            var root = makeNode('');
            var steps = [];
            var consistent = true;

            treeEl.innerHTML = renderTrie(root, {}, {});
            infoEl.innerHTML = '<span style="color:var(--text2);">Insert phone numbers into a trie and check for prefix relationships.</span>';

            numbers.forEach(function(num) {
                var prevHTML = renderTrie(root, {}, {});
                var node = root;
                var prefixFound = false;
                for (var i = 0; i < num.length; i++) {
                    var ch = num[i];
                    if (node.is_end) prefixFound = true;
                    if (!(ch in node.children)) node.children[ch] = makeNode(ch);
                    node = node.children[ch];
                }
                node.is_end = true;
                if (Object.keys(node.children).length > 0) prefixFound = true;
                if (prefixFound) consistent = false;

                var afterHTML = renderTrie(root, {}, {});
                var isOk = !prefixFound;

                (function(num, prevHTML, afterHTML, isOk) {
                    steps.push({
                        description: '"' + num + '" insert -> ' + (isOk ? 'No prefix issue' : 'Prefix relationship found!'),
                        action: function() {
                            treeEl.innerHTML = afterHTML;
                            infoEl.innerHTML = '"' + num + '" insert -> ' + (isOk
                                ? '<span style="color:var(--green);">OK</span>'
                                : '<span style="color:var(--red);font-weight:700;">Prefix relationship found!</span>');
                        },
                        undo: function() {
                            treeEl.innerHTML = prevHTML;
                            infoEl.innerHTML = '<span style="color:var(--text2);">Insert phone numbers into a trie and check for prefix relationships.</span>';
                        }
                    });
                })(num, prevHTML, afterHTML, isOk);
            });

            var finalConsistent = consistent;
            steps.push({
                description: 'Done! Consistency: ' + (finalConsistent ? 'YES' : 'NO'),
                action: function() {
                    infoEl.innerHTML = '<strong style="font-size:1.1rem;color:' + (finalConsistent ? 'var(--green)' : 'var(--red)') + ';">✅ Result: ' + (finalConsistent ? 'YES (consistent)' : 'NO (inconsistent)') + '</strong>';
                },
                undo: function() { infoEl.innerHTML = 'Checking...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-phone-input').value;
            var numbers = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (numbers.length === 0) numbers = DEFAULT_NUMBERS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(numbers);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-phone-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ====================================================================
    // Simulation 4: Longest Common Prefix (lc-14)
    // ====================================================================
    _renderVizLCP: function(container) {
        var self = this, suffix = '-lcp';
        var DEFAULT_STRS = 'flower, flow, flight';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">Longest Common Prefix (LCP)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">Find the common prefix of strings.</p>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">Strings: <input type="text" id="trie-lcp-input" value="' + DEFAULT_STRS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:260px;"></label>' +
            '<button class="btn btn-primary" id="trie-lcp-reset">🔄</button>' +
            '</div>' +
            self._createStepDesc(suffix) +
            '<div id="str-chars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var charsEl = container.querySelector('#str-chars' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        function buildSteps(strs) {
            function renderChars(colIdx, status) {
                var html = '';
                strs.forEach(function(s) {
                    html += '<div style="display:flex;gap:3px;margin-bottom:6px;align-items:center;">' +
                        '<span style="width:80px;font-size:0.8rem;color:var(--text3);text-align:right;margin-right:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + s + ':</span>';
                    for (var ci = 0; ci < s.length; ci++) {
                        var bg = 'background:var(--bg2);';
                        if (colIdx >= 0 && ci < colIdx) bg = 'background:var(--green)20;border:2px solid var(--green);';
                        if (ci === colIdx && status === 0) bg = 'background:var(--accent);color:white;';
                        if (ci === colIdx && status === 1) bg = 'background:var(--green);color:white;';
                        if (ci === colIdx && status === 2) bg = 'background:var(--red);color:white;';
                        html += '<div style="width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;font-size:0.85rem;' + bg + '">' + s[ci] + '</div>';
                    }
                    html += '</div>';
                });
                charsEl.innerHTML = html;
            }

            renderChars(-1, -1);
            infoEl.innerHTML = '<span style="color:var(--text2);">Comparing characters at each position to find the common prefix.</span>';

            var steps = [];
            if (strs.length === 0) {
                steps.push({
                    description: 'Empty array -- no common prefix.',
                    action: function() { infoEl.innerHTML = '<strong style="color:var(--red);">The array is empty.</strong>'; },
                    undo: function() { infoEl.innerHTML = '<span style="color:var(--text2);">Comparison not started</span>'; }
                });
                return steps;
            }

            var minLen = Math.min.apply(null, strs.map(function(s) { return s.length; }));
            var lcpLen = 0;

            for (var col = 0; col < minLen; col++) {
                var ch = strs[0][col];
                var allMatch = strs.every(function(s) { return s[col] === ch; });
                var capturedCol = col;
                var capturedCh = ch;

                if (allMatch) {
                    lcpLen = col + 1;
                    (function(capturedCol, capturedCh, renderChars) {
                        steps.push({
                            description: 'Position ' + capturedCol + ': all \'' + capturedCh + '\' match!',
                            action: function() { renderChars(capturedCol, 1); infoEl.innerHTML = 'Position ' + capturedCol + ': all <strong>\'' + capturedCh + '\'</strong> <span style="color:var(--green);">Match!</span>'; },
                            undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">Comparing...</span>'; }
                        });
                    })(capturedCol, capturedCh, renderChars);
                } else {
                    (function(capturedCol, renderChars) {
                        steps.push({
                            description: 'Position ' + capturedCol + ': Mismatch found! Stopping here.',
                            action: function() { renderChars(capturedCol, 2); infoEl.innerHTML = 'Position ' + capturedCol + ': <span style="color:var(--red);font-weight:700;">Mismatch!</span> The common prefix ends here.'; },
                            undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">Comparing...</span>'; }
                        });
                    })(capturedCol, renderChars);
                    break;
                }
            }

            var result = strs[0].substring(0, lcpLen);
            steps.push({
                description: 'Done! Longest Common Prefix: "' + result + '" (length ' + lcpLen + ')',
                action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ LCP = "' + result + '" (length ' + lcpLen + ')</strong>'; },
                undo: function() { infoEl.innerHTML = 'Comparing...'; }
            });

            return steps;
        }

        function parseAndBuild() {
            var raw = container.querySelector('#trie-lcp-input').value;
            var strs = raw.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            if (strs.length === 0) strs = DEFAULT_STRS.split(',').map(function(s) { return s.trim(); });
            var steps = buildSteps(strs);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#trie-lcp-reset').addEventListener('click', function() {
            self._clearVizState();
            parseAndBuild();
        });

        parseAndBuild();
    },

    // ===== Empty Stub =====
    renderProblem: function(container) {},

    // ===== Problem Stages =====
    stages: [
        { num: 1, title: 'Prefix & String Sets', desc: 'Common prefix, string set lookup (Easy~Silver)', problemIds: ['lc-14', 'boj-14425'] },
        { num: 2, title: 'Trie Implementation & Applications', desc: 'Implement trie, prefix relationship detection (Medium~Gold)', problemIds: ['lc-208', 'boj-5052'] }
    ],

    // ===== Problem List =====
    problems: [
        {
            id: 'lc-14',
            title: 'LeetCode 14 - Longest Common Prefix',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/longest-common-prefix/',
            simIntro: 'Watch the process of comparing strings vertically to find the common prefix.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>strs = ["flower","flow","flight"]</pre></div>
                    <div><strong>Output</strong><pre>"fl"</pre></div>
                </div></div>
                <div class="problem-example"><h4>Example 2</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>strs = ["dog","racecar","car"]</pre></div>
                    <div><strong>Output</strong><pre>""</pre></div>
                </div><p class="example-explain">There is no common prefix.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ strs.length ≤ 200</li>
                    <li>0 ≤ strs[i].length ≤ 200</li>
                    <li>strs[i] consists only of lowercase English letters</li>
                </ul>
            `,
            hints: [
                { title: 'First thought: compare character by character with the first string', content: 'What if we take the first string and compare it with the rest <strong>character by character</strong>?<br>Check the i-th character across all strings; when a different character appears, the common prefix ends there!<br>This approach runs in O(S) (S = total characters) and is fast enough.' },
                { title: 'A more efficient approach?', content: 'If you <strong>sort the array lexicographically</strong>, you only need to compare the <strong>first</strong> and <strong>last</strong> strings!<br>The common prefix of the two most different strings (lexicographically) equals the overall common prefix.<br><span class="lang-py">Python: <code>min(strs)</code> and <code>max(strs)</code> directly give you the lexicographic extremes!</span><span class="lang-cpp">C++: <code>*min_element(strs.begin(), strs.end())</code> and <code>*max_element(...)</code> give the lexicographic extremes!</span>' },
                { title: 'Using a trie', content: 'Insert all strings into a trie, then start from the root.<br>Keep following nodes that have <strong>exactly one child and are not is_end</strong> -- the common prefix ends at a branching point or an is_end node!<br><br><div style="display:flex;flex-direction:column;align-items:center;gap:2px;margin:10px 0;padding:10px;background:var(--bg2);border-radius:10px;font-size:0.82rem;"><div style="padding:3px 8px;border-radius:12px;border:2px solid var(--green);background:var(--green)15;font-weight:700;color:var(--green);">f</div><div style="width:2px;height:8px;background:var(--green);"></div><div style="padding:3px 8px;border-radius:12px;border:2px solid var(--green);background:var(--green)15;font-weight:700;color:var(--green);">l</div><div style="font-size:0.65rem;color:var(--green);font-weight:600;">^ common prefix "fl"</div><div style="display:flex;gap:20px;margin-top:4px;"><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:2px;height:8px;background:var(--text2);"></div><div style="padding:3px 8px;border-radius:12px;border:1.5px solid var(--accent);font-weight:600;">o</div><div style="font-size:0.6rem;color:var(--text2);">flower, flow</div></div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><div style="width:2px;height:8px;background:var(--text2);"></div><div style="padding:3px 8px;border-radius:12px;border:1.5px solid var(--accent);font-weight:600;">i</div><div style="font-size:0.6rem;color:var(--text2);">flight</div></div></div><div style="font-size:0.65rem;color:var(--red);font-weight:600;margin-top:4px;">2 children -> stop here!</div></div>This is a great example of how a trie "structurally" reveals common prefixes.' }
            ],
            templates: {
                python: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""\n        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]\n        return strs[0]',
                cpp: 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";\n        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.size() - 1);\n                if (prefix.empty()) return "";\n            }\n        }\n        return prefix;\n    }\n};'
            },
            solutions: [{
                approach: 'Vertical Scanning',
                description: 'Compare all strings at each position based on the first string.',
                timeComplexity: 'O(S) (S = total characters)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: 'Edge case handling', desc: 'If the array is empty, there is no common prefix, so return an empty string.', code: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""' },
                        { title: 'Vertical scanning', desc: 'Compare the i-th character of the first string with all others.\nIf characters differ or a string is too short, the common prefix ends there.', code: '        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]' },
                        { title: 'Full match case', desc: 'If the loop completes without breaking, the entire first string is the common prefix.', code: '        return strs[0]' }
                    ],
                    cpp: [
                        { title: 'Edge case handling', desc: 'If the vector is empty, immediately return an empty string.', code: 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";' },
                        { title: 'Prefix shrinking method', desc: 'Start with the first string as prefix.\nCompare with each string and shrink prefix when it does not match.', code: '        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.size() - 1);\n                if (prefix.empty()) return "";\n            }\n        }' },
                        { title: 'Return Result', desc: 'Return the final prefix that matched all strings.', code: '        return prefix;\n    }\n};' }
                    ]
                },
                get templates() { return trieTopic.problems[3].templates; }
            }]
        },
        {
            id: 'boj-14425',
            title: 'BOJ 14425 - String Set',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14425',
            simIntro: 'Watch the process of inserting strings into a trie and searching to check set membership.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a set S consisting of N strings, write a program to count how many of the M input strings are contained in set S.</p>
                <h4>Input</h4>
                <p>The first line contains N and M (1 &le; N &le; 10,000, 1 &le; M &le; 10,000). The next N lines contain the strings in set S. The next M lines contain the strings to check. All strings consist of lowercase letters only and have length at most 500. No duplicate strings appear in set S.</p>
                <h4>Output</h4>
                <p>Print the total number of the M strings that are contained in set S.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>5 11
baekjoononlinejudge
startlink
codeplus
sundaycoding
codingsh
baekjoononlinejudge
codeplus
codeminus
startlink
starlink
sundaycoding
codingsh
codingho
lucky
judge</pre></div>
                    <div><strong>Output</strong><pre>4</pre></div>
                </div><p class="example-explain">Set S = {baekjoononlinejudge, startlink, codeplus, sundaycoding, codingsh}. Of the 11 query strings, 4 are found in S: baekjoononlinejudge, codeplus, startlink, sundaycoding.</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ N, M ≤ 10,000</li>
                    <li>String length ≤ 500</li>
                    <li>Strings consist only of lowercase letters</li>
                </ul>
            `,
            hints: [
                { title: 'First thought: compare one by one', content: 'We could compare each of the M strings against all N strings one by one, right?<br>But that gives us <strong>O(N * M * L)</strong>. If N and M are each 10,000 and the strings are long... it could be quite slow!<br><br><div style="display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:8px 0;padding:10px 14px;background:var(--bg2);border-radius:8px;"><div style="text-align:center;"><div style="width:28px;height:90px;background:var(--red)40;border:1.5px solid var(--red);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;font-weight:600;color:var(--red);margin-top:4px;">Brute force</div><div style="font-size:0.6rem;color:var(--text2);">N*M*L</div></div><div style="text-align:center;"><div style="width:28px;height:25px;background:var(--green)40;border:1.5px solid var(--green);border-radius:4px 4px 0 0;"></div><div style="font-size:0.7rem;font-weight:600;color:var(--green);margin-top:4px;">set/trie</div><div style="font-size:0.6rem;color:var(--text2);">(N+M)*L</div></div></div>' },
                { title: 'O(1) lookup with a set', content: '<span class="lang-py">Python: Put N strings in a <code>set()</code> and the <code>in</code> operation is O(L) on average!</span><span class="lang-cpp">C++: Put them in an <code>unordered_set</code> and <code>find</code> is O(L) on average!</span><br>Even checking M queries is fast enough at <strong>O((N+M) * L)</strong>. Simple and efficient!' },
                { title: 'Also solvable with a trie', content: 'This problem can easily be solved with a set, but it is a great problem for <strong>practicing trie implementation</strong>!<br>Insert N strings into the trie with <code>insert</code>, then <code>search</code> for each of the M strings and count how many return True.<br>No prefix features are needed, but you can solidly practice basic insert/search implementation.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\n# Method 1: using set (simple)\nN, M = map(int, input().split())\nS = set(input().strip() for _ in range(N))\ncount = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)',
                cpp: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    Trie trie;\n    string s;\n    for (int i = 0; i < N; i++) {\n        cin >> s;\n        trie.insert(s);\n    }\n\n    int count = 0;\n    for (int i = 0; i < M; i++) {\n        cin >> s;\n        if (trie.search(s)) count++;\n    }\n    cout << count << endl;\n}'
            },
            solutions: [{
                approach: 'Set or Trie',
                description: 'Insert set S into a set and check M queries, or use trie insert/search.',
                timeComplexity: 'O((N+M) × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: 'Input', desc: 'Use sys.stdin.readline for fast input.\nN strings form the set, M strings are queries to check.', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: 'Create set', desc: 'Putting N items in a set makes the in operator O(1) on average.\nMore concise than a trie, but a trie is useful for learning the concept.', code: 'S = set(input().strip() for _ in range(N))' },
                        { title: 'Check and output', desc: 'Check each of M strings against the set and count matches.\nHandle concisely with sum + generator.', code: 'count = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)' }
                    ],
                    cpp: [
                        { title: 'Input + Trie setup', desc: 'Practice implementing a trie directly in C++!', code: '#include <iostream>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool is_end = false;\n};\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);' },
                        { title: 'Trie insertion', desc: 'Insert N strings into the trie.\nIterate character by character using a char array + buf[j].', code: '    TrieNode* root = new TrieNode();\n    char buf[501];\n    for (int i = 0; i < N; i++) {\n        scanf("%s", buf);\n        TrieNode* node = root;\n        for (int j = 0; buf[j]; j++) {\n            if (!node->children.count(buf[j]))\n                node->children[buf[j]] = new TrieNode();\n            node = node->children[buf[j]];\n        }\n        node->is_end = true;\n    }' },
                        { title: 'Search and output', desc: 'Search M strings in the trie and count those with is_end.\nBreak immediately when the path ends to skip unnecessary traversal.', code: '    int count = 0;\n    for (int i = 0; i < M; i++) {\n        scanf("%s", buf);\n        TrieNode* node = root;\n        bool found = true;\n        for (int j = 0; buf[j]; j++) {\n            if (!node->children.count(buf[j])) { found = false; break; }\n            node = node->children[buf[j]];\n        }\n        if (found && node->is_end) count++;\n    }\n    printf("%d\\n", count);\n}' }
                    ]
                },
                get templates() { return trieTopic.problems[1].templates; }
            }]
        },

        // ===== Stage 2: Applied Trie =====,
        {
            id: 'lc-208',
            title: 'LeetCode 208 - Implement Trie',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
            simIntro: 'Insert words into a trie and see how search/startsWith work.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Implement a trie (prefix tree). The Trie class has the following methods:</p>
                <ul>
                    <li><code>Trie()</code> - Initializes the trie object.</li>
                    <li><code>void insert(String word)</code> - Inserts the string word into the trie.</li>
                    <li><code>boolean search(String word)</code> - Returns true if the string word is in the trie, false otherwise.</li>
                    <li><code>boolean startsWith(String prefix)</code> - Returns true if any previously inserted string has the prefix.</li>
                </ul>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]</pre></div>
                    <div><strong>Output</strong><pre>[null, null, true, false, true, null, true]</pre></div>
                </div><p class="example-explain">insert("apple") → search("apple") = true, search("app") = false ("app" was never inserted), startsWith("app") = true ("apple" starts with "app"), insert("app") → search("app") = true</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ word.length, prefix.length ≤ 2,000</li>
                    <li>word and prefix consist only of lowercase English letters</li>
                    <li>The total number of insert, search, and startsWith calls is at most 3 × 10<sup>4</sup> times</li>
                </ul>
            `,
            hints: [
                { title: 'Simplest approach: store in a list', content: 'What if we just store all words in a <strong>list</strong>?<br><code>search</code> uses the <code>in</code> operator on the list, and <code>startsWith</code> loops through each word to compare prefixes.<br>But... what if tens of thousands of words pile up? search is O(N), and startsWith loops through every word each time, getting slower and slower!' },
                { title: 'How to search prefixes quickly?', content: 'A trie is a <strong>tree structure where you descend one character per node</strong>.<br>If you insert "apple" and "app", they <strong>share</strong> the path "a->p->p".<br><br><div style="display:flex;flex-direction:column;align-items:center;gap:4px;margin:10px 0;padding:12px;background:var(--bg2);border-radius:10px;"><div style="display:flex;align-items:center;gap:0;"><div style="width:30px;height:30px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;background:var(--accent)15;">root</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--green)15;color:var(--green);">a</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--green);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--green)15;color:var(--green);">p</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--yellow)20;box-shadow:0 0 6px var(--yellow);">p</div><span style="font-size:0.65rem;color:var(--yellow);font-weight:600;margin-left:6px;">isEnd (app)</span></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--accent)10;">l</div></div><div style="width:2px;height:10px;background:var(--text2);"></div><div style="display:flex;align-items:center;gap:0;"><div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--yellow);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;background:var(--yellow)20;box-shadow:0 0 6px var(--yellow);">e</div><span style="font-size:0.65rem;color:var(--yellow);font-weight:600;margin-left:6px;">isEnd (apple)</span></div></div>Sharing common prefixes saves memory, and searching finishes in <strong>O(L)</strong> (L = word length)!<br><div style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0;"><div style="padding:6px 10px;background:var(--red)12;border:1.5px solid var(--red);border-radius:6px;font-size:0.82rem;text-align:center;"><div style="color:var(--red);font-weight:600;">List</div>O(N) search</div><div style="padding:6px 10px;background:var(--green)12;border:1.5px solid var(--green);border-radius:6px;font-size:0.82rem;text-align:center;"><div style="color:var(--green);font-weight:600;">Trie</div>O(L) search</div></div>' },
                { title: 'Designing the node structure', content: 'Each node needs two things:<br>1. <strong>children</strong> -- space to store child nodes (paths to the next character)<br>2. <strong>isEnd</strong> -- a flag indicating whether a word ends at this node<br><span class="lang-py">Python: <code>children = {}</code> manages children with a dictionary. Using characters as keys makes it flexible.</span><span class="lang-cpp">C++: <code>unordered_map&lt;char, Node*&gt;</code> or <code>Node* children[26]</code> array for child management. Arrays are faster, but maps are more flexible.</span>' }
            ],
            templates: {
                python: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True',
                cpp: 'class Trie {\n    struct Node {\n        unordered_map<char, Node*> children;\n        bool is_end = false;\n    };\n    Node* root;\npublic:\n    Trie() { root = new Node(); }\n\n    void insert(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new Node();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};'
            },
            solutions: [{
                approach: 'Direct Trie Implementation',
                description: 'Implement insert/search/startsWith using a TrieNode with a children map and is_end flag.',
                timeComplexity: 'O(L) per operation',
                spaceComplexity: 'O(total characters)',
                codeSteps: {
                    python: [
                        { title: 'Define TrieNode', desc: 'Store child nodes using a children dictionary.\nMark end of word with the is_end flag.', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False' },
                        { title: 'Initialize Trie', desc: 'Create an empty root node.\nAll insertions and searches start from the root.', code: 'class Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'Implement insert', desc: 'Follow each character, creating new nodes when missing.\nMark the last node with is_end = True to indicate end of word.', code: '    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True' },
                        { title: 'search / startsWith', desc: 'search checks is_end at the end of the path.\nstartsWith only checks if the path exists, so is_end does not matter.', code: '    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True' }
                    ],
                    cpp: [
                        { title: 'Define Node struct', desc: 'Manage children with unordered_map.\nSame role as Python dict.', code: 'class Trie {\n    struct Node {\n        unordered_map<char, Node*> children;\n        bool is_end = false;\n    };\n    Node* root;' },
                        { title: 'Initialize Trie', desc: 'Create an empty root with new Node().\nEquivalent to Python self.root = TrieNode().', code: 'public:\n    Trie() { root = new Node(); }' },
                        { title: 'Implement insert', desc: 'Check key existence with count(), create new Node() if missing.\nAccess pointer members with ->.', code: '    void insert(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new Node();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }' },
                        { title: 'search / startsWith', desc: 'search checks is_end, startsWith only checks the path.', code: '    bool search(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};' }
                    ]
                },
                get templates() { return trieTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-5052',
            title: 'BOJ 5052 - Phone List',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/5052',
            simIntro: 'Watch how prefix relationships are detected as phone numbers are inserted into a trie.',
            descriptionHTML: `
                <h3>Problem</h3>
                <p>Given a list of phone numbers, determine whether the list is consistent or not.</p>
                <p>For the phone list to be consistent, no number should be a prefix of another. For example, if the emergency number is 911 and a home phone number is 91125426, you cannot call that home number because dialing 911 immediately connects to emergency services.</p>
                <h4>Input</h4>
                <p>The first line contains the number of test cases t (1 &le; t &le; 50). For each test case, the first line contains the number of phone numbers n (1 &le; n &le; 10,000). The next n lines each contain a phone number. Phone numbers have at most 10 digits, and no duplicate phone numbers appear in the list.</p>
                <h4>Output</h4>
                <p>For each test case, print "YES" if the list is consistent, "NO" otherwise.</p>
                <div class="problem-example"><h4>Example 1</h4><div class="example-grid">
                    <div><strong>Input</strong><pre>2
3
911
97625999
91125426
5
113
12340
123440
12345
98346</pre></div>
                    <div><strong>Output</strong><pre>NO
YES</pre></div>
                </div><p class="example-explain">First case: 911 is a prefix of 91125426, so the list is inconsistent (NO). Second case: no number is a prefix of another, so the list is consistent (YES).</p></div>
                <h4>Constraints</h4>
                <ul>
                    <li>1 ≤ t ≤ 50 (number of test cases)</li>
                    <li>1 ≤ n ≤ 10,000 (number of phone numbers)</li>
                    <li>Phone number length ≤ 10</li>
                    <li>Phone numbers consist only of digits</li>
                </ul>
            `,
            hints: [
                { title: 'First thought: compare all pairs', content: 'To check if any number is a prefix of another among N numbers... we could compare all pairs, right?<br>But that gives <strong>O(N<sup>2</sup> * L)</strong>. If N is 10,000 that means 100 million comparisons... slow!' },
                { title: 'Sort, then compare only adjacent pairs!', content: 'If you <strong>sort lexicographically</strong>, prefix relationships only exist between <strong>adjacent numbers</strong>!<br>Example: ["911", "91125426", "97625999"] -> 911 and 91125426 end up next to each other.<br>Comparing only neighboring pairs after sorting solves it in <strong>O(N log N * L)</strong>!' },
                { title: 'Detect prefixes with a trie', content: 'You can detect prefix relationships on the fly while inserting numbers into a trie!<br><br><div style="display:flex;gap:16px;flex-wrap:wrap;margin:10px 0;"><div style="flex:1;min-width:140px;padding:10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;"><div style="font-size:0.75rem;font-weight:700;color:var(--red);margin-bottom:6px;">1. isEnd found on path</div><div style="display:flex;align-items:center;gap:4px;font-size:0.8rem;"><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">9</span><span>-></span><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">1</span><span>-></span><span style="padding:3px 6px;border-radius:4px;border:2px solid var(--yellow);background:var(--yellow)25;font-weight:700;box-shadow:0 0 4px var(--yellow);">1</span><span>-></span><span style="padding:3px 6px;border-radius:4px;border:1.5px dashed var(--text2);color:var(--text2);">2...</span></div><div style="font-size:0.68rem;color:var(--red);margin-top:4px;">911 is a prefix of 91125426!</div></div><div style="flex:1;min-width:140px;padding:10px;border:2px solid var(--red);border-radius:8px;background:var(--red)06;"><div style="font-size:0.75rem;font-weight:700;color:var(--red);margin-bottom:6px;">2. End node has children</div><div style="display:flex;align-items:center;gap:4px;font-size:0.8rem;"><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">9</span><span>-></span><span style="padding:3px 6px;border-radius:4px;border:1.5px solid var(--green);background:var(--green)15;font-weight:600;">1</span><span>-></span><span style="padding:3px 6px;border-radius:4px;border:2px solid var(--yellow);background:var(--yellow)25;font-weight:700;box-shadow:0 0 4px var(--yellow);">1</span></div><div style="font-size:0.68rem;color:var(--red);margin-top:4px;">Has children(2,5...) = prefix!</div></div></div>Checking both directions is the key.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """Insert while checking prefix relationships. Return False if found."""\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found\n\nt = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")',
                cpp: '#include <cstdio>\n#include <cstring>\n#include <string>\n#include <vector>\nusing namespace std;\n\nstruct TrieNode {\n    TrieNode* children[10] = {};\n    bool is_end = false;\n};\n\nbool insert(TrieNode* root, const string& s) {\n    TrieNode* node = root;\n    bool ok = true;\n    for (char ch : s) {\n        int idx = ch - \'0\';\n        if (node->is_end) ok = false;\n        if (!node->children[idx])\n            node->children[idx] = new TrieNode();\n        node = node->children[idx];\n    }\n    node->is_end = true;\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) ok = false;\n    return ok;\n}\n\nvoid deleteTrie(TrieNode* node) {\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) deleteTrie(node->children[i]);\n    delete node;\n}\n\nint main() {\n    int t;\n    scanf("%d", &t);\n    while (t--) {\n        int n;\n        scanf("%d", &n);\n        TrieNode* root = new TrieNode();\n        vector<string> nums(n);\n        bool ok = true;\n        for (int i = 0; i < n; i++) {\n            char buf[11];\n            scanf("%s", buf);\n            nums[i] = buf;\n        }\n        for (auto& s : nums) {\n            if (!insert(root, s)) ok = false;\n        }\n        puts(ok ? "YES" : "NO");\n        deleteTrie(root);\n    }\n}'
            },
            solutions: [{
                approach: 'Trie insertion + prefix check',
                description: 'If you encounter an is_end node during insertion, or the end node has children, a prefix relationship exists.',
                timeComplexity: 'O(N × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: 'Define TrieNode + Trie', desc: 'Define the basic trie structure.\nThe key is detecting prefix relationships during insert.', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'insert + prefix detection', desc: 'If is_end is encountered mid-path, an existing number is a prefix.\nIf children exist after insertion, the current number is a prefix of another.', code: '    def insert(self, word):\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found' },
                        { title: 'Process test cases', desc: 'Create a new trie for each test case and insert numbers.\nIf any prefix relationship is found, output NO.', code: 't = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")' }
                    ],
                    cpp: [
                        { title: 'Define TrieNode', desc: 'Only digits 0-9, so a children[10] array is sufficient.\nFaster than a map!', code: 'struct TrieNode {\n    TrieNode* children[10] = {};\n    bool is_end = false;\n};' },
                        { title: 'insert + prefix detection', desc: 'Found is_end mid-path -> prefix relationship.\nChildren exist after insertion -> current is a prefix.', code: 'bool insert(TrieNode* root, const string& s) {\n    TrieNode* node = root;\n    bool ok = true;\n    for (char ch : s) {\n        int idx = ch - \'0\';\n        if (node->is_end) ok = false;  // End flag found mid-path!\n        if (!node->children[idx])\n            node->children[idx] = new TrieNode();\n        node = node->children[idx];\n    }\n    node->is_end = true;\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) ok = false;  // If children exist, I am a prefix!\n    return ok;\n}' },
                        { title: 'Process test cases', desc: 'Create a new root for each test case to handle independently.\nIf insert returns false, a prefix relationship exists.', code: 'int main() {\n    int t; scanf("%d", &t);\n    while (t--) {\n        int n; scanf("%d", &n);\n        TrieNode* root = new TrieNode();\n        bool ok = true;\n        for (int i = 0; i < n; i++) {\n            char buf[11]; scanf("%s", buf);\n            if (!insert(root, string(buf))) ok = false;\n        }\n        puts(ok ? "YES" : "NO");\n    }\n}' }
                    ]
                },
                get templates() { return trieTopic.problems[2].templates; }
            }]
        }
    ]
};

// Module registration
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.trie = trieTopic;
