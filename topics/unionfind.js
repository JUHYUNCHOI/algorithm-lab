// =========================================================
// 유니온 파인드 (Union-Find) 토픽 모듈
// =========================================================
var unionFindTopic = {
    id: 'unionfind',
    title: '유니온 파인드',
    icon: '🤝',
    category: '심화 (Gold~Platinum)',
    order: 21,
    description: '서로소 집합을 효율적으로 관리하는 자료구조',
    relatedNote: '유니온 파인드는 크루스칼 MST, 네트워크 연결성, 동적 연결 쿼리 등에 핵심적으로 사용됩니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'boj-1717':  { type: '기본 구현',         color: 'var(--accent)', vizMethod: '_renderVizBasicUF' },
        'boj-1976':  { type: '연결 요소 판별',     color: 'var(--green)',  vizMethod: '_renderVizTravel' },
        'lc-200':    { type: '격자 연결 요소',     color: '#e17055',       vizMethod: '_renderVizIslands' },
        'boj-4195':  { type: '집합 크기 추적',     color: '#6c5ce7',       vizMethod: '_renderVizFriendNet' }
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
            sim:     { intro: prob.simIntro || '유니온 파인드가 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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
        if (tabId === 'sim') contentDiv.className = 'sim-tab-content';        container.appendChild(contentDiv);
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
        container.innerHTML = `
            <div class="hero">
                <h2>🤝 유니온 파인드 (Union-Find)</h2>
                <p class="hero-sub">누가 같은 그룹인지 빠르게 알아내는 자료구조를 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 유니온 파인드란? -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">1</span> 유니온 파인드란?
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> "동아리 합치기"를 생각해 보세요!<br><br>
                    학교에 여러 동아리가 있습니다. 각 동아리에는 <strong>대표(회장)</strong>가 있습니다.<br>
                    두 동아리를 합치면? 한쪽 대표가 다른 쪽 대표 밑으로 들어갑니다.<br>
                    "이 학생과 저 학생이 같은 동아리인가?" → 둘의 <strong>대표가 같은지</strong> 확인하면 됩니다!<br><br>
                    이처럼 <strong>서로소 집합(Disjoint Set)</strong>을 관리하는 자료구조가 <strong>유니온 파인드</strong>입니다.
                </div>
                <div style="margin:0.5rem 0 0.8rem;">
                    <a href="https://en.wikipedia.org/wiki/Disjoint-set_data_structure" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Wikipedia: Disjoint-set (Union-Find) ↗</a>
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="10" r="6" fill="none" stroke="var(--accent)" stroke-width="2"/><line x1="19" y1="16" x2="19" y2="22" stroke="var(--accent)" stroke-width="2"/><text x="19" y="14" text-anchor="middle" font-size="9" fill="var(--accent)">?</text><circle cx="10" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="1.5"/><circle cx="28" cy="30" r="5" fill="none" stroke="var(--border)" stroke-width="1.5"/><line x1="15" y1="25" x2="10" y2="26" stroke="var(--accent)" stroke-width="1.5"/><line x1="23" y1="25" x2="28" y2="26" stroke="var(--accent)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>find (대표자 찾기)</h3>
                        <p>어떤 원소가 속한 집합의 <strong>대표(루트)</strong>를 찾습니다. 부모를 타고 올라가서 루트에 도달합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="14" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="28" cy="14" r="5" fill="none" stroke="var(--green)" stroke-width="2"/><path d="M16,14 L22,14" stroke="var(--green)" stroke-width="2" stroke-dasharray="3,2"/><circle cx="19" cy="30" r="6" fill="none" stroke="var(--green)" stroke-width="2"/><line x1="13" y1="18" x2="17" y2="25" stroke="var(--green)" stroke-width="1.5"/><line x1="25" y1="18" x2="21" y2="25" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>union (합치기)</h3>
                        <p>두 집합을 <strong>하나로 합칩니다</strong>. 한쪽 대표를 다른 쪽 대표의 자식으로 만듭니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="19" r="8" fill="rgba(108,92,231,0.1)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="26" cy="19" r="8" fill="rgba(0,184,148,0.1)" stroke="var(--green)" stroke-width="1.5"/><text x="12" y="22" text-anchor="middle" font-size="9" fill="var(--accent)">A</text><text x="26" y="22" text-anchor="middle" font-size="9" fill="var(--green)">B</text></svg>
                        </div>
                        <h3>서로소 집합</h3>
                        <p>겹치는 원소가 없는 집합들입니다. 모든 원소는 <strong>정확히 하나의 집합</strong>에만 속합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="10" width="30" height="18" rx="3" fill="none" stroke="var(--yellow)" stroke-width="2"/><text x="8" y="22" font-size="9" fill="var(--yellow)">0 1 2 3 4</text><text x="19" y="34" text-anchor="middle" font-size="8" fill="var(--text2)">parent[]</text></svg>
                        </div>
                        <h3>parent 배열</h3>
                        <p><code>parent[i]</code>는 i의 부모입니다. 루트는 <code>parent[i] = i</code>입니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 유니온 파인드 기본 구현
parent = list(range(N + 1))  # 처음엔 자기 자신이 대표

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # 경로 압축!
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a != b:
        parent[b] = a  # b의 대표를 a로 변경</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;numeric&gt;
using namespace std;

// 유니온 파인드 기본 구현
vector&lt;int&gt; parent(N + 1);
iota(parent.begin(), parent.end(), 0);  // 처음엔 자기 자신이 대표

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // 경로 압축!
    return parent[x];
}

void union_(int a, int b) {
    a = find(a); b = find(b);
    if (a != b)
        parent[b] = a;  // b의 대표를 a로 변경
}</code></pre>
                </div></span>
                <div style="margin:0.8rem 0 0.5rem;">
                    <span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/algorithm/iota" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: iota (순차 값 채우기) ↗</a></span>
                    <span class="lang-cpp"><p style="font-size:0.85rem;color:var(--text2);margin-top:4px;"><code>std::iota()</code> &mdash; &lt;numeric&gt; 헤더에 있는 함수로, 배열을 0, 1, 2, ... 순차 값으로 채웁니다.</p></span>
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — parent 배열 변화 관찰</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">두 노드를 선택하고 union을 실행하면 parent 배열이 어떻게 바뀌는지 확인하세요!</p>
                    <div class="concept-demo-body">
                        <div id="uf-s1-parent" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <span style="font-size:0.85rem;">union(</span>
                            <select id="uf-s1-a" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>0</option><option selected>1</option><option>2</option><option>3</option><option>4</option></select>
                            <span>,</span>
                            <select id="uf-s1-b" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>0</option><option>1</option><option selected>2</option><option>3</option><option>4</option></select>
                            <span>)</span>
                            <button class="concept-demo-btn" id="uf-s1-go">실행</button>
                            <button class="concept-demo-btn green" id="uf-s1-reset">↺</button>
                        </div>
                        <div id="uf-s1-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-s1-msg">union(1, 2)를 실행하면 parent[2] = 1로 바뀝니다. 직접 확인해보세요!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">parent = [0, 1, 2, 3, 4]인 상태에서 union(1, 2)를 하면 parent 배열은 어떻게 변할까요?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        find(1)=1, find(2)=2이므로, parent[2]=1로 바뀝니다.<br>
                        결과: parent = [0, <strong>1</strong>, <strong>1</strong>, 3, 4]<br>
                        이제 1과 2는 같은 집합이고, 대표는 1입니다!
                    </div>
                </div>
            </div>

            <!-- 섹션 2: 최적화 기법 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">2</span> 최적화 기법
                </div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 아무 생각 없이 합치면 트리가 일자로 길어질 수 있습니다.<br>
                    마치 줄 서기에서 한 줄로 쭉 늘어서면, 맨 끝 사람이 대표를 찾으려면 한참 걸리는 것과 같습니다!<br><br>
                    두 가지 최적화로 이 문제를 해결합니다:<br>
                    ① <strong>경로 압축</strong>: 대표를 찾으면서 만나는 모든 노드를 직접 루트에 연결합니다.<br>
                    ② <strong>랭크 기반 합치기</strong>: 항상 작은 트리를 큰 트리에 붙입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="19" cy="6" r="4" fill="var(--accent)" opacity="0.3"/><circle cx="19" cy="18" r="4" fill="var(--accent)" opacity="0.5"/><circle cx="19" cy="30" r="4" fill="var(--accent)" opacity="0.8"/><line x1="19" y1="10" x2="19" y2="14" stroke="var(--accent)" stroke-width="1.5"/><line x1="19" y1="22" x2="19" y2="26" stroke="var(--accent)" stroke-width="1.5"/><path d="M24,30 C30,24 30,12 19,6" stroke="var(--green)" stroke-width="1.5" fill="none" stroke-dasharray="3,2" marker-end="url(#uf-arrow)"/><defs><marker id="uf-arrow" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--green)"/></marker></defs></svg>
                        </div>
                        <h3>경로 압축</h3>
                        <p>find 시 만나는 모든 노드를 <strong>루트에 직접 연결</strong>합니다. 다음 find가 O(1)에 가까워집니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="12" cy="10" r="4" fill="none" stroke="var(--green)" stroke-width="2"/><circle cx="8" cy="22" r="3" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="16" cy="22" r="3" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="10" r="4" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M26,10 L14,10" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#uf-arrow2)"/><defs><marker id="uf-arrow2" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--border)"/></marker></defs></svg>
                        </div>
                        <h3>랭크 기반 합치기</h3>
                        <p><strong>작은 트리를 큰 트리에</strong> 합칩니다. 트리 높이가 커지는 것을 방지합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><text x="19" y="15" text-anchor="middle" font-size="9" font-weight="bold" fill="var(--yellow)">O(α(n))</text><text x="19" y="28" text-anchor="middle" font-size="8" fill="var(--text2)">≈ O(1)</text><rect x="4" y="4" width="30" height="30" rx="6" fill="none" stroke="var(--yellow)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>거의 O(1)</h3>
                        <p>두 최적화를 함께 쓰면 <strong>O(α(n))</strong>. α는 역 아커만 함수로 사실상 상수입니다!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 경로 압축 + 랭크 기반 합치기
parent = list(range(N + 1))
rank = [0] * (N + 1)

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # 경로 압축
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a == b:
        return  # 이미 같은 집합
    # 랭크가 작은 쪽을 큰 쪽에 붙이기
    if rank[a] < rank[b]:
        a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]:
        rank[a] += 1</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">#include &lt;vector&gt;
#include &lt;numeric&gt;
using namespace std;

// 경로 압축 + 랭크 기반 합치기
vector&lt;int&gt; parent(N + 1), rnk(N + 1, 0);
iota(parent.begin(), parent.end(), 0);

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);  // 경로 압축
    return parent[x];
}

void union_(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;  // 이미 같은 집합
    // 랭크가 작은 쪽을 큰 쪽에 붙이기
    if (rnk[a] &lt; rnk[b]) swap(a, b);
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
}</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — 경로 압축 전 vs 후</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">체인을 만들고 find를 실행하면 경로 압축 전후의 parent 변화를 비교합니다!</p>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:6px;">경로 압축 없이</div>
                                <div id="uf-s2-before" style="font-family:monospace;font-size:0.85rem;color:var(--text2);min-height:3em;"></div>
                            </div>
                            <div style="flex:1;min-width:160px;">
                                <div style="font-weight:600;margin-bottom:6px;">경로 압축 후</div>
                                <div id="uf-s2-after" style="font-family:monospace;font-size:0.85rem;color:var(--text2);min-height:3em;"></div>
                            </div>
                        </div>
                        <div id="uf-s2-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div style="margin-top:8px;">
                        <button class="concept-demo-btn" id="uf-s2-run">find(5) 실행!</button>
                        <button class="concept-demo-btn green" id="uf-s2-reset">↺</button>
                    </div>
                    <div class="concept-demo-msg" id="uf-s2-msg">"find(5) 실행!"을 눌러 경로 압축의 효과를 확인하세요!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">경로 압축 없이 1→2→3→4→5 체인이 있을 때, find(5)는 몇 번 부모를 타고 올라가야 할까요? 경로 압축 후에는?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        경로 압축 없이: 5→4→3→2→1, <strong>4번</strong> 올라갑니다.<br>
                        경로 압축 후: 5의 부모가 직접 1로 바뀌므로, 다음번 find(5)는 <strong>1번</strong>이면 됩니다!<br>
                        경로 위의 3, 4도 모두 부모가 1로 바뀝니다.
                    </div>
                </div>
            </div>

            <!-- 섹션 3: 유니온 파인드 활용 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">3</span> 유니온 파인드 활용
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="12" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="22" cy="12" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><circle cx="16" cy="24" r="4" fill="rgba(108,92,231,0.2)" stroke="var(--accent)" stroke-width="1.5"/><line x1="13" y1="14" x2="15" y2="21" stroke="var(--accent)" stroke-width="1.5"/><line x1="20" y1="15" x2="17" y2="21" stroke="var(--accent)" stroke-width="1.5"/><circle cx="32" cy="20" r="4" fill="rgba(0,184,148,0.2)" stroke="var(--green)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>그래프 연결 요소</h3>
                        <p>간선으로 연결된 노드를 union하면, 연결 요소(컴포넌트)를 빠르게 파악할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><circle cx="28" cy="19" r="5" fill="none" stroke="var(--red, #e17055)" stroke-width="2"/><path d="M15,16 L23,22" stroke="var(--red, #e17055)" stroke-width="1.5"/><path d="M15,22 L23,16" stroke="var(--red, #e17055)" stroke-width="1.5"/><circle cx="19" cy="8" r="4" fill="none" stroke="var(--red, #e17055)" stroke-width="1.5"/><line x1="13" y1="15" x2="17" y2="11" stroke="var(--red, #e17055)" stroke-width="1.5"/><line x1="21" y1="11" x2="25" y2="15" stroke="var(--red, #e17055)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>사이클 탐지</h3>
                        <p>간선 (u, v)를 추가할 때, find(u)==find(v)이면 <strong>사이클이 존재</strong>합니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="8" cy="8" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="8" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="8" cy="30" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><circle cx="30" cy="30" r="4" fill="none" stroke="var(--green)" stroke-width="1.5"/><line x1="8" y1="12" x2="8" y2="26" stroke="var(--green)" stroke-width="2"/><line x1="12" y1="8" x2="26" y2="8" stroke="var(--green)" stroke-width="2"/><line x1="12" y1="30" x2="26" y2="30" stroke="var(--green)" stroke-width="2"/><text x="19" y="22" text-anchor="middle" font-size="7" fill="var(--green)">MST</text></svg>
                        </div>
                        <h3>크루스칼 MST</h3>
                        <p>간선을 가중치 순으로 정렬 후, 사이클을 만들지 않는 간선만 추가합니다. 유니온 파인드가 핵심입니다!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon">
                            <svg width="38" height="38" viewBox="0 0 38 38"><circle cx="10" cy="19" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><circle cx="28" cy="19" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><circle cx="19" cy="10" r="5" fill="none" stroke="var(--yellow)" stroke-width="2"/><line x1="14" y1="16" x2="16" y2="13" stroke="var(--yellow)" stroke-width="1.5"/><line x1="22" y1="13" x2="24" y2="16" stroke="var(--yellow)" stroke-width="1.5"/><line x1="15" y1="19" x2="23" y2="19" stroke="var(--yellow)" stroke-width="1.5"/></svg>
                        </div>
                        <h3>네트워크 연결 확인</h3>
                        <p>컴퓨터 네트워크, 도시 연결 등에서 "두 지점이 연결되어 있는가?"를 빠르게 확인합니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 크루스칼 MST에서 유니온 파인드 활용
edges.sort(key=lambda x: x[2])  # 가중치 기준 정렬
mst_cost = 0
mst_edges = 0

for u, v, w in edges:
    if find(u) != find(v):  # 사이클이 아니면
        union(u, v)
        mst_cost += w
        mst_edges += 1
        if mst_edges == N - 1:
            break  # MST 완성!

print(mst_cost)</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 크루스칼 MST에서 유니온 파인드 활용
// edges: vector&lt;tuple&lt;int,int,int&gt;&gt; (u, v, w)
sort(edges.begin(), edges.end(), [](auto&amp; a, auto&amp; b) {
    return get&lt;2&gt;(a) &lt; get&lt;2&gt;(b);  // 가중치 기준 정렬
});
int mst_cost = 0, mst_edges = 0;

for (auto&amp; [u, v, w] : edges) {
    if (find(u) != find(v)) {  // 사이클이 아니면
        union_(u, v);
        mst_cost += w;
        mst_edges++;
        if (mst_edges == N - 1)
            break;  // MST 완성!
    }
}

cout &lt;&lt; mst_cost &lt;&lt; endl;</code></pre>
                </div></span>
                <div class="concept-demo">
                    <div class="concept-demo-title">직접 해보기 — find로 같은 그룹인지 확인</div>
                    <p style="font-size:0.9rem;color:var(--text2);margin-bottom:10px;">union 후 두 노드가 같은 그룹인지 find로 확인해보세요!</p>
                    <div class="concept-demo-body">
                        <div id="uf-s3-parent" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
                            <button class="concept-demo-btn" id="uf-s3-u12">union(1,2)</button>
                            <button class="concept-demo-btn" id="uf-s3-u34">union(3,4)</button>
                            <button class="concept-demo-btn" id="uf-s3-u23">union(2,3)</button>
                        </div>
                        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
                            <span style="font-size:0.85rem;">find(</span>
                            <select id="uf-s3-q" style="padding:4px 8px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);"><option>1</option><option>2</option><option>3</option><option>4</option></select>
                            <span>)</span>
                            <button class="concept-demo-btn" id="uf-s3-find">찾기</button>
                            <button class="concept-demo-btn green" id="uf-s3-reset">↺</button>
                        </div>
                        <div id="uf-s3-log" style="margin-top:8px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-s3-msg">union 버튼으로 그룹을 합치고, find로 대표를 확인하세요!</div>
                </div>

                <div class="think-box">
                    <div class="think-box-question">
                        <span class="think-box-question-icon">Q</span>
                        <span class="think-box-question-text">4개 노드(1~4), 간선 (1-2, 가중치3), (2-3, 가중치1), (3-4, 가중치2), (1-4, 가중치5)로 크루스칼 MST를 만들면?</span>
                    </div>
                    <button class="think-box-trigger">🤔 생각해보고 클릭!</button>
                    <div class="think-box-answer">
                        가중치 순 정렬: (2-3,1), (3-4,2), (1-2,3), (1-4,5)<br>
                        ① (2-3,1): find(2)≠find(3) → union! MST에 추가. 비용=1<br>
                        ② (3-4,2): find(3)≠find(4) → union! MST에 추가. 비용=3<br>
                        ③ (1-2,3): find(1)≠find(2) → union! MST에 추가. 비용=<strong>6</strong><br>
                        ④ (1-4,5): find(1)==find(4) → 사이클! 건너뜀<br>
                        MST 비용 = <strong>6</strong>
                    </div>
                </div>
            </div>

            <!-- 섹션 4: 데모 — Union & Find 체험 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">4</span> 데모: Union & Find 체험
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 노드를 클릭해서 Union & Find</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <span style="font-size:0.85rem;color:var(--text2);">노드 2개 클릭 → Union | 노드 1개 클릭 → Find</span>
                        <button class="concept-demo-btn green" id="uf-demo-uf-reset">↺ 초기화</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="uf-demo-uf-nodes" style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-uf-parent" style="font-size:0.85rem;color:var(--text2);margin-bottom:8px;font-family:monospace;"></div>
                        <div id="uf-demo-uf-groups" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;"></div>
                        <div id="uf-demo-uf-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-uf-msg">👆 노드를 클릭해보세요! 2개를 클릭하면 Union(합치기), 1개만 더블클릭하면 Find(대표 찾기)를 수행합니다.</div>
                </div>
            </div>

            <!-- 섹션 5: 데모 — 경로 압축 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">5</span> 데모: 경로 압축 시각화
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 긴 체인이 압축되는 과정</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="uf-demo-pc-build">🔗 체인 만들기 (1→2→3→4→5)</button>
                        <button class="concept-demo-btn" id="uf-demo-pc-find" style="display:none;">🔍 find(5) 실행</button>
                        <button class="concept-demo-btn green" id="uf-demo-pc-reset" style="display:none;">↺ 다시</button>
                    </div>
                    <div class="concept-demo-body">
                        <div style="display:flex;gap:2rem;flex-wrap:wrap;">
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">트리 구조</div>
                                <div id="uf-demo-pc-tree" style="font-family:monospace;font-size:0.9rem;line-height:1.8;color:var(--text);"></div>
                            </div>
                            <div style="flex:1;min-width:180px;">
                                <div style="font-weight:600;margin-bottom:8px;color:var(--text);">parent 배열</div>
                                <div id="uf-demo-pc-arr" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
                            </div>
                        </div>
                        <div id="uf-demo-pc-log" style="margin-top:10px;font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-pc-msg">👆 "체인 만들기"를 눌러 긴 체인을 만든 뒤, "find(5)"를 눌러 경로 압축을 확인하세요!</div>
                </div>
            </div>

            <!-- 섹션 6: 데모 — 사이클 탐지 -->
            <div class="concept-section">
                <div class="concept-section-title">
                    <span class="section-num">6</span> 데모: 사이클 탐지
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 간선을 추가하며 사이클 감지</div>
                    <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px;">
                        <button class="concept-demo-btn" id="uf-demo-cycle-step">➕ 다음 간선 추가</button>
                        <button class="concept-demo-btn green" id="uf-demo-cycle-reset">↺ 초기화</button>
                    </div>
                    <div class="concept-demo-body">
                        <div id="uf-demo-cycle-edges" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-cycle-nodes" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;"></div>
                        <div id="uf-demo-cycle-log" style="font-size:0.85rem;padding:8px 12px;background:var(--warm-bg);border-left:3px solid var(--warm-accent);border-radius:0 8px 8px 0;min-height:1.5em;color:var(--text);"></div>
                    </div>
                    <div class="concept-demo-msg" id="uf-demo-cycle-msg">👆 "다음 간선 추가"를 눌러보세요! 사이클이 생기는 순간을 감지합니다.</div>
                </div>
            </div>
        `;

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

        // ====== 섹션 1 데모: parent 배열 변화 ======
        (function() {
            var parentEl = container.querySelector('#uf-s1-parent');
            var logEl = container.querySelector('#uf-s1-log');
            if (!parentEl) return;
            var p;
            function reset() { p = [0,1,2,3,4]; render(); logEl.textContent = '두 노드를 선택하고 "실행"을 눌러보세요!'; }
            function find(x) { while (p[x] !== x) x = p[x]; return x; }
            function render() {
                parentEl.innerHTML = p.map(function(v,i) {
                    var isRoot = p[i] === i;
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.7rem;color:var(--text2);">p[' + i + ']</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;font-weight:700;background:' + (isRoot?'var(--accent)':'var(--bg2)') + ';color:' + (isRoot?'#fff':'var(--text)') + ';">' + v + '</span></div>';
                }).join('');
            }
            reset();
            container.querySelector('#uf-s1-go').addEventListener('click', function() {
                var a = parseInt(container.querySelector('#uf-s1-a').value);
                var b = parseInt(container.querySelector('#uf-s1-b').value);
                var ra = find(a), rb = find(b);
                if (ra === rb) { logEl.textContent = 'find(' + a + ')=' + ra + ', find(' + b + ')=' + rb + ' → 이미 같은 그룹!'; return; }
                p[rb] = ra;
                render();
                logEl.innerHTML = 'union(' + a + ',' + b + '): find(' + a + ')=' + ra + ', find(' + b + ')=' + rb + ' → <strong>parent[' + rb + '] = ' + ra + '</strong>으로 변경!';
            });
            container.querySelector('#uf-s1-reset').addEventListener('click', reset);
        })();

        // ====== 섹션 2 데모: 경로 압축 전 vs 후 ======
        (function() {
            var beforeEl = container.querySelector('#uf-s2-before');
            var afterEl = container.querySelector('#uf-s2-after');
            var logEl = container.querySelector('#uf-s2-log');
            if (!beforeEl) return;
            function showChain() {
                beforeEl.innerHTML = 'parent: [_, 1, 1, 2, 3, 4]<br>체인: 5→4→3→2→1';
                afterEl.innerHTML = '<span style="color:var(--text2);">아직 실행 전</span>';
                logEl.textContent = '"find(5) 실행!"을 눌러보세요!';
            }
            showChain();
            container.querySelector('#uf-s2-run').addEventListener('click', function() {
                beforeEl.innerHTML = 'parent: [_, 1, 1, 2, 3, 4]<br>find(5): 5→4→3→2→1 (<strong>4번</strong> 이동)';
                afterEl.innerHTML = 'parent: [_, 1, 1, <span style="color:var(--green);font-weight:700;">1</span>, <span style="color:var(--green);font-weight:700;">1</span>, <span style="color:var(--green);font-weight:700;">1</span>]<br>다음 find(5): 5→1 (<strong style="color:var(--green);">1번</strong> 이동!)';
                logEl.innerHTML = '경로 압축으로 3, 4, 5 모두 <strong>직접 1을 가리키게</strong> 됩니다! 다음 find가 훨씬 빨라요.';
            });
            container.querySelector('#uf-s2-reset').addEventListener('click', showChain);
        })();

        // ====== 섹션 3 데모: find로 같은 그룹 확인 ======
        (function() {
            var parentEl = container.querySelector('#uf-s3-parent');
            var logEl = container.querySelector('#uf-s3-log');
            if (!parentEl) return;
            var p;
            function reset() { p = [0,1,2,3,4]; render(); logEl.textContent = 'union 버튼을 눌러 그룹을 합치세요!'; }
            function find(x) { if (p[x]!==x) p[x]=find(p[x]); return p[x]; }
            function union(a,b) { var ra=find(a),rb=find(b); if(ra!==rb) p[rb]=ra; }
            function render() {
                parentEl.innerHTML = p.map(function(v,i) {
                    if (i===0) return '';
                    var colors = ['','var(--accent)','var(--green)','var(--yellow)','var(--red)'];
                    var root = find(i);
                    return '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px;"><span style="font-size:0.7rem;color:var(--text2);">' + i + '</span><span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;font-weight:700;border:2px solid ' + colors[root] + ';color:var(--text);">p=' + v + '</span></div>';
                }).join('');
            }
            reset();
            container.querySelector('#uf-s3-u12').addEventListener('click', function() { union(1,2); render(); logEl.textContent = 'union(1,2) 완료! 노드 1과 2는 같은 그룹.'; });
            container.querySelector('#uf-s3-u34').addEventListener('click', function() { union(3,4); render(); logEl.textContent = 'union(3,4) 완료! 노드 3과 4는 같은 그룹.'; });
            container.querySelector('#uf-s3-u23').addEventListener('click', function() { union(2,3); render(); logEl.textContent = 'union(2,3) 완료! 이제 1,2,3,4 모두 같은 그룹!'; });
            container.querySelector('#uf-s3-find').addEventListener('click', function() {
                var q = parseInt(container.querySelector('#uf-s3-q').value);
                var r = find(q);
                logEl.innerHTML = 'find(' + q + ') = <strong>' + r + '</strong> — 노드 ' + q + '의 대표(루트)는 ' + r + '입니다!';
            });
            container.querySelector('#uf-s3-reset').addEventListener('click', reset);
        })();

        // ====== 데모 1: Union & Find 체험 ======
        (function() {
            var N = 6;
            var parent = [];
            var selected = [];
            var groupColors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#0984e3', '#d63031'];
            var nodesEl = container.querySelector('#uf-demo-uf-nodes');
            var parentEl = container.querySelector('#uf-demo-uf-parent');
            var groupsEl = container.querySelector('#uf-demo-uf-groups');
            var logEl = container.querySelector('#uf-demo-uf-log');
            var resetBtn = container.querySelector('#uf-demo-uf-reset');

            function init() {
                parent = [];
                selected = [];
                for (var i = 0; i < N; i++) parent.push(i);
                render();
                logEl.textContent = '노드를 클릭하세요!';
            }

            function find(x) {
                if (parent[x] !== x) parent[x] = find(parent[x]);
                return parent[x];
            }

            function union(a, b) {
                a = find(a); b = find(b);
                if (a !== b) { parent[b] = a; return true; }
                return false;
            }

            function render() {
                nodesEl.innerHTML = '';
                var groups = {};
                for (var i = 0; i < N; i++) {
                    var root = find(i);
                    if (!groups[root]) groups[root] = [];
                    groups[root].push(i);
                }

                for (var i = 0; i < N; i++) {
                    var root = find(i);
                    var colorIdx = Object.keys(groups).indexOf(String(root));
                    var color = groupColors[colorIdx % groupColors.length];
                    var node = document.createElement('div');
                    node.style.cssText = 'width:48px;height:48px;border-radius:50%;border:2.5px solid ' + color + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;cursor:pointer;transition:all 0.2s ease;color:' + color + ';background:var(--card);user-select:none;';
                    if (selected.indexOf(i) >= 0) {
                        node.style.boxShadow = '0 0 10px ' + color;
                        node.style.transform = 'scale(1.1)';
                    }
                    node.textContent = i;
                    node.dataset.idx = i;
                    node.addEventListener('click', function() {
                        var idx = parseInt(this.dataset.idx);
                        if (selected.indexOf(idx) >= 0) {
                            selected = selected.filter(function(s) { return s !== idx; });
                        } else {
                            selected.push(idx);
                        }
                        if (selected.length === 1) {
                            var root = find(selected[0]);
                            logEl.innerHTML = '<strong>find(' + selected[0] + ')</strong> = <strong style="color:var(--green);">' + root + '</strong> (대표자). 2번째 노드를 클릭하면 Union합니다.';
                            render();
                        } else if (selected.length >= 2) {
                            var a = selected[0], b = selected[1];
                            var merged = union(a, b);
                            if (merged) {
                                logEl.innerHTML = '<strong>union(' + a + ', ' + b + ')</strong> → <strong style="color:var(--green);">합침!</strong> ' + b + '의 대표가 ' + find(a) + '로 변경';
                            } else {
                                logEl.innerHTML = '<strong>union(' + a + ', ' + b + ')</strong> → 이미 같은 그룹! (대표: ' + find(a) + ')';
                            }
                            selected = [];
                            render();
                        } else {
                            render();
                        }
                    });
                    nodesEl.appendChild(node);
                }

                parentEl.textContent = 'parent = [' + parent.join(', ') + ']';

                groupsEl.innerHTML = '';
                var rootKeys = Object.keys(groups);
                rootKeys.forEach(function(root, idx) {
                    var badge = document.createElement('span');
                    badge.style.cssText = 'padding:4px 10px;border-radius:12px;font-size:0.8rem;font-weight:600;color:#fff;background:' + groupColors[idx % groupColors.length] + ';';
                    badge.textContent = '그룹 ' + root + ': {' + groups[root].join(', ') + '}';
                    groupsEl.appendChild(badge);
                });
            }

            init();
            resetBtn.addEventListener('click', init);
        })();

        // ====== 데모 2: 경로 압축 ======
        (function() {
            var parent = [0, 0, 1, 2, 3, 4];
            var treeEl = container.querySelector('#uf-demo-pc-tree');
            var arrEl = container.querySelector('#uf-demo-pc-arr');
            var logEl = container.querySelector('#uf-demo-pc-log');
            var buildBtn = container.querySelector('#uf-demo-pc-build');
            var findBtn = container.querySelector('#uf-demo-pc-find');
            var resetBtn = container.querySelector('#uf-demo-pc-reset');

            function renderTree(highlight) {
                treeEl.innerHTML = '';
                var lines = [];
                function buildLines(node, prefix, isLast) {
                    var children = [];
                    for (var i = 0; i < parent.length; i++) {
                        if (i !== node && parent[i] === node) children.push(i);
                    }
                    var nodeStr = '<span style="' + (highlight && highlight.indexOf(node) >= 0 ? 'color:var(--green);font-weight:700;' : 'color:var(--text);') + '">' + node + '</span>';
                    if (parent[node] === node) nodeStr += ' <span style="font-size:0.75rem;color:var(--accent);">(루트)</span>';
                    lines.push(prefix + nodeStr);
                    children.forEach(function(c, i) {
                        var last = i === children.length - 1;
                        var connector = last ? '└─ ' : '├─ ';
                        var nextPrefix = prefix + (last ? '&nbsp;&nbsp;&nbsp;' : '│&nbsp;&nbsp;');
                        buildLines(c, prefix + connector, last);
                    });
                }
                // find root
                var root = 0;
                for (var i = 0; i < parent.length; i++) {
                    if (parent[i] === i) { root = i; break; }
                }
                buildLines(root, '', true);
                treeEl.innerHTML = lines.map(function(l) { return '<div>' + l + '</div>'; }).join('');
            }

            function renderArr(highlight) {
                arrEl.innerHTML = '';
                for (var i = 0; i < parent.length; i++) {
                    var box = document.createElement('div');
                    box.className = 'str-char-box';
                    box.innerHTML = '<div class="str-char-idx" style="font-size:0.65rem;">' + i + '</div><div class="str-char-val">' + parent[i] + '</div>';
                    if (highlight && highlight.indexOf(i) >= 0) {
                        box.style.borderColor = 'var(--green)';
                        box.style.boxShadow = '0 0 6px var(--green)';
                    }
                    arrEl.appendChild(box);
                }
            }

            function resetState() {
                parent = [0, 0, 0, 0, 0, 0];
                buildBtn.style.display = '';
                findBtn.style.display = 'none';
                resetBtn.style.display = 'none';
                treeEl.innerHTML = '';
                arrEl.innerHTML = '';
                logEl.textContent = '"체인 만들기"를 눌러보세요!';
            }
            resetState();

            buildBtn.addEventListener('click', function() {
                parent = [0, 0, 1, 2, 3, 4];
                renderTree();
                renderArr();
                logEl.innerHTML = '체인 생성 완료: 5→4→3→2→1→<strong>0(루트)</strong>. find(5)를 하면 5번 타고 올라가야 합니다!';
                buildBtn.style.display = 'none';
                findBtn.style.display = '';
                resetBtn.style.display = '';
            });

            findBtn.addEventListener('click', function() {
                var path = [5, 4, 3, 2, 1, 0];
                var step = 0;
                function animate() {
                    if (step < path.length) {
                        renderTree(path.slice(0, step + 1));
                        renderArr(path.slice(0, step + 1));
                        logEl.innerHTML = 'find(5): ' + path.slice(0, step + 1).join(' → ') + (step < path.length - 1 ? ' → ...' : ' → <strong style="color:var(--green);">루트 발견!</strong>');
                        step++;
                        setTimeout(animate, 500);
                    } else {
                        setTimeout(function() {
                            parent = [0, 0, 0, 0, 0, 0];
                            for (var i = 1; i <= 5; i++) parent[i] = 0;
                            renderTree([1, 2, 3, 4, 5]);
                            renderArr([1, 2, 3, 4, 5]);
                            logEl.innerHTML = '<strong style="color:var(--green);">경로 압축 완료!</strong> 모든 노드가 루트(0)에 직접 연결됩니다. 다음 find는 <strong>1번</strong>이면 됩니다!';
                        }, 600);
                    }
                }
                findBtn.style.display = 'none';
                animate();
            });

            resetBtn.addEventListener('click', resetState);
        })();

        // ====== 데모 3: 사이클 탐지 ======
        (function() {
            var edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]];
            var parent = [0, 1, 2, 3, 4];
            var addedEdges = [];
            var stepIdx = 0;
            var cycleFound = false;
            var edgesEl = container.querySelector('#uf-demo-cycle-edges');
            var nodesEl = container.querySelector('#uf-demo-cycle-nodes');
            var logEl = container.querySelector('#uf-demo-cycle-log');
            var stepBtn = container.querySelector('#uf-demo-cycle-step');
            var resetBtn = container.querySelector('#uf-demo-cycle-reset');

            function find(x) {
                if (parent[x] !== x) parent[x] = find(parent[x]);
                return parent[x];
            }

            function render() {
                edgesEl.innerHTML = '';
                edges.forEach(function(e, i) {
                    var badge = document.createElement('span');
                    var added = i < addedEdges.length;
                    var isCycle = added && addedEdges[i] === 'cycle';
                    badge.style.cssText = 'padding:4px 10px;border-radius:12px;font-size:0.8rem;font-weight:600;transition:all 0.3s ease;';
                    if (isCycle) {
                        badge.style.background = 'rgba(225,112,85,0.2)';
                        badge.style.color = 'var(--red)';
                        badge.style.border = '1.5px solid var(--red)';
                        badge.textContent = e[0] + '-' + e[1] + ' (사이클!)';
                    } else if (added) {
                        badge.style.background = 'rgba(0,184,148,0.15)';
                        badge.style.color = 'var(--green)';
                        badge.style.border = '1.5px solid var(--green)';
                        badge.textContent = e[0] + '-' + e[1] + ' ✓';
                    } else {
                        badge.style.background = 'var(--bg)';
                        badge.style.color = 'var(--text3)';
                        badge.style.border = '1.5px solid var(--border)';
                        badge.textContent = e[0] + '-' + e[1];
                    }
                    edgesEl.appendChild(badge);
                });

                nodesEl.innerHTML = '';
                var groups = {};
                for (var i = 0; i < 5; i++) {
                    var root = find(i);
                    if (!groups[root]) groups[root] = [];
                    groups[root].push(i);
                }
                var gColors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e', '#0984e3'];
                for (var i = 0; i < 5; i++) {
                    var root = find(i);
                    var cidx = Object.keys(groups).indexOf(String(root));
                    var node = document.createElement('div');
                    node.style.cssText = 'width:40px;height:40px;border-radius:50%;border:2.5px solid ' + gColors[cidx % gColors.length] + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;color:' + gColors[cidx % gColors.length] + ';background:var(--card);';
                    node.textContent = i;
                    nodesEl.appendChild(node);
                }
            }

            function init() {
                parent = [0, 1, 2, 3, 4];
                addedEdges = [];
                stepIdx = 0;
                cycleFound = false;
                stepBtn.disabled = false;
                render();
                logEl.textContent = '"다음 간선 추가"를 눌러보세요!';
            }
            init();

            stepBtn.addEventListener('click', function() {
                if (stepIdx >= edges.length || cycleFound) return;
                var e = edges[stepIdx];
                var ra = find(e[0]), rb = find(e[1]);
                if (ra === rb) {
                    addedEdges.push('cycle');
                    cycleFound = true;
                    logEl.innerHTML = '<strong style="color:var(--red);">사이클 발견!</strong> 간선 (' + e[0] + '-' + e[1] + '): find(' + e[0] + ')=' + ra + ', find(' + e[1] + ')=' + rb + ' → 같은 그룹이므로 사이클!';
                    stepBtn.disabled = true;
                } else {
                    parent[rb] = ra;
                    addedEdges.push('ok');
                    logEl.innerHTML = '간선 (' + e[0] + '-' + e[1] + ') 추가: find(' + e[0] + ')=' + ra + ', find(' + e[1] + ')=' + rb + ' → <strong style="color:var(--green);">다른 그룹, 합침!</strong>';
                }
                stepIdx++;
                render();
            });

            resetBtn.addEventListener('click', init);
        })();
    },

    // ===== 시각화 상태 =====
    _vizState: { steps: [], currentStep: -1, keydownHandler: null },

    _clearVizState: function() {
        var s = this._vizState;
        if (s.keydownHandler) { document.removeEventListener('keydown', s.keydownHandler); s.keydownHandler = null; }
        s.steps = []; s.currentStep = -1;
    },

    _createStepDesc: function(suffix) {
        var s = suffix || '';
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">▶ 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls: function(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>◀ 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 ▶</button>' +
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
            if (idx < 0) { indicator.textContent = '시작 전'; desc.textContent = '▶ 다음 버튼을 눌러 시작하세요'; }
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

    // ===== 시각화 탭 (개념 시각화) =====
    renderVisualize: function(container) {
        var self = this;
        self._clearVizState();
        var suffix = 'concept-uf';

        container.innerHTML =
            '<div class="viz-card">' +
            '<h3>Union-Find 연산 시각화</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">6개 노드(1~6)에서 union/find 연산을 단계별로 확인합니다.</p>' +
            '<div style="margin-bottom:12px;">' +
            '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">parent 배열</div>' +
            '<div id="uf-parent-' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="margin-bottom:12px;">' +
            '<div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">트리 구조</div>' +
            '<div id="uf-tree-' + suffix + '" style="min-height:160px;background:var(--bg);border-radius:var(--radius);padding:12px;font-family:var(--font-mono, monospace);white-space:pre;line-height:1.6;font-size:0.92rem;"></div>' +
            '</div>' +
            '<div id="uf-info-' + suffix + '" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;"></div>' +
            self._createStepDesc(suffix) +
            self._createStepControls(suffix) +
            '</div>' +
            '<div class="graph-legend" style="margin-top:12px;">' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 개별 노드</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> 현재 처리 중</span>' +
            '<span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> 합쳐진 집합</span>' +
            '</div>';

        var parentDisplay = container.querySelector('#uf-parent-' + suffix);
        var treeDisplay = container.querySelector('#uf-tree-' + suffix);
        var infoEl = container.querySelector('#uf-info-' + suffix);

        function renderParent(par, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 1; i <= 6; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:48px;text-align:center;">' +
                    '<div style="font-size:0.75rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1.05rem;">' + par[i] + '</div>' +
                    '</div>';
            }
            parentDisplay.innerHTML = html;
        }

        function buildTreeText(par) {
            var children = {};
            var roots = [];
            for (var i = 1; i <= 6; i++) children[i] = [];
            for (var i = 1; i <= 6; i++) {
                if (par[i] === i) roots.push(i);
                else children[par[i]].push(i);
            }
            var text = '';
            for (var ri = 0; ri < roots.length; ri++) {
                if (ri > 0) text += '\n';
                text += renderNode(roots[ri], '', true);
            }
            return text;

            function renderNode(node, prefix, isLast) {
                var line = '';
                if (prefix === '') {
                    line = '[' + node + '] (루트)\n';
                } else {
                    line = prefix + (isLast ? '└── ' : '├── ') + '[' + node + ']\n';
                }
                var kids = children[node];
                for (var ci = 0; ci < kids.length; ci++) {
                    var childPrefix = prefix === '' ? '    ' : prefix + (isLast ? '    ' : '│   ');
                    line += renderNode(kids[ci], childPrefix, ci === kids.length - 1);
                }
                return line;
            }
        }

        function renderTree(par) {
            treeDisplay.textContent = buildTreeText(par);
        }

        // Initialize
        var initPar = [0, 1, 2, 3, 4, 5, 6];
        renderParent(initPar);
        renderTree(initPar);
        infoEl.innerHTML = '<span style="color:var(--text2)">6개 노드가 각각 독립된 집합입니다. parent[i] = i</span>';

        var steps = [];

        // Step 1: union(1, 2)
        steps.push({
            description: 'union(1, 2): 노드 1과 2를 합칩니다. parent[2]=1 — <strong>같은 집합임을 표시</strong>하기 위해 2의 부모를 1로 연결',
            action: function() {
                var par = [0, 1, 1, 3, 4, 5, 6];
                renderParent(par, {1: 'active', 2: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 2): 2의 부모를 1로 변경합니다. {1, 2}가 같은 집합이 됩니다.';
            },
            undo: function() {
                var par = [0, 1, 2, 3, 4, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = '<span style="color:var(--text2)">6개 노드가 각각 독립된 집합입니다.</span>';
            }
        });

        // Step 2: union(3, 4)
        steps.push({
            description: 'union(3, 4): 노드 3과 4를 합칩니다. parent[4]=3 — 두 노드를 하나의 집합으로 묶기 위해 부모를 연결',
            action: function() {
                var par = [0, 1, 1, 3, 3, 5, 6];
                renderParent(par, {3: 'active', 4: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(3, 4): 4의 부모를 3으로 변경합니다. {3, 4}가 같은 집합이 됩니다.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 4, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(1, 2): 2의 부모를 1로 변경합니다. {1, 2}가 같은 집합이 됩니다.';
            }
        });

        // Step 3: union(5, 6)
        steps.push({
            description: 'union(5, 6): 노드 5와 6을 합칩니다. parent[6]=5 — 두 노드를 하나의 집합으로 묶기 위해 부모를 연결',
            action: function() {
                var par = [0, 1, 1, 3, 3, 5, 5];
                renderParent(par, {5: 'active', 6: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(5, 6): 6의 부모를 5로 변경합니다. {5, 6}이 같은 집합이 됩니다.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 3, 5, 6];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(3, 4): 4의 부모를 3으로 변경합니다. {3, 4}가 같은 집합이 됩니다.';
            }
        });

        // Step 4: union(1, 3)
        steps.push({
            description: 'union(1, 3): {1,2}와 {3,4}를 합칩니다. parent[3]=1 — 각 집합의 <strong>루트끼리</strong> 연결하면 두 집합 전체가 합쳐짐',
            action: function() {
                var par = [0, 1, 1, 1, 3, 5, 5];
                renderParent(par, {1: 'active', 3: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. 3의 부모를 1로 변경합니다. {1, 2, 3, 4}가 같은 집합이 됩니다.';
            },
            undo: function() {
                var par = [0, 1, 1, 3, 3, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(5, 6): 6의 부모를 5로 변경합니다. {5, 6}이 같은 집합이 됩니다.';
            }
        });

        // Step 5: find(4) with path compression
        steps.push({
            description: 'find(4): 4→3→1 경로를 따라 루트 1을 찾습니다. <strong>경로 압축</strong>: parent[4]=1로 직접 연결하여 다음 find(4)가 O(1)이 되도록 최적화',
            action: function() {
                var par = [0, 1, 1, 1, 1, 5, 5];
                renderParent(par, {4: 'changed', 1: 'active'});
                renderTree(par);
                infoEl.innerHTML = 'find(4): 4→3→1 경로를 따라갑니다. <strong>경로 압축!</strong> parent[4]을 1로 직접 연결합니다.';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 3, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. 3의 부모를 1로 변경합니다.';
            }
        });

        // Step 6: union(1, 5)
        steps.push({
            description: 'union(1, 5): {1,2,3,4}와 {5,6}을 합칩니다. parent[5]=1 — 모든 노드가 같은 루트를 갖게 되어 하나의 집합으로 통합',
            action: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par, {1: 'active', 5: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 5): 5의 부모를 1로 변경합니다. 이제 <strong>모든 노드가 하나의 집합</strong>입니다!';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 1, 5, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = 'find(4): 경로 압축으로 parent[4]을 1로 직접 연결합니다.';
            }
        });

        // Step 7: final
        steps.push({
            description: '✅ 완료! 모든 노드가 루트 1 아래 하나의 집합 — find()로 아무 두 노드를 비교해도 같은 루트이므로 O(1)에 같은 집합 판별 가능',
            action: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par);
                renderTree(par);
                infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">✅ 완료! 6개 노드가 모두 하나의 집합으로 합쳐졌습니다. 대표는 1입니다.</strong>';
            },
            undo: function() {
                var par = [0, 1, 1, 1, 1, 1, 5];
                renderParent(par, {1: 'active', 5: 'changed'});
                renderTree(par);
                infoEl.innerHTML = 'union(1, 5): 5의 부모를 1로 변경합니다. 이제 모든 노드가 하나의 집합입니다!';
            }
        });

        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 1: 기본 유니온 파인드 (boj-1717)
    // ====================================================================
    _renderVizBasicUF: function(container) {
        var self = this, suffix = '-uf1';
        var DEFAULT_N = 7;
        var DEFAULT_OPS = '0 1 3, 0 7 6, 0 3 7, 1 1 7, 1 1 6';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">집합의 표현 — 기본 Union-Find</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">노드 수 N: <input type="number" id="uf-basic-n" value="' + DEFAULT_N + '" min="2" max="15" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">연산: <input type="text" id="uf-basic-ops" value="' + DEFAULT_OPS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:320px;" title="0 a b = union(a,b), 1 a b = find(a)==find(b)?"></label>' +
            '<button class="btn btn-primary" id="uf-basic-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: <code>0 a b</code> = union(a,b), <code>1 a b</code> = find(a)==find(b)? — 쉼표로 구분</p>' +
            self._createStepDesc(suffix) +
            '<div id="uf-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="uf-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var parEl = container.querySelector('#uf-par' + suffix);
        var infoEl = container.querySelector('#uf-info' + suffix);

        function renderPar(par, N, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 0; i <= N; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:44px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }

        function parseOps(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return { op: parts[0], a: parts[1], b: parts[2] };
            }).filter(function(o) { return !isNaN(o.op) && !isNaN(o.a) && !isNaN(o.b); });
        }

        function ufFind(par, x) {
            var path = [];
            while (par[x] !== x) { path.push(x); x = par[x]; }
            var root = x;
            for (var i = 0; i < path.length; i++) par[path[i]] = root;
            return { root: root, path: path };
        }

        function buildSteps(N, ops) {
            var initPar = [];
            for (var i = 0; i <= N; i++) initPar[i] = i;
            renderPar(initPar, N);
            infoEl.innerHTML = '<span style="color:var(--text2);">' + (N + 1) + '개 노드가 각각 독립된 집합입니다.</span>';

            var steps = [];
            var curPar = initPar.slice();

            for (var oi = 0; oi < ops.length; oi++) {
                (function(op, prevPar) {
                    if (op.op === 0) {
                        // union operation
                        var parBefore = prevPar.slice();
                        var findA = ufFind(parBefore.slice(), op.a);
                        var findB = ufFind(parBefore.slice(), op.b);
                        var ra = findA.root, rb = findB.root;
                        var newPar = prevPar.slice();
                        // apply find path compression
                        for (var pi = 0; pi < findA.path.length; pi++) newPar[findA.path[pi]] = ra;
                        for (var pi = 0; pi < findB.path.length; pi++) newPar[findB.path[pi]] = rb;
                        var sameSet = (ra === rb);
                        if (!sameSet) {
                            newPar[rb] = ra;
                        }
                        var highlights = {};
                        highlights[ra] = 'active';
                        if (!sameSet) highlights[rb] = 'changed';

                        var descText = sameSet
                            ? 'union(' + op.a + ', ' + op.b + '): find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → 루트가 같으므로 이미 같은 집합! 합칠 필요 없음'
                            : 'union(' + op.a + ', ' + op.b + '): find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → 루트가 다르므로 parent[' + rb + ']=' + ra + '로 연결하여 하나의 집합으로 합침';
                        var infoText = sameSet
                            ? 'union(' + op.a + ',' + op.b + '): 루트가 같으므로 이미 같은 집합 — 변경 없음.'
                            : 'union(' + op.a + ',' + op.b + '): parent[' + rb + ']=' + ra + '로 연결. 이제 find()로 같은 집합 판별 가능.';

                        steps.push({
                            description: descText,
                            action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                            undo: function() { renderPar(prevPar, N); infoEl.innerHTML = oi === 0 ? '<span style="color:var(--text2);">' + (N + 1) + '개 노드가 각각 독립된 집합입니다.</span>' : ''; }
                        });
                        curPar = newPar;
                    } else {
                        // find/check operation
                        var parBefore = prevPar.slice();
                        var newPar = prevPar.slice();
                        var findA = ufFind(newPar.slice(), op.a);
                        var findB = ufFind(newPar.slice(), op.b);
                        // apply path compression
                        var pathA = ufFind(newPar, op.a);
                        var pathB = ufFind(newPar, op.b);
                        var ra = pathA.root, rb = pathB.root;
                        var same = (ra === rb);
                        var pathStr = '';
                        if (pathA.path.length > 0) pathStr += op.a + '→' + pathA.path.slice().reverse().concat([ra]).join('→');
                        var highlights = {};
                        highlights[op.a] = 'active';
                        highlights[op.b] = 'active';

                        var descText = 'find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → ' + (same ? '루트가 같으므로 같은 집합 YES ✅' : '루트가 다르므로 다른 집합 NO ❌') + ' (경로 압축 적용)';
                        var infoText = same
                            ? '<strong style="color:var(--green);font-size:1.05rem;">✅ find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → 같은 집합! YES</strong>'
                            : '<strong style="color:var(--red, #e17055);font-size:1.05rem;">❌ find(' + op.a + ')=' + ra + ', find(' + op.b + ')=' + rb + ' → 다른 집합! NO</strong>';

                        steps.push({
                            description: descText,
                            action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                            undo: function() { renderPar(parBefore, N); infoEl.innerHTML = ''; }
                        });
                        curPar = newPar;
                    }
                })(ops[oi], curPar.slice());
            }

            return steps;
        }

        function init() {
            var N = parseInt(container.querySelector('#uf-basic-n').value) || DEFAULT_N;
            var ops = parseOps(container.querySelector('#uf-basic-ops').value);
            if (N < 1) N = 1;
            if (N > 15) N = 15;
            var steps = buildSteps(N, ops);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-basic-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // 시뮬레이션 2: 여행 가자 (boj-1976)
    // ====================================================================
    _renderVizTravel: function(container) {
        var self = this, suffix = '-travel';
        var DEFAULT_N = 5;
        var DEFAULT_EDGES = '1 2, 2 3, 4 5';
        var DEFAULT_PLAN = '1 2 3';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">여행 가자 — 연결 요소 판별</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">도시 수 N: <input type="number" id="uf-travel-n" value="' + DEFAULT_N + '" min="2" max="12" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:80px;"></label>' +
            '<label style="font-weight:600;">노선: <input type="text" id="uf-travel-edges" value="' + DEFAULT_EDGES + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;" title="a b 쌍을 쉼표로 구분"></label>' +
            '<label style="font-weight:600;">여행경로: <input type="text" id="uf-travel-plan" value="' + DEFAULT_PLAN + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;" title="방문할 도시를 공백으로 구분"></label>' +
            '<button class="btn btn-primary" id="uf-travel-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">노선 형식: <code>a b</code> 쌍을 쉼표로 구분, 여행경로: 도시 번호를 공백으로 구분</p>' +
            self._createStepDesc(suffix) +
            '<div id="tv-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="tv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var parEl = container.querySelector('#tv-par' + suffix);
        var infoEl = container.querySelector('#tv-info' + suffix);

        function renderPar(par, N, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 1; i <= N; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:56px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1.05rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }

        function parseEdges(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/).map(Number);
                return { a: parts[0], b: parts[1] };
            }).filter(function(e) { return !isNaN(e.a) && !isNaN(e.b); });
        }

        function parsePlan(str) {
            return str.trim().split(/\s+/).map(Number).filter(function(n) { return !isNaN(n); });
        }

        function ufFind(par, x) {
            while (par[x] !== x) x = par[x];
            return x;
        }

        function buildSteps(N, edges, plan) {
            var initPar = [0];
            for (var i = 1; i <= N; i++) initPar[i] = i;
            renderPar(initPar, N);
            infoEl.innerHTML = '<span style="color:var(--text2);">' + N + '개 도시를 각각 초기화합니다.</span>';

            var steps = [];
            var curPar = initPar.slice();

            // Step group 1: union edges
            for (var ei = 0; ei < edges.length; ei++) {
                (function(edge, prevPar) {
                    var newPar = prevPar.slice();
                    var ra = ufFind(newPar, edge.a);
                    var rb = ufFind(newPar, edge.b);
                    var already = (ra === rb);
                    if (!already) newPar[rb] = ra;
                    // path compression for a and b
                    var x = edge.a; while (newPar[x] !== x) { newPar[x] = ra; x = newPar[x]; }
                    x = edge.b; while (newPar[x] !== x) { newPar[x] = ra; x = newPar[x]; }

                    var highlights = {};
                    highlights[ra] = 'active';
                    if (!already) highlights[rb] = 'changed';

                    var descText = already
                        ? '노선 ' + edge.a + '-' + edge.b + ': 루트가 같으므로 이미 연결된 도시 (합칠 필요 없음)'
                        : '노선 ' + edge.a + '-' + edge.b + ' → union: parent[' + rb + ']=' + ra + ' — 두 도시를 같은 집합으로 연결하여 이동 가능하게 함';
                    var infoText = already
                        ? '도시 ' + edge.a + '과 ' + edge.b + '은 이미 연결되어 있습니다.'
                        : 'union(' + edge.a + ',' + edge.b + '): parent[' + rb + ']=' + ra + '. 도시 ' + edge.a + '과 ' + edge.b + '가 연결됩니다.';

                    steps.push({
                        description: descText,
                        action: function() { renderPar(newPar, N, highlights); infoEl.innerHTML = infoText; },
                        undo: function() { renderPar(prevPar, N); infoEl.innerHTML = ''; }
                    });
                    curPar = newPar;
                })(edges[ei], curPar.slice());
            }

            // Step group 2: check travel plan
            if (plan.length > 0) {
                (function(checkPar) {
                    var roots = {};
                    var allSame = true;
                    var firstRoot = ufFind(checkPar, plan[0]);
                    var highlights = {};
                    for (var pi = 0; pi < plan.length; pi++) {
                        var r = ufFind(checkPar, plan[pi]);
                        roots[plan[pi]] = r;
                        highlights[plan[pi]] = 'active';
                        if (r !== firstRoot) allSame = false;
                    }
                    var rootList = plan.map(function(c) { return 'find(' + c + ')=' + ufFind(checkPar, c); }).join(', ');

                    steps.push({
                        description: '여행 경로 확인: ' + rootList + ' — 모든 도시의 루트가 같으면 이동 가능',
                        action: function() { renderPar(checkPar, N, highlights); infoEl.innerHTML = '여행 도시 대표: ' + rootList; },
                        undo: function() { renderPar(checkPar, N); infoEl.innerHTML = ''; }
                    });

                    steps.push({
                        description: allSame ? '결과: 모든 도시의 루트가 같으므로 이동 가능 → YES ✅' : '결과: 루트가 다른 도시가 있어 연결이 끊김 → NO ❌',
                        action: function() {
                            renderPar(checkPar, N, highlights);
                            infoEl.innerHTML = allSame
                                ? '<strong style="color:var(--green);font-size:1.05rem;">✅ 여행 가능! YES</strong>'
                                : '<strong style="color:var(--red, #e17055);font-size:1.05rem;">❌ 여행 불가능! NO</strong>';
                        },
                        undo: function() { renderPar(checkPar, N, highlights); infoEl.innerHTML = '여행 도시 대표: ' + rootList; }
                    });
                })(curPar.slice());
            }

            return steps;
        }

        function init() {
            var N = parseInt(container.querySelector('#uf-travel-n').value) || DEFAULT_N;
            var edges = parseEdges(container.querySelector('#uf-travel-edges').value);
            var plan = parsePlan(container.querySelector('#uf-travel-plan').value);
            if (N < 2) N = 2;
            if (N > 12) N = 12;
            var steps = buildSteps(N, edges, plan);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-travel-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // 시뮬레이션 3: 섬의 개수 (lc-200)
    // ====================================================================
    _renderVizIslands: function(container) {
        var self = this, suffix = '-island';
        var DEFAULT_GRID = '1 1 0 0 0; 1 1 0 0 0; 0 0 1 0 0; 0 0 0 1 1';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">섬의 개수 — 격자 Union-Find</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">격자: <input type="text" id="uf-island-grid" value="' + DEFAULT_GRID + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;" title="행을 세미콜론으로 구분, 각 칸은 공백으로 구분"></label>' +
            '<button class="btn btn-primary" id="uf-island-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: 행을 <code>;</code>으로 구분, 칸은 공백으로 구분. 예: <code>1 1 0; 1 0 1; 0 1 1</code></p>' +
            self._createStepDesc(suffix) +
            '<div id="is-grid' + suffix + '" style="display:inline-grid;gap:4px;margin-bottom:12px;"></div>' +
            '<div id="is-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var gridEl = container.querySelector('#is-grid' + suffix);
        var infoEl = container.querySelector('#is-info' + suffix);

        function parseGrid(str) {
            var rows = str.split(';').map(function(row) {
                return row.trim().split(/\s+/).map(function(v) { return v === '1' ? '1' : '0'; });
            }).filter(function(row) { return row.length > 0; });
            return rows;
        }

        function findRoot(par, x) {
            while (par[x] !== x) x = par[x];
            return x;
        }

        function renderGrid(grid, R, C, parent, highlights) {
            highlights = highlights || {};
            gridEl.style.gridTemplateColumns = 'repeat(' + C + ', 48px)';
            var colors = ['var(--accent)', 'var(--green)', '#e17055', '#fdcb6e', '#6c5ce7', '#00cec9', '#e84393', '#636e72'];
            var rootColor = {};
            var ci = 0;
            var html = '';
            for (var r = 0; r < R; r++) {
                for (var c = 0; c < C; c++) {
                    var idx = r * C + c;
                    var bg = 'var(--bg2)';
                    var clr = 'var(--text3)';
                    if (grid[r][c] === '1' && parent) {
                        var root = findRoot(parent, idx);
                        if (!(root in rootColor)) { rootColor[root] = colors[ci % colors.length]; ci++; }
                        bg = rootColor[root] + '25';
                        clr = rootColor[root];
                        if (highlights[idx]) { bg = rootColor[root]; clr = 'white'; }
                    }
                    html += '<div style="width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:8px;font-weight:700;font-size:0.95rem;background:' + bg + ';color:' + clr + ';border:2px solid ' + (highlights[idx] ? clr : 'transparent') + ';">' + grid[r][c] + '</div>';
                }
            }
            gridEl.innerHTML = html;
        }

        function buildSteps(grid) {
            var R = grid.length, C = grid[0].length;
            var totalOnes = 0;
            for (var r = 0; r < R; r++)
                for (var c = 0; c < C; c++)
                    if (grid[r][c] === '1') totalOnes++;

            var initPar = [];
            for (var i = 0; i < R * C; i++) initPar[i] = i;

            renderGrid(grid, R, C, null);
            infoEl.innerHTML = '<span style="color:var(--text2);">\'1\' 칸 수 = ' + totalOnes + ' → 초기 섬 개수 = ' + totalOnes + '</span>';

            var steps = [];
            var curPar = initPar.slice();
            var count = totalOnes;

            // Step 1: show initial state with parent array
            steps.push({
                description: '초기: \'1\' 칸 ' + totalOnes + '개를 각각 독립된 섬으로 시작 — 인접한 칸끼리 union하면 count가 줄어듦',
                action: function() { renderGrid(grid, R, C, initPar.slice()); infoEl.innerHTML = '각 \'1\' 칸이 독립적인 섬. <strong>count = ' + totalOnes + '</strong>'; },
                undo: function() { renderGrid(grid, R, C, null); infoEl.innerHTML = '<span style="color:var(--text2);">\'1\' 칸 수 = ' + totalOnes + ' → 초기 섬 개수 = ' + totalOnes + '</span>'; }
            });

            // Scan grid and create union steps for adjacent '1' cells
            var dr = [0, 1], dc = [1, 0]; // right and down
            for (var r = 0; r < R; r++) {
                for (var c = 0; c < C; c++) {
                    if (grid[r][c] !== '1') continue;
                    for (var d = 0; d < 2; d++) {
                        var nr = r + dr[d], nc = c + dc[d];
                        if (nr >= R || nc >= C || grid[nr][nc] !== '1') continue;
                        var idx1 = r * C + c, idx2 = nr * C + nc;
                        (function(prevPar, i1, i2, rr, cc, nrr, ncc, prevCount) {
                            var newPar = prevPar.slice();
                            var r1 = findRoot(newPar, i1);
                            var r2 = findRoot(newPar, i2);
                            var merged = false;
                            if (r1 !== r2) {
                                newPar[r2] = r1;
                                merged = true;
                            }
                            var newCount = merged ? prevCount - 1 : prevCount;
                            var highlights = {};
                            highlights[i1] = true;
                            highlights[i2] = true;

                            var descText = merged
                                ? 'union(' + i1 + ',' + i2 + '): (' + rr + ',' + cc + ')↔(' + nrr + ',' + ncc + ') 인접한 땅이므로 합침 → 섬 하나 감소, count=' + newCount
                                : '(' + rr + ',' + cc + ')↔(' + nrr + ',' + ncc + '): 이미 같은 섬에 속함 (루트 동일). count=' + newCount;
                            var infoText = merged
                                ? '(' + rr + ',' + cc + ')↔(' + nrr + ',' + ncc + ') union! <strong>count = ' + newCount + '</strong>'
                                : '(' + rr + ',' + cc + ')↔(' + nrr + ',' + ncc + ') 이미 같은 집합. count = ' + newCount;

                            steps.push({
                                description: descText,
                                action: function() { renderGrid(grid, R, C, newPar, highlights); infoEl.innerHTML = infoText; },
                                undo: function() { renderGrid(grid, R, C, prevPar); infoEl.innerHTML = ''; }
                            });
                            curPar = newPar;
                            count = newCount;
                        })(curPar.slice(), idx1, idx2, r, c, nr, nc, count);
                    }
                }
            }

            // Final step
            var finalPar = curPar.slice();
            var finalCount = count;
            steps.push({
                description: '✅ 완료! 인접한 모든 \'1\' 칸을 union한 결과 → 섬 ' + finalCount + '개',
                action: function() { renderGrid(grid, R, C, finalPar); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">✅ 정답: 섬 ' + finalCount + '개</strong>'; },
                undo: function() { renderGrid(grid, R, C, finalPar); infoEl.innerHTML = ''; }
            });

            return steps;
        }

        function init() {
            var grid = parseGrid(container.querySelector('#uf-island-grid').value);
            if (grid.length === 0) grid = [['1','0'],['0','1']];
            // Ensure all rows have same length
            var maxC = 0;
            for (var i = 0; i < grid.length; i++) if (grid[i].length > maxC) maxC = grid[i].length;
            for (var i = 0; i < grid.length; i++) while (grid[i].length < maxC) grid[i].push('0');
            var steps = buildSteps(grid);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-island-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ====================================================================
    // 시뮬레이션 4: 친구 네트워크 (boj-4195)
    // ====================================================================
    _renderVizFriendNet: function(container) {
        var self = this, suffix = '-friend';
        var DEFAULT_PAIRS = 'Fred Barney, Barney Betty, Betty Wilma';

        container.innerHTML =
            '<h3 style="margin-bottom:8px;">친구 네트워크 — 집합 크기 추적</h3>' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">친구 쌍: <input type="text" id="uf-friend-pairs" value="' + DEFAULT_PAIRS + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:400px;" title="이름1 이름2 쌍을 쉼표로 구분"></label>' +
            '<button class="btn btn-primary" id="uf-friend-reset">🔄</button>' +
            '</div>' +
            '<p style="color:var(--text2);margin-bottom:12px;font-size:0.85rem;">형식: <code>이름1 이름2</code> 쌍을 쉼표로 구분. 예: <code>Fred Barney, Barney Betty</code></p>' +
            self._createStepDesc(suffix) +
            '<div id="fn-names' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="fn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);

        var namesEl = container.querySelector('#fn-names' + suffix);
        var infoEl = container.querySelector('#fn-info' + suffix);

        function parsePairs(str) {
            return str.split(',').map(function(s) {
                var parts = s.trim().split(/\s+/);
                if (parts.length >= 2) return { a: parts[0], b: parts[1] };
                return null;
            }).filter(function(p) { return p !== null && p.a && p.b; });
        }

        function findR(par, x) { while (par[x] !== x) x = par[x]; return x; }

        function renderNames(par, sz, nameMap, highlights) {
            highlights = highlights || {};
            var html = '';
            var keys = Object.keys(nameMap);
            for (var k = 0; k < keys.length; k++) {
                var name = keys[k];
                var id = nameMap[name];
                var cls = 'str-char-box';
                if (highlights[id] === 'active') cls += ' active';
                else if (highlights[id] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:70px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">' + name + '</div>' +
                    '<div style="font-weight:700;font-size:1rem;">p=' + par[id] + ' s=' + sz[findR(par, id)] + '</div></div>';
            }
            namesEl.innerHTML = html;
        }

        function buildSteps(pairs) {
            namesEl.innerHTML = '';
            infoEl.innerHTML = '<span style="color:var(--text2);">친구 관계를 하나씩 추가합니다.</span>';

            var steps = [];
            var nameMap = {};
            var par = [];
            var sz = [];
            var idx = 0;
            var outputs = [];

            for (var pi = 0; pi < pairs.length; pi++) {
                (function(pair, prevNameMap, prevPar, prevSz, prevIdx, stepIdx) {
                    var curMap = {};
                    for (var k in prevNameMap) curMap[k] = prevNameMap[k];
                    var curPar = prevPar.slice();
                    var curSz = prevSz.slice();
                    var curIdx = prevIdx;

                    // Register new names
                    if (!(pair.a in curMap)) {
                        curMap[pair.a] = curIdx;
                        curPar[curIdx] = curIdx;
                        curSz[curIdx] = 1;
                        curIdx++;
                    }
                    if (!(pair.b in curMap)) {
                        curMap[pair.b] = curIdx;
                        curPar[curIdx] = curIdx;
                        curSz[curIdx] = 1;
                        curIdx++;
                    }

                    var idA = curMap[pair.a], idB = curMap[pair.b];
                    var rA = findR(curPar, idA), rB = findR(curPar, idB);
                    var highlights = {};
                    var merged = false;
                    if (rA !== rB) {
                        if (curSz[rA] < curSz[rB]) { var tmp = rA; rA = rB; rB = tmp; }
                        curPar[rB] = rA;
                        curSz[rA] += curSz[rB];
                        merged = true;
                    }
                    var networkSize = curSz[findR(curPar, idA)];
                    outputs.push(networkSize);

                    highlights[rA] = 'active';
                    if (merged) highlights[rB] = 'changed';

                    var nameA = pair.a, nameB = pair.b;
                    var findAName = '', findBName = '';
                    // Find name for root
                    var keys = Object.keys(curMap);
                    for (var ki = 0; ki < keys.length; ki++) {
                        if (curMap[keys[ki]] === rA) findAName = keys[ki];
                        if (curMap[keys[ki]] === rB) findBName = keys[ki];
                    }
                    var descText = merged
                        ? nameA + '-' + nameB + ': find(' + nameB + ')=' + findBName + ' → union → 크기 = ' + networkSize
                        : nameA + '-' + nameB + ': 이미 같은 네트워크. 크기 = ' + networkSize;
                    var infoText = merged
                        ? nameA + '↔' + nameB + ': union! 네트워크 크기 = <strong>' + networkSize + '</strong>'
                        : nameA + '↔' + nameB + ': 이미 같은 네트워크. 크기 = <strong>' + networkSize + '</strong>';

                    // Capture for closure
                    var snapPar = curPar.slice();
                    var snapSz = curSz.slice();
                    var snapMap = {};
                    for (var k in curMap) snapMap[k] = curMap[k];
                    var snapHighlights = {};
                    for (var k in highlights) snapHighlights[k] = highlights[k];

                    var prevSnapPar = prevPar.slice();
                    var prevSnapSz = prevSz.slice();
                    var prevSnapMap = {};
                    for (var k in prevNameMap) prevSnapMap[k] = prevNameMap[k];

                    steps.push({
                        description: descText,
                        action: function() { renderNames(snapPar, snapSz, snapMap, snapHighlights); infoEl.innerHTML = infoText; },
                        undo: function() {
                            if (stepIdx === 0) { namesEl.innerHTML = ''; infoEl.innerHTML = '<span style="color:var(--text2);">친구 관계를 하나씩 추가합니다.</span>'; }
                            else { renderNames(prevSnapPar, prevSnapSz, prevSnapMap); infoEl.innerHTML = ''; }
                        }
                    });

                    // Update outer state for next iteration
                    nameMap = curMap;
                    par = curPar;
                    sz = curSz;
                    idx = curIdx;
                })(pairs[pi], JSON.parse(JSON.stringify(nameMap)), par.slice(), sz.slice(), idx, pi);
            }

            // Final step showing all outputs
            if (pairs.length > 0) {
                var finalPar = par.slice();
                var finalSz = sz.slice();
                var finalMap = {};
                for (var k in nameMap) finalMap[k] = nameMap[k];
                var outputStr = outputs.join(' → ');
                steps.push({
                    description: '완료! 출력: ' + outputStr,
                    action: function() { renderNames(finalPar, finalSz, finalMap); infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">✅ 출력: ' + outputStr + '</strong>'; },
                    undo: function() { renderNames(finalPar, finalSz, finalMap); infoEl.innerHTML = ''; }
                });
            }

            return steps;
        }

        function init() {
            var pairs = parsePairs(container.querySelector('#uf-friend-pairs').value);
            var steps = buildSteps(pairs);
            self._initStepController(container, steps, suffix);
        }

        container.querySelector('#uf-friend-reset').addEventListener('click', function() {
            self._clearVizState();
            init();
        });

        init();
    },

    // ===== 문제 목록 =====
    renderProblem: function(container) {},

    stages: [
        { num: 1, title: '기본 유니온 파인드', desc: '유니온 파인드의 기본 구현과 집합 판별 (Gold IV~V)', problemIds: ['boj-1717', 'boj-1976'] },
        { num: 2, title: '유니온 파인드 응용', desc: '섬 개수, 네트워크 크기 등 응용 문제 (Medium~Gold)', problemIds: ['lc-200', 'boj-4195'] }
    ],

    problems: [
        // ===== 1단계: 기본 유니온 파인드 =====
        {
            id: 'boj-1717', title: 'BOJ 1717 - 집합의 표현', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1717',
            simIntro: '기본 Union-Find 연산(union, find)이 어떻게 동작하는지 확인하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>초기에 {0}, {1}, ..., {n}이 각각 n+1개의 집합을 이루고 있다. 여기에 합집합 연산과, 두 원소가 같은 집합에 포함되어 있는지를 확인하는 연산을 수행하려고 한다.</p>
                <p>0 a b: a가 포함된 집합과 b가 포함된 집합을 합친다.</p>
                <p>1 a b: a와 b가 같은 집합에 포함되어 있는지를 확인한다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 n(1 &le; n &le; 1,000,000), m(1 &le; m &le; 100,000)이 주어진다. m은 입력으로 주어지는 연산의 개수이다. 다음 m개의 줄에는 각각의 연산이 주어진다. 합집합은 0 a b의 형태로 입력이 주어진다. 이는 a가 포함되어 있는 집합과, b가 포함되어 있는 집합을 합친다는 의미이다. 두 원소가 같은 집합에 포함되어 있는지를 확인하는 연산은 1 a b의 형태로 입력이 주어진다. a와 b는 n 이하의 자연수 또는 0이며 같을 수도 있다.</p>
                <h4>출력</h4>
                <p>1로 시작하는 입력에 대해서 한 줄에 하나씩 "YES" 또는 "NO"로 결과를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7 8\n0 1 3\n1 1 7\n0 7 6\n1 7 1\n0 3 7\n0 4 2\n0 1 1\n1 1 1</pre></div>
                    <div><strong>출력</strong><pre>NO\nNO\nYES</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ n ≤ 1,000,000</li><li>1 ≤ m ≤ 100,000</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '집합을 관리하려면... 각 집합을 <span class="lang-py"><strong>리스트(list)</strong></span><span class="lang-cpp"><strong>벡터(vector)</strong></span>로 만들면 되지 않을까?<br><br>"0 a b"가 오면 a가 속한 리스트와 b가 속한 리스트를 합치고,<br>"1 a b"가 오면 a와 b가 같은 리스트에 있는지 확인하면 될 것 같아!' },
                { title: '근데 이러면 문제가 있어', content: '합집합할 때 한쪽 리스트의 원소를 전부 다른 쪽으로 옮겨야 해. 원소가 k개면 <strong>O(k)</strong>번 이동이 필요하고...<br><br>n이 최대 <strong>1,000,000</strong>, m이 최대 <strong>100,000</strong>이면, 최악의 경우 합칠 때마다 수십만 개를 옮겨야 할 수도 있어. 너무 느려! 😱<br><br>같은 집합인지 확인하는 것도, 리스트를 다 뒤져야 하면 <strong>O(n)</strong>이 걸려.' },
                { title: '이렇게 하면 어떨까?', content: '리스트 대신 <strong>트리 구조</strong>를 쓰자! 각 원소가 "부모"를 가리키게 하면:<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">parent[] 배열 → 트리 구조</div><div style="display:flex;gap:24px;justify-content:center;align-items:flex-start;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">parent = [0,1,1,3,1]</div><table style="border-collapse:collapse;font-family:monospace;margin:0 auto;"><tr><td style="padding:2px 8px;border:1px solid var(--bg3);text-align:center;font-size:0.8em;color:var(--text2);">idx</td><td style="padding:2px 8px;border:1px solid var(--bg3);">0</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">2</td><td style="padding:2px 8px;border:1px solid var(--bg3);">3</td><td style="padding:2px 8px;border:1px solid var(--bg3);">4</td></tr><tr><td style="padding:2px 8px;border:1px solid var(--bg3);text-align:center;font-size:0.8em;color:var(--text2);">par</td><td style="padding:2px 8px;border:1px solid var(--bg3);">0</td><td style="padding:2px 8px;border:1px solid var(--bg3);font-weight:700;color:var(--green);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td><td style="padding:2px 8px;border:1px solid var(--bg3);">3</td><td style="padding:2px 8px;border:1px solid var(--bg3);">1</td></tr></table></div><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">트리 형태</div><div style="display:flex;flex-direction:column;align-items:center;gap:2px;"><span style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;">1 (루트)</span><div style="display:flex;gap:16px;"><span style="border-left:2px solid var(--text2);height:12px;"></span><span style="border-left:2px solid var(--text2);height:12px;"></span></div><div style="display:flex;gap:12px;"><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">2</span><span style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">4</span></div></div></div></div></div>• <strong>find(x)</strong>: x에서 부모를 따라 올라가면 루트를 찾을 수 있어. 루트가 같으면 같은 집합!<br>• <strong>union(a, b)</strong>: 한쪽 루트를 다른 쪽 루트의 자식으로 붙이면 끝!<br><br>여기에 두 가지 최적화를 더하면 거의 <strong>O(1)</strong>에 가까워져:<br>① <strong>경로 압축</strong> — find할 때 만나는 노드를 전부 루트에 직접 연결<br>② <strong>랭크 기반 합치기</strong> — 높이가 낮은 트리를 높은 쪽에 붙임' },
                { title: '구현 시 주의할 점', content: 'n이 최대 1,000,000이라 입출력 속도가 중요해!<br><br><span class="lang-py"><code>sys.stdin.readline</code>을 써서 입력을 빠르게 받고, 재귀 find를 쓸 거면 <code>sys.setrecursionlimit</code>을 늘려줘야 해. 아니면 반복문으로 find를 구현하는 방법도 있어.</span><span class="lang-cpp"><code>scanf/printf</code>를 쓰면 충분히 빠르고, 배열 크기를 1,000,001로 잡아야 해. C++에서 <code>union</code>은 예약어라 함수 이름을 <code>unite</code>로 써야 해!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b:\n        return\n    if rank[a] < rank[b]:\n        a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]:\n        rank[a] += 1\n\nn, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)\n\nfor _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")',
                cpp: '#include <cstdio>\n#include <algorithm>\nusing namespace std;\n\nint parent[1000001], rnk[1000001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return;\n    if (rnk[a] < rnk[b]) swap(a, b);\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i <= n; i++) {\n        parent[i] = i;\n        rnk[i] = 0;\n    }\n    while (m--) {\n        int op, a, b;\n        scanf("%d %d %d", &op, &a, &b);\n        if (op == 0) unite(a, b);\n        else printf("%s\\n", find(a) == find(b) ? "YES" : "NO");\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '경로 압축 + 랭크 기반 Union-Find',
                description: 'parent 배열과 rank 배열로 union/find를 구현합니다.',
                timeComplexity: 'O(m * α(n))',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', desc: '경로 압축 find + 랭크 기반 union으로 거의 O(1) 연산을 보장합니다.', code: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1' },
                        { title: '초기화', desc: '각 노드가 자기 자신을 부모로 가리키도록 초기화합니다. 처음엔 모두 독립 집합입니다.', code: 'n, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)' },
                        { title: '쿼리 처리', desc: 'op=0이면 합치기(union), op=1이면 같은 집합인지 find로 확인합니다.', code: 'for _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")' }
                    ],
                    cpp: [
                        { title: 'find/unite 구현', desc: '전역 배열 + 경로 압축 + 랭크 합치기.\nC++에서 union은 예약어라 unite 사용.', code: '#include <cstdio>\n#include <algorithm>\nusing namespace std;\n\nint parent[1000001], rnk[1000001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);  // 경로 압축\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return;\n    if (rnk[a] < rnk[b]) swap(a, b);  // 랭크 기반\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n}' },
                        { title: '초기화', desc: '전역 배열이므로 main에서 0~n까지 자기 자신으로 초기화합니다.', code: 'int main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i <= n; i++) {\n        parent[i] = i;\n        rnk[i] = 0;\n    }' },
                        { title: '쿼리 처리', desc: 'op=0이면 unite, 아니면 find 비교 후 YES/NO를 출력합니다.', code: '    while (m--) {\n        int op, a, b;\n        scanf("%d %d %d", &op, &a, &b);\n        if (op == 0) unite(a, b);\n        else printf("%s\\n", find(a)==find(b) ? "YES" : "NO");\n    }\n    return 0;\n}' }
                    ]
                },
                get templates() { return unionFindTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1976', title: 'BOJ 1976 - 여행 가자', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1976',
            simIntro: '인접행렬로 도시를 union한 뒤, 여행 경로를 확인하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>동혁이는 도시를 여행하려고 한다. N개의 도시가 있고, 그 중 일부 쌍이 연결되어 있다. 주어진 여행 경로가 가능한 여행 경로인지 여부를 판별하시오. 같은 도시를 여러 번 방문하는 것도 가능하다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 도시의 수 N이 주어진다. N은 200 이하이다. 둘째 줄에 여행 계획에 속한 도시들의 수 M이 주어진다. M은 1000 이하이다. 다음 N개의 줄에는 N개의 정수로 도시 간의 연결 정보가 주어진다. i번째 줄의 j번째 수는 i번 도시와 j번 도시의 연결 정보이며, 1이면 연결된 것이고 0이면 연결이 되지 않은 것이다. 마지막 줄에는 여행 계획이 주어진다.</p>
                <h4>출력</h4>
                <p>첫째 줄에 가능하면 "YES", 불가능하면 "NO"를 출력한다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n3\n0 1 0\n1 0 1\n0 1 0\n1 2 3</pre></div>
                    <div><strong>출력</strong><pre>YES</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ N ≤ 200</li><li>1 ≤ M ≤ 1,000</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '여행 경로가 1→2→3이면... 1에서 2로 갈 수 있는지, 2에서 3으로 갈 수 있는지 하나씩 확인하면 되지 않을까?<br><br>인접 행렬에서 직접 연결을 확인하거나, 직접 연결이 없으면 <strong>BFS/DFS</strong>로 경로가 있는지 탐색해볼 수 있겠어!' },
                { title: '근데 이러면 문제가 있어', content: '잠깐, 여행 경로가 M개 도시를 거치면 매번 BFS/DFS를 돌려야 해. 최악의 경우 <strong>O(M * N^2)</strong>이 될 수 있어.<br><br>그런데 사실... 꼭 "1→2→3 순서대로" 갈 수 있는지를 볼 필요가 있을까? 🤔<br>문제를 다시 읽어보면, 같은 도시를 여러 번 방문해도 되고, 경로가 어떻든 상관없어. 그러면 핵심은 뭘까?' },
                { title: '이렇게 하면 어떨까?', content: '핵심 관찰: 여행 도시들이 전부 <strong>같은 연결 요소</strong>에 있기만 하면 여행이 가능해!<br><br>연결만 되어 있으면 어떤 경로로든 오갈 수 있으니까. 그러면 문제가 단순해져:<br><br>① 인접 행렬에서 연결된 도시 쌍을 전부 <strong>union</strong><br>② 여행 도시들의 <strong>find</strong> 값이 모두 같으면 YES!<br><br>N이 최대 200이라 인접행렬을 읽으며 union하면 O(N^2)이면 충분해. 유니온 파인드로 깔끔하게 해결!' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        parent[b] = a\n\nN = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1:\n            union(i, j + 1)\n\ncities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")',
                cpp: '#include <cstdio>\nusing namespace std;\n\nint parent[201];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) parent[b] = a;\n}\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    for (int i = 1; i <= N; i++) parent[i] = i;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int v;\n            scanf("%d", &v);\n            if (v == 1) unite(i, j);\n        }\n    }\n\n    int first, city;\n    scanf("%d", &first);\n    bool ok = true;\n    for (int i = 1; i < M; i++) {\n        scanf("%d", &city);\n        if (find(city) != find(first)) ok = false;\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}'
            },
            solutions: [{
                approach: '인접행렬 + Union-Find',
                description: '인접행렬에서 연결된 도시를 union하고, 여행 도시의 find 값이 모두 같은지 확인합니다.',
                timeComplexity: 'O(N^2 * α(N))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', desc: '경로 압축으로 트리를 납작하게 만들어 find를 빠르게 합니다.', code: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b: parent[b] = a' },
                        { title: '입력 및 인접행렬 union', desc: '인접행렬에서 1인 칸을 찾아 해당 도시 쌍을 union합니다. 직접 연결된 도시들이 같은 집합이 됩니다.', code: 'N = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1: union(i, j + 1)' },
                        { title: '여행 가능 여부 확인', desc: '여행 도시들의 find 값이 모두 같으면 같은 연결 요소 → 여행 가능합니다.', code: 'cities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")' }
                    ],
                    cpp: [
                        { title: 'find/unite 구현', desc: '도시 수가 최대 200이라 배열 크기가 작습니다. 경로 압축만으로 충분합니다.', code: '#include <cstdio>\nusing namespace std;\n\nint parent[201];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) parent[b] = a;\n}' },
                        { title: '입력 및 인접행렬 unite', desc: 'N*N 인접행렬을 읽으며 값이 1인 도시 쌍을 unite로 같은 집합으로 묶습니다.', code: 'int main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    for (int i = 1; i <= N; i++) parent[i] = i;\n\n    for (int i = 1; i <= N; i++)\n        for (int j = 1; j <= N; j++) {\n            int v; scanf("%d", &v);\n            if (v == 1) unite(i, j);\n        }' },
                        { title: '여행 가능 여부 확인', desc: '첫 번째 여행 도시의 루트와 나머지를 비교해서 하나라도 다르면 NO입니다.', code: '    int first, city;\n    scanf("%d", &first);\n    bool ok = true;\n    for (int i = 1; i < M; i++) {\n        scanf("%d", &city);\n        if (find(city) != find(first)) ok = false;\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}' }
                    ]
                },
                get templates() { return unionFindTopic.problems[1].templates; }
            }]
        },

        // ===== 2단계: 유니온 파인드 응용 =====
        {
            id: 'lc-200', title: 'LeetCode 200 - Number of Islands', difficulty: 'medium',
            link: 'https://leetcode.com/problems/number-of-islands/',
            simIntro: '격자에서 인접한 땅을 union하여 섬 개수를 세는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>'1'(land)과 '0'(water)으로 이루어진 2D 격자 지도가 주어집니다. 섬의 개수를 반환하세요. 섬은 물로 둘러싸여 있으며, 수평 또는 수직으로 인접한 땅을 연결하여 형성됩니다.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]</pre></div>
                    <div><strong>출력</strong><pre>1</pre></div>
                </div></div>
                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>m == grid.length</li><li>n == grid[i].length</li><li>1 ≤ m, n ≤ 300</li><li>grid[i][j]는 '0' 또는 '1'</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '격자에서 섬을 찾으려면... \'1\'인 칸을 만나면 거기서 <strong>BFS나 DFS</strong>로 연결된 \'1\'을 전부 방문 처리하면 되겠지?<br><br>탐색을 시작한 횟수 = 섬 개수! 이건 그래프 탐색의 기본 패턴이야.' },
                { title: '근데 다른 방법도 있어', content: 'BFS/DFS도 좋지만, 이 문제를 <strong>유니온 파인드</strong>로도 풀 수 있어!<br><br>생각해보면, 인접한 \'1\' 칸끼리 "같은 그룹"으로 묶는 거잖아? 그게 바로 union 연산이야.<br>처음에 \'1\' 칸이 각각 독립된 섬이라고 하고, 인접한 \'1\'끼리 union하면 섬이 합쳐지는 거지!' },
                { title: '이렇게 하면 어떨까?', content: '구체적인 방법:<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.85em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">2D → 1D 인덱스 변환 (cols=5)</div><div style="display:flex;gap:2px;justify-content:center;flex-wrap:wrap;font-family:monospace;"><div style="display:flex;gap:2px;"><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">0</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">1</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">2</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">3</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">4</span></div><div style="display:flex;gap:2px;"><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">5</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--green);color:#fff;border-radius:4px;font-size:0.8em;">6</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">7</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">8</span><span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg3);border-radius:4px;font-size:0.8em;">9</span></div></div><div style="text-align:center;margin-top:6px;color:var(--text2);font-size:0.85em;">(r,c) → r*5+c: (1,0)→5, (1,1)→6</div><div style="text-align:center;margin-top:4px;color:var(--green);font-weight:600;">초록 칸끼리 union → 하나의 섬!</div></div>① 2D 좌표 (r, c)를 <code>r * cols + c</code>로 <strong>1D 인덱스</strong>로 변환 (parent 배열에 쓰려고!)<br>② 처음 섬 개수 = \'1\'인 칸의 총 개수<br>③ 모든 \'1\' 칸을 순회하면서, <strong>오른쪽/아래</strong> 칸도 \'1\'이면 union<br>④ union이 성공할 때마다 (서로 다른 집합이었을 때) 섬 개수를 <strong>1 감소</strong><br><br>왜 오른쪽/아래만? 왼쪽/위는 이미 이전에 확인했으니까 중복을 피하는 거야!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에서는 <code>parent = list(range(rows * cols))</code>로 간단히 초기화하고, union 성공 여부를 <code>return True/False</code>로 반환하면 count 감소를 깔끔하게 처리할 수 있어!</span><span class="lang-cpp">C++에서는 <code>iota(parent.begin(), parent.end(), 0)</code>으로 0,1,2,...를 한 번에 초기화할 수 있어! unite가 <code>bool</code>을 반환하게 만들면 성공 시 count--를 깔끔하게 처리할 수 있지.</span>' }
            ],
            templates: {
                python: 'class Solution:\n    def numIslands(self, grid):\n        if not grid:\n            return 0\n        rows, cols = len(grid), len(grid[0])\n        parent = list(range(rows * cols))\n        rank = [0] * (rows * cols)\n\n        def find(x):\n            while parent[x] != x:\n                parent[x] = parent[parent[x]]\n                x = parent[x]\n            return x\n\n        def union(a, b):\n            a, b = find(a), find(b)\n            if a == b:\n                return False\n            if rank[a] < rank[b]:\n                a, b = b, a\n            parent[b] = a\n            if rank[a] == rank[b]:\n                rank[a] += 1\n            return True\n\n        count = sum(grid[r][c] == \'1\'\n                     for r in range(rows)\n                     for c in range(cols))\n\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == \'1\':\n                    idx = r * cols + c\n                    for dr, dc in [(0, 1), (1, 0)]:\n                        nr, nc = r + dr, c + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == \'1\':\n                            if union(idx, nr * cols + nc):\n                                count -= 1\n        return count',
                cpp: 'class Solution {\npublic:\n    vector<int> parent, rnk;\n\n    int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rnk[a] < rnk[b]) swap(a, b);\n        parent[b] = a;\n        if (rnk[a] == rnk[b]) rnk[a]++;\n        return true;\n    }\n\n    int numIslands(vector<vector<char>>& grid) {\n        int rows = grid.size(), cols = grid[0].size();\n        parent.resize(rows * cols);\n        rnk.resize(rows * cols, 0);\n        iota(parent.begin(), parent.end(), 0);\n\n        int count = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == \'1\') count++;\n\n        int dr[] = {0, 1}, dc[] = {1, 0};\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] == \'1\') {\n                    for (int d = 0; d < 2; d++) {\n                        int nr = r + dr[d], nc = c + dc[d];\n                        if (nr < rows && nc < cols && grid[nr][nc] == \'1\')\n                            if (unite(r * cols + c, nr * cols + nc))\n                                count--;\n                    }\n                }\n            }\n        }\n        return count;\n    }\n};'
            },
            solutions: [{
                approach: 'Union-Find로 섬 세기',
                description: '인접한 \'1\' 칸을 union하고, union 성공시 count를 줄여 섬 개수를 구합니다.',
                timeComplexity: 'O(m * n * α(m*n))',
                spaceComplexity: 'O(m * n)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', desc: 'union이 성공하면 True를 반환해서 섬 개수를 줄이는 데 활용합니다.', code: 'parent = list(range(rows * cols))\nrank = [0] * (rows * cols)\n\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return False\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1\n    return True' },
                        { title: '초기 섬 수 계산', desc: '처음엔 모든 \'1\' 칸이 각각 독립된 섬이라고 가정하고 총 개수를 셉니다.', code: 'count = sum(grid[r][c] == \'1\'\n             for r in range(rows)\n             for c in range(cols))' },
                        { title: '인접 칸 union', desc: '오른쪽/아래만 확인하면 중복 없이 모든 인접 쌍을 처리합니다. union 성공 시 섬 개수를 1 줄입니다.', code: 'for r in range(rows):\n    for c in range(cols):\n        if grid[r][c] == \'1\':\n            idx = r * cols + c\n            for dr, dc in [(0,1),(1,0)]:\n                nr, nc = r+dr, c+dc\n                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==\'1\':\n                    if union(idx, nr*cols+nc):\n                        count -= 1\nreturn count' }
                    ],
                    cpp: [
                        { title: 'find/unite 구현', desc: '클래스 멤버로 parent/rnk 벡터.\niota로 0,1,2,...초기화.', code: 'vector<int> parent, rnk;\n\nint find(int x) {\n    while (parent[x] != x) {\n        parent[x] = parent[parent[x]];  // 경로 압축\n        x = parent[x];\n    }\n    return x;\n}\n\nbool unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return false;\n    if (rnk[a] < rnk[b]) swap(a, b);\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n    return true;  // union 성공 → 섬 개수 -1\n}' },
                        { title: '초기 섬 수 계산', desc: 'iota로 parent를 0,1,2,...로 초기화하고, \'1\' 칸 수를 초기 섬 개수로 설정합니다.', code: 'int rows = grid.size(), cols = grid[0].size();\nparent.resize(rows * cols);\nrnk.resize(rows * cols, 0);\niota(parent.begin(), parent.end(), 0);\n\nint count = 0;\nfor (int r = 0; r < rows; r++)\n    for (int c = 0; c < cols; c++)\n        if (grid[r][c] == \'1\') count++;' },
                        { title: '인접 칸 unite', desc: '오른쪽(0,1)과 아래(1,0) 두 방향만 확인합니다. unite 성공하면 두 섬이 합쳐져 count를 감소시킵니다.', code: 'int dr[] = {0, 1}, dc[] = {1, 0};\nfor (int r = 0; r < rows; r++)\n    for (int c = 0; c < cols; c++)\n        if (grid[r][c] == \'1\')\n            for (int d = 0; d < 2; d++) {\n                int nr = r+dr[d], nc = c+dc[d];\n                if (nr<rows && nc<cols && grid[nr][nc]==\'1\')\n                    if (unite(r*cols+c, nr*cols+nc))\n                        count--;\n            }\nreturn count;' }
                    ]
                },
                get templates() { return unionFindTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-4195', title: 'BOJ 4195 - 친구 네트워크', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/4195',
            simIntro: '이름→번호 매핑과 size 배열로 네트워크 크기를 추적하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>민혁이는 소셜 네트워크 사이트를 하나 만들었다. 두 사람이 친구가 되면, 두 사람의 친구 네트워크에 있는 사람의 수를 출력하는 프로그램을 작성하시오. 친구 관계는 전이적이다 (A-B 친구, B-C 친구 → A-C도 같은 네트워크).</p>
                <h4>입력</h4>
                <p>첫째 줄에 테스트 케이스의 개수가 주어진다. 각 테스트 케이스의 첫째 줄에는 친구 관계의 수 F가 주어지며, 1 &le; F &le; 100,000이다. 다음 F개의 줄에는 친구 관계가 주어진다. 친구 관계는 두 사용자의 아이디로 이루어져 있으며, 알파벳 대소문자 또는 숫자로 이루어진 길이 20 이하의 문자열이다.</p>
                <h4>출력</h4>
                <p>친구 관계가 생길 때마다, 두 사람의 친구 네트워크에 몇 명이 있는지 구하는 프로그램을 작성하시오.</p>
                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2\n3\nFred Barney\nBarney Betty\nBetty Wilma\n3\nFred Barney\nBetty Wilma\nBarney Betty</pre></div>
                    <div><strong>출력</strong><pre>2\n3\n4\n2\n2\n4</pre></div>
                </div></div>
                <h4>제약 조건</h4>
                <ul><li>1 ≤ T</li><li>1 ≤ F ≤ 100,000</li><li>이름은 알파벳 20자 이하</li></ul>
            `,
            hints: [
                { title: '처음 떠오르는 방법', content: '두 사람이 친구가 될 때마다 네트워크 크기를 출력해야 하네. 일단 유니온 파인드로 친구 관계를 합치면 될 것 같아!<br><br>근데... 이름이 문자열이야. "Fred", "Barney" 같은 이름을 유니온 파인드에 어떻게 넣지? parent 배열은 숫자 인덱스인데...' },
                { title: '근데 이러면 문제가 있어', content: '이름을 숫자로 바꾸는 건 <span class="lang-py"><strong>딕셔너리(dict)</strong></span><span class="lang-cpp"><strong>해시맵(unordered_map)</strong></span>으로 해결할 수 있어! 새 이름이 나올 때마다 번호를 하나씩 부여하면 돼.<br><br>그런데 또 문제가 있어. union은 할 수 있는데, 합친 후 <strong>네트워크 크기</strong>를 어떻게 알지?<br>매번 같은 집합인 사람을 전부 세면 <strong>O(n)</strong>이야. F가 최대 100,000이면 너무 느려!' },
                { title: '이렇게 하면 어떨까?', content: 'parent 배열 외에 <strong>size 배열</strong>을 하나 더 만들자!<br><br><div style="margin:10px 0;padding:12px;background:var(--bg2);border-radius:8px;font-size:0.88em;"><div style="font-weight:600;text-align:center;margin-bottom:8px;">union(A, B) 시 size 갱신 과정</div><div style="display:flex;gap:20px;justify-content:center;align-items:flex-end;flex-wrap:wrap;"><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">union 전</div><div style="display:flex;gap:16px;justify-content:center;"><div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;font-weight:600;">A</div><div style="font-size:0.78em;color:var(--text2);">size=2</div></div><div><div style="padding:4px 10px;background:var(--accent);color:#fff;border-radius:6px;font-weight:600;">B</div><div style="font-size:0.78em;color:var(--text2);">size=3</div></div></div></div><div style="font-size:1.2em;color:var(--text2);">→</div><div style="text-align:center;"><div style="font-size:0.8em;color:var(--text2);margin-bottom:4px;">union 후</div><div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="padding:4px 10px;background:var(--green);color:#fff;border-radius:6px;font-weight:700;">B (루트)</div><div style="font-size:0.78em;color:var(--green);font-weight:600;">size = 2 + 3 = 5</div><div style="border-left:2px solid var(--text2);height:8px;"></div><div style="padding:3px 8px;background:var(--accent);color:#fff;border-radius:4px;">A</div></div></div></div></div>• 처음에 모든 사람의 <code>size = 1</code> (자기 자신만 있으니까)<br>• union할 때 한쪽 루트를 다른 쪽에 붙이면서, <code>size[새 루트] += size[붙인 쪽]</code><br>• 크기를 항상 <strong>루트에만</strong> 저장하면, union 후 <code>size[find(a)]</code>가 바로 답!<br><br>이러면 크기를 O(1)에 바로 알 수 있어. 전체 시간복잡도는 <strong>O(F * a(F))</strong>로 거의 선형이야!' },
                { title: 'Python/C++에선 이렇게!', content: '<span class="lang-py">Python에서는 parent와 size를 <strong>딕셔너리</strong>로 쓰면 이름 매핑과 자연스럽게 연결돼. <code>name_to_id</code> dict로 이름→번호 변환 후, <code>parent[idx] = idx</code>, <code>size[idx] = 1</code>로 초기화하면 깔끔해!</span><span class="lang-cpp">C++에서는 <code>unordered_map&lt;string, int&gt;</code>로 이름을 매핑하고, 전역 배열 <code>parent[]</code>와 <code>sz[]</code>를 사용해. 테스트 케이스마다 idx를 0으로 리셋하는 걸 잊지 마!</span>' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]:\n            a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]\n\nT = int(input())\nfor _ in range(T):\n    F = int(input())\n    parent = {}\n    size = {}\n    name_to_id = {}\n    idx = 0\n\n    for _ in range(F):\n        a, b = input().split()\n        if a not in name_to_id:\n            name_to_id[a] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        if b not in name_to_id:\n            name_to_id[b] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        print(union(name_to_id[a], name_to_id[b]))',
                cpp: '#include <cstdio>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint parent[200001], sz[200001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nint unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) {\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    return sz[a];\n}\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int F;\n        scanf("%d", &F);\n        unordered_map<string, int> nameToId;\n        int idx = 0;\n        char a[21], b[21];\n\n        for (int i = 0; i < F; i++) {\n            scanf("%s %s", a, b);\n            string sa(a), sb(b);\n            if (nameToId.find(sa) == nameToId.end()) {\n                nameToId[sa] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            if (nameToId.find(sb) == nameToId.end()) {\n                nameToId[sb] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            printf("%d\\n", unite(nameToId[sa], nameToId[sb]));\n        }\n    }\n    return 0;\n}'
            },
            solutions: [{
                approach: '이름 매핑 + size 추적 Union-Find',
                description: '이름→번호 매핑 후 union 시 size 배열을 갱신하여 네트워크 크기를 출력합니다.',
                timeComplexity: 'O(F * α(F))',
                spaceComplexity: 'O(F)',
                codeSteps: {
                    python: [
                        { title: 'find/union with size', desc: 'rank 대신 size 배열을 써서 합칠 때 집합 크기를 바로 추적합니다.', code: 'def find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]: a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]' },
                        { title: '이름→번호 매핑', desc: '문자열 이름을 dict로 정수에 매핑합니다. 새 이름이 나올 때마다 번호를 부여하고 parent/size를 초기화합니다.', code: 'name_to_id = {}\nidx = 0\nfor name in [a, b]:\n    if name not in name_to_id:\n        name_to_id[name] = idx\n        parent[idx] = idx\n        size[idx] = 1\n        idx += 1' },
                        { title: 'union 후 크기 출력', desc: 'union이 루트의 size를 반환하므로 바로 출력하면 됩니다.', code: 'print(union(name_to_id[a], name_to_id[b]))' }
                    ],
                    cpp: [
                        { title: 'find/unite with size', desc: 'size 배열로 집합 크기 추적.\nunite 후 루트의 size를 반환.', code: 'int parent[200001], sz[200001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nint unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) {\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    return sz[a];  // 합쳐진 집합 크기\n}' },
                        { title: '이름→번호 매핑', desc: 'unordered_map<string,int>으로 매핑.\n새 이름 등장 시 번호 부여 + 초기화.', code: 'unordered_map<string, int> nameToId;\nint idx = 0;\n// 각 이름에 대해:\nif (nameToId.find(name) == nameToId.end()) {\n    nameToId[name] = idx;\n    parent[idx] = idx;\n    sz[idx] = 1;\n    idx++;\n}' },
                        { title: 'unite 후 크기 출력', desc: 'unite가 합쳐진 집합의 sz를 반환하므로 바로 printf로 출력합니다.', code: 'printf("%d\\n", unite(nameToId[a], nameToId[b]));' }
                    ]
                },
                get templates() { return unionFindTopic.problems[3].templates; }
            }]
        }
    ]
};

// 모듈 등록
window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.unionfind = unionFindTopic;
