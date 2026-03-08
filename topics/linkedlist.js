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
            '<option value="python">Python</option><option value="cpp">C++</option><option value="java">Java</option></select>' +
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
                        <p>slow는 1칸, fast는 2칸씩 이동. 만나면 사이클! (Floyd's Algorithm)</p>
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

    // ===== 시각화 =====
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
            '<button class="btn" id="str-prev' + s + '">◀ 이전</button>' +
            '<span id="str-indicator' + s + '" style="font-size:0.9rem;color:var(--text-secondary);min-width:60px;text-align:center;">0 / 0</span>' +
            '<button class="btn" id="str-next' + s + '">다음 ▶</button>' +
            '</div>';
    },

    _initStepController(container, steps, suffix) {
        var s = suffix || '';
        var current = -1;
        var indicator = container.querySelector('#str-indicator' + s);
        var prevBtn = container.querySelector('#str-prev' + s);
        var nextBtn = container.querySelector('#str-next' + s);
        if (!indicator || !prevBtn || !nextBtn) return;
        var total = steps.length;
        var self = this;
        var go = function(idx) {
            if (idx < 0 || idx >= total) return;
            current = idx;
            steps[current].action();
            indicator.textContent = (current + 1) + ' / ' + total;
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        };
        go(0);
        prevBtn.addEventListener('click', function() { go(current - 1); });
        nextBtn.addEventListener('click', function() { go(current + 1); });
        var keyHandler = function(e) {
            if (e.key === 'ArrowLeft') go(current - 1);
            if (e.key === 'ArrowRight') go(current + 1);
        };
        document.addEventListener('keydown', keyHandler);
        self._vizState.keydownHandler = keyHandler;
        self._vizState.steps = steps;
        self._vizState.currentStep = 0;
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
        var values = [1, 2, 3, 4];
        var vizHTML = '<div class="viz-area">' +
            '<div id="ll-nodes-rev" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;min-height:80px;padding:20px 0;"></div>' +
            '<div id="ll-desc-rev" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:12px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-rev');

        var nodesEl = container.querySelector('#ll-nodes-rev');
        var descEl = container.querySelector('#ll-desc-rev');

        // Build simulation states
        var simNodes = values.map(function(v, i) { return { val: v, nextIdx: i < values.length - 1 ? i + 1 : -1 }; });
        var simPrev = -1, simCurr = 0;

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
                html += '<div style="display:flex;align-items:center;">';
                html += self._nodeBox(n.val, labels, cls.trim());
                if (n.nextIdx >= 0) {
                    html += '<span style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">→</span>';
                } else {
                    html += '<span style="font-size:0.85rem;color:var(--text-secondary);margin:0 4px;">→ None</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
        }

        var states = [];
        // Initial state
        states.push({
            nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: -1, currIdx: 0, newHead: -1,
            desc: '초기 상태: 1 → 2 → 3 → 4 → None. prev = None, curr = head(1).'
        });

        // Step through reversal
        for (var step = 0; step < values.length; step++) {
            var sc = simCurr;
            var sp = simPrev;
            var snext = simNodes[sc].nextIdx;
            simNodes[sc].nextIdx = simPrev;
            simPrev = sc;
            simCurr = snext;
            states.push({
                nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: simCurr, newHead: -1,
                desc: 'curr(' + values[sc] + ').next를 prev' + (sp >= 0 ? '(' + values[sp] + ')' : '(None)') + '로 바꿉니다. prev=' + values[sc] + ', curr=' + (snext >= 0 ? values[snext] : 'None') + '으로 이동.'
            });
        }
        states.push({
            nodes: JSON.parse(JSON.stringify(simNodes)), prevIdx: simPrev, currIdx: -1, newHead: simPrev,
            desc: 'curr = None이므로 반복 종료! prev(' + values[simPrev] + ')가 새로운 head입니다. 결과: 4 → 3 → 2 → 1 → None ✓'
        });

        var steps = states.map(function(st) {
            return {
                action: function() {
                    renderNodes(st.nodes, st.prevIdx, st.currIdx, st.newHead);
                    descEl.innerHTML = st.desc;
                }
            };
        });
        self._initStepController(container, steps, '-rev');
    },

    // ── Merge Two Sorted Lists (lc-21) ──
    _renderVizMerge(container) {
        var self = this;
        var list1 = [1, 2, 4];
        var list2 = [1, 3, 4];
        var vizHTML = '<div class="viz-area">' +
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
            '<div id="ll-desc-merge" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:16px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-merge');

        var list1El = container.querySelector('#ll-list1-merge');
        var list2El = container.querySelector('#ll-list2-merge');
        var resultEl = container.querySelector('#ll-result-merge');
        var descEl = container.querySelector('#ll-desc-merge');

        // Build states
        var states = [];
        var i1 = 0, i2 = 0, result = [];
        states.push({ i1: 0, i2: 0, result: [], desc: 'dummy 노드를 만들고 두 리스트를 비교하며 병합합니다.' });

        while (i1 < list1.length && i2 < list2.length) {
            if (list1[i1] <= list2[i2]) {
                result.push(list1[i1]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                    desc: 'list1[' + i1 + ']=' + list1[i1] + ' ≤ list2[' + i2 + ']=' + list2[i2] + ' → list1에서 ' + list1[i1] + '을 연결합니다.' });
                i1++;
            } else {
                result.push(list2[i2]);
                states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                    desc: 'list1[' + i1 + ']=' + list1[i1] + ' > list2[' + i2 + ']=' + list2[i2] + ' → list2에서 ' + list2[i2] + '을 연결합니다.' });
                i2++;
            }
        }
        while (i1 < list1.length) {
            result.push(list1[i1]);
            states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l1',
                desc: 'list2 소진! list1의 나머지 ' + list1[i1] + '을 연결합니다.' });
            i1++;
        }
        while (i2 < list2.length) {
            result.push(list2[i2]);
            states.push({ i1: i1, i2: i2, result: result.slice(), picked: 'l2',
                desc: 'list1 소진! list2의 나머지 ' + list2[i2] + '을 연결합니다.' });
            i2++;
        }
        states.push({ i1: i1, i2: i2, result: result.slice(),
            desc: '병합 완료! 결과: [' + result.join(', ') + '] ✓' });

        var steps = states.map(function(st, sIdx) {
            return {
                action: function() {
                    list1El.innerHTML = list1.map(function(v, i) {
                        var cls = i === st.i1 ? ' comparing' : (i < st.i1 ? ' matched' : '');
                        return '<div class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
                    }).join('');
                    list2El.innerHTML = list2.map(function(v, i) {
                        var cls = i === st.i2 ? ' comparing' : (i < st.i2 ? ' matched' : '');
                        return '<div class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
                    }).join('');
                    resultEl.innerHTML = st.result.map(function(v) {
                        return '<div class="str-char-box matched" style="width:36px;text-align:center;">' + v + '</div>';
                    }).join('');
                    descEl.innerHTML = st.desc;
                }
            };
        });
        self._initStepController(container, steps, '-merge');
    },

    // ── Linked List Cycle (lc-141) ──
    _renderVizCycle(container) {
        var self = this;
        // Nodes: 3→2→0→-4→(back to 2), cycle starts at index 1
        var nodeVals = [3, 2, 0, -4];
        var cycleStart = 1; // index where cycle connects back

        var vizHTML = '<div class="viz-area">' +
            '<div id="ll-nodes-cycle" style="display:flex;align-items:center;gap:0;justify-content:center;flex-wrap:wrap;min-height:80px;padding:20px 0;"></div>' +
            '<div style="text-align:center;color:var(--text-secondary);font-size:0.85rem;margin-top:4px;">↑ 노드 ' + nodeVals[nodeVals.length - 1] + '의 next가 노드 ' + nodeVals[cycleStart] + '을 가리킴 (사이클!)</div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
            '<div style="padding:8px 16px;background:var(--accent)15;border-radius:8px;font-size:0.9rem;">🐢 slow: <span id="ll-slow-val" style="font-weight:700;color:var(--accent);">-</span></div>' +
            '<div style="padding:8px 16px;background:var(--green)15;border-radius:8px;font-size:0.9rem;">🐇 fast: <span id="ll-fast-val" style="font-weight:700;color:var(--green);">-</span></div>' +
            '</div>' +
            '<div id="ll-desc-cycle" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:16px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-cycle');

        var nodesEl = container.querySelector('#ll-nodes-cycle');
        var slowVal = container.querySelector('#ll-slow-val');
        var fastVal = container.querySelector('#ll-fast-val');
        var descEl = container.querySelector('#ll-desc-cycle');

        function renderCycleNodes(slowIdx, fastIdx) {
            var html = '';
            for (var i = 0; i < nodeVals.length; i++) {
                var isSlow = i === slowIdx;
                var isFast = i === fastIdx;
                var cls = (isSlow && isFast) ? ' comparing' : isSlow ? ' matched' : isFast ? ' comparing' : '';
                var labels = [];
                if (isSlow) labels.push('🐢');
                if (isFast) labels.push('🐇');
                html += '<div style="display:flex;align-items:center;">';
                html += self._nodeBox(nodeVals[i], labels, cls.trim());
                if (i < nodeVals.length - 1) {
                    html += '<span style="font-size:1.2rem;color:var(--text-secondary);margin:0 2px;">→</span>';
                } else {
                    html += '<span style="font-size:1.2rem;color:#e17055;margin:0 2px;">→↩</span>';
                }
                html += '</div>';
            }
            nodesEl.innerHTML = html;
            slowVal.textContent = slowIdx >= 0 ? nodeVals[slowIdx] : '-';
            fastVal.textContent = fastIdx >= 0 ? nodeVals[fastIdx] : '-';
        }

        // Simulate Floyd's algorithm with cycle: next of last node = cycleStart
        var states = [];
        var slow = 0, fast = 0;
        states.push({ slow: 0, fast: 0, desc: '초기 상태: slow = fast = head(3). 사이클: -4 → 2.' });

        var maxIter = 20;
        var found = false;
        for (var iter = 0; iter < maxIter; iter++) {
            // slow moves 1 step
            slow = (slow === nodeVals.length - 1) ? cycleStart : slow + 1;
            // fast moves 2 steps
            fast = (fast === nodeVals.length - 1) ? cycleStart : fast + 1;
            fast = (fast === nodeVals.length - 1) ? cycleStart : fast + 1;

            if (slow === fast) {
                states.push({ slow: slow, fast: fast,
                    desc: 'slow=' + nodeVals[slow] + ', fast=' + nodeVals[fast] + ' → 🎉 만났습니다! 사이클 존재 확인!' });
                found = true;
                break;
            } else {
                states.push({ slow: slow, fast: fast,
                    desc: 'slow → ' + nodeVals[slow] + ' (1칸), fast → ' + nodeVals[fast] + ' (2칸). 아직 다릅니다.' });
            }
        }
        if (found) {
            states.push({ slow: slow, fast: fast,
                desc: 'Floyd\'s Algorithm 완료! slow와 fast가 노드 ' + nodeVals[slow] + '에서 만남 → return True ✓' });
        }

        var steps = states.map(function(st) {
            return {
                action: function() {
                    renderCycleNodes(st.slow, st.fast);
                    descEl.innerHTML = st.desc;
                }
            };
        });
        self._initStepController(container, steps, '-cycle');
    },

    // ── 요세푸스 문제 (boj-1158) ──
    _renderVizJosephus(container) {
        var self = this;
        var N = 7, K = 3;

        var vizHTML = '<div class="viz-area">' +
            '<div style="font-weight:600;margin-bottom:8px;color:var(--text);">원형 큐 (N=' + N + ', K=' + K + ')</div>' +
            '<div id="ll-circle-jos" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:50px;padding:12px 0;"></div>' +
            '<div style="display:flex;gap:20px;justify-content:center;margin-top:12px;flex-wrap:wrap;">' +
            '<div style="font-weight:600;color:var(--text-secondary);">제거 순서: <span id="ll-removed-jos" style="color:var(--accent);">-</span></div>' +
            '</div>' +
            '<div id="ll-desc-jos" style="padding:14px;background:var(--bg-secondary);border-radius:8px;margin-top:16px;font-size:0.95rem;min-height:40px;"></div>' +
            '</div>';
        container.innerHTML = vizHTML + self._createStepControls('-jos');

        var circleEl = container.querySelector('#ll-circle-jos');
        var removedEl = container.querySelector('#ll-removed-jos');
        var descEl = container.querySelector('#ll-desc-jos');

        // Build states
        var states = [];
        var queue = [];
        for (var i = 1; i <= N; i++) queue.push(i);
        var removed = [];

        states.push({ queue: queue.slice(), removed: [], pointer: -1, desc: '1부터 ' + N + '까지 원형으로 앉아 있습니다. K=' + K + '번째 사람을 제거합니다.' });

        while (queue.length > 0) {
            // Move K-1 people to back
            for (var j = 0; j < K - 1; j++) {
                var moved = queue.shift();
                queue.push(moved);
                states.push({ queue: queue.slice(), removed: removed.slice(), pointer: queue.length - 1,
                    desc: j + 1 + '번째 이동: ' + moved + '을 뒤로 보냅니다. 큐: [' + queue.join(', ') + ']' });
            }
            // Remove K-th person
            var out = queue.shift();
            removed.push(out);
            states.push({ queue: queue.slice(), removed: removed.slice(), pointer: -1, justRemoved: out,
                desc: K + '번째 사람 ' + out + '을 제거! 제거 순서: <' + removed.join(', ') + '>' });
        }

        states.push({ queue: [], removed: removed.slice(), pointer: -1,
            desc: '완료! 요세푸스 순열: <' + removed.join(', ') + '> ✓' });

        var steps = states.map(function(st) {
            return {
                action: function() {
                    circleEl.innerHTML = st.queue.map(function(v, i) {
                        var cls = i === st.pointer ? ' comparing' : '';
                        return '<div class="str-char-box' + cls + '" style="width:36px;text-align:center;">' + v + '</div>';
                    }).join('') || '<span style="color:var(--text-secondary);">빈 큐</span>';
                    removedEl.textContent = st.removed.length > 0 ? '<' + st.removed.join(', ') + '>' : '-';
                    descEl.innerHTML = st.desc;
                }
            };
        });
        self._initStepController(container, steps, '-jos');
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
            },
            solutions: [{
                approach: '포인터 3개 반복',
                description: 'prev, curr, next 포인터로 한 칸씩 이동하며 방향을 뒤집습니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[0].templates; },
                codeSteps: {
                    python: [
                        { title: '초기화', code: 'def reverseList(self, head):\n    prev = None\n    curr = head' },
                        { title: '반복 순회', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:' },
                        { title: '방향 전환 + 이동', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next  # 다음 노드 저장\n        curr.next = prev       # 방향 전환!\n        prev = curr            # prev 이동\n        curr = next_node       # curr 이동' },
                        { title: '새 head 반환', code: 'def reverseList(self, head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev  # prev가 새로운 head' }
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
            },
            solutions: [{
                approach: '더미 노드 병합',
                description: 'dummy 노드를 만들고 두 리스트에서 더 작은 값을 순서대로 연결합니다.',
                timeComplexity: 'O(n + m)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[1].templates; },
                codeSteps: {
                    python: [
                        { title: '더미 노드 생성', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy' },
                        { title: '비교 반복', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:' },
                        { title: '작은 값 연결', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next' },
                        { title: '나머지 연결 + 반환', code: 'def mergeTwoLists(self, list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n\n    curr.next = list1 or list2\n    return dummy.next' }
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
            },
            solutions: [{
                approach: 'Floyd 순환 탐지',
                description: 'slow(1칸)와 fast(2칸)가 사이클 안에서 만나는지 확인합니다.',
                timeComplexity: 'O(n)',
                spaceComplexity: 'O(1)',
                get templates() { return linkedListTopic.problems[2].templates; },
                codeSteps: {
                    python: [
                        { title: '두 포인터 초기화', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head' },
                        { title: 'fast가 끝에 도달할 때까지 반복', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:' },
                        { title: '이동 + 비교', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next        # 1칸\n        fast = fast.next.next   # 2칸\n        if slow == fast:\n            return True  # 만남!' },
                        { title: '사이클 없음 반환', code: 'def hasCycle(self, head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False  # fast가 끝에 도달' }
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
            },
            solutions: [{
                approach: '큐 시뮬레이션',
                description: 'deque로 원형 구조를 시뮬레이션하여 K번째 사람을 순서대로 제거합니다.',
                timeComplexity: 'O(NK)',
                spaceComplexity: 'O(N)',
                get templates() { return linkedListTopic.problems[3].templates; },
                codeSteps: {
                    python: [
                        { title: '큐 초기화', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []' },
                        { title: 'K-1명 뒤로 보내기', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())  # 뒤로 보내기' },
                        { title: 'K번째 사람 제거', code: 'from collections import deque\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())  # K번째 제거!' },
                        { title: '결과 출력', code: 'from collections import deque\nimport sys\ninput = sys.stdin.readline\n\nN, K = map(int, input().split())\nq = deque(range(1, N + 1))\nresult = []\n\nwhile q:\n    for _ in range(K - 1):\n        q.append(q.popleft())\n    result.append(q.popleft())\n\nprint(\'<\' + \', \'.join(map(str, result)) + \'>\')' }
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
