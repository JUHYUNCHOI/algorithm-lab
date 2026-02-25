// =========================================================
// 트라이 (Trie) 토픽 모듈
// =========================================================
const trieTopic = {
    id: 'trie',
    title: '트라이',
    icon: '🔠',
    category: '심화 선택',
    order: 20,
    description: '문자열을 효율적으로 저장하고 검색하는 트리 자료구조',
    relatedNote: '트라이는 자동완성, 맞춤법 검사, IP 라우팅 등에 활용되며, 압축 트라이(Radix Tree)로 메모리를 절약할 수 있습니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔠 트라이 (Trie)</h2>
                <p class="hero-sub">문자열을 빠르게 저장하고 검색하는 특별한 트리를 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 트라이란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 트라이란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"전화번호부의 색인(인덱스)"</em>을 떠올려 보세요!<br><br>
                    전화번호부에서 "김"씨를 찾으려면 ㄱ → ㅣ → ㅁ 순서로 따라가면 됩니다.<br>
                    마찬가지로 트라이는 문자열을 <strong>한 글자씩 트리에 저장</strong>합니다.<br>
                    "cat"을 찾으려면 루트에서 c → a → t 순서로 내려가면 됩니다!<br><br>
                    같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다.
                    "cat"과 "car"는 "ca"까지 같은 길을 걷다가 갈라집니다.
                    덕분에 <strong>접두사 검색이 매우 빠릅니다!</strong>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="8" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="10" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><circle cx="28" cy="28" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="17" y1="12" x2="12" y2="24" stroke="var(--accent)" stroke-width="2"/><line x1="21" y1="12" x2="26" y2="24" stroke="var(--accent)" stroke-width="2"/></svg>
                        </div>
                        <h3>트리 구조</h3>
                        <p>트라이는 <strong>트리(Tree)</strong> 자료구조입니다. 루트에서 시작하여 한 글자씩 자식 노드로 내려갑니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">O(L)</text></svg>
                        </div>
                        <h3>O(L) 검색</h3>
                        <p>문자열 길이가 L이면 <strong>딱 L번</strong>만에 검색이 끝납니다! 해시 충돌 걱정 없이 정확합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="16" font-size="10" fill="var(--text2)">cat</text><text x="2" y="30" font-size="10" fill="var(--text2)">car</text><text x="22" y="23" font-size="12" fill="var(--yellow)">ca...</text></svg>
                        </div>
                        <h3>접두사 공유</h3>
                        <p>같은 접두사를 가진 단어들은 <strong>같은 경로를 공유</strong>합니다. 메모리를 절약할 수 있습니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="26" font-size="14" font-weight="bold" fill="var(--accent)">Pre*</text></svg>
                        </div>
                        <h3>접두사 검색 최적</h3>
                        <p>"app"으로 시작하는 단어 찾기! 트라이는 접두사(prefix) 검색에 <strong>최적의 자료구조</strong>입니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 트라이 vs 다른 방법 비교
# N개의 문자열, 평균 길이 L

# 1) 리스트에서 검색: O(N × L) — 하나씩 비교
# 2) 집합(set)에서 검색: O(L) 평균 — 해시 사용
# 3) 트라이에서 검색: O(L) 최악 — 항상 빠름!

# 트라이의 진짜 강점: 접두사 검색!
# "app"으로 시작하는 단어 모두 찾기
# → 리스트/집합: O(N × L) 전부 확인해야 함
# → 트라이: O(접두사 길이) + O(결과 수) 매우 빠름!</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">"apple", "app", "apt", "bat"을 트라이에 넣으면, 루트의 자식 노드는 몇 개일까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        정답은 <strong>2개</strong>입니다! 첫 글자가 'a'와 'b' 두 종류이므로,
                        루트에서 'a' 자식과 'b' 자식, 2개의 자식 노드가 생깁니다.
                        "apple", "app", "apt"는 모두 'a'로 시작하므로 같은 자식을 공유합니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 트라이 구현 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 트라이 구현
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 각 노드는 <em>"갈림길에 있는 이정표"</em>입니다!<br>
                    이정표에는 다음 글자로 갈 수 있는 화살표(children)가 있고,
                    "여기서 단어가 끝납니다"라는 깃발(is_end)이 있습니다.
                    "cat"을 넣으면 c → a → t 이정표를 만들고, t에 깃발을 꽂습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="19" r="12" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="19" y="23" text-anchor="middle" font-size="12" fill="var(--accent)">{ }</text></svg>
                        </div>
                        <h3>TrieNode</h3>
                        <p><code>children</code>: 자식 노드 딕셔너리<br><code>is_end</code>: 단어 끝 표시(깃발)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">insert</text></svg>
                        </div>
                        <h3>삽입 (insert)</h3>
                        <p>글자를 하나씩 따라가며, 없는 노드는 새로 만듭니다. 마지막에 <code>is_end = True</code>!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--yellow)">search</text></svg>
                        </div>
                        <h3>검색 (search)</h3>
                        <p>글자를 따라가다가 없는 글자가 나오면 False. 끝까지 가서 <code>is_end</code>가 True면 존재!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python">class TrieNode:
    def __init__(self):
        self.children = {}   # {'a': TrieNode, 'b': TrieNode, ...}
        self.is_end = False  # 이 노드에서 단어가 끝나는가?

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        """단어를 트라이에 삽입합니다."""
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()  # 없으면 새로 만들기
            node = node.children[ch]
        node.is_end = True  # 단어의 끝 표시!

    def search(self, word):
        """단어가 트라이에 존재하는지 확인합니다."""
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False  # 경로가 없으면 단어도 없다!
            node = node.children[ch]
        return node.is_end  # 끝 표시가 있어야 진짜 단어!

    def startsWith(self, prefix):
        """접두사로 시작하는 단어가 있는지 확인합니다."""
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True  # 경로만 있으면 OK! (is_end 불필요)

# 사용 예시
trie = Trie()
trie.insert("apple")
trie.insert("app")
print(trie.search("apple"))      # True
print(trie.search("app"))        # True
print(trie.search("ap"))         # False (is_end가 False!)
print(trie.startsWith("app"))    # True
print(trie.startsWith("b"))      # False</code></pre>
                </div>
                <div class="code-block">
                    <pre><code class="language-cpp">// C++ 트라이 구현
#include &lt;bits/stdc++.h&gt;
using namespace std;

struct TrieNode {
    unordered_map&lt;char, TrieNode*&gt; children;
    bool is_end = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch))
                node->children[ch] = new TrieNode();
            node = node->children[ch];
        }
        node->is_end = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->is_end;
    }

    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char ch : prefix) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return true;
    }
};</code></pre>
                </div>
                <div class="code-block">
                    <pre><code class="language-java">// Java 트라이 구현
import java.util.*;

class TrieNode {
    Map&lt;Character, TrieNode&gt; children = new HashMap&lt;&gt;();
    boolean isEnd = false;
}

class Trie {
    TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }

    boolean search(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) return false;
            node = node.children.get(ch);
        }
        return node.isEnd;
    }

    boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char ch : prefix.toCharArray()) {
            if (!node.children.containsKey(ch)) return false;
            node = node.children.get(ch);
        }
        return true;
    }
}</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">트라이에 "app"과 "apple"을 넣은 뒤, search("app")과 startsWith("app")의 결과 차이는?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        둘 다 <strong>True</strong>입니다! "app"을 넣었기 때문에 'p' 노드에 <code>is_end = True</code>가 표시됩니다.
                        만약 "app"을 넣지 않고 "apple"만 넣었다면, <code>search("app")</code>은 <strong>False</strong>이고
                        <code>startsWith("app")</code>은 <strong>True</strong>입니다. search는 is_end를 확인하고, startsWith는 경로만 확인하기 때문입니다!
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 트라이 활용 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 트라이 활용
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 여러분이 스마트폰에서 글자를 입력할 때
                    <em>"자동완성 추천"</em>이 뜨는 것을 본 적이 있을 것입니다!
                    "app"을 입력하면 "apple", "application", "appetite" 등을 추천해 줍니다.
                    이런 자동완성 기능이 바로 트라이를 활용한 대표적인 예입니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🔍</text></svg>
                        </div>
                        <h3>자동완성</h3>
                        <p>입력한 접두사로 시작하는 단어를 빠르게 찾아 추천합니다. 검색 엔진, 입력기에서 널리 사용됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--green)">📖</text></svg>
                        </div>
                        <h3>사전 검색</h3>
                        <p>대량의 단어를 저장하고 빠르게 존재 여부를 확인합니다. 맞춤법 검사기에서도 활용됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--yellow)">📞</text></svg>
                        </div>
                        <h3>접두사 매칭</h3>
                        <p>전화번호 목록에서 어떤 번호가 다른 번호의 접두사인지 빠르게 확인할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="24" font-size="18" fill="var(--accent)">🗂️</text></svg>
                        </div>
                        <h3>문자열 집합 관리</h3>
                        <p>많은 문자열의 삽입/삭제/검색을 효율적으로 처리합니다. IP 라우팅 테이블에서도 사용됩니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 트라이 활용 예: 자동완성 구현
class AutocompleteTrie(Trie):
    def _collect(self, node, prefix, results):
        """현재 노드부터 모든 단어를 수집합니다."""
        if node.is_end:
            results.append(prefix)
        for ch, child in sorted(node.children.items()):
            self._collect(child, prefix + ch, results)

    def autocomplete(self, prefix):
        """접두사로 시작하는 모든 단어를 반환합니다."""
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []  # 접두사 자체가 없으면 빈 리스트
            node = node.children[ch]
        results = []
        self._collect(node, prefix, results)
        return results

# 사용 예시
trie = AutocompleteTrie()
for word in ["apple", "app", "application", "apt", "bat"]:
    trie.insert(word)

print(trie.autocomplete("app"))
# ['app', 'apple', 'application']
print(trie.autocomplete("b"))
# ['bat']</code></pre>
                </div>
                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">전화번호 목록 ["119", "1195", "112"]가 있을 때, "119"는 "1195"의 접두사입니다. 이를 트라이로 어떻게 판별할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        모든 번호를 트라이에 넣으면서, 삽입 도중 이미 <code>is_end = True</code>인 노드를 지나가면
                        <strong>기존 번호가 현재 번호의 접두사</strong>라는 뜻입니다!
                        반대로, 삽입이 끝난 노드에 이미 자식이 있으면 <strong>현재 번호가 다른 번호의 접두사</strong>입니다.
                        이 방법으로 BOJ 5052 전화번호 목록 문제를 풀 수 있습니다.
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
                box.classList.toggle('open');
                btn.style.display = 'none';
            });
        });
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        const self = this;
        self._clearVizState();

        container.innerHTML = `
            <div class="hero" style="padding-bottom:12px;">
                <h2>트라이 삽입 시각화</h2>
                <p class="hero-sub">"cat", "car", "card"를 트라이에 하나씩 넣는 과정을 단계별로 봅시다.</p>
            </div>

            <div class="graph-svg-container" style="min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;position:relative;">
                <div id="trie-tree" style="display:flex;flex-direction:column;align-items:center;gap:0;"></div>
            </div>

            <div style="display:flex;gap:24px;margin-bottom:16px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">현재 상태</div>
                    <div id="trie-status" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">다음 버튼을 눌러 시작하세요</div>
                </div>
                <div style="flex:1;min-width:200px;">
                    <div style="font-weight:700;margin-bottom:6px;color:var(--text2);">삽입된 단어</div>
                    <div id="trie-words" class="graph-queue-display" style="min-height:42px;display:flex;align-items:center;justify-content:center;font-weight:600;color:var(--text2);">없음</div>
                </div>
            </div>

            ${self._createStepControls()}

            <div style="display:flex;gap:16px;padding:10px 16px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-top:8px;flex-wrap:wrap;font-size:0.85rem;color:var(--text2);">
                <span><span class="str-char-box" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">R</span> 기존 노드</span>
                <span><span class="str-char-box comparing" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">A</span> 현재 방문 중</span>
                <span><span class="str-char-box matched" style="display:inline-flex;width:22px;height:22px;font-size:11px;vertical-align:middle;margin:0;padding:0;align-items:center;justify-content:center;border-radius:6px;">N</span> 새로 생성</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--green);vertical-align:middle;"></span> 단어 끝 (is_end)</span>
            </div>
        `;

        const treeEl = container.querySelector('#trie-tree');
        const statusEl = container.querySelector('#trie-status');
        const wordsEl = container.querySelector('#trie-words');

        // Internal trie state for step generation
        // We'll build a simple trie representation and render it as HTML
        // trie node: { ch, children: {}, is_end, id }
        let nodeIdCounter = 0;
        function makeNode(ch) {
            return { ch: ch, children: {}, is_end: false, id: 'tn-' + (nodeIdCounter++) };
        }

        // Render trie as nested HTML
        function renderTrie(root, highlightIds, newIds, endIds) {
            highlightIds = highlightIds || {};
            newIds = newIds || {};
            endIds = endIds || {};

            function renderNode(node, depth) {
                const childKeys = Object.keys(node.children).sort();
                const isHighlight = highlightIds[node.id];
                const isNew = newIds[node.id];
                const isEnd = node.is_end || endIds[node.id];

                let cls = 'str-char-box';
                if (isNew) cls += ' matched';
                else if (isHighlight) cls += ' comparing';

                const label = node.ch === '' ? 'root' : node.ch;
                const endMarker = isEnd ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--green);margin-left:4px;vertical-align:middle;" title="단어 끝"></span>' : '';

                let html = '<div style="display:flex;flex-direction:column;align-items:center;">';
                html += `<div class="${cls}" style="min-width:36px;min-height:36px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;position:relative;" data-node-id="${node.id}">${label}${endMarker}</div>`;

                if (childKeys.length > 0) {
                    // Draw connector lines
                    html += '<div style="width:2px;height:16px;background:var(--border);"></div>';
                    html += '<div style="display:flex;gap:12px;align-items:flex-start;">';
                    childKeys.forEach(k => {
                        html += renderNode(node.children[k], depth + 1);
                    });
                    html += '</div>';
                }

                html += '</div>';
                return html;
            }

            return renderNode(root, 0);
        }

        // Deep clone of trie for state saving
        function cloneTrie(node) {
            const copy = { ch: node.ch, children: {}, is_end: node.is_end, id: node.id };
            for (const k in node.children) {
                copy.children[k] = cloneTrie(node.children[k]);
            }
            return copy;
        }

        // Build all steps
        const words = ["cat", "car", "card"];
        const root = makeNode('');
        const insertedWords = [];
        const steps = [];

        words.forEach(word => {
            // Step: announce the word to insert
            const wordCopy = word;
            const trieSnapshotBefore = cloneTrie(root);
            const wordsBefore = [...insertedWords];

            steps.push({
                description: `"${wordCopy}"를 삽입합니다.`,
                _savedTree: null,
                _savedStatus: null,
                _savedWords: null,
                action() {
                    this._savedTree = treeEl.innerHTML;
                    this._savedStatus = statusEl.innerHTML;
                    this._savedWords = wordsEl.innerHTML;
                    treeEl.innerHTML = renderTrie(root, {}, {}, {});
                    statusEl.innerHTML = `<strong>"${wordCopy}"</strong> 삽입을 시작합니다.`;
                    wordsEl.innerHTML = insertedWords.length > 0 ? insertedWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ') : '없음';
                },
                undo() {
                    treeEl.innerHTML = this._savedTree;
                    statusEl.innerHTML = this._savedStatus;
                    wordsEl.innerHTML = this._savedWords;
                }
            });

            // Insert letter by letter
            let node = root;
            for (let i = 0; i < word.length; i++) {
                const ch = word[i];
                const isNewNode = !(ch in node.children);
                const lettersSoFar = word.substring(0, i + 1);

                if (isNewNode) {
                    node.children[ch] = makeNode(ch);
                }
                const currentNodeId = node.children[ch].id;
                const parentNodeId = node.id;

                // Capture highlight and new info
                const highlightMap = {};
                highlightMap[currentNodeId] = true;
                const newMap = {};
                if (isNewNode) newMap[currentNodeId] = true;

                const descText = isNewNode
                    ? `"${wordCopy}": '${ch}' 노드를 새로 생성합니다. (경로: ${lettersSoFar})`
                    : `"${wordCopy}": '${ch}' 노드가 이미 있습니다. 재사용합니다. (경로: ${lettersSoFar})`;

                const trieSnap = cloneTrie(root);
                const hlCopy = Object.assign({}, highlightMap);
                const newCopy = Object.assign({}, newMap);
                const wasNew = isNewNode;

                steps.push({
                    description: descText,
                    _savedTree: null,
                    _savedStatus: null,
                    _savedWords: null,
                    action() {
                        this._savedTree = treeEl.innerHTML;
                        this._savedStatus = statusEl.innerHTML;
                        this._savedWords = wordsEl.innerHTML;
                        treeEl.innerHTML = renderTrie(root, hlCopy, wasNew ? newCopy : {}, {});
                        statusEl.innerHTML = wasNew
                            ? `<span style="color:var(--green);">'${ch}' 노드 생성!</span> (${lettersSoFar})`
                            : `<span style="color:var(--yellow);">'${ch}' 재사용</span> (${lettersSoFar})`;
                    },
                    undo() {
                        treeEl.innerHTML = this._savedTree;
                        statusEl.innerHTML = this._savedStatus;
                        wordsEl.innerHTML = this._savedWords;
                    }
                });

                node = node.children[ch];
            }

            // Mark is_end
            node.is_end = true;
            insertedWords.push(wordCopy);

            const endNodeId = node.id;
            const finalInsertedWords = [...insertedWords];

            steps.push({
                description: `"${wordCopy}" 삽입 완료! '${word[word.length - 1]}' 노드에 is_end 표시를 합니다.`,
                _savedTree: null,
                _savedStatus: null,
                _savedWords: null,
                action() {
                    this._savedTree = treeEl.innerHTML;
                    this._savedStatus = statusEl.innerHTML;
                    this._savedWords = wordsEl.innerHTML;
                    treeEl.innerHTML = renderTrie(root, {}, {}, {});
                    statusEl.innerHTML = `<strong style="color:var(--green);">"${wordCopy}" 삽입 완료!</strong>`;
                    wordsEl.innerHTML = finalInsertedWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ');
                },
                undo() {
                    treeEl.innerHTML = this._savedTree;
                    statusEl.innerHTML = this._savedStatus;
                    wordsEl.innerHTML = this._savedWords;
                }
            });
        });

        // Final summary step
        steps.push({
            description: '모든 단어 삽입 완료! 트라이에서 "ca" 접두사를 공유하는 것을 확인하세요.',
            _savedTree: null,
            _savedStatus: null,
            _savedWords: null,
            action() {
                this._savedTree = treeEl.innerHTML;
                this._savedStatus = statusEl.innerHTML;
                this._savedWords = wordsEl.innerHTML;
                treeEl.innerHTML = renderTrie(root, {}, {}, {});
                statusEl.innerHTML = '<strong style="color:var(--green);">완료!</strong> "cat", "car", "card" 모두 "ca" 경로를 공유합니다.';
            },
            undo() {
                treeEl.innerHTML = this._savedTree;
                statusEl.innerHTML = this._savedStatus;
                wordsEl.innerHTML = this._savedWords;
            }
        });

        // Render initial empty trie
        const initialRoot = makeNode('');
        initialRoot.ch = '';
        treeEl.innerHTML = renderTrie(root, {}, {}, {});

        // We need to rebuild from scratch since root was mutated during step generation
        // Reset root and re-generate with lazy step execution
        // Actually the steps capture undo/redo via innerHTML snapshots, so we need to start clean
        nodeIdCounter = 0;
        const rootFresh = makeNode('');
        const stepsClean = [];
        const insertedWordsClean = [];

        // Regenerate steps cleanly
        words.forEach(word => {
            const wordCopy = word;

            stepsClean.push({
                description: `"${wordCopy}"를 삽입합니다.`,
                _savedTree: null,
                _savedStatus: null,
                _savedWords: null,
                action() {
                    this._savedTree = treeEl.innerHTML;
                    this._savedStatus = statusEl.innerHTML;
                    this._savedWords = wordsEl.innerHTML;
                    treeEl.innerHTML = renderTrie(rootFresh, {}, {}, {});
                    statusEl.innerHTML = `<strong>"${wordCopy}"</strong> 삽입을 시작합니다.`;
                    wordsEl.innerHTML = insertedWordsClean.length > 0 ? insertedWordsClean.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ') : '없음';
                },
                undo() {
                    treeEl.innerHTML = this._savedTree;
                    statusEl.innerHTML = this._savedStatus;
                    wordsEl.innerHTML = this._savedWords;
                }
            });

            let node = rootFresh;
            for (let i = 0; i < word.length; i++) {
                const ch = word[i];
                const isNewNode = !(ch in node.children);
                const lettersSoFar = word.substring(0, i + 1);

                if (isNewNode) {
                    node.children[ch] = makeNode(ch);
                }

                const currentNodeId = node.children[ch].id;
                const hlCopy = {};
                hlCopy[currentNodeId] = true;
                const newCopy = {};
                if (isNewNode) newCopy[currentNodeId] = true;
                const wasNew = isNewNode;
                const capturedCh = ch;
                const capturedLetters = lettersSoFar;

                const descText = isNewNode
                    ? `"${wordCopy}": '${ch}' 노드를 새로 생성합니다. (경로: ${lettersSoFar})`
                    : `"${wordCopy}": '${ch}' 노드가 이미 있습니다. 재사용합니다. (경로: ${lettersSoFar})`;

                stepsClean.push({
                    description: descText,
                    _savedTree: null,
                    _savedStatus: null,
                    _savedWords: null,
                    action() {
                        this._savedTree = treeEl.innerHTML;
                        this._savedStatus = statusEl.innerHTML;
                        this._savedWords = wordsEl.innerHTML;
                        treeEl.innerHTML = renderTrie(rootFresh, hlCopy, wasNew ? newCopy : {}, {});
                        statusEl.innerHTML = wasNew
                            ? `<span style="color:var(--green);">'${capturedCh}' 노드 생성!</span> (${capturedLetters})`
                            : `<span style="color:var(--yellow);">'${capturedCh}' 재사용</span> (${capturedLetters})`;
                    },
                    undo() {
                        treeEl.innerHTML = this._savedTree;
                        statusEl.innerHTML = this._savedStatus;
                        wordsEl.innerHTML = this._savedWords;
                    }
                });

                node = node.children[ch];
            }

            node.is_end = true;
            insertedWordsClean.push(wordCopy);
            const finalWords = [...insertedWordsClean];
            const lastCh = word[word.length - 1];

            stepsClean.push({
                description: `"${wordCopy}" 삽입 완료! '${lastCh}' 노드에 is_end 표시를 합니다.`,
                _savedTree: null,
                _savedStatus: null,
                _savedWords: null,
                action() {
                    this._savedTree = treeEl.innerHTML;
                    this._savedStatus = statusEl.innerHTML;
                    this._savedWords = wordsEl.innerHTML;
                    treeEl.innerHTML = renderTrie(rootFresh, {}, {}, {});
                    statusEl.innerHTML = `<strong style="color:var(--green);">"${wordCopy}" 삽입 완료!</strong>`;
                    wordsEl.innerHTML = finalWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ');
                },
                undo() {
                    treeEl.innerHTML = this._savedTree;
                    statusEl.innerHTML = this._savedStatus;
                    wordsEl.innerHTML = this._savedWords;
                }
            });
        });

        stepsClean.push({
            description: '모든 단어 삽입 완료! "cat", "car", "card"가 "ca" 접두사를 공유합니다.',
            _savedTree: null,
            _savedStatus: null,
            _savedWords: null,
            action() {
                this._savedTree = treeEl.innerHTML;
                this._savedStatus = statusEl.innerHTML;
                this._savedWords = wordsEl.innerHTML;
                treeEl.innerHTML = renderTrie(rootFresh, {}, {}, {});
                statusEl.innerHTML = '<strong style="color:var(--green);">완료!</strong> "cat", "car", "card" 모두 "ca" 경로를 공유합니다.';
            },
            undo() {
                treeEl.innerHTML = this._savedTree;
                statusEl.innerHTML = this._savedStatus;
                wordsEl.innerHTML = this._savedWords;
            }
        });

        // But the problem is that rootFresh is already fully built because the loop above mutated it.
        // We need a different approach: rebuild the trie from scratch for each step.
        // Let's use a cleaner approach: snapshot-based with full trie rebuild.

        // Reset and use a truly step-by-step approach
        nodeIdCounter = 0;

        // We'll track which insertions have happened and rebuild fresh each time
        // Actually, the approach above does work because:
        // 1. Steps build the trie progressively as they're defined
        // 2. action() renders the CURRENT state of rootFresh
        // 3. undo() restores the innerHTML snapshot
        // The issue is that when action() is called, rootFresh is already fully built.
        //
        // Solution: Use a different strategy. Pre-compute snapshots.

        // Let's rebuild with pre-computed HTML snapshots
        nodeIdCounter = 0;
        const rootBuild = makeNode('');
        const allSteps = [];
        const doneWords = [];

        // Initial state snapshot
        const initialHTML = renderTrie(rootBuild, {}, {}, {});

        words.forEach(word => {
            const wordCopy = word;
            const beforeHTML = renderTrie(rootBuild, {}, {}, {});
            const beforeWordsHTML = doneWords.length > 0
                ? doneWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ')
                : '없음';

            allSteps.push({
                description: `"${wordCopy}"를 삽입합니다.`,
                treeHTML: beforeHTML,
                statusHTML: `<strong>"${wordCopy}"</strong> 삽입을 시작합니다.`,
                wordsHTML: beforeWordsHTML
            });

            let node = rootBuild;
            for (let i = 0; i < word.length; i++) {
                const ch = word[i];
                const isNew = !(ch in node.children);
                const lettersSoFar = word.substring(0, i + 1);

                if (isNew) {
                    node.children[ch] = makeNode(ch);
                }

                const currentNodeId = node.children[ch].id;
                const hl = {};
                hl[currentNodeId] = true;
                const nw = {};
                if (isNew) nw[currentNodeId] = true;

                const snapHTML = renderTrie(rootBuild, hl, isNew ? nw : {}, {});
                const descText = isNew
                    ? `"${wordCopy}": '${ch}' 노드를 새로 생성합니다. (경로: ${lettersSoFar})`
                    : `"${wordCopy}": '${ch}' 노드가 이미 있습니다. 재사용합니다. (경로: ${lettersSoFar})`;
                const statHTML = isNew
                    ? `<span style="color:var(--green);">'${ch}' 노드 생성!</span> (${lettersSoFar})`
                    : `<span style="color:var(--yellow);">'${ch}' 재사용</span> (${lettersSoFar})`;

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

            const doneHTML = renderTrie(rootBuild, {}, {}, {});
            const doneWordsHTML = doneWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ');

            allSteps.push({
                description: `"${wordCopy}" 삽입 완료! '${word[word.length - 1]}' 노드에 is_end 표시를 합니다.`,
                treeHTML: doneHTML,
                statusHTML: `<strong style="color:var(--green);">"${wordCopy}" 삽입 완료!</strong>`,
                wordsHTML: doneWordsHTML
            });
        });

        const finalHTML = renderTrie(rootBuild, {}, {}, {});
        const finalWordsHTML = doneWords.map(w => `<span style="background:var(--bg);padding:2px 8px;border-radius:6px;margin:2px;">${w}</span>`).join(' ');
        allSteps.push({
            description: '모든 단어 삽입 완료! "cat", "car", "card"가 "ca" 접두사를 공유합니다.',
            treeHTML: finalHTML,
            statusHTML: '<strong style="color:var(--green);">완료!</strong> "cat", "car", "card" 모두 "ca" 경로를 공유합니다.',
            wordsHTML: finalWordsHTML
        });

        // Convert precomputed snapshots to action/undo steps
        const vizSteps = [];
        // Save initial state
        const initState = {
            tree: initialHTML,
            status: '다음 버튼을 눌러 시작하세요',
            words: '없음'
        };

        treeEl.innerHTML = initState.tree;

        allSteps.forEach((snap, idx) => {
            vizSteps.push({
                description: snap.description,
                _before: null,
                action() {
                    this._before = {
                        tree: treeEl.innerHTML,
                        status: statusEl.innerHTML,
                        words: wordsEl.innerHTML
                    };
                    treeEl.innerHTML = snap.treeHTML;
                    statusEl.innerHTML = snap.statusHTML;
                    wordsEl.innerHTML = snap.wordsHTML;
                },
                undo() {
                    treeEl.innerHTML = this._before.tree;
                    statusEl.innerHTML = this._before.status;
                    wordsEl.innerHTML = this._before.words;
                }
            });
        });

        self._initStepController(container, vizSteps);
    },

    // ===== 시각화 상태 관리 =====
    _vizState: {
        steps: [],
        currentStep: -1,
        keydownHandler: null
    },

    _clearVizState() {
        const s = this._vizState;
        if (s.keydownHandler) {
            document.removeEventListener('keydown', s.keydownHandler);
            s.keydownHandler = null;
        }
        s.steps = [];
        s.currentStep = -1;
    },

    _createStepControls() {
        return `
            <div class="viz-step-controls">
                <button class="btn viz-step-btn" id="viz-prev" disabled>&larr; 이전</button>
                <span id="viz-step-counter" class="viz-step-counter">시작 전</span>
                <button class="btn btn-primary viz-step-btn" id="viz-next">다음 &rarr;</button>
            </div>
            <div id="viz-step-desc" class="viz-step-desc">▶ 위의 버튼을 눌러 시작하세요</div>
        `;
    },

    _initStepController(el, steps) {
        const state = this._vizState;
        state.steps = steps;
        state.currentStep = -1;

        const prevBtn = el.querySelector('#viz-prev');
        const nextBtn = el.querySelector('#viz-next');
        const counter = el.querySelector('#viz-step-counter');
        const desc = el.querySelector('#viz-step-desc');

        const updateUI = () => {
            const idx = state.currentStep;
            const total = state.steps.length;
            prevBtn.disabled = (idx < 0);
            nextBtn.disabled = (idx >= total - 1);
            if (idx < 0) {
                counter.textContent = '시작 전';
                desc.textContent = '▶ 다음 버튼을 눌러 시작하세요';
            } else {
                counter.textContent = `Step ${idx + 1} / ${total}`;
                desc.textContent = state.steps[idx].description;
            }
        };

        nextBtn.addEventListener('click', () => {
            if (state.currentStep >= state.steps.length - 1) return;
            state.currentStep++;
            state.steps[state.currentStep].action();
            updateUI();
        });

        prevBtn.addEventListener('click', () => {
            if (state.currentStep < 0) return;
            state.steps[state.currentStep].undo();
            state.currentStep--;
            updateUI();
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

    // ===== 문제풀이 탭 =====
    stages: [
        {
            num: 1,
            title: '기본 트라이',
            desc: '트라이 구현과 문자열 집합 확인 (Medium~Silver)',
            problemIds: ['lc-208', 'boj-14425']
        },
        {
            num: 2,
            title: '트라이 응용',
            desc: '접두사 관계와 공통 접두사 (Gold~Easy)',
            problemIds: ['boj-5052', 'lc-14']
        }
    ],

    problems: [
        // ===== 1단계: 기본 트라이 =====
        {
            id: 'lc-208',
            title: 'LeetCode 208 - Implement Trie',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>트라이(Trie) 자료구조를 구현하세요. 다음 세 가지 메서드를 지원해야 합니다:</p>
                <ul>
                    <li><code>insert(word)</code>: 단어를 트라이에 삽입합니다.</li>
                    <li><code>search(word)</code>: 단어가 트라이에 있으면 true, 없으면 false를 반환합니다.</li>
                    <li><code>startsWith(prefix)</code>: 접두사로 시작하는 단어가 있으면 true를 반환합니다.</li>
                </ul>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>insert, search, startsWith 호출 목록</p></div>
                    <div><h4>출력</h4>
                    <p>각 search/startsWith 호출의 결과</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>insert("apple")
search("apple")
search("app")
startsWith("app")
insert("app")
search("app")</pre></div>
                    <div><strong>출력</strong><pre>true
false
true
true</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: 'TrieNode는 무엇을 갖고 있어야 할까?',
                    content: '각 노드는 <strong>children</strong>(자식 노드를 저장하는 딕셔너리/맵)과 <strong>is_end</strong>(이 노드에서 단어가 끝나는지 표시하는 불리언)를 가져야 합니다.'
                },
                {
                    title: 'insert와 search의 핵심 차이',
                    content: '<strong>insert</strong>: 글자를 따라가면서 없는 노드는 새로 만들고, 마지막에 is_end = True<br><strong>search</strong>: 글자를 따라가다 없는 노드가 나오면 False, 끝까지 가서 is_end 확인'
                },
                {
                    title: 'startsWith는 search와 뭐가 다를까?',
                    content: '<code>startsWith</code>는 <code>search</code>와 거의 같지만, 마지막에 <strong>is_end를 확인하지 않습니다!</strong><br>경로가 존재하기만 하면 True를 반환합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return 'true\nfalse\ntrue\ntrue'; },
            templates: {
                python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True`,
                cpp: `class Trie {
    struct Node {
        unordered_map<char, Node*> children;
        bool is_end = false;
    };
    Node* root;
public:
    Trie() { root = new Node(); }

    void insert(string word) {
        Node* node = root;
        for (char ch : word) {
            if (!node->children.count(ch))
                node->children[ch] = new Node();
            node = node->children[ch];
        }
        node->is_end = true;
    }

    bool search(string word) {
        Node* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->is_end;
    }

    bool startsWith(string prefix) {
        Node* node = root;
        for (char ch : prefix) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return true;
    }
};`,
                java: `class Trie {
    private class Node {
        Map<Character, Node> children = new HashMap<>();
        boolean isEnd = false;
    }
    private Node root;

    public Trie() { root = new Node(); }

    public void insert(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new Node());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        Node node = root;
        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) return false;
            node = node.children.get(ch);
        }
        return node.isEnd;
    }

    public boolean startsWith(String prefix) {
        Node node = root;
        for (char ch : prefix.toCharArray()) {
            if (!node.children.containsKey(ch)) return false;
            node = node.children.get(ch);
        }
        return true;
    }
}`
            }
        },
        {
            id: 'boj-14425',
            title: 'BOJ 14425 - 문자열 집합',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/14425',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 문자열로 이루어진 집합 S가 주어집니다.
                M개의 문자열이 입력으로 주어졌을 때, 이 중에서
                <strong>집합 S에 포함된 문자열의 개수</strong>를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N M (1 &le; N, M &le; 10,000)<br>
                    다음 N줄: 집합 S의 문자열<br>
                    다음 M줄: 검사할 문자열</p></div>
                    <div><h4>출력</h4>
                    <p>집합 S에 포함된 문자열의 개수</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>5 11
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
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 자료구조를 쓸까?',
                    content: '가장 간단한 방법은 <strong>set(집합)</strong>을 사용하는 것입니다. 하지만 트라이로도 풀 수 있습니다! N개의 문자열을 트라이에 넣고, M개를 search하면 됩니다.'
                },
                {
                    title: '트라이로 풀기',
                    content: '집합 S의 문자열을 모두 <strong>insert</strong>합니다. 그 다음 검사할 문자열마다 <strong>search</strong>하여 True인 것의 개수를 셉니다.'
                },
                {
                    title: 'set으로 풀면 더 간단!',
                    content: '<code>s = set()</code>에 N개 넣고, M개를 <code>if x in s</code>로 확인하면 됩니다.<br>트라이 연습이 목적이라면 직접 구현해 보세요!'
                }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

# 방법 1: set 사용 (간단)
N, M = map(int, input().split())
S = set(input().strip() for _ in range(N))
count = sum(1 for _ in range(M) if input().strip() in S)
print(count)

# 방법 2: 트라이 사용 (연습용)
"""
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

N, M = map(int, input().split())
trie = Trie()
for _ in range(N):
    trie.insert(input().strip())
count = sum(1 for _ in range(M) if trie.search(input().strip()))
print(count)
"""`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool is_end = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch))
                node->children[ch] = new TrieNode();
            node = node->children[ch];
        }
        node->is_end = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char ch : word) {
            if (!node->children.count(ch)) return false;
            node = node->children[ch];
        }
        return node->is_end;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;

    Trie trie;
    string s;
    for (int i = 0; i < N; i++) {
        cin >> s;
        trie.insert(s);
    }

    int count = 0;
    for (int i = 0; i < M; i++) {
        cin >> s;
        if (trie.search(s)) count++;
    }
    cout << count << endl;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }

    static TrieNode root = new TrieNode();

    static void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }

    static boolean search(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            if (!node.children.containsKey(ch)) return false;
            node = node.children.get(ch);
        }
        return node.isEnd;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(st.nextToken());

        for (int i = 0; i < N; i++) insert(br.readLine().trim());

        int count = 0;
        for (int i = 0; i < M; i++) {
            if (search(br.readLine().trim())) count++;
        }
        System.out.println(count);
    }
}`
            }
        },

        // ===== 2단계: 트라이 응용 =====
        {
            id: 'boj-5052',
            title: 'BOJ 5052 - 전화번호 목록',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/5052',
            descriptionHTML: `
                <h3>문제</h3>
                <p>전화번호 목록이 주어집니다.
                이 목록이 <strong>일관성</strong>이 있는지 없는지 판단하세요.</p>
                <p>전화번호 목록이 일관성이 있으려면, 한 번호가 다른 번호의 <strong>접두사</strong>인 경우가 없어야 합니다.</p>
                <p>예를 들어, "911"이 목록에 있고 "91125426"도 있으면, "911"이 "91125426"의 접두사이므로 일관성이 없습니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: 테스트 케이스 수 t<br>
                    각 테스트 케이스: 첫째 줄에 n(전화번호 수), 다음 n줄에 전화번호</p></div>
                    <div><h4>출력</h4>
                    <p>일관성이 있으면 YES, 없으면 NO</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2
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
                    <div><strong>출력</strong><pre>NO
YES</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '접두사 관계를 어떻게 확인할까?',
                    content: '모든 전화번호를 트라이에 넣습니다. 넣는 과정에서 경로 중간에 <strong>is_end = True</strong>인 노드를 지나가면, 이미 넣은 번호가 현재 번호의 접두사라는 뜻입니다!'
                },
                {
                    title: '반대 경우도 체크해야 해요!',
                    content: '현재 번호를 넣은 후, 끝 노드에 <strong>자식이 있다면</strong> 현재 번호가 다른 번호의 접두사입니다.<br>또는 정렬 후 삽입하면 한 방향만 체크해도 됩니다!'
                },
                {
                    title: '정렬 활용 팁',
                    content: '전화번호를 <strong>사전순 정렬</strong>하면, 접두사 관계에 있는 번호들이 인접하게 됩니다.<br>이렇게 하면 트라이 없이 인접한 쌍만 비교해도 풀 수 있습니다!'
                }
            ],
            inputDefault: 0,
            solve() { return 'NO\nYES'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        """삽입하면서 접두사 관계 확인. 문제 있으면 False 반환"""
        node = self.root
        # 기존 단어가 현재 단어의 접두사인지 확인
        prefix_found = False
        for ch in word:
            if node.is_end:
                prefix_found = True  # 경로 중간에 끝 표시!
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True
        # 현재 단어가 기존 단어의 접두사인지 확인
        if len(node.children) > 0:
            prefix_found = True
        return not prefix_found

t = int(input())
for _ in range(t):
    n = int(input())
    trie = Trie()
    numbers = [input().strip() for _ in range(n)]
    consistent = True
    for num in numbers:
        if not trie.insert(num):
            consistent = False
    print("YES" if consistent else "NO")`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

struct TrieNode {
    TrieNode* children[10] = {};
    bool is_end = false;
};

bool insert(TrieNode* root, const string& s) {
    TrieNode* node = root;
    bool ok = true;
    for (char ch : s) {
        int idx = ch - '0';
        if (node->is_end) ok = false;
        if (!node->children[idx])
            node->children[idx] = new TrieNode();
        node = node->children[idx];
    }
    node->is_end = true;
    for (int i = 0; i < 10; i++)
        if (node->children[i]) ok = false;
    return ok;
}

void deleteTrie(TrieNode* node) {
    for (int i = 0; i < 10; i++)
        if (node->children[i]) deleteTrie(node->children[i]);
    delete node;
}

int main() {
    int t;
    scanf("%d", &t);
    while (t--) {
        int n;
        scanf("%d", &n);
        TrieNode* root = new TrieNode();
        vector<string> nums(n);
        bool ok = true;
        for (int i = 0; i < n; i++) {
            char buf[11];
            scanf("%s", buf);
            nums[i] = buf;
        }
        for (auto& s : nums) {
            if (!insert(root, s)) ok = false;
        }
        puts(ok ? "YES" : "NO");
        deleteTrie(root);
    }
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[][] children;
    static boolean[] isEnd;
    static int cnt;

    static void init() {
        children = new int[100001 * 10][10];
        isEnd = new boolean[100001 * 10];
        cnt = 1;
        for (int[] row : children) Arrays.fill(row, 0);
        Arrays.fill(isEnd, false);
    }

    static boolean insert(String s) {
        int node = 0;
        boolean ok = true;
        for (char ch : s.toCharArray()) {
            int idx = ch - '0';
            if (isEnd[node]) ok = false;
            if (children[node][idx] == 0) {
                children[node][idx] = cnt++;
            }
            node = children[node][idx];
        }
        isEnd[node] = true;
        for (int i = 0; i < 10; i++)
            if (children[node][i] != 0) ok = false;
        return ok;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int t = Integer.parseInt(br.readLine().trim());
        StringBuilder sb = new StringBuilder();
        while (t-- > 0) {
            int n = Integer.parseInt(br.readLine().trim());
            init();
            String[] nums = new String[n];
            for (int i = 0; i < n; i++) nums[i] = br.readLine().trim();
            boolean ok = true;
            for (String s : nums) {
                if (!insert(s)) ok = false;
            }
            sb.append(ok ? "YES" : "NO").append("\\n");
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'lc-14',
            title: 'LeetCode 14 - Longest Common Prefix',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/longest-common-prefix/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>문자열 배열이 주어집니다.
                모든 문자열의 <strong>가장 긴 공통 접두사(Longest Common Prefix)</strong>를 찾아 반환하세요.</p>
                <p>공통 접두사가 없으면 빈 문자열 <code>""</code>을 반환합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>문자열 배열 strs (1 &le; len &le; 200)</p></div>
                    <div><h4>출력</h4>
                    <p>가장 긴 공통 접두사 문자열</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>["flower","flow","flight"]</pre></div>
                    <div><strong>출력</strong><pre>"fl"</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '가장 간단한 방법은?',
                    content: '첫 번째 문자열의 각 글자를 순서대로 확인합니다. 모든 문자열이 같은 위치에 같은 글자를 가지고 있으면 공통 접두사에 포함됩니다!'
                },
                {
                    title: '트라이로 풀기',
                    content: '모든 문자열을 트라이에 넣은 뒤, 루트에서 시작하여 <strong>자식이 정확히 1개이고 is_end가 아닌</strong> 노드를 따라 내려갑니다. 분기점(자식 2개 이상)에서 멈추면 그것이 공통 접두사입니다!'
                },
                {
                    title: 'Python min/max 트릭',
                    content: '<code>min(strs)</code>와 <code>max(strs)</code>는 사전순 최솟값과 최댓값입니다.<br>이 둘의 공통 접두사가 전체의 공통 접두사가 됩니다! (매우 간결한 풀이)'
                }
            ],
            inputDefault: 0,
            solve() { return '"fl"'; },
            templates: {
                python: `class Solution:
    def longestCommonPrefix(self, strs: list[str]) -> str:
        # 방법 1: 세로 스캔
        if not strs:
            return ""
        for i in range(len(strs[0])):
            ch = strs[0][i]
            for s in strs[1:]:
                if i >= len(s) or s[i] != ch:
                    return strs[0][:i]
        return strs[0]

    def longestCommonPrefix_minmax(self, strs: list[str]) -> str:
        # 방법 2: min/max 트릭
        if not strs:
            return ""
        s1, s2 = min(strs), max(strs)
        for i in range(len(s1)):
            if s1[i] != s2[i]:
                return s1[:i]
        return s1

    def longestCommonPrefix_trie(self, strs: list[str]) -> str:
        # 방법 3: 트라이 사용
        if not strs:
            return ""

        class TrieNode:
            def __init__(self):
                self.children = {}
                self.is_end = False

        root = TrieNode()
        for word in strs:
            node = root
            for ch in word:
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            node.is_end = True

        # 루트부터 분기점까지 따라가기
        prefix = []
        node = root
        while len(node.children) == 1 and not node.is_end:
            ch = list(node.children.keys())[0]
            prefix.append(ch)
            node = node.children[ch]
        return ''.join(prefix)`,
                cpp: `class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        string prefix = strs[0];
        for (int i = 1; i < strs.size(); i++) {
            while (strs[i].find(prefix) != 0) {
                prefix = prefix.substr(0, prefix.size() - 1);
                if (prefix.empty()) return "";
            }
        }
        return prefix;
    }
};`,
                java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (strs[i].indexOf(prefix) != 0) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }
}`
            }
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
                    <span class="stage-num">단계 ${stage.num}</span>
                    <h3>${stage.title}</h3>
                    <p>${stage.desc}</p>
                </div>
                <div class="stage-problems"></div>
            `;

            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const btn = document.createElement('button');
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `
                    <span class="problem-title">${prob.title}</span>
                    <span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>
                `;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });

            stageList.appendChild(stageCard);
        });

        container.appendChild(stageList);
    },

    // ===== 문제 상세 렌더링 =====
    _renderProblemDetail(container, problem) {
        container.innerHTML = '';

        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '\u2190 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLeetCode = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `
            <div class="problem-meta">
                <a href="${problem.link}" target="_blank" class="btn btn-primary">${isLeetCode ? 'LeetCode에서 풀기 \u2197' : 'BOJ에서 풀기 \u2197'}</a>
            </div>
            ${problem.descriptionHTML}
        `;
        container.appendChild(descDiv);

        // 힌트 섹션
        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';

        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `
                <div class="hint-step-header">
                    <span class="hint-step-num">${idx + 1}</span>
                    <span class="hint-step-title">${hint.title}</span>
                    <span class="hint-step-toggle">\u25B6</span>
                </div>
                <div class="hint-step-content">${hint.content}</div>
            `;

            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent =
                    step.classList.contains('open') ? '\u25BC' : '\u25B6';

                if (!openedState[idx]) {
                    openedState[idx] = true;
                    if (idx + 1 < problem.hints.length) {
                        const nextStep = hintsDiv.children[idx + 1];
                        if (nextStep) nextStep.classList.remove('locked');
                    }
                }
            });
            hintsDiv.appendChild(step);
        });

        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        // 코드 에디터
        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header">
                <h3>풀이 작성</h3>
                <select id="lang-select">
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions">
                <button id="run-btn" class="btn btn-primary">\u25B6 실행</button>
                <button id="check-btn" class="btn btn-success">\u2713 정답 확인</button>
            </div>
            <div id="output-area" class="output-area">
                <div class="output-label">실행 결과</div>
                <pre id="output-text"></pre>
            </div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => {
            if (window.hljs) hljs.highlightElement(codeEl);
        });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;

        langSelect.addEventListener('change', () => {
            editor.value = problem.templates[langSelect.value];
        });

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = editor.selectionStart;
                editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd);
                editor.selectionStart = editor.selectionEnd = s + 4;
            }
        });

        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });

        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            const site = isLeetCode ? 'LeetCode' : 'BOJ';
            this._showOutput(container, `예상 정답:\n${expected}\n\n코드를 ${site}에 제출하여 정답을 확인하세요!`);
        });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.trie = trieTopic;
