// =========================================================
// 유니온 파인드 (Union-Find) 토픽 모듈
// =========================================================
const unionFindTopic = {
    id: 'unionfind',
    title: '유니온 파인드',
    icon: '🤝',
    category: '심화 선택',
    order: 21,
    description: '서로소 집합을 효율적으로 관리하는 자료구조',
    relatedNote: '유니온 파인드는 크루스칼 MST, 네트워크 연결성, 동적 연결 쿼리 등에 핵심적으로 사용됩니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
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

    _initConceptInteractions(container) {
        container.querySelectorAll('.think-box').forEach(box => {
            const trigger = box.querySelector('.think-box-trigger');
            const answer = box.querySelector('.think-box-answer');
            if (trigger && answer) {
                trigger.addEventListener('click', () => {
                    answer.classList.toggle('show');
                    trigger.textContent = answer.classList.contains('show') ? '🔼 접기' : '🤔 생각해보고 클릭!';
                });
            }
        });
        container.querySelectorAll('pre code').forEach(el => {
            if (window.hljs) hljs.highlightElement(el);
        });
    },

    // ===== 시각화 탭 =====
    renderVisualize(container) {
        this._clearVizState();

        container.innerHTML = `
            <div class="viz-card">
                <h3>Union-Find 연산 시각화</h3>
                <p style="color:var(--text2);margin-bottom:12px;">6개 노드(1~6)에서 union/find 연산을 단계별로 확인합니다.</p>
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button class="btn btn-primary" id="uf-start-btn">시각화 시작</button>
                </div>
                <div style="margin-bottom:12px;">
                    <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">parent 배열</div>
                    <div id="uf-parent-display" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
                </div>
                <div style="margin-bottom:12px;">
                    <div style="font-weight:600;margin-bottom:4px;font-size:0.9rem;">트리 구조</div>
                    <div id="uf-tree-display" style="min-height:160px;background:var(--bg);border-radius:var(--radius);padding:12px;font-family:var(--font-mono, monospace);white-space:pre;line-height:1.6;font-size:0.92rem;"></div>
                </div>
                <div id="uf-info" style="padding:10px;background:var(--bg);border-radius:var(--radius);min-height:36px;text-align:center;"></div>
                ${this._createStepControls()}
            </div>
            <div class="graph-legend" style="margin-top:12px;">
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--card);border:2px solid var(--border);vertical-align:middle;"></span> 개별 노드</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--yellow);border:2px solid var(--yellow-vivid, #f9a825);vertical-align:middle;"></span> 현재 처리 중</span>
                <span><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--accent-vivid, #6c5ce7);border:2px solid var(--accent2, #a29bfe);vertical-align:middle;"></span> 합쳐진 집합</span>
            </div>
        `;

        const self = this;
        const parentDisplay = container.querySelector('#uf-parent-display');
        const treeDisplay = container.querySelector('#uf-tree-display');
        const infoEl = container.querySelector('#uf-info');

        function renderParent(par, highlights) {
            highlights = highlights || {};
            let html = '';
            for (let i = 1; i <= 6; i++) {
                let cls = 'str-char-box';
                if (highlights[i] === 'active') cls += ' active';
                else if (highlights[i] === 'changed') cls += ' highlight';
                html += `<div class="${cls}" style="min-width:48px;text-align:center;">
                    <div style="font-size:0.75rem;color:var(--text3);">p[${i}]</div>
                    <div style="font-weight:700;font-size:1.05rem;">${par[i]}</div>
                </div>`;
            }
            parentDisplay.innerHTML = html;
        }

        function buildTreeText(par) {
            // Build children map
            const children = {};
            const roots = [];
            for (let i = 1; i <= 6; i++) children[i] = [];
            for (let i = 1; i <= 6; i++) {
                if (par[i] === i) roots.push(i);
                else children[par[i]].push(i);
            }

            let text = '';
            roots.forEach((root, ri) => {
                if (ri > 0) text += '\n';
                text += renderNode(root, '', true);
            });
            return text;

            function renderNode(node, prefix, isLast) {
                let line = '';
                if (prefix === '') {
                    line = `[${node}] (루트)\n`;
                } else {
                    line = prefix + (isLast ? '└── ' : '├── ') + `[${node}]\n`;
                }
                const kids = children[node];
                kids.forEach((child, ci) => {
                    const childPrefix = prefix === '' ? '    ' : prefix + (isLast ? '    ' : '│   ');
                    line += renderNode(child, childPrefix, ci === kids.length - 1);
                });
                return line;
            }
        }

        function renderTree(par) {
            treeDisplay.textContent = buildTreeText(par);
        }

        // Initialize
        const initPar = [0, 1, 2, 3, 4, 5, 6];
        renderParent(initPar);
        renderTree(initPar);
        infoEl.innerHTML = '<span style="color:var(--text2)">시작 버튼을 눌러 Union-Find 연산을 확인하세요.</span>';

        container.querySelector('#uf-start-btn').addEventListener('click', function() {
            self._clearVizState();

            const steps = [];

            // We'll track parent states for undo/action
            // Operations: union(1,2), union(3,4), union(5,6), union(1,3), find(4), union(1,5)

            // State 0: initial
            const s0 = [0, 1, 2, 3, 4, 5, 6];
            renderParent(s0);
            renderTree(s0);
            infoEl.innerHTML = '<span style="color:var(--text2)">6개 노드가 각각 독립된 집합입니다. parent[i] = i</span>';

            // Step 1: union(1, 2) → parent[2] = 1
            steps.push({
                description: 'union(1, 2): 노드 1과 2를 합칩니다. parent[2] = 1',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 2, 3, 4, 5, 6];
                    const par = [0, 1, 1, 3, 4, 5, 6];
                    renderParent(par, {1: 'active', 2: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 2): 2의 부모를 1로 변경합니다. {1, 2}가 같은 집합이 됩니다.';
                },
                undo() {
                    renderParent(this._prevPar);
                    renderTree(this._prevPar);
                    infoEl.innerHTML = '<span style="color:var(--text2)">6개 노드가 각각 독립된 집합입니다.</span>';
                }
            });

            // Step 2: union(3, 4) → parent[4] = 3
            steps.push({
                description: 'union(3, 4): 노드 3과 4를 합칩니다. parent[4] = 3',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 3, 4, 5, 6];
                    const par = [0, 1, 1, 3, 3, 5, 6];
                    renderParent(par, {3: 'active', 4: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(3, 4): 4의 부모를 3으로 변경합니다. {3, 4}가 같은 집합이 됩니다.';
                },
                undo() {
                    const par = [0, 1, 1, 3, 4, 5, 6];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 2): 2의 부모를 1로 변경합니다. {1, 2}가 같은 집합이 됩니다.';
                }
            });

            // Step 3: union(5, 6) → parent[6] = 5
            steps.push({
                description: 'union(5, 6): 노드 5와 6을 합칩니다. parent[6] = 5',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 3, 3, 5, 6];
                    const par = [0, 1, 1, 3, 3, 5, 5];
                    renderParent(par, {5: 'active', 6: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(5, 6): 6의 부모를 5로 변경합니다. {5, 6}이 같은 집합이 됩니다.';
                },
                undo() {
                    const par = [0, 1, 1, 3, 3, 5, 6];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = 'union(3, 4): 4의 부모를 3으로 변경합니다. {3, 4}가 같은 집합이 됩니다.';
                }
            });

            // Step 4: union(1, 3) → find(1)=1, find(3)=3, parent[3] = 1
            steps.push({
                description: 'union(1, 3): {1,2}와 {3,4}를 합칩니다. parent[3] = 1',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 3, 3, 5, 5];
                    const par = [0, 1, 1, 1, 3, 5, 5];
                    renderParent(par, {1: 'active', 3: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. 3의 부모를 1로 변경합니다. {1, 2, 3, 4}가 같은 집합이 됩니다.';
                },
                undo() {
                    const par = [0, 1, 1, 3, 3, 5, 5];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = 'union(5, 6): 6의 부모를 5로 변경합니다. {5, 6}이 같은 집합이 됩니다.';
                }
            });

            // Step 5: find(4) → 4→3→1 (경로 압축: parent[4]=1)
            steps.push({
                description: 'find(4): 4→3→1 경로를 따라 루트 1을 찾습니다. 경로 압축으로 parent[4] = 1',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 1, 3, 5, 5];
                    const par = [0, 1, 1, 1, 1, 5, 5];
                    renderParent(par, {4: 'changed', 1: 'active'});
                    renderTree(par);
                    infoEl.innerHTML = 'find(4): 4→3→1 경로를 따라갑니다. <strong>경로 압축!</strong> parent[4]을 1로 직접 연결합니다. 다음 find(4)는 바로 1을 반환합니다.';
                },
                undo() {
                    const par = [0, 1, 1, 1, 3, 5, 5];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 3): find(1)=1, find(3)=3. 3의 부모를 1로 변경합니다. {1, 2, 3, 4}가 같은 집합이 됩니다.';
                }
            });

            // Step 6: union(1, 5) → find(1)=1, find(5)=5, parent[5] = 1
            steps.push({
                description: 'union(1, 5): {1,2,3,4}와 {5,6}을 합칩니다. parent[5] = 1',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 1, 1, 5, 5];
                    const par = [0, 1, 1, 1, 1, 1, 5];
                    renderParent(par, {1: 'active', 5: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 5): 5의 부모를 1로 변경합니다. 이제 <strong>모든 노드가 하나의 집합</strong>입니다!';
                },
                undo() {
                    const par = [0, 1, 1, 1, 1, 5, 5];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = 'find(4): 경로 압축으로 parent[4]을 1로 직접 연결합니다.';
                }
            });

            // Final step
            steps.push({
                description: '완료! 모든 노드가 루트 1 아래 하나의 집합으로 합쳐졌습니다.',
                _prevPar: null,
                action() {
                    this._prevPar = [0, 1, 1, 1, 1, 1, 5];
                    const par = [0, 1, 1, 1, 1, 1, 5];
                    renderParent(par);
                    renderTree(par);
                    infoEl.innerHTML = '<strong style="color:var(--green);font-size:1.05rem;">✅ 완료! 6개 노드가 모두 하나의 집합으로 합쳐졌습니다. 대표는 1입니다.</strong>';
                },
                undo() {
                    const par = [0, 1, 1, 1, 1, 1, 5];
                    renderParent(par, {1: 'active', 5: 'changed'});
                    renderTree(par);
                    infoEl.innerHTML = 'union(1, 5): 5의 부모를 1로 변경합니다. 이제 모든 노드가 하나의 집합입니다!';
                }
            });

            self._initStepController(container, steps);
        });
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
            title: '기본 유니온 파인드',
            desc: '유니온 파인드의 기본 구현과 집합 판별 (Gold IV~V)',
            problemIds: ['boj-1717', 'boj-1976']
        },
        {
            num: 2,
            title: '유니온 파인드 응용',
            desc: '섬 개수, 네트워크 크기 등 응용 문제 (Medium~Gold)',
            problemIds: ['lc-200', 'boj-4195']
        }
    ],

    problems: [
        // ===== 1단계: 기본 유니온 파인드 =====
        {
            id: 'boj-1717',
            title: 'BOJ 1717 - 집합의 표현',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1717',
            descriptionHTML: `
                <h3>문제</h3>
                <p>초기에 n+1개의 집합 {0}, {1}, {2}, ..., {n}이 있습니다.
                여기에 합집합 연산과, 두 원소가 같은 집합에 포함되어 있는지를 확인하는 연산을 수행합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: n m (n&le;1,000,000, m&le;100,000)<br>
                    이후 m줄: 0 a b (합집합) 또는 1 a b (같은 집합인지 확인)</p></div>
                    <div><h4>출력</h4>
                    <p>1로 시작하는 연산마다 같으면 YES, 다르면 NO를 출력합니다.</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7 8\n0 1 3\n1 1 7\n0 7 6\n1 7 1\n0 3 7\n0 4 2\n0 1 1\n1 1 1</pre></div>
                    <div><strong>출력</strong><pre>NO\nNO\nYES</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '어떤 자료구조를 쓸까?',
                    content: '합집합(union)과 같은 집합 확인(find)을 빠르게 해야 합니다. 바로 <strong>유니온 파인드(Disjoint Set)</strong>입니다!'
                },
                {
                    title: '핵심 아이디어',
                    content: 'parent 배열을 만들고, <strong>경로 압축</strong>이 있는 find와 <strong>랭크 기반</strong> union을 구현합니다.<br>0이면 union(a, b), 1이면 find(a) == find(b) 여부를 출력합니다.'
                },
                {
                    title: '주의할 점',
                    content: 'n이 최대 1,000,000이므로 <strong>sys.stdin.readline</strong>과 <strong>sys.setrecursionlimit</strong>을 사용해야 합니다.<br>또는 재귀 대신 반복문으로 find를 구현합니다.'
                }
            ],
            inputDefault: 0,
            solve() { return 'NO\nNO\nYES'; },
            templates: {
                python: `import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a == b:
        return
    if rank[a] < rank[b]:
        a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]:
        rank[a] += 1

n, m = map(int, input().split())
parent = list(range(n + 1))
rank = [0] * (n + 1)

for _ in range(m):
    op, a, b = map(int, input().split())
    if op == 0:
        union(a, b)
    else:
        print("YES" if find(a) == find(b) else "NO")`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int parent[1000001], rnk[1000001];

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) swap(a, b);
    parent[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
}

int main() {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i <= n; i++) {
        parent[i] = i;
        rnk[i] = 0;
    }
    while (m--) {
        int op, a, b;
        scanf("%d %d %d", &op, &a, &b);
        if (op == 0) unite(a, b);
        else printf("%s\\n", find(a) == find(b) ? "YES" : "NO");
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] parent, rank;

    static int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        int m = Integer.parseInt(st.nextToken());
        parent = new int[n + 1];
        rank = new int[n + 1];
        for (int i = 0; i <= n; i++) parent[i] = i;

        for (int i = 0; i < m; i++) {
            st = new StringTokenizer(br.readLine());
            int op = Integer.parseInt(st.nextToken());
            int a = Integer.parseInt(st.nextToken());
            int b = Integer.parseInt(st.nextToken());
            if (op == 0) union(a, b);
            else sb.append(find(a) == find(b) ? "YES" : "NO").append("\\n");
        }
        System.out.print(sb);
    }
}`
            }
        },
        {
            id: 'boj-1976',
            title: 'BOJ 1976 - 여행 가자',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/1976',
            descriptionHTML: `
                <h3>문제</h3>
                <p>N개의 도시가 있고, 도시 간 연결 정보가 주어집니다.
                M개의 도시를 순서대로 여행하려고 할 때, 여행이 가능한지 판단하세요.</p>
                <p>연결된 도시 사이에는 어떤 경로로든 이동할 수 있습니다(직접 연결이 아니어도 됩니다).</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: N (도시 수, &le;200)<br>
                    둘째 줄: M (여행 도시 수, &le;1000)<br>
                    이후 N줄: N×N 인접행렬 (1이면 연결)<br>
                    마지막 줄: 여행할 M개 도시 번호</p></div>
                    <div><h4>출력</h4>
                    <p>여행 가능하면 YES, 불가능하면 NO</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>3\n3\n0 1 0\n1 0 1\n0 1 0\n1 2 3</pre></div>
                    <div><strong>출력</strong><pre>YES</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '핵심 관찰',
                    content: '여행 경로의 모든 도시가 <strong>같은 연결 요소</strong>에 있으면 여행이 가능합니다! 경로가 어떻든 연결만 되어 있으면 됩니다.'
                },
                {
                    title: '어떤 자료구조를 쓸까?',
                    content: '인접 행렬에서 연결된 도시 쌍을 모두 <strong>union</strong>합니다.<br>여행 도시들의 <strong>find</strong> 값이 모두 같으면 YES입니다.'
                },
                {
                    title: '구현 순서',
                    content: '① parent 배열 초기화<br>② 인접 행렬을 읽으며 1인 쌍을 union<br>③ 여행 도시를 읽고 모든 도시의 find 값이 같은지 확인'
                }
            ],
            inputDefault: 0,
            solve() { return 'YES'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a != b:
        parent[b] = a

N = int(input())
M = int(input())
parent = list(range(N + 1))

for i in range(1, N + 1):
    row = list(map(int, input().split()))
    for j in range(N):
        if row[j] == 1:
            union(i, j + 1)

cities = list(map(int, input().split()))
root = find(cities[0])
if all(find(c) == root for c in cities):
    print("YES")
else:
    print("NO")`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int parent[201];

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) parent[b] = a;
}

int main() {
    int N, M;
    scanf("%d %d", &N, &M);
    for (int i = 1; i <= N; i++) parent[i] = i;

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            int v;
            scanf("%d", &v);
            if (v == 1) unite(i, j);
        }
    }

    int first, city;
    scanf("%d", &first);
    bool ok = true;
    for (int i = 1; i < M; i++) {
        scanf("%d", &city);
        if (find(city) != find(first)) ok = false;
    }
    printf("%s\\n", ok ? "YES" : "NO");
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] parent;

    static int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int a, int b) {
        a = find(a); b = find(b);
        if (a != b) parent[b] = a;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        int M = Integer.parseInt(br.readLine().trim());
        parent = new int[N + 1];
        for (int i = 1; i <= N; i++) parent[i] = i;

        for (int i = 1; i <= N; i++) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            for (int j = 1; j <= N; j++) {
                if (Integer.parseInt(st.nextToken()) == 1)
                    union(i, j);
            }
        }

        StringTokenizer st = new StringTokenizer(br.readLine());
        int first = Integer.parseInt(st.nextToken());
        boolean ok = true;
        for (int i = 1; i < M; i++) {
            int city = Integer.parseInt(st.nextToken());
            if (find(city) != find(first)) ok = false;
        }
        System.out.println(ok ? "YES" : "NO");
    }
}`
            }
        },

        // ===== 2단계: 유니온 파인드 응용 =====
        {
            id: 'lc-200',
            title: 'LeetCode 200 - Number of Islands',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/number-of-islands/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>2D 격자(grid)가 주어지고, '1'은 땅, '0'은 물입니다.
                상하좌우로 연결된 '1'들이 하나의 섬(island)을 이룹니다.</p>
                <p>격자에 있는 섬의 개수를 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>m x n 크기의 2D 격자 (grid[i][j]는 '0' 또는 '1')</p></div>
                    <div><h4>출력</h4>
                    <p>섬의 개수 (정수)</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[["1","1","0","0","0"],
 ["1","1","0","0","0"],
 ["0","0","1","0","0"],
 ["0","0","0","1","1"]]</pre></div>
                    <div><strong>출력</strong><pre>3</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '접근 방법 선택',
                    content: 'BFS/DFS로도 풀 수 있지만, <strong>유니온 파인드</strong>로도 풀 수 있습니다! 인접한 \'1\' 칸들을 union하고, 남은 집합 수 = 섬 개수입니다.'
                },
                {
                    title: '유니온 파인드 풀이',
                    content: '2D 좌표 (r, c)를 <code>r * cols + c</code>로 1D 인덱스로 변환합니다.<br>\'1\'인 칸을 순회하며, 오른쪽/아래 칸도 \'1\'이면 union합니다.'
                },
                {
                    title: '섬 개수 세기',
                    content: '모든 union이 끝난 후, \'1\'인 칸 중 <code>find(i) == i</code>인 칸의 수가 섬 개수입니다.<br>또는 초기 섬 수 = \'1\' 칸 수로 시작해서, union이 성공할 때마다 1씩 줄입니다.'
                }
            ],
            inputDefault: 0,
            solve() { return '3'; },
            templates: {
                python: `class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0
        rows, cols = len(grid), len(grid[0])
        parent = list(range(rows * cols))
        rank = [0] * (rows * cols)

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a, b):
            a, b = find(a), find(b)
            if a == b:
                return False
            if rank[a] < rank[b]:
                a, b = b, a
            parent[b] = a
            if rank[a] == rank[b]:
                rank[a] += 1
            return True

        count = sum(grid[r][c] == '1'
                     for r in range(rows)
                     for c in range(cols))

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    idx = r * cols + c
                    for dr, dc in [(0, 1), (1, 0)]:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            if union(idx, nr * cols + nc):
                                count -= 1
        return count`,
                cpp: `class Solution {
public:
    vector<int> parent, rnk;

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rnk[a] < rnk[b]) swap(a, b);
        parent[b] = a;
        if (rnk[a] == rnk[b]) rnk[a]++;
        return true;
    }

    int numIslands(vector<vector<char>>& grid) {
        int rows = grid.size(), cols = grid[0].size();
        parent.resize(rows * cols);
        rnk.resize(rows * cols, 0);
        iota(parent.begin(), parent.end(), 0);

        int count = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (grid[r][c] == '1') count++;

        int dr[] = {0, 1}, dc[] = {1, 0};
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    for (int d = 0; d < 2; d++) {
                        int nr = r + dr[d], nc = c + dc[d];
                        if (nr < rows && nc < cols && grid[nr][nc] == '1')
                            if (unite(r * cols + c, nr * cols + nc))
                                count--;
                    }
                }
            }
        }
        return count;
    }
};`,
                java: `class Solution {
    int[] parent, rank;

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    boolean union(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank[a] < rank[b]) { int t = a; a = b; b = t; }
        parent[b] = a;
        if (rank[a] == rank[b]) rank[a]++;
        return true;
    }

    public int numIslands(char[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        parent = new int[rows * cols];
        rank = new int[rows * cols];
        for (int i = 0; i < rows * cols; i++) parent[i] = i;

        int count = 0;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (grid[r][c] == '1') count++;

        int[] dr = {0, 1}, dc = {1, 0};
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    for (int d = 0; d < 2; d++) {
                        int nr = r + dr[d], nc = c + dc[d];
                        if (nr < rows && nc < cols && grid[nr][nc] == '1')
                            if (union(r * cols + c, nr * cols + nc))
                                count--;
                    }
                }
            }
        }
        return count;
    }
}`
            }
        },
        {
            id: 'boj-4195',
            title: 'BOJ 4195 - 친구 네트워크',
            difficulty: 'gold',
            link: 'https://www.acmicpc.net/problem/4195',
            descriptionHTML: `
                <h3>문제</h3>
                <p>소셜 네트워크에서 두 사람이 친구가 될 때마다, 두 사람이 속한 친구 네트워크의 크기를 출력합니다.</p>
                <p>이름이 문자열로 주어지며, 친구의 친구도 같은 네트워크에 속합니다.</p>
                <div class="problem-io">
                    <div><h4>입력</h4>
                    <p>첫째 줄: T (테스트 케이스 수)<br>
                    각 케이스: F (친구 관계 수, &le;100,000)<br>
                    이후 F줄: 이름1 이름2 (두 사람이 친구가 됨)</p></div>
                    <div><h4>출력</h4>
                    <p>각 친구 관계마다, 두 사람이 속한 네트워크의 크기를 출력합니다.</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>2\n3\nFred Barney\nBarney Betty\nBetty Wilma\n3\nFred Barney\nBetty Wilma\nBarney Betty</pre></div>
                    <div><strong>출력</strong><pre>2\n3\n4\n2\n2\n4</pre></div>
                </div></div>
            `,
            hints: [
                {
                    title: '이름 → 숫자 매핑',
                    content: '문자열 이름을 <strong>딕셔너리(HashMap)</strong>로 숫자에 매핑합니다. 새로운 이름이 나올 때마다 번호를 부여합니다.'
                },
                {
                    title: '집합 크기 추적',
                    content: 'parent 배열 외에 <strong>size 배열</strong>을 추가합니다! 루트 노드에 해당 집합의 크기를 저장합니다.<br>union 시 size를 합칩니다.'
                },
                {
                    title: '구현 순서',
                    content: '① 이름→번호 매핑 (dict)<br>② union 시 size[루트] 갱신<br>③ union 후 find(a)의 size를 출력'
                }
            ],
            inputDefault: 0,
            solve() { return '2\n3\n4\n2\n2\n4'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a, b):
    a, b = find(a), find(b)
    if a != b:
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
    return size[a]

T = int(input())
for _ in range(T):
    F = int(input())
    parent = {}
    size = {}
    name_to_id = {}
    idx = 0

    for _ in range(F):
        a, b = input().split()
        if a not in name_to_id:
            name_to_id[a] = idx
            parent[idx] = idx
            size[idx] = 1
            idx += 1
        if b not in name_to_id:
            name_to_id[b] = idx
            parent[idx] = idx
            size[idx] = 1
            idx += 1
        print(union(name_to_id[a], name_to_id[b]))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int parent[200001], sz[200001];

int find(int x) {
    if (parent[x] != x)
        parent[x] = find(parent[x]);
    return parent[x];
}

int unite(int a, int b) {
    a = find(a); b = find(b);
    if (a != b) {
        if (sz[a] < sz[b]) swap(a, b);
        parent[b] = a;
        sz[a] += sz[b];
    }
    return sz[a];
}

int main() {
    int T;
    scanf("%d", &T);
    while (T--) {
        int F;
        scanf("%d", &F);
        unordered_map<string, int> nameToId;
        int idx = 0;
        char a[21], b[21];

        for (int i = 0; i < F; i++) {
            scanf("%s %s", a, b);
            string sa(a), sb(b);
            if (nameToId.find(sa) == nameToId.end()) {
                nameToId[sa] = idx;
                parent[idx] = idx;
                sz[idx] = 1;
                idx++;
            }
            if (nameToId.find(sb) == nameToId.end()) {
                nameToId[sb] = idx;
                parent[idx] = idx;
                sz[idx] = 1;
                idx++;
            }
            printf("%d\\n", unite(nameToId[sa], nameToId[sb]));
        }
    }
    return 0;
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] parent, size;

    static int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    static int union(int a, int b) {
        a = find(a); b = find(b);
        if (a != b) {
            if (size[a] < size[b]) { int t = a; a = b; b = t; }
            parent[b] = a;
            size[a] += size[b];
        }
        return size[a];
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        int T = Integer.parseInt(br.readLine().trim());

        while (T-- > 0) {
            int F = Integer.parseInt(br.readLine().trim());
            parent = new int[F * 2];
            size = new int[F * 2];
            Map<String, Integer> nameToId = new HashMap<>();
            int idx = 0;

            for (int i = 0; i < F; i++) {
                StringTokenizer st = new StringTokenizer(br.readLine());
                String a = st.nextToken(), b = st.nextToken();
                if (!nameToId.containsKey(a)) {
                    nameToId.put(a, idx);
                    parent[idx] = idx;
                    size[idx] = 1;
                    idx++;
                }
                if (!nameToId.containsKey(b)) {
                    nameToId.put(b, idx);
                    parent[idx] = idx;
                    size[idx] = 1;
                    idx++;
                }
                sb.append(union(nameToId.get(a), nameToId.get(b))).append("\\n");
            }
        }
        System.out.print(sb);
    }
}`
            }
        }
    ],

    // ===== 문제 목록 렌더링 =====
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
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                const btn = document.createElement('button');
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
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
        backBtn.className = 'btn'; backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLC = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
        container.appendChild(descDiv);

        const hintsSection = document.createElement('div');
        hintsSection.className = 'hints-section';
        hintsSection.innerHTML = '<h3>단계별 힌트</h3>';
        const hintsDiv = document.createElement('div');
        hintsDiv.className = 'hints-steps';
        const openedState = {};

        problem.hints.forEach((hint, idx) => {
            const step = document.createElement('div');
            step.className = 'hint-step' + (idx > 0 ? ' locked' : '');
            step.innerHTML = `<div class="hint-step-header"><span class="hint-step-num">${idx + 1}</span><span class="hint-step-title">${hint.title}</span><span class="hint-step-toggle">▶</span></div><div class="hint-step-content">${hint.content}</div>`;
            step.querySelector('.hint-step-header').addEventListener('click', () => {
                if (step.classList.contains('locked')) return;
                step.classList.toggle('open');
                step.querySelector('.hint-step-toggle').textContent = step.classList.contains('open') ? '▼' : '▶';
                if (!openedState[idx]) { openedState[idx] = true; if (idx + 1 < problem.hints.length) { const ns = hintsDiv.children[idx + 1]; if (ns) ns.classList.remove('locked'); } }
            });
            hintsDiv.appendChild(step);
        });
        hintsSection.appendChild(hintsDiv);
        container.appendChild(hintsSection);

        const solveArea = document.createElement('div');
        solveArea.className = 'solve-area';
        solveArea.innerHTML = `
            <div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div>
            <textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea>
            <div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div>
            <div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>
        `;
        container.appendChild(solveArea);

        container.querySelectorAll('pre code').forEach(codeEl => { if (window.hljs) hljs.highlightElement(codeEl); });

        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; }
        });

        const site = isLC ? 'LeetCode' : 'BOJ';
        container.querySelector('#run-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`);
        });
        container.querySelector('#check-btn').addEventListener('click', () => {
            const expected = problem.solve(problem.inputDefault);
            this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`);
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
window.AlgoTopics.unionfind = unionFindTopic;
