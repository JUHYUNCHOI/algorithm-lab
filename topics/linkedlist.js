// =========================================================
// 연결 리스트 (Linked List) 토픽 모듈
// =========================================================
const linkedListTopic = {
    id: 'linkedlist',
    title: '연결 리스트',
    icon: '🔗',
    category: '자료구조 활용',
    order: 5,
    description: '노드와 포인터, 단일/이중 연결 리스트, 순환 탐지와 뒤집기',
    relatedNote: '이 외에도 이중 연결 리스트, LRU 캐시(해시맵+리스트), 스킵 리스트 등의 확장 개념이 있습니다.',

    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>🔗 연결 리스트 (Linked List)</h2>
                <p class="hero-sub">노드와 포인터로 연결된 동적 자료구조를 배워봅시다!</p>
            </div>

            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 연결 리스트란?</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 연결 리스트는 <em>"보물찾기 게임"</em>입니다!
                    각 종이(노드)에는 보물(데이터)과 <strong>다음 종이의 위치(포인터)</strong>가 적혀 있습니다.
                    첫 번째 종이(head)에서 시작해서 화살표를 따라가면 전체를 순회할 수 있습니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">node</text></svg></div>
                        <h3>노드 (Node)</h3>
                        <p><strong>데이터</strong>와 <strong>다음 노드를 가리키는 포인터(next)</strong>로 구성됩니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">head</text></svg></div>
                        <h3>Head</h3>
                        <p>연결 리스트의 시작점입니다. head만 알면 전체 리스트를 순회할 수 있습니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">O(1)</text></svg></div>
                        <h3>삽입/삭제가 빠름</h3>
                        <p>중간 삽입/삭제가 <strong>O(1)</strong>! (위치를 안다면) 배열은 O(n)입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">O(n)</text></svg></div>
                        <h3>접근이 느림</h3>
                        <p>i번째 원소를 찾으려면 head부터 i번 따라가야 → <strong>O(n)</strong>. 배열은 O(1)!</p>
                    </div>
                </div>
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 배열 vs 연결 리스트: 배열은 "아파트"(번호로 바로 찾기 O(1)),
                    연결 리스트는 "기차"(한 칸씩 이동 O(n))입니다. 하지만 기차는 칸을 끼워 넣기가 쉽죠!
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
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 연결 리스트 뒤집기는 코딩 면접의 단골 문제입니다!
                    반복 버전과 재귀 버전 모두 구현할 수 있으면 좋습니다.
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
                        <p>slow는 1칸, fast는 2칸씩 이동. 만나면 사이클 있음! (Floyd's Algorithm)</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">mid</text></svg></div>
                        <h3>중간 노드 찾기</h3>
                        <p>fast가 끝에 도달하면 slow는 정확히 중간에! 한 번의 순회로 중간을 찾습니다.</p>
                    </div>
                </div>
                <div class="code-block">
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
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 코딩 테스트에서 연결 리스트 문제가 나오면,
                    "뒤집기", "사이클 탐지", "중간 찾기", "병합" 이 4가지 패턴을 떠올리세요!
                </div>
            </div>
        `;
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
    },

    // ===== 시각화 탭 =====
    _vizState: null,
    _clearVizState() { this._vizState = null; },

    renderVisualize(container) {
        this._clearVizState();
        container.innerHTML = '';

        const vizArea = document.createElement('div');
        vizArea.className = 'viz-area';
        vizArea.innerHTML = `
            <h3>연결 리스트 뒤집기 시각화</h3>
            <p>포인터 3개(prev, curr, next)로 연결 리스트를 뒤집는 과정을 관찰하세요.</p>
            <div class="ll-viz-container" style="padding:20px 0;">
                <div class="ll-nodes" style="display:flex; align-items:center; gap:0; justify-content:center; flex-wrap:wrap; min-height:80px;"></div>
                <div class="ll-pointers" style="display:flex; gap:20px; justify-content:center; margin-top:16px; flex-wrap:wrap;"></div>
                <div class="ll-step-desc" style="padding:14px; background:var(--bg-secondary); border-radius:8px; margin-top:16px; font-size:0.95rem;"></div>
            </div>
        `;
        container.appendChild(vizArea);

        const nodesEl = vizArea.querySelector('.ll-nodes');
        const pointersEl = vizArea.querySelector('.ll-pointers');
        const descEl = vizArea.querySelector('.ll-step-desc');

        const values = [1, 2, 3, 4];
        // State: array of {val, nextIdx} where nextIdx = -1 means None
        let nodes, prevIdx, currIdx, newHead;

        function resetState() {
            nodes = values.map((v, i) => ({ val: v, nextIdx: i < values.length - 1 ? i + 1 : -1 }));
            prevIdx = -1;
            currIdx = 0;
            newHead = -1;
        }

        function renderNodes() {
            nodesEl.innerHTML = '';
            // Determine display order (follow from original head or follow reversed)
            const displayed = new Set();
            let html = '';
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const isP = i === prevIdx;
                const isC = i === currIdx;
                let cls = 'str-char-box';
                if (isC) cls += ' comparing';
                else if (isP) cls += ' matched';

                html += `<div style="display:flex;align-items:center;">`;
                html += `<div class="${cls}" style="min-width:50px;text-align:center;font-weight:600;font-size:1.1rem;position:relative;">`;
                html += `${n.val}`;
                const labels = [];
                if (isP) labels.push('prev');
                if (isC) labels.push('curr');
                if (i === newHead) labels.push('head');
                if (labels.length) html += `<div style="position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:0.7rem;color:var(--accent);white-space:nowrap;">${labels.join(',')}</div>`;
                html += `</div>`;
                if (n.nextIdx >= 0) {
                    html += `<span style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">→</span>`;
                } else {
                    html += `<span style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">→ None</span>`;
                }
                html += `</div>`;
            }
            nodesEl.innerHTML = html;
        }

        resetState();

        const steps = [];
        // Build steps for reversing 4-node list
        steps.push({
            description: '초기 상태: 1 → 2 → 3 → 4 → None. prev = None, curr = head(1번 노드).',
            action() { resetState(); renderNodes(); descEl.innerHTML = this.description; },
            undo() { resetState(); renderNodes(); }
        });

        // Step-by-step reversal
        const simNodes = values.map((v, i) => ({ val: v, nextIdx: i < values.length - 1 ? i + 1 : -1 }));
        let simPrev = -1, simCurr = 0;

        for (let step = 0; step < values.length; step++) {
            const sc = simCurr;
            const sp = simPrev;
            const snext = simNodes[sc].nextIdx;

            // Snapshot before
            const snapBefore = JSON.parse(JSON.stringify({ nodes: simNodes, prevIdx: simPrev, currIdx: simCurr }));

            // Apply: reverse link
            simNodes[sc].nextIdx = simPrev;
            simPrev = sc;
            simCurr = snext;

            const snapAfter = JSON.parse(JSON.stringify({ nodes: simNodes, prevIdx: simPrev, currIdx: simCurr }));

            steps.push({
                description: `curr(${values[sc]}).next를 prev${sp >= 0 ? '(' + values[sp] + ')' : '(None)'}로 바꿉니다. prev=${values[sc]}, curr=${snext >= 0 ? values[snext] : 'None'}으로 이동.`,
                action() {
                    const s = snapAfter;
                    nodes = JSON.parse(JSON.stringify(s.nodes));
                    prevIdx = s.prevIdx;
                    currIdx = s.currIdx;
                    renderNodes();
                    descEl.innerHTML = this.description;
                },
                undo() {
                    const s = snapBefore;
                    nodes = JSON.parse(JSON.stringify(s.nodes));
                    prevIdx = s.prevIdx;
                    currIdx = s.currIdx;
                    renderNodes();
                }
            });
        }

        steps.push({
            description: 'curr = None이므로 반복 종료! prev(4)가 새로운 head입니다. 결과: 4 → 3 → 2 → 1 → None ✓',
            action() {
                newHead = prevIdx;
                renderNodes();
                descEl.innerHTML = this.description;
            },
            undo() { newHead = -1; renderNodes(); }
        });

        this._initStepController(container, steps);
    },

    _createStepControls(container, totalSteps) {
        const controls = document.createElement('div');
        controls.className = 'step-controls';
        controls.innerHTML = `<button class="btn" id="viz-prev">◀ 이전</button><span class="step-indicator">0 / ${totalSteps - 1}</span><button class="btn" id="viz-next">다음 ▶</button><button class="btn btn-primary" id="viz-auto">▶ 자동 재생</button>`;
        container.appendChild(controls);
        return controls;
    },

    _initStepController(container, steps) {
        const controls = this._createStepControls(container, steps.length);
        let current = 0;
        let autoTimer = null;
        const indicator = controls.querySelector('.step-indicator');
        const prevBtn = controls.querySelector('#viz-prev');
        const nextBtn = controls.querySelector('#viz-next');
        const autoBtn = controls.querySelector('#viz-auto');

        const go = (idx) => {
            if (idx < 0 || idx >= steps.length) return;
            while (current < idx) { current++; steps[current].action(); }
            while (current > idx) { steps[current].undo(); current--; }
            indicator.textContent = `${current} / ${steps.length - 1}`;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === steps.length - 1;
        };

        steps[0].action();
        indicator.textContent = `0 / ${steps.length - 1}`;
        prevBtn.disabled = true;

        prevBtn.addEventListener('click', () => { stopAuto(); go(current - 1); });
        nextBtn.addEventListener('click', () => { stopAuto(); go(current + 1); });
        const stopAuto = () => { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.textContent = '▶ 자동 재생'; } };
        autoBtn.addEventListener('click', () => {
            if (autoTimer) { stopAuto(); return; }
            autoBtn.textContent = '⏸ 일시정지';
            autoTimer = setInterval(() => { if (current >= steps.length - 1) { stopAuto(); return; } go(current + 1); }, 1000);
        });
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
            descriptionHTML: `
                <h3>문제</h3>
                <p>단일 연결 리스트의 head가 주어집니다. 리스트를 <strong>뒤집어서</strong> 반환하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>연결 리스트의 head</p></div>
                    <div><h4>출력</h4><p>뒤집힌 연결 리스트의 head</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[1, 2, 3, 4, 5]</pre></div>
                    <div><strong>출력</strong><pre>[5, 4, 3, 2, 1]</pre></div>
                </div></div>
            `,
            hints: [
                { title: '포인터 3개!', content: '<code>prev</code>, <code>curr</code>, <code>next_node</code> 세 개의 포인터를 사용합니다.' },
                { title: '핵심 동작', content: '매 단계마다: next_node = curr.next → curr.next = prev → prev = curr → curr = next_node' },
                { title: '재귀 버전', content: '<code>reverseList(head.next)</code>를 호출한 뒤, <code>head.next.next = head; head.next = None</code>으로 뒤집습니다.' }
            ],
            inputDefault: 0,
            solve() { return '[5, 4, 3, 2, 1]'; },
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
};`,
                java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
}`
            }
        },
        {
            id: 'lc-21',
            title: 'LeetCode 21 - Merge Two Sorted Lists',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>정렬된 두 연결 리스트 <code>list1</code>, <code>list2</code>가 주어집니다.
                두 리스트를 <strong>하나의 정렬된 리스트</strong>로 합쳐서 반환하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>정렬된 두 연결 리스트</p></div>
                    <div><h4>출력</h4><p>합쳐진 정렬 연결 리스트</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>list1 = [1,2,4], list2 = [1,3,4]</pre></div>
                    <div><strong>출력</strong><pre>[1,1,2,3,4,4]</pre></div>
                </div></div>
            `,
            hints: [
                { title: '더미 노드 활용', content: '<code>dummy = ListNode(0)</code>를 만들고 거기에 하나씩 이어붙입니다. 마지막에 <code>dummy.next</code>를 반환!' },
                { title: '비교하며 연결', content: 'list1.val &le; list2.val이면 list1 노드를 연결, 아니면 list2를 연결. 남은 리스트는 그대로 이어붙이기.' },
                { title: '시간 복잡도', content: 'O(n + m) — 두 리스트를 한 번씩 순회하면 끝!' }
            ],
            inputDefault: 0,
            solve() { return '[1,1,2,3,4,4]'; },
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
};`,
                java: `class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
            else { curr.next = l2; l2 = l2.next; }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}`
            }
        },
        {
            id: 'lc-141',
            title: 'LeetCode 141 - Linked List Cycle',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/linked-list-cycle/',
            descriptionHTML: `
                <h3>문제</h3>
                <p>연결 리스트의 head가 주어집니다. 리스트에 <strong>사이클(순환)</strong>이 있는지 판별하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>연결 리스트의 head</p></div>
                    <div><h4>출력</h4><p>사이클이 있으면 true, 없으면 false</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>[3,2,0,-4], pos = 1</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>
            `,
            hints: [
                { title: '토끼와 거북이!', content: 'slow는 1칸, fast는 2칸씩 이동. 둘이 만나면 사이클! (Floyd\'s Algorithm)' },
                { title: '왜 만날까?', content: '사이클 안에서 fast는 매 턴 slow와의 거리를 1칸씩 줄입니다. 결국 만날 수밖에 없습니다!' },
                { title: '공간 O(1)', content: 'HashSet을 쓰면 O(n) 공간이 필요하지만, 투 포인터는 O(1) 공간만 사용합니다.' }
            ],
            inputDefault: 0,
            solve() { return 'true'; },
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
};`,
                java: `public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`
            }
        },
        {
            id: 'boj-1158',
            title: 'BOJ 1158 - 요세푸스 문제',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/1158',
            descriptionHTML: `
                <h3>문제</h3>
                <p>1번부터 N번까지 사람이 원형으로 앉아 있습니다.
                K번째 사람을 순서대로 제거합니다. 제거되는 순서를 출력하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>N과 K (1 &le; K &le; N &le; 5,000)</p></div>
                    <div><h4>출력</h4><p>요세푸스 순열을 &lt;a, b, c, ...&gt; 형태로 출력</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>7 3</pre></div>
                    <div><strong>출력</strong><pre>&lt;3, 6, 2, 7, 5, 1, 4&gt;</pre></div>
                </div></div>
            `,
            hints: [
                { title: '원형 구조', content: '큐(deque)를 사용하면 원형 구조를 쉽게 시뮬레이션할 수 있습니다!' },
                { title: '핵심 연산', content: 'K-1번 <code>popleft()</code>한 것을 <code>append()</code>로 뒤로 보내고, K번째를 <code>popleft()</code>로 제거!' },
                { title: '출력 형식', content: '결과를 리스트에 모아서 <code>&lt;a, b, c, ...&gt;</code> 형태로 출력하세요.' }
            ],
            inputDefault: 0,
            solve() { return '<3, 6, 2, 7, 5, 1, 4>'; },
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
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, K;
    scanf("%d %d", &N, &K);
    queue<int> q;
    for (int i = 1; i <= N; i++) q.push(i);

    printf("<");
    while (!q.empty()) {
        for (int i = 0; i < K - 1; i++) {
            q.push(q.front());
            q.pop();
        }
        printf("%d", q.front()); q.pop();
        if (!q.empty()) printf(", ");
    }
    printf(">\\n");
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int K = Integer.parseInt(st.nextToken());

        Queue<Integer> q = new LinkedList<>();
        for (int i = 1; i <= N; i++) q.add(i);

        StringBuilder sb = new StringBuilder("<");
        while (!q.isEmpty()) {
            for (int i = 0; i < K - 1; i++) q.add(q.poll());
            sb.append(q.poll());
            if (!q.isEmpty()) sb.append(", ");
        }
        sb.append(">");
        System.out.println(sb);
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
            stageCard.innerHTML = `<div class="stage-header"><span class="stage-num">단계 ${stage.num}</span><h3>${stage.title}</h3><p>${stage.desc}</p></div><div class="stage-problems"></div>`;
            const problemsDiv = stageCard.querySelector('.stage-problems');
            stage.problemIds.forEach(pid => {
                const prob = this.problems.find(p => p.id === pid);
                if (!prob) return;
                const btn = document.createElement('button');
                const diffMap = {gold:'Gold',silver:'Silver',platinum:'Platinum',easy:'Easy',medium:'Medium',hard:'Hard'};
                btn.className = 'problem-card ' + prob.difficulty;
                btn.innerHTML = `<span class="problem-title">${prob.title}</span><span class="problem-diff">${diffMap[prob.difficulty] || prob.difficulty}</span>`;
                btn.addEventListener('click', () => this._renderProblemDetail(container, prob));
                problemsDiv.appendChild(btn);
            });
            stageList.appendChild(stageCard);
        });
        container.appendChild(stageList);
    },

    _renderProblemDetail(container, problem) {
        container.innerHTML = '';
        const backBtn = document.createElement('button');
        backBtn.className = 'btn';
        backBtn.textContent = '← 문제 목록으로';
        backBtn.addEventListener('click', () => this.renderProblem(container));
        container.appendChild(backBtn);

        const isLeetCode = problem.link.includes('leetcode');
        const descDiv = document.createElement('div');
        descDiv.className = 'problem-detail';
        descDiv.innerHTML = `<div class="problem-meta"><a href="${problem.link}" target="_blank" class="btn btn-primary">${isLeetCode ? 'LeetCode에서 풀기 ↗' : 'BOJ에서 풀기 ↗'}</a></div>${problem.descriptionHTML}`;
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
        solveArea.innerHTML = `<div class="editor-header"><h3>풀이 작성</h3><select id="lang-select"><option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select></div><textarea id="code-editor" spellcheck="false" placeholder="여기에 코드를 작성하세요..."></textarea><div class="editor-actions"><button id="run-btn" class="btn btn-primary">▶ 실행</button><button id="check-btn" class="btn btn-success">✓ 정답 확인</button></div><div id="output-area" class="output-area"><div class="output-label">실행 결과</div><pre id="output-text"></pre></div>`;
        container.appendChild(solveArea);
        container.querySelectorAll('pre code').forEach(el => { if (window.hljs) hljs.highlightElement(el); });
        const editor = container.querySelector('#code-editor');
        const langSelect = container.querySelector('#lang-select');
        editor.value = problem.templates.python;
        langSelect.addEventListener('change', () => { editor.value = problem.templates[langSelect.value]; });
        editor.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.value = editor.value.substring(0, s) + '    ' + editor.value.substring(editor.selectionEnd); editor.selectionStart = editor.selectionEnd = s + 4; } });
        container.querySelector('#run-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); this._showOutput(container, `예상 정답:\n${expected}\n\n(코드가 위 결과를 출력하면 정답입니다)`); });
        container.querySelector('#check-btn').addEventListener('click', () => { const expected = problem.solve(problem.inputDefault); const site = isLeetCode ? 'LeetCode' : 'BOJ'; this._showOutput(container, `예상 정답:\n${expected}\n\n💡 코드를 ${site}에 제출하여 정답을 확인하세요!`); });
    },

    _showOutput(container, text, status) {
        const area = container.querySelector('#output-area');
        area.querySelector('#output-text').textContent = text;
        area.className = 'output-area' + (status ? ' ' + status : '');
    }
};

window.AlgoTopics = window.AlgoTopics || {};
window.AlgoTopics.linkedlist = linkedListTopic;
