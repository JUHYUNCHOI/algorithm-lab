// =========================================================
// 유니온 파인드 (Union-Find) 토픽 모듈
// =========================================================
var unionFindTopic = {
    id: 'unionfind',
    title: '유니온 파인드',
    icon: '🤝',
    category: '심화 선택',
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
                <div class="code-block">
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
                <div class="code-block">
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
                <div class="code-block">
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
            description: 'union(1, 2): 노드 1과 2를 합칩니다. parent[2] = 1',
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
            description: 'union(3, 4): 노드 3과 4를 합칩니다. parent[4] = 3',
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
            description: 'union(5, 6): 노드 5와 6을 합칩니다. parent[6] = 5',
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
            description: 'union(1, 3): {1,2}와 {3,4}를 합칩니다. parent[3] = 1',
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
            description: 'find(4): 4→3→1 경로를 따라 루트 1을 찾습니다. 경로 압축으로 parent[4] = 1',
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
            description: 'union(1, 5): {1,2,3,4}와 {5,6}을 합칩니다. parent[5] = 1',
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
            description: '완료! 모든 노드가 루트 1 아래 하나의 집합으로 합쳐졌습니다.',
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
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">집합의 표현 — 기본 Union-Find</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">7개 노드(0~7)에서 union/find 연산을 수행합니다.</p>' +
            '<div id="uf-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="uf-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var parEl = container.querySelector('#uf-par' + suffix);
        var infoEl = container.querySelector('#uf-info' + suffix);
        function renderPar(par, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 0; i <= 7; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:44px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }
        var p0 = [0,1,2,3,4,5,6,7];
        renderPar(p0);
        infoEl.innerHTML = '<span style="color:var(--text2);">8개 노드가 각각 독립된 집합입니다.</span>';
        var steps = [
            { description: 'union(1, 3): parent[3] = 1',
              action: function() { var p=[0,1,2,1,4,5,6,7]; renderPar(p,{1:'active',3:'changed'}); infoEl.innerHTML='union(1,3): parent[3]=1. {1,3} 같은 집합.'; },
              undo: function() { renderPar(p0); infoEl.innerHTML='<span style="color:var(--text2);">8개 노드가 각각 독립된 집합입니다.</span>'; }
            },
            { description: 'union(7, 6): parent[6] = 7',
              action: function() { var p=[0,1,2,1,4,5,7,7]; renderPar(p,{7:'active',6:'changed'}); infoEl.innerHTML='union(7,6): parent[6]=7. {7,6} 같은 집합.'; },
              undo: function() { var p=[0,1,2,1,4,5,6,7]; renderPar(p); infoEl.innerHTML='union(1,3): parent[3]=1. {1,3} 같은 집합.'; }
            },
            { description: 'union(3, 7): find(3)=1, find(7)=7 → parent[7]=1',
              action: function() { var p=[0,1,2,1,4,5,7,1]; renderPar(p,{1:'active',7:'changed'}); infoEl.innerHTML='union(3,7): find(3)=1, find(7)=7. parent[7]=1. {1,3,7,6} 같은 집합.'; },
              undo: function() { var p=[0,1,2,1,4,5,7,7]; renderPar(p); infoEl.innerHTML='union(7,6): parent[6]=7. {7,6} 같은 집합.'; }
            },
            { description: 'find(6): 6→7→1 경로 압축! parent[6]=1',
              action: function() { var p=[0,1,2,1,4,5,1,1]; renderPar(p,{6:'changed',1:'active'}); infoEl.innerHTML='find(6): 6→7→1. <strong>경로 압축!</strong> parent[6]=1 직접 연결.'; },
              undo: function() { var p=[0,1,2,1,4,5,7,1]; renderPar(p); infoEl.innerHTML='union(3,7): parent[7]=1. {1,3,7,6} 같은 집합.'; }
            },
            { description: 'find(1)==find(6)? → 1==1 → YES ✅',
              action: function() { var p=[0,1,2,1,4,5,1,1]; renderPar(p,{1:'active',6:'active'}); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.05rem;">✅ find(1)=1, find(6)=1 → 같은 집합! YES</strong>'; },
              undo: function() { var p=[0,1,2,1,4,5,1,1]; renderPar(p,{6:'changed',1:'active'}); infoEl.innerHTML='find(6): 경로 압축으로 parent[6]=1.'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 2: 여행 가자 (boj-1976)
    // ====================================================================
    _renderVizTravel: function(container) {
        var self = this, suffix = '-travel';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">여행 가자 — 연결 요소 판별</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">3개 도시, 여행경로 1→2→3. 연결: 1-2, 2-3</p>' +
            '<div id="tv-par' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="tv-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var parEl = container.querySelector('#tv-par' + suffix);
        var infoEl = container.querySelector('#tv-info' + suffix);
        function renderPar(par, highlights) {
            highlights = highlights || {};
            var html = '';
            for (var i = 1; i <= 3; i++) {
                var cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += '<div class="' + cls + '" style="min-width:56px;text-align:center;">' +
                    '<div style="font-size:0.7rem;color:var(--text3);">p[' + i + ']</div>' +
                    '<div style="font-weight:700;font-size:1.05rem;">' + par[i] + '</div></div>';
            }
            parEl.innerHTML = html;
        }
        var p0 = [0,1,2,3];
        renderPar(p0);
        infoEl.innerHTML = '<span style="color:var(--text2);">3개 도시를 각각 초기화합니다.</span>';
        var steps = [
            { description: '인접행렬: 1-2 연결 → union(1,2)',
              action: function() { var p=[0,1,1,3]; renderPar(p,{1:'active',2:'changed'}); infoEl.innerHTML='union(1,2): parent[2]=1. 도시 1과 2가 연결됩니다.'; },
              undo: function() { renderPar(p0); infoEl.innerHTML='<span style="color:var(--text2);">3개 도시를 각각 초기화합니다.</span>'; }
            },
            { description: '인접행렬: 2-3 연결 → union(2,3): find(2)=1, parent[3]=1',
              action: function() { var p=[0,1,1,1]; renderPar(p,{1:'active',3:'changed'}); infoEl.innerHTML='union(2,3): find(2)=1, find(3)=3. parent[3]=1. 모든 도시가 연결!'; },
              undo: function() { var p=[0,1,1,3]; renderPar(p); infoEl.innerHTML='union(1,2): parent[2]=1. 도시 1과 2가 연결됩니다.'; }
            },
            { description: '여행 경로 확인: find(1)=1, find(2)=1, find(3)=1',
              action: function() { var p=[0,1,1,1]; renderPar(p,{1:'active',2:'active',3:'active'}); infoEl.innerHTML='모든 여행 도시의 대표가 <strong>1</strong>로 같습니다!'; },
              undo: function() { var p=[0,1,1,1]; renderPar(p); infoEl.innerHTML='union(2,3): 모든 도시가 연결!'; }
            },
            { description: '결과: 모든 도시가 같은 집합 → YES ✅',
              action: function() { var p=[0,1,1,1]; renderPar(p,{1:'active',2:'active',3:'active'}); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.05rem;">✅ 여행 가능! YES</strong>'; },
              undo: function() { var p=[0,1,1,1]; renderPar(p,{1:'active',2:'active',3:'active'}); infoEl.innerHTML='모든 여행 도시의 대표가 1로 같습니다!'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 3: 섬의 개수 (lc-200)
    // ====================================================================
    _renderVizIslands: function(container) {
        var self = this, suffix = '-island';
        var grid = [
            ['1','1','0','0'],
            ['1','0','0','1'],
            ['0','0','1','1']
        ];
        var R = 3, C = 4;
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">섬의 개수 — 격자 Union-Find</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">3x4 격자에서 인접한 \'1\' 칸을 union하여 섬 개수를 셉니다.</p>' +
            '<div id="is-grid' + suffix + '" style="display:inline-grid;grid-template-columns:repeat(4,48px);gap:4px;margin-bottom:12px;"></div>' +
            '<div id="is-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var gridEl = container.querySelector('#is-grid' + suffix);
        var infoEl = container.querySelector('#is-info' + suffix);
        function renderGrid(parent, highlights) {
            highlights = highlights || {};
            var colors = ['var(--accent)', 'var(--green)', '#e17055', '#fdcb6e', '#6c5ce7'];
            // group roots to colors
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
        function findRoot(par, x) {
            while (par[x] !== x) x = par[x];
            return x;
        }
        // Initial parent: each cell is own parent
        var initPar = []; for (var i = 0; i < R*C; i++) initPar[i] = i;
        renderGrid(null);
        infoEl.innerHTML = '<span style="color:var(--text2);">\'1\' 칸 수 = 6 → 초기 섬 개수 = 6</span>';
        var steps = [
            { description: '초기: \'1\' 칸 6개. 각각 독립된 섬. count=6',
              action: function() { renderGrid(initPar.slice()); infoEl.innerHTML = '각 \'1\' 칸이 독립적인 섬. <strong>count = 6</strong>'; },
              undo: function() { renderGrid(null); infoEl.innerHTML = '<span style="color:var(--text2);">\'1\' 칸 수 = 6 → 초기 섬 개수 = 6</span>'; }
            },
            { description: 'union(0,1): (0,0)과 (0,1) 합침. count=5',
              action: function() { var p=initPar.slice(); p[1]=0; renderGrid(p,{0:true,1:true}); infoEl.innerHTML='(0,0)↔(0,1) union! <strong>count = 5</strong>'; },
              undo: function() { renderGrid(initPar.slice()); infoEl.innerHTML='각 \'1\' 칸이 독립적인 섬. count = 6'; }
            },
            { description: 'union(0,4): (0,0)과 (1,0) 합침. count=4',
              action: function() { var p=initPar.slice(); p[1]=0; p[4]=0; renderGrid(p,{0:true,4:true}); infoEl.innerHTML='(0,0)↔(1,0) union! <strong>count = 4</strong>'; },
              undo: function() { var p=initPar.slice(); p[1]=0; renderGrid(p); infoEl.innerHTML='(0,0)↔(0,1) union! count = 5'; }
            },
            { description: 'union(7,11): (1,3)과 (2,3) 합침. count=3',
              action: function() { var p=initPar.slice(); p[1]=0; p[4]=0; p[11]=7; renderGrid(p,{7:true,11:true}); infoEl.innerHTML='(1,3)↔(2,3) union! <strong>count = 3</strong>'; },
              undo: function() { var p=initPar.slice(); p[1]=0; p[4]=0; renderGrid(p); infoEl.innerHTML='(0,0)↔(1,0) union! count = 4'; }
            },
            { description: 'union(10,11): (2,2)와 (2,3) 합침. count=2. find(11)=7 → union(10,7)',
              action: function() { var p=initPar.slice(); p[1]=0; p[4]=0; p[11]=7; p[10]=7; renderGrid(p,{10:true,11:true}); infoEl.innerHTML='(2,2)↔(2,3) union! <strong>count = 2</strong>'; },
              undo: function() { var p=initPar.slice(); p[1]=0; p[4]=0; p[11]=7; renderGrid(p); infoEl.innerHTML='(1,3)↔(2,3) union! count = 3'; }
            },
            { description: '완료! 섬 2개: {(0,0),(0,1),(1,0)}과 {(1,3),(2,2),(2,3)}',
              action: function() { var p=initPar.slice(); p[1]=0; p[4]=0; p[11]=7; p[10]=7; renderGrid(p); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.05rem;">✅ 정답: 섬 2개</strong>'; },
              undo: function() { var p=initPar.slice(); p[1]=0; p[4]=0; p[11]=7; p[10]=7; renderGrid(p,{10:true,11:true}); infoEl.innerHTML='(2,2)↔(2,3) union! count = 2'; }
            }
        ];
        self._initStepController(container, steps, suffix);
    },

    // ====================================================================
    // 시뮬레이션 4: 친구 네트워크 (boj-4195)
    // ====================================================================
    _renderVizFriendNet: function(container) {
        var self = this, suffix = '-friend';
        container.innerHTML =
            '<h3 style="margin-bottom:8px;">친구 네트워크 — 집합 크기 추적</h3>' +
            '<p style="color:var(--text2);margin-bottom:12px;">이름→번호 매핑 + size 배열로 네트워크 크기를 추적합니다.</p>' +
            '<div id="fn-names' + suffix + '" style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;"></div>' +
            '<div id="fn-info' + suffix + '" style="padding:10px;background:var(--bg);border-radius:8px;text-align:center;margin-bottom:12px;min-height:36px;"></div>' +
            self._createStepControls(suffix);
        var namesEl = container.querySelector('#fn-names' + suffix);
        var infoEl = container.querySelector('#fn-info' + suffix);
        var names = ['Fred', 'Barney', 'Betty', 'Wilma'];
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
                    '<div style="font-weight:700;font-size:1rem;">p=' + par[id] + ' s=' + sz[findR(par,id)] + '</div></div>';
            }
            namesEl.innerHTML = html;
        }
        function findR(par, x) { while (par[x] !== x) x = par[x]; return x; }
        namesEl.innerHTML = '';
        infoEl.innerHTML = '<span style="color:var(--text2);">친구 관계를 하나씩 추가합니다.</span>';
        var steps = [
            { description: 'Fred-Barney: union → 네트워크 크기 = 2',
              action: function() { var nm={Fred:0,Barney:1}; var p=[0,0]; var s=[2,1]; renderNames(p,s,nm,{0:'active',1:'changed'}); infoEl.innerHTML='Fred↔Barney union! 네트워크 크기 = <strong>2</strong>'; },
              undo: function() { namesEl.innerHTML=''; infoEl.innerHTML='<span style="color:var(--text2);">친구 관계를 하나씩 추가합니다.</span>'; }
            },
            { description: 'Barney-Betty: find(Barney)=Fred → union(Fred,Betty) → 크기 = 3',
              action: function() { var nm={Fred:0,Barney:1,Betty:2}; var p=[0,0,0]; var s=[3,1,1]; renderNames(p,s,nm,{0:'active',2:'changed'}); infoEl.innerHTML='Barney↔Betty: find(Barney)=Fred. union(Fred,Betty). 크기 = <strong>3</strong>'; },
              undo: function() { var nm={Fred:0,Barney:1}; var p=[0,0]; var s=[2,1]; renderNames(p,s,nm); infoEl.innerHTML='Fred↔Barney union! 네트워크 크기 = 2'; }
            },
            { description: 'Betty-Wilma: find(Betty)=Fred → union(Fred,Wilma) → 크기 = 4',
              action: function() { var nm={Fred:0,Barney:1,Betty:2,Wilma:3}; var p=[0,0,0,0]; var s=[4,1,1,1]; renderNames(p,s,nm,{0:'active',3:'changed'}); infoEl.innerHTML='Betty↔Wilma: find(Betty)=Fred. union(Fred,Wilma). 크기 = <strong>4</strong>'; },
              undo: function() { var nm={Fred:0,Barney:1,Betty:2}; var p=[0,0,0]; var s=[3,1,1]; renderNames(p,s,nm); infoEl.innerHTML='Barney↔Betty: 크기 = 3'; }
            },
            { description: '완료! 출력: 2, 3, 4',
              action: function() { var nm={Fred:0,Barney:1,Betty:2,Wilma:3}; var p=[0,0,0,0]; var s=[4,1,1,1]; renderNames(p,s,nm); infoEl.innerHTML='<strong style="color:var(--green);font-size:1.05rem;">✅ 출력: 2 → 3 → 4</strong>'; },
              undo: function() { var nm={Fred:0,Barney:1,Betty:2,Wilma:3}; var p=[0,0,0,0]; var s=[4,1,1,1]; renderNames(p,s,nm,{0:'active',3:'changed'}); infoEl.innerHTML='Betty↔Wilma: 크기 = 4'; }
            }
        ];
        self._initStepController(container, steps, suffix);
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
            descriptionHTML: '<h3>문제</h3><p>초기에 n+1개의 집합 {0}, {1}, {2}, ..., {n}이 있습니다. 여기에 합집합 연산과, 두 원소가 같은 집합에 포함되어 있는지를 확인하는 연산을 수행합니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: n m (n&le;1,000,000, m&le;100,000)<br>이후 m줄: 0 a b (합집합) 또는 1 a b (같은 집합인지 확인)</p></div><div><h4>출력</h4><p>1로 시작하는 연산마다 같으면 YES, 다르면 NO를 출력합니다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>7 8\n0 1 3\n1 1 7\n0 7 6\n1 7 1\n0 3 7\n0 4 2\n0 1 1\n1 1 1</pre></div><div><strong>출력</strong><pre>NO\nNO\nYES</pre></div></div></div>',
            hints: [
                { title: '어떤 자료구조를 쓸까?', content: '합집합(union)과 같은 집합 확인(find)을 빠르게 해야 합니다. 바로 <strong>유니온 파인드(Disjoint Set)</strong>입니다!' },
                { title: '핵심 아이디어', content: 'parent 배열을 만들고, <strong>경로 압축</strong>이 있는 find와 <strong>랭크 기반</strong> union을 구현합니다.<br>0이면 union(a, b), 1이면 find(a) == find(b) 여부를 출력합니다.' },
                { title: '주의할 점', content: 'n이 최대 1,000,000이므로 <strong>sys.stdin.readline</strong>과 <strong>sys.setrecursionlimit</strong>을 사용해야 합니다.<br>또는 재귀 대신 반복문으로 find를 구현합니다.' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b:\n        return\n    if rank[a] < rank[b]:\n        a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]:\n        rank[a] += 1\n\nn, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)\n\nfor _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint parent[1000001], rnk[1000001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a == b) return;\n    if (rnk[a] < rnk[b]) swap(a, b);\n    parent[b] = a;\n    if (rnk[a] == rnk[b]) rnk[a]++;\n}\n\nint main() {\n    int n, m;\n    scanf("%d %d", &n, &m);\n    for (int i = 0; i <= n; i++) {\n        parent[i] = i;\n        rnk[i] = 0;\n    }\n    while (m--) {\n        int op, a, b;\n        scanf("%d %d %d", &op, &a, &b);\n        if (op == 0) unite(a, b);\n        else printf("%s\\n", find(a) == find(b) ? "YES" : "NO");\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[] parent, rank;\n\n    static int find(int x) {\n        if (parent[x] != x)\n            parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static void union(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return;\n        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }\n        parent[b] = a;\n        if (rank[a] == rank[b]) rank[a]++;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int n = Integer.parseInt(st.nextToken());\n        int m = Integer.parseInt(st.nextToken());\n        parent = new int[n + 1];\n        rank = new int[n + 1];\n        for (int i = 0; i <= n; i++) parent[i] = i;\n\n        for (int i = 0; i < m; i++) {\n            st = new StringTokenizer(br.readLine());\n            int op = Integer.parseInt(st.nextToken());\n            int a = Integer.parseInt(st.nextToken());\n            int b = Integer.parseInt(st.nextToken());\n            if (op == 0) union(a, b);\n            else sb.append(find(a) == find(b) ? "YES" : "NO").append("\\n");\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '경로 압축 + 랭크 기반 Union-Find',
                description: 'parent 배열과 rank 배열로 union/find를 구현합니다.',
                timeComplexity: 'O(m * α(n))',
                spaceComplexity: 'O(n)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', code: 'import sys\ninput = sys.stdin.readline\nsys.setrecursionlimit(200000)\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1' },
                        { title: '초기화', code: 'n, m = map(int, input().split())\nparent = list(range(n + 1))\nrank = [0] * (n + 1)' },
                        { title: '쿼리 처리', code: 'for _ in range(m):\n    op, a, b = map(int, input().split())\n    if op == 0:\n        union(a, b)\n    else:\n        print("YES" if find(a) == find(b) else "NO")' }
                    ]
                },
                get templates() { return unionFindTopic.problems[0].templates; }
            }]
        },
        {
            id: 'boj-1976', title: 'BOJ 1976 - 여행 가자', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1976',
            simIntro: '인접행렬로 도시를 union한 뒤, 여행 경로를 확인하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>N개의 도시가 있고, 도시 간 연결 정보가 주어집니다. M개의 도시를 순서대로 여행하려고 할 때, 여행이 가능한지 판단하세요.</p><p>연결된 도시 사이에는 어떤 경로로든 이동할 수 있습니다(직접 연결이 아니어도 됩니다).</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: N (도시 수, &le;200)<br>둘째 줄: M (여행 도시 수, &le;1000)<br>이후 N줄: N&times;N 인접행렬 (1이면 연결)<br>마지막 줄: 여행할 M개 도시 번호</p></div><div><h4>출력</h4><p>여행 가능하면 YES, 불가능하면 NO</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>3\n3\n0 1 0\n1 0 1\n0 1 0\n1 2 3</pre></div><div><strong>출력</strong><pre>YES</pre></div></div></div>',
            hints: [
                { title: '핵심 관찰', content: '여행 경로의 모든 도시가 <strong>같은 연결 요소</strong>에 있으면 여행이 가능합니다! 경로가 어떻든 연결만 되어 있으면 됩니다.' },
                { title: '어떤 자료구조를 쓸까?', content: '인접 행렬에서 연결된 도시 쌍을 모두 <strong>union</strong>합니다.<br>여행 도시들의 <strong>find</strong> 값이 모두 같으면 YES입니다.' },
                { title: '구현 순서', content: '① parent 배열 초기화<br>② 인접 행렬을 읽으며 1인 쌍을 union<br>③ 여행 도시를 읽고 모든 도시의 find 값이 같은지 확인' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        parent[b] = a\n\nN = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1:\n            union(i, j + 1)\n\ncities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint parent[201];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nvoid unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) parent[b] = a;\n}\n\nint main() {\n    int N, M;\n    scanf("%d %d", &N, &M);\n    for (int i = 1; i <= N; i++) parent[i] = i;\n\n    for (int i = 1; i <= N; i++) {\n        for (int j = 1; j <= N; j++) {\n            int v;\n            scanf("%d", &v);\n            if (v == 1) unite(i, j);\n        }\n    }\n\n    int first, city;\n    scanf("%d", &first);\n    bool ok = true;\n    for (int i = 1; i < M; i++) {\n        scanf("%d", &city);\n        if (find(city) != find(first)) ok = false;\n    }\n    printf("%s\\n", ok ? "YES" : "NO");\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[] parent;\n\n    static int find(int x) {\n        if (parent[x] != x)\n            parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static void union(int a, int b) {\n        a = find(a); b = find(b);\n        if (a != b) parent[b] = a;\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        int N = Integer.parseInt(br.readLine().trim());\n        int M = Integer.parseInt(br.readLine().trim());\n        parent = new int[N + 1];\n        for (int i = 1; i <= N; i++) parent[i] = i;\n\n        for (int i = 1; i <= N; i++) {\n            StringTokenizer st = new StringTokenizer(br.readLine());\n            for (int j = 1; j <= N; j++) {\n                if (Integer.parseInt(st.nextToken()) == 1)\n                    union(i, j);\n            }\n        }\n\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int first = Integer.parseInt(st.nextToken());\n        boolean ok = true;\n        for (int i = 1; i < M; i++) {\n            int city = Integer.parseInt(st.nextToken());\n            if (find(city) != find(first)) ok = false;\n        }\n        System.out.println(ok ? "YES" : "NO");\n    }\n}'
            },
            solutions: [{
                approach: '인접행렬 + Union-Find',
                description: '인접행렬에서 연결된 도시를 union하고, 여행 도시의 find 값이 모두 같은지 확인합니다.',
                timeComplexity: 'O(N^2 * α(N))',
                spaceComplexity: 'O(N)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', code: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b: parent[b] = a' },
                        { title: '입력 및 인접행렬 union', code: 'N = int(input())\nM = int(input())\nparent = list(range(N + 1))\n\nfor i in range(1, N + 1):\n    row = list(map(int, input().split()))\n    for j in range(N):\n        if row[j] == 1: union(i, j + 1)' },
                        { title: '여행 가능 여부 확인', code: 'cities = list(map(int, input().split()))\nroot = find(cities[0])\nif all(find(c) == root for c in cities):\n    print("YES")\nelse:\n    print("NO")' }
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
            descriptionHTML: '<h3>문제</h3><p>2D 격자(grid)가 주어지고, \'1\'은 땅, \'0\'은 물입니다. 상하좌우로 연결된 \'1\'들이 하나의 섬(island)을 이룹니다.</p><p>격자에 있는 섬의 개수를 구하세요.</p><div class="problem-io"><div><h4>입력</h4><p>m x n 크기의 2D 격자 (grid[i][j]는 \'0\' 또는 \'1\')</p></div><div><h4>출력</h4><p>섬의 개수 (정수)</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>[["1","1","0","0","0"],\n ["1","1","0","0","0"],\n ["0","0","1","0","0"],\n ["0","0","0","1","1"]]</pre></div><div><strong>출력</strong><pre>3</pre></div></div></div>',
            hints: [
                { title: '접근 방법 선택', content: 'BFS/DFS로도 풀 수 있지만, <strong>유니온 파인드</strong>로도 풀 수 있습니다! 인접한 \'1\' 칸들을 union하고, 남은 집합 수 = 섬 개수입니다.' },
                { title: '유니온 파인드 풀이', content: '2D 좌표 (r, c)를 <code>r * cols + c</code>로 1D 인덱스로 변환합니다.<br>\'1\'인 칸을 순회하며, 오른쪽/아래 칸도 \'1\'이면 union합니다.' },
                { title: '섬 개수 세기', content: '모든 union이 끝난 후, \'1\'인 칸 중 <code>find(i) == i</code>인 칸의 수가 섬 개수입니다.<br>또는 초기 섬 수 = \'1\' 칸 수로 시작해서, union이 성공할 때마다 1씩 줄입니다.' }
            ],
            templates: {
                python: 'class Solution:\n    def numIslands(self, grid):\n        if not grid:\n            return 0\n        rows, cols = len(grid), len(grid[0])\n        parent = list(range(rows * cols))\n        rank = [0] * (rows * cols)\n\n        def find(x):\n            while parent[x] != x:\n                parent[x] = parent[parent[x]]\n                x = parent[x]\n            return x\n\n        def union(a, b):\n            a, b = find(a), find(b)\n            if a == b:\n                return False\n            if rank[a] < rank[b]:\n                a, b = b, a\n            parent[b] = a\n            if rank[a] == rank[b]:\n                rank[a] += 1\n            return True\n\n        count = sum(grid[r][c] == \'1\'\n                     for r in range(rows)\n                     for c in range(cols))\n\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == \'1\':\n                    idx = r * cols + c\n                    for dr, dc in [(0, 1), (1, 0)]:\n                        nr, nc = r + dr, c + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == \'1\':\n                            if union(idx, nr * cols + nc):\n                                count -= 1\n        return count',
                cpp: 'class Solution {\npublic:\n    vector<int> parent, rnk;\n\n    int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rnk[a] < rnk[b]) swap(a, b);\n        parent[b] = a;\n        if (rnk[a] == rnk[b]) rnk[a]++;\n        return true;\n    }\n\n    int numIslands(vector<vector<char>>& grid) {\n        int rows = grid.size(), cols = grid[0].size();\n        parent.resize(rows * cols);\n        rnk.resize(rows * cols, 0);\n        iota(parent.begin(), parent.end(), 0);\n\n        int count = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == \'1\') count++;\n\n        int dr[] = {0, 1}, dc[] = {1, 0};\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] == \'1\') {\n                    for (int d = 0; d < 2; d++) {\n                        int nr = r + dr[d], nc = c + dc[d];\n                        if (nr < rows && nc < cols && grid[nr][nc] == \'1\')\n                            if (unite(r * cols + c, nr * cols + nc))\n                                count--;\n                    }\n                }\n            }\n        }\n        return count;\n    }\n};',
                java: 'class Solution {\n    int[] parent, rank;\n\n    int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n\n    boolean union(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }\n        parent[b] = a;\n        if (rank[a] == rank[b]) rank[a]++;\n        return true;\n    }\n\n    public int numIslands(char[][] grid) {\n        int rows = grid.length, cols = grid[0].length;\n        parent = new int[rows * cols];\n        rank = new int[rows * cols];\n        for (int i = 0; i < rows * cols; i++) parent[i] = i;\n\n        int count = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == \'1\') count++;\n\n        int[] dr = {0, 1}, dc = {1, 0};\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                if (grid[r][c] == \'1\') {\n                    for (int d = 0; d < 2; d++) {\n                        int nr = r + dr[d], nc = c + dc[d];\n                        if (nr < rows && nc < cols && grid[nr][nc] == \'1\')\n                            if (union(r * cols + c, nr * cols + nc))\n                                count--;\n                    }\n                }\n            }\n        }\n        return count;\n    }\n}'
            },
            solutions: [{
                approach: 'Union-Find로 섬 세기',
                description: '인접한 \'1\' 칸을 union하고, union 성공시 count를 줄여 섬 개수를 구합니다.',
                timeComplexity: 'O(m * n * α(m*n))',
                spaceComplexity: 'O(m * n)',
                codeSteps: {
                    python: [
                        { title: 'find/union 구현', code: 'parent = list(range(rows * cols))\nrank = [0] * (rows * cols)\n\ndef find(x):\n    while parent[x] != x:\n        parent[x] = parent[parent[x]]\n        x = parent[x]\n    return x\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a == b: return False\n    if rank[a] < rank[b]: a, b = b, a\n    parent[b] = a\n    if rank[a] == rank[b]: rank[a] += 1\n    return True' },
                        { title: '초기 섬 수 계산', code: 'count = sum(grid[r][c] == \'1\'\n             for r in range(rows)\n             for c in range(cols))' },
                        { title: '인접 칸 union', code: 'for r in range(rows):\n    for c in range(cols):\n        if grid[r][c] == \'1\':\n            idx = r * cols + c\n            for dr, dc in [(0,1),(1,0)]:\n                nr, nc = r+dr, c+dc\n                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==\'1\':\n                    if union(idx, nr*cols+nc):\n                        count -= 1\nreturn count' }
                    ]
                },
                get templates() { return unionFindTopic.problems[2].templates; }
            }]
        },
        {
            id: 'boj-4195', title: 'BOJ 4195 - 친구 네트워크', difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/4195',
            simIntro: '이름→번호 매핑과 size 배열로 네트워크 크기를 추적하는 과정을 관찰하세요.',
            descriptionHTML: '<h3>문제</h3><p>소셜 네트워크에서 두 사람이 친구가 될 때마다, 두 사람이 속한 친구 네트워크의 크기를 출력합니다.</p><p>이름이 문자열로 주어지며, 친구의 친구도 같은 네트워크에 속합니다.</p><div class="problem-io"><div><h4>입력</h4><p>첫째 줄: T (테스트 케이스 수)<br>각 케이스: F (친구 관계 수, &le;100,000)<br>이후 F줄: 이름1 이름2 (두 사람이 친구가 됨)</p></div><div><h4>출력</h4><p>각 친구 관계마다, 두 사람이 속한 네트워크의 크기를 출력합니다.</p></div></div><div class="problem-example"><h4>예제</h4><div class="example-grid"><div><strong>입력</strong><pre>2\n3\nFred Barney\nBarney Betty\nBetty Wilma\n3\nFred Barney\nBetty Wilma\nBarney Betty</pre></div><div><strong>출력</strong><pre>2\n3\n4\n2\n2\n4</pre></div></div></div>',
            hints: [
                { title: '이름 → 숫자 매핑', content: '문자열 이름을 <strong>딕셔너리(HashMap)</strong>로 숫자에 매핑합니다. 새로운 이름이 나올 때마다 번호를 부여합니다.' },
                { title: '집합 크기 추적', content: 'parent 배열 외에 <strong>size 배열</strong>을 추가합니다! 루트 노드에 해당 집합의 크기를 저장합니다.<br>union 시 size를 합칩니다.' },
                { title: '구현 순서', content: '① 이름→번호 매핑 (dict)<br>② union 시 size[루트] 갱신<br>③ union 후 find(a)의 size를 출력' }
            ],
            templates: {
                python: 'import sys\ninput = sys.stdin.readline\n\ndef find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]:\n            a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]\n\nT = int(input())\nfor _ in range(T):\n    F = int(input())\n    parent = {}\n    size = {}\n    name_to_id = {}\n    idx = 0\n\n    for _ in range(F):\n        a, b = input().split()\n        if a not in name_to_id:\n            name_to_id[a] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        if b not in name_to_id:\n            name_to_id[b] = idx\n            parent[idx] = idx\n            size[idx] = 1\n            idx += 1\n        print(union(name_to_id[a], name_to_id[b]))',
                cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint parent[200001], sz[200001];\n\nint find(int x) {\n    if (parent[x] != x)\n        parent[x] = find(parent[x]);\n    return parent[x];\n}\n\nint unite(int a, int b) {\n    a = find(a); b = find(b);\n    if (a != b) {\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    return sz[a];\n}\n\nint main() {\n    int T;\n    scanf("%d", &T);\n    while (T--) {\n        int F;\n        scanf("%d", &F);\n        unordered_map<string, int> nameToId;\n        int idx = 0;\n        char a[21], b[21];\n\n        for (int i = 0; i < F; i++) {\n            scanf("%s %s", a, b);\n            string sa(a), sb(b);\n            if (nameToId.find(sa) == nameToId.end()) {\n                nameToId[sa] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            if (nameToId.find(sb) == nameToId.end()) {\n                nameToId[sb] = idx;\n                parent[idx] = idx;\n                sz[idx] = 1;\n                idx++;\n            }\n            printf("%d\\n", unite(nameToId[sa], nameToId[sb]));\n        }\n    }\n    return 0;\n}',
                java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static int[] parent, size;\n\n    static int find(int x) {\n        if (parent[x] != x)\n            parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static int union(int a, int b) {\n        a = find(a); b = find(b);\n        if (a != b) {\n            if (size[a] < size[b]) { int t = a; a = b; b = t; }\n            parent[b] = a;\n            size[a] += size[b];\n        }\n        return size[a];\n    }\n\n    public static void main(String[] args) throws Exception {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringBuilder sb = new StringBuilder();\n        int T = Integer.parseInt(br.readLine().trim());\n\n        while (T-- > 0) {\n            int F = Integer.parseInt(br.readLine().trim());\n            parent = new int[F * 2];\n            size = new int[F * 2];\n            Map<String, Integer> nameToId = new HashMap<>();\n            int idx = 0;\n\n            for (int i = 0; i < F; i++) {\n                StringTokenizer st = new StringTokenizer(br.readLine());\n                String a = st.nextToken(), b = st.nextToken();\n                if (!nameToId.containsKey(a)) {\n                    nameToId.put(a, idx);\n                    parent[idx] = idx;\n                    size[idx] = 1;\n                    idx++;\n                }\n                if (!nameToId.containsKey(b)) {\n                    nameToId.put(b, idx);\n                    parent[idx] = idx;\n                    size[idx] = 1;\n                    idx++;\n                }\n                sb.append(union(nameToId.get(a), nameToId.get(b))).append("\\n");\n            }\n        }\n        System.out.print(sb);\n    }\n}'
            },
            solutions: [{
                approach: '이름 매핑 + size 추적 Union-Find',
                description: '이름→번호 매핑 후 union 시 size 배열을 갱신하여 네트워크 크기를 출력합니다.',
                timeComplexity: 'O(F * α(F))',
                spaceComplexity: 'O(F)',
                codeSteps: {
                    python: [
                        { title: 'find/union with size', code: 'def find(x):\n    if parent[x] != x:\n        parent[x] = find(parent[x])\n    return parent[x]\n\ndef union(a, b):\n    a, b = find(a), find(b)\n    if a != b:\n        if size[a] < size[b]: a, b = b, a\n        parent[b] = a\n        size[a] += size[b]\n    return size[a]' },
                        { title: '이름→번호 매핑', code: 'name_to_id = {}\nidx = 0\nfor name in [a, b]:\n    if name not in name_to_id:\n        name_to_id[name] = idx\n        parent[idx] = idx\n        size[idx] = 1\n        idx += 1' },
                        { title: 'union 후 크기 출력', code: 'print(union(name_to_id[a], name_to_id[b]))' }
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
