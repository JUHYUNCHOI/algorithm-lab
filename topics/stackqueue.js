// =========================================================
// 스택과 큐 (Stack & Queue) 토픽 모듈
// =========================================================
const stackQueueTopic = {
    id: 'stackqueue',
    title: '스택과 큐',
    icon: '📦',
    category: '자료구조 활용',
    order: 4,
    description: 'LIFO 스택과 FIFO 큐의 원리, 괄호 검증, 덱 활용',
    relatedNote: '이 외에도 모노톤 스택, 후위 표기식 변환, 슬라이딩 윈도우 최대값(덱) 등이 스택/큐 문제에 자주 출제됩니다.',

    // ===== 개념 설명 탭 =====
    renderConcept(container) {
        container.innerHTML = `
            <div class="hero">
                <h2>📦 스택과 큐 (Stack & Queue)</h2>
                <p class="hero-sub">데이터를 넣고 빼는 두 가지 규칙을 배워봅시다!</p>
            </div>

            <!-- 섹션 1: 스택 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">1</span> 스택 (Stack)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 스택은 <em>"접시 쌓기"</em>입니다!
                    접시를 위에서 쌓고(push), 위에서만 꺼냅니다(pop).
                    가장 나중에 올린 접시를 가장 먼저 꺼내죠. 이것이 <strong>LIFO</strong>(Last In, First Out)입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--accent)">push</text></svg></div>
                        <h3>push(x)</h3>
                        <p>스택 맨 위에 원소 x를 넣습니다. Python에서는 <code>append()</code>, C++은 <code>push()</code>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--red, #e17055)">pop</text></svg></div>
                        <h3>pop()</h3>
                        <p>스택 맨 위 원소를 꺼내고 반환합니다. 비어있으면 에러! <code>O(1)</code> 연산입니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">peek</text></svg></div>
                        <h3>peek / top</h3>
                        <p>꺼내지 않고 맨 위 원소를 확인합니다. Python에서는 <code>stack[-1]</code>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--yellow)">LIFO</text></svg></div>
                        <h3>활용 예시</h3>
                        <p>괄호 검증, 뒤로가기 기능, 재귀 호출 스택, DFS 구현에 쓰입니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python"># 스택 기본 사용 (Python은 리스트가 스택!)
stack = []
stack.append(1)   # push → [1]
stack.append(2)   # push → [1, 2]
stack.append(3)   # push → [1, 2, 3]
top = stack[-1]   # peek → 3
val = stack.pop() # pop  → 3, stack = [1, 2]
print(len(stack)) # size → 2</code></pre>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 웹 브라우저의 "뒤로가기" 버튼은 어떤 자료구조를 쓸까요?
                    방문한 페이지를 스택에 쌓고, 뒤로가기를 누르면 pop!
                </div>
            </div>

            <!-- 섹션 2: 큐 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">2</span> 큐 (Queue)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 큐는 <em>"편의점 줄 서기"</em>입니다!
                    먼저 줄 선 사람이 먼저 계산합니다. 뒤에서 들어가고(enqueue), 앞에서 나옵니다(dequeue).
                    이것이 <strong>FIFO</strong>(First In, First Out)입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--accent)">enqueue</text></svg></div>
                        <h3>enqueue(x)</h3>
                        <p>큐의 뒤쪽에 원소를 넣습니다. <code>append()</code>와 동일.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="11" font-weight="bold" fill="var(--red, #e17055)">dequeue</text></svg></div>
                        <h3>dequeue()</h3>
                        <p>큐의 앞쪽에서 원소를 꺼냅니다. Python <code>deque</code>의 <code>popleft()</code>.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="4" y="24" font-size="12" font-weight="bold" fill="var(--green)">FIFO</text></svg></div>
                        <h3>활용 예시</h3>
                        <p>BFS 탐색, 프린터 큐, 프로세스 스케줄링에 쓰입니다.</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python">from collections import deque

q = deque()
q.append(1)     # enqueue → [1]
q.append(2)     # enqueue → [1, 2]
q.append(3)     # enqueue → [1, 2, 3]
val = q.popleft()  # dequeue → 1, q = [2, 3]
front = q[0]       # peek   → 2

# ⚠️ list의 pop(0)은 O(n)이라 느립니다!
# deque의 popleft()는 O(1)이므로 반드시 deque를 쓰세요.</code></pre>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> Python에서 <code>list.pop(0)</code>이 느린 이유는?
                    맨 앞 원소를 빼면 나머지 원소를 한 칸씩 앞으로 밀어야 하기 때문입니다 → O(n)!
                </div>
            </div>

            <!-- 섹션 3: 덱 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">3</span> 덱 (Deque, Double-Ended Queue)</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 덱은 <em>"양쪽 문이 있는 터널"</em>입니다!
                    앞에서도 넣고 뺄 수 있고, 뒤에서도 넣고 뺄 수 있습니다.
                    스택과 큐를 모두 대체할 수 있는 <strong>만능 자료구조</strong>입니다.
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--accent)">←append→</text></svg></div>
                        <h3>양방향 삽입</h3>
                        <p><code>appendleft(x)</code>: 앞에 추가, <code>append(x)</code>: 뒤에 추가. 모두 O(1)!</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="2" y="24" font-size="10" font-weight="bold" fill="var(--red, #e17055)">←pop→</text></svg></div>
                        <h3>양방향 삭제</h3>
                        <p><code>popleft()</code>: 앞에서 제거, <code>pop()</code>: 뒤에서 제거. 모두 O(1)!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python">from collections import deque

dq = deque([1, 2, 3])
dq.appendleft(0)  # [0, 1, 2, 3]
dq.append(4)      # [0, 1, 2, 3, 4]
dq.popleft()       # 0,  dq = [1, 2, 3, 4]
dq.pop()           # 4,  dq = [1, 2, 3]

# 덱은 슬라이딩 윈도우 최대/최소에도 활용!
# maxlen을 지정하면 자동으로 오래된 원소가 빠집니다.
dq = deque(maxlen=3)
dq.append(1); dq.append(2); dq.append(3)  # [1, 2, 3]
dq.append(4)  # [2, 3, 4] ← 1이 자동으로 빠짐!</code></pre>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> "스택을 구현하세요"라는 문제가 나오면?
                    Python에서는 그냥 리스트를 쓰면 됩니다! <code>append()</code>와 <code>pop()</code>이 O(1)이니까요.
                    큐를 구현할 때만 <code>deque</code>를 쓰면 됩니다.
                </div>
            </div>

            <!-- 섹션 4: 괄호 검증 패턴 -->
            <div class="concept-section">
                <div class="concept-section-title"><span class="section-num">4</span> 스택 핵심 패턴: 괄호 검증</div>
                <div class="analogy-box">
                    <strong>비유로 이해하기:</strong> 괄호 검증은 <em>"짝꿍 찾기 게임"</em>입니다!
                    여는 괄호가 나오면 스택에 넣고, 닫는 괄호가 나오면 스택에서 짝꿍을 꺼내서 맞는지 확인합니다.
                    끝났을 때 스택이 비어있으면 모든 괄호가 짝이 맞는 것입니다!
                </div>
                <div class="concept-grid" style="grid-template-columns: repeat(3, 1fr);">
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--accent)">(</text></svg></div>
                        <h3>Step 1</h3>
                        <p>여는 괄호 <code>( [ {</code>를 만나면 스택에 push합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--red, #e17055)">)</text></svg></div>
                        <h3>Step 2</h3>
                        <p>닫는 괄호를 만나면 스택에서 pop해서 <strong>짝이 맞는지</strong> 확인합니다.</p>
                    </div>
                    <div class="concept-card">
                        <div class="card-icon"><svg width="38" height="38" viewBox="0 0 38 38"><text x="6" y="28" font-size="20" fill="var(--green)">✓</text></svg></div>
                        <h3>Step 3</h3>
                        <p>끝까지 확인 후 스택이 <strong>비어있으면</strong> 유효한 괄호입니다!</p>
                    </div>
                </div>
                <div class="code-block">
                    <pre><code class="language-python">def is_valid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for c in s:
        if c in '([{':
            stack.append(c)     # 여는 괄호 → push
        elif c in ')]}':
            if not stack or stack[-1] != pairs[c]:
                return False    # 짝이 안 맞음!
            stack.pop()         # 짝이 맞으면 pop

    return len(stack) == 0  # 남은 괄호가 없어야 함

print(is_valid("([{}])"))   # True
print(is_valid("([)]"))     # False</code></pre>
                </div>
                <div class="think-box">
                    <strong>💡 생각해보기:</strong> 괄호 문제는 스택의 가장 대표적인 응용입니다.
                    이 패턴이 익숙해지면, "최근에 열린 것과 먼저 짝짓기"가 필요한 모든 문제에 스택을 떠올릴 수 있습니다!
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
            <h3>스택 Push & Pop 시각화</h3>
            <p>스택에 원소를 넣고(push) 빼는(pop) 과정을 단계별로 살펴봅시다.</p>
            <div class="sq-viz-container" style="display:flex; gap:30px; align-items:flex-start; flex-wrap:wrap; justify-content:center;">
                <div class="sq-stack-visual" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
                    <div class="sq-stack-label" style="font-weight:600; color:var(--text);">스택</div>
                    <div class="sq-stack-box" style="display:flex; flex-direction:column-reverse; gap:4px; min-height:220px; width:120px; border:2px solid var(--border); border-top:none; border-radius:0 0 8px 8px; padding:8px; background:var(--bg-secondary);"></div>
                </div>
                <div class="sq-info-panel" style="flex:1; min-width:220px; max-width:400px;">
                    <div class="sq-step-desc" style="padding:14px; background:var(--bg-secondary); border-radius:8px; margin-bottom:12px; min-height:60px; font-size:0.95rem;"></div>
                    <div class="sq-output-section">
                        <div style="font-weight:600; margin-bottom:6px; color:var(--text-secondary);">Pop된 값들:</div>
                        <div class="sq-popped" style="display:flex; gap:6px; flex-wrap:wrap; min-height:36px;"></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(vizArea);

        const stackBox = vizArea.querySelector('.sq-stack-box');
        const descEl = vizArea.querySelector('.sq-step-desc');
        const poppedEl = vizArea.querySelector('.sq-popped');

        const operations = [
            { op: 'push', val: 'A' },
            { op: 'push', val: 'B' },
            { op: 'push', val: 'C' },
            { op: 'push', val: 'D' },
            { op: 'pop' },
            { op: 'pop' },
            { op: 'push', val: 'E' },
            { op: 'pop' },
            { op: 'pop' },
            { op: 'pop' },
        ];

        const steps = [];
        let currentStack = [];
        let popped = [];

        // 초기 상태
        steps.push({
            description: '빈 스택에서 시작합니다. push와 pop 연산을 관찰해봅시다!',
            action() {
                stackBox.innerHTML = '<div style="color:var(--text-secondary); font-size:0.85rem; text-align:center; padding:20px 0;">(비어있음)</div>';
                descEl.textContent = this.description;
                poppedEl.innerHTML = '';
            },
            undo() {}
        });

        operations.forEach((operation, i) => {
            if (operation.op === 'push') {
                steps.push({
                    description: `push("${operation.val}") — "${operation.val}"를 스택 맨 위에 넣습니다.`,
                    action() {
                        currentStack.push(operation.val);
                        _renderStack();
                        descEl.innerHTML = this.description;
                        // highlight top
                        const items = stackBox.querySelectorAll('.sq-item');
                        if (items.length > 0) items[items.length - 1].classList.add('sq-highlight');
                    },
                    undo() {
                        currentStack.pop();
                        _renderStack();
                    }
                });
            } else {
                const expectedVal = [...currentStack]; // snapshot
                const valToPop = currentStack.length > 0 ? currentStack[currentStack.length - 1] : '?';
                steps.push({
                    description: `pop() → "${valToPop}" — 스택 맨 위 "${valToPop}"를 꺼냅니다.`,
                    action() {
                        if (currentStack.length > 0) {
                            const v = currentStack.pop();
                            popped.push(v);
                        }
                        _renderStack();
                        _renderPopped();
                        descEl.innerHTML = this.description;
                    },
                    undo() {
                        if (popped.length > 0) {
                            const v = popped.pop();
                            currentStack.push(v);
                        }
                        _renderStack();
                        _renderPopped();
                    }
                });
                // simulate for future steps
                currentStack.push(valToPop); // will be popped by action
            }
            // actually update simulation state for future push/pop description
            if (operation.op === 'push') {
                // already handled above
            } else {
                // pop from simulated stack
            }
        });

        // Fix: rebuild simulation properly
        currentStack = [];
        popped = [];
        let simStack = [];
        const rebuiltSteps = [steps[0]];
        operations.forEach((operation) => {
            if (operation.op === 'push') {
                simStack.push(operation.val);
                const val = operation.val;
                rebuiltSteps.push({
                    description: `push("${val}") — "${val}"를 스택 맨 위에 넣습니다.`,
                    action() {
                        currentStack.push(val);
                        _renderStack();
                        descEl.innerHTML = this.description;
                        const items = stackBox.querySelectorAll('.sq-item');
                        if (items.length > 0) items[items.length - 1].classList.add('sq-highlight');
                    },
                    undo() {
                        currentStack.pop();
                        _renderStack();
                    }
                });
            } else {
                const valToPop = simStack.length > 0 ? simStack[simStack.length - 1] : '?';
                simStack.pop();
                rebuiltSteps.push({
                    description: `pop() → "${valToPop}" — 스택 맨 위 "${valToPop}"를 꺼냅니다. (LIFO!)`,
                    action() {
                        if (currentStack.length > 0) {
                            const v = currentStack.pop();
                            popped.push(v);
                        }
                        _renderStack();
                        _renderPopped();
                        descEl.innerHTML = this.description;
                    },
                    undo() {
                        if (popped.length > 0) {
                            const v = popped.pop();
                            currentStack.push(v);
                        }
                        _renderStack();
                        _renderPopped();
                    }
                });
            }
        });

        // 완료 스텝
        rebuiltSteps.push({
            description: '모든 연산이 끝났습니다! 스택이 비었고, 꺼낸 순서는 넣은 순서의 역순(LIFO)입니다.',
            action() {
                descEl.innerHTML = this.description;
            },
            undo() {}
        });

        function _renderStack() {
            if (currentStack.length === 0) {
                stackBox.innerHTML = '<div style="color:var(--text-secondary); font-size:0.85rem; text-align:center; padding:20px 0;">(비어있음)</div>';
                return;
            }
            stackBox.innerHTML = currentStack.map((v, i) =>
                `<div class="sq-item str-char-box${i === currentStack.length - 1 ? ' comparing' : ''}" style="text-align:center; font-weight:600; font-size:1.1rem;">${v}${i === currentStack.length - 1 ? ' ← top' : ''}</div>`
            ).join('');
        }

        function _renderPopped() {
            poppedEl.innerHTML = popped.map(v =>
                `<div class="str-char-box matched" style="font-weight:600;">${v}</div>`
            ).join('');
        }

        this._initStepController(container, rebuiltSteps);
    },

    _createStepControls(container, totalSteps) {
        const controls = document.createElement('div');
        controls.className = 'step-controls';
        controls.innerHTML = `
            <button class="btn" id="viz-prev">◀ 이전</button>
            <span class="step-indicator">0 / ${totalSteps - 1}</span>
            <button class="btn" id="viz-next">다음 ▶</button>
            <button class="btn btn-primary" id="viz-auto">▶ 자동 재생</button>
        `;
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

        const stopAuto = () => {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; autoBtn.textContent = '▶ 자동 재생'; }
        };
        autoBtn.addEventListener('click', () => {
            if (autoTimer) { stopAuto(); return; }
            autoBtn.textContent = '⏸ 일시정지';
            autoTimer = setInterval(() => {
                if (current >= steps.length - 1) { stopAuto(); return; }
                go(current + 1);
            }, 900);
        });
    },

    // ===== 문제 탭 =====
    stages: [
        { num: 1, title: '기본 스택·큐 다루기', desc: '스택과 큐의 기본 연산과 괄호 검증 (Silver~Easy)', problemIds: ['boj-10773', 'lc-20'] },
        { num: 2, title: '스택·큐 응용', desc: '덱 활용과 단조 스택 (Silver~Medium)', problemIds: ['boj-2164', 'lc-155'] }
    ],

    problems: [
        {
            id: 'boj-10773',
            title: 'BOJ 10773 - 제로',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/10773',
            descriptionHTML: `
                <h3>문제</h3>
                <p>재현이가 수를 부릅니다. 0이 불리면 <strong>가장 최근에 쓴 수를 지웁니다</strong>.
                남은 수들의 합을 구하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>첫째 줄: K (1 &le; K &le; 100,000)<br>다음 K줄: 정수 (0이면 지우기)</p></div>
                    <div><h4>출력</h4><p>남은 수들의 합</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>4\n3\n0\n4\n0</pre></div>
                    <div><strong>출력</strong><pre>0</pre></div>
                </div></div>
            `,
            hints: [
                { title: '어떤 자료구조?', content: '"가장 최근에 쓴 수를 지운다" → <strong>스택</strong>! 0이 나오면 pop, 아니면 push.' },
                { title: '핵심 아이디어', content: '0이 아닌 수는 <code>stack.append(x)</code>, 0이면 <code>stack.pop()</code>. 마지막에 <code>sum(stack)</code>.' },
                { title: '주의사항', content: '0이 나올 때 스택이 비어있지 않음이 보장됩니다 (문제 조건). 그래서 별도 체크 불필요!' }
            ],
            inputDefault: 0,
            solve() { return '0'; },
            templates: {
                python: `import sys
input = sys.stdin.readline

K = int(input())
stack = []

for _ in range(K):
    n = int(input())
    if n == 0:
        stack.pop()
    else:
        stack.append(n)

print(sum(stack))`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int K, n;
    scanf("%d", &K);
    stack<int> st;

    while (K--) {
        scanf("%d", &n);
        if (n == 0) st.pop();
        else st.push(n);
    }

    long long sum = 0;
    while (!st.empty()) { sum += st.top(); st.pop(); }
    printf("%lld\\n", sum);
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int K = Integer.parseInt(br.readLine().trim());
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < K; i++) {
            int n = Integer.parseInt(br.readLine().trim());
            if (n == 0) stack.pop();
            else stack.push(n);
        }

        long sum = 0;
        for (int v : stack) sum += v;
        System.out.println(sum);
    }
}`
            }
        },
        {
            id: 'lc-20',
            title: 'LeetCode 20 - Valid Parentheses',
            difficulty: 'easy',
            link: 'https://leetcode.com/problems/valid-parentheses/',
            descriptionHTML: `
                <h3>문제</h3>
                <p><code>( ) [ ] { }</code>로만 이루어진 문자열이 주어집니다.
                괄호가 올바르게 짝지어져 있는지 판별하세요.</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>문자열 s (1 &le; len &le; 10,000)</p></div>
                    <div><h4>출력</h4><p>올바르면 true, 아니면 false</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>"([{}])"</pre></div>
                    <div><strong>출력</strong><pre>true</pre></div>
                </div></div>
            `,
            hints: [
                { title: '스택으로 풀기!', content: '여는 괄호 <code>( [ {</code>는 스택에 push, 닫는 괄호는 스택에서 pop하여 짝이 맞는지 확인합니다.' },
                { title: '짝 매칭', content: '<code>pairs = {")" : "(", "]" : "[", "}" : "{"}</code>로 딕셔너리를 만들면 편합니다.' },
                { title: '예외 처리', content: '닫는 괄호인데 스택이 비어있으면? → False. 끝까지 봤는데 스택에 남아있으면? → False.' }
            ],
            inputDefault: 0,
            solve() { return 'true'; },
            templates: {
                python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        pairs = {')': '(', ']': '[', '}': '{'}

        for c in s:
            if c in '([{':
                stack.append(c)
            elif c in ')]}':
                if not stack or stack[-1] != pairs[c]:
                    return False
                stack.pop()

        return len(stack) == 0`,
                cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};

        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
                java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty() || stack.peek() != pairs.get(c)) return false;
                stack.pop();
            }
        }
        return stack.isEmpty();
    }
}`
            }
        },
        {
            id: 'boj-2164',
            title: 'BOJ 2164 - 카드2',
            difficulty: 'silver',
            link: 'https://www.acmicpc.net/problem/2164',
            descriptionHTML: `
                <h3>문제</h3>
                <p>1부터 N까지 번호가 붙은 카드가 위에서부터 순서대로 놓여 있습니다.
                맨 위 카드를 <strong>버리고</strong>, 그 다음 맨 위 카드를 <strong>맨 아래로</strong>옮깁니다.
                이 동작을 반복해서 카드가 1장 남을 때까지 진행하면, 남는 카드는?</p>
                <div class="problem-io">
                    <div><h4>입력</h4><p>정수 N (1 &le; N &le; 500,000)</p></div>
                    <div><h4>출력</h4><p>마지막 남는 카드 번호</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>6</pre></div>
                    <div><strong>출력</strong><pre>4</pre></div>
                </div></div>
            `,
            hints: [
                { title: '어떤 자료구조?', content: '"맨 위에서 빼고, 맨 아래로 넣기" → <strong>큐(Queue)</strong>! FIFO 구조가 딱 맞습니다.' },
                { title: '핵심 연산', content: '<code>popleft()</code>로 맨 위 카드를 버리고, 다시 <code>popleft()</code>한 카드를 <code>append()</code>로 맨 아래에 넣습니다.' },
                { title: '⚠️ deque 필수!', content: '<code>list.pop(0)</code>은 O(n)이라 N이 50만이면 시간 초과! <code>collections.deque</code>를 반드시 쓰세요.' }
            ],
            inputDefault: 0,
            solve() { return '4'; },
            templates: {
                python: `from collections import deque
import sys
input = sys.stdin.readline

N = int(input())
q = deque(range(1, N + 1))

while len(q) > 1:
    q.popleft()          # 맨 위 카드 버리기
    q.append(q.popleft()) # 다음 카드를 맨 아래로

print(q[0])`,
                cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int N;
    scanf("%d", &N);
    queue<int> q;
    for (int i = 1; i <= N; i++) q.push(i);

    while (q.size() > 1) {
        q.pop();             // 맨 위 버리기
        q.push(q.front());   // 다음 카드를 맨 아래로
        q.pop();
    }
    printf("%d\\n", q.front());
}`,
                java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int N = Integer.parseInt(br.readLine().trim());
        Queue<Integer> q = new LinkedList<>();
        for (int i = 1; i <= N; i++) q.add(i);

        while (q.size() > 1) {
            q.poll();           // 맨 위 버리기
            q.add(q.poll());    // 다음 카드를 맨 아래로
        }
        System.out.println(q.peek());
    }
}`
            }
        },
        {
            id: 'lc-155',
            title: 'LeetCode 155 - Min Stack',
            difficulty: 'medium',
            link: 'https://leetcode.com/problems/min-stack/',
            descriptionHTML: `
                <h3>문제</h3>
                <p><code>push</code>, <code>pop</code>, <code>top</code> 연산에 더해
                <strong>현재 최솟값</strong>을 O(1)에 반환하는 <code>getMin()</code>을 지원하는 스택을 구현하세요.</p>
                <div class="problem-io">
                    <div><h4>연산</h4>
                    <p><code>push(val)</code>, <code>pop()</code>, <code>top()</code>, <code>getMin()</code></p></div>
                    <div><h4>조건</h4>
                    <p>모든 연산이 O(1) 시간에 동작해야 합니다!</p></div>
                </div>
                <div class="problem-example"><h4>예제</h4><div class="example-grid">
                    <div><strong>입력</strong><pre>push(-2), push(0), push(-3)
getMin() → -3
pop()
top() → 0
getMin() → -2</pre></div>
                    <div><strong>출력</strong><pre>-3, 0, -2</pre></div>
                </div></div>
            `,
            hints: [
                { title: '핵심 문제', content: '일반 스택은 min을 O(n)에 구합니다. pop할 때 최솟값이 바뀔 수 있어서, 단순히 min 변수 하나로는 안 됩니다!' },
                { title: '보조 스택 아이디어', content: '<strong>min_stack</strong>이라는 보조 스택을 하나 더 만듭니다. 원소를 push할 때마다 "현재까지의 최솟값"을 min_stack에도 push!' },
                { title: '구현', content: '<code>push(x)</code>: main_stack.push(x), min_stack.push(min(x, min_stack[-1]))<br><code>pop()</code>: 둘 다 pop<br><code>getMin()</code>: min_stack[-1]' }
            ],
            inputDefault: 0,
            solve() { return '-3, 0, -2'; },
            templates: {
                python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []  # 보조 스택: 각 시점의 최솟값

    def push(self, val: int) -> None:
        self.stack.append(val)
        # min_stack이 비어있거나, 새 값이 더 작으면 갱신
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
        else:
            self.min_stack.append(self.min_stack[-1])

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
                cpp: `class MinStack {
    stack<int> st, minSt;
public:
    MinStack() {}

    void push(int val) {
        st.push(val);
        if (minSt.empty() || val <= minSt.top())
            minSt.push(val);
        else
            minSt.push(minSt.top());
    }

    void pop() {
        st.pop();
        minSt.pop();
    }

    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};`,
                java: `class MinStack {
    Stack<Integer> stack = new Stack<>();
    Stack<Integer> minStack = new Stack<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek())
            minStack.push(val);
        else
            minStack.push(minStack.peek());
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
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
window.AlgoTopics.stackqueue = stackQueueTopic;
