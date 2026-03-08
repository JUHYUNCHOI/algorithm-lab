// =========================================================
// 트라이 (Trie) 토픽 모듈
// =========================================================
var trieTopic = {
    id: 'trie',
    title: '트라이',
    icon: '🔠',
    category: '심화 선택',
    order: 20,
    description: '문자열을 효율적으로 저장하고 검색하는 트리 자료구조',
    relatedNote: '트라이는 자동완성, 맞춤법 검사, IP 라우팅 등에 활용되며, 압축 트라이(Radix Tree)로 메모리를 절약할 수 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'lc-208':    { type: '트라이 구현',     color: 'var(--accent)', vizMethod: '_renderVizImplement' },
        'boj-14425': { type: '문자열 집합',     color: 'var(--green)',  vizMethod: '_renderVizStringSet' },
        'boj-5052':  { type: '접두사 판별',     color: '#e17055',       vizMethod: '_renderVizPhoneBook' },
        'lc-14':     { type: '공통 접두사',     color: '#6c5ce7',       vizMethod: '_renderVizLCP' }
    },

    getProblemTabs: function(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent: function(container, problemId, tabId) {
        var self = this;
        var prob = self.problems.find(function(p) { return p.id === problemId; });
        if (!prob) { container.innerHTML = '<p>문제를 찾을 수 없습니다.</p>'; return; }
        var meta = self.problemMeta[problemId];
        if (!meta) { container.innerHTML = '<p>문제 메타 정보가 없습니다.</p>'; return; }
        self._clearVizState();
        var diffMap = { gold: 'Gold', silver: 'Silver', easy: 'Easy', medium: 'Medium', hard: 'Hard' };
        var header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:1.5rem;';
        header.innerHTML =
            '<span style="padding:4px 12px;background:' + meta.color + '15;border-radius:8px;font-size:0.85rem;color:' + meta.color + ';font-weight:600;">' + meta.type + '</span>' +
            '<span class="problem-diff ' + prob.difficulty + '">' + (diffMap[prob.difficulty] || '') + '</span>';
        container.appendChild(header);
        var flowMap = {
            problem: { intro: '먼저 문제를 읽고 입출력 형식을 파악해보세요.', icon: '📋' },
            think:   { intro: '바로 코드를 짜지 말고, 단계별 힌트를 열어보며 풀이 전략을 세워보세요.', icon: '💡' },
            sim:     { intro: prob.simIntro || '트라이가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
            code:    { intro: '이제 앞에서 정리한 풀이를 코드로 옮겨봅시다!', icon: '💻' }
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
        var tabLabels = { problem: '문제', think: '생각해볼것', sim: '시뮬레이션', code: '코드' };
        var ctaTexts = { problem: '문제를 이해했다면', think: '힌트를 모두 확인했다면', sim: '동작 원리를 파악했다면' };
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
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab: function(contentEl, prob) {
        var guide = document.createElement('div');
        guide.className = 'hint-steps-guide';
        guide.textContent = '단계별로 눌러서 힌트를 확인하세요';
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
            contentEl.innerHTML = '<p>코드 탭 로딩 중...</p>';
        }
    },

    // ===== 개념 설명 렌더링 =====
    renderConcept: function(container) {
        container.innerHTML = '\
            <div class="hero">\
                <h2>🔠 트라이 (Trie)</h2>\
                <p class="hero-sub">문자열을 빠르게 저장하고 검색하는 특별한 트리를 배워봅시다!</p>\
            </div>\
\
            <!-- 섹션 1: 트라이란? -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">1</span> 트라이란?\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> <em>"전화번호부의 색인(인덱스)"</em>을 떠올려 보세요!<br><br>\
                    전화번호부에서 "김"씨를 찾으려면 ㄱ → ㅣ → ㅁ 순서로 따라가면 됩니다.<br>\
                    마찬가지로 트라이는 문자열을 <strong>한 글자씩 트리에 저장</strong>합니다.<br>\
                    "cat"을 찾으려면 루트에서 c → a → t 순서로 내려가면 됩니다!<br><br>\
                    같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다.\
                    "cat"과 "car"는 "ca"까지 같은 길을 걷다가 갈라집니다.\
                    덕분에 <strong>접두사 검색이 매우 빠릅니다!</strong>\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="10" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="17" y1="12" x2="12" y2="24" stroke="var(--accent)" stroke-width="2"/><line x1="21" y1="12" x2="26" y2="24" stroke="var(--accent)" stroke-width="2"/></svg>\
                        </div>\
                        <h3>트리 구조</h3>\
                        <p>트라이는 <strong>트리(Tree)</strong> 자료구조입니다. 루트에서 시작하여 한 글자씩 자식 노드로 내려갑니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(L)</text></svg>\
                        </div>\
                        <h3>O(L) 검색</h3>\
                        <p>문자열 길이가 L이면 <strong>딱 L번</strong>만에 검색이 끝납니다! 해시 충돌 걱정 없이 정확합니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="16" font-size="10" fill="var(--text2)">cat</text><text x="2" y="30" font-size="10" fill="var(--text2)">car</text><text x="22" y="23" font-size="12" fill="var(--yellow)">ca...</text></svg>\
                        </div>\
                        <h3>접두사 공유</h3>\
                        <p>같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다. 메모리를 절약할 수 있습니다!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">Pre*</text></svg>\
                        </div>\
                        <h3>접두사 검색 최적</h3>\
                        <p>"app"으로 시작하는 단어 찾기! 트라이는 접두사(prefix) 검색에 <strong>최적의 자료구조</strong>입니다.</p>\
                    </div>\
                </div>\
                <div class="code-block">\
                    <pre><code class="language-python"># 트라이 vs 다른 방법 비교\n# N개의 문자열, 평균 길이 L\n\n# 1) 리스트에서 검색: O(N × L) — 하나씩 비교\n# 2) 집합(set)에서 검색: O(L) 평균 — 해시 사용\n# 3) 트라이에서 검색: O(L) 최악 — 항상 빠름!\n\n# 트라이의 진짜 강점: 접두사 검색!\n# "app"으로 시작하는 단어 모두 찾기\n# → 리스트/집합: O(N × L) 전부 확인해야 함\n# → 트라이: O(접두사 길이) + O(결과 수) 매우 빠름!</code></pre>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">"apple", "app", "apt", "bat"을 트라이에 넣으면, 루트의 자식 노드는 몇 개일까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        정답은 <strong>2개</strong>입니다! 첫 글자가 \'a\'와 \'b\' 두 종류이므로,\
                        루트에서 \'a\' 자식과 \'b\' 자식, 2개의 자식 노드가 생깁니다.\
                        "apple", "app", "apt"는 모두 \'a\'로 시작하므로 같은 자식을 공유합니다.\
                    </div>\
                </div>\
            </div>\
\
            <!-- 섹션 2: 트라이 구현 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">2</span> 트라이 구현\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 각 노드는 <em>"갈림길에 있는 이정표"</em>입니다!<br>\
                    이정표에는 다음 글자로 갈 수 있는 화살표(children)가 있고,\
                    "여기서 단어가 끝납니다"라는 깃발(is_end)이 있습니다.\
                    "cat"을 넣으면 c → a → t 이정표를 만들고, t에 깃발을 꽂습니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" fill="var(--accent)">{ }</text></svg>\
                        </div>\
                        <h3>TrieNode</h3>\
                        <p><code>children</code>: 자식 노드 딕셔너리<br><code>is_end</code>: 단어 끝 표시(깃발)</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">insert</text></svg>\
                        </div>\
                        <h3>삽입 (insert)</h3>\
                        <p>글자를 하나씩 따라가며, 없는 노드는 새로 만듭니다. 마지막에 <code>is_end = True</code>!</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">search</text></svg>\
                        </div>\
                        <h3>검색 (search)</h3>\
                        <p>글자를 따라가다가 없는 글자가 나오면 False. 끝까지 가서 <code>is_end</code>가 True면 존재!</p>\
                    </div>\
                </div>\
                <div class="code-block">\
                    <pre><code class="language-python">class TrieNode:\n    def __init__(self):\n        self.children = {}   # {\'a\': TrieNode, \'b\': TrieNode, ...}\n        self.is_end = False  # 이 노드에서 단어가 끝나는가?\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """단어를 트라이에 삽입합니다."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()  # 없으면 새로 만들기\n            node = node.children[ch]\n        node.is_end = True  # 단어의 끝 표시!\n\n    def search(self, word):\n        """단어가 트라이에 존재하는지 확인합니다."""\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False  # 경로가 없으면 단어도 없다!\n            node = node.children[ch]\n        return node.is_end  # 끝 표시가 있어야 진짜 단어!\n\n    def startsWith(self, prefix):\n        """접두사로 시작하는 단어가 있는지 확인합니다."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True  # 경로만 있으면 OK! (is_end 불필요)\n\n# 사용 예시\ntrie = Trie()\ntrie.insert("apple")\ntrie.insert("app")\nprint(trie.search("apple"))      # True\nprint(trie.search("app"))        # True\nprint(trie.search("ap"))         # False (is_end가 False!)\nprint(trie.startsWith("app"))    # True\nprint(trie.startsWith("b"))      # False</code></pre>\
                </div>\
                <div class="code-block">\
                    <pre><code class="language-cpp">// C++ 트라이 구현\n#include &lt;bits/stdc++.h&gt;\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map&lt;char, TrieNode*&gt; children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(const string& prefix) {\n        TrieNode* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};</code></pre>\
                </div>\
                <div class="code-block">\
                    <pre><code class="language-java">// Java 트라이 구현\nimport java.util.*;\n\nclass TrieNode {\n    Map&lt;Character, TrieNode&gt; children = new HashMap&lt;&gt;();\n    boolean isEnd = false;\n}\n\nclass Trie {\n    TrieNode root = new TrieNode();\n\n    void insert(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new TrieNode());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n\n    boolean search(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return node.isEnd;\n    }\n\n    boolean startsWith(String prefix) {\n        TrieNode node = root;\n        for (char ch : prefix.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return true;\n    }\n}</code></pre>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">트라이에 "app"과 "apple"을 넣은 뒤, search("app")과 startsWith("app")의 결과 차이는?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        둘 다 <strong>True</strong>입니다! "app"을 넣었기 때문에 \'p\' 노드에 <code>is_end = True</code>가 표시됩니다.\
                        만약 "app"을 넣지 않고 "apple"만 넣었다면, <code>search("app")</code>은 <strong>False</strong>이고\
                        <code>startsWith("app")</code>은 <strong>True</strong>입니다. search는 is_end를 확인하고, startsWith는 경로만 확인하기 때문입니다!\
                    </div>\
                </div>\
            </div>\
\
            <!-- 섹션 3: 트라이 활용 -->\
            <div class="concept-section">\
                <div class="concept-section-title">\
                    <span class="section-num">3</span> 트라이 활용\
                </div>\
                <div class="analogy-box">\
                    <strong>비유로 이해하기:</strong> 여러분이 스마트폰에서 글자를 입력할 때\
                    <em>"자동완성 추천"</em>이 뜨는 것을 본 적이 있을 것입니다!\
                    "app"을 입력하면 "apple", "application", "appetite" 등을 추천해 줍니다.\
                    이런 자동완성 기능이 바로 트라이를 활용한 대표적인 예입니다!\
                </div>\
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🔍</text></svg>\
                        </div>\
                        <h3>자동완성</h3>\
                        <p>입력한 접두사로 시작하는 단어를 빠르게 찾아 추천합니다. 검색 엔진, 입력기에서 널리 사용됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--green)">📖</text></svg>\
                        </div>\
                        <h3>사전 검색</h3>\
                        <p>대량의 단어를 저장하고 빠르게 존재 여부를 확인합니다. 맞춤법 검사기에서도 활용됩니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--yellow)">📞</text></svg>\
                        </div>\
                        <h3>접두사 매칭</h3>\
                        <p>전화번호 목록에서 어떤 번호가 다른 번호의 접두사인지 빠르게 확인할 수 있습니다.</p>\
                    </div>\
                    <div class="concept-card">\
                        <div class="card-icon">\
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🗂️</text></svg>\
                        </div>\
                        <h3>문자열 집합 관리</h3>\
                        <p>많은 문자열의 삽입/삭제/검색을 효율적으로 처리합니다. IP 라우팅 테이블에서도 사용됩니다.</p>\
                    </div>\
                </div>\
                <div class="code-block">\
                    <pre><code class="language-python"># 트라이 활용 예: 자동완성 구현\nclass AutocompleteTrie(Trie):\n    def _collect(self, node, prefix, results):\n        """현재 노드부터 모든 단어를 수집합니다."""\n        if node.is_end:\n            results.append(prefix)\n        for ch, child in sorted(node.children.items()):\n            self._collect(child, prefix + ch, results)\n\n    def autocomplete(self, prefix):\n        """접두사로 시작하는 모든 단어를 반환합니다."""\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return []  # 접두사 자체가 없으면 빈 리스트\n            node = node.children[ch]\n        results = []\n        self._collect(node, prefix, results)\n        return results\n\n# 사용 예시\ntrie = AutocompleteTrie()\nfor word in ["apple", "app", "application", "apt", "bat"]:\n    trie.insert(word)\n\nprint(trie.autocomplete("app"))\n# [\'app\', \'apple\', \'application\']\nprint(trie.autocomplete("b"))\n# [\'bat\']</code></pre>\
                </div>\
                <div class="think-box">\
                    <div class="think-box-question">\
                        <span class="think-box-question-icon">Q</span>\
                        <span class="think-box-question-text">전화번호 목록 ["119", "1195", "112"]가 있을 때, "119"는 "1195"의 접두사입니다. 이를 트라이로 어떻게 판별할까요?</span>\
                    </div>\
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>\
                    <div class="think-box-answer">\
                        모든 번호를 트라이에 넣으면서, 삽입 도중 이미 <code>is_end = True</code>인 노드를 지나가면\
                        <strong>기존 번호가 현재 번호의 접두사</strong>라는 뜻입니다!\
                        반대로, 삽입이 끝난 노드에 이미 자식이 있으면 <strong>현재 번호가 다른 번호의 접두사</strong>입니다.\
                        이 방법으로 BOJ 5052 전화번호 목록 문제를 풀 수 있습니다.\
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
                btn.textContent = ans.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
            });
        });
        container.querySelectorAll('pre code').forEach(function(el) { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepControls: function(suffix) {
        return '<div class="viz-step-controls">' +
            '<button class="btn" id="str-prev-' + suffix + '" disabled>◀ 이전</button>' +
            '<span id="str-indicator-' + suffix + '">시작 전</span>' +
            '<button class="btn btn-primary" id="str-next-' + suffix + '">다음 ▶</button>' +
            '</div><div id="str-desc-' + suffix + '" class="viz-step-desc" style="text-align:center;margin-top:8px;color:var(--text2);font-size:0.9rem;">▶ 다음 버튼을 눌러 시작하세요</div>';
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
            else { indicator.textContent = (idx + 1) + ' / ' + total; desc.textContent = state.steps[idx].description; }
        }
        nextBtn.addEventListener('click', function() {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++; state.steps[state.currentStep].action(); updateUI();
        });
        prevBtn.addEventListener('click', function() {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo(); state.currentStep--; updateUI();
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

    // ===== 개념 시각화 탭 =====
    renderVisualize: function(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-trie';

        container.innerHTML =
            '<div class="hero" style="padding-bottom:12px;">' +
            '<h2>트라이 삽입 시각화</h2>' +
            '<p class="hero-sub">"cat", "car", "card"를 트라이에 하나씩 넣는 과정을 단계별로 봅시다.</p>' +
            '</div>' +
            '<div class="graph-svg-container" style="min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;position:relative;">' +
            '<div id="str-tree-' + suffix + '" style="display:flex;flex-direction:column;align-items:center;gap:0;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>' +
            '<div id="str-status-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">다음 버튼을 눌러 시작하세요</div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:700;margin-bottom:6px;color:var(--text2);">삽입된 단어</div>' +
            '<div id="str-words-' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">없음</div>' +
            '</div>' +
            '</div>' +
            self._createStepControls(suffix) +
            '<div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">' +
            '<span><span class="str-char-box" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">R</span> 기존 노드</span>' +
            '<span><span class="str-char-box comparing" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">A</span> 현재 방문 중</span>' +
            '<span><span class="str-char-box matched" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">N</span> 새로 생성</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);vertical-align:middle;"></span> 단어 끝 (is_end)</span>' +
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
                var endMarker = isEnd ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:4px;vertical-align:middle;" title="단어 끝"></span>' : '';

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
                : '없음';

            allSteps.push({
                description: '"' + wordCopy + '"를 삽입합니다.',
                treeHTML: beforeHTML,
                statusHTML: '<strong>"' + wordCopy + '"</strong> 삽입을 시작합니다.',
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
                    ? '"' + wordCopy + '": \'' + ch + '\' 노드를 새로 생성합니다. (경로: ' + lettersSoFar + ')'
                    : '"' + wordCopy + '": \'' + ch + '\' 노드가 이미 있습니다. 재사용합니다. (경로: ' + lettersSoFar + ')';
                var statHTML = isNew
                    ? '<span style="color:var(--green);">\'' + ch + '\' 노드 생성!</span> (' + lettersSoFar + ')'
                    : '<span style="color:var(--yellow);">\'' + ch + '\' 재사용</span> (' + lettersSoFar + ')';

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
                description: '"' + wordCopy + '" 삽입 완료! \'' + word[word.length - 1] + '\' 노드에 is_end 표시를 합니다.',
                treeHTML: doneHTML,
                statusHTML: '<strong style="color:var(--green);">"' + wordCopy + '" 삽입 완료!</strong>',
                wordsHTML: doneWordsHTML
            });
        });

        var finalHTML = renderTrie(rootBuild, {}, {}, {});
        var finalWordsHTML = doneWords.map(function(w) { return '<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">' + w + '</span>'; }).join(' ');
        allSteps.push({
            description: '모든 단어 삽입 완료! "cat", "car", "card"가 "ca" 접두사를 공유합니다.',
            treeHTML: finalHTML,
            statusHTML: '<strong style="color:var(--green);">완료!</strong> "cat", "car", "card" 모두 "ca" 경로를 공유합니다.',
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
    // 시뮬레이션 1: 트라이 구현 (lc-208)
    // ====================================================================
    _renderVizImplement: function(container) {
        var self = this;
        var suffix = '-impl';
        var words = ['apple', 'app'];
        var searches = [
            { word: 'apple', type: 'search', expected: true },
            { word: 'app', type: 'search', expected: true },
            { word: 'ap', type: 'search', expected: false },
            { word: 'app', type: 'startsWith', expected: true }
        ];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">트라이 구현 시뮬레이션</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">"apple", "app"을 삽입한 뒤 search/startsWith를 테스트합니다.</p>' +
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

        var root = makeNode('');
        var steps = [];
        var builtHTML = renderTrie(root, {}, {});
        treeEl.innerHTML = builtHTML;
        infoEl.innerHTML = '<span style="color:var(--text2);">단어를 삽입하고 검색합니다.</span>';

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
                    description: 'insert("' + word + '") — 트라이에 삽입합니다.',
                    action: function() { treeEl.innerHTML = afterHTML; infoEl.innerHTML = '<strong style="color:var(--green);">"' + word + '" 삽입 완료!</strong>'; },
                    undo: function() { treeEl.innerHTML = prevHTML; infoEl.innerHTML = '<span style="color:var(--text2);">단어를 삽입하고 검색합니다.</span>'; }
                });
            })(word, prevHTML, afterHTML);
        });

        // Search/startsWith steps
        var stableHTML = renderTrie(root, {}, {});
        searches.forEach(function(s) {
            var result = s.expected;
            var typeLabel = s.type === 'search' ? 'search' : 'startsWith';
            var resultStr = result ? '<span style="color:var(--green);font-weight:700;">True</span>' : '<span style="color:var(--red);font-weight:700;">False</span>';
            var reason = '';
            if (s.type === 'search' && !result) reason = ' (is_end가 False이므로)';
            else if (s.type === 'startsWith' && result) reason = ' (경로만 있으면 OK)';

            // Highlight path
            var hlIds = {};
            var node = root;
            var found = true;
            for (var i = 0; i < s.word.length; i++) {
                if (!(s.word[i] in node.children)) { found = false; break; }
                node = node.children[s.word[i]];
                hlIds[node.id] = true;
            }
            var hlHTML = renderTrie(root, hlIds, {});

            (function(typeLabel, word, resultStr, reason, hlHTML, stableHTML) {
                steps.push({
                    description: typeLabel + '("' + word + '") → ' + (result ? 'True' : 'False') + reason,
                    action: function() { treeEl.innerHTML = hlHTML; infoEl.innerHTML = '<code>' + typeLabel + '("' + word + '")</code> → ' + resultStr + reason; },
                    undo: function() { treeEl.innerHTML = stableHTML; infoEl.innerHTML = '<span style="color:var(--text2);">검색을 시작합니다.</span>'; }
                });
            })(typeLabel, s.word, resultStr, reason, hlHTML, stableHTML);
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 문자열 집합 (boj-14425)
    // ====================================================================
    _renderVizStringSet: function(container) {
        var self = this, suffix = '-strset';
        var setWords = ['baekjoon', 'codeplus', 'startlink'];
        var queries = ['baekjoon', 'codeminus', 'startlink', 'lucky'];
        var answers = [true, false, true, false];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">문자열 집합 시뮬레이션</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">집합 S에 단어 3개를 넣고, 4개의 문자열이 집합에 있는지 확인합니다.</p>' +
            '<div style="display:flex;gap:24px;margin-bottom:12px;flex-wrap:wrap;">' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">집합 S</div>' +
            '<div id="str-set' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '<div style="flex:1;min-width:180px;"><div style="font-weight:700;margin-bottom:6px;color:var(--text2);">검색 결과</div>' +
            '<div id="str-result' + suffix + '" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;font-weight:600;"></div></div>' +
            '</div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var setEl = container.querySelector('#str-set' + suffix);
        var resultEl = container.querySelector('#str-result' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        setEl.innerHTML = '비어있음';
        resultEl.innerHTML = '—';
        infoEl.innerHTML = '<span style="color:var(--text2);">트라이에 단어를 넣고 검색합니다.</span>';

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
                    description: '집합 S에 "' + w + '"를 삽입합니다.',
                    action: function() {
                        setEl.innerHTML = afterInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ');
                        infoEl.innerHTML = '<strong>"' + w + '"</strong> 삽입 완료. 집합 크기: ' + afterInserted.length;
                    },
                    undo: function() {
                        setEl.innerHTML = prevInserted.length > 0 ? prevInserted.map(function(x) { return '<span style="background:var(--accent)15;padding:2px 8px;border-radius:6px;color:var(--accent);">' + x + '</span>'; }).join(' ') : '비어있음';
                        infoEl.innerHTML = '<span style="color:var(--text2);">트라이에 단어를 넣고 검색합니다.</span>';
                    }
                });
            })(w, prevInserted, afterInserted);
        });

        // Search steps
        queries.forEach(function(q, idx) {
            var found = answers[idx];
            var prevResults = searchResults.slice();
            var prevCount = foundCount;
            searchResults.push({ word: q, found: found });
            if (found) foundCount++;
            var afterResults = searchResults.slice();
            var afterCount = foundCount;

            (function(q, found, prevResults, prevCount, afterResults, afterCount) {
                steps.push({
                    description: 'search("' + q + '") → ' + (found ? 'YES (집합에 있음)' : 'NO (집합에 없음)'),
                    action: function() {
                        resultEl.innerHTML = afterResults.map(function(r) {
                            var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                            return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                        }).join(' ');
                        infoEl.innerHTML = '"' + q + '" → ' + (found ? '<span style="color:var(--green);font-weight:700;">있음!</span>' : '<span style="color:var(--red);font-weight:700;">없음</span>') + ' (포함된 수: ' + afterCount + ')';
                    },
                    undo: function() {
                        resultEl.innerHTML = prevResults.length > 0 ? prevResults.map(function(r) {
                            var bg = r.found ? 'background:var(--green)20;color:var(--green);' : 'background:var(--red)15;color:var(--red);';
                            return '<span style="padding:2px 8px;border-radius:6px;' + bg + '">' + r.word + (r.found ? ' ✓' : ' ✗') + '</span>';
                        }).join(' ') : '—';
                        infoEl.innerHTML = '검색 중...';
                    }
                });
            })(q, found, prevResults, prevCount, afterResults, afterCount);
        });

        // Final step
        var totalFound = foundCount;
        steps.push({
            description: '완료! 집합 S에 포함된 문자열: ' + totalFound + '개',
            action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ 정답: ' + totalFound + '개</strong>'; },
            undo: function() { infoEl.innerHTML = '검색 중...'; }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 전화번호 목록 (boj-5052)
    // ====================================================================
    _renderVizPhoneBook: function(container) {
        var self = this, suffix = '-phone';
        var numbers = ['911', '97625999', '91125426'];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">전화번호 목록 — 접두사 판별</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">전화번호 [911, 97625999, 91125426]을 트라이에 넣으며 접두사 관계를 확인합니다.</p>' +
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

        var root = makeNode('');
        var steps = [];
        var consistent = true;

        treeEl.innerHTML = renderTrie(root, {}, {});
        infoEl.innerHTML = '<span style="color:var(--text2);">전화번호를 트라이에 넣으며 접두사 관계를 확인합니다.</span>';

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
                    description: '"' + num + '" 삽입 → ' + (isOk ? '접두사 문제 없음' : '접두사 관계 발견!'),
                    action: function() {
                        treeEl.innerHTML = afterHTML;
                        infoEl.innerHTML = '"' + num + '" 삽입 → ' + (isOk
                            ? '<span style="color:var(--green);">OK</span>'
                            : '<span style="color:var(--red);font-weight:700;">접두사 관계 발견!</span>');
                    },
                    undo: function() {
                        treeEl.innerHTML = prevHTML;
                        infoEl.innerHTML = '<span style="color:var(--text2);">전화번호를 트라이에 넣으며 접두사 관계를 확인합니다.</span>';
                    }
                });
            })(num, prevHTML, afterHTML, isOk);
        });

        var finalConsistent = consistent;
        steps.push({
            description: '완료! 일관성: ' + (finalConsistent ? 'YES' : 'NO'),
            action: function() {
                infoEl.innerHTML = '<strong style="font-size:1.1rem;color:' + (finalConsistent ? 'var(--green)' : 'var(--red)') + ';">✅ 결과: ' + (finalConsistent ? 'YES (일관성 있음)' : 'NO (일관성 없음)') + '</strong>';
            },
            undo: function() { infoEl.innerHTML = '확인 중...'; }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 최장 공통 접두사 (lc-14)
    // ====================================================================
    _renderVizLCP: function(container) {
        var self = this, suffix = '-lcp';
        var strs = ['flower', 'flow', 'flight'];

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">최장 공통 접두사 (LCP)</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">문자열 ["flower", "flow", "flight"]의 공통 접두사를 찾습니다.</p>' +
            '<div id="str-chars' + suffix + '" style="margin-bottom:12px;"></div>' +
            '<div id="str-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var charsEl = container.querySelector('#str-chars' + suffix);
        var infoEl = container.querySelector('#str-info' + suffix);

        function renderChars(colIdx, status) {
            // status: -1 = not started, 0 = checking, 1 = matched, 2 = mismatch
            var html = '';
            strs.forEach(function(s, si) {
                html += '<div style="display:flex;gap:3px;margin-bottom:6px;align-items:center;">' +
                    '<span style="width:60px;font-size:0.8rem;color:var(--text3);text-align:right;margin-right:6px;">' + s + ':</span>';
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
        infoEl.innerHTML = '<span style="color:var(--text2);">각 위치의 문자를 비교하여 공통 접두사를 찾습니다.</span>';

        var steps = [];
        var minLen = Math.min.apply(null, strs.map(function(s) { return s.length; }));
        var lcpLen = 0;

        for (var col = 0; col < minLen; col++) {
            var ch = strs[0][col];
            var allMatch = strs.every(function(s) { return s[col] === ch; });
            var capturedCol = col;
            var capturedCh = ch;

            if (allMatch) {
                lcpLen = col + 1;
                (function(capturedCol, capturedCh) {
                    steps.push({
                        description: '위치 ' + capturedCol + ': 모두 \'' + capturedCh + '\' → 일치!',
                        action: function() { renderChars(capturedCol, 1); infoEl.innerHTML = '위치 ' + capturedCol + ': 모두 <strong>\'' + capturedCh + '\'</strong> → <span style="color:var(--green);">일치!</span>'; },
                        undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">비교 중...</span>'; }
                    });
                })(capturedCol, capturedCh);
            } else {
                (function(capturedCol) {
                    steps.push({
                        description: '위치 ' + capturedCol + ': 불일치 발견! 여기서 멈춤.',
                        action: function() { renderChars(capturedCol, 2); infoEl.innerHTML = '위치 ' + capturedCol + ': <span style="color:var(--red);font-weight:700;">불일치!</span> 공통 접두사가 여기서 끝납니다.'; },
                        undo: function() { renderChars(capturedCol - 1, capturedCol > 0 ? 1 : -1); infoEl.innerHTML = '<span style="color:var(--text2);">비교 중...</span>'; }
                    });
                })(capturedCol);
                break;
            }
        }

        var result = strs[0].substring(0, lcpLen);
        steps.push({
            description: '완료! 최장 공통 접두사: "' + result + '" (길이 ' + lcpLen + ')',
            action: function() { infoEl.innerHTML = '<strong style="font-size:1.1rem;color:var(--green);">✅ LCP = "' + result + '" (길이 ' + lcpLen + ')</strong>'; },
            undo: function() { infoEl.innerHTML = '비교 중...'; }
        });

        self._initStepController(container, steps, suffix);
    },

    // ===== 빈 스텁 =====
    renderProblem: function(container) {},

    // ===== 문제 단계 =====
    stages: [
        { num: 1, title: '기본 트라이', desc: '트라이 구현과 문자열 집합 확인 (Medium~Silver)', problemIds: ['lc-208', 'boj-14425'] },
        { num: 2, title: '트라이 응용', desc: '접두사 관계와 공통 접두사 (Gold~Easy)', problemIds: ['boj-5052', 'lc-14'] }
    ],

    // ===== 문제 목록 =====
    problems: [
        // ===== 1단계: 기본 트라이 =====
        {
            id: 'lc-208',
            title: 'LeetCode 208 - Implement Trie',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
            simIntro: '트라이에 단어를 삽입하고 search/startsWith가 어떻게 동작하는지 확인하세요.',
            descriptionHTML: '<h3>문제</h3><p>트라이(Trie) 자료구조를 구현하세요. 다음 세 가지 메서드를 지원해야 합니다:</p><ul><li><code>insert(word)</code>: 단어를 트라이에 삽입합니다.</li><li><code>search(word)</code>: 단어가 트라이에 있으면 true, 없으면 false를 반환합니다.</li><li><code>startsWith(prefix)</code>: 접두사로 시작하는 단어가 있으면 true를 반환합니다.</li></ul><div class="problem-io"><div><h4>입력</h4><p>insert, search, startsWith 호출 목록</p></div><div><h4>출력</h4><p>각 search/startsWith 호출의 결과</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>insert("apple")\nsearch("apple")\nsearch("app")\nstartsWith("app")\ninsert("app")\nsearch("app")</pre></div><div><strong>출력</strong><pre>true\nfalse\ntrue\ntrue</pre></div></div></div>',
            hints: [
                { title: 'TrieNode는 무엇을 갖고 있어야 할까?', content: '각 노드는 <strong>children</strong>(자식 노드를 저장하는 딕셔너리/맵)과 <strong>is_end</strong>(이 노드에서 단어가 끝나는지 표시하는 불리언)를 가져야 합니다.' },
                { title: 'insert와 search의 핵심 차이', content: '<strong>insert</strong>: 글자를 따라가면서 없는 노드는 새로 만들고, 마지막에 is_end = True<br><strong>search</strong>: 글자를 따라가다 없는 노드가 나오면 False, 끝까지 가서 is_end 확인' },
                { title: 'startsWith는 search와 뭐가 다를까?', content: '<code>startsWith</code>는 <code>search</code>와 거의 같지만, 마지막에 <strong>is_end를 확인하지 않습니다!</strong><br>경로가 존재하기만 하면 True를 반환합니다.' }
            ],
            templates: {
                python: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n\n    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True',
                cpp: 'class Trie {\n    struct Node {\n        unordered_map<char, Node*> children;\n        bool is_end = false;\n    };\n    Node* root;\npublic:\n    Trie() { root = new Node(); }\n\n    void insert(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new Node();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(string word) {\n        Node* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char ch : prefix) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return true;\n    }\n};',
                java: 'class Trie {\n    private class Node {\n        Map<Character, Node> children = new HashMap<>();\n        boolean isEnd = false;\n    }\n    private Node root;\n\n    public Trie() { root = new Node(); }\n\n    public void insert(String word) {\n        Node node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new Node());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        Node node = root;\n        for (char ch : word.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return node.isEnd;\n    }\n\n    public boolean startsWith(String prefix) {\n        Node node = root;\n        for (char ch : prefix.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return true;\n    }\n}'
            },
            solutions: [{
                approach: '트라이 직접 구현',
                description: 'TrieNode에 children 맵과 is_end 플래그를 두고 insert/search/startsWith를 구현합니다.',
                timeComplexity: 'O(L) per operation',
                spaceComplexity: 'O(총 문자 수)',
                codeSteps: {
                    python: [
                        { title: 'TrieNode 정의', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False' },
                        { title: 'Trie 초기화', code: 'class Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'insert 구현', code: '    def insert(self, word: str) -> None:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True' },
                        { title: 'search / startsWith', code: '    def search(self, word: str) -> bool:\n        node = self.root\n        for ch in word:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return node.is_end\n\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for ch in prefix:\n            if ch not in node.children:\n                return False\n            node = node.children[ch]\n        return True' }
                    ]
                },
                get templates() { return trieTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-14425',
            title: 'BOJ 14425 - 문자열 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14425',
            simIntro: '트라이에 문자열을 넣고 검색하여 집합 포함 여부를 확인하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 문자열로 이루어진 집합 S가 주어집니다. M개의 문자열이 입력으로 주어졌을 때, 이 중에서 <strong>집합 S에 포함된 문자열의 개수</strong>를 구하세요.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: N M (1 &le; N, M &le; 10,000)<br>다음 N줄: 집합 S의 문자열<br>다음 M줄: 검사할 문자열</p></div><div><h4>출력</h4><p>집합 S에 포함된 문자열의 개수</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>5 11\nbaekjoononlinejudge\nstartlink\ncodeplus\nsundaycoding\ncodingsh\nbaekjoononlinejudge\ncodeplus\ncodeminus\nstartlink\nstarlink\nsundaycoding\ncodingsh\ncodingho\nlucky\njudge</pre></div><div><strong>출력</strong><pre>4</pre></div></div></div>',
            hints: [
                { title: '어떤 자료구조를 쓸까?', content: '가장 간단한 방법은 <strong>set(집합)</strong>을 사용하는 것입니다. 하지만 트라이로도 풀 수 있습니다! N개의 문자열을 트라이에 넣고, M개를 search하면 됩니다.' },
                { title: '트라이로 풀기', content: '집합 S의 문자열을 모두 <strong>insert</strong>합니다. 그 다음 검사할 문자열마다 <strong>search</strong>하여 True인 것의 개수를 셉니다.' },
                { title: 'set으로 풀면 더 간단!', content: '<code>s = set()</code>에 N개 넣고, M개를 <code>if x in s</code>로 확인하면 됩니다.<br>트라이 연습이 목적이라면 직접 구현해 보세요!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\n# 방법 1: set 사용 (간단)\nN, M = map(int, input().split())\nS = set(input().strip() for _ in range(N))\ncount = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool is_end = false;\n};\n\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n\n    void insert(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch))\n                node->children[ch] = new TrieNode();\n            node = node->children[ch];\n        }\n        node->is_end = true;\n    }\n\n    bool search(const string& word) {\n        TrieNode* node = root;\n        for (char ch : word) {\n            if (!node->children.count(ch)) return false;\n            node = node->children[ch];\n        }\n        return node->is_end;\n    }\n};\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int N, M;\n    cin >> N >> M;\n\n    Trie trie;\n    string s;\n    for (int i = 0; i < N; i++) {\n        cin >> s;\n        trie.insert(s);\n    }\n\n    int count = 0;\n    for (int i = 0; i < M; i++) {\n        cin >> s;\n        if (trie.search(s)) count++;\n    }\n    cout << count << endl;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static class TrieNode {\n        Map<Character, TrieNode> children = new HashMap<>();\n        boolean isEnd = false;\n    }\n\n    static TrieNode root = new TrieNode();\n\n    static void insert(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            node.children.putIfAbsent(ch, new TrieNode());\n            node = node.children.get(ch);\n        }\n        node.isEnd = true;\n    }\n\n    static boolean search(String word) {\n        TrieNode node = root;\n        for (char ch : word.toCharArray()) {\n            if (!node.children.containsKey(ch)) return false;\n            node = node.children.get(ch);\n        }\n        return node.isEnd;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int N = Integer.parseInt(st.nextToken());\n        int M = Integer.parseInt(st.nextToken());\n\n        for (int i = 0; i < N; i++) insert(br.readLine().trim());\n\n        int count = 0;\n        for (int i = 0; i < M; i++) {\n            if (search(br.readLine().trim())) count++;\n        }\n        System.out.println(count);\n    }\n}'
            },
            solutions: [{
                approach: 'set 또는 트라이',
                description: 'set에 집합 S를 넣고 M개를 검사하거나, 트라이로 insert/search합니다.',
                timeComplexity: 'O((N+M) × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: '입력', code: 'import sys\ninput = sys.stdin.readline\n\nN, M = map(int, input().split())' },
                        { title: '집합 생성', code: 'S = set(input().strip() for _ in range(N))' },
                        { title: '검사 및 출력', code: 'count = sum(1 for _ in range(M) if input().strip() in S)\nprint(count)' }
                    ]
                },
                get templates() { return trieTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 트라이 응용 =====
        {
            id: 'boj-5052',
            title: 'BOJ 5052 - 전화번호 목록',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/5052',
            simIntro: '트라이에 전화번호를 넣으며 접두사 관계를 탐지하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>전화번호 목록이 주어집니다. 이 목록이 <strong>일관성</strong>이 있는지 없는지 판단하세요.</p><p>전화번호 목록이 일관성이 있으려면, 한 번호가 다른 번호의 <strong>접두사</strong>인 경우가 없어야 합니다.</p><p>예를 들어, "911"이 목록에 있고 "91125426"도 있으면, "911"이 "91125426"의 접두사이므로 일관성이 없습니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: 테스트 케이스 수 t<br>각 테스트 케이스: 첫째 줄에 n(전화번호 수), 다음 n줄에 전화번호</p></div><div><h4>출력</h4><p>일관성이 있으면 YES, 없으면 NO</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>2\n3\n911\n97625999\n91125426\n5\n113\n12340\n123440\n12345\n98346</pre></div><div><strong>출력</strong><pre>NO\nYES</pre></div></div></div>',
            hints: [
                { title: '접두사 관계를 어떻게 확인할까?', content: '모든 전화번호를 트라이에 넣습니다. 넣는 과정에서 경로 중간에 <strong>is_end = True</strong>인 노드를 지나가면, 이미 넣은 번호가 현재 번호의 접두사라는 뜻입니다!' },
                { title: '반대 경우도 체크해야 해요!', content: '현재 번호를 넣은 후, 끝 노드에 <strong>자식이 있다면</strong> 현재 번호가 다른 번호의 접두사입니다.<br>또는 정렬 후 삽입하면 한 방향만 체크해도 됩니다!' },
                { title: '정렬 활용 팁', content: '전화번호를 <strong>사전순 정렬</strong>하면, 접두사 관계에 있는 번호들이 인접하게 됩니다.<br>이렇게 하면 트라이 없이 인접한 쌍만 비교해도 풀 수 있습니다!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\nclass TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        """삽입하면서 접두사 관계 확인. 문제 있으면 False 반환"""\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found\n\nt = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TrieNode {\n    TrieNode* children[10] = {};\n    bool is_end = false;\n};\n\nbool insert(TrieNode* root, const string& s) {\n    TrieNode* node = root;\n    bool ok = true;\n    for (char ch : s) {\n        int idx = ch - \'0\';\n        if (node->is_end) ok = false;\n        if (!node->children[idx])\n            node->children[idx] = new TrieNode();\n        node = node->children[idx];\n    }\n    node->is_end = true;\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) ok = false;\n    return ok;\n}\n\nvoid deleteTrie(TrieNode* node) {\n    for (int i = 0; i < 10; i++)\n        if (node->children[i]) deleteTrie(node->children[i]);\n    delete node;\n}\n\nint main() {\n    int t;\n    scanf("%d", &t);\n    while (t--) {\n        int n;\n        scanf("%d", &n);\n        TrieNode* root = new TrieNode();\n        vector<string> nums(n);\n        bool ok = true;\n        for (int i = 0; i < n; i++) {\n            char buf[11];\n            scanf("%s", buf);\n            nums[i] = buf;\n        }\n        for (auto& s : nums) {\n            if (!insert(root, s)) ok = false;\n        }\n        puts(ok ? "YES" : "NO");\n        deleteTrie(root);\n    }\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[][] children;\n    static boolean[] isEnd;\n    static int cnt;\n\n    static void init() {\n        children = new int[100001 * 10][10];\n        isEnd = new boolean[100001 * 10];\n        cnt = 1;\n        for (int[] row : children) Arrays.fill(row, 0);\n        Arrays.fill(isEnd, false);\n    }\n\n    static boolean insert(String s) {\n        int node = 0;\n        boolean ok = true;\n        for (char ch : s.toCharArray()) {\n            int idx = ch - \'0\';\n            if (isEnd[node]) ok = false;\n            if (children[node][idx] == 0) {\n                children[node][idx] = cnt++;\n            }\n            node = children[node][idx];\n        }\n        isEnd[node] = true;\n        for (int i = 0; i < 10; i++)\n            if (children[node][i] != 0) ok = false;\n        return ok;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int t = Integer.parseInt(br.readLine().trim());\n        StringBuilder sb = new StringBuilder();\n        while (t-- > 0) {\n            int n = Integer.parseInt(br.readLine().trim());\n            init();\n            String[] nums = new String[n];\n            for (int i = 0; i < n; i++) nums[i] = br.readLine().trim();\n            boolean ok = true;\n            for (String s : nums) {\n                if (!insert(s)) ok = false;\n            }\n            sb.append(ok ? "YES" : "NO").append("\\n");\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '트라이 삽입 + 접두사 체크',
                description: '삽입 중 is_end 노드를 만나거나 삽입 후 자식이 있으면 접두사 관계입니다.',
                timeComplexity: 'O(N × L)',
                spaceComplexity: 'O(N × L)',
                codeSteps: {
                    python: [
                        { title: 'TrieNode + Trie 정의', code: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()' },
                        { title: 'insert + 접두사 판별', code: '    def insert(self, word):\n        node = self.root\n        prefix_found = False\n        for ch in word:\n            if node.is_end:\n                prefix_found = True\n            if ch not in node.children:\n                node.children[ch] = TrieNode()\n            node = node.children[ch]\n        node.is_end = True\n        if len(node.children) > 0:\n            prefix_found = True\n        return not prefix_found' },
                        { title: '테스트 케이스 처리', code: 't = int(input())\nfor _ in range(t):\n    n = int(input())\n    trie = Trie()\n    numbers = [input().strip() for _ in range(n)]\n    consistent = True\n    for num in numbers:\n        if not trie.insert(num):\n            consistent = False\n    print("YES" if consistent else "NO")' }
                    ]
                },
                get templates() { return trieTopic.problems[2].templates; }
            }]
        },
        {
            id: 'lc-14',
            title: 'LeetCode 14 - Longest Common Prefix',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/longest-common-prefix/',
            simIntro: '문자열을 세로로 비교하여 공통 접두사를 찾는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>문자열 배열이 주어집니다. 모든 문자열의 <strong>가장 긴 공통 접두사(Longest Common Prefix)</strong>를 찾아 반환하세요.</p><p>공통 접두사가 없으면 빈 문자열 <code>""</code>을 반환합니다.</p><div class="problem-io"><div><h4>입력</h4><p>문자열 배열 strs (1 &le; len &le; 200)</p></div><div><h4>출력</h4><p>가장 긴 공통 접두사 문자열</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>["flower","flow","flight"]</pre></div><div><strong>출력</strong><pre>"fl"</pre></div></div></div>',
            hints: [
                { title: '가장 간단한 방법은?', content: '첫 번째 문자열의 각 글자를 순서대로 확인합니다. 모든 문자열이 같은 위치에 같은 글자를 가지고 있으면 공통 접두사에 포함됩니다!' },
                { title: '트라이로 풀기', content: '모든 문자열을 트라이에 넣은 뒤, 루트에서 시작하여 <strong>자식이 정확히 1개이고 is_end가 아닌</strong> 노드를 따라 내려갑니다. 분기점(자식 2개 이상)에서 멈추면 그것이 공통 접두사입니다!' },
                { title: 'Python min/max 트릭', content: '<code>min(strs)</code>와 <code>max(strs)</code>는 사전순 최솟값과 최댓값입니다.<br>이 둘의 공통 접두사가 전체의 공통 접두사가 됩니다! (매우 간결한 풀이)' }
            ],
            templates: {
                python: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""\n        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]\n        return strs[0]',
                cpp: 'class Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";\n        string prefix = strs[0];\n        for (int i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.size() - 1);\n                if (prefix.empty()) return "";\n            }\n        }\n        return prefix;\n    }\n};',
                java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        if (strs == null || strs.length == 0) return "";\n        String prefix = strs[0];\n        for (int i = 1; i < strs.length; i++) {\n            while (strs[i].indexOf(prefix) != 0) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) return "";\n            }\n        }\n        return prefix;\n    }\n}'
            },
            solutions: [{
                approach: '세로 스캔',
                description: '첫 번째 문자열의 각 위치를 기준으로 모든 문자열과 비교합니다.',
                timeComplexity: 'O(S) (S = 전체 문자 수)',
                spaceComplexity: 'O(1)',
                codeSteps: {
                    python: [
                        { title: '예외 처리', code: 'class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        if not strs:\n            return ""' },
                        { title: '세로 스캔', code: '        for i in range(len(strs[0])):\n            ch = strs[0][i]\n            for s in strs[1:]:\n                if i >= len(s) or s[i] != ch:\n                    return strs[0][:i]' },
                        { title: '전체 일치 시', code: '        return strs[0]' }
                    ]
                },
                get templates() { return trieTopic.problems[3].templates; }
            }]
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.trie = trieTopic;
