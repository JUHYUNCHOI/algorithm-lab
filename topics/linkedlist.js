// =========================================================
// 연결 리스트 (Linked List) 토픽 모듈
// =========================================================
const linkedListTopic = {
    id: 'linkedlist',
    title: '연결 리스트',
    icon: '🔗',
    category: '기초 (Bronze~Silver)',
    order: 5,
    description: '노드와 포인터, 단일/이중 연결 리스트, 순환 탐지와 뒤집기',
    relatedNote: '이 외에도 이중 연결 리스트, LRU 캐시(해시맵+리스트), 스킵 리스트 등의 확장 개념이 있습니다.',

    sidebarExpandable: true,

    tabs: [{ id: 'concept', label: '학습하기' }],

    problemMeta: {
        'lc-206':   { type: '포인터 조작',  color: 'var(--accent)', vizMethod: '_renderVizReverse' },
        'lc-21':    { type: '병합 기법',    color: 'var(--green)',  vizMethod: '_renderVizMerge' },
        'lc-141':   { type: '사이클 탐지',  color: '#e17055',      vizMethod: '_renderVizCycle' },
        'boj-1158': { type: '원형 시뮬레이션', color: '#6c5ce7',   vizMethod: '_renderVizJosephus' }
    },

    getProblemTabs(problemId) {
        return [
            { id: 'problem', label: '문제', icon: '📋' },
            { id: 'think', label: '생각해볼것', icon: '💡' },
            { id: 'sim', label: '시뮬레이션', icon: '🎮' },
            { id: 'code', label: '코드', icon: '💻' }
        ];
    },

    renderProblemContent(container, problemId, tabId) {
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
            sim:     { intro: prob.simIntro || '힌트에서 배운 개념이 실제로 어떻게 동작하는지 확인해보세요.', icon: '🎮' },
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

    _renderProblemTab(contentEl, prob) {
        var isLC = prob.link.includes('leetcode');
        contentEl.innerHTML =
            prob.descriptionHTML +
            '<div style="text-align:right;margin-top:1.2rem;">' +
            '<a href="' + prob.link + '" target="_blank" class="btn" style="font-size:0.8rem;padding:6px 14px;color:var(--accent);border:1.5px solid var(--accent);border-radius:8px;text-decoration:none;display:inline-block;">' +
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>';
        contentEl.querySelectorAll('pre code').forEach(function(codeEl) { if (window.hljs) hljs.highlightElement(codeEl); });
    },

    _renderThinkTab(contentEl, prob) {
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
            (isLC ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗') + '</a></div>' +
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

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔗 연결 리스트 (Linked List)</h2>
                <p class="hero-sub">노드와 포인터로 연결된 동적 자료구조를 배워봅시다!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 연결 리스트란?</div>
                <div class="analogy-box">
                    보물찾기 게임을 해본 적 있나요? 첫 번째 쪽지에 힌트가 있고, 그걸 따라가면 다음 쪽지가 나오고, 또 따라가면 그다음 쪽지가 나오죠.
                    연결 리스트도 똑같아요! 각 칸에 <strong>데이터</strong>와 <strong>"다음 칸은 어디야?"</strong>라는 화살표가 들어 있어요.
                    첫 번째 칸에서 시작해서 화살표를 쭉 따라가면 전체를 볼 수 있어요!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">node</text></svg></div>
                        <h3>노드 (Node)</h3>
                        <p>쪽지 한 장이에요! 여기에 <strong>값</strong> 하나와 <strong>다음 쪽지가 어디 있는지</strong>가 적혀 있어요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">head</text></svg></div>
                        <h3>Head</h3>
                        <p>첫 번째 쪽지예요! 여기서부터 화살표를 따라가면 전체를 볼 수 있어요. 시작점만 알면 돼요!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">O(1)</text></svg></div>
                        <h3>삽입/삭제가 빠름</h3>
                        <p>중간에 새 쪽지를 끼워넣거나 빼는 건 화살표만 바꿔주면 돼요! 배열처럼 뒤에 있는 걸 밀 필요가 없어요.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">O(n)</text></svg></div>
                        <h3>접근이 느림</h3>
                        <p>5번째 쪽지를 보려면 1번부터 차례로 따라가야 해요. 배열처럼 "5번!" 하고 바로 갈 수가 없어요.</p>
                    </div>
                </div>
                <div class="comparison-table" style="margin-top:1.5rem;overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
                <thead><tr style="background:var(--bg2);">
                <th style="padding:10px;text-align:left;border:1px solid var(--bg3);">연산</th>
                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">배열 (Array)</th>
                <th style="padding:10px;text-align:center;border:1px solid var(--bg3);">연결 리스트</th>
                </tr></thead>
                <tbody>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">인덱스 접근</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) ✅</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — head부터 순회</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">앞에 삽입</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — 전부 밀어야 함</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) ✅</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">중간 삽입 (위치 알 때)</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — 뒤를 전부 밀어야</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) — 포인터만 변경</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">삭제 (위치 알 때)</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">O(n) — 뒤를 전부 당겨야</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">O(1) — 포인터만 변경</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">메모리</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);">연속된 공간 필요</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);">흩어져도 OK (포인터로 연결)</td></tr>
                <tr><td style="padding:10px;border:1px solid var(--bg3);font-weight:600;">캐시 성능</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--green);font-weight:600;">좋음 — 연속 메모리</td>
                <td style="padding:10px;text-align:center;border:1px solid var(--bg3);color:var(--red);font-weight:600;">나쁨 — 메모리 산재</td></tr>
                </tbody>
                </table>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🔍 왜 삽입/삭제가 O(1)일까? — 단계적으로 이해하기</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;"><strong>1. 배열에서 중간에 삽입하려면?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">[1, 2, <span style="color:var(--yellow);font-weight:600;">★</span>, 3, 4, 5] ← 3번 위치에 넣으려면 3, 4, 5를 전부 한 칸씩 뒤로 밀어야 합니다. 요소가 n개면 최대 n번 이동 → <strong style="color:var(--red);">O(n)</strong></p>
                        <p style="margin-top:0.8rem;margin-bottom:0.5rem;"><strong>2. 연결 리스트에서는?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">삽입할 위치의 노드를 이미 알고 있다면, <strong>포인터 2개만 바꾸면 끝</strong>입니다:<br>
                        ① 새 노드의 next → 다음 노드를 가리키게<br>
                        ② 이전 노드의 next → 새 노드를 가리키게</p>
                        <p style="margin-top:0.8rem;margin-bottom:0.5rem;"><strong>3. 그래서 왜 빠른가?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);">다른 노드를 <strong>전혀 건드리지 않아도</strong> 되니까! 100만 개의 노드가 있어도 포인터 2개만 바꾸면 삽입 완료 → <strong style="color:var(--green);">O(1)</strong></p>
                        <p style="margin-top:0.8rem;font-size:0.85rem;color:var(--text3);">⚠️ 단, "위치를 알 때"라는 조건이 중요! 위치를 모르면 먼저 찾아야 하므로 O(n)이 걸립니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 연결 리스트 노드 정의
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# 리스트 만들기: 1 → 2 → 3 → None
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

# 순회
node = head
while node:
    print(node.val, end=" → ")
    node = node.next
# 출력: 1 → 2 → 3 →</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 연결 리스트 노드 정의
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// 리스트 만들기: 1 → 2 → 3 → nullptr
ListNode* head = new ListNode(1);
head-&gt;next = new ListNode(2);
head-&gt;next-&gt;next = new ListNode(3);

// 순회
ListNode* node = head;
while (node) {
    cout &lt;&lt; node-&gt;val &lt;&lt; " → ";
    node = node-&gt;next;
}
// 출력: 1 → 2 → 3 →</code></pre>
                </div></span>
                <div style="margin-top:0.5rem;">
                    <span class="lang-py"><a href="https://docs.python.org/3/tutorial/classes.html" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">Python 공식 문서: 클래스(class) ↗</a></span><span class="lang-cpp"><a href="https://en.cppreference.com/w/cpp/language/nullptr" target="_blank" style="font-size:0.85rem;color:var(--accent);text-decoration:underline;">C++ 참조: nullptr ↗</a></span>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 배열 vs 연결 리스트: 배열은 "아파트"(번호로 바로 찾기 O(1)),
                    연결 리스트는 "기차"(한 칸씩 이동 O(n))입니다. 하지만 기차는 칸을 끼워 넣기가 쉽죠!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 연결 리스트 순회</div>
                    <div class="concept-demo-body">
                        <div class="demo-ll-chain" id="ll-demo-traverse-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;"></div>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-traverse-next">다음 노드로 →</button>
                        <button class="concept-demo-btn green" id="ll-demo-traverse-reset" style="display:none;">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-traverse-msg">👆 "다음 노드로" 버튼을 눌러 head부터 한 칸씩 순회해보세요! 배열과 달리 i번째로 바로 갈 수 없습니다.</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 연결 리스트 뒤집기</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 리스트 뒤집기는 <em>"화살표 방향 바꾸기"</em>입니다!
                    1→2→3 을 3→2→1 로 바꾸려면, 각 노드의 next 포인터를 반대 방향으로 돌립니다.
                    세 개의 포인터(prev, curr, next)를 쓰면 됩니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--accent)">prev</text></svg></div>
                        <h3>Step 1</h3>
                        <p><code>prev = None</code>, <code>curr = head</code>로 시작합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--yellow)">→←</text></svg></div>
                        <h3>Step 2</h3>
                        <p><code>curr.next</code>를 <code>prev</code>로 바꿉니다 (방향 전환!).</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--green)">▶▶</text></svg></div>
                        <h3>Step 3</h3>
                        <p>prev, curr를 한 칸씩 앞으로 이동. 끝나면 prev가 새 head!</p>
                    </div>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🤔 왜 포인터가 3개나 필요할까?</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;">뒤집기의 핵심은 <code>curr.next = prev</code> (화살표 방향 전환)입니다. 그런데 이 순간 문제가 생깁니다:</p>
                        <p style="margin-left:1rem;margin-bottom:0.5rem;color:var(--text2);">
                            <strong>Before:</strong> <code>... ← prev &nbsp; curr → next_node → ...</code><br>
                            <strong>After <code>curr.next = prev</code>:</strong> <code>... ← prev ← curr &nbsp; <span style="color:var(--red);">next_node → ...</span></code>
                        </p>
                        <p style="margin-bottom:0.5rem;"><code>curr.next</code>를 <code>prev</code>로 바꾸는 순간, <strong style="color:var(--red);">원래 다음 노드(next_node)에 대한 참조를 잃어버립니다!</strong></p>
                        <p style="margin-bottom:0.5rem;">그래서 방향을 바꾸기 <strong>전에</strong> <code>next_node = curr.next</code>로 다음 노드를 미리 저장해두는 것입니다.</p>
                        <p style="font-size:0.85rem;color:var(--text3);">💡 정리: <strong>prev</strong>(뒤집은 쪽) + <strong>curr</strong>(지금 처리 중) + <strong>next_node</strong>(아직 안 본 쪽) — 세 영역의 경계를 관리하기 위해 3개가 필요합니다.</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 연결 리스트 뒤집기 (반복)
def reverseList(head):
    prev = None
    curr = head

    while curr:
        next_node = curr.next  # 다음 노드 저장
        curr.next = prev       # 방향 전환!
        prev = curr            # prev 이동
        curr = next_node       # curr 이동

    return prev  # prev가 새로운 head</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 연결 리스트 뒤집기 (반복)
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;

    while (curr) {
        ListNode* next_node = curr-&gt;next;  // 다음 노드 저장
        curr-&gt;next = prev;                  // 방향 전환!
        prev = curr;                         // prev 이동
        curr = next_node;                    // curr 이동
    }

    return prev;  // prev가 새로운 head
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 연결 리스트 뒤집기는 알고리즘 대회에서도 자주 등장하는 핵심 기법입니다!
                    반복 버전과 재귀 버전 모두 구현할 수 있으면 좋습니다.
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 리스트 뒤집기 시뮬레이션</div>
                    <div class="concept-demo-body">
                        <div class="demo-ll-chain" id="ll-demo-reverse-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;"></div>
                    </div>
                    <div class="demo-ll-info" id="ll-demo-reverse-info" style="margin-bottom:0.8rem;">
                        <span><strong>prev:</strong> <span id="ll-demo-reverse-prev-val">None</span></span>
                        <span><strong>curr:</strong> <span id="ll-demo-reverse-curr-val">-</span></span>
                        <span><strong>next_node:</strong> <span id="ll-demo-reverse-next-val">-</span></span>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-reverse-step">다음 스텝 →</button>
                        <button class="concept-demo-btn green" id="ll-demo-reverse-reset" style="display:none;">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-reverse-msg">👆 "다음 스텝"을 눌러 prev/curr/next 포인터가 이동하며 화살표가 뒤집히는 과정을 확인하세요!</div>
                </div>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 투 포인터: 토끼와 거북이</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> <em>"원형 트랙에서 달리기"</em>를 생각해봅시다!
                    빠른 선수(fast, 2칸씩)와 느린 선수(slow, 1칸씩)가 원형 트랙을 달리면
                    반드시 만납니다. 이것으로 <strong>순환(cycle) 탐지</strong>를 할 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="14" font-weight="bold" fill="var(--accent)">🐢🐇</text></svg></div>
                        <h3>사이클 탐지</h3>
                        <p>slow는 1칸, fast는 2칸씩 이동. 만나면 사이클! (Floyd's Algorithm)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">mid</text></svg></div>
                        <h3>중간 노드 찾기</h3>
                        <p>fast가 끝에 도달하면 slow는 정확히 중간에! 한 번의 순회로 중간을 찾습니다.</p>
                    </div>
                </div>
                <div class="think-box" style="margin-top:1.2rem;">
                    <strong>🤔 왜 Floyd's Algorithm이 작동할까?</strong>
                    <div style="margin-top:0.8rem;">
                        <p style="margin-bottom:0.5rem;"><strong>1. 사이클이 없다면?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.8rem;">fast가 먼저 <code>None(nullptr)</code>에 도달합니다. → 사이클 없음을 확인!</p>
                        <p style="margin-bottom:0.5rem;"><strong>2. 사이클이 있다면?</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">fast와 slow가 모두 사이클 안에 진입하게 됩니다. 이때 핵심:</p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">• fast는 매 스텝 <strong>2칸</strong>, slow는 <strong>1칸</strong> → 매 스텝마다 fast가 slow를 <strong>1칸씩 따라잡음</strong></p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.5rem;">• 사이클 길이가 C라면, 둘 사이의 거리는 매 스텝 1씩 줄어듦</p>
                        <p style="margin-left:1rem;color:var(--text2);margin-bottom:0.8rem;">• 따라서 <strong>최대 C스텝</strong> 이내에 반드시 만남! (거리가 C, C-1, C-2, ..., 1, <span style="color:var(--green);font-weight:600;">0 = 만남!</span>)</p>
                        <p style="font-size:0.85rem;color:var(--text3);">💡 비유: 원형 트랙에서 속도가 다른 두 주자는 결국 만납니다. 빠른 주자가 느린 주자를 한 바퀴 "랩"하면서 만나는 것과 같은 원리!</p>
                    </div>
                </div>
                <span class="lang-py"><div class="code-block">
                    <pre><code class="language-python"># 사이클 탐지 (Floyd's Cycle Detection)
def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next        # 1칸 이동
        fast = fast.next.next   # 2칸 이동
        if slow == fast:
            return True  # 사이클 발견!
    return False  # fast가 끝에 도달 = 사이클 없음

# 중간 노드 찾기
def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # slow가 중간!</code></pre>
                </div></span>
                <span class="lang-cpp"><div class="code-block">
                    <pre><code class="language-cpp">// 사이클 탐지 (Floyd's Cycle Detection)
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;          // 1칸 이동
        fast = fast-&gt;next-&gt;next;    // 2칸 이동
        if (slow == fast)
            return true;  // 사이클 발견!
    }
    return false;  // fast가 끝에 도달 = 사이클 없음
}

// 중간 노드 찾기
ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast &amp;&amp; fast-&gt;next) {
        slow = slow-&gt;next;
        fast = fast-&gt;next-&gt;next;
    }
    return slow;  // slow가 중간!
}</code></pre>
                </div></span>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 연결 리스트 문제를 만나면,
                    "뒤집기", "사이클 탐지", "중간 찾기", "병합" 이 4가지 핵심 패턴을 떠올리세요!
                </div>
                <div class="concept-demo">
                    <div class="concept-demo-title">🎮 직접 해보기 — 토끼와 거북이 (Floyd's Cycle Detection)</div>
                    <div class="concept-demo-body">
                        <div id="ll-demo-cycle-chain" style="display:flex;align-items:center;gap:0;flex-wrap:wrap;justify-content:center;padding:1rem 0;position:relative;"></div>
                    </div>
                    <div class="demo-ll-info" id="ll-demo-cycle-info" style="margin-bottom:0.8rem;">
                        <span>🐢 <strong>slow:</strong> <span id="ll-demo-cycle-slow-val">node 1</span></span>
                        <span>🐇 <strong>fast:</strong> <span id="ll-demo-cycle-fast-val">node 1</span></span>
                        <span id="ll-demo-cycle-step-count" style="color:var(--text3);">스텝: 0</span>
                    </div>
                    <div class="concept-demo-btns" style="justify-content:center;">
                        <button class="concept-demo-btn" id="ll-demo-cycle-step">다음 스텝 →</button>
                        <button class="concept-demo-btn green" id="ll-demo-cycle-reset" style="display:none;">↺ 처음부터</button>
                    </div>
                    <div class="concept-demo-msg" id="ll-demo-cycle-msg">👆 "다음 스텝"을 눌러 slow(1칸)와 fast(2칸)가 이동하는 과정을 확인하세요. 사이클 안에서 만나면 사이클 발견!</div>
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });

        // ========== 인라인 데모 인터랙션 ==========

        // ── 공통 헬퍼: 노드 HTML 생성 ──
        const _llNodeHtml = (val, labels, cls) => {
            var labelHtml = '';
            if (labels && labels.length) {
                labelHtml = labels.map(l => {
                    var lCls = 'demo-ll-label';
                    if (l === 'head') lCls += ' lbl-head';
                    else if (l === 'prev') lCls += ' lbl-prev';
                    else if (l === 'curr') lCls += ' lbl-curr';
                    else if (l === 'slow' || l === '🐢slow') lCls += ' lbl-slow';
                    else if (l === 'fast' || l === '🐇fast') lCls += ' lbl-fast';
                    return '<span class="' + lCls + '">' + l + '</span>';
                }).join('');
            }
            return '<div class="demo-ll-node">' + labelHtml +
                '<div class="demo-ll-node-box' + (cls ? ' ' + cls : '') + '">' + val + '</div></div>';
        };
        const _llArrowHtml = (reversed) => {
            return '<span class="demo-ll-arrow' + (reversed ? ' rev' : '') + '">' + (reversed ? '←' : '→') + '</span>';
        };

        // --- 1. 순회 데모 ---
        {
            const chainEl = container.querySelector('#ll-demo-traverse-chain');
            const nextBtn = container.querySelector('#ll-demo-traverse-next');
            const resetBtn = container.querySelector('#ll-demo-traverse-reset');
            const msgEl = container.querySelector('#ll-demo-traverse-msg');
            const nodes = [10, 20, 30, 40, 50];
            let currentIdx = -1;

            const renderChain = () => {
                let html = '';
                for (let i = 0; i < nodes.length; i++) {
                    let labels = [];
                    let cls = '';
                    if (i === 0) labels.push('head');
                    if (i === currentIdx) {
                        labels.push('curr');
                        cls = 'current';
                    } else if (i < currentIdx) {
                        cls = 'visited';
                    }
                    html += _llNodeHtml(nodes[i], labels, cls);
                    if (i < nodes.length - 1) html += _llArrowHtml(false);
                }
                html += '<span class="demo-ll-none">None</span>';
                chainEl.innerHTML = html;
            };

            renderChain();

            nextBtn.addEventListener('click', () => {
                if (currentIdx >= nodes.length - 1) return;
                currentIdx++;
                renderChain();
                if (currentIdx === 0) {
                    msgEl.textContent = 'curr = head → 노드 ' + nodes[currentIdx] + '에서 시작합니다. 연결 리스트는 항상 head부터 출발해야 합니다!';
                } else if (currentIdx < nodes.length - 1) {
                    msgEl.textContent = 'curr = curr.next → 노드 ' + nodes[currentIdx] + '으로 이동했습니다. (' + (currentIdx + 1) + '번째 노드에 도달하려면 ' + currentIdx + '번 이동 필요!)';
                } else {
                    msgEl.textContent = '노드 ' + nodes[currentIdx] + '에 도착! curr.next는 None이므로 순회 완료. 총 ' + currentIdx + '번 이동했습니다. 배열이라면 arr[' + currentIdx + ']로 O(1)이었겠죠!';
                    nextBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                currentIdx = -1;
                renderChain();
                msgEl.textContent = '👆 "다음 노드로" 버튼을 눌러 head부터 한 칸씩 순회해보세요! 배열과 달리 i번째로 바로 갈 수 없습니다.';
                nextBtn.style.display = '';
                resetBtn.style.display = 'none';
            });
        }

        // --- 2. 뒤집기 데모 ---
        {
            const chainEl = container.querySelector('#ll-demo-reverse-chain');
            const stepBtn = container.querySelector('#ll-demo-reverse-step');
            const resetBtn = container.querySelector('#ll-demo-reverse-reset');
            const msgEl = container.querySelector('#ll-demo-reverse-msg');
            const prevValEl = container.querySelector('#ll-demo-reverse-prev-val');
            const currValEl = container.querySelector('#ll-demo-reverse-curr-val');
            const nextValEl = container.querySelector('#ll-demo-reverse-next-val');
            const vals = [1, 2, 3, 4, 5];

            // State: arrows[i] = true means arrow between i and i+1 is reversed
            // prevIdx, currIdx track pointer positions (-1 = None/null)
            let arrows, prevIdx, currIdx, stepNum, done;

            // Build steps for the reversal algorithm:
            // Each iteration: save next, flip arrow, move prev, move curr
            // We show each sub-step individually
            const buildSteps = () => {
                const steps = [];
                // Initial state: prev = None, curr = 0
                steps.push({
                    desc: 'prev = None, curr = head(노드 ' + vals[0] + ') 로 초기화합니다.',
                    prevI: -1, currI: 0, arrowsState: new Array(vals.length - 1).fill(false), sub: 'init'
                });

                let arrs = new Array(vals.length - 1).fill(false);
                let pI = -1, cI = 0;

                while (cI < vals.length) {
                    const nextI = cI + 1 < vals.length ? cI + 1 : -1;
                    // Sub-step 1: save next_node
                    steps.push({
                        desc: 'next_node = curr.next → ' + (nextI >= 0 ? '노드 ' + vals[nextI] : 'None') + '을 임시 저장합니다. 화살표를 바꾸면 다음 노드를 잃어버리니까요!',
                        prevI: pI, currI: cI, nextI: nextI, arrowsState: arrs.slice(), sub: 'save_next'
                    });
                    // Sub-step 2: flip arrow (curr.next = prev)
                    const newArrs = arrs.slice();
                    if (cI > 0) newArrs[cI - 1] = true; // reverse arrow between prev and curr
                    steps.push({
                        desc: 'curr.next = prev → 노드 ' + vals[cI] + '의 화살표를 ' + (pI >= 0 ? '노드 ' + vals[pI] : 'None') + ' 방향으로 뒤집습니다!',
                        prevI: pI, currI: cI, nextI: nextI, arrowsState: newArrs.slice(), sub: 'flip'
                    });
                    arrs = newArrs;
                    // Sub-step 3: move prev and curr
                    const oldCI = cI;
                    pI = cI;
                    cI = nextI >= 0 ? nextI : vals.length; // move past end
                    if (cI < vals.length) {
                        steps.push({
                            desc: 'prev = 노드 ' + vals[pI] + ', curr = 노드 ' + vals[cI] + ' 로 한 칸 전진합니다.',
                            prevI: pI, currI: cI, arrowsState: arrs.slice(), sub: 'move'
                        });
                    } else {
                        steps.push({
                            desc: 'curr가 None이 되었으므로 반복 종료! prev(노드 ' + vals[pI] + ')가 새로운 head입니다. 뒤집기 완료!',
                            prevI: pI, currI: -1, arrowsState: arrs.slice(), sub: 'done'
                        });
                    }
                }
                return steps;
            };

            let steps;

            const renderReverseChain = (step) => {
                let html = '';
                // For the 'done' state, render reversed order
                if (step.sub === 'done') {
                    // Show reversed list
                    for (let i = vals.length - 1; i >= 0; i--) {
                        let labels = [];
                        let cls = 'reversed';
                        if (i === vals.length - 1) labels.push('head');
                        if (i === step.prevI) labels.push('prev');
                        html += _llNodeHtml(vals[i], labels, cls);
                        if (i > 0) html += _llArrowHtml(false);
                    }
                    html += '<span class="demo-ll-none">None</span>';
                } else {
                    for (let i = 0; i < vals.length; i++) {
                        let labels = [];
                        let cls = '';
                        if (i === 0 && !step.arrowsState.some((v, idx) => idx < i && v)) labels.push('head');
                        if (i === step.prevI) { labels.push('prev'); cls = 'visited'; }
                        if (i === step.currI) { labels.push('curr'); cls = 'current'; }
                        if (step.nextI !== undefined && i === step.nextI && step.sub === 'save_next') { labels.push('next'); }
                        // Check if already reversed
                        if (i < step.prevI && step.prevI >= 0) cls = 'reversed';
                        html += _llNodeHtml(vals[i], labels, cls);
                        if (i < vals.length - 1) {
                            html += _llArrowHtml(step.arrowsState[i]);
                        }
                    }
                    html += '<span class="demo-ll-none">None</span>';
                }
                chainEl.innerHTML = html;
            };

            const resetReverse = () => {
                steps = buildSteps();
                stepNum = -1;
                done = false;
                // Initial render
                let html = '';
                for (let i = 0; i < vals.length; i++) {
                    let labels = i === 0 ? ['head'] : [];
                    html += _llNodeHtml(vals[i], labels, '');
                    if (i < vals.length - 1) html += _llArrowHtml(false);
                }
                html += '<span class="demo-ll-none">None</span>';
                chainEl.innerHTML = html;
                prevValEl.textContent = 'None';
                currValEl.textContent = '-';
                nextValEl.textContent = '-';
                msgEl.textContent = '👆 "다음 스텝"을 눌러 prev/curr/next 포인터가 이동하며 화살표가 뒤집히는 과정을 확인하세요!';
                stepBtn.style.display = '';
                resetBtn.style.display = 'none';
            };

            resetReverse();

            stepBtn.addEventListener('click', () => {
                if (done) return;
                stepNum++;
                if (stepNum >= steps.length) return;
                const step = steps[stepNum];
                renderReverseChain(step);
                msgEl.textContent = step.desc;
                prevValEl.textContent = step.prevI >= 0 ? vals[step.prevI] : 'None';
                currValEl.textContent = step.currI >= 0 ? vals[step.currI] : 'None';
                nextValEl.textContent = step.nextI !== undefined && step.nextI >= 0 ? vals[step.nextI] : '-';
                if (step.sub === 'done') {
                    done = true;
                    stepBtn.style.display = 'none';
                    resetBtn.style.display = '';
                }
            });

            resetBtn.addEventListener('click', () => {
                resetReverse();
            });
        }

        // --- 3. 토끼와 거북이 (Floyd's Cycle) 데모 ---
        {
            const chainEl = container.querySelector('#ll-demo-cycle-chain');
            const stepBtn = container.querySelector('#ll-demo-cycle-step');
            const resetBtn = container.querySelector('#ll-demo-cycle-reset');
            const msgEl = container.querySelector('#ll-demo-cycle-msg');
            const slowValEl = container.querySelector('#ll-demo-cycle-slow-val');
            const fastValEl = container.querySelector('#ll-demo-cycle-fast-val');
            const stepCountEl = container.querySelector('#ll-demo-cycle-step-count');

            // Linked list: 1 → 2 → 3 → 4 → 5 → (back to 3) — cycle at node 3
            const vals = [1, 2, 3, 4, 5];
            const cycleBackTo = 2; // index 2 (node 3) — node 5's next points back to node 3
            let slowIdx, fastIdx, stepCount, met;

            const renderCycleChain = () => {
                let html = '';
                for (let i = 0; i < vals.length; i++) {
                    let labels = [];
                    let cls = '';
                    if (i === 0) labels.push('head');
                    if (i === slowIdx && i === fastIdx) {
                        if (met) {
                            labels.push('🐢🐇만남!');
                            cls = 'meet';
                        } else {
                            labels.push('🐢slow');
                            labels.push('🐇fast');
                            cls = 'current';
                        }
                    } else {
                        if (i === slowIdx) { labels.push('🐢slow'); cls = 'slow'; }
                        if (i === fastIdx) { labels.push('🐇fast'); cls = 'fast'; }
                    }
                    html += _llNodeHtml(vals[i], labels, cls);
                    if (i < vals.length - 1) {
                        html += _llArrowHtml(false);
                    }
                }
                // Show cycle arrow back to cycleBackTo
                html += '<span class="demo-ll-arrow" style="color:var(--red);font-weight:700;" title="cycle: 노드 ' + vals[cycleBackTo] + '로 되돌아감">↩ ' + vals[cycleBackTo] + '</span>';
                chainEl.innerHTML = html;
            };

            const resetCycle = () => {
                slowIdx = 0;
                fastIdx = 0;
                stepCount = 0;
                met = false;
                renderCycleChain();
                slowValEl.textContent = '노드 ' + vals[0];
                fastValEl.textContent = '노드 ' + vals[0];
                stepCountEl.textContent = '스텝: 0';
                msgEl.textContent = '👆 "다음 스텝"을 눌러 slow(1칸)와 fast(2칸)가 이동하는 과정을 확인하세요. 사이클 안에서 만나면 사이클 발견!';
                stepBtn.style.display = '';
                resetBtn.style.display = 'none';
            };

            // Move to next index, wrapping at cycle
            const nextIdx = (idx) => {
                if (idx === vals.length - 1) return cycleBackTo; // cycle!
                return idx + 1;
            };

            resetCycle();

            stepBtn.addEventListener('click', () => {
                if (met) return;
                stepCount++;
                // slow moves 1 step
                slowIdx = nextIdx(slowIdx);
                // fast moves 2 steps
                fastIdx = nextIdx(nextIdx(fastIdx));

                renderCycleChain();
                slowValEl.textContent = '노드 ' + vals[slowIdx];
                fastValEl.textContent = '노드 ' + vals[fastIdx];
                stepCountEl.textContent = '스텝: ' + stepCount;

                if (slowIdx === fastIdx) {
                    met = true;
                    renderCycleChain();
                    msgEl.textContent = '🎉 스텝 ' + stepCount + '에서 slow와 fast가 노드 ' + vals[slowIdx] + '에서 만났습니다! 사이클이 존재합니다! fast가 매 스텝 1칸씩 slow를 따라잡기 때문에 반드시 만나게 됩니다.';
                    stepBtn.style.display = 'none';
                    resetBtn.style.display = '';
                } else {
                    msgEl.textContent = '스텝 ' + stepCount + ': slow → 노드 ' + vals[slowIdx] + ' (1칸), fast → 노드 ' + vals[fastIdx] + ' (2칸). 아직 만나지 않았습니다. fast가 slow를 1칸씩 따라잡는 중!';
                }
            });

            resetBtn.addEventListener('click', () => {
                resetCycle();
            });
        }
    },

    // ===== 시각화 =====
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
        return '<div id="viz-step-desc' + s + '" class="viz-step-desc">\u25B6 다음 버튼을 눌러 시작하세요</div>';
    },

    _createStepControls(suffix) {
        var s = suffix || '';
        return '<div class="viz-step-controls">' +
            '<button class="btn viz-step-btn" id="viz-prev' + s + '" disabled>&larr; 이전</button>' +
            '<span id="viz-step-counter' + s + '" class="viz-step-counter">시작 전</span>' +
            '<button class="btn btn-primary viz-step-btn" id="viz-next' + s + '">다음 &rarr;</button>' +
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
                counter.textContent = '시작 전';
                if (descEl) descEl.innerHTML = '\u25B6 다음 버튼을 눌러 시작하세요';
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
            setTimeout(function() { steps[current].action('forward'); }, actionDelay);
        });
        prevBtn.addEventListener('click', function() {
            if (current < 0) return;
            current--;
            updateUI();
            setTimeout(function() {
                if (current >= 0) {
                    steps[current].action('backward');
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

    // ── _renderNodeChain: 노드 체인 HTML 생성 유틸 ──
    _nodeBox(val, labels, cls) {
        var c = 'str-char-box' + (cls ? ' ' + cls : '');
        var labelHtml = labels && labels.length
            ? '<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.7rem;white-space:nowrap;font-weight:600;color:var(--accent);">' + labels.join(',') + '</div>'
            : '';
        return '<div class="' + c + '" style="min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;position:relative;">' + labelHtml + val + '</div>';
    },

    // ── Reverse Linked List (lc-206) ──
    _renderVizReverse(container) {
        var self = this;
        var DEFAULT_VALUES = [1, 2, 3, 4];

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">노드 값: <input type="text" id="ll-rev-input" value="' + DEFAULT_VALUES.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:200px;"></label>' +
            '<button class="btn btn-primary" id="ll-rev-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-rev-wrap" style="position:relative;min-height:80px;padding:20px 0;">' +
            '<div id="ll-nodes-rev" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;"></div>' +
            '<div id="ll-rev-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-rev') + vizHTML + self._createStepControls('-rev');

        var nodesEl = container.querySelector('#ll-nodes-rev');
        var wrapEl = container.querySelector('#ll-rev-wrap');
        var flyEl = container.querySelector('#ll-rev-fly');
        var descEl = container.querySelector('#viz-step-desc-rev');

        function renderNodes(nodes, prevIdx, currIdx, newHead) {
            var html = '';
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                var isP = i === prevIdx;
                var isC = i === currIdx;
                var cls = isC ? ' comparing' : (isP ? ' matched' : '');
                var labels = [];
                if (isP) labels.push('prev');
                if (isC) labels.push('curr');
                if (i === newHead) labels.push('new head');
                html += '<div id="ll-rev-pair-' + i + '" style="display:flex;align-items:center;">';
                html += '<div id="ll-rev-node-' + i + '" class="str-char-box' + (cls ? ' ' + cls : '') + '" style="min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;position:relative;">' +
                    (labels.length ? '<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.7rem;white-space:nowrap;font-weight:600;color:var(--accent);">' + labels.join(',') + '</div>' : '') +
                    n.val + '</div>';
                if (n.nextIdx >= 0) {
                    html += '<span id="ll-rev-arrow-' + i + '" style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">&rarr;</span>';
                } else {
                    html += '<span id="ll-rev-arrow-' + i + '" style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">&rarr; None</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
        }

        // Ghost animation: shows a curved arrow from curr node flying back to prev node
        function animatePointerFlip(currNodeIdx, prevNodeIdx, onDone) {
            var currEl = container.querySelector('#ll-rev-node-' + currNodeIdx);
            var prevEl = prevNodeIdx >= 0 ? container.querySelector('#ll-rev-node-' + prevNodeIdx) : null;
            if (!currEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var currRect = currEl.getBoundingClientRect();

            // Create ghost arrow element showing the pointer reversal
            var ghost = document.createElement('div');
            ghost.textContent = '↩';
            ghost.style.cssText = 'position:absolute;z-index:20;font-size:1.6rem;font-weight:700;' +
                'left:' + (currRect.left - wrapRect.left + currRect.width / 2 - 12) + 'px;' +
                'top:' + (currRect.top - wrapRect.top - 8) + 'px;' +
                'color:var(--accent);opacity:0;transform:scale(0.5);' +
                'transition:all 0.45s cubic-bezier(.4,0,.2,1);';
            flyEl.appendChild(ghost);

            // If there's a prev node, also create a flying ghost of the value
            var valueGhost = null;
            if (prevEl) {
                var prevRect = prevEl.getBoundingClientRect();
                valueGhost = document.createElement('div');
                valueGhost.className = 'str-char-box comparing';
                valueGhost.textContent = currEl.textContent.trim();
                valueGhost.style.cssText = 'position:absolute;z-index:21;min-width:44px;text-align:center;font-weight:600;font-size:1.05rem;' +
                    'left:' + (currRect.left - wrapRect.left) + 'px;' +
                    'top:' + (currRect.top - wrapRect.top) + 'px;' +
                    'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                    'transform:scale(1.15);';
                flyEl.appendChild(valueGhost);
                currEl.style.opacity = '0.2';
            }

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    // Animate the arrow appearing
                    ghost.style.opacity = '1';
                    ghost.style.transform = 'scale(1)';
                    ghost.style.top = (currRect.top - wrapRect.top - 28) + 'px';

                    // Animate value ghost settling back (slight bounce)
                    if (valueGhost) {
                        valueGhost.style.transform = 'scale(1)';
                    }
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (valueGhost && valueGhost.parentNode) valueGhost.parentNode.removeChild(valueGhost);
                if (currEl) currEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(values) {
            var simNodes = values.map(function(v, i) { return { val: v, nextIdx: i < values.length - 1 ? i + 1 : -1 }; });
            var simPrev = -1, simCurr = 0;
            var states = [];
            // Initial state
            states.push({
                nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: -1, currIdx: 0, newHead: -1,
                desc: '초기 상태: ' + values.join(' &rarr; ') + ' &rarr; None. prev = None, curr = head(' + values[0] + '). 세 포인터로 방향을 바꿀 준비를 합니다.',
                animInfo: null
            });

            // Step through reversal — split into sub-steps for granularity
            for (var step = 0; step < values.length; step++) {
                var sc = simCurr;
                var sp = simPrev;
                var snext = simNodes[sc].nextIdx;

                // Sub-step 1: Save next_node
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: sp, currIdx: sc, newHead: -1,
                    desc: 'next_node = curr.next &rarr; ' + (snext >= 0 ? '노드 ' + values[snext] : 'None') + '을 저장합니다. 다음 단계에서 curr.next를 바꾸면 다음 노드를 잃어버리므로, 미리 저장해야 합니다!',
                    animInfo: null
                });

                // Sub-step 2: Flip pointer
                simNodes[sc].nextIdx = simPrev;
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: sp, currIdx: sc, newHead: -1,
                    desc: 'curr(' + values[sc] + ').next = prev' + (sp >= 0 ? '(' + values[sp] + ')' : '(None)') + ' &rarr; 화살표 방향을 뒤집습니다! 이것이 뒤집기의 핵심 동작입니다.',
                    animInfo: { currNode: sc, prevNode: sp }
                });

                // Sub-step 3: Move prev and curr
                simPrev = sc;
                simCurr = snext;
                states.push({
                    nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: simCurr >= 0 ? simCurr : -1, newHead: -1,
                    desc: 'prev = ' + values[simPrev] + ', curr = ' + (simCurr >= 0 && simCurr < values.length ? values[simCurr] : 'None') + '으로 한 칸 전진합니다. 다음 노드를 처리하기 위해 이동합니다.',
                    animInfo: null
                });

                if (simCurr < 0 || simCurr >= values.length) break;
            }
            var reversed = values.slice().reverse();
            states.push({
                nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: -1, newHead: simPrev,
                desc: 'curr = None이므로 반복 종료! prev(' + values[simPrev] + ')가 새로운 head입니다. 결과: ' + reversed.join(' &rarr; ') + ' &rarr; None &#10003;',
                animInfo: null
            });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderNodes(st.nodes, st.prevIdx, st.currIdx, st.newHead);
                        if (dir === 'forward' && st.animInfo) {
                            animatePointerFlip(st.animInfo.currNode, st.animInfo.prevNode);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var raw = container.querySelector('#ll-rev-input').value;
            var values = raw.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (values.length < 2) values = DEFAULT_VALUES.slice();
            nodesEl.innerHTML = '';
            flyEl.innerHTML = '';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(values);
            self._initStepController(container, steps, '-rev');
        }

        container.querySelector('#ll-rev-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── Merge Two Sorted Lists (lc-21) ──
    _renderVizMerge(container) {
        var self = this;
        var DEFAULT_LIST1 = [1, 2, 4];
        var DEFAULT_LIST2 = [1, 3, 4];

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">List 1: <input type="text" id="ll-merge-input1" value="' + DEFAULT_LIST1.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
            '<label style="font-weight:600;">List 2: <input type="text" id="ll-merge-input2" value="' + DEFAULT_LIST2.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:160px;"></label>' +
            '<button class="btn btn-primary" id="ll-merge-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-merge-wrap" style="position:relative;">' +
            '<div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;justify-content:center;">' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">list1</div>' +
            '<div id="ll-list1-merge" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '<div style="font-weight:600;margin-top:12px;margin-bottom:8px;color:var(--text);">list2</div>' +
            '<div id="ll-list2-merge" style="display:flex;gap:4px;flex-wrap:wrap;"></div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">병합 결과</div>' +
            '<div id="ll-result-merge" style="display:flex;gap:4px;flex-wrap:wrap;min-height:40px;"></div>' +
            '</div></div>' +
            '<div id="ll-merge-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-merge') + vizHTML + self._createStepControls('-merge');

        var list1El = container.querySelector('#ll-list1-merge');
        var list2El = container.querySelector('#ll-list2-merge');
        var resultEl = container.querySelector('#ll-result-merge');
        var wrapEl = container.querySelector('#ll-merge-wrap');
        var flyEl = container.querySelector('#ll-merge-fly');
        var descEl = container.querySelector('#viz-step-desc-merge');

        function renderLists(list1, list2, st) {
            list1El.innerHTML = list1.map(function(v, i) {
                var cls = i === st.i1 ? ' comparing' : (i < st.i1 ? ' matched' : '');
                return '<div id="ll-merge-l1-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
            list2El.innerHTML = list2.map(function(v, i) {
                var cls = i === st.i2 ? ' comparing' : (i < st.i2 ? ' matched' : '');
                return '<div id="ll-merge-l2-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
            resultEl.innerHTML = st.result.map(function(v, i) {
                return '<div id="ll-merge-res-' + i + '" class="str-char-box matched" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('');
        }

        function animateMergeMove(srcId, destIdx, value, onDone) {
            var srcEl = container.querySelector('#' + srcId);
            var destEl = container.querySelector('#ll-merge-res-' + destIdx);
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();

            srcEl.style.opacity = '0.15';
            destEl.style.opacity = '0.15';

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box comparing';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                'transform:scale(1.15);';
            flyEl.appendChild(ghost);

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                    ghost.style.transform = 'scale(1)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (srcEl) srcEl.style.opacity = '';
                if (destEl) destEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(list1, list2) {
            var states = [];
            var i1 = 0, i2 = 0, result = [];
            states.push({ i1: 0, i2: 0, result: [], desc: 'dummy 노드를 만듭니다. 결과 리스트의 시작점을 dummy.next로 추적하면 첫 노드를 특별 처리하지 않아도 됩니다.', animInfo: null });

            while (i1 < list1.length && i2 < list2.length) {
                // Step 1: Compare
                states.push({ i1: i1, i2: i2, result: result.slice(),
                    desc: 'list1[' + i1 + ']=' + list1[i1] + '과 list2[' + i2 + ']=' + list2[i2] + '을 비교합니다. 두 리스트 모두 정렬되어 있으므로, 각각의 맨 앞만 비교하면 전체 순서가 유지됩니다.',
                    animInfo: null });
                if (list1[i1] <= list2[i2]) {
                    // Step 2: Pick from list1
                    result.push(list1[i1]);
                    states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                        desc: list1[i1] + ' &le; ' + list2[i2] + '이므로 list1에서 ' + list1[i1] + '을 결과에 연결합니다. 더 작은 값을 먼저 넣어야 정렬이 유지되기 때문입니다.',
                        animInfo: { srcId: 'll-merge-l1-' + i1, destIdx: result.length - 1, value: list1[i1] } });
                    i1++;
                } else {
                    // Step 2: Pick from list2
                    result.push(list2[i2]);
                    states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                        desc: list1[i1] + ' &gt; ' + list2[i2] + '이므로 list2에서 ' + list2[i2] + '을 결과에 연결합니다. 더 작은 값을 먼저 넣어야 정렬이 유지되기 때문입니다.',
                        animInfo: { srcId: 'll-merge-l2-' + i2, destIdx: result.length - 1, value: list2[i2] } });
                    i2++;
                }
            }
            while (i1 < list1.length) {
                result.push(list1[i1]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                    desc: 'list2가 모두 소진되었습니다! list1의 나머지 ' + list1[i1] + '을 연결합니다. 이미 정렬되어 있으므로 남은 값을 그대로 붙이면 됩니다.',
                    animInfo: { srcId: 'll-merge-l1-' + i1, destIdx: result.length - 1, value: list1[i1] } });
                i1++;
            }
            while (i2 < list2.length) {
                result.push(list2[i2]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                    desc: 'list1이 모두 소진되었습니다! list2의 나머지 ' + list2[i2] + '을 연결합니다. 이미 정렬되어 있으므로 남은 값을 그대로 붙이면 됩니다.',
                    animInfo: { srcId: 'll-merge-l2-' + i2, destIdx: result.length - 1, value: list2[i2] } });
                i2++;
            }
            states.push({ i1: i1, i2: i2, result: result.slice(),
                desc: '병합 완료! 결과: [' + result.join(', ') + ']. 두 정렬된 리스트가 하나의 정렬된 리스트로 합쳐졌습니다 &#10003;', animInfo: null });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderLists(list1, list2, st);
                        if (dir === 'forward' && st.animInfo) {
                            animateMergeMove(st.animInfo.srcId, st.animInfo.destIdx, st.animInfo.value);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var raw1 = container.querySelector('#ll-merge-input1').value;
            var raw2 = container.querySelector('#ll-merge-input2').value;
            var l1 = raw1.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            var l2 = raw2.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (l1.length < 1) l1 = DEFAULT_LIST1.slice();
            if (l2.length < 1) l2 = DEFAULT_LIST2.slice();
            l1.sort(function(a, b) { return a - b; });
            l2.sort(function(a, b) { return a - b; });
            list1El.innerHTML = '';
            list2El.innerHTML = '';
            resultEl.innerHTML = '';
            flyEl.innerHTML = '';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(l1, l2);
            self._initStepController(container, steps, '-merge');
        }

        container.querySelector('#ll-merge-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── Linked List Cycle (lc-141) ──
    _renderVizCycle(container) {
        var self = this;
        var DEFAULT_VALS = [3, 2, 0, -4];
        var DEFAULT_CYCLE = 1;

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">노드 값: <input type="text" id="ll-cycle-input" value="' + DEFAULT_VALS.join(', ') + '" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:180px;"></label>' +
            '<label style="font-weight:600;">사이클 시작 인덱스: <input type="number" id="ll-cycle-pos" value="' + DEFAULT_CYCLE + '" min="-1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<span style="font-size:0.8rem;color:var(--text-secondary);">(-1 = 사이클 없음)</span>' +
            '<button class="btn btn-primary" id="ll-cycle-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-nodes-cycle" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;min-height:80px;padding:20px 0;"></div>' +
            '<div id="ll-cycle-info" style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-top:4px;"></div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
            '<div style="padding:8px 16px;background:var(--accent)15;border-radius:8px;font-size:0.9rem;">&#x1F422; slow: <span id="ll-slow-val" style="font-weight:700;color:var(--accent);">-</span></div>' +
            '<div style="padding:8px 16px;background:var(--green)15;border-radius:8px;font-size:0.9rem;">&#x1F407; fast: <span id="ll-fast-val" style="font-weight:700;color:var(--green);">-</span></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-cycle') + vizHTML + self._createStepControls('-cycle');

        var nodesEl = container.querySelector('#ll-nodes-cycle');
        var cycleInfoEl = container.querySelector('#ll-cycle-info');
        var slowVal = container.querySelector('#ll-slow-val');
        var fastVal = container.querySelector('#ll-fast-val');
        var descEl = container.querySelector('#viz-step-desc-cycle');

        function renderCycleNodes(nodeVals, cycleStart, slowIdx, fastIdx) {
            var html = '';
            for (var i = 0; i < nodeVals.length; i++) {
                var isSlow = i === slowIdx;
                var isFast = i === fastIdx;
                var cls = (isSlow && isFast) ? ' comparing' : isSlow ? ' matched' : isFast ? ' comparing' : '';
                var labels = [];
                if (isSlow) labels.push('&#x1F422;');
                if (isFast) labels.push('&#x1F407;');
                html += '<div style="display:flex;align-items:center;">';
                html += self._nodeBox(nodeVals[i], labels, cls.trim());
                if (i < nodeVals.length - 1) {
                    html += '<span style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">&rarr;</span>';
                } else if (cycleStart >= 0) {
                    html += '<span style="font-size:1.2rem;color:#e17055;margin:0 2px;">&rarr;&#8617;</span>';
                } else {
                    html += '<span style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">&rarr; None</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
            slowVal.textContent = slowIdx >= 0 ? nodeVals[slowIdx] : '-';
            fastVal.textContent = fastIdx >= 0 ? nodeVals[fastIdx] : '-';
        }

        function buildSteps(nodeVals, cycleStart) {
            var hasCycle = cycleStart >= 0 && cycleStart < nodeVals.length;
            if (hasCycle) {
                cycleInfoEl.innerHTML = '&uarr; 노드 ' + nodeVals[nodeVals.length - 1] + '의 next가 노드 ' + nodeVals[cycleStart] + '을 가리킴 (사이클!)';
            } else {
                cycleInfoEl.innerHTML = '사이클 없음 &mdash; 마지막 노드의 next = None';
            }

            var states = [];
            var slow = 0, fast = 0;
            if (hasCycle) {
                states.push({ slow: 0, fast: 0, desc: '초기 상태: slow = fast = head(' + nodeVals[0] + '). 사이클: ' + nodeVals[nodeVals.length - 1] + ' &rarr; ' + nodeVals[cycleStart] + '.' });
            } else {
                states.push({ slow: 0, fast: 0, desc: '초기 상태: slow = fast = head(' + nodeVals[0] + '). 사이클이 없는 리스트입니다.' });
            }

            function nextIdx(idx) {
                if (idx === nodeVals.length - 1) {
                    return hasCycle ? cycleStart : -1;
                }
                return idx + 1;
            }

            var maxIter = 30;
            var found = false;
            for (var iter = 0; iter < maxIter; iter++) {
                // slow moves 1 step
                slow = nextIdx(slow);
                if (slow < 0) {
                    states.push({ slow: -1, fast: fast,
                        desc: 'slow가 None에 도달! 사이클 없음 &rarr; return False' });
                    break;
                }
                // fast moves 2 steps
                fast = nextIdx(fast);
                if (fast < 0) {
                    states.push({ slow: slow, fast: -1,
                        desc: 'fast가 None에 도달! 사이클 없음 &rarr; return False' });
                    break;
                }
                fast = nextIdx(fast);
                if (fast < 0) {
                    states.push({ slow: slow, fast: -1,
                        desc: 'fast.next가 None에 도달! 사이클 없음 &rarr; return False' });
                    break;
                }

                if (slow === fast) {
                    states.push({ slow: slow, fast: fast,
                        desc: 'slow=' + nodeVals[slow] + ', fast=' + nodeVals[fast] + ' &rarr; &#x1F389; 만났습니다! 사이클 존재 확인!' });
                    found = true;
                    break;
                } else {
                    states.push({ slow: slow, fast: fast,
                        desc: 'slow &rarr; ' + nodeVals[slow] + ' (1칸), fast &rarr; ' + nodeVals[fast] + ' (2칸). 아직 다릅니다.' });
                }
            }
            if (found) {
                states.push({ slow: slow, fast: fast,
                    desc: 'Floyd\'s Algorithm 완료! slow와 fast가 노드 ' + nodeVals[slow] + '에서 만남 &rarr; return True &#10003;' });
            }

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function() {
                        renderCycleNodes(nodeVals, cycleStart, st.slow, st.fast);
                        descEl.innerHTML = st.desc;
                    }
                };
            });
        }

        function parseAndRun() {
            var raw = container.querySelector('#ll-cycle-input').value;
            var nodeVals = raw.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
            if (nodeVals.length < 2) nodeVals = DEFAULT_VALS.slice();
            var cycleStart = parseInt(container.querySelector('#ll-cycle-pos').value);
            if (isNaN(cycleStart)) cycleStart = DEFAULT_CYCLE;
            if (cycleStart >= nodeVals.length) cycleStart = nodeVals.length - 1;
            nodesEl.innerHTML = '';
            descEl.innerHTML = '';
            slowVal.textContent = '-';
            fastVal.textContent = '-';
            self._clearVizState();
            var steps = buildSteps(nodeVals, cycleStart);
            self._initStepController(container, steps, '-cycle');
        }

        container.querySelector('#ll-cycle-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ── 요세푸스 문제 (boj-1158) ──
    _renderVizJosephus(container) {
        var self = this;
        var DEFAULT_N = 7, DEFAULT_K = 3;

        var vizHTML = '<div class="viz-area">' +
            '<div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;">' +
            '<label style="font-weight:600;">N (인원): <input type="number" id="ll-joseph-n" value="' + DEFAULT_N + '" min="2" max="20" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<label style="font-weight:600;">K (간격): <input type="number" id="ll-joseph-k" value="' + DEFAULT_K + '" min="1" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:1rem;width:70px;"></label>' +
            '<button class="btn btn-primary" id="ll-joseph-reset">🔄</button>' +
            '</div>' +
            '<div id="ll-jos-title" style="font-weight:600;margin-bottom:8px;color:var(--text);"></div>' +
            '<div id="ll-jos-wrap" style="position:relative;min-height:50px;padding:12px 0;">' +
            '<div id="ll-circle-jos" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;"></div>' +
            '<div id="ll-jos-fly" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:12px;flex-wrap:wrap;">' +
            '<div style="font-weight:600;color:var(--text-secondary);">제거 순서: <span id="ll-removed-jos" style="color:var(--accent);">-</span></div>' +
            '</div>' +
            '</div>';
        container.innerHTML = self._createStepDesc('-jos') + vizHTML + self._createStepControls('-jos');

        var josTitleEl = container.querySelector('#ll-jos-title');
        var circleEl = container.querySelector('#ll-circle-jos');
        var wrapEl = container.querySelector('#ll-jos-wrap');
        var flyEl = container.querySelector('#ll-jos-fly');
        var removedEl = container.querySelector('#ll-removed-jos');
        var descEl = container.querySelector('#viz-step-desc-jos');

        function renderQueue(queue, pointer) {
            circleEl.innerHTML = queue.map(function(v, i) {
                var cls = i === pointer ? ' comparing' : '';
                return '<div id="ll-jos-item-' + i + '" class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
            }).join('') || '<span style="color:var(--text-secondary);">빈 큐</span>';
        }

        // Ghost animation: element flies from front (idx 0) to back (last idx)
        function animateJosMove(value, queueLen, onDone) {
            var srcEl = container.querySelector('#ll-jos-item-0');
            var destEl = container.querySelector('#ll-jos-item-' + (queueLen - 1));
            if (!srcEl || !destEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();
            var destRect = destEl.getBoundingClientRect();

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box comparing';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:left 0.5s cubic-bezier(.4,0,.2,1),top 0.5s cubic-bezier(.4,0,.2,1),transform 0.5s;' +
                'transform:scale(1.15);';
            flyEl.appendChild(ghost);
            destEl.style.opacity = '0.15';

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.left = (destRect.left - wrapRect.left) + 'px';
                    ghost.style.top = (destRect.top - wrapRect.top) + 'px';
                    ghost.style.transform = 'scale(1)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (destEl) destEl.style.opacity = '';
                if (onDone) onDone();
            }, 550);
        }

        // Ghost animation: element flies up and fades out (removal)
        function animateJosRemove(value, onDone) {
            var srcEl = container.querySelector('#ll-jos-item-0');
            if (!srcEl) { if (onDone) onDone(); return; }
            var wrapRect = wrapEl.getBoundingClientRect();
            var srcRect = srcEl.getBoundingClientRect();

            var ghost = document.createElement('div');
            ghost.className = 'str-char-box';
            ghost.textContent = value;
            ghost.style.cssText = 'position:absolute;z-index:20;width:36px;text-align:center;font-weight:600;' +
                'left:' + (srcRect.left - wrapRect.left) + 'px;' +
                'top:' + (srcRect.top - wrapRect.top) + 'px;' +
                'transition:all 0.5s cubic-bezier(.4,0,.2,1);' +
                'background:var(--red);color:white;transform:scale(1.15);opacity:1;';
            flyEl.appendChild(ghost);

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    ghost.style.top = (srcRect.top - wrapRect.top - 40) + 'px';
                    ghost.style.opacity = '0';
                    ghost.style.transform = 'scale(0.5)';
                });
            });

            setTimeout(function() {
                if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
                if (onDone) onDone();
            }, 550);
        }

        function buildSteps(N, K) {
            josTitleEl.textContent = '원형 큐 (N=' + N + ', K=' + K + ')';

            var states = [];
            var queue = [];
            for (var i = 1; i <= N; i++) queue.push(i);
            var removed = [];

            states.push({ queue: queue.slice(), removed: [], pointer: -1, desc: '1부터 ' + N + '까지 원형으로 앉아 있습니다. K=' + K + '번째 사람을 제거합니다.', animType: null });

            while (queue.length > 0) {
                for (var j = 0; j < K - 1; j++) {
                    var moved = queue.shift();
                    queue.push(moved);
                    states.push({ queue: queue.slice(), removed: removed.slice(), pointer: queue.length - 1,
                        desc: (j + 1) + '번째 이동: ' + moved + '을 뒤로 보냅니다. 큐: [' + queue.join(', ') + ']',
                        animType: 'move', animValue: moved, animQueueLen: queue.length });
                }
                var out = queue.shift();
                removed.push(out);
                states.push({ queue: queue.slice(), removed: removed.slice(), pointer: -1, justRemoved: out,
                    desc: K + '번째 사람 ' + out + '을 제거! 제거 순서: &lt;' + removed.join(', ') + '&gt;',
                    animType: 'remove', animValue: out });
            }

            states.push({ queue: [], removed: removed.slice(), pointer: -1,
                desc: '완료! 요세푸스 순열: &lt;' + removed.join(', ') + '&gt; &#10003;', animType: null });

            return states.map(function(st) {
                return {
                    description: st.desc,
                    action: function(dir) {
                        flyEl.innerHTML = '';
                        renderQueue(st.queue, st.pointer);
                        removedEl.textContent = st.removed.length > 0 ? '<' + st.removed.join(', ') + '>' : '-';
                        if (dir === 'forward' && st.animType === 'move') {
                            animateJosMove(st.animValue, st.animQueueLen);
                        } else if (dir === 'forward' && st.animType === 'remove') {
                            animateJosRemove(st.animValue);
                        }
                    }
                };
            });
        }

        function parseAndRun() {
            var N = parseInt(container.querySelector('#ll-joseph-n').value);
            var K = parseInt(container.querySelector('#ll-joseph-k').value);
            if (isNaN(N) || N < 2) N = DEFAULT_N;
            if (isNaN(K) || K < 1) K = DEFAULT_K;
            if (N > 20) N = 20;
            circleEl.innerHTML = '';
            flyEl.innerHTML = '';
            removedEl.textContent = '-';
            descEl.innerHTML = '';
            self._clearVizState();
            var steps = buildSteps(N, K);
            self._initStepController(container, steps, '-jos');
        }

        container.querySelector('#ll-joseph-reset').addEventListener('click', parseAndRun);
        parseAndRun();
    },

    // ===== 문제 탭 =====
    stages: [
        { num: 1, title: '기본 연결 리스트', desc: '뒤집기와 병합의 기본 (Easy)', problemIds: ['lc-206', 'lc-21'] },
        { num: 2, title: '연결 리스트 응용', desc: '사이클 탐지와 시뮬레이션 (Easy~Silver)', problemIds: ['lc-141', 'boj-1158'] }
    ],

    problems: [
        {
            id: 'lc-206',
            title: 'LeetCode 206 - Reverse Linked List',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/reverse-linked-list/',
            simIntro: 'prev, curr, next 세 포인터가 한 칸씩 이동하며 방향을 뒤집는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>단일 연결 리스트의 head가 주어집니다. 리스트를 뒤집어서 반환하세요.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = [1,2,3,4,5]</pre></div>
                    <div><strong>출력</strong><pre>[5,4,3,2,1]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = [1,2]</pre></div>
                    <div><strong>출력</strong><pre>[2,1]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = []</pre></div>
                    <div><strong>출력</strong><pre>[]</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>노드 수는 [0, 5000] 범위</li>
                    <li>-5000 &le; Node.val &le; 5000</li>
                </ul>

                <div class="hint-key">💡 Follow-up: 연결 리스트를 반복(iterative)과 재귀(recursive) 두 가지 방법으로 뒤집을 수 있을까요?</div>
            `,
            hints: [
                { title: '처음 생각: 배열에 넣고 뒤집기?', content: '가장 먼저 떠오르는 방법 — 리스트를 순회하면서 값을 배열에 저장한 뒤, 배열을 뒤집어서 새 연결 리스트를 만들면 되지 않을까?<br><br>이 방법은 직관적이고 쉽지만, <strong>배열에 모든 값을 복사</strong>하니까 O(n) 추가 공간이 필요합니다. 노드가 수천 개면 배열도 수천 개... 공간이 아깝지 않나요?' },
                { title: '공간을 아끼려면?', content: '배열 없이 <strong>노드 자체의 방향을 바꿀 수</strong> 있다면? 각 노드의 <code>next</code> 포인터가 "다음 노드"를 가리키고 있는데, 이걸 "이전 노드"를 가리키도록 하나씩 바꾸면 제자리에서 뒤집을 수 있어요!<br><br>근데 문제가 하나 있습니다 — <code>curr.next</code>를 바꿔버리면 <strong>다음 노드로 이동할 수가 없어요</strong>. 다음 노드 주소를 잃어버리니까요.' },
                { title: '포인터 3개로 제자리 뒤집기', content: '그래서 포인터가 3개 필요합니다!<br><br>① <code>prev</code> — 이전 노드 (방향 전환 대상)<br>② <code>curr</code> — 현재 노드<br>③ <code>next_node</code> — 다음 노드 (미리 저장해두기)<div style="margin:12px 0;"><div style="font-size:0.8rem;color:var(--text2);margin-bottom:6px;">Before (원본):</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--text3);">→</div><div style="padding:4px 12px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;font-weight:600;">4</div><div style="color:var(--text3);">→ null</div></div><div style="text-align:center;margin:6px 0;font-size:0.9rem;color:var(--yellow);">↓ prev, curr, next로 한 칸씩 뒤집기</div><div style="font-size:0.8rem;color:var(--green);margin-bottom:6px;">After (뒤집힘):</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="color:var(--text3);">null ←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--green);">←</div><div style="padding:4px 12px;border-radius:6px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div></div></div>매 단계마다:<br>1. <code>next_node = curr.next</code> → 다음 노드 저장<br>2. <code>curr.next = prev</code> → 방향 전환!<br>3. <code>prev = curr</code>, <code>curr = next_node</code> → 한 칸 이동<br><br>이러면 <strong>O(1) 공간</strong>만으로 뒤집기 완료! Follow-up의 재귀 버전도 같은 원리인데, 스택 프레임이 O(n) 공간을 쓰니 반복(iterative)이 더 효율적이에요.' }
            ],
            templates: {
                python: `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev

    # 재귀 버전
    def reverseList_recursive(self, head):
        if not head or not head.next:
            return head
        new_head = self.reverseList_recursive(head.next)
        head.next.next = head
        head.next = None
        return new_head`,
                cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};`
            },
            solutions: [{
                approach: '포인터 3개 반복',
                description: 'prev, curr, next 포인터로 한 칸씩 이동하며 방향을 뒤집습니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: '초기화', desc: 'prev=None(뒤집힌 리스트의 시작), curr=head(현재 노드).\n두 포인터로 한 칸씩 이동하며 방향을 바꿀 준비를 합니다.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head' },
                        { title: '반복 순회', desc: 'curr이 None이 될 때까지 반복합니다.\n리스트 끝에 도달하면 모든 노드의 방향이 뒤집힌 상태입니다.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:' },
                        { title: '방향 전환 + 이동', desc: '핵심 4단계: ①next 저장 ②curr→prev로 방향 전환 ③prev 이동 ④curr 이동.\nnext를 먼저 저장하지 않으면 curr.next를 바꾼 뒤 다음 노드를 잃어버립니다.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next  # 다음 노드 저장\n        curr.next = prev       # 방향 전환!\n        prev = curr            # prev 이동\n        curr = next_node       # curr 이동' },
                        { title: '새 head 반환', desc: '반복이 끝나면 curr=None, prev가 마지막 노드(=새 head)입니다.\n원래 꼬리였던 노드가 새로운 머리가 됩니다.', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev  # prev가 새로운 head' }
                    ],
                    cpp: [
                        { title: '초기화', desc: 'prev=nullptr(뒤집힌 리스트의 시작), curr=head(현재 노드).\nC++에서는 null 대신 nullptr을 사용합니다.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;  // nullptr → C++의 null\n    ListNode* curr = head;' },
                        { title: '반복 순회', desc: 'curr이 nullptr이 아닌 동안 반복합니다.\nC++에서 포인터는 bool처럼 쓸 수 있어 while(curr)로 유효성 검사합니다.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {  // curr != nullptr' },
                        { title: '방향 전환 + 이동', desc: '핵심 4단계: ①next 저장 ②curr→prev로 방향 전환 ③prev 이동 ④curr 이동.\nC++에서는 ->로 포인터가 가리키는 멤버에 접근합니다.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* next = curr->next;  // 다음 노드 저장\n        curr->next = prev;            // 방향 전환!\n        prev = curr;                  // prev 이동\n        curr = next;                  // curr 이동' },
                        { title: '새 head 반환', desc: '반복이 끝나면 curr=nullptr, prev가 마지막 노드(=새 head)입니다.\n반환 타입이 ListNode*이므로 포인터를 그대로 반환합니다.', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;  // prev가 새로운 head\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-21',
            title: 'LeetCode 21 - Merge Two Sorted Lists',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            simIntro: 'list1과 list2에서 더 작은 값을 선택하여 결과 리스트에 연결하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정렬된 두 연결 리스트 <code>list1</code>과 <code>list2</code>의 head가 주어집니다. 두 리스트를 하나의 정렬된 리스트로 합쳐서 반환하세요. 새 리스트는 두 리스트의 노드를 이어 붙여서 만들어야 합니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>list1 = [1,2,4], list2 = [1,3,4]</pre></div>
                    <div><strong>출력</strong><pre>[1,1,2,3,4,4]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>list1 = [], list2 = []</pre></div>
                    <div><strong>출력</strong><pre>[]</pre></div>
                </div></div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>list1 = [], list2 = [0]</pre></div>
                    <div><strong>출력</strong><pre>[0]</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>두 리스트의 노드 수는 각각 [0, 50] 범위</li>
                    <li>-100 &le; Node.val &le; 100</li>
                    <li><code>list1</code>과 <code>list2</code>는 모두 오름차순 정렬</li>
                </ul>
            `,
            hints: [
                { title: '두 리스트를 어떻게 합칠까?', content: '정렬된 두 리스트가 있으니까, 양쪽의 맨 앞(head)을 비교해서 더 작은 쪽을 하나씩 떼어서 결과 리스트에 붙이면 되지 않을까?<div style="margin:12px 0;"><div style="display:flex;align-items:center;gap:4px;justify-content:center;margin-bottom:6px;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--text2);width:40px;text-align:right;">list1:</div><div style="padding:3px 10px;border-radius:5px;border:2px solid var(--yellow);font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">2</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">4</div></div><div style="display:flex;align-items:center;gap:4px;justify-content:center;margin-bottom:6px;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--text2);width:40px;text-align:right;">list2:</div><div style="padding:3px 10px;border-radius:5px;border:2px solid var(--yellow);font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">3</div><div style="color:var(--text3);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--bg2);font-size:0.85rem;">4</div></div><div style="text-align:center;font-size:0.85rem;color:var(--yellow);margin:4px 0;">↓ 양쪽 head를 비교, 작은 쪽을 선택!</div><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="font-size:0.75rem;color:var(--green);width:45px;text-align:right;">result:</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">1</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">2</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">3</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div><div style="color:var(--green);">→</div><div style="padding:3px 10px;border-radius:5px;background:var(--green);color:white;font-size:0.85rem;font-weight:600;">4</div></div></div>정렬된 카드 더미 두 개를 합치는 것과 같아요 — 양쪽 맨 위 카드를 비교하고, 더 작은 카드를 내려놓는 거죠. 한쪽이 먼저 떨어지면 나머지를 그대로 뒤에 붙이면 끝!' },
                { title: '더미 노드 트릭', content: '근데 한 가지 귀찮은 점이 있어요 — 결과 리스트의 <strong>첫 번째 노드</strong>를 어떻게 추적하죠?<br><br>list1.val이 더 작으면 결과의 head가 list1이고, 아니면 list2... 매번 분기 처리하기 번거롭습니다.<br><br>💡 <strong>더미 노드(dummy head)</strong>를 하나 만들어서 그 뒤에 이어붙이면? 마지막에 <code>dummy.next</code>만 반환하면 되니까 시작 노드 추적이 깔끔해집니다!' },
                { title: '재귀로도 가능!', content: '반복문 대신 재귀로도 자연스럽게 풀 수 있어요.<br><br>🔁 <strong>Base case</strong>: 둘 중 하나가 비어있으면 나머지를 반환<br>🔁 <strong>Recursive step</strong>: 더 작은 쪽의 <code>next</code>에 나머지를 재귀적으로 병합한 결과를 연결<br><br><span class="lang-py">Python: <code>list1.next = self.mergeTwoLists(list1.next, list2)</code></span><span class="lang-cpp">C++: <code>list1->next = mergeTwoLists(list1->next, list2);</code></span><br><br>코드가 더 짧고 직관적이지만, 재귀 깊이가 O(n+m)이라 스택 오버플로 주의!' }
            ],
            templates: {
                python: `class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        curr = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next

        curr.next = list1 or list2  # 남은 리스트 연결
        return dummy.next`,
                cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
            else { curr->next = l2; l2 = l2->next; }
            curr = curr->next;
        }
        curr->next = l1 ? l1 : l2;
        return dummy.next;
    }
};`
            },
            solutions: [{
                approach: '더미 노드 병합',
                description: 'dummy 노드를 만들고 두 리스트에서 더 작은 값을 순서대로 연결합니다.',
                timeComplexity: 'O(n + m)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '더미 노드 생성', desc: 'dummy 노드를 만들어 결과 리스트의 시작점으로 사용합니다.\n첫 노드를 특별 처리하지 않아도 되어 코드가 깔끔해집니다.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy' },
                        { title: '비교 반복', desc: '두 리스트 모두 노드가 남아있을 때까지 반복합니다.\n한쪽이라도 끝나면 남은 쪽을 통째로 이어붙이면 됩니다.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:' },
                        { title: '작은 값 연결', desc: '두 리스트의 현재 노드 중 작은 값을 curr.next에 연결합니다.\n이미 정렬된 리스트이므로 매번 작은 쪽을 고르면 전체도 정렬됩니다.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next' },
                        { title: '나머지 연결 + 반환', desc: '한쪽 리스트가 끝나면 남은 리스트를 통째로 연결합니다.\nlist1 or list2는 남아있는 쪽을 반환하는 Python 트릭입니다.', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n\n    curr.next = list1 or list2\n    return dummy.next' }
                    ],
                    cpp: [
                        { title: '더미 노드 생성', desc: '스택에 dummy 노드를 생성하고 &로 주소를 가져옵니다.\nC++에서는 new 없이 스택 변수로 만들면 메모리 관리가 편합니다.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);       // 스택에 더미 노드 생성\n    ListNode* curr = &dummy; // 포인터로 연결' },
                        { title: '비교 반복', desc: '두 리스트 모두 유효한 동안 반복합니다.\nC++에서 포인터가 nullptr이면 false이므로 && 조건으로 검사합니다.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {' },
                        { title: '작은 값 연결', desc: '두 노드 중 작은 값을 curr->next에 연결합니다.\nC++에서는 . 대신 ->로 포인터가 가리키는 멤버에 접근합니다.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            curr->next = l1;\n            l1 = l1->next;\n        } else {\n            curr->next = l2;\n            l2 = l2->next;\n        }\n        curr = curr->next;' },
                        { title: '나머지 연결 + 반환', desc: '삼항 연산자(? :)로 남아있는 리스트를 통째로 연결합니다.\ndummy.next가 실제 결과 리스트의 시작점입니다.', code: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (l1 && l2) {\n        if (l1->val <= l2->val) {\n            curr->next = l1;\n            l1 = l1->next;\n        } else {\n            curr->next = l2;\n            l2 = l2->next;\n        }\n        curr = curr->next;\n    }\n    curr->next = l1 ? l1 : l2;  // 삼항 연산자로 남은 리스트 연결\n    return dummy.next;\n}' }
                    ]
                }
            }]
        },
        {
            id: 'lc-141',
            title: 'LeetCode 141 - Linked List Cycle',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/linked-list-cycle/',
            simIntro: '🐢 거북이(slow)와 🐇 토끼(fast)가 이동하다 만나면 사이클이 존재합니다!',
            descriptionHTML: `
                <h3>문제</h3>
                <p>연결 리스트의 head가 주어집니다. 리스트에 사이클(순환)이 있는지 판별하세요.</p>
                <p>사이클이란 리스트의 어떤 노드를 따라가다 보면 다시 이전에 방문한 노드로 돌아오는 경우를 말합니다. <code>pos</code>는 tail의 next가 연결된 노드의 인덱스입니다 (0-indexed). <code>pos</code>가 -1이면 사이클이 없습니다. 참고: <code>pos</code>는 매개변수로 전달되지 않습니다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = [3,2,0,-4], pos = 1</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">사이클이 있습니다. tail이 인덱스 1의 노드에 연결됩니다.</p>
                </div>

                <div class="problem-example"><h4>예제 2</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = [1,2], pos = 0</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div>
                <p class="example-explain">사이클이 있습니다. tail이 인덱스 0의 노드에 연결됩니다.</p>
                </div>

                <div class="problem-example"><h4>예제 3</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>head = [1], pos = -1</pre></div>
                    <div><strong>출력</strong><pre>false</pre></div>
                </div>
                <p class="example-explain">사이클이 없습니다.</p>
                </div>

                <h4>제약 조건</h4>
                <ul>
                    <li>노드 수는 [0, 10<sup>4</sup>] 범위</li>
                    <li>-10<sup>5</sup> &le; Node.val &le; 10<sup>5</sup></li>
                    <li><code>pos</code>는 -1 또는 유효한 인덱스</li>
                </ul>

                <div class="hint-key">💡 Follow-up: O(1) 메모리(상수 공간)를 사용하여 풀 수 있을까요?</div>
            `,
            hints: [
                { title: '처음 생각: 방문 기록 남기기', content: '노드를 하나씩 따라가면서 "이 노드를 본 적 있나?" 확인하면 되지 않을까?<br><br><span class="lang-py">Python <code>set()</code>에 방문한 노드를 저장하고, 이미 있는 노드가 나오면 사이클!</span><span class="lang-cpp">C++ <code>unordered_set&lt;ListNode*&gt;</code>에 방문한 노드 주소를 저장하고, 이미 있는 노드가 나오면 사이클!</span><br><br>이 방법은 확실하게 동작하지만... 노드가 10만 개면 Set도 10만 개 — <strong>O(n) 추가 공간</strong>이 필요합니다.' },
                { title: '메모리 없이 할 수 있을까?', content: 'Follow-up에서 <strong>O(1) 공간</strong>으로 풀라고 합니다. 방문 기록을 저장하지 않고 사이클을 어떻게 감지할까요?<br><br>힌트: 운동장 트랙을 떠올려 보세요. 빠른 사람과 느린 사람이 같은 트랙에서 달리면... <strong>트랙이 원형이면 빠른 사람이 결국 느린 사람을 따라잡습니다!</strong> 트랙에 끝이 있으면(사이클 없음) 빠른 사람이 먼저 끝에 도달하겠죠.' },
                { title: '토끼와 거북이 (Floyd\'s Algorithm)', content: '🐢 <code>slow</code>는 한 칸씩, 🐇 <code>fast</code>는 두 칸씩 이동!<div style="margin:12px 0;"><div style="display:flex;align-items:center;gap:4px;justify-content:center;flex-wrap:wrap;"><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">3</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">2</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">0</div><div style="color:var(--text3);">→</div><div style="padding:4px 10px;border-radius:6px;background:var(--accent);color:white;font-size:0.85rem;">-4</div><div style="color:var(--red);">↩ 2로 되돌아감</div></div><div style="display:flex;justify-content:center;gap:16px;margin-top:8px;flex-wrap:wrap;"><div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--green);"></div><div style="font-size:0.75rem;color:var(--text2);">slow: 1칸씩</div></div><div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:12px;border-radius:50%;background:var(--red);"></div><div style="font-size:0.75rem;color:var(--text2);">fast: 2칸씩</div></div><div style="font-size:0.75rem;color:var(--yellow);font-weight:600;">사이클 안에서 반드시 만남!</div></div></div><strong>사이클이 있으면</strong>: 둘 다 사이클 안에 들어간 후, fast가 매 턴마다 slow와의 거리를 1칸씩 줄입니다. 결국 반드시 만나요!<br><strong>사이클이 없으면</strong>: fast가 먼저 <code>null</code>에 도달해서 반복 종료.<br><br>공간 O(1), 시간 O(n) — Set 방식보다 메모리를 아끼면서도 같은 시간 복잡도!' }
            ],
            templates: {
                python: `class Solution:
    def hasCycle(self, head) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True
        return False`,
                cpp: `class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`
            },
            solutions: [{
                approach: 'Floyd 순환 탐지',
                description: 'slow(1칸)와 fast(2칸)가 사이클 안에서 만나는지 확인합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '두 포인터 초기화', desc: 'slow와 fast를 모두 head에서 시작합니다.\nFloyd 알고리즘: 속도가 다른 두 포인터로 사이클을 탐지합니다.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head' },
                        { title: 'fast가 끝에 도달할 때까지 반복', desc: 'fast와 fast.next가 모두 존재해야 2칸 이동이 가능합니다.\nfast가 끝에 도달하면 사이클이 없다는 뜻입니다.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:' },
                        { title: '이동 + 비교', desc: 'slow는 1칸, fast는 2칸 이동 후 만남 여부를 확인합니다.\n사이클 안에서 fast가 매 턴 1칸씩 거리를 줄이므로 반드시 만납니다.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next        # 1칸\n        fast = fast.next.next   # 2칸\n        if slow == fast:\n            return True  # 만남!' },
                        { title: '사이클 없음 반환', desc: 'fast가 리스트 끝에 도달하면 사이클이 없습니다.\nHashSet O(n) 공간 대비 투 포인터는 O(1) 공간만 사용합니다.', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False  # fast가 끝에 도달' }
                    ],
                    cpp: [
                        { title: '두 포인터 초기화', desc: 'slow와 fast를 각각 ListNode* 타입으로 선언합니다.\nPython과 달리 C++에서는 포인터 타입을 명시해야 합니다.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;' },
                        { title: 'fast가 끝에 도달할 때까지 반복', desc: 'fast와 fast->next 두 조건을 모두 검사합니다.\nnullptr 접근 시 Segmentation Fault가 발생하므로 반드시 유효성 검사가 필요합니다.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {  // 포인터 유효성 검사' },
                        { title: '이동 + 비교', desc: 'slow는 1칸(->next), fast는 2칸(->next->next) 이동합니다.\n사이클이 있으면 fast가 slow를 따라잡아 같은 주소를 가리키게 됩니다.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;        // 1칸\n        fast = fast->next->next;  // 2칸\n        if (slow == fast)\n            return true;  // 만남!' },
                        { title: '사이클 없음 반환', desc: 'fast가 nullptr에 도달하면 리스트에 끝이 있으므로 사이클이 없습니다.\nbool 반환 타입이므로 true/false(소문자)를 사용합니다.', code: 'bool hasCycle(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast)\n            return true;\n    }\n    return false;  // fast가 끝에 도달\n}' }
                    ]
                }
            }]
        },
        {
            id: 'boj-1158',
            title: 'BOJ 1158 - 요세푸스 문제',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1158',
            simIntro: 'N=7, K=3인 요세푸스 문제를 큐로 시뮬레이션하는 과정을 관찰하세요.',
            descriptionHTML: `
                <h3>문제</h3>
                <p>1번부터 N번까지 N명의 사람이 원을 이루면서 앉아있고, 양의 정수 K(&le; N)가 주어진다. 이제 순서대로 K번째 사람을 제거한다. 한 사람이 제거되면 남은 사람들로 이루어진 원을 따라 이 과정을 계속해 나간다. 이 과정은 N명의 사람이 모두 제거될 때까지 계속된다. 원에서 사람들이 제거되는 순서를 (N, K)-요세푸스 순열이라고 한다. (7, 3)-요세푸스 순열은 &lt;3, 6, 2, 7, 5, 1, 4&gt;이다.</p>
                <h4>입력</h4>
                <p>첫째 줄에 N과 K가 빈 칸을 사이에 두고 순서대로 주어진다. (1 &le; K &le; N &le; 5,000)</p>
                <h4>출력</h4>
                <p>예제와 같이 요세푸스 순열을 출력한다.</p>

                <div class="problem-example"><h4>예제 1</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7 3</pre></div>
                    <div><strong>출력</strong><pre>&lt;3, 6, 2, 7, 5, 1, 4&gt;</pre></div>
                </div></div>

                <h4>제약 조건</h4>
                <ul>
                    <li>1 &le; K &le; N &le; 5,000</li>
                </ul>
            `,
            hints: [
                { title: '처음 생각: 배열에서 K번째 제거 반복', content: '1부터 N까지 배열에 넣고, 현재 위치에서 K번째를 찾아 제거하는 걸 반복하면 되지 않을까?<br><br>직관적이지만 문제가 있어요 — 배열 중간에서 원소를 제거하면 뒤의 원소들이 전부 한 칸씩 앞으로 밀려야 합니다. <strong>제거 한 번에 O(n)</strong>이고, N번 반복하니까 총 <strong>O(n&sup2;)</strong>. N이 5,000이면 2,500만 번... 느리진 않지만 깔끔하지도 않죠.' },
                { title: '큐로 효율적으로 시뮬레이션', content: '원형 구조를 큐로 표현하면 훨씬 깔끔합니다!<br><br>핵심 아이디어: K-1명을 앞에서 빼서 뒤로 보내고, K번째 사람을 앞에서 빼서 제거!<div style="margin:12px 0;overflow-x:auto;"><table style="border-collapse:collapse;font-size:0.82rem;width:100%;"><thead><tr style="background:var(--bg2);"><th style="padding:5px 8px;border:1px solid var(--bg3);">단계</th><th style="padding:5px 8px;border:1px solid var(--bg3);">동작</th><th style="padding:5px 8px;border:1px solid var(--bg3);">큐 상태</th></tr></thead><tbody><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">초기</td><td style="padding:4px 8px;border:1px solid var(--bg3);">-</td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[1, 2, 3, 4, 5, 6, 7]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">1</td><td style="padding:4px 8px;border:1px solid var(--bg3);">1→뒤, 2→뒤, <span style="color:var(--red);font-weight:600;">3 제거!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[4, 5, 6, 7, 1, 2]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">2</td><td style="padding:4px 8px;border:1px solid var(--bg3);">4→뒤, 5→뒤, <span style="color:var(--red);font-weight:600;">6 제거!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[7, 1, 2, 4, 5]</td></tr><tr><td style="padding:4px 8px;border:1px solid var(--bg3);text-align:center;">3</td><td style="padding:4px 8px;border:1px solid var(--bg3);">7→뒤, 1→뒤, <span style="color:var(--red);font-weight:600;">2 제거!</span></td><td style="padding:4px 8px;border:1px solid var(--bg3);font-family:monospace;">[4, 5, 7, 1]</td></tr></tbody></table></div>앞에서 빼고 뒤에 넣는 연산이 O(1)이면 전체가 <strong>O(nK)</strong>로 깔끔해집니다.' },
                { title: '<span class="lang-py">Python deque로 구현</span><span class="lang-cpp">C++ queue로 구현</span>', content: '<span class="lang-py">Python의 <code>collections.deque</code>는 양쪽 O(1) 삽입/삭제를 지원합니다!<br><br><code>deque.popleft()</code>로 앞에서 빼고, <code>deque.append()</code>로 뒤에 넣기.<br>결과를 리스트에 모아서 <code>&lt;a, b, c, ...&gt;</code> 형태로 출력하면 완성!</span><span class="lang-cpp">C++의 <code>queue</code>는 <code>front()</code>+<code>pop()</code>으로 앞에서 빼고, <code>push()</code>로 뒤에 넣습니다.<br><br>결과를 <code>vector</code>에 모아서 <code>&lt;a, b, c, ...&gt;</code> 형태로 출력하면 완성!</span>' }
            ],
            templates: {
                python: `from collections import deque
import sys
input = sys.stdin.readline

N, K = map(int, input().split())
q = deque(range(1, N + 1))
result = []

while q:
    for _ in range(K - 1):
        q.append(q.popleft())  # K-1명을 뒤로 보내기
    result.append(q.popleft())  # K번째 사람 제거

print('<' + ', '.join(map(str, result)) + '>')`,
                cpp: `#include <iostream>
#include <queue>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;
    queue<int> q;
    for (int i = 1; i <= N; i++) q.push(i);

    cout << "<";
    while (!q.empty()) {
        for (int i = 0; i < K - 1; i++) {
            q.push(q.front());
            q.pop();
        }
        cout << q.front(); q.pop();
        if (!q.empty()) cout << ", ";
    }
    cout << ">" << endl;
}`
            },
            solutions: [{
                approach: '큐 시뮬레이션',
                description: 'deque로 원형 구조를 시뮬레이션하여 K번째 사람을 순서대로 제거합니다.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(N)',
                get templates() { return linkedListTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '큐 초기화', desc: 'deque에 1~N을 넣어 원형 구조를 시뮬레이션합니다.\ndeque는 양쪽 삽입/삭제가 O(1)이라 원형 큐 구현에 최적입니다.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []' },
                        { title: 'K-1명 뒤로 보내기', desc: 'K-1번 앞에서 빼서 뒤로 보내면 K번째 사람이 맨 앞에 옵니다.\npopleft()→append()로 원형 회전을 구현하는 핵심 트릭입니다.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())  # 뒤로 보내기' },
                        { title: 'K번째 사람 제거', desc: '회전 후 맨 앞에 있는 사람이 K번째이므로 popleft()로 제거합니다.\n제거된 순서를 result에 기록합니다.', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())  # K번째 제거!' },
                        { title: '결과 출력', desc: 'BOJ 출력 형식에 맞게 <a, b, c, ...> 형태로 출력합니다.\nsys.stdin.readline으로 입력 속도를 높여 시간 초과를 방지합니다.', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())\n\nprint(\'<\' + \', \'.join(map(str, result)) + \'>\')' }
                    ],
                    cpp: [
                        { title: '큐 초기화', desc: 'queue에 1~N을 넣어 원형 구조를 준비합니다.\nC++ queue는 front()/push()/pop()으로 FIFO 연산을 지원합니다.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);' },
                        { title: 'K-1명 뒤로 보내기', desc: 'front()로 값을 읽고 push()로 뒤에 넣은 뒤 pop()으로 앞에서 제거합니다.\nC++ queue는 pop()이 값을 반환하지 않으므로 front()를 먼저 호출해야 합니다.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());  // 뒤로 보내기\n            q.pop();' },
                        { title: 'K번째 사람 제거', desc: '회전 후 맨 앞(front())이 K번째 사람이므로 출력하고 pop()합니다.\n마지막 원소가 아니면 쉼표를 추가하여 출력 형식을 맞춥니다.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());\n            q.pop();\n        }\n        cout << q.front();  // K번째 제거!\n        q.pop();\n        if (!q.empty()) cout << ", ";' },
                        { title: '결과 출력', desc: '꺾쇠(<>)로 감싸서 BOJ 출력 형식을 완성합니다.\ncout으로 바로 출력하므로 별도 결과 배열 없이 메모리를 절약합니다.', code: '#include <iostream>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int N, K;\n    cin >> N >> K;\n    queue<int> q;\n    for (int i = 1; i <= N; i++) q.push(i);\n\n    cout << "<";\n    while (!q.empty()) {\n        for (int i = 0; i < K - 1; i++) {\n            q.push(q.front());\n            q.pop();\n        }\n        cout << q.front();\n        q.pop();\n        if (!q.empty()) cout << ", ";\n    }\n    cout << ">" << endl;\n}' }
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
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', function() { linkedListTopic.renderProblem(container); });
        container.appendChild(backBtn);
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.linkedlist = linkedListTopic;
